import styled from '@emotion/styled';
import { Button } from '@mui/material';

import MapWrapper from 'components/Map/MapWrapper';
import SimpleMapContent from 'components/Map/MapContent/SimpleMapContent';
import {
    fieldDefinitions,
    mapParameters,
    tagDefinitions
} from 'src/services/settings';
import { useCallback } from 'react';
import ToolTip from 'components/UIElements/ToolTip';
import StatusIndicator from 'components/UIElements/StatusIndicator';
import { getDate } from 'src/services/util';

const Entry = styled.a`
    display: flex;
    gap: var(--mui-spacing-0);
    justify-content: space-between;
    padding: 15px 5px;
    border-bottom: 1px solid var(--mui-palette-grey-400);
    border-top: 1px solid var(--mui-palette-grey-400);
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;

    &.selected {
        box-shadow: 0px 0px 4px 2px
            color-mix(
                in srgb,
                var(--mui-palette-secondary-main) 30%,
                transparent
            );
    }

    &:hover {
        border-bottom: 1px solid var(--mui-palette-secondary-main);
        border-top: 1px solid var(--mui-palette-secondary-main);
        background-color: color-mix(
            in srgb,
            var(--mui-palette-secondary-main) 5%,
            transparent
        );
    }

    ${props => props.theme.breakpoints.down('md')} {
        flex-direction: column;
    }
`;

const Summary = styled.div`
    flex: 1 1 85%;

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
    flex-wrap: wrap;
    gap: var(--mui-spacing-0);
    align-items: center;
`;

const Tag = styled(Button)`
    border: 1px solid var(--variant-outlinedBorder) !important;
    background-color: white !important;
    color: var(--variant-outlinedColor) !important;

    &.augmented {
        color: var(--mui-palette-custom-augmentationColor) !important;
        background-color: var(--mui-palette-custom-augmentationBg) !important;
        border: 1px solid var(--mui-palette-custom-augmentationBorder) !important;
    }
`;

const Abstract = styled.p`
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    white-space: normal;
`;

const Authors = styled.p`
    margin-top: 0px;
    margin-bottom: 5px;
`;

const EntryDate = styled.p`
    margin-top: 0px;
`;

const ImageContainer = styled.div`
    flex: 1 1 15%;
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

    &.augmented {
        border: 2px solid var(--mui-palette-custom-augmentationBorder);
        border-radius: var(--mui-shape-borderRadius-0);
    }
`;

const ResourceEntry = ({ data, setSelectedEntry, ...props }) => {
    const getAuthor = () => {
        let authors = null;

        if (data.view_authors) {
            let organizations = data.view_authors
                .filter(item => item !== '')
                .reduce(
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

        return (
            authors && (
                <Authors
                    dangerouslySetInnerHTML={{
                        __html: authors
                    }}
                />
            )
        );
    };

    const getAvailableSince = () => {
        let dateLabel = 'Available since ';
        let date = data.date;

        return (
            date && (
                <EntryDate>
                    <i>
                        {dateLabel}
                        {getDate(date)}
                    </i>
                </EntryDate>
            )
        );
    };

    const getTag = useCallback(
        (tagType, tagValue) => {
            if (!data.augments) return;

            let tag = (
                <Tag
                    disabled
                    className={tagType in data.augments ? 'augmented' : ''}
                >
                    {tagValue}
                </Tag>
            );

            if (tagType in data.augments) {
                tag = (
                    <ToolTip
                        title={`This metadata value is augmented. The original value is '${data.augments[tagType].original}'.`}
                    >
                        <span>{tag}</span>
                    </ToolTip>
                );
            }

            return tag;
        },
        [data.augments]
    );

    const getCompleteness = useCallback(() => {
        if (!data.augments || !('completeness' in data.augments)) return;

        let value = parseFloat(data.augments.completeness.target).toFixed(0);

        return (
            <div>
                <StatusIndicator
                    percentage={value}
                    helperText={
                        <div>
                            <p>
                                The metadata of this record is {value}%
                                complete.
                            </p>
                            <p>{fieldDefinitions.completeness.description}</p>
                        </div>
                    }
                />
            </div>
        );
    }, [data.augments]);

    const getMap = useCallback(() => {
        if (!data.augments) return;

        let map = (
            <ImageContainer
                className={'spatial' in data.augments ? 'augmented' : ''}
            >
                <MapWrapper>
                    <SimpleMapContent
                        data={{
                            wktFeature: data.spatial,
                            crs: mapParameters.dataProjection
                        }}
                    />
                </MapWrapper>
            </ImageContainer>
        );

        if ('spatial' in data.augments) {
            map = (
                <ToolTip
                    title={`This metadata value is augmented. The original bounding box is ${data.augments.spatial.original}.`}
                >
                    {map}
                </ToolTip>
            );
        }

        return map;
    }, [data.augments]);

    return (
        <Entry
            {...props}
            onClick={() => setSelectedEntry(data)}
        >
            <Summary>
                <Tags>
                    {getCompleteness()}
                    {data.type && getTag('type', data.type)}
                    {data.soilmission &&
                        getTag('soilmission', tagDefinitions.soilmission)}
                    {data.european_funded &&
                        getTag(
                            'european_funded',
                            tagDefinitions.european_funded
                        )}
                    {data.license && getTag('license', data.license)}
                </Tags>

                <h2
                    dangerouslySetInnerHTML={{
                        __html: data.title
                    }}
                />
                {getAuthor(data)}
                {getAvailableSince(data)}

                <Abstract
                    dangerouslySetInnerHTML={{
                        __html: data.abstract
                    }}
                />
            </Summary>
            {data.spatial && getMap()}
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
