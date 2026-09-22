import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, CornerDownLeft } from "lucide-react";

type Entry = {
  title: string;
  href: string;
  hash?: string;
  section: string;
  keywords: string;
};

/** Everything the smart search can jump to, with the words people actually type. */
const INDEX: Entry[] = [
  { title: "Home", href: "/", section: "School", keywords: "home start welcome balo india school howrah salkia" },
  { title: "Life at BALO", href: "/life-at-balo", section: "School", keywords: "daily routine timetable school day students life culture" },
  { title: "Welfare Society", href: "/welfare-society", section: "School", keywords: "welfare society charity support sponsorship help ngo" },
  { title: "Notices & Events", href: "/events", section: "School", keywords: "notice board news events announcements holidays updates circular" },
  { title: "About Us", href: "/about", section: "About", keywords: "about founder elizabetta ravoili director rehana khatoon principal roshan ara history mission volunteers italy ireland usa malaysia" },
  { title: "Staff", href: "/staff", section: "About", keywords: "staff teachers faculty manager ranjit mishra teaching team" },
  { title: "Developers", href: "/developers", section: "About", keywords: "developers coding web development students rehan jamil shahil sharma shibran khatoon samuel clay italian" },
  { title: "Facilities", href: "/facilities", section: "Academics", keywords: "library computer lab science laboratory smart class ac classrooms infrastructure" },
  { title: "Academics & Subjects", href: "/subjects", section: "Academics", keywords: "subjects curriculum syllabus mathematics english grammar literature hindi physics chemistry biology history geography computer commercial applications economics political science class" },
  { title: "Extracurricular", href: "/extracurricular", section: "Academics", keywords: "sports day summer camp rugby fun fiesta activities clubs games" },
  { title: "Gallery", href: "/gallery", section: "Media", keywords: "gallery photos pictures images album campus" },
  { title: "Virtual Tour", href: "/virtual-tour", section: "Media", keywords: "virtual tour walkthrough campus visit video 360" },
  { title: "Rules & Regulations", href: "/rules", section: "Information", keywords: "rules regulations uniform discipline attendance code of conduct policy" },
  { title: "Academic Calendar", href: "/calendar", section: "Information", keywords: "calendar dates term exams holidays schedule academic year" },
  { title: "Admission Enquiry", href: "/enquiry", section: "Connect", keywords: "admission enquiry apply form contact join fees registration" },
  { title: "FAQ", href: "/faq", section: "Connect", keywords: "faq questions answers help admission fees uniform transport timing doubts" },
  { title: "Contact & Address", href: "/", hash: "contact", section: "Connect", keywords: "contact address phone email location map madar talla babudanga pilkhana salkia howrah directions" },
  { title: "BALO AI", href: "/balo-ai", section: "Connect", keywords: "balo ai assistant student tutor chat ask question homework help" },
  { title: "Admin Login", href: "/admin-login", section: "Connect", keywords: "admin login sign in staff portal dashboard password account" },
];

function score(entry: Entry, q: string) {
  const haystack = `${entry.title} ${entry.section} ${entry.keywords}`.toLowerCase();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  let total = 0;
  for (const w of words) {
    if (entry.title.toLowerCase().startsWith(w)) total += 6;
    else if (entry.title.toLowerCase().includes(w)) total += 4;
    else if (haystack.includes(w)) total += 2;
    else return 0;
  }
  return total;
}

/**
 * Smart site search: keyword-aware matching over every page and key section,
 * with keyboard navigation and a ⌘K / Ctrl-K shortcut.
 */
export function SmartSearch({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!q.trim()) return INDEX.slice(0, 6);
    return INDEX.map((e) => ({ e, s: score(e, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((r) => r.e);
  }, [q]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    setOpen(false);
    setQ("");
    navigate({ to: entry.href, ...(entry.hash ? { hash: entry.hash } : {}) });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search the website"
        className={
          mobile
            ? "inline-flex w-full items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm text-muted-foreground"
            : "inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
        }
      >
        <Search className="size-3.5" />
        <span>Search</span>
        {!mobile && (
          <kbd className="ml-1 rounded border border-border px-1 text-[10px] leading-4">⌘K</kbd>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 px-4 pt-24 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-card"
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="size-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActive((i) => Math.min(i + 1, results.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActive((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      go(results[active]);
                    }
                  }}
                  placeholder="Search pages, subjects, facilities, notices…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button onClick={() => setOpen(false)} aria-label="Close search">
                  <X className="size-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="max-h-[55vh] overflow-y-auto p-2">
                {results.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Nothing matched “{q}”. Try “admission”, “library”, “notice” or “subjects”.
                  </p>
                )}
                {results.map((r, i) => (
                  <button
                    key={`${r.href}${r.hash ?? ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      i === active ? "bg-muted" : "hover:bg-muted/60"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold">{r.title}</span>
                      <span className="block text-xs text-muted-foreground">{r.section}</span>
                    </span>
                    {i === active && <CornerDownLeft className="size-3.5 text-muted-foreground" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
