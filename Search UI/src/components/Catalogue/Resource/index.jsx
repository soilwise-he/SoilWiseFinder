import { Close, Compare } from '@mui/icons-material';
import ToolTip from 'components/UIElements/ToolTip';

import HTMLMap from 'src/components/Map/HTMLMap';
import {
    fieldDefinitions,
    tagDefinitions,
    mapParameters,
    paths,
    getDetailsPageUrl
} from 'src/services/settings';
import { getDate } from 'src/services/util';

const getElementTitle = field => {
    return (
        <ToolTip title={fieldDefinitions[field].description}>
            {fieldDefinitions[field].label}
        </ToolTip>
    );
};

const getKeywordChips = (originalKeywords, matchedKeywords) => {
    let uniqueKeywords = originalKeywords.reduce(
        (uniqueKeywords, currentKeyword) => {
            uniqueKeywords[currentKeyword] = 'original';

            return uniqueKeywords;
        },
        {}
    );

    if (matchedKeywords) {
        uniqueKeywords = Object.keys(matchedKeywords).reduce(
            (uniqueKeywords, currentKeyword) => {
                if (currentKeyword in uniqueKeywords) {
                    uniqueKeywords[currentKeyword] = 'original_and_matched';
                } else {
                    uniqueKeywords[currentKeyword] = 'matched';
                }

                return uniqueKeywords;
            },
            uniqueKeywords
        );
    }

    return (
        <div
            key="keyword-list"
            id="keyword-list"
        >
            {Object.entries(uniqueKeywords)
                .sort((a, b) => {
                    if (a[1] === 'matched' && b[1] !== 'matched') {
                        return -1;
                    } else if (a[1] !== 'matched' && b[1] === 'matched') {
                        return 1;
                    } else if (
                        a[1] === 'original_and_matched' &&
                        b[1] === 'original'
                    ) {
                        return -1;
                    } else if (
                        a[1] === 'original' &&
                        b[1] === 'original_and_matched'
                    ) {
                        return 1;
                    } else {
                        return b[0] > a[0];
                    }
                })
                .map(([keyword, type]) => (
                    <ToolTip
                        key={keyword + '_' + type}
                        title={
                            matchedKeywords && keyword in matchedKeywords ? (
                                <div>
                                    <p>
                                        This keyword is from the metadata and
                                        matched with the Soil Vocabulary.
                                    </p>
                                    <p>{matchedKeywords[keyword]}</p>
                                </div>
                            ) : (
                                'This keyword is from the metadata as is.'
                            )
                        }
                    >
                        <div className={`keyword ${type}`}>{keyword}</div>
                    </ToolTip>
                ))}
        </div>
    );
};

const getSingularAttributes = item => {
    let attributes = [];

    ['type', 'license', 'language'].forEach(field => {
        if (item[field]) {
            let value = (
                <span className={field in item.augments ? 'augmented' : ''}>
                    {item[field]}
                </span>
            );

            if (field in item.augments) {
                value = (
                    <ToolTip
                        title={`This metadata value is augmented. The original value is '${item.augments[field].original}'.`}
                        className="tag"
                    >
                        {value}
                    </ToolTip>
                );
            }

            attributes.push(
                <p key={field}>
                    <b>
                        <ToolTip
                            title={fieldDefinitions[field].description}
                            key={field}
                        >
                            {fieldDefinitions[field].label + ': '}
                        </ToolTip>
                    </b>
                    {value}
                </p>
            );
        }
    });

    ['soilmission', 'european_funded'].forEach(field => {
        if (item[field]) {
            attributes.push(
                <ToolTip
                    title={fieldDefinitions[field].description}
                    key={field}
                >
                    <p className="tag">{fieldDefinitions[field].label}</p>
                </ToolTip>
            );
        }
    });

    ['spatial_description'].forEach(field => {
        if (field in item.augments) {
            attributes.push(
                <p key={field}>
                    <b>
                        <ToolTip
                            title={fieldDefinitions[field].description}
                            key={field}
                        >
                            {fieldDefinitions[field].label + ': '}
                        </ToolTip>
                    </b>
                    <ToolTip title={`This metadata value is augmented.`}>
                        <span className={'augmented'}>
                            {item.augments[field].target}
                        </span>
                    </ToolTip>
                </p>
            );
        }
    });

    return attributes;
};

