import { useEffect, useState } from 'react';
import { ContentCopy, FileUpload, Settings } from '@mui/icons-material';
import { Button, IconButton, TextField } from '@mui/material';

import Modal from 'components/UIContainers/Modal';
import ToolTip from 'components/UIElements/ToolTip';
import { store } from 'src/context/store';
import styled from '@emotion/styled';

const MainContainer = styled.div`
    padding: var(--mui-spacing-1) 0px;

    p {
        margin-bottom: var(--mui-spacing-1);
    }
`;
const ModalContainer = styled.div`
    display: flex;
`;

const SearchSettings = () => {
    const {
        query,
        setQuery,
        filters,
        updateChoiceFilter,
        updateTermFilter,
        updateRangeFilter,
        setSpatialFilter,
        reset
    } = store();
    const [open, setOpen] = useState();
    const [settings, setSettings] = useState('');

    const handleChange = event => {
        setSettings(event.target.value);
    };

    useEffect(() => {
        setSettings(
            JSON.stringify({ searchText: query, filters: filters }, null, '\t')
        );
    }, [query, filters]);

    const loadSettings = () => {
        let loadedSettings = JSON.parse(settings);

        reset();

        if (loadedSettings.searchText) setQuery(loadedSettings.searchText);

        loadedSettings.filters?.choices?.forEach(key =>
            updateChoiceFilter(key, true)
        );

        if (loadedSettings.filters?.terms)
            Object.entries(loadedSettings.filters.terms).forEach(
                ([key, value]) => updateTermFilter(key, value)
            );

        if (loadedSettings.filters?.ranges)
            Object.entries(loadedSettings.filters.ranges).forEach(
                ([key, value]) => updateRangeFilter(key, value)
            );

        if (loadedSettings.filters?.spatial)
            setSpatialFilter(
                loadedSettings.filters.spatial.area,
                loadedSettings.filters.spatial.typeOfFilter
            );
    };

    return (
        <>
            <ToolTip title="Import and export search and filter settings">
                <IconButton
                    color="secondary"
                    onClick={() => setOpen(true)}
                >
                    <Settings />
                </IconButton>
            </ToolTip>
            {open && (
                <Modal
                    title="Save or load search and filter settings"
                    open={open}
                    setOpen={() => {
                        setOpen(false);
                    }}
                >
                    <MainContainer>
                        <p>
                            Copy the current search and filter settings (which
                            are shown below) for later use. Or paste previous
                            settings and load them into the catalogue.
                        </p>
                        <ModalContainer>
                            <TextField
                                value={settings}
                                onChange={handleChange}
                                multiline
                                rows={15}
                                fullWidth
                            />
                            <div>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(settings);
                                    }}
                                >
                                    <ContentCopy />
                                </Button>
                                <Button onClick={loadSettings}>
                                    <FileUpload />
                                </Button>
                            </div>
                        </ModalContainer>
                    </MainContainer>
                </Modal>
            )}
        </>
    );
};

export default SearchSettings;
