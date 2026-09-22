import { cn } from "@/lib/utils";
import baloAiLogo from "@/assets/balo-ai-logo.png";

/**
 * Official uploaded BALO AI mark, shared by every AI surface.
 */
export function BaloAiMark({
  className,
  glow = false,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      {glow && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/30 blur-md"
        />
      )}
      <img
        src={baloAiLogo}
        alt=""
        aria-hidden="true"
        className="relative size-full rounded-full object-cover shadow-sm ring-1 ring-border"
      />
    </span>
  );
}
