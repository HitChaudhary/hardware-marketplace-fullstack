// Deterministic pseudo-random generator seeded from a string (e.g. a product id).
// Lets us fabricate believable mock data (ratings, review counts, spec variance)
// that stays stable across reloads/builds instead of re-rolling every render.

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns a stable PRNG function (0..1) seeded by `key`. */
export function seededRandom(key) {
  return mulberry32(hashString(String(key)));
}

/** Stable random integer between min and max (inclusive), seeded by key. */
export function seededInt(key, min, max) {
  const rnd = seededRandom(key)();
  return Math.floor(rnd * (max - min + 1)) + min;
}

/** Stable pick from an array, seeded by key. */
export function seededPick(key, arr) {
  const idx = seededInt(key, 0, arr.length - 1);
  return arr[idx];
}
