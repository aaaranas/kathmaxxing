import { functions } from "@/lib/calculus/lessons/functions";
import { graphs } from "@/lib/calculus/lessons/graphs";
import { lines } from "@/lib/calculus/lessons/lines";
import type { Lesson } from "@/lib/lessons/types";

/**
 * Teaching order: a line is the function whose graph everyone already knows, so
 * it opens; functions generalise it; graphs then read any of them off the rule.
 */
export const CALCULUS_LESSONS: Lesson[] = [lines, functions, graphs];

export function findCalculusLesson(slug: string): Lesson | undefined {
  return CALCULUS_LESSONS.find((lesson) => lesson.slug === slug);
}
