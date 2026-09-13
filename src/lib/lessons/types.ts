/**
 * The shape of an algebra lesson.
 *
 * Every lesson is plain data so the page is a renderer and nothing else, which
 * keeps a new topic a matter of writing content rather than components. Strings
 * marked "math" are the notation parsed by `lib/algebra/notation.ts`; the rest
 * is prose.
 */

/** A named law or identity, stated once so the worked steps can cite it. */
export type Rule = {
  name: string;
  /** math */
  expr: string;
  /** Plain-English reading of the rule, or when it is safe to use. */
  note?: string;
};

/**
 * One line of a solution. `expr` is where the work stands after the move;
 * `reason` is the move itself, named the way the factoring notes name it.
 */
export type Step = {
  /** math */
  expr: string;
  reason: string;
};

export type WorkedExample = {
  id: string;
  /** math — the problem as it is set */
  prompt: string;
  /** The pattern being used, e.g. "Difference of squares". */
  pattern: string;
  /** How you spot that this is the pattern, before any work is done. */
  tell: string;
  steps: Step[];
  /** math — the finished answer */
  answer: string;
  /** How to check the answer, usually by expanding back out. */
  check?: string;
};

export type Practice = {
  /** math */
  prompt: string;
  /** math */
  answer: string;
  hint?: string;
};

export type Section =
  | {
      kind: "rules";
      id: string;
      title: string;
      intro?: string;
      rules: Rule[];
      note?: string;
    }
  | {
      kind: "examples";
      id: string;
      title: string;
      intro?: string;
      examples: WorkedExample[];
    }
  | {
      kind: "checklist";
      id: string;
      title: string;
      intro?: string;
      /** Ordered moves to try, in the order they should be tried. */
      items: { label: string; detail: string }[];
    }
  | {
      kind: "traps";
      id: string;
      title: string;
      intro?: string;
      /** Each is a thing people write, why it is wrong, and what is right. */
      traps: { wrong: string; right: string; why: string }[];
    }
  | {
      kind: "practice";
      id: string;
      title: string;
      intro?: string;
      problems: Practice[];
    };

export type Lesson = {
  slug: string;
  title: string;
  /** One line for the topic index card. */
  blurb: string;
  /** Where the material comes from in the class notes. */
  source: string;
  /** The opening paragraph on the lesson page. */
  summary: string;
  sections: Section[];
};
