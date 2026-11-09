import { useEffect, useMemo, useState } from "react";
import {
  User,
  MapPin,
  Sparkles,
  Train,
  Hotel,
  UtensilsCrossed,
  PartyPopper,
} from "lucide-react";
import { stadiums, type Stadium } from "@/data/stadiums";
import type { Poi } from "@/lib/overpass";
import { fanzones, type FanZone } from "@/data/fanzones";
import DirectionsPanel from "@/components/DirectionsPanel";
import SavedPlacesTab from "@/components/SavedPlacesTab";
import { listedPlaces, type PlaceCategory } from "@/lib/saved-places";

type Tab = "overview" | "transport" | "hotels" | "restaurants" | "fanzones";

export default function StadiumDetail({
  stadium,
  onPoisChange,
  onPoiKindChange,
  onFanzonesChange,
}: {
  stadium: Stadium | null;
  onPoisChange?: (pois: Poi[]) => void;
  onPoiKindChange?: (kind: "hotels" | "eatdrink" | "fanzones" | null) => void;
  onFanzonesChange?: (zones: FanZone[]) => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [radius, setRadius] = useState(1.5);
  const [category, setCategory] = useState<PlaceCategory>("all");
  const places = useMemo(() => stadium && (tab === "hotels" || tab === "restaurants")
    ? listedPlaces(stadium, tab === "hotels" ? "hotels" : "eatdrink", radius, category)
    : [], [stadium, tab, radius, category]);
  // Reset to overview when stadium changes
  useEffect(() => {
    setTab("overview");
    setRadius(1.5);
    setCategory("all");
    onPoisChange?.([]);
    onPoiKindChange?.(null);
    onFanzonesChange?.([]);
  }, [stadium?.id, onPoisChange, onPoiKindChange, onFanzonesChange]);

  // Map markers always reflect the same locally filtered records as the cards.
  useEffect(() => {
    onPoisChange?.(places);
    onPoiKindChange?.(tab === "fanzones" ? "fanzones" : tab === "hotels" ? "hotels" : tab === "restaurants" ? "eatdrink" : null);
  }, [tab, places, onPoisChange, onPoiKindChange]);

  // Push fanzones for this city to parent when tab is active
  const cityFanzones = stadium ? fanzones.filter((z) => z.cityId === stadium.city) : [];
  useEffect(() => {
    if (tab === "fanzones") onFanzonesChange?.(cityFanzones);
    else onFanzonesChange?.([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, stadium?.id]);

  if (!stadium) {
    return (
      <div className="p-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-soft px-3 py-1 text-xs font-semibold text-primary-foreground/90">
          <Sparkles size={12} /> Welcome
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gradient-primary">
          Discover FIFA 2026
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore all {stadiums.length} host stadiums across the USA, Canada, and Mexico.
        </p>
        <p className="mt-4 text-sm">Tap a pin on the map or jump to a city above to begin.</p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { n: "16", l: "Stadiums" },
            { n: "3", l: "Nations" },
            { n: "11", l: "Cities" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-gradient-primary p-[1.5px] shadow-soft">
              <div className="rounded-[calc(1rem-1px)] bg-white/85 p-3 text-center">
                <div className="text-2xl font-bold text-gradient-primary">{s.n}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative p-3">
        <div className="relative overflow-hidden rounded-3xl shadow-glow">
          <img src={stadium.imageUrl} alt={stadium.name} className="h-56 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
              <MapPin size={12} /> {stadium.country}
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-2">
        <h2 className="text-3xl font-bold tracking-tight text-gradient-primary">{stadium.name}</h2>
        <div className="mt-1 text-sm text-muted-foreground">{stadium.city}</div>
      </div>

      <TabBar tab={tab} setTab={setTab} />

      <div className="px-6 pb-6 pt-3">
        {tab === "overview" && <OverviewTab stadium={stadium} />}
        {tab === "transport" && <DirectionsPanel stadium={stadium} />}
        {(tab === "hotels" || tab === "restaurants") && <SavedPlacesTab stadiumId={stadium.id} kind={tab === "hotels" ? "hotels" : "eatdrink"} places={places} radius={radius} onRadiusChange={setRadius} category={category} onCategoryChange={setCategory} />}
        {tab === "fanzones" && <FanZonesTab zones={cityFanzones} />}
      </div>
    </div>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "overview", label: "Overview", Icon: Sparkles },
    { id: "transport", label: "Transport", Icon: Train },
    { id: "hotels", label: "Hotels", Icon: Hotel },
    { id: "restaurants", label: "Eat", Icon: UtensilsCrossed },
    { id: "fanzones", label: "Fan Zones", Icon: PartyPopper },
  ];
  return (
    <div className="sticky top-0 z-10 mx-3 mt-2 rounded-2xl glass p-1 shadow-soft">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold transition ${
              tab === id
                ? "bg-gradient-primary text-white shadow-soft"
                : "text-muted-foreground hover:bg-white/60"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function OverviewTab({ stadium }: { stadium: Stadium }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-gradient-primary p-[1.5px] shadow-soft">
        <div className="rounded-[calc(1rem-1px)] bg-white/90 p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Capacity</div>
          <div className="mt-1 flex items-center gap-2 text-xl font-bold text-foreground">
            <User size={18} className="text-primary" />
            {stadium.capacity.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white/85 p-4 shadow-soft ring-1 ring-border">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Host City
        </div>
        <div className="mt-1 flex items-start gap-2 text-sm font-bold text-foreground">
          <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>{stadium.city}</span>
        </div>
      </div>
    </div>
  );
}

function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso + "T00:00:00");
  const end = new Date(endIso + "T00:00:00");
  const sameYear = start.getFullYear() === end.getFullYear();
  const sMonth = start.toLocaleString("en-US", { month: "short" });
  const eMonth = end.toLocaleString("en-US", { month: "short" });
  const s = `${sMonth} ${start.getDate()}`;
  const e = `${eMonth} ${end.getDate()} ${end.getFullYear()}`;
  return sameYear ? `${s} – ${e}` : `${s} ${start.getFullYear()} – ${e}`;
}

function FanZonesTab({ zones }: { zones: FanZone[] }) {
  if (zones.length === 0) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-white/85 p-4 text-xs text-muted-foreground ring-1 ring-border">
          No confirmed fan zones for this city yet. Check FIFA.com
        </div>
        <FanzoneFooter />
      </div>
    );
  }
  return (
    <div className="space-y-2.5">
      {zones.map((z) => (
        <div key={z.id} className="rounded-2xl bg-white/85 p-3 shadow-soft ring-1 ring-border">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-foreground">{z.name}</div>
              <div className="mt-0.5 text-[12px] font-semibold text-primary">{z.venue}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{z.address}</div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-foreground">
                <span className="font-semibold">{formatDateRange(z.startDate, z.endDate)}</span>
                <span className="text-muted-foreground">· {z.hours}</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                {z.description}
              </p>
              {z.isFreeEntry && (
                <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Free Entry
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <FanzoneFooter />
    </div>
  );
}

function FanzoneFooter() {
  return (
    <p className="pt-1 text-[10px] italic text-muted-foreground">
      Fan zone info correct as of June 2026. Verify at FIFA.com before travel.
    </p>
  );
}
