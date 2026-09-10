import type { LucideIcon } from "lucide-react";
import { Circle, Leaf, Moon, Mountain, Sun } from "lucide-react";

/**
 * Themes are paper stocks. `swatch` mirrors the --paper value in globals.css
 * so the picker can preview a stock that is not currently mounted.
 */
export type ThemeId = "light" | "graphite" | "stone" | "lilac" | "mint";

export type ThemeOption = {
  id: ThemeId;
  name: string;
  note: string;
  swatch: string;
  edge: string;
  icon: LucideIcon;
};

export const THEMES: ThemeOption[] = [
  {
    id: "light",
    name: "Light",
    note: "Bright white",
    swatch: "#ffffff",
    edge: "#c5ccd6",
    icon: Sun,
  },
  {
    id: "graphite",
    name: "Graphite",
    note: "Soft dark grey",
    swatch: "#a5abb2",
    edge: "#6d737a",
    icon: Moon,
  },
  {
    id: "stone",
    name: "Stone",
    note: "Warm neutral",
    swatch: "#f0ece4",
    edge: "#bcb3a2",
    icon: Mountain,
  },
  { id: "lilac", name: "Lilac", note: "Pastel", swatch: "#f7f3fd", edge: "#c6b8e2", icon: Circle },
  { id: "mint", name: "Mint", note: "Pastel", swatch: "#eff7f2", edge: "#a6c9b9", icon: Leaf },
];

export const THEME_IDS = THEMES.map((theme) => theme.id);
export const DEFAULT_THEME: ThemeId = "light";
