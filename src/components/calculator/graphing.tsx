"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Minus, Plus, Scan, Trash2, TriangleAlert } from "lucide-react";

import { Math as Notation } from "@/components/math";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type Node, parseExpression } from "@/lib/math/parse";
import { evaluate, valueToNumber } from "@/lib/math/evaluate";
import { toNotation } from "@/lib/math/render";
import {
  type Segment,
  type View,
  formatTick,
  sampleCurve,
  ticksBetween,
  tickStep,
  toGraphX,
  toPath,
  toScreenX,
  toScreenY,
  zoomAt,
} from "@/lib/math/plot";
import { cn } from "@/lib/utils";

/**
 * Black is the only ink in this app, so curves are told apart by the line
 * itself rather than by colour - which has the happy side effect of surviving a
 * photocopier, a projector, and colour blindness.
 */
const STROKES = [
  { dash: undefined, name: "solid" },
  { dash: "7 4", name: "dashed" },
  { dash: "1.5 4", name: "dotted" },
  { dash: "10 3 1.5 3", name: "dash-dot" },
] as const;

const START: View = { centerX: 0, centerY: 0, unitsPerPixel: 0.025 };

const EXAMPLES = ["2x+1", "x^2-3x+2", "1/x", "sqrt(x)", "sin(x)"] as const;

type Curve = { id: number; source: string };

type Compiled = {
  id: number;
  source: string;
  node: Node | null;
  message: string | null;
  reading: string | null;
};

