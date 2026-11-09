import content from "@/data/stadium-content.json";
import type { Stadium } from "@/data/stadiums";
import type { Poi } from "@/lib/overpass";

export type PlaceCategory = "all" | "restaurant" | "cafe" | "sports_bar" | "bar" | "pub";
export interface RawPlace {
  id: string; name: string; category: string; lat: number; lon: number; sourceUrl: string;
  address?: string; website?: string; cuisine?: string; stars?: string;
}
export interface SavedPlace extends Poi {
  sourceUrl: string;
  website?: string;
}
export const placeSnapshot = content;
export function stadiumContent(id: string) {
  return content.stadiums[id as keyof typeof content.stadiums];
}

// One file per stadium, loaded only when that stadium is opened (the full snapshot is ~2 MB).
const loaders: Record<string, () => Promise<{ default: RawPlace[] }>> = {
  sofi: () => import("../data/places/sofi.json"),
  metlife: () => import("../data/places/metlife.json"),
  att: () => import("../data/places/att.json"),
  arrowhead: () => import("../data/places/arrowhead.json"),
  mercedes: () => import("../data/places/mercedes.json"),
  nrg: () => import("../data/places/nrg.json"),
  hardrock: () => import("../data/places/hardrock.json"),
  gillette: () => import("../data/places/gillette.json"),
  lincoln: () => import("../data/places/lincoln.json"),
  levis: () => import("../data/places/levis.json"),
  lumen: () => import("../data/places/lumen.json"),
  bmo: () => import("../data/places/bmo.json"),
  bcplace: () => import("../data/places/bcplace.json"),
  azteca: () => import("../data/places/azteca.json"),
  akron: () => import("../data/places/akron.json"),
  bbva: () => import("../data/places/bbva.json"),
};
export async function loadStadiumPlaces(id: string): Promise<RawPlace[]> {
  const load = loaders[id];
  if (!load) return [];
  return (await load()).default;
}

// Great-circle distance between the stadium and the OSM point/feature center.
export function straightLineMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radians = Math.PI / 180;
  const dLat = (lat2 - lat1) * radians;
  const dLon = (lon2 - lon1) * radians;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * radians) * Math.cos(lat2 * radians) * Math.sin(dLon / 2) ** 2;
  return 3958.7613 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

export function placesOfKind(places: RawPlace[], kind: "hotels" | "eatdrink") {
  return places.filter((place) => (kind === "hotels") === (place.category === "hotel"));
}

export function mapSearchUrl(stadium: Stadium, kind: "hotels" | "eatdrink") {
  const query = `${kind === "hotels" ? "hotels" : "restaurants"} near ${stadium.name}, ${stadium.city}`;
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}#map=15/${stadium.latitude}/${stadium.longitude}`;
}

const labels: Record<string, string> = { hotel: "Hotel", restaurant: "Restaurant", cafe: "Café", sports_bar: "Sports bar", bar: "Bar", pub: "Pub" };
export function listedPlaces(stadium: Stadium, places: RawPlace[], kind: "hotels" | "eatdrink", radiusMiles: number, category: PlaceCategory = "all"): SavedPlace[] {
  return placesOfKind(places, kind)
    .filter((place) => kind === "hotels" || category === "all" || place.category === category)
    .map((place): SavedPlace => ({
      ...place,
      kind: place.category === "hotel" ? "hotel" : "restaurant",
      categoryId: place.category,
      categoryLabel: labels[place.category] ?? place.category,
      distance: straightLineMiles(stadium.latitude, stadium.longitude, place.lat, place.lon) * 1609.344,
    }))
    .filter((place) => place.distance <= radiusMiles * 1609.344)
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name));
}
