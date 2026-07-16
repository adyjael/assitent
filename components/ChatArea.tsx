"use client";

import { useEffect, useRef } from "react";
import type { Conversation } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";

interface ChatAreaProps {
  conversation: Conversation;
  isStreaming: boolean;
  onEdit: (id: string, newContent: string) => void;
  onRegenerate: () => void;
  onRetry: (id: string) => void;
}

export function ChatArea({ conversation, isStreaming, onEdit, onRegenerate, onRetry }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [conversation.messages]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScroll.current = distanceFromBottom < 120;
  }

  const lastAssistantId = [...conversation.messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div ref={containerRef} onScroll={handleScroll} className="scroll-thin h-full overflow-y-auto py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {conversation.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isStreaming && message.streaming === true}
            isLastAssistantMessage={message.id === lastAssistantId}
            onEdit={onEdit}
            onRegenerate={onRegenerate}
            onRetry={onRetry}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
