import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stadiums, type Stadium } from "@/data/stadiums";
import type { Poi } from "@/lib/overpass";
import type { FanZone } from "@/data/fanzones";

interface Props {
  selectedId: string | null;
  onSelect: (stadium: Stadium) => void;
  flyToCity: string | null;
  pois?: Poi[];
  poiKind?: "hotels" | "eatdrink" | "fanzones" | null;
  fanzones?: FanZone[];
}

function pin(selected = false) {
  return L.divIcon({
    className: "stadium-marker-container",
    html: `<span class="stadium-marker${selected ? " is-selected" : ""}"><span>⚽</span></span>`,
    iconSize: [32, 40], iconAnchor: [16, 40],
  });
}

function popup(title: string, details: string) {
  const container = document.createElement("div");
  const heading = document.createElement("strong");
  heading.textContent = title;
  const body = document.createElement("div");
  body.textContent = details;
  container.append(heading, body);
  return container;
}

export default function StadiumMap({ selectedId, onSelect, flyToCity, pois = [], poiKind = null, fanzones = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const selectRef = useRef(onSelect);
  const [reloadKey, setReloadKey] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => { selectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setUnavailable(false);
    const map = L.map(container).setView([40, -95], 3);
    mapRef.current = map;
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      // Only request visible tiles after movement; do not prefetch or download offline.
      updateWhenIdle: true, updateWhenZooming: false, keepBuffer: 0,
    }).on("tileerror", () => setUnavailable(true)).addTo(map);
    L.control.scale({ metric: false, imperial: true }).addTo(map);
    stadiums.forEach((stadium) => {
      const marker = L.marker([stadium.latitude, stadium.longitude], {
        icon: pin(), title: stadium.name, alt: stadium.name,
        keyboard: true,
      }).on("click", () => selectRef.current(stadium)).addTo(map);
      markersRef.current.set(stadium.id, marker);
    });
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [reloadKey]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => marker.setIcon(pin(id === selectedId)));
  }, [selectedId, reloadKey]);

  useEffect(() => {
    const stadium = stadiums.find((s) => s.city === flyToCity);
    if (stadium) mapRef.current?.setView([stadium.latitude, stadium.longitude], 11, { animate: true });
  }, [flyToCity]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const group = L.layerGroup().addTo(map);
    if (poiKind === "fanzones") {
      fanzones.forEach((zone) => {
        L.marker([zone.lat, zone.lon], {
          icon: L.divIcon({ className: "poi-marker fanzone-marker", html: "", iconSize: [20, 20] }),
          title: zone.name,
        }).bindPopup(popup(zone.name, `${zone.venue} · ${zone.startDate} – ${zone.endDate}${zone.isFreeEntry ? " · Free entry" : ""}`), { maxWidth: 220 }).addTo(group);
      });
    } else if (poiKind) {
      pois.filter((poi) => poiKind === "hotels" ? poi.kind === "hotel" : poi.kind === "restaurant").forEach((poi) => {
        L.marker([poi.lat, poi.lon], {
          icon: L.divIcon({ className: `poi-marker ${poi.kind === "hotel" ? "hotel-marker" : "food-marker"}`, html: "", iconSize: [18, 18] }),
          title: poi.name,
        }).bindPopup(popup(poi.name, poi.address ?? poi.categoryLabel ?? ""), { maxWidth: 220 }).addTo(group);
      });
    }
    return () => { group.remove(); };
  }, [pois, poiKind, fanzones, reloadKey]);

  return <>
    <div ref={containerRef} className="absolute inset-0 h-full w-full" aria-label="Stadium map" />
    {unavailable && <div role="status" className="absolute left-14 top-3 z-[500] max-w-64 rounded-md bg-background p-3 text-xs text-destructive shadow-soft">OpenStreetMap tiles are unavailable. Stadium markers remain available; try Reload map later.</div>}
    <div className="absolute bottom-8 right-3 z-[500] flex gap-2">
      <Button variant="outline" size="sm" onClick={() => mapRef.current?.setView([40, -95], 3)} title="Show all stadiums">⌂</Button>
      <Button variant="outline" size="sm" onClick={() => setReloadKey((key) => key + 1)} aria-label="Reload map"><RotateCw /> Reload map</Button>
    </div>
  </>;
}
