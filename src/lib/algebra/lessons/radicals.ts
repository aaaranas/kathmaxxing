import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const radicals: Lesson = {
  slug: "radicals",
  title: "Radicals",
  blurb: "Simplifying, multiplying and rationalizing — and why the variables are assumed positive.",
  source: "Class Notes — Chapter 1, Section 1.3",
  summary:
    "A radical is a rational exponent wearing a different hat, so nothing here is new mathematics — " +
    "it is the previous section with a sign drawn over it. What is new is the convention: there is " +
    "an agreed standard for what a finished radical answer looks like, and most of the work in this " +
    "section is getting an expression into that form.",
  sections: [
    {
      kind: "rules",
      id: "anatomy",
      title: "Anatomy and conversion",
      intro:
        "The index sits in the notch of the radical sign, the radicand sits under the bar. A missing " +
        "index always means 2.",
      rules: [
        {
          name: "Radical to exponent",
          expr: m`\sqrt[n]{a} = a^{\frac{1}{n}}`,
          note: "The index becomes the denominator. Converting is usually the fastest way to start a hard problem.",
        },
        {
          name: "Radical of a power",
          expr: m`\sqrt[n]{a^{m}} = a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^{m}`,
          note: "This is the bridge between the two sections. Every radical rule below is an exponent rule read through it.",
        },
        {
          name: "Principal root",
          expr: m`\sqrt{a} \ge 0`,
          note: m`For an even index the radical means the non-negative root only. $\sqrt{9} = 3$, never $-3$ — the $\pm$ belongs to solving $x^{2}=9$, not to the symbol.`,
        },
        {
          name: "Odd index, negative radicand",
          expr: m`\sqrt[3]{-216} = -6`,
          note: "An odd index handles negatives happily. An even index of a negative radicand is not a real number.",
        },
      ],
    },
    {
      kind: "rules",
      id: "laws",
      title: "The laws",
      intro: "Products and quotients split. Sums and differences do not — that is the whole cautionary tale.",
      rules: [
        {
          name: "Product",
          expr: m`\sqrt[n]{ab} = \sqrt[n]{a}\sqrt[n]{b}`,
          note: "Works in both directions: split a radicand to simplify it, or join two radicals of the same index to multiply.",
        },
        {
          name: "Quotient",
          expr: m`\sqrt[n]{\frac{a}{b}} = \frac{\sqrt[n]{a}}{\sqrt[n]{b}}`,
          note: "Same index top and bottom. Indexes must match before anything can be combined.",
        },
        {
          name: "Odd index undoes an odd power",
          expr: m`\sqrt[n]{a^{n}} = a \quad (n \text{ odd})`,
          note: "Nothing to worry about: the sign passes straight through.",
        },
        {
          name: "Even index needs absolute value",
          expr: m`\sqrt[n]{a^{n}} = |a| \quad (n \text{ even})`,
          note: m`$\sqrt{(-5)^{2}} = 5$, not $-5$. This is the single rule the "assume positive" instruction exists to switch off.`,
        },
        {
          name: "Root of a root",
          expr: m`\sqrt[m]{\sqrt[n]{a}} = \sqrt[mn]{a}`,
          note: m`Because $\left(a^{\frac{1}{n}}\right)^{\frac{1}{m}} = a^{\frac{1}{mn}}$. Multiply the indexes.`,
        },
        {
          name: "No rule for sums",
          expr: m`\sqrt[n]{a + b} \ne \sqrt[n]{a} + \sqrt[n]{b}`,
          note: m`There is no way to split a sum under a radical. $\sqrt{9+16} = 5$ while $\sqrt{9}+\sqrt{16} = 7$.`,
        },
      ],
    },
    {
      kind: "checklist",
      id: "simplified-form",
      title: "What counts as simplified",
      intro:
        "An answer is not finished because it is shorter. Three conditions have to hold, and the " +
        "problems in this section are each one of them being enforced.",
      items: [
        {
          label: "No factor under the radical has an exponent as big as the index",
          detail: m`$\sqrt{z^{5}}$ is not simplified because $5 \ge 2$. Pull out pairs until at most one $z$ is left underneath.`,
        },
        {
          label: "No fraction under the radical",
          detail: m`$\sqrt{\frac{3}{4}}$ becomes $\frac{\sqrt{3}}{2}$. Split it with the quotient rule and resolve the bottom.`,
        },
        {
          label: "No radical in the denominator",
          detail:
            "This is what rationalizing is for. It is a convention rather than a law — but it is the " +
            "convention every answer key uses.",
        },
        {
          label: "The index is as small as it will go",
          detail: m`$\sqrt[4]{x^{2}} = x^{\frac{2}{4}} = \sqrt{x}$. Convert to exponent form, reduce the fraction, convert back.`,
        },
      ],
    },
    {
      kind: "checklist",
      id: "extraction",
      title: "The extraction rule",
      intro:
        "Simplifying a radical is one division, done once per factor. Everything else is bookkeeping.",
      items: [
        {
          label: "Divide the exponent by the index",
          detail: m`For $\sqrt[n]{a^{e}}$, write $e = qn + r$. The quotient $q$ is how many $a$'s come out; the remainder $r$ is how many stay under.`,
        },
        {
          label: "Do it separately for every factor",
          detail: m`In $\sqrt[3]{16x^{17}}$: $16 = 2^{4}$ gives $4 = 1 \cdot 3 + 1$, so one 2 out and one 2 in; $17 = 5 \cdot 3 + 2$, so $x^{5}$ out and $x^{2}$ in.`,
        },
        {
          label: "Break numbers into prime powers first",
          detail: m`You cannot see what comes out of $\sqrt[6]{128}$ until it is $\sqrt[6]{2^{7}}$. Then $7 = 1 \cdot 6 + 1$ and a single 2 steps out.`,
        },
        {
          label: "Multiply everything together before extracting",
          detail:
            "When several radicals of the same index are multiplied, join them into one radicand " +
            "first. Extracting from each separately misses the factors that only pair up once combined.",
        },
      ],
    },
    {
      kind: "examples",
      id: "simplify",
      title: "Worked examples — simplifying and multiplying",
      intro: "Every variable below is assumed positive, so no absolute value bars are needed.",
      examples: [
        {
          id: "rad-1",
          prompt: m`\sqrt{z^{5}}`,
          pattern: "Extraction",
          tell: "One factor, exponent larger than the index.",
          steps: [
            { expr: m`\sqrt{z^{4} \cdot z}`, reason: m`$5 = 2 \cdot 2 + 1$, so split off the largest even power.` },
            { expr: m`\sqrt{z^{4}}\sqrt{z}`, reason: "Product rule." },
            { expr: m`z^{2}\sqrt{z}`, reason: m`$\sqrt{z^{4}} = z^{\frac{4}{2}} = z^{2}$.` },
          ],
          answer: m`z^{2}\sqrt{z}`,
        },
        {
          id: "rad-2",
          prompt: m`\sqrt[3]{16x^{17}}`,
          pattern: "Extraction, two factors",
          tell: "A number that is not a perfect cube and a large variable exponent. Handle them independently.",
          steps: [
            { expr: m`\sqrt[3]{2^{4}x^{17}}`, reason: m`Write 16 as a prime power so the division is visible.` },
            { expr: m`\sqrt[3]{2^{3} \cdot 2 \cdot x^{15} \cdot x^{2}}`, reason: m`$4 = 1 \cdot 3 + 1$ and $17 = 5 \cdot 3 + 2$.` },
            { expr: m`2x^{5}\sqrt[3]{2x^{2}}`, reason: "Whole groups of three step outside; the remainders stay under." },
          ],
          answer: m`2x^{5}\sqrt[3]{2x^{2}}`,
          check: m`Count back: $\left(2x^{5}\right)^{3} = 8x^{15}$, and $8x^{15} \cdot 2x^{2} = 16x^{17}$.`,
        },
        {
          id: "rad-3",
          prompt: m`\sqrt[6]{128y^{11}}`,
          pattern: "Extraction, index 6",
          tell: "A high index makes very little come out. Prime-factorise before guessing.",
          steps: [
            { expr: m`\sqrt[6]{2^{7}y^{11}}`, reason: m`$128 = 2^{7}$.` },
            { expr: m`\sqrt[6]{2^{6} \cdot 2 \cdot y^{6} \cdot y^{5}}`, reason: m`$7 = 1 \cdot 6 + 1$ and $11 = 1 \cdot 6 + 5$.` },
            { expr: m`2y\sqrt[6]{2y^{5}}`, reason: "One group of six from each factor." },
          ],
          answer: m`2y\sqrt[6]{2y^{5}}`,
        },
        {
          id: "rad-4",
          prompt: m`\sqrt[4]{729x^{7}yz^{13}}`,
          pattern: "Extraction, four factors",
          tell: "Four factors, and one of them — the lone $y$ — cannot move at all.",
          steps: [
            { expr: m`\sqrt[4]{3^{6}x^{7}yz^{13}}`, reason: m`$729 = 3^{6}$.` },
            { expr: m`\sqrt[4]{3^{4} \cdot 3^{2} \cdot x^{4} \cdot x^{3} \cdot y \cdot z^{12} \cdot z}`, reason: m`$6 = 1 \cdot 4 + 2$, $7 = 1 \cdot 4 + 3$, $1 = 0 \cdot 4 + 1$, $13 = 3 \cdot 4 + 1$.` },
            { expr: m`3xz^{3}\sqrt[4]{9x^{3}yz}`, reason: m`$\sqrt[4]{z^{12}} = z^{3}$, and the leftover $3^{2}$ becomes the 9 underneath.` },
          ],
          answer: m`3xz^{3}\sqrt[4]{9x^{3}yz}`,
        },
        {
          id: "rad-5",
          prompt: m`\sqrt[3]{4x^{2}y}\sqrt[3]{10x^{5}y^{2}}`,
          pattern: "Multiply, then extract",
          tell: "Two radicals with the same index. Neither simplifies alone; combined, they do.",
          steps: [
            { expr: m`\sqrt[3]{40x^{7}y^{3}}`, reason: "Product rule joins them under one index-3 radical." },
            { expr: m`\sqrt[3]{8 \cdot 5 \cdot x^{6} \cdot x \cdot y^{3}}`, reason: m`$40 = 8 \cdot 5$, and $7 = 2 \cdot 3 + 1$.` },
            { expr: m`2x^{2}y\sqrt[3]{5x}`, reason: m`$\sqrt[3]{8} = 2$, $\sqrt[3]{x^{6}} = x^{2}$, $\sqrt[3]{y^{3}} = y$.` },
          ],
          answer: m`2x^{2}y\sqrt[3]{5x}`,
          check: m`The $y^{3}$ only appeared once the two were multiplied. That is why joining comes before extracting.`,
        },
        {
          id: "rad-6",
          prompt: m`\sqrt{3x}\sqrt{6x}\sqrt{14x}`,
          pattern: "Three at once",
          tell: "Same index three times over. Multiply all of it, then look for squares.",
          steps: [
            { expr: m`\sqrt{252x^{3}}`, reason: m`$3 \cdot 6 \cdot 14 = 252$ and $x \cdot x \cdot x = x^{3}$.` },
            { expr: m`\sqrt{36 \cdot 7 \cdot x^{2} \cdot x}`, reason: m`$252 = 36 \cdot 7$, and 36 is the largest square factor.` },
            { expr: m`6x\sqrt{7x}`, reason: "Take the square root of each perfect square." },
          ],
          answer: m`6x\sqrt{7x}`,
        },
        {
          id: "rad-7",
          prompt: m`\sqrt[4]{2xy^{3}}\sqrt[4]{32x^{2}y^{2}}`,
          pattern: "Multiply, then extract, index 4",
          tell: "Two fourth roots. The coefficients multiply to a power of 2, which is where the extraction comes from.",
          steps: [
            { expr: m`\sqrt[4]{64x^{3}y^{5}}`, reason: m`$2 \cdot 32 = 64$, $x \cdot x^{2} = x^{3}$, $y^{3} \cdot y^{2} = y^{5}$.` },
            { expr: m`\sqrt[4]{2^{4} \cdot 2^{2} \cdot x^{3} \cdot y^{4} \cdot y}`, reason: m`$64 = 2^{6}$ and $6 = 1 \cdot 4 + 2$; $x^{3}$ is stuck, $5 = 1 \cdot 4 + 1$.` },
            { expr: m`2y\sqrt[4]{4x^{3}y}`, reason: m`One 2 and one $y$ come out; $2^{2} = 4$ stays under.` },
          ],
          answer: m`2y\sqrt[4]{4x^{3}y}`,
        },
        {
          id: "rad-8",
          prompt: m`\left(2\sqrt{x} + 4\right)\left(\sqrt{x} - 7\right)`,
          pattern: "FOIL with radicals",
          tell: "Two binomials. Radicals change nothing about the expansion — they only change what collects.",
          steps: [
            { expr: m`2\sqrt{x}\sqrt{x} - 14\sqrt{x} + 4\sqrt{x} - 28`, reason: "Expand all four products." },
            { expr: m`2x - 14\sqrt{x} + 4\sqrt{x} - 28`, reason: m`$\sqrt{x}\sqrt{x} = x$ — the radical disappears.` },
            { expr: m`2x - 10\sqrt{x} - 28`, reason: m`Collect like terms. $\sqrt{x}$ terms combine with each other and with nothing else.` },
          ],
          answer: m`2x - 10\sqrt{x} - 28`,
          check: m`$2x$ and $\sqrt{x}$ are not like terms and never combine, however much they look as though they should.`,
        },
        {
          id: "rad-9",
          prompt: m`\left(\sqrt{x} + \sqrt{2y}\right)\left(\sqrt{x} - \sqrt{2y}\right)`,
          pattern: "Difference of squares",
          tell: "Same two terms, opposite middle signs. The cross terms cancel — this is exactly the identity used for rationalizing.",
          steps: [
            { expr: m`\left(\sqrt{x}\right)^{2} - \left(\sqrt{2y}\right)^{2}`, reason: m`$(a+b)(a-b) = a^{2}-b^{2}$, with $a = \sqrt{x}$ and $b = \sqrt{2y}$.` },
            { expr: m`x - 2y`, reason: "Squaring a square root removes it outright." },
          ],
          answer: m`x - 2y`,
          check: "Both radicals vanished. That is the property the conjugate trick is built on.",
        },
        {
          id: "rad-10",
          prompt: m`\left(\sqrt[4]{x} + \sqrt[4]{x^{2}}\right)^{2}`,
          pattern: "Perfect square with radicals",
          tell: "A binomial squared where both terms are roots of the same base. Exponent form keeps the bookkeeping honest.",
          steps: [
            { expr: m`\left(x^{\frac{1}{4}} + x^{\frac{1}{2}}\right)^{2}`, reason: m`Convert; note $\sqrt[4]{x^{2}} = x^{\frac{1}{2}}$, an index that reduces.` },
            { expr: m`x^{\frac{1}{2}} + 2x^{\frac{1}{4}}x^{\frac{1}{2}} + x`, reason: m`$(a+b)^{2} = a^{2} + 2ab + b^{2}$.` },
            { expr: m`x^{\frac{1}{2}} + 2x^{\frac{3}{4}} + x`, reason: m`$\frac{1}{4} + \frac{1}{2} = \frac{3}{4}$.` },
            { expr: m`\sqrt{x} + 2\sqrt[4]{x^{3}} + x`, reason: "Convert back to radical form." },
          ],
          answer: m`\sqrt{x} + 2\sqrt[4]{x^{3}} + x`,
        },
      ],
    },
    {
      kind: "checklist",
      id: "rationalizing-method",
      title: "Rationalizing: which move to use",
      intro:
        "Three different denominators, three different multipliers. Picking the right one first is " +
        "most of the battle.",
      items: [
        {
          label: "One square root on the bottom",
          detail: m`Multiply top and bottom by that same root. $\sqrt{y}\sqrt{y} = y$ and it is done.`,
        },
        {
          label: "One root of index $n$ on the bottom",
          detail: m`You need each exponent under the radical to reach $n$. For $\sqrt[5]{3x^{2}}$ multiply by $\sqrt[5]{3^{4}x^{3}}$, because $1+4 = 5$ and $2+3 = 5$. Multiplying by the same radical again is the classic mistake — it only works when the index is 2.`,
        },
        {
          label: "Two terms on the bottom",
          detail: m`Multiply by the conjugate — the same two terms with the middle sign flipped. $(a+b)(a-b) = a^{2}-b^{2}$ squares both terms at once, which is what clears them.`,
        },
        {
          label: "Leave the numerator factored",
          detail:
            "Expanding the top after conjugating usually makes the answer longer and no clearer. The " +
            "denominator is the part that had to change.",
        },
      ],
    },
    {
      kind: "examples",
      id: "rationalizing",
      title: "Worked examples — rationalizing",
      examples: [
        {
          id: "rz-1",
          prompt: m`\frac{9}{\sqrt{y}}`,
          pattern: "Single square root",
          tell: "One square root alone on the bottom.",
          steps: [
            { expr: m`\frac{9}{\sqrt{y}} \cdot \frac{\sqrt{y}}{\sqrt{y}}`, reason: m`Multiplying by $\frac{\sqrt{y}}{\sqrt{y}}$ is multiplying by 1, so the value is unchanged.` },
            { expr: m`\frac{9\sqrt{y}}{y}`, reason: m`$\sqrt{y}\sqrt{y} = y$.` },
          ],
          answer: m`\frac{9\sqrt{y}}{y}`,
        },
        {
          id: "rz-2",
          prompt: m`\frac{3}{\sqrt{7x}}`,
          pattern: "Single square root with a coefficient inside",
          tell: "The whole radicand travels together — do not split the 7 off.",
          steps: [
            { expr: m`\frac{3}{\sqrt{7x}} \cdot \frac{\sqrt{7x}}{\sqrt{7x}}`, reason: "Multiply by the entire radical." },
            { expr: m`\frac{3\sqrt{7x}}{7x}`, reason: m`$\sqrt{7x}\sqrt{7x} = 7x$.` },
          ],
          answer: m`\frac{3\sqrt{7x}}{7x}`,
        },
        {
          id: "rz-3",
          prompt: m`\frac{1}{\sqrt[4]{x}}`,
          pattern: "Higher index",
          tell: "Index 4 with an exponent of 1 underneath — it needs three more, not another one.",
          steps: [
            { expr: m`\frac{1}{\sqrt[4]{x}} \cdot \frac{\sqrt[4]{x^{3}}}{\sqrt[4]{x^{3}}}`, reason: m`$1 + 3 = 4$, so $x^{3}$ is exactly the top-up required.` },
            { expr: m`\frac{\sqrt[4]{x^{3}}}{\sqrt[4]{x^{4}}}`, reason: "Product rule on the denominator." },
            { expr: m`\frac{\sqrt[4]{x^{3}}}{x}`, reason: m`$\sqrt[4]{x^{4}} = x$, since $x$ is positive.` },
          ],
          answer: m`\frac{\sqrt[4]{x^{3}}}{x}`,
          check: m`Multiplying by $\sqrt[4]{x}$ instead would give $\sqrt[4]{x^{2}} = \sqrt{x}$ on the bottom — still a radical, so still not done.`,
        },
        {
          id: "rz-4",
          prompt: m`\frac{12}{\sqrt[5]{3x^{2}}}`,
          pattern: "Higher index, two factors",
          tell: "Index 5 and two different factors underneath. Each needs its own top-up to reach 5.",
          steps: [
            { expr: m`\frac{12}{\sqrt[5]{3x^{2}}} \cdot \frac{\sqrt[5]{3^{4}x^{3}}}{\sqrt[5]{3^{4}x^{3}}}`, reason: m`The 3 needs four more and the $x$ needs three more.` },
            { expr: m`\frac{12\sqrt[5]{81x^{3}}}{\sqrt[5]{3^{5}x^{5}}}`, reason: m`$3^{4} = 81$, and the top-ups multiply into the denominator.` },
            { expr: m`\frac{12\sqrt[5]{81x^{3}}}{3x}`, reason: m`$\sqrt[5]{3^{5}x^{5}} = 3x$.` },
            { expr: m`\frac{4\sqrt[5]{81x^{3}}}{x}`, reason: m`Reduce $\frac{12}{3}$.` },
          ],
          answer: m`\frac{4\sqrt[5]{81x^{3}}}{x}`,
        },
        {
          id: "rz-5",
          prompt: m`\frac{2}{4 - \sqrt{x}}`,
          pattern: "Conjugate",
          tell: "Two terms on the bottom, one of them a radical. Flip the middle sign.",
          steps: [
            { expr: m`\frac{2}{4 - \sqrt{x}} \cdot \frac{4 + \sqrt{x}}{4 + \sqrt{x}}`, reason: m`The conjugate of $4-\sqrt{x}$ is $4+\sqrt{x}$.` },
            { expr: m`\frac{2\left(4 + \sqrt{x}\right)}{4^{2} - \left(\sqrt{x}\right)^{2}}`, reason: m`Difference of squares on the bottom — the cross terms cancel.` },
            { expr: m`\frac{2\left(4 + \sqrt{x}\right)}{16 - x}`, reason: "Square both terms." },
          ],
          answer: m`\frac{2\left(4 + \sqrt{x}\right)}{16 - x}`,
          check: "Leave the numerator factored. The denominator was the problem, and it is now radical-free.",
        },
        {
          id: "rz-6",
          prompt: m`\frac{9}{\sqrt{3y} + 2}`,
          pattern: "Conjugate, radical first",
          tell: "Same move whichever term carries the radical.",
          steps: [
            { expr: m`\frac{9}{\sqrt{3y} + 2} \cdot \frac{\sqrt{3y} - 2}{\sqrt{3y} - 2}`, reason: "Flip the middle sign." },
            { expr: m`\frac{9\left(\sqrt{3y} - 2\right)}{\left(\sqrt{3y}\right)^{2} - 2^{2}}`, reason: "Difference of squares." },
            { expr: m`\frac{9\left(\sqrt{3y} - 2\right)}{3y - 4}`, reason: m`$\left(\sqrt{3y}\right)^{2} = 3y$.` },
          ],
          answer: m`\frac{9\left(\sqrt{3y} - 2\right)}{3y - 4}`,
        },
        {
          id: "rz-7",
          prompt: m`\frac{4}{\sqrt{7} - 6\sqrt{x}}`,
          pattern: "Conjugate, radicals in both terms",
          tell: "Two radicals and a coefficient. Squaring clears both at once; the coefficient gets squared too.",
          steps: [
            { expr: m`\frac{4}{\sqrt{7} - 6\sqrt{x}} \cdot \frac{\sqrt{7} + 6\sqrt{x}}{\sqrt{7} + 6\sqrt{x}}`, reason: "Conjugate." },
            { expr: m`\frac{4\left(\sqrt{7} + 6\sqrt{x}\right)}{\left(\sqrt{7}\right)^{2} - \left(6\sqrt{x}\right)^{2}}`, reason: "Difference of squares." },
            { expr: m`\frac{4\left(\sqrt{7} + 6\sqrt{x}\right)}{7 - 36x}`, reason: m`$\left(6\sqrt{x}\right)^{2} = 36x$ — the 6 is squared as well.` },
          ],
          answer: m`\frac{4\left(\sqrt{7} + 6\sqrt{x}\right)}{7 - 36x}`,
        },
        {
          id: "rz-8",
          prompt: m`\frac{4 + x}{x - \sqrt{x}}`,
          pattern: "Conjugate with a non-radical term",
          tell: m`A binomial denominator where one term happens to be plain. The conjugate is still just the sign flip.`,
          steps: [
            { expr: m`\frac{4 + x}{x - \sqrt{x}} \cdot \frac{x + \sqrt{x}}{x + \sqrt{x}}`, reason: "Conjugate." },
            { expr: m`\frac{(4 + x)\left(x + \sqrt{x}\right)}{x^{2} - \left(\sqrt{x}\right)^{2}}`, reason: "Difference of squares." },
            { expr: m`\frac{(4 + x)\left(x + \sqrt{x}\right)}{x^{2} - x}`, reason: m`$\left(\sqrt{x}\right)^{2} = x$.` },
          ],
          answer: m`\frac{(4 + x)\left(x + \sqrt{x}\right)}{x^{2} - x}`,
          check: m`Factoring the bottom as $x(x-1)$ is tidy but not required — the radical is already gone.`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "True or false",
      traps: [
        {
          wrong: m`3x^{\frac{1}{2}} = \sqrt{3x}`,
          right: m`3x^{\frac{1}{2}} = 3\sqrt{x}, \quad \sqrt{3x} = (3x)^{\frac{1}{2}}`,
          why: m`The exponent is attached to the $x$ alone, so only the $x$ goes under the radical. Test at $x = 4$: $3 \cdot 2 = 6$, while $\sqrt{12} \approx 3.46$.`,
        },
        {
          wrong: m`\sqrt[3]{x + 6} = \sqrt[3]{x} + \sqrt[3]{6}`,
          right: m`\sqrt[3]{x + 6} \text{ does not split.}`,
          why: m`Radicals distribute over multiplication, never over addition — the same wall as $(x+y)^{3} \ne x^{3}+y^{3}$, seen from the other side. Test at $x = 2$: $\sqrt[3]{8} = 2$, while $\sqrt[3]{2} + \sqrt[3]{6} \approx 3.08$.`,
        },
        {
          wrong: m`\sqrt[4]{x^{2}} = \sqrt{x}`,
          right: m`\text{True for } x \ge 0.`,
          why: m`$\sqrt[4]{x^{2}} = x^{\frac{2}{4}} = x^{\frac{1}{2}} = \sqrt{x}$. Without the positivity assumption it would be $\sqrt{|x|}$, since the left side is defined for negative $x$ and the right side is not.`,
        },
      ],
    },
    {
      kind: "checklist",
      id: "why-positive",
      title: "Why the variables are assumed positive",
      intro:
        "Every simplifying and rationalizing problem in this section carries the instruction \"assume " +
        "$x$, $y$ and $z$ are positive\". It is not decoration — here is exactly what it buys, and " +
        "what the answers would become without it.",
      items: [
        {
          label: "It removes the absolute value bars",
          detail: m`For an even index, $\sqrt[n]{a^{n}} = |a|$. Without the assumption, $\sqrt{z^{5}} = z^{2}\sqrt{z}$ would still be fine — $z^{2}$ is never negative — but $\sqrt{x^{3}y^{17}z^{4}}$ would need $|y^{8}|$-style care wherever an odd power came out from under an even index.`,
        },
        {
          label: "It guarantees the radical exists",
          detail: m`$\sqrt{x}$ is not a real number when $x$ is negative. Without the assumption, every answer would have to be stated with a domain attached.`,
        },
        {
          label: "It keeps rationalizing legal",
          detail: m`Multiplying by $\frac{\sqrt{y}}{\sqrt{y}}$ assumes $\sqrt{y}$ is a real non-zero number. If $y$ could be negative or zero, that step would not be multiplication by 1.`,
        },
        {
          label: "What would change",
          detail: m`Answers would carry absolute values on any factor extracted from an even-index radical with an odd exponent, and each result would be quoted on a restricted domain. The algebra itself would not change at all — only the bookkeeping around the sign.`,
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Assume every variable is positive.",
      problems: [
        { prompt: m`\sqrt[5]{-1024}`, answer: m`-4`, hint: m`$4^{5} = 1024$, and the index is odd.` },
        { prompt: m`\sqrt[8]{256}`, answer: m`2`, hint: m`$256 = 2^{8}$.` },
        {
          prompt: m`\sqrt{x^{3}y^{17}z^{4}}`,
          answer: m`xy^{8}z^{2}\sqrt{xy}`,
          hint: m`$3 = 1 \cdot 2 + 1$, $17 = 8 \cdot 2 + 1$, $4 = 2 \cdot 2 + 0$.`,
        },
        {
          prompt: m`\sqrt[4]{x^{3}y^{20}z^{5}}`,
          answer: m`y^{5}z\sqrt[4]{x^{3}z}`,
          hint: m`$x^{3}$ cannot move — 3 is less than the index.`,
        },
        {
          prompt: m`\sqrt[3]{x}\left(\sqrt[3]{x} + 2\sqrt[3]{x^{4}}\right)`,
          answer: m`\sqrt[3]{x^{2}} + 2x\sqrt[3]{x^{2}}`,
          hint: m`Distribute first: $\sqrt[3]{x}\sqrt[3]{x^{4}} = \sqrt[3]{x^{5}}$, and $5 = 1 \cdot 3 + 2$.`,
        },
        {
          prompt: m`\frac{-6}{\sqrt{5x} + 10\sqrt{y}}`,
          answer: m`\frac{-6\left(\sqrt{5x} - 10\sqrt{y}\right)}{5x - 100y}`,
          hint: m`Conjugate. Remember to square the 10 as well.`,
        },
      ],
    },
  ],
};
