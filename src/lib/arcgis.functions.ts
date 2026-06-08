import { createServerFn } from "@tanstack/react-start";

export const getArcgisKey = createServerFn({ method: "GET" }).handler(async () => {
  return { key: process.env.ARCGIS_API_KEY ?? "" };
});