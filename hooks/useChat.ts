"use client";

import { useCallback, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import type { Conversation, Message } from "@/lib/types";
import { detectAge } from "@/lib/age";
import { BASE_PATH } from "@/lib/config";

const TITLE_MAX_LENGTH = 48;

function deriveTitle(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= TITLE_MAX_LENGTH) return clean;
  return `${clean.slice(0, TITLE_MAX_LENGTH).trim()}…`;
}

interface UseChatOptions {
  conversation: Conversation | null;
  ensureConversation: () => string;
  updateConversation: (id: string, updater: (c: Conversation) => Conversation) => void;
}

export function useChat({ conversation, ensureConversation, updateConversation }: UseChatOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const runCompletion = useCallback(
    async (conversationId: string, historyForApi: Message[], childAge: number | null, assistantMessageId: string) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);

      try {
        const res = await fetch(`${BASE_PATH}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: historyForApi.map((m) => ({ role: m.role, content: m.content })),
            childAge,
          }),
        });

        if (!res.ok || !res.body) {
          let errorText = "Something went wrong. Please try again.";
          try {
            const data = await res.json();
            if (data?.error) errorText = data.error;
          } catch {
            /* response wasn't JSON — keep default message */
          }
          updateConversation(conversationId, (c) => ({
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMessageId ? { ...m, content: errorText, streaming: false, error: true } : m
            ),
          }));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          updateConversation(conversationId, (c) => ({
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMessageId ? { ...m, content: accumulated, streaming: true } : m
            ),
          }));
        }

        updateConversation(conversationId, (c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === assistantMessageId ? { ...m, content: accumulated || "…", streaming: false } : m
          ),
        }));
      } catch (err) {
        const aborted = err instanceof DOMException && err.name === "AbortError";
        updateConversation(conversationId, (c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  streaming: false,
                  error: !aborted,
                  content: aborted ? m.content || "_Generation stopped._" : "Connection error. Please try again.",
                }
              : m
          ),
        }));
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [updateConversation]
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const id = conversation?.id ?? ensureConversation();
      const detectedAge = detectAge(trimmed);
      const userMessage: Message = { id: uuid(), role: "user", content: trimmed, createdAt: Date.now() };
      const assistantMessage: Message = {
        id: uuid(),
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        streaming: true,
      };

      // Computed directly from the closed-over conversation, not from inside
      // the updateConversation callback below — React doesn't guarantee that
      // callback runs synchronously, so reading it back out via a side-effect
      // variable was a race condition (it showed up as "No messages provided"
      // in production once in a while).
      const existingMessages = conversation?.messages ?? [];
      const historyForApi = [...existingMessages, userMessage];
      const isFirstMessage = existingMessages.length === 0;

      updateConversation(id, (c) => ({
        ...c,
        title: isFirstMessage ? deriveTitle(trimmed) : c.title,
        childAge: detectedAge ?? c.childAge,
        messages: [...c.messages, userMessage, assistantMessage],
      }));

      void runCompletion(id, historyForApi, detectedAge ?? conversation?.childAge ?? null, assistantMessage.id);
    },
    [conversation, ensureConversation, isStreaming, runCompletion, updateConversation]
  );

  const regenerate = useCallback(() => {
    if (!conversation || isStreaming) return;
    const messages = conversation.messages;
    const lastAssistantIndex = [...messages].reverse().findIndex((m) => m.role === "assistant");
    if (lastAssistantIndex === -1) return;
    const index = messages.length - 1 - lastAssistantIndex;
    const historyForApi = messages.slice(0, index);
    const assistantMessageId = messages[index].id;

    updateConversation(conversation.id, (c) => ({
      ...c,
      messages: c.messages.map((m) =>
        m.id === assistantMessageId ? { ...m, content: "", streaming: true, error: false } : m
      ),
    }));

    void runCompletion(conversation.id, historyForApi, conversation.childAge, assistantMessageId);
  }, [conversation, isStreaming, runCompletion, updateConversation]);

  const retryMessage = useCallback(
    (assistantMessageId: string) => {
      if (!conversation || isStreaming) return;
      const index = conversation.messages.findIndex((m) => m.id === assistantMessageId);
      if (index === -1) return;
      const historyForApi = conversation.messages.slice(0, index);

      updateConversation(conversation.id, (c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === assistantMessageId ? { ...m, content: "", streaming: true, error: false } : m
        ),
      }));

      void runCompletion(conversation.id, historyForApi, conversation.childAge, assistantMessageId);
    },
    [conversation, isStreaming, runCompletion, updateConversation]
  );

  const editMessage = useCallback(
    (userMessageId: string, newContent: string) => {
      if (!conversation || isStreaming) return;
      const trimmed = newContent.trim();
      if (!trimmed) return;
      const index = conversation.messages.findIndex((m) => m.id === userMessageId);
      if (index === -1) return;

      const detectedAge = detectAge(trimmed);
      const editedMessage: Message = { ...conversation.messages[index], content: trimmed, createdAt: Date.now() };
      const assistantMessage: Message = {
        id: uuid(),
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        streaming: true,
      };
      const historyForApi = [...conversation.messages.slice(0, index), editedMessage];

      updateConversation(conversation.id, (c) => ({
        ...c,
        childAge: detectedAge ?? c.childAge,
        messages: [...c.messages.slice(0, index), editedMessage, assistantMessage],
      }));

      void runCompletion(conversation.id, historyForApi, detectedAge ?? conversation.childAge, assistantMessage.id);
    },
    [conversation, isStreaming, runCompletion, updateConversation]
  );

  return { isStreaming, sendMessage, stopGeneration, regenerate, retryMessage, editMessage };
}
