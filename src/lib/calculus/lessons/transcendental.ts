import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const transcendental: Lesson = {
  slug: "transcendental",
  title: "Transcendental Derivatives",
  blurb: "Trigonometric, exponential and logarithmic — the limits they rest on, then the derivative of each.",
  source: "EM-1101 Module 4 — Differentiation of Transcendental Functions",
  summary:
    "A transcendental function is one that cannot be built from powers of x by arithmetic alone: " +
    "the trigonometric family, the exponential family, and the logarithms that invert them. Each " +
    "comes with its own derivative formula, and almost every one of those formulas is proved from " +
    "a single limit — that sin θ over θ heads to 1. Learn the table, then let the chain rule do " +
    "the rest of the work.",
  sections: [
    {
      kind: "rules",
      id: "special-limits",
      title: "The two special trigonometric limits",
      intro:
        "Every trigonometric derivative is built from these. Both are 0/0 on substitution, so " +
        "neither can be read off directly.",
      rules: [
        {
          name: "The one that matters",
          expr: m`\lim_{θ \to 0} \frac{\sin θ}{θ} = 1`,
          note: "With θ in radians. In degrees the answer is not 1, which is the whole reason calculus insists on radians.",
        },
        {
          name: "Its partner",
          expr: m`\lim_{θ \to 0} \frac{1 - \cos θ}{θ} = 0`,
          note: m`Multiply above and below by $1 + \cos θ$ to turn the top into $\sin^{2} θ$, then split it into $\frac{\sin θ}{θ} \cdot \frac{\sin θ}{1 + \cos θ}$, which heads to $1 \cdot 0$.`,
        },
        {
          name: "Where the first one comes from",
          expr: m`\cos θ \le \frac{\sin θ}{θ} \le 1`,
          note: "Three regions of a unit circle — a triangle inside a sector inside a bigger triangle — give this sandwich. Both ends head to 1 as θ shrinks, so the squeeze theorem traps the middle at 1.",
        },
        {
          name: "Reading a disguised version",
          expr: m`\lim_{x \to 0} \frac{\sin kx}{x} = k`,
          note: m`Match the angle top and bottom: $\frac{\sin kx}{x} = k \cdot \frac{\sin kx}{kx}$, and the bracket is the standard limit with $kx$ in the role of θ.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "trig-rules",
      title: "Derivatives of the trigonometric functions",
      intro: "Six formulas. The three on the right are the three on the left with a minus sign and a co- in front, which is most of the memory work.",
      rules: [
        { name: "Sine", expr: m`\frac{d}{dx}\left(\sin x\right) = \cos x` },
        { name: "Cosine", expr: m`\frac{d}{dx}\left(\cos x\right) = -\sin x`, note: "The minus sign here is the one that gets dropped most often." },
        { name: "Tangent", expr: m`\frac{d}{dx}\left(\tan x\right) = \sec^{2} x` },
        { name: "Cosecant", expr: m`\frac{d}{dx}\left(\csc x\right) = -\csc x \cot x` },
        { name: "Secant", expr: m`\frac{d}{dx}\left(\sec x\right) = \sec x \tan x` },
        { name: "Cotangent", expr: m`\frac{d}{dx}\left(\cot x\right) = -\csc^{2} x` },
      ],
      note: "Every co-function carries a minus sign. Sine, tangent and secant do not.",
    },
    {
      kind: "examples",
      id: "trig",
      title: "Worked examples — trigonometric",
      examples: [
        {
          id: "tr-1",
          prompt: m`\text{Differentiate } f(x) = \frac{\sec x}{1 + \tan x}`,
          pattern: "Quotient rule, then a Pythagorean identity",
          tell: "A quotient of two trigonometric expressions. Expect the identity sec²x = 1 + tan²x to collapse the answer at the end.",
          steps: [
            {
              expr: m`u = \sec x, \quad u' = \sec x \tan x`,
              reason: "Name the top and differentiate it.",
            },
            {
              expr: m`v = 1 + \tan x, \quad v' = \sec^{2} x`,
              reason: "And the bottom. The 1 differentiates away.",
            },
            {
              expr: m`f'(x) = \frac{\sec x \tan x \left(1 + \tan x\right) - \sec x \cdot \sec^{2} x}{\left(1 + \tan x\right)^{2}}`,
              reason: "Quotient rule: bottom times derivative of top, minus top times derivative of bottom, all over bottom squared.",
            },
            {
              expr: m`= \frac{\sec x \left(\tan x + \tan^{2} x - \sec^{2} x\right)}{\left(1 + \tan x\right)^{2}}`,
              reason: "Every term on top carries a sec x, so factor it out.",
            },
            {
              expr: m`\tan^{2} x - \sec^{2} x = -1`,
              reason: "From sec²x = 1 + tan²x. This is the collapse the problem was built around.",
            },
            {
              expr: m`f'(x) = \frac{\sec x \left(\tan x - 1\right)}{\left(1 + \tan x\right)^{2}}`,
              reason: "Substitute the −1 back in.",
            },
          ],
          answer: m`\frac{\sec x \left(\tan x - 1\right)}{\left(1 + \tan x\right)^{2}}`,
          check: m`At $x = 0$: $\sec 0 = 1$, $\tan 0 = 0$, so $f'(0) = \frac{1(0 - 1)}{1} = -1$. The original is $\frac{\sec x}{1 + \tan x}$, which near 0 falls as the denominator grows — a negative slope, as found.`,
        },
        {
          id: "tr-2",
          prompt: m`\text{Differentiate } f(x) = \sin\left(\cos\left(\tan x\right)\right)`,
          pattern: "Chain rule, three layers deep",
          tell: "Three functions nested. Work outside in and multiply one derivative per layer, copying the inside of each layer down unchanged.",
          steps: [
            {
              expr: m`\text{outer } \sin, \quad \text{middle } \cos, \quad \text{inner } \tan x`,
              reason: "Name the layers before differentiating anything.",
            },
            {
              expr: m`f'(x) = \cos\left(\cos\left(\tan x\right)\right) \cdot \frac{d}{dx}\left[\cos\left(\tan x\right)\right]`,
              reason: "Peel the outer sine. Its inside is copied down untouched.",
            },
            {
              expr: m`\frac{d}{dx}\left[\cos\left(\tan x\right)\right] = -\sin\left(\tan x\right) \cdot \sec^{2} x`,
              reason: "Peel the cosine — minus sine — then the inner tangent gives sec²x.",
            },
            {
              expr: m`f'(x) = -\cos\left(\cos\left(\tan x\right)\right) \sin\left(\tan x\right) \sec^{2} x`,
              reason: "Multiply the three factors together.",
            },
          ],
          answer: m`-\cos\left(\cos\left(\tan x\right)\right) \sin\left(\tan x\right) \sec^{2} x`,
          check: "Count the factors: three layers must produce three factors. Any answer with only two has lost one.",
        },
        {
          id: "tr-3",
          prompt: m`\text{Differentiate } y = \sqrt{\sec x^{3}}`,
          pattern: "Chain rule under a root",
          tell: "A root on the outside, a secant in the middle, a cube on the inside. Rewrite the root as a half power first so the power rule can act on it.",
          steps: [
            {
              expr: m`y = \left(\sec x^{3}\right)^{1/2}`,
              reason: "A square root is a one-half power. Nothing else can be done until it is written that way.",
            },
            {
              expr: m`y' = \frac{1}{2}\left(\sec x^{3}\right)^{-1/2} \cdot \frac{d}{dx}\left(\sec x^{3}\right)`,
              reason: "Power rule on the outside, inside copied down.",
            },
            {
              expr: m`\frac{d}{dx}\left(\sec x^{3}\right) = \sec x^{3} \tan x^{3} \cdot 3x^{2}`,
              reason: "Secant gives sec·tan, then the inner cube gives 3x².",
            },
            {
              expr: m`y' = \frac{3x^{2}}{2} \cdot \frac{\sec x^{3} \tan x^{3}}{\sqrt{\sec x^{3}}}`,
              reason: "Collect. The negative half power is a root in the denominator.",
            },
            {
              expr: m`y' = \frac{3x^{2}}{2} \tan x^{3} \sqrt{\sec x^{3}}`,
              reason: "One secant on top cancels against the root, leaving a single root upstairs.",
            },
          ],
          answer: m`\frac{3x^{2}}{2} \tan x^{3} \sqrt{\sec x^{3}}`,
          check: m`The cancellation is $\frac{\sec x^{3}}{\sqrt{\sec x^{3}}} = \sqrt{\sec x^{3}}$, since dividing by a half power subtracts a half from the exponent.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "exp-rules",
      title: "Exponential functions",
      intro: m`An exponential function has the variable in the exponent: $f(x) = b^{x}$ with $b$ a positive constant. Not to be confused with a power function, where the variable is in the base.`,
      rules: [
        {
          name: "Growth and decay",
          expr: m`\lim_{x \to \infty} b^{x} = \infty \;\text{ if } b > 1, \quad 0 \;\text{ if } 0 < b < 1`,
          note: "And the reverse as x heads to minus infinity. A negative exponent flips the base over, so 2 to the minus x behaves like one-half to the x.",
        },
        {
          name: "The number e",
          expr: m`\lim_{h \to 0} \frac{e^{h} - 1}{h} = 1`,
          note: "e is defined as the base that makes this limit exactly 1, which is what makes its derivative formula the simplest of all of them.",
        },
        {
          name: "Derivative of e to the u",
          expr: m`\frac{d}{dx}\left(e^{u}\right) = e^{u} \frac{du}{dx}`,
          note: "The function is its own derivative, times whatever the chain rule owes for the exponent.",
        },
        {
          name: "Derivative of any base",
          expr: m`\frac{d}{dx}\left(b^{u}\right) = b^{u} \ln b \frac{du}{dx}`,
          note: m`The extra $\ln b$ is the price of not using $e$. It disappears when $b = e$, because $\ln e = 1$.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "exp",
      title: "Worked examples — exponential",
      examples: [
        {
          id: "ex-1",
          prompt: m`\text{Evaluate } \lim_{x \to \infty} \left(2^{-x} - 1\right)`,
          pattern: "Exponential decay",
          tell: "A negative exponent heading to plus infinity. Flip the base over and the behaviour is obvious.",
          steps: [
            {
              expr: m`2^{-x} = \left(\frac{1}{2}\right)^{x}`,
              reason: "A negative exponent is a reciprocal base.",
            },
            {
              expr: m`\lim_{x \to \infty} \left(\frac{1}{2}\right)^{x} = 0`,
              reason: "A base below 1 raised to a growing power shrinks to nothing.",
            },
            {
              expr: m`0 - 1 = -1`,
              reason: "The constant is untouched by the limit.",
            },
          ],
          answer: m`-1`,
          check: m`Sanity check with $x = 10$: $2^{-10} \approx 0.001$, so the expression is about $-0.999$. Already close.`,
        },
        {
          id: "ex-2",
          prompt: m`\text{Evaluate } \lim_{x \to \infty} \frac{e^{2x}}{e^{2x} + 1}`,
          pattern: "Infinity over infinity",
          tell: "Both top and bottom run away. Divide through by the fastest-growing term, exactly as with a rational function.",
          steps: [
            {
              expr: m`\frac{e^{2x}}{e^{2x} + 1} \cdot \frac{1/e^{2x}}{1/e^{2x}}`,
              reason: "Divide top and bottom by the dominant term.",
            },
            {
              expr: m`= \frac{1}{1 + e^{-2x}}`,
              reason: "The top becomes 1 and the stray 1 downstairs becomes a decaying exponential.",
            },
            {
              expr: m`e^{-2x} \to 0`,
              reason: "A decaying exponential vanishes as x grows.",
            },
            {
              expr: m`\frac{1}{1 + 0} = 1`,
              reason: "Substitute the limit of the piece.",
            },
          ],
          answer: m`1`,
          check: "Makes sense: the +1 downstairs is negligible once e^{2x} is enormous, so the fraction is essentially a number over itself.",
        },
        {
          id: "ex-3",
          prompt: m`\text{Differentiate } y = e^{\tan μ}`,
          pattern: "Exponential with a chain",
          tell: "e to something that is not just μ, so the exponent owes a derivative.",
          steps: [
            {
              expr: m`u = \tan μ, \quad \frac{du}{dμ} = \sec^{2} μ`,
              reason: "Name the exponent and differentiate it.",
            },
            {
              expr: m`\frac{dy}{dμ} = e^{\tan μ} \cdot \sec^{2} μ`,
              reason: "Copy the exponential down unchanged, then multiply by the exponent's derivative.",
            },
          ],
          answer: m`e^{\tan μ} \sec^{2} μ`,
          check: "The exponential never changes form. Everything that happens, happens in the factor beside it.",
        },
        {
          id: "ex-4",
          prompt: m`\text{Differentiate } y = e^{-4z} \sin 5z`,
          pattern: "Product rule, both factors needing a chain",
          tell: "Two functions multiplied, and each one has an inner constant that the chain rule will charge for.",
          steps: [
            {
              expr: m`u = e^{-4z}, \quad u' = -4e^{-4z}`,
              reason: "Exponential copied down, times the derivative of the exponent.",
            },
            {
              expr: m`v = \sin 5z, \quad v' = 5\cos 5z`,
              reason: "Sine becomes cosine, times the derivative of the angle.",
            },
            {
              expr: m`y' = -4e^{-4z}\sin 5z + e^{-4z} \cdot 5\cos 5z`,
              reason: "Product rule: derivative of the first times the second, plus the first times the derivative of the second.",
            },
            {
              expr: m`y' = e^{-4z}\left(5\cos 5z - 4\sin 5z\right)`,
              reason: "The exponential is common to both terms, so factor it out.",
            },
          ],
          answer: m`e^{-4z}\left(5\cos 5z - 4\sin 5z\right)`,
          check: m`At $z = 0$: $y' = 1 \cdot (5 - 0) = 5$. The original at $z = 0$ is 0 and rising steeply, which fits.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "log-rules",
      title: "Logarithmic functions",
      intro: m`A logarithm is the inverse of an exponential: $\log_{b} x$ is the power the base $b$ must be raised to in order to give $x$. It only accepts positive inputs.`,
      rules: [
        {
          name: "Product and quotient",
          expr: m`\log_{b}(xy) = \log_{b} x + \log_{b} y, \quad \log_{b}\frac{x}{y} = \log_{b} x - \log_{b} y`,
          note: "A logarithm turns multiplication into addition. This is the property that makes it worth taking logs before differentiating.",
        },
        {
          name: "Power",
          expr: m`\log_{b}\left(x^{r}\right) = r \log_{b} x`,
          note: "An exponent comes down to the front as a coefficient — including a root, which is a fractional exponent.",
        },
        {
          name: "Natural logarithm",
          expr: m`\ln x = y \iff e^{y} = x, \quad \ln e = 1`,
          note: m`$\ln$ is $\log_{e}$. It also undoes the exponential in both directions: $\ln\left(e^{x}\right) = x$ and $e^{\ln x} = x$ for $x > 0$.`,
        },
        {
          name: "Change of base",
          expr: m`\log_{b} x = \frac{\ln x}{\ln b}`,
          note: "Any logarithm is a natural logarithm divided by a constant, which is where the ln b in the derivative formula comes from.",
        },
        {
          name: "Derivative of ln",
          expr: m`\frac{d}{dx}\left(\ln u\right) = \frac{1}{u}\frac{du}{dx}`,
          note: m`And $\frac{d}{dx}\ln\left|x\right| = \frac{1}{x}$, which is the same formula with the domain widened to the negatives.`,
        },
        {
          name: "Derivative of any base",
          expr: m`\frac{d}{dx}\left(\log_{b} x\right) = \frac{1}{x \ln b}`,
          note: "Straight from change of base: the constant 1 over ln b rides along untouched.",
        },
      ],
    },
    {
      kind: "examples",
      id: "log",
      title: "Worked examples — logarithmic",
      examples: [
        {
          id: "lg-1",
          prompt: m`\text{Evaluate } \lim_{x \to 0} \log_{10}\left(\tan^{2} x\right)`,
          pattern: "Logarithm of something heading to zero",
          tell: "The inside collapses to zero from above. A logarithm does not have a value at zero — it falls without bound.",
          steps: [
            {
              expr: m`x \to 0 \Rightarrow \tan x \to 0`,
              reason: "Tangent is continuous at 0 and passes through it.",
            },
            {
              expr: m`\tan^{2} x \to 0^{+}`,
              reason: "Squaring makes it positive whichever side x approaches from, so the inside arrives at zero from above.",
            },
            {
              expr: m`\lim_{t \to 0^{+}} \log_{10} t = -\infty`,
              reason: "A logarithm falls without bound as its input shrinks to zero.",
            },
          ],
          answer: m`-\infty`,
          check: "The squaring matters. Without it the inside would be negative on one side, where the logarithm has no value at all and the two-sided limit would simply not exist.",
        },
        {
          id: "lg-2",
          prompt: m`\text{Expand } \ln\frac{x^{2}\sqrt{x^{2} + 2}}{3x + 1}`,
          pattern: "Breaking one logarithm into several",
          tell: "A quotient of products inside a single log. Split on the division first, then on each multiplication, then bring every exponent down.",
          steps: [
            {
              expr: m`= \ln\left(x^{2}\sqrt{x^{2} + 2}\right) - \ln(3x + 1)`,
              reason: "Quotient law: the division becomes a subtraction.",
            },
            {
              expr: m`= \ln x^{2} + \ln\sqrt{x^{2} + 2} - \ln(3x + 1)`,
              reason: "Product law: the multiplication on top becomes an addition.",
            },
            {
              expr: m`= 2\ln x + \frac{1}{2}\ln\left(x^{2} + 2\right) - \ln(3x + 1)`,
              reason: "Power law twice: the square comes down as 2, the root as one half.",
            },
          ],
          answer: m`2\ln x + \frac{1}{2}\ln\left(x^{2} + 2\right) - \ln(3x + 1)`,
          check: m`Nothing may be done to the $3x + 1$. A sum inside a logarithm cannot be split — only a product or a quotient can.`,
        },
        {
          id: "lg-3",
          prompt: m`\text{Express } \ln a + \frac{1}{2}\ln b \text{ as a single logarithm}`,
          pattern: "Collapsing several logarithms into one",
          tell: "The laws run backwards just as well. Clear the coefficients first, then join.",
          steps: [
            {
              expr: m`\frac{1}{2}\ln b = \ln b^{1/2} = \ln\sqrt{b}`,
              reason: "Power law backwards: a coefficient goes up as an exponent.",
            },
            {
              expr: m`\ln a + \ln\sqrt{b} = \ln\left(a\sqrt{b}\right)`,
              reason: "Product law backwards: a sum of logs is the log of the product.",
            },
          ],
          answer: m`\ln\left(a\sqrt{b}\right)`,
          check: "Coefficients must be cleared before joining. Writing ln(a + √b) would be joining an addition, which no law permits.",
        },
        {
          id: "lg-4",
          prompt: m`\text{Differentiate } y = \ln\left(x^{3} + 1\right)`,
          pattern: "Logarithm with a chain",
          tell: "The inside is not just x, so it owes a derivative on top.",
          steps: [
            {
              expr: m`u = x^{3} + 1, \quad \frac{du}{dx} = 3x^{2}`,
              reason: "Name the inside and differentiate it.",
            },
            {
              expr: m`y' = \frac{1}{x^{3} + 1} \cdot 3x^{2}`,
              reason: "One over the inside, times the inside's derivative.",
            },
            {
              expr: m`y' = \frac{3x^{2}}{x^{3} + 1}`,
              reason: "Write it as a single fraction.",
            },
          ],
          answer: m`\frac{3x^{2}}{x^{3} + 1}`,
          check: "The derivative of a logarithm is always a fraction whose bottom is the original inside, untouched.",
        },
        {
          id: "lg-5",
          prompt: m`\text{Find } \frac{d}{dx}\ln\frac{x + 1}{\sqrt{x - 2}}`,
          pattern: "Expand first, then differentiate",
          tell: "Differentiating this as it stands means a chain rule over a quotient rule. Expanding with log laws first turns it into two easy terms.",
          steps: [
            {
              expr: m`\ln\frac{x + 1}{\sqrt{x - 2}} = \ln(x + 1) - \frac{1}{2}\ln(x - 2)`,
              reason: "Quotient law, then the root comes down as one half. The hard structure is gone before any calculus happens.",
            },
            {
              expr: m`\frac{d}{dx} = \frac{1}{x + 1} - \frac{1}{2} \cdot \frac{1}{x - 2}`,
              reason: "Differentiate term by term. Each inside has derivative 1, so nothing extra appears on top.",
            },
            {
              expr: m`= \frac{2(x - 2) - (x + 1)}{2(x + 1)(x - 2)}`,
              reason: "Optional: put the two fractions over a common denominator.",
            },
            {
              expr: m`= \frac{x - 5}{2(x + 1)(x - 2)}`,
              reason: "Tidy the numerator: 2x − 4 − x − 1.",
            },
          ],
          answer: m`\frac{1}{x + 1} - \frac{1}{2(x - 2)} = \frac{x - 5}{2(x + 1)(x - 2)}`,
          check: m`Expanding first is the whole technique. Attacking it directly needs the quotient rule inside a chain rule and takes four times as long for the same answer.`,
        },
        {
          id: "lg-6",
          prompt: m`\text{Obtain the derivative of } f(σ) = \log_{10}\left(2 + \sin σ\right)`,
          pattern: "A base other than e",
          tell: "Base 10 rather than e, so the formula carries a constant ln 10 downstairs. The inside still owes its own derivative.",
          steps: [
            {
              expr: m`\frac{d}{dσ}\log_{10} u = \frac{1}{u \ln 10}\frac{du}{dσ}`,
              reason: "The general base formula, with the chain rule attached.",
            },
            {
              expr: m`u = 2 + \sin σ, \quad \frac{du}{dσ} = \cos σ`,
              reason: "Differentiate the inside. The constant 2 contributes nothing.",
            },
            {
              expr: m`f'(σ) = \frac{\cos σ}{\left(2 + \sin σ\right)\ln 10}`,
              reason: "Assemble.",
            },
          ],
          answer: m`\frac{\cos σ}{\left(2 + \sin σ\right)\ln 10}`,
          check: m`$\ln 10$ is a constant, roughly 2.303. It never differentiates to anything and simply rides along downstairs.`,
        },
      ],
    },
    {
      kind: "checklist",
      id: "choosing",
      title: "Which move, and in what order",
      intro: "Before differentiating anything transcendental, spend ten seconds here. Two of these five steps routinely halve the work.",
      items: [
        {
          label: "Is it a logarithm of a product, quotient or power?",
          detail: "Expand it with the log laws first. Every expansion you do before differentiating is a quotient or chain rule you do not have to do after.",
        },
        {
          label: "Name the layers",
          detail: "Write down outer, middle and inner before touching anything. Three layers must produce three factors in the answer.",
        },
        {
          label: "Apply the outermost rule first",
          detail: "Product, quotient or chain — whichever describes the whole expression. Copy everything inside down unchanged and deal with it on the next line.",
        },
        {
          label: "Charge the chain rule for every inner function",
          detail: m`An angle of $5z$ owes a 5; an exponent of $x^{3}$ owes $3x^{2}$. Only a bare $x$ owes 1 and can be left silent.`,
        },
        {
          label: "Look for a common factor or an identity",
          detail: m`Trigonometric answers usually collapse through $\sec^{2} x = 1 + \tan^{2} x$ or $\sin^{2} x + \cos^{2} x = 1$, and exponential answers usually factor.`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`\frac{d}{dx}\left(2^{x}\right) = x \cdot 2^{x - 1}`,
          right: m`\frac{d}{dx}\left(2^{x}\right) = 2^{x}\ln 2`,
          why: m`The power rule is for a variable base with a constant exponent, like $x^{2}$. Here the base is constant and the variable is upstairs, which is the opposite situation and a different formula entirely.`,
        },
        {
          wrong: m`\frac{d}{dx}\left(\tan x\right) = \sec x \tan x`,
          right: m`\frac{d}{dx}\left(\tan x\right) = \sec^{2} x`,
          why: m`$\sec x \tan x$ is the derivative of $\sec x$, not of $\tan x$. The two sit next to each other in the table and get swapped constantly.`,
        },
        {
          wrong: m`\ln(a + b) = \ln a + \ln b`,
          right: m`\ln(ab) = \ln a + \ln b`,
          why: m`The law splits a product, never a sum. There is nothing at all that can be done to $\ln(3x + 1)$ — leaving it whole is the correct move.`,
        },
        {
          wrong: m`\frac{d}{dx}\sin\left(5x\right) = \cos\left(5x\right)`,
          right: m`\frac{d}{dx}\sin\left(5x\right) = 5\cos\left(5x\right)`,
          why: "The angle is not a bare x, so the chain rule charges for it. A constant inside is the easiest inner derivative to forget, because nothing visibly changes when you ignore it.",
        },
        {
          wrong: m`\lim_{θ \to 0}\frac{\sin θ}{θ} = 1 \text{ with } θ \text{ in degrees}`,
          right: m`\text{radians only}`,
          why: m`In degrees the limit is $\frac{\pi}{180}$, and every trigonometric derivative formula would need that factor bolted on. Radians are what make the table clean.`,
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "Differentiate unless told otherwise.",
      problems: [
        {
          prompt: m`y = x^{2}\sin x`,
          answer: m`2x\sin x + x^{2}\cos x`,
          hint: "Product rule. Neither factor needs a chain.",
        },
        {
          prompt: m`y = e^{3x}\cos x`,
          answer: m`e^{3x}\left(3\cos x - \sin x\right)`,
          hint: m`Product rule, and the exponent $3x$ owes a 3. Factor the exponential out at the end.`,
        },
        {
          prompt: m`y = \ln\left(5x^{2} + 1\right)`,
          answer: m`\frac{10x}{5x^{2} + 1}`,
          hint: "One over the inside, times the inside's derivative.",
        },
        {
          prompt: m`\lim_{x \to 0}\frac{\sin 5x}{x}`,
          answer: m`5`,
          hint: m`Make the bottom match the angle: $\frac{\sin 5x}{x} = 5 \cdot \frac{\sin 5x}{5x}$.`,
        },
        {
          prompt: m`y = \tan^{3} x`,
          answer: m`3\tan^{2} x \sec^{2} x`,
          hint: m`This is $\left(\tan x\right)^{3}$ — power rule outside, then the derivative of tangent.`,
        },
        {
          prompt: m`y = \log_{2}\left(x^{3}\right)`,
          answer: m`\frac{3}{x \ln 2}`,
          hint: m`Bring the 3 down first: $3\log_{2} x$. Much easier than chaining.`,
        },
        {
          prompt: m`\text{Expand } \ln\frac{x^{3}\sqrt{x + 1}}{x - 4}`,
          answer: m`3\ln x + \frac{1}{2}\ln(x + 1) - \ln(x - 4)`,
          hint: "Quotient first, then product, then bring the exponents down.",
        },
        {
          prompt: m`y = e^{\sin x}`,
          answer: m`e^{\sin x}\cos x`,
          hint: "The exponential is copied down; the exponent owes its own derivative.",
        },
      ],
    },
  ],
};
