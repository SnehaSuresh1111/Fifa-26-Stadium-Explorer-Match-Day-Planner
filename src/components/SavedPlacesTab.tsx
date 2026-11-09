import { ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Stadium } from "@/data/stadiums";
import { mapSearchUrl, placeSnapshot, type PlaceCategory, type SavedPlace } from "@/lib/saved-places";

const categories: { id: PlaceCategory; label: string }[] = [
  { id: "all", label: "All" }, { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafés" }, { id: "sports_bar", label: "Sports bars" },
  { id: "bar", label: "Bars" }, { id: "pub", label: "Pubs" },
];

const boxClass = "rounded-2xl bg-card p-4 text-xs text-muted-foreground ring-1 ring-border";

export default function SavedPlacesTab({ stadium, kind, state, totalOfKind, places, radius, onRadiusChange, category, onCategoryChange, onReset }: {
  stadium: Stadium; kind: "hotels" | "eatdrink"; state: "loading" | "ready" | "failed";
  totalOfKind: number; places: SavedPlace[];
  radius: number; onRadiusChange: (radius: number) => void;
  category: PlaceCategory; onCategoryChange: (category: PlaceCategory) => void;
  onReset: () => void;
}) {
  const noun = kind === "hotels" ? "hotels" : "restaurants";
  if (state === "loading") return <div role="status" className={boxClass}>Loading saved {noun}…</div>;
  if (state === "failed" || totalOfKind === 0) {
    return <div role="status" className={boxClass}>
      No verified {noun} are saved for {stadium.name}.
      <Button asChild variant="link" size="sm" className="mt-1 flex h-auto px-0"><a href={mapSearchUrl(stadium, kind)} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> Search {noun} near this stadium on OpenStreetMap</a></Button>
    </div>;
  }
  return <div className="space-y-3">
    <div className="flex flex-wrap gap-1" role="group" aria-label="Distance from stadium in miles">
      {[1, 1.5, 3].map((value) => <Button key={value} size="sm" variant={radius === value ? "default" : "outline"} aria-pressed={radius === value} onClick={() => onRadiusChange(value)}>{value} mi</Button>)}
    </div>
    {kind === "eatdrink" && <div className="flex flex-wrap gap-1" role="group" aria-label="Food category">
      {categories.map(({ id, label }) => <Button key={id} size="sm" variant={category === id ? "default" : "outline"} aria-pressed={category === id} onClick={() => onCategoryChange(id)}>{label}</Button>)}
    </div>}
    <div className="text-[11px] text-muted-foreground">Saved places, not live results · Distance from stadium is straight-line, not walking or driving<br />{places.length} listed · Retrieved {placeSnapshot.retrievedDate}</div>
    {places.length === 0 ? <div role="status" className={boxClass}>
      No places within this distance
      <Button size="sm" variant="outline" className="mt-2 flex" onClick={onReset}>Reset filters</Button>
    </div> : <ul className="space-y-2.5" aria-label={kind === "hotels" ? "Listed hotels" : "Listed food venues"}>
      {places.map((place) => <li key={place.id} className="rounded-2xl bg-card p-3 shadow-soft ring-1 ring-border">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 break-words text-sm font-bold text-foreground">{place.name}</h3>
          <span className="shrink-0 text-right text-[11px] font-semibold text-primary"><span className="block text-[9px] font-normal text-muted-foreground">Distance from stadium</span>{(place.distance / 1609.344).toFixed(2)} mi</span>
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">{place.categoryLabel}{place.stars ? ` · ${place.stars} stars (OSM classification)` : ""}</div>
        {place.address && <div className="mt-1 break-words text-[11px] text-muted-foreground">{place.address}</div>}
        {place.cuisine && <div className="mt-1 text-[11px] text-muted-foreground">Cuisine: {place.cuisine.replaceAll(";", ", ").replaceAll("_", " ")}</div>}
        <div className="mt-1 flex flex-wrap gap-x-3">
          {place.website && <Button asChild variant="link" size="sm" className="h-auto px-0"><a href={place.website} target="_blank" rel="noopener noreferrer"><Globe size={12} /> Website</a></Button>}
          <Button asChild variant="link" size="sm" className="h-auto px-0"><a href={place.sourceUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> View on map</a></Button>
        </div>
      </li>)}
    </ul>}
    <p className="text-[10px] text-muted-foreground">© <a className="underline" href={placeSnapshot.attributionUrl} target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> · <a className="underline" href={placeSnapshot.licenseUrl} target="_blank" rel="noopener noreferrer">ODbL</a>. Listings may be incomplete or outdated. Distances are not walking or driving routes.</p>
  </div>;
}
