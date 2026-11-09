import { test } from "node:test";
import assert from "node:assert/strict";
import { stadiums } from "../data/stadiums";
import { listedPlaces, stadiumContent, straightLineMiles } from "./saved-places";

const att = stadiums.find((stadium) => stadium.id === "att");
if (!att) throw new Error("AT&T stadium missing");

test("AT&T snapshot contains genuine OSM records and source metadata", () => {
  const snapshot = stadiumContent("att");
  assert.equal(snapshot.status, "retrieved");
  assert.equal(snapshot.places.length, 159);
  assert.equal(snapshot.places.filter((place) => place.category === "hotel").length, 34);
  for (const place of snapshot.places) {
    assert.match(place.sourceUrl, /^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/\d+$/);
    assert.equal(place.retrievedDate, "2026-11-09");
    assert.ok(Number.isFinite(place.lat) && Number.isFinite(place.lon));
  }
});

test("local radius is in miles and places are sorted nearest first", () => {
  const near = listedPlaces(att, "hotels", 1);
  const wide = listedPlaces(att, "hotels", 3);
  assert.ok(near.length > 0 && wide.length > near.length);
  assert.ok(near.every((place) => place.distance <= 1609.344));
  assert.ok(wide.every((place, index) => index === 0 || place.distance >= wide[index - 1].distance));
});

test("food category filter excludes hotels and matches OSM cafe classification", () => {
  const cafes = listedPlaces(att, "eatdrink", 3, "cafe");
  assert.ok(cafes.length > 0);
  assert.ok(cafes.every((place) => place.categoryId === "cafe" && place.kind === "restaurant"));
  assert.equal(listedPlaces(att, "eatdrink", 3, "sports_bar").length, 0);
});

test("straight-line distance returns miles, not meters or routed distance", () => {
  assert.equal(straightLineMiles(32.7473, -97.0945, 32.7473, -97.0945), 0);
  assert.ok(Math.abs(straightLineMiles(0, 0, 0, 1) - 69.0934) < 0.001);
});

test("all stadium IDs have snapshots, blocked retrieval differs from empty filtered results", () => {
  for (const stadium of stadiums) assert.ok(stadiumContent(stadium.id));
  assert.equal(stadiumContent("sofi").status, "retrieval-blocked");
  assert.equal(listedPlaces(att, "hotels", 0).length, 0);
});

test("AT&T transport uses the verified official address and travel page", () => {
  const transport = stadiumContent("att").transport;
  assert.equal(transport.address, "One AT&T Way, Arlington, TX 76011");
  assert.equal(transport.travelUrl, "https://attstadium.com/maps/game-day-map/");
  assert.equal(stadiumContent("bbva").transport.address, null);
});