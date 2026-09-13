import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const functions: Lesson = {
  slug: "functions",
  title: "Functions",
  blurb: "Notation, domain and range, composition, and the difference quotient.",
  source: "Calculus — graphing and functions",
  summary:
    "A function is a rule with one promise attached: give it an input and it returns exactly one " +
    "output. Everything here follows from that promise. The last section, the difference quotient, " +
    "is the one that matters most later — it is the algebra a derivative is built out of, so the " +
    "fluency you build on it now is spent in every chapter that follows.",
  sections: [
    {
      kind: "rules",
      id: "notation",
      title: "What the notation means",
      rules: [
        {
          name: "The promise",
          expr: m`\text{one input} \mapsto \text{exactly one output}`,
          note: "Two outputs for one input and it is not a function. Two inputs sharing one output is perfectly fine.",
        },
        {
          name: "Function notation",
          expr: m`f(x) = 3x - 1`,
          note: m`$f(x)$ is not $f$ times $x$. It names the output that the rule $f$ gives for the input $x$.`,
        },
        {
          name: "Evaluating",
          expr: m`f(x) = 3x - 1 \;\Rightarrow\; f(5) = 3(5) - 1`,
          note: "Whatever goes in the brackets goes everywhere the x was, and goes in bracketed. That habit is what stops a sign, or a whole expression, breaking loose later.",
        },
        {
          name: "Vertical line test",
          expr: m`\text{a vertical line may cross the graph at most once}`,
          note: "Two crossings would be one input with two outputs, which the promise forbids.",
        },
        {
          name: "Composition",
          expr: m`(f \circ g)(x) = f(g(x))`,
          note: "Inside out: g acts first. The order matters and swapping it usually gives a different function.",
        },
        {
          name: "Difference quotient",
          expr: m`\frac{f(x + h) - f(x)}{h}`,
          note: "The slope between two points on the graph. Simplify until the h in the denominator cancels — that cancellation is the point of the exercise.",
        },
      ],
    },
    {
      kind: "checklist",
      id: "domain",
      title: "Finding a domain",
      intro:
        "The domain is every input the rule can actually take. Start by allowing everything, then " +
        "take away what breaks.",
      items: [
        {
          label: "Start with every real number",
          detail: "A polynomial never breaks, so if there is no fraction, no even root and no log, the domain is all reals and there is nothing to do.",
        },
        {
          label: "Throw out anything that makes a denominator zero",
          detail: m`Set each denominator equal to zero and solve; those values are excluded. $\frac{1}{x-4}$ loses $x = 4$.`,
        },
        {
          label: "Throw out anything that makes an even root negative",
          detail: m`Set the inside $\ge 0$ and solve. $\sqrt{2x - 6}$ needs $x \ge 3$. An odd root takes anything, so a cube root adds no restriction at all.`,
        },
        {
          label: "Both at once means strictly greater",
          detail: m`An even root in a denominator has to be positive rather than merely non-negative, because zero would divide by zero. That turns a $\ge$ into a $>$.`,
        },
        {
          label: "Write it as intervals",
          detail: m`Round brackets for an excluded end, square for an included one, and $\cup$ to join the pieces. Infinity is always excluded.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "evaluating",
      title: "Worked examples — evaluating",
      examples: [
        {
          id: "fn-1",
          prompt: m`f(x) = 3x^{2} - x + 2, \quad \text{find } f(-2)`,
          pattern: "Straight substitution",
          tell: "A number goes in. The only risk is the sign.",
          steps: [
            { expr: m`f(-2) = 3(-2)^{2} - (-2) + 2`, reason: "Bracket the input everywhere it lands. The brackets are what keep the sign inside the square." },
            { expr: m`= 3(4) + 2 + 2`, reason: m`$(-2)^{2} = 4$, and subtracting $-2$ adds 2.` },
            { expr: m`= 16`, reason: "Multiply, then add." },
          ],
          answer: m`f(-2) = 16`,
          check: m`Without the brackets you would get $3 \cdot -2^{2} = -12$, which is the same trap as $-4^{2}$ against $(-4)^{2}$.`,
        },
        {
          id: "fn-2",
          prompt: m`f(x) = 2x - 5, \quad \text{find } f(a + h)`,
          pattern: "Substituting an expression",
          tell: "The input is an expression rather than a number, but nothing else changes.",
          steps: [
            { expr: m`f(a + h) = 2(a + h) - 5`, reason: m`$a + h$ takes the place of $x$, bracketed so the 2 reaches both parts.` },
            { expr: m`= 2a + 2h - 5`, reason: "Distribute." },
          ],
          answer: m`2a + 2h - 5`,
          check: m`Not $2a + h - 5$: the 2 multiplies the whole input. And not $f(a) + f(h)$ either — see the traps below.`,
        },
        {
          id: "fn-3",
          prompt: m`f(x) = x^{2}, \quad \text{find } \frac{f(x + h) - f(x)}{h}`,
          pattern: "Difference quotient",
          tell: m`The $h$ on the bottom always cancels once the top is expanded. If it does not, something above went wrong.`,
          steps: [
            { expr: m`\frac{(x + h)^{2} - x^{2}}{h}`, reason: "Substitute into both slots. The whole input is bracketed and squared." },
            { expr: m`\frac{x^{2} + 2xh + h^{2} - x^{2}}{h}`, reason: m`Expand $(x+h)^{2}$ in full — it is not $x^{2} + h^{2}$.` },
            { expr: m`\frac{2xh + h^{2}}{h}`, reason: m`The $x^{2}$ terms cancel. They always do, which is the first sign the expansion was right.` },
            { expr: m`\frac{h(2x + h)}{h}`, reason: m`Factor $h$ out of the top.` },
            { expr: m`2x + h`, reason: m`Cancel the $h$. It is legal because $h \ne 0$ — the quotient was never defined at $h = 0$.` },
          ],
          answer: m`2x + h`,
          check:
            "This is the slope between two points on the parabola a distance h apart. Letting h shrink " +
            "to nothing leaves 2x, which is the slope at a single point — and that is the derivative, " +
            "a few chapters early.",
        },
        {
          id: "fn-4",
          prompt: m`f(x) = x^{2} + 1, \; g(x) = 2x - 3, \quad \text{find } (f \circ g)(x) \text{ and } (g \circ f)(x)`,
          pattern: "Composition, both ways",
          tell: "Two functions and a small circle. Work from the inside out, and expect the two orders to disagree.",
          steps: [
            { expr: m`(f \circ g)(x) = f(2x - 3)`, reason: m`$g$ goes first, so its output is what $f$ receives.` },
            { expr: m`= (2x - 3)^{2} + 1`, reason: m`Put $2x - 3$ wherever $f$ has an $x$.` },
            { expr: m`= 4x^{2} - 12x + 9 + 1 = 4x^{2} - 12x + 10`, reason: "Expand the square and collect." },
            { expr: m`(g \circ f)(x) = g\left(x^{2} + 1\right) = 2\left(x^{2} + 1\right) - 3`, reason: "Now the other order: f first." },
            { expr: m`= 2x^{2} - 1`, reason: m`$2x^{2} + 2 - 3$.` },
          ],
          answer: m`(f \circ g)(x) = 4x^{2} - 12x + 10, \quad (g \circ f)(x) = 2x^{2} - 1`,
          check: m`Test both at $x = 1$: $f(g(1)) = f(-1) = 2$ and $g(f(1)) = g(2) = 1$. Different answers, so composition is not something you can reorder.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "domains",
      title: "Worked examples — domains",
      examples: [
        {
          id: "dm-1",
          prompt: m`f(x) = \frac{x + 3}{x^{2} - 9}`,
          pattern: "Denominator",
          tell: "A fraction, so the only danger is a zero on the bottom.",
          steps: [
            { expr: m`x^{2} - 9 = 0`, reason: "Ask what breaks it." },
            { expr: m`(x + 3)(x - 3) = 0 \;\Rightarrow\; x = -3, \; 3`, reason: "Difference of squares." },
            { expr: m`\left(-\infty, -3\right) \cup \left(-3, 3\right) \cup \left(3, \infty\right)`, reason: "Everything else, written as intervals." },
          ],
          answer: m`\left(-\infty, -3\right) \cup \left(-3, 3\right) \cup \left(3, \infty\right)`,
          check: m`The $x + 3$ on top cancels with a factor below, but $x = -3$ stays excluded. Cancelling changes what the expression looks like, never what the original rule was allowed to take.`,
        },
        {
          id: "dm-2",
          prompt: m`g(x) = \sqrt{2x - 6}`,
          pattern: "Even root",
          tell: "A square root, so the inside cannot be negative.",
          steps: [
            { expr: m`2x - 6 \ge 0`, reason: "The condition for the root to be a real number." },
            { expr: m`x \ge 3`, reason: "Add 6, divide by 2." },
            { expr: m`\left[3, \infty\right)`, reason: m`Square bracket at 3 because $x = 3$ is allowed — it gives $\sqrt{0} = 0$.` },
          ],
          answer: m`\left[3, \infty\right)`,
        },
        {
          id: "dm-3",
          prompt: m`h(x) = \frac{1}{\sqrt{4 - x^{2}}}`,
          pattern: "Both restrictions at once",
          tell: "An even root inside a denominator, so it has to be positive rather than just non-negative.",
          steps: [
            { expr: m`4 - x^{2} > 0`, reason: m`Strictly greater: zero would be allowed by the root but not by the fraction.` },
            { expr: m`x^{2} < 4`, reason: "Rearrange." },
            { expr: m`-2 < x < 2`, reason: m`A square is below 4 exactly between $-2$ and 2.` },
            { expr: m`\left(-2, 2\right)`, reason: "Round brackets, because both ends are excluded." },
          ],
          answer: m`\left(-2, 2\right)`,
          check: m`Compare with $\sqrt{4 - x^{2}}$ on its own, whose domain is $\left[-2, 2\right]$. Putting it downstairs is what closes the two ends.`,
        },
        {
          id: "dm-4",
          prompt: m`p(x) = \sqrt[3]{x - 1}`,
          pattern: "Odd root",
          tell: "An odd index, so there is nothing to restrict.",
          steps: [
            { expr: m`\left(-\infty, \infty\right)`, reason: m`A cube root takes negatives happily, so no input breaks the rule.` },
          ],
          answer: m`\left(-\infty, \infty\right)`,
          check: "Worth checking the index before writing an inequality. Only even roots restrict anything.",
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`f(x + h) = f(x) + h`,
          right: m`f(x + h) \text{ means: put } x + h \text{ in for every } x`,
          why: m`Function notation is not multiplication and does not distribute. For $f(x) = x^{2}$: $f(3 + 1) = 16$, while $f(3) + 1 = 10$.`,
        },
        {
          wrong: m`f(x)^{2} = f\left(x^{2}\right)`,
          right: m`f(x)^{2} \text{ squares the output; } f\left(x^{2}\right) \text{ squares the input}`,
          why: m`For $f(x) = x + 1$: $f(3)^{2} = 16$, while $f\left(3^{2}\right) = 10$. Two different instructions.`,
        },
        {
          wrong: m`\frac{x + 3}{x^{2} - 9} = \frac{1}{x - 3} \text{, so the domain is } x \ne 3`,
          right: m`\text{The domain is still } x \ne -3 \text{ and } x \ne 3`,
          why: m`Cancelling simplifies the expression, but the function was defined by the original rule and that rule was never given a value at $-3$. Simplifying cannot hand it one.`,
        },
        {
          wrong: m`f(x) = x^{2} \text{ is not a function, because } f(2) \text{ and } f(-2) \text{ both give } 4`,
          right: m`\text{It is a function.}`,
          why: "The promise is one output per input, not one input per output. Two inputs sharing an output is ordinary — it only means the graph fails the horizontal line test, which is about invertibility, not about being a function.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      problems: [
        {
          prompt: m`f(x) = 4 - x^{2}, \quad f(-3)`,
          answer: m`-5`,
          hint: m`$4 - 9$. Bracket the $-3$ before squaring.`,
        },
        {
          prompt: m`f(x) = 3x + 1, \quad \frac{f(x + h) - f(x)}{h}`,
          answer: m`3`,
          hint: "Everything cancels. A straight line has the same slope everywhere, which is why.",
        },
        {
          prompt: m`f(x) = \frac{5}{x^{2} - x - 6}, \quad \text{domain}`,
          answer: m`\left(-\infty, -2\right) \cup \left(-2, 3\right) \cup \left(3, \infty\right)`,
          hint: m`Factor the bottom: $(x - 3)(x + 2)$.`,
        },
        {
          prompt: m`g(x) = \sqrt{9 - 3x}, \quad \text{domain}`,
          answer: m`\left(-\infty, 3\right]`,
          hint: m`$9 - 3x \ge 0$. Dividing by $-3$ flips the inequality.`,
        },
        {
          prompt: m`f(x) = x - 4, \; g(x) = x^{2}, \quad (f \circ g)(x)`,
          answer: m`x^{2} - 4`,
          hint: m`$g$ first, so $f$ receives $x^{2}$.`,
        },
        {
          prompt: m`f(x) = x^{2} + x, \quad \frac{f(x + h) - f(x)}{h}`,
          answer: m`2x + h + 1`,
          hint: m`Expand $(x+h)^{2} + (x+h)$, cancel, then factor $h$ out.`,
        },
      ],
    },
  ],
};
