import { BookOpen, ListOrdered, Ruler, TriangleAlert } from "lucide-react";

import { ExampleList, PracticeList, TrapList } from "@/components/algebra/lesson-sections";
import { Math, Prose } from "@/components/algebra/math";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lesson, Section } from "@/lib/algebra/types";

const ICONS = {
  rules: Ruler,
  examples: BookOpen,
  checklist: ListOrdered,
  traps: TriangleAlert,
  practice: ListOrdered,
} as const;

function SectionBody({ section }: { section: Section }) {
  if (section.kind === "rules") {
    return (
      <div className="flex flex-col gap-3">
        <ul className="flex flex-col overflow-hidden rounded-lg border border-line">
          {section.rules.map((rule) => (
            <li
              key={rule.name}
              className="flex flex-col gap-1.5 border-b border-line bg-paper px-3 py-3 last:border-b-0 sm:px-4"
            >
              <span className="text-xs font-medium tracking-wide uppercase">{rule.name}</span>
              <Math expr={rule.expr} display="block" className="text-base sm:text-lg" />
              {rule.note && (
                <p className="text-sm">
                  <Prose text={rule.note} />
                </p>
              )}
            </li>
          ))}
        </ul>
        {section.note && (
          <p className="rounded-lg border border-line bg-desk px-4 py-3 text-sm">
            <Prose text={section.note} />
          </p>
        )}
      </div>
    );
  }

  if (section.kind === "checklist") {
    return (
      <ol className="flex flex-col gap-2.5">
        {section.items.map((item, index) => (
          <li key={item.label} className="flex items-start gap-3">
            <span
              aria-hidden
              className="tnum mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-plate font-mono text-xs font-medium"
            >
              {index + 1}
            </span>
            <p className="text-sm">
              <span className="font-medium">
                <Prose text={item.label} />.{" "}
              </span>
              <Prose text={item.detail} />
            </p>
          </li>
        ))}
      </ol>
    );
  }

  if (section.kind === "examples") return <ExampleList examples={section.examples} />;
  if (section.kind === "traps") return <TrapList traps={section.traps} />;
  return <PracticeList problems={section.problems} />;
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <div className="flex flex-col gap-4">
      {lesson.sections.map((section) => {
        const Icon = ICONS[section.kind];
        return (
          <Card key={section.id} id={section.id} className="scroll-mt-4 border-0 ring-1 ring-foreground/15">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon aria-hidden className="size-4 shrink-0" />
                {section.title}
              </CardTitle>
              {section.intro && (
                <CardDescription>
                  <Prose text={section.intro} />
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <SectionBody section={section} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * The jump list for a long lesson.
 *
 * A row of chips above the content on a narrow screen; a sticky column beside
 * it once there is room, where it can stay in view for the whole scroll. The
 * chip borders come off in the sidebar - a vertical stack of outlined boxes
 * reads as a pile of buttons rather than a list.
 */
export function LessonContents({ lesson }: { lesson: Lesson }) {
  return (
    <nav
      aria-label="On this page"
      className="mb-4 rounded-lg border border-line bg-desk px-4 py-3 lg:sticky lg:top-4 lg:mb-0"
    >
      <p className="mb-2 text-xs font-medium tracking-wide uppercase">On this page</p>
      <ul className="flex flex-wrap gap-1.5 lg:flex-col lg:flex-nowrap lg:gap-0.5">
        {lesson.sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={
                "inline-block rounded-md border border-line bg-paper px-2.5 py-1 text-sm hover:bg-plate " +
                "lg:block lg:border-transparent lg:bg-transparent lg:px-2 lg:py-1 lg:hover:bg-plate"
              }
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
