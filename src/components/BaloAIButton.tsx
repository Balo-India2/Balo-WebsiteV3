import { Link, useRouterState } from "@tanstack/react-router";
import baloAiLogo from "@/assets/balo-ai-logo.png";

/**
 * Floating BALO AI launcher. Clicking it opens the dedicated /balo-ai page.
 * Hidden on the BALO AI page itself and on the admin dashboard.
 */
export function BaloAIButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/balo-ai") || pathname.startsWith("/admin")) return null;

  return (
    <Link
      to="/balo-ai"
      aria-label="Open BALO AI"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-card/95 py-2 pl-2 pr-4 shadow-xl backdrop-blur transition hover:scale-[1.03] hover:border-primary/50"
    >
      <span className="relative grid size-10 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/25 blur-md transition group-hover:bg-primary/40"
        />
        <img src={baloAiLogo} alt="" width={40} height={40} className="relative size-10" />
      </span>
      <span className="text-sm font-semibold">
        BALO <span className="text-primary">AI</span>
      </span>
    </Link>
  );
}
