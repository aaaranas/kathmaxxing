import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const derivatives: Lesson = {
  slug: "derivatives",
  title: "Derivatives",
  blurb: "From first principles to the product and quotient rules, and what the answer means.",
  source: "Calculus — differentiation",
  summary:
    "The difference quotient at the end of the Functions lesson measured the slope between two " +
    "points a distance h apart. Let h shrink to nothing and it stops being a slope between two " +
    "points and becomes the slope at one — that is the derivative, and everything here is either " +
    "that definition or a shortcut for avoiding it. Learn the definition once so you know what the " +
    "shortcuts are shortcuts for, then use the shortcuts.",
  sections: [
    {
      kind: "rules",
      id: "meaning",
      title: "What a derivative is",
      intro:
        "Three descriptions of the same number. Which one is useful depends on the question, so it " +
        "is worth being able to move between them.",
      rules: [
        {
          name: "The definition",
          expr: m`f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}`,
          note: m`The difference quotient with $h$ driven to nothing. "$\lim_{h \to 0}$" means: what value does this head towards as $h$ gets small? Not what it equals at $h = 0$ — there it is $\frac{0}{0}$ and says nothing.`,
        },
        {
          name: "Slope of the tangent",
          expr: m`f'(a) = \text{slope of } y = f(x) \text{ at } x = a`,
          note: "The straight line that just grazes the curve at that point. This is the picture to keep in your head.",
        },
        {
          name: "Rate of change",
          expr: m`f'(x) = \text{how fast } f \text{ changes per unit of } x`,
          note: "Position gives velocity, volume gives flow. Same number, read as a rate rather than a slope.",
        },
        {
          name: "The notations",
          expr: m`f'(x) = y' = \frac{dy}{dx} = \frac{d}{dx}\left[f(x)\right]`,
          note: m`All one thing. $\frac{d}{dx}$ is an instruction — "differentiate what follows" — while $\frac{dy}{dx}$ is the answer. A derivative at a particular point is written $f'(2)$ or $\left.\frac{dy}{dx}\right|_{x=2}$.`,
        },
        {
          name: "Where it fails to exist",
          expr: m`\text{corners, jumps, vertical tangents}`,
          note: m`A derivative is a slope, and some points have no single slope. $|x|$ at $x = 0$ has a corner: the slope is $-1$ on the left and $1$ on the right, so there is no answer.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "first-principles",
      title: "From the definition",
      intro:
        "Called differentiating from first principles. You will not do it often, but doing it a few " +
        "times is what makes the rules that follow stop looking arbitrary. In every one of these the " +
        "h on the bottom cancels — if it does not, the algebra above it went wrong.",
      examples: [
        {
          id: "fp-1",
          prompt: m`f(x) = x^{2}`,
          pattern: "First principles, polynomial",
          tell: "The simplest case. Expand, cancel, then let h go.",
          steps: [
            { expr: m`f'(x) = \lim_{h \to 0} \frac{(x + h)^{2} - x^{2}}{h}`, reason: "Substitute into the definition. The whole input is bracketed and squared." },
            { expr: m`= \lim_{h \to 0} \frac{x^{2} + 2xh + h^{2} - x^{2}}{h}`, reason: m`Expand $(x+h)^{2}$ in full — it is not $x^{2} + h^{2}$.` },
            { expr: m`= \lim_{h \to 0} \frac{2xh + h^{2}}{h}`, reason: m`The $x^{2}$ terms cancel. They always do here, which is the first sign the expansion was right.` },
            { expr: m`= \lim_{h \to 0} \, (2x + h)`, reason: m`Factor $h$ out and cancel it. Legal because $h \ne 0$ — the limit never asks about $h = 0$ itself.` },
            { expr: m`= 2x`, reason: m`Now let $h$ go to nothing. Everything with an $h$ in it vanishes.` },
          ],
          answer: m`f'(x) = 2x`,
          check: m`Read it: at $x = 3$ the parabola has slope 6, and at $x = 0$ it is flat. Both match the picture.`,
        },
        {
          id: "fp-2",
          prompt: m`f(x) = 3x^{2} - 5x + 1`,
          pattern: "First principles, several terms",
          tell: "More terms, same three moves. Every term without an h will cancel.",
          steps: [
            { expr: m`f(x + h) = 3(x + h)^{2} - 5(x + h) + 1`, reason: "Substitute the whole input into every slot first, before subtracting anything." },
            { expr: m`= 3x^{2} + 6xh + 3h^{2} - 5x - 5h + 1`, reason: "Expand and distribute." },
            { expr: m`f(x + h) - f(x) = 6xh + 3h^{2} - 5h`, reason: m`Subtract $3x^{2} - 5x + 1$. Everything free of $h$ cancels, which is the point of the step.` },
            { expr: m`\frac{h(6x + 3h - 5)}{h} = 6x + 3h - 5`, reason: m`Factor $h$ out and cancel.` },
            { expr: m`f'(x) = 6x - 5`, reason: m`Let $h \to 0$.` },
          ],
          answer: m`f'(x) = 6x - 5`,
          check: m`Compare with the power rule below: $3x^{2} \to 6x$, $-5x \to -5$, $1 \to 0$. Same answer in one line instead of five.`,
        },
        {
          id: "fp-3",
          prompt: m`f(x) = \frac{1}{x}`,
          pattern: "First principles, a fraction",
          tell: "No expanding to do. The h cancels only after the two fractions are combined over a common denominator.",
          steps: [
            { expr: m`f'(x) = \lim_{h \to 0} \frac{\frac{1}{x + h} - \frac{1}{x}}{h}`, reason: "Substitute. A fraction inside a fraction is normal here." },
            { expr: m`= \lim_{h \to 0} \frac{\frac{x - (x + h)}{x(x + h)}}{h}`, reason: m`Combine the top two over the common denominator $x(x+h)$.` },
            { expr: m`= \lim_{h \to 0} \frac{-h}{h \cdot x(x + h)}`, reason: m`$x - x - h = -h$, and dividing by $h$ multiplies the denominator by $h$.` },
            { expr: m`= \lim_{h \to 0} \frac{-1}{x(x + h)}`, reason: m`Cancel the $h$.` },
            { expr: m`= -\frac{1}{x^{2}}`, reason: m`Let $h \to 0$, so $x + h$ becomes $x$.` },
          ],
          answer: m`f'(x) = -\frac{1}{x^{2}}`,
          check: m`The sign is worth pausing on: $\frac{1}{x}$ falls everywhere it is defined, so a negative derivative everywhere is exactly right.`,
        },
        {
          id: "fp-4",
          prompt: m`f(x) = \sqrt{x}`,
          pattern: "First principles, a radical",
          tell: m`Subtracting two roots gets you nowhere. Multiplying by the conjugate does — the same move as rationalizing a denominator, used on the numerator instead.`,
          steps: [
            { expr: m`\frac{\sqrt{x + h} - \sqrt{x}}{h}`, reason: "Substitute into the definition." },
            { expr: m`= \frac{\sqrt{x + h} - \sqrt{x}}{h} \cdot \frac{\sqrt{x + h} + \sqrt{x}}{\sqrt{x + h} + \sqrt{x}}`, reason: m`Multiply by the conjugate over itself, which is multiplying by 1.` },
            { expr: m`= \frac{(x + h) - x}{h\left(\sqrt{x + h} + \sqrt{x}\right)}`, reason: m`Difference of squares on top: the roots square away and the cross terms cancel.` },
            { expr: m`= \frac{1}{\sqrt{x + h} + \sqrt{x}}`, reason: m`The top is $h$, so it cancels the $h$ below.` },
            { expr: m`f'(x) = \frac{1}{2\sqrt{x}}`, reason: m`Let $h \to 0$; the two roots become the same one.` },
          ],
          answer: m`f'(x) = \frac{1}{2\sqrt{x}}`,
          check: m`Agrees with the power rule: $\sqrt{x} = x^{\frac{1}{2}}$, so the derivative is $\frac{1}{2}x^{-\frac{1}{2}} = \frac{1}{2\sqrt{x}}$. Note it does not exist at $x = 0$ — the curve is vertical there.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "rules",
      title: "The rules",
      intro:
        "Each one is provable from the definition, and none of them need re-deriving once you trust " +
        "them. These are the whole toolkit for anything that is not a composite.",
      rules: [
        {
          name: "Constant",
          expr: m`\frac{d}{dx}\left[c\right] = 0`,
          note: "A horizontal line has slope zero. Nothing about it changes.",
        },
        {
          name: "Power rule",
          expr: m`\frac{d}{dx}\left[x^{n}\right] = nx^{n-1}`,
          note: m`Bring the exponent down in front, then knock one off it. Works for every real $n$ — negative, fractional, all of it — which is why rewriting a radical or a reciprocal as a power is usually the first move.`,
        },
        {
          name: "Constant multiple",
          expr: m`\frac{d}{dx}\left[c \cdot f(x)\right] = c \cdot f'(x)`,
          note: "A constant factor sits out and waits. It never needs the product rule.",
        },
        {
          name: "Sum and difference",
          expr: m`\frac{d}{dx}\left[f(x) \pm g(x)\right] = f'(x) \pm g'(x)`,
          note: "Differentiate term by term. This is the rule that makes polynomials easy.",
        },
        {
          name: "Product rule",
          expr: m`(fg)' = f'g + fg'`,
          note: m`"First times derivative of second, plus second times derivative of first" — in either order, since it is symmetric. It is emphatically not $f'g'$.`,
        },
        {
          name: "Quotient rule",
          expr: m`\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^{2}}`,
          note: m`Order matters on top: the derivative of the top comes first. Swap them and every sign is wrong. Remember it as "low d-high minus high d-low, over low squared".`,
        },
        {
          name: "Exponential",
          expr: m`\frac{d}{dx}\left[e^{x}\right] = e^{x}, \quad \frac{d}{dx}\left[a^{x}\right] = a^{x}\,\ln a`,
          note: m`$e^{x}$ is its own derivative — the only function that is. Note the variable is in the exponent here, so the power rule has nothing to do with it.`,
        },
        {
          name: "Logarithm",
          expr: m`\frac{d}{dx}\left[\ln x\right] = \frac{1}{x}`,
          note: m`For another base, $\frac{d}{dx}\left[\log_{a} x\right] = \frac{1}{x \ln a}$.`,
        },
        {
          name: "Trigonometric",
          expr: m`\frac{d}{dx}\left[\sin x\right] = \cos x, \quad \frac{d}{dx}\left[\cos x\right] = -\sin x`,
          note: m`The minus belongs to cosine. Also $\frac{d}{dx}\left[\tan x\right] = \sec^{2} x$, and these hold only when $x$ is in radians.`,
        },
      ],
      note: m`Two of these are about shape rather than about a particular function: the sum rule says differentiation splits over $+$, and the product rule says it does not split over $\times$. Everything people get wrong here is one of those two being applied where the other belongs.`,
    },
    {
      kind: "checklist",
      id: "choosing",
      title: "Which rule, and in what order",
      intro:
        "Most of the difficulty in a differentiation problem is decided before any differentiating " +
        "happens. Read the structure first.",
      items: [
        {
          label: "Rewrite before you differentiate",
          detail: m`Turn radicals into fractional powers and reciprocals into negative powers, and split a fraction whose bottom is a single term. $\frac{2x^{3} - x}{x}$ is $2x^{2} - 1$, which needs no quotient rule at all. This one habit removes most of the work.`,
        },
        {
          label: "A sum of terms: go term by term",
          detail: "Differentiate each piece and keep the signs. Nothing about one term affects another.",
        },
        {
          label: "A constant times something: leave the constant alone",
          detail: m`$\frac{d}{dx}\left[7\,\sin x\right]$ is $7\,\cos x$. Using the product rule here is not wrong, just slower — the constant's derivative is zero and that term disappears.`,
        },
        {
          label: "Two genuine functions multiplied: product rule",
          detail: m`Genuine meaning both contain $x$. For something small like $(3x+1)(x^{2}-4)$, expanding first and using the power rule is often quicker; for $x^{2}\,\sin x$ there is no expanding to be done.`,
        },
        {
          label: "One thing over another: quotient rule, or rewrite",
          detail: m`If the denominator is a single power, a negative exponent beats the quotient rule every time. Keep the quotient rule for a genuine binomial below the line.`,
        },
        {
          label: "Something inside something: chain rule",
          detail: m`$\sin(x^{2})$, $(3x+1)^{5}$, $e^{4x}$ — anything wrapped in a shell needs the next lesson. Spotting that you are looking at a composite is the skill; the rule itself is one line.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "power",
      title: "Worked examples — the power rule",
      intro: "Most of these are really a rewriting exercise with one line of calculus at the end.",
      examples: [
        {
          id: "pw-1",
          prompt: m`f(x) = 4x^{3} - 7x^{2} + 2x - 9`,
          pattern: "Term by term",
          tell: "A polynomial: a sum of terms, each a constant times a power.",
          steps: [
            { expr: m`\frac{d}{dx}\left[4x^{3}\right] = 12x^{2}`, reason: m`Exponent down in front: $4 \cdot 3 = 12$, and $3 - 1 = 2$.` },
            { expr: m`\frac{d}{dx}\left[-7x^{2}\right] = -14x`, reason: m`$-7 \cdot 2 = -14$, and $x^{1}$ is written $x$.` },
            { expr: m`\frac{d}{dx}\left[2x\right] = 2`, reason: m`$x^{1} \to 1 \cdot x^{0} = 1$, so the coefficient is all that is left.` },
            { expr: m`\frac{d}{dx}\left[-9\right] = 0`, reason: "A constant contributes nothing." },
            { expr: m`f'(x) = 12x^{2} - 14x + 2`, reason: "Reassemble with the signs kept." },
          ],
          answer: m`f'(x) = 12x^{2} - 14x + 2`,
          check: "A degree-3 polynomial differentiates to a degree-2 one. If the degree did not drop by exactly one, something went wrong.",
        },
        {
          id: "pw-2",
          prompt: m`f(x) = \frac{3}{x^{4}}`,
          pattern: "Negative exponent",
          tell: "A variable in a denominator. Move it upstairs and the power rule handles it.",
          steps: [
            { expr: m`f(x) = 3x^{-4}`, reason: "Rewrite. The quotient rule is not needed and would be slower." },
            { expr: m`f'(x) = 3 \cdot (-4)x^{-5}`, reason: m`Power rule: the exponent $-4$ comes down, and $-4 - 1 = -5$.` },
            { expr: m`= -12x^{-5} = -\frac{12}{x^{5}}`, reason: "Back to a fraction, since that is how the question was set." },
          ],
          answer: m`f'(x) = -\frac{12}{x^{5}}`,
          check: m`Subtracting one from a negative exponent makes it more negative. Going from $-4$ to $-3$ is the classic slip.`,
        },
        {
          id: "pw-3",
          prompt: m`f(x) = 5\sqrt{x} + \frac{2}{\sqrt[3]{x}}`,
          pattern: "Radicals as fractional powers",
          tell: "Two radicals. Neither can be differentiated as it stands; both can once rewritten.",
          steps: [
            { expr: m`f(x) = 5x^{\frac{1}{2}} + 2x^{-\frac{1}{3}}`, reason: m`A root is a fractional power, and a root in a denominator makes it negative.` },
            { expr: m`f'(x) = 5 \cdot \frac{1}{2}x^{-\frac{1}{2}} + 2 \cdot \left(-\frac{1}{3}\right)x^{-\frac{4}{3}}`, reason: m`Power rule on each: $\frac{1}{2} - 1 = -\frac{1}{2}$ and $-\frac{1}{3} - 1 = -\frac{4}{3}$.` },
            { expr: m`= \frac{5}{2}x^{-\frac{1}{2}} - \frac{2}{3}x^{-\frac{4}{3}}`, reason: "Tidy the coefficients." },
            { expr: m`= \frac{5}{2\sqrt{x}} - \frac{2}{3\sqrt[3]{x^{4}}}`, reason: "Back into radical form to match the question." },
          ],
          answer: m`f'(x) = \frac{5}{2\sqrt{x}} - \frac{2}{3\sqrt[3]{x^{4}}}`,
          check: m`Subtracting 1 from $-\frac{1}{3}$ means $-\frac{1}{3} - \frac{3}{3}$. Getting $-\frac{2}{3}$ instead is the usual error, and it comes from subtracting in the wrong direction.`,
        },
        {
          id: "pw-4",
          prompt: m`f(x) = \frac{2x^{3} - x}{x}`,
          pattern: "Split before differentiating",
          tell: m`A quotient — but the denominator is a single term, so it divides straight into the top.`,
          steps: [
            { expr: m`f(x) = \frac{2x^{3}}{x} - \frac{x}{x}`, reason: "Split the fraction over the two terms on top." },
            { expr: m`= 2x^{2} - 1`, reason: "Cancel one x from each. No calculus has happened yet." },
            { expr: m`f'(x) = 4x`, reason: "Power rule, and the constant drops." },
          ],
          answer: m`f'(x) = 4x`,
          check:
            "The quotient rule would have reached the same answer after considerably more algebra. " +
            "Reading the structure first is worth more here than knowing another rule.",
        },
      ],
    },
    {
      kind: "examples",
      id: "product-quotient",
      title: "Worked examples — product and quotient",
      intro: "For these the structure genuinely needs the rule; there is no rewriting your way out.",
      examples: [
        {
          id: "pq-1",
          prompt: m`f(x) = x^{2}\,\sin x`,
          pattern: "Product rule",
          tell: m`Two functions multiplied, both containing $x$, and neither can be absorbed into the other.`,
          steps: [
            { expr: m`f = x^{2}, \quad g = \sin x`, reason: "Name the two parts before touching anything. This is what stops the terms getting crossed." },
            { expr: m`f' = 2x, \quad g' = \cos x`, reason: "Differentiate each separately." },
            { expr: m`(fg)' = 2x\,\sin x + x^{2}\,\cos x`, reason: m`$f'g + fg'$ — each term keeps one factor undifferentiated.` },
          ],
          answer: m`f'(x) = 2x\,\sin x + x^{2}\,\cos x`,
          check: m`Two terms out of two factors, always. One term means a missed half; $2x\,\cos x$ alone would be the $f'g'$ mistake.`,
        },
        {
          id: "pq-2",
          prompt: m`f(x) = xe^{x}`,
          pattern: "Product rule with an exponential",
          tell: m`A power times an exponential. Not a power of $e$ — the $x$ is in the exponent, so the power rule is not in play.`,
          steps: [
            { expr: m`f = x, \quad g = e^{x}`, reason: "Name the parts." },
            { expr: m`f' = 1, \quad g' = e^{x}`, reason: m`$e^{x}$ is its own derivative.` },
            { expr: m`= 1 \cdot e^{x} + x \cdot e^{x}`, reason: "Product rule." },
            { expr: m`= e^{x}(1 + x)`, reason: m`Factor $e^{x}$ out. Tidier, and it makes the zero visible at $x = -1$.` },
          ],
          answer: m`f'(x) = e^{x}(1 + x)`,
        },
        {
          id: "pq-3",
          prompt: m`f(x) = \frac{x^{2} + 1}{x - 3}`,
          pattern: "Quotient rule",
          tell: "A genuine binomial underneath, so it cannot be split or rewritten away.",
          steps: [
            { expr: m`f = x^{2} + 1, \quad g = x - 3`, reason: m`Top is $f$, bottom is $g$.` },
            { expr: m`f' = 2x, \quad g' = 1`, reason: "Differentiate each." },
            { expr: m`= \frac{2x(x - 3) - \left(x^{2} + 1\right)(1)}{(x - 3)^{2}}`, reason: m`$\frac{f'g - fg'}{g^{2}}$. Derivative of the top first — this is where the order matters.` },
            { expr: m`= \frac{2x^{2} - 6x - x^{2} - 1}{(x - 3)^{2}}`, reason: "Expand the top, distributing the minus across both terms." },
            { expr: m`= \frac{x^{2} - 6x - 1}{(x - 3)^{2}}`, reason: "Collect." },
          ],
          answer: m`f'(x) = \frac{x^{2} - 6x - 1}{(x - 3)^{2}}`,
          check: "The denominator is the original denominator squared, never differentiated. Leaving it factored is standard and makes the undefined point obvious.",
        },
        {
          id: "pq-4",
          prompt: m`f(x) = \frac{2x + 5}{3x - 1}`,
          pattern: "Quotient rule, the x's cancel",
          tell: "Linear over linear. Expect the answer to lose its x entirely.",
          steps: [
            { expr: m`f' = 2, \quad g' = 3`, reason: m`With $f = 2x+5$ and $g = 3x-1$.` },
            { expr: m`= \frac{2(3x - 1) - (2x + 5)(3)}{(3x - 1)^{2}}`, reason: "Quotient rule." },
            { expr: m`= \frac{6x - 2 - 6x - 15}{(3x - 1)^{2}}`, reason: m`Expand. The minus reaches both parts of $(2x+5)(3)$.` },
            { expr: m`= \frac{-17}{(3x - 1)^{2}}`, reason: m`The $6x$ terms cancel, leaving a constant on top.` },
          ],
          answer: m`f'(x) = -\frac{17}{(3x - 1)^{2}}`,
          check: m`A constant numerator is expected for linear over linear, and the sign tells you the curve falls everywhere it is defined. An $x$ surviving on top means the expansion went wrong.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "using",
      title: "Worked examples — using a derivative",
      intro:
        "A derivative is rarely the final answer. These are the two things a question usually wants " +
        "next.",
      examples: [
        {
          id: "us-1",
          prompt: m`\text{Tangent to } y = x^{2} - 4x + 3 \text{ at } x = 3`,
          pattern: "Tangent line",
          tell: "A tangent is a line, and a line needs a point and a slope. The derivative supplies the slope; the original function supplies the point.",
          steps: [
            { expr: m`y = 3^{2} - 4(3) + 3 = 0`, reason: m`The point. Use the original function, not the derivative — the point is on the curve.` },
            { expr: m`\frac{dy}{dx} = 2x - 4`, reason: "Differentiate." },
            { expr: m`m = 2(3) - 4 = 2`, reason: m`The slope. Use the derivative, evaluated at the same $x$.` },
            { expr: m`y - 0 = 2(x - 3)`, reason: "Point-slope, from the Lines lesson." },
            { expr: m`y = 2x - 6`, reason: "Tidy into slope-intercept form." },
          ],
          answer: m`y = 2x - 6`,
          check: m`Both must be evaluated at the same $x$. Mixing the point from one place and the slope from another is the commonest way to lose this question.`,
        },
        {
          id: "us-2",
          prompt: m`f(x) = x^{4} - 3x^{2}, \quad \text{find } f''(x) \text{ and } f'''(x)`,
          pattern: "Higher derivatives",
          tell: "Differentiate, then differentiate the answer. Nothing new is needed.",
          steps: [
            { expr: m`f'(x) = 4x^{3} - 6x`, reason: "Power rule, term by term." },
            { expr: m`f''(x) = 12x^{2} - 6`, reason: m`Differentiate $f'$. The second derivative is the rate at which the slope itself changes — it is what tells you a curve bends upwards or downwards.` },
            { expr: m`f'''(x) = 24x`, reason: m`Once more. Each pass drops the degree by one, so a polynomial eventually differentiates to zero.` },
          ],
          answer: m`f''(x) = 12x^{2} - 6, \quad f'''(x) = 24x`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`(fg)' = f'g'`,
          right: m`(fg)' = f'g + fg'`,
          why: m`Test it on something you know: $x \cdot x = x^{2}$ has derivative $2x$, but $x' \cdot x' = 1 \cdot 1 = 1$. Differentiation splits over addition, never over multiplication.`,
        },
        {
          wrong: m`\left(\frac{f}{g}\right)' = \frac{f'}{g'}`,
          right: m`\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^{2}}`,
          why: m`Same test: $\frac{x^{2}}{x} = x$ has derivative 1, while $\frac{2x}{1} = 2x$. The shortcut is not a rule.`,
        },
        {
          wrong: m`\frac{d}{dx}\left[e^{x}\right] = xe^{x-1}`,
          right: m`\frac{d}{dx}\left[e^{x}\right] = e^{x}`,
          why: m`The power rule is for a variable base with a constant exponent. Here it is the other way round — constant base, variable exponent — and that is a different rule entirely. Check which one is moving before choosing.`,
        },
        {
          wrong: m`\frac{d}{dx}\left[x^{-4}\right] = -4x^{-3}`,
          right: m`\frac{d}{dx}\left[x^{-4}\right] = -4x^{-5}`,
          why: m`The rule says subtract one, and subtracting one from $-4$ gives $-5$. A negative exponent gets more negative, not less.`,
        },
        {
          wrong: m`\frac{d}{dx}\left[\cos x\right] = \sin x`,
          right: m`\frac{d}{dx}\left[\cos x\right] = -\sin x`,
          why: m`The minus is real and belongs to cosine. Sine differentiates cleanly to cosine; cosine differentiates to sine and picks up a sign.`,
        },
        {
          wrong: m`\frac{d}{dx}\left[\frac{f}{g}\right] = \frac{fg' - f'g}{g^{2}}`,
          right: m`\frac{d}{dx}\left[\frac{f}{g}\right] = \frac{f'g - fg'}{g^{2}}`,
          why: "Right shape, wrong order — and it gives the exact negative of the true answer every time. The derivative of the top always leads.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Rewrite first where it helps, then pick the rule.",
      problems: [
        {
          prompt: m`f(x) = 6x^{5} - 4x^{3} + x - 12`,
          answer: m`f'(x) = 30x^{4} - 12x^{2} + 1`,
          hint: "Term by term. The constant goes to zero.",
        },
        {
          prompt: m`f(x) = \frac{5}{x^{2}}`,
          answer: m`f'(x) = -\frac{10}{x^{3}}`,
          hint: m`Rewrite as $5x^{-2}$ first.`,
        },
        {
          prompt: m`f(x) = 8\sqrt{x}`,
          answer: m`f'(x) = \frac{4}{\sqrt{x}}`,
          hint: m`$8x^{\frac{1}{2}}$, so the derivative is $4x^{-\frac{1}{2}}$.`,
        },
        {
          prompt: m`f(x) = x^{3}\,\cos x`,
          answer: m`f'(x) = 3x^{2}\,\cos x - x^{3}\,\sin x`,
          hint: "Product rule, and remember cosine's minus.",
        },
        {
          prompt: m`f(x) = \frac{x}{x + 1}`,
          answer: m`f'(x) = \frac{1}{(x + 1)^{2}}`,
          hint: m`Quotient rule: the top is $1(x+1) - x(1)$.`,
        },
        {
          prompt: m`f(x) = \frac{4x^{5} + 2x^{2}}{x^{2}}`,
          answer: m`f'(x) = 12x^{2}`,
          hint: "Split the fraction first — the quotient rule is not needed.",
        },
        {
          prompt: m`\text{Tangent to } y = x^{3} \text{ at } x = 2`,
          answer: m`y = 12x - 16`,
          hint: m`Point $(2, 8)$ and slope $f'(2) = 12$, then point-slope.`,
        },
        {
          prompt: m`f(x) = 2e^{x} + 3\,\ln x`,
          answer: m`f'(x) = 2e^{x} + \frac{3}{x}`,
          hint: "Both are standard derivatives; the constants just ride along.",
        },
      ],
    },
  ],
};
