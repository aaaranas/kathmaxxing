"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Check as CheckMark, CircleHelp, TriangleAlert, X } from "lucide-react";

import { Math } from "@/components/math";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  type Approach,
  type Check,
  areEquivalent,
  checkDerivative,
  checkLimit,
  describeLimitAnswer,
  freeVariables,
  readApproachPoint,
  readLimitAnswer,
} from "@/lib/math/check";
import type { AngleMode } from "@/lib/math/evaluate";
import { parseExpression } from "@/lib/math/parse";
import { toNotation } from "@/lib/math/render";
import { cn } from "@/lib/utils";

/**
 * Marking, rather than solving.
 *
 * She has an answer already - off a worksheet, or out of her own working - and
 * the only question is whether it is right. That is a much smaller job than
 * producing the answer, and `@/lib/math/check` does it by testing her answer
 * against the real thing at a spread of values. This page is the front of that:
 * three questions it can answer, the same input conventions as the calculator,
 * and a verdict that says how sure it is rather than pretending to certainty.
 */

const VERDICTS: Record<Check["state"], { icon: LucideIcon; headline: string; tone: string }> = {
  correct: { icon: CheckMark, headline: "That's right.", tone: "bg-plate" },
  incorrect: { icon: X, headline: "Not quite.", tone: "bg-destructive" },
  unsure: { icon: CircleHelp, headline: "Can't call this one.", tone: "bg-desk" },
  unreadable: { icon: TriangleAlert, headline: "Couldn't read that.", tone: "bg-destructive" },
};

/** Notation for an expression, or null while it is still half-typed. */
function reading(source: string): string | null {
  if (source.trim().length === 0) return null;
  const parsed = parseExpression(source);
  return parsed.ok ? toNotation(parsed.node) : null;
}

/** The letter a question is about, so the working and the verdict agree on it. */
function variableOf(source: string, fallback = "x"): string {
  const parsed = parseExpression(source);
  if (!parsed.ok) return fallback;
  return freeVariables(parsed.node)[0] ?? fallback;
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  placeholder: string;
  /** Shown while there is nothing readable to echo back. */
  hint?: string;
  /** Notation to echo instead of the field's own reading. */
  echo?: string | null;
};

function Field({ id, label, value, onChange, onSubmit, placeholder, hint, echo }: FieldProps) {
  const notation = echo === undefined ? reading(value) : echo;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="tnum h-auto rounded-lg border-line bg-desk px-4 py-3 font-mono text-lg leading-none"
      />
      {notation ? (
        <span className="flex flex-wrap items-baseline gap-2 rounded-md bg-desk px-3 py-1.5">
          <span className="text-xs font-medium">Reads as</span>
          <Math expr={notation} className="overflow-x-auto" />
        </span>
      ) : (
        hint && <p className="text-xs">{hint}</p>
      )}
    </div>
  );
}

