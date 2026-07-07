import { useState } from 'react';
import styled from '@emotion/styled';
import { Close, DragIndicator } from '@mui/icons-material';

const MainContainer = styled.div`
    position: absolute;
    ${props =>
        props.position?.left ? 'left: ' + props.position.left + 'px;' : ''}
    ${props =>
        props.position?.right ? 'right: ' + props.position.right + 'px;' : ''}
    ${props =>
        props.position?.top ? 'top: ' + props.position.top + 'px;' : ''}
    ${props =>
        props.position?.bottom
            ? 'bottom: ' + props.position.bottom + 'px;'
            : ''}
    padding: var(--mui-spacing-0);
    background: white;
    border: 1px solid var(--mui-palette-grey-400);
    border-radius: var(--mui-shape-borderRadius-0);
    box-shadow: var(--mui-shadows-1);
    z-index: 100;
`;

const TopContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--mui-spacing-0);
    cursor: ${props => (props.dragging ? 'grabbing' : 'grab')};

    p {
        margin: 0px;
        font-size: 1rem;
        color: var(--mui-palette-text-secondary);
    }

    svg {
        font-size: 1.25rem;
        vertical-align: middle;
    }
`;

const ContentContainer = styled.div`
    width: fit-content;
    max-height: 65vh;
    min-width: 500px;
    overflow: auto;
`;

const DraggablePanel = ({ title, defaultPosition, handleClose, children }) => {
    const [position, setPosition] = useState(defaultPosition);
    const [dragging, setDragging] = useState(false);

    const onDragEnd = event => {
        setDragging(false);
        setPosition({ left: event.clientX, top: event.clientY });
    };

    return (
        <MainContainer
            position={position}
            dragging={dragging}
        >
            <TopContainer
                draggable
                onDragStart={() => setDragging(true)}
                onDragEnd={onDragEnd}
            >
                <DragIndicator />
                <p>{title}</p>
                {handleClose && <Close onClick={handleClose} />}
            </TopContainer>
            <ContentContainer>{children}</ContentContainer>
        </MainContainer>
    );
};

export default DraggablePanel;
