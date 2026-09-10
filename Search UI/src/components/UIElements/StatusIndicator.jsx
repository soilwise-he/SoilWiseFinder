import styled from '@emotion/styled';
import ToolTip from './ToolTip';

const MainContainer = styled.div`
    width: 40px;
    height: 40px;
    position: relative;
`;
const BackgroundCircle = styled.svg`
    position: absolute;
    top: 0px;
    left: 0px;
    fill: white;
    stroke: none;
`;
const StatusCircle = styled.svg`
    fill: none;
    stroke: var(--mui-palette-custom-augmentationBorder);
    stroke-width: 5;
`;
const Label = styled(MainContainer)`
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.7rem;
`;

const StatusIndicator = ({ percentage, helperText }) => {
    let path = '';
    let radius = 20;

    if (percentage <= 25) {
        let x = radius * Math.cos(((25 - percentage) / 100) * 2 * Math.PI);
        let y = radius * Math.sin(((25 - percentage) / 100) * 2 * Math.PI);
        path = `M 20 0 A 20 20 0 0 1 ${radius + x} ${radius - y}`;
    } else if (percentage <= 50) {
        let x = radius * Math.cos(((percentage - 25) / 100) * 2 * Math.PI);
        let y = radius * Math.sin(((percentage - 25) / 100) * 2 * Math.PI);
        path = `M 20 0 A 20 20 0 0 1 40 20 A 20 20 0 0 1 ${radius + x} ${radius + y}`;
    } else if (percentage <= 75) {
        let x = -radius * Math.cos(((75 - percentage) / 100) * 2 * Math.PI);
        let y = -radius * Math.sin(((75 - percentage) / 100) * 2 * Math.PI);
        path = `M 20 0 A 20 20 0 0 1 40 20 A 20 20 0 0 1 20 40 A 20 20 0 0 1 ${radius + x} ${radius - y}`;
    } else {
        let x = -radius * Math.cos(((percentage - 75) / 100) * 2 * Math.PI);
        let y = radius * Math.sin(((percentage - 75) / 100) * 2 * Math.PI);
        path = `M 20 0 A 20 20 0 0 1 40 20 A 20 20 0 0 1 20 40 A 20 20 0 0 1 0 20 A 20 20 0 0 1 ${radius + x} ${radius - y}`;
    }

    return (
        <ToolTip
            key="status"
            title={helperText}
        >
            <MainContainer>
                <BackgroundCircle viewBox="-6 -6 50 50">
                    <path
                        d={`M 18 0 A 18 18 0 0 1 36 18 A 18 18 0 0 1 18 36 A 18 18 0 0 1 0 18 A 18 18 0 0 1 18 0`}
                    />
                </BackgroundCircle>
                <StatusCircle viewBox="-4 -4 48 48">
                    <path d={path} />
                </StatusCircle>
                <Label>{percentage}%</Label>
            </MainContainer>
        </ToolTip>
    );
};

export default StatusIndicator;
