# Sunny Scholars AI Learning Assistant

A ChatGPT-style AI assistant for the Sunny Scholars Learning Kit, built with Next.js (App Router), TypeScript, Tailwind CSS, and the OpenAI Responses API.

## What this is

This is its own standalone Next.js project (separate GitHub repo, separate deployment) from the Sunny Scholars landing page (`index.html`), which is a static site. This app runs independently because it needs a Node server to keep your OpenAI key secret (a static site can't do that safely).

## Setup

```bash
cd assistant
npm install
cp .env.local.example .env.local
```

Open `.env.local` and paste your real OpenAI key:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

`.env.local` is gitignored — it will never be committed or pushed.

Then run it locally:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Deploying

This app needs a Node-capable host (it has a server API route) — **not** the same static hosting as the landing page. Deploy it to Vercel (or Netlify): import this repo, set `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) as environment variables in the dashboard — never in code — and it'll be live at the domain/subdomain your host gives you (e.g. `your-project.vercel.app`).

If you later want it reachable at `sunnyscholarslearning.com/assistant` instead of its own subdomain, set `basePath: "/assistant"` in `next.config.js` and `BASE_PATH = "/assistant"` in `lib/config.ts`, then add a rewrite/proxy rule on your main domain forwarding `/assistant/*` to this app's deployment URL.

## How it works

- **Conversations** are saved to the browser's `localStorage` (per device/browser, no database needed). Rename, delete, and export to Markdown from the sidebar.
- **Streaming** responses come from `app/api/chat/route.ts`, which calls `OpenAI.responses.create({ stream: true })` server-side and pipes the text deltas straight to the browser — the API key never reaches the client.
- **Age adaptation**: `lib/age.ts` scans each parent message for phrases like "my child is 4" or "she's 5 years old" and stores the detected age on the conversation; `lib/systemPrompt.ts` folds that into the system instructions for every subsequent answer in that chat.
- **Rate limiting** is a simple in-memory per-IP limiter (`lib/rateLimit.ts`) — fine for a single instance. If you scale to multiple server instances, swap it for a shared store (e.g. Upstash Redis) behind the same function signature.

## Tech stack

- Next.js 14 (App Router, Node runtime for the API route)
- TypeScript, strict mode
- Tailwind CSS (custom Sunny Scholars palette: sky blue, mint, soft yellow, light coral)
- `react-markdown` + `remark-gfm` for streamed Markdown rendering (lists, tables, bold, code blocks)
- OpenAI SDK (`openai` npm package), Responses API
# assitent
