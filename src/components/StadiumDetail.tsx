import { User, MapPin, Sparkles } from "lucide-react";
import { stadiums, type Stadium } from "@/data/stadiums";

export default function StadiumDetail({ stadium }: { stadium: Stadium | null }) {
  if (!stadium) {
    return (
      <div className="p-6 pt-20">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-soft px-3 py-1 text-xs font-semibold text-primary-foreground/90">
          <Sparkles size={12} /> Welcome
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gradient-primary">
          Discover FIFA 2026
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore all {stadiums.length} host stadiums across the USA, Canada, and Mexico.
        </p>
        <p className="mt-4 text-sm">Tap a pin on the map or jump to a city above to begin.</p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { n: "16", l: "Stadiums" },
            { n: "3", l: "Nations" },
            { n: "11", l: "Cities" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-gradient-primary p-[1.5px] shadow-soft">
              <div className="rounded-[calc(1rem-1px)] bg-white/85 p-3 text-center">
                <div className="text-2xl font-bold text-gradient-primary">{s.n}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative p-3 pt-20">
        <div className="relative overflow-hidden rounded-3xl shadow-glow">
          <img src={stadium.imageUrl} alt={stadium.name} className="h-56 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
              <MapPin size={12} /> {stadium.country}
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gradient-primary">{stadium.name}</h2>
        <div className="mt-1 text-sm text-muted-foreground">{stadium.city}</div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-primary p-[1.5px] shadow-soft">
            <div className="rounded-[calc(1rem-1px)] bg-white/90 p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Capacity</div>
              <div className="mt-1 flex items-center gap-2 text-xl font-bold text-foreground">
                <User size={18} className="text-primary" />
                {stadium.capacity.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 shadow-soft ring-1 ring-border">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Coordinates</div>
            <div className="mt-2 font-mono text-xs text-foreground">
              {stadium.latitude.toFixed(3)}°<br />
              {stadium.longitude.toFixed(3)}°
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}