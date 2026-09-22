import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Reveal } from "@/components/page-kit";
import { CalendarDays } from "lucide-react";
import calendarBackground from "@/assets/calendar-background.jpg";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "School Calendar & Important Days — Balo English Medium School" },
      {
        name: "description",
        content:
          "Important days observed at Balo English Medium School through the year — Republic Day, Women's Day, Environment Day, Teachers' Day, Children's Day and more.",
      },
      { property: "og:title", content: "Calendar & Important Days — Balo English Medium School" },
      {
        property: "og:description",
        content: "The days we mark, celebrate and learn from at BALO across the school year.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

type Day = { name: string; date: string; note?: string };

const months: { month: string; days: Day[] }[] = [
  {
    month: "January",
    days: [
      { name: "Republic Day", date: "26 January", note: "Flag hoisting, patriotic songs and a special assembly." },
      { name: "Martyrs' Day", date: "30 January", note: "Two minutes' silence in memory of Mahatma Gandhi." },
    ],
  },
  {
    month: "March",
    days: [
      { name: "International Women's Day", date: "8 March", note: "Programmes honouring the women of our school and community." },
      { name: "Commonwealth Day", date: "Second Monday of March", note: "Learning about the Commonwealth of Nations." },
    ],
  },
  {
    month: "April",
    days: [
      { name: "World Health Day", date: "7 April", note: "Health, hygiene and nutrition awareness sessions." },
      { name: "Earth Day", date: "22 April", note: "Clean-up drives and environment pledges." },
    ],
  },
  {
    month: "May",
    days: [
      { name: "International Labour Day", date: "1 May", note: "Honouring the dignity of work." },
      { name: "World Red Cross Day", date: "8 May", note: "First aid and humanitarian service awareness." },
      { name: "Mother's Day", date: "Second Sunday of May", note: "Cards, crafts and thank-you messages for mothers." },
    ],
  },
  {
    month: "June",
    days: [
      { name: "World Environment Day", date: "5 June", note: "Tree planting and a no-plastic pledge." },
      { name: "International Yoga Day", date: "21 June", note: "A whole-school yoga and breathing session." },
      { name: "Father's Day", date: "Third Sunday of June", note: "Activities celebrating fathers and guardians." },
      { name: "International Day Against Drug Abuse", date: "26 June", note: "Awareness talk for senior students." },
    ],
  },
  {
    month: "July / August",
    days: [
      { name: "Friendship Day", date: "First Sunday of August", note: "Kindness and friendship activities in class." },
      { name: "Independence Day", date: "15 August", note: "Flag hoisting, march past and cultural programme." },
      { name: "National Sports Day", date: "29 August", note: "Races, relays and team games." },
    ],
  },
  {
    month: "September",
    days: [
      { name: "Teachers' Day", date: "5 September", note: "Students plan and host the day for their teachers." },
      { name: "World Literacy Day", date: "8 September", note: "Reading drives and storytelling sessions." },
    ],
  },
  {
    month: "October / November",
    days: [
      { name: "World Food Day", date: "16 October", note: "Nutrition awareness and no-food-waste pledge." },
      { name: "Children's Day", date: "14 November", note: "Games, treats and performances for all students." },
    ],
  },
  {
    month: "December",
    days: [
      { name: "World AIDS Day", date: "1 December", note: "Age-appropriate health awareness for senior classes." },
      { name: "Human Rights Day", date: "10 December", note: "Workshops on rights, equality and dignity." },
      { name: "Kisan Diwas (Farmer's Day)", date: "23 December", note: "Learning about farmers and where our food comes from." },
    ],
  },
];

function CalendarPage() {
  return (
    <main>
      <PageHero
        eyebrow="Calendar"
        title="The days we mark"
        highlight="together."
        lead="Alongside three academic terms and unit tests, BALO observes these national and international days with assemblies, workshops, rallies and cultural programmes. Exact dates for movable days are confirmed on the notice board each year."
        image={calendarBackground}
      />

      {months.map((m, mi) => (
        <Section key={m.month} title={m.month} muted={mi % 2 === 1}>
          <div className="grid gap-4 md:grid-cols-2">
            {m.days.map((d, i) => (
              <Reveal key={d.name} i={i}>
                <article className="flex h-full gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <CalendarDays className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold">{d.name}</h3>
                    <div className="text-xs font-semibold uppercase tracking-widest text-accent">
                      {d.date}
                    </div>
                    {d.note && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.note}</p>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}
    </main>
  );
}
