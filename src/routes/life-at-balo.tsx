import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Reveal, SamplePair, useLightbox } from "@/components/page-kit";

import baloBackground from "@/assets/balo-background.jpg";
import assembly1 from "@/assets/assembly1.jpg";
import assembly2 from "@/assets/assembly2.jpg";
import classes1 from "@/assets/classroom-1.jpg";
import classes2 from "@/assets/teacher-board.jpg";
import breaktime from "@/assets/break1.jpg";
import breaktime2 from "@/assets/drive-gallery2-15.jpg";
import music1 from "@/assets/music.jpg";
import dance1 from "@/assets/dance-new-1.jpg";
import prac1 from "@/assets/img-science-exp-a.jpg";
import prac2 from "@/assets/computer-lab.jpg";
import lunch1 from "@/assets/meal.jpg";
import lunch2 from "@/assets/lunch-meal.jpg";
import yoga1 from "@/assets/yoga1.jpg";
import yoga2 from "@/assets/yoga2.jpg";
import ref1 from "@/assets/up-classroom-02.jpg";
import ref2 from "@/assets/ref2.jpg";
import nutrition1 from "@/assets/nutrition1.jpg";
import nutrition2 from "@/assets/nutrition2.jpg";

import hygiene1 from "@/assets/hygiene1.jpg";
import hygiene2 from "@/assets/hygiene2.jpg";

import water1 from "@/assets/water1.jpg";
import water2 from "@/assets/water2.jpg";

import rally1 from "@/assets/rally1.jpg";
import rally2 from "@/assets/rally2.jpg";

import result1 from "@/assets/result1.jpg";
import result2 from "@/assets/result2.jpg";

import book1 from "@/assets/book1.jpg";
import book2 from "@/assets/book2.jpg";

import reunion1 from "@/assets/reunion1.jpg";
import reunion2 from "@/assets/reunion2.jpg";

import farewell1 from "@/assets/farewell1.jpg";
import farewell2 from "@/assets/farewell2.jpg";

import gift1 from "@/assets/gift1.jpg";
import gift2 from "@/assets/gift2.jpg";

