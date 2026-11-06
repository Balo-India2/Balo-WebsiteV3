import { createFileRoute } from "@tanstack/react-router";
import { motion } from "@/lib/limited-motion";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Code2, Code, Heart, Sparkles } from "lucide-react";

import developers from "@/assets/developers-new.jpg";
import banner from "@/assets/developers-banner-code.jpg";
import rehanPhoto from "@/assets/developer-rehan-jamil.jpg";
import shahilPhoto from "@/assets/developer-shahil-sharma.jpg";
import shibranPhoto from "@/assets/developer-shibran-khatoon.jpg";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Developers — Balo English Medium School" },
      { name: "description", content: "From students to developers: Rehan Jamil, Shahil Sharma and Shibran Khatoon — BALO students who built this website for their school." },
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
    note: "The one in the white and brown shirt — design and development.",
    color: "from-accent to-secondary",
  },
  {
    name: "Shibran Khatoon",
    role: "Developer",
    note: "The one in the brown dress — design and gallery management.",
    color: "from-secondary to-primary",
  },
];

const stories: {
  name: string;
  photo: string;
  alt: string;
  objectClass?: string;
  paragraphs: string[];
}[] = [
  {
    name: "Rehan Jamil",
    photo: rehanPhoto,
    alt: "Rehan Jamil, student developer at Balo English Medium School",
    paragraphs: [
      "I am Rehan Jamil, a student of Balo English Medium School — a boy who grew up in these classrooms, with a mind that loves science, technology, and hard problems.",
      "I joined this school when I was just six years old. I was little. I knew almost nothing.",
      "Balo taught me everything. How to read. How to write. How to think. The teachers here are very helpful; they never let a child feel left behind.",
      "I was always interested in science and technology. I liked sitting with a difficult question in mathematics or in coding until it opened — the more complex it was, the more I wanted to solve it.",
      "Director Rehana Miss and Principal Roshan Ara Miss gave me the chance to attend many workshops and seminars with great personalities. Those doors changed my life.",
      "And most important of all: we were mentored by Mr Samuel Clay from the United Kingdom. His weekly guidance taught us how to build with care.",
      "This website is our thank you to the school that made us who we are.",
    ],
  },
  {
    name: "Shahil Sharma",
    photo: shahilPhoto,
    alt: "Shahil Sharma, student developer at Balo English Medium School",
    paragraphs: [
      "I am Shahil Sharma, a student of Balo English Medium School. I came here later than some of my friends, but this school became my home just the same.",
      "I joined BALO when I was fourteen years old. I was already good at calculations and precision — numbers made sense to me — and I also loved technology and problem-solving.",
      "Balo's teachers are very helpful. They gave me a place to grow what I was already good at, and to learn what I did not yet know.",
      "Director Rehana Miss and Principal Roshan Ara Miss gave me the opportunity to attend workshops and seminars with great personalities — the same doors they opened for my teammates.",
      "And most important of all: we were mentored by Mr Samuel Clay from the United Kingdom. He taught us how to think like builders, not just students.",
      "We made this website with love, as a small thank you to the school that shaped us.",
    ],
  },
  {
    name: "Shibran Khatoon",
    photo: shibranPhoto,
    alt: "Shibran Khatoon, student developer at Balo English Medium School",
    objectClass: "object-[center_28%]",
    paragraphs: [
      "I am Shibran Khatoon, a student of Balo English Medium School — a girl with a mind full of thoughts, courage, and big dreams.",
      "I joined this school when I was just eight years old. I was so small, so shy, and I knew nothing.",
      "And now, I am in Class 12.",
      "Almost ten or eleven years… I have grown up here. This school has seen me grow from a small child to a young woman.",
      "This school taught me how to read, how to write, how to speak, and how to believe in myself. The most special thing about this website is that it is not made by outsiders.",
      "It is made by the students of this very school. And not students who joined just a few years ago. We are the ones who came here with our little feet, when we did not even know how to hold a pencil.",
      "And today, by God's grace, those same small fingers are always on the keyboard.",
      "Director Rehana Miss and Principal Roshan Ara Miss opened doors for us — workshops and seminars with great personalities.",
      "And most important of all: we were mentored by Mr Samuel Clay from the United Kingdom.",
      "So we made this website with all our love, as a small thank you to our school.",
      "We are really grateful, and we are so proud to be a part of this.",
      "It is not just a website. It is our love for the school that made us who we are today.",
      "With all my love.",
    ],
  },
];

function DevelopersPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  return (
    <main>
      <section ref={heroRef} className="relative min-h-[55vh] flex items-center overflow-hidden px-6 py-20 pt-24 text-white">
        <motion.div style={{ y, scale: heroScale }} className="absolute inset-0 -z-10 will-change-transform">
          <img
            src={banner}
            alt="Developer workstation with code on screen"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-accent/80" />
        </motion.div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold mb-6">
              <Code2 className="size-3.5" /> Built by students, for the school
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-balance leading-[0.95]">
              Meet the <span className="italic text-secondary">developers.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
              Students of Balo English Medium School who designed and built this website to share their school's story with the world.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
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
              transition={{ duration: 4, repeat: 3 }}
              className="absolute -top-4 -right-4 bg-card rounded-2xl p-4 shadow-card border border-border"
            >
              <Sparkles className="size-6 text-accent" />
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
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
                  viewport={{ once: true, amount: 0.2 }}
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
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-4">
              How We Learned
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
              From classrooms to code editors.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-1 gap-6 max-w-2xl">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
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

      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mb-16 max-w-2xl"
          >
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              From students to developers
            </div>
            <h2 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
              We grew up here. Then we built this.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Not outsiders. Not a company. Three BALO students who walked in as children — and whose fingers are now on the keyboard.
            </p>
          </motion.div>

          <div className="space-y-20">
            {stories.map((story, i) => (
              <motion.article
                key={story.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                custom={i}
                className={`grid items-start gap-8 lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="lg:sticky lg:top-28">
                  <div className="overflow-hidden rounded-[2rem] border border-border bg-background shadow-card">
                    <img
                      src={story.photo}
                      alt={story.alt}
                      className={`aspect-[3/4] w-full object-cover ${story.objectClass ?? "object-top"}`}
                    />
                  </div>
                </div>
                <div className="flex h-full flex-col rounded-[2rem] border border-border bg-background p-6 shadow-soft sm:p-8">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    {String(i + 1).padStart(2, "0")} · {story.name}
                  </div>
                  <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                    {story.paragraphs.map((p) => (
                      <p key={p.slice(0, 48)}>{p}</p>
                    ))}
                  </div>
                  <p className="mt-auto pt-8 font-display text-xl italic text-foreground">
                    ~ {story.name}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
