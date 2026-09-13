import { factoring } from "@/lib/algebra/lessons/factoring";
import { integerExponents } from "@/lib/algebra/lessons/integer-exponents";
import { radicals } from "@/lib/algebra/lessons/radicals";
import { rationalExponents } from "@/lib/algebra/lessons/rational-exponents";
import type { Lesson } from "@/lib/lessons/types";

/**
 * Lessons in teaching order rather than alphabetical: rational exponents lean on
 * integer exponents, and radicals lean on both.
 */
export const ALGEBRA_LESSONS: Lesson[] = [
  integerExponents,
  rationalExponents,
  radicals,
  factoring,
];

export function findLesson(slug: string): Lesson | undefined {
  return ALGEBRA_LESSONS.find((lesson) => lesson.slug === slug);
}

export type { Lesson } from "@/lib/lessons/types";
