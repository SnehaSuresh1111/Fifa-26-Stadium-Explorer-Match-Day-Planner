// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const arcgisServerStubPrefix = "\0arcgis-server-stub:";

/**
 * ArcGIS is an 81 MB browser SDK. Letting the server build follow its dynamic
 * imports makes Nitro transform thousands of modules that can never execute
 * during SSR and exhausts the deployment worker's heap.
 *
 * The map and directions only run after hydration, so server builds receive a
 * tiny inert module while client builds continue to bundle the real SDK.
 */
const excludeArcgisFromServerBuild = {
  name: "exclude-arcgis-from-server-build",
  enforce: "pre" as const,
  resolveId(
    this: { environment?: { name?: string } },
    source: string,
    _importer: string | undefined,
    options: { ssr?: boolean },
  ) {
    const environmentName = this.environment?.name;
    const isServerBuild = options.ssr || (environmentName !== undefined && environmentName !== "client");

    if (isServerBuild && source.startsWith("@arcgis/core/")) {
      return `${arcgisServerStubPrefix}${source}`;
    }
    return null;
  },
  load(id: string) {
    if (!id.startsWith(arcgisServerStubPrefix)) return null;
    if (id.endsWith(".css")) return "";
    return `
      export default class ArcgisServerStub {}
      export const solve = () => { throw new Error("ArcGIS is only available in the browser") }
      export const fetchServiceDescription = solve
      export const suggestLocations = solve
      export const addressToLocations = solve
    `;
  },
};

export default defineConfig({
  vite: {
    plugins: [excludeArcgisFromServerBuild],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
