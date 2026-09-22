import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, ArrowRight, Sparkles, X, Bell, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotices, markAllNoticesSeen, useNotifyPreference } from "@/lib/notices";

import sports from "@/assets/sports-day.jpg";
import summer from "@/assets/summer-camp.jpg";
import funFiesta from "@/assets/fun-fiesta.jpg";
import funFiestaA from "@/assets/funfiesta-new-01.jpg";
import funFiestaB from "@/assets/funfiesta-new-02.jpg";
import football from "@/assets/rugby.jpg";
import colorStorm from "@/assets/staff-group.jpg";
import colorStormA from "@/assets/colorstorm-new-01.jpg";
import colorStormB from "@/assets/colorstorm-new-02.jpg";
import music from "@/assets/music.jpg";
import musicNew from "@/assets/music-new.jpg";
import summer25a from "@/assets/summer25-new-01.jpg";
import summer25b from "@/assets/summer25-new-02.jpg";
import summer26a from "@/assets/summer26-new-01.jpg";
import summer26b from "@/assets/summer26-new-02.jpg";
import summer26c from "@/assets/summer26-new-03.jpg";
import womensDay from "@/assets/drive-gallery2-03.jpg";
import womensDayGroup from "@/assets/drive-gallery2-05.jpg";
import picnic from "@/assets/drive-gallery2-13.jpg";
import picnicTrain from "@/assets/drive-gallery2-11.jpg";
import sportsPodium from "@/assets/drive-gallery2-04.jpg";
import trophiesBg from "@/assets/trophies-bg.jpg";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Notice & Events — Balo English Medium School" },
      { name: "description", content: "Notice board, latest events, celebrations, and stories from Balo English Medium School in Howrah." },
      { property: "og:title", content: "Notice & Events — Balo English Medium School" },
      { property: "og:description", content: "Notices, Annual Sports Day, Summer Camp, Color Storm, Picnic, Women's Day and more — see what's happening at Balo." },
      { property: "og:image", content: sports },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsPage,
});

