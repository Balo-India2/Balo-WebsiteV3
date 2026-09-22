import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Menu,
  X,
  Globe,
  ChevronDown,
  UserCircle2,
} from "lucide-react";
import { SmartSearch } from "@/components/SmartSearch";
import { useEffect, useState } from "react";
import baloLogo from "@/assets/balo-logo.jpg";
import { useLang, type Lang } from "@/lib/i18n";
import { useUnreadNotices } from "@/lib/notices";

type NavItem = {
  key: string;
  href: string;
  hash?: string;
  notice?: boolean;
};

type NavGroup = {
  key: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    key: "navgroup.school",
    items: [
      { key: "nav.home", href: "/" },
      { key: "nav.life", href: "/life-at-balo" },
      { key: "nav.welfare", href: "/welfare-society" },
      { key: "nav.events", href: "/events", notice: true },
    ],
  },
  {
    key: "navgroup.about",
    items: [
      { key: "nav.about", href: "/about" },
      { key: "nav.volunteers", href: "/volunteers" },
      { key: "nav.developers", href: "/developers" },
    ],
  },
  {
    key: "navgroup.academics",
    items: [
      { key: "nav.facilities", href: "/facilities" },
      { key: "nav.subjects", href: "/subjects" },
      { key: "nav.extracurricular", href: "/extracurricular" },
    ],
  },
  {
    key: "navgroup.media",
    items: [
      { key: "nav.gallery", href: "/gallery" },
      { key: "nav.tour", href: "/virtual-tour" },
    ],
  },
  {
    key: "navgroup.info",
    items: [
      { key: "nav.rules", href: "/rules" },
      { key: "nav.calendar", href: "/calendar" },
    ],
  },
  {
    key: "navgroup.connect",
    items: [
      { key: "nav.contact", href: "/", hash: "contact" },
      { key: "nav.enquiry", href: "/enquiry" },
      { key: "nav.faq", href: "/faq" },
    ],
  },
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
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
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
                : "absolute right-0 z-50 mt-2 min-w-[8rem] rounded-xl border border-border bg-card p-1 shadow-card"
            }
          >
            {langOptions.map((o) => (
              <button
                key={o.code}
                onClick={() => {
                  setLang(o.code);
                  setOpen(false);
                }}
                className={`${
                  mobile
                    ? "flex-1 rounded-full px-3 py-1.5 text-xs"
                    : "block w-full rounded-lg px-3 py-2 text-left text-sm"
                } font-semibold transition-colors ${
                  lang === o.code
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
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
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const { t } = useLang();
  const hasUnreadNotices = useUnreadNotices();

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  const linkClasses =
    "text-sm font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer";

  const handleHashClick = (
    e: React.MouseEvent,
    hash: string,
    href = "/",
  ) => {
    e.preventDefault();

    setMobileOpen(false);
    setOpenGroup(null);

    if (pathname === href) {
      const scrollToTarget = () => {
        const el = document.getElementById(hash);

        if (!el) return;

        const top =
          el.getBoundingClientRect().top + window.scrollY - 80;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      };

      window.setTimeout(scrollToTarget, 300);
      window.history.replaceState(null, "", `#${hash}`);
    } else {
      navigate({
        to: href,
        hash,
      });
    }
  };

  const renderItem = (
    item: NavItem,
    mobile = false,
    inMenu = false,
  ) => {
    const className = mobile
      ? "block text-sm font-medium text-foreground/70 hover:text-foreground cursor-pointer"
      : inMenu
        ? "rounded-xl px-3 py-2 text-sm font-medium text-foreground/75 hover:bg-muted hover:text-foreground cursor-pointer"
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
          onClick={(e) =>
            handleHashClick(e, item.hash!, item.href)
          }
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
        activeProps={{
          className: `${className} relative text-foreground font-semibold`,
        }}
        activeOptions={{
          exact: true,
        }}
        onClick={() => {
          setMobileOpen(false);
          setOpenGroup(null);
        }}
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
      className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="size-10 overflow-hidden rounded-full shadow-soft ring-2 ring-accent/40">
            <img
              src={baloLogo}
              alt="Balo India logo"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="leading-tight">
            <div className="font-display text-lg font-bold">
              Balo India
            </div>

            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              School · Howrah
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navGroups.map((group) => {
            const open = openGroup === group.key;

            const groupHasDot =
              group.items.some((i) => i.notice) &&
              hasUnreadNotices;

            const groupActive = group.items.some(
              (i) => !i.hash && i.href === pathname,
            );

            return (
              <div
                key={group.key}
                className="relative"
                onMouseEnter={() => setOpenGroup(group.key)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setOpenGroup(open ? null : group.key)
                  }
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    groupActive
                      ? "font-semibold text-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {t(group.key)}

                  {groupHasDot && (
                    <span className="inline-block size-1.5 animate-pulse rounded-full bg-red-500" />
                  )}

                  <ChevronDown
                    className={`size-3.5 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 min-w-[13rem] rounded-2xl border border-border bg-card p-2 shadow-card"
                    >
                      <div className="flex flex-col">
                        {group.items.map((item) =>
                          renderItem(item, false, true),
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <SmartSearch />

          <LangSwitcher />

          <Link
            to="/admin-login"
            aria-label="Admin login"
            title="Admin login"
            className="grid size-9 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <UserCircle2 className="size-5" />
          </Link>

          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft transition-transform hover:scale-105"
          >
            <Heart className="size-4" />
            {t("nav.donate")}
          </a>
        </div>

        {/* Mobile account and menu actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <Link
            to="/admin-login"
            aria-label="Admin login"
            title="Admin login"
            className="grid size-9 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <UserCircle2 className="size-5" />
          </Link>
          <button
            className="relative rounded-lg p-2 transition-colors hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            {hasUnreadNotices && !mobileOpen && (
              <span className="absolute right-1.5 top-1.5 size-2 animate-pulse rounded-full bg-red-500" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/50 lg:hidden"
          >
            <div className="space-y-3 px-6 py-4">
              {navGroups.map((group) => (
                <div
                  key={group.key}
                  className="rounded-xl border border-border/60 bg-card/60"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroup(
                        openGroup === group.key
                          ? null
                          : group.key,
                      )
                    }
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                    aria-expanded={
                      openGroup === group.key
                    }
                  >
                    {t(group.key)}

                    <ChevronDown
                      className={`size-4 transition-transform ${
                        openGroup === group.key
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {openGroup === group.key && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 border-t border-border/60 px-3 py-3 pl-5">
                          {group.items.map((item) =>
                            renderItem(item, true),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="pt-2">
                <SmartSearch mobile />
              </div>

              <Link
                to="/admin-login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold"
              >
                <UserCircle2 className="size-4" />
                Admin login
              </Link>

              <div className="pt-2">
                <LangSwitcher mobile />
              </div>

              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground"
                onClick={() => setMobileOpen(false)}
              >
                <Heart className="size-4" />
                {t("nav.donate")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}