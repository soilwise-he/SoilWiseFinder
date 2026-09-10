import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Close, DragIndicator } from '@mui/icons-material';
import ToolTip from 'components/UIElements/ToolTip';

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
    background: #fcfcfc;
    border: 1px solid var(--mui-palette-grey-400);
    border-radius: var(--mui-shape-borderRadius-0);
    box-shadow: 0px 0px 10px 15px
        color-mix(in srgb, var(--mui-palette-secondary-main) 20%, transparent);
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

        &[data-testid='CloseIcon'] {
            cursor: pointer;
        }
    }
`;

const ContentContainer = styled.div`
    width: fit-content;
    max-height: 65vh;
    min-width: 500px;
    overflow: auto;
`;

const DraggablePanel = ({
    title,
    info,
    defaultPosition,
    handleClose,
    children
}) => {
    const [position, setPosition] = useState(defaultPosition);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        addEventListener('scrollend', () => {
            setPosition(previous => ({
                left: previous.left + (window.scrollX - previous.offsetX),
                top: previous.top + (window.scrollY - previous.offsetY),
                offsetX: window.scrollX,
                offsetY: window.scrollY
            }));
        });
    }, []);

    const onDragEnd = event => {
        setDragging(false);
        setPosition({
            left: event.clientX + window.scrollX,
            top: event.clientY + window.scrollY,
            offsetX: window.scrollX,
            offsetY: window.scrollY
        });
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
                {info ? (
                    <ToolTip title={info}>
                        <p>{title}</p>
                    </ToolTip>
                ) : (
                    <p>{title}</p>
                )}
                {handleClose && <Close onClick={handleClose} />}
            </TopContainer>
            <ContentContainer>{children}</ContentContainer>
        </MainContainer>
    );
};

export default DraggablePanel;
