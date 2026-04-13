import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const ControlContainer = styled.div`
    position: relative;
    float: right;
    top: 112px;
    right: 12px;
    width: fit-content;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    & > * {
        margin-top: 14px;
    }
    & > *:first-of-type {
        margin-top: 0;
    }
`;

const Controls = ({ children }) => {
    return <ControlContainer>{children}</ControlContainer>;
};

Controls.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default Controls;
