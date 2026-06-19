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
  distance: number; // meters from ArcGIS Places
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
const METERS_PER_MILE = 1609.344;
const CATEGORY_LODGING = "63be6904847c3692a84b9c25";
const CATEGORY_DINING_DRINKING = "63be6904847c3692a84b9bb5";
const CATEGORY_SPORTS_BAR = "4bf58dd8d48988d11d941735";

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

  let result;
  try {
    result = await queryPlacesNearPoint(params);
  } catch (err) {
    console.error("[Places] queryPlacesNearPoint failed", { categoryIds, err });
    throw err;
  }
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
        if (catId === CATEGORY_SPORTS_BAR || l.includes("sports bar")) subKind = "sports_bar";
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
          requestedFields: ["address", "rating", "rating:price"],
        });
        const detail: any = await fetchPlace(params2);
        const place = detail?.placeDetails ?? detail;
        const address = place?.address?.streetAddress ?? place?.address?.designatedMarketArea;
        const rating = typeof place?.rating?.user === "number" ? place.rating.user : undefined;
        const price =
          typeof place?.rating?.price === "number"
            ? place.rating.price
            : typeof place?.price === "number"
              ? place.price
              : undefined;
        return { ...poi, address, rating, price };
      } catch (err) {
        console.warn("[Places] fetchPlace enrichment failed", poi.id, err);
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
  radiusMiles = 1.5,
): Promise<Poi[]> {
  const radiusMeters = Math.round(radiusMiles * METERS_PER_MILE);
  const key = `hotels:${stadiumId}:${radiusMiles}`;
  return cachedPoiRequest(key, () =>
    runPlaces(lat, lon, radiusMeters, [CATEGORY_LODGING], "hotel", 15),
  );
}

export async function fetchRestaurants(
  stadiumId: string,
  lat: number,
  lon: number,
  radiusMiles = 1.5,
): Promise<Poi[]> {
  const radiusMeters = Math.round(radiusMiles * METERS_PER_MILE);
  const key = `eatdrink:${stadiumId}:${radiusMiles}`;
  return cachedPoiRequest(key, () =>
    runPlaces(lat, lon, radiusMeters, [CATEGORY_DINING_DRINKING], "restaurant", 20),
  );
}

export function bookingUrl(
  hotelName: string,
  address?: string,
  lat?: number,
  lon?: number,
): string {
  // Use a normal Google search result for the hotel, not the Google Travel app,
  // because Travel can show an error when launched from embedded previews.
  const location = lat !== undefined && lon !== undefined ? `${lat},${lon}` : "";
  const query = [hotelName, address, location, "hotel prices"].filter(Boolean).join(" ");
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function gmapsPlaceUrl(_name: string, lat: number, lon: number): string {
  return `https://maps.google.com/?q=${lat},${lon}`;
}
