import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const limits: Lesson = {
  slug: "limits",
  title: "Limits",
  blurb: "What a function heads towards — the techniques in order, and how to read an infinite one.",
  source: "Calculus — limits and continuity",
  summary:
    "A limit asks where a function is heading, not where it arrives. That distinction is the whole " +
    "subject: a function can head somewhere it never reaches, and it can arrive somewhere it was " +
    "not heading. Everything after this — the derivative most of all — is built on limits, so the " +
    "part worth getting fluent is not the definition but the order of techniques: substitute first, " +
    "and only do algebra when substituting tells you to.",
  sections: [
    {
      kind: "rules",
      id: "idea",
      title: "What a limit says",
      rules: [
        {
          name: "The notation",
          expr: m`\lim_{x \to a} f(x) = L`,
          note: m`As $x$ gets close to $a$ — from either side, without ever being $a$ — the value of $f(x)$ gets close to $L$.`,
        },
        {
          name: "The value at the point is irrelevant",
          expr: m`\lim_{x \to a} f(x) \text{ need not equal } f(a)`,
          note: m`The limit looks at the approach, never the arrival. $\frac{x^{2}-9}{x-3}$ has no value at all at $x = 3$, and its limit there is still 6.`,
        },
        {
          name: "One-sided limits",
          expr: m`\lim_{x \to a^{-}} f(x) \quad \text{and} \quad \lim_{x \to a^{+}} f(x)`,
          note: m`Approaching from below and from above. The minus and plus are about which side of $a$ you come from, never about sign.`,
        },
        {
          name: "When the two-sided limit exists",
          expr: m`\lim_{x \to a} f(x) = L \iff \lim_{x \to a^{-}} f(x) = \lim_{x \to a^{+}} f(x) = L`,
          note: "Both sides must exist and agree. If they disagree the limit does not exist, however well behaved each side is on its own.",
        },
        {
          name: "Continuity",
          expr: m`f \text{ is continuous at } a \iff \lim_{x \to a} f(x) = f(a)`,
          note: "Heading there and arriving there. Polynomials, exponentials, sines and cosines are continuous everywhere, which is what makes substitution the first thing to try.",
        },
        {
          name: "Limits split over the arithmetic",
          expr: m`\lim (f \pm g) = \lim f \pm \lim g, \quad \lim (fg) = \lim f \cdot \lim g`,
          note: m`And the same for a quotient, provided the bottom limit is not zero. That proviso is where every interesting problem in this lesson lives.`,
        },
      ],
    },
    {
      kind: "checklist",
      id: "technique",
      title: "The order of techniques",
      intro:
        "Work down this list. The first step tells you which of the others you need, so nobody " +
        "should ever be guessing which trick to reach for.",
      items: [
        {
          label: "1. Substitute",
          detail: m`Put $a$ in. If you get an ordinary number, that is the answer and you are done — most limits are this easy. Only if substituting breaks do you need anything else, and what it gives you says which.`,
        },
        {
          label: m`2. Got $\frac{0}{0}$ ? Do algebra`,
          detail: m`This is the indeterminate form: it means "not enough information yet", not "no limit". Factor and cancel, multiply by a conjugate, or combine fractions — whichever the expression invites — then substitute again.`,
        },
        {
          label: m`3. Got $\frac{k}{0}$ with $k \ne 0$ ? It is infinite`,
          detail: m`Not indeterminate at all, and no algebra will fix it. The size is settled — it blows up — so the only question left is the sign, which you get from each side separately.`,
        },
        {
          label: m`4. Heading to $\infty$ ? Compare the degrees`,
          detail: m`Divide top and bottom by the highest power of $x$ in the bottom, or read the degrees off directly with the shortcut below.`,
        },
        {
          label: "5. A piecewise rule or an absolute value? Take the sides separately",
          detail: m`Either one changes its formula at a point, so the two sides are genuinely different functions there. Work out each one-sided limit and then compare them.`,
        },
        {
          label: "6. Still stuck? Look for a standard limit or a squeeze",
          detail: m`A $\frac{\sin}{\;}$ shape usually wants the standard trig limit; something bounded multiplied by something heading to zero usually wants the squeeze theorem.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "substituting",
      title: "Worked examples — substitution and the 0/0 fixes",
      intro:
        "Every one of these starts the same way: substitute, look at what came out, and let that " +
        "choose the next move.",
      examples: [
        {
          id: "lm-1",
          prompt: m`\lim_{x \to 2} \left(3x^{2} - 4x + 1\right)`,
          pattern: "Straight substitution",
          tell: "A polynomial, which is continuous everywhere, so substitution is guaranteed to work.",
          steps: [
            { expr: m`3(2)^{2} - 4(2) + 1`, reason: m`Substitute $x = 2$.` },
            { expr: m`= 12 - 8 + 1 = 5`, reason: "An ordinary number came out, so that is the limit." },
          ],
          answer: m`5`,
          check: "Most limits in an exercise set are this one. Trying a clever technique before substituting wastes the easy marks.",
        },
        {
          id: "lm-2",
          prompt: m`\lim_{x \to 3} \frac{x^{2} - 9}{x - 3}`,
          pattern: "Factor and cancel",
          tell: m`Substituting gives $\frac{0}{0}$ — the signal to do algebra, not to stop.`,
          steps: [
            { expr: m`\frac{3^{2} - 9}{3 - 3} = \frac{0}{0}`, reason: "Substitute first. Indeterminate, so more work is needed." },
            { expr: m`= \frac{(x + 3)(x - 3)}{x - 3}`, reason: m`Difference of squares on top. A $\frac{0}{0}$ in a rational function always means top and bottom share a factor.` },
            { expr: m`= x + 3 \quad (x \ne 3)`, reason: m`Cancel. Legal because $x$ is near 3, never equal to it — which is exactly what a limit means.` },
            { expr: m`= 3 + 3 = 6`, reason: "Substitute into what is left." },
          ],
          answer: m`6`,
          check: m`The original is undefined at $x = 3$; its limit there is 6. The graph is the line $y = x+3$ with a hole punched at $(3, 6)$, and the limit is the height of the hole.`,
        },
        {
          id: "lm-3",
          prompt: m`\lim_{x \to -1} \frac{x^{2} - 1}{x^{2} + 3x + 2}`,
          pattern: "Factor and cancel, both sides",
          tell: m`$\frac{0}{0}$ again, and this time both top and bottom need factoring.`,
          steps: [
            { expr: m`= \frac{(x - 1)(x + 1)}{(x + 1)(x + 2)}`, reason: "Factor both. The shared factor is what the indeterminate form promised." },
            { expr: m`= \frac{x - 1}{x + 2}`, reason: m`Cancel $(x+1)$.` },
            { expr: m`= \frac{-1 - 1}{-1 + 2} = \frac{-2}{1} = -2`, reason: "Substitute now that the trouble is gone." },
          ],
          answer: m`-2`,
        },
        {
          id: "lm-4",
          prompt: m`\lim_{x \to 0} \frac{\sqrt{x + 4} - 2}{x}`,
          pattern: "Multiply by the conjugate",
          tell: m`$\frac{0}{0}$ with a root in it. Factoring is not available, so rationalize the numerator instead.`,
          steps: [
            { expr: m`\frac{\sqrt{x + 4} - 2}{x} \cdot \frac{\sqrt{x + 4} + 2}{\sqrt{x + 4} + 2}`, reason: m`Multiply by the conjugate over itself. The same move as rationalizing a denominator, aimed at the top.` },
            { expr: m`= \frac{(x + 4) - 4}{x\left(\sqrt{x + 4} + 2\right)}`, reason: "Difference of squares kills the roots on top." },
            { expr: m`= \frac{x}{x\left(\sqrt{x + 4} + 2\right)} = \frac{1}{\sqrt{x + 4} + 2}`, reason: m`The $x$ cancels, and that cancellation is the whole point of the trick.` },
            { expr: m`= \frac{1}{\sqrt{4} + 2} = \frac{1}{4}`, reason: "Substitute." },
          ],
          answer: m`\frac{1}{4}`,
          check: "Rationalizing the top looks backwards the first time. It is the same identity used in the other direction, and it is the standard move whenever a root sits over a zero.",
        },
        {
          id: "lm-5",
          prompt: m`\lim_{x \to 0} \frac{\frac{1}{x + 2} - \frac{1}{2}}{x}`,
          pattern: "Combine the fractions first",
          tell: m`$\frac{0}{0}$ with a fraction inside a fraction. Tidy the top into one fraction and the $x$ appears.`,
          steps: [
            { expr: m`\frac{1}{x + 2} - \frac{1}{2} = \frac{2 - (x + 2)}{2(x + 2)}`, reason: m`Common denominator $2(x+2)$.` },
            { expr: m`= \frac{-x}{2(x + 2)}`, reason: m`$2 - x - 2 = -x$.` },
            { expr: m`\frac{-x}{2(x + 2)} \cdot \frac{1}{x} = \frac{-1}{2(x + 2)}`, reason: m`Dividing by $x$, and the $x$ cancels.` },
            { expr: m`= \frac{-1}{2(2)} = -\frac{1}{4}`, reason: "Substitute." },
          ],
          answer: m`-\frac{1}{4}`,
        },
      ],
    },
    {
      kind: "rules",
      id: "infinite-rules",
      title: "Infinite limits",
      intro:
        "The case people get wrong most often, because it looks like the indeterminate one and " +
        "behaves nothing like it.",
      rules: [
        {
          name: "Zero over zero is indeterminate",
          expr: m`\frac{0}{0} \;\Rightarrow\; \text{do more algebra}`,
          note: "It carries no information on its own. The answer could be anything, and finding it is your job.",
        },
        {
          name: "Non-zero over zero is infinite",
          expr: m`\frac{k}{0} \;\Rightarrow\; \pm\infty, \quad k \ne 0`,
          note: m`Not indeterminate. A fixed non-zero amount divided by something vanishing grows without bound, and no algebra changes that. Only the sign is still open.`,
        },
        {
          name: "So check the numerator first",
          expr: m`\text{bottom } \to 0 \;\Rightarrow\; \text{what does the top do?}`,
          note: m`Top also zero means factor and cancel. Top non-zero means infinite. Skipping this check is how $\frac{x^{2}-4}{x-2}$ gets called infinite when its limit is 4.`,
        },
        {
          name: "Infinite means the limit does not exist",
          expr: m`\lim_{x \to a} f(x) = \infty \;\Rightarrow\; \text{no limit, but we say how it fails}`,
          note: m`$\infty$ is not a number the function approaches. Writing it is a description of the failure — more useful than "does not exist", and still a failure.`,
        },
        {
          name: "Getting the sign",
          expr: m`\text{test a point just below } a \text{, then just above}`,
          note: m`Track the sign of the top and the sign of the bottom separately. Near $x = 3$, $x - 3$ is a small negative below and a small positive above, which is what flips the answer.`,
        },
        {
          name: "Opposite sides, no limit at all",
          expr: m`\lim_{x \to 0^{-}}\frac{1}{x} = -\infty, \quad \lim_{x \to 0^{+}}\frac{1}{x} = +\infty`,
          note: m`Disagreeing sides mean the two-sided limit does not exist and cannot be written as $\infty$ either. An even power underneath, like $\frac{1}{x^{2}}$, makes both sides agree.`,
        },
        {
          name: "This is what a vertical asymptote is",
          expr: m`x = a \text{ is a vertical asymptote} \iff \text{one side is } \pm\infty`,
          note: "The asymptote from the Graphs lesson, said in the language of limits. One side being infinite is enough.",
        },
      ],
    },
    {
      kind: "examples",
      id: "infinite",
      title: "Worked examples — infinite limits",
      intro: "Substitute, see a non-zero over a zero, then spend the effort on the sign.",
      examples: [
        {
          id: "inf-1",
          prompt: m`\lim_{x \to 0} \frac{1}{x^{2}}`,
          pattern: "Both sides agree",
          tell: m`$\frac{1}{0}$, so infinite. The square underneath is what decides the sign.`,
          steps: [
            { expr: m`\frac{1}{0^{2}} = \frac{1}{0}`, reason: m`Top is 1, not 0. Infinite, not indeterminate.` },
            { expr: m`x \to 0^{-}: \; x^{2} > 0 \;\Rightarrow\; \frac{1}{x^{2}} \to +\infty`, reason: m`A square is positive whichever side you come from.` },
            { expr: m`x \to 0^{+}: \; x^{2} > 0 \;\Rightarrow\; \frac{1}{x^{2}} \to +\infty`, reason: "Same on the right." },
            { expr: m`\lim_{x \to 0} \frac{1}{x^{2}} = +\infty`, reason: m`Both sides agree, so the two-sided statement is allowed — while still meaning the limit does not exist.` },
          ],
          answer: m`+\infty`,
        },
        {
          id: "inf-2",
          prompt: m`\lim_{x \to 0} \frac{1}{x}`,
          pattern: "Sides disagree",
          tell: "Same shape, odd power underneath. That one change makes the two sides disagree.",
          steps: [
            { expr: m`x \to 0^{-}: \; x \text{ is a small negative} \;\Rightarrow\; -\infty`, reason: m`One over a small negative is a large negative.` },
            { expr: m`x \to 0^{+}: \; x \text{ is a small positive} \;\Rightarrow\; +\infty`, reason: "One over a small positive is a large positive." },
            { expr: m`\text{the two-sided limit does not exist}`, reason: m`The sides disagree, so there is no single answer — and here you cannot even write $\infty$.` },
          ],
          answer: m`\text{Does not exist}`,
          check: m`Compare with $\frac{1}{x^{2}}$ above. The only difference is the parity of the power, and it decides everything.`,
        },
        {
          id: "inf-3",
          prompt: m`\lim_{x \to 1^{-}} \frac{2x}{x - 1} \quad \text{and} \quad \lim_{x \to 1^{+}} \frac{2x}{x - 1}`,
          pattern: "One-sided, sign from each side",
          tell: m`Top heads to 2, bottom heads to 0. Infinite both times; the sides are asked for separately because they differ.`,
          steps: [
            { expr: m`\text{top} \to 2(1) = 2 \;(\text{positive, fixed})`, reason: "Settle the numerator once — it is the same from both sides." },
            { expr: m`x \to 1^{-}: \; x - 1 \text{ is a small negative}`, reason: m`Just below 1, say $x = 0.99$, gives $-0.01$.` },
            { expr: m`\frac{+}{-} \;\Rightarrow\; -\infty`, reason: "Positive over small negative." },
            { expr: m`x \to 1^{+}: \; x - 1 \text{ is a small positive}`, reason: m`Just above 1, say $x = 1.01$, gives $+0.01$.` },
            { expr: m`\frac{+}{+} \;\Rightarrow\; +\infty`, reason: "Positive over small positive." },
          ],
          answer: m`-\infty \text{ from the left}, \; +\infty \text{ from the right}`,
          check: m`So $x = 1$ is a vertical asymptote, and the two-sided limit does not exist. Putting a number just either side of $a$ is quicker and safer than reasoning about it in the abstract.`,
        },
        {
          id: "inf-4",
          prompt: m`\lim_{x \to 3} \frac{x + 1}{(x - 3)^{2}}`,
          pattern: "Squared denominator",
          tell: m`Top heads to 4, bottom to 0 — and the bottom is squared, so it is positive from both sides.`,
          steps: [
            { expr: m`\text{top} \to 4, \quad \text{bottom} \to 0^{+}`, reason: m`A square approaches zero from above whichever side $x$ comes from.` },
            { expr: m`\frac{+}{0^{+}} \;\Rightarrow\; +\infty`, reason: "Positive over a small positive." },
            { expr: m`\lim_{x \to 3} \frac{x + 1}{(x - 3)^{2}} = +\infty`, reason: "Both sides agree, so the two-sided form can be written." },
          ],
          answer: m`+\infty`,
        },
        {
          id: "inf-5",
          prompt: m`\lim_{x \to 2} \frac{x^{2} - 4}{x - 2}`,
          pattern: "Looks infinite, is not",
          tell: m`The bottom heads to zero, which invites the infinite answer. Check the top before believing it.`,
          steps: [
            { expr: m`\text{bottom} \to 0, \quad \text{top} \to 2^{2} - 4 = 0`, reason: m`The top is zero too, so this is $\frac{0}{0}$ — indeterminate, not infinite.` },
            { expr: m`= \frac{(x + 2)(x - 2)}{x - 2} = x + 2`, reason: "Factor and cancel, as the indeterminate form requires." },
            { expr: m`= 4`, reason: "Substitute." },
          ],
          answer: m`4`,
          check:
            "This is the whole reason the numerator gets checked first. A vanishing denominator on its " +
            "own decides nothing; it is the pair that decides.",
        },
      ],
    },
    {
      kind: "rules",
      id: "at-infinity-rules",
      title: "Limits at infinity",
      intro:
        m`Now $x$ is the thing running away rather than the thing closing in. These limits are what ` +
        "horizontal asymptotes are.",
      rules: [
        {
          name: "The method",
          expr: m`\text{divide top and bottom by the highest power of } x \text{ in the bottom}`,
          note: m`Every term of the form $\frac{c}{x^{n}}$ then heads to zero, and what is left is the answer. This always works; the shortcut below is just it done in advance.`,
        },
        {
          name: "Bottom wins",
          expr: m`\deg(\text{top}) < \deg(\text{bottom}) \;\Rightarrow\; 0`,
          note: m`Horizontal asymptote $y = 0$. The bottom outgrows the top, so the fraction is squeezed to nothing.`,
        },
        {
          name: "A tie",
          expr: m`\frac{ax^{n} + \dots}{bx^{n} + \dots} \;\Rightarrow\; \frac{a}{b}`,
          note: m`Horizontal asymptote at that ratio. Only the leading coefficients matter — everything below the top degree is dust at this scale.`,
        },
        {
          name: "Top wins",
          expr: m`\deg(\text{top}) > \deg(\text{bottom}) \;\Rightarrow\; \pm\infty`,
          note: "No horizontal asymptote. The sign comes from the leading coefficients and the direction x is heading.",
        },
        {
          name: "The radical trap",
          expr: m`\sqrt{x^{2}} = |x|, \text{ which is } -x \text{ when } x < 0`,
          note: m`Pulling $x$ out of a root heading to $-\infty$ costs a minus sign. This is the single most missed step in the topic, and it is the Radicals lesson's even-index rule showing up again.`,
        },
        {
          name: "Standard trig limit",
          expr: m`\lim_{x \to 0} \frac{\sin x}{x} = 1`,
          note: m`In radians only. Also $\lim_{x \to 0} \frac{1 - \cos x}{x} = 0$. These two are what make the derivatives of sine and cosine come out the way they do.`,
        },
        {
          name: "Squeeze theorem",
          expr: m`g \le f \le h \text{ and } \lim g = \lim h = L \;\Rightarrow\; \lim f = L`,
          note: m`For a bounded thing multiplied by a vanishing thing. $x^{2}\sin\left(\frac{1}{x}\right)$ is trapped between $-x^{2}$ and $x^{2}$, so it is dragged to 0.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "at-infinity",
      title: "Worked examples — limits at infinity",
      examples: [
        {
          id: "ai-1",
          prompt: m`\lim_{x \to \infty} \frac{3x^{2} - x}{2x^{2} + 5}`,
          pattern: "Equal degrees",
          tell: "Degree two over degree two, so expect the ratio of the leading coefficients.",
          steps: [
            { expr: m`= \lim_{x \to \infty} \frac{\frac{3x^{2}}{x^{2}} - \frac{x}{x^{2}}}{\frac{2x^{2}}{x^{2}} + \frac{5}{x^{2}}}`, reason: m`Divide every term by $x^{2}$, the highest power below the line.` },
            { expr: m`= \lim_{x \to \infty} \frac{3 - \frac{1}{x}}{2 + \frac{5}{x^{2}}}`, reason: "Simplify each term." },
            { expr: m`= \frac{3 - 0}{2 + 0} = \frac{3}{2}`, reason: m`Anything of the form $\frac{c}{x^{n}}$ heads to zero.` },
          ],
          answer: m`\frac{3}{2}`,
          check: m`So $y = \frac{3}{2}$ is a horizontal asymptote. The shortcut reads it straight off: $\frac{3}{2}$ from the leading coefficients.`,
        },
        {
          id: "ai-2",
          prompt: m`\lim_{x \to \infty} \frac{2x + 1}{x^{2} - 3}`,
          pattern: "Bottom wins",
          tell: "Degree one over degree two. The bottom grows faster, so the fraction is crushed.",
          steps: [
            { expr: m`= \lim_{x \to \infty} \frac{\frac{2}{x} + \frac{1}{x^{2}}}{1 - \frac{3}{x^{2}}}`, reason: m`Divide through by $x^{2}$.` },
            { expr: m`= \frac{0 + 0}{1 - 0} = 0`, reason: "Everything on top vanishes." },
          ],
          answer: m`0`,
        },
        {
          id: "ai-3",
          prompt: m`\lim_{x \to -\infty} \frac{\sqrt{x^{2} + 1}}{x}`,
          pattern: "The radical trap",
          tell: m`A root of a square with $x$ heading to $-\infty$. The sign is the entire question.`,
          steps: [
            { expr: m`\sqrt{x^{2} + 1} \approx \sqrt{x^{2}} = |x|`, reason: m`For large $x$ the 1 is negligible, but the absolute value is not.` },
            { expr: m`x < 0 \;\Rightarrow\; |x| = -x`, reason: m`Heading to $-\infty$ means $x$ is negative, so its size is $-x$.` },
            { expr: m`\frac{-x}{x} = -1`, reason: "Divide." },
          ],
          answer: m`-1`,
          check: m`The same limit as $x \to +\infty$ is $+1$. A function with two different horizontal asymptotes is exactly what this shape gives, and answering $1$ for both is the standard error.`,
        },
        {
          id: "ai-4",
          prompt: m`\lim_{x \to \infty} \left(\sqrt{4x^{2} + x} - 2x\right)`,
          pattern: "Infinity minus infinity",
          tell: m`Both pieces head to $\infty$, so the difference is indeterminate. A conjugate turns it into a quotient you can handle.`,
          steps: [
            { expr: m`\left(\sqrt{4x^{2} + x} - 2x\right) \cdot \frac{\sqrt{4x^{2} + x} + 2x}{\sqrt{4x^{2} + x} + 2x}`, reason: "Multiply by the conjugate over itself." },
            { expr: m`= \frac{\left(4x^{2} + x\right) - 4x^{2}}{\sqrt{4x^{2} + x} + 2x} = \frac{x}{\sqrt{4x^{2} + x} + 2x}`, reason: m`Difference of squares clears the root from the top.` },
            { expr: m`= \frac{1}{\sqrt{4 + \frac{1}{x}} + 2}`, reason: m`Divide top and bottom by $x$. Inside the root that means dividing by $x^{2}$, and $x > 0$ so no sign appears.` },
            { expr: m`= \frac{1}{\sqrt{4} + 2} = \frac{1}{4}`, reason: m`The $\frac{1}{x}$ vanishes.` },
          ],
          answer: m`\frac{1}{4}`,
          check: m`$\infty - \infty$ is indeterminate exactly like $\frac{0}{0}$ — it needs work, and the answer here is a perfectly ordinary number.`,
        },
        {
          id: "ai-5",
          prompt: m`\lim_{x \to 0} \frac{\sin 5x}{x}`,
          pattern: "Standard trig limit",
          tell: m`$\frac{0}{0}$, and a sine over its own argument is nearly there — the inside just needs to match the bottom.`,
          steps: [
            { expr: m`= \lim_{x \to 0} 5 \cdot \frac{\sin 5x}{5x}`, reason: m`Multiply and divide by 5 so the bottom matches what is inside the sine.` },
            { expr: m`\lim_{x \to 0}\frac{\sin 5x}{5x} = 1`, reason: m`As $x \to 0$ so does $5x$, so this is the standard limit with $5x$ in the role of $x$.` },
            { expr: m`= 5 \cdot 1 = 5`, reason: "The constant comes back out." },
          ],
          answer: m`5`,
        },
      ],
    },
    {
      kind: "checklist",
      id: "dne",
      title: "The three ways a limit fails",
      intro: "Worth naming, because \"does not exist\" covers three quite different behaviours.",
      items: [
        {
          label: "The sides disagree — a jump",
          detail: m`Each one-sided limit exists and they are different numbers. Typical of a piecewise rule, or of $\frac{|x|}{x}$ at zero, which is $-1$ on the left and $1$ on the right.`,
        },
        {
          label: "It grows without bound — infinite",
          detail: m`Written $\pm\infty$ when both sides agree. The limit still does not exist; the notation just says how.`,
        },
        {
          label: "It oscillates",
          detail: m`$\sin\left(\frac{1}{x}\right)$ as $x \to 0$ swings between $-1$ and $1$ infinitely often and settles nowhere. Rare in exercises, but it is why "the function is bounded" is not enough to guarantee a limit.`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`\frac{0}{0} \;\Rightarrow\; \text{the limit does not exist}`,
          right: m`\frac{0}{0} \;\Rightarrow\; \text{keep going}`,
          why: m`It is indeterminate, which means undecided rather than impossible. $\frac{x^{2}-9}{x-3}$ gives $\frac{0}{0}$ and has the perfectly ordinary limit 6.`,
        },
        {
          wrong: m`\frac{2}{0} \;\Rightarrow\; \text{indeterminate}`,
          right: m`\frac{2}{0} \;\Rightarrow\; \pm\infty`,
          why: "Only zero over zero is indeterminate. A fixed non-zero top over a vanishing bottom has a settled size — it blows up — and only the sign is left to find.",
        },
        {
          wrong: m`\lim_{x \to 0}\frac{1}{x} = \infty`,
          right: m`\text{Does not exist: } -\infty \text{ on the left}, +\infty \text{ on the right}`,
          why: m`Writing a single infinity claims both sides do the same thing. Here they do the opposite. Compare $\frac{1}{x^{2}}$, where the square makes both sides positive and the single statement is fair.`,
        },
        {
          wrong: m`\lim_{x \to -\infty} \frac{\sqrt{x^{2}+1}}{x} = 1`,
          right: m`\lim_{x \to -\infty} \frac{\sqrt{x^{2}+1}}{x} = -1`,
          why: m`$\sqrt{x^{2}}$ is $|x|$, not $x$. Heading to $-\infty$ makes that $-x$, and the minus survives into the answer.`,
        },
        {
          wrong: m`\lim_{x \to 3} f(x) = f(3)`,
          right: m`\text{Only when } f \text{ is continuous at } 3`,
          why: "That equality is the definition of continuity, not a general fact. Substitution works because most functions you meet are continuous, and the whole interesting part of this lesson is the cases where it does not.",
        },
        {
          wrong: m`\lim_{x \to 0} \frac{\sin 5x}{x} = 1`,
          right: m`\lim_{x \to 0} \frac{\sin 5x}{x} = 5`,
          why: m`The standard limit needs the bottom to match what is inside the sine. Here it does not, and the factor of 5 needed to make it match is exactly what is left over.`,
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Substitute first every time, and let what comes out pick the technique.",
      problems: [
        {
          prompt: m`\lim_{x \to 4} \frac{x^{2} - 16}{x - 4}`,
          answer: m`8`,
          hint: m`$\frac{0}{0}$, so factor and cancel; what is left is $x + 4$.`,
        },
        {
          prompt: m`\lim_{x \to 0} \frac{\sqrt{x + 9} - 3}{x}`,
          answer: m`\frac{1}{6}`,
          hint: "A root over a zero wants the conjugate.",
        },
        {
          prompt: m`\lim_{x \to 5} \frac{x - 5}{x^{2} - 25}`,
          answer: m`\frac{1}{10}`,
          hint: m`Factor the bottom as $(x-5)(x+5)$.`,
        },
        {
          prompt: m`\lim_{x \to 2^{+}} \frac{3}{x - 2}`,
          answer: m`+\infty`,
          hint: m`Top is 3, bottom is a small positive from that side. Not indeterminate.`,
        },
        {
          prompt: m`\lim_{x \to -\infty} \frac{4x^{3} - x}{2x^{3} + 7}`,
          answer: m`2`,
          hint: "Equal degrees, so the leading coefficients decide — and the direction does not matter here.",
        },
        {
          prompt: m`\lim_{x \to \infty} \frac{5x + 2}{x^{2} + 1}`,
          answer: m`0`,
          hint: "The bottom outgrows the top.",
        },
        {
          prompt: m`\lim_{x \to 0} \frac{\sin 7x}{x}`,
          answer: m`7`,
          hint: "Make the bottom match the inside of the sine.",
        },
        {
          prompt: m`\lim_{x \to -\infty} \frac{\sqrt{9x^{2} + 2}}{x}`,
          answer: m`-3`,
          hint: m`$\sqrt{9x^{2}} = 3|x|$, and $|x| = -x$ on the way to $-\infty$.`,
        },
      ],
    },
  ],
};
