import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const implicit: Lesson = {
  slug: "implicit",
  title: "Higher-Order and Implicit",
  blurb: "Differentiating twice and what the second derivative means, then differentiating an equation that never isolates y.",
  source: "EM-1101 Module 5 — Higher-Order Derivatives and Implicit Differentiation",
  summary:
    "Two ideas that both come from taking the rules you already have and pushing them one step " +
    "further. Differentiating a second time measures how the slope itself is changing, which is " +
    "what acceleration is and what concavity is. Differentiating an equation that cannot be " +
    "rearranged into y = something works the same way, provided you remember that every y on the " +
    "page is secretly a function of x and owes the chain rule.",
  sections: [
    {
      kind: "rules",
      id: "notation",
      title: "Higher-order notation",
      intro: "Differentiating the derivative, and then that derivative. Two notations for the same thing, both in common use.",
      rules: [
        {
          name: "Prime notation",
          expr: m`f'(x), \quad f''(x), \quad f'''(x), \quad f^{(4)}(x), \quad \dots, \quad f^{(n)}(x)`,
          note: "Primes are used up to the third derivative. From the fourth onward the order goes in brackets, because four tick marks cannot be counted at a glance.",
        },
        {
          name: "Operator notation",
          expr: m`\frac{dy}{dx}, \quad \frac{d^{2}y}{dx^{2}}, \quad \frac{d^{3}y}{dx^{3}}, \quad \frac{d^{n}y}{dx^{n}}`,
          note: m`The placement of the exponents is a convention worth reading carefully: the $2$ sits on the $d$ upstairs but on the $x$ downstairs.`,
        },
        {
          name: "There is no shortcut",
          expr: m`f''(x) = \frac{d}{dx}\left[f'(x)\right]`,
          note: m`The only way to a higher derivative is one step at a time. In particular $f''(x)$ is not $\left[f'(x)\right]^{2}$ and not $f'\left(f'(x)\right)$.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "meaning",
      title: "What the second derivative tells you",
      intro: "The first derivative measures the function. The second measures the first — the rate at which the rate is changing.",
      rules: [
        {
          name: "Physically: acceleration",
          expr: m`s(t) \to v(t) = s'(t) \to a(t) = s''(t)`,
          note: "Position, then velocity, then acceleration. Each is the rate of change of the one before it.",
        },
        {
          name: "Sign of velocity",
          expr: m`v(t) > 0 \text{ forward}, \quad v(t) < 0 \text{ backward}, \quad v(t) = 0 \text{ at rest}`,
          note: "Speed is the size of the velocity and ignores the direction, which is why speed can never be negative but velocity can.",
        },
        {
          name: "Geometrically: concavity",
          expr: m`f''(x) > 0 \text{ concave up}, \quad f''(x) < 0 \text{ concave down}`,
          note: "Concave up holds water and its slope is increasing; concave down spills and its slope is decreasing. The function itself may be rising or falling either way.",
        },
        {
          name: "Speeding up or slowing down",
          expr: m`v \text{ and } a \text{ same sign} \Rightarrow \text{speeding up}`,
          note: "Opposite signs mean slowing down. Acceleration alone does not say which — a negative acceleration speeds up an object already travelling backwards.",
        },
      ],
    },
    {
      kind: "examples",
      id: "higher",
      title: "Worked examples — higher-order derivatives",
      examples: [
        {
          id: "ho-1",
          prompt: m`\text{Find } f'''(x) \text{ for } f(x) = 3x^{4} - 2x^{2} + 5`,
          pattern: "Repeated power rule",
          tell: "A polynomial. Each differentiation drops every degree by one and kills the constant term.",
          steps: [
            {
              expr: m`f'(x) = 12x^{3} - 4x`,
              reason: "Power rule on each term. The 5 is a constant and differentiates to nothing.",
            },
            {
              expr: m`f''(x) = 36x^{2} - 4`,
              reason: "Again. The −4x becomes the constant −4.",
            },
            {
              expr: m`f'''(x) = 72x`,
              reason: "Once more. Now the −4 disappears in its turn.",
            },
          ],
          answer: m`72x`,
          check: m`A degree-4 polynomial loses one degree per differentiation, so the third derivative must be degree 1. It is. The fourth would be the constant 72 and the fifth would be 0.`,
        },
        {
          id: "ho-2",
          prompt: m`\text{Find } y^{(4)} \text{ for } y = \frac{1}{x}`,
          pattern: "Negative powers, repeated",
          tell: "Rewrite as a power before starting. The signs alternate and the coefficients are factorials — worth noticing rather than just grinding.",
          steps: [
            {
              expr: m`y = x^{-1}`,
              reason: "The power rule needs an exponent, so put it in that form first.",
            },
            {
              expr: m`y' = -x^{-2}, \quad y'' = 2x^{-3}`,
              reason: "Each step multiplies by the old exponent and then lowers it by one.",
            },
            {
              expr: m`y''' = -6x^{-4}, \quad y^{(4)} = 24x^{-5}`,
              reason: "The coefficients run 1, 2, 6, 24 — the factorials — and the sign alternates.",
            },
            {
              expr: m`y^{(4)} = \frac{24}{x^{5}}`,
              reason: "Back into fraction form.",
            },
          ],
          answer: m`\frac{24}{x^{5}}`,
          check: m`The pattern is $y^{(n)} = (-1)^{n} \cdot n! \cdot x^{-(n+1)}$. For $n = 4$: $(+1)(24)x^{-5}$, which agrees.`,
        },
        {
          id: "ho-3",
          prompt: m`\text{A particle moves with } s(t) = t^{3} - 6t^{2} + 9t. \text{ Describe its motion at } t = 2`,
          pattern: "Position to velocity to acceleration",
          tell: "Differentiate twice, then read the signs. The signs are the answer, not the numbers.",
          steps: [
            {
              expr: m`v(t) = s'(t) = 3t^{2} - 12t + 9`,
              reason: "Velocity is the derivative of position.",
            },
            {
              expr: m`a(t) = v'(t) = 6t - 12`,
              reason: "Acceleration is the derivative of velocity.",
            },
            {
              expr: m`v(2) = 12 - 24 + 9 = -3`,
              reason: "Negative, so at this instant the particle is moving backwards at 3 units per second.",
            },
            {
              expr: m`a(2) = 12 - 12 = 0`,
              reason: "Zero acceleration, so the velocity is momentarily holding steady.",
            },
          ],
          answer: m`v(2) = -3, \quad a(2) = 0`,
          check: m`$a(t) = 0$ only at $t = 2$, and $v$ is a parabola with its vertex there — so $t = 2$ is exactly where the velocity bottoms out. The two answers agree with each other.`,
        },
        {
          id: "ho-4",
          prompt: m`\text{Find a pattern in the derivatives of } y = \sin x`,
          pattern: "A cycle of four",
          tell: "Sine and cosine feed into each other, so the derivatives must eventually repeat. Find how long the cycle is.",
          steps: [
            {
              expr: m`y' = \cos x, \quad y'' = -\sin x`,
              reason: "Sine to cosine, then cosine to minus sine.",
            },
            {
              expr: m`y''' = -\cos x, \quad y^{(4)} = \sin x`,
              reason: "And back to where it started.",
            },
            {
              expr: m`y^{(n)} = y^{(n+4)}`,
              reason: "The cycle has length 4, so only the remainder of n on division by 4 matters.",
            },
          ],
          answer: m`\text{a cycle of length } 4`,
          check: m`So $y^{(20)} = \sin x$ because 20 is a multiple of 4, and $y^{(21)} = \cos x$. No need to differentiate twenty-one times.`,
        },
      ],
    },
    {
      kind: "checklist",
      id: "method",
      title: "Differentiating implicitly",
      intro:
        "Some equations cannot be rearranged into y = something, and some can but only at great " +
        "cost. Implicit differentiation gets the slope without ever isolating y.",
      items: [
        {
          label: "Differentiate both sides with respect to x",
          detail: "Treat the equation as a whole. Whatever you do to the left you must do to the right, including to a lone constant, which becomes 0.",
        },
        {
          label: "Every y owes a dy/dx",
          detail: m`$y$ is a function of $x$, so differentiating any expression in $y$ is a chain rule: $\frac{d}{dx}\left(y^{2}\right) = 2y\frac{dy}{dx}$ and $\frac{d}{dx}\left(\sin y\right) = \cos y \frac{dy}{dx}$. This single step is the whole technique.`,
        },
        {
          label: "A product of x and y needs the product rule",
          detail: m`$\frac{d}{dx}(xy) = y + x\frac{dy}{dx}$. Two different letters multiplied is a product, not a power.`,
        },
        {
          label: "Gather every dy/dx on one side",
          detail: "Move terms across so that everything carrying a dy/dx is on the left and everything else is on the right.",
        },
        {
          label: "Factor it out and divide",
          detail: m`Treat $\frac{dy}{dx}$ as a single quantity, factor it out of the left side, then divide. The answer normally contains both $x$ and $y$, and that is correct rather than unfinished.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "implicit-work",
      title: "Worked examples — implicit differentiation",
      examples: [
        {
          id: "im-1",
          prompt: m`\text{Find } \frac{dy}{dx} \text{ for } x^{2} + y^{2} = 25`,
          pattern: "The basic case",
          tell: "A circle. It is not a function at all, so there is no way to write y = something without splitting it in two — exactly the situation implicit differentiation is for.",
          steps: [
            {
              expr: m`\frac{d}{dx}\left(x^{2}\right) + \frac{d}{dx}\left(y^{2}\right) = \frac{d}{dx}(25)`,
              reason: "Differentiate every term with respect to x.",
            },
            {
              expr: m`2x + 2y\frac{dy}{dx} = 0`,
              reason: "The y² term picks up a dy/dx from the chain rule. The constant 25 goes to 0.",
            },
            {
              expr: m`2y\frac{dy}{dx} = -2x`,
              reason: "Isolate the term carrying the derivative.",
            },
            {
              expr: m`\frac{dy}{dx} = -\frac{x}{y}`,
              reason: "Divide through by 2y.",
            },
          ],
          answer: m`-\frac{x}{y}`,
          check: m`At $(3, 4)$ the slope is $-\frac{3}{4}$. The radius to that point has slope $\frac{4}{3}$, and the tangent to a circle is perpendicular to the radius — the two slopes multiply to $-1$, as they must.`,
        },
        {
          id: "im-2",
          prompt: m`\text{Find } \frac{dy}{dx} \text{ for } x^{3} + y^{3} = 6xy`,
          pattern: "With a product on the other side",
          tell: "The 6xy needs the product rule, and dy/dx will end up on both sides before it is collected.",
          steps: [
            {
              expr: m`3x^{2} + 3y^{2}\frac{dy}{dx} = 6\left(y + x\frac{dy}{dx}\right)`,
              reason: "Left side term by term; the right side is 6 times a product, so product rule.",
            },
            {
              expr: m`3x^{2} + 3y^{2}\frac{dy}{dx} = 6y + 6x\frac{dy}{dx}`,
              reason: "Expand the bracket so the derivative terms can be separated.",
            },
            {
              expr: m`3y^{2}\frac{dy}{dx} - 6x\frac{dy}{dx} = 6y - 3x^{2}`,
              reason: "Derivative terms to the left, everything else to the right.",
            },
            {
              expr: m`\frac{dy}{dx}\left(3y^{2} - 6x\right) = 6y - 3x^{2}`,
              reason: "Factor the derivative out.",
            },
            {
              expr: m`\frac{dy}{dx} = \frac{6y - 3x^{2}}{3y^{2} - 6x} = \frac{2y - x^{2}}{y^{2} - 2x}`,
              reason: "Divide, then cancel the common factor of 3.",
            },
          ],
          answer: m`\frac{2y - x^{2}}{y^{2} - 2x}`,
          check: m`The curve passes through $(3, 3)$, since $27 + 27 = 54 = 6(9)$. There the slope is $\frac{6 - 9}{9 - 6} = -1$, and the curve is symmetric in $x$ and $y$, which forces a slope of $-1$ on that line. Agreed.`,
        },
        {
          id: "im-3",
          prompt: m`\text{Find the tangent slope to } x^{2} + xy - y^{2} = 4 \text{ at } (2, 2)`,
          pattern: "Implicit, then evaluate",
          tell: "Differentiate first in general, substitute the point only at the very end. Substituting early destroys the derivative terms.",
          steps: [
            {
              expr: m`2x + \left(y + x\frac{dy}{dx}\right) - 2y\frac{dy}{dx} = 0`,
              reason: "The middle term is a product; the last picks up a chain rule.",
            },
            {
              expr: m`x\frac{dy}{dx} - 2y\frac{dy}{dx} = -2x - y`,
              reason: "Separate the derivative terms from the rest.",
            },
            {
              expr: m`\frac{dy}{dx} = \frac{-2x - y}{x - 2y} = \frac{2x + y}{2y - x}`,
              reason: "Factor and divide, then multiply top and bottom by −1 to tidy the signs.",
            },
            {
              expr: m`\frac{dy}{dx} \text{ at } (2, 2) = \frac{4 + 2}{4 - 2} = 3`,
              reason: "Now substitute the point.",
            },
          ],
          answer: m`3`,
          check: m`First confirm the point is on the curve: $4 + 4 - 4 = 4$. It is, so the slope there is meaningful.`,
        },
        {
          id: "im-4",
          prompt: m`\text{Find } \frac{d^{2}y}{dx^{2}} \text{ for } x^{2} + y^{2} = 25`,
          pattern: "Second derivative implicitly",
          tell: "Differentiate the first derivative, then substitute the first derivative back in to clear the dy/dx that reappears.",
          steps: [
            {
              expr: m`\frac{dy}{dx} = -\frac{x}{y}`,
              reason: "From the first example.",
            },
            {
              expr: m`\frac{d^{2}y}{dx^{2}} = -\frac{y - x\frac{dy}{dx}}{y^{2}}`,
              reason: "Quotient rule on −x/y. The y in the denominator owes a dy/dx of its own.",
            },
            {
              expr: m`= -\frac{y - x\left(-\frac{x}{y}\right)}{y^{2}} = -\frac{y + \frac{x^{2}}{y}}{y^{2}}`,
              reason: "Substitute the known first derivative. Nothing is finished while a dy/dx remains.",
            },
            {
              expr: m`= -\frac{x^{2} + y^{2}}{y^{3}}`,
              reason: "Combine the numerator over y, then divide by y² — which multiplies the denominator up to y³.",
            },
            {
              expr: m`= -\frac{25}{y^{3}}`,
              reason: "The original equation says x² + y² is 25, so use it.",
            },
          ],
          answer: m`-\frac{25}{y^{3}}`,
          check: m`On the upper half of the circle $y > 0$, so the second derivative is negative and the curve is concave down — which is what the top of a circle looks like. On the lower half the sign flips and it is concave up.`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`\frac{d}{dx}\left(y^{2}\right) = 2y`,
          right: m`\frac{d}{dx}\left(y^{2}\right) = 2y\frac{dy}{dx}`,
          why: m`$y$ is a function of $x$, not a constant, so differentiating anything built from it is a chain rule. Dropping the $\frac{dy}{dx}$ is the single most common error in the whole topic.`,
        },
        {
          wrong: m`\frac{d}{dx}(xy) = \frac{dy}{dx}`,
          right: m`\frac{d}{dx}(xy) = y + x\frac{dy}{dx}`,
          why: "Two different letters multiplied is a product and needs the product rule. It is not a power of a single variable.",
        },
        {
          wrong: m`f''(x) = \left[f'(x)\right]^{2}`,
          right: m`f''(x) = \frac{d}{dx}\left[f'(x)\right]`,
          why: m`The second prime means differentiate again, not square. For $f(x) = x^{3}$: $f''(x) = 6x$, while $\left[f'(x)\right]^{2} = 9x^{4}$.`,
        },
        {
          wrong: m`\text{substitute the point, then differentiate}`,
          right: m`\text{differentiate, then substitute the point}`,
          why: "Substituting first turns the equation into a statement of numbers, whose derivative is 0 = 0. The general derivative has to be found before any point can be put into it.",
        },
        {
          wrong: m`a(t) < 0 \Rightarrow \text{slowing down}`,
          right: m`v \text{ and } a \text{ of opposite sign} \Rightarrow \text{slowing down}`,
          why: "A negative acceleration on an object already moving backwards makes it go backwards faster. Only the two signs together say whether the speed is rising or falling.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      problems: [
        {
          prompt: m`f(x) = x^{5} - 3x^{3}, \quad f''(x)`,
          answer: m`20x^{3} - 18x`,
          hint: m`$f'(x) = 5x^{4} - 9x^{2}$, then once more.`,
        },
        {
          prompt: m`y = e^{2x}, \quad y'''`,
          answer: m`8e^{2x}`,
          hint: "Each differentiation multiplies by another 2, so three of them give 8.",
        },
        {
          prompt: m`x^{2} - y^{2} = 16, \quad \frac{dy}{dx}`,
          answer: m`\frac{x}{y}`,
          hint: m`$2x - 2y\frac{dy}{dx} = 0$. Watch the minus sign on the y term.`,
        },
        {
          prompt: m`xy + y^{2} = 6, \quad \frac{dy}{dx}`,
          answer: m`-\frac{y}{x + 2y}`,
          hint: "Product rule on the first term, chain rule on the second.",
        },
        {
          prompt: m`\sin y + x^{2} = y, \quad \frac{dy}{dx}`,
          answer: m`\frac{2x}{1 - \cos y}`,
          hint: m`Both $\sin y$ and the lone $y$ on the right carry a $\frac{dy}{dx}$.`,
        },
        {
          prompt: m`s(t) = 2t^{3} - 9t^{2} + 12t, \quad \text{when is the particle at rest?}`,
          answer: m`t = 1 \text{ and } t = 2`,
          hint: m`At rest means $v(t) = 0$. The velocity factors as $6(t - 1)(t - 2)$.`,
        },
        {
          prompt: m`y = \ln x, \quad y''`,
          answer: m`-\frac{1}{x^{2}}`,
          hint: m`$y' = \frac{1}{x} = x^{-1}$, so the next step is the power rule.`,
        },
      ],
    },
  ],
};
