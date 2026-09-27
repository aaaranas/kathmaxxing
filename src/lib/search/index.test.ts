import { describe, expect, it } from "vitest";

import { type Entry, buildIndex, search, terms } from "@/lib/search";

const INDEX = buildIndex();

function titles(query: string, limit = 5): string[] {
  return search(query, INDEX, limit).map((hit) => hit.trail.join(" / ").toLowerCase());
}

function first(query: string): Entry | undefined {
  return search(query, INDEX, 1)[0];
}

describe("terms", () => {
  it("keeps the characters that carry meaning in maths", () => {
    expect(terms("chain rule")).toEqual(["chain", "rule"]);
    expect(terms("  Difference  of SQUARES ")).toEqual(["difference", "of", "squares"]);
    expect(terms("x^2")).toEqual(["x^2"]);
    expect(terms("1/2")).toEqual(["1/2"]);
    expect(terms("")).toEqual([]);
    expect(terms("   ")).toEqual([]);
  });
});

describe("the index", () => {
  it("covers the whole shelf", () => {
    expect(INDEX.length).toBeGreaterThan(300);
    const subjects = new Set(INDEX.map((entry) => entry.trail[0]));
    expect(subjects).toContain("Algebra");
    expect(subjects).toContain("Calculus");
    expect(subjects).toContain("Computer Science");
  });

  it("gives every entry somewhere to go and something to show", () => {
    for (const entry of INDEX) {
      expect(entry.href.startsWith("/"), entry.id).toBe(true);
      expect(entry.label.length, entry.id).toBeGreaterThan(0);
      expect(entry.haystack, entry.id).toBe(entry.haystack.toLowerCase());
    }
  });

  it("names every entry once", () => {
    expect(new Set(INDEX.map((entry) => entry.id)).size).toBe(INDEX.length);
  });
});

describe("searching", () => {
  it("finds a topic by name", () => {
    expect(titles("chain rule")[0]).toContain("chain rule");
    expect(titles("factoring")[0]).toContain("factoring");
    expect(titles("limits")[0]).toContain("limits");
  });

  it("finds a rule by what it is called", () => {
    const hit = first("difference of squares");
    expect(hit?.haystack).toContain("difference of squares");
  });

  it("finds material by the words in it, not only the heading", () => {
    expect(search("asymptote", INDEX).length).toBeGreaterThan(0);
    expect(search("conjugate", INDEX).length).toBeGreaterThan(0);
    expect(search("rationalise", INDEX).length + search("rationalize", INDEX).length).toBeGreaterThan(0);
  });

  it("needs every word to appear somewhere", () => {
    expect(search("chain rule zzzz", INDEX)).toEqual([]);
    expect(search("", INDEX)).toEqual([]);
  });

  it("ignores case", () => {
    expect(search("CHAIN RULE", INDEX).length).toBe(search("chain rule", INDEX).length);
  });

  it("puts a whole word above the start of a longer one", () => {
    const hits = search("power", INDEX, 3);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].haystack).toMatch(/(^|[^a-z])power([^a-z]|$)/);
  });

  it("prefers the lesson itself to the card that links to it", () => {
    const hit = first("radicals");
    expect(hit?.href.startsWith("/algebra/radicals")).toBe(true);
  });

  it("keeps the list to the length asked for", () => {
    expect(search("x", INDEX, 7).length).toBeLessThanOrEqual(7);
  });
});

describe("what a piece is called", () => {
  it("weighs the name of a rule above the same words used in a solution", () => {
    const hit = search("difference of squares", INDEX, 1)[0];
    expect(hit.trail.join(" / ").toLowerCase()).toContain("factoring");
  });

  it("finds a worked example by the pattern it uses", () => {
    expect(search("perfect square trinomial", INDEX).length).toBeGreaterThan(0);
  });
});
