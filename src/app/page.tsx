import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUBJECTS } from "@/lib/subjects";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-4 sm:px-6">
      <SiteHeader
        title="Subjects"
        description="One shelf per subject. Everything inside shows its working — the rules first, then a solution for every kind of problem, written out line by line."
      />

      <div className="flex flex-col gap-4">
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
    </main>
  );
}
