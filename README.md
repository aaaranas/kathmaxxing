# kathmaxxing

Study notes that show their working. The home page is a shelf of subjects — computer science,
algebra and calculus — and each one opens with the rules, then the order to apply them in, then a
worked solution for every kind of problem: the pattern named first, the move second.

Built as an installable PWA with Next.js, Tailwind CSS, shadcn/ui and Neon Postgres.

## Subjects

### Computer Science — number bases

- **Converter** — one input, four live readouts. Switching the input base carries the *number*
  across rather than re-reading the same digits, so flipping from binary to hex re-expresses one
  value instead of quietly meaning something else. All arithmetic runs through `BigInt`, so values
  far beyond `Number.MAX_SAFE_INTEGER` stay exact.
- **Worked steps** — a collapsed accordion per step: positional expansion into decimal, repeated
  division into each target base, and the bit-grouping shortcut that skips the arithmetic entirely.
- **Pattern table** — the numbers 1 to 15 laid out as place-value columns. Each column's tint
  tracks its weight, so the eights column reads heaviest and the ones lightest, and the doubling
  that drives binary counting is visible down the columns.
- **History** — every value you settle on is written to Neon Postgres via a Server Action and read
  back on demand.

### Algebra — exponents, radicals, factoring

Four lessons, in teaching order: **Integer Exponents**, **Rational Exponents**, **Radicals** and
**Factoring**. Each is built from the same five kinds of section — the rules, the order to try them
in, worked examples, the true-or-false traps, and practice with hidden answers.

Every worked example follows the shape the class solutions use: name the pattern, say how you spot
it, then one line of algebra per move with the move named beside it, then the answer, then how to
check it by expanding back out.

Lessons are plain data (`src/lib/algebra/lessons/`), so a new topic is a content file rather than a
component. A test suite proof-reads them — unknown notation commands, unclosed inline expressions,
duplicate ids and empty sections all fail the build rather than reaching the page.

#### Scientific calculator

`/algebra/calculator` is a keypad calculator for checking working. Two things make it worth having
over the one on a phone.

It is **exact wherever the arithmetic allows**. All of it runs on BigInt rationals, so `0.1 + 0.2`
is `3/10`, `(2⁻¹ + 3⁻¹)⁻¹` is `6/5`, and `(121/36)^(-3/2)` is `216/1331` — the answers the lessons
give, not floating-point readings of them. A fractional exponent takes the root first and stays
exact when the root comes out whole, so `(-27/8)^(1/3)` is `-3/2` rather than a `NaN`. Floating
point is the fallback for roots that do not come out, logs and trigonometry, and the answer says
which of the two you are looking at.

It also **says how it read the expression before it answers**. Typing `-4^2` draws `−4²` and
answers `−16`; `(-4)^2` draws `(−4)²` and answers `16`. Division is drawn as a stacked fraction for
the same reason. Precedence is the thing that catches people out — it is a true-or-false trap in
two of the lessons — so the reading is on the page rather than implied.

Everything else is what you would expect: powers and roots to any index, logs to any base,
trigonometry with a DEG/RAD switch, factorials, absolute value, implied multiplication (`2(3+4)`),
and a session history you can tap to bring an expression back. Nothing is sent anywhere.

#### Notation

Formulas are written in a small LaTeX-flavoured notation (`src/lib/algebra/notation.ts`) and drawn
in plain HTML — no maths library ships to the browser. It covers `^`, `_`, `\frac`, `\sqrt[n]`,
`\left`/`\right`, `\text` and a handful of symbols, and prose can name an expression inline by
wrapping it in `$`.

Two details are worth knowing. Radicals are drawn from a glyph plus a border, positioned from Geist
Mono's own measured metrics so the overbar lands on the tip of the sign. And `\left(…\right)` is
only *drawn* when something inside it is taller than a line — otherwise it falls back to a typed
bracket, so drawn and typed brackets never sit side by side in the same expression.

### Calculus — lines, functions, graphs

Three topics laid out the same way as the algebra ones: **Lines** (slope, the three forms, parallel
and perpendicular), **Functions** (notation, domain and range, composition, and the difference
quotient that a derivative is built from), and **Graphs** (intercepts, symmetry, the six parent
shapes, and transformations).

#### Graphing calculator

`/calculus/graphing-calculator` plots up to four functions of x on one set of axes. Because black is
the only ink in this app, curves are told apart by the *kind of line* — solid, dashed, dotted,
dash-dot — rather than by colour, which also means they survive a projector, a photocopy, and colour
blindness.

Drag to pan, scroll to zoom, and hover anywhere to read every curve's value at that x. The view is
held as a centre and a scale rather than as four edges, so one unit is the same length across and
down: a slope of 1 looks like 45°, which matters when the lesson next door is about slope.

