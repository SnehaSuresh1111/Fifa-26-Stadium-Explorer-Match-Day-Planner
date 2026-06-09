import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { stadiums, type Stadium } from "@/data/stadiums";
import StadiumDetail from "@/components/StadiumDetail";
import type { Poi } from "@/lib/overpass";
import { ChevronLeft, ChevronRight, List, MapPin, X } from "lucide-react";

const StadiumMap = lazy(() => import("@/components/StadiumMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FIFA 2026 Stadium Explorer" },
      {
        name: "description",
        content:
          "Explore all 16 host stadiums of the FIFA World Cup 2026 across the USA, Canada, and Mexico on an interactive map.",
      },
      { property: "og:title", content: "FIFA 2026 Stadium Explorer" },
      {
        property: "og:description",
        content: "Interactive ArcGIS map of every FIFA World Cup 2026 host stadium.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [selected, setSelected] = useState<Stadium | null>(null);
  const [flyToCity, setFlyToCity] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pois, setPois] = useState<Poi[]>([]);
  const [panelOpen, setPanelOpen] = useState(true);
  const [showList, setShowList] = useState(true);
  useEffect(() => setMounted(true), []);

  const handlePoisChange = useCallback((next: Poi[]) => setPois(next), []);

  const onSelect = (s: Stadium) => {
    setSelected(s);
    setShowList(false);
    setPanelOpen(true);
  };

  const onPickStadium = (s: Stadium) => {
    setFlyToCity(s.city);
    setTimeout(() => setFlyToCity(null), 50);
    setSelected(s);
    setShowList(false);
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <main className="relative flex-1">
        {mounted ? (
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Loading map…
              </div>
            }
          >
            <StadiumMap
              selectedId={selected?.id ?? null}
              onSelect={onSelect}
              flyToCity={flyToCity}
              pois={pois}
            />
          </Suspense>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading map…
          </div>
        )}

        {!panelOpen && (
          <button
            onClick={() => setPanelOpen(true)}
            className="absolute right-3 top-3 z-20 flex items-center gap-2 rounded-2xl bg-gradient-primary px-3 py-2 text-sm font-semibold text-white shadow-glow"
            aria-label="Open panel"
          >
            <ChevronLeft size={16} /> Stadiums
          </button>
        )}
      </main>

      {/* Unified side panel: header + stadium list + tabs */}
      <aside
        className={`${
          panelOpen ? "translate-x-0" : "translate-x-full"
        } absolute right-0 top-0 z-30 h-full w-full max-w-[400px] p-3 transition-transform duration-300 sm:w-[380px]`}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-3xl glass shadow-glow">
          {/* Brand header */}
          <div className="flex items-center justify-between gap-2 border-b border-white/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-base shadow-glow">
                🌍
              </div>
              <div>
                <h1 className="text-sm font-bold leading-tight text-gradient-primary">
                  FIFA World Cup 2026
                </h1>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Stadium Explorer
                </p>
              </div>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-white/60"
              aria-label="Close panel"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* List toggle row (only when a stadium is selected) */}
          {selected && (
            <div className="flex items-center justify-between gap-2 border-b border-white/40 px-4 py-2">
              <button
                onClick={() => setShowList((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-white"
              >
                {showList ? <X size={12} /> : <List size={12} />}
                {showList ? "Close list" : "All stadiums"}
              </button>
              <div className="truncate text-[11px] text-muted-foreground">
                <MapPin size={11} className="inline" /> {selected.city}
              </div>
            </div>
          )}

          {/* Body: either list or detail */}
          <div className="flex-1 overflow-y-auto">
            {showList || !selected ? (
              <StadiumList selectedId={selected?.id ?? null} onPick={onPickStadium} />
            ) : (
              <StadiumDetail
                stadium={selected}
                onPoisChange={handlePoisChange}
              />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function StadiumList({
  selectedId,
  onPick,
}: {
  selectedId: string | null;
  onPick: (s: Stadium) => void;
}) {
  const grouped = stadiums.reduce<Record<string, Stadium[]>>((acc, s) => {
    (acc[s.country] ??= []).push(s);
    return acc;
  }, {});
  const order: Stadium["country"][] = ["USA", "Canada", "Mexico"];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold tracking-tight text-gradient-primary">Host Stadiums</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {stadiums.length} venues · 3 nations · 11 cities
      </p>

      <div className="mt-4 space-y-5">
        {order.map((country) => (
          <div key={country}>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {country}
            </div>
            <div className="space-y-2">
              {grouped[country]?.map((s) => {
                const active = s.id === selectedId;
                return (
                  <button
                    key={s.id}
                    onClick={() => onPick(s)}
                    className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left transition ${
                      active
                        ? "bg-gradient-primary text-white shadow-soft"
                        : "bg-white/70 hover:bg-white"
                    }`}
                  >
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className="h-12 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate text-sm font-bold ${
                          active ? "text-white" : "text-foreground"
                        }`}
                      >
                        {s.name}
                      </div>
                      <div
                        className={`truncate text-[11px] ${
                          active ? "text-white/80" : "text-muted-foreground"
                        }`}
                      >
                        {s.city} · {s.capacity.toLocaleString()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
