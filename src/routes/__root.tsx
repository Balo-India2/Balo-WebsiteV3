import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "../components/Nav";
import { AnnouncementBanner } from "../components/AnnouncementBanner";
import { LoadingScreen } from "../components/LoadingScreen";
import { Footer } from "../components/Footer";
import { LanguageProvider } from "../lib/i18n";
import { BaloAIButton } from "../components/BaloAIButton";
import { NoticeBell } from "../components/NoticeBell";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:site_name", content: "Balo English Medium School" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function HashScroller() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prevPath = useRef(pathname);

  useEffect(() => {
    // Hash: smooth-scroll to the anchor once the target has mounted.
    if (hash) {
      const id = hash.replace(/^#/, "");
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(id);
          if (!el) return;
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        });
      });
      return () => cancelAnimationFrame(raf);
    }

    // Real page change (not just search-param updates): scroll to top AFTER
    // the page-entry animation has had time to play (~450ms) so animations
    // trigger from a static top position instead of immediately during nav.
    // Browser back/forward is handled by the router's built-in
    // scrollRestoration, which fires before this effect runs.
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      const t = window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
      }, 450);
      return () => window.clearTimeout(t);
    }
  }, [pathname, hash]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminShellRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLogin = pathname === "/admin-login";
  // BALO AI is a full-screen chat surface: no marquee, no footer.
  const isChatRoute = pathname.startsWith("/balo-ai");
  const isBare = isAdminShellRoute || isChatRoute;
  const [ready, setReady] = useState(false);

  // Keep initial content mounted OFF-DOM while the splash is up so page
  // entry animations begin AFTER the splash fades — not underneath it.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 1650);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <LoadingScreen />
        {!isAdminShellRoute && <Nav />}
        {!isBare && !isAdminLogin && <AnnouncementBanner />}
        <HashScroller />
        <div className={isBare ? "" : isAdminLogin ? "pt-[72px]" : "pt-9"}>
          {ready ? <Outlet /> : <div style={{ minHeight: "100vh" }} aria-hidden />}
        </div>
        {!isBare && <Footer />}
        {ready && <BaloAIButton />}
        {!isBare && ready && <NoticeBell />}

      </LanguageProvider>
    </QueryClientProvider>
  );
}
