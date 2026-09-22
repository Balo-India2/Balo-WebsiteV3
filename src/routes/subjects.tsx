import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen, Calculator, FlaskConical, Globe2, Landmark, Languages, Laptop,
  Coins, GraduationCap, HeartHandshake, MapPin, ArrowRight, Atom, Microscope,
  Scale, Sigma,
} from "lucide-react";

import hero from "@/assets/subjects-banner-new.jpg";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Academics — Balo English Medium School, Howrah" },
      { name: "description", content: "The class-wise subject list at Balo English Medium School — Mathematics, English Grammar & Literature, Hindi, Science, Physics, Chemistry, Biology, History, Geography, Computer Applications, Commercial Applications, Economics and Political Science." },
      { property: "og:title", content: "Academics — Balo English Medium School" },
      { property: "og:description", content: "See exactly which subjects are taught in each class, from Class 1 through Class 12." },
      { property: "og:image", content: hero },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/subjects" }],
  }),
  component: SubjectsPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: Math.min(i, 3) * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const ICONS: Record<string, typeof BookOpen> = {
  "Mathematics": Calculator,
  "English Grammar": Languages,
  "English Literature": BookOpen,
  "Hindi": BookOpen,
  "General Science": FlaskConical,
  "Moral Science": HeartHandshake,
  "Physics": Atom,
  "Chemistry": FlaskConical,
  "Biology": Microscope,
  "History": Landmark,
  "Geography": MapPin,
  "Computer Applications": Laptop,
  "Commercial Applications": Coins,
  "Economics": Sigma,
  "Political Science": Scale,
};

const DESCRIPTIONS: Record<string, string> = {
  "Mathematics": "Number work, algebra, geometry and daily problem-solving practice.",
  "English Grammar": "Sentence structure, tenses, usage and written accuracy.",
  "English Literature": "Prose, poetry and comprehension — reading with understanding.",
  "Hindi": "Reading, writing and conversation in Hindi.",
  "General Science": "Everyday science: living things, matter, energy and the environment.",
  "Moral Science": "Values, kindness, honesty and citizenship for our youngest learners.",
  "Physics": "Motion, force, light, heat, sound and electricity, with laboratory practicals.",
  "Chemistry": "Matter, reactions, acids and bases — theory plus supervised experiments.",
  "Biology": "Life processes, the human body, plants and health, with microscope work.",
  "History": "India and the world — timelines, movements and the people who shaped them.",
  "Geography": "Physical, human and regional geography with map-work.",
  "Computer Applications": "Digital literacy, typing, applications and coding basics in the computer lab.",
  "Commercial Applications": "Business, trade, accounts and the basics of commerce.",
  "Economics": "How markets, money and economies work.",
  "Political Science": "Governance, constitutions, rights and citizenship.",
};

/** Class-wise subject list, exactly as taught at BALO. */
const STAGES: { stage: string; classes: string; note: string; subjects: string[] }[] = [
  {
    stage: "Lower Primary",
    classes: "Class 1 – Class 4",
    note: "Foundation years — strong English, number sense and good habits.",
    subjects: ["Mathematics", "English Grammar", "English Literature", "Hindi", "General Science", "Moral Science"],
  },
  {
    stage: "Upper Primary",
    classes: "Class 5",
    note: "Social studies splits into History and Geography, and computer work begins.",
    subjects: ["Mathematics", "English Grammar", "English Literature", "Hindi", "General Science", "History", "Geography", "Computer Applications"],
  },
  {
    stage: "Middle School",
    classes: "Class 6 – Class 8",
    note: "Science separates into Physics, Chemistry and Biology with laboratory practicals.",
    subjects: ["Mathematics", "English Grammar", "English Literature", "Hindi", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Applications"],
  },
  {
    stage: "Secondary",
    classes: "Class 9 – Class 10",
    note: "Board-exam years, with Commercial Applications added.",
    subjects: ["Mathematics", "English Grammar", "English Literature", "Hindi", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Applications", "Commercial Applications"],
  },
  {
    stage: "Senior Secondary",
    classes: "Class 11 – Class 12",
    note: "Economics and Political Science join the senior curriculum.",
    subjects: ["Mathematics", "English Grammar", "English Literature", "Hindi", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Applications", "Commercial Applications", "Economics", "Political Science"],
  },
];

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  return (
    <section ref={ref} className="relative min-h-[70vh] flex items-center overflow-hidden pt-24">
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        <img src={hero} alt="Students holding physics, chemistry and biology subject cards at Balo English Medium School"
          className="size-full object-cover" width={1600} height={1024} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-accent/70" />
      </motion.div>
      <div className="max-w-7xl mx-auto px-6 w-full text-white">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="text-xs uppercase tracking-[0.25em] text-secondary font-bold mb-4">Academics</div>
          <h1 className="text-5xl md:text-7xl font-black text-balance leading-[0.95]">
            The subjects we <span className="italic text-secondary">teach.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
            A full English-medium curriculum, class by class — from Moral Science and General Science
            in the early years to Physics, Chemistry, Biology, Economics and Political Science in the
            senior classes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function StageSection({ stage, index }: { stage: (typeof STAGES)[number]; index: number }) {
  return (
    <section className={index % 2 === 1 ? "bg-card px-6 py-16" : "px-6 py-16"}>
      <div className="mx-auto max-w-7xl">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mb-10 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">{stage.classes}</div>
          <h2 className="text-balance font-display text-4xl font-bold md:text-5xl">{stage.stage}</h2>
          <p className="mt-4 text-muted-foreground">{stage.note}</p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stage.subjects.map((name, i) => {
            const Icon = ICONS[name] ?? GraduationCap;
            return (
              <motion.article
                key={name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-border bg-background p-6 shadow-soft"
              >
                <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-2 font-display text-xl font-bold">{name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {DESCRIPTIONS[name] ?? ""}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SubjectsPage() {
  return (
    <main>
      <Hero />
      {STAGES.map((stage, i) => (
        <StageSection key={stage.stage} stage={stage} index={i} />
      ))}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <a href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-accent-foreground shadow-soft transition-transform hover:scale-105">
            Visit our classrooms <ArrowRight className="size-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
