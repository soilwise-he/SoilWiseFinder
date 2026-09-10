'use client';

import ToolTip from 'components/UIElements/ToolTip';

import { fieldDefinitions } from 'src/services/settings';
import { getDate } from 'src/services/util';
import PersonsAndOrganizations from '../Elements/PersonsAndOrganizations';
import Links from '../Elements/Links';

const Properties = ({ document }) => {
    const dateParagraph = (
        <div
            key="dates"
            className="property-group"
        >
            <p className="property-title">Dates</p>
            {[
                'date_creation',
                'date_revision',
                'date_publication',
                'date_harvest'
            ].map(
                field =>
                    document[field] && (
                        <p key={field}>
                            <ToolTip
                                title={fieldDefinitions[field].description}
                            >
                                <b>{fieldDefinitions[field].label}</b>
                            </ToolTip>
                            {getDate(document[field])}
                        </p>
                    )
            )}
        </div>
    );

    const authorParagraph = (
        <div
            id="authors"
            className="property-group"
        >
            <p className="property-title">Authors</p>
            <PersonsAndOrganizations
                data={document.view_authors}
                className="author"
            />
        </div>
    );

    const contactParagraph = (
        <div
            id="contacts"
            className="property-group"
        >
            <p className="property-title">Contacts</p>
            <PersonsAndOrganizations
                data={document.view_contacts}
                className="contact"
            />
        </div>
    );

    const projectParagraph = () => {
        let project = JSON.parse(document.projects[0]);

        return (
            <div
                id="projects"
                className="property-group"
            >
                <p className="property-title">Project</p>
                <div className="project">
                    <p className="acronym">{project.acronym}</p>
                    <p className="title">{project.title}</p>
                    <p className="grantnumber">
                        Grant number: {project.grantnr}
                    </p>
                </div>
            </div>
        );
    };

    const linkParagraph = (
        <div
            id="links"
            className="property-group"
        >
            <p className="property-title">Links</p>
            <Links data={document.links} />
        </div>
    );

    const sourceParagraph = (
        <div
            id="sources"
            className="property-group"
        >
            <p className="property-title">Sources</p>
            <ul>
                {document.sources.map((item, index) => (
                    <li key={'source-' + index}>{item}</li>
                ))}
            </ul>
        </div>
    );

    return (
        <div
            id="properties-container"
            className="block-container"
        >
            {dateParagraph}
            {document.view_authors && authorParagraph}
            {document.view_contacts && contactParagraph}
            {document.projects && projectParagraph()}
            {document.links && linkParagraph}
            {document.sources && sourceParagraph}
        </div>
    );
};

export default Properties;
