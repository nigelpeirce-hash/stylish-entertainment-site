/**
 * Seeded shuffle — same input + seed always yields the same order on server
 * and client. Use for homepage hero/testimonials instead of Math.random() during
 * render or before mount.
 *
 * @see lib/HYDRATION.md
 */

function hashString(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createSeededRandom(seed: string): () => number {
  let state = hashString(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle with a fixed seed (SSR-safe). */
export function deterministicShuffle<T>(items: readonly T[], seed: string): T[] {
  const rng = createSeededRandom(seed);
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickDeterministic<T>(items: readonly T[], count: number, seed: string): T[] {
  return deterministicShuffle(items, seed).slice(0, count);
}
