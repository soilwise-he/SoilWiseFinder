import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useDrawnFeature } from '../../../services/useFeatureSelection';

const DrawInteraction = ({ source }) => {
    const { setSelectedFeature } = useDrawnFeature();

    const handleDrawStart = useCallback(() => {
        source.refresh();
    }, [source]);

    const handleDrawEnd = useCallback(
        async ({ drawnFeature }) => {
            setSelectedFeature(drawnFeature);
        },
        [setSelectedFeature]
    );

    return (
        <OnDrawEvent
            drawSource={source}
            onDrawStartFunction={handleDrawStart}
            onDrawEndFunction={handleDrawEnd}
        />
    );
};

DrawInteraction.propTypes = {
    source: PropTypes.object
};

export default DrawInteraction;