function Verdict({ verdict, waiting }: { verdict: Check | null; waiting: string }) {
  if (verdict === null) {
    return (
      <Card className="border-0 ring-1 ring-foreground/15">
        <CardContent>
          <p aria-live="polite" className="text-sm">
            {waiting}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { icon: Icon, headline, tone } = VERDICTS[verdict.state];

  return (
    <Card className="border-0 ring-1 ring-foreground/15">
      <CardContent>
        <div aria-live="polite" className={cn("flex flex-col gap-1.5 rounded-lg px-4 py-3", tone)}>
          <p className="flex items-center gap-2 text-base font-medium">
            <Icon aria-hidden className="size-4 shrink-0" />
            {headline}
          </p>
          <p className="text-sm">{verdict.detail}</p>
          {verdict.state === "correct" && (
            <p className="text-xs">
              Checked by testing, not by rearranging, so this is very strong evidence rather than a
              proof.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/** Chips that fill in a whole question, the way the calculator offers examples. */
function Examples({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium">{label}</p>
      <ul className="flex flex-wrap gap-1.5">{children}</ul>
    </div>
  );
}

function ExampleChip({ onPick, children }: { onPick: () => void; children: React.ReactNode }) {
  return (
    <li>
      <button
        type="button"
        onClick={onPick}
        className="rounded-md border border-line bg-paper px-2.5 py-1 font-mono text-xs hover:bg-plate/60"
      >
        {children}
      </button>
    </li>
  );
}

function AngleToggle({
  angle,
  onChange,
}: {
  angle: AngleMode;
  onChange: (next: AngleMode) => void;
}) {
  return (
    <fieldset className="flex items-center gap-2">
      <legend className="sr-only">Angle mode</legend>
      <span className="text-xs">Angles</span>
      <ToggleGroup
        type="single"
        value={angle}
        onValueChange={(next) => next && onChange(next as AngleMode)}
        className="gap-1"
      >
        {(["rad", "deg"] as const).map((mode) => (
          <ToggleGroupItem
            key={mode}
            value={mode}
            aria-label={mode === "rad" ? "Radians" : "Degrees"}
            className={cn(
              "h-7 rounded-md border border-line bg-paper px-2 font-mono text-xs text-foreground",
              "hover:bg-plate/60 data-[state=on]:border-foreground data-[state=on]:bg-plate",
            )}
          >
            {mode.toUpperCase()}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </fieldset>
  );
}

const TABS = [
  { id: "same", label: "Same thing?" },
  { id: "derivative", label: "Derivative" },
  { id: "limit", label: "Limit" },
] as const;

type Same = { left: string; right: string; verdict: Check | null };
type Derivative = { fn: string; mine: string; verdict: Check | null };
type Limit = {
  fn: string;
  at: string;
  side: Approach["side"];
  mine: string;
  verdict: Check | null;
};

// Short labels: the legend above them already says what they are sides of, and
// the full wording does not fit the column this sits in on a wide screen.
const SIDES: { value: Approach["side"]; label: string; aria: string }[] = [
  { value: "left", label: "left", aria: "Approaching from the left" },
  { value: "both", label: "both", aria: "Approaching from both sides" },
  { value: "right", label: "right", aria: "Approaching from the right" },
];

export function AnswerChecker() {
  const [angle, setAngle] = useState<AngleMode>("rad");
  const [same, setSame] = useState<Same>({ left: "", right: "", verdict: null });
  const [derivative, setDerivative] = useState<Derivative>({ fn: "", mine: "", verdict: null });
  const [limit, setLimit] = useState<Limit>({
    fn: "",
    at: "",
    side: "both",
    mine: "",
    verdict: null,
  });

  // Every edit clears the verdict it was given for, so a mark on screen always
  // belongs to what is in the fields.
  const editSame = (patch: Partial<Same>) => setSame((s) => ({ ...s, ...patch, verdict: null }));
  const editDerivative = (patch: Partial<Derivative>) =>
    setDerivative((s) => ({ ...s, ...patch, verdict: null }));
  const editLimit = (patch: Partial<Limit>) => setLimit((s) => ({ ...s, ...patch, verdict: null }));

  function markSame() {
    if (same.left.trim().length === 0 || same.right.trim().length === 0) return;
    setSame((s) => ({ ...s, verdict: areEquivalent(s.left, s.right, { angle }) }));
  }

  function markDerivative() {
    if (derivative.fn.trim().length === 0 || derivative.mine.trim().length === 0) return;
    setDerivative((s) => ({ ...s, verdict: checkDerivative(s.fn, s.mine, { angle }) }));
  }

  function markLimit() {
    setLimit((s) => {
      if (s.fn.trim().length === 0) return s;
      const at = readApproachPoint(s.at);
      if (at === null) {
        return {
          ...s,
          verdict: {
            state: "unreadable",
            detail: "Say where the limit is going: a number, or inf for infinity.",
          },
        };
      }
      const claimed = readLimitAnswer(s.mine);
      if (claimed === null) {
        return {
          ...s,
          verdict: {
            state: "unreadable",
            detail: "Write your answer as a number, as inf or -inf, or as DNE.",
          },
        };
      }
      return { ...s, verdict: checkLimit(s.fn, { at, side: s.side }, claimed, { angle }) };
    });
  }

  const limitVariable = variableOf(limit.fn);
  /** The point as notation: the infinities as their sign, anything else as read. */
  const limitPoint = (() => {
    const at = readApproachPoint(limit.at);
    if (at === null) return null;
    if (at === "inf") return "\\infty";
    if (at === "-inf") return "-\\infty";
    return reading(limit.at) ?? limit.at.trim();
  })();
  const limitStatement = (() => {
    const fn = reading(limit.fn);
    if (fn === null || limitPoint === null) return null;
    const side = limit.side === "left" ? "^{-}" : limit.side === "right" ? "^{+}" : "";
    return `\\lim_{${limitVariable} \\to ${limitPoint}${side}} ${fn}`;
  })();

  const claimed = readLimitAnswer(limit.mine);

  return (
    <Tabs defaultValue="same" className="w-full gap-4">
      <TabsList className="grid w-full grid-cols-3 gap-1 border border-line bg-desk p-1 group-data-horizontal/tabs:h-auto">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="h-auto py-2 text-foreground data-active:bg-paper data-active:text-foreground"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="same">
        {/* Form on the left, mark on the right, once there is room for both. */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
          <Card className="border-0 ring-1 ring-foreground/15">
            <CardHeader>
              <CardTitle>Is my answer the same thing?</CardTitle>
              <CardDescription>
                For anything you simplified, factored or rewrote. Spelling never matters, so a
                fraction against a decimal, or the factors in the other order, both pass.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-end">
                <AngleToggle angle={angle} onChange={setAngle} />
              </div>

              <Field
                id="same-left"
                label="The expression you were given"
                value={same.left}
                onChange={(left) => editSame({ left })}
                onSubmit={markSame}
                placeholder="(x+1)^2"
                hint="Type it as you would into a calculator: ^ for powers, sqrt() for roots."
              />

              <Field
                id="same-right"
                label="Your answer"
                value={same.right}
                onChange={(right) => editSame({ right })}
                onSubmit={markSame}
                placeholder="x^2+2x+1"
              />

              <Button
                type="button"
                onClick={markSame}
                disabled={same.left.trim().length === 0 || same.right.trim().length === 0}
                className="self-start"
              >
                Check it
              </Button>

              <Examples label="Or try one of these:">
                {[
                  { left: "(2^-1+3^-1)^-1", right: "6/5" },
                  { left: "(x+1)^2", right: "x^2+2x+1" },
                  { left: "sqrt(50)", right: "5sqrt(2)" },
                  { left: "x^2-9", right: "(x-3)(x+3)" },
                ].map((example) => (
                  <ExampleChip
                    key={example.left}
                    onPick={() => setSame({ ...example, verdict: null })}
                  >
                    {example.left} = {example.right}
                  </ExampleChip>
                ))}
              </Examples>
            </CardContent>
          </Card>

          <Verdict
            verdict={same.verdict}
            waiting="Fill both lines in and press Check it. Nothing is sent anywhere — the marking happens on this page."
          />
        </div>
      </TabsContent>

      <TabsContent value="derivative">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
          <Card className="border-0 ring-1 ring-foreground/15">
            <CardHeader>
              <CardTitle>Did I differentiate it right?</CardTitle>
              <CardDescription>
                Your derivative is compared against the true slope of the function, so a dropped
                inner derivative or a power that did not come down is caught wherever it happens.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-end">
                <AngleToggle angle={angle} onChange={setAngle} />
              </div>

              <Field
                id="derivative-fn"
                label="The function"
                value={derivative.fn}
                onChange={(fn) => editDerivative({ fn })}
                onSubmit={markDerivative}
                placeholder="sin(x^2)"
                hint="One letter only — x, t, whatever the question uses."
              />

              <Field
                id="derivative-mine"
                label="Your derivative"
                value={derivative.mine}
                onChange={(mine) => editDerivative({ mine })}
                onSubmit={markDerivative}
                placeholder="2x cos(x^2)"
              />

              <Button
                type="button"
                onClick={markDerivative}
                disabled={derivative.fn.trim().length === 0 || derivative.mine.trim().length === 0}
                className="self-start"
              >
                Check it
              </Button>

              <Examples label="Or try one of these:">
                {[
                  { fn: "x^3-4x", mine: "3x^2-4" },
                  { fn: "sin(x^2)", mine: "2x cos(x^2)" },
                  { fn: "(3x+1)^5", mine: "15(3x+1)^4" },
                  { fn: "x^2 sin(x)", mine: "2x sin(x)+x^2 cos(x)" },
                ].map((example) => (
                  <ExampleChip
                    key={example.fn}
                    onPick={() => setDerivative({ ...example, verdict: null })}
                  >
                    {example.fn}
                  </ExampleChip>
                ))}
              </Examples>
            </CardContent>
          </Card>

          <Verdict
            verdict={derivative.verdict}
            waiting="Put the function in, then your derivative, and press Check it."
          />
        </div>
      </TabsContent>

      <TabsContent value="limit">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
          <Card className="border-0 ring-1 ring-foreground/15">
            <CardHeader>
              <CardTitle>Is that what the limit does?</CardTitle>
              <CardDescription>
                The function is walked in towards the point and watched. A value, an infinity with
                its sign, or no limit at all — all three can be checked.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-end">
                <AngleToggle angle={angle} onChange={setAngle} />
              </div>

              <Field
                id="limit-fn"
                label="The function"
                value={limit.fn}
                onChange={(fn) => editLimit({ fn })}
                onSubmit={markLimit}
                placeholder="2/(x^2+5x+4) - 3/(x+4)"
                hint="One letter only — x, t, whatever the question uses."
                // Until there is a point to write under the lim, the function
                // echoes on its own; after that the whole statement does.
                echo={limitStatement === null ? undefined : null}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="limit-at"
                  label={`As ${limitVariable} goes to`}
                  value={limit.at}
                  onChange={(at) => editLimit({ at })}
                  onSubmit={markLimit}
                  placeholder="-4"
                  hint="A number, or inf for infinity."
                  echo={null}
                />

                <fieldset className="flex flex-col gap-1.5">
                  <legend className="mb-1.5 text-sm font-medium">Coming in from</legend>
                  <ToggleGroup
                    type="single"
                    value={limit.side}
                    onValueChange={(next) => next && editLimit({ side: next as Approach["side"] })}
                    className="grid grid-cols-3 gap-1.5"
                  >
                    {SIDES.map((side) => (
                      <ToggleGroupItem
                        key={side.value}
                        value={side.value}
                        aria-label={side.aria}
                        className={cn(
                          "h-auto rounded-md border border-line bg-paper px-2 py-2 text-xs text-foreground",
                          "hover:bg-plate/60 data-[state=on]:border-foreground data-[state=on]:bg-plate",
                        )}
                      >
                        {side.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </fieldset>
              </div>

              {limitStatement && (
                <span className="flex flex-wrap items-baseline gap-2 rounded-md bg-desk px-3 py-1.5">
                  <span className="text-xs font-medium">Reads as</span>
                  <Math expr={limitStatement} className="overflow-x-auto" />
                </span>
              )}

              <Field
                id="limit-mine"
                label="Your answer"
                value={limit.mine}
                onChange={(mine) => editLimit({ mine })}
                onSubmit={markLimit}
                placeholder="inf"
                hint="A number, inf or -inf, or DNE if there is no limit."
                echo={null}
              />
              {claimed && <p className="-mt-2 text-xs">Read as: {describeLimitAnswer(claimed)}.</p>}

              <Button
                type="button"
                onClick={markLimit}
                disabled={limit.fn.trim().length === 0}
                className="self-start"
              >
                Check it
              </Button>

              <Examples label="Or try one of these:">
                {[
                  {
                    label: "the hole",
                    fn: "(x^2-1)/(x-1)",
                    at: "1",
                    side: "both" as const,
                    mine: "2",
                  },
                  {
                    label: "your homework",
                    fn: "2/(x^2+5x+4) - 3/(x+4)",
                    at: "-4",
                    side: "left" as const,
                    mine: "inf",
                  },
                  {
                    label: "at infinity",
                    fn: "(2x+1)/(x-3)",
                    at: "inf",
                    side: "both" as const,
                    mine: "2",
                  },
                  {
                    label: "no limit",
                    fn: "abs(x)/x",
                    at: "0",
                    side: "both" as const,
                    mine: "DNE",
                  },
                ].map(({ label, ...example }) => (
                  <ExampleChip key={label} onPick={() => setLimit({ ...example, verdict: null })}>
                    {label}
                  </ExampleChip>
                ))}
              </Examples>
            </CardContent>
          </Card>

          <Verdict
            verdict={limit.verdict}
            waiting="Put the function in, say where it is going and which side from, then your answer."
          />
        </div>
      </TabsContent>

      <Card className="border-0 ring-1 ring-foreground/15">
        <CardHeader>
          <CardTitle>How this marks</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p>
            Your answer is tested against the real thing at a dozen unrelated values. Nothing is
            rearranged, which is why the spelling never matters:{" "}
            <span className="font-mono">6/5</span>, <span className="font-mono">1.2</span> and{" "}
            <span className="font-mono">12/10</span> all pass, and so does{" "}
            <span className="font-mono">3+2x</span> for <span className="font-mono">2x+3</span>.
          </p>
          <p>
            Several letters are fine: each one takes its own value at each point, so{" "}
            <span className="font-mono">a+b</span> is never mistaken for{" "}
            <span className="font-mono">2a</span>. The one thing it will not do is guess - where
            there are too few values both sides can be worked out at, it says so instead.
          </p>
        </CardContent>
      </Card>
    </Tabs>
  );
}
