// datasets

export const datasets = {};

export async function loadDatasets() {
    try {
        const res = await fetch("/datasets/");
        
        // check HTTP status
        if (!res.ok) {
            console.error("Failed to fetch datasets: HTTP", res.status, await res.text());
            return {};
        }

        const data = await res.json();

        if (!data || !Array.isArray(data)) {
            console.error("Datasets response is not an array:", data);
            return {};
        }

        data.forEach(ds => {
            datasets[ds.dataset_id] = {
                id: ds.dataset_id,
                name: ds.name,
                attribution: ds.description || "",
                tileUrlTemplate: ds.source,
                bbox: ds.bbox || [-90, -180, 90, 180],
                maxNativeZoom: ds.maxNativeZoom || 7,
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

    const layer = L.tileLayer(ds.tileUrlTemplate, {
        attribution: ds.attribution,
        minZoom: 0,
        maxZoom: 7,
        maxNativeZoom: ds.maxNativeZoom,
        tileSize: 256,
        tms: false
    });

    const bounds = [
        [ds.bbox[0], ds.bbox[1]],
        [ds.bbox[2], ds.bbox[3]]
    ];
    layer.on('add', () => {
        map.setMaxBounds(bounds);
    });

    return layer;
}