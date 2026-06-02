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

const img = (q: string) =>
  `https://source.unsplash.com/featured/800x500/?${encodeURIComponent(q)}`;

export const stadiums: Stadium[] = [
  { id: "sofi", name: "SoFi Stadium", city: "Los Angeles", country: "USA", capacity: 70240, latitude: 33.9535, longitude: -118.3392, imageUrl: img("SoFi Stadium Los Angeles") },
  { id: "metlife", name: "MetLife Stadium", city: "New York / New Jersey", country: "USA", capacity: 82500, latitude: 40.8135, longitude: -74.0745, imageUrl: img("MetLife Stadium") },
  { id: "att", name: "AT&T Stadium", city: "Dallas", country: "USA", capacity: 80000, latitude: 32.7473, longitude: -97.0945, imageUrl: img("AT&T Stadium Dallas") },
  { id: "arrowhead", name: "Arrowhead Stadium", city: "Kansas City", country: "USA", capacity: 76416, latitude: 39.0489, longitude: -94.4839, imageUrl: img("Arrowhead Stadium Kansas City") },
  { id: "mercedes", name: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", capacity: 71000, latitude: 33.7553, longitude: -84.4006, imageUrl: img("Mercedes-Benz Stadium Atlanta") },
  { id: "nrg", name: "NRG Stadium", city: "Houston", country: "USA", capacity: 72220, latitude: 29.6847, longitude: -95.4107, imageUrl: img("NRG Stadium Houston") },
  { id: "hardrock", name: "Hard Rock Stadium", city: "Miami", country: "USA", capacity: 65326, latitude: 25.958, longitude: -80.2389, imageUrl: img("Hard Rock Stadium Miami") },
  { id: "gillette", name: "Gillette Stadium", city: "Boston", country: "USA", capacity: 65878, latitude: 42.0909, longitude: -71.2643, imageUrl: img("Gillette Stadium Boston") },
  { id: "lincoln", name: "Lincoln Financial Field", city: "Philadelphia", country: "USA", capacity: 69596, latitude: 39.9008, longitude: -75.1675, imageUrl: img("Lincoln Financial Field Philadelphia") },
  { id: "levis", name: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA", capacity: 68500, latitude: 37.4032, longitude: -121.9697, imageUrl: img("Levi's Stadium Santa Clara") },
  { id: "lumen", name: "Lumen Field", city: "Seattle", country: "USA", capacity: 68740, latitude: 47.5952, longitude: -122.3316, imageUrl: img("Lumen Field Seattle") },
  { id: "bmo", name: "BMO Field", city: "Toronto", country: "Canada", capacity: 45500, latitude: 43.6332, longitude: -79.4185, imageUrl: img("BMO Field Toronto") },
  { id: "bcplace", name: "BC Place", city: "Vancouver", country: "Canada", capacity: 54500, latitude: 49.2767, longitude: -123.112, imageUrl: img("BC Place Vancouver") },
  { id: "azteca", name: "Estadio Azteca", city: "Mexico City", country: "Mexico", capacity: 87000, latitude: 19.3029, longitude: -99.1505, imageUrl: img("Estadio Azteca Mexico City") },
  { id: "akron", name: "Estadio Akron", city: "Guadalajara", country: "Mexico", capacity: 49850, latitude: 20.6818, longitude: -103.4625, imageUrl: img("Estadio Akron Guadalajara") },
  { id: "bbva", name: "Estadio BBVA", city: "Monterrey", country: "Mexico", capacity: 53500, latitude: 25.6692, longitude: -100.2444, imageUrl: img("Estadio BBVA Monterrey") },
];

export const cities = Array.from(new Set(stadiums.map((s) => s.city))).sort();