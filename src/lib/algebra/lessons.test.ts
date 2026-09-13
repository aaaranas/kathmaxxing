import { describe, expect, it } from "vitest";

import { ALGEBRA_LESSONS, findLesson } from "@/lib/algebra";
import { type MathNode, parseMath, splitProse } from "@/lib/algebra/notation";
import type { Lesson } from "@/lib/algebra/types";

/**
 * The lessons are long hand-written data files, so these are proof-reading
 * tests: they catch a mistyped command or an unclosed `$` that would otherwise
 * only show up as a backslash printed on the page.
 */

type Field = { where: string; value: string };

function collect(lesson: Lesson): { math: Field[]; prose: Field[] } {
  const math: Field[] = [];
  const prose: Field[] = [];

  const m = (where: string, value: string) => math.push({ where: `${lesson.slug}/${where}`, value });
  const p = (where: string, value?: string) => {
    if (value !== undefined) prose.push({ where: `${lesson.slug}/${where}`, value });
  };

  p("summary", lesson.summary);
  p("blurb", lesson.blurb);

  for (const section of lesson.sections) {
    const at = section.id;
    p(`${at}.intro`, section.intro);

    if (section.kind === "rules") {
      p(`${at}.note`, section.note);
      for (const rule of section.rules) {
        m(`${at}.${rule.name}`, rule.expr);
        p(`${at}.${rule.name}.note`, rule.note);
      }
    }

    if (section.kind === "checklist") {
      for (const item of section.items) {
        p(`${at}.${item.label}`, item.label);
        p(`${at}.${item.label}.detail`, item.detail);
      }
    }

    if (section.kind === "examples") {
      for (const example of section.examples) {
        m(`${at}.${example.id}.prompt`, example.prompt);
        m(`${at}.${example.id}.answer`, example.answer);
        p(`${at}.${example.id}.tell`, example.tell);
        p(`${at}.${example.id}.check`, example.check);
        example.steps.forEach((step, index) => {
          m(`${at}.${example.id}.step${index}`, step.expr);
          p(`${at}.${example.id}.step${index}.reason`, step.reason);
        });
      }
    }

    if (section.kind === "traps") {
      for (const trap of section.traps) {
        m(`${at}.${trap.wrong}`, trap.wrong);
        m(`${at}.${trap.right}`, trap.right);
        p(`${at}.${trap.wrong}.why`, trap.why);
      }
    }

    if (section.kind === "practice") {
      section.problems.forEach((problem, index) => {
        m(`${at}.${index}.prompt`, problem.prompt);
        m(`${at}.${index}.answer`, problem.answer);
        p(`${at}.${index}.hint`, problem.hint);
      });
    }
  }

  return { math, prose };
}

/** Any text run still carrying a backslash is a command the parser did not know. */
function unknownCommands(nodes: MathNode[]): string[] {
  return nodes.flatMap((node) => {
    switch (node.kind) {
      case "text":
        return node.value.includes("\\") ? [node.value] : [];
      case "prose":
        return [];
      case "sup":
      case "sub":
        return unknownCommands(node.body);
      case "frac":
        return [...unknownCommands(node.num), ...unknownCommands(node.den)];
      case "fence":
        return unknownCommands(node.body);
      case "sqrt":
        return [
          ...(node.index === null ? [] : unknownCommands(node.index)),
          ...unknownCommands(node.radicand),
        ];
    }
  });
}

describe("the algebra shelf", () => {
  it("has unique slugs", () => {
    const slugs = ALGEBRA_LESSONS.map((lesson) => lesson.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("finds every lesson by its own slug", () => {
    for (const lesson of ALGEBRA_LESSONS) {
      expect(findLesson(lesson.slug)).toBe(lesson);
    }
    expect(findLesson("no-such-topic")).toBeUndefined();
  });
});

describe.each(ALGEBRA_LESSONS.map((lesson) => [lesson.slug, lesson] as const))(
  "%s",
  (_slug, lesson) => {
    const { math, prose } = collect(lesson);

    it("has sections, each with content", () => {
      expect(lesson.sections.length).toBeGreaterThan(0);
      for (const section of lesson.sections) {
        const count =
          section.kind === "rules"
            ? section.rules.length
            : section.kind === "examples"
              ? section.examples.length
              : section.kind === "checklist"
                ? section.items.length
                : section.kind === "traps"
                  ? section.traps.length
                  : section.problems.length;
        expect(count, `${section.id} is empty`).toBeGreaterThan(0);
      }
    });

    it("has unique section ids and example ids", () => {
      const sectionIds = lesson.sections.map((section) => section.id);
      expect(new Set(sectionIds).size).toBe(sectionIds.length);

      const exampleIds = lesson.sections.flatMap((section) =>
        section.kind === "examples" ? section.examples.map((example) => example.id) : [],
      );
      expect(new Set(exampleIds).size).toBe(exampleIds.length);
    });

    it("gives every worked example at least one step", () => {
      for (const section of lesson.sections) {
        if (section.kind !== "examples") continue;
        for (const example of section.examples) {
          expect(example.steps.length, `${example.id} has no steps`).toBeGreaterThan(0);
        }
      }
    });

    it("uses no unknown notation commands", () => {
      const bad = math
        .filter((field) => unknownCommands(parseMath(field.value)).length > 0)
        .map((field) => `${field.where}: ${field.value}`);
      expect(bad).toEqual([]);
    });

    it("closes every inline expression in prose", () => {
      const unbalanced = prose
        .filter((field) => (field.value.split("$").length - 1) % 2 !== 0)
        .map((field) => `${field.where}: ${field.value}`);
      expect(unbalanced).toEqual([]);
    });

    it("uses no unknown notation commands inside prose either", () => {
      const bad = prose
        .flatMap((field) =>
          splitProse(field.value)
            .filter((run) => run.math && unknownCommands(parseMath(run.value)).length > 0)
            .map((run) => `${field.where}: ${run.value}`),
        )
        .filter(Boolean);
      expect(bad).toEqual([]);
    });
  },
);
