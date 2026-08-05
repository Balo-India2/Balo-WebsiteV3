import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Reveal, SamplePair, useLightbox } from "@/components/page-kit";

import hallA from "@/assets/raised-hands.jpg";
import staffA from "@/assets/staff-group.jpg";
import compA from "@/assets/computer-lab.jpg";
import compB from "@/assets/smart-class.jpg";
import labA from "@/assets/science-lab.jpg";
import labB from "@/assets/img-science-exp-a.jpg";
import kitchenA from "@/assets/meal.jpg";
import kitchenB from "@/assets/lunch-meal.jpg";
import classA from "@/assets/classroom-1.jpg";
import classB from "@/assets/classroom-2.jpg";

export const Route = createFileRoute("/virtual-tour")({
  head: () => ({
    meta: [
      { title: "Virtual Tour — Balo English Medium School, Howrah" },
      {
        name: "description",
        content:
          "Walk through Balo English Medium School room by room: hall, staff room, computer room, science lab, kitchen, classrooms and reception.",
      },
      { property: "og:title", content: "Virtual Tour — Balo English Medium School" },
      {
        property: "og:description",
        content: "A room-by-room tour of our campus in Salkia, Howrah.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VirtualTourPage,
});

const stops: { title: string; desc: string; images?: [string?, string?] }[] = [
  {
    title: "Hall Room",
    desc: "Every school day begins here. Students gather for the morning assembly and morning prayer, share the day's thought, hear announcements from the teachers and start the morning together as one school. The hall also hosts rehearsals, competitions and cultural programmes through the year.",
    images: [hallA, undefined],
  },
  {
    title: "Staff Room",
    desc: "The working heart of our teaching team. Teachers plan lessons, prepare worksheets, correct copies and meet for academic coordination — reviewing each class's progress, agreeing on the term's syllabus pace and discussing children who need extra support.",
    images: [staffA, undefined],
  },
  {
    title: "Computer Room",
    desc: "Our computer room hosts practical sessions for digital learning — typing, basic coding, spreadsheets, presentations and safe internet practices. Sessions are always teacher-supervised, so students learn confidently and responsibly.",
    images: [compA, compB],
  },
  {
    title: "Science Lab",
    desc: "Physics, chemistry and biology come alive here. Students perform experiments at proper lab tables with safety equipment, record observations and write up lab reports — turning textbook theory into hands-on understanding.",
    images: [labA, labB],
  },
  {
    title: "Kitchen",
    desc: "Managed by our dedicated non-teaching staff, the kitchen prepares a fresh, nutritious hot meal for more than 480 students every school day. Ingredients are locally sourced and the space is kept clean, orderly and carefully supervised.",
    images: [kitchenA, kitchenB],
  },
  {
    title: "Classrooms",
    desc: "Ten bright, ventilated and air-conditioned classrooms where the learning happens — lessons, discussions, group work, unit tests and daily practice, all in an English-medium environment built around the ICSE curriculum.",
    images: [classA, classB],
  },
  {
    title: "Reception",
    desc: "The welcoming point of the school and the first place visitors and parents come to. Enquiries, appointments with teachers, notices, diaries and day-to-day communication with families are all handled here.",
  },
];

function VirtualTourPage() {
  const lightbox = useLightbox();

  return (
    <main>
      <PageHero
        eyebrow="Virtual Tour"
        title="Step inside our"
        highlight="campus."
        lead="Can't visit in person yet? Take the tour room by room — from the morning prayer in the hall to the science lab, the kitchen and the classrooms where 480 children learn every day."
      />

      {stops.map((s, i) => (
        <Section key={s.title} muted={i % 2 === 1}>
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Stop {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">{s.title}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{s.desc}</p>
            </Reveal>
            <Reveal i={1}>
              <SamplePair label={s.title} images={s.images} onOpen={lightbox.open} />
            </Reveal>
          </div>
        </Section>
      ))}

      {lightbox.node}
    </main>
  );
}
