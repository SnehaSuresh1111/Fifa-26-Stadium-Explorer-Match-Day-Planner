import { queryPlacesNearPoint } from "@arcgis/core/rest/places";
import PlacesQueryParameters from "@arcgis/core/rest/support/PlacesQueryParameters";
import Point from "@arcgis/core/geometry/Point";

export interface Poi {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  cuisine?: string;
  stars?: string;
  distance: number; // metres
  kind: "hotel" | "restaurant";
}

const cache = new Map<string, Poi[]>();

async function runPlaces(
  lat: number,
  lon: number,
  radius: number,
  categoryIds: string[],
  kind: "hotel" | "restaurant",
): Promise<Poi[]> {
  const params = new PlacesQueryParameters({
    apiKey: esriConfig.apiKey || undefined,
    point: new Point({ longitude: lon, latitude: lat }),
    radius,
    categoryIds,
    icon: null,
    pageSize: 20,
  });

  const result = await queryPlacesNearPoint(params);
  const items = result.results ?? [];
  return items
    .map((p): Poi | null => {
      const loc = p.location;
      if (!loc) return null;
      const cat = p.categories?.[0]?.label;
      return {
        id: String(p.placeId ?? `${loc.x},${loc.y}`),
        name: p.name ?? "Unnamed",
        lat: loc.y,
        lon: loc.x,
        address: undefined,
        cuisine: kind === "restaurant" ? cat : undefined,
        stars: undefined,
        distance: Math.round(p.distance ?? 0),
        kind,
      };
    })
    .filter((x): x is Poi => x !== null)
    .sort((a, b) => a.distance - b.distance);
}

export async function fetchHotels(
  stadiumId: string,
  lat: number,
  lon: number,
  radius = 1500,
): Promise<Poi[]> {
  const key = `hotels:${stadiumId}:${radius}`;
  if (cache.has(key)) return cache.get(key)!;
  // ArcGIS Places category: Travel and Transportation > Lodging > Hotel
  const list = (await runPlaces(lat, lon, radius, ["4bf58dd8d48988d1fa931735"], "hotel")).slice(0, 10);
  cache.set(key, list);
  return list;
}

export async function fetchRestaurants(
  stadiumId: string,
  lat: number,
  lon: number,
  radius = 1500,
): Promise<Poi[]> {
  const key = `restaurants:${stadiumId}:${radius}`;
  if (cache.has(key)) return cache.get(key)!;
  // ArcGIS Places category: Dining and Drinking > Restaurant
  const list = (await runPlaces(lat, lon, radius, ["4d4b7105d754a06374d81259"], "restaurant")).slice(0, 15);
  cache.set(key, list);
  return list;
}

export function bookingUrl(hotelName: string): string {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotelName)}`;
}

export function gmapsPlaceUrl(name: string, lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=&center=${lat},${lon}`;
}
