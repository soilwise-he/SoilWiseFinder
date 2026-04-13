import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OLVectorLayer from 'ol/layer/Vector';

import MapContext from '../../../context/MapContext';

const VectorLayer = ({ source, style, zIndex = 0, properties = {} }) => {
    const { map } = useContext(MapContext);
    const [olLayer, setOlLayer] = useState();

    useEffect(() => {
        if (!map) return;

        let vectorLayer = new OLVectorLayer({ source, style, properties });

        map.addLayer(vectorLayer);
        setOlLayer(vectorLayer);

        return () => {
            if (map) map.removeLayer(vectorLayer);
        };
    }, [map, source, style]);

    useEffect(() => {
        if (!map || !olLayer) return;

        olLayer.setZIndex(zIndex);
    }, [map, zIndex, olLayer]);

    return null;
};

VectorLayer.propTypes = {
    source: PropTypes.object,
    style: PropTypes.func,
    zIndex: PropTypes.number,
    properties: PropTypes.object
};

export default VectorLayer;
