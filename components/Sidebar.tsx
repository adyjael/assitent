"use client";

import { useMemo, useState } from "react";
import type { Conversation } from "@/lib/types";
import {
  CheckIcon,
  DownloadIcon,
  HelpIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SparkleIcon,
  TrashIcon,
  XIcon,
} from "./icons";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  open,
  onClose,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  onExport,
  onOpenSettings,
  onOpenHelp,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [conversations, query]);

  function startRename(c: Conversation) {
    setEditingId(c.id);
    setDraftTitle(c.title);
  }

  function commitRename() {
    if (editingId) onRename(editingId, draftTitle);
    setEditingId(null);
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-[280px] flex-col border-r border-ink-100 bg-white transition-transform duration-300 ease-out dark:border-ink-800 dark:bg-ink-950 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-mint-400 text-white shadow-glow">
              <SparkleIcon className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-[15px] font-extrabold text-ink-900 dark:text-ink-50">Sunny Scholars</p>
              <p className="text-[11px] font-medium text-ink-400">AI Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 md:hidden"
            aria-label="Close sidebar"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* New chat */}
        <div className="px-3">
          <button
            onClick={onCreate}
            className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-mint-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform active:scale-[0.98] hover:brightness-105"
          >
            <PlusIcon className="h-4 w-4" />
            New chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pt-3">
          <div className="flex items-center gap-2 rounded-xl border border-ink-100 bg-ink-50 px-3 py-2 text-sm focus-within:border-sky-300 dark:border-ink-800 dark:bg-ink-900">
            <SearchIcon className="h-4 w-4 shrink-0 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-ink-700 placeholder:text-ink-400 outline-none dark:text-ink-200"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="scroll-thin mt-3 flex-1 overflow-y-auto px-2 pb-2">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-ink-400">
              {conversations.length === 0 ? "No conversations yet" : "No matches found"}
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {filtered.map((c) => {
              const isActive = c.id === activeId;
              const isEditing = editingId === c.id;
              const isConfirmingDelete = confirmDeleteId === c.id;

              return (
                <li key={c.id}>
                  <div
                    className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                        : "text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800/60"
                    }`}
                  >
                    {isEditing ? (
                      <input
                        autoFocus
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onBlur={commitRename}
                        className="w-full rounded border border-sky-300 bg-white px-1.5 py-0.5 text-sm text-ink-800 outline-none dark:bg-ink-900 dark:text-ink-100"
                      />
                    ) : (
                      <button
                        onClick={() => onSelect(c.id)}
                        className="min-w-0 flex-1 truncate text-left"
                        title={c.title}
                      >
                        {c.title}
                      </button>
                    )}

                    {!isEditing && (
                      <div
                        className={`flex shrink-0 items-center gap-0.5 ${
                          isConfirmingDelete ? "" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isConfirmingDelete ? (
                          <>
                            <button
                              onClick={() => {
                                onDelete(c.id);
                                setConfirmDeleteId(null);
                              }}
                              className="rounded p-1 text-coral-500 hover:bg-coral-100 dark:hover:bg-coral-500/10"
                              aria-label="Confirm delete"
                            >
                              <CheckIcon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded p-1 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
                              aria-label="Cancel delete"
                            >
                              <XIcon className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startRename(c)}
                              className="rounded p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-600 dark:hover:bg-ink-800"
                              aria-label="Rename"
                            >
                              <PencilIcon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onExport(c.id)}
                              className="rounded p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-600 dark:hover:bg-ink-800"
                              aria-label="Export"
                            >
                              <DownloadIcon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(c.id)}
                              className="rounded p-1 text-ink-400 hover:bg-coral-100 hover:text-coral-500 dark:hover:bg-coral-500/10"
                              aria-label="Delete"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-1 border-t border-ink-100 p-2 dark:border-ink-800">
          <button
            onClick={onOpenSettings}
            className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800/60"
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </button>
          <button
            onClick={onOpenHelp}
            className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800/60"
          >
            <HelpIcon className="h-4 w-4" />
            Help
          </button>
        </div>
      </aside>
    </>
  );
}
