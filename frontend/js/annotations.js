// annotations

import { datasets } from './datasets.js';
import { currentDataset } from './app.js';

export const annotations = {};
// initialize blank annotation lists
Object.keys(datasets).forEach(key => annotations[key] = []);

// Click-to-add marker
export function setupAnnotation(map) {
  map.on("click", e => {
    const label = prompt("Enter label:");
    if (!label) return;

    const marker = L.marker(e.latlng).bindPopup(label).addTo(map);
    annotations[currentDataset].push(marker);
  });
}

// save with REST
//export async function saveAnnotations(datasetKey) {
//  const data = annotations[datasetKey].map(marker => ({
//    lat: marker.getLatLng().lat,
//    lng: marker.getLatLng().lng,
//    label: marker.getPopup().getContent()
//  }));
//  await fetch(`/api/labels/${datasetKey}`, {
//    method: "POST",
//    headers: { "Content-Type": "application/json" },
//    body: JSON.stringify(data)
//  });
//}
