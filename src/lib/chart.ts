export type Point = { label: string; value: number };

/** Linear map from a domain to a range. A zero-width domain maps to the range start. */
export function scaleLinear(
  domain: [number, number],
  range: [number, number],
): (v: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d0 === d1) return () => r0;
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/** Round to 2 decimals so SVG path strings are stable and testable. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Build an SVG path "d" string through the given screen-space points. */
export function buildLinePath(points: Array<[number, number]>): string {
  if (points.length === 0) return "";
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${r2(x)} ${r2(y)}`)
    .join(" ");
}

/** Closed area path under a line, down to baseY. */
export function buildAreaPath(
  points: Array<[number, number]>,
  baseY: number,
): string {
  if (points.length === 0) return "";
  const line = buildLinePath(points);
  const first = points[0][0];
  const last = points[points.length - 1][0];
  return `${line} L${r2(last)} ${r2(baseY)} L${r2(first)} ${r2(baseY)} Z`;
}

/** Evenly spaced "nice" tick values covering [min, max]. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) return [min];
  const rawStep = (max - min) / Math.max(1, count - 1);
  const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const frac = rawStep / pow;
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  const step = niceFrac * pow;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) {
    ticks.push(Math.round(v * 1e9) / 1e9);
  }
  return ticks;
}

/** Index of the point whose x is closest to x. Returns -1 for no points. */
export function nearestIndex(xs: number[], x: number): number {
  if (xs.length === 0) return -1;
  let best = 0;
  let bestDist = Math.abs(xs[0] - x);
  for (let i = 1; i < xs.length; i++) {
    const d = Math.abs(xs[i] - x);
    if (d < bestDist) {
      best = i;
      bestDist = d;
    }
  }
  return best;
}
