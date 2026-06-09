import type MapView from "@arcgis/core/views/MapView";

type Listener = (view: MapView | null) => void;

let currentView: MapView | null = null;
let currentApiKey: string | null = null;
const listeners = new Set<Listener>();

export function setMapView(view: MapView | null, apiKey: string | null = currentApiKey) {
  currentView = view;
  currentApiKey = apiKey;
  listeners.forEach((l) => l(view));
}

export function getMapView(): MapView | null {
  return currentView;
}

export function getApiKey(): string | null {
  return currentApiKey;
}

export function subscribeMapView(l: Listener): () => void {
  listeners.add(l);
  // emit current state immediately
  l(currentView);
  return () => {
    listeners.delete(l);
  };
}