import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const graphs: Lesson = {
  slug: "graphs",
  title: "Graphs",
  blurb: "Intercepts, symmetry, the parent shapes, and how a change to the rule moves the picture.",
  source: "Calculus — graphing and functions",
  summary:
    "Plotting points works, and it is slow. The faster route is to know a handful of parent shapes " +
    "by heart and read the rest of the rule as instructions for moving one of them about. Once you " +
    "can look at an equation and say where its graph sits without drawing it, sketching stops being " +
    "arithmetic and becomes recognition.",
  sections: [
    {
      kind: "rules",
      id: "reading",
      title: "Reading a graph off the rule",
      intro: "Three questions, answerable without plotting a single point.",
      rules: [
        {
          name: "y-intercept",
          expr: m`\text{set } x = 0`,
          note: "There is at most one, because a function gives one output per input.",
        },
        {
          name: "x-intercepts",
          expr: m`\text{set } y = 0 \text{ and solve}`,
          note: "There can be any number of these. They are the roots, and factoring is usually how you find them.",
        },
        {
          name: "Even — symmetric about the y-axis",
          expr: m`f(-x) = f(x)`,
          note: m`The left half mirrors the right. $x^{2}$, $x^{4}$ and $\cos x$ are even, and so is anything built only from even powers.`,
        },
        {
          name: "Odd — symmetric about the origin",
          expr: m`f(-x) = -f(x)`,
          note: m`Rotating the graph half a turn about the origin leaves it unchanged. $x$, $x^{3}$ and $\sin x$ are odd.`,
        },
        {
          name: "Most things are neither",
          expr: m`f(-x) \ne f(x) \text{ and } f(-x) \ne -f(x)`,
          note: m`Mixing even and odd powers usually destroys both symmetries. $x^{2} - 2x$ is neither, and that is the ordinary case rather than a failure.`,
        },
        {
          name: "Symmetry about the x-axis",
          expr: m`\text{possible for a curve, never for a function}`,
          note: "It would put two y values above one x, which the vertical line test forbids. A sideways parabola has it; no function does.",
        },
      ],
    },
    {
      kind: "rules",
      id: "parents",
      title: "The parent shapes",
      intro:
        "Six graphs worth knowing cold. Every sketch in this section is one of them, moved.",
      rules: [
        { name: "Line", expr: m`y = x`, note: "Straight, through the origin, at 45°. Odd." },
        {
          name: "Parabola",
          expr: m`y = x^{2}`,
          note: "A U with its vertex at the origin, opening upwards. Even.",
        },
        {
          name: "Cubic",
          expr: m`y = x^{3}`,
          note: "Flattens at the origin, then rises steeply both ways — down on the left, up on the right. Odd.",
        },
        {
          name: "Square root",
          expr: m`y = \sqrt{x}`,
          note: m`Half a parabola on its side. Starts at the origin and only exists for $x \ge 0$.`,
        },
        {
          name: "Absolute value",
          expr: m`y = |x|`,
          note: "A V with its corner at the origin. Even. The corner is what makes it interesting later.",
        },
        {
          name: "Reciprocal",
          expr: m`y = \frac{1}{x}`,
          note: "Two branches that never touch either axis. Odd, and the first graph here with asymptotes.",
        },
      ],
    },
    {
      kind: "rules",
      id: "transformations",
      title: "Transformations",
      intro:
        "Changes outside the function move the graph the way you would expect. Changes inside it do " +
        "the opposite. That single asymmetry is the only thing here worth memorising.",
      rules: [
        {
          name: "Up and down",
          expr: m`f(x) + c \text{ moves up by } c`,
          note: "Outside, and it behaves: plus goes up, minus goes down.",
        },
        {
          name: "Left and right",
          expr: m`f(x + c) \text{ moves LEFT by } c`,
          note: m`Inside, and it is backwards. $f(x - 3)$ moves right. The reason: to get the old output you now need an $x$ that is 3 bigger, so every point shifts right.`,
        },
        {
          name: "Flip vertically",
          expr: m`-f(x)`,
          note: "Outside, so it reflects in the x-axis — the whole graph turns upside down.",
        },
        {
          name: "Flip horizontally",
          expr: m`f(-x)`,
          note: "Inside, so it reflects in the y-axis — left and right swap.",
        },
        {
          name: "Taller and shorter",
          expr: m`a \cdot f(x)`,
          note: m`Outside. $a > 1$ stretches away from the x-axis; $0 < a < 1$ squashes towards it.`,
        },
        {
          name: "Narrower and wider",
          expr: m`f(bx)`,
          note: m`Inside, so backwards again. $b > 1$ squeezes the graph horizontally; $b < 1$ stretches it out.`,
        },
      ],
      note: m`Order matters when both a stretch and a shift are involved. Write the rule as $a \cdot f(x - h) + k$ and read it as: start from the parent, stretch by $a$, then move by $h$ across and $k$ up.`,
    },
    {
      kind: "examples",
      id: "examples",
      title: "Worked examples",
      examples: [
        {
          id: "gr-1",
          prompt: m`\text{Intercepts of } y = x^{2} - x - 6`,
          pattern: "Intercepts",
          tell: "A quadratic, so expect one y-intercept and up to two x-intercepts.",
          steps: [
            { expr: m`y = 0^{2} - 0 - 6 = -6`, reason: m`y-intercept: set $x = 0$.` },
            { expr: m`x^{2} - x - 6 = 0`, reason: m`x-intercepts: set $y = 0$.` },
            { expr: m`(x - 3)(x + 2) = 0`, reason: m`Two numbers with product $-6$ and sum $-1$.` },
            { expr: m`x = 3, \; x = -2`, reason: "One factor or the other is zero." },
          ],
          answer: m`(0, -6), \; (3, 0), \; (-2, 0)`,
          check: "Three points and the knowledge that it is an upward parabola is enough for a usable sketch.",
        },
        {
          id: "gr-2",
          prompt: m`\text{Symmetry of } f(x) = x^{4} - 3x^{2}`,
          pattern: "Testing for even",
          tell: m`Only even powers appear, so even symmetry is likely — but test rather than assume.`,
          steps: [
            { expr: m`f(-x) = (-x)^{4} - 3(-x)^{2}`, reason: m`Substitute $-x$, bracketing it so the sign sits inside each power.` },
            { expr: m`= x^{4} - 3x^{2}`, reason: "Both exponents are even, so both minus signs disappear." },
            { expr: m`f(-x) = f(x)`, reason: "Identical to the original, which is the definition of even." },
          ],
          answer: m`\text{Even — symmetric about the y-axis}`,
        },
        {
          id: "gr-3",
          prompt: m`\text{Symmetry of } f(x) = x^{3} - x`,
          pattern: "Testing for odd",
          tell: "Only odd powers, so suspect odd symmetry.",
          steps: [
            { expr: m`f(-x) = (-x)^{3} - (-x)`, reason: m`Substitute $-x$.` },
            { expr: m`= -x^{3} + x`, reason: "An odd power keeps the sign; the second term's double negative turns positive." },
            { expr: m`= -\left(x^{3} - x\right) = -f(x)`, reason: m`Factor out the minus and compare. It matches $-f(x)$ exactly.` },
          ],
          answer: m`\text{Odd — symmetric about the origin}`,
          check: m`If neither $f(x)$ nor $-f(x)$ comes back, the answer is "neither", and that is a complete answer. $f(x) = x^{2} - 2x$ gives $x^{2} + 2x$, which is neither.`,
        },
        {
          id: "gr-4",
          prompt: m`\text{Sketch } y = (x + 3)^{2} - 2`,
          pattern: "Shift a parent",
          tell: m`A parabola with something done to it. Read the inside and the outside separately.`,
          steps: [
            { expr: m`\text{parent: } y = x^{2}`, reason: "Start from the shape you already know." },
            { expr: m`(x + 3) \;\Rightarrow\; \text{left } 3`, reason: "Inside, so backwards: plus moves left." },
            { expr: m`- 2 \;\Rightarrow\; \text{down } 2`, reason: "Outside, so it behaves." },
            { expr: m`\text{vertex } (-3, -2)`, reason: "The origin of the parent, moved by both." },
          ],
          answer: m`\text{An upward parabola with vertex } (-3, -2)`,
          check: m`Test the vertex in the rule: $(-3 + 3)^{2} - 2 = -2$. If the shift had gone the other way the vertex would be at $(3, -2)$, and the rule would disagree.`,
        },
        {
          id: "gr-5",
          prompt: m`\text{Sketch } y = -2\sqrt{x - 1} + 4`,
          pattern: "Several at once",
          tell: "A square root with a stretch, a flip and two shifts. Take them in the order the rule applies them.",
          steps: [
            { expr: m`\text{parent: } y = \sqrt{x}`, reason: "Half a parabola on its side, starting at the origin." },
            { expr: m`(x - 1) \;\Rightarrow\; \text{right } 1`, reason: "Inside, so backwards: minus moves right." },
            { expr: m`2 \cdot \;\Rightarrow\; \text{twice as tall}`, reason: "Outside, a vertical stretch." },
            { expr: m`- \;\Rightarrow\; \text{flipped downwards}`, reason: "The minus in front reflects it in the x-axis." },
            { expr: m`+ 4 \;\Rightarrow\; \text{up } 4`, reason: "Outside, last." },
            { expr: m`\text{starts at } (1, 4) \text{ and falls to the right}`, reason: "The parent's corner point, moved by both shifts." },
          ],
          answer: m`\text{Starts at } (1, 4), \text{ falling; domain } \left[1, \infty\right)`,
          check: m`Check one more point: at $x = 5$, $-2\sqrt{4} + 4 = 0$. So it crosses the x-axis at $(5, 0)$, which fits a curve falling from $(1, 4)$.`,
        },
        {
          id: "gr-6",
          prompt: m`\text{Compare } y = -|x| \text{ and } y = |-x|`,
          pattern: "Inside against outside",
          tell: "The same minus sign in the two places it can go. The results are not the same.",
          steps: [
            { expr: m`-|x| \;\Rightarrow\; \text{outside}`, reason: "Every output has its sign flipped, so the V turns upside down." },
            { expr: m`|-x| \;\Rightarrow\; \text{inside}`, reason: "Every input has its sign flipped, so left and right swap." },
            { expr: m`|-x| = |x|`, reason: m`Absolute value is even, so swapping left and right changes nothing. The graph is unmoved.` },
          ],
          answer: m`-|x| \text{ is an upside-down V; } |-x| \text{ is the original V}`,
          check:
            "This pair is worth keeping: it shows that inside and outside are genuinely different " +
            "operations, and that for an even function the inside flip happens to do nothing.",
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`f(x + 3) \text{ moves the graph right by } 3`,
          right: m`f(x + 3) \text{ moves the graph LEFT by } 3`,
          why: m`Check it on a point. For $f(x) = x^{2}$, the vertex of $f(x+3) = (x+3)^{2}$ is where $x + 3 = 0$, that is $x = -3$. Left.`,
        },
        {
          wrong: m`-f(x) \text{ and } f(-x) \text{ are the same}`,
          right: m`-f(x) \text{ flips top to bottom; } f(-x) \text{ flips left to right}`,
          why: m`Try $f(x) = \sqrt{x}$: $-\sqrt{x}$ is the same curve hanging below the axis, while $\sqrt{-x}$ is the mirror image on the left of the axis. Different graphs, and even different domains.`,
        },
        {
          wrong: m`f(-x) = -f(x) \text{ for every function}`,
          right: m`\text{Only for odd functions}`,
          why: m`It is a test, not an identity — it is the question being asked, not a rule that can be applied. Most functions fail it, and failing is a valid answer.`,
        },
        {
          wrong: m`\text{A graph symmetric about the x-axis is a function}`,
          right: m`\text{It cannot be.}`,
          why: "Symmetry about the x-axis puts a matching point below every point above, so one input has two outputs. The vertical line test fails at once.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Describe the graph without plotting it, then check yourself on the grapher.",
      problems: [
        {
          prompt: m`\text{Intercepts of } y = x^{2} - 4x + 3`,
          answer: m`(0, 3), \; (1, 0), \; (3, 0)`,
          hint: m`Factors as $(x - 1)(x - 3)$.`,
        },
        {
          prompt: m`\text{Symmetry of } f(x) = 2x^{4} + 5`,
          answer: m`\text{Even}`,
          hint: "Every power present is even — and a constant counts as an even power.",
        },
        {
          prompt: m`\text{Symmetry of } f(x) = x^{3} + x^{2}`,
          answer: m`\text{Neither}`,
          hint: m`$f(-x) = -x^{3} + x^{2}$, which matches neither $f(x)$ nor $-f(x)$.`,
        },
        {
          prompt: m`\text{Describe } y = (x - 4)^{2} + 1`,
          answer: m`\text{Parabola, vertex } (4, 1)`,
          hint: "Inside is backwards: minus four moves right four.",
        },
        {
          prompt: m`\text{Describe } y = \frac{1}{x + 2}`,
          answer: m`\text{Reciprocal, moved left } 2`,
          hint: m`The vertical asymptote goes where the bottom is zero, at $x = -2$.`,
        },
        {
          prompt: m`\text{Describe } y = -|x - 1| + 3`,
          answer: m`\text{Upside-down V, corner at } (1, 3)`,
          hint: "Right one, flipped, up three.",
        },
      ],
    },
  ],
};
