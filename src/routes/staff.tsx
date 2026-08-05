import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Reveal, SampleImage, SamplePair, useLightbox } from "@/components/page-kit";

import staffGroup from "@/assets/staff-group.jpg";
import staffNew from "@/assets/staff-new.jpg";
import teacherBoard from "@/assets/teacher-board.jpg";
import mealPrep from "@/assets/meal.jpg";
import kitchen2 from "@/assets/lunch-meal.jpg";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Our Staff — Balo English Medium School, Howrah" },
      {
        name: "description",
        content:
          "Meet the teaching and non-teaching staff of Balo English Medium School — the teachers, coordinators, cooks and helpers who run the school every day.",
      },
      { property: "og:title", content: "Our Staff — Balo English Medium School" },
      {
        property: "og:description",
        content: "The people behind BALO: our manager, teaching staff and non-teaching staff.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StaffPage,
});

function StaffPage() {
  const lightbox = useLightbox();

  return (
    <main>
      <PageHero
        eyebrow="Our Staff"
        title="The people who make BALO"
        highlight="work."
        lead="More than twenty teachers, coordinators, cooks, helpers and volunteers share one school day — teaching, feeding, guiding and looking after 480 children."
      />

      {/* Manager */}
      <Section eyebrow="Leadership" title="Mr. Ranjit Mishra — Manager">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_1.2fr]">
          <Reveal>
            <SampleImage label="Mr. Ranjit Mishra, Manager" ratio="4 / 5" onOpen={lightbox.open} />
          </Reveal>
          <Reveal i={1}>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Mr. Ranjit Mishra is the <strong className="text-foreground">Manager</strong> of Balo
                English Medium School. He keeps the school running day to day — admissions and
                records, staff coordination, the daily meal programme, supplies, maintenance and
                the hundred practical decisions that a free school for 480 children needs before
                nine o'clock every morning.
              </p>
              <p>
                Alongside his management responsibilities he also teaches{" "}
                <strong className="text-foreground">Hindi</strong>, which keeps him close to the
                classroom and to the students themselves. Parents know him as the person who
                listens first and finds a way — whether it is a uniform, a book, a medical need or
                a child who has stopped coming to school.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Teaching staff */}
      <Section eyebrow="Academics" title="Teaching Staff" muted>
        <Reveal>
          <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">
            Our teachers deliver the full ICSE curriculum in English medium — grammar and
            literature, mathematics, physics, chemistry, biology, history, geography, computer
            applications, Hindi, commercial applications, economics, political science and moral
            science. They plan lessons together, run unit tests each term, take practical sessions
            in the lab and computer room, and give extra time to any child who needs it.
          </p>
        </Reveal>
        <Reveal i={1}>
          <SamplePair label="Teaching Staff" images={[staffGroup, teacherBoard]} onOpen={lightbox.open} />
        </Reveal>
      </Section>

      {/* Non-teaching staff */}
      <Section eyebrow="Care & operations" title="Non-Teaching Staff">
        <Reveal>
          <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">
            Behind every lesson is a team that is just as important. Our non-teaching staff cook
            and serve a hot meal for more than 480 students every school day, keep the classrooms,
            lab, bathrooms and kitchen clean, manage supplies, help the youngest children through
            the day and support the teachers with everything the school needs. Their contribution
            is the reason a child at BALO arrives, eats, learns and goes home cared for.
          </p>
        </Reveal>
        <Reveal i={1}>
          <SamplePair label="Non-Teaching Staff" images={[mealPrep, kitchen2]} onOpen={lightbox.open} />
        </Reveal>
        <Reveal i={2}>
          <div className="mt-4">
            <SampleImage label="Our full staff together" src={staffNew} ratio="16 / 9" onOpen={lightbox.open} />
          </div>
        </Reveal>
      </Section>

      {lightbox.node}
    </main>
  );
}
