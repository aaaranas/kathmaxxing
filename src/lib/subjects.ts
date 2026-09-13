import type { LucideIcon } from "lucide-react";
import { Binary, Sigma } from "lucide-react";

import { ALGEBRA_LESSONS } from "@/lib/algebra";

/**
 * The shelf the app is organised on. A subject owns a route and lists what is
 * inside it, so the home page is a rendering of this file rather than a second
 * copy of the same list.
 */
export type Subject = {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  /** One line under the subject name. */
  blurb: string;
  /** Longer description, used as the page description and on the subject page. */
  summary: string;
  /** Named contents, for the preview list on the home page. */
  topics: { title: string; href: string; blurb: string }[];
};

export const SUBJECTS: Subject[] = [
  {
    id: "computer-science",
    name: "Computer Science",
    href: "/computer-science",
    icon: Binary,
    blurb: "Number bases — binary, octal, decimal and hexadecimal.",
    summary:
      "A base converter that shows its working. Type a value in any of the four bases and the other " +
      "three follow, with the arithmetic written out underneath.",
    topics: [
      {
        title: "Base converter",
        href: "/computer-science",
        blurb: "One input, four live readouts, and every step of the conversion written out.",
      },
      {
        title: "Pattern table",
        href: "/computer-science",
        blurb: "One to fifteen as place-value columns, so the doubling is visible.",
      },
      {
        title: "History",
        href: "/computer-science",
        blurb: "Every value you settle on, kept and re-converted on demand.",
      },
    ],
  },
  {
    id: "algebra",
    name: "Algebra",
    href: "/algebra",
    icon: Sigma,
    blurb: "Exponents, radicals and factoring — worked line by line.",
    summary:
      "The rules, the method, and a worked solution for every kind of problem in the class notes. " +
      "Each solution names the pattern first and the move second, so the working reads as a list of " +
      "decisions rather than a wall of algebra.",
    topics: ALGEBRA_LESSONS.map((lesson) => ({
      title: lesson.title,
      href: `/algebra/${lesson.slug}`,
      blurb: lesson.blurb,
    })),
  },
];

export function findSubject(id: string): Subject | undefined {
  return SUBJECTS.find((subject) => subject.id === id);
}
