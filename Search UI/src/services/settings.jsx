export const paths = {
    catalogueHome: '/',
    catalogueSearch: '/search',
    catalogueResource: '/resource'
};

export const getBaseUrlApi = host => {
    if (!host) host = window.location.href;

    if (host.includes('localhost')) {
        return 'http://localhost:8080';
    } else if (host.includes('test')) {
        return 'https://repo.soilwise-he-test.containers.wur.nl';
    } else {
        return 'https://repo.soilwise-he.containers.wur.nl';
    }
};

export const pyscwApiUrl = 'https://api.soilwise-he.containers.wur.nl';

export const mapParameters = {
    projection: 'EPSG:3857',
    dimensions: [100, 100],
    extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
    minimumZoom: 9,
    europeExtent: [-1500000, 4250000, 5000000, 10000000],
    padding: [50, 50, 50, 50],
    boundingBoxMargin: 0.05
};

export const termLabels = {
    soil_functions_terms: 'Soil functions',
    soil_chemical_properties_terms: 'Soil chemical properties',
    type_terms: 'Resource type',
    soil_biological_properties_terms: 'Soil biological properties',
    soil_processes_terms: 'Soil processes',
    project_acronym_terms: 'Projects',
    soil_physical_properties_terms: 'Soil physical properties',
    soil_classification_terms: 'Soil classification',
    ecosystem_services_terms: 'Ecosystem services',
    soil_management_terms: 'Soil management',
    soil_threats_terms: 'Soil threats',
    keywords_terms: 'Keywords'
};
export const listOfTerms = [
    'soil_management_terms',
    'soil_functions_terms',
    'soil_processes_terms',
    'soil_threats_terms',
    'soil_classification_terms',
    'soil_chemical_properties_terms',
    'soil_biological_properties_terms',
    'soil_physical_properties_terms',
    'ecosystem_services_terms',
    'project_acronym_terms',
    'keywords_terms'
];

export const defaultRange = {
    minimum: 1900,
    maximum: 2050
};
export const dateRanges = {
    issued: {
        label: 'Issued between',
        description:
            'The resource is created or published in the selected period.',
        attributes: ['date_creation_range', 'date_publication_range'],
        type: 'or'
    },
    changed: {
        label: 'Changed between',
        description:
            'The resource is modified or revised in the selected period.',
        attributes: ['date_revision_range', 'date_modified_range'],
        type: 'or'
    },
    coverage: {
        label: 'Temporal coverage within',
        description:
            'The resource covers the selected period, e.g. the data is collected in that period or the project was running in that period.',
        attributes: ['time_begin_range', 'time_end_range'],
        type: 'and'
    }
};
export const listOfDates = [
    'date_creation_range',
    'date_publication_range',
    'date_revision_range',
    'date_modified_range',
    'time_begin_range',
    'time_end_range'
];

export const typeOfAreas = {
    overlap: 'Resource area overlaps the selected area',
    within: 'Resource area is within the selected area'
};

export const interactionTypes = {
    drag: 'Drag and drop bounding box',
    search: 'Search for a location'
};

export const sortDescription =
    'Sort the results based on relevance or date, where relevance is determined by the occurence of the search terms in title, abstract and keywords.';
export const sortOptions = [
    { label: 'Relevance - best match first', value: 'score desc' },
    {
        label: 'Date - newest first',
        value: 'date_creation desc, date_publication desc, date desc'
    },
    {
        label: 'Date - oldest first',
        value: 'date_creation asc, date_publication asc, date asc'
    }
];

export const solrFacets = Object.fromEntries([
    [
        'type_terms',
        {
            field: 'type',
            mincount: 1,
            limit: -1,
            sort: {
                count: 'desc'
            },
            type: 'terms'
        }
    ],
    ...listOfDates.map(date => [
        date,
        {
            field: date.replace('_range', ''),
            gap: '+1YEAR',
            start: '1900-01-01T00:00:00Z',
            end: '2026-01-01T00:00:00Z',
            type: 'range'
        }
    ]),
    ...listOfTerms.map(term => [
        term,
        {
            field: term.replace('_terms', ''),
            mincount: 1,
            limit: -1,
            sort: {
                count: 'desc'
            },
            type: 'terms'
        }
    ])
]);
