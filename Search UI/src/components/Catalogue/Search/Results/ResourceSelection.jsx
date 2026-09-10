import styled from '@emotion/styled';
import { Button, useMediaQuery } from '@mui/material';
import {
    ArrowOutward,
    KeyboardArrowLeft,
    KeyboardArrowUp,
    Share
} from '@mui/icons-material';

import muiTheme from 'src/style/theme';
import { displayTypes, Resource } from 'components/Catalogue/Resource';
import { getDetailsPageUrl } from 'src/services/settings';
import ToolTip from 'components/UIElements/ToolTip';

const StickyResourceContainer = styled.div`
    flex: 1 0 45%;
    padding: 0px;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: scroll;
    -ms-overflow-style: none;
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

const ResourceSelection = ({
    selectedEntry,
    setSelectedEntry,
    inlineSelection
}) => {
    if (!selectedEntry) return;

    const columnView = window
        ? window.innerWidth * 0.5 < muiTheme.breakpoints.values.md
        : false;

    const content = [
        <ButtonContainer key="buttons">
            <ToolTip title="Close resource details">
                <Button onClick={() => setSelectedEntry(null)}>
                    {inlineSelection ? (
                        <KeyboardArrowUp />
                    ) : (
                        <KeyboardArrowLeft />
                    )}
                </Button>
            </ToolTip>
            {selectedEntry.identifier && (
                <ToolTip title="Copy url of detail page">
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                getDetailsPageUrl(selectedEntry.identifier)
                            );
                        }}
                    >
                        <Share />
                    </Button>
                </ToolTip>
            )}
            {selectedEntry.identifier && (
                <ToolTip title="Open resource details in a new tab">
                    <Button
                        href={getDetailsPageUrl(selectedEntry.identifier, true)}
                        target="_blank"
                        onClick={() => setSelectedEntry(null)}
                    >
                        <ArrowOutward />
                    </Button>
                </ToolTip>
            )}
        </ButtonContainer>,
        <Resource
            key="document"
            document={selectedEntry}
            displayType={
                columnView
                    ? inlineSelection
                        ? displayTypes.summarized
                        : displayTypes.column
                    : displayTypes.full
            }
        />
    ];

    if (inlineSelection) {
        return <InlineResourceContainer>{content}</InlineResourceContainer>;
    } else {
        return <StickyResourceContainer>{content}</StickyResourceContainer>;
    }
};

export default ResourceSelection;
