# Dubai Population & Density

Interactive geoanalytics showcase of Dubai population distribution and population density by administrative communities.

The project demonstrates a lightweight PHP + JavaScript microSPA with Mapbox GL JS and GeoJSON. Users can switch between total population and population density, inspect community-level values, and filter map features by legend ranges.

## What it demonstrates

- Community-level population visualization
- Population density in people/km²
- Dynamic metric switching
- Choropleth color segmentation
- Interactive legend filtering
- Community popup details
- Responsive Mapbox interface

## Methodology

The original Smart Indexes research combined official population data with Dubai community boundaries and area values. Population density is calculated as:

```text
density = ROUND(population / plot_area_sq_km)
```

The source showcase describes the analysis of all 221 Dubai communities using official and verified population data, community area data, and interactive map ranking.

## Public demo data

This repository intentionally contains a small sanitized GeoJSON sample only. Production datasets and full administrative geometry are not included.

The public sample uses demo identifiers and a limited number of polygons while preserving the field structure used by the visualization.

## Mapbox token

Copy `assets/config.example.js` to `assets/config.js` and insert your own Mapbox public token:

```js
window.APP_CONFIG = {
  MAPBOX_TOKEN: 'YOUR_MAPBOX_PUBLIC_TOKEN',
  DATA_URL: 'data/communities-sample.geojson'
};
```

Do not commit private credentials or production tokens.

## Stack

- PHP
- JavaScript
- Mapbox GL JS
- GeoJSON
- CSS

## Run locally

```bash
php -S localhost:8000
```

Then open `http://localhost:8000`.

## Repository scope

This repository is a public portfolio showcase derived from Smart Indexes geoanalytics work. It does not include the full Smart Indexes platform, production data pipelines, proprietary datasets, or production credentials.

## Smart Indexes

https://smartindexes.com/
