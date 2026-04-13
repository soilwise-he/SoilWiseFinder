import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Zoom, ZoomToExtent } from 'ol/control';

import MapContext from '../../../context/MapContext';
import { mapParameters } from 'src/services/settings';
import { Cached } from '@mui/icons-material';

const ZoomControls = ({ originalExtent }) => {
    const { map } = useContext(MapContext);

    useEffect(() => {
        if (!map) return;

        let zoomControl = new Zoom({});

        map.controls.push(zoomControl);

        return () => {
            map.controls.remove(zoomControl);
        };
    }, [map]);

    useEffect(() => {
        if (!originalExtent || !map) return;

        let zoomLabel = document.createElement('span');
        zoomLabel.className = 'max-zoom-label';
        let zoomtoExtent = new ZoomToExtent({
            extent: originalExtent,
            label: zoomLabel,
            className: 'max-zoom',
            tipLabel: 'Zoom to original extent'
        });
        zoomtoExtent.addEventListener('pointerup', event => {
            event.stopPropagation();
        });
        zoomtoExtent.handleZoomToExtent = function () {
            const view = map.getView();
            view.fit(originalExtent, {
                padding: mapParameters.padding,
                minResolution: 1
            });

            if (view.getZoom() > mapParameters.minimumZoom)
                view.setZoom(mapParameters.minimumZoom);
        };
        map.controls.push(zoomtoExtent);

        return () => {
            map.controls.remove(zoomtoExtent);
        };
    }, [map, originalExtent]);

    return null;
};

ZoomControls.propTypes = {
    originalExtent: PropTypes.array
};

export default ZoomControls;
