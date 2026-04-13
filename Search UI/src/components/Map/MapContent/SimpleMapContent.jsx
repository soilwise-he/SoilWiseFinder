import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import TileLayer from 'components/Map/Layers/TileLayer';
import VectorLayer from 'components/Map/Layers/VectorLayer';
import { CartoCDN } from 'components/Map/Sources/BaseMaps';
import { vector, wktVector } from 'components/Map/Sources/Vector';
import { useMap } from 'src/context/MapContext';
import { getDataStyle } from 'src/style/mapStyle';
import Controls from '../Controls/Controls';
import ZoomControls from '../Controls/ZoomControls';

const SimpleMapContent = ({ data }) => {
    const [backgroundLayerSource, setBackgroundLayerSource] = useState();
    const [dataLayerSource, setDataLayerSource] = useState();
    const { zoomToExtent } = useMap();

    useEffect(() => {
        setBackgroundLayerSource(CartoCDN());
        setDataLayerSource(vector([]));
    }, []);

    useEffect(() => {
        if (data.wktFeature.includes('POLYGON')) {
            let coordinates = new Set(
                data.wktFeature
                    .replace('POLYGON ((', '')
                    .replace('))', '')
                    .split(',')
                    .map(item => item.trim())
            );

            if (coordinates.size === 1)
                data.wktFeature = 'POINT (' + [...coordinates][0] + ')';
        }

        setDataLayerSource(wktVector(data));
    }, [data]);

    useEffect(() => {
        if (!dataLayerSource) return;

        if (dataLayerSource.getFeatures().length > 0) {
            zoomToExtent(dataLayerSource.getExtent());
        } else {
            zoomToExtent();
        }
    }, [dataLayerSource]);

    return (
        <div>
            <div>
                {backgroundLayerSource && (
                    <TileLayer
                        key="basemap"
                        source={backgroundLayerSource}
                        zIndex={0}
                    />
                )}
                <VectorLayer
                    key="boundingBox"
                    source={dataLayerSource}
                    zIndex={2}
                    style={getDataStyle}
                    properties={{ id: 'data' }}
                />
            </div>
            <Controls>
                <ZoomControls originalExtent={dataLayerSource?.getExtent()} />
            </Controls>
        </div>
    );
};

SimpleMapContent.propTypes = {
    data: PropTypes.object
};

export default SimpleMapContent;
