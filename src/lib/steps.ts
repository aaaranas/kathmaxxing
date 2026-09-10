/**
 * Turns a finished conversion into the worked example a student would write
 * out by hand: expand the source into decimal, divide decimal down into each
 * remaining base, then show the grouping shortcut that skips the arithmetic.
 */

import { BASES, type Base, type Conversion, baseMeta, parseToDecimal, toBase } from "@/lib/bases";

export type ExpansionRow = {
  digit: string;
  digitValue: number;
  power: number;
  weight: string;
  product: string;
};

export type DivisionRow = {
  dividend: string;
  quotient: string;
  remainder: number;
  digit: string;
};

export type GroupingRow = {
  group: string;
  value: number;
  digit: string;
};

type BlockBase = {
  id: string;
  index: number;
  title: string;
  method: string;
  summary: string;
  result: string;
};

export type ExpansionBlock = BlockBase & {
  kind: "expansion";
  source: Base;
  rows: ExpansionRow[];
};

export type DivisionBlock = BlockBase & {
  kind: "division";
  target: Base;
  rows: DivisionRow[];
};

export type GroupingBlock = BlockBase & {
  kind: "grouping";
  from: Base;
  to: Base;
  bitsPerDigit: number;
  padded: string;
  rows: GroupingRow[];
};

export type StepBlock = ExpansionBlock | DivisionBlock | GroupingBlock;

export function buildSteps(conversion: Extract<Conversion, { ok: true }>): StepBlock[] {
  const { source, input, decimal, values } = conversion;
  const blocks: StepBlock[] = [];
  let index = 0;
  const next = () => (index += 1);

  if (source !== 10) {
    blocks.push(expansionBlock(next(), input, source, values[10]));
  }

  for (const target of BASES) {
    if (target === source || target === 10) continue;
    blocks.push(divisionBlock(next(), decimal, target, values[target]));
  }

  // Decimal has no bit-grouping shortcut worth showing; the divisions are it.
  if (source !== 10) {
    blocks.push(shortcutBlock(next(), input, source, values));
  }

  return blocks;
}

function expansionBlock(
  index: number,
  input: string,
  source: Base,
  result: string,
): ExpansionBlock {
  const meta = baseMeta(source);
  const digits = [...input];
  const rows = digits.map((digit, position) => {
    const power = digits.length - 1 - position;
    const digitValue = parseToDecimal(digit, 16 as Base);
    const weight = BigInt(source) ** BigInt(power);
    return {
      digit,
      digitValue: Number(digitValue),
      power,
      weight: weight.toString(),
      product: (digitValue * weight).toString(),
    };
  });

  return {
    kind: "expansion",
    id: `expand-${source}`,
    index,
    source,
    title: `${meta.name} to decimal`,
    method: "Positional expansion",
    summary: `Each digit is worth its face value times ${source} raised to its place. Add the products together.`,
    rows,
    result,
  };
}

function divisionBlock(
  index: number,
  decimal: bigint,
  target: Base,
  result: string,
): DivisionBlock {
  const meta = baseMeta(target);
  const radix = BigInt(target);
  const rows: DivisionRow[] = [];
  let remaining = decimal;

  while (remaining > 0n) {
    const quotient = remaining / radix;
    const remainder = Number(remaining % radix);
    rows.push({
      dividend: remaining.toString(),
      quotient: quotient.toString(),
      remainder,
      digit: toBase(BigInt(remainder), target),
    });
    remaining = quotient;
  }

  return {
    kind: "division",
    id: `divide-${target}`,
    index,
    target,
    title: `Decimal to ${meta.name.toLowerCase()}`,
    method: `Repeated division by ${target}`,
    summary:
      rows.length === 0
        ? "Zero is zero in every base, so there is nothing to divide."
        : `Divide by ${target} until the quotient reaches zero, then read the remainders from the bottom up.`,
    rows,
    result,
  };
}

function shortcutBlock(
  index: number,
  input: string,
  source: Base,
  values: Record<Base, string>,
): GroupingBlock {
  // Binary reads outward into hex; octal and hex read inward into binary.
  // Either way the trick is the same: 2^3 and 2^4 divide the bit string evenly.
  if (source === 2) {
    const bitsPerDigit = 4;
    const padded = padLeft(input, bitsPerDigit);
    const rows: GroupingRow[] = [];
    for (let at = 0; at < padded.length; at += bitsPerDigit) {
      const group = padded.slice(at, at + bitsPerDigit);
      const value = Number(parseToDecimal(group, 2));
      rows.push({ group, value, digit: toBase(BigInt(value), 16) });
    }
    return {
      kind: "grouping",
      id: "shortcut-2-16",
      index,
      from: 2,
      to: 16,
      bitsPerDigit,
      padded,
      title: "Binary to hexadecimal without the arithmetic",
      method: "Group the bits in fours",
      summary:
        "Four bits hold exactly one hex digit, so slice the binary into nibbles from the right and read each one off.",
      rows,
      result: values[16],
    };
  }

  const bitsPerDigit = source === 8 ? 3 : 4;
  const meta = baseMeta(source);
  const rows: GroupingRow[] = [...input].map((digit) => {
    const value = Number(parseToDecimal(digit, source));
    return {
      group: digit,
      value,
      digit: toBase(BigInt(value), 2).padStart(bitsPerDigit, "0"),
    };
  });

  return {
    kind: "grouping",
    id: `shortcut-${source}-2`,
    index,
    from: source,
    to: 2,
    bitsPerDigit,
    padded: input,
    title: `${meta.name} to binary without the arithmetic`,
    method: `Expand each digit into ${bitsPerDigit} bits`,
    summary: `Every ${meta.name.toLowerCase()} digit maps onto exactly ${bitsPerDigit} bits. Write them out in order and drop any leading zeros.`,
    rows,
    result: values[2],
  };
}

function padLeft(bits: string, size: number): string {
  const overflow = bits.length % size;
  return overflow === 0 ? bits : "0".repeat(size - overflow) + bits;
}
