/**
 * A very small LaTeX-flavoured notation.
 *
 * The lessons carry a lot of formulas, and none of them are worth a rendering
 * dependency: everything the algebra section needs is fractions, radicals,
 * superscripts and subscripts. This parses that subset into a tree the `Math`
 * component walks, so authoring stays readable in the source files and the
 * output stays plain HTML in the app's one ink.
 *
 * Supported:
 *   x^2  x^{-1}  a_1        superscripts and subscripts
 *   \frac{a}{b}             stacked fraction
 *   \sqrt{x}  \sqrt[3]{x}   radical, with an optional index
 *   \text{...}              prose set in the body font
 *   {...}                   invisible grouping
 *   \cdot \times \ne ...    a handful of symbols
 *
 * Anything else is literal text, and an unknown command renders as its own
 * name so a typo in a lesson shows up on the page instead of vanishing.
 */

export type MathNode =
  | { kind: "text"; value: string }
  | { kind: "prose"; value: string }
  | { kind: "sup"; body: MathNode[] }
  | { kind: "sub"; body: MathNode[] }
  | { kind: "frac"; num: MathNode[]; den: MathNode[] }
  | { kind: "sqrt"; index: MathNode[] | null; radicand: MathNode[] }
  | { kind: "fence"; open: Delimiter; close: Delimiter; body: MathNode[] };

/** What `\left` and `\right` accept. A dot draws nothing on that side. */
export type Delimiter = "(" | "[" | "|" | ".";

const SYMBOLS: Record<string, string> = {
  cdot: "·",
  times: "×",
  div: "÷",
  pm: "±",
  mp: "∓",
  ne: "≠",
  neq: "≠",
  le: "≤",
  leq: "≤",
  ge: "≥",
  geq: "≥",
  approx: "≈",
  to: "→",
  Rightarrow: "⇒",
  iff: "⇔",
  infty: "∞",
  cup: "∪",
  cap: "∩",
  in: "∈",
  notin: "∉",
  emptyset: "∅",
  circ: "∘",
  Delta: "Δ",
  mapsto: "↦",
  dots: "…",
  ldots: "…",
  pi: "π",
  // Real space characters rather than ASCII spaces: the rendered span is
  // nowrap, so an ordinary run of whitespace collapses to nothing visible.
  quad: "\u2003",
  ",": "\u2009",
  " ": "\u00a0",
  ";": "\u2005",
  // Operator names, set upright in real LaTeX; the mono face already is.
  gcd: "gcd",
  lcm: "lcm",
  log: "log",
  ln: "ln",
  exp: "exp",
  sin: "sin",
  cos: "cos",
  tan: "tan",
  // Sizing hints from full LaTeX that this renderer has no use for; listed so
  // notation pasted in from elsewhere does not print their names.
  big: "",
  Big: "",
  // Escapes for the characters the notation itself uses.
  "{": "{",
  "}": "}",
  "[": "[",
  "]": "]",
  "^": "^",
  _: "_",
};

type Cursor = { src: string; i: number };

/** Read the command name after a backslash, leaving the cursor past it. */
function readCommand(cursor: Cursor): string {
  cursor.i += 1; // the backslash
  const rest = cursor.src.slice(cursor.i);
  const letters = /^[a-zA-Z]+/.exec(rest);
  if (letters) {
    cursor.i += letters[0].length;
    return letters[0];
  }
  // A non-letter command is always a single character, e.g. \{ or \, .
  const char = cursor.src[cursor.i] ?? "";
  cursor.i += char.length;
  return char;
}

/** The contents of a `{...}` argument. A missing brace yields nothing. */
function readBracedArg(cursor: Cursor): MathNode[] {
  while (cursor.src[cursor.i] === " ") cursor.i += 1;
  if (cursor.src[cursor.i] !== "{") return [];
  cursor.i += 1;
  const body = parseSequence(cursor, "brace");
  if (cursor.src[cursor.i] === "}") cursor.i += 1;
  return body;
}

/** The raw source of a `{...}` argument, for commands that do not parse it. */
function readRawBracedArg(cursor: Cursor): string {
  while (cursor.src[cursor.i] === " ") cursor.i += 1;
  if (cursor.src[cursor.i] !== "{") return "";
  cursor.i += 1;
  let depth = 1;
  let out = "";
  while (cursor.i < cursor.src.length) {
    const char = cursor.src[cursor.i];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        cursor.i += 1;
        return out;
      }
    }
    out += char;
    cursor.i += 1;
  }
  return out;
}

