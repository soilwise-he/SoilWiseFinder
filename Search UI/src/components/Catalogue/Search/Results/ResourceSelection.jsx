import styled from '@emotion/styled';
import { Button, useMediaQuery } from '@mui/material';
import {
    ArrowOutward,
    KeyboardArrowLeft,
    KeyboardArrowUp,
    Share
} from '@mui/icons-material';

import muiTheme from 'src/style/theme';
import { Resource } from 'components/Catalogue/Resource';
import { paths } from 'src/services/settings';
import ToolTip from 'components/UIElements/ToolTip';

const StickyResourceContainer = styled.div`
    flex: 1 0 50%;
    padding: 0px;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: calc(100vh - 25px);
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    background-color: color-mix(
        in srgb,
        var(--mui-palette-secondary-main) 10%,
        transparent
    );
    border-radius: var(--mui-shape-borderRadius-0);
    padding: var(--mui-spacing-0);

    &::-webkit-scrollbar {
        display: none;
    }

    > div {
        padding: 0px !important;
    }
`;
const InlineResourceContainer = styled.div`
    padding: 0px;
    background-color: color-mix(
        in srgb,
        var(--mui-palette-secondary-main) 10%,
        transparent
    );
    border-radius: var(--mui-shape-borderRadius-0);
    padding: var(--mui-spacing-0);

    > div {
        padding: 0px !important;
    }
`;
const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: var(--mui-spacing-0);

    button {
        padding: 0px;
        min-width: 0px;
    }
`;

const ResourceSelection = ({ selectedEntry, setSelectedEntry }) => {
    const isMobile = useMediaQuery(() => muiTheme.breakpoints.down('sm'));
    const handleShare = () => {
        navigator.clipboard.writeText(
            `${window.location.host}${paths.catalogueResource}/${encodeURIComponent(selectedEntry?.identifier)}`
        );
    };

    const content = [
        <ButtonContainer key="buttons">
            <ToolTip title="Close resource details">
                <Button onClick={() => setSelectedEntry(null)}>
                    {isMobile ? <KeyboardArrowUp /> : <KeyboardArrowLeft />}
                </Button>
            </ToolTip>
            <ToolTip title="Copy url of detail page">
                <Button onClick={handleShare}>
                    <Share />
                </Button>
            </ToolTip>
            <ToolTip title="Open resource details in a new tab">
                <Button
                    href={`${paths.catalogueResource}/${encodeURIComponent(selectedEntry?.identifier)}`}
                    target="_blank"
                    onClick={() => setSelectedEntry(null)}
                >
                    <ArrowOutward />
                </Button>
            </ToolTip>
        </ButtonContainer>,
        <Resource
            key="document"
            document={selectedEntry}
        />
    ];

    if (isMobile) {
        return (
            selectedEntry && (
                <InlineResourceContainer>{content}</InlineResourceContainer>
            )
        );
    } else {
        return (
            selectedEntry && (
                <StickyResourceContainer>{content}</StickyResourceContainer>
            )
        );
    }
};

export default ResourceSelection;
