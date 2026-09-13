"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Eraser, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { saveConversion } from "@/app/actions";
import { ConversionSteps } from "@/components/conversion-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BASES, type Base, baseMeta, convertAll, groupDigits, toBase } from "@/lib/bases";
import { cn } from "@/lib/utils";

/** How long a value must hold still before it counts as one the user meant. */
const SETTLE_MS = 900;

type ConverterProps = {
  value: string;
  base: Base;
  onChange: (value: string, base: Base) => void;
  onSaved: () => void;
};

export function Converter({ value, base, onChange, onSaved }: ConverterProps) {
  const [copied, setCopied] = useState<Base | null>(null);
  const conversion = useMemo(() => convertAll(value, base), [value, base]);
  const settled = conversion.ok ? conversion.input : null;

  useEffect(() => {
    if (settled === null) return;
    const timer = setTimeout(() => {
      void saveConversion(settled, base).then((result) => {
        if (result.status === "saved") onSaved();
      });
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [settled, base, onSaved]);

  useEffect(() => {
    if (copied === null) return;
    const timer = setTimeout(() => setCopied(null), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  /**
   * Switching base carries the number across rather than re-reading the same
   * digits, so flipping between bases re-expresses one value instead of
   * quietly meaning something else.
   */
  function handleBaseChange(next: Base) {
    if (next === base) return;
    onChange(conversion.ok ? toBase(conversion.decimal, next) : value, next);
  }

  async function copyValue(target: Base, raw: string) {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(target);
      toast(baseMeta(target).name + " copied", { description: raw });
    } catch {
      toast("Nothing was copied", {
        description: "This browser blocked clipboard access.",
      });
    }
  }

  const meta = baseMeta(base);
  const invalid = !conversion.ok && conversion.state === "invalid";

  return (
    // On a wide screen the working goes beside the readouts rather than below
    // them, so a change to the input and its arithmetic are in view together.
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
      <Card className="border-0 ring-1 ring-foreground/15">
        <CardContent className="flex flex-col gap-5">
          <fieldset className="flex flex-col">
            <legend className="mb-2.5 text-sm font-medium">Enter a number in</legend>
            <ToggleGroup
              type="single"
              value={String(base)}
              onValueChange={(next) => next && handleBaseChange(Number(next) as Base)}
              className="grid w-full grid-cols-2 gap-1.5 sm:grid-cols-4"
            >
              {BASES.map((option) => {
                const optionMeta = baseMeta(option);
                return (
                  <ToggleGroupItem
                    key={option}
                    value={String(option)}
                    aria-label={optionMeta.name + ", base " + option}
                    className={cn(
                      "h-auto flex-col items-start gap-0 rounded-md border border-line bg-paper px-3 py-2 text-foreground",
                      "hover:bg-plate/60 data-[state=on]:border-foreground data-[state=on]:bg-plate data-[state=on]:text-foreground",
                    )}
                  >
                    <span className="text-sm font-medium">{optionMeta.name}</span>
                    <span className="font-mono text-[0.7rem]">base {option}</span>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="converter-input" className="sr-only">
              Value in {meta.name.toLowerCase()}
            </label>
            <div className="relative">
              <Input
                id="converter-input"
                value={value}
                onChange={(event) => onChange(event.target.value, base)}
                placeholder={meta.placeholder}
                inputMode={base === 10 ? "numeric" : "text"}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-invalid={invalid}
                aria-describedby="converter-status"
                className={cn(
                  "tnum h-auto rounded-lg border-line bg-desk py-4 pr-12 pl-4 font-mono",
                  "text-3xl leading-none tracking-tight md:text-4xl",
                )}
              />
              {value.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Clear the value"
                  onClick={() => onChange("", base)}
                  className="absolute top-1/2 right-2 size-8 -translate-y-1/2 text-foreground hover:bg-plate"
                >
                  <Eraser className="size-4" />
                </Button>
              )}
            </div>

            <p id="converter-status" aria-live="polite" className="min-h-6 text-sm">
              {invalid ? (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-2 py-1">
                  <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
                  {!conversion.ok && conversion.state === "invalid" ? conversion.message : null}
                </span>
              ) : (
                <span>Spaces are ignored, so group the digits however you read them.</span>
              )}
            </p>
          </div>

          <div className="flex flex-col overflow-hidden rounded-lg border border-line">
            {BASES.map((target) => {
              const targetMeta = baseMeta(target);
              const isSource = target === base;
              const raw = conversion.ok ? conversion.values[target] : null;

              return (
                <div
                  key={target}
                  aria-current={isSource ? "true" : undefined}
                  className={cn(
                    "grid grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3",
                    "border-b border-line last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:px-4",
                    isSource ? "bg-plate" : "bg-paper",
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{targetMeta.name}</span>
                    <span className="font-mono text-[0.7rem]">base {target}</span>
                  </div>
                  <div className="tnum overflow-x-auto font-mono text-lg break-all sm:text-xl">
                    {raw ? groupDigits(raw, target) : <span>&mdash;</span>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={raw === null}
                    aria-label={"Copy the " + targetMeta.name.toLowerCase() + " value"}
                    onClick={() => raw && copyValue(target, raw)}
                    className="size-8 text-foreground hover:bg-plate-strong disabled:opacity-30"
                  >
                    {copied === target ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ConversionSteps conversion={conversion} />
    </div>
  );
}
