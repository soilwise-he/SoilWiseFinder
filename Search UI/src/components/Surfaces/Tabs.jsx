import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import styled from '@emotion/styled';

import { store } from 'src/context/store';

const TabsContainer = styled.div`
    background-color: white;
`;
const TitleContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: var(--mui-spacing-0);
    margin-bottom: var(--mui-spacing-0);

    > div,
    > button {
        flex-basis: 18%;
    }

    > button:last-of-type {
        min-width: fit-content;
    }

    .MuiButton-root {
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
`;

const Tabs = ({ emptyTabs, titles, content }) => {
    const { selectedIndex, setSelectedIndex } = store();

    const handleClick = index => {
        setSelectedIndex(previous => (previous === index ? null : index));
    };

    return (
        <TabsContainer>
            <TitleContainer>
                {emptyTabs.map((tab, index) => (
                    <div key={'empty-tab-' + index}>{tab}</div>
                ))}
                {titles.map((title, index) => (
                    <Button
                        key={'tab-' + index}
                        onClick={() => handleClick(index + 1)}
                        variant="outlined"
                        className={selectedIndex === index + 1 && 'selected'}
                    >
                        {title}
                    </Button>
                ))}
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
