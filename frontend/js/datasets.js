// datasets

export const datasets = {};

export async function loadDatasets() {
    try {
        const res = await fetch("http://127.0.0.1:8000/datasets/");
        const data = await res.json();

        data.forEach(ds => {
            datasets[ds.id] = {
                id: ds.id,
                name: ds.name,
                attribution: ds.attribution || "",
                tileUrl: `http://127.0.0.1:8000/tiles/${ds.id}/${ds.z}/${ds.x}/${ds.y}.png`,
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

    return L.tileLayer(ds.tileUrl, {
        attribution: ds.attribution,
        maxZoom: 12,
        tileSize: 256
    });
}


//export const datasets = {

//    "mars-mola": {
//        layer: L.tileLayer.wms("https://planetarymaps.usgs.gov/cgi-bin/mapserv", {
//            layers: "MDIM21",
//            format: "image/png",
//            version: "1.3.0",
//            crs: L.CRS.EPSG4326,
//            attribution: "USGS Astrogeology Science Center"
//        }),
//        displayName: "Mars MOLA"
//    },
//    "earth-modis": {
//        layer: L.tileLayer.wms("https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi", {
//            layers: "MODIS_Terra_CorrectedReflectance_TrueColor",
//            format: "image/png",
//            version: "1.3.0",
//            crs: L.CRS.EPSG4326,
//            attribution: "NASA EarthData"
//        }),
//        displayName: "Earth MODIS"
//    }
//    //, // commented because this one isnt cors compatible fsr
//    //"moon-lroc": {
//    //    layer: L.tileLayer.wms("https://planetarymaps.usgs.gov/cgi-bin/mapserv", {
//    //        layers: "LROC_WAC",
//    //        format: "image/png",
//    //        version: "1.3.0",
//    //        crs: L.CRS.EPSG4326,
//    //        attribution: "USGS Lunar Reconnaissance Orbiter"
//    //    }),
//    //    displayName: "Moon LROC"
//    //}
//};
