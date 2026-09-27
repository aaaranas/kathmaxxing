import { describe, expect, it } from "vitest";

import {
  type Approach,
  type ClaimedLimit,
  areEquivalent,
  checkDerivative,
  checkLimit,
  describeLimitAnswer,
  freeVariables,
  readApproachPoint,
  readLimitAnswer,
} from "@/lib/math/check";
import { parseExpression } from "@/lib/math/parse";

/**
 * The checker is the thing that tells Kath she is right, so a bug here is
 * worse than no checker at all. These tests hold it to three rules: a correct
 * answer in any spelling passes, a wrong one is caught, and anything it cannot
 * judge says so instead of guessing.
 */

function variables(source: string): string[] {
  const parsed = parseExpression(source);
  if (!parsed.ok) throw new Error(`could not parse ${source}: ${parsed.message}`);
  return freeVariables(parsed.node).sort();
}

const state = (check: { state: string }) => check.state;

describe("freeVariables", () => {
  it("finds the variables and leaves the constants alone", () => {
    expect(variables("2*x + 3")).toEqual(["x"]);
    expect(variables("pi*r^2")).toEqual(["r"]);
    expect(variables("e^t")).toEqual(["t"]);
    expect(variables("sin(a) + cos(b)")).toEqual(["a", "b"]);
    expect(variables("(2*x + h)!")).toEqual(["h", "x"]);
    expect(variables("log(100, 10)")).toEqual([]);
  });
});

describe("areEquivalent, with no variable", () => {
  it("passes the same number however it is written", () => {
    expect(state(areEquivalent("6/5", "1.2"))).toBe("correct");
    expect(state(areEquivalent("6/5", "12/10"))).toBe("correct");
    expect(state(areEquivalent("sqrt(9)", "3"))).toBe("correct");
    expect(state(areEquivalent("2^-2", "0.25"))).toBe("correct");
    expect(state(areEquivalent("log(2, 1024)", "10"))).toBe("correct");
  });

  it("catches a different number", () => {
    const check = areEquivalent("6/5", "5/6");
    expect(check.state).toBe("incorrect");
    expect(check.detail).toContain("different numbers");
  });
});

describe("areEquivalent, with a variable", () => {
  it("does not care about the order or the shape", () => {
    expect(state(areEquivalent("2*x + 3", "3 + 2*x"))).toBe("correct");
    expect(state(areEquivalent("(x + 1)^2", "x^2 + 2*x + 1"))).toBe("correct");
    expect(state(areEquivalent("x^2 - 9", "(x - 3)*(x + 3)"))).toBe("correct");
    expect(state(areEquivalent("sqrt(x)", "x^0.5"))).toBe("correct");
    expect(state(areEquivalent("sin(x)^2 + cos(x)^2", "1"))).toBe("correct");
  });

  it("catches an answer that is close but not equal", () => {
    expect(state(areEquivalent("(x + 1)^2", "x^2 + 1"))).toBe("incorrect");
    expect(state(areEquivalent("x^2 - 9", "(x - 3)^2"))).toBe("incorrect");
  });

  it("does not paper over a difference that only shows on one side of zero", () => {
    // x^(2/3) has no real value at a negative x, while the cube root of x^2
    // does. They are the same on the right and part company on the left, and
    // saying so is more use to her than calling them the same.
    expect(state(areEquivalent("x^(2/3)", "cbrt(x^2)"))).toBe("incorrect");
  });

  it("treats a hole the two share as agreement", () => {
    // 0.3721 is a sample point, so both sides are undefined there.
    expect(state(areEquivalent("1/(x - 0.3721)", "1/(x - 0.3721)"))).toBe("correct");
  });

  it("counts one side being defined where the other is not as wrong", () => {
    const check = areEquivalent("ln(x)", "ln(abs(x))");
    expect(check.state).toBe("incorrect");
    expect(check.detail).toContain("the other is not");
  });

  it("says so rather than guessing when the overlap is too thin", () => {
    // Defined only above 3, which two sample points reach.
    const check = areEquivalent("sqrt(x - 3)", "sqrt(x - 3)");
    expect(check.state).toBe("unsure");
    expect(check.detail).toContain("too few");
  });

  it("handles more than one letter, and keeps them apart", () => {
    expect(state(areEquivalent("2*x + h", "h + 2*x"))).toBe("correct");
    expect(state(areEquivalent("(a + b)^2", "a^2 + 2*a*b + b^2"))).toBe("correct");
    expect(state(areEquivalent("a*b", "b*a"))).toBe("correct");
    // The trap of giving every letter the same value: these would both pass.
    expect(state(areEquivalent("a + b", "2*a"))).toBe("incorrect");
    expect(state(areEquivalent("(a + b)^2", "a^2 + b^2"))).toBe("incorrect");
  });

  it("names every letter when it reports where they part company", () => {
    const check = areEquivalent("a + b", "a - b");
    expect(check.state).toBe("incorrect");
    expect(check.detail).toContain("a = ");
    expect(check.detail).toContain("b = ");
  });

  it("reports what it could not read, and which side it was", () => {
    expect(areEquivalent("x +", "x").state).toBe("unreadable");
    expect(areEquivalent("x", "x +").detail).toContain("Your answer");
    expect(areEquivalent("", "x").state).toBe("unreadable");
  });

  it("reads degrees when asked to", () => {
    expect(state(areEquivalent("sin(x)", "sin(x)", { angle: "deg" }))).toBe("correct");
    expect(state(areEquivalent("sin(90)", "1", { angle: "deg" }))).toBe("correct");
    expect(state(areEquivalent("sin(90)", "1", { angle: "rad" }))).toBe("incorrect");
  });
});

