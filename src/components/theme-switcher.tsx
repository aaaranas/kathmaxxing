"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Palette } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_THEME, THEMES, type ThemeId } from "@/lib/themes";

/** The hydration flag never changes after mount, so there is nothing to watch. */
function subscribeToNothing() {
  return () => {};
}

function Swatch({ fill, edge }: { fill: string; edge: string }) {
  return (
    <span
      aria-hidden
      className="size-3.5 shrink-0 rounded-full"
      style={{ backgroundColor: fill, boxShadow: `inset 0 0 0 1px ${edge}` }}
    />
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // The stored theme is unknown during SSR, so render the default until the
  // client has hydrated. Reading "am I hydrated" through useSyncExternalStore
  // keeps the swap out of an effect, so it cannot cascade a second render.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const current = (mounted ? theme : DEFAULT_THEME) as ThemeId;
  const active = THEMES.find((option) => option.id === current) ?? THEMES[0];

  return (
    <Select value={active.id} onValueChange={(next) => setTheme(next)}>
      <SelectTrigger
        aria-label="Paper"
        className="h-9 w-[10.5rem] gap-2 border-line bg-paper text-sm text-foreground"
      >
        <Palette aria-hidden className="size-4 shrink-0" />
        <SelectValue>
          <span className="flex items-center gap-2">
            <Swatch fill={active.swatch} edge={active.edge} />
            {active.name}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="border-line bg-paper">
        {THEMES.map((option) => (
          <SelectItem key={option.id} value={option.id} className="text-foreground">
            <span className="flex items-center gap-2.5">
              <Swatch fill={option.swatch} edge={option.edge} />
              <span>{option.name}</span>
              <span className="text-xs">{option.note}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
