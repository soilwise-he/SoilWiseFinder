import ToolTip from 'components/UIElements/ToolTip';
import HTMLMap from 'src/components/Map/HTMLMap';
import { fieldDefinitions, mapParameters } from 'src/services/settings';
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

    uniqueKeywords = matchedKeywords.reduce(
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
                        title={`This keyword is from the metadata ${type === 'original' ? 'as is' : ' and matched with the Soil Vocabulary'}.`}
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
            attributes.push(
                <ToolTip
                    title={fieldDefinitions[field].description}
                    key={field}
                >
                    <p>
                        <b>{fieldDefinitions[field].label}: </b> {item[field]}
                    </p>
                </ToolTip>
            );
        }
    });

    ['soilmission'].forEach(field => {
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

    return attributes;
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
        <ul>
            {items.map((item, index) => {
                item = JSON.parse(item);

                return (
                    <li
                        className="link"
                        key={label + '-' + index}
                    >
                        {
                            <a
                                href={decodeURIComponent(item.url)}
                                target="_blank"
                            >
                                {item.name || decodeURIComponent(item.url)}
                            </a>
                        }
                    </li>
                );
            })}
        </ul>
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
    return (
        <HTMLMap
            data={{
                wktFeature: item.spatial,
                crs: mapParameters.dataProjection
            }}
            key="map"
        />
    );
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
            getKeywordChips(document.subjects, document.matched_subjects || [])
        );
    }

    return leftSideElements;
};

const getRightSideElements = document => {
    let rightSideElements = [];

    rightSideElements.push([null, getSingularAttributes(document)]);

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
            <div id="left-side-container">{getLeftSideElements(document)}</div>
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
                                    <p className="attribute-title">{label}</p>
                                )}
                                {value}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