/** The optional `[...]` index on a radical. */
function readBracketArg(cursor: Cursor): MathNode[] | null {
  if (cursor.src[cursor.i] !== "[") return null;
  cursor.i += 1;
  const start = cursor.i;
  let depth = 1;
  while (cursor.i < cursor.src.length && depth > 0) {
    const char = cursor.src[cursor.i];
    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    cursor.i += 1;
  }
  const inner = cursor.src.slice(start, cursor.i - (depth === 0 ? 1 : 0));
  return parseMath(inner);
}

const DELIMITERS: Record<string, Delimiter> = {
  "(": "(",
  ")": "(",
  "[": "[",
  "]": "[",
  "|": "|",
  ".": ".",
};

/** The character after a `\left` or `\right`, normalised to its pair. */
function readDelimiter(cursor: Cursor): Delimiter {
  while (cursor.src[cursor.i] === " ") cursor.i += 1;
  const char = cursor.src[cursor.i];
  const delimiter = char === undefined ? undefined : DELIMITERS[char];
  if (delimiter === undefined) return ".";
  cursor.i += 1;
  return delimiter;
}

/** Whether the cursor is sitting on a `\right`, without consuming it. */
function atRight(cursor: Cursor): boolean {
  return /^\\right\b/.test(cursor.src.slice(cursor.i));
}

function parseCommand(cursor: Cursor): MathNode[] {
  const name = readCommand(cursor);

  // A fenced group. The brackets are drawn rather than typed, so they grow to
  // whatever is inside - which is the whole point of writing \left over "(".
  if (name === "left") {
    const open = readDelimiter(cursor);
    const body = parseSequence(cursor, "right");
    let close: Delimiter = open;
    if (atRight(cursor)) {
      readCommand(cursor);
      close = readDelimiter(cursor);
    }
    return [{ kind: "fence", open, close, body }];
  }

  // A \right with no \left to match prints the exact bracket it names - not
  // its normalised pair - which is the least surprising reading of the slip.
  if (name === "right") {
    while (cursor.src[cursor.i] === " ") cursor.i += 1;
    const char = cursor.src[cursor.i];
    if (char === undefined || DELIMITERS[char] === undefined) return [];
    cursor.i += 1;
    return [{ kind: "text", value: char === "." ? "" : char }];
  }

  if (name === "frac") {
    return [{ kind: "frac", num: readBracedArg(cursor), den: readBracedArg(cursor) }];
  }

  if (name === "sqrt") {
    const index = readBracketArg(cursor);
    return [{ kind: "sqrt", index, radicand: readBracedArg(cursor) }];
  }

  if (name === "text") {
    return [{ kind: "prose", value: readRawBracedArg(cursor) }];
  }

  const symbol = SYMBOLS[name];
  if (symbol !== undefined) return [{ kind: "text", value: symbol }];

  // Unknown: show the author what they typed rather than swallowing it.
  return [{ kind: "text", value: "\\" + name }];
}

/**
 * What a `^` or `_` applies to: a braced group, a whole command, or failing
 * both, the single next character.
 */
function parseScriptBody(cursor: Cursor): MathNode[] {
  if (cursor.src[cursor.i] === "{") return readBracedArg(cursor);
  if (cursor.src[cursor.i] === "\\") return parseCommand(cursor);
  const char = cursor.src[cursor.i];
  if (char === undefined) return [];
  cursor.i += 1;
  return [{ kind: "text", value: char }];
}

/**
 * Fold neighbouring text runs into one. A command that resolves to a symbol
 * breaks the run it sits in, and leaving those fragments separate would show up
 * both in the DOM and in the spoken description.
 */
function mergeText(nodes: MathNode[]): MathNode[] {
  const out: MathNode[] = [];
  for (const node of nodes) {
    if (node.kind !== "text") {
      out.push(node);
      continue;
    }
    if (node.value.length === 0) continue;
    const previous = out[out.length - 1];
    if (previous?.kind === "text") {
      out[out.length - 1] = { kind: "text", value: previous.value + node.value };
    } else {
      out.push(node);
    }
  }
  return out;
}

type Stop = "end" | "brace" | "right";

