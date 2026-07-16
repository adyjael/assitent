"use client";

import { SUGGESTION_CARDS } from "@/lib/suggestions";
import { LearningIllustration } from "./LearningIllustration";

const TOPICS = [
  "Teaching reading",
  "Phonics",
  "Kindergarten readiness",
  "Homeschool",
  "Printable activities",
  "Behavior",
  "Learning routines",
  "Math",
  "Handwriting",
  "Speech development",
];

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 text-center md:py-16">
      <div className="animate-fade-in">
        <LearningIllustration />
      </div>

      <h1 className="animate-fade-in-up mt-6 font-display text-[26px] font-extrabold leading-tight text-ink-900 dark:text-ink-50 md:text-[32px]">
        Hi! 👋 I&apos;m your Sunny Scholars
        <br className="hidden md:block" /> AI Learning Assistant
      </h1>
      <p
        className="animate-fade-in-up mt-3 max-w-xl text-[15px] text-ink-500 dark:text-ink-400"
        style={{ animationDelay: "80ms" }}
      >
        Helping parents create fun learning experiences every day.
      </p>

      <div
        className="animate-fade-in-up mt-6 flex flex-wrap justify-center gap-2"
        style={{ animationDelay: "140ms" }}
      >
        <span className="mr-1 text-sm font-medium text-ink-400">Ask me anything about:</span>
        {TOPICS.map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-ink-100 bg-white px-3 py-1 text-xs font-medium text-ink-600 shadow-sm dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTION_CARDS.map((card, i) => (
          <button
            key={card.title}
            onClick={() => onSelectPrompt(card.prompt)}
            style={{ animationDelay: `${180 + i * 45}ms` }}
            className="animate-fade-in-up group flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-card dark:border-ink-800 dark:bg-ink-900 dark:hover:border-sky-500/30"
          >
            <span className="text-xl">{card.icon}</span>
            <span className="text-[13.5px] font-medium leading-snug text-ink-700 group-hover:text-ink-900 dark:text-ink-300 dark:group-hover:text-ink-50">
              {card.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
