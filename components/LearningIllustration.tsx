export function LearningIllustration() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="h-28 w-auto md:h-32"
      aria-hidden
    >
      <ellipse cx="100" cy="122" rx="70" ry="8" className="fill-ink-100 dark:fill-ink-800" />

      {/* stack of books */}
      <rect x="46" y="86" width="66" height="14" rx="3" className="fill-sky-300" />
      <rect x="52" y="72" width="60" height="14" rx="3" className="fill-mint-300" />
      <rect x="44" y="58" width="64" height="14" rx="3" className="fill-yolk-300" />

      {/* open book on top */}
      <path d="M40 52 L76 44 L76 60 L40 68 Z" className="fill-white stroke-ink-200 dark:fill-ink-900 dark:stroke-ink-700" strokeWidth="1.5" />
      <path d="M76 44 L112 52 L112 68 L76 60 Z" className="fill-white stroke-ink-200 dark:fill-ink-900 dark:stroke-ink-700" strokeWidth="1.5" />

      {/* pencil */}
      <g transform="rotate(28 150 60)">
        <rect x="140" y="30" width="10" height="60" rx="3" className="fill-coral-300" />
        <path d="M140 30 L150 30 L145 16 Z" className="fill-coral-400" />
        <rect x="140" y="80" width="10" height="10" className="fill-ink-700 dark:fill-ink-300" />
      </g>

      {/* stars */}
      <path d="M158 92 l2.5 5.5 6 0.7-4.4 4 1.2 6-5.3-3-5.3 3 1.2-6-4.4-4 6-0.7Z" className="fill-yolk-300" />
      <circle cx="34" cy="40" r="4" className="fill-sky-300" />
      <circle cx="26" cy="90" r="3" className="fill-mint-300" />
    </svg>
  );
}
