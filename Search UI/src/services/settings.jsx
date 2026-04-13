export const paths = {
    catalogueHome: '/',
    catalogueSearch: '/search',
    catalogueResource: '/resource'
};

export const getBaseUrlApi = () => {
    return process.env.NEXT_PUBLIC_BASE_URL_SEARCH_API || '/search-api';
};

export const getDetailsPageUrl = (identifier, relative = false) => {
    return `${relative ? '' : window.location.host}${paths.catalogueResource}/${encodeURIComponent(identifier)}`;
};

export const pyscwApiUrl = 'https://api.soilwise-he.containers.wur.nl';

export const mapParameters = {
    defaultProjection: 'EPSG:3857',
    dataProjection: 'EPSG:4326',
    dimensions: [100, 100],
    extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
    minimumZoom: 9,
    europeExtent: [-1500000, 4250000, 5000000, 10000000],
    padding: [50, 50, 50, 50],
    boundingBoxMargin: 0.05
};

export const maximumNumberOfResultsToDownload = 1000;

export const fieldDefinitions = {
    type: {
        label: 'Resource type',
        description: 'Type of resource, e.g. journal paper, dataset, etc.'
    },
    soilmission: {
        label: 'Part of Mission Soil',
        description:
            'Whether the resource is an output of a Soil Mission project.'
    },
    license: {
        label: 'License',
        description: 'Type of license that applies to the resource.'
    },
    date_publication: {
        label: 'Pulished on: ',
        description: 'Date the resource is published.'
    },
    view_authors: {
        label: 'Author(s)',
        description:
            'The organisation(s) or person(s) that created the resource, i.e. the authors of a journal article or the organisation that created a dataset.'
    },
    view_contacts: {
        label: 'Contact(s)',
        description:
            'The organisation(s) or person(s) that are a contact point for the resource.'
    },
    sources: {
        label: 'Source(s)',
        description:
            "The repositories that the resource's metdata is sourced from."
    },
    language: {
        label: 'Language',
        description: "The language of the resource's metadata."
    },
    date_creation: {
        label: 'Created on: ',
        description: 'Date the resource is created.'
    },
    date_revision: {
        label: 'Revised on: ',
        description: 'Date the resource is revised.'
    },
    date: {
        label: 'Date',
        description:
            'Date the resource is instantiated, i.e. the date a resource is created, revised or published.'
    },
    date_harvest: {
        label: 'Harvested on: ',
        description:
            "Date the resource is harvested from it's original repository."
    },
    projects: {
        label: 'Project',
        description: 'The project in which the resource is created.'
    },
    links: {
        label: 'Link(s)',
        description: 'Links to the original metadata of the resource.'
    },
    subjects: {
        label: 'Keywords',
        description:
            'The keywords that are given in the metadata of the resource.'
    },
    matched_subjects: {
        label: 'Soil Vocabulary Keywords',
        description:
            'The keywords from the Soil Vocabulary that are matched with the keywords in the metadata of the resource.'
    }
};

export const filterDefinitions = {
    type_terms: {
        label: 'Resource type',
        description:
            'The resource is of the selected type(s), e.g. journal paper, dataset, etc.'
    },
    soilmission_query: {
        label: 'Part of Mission Soil',
        description: 'The resource is an output of a Soil Mission project.'
    },
    license_terms: {
        label: 'License',
        description: 'One of the selected licenses applies to the resource.'
    },
    sources_terms: {
        label: 'Source',
        description:
            "The resource's metadata is sourced from the selected repositories."
    },
    language_terms: {
        label: 'Language',
        description:
            "The resource's metadata is written in one of the selected languages."
    },
    project_acronyms_terms: {
        label: 'Project',
        description:
            'The resource is an output of one of the selected projects.'
    },
    matched_subjects_terms: {
        label: 'Keywords',
        description: 'The selected keywords apply to the resource.'
    },
    date_range: {
        label: 'Available since',
        description:
            'The resource is created or published in the selected period.'
    },
    temporal_coverage_range: {
        label: 'Temporal coverage within',
        description:
            'The resource covers the selected period, i.e. the data is collected in that period or the study is focussing on that period.'
    }
};

export const staticFilterKeys = [
    'type_terms',
    'soilmission_query',
    'license_terms',
    'language_terms',
    'project_acronyms_terms',
    'date_range',
    'temporal_coverage_range',
    'sources_terms',
    'matched_subjects_terms'
];
export const dynamicFilterKeys = [];

export const resourceTypeFilterKey = 'type_terms';
export const thematicFilterKeys = [
    'soilmission_query',
    'license_terms',
    'language_terms',
    'project_acronyms_terms',
    'sources_terms',
    'matched_subjects_terms'
];
export const nestedTerms = [];

export const defaultRange = {
    minimum: 1900,
    maximum: 2050,
    gap: 10
};
export const rangeFilters = ['date_range', 'temporal_coverage_range'];

export const typeOfSpatialFilters = {
    overlap: 'Resource area overlaps the selected area',
    within: 'Resource area is within the selected area'
};

export const interactionTypes = {
    drag: 'Drag and drop bounding box',
    draw: 'Draw a freeform shape',
    search: 'Search for a location'
};

export const sortDescription =
    'Sort the results based on relevance, where relevance is determined by the occurence of the search terms in title and abstract.';
export const sortOptions = [
    { label: 'Relevance - best match first', value: 'score desc' },
    { label: 'Date - newest first', value: 'date desc' },
    { label: 'Date - oldest first', value: 'date asc' }
];

export const tagDefinitions = {
    soilmission: 'Mission Soil'
};

export const solrFacets = {
    type_terms: {
        field: 'type',
        mincount: 1,
        limit: -1,
        sort: {
            count: 'desc'
        },
        type: 'terms'
    },
    soilmission_query: {
        q: 'soilmission:true',
        type: 'query'
    },
    license_terms: {
        field: 'license',
        mincount: 1,
        limit: -1,
        sort: {
            count: 'desc'
        },
        type: 'terms'
    },
    language_terms: {
        field: 'language',
        mincount: 1,
        limit: -1,
        sort: {
            count: 'desc'
        },
        type: 'terms'
    },
    project_acronyms_terms: {
        field: 'project_acronyms',
        mincount: 1,
        limit: -1,
        sort: {
            count: 'desc'
        },
        type: 'terms'
    },
    sources_terms: {
        field: 'sources',
        mincount: 1,
        limit: -1,
        sort: {
            count: 'desc'
        },
        type: 'terms',
        subtype: 'list'
    },
    matched_subjects_terms: {
        field: 'matched_subjects',
        mincount: 1,
        limit: -1,
        sort: {
            count: 'desc'
        },
        type: 'terms',
        subtype: 'list'
    },
    date_range: {
        field: 'date',
        start: defaultRange.minimum + '-01-01T00:00:00Z',
        end: defaultRange.maximum + '-01-01T00:00:00Z',
        gap: '+' + defaultRange.gap + 'YEAR',
        type: 'range',
        subtype: 'date'
    },
    temporal_coverage_range: {
        field: 'temporal_range',
        start: defaultRange.minimum + '-01-01T00:00:00Z',
        end: defaultRange.maximum + '-01-01T00:00:00Z',
        gap: '+' + defaultRange.gap + 'YEAR',
        type: 'range',
        subtype: 'period'
    }
};

export const keywordMainTopics = [
    { label: 'soil health' },
    { label: 'soil properties' },
    { label: 'soil indicators' },
    { label: 'soil functions' },
    { label: 'soil threats' },
    { label: 'soil management' }
];
