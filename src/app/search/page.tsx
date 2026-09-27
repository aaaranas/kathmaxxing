import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { LessonSearch } from "@/components/search/lesson-search";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search every rule, worked solution and practice problem across computer science, algebra and calculus.",
};

export default function Page() {
  return (
    <PageShell>
      <SiteHeader
        crumbs={[{ label: "Subjects", href: "/" }, { label: "Search" }]}
        title="Search"
        description="Every rule, every worked solution and every practice problem on the shelf, in one list. It runs on your device, so it works with no signal."
      />

      <LessonSearch />
    </PageShell>
  );
}
