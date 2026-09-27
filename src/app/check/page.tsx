import type { Metadata } from "next";

import { AnswerChecker } from "@/components/checker/answer-checker";
import { PageShell } from "@/components/page-shell";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Check my answer",
  description:
    "Type a problem and your own answer and have it marked: simplifications, derivatives and limits, with the reason it passed or failed.",
};

export default function Page() {
  return (
    <PageShell>
      <SiteHeader
        crumbs={[{ label: "Subjects", href: "/" }, { label: "Check my answer" }]}
        title="Check my answer"
        description="You have the answer already — this says whether it is right. Simplifications, derivatives and limits, marked against the real thing rather than against one accepted spelling, with the reason it passed or failed."
      />

      <AnswerChecker />
    </PageShell>
  );
}
