'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import styled from '@emotion/styled';
import { Button } from '@mui/material';

const TitleBar = styled.div`
    width: calc(100% - 42px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--mui-palette-secondary-main);
    background-color: white;
    padding: 0px 20px;

    &.close {
        height: 44px;
        border-radius: 100px;
    }

    &.open {
        border-radius: var(--mui-shape-borderRadius-0);
    }

    .MuiButton-root {
        width: 100%;
        border: none;
        text-transform: none;
        font-size: 18px;
        display: block;

        svg {
            float: right;
        }
    }
`;
const StyledCollapse = styled.div`
    width: 100%;
    padding: 20px;
`;

const CollapsiblePanel = ({ title, startOpen, handleClear, children }) => {
    const [open, setOpen] = useState(startOpen);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div>
            <TitleBar className={open ? 'open' : 'close'}>
                <Button
                    onClick={handleClick}
                    onKeyDown={handleClick}
                    color="secondary"
                    variant="outlined"
                >
                    {title}
                    {open ? <ExpandLess /> : <ExpandMore />}
                </Button>
                {open && <StyledCollapse>{children}</StyledCollapse>}
            </TitleBar>
        </div>
    );
};

CollapsiblePanel.propTypes = {
    title: PropTypes.string,
    startOpen: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default CollapsiblePanel;
