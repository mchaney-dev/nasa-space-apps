// annotations

// frontend/js/annotations.js
export const annotations = {};

export async function loadAnnotations(datasetId) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/labels/?dataset_id=${datasetId}`);
        const data = await res.json();

        annotations[datasetId] = data.map(item =>
            L.marker([item.lat, item.lng]).bindPopup(item.label)
        );
        return annotations[datasetId];
    } catch (err) {
        console.error(`Failed to load labels for ${datasetId}:`, err);
        annotations[datasetId] = [];
        return [];
    }
}

export function addAnnotation(datasetId, lat, lng, label) {
    if (!annotations[datasetId]) annotations[datasetId] = [];
    const marker = L.marker([lat, lng]).bindPopup(label);
    annotations[datasetId].push(marker);
    return marker;
}
