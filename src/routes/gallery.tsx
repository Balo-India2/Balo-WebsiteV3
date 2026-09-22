import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Reveal, useLightbox } from "@/components/page-kit";

import g1 from "@/assets/drive-gallery2-01.jpg";
import g2 from "@/assets/drive-gallery2-02.jpg";
import g3 from "@/assets/drive-gallery2-03.jpg";
import g4 from "@/assets/drive-gallery2-04.jpg";
import g5 from "@/assets/drive-gallery2-05.jpg";
import g6 from "@/assets/drive-gallery2-06.jpg";
import g7 from "@/assets/drive-gallery2-07.jpg";
import g8 from "@/assets/drive-gallery2-08.jpg";
import g9 from "@/assets/drive-gallery2-09.jpg";
import g10 from "@/assets/drive-gallery2-10.jpg";
import g11 from "@/assets/drive-gallery2-11.jpg";
import g12 from "@/assets/drive-gallery2-12.jpg";
import g13 from "@/assets/drive3-01.jpg";
import g14 from "@/assets/drive3-02.jpg";
import g15 from "@/assets/drive3-03.jpg";
import g16 from "@/assets/drive3-04.jpg";
import g17 from "@/assets/drive3-05.jpg";
import g18 from "@/assets/drive3-06.jpg";
import dome1 from "@/assets/group-students.jpg";
import dome2 from "@/assets/raised-hands.jpg";
import dome3 from "@/assets/classroom-reading.jpg";
import gallerybackground from "@/assets/gallery-background.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Balo English Medium School, Howrah" },
      {
        name: "description",
        content:
          "Photographs from classrooms, celebrations, sports days and everyday life at Balo English Medium School in Salkia, Howrah.",
      },
      { property: "og:title", content: "Gallery — Balo English Medium School" },
      {
        property: "og:description",
        content: "A visual walk through our classrooms, celebrations and community moments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

const dome = [
  { src: dome1, label: "Our students together" },
  { src: dome2, label: "Hands up in class" },
  { src: dome3, label: "Reading time" },
];

const photos = [
  { src: g1, label: "Classroom moment" },
  { src: g2, label: "Learning together" },
  { src: g3, label: "School day" },
  { src: g4, label: "Activities" },
  { src: g5, label: "Celebration" },
  { src: g6, label: "Friends at BALO" },
  { src: g7, label: "In the classroom" },
  { src: g8, label: "Programme day" },
  { src: g9, label: "Our teachers" },
  { src: g10, label: "Study time" },
  { src: g11, label: "Assembly" },
  { src: g12, label: "Smiles at BALO" },
  { src: g13, label: "Sports and games" },
  { src: g14, label: "Cultural performance" },
  { src: g15, label: "Group photo" },
  { src: g16, label: "Practical session" },
  { src: g17, label: "Break time" },
  { src: g18, label: "Community day" },
];

function GalleryPage() {
  const lightbox = useLightbox();

  return (
    <main>
      <PageHero
        eyebrow="Gallery"
        title="Life at BALO, in"
        highlight="pictures."
        lead="Every photograph here is a real day at Balo English Medium School — lessons, laughter, celebrations and the small moments that make this school a second home for 480 children."
        image={gallerybackground}
      />

      {/* Gallery dome */}
      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {dome.map((p, i) => (
            <Reveal key={p.label} i={i}>
              <button
                onClick={() => lightbox.open(p.src, p.label)}
                className="group block w-full overflow-hidden rounded-[2rem] border border-border shadow-soft"
              >
                <img
                  src={p.src}
                  alt={p.label}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05] md:h-80"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section title="Photo gallery" eyebrow="Tap any photo to preview" muted>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p, i) => (
            <Reveal key={p.src} i={i % 4}>
              <button
                onClick={() => lightbox.open(p.src, p.label)}
                className="group block w-full overflow-hidden rounded-2xl border border-border bg-muted/40"
                aria-label={`Preview: ${p.label}`}
              >
                <img
                  src={p.src}
                  alt={p.label}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {lightbox.node}
    </main>
  );
}
