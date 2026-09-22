import { Link, useRouterState } from "@tanstack/react-router";
import { BaloAiMark } from "@/components/BaloAiMark";

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
      <BaloAiMark className="size-10" glow />
      <span className="text-sm font-semibold">
        BALO <span className="text-primary">AI</span>
      </span>
    </Link>
  );
}
