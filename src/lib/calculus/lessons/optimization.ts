import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const optimization: Lesson = {
  slug: "optimization",
  title: "Optimization",
  blurb: "Word problems where something must be as large or as small as possible, and the setup that gets you there.",
  source: "EM-1101 Module 6 — Applications of Maxima and Minima",
  summary:
    "The calculus here is the calculus you already have: differentiate, set to zero, classify. " +
    "What is new is the translation. Every one of these problems hands you two equations without " +
    "naming them — the thing to be optimised, and a restriction tying the variables together — and " +
    "the work is turning words into those two lines. Once they are written down, the rest is " +
    "mechanical.",
  sections: [
    {
      kind: "checklist",
      id: "method",
      title: "The method, in order",
      intro:
        "Nine steps. The two that decide whether the problem works are naming the objective and " +
        "finding the constraint; the two most often skipped are the domain and the final sentence.",
      items: [
        {
          label: "Name what is being optimised",
          detail: "Area, volume, cost, distance, time. Write it as a word before any algebra — getting this wrong means optimising the wrong quantity and losing everything.",
        },
        {
          label: "Draw it and label every dimension with a letter",
          detail: "Anything that can vary gets a letter. Only genuinely fixed amounts stay as numbers.",
        },
        {
          label: "Write the objective function",
          detail: "The equation for the quantity from step one. It will usually have two variables at this stage, which is fine.",
        },
        {
          label: "Write the constraint",
          detail: "The restriction: a fixed length of fence, a fixed volume, a fixed sheet of card. This is the equation the problem gives you without calling it one.",
        },
        {
          label: "Use the constraint to eliminate a variable",
          detail: "Solve the constraint for one letter and substitute it into the objective. You now have one function of one variable, which is something you can differentiate.",
        },
        {
          label: "State the domain",
          detail: m`Physical sense sets it: a length cannot be negative, and a square cut from a 12-inch sheet cannot exceed 6 inches. Write it down — it decides which critical numbers count.`,
        },
        {
          label: "Differentiate and find the critical numbers",
          detail: "Set the derivative to zero and solve. Discard any root outside the domain.",
        },
        {
          label: "Prove it is the max or min you wanted",
          detail: "Second derivative test, or the closed interval method if the domain has endpoints. An unjustified answer is an incomplete one.",
        },
        {
          label: "Answer the question that was actually asked",
          detail: "If it asked for the dimensions, give the dimensions. If it asked for the largest area, give the area. Read the last line of the question again before writing the answer.",
        },
      ],
    },
    {
      kind: "rules",
      id: "patterns",
      title: "Formulas these problems keep reusing",
      intro: "Almost every optimisation question is built from one of these. Knowing them cold removes most of the setup time.",
      rules: [
        {
          name: "Rectangle",
          expr: m`A = xy, \quad P = 2x + 2y`,
          note: "Fencing against a wall or river uses only three sides, so the perimeter constraint becomes 2x + y instead. Read the picture, not the formula.",
        },
        {
          name: "Rectangular box, open top",
          expr: m`V = x^{2}h, \quad S = x^{2} + 4xh`,
          note: "An open top means one face is missing from the surface area. Closing it would make the area x² term double.",
        },
        {
          name: "Cylinder",
          expr: m`V = \pi r^{2} h, \quad S = 2\pi r^{2} + 2\pi r h`,
          note: "Two circular ends plus the curved side, which unrolls into a rectangle of width 2πr and height h.",
        },
        {
          name: "Distance",
          expr: m`D^{2} = \left(x_{2} - x_{1}\right)^{2} + \left(y_{2} - y_{1}\right)^{2}`,
          note: m`Minimise $D^{2}$ rather than $D$. The square root makes the differentiation far messier and cannot change where the minimum sits, because squaring preserves order on non-negative numbers.`,
        },
        {
          name: "Box from a flat sheet",
          expr: m`V = x\left(a - 2x\right)\left(b - 2x\right)`,
          note: m`Cutting a square of side $x$ from each corner of an $a$ by $b$ sheet and folding up. The height is $x$ and both base dimensions lose $2x$.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "examples",
      title: "Worked examples",
      examples: [
        {
          id: "op-1",
          prompt: m`\text{100 m of fence encloses a rectangular pen against a straight river. Find the largest possible area}`,
          pattern: "Fixed perimeter, maximise area",
          tell: "The river replaces one side, so only three sides are fenced. Spotting that is the whole difficulty — the rest is a quadratic.",
          steps: [
            {
              expr: m`A = xy`,
              reason: "Objective: the area, where x is each of the two sides running to the river and y is the side parallel to it.",
            },
            {
              expr: m`2x + y = 100`,
              reason: "Constraint: only three sides need fencing, so the river side is free.",
            },
            {
              expr: m`y = 100 - 2x \Rightarrow A(x) = x(100 - 2x) = 100x - 2x^{2}`,
              reason: "Eliminate y. One variable left.",
            },
            {
              expr: m`0 < x < 50`,
              reason: "Domain: x must be positive, and y = 100 − 2x must be positive too.",
            },
            {
              expr: m`A'(x) = 100 - 4x = 0 \Rightarrow x = 25`,
              reason: "Differentiate and solve. The critical number is inside the domain.",
            },
            {
              expr: m`A''(x) = -4 < 0 \Rightarrow \text{maximum}`,
              reason: "A constant negative second derivative, so this is certainly the maximum.",
            },
            {
              expr: m`y = 100 - 50 = 50, \quad A = 25 \cdot 50 = 1250`,
              reason: "Back-substitute for the other dimension and the area.",
            },
          ],
          answer: m`25 \text{ m} \times 50 \text{ m}, \quad A = 1250 \text{ m}^{2}`,
          check: m`With three sides the optimum has the free side twice the others, not a square. A square 25 by 25 would use only 75 m of fence and enclose 625 m² — far worse.`,
        },
        {
          id: "op-2",
          prompt: m`\text{Squares of side } x \text{ are cut from the corners of a 12 in square sheet and the sides folded up. Maximise the volume}`,
          pattern: "Box from a sheet",
          tell: "No constraint equation is needed — the geometry of the fold gives the volume in one variable straight away. The domain is what keeps the answer honest.",
          steps: [
            {
              expr: m`V = x\left(12 - 2x\right)^{2}`,
              reason: "Height x, and both base dimensions lose 2x — one square from each end.",
            },
            {
              expr: m`0 < x < 6`,
              reason: "Domain: cutting 6 inches from each side of a 12-inch sheet leaves no base at all.",
            },
            {
              expr: m`V = 144x - 48x^{2} + 4x^{3}`,
              reason: "Expand so the power rule applies term by term.",
            },
            {
              expr: m`V'(x) = 144 - 96x + 12x^{2} = 12(x - 2)(x - 6)`,
              reason: "Differentiate and factor.",
            },
            {
              expr: m`x = 2 \text{ or } x = 6; \text{ only } x = 2 \text{ is in the domain}`,
              reason: "x = 6 sits on the boundary and gives zero volume, so it is rejected.",
            },
            {
              expr: m`V(2) = 2(12 - 4)^{2} = 2(64) = 128`,
              reason: "Evaluate at the surviving critical number.",
            },
          ],
          answer: m`x = 2 \text{ in}, \quad V = 128 \text{ in}^{3}`,
          check: "The box is 8 by 8 by 2. The two rejected candidates both give zero volume — at x = 0 there is no height, at x = 6 there is no base — so the maximum has to be the one in between.",
        },
        {
          id: "op-3",
          prompt: m`\text{A closed cylindrical can must hold 1000 cm}^{3}. \text{ Minimise the metal used}`,
          pattern: "Fixed volume, minimise surface area",
          tell: "Two variables and a fixed volume. Solve the volume for h, substitute into the surface area, and a clean relationship falls out at the end.",
          steps: [
            {
              expr: m`S = 2\pi r^{2} + 2\pi r h`,
              reason: "Objective: two circular ends plus the curved wall.",
            },
            {
              expr: m`\pi r^{2} h = 1000 \Rightarrow h = \frac{1000}{\pi r^{2}}`,
              reason: "Constraint, solved for h.",
            },
            {
              expr: m`S(r) = 2\pi r^{2} + 2\pi r \cdot \frac{1000}{\pi r^{2}} = 2\pi r^{2} + \frac{2000}{r}`,
              reason: "Substitute. The π cancels in the second term, which is a good sign the algebra is right.",
            },
            {
              expr: m`S'(r) = 4\pi r - \frac{2000}{r^{2}} = 0`,
              reason: "Differentiate. The second term is 2000r⁻¹, whose derivative is −2000r⁻².",
            },
            {
              expr: m`4\pi r^{3} = 2000 \Rightarrow r^{3} = \frac{500}{\pi}`,
              reason: "Multiply through by r² and rearrange.",
            },
            {
              expr: m`r = \sqrt[3]{\frac{500}{\pi}} \approx 5.42 \text{ cm}`,
              reason: "Take the cube root.",
            },
            {
              expr: m`h = \frac{1000}{\pi r^{2}} = 2r \approx 10.84 \text{ cm}`,
              reason: m`Since $\pi r^{3} = 500$, the numerator $1000 = 2\pi r^{3}$, and dividing by $\pi r^{2}$ leaves exactly $2r$.`,
            },
          ],
          answer: m`r \approx 5.42 \text{ cm}, \quad h \approx 10.84 \text{ cm}, \quad h = 2r`,
          check: m`The height equals the diameter — the most efficient can is exactly as tall as it is wide. That clean relationship is the real result, and it holds for any fixed volume, not just 1000.`,
        },
        {
          id: "op-4",
          prompt: m`\text{Find the point on } y = x^{2} \text{ nearest to } (3, 0)`,
          pattern: "Minimise the square of the distance",
          tell: "Distance brings a square root that makes differentiation ugly. Minimise its square instead — the minimum sits at the same place.",
          steps: [
            {
              expr: m`D^{2} = (x - 3)^{2} + \left(x^{2} - 0\right)^{2}`,
              reason: m`Distance formula, with the point written as $\left(x, x^{2}\right)$ so it is forced onto the curve.`,
            },
            {
              expr: m`D^{2} = x^{2} - 6x + 9 + x^{4}`,
              reason: "Expand. This is now a plain polynomial in one variable.",
            },
            {
              expr: m`\frac{d\left(D^{2}\right)}{dx} = 2x - 6 + 4x^{3} = 0`,
              reason: "Differentiate and set to zero.",
            },
            {
              expr: m`2\left(2x^{3} + x - 3\right) = 0`,
              reason: "Factor out the 2 to make the cubic easier to read.",
            },
            {
              expr: m`x = 1 \text{ is a root}, \quad 2x^{3} + x - 3 = (x - 1)\left(2x^{2} + 2x + 3\right)`,
              reason: "Test x = 1: 2 + 1 − 3 = 0. Divide it out; the quadratic left over has negative discriminant, so there are no other real roots.",
            },
            {
              expr: m`x = 1 \Rightarrow y = 1`,
              reason: "The only candidate, and the distance clearly grows without bound either side, so it is the minimum.",
            },
          ],
          answer: m`(1, 1), \text{ at distance } \sqrt{5}`,
          check: m`Minimising $D$ itself would have meant differentiating a square root of a quartic and would have produced the same cubic after clearing the denominator — the same answer for several times the work.`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`\text{differentiate the constraint}`,
          right: m`\text{differentiate the objective, after substituting the constraint}`,
          why: "The constraint is a fixed condition, not the thing being optimised. Differentiating it answers a question nobody asked.",
        },
        {
          wrong: m`\text{accept every critical number}`,
          right: m`\text{keep only those inside the physical domain}`,
          why: m`In the box problem $x = 6$ solves the derivative perfectly and describes a sheet cut away to nothing. A negative length will often solve the algebra too.`,
        },
        {
          wrong: m`\text{minimise } D = \sqrt{(x - 3)^{2} + x^{4}}`,
          right: m`\text{minimise } D^{2} = (x - 3)^{2} + x^{4}`,
          why: "Squaring is increasing on non-negative numbers, so both are smallest at the same x. Keeping the root only adds a chain rule and a denominator to every line.",
        },
        {
          wrong: m`\text{stop once } x = 25 \text{ is found}`,
          right: m`\text{answer what was asked}`,
          why: "The question wanted the largest area, which is 1250, or the dimensions, which are 25 by 50. A lone critical number is not an answer to either.",
        },
        {
          wrong: m`\text{assume a critical number is the maximum}`,
          right: m`\text{justify it with } f'' \text{ or the endpoints}`,
          why: "A critical number can be a minimum or neither. One line of justification is usually worth marks and costs almost nothing.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      problems: [
        {
          prompt: m`\text{Two positive numbers sum to 20. Maximise their product}`,
          answer: m`10 \text{ and } 10, \quad P = 100`,
          hint: m`$P = x(20 - x)$. A downward parabola, so the vertex is the maximum.`,
        },
        {
          prompt: m`\text{A rectangle has perimeter 40 m. Maximise its area}`,
          answer: m`10 \times 10, \quad A = 100 \text{ m}^{2}`,
          hint: "With all four sides fenced the best rectangle is always a square. Compare with the three-sided worked example.",
        },
        {
          prompt: m`\text{Squares cut from a 10 in square sheet, folded into an open box. Maximise the volume}`,
          answer: m`x = \frac{5}{3} \text{ in}, \quad V = \frac{2000}{27} \approx 74.1 \text{ in}^{3}`,
          hint: m`$V'(x) = 4(3x - 5)(x - 5)$, and $x = 5$ is outside the domain.`,
        },
        {
          prompt: m`\text{Two numbers differ by 10. Minimise their product}`,
          answer: m`5 \text{ and } -5, \quad P = -25`,
          hint: m`Let the smaller be $y$, so the larger is $y + 10$ and $P = y^{2} + 10y$.`,
        },
        {
          prompt: m`\text{A rectangular field of area 900 m}^{2}. \text{ Minimise the fencing}`,
          answer: m`30 \times 30, \quad P = 120 \text{ m}`,
          hint: m`$P = 2x + \frac{1800}{x}$. Set the derivative to zero and solve for $x^{2} = 900$.`,
        },
      ],
    },
  ],
};
