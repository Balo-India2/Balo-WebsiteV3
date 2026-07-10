import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function MediaCarousel({
  images,
  title,
  interval = 3200,
  aspect = "aspect-[4/3]",
  rounded = "",
}: {
  images: string[];
  title: string;
  interval?: number;
  aspect?: string;
  rounded?: string;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const t = window.setInterval(() => setActive((i) => (i + 1) % images.length), interval);
    return () => window.clearInterval(t);
  }, [images.length, interval]);
  return (
    <div className={`relative w-full ${aspect} ${rounded} overflow-hidden`}>
      {images.map((src, i) => (
        <motion.img
          key={src + i}
          src={src}
          alt={`${title} ${i + 1}`}
          loading="lazy"
          initial={false}
          animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.04 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 size-full object-cover"
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-label={`Show ${title} image ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${active === i ? "w-6 bg-white" : "w-1.5 bg-white/60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
