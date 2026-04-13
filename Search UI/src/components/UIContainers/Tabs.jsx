import PropTypes from 'prop-types';
import { Button, useMediaQuery } from '@mui/material';
import styled from '@emotion/styled';

import { store } from 'src/context/store';
import muiTheme from 'src/style/theme';
import Menu from '../UIElements/MobileMenu';

const TabsContainer = styled.div`
    background-color: white;
`;
const TitleContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: var(--mui-spacing-0);
    margin-bottom: var(--mui-spacing-0);

    .MuiInputBase-root {
        width: 200px;
    }

    .MuiButton-root {
        flex-basis: 30%;
        min-width: fit-content;
        border-radius: var(--mui-shape-borderRadius-0)
            var(--mui-shape-borderRadius-0) 0px 0px;
    }

    .MuiButton-root.selected {
        background-color: var(--mui-palette-primary-main);
        color: white;

        svg {
            color: white;
        }
    }

    ${muiTheme.breakpoints.down('sm')} {
        justify-content: space-between;

        .MuiInputBase-root {
            width: calc(100vw - 200px) !important;
            padding: 3px 9px !important;
        }

        label[data-shrink='false'] {
            transform: translate(14px, 8px) scale(1);
        }
    }
`;

const Tabs = ({ emptyTabs, titles, content }) => {
    const { selectedIndex, setSelectedIndex } = store();

    const handleClick = index => {
        setSelectedIndex(previous => (previous === index ? null : index));
    };

    const getTitlesAsMenu = () => {
        return (
            <Menu
                items={titles.map((title, index) => ({
                    label: title,
                    handleClick: () => handleClick(index + 1)
                }))}
            />
        );
    };

    const getTitlesAsButtons = () => {
        return titles.map((title, index) => (
            <Button
                key={'tab-' + index}
                onClick={() => handleClick(index + 1)}
                variant="outlined"
                className={selectedIndex === index + 1 && 'selected'}
            >
                {title}
            </Button>
        ));
    };

    return (
        <TabsContainer>
            <TitleContainer>
                {emptyTabs.map((tab, index) => (
                    <div key={'empty-tab-' + index}>{tab}</div>
                ))}
                {useMediaQuery(muiTheme.breakpoints.down('sm'))
                    ? getTitlesAsMenu()
                    : getTitlesAsButtons()}
            </TitleContainer>
            {selectedIndex && content[selectedIndex - 1]}
        </TabsContainer>
    );
};

Tabs.propTypes = {
    emptyTabs: PropTypes.array,
    titles: PropTypes.array,
    content: PropTypes.array
};

export default Tabs;
