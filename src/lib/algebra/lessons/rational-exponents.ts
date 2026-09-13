import type { Lesson } from "@/lib/algebra/types";

const m = String.raw;

export const rationalExponents: Lesson = {
  slug: "rational-exponents",
  title: "Rational Exponents",
  blurb: "A fraction in the exponent is a root. Which part to do first, and when it is undefined.",
  source: "Class Notes — Chapter 1, Section 1.2",
  summary:
    "A fractional exponent is not a new operation — it is a root written in exponent form, so that " +
    "every law from the previous section keeps working. The denominator says which root, the " +
    "numerator says which power. Once that reading is automatic, the only two questions left are " +
    "which to do first (the root) and whether the answer exists at all (check the denominator for " +
    "even, and the base for negative).",
  sections: [
    {
      kind: "rules",
      id: "definitions",
      title: "The definitions",
      intro: "Two definitions carry the whole section; everything after them is the old laws again.",
      rules: [
        {
          name: "Unit fraction is a root",
          expr: m`a^{\frac{1}{n}} = \sqrt[n]{a}`,
          note: "The denominator is the index of the root. This is a definition, not a consequence — it is chosen so the power-of-a-power rule survives.",
        },
        {
          name: "Why that definition",
          expr: m`\left(a^{\frac{1}{n}}\right)^{n} = a^{\frac{n}{n}} = a`,
          note: "Something that gives back $a$ when raised to the $n$ is exactly what the $n$th root means. The definition is forced.",
        },
        {
          name: "General rational exponent",
          expr: m`a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^{m} = \sqrt[n]{a^{m}}`,
          note: "Both readings give the same number. Take the root first — it keeps the numbers small enough to do in your head.",
        },
        {
          name: "Negative rational exponent",
          expr: m`a^{-\frac{m}{n}} = \frac{1}{a^{\frac{m}{n}}}`,
          note: "The minus still just means move across the bar. It does not flip the fraction inside the exponent.",
        },
        {
          name: "Negative fraction base",
          expr: m`\left(\frac{a}{b}\right)^{-\frac{m}{n}} = \left(\frac{b}{a}\right)^{\frac{m}{n}}`,
          note: "Flip the base, then work with a positive exponent.",
        },
        {
          name: "All the old laws still hold",
          expr: m`a^{\frac{1}{2}}a^{\frac{1}{3}} = a^{\frac{1}{2}+\frac{1}{3}} = a^{\frac{5}{6}}`,
          note: "Product, quotient, power of a power, power of a product — unchanged. The only new work is adding and multiplying fractions.",
        },
      ],
      note: m`Watch the bracket, exactly as in the integer case: $-64^{\frac{1}{2}} = -8$ because the exponent binds only to the 64, while $(-64)^{\frac{1}{2}}$ is not a real number at all.`,
    },
    {
      kind: "checklist",
      id: "existence",
      title: "Does the answer exist?",
      intro:
        "Check this before doing any work. It costs three seconds and it is the difference between " +
        "an answer and a wrong answer.",
      items: [
        {
          label: "Base positive — always fine",
          detail: "Any rational exponent on a positive base gives a positive real number. No check needed.",
        },
        {
          label: "Base negative, denominator odd — fine",
          detail: m`An odd root of a negative number is a negative number: $(-243)^{\frac{1}{5}} = -3$, because $(-3)^{5} = -243$.`,
        },
        {
          label: "Base negative, denominator even — not a real number",
          detail: m`$(-16)^{\frac{1}{4}}$ has no real value: no real number to the fourth power is negative. Say so rather than guessing a sign.`,
        },
        {
          label: "Base zero, exponent negative — undefined",
          detail: m`$0^{-\frac{1}{2}}$ would be $\frac{1}{0}$. Division by zero, so it is undefined.`,
        },
        {
          label: "Reduce the fraction before deciding",
          detail: m`$(-8)^{\frac{2}{6}}$ looks even-rooted, but $\frac{2}{6} = \frac{1}{3}$, and the cube root is fine. Always reduce first.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "evaluating",
      title: "Worked examples — evaluating",
      intro:
        "These want a single number with no exponents left. The move that makes them easy is always " +
        "the same: root first, power second.",
      examples: [
        {
          id: "re-1",
          prompt: m`64^{\frac{1}{2}}`,
          pattern: "Unit fraction",
          tell: "Numerator 1, so this is a plain root and nothing else.",
          steps: [
            { expr: m`\sqrt{64}`, reason: "Denominator 2 means the square root." },
            { expr: m`8`, reason: m`$8^{2} = 64$.` },
          ],
          answer: m`8`,
          check: m`The principal root is the non-negative one, so the answer is $8$ and not $\pm 8$. Only an equation like $x^{2} = 64$ carries both signs.`,
        },
        {
          id: "re-2",
          prompt: m`-64^{\frac{1}{2}}`,
          pattern: "Sign outside the exponent",
          tell: "No bracket around the −64, so the minus is not part of the base.",
          steps: [
            { expr: m`-\left(64^{\frac{1}{2}}\right)`, reason: "The exponent binds tighter than the leading minus." },
            { expr: m`-8`, reason: m`$64^{\frac{1}{2}} = 8$, then apply the minus.` },
          ],
          answer: m`-8`,
          check: m`Contrast $(-64)^{\frac{1}{2}}$, which is not a real number: an even root of a negative base. One bracket is the difference between $-8$ and no answer at all.`,
        },
        {
          id: "re-3",
          prompt: m`(-243)^{\frac{1}{5}}`,
          pattern: "Odd root of a negative",
          tell: "Negative base with an odd denominator — legal, and the answer stays negative.",
          steps: [
            { expr: m`\sqrt[5]{-243}`, reason: "Denominator 5 means the fifth root." },
            { expr: m`-3`, reason: m`$(-3)^{5} = -243$; an odd power preserves the sign.` },
          ],
          answer: m`-3`,
        },
        {
          id: "re-4",
          prompt: m`121^{-\frac{1}{2}}`,
          pattern: "Negative unit fraction",
          tell: "Minus in the exponent means reciprocal; the fraction itself still means a root.",
          steps: [
            { expr: m`\frac{1}{121^{\frac{1}{2}}}`, reason: "The negative exponent moves the whole power to the denominator." },
            { expr: m`\frac{1}{11}`, reason: m`$\sqrt{121} = 11$.` },
          ],
          answer: m`\frac{1}{11}`,
          check: "The answer is positive. A negative exponent never produces a negative number.",
        },
        {
          id: "re-5",
          prompt: m`(-64)^{-\frac{1}{3}}`,
          pattern: "Negative base and negative exponent",
          tell: "Two minuses doing two different jobs — one is the base's sign, one is a reciprocal.",
          steps: [
            { expr: m`\frac{1}{(-64)^{\frac{1}{3}}}`, reason: "Handle the negative exponent first: take the reciprocal." },
            { expr: m`\frac{1}{-4}`, reason: m`$\sqrt[3]{-64} = -4$, since the index is odd.` },
            { expr: m`-\frac{1}{4}`, reason: "Write the sign out front." },
          ],
          answer: m`-\frac{1}{4}`,
          check: "The sign came from the base, not from the exponent. Keeping the two jobs separate is the whole of this problem.",
        },
        {
          id: "re-6",
          prompt: m`\left(\frac{625}{256}\right)^{\frac{1}{4}}`,
          pattern: "Root of a fraction",
          tell: "A fraction base — the root goes to the top and the bottom separately.",
          steps: [
            { expr: m`\frac{625^{\frac{1}{4}}}{256^{\frac{1}{4}}}`, reason: "Power of a quotient." },
            { expr: m`\frac{5}{4}`, reason: m`$5^{4} = 625$ and $4^{4} = 256$.` },
          ],
          answer: m`\frac{5}{4}`,
        },
        {
          id: "re-7",
          prompt: m`49^{\frac{5}{2}}`,
          pattern: "Root first, power second",
          tell: "Numerator bigger than 1. Doing the power first means squaring 49 five times over for no reason.",
          steps: [
            { expr: m`\left(49^{\frac{1}{2}}\right)^{5}`, reason: m`Split $\frac{5}{2}$ as $\frac{1}{2}$ then $5$ — the root is the cheap part.` },
            { expr: m`7^{5}`, reason: m`$\sqrt{49} = 7$.` },
            { expr: m`16807`, reason: m`$7^{5} = 16807$.` },
          ],
          answer: m`16807`,
          check: m`The other reading is $\sqrt{49^{5}} = \sqrt{282475249}$. Same answer, far worse arithmetic — which is why root-first is the rule.`,
        },
        {
          id: "re-8",
          prompt: m`64^{-\frac{5}{6}}`,
          pattern: "All three moves at once",
          tell: "Negative sign, a denominator, and a numerator. Do them in that order: reciprocal, root, power.",
          steps: [
            { expr: m`\frac{1}{64^{\frac{5}{6}}}`, reason: "Negative exponent: take the reciprocal." },
            { expr: m`\frac{1}{\left(\sqrt[6]{64}\right)^{5}}`, reason: "Denominator 6 is the root, numerator 5 is the power." },
            { expr: m`\frac{1}{2^{5}}`, reason: m`$2^{6} = 64$, so $\sqrt[6]{64} = 2$.` },
            { expr: m`\frac{1}{32}`, reason: m`$2^{5} = 32$.` },
          ],
          answer: m`\frac{1}{32}`,
        },
        {
          id: "re-9",
          prompt: m`(-729)^{\frac{4}{3}}`,
          pattern: "Negative base, even numerator",
          tell: "Odd denominator makes the root legal; the even numerator then makes the answer positive.",
          steps: [
            { expr: m`\left(\sqrt[3]{-729}\right)^{4}`, reason: "Cube root first — odd index, so a negative base is fine." },
            { expr: m`(-9)^{4}`, reason: m`$(-9)^{3} = -729$.` },
            { expr: m`6561`, reason: "An even power kills the sign." },
          ],
          answer: m`6561`,
          check: "Taking the root first also shows why the answer is positive. Powering first would hide the sign change inside a nine-digit number.",
        },
        {
          id: "re-10",
          prompt: m`\left(\frac{121}{36}\right)^{-\frac{3}{2}}`,
          pattern: "Flip, root, power",
          tell: "A negative exponent on a fraction — flipping the base is quicker than moving the whole power.",
          steps: [
            { expr: m`\left(\frac{36}{121}\right)^{\frac{3}{2}}`, reason: "Flip the base and the exponent turns positive." },
            { expr: m`\left(\sqrt{\frac{36}{121}}\right)^{3}`, reason: "Root first." },
            { expr: m`\left(\frac{6}{11}\right)^{3}`, reason: m`$\sqrt{36} = 6$ and $\sqrt{121} = 11$.` },
            { expr: m`\frac{216}{1331}`, reason: "Cube the top and the bottom." },
          ],
          answer: m`\frac{216}{1331}`,
        },
        {
          id: "re-11",
          prompt: m`\left(-\frac{32}{243}\right)^{\frac{2}{5}}`,
          pattern: "Negative fraction base",
          tell: "Odd denominator, so the fifth root of a negative fraction is fine; the even numerator then makes it positive.",
          steps: [
            { expr: m`\left(\sqrt[5]{-\frac{32}{243}}\right)^{2}`, reason: "Fifth root first." },
            { expr: m`\left(-\frac{2}{3}\right)^{2}`, reason: m`$(-2)^{5} = -32$ and $3^{5} = 243$.` },
            { expr: m`\frac{4}{9}`, reason: "Square it; the sign goes." },
          ],
          answer: m`\frac{4}{9}`,
        },
      ],
    },
    {
      kind: "examples",
      id: "simplifying",
      title: "Worked examples — simplifying",
      intro:
        "These want letters, not numbers, and the answer must carry only positive exponents. It is " +
        "the same four-step clean-up as integer exponents, with fraction arithmetic on the exponents.",
      examples: [
        {
          id: "rs-1",
          prompt: m`\left(p^{-2}q^{-4}\right)^{\frac{3}{2}}`,
          pattern: "Power of a product",
          tell: "A bracket of factors raised to a fraction: the fraction multiplies into each exponent.",
          steps: [
            { expr: m`p^{-2 \cdot \frac{3}{2}}q^{-4 \cdot \frac{3}{2}}`, reason: "Power of a power, once per factor." },
            { expr: m`p^{-3}q^{-6}`, reason: m`$-2 \cdot \frac{3}{2} = -3$ and $-4 \cdot \frac{3}{2} = -6$.` },
            { expr: m`\frac{1}{p^{3}q^{6}}`, reason: "Cross the bar so no exponent is negative." },
          ],
          answer: m`\frac{1}{p^{3}q^{6}}`,
        },
        {
          id: "rs-2",
          prompt: m`x^{\frac{3}{4}}\left(x^{2}x^{-\frac{1}{3}}\right)^{\frac{3}{2}}`,
          pattern: "Inside the bracket first",
          tell: "One base throughout, so this is pure exponent arithmetic. Collect inside the bracket before applying the outer power.",
          steps: [
            { expr: m`x^{\frac{3}{4}}\left(x^{\frac{5}{3}}\right)^{\frac{3}{2}}`, reason: m`Product rule inside: $2 - \frac{1}{3} = \frac{5}{3}$.` },
            { expr: m`x^{\frac{3}{4}}x^{\frac{5}{2}}`, reason: m`Power of a power: $\frac{5}{3} \cdot \frac{3}{2} = \frac{5}{2}$.` },
            { expr: m`x^{\frac{3}{4}+\frac{10}{4}}`, reason: m`Product rule; common denominator 4 turns $\frac{5}{2}$ into $\frac{10}{4}$.` },
            { expr: m`x^{\frac{13}{4}}`, reason: "Add." },
          ],
          answer: m`x^{\frac{13}{4}}`,
        },
        {
          id: "rs-3",
          prompt: m`a^{\frac{1}{2}}a^{-\frac{1}{3}}a^{\frac{1}{4}}`,
          pattern: "Product rule with fractions",
          tell: "Same base three times. One addition sum, done over a common denominator.",
          steps: [
            { expr: m`a^{\frac{1}{2}-\frac{1}{3}+\frac{1}{4}}`, reason: "Product rule: add every exponent." },
            { expr: m`a^{\frac{6}{12}-\frac{4}{12}+\frac{3}{12}}`, reason: "Common denominator 12." },
            { expr: m`a^{\frac{5}{12}}`, reason: m`$6 - 4 + 3 = 5$.` },
          ],
          answer: m`a^{\frac{5}{12}}`,
        },
        {
          id: "rs-4",
          prompt: m`\left(m^{-\frac{7}{3}}n^{\frac{5}{4}}\right)^{-\frac{8}{9}}`,
          pattern: "Multiplying two fractions",
          tell: "A fractional power of a bracket — multiply, cancel where you can, and watch both signs.",
          steps: [
            { expr: m`m^{-\frac{7}{3} \cdot -\frac{8}{9}}n^{\frac{5}{4} \cdot -\frac{8}{9}}`, reason: "Power of a power on each factor." },
            { expr: m`m^{\frac{56}{27}}n^{-\frac{10}{9}}`, reason: m`Two negatives give $+\frac{56}{27}$; for $n$, the 4 cancels into the 8 leaving $-\frac{10}{9}$.` },
            { expr: m`\frac{m^{\frac{56}{27}}}{n^{\frac{10}{9}}}`, reason: "Cross the bar." },
          ],
          answer: m`\frac{m^{\frac{56}{27}}}{n^{\frac{10}{9}}}`,
        },
        {
          id: "rs-5",
          prompt: m`\left(\frac{a^{-\frac{1}{3}}b^{2}}{b^{\frac{2}{3}}a^{-\frac{3}{4}}}\right)^{\frac{1}{5}}`,
          pattern: "Collect inside, then apply the outer power",
          tell: "Two bases on both sides of the bar, inside one outer exponent. Reduce the inside to one power per base first.",
          steps: [
            { expr: m`\left(a^{-\frac{1}{3}-\left(-\frac{3}{4}\right)}b^{2-\frac{2}{3}}\right)^{\frac{1}{5}}`, reason: "Quotient rule per base, still inside the bracket." },
            { expr: m`\left(a^{\frac{5}{12}}b^{\frac{4}{3}}\right)^{\frac{1}{5}}`, reason: m`$-\frac{4}{12}+\frac{9}{12}=\frac{5}{12}$ and $\frac{6}{3}-\frac{2}{3}=\frac{4}{3}$.` },
            { expr: m`a^{\frac{5}{60}}b^{\frac{4}{15}}`, reason: "Multiply each exponent by the outer fifth." },
            { expr: m`a^{\frac{1}{12}}b^{\frac{4}{15}}`, reason: m`Reduce $\frac{5}{60}$ to $\frac{1}{12}$. Always leave exponents in lowest terms.` },
          ],
          answer: m`a^{\frac{1}{12}}b^{\frac{4}{15}}`,
        },
        {
          id: "rs-6",
          prompt: m`\left(\frac{p^{\frac{1}{2}}q^{\frac{1}{3}}}{p^{-\frac{1}{3}}q^{-\frac{1}{4}}}\right)^{-3}`,
          pattern: "Negative exponents below the bar",
          tell: "Everything on the bottom is negative, so subtracting it adds. The outer exponent is a plain integer.",
          steps: [
            { expr: m`\left(p^{\frac{1}{2}+\frac{1}{3}}q^{\frac{1}{3}+\frac{1}{4}}\right)^{-3}`, reason: "Quotient rule: subtracting a negative exponent adds it." },
            { expr: m`\left(p^{\frac{5}{6}}q^{\frac{7}{12}}\right)^{-3}`, reason: m`$\frac{3}{6}+\frac{2}{6}=\frac{5}{6}$ and $\frac{4}{12}+\frac{3}{12}=\frac{7}{12}$.` },
            { expr: m`p^{-\frac{5}{2}}q^{-\frac{7}{4}}`, reason: m`Multiply by $-3$: $\frac{5}{6} \cdot 3 = \frac{5}{2}$ and $\frac{7}{12} \cdot 3 = \frac{7}{4}$.` },
            { expr: m`\frac{1}{p^{\frac{5}{2}}q^{\frac{7}{4}}}`, reason: "Cross the bar." },
          ],
          answer: m`\frac{1}{p^{\frac{5}{2}}q^{\frac{7}{4}}}`,
        },
        {
          id: "rs-7",
          prompt: m`\left(\frac{b^{3}c^{-\frac{1}{4}}a^{-1}}{b^{\frac{1}{4}}a^{-\frac{2}{7}}c^{\frac{3}{2}}}\right)^{\frac{2}{3}}`,
          pattern: "Three bases, one outer fraction",
          tell: "The hardest-looking kind, and still the same routine — one base at a time, then one multiplication each.",
          steps: [
            { expr: m`\left(a^{-1+\frac{2}{7}}b^{3-\frac{1}{4}}c^{-\frac{1}{4}-\frac{3}{2}}\right)^{\frac{2}{3}}`, reason: "Quotient rule per base." },
            { expr: m`\left(a^{-\frac{5}{7}}b^{\frac{11}{4}}c^{-\frac{7}{4}}\right)^{\frac{2}{3}}`, reason: m`$-\frac{7}{7}+\frac{2}{7}=-\frac{5}{7}$, $\frac{12}{4}-\frac{1}{4}=\frac{11}{4}$, $-\frac{1}{4}-\frac{6}{4}=-\frac{7}{4}$.` },
            { expr: m`a^{-\frac{10}{21}}b^{\frac{11}{6}}c^{-\frac{7}{6}}`, reason: m`Multiply each by $\frac{2}{3}$; the 4 and the 2 cancel for $b$ and $c$.` },
            { expr: m`\frac{b^{\frac{11}{6}}}{a^{\frac{10}{21}}c^{\frac{7}{6}}}`, reason: "Cross the bar with both negatives." },
          ],
          answer: m`\frac{b^{\frac{11}{6}}}{a^{\frac{10}{21}}c^{\frac{7}{6}}}`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "True or false",
      intro: "Both of these come from reading the minus sign as though it lived inside the fraction.",
      traps: [
        {
          wrong: m`a^{-\frac{3}{2}} = a^{\frac{2}{3}}`,
          right: m`a^{-\frac{3}{2}} = \frac{1}{a^{\frac{3}{2}}}`,
          why: m`Negating an exponent is not the same as turning it upside down. A minus moves the power across the bar and leaves $\frac{3}{2}$ exactly as it was. Test at $a = 4$: $4^{-\frac{3}{2}} = \frac{1}{8}$, while $4^{\frac{2}{3}} \approx 2.52$.`,
        },
        {
          wrong: m`x^{-n} = x^{\frac{1}{n}}`,
          right: m`x^{-n} = \frac{1}{x^{n}}`,
          why: m`The reciprocal belongs to the whole power, not to the exponent. $x^{\frac{1}{n}}$ is something else entirely — it is $\sqrt[n]{x}$. Test at $x = 2, n = 3$: $2^{-3} = \frac{1}{8}$, while $2^{\frac{1}{3}} \approx 1.26$.`,
        },
        {
          wrong: m`(-16)^{\frac{1}{4}} = -2`,
          right: m`\text{Not a real number.}`,
          why: m`$(-2)^{4} = 16$, not $-16$. An even root of a negative base has no real value, so the right answer is to say so — not to attach a minus to the positive root.`,
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Root first, then power, then tidy the sign.",
      problems: [
        { prompt: m`16^{\frac{1}{4}}`, answer: m`2`, hint: m`Which number to the fourth power gives 16?` },
        {
          prompt: m`\left(-\frac{27}{8}\right)^{\frac{1}{3}}`,
          answer: m`-\frac{3}{2}`,
          hint: "Odd index, so the negative survives.",
        },
        {
          prompt: m`\left(\frac{81}{625}\right)^{\frac{3}{4}}`,
          answer: m`\frac{27}{125}`,
          hint: m`Fourth root of each part first: $\frac{3}{5}$. Then cube.`,
        },
        {
          prompt: m`\left(\frac{x^{\frac{3}{4}}y^{-\frac{2}{3}}}{x^{\frac{7}{4}}}\right)^{\frac{7}{8}}`,
          answer: m`\frac{1}{x^{\frac{7}{8}}y^{\frac{7}{12}}}`,
          hint: m`Inside, $x$ collects to $\frac{3}{4}-\frac{7}{4} = -1$.`,
        },
        {
          prompt: m`\left(8x^{6}\right)^{\frac{2}{3}}`,
          answer: m`4x^{4}`,
          hint: m`The coefficient takes the exponent too: $8^{\frac{2}{3}} = \left(\sqrt[3]{8}\right)^{2}$.`,
        },
        {
          prompt: m`\frac{y^{\frac{5}{6}}}{y^{\frac{1}{2}}}`,
          answer: m`y^{\frac{1}{3}}`,
          hint: m`$\frac{5}{6}-\frac{3}{6}=\frac{2}{6}$, which reduces.`,
        },
      ],
    },
  ],
};
