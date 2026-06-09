import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import Home from "@arcgis/core/widgets/Home";
import esriConfig from "@arcgis/core/config";
import RouteLayer from "@arcgis/core/layers/RouteLayer";
import Directions from "@arcgis/core/widgets/Directions";
import Stop from "@arcgis/core/rest/support/Stop";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { stadiums, type Stadium } from "@/data/stadiums";
import type { Poi } from "@/lib/overpass";
import { useServerFn } from "@tanstack/react-start";
import { getArcgisKey } from "@/lib/arcgis.functions";

const ACCENT = "#C0392B";
const PRIMARY = "#1C4E8A";
const HOTEL_COLOR = "#f59e0b";
const FOOD_COLOR = "#10b981";

const pinSvg = (color: string) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='56' viewBox='0 0 44 56'>
    <defs><filter id='s' x='-50%' y='-50%' width='200%' height='200%'>
      <feDropShadow dx='0' dy='2' stdDeviation='1.5' flood-opacity='0.35'/></filter></defs>
    <path filter='url(#s)' fill='${color}' stroke='white' stroke-width='2'
      d='M22 2C11 2 3 10 3 21c0 14 19 33 19 33s19-19 19-33C41 10 33 2 22 2z'/>
    <circle cx='22' cy='21' r='9' fill='white'/>
    <path fill='${color}' d='M22 14l2.4 1.8-.9 2.9h-3l-.9-2.9zM22 28l-2.4-1.8.9-2.9h3l.9 2.9zM15.6 21l1.8-2.4 2.9.9v3l-2.9.9zM28.4 21l-1.8 2.4-2.9-.9v-3l2.9-.9z'/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const dotSvg = (color: string) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
    <circle cx='12' cy='12' r='8' fill='${color}' stroke='white' stroke-width='2.5'/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

type HitWithGraphic = { graphic?: Graphic };

interface Props {
  selectedId: string | null;
  onSelect: (s: Stadium) => void;
  flyToCity: string | null;
  pois?: Poi[];
  directionsFor?: Stadium | null;
}