export const Route = createFileRoute("/life-at-balo")({
  head: () => ({
    meta: [
      { title: "Life at BALO — A day in our school, Howrah" },
      {
        name: "description",
        content:
          "A day at Balo English Medium School: morning assembly and prayer, classes, breaktime, music and dance, practicals, weekly reflection and a hot lunch — plus awareness programmes and school activities.",
      },
      { property: "og:title", content: "Life at BALO — A day in our school" },
      {
        property: "og:description",
        content: "From the morning prayer to the last hot meal of the day — this is life at BALO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LifeAtBaloPage,
});

type Block = { title: string; desc: string; images?: [string?, string?] };

const dayFlow: Block[] = [
  {
    title: "Morning Assembly, Prayer & Activities",
    desc: "The day opens with the whole school together in the hall — the morning prayer, the national pledge, a thought for the day, news headlines read by students and short activities or announcements. It sets a calm, shared tone before the first bell.",
    images: [assembly1, assembly2],
  },
  {
    title: "Classes",
    desc: "Eight periods of about forty minutes each carry the ICSE syllabus through the day, roughly from 10:00 AM to 3:40 PM. Lessons are taught in English medium, with regular class work, homework checks, dictations and unit tests across the three academic terms.",
    images: [classes1, classes2],
  },
  {
    title: "Breaktime",
    desc: "A proper break to eat tiffin, drink water, run in the foyer play area and simply be children. Teachers supervise so that every child is safe, included and has someone to play with.",
    images: [breaktime, breaktime2],
  },
  {
    title: "Music & Dance",
    desc: "Vocals and harmonium with the school music teacher, and choreography sessions for annual events and cultural days. Music and dance give quieter children a stage and every child something to look forward to.",
    images: [music1, dance1],
  },
  {
    title: "Practicals",
    desc: "Science practicals in the laboratory and hands-on sessions in the computer room. Students set up experiments, observe, record results and write lab reports — and learn typing, coding basics and digital skills under supervision.",
    images: [prac1, prac2],
  },
  {
    title: "Reflection",
    desc: "Each week, students write about their good and bad actions of the week — what they did well, where they fell short and what they will do differently. This weekly reflection helps children think honestly about their behaviour, take responsibility and steadily improve.",
    images: [ref1, ref2],
  },
  {
    title: "Lunch",
    desc: "After classes, every student receives a nutritious hot meal, cooked fresh in our kitchen from locally sourced ingredients and served in a clean, supervised dining space. For many of our 480 children this is the most dependable meal of the day.",
    images: [lunch1, lunch2],
  },
];

const awareness: Block[] = [
  {
    title: "Nutrition",
    desc: "Sessions on healthy eating and balanced meals, including regular distribution of fruit such as bananas so students see healthy food as normal, not special.",
    images: [nutrition1, nutrition2],
  },
  {
    title: "Personal Hygiene",
    desc: "Handwashing, nail and hair care, clean uniforms, dental care and safe habits — taught practically and revisited through the year.",
    images: [hygiene1, hygiene2],
  },
  {
    title: "Importance of Water",
    desc: "Why clean drinking water matters, staying hydrated through Howrah's hot months, and not wasting or contaminating water at home and in the neighbourhood.",
    images: [water1, water2],
  },
];

const otherActivities: Block[] = [
  {
    title: "Students Rally for a Clean Neighbourhood",
    desc: "Students take to the lanes of Pilkhana and Babudanga with placards and slogans, educating local families about cleanliness, garbage disposal and the harm caused by improper waste management.",
    images: [rally1, rally2],
  },
  {
    title: "Result Day",
    desc: "Report cards are handed over in person, with teachers sitting down with parents to explain each child's progress, strengths and the areas to work on next term.",
    images: [result1, result2],
  },
  {
    title: "Book Distribution",
    desc: "Textbooks, notebooks and stationery are distributed free to every student at the start of the academic year, so no child begins the year unprepared.",
    images: [book1, book2],
  },
  {
    title: "Reunion",
    desc: "Former students come back to meet their teachers and juniors, share what they are doing now and encourage the current batch — proof to our children of where BALO can lead.",
    images: [reunion1, reunion2],
  },
  {
    title: "Farewell Party",
    desc: "A warm send-off for students completing their board examinations, with performances, speeches, photographs and blessings from the staff.",
    images: [farewell1, farewell2],
  },
  {
    title: "Gift Distribution",
    desc: "Gifts and prizes for students who take part in sports, cultural events and competitions — every participant is recognised, not just the winners.",
    images: [gift1, gift2],
  },
];

function BlockRow({
  b,
  index,
  onOpen,
}: {
  b: Block;
  index: number;
  onOpen: (src: string, label: string) => void;
}) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-2">
      <Reveal>
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {String(index + 1).padStart(2, "0")}
        </div>
        <h3 className="font-display text-2xl font-bold md:text-3xl">{b.title}</h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">{b.desc}</p>
      </Reveal>
      <Reveal i={1}>
        <SamplePair label={b.title} images={b.images} onOpen={onOpen} />
      </Reveal>
    </div>
  );
}

function LifeAtBaloPage() {
  const lightbox = useLightbox();

  return (
    <main>
      <PageHero
        eyebrow="Life at BALO"
        title="One school day, from prayer to"
        highlight="lunch."
        lead="This is what a day at Balo English Medium School actually looks like — and the awareness programmes, rallies and celebrations that fill the rest of our year."
        image={baloBackground}
      />

      {dayFlow.map((b, i) => (
        <Section key={b.title} muted={i % 2 === 1}>
          <BlockRow b={b} index={i} onOpen={lightbox.open} />
        </Section>
      ))}

      <Section title="Yoga Day" eyebrow="21 June">
        <Reveal>
          <p className="mb-6 max-w-3xl leading-relaxed text-muted-foreground">
            On International Yoga Day the whole school gathers for a guided session of simple asanas
            and breathing exercises, with teachers explaining how a few minutes of stillness each
            day helps concentration, posture and calm.
          </p>
        </Reveal>
        <Reveal i={1}>
          <SamplePair
            label="Yoga Day"
             images={[yoga1, yoga2]}
             onOpen={lightbox.open}
           />
        </Reveal>
      </Section>

      <Section title="Awareness Programmes" eyebrow="Health, hygiene & habits" muted>
        <Reveal>
          <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">
            The school regularly organises awareness programmes and seminars for both students and
            parents, because habits learned at school only last when they are practised at home too.
          </p>
        </Reveal>
        <div className="space-y-12">
          {awareness.map((b, i) => (
            <BlockRow key={b.title} b={b} index={i} onOpen={lightbox.open} />
          ))}
        </div>
      </Section>

      <Section title="Other Activities" eyebrow="Through the year">
        <div className="space-y-12">
          {otherActivities.map((b, i) => (
            <BlockRow key={b.title} b={b} index={i} onOpen={lightbox.open} />
          ))}
        </div>
      </Section>

      {lightbox.node}
    </main>
  );
}