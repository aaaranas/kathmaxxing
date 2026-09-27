import { type Node, parseExpression } from "@/lib/math/parse";
import { type AngleMode, evaluate, valueToNumber } from "@/lib/math/evaluate";

/**
 * Deciding whether an answer is right, without solving anything.
 *
 * Checking is enormously easier than solving: two expressions are the same
 * function if they agree everywhere, and "everywhere" can be sampled. That
 * sidesteps a computer algebra system entirely, and it has a property no
 * string comparison has - 6/5, 1.2 and 12/10 all pass, and so does 2x + h
 * written as h + 2x.
 *
 * The cost is that this is evidence rather than proof. Agreement at a dozen
 * unrelated points is overwhelming in practice, but the verdict is reported as
 * what it is, and anything too thin to judge says so rather than guessing.
 */

export type Check =
  | { state: "correct"; detail: string }
  | { state: "incorrect"; detail: string }
  | { state: "unreadable"; detail: string }
  | { state: "unsure"; detail: string };

/**
 * Sample points chosen to be unremarkable: no integers, nothing that lands on
 * a common root or asymptote, and a spread of signs and sizes. Fixed rather
 * than random so a verdict is reproducible.
 */
const SAMPLES = [
  0.3721, 1.2837, -0.8123, 2.4531, -1.618, 3.1416, -2.2361, 0.7071, 4.1231, -3.3166, 1.9021,
  -0.4472,
];

/** How many points must agree before a verdict is worth giving. */
const MIN_SAMPLES = 5;

export function freeVariables(node: Node): string[] {
  const found = new Set<string>();
  const walk = (n: Node): void => {
    switch (n.kind) {
      case "variable":
        found.add(n.name);
        return;
      case "unary":
      case "factorial":
        return walk(n.operand);
      case "binary":
        walk(n.left);
        return walk(n.right);
      case "call":
        n.args.forEach(walk);
        return;
      default:
        return;
    }
  };
  walk(node);
  return [...found];
}

function valueIn(node: Node, scope: Record<string, number>, angle: AngleMode): number | null {
  const bound = Object.fromEntries(
    Object.entries(scope).map(([name, x]) => [name, { kind: "approx" as const, value: x }]),
  );
  const result = evaluate(node, { angle, scope: bound });
  if (!result.ok) return null;
  const value = valueToNumber(result.value);
  return Number.isFinite(value) ? value : null;
}

function valueAt(node: Node, variable: string, x: number, angle: AngleMode): number | null {
  return valueIn(node, { [variable]: x }, angle);
}

/**
 * One set of values per test point, with each letter walking the sample list
 * from a different start. Two letters therefore never hold the same value at
 * the same time, so a + b and 2a are told apart rather than both passing.
 */
function testPoints(variables: string[]): Record<string, number>[] {
  return SAMPLES.map((_, index) =>
    Object.fromEntries(
      variables.map((name, slot) => [name, SAMPLES[(index + slot * 5) % SAMPLES.length]]),
    ),
  );
}

/** `x = 1.2, y = -0.8`, for naming the point a disagreement showed up at. */
function describePoint(point: Record<string, number>): string {
  return Object.entries(point)
    .map(([name, x]) => `${name} = ${x}`)
    .join(", ");
}

/** Relative, so a disagreement of 1e-7 counts at either 1 or 10^9. */
function agrees(a: number, b: number, tolerance = 1e-6): boolean {
  return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
}

function parse(source: string, label: string): Node | { error: string } {
  const parsed = parseExpression(source);
  if (!parsed.ok) {
    return {
      error: parsed.message.length > 0 ? `${label}: ${parsed.message}` : `${label} is empty.`,
    };
  }
  return parsed.node;
}

export type CheckOptions = { angle?: AngleMode; variable?: string };

/**
 * Whether two expressions describe the same thing.
 *
 * With no letters in either, this is one comparison. With letters in them, it
 * is agreement across a dozen test points where both are defined - so `1/x`
 * and `1/x` agree, and the hole at zero counts against neither. Several
 * letters are fine: each takes its own value at each point.
 */
