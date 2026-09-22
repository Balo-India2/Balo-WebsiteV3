import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { sampleFor } from "@/components/sample-pool";


/** Entrance animation used across the content pages. `once: true` keeps
 *  low-end devices happy — each block animates a single time per page visit. */
export const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: Math.min(i, 3) * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Reveal({
  children,
  i = 0,
  className,
}: {
  children: ReactNode;
  i?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={rise}
      custom={i}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  lead,
  image,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  lead: string;
  /** Background photograph shown behind the page title. */
  image?: string;
}) {
  const bg = image;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  return (
    <section ref={heroRef} className="relative flex min-h-[70vh] items-center overflow-hidden px-6 pt-24">
      <motion.div aria-hidden style={{ scale }} className="pointer-events-none absolute inset-0 -z-10 origin-center">
        {bg && (
          <img
            src={bg}
            alt=""
            loading="eager"
            decoding="async"
            width={1600}
            height={1024}
            className="size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-accent/70" />
      </motion.div>
      <div className="mx-auto w-full max-w-7xl text-white">
        <Reveal>
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-secondary">
            {eyebrow}
          </div>
          <h1 className="text-balance font-display text-5xl font-black leading-[0.95] md:text-7xl">
            {title} {highlight && <span className="italic text-secondary">{highlight}</span>}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">{lead}</p>
        </Reveal>
      </div>
    </section>
  );
}



export function Section({
  id,
  title,
  eyebrow,
  children,
  muted,
}: {
  id?: string;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <section id={id} className={cn("px-6 py-14", muted && "bg-card")}>
      <div className="mx-auto max-w-6xl">
        {(title || eyebrow) && (
          <Reveal className="mb-8 max-w-3xl">
            {eyebrow && (
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-balance font-display text-3xl font-bold md:text-4xl">{title}</h2>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Replaceable sample images
 *
 * HOW TO REPLACE: drop the real photo into `src/assets/`, import it, and
 * pass it as `src`. When no `src` is given, a real BALO photo from
 * `src/assets` is picked automatically for the label, so every sample slot
 * always shows a photo while staying easy to swap.
 * ------------------------------------------------------------------ */

/** Small "tap to preview" affordance shown over previewable photos. */
export function TapHint({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm",
        className,
      )}
    >
      <ZoomIn className="size-3" /> Tap to preview
    </span>
  );
}

export function SampleImage({
  label,
  src,
  ratio = "4 / 3",
  onOpen,
}: {
  label: string;
  src?: string;
  ratio?: string;
  onOpen?: (src: string, label: string) => void;
}) {
  // Auto-fill with a real photo from src/assets when no explicit src is set.
  const resolved = src ?? sampleFor(label);
  const clickable = Boolean(resolved && onOpen);
  return (
    <figure
      onClick={() => resolved && onOpen?.(resolved, label)}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border bg-muted/40 shadow-soft",
        clickable && "cursor-zoom-in",
      )}
      style={{ aspectRatio: ratio }}
    >
      {resolved ? (
        <>
          <img
            src={resolved}
            alt={label}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {clickable && <TapHint />}
        </>
      ) : (
        <div className="grid size-full place-items-center bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-5 text-center">
          <div>
            <div className="text-sm font-semibold text-foreground/80">{label}</div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
              Sample image — replaceable
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}


export function SamplePair({
  label,
  images,
  onOpen,
}: {
  label: string;
  images?: [string?, string?];
  onOpen?: (src: string, label: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SampleImage label={`${label} — photo 1`} src={images?.[0]} onOpen={onOpen} />
      <SampleImage label={`${label} — photo 2`} src={images?.[1]} onOpen={onOpen} />
    </div>
  );
}

/** Animated lightbox preview shared by the gallery and photo sections. */
export function useLightbox() {
  const [open, setOpen] = useState<{ src: string; label: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const node = open ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={() => setOpen(null)}
      role="dialog"
      aria-modal="true"
      aria-label={open.label}
    >
      <button
        onClick={() => setOpen(null)}
        aria-label="Close preview"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
      <motion.img
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        src={open.src}
        alt={open.label}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
      />
      <p className="absolute bottom-6 text-center text-xs text-white/70">{open.label}</p>
    </motion.div>
  ) : null;

  return {
    open: (src: string, label: string) => setOpen({ src, label }),
    node,
  };
}
