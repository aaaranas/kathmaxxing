import type { Node } from "@/lib/math/parse";
import {
  type Rational,
  ONE,
  add,
  bitLength,
  divide,
  exactRoot,
  fromDecimalString,
  integerPower,
  isInteger,
  isNegative,
  isZero,
  multiply,
  negate,
  rational,
  subtract,
  toNumber,
} from "@/lib/math/rational";

export type AngleMode = "rad" | "deg";

/**
 * A value is exact until something genuinely irrational happens to it. Once it
 * goes approximate it stays that way, which is why the display can say plainly
 * whether an answer is the real thing or a reading of it.
 */
export type Value =
  | { kind: "exact"; value: Rational }
  | { kind: "approx"; value: number };

export type Evaluation = { ok: true; value: Value } | { ok: false; message: string };

/**
 * What the expression is evaluated against: the angle mode, and any variables
 * that have a value. The scientific calculator passes no variables, so `x + 1`
 * is reported rather than guessed at; the grapher passes one x per sample.
 */
export type Context = { angle: AngleMode; scope: Record<string, Value> };

export const EMPTY_CONTEXT: Context = { angle: "rad", scope: {} };

/** Beyond this an exact power is a wall of digits nobody asked for. */
const MAX_EXACT_BITS = 40000;
const MAX_FACTORIAL = 2000;

function exact(value: Rational): Evaluation {
  return { ok: true, value: { kind: "exact", value } };
}

function approx(value: number): Evaluation {
  if (Number.isNaN(value)) return { ok: false, message: "That is not a real number." };
  if (!Number.isFinite(value)) return { ok: false, message: "That result is too large to give." };
  return { ok: true, value: { kind: "approx", value } };
}

export function valueToNumber(value: Value): number {
  return value.kind === "exact" ? toNumber(value.value) : value.value;
}

export function evaluate(node: Node, context: Context = EMPTY_CONTEXT): Evaluation {
  switch (node.kind) {
    case "number":
      return exact(fromDecimalString(node.literal));

    case "constant":
      return approx(node.name === "pi" ? Math.PI : Math.E);

    case "variable": {
      const bound = context.scope[node.name];
      if (bound === undefined) {
        return { ok: false, message: `"${node.name}" has no value here.` };
      }
      return { ok: true, value: bound };
    }

    case "unary": {
      const operand = evaluate(node.operand, context);
      if (!operand.ok) return operand;
      if (node.op === "+") return operand;
      return operand.value.kind === "exact"
        ? exact(negate(operand.value.value))
        : approx(-operand.value.value);
    }

    case "binary":
      return evaluateBinary(node, context);

    case "factorial":
      return evaluateFactorial(node, context);

    case "call":
      return evaluateCall(node, context);
  }
}

function evaluateBinary(
  node: Extract<Node, { kind: "binary" }>,
  context: Context,
): Evaluation {
  const left = evaluate(node.left, context);
  if (!left.ok) return left;
  const right = evaluate(node.right, context);
  if (!right.ok) return right;

  if (node.op === "^") return power(left.value, right.value);

  const bothExact = left.value.kind === "exact" && right.value.kind === "exact";

  if (bothExact) {
    const a = (left.value as { value: Rational }).value;
    const b = (right.value as { value: Rational }).value;
    switch (node.op) {
      case "+":
        return exact(add(a, b));
      case "-":
        return exact(subtract(a, b));
      case "*":
        return exact(multiply(a, b));
      case "/": {
        const quotient = divide(a, b);
        if (quotient === null) return { ok: false, message: "That divides by zero." };
        return exact(quotient);
      }
    }
  }

  const a = valueToNumber(left.value);
  const b = valueToNumber(right.value);
  switch (node.op) {
    case "+":
      return approx(a + b);
    case "-":
      return approx(a - b);
    case "*":
      return approx(a * b);
    case "/":
      if (b === 0) return { ok: false, message: "That divides by zero." };
      return approx(a / b);
  }
}

/**
 * Exact wherever the maths allows it: an integer exponent always, and a
 * fractional one whenever the root comes out whole. `(-27/8)^(1/3)` is -3/2
 * here, not a floating-point NaN, because the root is taken before the power
 * and an odd index keeps the sign.
 */
