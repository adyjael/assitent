"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import type { Conversation } from "@/lib/types";
import {
  loadActiveId,
  loadConversations,
  saveActiveId,
  saveConversations,
} from "@/lib/storage";

function createEmptyConversation(): Conversation {
  const now = Date.now();
  return {
    id: uuid(),
    title: "New chat",
    messages: [],
    createdAt: now,
    updatedAt: now,
    childAge: null,
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-only).
  useEffect(() => {
    const stored = loadConversations();
    const storedActiveId = loadActiveId();
    if (stored.length > 0) {
      setConversations(stored);
      setActiveId(storedActiveId && stored.some((c) => c.id === storedActiveId) ? storedActiveId : stored[0].id);
    }
    setHydrated(true);
  }, []);

  // Persist whenever conversations change (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    saveConversations(conversations);
  }, [conversations, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveActiveId(activeId);
  }, [activeId, hydrated]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const createConversation = useCallback(() => {
    const fresh = createEmptyConversation();
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
    return fresh.id;
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const updateConversation = useCallback(
    (id: string, updater: (conversation: Conversation) => Conversation) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...updater(c), updatedAt: Date.now() } : c))
      );
    },
    []
  );

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: title.trim() || c.title } : c))
    );
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          setActiveId(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
    },
    [activeId]
  );

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveId(null);
  }, []);

  return {
    conversations,
    activeConversation,
    activeId,
    hydrated,
    createConversation,
    selectConversation,
    updateConversation,
    renameConversation,
    clearAllConversations,
    deleteConversation,
  };
}
