import { ALGEBRA_LESSONS } from "@/lib/algebra";
import { CALCULUS_LESSONS } from "@/lib/calculus";
import type { Lesson } from "@/lib/lessons/types";
import { plainMath, splitProse } from "@/lib/math/notation";
import { SUBJECTS } from "@/lib/subjects";

/**
 * Looking things up across the whole shelf.
 *
 * Everything on the shelf is data already, so the index is built from the same
 * lessons the pages render - there is no second copy to keep in step, and
 * nothing to fetch. It is built in the browser, which means it works with the
 * app offline, and it means a search never leaves her phone.
 *
 * The ranking is deliberately plain: every word of the query has to appear, a
 * word in the heading counts for more than one in the body, and a whole word
 * counts for more than the start of one. Nothing here is clever enough to
 * surprise her with a result she cannot explain.
 */

export type Entry = {
  id: string;
  /** What the result leads to. */
  href: string;
  /** Drawn as notation, or as a sentence that may have `$maths$` in it. */
  label: string;
  labelKind: "math" | "prose";
  /** The line under the label. */
  detail: string;
  /** Subject, lesson, section - the line above the label. */
  trail: string[];
  /** Everything about this entry, lowercased, for matching. */
  haystack: string;
  /**
   * Added to the score of any entry that matches at all. A whole lesson
   * carries the largest, so that searching its name lands on the lesson rather
   * than on a line inside another lesson that happens to mention it.
   */
  boost: number;
};

export type Hit = Entry & { score: number };

/** Notation and prose alike as plain words, for the haystack. */
function readable(text: string): string {
  return splitProse(text)
    .map((run) => (run.math ? plainMath(run.value) : run.value))
    .join(" ");
}

/**
 * `heading` is what this piece is called - the name of a rule, the pattern a
 * worked example uses - as against `label`, which is what it looks like. The
 * name is what gets typed into a search box, so it is what the scoring weighs
 * most, even where the page shows the expression instead.
 */
function entry(
  parts: Omit<Entry, "haystack" | "id" | "boost"> & { boost?: number; heading?: string },
  extra: string[] = [],
  index = 0,
): Entry {
  const { heading, ...rest } = parts;
  const label = parts.labelKind === "math" ? plainMath(parts.label) : readable(parts.label);
  return {
    ...rest,
    boost: parts.boost ?? 0,
    id: `${parts.href}#${parts.trail.join("/")}#${index}`,
    haystack: [heading ?? label, label, readable(parts.detail), ...parts.trail, ...extra]
      .join(" \u00b7 ")
      .toLowerCase(),
  };
}

function lessonEntries(lesson: Lesson, subject: string, base: string): Entry[] {
  const href = `${base}/${lesson.slug}`;
  const trail = (section?: string) =>
    section === undefined ? [subject, lesson.title] : [subject, lesson.title, section];

  const out: Entry[] = [
    entry(
      {
        href,
        label: lesson.title,
        labelKind: "prose",
        detail: lesson.blurb,
        trail: trail(),
        boost: 3,
      },
      [lesson.summary, lesson.source],
    ),
  ];

  for (const section of lesson.sections) {
    const at = `${href}#${section.id}`;
    const where = trail(section.title);

    if (section.kind === "rules") {
      section.rules.forEach((rule, index) =>
        out.push(
          entry(
            {
              href: at,
              label: rule.expr,
              labelKind: "math",
              heading: rule.name,
              detail: rule.note ?? rule.name,
              trail: where,
              // A rule stated is a better answer to its own name than a
              // worked example that happens to use it.
              boost: 1,
            },
            [rule.name],
            index,
          ),
        ),
      );
    }

    if (section.kind === "examples") {
      section.examples.forEach((example, index) =>
        out.push(
          entry(
            {
              href: at,
              label: example.prompt,
              labelKind: "math",
              heading: example.pattern,
              detail: `${example.pattern}. ${example.tell}`,
              trail: where,
            },
            // The steps are what someone stuck halfway through is looking for.
            [...example.steps.map((step) => readable(step.reason)), plainMath(example.answer)],
            index,
          ),
        ),
      );
    }

    if (section.kind === "checklist") {
      section.items.forEach((item, index) =>
        out.push(
          entry(
            {
              href: at,
              label: item.label,
              labelKind: "prose",
              detail: item.detail,
              trail: where,
            },
            [],
            index,
          ),
        ),
      );
    }

    if (section.kind === "traps") {
      section.traps.forEach((trap, index) =>
        out.push(
          entry(
            {
              href: at,
              label: trap.right,
              labelKind: "math",
              detail: `Not $${trap.wrong}$. ${trap.why}`,
              trail: where,
            },
            [],
            index,
          ),
        ),
      );
    }

    if (section.kind === "practice") {
      section.problems.forEach((problem, index) =>
        out.push(
          entry(
            {
              href: at,
              label: problem.prompt,
              labelKind: "math",
              detail: problem.hint ?? "Practice problem.",
              trail: where,
            },
            [plainMath(problem.answer)],
            index,
          ),
        ),
      );
    }
  }

  return out;
}

const SHELVES: { subject: string; base: string; lessons: Lesson[] }[] = [
  { subject: "Algebra", base: "/algebra", lessons: ALGEBRA_LESSONS },
  { subject: "Calculus", base: "/calculus", lessons: CALCULUS_LESSONS },
];

/** Every page and every piece of every lesson, as one flat list. */
export function buildIndex(): Entry[] {
  const lessons = SHELVES.flatMap((shelf) =>
    shelf.lessons.flatMap((lesson) => lessonEntries(lesson, shelf.subject, shelf.base)),
  );

  // A subject's contents list points at the lessons themselves, so only the
  // pages that are not a lesson - the converter, the calculators - are worth
  // an entry of their own. Otherwise every lesson turns up twice.
  const covered = new Set(lessons.map((entry) => entry.href));
  const pages = SUBJECTS.flatMap((subject) =>
    subject.topics
      .filter((topic) => !covered.has(topic.href))
      .map((topic, index) =>
        entry(
          {
            href: topic.href,
            label: topic.title,
            labelKind: "prose",
            detail: topic.blurb,
            trail: [subject.name],
          },
          [subject.blurb],
          index,
        ),
      ),
  );

  // Pages last: a lesson's own piece is a better answer than the card that
  // links to it, and the two would otherwise score the same.
  return [...lessons, ...pages];
}

export function terms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9^/.+-]+/)
    .filter((term) => term.length > 0);
}

function scoreTerm(entry: Entry, term: string): number {
  const label = entry.haystack.split(" · ")[0];
  if (!entry.haystack.includes(term)) return 0;

  // A word on its own beats the start of a longer one, and a word in the
  // heading beats the same word in the body.
  const whole = new RegExp(
    `(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&")}([^a-z0-9]|$)`,
  );
  let score = 1;
  if (whole.test(entry.haystack)) score += 2;
  if (label.includes(term)) score += 2;
  if (whole.test(label)) score += 3;
  return score;
}

export function search(query: string, index: Entry[], limit = 40): Hit[] {
  const wanted = terms(query);
  if (wanted.length === 0) return [];

  const hits: Hit[] = [];
  for (const entry of index) {
    let score = 0;
    let missed = false;
    for (const term of wanted) {
      const part = scoreTerm(entry, term);
      if (part === 0) {
        missed = true;
        break;
      }
      score += part;
    }
    if (!missed) hits.push({ ...entry, score: score + entry.boost });
  }

  // A stable sort, so equal scores keep the order the shelf is in.
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
