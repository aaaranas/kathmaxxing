"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, Delete, Equal, Eraser, TriangleAlert } from "lucide-react";

import { Math } from "@/components/algebra/math";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type AngleMode, calculate } from "@/lib/algebra/calculator";
import { cn } from "@/lib/utils";

/**
 * A key either types something or does something. `back` is how far to pull the
 * caret in after typing, so a key that inserts a matched pair can leave the
 * cursor between them.
 */
type Key = {
  /** Notation drawn on the key, or plain text when it is not an expression. */
  label: string;
  math?: boolean;
  /** Drawn instead of the label, for keys whose glyph the mono face lacks. */
  icon?: LucideIcon;
  insert?: string;
  back?: number;
  action?: "clear" | "backspace" | "equals";
  aria: string;
  emphasis?: boolean;
};

const BASIC: Key[] = [
  { label: "(", insert: "(", aria: "Open bracket" },
  { label: ")", insert: ")", aria: "Close bracket" },
  { label: "Back", icon: Delete, action: "backspace", aria: "Delete the character before the cursor" },
  { label: "AC", action: "clear", aria: "Clear everything" },
  { label: "÷", insert: "÷", aria: "Divide" },

  { label: "7", insert: "7", aria: "Seven" },
  { label: "8", insert: "8", aria: "Eight" },
  { label: "9", insert: "9", aria: "Nine" },
  { label: "x^{n}", math: true, insert: "^", aria: "To the power of" },
  { label: "×", insert: "×", aria: "Multiply" },

  { label: "4", insert: "4", aria: "Four" },
  { label: "5", insert: "5", aria: "Five" },
  { label: "6", insert: "6", aria: "Six" },
  { label: "\\sqrt{x}", math: true, insert: "√()", back: 1, aria: "Square root" },
  { label: "−", insert: "-", aria: "Subtract" },

  { label: "1", insert: "1", aria: "One" },
  { label: "2", insert: "2", aria: "Two" },
  { label: "3", insert: "3", aria: "Three" },
  { label: "x^{2}", math: true, insert: "^2", aria: "Squared" },
  { label: "+", insert: "+", aria: "Add" },

  { label: "0", insert: "0", aria: "Zero" },
  { label: ".", insert: ".", aria: "Decimal point" },
  { label: "\\pi", math: true, insert: "π", aria: "Pi" },
  { label: "e", math: true, insert: "e", aria: "Euler's number" },
  { label: "=", action: "equals", aria: "Work it out and keep it", emphasis: true },
];

const FUNCTIONS: Key[] = [
  { label: "\\sqrt{x}", math: true, insert: "√()", back: 1, aria: "Square root" },
  { label: "\\sqrt[3]{x}", math: true, insert: "∛()", back: 1, aria: "Cube root" },
  { label: "\\sqrt[n]{x}", math: true, insert: "root(", aria: "Nth root" },
  { label: "|x|", math: true, insert: "abs()", back: 1, aria: "Absolute value" },

  { label: "x^{2}", math: true, insert: "^2", aria: "Squared" },
  { label: "x^{3}", math: true, insert: "^3", aria: "Cubed" },
  { label: "x^{n}", math: true, insert: "^", aria: "To the power of" },
  { label: "x^{\\frac{1}{n}}", math: true, insert: "^(1/)", back: 1, aria: "To a unit fraction power" },

  { label: "ln", insert: "ln()", back: 1, aria: "Natural logarithm" },
  { label: "log", insert: "log()", back: 1, aria: "Logarithm base ten" },
  { label: "\\log_{b}", math: true, insert: "log(", aria: "Logarithm to a given base" },
  { label: "e^{x}", math: true, insert: "e^", aria: "E to the power of" },

  { label: "n!", math: true, insert: "!", aria: "Factorial" },
  { label: "\\pi", math: true, insert: "π", aria: "Pi" },
  { label: "(", insert: "(", aria: "Open bracket" },
  { label: ")", insert: ")", aria: "Close bracket" },
];

const TRIG: Key[] = [
  { label: "sin", insert: "sin()", back: 1, aria: "Sine" },
  { label: "cos", insert: "cos()", back: 1, aria: "Cosine" },
  { label: "tan", insert: "tan()", back: 1, aria: "Tangent" },
  { label: "\\pi", math: true, insert: "π", aria: "Pi" },

  { label: "sin⁻¹", insert: "asin()", back: 1, aria: "Inverse sine" },
  { label: "cos⁻¹", insert: "acos()", back: 1, aria: "Inverse cosine" },
  { label: "tan⁻¹", insert: "atan()", back: 1, aria: "Inverse tangent" },
  { label: "(", insert: "(", aria: "Open bracket" },
];

