import { describe, expect, it } from "vitest";

import { findFeatures, slopeAt } from "@/lib/math/features";
import { parseExpression } from "@/lib/math/parse";

function node(source: string) {
  const parsed = parseExpression(source);
  if (!parsed.ok) throw new Error(`${source}: ${parsed.message}`);
  return parsed.node;
}

function features(source: string, xMin = -10, xMax = 10) {
  return findFeatures(node(source), { xMin, xMax });
}

/** Rounded, because these are measured rather than solved. A root found a
 * hair to the left of zero rounds to -0, which is the same place. */
const about = (values: number[]) =>
  values.map((value) => {
    const rounded = Number(value.toFixed(6));
    return Object.is(rounded, -0) ? 0 : rounded;
  });

describe("crossings", () => {
  it("finds where a quadratic cuts the axis", () => {
    const found = features("x^2-3x+2");
    expect(about(found.roots)).toEqual([1, 2]);
    expect(found.yIntercept).toBe(2);
  });

  it("finds a single root, and the y-intercept with it", () => {
    const found = features("2x+1");
    expect(about(found.roots)).toEqual([-0.5]);
    expect(found.yIntercept).toBe(1);
  });

  it("finds nothing to mark on a curve that never crosses", () => {
    const found = features("x^2+1");
    expect(found.roots).toEqual([]);
    expect(found.yIntercept).toBe(1);
  });

  it("finds every crossing of a wave", () => {
    const found = features("sin(x)", -7, 7);
    expect(about(found.roots)).toEqual([-6.283185, -3.141593, 0, 3.141593, 6.283185]);
  });

  it("leaves the y-intercept alone where the curve is not defined there", () => {
    expect(features("1/x").yIntercept).toBeNull();
    expect(features("ln(x)").yIntercept).toBeNull();
  });

  it("does not claim a y-intercept off the side of the view", () => {
    expect(features("2x+1", 3, 10).yIntercept).toBeNull();
  });
});

describe("lines the curve runs away along", () => {
  it("finds the pole of a reciprocal, and not a root", () => {
    const found = features("1/x");
    // Exactly zero, not a hair off it: bisection lands far below what the
    // view can show, and the last digits of that are float dust.
    expect(found.vertical).toEqual([0]);
    expect(found.roots).toEqual([]);
  });

  it("finds both poles of a difference of squares on the bottom", () => {
    const found = features("1/(x^2-4)");
    expect(about(found.vertical)).toEqual([-2, 2]);
  });

  it("finds the poles of a tangent", () => {
    const found = features("tan(x)", -5, 5);
    expect(about(found.vertical)).toEqual([-4.712389, -1.570796, 1.570796, 4.712389]);
  });

  it("marks the pole of a rational function, and its crossing", () => {
    const found = features("(2x+1)/(x-3)");
    expect(about(found.vertical)).toEqual([3]);
    expect(about(found.roots)).toEqual([-0.5]);
  });

  it("is not fooled by a hole, which the curve walks straight through", () => {
    const found = features("(x^2-1)/(x-1)");
    expect(found.vertical).toEqual([]);
  });

  it("is not fooled by the edge of a domain", () => {
    expect(features("sqrt(x)").vertical).toEqual([]);
    expect(features("sqrt(4-x^2)").vertical).toEqual([]);
  });
});

describe("heights the curve settles towards", () => {
  it("finds the axis a reciprocal flattens onto", () => {
    expect(about(features("1/x").horizontal)).toEqual([0]);
  });

  it("finds the ratio of the leading coefficients", () => {
    expect(about(features("(2x+1)/(x-3)").horizontal)).toEqual([2]);
    expect(about(features("(3x^2+1)/(2x^2-x)").horizontal)).toEqual([1.5]);
  });

  it("finds two, where the two ends settle differently", () => {
    // |x|/x is -1 to the left and 1 to the right.
    expect(about(features("abs(x)/x").horizontal).sort()).toEqual([-1, 1]);
  });

  it("finds none where the curve keeps climbing", () => {
    expect(features("x^2").horizontal).toEqual([]);
    expect(features("2x+1").horizontal).toEqual([]);
    expect(features("sin(x)").horizontal).toEqual([]);
  });
});

describe("slopeAt", () => {
  it("measures the slope of a line", () => {
    expect(slopeAt(node("3x+1"), 2)).toBeCloseTo(3, 6);
  });

  it("measures the slope of a curve", () => {
    expect(slopeAt(node("x^2"), 3)).toBeCloseTo(6, 5);
    expect(slopeAt(node("x^3"), -2)).toBeCloseTo(12, 4);
    expect(slopeAt(node("sin(x)"), 0)).toBeCloseTo(1, 6);
    expect(slopeAt(node("ln(x)"), 2)).toBeCloseTo(0.5, 6);
  });

  it("has no slope where the curve has no value", () => {
    expect(slopeAt(node("1/x"), 0)).toBeNull();
    expect(slopeAt(node("sqrt(x)"), -1)).toBeNull();
  });
});

describe("a range that is no range at all", () => {
  it("comes back empty rather than guessing", () => {
    const found = findFeatures(node("x"), { xMin: 5, xMax: 5 });
    expect(found).toEqual({ roots: [], yIntercept: null, vertical: [], horizontal: [] });
  });
});
