import { chainRule } from "@/lib/calculus/lessons/chain-rule";
import { derivatives } from "@/lib/calculus/lessons/derivatives";
import { functions } from "@/lib/calculus/lessons/functions";
import { graphs } from "@/lib/calculus/lessons/graphs";
import { limits } from "@/lib/calculus/lessons/limits";
import { extrema } from "@/lib/calculus/lessons/extrema";
import { optimization } from "@/lib/calculus/lessons/optimization";
import { relatedRates } from "@/lib/calculus/lessons/related-rates";
import { indeterminate } from "@/lib/calculus/lessons/indeterminate";
import { partialDerivatives } from "@/lib/calculus/lessons/partial-derivatives";
import { implicit } from "@/lib/calculus/lessons/implicit";
import { lines } from "@/lib/calculus/lessons/lines";
import { transcendental } from "@/lib/calculus/lessons/transcendental";
import type { Lesson } from "@/lib/lessons/types";

/**
 * Teaching order: a line is the function whose graph everyone already knows, so
 * it opens; functions generalise it; graphs then read any of them off the rule.
 * Limits come next because a derivative is defined as one, and the chain rule
 * comes last because it needs every rule before it. Transcendental derivatives
 * follow, because every one of them is the chain rule over a new table.
 */
export const CALCULUS_LESSONS: Lesson[] = [
  lines,
  functions,
  graphs,
  limits,
  derivatives,
  chainRule,
  transcendental,
  implicit,
  relatedRates,
  extrema,
  optimization,
  indeterminate,
  partialDerivatives,
];

export function findCalculusLesson(slug: string): Lesson | undefined {
  return CALCULUS_LESSONS.find((lesson) => lesson.slug === slug);
}
