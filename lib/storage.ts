import type { Conversation } from "./types";

const CONVERSATIONS_KEY = "ss-assistant-conversations";
const ACTIVE_ID_KEY = "ss-assistant-active-id";
const THEME_KEY = "ss-theme";

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Conversation[];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch {
    // Storage full or unavailable — fail silently, chat still works in-memory.
  }
}

export function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_ID_KEY);
}

export function saveActiveId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(ACTIVE_ID_KEY, id);
  else window.localStorage.removeItem(ACTIVE_ID_KEY);
}

export function loadThemePreference(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(THEME_KEY);
  return value === "dark" || value === "light" ? value : null;
}

export function saveThemePreference(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function exportConversationAsMarkdown(conversation: Conversation): string {
  const lines: string[] = [`# ${conversation.title}`, ""];
  for (const message of conversation.messages) {
    const speaker = message.role === "user" ? "**Parent**" : "**Sunny Scholars AI**";
    lines.push(`${speaker}:`, "", message.content, "");
  }
  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
