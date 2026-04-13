import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const MainContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 1px solid var(--mui-palette-grey-300);
    border-radius: var(--mui-shape-borderRadius-0);
    padding: 3px;
    width: fit-content;

    &:hover,
    &.active {
        background-color: var(--mui-palette-primary-main);
        color: white;
    }

    &.disabled,
    &.disabled:hover {
        background-color: var(--mui-palette-grey-300);
        color: white;
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

export const ButtonMapControl = ({
    onClick,
    info,
    active,
    disabled,
    Icon,
    svg
}) => {
    return (
        <MainContainer
            onClick={onClick}
            className={disabled ? 'disabled' : active ? 'active' : ''}
        >
            {info ? (
                <Tooltip title={info}>{Icon ? <Icon /> : svg}</Tooltip>
            ) : Icon ? (
                <Icon />
            ) : (
                svg
            )}
        </MainContainer>
    );
};

ButtonMapControl.propTypes = {
    Icon: PropTypes.object,
    onClick: PropTypes.func,
    info: PropTypes.string,
    active: PropTypes.bool
};
