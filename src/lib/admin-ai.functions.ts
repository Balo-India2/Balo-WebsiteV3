import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const modeEnum = z.enum(["assistant", "student"]);
const idSchema = z.object({ id: z.string().uuid() });

async function requireAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: admin only");
}

// ---------------------------------------------------------------- AI settings
export const listAiSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase
      .from("ai_settings")
      .select("*")
      .order("mode");
    if (error) throw error;
    return data;
  });

export const updateAiSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        id: z.string().uuid(),
        is_enabled: z.boolean(),
        system_instructions: z.string().trim().max(8000),
      })
      .parse(i),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("ai_settings")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

// ------------------------------------------------------------- Knowledge base
const knowledgeInput = z.object({
  mode: modeEnum,
  category: z.string().trim().min(1).max(60),
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(20000),
  is_active: z.boolean(),
});

export const listKnowledge = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase
      .from("ai_knowledge")
      .select("*")
      .order("mode")
      .order("category")
      .order("title");
    if (error) throw error;
    return data;
  });

export const createKnowledge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => knowledgeInput.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { data: row, error } = await context.supabase
      .from("ai_knowledge")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const updateKnowledge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => knowledgeInput.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("ai_knowledge")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const deleteKnowledge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => idSchema.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { error } = await context.supabase.from("ai_knowledge").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ------------------------------------------------------------------ Documents
const documentInput = z.object({
  mode: modeEnum,
  title: z.string().trim().min(1).max(200),
  doc_type: z.string().trim().min(1).max(60),
  extracted_text: z.string().trim().max(200000),
  is_active: z.boolean(),
});

export const listDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase
      .from("ai_documents")
      .select("id, mode, title, doc_type, extracted_text, is_active, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const createDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => documentInput.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { data: row, error } = await context.supabase
      .from("ai_documents")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const updateDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => documentInput.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("ai_documents")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const deleteDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => idSchema.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { error } = await context.supabase.from("ai_documents").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ------------------------------------------------------- Classes and subjects
export const listCurriculum = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const [{ data: classes }, { data: subjects }] = await Promise.all([
      context.supabase.from("ai_classes").select("*").order("sort_order"),
      context.supabase.from("ai_subjects").select("*").order("sort_order"),
    ]);
    return { classes: classes ?? [], subjects: subjects ?? [] };
  });

export const upsertCurriculumItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        kind: z.enum(["class", "subject"]),
        id: z.string().uuid().optional(),
        name: z.string().trim().min(1).max(80),
        sort_order: z.number().int().min(0).max(999),
        is_active: z.boolean(),
      })
      .parse(i),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const table = data.kind === "class" ? "ai_classes" : "ai_subjects";
    const patch = { name: data.name, sort_order: data.sort_order, is_active: data.is_active };
    if (data.id) {
      const { error } = await context.supabase.from(table).update(patch).eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await context.supabase.from(table).insert(patch);
      if (error) throw error;
    }
    return { ok: true };
  });

export const deleteCurriculumItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ kind: z.enum(["class", "subject"]), id: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const table = data.kind === "class" ? "ai_classes" : "ai_subjects";
    const { error } = await context.supabase.from(table).delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ------------------------------------------------------------------ Enquiries
export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw error;
    return data;
  });

export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "in_progress", "resolved"]) }).parse(i),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { error } = await context.supabase
      .from("enquiries")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => idSchema.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { error } = await context.supabase.from("enquiries").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ------------------------------------------------------------------ AI usage
export const listAiActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const [{ data: convs }, { data: msgs }] = await Promise.all([
      context.supabase.from("ai_conversations").select("id, mode, created_at"),
      context.supabase
        .from("ai_messages")
        .select("id, mode, role, content, created_at")
        .order("created_at", { ascending: false })
        .limit(60),
    ]);
    return { conversations: convs ?? [], recent: msgs ?? [] };
  });
