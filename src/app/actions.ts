"use server";

import { type Base, convertAll, isBase } from "@/lib/bases";
import { getPrisma } from "@/lib/db";
import { HISTORY_LIMIT, type HistoryState, type SaveResult, hydrate } from "@/lib/history";

/** Long enough for a 512-bit value, short enough to be a bad payload. */
const MAX_INPUT_LENGTH = 256;

/**
 * Record a value the user actually settled on. The converter calls this once a
 * value stops changing, not on every keystroke, so the table reads like a list
 * of decisions rather than a keylog.
 */
export async function saveConversion(rawInput: string, rawBase: number): Promise<SaveResult> {
  if (typeof rawInput !== "string" || rawInput.length > MAX_INPUT_LENGTH) {
    return { status: "skipped", reason: "invalid" };
  }
  if (!isBase(rawBase)) {
    return { status: "skipped", reason: "invalid" };
  }

  const base: Base = rawBase;
  const conversion = convertAll(rawInput, base);
  if (!conversion.ok) {
    return { status: "skipped", reason: "invalid" };
  }

  const prisma = getPrisma();
  if (!prisma) return { status: "skipped", reason: "unconfigured" };

  try {
    // Collapse a repeat of the value already at the top of the list. Tabbing
    // away and back shouldn't leave a run of identical rows.
    const latest = await prisma.conversion.findFirst({
      orderBy: { createdAt: "desc" },
      select: { inputValue: true, inputType: true },
    });

    if (latest?.inputValue === conversion.input && latest.inputType === String(base)) {
      return { status: "saved" };
    }

    await prisma.conversion.create({
      data: { inputValue: conversion.input, inputType: String(base) },
    });

    return { status: "saved" };
  } catch (error) {
    console.error("[kathmaxxing] failed to save conversion", error);
    return { status: "error", message: "That conversion could not be saved." };
  }
}

/** Read the most recent conversions, newest first. */
export async function loadHistory(): Promise<HistoryState> {
  const prisma = getPrisma();
  if (!prisma) return { status: "unconfigured" };

  try {
    const rows = await prisma.conversion.findMany({
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
    });

    return {
      status: "ok",
      entries: rows
        .map(hydrate)
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    };
  } catch (error) {
    console.error("[kathmaxxing] failed to load history", error);
    return {
      status: "error",
      message: "The history could not be reached. Check the database connection and try again.",
    };
  }
}
