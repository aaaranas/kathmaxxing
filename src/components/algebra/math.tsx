import { Fragment } from "react";

import {
  type MathNode,
  describeMath,
  parseMath,
  splitProse,
  typesetText,
} from "@/lib/algebra/notation";
import { cn } from "@/lib/utils";

/**
 * Notation is drawn, not imported.
 *
 * Fractions stack with a rule between them, radicals get a real overbar, and
 * everything sizes in `em` so a fraction inside a radical inside an exponent
 * still shrinks sensibly. Black stays the only ink: the bars are `currentColor`.
 */
function Nodes({ nodes }: { nodes: MathNode[] }) {
  const out: React.ReactNode[] = [];

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    const next = nodes[index + 1];

    // An exponent on a stretched bracket has to ride at the top of it. Left as
    // an ordinary <sup> it would sit near the text baseline, which on a tall
    // fence reads as a factor beside the bracket rather than a power of it.
    if (node.kind === "fence" && next?.kind === "sup") {
      out.push(
        <span key={index} className="math-power">
          <Node node={node} />
          <sup className="math-power-script">
            <Nodes nodes={next.body} />
          </sup>
        </span>,
      );
      index += 1;
      continue;
    }

    out.push(
      <Fragment key={index}>
        <Node node={node} />
      </Fragment>,
    );
  }

  return <>{out}</>;
}

function Node({ node }: { node: MathNode }) {
  switch (node.kind) {
    case "text":
      return <>{typesetText(node.value)}</>;

    case "prose":
      return <span className="px-[0.25em] font-sans italic">{node.value}</span>;

    case "sup":
      return (
        <sup className="math-sup">
          <Nodes nodes={node.body} />
        </sup>
      );

    case "sub":
      return (
        <sub className="math-sub">
          <Nodes nodes={node.body} />
        </sub>
      );

    case "frac":
      return (
        <span className="mx-[0.15em] inline-flex flex-col items-center align-middle text-[0.88em] leading-[1.15]">
          <span className="px-[0.3em]">
            <Nodes nodes={node.num} />
          </span>
          <span className="w-full border-t border-current px-[0.3em] text-center">
            <Nodes nodes={node.den} />
          </span>
        </span>
      );

    case "fence":
      // Brackets drawn with borders rather than typed, so they stretch to
      // whatever height the contents turn out to be.
      return (
        <span className="math-fence">
          <span aria-hidden data-delimiter={node.open} className="math-fence-open" />
          <span className="math-fence-body">
            <Nodes nodes={node.body} />
          </span>
          <span aria-hidden data-delimiter={node.close} className="math-fence-close" />
        </span>
      );

    case "sqrt":
      // The geometry lives in globals.css, where the metrics it is derived
      // from can be written down next to it.
      return (
        <span className="math-sqrt">
          {node.index !== null && (
            <span className="math-sqrt-index">
              <Nodes nodes={node.index} />
            </span>
          )}
          <span aria-hidden className="math-sqrt-sign">
            &radic;
          </span>
          <span className="math-sqrt-body">
            <Nodes nodes={node.radicand} />
          </span>
        </span>
      );
  }
}

type MathProps = {
  /** Notation, e.g. `\frac{a^{2}}{b}`. */
  expr: string;
  /** `block` centres the expression on its own line with breathing room. */
  display?: "inline" | "block";
  className?: string;
};

export function Math({ expr, display = "inline", className }: MathProps) {
  const nodes = parseMath(expr);

  return (
    <span
      // The tree is a pile of nested spans; a screen reader gets the sentence
      // form instead, which is the only readable option for a fraction.
      role="math"
      aria-label={describeMath(nodes)}
      className={cn(
        "font-mono whitespace-nowrap",
        display === "block" ? "block overflow-x-auto py-0.5 text-[0.95rem] sm:text-base" : "",
        className,
      )}
    >
      <span aria-hidden>
        <Nodes nodes={nodes} />
      </span>
    </span>
  );
}

/**
 * A sentence that can name expressions inline: anything between a pair of `$`
 * is set as notation, everything else as ordinary prose.
 */
export function Prose({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {splitProse(text).map((run, index) =>
        run.math ? (
          <Math key={index} expr={run.value} />
        ) : (
          <Fragment key={index}>{run.value}</Fragment>
        ),
      )}
    </span>
  );
}
