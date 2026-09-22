import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-reset-password")({
  ssr: false,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft">
        <h1 className="text-2xl font-bold">Admin password recovery moved</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Password recovery is handled from the username-based admin sign-in page. Reset links are no longer used.</p>
        <button onClick={() => navigate({ to: "/admin-login" })} className="mt-6 w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Go to admin sign in</button>
      </div>
    </div>
  );
}