function power(base: Value, exponent: Value): Evaluation {
  if (base.kind === "exact" && exponent.kind === "exact") {
    const b = base.value;
    const e = exponent.value;

    if (isZero(b) && isNegative(e)) {
      return { ok: false, message: "Zero to a negative power divides by zero." };
    }

    if (isInteger(e)) {
      const magnitude = e.n < 0n ? -e.n : e.n;
      if (bitLength(b) * Number(magnitude) <= MAX_EXACT_BITS) {
        const result = integerPower(b, e.n);
        if (result !== null) return exact(result);
      }
    } else {
      const index = Number(e.d);
      if (isNegative(b) && index % 2 === 0) {
        return { ok: false, message: "An even root of a negative number is not a real number." };
      }
      const root = exactRoot(b, index);
      if (root !== null) {
        const magnitude = e.n < 0n ? -e.n : e.n;
        if (bitLength(root) * Number(magnitude) <= MAX_EXACT_BITS) {
          const result = integerPower(root, e.n);
          if (result !== null) return exact(result);
        }
      }
    }
  }

  const b = valueToNumber(base);
  const e = valueToNumber(exponent);
  if (b < 0 && !Number.isInteger(e)) {
    return { ok: false, message: "An even root of a negative number is not a real number." };
  }
  if (b === 0 && e < 0) return { ok: false, message: "Zero to a negative power divides by zero." };
  return approx(Math.pow(b, e));
}

function evaluateFactorial(
  node: Extract<Node, { kind: "factorial" }>,
  context: Context,
): Evaluation {
  const operand = evaluate(node.operand, context);
  if (!operand.ok) return operand;

  if (operand.value.kind !== "exact" || !isInteger(operand.value.value)) {
    return { ok: false, message: "A factorial needs a whole number." };
  }

  const n = operand.value.value.n;
  if (n < 0n) return { ok: false, message: "A factorial needs a number that is zero or more." };
  if (n > BigInt(MAX_FACTORIAL)) {
    return { ok: false, message: `Factorials above ${MAX_FACTORIAL} are too large to give.` };
  }

  let total = 1n;
  for (let i = 2n; i <= n; i += 1n) total *= i;
  return exact(rational(total));
}

function evaluateCall(node: Extract<Node, { kind: "call" }>, context: Context): Evaluation {
  const args: Value[] = [];
  for (const argument of node.args) {
    const result = evaluate(argument, context);
    if (!result.ok) return result;
    args.push(result.value);
  }

  const [first, second] = args;

  switch (node.name) {
    case "sqrt":
      return power(first, { kind: "exact", value: rational(1n, 2n) });
    case "cbrt":
      return power(first, { kind: "exact", value: rational(1n, 3n) });
    case "root": {
      // root(n, x): the index comes first, the way it is read aloud.
      if (first.kind !== "exact" || !isInteger(first.value) || isZero(first.value)) {
        return { ok: false, message: "A root needs a whole number index." };
      }
      const reciprocal = divide(ONE, first.value);
      if (reciprocal === null) return { ok: false, message: "A root needs a non-zero index." };
      return power(second, { kind: "exact", value: reciprocal });
    }
    case "abs":
      return first.kind === "exact"
        ? exact(isNegative(first.value) ? negate(first.value) : first.value)
        : approx(Math.abs(first.value));
    case "ln":
      return logarithm(valueToNumber(first), Math.E);
    case "log":
      return second === undefined
        ? logarithm(valueToNumber(first), 10)
        : logarithm(valueToNumber(second), valueToNumber(first));
    case "exp":
      return approx(Math.exp(valueToNumber(first)));
    case "sin":
    case "cos":
    case "tan":
      return trigonometry(node.name, valueToNumber(first), context.angle);
    case "asin":
    case "acos":
    case "atan":
      return inverseTrigonometry(node.name, valueToNumber(first), context.angle);
  }

  return { ok: false, message: `"${node.name}" is not a function here.` };
}

function logarithm(value: number, base: number): Evaluation {
  if (value <= 0) return { ok: false, message: "A logarithm needs a positive number." };
  if (base <= 0 || base === 1) return { ok: false, message: "That is not a usable log base." };
  return approx(Math.log(value) / Math.log(base));
}

function toRadians(value: number, mode: AngleMode): number {
  return mode === "deg" ? (value * Math.PI) / 180 : value;
}

function trigonometry(name: "sin" | "cos" | "tan", value: number, mode: AngleMode): Evaluation {
  const angle = toRadians(value, mode);
  if (name === "sin") return approx(Math.sin(angle));
  if (name === "cos") return approx(Math.cos(angle));

  // tan is unbounded at the odd multiples of a right angle. Math.tan returns a
  // very large finite number there rather than Infinity, so it is caught here.
  const cosine = Math.cos(angle);
  if (Math.abs(cosine) < 1e-14) return { ok: false, message: "The tangent is undefined there." };
  return approx(Math.tan(angle));
}

function inverseTrigonometry(
  name: "asin" | "acos" | "atan",
  value: number,
  mode: AngleMode,
): Evaluation {
  if ((name === "asin" || name === "acos") && (value < -1 || value > 1)) {
    return { ok: false, message: `${name} needs a number between −1 and 1.` };
  }
  const radians = name === "asin" ? Math.asin(value) : name === "acos" ? Math.acos(value) : Math.atan(value);
  return approx(mode === "deg" ? (radians * 180) / Math.PI : radians);
}
