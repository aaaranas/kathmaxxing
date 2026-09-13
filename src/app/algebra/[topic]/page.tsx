import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calculator, FileText } from "lucide-react";

import { LessonContents, LessonView } from "@/components/algebra/lesson-view";
import { PageShell } from "@/components/page-shell";
import { SiteHeader } from "@/components/site-header";
import { ALGEBRA_LESSONS, findLesson } from "@/lib/algebra";

export function generateStaticParams() {
  return ALGEBRA_LESSONS.map((lesson) => ({ topic: lesson.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/algebra/[topic]">): Promise<Metadata> {
  const { topic } = await params;
  const lesson = findLesson(topic);
  if (!lesson) return {};
  return { title: lesson.title, description: lesson.blurb };
}

export default async function Page({ params }: PageProps<"/algebra/[topic]">) {
  const { topic } = await params;
  const lesson = findLesson(topic);
  if (!lesson) notFound();

  const position = ALGEBRA_LESSONS.indexOf(lesson);
  const previous = ALGEBRA_LESSONS[position - 1];
  const next = ALGEBRA_LESSONS[position + 1];

  return (
    <PageShell>
      <SiteHeader
        crumbs={[
          { label: "Subjects", href: "/" },
          { label: "Algebra", href: "/algebra" },
          { label: lesson.title },
        ]}
        title={lesson.title}
        description={lesson.summary}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="flex items-center gap-1.5 text-xs">
          <FileText aria-hidden className="size-3 shrink-0" />
          {lesson.source}
        </p>
        <Link
          href="/algebra/calculator"
          className="flex items-center gap-1.5 rounded-md border border-line bg-paper px-2.5 py-1 text-xs hover:bg-plate"
        >
          <Calculator aria-hidden className="size-3 shrink-0" />
          Calculator
        </Link>
      </div>

      {/*
        A long lesson wants its jump list in view the whole way down, which
        there is room for once the shell opens. Below that it stays where it
        was, as a row of chips above the content.
      */}
      <div className="lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:items-start lg:gap-6">
        <LessonContents lesson={lesson} />

        <div>
          <LessonView lesson={lesson} />

          <nav
            aria-label="Other topics"
            className="mt-6 grid grid-cols-1 gap-2 border-t border-line pt-4 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/algebra/${previous.slug}`}
                className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2.5 text-sm hover:bg-plate/50"
              >
                <ArrowLeft aria-hidden className="size-3.5 shrink-0" />
                <span className="flex flex-col">
                  <span className="text-xs">Previous</span>
                  <span className="font-medium">{previous.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next && (
              <Link
                href={`/algebra/${next.slug}`}
                className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2.5 text-sm hover:bg-plate/50 sm:justify-end sm:text-right"
              >
                <span className="flex flex-col">
                  <span className="text-xs">Next</span>
                  <span className="font-medium">{next.title}</span>
                </span>
                <ArrowRight aria-hidden className="size-3.5 shrink-0" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </PageShell>
  );
}
