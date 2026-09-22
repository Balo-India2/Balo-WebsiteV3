import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getAdminStatus } from "@/lib/admin.functions";
import { LogOut, LayoutDashboard, ShieldAlert, UserCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(getAdminStatus);
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "signed-out" } | { kind: "not-admin"; username: string | null } | { kind: "admin"; username: string | null }
  >({ kind: "loading" });

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!data.session) return setState({ kind: "signed-out" });
      try {
        const r = await checkAdmin();
        if (!mounted) return;
        setState(r.isAdmin ? { kind: "admin", username: r.username } : { kind: "not-admin", username: r.username });
      } catch {
        if (mounted) setState({ kind: "not-admin", username: null });
      }
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") check();
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [checkAdmin]);

  if (state.kind === "loading") {
    return <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">Checking access…</div>;
  }
  if (state.kind === "signed-out") {
    throw redirect({ to: "/admin-login" });
  }
  if (state.kind === "not-admin") {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="size-12 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Not authorised</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {state.username ?? "This account"} is not an admin. Sign in with an administrator account.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin-login" }); }}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="size-5 text-primary" />
            <span className="font-display font-bold">Balo Admin</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">View site</Link>
            <div className="flex items-center gap-2 rounded-full border border-border bg-background pl-1.5 pr-3 py-1">
              <span className="grid place-items-center size-7 rounded-full bg-primary/10 text-primary">
                <UserCircle2 className="size-5" />
              </span>
              <span className="hidden sm:inline text-xs font-medium text-foreground/80 max-w-[160px] truncate">
                {state.username ?? "Admin"}
              </span>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin-login" }); }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:bg-muted"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="border-b border-border bg-card/60">
        <div className="max-w-6xl mx-auto flex items-center gap-1 px-6 overflow-x-auto">
          {[
            { to: "/admin", label: "Dashboard" },
            { to: "/admin/ai", label: "BALO AI" },
            { to: "/admin/knowledge", label: "Knowledge base" },
          ].map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: true }}
              className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
              activeProps={{ className: "whitespace-nowrap border-b-2 border-primary px-3 py-3 text-sm font-semibold text-foreground" }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>

    </div>
  );
}
