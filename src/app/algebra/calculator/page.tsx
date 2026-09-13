import type { Metadata } from "next";

import { Calculator } from "@/components/algebra/calculator";
import { PageShell } from "@/components/page-shell";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Scientific Calculator",
  description:
    "A scientific calculator that answers exactly wherever the arithmetic allows, and says how it read the expression before it answers it.",
};

export default function Page() {
  return (
    <PageShell>
      <SiteHeader
        crumbs={[
          { label: "Subjects", href: "/" },
          { label: "Algebra", href: "/algebra" },
          { label: "Calculator" },
        ]}
        title="Scientific calculator"
        description="Answers exactly wherever the arithmetic allows — fractions stay fractions and roots that come out whole stay whole. It also shows how it read the expression before it answers, so a misplaced bracket is visible rather than silent."
      />

      <Calculator />
    </PageShell>
  );
}
