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

    // Bootstrap: the verified owner account always holds the admin role.
    if (!existing && emailVerified && email?.toLowerCase() === OWNER_EMAIL) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
      return { isAdmin: true, email, emailVerified };
    }
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

async function requireAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: admin only");
}

// Only the school owner account may approve/reject/revoke admins.
async function requireOwner(ctx: { claims: unknown }) {
  const email = (ctx.claims as { email?: string })?.email?.toLowerCase() ?? "";
  if (email !== OWNER_EMAIL) throw new Error("Forbidden: owner only");
}


export const listAllAnnouncements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase.from("announcements").select("*").order("publish_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const createAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => announcementInput.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { data: row, error } = await context.supabase.from("announcements").insert(data).select().single();
    if (error) throw error;
    return row;
  });

export const updateAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => announcementInput.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase.from("announcements").update(patch).eq("id", id).select().single();
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
    const { data, error } = await context.supabase.from("notices").select("*").order("publish_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const createNotice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => noticeInput.parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { data: row, error } = await context.supabase.from("notices").insert(data).select().single();
    if (error) throw error;
    return row;
  });

export const updateNotice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => noticeInput.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase.from("notices").update(patch).eq("id", id).select().single();
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
// Admin approval flow — owner approves inside the dashboard. No email service.
// -----------------------------------------------------------------------------

// The signed-in, email-verified user asks the owner for admin access.
export const requestAdminApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, claims } = context;
    const c = claims as { email?: string; email_confirmed_at?: string | null };
    const email = c?.email ?? null;
    if (!email) throw new Error("Missing email on account");
    if (!c?.email_confirmed_at) {
      throw new Error("Please verify your email first, then request admin approval.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: role } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (role) return { status: "approved" as const, alreadyAdmin: true };

    const { data: pending } = await supabaseAdmin
      .from("admin_approval_requests")
      .select("id, status")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle();
    if (pending) return { status: "pending" as const, alreadyAdmin: false };

    const { error } = await supabaseAdmin.from("admin_approval_requests").insert({
      user_id: userId,
      email,
      status: "pending",
    });
    if (error) throw error;
    return { status: "pending" as const, alreadyAdmin: false };
  });

// Requester polls this to see whether the owner has approved them yet.
export const getMyApprovalRequest = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("admin_approval_requests")
      .select("id, status, created_at, reviewed_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data ?? null;
  });

// Owner-only: list every approval request.
export const listApprovalRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireOwner(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("admin_approval_requests")
      .select("id, user_id, email, status, created_at, reviewed_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return data ?? [];
  });

// Owner-only: approve or reject a request. Approving grants the admin role.
export const reviewApprovalRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ id: z.string().uuid(), decision: z.enum(["approved", "rejected"]) }).parse(i),
  )
  .handler(async ({ context, data }) => {
    await requireOwner(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: req, error: reqErr } = await supabaseAdmin
      .from("admin_approval_requests")
      .select("id, user_id, status")
      .eq("id", data.id)
      .maybeSingle();
    if (reqErr) throw reqErr;
    if (!req) throw new Error("Request not found");

    const { error: updErr } = await supabaseAdmin
      .from("admin_approval_requests")
      .update({
        status: data.decision,
        reviewed_at: new Date().toISOString(),
        reviewed_by: context.userId,
      })
      .eq("id", req.id);
    if (updErr) throw updErr;

    if (data.decision === "approved") {
      const { data: existing } = await supabaseAdmin
        .from("user_roles").select("id").eq("user_id", req.user_id).eq("role", "admin").maybeSingle();
      if (!existing) {
        const { error: insErr } = await supabaseAdmin
          .from("user_roles").insert({ user_id: req.user_id, role: "admin" });
        if (insErr) throw insErr;
      }
    } else {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", req.user_id).eq("role", "admin");
    }
    return { ok: true };
  });

// Owner-only: revoke an existing admin.
export const revokeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ userId: z.string().uuid() }).parse(i))
  .handler(async ({ context, data }) => {
    await requireOwner(context);
    if (data.userId === context.userId) throw new Error("You cannot revoke your own access.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles").delete().eq("user_id", data.userId).eq("role", "admin");
    if (error) throw error;
    return { ok: true };
  });

