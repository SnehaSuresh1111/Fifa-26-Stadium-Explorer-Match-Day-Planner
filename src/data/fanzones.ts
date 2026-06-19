export interface FanZone {
  id: string;
  cityId: string; // matches stadium.city
  name: string;
  venue: string;
  address: string;
  lat: number;
  lon: number;
  startDate: string; // ISO
  endDate: string;
  hours: string;
  description: string;
  isFreeEntry: boolean;
}

export const fanzones: FanZone[] = [
  {
    id: "nyc-liberty",
    cityId: "New York / New Jersey",
    name: "FIFA Fan Festival NY/NJ",
    venue: "Liberty State Park",
    address: "Morris Pesin Dr, Jersey City, NJ",
    lat: 40.7048,
    lon: -74.0521,
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    hours: "12:00 – 22:00 daily",
    description: "Skyline views, watch parties and concerts in the shadow of the Statue of Liberty.",
    isFreeEntry: true,
  },
  {
    id: "dal-fairpark",
    cityId: "Dallas",
    name: "FIFA Fan Festival Dallas",
    venue: "Fair Park",
    address: "1300 Robert B Cullum Blvd, Dallas, TX",
    lat: 32.7811,
    lon: -96.7635,
    startDate: "2026-06-14",
    endDate: "2026-07-14",
    hours: "13:00 – 23:00 daily",
    description: "Texas-sized watch parties, BBQ vendors and live entertainment.",
    isFreeEntry: true,
  },
  {
    id: "kc-natlwwi",
    cityId: "Kansas City",
    name: "FIFA Fan Festival Kansas City",
    venue: "National WWI Museum Lawn",
    address: "2 Memorial Dr, Kansas City, MO",
    lat: 39.0823,
    lon: -94.5853,
    startDate: "2026-06-16",
    endDate: "2026-07-08",
    hours: "12:00 – 22:00 daily",
    description: "Open-air watch parties beside Liberty Memorial with food and local music.",
    isFreeEntry: true,
  },
  {
    id: "atl-centennial",
    cityId: "Atlanta",
    name: "FIFA Fan Festival Atlanta",
    venue: "Centennial Olympic Park",
    address: "265 Park Ave W NW, Atlanta, GA",
    lat: 33.7615,
    lon: -84.3931,
    startDate: "2026-06-15",
    endDate: "2026-07-15",
    hours: "12:00 – 22:00 daily",
    description: "Downtown festival in the iconic 1996 Olympics park.",
    isFreeEntry: true,
  },
  {
    id: "hou-discovery",
    cityId: "Houston",
    name: "FIFA Fan Festival Houston",
    venue: "Discovery Green",
    address: "1500 McKinney St, Houston, TX",
    lat: 29.7531,
    lon: -95.3585,
    startDate: "2026-06-14",
    endDate: "2026-07-07",
    hours: "12:00 – 22:00 daily",
    description: "Downtown park watch parties with Tex-Mex food vendors.",
    isFreeEntry: true,
  },
  {
    id: "mia-bayfront",
    cityId: "Miami",
    name: "FIFA Fan Festival Miami",
    venue: "Bayfront Park",
    address: "301 Biscayne Blvd, Miami, FL",
    lat: 25.7753,
    lon: -80.1862,
    startDate: "2026-06-15",
    endDate: "2026-07-19",
    hours: "13:00 – 23:00 daily",
    description: "Bayside fan zone with Latin music stages and beach vibes.",
    isFreeEntry: true,
  },
  {
    id: "bos-cityhall",
    cityId: "Boston",
    name: "FIFA Fan Festival Boston",
    venue: "City Hall Plaza",
    address: "1 City Hall Square, Boston, MA",
    lat: 42.3601,
    lon: -71.0589,
    startDate: "2026-06-13",
    endDate: "2026-07-09",
    hours: "12:00 – 22:00 daily",
    description: "Central plaza takeover with food trucks and live stages.",
    isFreeEntry: true,
  },
  {
    id: "phi-parkway",
    cityId: "Philadelphia",
    name: "FIFA Fan Festival Philadelphia",
    venue: "Benjamin Franklin Parkway",
    address: "Benjamin Franklin Pkwy, Philadelphia, PA",
    lat: 39.9614,
    lon: -75.1719,
    startDate: "2026-06-14",
    endDate: "2026-07-04",
    hours: "11:00 – 22:00 daily",
    description: "Iconic parkway watch zone leading to the Art Museum steps.",
    isFreeEntry: true,
  },
  {
    id: "sf-embarcadero",
    cityId: "San Francisco Bay Area",
    name: "FIFA Fan Festival Bay Area",
    venue: "Embarcadero / Ferry Building Plaza",
    address: "1 Ferry Building, San Francisco, CA",
    lat: 37.7955,
    lon: -122.3937,
    startDate: "2026-06-13",
    endDate: "2026-07-12",
    hours: "12:00 – 22:00 daily",
    description: "Waterfront fan zone with Bay Bridge views and Bay Area food vendors.",
    isFreeEntry: true,
  },
  {
    id: "sea-seattlecenter",
    cityId: "Seattle",
    name: "FIFA Fan Festival Seattle",
    venue: "Seattle Center",
    address: "305 Harrison St, Seattle, WA",
    lat: 47.6219,
    lon: -122.3517,
    startDate: "2026-06-15",
    endDate: "2026-07-06",
    hours: "12:00 – 22:00 daily",
    description: "Festival under the Space Needle with PNW food and music.",
    isFreeEntry: true,
  },
  {
    id: "tor-nathanphillips",
    cityId: "Toronto",
    name: "FIFA Fan Festival Toronto",
    venue: "Nathan Phillips Square",
    address: "100 Queen St W, Toronto, ON",
    lat: 43.6526,
    lon: -79.3838,
    startDate: "2026-06-12",
    endDate: "2026-07-02",
    hours: "11:00 – 22:00 daily",
    description: "City Hall plaza becomes the heart of Toronto's matchday celebrations.",
    isFreeEntry: true,
  },
  {
    id: "van-jackpoole",
    cityId: "Vancouver",
    name: "FIFA Fan Festival Vancouver",
    venue: "Jack Poole Plaza",
    address: "1055 Canada Pl, Vancouver, BC",
    lat: 49.2889,
    lon: -123.1163,
    startDate: "2026-06-13",
    endDate: "2026-07-07",
    hours: "12:00 – 22:00 daily",
    description: "Waterfront fan zone next to the Olympic Cauldron.",
    isFreeEntry: true,
  },
  {
    id: "mex-zocalo",
    cityId: "Mexico City",
    name: "FIFA Fan Festival Ciudad de México",
    venue: "Zócalo (Plaza de la Constitución)",
    address: "Plaza de la Constitución, CDMX",
    lat: 19.4326,
    lon: -99.1332,
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    hours: "12:00 – 23:00 daily",
    description: "Mexico's grand central square hosts the country's biggest fan festival.",
    isFreeEntry: true,
  },
  {
    id: "gdl-platainsurg",
    cityId: "Guadalajara",
    name: "FIFA Fan Festival Guadalajara",
    venue: "Plaza de la Liberación",
    address: "Av. Hidalgo, Centro, Guadalajara",
    lat: 20.6776,
    lon: -103.3434,
    startDate: "2026-06-11",
    endDate: "2026-07-03",
    hours: "12:00 – 23:00 daily",
    description: "Historic downtown plaza hosts mariachi-fuelled watch parties.",
    isFreeEntry: true,
  },
  {
    id: "mty-macroplaza",
    cityId: "Monterrey",
    name: "FIFA Fan Festival Monterrey",
    venue: "Macroplaza",
    address: "Macroplaza, Centro, Monterrey",
    lat: 25.6694,
    lon: -100.3098,
    startDate: "2026-06-14",
    endDate: "2026-06-29",
    hours: "13:00 – 23:00 daily",
    description: "One of the world's largest plazas turns into Monterrey's match HQ.",
    isFreeEntry: true,
  },
  // ─── Additional fan zones per city ─────────────────────────────────────
  // Los Angeles
  { id: "la-farmersmarket", cityId: "Los Angeles", name: "The Original Farmers Market", venue: "The Original Farmers Market", address: "6333 W 3rd St, Los Angeles, CA", lat: 34.0721, lon: -118.3603, startDate: "2026-06-18", endDate: "2026-06-21", hours: "Festival hours", description: "Official LA World Cup 26 fan zone with watch parties, food and family activations at the iconic Farmers Market.", isFreeEntry: true },
  { id: "la-downey", cityId: "Los Angeles", name: "City of Downey Fan Zone", venue: "City of Downey", address: "Downey, CA", lat: 33.9401, lon: -118.1332, startDate: "2026-06-20", endDate: "2026-06-20", hours: "Festival hours", description: "One-day LA World Cup 26 fan zone in the City of Downey.", isFreeEntry: true },
  { id: "la-unionstation", cityId: "Los Angeles", name: "The Heart of the City: LA Union Station", venue: "Los Angeles Union Station", address: "800 N Alameda St, Los Angeles, CA", lat: 34.0560, lon: -118.2365, startDate: "2026-06-25", endDate: "2026-06-28", hours: "Festival hours", description: "Downtown LA fan zone at historic Union Station — watch parties, live music and cultural programming.", isFreeEntry: true },
  { id: "la-hansendam", cityId: "Los Angeles", name: "Hansen Dam Lake Fan Zone", venue: "Hansen Dam Recreation Area", address: "11770 Foothill Blvd, Lake View Terrace, CA", lat: 34.2614, lon: -118.3879, startDate: "2026-07-02", endDate: "2026-07-05", hours: "Festival hours", description: "Lakeside San Fernando Valley fan zone with screens, food and July 4 activities.", isFreeEntry: true },
  { id: "la-magicjohnson", cityId: "Los Angeles", name: "LA County's Earvin \"Magic\" Johnson Park", venue: "Earvin \"Magic\" Johnson Park", address: "905 E El Segundo Blvd, Los Angeles, CA", lat: 33.9180, lon: -118.2470, startDate: "2026-07-04", endDate: "2026-07-05", hours: "Festival hours", description: "South LA fan zone in Magic Johnson Park with watch parties and community programming.", isFreeEntry: true },
  { id: "la-whittiernarrows", cityId: "Los Angeles", name: "LA County Whittier Narrows", venue: "Whittier Narrows Recreation Area", address: "750 S Santa Anita Ave, South El Monte, CA", lat: 34.0405, lon: -118.0540, startDate: "2026-07-09", endDate: "2026-07-11", hours: "Festival hours", description: "San Gabriel Valley fan zone at Whittier Narrows with screens, food and family activities.", isFreeEntry: true },
  { id: "la-venice", cityId: "Los Angeles", name: "Venice Beach Fan Zone", venue: "Venice Beach", address: "1800 Ocean Front Walk, Venice, CA", lat: 33.9850, lon: -118.4695, startDate: "2026-07-10", endDate: "2026-07-11", hours: "Festival hours", description: "Beachfront fan zone on the Venice boardwalk with screens, music and street culture.", isFreeEntry: true },
  { id: "la-fairplex", cityId: "Los Angeles", name: "Fairplex Fan Zone", venue: "Fairplex Pomona", address: "1101 W McKinley Ave, Pomona, CA", lat: 34.0856, lon: -117.7706, startDate: "2026-07-14", endDate: "2026-07-19", hours: "Jul 14-15 & Jul 18-19", description: "East LA County fan zone at Fairplex Pomona over the final knockout weekends.", isFreeEntry: true },
  { id: "la-westharbor", cityId: "Los Angeles", name: "West Harbor Fan Zone", venue: "West Harbor San Pedro", address: "Sampson Way, San Pedro, CA", lat: 33.7370, lon: -118.2780, startDate: "2026-07-14", endDate: "2026-07-19", hours: "Jul 14-15 & Jul 18-19", description: "Waterfront fan zone at San Pedro's West Harbor with screens, food and live entertainment.", isFreeEntry: true },
  { id: "la-burbank", cityId: "Los Angeles", name: "Downtown Burbank Fan Zone", venue: "Downtown Burbank", address: "Downtown Burbank, CA", lat: 34.1808, lon: -118.3090, startDate: "2026-07-18", endDate: "2026-07-19", hours: "Festival hours", description: "Final-weekend fan zone in Downtown Burbank with watch parties and street activations.", isFreeEntry: true },

  // New York / New Jersey
  { id: "nyc-bryantpark", cityId: "New York / New Jersey", name: "Bryant Park Fan Zone", venue: "Bryant Park", address: "W 42nd St & 6th Ave, New York, NY", lat: 40.7536, lon: -73.9832, startDate: "2026-06-12", endDate: "2026-07-19", hours: "11:00 – 22:00 daily", description: "Midtown lawn screenings with food kiosks and family games.", isFreeEntry: true },
  { id: "nyc-brooklyn", cityId: "New York / New Jersey", name: "Brooklyn Bridge Park Watch Zone", venue: "Brooklyn Bridge Park, Pier 2", address: "Furman St, Brooklyn, NY", lat: 40.7011, lon: -73.9968, startDate: "2026-06-14", endDate: "2026-07-09", hours: "13:00 – 22:00 matchdays", description: "Waterfront screen with Manhattan skyline backdrop.", isFreeEntry: true },
  { id: "njy-newark", cityId: "New York / New Jersey", name: "Newark Fan Festival", venue: "Mulberry Commons", address: "29 Edison Pl, Newark, NJ", lat: 40.7341, lon: -74.1681, startDate: "2026-06-13", endDate: "2026-07-04", hours: "12:00 – 22:00 daily", description: "Downtown Newark watch zone steps from Prudential Center.", isFreeEntry: true },

  // Dallas
  { id: "dal-klyde", cityId: "Dallas", name: "Klyde Warren Park Fan Zone", venue: "Klyde Warren Park", address: "2012 Woodall Rodgers Fwy, Dallas, TX", lat: 32.7894, lon: -96.8016, startDate: "2026-06-14", endDate: "2026-07-14", hours: "11:00 – 22:00 daily", description: "Urban park watch parties with food trucks and lawn games.", isFreeEntry: true },
  { id: "dal-sundance", cityId: "Dallas", name: "Sundance Square Fort Worth", venue: "Sundance Square Plaza", address: "420 Main St, Fort Worth, TX", lat: 32.7531, lon: -97.3326, startDate: "2026-06-16", endDate: "2026-07-08", hours: "12:00 – 23:00 matchdays", description: "Fort Worth's central plaza takes over with big screens and live music.", isFreeEntry: true },

  // Kansas City
  { id: "kc-powerlight", cityId: "Kansas City", name: "Power & Light District Fan Zone", venue: "KC Live! Block", address: "1377 Grand Blvd, Kansas City, MO", lat: 39.0997, lon: -94.5832, startDate: "2026-06-16", endDate: "2026-07-08", hours: "12:00 – 02:00 matchdays", description: "Covered outdoor entertainment district with massive LED canopy screen.", isFreeEntry: true },
  { id: "kc-cpark", cityId: "Kansas City", name: "Country Club Plaza Watch Party", venue: "Country Club Plaza", address: "4750 Broadway Blvd, Kansas City, MO", lat: 39.0427, lon: -94.5919, startDate: "2026-06-18", endDate: "2026-07-05", hours: "13:00 – 22:00 matchdays", description: "Spanish-style plaza hosts evening watch parties with fountain views.", isFreeEntry: true },

  // Atlanta
  { id: "atl-piedmont", cityId: "Atlanta", name: "Piedmont Park Watch Party", venue: "Piedmont Park – Oak Hill", address: "400 Park Dr NE, Atlanta, GA", lat: 33.7851, lon: -84.3739, startDate: "2026-06-15", endDate: "2026-07-15", hours: "13:00 – 22:00 matchdays", description: "Open lawn screenings with food trucks lining the park edges.", isFreeEntry: true },
  { id: "atl-pondersouth", cityId: "Atlanta", name: "Ponce City Market Rooftop Zone", venue: "Ponce City Market", address: "675 Ponce De Leon Ave NE, Atlanta, GA", lat: 33.7723, lon: -84.3656, startDate: "2026-06-17", endDate: "2026-07-10", hours: "16:00 – 24:00 matchdays", description: "Rooftop watch parties with Beltline views and local craft food halls.", isFreeEntry: false },

  // Houston
  { id: "hou-eado", cityId: "Houston", name: "East Downtown (EaDo) Fan Zone", venue: "Avenida Houston", address: "1001 Avenida de las Americas, Houston, TX", lat: 29.7510, lon: -95.3578, startDate: "2026-06-14", endDate: "2026-07-07", hours: "12:00 – 23:00 daily", description: "Convention district plaza with big screens steps from the light rail.", isFreeEntry: true },
  { id: "hou-buffalobayou", cityId: "Houston", name: "Buffalo Bayou Park Lawn", venue: "Buffalo Bayou Park", address: "1800 Allen Pkwy, Houston, TX", lat: 29.7600, lon: -95.3850, startDate: "2026-06-16", endDate: "2026-07-02", hours: "17:00 – 23:00 matchdays", description: "Riverside watch parties with skyline views and kayak rentals.", isFreeEntry: true },

  // Miami
  { id: "mia-wynwood", cityId: "Miami", name: "Wynwood Fan Zone", venue: "Wynwood Walls Plaza", address: "266 NW 26th St, Miami, FL", lat: 25.8011, lon: -80.1991, startDate: "2026-06-15", endDate: "2026-07-19", hours: "14:00 – 24:00 matchdays", description: "Street-art district turns into Miami's nightlife-driven watch zone.", isFreeEntry: true },
  { id: "mia-miamibeach", cityId: "Miami", name: "Miami Beach Fan Festival", venue: "Lummus Park Beachfront", address: "Ocean Dr, Miami Beach, FL", lat: 25.7825, lon: -80.1300, startDate: "2026-06-18", endDate: "2026-07-12", hours: "12:00 – 23:00 daily", description: "South Beach watch zone with sand-side screens and Latin DJs.", isFreeEntry: true },
  { id: "mia-hardrockplaza", cityId: "Miami", name: "Hard Rock Stadium Plaza", venue: "Hard Rock Stadium North Plaza", address: "347 Don Shula Dr, Miami Gardens, FL", lat: 25.9580, lon: -80.2389, startDate: "2026-06-15", endDate: "2026-07-19", hours: "Matchdays only", description: "Pre-match plaza with sponsor activations and live entertainment.", isFreeEntry: true },

  // Boston
  { id: "bos-commons", cityId: "Boston", name: "Boston Common Watch Party", venue: "Boston Common Parade Ground", address: "139 Tremont St, Boston, MA", lat: 42.3554, lon: -71.0656, startDate: "2026-06-13", endDate: "2026-07-09", hours: "12:00 – 22:00 daily", description: "Historic Common hosts the city's largest open-air screenings.", isFreeEntry: true },
  { id: "bos-seaport", cityId: "Boston", name: "Seaport Common Fan Zone", venue: "Seaport Common", address: "85 Northern Ave, Boston, MA", lat: 42.3517, lon: -71.0445, startDate: "2026-06-15", endDate: "2026-07-04", hours: "13:00 – 23:00 matchdays", description: "Waterfront plaza with food halls, beer garden and big screen.", isFreeEntry: true },

  // Philadelphia
  { id: "phi-loverpark", cityId: "Philadelphia", name: "LOVE Park Fan Zone", venue: "John F. Kennedy Plaza", address: "1599 John F Kennedy Blvd, Philadelphia, PA", lat: 39.9544, lon: -75.1652, startDate: "2026-06-14", endDate: "2026-07-04", hours: "12:00 – 22:00 daily", description: "Iconic LOVE statue plaza with watch screens and food kiosks.", isFreeEntry: true },
  { id: "phi-dilworth", cityId: "Philadelphia", name: "Dilworth Park", venue: "Dilworth Park (City Hall)", address: "1 S 15th St, Philadelphia, PA", lat: 39.9526, lon: -75.1665, startDate: "2026-06-16", endDate: "2026-07-02", hours: "11:00 – 22:00 matchdays", description: "City Hall plaza fan zone with fountains and street vendors.", isFreeEntry: true },

  // San Francisco Bay Area
  { id: "sf-civic", cityId: "San Francisco Bay Area", name: "Civic Center Plaza Fan Zone", venue: "Civic Center Plaza", address: "355 McAllister St, San Francisco, CA", lat: 37.7793, lon: -122.4193, startDate: "2026-06-13", endDate: "2026-07-12", hours: "12:00 – 22:00 daily", description: "Grand plaza screenings outside City Hall with food trucks.", isFreeEntry: true },
  { id: "sf-sjplaza", cityId: "San Francisco Bay Area", name: "San Jose Plaza de César Chávez", venue: "Plaza de César Chávez", address: "194 S Market St, San José, CA", lat: 37.3327, lon: -121.8893, startDate: "2026-06-15", endDate: "2026-07-08", hours: "12:00 – 22:00 daily", description: "South Bay's main watch zone in downtown San José.", isFreeEntry: true },
  { id: "sf-levisplaza", cityId: "San Francisco Bay Area", name: "Levi's Stadium Tailgate Zone", venue: "Levi's Stadium Red Lot", address: "4900 Marie P DeBartolo Way, Santa Clara, CA", lat: 37.4032, lon: -121.9697, startDate: "2026-06-13", endDate: "2026-07-12", hours: "Matchdays only", description: "Pre-match tailgate plaza with screens, BBQs and sponsor zones.", isFreeEntry: true },

  // Seattle
  { id: "sea-occidental", cityId: "Seattle", name: "Occidental Square Watch Party", venue: "Occidental Square Pioneer Square", address: "117 S Washington St, Seattle, WA", lat: 47.6010, lon: -122.3329, startDate: "2026-06-15", endDate: "2026-07-06", hours: "12:00 – 22:00 matchdays", description: "Pioneer Square's brick plaza hosts intimate watch parties.", isFreeEntry: true },
  { id: "sea-pikeplace", cityId: "Seattle", name: "Pike Place MarketFront", venue: "Pike Place MarketFront", address: "85 Pike St, Seattle, WA", lat: 47.6097, lon: -122.3425, startDate: "2026-06-16", endDate: "2026-07-02", hours: "13:00 – 21:00 matchdays", description: "Waterfront market plaza with screens and Elliott Bay views.", isFreeEntry: true },

  // Toronto
  { id: "tor-distillery", cityId: "Toronto", name: "Distillery District Fan Zone", venue: "Distillery Historic District", address: "55 Mill St, Toronto, ON", lat: 43.6503, lon: -79.3599, startDate: "2026-06-13", endDate: "2026-07-02", hours: "14:00 – 23:00 matchdays", description: "Cobblestone village transformed into a covered watch quarter.", isFreeEntry: true },
  { id: "tor-harbourfront", cityId: "Toronto", name: "Harbourfront Centre", venue: "Harbourfront Centre", address: "235 Queens Quay W, Toronto, ON", lat: 43.6386, lon: -79.3816, startDate: "2026-06-14", endDate: "2026-07-04", hours: "12:00 – 22:00 daily", description: "Lakeshore stages, food markets and a giant screen by Lake Ontario.", isFreeEntry: true },
  { id: "tor-bmoplaza", cityId: "Toronto", name: "BMO Field Pre-Match Plaza", venue: "Exhibition Place", address: "100 Princes' Blvd, Toronto, ON", lat: 43.6332, lon: -79.4185, startDate: "2026-06-12", endDate: "2026-07-02", hours: "Matchdays only", description: "Pre-match grounds at Exhibition Place with screens and food halls.", isFreeEntry: true },

  // Vancouver
  { id: "van-thesquare", cityId: "Vancouver", name: "The Šxʷƛ̓ənəq Xwtl'e7énḵ Square", venue: "Vancouver Art Gallery North Plaza", address: "750 Hornby St, Vancouver, BC", lat: 49.2828, lon: -123.1207, startDate: "2026-06-13", endDate: "2026-07-07", hours: "11:00 – 22:00 daily", description: "Downtown plaza screenings with First Nations cultural programming.", isFreeEntry: true },
  { id: "van-granville", cityId: "Vancouver", name: "Granville Island Fan Zone", venue: "Granville Island Public Market Plaza", address: "1689 Johnston St, Vancouver, BC", lat: 49.2710, lon: -123.1340, startDate: "2026-06-15", endDate: "2026-07-04", hours: "12:00 – 21:00 matchdays", description: "Island market hosts intimate watch parties under False Creek bridges.", isFreeEntry: true },

  // Mexico City
  { id: "mex-reforma", cityId: "Mexico City", name: "Paseo de la Reforma Fan Walk", venue: "Ángel de la Independencia", address: "Av. P.º de la Reforma, CDMX", lat: 19.4267, lon: -99.1677, startDate: "2026-06-11", endDate: "2026-07-19", hours: "12:00 – 23:00 daily", description: "Iconic boulevard fan walk with stages along Reforma's roundabouts.", isFreeEntry: true },
  { id: "mex-azteca", cityId: "Mexico City", name: "Estadio Azteca Plaza Fan Fest", venue: "Explanada Estadio Azteca", address: "Calzada de Tlalpan 3465, CDMX", lat: 19.3029, lon: -99.1505, startDate: "2026-06-11", endDate: "2026-07-19", hours: "Matchdays only", description: "Stadium-side plaza with mariachi stages and tequila tasting.", isFreeEntry: true },
  { id: "mex-coyoacan", cityId: "Mexico City", name: "Coyoacán Centro Watch Zone", venue: "Jardín Hidalgo, Coyoacán", address: "Jardín Hidalgo, Coyoacán, CDMX", lat: 19.3500, lon: -99.1626, startDate: "2026-06-13", endDate: "2026-07-15", hours: "13:00 – 23:00 matchdays", description: "Bohemian neighbourhood plaza with screens and street food.", isFreeEntry: true },

  // Guadalajara
  { id: "gdl-chapultepec", cityId: "Guadalajara", name: "Avenida Chapultepec Fan Walk", venue: "Av. Chapultepec", address: "Av. Chapultepec, Guadalajara", lat: 20.6730, lon: -103.3690, startDate: "2026-06-12", endDate: "2026-07-03", hours: "16:00 – 24:00 daily", description: "GDL's nightlife corridor takes over with screens and bar takeovers.", isFreeEntry: true },
  { id: "gdl-akron", cityId: "Guadalajara", name: "Estadio Akron Fan Plaza", venue: "Explanada Estadio Akron", address: "Av. Vallarta 7000, Zapopan", lat: 20.6818, lon: -103.4625, startDate: "2026-06-11", endDate: "2026-07-03", hours: "Matchdays only", description: "Stadium-side plaza with mariachi, lucha libre and food trucks.", isFreeEntry: true },

  // Monterrey
  { id: "mty-fundidora", cityId: "Monterrey", name: "Parque Fundidora Fan Zone", venue: "Parque Fundidora", address: "Av. Fundidora y Adolfo Prieto, Monterrey", lat: 25.6789, lon: -100.2840, startDate: "2026-06-14", endDate: "2026-06-29", hours: "12:00 – 23:00 daily", description: "Massive industrial-heritage park hosts main watch parties with concerts.", isFreeEntry: true },
  { id: "mty-bbvaplaza", cityId: "Monterrey", name: "Estadio BBVA Fan Plaza", venue: "Explanada Estadio BBVA", address: "Av. Pablo Livas 2011, Guadalupe", lat: 25.6692, lon: -100.2444, startDate: "2026-06-14", endDate: "2026-06-29", hours: "Matchdays only", description: "Stadium-side plaza with sponsor activations and pre-match concerts.", isFreeEntry: true },
];