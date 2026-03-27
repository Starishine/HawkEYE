# HawkEYE

Interactive map of Singapore hawker centres built with React, Vite, and Leaflet.

## Overview

HawkEYE displays hawker centres on a map and lets users:

- search by hawker centre name
- filter by region
- view status-based marker colors and legend
- click markers to see address and status details
- use browser geolocation to jump to current location

Data is loaded locally from bundled files:

- `src/data/hawkers.json`
- `src/data/postal_region.csv`

## Tech Stack

- React 19
- Vite 8
- Leaflet + React-Leaflet

## Prerequisites

- Node.js 18+ (Node.js 20 LTS recommended)
- npm (comes with Node.js)

## Setup

1. Clone or download this repository.
2. Open the project folder.
3. Install dependencies:

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in your terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Create production build
- `npm run preview`: Preview production build

## How to Use

1. Open the app.
2. Click the search icon in the top header.
3. Search hawker centres by name.
4. Filter by region from the dropdown.
5. Click a search result or map marker to focus a hawker centre.
6. Use **Find My Location** to show and fly to your current location.

## Project Structure

```text
src/
	api/
		fetchHawkers.jsx        # parse hawker data + postal-to-region mapping
	components/
		Map/
			MapView.jsx           # main map container + legend + region/user fly-to
		Markers/
			HawkerMarkers.jsx     # hawker marker + popup + status colors
			UserLocation.jsx      # user location marker/fly behavior
		Search/
			SearchHawkers.jsx     # side panel search + region filter
	data/
		hawkers.json            # hawker geo data
		postal_region.csv       # postal prefix to region map
	App.jsx                   # app state + layout + filtering
```

## Notes

- Geolocation requires browser permission.
- If location access is denied or unavailable, the app shows an error message in the map panel.
- Map tiles are provided by OpenStreetMap.
- List of Postal Districts obtained frm https://www.propertygiant.com/resource/singapore-postal-districts-map