export function areEquivalent(mine: string, theirs: string, options: CheckOptions = {}): Check {
  const angle = options.angle ?? "rad";

  const a = parse(mine, "The first expression");
  if ("error" in a) return { state: "unreadable", detail: a.error };
  const b = parse(theirs, "Your answer");
  if ("error" in b) return { state: "unreadable", detail: b.error };

  const variables = [...new Set([...freeVariables(a), ...freeVariables(b)])];

  if (variables.length === 0) {
    const left = evaluate(a, { angle, scope: {} });
    const right = evaluate(b, { angle, scope: {} });
    if (!left.ok) return { state: "unreadable", detail: left.message };
    if (!right.ok) return { state: "unreadable", detail: right.message };
    const l = valueToNumber(left.value);
    const r = valueToNumber(right.value);
    return agrees(l, r)
      ? { state: "correct", detail: "Both come to the same number." }
      : {
          state: "incorrect",
          detail: `Those are different numbers: ${l} against ${r}.`,
        };
  }

  let compared = 0;
  for (const point of testPoints(variables)) {
    const l = valueIn(a, point, angle);
    const r = valueIn(b, point, angle);
    // Undefined on both sides is agreement about a hole, not a disagreement.
    if (l === null && r === null) continue;
    if (l === null || r === null) {
      return {
        state: "incorrect",
        detail: `At ${describePoint(point)} one of them is defined and the other is not.`,
      };
    }
    if (!agrees(l, r)) {
      return {
        state: "incorrect",
        detail: `At ${describePoint(point)} they give ${round(l)} and ${round(r)}.`,
      };
    }
    compared += 1;
  }

  if (compared < MIN_SAMPLES) {
    return {
      state: "unsure",
      detail: "There were too few points where both are defined to call it.",
    };
  }
  return {
    state: "correct",
    detail: `They agree at all ${compared} points tried.`,
  };
}

/**
 * A five-point stencil: the error falls as the fourth power of the step, so
 * this stays accurate enough that a genuine disagreement cannot hide in it.
 */
function numericDerivative(
  node: Node,
  variable: string,
  x: number,
  angle: AngleMode,
): number | null {
  const h = 1e-4 * Math.max(1, Math.abs(x));
  const points = [-2, -1, 1, 2].map((k) => valueAt(node, variable, x + k * h, angle));
  if (points.some((p) => p === null)) return null;
  const [minus2, minus1, plus1, plus2] = points as number[];
  return (-plus2 + 8 * plus1 - 8 * minus1 + minus2) / (12 * h);
}

/** Whether a claimed derivative matches the function it came from. */
export function checkDerivative(fn: string, claimed: string, options: CheckOptions = {}): Check {
  const angle = options.angle ?? "rad";

  const f = parse(fn, "The function");
  if ("error" in f) return { state: "unreadable", detail: f.error };
  const d = parse(claimed, "Your answer");
  if ("error" in d) return { state: "unreadable", detail: d.error };

  const variable = options.variable ?? freeVariables(f)[0] ?? freeVariables(d)[0] ?? "x";

  let compared = 0;
  for (const x of SAMPLES) {
    const numeric = numericDerivative(f, variable, x, angle);
    const stated = valueAt(d, variable, x, angle);
    if (numeric === null || stated === null) continue;
    // Looser than plain equivalence: a numerical derivative is itself an
    // approximation, so the tolerance has to leave room for its own error.
    if (!agrees(numeric, stated, 1e-5)) {
      return {
        state: "incorrect",
        detail: `At ${variable} = ${x} the slope is ${round(numeric)}, and your answer gives ${round(stated)}.`,
      };
    }
    compared += 1;
  }

  if (compared < MIN_SAMPLES) {
    return {
      state: "unsure",
      detail: "There were too few usable points to call it.",
    };
  }
  return {
    state: "correct",
    detail: `Matches the true slope at all ${compared} points tried.`,
  };
}

export type Approach = {
  at: number | "inf" | "-inf";
  side: "left" | "right" | "both";
};

/** What a limit answer can be. */
export type ClaimedLimit =
  | { kind: "value"; source: string }
  | { kind: "infinite"; sign: 1 | -1 }
  | { kind: "dne" };

const STEPS = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6];
const FAR = [1e3, 1e4, 1e5, 1e6];

/** The values the function takes on the way in, nearest last. */
function approachValues(
  node: Node,
  variable: string,
  approach: Approach,
  angle: AngleMode,
  side: 1 | -1,
): number[] {
  const xs =
    approach.at === "inf"
      ? FAR
      : approach.at === "-inf"
        ? FAR.map((v) => -v)
        : STEPS.map((eps) => (approach.at as number) + side * eps);

  return xs.map((x) => valueAt(node, variable, x, angle)).filter((v): v is number => v !== null);
}

