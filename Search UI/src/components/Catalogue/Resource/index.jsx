import HTMLMap from 'src/components/Map/HTMLMap';
import { getDate } from 'src/services/util';

const getKeywordChips = keywords => {
    let uniqueKeywords = keywords.reduce((uniqueKeywords, currentKeyword) => {
        let keyword = currentKeyword.toLowerCase();

        if (keyword in uniqueKeywords) {
            uniqueKeywords[keyword] += 1;
        } else {
            uniqueKeywords[keyword] = 1;
        }

        return uniqueKeywords;
    }, {});

    return (
        <div id="keyword-list">
            {Object.entries(uniqueKeywords)
                .sort((a, b) => {
                    if (a[1] === b[1]) {
                        return a[0] > b[0] ? 1 : -1;
                    } else {
                        return b[1] - a[1];
                    }
                })
                .map(([keyword, count]) => (
                    <div
                        key={keyword}
                        className={`keyword${count > 1 ? ' multiple' : ''}`}
                    >
                        {keyword}
                    </div>
                ))}
        </div>
    );
};

const getAuthors = item => {
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

    return authors ? (
        <p id="authors">
            <i>{authors}</i>
        </p>
    ) : null;
};

const getDateParagraph = (label, startDate, endDate) => {
    return (
        <p>
            <b>{label}</b>
            {startDate && getDate(startDate)}
            {endDate && ' to ' + getDate(endDate)}
        </p>
    );
};

const getMap = item => {
    return (
        <HTMLMap
            data={{
                wktFeature: item.wkb_geometry,
                crs: 'EPSG:4326'
            }}
        />
    );
};

const getContact = item => {
    return (
        <li key={item.organization + '-' + Math.random()}>
            <p className="tooltip">
                {item.url ? (
                    <a
                        href={item.url}
                        target="_blank"
                    >
                        {item.organization}
                    </a>
                ) : (
                    item.organization
                )}
                <span className="tooltiptext">
                    {item.address}
                    <br />
                    {item.postalCode + ' ' + item.city}
                    <br />
                    {(item.region != '' ? item.region + ', ' : '') +
                        item.country}
                </span>
            </p>
            <p>
                <span className="contact-item role">
                    {(item.name != '' ? item.name + ' - ' : '') + item.role}
                </span>
                {item.email != '' ? (
                    <>
                        <br />
                        <span className="contact-item email">
                            <a href={`mailto:${item.email}`}>{item.email}</a>
                        </span>
                    </>
                ) : null}
                {item.phoneNumber != '' ? (
                    <>
                        <br />
                        <span className="contact-item phone-number">
                            {item.phoneNumber}
                        </span>
                    </>
                ) : null}
                {item.faxNumber != '' ? (
                    <>
                        <br />
                        <span className="contact-item fax-number">
                            {item.faxNumber}
                        </span>
                    </>
                ) : null}
            </p>
        </li>
    );
};

const getThemes = item => {
    return (
        <div id="themes">
            {item.themes_thesaurus.map((thesaurus, index) => {
                if (thesaurus == '') return null;

                let parsedThesaurus = JSON.parse(thesaurus);
                let parsedKeywords = JSON.parse(item.themes_keywords[index]);

                return (
                    <div
                        key={'theme-' + index}
                        className="theme"
                    >
                        <p className="thesaurus">
                            <b>
                                {parsedThesaurus.url ? (
                                    <a
                                        href={parsedThesaurus.url}
                                        target="_blank"
                                    >
                                        {parsedThesaurus.title}
                                    </a>
                                ) : (
                                    parsedThesaurus.title
                                )}
                            </b>
                        </p>
                        <p>
                            {parsedKeywords.map((keyword, index) => {
                                let name =
                                    (index > 0 ? ', ' : '') + keyword.name;

                                return keyword.url ? (
                                    <a
                                        key={'url-' + index}
                                        href={keyword.url}
                                        target="_blank"
                                    >
                                        {name}
                                    </a>
                                ) : (
                                    name
                                );
                            })}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export function Resource(document) {
    if (document.document) document = document.document;

    let featuredImage = null;

    if (document.wkb_geometry) {
        featuredImage = getMap(document);
    }

    let rightSideElements = {};

    rightSideElements['Resource type'] = <p>{document.type}</p>;

    if (document.type === 'Journal Article') {
        rightSideElements['Journal'] = <p>{document.parentidentifier}</p>;
    }

    rightSideElements['Dates'] = (
        <div>
            {(document.date_creation || document.date_publication) &&
                getDateParagraph(
                    'Issued: ',
                    document.date_creation || document.date_publication
                )}
            {(document.date_modified || document.date_revised) &&
                getDateParagraph(
                    'Last changed: ',
                    document.date_modified || document.date_revised
                )}
            {getDateParagraph('Last harvested: ', document.insert_date)}
            {(document.time_begin || document.time_end) &&
                getDateParagraph(
                    'Temporal coverage: ',
                    document.time_begin,
                    document.time_end
                )}
        </div>
    );

    if (document.contacts_organization?.length > 0) {
        rightSideElements['Contact'] = (
            <ul id="contacts">
                {document.contacts_organization.map((organization, index) =>
                    getContact({
                        organization: organization,
                        url:
                            document.contacts_organization_url[index] ||
                            (document.contacts_onlineresource[index] &&
                                JSON.parse(
                                    document.contacts_onlineresource[index]
                                ).url),
                        address: document.contacts_address[index],
                        postalCode: document.contacts_postcode[index],
                        city: document.contacts_city[index],
                        region: document.contacts_region[index],
                        country: document.contacts_country[index],
                        name:
                            document.contacts_name[index] ||
                            document.contacts_name_url[index],
                        role: document.contacts_role[index],
                        email: document.contacts_email[index],
                        phoneNumber: document.contacts_phone[index],
                        faxNumber: document.contacts_fax[index]
                    })
                )}
            </ul>
        );
    }

    rightSideElements['Links'] = (
        <ul id="links">
            {document.links_url.map(
                (link, index) =>
                    link != '' && (
                        <li
                            key={'link-' + index}
                            className="link"
                        >
                            <a
                                href={link}
                                target="_blank"
                            >
                                {document.links_name[index] || link}
                            </a>
                        </li>
                    )
            )}
        </ul>
    );

    if (document.themes_thesaurus)
        rightSideElements['Themes'] = getThemes(document);

    return (
        <div id="main-container">
            <div id="left-side-container">
                <h1>{document.title}</h1>
                {getAuthors(document)}
                {document.abstract && (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: document.abstract
                        }}
                    />
                )}
                {document.keywords && getKeywordChips(document.keywords)}
            </div>
            <div id="right-side-container">
                {featuredImage && (
                    <div id="featured-image">{featuredImage}</div>
                )}
                <div
                    id="attributes-container"
                    className={featuredImage ? 'includeImage' : ''}
                >
                    {Object.entries(rightSideElements).map(([label, value]) => (
                        <div key={label}>
                            <p className="attribute-title">{label}</p>
                            {value}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
