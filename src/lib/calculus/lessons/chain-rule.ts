import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const chainRule: Lesson = {
  slug: "chain-rule",
  title: "The Chain Rule",
  blurb: "Differentiating something inside something else — spotting the layers, then peeling them.",
  source: "Calculus — differentiation",
  summary:
    "Every rule in the previous lesson handles functions built by adding, multiplying or dividing. " +
    "The chain rule handles the one remaining way to build a function: putting one inside another. " +
    "That covers most of what you will actually meet, so this rule gets used more than all the " +
    "others together. The rule itself is a single line; the skill is seeing that you are looking at " +
    "a composite in the first place.",
  sections: [
    {
      kind: "rules",
      id: "idea",
      title: "The rule",
      rules: [
        {
          name: "Chain rule",
          expr: m`\frac{d}{dx}\left[f(g(x))\right] = f'(g(x)) \cdot g'(x)`,
          note: "Differentiate the outside, leave the inside exactly as it was, then multiply by the derivative of the inside. That last factor is the part people drop.",
        },
        {
          name: "In Leibniz notation",
          expr: m`\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}`,
          note: m`With $u$ the inside. Written this way it looks like cancelling $du$, which is a useful memory hook and not a proof.`,
        },
        {
          name: "Why there is a second factor",
          expr: m`\frac{d}{dx}\left[(3x)^{2}\right] = 18x, \text{ not } 6x`,
          note: m`Expand and check: $(3x)^{2} = 9x^{2}$, whose derivative is $18x$. The inside runs three times as fast as $x$, so the whole thing does too. Dropping $g'$ ignores that.`,
        },
        {
          name: "The power case",
          expr: m`\frac{d}{dx}\left[\left(g(x)\right)^{n}\right] = n\left(g(x)\right)^{n-1} \cdot g'(x)`,
          note: "The most common form by far. Power rule on the shell, then times the derivative of what is inside it.",
        },
        {
          name: "With the standard functions",
          expr: m`\frac{d}{dx}\left[\sin(g)\right] = \cos(g) \cdot g', \quad \frac{d}{dx}\left[e^{g}\right] = e^{g} \cdot g'`,
          note: m`And $\frac{d}{dx}\left[\ln(g)\right] = \frac{g'}{g}$, which is the same rule with $\frac{1}{g}$ as the outer derivative.`,
        },
      ],
      note: m`When the inside is just $x$, its derivative is 1 and the extra factor changes nothing — which is why the rules in the last lesson looked like they had no chain factor. They did; it was invisible.`,
    },
    {
      kind: "checklist",
      id: "spotting",
      title: "Finding the inside and the outside",
      intro:
        "Getting the layers the right way round is the whole job. One question settles it every time.",
      items: [
        {
          label: "Ask what you would do last",
          detail: m`If you had to work out $\sin(x^{2})$ for $x = 3$ on a calculator, you would square first and take the sine last. The thing you do last is the outside; everything you did before it is the inside.`,
        },
        {
          label: "Look for a shell",
          detail: m`A bracket raised to a power, or $\sin(\;)$, $\cos(\;)$, $e^{(\;)}$, $\ln(\;)$, $\sqrt{\;}$ with something more than a bare $x$ in it. That is a composite and it needs the rule.`,
        },
        {
          label: "Watch the notation that hides it",
          detail: m`$\cos^{3}x$ means $(\cos x)^{3}$ — a cube on the outside, cosine inside. It is a composite even though nothing is visibly nested, and it is a different function from $\cos\left(x^{3}\right)$.`,
        },
        {
          label: "Peel one layer at a time",
          detail: m`There can be three. $\sin\left(\sqrt{x^{2}+1}\right)$ is sine of a root of a polynomial, and each layer contributes a factor. Take the outermost, then treat the rest as a new problem.`,
        },
        {
          label: "Check the answer contains g'",
          detail:
            "The derivative of the inside must appear as a factor somewhere. If your answer has no " +
            "trace of it, you have dropped it — that is the single most common error in this topic.",
        },
        {
          label: "Do not differentiate the inside in place",
          detail: m`The inside stays exactly as it was inside the outer function. $\frac{d}{dx}\left[\sin\left(x^{2}\right)\right]$ starts $\cos\left(x^{2}\right)$, never $\cos(2x)$.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "basic",
      title: "Worked examples — one layer",
      intro:
        "Each one names the outside and the inside before any differentiating, which is the habit " +
        "worth copying.",
      examples: [
        {
          id: "ch-1",
          prompt: m`y = (3x + 1)^{5}`,
          pattern: "Power of a bracket",
          tell: "A bracket raised to a power, with more than a bare x inside it.",
          steps: [
            { expr: m`\text{outside: } (\;)^{5}, \quad \text{inside: } 3x + 1`, reason: "Raising to the fifth is what you would do last." },
            { expr: m`= 5(3x + 1)^{4} \cdot \frac{d}{dx}\left[3x + 1\right]`, reason: "Power rule on the shell, inside left untouched, times the derivative of the inside." },
            { expr: m`= 5(3x + 1)^{4} \cdot 3`, reason: m`The inside differentiates to 3.` },
            { expr: m`= 15(3x + 1)^{4}`, reason: "Multiply the constants." },
          ],
          answer: m`\frac{dy}{dx} = 15(3x + 1)^{4}`,
          check: m`Without the chain factor you would get $5(3x+1)^{4}$ — too small by a factor of three. Expanding $(3x+1)^{5}$ and differentiating would confirm the 15, at considerable cost.`,
        },
        {
          id: "ch-2",
          prompt: m`y = \sin\left(x^{2}\right)`,
          pattern: "Trig of a polynomial",
          tell: "Sine is applied last, to a square.",
          steps: [
            { expr: m`\text{outside: } \sin(\;), \quad \text{inside: } x^{2}`, reason: "Name the layers." },
            { expr: m`= \cos\left(x^{2}\right) \cdot \frac{d}{dx}\left[x^{2}\right]`, reason: m`Sine differentiates to cosine, and the inside stays $x^{2}$ inside it.` },
            { expr: m`= \cos\left(x^{2}\right) \cdot 2x`, reason: "Derivative of the inside." },
            { expr: m`= 2x\,\cos\left(x^{2}\right)`, reason: "Conventionally the algebraic factor is written first." },
          ],
          answer: m`\frac{dy}{dx} = 2x\,\cos\left(x^{2}\right)`,
          check: m`Note what did not happen: the $x^{2}$ inside the cosine was not touched. $\cos(2x)$ would be a different function altogether.`,
        },
        {
          id: "ch-3",
          prompt: m`y = e^{4x}`,
          pattern: "Exponential of a multiple",
          tell: m`An exponential whose exponent is more than a bare $x$.`,
          steps: [
            { expr: m`\text{outside: } e^{(\;)}, \quad \text{inside: } 4x`, reason: "Name the layers." },
            { expr: m`= e^{4x} \cdot \frac{d}{dx}\left[4x\right]`, reason: m`$e^{\text{anything}}$ differentiates to itself, times the derivative of the anything.` },
            { expr: m`= 4e^{4x}`, reason: "The inside differentiates to 4." },
          ],
          answer: m`\frac{dy}{dx} = 4e^{4x}`,
          check: m`The power rule has no place here. $4xe^{4x-1}$ treats a constant base as if it were a variable one.`,
        },
        {
          id: "ch-4",
          prompt: m`y = \ln\left(x^{2} + 1\right)`,
          pattern: "Logarithm of a polynomial",
          tell: m`The log form is worth learning as its own shape: inside's derivative over the inside.`,
          steps: [
            { expr: m`= \frac{1}{x^{2} + 1} \cdot \frac{d}{dx}\left[x^{2} + 1\right]`, reason: m`$\ln$ differentiates to $\frac{1}{\;}$ of whatever is inside it.` },
            { expr: m`= \frac{1}{x^{2} + 1} \cdot 2x`, reason: "Derivative of the inside." },
            { expr: m`= \frac{2x}{x^{2} + 1}`, reason: "Combine." },
          ],
          answer: m`\frac{dy}{dx} = \frac{2x}{x^{2} + 1}`,
          check: m`The shape $\frac{g'}{g}$ is worth recognising on sight — every logarithm gives it.`,
        },
        {
          id: "ch-5",
          prompt: m`y = \sqrt{x^{3} - 2}`,
          pattern: "Radical of a polynomial",
          tell: "A root with a polynomial under it. Rewrite as a power first, exactly as in the last lesson.",
          steps: [
            { expr: m`y = \left(x^{3} - 2\right)^{\frac{1}{2}}`, reason: "A root is a fractional power, and now it is visibly a power of a bracket." },
            { expr: m`= \frac{1}{2}\left(x^{3} - 2\right)^{-\frac{1}{2}} \cdot \frac{d}{dx}\left[x^{3} - 2\right]`, reason: m`Power rule on the shell: $\frac{1}{2} - 1 = -\frac{1}{2}$.` },
            { expr: m`= \frac{1}{2}\left(x^{3} - 2\right)^{-\frac{1}{2}} \cdot 3x^{2}`, reason: "Derivative of the inside." },
            { expr: m`= \frac{3x^{2}}{2\sqrt{x^{3} - 2}}`, reason: "A negative exponent goes below the line, and back into radical form." },
          ],
          answer: m`\frac{dy}{dx} = \frac{3x^{2}}{2\sqrt{x^{3} - 2}}`,
        },
        {
          id: "ch-6",
          prompt: m`y = \cos^{3}x`,
          pattern: "The composite the notation hides",
          tell: m`$\cos^{3}x$ means $(\cos x)^{3}$. The cube is outside, the cosine inside — nothing looks nested, but it is.`,
          steps: [
            { expr: m`y = (\cos x)^{3}`, reason: "Rewrite so the layers are visible. This step is the whole example." },
            { expr: m`= 3(\cos x)^{2} \cdot \frac{d}{dx}\left[\cos x\right]`, reason: "Power rule on the shell, cosine left alone inside." },
            { expr: m`= 3\,\cos^{2}x \cdot (-\sin x)`, reason: "Cosine differentiates to minus sine." },
            { expr: m`= -3\,\cos^{2}x\,\sin x`, reason: "Tidy the sign to the front." },
          ],
          answer: m`\frac{dy}{dx} = -3\,\cos^{2}x\,\sin x`,
          check: m`Contrast $\cos\left(x^{3}\right)$, which differentiates to $-3x^{2}\,\sin\left(x^{3}\right)$. Two different functions that look almost the same written down.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "combined",
      title: "Worked examples — with the other rules",
      intro:
        "Real questions stack the rules. Decide the outermost structure first — is the whole thing a " +
        "product, a quotient, or a composite? — and apply that rule, using the others inside it.",
      examples: [
        {
          id: "cm-1",
          prompt: m`y = x^{2}(2x + 1)^{4}`,
          pattern: "Product rule with a chain inside",
          tell: "At the top level this is two things multiplied, so the product rule leads. The second factor then needs the chain rule.",
          steps: [
            { expr: m`f = x^{2}, \quad g = (2x + 1)^{4}`, reason: "The outermost structure is a product, so name the two factors." },
            { expr: m`f' = 2x, \quad g' = 4(2x + 1)^{3} \cdot 2 = 8(2x + 1)^{3}`, reason: m`$g$ is a composite, so the chain rule supplies its derivative.` },
            { expr: m`= 2x(2x + 1)^{4} + x^{2} \cdot 8(2x + 1)^{3}`, reason: m`Product rule: $f'g + fg'$.` },
            { expr: m`= 2x(2x + 1)^{3}\left[(2x + 1) + 4x\right]`, reason: m`Factor out what both terms share: $2x$ and the lower power $(2x+1)^{3}$.` },
            { expr: m`= 2x(2x + 1)^{3}(6x + 1)`, reason: "Tidy the bracket." },
          ],
          answer: m`\frac{dy}{dx} = 2x(2x + 1)^{3}(6x + 1)`,
          check:
            "Factoring at the end is worth the effort: the zeros of the derivative are now readable " +
            "straight off, which is what the next question usually wants.",
        },
        {
          id: "cm-2",
          prompt: m`y = \frac{(x + 1)^{3}}{x - 1}`,
          pattern: "Quotient rule with a chain inside",
          tell: "Outermost structure is a quotient, so that rule leads; the numerator needs the chain rule.",
          steps: [
            { expr: m`f = (x + 1)^{3}, \quad g = x - 1`, reason: "Name top and bottom." },
            { expr: m`f' = 3(x + 1)^{2}, \quad g' = 1`, reason: m`Chain rule on the top — though the inside's derivative is 1, so it is invisible here.` },
            { expr: m`= \frac{3(x + 1)^{2}(x - 1) - (x + 1)^{3}}{(x - 1)^{2}}`, reason: m`Quotient rule: $\frac{f'g - fg'}{g^{2}}$.` },
            { expr: m`= \frac{(x + 1)^{2}\left[3(x - 1) - (x + 1)\right]}{(x - 1)^{2}}`, reason: m`Both terms on top share $(x+1)^{2}$.` },
            { expr: m`= \frac{(x + 1)^{2}(2x - 4)}{(x - 1)^{2}}`, reason: m`$3x - 3 - x - 1 = 2x - 4$.` },
            { expr: m`= \frac{2(x + 1)^{2}(x - 2)}{(x - 1)^{2}}`, reason: "Take the 2 out." },
          ],
          answer: m`\frac{dy}{dx} = \frac{2(x + 1)^{2}(x - 2)}{(x - 1)^{2}}`,
        },
        {
          id: "cm-3",
          prompt: m`y = \sin\left(\sqrt{x^{2} + 1}\right)`,
          pattern: "Three layers",
          tell: "Sine of a root of a polynomial. Each layer contributes one factor, so expect three things multiplied.",
          steps: [
            { expr: m`\text{layers: } \sin(\;) \;/\; \sqrt{\;} \;/\; x^{2} + 1`, reason: "Outermost to innermost. Writing them down first prevents losing one." },
            { expr: m`= \cos\left(\sqrt{x^{2} + 1}\right) \cdot \frac{d}{dx}\left[\sqrt{x^{2} + 1}\right]`, reason: "Peel the sine. Everything inside it is left exactly as it was." },
            { expr: m`\frac{d}{dx}\left[\sqrt{x^{2} + 1}\right] = \frac{2x}{2\sqrt{x^{2} + 1}} = \frac{x}{\sqrt{x^{2} + 1}}`, reason: "The inner problem on its own — the same shape as the radical example above." },
            { expr: m`= \cos\left(\sqrt{x^{2} + 1}\right) \cdot \frac{x}{\sqrt{x^{2} + 1}}`, reason: "Put it back." },
            { expr: m`= \frac{x\,\cos\left(\sqrt{x^{2} + 1}\right)}{\sqrt{x^{2} + 1}}`, reason: "Combine into one fraction." },
          ],
          answer: m`\frac{dy}{dx} = \frac{x\,\cos\left(\sqrt{x^{2} + 1}\right)}{\sqrt{x^{2} + 1}}`,
          check: "Three layers, three factors — cosine, the root's derivative, and the polynomial's. Count them against the layers as a check.",
        },
        {
          id: "cm-4",
          prompt: m`y = e^{\sin x}`,
          pattern: "Exponential of a trig function",
          tell: m`The exponent is a whole function, so $e$ to it is a composite.`,
          steps: [
            { expr: m`= e^{\sin x} \cdot \frac{d}{dx}\left[\sin x\right]`, reason: m`$e^{g}$ differentiates to $e^{g} \cdot g'$, the exponent untouched.` },
            { expr: m`= e^{\sin x}\,\cos x`, reason: "Derivative of the inside." },
          ],
          answer: m`\frac{dy}{dx} = e^{\sin x}\,\cos x`,
        },
        {
          id: "cm-5",
          prompt: m`y = \ln(\cos x)`,
          pattern: "Logarithm of a trig function",
          tell: m`The $\frac{g'}{g}$ shape again, and this one simplifies into something recognisable.`,
          steps: [
            { expr: m`= \frac{1}{\cos x} \cdot \frac{d}{dx}\left[\cos x\right]`, reason: "Log of something is one over that something, times its derivative." },
            { expr: m`= \frac{-\sin x}{\cos x}`, reason: "Cosine differentiates to minus sine." },
            { expr: m`= -\tan x`, reason: m`$\frac{\sin x}{\cos x}$ is $\tan x$ by definition.` },
          ],
          answer: m`\frac{dy}{dx} = -\tan x`,
          check: "Worth simplifying at the end. A tidy answer is easier to check and easier to use in whatever comes next.",
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`\frac{d}{dx}\left[(3x + 1)^{5}\right] = 5(3x + 1)^{4}`,
          right: m`\frac{d}{dx}\left[(3x + 1)^{5}\right] = 15(3x + 1)^{4}`,
          why: "The dropped chain factor — the single most common error in the topic. The power rule alone is only correct when the inside is a bare x, and here it runs three times as fast.",
        },
        {
          wrong: m`\frac{d}{dx}\left[\sin\left(x^{2}\right)\right] = \cos(2x)`,
          right: m`\frac{d}{dx}\left[\sin\left(x^{2}\right)\right] = 2x\,\cos\left(x^{2}\right)`,
          why: "The inside was differentiated where it stood instead of being left alone and multiplied on the outside. The inside never changes inside the outer function.",
        },
        {
          wrong: m`\cos^{3}x = \cos\left(x^{3}\right)`,
          right: m`\cos^{3}x = (\cos x)^{3}`,
          why: m`Different functions, and their derivatives are nothing alike: $-3\,\cos^{2}x\,\sin x$ against $-3x^{2}\,\sin\left(x^{3}\right)$. Test at $x = 2$ if it ever looks ambiguous.`,
        },
        {
          wrong: m`\frac{d}{dx}\left[e^{4x}\right] = 4xe^{4x - 1}`,
          right: m`\frac{d}{dx}\left[e^{4x}\right] = 4e^{4x}`,
          why: "The power rule applied to a constant base. An exponential never loses its exponent — it keeps it and picks up the derivative of it as a factor.",
        },
        {
          wrong: m`\frac{d}{dx}\left[\sqrt{g}\right] = \frac{1}{2\sqrt{g'}}`,
          right: m`\frac{d}{dx}\left[\sqrt{g}\right] = \frac{g'}{2\sqrt{g}}`,
          why: "The inside stays inside the root; its derivative appears as a factor on top. Differentiating underneath the root is the same mistake as the sine one, wearing a different hat.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Name the outside and the inside before differentiating anything.",
      problems: [
        {
          prompt: m`y = (5x - 2)^{7}`,
          answer: m`\frac{dy}{dx} = 35(5x - 2)^{6}`,
          hint: m`$7(5x-2)^{6}$ times the inside's derivative, 5.`,
        },
        {
          prompt: m`y = \cos(3x)`,
          answer: m`\frac{dy}{dx} = -3\,\sin(3x)`,
          hint: "Cosine's minus, and the chain factor 3.",
        },
        {
          prompt: m`y = e^{x^{2}}`,
          answer: m`\frac{dy}{dx} = 2xe^{x^{2}}`,
          hint: "The exponent is untouched; its derivative multiplies on the outside.",
        },
        {
          prompt: m`y = \sqrt{4x + 9}`,
          answer: m`\frac{dy}{dx} = \frac{2}{\sqrt{4x + 9}}`,
          hint: m`$\frac{4}{2\sqrt{4x+9}}$, then reduce.`,
        },
        {
          prompt: m`y = \ln\left(x^{3} + 5\right)`,
          answer: m`\frac{dy}{dx} = \frac{3x^{2}}{x^{3} + 5}`,
          hint: m`The $\frac{g'}{g}$ shape.`,
        },
        {
          prompt: m`y = \sin^{2}x`,
          answer: m`\frac{dy}{dx} = 2\,\sin x\,\cos x`,
          hint: m`Read it as $(\sin x)^{2}$ — a square on the outside.`,
        },
        {
          prompt: m`y = x(3x + 2)^{5}`,
          answer: m`\frac{dy}{dx} = (3x + 2)^{4}(18x + 2)`,
          hint: m`Product rule first, then factor out $(3x+2)^{4}$.`,
        },
        {
          prompt: m`y = \frac{1}{(2x - 7)^{3}}`,
          answer: m`\frac{dy}{dx} = -\frac{6}{(2x - 7)^{4}}`,
          hint: m`Rewrite as $(2x-7)^{-3}$ and no quotient rule is needed.`,
        },
      ],
    },
  ],
};