type EventPost = {
  img: string;
  gallery?: string[];
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  details: string;
  upcoming?: boolean;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const posts: EventPost[] = [
  {
    img: sports,
    gallery: [sports, sportsPodium],
    date: "December 2026",
    tag: "Upcoming",
    title: "Sports Day 2026 — save the date",
    excerpt: "Our next Annual Sports Day arrives this December with races, games, music, guests, and the whole Balo family cheering together.",
    upcoming: true,
    details: "Sports Day 2026 will bring the full Balo community together for one of the most joyful days of the school year. Students, teachers, parents, ex-students, guests, and volunteers from different countries will gather to celebrate confidence, teamwork, and healthy competition. The programme will include instrumental music, singing, dance, a mock drill, and energetic games such as 200m running, spoon racing, sack racing, catch the balloon, memory game, fill the bucket with sponge, and many more activities. It will also be a time to honour leaving students with a warm farewell, so they feel remembered as part of the Balo family. More than winning, the day is about courage, discipline, laughter, and every child feeling proud to stand before the community.",
  },
  {
    img: summer26a,
    gallery: [summer26a, summer26b, summer26c],
    date: "June 2026",
    tag: "Camp",
    title: "Summer Camp 2026 — a week of pure imagination",
    excerpt: "Held this June, our week-long Summer Camp filled the school with art, creative design, presentations, games, and confident student voices.",
    details: "Summer Camp 2026 gave students a bright, structured week of learning beyond regular classes. The camp runs five days in a week, with a fresh topic and activity each day so children can discover new interests. Students explored drawing, art and craft, creative designs, and group projects that helped them work with imagination and patience. Talent show sessions gave children space to sing, speak, perform, and show skills that are not always visible in the classroom. Movie day brought fun and reflection, while non-fire cooking encouraged teamwork, hygiene, and practical life skills. The camp also included smart-class presentations where students watched and discussed ideas together. It was a week of confidence-building, friendship, and joyful learning.",
  },
  {
    img: colorStormA,
    gallery: [colorStormA, colorStormB, colorStorm],
    date: "March 2026",
    tag: "Art",
    title: "Color Storm 2026 — creativity with purpose",
    excerpt: "Our inter-school drawing and painting competition became a colourful exhibition of handmade work, student confidence, and community support.",
    details: "Color Storm 2026 celebrated the artistic side of Balo through an inter-school drawing and painting competition. Students prepared with great care, using colour, imagination, and observation to express their ideas on paper. The event also included an art exhibition where children displayed creative handmade objects made with patience and teamwork. These objects were arranged for visitors to see and buy, helping students understand the value of effort, presentation, and creativity. Teachers guided the children, but the confidence came from the students themselves. Color Storm was not only about colourful walls and happy faces; it was about giving children a platform to be seen as artists, makers, and young people with original ideas worth celebrating.",
  },
  {
    img: funFiestaA,
    gallery: [funFiestaA, funFiestaB, funFiesta],
    date: "December 2025",
    tag: "Fun Fiesta",
    title: "Fun Fiesta: stalls, food, games and friendship",
    excerpt: "Students organised stalls where they sold food, games, and handmade objects, turning the school into a joyful community fair.",
    details: "Fun Fiesta is one of Balo's most lively student-led events. Children work in groups to plan and organise stalls where they sell food, games, small handmade objects, and fun activities for visitors. The event teaches responsibility in a natural way: students discuss ideas, arrange materials, speak to guests, handle simple counting, and learn how cooperation makes a stall successful. Teachers guide them, but the excitement belongs to the children. Families, staff, volunteers, and friends come together around long tables, shared plates, and cheerful noise. Fun Fiesta turns the school into a small festival where students learn confidence, communication, and teamwork while enjoying the happiness of serving others and celebrating as one Balo family.",
  },
  {
    img: summer25a,
    gallery: [summer25a, summer25b, summer],
    date: "May 2025",
    tag: "Camp",
    title: "Summer Camp wraps up a week of discovery",
    excerpt: "A week of drawing, art and craft, talent shows, movie day, non-fire cooking, conversation circles, and outdoor games.",
    details: "The 2025 Summer Camp gave children a memorable week filled with activities that stretched their imagination and confidence. It happened five days in a week, with a different theme each day to keep the atmosphere fresh and exciting. Students spent time on drawing, art and craft, and creative designs, making colourful work with their own hands. Talent shows allowed them to sing, act, speak, dance, and share hidden abilities in front of friends. Movie day brought relaxation and discussion, while non-fire cooking helped them learn safety, cleanliness, and teamwork. Every activity was planned to make children feel capable, expressive, and happy. The camp proved that learning can be serious, useful, and full of joy at the same time.",
  },
  {
    img: picnic,
    gallery: [picnic, picnicTrain],
    date: "January 2024",
    tag: "Picnic",
    title: "Picnic 2024 — a day outside the classroom",
    excerpt: "Students travelled, played, wore flower crowns, shared food, and enjoyed a day of friendship beyond the school walls.",
    details: "The January 2024 picnic gave Balo students a beautiful chance to experience learning outside the classroom. For many children, travelling together by train and spending a full day with friends felt like a special adventure. Students wore flower head crowns, played games, shared snacks, laughed with teachers, and enjoyed the freedom of open space. Picnics are important because they create memories children carry for years; they also teach discipline, care for one another, and confidence in public places. Teachers and volunteers stayed close to every group, making sure the day remained safe and joyful. The picnic reminded everyone that education is not only books and exams. It is also friendship, wonder, movement, and discovering the world together.",
  },
  {
    img: womensDay,
    gallery: [womensDay, womensDayGroup],
    date: "March 2023",
    tag: "Celebration",
    title: "Women's Day Celebration 2023",
    excerpt: "Students honoured women with performances, posters, and a joyful celebration of courage, education, dignity, and leadership.",
    details: "The Women's Day Celebration in March 2023 was a meaningful event for Balo because the school itself has grown through the leadership and care of strong women. Students prepared the space with a Happy Women's Day banner, posters, decorations, and performances that honoured mothers, teachers, girls, and women who guide the community. The celebration encouraged children to speak about respect, equality, safety, and education for every girl. Students stood together, performed with confidence, and learned that Women's Day is not only a calendar event; it is a reminder to value courage and dignity every day. The programme also connected with Balo's wider work for young women through safe shelter, training, and opportunities for an independent future.",
  },
  {
    img: football,
    date: "March 2022",
    tag: "Football",
    title: "Boys take the field: Balo's football match",
    excerpt: "Balo organised a boys' football game where students played with volunteers from other countries and learned teamwork on the field.",
    details: "In March 2022, Balo organised a football game where the boys played with volunteers from other countries. The match gave students a chance to test their energy, coordination, and courage in a friendly setting. Football is powerful because it teaches lessons that fit both school and life: passing at the right time, trusting teammates, accepting mistakes, following rules, and continuing even when tired. The volunteers brought enthusiasm and encouragement, while the students brought speed, laughter, and determination. For the boys, the event was not only a game; it was a moment of pride and connection with people from beyond their neighbourhood. The football match showed how sport can build friendship without needing many words.",
  },
  {
    img: sports,
    gallery: [sports, sportsPodium],
    date: "January 2022",
    tag: "Sports",
    title: "Sports Day: 480 children, one spirit",
    excerpt: "From races and games to dance, singing, mock drill, and farewells, Sports Day brought students, parents, teachers, and guests together.",
    details: "Sports Day 2022 was a proud celebration of energy, discipline, and togetherness at Balo English Medium School. The day included instrumental music, singing, dance, a mock drill, and a wide range of games such as 200m running, spoon racing, sack racing, catch the balloon, memory game, fill the bucket with sponge, and many more. Students, teachers, and parents all participated, which made the event feel like a true community festival. Guests, volunteers from different countries, and ex-students were also invited, adding warmth and encouragement. The programme included a farewell for leaving students, reminding them that Balo remains part of their story. Sports Day showed that every child can learn courage, fairness, patience, and teamwork while having fun.",
  },
  {
    img: musicNew,
    gallery: [musicNew, music],
    date: "Ongoing",
    tag: "Music",
    title: "Harmonium classes find a second home",
    excerpt: "Weekly music sessions give children a new language made of ragas, rhythm, listening, discipline, and pure delight.",
    details: "Music at Balo gives children a gentle and joyful way to express themselves. Harmonium classes help students listen carefully, follow rhythm, remember patterns, and sing with confidence. For children who may be shy in regular lessons, music often becomes a doorway to participation. The sessions also teach discipline because every note needs patience and practice. Students learn to sit together, respect the instrument, follow the teacher, and encourage one another. Over time, music becomes part of school celebrations, assemblies, and cultural programmes, giving children a chance to perform for friends and family. These classes remind students that education includes the heart as well as the mind, and that beauty can be learned step by step.",
  },
];

function NoticeBoard() {
  const [notifyEnabled, setNotifyEnabled] = useNotifyPreference();
  const notices = useNotices();
  useEffect(() => { markAllNoticesSeen(notices.map((n) => n.id)); }, [notices]);
  return (
    <section className="py-16 px-6 bg-card">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-2">
              Notice Board
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Latest notices</h2>
          </div>
          <label className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">
            <input
              type="checkbox"
              checked={notifyEnabled}
              onChange={(e) => setNotifyEnabled(e.target.checked)}
              className="size-4 accent-accent"
            />
            {notifyEnabled ? <BellRing className="size-4 text-accent" /> : <Bell className="size-4" />}
            Notify me of new notices
          </label>
        </div>
        {notices.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
            <Bell className="size-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Empty — no notices right now. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((n) => (
              <article key={n.id} className="relative p-5 rounded-2xl bg-background border border-border shadow-soft">
                <span className="absolute top-4 right-4 size-2 rounded-full bg-red-500 animate-pulse" />
                <div className="text-xs text-muted-foreground mb-1">{new Date(n.publish_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</div>
                <h3 className="font-display text-xl font-bold">{n.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{n.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EventsPage() {
  const [selected, setSelected] = useState<EventPost | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [selected]);

  return (
    <main className="pt-24">
      <section ref={heroRef} className="relative py-20 px-6 overflow-hidden text-white">
        <motion.video style={{ scale: heroScale }}
          src="/video/events-banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover origin-center"
          aria-hidden
        />
        <img
          src={trophiesBg}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-accent/80" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold mb-6">
              <Sparkles className="size-3.5" /> News from Salkia
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-balance leading-[0.95]">
              Notice & <span className="italic text-secondary">Events.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
              Every month at Balo English Medium School brings something to celebrate. Here are a few moments we love sharing.
            </p>
          </motion.div>
        </div>
      </section>

      <NoticeBoard />

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p, i) => (
            <motion.article
              key={p.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group rounded-3xl overflow-hidden bg-card border border-border shadow-soft flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${p.upcoming ? "bg-secondary/20 text-secondary-foreground" : "bg-accent/10 text-accent"}`}>
                    {p.tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3.5" /> {p.date}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold leading-snug">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{p.excerpt}</p>
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105"
                >
                  Read more <ArrowRight className="size-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-card">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <MapPin className="size-8 mx-auto text-accent mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Want to attend our next event?</h2>
          <p className="mt-4 text-muted-foreground">
            Visitors, well-wishers, and volunteers are always welcome at Balo. Drop us a line and we'll save you a chair.
          </p>
          <a
            href="mailto:baloindia2015@gmail.com"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-7 py-3.5 font-semibold shadow-soft hover:scale-105 transition-transform"
          >
            Email Us <ArrowRight className="size-4" />
          </a>
        </motion.div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/75 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-card shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
              <img src={selected.img} alt={selected.title} className="size-full object-cover" />
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close event details"
                className="absolute right-4 top-4 rounded-full bg-card/90 p-2 text-foreground shadow-soft transition-transform hover:scale-105"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-full bg-accent/10 px-3 py-1 font-semibold text-accent">{selected.tag}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="size-4" /> {selected.date}</span>
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-balance">{selected.title}</h2>
              <p className="mt-5 text-base md:text-lg leading-relaxed text-muted-foreground">{selected.details}</p>
              {selected.gallery && selected.gallery.length > 1 && (
                <div className="mt-7 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selected.gallery.map((img, index) => (
                    <img key={`${selected.title}-${index}`} src={img} alt={`${selected.title} moment ${index + 1}`} className="aspect-[4/3] rounded-2xl object-cover" loading="lazy" />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}