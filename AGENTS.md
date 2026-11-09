# Project rules
- Load the Leaflet map only through the existing browser-gated lazy component, because Leaflet imports require the DOM.
- Keep stadium and fan-zone data bundled locally; unavailable Places and directions must not call substitute services.
- Hotels, Eat and Transport read stadium-content.json by stadium ID; place filters and map markers share browser-computed straight-line results, and retrieval-blocked snapshots stay distinct from successful empty filters to avoid implying absent records were searched.
- Request only visible OpenStreetMap standard tiles with linked attribution and normal browser caching; never prefetch or download offline.
