import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, KeyRound, ShieldCheck, RefreshCw, Send } from "lucide-react";
import { requestAdminApproval, verifyAdminApproval, getAdminStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin-login")({
  ssr: false,
  component: AdminLoginPage,
});

type Mode = "signin" | "signup" | "reset" | "verify-sent" | "approval";

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

function AdminLoginPage() {
  const navigate = useNavigate();
  const requestApproval = useServerFn(requestAdminApproval);
  const verifyApproval = useServerFn(verifyAdminApproval);
  const checkAdmin = useServerFn(getAdminStatus);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);

  async function resendVerification() {
    if (!email) {
      setMsg({ kind: "err", text: "Enter your email above first." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/admin-login` },
      });
      if (error) throw error;
      setMsg({ kind: "ok", text: "Verification email re-sent. Check your inbox (and spam)." });
    } catch (err: unknown) {
      setMsg({ kind: "err", text: getErrorMessage(err, "Could not resend verification email.") });
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (/confirm|verify/i.test(error.message)) {
            setMsg({
              kind: "err",
              text: "Please verify your email before signing in. Check your inbox — or resend below.",
            });
            setMode("verify-sent");
            return;
          }
          throw error;
        }
        if (!data.user?.email_confirmed_at) {
          setMsg({
            kind: "err",
            text: "Your email isn't verified yet. Please click the link we emailed you.",
          });
          await supabase.auth.signOut();
          setMode("verify-sent");
          return;
        }
        // Signed in + verified. Now check admin status.
        const status = await checkAdmin();
        if (status.isAdmin) {
          navigate({ to: "/admin" });
        } else {
          // Not yet admin — send them to the approval flow.
          setMsg({
            kind: "ok",
            text: "You're signed in and verified. To become an admin, request approval below.",
          });
          setMode("approval");
        }
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin-login` },
        });
        if (error) throw error;
        setMsg({
          kind: "ok",
          text: "We've sent a verification email. Please verify your email before signing in.",
        });
        setMode("verify-sent");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin-reset-password`,
        });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Password reset email sent." });
      }
    } catch (err: unknown) {
      setMsg({ kind: "err", text: getErrorMessage(err, "Something went wrong.") });
    } finally {
      setBusy(false);
    }
  }

  async function submitApprovalRequest() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await requestApproval();
      if (r.alreadyAdmin) {
        navigate({ to: "/admin" });
        return;
      }
      setMsg({
        kind: "ok",
        text: r.delivered
          ? "Approval request sent to the site owner. When they share the code with you, enter it below."
          : "Approval request created. Email delivery isn't configured yet — ask the site owner to check server logs for the code.",
      });
    } catch (err: unknown) {
      setMsg({ kind: "err", text: getErrorMessage(err, "Could not request approval.") });
    } finally {
      setBusy(false);
    }
  }

  async function submitApprovalCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await verifyApproval({ data: { code: code.trim() } });
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      setMsg({ kind: "err", text: getErrorMessage(err, "Could not verify code.") });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="size-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
          <Lock className="size-6" />
        </div>
        <h1 className="text-2xl font-bold">
          {mode === "approval"
            ? "Admin approval"
            : mode === "verify-sent"
              ? "Verify your email"
              : "Admin sign in"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" && "Sign in with your admin email and password."}
          {mode === "signup" &&
            "Create an account. You'll need to verify your email, then request admin approval from the site owner."}
          {mode === "reset" && "Enter your email to receive a password reset link."}
          {mode === "verify-sent" &&
            "We sent you a link. Click it to activate your account, then come back and sign in."}
          {mode === "approval" &&
            "Request an approval code — the site owner will share a 6-digit code with you. Enter it below to activate admin access."}
        </p>

        {mode === "approval" ? (
          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={submitApprovalRequest}
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-50"
            >
              <Send className="size-4" /> Send approval request to owner
            </button>
            <form onSubmit={submitApprovalCode} className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">
                  Approval code (6 digits)
                </span>
                <div className="mt-1 relative">
                  <ShieldCheck className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    minLength={4}
                    maxLength={12}
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm tracking-widest text-center font-mono"
                    placeholder="••••••"
                  />
                </div>
              </label>
              {msg && (
                <div
                  className={`text-sm rounded-md p-3 ${msg.kind === "err" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}
                >
                  {msg.text}
                </div>
              )}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {busy ? "Please wait…" : "Activate admin access"}
              </button>
            </form>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                setMode("signin");
                setMsg(null);
              }}
              className="w-full text-xs text-muted-foreground hover:underline"
            >
              Sign out
            </button>
          </div>
        ) : mode === "verify-sent" ? (
          <div className="mt-6 space-y-4">
            {msg && (
              <div
                className={`text-sm rounded-md p-3 ${msg.kind === "err" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}
              >
                {msg.text}
              </div>
            )}
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Email</span>
              <div className="mt-1 relative">
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
                />
              </div>
            </label>
            <button
              onClick={resendVerification}
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-50"
            >
              <RefreshCw className="size-4" /> Resend verification email
            </button>
            <button
              onClick={() => {
                setMode("signin");
                setMsg(null);
              }}
              className="w-full text-xs text-primary hover:underline"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Email</span>
              <div className="mt-1 relative">
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </label>
            {mode !== "reset" && (
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">Password</span>
                <div className="mt-1 relative">
                  <KeyRound className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
                    placeholder="At least 8 characters"
                  />
                </div>
              </label>
            )}
            {msg && (
              <div
                className={`text-sm rounded-md p-3 ${msg.kind === "err" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}
              >
                {msg.text}
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {busy
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in"
                  : mode === "signup"
                    ? "Create account"
                    : "Send reset link"}
            </button>
          </form>
        )}

        {(mode === "signin" || mode === "signup" || mode === "reset") && (
          <div className="mt-6 flex items-center justify-between text-xs">
            {mode === "signin" ? (
              <>
                <button
                  onClick={() => {
                    setMode("signup");
                    setMsg(null);
                  }}
                  className="text-primary hover:underline"
                >
                  Create account
                </button>
                <button
                  onClick={() => {
                    setMode("reset");
                    setMsg(null);
                  }}
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMode("signin");
                  setMsg(null);
                }}
                className="text-primary hover:underline"
              >
                Back to sign in
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
