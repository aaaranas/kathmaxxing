/**
 * Shapes shared between the history server actions and the client that renders
 * them. They live outside the "use server" module because Next.js only lets
 * such a module export async functions.
 */

import { BASES, type Base, type ConversionValues, convertAll, isBase } from "@/lib/bases";

export type HistoryEntry = {
  id: number;
  inputValue: string;
  inputType: Base;
  createdAt: string;
  values: ConversionValues;
};

export type HistoryState =
  | { status: "ok"; entries: HistoryEntry[] }
  | { status: "unconfigured" }
  | { status: "error"; message: string };

export type SaveResult =
  | { status: "saved" }
  | { status: "skipped"; reason: "unconfigured" | "invalid" }
  | { status: "error"; message: string };

export const HISTORY_LIMIT = 50;

/**
 * Rebuild the other three bases from the stored input. Nothing derived is
 * persisted, so a row can never disagree with the converter.
 */
export function hydrate(row: {
  id: number;
  inputValue: string;
  inputType: string;
  createdAt: Date;
}): HistoryEntry | null {
  const inputType = Number(row.inputType);
  if (!isBase(inputType)) return null;

  const conversion = convertAll(row.inputValue, inputType);
  if (!conversion.ok) return null;

  return {
    id: row.id,
    inputValue: conversion.input,
    inputType,
    createdAt: row.createdAt.toISOString(),
    values: conversion.values,
  };
}

export function isStorableBase(value: unknown): value is Base {
  return BASES.includes(Number(value) as Base);
}
