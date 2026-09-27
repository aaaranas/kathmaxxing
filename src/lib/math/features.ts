import { type AngleMode, evaluate, valueToNumber } from "@/lib/math/evaluate";
import type { Node } from "@/lib/math/parse";

/**
 * The points on a graph worth marking.
 *
 * Everything here is found by looking at the curve rather than by doing any
 * algebra: where it crosses, where it cannot be drawn, and what it settles
 * towards a long way out. That keeps it honest about what it can see - a root
 * it steps over between samples is a root it will not mark - and it means any
 * expression the calculator can evaluate gets the same treatment.
 */

export type Features = {
  /** Where the curve crosses the x-axis, left to right. */
  roots: number[];
  /** Where it crosses the y-axis, if it is defined there. */
  yIntercept: number | null;
  /** Vertical lines it runs away along. */
  vertical: number[];
  /** Heights it settles towards far out to the left or the right. */
  horizontal: number[];
};

export type FeatureOptions = {
  angle?: AngleMode;
  variable?: string;
  /** How many places to look at across the range. */
  samples?: number;
};

/** How close in to look when asking whether a curve is running away. */
const APPROACH = [1e-3, 1e-6, 1e-9];

/** How far out "far out" is, for a height the curve settles towards. */
const FAR = [1e5, 1e6, 1e7];

function valueAt(node: Node, variable: string, x: number, angle: AngleMode): number | null {
  const result = evaluate(node, {
    angle,
    scope: { [variable]: { kind: "approx", value: x } },
  });
  if (!result.ok) return null;
  const value = valueToNumber(result.value);
  return Number.isFinite(value) ? value : null;
}

/** Float arithmetic can land on a negative zero, which reads as "-0". */
function zeroed(value: number): number {
  return value === 0 ? 0 : value;
}

/** Narrow a bracket down to where the interesting thing happens. */
function bisect(test: (x: number) => boolean, low: number, high: number, steps = 60): number {
  let a = low;
  let b = high;
  for (let i = 0; i < steps; i += 1) {
    const mid = (a + b) / 2;
    if (test(mid)) a = mid;
    else b = mid;
  }
  return (a + b) / 2;
}

function near(values: number[], x: number, tolerance: number): boolean {
  return values.some((seen) => Math.abs(seen - x) <= tolerance);
}

/**
 * Whether the curve climbs without settling as you walk in towards `x0`.
 *
 * Magnitude alone is not the test, because a logarithm runs away slowly and a
 * square root reaches its edge without running away at all. What separates
 * them is what the values do as the steps get smaller: a pole keeps climbing,
 * an edge of a domain does not.
 */
function climbs(f: (x: number) => number | null, x0: number, side: 1 | -1): boolean {
  const scale = Math.max(1, Math.abs(x0));
  const seen = APPROACH.map((distance) => f(x0 + side * distance * scale));
  if (seen.some((value) => value === null)) return false;

  const sizes = (seen as number[]).map(Math.abs);
  return sizes[0] < sizes[1] && sizes[1] < sizes[2] && sizes[2] >= sizes[0] * 2 && sizes[2] > 10;
}

