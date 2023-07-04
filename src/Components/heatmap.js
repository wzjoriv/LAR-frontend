import L from 'leaflet';

function heatmapIntensity(x, y, pixelLOIs, alphaLOIs) {
    let maxIntensity = 0;
    for (let i = 0; i < pixelLOIs.length; i++) {
        let dx = x - pixelLOIs[i][0];
        let dy = y - pixelLOIs[i][1];
        let distanceSquared = dx * dx + dy * dy;
        let intensity = Math.exp(-distanceSquared / (alphaLOIs * alphaLOIs));
        maxIntensity = Math.max(maxIntensity, intensity);
    }
    return maxIntensity;
}

var HeatmapLayer = L.GridLayer.extend({
    initialize: function(options) {
        L.setOptions(this, options);
        this.data = options.data;
        this.opacity = options.opacity || 1;
        this.maxZoom = options.maxZoom;
        this.minZoom = options.minZoom;
    },
    createTile: function(coords) {

        if (this._map.getZoom() > this.maxZoom || this._map.getZoom() < this.minZoom) {
            return L.DomUtil.create('div');
        }

        // create a <canvas> element for drawing
        var tile = L.DomUtil.create('canvas', 'leaflet-tile');
        // setup tile width and height according to the options
        var size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;
        // get a canvas context and draw something on it using coords.x, coords.y and coords.z
        var ctx = tile.getContext('2d');
        
        // set global alpha value
        ctx.globalAlpha = this.opacity;

        const centerPoint = this._map.latLngToContainerPoint(this._map.getCenter());
        const point2 = this._map.containerPointToLatLng(centerPoint.add(L.point(1, 0)));
        const meterToPixelRatio = 1 / this._map.distance(this._map.getCenter(), point2);
        
        // convert latLngLOIs to pixel coordinates
        const pixelLOIs = this.data.map(latLng => {
            let point = this._map.project(L.latLng(latLng), coords.z);
            let x = point.x - (coords.x * size.x);
            let y = point.y - (coords.y * size.y);
            return [x, y];
        });

        const alphaLOIs = 500 * meterToPixelRatio; // meters

        const tileCenterX = size.x / 2;
        const tileCenterY = size.y / 2;

        
        const threshold = Math.max(tileCenterX * 5, alphaLOIs * 5);

        const filteredPixelLOIs = pixelLOIs.filter(pixelLOI => {
            let dx = tileCenterX - pixelLOI[0];
            let dy = tileCenterY - pixelLOI[1];
            let distanceSquared = dx * dx + dy * dy;
            return distanceSquared < threshold * threshold;
        });
        
        // draw heatmap using data from LOIResponse or data
        var imagedata = ctx.createImageData(size.x, size.y);
        
        // draw heatmap using data from LOIResponse or data
        for (var x=0; x<size.x; x++) {
            for (var y=0; y<size.y; y++) {
                // Get the pixel index
                var pixelindex = (y * size.x + x) * 4;

                let intensity = heatmapIntensity(x, y, filteredPixelLOIs, alphaLOIs);
                
                // Interpolate between dark grey/black and blue
                let red   = intensity * 0 + (1 - intensity) * 64;
                let green = intensity * 0 + (1 - intensity) * 64;
                let blue  = intensity * 255 + (1 - intensity) * 64;
                
                // Set the pixel data
                imagedata.data[pixelindex]   = red;   // Red
                imagedata.data[pixelindex+1] = green; // Green
                imagedata.data[pixelindex+2] = blue;  // Blue
                imagedata.data[pixelindex+3] = 255;   // Alpha
            }
        }

        ctx.putImageData(imagedata, 0, 0);
        
        // return the tile so it can be rendered on screen
        return tile;
    },
    setData: function(data) {
        this.data = data;
        this.redraw();
    }
});

var heatmapLayer;

function renderHeatmap(map, data) {
    console.log("Render");
    let latLngLOIs = Object.values(data.dbs).flat();
    latLngLOIs = latLngLOIs.map(entry =>
        [entry.geometry.coordinates[1], entry.geometry.coordinates[0]]
    );
    
    if (!heatmapLayer) {
        heatmapLayer = new HeatmapLayer({
            data: latLngLOIs,
            opacity: 0.5,
            maxZoom: 19,
            minZoom: 13
        });
        heatmapLayer.addTo(map);
    } else {
        heatmapLayer.setData(latLngLOIs);
    }
}

export default renderHeatmap;