// datasets

export const datasets = {
    "mars-mola": {
        layer: L.tileLayer.wms("https://planetarymaps.usgs.gov/cgi-bin/mapserv", {
            layers: "MDIM21",
            format: "image/png",
            version: "1.3.0",
            crs: L.CRS.EPSG4326,
            attribution: "USGS Astrogeology Science Center"
        }),
        displayName: "Mars MOLA"
    },
    "earth-modis": {
        layer: L.tileLayer.wms("https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi", {
            layers: "MODIS_Terra_CorrectedReflectance_TrueColor",
            format: "image/png",
            version: "1.3.0",
            crs: L.CRS.EPSG4326,
            attribution: "NASA EarthData"
        }),
        displayName: "Earth MODIS"
    }
    //, // commented because this one isnt cors compatible fsr
    //"moon-lroc": {
    //    layer: L.tileLayer.wms("https://planetarymaps.usgs.gov/cgi-bin/mapserv", {
    //        layers: "LROC_WAC",
    //        format: "image/png",
    //        version: "1.3.0",
    //        crs: L.CRS.EPSG4326,
    //        attribution: "USGS Lunar Reconnaissance Orbiter"
    //    }),
    //    displayName: "Moon LROC"
    //}
};