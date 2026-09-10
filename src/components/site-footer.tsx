import { Asterisk } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full px-4 pt-10 pb-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3">
        <div aria-hidden className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <Asterisk className="size-3.5 opacity-50" />
          <span className="h-px flex-1 bg-line" />
        </div>
        <p className="text-center text-xs tracking-wide">
          Developed by Andre Milan Ara&ntilde;as. For Kathleen Torrejano.
        </p>
      </div>
    </footer>
  );
}
