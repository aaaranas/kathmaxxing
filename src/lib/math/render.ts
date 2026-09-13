import type { Node } from "@/lib/math/parse";
import { type Value } from "@/lib/math/evaluate";
import { isInteger, isNegative, negate } from "@/lib/math/rational";

/**
 * Turn a parsed expression back into the notation the lessons are set in.
 *
 * This is the calculator's own "shows its working": typing -4^2 draws
 * −4² and typing (-4)^2 draws (−4)², so the reading the calculator took is on
 * the page before the answer is. Division becomes a stacked fraction for the
 * same reason - 1/2+1 cannot be mistaken for 1/(2+1) once it is drawn.
 */

const PRECEDENCE: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 4 };
const UNARY_PRECEDENCE = 3;

function precedenceOf(node: Node): number {
  switch (node.kind) {
    case "binary":
      return PRECEDENCE[node.op];
    case "unary":
      return UNARY_PRECEDENCE;
    default:
      return 10;
  }
}

/** Bracket a child only where dropping the brackets would change the reading. */
function wrap(node: Node, minimum: number): string {
  const rendered = toNotation(node);
  return precedenceOf(node) < minimum ? `\\left(${rendered}\\right)` : rendered;
}

export function toNotation(node: Node): string {
  switch (node.kind) {
    case "number":
      return node.literal;

    case "constant":
      return node.name === "pi" ? "\\pi" : "e";

    case "variable":
      return node.name;

    case "unary":
      return (node.op === "-" ? "-" : "") + wrap(node.operand, UNARY_PRECEDENCE);

    case "factorial":
      return wrap(node.operand, 10) + "!";

    case "binary": {
      if (node.op === "/") {
        // A fraction brackets its own parts, so neither side needs wrapping.
        return `\\frac{${toNotation(node.left)}}{${toNotation(node.right)}}`;
      }
      if (node.op === "^") {
        // The exponent is set apart by being raised, so only the base can be
        // ambiguous. A right-associative chain keeps its shape without brackets.
        return `${wrap(node.left, 10)}^{${toNotation(node.right)}}`;
      }
      const level = PRECEDENCE[node.op];
      const symbol = node.op === "*" ? " \\cdot " : ` ${node.op} `;
      // The right side of a subtraction needs brackets one level tighter,
      // because a - (b - c) is not a - b - c.
      const rightMinimum = node.op === "-" ? level + 1 : level;
      return wrap(node.left, level) + symbol + wrap(node.right, rightMinimum);
    }

    case "call": {
      const [first, second] = node.args;
      if (node.name === "sqrt") return `\\sqrt{${toNotation(first)}}`;
      if (node.name === "cbrt") return `\\sqrt[3]{${toNotation(first)}}`;
      if (node.name === "root") return `\\sqrt[${toNotation(first)}]{${toNotation(second)}}`;
      if (node.name === "abs") return `\\left|${toNotation(first)}\\right|`;
      if (node.name === "log" && second !== undefined) {
        return `\\log_{${toNotation(first)}}\\left(${toNotation(second)}\\right)`;
      }
      const args = node.args.map(toNotation).join(", ");
      return `${node.name}\\left(${args}\\right)`;
    }
  }
}

/** The answer, drawn as a fraction when it is one. */
export function valueToNotation(value: Value): string {
  if (value.kind === "approx") return String(value.value);
  const exact = value.value;
  if (isInteger(exact)) return exact.n.toString();
  const positive = isNegative(exact) ? negate(exact) : exact;
  const sign = isNegative(exact) ? "-" : "";
  return `${sign}\\frac{${positive.n}}{${positive.d}}`;
}
