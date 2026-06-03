import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { cities, stadiums, type Stadium } from "@/data/stadiums";
import StadiumDetail from "@/components/StadiumDetail";
import type { Poi } from "@/lib/overpass";

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
  const [mounted, setMounted] = useState(false);
  const [pois, setPois] = useState<Poi[]>([]);
  useEffect(() => setMounted(true), []);

  const handlePoisChange = useCallback((next: Poi[]) => setPois(next), []);

  const onSelect = (s: Stadium) => {
    setSelected(s);
  };

  const onCityChange = (city: string) => {
    setFlyToCity(city);
    // re-trigger even if same city picked
    setTimeout(() => setFlyToCity(null), 50);
    const match = stadiums.find((s) => s.city === city);
    if (match) {
      setSelected(match);
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden lg:flex-row">
      <header className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between gap-3 rounded-3xl glass px-4 py-3 shadow-soft lg:right-[396px]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary text-lg shadow-glow">
            🌍
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight sm:text-base text-gradient-primary">FIFA World Cup 2026</h1>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">Stadium Explorer</p>
          </div>
        </div>
        <select
          value={selected?.city ?? ""}
          onChange={(e) => onCityChange(e.target.value)}
          className="max-w-[55%] truncate rounded-2xl border border-white/40 bg-white/60 px-3 py-2 text-sm font-medium text-foreground outline-none transition focus:border-primary/60 focus:bg-white/90 focus:ring-2 focus:ring-primary/30"
        >
          <option value="" disabled>Jump to city…</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </header>

      <main className="relative flex-1">
        {mounted ? (
          <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading map…</div>}>
            <StadiumMap
              selectedId={selected?.id ?? null}
              onSelect={onSelect}
              flyToCity={flyToCity}
              pois={pois}
            />
          </Suspense>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">Loading map…</div>
        )}
      </main>

      {/* Desktop side panel */}
      <aside className="hidden h-full w-[392px] shrink-0 p-3 lg:block">
        <div className="h-full overflow-y-auto rounded-3xl glass shadow-glow">
          <StadiumDetail stadium={selected} onPoisChange={handlePoisChange} />
        </div>
      </aside>
    </div>
  );
}
