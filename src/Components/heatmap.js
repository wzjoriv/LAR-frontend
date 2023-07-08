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

        var tile = L.DomUtil.create('canvas', 'leaflet-tile');
        var size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;
        var ctx = tile.getContext('2d');
        
        ctx.globalAlpha = this.opacity;

        const centerPoint = this._map.latLngToContainerPoint(this._map.getCenter());
        const point2 = this._map.containerPointToLatLng(centerPoint.add(L.point(1, 0)));
        const meterToPixelRatio = 1 / this._map.distance(this._map.getCenter(), point2);
        
        const pixelLOIs = this.data.map(latLng => {
            let point = this._map.project(L.latLng(latLng), coords.z);
            let x = point.x - (coords.x * size.x);
            let y = point.y - (coords.y * size.y);
            return [x, y];
        });

        const alphaLOIs = 250 * meterToPixelRatio; // meters

        const tileCenterX = size.x / 2;
        const tileCenterY = size.y / 2;

        
        const threshold = Math.max(tileCenterX * 5, alphaLOIs * 5);

        const filteredPixelLOIs = pixelLOIs.filter(pixelLOI => {
            let dx = tileCenterX - pixelLOI[0];
            let dy = tileCenterY - pixelLOI[1];
            let distanceSquared = dx * dx + dy * dy;
            return distanceSquared < threshold * threshold;
        });
        
        var imagedata = ctx.createImageData(size.x, size.y);
        
        for (var x=0; x<size.x; x++) {
            for (var y=0; y<size.y; y++) {
                var pixelindex = (y * size.x + x) * 4;

                let intensity = heatmapIntensity(x, y, filteredPixelLOIs, alphaLOIs);
                
                let red   = intensity * 255 + (1 - intensity) * 0;
                let green = intensity * 0 + (1 - intensity) * 255;
                let blue  = intensity * 0 + (1 - intensity) * 0;
                let alpha = intensity * 255 + (1 - intensity) * 150;
                
                imagedata.data[pixelindex]   = red;   // Red
                imagedata.data[pixelindex+1] = green; // Green
                imagedata.data[pixelindex+2] = blue;  // Blue
                imagedata.data[pixelindex+3] = alpha;   // Alpha
            }
        }

        ctx.putImageData(imagedata, 0, 0);
        
        return tile;
    },
    setData: function(data) {
        this.data = data;
        this.redraw();
    }
});

var heatmapLayer;

function renderHeatmap(map, data) {

    if (!data) return;

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

function toggleHeatmap(toggle, map){
    if (!heatmapLayer) return;

    
    heatmapLayer.removeFrom(map);
    if (toggle) heatmapLayer.addTo(map);
}

export {renderHeatmap, toggleHeatmap};