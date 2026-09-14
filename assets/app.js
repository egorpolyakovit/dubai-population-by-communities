(() => {
  const cfg = window.APP_CONFIG || {};
  if (!cfg.MAPBOX_TOKEN || cfg.MAPBOX_TOKEN === 'YOUR_MAPBOX_PUBLIC_TOKEN') {
    console.warn('Set MAPBOX_TOKEN in assets/config.js');
  }

  mapboxgl.accessToken = cfg.MAPBOX_TOKEN || '';

  const metricConfig = {
    population: {
      title: 'Population',
      thresholds: [0, 50000, 100000, 150000, 195000],
      colors: ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'],
      labels: ['Min: < 50,000', 'Low: 50,000–100,000', 'Medium: 100,000–150,000', 'High: 150,000–195,000', 'Max: 195,000+']
    },
    density_sq_km: {
      title: 'Density (people/km²)',
      thresholds: [0, 100, 500, 1000, 2000],
      colors: ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'],
      labels: ['Min: 0–100', 'Low: 100–500', 'Medium: 500–1,000', 'High: 1,000–2,000', 'Max: 2,000+']
    }
  };

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [55.27, 25.20],
    zoom: 9
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  const colorExpression = metric => {
    const { thresholds, colors } = metricConfig[metric];
    const expr = ['step', ['to-number', ['get', metric]], colors[0]];
    thresholds.slice(1).forEach((threshold, i) => expr.push(threshold, colors[i + 1]));
    return expr;
  };

  const resetFilter = () => {
    if (map.getLayer('comm-fill')) map.setFilter('comm-fill', null);
    document.querySelectorAll('.legend-item').forEach(el => el.classList.remove('active'));
  };

  const updateStyle = metric => {
    map.setPaintProperty('comm-fill', 'fill-color', colorExpression(metric));
  };

  const onLegendClick = function () {
    const metric = this.dataset.metric;
    const i = Number(this.dataset.idx);
    const thresholds = metricConfig[metric].thresholds;
    const low = thresholds[i];
    const high = i < thresholds.length - 1 ? thresholds[i + 1] : Infinity;
    const filter = i < thresholds.length - 1
      ? ['all', ['>=', ['to-number', ['get', metric]], low], ['<', ['to-number', ['get', metric]], high]]
      : ['>=', ['to-number', ['get', metric]], low];

    map.setFilter('comm-fill', filter);
    document.querySelectorAll('.legend-item').forEach(el => el.classList.remove('active'));
    this.classList.add('active');
  };

  const updateLegend = metric => {
    const { title, colors, labels } = metricConfig[metric];
    const legend = document.getElementById('legend');
    legend.innerHTML = '';

    const heading = document.createElement('h3');
    heading.textContent = title;
    legend.appendChild(heading);

    labels.forEach((label, i) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'legend-item';
      item.dataset.idx = i;
      item.dataset.metric = metric;
      item.innerHTML = `<span class="legend-color" style="background:${colors[i]}"></span><span>${label}</span>`;
      item.addEventListener('click', onLegendClick);
      legend.appendChild(item);
    });

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'legend-reset';
    reset.textContent = 'Show all';
    reset.addEventListener('click', resetFilter);
    legend.appendChild(reset);
  };

  map.on('load', async () => {
    try {
      const response = await fetch(cfg.DATA_URL || 'data/communities-sample.geojson');
      if (!response.ok) throw new Error(`GeoJSON request failed: ${response.status}`);
      const data = await response.json();

      map.addSource('communities', { type: 'geojson', data, promoteId: 'id' });

      const bounds = new mapboxgl.LngLatBounds();
      data.features.forEach(feature => {
        const g = feature.geometry;
        if (!g) return;
        if (g.type === 'Polygon') g.coordinates.forEach(r => r.forEach(pt => bounds.extend(pt)));
        if (g.type === 'MultiPolygon') g.coordinates.forEach(p => p.forEach(r => r.forEach(pt => bounds.extend(pt))));
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 50, maxZoom: 11 });

      map.addLayer({
        id: 'comm-fill',
        type: 'fill',
        source: 'communities',
        paint: { 'fill-opacity': 0.72, 'fill-color': colorExpression('population') }
      });

      map.addLayer({
        id: 'comm-outline',
        type: 'line',
        source: 'communities',
        paint: { 'line-color': '#ffffff', 'line-width': 1 }
      });

      map.on('click', 'comm-fill', e => {
        const p = e.features[0].properties;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<h2>${p.community_name_en || 'Dubai Community'}</h2>` +
            `<p><b>Community number:</b> ${p.community_number ?? '—'}</p>` +
            `<p><b>Population:</b> ${Number(p.population || 0).toLocaleString()} people</p>` +
            `<p><b>Density:</b> ${Number(p.density_sq_km || 0).toLocaleString()} people/km²</p>` +
            `<p><b>Area:</b> ${p.plot_square_sq_km ?? '—'} km²</p>`
          )
          .addTo(map);
      });

      map.on('mouseenter', 'comm-fill', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'comm-fill', () => { map.getCanvas().style.cursor = ''; });

      document.querySelectorAll('input[name="metric"]').forEach(input => {
        input.addEventListener('change', e => {
          const metric = e.target.value;
          resetFilter();
          updateStyle(metric);
          updateLegend(metric);
        });
      });

      updateLegend('population');
    } catch (error) {
      console.error(error);
      document.getElementById('legend').innerHTML = '<p>Unable to load demo data.</p>';
    }
  });
})();
