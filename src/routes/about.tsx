import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen, Heart, Users, Award, Lightbulb, Quote, ArrowRight,
} from "lucide-react";

import founder from "@/assets/founder.jpg";
import director from "@/assets/director.jpg";
import principal from "@/assets/principal.jpg";
import hero from "@/assets/hero-classroom.jpg";
import group from "@/assets/group-students.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Leadership — Balo English Medium School, Howrah" },
      { name: "description", content: "Meet the founder, director and principal guiding Balo English Medium School in Howrah." },
      { property: "og:title", content: "Leadership — Balo English Medium School" },
      { property: "og:description", content: "Meet the hearts behind Balo English Medium School: founder Mrs Elizabetta Ravoili, director Mrs Rehana Khatoon, and principal Mrs Roshan Ara." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const leaders = [
  {
    name: "Elizabetta, Liam and Anna ",
    role: "Founders",
    image: founder,
    quote: "One classroom can lift an entire lane out of poverty.",
    bio: "A lifelong educator with a heart for the underserved, Mrs Ravoili founded Balo English Medium School to make sure no child in Babudanga or Pilkhana was turned away for lack of money. She believes that dignity begins with a good teacher and a welcoming classroom.",
  },
  {
    name: "Mrs Rehana Khatoon",
    role: "Director",
    image: director,
    quote: "Education is not a privilege; it is a promise we keep.",
    bio: "As Director, Mrs Rehana shapes the day-to-day soul of the school. She oversees curriculum, teacher training, and community outreach, making sure every family feels heard and every child feels safe.",
  },
  {
    name: "Mrs Roshan Ara",
    role: "Principal",
    image: principal,
    quote: "When children feel loved, they learn without fear.",
    bio: "Principal Roshan Ara leads the school with warmth and discipline in equal measure. Under her guidance, Balo English Medium School has grown from a small tuition corner into a full-fledged English-medium learning centre.",
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
          alt="Students at Balo English Medium School"
          className="size-full object-cover"
          width={1600}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-accent/70" />
      </motion.div>
      <div className="max-w-7xl mx-auto px-6 w-full text-white">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="text-xs uppercase tracking-[0.25em] text-secondary font-bold mb-4">
             Leadership
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-balance leading-[0.95]">
            Meet the hearts behind <span className="italic text-secondary">Balo English Medium School.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
            We are a community-run school in Salkia, Howrah, guided by three women who believe that every child deserves love, learning, and a future without limits.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Leadership() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-4">
            Our Leadership
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Three women, one unwavering mission.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Founder, Director, and Principal — each brings a lifetime of care, experience, and vision to our school.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {leaders.map((leader, i) => (
            <motion.article
              key={leader.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8 }}
              className="group rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={leader.image}
                  alt={leader.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-2">
                  {leader.role}
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">{leader.name}</h3>
                <p className="text-sm italic text-muted-foreground mb-4">"{leader.quote}"</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{leader.bio}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Mission() {
  const values = [
    { icon: Heart, title: "Love First", desc: "Every child is welcomed, fed, and respected before any lesson begins." },
    { icon: BookOpen, title: "Quality Education", desc: "English-medium instruction with strong foundations in reading, writing, and reasoning." },
    { icon: Users, title: "Community Roots", desc: "We are run by parents, teachers, and neighbours who believe in shared responsibility." },
    { icon: Lightbulb, title: "Future Ready", desc: "From smart classes to science labs, we prepare children for the world ahead." },
    { icon: Award, title: "Always Free", desc: "No fees, no hidden costs — education is a right, not a product." },
    { icon: ArrowRight, title: "Continuous Growth", desc: "Every year we add new programs, facilities, and opportunities for our children." },
  ];

  return (
    <section className="py-28 px-6 bg-card">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={group}
            alt="Balo English Medium School students together"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-3xl shadow-card w-full aspect-[4/3] object-cover"
          />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-4">
            Our Mission
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
            Building futures, one child at a time.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Balo English Medium School exists to give the children of Salkia, Babudanga, and Pilkhana a school they can be proud of — free of charge, full of possibility, and rooted in the love of the community.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex gap-3 p-4 rounded-2xl bg-background border border-border cursor-default shadow-soft"
              >
                <v.icon className="size-5 text-primary shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-sm">{v.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{v.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ImpactQuote() {
  return (
    <section className="py-28 px-6 relative overflow-hidden gradient-hero text-white">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
        backgroundSize: "40px 40px, 60px 60px",
      }} />
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
        >
          <Quote className="size-12 mx-auto opacity-60" />
          <p className="mt-6 text-2xl md:text-4xl font-display font-medium text-balance leading-snug">
            "We did not wait for a big building. We started with a big heart — and the building grew around it."
          </p>
          <div className="mt-8 text-sm tracking-widest uppercase text-white/80">— Mrs Elizabetta Ravoili, Founder</div>
        </motion.div>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <main>
      <Hero />
      <Leadership />
      <Mission />
      <ImpactQuote />
    </main>
  );
}

