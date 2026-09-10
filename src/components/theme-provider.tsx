"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { DEFAULT_THEME, THEME_IDS } from "@/lib/themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={DEFAULT_THEME}
      themes={THEME_IDS}
      enableSystem={false}
      disableTransitionOnChange
      storageKey="kathmaxxing-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