const PADS = [
  { id: "basic", label: "Basic", keys: BASIC, columns: 5, legend: null },
  {
    id: "functions",
    label: "Functions",
    keys: FUNCTIONS,
    columns: 4,
    legend: "root(n, x) is the nth root of x, and log(b, x) is the log of x to base b.",
  },
  {
    id: "trig",
    label: "Trig",
    keys: TRIG,
    columns: 4,
    legend: "Angles are read in whichever mode is set above.",
  },
] as const;

/** A few from the lessons, so the syntax is visible without reading a manual. */
const EXAMPLES = [
  "(2^-1+3^-1)^-1",
  "49^(5/2)",
  "(121/36)^(-3/2)",
  "root(5,-1024)",
] as const;

type Entry = { id: number; source: string; reading: string; answer: string };

export function Calculator() {
  const [input, setInput] = useState("");
  const [angle, setAngle] = useState<AngleMode>("rad");
  const [history, setHistory] = useState<Entry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => calculate(input, angle), [input, angle]);

  /** Type at the caret rather than at the end, so a key can fix a typo mid-line. */
  const insert = useCallback((text: string, back = 0) => {
    const field = inputRef.current;
    const start = field?.selectionStart ?? input.length;
    const end = field?.selectionEnd ?? input.length;

    setInput(input.slice(0, start) + text + input.slice(end));

    const caret = start + text.length - back;
    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(caret, caret);
    });
  }, [input]);

  const backspace = useCallback(() => {
    const field = inputRef.current;
    const start = field?.selectionStart ?? input.length;
    const end = field?.selectionEnd ?? input.length;

    // A selection is deleted whole; otherwise one character comes off the left.
    const from = start === end ? (start > 0 ? start - 1 : 0) : start;
    setInput(input.slice(0, from) + input.slice(end));

    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(from, from);
    });
  }, [input]);

  const submit = useCallback(() => {
    if (result.state !== "ok") return;
    setHistory((entries) =>
      [
        { id: Date.now(), source: input, reading: result.reading, answer: result.answer },
        ...entries,
      ].slice(0, 8),
    );
  }, [input, result]);

  function press(key: Key) {
    if (key.action === "clear") {
      setInput("");
      inputRef.current?.focus();
      return;
    }
    if (key.action === "backspace") return backspace();
    if (key.action === "equals") return submit();
    if (key.insert !== undefined) insert(key.insert, key.back);
  }

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start lg:gap-4">
      <Card className="border-0 ring-1 ring-foreground/15 lg:col-start-1">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="calculator-input" className="text-sm font-medium">
              Expression
            </label>
            <fieldset className="flex items-center gap-2">
              <legend className="sr-only">Angle mode</legend>
              <span className="text-xs">Angles</span>
              <ToggleGroup
                type="single"
                value={angle}
                onValueChange={(next) => next && setAngle(next as AngleMode)}
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
          </div>

          <div className="relative">
            <Input
              id="calculator-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submit();
                }
              }}
              placeholder="49^(5/2)"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-invalid={result.state === "unreadable" || result.state === "failed"}
              aria-describedby="calculator-result"
              className={cn(
                "tnum h-auto rounded-lg border-line bg-desk py-4 pr-12 pl-4 font-mono",
                "text-2xl leading-none tracking-tight md:text-3xl",
              )}
            />
            {input.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear the expression"
                onClick={() => {
                  setInput("");
                  inputRef.current?.focus();
                }}
                className="absolute top-1/2 right-2 size-8 -translate-y-1/2 text-foreground hover:bg-plate"
              >
                <Eraser className="size-4" />
              </Button>
            )}
          </div>

          <Readout result={result} />
        </CardContent>
      </Card>

      <Card className="border-0 ring-1 ring-foreground/15 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-4">
        <CardContent>
          <Tabs defaultValue="basic" className="w-full gap-3">
            <TabsList className="grid w-full grid-cols-3 gap-1 border border-line bg-desk p-1 group-data-horizontal/tabs:h-auto">
              {PADS.map((pad) => (
                <TabsTrigger
                  key={pad.id}
                  value={pad.id}
                  className="h-auto py-1.5 text-foreground data-active:bg-paper data-active:text-foreground"
                >
                  {pad.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {PADS.map((pad) => (
              <TabsContent key={pad.id} value={pad.id} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "grid gap-1.5",
                    pad.columns === 5 ? "grid-cols-5" : "grid-cols-4",
                  )}
                >
                  {pad.keys.map((key, index) => (
                    <button
                      key={`${key.aria}-${index}`}
                      type="button"
                      onClick={() => press(key)}
                      aria-label={key.aria}
                      className={cn(
                        "flex h-11 items-center justify-center rounded-md border border-line",
                        "font-mono text-sm transition-colors active:bg-plate-strong",
                        key.emphasis
                          ? "border-foreground bg-plate hover:bg-plate-strong"
                          : "bg-paper hover:bg-plate/60",
                      )}
                    >
                      {key.icon ? (
                        <key.icon aria-hidden className="size-4" />
                      ) : key.math ? (
                        <Math expr={key.label} />
                      ) : (
                        key.label
                      )}
                    </button>
                  ))}
                </div>
                {pad.legend && <p className="text-xs">{pad.legend}</p>}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-0 ring-1 ring-foreground/15 lg:col-start-1">
        <CardHeader>
          <CardTitle>Worked out here</CardTitle>
          <CardDescription>
            Press <span className="font-medium">=</span> or Enter to keep an answer. Nothing leaves
            the page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {history.length === 0 ? (
            <>
              <p className="text-sm">Nothing kept yet. Try one of these:</p>
              <ul className="flex flex-wrap gap-1.5">
                {EXAMPLES.map((example) => (
                  <li key={example}>
                    <button
                      type="button"
                      onClick={() => {
                        setInput(example);
                        inputRef.current?.focus();
                      }}
                      className="rounded-md border border-line bg-paper px-2.5 py-1 font-mono text-sm hover:bg-plate/60"
                    >
                      {example}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <ol className="flex flex-col">
              {history.map((entry) => (
                <li key={entry.id} className="border-b border-line py-2 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => {
                      setInput(entry.source);
                      inputRef.current?.focus();
                    }}
                    aria-label={`Put ${entry.source} back in the expression`}
                    className="flex w-full flex-wrap items-baseline gap-x-2 gap-y-1 rounded px-1 text-left hover:bg-plate/40"
                  >
                    <Math expr={entry.reading} className="overflow-x-auto" />
                    <Equal aria-hidden className="size-3 shrink-0 self-center" />
                    <Math expr={entry.answer} className="font-medium" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Readout({ result }: { result: ReturnType<typeof calculate> }) {
  if (result.state === "empty") {
    return (
      <p id="calculator-result" aria-live="polite" className="min-h-6 text-sm">
        Type an expression, or use the keys below. Spaces are ignored and{" "}
        <span className="font-mono">2(3+4)</span> multiplies.
      </p>
    );
  }

  if (result.state === "unreadable") {
    return (
      <p id="calculator-result" aria-live="polite" className="text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-2 py-1">
          <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
          {result.message}
        </span>
      </p>
    );
  }

  return (
    <div id="calculator-result" aria-live="polite" className="flex flex-col gap-2">
      {/*
        The reading comes before the answer on purpose. Precedence is the thing
        that catches people out - -4^2 against (-4)^2 is a trap in the lessons -
        so the calculator says how it read the expression before it answers it.
      */}
      <div className="flex flex-wrap items-baseline gap-2 rounded-md bg-desk px-3 py-2">
        <span className="text-xs font-medium">Reads as</span>
        <Math expr={result.reading} className="overflow-x-auto text-base" />
      </div>

      {result.state === "failed" ? (
        <p className="text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-2 py-1">
            <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
            {result.message}
          </span>
        </p>
      ) : (
        <div className="flex flex-col gap-1.5 rounded-md bg-plate px-3 py-2.5">
          <span className="flex flex-wrap items-center gap-2">
            <Check aria-hidden className="size-3.5 shrink-0" />
            <Math expr={result.answer} className="text-xl font-medium sm:text-2xl" />
          </span>
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {result.exact ? (
              <>
                <span className="rounded bg-plate-strong px-1.5 py-0.5 font-medium">Exact</span>
                {result.decimal && <span className="font-mono">= {result.decimal}&hellip;</span>}
              </>
            ) : (
              <>
                <span className="rounded bg-plate-strong px-1.5 py-0.5 font-medium">Decimal</span>
                {/*
                  Not "this has no exact value" - log(2, 1024) is exactly 10.
                  The honest claim is about how it was worked out, since once a
                  step goes through decimals the answer is a reading of the
                  number rather than the number.
                */}
                <span>Worked out in decimal, so read it as good to about 12 figures.</span>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
