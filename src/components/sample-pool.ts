/**
 * Pool of real photographs available in `src/assets`.
 *
 * Every "sample image" placeholder on the site now shows a real BALO photo
 * picked deterministically from this pool (so the layout never renders an
 * empty grey box), while remaining clearly replaceable: drop the real photo
 * into `src/assets/`, import it, and pass it as the `src` prop.
 */
const modules = import.meta.glob("../assets/*.{jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const SAMPLE_POOL: string[] = Object.entries(modules)
  // logos / banners make poor photo placeholders
  .filter(([path]) => !/logo|banner|collage/i.test(path))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic "random" photo for a given label — stable across renders. */
export function sampleFor(label: string): string | undefined {
  if (!SAMPLE_POOL.length) return undefined;
  return SAMPLE_POOL[hash(label) % SAMPLE_POOL.length];
}
