/**
 * The calculator's expression grammar.
 *
 * Precedence-climbing recursive descent, small enough to read in one sitting.
 * The two rules worth stating outright, because both show up as traps in the
 * lessons: `^` binds tighter than a leading minus, so -4^2 is -(4^2); and `^`
 * is right-associative, so 2^3^2 is 2^(3^2).
 */

export type Node =
  | { kind: "number"; literal: string }
  | { kind: "constant"; name: "pi" | "e" }
  | { kind: "unary"; op: "-" | "+"; operand: Node }
  | { kind: "binary"; op: "+" | "-" | "*" | "/" | "^"; left: Node; right: Node }
  | { kind: "call"; name: string; args: Node[] }
  | { kind: "factorial"; operand: Node };

/** Arity by name. A range covers the functions that take an optional base. */
export const FUNCTIONS: Record<string, { min: number; max: number }> = {
  sqrt: { min: 1, max: 1 },
  cbrt: { min: 1, max: 1 },
  root: { min: 2, max: 2 },
  abs: { min: 1, max: 1 },
  ln: { min: 1, max: 1 },
  log: { min: 1, max: 2 },
  exp: { min: 1, max: 1 },
  sin: { min: 1, max: 1 },
  cos: { min: 1, max: 1 },
  tan: { min: 1, max: 1 },
  asin: { min: 1, max: 1 },
  acos: { min: 1, max: 1 },
  atan: { min: 1, max: 1 },
};

const CONSTANTS = new Set(["pi", "e"]);

/**
 * Fold the symbols the keypad prints, and the ones a phone keyboard likes to
 * substitute, back onto the ASCII the tokenizer reads.
 */
export function normalizeSource(input: string): string {
  return input
    .replace(/[×·✕]/g, "*")
    .replace(/[÷]/g, "/")
    .replace(/[−–—]/g, "-")
    .replace(/[π]/g, "pi")
    .replace(/[√]/g, "sqrt")
    .replace(/[∛]/g, "cbrt")
    .replace(/[,]/g, ",")
    .replace(/[[{]/g, "(")
    .replace(/[\]}]/g, ")");
}

type Token =
  | { type: "number"; literal: string; at: number }
  | { type: "name"; literal: string; at: number }
  | { type: "op"; literal: string; at: number };

const OPERATORS = new Set(["+", "-", "*", "/", "^", "(", ")", ",", "!"]);

export type ParseResult = { ok: true; node: Node } | { ok: false; message: string };

function tokenize(source: string): Token[] | string {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const char = source[i];

    if (/\s/.test(char)) {
      i += 1;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      const match = /^(?:\d+(?:\.\d*)?|\.\d+)/.exec(source.slice(i));
      if (!match) return `"${char}" is not the start of a number.`;
      tokens.push({ type: "number", literal: match[0], at: i });
      i += match[0].length;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      const match = /^[a-zA-Z]+/.exec(source.slice(i))!;
      tokens.push({ type: "name", literal: match[0].toLowerCase(), at: i });
      i += match[0].length;
      continue;
    }

    if (OPERATORS.has(char)) {
      tokens.push({ type: "op", literal: char, at: i });
      i += 1;
      continue;
    }

    return `"${char}" is not something this calculator understands.`;
  }

  return tokens;
}

class ParseError extends Error {}

export function parseExpression(input: string): ParseResult {
  const source = normalizeSource(input);
  if (source.trim().length === 0) return { ok: false, message: "" };

  const tokens = tokenize(source);
  if (typeof tokens === "string") return { ok: false, message: tokens };

  let position = 0;

  const peek = () => tokens[position];
  const nextIs = (literal: string) => {
    const token = peek();
    return token !== undefined && token.type === "op" && token.literal === literal;
  };
  const eat = (literal: string) => {
    if (!nextIs(literal)) return false;
    position += 1;
    return true;
  };
  const expect = (literal: string) => {
    if (!eat(literal)) throw new ParseError(`Expected "${literal}".`);
  };

  /** Whether what comes next could begin a value, i.e. an implied "×". */
  const startsValue = () => {
    const token = peek();
    if (token === undefined) return false;
    if (token.type === "number" || token.type === "name") return true;
    return token.type === "op" && token.literal === "(";
  };

  function parseSum(): Node {
    let left = parseProduct();
    for (;;) {
      if (eat("+")) left = { kind: "binary", op: "+", left, right: parseProduct() };
      else if (eat("-")) left = { kind: "binary", op: "-", left, right: parseProduct() };
      else return left;
    }
  }

  function parseProduct(): Node {
    let left = parseUnary();
    for (;;) {
      if (eat("*")) {
        left = { kind: "binary", op: "*", left, right: parseUnary() };
      } else if (eat("/")) {
        left = { kind: "binary", op: "/", left, right: parseUnary() };
      } else if (startsValue()) {
        // Implied multiplication, so 2(3+4) and 3pi read the way they look.
        left = { kind: "binary", op: "*", left, right: parseUnary() };
      } else {
        return left;
      }
    }
  }

  function parseUnary(): Node {
    if (eat("-")) return { kind: "unary", op: "-", operand: parseUnary() };
    if (eat("+")) return { kind: "unary", op: "+", operand: parseUnary() };
    return parsePower();
  }

  function parsePower(): Node {
    const base = parsePostfix();
    // Right-associative, and the exponent may carry its own sign.
    if (eat("^")) return { kind: "binary", op: "^", left: base, right: parseUnary() };
    return base;
  }

  function parsePostfix(): Node {
    let node = parsePrimary();
    while (eat("!")) node = { kind: "factorial", operand: node };
    return node;
  }

  function parsePrimary(): Node {
    const token = peek();
    if (token === undefined) throw new ParseError("The expression stops early.");

    if (token.type === "number") {
      position += 1;
      return { kind: "number", literal: token.literal };
    }

    if (token.type === "name") {
      position += 1;
      const name = token.literal;

      if (CONSTANTS.has(name)) return { kind: "constant", name: name as "pi" | "e" };

      const signature = FUNCTIONS[name];
      if (signature === undefined) throw new ParseError(`"${name}" is not a function here.`);

      expect("(");
      const args: Node[] = [];
      if (!nextIs(")")) {
        args.push(parseSum());
        while (eat(",")) args.push(parseSum());
      }
      expect(")");

      if (args.length < signature.min || args.length > signature.max) {
        const wanted =
          signature.min === signature.max
            ? `${signature.min}`
            : `${signature.min} or ${signature.max}`;
        throw new ParseError(`${name} takes ${wanted} argument${wanted === "1" ? "" : "s"}.`);
      }

      return { kind: "call", name, args };
    }

    if (token.literal === "(") {
      position += 1;
      const body = parseSum();
      expect(")");
      return body;
    }

    throw new ParseError(`"${token.literal}" cannot start a value.`);
  }

  try {
    const node = parseSum();
    if (position < tokens.length) {
      return { ok: false, message: `"${tokens[position].literal}" is left over at the end.` };
    }
    return { ok: true, node };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof ParseError ? error.message : "That expression could not be read.",
    };
  }
}
