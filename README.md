# ⚽ Football Stadium Explorer

An interactive map to explore 16 football stadiums and discover what’s nearby, from places to stay and eat to useful travel information.

Built with Lovable as a personal project to experiment, learn, and turn an idea into something people can explore.

## 🗺️ Features

### Explore stadiums
- Browse 16 stadiums on an interactive map.
- Select a map pin or choose a stadium from the list.
- View stadium information and photographs.
- Zoom and pan to explore the surrounding area.

### 🏨 Find nearby hotels
- Browse hotels near the selected stadium.
- Filter by distance: 1, 1.5, or 3 miles.
- View results ordered from nearest to farthest.
- See matching locations on the map.
- Open available links to learn more.

### 🍽️ Discover places to eat
- Explore nearby food and drink venues.
- Narrow results using six categories.
- Filter by distance and compare nearby options.
- View places as cards and map pins.

### 🚉 Plan your visit
- Find available stadium address and travel information.
- Follow links to official stadium travel pages.
- Open available place links for further details.

## ⚙️ How it works

Hotel and eatery listings come from bundled OpenStreetMap datasets. Filtering and distance calculations happen in the browser, without live place-search API calls.

The dataset includes:
- **514 hotels**
- **7,639 food and drink venues**
- **8,153 place records in total**

Distances are measured in a straight line from the stadium, rather than along walking or driving routes.

## 🛠️ Built with

- **Lovable** for building and iterating on the app
- **React and TypeScript** for the interface and application logic
- **Leaflet** for the interactive map
- **OpenStreetMap** for map tiles and place data
- **Tailwind CSS** for styling

## 📝 Things to know

- Place listings are a saved snapshot and may change over time.
- The app does not provide live hotel availability, booking prices, or turn-by-turn navigation.
- Map tiles require an internet connection.
- Travel information and external links may vary by stadium.

## 🙌 Attribution

Map and place data © OpenStreetMap contributors. OpenStreetMap data is available under the Open Database License (ODbL). See the project’s data license documentation for additional attribution and collection details.

## 💡 About this project

A space for side quests, learning, and trying out new ideas. Built to explore how interactive maps and useful local information can come together in a simple experience.
