/**
 * The conversion engine.
 *
 * Every value moves through a BigInt so the app stays exact well past
 * Number.MAX_SAFE_INTEGER - a 64-bit hex literal is a completely ordinary
 * thing to paste into a base converter.
 */

export const BASES = [2, 8, 10, 16] as const;

export type Base = (typeof BASES)[number];

const DIGITS = "0123456789ABCDEF";

type BaseMeta = {
  base: Base;
  /** Short column label used in the readouts. */
  abbr: string;
  name: string;
  /** The conventional source-code prefix, e.g. 0x. */
  prefix: string;
  /** Legal digits, in ascending order of value. */
  digits: string;
  /** Digits per visual group, counted from the right. */
  groupSize: number;
  placeholder: string;
};

const META: Record<Base, BaseMeta> = {
  2: {
    base: 2,
    abbr: "BIN",
    name: "Binary",
    prefix: "0b",
    digits: DIGITS.slice(0, 2),
    groupSize: 4,
    placeholder: "1011 0110",
  },
  8: {
    base: 8,
    abbr: "OCT",
    name: "Octal",
    prefix: "0o",
    digits: DIGITS.slice(0, 8),
    groupSize: 3,
    placeholder: "266",
  },
  10: {
    base: 10,
    abbr: "DEC",
    name: "Decimal",
    prefix: "",
    digits: DIGITS.slice(0, 10),
    groupSize: 3,
    placeholder: "182",
  },
  16: {
    base: 16,
    abbr: "HEX",
    name: "Hexadecimal",
    prefix: "0x",
    digits: DIGITS.slice(0, 16),
    groupSize: 2,
    placeholder: "B6",
  },
};

export function baseMeta(base: Base): BaseMeta {
  return META[base];
}

export function isBase(value: unknown): value is Base {
  return BASES.includes(value as Base);
}

/**
 * Canonicalize what someone typed: drop the separators they used for
 * readability, uppercase the hex digits, and remove a prefix only when it
 * belongs to the base being read. `0x17` read as octal keeps its `0X` so that
 * validation can reject it by name rather than silently parsing `17`.
 */
export function normalizeInput(raw: string, base: Base): string {
  const collapsed = raw.replace(/[\s_,]/g, "").toUpperCase();
  const prefix = META[base].prefix.toUpperCase();
  if (prefix && collapsed.startsWith(prefix) && collapsed.length > prefix.length) {
    return collapsed.slice(prefix.length);
  }
  return collapsed;
}

export type Validation =
  { state: "empty" } | { state: "valid"; value: string } | { state: "invalid"; message: string };

export function validate(raw: string, base: Base): Validation {
  const value = normalizeInput(raw, base);
  if (value.length === 0) return { state: "empty" };

  if (value.includes("-") || value.includes(".")) {
    return {
      state: "invalid",
      message: "Enter a whole number that is zero or greater.",
    };
  }

  const { digits, name } = META[base];
  for (const char of value) {
    if (!digits.includes(char)) {
      return {
        state: "invalid",
        message: `"${char}" is not a ${name.toLowerCase()} digit. Use ${describeDigits(base)}.`,
      };
    }
  }

  return { state: "valid", value };
}

function describeDigits(base: Base): string {
  const { digits } = META[base];
  if (base === 16) return "0-9 and A-F";
  if (base === 2) return "0 and 1";
  return `${digits[0]}-${digits[digits.length - 1]}`;
}

/** Parse a value already known to be valid for its base. */
export function parseToDecimal(value: string, base: Base): bigint {
  const radix = BigInt(base);
  let total = 0n;
  for (const char of value.toUpperCase()) {
    total = total * radix + BigInt(DIGITS.indexOf(char));
  }
  return total;
}

export function toBase(value: bigint, base: Base): string {
  if (value === 0n) return "0";
  const radix = BigInt(base);
  let remaining = value;
  let out = "";
  while (remaining > 0n) {
    out = DIGITS[Number(remaining % radix)] + out;
    remaining /= radix;
  }
  return out;
}

export type ConversionValues = Record<Base, string>;

export type Conversion =
  | { ok: true; source: Base; input: string; decimal: bigint; values: ConversionValues }
  | { ok: false; state: "empty" }
  | { ok: false; state: "invalid"; message: string };

export function convertAll(raw: string, source: Base): Conversion {
  const checked = validate(raw, source);
  if (checked.state === "empty") return { ok: false, state: "empty" };
  if (checked.state === "invalid") {
    return { ok: false, state: "invalid", message: checked.message };
  }

  const decimal = parseToDecimal(checked.value, source);
  const values = Object.fromEntries(
    BASES.map((base) => [base, toBase(decimal, base)]),
  ) as ConversionValues;

  return { ok: true, source, input: checked.value, decimal, values };
}

/**
 * Space digits into the groups the base is conventionally read in - nibbles
 * for binary, bytes for hex - so a long value stays scannable.
 */
export function groupDigits(value: string, base: Base): string {
  const size = META[base].groupSize;
  const groups: string[] = [];
  for (let end = value.length; end > 0; end -= size) {
    groups.unshift(value.slice(Math.max(0, end - size), end));
  }
  return groups.join(" ");
}