export function findFeatures(
  node: Node,
  range: { xMin: number; xMax: number },
  options: FeatureOptions = {},
): Features {
  const angle = options.angle ?? "rad";
  const variable = options.variable ?? "x";
  const count = options.samples ?? 900;
  const { xMin, xMax } = range;

  const f = (x: number) => valueAt(node, variable, x, angle);

  const width = xMax - xMin;
  if (!(width > 0) || !Number.isFinite(width)) {
    return { roots: [], yIntercept: null, vertical: [], horizontal: [] };
  }

  const step = width / count;
  // Two points that are this close together are the same point on screen, and
  // reporting both would draw one mark on top of another.
  const apart = step * 2;

  const xs: number[] = [];
  const ys: (number | null)[] = [];
  for (let i = 0; i <= count; i += 1) {
    const x = xMin + i * step;
    xs.push(x);
    ys.push(f(x));
  }

  const roots: number[] = [];
  const vertical: number[] = [];

  /*
   * Bisection lands far closer than the view can show, and the last few digits
   * of that are float dust: a pole at zero comes back as -1.1e-20, which reads
   * as a wrong answer rather than a precise one. Anything below a millionth of
   * a sample step is zero.
   */
  const place = (x: number) => {
    const rounded = Number(x.toPrecision(12));
    return Math.abs(rounded) < step * 1e-6 ? 0 : rounded;
  };

  for (let i = 0; i < count; i += 1) {
    const [left, right] = [ys[i], ys[i + 1]];
    const [a, b] = [xs[i], xs[i + 1]];

    // One side defined and the other not: either an edge of the domain, which
    // is nothing to mark, or a pole, which is.
    if ((left === null) !== (right === null)) {
      const definedOnTheLeft = left !== null;
      const edge = bisect((x) => (f(x) !== null) === definedOnTheLeft, a, b);
      if (climbs(f, edge, definedOnTheLeft ? -1 : 1) && !near(vertical, edge, apart)) {
        vertical.push(place(edge));
      }
      continue;
    }

    if (left === null || right === null) continue;
    if (left === 0 && !near(roots, a, apart)) roots.push(place(a));
    if (Math.sign(left) === Math.sign(right)) continue;

    // A sign change is either a crossing or a pole with the curve coming back
    // up the other side. Which one it is shows in what the values do on the
    // way in: a crossing shrinks towards zero, a pole grows.
    const crossing = bisect(
      (x) => {
        const value = f(x);
        return value === null || Math.sign(value) === Math.sign(left);
      },
      a,
      b,
    );
    const height = f(crossing);

    if (climbs(f, crossing, -1) || climbs(f, crossing, 1)) {
      if (!near(vertical, crossing, apart)) vertical.push(place(crossing));
    } else if (
      height !== null &&
      Math.abs(height) < Math.abs(left) &&
      !near(roots, crossing, apart)
    ) {
      roots.push(place(crossing));
    }
  }

  const yIntercept = xMin <= 0 && xMax >= 0 ? f(0) : null;

  // A height it settles towards. Three distances, each ten times the last: the
  // curve has to stop moving between them, and the last two say how much is
  // left to go, which is what the extrapolation below takes off.
  const horizontal: number[] = [];
  for (const side of [1, -1] as const) {
    const out = FAR.map((distance) => f(side * distance));
    if (out.some((value) => value === null)) continue;
    const [first, second, third] = out as number[];

    const settling = (a: number, b: number) => Math.abs(a - b) <= 1e-3 * Math.max(1, Math.abs(b));
    if (!settling(first, second) || !settling(second, third)) continue;

    // What is left of the gap after the last step, which for anything built
    // from powers of x closes by a factor of ten each time.
    const limit = zeroed(Number((third + (third - second) / 9).toPrecision(10)));
    if (!near(horizontal, limit, 1e-9)) horizontal.push(limit);
  }

  return { roots, yIntercept, vertical, horizontal };
}

/**
 * The slope of a curve at a point, measured rather than differentiated: the
 * five-point stencil, whose error falls as the fourth power of the step.
 */
export function slopeAt(node: Node, x: number, options: FeatureOptions = {}): number | null {
  const angle = options.angle ?? "rad";
  const variable = options.variable ?? "x";
  // No value here, no slope here: the five points either side would otherwise
  // measure a slope straight across a pole.
  if (valueAt(node, variable, x, angle) === null) return null;

  const h = 1e-5 * Math.max(1, Math.abs(x));
  const points = [-2, -1, 1, 2].map((k) => valueAt(node, variable, x + k * h, angle));
  if (points.some((point) => point === null)) return null;
  const [minus2, minus1, plus1, plus2] = points as number[];
  const slope = (-plus2 + 8 * plus1 - 8 * minus1 + minus2) / (12 * h);
  return Number.isFinite(slope) ? slope : null;
}
