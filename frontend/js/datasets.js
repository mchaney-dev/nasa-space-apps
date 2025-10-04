// datasets

export const datasets = {};

export async function loadDatasets() {
    try {
        const res = await fetch("http://127.0.0.1:8000/datasets/");
        const data = await res.json();

        data.forEach(ds => {
            datasets[ds.dataset_id] = {
                id: ds.dataset_id,
                name: ds.name,
                attribution: ds.description || "",
                tileUrlTemplate: ds.source,
                layer: null
            };
        });

        return datasets;
    } catch (err) {
        console.error("Failed to fetch datasets:", err);
        return {};
    }
}


export function createTileLayer(datasetId) {
    const ds = datasets[datasetId];
    if (!ds) return null;

    // Leaflet replaces {z}, {x}, {y} automatically
    return L.tileLayer(ds.tileUrlTemplate, {
        attribution: ds.attribution,
        maxZoom: 12,
        tileSize: 256
    });
}