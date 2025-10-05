import L from "leaflet";
import "leaflet-side-by-side";
import { datasets, loadDatasets, createTileLayer } from "./datasets.js";
import { annotations, loadAnnotations } from "./annotations.js";

let sideBySideControl = null;
let compareLayer = null;
let map;
let currentLayer = null;

async function init() {
    // load datasets from backend
    await loadDatasets();

    // initialize selector
    setupSelector();

    // initialize the map
    initMap();

    // setup feature search
    setupFeatureSearch();
}

function initMap() {
    map = L.map("map", {
        crs: L.CRS.EPSG4326,
        minZoom: 0,
        maxZoom: 7,
        center: [0, 0],
        zoom: 0
    });

    const datasetIds = Object.keys(datasets);
    if (datasetIds.length === 0) return;

    const firstDatasetId = datasetIds[0];
    switchDataset(firstDatasetId);
}

function setupSelector() {
    const select = document.getElementById("dataset-selector");
    const compareSelect = document.getElementById("compare-selector");

    select.innerHTML = "";
    compareSelect.innerHTML = '<option value="">(None)</option>';

    Object.values(datasets).forEach(ds => {
        const opt = document.createElement("option");
        opt.value = ds.id;
        opt.textContent = ds.name;
        select.appendChild(opt);

        const opt2 = opt.cloneNode(true);
        compareSelect.appendChild(opt2);
    });

    select.addEventListener("change", e => switchDataset(e.target.value));
    compareSelect.addEventListener("change", e => setupComparison(e.target.value));
}

async function switchDataset(datasetId) {
    if (!map || !datasets[datasetId]) return;

    if (currentLayer) map.removeLayer(currentLayer);

    const newLayer = createTileLayer(datasetId);
    if (!newLayer) return;

    currentLayer = newLayer.addTo(map);

    // restrict bounds dynamically
    const ds = datasets[datasetId];
    const bounds = [
        [ds.bbox[0], ds.bbox[1]],
        [ds.bbox[2], ds.bbox[3]]
    ];
    map.setMaxBounds(bounds);

    // zoom to dataset extent initially
    if (!currentLayer) map.fitBounds(bounds);

    // load annotations for this dataset
    const labels = await loadAnnotations(datasetId);
    labels.forEach(m => m.addTo(map));

    // update info panel
    updateInfoPanel(datasetId);
}

function setupComparison(compareDatasetId) {
    if (sideBySideControl) {
        map.removeControl(sideBySideControl);
        sideBySideControl = null;
    }
    if (compareLayer) {
        map.removeLayer(compareLayer);
        compareLayer = null;
    }

    if (!compareDatasetId || !currentLayer) return;

    const ds = datasets[compareDatasetId];
    if (!ds) return;

    // clone the layer to allow comparison
    compareLayer = createTileLayer(compareDatasetId);
    if (!compareLayer) return;

    compareLayer.addTo(map);

    // set a slightly lower opacity to make the swipe effect visible
    compareLayer.setOpacity(0.8);

    // attach side-by-side control
    sideBySideControl = L.control.sideBySide(currentLayer, compareLayer).addTo(map);

    console.log("SideBySide control:", sideBySideControl);
}

function updateInfoPanel(datasetId) {
    const info = document.getElementById("info-panel");
    const ds = datasets[datasetId];
    if (!ds) return;

    info.innerHTML = `
        <h3>${ds.name}</h3>
        <p>${ds.attribution || ds.description || ""}</p>
    `;
}

function setupFeatureSearch() {
    const input = document.getElementById("feature-search");
    const btn = document.getElementById("search-btn");

    btn.addEventListener("click", async () => {
        const query = input.value.trim();
        if (!query) return;

        let url = "/features/?";
        const coordMatch = query.match(/(-?\d+(\.\d+)?)[ ,]+(-?\d+(\.\d+)?)/);

        if (coordMatch) {
            // If user entered "lat, lon"
            const lat = parseFloat(coordMatch[1]);
            const lon = parseFloat(coordMatch[3]);
            url += `lat=${lat}&lon=${lon}`;
        } else {
            // Otherwise treat as name search
            url += `name=${encodeURIComponent(query)}`;
        }

        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error("Failed to fetch features:", res.status);
                return;
            }

            const features = await res.json();
            if (features.length === 0) {
                alert("No features found.");
                return;
            }

            // Zoom to the first result
            const f = features[0];
            if (f.coordinates && f.coordinates.lat !== undefined && f.coordinates.lon !== undefined) {
                map.setView([f.coordinates.lat, f.coordinates.lon], 4);

                // Add marker for the feature
                L.marker([f.coordinates.lat, f.coordinates.lon])
                    .bindPopup(`<b>${f.name}</b><br>${f.description || ""}`)
                    .addTo(map)
                    .openPopup();
            }
        } catch (err) {
            console.error("Error searching features:", err);
        }
    });
}

init();