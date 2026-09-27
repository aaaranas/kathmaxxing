import type { Lesson } from "@/lib/lessons/types";
import { problemKey } from "@/lib/practice/record";

/** Every practice problem in a lesson, named the way the record names it. */
export function lessonPracticeKeys(lesson: Lesson): string[] {
  return lesson.sections.flatMap((section) =>
    section.kind === "practice"
      ? section.problems.map((_, index) => problemKey(lesson.slug, section.id, index))
      : [],
  );
}
