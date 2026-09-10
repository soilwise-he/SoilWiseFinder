import { useCallback, useMemo } from 'react';

import {
    typeOfSpatialFilters,
    solrFacets,
    defaultRange,
    resourceTypeFilterKey,
    filterDefinitions,
    nestedTerms,
    getUrl
} from './settings';
import { store } from 'src/context/store';

class FetchError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FetchError';
    }
}

export function fetchData(endpoint, body) {
    return new Promise(async (resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        fetch(endpoint, {
            method: 'POST',
            headers,
            credentials: 'omit',
            redirect: 'follow',
            body: JSON.stringify(body)
        })
            .then(response => {
                return response.json();
            })
            .then(response => {
                if (response?.error) {
                    reject(new FetchError(response.error));
                } else if (response?.hasOwnProperty?.('_embedded')) {
                    resolve(response._embedded);
                } else {
                    resolve(response);
                }
            })
            .catch(reject);
    });
}

export function fetchExternalData(endpoint, body = null) {
    return new Promise(async (resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let parameters = {
            method: body ? 'POST' : 'GET',
            headers,
            credentials: 'omit',
            redirect: 'follow'
        };

        if (body) parameters.body = JSON.stringify(body);

        let response = await fetch(endpoint, parameters)
            .then(response => {
                return response.json();
            })
            .catch(reject);

        resolve(response);
    });
}

