import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { Workbench } from "@/components/workbench";

export const metadata: Metadata = {
  title: "Computer Science",
  description:
    "A base converter that shows its working. Binary, octal, decimal and hexadecimal side by side, with every step written out.",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-4 sm:px-6">
      <SiteHeader
        crumbs={[{ label: "Subjects", href: "/" }, { label: "Computer Science" }]}
        title="Number bases"
        description="Four bases, one number. Type into any of them and the other three follow, with the arithmetic written out underneath."
      />

      <Workbench />
    </main>
  );
}
