import { useEffect, useState } from "react";
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
} from "lucide-react";
import { stadiums, type Stadium } from "@/data/stadiums";
import { transportData } from "@/data/transport";
import { fetchHotels, fetchRestaurants, bookingUrl, gmapsPlaceUrl, type Poi } from "@/lib/overpass";
import DirectionsPanel from "@/components/DirectionsPanel";

type Tab = "overview" | "transport" | "hotels" | "restaurants";

export default function StadiumDetail({
  stadium,
  onPoisChange,
}: {
  stadium: Stadium | null;
  onPoisChange?: (pois: Poi[]) => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [hotels, setHotels] = useState<Poi[]>([]);
  const [restaurants, setRestaurants] = useState<Poi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset to overview when stadium changes
  useEffect(() => {
    setTab("overview");
    setHotels([]);
    setRestaurants([]);
    setError(null);
    onPoisChange?.([]);
  }, [stadium?.id, onPoisChange]);

  // Fetch POIs lazily on tab open
  useEffect(() => {
    if (!stadium) return;
    if (tab === "hotels" && hotels.length === 0) {
      setLoading(true);
      setError(null);
      fetchHotels(stadium.id, stadium.latitude, stadium.longitude)
        .then((list) => {
          setHotels(list);
          onPoisChange?.(list);
        })
        .catch((e) => setError(String(e)))
        .finally(() => setLoading(false));
    } else if (tab === "restaurants" && restaurants.length === 0) {
      setLoading(true);
      setError(null);
      fetchRestaurants(stadium.id, stadium.latitude, stadium.longitude)
        .then((list) => {
          setRestaurants(list);
          onPoisChange?.(list);
        })
        .catch((e) => setError(String(e)))
        .finally(() => setLoading(false));
    } else if (tab === "hotels") {
      onPoisChange?.(hotels);
    } else if (tab === "restaurants") {
      onPoisChange?.(restaurants);
    } else {
      onPoisChange?.([]);
    }
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
          <PoiList
            kind="hotel"
            items={hotels}
            loading={loading}
            error={error}
            emptyMessage="No hotels found nearby. Try expanding your search on Booking.com."
          />
        )}
        {tab === "restaurants" && (
          <PoiList
            kind="restaurant"
            items={restaurants}
            loading={loading}
            error={error}
            emptyMessage="No restaurants found within 1.5 km of the stadium."
          />
        )}
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
  ];
  return (
    <div className="sticky top-0 z-10 mx-3 mt-2 rounded-2xl glass p-1 shadow-soft">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-semibold transition ${
              tab === id
                ? "bg-gradient-primary text-white shadow-soft"
                : "text-muted-foreground hover:bg-white/60"
            }`}
          >
            <Icon size={16} />
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
      ? bookingUrl(poi.name, poi.lat, poi.lon)
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
  return `${miles.toFixed(2)} mi`;
}
