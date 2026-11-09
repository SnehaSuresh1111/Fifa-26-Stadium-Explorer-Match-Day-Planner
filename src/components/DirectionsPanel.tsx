import type { Stadium } from "@/data/stadiums";

export default function DirectionsPanel({ stadium }: { stadium: Stadium }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-xs text-muted-foreground shadow-soft ring-1 ring-border">
      <div className="font-semibold text-primary">{stadium.name}</div>
      <div className="mt-1">{stadium.city}, {stadium.country}</div>
      <div className="mt-3">Verified stadium address and transport information coming soon.</div>
    </div>
  );
}
