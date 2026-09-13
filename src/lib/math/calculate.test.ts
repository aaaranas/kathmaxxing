import { describe, expect, it } from "vitest";

import { calculate } from "@/lib/math/calculate";
import { parseExpression } from "@/lib/math/parse";
import { toNotation } from "@/lib/math/render";
import {
  exactRoot,
  fromDecimalString,
  integerRoot,
  rational,
  toDecimalString,
} from "@/lib/math/rational";

/** The answer as notation, or the failure message. */
function answer(input: string, mode: "rad" | "deg" = "rad"): string {
  const result = calculate(input, mode);
  if (result.state === "ok") return result.answer;
  if (result.state === "empty") return "<empty>";
  return result.message;
}

function reading(input: string): string {
  const parsed = parseExpression(input);
  return parsed.ok ? toNotation(parsed.node) : "<unreadable>";
}

function isExact(input: string): boolean {
  const result = calculate(input);
  return result.state === "ok" && result.exact;
}

describe("rational", () => {
  it("reduces to lowest terms and keeps the sign on top", () => {
    expect(rational(6n, -8n)).toEqual({ n: -3n, d: 4n });
    expect(rational(0n, 5n)).toEqual({ n: 0n, d: 1n });
  });

  it("reads a decimal literal exactly", () => {
    expect(fromDecimalString("0.1")).toEqual({ n: 1n, d: 10n });
    expect(fromDecimalString("2.50")).toEqual({ n: 5n, d: 2n });
  });

  it("finds an integer root only when there is one", () => {
    expect(integerRoot(64n, 6)).toBe(2n);
    expect(integerRoot(1024n, 5)).toBe(4n);
    expect(integerRoot(65n, 6)).toBeNull();
    expect(integerRoot(0n, 3)).toBe(0n);
  });

  it("roots a negative only for an odd index", () => {
    expect(exactRoot(rational(-27n, 8n), 3)).toEqual({ n: -3n, d: 2n });
    expect(exactRoot(rational(-16n), 4)).toBeNull();
  });

  it("gives a decimal reading for values Number cannot hold", () => {
    expect(toDecimalString(rational(1n, 8n))).toBe("0.125");
    expect(toDecimalString(rational(10n ** 400n))).toBe("1e+400");
    expect(toDecimalString(rational(1n, 10n ** 400n))).toBe("1e-400");
    expect(toDecimalString(rational(3n * 10n ** 400n, 7n))).toMatch(/^4\.28571428571e\+399$/);
  });
});

describe("reading an expression", () => {
  it("binds a power tighter than a leading minus", () => {
    expect(answer("-4^2")).toBe("-16");
    expect(answer("(-4)^2")).toBe("16");
  });

  it("keeps powers right-associative", () => {
    expect(answer("2^3^2")).toBe("512");
  });

  it("lets an exponent carry its own sign", () => {
    expect(answer("2^-3")).toBe("\\frac{1}{8}");
  });

  it("multiplies where the multiplication is only implied", () => {
    expect(answer("2(3+4)")).toBe("14");
    expect(answer("(1+2)(3+4)")).toBe("21");
    expect(answer("2sqrt(9)")).toBe("6");
  });

  it("draws division as a fraction, so the grouping is visible", () => {
    expect(reading("1/2+1")).toBe("\\frac{1}{2} + 1");
    expect(reading("1/(2+1)")).toBe("\\frac{1}{2 + 1}");
  });

  it("brackets only where dropping them would change the reading", () => {
    expect(reading("2*(3+4)")).toBe("2 \\cdot \\left(3 + 4\\right)");
    expect(reading("2*3+4")).toBe("2 \\cdot 3 + 4");
    expect(reading("1-(2-3)")).toBe("1 - \\left(2 - 3\\right)");
    expect(reading("1-2-3")).toBe("1 - 2 - 3");
    expect(reading("(2+3)^2")).toBe("\\left(2 + 3\\right)^{2}");
  });

  it("draws roots and absolute values with their own notation", () => {
    expect(reading("sqrt(2)")).toBe("\\sqrt{2}");
    expect(reading("root(3,8)")).toBe("\\sqrt[3]{8}");
    expect(reading("abs(-2)")).toBe("\\left|-2\\right|");
  });

  it("reads a bare name as a variable, and one with brackets as a function", () => {
    expect(reading("2x+1")).toBe("2 \\cdot x + 1");
    expect(reading("(a)")).toBe("a");
    expect(answer("frog(2)")).toBe('"frog" is not a function here.');
  });

  it("will not guess at a variable with no value", () => {
    expect(answer("x+1")).toBe('"x" has no value here.');
  });

  it("reports what it could not read", () => {
    expect(answer("2+")).toBe("The expression stops early.");
    expect(answer("2 3)")).toBe('")" is left over at the end.');
    expect(answer("frog(2)")).toBe('"frog" is not a function here.');
    expect(answer("sqrt(1,2)")).toBe("sqrt takes 1 argument.");
    expect(answer("2 # 3")).toBe('"#" is not something this calculator understands.');
  });
});

