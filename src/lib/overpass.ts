import { getApiKey } from "@/lib/arcgisMapHolder";

const PLACES_BASE =
  "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places";

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
  const token = getApiKey() || "";
  const url = new URL(`${PLACES_BASE}/near-point`);
  url.searchParams.set("f", "json");
  url.searchParams.set("x", String(lon));
  url.searchParams.set("y", String(lat));
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("categoryIds", categoryIds.join(","));
  url.searchParams.set("pageSize", String(pageSize));
  if (token) url.searchParams.set("token", token);

  let items: any[] = [];
  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    items = data?.results ?? [];
  } catch (err) {
    console.error("[Places] near-point failed", { categoryIds, err });
    throw err;
  }
  const base = items
    .map((p): Poi | null => {
      const loc = p.location;
      if (!loc) return null;
      const cat = p.categories?.[0];
      const catLabel = cat?.label;
      const catId = cat?.categoryId as string | undefined;
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

  // Enrich with rating / price / address via place details (one call per item, cached upstream)
  const enriched = await Promise.all(
    base.map(async (poi) => {
      try {
        const detailUrl = new URL(`${PLACES_BASE}/${encodeURIComponent(poi.id)}`);
        detailUrl.searchParams.set("f", "json");
        detailUrl.searchParams.set("requestedFields", "address,rating,rating:price");
        if (token) detailUrl.searchParams.set("token", token);
        const detailRes = await fetch(detailUrl.toString());
        const detail: any = await detailRes.json();
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
        console.warn("[Places] place detail enrichment failed", poi.id, err);
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

export function gmapsPlaceUrl(name: string, lat: number, lon: number): string {
  const query = `${name} ${lat},${lon}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
