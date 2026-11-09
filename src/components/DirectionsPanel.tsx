import type { Stadium } from "@/data/stadiums";

export default function DirectionsPanel({ stadium }: { stadium: Stadium }) {
  return (
    <div role="status" className="rounded-2xl bg-card p-3 text-xs text-muted-foreground shadow-soft ring-1 ring-border">
      Live directions and address search are unavailable. No routing or geocoding service is connected.
      <div className="mt-2 font-semibold text-primary">Destination: {stadium.name}</div>
    </div>
  );
}
