import { User } from "lucide-react";
import { stadiums, type Stadium } from "@/data/stadiums";

export default function StadiumDetail({ stadium }: { stadium: Stadium | null }) {
  if (!stadium) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">Welcome to FIFA 2026</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore all {stadiums.length} host stadiums across the USA, Canada, and Mexico.
        </p>
        <p className="mt-4 text-sm">Click a pin on the map or pick a city above to begin.</p>
        <div className="mt-6 rounded-lg bg-secondary p-4 text-sm">
          <div className="font-semibold text-primary">Quick stats</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>🏟️ 16 stadiums</li>
            <li>🌎 3 host nations</li>
            <li>🏆 11 host cities</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <img src={stadium.imageUrl} alt={stadium.name} className="h-56 w-full object-cover" />
      <div className="p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent">
          {stadium.country}
        </div>
        <h2 className="mt-1 text-2xl font-bold text-primary">{stadium.name}</h2>
        <div className="mt-1 text-sm text-muted-foreground">{stadium.city}</div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary p-3">
            <div className="text-xs text-muted-foreground">Capacity</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-bold text-primary">
              <Users size={18} className="text-accent" />
              {stadium.capacity.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <div className="text-xs text-muted-foreground">Coordinates</div>
            <div className="mt-1 text-xs font-mono text-foreground">
              {stadium.latitude.toFixed(3)}°<br />
              {stadium.longitude.toFixed(3)}°
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}