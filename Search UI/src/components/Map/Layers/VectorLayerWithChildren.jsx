import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OLVectorLayer from 'ol/layer/Vector';

import { vector } from 'components/Map/Sources/Vector';
import MapContext from '../../../context/MapContext';

const VectorLayerWithChildren = ({ children, style, zIndex = 0 }) => {
    const { map } = useContext(MapContext);
    const [olLayer, setOlLayer] = useState();
    const [source] = useState(vector({}));

    useEffect(() => {
        if (!map) return;

        let vectorLayer = new OLVectorLayer({ source, style });

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

    useEffect(() => {
        for (const child of children) {
            if (Array.isArray(child)) {
                source.addFeatures(child);
            } else if (child) {
                source.addFeature(child);
            }
        }

        return () => {
            for (const child of children) {
                if (Array.isArray(child)) {
                    for (const feature of child) source.removeFeature(feature);
                } else if (child) {
                    source.removeFeature(child);
                }
            }
        };
    }, [children, source]);

    return null;
};

VectorLayerWithChildren.propTypes = {
    children: PropTypes.array,
    style: PropTypes.func,
    zIndex: PropTypes.number
};

export default VectorLayerWithChildren;
