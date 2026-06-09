import { useEffect, useRef, useState } from "react";
import { Car, Truck, Footprints, Loader2, LocateFixed, Search } from "lucide-react";
import * as route from "@arcgis/core/rest/route";
import * as networkService from "@arcgis/core/rest/networkService";
import * as locator from "@arcgis/core/rest/locator";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type MapView from "@arcgis/core/views/MapView";
import { subscribeMapView, getApiKey } from "@/lib/arcgisMapHolder";
import type { Stadium } from "@/data/stadiums";

interface Props {
  stadium: Stadium;
}

type ModeKey = "driving" | "trucking" | "walking";

const MODE_OPTIONS: { key: ModeKey; label: string; serviceName: RegExp; Icon: typeof Car }[] = [
  { key: "driving", label: "Driving", serviceName: /^Driving Time$/i, Icon: Car },
  { key: "trucking", label: "Trucking", serviceName: /^Trucking Time$/i, Icon: Truck },
  { key: "walking", label: "Walking", serviceName: /^Walking Time$/i, Icon: Footprints },
];

const ROUTE_URL =
  "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
const GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

// cache travel modes across renders
let travelModesCache: any[] | null = null;

export default function DirectionsPanel({ stadium }: Props) {
  const [view, setView] = useState<MapView | null>(null);
  const [mode, setMode] = useState<ModeKey>("driving");
  const [origin, setOrigin] = useState<Point | null>(null);
  const [originLabel, setOriginLabel] = useState<string>("");
  const [addressInput, setAddressInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ miles: number; minutes: number } | null>(null);
  const layerRef = useRef<GraphicsLayer | null>(null);

  useEffect(() => subscribeMapView((v) => setView(v)), []);

  // Attach a graphics layer for the route line
  useEffect(() => {
    if (!view || !view.map) return;
    const layer = new GraphicsLayer({ listMode: "hide" });
    view.map.add(layer);
    layerRef.current = layer;
    return () => {
      try {
        view.map?.remove(layer);
      } catch {
        /* noop */
      }
      layerRef.current = null;
    };
  }, [view]);

  // Clear when stadium changes
  useEffect(() => {
    setResult(null);
    setError(null);
    layerRef.current?.removeAll();
  }, [stadium.id]);

  const destination = new Point({
    longitude: stadium.longitude,
    latitude: stadium.latitude,
  });

  async function useMyLocation() {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation not available in this browser.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = new Point({
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        });
        setOrigin(p);
        setOriginLabel("Your location");
        setBusy(false);
      },
      (err) => {
        setBusy(false);
        setError(`Could not get location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  async function geocodeAddress() {
    const text = addressInput.trim();
    if (!text) return;
    setError(null);
    setBusy(true);
    try {
      const apiKey = getApiKey() || undefined;
      const candidates = await locator.addressToLocations(GEOCODE_URL, {
        address: { SingleLine: text },
        outFields: ["Match_addr"],
        maxLocations: 1,
        apiKey,
      } as any);
      if (!candidates.length) {
        setError("Address not found. Try another query.");
        return;
      }
      const c = candidates[0];
      if (!c.location) {
        setError("Address not found. Try another query.");
        return;
      }
      setOrigin(c.location);
      setOriginLabel(c.address || text);
    } catch (e: any) {
      setError(`Geocoder error: ${e?.message ?? e}`);
    } finally {
      setBusy(false);
    }
  }

  async function getTravelMode(name: RegExp) {
    if (!travelModesCache) {
      const desc = await networkService.fetchServiceDescription(ROUTE_URL, getApiKey());
      travelModesCache = (desc as any).supportedTravelModes ?? [];
    }
    return travelModesCache!.find((tm) => name.test(tm.name));
  }

  async function solveRoute() {
    if (!origin) {
      setError("Set a starting point first.");
      return;
    }
    setError(null);
    setBusy(true);
    setResult(null);
    try {
      const apiKey = getApiKey() || undefined;
      const modeOpt = MODE_OPTIONS.find((m) => m.key === mode)!;
      const travelMode = await getTravelMode(modeOpt.serviceName);

      const stops = new FeatureSet({
        features: [
          new Graphic({ geometry: origin, attributes: { Name: originLabel || "Start" } }),
          new Graphic({ geometry: destination, attributes: { Name: stadium.name } }),
        ],
      });
      const params = new RouteParameters({
        apiKey,
        stops,
        returnRoutes: true,
        returnDirections: true,
        directionsLengthUnits: "miles",
        ...(travelMode ? { travelMode } : {}),
      } as any);
      const res = await route.solve(ROUTE_URL, params);
      const r = res.routeResults?.[0];
      if (!r?.route) {
        setError("No route found.");
        return;
      }
      const totalMiles = (r as any).directions?.totalLength ?? 0;
      const totalMinutes = (r as any).directions?.totalDriveTime ?? 0;
      setResult({ miles: totalMiles, minutes: totalMinutes });

      const layer = layerRef.current;
      if (layer) {
        layer.removeAll();
        const line = new Graphic({
          geometry: r.route.geometry,
          symbol: new SimpleLineSymbol({
            color: [37, 99, 235, 0.9],
            width: 5,
          }),
        });
        const start = new Graphic({
          geometry: origin,
          symbol: new SimpleMarkerSymbol({
            color: [37, 99, 235, 1],
            size: 10,
            outline: { color: [255, 255, 255, 1], width: 2 },
          }),
        });
        const end = new Graphic({
          geometry: destination,
          symbol: new SimpleMarkerSymbol({
            color: [220, 38, 38, 1],
            size: 12,
            outline: { color: [255, 255, 255, 1], width: 2 },
          }),
        });
        layer.addMany([line, start, end]);
        if (view && line.geometry) {
          view.goTo(line.geometry, { duration: 600 }).catch(() => {});
        }
      }
    } catch (e: any) {
      setError(`Routing failed: ${e?.message ?? e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 rounded-2xl bg-white/90 p-3 shadow-soft ring-1 ring-border">
      <div className="flex gap-2">
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && geocodeAddress()}
          placeholder="Enter starting address"
          className="flex-1 rounded-xl border border-border bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={geocodeAddress}
          disabled={busy || !addressInput.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-3 text-white shadow-soft disabled:opacity-50"
          title="Search address"
        >
          <Search size={14} />
        </button>
      </div>
      <button
        onClick={useMyLocation}
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-primary ring-1 ring-border hover:bg-white disabled:opacity-50"
      >
        <LocateFixed size={13} /> Use my current location
      </button>
      {originLabel && (
        <div className="truncate rounded-lg bg-gradient-soft/40 px-2.5 py-1 text-[11px] text-foreground">
          From: <span className="font-semibold">{originLabel}</span>
        </div>
      )}

      <div>
        <div className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Mode
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {MODE_OPTIONS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-semibold transition ${
                mode === key
                  ? "bg-gradient-primary text-white shadow-soft"
                  : "bg-white text-muted-foreground ring-1 ring-border hover:bg-white"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={solveRoute}
        disabled={busy || !origin}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-primary px-3 py-2 text-xs font-bold text-white shadow-soft disabled:opacity-50"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : null}
        Get Directions
      </button>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-2.5 py-1.5 text-[11px] text-destructive">
          {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-xl bg-gradient-soft/40 px-3 py-2 text-center ring-1 ring-primary/20">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Distance
            </div>
            <div className="text-lg font-bold text-primary">{result.miles.toFixed(1)} mi</div>
          </div>
          <div className="rounded-xl bg-gradient-soft/40 px-3 py-2 text-center ring-1 ring-primary/20">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</div>
            <div className="text-lg font-bold text-primary">{formatMinutes(result.minutes)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatMinutes(mins: number) {
  const m = Math.round(mins);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h} h ${rem} min` : `${h} h`;
}