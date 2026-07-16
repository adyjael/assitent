/**
 * Best-effort extraction of a child's age from a parent's free-text message.
 * Only trusts ages in the 1-12 range (the assistant's realistic audience),
 * to avoid false positives from unrelated numbers in the message.
 */
export function detectAge(text: string): number | null {
  const patterns: RegExp[] = [
    /\bmy (?:child|son|daughter|kid)(?:'s|\sis)?\s*(?:is\s*)?(\d{1,2})\s*(?:years?|yrs?|yo)\b/i,
    /\b(\d{1,2})[\s-]*(?:years?|yrs?)[\s-]*old\b/i,
    /\bshe'?s\s*(\d{1,2})\b/i,
    /\bhe'?s\s*(\d{1,2})\b/i,
    /\bage[d]?\s*(\d{1,2})\b/i,
    /\bturning\s*(\d{1,2})\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const age = parseInt(match[1], 10);
      if (age >= 1 && age <= 12) return age;
    }
  }
  return null;
}
