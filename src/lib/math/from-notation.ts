import { type MathNode, parseMath } from "@/lib/math/notation";
import { parseExpression } from "@/lib/math/parse";

/**
 * Notation back into something the calculator can read.
 *
 * The lessons store their answers as notation, because that is what they are
 * for - `\frac{3}{10}` is written to be read. Marking a typed answer against
 * one of them needs the other direction, so this walks the same tree the
 * renderer draws and writes it out as calculator source.
 *
 * It refuses more than it accepts, on purpose. An answer that is a sentence,
 * or a statement with an equals sign in it, or anything with a symbol the
 * calculator has no idea about, comes back as null and the lesson falls back
 * to showing the answer rather than marking one.
 */

/** Characters that mean something else in calculator source. */
const CHARACTERS: Record<string, string> = {
  "·": "*", // ·
  "×": "*", // ×
  "÷": "/", // ÷
  "−": "-", // −
  "–": "-",
  "—": "-",
  π: "pi", // π
  // The several widths of space the notation uses for spacing.
  " ": " ",
  " ": " ",
  " ": " ",
  " ": " ",
};

/** Everything else that may pass through untouched. */
const PLAIN = /[0-9a-zA-Z+\-*/^(). ]/;

function convertText(value: string): string | null {
  let out = "";
  // Bars come through as plain text, because short contents never need a
  // drawn fence. They pair off left to right into the function that means
  // them; anything that does not pair up fails the parse at the end.
  let openBar = true;
  for (const character of value) {
    if (character === "|") {
      out += openBar ? "abs(" : ")";
      openBar = !openBar;
      continue;
    }
    const mapped = CHARACTERS[character];
    if (mapped !== undefined) {
      out += mapped;
      continue;
    }
    if (!PLAIN.test(character)) return null;
    out += character;
  }
  return out;
}

function convertNodes(nodes: MathNode[]): string | null {
  const pieces: string[] = [];
  for (const node of nodes) {
    const piece = convertNode(node);
    if (piece === null) return null;
    pieces.push(piece);
  }
  // Joined with a space, because two pieces written side by side may each end
  // and begin with a letter - z and root(4, x) - and run together into a name
  // that means nothing. Spacing is ignored by the grammar everywhere else, and
  // juxtaposition still multiplies.
  return pieces.join(" ");
}

function convertNode(node: MathNode): string | null {
  switch (node.kind) {
    case "text":
      return convertText(node.value);

    // A sentence is not an expression, and neither is anything written under a
    // letter: there is no subscript in the calculator's grammar.
    case "prose":
    case "sub":
      return null;

    case "sup": {
      const body = convertNodes(node.body);
      return body === null ? null : `^(${body})`;
    }

    case "frac": {
      const num = convertNodes(node.num);
      const den = convertNodes(node.den);
      if (num === null || den === null) return null;
      return `((${num})/(${den}))`;
    }

    case "sqrt": {
      const radicand = convertNodes(node.radicand);
      if (radicand === null) return null;
      if (node.index === null) return `sqrt(${radicand})`;
      const index = convertNodes(node.index);
      return index === null ? null : `root(${index},${radicand})`;
    }

    case "fence": {
      const body = convertNodes(node.body);
      if (body === null) return null;
      // Bars are the only fence that does arithmetic rather than grouping.
      return node.open === "|" || node.close === "|" ? `abs(${body})` : `(${body})`;
    }
  }
}

/**
 * Functions written the way they are said, with no brackets: `\cos x` rather
 * than `\cos(x)`. Notation allows it and the calculator's grammar does not,
 * so the brackets go back in around the one thing the name applies to.
 */
const BARE_CALL =
  /\b(sqrt|cbrt|abs|ln|log|exp|sin|cos|tan|asin|acos|atan)\s+([a-z]|\d+(?:\.\d+)?)(?![a-z0-9(.])/g;

/**
 * An answer usually arrives with its name in front: `f'(x) = 12x^{2}`, or
 * `y = 3x - 5`, or `m = 3`. The name is not part of the answer, and she should
 * be able to write hers with or without it, so a single leading equals sign is
 * treated as a label and everything after it is the answer proper.
 */
export function afterLabel(source: string): string {
  const parts = source.split("=");
  return parts.length === 2 ? parts[1].trim() : source.trim();
}

export function notationToExpression(source: string): string | null {
  const built = convertNodes(parseMath(afterLabel(source)));
  if (built === null || built.trim().length === 0) return null;
  const bracketed = built.replace(BARE_CALL, "$1($2)");
  // The last word on whether this is an expression belongs to the parser that
  // will be asked to read it, not to the walk above.
  return parseExpression(bracketed).ok ? bracketed : null;
}
