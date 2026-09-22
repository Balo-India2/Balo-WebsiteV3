import { createFileRoute } from "@tanstack/react-router";
import { useLightbox, TapHint } from "@/components/page-kit";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen, Monitor, FlaskConical, Presentation, Wind, Stethoscope, UtensilsCrossed, CheckCircle2,
} from "lucide-react";

import library from "@/assets/library.jpg";
import libraryTree from "@/assets/img-library-tree.jpg";
import computerLab from "@/assets/computer-lab.jpg";
import computerLab2 from "@/assets/drive3-05.jpg";
import scienceExp1 from "@/assets/img-science-exp-a.jpg";
import scienceExp2 from "@/assets/drive3-20-1.jpg";
import scienceExp3 from "@/assets/img-science-exp-b.jpg";
import smartClassAsset from "@/assets/smart-class-new.jpg";
import smartClass2 from "@/assets/drive3-04.jpg";
import acClassroom from "@/assets/ac-classroom.jpg";
import acClassroom2 from "@/assets/drive3-21.jpg";
import healthcareAsset from "@/assets/healthcare.jpg";
import healthcare2 from "@/assets/drive3-12.jpg";
import mealAsset from "@/assets/meal.jpg";
import lunchMeal from "@/assets/lunch-meal.jpg";
import hero from "@/assets/classroom-reading.jpg";

