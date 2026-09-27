import { describe, expect, it } from "vitest";

import { afterLabel, notationToExpression } from "@/lib/math/from-notation";
import { areEquivalent } from "@/lib/math/check";

/** Whether the conversion means the same as the expression it should. */
function same(notation: string, expected: string): boolean {
  const converted = notationToExpression(notation);
  if (converted === null) return false;
  return areEquivalent(converted, expected).state === "correct";
}

describe("afterLabel", () => {
  it("drops a single label from the front", () => {
    expect(afterLabel("f'(x) = 12x^{2}")).toBe("12x^{2}");
    expect(afterLabel("y = 3x - 5")).toBe("3x - 5");
    expect(afterLabel("  m = 3  ")).toBe("3");
  });

  it("leaves an answer with no label, or more than one equals, alone", () => {
    expect(afterLabel("12x^{2}")).toBe("12x^{2}");
    expect(afterLabel("f(-3) = 1, f(-2) = 4")).toBe("f(-3) = 1, f(-2) = 4");
  });
});

describe("notationToExpression", () => {
  it("converts the pieces notation is built from", () => {
    expect(same("\\frac{3}{10}", "0.3")).toBe(true);
    expect(same("x^{54}y^{36}", "x^54*y^36")).toBe(true);
    expect(same("\\sqrt{50}", "sqrt(50)")).toBe(true);
    expect(same("\\sqrt[3]{27}", "3")).toBe(true);
    expect(same("2\\sqrt[4]{16}", "4")).toBe(true);
    expect(same("\\left(x + 1\\right)^{2}", "x^2+2x+1")).toBe(true);
    expect(same("\\left|x\\right|", "abs(x)")).toBe(true);
    expect(same("3 \\cdot 4", "12")).toBe(true);
    expect(same("10 \\times 2 \\div 4", "5")).toBe(true);
    expect(same("2\\pi", "2*pi")).toBe(true);
    expect(same("\\frac{1}{x^{\\frac{7}{8}}}", "x^(-7/8)")).toBe(true);
  });

  it("keeps a power on the letter it was written on", () => {
    expect(same("3ab^{2}", "3*a*b^2")).toBe(true);
    expect(same("y^{5}z\\sqrt[4]{x^{3}z}", "y^5*z*root(4,x^3*z)")).toBe(true);
  });

  it("puts the brackets back around a function written without them", () => {
    expect(same("\\cos x", "cos(x)")).toBe(true);
    expect(same("3x^{2}\\,\\cos x - x^{3}\\,\\sin x", "3x^2*cos(x)-x^3*sin(x)")).toBe(true);
    expect(same("2\\,\\sin x\\,\\cos x", "sin(2x)")).toBe(true);
  });

  it("takes the label off first", () => {
    expect(same("f'(x) = 12x^{2}", "12x^2")).toBe(true);
    expect(same("\\frac{dy}{dx} = 35(5x - 2)^{6}", "35*(5x-2)^6")).toBe(true);
  });

  it("refuses what is not an expression", () => {
    expect(notationToExpression("\\text{Even}")).toBeNull();
    expect(notationToExpression("x \\ne 0")).toBeNull();
    expect(notationToExpression("+\\infty")).toBeNull();
    expect(notationToExpression("\\left(-\\infty, 3\\right]")).toBeNull();
    expect(notationToExpression("x = 2, \\quad y = 1")).toBeNull();
    expect(notationToExpression("a_{1}")).toBeNull();
    expect(notationToExpression("")).toBeNull();
    expect(notationToExpression("   ")).toBeNull();
  });
});
