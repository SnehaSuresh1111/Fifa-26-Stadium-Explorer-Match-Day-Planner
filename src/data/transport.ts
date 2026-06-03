import { stadiums } from "./stadiums";

export type TransportMode = "train" | "bus" | "shuttle" | "walk" | "rideshare";

export interface TransportOption {
  mode: TransportMode;
  provider: string;
  line: string;
  duration: string;
  cost: string;
}

export interface StadiumTransport {
  stadiumId: string;
  options: TransportOption[];
  matchdayNote: string;
}

export const transportData: Record<string, StadiumTransport> = {
  sofi: {
    stadiumId: "sofi",
    options: [
      { mode: "bus", provider: "LA Metro", line: "Stadium Express", duration: "40 min", cost: "$3.50" },
      { mode: "train", provider: "LA Metro", line: "K Line to Downtown Inglewood", duration: "35 min", cost: "$1.75" },
      { mode: "rideshare", provider: "Uber/Lyft", line: "Drop-off Zone B", duration: "25 min", cost: "$30–55" },
    ],
    matchdayNote: "No private parking on matchdays — use designated shuttles or transit. Walk 15 min from Downtown Inglewood Station.",
  },
  metlife: {
    stadiumId: "metlife",
    options: [
      { mode: "train", provider: "NJ Transit", line: "Meadowlands Rail (from Secaucus)", duration: "30 min", cost: "$98 RT (incl. match ticket bundle)" },
      { mode: "bus", provider: "NJ Transit", line: "Route 351 from Port Authority", duration: "30 min", cost: "$7.00" },
    ],
    matchdayNote: "Meadowlands Rail runs only on event days. Allow 90 min for post-match crowds at Secaucus Junction.",
  },
  att: {
    stadiumId: "att",
    options: [
      { mode: "shuttle", provider: "Dallas Host Committee", line: "Official Matchday Shuttle", duration: "35 min", cost: "TBC" },
      { mode: "rideshare", provider: "Uber/Lyft", line: "Designated Lot 15 Pickup", duration: "25 min", cost: "$25–45" },
    ],
    matchdayNote: "No direct rail to Arlington. Official shuttles run from Dallas + Fort Worth — pre-book required.",
  },
  arrowhead: {
    stadiumId: "arrowhead",
    options: [
      { mode: "shuttle", provider: "KC Streetcar + Shuttle", line: "Stadium Shuttle from Crown Center", duration: "25 min", cost: "$5.00" },
      { mode: "rideshare", provider: "Uber/Lyft", line: "Lot M Pickup", duration: "20 min", cost: "$20–35" },
    ],
    matchdayNote: "Limited transit options — shuttle is strongly recommended. Tailgating areas open 4h pre-match.",
  },
  mercedes: {
    stadiumId: "mercedes",
    options: [
      { mode: "train", provider: "MARTA", line: "Blue / Green Line to GWCC/CNN Center", duration: "10 min", cost: "$5.00" },
      { mode: "walk", provider: "Downtown ATL", line: "From Centennial Park", duration: "8 min", cost: "Free" },
    ],
    matchdayNote: "MARTA is the fastest way in. Stadium is steps from CNN Center Station. No matchday parking onsite.",
  },
  nrg: {
    stadiumId: "nrg",
    options: [
      { mode: "train", provider: "METRORail", line: "Red Line — Stadium Park/Astrodome", duration: "20 min", cost: "$1.25" },
      { mode: "rideshare", provider: "Uber/Lyft", line: "Yellow Lot Pickup", duration: "15 min", cost: "$18–30" },
    ],
    matchdayNote: "METRORail Red Line drops you at the door. Free park-and-ride lots along the line.",
  },
  hardrock: {
    stadiumId: "hardrock",
    options: [
      { mode: "shuttle", provider: "Miami-Dade Transit", line: "Hard Rock Express Bus from Earlington Heights", duration: "20 min", cost: "$2.65" },
      { mode: "rideshare", provider: "Uber/Lyft", line: "Designated Pickup Zone", duration: "30 min", cost: "$35–60" },
    ],
    matchdayNote: "No rail to stadium. Express buses run from Metrorail Earlington Heights station on event days.",
  },
  gillette: {
    stadiumId: "gillette",
    options: [
      { mode: "train", provider: "MBTA Commuter Rail", line: "Foxboro Special from South Station", duration: "55 min", cost: "$20 RT" },
      { mode: "bus", provider: "Bloom Bus", line: "Match Day Coach from Boston", duration: "50 min", cost: "$25" },
    ],
    matchdayNote: "Commuter Rail runs only for major events. Buy tickets in advance — trains sell out.",
  },
  lincoln: {
    stadiumId: "lincoln",
    options: [
      { mode: "train", provider: "SEPTA", line: "Broad Street Line to NRG Station", duration: "15 min", cost: "$2.90" },
      { mode: "walk", provider: "Sports Complex", line: "From NRG Station", duration: "5 min", cost: "Free" },
    ],
    matchdayNote: "Broad Street Line runs express to the Sports Complex on matchdays. Expect packed trains 2h pre-kickoff.",
  },
  levis: {
    stadiumId: "levis",
    options: [
      { mode: "train", provider: "VTA Light Rail", line: "Tasman/Great America Station", duration: "45 min from San Jose", cost: "$2.50" },
      { mode: "train", provider: "Capitol Corridor", line: "From Oakland/Sacramento", duration: "60 min", cost: "$18–28" },
    ],
    matchdayNote: "Great America Station is right next to the stadium. Drive times are heavy — transit recommended.",
  },
  lumen: {
    stadiumId: "lumen",
    options: [
      { mode: "train", provider: "Sound Transit", line: "Link Light Rail — Stadium Station", duration: "20 min", cost: "$3.25" },
      { mode: "walk", provider: "Downtown Seattle", line: "From Pioneer Square", duration: "10 min", cost: "Free" },
    ],
    matchdayNote: "Stadium Station drops you at Gate A. Link runs every 6–10 min on matchdays.",
  },
  bmo: {
    stadiumId: "bmo",
    options: [
      { mode: "train", provider: "TTC", line: "Streetcar 509 from Union Station", duration: "15 min", cost: "C$3.35" },
      { mode: "walk", provider: "Exhibition Place", line: "From Exhibition GO Station", duration: "5 min", cost: "Free" },
    ],
    matchdayNote: "509 Streetcar and GO Transit both serve Exhibition Place. No parking onsite for matches.",
  },
  bcplace: {
    stadiumId: "bcplace",
    options: [
      { mode: "train", provider: "TransLink", line: "SkyTrain — Stadium-Chinatown Station", duration: "5 min from Downtown", cost: "C$3.20" },
      { mode: "walk", provider: "Downtown Vancouver", line: "From Yaletown", duration: "10 min", cost: "Free" },
    ],
    matchdayNote: "Stadium-Chinatown Station is at the front door. Expect SkyTrain extra service on matchdays.",
  },
  azteca: {
    stadiumId: "azteca",
    options: [
      { mode: "train", provider: "Tren Ligero", line: "Estadio Azteca Station", duration: "25 min from Tasqueña", cost: "MX$3.00" },
      { mode: "bus", provider: "Metrobús", line: "Línea 1 to Huipulco + Tren Ligero", duration: "45 min", cost: "MX$6.00" },
    ],
    matchdayNote: "Tren Ligero is the cheapest and fastest route. Expect very heavy crowds — arrive 2h+ early.",
  },
  akron: {
    stadiumId: "akron",
    options: [
      { mode: "bus", provider: "Mi Transporte", line: "Ruta C04 to Estadio Akron", duration: "40 min from Centro", cost: "MX$9.50" },
      { mode: "rideshare", provider: "Uber/Didi", line: "Designated Drop-off", duration: "25 min", cost: "MX$120–220" },
    ],
    matchdayNote: "Limited transit options. Rideshare and official shuttles from hotel zones recommended.",
  },
  bbva: {
    stadiumId: "bbva",
    options: [
      { mode: "bus", provider: "Transmetro", line: "Ruta Estadio BBVA from Metro Y Griega", duration: "30 min", cost: "MX$15.00" },
      { mode: "rideshare", provider: "Uber/Didi", line: "Designated Pickup", duration: "25 min", cost: "MX$150–280" },
    ],
    matchdayNote: "No direct metro to stadium. Matchday shuttles run from Metro Y Griega — last bus ~1h post-match.",
  },
};

export function googleMapsTransitUrl(lat: number, lng: number, name: string): string {
  const dest = encodeURIComponent(`${name} @${lat},${lng}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=transit`;
}

// Ensure every stadium has a fallback record
stadiums.forEach((s) => {
  if (!transportData[s.id]) {
    transportData[s.id] = {
      stadiumId: s.id,
      options: [
        { mode: "rideshare", provider: "Uber/Lyft", line: "Designated Pickup", duration: "—", cost: "Varies" },
      ],
      matchdayNote: "Detailed matchday transport info coming soon. Use Get Directions for live transit routing.",
    };
  }
});