import { describe, expect, it } from "vitest";

import { describeMath, parseMath, splitProse, typesetText } from "@/lib/algebra/notation";

const m = String.raw;

describe("parseMath", () => {
  it("keeps plain text in a single run", () => {
    expect(parseMath("2 + 2")).toEqual([{ kind: "text", value: "2 + 2" }]);
  });

  it("reads a single-character superscript", () => {
    expect(parseMath("x^2")).toEqual([
      { kind: "text", value: "x" },
      { kind: "sup", body: [{ kind: "text", value: "2" }] },
    ]);
  });

  it("reads a braced superscript as one unit", () => {
    expect(parseMath("x^{-12}")).toEqual([
      { kind: "text", value: "x" },
      { kind: "sup", body: [{ kind: "text", value: "-12" }] },
    ]);
  });

  it("reads subscripts", () => {
    expect(parseMath("a_1")).toEqual([
      { kind: "text", value: "a" },
      { kind: "sub", body: [{ kind: "text", value: "1" }] },
    ]);
  });

  it("reads a fraction", () => {
    expect(parseMath(m`\frac{a}{b}`)).toEqual([
      {
        kind: "frac",
        num: [{ kind: "text", value: "a" }],
        den: [{ kind: "text", value: "b" }],
      },
    ]);
  });

  it("reads a square root with no index", () => {
    expect(parseMath(m`\sqrt{x}`)).toEqual([
      { kind: "sqrt", index: null, radicand: [{ kind: "text", value: "x" }] },
    ]);
  });

  it("reads a root with an index", () => {
    expect(parseMath(m`\sqrt[3]{x}`)).toEqual([
      {
        kind: "sqrt",
        index: [{ kind: "text", value: "3" }],
        radicand: [{ kind: "text", value: "x" }],
      },
    ]);
  });

  it("nests a fraction inside an exponent", () => {
    expect(parseMath(m`a^{\frac{1}{2}}`)).toEqual([
      { kind: "text", value: "a" },
      {
        kind: "sup",
        body: [
          {
            kind: "frac",
            num: [{ kind: "text", value: "1" }],
            den: [{ kind: "text", value: "2" }],
          },
        ],
      },
    ]);
  });

  it("treats a bare group as transparent", () => {
    expect(parseMath("{ab}")).toEqual([{ kind: "text", value: "ab" }]);
  });

  it("substitutes known symbols and merges the runs around them", () => {
    expect(parseMath(m`a \cdot b \ne c`)).toEqual([{ kind: "text", value: "a · b ≠ c" }]);
  });

  it("sets an operator name upright rather than printing its command", () => {
    expect(parseMath(m`\log_{b}`)).toEqual([
      { kind: "text", value: "log" },
      { kind: "sub", body: [{ kind: "text", value: "b" }] },
    ]);
  });

  it("types a fence that has nothing tall in it", () => {
    expect(parseMath(m`\left(x\right)`)).toEqual([{ kind: "text", value: "(x)" }]);
    expect(parseMath(m`\left[x\right]`)).toEqual([{ kind: "text", value: "[x]" }]);
    expect(parseMath(m`\left.x\right|`)).toEqual([{ kind: "text", value: "x|" }]);
  });

  it("draws a fence that has to stretch", () => {
    const fraction = {
      kind: "frac",
      num: [{ kind: "text", value: "a" }],
      den: [{ kind: "text", value: "b" }],
    };
    expect(parseMath(m`\left(\frac{a}{b}\right)`)).toEqual([
      { kind: "fence", open: "(", close: "(", body: [fraction] },
    ]);
    expect(parseMath(m`\left(\sqrt{x}\right)`)).toEqual([
      {
        kind: "fence",
        open: "(",
        close: "(",
        body: [{ kind: "sqrt", index: null, radicand: [{ kind: "text", value: "x" }] }],
      },
    ]);
  });

  it("judges an outer fence on what survives inside it", () => {
    // The inner fence flattens to text, so the outer one has nothing tall left.
    expect(parseMath(m`\left(\left(x\right)y\right)`)).toEqual([
      { kind: "text", value: "((x)y)" },
    ]);
  });

  it("normalises the closing delimiter of a drawn fence", () => {
    expect(parseMath(m`\left[\frac{a}{b}\right)`)).toEqual([
      {
        kind: "fence",
        open: "[",
        close: "(",
        body: [
          {
            kind: "frac",
            num: [{ kind: "text", value: "a" }],
            den: [{ kind: "text", value: "b" }],
          },
        ],
      },
    ]);
  });

  it("closes an unterminated fence at the end of the expression", () => {
    expect(parseMath(m`\left(x`)).toEqual([{ kind: "text", value: "(x)" }]);
  });

  it("prints a stray closing bracket rather than dropping it", () => {
    expect(parseMath(m`x\right)`)).toEqual([{ kind: "text", value: "x)" }]);
  });

  it("keeps prose out of the math font", () => {
    expect(parseMath(m`\text{True as written.}`)).toEqual([
      { kind: "prose", value: "True as written." },
    ]);
  });

  it("shows an unknown command rather than swallowing it", () => {
    expect(parseMath(m`\wobble`)).toEqual([{ kind: "text", value: "\\wobble" }]);
  });

  it("survives an unbalanced brace instead of hanging", () => {
    expect(parseMath(m`\frac{a}`)).toEqual([
      { kind: "frac", num: [{ kind: "text", value: "a" }], den: [] },
    ]);
    expect(parseMath("x}")).toEqual([{ kind: "text", value: "x" }]);
  });
});

describe("typesetText", () => {
  it("prints hyphens as minus signs", () => {
    expect(typesetText("-12")).toBe("−12");
  });
});

describe("splitProse", () => {
  it("alternates prose and math", () => {
    expect(splitProse("since $x^2$ is positive")).toEqual([
      { math: false, value: "since " },
      { math: true, value: "x^2" },
      { math: false, value: " is positive" },
    ]);
  });

  it("keeps parity when a run is empty", () => {
    // "$a$$b$" has an empty prose run between the two expressions; dropping it
    // must not turn the second expression into prose.
    expect(splitProse("$a$$b$")).toEqual([
      { math: true, value: "a" },
      { math: true, value: "b" },
    ]);
  });

  it("passes a sentence with no math straight through", () => {
    expect(splitProse("plain words")).toEqual([{ math: false, value: "plain words" }]);
  });
});

describe("describeMath", () => {
  it("reads an expression as a sentence for screen readers", () => {
    expect(describeMath(parseMath("x^2"))).toBe("x to the power of 2");
    expect(describeMath(parseMath(m`\frac{a}{b}`))).toBe("a over b");
    expect(describeMath(parseMath(m`\sqrt[3]{x}`))).toBe("the 3th root of x");
    expect(describeMath(parseMath(m`\sqrt{x}`))).toBe("the square root of x");
  });
});
