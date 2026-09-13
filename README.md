# kathmaxxing

Study notes that show their working. The home page is a shelf of subjects; each one opens with the
rules, then the order to apply them in, then a worked solution for every kind of problem — the
pattern named first, the move second.

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

#### Notation

Formulas are written in a small LaTeX-flavoured notation (`src/lib/algebra/notation.ts`) and drawn
in plain HTML — no maths library ships to the browser. It covers `^`, `_`, `\frac`, `\sqrt[n]`,
`\left`/`\right`, `\text` and a handful of symbols, and prose can name an expression inline by
wrapping it in `$`.

Two details are worth knowing. Radicals are drawn from a glyph plus a border, positioned from Geist
Mono's own measured metrics so the overbar lands on the tip of the sign. And `\left(…\right)` is
only *drawn* when something inside it is taller than a line — otherwise it falls back to a typed
bracket, so drawn and typed brackets never sit side by side in the same expression.

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
  lib/algebra/
    types.ts             The shape of a lesson
    notation.ts          The formula notation: source text to a tree (pure, fully tested)
    lessons/*.ts         One file per topic, all content, no components
  app/actions.ts         Server Actions: saveConversion, loadHistory
  app/page.tsx           The subject shelf
  app/computer-science/  The converter workbench
  app/algebra/           The topic index and one prerendered page per lesson
  components/algebra/    Formula rendering and the lesson section renderers
  components/           Converter, steps, pattern table, history, theming, PWA registration
```

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
