import content from "@/data/stadium-content.json";
import type { Stadium } from "@/data/stadiums";
import type { Poi } from "@/lib/overpass";

export type PlaceCategory = "all" | "restaurant" | "cafe" | "sports_bar" | "bar" | "pub";
export interface SavedPlace extends Poi {
  sourceUrl: string;
  retrievedDate: string;
}
export const placeSnapshot = content;
export function stadiumContent(id: string) {
  return content.stadiums[id as keyof typeof content.stadiums];
}

// Great-circle distance between the stadium and the OSM point/feature center.
export function straightLineMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radians = Math.PI / 180;
  const dLat = (lat2 - lat1) * radians;
  const dLon = (lon2 - lon1) * radians;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * radians) * Math.cos(lat2 * radians) * Math.sin(dLon / 2) ** 2;
  return 3958.7613 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

const labels: Record<string, string> = { hotel: "Hotel", restaurant: "Restaurant", cafe: "Café", sports_bar: "Sports bar", bar: "Bar", pub: "Pub" };
export function listedPlaces(stadium: Stadium, kind: "hotels" | "eatdrink", radiusMiles: number, category: PlaceCategory = "all"): SavedPlace[] {
  const snapshot = stadiumContent(stadium.id);
  if (!snapshot) return [];
  return snapshot.places
    .filter((place) => kind === "hotels" ? place.category === "hotel" : place.category !== "hotel" && (category === "all" || place.category === category))
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