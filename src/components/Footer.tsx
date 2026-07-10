import { GraduationCap } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/associazionebalo?igsh=MTIxYzNsazlteWZraQ==";
const FACEBOOK_URL = "https://www.facebook.com/baloODV/";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6 text-sm">
        <div className="flex flex-col items-start gap-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Balo on Instagram"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span className="text-xs font-medium">@associazionebalo</span>
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Balo on Facebook"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span className="text-xs font-medium">@baloODV</span>
          </a>
          <div className="text-muted-foreground text-xs pt-1">
            © {new Date().getFullYear()} Balo English Medium School. Built with love by our
            community.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl gradient-hero grid place-items-center">
            <GraduationCap className="size-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold">Balo English Medium School</div>
            <div className="text-xs text-muted-foreground">Salkia, Howrah · A community NGO</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
