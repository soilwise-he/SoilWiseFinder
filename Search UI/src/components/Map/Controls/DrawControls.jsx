import { useMap } from 'src/context/MapContext';
import { ButtonMapControl } from './ButtonMapControl';
import { interactionTypes } from 'src/services/settings';
import { DrawFreeform, DrawSquare } from 'src/assets/icons.js';

const DrawControls = () => {
    const { interaction, setInteraction } = useMap();

    return [
        <ButtonMapControl
            key={interactionTypes.drag}
            info={interactionTypes.drag}
            onClick={() =>
                setInteraction(previous =>
                    previous === interactionTypes.drag
                        ? null
                        : interactionTypes.drag
                )
            }
            active={interaction === interactionTypes.drag}
            svg={DrawSquare}
        />,
        <ButtonMapControl
            key={interactionTypes.draw}
            info={interactionTypes.draw}
            onClick={() =>
                setInteraction(previous =>
                    previous === interactionTypes.draw
                        ? null
                        : interactionTypes.draw
                )
            }
            active={interaction === interactionTypes.draw}
            svg={DrawFreeform}
        />
    ];
};

export default DrawControls;
