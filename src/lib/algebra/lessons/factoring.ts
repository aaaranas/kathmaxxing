import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const factoring: Lesson = {
  slug: "factoring",
  title: "Factoring",
  blurb: "Every pattern, in the order you should try them — GCF, squares, cubes, grouping, trinomials.",
  source: "Factoring exercises with solutions",
  summary:
    "Factoring is multiplication read backwards, so every identity below can be checked by expanding " +
    "it again — and you should, every time. The skill is not memorising nine patterns; it is looking " +
    "at an expression and knowing which one it is before you start writing. That recognition step is " +
    "what the worked solutions lead with, and each example here names the tell before it names the move.",
  sections: [
    {
      kind: "checklist",
      id: "order",
      title: "The order of attack",
      intro:
        "Work down this list every time. Most mistakes are not arithmetic — they are starting at " +
        "step three when step one was still available.",
      items: [
        {
          label: "1. Greatest common factor, always first",
          detail:
            "Take out everything every term shares: the numeric GCF and the lowest power of each " +
            "common letter. A GCF pulled out first often turns what is left into a pattern you can " +
            "already see. Skipping it is the single most common reason an answer is marked incomplete.",
        },
        {
          label: "2. Count the terms",
          detail: m`Two terms: look for a difference of squares, or a sum or difference of cubes. Three terms: a perfect square trinomial or an ordinary trinomial. Four terms: grouping. The count tells you which shelf to reach for.`,
        },
        {
          label: "3. Look for a substitution",
          detail: m`If the exponents come in a $2n$-and-$n$ pattern ($z^{4}$ and $z^{2}$, $m^{4}$ and $m^{2}$) or the same binomial appears twice, set $u$ equal to the repeating part. The problem collapses to one you have already solved.`,
        },
        {
          label: "4. Factor completely",
          detail: m`Look at every factor you produced and ask whether it factors again. $x^{4}-y^{4}$ is not finished at $(x^{2}+y^{2})(x^{2}-y^{2})$, and $(4z^{2}-1)(z^{2}-2)$ is not finished either.`,
        },
        {
          label: "5. Check by expanding",
          detail:
            "Multiply your factors back out. This is not optional politeness — it catches every sign " +
            "error, and it is exactly how the worked solutions verify themselves.",
        },
      ],
    },
    {
      kind: "rules",
      id: "identities",
      title: "The identities",
      intro:
        "Learn each one in both directions. Left to right factors; right to left expands, which is " +
        "how you check.",
      rules: [
        {
          name: "Common factor",
          expr: m`ab + ac + ad = a(b + c + d)`,
          note: "The distributive law, used backwards. Works for any number of terms.",
        },
        {
          name: "Difference of squares",
          expr: m`a^{2} - b^{2} = (a + b)(a - b)`,
          note: "Two terms, both perfect squares, separated by a minus. The middle terms cancel when you expand, which is why nothing is left over.",
        },
        {
          name: "Sum of squares",
          expr: m`a^{2} + b^{2} \text{ does not factor over the reals}`,
          note: "There is no identity for it. Recognising it as unfactorable is itself the answer — unless a trick term can be added and subtracted (see below).",
        },
        {
          name: "Perfect square trinomial",
          expr: m`a^{2} + 2ab + b^{2} = (a + b)^{2}`,
          note: m`Three terms, first and last are perfect squares, middle is exactly twice the product of their roots.`,
        },
        {
          name: "Perfect square trinomial, negative",
          expr: m`a^{2} - 2ab + b^{2} = (a - b)^{2}`,
          note: "Same shape with a minus in the middle. The sign of the middle term is the sign inside the bracket.",
        },
        {
          name: "Sum of cubes",
          expr: m`a^{3} + b^{3} = (a + b)\left(a^{2} - ab + b^{2}\right)`,
          note: "Signs read Same, Opposite, Always Positive. The trinomial never factors further.",
        },
        {
          name: "Difference of cubes",
          expr: m`a^{3} - b^{3} = (a - b)\left(a^{2} + ab + b^{2}\right)`,
          note: "Same pattern, same sign rule. Only the binomial's sign changes.",
        },
        {
          name: "Grouping",
          expr: m`ax + ay + bx + by = a(x + y) + b(x + y) = (a + b)(x + y)`,
          note: "Four terms: split into two pairs, take a GCF from each, and the leftover brackets must match exactly. If they do not, try re-pairing.",
        },
        {
          name: "Simple trinomial",
          expr: m`x^{2} + (p + q)x + pq = (x + p)(x + q)`,
          note: m`Leading coefficient 1: find two numbers that multiply to the constant and add to the middle coefficient.`,
        },
        {
          name: "General trinomial",
          expr: m`ax^{2} + bx + c \;\to\; \text{split } b \text{ into two numbers with product } ac`,
          note: "The ac method. Splitting the middle term turns any trinomial into a grouping problem.",
        },
      ],
    },
    {
      kind: "examples",
      id: "gcf",
      title: "Common factors",
      intro: "Nothing else is attempted until this is done.",
      examples: [
        {
          id: "f-1",
          prompt: m`4x + 8y + 12z`,
          pattern: "Numeric GCF",
          tell: "Three terms, all coefficients divisible by 4, no shared letter.",
          steps: [
            { expr: m`4 \cdot x + 4 \cdot 2y + 4 \cdot 3z`, reason: m`Write each term as 4 times something.` },
            { expr: m`4(x + 2y + 3z)`, reason: "Distributive law backwards." },
          ],
          answer: m`4(x + 2y + 3z)`,
          check: m`Expand: $4x + 8y + 12z$. The bracket has no common factor left, so it is finished.`,
        },
        {
          id: "f-2",
          prompt: m`10a^{2}b^{3}c^{4} - 15a^{3}b^{2}c^{4} + 30a^{4}b^{3}c^{2}`,
          pattern: "GCF with several variables",
          tell: "Three terms sharing every letter. Take the numeric GCF and the lowest power of each letter.",
          steps: [
            { expr: m`\text{GCF} = 5a^{2}b^{2}c^{2}`, reason: m`$\gcd(10,15,30) = 5$; the lowest powers present are $a^{2}$, $b^{2}$ and $c^{2}$.` },
            { expr: m`5a^{2}b^{2}c^{2}\left(2bc^{2} - 3ac^{2} + 6a^{2}b\right)`, reason: "Divide each term by the GCF to get what stays inside." },
          ],
          answer: m`5a^{2}b^{2}c^{2}\left(2bc^{2} - 3ac^{2} + 6a^{2}b\right)`,
          check: m`Expand the first term back: $5a^{2}b^{2}c^{2} \cdot 2bc^{2} = 10a^{2}b^{3}c^{4}$. Do the same for the other two.`,
        },
        {
          id: "f-3",
          prompt: m`x^{2}y^{2} - 36y^{4}`,
          pattern: "GCF, then difference of squares",
          tell: m`Two terms sharing $y^{2}$. What is left after the GCF is a difference of squares — which is why the GCF comes first.`,
          steps: [
            { expr: m`y^{2}\left(x^{2} - 36y^{2}\right)`, reason: m`GCF is $y^{2}$.` },
            { expr: m`y^{2}\left(x^{2} - (6y)^{2}\right)`, reason: m`Recognise the bracket: $a = x$, $b = 6y$.` },
            { expr: m`y^{2}(x + 6y)(x - 6y)`, reason: "Difference of squares." },
          ],
          answer: m`y^{2}(x + 6y)(x - 6y)`,
          check: m`Without the GCF step the expression is not a difference of squares at all — $x^{2}y^{2}-36y^{4}$ is, but you would have to spot $a = xy$, $b = 6y^{2}$ to see it. Taking the GCF out makes it obvious.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "two-terms",
      title: "Two terms — squares and cubes",
      intro:
        "With two terms there are only three possibilities: difference of squares, sum of cubes, " +
        "difference of cubes. A sum of squares is none of them.",
      examples: [
        {
          id: "f-4",
          prompt: m`x^{4} - y^{4}`,
          pattern: "Difference of squares, twice",
          tell: "Both terms are perfect squares, and after one pass one of the factors still is.",
          steps: [
            { expr: m`\left(x^{2}\right)^{2} - \left(y^{2}\right)^{2}`, reason: m`Name the parts: $a = x^{2}$, $b = y^{2}$.` },
            { expr: m`\left(x^{2} + y^{2}\right)\left(x^{2} - y^{2}\right)`, reason: "Difference of squares." },
            { expr: m`\left(x^{2} + y^{2}\right)(x + y)(x - y)`, reason: m`The second factor is another difference of squares. The first is a sum of squares and stops here.` },
          ],
          answer: m`\left(x^{2} + y^{2}\right)(x + y)(x - y)`,
          check:
            "Stopping after the first line is the most common way to lose marks on this problem. " +
            "Always re-examine every factor you produce.",
        },
        {
          id: "f-5",
          prompt: m`x^{3} + 8`,
          pattern: "Sum of cubes",
          tell: m`Two terms, both perfect cubes, added. $8 = 2^{3}$.`,
          steps: [
            { expr: m`x^{3} + 2^{3}`, reason: m`Name the parts: $a = x$, $b = 2$.` },
            { expr: m`(x + 2)\left(x^{2} - 2x + 2^{2}\right)`, reason: m`Sum of cubes: $(a+b)\left(a^{2}-ab+b^{2}\right)$.` },
            { expr: m`(x + 2)\left(x^{2} - 2x + 4\right)`, reason: "Evaluate the square." },
          ],
          answer: m`(x + 2)\left(x^{2} - 2x + 4\right)`,
          check: m`Expand: $x^{3} - 2x^{2} + 4x + 2x^{2} - 4x + 8$. The $x^{2}$ terms cancel, the $x$ terms cancel, leaving $x^{3} + 8$. That cancellation is the whole reason the identity works.`,
        },
        {
          id: "f-6",
          prompt: m`64 + z^{3}`,
          pattern: "Sum of cubes, constant first",
          tell: m`The order of the terms does not matter — $64 = 4^{3}$, so this is still $a^{3}+b^{3}$ with $a = 4$.`,
          steps: [
            { expr: m`4^{3} + z^{3}`, reason: m`$a = 4$, $b = z$.` },
            { expr: m`(4 + z)\left(4^{2} - 4z + z^{2}\right)`, reason: "Sum of cubes." },
            { expr: m`(4 + z)\left(16 - 4z + z^{2}\right)`, reason: "Evaluate." },
          ],
          answer: m`(4 + z)\left(16 - 4z + z^{2}\right)`,
        },
        {
          id: "f-7",
          prompt: m`(x + y)^{3} - z^{3}`,
          pattern: "Difference of cubes with a binomial",
          tell: m`A whole binomial is being cubed. Set $a = x+y$ and the identity applies unchanged.`,
          steps: [
            { expr: m`\text{let } a = x + y, \; b = z`, reason: "Name the parts before substituting. This is what keeps the expansion straight." },
            { expr: m`[(x + y) - z]\left[(x + y)^{2} + z(x + y) + z^{2}\right]`, reason: m`Difference of cubes: $(a-b)\left(a^{2}+ab+b^{2}\right)$.` },
            { expr: m`(x + y - z)\left(x^{2} + 2xy + y^{2} + xz + yz + z^{2}\right)`, reason: m`Expand $(x+y)^{2}$ and distribute the $z$.` },
          ],
          answer: m`(x + y - z)\left(x^{2} + 2xy + y^{2} + xz + yz + z^{2}\right)`,
          check: m`Keeping $(x+y)$ inside brackets until the identity is applied is what prevents the classic error of writing $x^{3}+y^{3}$ for $(x+y)^{3}$.`,
        },
        {
          id: "f-8",
          prompt: m`a^{4} + a^{2}b^{2} + b^{4}`,
          pattern: "Add and subtract a term",
          tell:
            "Three terms, first and last are perfect squares, but the middle is only half of what a " +
            "perfect square trinomial needs. Force the square, then pay it back.",
          steps: [
            { expr: m`a^{4} + 2a^{2}b^{2} + b^{4} - a^{2}b^{2}`, reason: m`A perfect square needs $2a^{2}b^{2}$ in the middle; add the missing $a^{2}b^{2}$ and subtract it again so nothing changes.` },
            { expr: m`\left(a^{2} + b^{2}\right)^{2} - (ab)^{2}`, reason: "The first three terms are now a perfect square trinomial." },
            { expr: m`\text{let } x = a^{2} + b^{2}, \; y = ab`, reason: "What remains is a difference of squares in disguise." },
            { expr: m`\left[\left(a^{2} + b^{2}\right) + ab\right]\left[\left(a^{2} + b^{2}\right) - ab\right]`, reason: m`$x^{2}-y^{2} = (x+y)(x-y)$.` },
            { expr: m`\left(a^{2} + ab + b^{2}\right)\left(a^{2} - ab + b^{2}\right)`, reason: "Tidy each bracket into standard order." },
          ],
          answer: m`\left(a^{2} + ab + b^{2}\right)\left(a^{2} - ab + b^{2}\right)`,
          check:
            "This is the one pattern you cannot reach by working down the checklist — it has to be " +
            "recognised. The tell is a trinomial whose outer terms are squares and whose middle term " +
            "is short of twice their product.",
        },
      ],
    },
    {
      kind: "examples",
      id: "three-terms",
      title: "Three terms — trinomials",
      intro:
        "Check for a perfect square first: it is the fastest case and it is easy to miss once you " +
        "have started hunting for factor pairs.",
      examples: [
        {
          id: "f-9",
          prompt: m`25x^{2} + 60xy + 36y^{2}`,
          pattern: "Perfect square trinomial",
          tell: m`$25x^{2} = (5x)^{2}$, $36y^{2} = (6y)^{2}$, and $2(5x)(6y) = 60xy$ — the middle term matches exactly.`,
          steps: [
            { expr: m`(5x)^{2} + 2(5x)(6y) + (6y)^{2}`, reason: m`Name the parts: $a = 5x$, $b = 6y$, and confirm the middle term.` },
            { expr: m`(5x + 6y)^{2}`, reason: m`$a^{2}+2ab+b^{2} = (a+b)^{2}$.` },
          ],
          answer: m`(5x + 6y)^{2}`,
          check: m`Expand: $(5x+6y)(5x+6y) = 25x^{2} + 30xy + 30xy + 36y^{2} = 25x^{2} + 60xy + 36y^{2}$. The two equal middle products are where the "twice" in the identity comes from.`,
        },
        {
          id: "f-10",
          prompt: m`16m^{2} - 40mn + 25n^{2}`,
          pattern: "Perfect square trinomial, negative middle",
          tell: m`$16m^{2} = (4m)^{2}$, $25n^{2} = (5n)^{2}$, and $2(4m)(5n) = 40mn$ with a minus in front.`,
          steps: [
            { expr: m`(4m)^{2} - 2(4m)(5n) + (5n)^{2}`, reason: m`$a = 4m$, $b = 5n$.` },
            { expr: m`(4m - 5n)^{2}`, reason: "The middle sign goes inside the bracket." },
          ],
          answer: m`(4m - 5n)^{2}`,
          check: m`Expand: $16m^{2} - 20mn - 20mn + 25n^{2} = 16m^{2} - 40mn + 25n^{2}$.`,
        },
        {
          id: "f-11",
          prompt: m`x^{2} - 7xy + 12y^{2}`,
          pattern: "Simple trinomial",
          tell: m`Leading coefficient 1, so look for two numbers with product 12 and sum $-7$.`,
          steps: [
            { expr: m`\text{product } 12, \; \text{sum } -7 \;\Rightarrow\; -3, -4`, reason: "Both negative, because the product is positive and the sum is negative." },
            { expr: m`(x - 3y)(x - 4y)`, reason: m`The $y$ rides along with each constant, since the last term carries $y^{2}$.` },
          ],
          answer: m`(x - 3y)(x - 4y)`,
          check: m`Expand: $x^{2} - 4xy - 3xy + 12y^{2} = x^{2} - 7xy + 12y^{2}$.`,
        },
        {
          id: "f-12",
          prompt: m`6x^{2} - xy - 12y^{2}`,
          pattern: "ac method",
          tell: m`Leading coefficient is not 1, so split the middle term instead of guessing brackets.`,
          steps: [
            { expr: m`ac = 6 \cdot (-12) = -72`, reason: "Multiply the first coefficient by the last." },
            { expr: m`-9 \text{ and } 8`, reason: m`Two numbers with product $-72$ and sum $-1$, the middle coefficient.` },
            { expr: m`6x^{2} - 9xy + 8xy - 12y^{2}`, reason: "Split the middle term using those two numbers. Either order works." },
            { expr: m`3x(2x - 3y) + 4y(2x - 3y)`, reason: "GCF from each pair. The two brackets must match — if they do not, re-check the split." },
            { expr: m`(3x + 4y)(2x - 3y)`, reason: "Factor out the common bracket." },
          ],
          answer: m`(3x + 4y)(2x - 3y)`,
          check: m`Expand: $6x^{2} - 9xy + 8xy - 12y^{2} = 6x^{2} - xy - 12y^{2}$.`,
        },
        {
          id: "f-13",
          prompt: m`-3x^{2} - x + 10`,
          pattern: "Negative leading coefficient",
          tell: "A negative in front of the squared term. Pull out −1 before anything else — it makes the ac method behave.",
          steps: [
            { expr: m`-1\left(3x^{2} + x - 10\right)`, reason: "Factor out −1, flipping every sign inside." },
            { expr: m`ac = 3 \cdot (-10) = -30 \;\Rightarrow\; 6, -5`, reason: m`Product $-30$, sum $+1$.` },
            { expr: m`-1\left(3x^{2} + 6x - 5x - 10\right)`, reason: "Split the middle term." },
            { expr: m`-1[3x(x + 2) - 5(x + 2)]`, reason: m`GCF from each pair. The second pair needs $-5$, not $5$, for the brackets to match.` },
            { expr: m`-(3x - 5)(x + 2)`, reason: "Factor out the common bracket; the −1 stays out front." },
          ],
          answer: m`-(3x - 5)(x + 2)`,
          check: m`Expand: $(3x-5)(x+2) = 3x^{2} + x - 10$, and the leading minus flips it back to $-3x^{2} - x + 10$.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "four-terms",
      title: "Four terms — grouping",
      intro:
        "Split into two pairs, take a GCF from each, and the brackets left behind must be identical. " +
        "If they are not, either the sign is wrong or the pairs are.",
      examples: [
        {
          id: "f-14",
          prompt: m`3ax - ay - 3bx + by`,
          pattern: "Grouping",
          tell: m`Four terms, and the first two share $a$ while the last two share $b$.`,
          steps: [
            { expr: m`a(3x - y) - b(3x - y)`, reason: m`GCF from each pair. Taking out $-b$ rather than $b$ is what makes the second bracket read $3x - y$ and match the first.` },
            { expr: m`(a - b)(3x - y)`, reason: m`The common bracket $(3x-y)$ factors out.` },
          ],
          answer: m`(a - b)(3x - y)`,
          check: m`Expand: $3ax - ay - 3bx + by$. If you had taken out $+b$ you would have $b(-3x+y)$, whose bracket does not match — that mismatch is the signal to change the sign, not to give up.`,
        },
        {
          id: "f-15",
          prompt: m`6x^{2} - 4ax - 9bx + 6ab`,
          pattern: "Grouping with coefficients",
          tell: "Four terms with nothing shared by all of them, but each pair has a common factor.",
          steps: [
            { expr: m`2x(3x - 2a) - 3b(3x - 2a)`, reason: m`GCF $2x$ from the first pair and $-3b$ from the second; both leave $3x - 2a$.` },
            { expr: m`(2x - 3b)(3x - 2a)`, reason: "Factor out the common bracket." },
          ],
          answer: m`(2x - 3b)(3x - 2a)`,
          check: m`Expand: $6x^{2} - 4ax - 9bx + 6ab$.`,
        },
        {
          id: "f-16",
          prompt: m`x^{2} - 6xy + 9y^{2} - 4z^{2}`,
          pattern: "Group three, then difference of squares",
          tell:
            "Four terms, but pairing them gets nowhere. Three of them form a perfect square trinomial, " +
            "and the fourth is a square on its own — so group 3 and 1, not 2 and 2.",
          steps: [
            { expr: m`\left(x^{2} - 6xy + 9y^{2}\right) - 4z^{2}`, reason: "Bracket the three that belong together." },
            { expr: m`(x - 3y)^{2} - (2z)^{2}`, reason: m`The trinomial is a perfect square with $a = x$, $b = 3y$; and $4z^{2} = (2z)^{2}$.` },
            { expr: m`\text{let } a = x - 3y, \; b = 2z`, reason: "Now it is a plain difference of squares." },
            { expr: m`[(x - 3y) + 2z][(x - 3y) - 2z]`, reason: m`$a^{2}-b^{2} = (a+b)(a-b)$.` },
            { expr: m`(x - 3y + 2z)(x - 3y - 2z)`, reason: "Drop the inner brackets." },
          ],
          answer: m`(x - 3y + 2z)(x - 3y - 2z)`,
          check: m`Check the square carefully: $(x-3y)^{2} = x^{2} - 6xy + 9y^{2}$. Writing $(x-3)^{2}$ instead is an easy slip and gives $x^{2}-6x+9$, which is not what is there.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "substitution",
      title: "Substitution",
      intro:
        m`When the exponents come in a $2n$-and-$n$ pattern, or a binomial repeats, name the repeating ` +
        "part and the problem becomes an ordinary trinomial. Substitute back at the very end — and " +
        "then check whether the result factors further.",
      examples: [
        {
          id: "f-17",
          prompt: m`m^{4} + m^{2} - 2`,
          pattern: "Substitution, then factor again",
          tell: m`$m^{4}$ is $\left(m^{2}\right)^{2}$, so in terms of $m^{2}$ this is a simple trinomial.`,
          steps: [
            { expr: m`\text{let } u = m^{2} \;\Rightarrow\; u^{2} + u - 2`, reason: "Substitute." },
            { expr: m`(u + 2)(u - 1)`, reason: m`Product $-2$, sum $+1$: the numbers are $2$ and $-1$.` },
            { expr: m`\left(m^{2} + 2\right)\left(m^{2} - 1\right)`, reason: m`Substitute $u = m^{2}$ back.` },
            { expr: m`\left(m^{2} + 2\right)(m + 1)(m - 1)`, reason: m`$m^{2}-1$ is a difference of squares. $m^{2}+2$ is a sum and stops.` },
          ],
          answer: m`\left(m^{2} + 2\right)(m + 1)(m - 1)`,
          check:
            "Substituting back is where the extra factor appears. Stopping at the substituted answer " +
            "leaves the problem unfinished.",
        },
        {
          id: "f-18",
          prompt: m`4z^{4} - 9z^{2} + 2`,
          pattern: "Substitution with the ac method",
          tell: m`Again a $2n$-and-$n$ pattern, but the leading coefficient is not 1, so ac is needed after substituting.`,
          steps: [
            { expr: m`\text{let } u = z^{2} \;\Rightarrow\; 4u^{2} - 9u + 2`, reason: "Substitute." },
            { expr: m`ac = 8 \;\Rightarrow\; -8 \text{ and } -1`, reason: m`Product 8, sum $-9$.` },
            { expr: m`4u^{2} - 8u - u + 2`, reason: "Split the middle term." },
            { expr: m`4u(u - 2) - 1(u - 2)`, reason: m`GCF from each pair. Writing the $-1$ explicitly is what keeps the second bracket matching.` },
            { expr: m`(4u - 1)(u - 2)`, reason: "Factor out the common bracket." },
            { expr: m`\left(4z^{2} - 1\right)\left(z^{2} - 2\right)`, reason: m`Substitute $u = z^{2}$ back.` },
            { expr: m`(2z + 1)(2z - 1)\left(z^{2} - 2\right)`, reason: m`$4z^{2}-1$ is a difference of squares. Over the integers $z^{2}-2$ does not factor, so this is complete.` },
          ],
          answer: m`(2z + 1)(2z - 1)\left(z^{2} - 2\right)`,
          check: m`If irrational factors are allowed, $z^{2}-2 = \left(z+\sqrt{2}\right)\left(z-\sqrt{2}\right)$. Which answer is wanted depends on whether the question says "over the integers" — by default it does.`,
        },
        {
          id: "f-19",
          prompt: m`12(x + y)^{2} + 8(x + y) - 15`,
          pattern: "Substituting a binomial",
          tell: m`The same binomial appears squared and to the first power. Let $u$ be the binomial.`,
          steps: [
            { expr: m`\text{let } u = x + y \;\Rightarrow\; 12u^{2} + 8u - 15`, reason: "Substitute." },
            { expr: m`ac = -180 \;\Rightarrow\; 18 \text{ and } -10`, reason: m`Product $-180$, sum $+8$.` },
            { expr: m`12u^{2} + 18u - 10u - 15`, reason: "Split the middle term." },
            { expr: m`6u(2u + 3) - 5(2u + 3)`, reason: "GCF from each pair." },
            { expr: m`(6u - 5)(2u + 3)`, reason: "Factor out the common bracket." },
            { expr: m`[6(x + y) - 5][2(x + y) + 3]`, reason: m`Substitute $u = x+y$ back.` },
            { expr: m`(6x + 6y - 5)(2x + 2y + 3)`, reason: "Distribute inside each bracket." },
          ],
          answer: m`(6x + 6y - 5)(2x + 2y + 3)`,
          check:
            "Expanding a binomial before substituting would turn this into a five-term mess. " +
            "Substitution is the move that keeps it a two-minute problem.",
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      intro: "Each of these is a real slip from real working, not a hypothetical.",
      traps: [
        {
          wrong: m`a^{2} + b^{2} = (a + b)^{2}`,
          right: m`(a + b)^{2} = a^{2} + 2ab + b^{2}`,
          why: m`A sum of squares does not factor over the reals at all. Expanding $(a+b)^{2}$ shows the missing $2ab$: test at $a = b = 1$, where $2 \ne 4$.`,
        },
        {
          wrong: m`x^{2} - 6xy + 9y^{2} = (x - 3)^{2}`,
          right: m`x^{2} - 6xy + 9y^{2} = (x - 3y)^{2}`,
          why: m`The $y$ has to come along. $(x-3)^{2}$ expands to $x^{2}-6x+9$ — no $y$ anywhere. Always expand the square you wrote and compare it term by term.`,
        },
        {
          wrong: m`a^{3} + b^{3} = (a + b)\left(a^{2} + ab + b^{2}\right)`,
          right: m`a^{3} + b^{3} = (a + b)\left(a^{2} - ab + b^{2}\right)`,
          why: m`The middle sign of the trinomial is always opposite the binomial's. Same, Opposite, Always Positive — and the reason is the cancellation: only with $-ab$ do the $a^{2}b$ and $ab^{2}$ terms disappear on expanding.`,
        },
        {
          wrong: m`x^{4} - y^{4} = \left(x^{2} + y^{2}\right)\left(x^{2} - y^{2}\right)`,
          right: m`x^{4} - y^{4} = \left(x^{2} + y^{2}\right)(x + y)(x - y)`,
          why: "Correct as far as it goes, but not factored completely. Re-inspect every factor you produce before calling it done.",
        },
        {
          wrong: m`3ax - ay - 3bx + by = a(3x - y) + b(-3x + y)`,
          right: m`3ax - ay - 3bx + by = a(3x - y) - b(3x - y)`,
          why: "Both are true, but only the second has matching brackets, which is the point of grouping. When the second bracket comes out backwards, factor out the negative instead.",
        },
        {
          wrong: m`6x^{2} + 3x = 3x(2x)`,
          right: m`6x^{2} + 3x = 3x(2x + 1)`,
          why: m`Dividing a term by the GCF leaves 1, not nothing. Expanding $3x(2x)$ gives $6x^{2}$ and loses the $3x$ entirely.`,
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Factor completely. GCF first, then count the terms.",
      problems: [
        {
          prompt: m`2x^{3} - 18x`,
          answer: m`2x(x + 3)(x - 3)`,
          hint: m`GCF is $2x$, and what is left is a difference of squares.`,
        },
        {
          prompt: m`27a^{3} - 8b^{3}`,
          answer: m`(3a - 2b)\left(9a^{2} + 6ab + 4b^{2}\right)`,
          hint: m`Difference of cubes with $a \to 3a$ and $b \to 2b$.`,
        },
        {
          prompt: m`x^{2} + 10x + 25 - y^{2}`,
          answer: m`(x + 5 + y)(x + 5 - y)`,
          hint: "Group the first three as a perfect square, then difference of squares.",
        },
        {
          prompt: m`10x^{2} + 11x - 6`,
          answer: m`(5x - 2)(2x + 3)`,
          hint: m`$ac = -60$; find two numbers with product $-60$ and sum $11$.`,
        },
        {
          prompt: m`x^{6} - 64`,
          answer: m`(x + 2)(x - 2)\left(x^{2} - 2x + 4\right)\left(x^{2} + 2x + 4\right)`,
          hint: m`Treat it as a difference of squares first: $\left(x^{3}\right)^{2} - 8^{2}$. Then each factor is a sum or difference of cubes.`,
        },
        {
          prompt: m`3(2a - b)^{2} - 11(2a - b) - 4`,
          answer: m`(6a - 3b + 1)(2a - b - 4)`,
          hint: m`Let $u = 2a - b$, factor $3u^{2} - 11u - 4$, then substitute back.`,
        },
      ],
    },
  ],
};