export function GraphingCalculator() {
  const [curves, setCurves] = useState<Curve[]>([{ id: 1, source: "x^2-3x+2" }]);
  const [view, setView] = useState<View>(START);
  const [size, setSize] = useState({ width: 640, height: 440 });
  const [pointerX, setPointerX] = useState<number | null>(null);

  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; view: View } | null>(null);
  const nextId = useRef(2);

  // The plot fills whatever column it is given, so the sampling has to know how
  // wide that turned out to be rather than assume.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.max(240, Math.round(entry.contentRect.width));
      setSize({ width, height: Math.round(Math.min(Math.max(width * 0.68, 300), 520)) });
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const compiled = useMemo<Compiled[]>(
    () =>
      curves.map((curve) => {
        if (curve.source.trim().length === 0) {
          return { ...curve, node: null, message: null, reading: null };
        }
        const parsed = parseExpression(curve.source);
        return parsed.ok
          ? { ...curve, node: parsed.node, message: null, reading: toNotation(parsed.node) }
          : { ...curve, node: null, message: parsed.message, reading: null };
      }),
    [curves],
  );

  const plotted = useMemo(
    () =>
      compiled.map((curve) => ({
        id: curve.id,
        segments: curve.node ? sampleCurve(curve.node, view, size) : ([] as Segment[]),
      })),
    [compiled, view, size],
  );

  const grid = useMemo(() => {
    const step = tickStep(view.unitsPerPixel);
    const xs = ticksBetween(
      toGraphX(0, view, size),
      toGraphX(size.width, view, size),
      step,
    );
    const yTop = view.centerY + (size.height / 2) * view.unitsPerPixel;
    const yBottom = view.centerY - (size.height / 2) * view.unitsPerPixel;
    return { step, xs, ys: ticksBetween(yBottom, yTop, step) };
  }, [view, size]);

  const readout = useMemo(() => {
    if (pointerX === null) return null;
    const x = toGraphX(pointerX, view, size);
    const values = compiled.map((curve) => {
      if (!curve.node) return { id: curve.id, y: null };
      const result = evaluate(curve.node, {
        angle: "rad",
        scope: { x: { kind: "approx", value: x } },
      });
      if (!result.ok) return { id: curve.id, y: null };
      const y = valueToNumber(result.value);
      return { id: curve.id, y: Number.isFinite(y) ? y : null };
    });
    return { x, values };
  }, [pointerX, view, size, compiled]);

  const setSource = useCallback((id: number, source: string) => {
    setCurves((list) => list.map((curve) => (curve.id === id ? { ...curve, source } : curve)));
  }, []);

  function addCurve() {
    if (curves.length >= STROKES.length) return;
    setCurves((list) => [...list, { id: nextId.current++, source: "" }]);
  }

  function removeCurve(id: number) {
    setCurves((list) => (list.length === 1 ? list : list.filter((curve) => curve.id !== id)));
  }

  function zoom(factor: number) {
    setView((current) => zoomAt(current, size, size.width / 2, size.height / 2, factor));
  }

  function onPointerDown(event: React.PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, view };
  }

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    setPointerX(event.clientX - box.left);

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    // Dragging moves the paper under the pen, so the centre goes the other way.
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    setView({
      unitsPerPixel: drag.view.unitsPerPixel,
      centerX: drag.view.centerX - dx * drag.view.unitsPerPixel,
      centerY: drag.view.centerY + dy * drag.view.unitsPerPixel,
    });
  }

  function endDrag(event: React.PointerEvent<SVGSVGElement>) {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  }

  function onWheel(event: React.WheelEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    setView((current) =>
      zoomAt(
        current,
        size,
        event.clientX - box.left,
        event.clientY - box.top,
        event.deltaY > 0 ? 1.15 : 1 / 1.15,
      ),
    );
  }

  const axisX = toScreenY(0, view, size);
  const axisY = toScreenX(0, view, size);

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
      <div className="flex flex-col gap-4 lg:order-2">
        <Card className="border-0 ring-1 ring-foreground/15">
          <CardContent className="flex flex-col gap-3">
            <div ref={frameRef} className="w-full">
              <svg
                width={size.width}
                height={size.height}
                viewBox={`0 0 ${size.width} ${size.height}`}
                role="img"
                aria-label={
                  "Graph of " +
                  (compiled
                    .filter((curve) => curve.node)
                    .map((curve) => "y = " + curve.source)
                    .join(", ") || "nothing yet")
                }
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={(event) => {
                  endDrag(event);
                  setPointerX(null);
                }}
                onWheel={onWheel}
                className="block w-full cursor-grab touch-none rounded-lg border border-line bg-paper active:cursor-grabbing"
              >
                {/* Grid first, so everything else sits on top of it. */}
                <g stroke="var(--line)" strokeWidth={1}>
                  {grid.xs.map((value) => {
                    const x = toScreenX(value, view, size);
                    return <line key={`gx${value}`} x1={x} y1={0} x2={x} y2={size.height} />;
                  })}
                  {grid.ys.map((value) => {
                    const y = toScreenY(value, view, size);
                    return <line key={`gy${value}`} x1={0} y1={y} x2={size.width} y2={y} />;
                  })}
                </g>

                <g stroke="var(--foreground)" strokeWidth={1.5}>
                  <line x1={0} y1={axisX} x2={size.width} y2={axisX} />
                  <line x1={axisY} y1={0} x2={axisY} y2={size.height} />
                </g>

                {plotted.map((curve, index) => (
                  <g
                    key={curve.id}
                    fill="none"
                    stroke="var(--foreground)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray={STROKES[index % STROKES.length].dash}
                  >
                    {curve.segments.map((segment, position) => (
                      <path key={position} d={toPath(segment)} />
                    ))}
                  </g>
                ))}

                {/*
                  Painting the stroke first puts a halo of paper behind each
                  label, so a number stays readable where a gridline or a curve
                  runs through it.
                */}
                <g
                  fill="var(--foreground)"
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  stroke="var(--paper)"
                  strokeWidth={3}
                  paintOrder="stroke"
                  strokeLinejoin="round"
                >
                  {grid.xs.map((value) => (
                    <text
                      key={`lx${value}`}
                      x={toScreenX(value, view, size) + 3}
                      y={Math.min(Math.max(axisX + 12, 12), size.height - 4)}
                    >
                      {formatTick(value, grid.step)}
                    </text>
                  ))}
                  {grid.ys.map((value) =>
                    value === 0 ? null : (
                      <text
                        key={`ly${value}`}
                        x={Math.min(Math.max(axisY + 4, 4), size.width - 28)}
                        y={toScreenY(value, view, size) - 3}
                      >
                        {formatTick(value, grid.step)}
                      </text>
                    ),
                  )}
                </g>

                {readout && (
                  <g>
                    <line
                      x1={pointerX ?? 0}
                      y1={0}
                      x2={pointerX ?? 0}
                      y2={size.height}
                      stroke="var(--foreground)"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                      opacity={0.5}
                    />
                    {readout.values.map((value) =>
                      value.y === null ? null : (
                        <circle
                          key={value.id}
                          cx={pointerX ?? 0}
                          cy={toScreenY(value.y, view, size)}
                          r={3.5}
                          fill="var(--paper)"
                          stroke="var(--foreground)"
                          strokeWidth={2}
                        />
                      ),
                    )}
                  </g>
                )}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs">
                <Crosshair aria-hidden className="size-3 shrink-0" />
                {readout ? (
                  <span className="tnum font-mono">
                    x = {formatTick(readout.x, grid.step / 100)}
                    {readout.values.map((value, index) =>
                      value.y === null ? null : (
                        <span key={value.id}>
                          {"  "}y
                          <sub>{index + 1}</sub> = {formatTick(value.y, grid.step / 100)}
                        </span>
                      ),
                    )}
                  </span>
                ) : (
                  <span>Drag to move, scroll to zoom, hover to read a value.</span>
                )}
              </p>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Zoom in"
                  onClick={() => zoom(1 / 1.4)}
                  className="size-8 border border-line bg-paper text-foreground hover:bg-plate"
                >
                  <Plus className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Zoom out"
                  onClick={() => zoom(1.4)}
                  className="size-8 border border-line bg-paper text-foreground hover:bg-plate"
                >
                  <Minus className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Back to the starting view"
                  onClick={() => setView(START)}
                  className="h-8 gap-1.5 border border-line bg-paper px-2 text-xs text-foreground hover:bg-plate"
                >
                  <Scan className="size-3.5" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 ring-1 ring-foreground/15 lg:order-1">
        <CardHeader>
          <CardTitle>Functions of x</CardTitle>
          <CardDescription>
            Up to {STROKES.length}. Each gets its own kind of line rather than its own colour.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <ul className="flex flex-col gap-3">
            {compiled.map((curve, index) => (
              <li key={curve.id} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="flex w-9 shrink-0 items-center justify-center rounded bg-plate py-1.5"
                    title={STROKES[index % STROKES.length].name}
                  >
                    <svg width={22} height={2} viewBox="0 0 22 2">
                      <line
                        x1={0}
                        y1={1}
                        x2={22}
                        y2={1}
                        stroke="var(--foreground)"
                        strokeWidth={2}
                        strokeDasharray={STROKES[index % STROKES.length].dash}
                      />
                    </svg>
                  </span>

                  <label htmlFor={`curve-${curve.id}`} className="sr-only">
                    Function {index + 1}
                  </label>
                  <span aria-hidden className="font-mono text-sm">
                    y<sub>{index + 1}</sub> =
                  </span>
                  <Input
                    id={`curve-${curve.id}`}
                    value={curve.source}
                    onChange={(event) => setSource(curve.id, event.target.value)}
                    placeholder="x^2"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-invalid={curve.message !== null}
                    className="tnum h-9 flex-1 border-line bg-desk font-mono"
                  />
                  {curves.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove function ${index + 1}`}
                      onClick={() => removeCurve(curve.id)}
                      className="size-8 shrink-0 text-foreground hover:bg-plate"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>

                {curve.message ? (
                  <p className="text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-2 py-1">
                      <TriangleAlert aria-hidden className="size-3 shrink-0" />
                      {curve.message}
                    </span>
                  </p>
                ) : (
                  curve.reading && (
                    <p className="flex flex-wrap items-baseline gap-1.5 pl-11 text-xs">
                      <span>reads as</span>
                      <Notation expr={curve.reading} className="overflow-x-auto text-sm" />
                    </p>
                  )
                )}
              </li>
            ))}
          </ul>

          {curves.length < STROKES.length && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addCurve}
              className="h-8 w-fit gap-1.5 border border-line bg-paper px-2.5 text-xs text-foreground hover:bg-plate"
            >
              <Plus className="size-3.5" />
              Add a function
            </Button>
          )}

          <div className="flex flex-col gap-1.5 border-t border-line pt-3">
            <p className="text-xs">Try one:</p>
            <ul className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((example) => (
                <li key={example}>
                  <button
                    type="button"
                    onClick={() => setSource(curves[0].id, example)}
                    className={cn(
                      "rounded-md border border-line bg-paper px-2 py-1 font-mono text-xs",
                      "hover:bg-plate/60",
                    )}
                  >
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
