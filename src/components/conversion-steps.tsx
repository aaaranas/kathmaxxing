"use client";

import { useMemo } from "react";
import { ArrowUp, Divide, Equal, Rows3, Sigma } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Conversion, baseMeta } from "@/lib/bases";
import { type StepBlock, buildSteps } from "@/lib/steps";

const ICONS = {
  expansion: Sigma,
  division: Divide,
  grouping: Rows3,
} as const;

function Cell({ children, head = false }: { children: React.ReactNode; head?: boolean }) {
  const Tag = head ? "th" : "td";
  return (
    <Tag
      scope={head ? "col" : undefined}
      className={
        "border-b border-line px-3 py-2 text-left align-middle " +
        (head ? "text-xs font-medium" : "font-mono text-sm tnum whitespace-nowrap")
      }
    >
      {children}
    </Tag>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-2 rounded-md bg-plate px-3 py-2 text-sm">
      <Equal aria-hidden className="size-3.5 shrink-0" />
      <span>{label}</span>
      <span className="tnum font-mono text-base font-medium break-all">{value}</span>
    </p>
  );
}

function BlockBody({ block }: { block: StepBlock }) {
  if (block.kind === "expansion") {
    const meta = baseMeta(block.source);
    return (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Cell head>Digit</Cell>
                <Cell head>Place</Cell>
                <Cell head>Worth</Cell>
                <Cell head>Contributes</Cell>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.power}>
                  <Cell>{row.digit}</Cell>
                  <Cell>
                    {block.source}
                    <sup>{row.power}</sup>
                  </Cell>
                  <Cell>{row.weight}</Cell>
                  <Cell>
                    {row.digitValue} &times; {row.weight} = {row.product}
                  </Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          Add the last column together. That total is the same number written in decimal, which is
          the hub every other base is reached through.
        </p>
        <Result label={meta.name + " in decimal is"} value={block.result} />
      </div>
    );
  }

  if (block.kind === "division") {
    const meta = baseMeta(block.target);
    if (block.rows.length === 0) {
      return <Result label={meta.name + " zero is"} value={block.result} />;
    }
    return (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Cell head>Divide</Cell>
                <Cell head>Quotient</Cell>
                <Cell head>Remainder</Cell>
                <Cell head>Digit</Cell>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, position) => (
                <tr key={row.dividend + "-" + position}>
                  <Cell>
                    {row.dividend} &divide; {block.target}
                  </Cell>
                  <Cell>{row.quotient}</Cell>
                  <Cell>{row.remainder}</Cell>
                  <Cell>
                    <span className="inline-block rounded bg-plate-strong px-1.5 py-0.5 font-medium">
                      {row.digit}
                    </span>
                  </Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex items-start gap-2 text-sm">
          <ArrowUp aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          <span>
            The digits come out backwards, so read the last column from the bottom row upwards.
          </span>
        </p>
        <Result label={"Written in " + meta.name.toLowerCase() + " that is"} value={block.result} />
      </div>
    );
  }

  const target = baseMeta(block.to);
  return (
    <div>
      {block.from === 2 && (
        <p className="mb-3 text-sm">
          Padded to a multiple of {block.bitsPerDigit}:{" "}
          <span className="tnum font-mono break-all">{block.padded}</span>
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Cell head>{block.from === 2 ? "Group of bits" : "Digit"}</Cell>
              <Cell head>Value</Cell>
              <Cell head>{block.from === 2 ? "Hex digit" : "Bits"}</Cell>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, position) => (
              <tr key={row.group + "-" + position}>
                <Cell>{row.group}</Cell>
                <Cell>{row.value}</Cell>
                <Cell>
                  <span className="inline-block rounded bg-plate-strong px-1.5 py-0.5 font-medium">
                    {row.digit}
                  </span>
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Result label={target.name + " reads"} value={block.result} />
    </div>
  );
}

export function ConversionSteps({ conversion }: { conversion: Conversion }) {
  const blocks = useMemo(() => (conversion.ok ? buildSteps(conversion) : []), [conversion]);

  if (blocks.length === 0) return null;

  return (
    <Card className="border-0 ring-1 ring-foreground/15">
      <CardHeader>
        <CardTitle>How it was worked out</CardTitle>
        <CardDescription>Open a step to see the arithmetic written out by hand.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {blocks.map((block) => {
            const Icon = ICONS[block.kind];
            return (
              <AccordionItem
                key={block.id}
                value={block.id}
                className="border-line last:border-b-0"
              >
                <AccordionTrigger className="gap-3 text-left hover:no-underline">
                  <span className="flex flex-1 items-center gap-3">
                    <span
                      aria-hidden
                      className="tnum flex size-7 shrink-0 items-center justify-center rounded-md bg-plate font-mono text-xs font-medium"
                    >
                      {block.index}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{block.title}</span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <Icon aria-hidden className="size-3" />
                        {block.method}
                      </span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3 text-sm">{block.summary}</p>
                  <BlockBody block={block} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
