import { useEffect, useRef, useState } from "react";
import {
  User,
  MapPin,
  Sparkles,
  Train,
  Navigation,
  Hotel,
  UtensilsCrossed,
  Loader2,
  ExternalLink,
  Info,
  Star,
  Beer,
  Coffee,
  Utensils,
  PartyPopper,
} from "lucide-react";
import { stadiums, type Stadium } from "@/data/stadiums";
import { transportData } from "@/data/transport";
import { fetchHotels, fetchRestaurants, bookingUrl, gmapsPlaceUrl, type Poi } from "@/lib/overpass";
import { fanzones, type FanZone } from "@/data/fanzones";
import DirectionsPanel from "@/components/DirectionsPanel";

type Tab = "overview" | "transport" | "hotels" | "restaurants" | "fanzones";
type EatFilter = "all" | "restaurant" | "sports_bar" | "cafe";
const RADII = [1, 1.5, 3] as const;
type Radius = (typeof RADII)[number];

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
  const [hotelRadius, setHotelRadius] = useState<Radius>(1500);
  const [eatRadius, setEatRadius] = useState<Radius>(1500);
  const [hotels, setHotels] = useState<Poi[]>([]);
  const [restaurants, setRestaurants] = useState<Poi[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [loadingEat, setLoadingEat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eatFilter, setEatFilter] = useState<EatFilter>("all");
  const hotelsCache = useRef(new Map<string, Poi[]>());
  const eatCache = useRef(new Map<string, Poi[]>());

  // Reset to overview when stadium changes
  useEffect(() => {
    setTab("overview");
    setHotels([]);
    setRestaurants([]);
    setError(null);
    onPoisChange?.([]);
    onPoiKindChange?.(null);
    onFanzonesChange?.([]);
  }, [stadium?.id, onPoisChange, onPoiKindChange, onFanzonesChange]);

  // Fetch hotels when tab/radius changes
  useEffect(() => {
    if (!stadium || tab !== "hotels") return;
    const key = `${stadium.id}-hotels-${hotelRadius}`;
    const cached = hotelsCache.current.get(key);
    if (cached) {
      setHotels(cached);
      onPoisChange?.(cached);
      return;
    }
    setLoadingHotels(true);
    setError(null);
    fetchHotels(stadium.id, stadium.latitude, stadium.longitude, hotelRadius)
      .then((list) => {
        hotelsCache.current.set(key, list);
        setHotels(list);
        onPoisChange?.(list);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoadingHotels(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, stadium?.id, hotelRadius]);

  // Fetch eat & drink when tab/radius changes
  useEffect(() => {
    if (!stadium || tab !== "restaurants") return;
    const key = `${stadium.id}-eatdrink-${eatRadius}`;
    const cached = eatCache.current.get(key);
    if (cached) {
      setRestaurants(cached);
      onPoisChange?.(cached);
      return;
    }
    setLoadingEat(true);
    setError(null);
    fetchRestaurants(stadium.id, stadium.latitude, stadium.longitude, eatRadius)
      .then((list) => {
        const sorted = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        eatCache.current.set(key, sorted);
        setRestaurants(sorted);
        onPoisChange?.(sorted);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoadingEat(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, stadium?.id, eatRadius]);

  // Tell parent which POI layer should be visible
  useEffect(() => {
    if (tab === "hotels") onPoiKindChange?.("hotels");
    else if (tab === "restaurants") onPoiKindChange?.("eatdrink");
    else if (tab === "fanzones") onPoiKindChange?.("fanzones");
    else onPoiKindChange?.(null);
  }, [tab, onPoiKindChange]);

  // Push current filtered list to map when filter changes on eat tab
  useEffect(() => {
    if (tab !== "restaurants") return;
    const filtered =
      eatFilter === "all" ? restaurants : restaurants.filter((p) => p.subKind === eatFilter);
    onPoisChange?.(filtered);
  }, [eatFilter, restaurants, tab, onPoisChange]);

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
        {tab === "transport" && (
          <TransportTab stadium={stadium} />
        )}
        {tab === "hotels" && (
          <HotelsTab
            items={hotels}
            loading={loadingHotels}
            error={error}
            radius={hotelRadius}
            setRadius={(r) => {
              setHotels([]);
              setHotelRadius(r);
            }}
          />
        )}
        {tab === "restaurants" && (
          <EatTab
            items={restaurants}
            loading={loadingEat}
            error={error}
            radius={eatRadius}
            setRadius={(r) => {
              setRestaurants([]);
              setEatRadius(r);
            }}
            filter={eatFilter}
            setFilter={setEatFilter}
          />
        )}
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

function TransportTab({ stadium }: { stadium: Stadium }) {
  const data = transportData[stadium.id];
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-primary">
          <Navigation size={12} /> Live Directions
        </div>
        <DirectionsPanel stadium={stadium} />
      </div>

      <div className="flex gap-2 rounded-2xl bg-gradient-soft/40 p-3 ring-1 ring-primary/20">
        <Info size={16} className="mt-0.5 shrink-0 text-primary" />
        <div className="text-xs text-foreground">
          <div className="font-bold uppercase tracking-wider text-[10px] text-primary">
            Matchday Note
          </div>
          <div className="mt-1">{data.matchdayNote}</div>
        </div>
      </div>
    </div>
  );
}

function RadiusToggle({
  value,
  onChange,
}: {
  value: Radius;
  onChange: (r: Radius) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-white/70 p-1 text-[11px] font-semibold ring-1 ring-border">
      {RADII.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`rounded-full px-3 py-1 transition ${
            value === r ? "bg-gradient-primary text-white shadow-soft" : "text-muted-foreground"
          }`}
        >
          {r === 1 ? "1 mi" : r === 1.5 ? "1.5 mi" : "3 mi"}
        </button>
      ))}
    </div>
  );
}

function HotelsTab({
  items,
  loading,
  error,
  radius,
  setRadius,
}: {
  items: Poi[];
  loading: boolean;
  error: string | null;
  radius: Radius;
  setRadius: (r: Radius) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Radius</span>
        <RadiusToggle value={radius} onChange={setRadius} />
      </div>
      <PoiList
        kind="hotel"
        items={items}
        loading={loading}
        error={error}
        emptyMessage="No hotels found nearby. Try a wider radius."
      />
    </div>
  );
}

function EatTab({
  items,
  loading,
  error,
  radius,
  setRadius,
  filter,
  setFilter,
}: {
  items: Poi[];
  loading: boolean;
  error: string | null;
  radius: Radius;
  setRadius: (r: Radius) => void;
  filter: EatFilter;
  setFilter: (f: EatFilter) => void;
}) {
  const filtered = filter === "all" ? items : items.filter((p) => p.subKind === filter);
  const chips: { id: EatFilter; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "all", label: "All", Icon: Sparkles },
    { id: "restaurant", label: "Restaurants", Icon: Utensils },
    { id: "sports_bar", label: "Sports Bars", Icon: Beer },
    { id: "cafe", label: "Cafés", Icon: Coffee },
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Radius</span>
        <RadiusToggle value={radius} onChange={setRadius} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
              filter === id
                ? "bg-gradient-primary text-white shadow-soft"
                : "bg-white/70 text-muted-foreground hover:bg-white"
            }`}
          >
            <Icon size={11} /> {label}
          </button>
        ))}
      </div>
      <PoiList
        kind="restaurant"
        items={filtered}
        loading={loading}
        error={error}
        emptyMessage="No places match this filter. Try another category or wider radius."
      />
    </div>
  );
}

function PoiList({
  kind,
  items,
  loading,
  error,
  emptyMessage,
}: {
  kind: "hotel" | "restaurant";
  items: Poi[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Loader2 className="animate-spin text-primary" size={28} />
        <div className="mt-3 text-xs">
          Loading nearby {kind === "hotel" ? "hotels" : "places to eat"}…
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl bg-destructive/10 p-4 text-xs text-destructive">
        Couldn't reach ArcGIS Places. Please try again shortly.
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white/85 p-4 text-xs text-muted-foreground ring-1 ring-border">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="space-y-2.5">
      {items.map((p) => (
        <PoiCard key={p.id} poi={p} kind={kind} />
      ))}
    </div>
  );
}

function PoiCard({ poi, kind }: { poi: Poi; kind: "hotel" | "restaurant" }) {
  const href =
    kind === "hotel"
      ? bookingUrl(poi.name)
      : gmapsPlaceUrl(poi.name, poi.lat, poi.lon);
  const label = kind === "hotel" ? "Check Prices" : "View on Map";
  // Convert 0-10 rating to 0-5 stars
  const stars =
    typeof poi.rating === "number" ? Math.round((poi.rating / 2) * 10) / 10 : undefined;
  const priceStr =
    typeof poi.price === "number" ? "$".repeat(Math.max(1, Math.min(4, poi.price))) : undefined;
  return (
    <div className="rounded-2xl bg-white/85 p-3 shadow-soft ring-1 ring-border">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-foreground">{poi.name}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
            <span className="font-semibold text-primary">{formatDistance(poi.distance)}</span>
            {stars !== undefined && (
              <span className="inline-flex items-center gap-0.5 text-amber-500">
                · <Star size={10} className="fill-amber-500 stroke-amber-500" />
                <span className="font-semibold">{stars.toFixed(1)}</span>
              </span>
            )}
            {priceStr && <span className="font-semibold">· {priceStr}</span>}
            {kind === "restaurant" && poi.cuisine && (
              <span className="capitalize">· {poi.cuisine}</span>
            )}
          </div>
          {poi.address && (
            <div className="mt-1 truncate text-[11px] text-muted-foreground">{poi.address}</div>
          )}
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-soft px-3 py-1.5 text-[11px] font-semibold text-primary transition hover:opacity-80"
      >
        {label} <ExternalLink size={11} />
      </a>
    </div>
  );
}

function formatDistance(m: number): string {
  const miles = m / 1609.344;
  if (miles < 0.1) {
    const feet = Math.round(m * 3.28084);
    return `${feet} ft`;
  }
  return miles < 10 ? `${miles.toFixed(1)} mi` : `${Math.round(miles)} mi`;
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
