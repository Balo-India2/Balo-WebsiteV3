import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({ to, suffix = "", duration = 1.8, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2, margin: "-80px" });
  const plays = useRef(0);
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    if (plays.current >= 3) return;
    plays.current += 1;
    const controls = animate(value, to, {
      duration,
      // Smoother mid-run, no long tail — feels premium and lands cleanly on the final digit.
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [inView, to, duration, value, rounded]);

  return (
    <motion.span ref={ref} className={className}>
      {display}{suffix}
    </motion.span>
  );
}
