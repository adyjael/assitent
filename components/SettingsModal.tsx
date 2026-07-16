"use client";

import { Modal } from "./Modal";
import { MoonIcon, SunIcon, TrashIcon } from "./icons";

interface SettingsModalProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

export function SettingsModal({ theme, onToggleTheme, onClearAll, onClose }: SettingsModalProps) {
  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-ink-100 p-3 dark:border-ink-800">
          <div>
            <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">Appearance</p>
            <p className="text-xs text-ink-400">Switch between light and dark mode</p>
          </div>
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
          >
            {theme === "dark" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
            {theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-coral-200 bg-coral-50 p-3 dark:border-coral-500/20 dark:bg-coral-500/10">
          <div>
            <p className="text-sm font-semibold text-coral-600 dark:text-coral-300">Clear all conversations</p>
            <p className="text-xs text-coral-500/80 dark:text-coral-300/70">This cannot be undone.</p>
          </div>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 rounded-lg bg-coral-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-coral-500/90"
          >
            <TrashIcon className="h-4 w-4" />
            Clear
          </button>
        </div>

        <p className="text-center text-xs text-ink-400">Sunny Scholars AI Assistant · v1.0</p>
      </div>
    </Modal>
  );
}
