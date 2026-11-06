import { motion as fm } from "framer-motion";
import { forwardRef, useRef, useState } from "react";

/** Looping and scroll-in animations play this many times, then the page stays still. */
export const ANIMATION_PLAYS = 3;

function capRepeat(transition: unknown) {
  if (!transition || typeof transition !== "object" || Array.isArray(transition)) {
    return transition;
  }
  const t = transition as { repeat?: number | typeof Infinity };
  if (t.repeat === Infinity) return { ...t, repeat: ANIMATION_PLAYS };
  return transition;
}

function wrap(Comp: any) {
  const Wrapped = forwardRef(function LimitedMotion(props: any, ref) {
    const plays = useRef(0);
    const [frozen, setFrozen] = useState(false);
    const hasWhileInView = props.whileInView != null;
    const userOnce = props.viewport?.once;
    const viewport = hasWhileInView
      ? { amount: 0.2, ...props.viewport, once: userOnce === true ? true : frozen }
      : props.viewport;
    // After the cap, never go back to the hidden initial state.
    const initial = frozen && hasWhileInView ? false : props.initial;

    return (
      <Comp
        ref={ref}
        {...props}
        initial={initial}
        transition={capRepeat(props.transition)}
        viewport={viewport}
        onViewportEnter={(e: any) => {
          props.onViewportEnter?.(e);
          if (hasWhileInView && userOnce !== true) {
            plays.current += 1;
            if (plays.current >= ANIMATION_PLAYS) setFrozen(true);
          }
        }}
      />
    );
  });
  Wrapped.displayName = "LimitedMotion";
  return Wrapped;
}

const cache = new Map<PropertyKey, unknown>();

export const motion = new Proxy(fm, {
  get(target, key) {
    if (cache.has(key)) return cache.get(key);
    const val = (target as typeof fm)[key as keyof typeof fm];
    const isTag = typeof key === "string" && /^[a-z]/.test(key) && key !== "create";
    const wrapped = isTag && (typeof val === "function" || (typeof val === "object" && val !== null))
      ? wrap(val)
      : val;
    cache.set(key, wrapped);
    return wrapped;
  },
}) as typeof fm;
