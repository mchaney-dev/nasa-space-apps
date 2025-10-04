// imports

import { datasets } from './datasets.js';
import { annotations, setupAnnotation } from './annotations.js';

// helper functions

function updateInfoPanel() {
    document.getElementById("info-panel").innerHTML =
        `Dataset: ${datasets[currentDataset].displayName} | Zoom: ${map.getZoom()}`;
}

// Minimal Leaflet map
const map = L.map('map', {
    center: [0, 0], // Equator / Prime Meridian
    zoom: 2,
    minZoom: 0,
    maxZoom: 9
});

const datasetSelector = document.getElementById("dataset-selector");

// Dynamically populate the selector
Object.keys(datasets).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.text = datasets[key].displayName;
    datasetSelector.appendChild(option);
});

// Initial dataset
export let currentDataset = Object.keys(datasets)[0];
let currentLayer = datasets[currentDataset].layer.addTo(map);
datasetSelector.value = currentDataset;

// Optional overlay layer opacity slider skeleton
// // ok currently this is also blocked by opaque-response
//const overlayLayer = L.tileLayer.wms("https://planetarymaps.usgs.gov/cgi-bin/mapserv", {
//    layers: "THEMIS_IR",
//    format: "image/png",
//    version: "1.3.0",
//    crs: L.CRS.EPSG4326,
//    opacity: 1
//}).addTo(map);

// Listeners

document.getElementById("opacity-slider").addEventListener("input", e => {
    overlayLayer.setOpacity(e.target.value);
});

document.getElementById("dataset-selector").addEventListener("change", e => {
    // Remove current tile layer
    map.removeLayer(currentLayer);
    // Remove current dataset markers
    annotations[currentDataset].forEach(marker => map.removeLayer(marker));

    // Switch dataset
    currentDataset = e.target.value;
    currentLayer = datasets[currentDataset].layer.addTo(map);

    // Add markers for the new dataset
    annotations[currentDataset].forEach(marker => marker.addTo(map));
    // Update info panel
    updateInfoPanel();
});

map.on("zoomend", () => {
    updateInfoPanel();
});

setupAnnotation(map);
//map.on("click", function(e) {
//    const label = prompt("Enter label for this location:");
//    if (!label) return;

//    // Create marker
//    const marker = L.marker(e.latlng)
//        .bindPopup(label)
//        .addTo(map);
//    console.log({lat: e.latlng.lat, lng: e.latlng.lng, label}); // later send to backend

//    // Store marker in current dataset's array
//    annotations[currentDataset].push(marker);
//});