/** Whether a claimed limit matches what the function actually does. */
export function checkLimit(
  fn: string,
  approach: Approach,
  claimed: ClaimedLimit,
  options: CheckOptions = {},
): Check {
  const angle = options.angle ?? "rad";

  const f = parse(fn, "The function");
  if ("error" in f) return { state: "unreadable", detail: f.error };
  const variable = options.variable ?? freeVariables(f)[0] ?? "x";

  const atInfinity = approach.at === "inf" || approach.at === "-inf";
  const sides: (1 | -1)[] =
    atInfinity || approach.side === "both" ? [1, -1] : approach.side === "left" ? [-1] : [1];
  const relevant = atInfinity ? [1 as const] : sides;

  const runs = relevant.map((side) => approachValues(f, variable, approach, angle, side));
  if (runs.some((run) => run.length < 3)) {
    return {
      state: "unsure",
      detail: "The function could not be evaluated close enough in.",
    };
  }

  const lasts = runs.map((run) => run[run.length - 1]);

  if (claimed.kind === "infinite") {
    for (const run of runs) {
      const last = run[run.length - 1];
      const previous = run[run.length - 2];
      if (Math.sign(last) !== claimed.sign) {
        return {
          state: "incorrect",
          detail: `Close in, the values are ${round(last)} — the sign does not match.`,
        };
      }
      if (Math.abs(last) <= Math.abs(previous) || Math.abs(last) < 1e3) {
        return {
          state: "incorrect",
          detail: `The values settle near ${round(last)} rather than growing without bound.`,
        };
      }
    }
    return {
      state: "correct",
      detail: `The values grow without bound, ${claimed.sign > 0 ? "positive" : "negative"}.`,
    };
  }

  if (claimed.kind === "dne") {
    if (runs.length < 2) {
      return {
        state: "unsure",
        detail: "Checking that a limit fails needs both sides, so ask for the two-sided limit.",
      };
    }
    const [left, right] = lasts;
    if (!agrees(left, right, 1e-3)) {
      return {
        state: "correct",
        detail: `The sides disagree — ${round(left)} against ${round(right)} — so there is no limit.`,
      };
    }
    return {
      state: "incorrect",
      detail: `Both sides head towards ${round(right)}, so the limit does exist.`,
    };
  }

  const target = parse(claimed.source, "Your answer");
  if ("error" in target) return { state: "unreadable", detail: target.error };
  const evaluated = evaluate(target, { angle, scope: {} });
  if (!evaluated.ok) return { state: "unreadable", detail: evaluated.message };
  const wanted = valueToNumber(evaluated.value);

  for (const run of runs) {
    const last = run[run.length - 1];
    if (!Number.isFinite(last)) {
      return {
        state: "incorrect",
        detail: "The function runs away rather than settling.",
      };
    }
    // Loose: the approach is still moving, so it lands near the answer rather
    // than on it. A wrong answer misses by far more than this.
    if (!agrees(last, wanted, 1e-3)) {
      return {
        state: "incorrect",
        detail: `Close in, the values are near ${round(last)}, not ${round(wanted)}.`,
      };
    }
  }

  return {
    state: "correct",
    detail: `The values close in on ${round(wanted)}.`,
  };
}

/**
 * Reading the point a limit is approached, so `-4`, `pi/2` and `inf` are all
 * things she can type. Anything that is not a number, or not one of the two
 * words for infinity, comes back as null for the caller to complain about.
 */
export function readApproachPoint(source: string): number | "inf" | "-inf" | null {
  const text = source
    .trim()
    .replace(/[\u2212\u2013\u2014]/g, "-")
    .replace(/\u221e/g, "inf");
  if (/^\+?inf(inity)?$/i.test(text)) return "inf";
  if (/^-inf(inity)?$/i.test(text)) return "-inf";

  const parsed = parseExpression(text);
  if (!parsed.ok) return null;
  if (freeVariables(parsed.node).length > 0) return null;
  const evaluated = evaluate(parsed.node, { angle: "rad", scope: {} });
  if (!evaluated.ok) return null;
  const value = valueToNumber(evaluated.value);
  return Number.isFinite(value) ? value : null;
}

/**
 * Reading a limit answer the way she would write it: a number, one of the
 * infinities, or some spelling of "it does not exist". Interpreting the words
 * rather than making her pick from a menu keeps the answer box a single field,
 * and what was understood is shown back to her either way.
 */
export function readLimitAnswer(source: string): ClaimedLimit | null {
  const text = source
    .trim()
    .replace(/[\u2212\u2013\u2014]/g, "-")
    .replace(/\u221e/g, "inf");
  if (text.length === 0) return null;

  const words = text.toLowerCase().replace(/[^a-z]/g, "");
  if (["dne", "doesnotexist", "doesntexist", "nolimit", "none", "undefined"].includes(words)) {
    return { kind: "dne" };
  }
  if (/^\+?inf(inity)?$/i.test(text)) return { kind: "infinite", sign: 1 };
  if (/^-inf(inity)?$/i.test(text)) return { kind: "infinite", sign: -1 };
  return { kind: "value", source: text };
}

/** The claim in words, so she can see it was read the way she meant it. */
export function describeLimitAnswer(claimed: ClaimedLimit): string {
  if (claimed.kind === "dne") return "the limit does not exist";
  if (claimed.kind === "infinite") {
    return claimed.sign > 0 ? "grows without bound, positive" : "grows without bound, negative";
  }
  return `settles on ${claimed.source}`;
}

function round(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  if (Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-4 && value !== 0)) {
    return value.toExponential(3);
  }
  return String(Number(value.toPrecision(6)));
}
