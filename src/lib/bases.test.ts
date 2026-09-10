import { describe, expect, it } from "vitest";

import {
  BASES,
  type Base,
  baseMeta,
  convertAll,
  groupDigits,
  normalizeInput,
  parseToDecimal,
  toBase,
  validate,
} from "@/lib/bases";

describe("normalizeInput", () => {
  it("strips whitespace and separators and uppercases", () => {
    expect(normalizeInput(" 1011 0110 ", 2)).toBe("10110110");
    expect(normalizeInput("ff", 16)).toBe("FF");
    expect(normalizeInput("1_000", 10)).toBe("1000");
  });

  it("strips the conventional prefix for its own base only", () => {
    expect(normalizeInput("0b1011", 2)).toBe("1011");
    expect(normalizeInput("0xB6", 16)).toBe("B6");
    expect(normalizeInput("0o17", 8)).toBe("17");
    // 0x is not a valid octal prefix, so it must survive to fail validation
    expect(normalizeInput("0x17", 8)).toBe("0X17");
  });
});

function messageFor(raw: string, base: Base): string {
  const result = validate(raw, base);
  return result.state === "invalid" ? result.message : "";
}

describe("validate", () => {
  it("accepts an empty value as idle rather than invalid", () => {
    expect(validate("", 10)).toEqual({ state: "empty" });
    expect(validate("   ", 10)).toEqual({ state: "empty" });
  });

  it("accepts digits legal for the base", () => {
    expect(validate("1011", 2).state).toBe("valid");
    expect(validate("767", 8).state).toBe("valid");
    expect(validate("9007199254740993", 10).state).toBe("valid");
    expect(validate("deadBEEF", 16).state).toBe("valid");
  });

  it("rejects digits illegal for the base and names the offender", () => {
    const binary = validate("1021", 2);
    expect(binary.state).toBe("invalid");
    if (binary.state !== "invalid") return;
    expect(binary.message).toContain("2");

    expect(validate("18", 8).state).toBe("invalid");
    expect(validate("12A", 10).state).toBe("invalid");
    expect(validate("G1", 16).state).toBe("invalid");
  });

  it("rejects negative and fractional values with actionable copy", () => {
    expect(messageFor("-5", 10)).toMatch(/whole number/i);
    expect(messageFor("1.5", 10)).toMatch(/whole number/i);
  });
});

describe("parseToDecimal / toBase", () => {
  it("round-trips across every base", () => {
    for (const base of BASES) {
      for (const n of [0n, 1n, 7n, 255n, 4096n, 123456789n]) {
        expect(parseToDecimal(toBase(n, base), base)).toBe(n);
      }
    }
  });

  it("handles values far beyond Number.MAX_SAFE_INTEGER", () => {
    const big = 2n ** 64n;
    expect(toBase(big, 16)).toBe("10000000000000000");
    expect(parseToDecimal("10000000000000000", 16)).toBe(big);
  });

  it("ignores leading zeros", () => {
    expect(parseToDecimal("0001011", 2)).toBe(11n);
  });
});

describe("convertAll", () => {
  it("converts a binary input into the other three bases", () => {
    const result = convertAll("10110110", 2);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values).toEqual({
      2: "10110110",
      8: "266",
      10: "182",
      16: "B6",
    });
    expect(result.decimal).toBe(182n);
  });

  it("canonicalizes the source value it echoes back", () => {
    const result = convertAll(" 00ff ", 16);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values[16]).toBe("FF");
    expect(result.values[10]).toBe("255");
    expect(result.values[2]).toBe("11111111");
    expect(result.values[8]).toBe("377");
  });

  it("treats zero as valid in every base", () => {
    const result = convertAll("0", 10);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values).toEqual({ 2: "0", 8: "0", 10: "0", 16: "0" });
  });

  it("reports invalid input instead of throwing", () => {
    const result = convertAll("2", 2);
    expect(result.ok).toBe(false);
    if (result.ok || result.state !== "invalid") return;
    expect(result.message).toBeTruthy();
  });
});

describe("groupDigits", () => {
  it("groups binary into nibbles from the right", () => {
    expect(groupDigits("10110110", 2)).toBe("1011 0110");
    expect(groupDigits("110110", 2)).toBe("11 0110");
  });

  it("groups hex into bytes and decimal into thousands", () => {
    expect(groupDigits("B6", 16)).toBe("B6");
    expect(groupDigits("1FFFF", 16)).toBe("1 FF FF");
    expect(groupDigits("1234567", 10)).toBe("1 234 567");
    expect(groupDigits("266", 8)).toBe("266");
  });
});

describe("baseMeta", () => {
  it("describes every supported base", () => {
    for (const base of BASES) {
      const meta = baseMeta(base);
      expect(meta.name).toBeTruthy();
      expect(meta.abbr).toBeTruthy();
      expect(meta.digits.length).toBe(base);
    }
  });
});
