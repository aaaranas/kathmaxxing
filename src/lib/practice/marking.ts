import { type Check, areEquivalent } from "@/lib/math/check";
import { afterLabel, notationToExpression } from "@/lib/math/from-notation";
import { plainMath } from "@/lib/math/notation";

/**
 * Marking a practice answer against the one written in the lesson.
 *
 * Lesson answers are stored as notation, because they are written to be read.
 * Most of them are an expression in disguise and can be marked properly, by
 * testing against what she typed. A few are not - a list of intercepts, a word
 * like "Even", an interval - and those are marked by comparing what is
 * written, which is literal about spelling and says so.
 *
 * Anything longer than that is a sentence, and typing a sentence out exactly
 * is not a fair test of whether she can do the maths, so it is left as an
 * answer to reveal rather than one to mark.
 */

export type Answer =
  /** Marked by testing: any spelling of the same thing passes. */
  | { kind: "expression"; source: string }
  /** Marked by comparing what is written, once the spacing is taken out. */
  | { kind: "words"; value: string }
  /** Not markable — the lesson shows it instead. */
  | { kind: "none" };

/** Past this, an answer is prose or a list rather than a thing to type. */
const WORDS_LIMIT = 12;

/**
 * One spelling for the several ways of writing the same thing: the infinities,
 * the minus signs, and upper against lower case. Spaces go entirely, so
 * `x = 2, y = 1` and `x=2,y=1` are the same answer.
 */
export function normalizeWords(source: string): string {
  return source
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/∞/g, "inf")
    .replace(/infinity/g, "inf")
    .replace(/\s+/g, "");
}

export function readAnswer(notation: string): Answer {
  const expression = notationToExpression(notation);
  if (expression !== null) return { kind: "expression", source: expression };

  const written = plainMath(notation);
  const normalized = normalizeWords(written);
  if (normalized.length > 0 && normalized.length <= WORDS_LIMIT) {
    return { kind: "words", value: normalized };
  }
  return { kind: "none" };
}

/** Whether what she typed is the answer. */
export function markAnswer(typed: string, answer: Answer): Check {
  if (typed.trim().length === 0) {
    return { state: "unreadable", detail: "Write an answer first." };
  }

  if (answer.kind === "none") {
    return {
      state: "unsure",
      detail: "This one is not a single expression, so open the answer and compare it yourself.",
    };
  }

  if (answer.kind === "words") {
    return normalizeWords(typed) === answer.value
      ? { state: "correct", detail: "That matches the answer." }
      : {
          state: "incorrect",
          detail:
            "That is not what is written down. This one is compared letter for letter, so open " +
            "the answer if you think yours says the same thing another way.",
        };
  }

  // Her own label comes off the front the same way the lesson's did, so
  // "f'(x) = 12x^2" and "12x^2" are the same answer.
  return areEquivalent(answer.source, afterLabel(typed));
}
