import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import TileLayer from 'components/Map/Layers/TileLayer';
import VectorLayer from 'components/Map/Layers/VectorLayer';
import { CartoCDN } from 'components/Map/Sources/BaseMaps';
import {
    vector,
    readGeoJsonFeature,
    wktVector
} from 'components/Map/Sources/Vector';
import { store } from 'src/context/store';
import { useMap } from 'src/context/MapContext';
import { useGeoLocation } from 'src/services/useGeoLocation';
import VectorLayerWithChildren from '../Layers/VectorLayerWithChildren';
import {
    CurrentLocationControl,
    SearchLocationControl
} from '../Controls/LocationControls';
import { getDataStyle, getFilterStyle } from 'src/style/mapStyle';
import Controls from '../Controls/Controls';
import DrawControls from '../Controls/DrawControls';
import OnDragBoxEvent from '../Interaction/DragInteraction';
import { interactionTypes } from 'src/services/settings';
import ZoomControls from '../Controls/ZoomControls';
import { mapParameters } from '../../../services/settings';
import OnDrawFreeformEvent from '../Interaction/DrawInteraction';

const SearchMapContent = ({ data }) => {
    const [backgroundLayerSource, setBackgroundLayerSource] = useState();
    const [locationLayerFeature, setLocationLayerFeature] = useState();
    const [dataLayerSource, setDataLayerSource] = useState();
    const [filterLayerSource, setFilterLayerSource] = useState();
    const { filters } = store();
    const { zoomToExtent, interaction, setInteraction } = useMap();
    const { locationFeatures } = useGeoLocation();

    useEffect(() => {
        setBackgroundLayerSource(CartoCDN());
        setDataLayerSource(vector([]));
    }, []);

    useEffect(() => {
        setInteraction(null);

        if (filters.spatial?.area) {
            setFilterLayerSource(
                wktVector({
                    wktFeature: filters.spatial.area,
                    crs: mapParameters.dataProjection
                })
            );
        } else {
            setFilterLayerSource(null);
        }
    }, [filters.spatial]);

    useEffect(() => {
        if (!locationFeatures?.length) return;

        setLocationLayerFeature(locationFeatures);
    }, [locationFeatures]);

    useEffect(() => {
        if (data) {
            if (data.geoJsonFeature) {
                setDataLayerSource(
                    vector({
                        features: [
                            readGeoJsonFeature({
                                geoJsonFeature: data.geoJsonFeature
                            })
                        ]
                    })
                );
            } else if (data.olFeature) {
                setDataLayerSource(vector({ features: [data.olFeature] }));
            } else if (data.locationFeatures) {
                if (dataLayerSource) {
                    for (let feature of data.locationFeatures)
                        dataLayerSource.addFeature(feature);

                    zoomToExtent(dataLayerSource.getExtent());
                } else {
                    setDataLayerSource(
                        vector({ features: data.locationFeatures })
                    );
                }
            }
        } else {
            setDataLayerSource(vector([]));
        }
    }, [data]);

    useEffect(() => {
        if (!dataLayerSource) return;

        if (dataLayerSource.getFeatures().length > 0) {
            zoomToExtent(dataLayerSource.getExtent());
        } else if (filterLayerSource?.getFeatures().length > 0) {
            zoomToExtent(filterLayerSource.getExtent());
        } else {
            zoomToExtent();
        }
    }, [dataLayerSource, filterLayerSource]);

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
                {locationLayerFeature && (
                    <VectorLayerWithChildren zIndex={1}>
                        {locationLayerFeature}
                    </VectorLayerWithChildren>
                )}
                <VectorLayer
                    key="selectionFeatures"
                    source={dataLayerSource}
                    zIndex={3}
                    style={getDataStyle}
                    properties={{ id: 'data' }}
                />
                <VectorLayer
                    key="filterFeature"
                    source={filterLayerSource}
                    zIndex={2}
                    style={getFilterStyle}
                />
            </div>
            <Controls>
                <ZoomControls originalExtent={mapParameters.europeExtent} />
                <CurrentLocationControl />
                <SearchLocationControl />
                <DrawControls />
            </Controls>
            {interaction === interactionTypes.drag && <OnDragBoxEvent />}
            {interaction === interactionTypes.draw && <OnDrawFreeformEvent />}
        </div>
    );
};

SearchMapContent.propTypes = {
    data: PropTypes.object
};

export default SearchMapContent;
