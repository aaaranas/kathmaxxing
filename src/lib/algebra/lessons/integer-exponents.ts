import type { Lesson } from "@/lib/lessons/types";

/**
 * Notation is authored raw so a backslash stays a backslash. Prose fields take
 * the same notation between a pair of `$`.
 */
const m = String.raw;

export const integerExponents: Lesson = {
  slug: "integer-exponents",
  title: "Integer Exponents",
  blurb: "The nine laws, negative exponents, and how to leave an answer positive.",
  source: "Class Notes — Chapter 1, Section 1.1",
  summary:
    "An exponent is shorthand for repeated multiplication, and every law below is that one fact " +
    "read back in a different direction. Almost none of it has to be memorised separately: if a " +
    "rule ever looks doubtful, write the powers out long-hand and count. This section is the floor " +
    "the next two stand on, because rational exponents and radicals obey exactly these laws.",
  sections: [
    {
      kind: "rules",
      id: "laws",
      title: "The laws",
      intro:
        "Every law assumes the base is non-zero wherever a zero would divide. Read each one both " +
        "ways — left to right expands, right to left collects, and you need both directions.",
      rules: [
        {
          name: "Product",
          expr: m`a^{n} \cdot a^{m} = a^{n+m}`,
          note: "Same base multiplied: add the exponents. Different bases never combine.",
        },
        {
          name: "Quotient",
          expr: m`\frac{a^{n}}{a^{m}} = a^{n-m}`,
          note: "Same base divided: top exponent minus bottom exponent.",
        },
        {
          name: "Power of a power",
          expr: m`(a^{n})^{m} = a^{nm}`,
          note: "A power raised to a power multiplies the exponents. This is the one most often confused with the product rule.",
        },
        {
          name: "Power of a product",
          expr: m`(ab)^{n} = a^{n}b^{n}`,
          note: "The exponent reaches every factor inside the bracket — factors only, never terms added together.",
        },
        {
          name: "Power of a quotient",
          expr: m`\left(\frac{a}{b}\right)^{n} = \frac{a^{n}}{b^{n}}`,
          note: "Top and bottom each take the exponent.",
        },
        {
          name: "Zero exponent",
          expr: m`a^{0} = 1, \quad a \ne 0`,
          note: "Anything non-zero raised to zero is 1, however big and ugly the base looks.",
        },
        {
          name: "Negative exponent",
          expr: m`a^{-n} = \frac{1}{a^{n}}, \quad \frac{1}{a^{-n}} = a^{n}`,
          note: "A negative exponent is an instruction to move, not a negative number. The sign of the answer is untouched.",
        },
        {
          name: "Negative power of a fraction",
          expr: m`\left(\frac{a}{b}\right)^{-n} = \left(\frac{b}{a}\right)^{n}`,
          note: "Flip the fraction and the exponent turns positive. Much faster than distributing first.",
        },
        {
          name: "Crossing the bar",
          expr: m`\frac{a^{-n}}{b^{-m}} = \frac{b^{m}}{a^{n}}`,
          note: "A factor crosses the fraction bar and its exponent changes sign. This is the workhorse for finishing an answer off.",
        },
      ],
      note: m`Only the last three are genuinely new — they are the first six extended to negative exponents, which is also why $a^{0}$ has to be 1: $\frac{a^{n}}{a^{n}}$ is both 1 and $a^{0}$, so the two must agree.`,
    },
    {
      kind: "checklist",
      id: "method",
      title: "How to simplify one of these",
      intro:
        "The simplify problems all yield to the same order of moves. Working out of order is what " +
        "turns a two-line problem into half a page.",
      items: [
        {
          label: "Clear the innermost brackets first",
          detail:
            "If the whole expression sits inside a bracket raised to a power, tidy the inside until " +
            "it is one power per base, and apply the outer exponent once at the end. Distributing it " +
            "early multiplies the number of exponents you have to track.",
        },
        {
          label: "Collect each base separately",
          detail:
            "Gather all the $a$'s, all the $b$'s, all the $c$'s. Add exponents on top, add exponents " +
            "on the bottom, then subtract bottom from top. Bases never mix.",
        },
        {
          label: "Evaluate numbers, leave letters symbolic",
          detail: m`A numeric coefficient like $2^{-3}$ should become an actual number, $\frac{1}{8}$. A letter stays as a power.`,
        },
        {
          label: "Move everything negative across the bar",
          detail:
            "Last step, always. Any factor with a negative exponent crosses the bar and its exponent " +
            "flips sign. The answer is finished when no exponent is negative and no base appears twice.",
        },
      ],
    },
    {
      kind: "examples",
      id: "examples",
      title: "Worked examples",
      intro:
        "Each line names the move that produced it, so a solution reads as a list of decisions " +
        "rather than a wall of algebra.",
      examples: [
        {
          id: "ie-1",
          prompt: m`2 \cdot 5^{2} + (-4)^{2}`,
          pattern: "Order of operations",
          tell: "Two terms added, each containing a power. Exponents resolve before the multiplication, and the multiplication before the addition.",
          steps: [
            {
              expr: m`2 \cdot 25 + 16`,
              reason: m`$5^{2} = 25$, and $(-4)^{2} = 16$ because the bracket puts the minus inside the squaring.`,
            },
            { expr: m`50 + 16`, reason: "Multiply before adding." },
            { expr: m`66`, reason: "Add." },
          ],
          answer: m`66`,
          check: m`Compare with $-4^{2}$, which is $-16$. The bracket is the entire difference between the two.`,
        },
        {
          id: "ie-2",
          prompt: m`-4^{3} + (-4)^{3}`,
          pattern: "Sign and the exponent",
          tell: "The same digits twice, once bracketed and once not — the problem is testing whether the minus is inside the power.",
          steps: [
            {
              expr: m`-(4^{3}) + (-4)^{3}`,
              reason: "Without a bracket the exponent binds to the 4 only, so the minus waits outside.",
            },
            {
              expr: m`-64 + (-64)`,
              reason: m`$4^{3} = 64$, and $(-4)^{3} = -64$ since an odd power keeps the sign.`,
            },
            { expr: m`-128`, reason: "Add." },
          ],
          answer: m`-128`,
          check: m`An odd exponent is the one case where bracketed and unbracketed agree in sign. Run the same pair with an even exponent and they part company: $-4^{2} = -16$ while $(-4)^{2} = 16$.`,
        },
        {
          id: "ie-3",
          prompt: m`8 \cdot 2^{-3} + 16^{0}`,
          pattern: "Negative and zero exponents",
          tell: "A negative exponent on a number, and something raised to zero.",
          steps: [
            {
              expr: m`8 \cdot \frac{1}{2^{3}} + 1`,
              reason: m`$2^{-3}$ moves to the denominator; $16^{0} = 1$ without touching the 16 at all.`,
            },
            { expr: m`\frac{8}{8} + 1`, reason: m`$2^{3} = 8$.` },
            { expr: m`1 + 1 = 2`, reason: "Divide, then add." },
          ],
          answer: m`2`,
        },
        {
          id: "ie-4",
          prompt: m`\left(2^{-1} + 3^{-1}\right)^{-1}`,
          pattern: "Negative exponent over a sum",
          tell: "A negative exponent sitting on a bracket that contains an addition. It cannot be distributed — the inside has to be collapsed to one number first.",
          steps: [
            {
              expr: m`\left(\frac{1}{2} + \frac{1}{3}\right)^{-1}`,
              reason: "Turn each inside term into a fraction. The outer −1 has to wait: a power never distributes over a sum.",
            },
            { expr: m`\left(\frac{3}{6} + \frac{2}{6}\right)^{-1}`, reason: "Common denominator." },
            {
              expr: m`\left(\frac{5}{6}\right)^{-1}`,
              reason: "Add, so the bracket is now a single number.",
            },
            { expr: m`\frac{6}{5}`, reason: "A fraction to the −1 is its reciprocal." },
          ],
          answer: m`\frac{6}{5}`,
          check: m`The tempting wrong answer is $2 + 3 = 5$. Test it: that would need $\left(2^{-1} + 3^{-1}\right)^{-1}$ to be $\frac{1}{5}$, and it is $\frac{6}{5}$.`,
        },
        {
          id: "ie-5",
          prompt: m`\frac{3^{2} \cdot (-2)^{3}}{6^{-2}}`,
          pattern: "Crossing the bar",
          tell: "A negative exponent alone in the denominator — it becomes a positive factor on top.",
          steps: [
            {
              expr: m`3^{2} \cdot (-2)^{3} \cdot 6^{2}`,
              reason: m`$6^{-2}$ on the bottom crosses the bar and becomes $6^{2}$ on the top.`,
            },
            {
              expr: m`9 \cdot (-8) \cdot 36`,
              reason: m`Evaluate each power. $(-2)^{3}$ keeps its sign because 3 is odd.`,
            },
            { expr: m`-72 \cdot 36`, reason: "Multiply the first two." },
            { expr: m`-2592`, reason: "Multiply." },
          ],
          answer: m`-2592`,
        },
        {
          id: "ie-6",
          prompt: m`\left(3x^{-2}y^{-4}\right)^{-1}`,
          pattern: "Power of a product",
          tell: "A bracket of factors — no addition inside — raised to a power, so the exponent reaches every factor.",
          steps: [
            {
              expr: m`3^{-1}\left(x^{-2}\right)^{-1}\left(y^{-4}\right)^{-1}`,
              reason: "Power of a product: every factor takes the −1, the 3 included.",
            },
            {
              expr: m`3^{-1}x^{2}y^{4}`,
              reason: m`Power of a power: multiply the exponents, $(-2)(-1) = 2$ and $(-4)(-1) = 4$.`,
            },
            {
              expr: m`\frac{x^{2}y^{4}}{3}`,
              reason: m`$3^{-1}$ crosses the bar. Nothing negative is left.`,
            },
          ],
          answer: m`\frac{x^{2}y^{4}}{3}`,
          check: "The commonest slip is leaving the coefficient alone. The exponent applies to the 3 as much as to the letters.",
        },
        {
          id: "ie-7",
          prompt: m`\frac{c^{-6}b^{10}}{b^{9}c^{-11}}`,
          pattern: "Collect each base",
          tell: "Two bases, each appearing on both sides of the bar. Treat $b$ and $c$ as two small separate problems.",
          steps: [
            {
              expr: m`b^{10-9} \cdot c^{-6-(-11)}`,
              reason: "Quotient rule once per base: top exponent minus bottom exponent.",
            },
            { expr: m`b^{1} \cdot c^{5}`, reason: m`$10 - 9 = 1$ and $-6 + 11 = 5$.` },
            { expr: m`bc^{5}`, reason: "An exponent of 1 is not written." },
          ],
          answer: m`bc^{5}`,
        },
        {
          id: "ie-8",
          prompt: m`\frac{4a^{3}\left(b^{2}a\right)^{-4}}{c^{-6}a^{2}b^{-7}}`,
          pattern: "Full clean-up",
          tell: "A bracketed power inside a fraction with three bases. Clear the bracket, collect each base, then cross the bar.",
          steps: [
            {
              expr: m`\frac{4a^{3}b^{-8}a^{-4}}{c^{-6}a^{2}b^{-7}}`,
              reason: m`Clear the bracket first: $\left(b^{2}a\right)^{-4} = b^{-8}a^{-4}$.`,
            },
            {
              expr: m`\frac{4a^{-1}b^{-8}}{c^{-6}a^{2}b^{-7}}`,
              reason: m`Collect the $a$'s on top: $3 + (-4) = -1$.`,
            },
            {
              expr: m`4a^{-1-2}b^{-8-(-7)}c^{6}`,
              reason: m`Quotient rule per base; $c^{-6}$ on the bottom crosses as $c^{6}$.`,
            },
            { expr: m`4a^{-3}b^{-1}c^{6}`, reason: m`$-1 - 2 = -3$ and $-8 + 7 = -1$.` },
            {
              expr: m`\frac{4c^{6}}{a^{3}b}`,
              reason: "Move the two negative exponents across the bar. The 4 stays put — its exponent was never negative.",
            },
          ],
          answer: m`\frac{4c^{6}}{a^{3}b}`,
        },
        {
          id: "ie-9",
          prompt: m`\frac{\left(6v^{2}\right)^{-1}w^{-4}}{(2v)^{-3}w^{10}}`,
          pattern: "Flip the negatives before evaluating",
          tell: "Bracketed coefficients on both sides carrying negative exponents. Swapping them across the bar first keeps the numbers small.",
          steps: [
            {
              expr: m`\frac{(2v)^{3}w^{-4}}{\left(6v^{2}\right)^{1}w^{10}}`,
              reason: "Both bracketed factors cross the bar and their exponents turn positive.",
            },
            {
              expr: m`\frac{8v^{3}w^{-4}}{6v^{2}w^{10}}`,
              reason: m`$(2v)^{3} = 8v^{3}$. Coefficients get evaluated; letters do not.`,
            },
            {
              expr: m`\frac{4}{3}v^{3-2}w^{-4-10}`,
              reason: m`Reduce $\frac{8}{6}$, then the quotient rule on $v$ and on $w$.`,
            },
            { expr: m`\frac{4v}{3}w^{-14}`, reason: m`$v^{1} = v$ and $-4 - 10 = -14$.` },
            { expr: m`\frac{4v}{3w^{14}}`, reason: "The last negative exponent crosses the bar." },
          ],
          answer: m`\frac{4v}{3w^{14}}`,
        },
        {
          id: "ie-10",
          prompt: m`\left(\frac{a^{2}b^{-4}c^{-1}}{b^{-9}c^{8}a^{-4}}\right)^{-2}`,
          pattern: "Simplify inside, then apply the outer exponent",
          tell: "A messy fraction inside a single outer power. Tidy the inside to one power per base before the −2 is touched.",
          steps: [
            {
              expr: m`\left(a^{2-(-4)}b^{-4-(-9)}c^{-1-8}\right)^{-2}`,
              reason: "Quotient rule per base, still inside the bracket.",
            },
            {
              expr: m`\left(a^{6}b^{5}c^{-9}\right)^{-2}`,
              reason: m`$2 + 4 = 6$, $-4 + 9 = 5$, $-1 - 8 = -9$.`,
            },
            {
              expr: m`a^{-12}b^{-10}c^{18}`,
              reason: "Power of a power: multiply each exponent by −2.",
            },
            { expr: m`\frac{c^{18}}{a^{12}b^{10}}`, reason: "Cross the bar with the negatives." },
          ],
          answer: m`\frac{c^{18}}{a^{12}b^{10}}`,
          check: m`Sanity check the direction: $c$ ended the inside at a net $-9$ and was then raised to $-2$, so it has to finish positive and large. It does.`,
        },
        {
          id: "ie-11",
          prompt: m`\left(\frac{p^{-6}q^{7}\left(p^{2}q\right)^{-3}}{\left(p^{-1}q^{-4}\right)^{2}p^{10}}\right)^{3}`,
          pattern: "Brackets inside brackets",
          tell: "Inner brackets on both sides of the bar, all inside an outer cube. Clear the inner ones before anything else.",
          steps: [
            {
              expr: m`\left(\frac{p^{-6}q^{7} \cdot p^{-6}q^{-3}}{p^{-2}q^{-8} \cdot p^{10}}\right)^{3}`,
              reason: "Clear both inner brackets by multiplying their exponents in.",
            },
            {
              expr: m`\left(\frac{p^{-12}q^{4}}{p^{8}q^{-8}}\right)^{3}`,
              reason: m`Collect within the top and within the bottom: $-6 + (-6) = -12$, $7 + (-3) = 4$, $-2 + 10 = 8$.`,
            },
            { expr: m`\left(p^{-12-8}q^{4-(-8)}\right)^{3}`, reason: "Quotient rule across the bar." },
            { expr: m`\left(p^{-20}q^{12}\right)^{3}`, reason: m`$-12 - 8 = -20$ and $4 + 8 = 12$.` },
            { expr: m`p^{-60}q^{36}`, reason: "Apply the outer cube to each." },
            { expr: m`\frac{q^{36}}{p^{60}}`, reason: "Cross the bar." },
          ],
          answer: m`\frac{q^{36}}{p^{60}}`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "True or false",
      intro:
        "These are not busywork. Each is a rule that does not exist, written out so it can be " +
        "recognised on sight. Say why it fails, then give the corrected version.",
      traps: [
        {
          wrong: m`\frac{1}{6x} = 6x^{-1}`,
          right: m`\frac{1}{6x} = 6^{-1}x^{-1} = \frac{1}{6}x^{-1}`,
          why: m`A negative exponent only moves the factor it is attached to. Writing $6x^{-1}$ leaves the 6 upstairs, which is a different number: $6x^{-1} = \frac{6}{x}$, not $\frac{1}{6x}$.`,
        },
        {
          wrong: m`\left(x^{3}\right)^{7} = x^{10}`,
          right: m`\left(x^{3}\right)^{7} = x^{21}`,
          why: m`A power of a power multiplies; only a product of powers adds. $x^{3} \cdot x^{7}$ is the one that gives $x^{10}$.`,
        },
        {
          wrong: m`\left(m^{3}n^{4}\right)^{2} = m^{12}n^{8}`,
          right: m`\left(m^{3}n^{4}\right)^{2} = m^{6}n^{8}`,
          why: m`Both exponents are multiplied by the 2, not by each other. The $n$ was handled correctly and the $m$ was not, which is what makes this one easy to nod through.`,
        },
        {
          wrong: m`(x + y)^{3} = x^{3} + y^{3}`,
          right: m`(x + y)^{3} = x^{3} + 3x^{2}y + 3xy^{2} + y^{3}`,
          why: m`Powers distribute over multiplication, never over addition. One numeric test settles it: $(1 + 1)^{3} = 8$ but $1^{3} + 1^{3} = 2$.`,
        },
        {
          wrong: m`\left(\left(z^{2}\right)^{3}\right)^{4} = z^{24}`,
          right: m`\text{True as written.}`,
          why: m`This one is correct: nested powers multiply all the way down, $2 \cdot 3 \cdot 4 = 24$. Not every statement in a true-or-false set is false, so check rather than assume.`,
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Work each one on paper before opening the answer.",
      problems: [
        {
          prompt: m`3 \cdot 4^{3} + 2 \cdot 3^{2}`,
          answer: m`210`,
          hint: "Powers first, then the two multiplications, then add.",
        },
        {
          prompt: m`(-1)^{4} + 2(-3)^{4}`,
          answer: m`163`,
          hint: "Both exponents are even, so both powers come out positive.",
        },
        {
          prompt: m`7^{0}\left(4^{2} \cdot 3^{2}\right)^{2}`,
          answer: m`20736`,
          hint: m`$7^{0} = 1$, and $4^{2} \cdot 3^{2} = 144$.`,
        },
        {
          prompt: m`\frac{4^{-2} \cdot 5^{3}}{3^{-4}}`,
          answer: m`\frac{10125}{16}`,
          hint: m`$3^{-4}$ crosses the bar as $3^{4} = 81$.`,
        },
        {
          prompt: m`\left(\frac{\left(8x^{21}\right)^{0}y^{-3}x^{8}}{y^{-9}x^{-1}}\right)^{6}`,
          answer: m`x^{54}y^{36}`,
          hint: "The first bracket is raised to zero, so it is just 1 — the 8 and the x never matter.",
        },
        {
          prompt: m`\left(\frac{2a^{2}}{b}\right)^{-3}`,
          answer: m`\frac{b^{3}}{8a^{6}}`,
          hint: "Flip the fraction first, then cube. Remember the 2 gets cubed as well.",
        },
      ],
    },
  ],
};
