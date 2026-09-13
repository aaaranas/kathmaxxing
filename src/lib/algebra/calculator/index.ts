import { type AngleMode, type Value, evaluate } from "@/lib/algebra/calculator/evaluate";
import { parseExpression } from "@/lib/algebra/calculator/parse";
import { toNotation, valueToNotation } from "@/lib/algebra/calculator/render";
import { isInteger, toDecimalString } from "@/lib/algebra/calculator/rational";

export type { AngleMode, Value } from "@/lib/algebra/calculator/evaluate";

export type Calculation =
  | { state: "empty" }
  | { state: "unreadable"; message: string }
  | { state: "failed"; reading: string; message: string }
  | {
      state: "ok";
      /** The expression as the calculator read it, in lesson notation. */
      reading: string;
      /** The answer, in lesson notation. */
      answer: string;
      /** A decimal reading, present only when it says something the answer does not. */
      decimal: string | null;
      exact: boolean;
      value: Value;
    };

/**
 * Read an expression, say how it was read, and answer it - exactly wherever the
 * arithmetic allows.
 */
export function calculate(input: string, mode: AngleMode = "rad"): Calculation {
  if (input.trim().length === 0) return { state: "empty" };

  const parsed = parseExpression(input);
  if (!parsed.ok) {
    return parsed.message.length === 0
      ? { state: "empty" }
      : { state: "unreadable", message: parsed.message };
  }

  const reading = toNotation(parsed.node);
  const result = evaluate(parsed.node, mode);
  if (!result.ok) return { state: "failed", reading, message: result.message };

  const value = result.value;
  const exact = value.kind === "exact";
  const decimal =
    value.kind === "exact"
      ? isInteger(value.value)
        ? null // A whole number is already its own decimal.
        : toDecimalString(value.value)
      : null;

  return {
    state: "ok",
    reading,
    answer: exact ? valueToNotation(value) : formatApprox(value.value as number),
    decimal,
    exact,
    value,
  };
}

function formatApprox(value: number): string {
  if (Number.isInteger(value) && Math.abs(value) < 1e15) return String(value);
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && (magnitude < 1e-7 || magnitude >= 1e15)) {
    return value.toExponential(9).replace(/\.?0+e/, "e");
  }
  return trimZeros(value.toPrecision(12));
}

function trimZeros(text: string): string {
  if (!text.includes(".")) return text;
  return text.replace(/\.?0+$/, "");
}
