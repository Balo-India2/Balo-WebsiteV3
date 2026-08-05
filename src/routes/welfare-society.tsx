import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Reveal, SampleImage, useLightbox } from "@/components/page-kit";
import { Trophy, ShieldCheck, Scale, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/welfare-society")({
  head: () => ({
    meta: [
      { title: "BALO Welfare Society — Empowering slum children in Howrah" },
      {
        name: "description",
        content:
          "The BALO Welfare Society supports children of Pilkhana and Fakir Bagan Lane, Howrah, through sports and cultural competitions, consumer awareness camps, human rights workshops and community outreach.",
      },
      { property: "og:title", content: "BALO Welfare Society" },
      {
        property: "og:description",
        content: "Sports meets, awareness camps, human rights workshops and community upliftment in Howrah.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelfarePage,
});

const initiatives = [
  {
    icon: Trophy,
    title: "Annual Sports & Cultural Competitions",
    desc: "Yearly sports meets and cultural events that build teamwork, reveal talent, encourage physical health and bring the whole neighbourhood together in community spirit.",
  },
  {
    icon: ShieldCheck,
    title: "Consumer Awareness Camp",
    desc: "A specialised Consumer Awareness Camp conducted at Fresh Buds School, Howrah, educating the community about consumer rights, fair pricing and their responsibilities as buyers.",
  },
  {
    icon: Scale,
    title: "Human Rights Workshops",
    desc: "Interactive educational workshops that build awareness of fundamental human rights, equality and human dignity — in language children and parents can act on.",
  },
  {
    icon: HeartHandshake,
    title: "Community Outreach & Upliftment",
    desc: "Working hand in hand with Balo English Medium School to extend educational support, social welfare and empowerment to children and families in the surrounding neighbourhoods.",
  },
];

function WelfarePage() {
  const lightbox = useLightbox();

  return (
    <main>
      <PageHero
        eyebrow="BALO Welfare Society"
        title="Empowering the children of"
        highlight="Pilkhana."
        lead="The BALO Welfare Society is an initiative organised specifically to support and empower the children living in the slum areas of Pilkhana and Fakir Bagan Lane in Howrah."
      />

      <Section>
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
          <Reveal>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Balo English Medium School itself was organised for the slum children of Pilkhana
                and Fakir Bagan Lane. The Welfare Society carries that same purpose beyond the
                classroom — into the lanes, the homes and the families our students come from.
              </p>
              <p>
                The Society has organised a Consumer Awareness Camp at Fresh Buds School, Howrah,
                conducted workshops on Human Rights, and organises Annual Sports and Cultural
                Competitions every year.
              </p>
            </div>
          </Reveal>
          <Reveal i={1}>
            <SampleImage label="BALO Welfare Society programme" ratio="4 / 3" onOpen={lightbox.open} />
          </Reveal>
        </div>
      </Section>

      <Section title="Key activities & initiatives" eyebrow="What the Society does" muted>
        <div className="grid gap-5 md:grid-cols-2">
          {initiatives.map((it, i) => (
            <Reveal key={it.title} i={i}>
              <article className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <it.icon className="size-5" />
                </div>
                <h3 className="font-display text-xl font-bold">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {lightbox.node}
    </main>
  );
}
