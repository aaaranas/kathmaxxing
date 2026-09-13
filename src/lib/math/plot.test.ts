import { describe, expect, it } from "vitest";

import { parseExpression } from "@/lib/math/parse";
import {
  type View,
  boundsOf,
  formatTick,
  sampleCurve,
  ticksBetween,
  tickStep,
  toGraphX,
  toScreenX,
  toScreenY,
  zoomAt,
} from "@/lib/math/plot";

const SIZE = { width: 600, height: 400 };
const VIEW: View = { centerX: 0, centerY: 0, unitsPerPixel: 0.02 };

function nodeOf(source: string) {
  const parsed = parseExpression(source);
  if (!parsed.ok) throw new Error(parsed.message);
  return parsed.node;
}

describe("the view", () => {
  it("spans the size at the current scale", () => {
    expect(boundsOf(VIEW, SIZE)).toEqual({ xMin: -6, xMax: 6, yMin: -4, yMax: 4 });
  });

  it("keeps one unit the same length across and down", () => {
    const acrossOneUnit = toScreenX(1, VIEW, SIZE) - toScreenX(0, VIEW, SIZE);
    const downOneUnit = toScreenY(0, VIEW, SIZE) - toScreenY(1, VIEW, SIZE);
    expect(acrossOneUnit).toBeCloseTo(downOneUnit);
  });

  it("puts the origin in the middle and grows y upwards", () => {
    expect(toScreenX(0, VIEW, SIZE)).toBe(300);
    expect(toScreenY(0, VIEW, SIZE)).toBe(200);
    expect(toScreenY(1, VIEW, SIZE)).toBeLessThan(toScreenY(0, VIEW, SIZE));
  });

  it("round-trips a coordinate", () => {
    expect(toGraphX(toScreenX(2.5, VIEW, SIZE), VIEW, SIZE)).toBeCloseTo(2.5);
  });
});

describe("zooming", () => {
  it("leaves the point under the cursor where it was", () => {
    const before = toGraphX(120, VIEW, SIZE);
    const zoomed = zoomAt(VIEW, SIZE, 120, 90, 0.5);
    expect(toGraphX(120, zoomed, SIZE)).toBeCloseTo(before);
  });

  it("refuses to zoom past the precision a double has left", () => {
    let view = VIEW;
    for (let i = 0; i < 200; i += 1) view = zoomAt(view, SIZE, 0, 0, 0.5);
    expect(view.unitsPerPixel).toBeGreaterThanOrEqual(1e-9);
  });
});

describe("gridlines", () => {
  it("steps by one, two or five times a power of ten", () => {
    for (const scale of [0.001, 0.02, 0.5, 3, 400]) {
      const step = tickStep(scale);
      const normalized = step / 10 ** Math.floor(Math.log10(step));
      expect([1, 2, 5]).toContain(Math.round(normalized));
    }
  });

  it("keeps the spacing readable rather than fixed", () => {
    expect(tickStep(0.02, 64)).toBeGreaterThanOrEqual(1);
    expect(tickStep(2, 64)).toBeGreaterThan(tickStep(0.02, 64));
  });

  it("lists the multiples inside a range", () => {
    expect(ticksBetween(-2.5, 2.5, 1)).toEqual([-2, -1, 0, 1, 2]);
    expect(ticksBetween(0, 1, 0.5)).toEqual([0, 0.5, 1]);
  });

  it("gives up rather than emit thousands of labels", () => {
    expect(ticksBetween(-1e9, 1e9, 1)).toEqual([]);
  });

  it("labels a tick with the decimals its step calls for, and no dust", () => {
    expect(formatTick(0.3, 0.1)).toBe("0.3");
    expect(formatTick(-0, 1)).toBe("0");
    expect(formatTick(2, 1)).toBe("2");
    expect(formatTick(1500000, 500000)).toBe("1.5e+6");
  });
});

describe("sampling a curve", () => {
  it("draws a straight line as one unbroken run", () => {
    const segments = sampleCurve(nodeOf("2x+1"), VIEW, SIZE);
    expect(segments).toHaveLength(1);
    expect(segments[0].length).toBeGreaterThan(100);
  });

  it("puts the line where the arithmetic says", () => {
    const segments = sampleCurve(nodeOf("2x+1"), VIEW, SIZE, { step: 300 });
    // Screen x of 300 is graph x of 0, so y is 1.
    const middle = segments[0].find((point) => point.x === 300);
    expect(middle?.y).toBeCloseTo(toScreenY(1, VIEW, SIZE));
  });

  it("breaks either side of an asymptote instead of joining the branches", () => {
    const segments = sampleCurve(nodeOf("1/x"), VIEW, SIZE);
    expect(segments.length).toBe(2);
  });

  it("leaves a gap where the function is not real", () => {
    // sqrt(x) exists only for the right half of a view centred on the origin.
    const segments = sampleCurve(nodeOf("sqrt(x)"), VIEW, SIZE);
    expect(segments).toHaveLength(1);
    expect(Math.min(...segments[0].map((p) => p.x))).toBeGreaterThanOrEqual(SIZE.width / 2);
  });

  it("breaks at each tangent asymptote", () => {
    const segments = sampleCurve(nodeOf("tan(x)"), VIEW, SIZE);
    expect(segments.length).toBeGreaterThan(2);
  });

  it("returns nothing for a curve that is nowhere real in view", () => {
    expect(sampleCurve(nodeOf("sqrt(-1-x^2)"), VIEW, SIZE)).toEqual([]);
  });

  it("reads a variable other than x when asked", () => {
    const segments = sampleCurve(nodeOf("2t"), VIEW, SIZE, { variable: "t" });
    expect(segments).toHaveLength(1);
  });
});
