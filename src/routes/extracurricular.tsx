import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Trophy, Sun, Activity, PartyPopper, Music, Sparkles, Calendar, MapPin, ArrowRight,
} from "lucide-react";

import sportsDay from "@/assets/sports-day.jpg";
import summerCamp3 from "@/assets/drive3-24.jpg";
import summer25a from "@/assets/summer25-new-01.jpg";
import summer25b from "@/assets/summer25-new-02.jpg";
import summer26a from "@/assets/summer26-new-01.jpg";
import summer26b from "@/assets/summer26-new-02.jpg";
import summer26c from "@/assets/summer26-new-03.jpg";
import rugby from "@/assets/rugby.jpg";
import footballNew from "@/assets/sports-football.jpg";
import funFiesta from "@/assets/fun-fiesta.jpg";
import funFiestaA from "@/assets/funfiesta-new-01.jpg";
import funFiestaB from "@/assets/funfiesta-new-02.jpg";
import musicAsset from "@/assets/music.jpg";
import musicNew from "@/assets/music-new.jpg";
import dance1 from "@/assets/dance-new-1.jpg";
import dance2 from "@/assets/dance-new-2.jpg";
import dance3 from "@/assets/dance-new-3.jpg";
import dance4 from "@/assets/dance-new-4.jpg";
import hero from "@/assets/playground.jpg";
import { MediaCarousel } from "@/components/MediaCarousel";
import { useLightbox, TapHint } from "@/components/page-kit";


const music = musicAsset;

export const Route = createFileRoute("/extracurricular")({
  head: () => ({
    meta: [
      { title: "Extracurricular Activities — Balo English Medium School, Howrah" },
      { name: "description", content: "Discover sports day, summer camp, football, dance, music, and fun fiesta at Balo English Medium School — where learning extends beyond the classroom." },
      { property: "og:title", content: "Extracurricular Activities — Balo English Medium School" },
      { property: "og:description", content: "Sports day, summer camp, football, dance, music, and fun fiesta at Balo English Medium School, Howrah." },
      { property: "og:image", content: sportsDay },
    ],
    links: [{ rel: "canonical", href: "/extracurricular" }],
  }),
  component: ExtracurricularPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

type Activity = {
  icon: typeof Trophy;
  title: string;
  image: string;
  carousel?: string[];
  season: string;
  description: string;
  highlights: string[];
};

const activities: Activity[] = [
  {
    icon: Trophy,
    title: "Sports Day",
    image: sportsDay,
    season: "Annual Event",
    description: "Our Annual Sports Day is the highlight of the year. Children compete in races, relays, sack races, and team games, learning sportsmanship, discipline, and the joy of movement.",
    highlights: ["Track & field races", "Team games", "House competitions", "Medals & certificates"],
  },
  {
    icon: Sun,
    title: "Summer Camp",
    image: summer26a,
    carousel: [summer26a, summer26b, summer26c, summer25a, summer25b,],
    season: "Summer Break",
    description: "During summer break, our campus transforms into a creative playground. Students enjoy art, crafts, storytelling, music, dance, and outdoor adventures in a safe, supervised environment.",
    highlights: ["Arts & crafts", "Music & dance", " Game sessions", "Science Experiments"],
  },
  {
    icon: Activity,
    title: "Football",
    image: rugby,
    carousel: [rugby, footballNew],
    season: "Year-round Training",
    description: "Football builds strength, teamwork, and resilience. Our boys train regularly and play friendly matches, learning fair play and the joy of being part of a team.",
    highlights: ["Weekly practice sessions", "Boys' team participation", "Fitness & coordination", "Inter-school matches"],
  },
  {
    icon: PartyPopper,
    title: "Fun Fiesta",
    image: funFiesta,
    carousel: [funFiesta, funFiestaA, funFiestaB],
    season: "Annual Carnival",
    description: "Fun Fiesta is our annual carnival filled with games, rides, food stalls, performances, and laughter. It brings students, families, and teachers together to celebrate community.",
    highlights: ["Carnival games & rides", "Student performances", "Food stalls", "Family-friendly fun"],
  },
  {
    icon: Music,
    title: "Music",
    image: music,
    carousel: [musicNew, music],
    season: "Weekly Sessions",
    description: "Students learn vocals and harmonium under the guidance of our music teacher. Music classes nurture rhythm, confidence, and a lifelong love for the arts.",
    highlights: ["Harmonium & vocal training", "Choir & group singing", "Cultural performances", "Festival celebrations"],
  },
  {
    icon: Sparkles,
    title: "Dance",
    image: dance1,
    carousel: [dance1, dance2, dance3, dance4],
    season: "Cultural Programme",
    description: "Dance at Balo helps children move with confidence, express feelings without words, and celebrate every festival together. Students learn choreography for annual events, cultural days, and school celebrations.",
    highlights: ["Group choreography", "Festival performances", "Confidence & stage presence", "Team coordination"],
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
          alt="Children playing at Balo English Medium School"
          className="size-full object-cover"
          width={1600}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-accent/70" />
      </motion.div>
      <div className="max-w-7xl mx-auto px-6 w-full text-white">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="text-xs uppercase tracking-[0.25em] text-secondary font-bold mb-4">
            Extracurricular
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-balance leading-[0.95]">
            Learning beyond the <span className="italic text-secondary">classroom.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
            At Balo English Medium School, sports, camps, and celebrations are part of the curriculum. We believe happy, active children become confident, well-rounded adults.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ActivitiesGrid() {
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
            Activities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Four events our students never forget.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From the thrill of Sports Day to the creativity of Summer Camp, these programs shape character, friendships, and lifelong memories.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {activities.map((a, i) => (
            <motion.article
              key={a.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6 }}
              className="group rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
            >
              <div className="aspect-[16/10] overflow-hidden">
                {a.carousel ? (
                  <MediaCarousel images={a.carousel} title={a.title} aspect="aspect-[16/10]" onOpen={lightbox.open} />
                ) : (
                  <div className="relative size-full cursor-zoom-in" onClick={() => lightbox.open(a.image, a.title)}>
                    <img
                      src={a.image}
                      alt={a.title}
                      width={1280}
                      height={900}
                      loading="lazy"
                      className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <TapHint />
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                      <a.icon className="size-5" />
                    </div>
                    <h3 className="font-display text-2xl font-bold">{a.title}</h3>
                  </div>
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {a.season}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {a.description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {a.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Calendar className="size-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      {lightbox.node}
    </section>

  );
}

function JoinCTA() {
  return (
    <section className="py-28 px-6 bg-card">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeUp}
        className="max-w-5xl mx-auto rounded-[2rem] gradient-warm border border-border p-10 md:p-16 text-center shadow-card"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent px-4 py-1.5 text-xs font-semibold mb-6">
          <MapPin className="size-4" /> Salkia, Howrah
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
          Every child deserves a place to <span className="text-accent italic">play, grow, and shine.</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Enrol your child at Balo English Medium School and give them access to academics, sports, arts, and community life — all free of cost.
        </p>
        <a
          href="/#contact"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-8 py-4 font-semibold shadow-soft hover:scale-105 transition-transform"
        >
          Enquire Now <ArrowRight className="size-4" />
        </a>
      </motion.div>
    </section>
  );
}

function ExtracurricularPage() {
  return (
    <main>
      <Hero />
      <ActivitiesGrid />
      <JoinCTA />
    </main>
  );
}
