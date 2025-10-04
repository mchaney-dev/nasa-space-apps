// app

// Minimal Leaflet map
const map = L.map('map', {
    center: [0, 0], // Equator / Prime Meridian
    zoom: 2,
    minZoom: 0,
    maxZoom: 9
});

// Simple dataset tile layer (Mars MOLA example)
const marsMola = L.tileLayer(
  'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/Mars/Mars_MGS_MOLA_ClrShade_global_463m.map&service=WMTS&request=GetTile&version=1.0.0&layer=Mars_MGS_MOLA_ClrShade_global_463m&tilematrixset=GoogleMapsCompatible_Level9&tilematrix={z}&tilerow={y}&tilecol={x}&format=image/jpeg',
  {
      attribution: "USGS Astrogeology Science Center",
      tileSize: 256,
      minZoom: 0,
      maxZoom: 9
  }
).addTo(map);
