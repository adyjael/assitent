"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/lib/types";
import { CheckIcon, CopyIcon, PencilIcon, RefreshIcon, SparkleIcon } from "./icons";

interface MessageBubbleProps {
  message: Message;
  isLastAssistantMessage: boolean;
  isStreaming: boolean;
  onEdit: (id: string, newContent: string) => void;
  onRegenerate: () => void;
  onRetry: (id: string) => void;
}

export function MessageBubble({
  message,
  isLastAssistantMessage,
  isStreaming,
  onEdit,
  onRegenerate,
  onRetry,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const isUser = message.role === "user";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }

  function saveEdit() {
    if (draft.trim() && draft.trim() !== message.content) {
      onEdit(message.id, draft.trim());
    }
    setIsEditing(false);
  }

  if (isUser) {
    return (
      <div className="group flex animate-fade-in-up justify-end gap-2 px-4">
        <div className="flex max-w-[85%] flex-col items-end gap-1 md:max-w-[70%]">
          {isEditing ? (
            <div className="w-full">
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-2xl border border-sky-300 bg-white p-3 text-sm text-ink-800 outline-none dark:bg-ink-900 dark:text-ink-100"
              />
              <div className="mt-1.5 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setDraft(message.content);
                    setIsEditing(false);
                  }}
                  className="rounded-lg px-3 py-1 text-xs font-medium text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="rounded-lg bg-sky-500 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-600"
                >
                  Save &amp; submit
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-sky-400 to-sky-500 px-4 py-2.5 text-[14.5px] text-white shadow-soft">
                {message.content}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-ink-400 opacity-0 transition-opacity hover:text-ink-600 group-hover:opacity-100 dark:hover:text-ink-300"
              >
                <PencilIcon className="h-3 w-3" /> Edit
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const showTypingDots = isStreaming && message.content.length === 0;

  return (
    <div className="group flex animate-fade-in-up justify-start gap-3 px-4">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-mint-400 text-white shadow-sm">
        <SparkleIcon className="h-4 w-4" />
      </div>
      <div className="flex max-w-[85%] flex-col gap-1 md:max-w-[75%]">
        <div
          className={`rounded-2xl rounded-tl-sm px-4 py-2.5 text-[14.5px] shadow-soft ${
            message.error
              ? "border border-coral-200 bg-coral-50 text-coral-600 dark:border-coral-500/30 dark:bg-coral-500/10 dark:text-coral-300"
              : "bg-white text-ink-800 dark:bg-ink-800 dark:text-ink-100"
          }`}
        >
          {showTypingDots ? (
            <span className="flex items-center gap-1 py-1">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-ink-400" />
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-ink-400" style={{ animationDelay: "0.2s" }} />
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-ink-400" style={{ animationDelay: "0.4s" }} />
            </span>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isStreaming && message.content.length > 0 && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-ink-400 hover:text-ink-600 dark:hover:text-ink-300"
            >
              {copied ? <CheckIcon className="h-3 w-3 text-mint-500" /> : <CopyIcon className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {message.error ? (
              <button
                onClick={() => onRetry(message.id)}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-coral-500 hover:text-coral-600"
              >
                <RefreshIcon className="h-3 w-3" /> Retry
              </button>
            ) : (
              isLastAssistantMessage && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-ink-400 hover:text-ink-600 dark:hover:text-ink-300"
                >
                  <RefreshIcon className="h-3 w-3" /> Regenerate
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
