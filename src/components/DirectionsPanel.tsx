import type { Stadium } from "@/data/stadiums";
import { stadiumContent } from "@/lib/saved-places";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function DirectionsPanel({ stadium }: { stadium: Stadium }) {
  const transport = stadiumContent(stadium.id)?.transport;
  return (
    <div className="rounded-2xl bg-card p-3 text-xs text-muted-foreground shadow-soft ring-1 ring-border">
      <div className="font-semibold text-primary">{stadium.name}</div>
      <div className="mt-1">{stadium.city}, {stadium.country}</div>
      {transport?.address ? <address className="mt-3 not-italic text-foreground">{transport.address}</address> : <div role="status" className="mt-3">An official address and travel page could not be verified for this stadium.</div>}
      {transport?.travelUrl && <Button asChild variant="link" size="sm" className="mt-2 h-auto whitespace-normal px-0 text-left"><a href={transport.travelUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> Official stadium travel information</a></Button>}
      {transport?.address && <div className="mt-2 text-[10px]">Verified {transport.verifiedDate} · <a className="underline" href={transport.sourceUrl} target="_blank" rel="noopener noreferrer">Official source</a></div>}
    </div>
  );
}
