import styled from '@emotion/styled';
import { Button } from '@mui/material';

import MapWrapper from 'components/Map/MapWrapper';
import SimpleMapContent from 'components/Map/MapContent/SimpleMapContent';
import { mapParameters, tagDefinitions } from 'src/services/settings';

const Entry = styled.a`
    display: flex;
    gap: var(--mui-spacing-0);
    justify-content: space-between;
    padding: 15px 0px;
    border-bottom: 2px solid var(--mui-palette-grey-400);

    &.selected {
        background-color: color-mix(
            in srgb,
            var(--mui-palette-secondary-main) 10%,
            transparent
        );
    }

    &:hover {
        background-color: var(--mui-palette-grey-100);
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

const Tags = styled.div`
    display: flex;
    flex-direction: row;
    gap: var(--mui-spacing-0);
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

const ImageContainer = styled.div`
    flex: 15% 1 1;
    min-width: 150px;
    min-height: 250px;

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

    img {
        width: 100%;
        max-height: 250px;
        object-fit: contain;
    }
`;

const ResourceEntry = ({ data, setSelectedEntry, ...props }) => {
    const getAuthor = () => {
        let authors = null;

        if (data.view_authors) {
            let organizations = data.view_authors.reduce(
                (result, currentAuthor) => {
                    currentAuthor = JSON.parse(currentAuthor);

                    if (!currentAuthor.organization) {
                        result[0].push(currentAuthor.person);
                    } else {
                        if (!(currentAuthor.organization in result[1])) {
                            result[1][currentAuthor.organization] = [];
                        }

                        if (currentAuthor.person) {
                            result[1][currentAuthor.organization].push(
                                currentAuthor.person
                            );
                        }
                    }

                    return result;
                },
                [[], {}]
            );

            authors = [];

            if (organizations[0].length > 0) {
                authors = organizations[0];
            }

            authors = [
                ...authors,
                ...Object.entries(organizations[1]).map(([key, value]) =>
                    value.length > 0 ? key + ': ' + value.join(', ') : key
                )
            ].join('; ');
        }

        return authors && <Authors>{authors}</Authors>;
    };

    const getDate = () => {
        let dateLabel = 'Available since ';
        let date = data.date;

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

    return (
        <Entry
            {...props}
            onClick={() => setSelectedEntry(data)}
        >
            <Summary>
                <Tags>
                    {data.type && (
                        <Button variant="outlined">{data.type}</Button>
                    )}
                    {data.soilmission && (
                        <Button variant="outlined">
                            {tagDefinitions.soilmission}
                        </Button>
                    )}
                    {data.license && (
                        <Button variant="outlined">{data.license}</Button>
                    )}
                </Tags>

                <h2
                    dangerouslySetInnerHTML={{
                        __html: data.title
                    }}
                />
                {getAuthor(data)}
                {getDate(data)}

                <Abstract
                    dangerouslySetInnerHTML={{
                        __html: data.abstract
                    }}
                />
            </Summary>
            {data.spatial && (
                <ImageContainer>
                    <MapWrapper>
                        <SimpleMapContent
                            data={{
                                wktFeature: data.spatial,
                                crs: mapParameters.dataProjection
                            }}
                        />
                    </MapWrapper>
                </ImageContainer>
            )}
            {data.thumbnail && !data.spatial && (
                <ImageContainer>
                    <img
                        src={data.thumbnail}
                        alt="thumbnail"
                    />
                </ImageContainer>
            )}
        </Entry>
    );
};

export default ResourceEntry;
