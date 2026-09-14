<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Dubai Population & Density | Smart Indexes</title>
  <meta name="description" content="Interactive geoanalytics showcase of Dubai population distribution and population density by communities.">
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet">
  <link rel="stylesheet" href="assets/app.css">
</head>
<body>
  <div id="map"></div>

  <section class="panel" aria-label="Map controls">
    <h1>Dubai Population & Density</h1>
    <div class="controls">
      <label><input type="radio" name="metric" value="population" checked> Population</label>
      <label><input type="radio" name="metric" value="density_sq_km"> Density</label>
    </div>
  </section>

  <aside id="legend" class="legend" aria-label="Map legend"></aside>

  <div id="brand">Smart Indexes</div>

  <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
  <script src="assets/config.js"></script>
  <script src="assets/app.js"></script>
</body>
</html>
