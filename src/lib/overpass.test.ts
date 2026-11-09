import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchHotels, fetchRestaurants, PLACES_UNAVAILABLE } from "./overpass";

test("unavailable hotel and eat searches never call a replacement service", async () => {
  const originalFetch = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => { requests += 1; throw new Error("Unexpected external request"); };
  try {
    await assert.rejects(fetchHotels("sofi", 33.9535, -118.3392, 1.5), { message: PLACES_UNAVAILABLE });
    await assert.rejects(fetchRestaurants("sofi", 33.9535, -118.3392, 3), { message: PLACES_UNAVAILABLE });
    assert.equal(requests, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});