The sampler breaks a curve wherever it stops being real or runs off to infinity, so `1/x` is drawn
as two branches rather than joined across the asymptote by a vertical line that is not part of the
graph. `sqrt(x)` simply stops at the origin, and `tan(x)` breaks at each asymptote.

## Design notes

Black is the only ink in the app. Every theme is a choice of *paper stock* rather than a colour
scheme, and hierarchy is carried by size, weight and tinted plates behind the type — never by
lightening the text. Each stock is chosen so `#000` clears roughly 6.5:1 contrast, which is why the
dark theme is a graphite mid-tone rather than the usual near-black: black text has to stay readable
on it.

Six stocks ship: Light, Graphite (dark), Stone (neutral), and Lilac, Blossom and Mint (pastels).

## Getting started

```bash
npm install
npm run dev
```

The app runs fully without a database. The algebra lessons are static, and the converter, steps and
pattern table are pure client-side arithmetic; only the History tab needs Neon, and it shows setup
instructions until one is connected.

### Connecting Neon

1. Create a project at [neon.tech](https://neon.tech) and copy the **pooled** connection string
   (its host contains `-pooler`).
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL`.
3. Create the table:

   ```bash
   npm run db:push
   ```

`prisma/migrations/0000_init/migration.sql` holds the same schema as plain SQL if you would rather
run migrations than push.

## Scripts

| Script             | Does                                              |
| ------------------ | ------------------------------------------------- |
| `npm run dev`      | Development server                                |
| `npm run build`    | Production build                                  |
| `npm start`        | Serve the production build                        |
| `npm test`         | Unit tests for the conversion, steps and notation engines, and the lesson proof-reader |
| `npm run lint`     | ESLint                                            |
| `npm run db:push`  | Push the Prisma schema to the database            |
| `npm run db:studio`| Browse the data in Prisma Studio                  |

## Architecture

```
src/
  lib/subjects.ts        The shelf: one entry per subject, with its route and contents
  lib/bases.ts           Conversion engine - parsing, validation, BigInt maths (pure, fully tested)
  lib/steps.ts           Turns a conversion into the worked example (pure, fully tested)
  lib/db.ts              Prisma client over the Neon adapter, plus the "is it configured" check
  lib/history.ts         Types shared between the server actions and the client
  lib/lessons/types.ts   The shape of a lesson, shared by every subject
  lib/math/              The expression engine, shared by both calculators (pure, fully tested)
    notation.ts            Display notation: source text to a tree
    rational.ts            Exact rational arithmetic over BigInt
    parse.ts               The expression grammar
    evaluate.ts            Evaluation against an angle mode and a variable scope
    render.ts              An expression back into display notation
    calculate.ts           The scientific calculator's entry point
    plot.ts                Views, gridlines and curve sampling for the grapher
  lib/algebra/           Lesson content: exponents, radicals, factoring
  lib/calculus/          Lesson content: lines, functions, graphs
  app/actions.ts         Server Actions: saveConversion, loadHistory
  app/page.tsx           The subject shelf
  app/computer-science/  The converter workbench
  app/algebra/           Topic index, a prerendered page per lesson, scientific calculator
  app/calculus/          Topic index, a prerendered page per lesson, graphing calculator
  components/math.tsx    Formula rendering
  components/lesson/     The lesson section renderers
  components/calculator/ The scientific and graphing calculators
  components/            Converter, steps, pattern table, history, theming, PWA registration
```

Lessons and the expression engine are deliberately subject-agnostic: a new subject is a folder of
content files plus two routes, not a fork of the renderer.

Every algebra page is prerendered at build time and precached by the service worker, so the whole
shelf works offline once installed.

Only the input value and its base are persisted. The other three bases are recomputed when the
history loads, so a stored row can never disagree with the converter.

Writes fire once a value has held still for 900ms rather than on every keystroke, and a repeat of
the value already at the top of the list is collapsed — the table reads as a list of decisions
rather than a keylog.

## Requirements

Node.js 22 or newer. The Neon serverless driver uses the global `WebSocket`, which Node exposes
from 22 onward.

## Notes

`npm audit` reports advisories inside the Prisma **CLI** (a `deepmerge-ts` stack exhaustion and two
`mysql2` advisories for a MySQL driver this Postgres project never invokes). These are
`devDependencies` and never ship. `npm audit fix --force` resolves them by installing a Prisma
8.0.0 release candidate, which is a downgrade in stability, so the CLI is pinned to v7 to match
`@prisma/client`.

---

Developed by Andre Milan Arañas. For Kathleen Torrejano.
