import L from "leaflet";
import "leaflet-side-by-side";
import { datasets, loadDatasets, createTileLayer } from "./datasets.js";
import { annotations, loadAnnotations } from "./annotations.js";

console.log("App.js loaded");

let sideBySideControl = null;
let compareLayer = null;
let map;
let currentLayer = null;

async function init() {
    initMap();                  // create map first
    await loadDatasets();       // load datasets from backend
    console.log("Datasets loaded:", datasets);

    setupSelector();            // build dropdowns
    buildLayerPanel();          // build sidebar

    const datasetIds = Object.keys(datasets);
    if (datasetIds.length > 0) {
        switchDataset(datasetIds[0]); // use real key
    }
    // Ensure Leaflet recalculates container size
    setTimeout(() => map.invalidateSize(), 100);

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
    if (!map) console.error("Map not initialized yet!");
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
    map.fitBounds(bounds);

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
    if (!info || !ds) return; // safely skip
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

            // Use the first feature from results
            const f = features[0];
            if (f.coordinates && f.coordinates.lat !== undefined && f.coordinates.lon !== undefined) {

                // Remove previous search marker
                if (window.searchMarker) {
                    map.removeLayer(window.searchMarker);
                }

                // Ensure the dataset containing this feature is visible
                if (f.datasetId && datasets[f.datasetId] && datasets[f.datasetId].layer) {
                    if (!map.hasLayer(datasets[f.datasetId].layer)) {
                        datasets[f.datasetId].layer.addTo(map);
                    }
                }

                // Determine a suitable zoom level (not too far)
                const zoomLevel = Math.min(map.getMaxZoom() || 7, 6);

                // Zoom to the feature
                map.setView([f.coordinates.lat, f.coordinates.lon], zoomLevel);

                // Add marker and open popup
                window.searchMarker = L.marker([f.coordinates.lat, f.coordinates.lon])
                    .bindPopup(`<b>${f.name}</b><br>${f.description || ""}`)
                    .addTo(map)
                    .openPopup();
            }
        } catch (err) {
            console.error("Error searching features:", err);
        }
    });
}

// --- Dynamic Layer Panel UI ---
function buildLayerPanel() {
  const container = document.getElementById("layer-list");
  container.innerHTML = "";

  const currentDatasetId = Object.keys(datasets).find(
    id => datasets[id].layer === currentLayer
  );

  Object.values(datasets).forEach(ds => {
    const card = document.createElement("div");
    card.className =
      "bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm";

    if (ds.id === currentDatasetId) {
      // Only show opacity slider for the base layer
      card.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold text-sky-300">${ds.name} (Base)</h3>
        </div>
        <label class="block text-xs mb-1">Opacity</label>
        <input type="range" min="0" max="1" step="0.05" value="${ds.layer ? ds.layer.options.opacity || 1 : 1}"
          class="opacity-slider w-full mb-2" data-id="${ds.id}">
      `;
    } else {
      // Full controls for other layers
      card.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold text-sky-300">${ds.name}</h3>
          <label class="flex items-center gap-1">
            <input type="checkbox" class="toggle-layer accent-sky-500" data-id="${ds.id}" ${ds.layer ? "checked" : ""}>
            <span>On</span>
          </label>
        </div>
        <p class="text-slate-400 text-xs mb-2">${ds.description || ""}</p>
        <label class="block text-xs mb-1">Opacity</label>
        <input type="range" min="0" max="1" step="0.05" value="${ds.layer ? ds.layer.options.opacity || 1 : 1}"
          class="opacity-slider w-full mb-2" data-id="${ds.id}">
        <button class="focus-btn bg-slate-700 hover:bg-slate-600 w-full rounded p-1 text-xs" data-id="${ds.id}">Focus</button>
      `;
    }

    container.appendChild(card);
  });

  attachLayerPanelEvents();
}

function attachLayerPanelEvents() {
  document.querySelectorAll(".toggle-layer").forEach(chk => {
    chk.addEventListener("change", e => {
      const dsId = e.target.dataset.id;
      if (e.target.checked) {
        const layer = createTileLayer(dsId);
        layer.addTo(map);
        layer.datasetId = dsId;
        datasets[dsId].layer = layer;
      } else {
        const layer = datasets[dsId].layer;
        if (layer) {
          map.removeLayer(layer);
        }
      }
    });
  });

  document.querySelectorAll(".opacity-slider").forEach(slider => {
    slider.addEventListener("input", e => {
      const dsId = e.target.dataset.id;
      const layer = datasets[dsId].layer;
      if (layer) layer.setOpacity(parseFloat(e.target.value));
    });
  });

  document.querySelectorAll(".focus-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const dsId = e.target.dataset.id;
      const ds = datasets[dsId];
      if (ds && ds.bbox) {
        const bounds = [
          [ds.bbox[0], ds.bbox[1]],
          [ds.bbox[2], ds.bbox[3]]
        ];
        map.fitBounds(bounds);
      }
    });
  });
}

init();