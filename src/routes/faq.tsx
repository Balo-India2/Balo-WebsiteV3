import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { PageHero, Section, Reveal } from "@/components/page-kit";
import faqPage from "@/assets/faq-background.jpg";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Balo English Medium School, Howrah" },
      {
        name: "description",
        content:
          "Answers to the questions families ask most about Balo English Medium School: admissions, fees and sponsorship, timings, uniform, subjects, safety and how to help.",
      },
      { property: "og:title", content: "Frequently Asked Questions — Balo English Medium School" },
      {
        property: "og:description",
        content:
          "Admissions, fees and sponsorship, school timings, uniform, curriculum, safety and volunteering — answered plainly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

type Qa = { q: string; a: string };

const GROUPS: { group: string; items: Qa[] }[] = [
  {
    group: "Admissions",
    items: [
      {
        q: "When does admission open, and which classes can my child join?",
        a: "Admissions for the new session are taken from January onwards, and seats in the middle classes open up through the year as families move. We admit from the pre-primary level up to Class 12. Walk in to the school office at 55, Madar Talla Lane, Salkia with your child's birth certificate and the last report card, and we will tell you the same day whether a seat is available in that class.",
      },
      {
        q: "Is there an entrance test?",
        a: "For the youngest classes there is no test at all — we simply meet the child and the parents together. From Class 3 upwards a short written check in English and Mathematics helps us place the child in the right class and see who needs extra support in the first term. Nobody is turned away for scoring low; the check is for planning, not for filtering.",
      },
      {
        q: "My child studied in a Bengali or Hindi medium school. Will they cope?",
        a: "Many of our students arrive exactly that way. Their teachers give extra reading and spelling practice in the first months, and Hindi and Bengali continue as taught languages, so the child is never cut off from the language they think in.",
      },
    ],
  },
  {
    group: "Fees & sponsorship",
    items: [
      {
        q: "What does it cost, and what happens if a family cannot pay?",
        a: "Fees are kept deliberately low, and no child who has been admitted is removed for want of money. Balo is supported by our sister organisations — Balo Italia, Balo USA, Ireland and Malaysia — whose fundraising covers sponsored places, books, uniforms and meals for the children who need them. Speak to the office privately; these arrangements are handled quietly and without embarrassment.",
      },
      {
        q: "How does child sponsorship work?",
        a: "A sponsor abroad or in India covers one child's schooling for a year. The child stays in their own home and family; the sponsorship pays for tuition, uniform, books and the extras that make school possible. Sponsors receive updates on their child's progress through the year.",
      },
    ],
  },
  {
    group: "School day & rules",
    items: [
      {
        q: "What are the school timings?",
        a: "Classes run through the morning on weekdays, with a mid-morning break; exact start and end times shift slightly between the primary and senior sections and between summer and winter schedules. The current timings and every holiday are published on the Academic Calendar page and on the notice board at the gate.",
      },
      {
        q: "Is uniform compulsory?",
        a: "Yes. Uniform, identity card and neat presentation are expected every day, and the full expectations — attendance, discipline, and what to do when a child is unwell — are set out on the Rules & Regulations page.",
      },
      {
        q: "How do you keep the children safe?",
        a: "The gate is supervised at arrival and dismissal, children are released only to a listed guardian, and class teachers take attendance every session so an absence is noticed the same morning. Laboratory and computer sessions are always supervised by the subject teacher.",
      },
    ],
  },
  {
    group: "Learning",
    items: [
      {
        q: "Which subjects are taught, and when do the sciences separate?",
        a: "The early classes study Mathematics, English Grammar and Literature, Hindi, General Science and Moral Science. From Class 5 social studies splits into History and Geography and Computer Applications begins; from Class 6 science separates into Physics, Chemistry and Biology with laboratory practicals. Commercial Applications is added in Class 9, and Economics and Political Science in Class 11. The full class-wise list is on the Academics page.",
      },
      {
        q: "Do students really learn coding here?",
        a: "Yes — and this website is the proof. Our students Rehan Jamil, Shahil Sharma and Shibran Khatoon built and maintain it, mentored by Mr Samuel Clay, alongside our Italian volunteer developers. Computer Applications lessons in the lab feed directly into that work.",
      },
      {
        q: "What is BALO AI, and is it safe for my child to use?",
        a: "BALO AI is our own on-site helper. In Assistant mode it answers questions about the school using only verified school records — notices, staff, facilities and events — so it cannot invent facts. In Student mode it acts as a tutor: it explains a topic step by step, works through sums and can read a photograph of a question from the textbook. It does not replace the teacher and it does not simply hand over answers for homework.",
      },
    ],
  },
  {
    group: "Helping BALO",
    items: [
      {
        q: "I want to help. What is actually useful?",
        a: "Three things, in order: sponsoring a child's year, donating through Balo USA, and volunteering your time. Volunteers from Italy, Ireland and the USA have taught, coached rugby, run the summer camp and helped in the library — a few focused weeks is far more useful than an open-ended promise.",
      },
      {
        q: "Can I visit before deciding anything?",
        a: "Please do. Visitors are welcome during school hours; ask at the office and a member of staff will walk you through the classrooms, the library, the computer room and the science laboratory. If you would rather look first from home, start with the Virtual Tour and Gallery pages.",
      },
    ],
  },
];

function Item({ qa, i }: { qa: Qa; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal i={i}>
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <span className="font-semibold">{qa.q}</span>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <p className="border-t border-border/70 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
            {qa.a}
          </p>
        )}
      </div>
    </Reveal>
  );
}

function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="Frequently asked questions"
        title="Straight answers,"
        highlight="no forms."
        lead="The questions parents actually ask us at the office — about admission, fees and sponsorship, timings, uniform, what we teach and how you can help."
        image={faqPage}
      />
      {GROUPS.map((g, gi) => (
        <Section key={g.group} title={g.group} eyebrow={`0${gi + 1}`} muted={gi % 2 === 1}>
          <div className="space-y-3">
            {g.items.map((qa, i) => (
              <Item key={qa.q} qa={qa} i={i} />
            ))}
          </div>
        </Section>
      ))}
      <Section>
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <HelpCircle className="mx-auto mb-3 size-6 text-primary" />
            <h2 className="font-display text-2xl font-bold">Still not answered?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Ask BALO AI in Assistant mode, or send us an enquiry and a member of staff will reply.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href="/balo-ai"
                className="rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary"
              >
                Ask BALO AI
              </a>
              <a
                href="/enquiry"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
              >
                Send an enquiry
              </a>
            </div>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
