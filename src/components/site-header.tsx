import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { ThemeSwitcher } from "@/components/theme-switcher";

export type Crumb = { label: string; href?: string };

/**
 * The wordmark stays put on every page and the breadcrumb underneath says where
 * in the shelf you are. Everything below the header is the page's own.
 */
export function SiteHeader({
  crumbs = [],
  title,
  description,
}: {
  crumbs?: Crumb[];
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <Link href="/" className="relative inline-block font-mono text-xl font-medium tracking-tight">
          <span className="relative z-10">kathmaxxing</span>
          <span
            aria-hidden
            className="absolute inset-x-[-0.15em] bottom-[0.1em] z-0 h-2 bg-plate"
          />
        </Link>
        <ThemeSwitcher />
      </div>

      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1">
                {index > 0 && <ChevronRight aria-hidden className="size-3 shrink-0 opacity-60" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="rounded px-1 py-0.5 hover:bg-plate">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="rounded bg-plate px-1.5 py-0.5 font-medium">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">{title}</h1>
        <p className="mt-1.5 max-w-[62ch] text-sm">{description}</p>
      </div>
    </header>
  );
}
