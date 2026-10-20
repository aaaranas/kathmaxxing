import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const extrema: Lesson = {
  slug: "extrema",
  title: "Extrema and Curve Shape",
  blurb: "Critical numbers, the two derivative tests, concavity and inflection, and the theorems underneath them.",
  source: "EM-1101 Module 6 — Applications of the Derivative",
  summary:
    "The first derivative says whether a function is rising or falling, so its zeros are where the " +
    "function might turn. The second says whether the curve is bending upward or downward, which " +
    "settles what kind of turn it is. Between them they locate every peak, valley and change of " +
    "bend on a graph without plotting a single point — and three theorems guarantee the whole " +
    "method actually works.",
  sections: [
    {
      kind: "rules",
      id: "critical",
      title: "Critical numbers and what they mean",
      intro: "A turning point can only happen where the slope is zero or where there is no slope at all. Those are the only candidates worth testing.",
      rules: [
        {
          name: "Critical number",
          expr: m`f'(c) = 0 \quad \text{or} \quad f'(c) \text{ does not exist}`,
          note: m`And $c$ must be in the domain of $f$. A corner or a vertical tangent is a critical number just as much as a flat one, which is why "set the derivative to zero" is only half the search.`,
        },
        {
          name: "Increasing and decreasing",
          expr: m`f'(x) > 0 \text{ rising}, \quad f'(x) < 0 \text{ falling}`,
          note: "Test the sign of f' on each interval between critical numbers. One sample point per interval is enough, because f' cannot change sign without passing through a critical number.",
        },
        {
          name: "Concavity",
          expr: m`f''(x) > 0 \text{ concave up}, \quad f''(x) < 0 \text{ concave down}`,
          note: "Concave up holds water; concave down spills it. This is independent of whether the function is rising — a curve can fall while curving upward.",
        },
        {
          name: "Point of inflection",
          expr: m`f'' \text{ changes sign at } c`,
          note: m`A change of bend. $f''(c) = 0$ on its own is not enough — the sign has to actually flip, and $c$ has to be a point on the graph.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "tests",
      title: "The two derivative tests",
      intro: "Both classify a critical number. The first always works; the second is faster when it works at all.",
      rules: [
        {
          name: "First derivative test",
          expr: m`+ \text{ to } - \Rightarrow \text{maximum}, \quad - \text{ to } + \Rightarrow \text{minimum}`,
          note: "Read the sign of f' either side of the critical number. No sign change means the point is neither a maximum nor a minimum, just a flat spot.",
        },
        {
          name: "Second derivative test",
          expr: m`f'(c) = 0 \text{ and } f''(c) < 0 \Rightarrow \text{maximum}`,
          note: m`And $f''(c) > 0$ gives a minimum. A curve bending downward at a flat point must be at a peak.`,
        },
        {
          name: "When the second test gives up",
          expr: m`f''(c) = 0 \Rightarrow \text{no conclusion}`,
          note: m`It is not evidence of anything — fall back on the first derivative test. For $f(x) = x^{4}$ at $x = 0$ the second derivative is 0, yet there is plainly a minimum there.`,
        },
        {
          name: "Relative against absolute",
          expr: m`\text{relative: best nearby}, \quad \text{absolute: best anywhere}`,
          note: "A relative maximum beats its immediate neighbours. An absolute maximum beats every other point of the domain, and on a closed interval it may well be an endpoint.",
        },
      ],
    },
    {
      kind: "checklist",
      id: "closed",
      title: "Absolute extrema on a closed interval",
      intro:
        "The Extreme Value Theorem promises that a function continuous on a closed interval does " +
        "attain a highest and a lowest value there. This finds them, in three steps.",
      items: [
        {
          label: "Check the theorem applies",
          detail: m`$f$ continuous and the interval closed, $\left[a, b\right]$. On an open interval there may be no maximum at all — $f(x) = x$ on $(0, 1)$ gets arbitrarily close to 1 and never reaches it.`,
        },
        {
          label: "Find the critical numbers inside the interval",
          detail: "Solve f'(x) = 0 and note where f' fails to exist. Discard anything outside the interval — it is irrelevant here.",
        },
        {
          label: "Evaluate f at the critical numbers and at both endpoints",
          detail: "The endpoints are candidates in their own right and are the single most forgotten part of the method.",
        },
        {
          label: "Compare the list",
          detail: "Largest value is the absolute maximum, smallest is the absolute minimum. No derivative test is needed — you are simply comparing numbers.",
        },
      ],
    },
    {
      kind: "rules",
      id: "theorems",
      title: "The three theorems",
      intro: "They are what licenses everything above: they guarantee the points you are hunting for exist.",
      rules: [
        {
          name: "Extreme Value Theorem",
          expr: m`f \text{ continuous on } \left[a, b\right] \Rightarrow f \text{ attains a max and a min}`,
          note: "Both hypotheses matter. Drop continuity, or open the interval, and the guarantee is gone.",
        },
        {
          name: "Rolle's Theorem",
          expr: m`f(a) = f(b) \Rightarrow f'(c) = 0 \text{ for some } c \text{ in } (a, b)`,
          note: "If a curve starts and finishes at the same height it must level off somewhere in between. Needs f continuous on the closed interval and differentiable on the open one.",
        },
        {
          name: "Mean Value Theorem",
          expr: m`f'(c) = \frac{f(b) - f(a)}{b - a}`,
          note: "Somewhere inside the interval the instantaneous rate equals the average rate. Drive 100 km in one hour and at some instant the speedometer read exactly 100 km/h.",
        },
        {
          name: "Rolle is a special case",
          expr: m`f(a) = f(b) \Rightarrow \frac{f(b) - f(a)}{b - a} = 0`,
          note: "Feed equal endpoints into the Mean Value Theorem and the right-hand side is zero, which is exactly Rolle's conclusion.",
        },
      ],
    },
    {
      kind: "examples",
      id: "examples",
      title: "Worked examples",
      examples: [
        {
          id: "ex-1",
          prompt: m`\text{For } f(x) = x^{3} - 3x^{2} + 1 \text{ find the relative extrema and any inflection point}`,
          pattern: "Both derivatives, in turn",
          tell: "A cubic, so expect two critical numbers and exactly one inflection point. The second derivative test will classify both turns quickly.",
          steps: [
            {
              expr: m`f'(x) = 3x^{2} - 6x = 3x(x - 2)`,
              reason: "Differentiate and factor. Factoring is what makes the zeros readable.",
            },
            {
              expr: m`c = 0 \text{ and } c = 2`,
              reason: "The critical numbers. The derivative is a polynomial, so it exists everywhere and there are no others.",
            },
            {
              expr: m`f''(x) = 6x - 6`,
              reason: "Differentiate again for the classification and the concavity.",
            },
            {
              expr: m`f''(0) = -6 < 0 \Rightarrow \text{relative maximum}`,
              reason: "Bending downward at a flat point means a peak. Its height is f(0) = 1.",
            },
            {
              expr: m`f''(2) = 6 > 0 \Rightarrow \text{relative minimum}`,
              reason: "Bending upward means a valley. Its depth is f(2) = 8 − 12 + 1 = −3.",
            },
            {
              expr: m`f''(x) = 0 \text{ at } x = 1, \text{ sign goes } - \text{ to } +`,
              reason: "The bend genuinely changes, so this is an inflection point. Its height is f(1) = −1.",
            },
          ],
          answer: m`\text{max } (0, 1), \quad \text{min } (2, -3), \quad \text{inflection } (1, -1)`,
          check: "The inflection sits exactly halfway between the two turning points, which is true of every cubic — a useful way to spot an arithmetic slip.",
        },
        {
          id: "ex-2",
          prompt: m`\text{Find the absolute extrema of } f(x) = 2x^{3} - 3x^{2} - 12x + 1 \text{ on } \left[-2, 3\right]`,
          pattern: "Closed interval method",
          tell: "A closed interval and a continuous function, so the Extreme Value Theorem applies and the answer is just the biggest and smallest of a short list.",
          steps: [
            {
              expr: m`f'(x) = 6x^{2} - 6x - 12 = 6(x - 2)(x + 1)`,
              reason: "Differentiate and factor.",
            },
            {
              expr: m`c = 2 \text{ and } c = -1, \text{ both inside } \left[-2, 3\right]`,
              reason: "Both critical numbers lie in the interval, so both are candidates.",
            },
            {
              expr: m`f(-2) = -16 - 12 + 24 + 1 = -3`,
              reason: "Left endpoint.",
            },
            {
              expr: m`f(-1) = -2 - 3 + 12 + 1 = 8`,
              reason: "First critical number.",
            },
            {
              expr: m`f(2) = 16 - 12 - 24 + 1 = -19`,
              reason: "Second critical number.",
            },
            {
              expr: m`f(3) = 54 - 27 - 36 + 1 = -8`,
              reason: "Right endpoint. Four numbers to compare.",
            },
          ],
          answer: m`\text{absolute max } 8 \text{ at } x = -1, \quad \text{absolute min } -19 \text{ at } x = 2`,
          check: m`Note the right endpoint value $-8$ beats the left endpoint's $-3$ for neither prize, but had the interval stopped at $x = 2.5$ the picture would change. Endpoints must always be on the list.`,
        },
        {
          id: "ex-3",
          prompt: m`\text{Verify the Mean Value Theorem for } f(x) = x^{2} \text{ on } \left[1, 3\right] \text{ and find } c`,
          pattern: "Mean Value Theorem",
          tell: "A polynomial, so both hypotheses hold automatically. Compute the average rate, then solve for where the instantaneous rate matches it.",
          steps: [
            {
              expr: m`f \text{ is a polynomial} \Rightarrow \text{continuous and differentiable everywhere}`,
              reason: "The hypotheses are satisfied, so the theorem guarantees such a c exists.",
            },
            {
              expr: m`\frac{f(3) - f(1)}{3 - 1} = \frac{9 - 1}{2} = 4`,
              reason: "The average rate of change across the interval — the slope of the line joining the endpoints.",
            },
            {
              expr: m`f'(c) = 2c = 4`,
              reason: "Set the instantaneous rate equal to it.",
            },
            {
              expr: m`c = 2 \text{, which lies in } (1, 3)`,
              reason: "Solve and confirm it is genuinely inside the open interval.",
            },
          ],
          answer: m`c = 2`,
          check: m`For a parabola $c$ always lands at the midpoint of the interval, and $2$ is the midpoint of $1$ and $3$. That only happens for quadratics — do not expect it generally.`,
        },
        {
          id: "ex-4",
          prompt: m`\text{Why does the second derivative test fail for } f(x) = x^{4} \text{ at } x = 0 \text{?}`,
          pattern: "When to fall back on the first test",
          tell: "Both derivatives vanish at the same point. The second test has nothing to say, but the first test settles it in one line.",
          steps: [
            {
              expr: m`f'(x) = 4x^{3} = 0 \text{ at } x = 0`,
              reason: "So x = 0 is a critical number.",
            },
            {
              expr: m`f''(x) = 12x^{2}, \quad f''(0) = 0`,
              reason: "The second derivative test is inconclusive. It does not say there is no extremum — it says nothing at all.",
            },
            {
              expr: m`x < 0 \Rightarrow f'(x) < 0, \quad x > 0 \Rightarrow f'(x) > 0`,
              reason: "Check the sign of the first derivative either side instead.",
            },
            {
              expr: m`- \text{ to } + \Rightarrow \text{relative minimum}`,
              reason: "The first derivative test classifies it immediately.",
            },
          ],
          answer: m`\text{a relative minimum at } (0, 0)`,
          check: m`Obvious from the graph: $x^{4}$ is a flat-bottomed parabola-like curve sitting on the origin. The lesson is that an inconclusive second test is a prompt to switch methods, not a dead end.`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`f''(c) = 0 \Rightarrow \text{inflection point at } c`,
          right: m`f'' \text{ must change sign at } c`,
          why: m`For $f(x) = x^{4}$, $f''(0) = 0$ but the curve is concave up on both sides — no change of bend, so no inflection. The zero only nominates a candidate.`,
        },
        {
          wrong: m`\text{critical numbers are where } f'(x) = 0`,
          right: m`\text{...or where } f'(x) \text{ fails to exist}`,
          why: m`$f(x) = \left|x\right|$ has a minimum at 0, but its derivative there does not exist rather than equalling zero. Searching only for zeros misses every corner and cusp.`,
        },
        {
          wrong: m`\text{compare only the critical values for an absolute maximum}`,
          right: m`\text{compare the critical values and both endpoints}`,
          why: "On a closed interval the extreme value is often at an end, where the function never levelled off at all. Omitting endpoints is the standard way to lose this question.",
        },
        {
          wrong: m`f \text{ increasing} \Rightarrow f \text{ concave up}`,
          right: m`\text{the two are independent}`,
          why: "Increasing is about f′, concavity about f″. A curve can rise while bending downward — that is exactly the shape just before a peak.",
        },
        {
          wrong: m`\text{Rolle needs } f \text{ differentiable on } \left[a, b\right]`,
          right: m`\text{differentiable on } (a, b) \text{, continuous on } \left[a, b\right]`,
          why: "The endpoints only need the function to be continuous. Demanding differentiability there would exclude perfectly good cases, and getting the open and closed intervals the wrong way round is a common exam slip.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      problems: [
        {
          prompt: m`f(x) = x^{3} - 12x, \quad \text{relative extrema}`,
          answer: m`\text{max } (-2, 16), \quad \text{min } (2, -16)`,
          hint: m`$f'(x) = 3x^{2} - 12$, and $f''(x) = 6x$ classifies each.`,
        },
        {
          prompt: m`f(x) = x^{3} - 6x^{2}, \quad \text{point of inflection}`,
          answer: m`(2, -16)`,
          hint: m`$f''(x) = 6x - 12$, zero at $x = 2$, and the sign does change there.`,
        },
        {
          prompt: m`f(x) = x^{2} - 4x \text{ on } \left[0, 3\right], \quad \text{absolute extrema}`,
          answer: m`\text{max } 0 \text{ at } x = 0, \quad \text{min } -4 \text{ at } x = 2`,
          hint: "One critical number at x = 2. Then compare f(0), f(2) and f(3).",
        },
        {
          prompt: m`f(x) = x^{3} \text{ on } \left[0, 2\right], \quad \text{find } c \text{ from the Mean Value Theorem}`,
          answer: m`c = \frac{2}{\sqrt{3}} \approx 1.15`,
          hint: m`The average rate is $\frac{8 - 0}{2} = 4$, so solve $3c^{2} = 4$.`,
        },
        {
          prompt: m`f(x) = x^{3} - 3x, \quad \text{where is } f \text{ increasing?}`,
          answer: m`\left(-\infty, -1\right) \cup \left(1, \infty\right)`,
          hint: m`$f'(x) = 3(x - 1)(x + 1)$. Test a sample point in each of the three intervals.`,
        },
        {
          prompt: m`f(x) = x^{4} - 2x^{2}, \quad \text{where is } f \text{ concave down?}`,
          answer: m`\left(-\frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}}\right)`,
          hint: m`$f''(x) = 12x^{2} - 4$, which is negative between its two zeros.`,
        },
      ],
    },
  ],
};