describe("exact arithmetic", () => {
  it("adds decimals without floating-point dust", () => {
    expect(answer("0.1+0.2")).toBe("\\frac{3}{10}");
    expect(isExact("0.1+0.2")).toBe(true);
  });

  it("keeps division exact", () => {
    expect(answer("1/3+1/6")).toBe("\\frac{1}{2}");
  });

  // The answers below are the worked examples and practice from the lessons,
  // so the calculator agrees with the pages it sits next to.
  it("answers the rational exponent examples exactly", () => {
    expect(answer("(2^-1+3^-1)^-1")).toBe("\\frac{6}{5}");
    expect(answer("49^(5/2)")).toBe("16807");
    expect(answer("64^(-5/6)")).toBe("\\frac{1}{32}");
    expect(answer("(-729)^(4/3)")).toBe("6561");
    expect(answer("(121/36)^(-3/2)")).toBe("\\frac{216}{1331}");
    expect(answer("(-32/243)^(2/5)")).toBe("\\frac{4}{9}");
    expect(answer("(81/625)^(3/4)")).toBe("\\frac{27}{125}");
    expect(answer("(-27/8)^(1/3)")).toBe("-\\frac{3}{2}");
    expect(answer("(625/256)^(1/4)")).toBe("\\frac{5}{4}");
  });

  it("answers the integer exponent examples exactly", () => {
    expect(answer("2*5^2+(-4)^2")).toBe("66");
    expect(answer("-4^3+(-4)^3")).toBe("-128");
    expect(answer("8*2^-3+16^0")).toBe("2");
    expect(answer("3^2*(-2)^3/6^-2")).toBe("-2592");
    expect(answer("4^-2*5^3/3^-4")).toBe("\\frac{10125}{16}");
    expect(answer("7^0*(4^2*3^2)^2")).toBe("20736");
  });

  it("stays exact through a root that comes out whole", () => {
    expect(isExact("sqrt(256)")).toBe(true);
    expect(answer("root(8,256)")).toBe("2");
    expect(answer("root(5,-1024)")).toBe("-4");
    expect(answer("cbrt(-216)")).toBe("-6");
  });

  it("falls back to a decimal when the root does not come out", () => {
    expect(isExact("sqrt(2)")).toBe(false);
    expect(answer("sqrt(2)")).toBe("1.41421356237");
  });

  it("computes factorials exactly", () => {
    expect(answer("5!")).toBe("120");
    expect(answer("0!")).toBe("1");
    expect(answer("(-1)!")).toBe("A factorial needs a number that is zero or more.");
  });
});

describe("results that do not exist", () => {
  it("refuses an even root of a negative", () => {
    expect(answer("(-16)^(1/4)")).toBe("An even root of a negative number is not a real number.");
    expect(answer("sqrt(-4)")).toBe("An even root of a negative number is not a real number.");
  });

  it("refuses division by zero", () => {
    expect(answer("1/0")).toBe("That divides by zero.");
    expect(answer("0^-1")).toBe("Zero to a negative power divides by zero.");
  });

  it("refuses a logarithm of a non-positive number", () => {
    expect(answer("ln(0)")).toBe("A logarithm needs a positive number.");
    expect(answer("log(-5)")).toBe("A logarithm needs a positive number.");
  });

  it("refuses a tangent at its asymptote", () => {
    expect(answer("tan(90)", "deg")).toBe("The tangent is undefined there.");
  });

  it("refuses an exact power that would be a wall of digits", () => {
    const result = calculate("9^9^9");
    expect(result.state === "ok" && result.exact).toBe(false);
  });
});

describe("functions", () => {
  it("does logs in both bases", () => {
    expect(answer("log(1000)")).toBe("3");
    expect(answer("ln(1)")).toBe("0");
    expect(answer("log(2,8)")).toBe("3");
  });

  it("respects the angle mode", () => {
    expect(answer("sin(90)", "deg")).toBe("1");
    expect(calculate("sin(pi/2)").state).toBe("ok");
    expect(answer("asin(1)", "deg")).toBe("90");
  });

  it("takes an absolute value exactly", () => {
    expect(answer("abs(-3/4)")).toBe("\\frac{3}{4}");
  });
});

describe("calculate", () => {
  it("treats blank input as idle rather than an error", () => {
    expect(calculate("").state).toBe("empty");
    expect(calculate("   ").state).toBe("empty");
  });

  it("shows a decimal alongside an exact fraction, but not alongside a whole number", () => {
    const fraction = calculate("6/5");
    expect(fraction.state === "ok" && fraction.decimal).toBe("1.2");
    const whole = calculate("4/2");
    expect(whole.state === "ok" && whole.decimal).toBe(null);
  });

  it("keeps the reading even when the answer does not exist", () => {
    const result = calculate("1/0");
    expect(result.state).toBe("failed");
    expect(result.state === "failed" && result.reading).toBe("\\frac{1}{0}");
  });

  it("accepts the symbols the keypad prints", () => {
    expect(answer("2×3")).toBe("6");
    expect(answer("6÷3")).toBe("2");
    expect(answer("√(9)")).toBe("3");
    expect(answer("2−5")).toBe("-3");
  });
});
