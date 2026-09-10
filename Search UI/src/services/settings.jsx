export const paths = {
    catalogueHome: '/',
    catalogueSearch: '/search',
    catalogueResource: '/resource'
};

export const getDetailsPageUrl = (identifier, relative = false) => {
    return identifier
        ? `${relative ? '' : window.location.host}${paths.catalogueResource}/${encodeURIComponent(identifier)}`
        : '';
};

export const getUrl = (environment, endpoint) => {
    if (endpoint.startsWith('util') || endpoint.startsWith('linky')) {
        return environment.NEXT_PUBLIC_UTIL_URL + '/' + endpoint;
    } else if (endpoint.startsWith('vocab')) {
        return environment.NEXT_PUBLIC_SOIL_VOCAB_URL + '/' + endpoint;
    } else {
        return environment.NEXT_PUBLIC_BASE_URL + '/' + endpoint;
    }
};

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
    european_funded: {
        label: 'Funded by EU',
        description:
            'Whether the resource is an output of a European funded project.'
    },
    license: {
        label: 'License',
        description: 'Type of license that applies to the resource.'
    },
    date_publication: {
        label: 'Published on: ',
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
    },
    completeness: {
        label: 'Completeness',
        description:
            "The completeness of a metadata record is an assessment of how populated the metadata is. It's a percentage of the number of metadata fields that has an original or augmented value."
    },
    spatial: {
        label: 'Spatial',
        description: 'The spatial extent of the resource.'
    },
    spatial_description: {
        label: 'Spatial description',
        description: 'A description of the spatial extent of the resource.'
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
    european_funded_query: {
        label: 'Funded by EU',
        description: 'The resource is an output of a European funded project.'
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
        description:
            'In this panel you can select keywords that apply to a resource. The keywords are structured based on the Soil Vocabulary. You can click through the tree and follow the Soil Vocabulary hierarchy. Or you can search for a keyword at the top.'
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
    'soilmission_query',
    'european_funded_query',
    'date_range',
    'temporal_coverage_range',
    'matched_subjects_terms'
];
export const dynamicFilterKeys = [
    'type_terms',
    'license_terms',
    'language_terms',
    'project_acronyms_terms',
    'sources_terms'
];

export const resourceTypeFilterKey = 'type_terms';
export const thematicFilterKeys = [
    'soilmission_query',
    'european_funded_query',
    'license_terms',
    'language_terms',
    'project_acronyms_terms',
    'sources_terms'
];
export const nestedTerms = ['matched_subjects_terms'];

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
    soilmission: 'Mission Soil',
    european_funded: 'EU funded'
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
    european_funded_query: {
        q: 'european_funded:true',
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

export const termHierarchies = {
    matched_subjects_terms: {
        nested: {
            soil: {},
            'soil properties': {
                'soil chemical properties': {
                    'soil nutrients': {
                        micronutrients: {
                            iron: {},
                            manganese: {},
                            zinc: {},
                            copper: {},
                            boron: {}
                        },
                        macronutrients: {
                            nitrogen: {},
                            phosphorus: {
                                'phosphorus retention': {}
                            },
                            sulfur: {}
                        }
                    },
                    carbonate: {
                        'carbonate contents': {}
                    },
                    'soil pH': {},
                    'soil charge properties': {},
                    'soil salinity': {}
                },
                'soil physical properties': {
                    'soil cohesion': {},
                    peat: {
                        'peat decompostion': {}
                    },
                    'soil voids': {
                        'void classification': {}
                    },
                    'soil temperature': {},
                    'soil structure': {},
                    'soil thermal properties': {
                        'soil thermal conductivity': {}
                    },
                    'soil types': {},
                    'soil pore physical properties': {
                        'soil porosity': {
                            'air porosity': {}
                        },
                        'soil pore size distribution': {}
                    },
                    'soil clay mineralogy': {},
                    'soil water physical properties': {
                        'soil hydraulic conductivity': {},
                        'groundwater depth': {},
                        'soil moisture potential': {
                            'soil matric potential': {}
                        },
                        'soil saturation': {}
                    },
                    'soil aggregate physical properties': {
                        'soil aggregate stability': {}
                    },
                    'soil electrical conductivity': {},
                    'soil contents': {
                        'soil organic matter contents': {},
                        'soil clay contents': {},
                        'soil clay mineral': {}
                    },
                    'soil density': {
                        'soil bulk density': {
                            'bulk density peat': {}
                        }
                    },
                    gypsum: {},
                    'soil particle physical properties': {
                        'particle size fraction sum': {},
                        'soil particle size distribution': {}
                    },
                    'soil penetration resistance': {},
                    'soil sensitivity': {},
                    'soil stability': {},
                    'soil vapour pressure': {}
                },
                'soil biological properties': {
                    'soil biota': {
                        biomass: {
                            'soil microbial biomass': {}
                        }
                    }
                },
                'soil age': {}
            },
            geology: {
                lithology: {},
                'parent material': {
                    'parent deposition': {}
                }
            },
            'soil substance': {
                'soil components': {
                    'soil organic components': {
                        'soil organic matter': {
                            'soil organic carbon': {
                                'soil carbon density': {}
                            }
                        }
                    },
                    'soil air': {},
                    'soil water': {},
                    'soil particles': {
                        'soil primary particles': {
                            sand: {},
                            clay: {},
                            silt: {}
                        },
                        'soil separate': {}
                    },
                    'soil moisture': {},
                    'soil liquid': {}
                },
                'soil organisms': {
                    'soil fauna': {
                        'soil microfauna': {},
                        'soil macrofauna': {
                            earthworms: {}
                        },
                        'soil mesofauna': {}
                    },
                    microbes: {}
                },
                'soil pores': {
                    'soil micropore': {}
                },
                'soil chemical': {
                    salts: {
                        'soluble salts': {
                            'salt contents': {}
                        },
                        'salt cover': {}
                    }
                }
            },
            'soil health': {},
            'soil processes': {
                'soil physical processes': {
                    'soil movement': {
                        'soil subsidence': {}
                    },
                    'soil physical degradative processes': {
                        'soil erosion': {}
                    },
                    'soil densification': {
                        'soil compression': {
                            'soil compaction': {},
                            'soil consolidation': {}
                        }
                    },
                    'soil water physical processes': {
                        'soil water movement': {},
                        'soil melting': {},
                        'soil water infiltration': {}
                    },
                    'soil formation': {},
                    'soil retention': {
                        'soil water retention': {},
                        'soil water storage': {}
                    },
                    'soil aggregation': {},
                    'soil dispersion': {},
                    'soil air physical processes': {
                        'soil gaseous emission': {}
                    },
                    'soil transport': {}
                },
                'soil chemical processes': {
                    'soil chemical degradative processes': {
                        'soil degradation': {},
                        'soil acidification': {}
                    },
                    'soil chemical reaction': {
                        'soil oxidation reduction reaction': {
                            'soil denitrification': {}
                        }
                    },
                    'soil mineralization': {},
                    'soil salinization': {},
                    'soil sorption': {},
                    'soil desertification': {}
                },
                'soil biological processes': {
                    'root respiration': {},
                    'biological nitrogen fixation': {}
                }
            },
            'non-soil indicators': {
                'external factors': {
                    climate: {},
                    'land use': {},
                    emissions: {},
                    inputs: {}
                },
                'environmental factors': {}
            },
            'ecosystem services': {},
            'soil threats': {
                'soil pollution': {
                    'soil contaminants': {
                        cadmium: {}
                    }
                },
                'soil sealing': {},
                'soil biodiversity loss': {},
                salinisation: {},
                'soil nutrient loss': {}
            },
            'soil management': {
                'pesticide use': {},
                irrigation: {},
                mulching: {},
                'fertiliser use': {},
                'no till': {},
                'soil tillage': {}
            },
            'soil functions': {
                'soil agricultural functions': {
                    'soil respiration': {},
                    'soil productivity': {},
                    'soil microbial activity': {},
                    'crop yield': {},
                    'plant water uptake': {},
                    'root growth': {}
                },
                'soil engineering functions': {
                    'water quality': {},
                    filtration: {},
                    'soil drainage': {
                        'conventional drainage': {}
                    }
                },
                'climate regulation': {},
                'food production': {},
                habitats: {},
                'water purification': {}
            },
            'planetary phenomena': {
                weather: {},
                'water interchange': {
                    precipitation: {
                        rain: {},
                        sleet: {},
                        snow: {}
                    },
                    evapotranspiration: {},
                    transpiration: {},
                    runoff: {
                        'surface runoff': {}
                    },
                    evapouration: {}
                },
                inundation: {
                    floods: {}
                },
                season: {}
            },
            'soil organic carbon loss': {},
            'soil indicators': {
                'soil function indicators': {
                    'biomass productivity': {},
                    'groundwater reproduction': {}
                },
                'soil structure index': {
                    'soil structure indirect index': {
                        'clay ratio': {}
                    }
                }
            },
            'land cover': {
                'plant cover': {
                    vegetation: {
                        trees: {},
                        grasses: {}
                    },
                    crop: {},
                    'plant part': {
                        roots: {}
                    }
                },
                'ground cover': {}
            },
            physiography: {
                slope: {}
            },
            'soil description': {
                'land use class': {}
            },
            'soil classification': {},
            'soil phenomena': {
                'soil failure': {
                    'soil fragmentation': {}
                },
                'soil hydrophobicity': {},
                'soil water repellency': {}
            },
            'soil nitrogen loss': {}
        },
        flattened: {
            soil: [],
            iron: [
                'soil properties',
                'soil chemical properties',
                'soil nutrients',
                'micronutrients'
            ],
            manganese: [
                'soil properties',
                'soil chemical properties',
                'soil nutrients',
                'micronutrients'
            ],
            zinc: [
                'soil properties',
                'soil chemical properties',
                'soil nutrients',
                'micronutrients'
            ],
            copper: [
                'soil properties',
                'soil chemical properties',
                'soil nutrients',
                'micronutrients'
            ],
            boron: [
                'soil properties',
                'soil chemical properties',
                'soil nutrients',
                'micronutrients'
            ],
            nitrogen: [
                'soil properties',
                'soil chemical properties',
                'soil nutrients',
                'macronutrients'
            ],
            'phosphorus retention': [
                'soil properties',
                'soil chemical properties',
                'soil nutrients',
                'macronutrients',
                'phosphorus'
            ],
            sulfur: [
                'soil properties',
                'soil chemical properties',
                'soil nutrients',
                'macronutrients'
            ],
            'carbonate contents': [
                'soil properties',
                'soil chemical properties',
                'carbonate'
            ],
            'soil pH': ['soil properties', 'soil chemical properties'],
            'soil charge properties': [
                'soil properties',
                'soil chemical properties'
            ],
            'soil salinity': ['soil properties', 'soil chemical properties'],
            'soil cohesion': ['soil properties', 'soil physical properties'],
            'peat decompostion': [
                'soil properties',
                'soil physical properties',
                'peat'
            ],
            'void classification': [
                'soil properties',
                'soil physical properties',
                'soil voids'
            ],
            'soil temperature': ['soil properties', 'soil physical properties'],
            'soil structure': ['soil properties', 'soil physical properties'],
            'soil thermal conductivity': [
                'soil properties',
                'soil physical properties',
                'soil thermal properties'
            ],
            'soil types': ['soil properties', 'soil physical properties'],
            'air porosity': [
                'soil properties',
                'soil physical properties',
                'soil pore physical properties',
                'soil porosity'
            ],
            'soil pore size distribution': [
                'soil properties',
                'soil physical properties',
                'soil pore physical properties'
            ],
            'soil clay mineralogy': [
                'soil properties',
                'soil physical properties'
            ],
            'soil hydraulic conductivity': [
                'soil properties',
                'soil physical properties',
                'soil water physical properties'
            ],
            'groundwater depth': [
                'soil properties',
                'soil physical properties',
                'soil water physical properties'
            ],
            'soil matric potential': [
                'soil properties',
                'soil physical properties',
                'soil water physical properties',
                'soil moisture potential'
            ],
            'soil saturation': [
                'soil properties',
                'soil physical properties',
                'soil water physical properties'
            ],
            'soil aggregate stability': [
                'soil properties',
                'soil physical properties',
                'soil aggregate physical properties'
            ],
            'soil electrical conductivity': [
                'soil properties',
                'soil physical properties'
            ],
            'soil organic matter contents': [
                'soil properties',
                'soil physical properties',
                'soil contents'
            ],
            'soil clay contents': [
                'soil properties',
                'soil physical properties',
                'soil contents'
            ],
            'soil clay mineral': [
                'soil properties',
                'soil physical properties',
                'soil contents'
            ],
            'bulk density peat': [
                'soil properties',
                'soil physical properties',
                'soil density',
                'soil bulk density'
            ],
            gypsum: ['soil properties', 'soil physical properties'],
            'particle size fraction sum': [
                'soil properties',
                'soil physical properties',
                'soil particle physical properties'
            ],
            'soil particle size distribution': [
                'soil properties',
                'soil physical properties',
                'soil particle physical properties'
            ],
            'soil penetration resistance': [
                'soil properties',
                'soil physical properties'
            ],
            'soil sensitivity': ['soil properties', 'soil physical properties'],
            'soil stability': ['soil properties', 'soil physical properties'],
            'soil vapour pressure': [
                'soil properties',
                'soil physical properties'
            ],
            'soil microbial biomass': [
                'soil properties',
                'soil biological properties',
                'soil biota',
                'biomass'
            ],
            'soil age': ['soil properties'],
            lithology: ['geology'],
            'parent deposition': ['geology', 'parent material'],
            'soil carbon density': [
                'soil substance',
                'soil components',
                'soil organic components',
                'soil organic matter',
                'soil organic carbon'
            ],
            'soil air': ['soil substance', 'soil components'],
            'soil water': ['soil substance', 'soil components'],
            sand: [
                'soil substance',
                'soil components',
                'soil particles',
                'soil primary particles'
            ],
            clay: [
                'soil substance',
                'soil components',
                'soil particles',
                'soil primary particles'
            ],
            silt: [
                'soil substance',
                'soil components',
                'soil particles',
                'soil primary particles'
            ],
            'soil separate': [
                'soil substance',
                'soil components',
                'soil particles'
            ],
            'soil moisture': ['soil substance', 'soil components'],
            'soil liquid': ['soil substance', 'soil components'],
            'soil microfauna': [
                'soil substance',
                'soil organisms',
                'soil fauna'
            ],
            earthworms: [
                'soil substance',
                'soil organisms',
                'soil fauna',
                'soil macrofauna'
            ],
            'soil mesofauna': [
                'soil substance',
                'soil organisms',
                'soil fauna'
            ],
            microbes: ['soil substance', 'soil organisms'],
            'soil micropore': ['soil substance', 'soil pores'],
            'salt contents': [
                'soil substance',
                'soil chemical',
                'salts',
                'soluble salts'
            ],
            'salt cover': ['soil substance', 'soil chemical', 'salts'],
            'soil health': [],
            'soil subsidence': [
                'soil processes',
                'soil physical processes',
                'soil movement'
            ],
            'soil erosion': [
                'soil processes',
                'soil physical processes',
                'soil physical degradative processes'
            ],
            'soil compaction': [
                'soil processes',
                'soil physical processes',
                'soil densification',
                'soil compression'
            ],
            'soil consolidation': [
                'soil processes',
                'soil physical processes',
                'soil densification',
                'soil compression'
            ],
            'soil water movement': [
                'soil processes',
                'soil physical processes',
                'soil water physical processes'
            ],
            'soil melting': [
                'soil processes',
                'soil physical processes',
                'soil water physical processes'
            ],
            'soil water infiltration': [
                'soil processes',
                'soil physical processes',
                'soil water physical processes'
            ],
            'soil formation': ['soil processes', 'soil physical processes'],
            'soil water retention': [
                'soil processes',
                'soil physical processes',
                'soil retention'
            ],
            'soil water storage': [
                'soil processes',
                'soil physical processes',
                'soil retention'
            ],
            'soil aggregation': ['soil processes', 'soil physical processes'],
            'soil dispersion': ['soil processes', 'soil physical processes'],
            'soil gaseous emission': [
                'soil processes',
                'soil physical processes',
                'soil air physical processes'
            ],
            'soil transport': ['soil processes', 'soil physical processes'],
            'soil degradation': [
                'soil processes',
                'soil chemical processes',
                'soil chemical degradative processes'
            ],
            'soil acidification': [
                'soil processes',
                'soil chemical processes',
                'soil chemical degradative processes'
            ],
            'soil denitrification': [
                'soil processes',
                'soil chemical processes',
                'soil chemical reaction',
                'soil oxidation reduction reaction'
            ],
            'soil mineralization': [
                'soil processes',
                'soil chemical processes'
            ],
            'soil salinization': ['soil processes', 'soil chemical processes'],
            'soil sorption': ['soil processes', 'soil chemical processes'],
            'soil desertification': [
                'soil processes',
                'soil chemical processes'
            ],
            'root respiration': ['soil processes', 'soil biological processes'],
            'biological nitrogen fixation': [
                'soil processes',
                'soil biological processes'
            ],
            climate: ['non-soil indicators', 'external factors'],
            'land use': ['non-soil indicators', 'external factors'],
            emissions: ['non-soil indicators', 'external factors'],
            inputs: ['non-soil indicators', 'external factors'],
            'environmental factors': ['non-soil indicators'],
            'ecosystem services': [],
            cadmium: ['soil threats', 'soil pollution', 'soil contaminants'],
            'soil sealing': ['soil threats'],
            'soil biodiversity loss': ['soil threats'],
            salinisation: ['soil threats'],
            'soil nutrient loss': ['soil threats'],
            'pesticide use': ['soil management'],
            irrigation: ['soil management'],
            mulching: ['soil management'],
            'fertiliser use': ['soil management'],
            'no till': ['soil management'],
            'soil tillage': ['soil management'],
            'soil respiration': [
                'soil functions',
                'soil agricultural functions'
            ],
            'soil productivity': [
                'soil functions',
                'soil agricultural functions'
            ],
            'soil microbial activity': [
                'soil functions',
                'soil agricultural functions'
            ],
            'crop yield': ['soil functions', 'soil agricultural functions'],
            'plant water uptake': [
                'soil functions',
                'soil agricultural functions'
            ],
            'root growth': ['soil functions', 'soil agricultural functions'],
            'water quality': ['soil functions', 'soil engineering functions'],
            filtration: ['soil functions', 'soil engineering functions'],
            'conventional drainage': [
                'soil functions',
                'soil engineering functions',
                'soil drainage'
            ],
            'climate regulation': ['soil functions'],
            'food production': ['soil functions'],
            habitats: ['soil functions'],
            'water purification': ['soil functions'],
            weather: ['planetary phenomena'],
            rain: ['planetary phenomena', 'water interchange', 'precipitation'],
            sleet: [
                'planetary phenomena',
                'water interchange',
                'precipitation'
            ],
            snow: ['planetary phenomena', 'water interchange', 'precipitation'],
            evapotranspiration: ['planetary phenomena', 'water interchange'],
            transpiration: ['planetary phenomena', 'water interchange'],
            'surface runoff': [
                'planetary phenomena',
                'water interchange',
                'runoff'
            ],
            evapouration: ['planetary phenomena', 'water interchange'],
            floods: ['planetary phenomena', 'inundation'],
            season: ['planetary phenomena'],
            'soil organic carbon loss': [],
            'biomass productivity': [
                'soil indicators',
                'soil function indicators'
            ],
            'groundwater reproduction': [
                'soil indicators',
                'soil function indicators'
            ],
            'clay ratio': [
                'soil indicators',
                'soil structure index',
                'soil structure indirect index'
            ],
            trees: ['land cover', 'plant cover', 'vegetation'],
            grasses: ['land cover', 'plant cover', 'vegetation'],
            crop: ['land cover', 'plant cover'],
            roots: ['land cover', 'plant cover', 'plant part'],
            'ground cover': ['land cover'],
            slope: ['physiography'],
            'land use class': ['soil description'],
            'soil classification': [],
            'soil fragmentation': ['soil phenomena', 'soil failure'],
            'soil hydrophobicity': ['soil phenomena'],
            'soil water repellency': ['soil phenomena'],
            'soil nitrogen loss': []
        }
    }
};

const KeywordHierarchy = () => {
    const getBroaderKeywords = async (narrowerKeyword, keywordHierarchy) => {
        keywordHierarchy = [narrowerKeyword, ...keywordHierarchy];

        let response = await fetchExternalData(
            `vocab/api/v1/concepts/${narrowerKeyword.replaceAll(' ', '')}`
        ).catch(error => {
            console.error(error);
            return null;
        });

        if (response?.broader?.length > 0) {
            return await getBroaderKeywords(
                response.broader[0].label,
                keywordHierarchy
            );
        } else {
            return keywordHierarchy;
        }
    };

    const keywordHierachyListToDictionary = (items, dictionary) => {
        let currentDictionary = dictionary;

        items.forEach(item => {
            if (!(item in currentDictionary)) {
                currentDictionary[item] = {};
            }

            currentDictionary = currentDictionary[item];
        });

        return dictionary;
    };

    const getKeywordHierarchy = async keywords => {
        let keywordHierarchyList = [];

        for (let keyword of keywords) {
            let data = await getBroaderKeywords(keyword, []);
            keywordHierarchyList.push(data);
        }

        let currentHierarchy = {};

        for (let keywordList of keywordHierarchyList) {
            currentHierarchy = keywordHierachyListToDictionary(
                keywordList,
                currentHierarchy
            );
        }

        return currentHierarchy;
    };

    const hasSiblings = option => {
        return Object.keys(option).length > 0;
    };

    const flattenHierarchy = (items, parents, result) => {
        Object.entries(items).forEach(([key, value]) => {
            if (hasSiblings(value)) {
                flattenHierarchy(value, [...parents, key], result);
            } else {
                if (key in result) {
                    result[key] = [...result[key], ...parents];
                } else {
                    result[key] = parents;
                }
            }
        });
    };

    const getFacetHierarchies = data => {
        return Promise.all(
            nestedTerms.map(async key => {
                let values = data[key].buckets.map(item => item.val);
                let optionsHierarchy = await getKeywordHierarchy(values);
                let flattenedHierarchy = {};

                flattenHierarchy(optionsHierarchy, [], flattenedHierarchy);

                return [
                    key,
                    {
                        nested: optionsHierarchy,
                        flattened: flattenedHierarchy
                    }
                ];
            })
        )
            .then(hierarchies => {
                return Object.fromEntries(hierarchies);
            })
            .catch(error => console.error(error));
    };
};