const useGetData = () => {
    const { environment, facets, facetHierarchies, pagination, filters } =
        store();

    const getStatistics = useCallback(() => {
        if (!facets || facets.length === 0) return;

        let types = Object.entries(
            facets
                .filter(item => item[0] === 'type_terms')
                .map(item => item[1])[0]
        )
            .filter(item => item[0] !== 'Other')
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        let projects = Object.entries(
            facets
                .filter(item => item[0] === 'project_acronyms_terms')
                .map(item => item[1])[0]
        )
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        let dates = facets
            .filter(item => item[0] === 'date_range')
            .map(item => item[1])[0];
        let startYear =
            Math.floor((new Date(dates[0]).getFullYear() - 1900) / 10) * 10 +
            1900;
        let countsPerDecade = Array.from(
            {
                length: Math.ceil((new Date().getFullYear() - startYear) / 10)
            },
            (_, i) => ({
                startYear: startYear + i * 10,
                endYear: startYear + (i + 1) * 10 - 1,
                count: 0
            })
        );

        for (let item of dates[2]) {
            let currentDecade =
                Math.ceil((new Date(item.val).getFullYear() - startYear) / 10) -
                1;

            if (currentDecade < 0) currentDecade = 0;

            if (currentDecade > 9) currentDecade = 9;

            countsPerDecade[currentDecade].count += item.count;
        }

        while (countsPerDecade[0].count < 100) {
            countsPerDecade = countsPerDecade.slice(1);
        }

        return {
            numberOfResources: pagination.numberOfItems,
            typeDistribution: types.map(item => ({
                id: item[0],
                label: item[0],
                value: item[1]
            })),
            temporalDistribution: {
                startYear: countsPerDecade?.[0].startYear,
                countsPerDecade: countsPerDecade?.map(item => ({
                    decade: item.startYear + ' - ' + item.endYear,
                    count: item.count,
                    isCoveredInFull: item.endYear <= new Date().getFullYear()
                }))
            },
            projects
        };
    }, [facets]);

    const getLatestInsert = async () => {
        let data = await fetchData(`solr/search`, {
            query: '*:*',
            sort: 'date_harvest desc',
            params: {
                rows: 1
            }
        }).then(async lastEntry => {
            let harvestDate = lastEntry.response.docs[0].date_harvest.substring(
                0,
                lastEntry.response.docs[0].date_harvest.indexOf('T')
            );
            const solrResponse = await fetchData(
                getUrl(environment, `solr/search`),
                {
                    query: '*:*',
                    filter:
                        'date_harvest:[' +
                        harvestDate +
                        'T00:00:00Z TO ' +
                        harvestDate +
                        'T23:59:59Z]'
                }
            );

            return {
                date: harvestDate,
                count: solrResponse.responseHeader.numFound
            };
        });

        return data;
    };

    const getRecentEntries = async () => {
        const solrResponse = await fetchData(
            getUrl(environment, `solr/search`),
            {
                query: '*:*',
                sort: 'date_harvest desc, date desc',
                params: {
                    rows: 3
                }
            }
        );

        return solrResponse.response.docs;
    };

    const getNews = async () => {
        const data = await fetchExternalData(
            getUrl(environment, `util/feeds/items?offset=0&limit=3`)
        );

        return data;
    };

    const getValidation = async value => {
        const data = await fetchExternalData(
            getUrl(environment, `util/pid/status/${value}`)
        );

        return data;
    };

    const getAugmentations = async identifier => {
        const data = await fetchExternalData(
            getUrl(environment, `util/augments/${identifier}`)
        ).then(response => {
            return Object.fromEntries(
                response.map(item => [item.property, item])
            );
        });

        return data;
    };

    async function fetchResources(
        query,
        sort,
        solrParameters,
        solrFilters,
        solrFacets
    ) {
        try {
            const result = await fetchData(getUrl(environment, `solr/search`), {
                query: query,
                filter: solrFilters,
                sort: sort,
                facet: solrFacets,
                params: solrParameters
            });

            const augmentedResults = await Promise.all(
                result.response.docs.map(async document => {
                    const augments = await getAugmentations(
                        document.identifier
                    );
                    let highlightedFields =
                        result.highlighting[document.identifier];

                    return {
                        ...document,
                        title: highlightedFields.title?.[0] || document.title,
                        abstract:
                            highlightedFields.abstract?.[0] ||
                            document.abstract,
                        view_authors:
                            highlightedFields.authors_suggest ||
                            document.authors_suggest,
                        augments: augments
                    };
                })
            );

            return {
                ...result,
                response: { ...result.response, docs: augmentedResults }
            };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    const getResources = useCallback(
        async (query, filters, sort, all = false) => {
            let solrParameters = {
                df: 'text_all',
                ps: 2.0,
                tie: 0.2,
                qf: `title^2 abstract^2 subjects^1 matched_subjects^2 authors_suggest^2 tika_title^2 tika_text^2 tika_authors^2`,
                pf: `title^8 abstract^4 subjects^1 matched_subjects^2 authors_suggest^8 tika_title^2 tika_text^8 tika_authors^2`,
                defType: 'edismax',
                rows: all
                    ? pagination.numberOfItems
                    : pagination.numberOfItemsPerPage,
                start: all
                    ? 0
                    : pagination.pageIndex * pagination.numberOfItemsPerPage,
                hl: true,
                'hl.fragsize': 500,
                'hl.tag.pre': '<strong>',
                'hl.tag.post': '</strong>'
            };
            let solrFilters = [];

            solrFilters = [
                ...solrFilters,
                ...filters.choices.map(
                    key => key.replace('_query', '') + ':(true)'
                ),
                ...Object.entries(filters.terms).map(([key, value]) =>
                    value
                        .map(
                            item =>
                                key.replace('_terms', '') +
                                ':' +
                                item.replaceAll(' ', '*')
                        )
                        .join(' OR ')
                )
            ];

            for (let [key, value] of Object.entries(filters.ranges)) {
                solrFilters.push(
                    (solrFacets[key].subtype === 'period'
                        ? '{!field f=' + solrFacets[key].field + ' op=Within}'
                        : solrFacets[key].field + ':') +
                        '[' +
                        (value.from ? value.from : defaultRange.minimum) +
                        '-01-01T00:00:00Z' +
                        ' TO ' +
                        (value.to ? value.to : defaultRange.maximum) +
                        '-12-31T23:59:59Z' +
                        ']'
                );
            }

            if (filters.spatial?.area) {
                solrParameters['fq'] =
                    `spatial:"${filters.spatial.typeOfFilter === typeOfSpatialFilters.overlap ? 'Intersects' : 'Within'}(${filters.spatial.area})"`;
            }

            const data = await fetchResources(
                query || '*',
                sort,
                solrParameters,
                solrFilters,
                solrFacets
            );

            return data;
        },
        [pagination.pageIndex, pagination.numberOfItemsPerPage]
    );

    const getResource = async document => {
        let similarResources = await fetchData(
            getUrl(environment, 'solr/search'),
            {
                query: `q={!mlt fl=title,abstract,matched_subjects qf=title^2.0,abstract^4.0,subjects^2.0 mintf=1 maxdfpct=50 minwl=3 maxwl=15 boost=true interestingTerms=list}${document.identifier}`,
                params: { spellcheck: false, rows: 3 }
            }
        );

        let result = {
            ...document,
            similarResources: similarResources.response.docs
        };

        if (document.links) {
            result.links = await Promise.all(
                document.links.map(async item => {
                    let link = JSON.parse(item);

                    try {
                        let checkedLink = await fetchExternalData(
                            getUrl(environment, 'linky/check-url'),
                            {
                                url: decodeURIComponent(link.url),
                                check_ogc_capabilities: false
                            }
                        ).catch(error => {
                            console.log(error);
                        });

                        if (!checkedLink)
                            checkedLink = {
                                status_code: 500,
                                url: link.url
                            };

                        return {
                            ...checkedLink,
                            name: link.name
                        };
                    } catch (error) {
                        console.log(error);
                        return {
                            ...link,
                            status_code: 500
                        };
                    }
                })
            );
        }

        return result;
    };

    const getTerms = useCallback(
        keys => {
            if (!facets) return;

            return facets.reduce((result, currentValue) => {
                let key = currentValue[0];
                let value = currentValue[1];

                if (key.includes('terms') && (!keys || keys.includes(key))) {
                    let options = Object.entries(value)
                        .filter(
                            ([option, _]) =>
                                option !== '' &&
                                ((key !== 'type_terms' &&
                                    key !== 'language_terms') ||
                                    (key === 'type_terms' &&
                                        option.charAt(0) !==
                                            option.charAt(0).toLowerCase()) ||
                                    (key === 'language_terms' &&
                                        option.length <= 3))
                        )
                        .map(([option, _], index) => ({
                            id: index,
                            value: option
                        }));

                    result.push({
                        key,
                        label: filterDefinitions[key].label,
                        description: filterDefinitions[key].description,
                        selected:
                            key in filters.terms
                                ? options.filter(option =>
                                      filters.terms[key].includes(option.value)
                                  )
                                : [],
                        options: options.sort((a, b) => {
                            if (a.value > b.value) {
                                return 1;
                            } else if (a.value < b.value) {
                                return -1;
                            } else {
                                return 0;
                            }
                        })
                    });
                }

                return result;
            }, []);
        },
        [facets, filters.terms]
    );

    const getNestedTerms = useCallback(() => {
        if (!facets || !facetHierarchies) return;

        return nestedTerms.map(key => {
            let options = Object.keys(
                facets.filter(item => item[0] === key)[0][1]
            ).map((value, index) => ({
                id: index,
                value: value
            }));

            let newItem = {
                key,
                label: filterDefinitions[key].label,
                description: filterDefinitions[key].description,
                selected:
                    key in filters.terms
                        ? options.filter(option =>
                              filters.terms[key].includes(option.value)
                          )
                        : [],
                options: options,
                optionsHierarchy: facetHierarchies[key]
            };

            return newItem;
        });
    }, [facets, facetHierarchies, filters.terms]);

    const getResourceTypes = useCallback(async () => {
        let resourceTypes = await getTerms([resourceTypeFilterKey]);

        return resourceTypes?.[0];
    }, [getTerms]);

    const getSuggestions = async query => {
        const suggestions = await fetchData(getUrl(environment, 'solr/query'), {
            method: 'terms',
            'terms.fl': 'subjects',
            'terms.limit': 10,
            'terms.sort': 'count',
            'terms.regex': `.*${query}.*`,
            omitHeader: true
        }).then(async data => {
            let result = [
                data.terms.subjects
                    .filter(item => isNaN(item))
                    .map(item => ({
                        id: item.toLowerCase(),
                        value: item.toLowerCase(),
                        type: 'subject'
                    }))
            ];

            if (query.length > 2) {
                let titlesAndAuthors = await fetchData(
                    getUrl(environment, 'solr/query'),
                    {
                        method: 'suggest',
                        'suggest.q': query,
                        'suggest.count': 3,
                        omitHeader: true
                    }
                );

                result.push(
                    titlesAndAuthors.suggest.authorsSuggester[query].suggestions
                        .map((item, index) => {
                            let authors = [];
                            let author = JSON.parse(item.term);

                            if (
                                author.person
                                    ?.toLowerCase()
                                    .includes(query.toLowerCase())
                            ) {
                                authors.push({
                                    id: 'author-' + index,
                                    value: author.person,
                                    type: 'author'
                                });
                            }

                            if (
                                author.organization
                                    ?.toLowerCase()
                                    .includes(query.toLowerCase())
                            ) {
                                authors.push({
                                    id: 'author-' + index,
                                    value: author.organization,
                                    type: 'author'
                                });
                            }

                            return authors;
                        })
                        .flat()
                );
                result.push(
                    titlesAndAuthors.suggest.titleSuggester[
                        query
                    ].suggestions.map((item, index) => ({
                        id: 'title-' + index,
                        value: item.term,
                        type: 'title'
                    }))
                );
            }

            return result.flat();
        });

        return suggestions;
    };

    const getKeywordDescription = async keyword => {
        const response = await fetchExternalData(
            getUrl(
                environment,
                `vocab/api/v1/concepts/${keyword.replaceAll(' ', '')}`
            )
        );

        if (response.definitions?.length > 0) {
            return response.definitions[0].text;
        }
    };

    const getChoices = useCallback(
        keys => {
            if (!facets) return;

            return facets.reduce((result, currentValue) => {
                let key = currentValue[0];

                if (key.includes('query') && (!keys || keys.includes(key))) {
                    result.push({
                        key,
                        label: filterDefinitions[key].label,
                        description: filterDefinitions[key].description,
                        selected: filters.choices.includes(key)
                    });
                }

                return result;
            }, []);
        },
        [facets, filters.choices]
    );

    const getRanges = useCallback(
        keys => {
            if (!facets) return;

            return facets.reduce((result, currentValue) => {
                let key = currentValue[0];
                let value = currentValue[1];

                if (key.includes('range') && (!keys || keys.includes(key))) {
                    result.push({
                        key,
                        label: filterDefinitions[key].label,
                        description: filterDefinitions[key].description,
                        selected:
                            key in filters.ranges
                                ? filters.ranges[key]
                                : { from: null, to: null },
                        minimum: parseInt(value[0]),
                        maximum: parseInt(value[1]) + defaultRange.gap
                    });
                }

                return result;
            }, []);
        },
        [facets, filters.ranges]
    );

    const getCountries = useCallback(async () => {
        const countries = await import('src/assets/countries.json');

        let myFeatures = countries.features
            .map(item => ({
                value: item.properties.Name,
                id: item.properties.ISO_A3,
                geometry: item.geometry
            }))
            .filter(
                (country, index, self) =>
                    index === self.findIndex(item => item.id === country.id)
            )
            .sort((a, b) => (a.value > b.value ? 1 : -1));

        return myFeatures;
    }, []);

    const getRegions = useCallback(async countryCode => {
        try {
            const regions = await import(
                `src/assets/regions/${countryCode}.json`
            );

            return regions.features
                .map(item => ({
                    value: item.properties.NUTS_NAME,
                    id: item.properties.NUTS_ID,
                    geometry: item.geometry
                }))
                .sort((a, b) => (a.value > b.value ? 1 : -1));
        } catch {
            return null;
        }
    }, []);

    return {
        getStatistics,
        getLatestInsert,
        getRecentEntries,
        getNews,
        getValidation,
        getAugmentations,
        getResources,
        getResource,
        getTerms,
        getNestedTerms,
        getResourceTypes,
        getSuggestions,
        getKeywordDescription,
        getChoices,
        getRanges,
        getCountries,
        getRegions
    };
};

export default useGetData;