const smartClass = smartClassAsset;
const healthcare = healthcareAsset;
const mealSlides = [mealAsset, lunchMeal];
const librarySlides = [library, libraryTree];
const computerSlides = [computerLab, computerLab2];
const scienceSlides = [scienceExp1, scienceExp2, scienceExp3];
const smartSlides = [smartClassAsset, smartClass2];
const acSlides = [acClassroom, acClassroom2];
const healthcareSlides = [healthcareAsset, healthcare2];

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Facilities — Balo English Medium School, Howrah" },
      { name: "description", content: "Explore Balo English Medium School's modern facilities: library, computer lab, science laboratory, smart classes, and air-conditioned classrooms." },
      { property: "og:title", content: "Facilities — Balo English Medium School" },
      { property: "og:description", content: "Library, computer lab, science laboratory, smart classes, and AC classrooms at Balo English Medium School, Howrah." },
      { property: "og:image", content: smartClass },
    ],
    links: [{ rel: "canonical", href: "/facilities" }],
  }),
  component: FacilitiesPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const facilities = [
  {
    icon: BookOpen,
    title: "Library",
    image: library,
    carousel: librarySlides,
    description: "A warm, inviting space filled with storybooks, reference materials, and periodicals. Our library encourages every child to read for joy and discovery.",
    features: ["Age-graded reading corners", "Hindi & English collections", "Daily reading periods", "Librarian-guided sessions"],
  },
  {
    icon: Monitor,
    title: "Computer Lab",
    image: computerLab,
    carousel: computerSlides,
    description: "A modern computer lab where students learn typing, coding basics, digital literacy, and safe internet practices from an early age.",
    features: ["Updated desktop computers", "Coding & typing programs", "Project-based learning", "Teacher-supervised browsing"],
  },
  {
    icon: FlaskConical,
    title: "Science Laboratory",
    image: scienceExp1,
    carousel: scienceSlides,
    description: "Our science lab turns textbooks into hands-on experiments. Students observe, measure, mix, and discover the principles of physics, chemistry, and biology.",
    features: ["Lab tables & safety equipment", "Microscopes & specimens", "Experiment kits", "Guided practical classes"],
  },
  {
    icon: Presentation,
    title: "Smart Classes",
    image: smartClass,
    carousel: smartSlides,
    description: "Interactive whiteboards, projectors, and multimedia lessons bring concepts to life. Smart classes make learning visual, engaging, and memorable.",
    features: ["Interactive digital boards", "Projector & audio systems", "Animated lesson modules", "Computers-assisted activities"],
  },
  {
    icon: Wind,
    title: "Air-Conditioners",
    image: acClassroom,
    carousel: acSlides,
    description: "Comfortable, climate-controlled classrooms help students stay focused and alert through Howrah's warmest months.",
    features: ["Ceiling AC units in hallrooms", "Bright LED lighting", "Spacious seating", "Clean, ventilated rooms"],
  },
  {
    icon: Stethoscope,
    title: "Free Health Care",
    image: healthcare,
    carousel: healthcareSlides,
    description: "Every student has access to free, on-campus health check-ups and basic medical care. Our visiting doctor monitors growth, treats minor illnesses, and ensures no child misses school for lack of care.",
    features: ["Regular health check-ups", "First aid & basic medicines", "Vision & dental screening", "Doctor on call"],
  },
  {
    icon: UtensilsCrossed,
    title: "Meal after Classes",
    image: mealAsset,
    carousel: mealSlides,
    description: "A nutritious, hot meal is served to every student after classes. For many children, this is their most important meal of the day — shared with friends in a warm, communal atmosphere.",
    features: ["Hot meal for 480+ students", "Balanced, locally sourced nutrition", "Clean, supervised dining space", "No child goes home hungry"],
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
          alt="Balo English Medium School classroom"
          className="size-full object-cover"
          width={1600}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-accent/70" />
      </motion.div>
      <div className="max-w-7xl mx-auto px-6 w-full text-white">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="text-xs uppercase tracking-[0.25em] text-secondary font-bold mb-4">
            Facilities
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-balance leading-[0.95]">
            Spaces that inspire <span className="italic text-secondary">modern learning.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
            From a cozy library to air-conditioned smart classrooms, every corner of Balo English Medium School is built to help children learn with comfort, curiosity, and confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FacilityCarousel({
  images,
  title,
  onOpen,
}: {
  images: string[];
  title: string;
  onOpen?: (src: string, label: string) => void;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setActive((i) => (i + 1) % images.length), 3200);
    return () => window.clearInterval(t);
  }, [images.length]);
  return (
    <div
      className={`relative size-full ${onOpen ? "cursor-zoom-in" : ""}`}
      onClick={() => { const s = images[active]; if (s && onOpen) onOpen(s, title); }}
    >

      {images.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt={`${title} ${i + 1}`}
          loading="lazy"
          initial={false}
          animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.04 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 size-full object-cover"
        />
      ))}
      {onOpen && <TapHint className="bottom-8" />}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Show ${title} image ${i + 1}`}
            onClick={(e) => { e.stopPropagation(); setActive(i); }}
            className={`h-1.5 rounded-full transition-all ${active === i ? "w-6 bg-white" : "w-1.5 bg-white/60"}`}
          />
        ))}
      </div>

    </div>
  );
}

function FacilitiesGrid() {
  const lightbox = useLightbox();
  return (

    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-4">
            What We Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            World-class facilities for every curious mind.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We combine traditional teaching with modern infrastructure so that our students get the best of both worlds — free of cost.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((f, i) => (
            <motion.article
              key={f.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8 }}
              className="group rounded-3xl bg-card border border-border shadow-soft overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {f.carousel ? (
                  <FacilityCarousel images={f.carousel} title={f.title} onOpen={lightbox.open} />
                ) : (
                  <div className="relative size-full cursor-zoom-in" onClick={() => lightbox.open(f.image, f.title)}>
                    <img
                      src={f.image}
                      alt={f.title}
                      width={1280}
                      height={900}
                      loading="lazy"
                      className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <TapHint />
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold">{f.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {f.description}
                </p>
                <ul className="space-y-2">
                  {f.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      {lightbox.node}
    </section>
  );

}

function CTA() {
  return (
    <section className="py-28 px-6 gradient-warm">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeUp}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-balance">
          Want to see our classrooms in person?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Families are welcome to visit Balo English Medium School and experience our facilities firsthand.
        </p>
        <a
          href="/#contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-8 py-4 font-semibold shadow-soft hover:scale-105 transition-transform"
        >
          Schedule a Visit
        </a>
      </motion.div>
    </section>
  );
}

function FacilitiesPage() {
  return (
    <main>
      <Hero />
      <FacilitiesGrid />
      <CTA />
    </main>
  );
}
