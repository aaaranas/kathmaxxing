"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  Check,
  CircleHelp,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
  TriangleAlert,
  X,
} from "lucide-react";

import { Math, Prose } from "@/components/math";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Practice, WorkedExample } from "@/lib/lessons/types";
import type { Check as Verdict } from "@/lib/math/check";
import { type Answer, markAnswer, readAnswer } from "@/lib/practice/marking";
import {
  clearKeys,
  emptyRecord,
  problemKey,
  recordAttempt,
  recordSnapshot,
  subscribeRecord,
  summarize,
} from "@/lib/practice/record";
import { cn } from "@/lib/utils";

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

const MARKS: Record<Verdict["state"], { icon: typeof Check; tone: string; headline: string }> = {
  correct: { icon: Check, tone: "bg-plate", headline: "Right." },
  incorrect: { icon: X, tone: "bg-destructive", headline: "Not this time." },
  unsure: { icon: CircleHelp, tone: "bg-desk", headline: "Can't mark this one." },
  unreadable: { icon: TriangleAlert, tone: "bg-destructive", headline: "Couldn't read that." },
};

/**
 * A problem she can have marked, with the answer underneath if she wants it.
 *
 * The answer stays hidden until it is asked for, as it always has. What is new
 * is the line above it: type an answer and it is marked against the one in the
 * lesson, which is a different thing from being shown the answer and deciding
 * for yourself whether you had it.
 */
function PracticeRow({
  problem,
  index,
  answer,
  solved,
  onAttempt,
}: {
  problem: Practice;
  index: number;
  answer: Answer;
  solved: boolean;
  onAttempt: (index: number, correct: boolean) => void;
}) {
  const [shown, setShown] = useState(false);
  const [typed, setTyped] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const markable = answer.kind !== "none";

  function mark() {
    if (typed.trim().length === 0) return;
    const result = markAnswer(typed, answer);
    setVerdict(result);
    if (result.state === "correct" || result.state === "incorrect") {
      onAttempt(index, result.state === "correct");
    }
  }

  const mark_ = verdict === null ? null : MARKS[verdict.state];

  return (
    <li className="flex flex-col gap-2 border-b border-line py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 items-baseline gap-3">
          <span aria-hidden className="tnum shrink-0 font-mono text-xs font-medium opacity-70">
            {index + 1}.
          </span>
          <Math expr={problem.prompt} className="overflow-x-auto text-base" />
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {solved && (
            <span className="flex items-center gap-1 rounded-md bg-plate px-1.5 py-0.5 text-xs font-medium">
              <Check aria-hidden className="size-3" />
              <span className="sr-only sm:not-sr-only">Got it</span>
            </span>
          )}
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
        </span>
      </div>

      {markable && (
        <div className="flex flex-wrap items-center gap-2 pl-6">
          <label htmlFor={`answer-${index}`} className="sr-only">
            Your answer to problem {index + 1}
          </label>
          <Input
            id={`answer-${index}`}
            value={typed}
            onChange={(event) => {
              setTyped(event.target.value);
              setVerdict(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                mark();
              }
            }}
            placeholder="Your answer"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="tnum h-9 min-w-40 flex-1 rounded-md border-line bg-desk px-3 font-mono text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={mark}
            disabled={typed.trim().length === 0}
            className="h-9 shrink-0 border border-line px-3 text-xs text-foreground hover:bg-plate disabled:opacity-40"
          >
            Check
          </Button>
        </div>
      )}

      {mark_ && verdict && (
        <p
          aria-live="polite"
          className={cn("ml-6 flex items-start gap-2 rounded-md px-3 py-2 text-sm", mark_.tone)}
        >
          <mark_.icon aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <span className="font-medium">{mark_.headline} </span>
            {verdict.detail}
          </span>
        </p>
      )}

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

export function PracticeList({
  problems,
  lesson,
  section,
}: {
  problems: Practice[];
  lesson: string;
  section: string;
}) {
  // The record is hers and lives on her device, so the server and the first
  // render know nothing about it; it arrives right after hydration.
  const record = useSyncExternalStore(subscribeRecord, recordSnapshot, emptyRecord);

  const keys = useMemo(
    () => problems.map((_, index) => problemKey(lesson, section, index)),
    [problems, lesson, section],
  );
  const answers = useMemo(() => problems.map((problem) => readAnswer(problem.answer)), [problems]);

  const onAttempt = useCallback(
    (index: number, correct: boolean) => recordAttempt(keys[index], correct),
    [keys],
  );

  const { attempted, solved, firstTime } = summarize(record, keys);

  return (
    <div className="flex flex-col">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-desk px-3 py-2">
        <p className="text-sm">
          {attempted > 0 ? (
            <>
              <span className="font-medium">
                {solved} of {problems.length} right
              </span>
              {firstTime > 0 && <>, {firstTime} first time</>}
            </>
          ) : (
            "Type an answer and it gets marked. What you get right is kept on this device."
          )}
        </p>
        {attempted > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => clearKeys(keys)}
            className="h-7 shrink-0 gap-1.5 px-2 text-xs text-foreground hover:bg-plate"
          >
            <RotateCcw aria-hidden className="size-3.5" />
            Start again
          </Button>
        )}
      </div>

      <ol className="flex flex-col">
        {problems.map((problem, index) => (
          <PracticeRow
            key={index}
            problem={problem}
            index={index}
            answer={answers[index]}
            solved={record[keys[index]]?.solved ?? false}
            onAttempt={onAttempt}
          />
        ))}
      </ol>
    </div>
  );
}

/** A wrong statement set against the corrected one, with the reason underneath. */
export function TrapList({ traps }: { traps: { wrong: string; right: string; why: string }[] }) {
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
