import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OLTileLayer from 'ol/layer/Tile';
import OLWebGLTileLayer from 'ol/layer/WebGLTile';

import MapContext from '../../../context/MapContext';

const TileLayer = ({ source, extent, zIndex = 0, opacity = 1, protocol }) => {
    const { map } = useContext(MapContext);
    const [olLayer, setOlLayer] = useState();

    useEffect(() => {
        if (!map) return;

        let tileLayer;

        if (protocol === 'cog') {
            tileLayer = new OLWebGLTileLayer({
                source,
                extent,
                style: {
                    brightness: 0.2,
                    contrast: 0.2,
                    exposure: 1,
                    saturation: 0,
                    gamma: 1
                }
            });
        } else {
            tileLayer = new OLTileLayer({
                source,
                extent
            });
        }

        map.addLayer(tileLayer);
        setOlLayer(tileLayer);

        return () => {
            if (map) map.removeLayer(tileLayer);
        };
    }, [map, extent, source, protocol]);

    useEffect(() => {
        if (olLayer) olLayer.setOpacity(opacity);
    }, [opacity, olLayer]);

    useEffect(() => {
        if (olLayer) olLayer.setZIndex(zIndex);
    }, [opacity, zIndex, olLayer]);

    return null;
};

TileLayer.propTypes = {
    source: PropTypes.object,
    extent: PropTypes.array,
    zIndex: PropTypes.number,
    opacity: PropTypes.number,
    protocol: PropTypes.string
};

export default TileLayer;
