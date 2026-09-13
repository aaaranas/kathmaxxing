import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, FileText } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { ALGEBRA_LESSONS } from "@/lib/algebra";

export const metadata: Metadata = {
  title: "Algebra",
  description:
    "Integer and rational exponents, radicals and factoring. The rules, the method, and a worked solution for every kind of problem.",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-4 sm:px-6">
      <SiteHeader
        crumbs={[{ label: "Subjects", href: "/" }, { label: "Algebra" }]}
        title="Algebra"
        description="Four topics from the class notes. Each one opens with the rules, then the order to try them in, then a worked solution for every kind of problem — the pattern named first, the move second."
      />

      <Link
        href="/algebra/calculator"
        className="group mb-4 flex items-center gap-3 rounded-xl bg-plate px-4 py-3 ring-1 ring-foreground/15 hover:bg-plate-strong"
      >
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-paper"
        >
          <Calculator className="size-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-medium">Scientific calculator</span>
          <span className="text-xs">
            Exact answers where they exist, for checking your working as you go.
          </span>
        </span>
        <ArrowRight
          aria-hidden
          className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
        />
      </Link>

      <div className="flex flex-col gap-3">
        {ALGEBRA_LESSONS.map((lesson, index) => (
          <Card key={lesson.slug} className="border-0 ring-1 ring-foreground/15">
            <CardContent>
              <Link href={`/algebra/${lesson.slug}`} className="group flex items-start gap-3">
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
    </main>
  );
}