function parseSequence(cursor: Cursor, stop: Stop): MathNode[] {
  const out: MathNode[] = [];
  let buffer = "";

  const flush = () => {
    if (buffer.length > 0) {
      out.push({ kind: "text", value: buffer });
      buffer = "";
    }
  };

  while (cursor.i < cursor.src.length) {
    const char = cursor.src[cursor.i];

    if (char === "}") {
      if (stop === "brace") break;
      cursor.i += 1; // a stray closing brace is not worth an error
      continue;
    }

    if (char === "{") {
      flush();
      cursor.i += 1;
      out.push(...parseSequence(cursor, "brace"));
      if (cursor.src[cursor.i] === "}") cursor.i += 1;
      continue;
    }

    if (char === "^" || char === "_") {
      flush();
      cursor.i += 1;
      out.push({ kind: char === "^" ? "sup" : "sub", body: parseScriptBody(cursor) });
      continue;
    }

    if (char === "\\") {
      if (stop === "right" && atRight(cursor)) break;
      flush();
      out.push(...parseCommand(cursor));
      continue;
    }

    buffer += char;
    cursor.i += 1;
  }

  flush();
  return mergeText(out);
}

const CLOSERS: Record<Delimiter, string> = { "(": ")", "[": "]", "|": "|", ".": "" };

/**
 * Whether a fence has anything inside it that is taller than a line of text.
 * A nested fence counts, because one that survived this pass is tall itself.
 */
function needsStretching(nodes: MathNode[]): boolean {
  return nodes.some((node) => {
    switch (node.kind) {
      case "frac":
      case "sqrt":
      case "fence":
        return true;
      case "sup":
      case "sub":
        return needsStretching(node.body);
      default:
        return false;
    }
  });
}

/**
 * Turn a fence back into ordinary brackets unless it has something tall in it.
 *
 * Drawn brackets and typed ones do not look quite alike, and an expression
 * routinely holds both - `(a + b)\left(a^{2} - ab + b^{2}\right)`. Rather than
 * ask the author to judge which is which, every fence is written `\left`, and
 * only the ones that have to stretch are drawn. Bodies are handled first, so a
 * fence that contains one that flattened is judged on what is left.
 */
function simplifyFences(nodes: MathNode[]): MathNode[] {
  const out = nodes.flatMap((node): MathNode[] => {
    switch (node.kind) {
      case "fence": {
        const body = simplifyFences(node.body);
        if (needsStretching(body)) return [{ ...node, body }];
        return [
          { kind: "text", value: node.open === "." ? "" : node.open },
          ...body,
          { kind: "text", value: CLOSERS[node.close] },
        ];
      }
      case "sup":
      case "sub":
        return [{ ...node, body: simplifyFences(node.body) }];
      case "frac":
        return [{ ...node, num: simplifyFences(node.num), den: simplifyFences(node.den) }];
      case "sqrt":
        return [
          {
            ...node,
            index: node.index === null ? null : simplifyFences(node.index),
            radicand: simplifyFences(node.radicand),
          },
        ];
      default:
        return [node];
    }
  });

  return mergeText(out);
}

export function parseMath(source: string): MathNode[] {
  return simplifyFences(parseSequence({ src: source, i: 0 }, "end"));
}

/**
 * Typeset the hyphens in a run of math text as real minus signs. Kept out of
 * the parser so the tree stays a faithful record of what was authored.
 */
export function typesetText(value: string): string {
  return value.replace(/-/g, "−");
}

/**
 * Split a prose string into plain runs and `$...$` math runs, so a sentence can
 * name the thing it is talking about in the notation the reader is looking at.
 */
export type ProseRun = { math: boolean; value: string };

export function splitProse(text: string): ProseRun[] {
  // Parity comes from the split index, not from what survives the filter, so an
  // empty run between two delimiters cannot swap prose and math over.
  return text
    .split("$")
    .map((value, index) => ({ math: index % 2 === 1, value }))
    .filter((run) => run.value.length > 0);
}

/**
 * A flat reading of an expression, used for `aria-label` and for the copy the
 * screen reader gets instead of a pile of nested spans.
 */
export function describeMath(nodes: MathNode[]): string {
  const out = nodes
    .map((node) => {
      switch (node.kind) {
        case "text":
          return node.value;
        case "prose":
          return node.value;
        case "sup":
          return " to the power of " + describeMath(node.body) + " ";
        case "sub":
          return " sub " + describeMath(node.body) + " ";
        case "frac":
          return " " + describeMath(node.num) + " over " + describeMath(node.den) + " ";
        case "fence":
          return " ( " + describeMath(node.body) + " ) ";
        case "sqrt":
          return node.index === null
            ? " the square root of " + describeMath(node.radicand) + " "
            : " the " + describeMath(node.index) + "th root of " + describeMath(node.radicand) + " ";
      }
    })
    .join("");

  return out.replace(/\s+/g, " ").trim();
}
