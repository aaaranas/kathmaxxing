import { cn } from "@/lib/utils";

/**
 * The page container, in one place so every route and the footer agree.
 *
 * One width scale, chosen by viewport rather than by sniffing the user agent:
 * a browser window at half a laptop screen should get the narrow layout, and a
 * phone held sideways should not. Below `lg` this is the phone layout exactly
 * as it was - a single column, edge to edge. At `lg` the shell opens to 1024px
 * and each page spends the extra width on a second column rather than on
 * longer lines of prose, which is the part that stops being pleasant to read.
 */
export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-4 sm:px-6 lg:max-w-5xl",
        className,
      )}
    >
      {children}
    </main>
  );
}

/** The same measurements, for anything outside `main` that has to line up. */
export const SHELL_WIDTH = "mx-auto w-full max-w-3xl lg:max-w-5xl";
