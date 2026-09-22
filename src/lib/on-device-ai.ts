/**
 * On-device (in-browser) AI for BALO Assistant.
 *
 * Some browsers ship a built-in, fully local language model (Chrome's Prompt
 * API). When it is available we use it to turn the school's own verified
 * passages into a friendly, conversational reply — entirely on the visitor's
 * device. Nothing is sent to any external AI service, and the model is never
 * asked for facts of its own: it may only rephrase the passages we give it.
 *
 * If the browser has no on-device AI, we simply show the retrieved passages
 * as composed by the server. Assistant mode therefore never depends on an
 * external provider.
 */

export type AssistantPassage = { title: string; body: string };

type AnyWindow = Window & {
  LanguageModel?: any;
  ai?: { languageModel?: any };
};

function getApi() {
  if (typeof window === "undefined") return null;
  const w = window as AnyWindow;
  return w.LanguageModel ?? w.ai?.languageModel ?? null;
}

export async function onDeviceAiAvailable() {
  const api = getApi();
  if (!api) return false;
  try {
    if (typeof api.availability === "function") {
      const status = await api.availability();
      return status === "available" || status === "readily";
    }
    if (typeof api.capabilities === "function") {
      const caps = await api.capabilities();
      return caps?.available === "readily";
    }
  } catch {
    return false;
  }
  return false;
}

const SYSTEM_PROMPT = `You are BALO Assistant, the official digital assistant of BALO English Medium School, Howrah.
Rewrite the supplied school records into a warm, clear, well-formatted markdown answer to the visitor's question.
Rules:
- Use ONLY the supplied records. Never add facts, dates, names or numbers of your own.
- If the records do not answer the question, say so and suggest emailing baloindia2015@gmail.com.
- Never mention any AI model, provider, company or technology. You are simply BALO Assistant.
- Be warm and proud of the school. Keep it concise: short paragraphs, bold key terms, bullet lists where useful.`;

/**
 * Rewrite verified passages into a conversational answer using the browser's
 * own model. Returns null when unavailable or when anything goes wrong, so the
 * caller can keep the server-composed answer.
 */
export async function rewriteWithOnDeviceAi(
  question: string,
  passages: AssistantPassage[],
): Promise<string | null> {
  if (!passages.length) return null;
  const api = getApi();
  if (!api) return null;

  let session: any;
  try {
    session = await api.create({
      initialPrompts: [{ role: "system", content: SYSTEM_PROMPT }],
    });
  } catch {
    try {
      session = await api.create({ systemPrompt: SYSTEM_PROMPT });
    } catch {
      return null;
    }
  }

  try {
    const records = passages
      .map((p) => `### ${p.title}\n${p.body}`)
      .join("\n\n")
      .slice(0, 6000);
    const reply: string = await session.prompt(
      `Visitor's question: ${question}\n\nSchool records:\n${records}`,
    );
    const text = (reply ?? "").trim();
    return text.length > 40 ? text : null;
  } catch {
    return null;
  } finally {
    try {
      session?.destroy?.();
    } catch {
      /* ignore */
    }
  }
}
