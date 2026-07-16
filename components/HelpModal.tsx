"use client";

import { Modal } from "./Modal";

const SHORTCUTS: [string, string][] = [
  ["Enter", "Send message"],
  ["Shift + Enter", "New line"],
  ["Ctrl / Cmd + K", "Start a new chat"],
  ["Esc", "Stop generation / close dialogs"],
];

export function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Help & Shortcuts" onClose={onClose}>
      <div className="flex flex-col gap-4 text-sm">
        <p className="text-ink-500 dark:text-ink-400">
          Ask about reading, phonics, kindergarten readiness, homeschool routines, math, handwriting, behavior, or
          speech development — mention your child&apos;s age and I&apos;ll tailor every answer to it.
        </p>
        <div className="rounded-xl border border-ink-100 dark:border-ink-800">
          {SHORTCUTS.map(([key, desc], i) => (
            <div
              key={key}
              className={`flex items-center justify-between px-3 py-2 ${
                i !== SHORTCUTS.length - 1 ? "border-b border-ink-100 dark:border-ink-800" : ""
              }`}
            >
              <span className="text-ink-500 dark:text-ink-400">{desc}</span>
              <kbd className="rounded-md border border-ink-200 bg-ink-50 px-2 py-0.5 font-mono text-xs text-ink-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
                {key}
              </kbd>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-ink-400">
          Need more help? Reach out any time at support@sunnyscholarslearning.com
        </p>
      </div>
    </Modal>
  );
}
