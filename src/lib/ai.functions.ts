import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const sessionSchema = z.object({
  sessionKey: z.string().trim().min(8).max(80),
  mode: z.enum(["assistant", "student"]),
});

/**
 * Loads the saved conversation for a visitor session + mode.
 * Session keys are unguessable random client-generated ids, so a caller can
 * only ever read back the conversation belonging to its own browser.
 */
export const getConversation = createServerFn({ method: "POST" })
  .inputValidator((i) => sessionSchema.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: conv } = await supabaseAdmin
      .from("ai_conversations")
      .select("id")
      .eq("session_key", data.sessionKey)
      .eq("mode", data.mode)
      .maybeSingle();
    if (!conv) return { messages: [] as { role: string; content: string }[] };

    const { data: rows } = await supabaseAdmin
      .from("ai_messages")
      .select("role, content, created_at")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true })
      .limit(100);

    return { messages: (rows ?? []).map((r) => ({ role: r.role, content: r.content })) };
  });

export const clearConversation = createServerFn({ method: "POST" })
  .inputValidator((i) => sessionSchema.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: conv } = await supabaseAdmin
      .from("ai_conversations")
      .select("id")
      .eq("session_key", data.sessionKey)
      .eq("mode", data.mode)
      .maybeSingle();
    if (conv) await supabaseAdmin.from("ai_messages").delete().eq("conversation_id", conv.id);
    return { ok: true };
  });

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().nullable(),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(5).max(2000),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((i) => enquirySchema.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("enquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
    });
    if (error) throw new Error("Could not send your enquiry. Please try again.");
    return { ok: true };
  });
