import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Reveal, SampleImage, useLightbox } from "@/components/page-kit";
import { Trophy, ShieldCheck, Scale, HeartHandshake } from "lucide-react";
import welfare1 from "@/assets/balo-welfare-society.jpg";
import welfare2 from "@/assets/balo-background.jpg";

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
        image={welfare2}
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
            <SampleImage label="BALO Welfare Society programme" src={welfare1} ratio="4 / 3" onOpen={lightbox.open} />
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

      <Section title="The people and family behind the work" eyebrow="Our global family">
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal><article className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft"><h3 className="font-display text-xl font-bold">Elisabetta “Betta” Ravaioli</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Founder of Balo Italy, Betta began the Balo story after volunteering with Mother Teresa’s Missionaries of Charity in Kolkata in 2005. Her work grew into direct support for children and families in Howrah.</p></article></Reveal>
          <Reveal i={1}><article className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft"><h3 className="font-display text-xl font-bold">Liam Ashe</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Chairperson and coordinator for Balo Children Ireland, Liam is a former teacher at St. Flannan’s College in Ennis. He coordinates fundraising and visits Kolkata as a volunteer.</p></article></Reveal>
          <Reveal i={2}><article className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft"><h3 className="font-display text-xl font-bold">Anna Leache</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Anna coordinates Balo USA from Seattle. She met Betta and Liam while volunteering in Kolkata and helps share the mission and support projects in India.</p></article></Reveal>
        </div>
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft"><h3 className="font-display text-2xl font-bold">Our sister organisations</h3><p className="mt-3 leading-relaxed text-muted-foreground">Balo India works with Balo Italia, Balo USA, Balo Children Ireland and partners in Malaysia to support education, nutrition, health, school supplies, uniforms, women’s training and the safety of vulnerable girls.</p><div className="mt-5 flex flex-wrap gap-3"><a href="https://balo.ie/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Visit Balo Ireland</a><a href="https://www.balousa.org/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-5 py-2 text-sm font-semibold">Balo USA</a><a href="https://www.balo.it/en/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-5 py-2 text-sm font-semibold">Balo Italia</a></div></div>
      </Section>

      {lightbox.node}
    </main>
  );
}
