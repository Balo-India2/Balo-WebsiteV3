import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, KeyRound, Lock, Mail, RefreshCw, UserRound } from "lucide-react";
import {
  getAdminStatus,
  recoverAdminPassword,
  registerAdmin,
  resendAdminVerification,
  signInAdmin,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin-login")({
  ssr: false,
  component: AdminLoginPage,
});

type Mode = "signin" | "signup" | "reset" | "verify-sent";

function AdminLoginPage() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(getAdminStatus);
  const register = useServerFn(registerAdmin);
  const signIn = useServerFn(signInAdmin);
  const resend = useServerFn(resendAdminVerification);
  const recover = useServerFn(recoverAdminPassword);

  const [username, setUsername] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);

  async function resendVerification() {
    if (!username || !adminEmail) {
      setMsg({ kind: "err", text: "Enter your username and the authorised admin email." });
      return;
    }
    setBusy(true); setMsg(null);
    try {
      await resend({ data: { username, adminEmail } });
      setMsg({ kind: "ok", text: "Verification email re-sent. Check your inbox (and spam)." });
    } catch (err: any) {
      setMsg({ kind: "err", text: err?.message ?? "Could not resend verification email." });
    } finally { setBusy(false); }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (mode === "signin") {
        const result = await signIn({ data: { username, password } });
        await supabase.auth.setSession(result.session);
        const status = await checkAdmin();
        if (status.isAdmin) {
          navigate({ to: "/admin" });
        } else {
          await supabase.auth.signOut();
          setMsg({ kind: "err", text: "This account is not authorised for the admin dashboard." });
        }
      } else if (mode === "signup") {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        await register({ data: { username, password, adminEmail } });
        setMsg({ kind: "ok", text: "We've sent a verification email. Verify the authorised admin email before signing in." });
        setMode("verify-sent");
      } else if (mode === "reset") {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        await recover({ data: { username, adminEmail, password } });
        setMsg({ kind: "ok", text: "Password updated. You can now sign in with your username." });
        setMode("signin");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setMsg({ kind: "err", text: err?.message ?? "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-36px)] grid place-items-center bg-background px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="size-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
          <Lock className="size-6" />
        </div>
        <h1 className="text-2xl font-bold">
          {mode === "verify-sent" ? "Verify your admin email" : mode === "signup" ? "Create admin account" : mode === "reset" ? "Recover admin access" : "Admin sign in"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" && "Sign in with your username and password."}
          {mode === "signup" && "Create an admin username and verify the authorised admin email."}
          {mode === "reset" && "Verify your username and authorised admin email, then choose a new password."}
          {mode === "verify-sent" && "We sent a verification link to the authorised admin email. Verify it, then return here to sign in."}
        </p>

        {mode === "verify-sent" ? (
          <div className="mt-6 space-y-4">
            {msg && (
              <div className={`text-sm rounded-md p-3 ${msg.kind === "err" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}>
                {msg.text}
              </div>
            )}
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Username</span>
              <div className="mt-1 relative">
                <UserRound className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Admin Email</span>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </label>
            <button onClick={resendVerification} disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-50">
              <RefreshCw className="size-4" /> Resend verification email
            </button>
            <button onClick={() => { setMode("signin"); setMsg(null); }}
              className="w-full text-xs text-primary hover:underline">Back to sign in</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Username</span>
              <div className="mt-1 relative">
                <UserRound className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" required value={username} onChange={(e) => { setUsername(e.target.value); setMsg(null); }}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
                  placeholder="your username" />
              </div>
            </label>
            {mode !== "signin" && (
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">Admin Email</span>
                <div className="mt-1 relative">
                  <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" required value={adminEmail} onChange={(e) => { setAdminEmail(e.target.value); setMsg(null); }} className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm" placeholder="authorised admin email" />
                </div>
              </label>
            )}
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">{mode === "reset" ? "New password" : "Password"}</span>
              <div className="mt-1 relative">
                <KeyRound className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => { setPassword(e.target.value); setMsg(null); }}
                  minLength={8}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-11 py-2 text-sm"
                  placeholder="At least 8 characters" />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
            {mode !== "signin" && (
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">Confirm password</span>
                <div className="mt-1 relative">
                  <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setMsg(null); }}
                    minLength={8}
                    className="w-full rounded-md border border-input bg-background px-3 pr-11 py-2 text-sm"
                    placeholder="Repeat your password" />
                  <button type="button" aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"} onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </label>
            )}
            {msg && (
              <div className={`text-sm rounded-md p-3 ${msg.kind === "err" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}>
                {msg.text}
              </div>
            )}
            <button type="submit" disabled={busy}
              className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold disabled:opacity-50">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Update password"}
            </button>
          </form>
        )}

        {(mode === "signin" || mode === "signup" || mode === "reset") && (
          <div className="mt-6 flex items-center justify-between text-xs">
            {mode === "signin" ? (
              <>
                <button onClick={() => { setMode("signup"); setMsg(null); }} className="text-primary hover:underline">Create account</button>
                <button onClick={() => { setMode("reset"); setMsg(null); }} className="text-primary hover:underline">Forgot password?</button>
              </>
            ) : (
              <button onClick={() => { setMode("signin"); setMsg(null); }} className="text-primary hover:underline">Back to sign in</button>
            )}
          </div>
        )}
        {mode === "verify-sent" && (
          <button onClick={() => { setMode("signin"); setMsg(null); }} className="mt-6 w-full text-xs text-primary hover:underline">Back to sign in</button>
        )}
      </div>
    </div>
  );
}
