"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Database, Inbox, RotateCw, TriangleAlert } from "lucide-react";

import { loadHistory } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BASES, baseMeta, groupDigits } from "@/lib/bases";
import type { HistoryEntry, HistoryState } from "@/lib/history";

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function formatWhen(iso: string): string {
  const then = new Date(iso);
  const seconds = Math.round((then.getTime() - Date.now()) / 1000);
  const absolute = Math.abs(seconds);

  if (absolute < 45) return "just now";
  if (absolute < 3600) return RELATIVE.format(Math.round(seconds / 60), "minute");
  if (absolute < 86_400) return RELATIVE.format(Math.round(seconds / 3600), "hour");
  if (absolute < 604_800) return RELATIVE.format(Math.round(seconds / 86_400), "day");

  return then.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function EntryRow({ entry }: { entry: HistoryEntry }) {
  const meta = baseMeta(entry.inputType);
  const others = BASES.filter((base) => base !== entry.inputType);

  return (
    <li className="flex flex-col gap-2 border-b border-line px-4 py-3 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="tnum font-mono text-lg break-all">
          {groupDigits(entry.inputValue, entry.inputType)}
        </span>
        <span className="text-xs">{formatWhen(entry.createdAt)}</span>
      </div>
      <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
        <div className="flex items-baseline gap-1.5">
          <dt className="rounded bg-plate px-1.5 py-0.5 text-xs">{meta.name}</dt>
          <dd className="text-xs">as entered</dd>
        </div>
        {others.map((base) => (
          <div key={base} className="flex items-baseline gap-1.5">
            <dt className="text-xs">{baseMeta(base).name.toLowerCase()}</dt>
            <dd className="tnum font-mono break-all">{entry.values[base]}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

function Notice({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Database;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-line bg-desk px-4 py-5">
      <span className="flex items-center gap-2 font-medium">
        <Icon aria-hidden className="size-4 shrink-0" />
        {title}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function HistoryPanel({ refreshToken }: { refreshToken: number }) {
  const [state, setState] = useState<HistoryState | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(async () => {
      setState(await loadHistory());
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, refreshToken]);

  const entries = state?.status === "ok" ? state.entries : [];

  return (
    <Card className="border-0 ring-1 ring-foreground/15">
      <CardHeader>
        <CardTitle>Saved conversions</CardTitle>
        <CardDescription>
          Every value you settle on is written to the database. The other bases are recomputed when
          the list loads.
        </CardDescription>
        <div className="col-start-2 row-span-2 row-start-1 self-start">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={refresh}
            disabled={pending}
            aria-label="Reload the history"
            className="size-8 text-foreground hover:bg-plate"
          >
            <RotateCw className={"size-4" + (pending ? " animate-spin" : "")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {state === null ? (
          <div className="flex flex-col gap-3" aria-busy="true">
            {[0, 1, 2].map((row) => (
              <Skeleton key={row} className="h-16 w-full rounded-lg bg-desk" />
            ))}
          </div>
        ) : state.status === "unconfigured" ? (
          <Notice icon={Database} title="No database connected yet">
            <p className="mb-2">
              History is stored in Neon Postgres. Once a connection string is in place this tab
              fills itself in.
            </p>
            <ol className="ml-4 flex list-decimal flex-col gap-1">
              <li>Create a project at neon.tech and copy its pooled connection string.</li>
              <li>
                Put it in <code className="font-mono">.env.local</code> as{" "}
                <code className="font-mono">DATABASE_URL</code>.
              </li>
              <li>
                Run <code className="font-mono">npm run db:push</code> to create the table.
              </li>
            </ol>
          </Notice>
        ) : state.status === "error" ? (
          <Notice icon={TriangleAlert} title="The history could not be loaded">
            <p>{state.message}</p>
          </Notice>
        ) : entries.length === 0 ? (
          <Notice icon={Inbox} title="Nothing saved yet">
            <p>Convert a number and it will appear here a moment later.</p>
          </Notice>
        ) : (
          <ul className="overflow-hidden rounded-lg border border-line bg-paper">
            {entries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
