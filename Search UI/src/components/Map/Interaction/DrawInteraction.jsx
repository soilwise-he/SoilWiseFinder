import { useEffect } from 'react';
import { Draw } from 'ol/interaction';

import { useMap } from 'src/context/MapContext';
import { store } from 'src/context/store';

const OnDrawFreeformEvent = () => {
    const { map } = useMap();
    const { setPolygon } = store();

    useEffect(() => {
        if (!map) return;

        let drawFreeform = new Draw({
            type: 'Polygon'
        });
        map.addInteraction(drawFreeform);

        drawFreeform.on('drawend', function (event) {
            setPolygon(event.feature);
        });

        return () => {
            map.removeInteraction(drawFreeform);
        };
    }, [map]);

    return null;
};

export default OnDrawFreeformEvent;
