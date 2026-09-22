import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Code2, Code, Heart, Sparkles } from "lucide-react";

import developers from "@/assets/developers-new.jpg";
import banner from "@/assets/developers-banner-code.jpg";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Developers — Balo English Medium School" },
      { name: "description", content: "Meet the developers behind the Balo English Medium School website: Rehan Jamil, Shahil Sharma, and Shibran Khatoon." },
      { property: "og:title", content: "Developers — Balo English Medium School" },
      { property: "og:description", content: "The team that built this website with love for Balo English Medium School." },
      { property: "og:image", content: developers },
    ],
    links: [{ rel: "canonical", href: "/developers" }],
  }),
  component: DevelopersPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const team = [
  {
    name: "Rehan Jamil",
    role: "Developer",
    note: "The one in the black jacket — front-end & design.",
    color: "from-primary to-accent",
  },
  {
    name: "Shahil Sharma",
    role: "Developer",
    note: "The one in the white and brown shirt —Designing and developement.",
    color: "from-accent to-secondary",
  },
  {
    name: "Shibran Khatoon",
    role: "Developer",
    note: "The one in the brown dress — Designing and gallery Management.",
    color: "from-secondary to-primary",
  },
];

function DevelopersPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  return (
    <main className="pt-24">
      <section ref={heroRef} className="relative min-h-[55vh] flex items-center py-20 px-6 text-white overflow-hidden">
        <motion.img style={{ scale: heroScale }}
          src={banner}
          alt="Developer workstation with code on screen"
          className="absolute inset-0 size-full object-cover origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-accent/80" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold mb-6">
              <Code2 className="size-3.5" /> Built by students, for the school
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-balance leading-[0.95]">
              Meet the <span className="italic text-secondary">developers.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
              Students and contributors from India who designed and built this website to share Balo English Medium School's story with the world.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="absolute -inset-4 gradient-warm rounded-[2rem] -z-10 blur-2xl opacity-60" />
            <img
              src={developers}
              alt="Rehan Jamil, Shahil Sharma, and Shibran Khatoon — the development team"
              width={1080}
              height={1440}
              className="rounded-3xl shadow-card w-full aspect-[3/4] object-cover"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-card rounded-2xl p-4 shadow-card border border-border"
            >
              <Sparkles className="size-6 text-accent" />
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-4">
              The Team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
              Code with care, design with heart.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              This website was crafted by three developers who wanted to give Balo English Medium School a beautiful digital home — so every parent, donor, and well-wisher can see what the school does for the children of Salkia.
            </p>

            <div className="mt-10 space-y-4">
              {team.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border shadow-soft"
                >
                  <div className={`size-14 shrink-0 rounded-2xl bg-gradient-to-br ${m.color} text-white grid place-items-center font-display font-black text-xl`}>
                    {m.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-lg font-bold">{m.name}</div>
                    <div className="text-xs uppercase tracking-widest text-accent font-semibold mt-0.5">{m.role}</div>
                    <div className="text-sm text-muted-foreground mt-1">{m.note}</div>
                  </div>
                  <Code className="size-5 text-muted-foreground/40" />
                </motion.div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl gradient-warm border border-border">
              <Heart className="size-6 text-accent mb-3" />
              <p className="text-sm italic text-foreground/80 leading-relaxed">
                "We built this site as our way of saying thank you to a school that proves education and love can change a neighbourhood."
              </p>
              <div className="mt-3 text-xs tracking-widest uppercase text-muted-foreground font-semibold">— The Dev Team</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} variants={fadeUp} className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-4">
              How We Learned
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
              From classrooms to code editors.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-1 gap-6 max-w-2xl">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}
              className="p-8 rounded-3xl bg-background border border-border shadow-soft"
            >
              <div className="size-12 rounded-2xl bg-accent/10 text-accent grid place-items-center mb-4">
                <Sparkles className="size-6" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Weekly Sessions with Mr Samuel Clay</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We are mentored by <strong>Mr Samuel Clay</strong>, a software engineer at Amazon based in the United Kingdom. Every week, he takes time out of his schedule to run live sessions with us — reviewing code, teaching engineering best practices, and patiently answering every question. His weekly guidance has shaped how we think, build, and ship software.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
