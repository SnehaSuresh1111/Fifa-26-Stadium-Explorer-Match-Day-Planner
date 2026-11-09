import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { placeSnapshot, stadiumContent, type PlaceCategory, type SavedPlace } from "@/lib/saved-places";

const categories: { id: PlaceCategory; label: string }[] = [
  { id: "all", label: "All" }, { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafés" }, { id: "sports_bar", label: "Sports bars" },
  { id: "bar", label: "Bars" }, { id: "pub", label: "Pubs" },
];

export default function SavedPlacesTab({ stadiumId, kind, places, radius, onRadiusChange, category, onCategoryChange }: {
  stadiumId: string; kind: "hotels" | "eatdrink"; places: SavedPlace[];
  radius: number; onRadiusChange: (radius: number) => void;
  category: PlaceCategory; onCategoryChange: (category: PlaceCategory) => void;
}) {
  const snapshot = stadiumContent(stadiumId);
  if (!snapshot || snapshot.status !== "retrieved") {
    return <div role="status" className="rounded-2xl bg-card p-4 text-xs text-muted-foreground ring-1 ring-border">Place records could not be retrieved for this stadium. No listings are available.</div>;
  }
  return <div className="space-y-3">
    <div className="flex flex-wrap gap-1" role="group" aria-label="Radius in miles">
      {[1, 1.5, 3].map((value) => <Button key={value} size="sm" variant={radius === value ? "default" : "outline"} aria-pressed={radius === value} onClick={() => onRadiusChange(value)}>{value} mi</Button>)}
    </div>
    {kind === "eatdrink" && <div className="flex flex-wrap gap-1" role="group" aria-label="Food category">
      {categories.map(({ id, label }) => <Button key={id} size="sm" variant={category === id ? "default" : "outline"} aria-pressed={category === id} onClick={() => onCategoryChange(id)}>{label}</Button>)}
    </div>}
    <div className="text-[11px] text-muted-foreground">Saved places, not live results · Straight-line distance<br />{places.length} listed · Retrieved {placeSnapshot.retrievedDate}</div>
    {places.length === 0 ? <div role="status" className="rounded-2xl bg-card p-4 text-xs text-muted-foreground ring-1 ring-border">No listed places within this radius</div> : <ul className="space-y-2.5" aria-label={kind === "hotels" ? "Listed hotels" : "Listed food venues"}>
      {places.map((place) => <li key={place.id} className="rounded-2xl bg-card p-3 shadow-soft ring-1 ring-border">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 break-words text-sm font-bold text-foreground">{place.name}</h3>
          <span className="shrink-0 text-[11px] font-semibold text-primary">{(place.distance / 1609.344).toFixed(2)} mi</span>
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">{place.categoryLabel}{place.stars ? ` · ${place.stars} stars (OSM classification)` : ""}</div>
        {place.address && <div className="mt-1 break-words text-[11px] text-muted-foreground">{place.address}</div>}
        {place.cuisine && <div className="mt-1 text-[11px] text-muted-foreground">Cuisine: {place.cuisine.replaceAll(";", ", ").replaceAll("_", " ")}</div>}
        <Button asChild variant="link" size="sm" className="mt-1 h-auto px-0"><a href={place.sourceUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> OpenStreetMap record</a></Button>
      </li>)}
    </ul>}
    <p className="text-[10px] text-muted-foreground">© <a className="underline" href={placeSnapshot.attributionUrl} target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> · <a className="underline" href={placeSnapshot.licenseUrl} target="_blank" rel="noopener noreferrer">ODbL</a>. Listings may be incomplete or outdated. Distances are not walking or driving routes.</p>
  </div>;
}