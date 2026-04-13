import * as olSource from 'ol/source';

export function OpenStreetMap() {
    return new olSource.OSM({
        attributions: [
            '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        ]
    });
}

export function CartoCDN() {
    return new olSource.XYZ({
        url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        attributions: '© OpenStreetMap contributors, © CARTO'
    });
}
