# Project rules
- Load the Leaflet map only through the existing browser-gated lazy component, because Leaflet imports require the DOM.
- Keep stadium and fan-zone data bundled locally; unavailable Places and directions must not call substitute services.
- Request only visible OpenStreetMap standard tiles with linked attribution and normal browser caching; never prefetch or download offline.
