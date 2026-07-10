import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OWNER_EMAIL = "baloindia2015@gmail.com";

// Returns whether the current user is a signed-in admin.
// IMPORTANT: does NOT auto-grant from any allow-list. Admin role is only
// granted after the owner approves a pending request via verifyAdminApproval.
export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase, claims } = context;
    const c = claims as { email?: string; email_confirmed_at?: string | null };
    const email = c?.email ?? null;
    const emailVerified = Boolean(c?.email_confirmed_at);

    const { data: existing } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: Boolean(existing), email, emailVerified };
  });

// Existing admin CRUD (unchanged)
const idSchema = z.object({ id: z.string().uuid() });
const announcementInput = z.object({
  message: z.string().trim().min(1).max(500),
  is_published: z.boolean(),
  publish_at: z.string().datetime(),
});
const noticeInput = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(2000),
  is_published: z.boolean(),
  publish_at: z.string().datetime(),
});

type SupabaseRoleChecker = {
  rpc: (
    fn: string,
    args: { _user_id: string; _role: string },
  ) => Promise<{ data: boolean | null; error?: unknown }>;
};

async function requireAdmin(ctx: { supabase: SupabaseRoleChecker; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: admin only");
}

export const listAllAnnouncements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase
      .from("announcements")
      .select("*")
      .order("publish_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const createAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => announcementInput.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { data: row, error } = await context.supabase
      .from("announcements")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const updateAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => announcementInput.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("announcements")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const deleteAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => idSchema.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { error } = await context.supabase.from("announcements").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listAllNotices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase
      .from("notices")
      .select("*")
      .order("publish_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const createNotice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => noticeInput.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { data: row, error } = await context.supabase
      .from("notices")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const updateNotice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => noticeInput.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("notices")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const deleteNotice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => idSchema.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { error } = await context.supabase.from("notices").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// -----------------------------------------------------------------------------
// Admin approval flow
// -----------------------------------------------------------------------------

async function sha256Hex(text: string) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateCode(): string {
  // 6-digit numeric OTP
  const n = Math.floor(100000 + Math.random() * 900000);
  return String(n);
}

async function sendOwnerApprovalEmail(code: string, requesterEmail: string) {
  const key = process.env.RESEND_API_KEY;
  const lovableKey = process.env.LOVABLE_API_KEY;
  if (!key || !lovableKey) {
    // No email provider connected yet — log the code so the owner can retrieve
    // it from server logs while a Resend connection is being set up.
    console.warn(
      `[admin-approval] RESEND_API_KEY missing. Approval code for ${requesterEmail}: ${code}`,
    );
    return { delivered: false };
  }
  const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": key,
    },
    body: JSON.stringify({
      from: "Balo Admin <onboarding@resend.dev>",
      to: [OWNER_EMAIL],
      subject: `Admin access request from ${requesterEmail}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2>Admin access request</h2>
          <p><b>${requesterEmail}</b> has requested admin access to the Balo dashboard.</p>
          <p>If you recognise this person and want to approve them, share the code below with them privately. It expires in 30 minutes.</p>
          <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; background:#f4f4f5; padding: 16px 24px; text-align:center; border-radius:12px;">${code}</p>
          <p style="color:#666; font-size: 12px;">If you did not expect this, do NOT share the code and consider revoking the account.</p>
        </div>
      `,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(
      `[admin-approval] Resend failed [${res.status}]: ${body}. Code for ${requesterEmail}: ${code}`,
    );
    return { delivered: false };
  }
  return { delivered: true };
}

// Called by a signed-in, email-verified user to request admin access.
// Generates a fresh code, stores its hash, and emails the plain code to the owner.
export const requestAdminApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, claims } = context;
    const c = claims as { email?: string; email_confirmed_at?: string | null };
    const email = c?.email ?? null;
    const emailVerified = Boolean(c?.email_confirmed_at);
    if (!email) throw new Error("Missing email on account");
    if (!emailVerified)
      throw new Error("Please verify your email first, then request admin approval.");

    // If already admin, no-op.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: role } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (role) return { delivered: true, alreadyAdmin: true };

    const code = generateCode();
    const codeHash = await sha256Hex(code);
    const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Invalidate any previous pending requests for this user.
    await supabaseAdmin
      .from("admin_approval_requests")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("used_at", null);

    const { error: insErr } = await supabaseAdmin.from("admin_approval_requests").insert({
      user_id: userId,
      email,
      code_hash: codeHash,
      expires_at: expires,
    });
    if (insErr) throw insErr;

    const { delivered } = await sendOwnerApprovalEmail(code, email);
    return { delivered, alreadyAdmin: false };
  });

// The requester enters the code the owner shared with them.
export const verifyAdminApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ code: z.string().trim().min(4).max(12) }).parse(i))
  .handler(async ({ context, data }) => {
    const { userId, claims } = context;
    const c = claims as { email_confirmed_at?: string | null };
    if (!c?.email_confirmed_at)
      throw new Error("Verify your email before submitting an approval code.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const codeHash = await sha256Hex(data.code);
    const nowIso = new Date().toISOString();

    const { data: req } = await supabaseAdmin
      .from("admin_approval_requests")
      .select("id, code_hash, expires_at, used_at")
      .eq("user_id", userId)
      .is("used_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!req) throw new Error("No pending approval request. Request one first.");
    if (new Date(req.expires_at).getTime() < Date.now())
      throw new Error("Code expired. Request a new one.");
    if (req.code_hash !== codeHash) throw new Error("Incorrect approval code.");

    await supabaseAdmin
      .from("admin_approval_requests")
      .update({ used_at: nowIso })
      .eq("id", req.id);

    // Grant admin role (idempotent).
    const { data: existing } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!existing) {
      await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
    }
    return { ok: true };
  });
