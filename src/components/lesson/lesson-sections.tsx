"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, Lightbulb, TriangleAlert } from "lucide-react";

import { Math, Prose } from "@/components/math";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Practice, WorkedExample } from "@/lib/lessons/types";

/**
 * A solution, opened one at a time.
 *
 * The layout follows how the class solutions are written: the pattern is named
 * before any work is done, then each line of algebra sits beside the move that
 * produced it, then the answer, then the check.
 */
export function ExampleList({ examples }: { examples: WorkedExample[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {examples.map((example, index) => (
        <AccordionItem key={example.id} value={example.id} className="border-line last:border-b-0">
          <AccordionTrigger className="gap-3 text-left hover:no-underline">
            <span className="flex flex-1 items-center gap-3">
              <span
                aria-hidden
                className="tnum flex size-7 shrink-0 items-center justify-center rounded-md bg-plate font-mono text-xs font-medium"
              >
                {index + 1}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <Math expr={example.prompt} className="overflow-x-auto text-base" />
                <span className="text-xs font-medium">{example.pattern}</span>
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent>
            <p className="mb-4 flex items-start gap-2 rounded-md bg-desk px-3 py-2 text-sm">
              <Eye aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              <span>
                <span className="font-medium">How you spot it. </span>
                <Prose text={example.tell} />
              </span>
            </p>

            <ol className="flex flex-col">
              {example.steps.map((step, position) => (
                <li
                  key={position}
                  className="grid grid-cols-1 gap-1 border-b border-line py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-baseline sm:gap-4"
                >
                  <Math expr={step.expr} display="block" />
                  <p className="text-xs">
                    <Prose text={step.reason} />
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-3 flex flex-wrap items-center gap-2 rounded-md bg-plate px-3 py-2 text-sm">
              <Check aria-hidden className="size-3.5 shrink-0" />
              <span>Answer</span>
              <Math expr={example.answer} className="text-base font-medium" />
            </p>

            {example.check && (
              <p className="mt-3 flex items-start gap-2 text-sm">
                <Lightbulb aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                <Prose text={example.check} />
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** A problem whose answer stays hidden until it is asked for. */
function PracticeRow({ problem, index }: { problem: Practice; index: number }) {
  const [shown, setShown] = useState(false);

  return (
    <li className="flex flex-col gap-2 border-b border-line py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 items-baseline gap-3">
          <span
            aria-hidden
            className="tnum shrink-0 font-mono text-xs font-medium opacity-70"
          >
            {index + 1}.
          </span>
          <Math expr={problem.prompt} className="overflow-x-auto text-base" />
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShown((open) => !open)}
          aria-expanded={shown}
          className="h-7 shrink-0 gap-1.5 px-2 text-xs text-foreground hover:bg-plate"
        >
          {shown ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {shown ? "Hide" : "Answer"}
        </Button>
      </div>

      {shown && (
        <div className="flex flex-col gap-1.5 rounded-md bg-plate px-3 py-2">
          <span className="flex flex-wrap items-center gap-2 text-sm">
            <Check aria-hidden className="size-3.5 shrink-0" />
            <Math expr={problem.answer} className="text-base font-medium" />
          </span>
          {problem.hint && (
            <p className="text-xs">
              <Prose text={problem.hint} />
            </p>
          )}
        </div>
      )}
    </li>
  );
}

export function PracticeList({ problems }: { problems: Practice[] }) {
  return (
    <ol className="flex flex-col">
      {problems.map((problem, index) => (
        <PracticeRow key={index} problem={problem} index={index} />
      ))}
    </ol>
  );
}

/** A wrong statement set against the corrected one, with the reason underneath. */
export function TrapList({
  traps,
}: {
  traps: { wrong: string; right: string; why: string }[];
}) {
  return (
    <ul className="flex flex-col gap-3">
      {traps.map((trap, index) => (
        <li key={index} className="overflow-hidden rounded-lg border border-line">
          <div className="flex items-center gap-2 border-b border-line bg-destructive px-3 py-2">
            <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
            <Math expr={trap.wrong} className="overflow-x-auto" />
          </div>
          <div className="flex items-center gap-2 border-b border-line bg-plate px-3 py-2">
            <Check aria-hidden className="size-3.5 shrink-0" />
            <Math expr={trap.right} className="overflow-x-auto" />
          </div>
          <p className="px-3 py-2 text-sm">
            <Prose text={trap.why} />
          </p>
        </li>
      ))}
    </ul>
  );
}
