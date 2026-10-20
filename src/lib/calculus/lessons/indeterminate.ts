import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const indeterminate: Lesson = {
  slug: "indeterminate",
  title: "Indeterminate Forms and Differentials",
  blurb: "L'Hospital's Rule for the limits substitution cannot settle, and differentials for estimating a change.",
  source: "EM-1101 Module 7 — Indeterminate Forms and the Differentials",
  summary:
    "Two tools that both trade on the same idea: near a point, a function behaves like its " +
    "derivative. L'Hospital's Rule settles a limit that substitution leaves as nonsense by " +
    "comparing how fast the top and bottom are changing. Differentials use the tangent line as a " +
    "stand-in for the curve, which turns an awkward arithmetic estimate into one multiplication.",
  sections: [
    {
      kind: "rules",
      id: "forms",
      title: "The seven indeterminate forms",
      intro:
        "Indeterminate does not mean the limit fails to exist. It means substitution alone cannot " +
        "decide it — the answer depends on how the two parts race each other.",
      rules: [
        {
          name: "The two L'Hospital handles directly",
          expr: m`\frac{0}{0}, \quad \frac{\infty}{\infty}`,
          note: "Only these two. Any other form has to be algebraically forced into one of them first.",
        },
        {
          name: "A product",
          expr: m`0 \cdot \infty`,
          note: m`Move one factor downstairs as its reciprocal: $f \cdot g = \frac{f}{1/g}$. Choose whichever direction makes the resulting derivative simpler.`,
        },
        {
          name: "A difference",
          expr: m`\infty - \infty`,
          note: "Combine into a single fraction over a common denominator. Two infinities subtracted say nothing; one fraction can be read.",
        },
        {
          name: "Three exponential forms",
          expr: m`0^{0}, \quad 1^{\infty}, \quad \infty^{0}`,
          note: m`Take logarithms. Set $y$ equal to the expression, find $\lim \ln y$, then exponentiate at the end.`,
        },
        {
          name: "Forms that are not indeterminate",
          expr: m`\frac{1}{0}, \quad \frac{\infty}{0}, \quad 0^{\infty}`,
          note: m`These have definite answers — the first two run off to infinity, the last to 0. Applying L'Hospital to them gives a wrong answer with no warning.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "lhospital",
      title: "L'Hospital's Rule",
      intro: "The rule, the theorem it rests on, and the one condition people forget to check.",
      rules: [
        {
          name: "The rule",
          expr: m`\lim_{x \to a}\frac{f(x)}{g(x)} = \lim_{x \to a}\frac{f'(x)}{g'(x)}`,
          note: m`Valid only when the original limit is $\frac{0}{0}$ or $\frac{\infty}{\infty}$, with $f$ and $g$ differentiable near $a$ and $g'(x) \ne 0$ there.`,
        },
        {
          name: "Not the quotient rule",
          expr: m`\frac{d}{dx}f \text{ over } \frac{d}{dx}g`,
          note: "Differentiate the top on its own and the bottom on its own. There is no product, no subtraction and no squared denominator anywhere in this.",
        },
        {
          name: "It may be reapplied",
          expr: m`\frac{0}{0} \to \frac{0}{0} \to \dots`,
          note: "Check the form again after every application. Keep going while it stays indeterminate, and stop the moment it does not.",
        },
        {
          name: "Cauchy's Mean-Value Theorem",
          expr: m`\frac{f(b) - f(a)}{g(b) - g(a)} = \frac{f'(c)}{g'(c)}`,
          note: m`The theorem L'Hospital is proved from. Setting $g(x) = x$ recovers the ordinary Mean Value Theorem, since then $g' = 1$ and the bottom left becomes $b - a$.`,
        },
        {
          name: "Works at infinity too",
          expr: m`x \to \infty \text{ is allowed}`,
          note: "And for one-sided limits. The rule does not care which kind of approach it is, only that the form is right.",
        },
      ],
    },
    {
      kind: "examples",
      id: "lh-work",
      title: "Worked examples — indeterminate forms",
      examples: [
        {
          id: "lh-1",
          prompt: m`\text{Evaluate } \lim_{x \to 0}\frac{\sin x}{x}`,
          pattern: "Plain 0/0",
          tell: "Substitution gives 0 over 0, so the rule applies immediately.",
          steps: [
            {
              expr: m`\frac{\sin 0}{0} = \frac{0}{0}`,
              reason: "Confirm the form before doing anything. This check is part of the method, not a formality.",
            },
            {
              expr: m`= \lim_{x \to 0}\frac{\cos x}{1}`,
              reason: "Differentiate top and bottom separately.",
            },
            {
              expr: m`= \frac{1}{1} = 1`,
              reason: "No longer indeterminate, so substitute and stop.",
            },
          ],
          answer: m`1`,
          check: "This is the special trigonometric limit, now obtained in one line. Strictly it is circular — that limit is what proves the derivative of sine — but as a check on the machinery it is reassuring.",
        },
        {
          id: "lh-2",
          prompt: m`\text{Evaluate } \lim_{x \to \infty}\frac{\ln x}{x}`,
          pattern: "Infinity over infinity",
          tell: "Both parts grow without bound. The question is which grows faster, which is precisely what comparing derivatives answers.",
          steps: [
            {
              expr: m`\frac{\infty}{\infty}`,
              reason: "Both top and bottom run away, so the rule applies.",
            },
            {
              expr: m`= \lim_{x \to \infty}\frac{1/x}{1} = \lim_{x \to \infty}\frac{1}{x}`,
              reason: "Differentiate each part.",
            },
            {
              expr: m`= 0`,
              reason: "A shrinking reciprocal.",
            },
          ],
          answer: m`0`,
          check: "So x beats ln x comfortably. This is the standard ordering: logarithms grow more slowly than any positive power, which in turn grows more slowly than any exponential.",
        },
        {
          id: "lh-3",
          prompt: m`\text{Evaluate } \lim_{x \to 0^{+}} x \ln x`,
          pattern: "Zero times infinity",
          tell: "A product, not a quotient, so it must be rewritten before the rule can touch it. Put the logarithm on top, because its derivative is the simpler one.",
          steps: [
            {
              expr: m`0 \cdot (-\infty)`,
              reason: "x heads to 0 while ln x falls without bound. Indeterminate, but not yet in a usable form.",
            },
            {
              expr: m`x \ln x = \frac{\ln x}{1/x}`,
              reason: m`Move the $x$ downstairs as $\frac{1}{x}$. Now the form is $\frac{-\infty}{\infty}$.`,
            },
            {
              expr: m`= \lim_{x \to 0^{+}}\frac{1/x}{-1/x^{2}}`,
              reason: m`Differentiate: the top gives $\frac{1}{x}$, and $x^{-1}$ downstairs gives $-x^{-2}$.`,
            },
            {
              expr: m`= \lim_{x \to 0^{+}} -x = 0`,
              reason: "Simplify the compound fraction before substituting — dividing by a reciprocal multiplies it up.",
            },
          ],
          answer: m`0`,
          check: m`Putting the $x$ on top instead would give $\frac{x}{1/\ln x}$, whose derivative downstairs is far worse. Choosing which factor to move is the skill here.`,
        },
        {
          id: "lh-4",
          prompt: m`\text{Evaluate } \lim_{x \to 0}\left(\frac{1}{x} - \frac{1}{\sin x}\right)`,
          pattern: "Infinity minus infinity",
          tell: "Two terms each running to infinity. Combine them over a common denominator and the race becomes readable.",
          steps: [
            {
              expr: m`= \lim_{x \to 0}\frac{\sin x - x}{x \sin x}`,
              reason: "One fraction. Now the form is 0/0.",
            },
            {
              expr: m`= \lim_{x \to 0}\frac{\cos x - 1}{\sin x + x\cos x}`,
              reason: "Differentiate top and bottom. The bottom needs the product rule, since it is x times sin x.",
            },
            {
              expr: m`\frac{1 - 1}{0 + 0} = \frac{0}{0}`,
              reason: "Still indeterminate, so apply the rule again.",
            },
            {
              expr: m`= \lim_{x \to 0}\frac{-\sin x}{2\cos x - x\sin x}`,
              reason: "Differentiate once more. The bottom gives cos x + (cos x − x sin x).",
            },
            {
              expr: m`= \frac{0}{2} = 0`,
              reason: "No longer indeterminate. Substitute and stop.",
            },
          ],
          answer: m`0`,
          check: m`Two applications were needed, and checking the form in between is what told us to continue. Stopping after the first would have given the meaningless $\frac{0}{0}$ as an answer.`,
        },
        {
          id: "lh-5",
          prompt: m`\text{Evaluate } \lim_{x \to 0^{+}} x^{x}`,
          pattern: "Zero to the zero",
          tell: "A variable base and a variable exponent. Logarithms are the only way in, and the final exponentiation is the step most often forgotten.",
          steps: [
            {
              expr: m`y = x^{x} \Rightarrow \ln y = x \ln x`,
              reason: "Take logarithms of both sides, which brings the exponent down to where it can be handled.",
            },
            {
              expr: m`\lim_{x \to 0^{+}} \ln y = 0`,
              reason: "This is exactly the previous example.",
            },
            {
              expr: m`\lim y = e^{0} = 1`,
              reason: m`What was found is the limit of $\ln y$, not of $y$. Exponentiate to recover the answer asked for.`,
            },
          ],
          answer: m`1`,
          check: m`Test it: $0.1^{0.1} \approx 0.794$ and $0.01^{0.01} \approx 0.955$. Creeping up towards 1, as found.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "differentials",
      title: "Differentials",
      intro:
        "The tangent line is the best straight-line copy of a curve near a point. A differential is " +
        "what you get by using it in the curve's place.",
      rules: [
        {
          name: "The differential",
          expr: m`dy = f'(x)\,dx`,
          note: m`$dx$ is a change in $x$ that you choose; $dy$ is the matching rise along the tangent line.`,
        },
        {
          name: "Approximating the real change",
          expr: m`\Delta y \approx dy`,
          note: m`$\Delta y$ is the true change in the function, $dy$ the change along the tangent. They agree closely for small $dx$ and drift apart as it grows.`,
        },
        {
          name: "Linear approximation",
          expr: m`f(x + \Delta x) \approx f(x) + f'(x)\Delta x`,
          note: "Pick a nearby x where the function is easy, then walk along the tangent to where you actually want it.",
        },
        {
          name: "Relative and percentage error",
          expr: m`\frac{dy}{y}, \quad 100 \cdot \frac{dy}{y}`,
          note: "A 2 cm error matters far more on a 10 cm object than on a 10 m one, which is why relative error is usually the meaningful figure.",
        },
      ],
    },
    {
      kind: "examples",
      id: "diff-work",
      title: "Worked examples — differentials",
      examples: [
        {
          id: "df-1",
          prompt: m`\text{For } y = x^{3} \text{ find } dy \text{ at } x = 2 \text{ with } dx = 0.01, \text{ and compare with } \Delta y`,
          pattern: "Differential against actual change",
          tell: "A chance to see how good the approximation really is. Compute both and compare.",
          steps: [
            {
              expr: m`dy = 3x^{2}\,dx`,
              reason: "Differentiate, then attach dx.",
            },
            {
              expr: m`dy = 3(4)(0.01) = 0.12`,
              reason: "Substitute x = 2 and dx = 0.01.",
            },
            {
              expr: m`\Delta y = (2.01)^{3} - 2^{3} = 8.120601 - 8`,
              reason: "The true change, for comparison.",
            },
            {
              expr: m`\Delta y = 0.120601`,
              reason: "The differential was out by about 0.0006 — roughly half a percent of the change.",
            },
          ],
          answer: m`dy = 0.12, \quad \Delta y = 0.120601`,
          check: m`The error in using $dy$ for $\Delta y$ shrinks faster than $dx$ does. Halving $dx$ roughly quarters the error, which is why the approximation is so useful for small changes.`,
        },
        {
          id: "df-2",
          prompt: m`\text{Estimate } \sqrt{36.5} \text{ using differentials}`,
          pattern: "Linear approximation of a root",
          tell: "36.5 is awkward, 36 is not. Start at the easy value and step across with the tangent.",
          steps: [
            {
              expr: m`f(x) = \sqrt{x}, \quad x = 36, \quad dx = 0.5`,
              reason: "Choose the nearest point whose root you know exactly.",
            },
            {
              expr: m`f'(x) = \frac{1}{2\sqrt{x}}, \quad f'(36) = \frac{1}{12}`,
              reason: "Differentiate and evaluate at the easy point.",
            },
            {
              expr: m`dy = \frac{1}{12}(0.5) \approx 0.0417`,
              reason: "The rise along the tangent.",
            },
            {
              expr: m`\sqrt{36.5} \approx 6 + 0.0417 = 6.0417`,
              reason: "Start value plus the differential.",
            },
          ],
          answer: m`\approx 6.0417`,
          check: m`The true value is $6.04152...$, so the estimate is right to four decimal places from one multiplication. The tangent slightly overshoots because the square root curve is concave down.`,
        },
        {
          id: "df-3",
          prompt: m`\text{A sphere's radius measures 10 cm, with possible error 0.05 cm. Estimate the error in the volume}`,
          pattern: "Error propagation",
          tell: "A measurement error is a dx. Push it through the differential to see what error it causes downstream.",
          steps: [
            {
              expr: m`V = \frac{4}{3}\pi r^{3} \Rightarrow dV = 4\pi r^{2}\,dr`,
              reason: "Differentiate the volume formula with respect to r.",
            },
            {
              expr: m`dV = 4\pi(100)(0.05) = 20\pi \approx 62.8`,
              reason: "Substitute r = 10 and dr = 0.05.",
            },
            {
              expr: m`\frac{dV}{V} = \frac{4\pi r^{2}\,dr}{\frac{4}{3}\pi r^{3}} = \frac{3\,dr}{r}`,
              reason: "For the relative error, divide rather than substituting numbers — nearly everything cancels.",
            },
            {
              expr: m`\frac{3(0.05)}{10} = 0.015 = 1.5%`,
              reason: "A 0.5% error in the radius becomes a 1.5% error in the volume.",
            },
          ],
          answer: m`dV \approx 62.8 \text{ cm}^{3}, \quad 1.5%`,
          check: m`The relative error is tripled, and the 3 is the exponent on $r$. Cubing a measurement triples its percentage error — a rule worth remembering on its own.`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`\lim_{x \to 0}\frac{x + 1}{x} = \lim_{x \to 0}\frac{1}{1} = 1`,
          right: m`\frac{1}{0} \text{ is not indeterminate}`,
          why: "The form is 1 over 0, so the limit is infinite and L'Hospital does not apply. Applying it anyway converts a correct infinite answer into a confident wrong one, which is why the form must be checked first.",
        },
        {
          wrong: m`\lim\frac{f}{g} = \lim\frac{f'g - fg'}{g^{2}}`,
          right: m`\lim\frac{f}{g} = \lim\frac{f'}{g'}`,
          why: "That is the quotient rule, which is for differentiating a fraction, not for evaluating a limit. The two get confused because both involve a fraction and derivatives.",
        },
        {
          wrong: m`\lim_{x \to 0^{+}} x^{x} = 0`,
          right: m`= e^{0} = 1`,
          why: m`The logarithm step finds $\lim \ln y$, which came out as 0. That is the logarithm of the answer, not the answer. Exponentiating is the last compulsory step.`,
        },
        {
          wrong: m`\text{apply the rule once and substitute}`,
          right: m`\text{re-check the form after every application}`,
          why: "One pass often leaves the expression still indeterminate. Writing 0/0 as the final answer means the method was abandoned halfway.",
        },
        {
          wrong: m`\Delta y = dy`,
          right: m`\Delta y \approx dy`,
          why: "The differential follows the tangent line; the real change follows the curve. They are equal only for a straight line, and for anything else the gap grows with dx.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      problems: [
        {
          prompt: m`\lim_{x \to 0}\frac{e^{x} - 1}{x}`,
          answer: m`1`,
          hint: m`$\frac{0}{0}$. Differentiate to $\frac{e^{x}}{1}$.`,
        },
        {
          prompt: m`\lim_{x \to \infty}\frac{x}{e^{x}}`,
          answer: m`0`,
          hint: "Infinity over infinity. One application is enough, and the exponential wins.",
        },
        {
          prompt: m`\lim_{x \to 0}\frac{1 - \cos x}{x^{2}}`,
          answer: m`\frac{1}{2}`,
          hint: "Two applications. After the first you still have 0/0.",
        },
        {
          prompt: m`\lim_{x \to \infty}\left(1 + \frac{2}{x}\right)^{x}`,
          answer: m`e^{2}`,
          hint: m`Form $1^{\infty}$, so take logarithms: $\ln y = \frac{\ln(1 + 2/x)}{1/x}$.`,
        },
        {
          prompt: m`\text{Estimate } \sqrt[3]{8.06} \text{ using differentials}`,
          answer: m`\approx 2.005`,
          hint: m`Start at $x = 8$ with $dx = 0.06$. The derivative there is $\frac{1}{12}$.`,
        },
        {
          prompt: m`y = \sin x, \quad dy \text{ at } x = 0 \text{ with } dx = 0.1`,
          answer: m`0.1`,
          hint: m`$dy = \cos(0)\,dx$, and near zero the sine curve is almost its own tangent.`,
        },
      ],
    },
  ],
};
