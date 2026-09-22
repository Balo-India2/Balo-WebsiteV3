import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Reveal, SampleImage, useLightbox } from "@/components/page-kit";
import volunteerCertificate from "@/assets/drive-gallery2-01.jpg";
import volunteerLaptop from "@/assets/drive-gallery2-06.jpg";
import volunteerTeaching from "@/assets/drive-gallery2-12.jpg";
import volunteerCircleOne from "@/assets/drive-gallery2-09.jpg";
import volunteerCircleTwo from "@/assets/drive-gallery2-15.jpg";
import volunteerGift from "@/assets/drive-gallery2-14.jpg";
import volunteerCurly from "@/assets/drive-gallery2-08.jpg";
import volunteerNewOne from "@/assets/volunteer-new-01.jpg";
import volunteerNewTwo from "@/assets/volunteer-new-02.jpg";
import hero from "@/assets/hero-classroom.jpg";

export const Route = createFileRoute("/volunteers")({
  head: () => ({ meta: [
    { title: "Volunteers — Balo English Medium School" },
    { name: "description", content: "Meet the international volunteers who teach, mentor and create joyful learning experiences at Balo English Medium School." },
    { property: "og:title", content: "Volunteers — Balo English Medium School" },
    { property: "og:description", content: "A family of volunteers from Italy, Ireland, the USA and beyond supports Balo students." },
  ] }),
  component: VolunteersPage,
});

const volunteers = [
  ["Amanda", "Italy", "🇮🇹", "Walking into Balo for the first time felt like coming home. The children's joy is contagious — I left with more than I gave."],
  ["Liam", "Ireland", "🇮🇪", "What Balo achieves with so little is extraordinary. Every teacher here is a quiet revolution."],
  ["Albi", "Italy", "🇮🇹", "I've volunteered in many schools, but the warmth and discipline at Balo are unlike anywhere else."],
  ["Sofia", "Italy", "🇮🇹", "Balo is proof that love, more than money, is what builds great schools."],
  ["Julie", "Malaysia", "🇲🇾", "The students welcomed me with so much affection. Education, safety and kindness grow together here."],
  ["Giovanna", "Italy", "🇮🇹", "Balo's students inspired me every day — their curiosity and warmth are unforgettable."],
  ["Daniel", "Italy", "🇮🇹", "Teaching alongside the Balo team taught me as much as it taught the children."],
  ["Barbara", "Italy", "🇮🇹", "The joy in these classrooms reminded me why education matters most."],
  ["Andrew", "Italy", "🇮🇹", "Balo is a school built on kindness. Being part of it changed me."],
] as const;

const moments = [
  [volunteerCertificate, "Recognising a volunteer's contribution"],
  [volunteerLaptop, "Mentoring students through laptop activities"],
  [volunteerTeaching, "Classroom workshops with international volunteers"],
  [volunteerCircleOne, "Circle games building trust and teamwork"],
  [volunteerCircleTwo, "Group activities and confidence-building"],
  [volunteerGift, "Students thanking a volunteer"],
  [volunteerCurly, "One-to-one reading time"],
  [volunteerNewOne, "A visiting volunteer with students"],
  [volunteerNewTwo, "A volunteer moment with the Balo family"],
] as const;

function VolunteersPage() {
  const lightbox = useLightbox();
  return <main>
    <PageHero eyebrow="About Us · Volunteers" title="A family that" highlight="crosses borders." lead="Volunteers from Italy, Ireland, the USA, Malaysia and beyond teach, mentor and stand beside Balo children in Salkia." image={hero} />
    <Section title="People who bring learning to life" eyebrow="Our volunteers">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {volunteers.map(([name, country, flag, quote], i) => <Reveal key={name} i={i}>
          <article className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 text-5xl" aria-hidden>{flag}</div>
            <p className="min-h-24 text-sm italic leading-relaxed text-muted-foreground">“{quote}”</p>
            <div className="mt-5 border-t border-border pt-4"><strong>{name}</strong><div className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">{country}</div></div>
          </article>
        </Reveal>)}
      </div>
    </Section>
    <Section title="Volunteer moments" eyebrow="Learning together" muted>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {moments.map(([src, label], i) => <Reveal key={label} i={i}><SampleImage label={label} src={src} ratio="4 / 3" onOpen={lightbox.open} /></Reveal>)}
      </div>
    </Section>
    {lightbox.node}
  </main>;
}