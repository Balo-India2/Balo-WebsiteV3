import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, Globe, Sparkles } from "lucide-react";
import { useState } from "react";
import baloLogo from "@/assets/balo-logo.jpg";
import { useLang, type Lang } from "@/lib/i18n";
import { useUnreadNotices } from "@/lib/notices";

type NavItem = { key: string; href: string; hash?: string; notice?: boolean };

const navItems: NavItem[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about" },
  { key: "nav.facilities", href: "/facilities" },
  { key: "nav.subjects", href: "/subjects" },
  { key: "nav.extracurricular", href: "/extracurricular" },
  { key: "nav.events", href: "/events", notice: true },
  { key: "nav.gallery", href: "/gallery" },
  { key: "nav.life", href: "/life-at-balo" },
  { key: "nav.staff", href: "/staff" },
  { key: "nav.tour", href: "/virtual-tour" },
  { key: "nav.rules", href: "/rules" },
  { key: "nav.calendar", href: "/calendar" },
  { key: "nav.welfare", href: "/welfare-society" },
  { key: "nav.developers", href: "/developers" },
  { key: "nav.enquiry", href: "/enquiry" },
  { key: "nav.contact", href: "/", hash: "contact" },
];

const DONATE_URL = "https://www.balousa.org/donation-confirmation/";

const langOptions: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "bn", label: "বাং" },
];

function LangSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className={mobile ? "" : "relative"}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
        aria-label={t("lang.label")}
      >
        <Globe className="size-3.5" />
        {langOptions.find((o) => o.code === lang)?.label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={
              mobile
                ? "mt-2 flex gap-2"
                : "absolute right-0 mt-2 rounded-xl border border-border bg-card shadow-card p-1 min-w-[8rem] z-50"
            }
          >
            {langOptions.map((o) => (
              <button
                key={o.code}
                onClick={() => { setLang(o.code); setOpen(false); }}
                className={`${mobile ? "flex-1 rounded-full px-3 py-1.5 text-xs" : "block w-full text-left px-3 py-2 rounded-lg text-sm"} font-semibold transition-colors ${
                  lang === o.code ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                }`}
              >
                {o.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLang();
  const hasUnreadNotices = useUnreadNotices();

  const linkClasses =
    "text-sm font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer";

  const handleHashClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setMobileOpen(false);
    if (isHome) {
      const scrollToTarget = () => {
        const el = document.getElementById(hash);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      };
      window.setTimeout(scrollToTarget, 300);
      window.history.replaceState(null, "", `#${hash}`);
    } else {
      navigate({ to: "/", hash });
    }
  };

  const renderItem = (item: NavItem, mobile = false) => {
    const className = mobile
      ? "block text-sm font-medium text-foreground/70 hover:text-foreground cursor-pointer"
      : linkClasses;
    const showDot = item.notice && hasUnreadNotices;
    const dot = showDot ? (
      <span className="ml-1 inline-block size-1.5 rounded-full bg-red-500 align-middle animate-pulse" />
    ) : null;

    if (item.hash) {
      return (
        <a
          key={item.key}
          href={`#${item.hash}`}
          className={`${className} relative`}
          onClick={(e) => handleHashClick(e, item.hash!)}
        >
          {t(item.key)}
          {dot}
        </a>
      );
    }
    return (
      <Link
        key={item.key}
        to={item.href}
        className={`${className} relative`}
        activeProps={{ className: `${className} relative text-foreground font-semibold` }}
        activeOptions={{ exact: true }}
        onClick={() => setMobileOpen(false)}
      >
        {t(item.key)}
        {dot}
      </Link>
    );
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-10 rounded-full overflow-hidden shadow-soft ring-2 ring-accent/40">
            <img src={baloLogo} alt="Balo India logo" className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-lg">Balo India</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              School · Howrah
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => renderItem(item))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/balo-ai"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            <Sparkles className="size-4" /> BALO AI
          </Link>
          <LangSwitcher />

          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:scale-105 transition-transform"
          >
            <Heart className="size-4" /> {t("nav.donate")}
          </a>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors relative"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          {hasUnreadNotices && !mobileOpen && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-border/50"
          >
            <div className="px-6 py-4 space-y-3">
              {navItems.map((item) => renderItem(item, true))}
              <Link
                to="/balo-ai"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary"
              >
                <Sparkles className="size-4" /> BALO AI
              </Link>
              <div className="pt-2"><LangSwitcher mobile /></div>

              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2 text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                <Heart className="size-4" /> {t("nav.donate")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
