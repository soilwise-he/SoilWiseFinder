import styled from '@emotion/styled';
import { Button } from '@mui/material';

import MapWrapper from 'components/Map/MapWrapper';
import SimpleMapContent from 'components/Map/MapContent/SimpleMapContent';
import { mapParameters, tagDefinitions } from 'src/services/settings';
import { useCallback } from 'react';
import ToolTip from 'components/UIElements/ToolTip';

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
    align-items: center;
`;

const Tag = styled(Button)`
    border: 1px solid var(--variant-outlinedBorder) !important;
    background-color: var(--variant-outlinedBg) !important;
    color: var(--variant-outlinedColor) !important;

    &.augmented {
        color: var(--mui-palette-custom-augmentationColor) !important;
        background-color: var(--mui-palette-custom-augmentationBg) !important;
        border: 1px solid var(--mui-palette-custom-augmentationBorder) !important;
    }
`;

const Status = styled.div`
    width: 20px;
    height: 2.28rem;
    border: 1px solid var(--mui-palette-custom-augmentationBorder);
    border-radius: var(--mui-shape-borderRadius-0);
    background: linear-gradient(
        to top,
        var(--mui-palette-custom-augmentationBorder) ${props => props.value}%,
        white ${props => props.value}%
    );
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

    &.augmented {
        border: 2px solid var(--mui-palette-custom-augmentationBorder);
        border-radius: var(--mui-shape-borderRadius-0);
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
            <ToolTip
                title={`The metadata of this record is ${value}% complete.`}
            >
                <Status value={value} />
            </ToolTip>
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
                {getDate(data)}

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
