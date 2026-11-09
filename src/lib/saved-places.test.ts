import { test } from "node:test";
import assert from "node:assert/strict";
import { stadiums } from "../data/stadiums";
import { listedPlaces, loadStadiumPlaces, mapSearchUrl, placesOfKind, stadiumContent, straightLineMiles } from "./saved-places";

const att = stadiums.find((stadium) => stadium.id === "att");
if (!att) throw new Error("AT&T stadium missing");

test("every supported stadium has saved hotels and eateries from OSM with source links", async () => {
  for (const stadium of stadiums) {
    assert.equal(stadiumContent(stadium.id).status, "retrieved");
    const places = await loadStadiumPlaces(stadium.id);
    assert.ok(placesOfKind(places, "hotels").length > 0, `${stadium.id} hotels`);
    assert.ok(placesOfKind(places, "eatdrink").length > 0, `${stadium.id} eateries`);
    for (const place of places) {
      assert.match(place.sourceUrl, /^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/\d+$/);
      assert.ok(place.name && Number.isFinite(place.lat) && Number.isFinite(place.lon));
      assert.ok(straightLineMiles(stadium.latitude, stadium.longitude, place.lat, place.lon) <= 3);
      if (place.website) assert.match(place.website, /^https?:\/\//);
    }
  }
});

test("distance filter is in miles and places are sorted nearest first", async () => {
  const places = await loadStadiumPlaces("att");
  const near = listedPlaces(att, places, "hotels", 1);
  const wide = listedPlaces(att, places, "hotels", 3);
  assert.ok(near.length > 0 && wide.length > near.length);
  assert.ok(near.every((place) => place.distance <= 1609.344));
  assert.ok(wide.every((place, index) => index === 0 || place.distance >= wide[index - 1].distance));
});

test("food category filter excludes hotels", async () => {
  const cafes = listedPlaces(att, await loadStadiumPlaces("att"), "eatdrink", 3, "cafe");
  assert.ok(cafes.length > 0);
  assert.ok(cafes.every((place) => place.categoryId === "cafe" && place.kind === "restaurant"));
});

test("a distance that excludes everything yields an empty list", async () => {
  assert.equal(listedPlaces(att, await loadStadiumPlaces("att"), "hotels", 0).length, 0);
});

test("straight-line distance returns miles", () => {
  assert.equal(straightLineMiles(32.7473, -97.0945, 32.7473, -97.0945), 0);
  assert.ok(Math.abs(straightLineMiles(0, 0, 0, 1) - 69.0934) < 0.001);
});

test("empty-state map search link points near the stadium", () => {
  assert.match(mapSearchUrl(att, "hotels"), /^https:\/\/www\.openstreetmap\.org\/search\?query=hotels%20near%20AT%26T%20Stadium/);
});

test("AT&T transport uses the verified official address and travel page", () => {
  const transport = stadiumContent("att").transport;
  assert.equal(transport.address, "One AT&T Way, Arlington, TX 76011");
  assert.equal(transport.travelUrl, "https://attstadium.com/maps/game-day-map/");
  assert.equal(stadiumContent("bbva").transport.address, null);
});
