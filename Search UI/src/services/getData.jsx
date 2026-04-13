import { useCallback } from 'react';

import {
    getBaseUrlApi,
    pyscwApiUrl,
    typeOfSpatialFilters,
    solrFacets,
    defaultRange,
    resourceTypeFilterKey,
    filterDefinitions,
    nestedTerms
} from './settings';
import { store } from 'src/context/store';

class FetchError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FetchError';
    }
}

export function fetchData(endpoint, body) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let url = `${getBaseUrlApi()}/${endpoint}`;

        fetch(url, {
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

export function fetchPyscwData(endpoint) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let url = `${pyscwApiUrl}/${endpoint}`;

        fetch(url, {
            method: 'GET',
            headers,
            credentials: 'omit',
            redirect: 'follow'
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

const useGetData = () => {
    const { facets, pagination, filters } = store();

    const getStatistics = useCallback(() => {
        if (!facets) return;

        let types = Object.entries(
            Object.values(facets)
                .flat()
                .filter(([key, _]) => key === 'type_terms')
                .map(([_, value]) => value)[0]
        )
            .filter(item => item[0] !== 'Other')
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        let projects = Object.entries(
            Object.values(facets)
                .flat()
                .filter(([key, _]) => key === 'project_acronyms_terms')
                .map(([_, value]) => value)[0]
        )
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        let dates = Object.values(facets)
            .flat()
            .filter(([key, _]) => key === 'date_range')
            .map(([_, value]) => value)[0];
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
        console.log(types);

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
            const solrResponse = await fetchData(`solr/search`, {
                query: '*:*',
                filter:
                    'date_harvest:[' +
                    harvestDate +
                    'T00:00:00Z TO ' +
                    harvestDate +
                    'T23:59:59Z]'
            });

            return {
                date: harvestDate,
                count: solrResponse.responseHeader.numFound
            };
        });

        return data;
    };

    const getRecentEntries = async () => {
        const solrResponse = await fetchData(`solr/search`, {
            query: '*:*',
            sort: 'date_harvest desc, date desc',
            params: {
                rows: 3
            }
        });

        return solrResponse.response.docs;
    };

    const getNews = async () => {
        const data = await fetchPyscwData(`/feeds/items?offset=0&limit=3`);

        return data;
    };

    const getValidation = async value => {
        const data = await fetchPyscwData(`/feeds/status/${value}`);

        return data;
    };

    const getResources = useCallback(
        (query, filters, sort, all = false) => {
            let solrParameters = {
                mm: '2<75%',
                df: 'title',
                ps: 2.0,
                tie: 0.1,
                qf: `title^2 abstract^2 subjects^1 matched_subjects^2 view_authors^2`,
                pf: `title^8 abstract^4 subjects^1 matched_subjects^2 view_authors^8`,
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

            return fetchData(`solr/search`, {
                query: query || '*',
                filter: solrFilters,
                sort: sort,
                facet: solrFacets,
                params: solrParameters
            });
        },
        [pagination.pageIndex, pagination.numberOfItemsPerPage]
    );

    const getTerms = useCallback(
        async keys => {
            if (!facets) return;

            return await Object.values(facets).reduce(
                (result, values) => [
                    ...result,
                    ...values
                        .filter(
                            ([key, _]) =>
                                key.includes('terms') &&
                                (!keys || keys.includes(key))
                        )
                        .map(async ([key, value]) => {
                            let options;

                            if (nestedTerms.includes(key)) {
                                options = await getKeywordHierarchy(
                                    Object.keys(value)
                                );
                            } else {
                                options = Object.entries(value)
                                    .filter(
                                        ([option, count]) =>
                                            (key !== 'type_terms' &&
                                                key !== 'language_terms') ||
                                            (key === 'type_terms' &&
                                                count >= 25) ||
                                            (key === 'language_terms' &&
                                                option.length <= 3)
                                    )
                                    .map(([option, _], index) => ({
                                        id: index,
                                        value: option
                                    }));
                            }

                            return {
                                key,
                                label: filterDefinitions[key].label,
                                description: filterDefinitions[key].description,
                                selected:
                                    key in filters.terms
                                        ? options.filter(option =>
                                              filters.terms[key].includes(
                                                  option.value
                                              )
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
                            };
                        })
                ],
                []
            );
        },
        [facets, filters.terms]
    );

    const getResourceTypes = useCallback(async () => {
        let resourceTypes = await getTerms([resourceTypeFilterKey]);

        return resourceTypes?.[0];
    }, [getTerms]);

    const getSuggestions = async query => {
        let suggestions = await fetchPyscwData(
            `vocab/api/v1/concepts/search?q=${query}&limit=100&offset=0&type=property`
        ).then(response => response.results);

        return suggestions.map(item => ({
            id: item.label.toLowerCase(),
            value: item.label.toLowerCase()
        }));
    };

    const getChoices = useCallback(
        keys => {
            if (!facets) return;

            return Object.values(facets).reduce(
                (result, values) => [
                    ...result,
                    ...values
                        .filter(
                            ([key, _]) =>
                                key.includes('query') &&
                                (!keys || keys.includes(key))
                        )
                        .map(([key, _]) => ({
                            key,
                            label: filterDefinitions[key].label,
                            description: filterDefinitions[key].description,
                            selected: filters.choices.includes(key)
                        }))
                ],
                []
            );
        },
        [facets, filters.choices]
    );

    const getRanges = useCallback(
        keys => {
            if (!facets) return;

            return Object.values(facets).reduce(
                (result, values) => [
                    ...result,
                    ...values
                        .filter(
                            ([key, _]) =>
                                key.includes('range') &&
                                (!keys || keys.includes(key))
                        )
                        .map(([key, value]) => ({
                            key,
                            label: filterDefinitions[key].label,
                            description: filterDefinitions[key].description,
                            selected:
                                key in filters.ranges
                                    ? filters.ranges[key]
                                    : { from: null, to: null },
                            minimum: parseInt(value[0]),
                            maximum: parseInt(value[1]) + defaultRange.gap
                        }))
                ],
                []
            );
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

    const getBroaderKeywords = async (narrowerKeyword, keywordHierarchy) => {
        keywordHierarchy = [narrowerKeyword, ...keywordHierarchy];

        let response = await fetchPyscwData(
            `vocab/api/v1/concepts/${narrowerKeyword.replaceAll(' ', '')}`
        );

        if (response.broader?.length > 0) {
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

    return {
        getStatistics,
        getLatestInsert,
        getRecentEntries,
        getNews,
        getValidation,
        getResources,
        getTerms,
        getResourceTypes,
        getSuggestions,
        getChoices,
        getRanges,
        getCountries,
        getRegions,
        getKeywordHierarchy
    };
};

export default useGetData;
