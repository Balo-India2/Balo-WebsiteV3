import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useNotices, useUnreadNotices, markAllNoticesSeen } from "@/lib/notices";

/**
 * Floating notice bell — always reachable, shows a red dot while unread
 * notices exist and opens a compact, independently scrolling preview list.
 */
export function NoticeBell() {
  const notices = useNotices();
  const unread = useUnreadNotices();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && notices.length) markAllNoticesSeen(notices.map((n) => n.id));
  }, [open, notices]);

  if (!notices.length) return null;

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.1, type: "spring", stiffness: 200, damping: 18 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notice board"
        className="fixed bottom-5 left-5 z-[60] grid place-items-center size-12 rounded-full bg-card border border-border shadow-lg hover:bg-muted transition"
      >
        {open ? <X className="size-5" /> : <Bell className="size-5" />}
        {!open && unread && (
          <span className="absolute top-2 right-2 size-2.5 rounded-full bg-red-500 animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[59] bottom-20 left-3 sm:left-5 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Bell className="size-4 text-primary" /> Notice Board
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {notices.length} live
              </span>
            </div>
            <div className="max-h-[min(50vh,22rem)] overflow-y-auto overscroll-contain divide-y divide-border">
              {notices.slice(0, 8).map((n) => (
                <div key={n.id} className="px-4 py-3">
                  <div className="text-xs font-semibold">{n.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{n.body}</p>
                  <div className="mt-1 text-[10px] text-muted-foreground">
                    {new Date(n.publish_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/events"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 border-t border-border px-4 py-2.5 text-xs font-semibold text-primary hover:bg-muted"
            >
              Open Notice &amp; Events <ArrowRight className="size-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
