import { queryPlacesNearPoint } from "@arcgis/core/rest/places";
import PlacesQueryParameters from "@arcgis/core/rest/support/PlacesQueryParameters";
import Point from "@arcgis/core/geometry/Point";
import esriConfig from "@arcgis/core/config";

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
const pending = new Map<string, Promise<Poi[]>>();

function cachedPoiRequest(key: string, load: () => Promise<Poi[]>): Promise<Poi[]> {
  const cached = cache.get(key);
  if (cached) return Promise.resolve(cached);
  const existing = pending.get(key);
  if (existing) return existing;
  const request = load()
    .then((list) => {
      cache.set(key, list);
      return list;
    })
    .finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}

async function runPlaces(
  lat: number,
  lon: number,
  radius: number,
  categoryIds: string[],
  kind: "hotel" | "restaurant",
  pageSize: number,
): Promise<Poi[]> {
  const params = new PlacesQueryParameters({
    apiKey: esriConfig.apiKey || undefined,
    point: new Point({ longitude: lon, latitude: lat }),
    radius,
    categoryIds,
    icon: null,
    pageSize,
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
  return cachedPoiRequest(key, () =>
    runPlaces(lat, lon, radius, ["4bf58dd8d48988d1fa931735"], "hotel", 10),
  );
}

export async function fetchRestaurants(
  stadiumId: string,
  lat: number,
  lon: number,
  radius = 1500,
): Promise<Poi[]> {
  const key = `restaurants:${stadiumId}:${radius}`;
  return cachedPoiRequest(key, () =>
    runPlaces(lat, lon, radius, ["4d4b7105d754a06374d81259"], "restaurant", 15),
  );
}

export function bookingUrl(hotelName: string): string {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotelName)}`;
}

export function gmapsPlaceUrl(name: string, lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=&center=${lat},${lon}`;
}