describe("checkDerivative", () => {
  it("passes a correct derivative", () => {
    expect(state(checkDerivative("x^3", "3*x^2"))).toBe("correct");
    expect(state(checkDerivative("x^3", "3*(x^2)"))).toBe("correct");
    expect(state(checkDerivative("5*x^4 - 2*x", "20*x^3 - 2"))).toBe("correct");
    expect(state(checkDerivative("sin(x)", "cos(x)"))).toBe("correct");
    expect(state(checkDerivative("exp(x)", "exp(x)"))).toBe("correct");
    expect(state(checkDerivative("ln(x)", "1/x"))).toBe("correct");
  });

  it("passes a correct chain rule", () => {
    expect(state(checkDerivative("sin(x^2)", "2*x*cos(x^2)"))).toBe("correct");
    expect(state(checkDerivative("(3*x + 1)^5", "15*(3*x + 1)^4"))).toBe("correct");
    expect(state(checkDerivative("exp(2*x)", "2*exp(2*x)"))).toBe("correct");
  });

  it("passes a correct product and quotient rule", () => {
    expect(state(checkDerivative("x^2*sin(x)", "2*x*sin(x) + x^2*cos(x)"))).toBe("correct");
    expect(state(checkDerivative("x/(x + 1)", "1/(x + 1)^2"))).toBe("correct");
  });

  it("catches the usual slips", () => {
    // Forgot the inner derivative.
    expect(state(checkDerivative("sin(x^2)", "cos(x^2)"))).toBe("incorrect");
    // Dropped the power instead of subtracting one.
    expect(state(checkDerivative("x^3", "3*x^3"))).toBe("incorrect");
    // Differentiated the denominator separately.
    expect(state(checkDerivative("x/(x + 1)", "1"))).toBe("incorrect");
  });

  it("names the point where the slopes part company", () => {
    const check = checkDerivative("x^3", "2*x^2");
    expect(check.state).toBe("incorrect");
    expect(check.detail).toContain("the slope is");
  });

  it("takes the variable it is told to use", () => {
    expect(state(checkDerivative("t^2", "2*t", { variable: "t" }))).toBe("correct");
    expect(state(checkDerivative("t^2", "2*t"))).toBe("correct");
  });

  it("holds back when there is too little to go on", () => {
    expect(checkDerivative("sqrt(x - 3)", "1/(2*sqrt(x - 3))").state).toBe("unsure");
  });

  it("reports what it could not read", () => {
    expect(checkDerivative("x^", "2*x").state).toBe("unreadable");
    expect(checkDerivative("x^2", "2*x +").detail).toContain("Your answer");
  });
});

