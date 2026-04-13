import styled from '@emotion/styled';
import { Menu } from '@mui/icons-material';
import { Menu as MuiMenu, MenuItem, IconButton } from '@mui/material';
import { useState } from 'react';

const StyledIconButton = styled(IconButton)`
    border: 1px solid var(--mui-palette-primary-main);
    border-radius: var(--mui-shape-borderRadius-0);
`;

const StyledMenuItem = styled(MenuItem)`
    &.selected {
        background-color: var(--mui-palette-grey-200);
    }
`;

const MobileMenu = ({ items }) => {
    const [anchorElement, setAnchorElement] = useState(null);
    const open = Boolean(anchorElement);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleClick = event => {
        setAnchorElement(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElement(null);
    };

    const handleMenuItemClick = (index, itemClick) => event => {
        itemClick(event);
        setSelectedIndex(previous => (previous === index ? null : index));
        handleClose();
    };

    return (
        <div>
            <StyledIconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                color="primary"
                onClick={handleClick}
            >
                <Menu />
            </StyledIconButton>
            <MuiMenu
                id="basic-menu"
                anchorEl={anchorElement}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button'
                    }
                }}
            >
                {items.map((item, index) => (
                    <StyledMenuItem
                        key={'menu-item-' + index}
                        onClick={handleMenuItemClick(index, item.handleClick)}
                        className={selectedIndex === index ? 'selected' : ''}
                    >
                        {item.label}
                    </StyledMenuItem>
                ))}
            </MuiMenu>
        </div>
    );
};

export default MobileMenu;
