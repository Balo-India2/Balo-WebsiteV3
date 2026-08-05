import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Reveal } from "@/components/page-kit";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Rules & Regulations — Balo English Medium School" },
      {
        name: "description",
        content:
          "Official rules and regulations of Balo English Medium School: uniform, grooming, school property, diary, tiffin, attendance, medical absence and guardian requirements.",
      },
      { property: "og:title", content: "Rules & Regulations — Balo English Medium School" },
      {
        property: "og:description",
        content: "What we ask of every BALO student and parent, so the school stays safe, fair and orderly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RulesPage,
});

const groups: { title: string; rules: string[] }[] = [
  {
    title: "Uniform & appearance",
    rules: [
      "Students must come to school in the correct, complete and clean school uniform every day. Boys wear the blue T-shirt with blue trousers; girls wear the blue skirt with the school top.",
      "Hair must be kept neat and tidy. Boys' hair should be cut short and combed; girls with long hair must tie it back properly.",
      "Nails must be trimmed regularly and kept clean. Nail polish is not allowed.",
      "Every student must carry a clean handkerchief to school daily.",
      "Children below six years of age must bring a spare set of clothes in their bag.",
      "Shaving of the head or unusual haircuts and hairstyles are not permitted.",
      "Students who wear a hijab must wear it in the plain school-approved colour and style, neatly pinned, as instructed by the school.",
    ],
  },
  {
    title: "Belongings & school property",
    rules: [
      "School property must be treated with care. Any damage caused to furniture, books, laboratory equipment or the building must be reported and will have to be compensated.",
      "The school diary and all required study materials must be brought to school every day. The diary is the official channel of communication between the school and parents and must be signed by a parent or guardian when required.",
      "Students must bring their own tiffin and water bottle. Sharing of tiffin is discouraged for hygiene reasons, and junk food is not allowed.",
      "Jewellery, mehendi, cosmetics, expensive objects, mobile phones, toys and sharp objects such as blades or scissors (other than those required for class) must not be brought to school. The school is not responsible for any loss.",
      "Chewing gum is strictly prohibited inside the school premises.",
    ],
  },
  {
    title: "Attendance, leave & health",
    rules: [
      "Every absence must be justified in writing by the parent or guardian in the school diary.",
      "Absence due to illness of more than three consecutive days must be supported by a doctor's certificate before the student rejoins classes.",
      "Parents must inform the class teacher immediately if a child is unwell, has an infectious illness or has any medical condition or allergy the school should know about.",
      "Travel during school vacation should be planned within the official vacation dates. Extended leave beyond the vacation is not encouraged and needs the Principal's prior permission.",
    ],
  },
  {
    title: "Parents & guardians",
    rules: [
      "Parents who wish to meet a teacher or the Principal must take a prior appointment through the school office or the school diary. Teachers cannot be met during class hours.",
      "Any change of residential address or telephone number must be reported to the school office immediately so records stay accurate.",
      "Students whose parents live outside Howrah must have a responsible local guardian, whose name, address and contact number are registered with the school office.",
      "In the case of orphaned children, the registered legal guardian holds full authority over the child's schooling, and all school communication will be made with that guardian.",
    ],
  },
];

function RulesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Rules & Regulations"
        title="How we keep BALO safe,"
        highlight="fair and orderly."
        lead="These rules apply to every student and family at Balo English Medium School. They exist so that classes run smoothly, children stay safe and every child is treated equally."
      />

      {groups.map((g, gi) => (
        <Section key={g.title} title={g.title} muted={gi % 2 === 1}>
          <div className="grid gap-4">
            {g.rules.map((r, i) => (
              <Reveal key={r} i={i}>
                <div className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{r}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      <Section>
        <Reveal>
          <p className="rounded-3xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
            For any clarification on these rules, please contact the school office at{" "}
            <a className="font-semibold text-primary underline" href="mailto:baloindia2015@gmail.com">
              baloindia2015@gmail.com
            </a>{" "}
            or speak to the Manager at the reception.
          </p>
        </Reveal>
      </Section>
    </main>
  );
}
