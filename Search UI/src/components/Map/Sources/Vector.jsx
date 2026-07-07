import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import { mapParameters } from 'src/services/settings';

export function vector({ features }) {
    return new VectorSource({ features });
}

export function readGeoJsonFeature({ geoJsonFeature }) {
    return new GeoJSON().readFeature(geoJsonFeature);
}

export function readWktFeature({ wktFeature, crs }) {
    const wkt = new WKT();

    try {
        const feature = wkt.readFeature(wktFeature, {
            dataProjection: crs,
            featureProjection: mapParameters.defaultProjection
        });

        return feature;
    } catch (error) {
        console.error(error);
    }
}

export function wktVector({ wktFeature, crs }) {
    return vector({ features: [readWktFeature({ wktFeature, crs })] });
}
