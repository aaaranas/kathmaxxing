import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUBJECTS, TOOLS } from "@/lib/subjects";

export default function Page() {
  return (
    <PageShell>
      <SiteHeader
        title="Subjects"
        description="One shelf per subject. Everything inside shows its working — the rules first, then a solution for every kind of problem, written out line by line."
      />

      <ul className="mb-4 grid gap-3 sm:grid-cols-2">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <li key={tool.id}>
              <Link
                href={tool.href}
                className="group flex h-full items-center gap-3 rounded-xl bg-plate px-4 py-3 ring-1 ring-foreground/15 hover:bg-plate-strong"
              >
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-md bg-paper"
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium">{tool.name}</span>
                  <span className="text-xs">{tool.blurb}</span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        {SUBJECTS.map((subject) => {
          const Icon = subject.icon;
          return (
            <Card key={subject.id} className="border-0 ring-1 ring-foreground/15">
              <CardHeader>
                <CardTitle>
                  <Link
                    href={subject.href}
                    className="group flex items-center gap-2.5 rounded outline-offset-4"
                  >
                    <span
                      aria-hidden
                      className="flex size-8 shrink-0 items-center justify-center rounded-md bg-plate"
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="flex-1 text-base font-medium">{subject.name}</span>
                    <ArrowRight
                      aria-hidden
                      className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <p className="max-w-[62ch] text-sm">{subject.summary}</p>

                <ul className="flex flex-col overflow-hidden rounded-lg border border-line">
                  {subject.topics.map((topic) => (
                    <li key={topic.title} className="border-b border-line last:border-b-0">
                      <Link
                        href={topic.href}
                        className="flex items-center gap-3 bg-paper px-3 py-2.5 hover:bg-plate/50 sm:px-4"
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="text-sm font-medium">{topic.title}</span>
                          <span className="text-xs">{topic.blurb}</span>
                        </span>
                        <ArrowRight aria-hidden className="ml-auto size-3.5 shrink-0 opacity-60" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
