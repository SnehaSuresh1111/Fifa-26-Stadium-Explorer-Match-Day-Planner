# Project rules
- Load the Leaflet map only through the existing browser-gated lazy component, because Leaflet imports require the DOM.
- Keep stadium and fan-zone data bundled locally; unavailable Places and directions must not call substitute services.
- Until genuine establishment records and verified transport details are bundled, the detail tabs render placeholders and clear establishment map layers rather than invoking search helpers.
- Request only visible OpenStreetMap standard tiles with linked attribution and normal browser caching; never prefetch or download offline.
