// imports
import { datasets, loadDatasets, createTileLayer } from "./datasets.js";
import { annotations, loadAnnotations } from "./annotations.js";

let map;
let currentLayer = null;

async function init() {
    // load datasets from backend
    await loadDatasets();

    // initialize selector
    setupSelector();

    // initialize the map
    initMap();
}

function initMap() {
    map = L.map("map").setView([0, 0], 2);

    // get first dataset id
    const datasetIds = Object.keys(datasets);
    if (datasetIds.length === 0) return;

    const firstDatasetId = datasetIds[0];

    // switch to first dataset
    switchDataset(firstDatasetId);
}

function setupSelector() {
    const select = document.getElementById("dataset-selector");

    // clear existing options (if any)
    select.innerHTML = "";

    // add option for each dataset
    Object.values(datasets).forEach(ds => {
        const opt = document.createElement("option");
        opt.value = ds.id;
        opt.textContent = ds.name;
        select.appendChild(opt);
    });

    // listen for changes
    select.addEventListener("change", e => switchDataset(e.target.value));
}

async function switchDataset(datasetId) {
    if (!map || !datasets[datasetId]) return;

    // remove old layer
    if (currentLayer) map.removeLayer(currentLayer);

    // create new tile layer using template URL
    const newLayer = createTileLayer(datasetId);
    if (!newLayer) return;

    currentLayer = newLayer.addTo(map);

    // load annotations for this dataset
    const labels = await loadAnnotations(datasetId);
    labels.forEach(m => m.addTo(map));

    // update info panel
    updateInfoPanel(datasetId);
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

init();