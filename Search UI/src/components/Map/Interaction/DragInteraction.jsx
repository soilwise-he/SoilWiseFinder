import { useEffect } from 'react';
import { DragBox } from 'ol/interaction';
import { Feature } from 'ol';

import { useMap } from 'src/context/MapContext';
import { store } from '../../../context/store';

const OnDragBoxEvent = () => {
    const { map } = useMap();
    const { setBoundingBox } = store();

    useEffect(() => {
        if (!map) return;

        let dragBox = new DragBox();
        map.addInteraction(dragBox);

        dragBox.on('boxend', function () {
            setBoundingBox(
                new Feature({
                    geometry: dragBox.getGeometry(),
                    label: 'Bounding box'
                })
            );
        });

        return () => {
            map.removeInteraction(dragBox);
        };
    }, [map]);

    return null;
};

export default OnDragBoxEvent;
