import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, MapPin, Heart } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/associazionebalo/";
const FACEBOOK_URL = "https://www.facebook.com/baloODV/";
const DONATE_URL = "https://www.balousa.org/donation-confirmation/";
const ADDRESS = "55, Madar Talla Lane, Babudanga, Pilkhana, Salkia, Howrah, West Bengal 711101";

const explore = [
  { to: "/", label: "Home" },
  { to: "/about", label: "Leadership" },
  { to: "/life-at-balo", label: "Life at BALO" },
  { to: "/events", label: "Notices & Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/subjects", label: "Academics" },
];

const connect = [
  { to: "/enquiry", label: "Enquiry" },
  { to: "/faq", label: "FAQ" },
  { to: "/volunteers", label: "Volunteers" },
  { to: "/developers", label: "Developers" },
  { to: "/balo-ai", label: "BALO AI" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl gradient-hero">
              <GraduationCap className="size-5 text-white" />
            </div>
            <div>
              <div className="font-display font-bold">Balo English Medium School</div>
              <div className="text-xs text-muted-foreground">Salkia, Howrah · A community NGO</div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Free English-medium education for the children of Babudanga and Pilkhana — books, a meal, and a classroom that welcomes every child.
          </p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{ADDRESS}</span>
            </p>
            <a href="mailto:baloindia2015@gmail.com" className="flex items-center gap-2 hover:text-primary">
              <Mail className="size-4 shrink-0 text-primary" />
              baloindia2015@gmail.com
            </a>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Balo on Instagram"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              Instagram
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Balo on Facebook"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Facebook
            </a>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"
            >
              <Heart className="size-3.5" />
              Donate
            </a>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            {explore.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Connect</div>
          <ul className="mt-4 space-y-2 text-sm">
            {connect.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-border pt-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Balo English Medium School. Built with love by our students.
      </div>
    </footer>
  );
}
