import { describe, expect, it } from "vitest";

import { evaluate } from "@/lib/math/evaluate";
import { parseExpression } from "@/lib/math/parse";

/**
 * Every limit the Limits lesson claims, checked by actually walking towards the
 * point with the app's own engine.
 *
 * A limit is the kind of claim that reads fine and is off by a sign, so the
 * approach is evaluated rather than trusted. As with the derivatives test, this
 * list mirrors the lesson by hand in the calculator's syntax and has to be
 * edited alongside it.
 */

function at(source: string, x: number): number {
  const parsed = parseExpression(source);
  if (!parsed.ok) throw new Error(`${source}: ${parsed.message}`);
  const result = evaluate(parsed.node, {
    angle: "rad",
    scope: { x: { kind: "approx", value: x } },
  });
  if (!result.ok) throw new Error(`${source} at x=${x}: ${result.message}`);
  return result.value.kind === "exact"
    ? Number(result.value.value.n) / Number(result.value.value.d)
    : result.value.value;
}

const EPSILONS = [1e-3, 1e-4, 1e-5];

/** Finite two-sided limits: both sides have to close in on the same value. */
const FINITE: [name: string, f: string, a: number, limit: number][] = [
  ["substitution", "3*x^2-4*x+1", 2, 5],
  ["factor and cancel", "(x^2-9)/(x-3)", 3, 6],
  ["cancel both sides", "(x^2-1)/(x^2+3*x+2)", -1, -2],
  ["conjugate", "(sqrt(x+4)-2)/x", 0, 0.25],
  ["combine fractions", "(1/(x+2)-1/2)/x", 0, -0.25],
  ["looks infinite, is not", "(x^2-4)/(x-2)", 2, 4],
  ["trig, inside rescaled", "sin(5*x)/x", 0, 5],
  ["practice 1", "(x^2-16)/(x-4)", 4, 8],
  ["practice 2", "(sqrt(x+9)-3)/x", 0, 1 / 6],
  ["practice 3", "(x-5)/(x^2-25)", 5, 0.1],
  ["practice 7", "sin(7*x)/x", 0, 7],
  ["practice 9, an infinity minus an infinity that cancels", "1/(x-1)-2/(x^2-1)", 1, 0.5],
];

describe.each(FINITE)("finite limit — %s", (_name, f, a, limit) => {
  it.each(EPSILONS)("closes in from both sides at distance %s", (eps) => {
    for (const x of [a - eps, a + eps]) {
      expect(Math.abs(at(f, x) - limit)).toBeLessThan(1e-2);
    }
  });

  it("gets closer as the approach tightens", () => {
    const far = Math.abs(at(f, a + EPSILONS[0]) - limit);
    const near = Math.abs(at(f, a + EPSILONS[2]) - limit);
    // Allow equality: a limit reached exactly stays exact rather than improving.
    expect(near).toBeLessThanOrEqual(far + 1e-12);
  });
});

/** Infinite limits: the claim is a direction, so check size and sign. */
const INFINITE: [name: string, f: string, a: number, side: -1 | 1, sign: -1 | 1][] = [
  ["1/x^2 from the left", "1/x^2", 0, -1, 1],
  ["1/x^2 from the right", "1/x^2", 0, 1, 1],
  ["1/x from the left", "1/x", 0, -1, -1],
  ["1/x from the right", "1/x", 0, 1, 1],
  ["2x/(x-1) from the left", "2*x/(x-1)", 1, -1, -1],
  ["2x/(x-1) from the right", "2*x/(x-1)", 1, 1, 1],
  ["squared denominator, left", "(x+1)/(x-3)^2", 3, -1, 1],
  ["squared denominator, right", "(x+1)/(x-3)^2", 3, 1, 1],
  ["practice 4", "3/(x-2)", 2, 1, 1],
  // The one off her homework: two pieces that each run away, combined first.
  ["combined fractions, from the left", "2/(x^2+5*x+4)-3/(x+4)", -4, -1, 1],
  ["combined fractions, from the right", "2/(x^2+5*x+4)-3/(x+4)", -4, 1, -1],
  ["practice 10", "3/(x-2)-1/(x^2-4)", 2, -1, -1],
];

describe.each(INFINITE)("infinite limit — %s", (_name, f, a, side, sign) => {
  it("grows without bound, with the claimed sign", () => {
    const near = at(f, a + side * 1e-4);
    const nearer = at(f, a + side * 1e-6);
    expect(Math.sign(near)).toBe(sign);
    expect(Math.sign(nearer)).toBe(sign);
    expect(Math.abs(nearer)).toBeGreaterThan(Math.abs(near));
    expect(Math.abs(nearer)).toBeGreaterThan(1e5);
  });
});

/** Limits at infinity, including the ones where the sign is the whole point. */
const AT_INFINITY: [name: string, f: string, xs: number[], limit: number][] = [
  ["equal degrees", "(3*x^2-x)/(2*x^2+5)", [1e5, 1e6], 1.5],
  ["bottom wins", "(2*x+1)/(x^2-3)", [1e5, 1e6], 0],
  ["radical, towards +inf", "sqrt(x^2+1)/x", [1e5, 1e6], 1],
  ["radical, towards -inf", "sqrt(x^2+1)/x", [-1e5, -1e6], -1],
  ["infinity minus infinity", "sqrt(4*x^2+x)-2*x", [1e4, 1e5], 0.25],
  ["practice 5", "(4*x^3-x)/(2*x^3+7)", [-1e4, -1e5], 2],
  ["practice 6", "(5*x+2)/(x^2+1)", [1e5, 1e6], 0],
  ["practice 8", "sqrt(9*x^2+2)/x", [-1e5, -1e6], -3],
];

describe.each(AT_INFINITY)("limit at infinity — %s", (_name, f, xs, limit) => {
  it.each(xs)("is near the claimed value at x = %s", (x) => {
    expect(Math.abs(at(f, x) - limit)).toBeLessThan(1e-3);
  });
});

describe("the standard limits the lesson quotes", () => {
  it.each([1e-3, 1e-5])("sin(x)/x heads to 1 at distance %s", (eps) => {
    expect(at("sin(x)/x", eps)).toBeCloseTo(1, 6);
  });

  it.each([1e-3, 1e-5])("(1-cos x)/x heads to 0 at distance %s", (eps) => {
    expect(at("(1-cos(x))/x", eps)).toBeCloseTo(0, 2);
  });

  it("the squeeze example is trapped between its bounds", () => {
    for (const x of [1e-2, 1e-3, 1e-4]) {
      const value = at("x^2*sin(1/x)", x);
      expect(Math.abs(value)).toBeLessThanOrEqual(x * x);
    }
  });
});
