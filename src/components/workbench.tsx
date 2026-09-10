"use client";

import { useCallback, useState } from "react";
import { Binary, Grid3x3, History } from "lucide-react";

import { Converter } from "@/components/converter";
import { HistoryPanel } from "@/components/history-panel";
import { PatternTable } from "@/components/pattern-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Base } from "@/lib/bases";

const TABS = [
  { id: "converter", label: "Converter", icon: Binary },
  { id: "pattern", label: "Pattern", icon: Grid3x3 },
  { id: "history", label: "History", icon: History },
] as const;

export function Workbench() {
  const [tab, setTab] = useState<string>("converter");
  // 10110110 is 182, or B6 - small enough to check by hand, wide enough to
  // show nibble grouping working the moment the app opens.
  const [value, setValue] = useState("10110110");
  const [base, setBase] = useState<Base>(2);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleChange = useCallback((nextValue: string, nextBase: Base) => {
    setValue(nextValue);
    setBase(nextBase);
  }, []);

  const handleSaved = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  const handlePick = useCallback((binary: string) => {
    setValue(binary);
    setBase(2);
    setTab("converter");
  }, []);

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full gap-4">
      {/*
        The base style pins a horizontal list to h-8, which clips the triggers
        and leaves the list border showing through them. Override at the same
        variant so the row can grow to a comfortable touch target.
      */}
      <TabsList className="grid w-full grid-cols-3 gap-1 border border-line bg-desk p-1 group-data-horizontal/tabs:h-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            className="h-auto gap-2 py-2 text-foreground data-active:bg-paper data-active:text-foreground"
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="converter">
        <Converter value={value} base={base} onChange={handleChange} onSaved={handleSaved} />
      </TabsContent>

      <TabsContent value="pattern">
        <PatternTable onPick={handlePick} />
      </TabsContent>

      <TabsContent value="history">
        <HistoryPanel refreshToken={refreshToken} />
      </TabsContent>
    </Tabs>
  );
}
