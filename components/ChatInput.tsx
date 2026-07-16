"use client";

import { useEffect, useRef, useState } from "react";
import { SendIcon, StopIcon } from "./icons";

interface ChatInputProps {
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

const MAX_HEIGHT = 200;

export function ChatInput({ isStreaming, onSend, onStop }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  function handleSend() {
    if (!value.trim() || isStreaming) return;
    onSend(value);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-ink-100 bg-white/90 px-4 py-3 backdrop-blur dark:border-ink-800 dark:bg-ink-950/90 md:px-8">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-ink-200 bg-white p-2 shadow-soft focus-within:border-sky-300 dark:border-ink-700 dark:bg-ink-900">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask anything about your child's learning..."
          className="scroll-thin max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[14.5px] text-ink-800 outline-none placeholder:text-ink-400 dark:text-ink-100"
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-800 text-white transition-transform active:scale-95 hover:bg-ink-900 dark:bg-ink-200 dark:text-ink-900"
            aria-label="Stop generating"
          >
            <StopIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-mint-400 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-ink-400">
        Sunny Scholars AI can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}
