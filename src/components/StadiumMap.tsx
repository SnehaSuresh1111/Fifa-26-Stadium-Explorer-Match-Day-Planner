import { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import Home from "@arcgis/core/widgets/Home";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { stadiums, type Stadium } from "@/data/stadiums";
import type { Poi } from "@/lib/overpass";

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

interface Props {
  selectedId: string | null;
  onSelect: (s: Stadium) => void;
  flyToCity: string | null;
  pois?: Poi[];
}

export default function StadiumMap({ selectedId, onSelect, flyToCity, pois = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const layerRef = useRef<GraphicsLayer | null>(null);
  const poiLayerRef = useRef<GraphicsLayer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const layer = new GraphicsLayer();
    const poiLayer = new GraphicsLayer();
    const map = new Map({ basemap: "osm", layers: [poiLayer, layer] });
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
    view.ui.add(new Home({ view }), "top-left");

    const defaultSym = new PictureMarkerSymbol({ url: pinSvg(ACCENT), width: 32, height: 40, yoffset: 16 });

    stadiums.forEach((s) => {
      const g = new Graphic({
        geometry: new Point({ longitude: s.longitude, latitude: s.latitude }),
        symbol: defaultSym.clone(),
        attributes: { ...s },
        popupTemplate: {
          title: "{name}",
          content: () => {
            const wrap = document.createElement("div");
            wrap.style.cssText = "font-family:'DM Sans',Arial,sans-serif;max-width:280px;";
            const img = document.createElement("img");
            img.src = s.imageUrl;
            img.alt = s.name;
            img.referrerPolicy = "no-referrer";
            img.style.cssText = "width:100%;height:140px;object-fit:cover;border-radius:12px;margin-bottom:10px;display:block;";
            const loc = document.createElement("div");
            loc.style.cssText = "color:#818cf8;font-weight:700;font-size:14px;margin-bottom:4px;";
            loc.textContent = `${s.city}, ${s.country}`;
            const cap = document.createElement("div");
            cap.style.cssText = "color:#c4b5fd;font-size:13px;";
            cap.innerHTML = `<span style="margin-right:4px;">&#128100;</span> Capacity: <b>${s.capacity.toLocaleString()}</b>`;
            wrap.appendChild(img);
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

    view.on("click", async (e) => {
      const r = await view.hitTest(e);
      const hit = r.results.find((x: any) => x.graphic?.layer === layer) as any;
      if (hit?.graphic) {
        view.openPopup({
          features: [hit.graphic],
          location: e.mapPoint,
        });
        onSelect(hit.graphic.attributes as Stadium);
      }
    });

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    const layer = layerRef.current;
    if (!layer) return;
    layer.graphics.forEach((g: any) => {
      const isSel = g.attributes.id === selectedId;
      g.symbol = new PictureMarkerSymbol({
        url: pinSvg(isSel ? PRIMARY : ACCENT),
        width: isSel ? 40 : 32,
        height: isSel ? 50 : 40,
        yoffset: isSel ? 20 : 16,
      });
    });
    if (view && selectedId) {
      const graphic = layer.graphics.find((g: any) => g.attributes.id === selectedId);
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
        attributes: { id: p.id, name: p.name, kind: p.kind, cuisine: p.cuisine, address: p.address },
        popupTemplate: {
          title: "{name}",
          content: () => {
            const wrap = document.createElement("div");
            wrap.style.cssText = "font-family:'DM Sans',Arial,sans-serif;max-width:240px;font-size:13px;";
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

  return <div ref={containerRef} className="absolute inset-0" />;
}