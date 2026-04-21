import { useMap } from 'src/context/MapContext';
import { ButtonMapControl } from './ButtonMapControl';
import { interactionTypes } from 'src/services/settings';
import { DrawSquare } from 'src/assets/icons.js';

const DragControl = () => {
    const { interaction, setInteraction } = useMap();
    const active = interaction === interactionTypes.drag;

    return (
        <ButtonMapControl
            info={'Drag and drop bounding box'}
            onClick={() =>
                setInteraction(previous =>
                    previous === interactionTypes.drag
                        ? null
                        : interactionTypes.drag
                )
            }
            active={active}
            svg={DrawSquare}
        />
    );
};

export default DragControl;
