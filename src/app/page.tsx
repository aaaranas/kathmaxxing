import { ThemeSwitcher } from "@/components/theme-switcher";
import { Workbench } from "@/components/workbench";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-4 sm:px-6">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div>
          <h1 className="relative inline-block font-mono text-xl font-medium tracking-tight">
            <span className="relative z-10">kathmaxxing</span>
            <span
              aria-hidden
              className="absolute inset-x-[-0.15em] bottom-[0.1em] z-0 h-2 bg-plate"
            />
          </h1>
          <p className="mt-1.5 max-w-[52ch] text-sm">
            Four bases, one number. Type into any of them and the other three follow, with the
            arithmetic written out underneath.
          </p>
        </div>
        <ThemeSwitcher />
      </header>

      <Workbench />
    </main>
  );
}
