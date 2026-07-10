import { Megaphone } from "lucide-react";
import { useLiveAnnouncements } from "@/lib/public-content";

const FALLBACK = [
  "🇮🇳 Visit us at 55 Pilkhana 2nd Bye Lane, Salkia",
  "📅 Sports Day 2026 arrives this December — save the date",
  "💛 Support a child today — ₹500 sends one student to school for a full month",
];

/**
 * Marquee-style announcement banner shown below the main nav.
 * Uses a CSS keyframe animation on a duplicated track so the loop never
 * "resets" visually (framer-motion re-mounts caused visible jumps on mobile).
 */
export function AnnouncementBanner() {
  const live = useLiveAnnouncements();
  const messages = live.length > 0 ? live.map((a) => a.message) : FALLBACK;
  const track = [...messages, ...messages];
  return (
    <div className="fixed top-[72px] inset-x-0 z-40 border-b border-border/50 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-3 px-4 sm:px-6 py-1.5">
        <div className="shrink-0 flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
          <Megaphone className="size-3.5" />{" "}
          <span className="hidden xs:inline sm:inline">Balo News</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="balo-marquee-track flex gap-12 whitespace-nowrap text-sm w-max">
            {track.map((m, i) => (
              <span key={i} className="shrink-0">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes balo-marquee {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-50%,0,0); }
        }
        .balo-marquee-track {
          animation: balo-marquee 35s linear infinite;
          will-change: transform;
        }
        @media (max-width: 640px) {
          .balo-marquee-track { animation-duration: 22s; }
        }
      `}</style>
    </div>
  );
}
