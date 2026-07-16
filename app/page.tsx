"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatArea } from "@/components/ChatArea";
import { ChatInput } from "@/components/ChatInput";
import { SettingsModal } from "@/components/SettingsModal";
import { HelpModal } from "@/components/HelpModal";
import { MenuIcon, SparkleIcon } from "@/components/icons";
import { useConversations } from "@/hooks/useConversations";
import { useChat } from "@/hooks/useChat";
import { downloadTextFile, exportConversationAsMarkdown, loadThemePreference, saveThemePreference } from "@/lib/storage";

export default function AssistantPage() {
  const {
    conversations,
    activeConversation,
    activeId,
    createConversation,
    selectConversation,
    updateConversation,
    renameConversation,
    deleteConversation: removeConversation,
    clearAllConversations,
  } = useConversations();

  const { isStreaming, sendMessage, stopGeneration, regenerate, retryMessage, editMessage } = useChat({
    conversation: activeConversation,
    ensureConversation: createConversation,
    updateConversation,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = loadThemePreference();
    if (saved) {
      setTheme(saved);
    } else if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      saveThemePreference(next);
      return next;
    });
  }, []);

  // Keyboard shortcuts: Cmd/Ctrl+K -> new chat.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        createConversation();
        setSidebarOpen(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [createConversation]);

  function handleExport(id: string) {
    const conversation = conversations.find((c) => c.id === id);
    if (!conversation) return;
    downloadTextFile(`${conversation.title.replace(/[^\w\-]+/g, "_")}.md`, exportConversationAsMarkdown(conversation));
  }

  function handleSelectPrompt(prompt: string) {
    sendMessage(prompt);
  }

  const hasMessages = !!activeConversation && activeConversation.messages.length > 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ink-50 dark:bg-ink-950">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(id) => {
          selectConversation(id);
          setSidebarOpen(false);
        }}
        onCreate={() => {
          createConversation();
          setSidebarOpen(false);
        }}
        onRename={renameConversation}
        onDelete={removeConversation}
        onExport={handleExport}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-ink-100 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-950 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
            aria-label="Open sidebar"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <SparkleIcon className="h-4 w-4 text-sky-500" />
            <span className="font-display text-sm font-bold text-ink-800 dark:text-ink-100">
              {activeConversation?.title ?? "Sunny Scholars AI"}
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          {hasMessages && activeConversation ? (
            <ChatArea
              conversation={activeConversation}
              isStreaming={isStreaming}
              onEdit={editMessage}
              onRegenerate={regenerate}
              onRetry={retryMessage}
            />
          ) : (
            <div className="scroll-thin h-full overflow-y-auto">
              <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
            </div>
          )}
        </div>

        <ChatInput isStreaming={isStreaming} onSend={sendMessage} onStop={stopGeneration} />
      </div>

      {settingsOpen && (
        <SettingsModal
          theme={theme}
          onToggleTheme={toggleTheme}
          onClearAll={() => {
            clearAllConversations();
            setSettingsOpen(false);
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
}
