import type { Lesson } from "@/lib/lessons/types";

const m = String.raw;

export const relatedRates: Lesson = {
  slug: "related-rates",
  title: "Rates of Change",
  blurb: "Reading a derivative as a rate, and linking two changing quantities through one equation.",
  source: "EM-1101 Module 6 — Applications of the Derivative",
  summary:
    "A derivative is a rate of change, and that one sentence is the whole of this topic. If two " +
    "quantities are tied together by an equation, then differentiating that equation with respect " +
    "to time ties their rates together too. The algebra is implicit differentiation; the difficulty " +
    "is almost always in setting the problem up rather than in doing the calculus.",
  sections: [
    {
      kind: "rules",
      id: "rates",
      title: "A derivative is a rate",
      intro: "The same derivative answers three different-sounding questions, depending on what the variables mean.",
      rules: [
        {
          name: "Average rate of change",
          expr: m`\frac{\Delta y}{\Delta x} = \frac{f(b) - f(a)}{b - a}`,
          note: "Over an interval. This is the slope of the straight line joining the two endpoints, called the secant line.",
        },
        {
          name: "Instantaneous rate of change",
          expr: m`\frac{dy}{dx} = \lim_{\Delta x \to 0}\frac{\Delta y}{\Delta x}`,
          note: "At a single point. The secant becomes the tangent, and the average becomes the instantaneous.",
        },
        {
          name: "With respect to time",
          expr: m`\frac{dV}{dt}, \quad \frac{dr}{dt}, \quad \frac{dθ}{dt}`,
          note: "Read the notation aloud and the units come out with it: dV/dt is cubic units per unit time. Checking units is the quickest way to catch a wrong answer.",
        },
        {
          name: "Sign says direction",
          expr: m`\frac{dh}{dt} > 0 \text{ rising}, \quad \frac{dh}{dt} < 0 \text{ falling}`,
          note: "A quantity that is shrinking has a negative rate. Putting a draining tank's rate in as positive is the commonest setup error there is.",
        },
      ],
    },
    {
      kind: "checklist",
      id: "method",
      title: "Solving a related-rates problem",
      intro:
        "Six steps, and the order is not negotiable. Step five is where most marks are lost, " +
        "because doing it early looks harmless and quietly destroys the problem.",
      items: [
        {
          label: "Draw it and label every length",
          detail: "Give each changing quantity a letter. A number on the diagram is for a fixed length only — anything that moves must be a variable, or you cannot differentiate it.",
        },
        {
          label: "Write down what you have and what you want",
          detail: m`As derivatives. "Rising at 5 cm/s" is $\frac{dh}{dt} = 5$; "how fast is the area growing" is $\frac{dA}{dt} = \,?$`,
        },
        {
          label: "Find one equation relating the variables",
          detail: "Usually geometry: Pythagoras, a volume or area formula, similar triangles, or a trigonometric ratio. This is the step the problem is really testing.",
        },
        {
          label: "Eliminate any variable you have no rate for",
          detail: m`A cone with $r$ and $h$ both changing needs $r$ written in terms of $h$ from similar triangles, or the equation will have two unknown rates and cannot be solved.`,
        },
        {
          label: "Differentiate with respect to t — before substituting anything",
          detail: "Every variable owes a chain rule. Substituting the instant's numbers first turns the equation into constants, whose derivative is zero and tells you nothing.",
        },
        {
          label: "Now substitute, solve, and state the units",
          detail: "Put the instant's values in, solve for the one unknown rate, and say what it means in a sentence with units attached.",
        },
      ],
    },
    {
      kind: "examples",
      id: "examples",
      title: "Worked examples",
      examples: [
        {
          id: "rr-1",
          prompt: m`\text{A 10 ft ladder leans on a wall. Its foot slides out at 1 ft/s. How fast is the top falling when the foot is 6 ft out?}`,
          pattern: "Pythagoras",
          tell: "A right triangle whose hypotenuse is fixed and whose legs both change. The fixed length is the giveaway that Pythagoras is the relating equation.",
          steps: [
            {
              expr: m`x^{2} + y^{2} = 100`,
              reason: "x is the distance from wall to foot, y the height of the top. The ladder's length never changes, so the 10 stays a number.",
            },
            {
              expr: m`\frac{dx}{dt} = 1, \quad \frac{dy}{dt} = \,?`,
              reason: "Record the known and the wanted rate before differentiating.",
            },
            {
              expr: m`2x\frac{dx}{dt} + 2y\frac{dy}{dt} = 0`,
              reason: "Differentiate with respect to t. The constant 100 gives 0.",
            },
            {
              expr: m`x = 6 \Rightarrow y = \sqrt{100 - 36} = 8`,
              reason: "Only now find the instant's missing length, from the original equation.",
            },
            {
              expr: m`2(6)(1) + 2(8)\frac{dy}{dt} = 0`,
              reason: "Substitute everything known.",
            },
            {
              expr: m`\frac{dy}{dt} = -\frac{12}{16} = -\frac{3}{4}`,
              reason: "Solve. The sign is negative because the top is falling.",
            },
          ],
          answer: m`\frac{dy}{dt} = -\frac{3}{4} \text{ ft/s}`,
          check: "The top descends at three quarters of a foot per second. The negative sign is not optional — it is what says the height is decreasing, and an answer of +3/4 would describe a ladder climbing the wall by itself.",
        },
        {
          id: "rr-2",
          prompt: m`\text{A circle's radius grows at 2 cm/s. How fast is its area growing when } r = 5 \text{ cm?}`,
          pattern: "One formula, one chain rule",
          tell: "Only two quantities, already linked by a formula you know. The shortest kind of related-rates problem.",
          steps: [
            {
              expr: m`A = \pi r^{2}`,
              reason: "The relating equation is just the area formula.",
            },
            {
              expr: m`\frac{dA}{dt} = 2\pi r \frac{dr}{dt}`,
              reason: "Differentiate with respect to t. The r² owes a chain rule, which is where dr/dt comes from.",
            },
            {
              expr: m`\frac{dA}{dt} = 2\pi(5)(2) = 20\pi`,
              reason: "Substitute r = 5 and dr/dt = 2.",
            },
          ],
          answer: m`20\pi \approx 62.8 \text{ cm}^{2}\text{/s}`,
          check: m`Units confirm it: $\text{cm} \times \frac{\text{cm}}{\text{s}}$ gives $\frac{\text{cm}^{2}}{\text{s}}$, which is an area rate. Note the answer depends on r — the same radial growth swells a big circle's area faster than a small one's.`,
        },
        {
          id: "rr-3",
          prompt: m`\text{Water enters a cone (vertex down, top radius 5 ft, height 10 ft) at 9 ft}^{3}\text{/min. How fast is the level rising at } h = 6 \text{ ft?}`,
          pattern: "Eliminate a variable with similar triangles",
          tell: "The volume formula has both r and h in it, but only one rate is given. The cone's fixed shape lets r be written in terms of h, and that step is the real problem.",
          steps: [
            {
              expr: m`V = \frac{1}{3}\pi r^{2} h`,
              reason: "Volume of a cone. Two variables, and no rate is given for r.",
            },
            {
              expr: m`\frac{r}{h} = \frac{5}{10} = \frac{1}{2} \Rightarrow r = \frac{h}{2}`,
              reason: "The water cone is similar to the tank, so its radius and height keep a fixed ratio.",
            },
            {
              expr: m`V = \frac{1}{3}\pi\left(\frac{h}{2}\right)^{2}h = \frac{\pi h^{3}}{12}`,
              reason: "Substitute to get volume in terms of h alone. Now there is one variable and one rate.",
            },
            {
              expr: m`\frac{dV}{dt} = \frac{\pi h^{2}}{4}\frac{dh}{dt}`,
              reason: "Differentiate with respect to t.",
            },
            {
              expr: m`9 = \frac{\pi(36)}{4}\frac{dh}{dt} = 9\pi\frac{dh}{dt}`,
              reason: "Substitute the inflow rate and h = 6.",
            },
            {
              expr: m`\frac{dh}{dt} = \frac{1}{\pi}`,
              reason: "Solve.",
            },
          ],
          answer: m`\frac{1}{\pi} \approx 0.32 \text{ ft/min}`,
          check: m`Differentiating before eliminating $r$ would leave both $\frac{dr}{dt}$ and $\frac{dh}{dt}$ in one equation — two unknowns, no solution. The similar-triangles step has to come first.`,
        },
        {
          id: "rr-4",
          prompt: m`\text{A balloon rises at 5 m/s from a point 30 m from an observer. How fast is the angle of elevation growing when the balloon is 40 m up?}`,
          pattern: "A trigonometric ratio",
          tell: "An angle is changing, so the relating equation must be trigonometric. The fixed 30 m is the side to divide by.",
          steps: [
            {
              expr: m`\tan θ = \frac{h}{30}`,
              reason: "Opposite over adjacent, with the adjacent side fixed at 30.",
            },
            {
              expr: m`\sec^{2} θ \frac{dθ}{dt} = \frac{1}{30}\frac{dh}{dt}`,
              reason: "Differentiate with respect to t. Both sides owe a chain rule.",
            },
            {
              expr: m`h = 40 \Rightarrow \text{hypotenuse} = 50, \quad \sec θ = \frac{50}{30} = \frac{5}{3}`,
              reason: "The 30-40-50 triangle gives the secant without ever finding the angle itself.",
            },
            {
              expr: m`\frac{25}{9}\frac{dθ}{dt} = \frac{1}{30}(5) = \frac{1}{6}`,
              reason: "Substitute sec²θ = 25/9 and dh/dt = 5.",
            },
            {
              expr: m`\frac{dθ}{dt} = \frac{9}{25} \cdot \frac{1}{6} = \frac{3}{50}`,
              reason: "Solve.",
            },
          ],
          answer: m`\frac{3}{50} = 0.06 \text{ rad/s}`,
          check: "Radians per second, because every trigonometric derivative formula assumes radians. Converting to degrees per second would mean multiplying by 180/π at the very end, never during the calculus.",
        },
      ],
    },
    {
      kind: "traps",
      id: "traps",
      title: "Where this goes wrong",
      traps: [
        {
          wrong: m`\text{substitute } h = 6 \text{, then differentiate}`,
          right: m`\text{differentiate, then substitute } h = 6`,
          why: "Substituting first replaces a variable with a constant, and constants have derivative zero. The equation collapses and the rate you wanted disappears with it.",
        },
        {
          wrong: m`\frac{dV}{dt} = 9 \text{ for a tank that is draining}`,
          right: m`\frac{dV}{dt} = -9`,
          why: "A quantity getting smaller has a negative rate. Nothing in the algebra will warn you — the answer simply comes out with the wrong sign and describes the opposite physical situation.",
        },
        {
          wrong: m`V = \frac{1}{3}\pi r^{2} h \text{ with both } r \text{ and } h \text{ left in}`,
          right: m`\text{write } r \text{ in terms of } h \text{ first}`,
          why: "Two variables with only one known rate gives one equation in two unknowns. The similar-triangles relation is not optional tidying; without it the problem has no solution.",
        },
        {
          wrong: m`\frac{d}{dt}\left(r^{2}\right) = 2r`,
          right: m`\frac{d}{dt}\left(r^{2}\right) = 2r\frac{dr}{dt}`,
          why: "Everything here is a function of time, so every differentiation is a chain rule. This is implicit differentiation with t in the role x usually plays.",
        },
      ],
    },
    {
      kind: "practice",
      id: "practice",
      title: "Practice",
      intro: "State units with every answer.",
      problems: [
        {
          prompt: m`\text{A square's side grows at 3 cm/s. Find } \frac{dA}{dt} \text{ when } s = 10 \text{ cm}`,
          answer: m`60 \text{ cm}^{2}\text{/s}`,
          hint: m`$A = s^{2}$, so $\frac{dA}{dt} = 2s\frac{ds}{dt}$.`,
        },
        {
          prompt: m`\text{A sphere's radius grows at 1 cm/s. Find } \frac{dV}{dt} \text{ when } r = 4 \text{ cm}`,
          answer: m`64\pi \text{ cm}^{3}\text{/s}`,
          hint: m`$V = \frac{4}{3}\pi r^{3}$, so $\frac{dV}{dt} = 4\pi r^{2}\frac{dr}{dt}$.`,
        },
        {
          prompt: m`\text{A 13 ft ladder's foot slides out at 2 ft/s. How fast is the top falling when the foot is 5 ft out?}`,
          answer: m`-\frac{5}{6} \text{ ft/s}`,
          hint: m`$y = 12$ at that instant. Then $2(5)(2) + 2(12)\frac{dy}{dt} = 0$.`,
        },
        {
          prompt: m`\text{Two cars leave one point, north at 60 km/h and east at 80 km/h. How fast do they separate?}`,
          answer: m`100 \text{ km/h}`,
          hint: m`$z^{2} = x^{2} + y^{2}$. The rate turns out to be constant, which is why no instant needs to be given.`,
        },
        {
          prompt: m`\text{A cube's edge grows at 2 mm/s. Find the rate of change of its surface area at } s = 5 \text{ mm}`,
          answer: m`120 \text{ mm}^{2}\text{/s}`,
          hint: m`$A = 6s^{2}$, so $\frac{dA}{dt} = 12s\frac{ds}{dt}$.`,
        },
      ],
    },
  ],
};
