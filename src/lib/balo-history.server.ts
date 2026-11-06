import type { StudentTurn } from "@/lib/balo-student.server";

const STOP = new Set(
  `the and for are was what who how why when where which that this with from about tell please give just any can you our`
    .split(/\s+/)
    .filter(Boolean),
);

const FOLLOW_UP =
  /^(and\b|also\b|what about\b|how about\b|tell me more\b|more about\b|continue\b|go on\b|why\b|when\b|where\b|who is (he|she|that|this)\b|who was\b|that\b|those\b|this\b|these\b|it\b|he\b|she\b|they\b|his\b|her\b|their\b|the same\b|ok\b|okay\b|yes\b|no\b|thanks\b)/i;

function contentWords(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

/** True when the new message continues the previous topic (pronouns, "what about…"). */
export function isFollowUpQuestion(current: string, previousUser?: string) {
  const q = current.trim();
  if (!previousUser?.trim()) return false;
  if (FOLLOW_UP.test(q)) return true;
  const a = contentWords(q);
  const b = contentWords(previousUser);
  if (a.size === 0) return true;
  let hit = 0;
  for (const t of a) if (b.has(t)) hit += 1;
  return hit / a.size >= 0.4;
}

/**
 * Drop prior turns when the visitor starts a new topic, so BALO AI does not
 * recap the last answer. Follow-ups keep a short window of history.
 */
export function prepareChatHistory(history: StudentTurn[], currentMessage: string): StudentTurn[] {
  const lastUser = [...history].reverse().find((t) => t.role === "user");
  if (!isFollowUpQuestion(currentMessage, lastUser?.content)) return [];

  return history.slice(-6).map((turn) => {
    if (turn.role !== "assistant" || turn.content.length <= 320) return turn;
    return { ...turn, content: `${turn.content.slice(0, 300).trim()}…` };
  });
}