const at = (value: number | "inf" | "-inf", side: Approach["side"] = "both"): Approach => ({
  at: value,
  side,
});
const value = (source: string): ClaimedLimit => ({ kind: "value", source });
const infinite = (sign: 1 | -1): ClaimedLimit => ({ kind: "infinite", sign });
const dne: ClaimedLimit = { kind: "dne" };

describe("checkLimit, a finite answer", () => {
  it("passes a limit through a hole", () => {
    expect(state(checkLimit("(x^2 - 1)/(x - 1)", at(1), value("2")))).toBe("correct");
    expect(state(checkLimit("(x^2 - 9)/(x - 3)", at(3), value("6")))).toBe("correct");
    expect(state(checkLimit("sin(x)/x", at(0), value("1")))).toBe("correct");
  });

  it("accepts the answer in any spelling", () => {
    expect(state(checkLimit("(x^2 - 1)/(x - 1)", at(1), value("4/2")))).toBe("correct");
    expect(state(checkLimit("(x^2 - 1)/(x - 1)", at(1), value("2.0")))).toBe("correct");
  });

  it("catches a wrong value", () => {
    const check = checkLimit("(x^2 - 1)/(x - 1)", at(1), value("3"));
    expect(check.state).toBe("incorrect");
    expect(check.detail).toContain("not 3");
  });

  it("catches a finite answer where the function runs away", () => {
    expect(state(checkLimit("1/x^2", at(0), value("0")))).toBe("incorrect");
  });

  it("works one side at a time", () => {
    expect(state(checkLimit("abs(x)/x", at(0, "right"), value("1")))).toBe("correct");
    expect(state(checkLimit("abs(x)/x", at(0, "left"), value("-1")))).toBe("correct");
    expect(state(checkLimit("abs(x)/x", at(0, "left"), value("1")))).toBe("incorrect");
  });

  it("handles a limit at infinity", () => {
    expect(state(checkLimit("(2*x + 1)/(x - 3)", at("inf"), value("2")))).toBe("correct");
    expect(state(checkLimit("(2*x + 1)/(x - 3)", at("inf"), value("3")))).toBe("incorrect");
    expect(state(checkLimit("1/x", at("-inf"), value("0")))).toBe("correct");
    expect(state(checkLimit("(3*x^2 + 1)/(2*x^2 - x)", at("-inf"), value("3/2")))).toBe("correct");
  });
});

describe("checkLimit, an infinite answer", () => {
  it("passes growth without bound, with the sign", () => {
    expect(state(checkLimit("1/x^2", at(0), infinite(1)))).toBe("correct");
    expect(state(checkLimit("-1/x^2", at(0), infinite(-1)))).toBe("correct");
    expect(state(checkLimit("1/x", at(0, "right"), infinite(1)))).toBe("correct");
    expect(state(checkLimit("1/x", at(0, "left"), infinite(-1)))).toBe("correct");
    expect(state(checkLimit("x^2", at("inf"), infinite(1)))).toBe("correct");
  });

  it("catches the wrong sign", () => {
    const check = checkLimit("1/x", at(0, "left"), infinite(1));
    expect(check.state).toBe("incorrect");
    expect(check.detail).toContain("sign does not match");
  });

  it("catches a claim of infinity where the values settle", () => {
    const check = checkLimit("(x^2 - 1)/(x - 1)", at(1), infinite(1));
    expect(check.state).toBe("incorrect");
    expect(check.detail).toContain("settle");
  });

  it("marks her homework: 2/(x^2 + 5x + 4) - 3/(x + 4) from the left of -4", () => {
    // Combining gives (-3x - 1)/((x + 1)(x + 4)); at -4 the top is 11, the
    // (x + 1) is -3 and the (x + 4) is a shade under zero, so the whole thing
    // is 11 over a small positive - it climbs to positive infinity.
    const fn = "2/(x^2 + 5*x + 4) - 3/(x + 4)";
    expect(state(checkLimit(fn, at(-4, "left"), infinite(1)))).toBe("correct");
    expect(state(checkLimit(fn, at(-4, "left"), infinite(-1)))).toBe("incorrect");
    expect(state(checkLimit(fn, at(-4, "right"), infinite(-1)))).toBe("correct");
  });
});

