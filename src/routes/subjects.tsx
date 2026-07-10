import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe2,
  Landmark,
  Languages,
  Laptop,
  Coins,
  GraduationCap,
  PenLine,
  MapPin,
  ArrowRight,
} from "lucide-react";

import hero from "@/assets/subjects-banner-new.jpg";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Academics — Balo English Medium School, Howrah" },
      {
        name: "description",
        content:
          "Explore the academic subjects taught at Balo English Medium School: English, Hindi, Bengali, Mathematics, Science, Social Studies, Computer, Economics and more.",
      },
      { property: "og:title", content: "Academics — Balo English Medium School" },
      {
        property: "og:description",
        content:
          "From elementary spelling dictations to high-school physics, chemistry, biology and economics — see the full curriculum.",
      },
      { property: "og:image", content: hero },
    ],
    links: [{ rel: "canonical", href: "/subjects" }],
  }),
  component: SubjectsPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const elementary = [
  {
    icon: Languages,
    title: "English Grammar & Literature",
    desc: "Reading, writing, grammar drills, poetry and story comprehension.",
  },
  {
    icon: BookOpen,
    title: "Hindi",
    desc: "Reading, writing and conversational Hindi from an early age.",
  },
  {
    icon: BookOpen,
    title: "Bengali",
    desc: "Foundational reading and writing in the mother tongue of West Bengal.",
  },
  {
    icon: Globe2,
    title: "Social Studies",
    desc: "Community, environment, culture and civic awareness.",
  },
  {
    icon: PenLine,
    title: "Spelling & Dictations",
    desc: "Daily spelling practice and dictation to build accuracy and confidence.",
  },
];

const highSchool = [
  {
    icon: Calculator,
    title: "Mathematics",
    desc: "Arithmetic, algebra, geometry and reasoning — with regular problem-solving practice.",
  },
  {
    icon: FlaskConical,
    title: "Science — Physics, Chemistry, Biology",
    desc: "Theory paired with hands-on practical sessions in our laboratory: experiments, observation and lab reports.",
  },
  {
    icon: GraduationCap,
    title: "General Knowledge",
    desc: "Current affairs, world facts and everyday awareness.",
  },
  {
    icon: Landmark,
    title: "History",
    desc: "India and the world — timelines, movements and the people who shaped them.",
  },
  {
    icon: MapPin,
    title: "Geography",
    desc: "Physical, human and regional geography with map-work.",
  },
  {
    icon: Laptop,
    title: "Computer & Practical Sessions",
    desc: "Typing, coding basics, digital literacy and supervised hands-on lab time.",
  },
  {
    icon: Coins,
    title: "Commercial Application & Finance",
    desc: "Introduction to business, accounts and personal finance.",
  },
  {
    icon: Coins,
    title: "Economics & Political Science",
    desc: "How societies organise themselves — markets, governance and citizenship.",
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
        <img
          src={hero}
          alt="Students holding physics, chemistry and biology subject cards at Balo English Medium School"
          className="size-full object-cover"
          width={1600}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-accent/70" />
      </motion.div>
      <div className="max-w-7xl mx-auto px-6 w-full text-white">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="text-xs uppercase tracking-[0.25em] text-secondary font-bold mb-4">
            Academics
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-balance leading-[0.95]">
            The subjects we <span className="italic text-secondary">teach.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
            A full English-medium curriculum — from spelling dictations in Class I to physics,
            chemistry, biology, economics and computer practicals in the higher classes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function SubjectSection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: typeof elementary;
}) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
          className="max-w-3xl mb-12"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-4">
            {subtitle}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance">{title}</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <motion.article
              key={s.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl bg-card border border-border shadow-soft"
            >
              <div className="size-11 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
                <s.icon className="size-5" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubjectsPage() {
  return (
    <main>
      <Hero />
      <SubjectSection title="Elementary School" subtitle="Grades I – V" items={elementary} />
      <div className="bg-card">
        <SubjectSection title="High School" subtitle="Grades VI – XII" items={highSchool} />
      </div>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-8 py-4 font-semibold shadow-soft hover:scale-105 transition-transform"
          >
            Visit our classrooms <ArrowRight className="size-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
