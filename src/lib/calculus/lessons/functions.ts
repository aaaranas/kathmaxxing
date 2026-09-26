import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const functions: Lesson = {
  slug: "functions",
  title: "Functions",
  blurb: "Notation, domain and range, combining and composing, piecewise rules, and the difference quotient.",
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
      kind: "rules",
      id: "operations",
      title: "Combining two functions",
      intro:
        "Add, subtract, multiply or divide two functions value by value. The arithmetic is the " +
        "easy half; the domain is the half that gets marked.",
      rules: [
        {
          name: "Sum and difference",
          expr: m`(f \pm g)(x) = f(x) \pm g(x)`,
          note: "Work out each output separately, then combine the two numbers. Nothing clever happens.",
        },
        {
          name: "Product",
          expr: m`(f \cdot g)(x) = f(x) \cdot g(x)`,
          note: "Two radicals multiplied can be pulled under one radical sign, which tidies the answer and hides the domain. Write the domain down before you tidy.",
        },
        {
          name: "Quotient",
          expr: m`\left(\frac{f}{g}\right)(x) = \frac{f(x)}{g(x)}, \quad g(x) \ne 0`,
          note: m`The quotient carries one restriction the others do not: every $x$ with $g(x) = 0$ is thrown out, even though it sat happily inside both original domains.`,
        },
        {
          name: "Domain of any combination",
          expr: m`\text{domain of } f \; \cap \; \text{domain of } g`,
          note: "Both rules have to be computable before they can be combined, so only the overlap survives. The stricter of the two conditions wins.",
        },
      ],
      note: "The domain comes from the two functions you started with, never from the expression you finish with.",
    },
    {
      kind: "examples",
      id: "combining",
      title: "Worked examples \u2014 combining functions",
      intro:
        "The same pair throughout, so the only thing changing is the operation and what it does to the domain.",
      examples: [
        {
          id: "cb-1",
          prompt: m`f(x) = \sqrt{x + 1}, \; g(x) = \sqrt{x - 4}, \quad \text{find } (f + g)(x) \text{ and its domain}`,
          pattern: "Sum",
          tell: "Two rules joined by a plus. Find both domains before adding anything.",
          steps: [
            {
              expr: m`x + 1 \ge 0 \Rightarrow x \ge -1`,
              reason: "Domain of f: an even root cannot take a negative.",
            },
            {
              expr: m`x - 4 \ge 0 \Rightarrow x \ge 4`,
              reason: "Domain of g, the same way.",
            },
            {
              expr: m`\left[4, \infty\right)`,
              reason: "Both at once. The stricter condition wins, so the overlap starts at 4.",
            },
            {
              expr: m`(f + g)(x) = \sqrt{x + 1} + \sqrt{x - 4}`,
              reason: "Only now add the rules together.",
            },
          ],
          answer: m`\sqrt{x + 1} + \sqrt{x - 4}, \quad \left[4, \infty\right)`,
          check: m`Test $x = 0$: it clears $f$, but $g(0) = \sqrt{-4}$ does not exist, so 0 is outside \u2014 which is what $\left[4, \infty\right)$ says.`,
        },
        {
          id: "cb-2",
          prompt: m`f(x) = \sqrt{x + 1}, \; g(x) = \sqrt{x - 4}, \quad \text{find } (f \cdot g)(x) \text{ and its domain}`,
          pattern: "Product, and the domain it hides",
          tell: "Two radicals multiplied. They will combine under one sign, and that is exactly when the domain stops being readable off the answer.",
          steps: [
            {
              expr: m`(f \cdot g)(x) = \sqrt{x + 1} \cdot \sqrt{x - 4}`,
              reason: "Multiply the two rules.",
            },
            {
              expr: m`= \sqrt{(x + 1)(x - 4)} = \sqrt{x^{2} - 3x - 4}`,
              reason: "One radical over the product, then expand inside.",
            },
            {
              expr: m`\left[4, \infty\right)`,
              reason: "The domain is still the overlap of the two originals, not whatever the tidied answer would allow.",
            },
          ],
          answer: m`\sqrt{x^{2} - 3x - 4}, \quad \left[4, \infty\right)`,
          check: m`Read on its own, $\sqrt{x^{2} - 3x - 4}$ would also accept $x \le -1$. But at $x = -2$ the factor $g(-2) = \sqrt{-6}$ never existed, so those inputs were never in the domain to begin with.`,
        },
        {
          id: "cb-3",
          prompt: m`f(x) = \sqrt{x + 1}, \; g(x) = \sqrt{x - 4}, \quad \text{find } \left(\frac{f}{g}\right)(x) \text{ and its domain}`,
          pattern: "Quotient",
          tell: "A quotient always carries one restriction beyond the overlap: the bottom cannot be zero.",
          steps: [
            {
              expr: m`\left(\frac{f}{g}\right)(x) = \frac{\sqrt{x + 1}}{\sqrt{x - 4}} = \sqrt{\frac{x + 1}{x - 4}}`,
              reason: "Divide the rules; one radical over the quotient.",
            },
            {
              expr: m`g(4) = \sqrt{0} = 0`,
              reason: "Find where the denominator vanishes.",
            },
            {
              expr: m`\left(4, \infty\right)`,
              reason: "Start from the overlap and remove x = 4.",
            },
          ],
          answer: m`\sqrt{\frac{x + 1}{x - 4}}, \quad \left(4, \infty\right)`,
          check: "The square bracket turned round. That one change of bracket is the entire difference between this and the product.",
        },
        {
          id: "cb-4",
          prompt: m`f(x) = \sqrt{x}, \; g(x) = x^{2} - 1, \quad \text{find } (g \circ f)(x) \text{ and its domain}`,
          pattern: "Composition, with the domain kept",
          tell: "The answer will simplify into something defined everywhere. The domain does not follow it.",
          steps: [
            {
              expr: m`(g \circ f)(x) = g\left(\sqrt{x}\right)`,
              reason: "f goes first, so g receives the square root.",
            },
            {
              expr: m`= \left(\sqrt{x}\right)^{2} - 1 = x - 1`,
              reason: "Squaring undoes the root.",
            },
            {
              expr: m`x \ge 0`,
              reason: "But the root had to be computable on the way in, and that restriction survives the simplification.",
            },
          ],
          answer: m`x - 1, \quad \left[0, \infty\right)`,
          check: m`Try $x = -4$: the tidied rule would answer $-5$, but $f(-4) = \sqrt{-4}$ has no value, so the composition has none either. Simplifying never widens a domain.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "piecewise",
      title: "Piecewise, absolute value and step",
      intro:
        "One function, several rules, each owning a stretch of the domain. To evaluate, first " +
        "decide which stretch the input lands in, then use only that rule.",
      rules: [
        {
          name: "A rule with two branches",
          expr: m`f(x) = 1 - x \quad \text{when } x \le -1`,
          note: "The condition is as much a part of the rule as the formula is. Reading the formula without it is the usual mistake.",
        },
        {
          name: "...and the other branch",
          expr: m`f(x) = x^{2} \quad \text{when } x > -1`,
          note: "The conditions must cover the domain without overlapping. Exactly one branch owns any given input, which is what keeps it a function.",
        },
        {
          name: "Absolute value is piecewise",
          expr: m`\left|x\right| = -x \text{ when } x < 0, \quad x \text{ when } x \ge 0`,
          note: "It returns the distance from zero, so it is never negative. The minus sign on the first branch is what turns a negative input positive.",
        },
        {
          name: "Filled and hollow endpoints",
          expr: m`\text{filled dot included, hollow dot excluded}`,
          note: m`At a boundary the branch whose condition uses $\le$ or $\ge$ takes the filled dot; the branch with a strict $<$ or $>$ takes the hollow one.`,
        },
        {
          name: "Step function",
          expr: m`\text{constant across an interval, then a jump}`,
          note: "A piecewise function whose every branch is a constant. The graph is a run of flat segments, each with one filled and one hollow end.",
        },
      ],
    },
    {
      kind: "examples",
      id: "piecewise-work",
      title: "Worked examples \u2014 piecewise",
      examples: [
        {
          id: "pw-1",
          prompt: m`f(x) = 1 - x \text{ when } x \le -1, \; f(x) = x^{2} \text{ when } x > -1, \quad \text{find } f(-2), \, f(-1), \, f(0)`,
          pattern: "Evaluating a piecewise rule",
          tell: "Three inputs, two rules. Match each input to its interval before substituting anything.",
          steps: [
            {
              expr: m`-2 \le -1 \Rightarrow f(-2) = 1 - (-2) = 3`,
              reason: "\u22122 satisfies the top condition, so the top rule applies.",
            },
            {
              expr: m`-1 \le -1 \Rightarrow f(-1) = 1 - (-1) = 2`,
              reason: "The condition is \u2264, so the boundary itself belongs to the top rule, not the bottom one.",
            },
            {
              expr: m`0 > -1 \Rightarrow f(0) = 0^{2} = 0`,
              reason: "Zero falls in the second interval.",
            },
          ],
          answer: m`f(-2) = 3, \quad f(-1) = 2, \quad f(0) = 0`,
          check: m`The boundary is the one worth checking twice. Using the wrong branch at $x = -1$ would give 1 rather than 2.`,
        },
        {
          id: "pw-2",
          prompt: m`\text{Sketch } f(x) = 1 - x \text{ when } x \le -1, \; f(x) = x^{2} \text{ when } x > -1`,
          pattern: "Graphing a piecewise rule",
          tell: "Draw each parent shape, then keep only the stretch its condition owns.",
          steps: [
            {
              expr: m`y = 1 - x \text{ for } x \le -1`,
              reason: "A line, but only the part to the left of x = \u22121.",
            },
            {
              expr: m`\text{filled dot at } (-1, 2)`,
              reason: "x = \u22121 belongs to this branch, so its endpoint is included.",
            },
            {
              expr: m`y = x^{2} \text{ for } x > -1`,
              reason: "A parabola, but only the part to the right of x = \u22121.",
            },
            {
              expr: m`\text{hollow dot at } (-1, 1)`,
              reason: "The parabola would reach (\u22121, 1), but that input is not this branch's to own.",
            },
          ],
          answer: m`\text{Two pieces with a jump at } x = -1`,
          check: "The two dots sit one above the other at x = \u22121, one filled and one hollow. Exactly one filled dot per input, or it would not be a function.",
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
          wrong: m`\text{domain of } (f \cdot g) \text{, read off } \sqrt{x^{2} - 3x - 4}`,
          right: m`\text{domain of } f \; \cap \; \text{domain of } g`,
          why: m`Combining two rules can tidy into an expression that would accept more inputs than either original did. $\sqrt{x + 1}\sqrt{x - 4}$ becomes $\sqrt{x^{2} - 3x - 4}$, which alone would take $x = -2$ \u2014 but $g(-2) = \sqrt{-6}$ never existed.`,
        },
        {
          wrong: m`\text{at a boundary, use whichever branch is easier}`,
          right: m`\text{use the branch whose condition includes the boundary}`,
          why: m`Exactly one branch may own the boundary. Against $x \le -1$ and $x > -1$, the input $x = -1$ is the top rule's. Handing it to both would put two outputs on one input.`,
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
          prompt: m`f(x) = 2x - 3, \; g(x) = x^{2}, \quad \left(\frac{f}{g}\right)(x) \text{ and its domain}`,
          answer: m`\frac{2x - 3}{x^{2}}, \quad x \ne 0`,
          hint: "Both are polynomials, so the overlap is everything. Only the zero of the bottom is removed.",
        },
        {
          prompt: m`f(x) = \sqrt{x}, \; g(x) = x^{2} - 1, \quad (f \circ g)(x) \text{ and its domain}`,
          answer: m`\sqrt{x^{2} - 1}, \quad \left(-\infty, -1\right] \cup \left[1, \infty\right)`,
          hint: m`Here the root comes last, so the restriction is $x^{2} - 1 \ge 0$.`,
        },
        {
          prompt: m`f(x) = x + 4 \text{ when } x < -2, \; f(x) = x^{2} \text{ when } x \ge -2, \quad f(-3) \text{ and } f(-2)`,
          answer: m`f(-3) = 1, \quad f(-2) = 4`,
          hint: m`$-2$ is the boundary and the second branch uses $\ge$, so it owns it.`,
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