const getAugmentations = item => {
    if (item.augments) {
        let augmentations = [
            <ToolTip
                title="Compare augmented data with original data"
                key="augmentations-toggle"
            >
                <a href="#augmentations-modal">
                    <Compare />
                </a>
            </ToolTip>,
            <div
                id="augmentations-modal"
                key="augmentations-modal"
            >
                <a
                    className="modal_close"
                    href="#"
                >
                    <Close />
                </a>
                <h2>Comparison between augmented and original metadata</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Metadata property</th>
                            <th>Augmented value</th>
                            <th>Original value</th>
                            <th>Augmentation process</th>
                            <th>Processed on</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(item.augments).map(
                            ([property, augmentation]) => (
                                <tr key={property}>
                                    <td>{fieldDefinitions[property]?.label}</td>
                                    <td className="value">
                                        {item[property] || augmentation.target}
                                    </td>
                                    <td className="value">
                                        {augmentation.original}
                                    </td>
                                    <td>
                                        {augmentation.process.replaceAll(
                                            '-',
                                            ' '
                                        )}
                                    </td>
                                    <td>{getDate(augmentation.date)}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        ];

        if ('completeness' in item.augments) {
            let value = parseFloat(item.augments.completeness.target).toFixed(
                0
            );

            augmentations.push(
                <ToolTip
                    key="completeness"
                    title={`The metadata of this record is ${value}% complete.`}
                >
                    <div
                        className={`completeness`}
                        style={{
                            background: `linear-gradient(to top, var(--mui-palette-custom-augmentationBorder) ${value}%, white ${value}%)`
                        }}
                    />
                </ToolTip>
            );
        }

        return <div className="augmentations">{augmentations}</div>;
    }
};

const getDateParagraph = (field, startDate, endDate) => {
    return (
        <p key={field}>
            <ToolTip title={fieldDefinitions[field].description}>
                <b>{fieldDefinitions[field].label}</b>
            </ToolTip>
            {startDate && getDate(startDate)}
            {endDate && ' to ' + getDate(endDate)}
        </p>
    );
};

const getPersonsAndOrganizations = (label, items) => {
    return (
        <div id={label + 's'}>
            {items.map((item, index) => {
                item = JSON.parse(item);

                return (
                    <div
                        className="person_organization"
                        key={label + '-' + index}
                    >
                        {item.person && (
                            <div className="person">{item.person}</div>
                        )}
                        {item.organization && (
                            <div className={item.person ? '' : 'organization'}>
                                {item.organization}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const getLinks = (label, items) => {
    return (
        <div className="links">
            {items.map((item, index) => {
                let linkLabel = item.name || decodeURIComponent(item.url);
                let linkStatus = 'ok';

                if (linkLabel === 'undefined') {
                    linkLabel = 'checking url';
                }

                if (item.status_code >= 300 && item.status_code < 400) {
                    linkStatus = 'redirected';
                } else if (item.status_code === 403) {
                    linkStatus = 'unauthorized';
                } else if (item.status_code === 404) {
                    linkStatus = 'not_found';
                } else if (item.status_code > 400) {
                    linkStatus = 'error';
                }

                return (
                    <a
                        key={label + '-' + index}
                        href={decodeURIComponent(item.url)}
                        className={`link ${linkStatus}`}
                        target="_blank"
                    >
                        {linkLabel}
                    </a>
                );
            })}
        </div>
    );
};

const getList = (label, value) => {
    return (
        <ul>
            {value.map((item, index) => (
                <li key={label + '-' + index}>{item}</li>
            ))}
        </ul>
    );
};

const getProject = item => {
    let project = JSON.parse(item);

    return (
        <div className="project">
            <p className="acronym">{project.acronym}</p>
            <p className="title">{project.title}</p>
            <p className="grantnumber">Grant number: {project.grantnr}</p>
        </div>
    );
};

const getMap = item => {
    let map = (
        <HTMLMap
            data={{
                wktFeature: item.spatial,
                crs: mapParameters.dataProjection
            }}
            key="map"
        />
    );

    if ('spatial' in item.augments) {
        map = (
            <ToolTip
                title={`This metadata value is augmented. The original bounding box is ${item.augments.spatial.original}.`}
            >
                <div className={'augmented'}>{map}</div>
            </ToolTip>
        );
    }

    return map;
};

const getLeftSideElements = document => {
    let leftSideElements = [];

    leftSideElements.push(
        <h1
            key="title"
            dangerouslySetInnerHTML={{ __html: document.title }}
        />
    );

    if (document.abstract) {
        leftSideElements.push(
            <div
                key="abstract"
                dangerouslySetInnerHTML={{
                    __html: document.abstract
                }}
            />
        );
    }

    if (document.subjects) {
        leftSideElements.push(
            getKeywordChips(document.subjects, document.matched_subjects)
        );
    }

    return leftSideElements;
};

const getRightSideElements = document => {
    let rightSideElements = [];

    rightSideElements.push([
        null,
        <div id="right-side-top">
            <div>{getSingularAttributes(document)}</div>
            {getAugmentations(document)}
        </div>
    ]);

    let dateElements = [
        'date_creation',
        'date_revision',
        'date_publication',
        'date_harvest'
    ].map(field => document[field] && getDateParagraph(field, document[field]));

    if (dateElements.filter(item => item != undefined).length > 0) {
        rightSideElements.push(['Dates', <div>{dateElements}</div>]);
    }

    if (document.view_authors) {
        rightSideElements.push([
            getElementTitle('view_authors'),
            getPersonsAndOrganizations('author', document.view_authors)
        ]);
    }

    if (document.view_contacts) {
        rightSideElements.push([
            getElementTitle('view_contacts'),
            getPersonsAndOrganizations('contact', document.view_contacts)
        ]);
    }

    if (document.sources) {
        rightSideElements.push([
            getElementTitle('sources'),
            getList('source', document.sources)
        ]);
    }

    if (document.projects) {
        rightSideElements.push([
            getElementTitle('projects'),
            getProject(document.projects[0])
        ]);
    }

    if (document.links) {
        rightSideElements.push([
            getElementTitle('links'),
            getLinks('link', document.links)
        ]);
    }

    return rightSideElements;
};

const getAuthor = document => {
    let authors = null;

    if (document.view_authors) {
        let organizations = document.view_authors.reduce(
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

    return authors && <p className="authors">{authors}</p>;
};

const getSimilarResources = document => {
    if (!document.similarResources) return;

    return document.similarResources.map(item => (
        <a
            className="similar-resource"
            key={item.identifier}
            href={getDetailsPageUrl(item.identifier, true)}
            target="_blank"
        >
            <h2
                className="title"
                dangerouslySetInnerHTML={{
                    __html: item.title
                }}
            />
            {getAuthor(item)}
            {item.date && (
                <p className="entry-date">
                    <i>Available since: {getDate(item.date)}</i>
                </p>
            )}

            <div className="tags">
                <span>{document.type}</span>
                {document.soilmission && (
                    <span>{tagDefinitions.soilmission}</span>
                )}
                {document.european_funded && (
                    <span>{tagDefinitions.european_funded}</span>
                )}
                {document.license && <span>{document.license}</span>}
            </div>

            <p
                className="abstract"
                dangerouslySetInnerHTML={{
                    __html: item.abstract
                }}
            />
        </a>
    ));
};

const getBottomElements = document => {
    return [
        <div key="similar-resrouces">Similar resources</div>,
        getSimilarResources(document)
    ];
};

export function Resource({ document }) {
    if (!document) return <div>No resource with this identifier</div>;

    let featuredImages = [];

    if (document.spatial) {
        featuredImages.push(getMap(document));
    }

    if (document.thumbnail) {
        featuredImages.push(
            <img
                key="thumbnail"
                src={document.thumbnail}
                alt="thumbnail"
            />
        );
    }

    return (
        <div id="main-container">
            <div id="top-container">
                <div id="left-side-container">
                    {getLeftSideElements(document)}
                </div>
                <div id="right-side-container">
                    {featuredImages.map((featuredImage, index) => (
                        <div
                            key={'featured-image-' + index}
                            className="featured-image"
                        >
                            {featuredImage}
                        </div>
                    ))}
                    <div
                        id="attributes-container"
                        className={
                            featuredImages.length == 0
                                ? ''
                                : featuredImages.length == 1
                                  ? 'include-image'
                                  : 'include-images'
                        }
                    >
                        {getRightSideElements(document).map(
                            ([label, value], index) => (
                                <div key={'right-' + index}>
                                    {label && (
                                        <p className="attribute-title">
                                            {label}
                                        </p>
                                    )}
                                    {value}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div id="bottom-container">{getBottomElements(document)}</div>
        </div>
    );
}
