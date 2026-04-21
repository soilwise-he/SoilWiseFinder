'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button } from '@mui/material';

import useGetData from 'src/services/getData';
import MapWrapper from 'components/Map/MapWrapper';
import Pagination from 'components/Surfaces/Pagination';
import { store } from 'src/context/store';
import ResourceOptions from './ResourceOptions';
import SimpleMapContent from '../../Map/MapContent/SimpleMapContent';
import { Resource } from '../Resource';
import { paths } from 'src/services/settings';
import { ArrowOutward, KeyboardArrowLeft } from '@mui/icons-material';

const MainContainer = styled.div`
    font-size: 1rem;
    background-color: white;
    border-radius: var(--mui-shape-borderRadius-0);
    display: flex;
    gap: var(--mui-spacing-1);

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
const ResourceContainer = styled.div`
    flex: 1 0 50%;
    padding: 0px;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: calc(100vh - 5px);
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    > div {
        padding: 0px !important;
    }
`;
const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    background-color: #eee;
    border-radius: var(--mui-shape-borderRadius-0);
    margin-bottom: var(--mui-spacing-0);
    height: 55px;
`;

const Entry = styled.a`
    display: flex;
    gap: var(--mui-spacing-0);
    justify-content: space-between;
    padding: 15px 0px;
    border-bottom: 2px solid #ddd;

    &:hover {
        background-color: rgba(18, 25, 106, 0.04);
    }
`;

const Summary = styled.div`
    flex: 65% 1 1;

    h2 {
        font-size: 18px;
        font-weight: 500;
        line-height: 24px;
        margin-bottom: 5px;
    }

    button {
        font-size: 14px;
        border-radius: var(--mui-shape-borderRadius-0);
    }

    p {
        font-size: 16px;
        font-weight: 500;
        line-height: 23px;

        i {
            height: fit-content;
        }
    }
`;

const Abstract = styled.p`
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    white-space: normal;
    max-height: 90px;
`;

const Authors = styled.p`
    margin-top: 0px;
    margin-bottom: 5px;
`;

const EntryDate = styled.p`
    margin-top: 0px;
`;

const SpatialContainer = styled.div`
    flex: 15% 1 1;
    min-width: 150px;
    min-height: 100px;

    p {
        margin: 0px;
        font-size: 0.8rem;
    }

    p:first-of-type {
        margin-top: 12px;
    }

    .coordinates {
        margin-left: 10px;
    }
`;

const Resources = () => {
    const [entries, setEntries] = useState(null);
    const { getResources } = useGetData();
    const { setFacets, setPagination, query, filters, sort } = store();
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        getResources(query, filters, sort)
            .then(data => {
                setFacets(data.facets);
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
            })
            .catch(error => {
                console.error(error);
                setEntries([]);
            });
    }, [getResources, query, filters, sort]);

    const getAuthor = item => {
        let authors = null;

        if (item.pdf_author) {
            authors = item.pdf_author?.join(', ');
        } else if (item.creator) {
            authors = item.creator?.join(', ');
        } else if (item.contributor) {
            authors = item.contributor?.join(', ');
        } else if (item.organization) {
            authors = item.organization.join(', ');
        }

        return authors && <Authors>{authors}</Authors>;
    };

    const getDate = item => {
        let dateLabel = 'Available since ';
        let date = item.date_creation;

        if (
            item.date_publication &&
            new Date(item.date_publication) < new Date(item.date_creation)
        ) {
            date = item.date_publication;
        }

        return (
            date && (
                <EntryDate>
                    <i>
                        {dateLabel}
                        {date.substring(0, date.indexOf('T'))}
                    </i>
                </EntryDate>
            )
        );
    };

    if (!entries) return <div>Searching...</div>;

    return (
        <MainContainer>
            {entries.length > 0 ? (
                <ResourcesContainer>
                    <Pagination />
                    <ResourceOptions />

                    {entries.map(item => (
                        <Entry
                            key={item.identifier}
                            onClick={() => setSelectedEntry(item)}
                        >
                            <Summary>
                                {item.type && (
                                    <Button variant="outlined">
                                        {item.type}
                                    </Button>
                                )}
                                <h2
                                    dangerouslySetInnerHTML={{
                                        __html: item.title
                                    }}
                                />
                                {getAuthor(item)}
                                {getDate(item)}

                                <Abstract
                                    dangerouslySetInnerHTML={{
                                        __html: item.abstract
                                    }}
                                />
                            </Summary>
                            {item.wkb_geometry && (
                                <SpatialContainer>
                                    <MapWrapper>
                                        <SimpleMapContent
                                            data={{
                                                wktFeature: item.wkb_geometry,
                                                crs: 'EPSG:4326'
                                            }}
                                        />
                                    </MapWrapper>
                                </SpatialContainer>
                            )}
                        </Entry>
                    ))}
                    <Pagination />
                </ResourcesContainer>
            ) : (
                <div>No results could be found</div>
            )}
            {selectedEntry && (
                <ResourceContainer>
                    <ButtonContainer>
                        <Button onClick={() => setSelectedEntry(null)}>
                            <KeyboardArrowLeft />
                        </Button>
                        <Button
                            href={`${paths.catalogueResource}/${encodeURIComponent(selectedEntry.identifier)}`}
                            target="_blank"
                            onClick={() => setSelectedEntry(null)}
                        >
                            <ArrowOutward />
                        </Button>
                    </ButtonContainer>
                    <Resource document={selectedEntry} />
                </ResourceContainer>
            )}
        </MainContainer>
    );
};

export default Resources;
