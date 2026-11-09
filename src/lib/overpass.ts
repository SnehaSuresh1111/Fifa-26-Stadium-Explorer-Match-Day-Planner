export interface Poi {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  cuisine?: string;
  stars?: string;
  distance: number; // meters
  rating?: number; // 0-10 when available
  price?: number; // 1-4 ($ - $$$$)
  kind: "hotel" | "restaurant";
  categoryId?: string;
  categoryLabel?: string;
  /** finer classification for eat & drink layer */
  subKind?: "restaurant" | "sports_bar" | "cafe";
}

// No suitable bundled establishment data exists. Do not silently substitute another API.
export const PLACES_UNAVAILABLE = "Nearby places are unavailable. Live search was removed; no replacement service is connected.";
export async function fetchHotels(_stadiumId: string, _lat: number, _lon: number, _radiusMiles = 1.5): Promise<Poi[]> {
  throw new Error(PLACES_UNAVAILABLE);
}
export async function fetchRestaurants(_stadiumId: string, _lat: number, _lon: number, _radiusMiles = 1.5): Promise<Poi[]> {
  throw new Error(PLACES_UNAVAILABLE);
}

export function bookingUrl(
  hotelName: string,
  address?: string,
  lat?: number,
  lon?: number,
): string {
  const location = lat !== undefined && lon !== undefined ? `${lat},${lon}` : "";
  const query = [hotelName, address, location].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function gmapsPlaceUrl(name: string, lat: number, lon: number): string {
  const query = `${name} ${lat},${lon}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
