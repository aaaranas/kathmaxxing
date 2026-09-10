"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toBase } from "@/lib/bases";
import { cn } from "@/lib/utils";

/**
 * The four binary places, heaviest first. `tint` is how much of the plate
 * colour a lit cell takes, so visual weight falls off in step with place
 * value - the eights column reads heaviest, the ones column lightest.
 */
const PLACES = [
  { weight: 8, tint: 100 },
  { weight: 4, tint: 76 },
  { weight: 2, tint: 54 },
  { weight: 1, tint: 34 },
] as const;

const ROWS = Array.from({ length: 15 }, (_, index) => index + 1);

function plate(tint: number) {
  return `color-mix(in srgb, var(--plate-strong) ${tint}%, var(--paper))`;
}

export function PatternTable({ onPick }: { onPick: (binary: string) => void }) {
  return (
    <Card className="border-0 ring-1 ring-foreground/15">
      <CardHeader>
        <CardTitle>Four switches, fifteen numbers</CardTitle>
        <CardDescription>
          Every number below is just four places switched on or off. Pick any row to load it into
          the converter.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              The numbers one to fifteen written in binary, showing which of the eight, four, two
              and one places is switched on.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-line px-2 py-2 text-xs font-medium">
                  Decimal
                </th>
                {PLACES.map((place) => (
                  <th
                    key={place.weight}
                    scope="col"
                    style={{ backgroundColor: plate(place.tint) }}
                    className="tnum border-b border-line px-2 py-2 text-center font-mono text-sm font-medium"
                  >
                    {place.weight}
                  </th>
                ))}
                <th scope="col" className="border-b border-line px-2 py-2 text-xs font-medium">
                  Binary
                </th>
                <th scope="col" className="border-b border-line px-2 py-2 text-xs font-medium">
                  Hex
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((value) => {
                const binary = toBase(BigInt(value), 2).padStart(4, "0");
                return (
                  <tr
                    key={value}
                    onClick={() => onPick(binary)}
                    className="cursor-pointer transition-colors hover:bg-plate/40"
                  >
                    <th scope="row" className="border-b border-line px-2 py-1.5">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onPick(binary);
                        }}
                        aria-label={`Load ${value} into the converter`}
                        className="tnum rounded px-1 font-mono text-sm font-medium"
                      >
                        {value}
                      </button>
                    </th>
                    {PLACES.map((place) => {
                      const on = (value & place.weight) !== 0;
                      return (
                        <td
                          key={place.weight}
                          style={on ? { backgroundColor: plate(place.tint) } : undefined}
                          className={cn(
                            "tnum border-b border-line px-2 py-1.5 text-center font-mono text-sm",
                            on ? "font-semibold" : "",
                          )}
                        >
                          {on ? 1 : 0}
                        </td>
                      );
                    })}
                    <td className="tnum border-b border-line px-2 py-1.5 font-mono text-sm">
                      {binary}
                    </td>
                    <td className="tnum border-b border-line px-2 py-1.5 font-mono text-sm">
                      {toBase(BigInt(value), 16)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-line bg-desk px-4 py-3 text-sm">
          <p className="mb-2 font-medium">Read it down the columns, not across.</p>
          <ul className="flex flex-col gap-1">
            <li>The ones column flips on every single row.</li>
            <li>The twos column holds each value for two rows before flipping.</li>
            <li>The fours column holds for four rows, the eights for eight.</li>
          </ul>
          <p className="mt-2">
            Each place waits twice as long as the one to its right. That doubling is the whole of
            binary counting.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
