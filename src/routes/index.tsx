import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { cities, stadiums, type Stadium } from "@/data/stadiums";
import StadiumDetail from "@/components/StadiumDetail";

const StadiumMap = lazy(() => import("@/components/StadiumMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FIFA 2026 Stadium Explorer" },
      { name: "description", content: "Explore all 16 host stadiums of the FIFA World Cup 2026 across the USA, Canada, and Mexico on an interactive map." },
      { property: "og:title", content: "FIFA 2026 Stadium Explorer" },
      { property: "og:description", content: "Interactive ArcGIS map of every FIFA World Cup 2026 host stadium." },
    ],
  }),
  component: Index,
});

function Index() {
  const [selected, setSelected] = useState<Stadium | null>(null);
  const [flyToCity, setFlyToCity] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onSelect = (s: Stadium) => {
    setSelected(s);
    setDrawerOpen(true);
  };

  const onCityChange = (city: string) => {
    setFlyToCity(city);
    // re-trigger even if same city picked
    setTimeout(() => setFlyToCity(null), 50);
    const match = stadiums.find((s) => s.city === city);
    if (match) {
      setSelected(match);
      setDrawerOpen(true);
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-background lg:flex-row">
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-3 bg-primary/95 px-4 py-3 text-primary-foreground backdrop-blur lg:right-[380px]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <div>
            <h1 className="text-sm font-bold leading-tight sm:text-base">FIFA World Cup 2026</h1>
            <p className="text-[10px] uppercase tracking-wider opacity-80 sm:text-xs">Stadium Explorer</p>
          </div>
        </div>
        <select
          value={selected?.city ?? ""}
          onChange={(e) => onCityChange(e.target.value)}
          className="max-w-[55%] truncate rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-primary-foreground outline-none focus:bg-white/20"
        >
          <option value="" disabled className="text-foreground">Jump to city…</option>
          {cities.map((c) => (
            <option key={c} value={c} className="text-foreground">{c}</option>
          ))}
        </select>
      </header>

      <main className="relative flex-1">
        {mounted ? (
          <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading map…</div>}>
            <StadiumMap selectedId={selected?.id ?? null} onSelect={onSelect} flyToCity={flyToCity} />
          </Suspense>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">Loading map…</div>
        )}
      </main>

      {/* Desktop side panel */}
      <aside className="hidden h-full w-[380px] shrink-0 overflow-y-auto border-l border-border bg-card shadow-xl lg:block">
        <div className="h-[60px]" />
        <StadiumDetail stadium={selected} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 max-h-[60vh] overflow-y-auto rounded-t-2xl bg-card shadow-2xl transition-transform duration-300 lg:hidden ${
          drawerOpen && selected ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          className="sticky top-0 z-10 flex w-full items-center justify-center bg-card py-2"
          aria-label="Close"
        >
          <span className="h-1.5 w-12 rounded-full bg-muted-foreground/40" />
        </button>
        <StadiumDetail stadium={selected} />
      </div>
    </div>
  );
}
