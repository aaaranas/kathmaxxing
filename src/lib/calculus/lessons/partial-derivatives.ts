import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const partialDerivatives: Lesson = {
  slug: "partial-derivatives",
  title: "Functions of Several Variables",
  blurb: "Notation and domain for a surface, then differentiating in one direction at a time.",
  source: "EM-1101 Module 8 / Math 54 Chapters 10–11",
  summary:
    "A function of two variables takes a point in the plane and returns a height, so its graph is " +
    "a surface rather than a curve. A surface has no single slope at a point — it depends which " +
    "way you walk. A partial derivative answers that by freezing every variable but one, which " +
    "turns the whole topic back into ordinary differentiation with the other letters treated as " +
    "numbers.",
  sections: [
    {
      kind: "rules",
      id: "notation",
      title: "Functions of two variables",
      intro: "Everything from one-variable notation carries over; there is simply more than one input.",
      rules: [
        {
          name: "Notation",
          expr: m`z = f(x, y)`,
          note: m`$x$ and $y$ are the independent variables, $z$ the dependent one. An input is an ordered pair, and the output is a single number as always.`,
        },
        {
          name: "Domain",
          expr: m`\text{the set of pairs } (x, y) \text{ the rule accepts}`,
          note: "A region of the plane rather than an interval of the line. The same three questions apply: no even root of a negative, no zero denominator, no logarithm of anything but a positive.",
        },
        {
          name: "Range",
          expr: m`\text{the set of heights } z \text{ that come out}`,
          note: m`For $f(x, y) = x^{2} + y^{2}$ the domain is the whole plane and the range is $\left[0, \infty\right)$, because a sum of two squares is never negative.`,
        },
        {
          name: "Graph",
          expr: m`\text{a surface in three dimensions}`,
          note: m`The point $(x, y)$ lies in the horizontal plane and $z$ is the height above it. A function of three variables has no graph we can draw, but every formula below still works.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "definition",
      title: "The partial derivative",
      intro:
        "Two limits, one for each direction. In practice nobody computes them from the limit — the " +
        "sentence underneath is the working rule.",
      rules: [
        {
          name: "With respect to x",
          expr: m`f_{x}(x, y) = \lim_{h \to 0}\frac{f(x + h, y) - f(x, y)}{h}`,
          note: m`Only $x$ moves; $y$ is held still. Compare with the one-variable definition — it is the same quotient with a spectator along for the ride.`,
        },
        {
          name: "With respect to y",
          expr: m`f_{y}(x, y) = \lim_{h \to 0}\frac{f(x, y + h) - f(x, y)}{h}`,
          note: "Now y moves and x is held still.",
        },
        {
          name: "The working rule",
          expr: m`\text{treat the other variable as a constant}`,
          note: m`To find $f_{x}$, pretend $y$ is a number and differentiate normally. Every rule you already know — power, product, quotient, chain — applies unchanged.`,
        },
        {
          name: "Notation",
          expr: m`f_{x} = z_{x} = \frac{∂z}{∂x} = \frac{∂}{∂x}f(x, y)`,
          note: m`The curly $∂$ rather than $d$ is what signals that other variables were held fixed. Mixing the two symbols up is treated as an error.`,
        },
        {
          name: "Evaluating at a point",
          expr: m`f_{x}(a, b)`,
          note: "Differentiate first, substitute the point afterwards — the same discipline as every other derivative.",
        },
      ],
    },
    {
      kind: "examples",
      id: "computing",
      title: "Worked examples — computing partials",
      examples: [
        {
          id: "pd-1",
          prompt: m`\text{Find } f_{x} \text{ and } f_{y} \text{ for } f(x, y) = 5x^{2} - x^{2}y^{2} + 3xy^{3}`,
          pattern: "Polynomial in two variables",
          tell: "A sum of terms. Go term by term, deciding each time which letter is the variable and which is a number.",
          steps: [
            {
              expr: m`f_{x}: \text{ treat } y \text{ as a constant}`,
              reason: m`So $y^{2}$ and $y^{3}$ behave like plain coefficients.`,
            },
            {
              expr: m`f_{x}(x, y) = 10x - 2xy^{2} + 3y^{3}`,
              reason: m`The first term gives 10x. The second has coefficient $-y^{2}$, so $x^{2}$ becomes $2x$. In the third, $3y^{3}$ is a constant multiplying $x$, so only the constant survives.`,
            },
            {
              expr: m`f_{y}: \text{ treat } x \text{ as a constant}`,
              reason: m`Now $5x^{2}$ is a constant and differentiates to nothing at all.`,
            },
            {
              expr: m`f_{y}(x, y) = -2x^{2}y + 9xy^{2}`,
              reason: m`The second term has coefficient $-x^{2}$ and $y^{2}$ becomes $2y$; the third has coefficient $3x$ and $y^{3}$ becomes $3y^{2}$.`,
            },
          ],
          answer: m`f_{x} = 10x - 2xy^{2} + 3y^{3}, \quad f_{y} = -2x^{2}y + 9xy^{2}`,
          check: m`A term with no $y$ in it vanishes from $f_{y}$, and a term with no $x$ vanishes from $f_{x}$. Here every term had both except $5x^{2}$, which is exactly the one missing from $f_{y}$.`,
        },
        {
          id: "pd-2",
          prompt: m`\text{Find } f_{x} \text{ and } f_{y} \text{ for } f(x, y) = (\ln x)\left(\tan x^{2}y\right)`,
          pattern: "Product and chain, with a frozen variable",
          tell: "A product of two factors that both contain x, so f_x needs the product rule. Only one factor contains y, so f_y does not.",
          steps: [
            {
              expr: m`f_{x} = (\ln x)\left(\sec^{2} x^{2}y\right)(2xy) + \left(\tan x^{2}y\right)\left(\frac{1}{x}\right)`,
              reason: m`Product rule. The tangent's inside is $x^{2}y$, whose derivative with respect to $x$ is $2xy$ — the $y$ riding along as a constant.`,
            },
            {
              expr: m`f_{y}: \; \ln x \text{ is now a constant}`,
              reason: "It contains no y at all, so it stays out in front and no product rule is needed.",
            },
            {
              expr: m`f_{y} = (\ln x)\left(\sec^{2} x^{2}y\right)\left(x^{2}\right)`,
              reason: m`Differentiate the tangent and chain through its inside, which with respect to $y$ gives $x^{2}$.`,
            },
          ],
          answer: m`f_{x} = (\ln x)\left(\sec^{2} x^{2}y\right)(2xy) + \frac{\tan x^{2}y}{x}, \quad f_{y} = x^{2}(\ln x)\sec^{2} x^{2}y`,
          check: m`$f_{x}$ has two terms and $f_{y}$ has one. That asymmetry is the whole point: $x$ appears in both factors, $y$ in only one.`,
        },
        {
          id: "pd-3",
          prompt: m`\text{For } f(x, y) = xe^{x^{2}y} \text{ find } f_{x} \text{ and } f_{y}, \text{ then evaluate at } (1, \ln 2)`,
          pattern: "Product with an exponential",
          tell: "x appears both as a lone factor and inside the exponent, so f_x needs the product rule. For f_y the leading x is just a constant.",
          steps: [
            {
              expr: m`f_{x} = x \cdot e^{x^{2}y}(2xy) + e^{x^{2}y}`,
              reason: "Product rule: first times derivative of second, plus derivative of first times second.",
            },
            {
              expr: m`f_{x}(1, \ln 2) = e^{\ln 2}(2\ln 2) + e^{\ln 2}`,
              reason: m`Substitute. With $x = 1$ the exponent is just $y = \ln 2$.`,
            },
            {
              expr: m`= 2(2\ln 2) + 2 = 4\ln 2 + 2`,
              reason: m`$e^{\ln 2} = 2$, because the exponential and the natural logarithm undo each other.`,
            },
            {
              expr: m`f_{y} = x \cdot e^{x^{2}y}\left(x^{2}\right) = x^{3}e^{x^{2}y}`,
              reason: m`No product rule here: $x$ is a constant, so only the exponential is differentiated, chaining through $x^{2}$.`,
            },
            {
              expr: m`f_{y}(1, \ln 2) = 1 \cdot e^{\ln 2} = 2`,
              reason: "Substitute.",
            },
          ],
          answer: m`f_{x}(1, \ln 2) = 4\ln 2 + 2, \quad f_{y}(1, \ln 2) = 2`,
          check: m`$4\ln 2 + 2 \approx 4.77$. Leaving the answer exact is preferred; the decimal is only a sanity check.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "geometry",
      title: "What a partial derivative means",
      intro:
        "On a curve there is one slope at a point. On a surface there are infinitely many, one per " +
        "direction of travel — and a partial derivative picks out two of them.",
      rules: [
        {
          name: "Slope in the x-direction",
          expr: m`f_{x}(a, b) = \text{slope of the surface along } x`,
          note: m`Slice the surface with the vertical plane $y = b$. The slice is an ordinary curve, and $f_{x}(a, b)$ is its slope — the steepness you feel walking due east.`,
        },
        {
          name: "Slope in the y-direction",
          expr: m`f_{y}(a, b) = \text{slope of the surface along } y`,
          note: m`The same idea with the plane $x = a$. Walking due north instead.`,
        },
        {
          name: "Signs read as terrain",
          expr: m`f_{x} > 0 \text{ uphill}, \quad f_{x} < 0 \text{ downhill}`,
          note: "Both partials zero marks a level spot — the two-variable analogue of a critical number, and where peaks, pits and saddles live.",
        },
        {
          name: "Implicit partial differentiation",
          expr: m`F(x, y, z) = 0 \Rightarrow \text{solve for } \frac{∂z}{∂x}`,
          note: m`When $z$ cannot be isolated, differentiate the whole equation with respect to $x$ treating $y$ as constant and $z$ as a function of $x$, then solve. Exactly implicit differentiation, with one more spectator.`,
        },
      ],
    },
    {
      kind: "examples",
      id: "geometry-work",
      title: "Worked examples — slopes and implicit partials",
      examples: [
        {
          id: "pg-1",
          prompt: m`\text{Find the slopes in the } x \text{ and } y \text{ directions of } f(x, y) = \frac{x^{2}}{y^{3}} \text{ at } (4, 2, 2)`,
          pattern: "Evaluating both partials",
          tell: "Rewrite the quotient as a product with a negative power and no quotient rule is needed at all.",
          steps: [
            {
              expr: m`f(x, y) = x^{2}y^{-3}`,
              reason: "Negative powers are easier to differentiate than fractions.",
            },
            {
              expr: m`f_{x} = \frac{2x}{y^{3}}`,
              reason: m`$y^{-3}$ is a constant here, so only $x^{2}$ differentiates.`,
            },
            {
              expr: m`f_{y} = -\frac{3x^{2}}{y^{4}}`,
              reason: m`Now $x^{2}$ is the constant, and $y^{-3}$ becomes $-3y^{-4}$.`,
            },
            {
              expr: m`f_{x}(4, 2) = \frac{8}{8} = 1`,
              reason: "Substitute the point. Note only the first two coordinates are used.",
            },
            {
              expr: m`f_{y}(4, 2) = -\frac{3(16)}{16} = -3`,
              reason: "And again for the other direction.",
            },
          ],
          answer: m`\text{slope along } x = 1, \quad \text{slope along } y = -3`,
          check: m`The third coordinate 2 is the height, and it should satisfy the rule: $\frac{16}{8} = 2$. It does, so the point really is on the surface. Walking east the ground rises; walking north it falls three times as fast.`,
        },
        {
          id: "pg-2",
          prompt: m`\text{Find } \frac{∂z}{∂x} \text{ if } x^{3} + y^{3} + z^{3} + 3xyz = 0`,
          pattern: "Implicit, with two spectators",
          tell: "z cannot be isolated. Differentiate everything with respect to x, holding y fixed and remembering that z depends on x.",
          steps: [
            {
              expr: m`3x^{2} + 0 + 3z^{2}\frac{∂z}{∂x} + 3yz + 3xy\frac{∂z}{∂x} = 0`,
              reason: m`The $y^{3}$ term is a constant and gives 0. The $z^{3}$ owes a chain rule. The $3xyz$ term is a product of $x$ and $z$ with $3y$ in front, so it needs the product rule.`,
            },
            {
              expr: m`x^{2} + z^{2}\frac{∂z}{∂x} + yz + xy\frac{∂z}{∂x} = 0`,
              reason: "Divide through by 3 to clear the clutter.",
            },
            {
              expr: m`\left(z^{2} + xy\right)\frac{∂z}{∂x} = -x^{2} - yz`,
              reason: "Gather the derivative terms on the left and factor.",
            },
            {
              expr: m`\frac{∂z}{∂x} = -\frac{x^{2} + yz}{z^{2} + xy}`,
              reason: "Divide.",
            },
          ],
          answer: m`\frac{∂z}{∂x} = -\frac{x^{2} + yz}{z^{2} + xy}`,
          check: m`The equation is symmetric in all three letters, so $\frac{∂z}{∂y}$ must be the same expression with $x$ and $y$ swapped: $-\frac{y^{2} + xz}{z^{2} + xy}$. Symmetry is a free check whenever it is present.`,
        },
      ],
    },
    {
      kind: "rules",
      id: "higher",
      title: "Second partial derivatives",
      intro: "Differentiate a partial again and there are four combinations rather than one.",
      rules: [
        {
          name: "Pure second partials",
          expr: m`f_{xx} = \frac{∂^{2}f}{∂x^{2}}, \quad f_{yy} = \frac{∂^{2}f}{∂y^{2}}`,
          note: "Twice in the same direction. These measure concavity along each slice.",
        },
        {
          name: "Mixed partials",
          expr: m`f_{xy} = \frac{∂^{2}f}{∂y\,∂x}, \quad f_{yx} = \frac{∂^{2}f}{∂x\,∂y}`,
          note: m`Once each way. Read the subscript order left to right — $f_{xy}$ means with respect to $x$ first, then $y$.`,
        },
        {
          name: "Clairaut's theorem",
          expr: m`f_{xy} = f_{yx}`,
          note: "Whenever both mixed partials are continuous, which covers everything in this course. So the order does not matter — and computing both is a free check on your algebra.",
        },
      ],
    },
    {
      kind: "examples",
      id: "higher-work",
      title: "Worked example — second partials",
      examples: [
        {
          id: "ph-1",
          prompt: m`\text{Find all four second partials of } f(x, y) = 2x^{2}y - 3y + 3x^{2}y^{2}, \text{ then } f_{xy}(1, 2)`,
          pattern: "All four, then evaluate",
          tell: "Find both first partials, then differentiate each of them both ways. Clairaut's theorem means two of the four must agree.",
          steps: [
            {
              expr: m`f_{x} = 4xy + 6xy^{2}`,
              reason: m`Holding $y$ fixed. The $-3y$ term has no $x$ and disappears.`,
            },
            {
              expr: m`f_{y} = 2x^{2} - 3 + 6x^{2}y`,
              reason: m`Holding $x$ fixed. Every term survives this time.`,
            },
            {
              expr: m`f_{xx} = 4y + 6y^{2}`,
              reason: m`Differentiate $f_{x}$ with respect to $x$ again. Both terms were linear in $x$, so both leave their coefficients behind.`,
            },
            {
              expr: m`f_{xy} = 4x + 12xy`,
              reason: m`Differentiate $f_{x}$ with respect to $y$.`,
            },
            {
              expr: m`f_{yx} = 4x + 12xy`,
              reason: m`Differentiate $f_{y}$ with respect to $x$. It matches $f_{xy}$, as Clairaut's theorem promises.`,
            },
            {
              expr: m`f_{yy} = 6x^{2}`,
              reason: m`Differentiate $f_{y}$ with respect to $y$; only the last term contains one.`,
            },
            {
              expr: m`f_{xy}(1, 2) = 4(1) + 12(1)(2) = 28`,
              reason: "Substitute the point into the mixed partial.",
            },
          ],
          answer: m`f_{xx} = 4y + 6y^{2}, \; f_{xy} = f_{yx} = 4x + 12xy, \; f_{yy} = 6x^{2}, \; f_{xy}(1, 2) = 28`,
          check: m`The two mixed partials agreeing is the check. Note the Math 54 module prints $f_{xx} = 4y - 6y^{2}$ here, but $f_{x} = 4xy + 6xy^{2}$ differentiates to $4y + 6y^{2}$ — the plus sign is correct, and the module has a typo at that line.`,
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`\frac{dz}{dx} \text{ for a function of two variables}`,
          right: m`\frac{∂z}{∂x}`,
          why: m`The straight $d$ claims the function has one input. The curly $∂$ is what records that other variables were held fixed, and the distinction is marked.`,
        },
        {
          wrong: m`f_{x} \text{ for } f = 5x^{2} + y^{3} \text{ is } 10x + 3y^{2}`,
          right: m`f_{x} = 10x`,
          why: m`Holding $y$ constant makes $y^{3}$ a constant, and constants differentiate to zero. Differentiating both letters at once is the most common error in the topic.`,
        },
        {
          wrong: m`f_{xy} \text{ means differentiate by } y \text{ first}`,
          right: m`f_{xy} \text{ means } x \text{ first, then } y`,
          why: m`Subscripts read left to right in the order the differentiations happen. The fraction notation runs the other way — $\frac{∂^{2}f}{∂y\,∂x}$ is the same thing — which is why the two look contradictory.`,
        },
        {
          wrong: m`\text{substitute } (a, b) \text{ and then differentiate}`,
          right: m`\text{differentiate, then substitute}`,
          why: "Substituting first leaves a number, whose derivative is zero. The same discipline as every other derivative in the course.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      problems: [
        {
          prompt: m`f(x, y) = x^{3}y^{2} + 2y, \quad f_{x} \text{ and } f_{y}`,
          answer: m`f_{x} = 3x^{2}y^{2}, \quad f_{y} = 2x^{3}y + 2`,
          hint: m`For $f_{x}$ the $2y$ term is a constant and drops out.`,
        },
        {
          prompt: m`f(x, y) = \sin(xy), \quad f_{x} \text{ and } f_{y}`,
          answer: m`f_{x} = y\cos(xy), \quad f_{y} = x\cos(xy)`,
          hint: "Chain rule both times; the inside differentiates to the other letter.",
        },
        {
          prompt: m`f(x, y) = e^{2x}\ln y, \quad f_{x} \text{ and } f_{y}`,
          answer: m`f_{x} = 2e^{2x}\ln y, \quad f_{y} = \frac{e^{2x}}{y}`,
          hint: "Neither needs a product rule — each factor contains only one of the two letters.",
        },
        {
          prompt: m`f(x, y) = x^{2} + y^{2}, \quad \text{domain and range}`,
          answer: m`\text{domain the whole plane, range } \left[0, \infty\right)`,
          hint: "A sum of two squares accepts anything and is never negative.",
        },
        {
          prompt: m`f(x, y) = x^{2}y^{3}, \quad \text{all four second partials}`,
          answer: m`f_{xx} = 2y^{3}, \; f_{xy} = f_{yx} = 6xy^{2}, \; f_{yy} = 6x^{2}y`,
          hint: m`$f_{x} = 2xy^{3}$ and $f_{y} = 3x^{2}y^{2}$. The two mixed partials must agree.`,
        },
        {
          prompt: m`\text{Find } \frac{∂z}{∂x} \text{ if } x^{2} + y^{2} + z^{2} = 9`,
          answer: m`-\frac{x}{z}`,
          hint: m`$2x + 2z\frac{∂z}{∂x} = 0$, since $y$ is held constant and gives 0.`,
        },
      ],
    },
  ],
};
