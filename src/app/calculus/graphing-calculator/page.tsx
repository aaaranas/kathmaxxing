import type { Metadata } from "next";

import { GraphingCalculator } from "@/components/calculator/graphing";
import { PageShell } from "@/components/page-shell";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Graphing Calculator",
  description:
    "Plot up to four functions of x on one set of axes. Pan, zoom, and read a value straight off the curve.",
};

export default function Page() {
  return (
    <PageShell>
      <SiteHeader
        crumbs={[
          { label: "Subjects", href: "/" },
          { label: "Calculus", href: "/calculus" },
          { label: "Graphing calculator" },
        ]}
        title="Graphing calculator"
        description="Up to four functions of x at once, told apart by the kind of line rather than by colour. Drag to move, scroll to zoom, and hover anywhere to read the value off every curve at that x."
      />

      <GraphingCalculator />
    </PageShell>
  );
}
