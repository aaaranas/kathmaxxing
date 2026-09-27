import { describe, expect, it } from "vitest";

import { ALGEBRA_LESSONS } from "@/lib/algebra";
import { CALCULUS_LESSONS } from "@/lib/calculus";
import { areEquivalent } from "@/lib/math/check";
import { markAnswer, normalizeWords, readAnswer } from "@/lib/practice/marking";

const LESSONS = [...ALGEBRA_LESSONS, ...CALCULUS_LESSONS];

function mark(answer: string, typed: string) {
  return markAnswer(typed, readAnswer(answer)).state;
}

describe("readAnswer", () => {
  it("sees the expression inside an answer, label and all", () => {
    expect(readAnswer("\\frac{3}{10}").kind).toBe("expression");
    expect(readAnswer("x^{54}y^{36}").kind).toBe("expression");
    expect(readAnswer("f'(x) = 12x^{2}").kind).toBe("expression");
    expect(readAnswer("\\frac{dy}{dx} = 35(5x - 2)^{6}").kind).toBe("expression");
    expect(readAnswer("3x^{2}\\,\\cos x - x^{3}\\,\\sin x").kind).toBe("expression");
    expect(readAnswer("y^{5}z\\sqrt[4]{x^{3}z}").kind).toBe("expression");
  });

  it("falls back to comparing what is written for a short answer", () => {
    expect(readAnswer("\\text{Even}")).toEqual({ kind: "words", value: "even" });
    expect(readAnswer("+\\infty")).toEqual({ kind: "words", value: "+inf" });
    expect(readAnswer("\\left(-\\infty, 3\\right]")).toEqual({ kind: "words", value: "(-inf,3]" });
  });

  it("leaves a sentence or a list to be read rather than marked", () => {
    expect(readAnswer("\\text{x-axis, y-axis and origin}").kind).toBe("none");
    expect(readAnswer("\\text{Parabola, vertex } (4, 1)").kind).toBe("none");
    expect(readAnswer("(0, 3), \; (1, 0), \; (3, 0)").kind).toBe("none");
  });
});

describe("marking an expression answer", () => {
  it("passes any spelling of the right answer", () => {
    expect(mark("\\frac{3}{10}", "3/10")).toBe("correct");
    expect(mark("\\frac{3}{10}", "0.3")).toBe("correct");
    expect(mark("\\frac{3}{10}", "6/20")).toBe("correct");
    expect(mark("x^{54}y^{36}", "y^36 x^54")).toBe("correct");
    expect(mark("(x - 3)(x + 3)", "x^2-9")).toBe("correct");
  });

  it("takes her label off the front too", () => {
    expect(mark("f'(x) = 12x^{2}", "12x^2")).toBe("correct");
    expect(mark("f'(x) = 12x^{2}", "f'(x) = 12x^2")).toBe("correct");
    expect(mark("\\frac{dy}{dx} = 35(5x - 2)^{6}", "dy/dx = 35(5x-2)^6")).toBe("correct");
  });

  it("catches a wrong answer", () => {
    expect(mark("\\frac{3}{10}", "3/100")).toBe("incorrect");
    expect(mark("x^{54}y^{36}", "x^54y^35")).toBe("incorrect");
    expect(mark("f'(x) = 12x^{2}", "12x")).toBe("incorrect");
  });

  it("says when it cannot read what was typed", () => {
    expect(mark("\\frac{3}{10}", "3/")).toBe("unreadable");
    expect(mark("\\frac{3}{10}", "   ")).toBe("unreadable");
  });
});

describe("marking a written answer", () => {
  it("ignores case, spacing and the several infinities", () => {
    expect(mark("\\text{Even}", "even")).toBe("correct");
    expect(mark("\\text{Even}", "  Even ")).toBe("correct");
    expect(mark("+\\infty", "+inf")).toBe("correct");
    expect(mark("+\\infty", "+∞")).toBe("correct");
    expect(mark("+\\infty", "+infinity")).toBe("correct");
  });

  it("keeps the distinctions that are the answer", () => {
    expect(mark("\\text{Even}", "odd")).toBe("incorrect");
    expect(mark("+\\infty", "-inf")).toBe("incorrect");
    // An open end and a closed end are different answers.
    expect(mark("\\left(-\\infty, 3\\right]", "(-inf,3)")).toBe("incorrect");
    expect(mark("\\left(-\\infty, 3\\right]", "(-inf, 3]")).toBe("correct");
  });

  it("hands a sentence back rather than marking it", () => {
    expect(mark("\\text{x-axis, y-axis and origin}", "the axes and the origin")).toBe("unsure");
  });
});

describe("normalizeWords", () => {
  it("folds the spellings that mean the same", () => {
    expect(normalizeWords(" Even ")).toBe("even");
    expect(normalizeWords("−∞")).toBe("-inf");
    expect(normalizeWords("x = 2, y = 1")).toBe("x=2,y=1");
  });
});

/**
 * The whole practice set, held to two things: that the answers still classify
 * the way the marking expects, and that every one it means to mark can
 * actually be marked. An answer that converted to something unusable would
 * fail every attempt she made at it, which is worse than not marking at all.
 */
describe("the practice sets as they stand", () => {
  const problems = LESSONS.flatMap((lesson) =>
    lesson.sections.flatMap((section) =>
      section.kind === "practice"
        ? section.problems.map((problem) => ({ lesson: lesson.slug, ...problem }))
        : [],
    ),
  );

  it("has practice to mark", () => {
    expect(problems.length).toBeGreaterThan(60);
  });

  it("can mark most of it properly", () => {
    const markable = problems.filter((problem) => readAnswer(problem.answer).kind !== "none");
    expect(markable.length / problems.length).toBeGreaterThan(0.75);
  });

  it("never converts an answer into one that cannot be compared", () => {
    for (const problem of problems) {
      const answer = readAnswer(problem.answer);
      if (answer.kind !== "expression") continue;
      const check = areEquivalent(answer.source, answer.source);
      expect(check.state, `${problem.lesson}: ${problem.answer} -> ${answer.source}`).toBe(
        "correct",
      );
    }
  });
});