describe("checkLimit, no limit at all", () => {
  it("passes a genuine disagreement between the sides", () => {
    const check = checkLimit("abs(x)/x", at(0), dne);
    expect(check.state).toBe("correct");
    expect(check.detail).toContain("sides disagree");
  });

  it("catches a limit that does exist", () => {
    const check = checkLimit("(x^2 - 1)/(x - 1)", at(1), dne);
    expect(check.state).toBe("incorrect");
    expect(check.detail).toContain("does exist");
  });

  it("asks for both sides before judging that a limit fails", () => {
    const check = checkLimit("abs(x)/x", at(0, "right"), dne);
    expect(check.state).toBe("unsure");
    expect(check.detail).toContain("both sides");
  });
});

describe("checkLimit, what it will not judge", () => {
  it("holds back where the function cannot be evaluated close in", () => {
    const check = checkLimit("sqrt(x - 10)", at(0, "right"), value("0"));
    expect(check.state).toBe("unsure");
    expect(check.detail).toContain("close enough in");
  });

  it("reports what it could not read", () => {
    expect(checkLimit("1/", at(0), value("0")).state).toBe("unreadable");
    expect(checkLimit("x^2", at(0), value("0 +")).detail).toContain("Your answer");
  });
});

describe("readApproachPoint", () => {
  it("reads a number, however it is written", () => {
    expect(readApproachPoint("-4")).toBe(-4);
    expect(readApproachPoint(" 0 ")).toBe(0);
    expect(readApproachPoint("1/2")).toBe(0.5);
    expect(readApproachPoint("pi")).toBeCloseTo(Math.PI, 12);
    // The minus a phone keyboard substitutes, and the one a browser pastes.
    expect(readApproachPoint("\u22124")).toBe(-4);
  });

  it("reads both infinities, spelled or drawn", () => {
    expect(readApproachPoint("inf")).toBe("inf");
    expect(readApproachPoint("+infinity")).toBe("inf");
    expect(readApproachPoint("-inf")).toBe("-inf");
    expect(readApproachPoint("\u221e")).toBe("inf");
    expect(readApproachPoint("-\u221e")).toBe("-inf");
  });

  it("refuses anything that is not a point", () => {
    expect(readApproachPoint("")).toBeNull();
    expect(readApproachPoint("x")).toBeNull();
    expect(readApproachPoint("2 +")).toBeNull();
    expect(readApproachPoint("1/0")).toBeNull();
  });
});

describe("readLimitAnswer", () => {
  it("reads a value", () => {
    expect(readLimitAnswer("2")).toEqual({ kind: "value", source: "2" });
    expect(readLimitAnswer("3/4")).toEqual({ kind: "value", source: "3/4" });
  });

  it("reads the infinities", () => {
    expect(readLimitAnswer("inf")).toEqual({ kind: "infinite", sign: 1 });
    expect(readLimitAnswer("\u221e")).toEqual({ kind: "infinite", sign: 1 });
    expect(readLimitAnswer("-\u221e")).toEqual({ kind: "infinite", sign: -1 });
    expect(readLimitAnswer("+Infinity")).toEqual({ kind: "infinite", sign: 1 });
  });

  it("reads the ways of saying there is none", () => {
    for (const said of ["DNE", "dne", "does not exist", "doesn't exist", "no limit", "none"]) {
      expect(readLimitAnswer(said)).toEqual({ kind: "dne" });
    }
  });

  it("gives nothing back for an empty answer", () => {
    expect(readLimitAnswer("   ")).toBeNull();
  });

  it("says in words what it understood", () => {
    expect(describeLimitAnswer({ kind: "dne" })).toContain("does not exist");
    expect(describeLimitAnswer({ kind: "infinite", sign: -1 })).toContain("negative");
    expect(describeLimitAnswer({ kind: "value", source: "2" })).toContain("2");
  });
});
