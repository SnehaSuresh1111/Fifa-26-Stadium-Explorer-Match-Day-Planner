export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
  capacity: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

const stadiumImages = {
  sofi: "/__l5e/assets-v1/1341c98c-8ad4-4c95-a5b1-1e283e9bebc9/sofi.webp",
  metlife: "/__l5e/assets-v1/34408482-9de0-496c-a014-011b46b87b8b/metlife.webp",
  att: "/__l5e/assets-v1/2c11851a-003a-475a-9a1e-f95a31af8821/att.webp",
  arrowhead: "/__l5e/assets-v1/e7e8eff9-6971-444e-88e5-1c47cef58992/arrowhead.webp",
  mercedes: "/__l5e/assets-v1/bd3f20c2-d6e6-41cf-81e4-6e6028be8bab/mercedes.webp",
  nrg: "/__l5e/assets-v1/cc4c9887-93d6-4f0f-b912-f5e956ae7c1c/nrg.webp",
  hardrock: "/__l5e/assets-v1/06fb7659-c211-4b3c-9621-f4f2bc33c809/hardrock.webp",
  gillette: "/__l5e/assets-v1/7afdbc5c-599c-4948-88b6-cbd26d423974/gillette.webp",
  lincoln: "/__l5e/assets-v1/4db7ceed-d5bb-4a24-bfa8-f9a361561ddc/lincoln.webp",
  levis: "/__l5e/assets-v1/a3327ca4-a70a-4ada-bdd0-d18d463c0f8d/levis.webp",
  lumen: "/__l5e/assets-v1/9530aedb-6b36-44da-8e67-a3dd6d803c89/lumen.webp",
  bmo: "/__l5e/assets-v1/15361fe2-c0d6-4924-b3a9-13efbce20860/bmo.webp",
  bcplace: "/__l5e/assets-v1/a6c025b8-1b4a-462e-9c3a-094760d65bd2/bcplace.webp",
  azteca: "/__l5e/assets-v1/d98f6c09-9ffa-49f0-80e2-42aa9aeb87e2/azteca.webp",
  akron: "/__l5e/assets-v1/74b6daa8-8ee7-4571-aee3-16d186779f70/akron.webp",
  bbva: "/__l5e/assets-v1/53666ba2-6da2-4c70-b026-d72d49cd2818/bbva.webp",
} as const;

export const stadiums: Stadium[] = [
  { id: "sofi", name: "SoFi Stadium", city: "Los Angeles", country: "USA", capacity: 70240, latitude: 33.9535, longitude: -118.3392, imageUrl: stadiumImages.sofi },
  { id: "metlife", name: "MetLife Stadium", city: "New York / New Jersey", country: "USA", capacity: 82500, latitude: 40.8135, longitude: -74.0745, imageUrl: stadiumImages.metlife },
  { id: "att", name: "AT&T Stadium", city: "Dallas", country: "USA", capacity: 80000, latitude: 32.7473, longitude: -97.0945, imageUrl: stadiumImages.att },
  { id: "arrowhead", name: "Arrowhead Stadium", city: "Kansas City", country: "USA", capacity: 76416, latitude: 39.0489, longitude: -94.4839, imageUrl: stadiumImages.arrowhead },
  { id: "mercedes", name: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", capacity: 71000, latitude: 33.7553, longitude: -84.4006, imageUrl: stadiumImages.mercedes },
  { id: "nrg", name: "NRG Stadium", city: "Houston", country: "USA", capacity: 72220, latitude: 29.6847, longitude: -95.4107, imageUrl: stadiumImages.nrg },
  { id: "hardrock", name: "Hard Rock Stadium", city: "Miami", country: "USA", capacity: 65326, latitude: 25.958, longitude: -80.2389, imageUrl: stadiumImages.hardrock },
  { id: "gillette", name: "Gillette Stadium", city: "Boston", country: "USA", capacity: 65878, latitude: 42.0909, longitude: -71.2643, imageUrl: stadiumImages.gillette },
  { id: "lincoln", name: "Lincoln Financial Field", city: "Philadelphia", country: "USA", capacity: 69596, latitude: 39.9008, longitude: -75.1675, imageUrl: stadiumImages.lincoln },
  { id: "levis", name: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA", capacity: 68500, latitude: 37.4032, longitude: -121.9697, imageUrl: stadiumImages.levis },
  { id: "lumen", name: "Lumen Field", city: "Seattle", country: "USA", capacity: 68740, latitude: 47.5952, longitude: -122.3316, imageUrl: stadiumImages.lumen },
  { id: "bmo", name: "BMO Field", city: "Toronto", country: "Canada", capacity: 45500, latitude: 43.6332, longitude: -79.4185, imageUrl: stadiumImages.bmo },
  { id: "bcplace", name: "BC Place", city: "Vancouver", country: "Canada", capacity: 54500, latitude: 49.2767, longitude: -123.112, imageUrl: stadiumImages.bcplace },
  { id: "azteca", name: "Estadio Azteca", city: "Mexico City", country: "Mexico", capacity: 87000, latitude: 19.3029, longitude: -99.1505, imageUrl: stadiumImages.azteca },
  { id: "akron", name: "Estadio Akron", city: "Guadalajara", country: "Mexico", capacity: 49850, latitude: 20.6818, longitude: -103.4625, imageUrl: stadiumImages.akron },
  { id: "bbva", name: "Estadio BBVA", city: "Monterrey", country: "Mexico", capacity: 53500, latitude: 25.6692, longitude: -100.2444, imageUrl: stadiumImages.bbva },
];

export const cities = Array.from(new Set(stadiums.map((s) => s.city))).sort();