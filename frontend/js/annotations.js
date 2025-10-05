// annotations.js (stubbed for now)
export const annotations = {};

// Stub function: just returns an empty array instead of fetching labels
export async function loadAnnotations(datasetId) {
    return [];
}

// Optional helper for adding markers manually
export function addAnnotation(datasetId, lat, lng, label) {
    if (!annotations[datasetId]) annotations[datasetId] = [];
    const marker = L.marker([lat, lng]).bindPopup(label);
    annotations[datasetId].push(marker);
    return marker;
}