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

const ENDPOINT = "https://overpass-api.de/api/interpreter";

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function runQuery(query: string): Promise<any[]> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query),
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const json = await res.json();
  return json.elements ?? [];
}

function normalize(
  elements: any[],
  lat: number,
  lon: number,
  kind: "hotel" | "restaurant"
): Poi[] {
  return elements
    .map((el: any) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLon = el.lon ?? el.center?.lon;
      if (!elLat || !elLon) return null;
      const tags = el.tags ?? {};
      const name = tags.name || tags["name:en"];
      if (!name) return null;
      const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
      const address = [street, tags["addr:city"]].filter(Boolean).join(", ") || undefined;
      return {
        id: `${el.type}/${el.id}`,
        name,
        lat: elLat,
        lon: elLon,
        address,
        cuisine: tags.cuisine?.split(";")[0]?.replace(/_/g, " "),
        stars: tags.stars,
        distance: Math.round(haversine(lat, lon, elLat, elLon)),
        kind,
      } as Poi;
    })
    .filter((x): x is Poi => x !== null)
    .sort((a, b) => a.distance - b.distance);
}

export async function fetchHotels(
  stadiumId: string,
  lat: number,
  lon: number,
  radius = 1500
): Promise<Poi[]> {
  const key = `hotels:${stadiumId}:${radius}`;
  if (cache.has(key)) return cache.get(key)!;
  const q = `[out:json][timeout:25];
(
  node["tourism"~"hotel|guest_house|hostel"](around:${radius},${lat},${lon});
  way["tourism"~"hotel|guest_house|hostel"](around:${radius},${lat},${lon});
);
out center tags 30;`;
  const elements = await runQuery(q);
  const list = normalize(elements, lat, lon, "hotel").slice(0, 10);
  cache.set(key, list);
  return list;
}

export async function fetchRestaurants(
  stadiumId: string,
  lat: number,
  lon: number,
  radius = 1500
): Promise<Poi[]> {
  const key = `restaurants:${stadiumId}:${radius}`;
  if (cache.has(key)) return cache.get(key)!;
  const q = `[out:json][timeout:25];
(
  node["amenity"~"restaurant|cafe|fast_food"](around:${radius},${lat},${lon});
  way["amenity"~"restaurant|cafe|fast_food"](around:${radius},${lat},${lon});
);
out center tags 40;`;
  const elements = await runQuery(q);
  const list = normalize(elements, lat, lon, "restaurant").slice(0, 15);
  cache.set(key, list);
  return list;
}

export function bookingUrl(hotelName: string): string {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotelName)}`;
}

export function gmapsPlaceUrl(name: string, lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=&center=${lat},${lon}`;
}