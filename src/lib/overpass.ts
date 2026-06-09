import { queryPlacesNearPoint, fetchPlace } from "@arcgis/core/rest/places";
import PlacesQueryParameters from "@arcgis/core/rest/support/PlacesQueryParameters";
import FetchPlaceParameters from "@arcgis/core/rest/support/FetchPlaceParameters";
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
  rating?: number; // 0-10 from Places service
  price?: number; // 1-4 ($ - $$$$)
  kind: "hotel" | "restaurant";
  categoryId?: string;
  categoryLabel?: string;
  /** finer classification for eat & drink layer */
  subKind?: "restaurant" | "sports_bar" | "cafe";
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
  searchText?: string,
): Promise<Poi[]> {
  const params = new PlacesQueryParameters({
    apiKey: esriConfig.apiKey || undefined,
    point: new Point({ longitude: lon, latitude: lat }),
    radius,
    categoryIds,
    icon: null,
    pageSize,
  });
  if (searchText) (params as any).searchText = searchText;

  const result = await queryPlacesNearPoint(params);
  const items = result.results ?? [];
  const base = items
    .map((p): Poi | null => {
      const loc = p.location;
      if (!loc) return null;
      const cat = p.categories?.[0];
      const catLabel = cat?.label;
      const catId = (cat as any)?.categoryId as string | undefined;
      let subKind: Poi["subKind"];
      if (kind === "restaurant") {
        const l = (catLabel || "").toLowerCase();
        if (catId === "13003" || l.includes("bar") || l.includes("pub")) subKind = "sports_bar";
        else if (l.includes("cafe") || l.includes("coffee")) subKind = "cafe";
        else subKind = "restaurant";
      }
      return {
        id: String(p.placeId ?? `${loc.x},${loc.y}`),
        name: p.name ?? "Unnamed",
        lat: loc.y,
        lon: loc.x,
        address: undefined,
        cuisine: kind === "restaurant" ? catLabel : undefined,
        stars: undefined,
        distance: Math.round(p.distance ?? 0),
        kind,
        categoryId: catId,
        categoryLabel: catLabel,
        subKind,
      };
    })
    .filter((x): x is Poi => x !== null)
    .sort((a, b) => a.distance - b.distance);

  // Enrich with rating / price / address via fetchPlace (one call per item, cached upstream)
  const enriched = await Promise.all(
    base.map(async (poi) => {
      try {
        const params2 = new FetchPlaceParameters({
          apiKey: esriConfig.apiKey || undefined,
          placeId: poi.id,
          requestedFields: ["address", "rating", "price"],
        });
        const detail: any = await fetchPlace(params2);
        const place = detail?.placeDetails ?? detail;
        const address = place?.address?.streetAddress ?? place?.address?.designatedMarketArea;
        const rating = typeof place?.rating?.user === "number" ? place.rating.user : undefined;
        const price = typeof place?.price === "number" ? place.price : undefined;
        return { ...poi, address, rating, price };
      } catch {
        return poi;
      }
    }),
  );
  return enriched;
}

export async function fetchHotels(
  stadiumId: string,
  lat: number,
  lon: number,
  radius = 1500,
): Promise<Poi[]> {
  const key = `hotels:${stadiumId}:${radius}`;
  return cachedPoiRequest(key, () =>
    runPlaces(lat, lon, radius, ["17000"], "hotel", 15),
  );
}

export async function fetchRestaurants(
  stadiumId: string,
  lat: number,
  lon: number,
  radius = 1500,
): Promise<Poi[]> {
  const key = `eatdrink:${stadiumId}:${radius}`;
  return cachedPoiRequest(key, () =>
    runPlaces(lat, lon, radius, ["13000", "13003"], "restaurant", 15, "sports bar"),
  );
}

export function bookingUrl(hotelName: string): string {
  return `https://www.booking.com/search.html?ss=${encodeURIComponent(hotelName)}`;
}

export function gmapsPlaceUrl(_name: string, lat: number, lon: number): string {
  return `https://maps.google.com/?q=${lat},${lon}`;
}
