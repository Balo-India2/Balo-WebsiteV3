import { cn } from "@/lib/utils";
import baloAiLogo from "@/assets/balo-ai-logo.png";

/**
 * Official uploaded BALO AI mark, shared by every AI surface.
 */
export function BaloAiMark({
  className,
  glow = false,
  alt = "",
}: {
  className?: string;
  glow?: boolean;
  alt?: string;
}) {
  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      {glow && (
        <span
          aria-hidden
          className="absolute inset-[-22%] rounded-full bg-secondary/40 blur-xl"
        />
      )}
      <img
        src={baloAiLogo}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        className="relative size-full rounded-full object-cover"
      />
    </span>
  );
}