export default function StadiumMap({
  selectedId,
  onSelect,
  flyToCity,
  pois = [],
  directionsFor,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const layerRef = useRef<GraphicsLayer | null>(null);
  const poiLayerRef = useRef<GraphicsLayer | null>(null);
  const mapRef = useRef<Map | null>(null);
  const directionsRef = useRef<Directions | null>(null);
  const routeLayerRef = useRef<RouteLayer | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const fetchKey = useServerFn(getArcgisKey);

  useEffect(() => {
    let cancelled = false;
    fetchKey()
      .then((r) => {
        if (!cancelled) setApiKey(r.key || "");
      })
      .catch(() => setApiKey(""));
    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  useEffect(() => {
    if (!containerRef.current || apiKey === null) return;
    if (apiKey) esriConfig.apiKey = apiKey;
    const layer = new GraphicsLayer();
    const poiLayer = new GraphicsLayer();
    const map = new Map({
      basemap: "streets-navigation-vector",
      layers: [poiLayer, layer],
    });
    const view = new MapView({
      container: containerRef.current,
      map,
      center: [-95, 40],
      zoom: 3,
      ui: { components: ["zoom"] },
      popup: {
        dockEnabled: false,
      },
    });

    // Inject sleek popup overrides
    const popupStyle = document.createElement("style");
    popupStyle.textContent = `
      .esri-popup__main-container {
        border-radius: 10px !important;
        box-shadow: 0 6px 24px -6px rgba(0,0,0,0.18) !important;
        max-width: 200px !important;
      }
      .esri-popup__header {
        padding: 8px 10px 4px !important;
      }
      .esri-popup__header-title {
        font-size: 13px !important;
        font-weight: 700 !important;
        font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif !important;
        letter-spacing: -0.01em !important;
      }
      .esri-popup__content {
        padding: 0 10px 8px !important;
      }
      .esri-popup__pointer {
        display: none !important;
      }
      .esri-popup__footer {
        display: none !important;
      }
      .esri-popup__button {
        width: 22px !important;
        height: 22px !important;
        font-size: 12px !important;
      }
    `;
    containerRef.current.appendChild(popupStyle);
    view.ui.add(new Home({ view }), "top-left");

    const defaultSym = new PictureMarkerSymbol({
      url: pinSvg(ACCENT),
      width: 32,
      height: 40,
      yoffset: 16,
    });

    stadiums.forEach((s) => {
      const g = new Graphic({
        geometry: new Point({ longitude: s.longitude, latitude: s.latitude }),
        symbol: defaultSym.clone(),
        attributes: { ...s },
        popupTemplate: {
          title: "{name}",
          content: () => {
            const wrap = document.createElement("div");
            wrap.style.cssText = "font-family:'DM Sans',Arial,sans-serif;max-width:220px;";
            const loc = document.createElement("div");
            loc.style.cssText = "color:#818cf8;font-weight:700;font-size:14px;margin-bottom:4px;";
            loc.textContent = `${s.city}, ${s.country}`;
            const cap = document.createElement("div");
            cap.style.cssText = "color:#c4b5fd;font-size:13px;";
            cap.innerHTML = `<span style="margin-right:4px;">&#128100;</span> Capacity: <b>${s.capacity.toLocaleString()}</b>`;
            wrap.appendChild(loc);
            wrap.appendChild(cap);
            return wrap;
          },
        },
      });
      layer.add(g);
    });

    layerRef.current = layer;
    poiLayerRef.current = poiLayer;
    viewRef.current = view;
    mapRef.current = map;

    view.on("click", async (e) => {
      const r = await view.hitTest(e);
      const hit = r.results.find((result) => {
        const maybeHit = result as HitWithGraphic;
        return maybeHit.graphic?.layer === layer;
      });
      const graphic = (hit as HitWithGraphic | undefined)?.graphic;
      if (graphic) {
        view.openPopup({
          features: [graphic],
          location: e.mapPoint,
        });
        onSelect(graphic.attributes as Stadium);
      }
    });

    return () => {
      view.destroy();
      viewRef.current = null;
      mapRef.current = null;
      directionsRef.current = null;
      routeLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, reloadKey]);

  useEffect(() => {
    const view = viewRef.current;
    const layer = layerRef.current;
    if (!layer) return;
    layer.graphics.forEach((g) => {
      const isSel = g.attributes.id === selectedId;
      g.symbol = new PictureMarkerSymbol({
        url: pinSvg(isSel ? PRIMARY : ACCENT),
        width: isSel ? 40 : 32,
        height: isSel ? 50 : 40,
        yoffset: isSel ? 20 : 16,
      });
    });
    if (view && selectedId) {
      const graphic = layer.graphics.find((g) => g.attributes.id === selectedId);
      if (graphic && graphic.geometry) {
        view.openPopup({
          features: [graphic],
          location: graphic.geometry as Point,
        });
      }
    }
  }, [selectedId]);

  useEffect(() => {
    if (!flyToCity || !viewRef.current) return;
    const targets = stadiums.filter((s) => s.city === flyToCity);
    if (!targets.length) return;
    viewRef.current.goTo({
      center: [targets[0].longitude, targets[0].latitude],
      zoom: 11,
    });
  }, [flyToCity]);

  useEffect(() => {
    const layer = poiLayerRef.current;
    if (!layer) return;
    layer.removeAll();
    pois.forEach((p) => {
      const color = p.kind === "hotel" ? HOTEL_COLOR : FOOD_COLOR;
      const g = new Graphic({
        geometry: new Point({ longitude: p.lon, latitude: p.lat }),
        symbol: new PictureMarkerSymbol({ url: dotSvg(color), width: 18, height: 18 }),
        attributes: {
          id: p.id,
          name: p.name,
          kind: p.kind,
          cuisine: p.cuisine,
          address: p.address,
        },
        popupTemplate: {
          title: "{name}",
          content: () => {
            const wrap = document.createElement("div");
            wrap.style.cssText =
              "font-family:'DM Sans',Arial,sans-serif;max-width:240px;font-size:13px;";
            const badge = document.createElement("div");
            badge.style.cssText = `display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:white;background:${color};margin-bottom:6px;`;
            badge.textContent = p.kind;
            wrap.appendChild(badge);
            if (p.cuisine) {
              const c = document.createElement("div");
              c.style.cssText = "color:#818cf8;font-weight:600;text-transform:capitalize;";
              c.textContent = p.cuisine;
              wrap.appendChild(c);
            }
            if (p.address) {
              const a = document.createElement("div");
              a.style.cssText = "color:#6b7280;font-size:12px;margin-top:2px;";
              a.textContent = p.address;
              wrap.appendChild(a);
            }
            return wrap;
          },
        },
      });
      layer.add(g);
    });
  }, [pois]);

  // Directions widget toggle
  useEffect(() => {
    const view = viewRef.current;
    const map = mapRef.current;
    if (!view || !map) return;
    if (!directionsFor) {
      if (directionsRef.current) {
        view.ui.remove(directionsRef.current);
        directionsRef.current.destroy();
        directionsRef.current = null;
      }
      if (routeLayerRef.current) {
        map.remove(routeLayerRef.current);
        routeLayerRef.current = null;
      }
      return;
    }
    if (!routeLayerRef.current) {
      routeLayerRef.current = new RouteLayer();
      map.add(routeLayerRef.current);
    }
    if (!directionsRef.current) {
      directionsRef.current = new Directions({
        view,
        layer: routeLayerRef.current,
        apiKey: apiKey || undefined,
        unit: "metric",
        visibleElements: {
          saveAsButton: false,
          saveButton: false,
          layerDetails: false,
          printButton: false,
        },
      });
      view.ui.add(directionsRef.current, "top-left");
    }
    const widget = directionsRef.current;
    const route = routeLayerRef.current;
    widget.when(() => {
      route.stops.removeAll();
      route.stops.add(new Stop({ name: "Origin" }));
      route.stops.add(
        new Stop({
          name: directionsFor.name,
          geometry: new Point({
            longitude: directionsFor.longitude,
            latitude: directionsFor.latitude,
          }),
        }),
      );
    });
  }, [directionsFor]);

  if (apiKey === null) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        Loading map…
      </div>
    );
  }

  return (
    <>
      <div
        key={reloadKey}
        ref={containerRef}
        className="absolute inset-0 h-full min-h-screen w-full"
      />
      <button
        type="button"
        onClick={() => setReloadKey((k) => k + 1)}
        className="absolute right-3 bottom-3 z-10 rounded-md bg-white/95 px-3 py-2 text-xs font-semibold text-slate-800 shadow-md ring-1 ring-black/10 hover:bg-white"
        aria-label="Reload map"
        title="Reload map"
      >
        ↻ Reload map
      </button>
    </>
  );
}
