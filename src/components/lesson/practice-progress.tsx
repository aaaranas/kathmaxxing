"use client";

import { useSyncExternalStore } from "react";
import { Check } from "lucide-react";

import { emptyRecord, recordSnapshot, subscribeRecord, summarize } from "@/lib/practice/record";

/**
 * How a lesson's practice stands, on the card that leads to it.
 *
 * Nothing shows until she has marked something: an untouched lesson should
 * look like an untouched lesson, not like one she is behind on. The record is
 * on her device, so this renders empty on the server and fills in right after
 * hydration.
 */
export function PracticeProgress({ keys }: { keys: string[] }) {
  const record = useSyncExternalStore(subscribeRecord, recordSnapshot, emptyRecord);
  const { attempted, solved } = summarize(record, keys);

  if (attempted === 0) return null;

  return (
    <span className="mt-0.5 flex items-center gap-1.5 text-xs">
      <Check aria-hidden className="size-3 shrink-0" />
      {solved} of {keys.length} practice right
    </span>
  );
}
