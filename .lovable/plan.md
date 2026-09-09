# Fix the build memory failure

## Goal
Make both development-mode and production builds complete within the fixed deployment memory limit without changing the live map experience.

## Changes
- Isolate the ArcGIS browser SDK behind a client-only module boundary so page rendering never loads it on the server.
- Harden the Vite server-build filter for every non-client environment, including development-mode Nitro builds and ArcGIS CSS/assets.
- Keep the real ArcGIS modules in browser builds so maps, directions, pins, hotels, and eateries continue working.
- Remove the ineffective 4 GB heap workaround once the dependency graph is bounded.

## Validation
- Run the failing `build:dev` command and confirm it completes without transforming the full ArcGIS graph.
- Check the automated build result.
- Open the app and verify the basemap, stadium pins, and reload control still render.

## Technical details
The failure occurs at the 4 GB heap ceiling because the server build traverses the large `@arcgis/core` module graph. The fix prevents browser-only ArcGIS code and styles from entering Nitro/SSR rather than allocating more memory.
