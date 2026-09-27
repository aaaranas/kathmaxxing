import { describe, expect, it } from "vitest";

import { evaluate } from "@/lib/math/evaluate";
import { parseExpression } from "@/lib/math/parse";

/**
 * Every derivative the two differentiation lessons claim, checked against a
 * numerical derivative of the original function.
 *
 * A wrong sign or a mistyped exponent reads perfectly plausibly on the page and
 * cannot be eyeballed, so the arithmetic is checked rather than trusted. The
 * left column mirrors the lesson content by hand, in the calculator's syntax
 * rather than the display notation - if a lesson is edited, this list has to be
 * edited with it, which is the price of checking the claim at all.
 *
 * Multiplication after a variable is written out: the parser reads `x(` as a
 * function call, so `x(3x+2)` is not the product it looks like.
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

/** Central difference: error goes as h^2, so this is good to about 1e-10 relative. */
function numericDerivative(source: string, x: number, h = 1e-5): number {
  return (at(source, x + h) - at(source, x - h)) / (2 * h);
}

type Claim = [name: string, f: string, derivative: string, xs: number[]];

const CLAIMS: Claim[] = [
  // Derivatives - from first principles
  ["fp-1 x^2", "x^2", "2*x", [-2, 0.5, 3]],
  ["fp-2 polynomial", "3*x^2-5*x+1", "6*x-5", [-1, 2, 4]],
  ["fp-3 reciprocal", "1/x", "-1/x^2", [-3, 0.7, 2]],
  ["fp-4 root", "sqrt(x)", "1/(2*sqrt(x))", [0.25, 1, 9]],
  // Derivatives - power rule
  ["pw-1 polynomial", "4*x^3-7*x^2+2*x-9", "12*x^2-14*x+2", [-2, 0, 3]],
  ["pw-2 negative power", "3/x^4", "-12/x^5", [-2, 1.5, 3]],
  ["pw-3 radicals", "5*sqrt(x)+2/cbrt(x)", "5/(2*sqrt(x))-2/(3*root(3,x^4))", [0.5, 2, 8]],
  ["pw-4 split first", "(2*x^3-x)/x", "4*x", [-2, 1, 3]],
  // Derivatives - product and quotient
  ["pq-1 product trig", "x^2*sin(x)", "2*x*sin(x)+x^2*cos(x)", [-1, 0.4, 2]],
  ["pq-2 product exp", "x*e^x", "e^x*(1+x)", [-2, 0, 1.5]],
  ["pq-3 quotient", "(x^2+1)/(x-3)", "(x^2-6*x-1)/(x-3)^2", [-1, 0, 5]],
  ["pq-4 quotient linear", "(2*x+5)/(3*x-1)", "-17/(3*x-1)^2", [-2, 0, 2]],
  // Derivatives - higher derivatives
  ["us-2 first", "x^4-3*x^2", "4*x^3-6*x", [-2, 0.5, 2]],
  ["us-2 second", "4*x^3-6*x", "12*x^2-6", [-2, 0.5, 2]],
  // Derivatives - practice
  ["practice 1", "6*x^5-4*x^3+x-12", "30*x^4-12*x^2+1", [-1.5, 0.5, 2]],
  ["practice 2", "5/x^2", "-10/x^3", [-2, 1, 3]],
  ["practice 3", "8*sqrt(x)", "4/sqrt(x)", [0.25, 1, 4]],
  ["practice 4", "x^3*cos(x)", "3*x^2*cos(x)-x^3*sin(x)", [-1, 0.6, 2]],
  ["practice 5", "x/(x+1)", "1/(x+1)^2", [-3, 0, 2]],
  ["practice 6", "(4*x^5+2*x^2)/x^2", "12*x^2", [-2, 1, 3]],
  ["practice 8", "2*e^x+3*ln(x)", "2*e^x+3/x", [0.5, 1, 2]],
  // Chain rule - one layer
  ["ch-1 bracket power", "(3*x+1)^5", "15*(3*x+1)^4", [-1, 0.3, 2]],
  ["ch-2 sin of square", "sin(x^2)", "2*x*cos(x^2)", [-1, 0.5, 1.5]],
  ["ch-3 exponential", "e^(4*x)", "4*e^(4*x)", [-1, 0, 0.8]],
  ["ch-4 logarithm", "ln(x^2+1)", "2*x/(x^2+1)", [-2, 0, 3]],
  ["ch-5 radical", "sqrt(x^3-2)", "3*x^2/(2*sqrt(x^3-2))", [1.5, 3, 5]],
  ["ch-6 cos cubed", "cos(x)^3", "-3*cos(x)^2*sin(x)", [-1, 0.5, 2]],
  // Chain rule - combined with the other rules
  ["cm-1 product+chain", "x^2*(2*x+1)^4", "2*x*(2*x+1)^3*(6*x+1)", [-2, 0.4, 1.5]],
  ["cm-2 quotient+chain", "(x+1)^3/(x-1)", "2*(x+1)^2*(x-2)/(x-1)^2", [-2, 0, 3]],
  ["cm-3 three layers", "sin(sqrt(x^2+1))", "x*cos(sqrt(x^2+1))/sqrt(x^2+1)", [-2, 0.5, 3]],
  ["cm-4 exp of trig", "e^(sin(x))", "e^(sin(x))*cos(x)", [-1, 0.5, 2]],
  ["cm-5 log of trig", "ln(cos(x))", "-tan(x)", [-1, 0.3, 1]],
  // Chain rule - practice
  ["chain practice 1", "(5*x-2)^7", "35*(5*x-2)^6", [-0.5, 0.6, 1]],
  ["chain practice 2", "cos(3*x)", "-3*sin(3*x)", [-1, 0.4, 2]],
  ["chain practice 3", "e^(x^2)", "2*x*e^(x^2)", [-1.2, 0.3, 1]],
  ["chain practice 4", "sqrt(4*x+9)", "2/sqrt(4*x+9)", [0, 2, 10]],
  ["chain practice 5", "ln(x^3+5)", "3*x^2/(x^3+5)", [-1, 0.5, 2]],
  ["chain practice 6", "sin(x)^2", "2*sin(x)*cos(x)", [-1, 0.7, 2]],
  ["chain practice 7", "x*(3*x+2)^5", "(3*x+2)^4*(18*x+2)", [-1.5, 0.3, 1]],
  ["chain practice 8", "1/(2*x-7)^3", "-6/(2*x-7)^4", [0, 1, 5]],
];

describe.each(CLAIMS)("%s", (_name, f, derivative, xs) => {
  it.each(xs)("agrees with a numerical derivative at x = %s", (x) => {
    const claimed = at(derivative, x);
    const numeric = numericDerivative(f, x);
    // Relative, because a central difference on a function in the hundreds of
    // thousands cannot hold an absolute tolerance that a small one can.
    const tolerance = Math.max(1e-6, Math.abs(numeric) * 1e-6);
    expect(Math.abs(claimed - numeric)).toBeLessThan(tolerance);
  });
});

describe("the tangent lines the lessons work out", () => {
  it.each([
    ["y = x^2-4x+3 at x=3", "x^2-4*x+3", 3, "2*x-6"],
    ["y = x^3 at x=2", "x^3", 2, "12*x-16"],
  ])("%s touches the curve and matches its slope", (_name, curve, a, tangent) => {
    // Same height at the point of contact...
    expect(at(tangent, a)).toBeCloseTo(at(curve, a), 9);
    // ...and the same slope there.
    expect(numericDerivative(tangent, a)).toBeCloseTo(numericDerivative(curve, a), 6);
  });
});
