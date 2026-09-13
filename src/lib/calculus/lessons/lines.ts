import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const lines: Lesson = {
  slug: "lines",
  title: "Lines",
  blurb: "Slope, the three forms, and which one to reach for when.",
  source: "Calculus — graphing and functions",
  summary:
    "A line is the one graph completely described by two numbers: where it is and how steeply it " +
    "climbs. Everything in this section is those two numbers written down in a different order. " +
    "The skill worth building is not memorising three equations but knowing, from what a question " +
    "gives you, which one to start from — that choice is most of the work.",
  sections: [
    {
      kind: "rules",
      id: "slope",
      title: "Slope",
      intro:
        "Slope is rise over run: how much the line climbs for each step to the right. Its sign, its " +
        "size, and the two cases where it misbehaves are the whole idea.",
      rules: [
        {
          name: "From two points",
          expr: m`m = \frac{y_{2} - y_{1}}{x_{2} - x_{1}}`,
          note: "Rise over run. Either point can be first, as long as the same one is first on the top and the bottom.",
        },
        {
          name: "What the sign says",
          expr: m`m > 0 \text{ rises}, \quad m < 0 \text{ falls}`,
          note: "Read left to right, as you read everything else.",
        },
        {
          name: "Horizontal",
          expr: m`y = b, \quad m = 0`,
          note: m`No rise for any run. $y$ is stuck at one value, whatever $x$ does.`,
        },
        {
          name: "Vertical",
          expr: m`x = a, \quad m \text{ is undefined}`,
          note: "Run of zero, so the slope formula divides by zero. Undefined, which is not the same as zero.",
        },
        {
          name: "Parallel",
          expr: m`m_{1} = m_{2}`,
          note: "Same steepness, so they never meet.",
        },
        {
          name: "Perpendicular",
          expr: m`m_{1}m_{2} = -1, \quad m_{2} = -\frac{1}{m_{1}}`,
          note: m`The negative reciprocal: flip it over and change the sign. Both, not one. A horizontal line and a vertical line are the exception the rule cannot state, since one slope does not exist.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "forms",
      title: "The three forms",
      intro: "Same line every time. They differ only in what they make easy to read off.",
      rules: [
        {
          name: "Slope-intercept",
          expr: m`y = mx + b`,
          note: m`Best for graphing and for comparing two lines: the slope $m$ and the y-intercept $b$ are both sitting there in plain sight.`,
        },
        {
          name: "Point-slope",
          expr: m`y - y_{1} = m(x - x_{1})`,
          note: "Best for building a line, because it takes exactly what most questions give you: one point and a slope. Note both minus signs.",
        },
        {
          name: "Standard",
          expr: m`Ax + By = C`,
          note: m`Best for finding both intercepts quickly, and the only one of the three that can write a vertical line.`,
        },
        {
          name: "Intercepts",
          expr: m`\text{x-intercept: set } y = 0. \quad \text{y-intercept: set } x = 0.`,
          note: "An intercept is where the line crosses an axis, and on an axis the other coordinate is zero. That is the whole rule.",
        },
      ],
    },
    {
      kind: "checklist",
      id: "method",
      title: "Which form to start from",
      intro: "Read what the question hands you, then pick. Starting from the wrong one is not wrong, only longer.",
      items: [
        {
          label: "Two points",
          detail:
            "Slope first, from the formula. Then point-slope with either of the two points — it does " +
            "not matter which, and the answers will agree once tidied.",
        },
        {
          label: "A point and a slope",
          detail: "Point-slope, straight in. This is what the form exists for.",
        },
        {
          label: "A slope and the y-intercept",
          detail: m`Slope-intercept, straight in: the two numbers are $m$ and $b$.`,
        },
        {
          label: "Parallel or perpendicular to a given line",
          detail:
            "Get the given line's slope first — put it in slope-intercept form if it is not already. " +
            "Take it as is for parallel, or the negative reciprocal for perpendicular. Then you have a " +
            "point and a slope.",
        },
        {
          label: "Finish in the form you were asked for",
          detail:
            "Point-slope is a legitimate answer unless the question says otherwise. If it asks for " +
            "slope-intercept, solve for y; if standard, clear the fractions and move the x term across.",
        },
      ],
    },
    {
      kind: "examples",
      id: "examples",
      title: "Worked examples",
      examples: [
        {
          id: "ln-1",
          prompt: m`\text{Slope through } (-2, 5) \text{ and } (4, -7)`,
          pattern: "Slope from two points",
          tell: "Two points and nothing else, so the formula is the only way in.",
          steps: [
            { expr: m`m = \frac{-7 - 5}{4 - (-2)}`, reason: m`Second point on top of the fraction and second on the bottom. Keeping the order consistent is the whole discipline here.` },
            { expr: m`m = \frac{-12}{6}`, reason: m`$4 - (-2) = 6$: subtracting a negative adds.` },
            { expr: m`m = -2`, reason: "Divide." },
          ],
          answer: m`m = -2`,
          check: m`Swap the points and check it agrees: $\frac{5 - (-7)}{-2 - 4} = \frac{12}{-6} = -2$. Same line, same slope.`,
        },
        {
          id: "ln-2",
          prompt: m`\text{Line through } (3, -1) \text{ with slope } \frac{2}{3}`,
          pattern: "Point-slope",
          tell: "A point and a slope — exactly what point-slope takes.",
          steps: [
            { expr: m`y - (-1) = \frac{2}{3}(x - 3)`, reason: m`Substitute into $y - y_{1} = m(x - x_{1})$. The form's own minus meets the point's, which is where sign errors live.` },
            { expr: m`y + 1 = \frac{2}{3}x - 2`, reason: m`Tidy the double negative and distribute: $\frac{2}{3} \cdot 3 = 2$.` },
            { expr: m`y = \frac{2}{3}x - 3`, reason: "Subtract 1 from both sides for slope-intercept form." },
          ],
          answer: m`y = \frac{2}{3}x - 3`,
          check: m`Put the point back in: $\frac{2}{3}(3) - 3 = 2 - 3 = -1$. It passes through $(3, -1)$.`,
        },
        {
          id: "ln-3",
          prompt: m`\text{Line through } (-1, 4) \text{ and } (3, -4)`,
          pattern: "Two points, end to end",
          tell: "Two points, so this is the previous two examples run back to back.",
          steps: [
            { expr: m`m = \frac{-4 - 4}{3 - (-1)} = \frac{-8}{4} = -2`, reason: "Slope first. Nothing can be built until it is known." },
            { expr: m`y - 4 = -2(x - (-1))`, reason: m`Point-slope with $(-1, 4)$.` },
            { expr: m`y - 4 = -2x - 2`, reason: m`$x - (-1) = x + 1$, then distribute the $-2$.` },
            { expr: m`y = -2x + 2`, reason: "Add 4." },
          ],
          answer: m`y = -2x + 2`,
          check: m`Test the other point, the one not used: $-2(3) + 2 = -4$. Both points sit on it, so it is the right line.`,
        },
        {
          id: "ln-4",
          prompt: m`\text{Intercepts of } 3x - 4y = 12`,
          pattern: "Intercepts from standard form",
          tell: "Standard form, and both intercepts are wanted. Setting one variable to zero at a time is quicker than rearranging.",
          steps: [
            { expr: m`3x - 4(0) = 12 \;\Rightarrow\; x = 4`, reason: m`On the x-axis, $y = 0$.` },
            { expr: m`3(0) - 4y = 12 \;\Rightarrow\; y = -3`, reason: m`On the y-axis, $x = 0$.` },
          ],
          answer: m`(4, 0) \text{ and } (0, -3)`,
          check: m`Two points is enough to draw the line, which is why standard form is the convenient one for sketching.`,
        },
        {
          id: "ln-5",
          prompt: m`\text{Parallel to } y = -3x + 1 \text{ through } (2, 4)`,
          pattern: "Parallel",
          tell: "Parallel means the slope is handed to you — read it off and the problem becomes point-slope.",
          steps: [
            { expr: m`m = -3`, reason: m`The given line is already in slope-intercept form, so $m$ is sitting in front of the $x$. Parallel lines share it.` },
            { expr: m`y - 4 = -3(x - 2)`, reason: "Point-slope with the new point." },
            { expr: m`y = -3x + 10`, reason: m`Distribute and add 4: $6 + 4 = 10$.` },
          ],
          answer: m`y = -3x + 10`,
          check: m`Same slope, different intercept — which is exactly what parallel means. Equal intercepts too would make it the same line, not a parallel one.`,
        },
        {
          id: "ln-6",
          prompt: m`\text{Perpendicular to } y = \frac{2}{5}x - 3 \text{ through } (4, 1)`,
          pattern: "Perpendicular",
          tell: "Perpendicular means take the negative reciprocal — flip it and change the sign, both.",
          steps: [
            { expr: m`m_{1} = \frac{2}{5} \;\Rightarrow\; m_{2} = -\frac{5}{2}`, reason: m`Flip $\frac{2}{5}$ to $\frac{5}{2}$, then negate. Check it: $\frac{2}{5} \cdot -\frac{5}{2} = -1$.` },
            { expr: m`y - 1 = -\frac{5}{2}(x - 4)`, reason: "Point-slope." },
            { expr: m`y - 1 = -\frac{5}{2}x + 10`, reason: m`$-\frac{5}{2} \cdot -4 = 10$.` },
            { expr: m`y = -\frac{5}{2}x + 11`, reason: "Add 1." },
          ],
          answer: m`y = -\frac{5}{2}x + 11`,
        },
        {
          id: "ln-7",
          prompt: m`\text{Horizontal and vertical lines through } (-3, 7)`,
          pattern: "The two special cases",
          tell: "No slope is given because neither line needs one.",
          steps: [
            { expr: m`y = 7`, reason: m`Horizontal: $y$ never changes, and at this point it is 7. The $x$ in the point is irrelevant.` },
            { expr: m`x = -3`, reason: m`Vertical: $x$ never changes, and here it is $-3$. This one cannot be written as $y = mx + b$ at all.` },
          ],
          answer: m`y = 7 \text{ and } x = -3`,
          check:
            "The naming trips people up because it feels backwards: the horizontal line is the one " +
            "written with y, and the vertical line the one written with x. Read it as \"y is fixed\" " +
            "and \"x is fixed\" and it comes out right.",
        },
        {
          id: "ln-8",
          prompt: m`\text{Put } 2x + 5y = 20 \text{ into slope-intercept form}`,
          pattern: "Changing form",
          tell: "Standard form in, slope wanted out. Solve for y.",
          steps: [
            { expr: m`5y = -2x + 20`, reason: m`Subtract $2x$ from both sides.` },
            { expr: m`y = -\frac{2}{5}x + 4`, reason: m`Divide everything by 5 — every term, not just the first.` },
          ],
          answer: m`y = -\frac{2}{5}x + 4`,
          check: m`Slope $-\frac{2}{5}$ and y-intercept $(0, 4)$, which agrees with setting $x = 0$ in the original: $5y = 20$.`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`m = \frac{y_{2} - y_{1}}{x_{1} - x_{2}}`,
          right: m`m = \frac{y_{2} - y_{1}}{x_{2} - x_{1}}`,
          why: "Both subtractions have to run in the same direction. Reversing one of them flips the sign of the slope, which turns a line that rises into one that falls.",
        },
        {
          wrong: m`\text{A vertical line has slope } 0`,
          right: m`\text{A vertical line has no slope. A horizontal line has slope } 0.`,
          why: m`A horizontal line has a rise of zero, so $m = \frac{0}{\text{run}} = 0$. A vertical line has a run of zero, so the formula divides by zero and there is no such number. Undefined and zero are different answers.`,
        },
        {
          wrong: m`\text{Perpendicular to } m = \frac{2}{5} \text{ is } m = -\frac{2}{5}`,
          right: m`\text{Perpendicular to } m = \frac{2}{5} \text{ is } m = -\frac{5}{2}`,
          why: m`Negating alone is not enough: $\frac{2}{5} \cdot -\frac{2}{5} = -\frac{4}{25}$, not $-1$. The fraction has to be turned over as well.`,
        },
        {
          wrong: m`5y = -2x + 20 \;\Rightarrow\; y = -2x + 4`,
          right: m`5y = -2x + 20 \;\Rightarrow\; y = -\frac{2}{5}x + 4`,
          why: "Dividing by 5 has to reach every term on the right, not only the constant. Halving the work here halves the slope.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Give each answer in slope-intercept form unless it cannot be written that way.",
      problems: [
        {
          prompt: m`\text{Slope through } (1, -3) \text{ and } (5, 9)`,
          answer: m`m = 3`,
          hint: m`$\frac{9 - (-3)}{5 - 1}$.`,
        },
        {
          prompt: m`\text{Through } (-4, 2) \text{ with slope } -\frac{1}{2}`,
          answer: m`y = -\frac{1}{2}x`,
          hint: m`Point-slope, then tidy. The constant really does come out as 0.`,
        },
        {
          prompt: m`\text{Through } (0, -5) \text{ and } (2, 1)`,
          answer: m`y = 3x - 5`,
          hint: m`One of the points is already the y-intercept, so only the slope is left to find.`,
        },
        {
          prompt: m`\text{Perpendicular to } y = 4x + 1 \text{ through } (8, -2)`,
          answer: m`y = -\frac{1}{4}x`,
          hint: m`The negative reciprocal of 4 is $-\frac{1}{4}$.`,
        },
        {
          prompt: m`\text{Intercepts of } 5x + 2y = -10`,
          answer: m`(-2, 0) \text{ and } (0, -5)`,
          hint: "Set one variable to zero at a time.",
        },
        {
          prompt: m`\text{Vertical line through } (6, -1)`,
          answer: m`x = 6`,
          hint: m`A vertical line fixes $x$, and has no slope to write.`,
        },
      ],
    },
  ],
};
