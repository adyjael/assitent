"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { XIcon } from "./icons";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md animate-pop-in rounded-2xl border border-ink-100 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
            aria-label="Close"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
