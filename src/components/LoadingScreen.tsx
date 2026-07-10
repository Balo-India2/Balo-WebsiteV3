import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import baloLogo from "@/assets/balo-logo.jpg";

/**
 * Full-screen loading splash shown on initial page load.
 * Displays the Balo logo with a soft pulse + ring animation,
 * then fades out after ~1.6s.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 1600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <div className="relative">
            {/* Expanding rings */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-full border-2 border-accent"
                initial={{ scale: 0.6, opacity: 0.8 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
              />
            ))}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative size-28 rounded-full overflow-hidden shadow-card ring-4 ring-accent/40"
            >
              <img src={baloLogo} alt="Balo India" className="size-full object-cover" />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-16 text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold"
          >
            Balo · Salkia, Howrah
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
