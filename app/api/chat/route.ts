import OpenAI from "openai";
import { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: IncomingMessage[];
  childAge: number | null;
}

function getClientId(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "anonymous";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "The assistant is not configured yet. Add OPENAI_API_KEY to your environment variables (see .env.local.example).",
      },
      { status: 500 }
    );
  }

  const clientId = getClientId(req);
  if (isRateLimited(clientId)) {
    return Response.json(
      { error: "You're sending messages a little too fast. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  const messages = body.messages
    .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-30) // keep the request bounded to a reasonable context window
    .map((m) => ({ role: m.role, content: m.content }));

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const instructions = buildSystemPrompt(body.childAge ?? null);

  const encoder = new TextEncoder();

  let openaiStream: Awaited<ReturnType<typeof client.responses.create>>;
  try {
    openaiStream = await client.responses.create({
      model,
      instructions,
      input: messages,
      stream: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.toLowerCase().includes("rate limit") ? 429 : 502;
    return Response.json(
      { error: `The AI service couldn't be reached right now (${message}). Please try again.` },
      { status }
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of openaiStream) {
          if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            controller.enqueue(encoder.encode(event.delta));
          }
          if (event.type === "response.failed" || event.type === "error") {
            controller.enqueue(
              encoder.encode("\n\n_Sorry, something interrupted my response. Please try again._")
            );
            break;
          }
        }
      } catch {
        controller.enqueue(
          encoder.encode("\n\n_Sorry, something interrupted my response. Please try again._")
        );
      } finally {
        controller.close();
      }
    },
    cancel() {
      // The client stopped generation — nothing further to clean up since
      // the OpenAI SDK stream will be garbage collected.
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
