/**
 * BALO Assistant engine — completely independent of any external AI provider.
 *
 * This is the school's own on-site knowledge engine: it retrieves the most
 * relevant verified passages from the website content + the live database and
 * composes an answer from them. It never calls an external model, never sends
 * data off the server, and therefore can never leak or reference any
 * third-party AI provider.
 *
 * When the visitor's browser exposes an on-device AI (Chrome's built-in
 * Prompt API), the client rewrites these same retrieved passages into a
 * conversational reply locally — see `src/lib/on-device-ai.ts`. The passages
 * below are the only source material in both cases.
 */

const STOPWORDS = new Set(
  `a about above after again against all am an and any are aren't as at be because been before being below
   between both but by can cannot could couldn't did didn't do does doesn't doing don't down during each few
   for from further had hadn't has hasn't have haven't having he her here hers herself him himself his how
   i i'm if in into is isn't it its itself just me more most my myself no nor not of off on once only or
   other ought our ours ourselves out over own same shan't she should shouldn't so some such than that the
   their theirs them themselves then there these they this those through to too under until up very was
   wasn't we were weren't what when where which while who whom why with won't would wouldn't you your yours
   yourself yourselves tell me give please know want need something anything`
    .split(/\s+/)
    .filter(Boolean),
);

export type ContextSection = { title: string; body: string };

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/** Split the website facts document into titled sections on its `=== TITLE ===` headers. */
export function splitSiteFacts(facts: string): ContextSection[] {
  const out: ContextSection[] = [];
  const parts = facts.split(/^===\s*(.+?)\s*===$/gm);
  // parts = [preamble, title, body, title, body, ...]
  if (parts[0]?.trim()) out.push({ title: "About BALO", body: parts[0].trim() });
  for (let i = 1; i < parts.length; i += 2) {
    const title = (parts[i] ?? "").trim();
    const body = (parts[i + 1] ?? "").trim();
    if (title && body) out.push({ title, body });
  }
  return out;
}

/** Rank sections against a question. Returns the strongest matches first. */
export function rankSections(question: string, sections: ContextSection[], limit = 4) {
  const terms = tokenize(question);
  if (!terms.length) return [];
  const unique = Array.from(new Set(terms));

  const scored = sections.map((section) => {
    const haystack = `${section.title} ${section.title} ${section.body}`.toLowerCase();
    let score = 0;
    for (const term of unique) {
      const hits = haystack.split(term).length - 1;
      if (!hits) continue;
      // Diminishing returns per term, extra weight for rarer/longer words.
      score += Math.min(hits, 4) * (1 + term.length / 12);
    }
    return { section, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

const GENERAL_QUESTION =
  /\b(balo|school|about|who are you|what are you|overview|introduce|introduction|summary|history|story)\b/i;

const OFFICE_LINE =
  "For anything I don't have on record, you can contact the school office at **baloindia2015@gmail.com**.";

function trimBody(body: string, max: number) {
  if (body.length <= max) return body;
  const cut = body.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("\n"));
  return `${cut.slice(0, lastStop > 200 ? lastStop + 1 : cut.length).trim()}…`;
}

/**
 * Compose an Assistant answer purely from retrieved school records.
 * Returns the answer plus the passages used, so an on-device browser AI can
 * optionally reword them client-side.
 */
export function composeAssistantAnswer(question: string, sections: ContextSection[]) {
  const ranked = rankSections(question, sections, 4);

  if (!ranked.length) {
    const fallback = GENERAL_QUESTION.test(question)
      ? sections.slice(0, 2)
      : [];
    if (!fallback.length) {
      return {
        answer:
          "I'm **BALO Assistant**, the official digital assistant of BALO English Medium School. " +
          "I don't have that detail in the school records I hold, so I'd rather not guess.\n\n" +
          OFFICE_LINE,
        used: [] as ContextSection[],
      };
    }
    return {
      answer: renderAnswer(question, fallback),
      used: fallback,
    };
  }

  const used = ranked.map((r) => r.section);
  return { answer: renderAnswer(question, used), used };
}

function renderAnswer(question: string, used: ContextSection[]) {
  const budget = used.length === 1 ? 1600 : 900;
  const parts = used.map((s) => `**${titleCase(s.title)}**\n\n${trimBody(s.body, budget)}`);
  const lead = GENERAL_QUESTION.test(question)
    ? "Here's what the school records say:"
    : "Here's what I have on that from the school's own records:";
  return `${lead}\n\n${parts.join("\n\n")}`;
}

function titleCase(t: string) {
  const lower = t.toLowerCase();
  return lower.replace(/\b([a-z])/g, (m) => m.toUpperCase()).replace(/\bAnd\b/g, "and");
}
