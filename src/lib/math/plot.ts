import { type Node } from "@/lib/math/parse";
import { type AngleMode, evaluate, valueToNumber } from "@/lib/math/evaluate";

/**
 * Turning an expression into something drawable.
 *
 * The view is held as a centre and a scale rather than as four edges, so one
 * number governs both axes and a unit is the same length across and down. That
 * matters for the lessons this serves: a slope of 1 has to look like 45°, and a
 * circle has to look round.
 */
export type View = {
  centerX: number;
  centerY: number;
  /** Graph units per screen pixel. Larger means further out. */
  unitsPerPixel: number;
};

export type Size = { width: number; height: number };

export type Bounds = { xMin: number; xMax: number; yMin: number; yMax: number };

export function boundsOf(view: View, size: Size): Bounds {
  const halfWidth = (size.width / 2) * view.unitsPerPixel;
  const halfHeight = (size.height / 2) * view.unitsPerPixel;
  return {
    xMin: view.centerX - halfWidth,
    xMax: view.centerX + halfWidth,
    yMin: view.centerY - halfHeight,
    yMax: view.centerY + halfHeight,
  };
}

export function toScreenX(x: number, view: View, size: Size): number {
  return size.width / 2 + (x - view.centerX) / view.unitsPerPixel;
}

/** Screen y grows downwards, so the sign flips here and nowhere else. */
export function toScreenY(y: number, view: View, size: Size): number {
  return size.height / 2 - (y - view.centerY) / view.unitsPerPixel;
}

export function toGraphX(screenX: number, view: View, size: Size): number {
  return view.centerX + (screenX - size.width / 2) * view.unitsPerPixel;
}

export function toGraphY(screenY: number, view: View, size: Size): number {
  return view.centerY - (screenY - size.height / 2) * view.unitsPerPixel;
}

/**
 * A gridline spacing a person would have chosen: 1, 2 or 5 times a power of
 * ten, whichever first clears `minPixels` on screen.
 */
export function tickStep(unitsPerPixel: number, minPixels = 64): number {
  const raw = unitsPerPixel * minPixels;
  if (!Number.isFinite(raw) || raw <= 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return factor * magnitude;
}

/** Every multiple of `step` inside the range, endpoints included. */
export function ticksBetween(min: number, max: number, step: number): number[] {
  if (!Number.isFinite(step) || step <= 0) return [];
  const first = Math.ceil(min / step);
  const last = Math.floor(max / step);
  // A view zoomed far enough out could ask for more labels than are readable.
  if (last - first > 1000) return [];

  const out: number[] = [];
  for (let i = first; i <= last; i += 1) out.push(i * step);
  return out;
}

/**
 * Label a tick without floating-point dust: 0.30000000000000004 is a rounding
 * artefact of the step, so the number of decimals comes from the step itself.
 */
export function formatTick(value: number, step: number): string {
  if (Object.is(value, -0) || value === 0) return "0";

  const decimals = Math.max(0, Math.min(12, -Math.floor(Math.log10(step))));
  const magnitude = Math.abs(value);
  if (magnitude >= 1e6 || (magnitude < 1e-4 && magnitude > 0)) {
    return value.toExponential(1).replace(/\.0e/, "e");
  }
  return value.toFixed(decimals);
}

/** A run of consecutive screen points. A gap ends one and starts the next. */
export type Segment = { x: number; y: number }[];

export type SampleOptions = {
  /** Pixels between samples. One is plenty for a curve at screen resolution. */
  step?: number;
  angle?: AngleMode;
  variable?: string;
};

/**
 * Sample a curve across the view, in screen coordinates, broken wherever it is
 * undefined or runs off to infinity.
 *
 * The break is what stops a vertical line being drawn across an asymptote:
 * 1/x has no value joining the two branches, so joining them with a stroke
 * would draw a line that is not part of the graph.
 */
export function sampleCurve(
  node: Node,
  view: View,
  size: Size,
  options: SampleOptions = {},
): Segment[] {
  const step = options.step ?? 1;
  const variable = options.variable ?? "x";
  const angle = options.angle ?? "rad";

  // Far enough off screen that the curve is out of sight either way, so a gap
  // there cannot be seen - but near enough that a steep line still joins up.
  const limit = size.height * 8;

  const segments: Segment[] = [];
  let current: Segment = [];

  const endSegment = () => {
    if (current.length > 1) segments.push(current);
    current = [];
  };

  for (let screenX = 0; screenX <= size.width; screenX += step) {
    const x = toGraphX(screenX, view, size);
    const result = evaluate(node, {
      angle,
      scope: { [variable]: { kind: "approx", value: x } },
    });

    if (!result.ok) {
      endSegment();
      continue;
    }

    const y = valueToNumber(result.value);
    if (!Number.isFinite(y)) {
      endSegment();
      continue;
    }

    const screenY = toScreenY(y, view, size);
    if (Math.abs(screenY - size.height / 2) > limit) {
      endSegment();
      continue;
    }

    current.push({ x: screenX, y: screenY });
  }

  endSegment();
  return segments;
}

/** An SVG path for one sampled run. */
export function toPath(segment: Segment): string {
  return segment
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

/** Zoom about a fixed screen point, so the spot under the cursor stays put. */
export function zoomAt(view: View, size: Size, screenX: number, screenY: number, factor: number): View {
  const anchorX = toGraphX(screenX, view, size);
  const anchorY = toGraphY(screenY, view, size);
  const unitsPerPixel = clampScale(view.unitsPerPixel * factor);

  // Put the anchor back where it was by moving the centre the same distance.
  return {
    unitsPerPixel,
    centerX: anchorX - (screenX - size.width / 2) * unitsPerPixel,
    centerY: anchorY + (screenY - size.height / 2) * unitsPerPixel,
  };
}

/** Keeps the view inside the range where a double still has digits to spare. */
export function clampScale(unitsPerPixel: number): number {
  return Math.min(1e9, Math.max(1e-9, unitsPerPixel));
}
