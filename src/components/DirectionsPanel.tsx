import { useEffect, useRef, useState } from "react";
import Directions from "@arcgis/core/widgets/Directions";
import RouteLayer from "@arcgis/core/layers/RouteLayer";
import Stop from "@arcgis/core/rest/support/Stop";
import Point from "@arcgis/core/geometry/Point";
import type MapView from "@arcgis/core/views/MapView";
import { subscribeMapView, getApiKey } from "@/lib/arcgisMapHolder";
import type { Stadium } from "@/data/stadiums";

interface Props {
  stadium: Stadium;
}

export default function DirectionsPanel({ stadium }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<Directions | null>(null);
  const routeLayerRef = useRef<RouteLayer | null>(null);
  const [view, setView] = useState<MapView | null>(null);

  // Track current map view
  useEffect(() => {
    return subscribeMapView((v) => setView(v));
  }, []);

  // Mount widget when view + container ready
  useEffect(() => {
    if (!view || !containerRef.current) return;
    const map = view.map;
    if (!map) return;

    const routeLayer = new RouteLayer();
    map.add(routeLayer);
    routeLayerRef.current = routeLayer;

    const widget = new Directions({
      view,
      container: containerRef.current,
      layer: routeLayer,
      apiKey: getApiKey() || undefined,
      unit: "metric",
      visibleElements: {
        saveAsButton: false,
        saveButton: false,
        layerDetails: false,
        printButton: false,
      },
    });
    widgetRef.current = widget;

    widget.when(() => {
      routeLayer.stops.removeAll();
      routeLayer.stops.add(new Stop({ name: "Your location" }));
      routeLayer.stops.add(
        new Stop({
          name: stadium.name,
          geometry: new Point({
            longitude: stadium.longitude,
            latitude: stadium.latitude,
          }),
        }),
      );
    });

    return () => {
      try {
        widget.destroy();
      } catch {
        /* noop */
      }
      if (routeLayerRef.current) {
        try {
          map.remove(routeLayerRef.current);
        } catch {
          /* noop */
        }
        routeLayerRef.current = null;
      }
      widgetRef.current = null;
    };
  }, [view, stadium.id, stadium.name, stadium.longitude, stadium.latitude]);

  if (!view) {
    return (
      <div className="rounded-2xl bg-white/70 px-3 py-4 text-center text-xs text-muted-foreground ring-1 ring-border">
        Loading directions…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-border">
      <div ref={containerRef} className="h-[420px] w-full" />
    </div>
  );
}