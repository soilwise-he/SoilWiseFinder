'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useMediaQuery } from '@mui/material';

import useGetData from 'src/services/getData';
import Pagination from 'components/UIContainers/Pagination';
import { store } from 'src/context/store';
import ResourceOptions from 'components/Catalogue/Search/Results/ResourceOptions';
import ResourceEntry from 'components/Catalogue/Search/Results/ResourceEntry';
import ResourceSelection from 'components/Catalogue/Search/Results/ResourceSelection';
import muiTheme from 'src/style/theme';

const MainContainer = styled.div`
    font-size: 1rem;
    background-color: white;
    border-radius: var(--mui-shape-borderRadius-0);
    display: flex;
    gap: var(--mui-spacing-0);

    h1 {
        font-size: 16px;
        font-weight: 700;
        text-transform: uppercase;
        margin: 0px auto 17px auto;
    }
`;

const ResourcesContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Resources = () => {
    const [entries, setEntries] = useState(null);
    const { getResources } = useGetData();
    const { updateFacets, setPagination, query, filters, sort } = store();
    const [selectedEntry, setSelectedEntry] = useState(null);
    const isMobile = useMediaQuery(() => muiTheme.breakpoints.down('sm'));

    useEffect(() => {
        getResources(query, filters, sort)
            .then(data => {
                updateFacets(data.facets);
                setPagination(previous => ({
                    ...previous,
                    numberOfItems: data.response.numFound
                }));
                setEntries(
                    data.response.docs.map(document => {
                        let highlightedFields =
                            data.highlighting[document.identifier];

                        return {
                            ...document,
                            title:
                                highlightedFields.title?.[0] || document.title,
                            abstract:
                                highlightedFields.abstract?.[0] ||
                                document.abstract
                        };
                    })
                );
                setSelectedEntry(null);
            })
            .catch(error => {
                console.error(error);
                setEntries([]);
            });
    }, [getResources, query, filters, sort]);

    if (!entries) return <div>Searching...</div>;

    return (
        <MainContainer>
            {entries.length > 0 ? (
                <ResourcesContainer>
                    <Pagination />
                    <ResourceOptions />

                    {entries.map(item => [
                        <ResourceEntry
                            key={item.identifier}
                            data={item}
                            setSelectedEntry={setSelectedEntry}
                            className={
                                selectedEntry?.identifier === item.identifier
                                    ? 'selected'
                                    : ''
                            }
                        />,
                        isMobile &&
                            selectedEntry?.identifier === item.identifier && (
                                <ResourceSelection
                                    key={'selected-' + item.identifier}
                                    selectedEntry={selectedEntry}
                                    setSelectedEntry={setSelectedEntry}
                                />
                            )
                    ])}
                    <Pagination />
                </ResourcesContainer>
            ) : (
                <div>No results could be found</div>
            )}
            {!isMobile && (
                <ResourceSelection
                    selectedEntry={selectedEntry}
                    setSelectedEntry={setSelectedEntry}
                />
            )}
        </MainContainer>
    );
};

export default Resources;
