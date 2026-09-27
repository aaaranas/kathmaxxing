import { chainRule } from "@/lib/calculus/lessons/chain-rule";
import { derivatives } from "@/lib/calculus/lessons/derivatives";
import { functions } from "@/lib/calculus/lessons/functions";
import { graphs } from "@/lib/calculus/lessons/graphs";
import { lines } from "@/lib/calculus/lessons/lines";
import type { Lesson } from "@/lib/lessons/types";

/**
 * Teaching order: a line is the function whose graph everyone already knows, so
 * it opens; functions generalise it; graphs then read any of them off the rule.
 * Derivatives pick up exactly where the Functions lesson's difference quotient
 * stops, and the chain rule comes last because it needs every rule before it.
 */
export const CALCULUS_LESSONS: Lesson[] = [lines, functions, graphs, derivatives, chainRule];

export function findCalculusLesson(slug: string): Lesson | undefined {
  return CALCULUS_LESSONS.find((lesson) => lesson.slug === slug);
}
