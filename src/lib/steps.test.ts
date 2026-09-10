import { describe, expect, it } from "vitest";

import { convertAll } from "@/lib/bases";
import { buildSteps } from "@/lib/steps";

function stepsFor(raw: string, base: Parameters<typeof convertAll>[1]) {
  const conversion = convertAll(raw, base);
  if (!conversion.ok) throw new Error("expected a valid conversion");
  return buildSteps(conversion);
}

describe("buildSteps from a non-decimal source", () => {
  const blocks = stepsFor("B6", 16);

  it("opens by expanding the source into decimal", () => {
    const first = blocks[0];
    expect(first.kind).toBe("expansion");
    expect(first.index).toBe(1);
    if (first.kind !== "expansion") return;
    expect(first.rows).toEqual([
      { digit: "B", digitValue: 11, power: 1, weight: "16", product: "176" },
      { digit: "6", digitValue: 6, power: 0, weight: "1", product: "6" },
    ]);
    expect(first.result).toBe("182");
  });

  it("then divides decimal down into each remaining base", () => {
    const divisions = blocks.filter((block) => block.kind === "division");
    expect(divisions.map((block) => block.target)).toEqual([2, 8]);
  });

  it("closes with a grouping shortcut and numbers every block in order", () => {
    const last = blocks[blocks.length - 1];
    expect(last.kind).toBe("grouping");
    expect(blocks.map((block) => block.index)).toEqual([1, 2, 3, 4]);
  });
});

describe("buildSteps from decimal", () => {
  const blocks = stepsFor("182", 10);

  it("skips the expansion and divides straight into the other three bases", () => {
    expect(blocks.every((block) => block.kind === "division")).toBe(true);
    const divisions = blocks.filter((block) => block.kind === "division");
    expect(divisions.map((block) => block.target)).toEqual([2, 8, 16]);
  });

  it("records each division as dividend, quotient and remainder", () => {
    const binary = blocks[0];
    if (binary.kind !== "division") return;
    expect(binary.rows[0]).toEqual({
      dividend: "182",
      quotient: "91",
      remainder: 0,
      digit: "0",
    });
    expect(binary.rows).toHaveLength(8);
    expect(binary.rows[binary.rows.length - 1]).toEqual({
      dividend: "1",
      quotient: "0",
      remainder: 1,
      digit: "1",
    });
    expect(binary.result).toBe("10110110");
  });

  it("renders remainders above nine as base digits", () => {
    const hex = blocks[2];
    if (hex.kind !== "division") return;
    expect(hex.rows.map((row) => row.digit)).toEqual(["6", "B"]);
    expect(hex.result).toBe("B6");
  });
});

describe("grouping shortcuts", () => {
  it("packs binary into nibbles to reach hexadecimal", () => {
    const blocks = stepsFor("10110110", 2);
    const shortcut = blocks[blocks.length - 1];
    expect(shortcut.kind).toBe("grouping");
    if (shortcut.kind !== "grouping") return;
    expect(shortcut.bitsPerDigit).toBe(4);
    expect(shortcut.rows).toEqual([
      { group: "1011", value: 11, digit: "B" },
      { group: "0110", value: 6, digit: "6" },
    ]);
    expect(shortcut.result).toBe("B6");
  });

  it("left-pads the binary so the groups divide evenly", () => {
    const blocks = stepsFor("110110", 2);
    const shortcut = blocks[blocks.length - 1];
    if (shortcut.kind !== "grouping") return;
    expect(shortcut.padded).toBe("00110110");
    expect(shortcut.result).toBe("36");
  });

  it("expands each octal digit into three bits", () => {
    const blocks = stepsFor("266", 8);
    const shortcut = blocks[blocks.length - 1];
    if (shortcut.kind !== "grouping") return;
    expect(shortcut.bitsPerDigit).toBe(3);
    expect(shortcut.rows).toEqual([
      { group: "2", value: 2, digit: "010" },
      { group: "6", value: 6, digit: "110" },
      { group: "6", value: 6, digit: "110" },
    ]);
    expect(shortcut.result).toBe("10110110");
  });
});

describe("edge cases", () => {
  it("describes zero without inventing division rows", () => {
    const blocks = stepsFor("0", 10);
    const binary = blocks[0];
    if (binary.kind !== "division") return;
    expect(binary.rows).toHaveLength(0);
    expect(binary.result).toBe("0");
  });

  it("gives every block a stable unique id", () => {
    const ids = stepsFor("FF", 16).map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
