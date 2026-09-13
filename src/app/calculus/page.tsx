import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChartSpline, FileText } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { CALCULUS_LESSONS } from "@/lib/calculus";

export const metadata: Metadata = {
  title: "Calculus",
  description:
    "Lines, functions and graphs — the groundwork calculus is built on, with a worked solution for every kind of problem.",
};

export default function Page() {
  return (
    <PageShell>
      <SiteHeader
        crumbs={[{ label: "Subjects", href: "/" }, { label: "Calculus" }]}
        title="Calculus"
        description="The groundwork first: lines, functions, and reading a graph off its rule. Each topic opens with the rules, then the order to apply them in, then a worked solution for every kind of problem."
      />

      <Link
        href="/calculus/graphing-calculator"
        className="group mb-4 flex items-center gap-3 rounded-xl bg-plate px-4 py-3 ring-1 ring-foreground/15 hover:bg-plate-strong"
      >
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-paper"
        >
          <ChartSpline className="size-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-medium">Graphing calculator</span>
          <span className="text-xs">
            Plot up to four functions, pan and zoom, and read a value off the curve.
          </span>
        </span>
        <ArrowRight
          aria-hidden
          className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
        />
      </Link>

      <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
        {CALCULUS_LESSONS.map((lesson, index) => (
          <Card key={lesson.slug} className="border-0 ring-1 ring-foreground/15">
            <CardContent>
              <Link href={`/calculus/${lesson.slug}`} className="group flex items-start gap-3">
                <span
                  aria-hidden
                  className="tnum mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-plate font-mono text-sm font-medium"
                >
                  {index + 1}
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-base font-medium">{lesson.title}</span>
                  <span className="text-sm">{lesson.blurb}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs">
                    <FileText aria-hidden className="size-3 shrink-0" />
                    {lesson.source}
                  </span>
                </span>

                <ArrowRight
                  aria-hidden
                  className="mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
