// app

// Minimal Leaflet map
const map = L.map('map', {
    center: [0, 0], // Equator / Prime Meridian
    zoom: 2,
    minZoom: 0,
    maxZoom: 9
});

// Simple dataset tile layer (Mars MOLA example)
const marsWMS = L.tileLayer.wms("https://planetarymaps.usgs.gov/cgi-bin/mapserv", {
    layers: "MDIM21",
    format: "image/png",
    transparent: false,
    version: "1.3.0",
    attribution: "USGS Astrogeology Science Center",
    crs: L.CRS.EPSG4326
}).addTo(map);
