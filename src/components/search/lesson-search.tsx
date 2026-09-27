"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Eraser, Search } from "lucide-react";

import { Math, Prose } from "@/components/math";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type Hit, buildIndex, search } from "@/lib/search";

/** Things worth finding, as a way in for someone who has not searched yet. */
const SUGGESTIONS = [
  "chain rule",
  "difference of squares",
  "rationalise",
  "infinite limit",
  "asymptote",
  "hexadecimal",
];

const LIMIT = 40;

export function LessonSearch() {
  // Built once, in the browser, off the same lessons the pages render. It is
  // all static data, so this works with the app offline and nothing is sent.
  const index = useMemo(() => buildIndex(), []);
  const [query, setQuery] = useState("");

  const hits = useMemo(() => search(query, index, LIMIT), [query, index]);
  const asked = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-0 ring-1 ring-foreground/15">
        <CardContent className="flex flex-col gap-3">
          <label htmlFor="search-input" className="sr-only">
            Search the lessons
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="absolute top-1/2 left-4 size-4 -translate-y-1/2 opacity-70"
            />
            <Input
              id="search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="A rule, a word, or a problem"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
              aria-describedby="search-count"
              className="h-auto rounded-lg border-line bg-desk py-4 pr-12 pl-11 text-lg leading-none"
            />
            {asked && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear the search"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-2 size-8 -translate-y-1/2 text-foreground hover:bg-plate"
              >
                <Eraser className="size-4" />
              </Button>
            )}
          </div>

          <p id="search-count" aria-live="polite" className="text-sm">
            {!asked ? (
              <>Searches the rules, the worked solutions and the practice, across every subject.</>
            ) : hits.length === 0 ? (
              <>Nothing matched. Every word has to appear, so try fewer of them.</>
            ) : hits.length === LIMIT ? (
              <>The best {LIMIT}, closest first.</>
            ) : (
              <>
                {hits.length} {hits.length === 1 ? "result" : "results"}.
              </>
            )}
          </p>

          {!asked && (
            <ul className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="rounded-md border border-line bg-paper px-2.5 py-1 text-sm hover:bg-plate/60"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {hits.length > 0 && (
        <Card className="border-0 ring-1 ring-foreground/15">
          <CardContent>
            <ul className="flex flex-col">
              {hits.map((hit) => (
                <Result key={hit.id} hit={hit} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Result({ hit }: { hit: Hit }) {
  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        href={hit.href}
        className="group flex items-start gap-3 rounded-md px-1 py-3 hover:bg-plate/40"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-1 text-xs">
            {hit.trail.map((step, index) => (
              <span key={step + index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight aria-hidden className="size-3 shrink-0 opacity-60" />}
                {step}
              </span>
            ))}
          </span>

          {/*
            An expression can be wider than a phone, so it scrolls on its own
            rather than stretching the row it sits in.
          */}
          <span className="min-w-0 text-base font-medium">
            {hit.labelKind === "math" ? (
              <Math expr={hit.label} display="block" className="font-medium" />
            ) : (
              <Prose text={hit.label} />
            )}
          </span>

          <span className="text-sm">
            <Prose text={hit.detail} />
          </span>
        </span>

        <ChevronRight
          aria-hidden
          className="mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </li>
  );
}
