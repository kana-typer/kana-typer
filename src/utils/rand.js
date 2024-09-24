/**
 * Seeded PRNG (Linear Congruential Generator)
 * @param {number} seed - seed for generator
 */
export const createSeededLCGRand = (seed) => {
  const a = 1664525
  const c = 1013904223
  const m = 2 ** 32
  // return ((a * seed + c) % m) / m

  return () => {
    seed = (a * seed + c) % m;
    return seed / m;
  }
}