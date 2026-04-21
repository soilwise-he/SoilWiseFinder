import { useCallback } from 'react';

import {
    termLabels,
    getBaseUrlApi,
    pyscwApiUrl,
    typeOfAreas,
    solrFacets,
    dateRanges,
    defaultRange
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

        let types = facets.type_terms.buckets
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
        let startYear =
            Math.floor(
                (new Date(facets.date_range.buckets[0].val).getFullYear() -
                    1900) /
                    10
            ) *
                10 +
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

        for (let item of facets.date_range.buckets) {
            let currentDecade =
                Math.ceil((new Date(item.val).getFullYear() - startYear) / 10) -
                1;

            if (currentDecade < 0) currentDecade = 0;

            countsPerDecade[currentDecade].count += item.count;
        }

        while (countsPerDecade[0].count < 100) {
            countsPerDecade = countsPerDecade.slice(1);
        }

        return {
            numberOfResources: facets.count,
            typeDistribution: [
                ...types.map(item => ({
                    id: item.val,
                    label: item.val,
                    value: item.count
                })),
                {
                    id: 'other',
                    label: 'other',
                    value:
                        facets.count -
                        types.reduce(
                            (sumValue, currentItem) =>
                                sumValue + currentItem.count,
                            0
                        )
                }
            ],
            temporalDistribution: {
                startYear: countsPerDecade[0].startYear,
                countsPerDecade: countsPerDecade.map(item => ({
                    decade: item.startYear + ' - ' + item.endYear,
                    count: item.count,
                    isCoveredInFull: item.endYear <= new Date().getFullYear()
                }))
            },
            projects: facets.project_acronym_terms.buckets
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
        };
    }, [facets]);

    const getLatestInsert = async () => {
        let data = await fetchData(`solr/search`, {
            query: '*:*',
            sort: 'insert_date desc',
            params: {
                rows: 1
            }
        }).then(async lastEntry => {
            let insertDate = lastEntry.response.docs[0].insert_date.substring(
                0,
                lastEntry.response.docs[0].insert_date.indexOf('T')
            );
            const solrResponse = await fetchData(`solr/search`, {
                query: '*:*',
                filter:
                    'insert_date:[' +
                    insertDate +
                    'T00:00:00Z TO ' +
                    insertDate +
                    'T23:59:59Z]'
            });

            return {
                date: insertDate,
                count: solrResponse.responseHeader.numFound
            };
        });

        return data;
    };

    const getRecentEntries = async () => {
        const solrResponse = await fetchData(`solr/search`, {
            query: '*:*',
            sort: 'date_creation desc, date_publication desc, insert_date desc',
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
        (query, filters, sort) => {
            let solrFilters = [];

            if (filters.type.length > 0) {
                solrFilters.push(
                    'type:(' +
                        filters.type.map(item => '"' + item + '"').join(' ') +
                        ')'
                );
            }

            solrFilters = [
                ...solrFilters,
                ...Object.entries(filters.terms).map(
                    ([key, value]) =>
                        key.replace('_terms', '') +
                        ':(' +
                        value.map(item => '"' + item + '"').join(' ') +
                        ')'
                )
            ];

            for (let [key, value] of Object.entries(filters.ranges)) {
                if (dateRanges[key].type === 'and') {
                    solrFilters.push(
                        ...dateRanges[key].attributes.map(
                            attributeKey =>
                                attributeKey.replace('_range', '') +
                                ':[' +
                                (key.from ? value.from : defaultRange.minimum) +
                                '-01-01T00:00:00Z' +
                                ' TO ' +
                                (value.to ? value.to : defaultRange.maximum) +
                                '-12-31T23:59:59Z' +
                                ']'
                        )
                    );
                } else {
                    solrFilters.push({
                        bool: {
                            should: dateRanges[key].attributes.map(
                                attributeKey =>
                                    attributeKey.replace('_range', '') +
                                    ':[' +
                                    (key.from
                                        ? value.from + '-01-01T00:00:00Z'
                                        : '*') +
                                    ' TO ' +
                                    (value.to
                                        ? value.to + '-12-31T23:59:59Z'
                                        : '*') +
                                    ']'
                            )
                        }
                    });
                }
            }

            if (filters.spatial?.area)
                solrFilters.push(
                    `{!field f=wkb_envelope score=overlapRatio}${filters.spatial.typeOfArea == typeOfAreas.overlap ? 'Intersects' : 'Within'}(ENVELOPE(${filters.spatial.area.join(',')}))`
                );

            return fetchData(`solr/search`, {
                query: query || '*:*',
                filter: solrFilters,
                sort: sort,
                facet: solrFacets,
                params: {
                    mm: '2<75%',
                    df: 'title',
                    ps: 2.0,
                    tie: 0.1,
                    qf: `title^2 abstract^2 keywords^4 pdf_content^1`,
                    pf: `title^8 abstract^4 keywords^8 pdf_content^1`,
                    defType: 'edismax',
                    rows: pagination.numberOfItemsPerPage,
                    start:
                        pagination.pageIndex * pagination.numberOfItemsPerPage,
                    hl: true,
                    'hl.fragsize': 500,
                    'hl.tag.pre': '<strong>',
                    'hl.tag.post': '</strong>'
                }
            });
        },
        [pagination.pageIndex, pagination.numberOfItemsPerPage]
    );

    const getTypes = useCallback(() => {
        if (!facets) return;

        let key = 'type_terms';
        let options = facets[key]?.buckets.map((item, index) => ({
            id: index,
            value: item.val
        }));

        return {
            label: termLabels[key],
            selected:
                filters.type && options
                    ? options.filter(option =>
                          filters.type.includes(option.value)
                      )
                    : [],
            options: options || []
        };
    }, [facets, filters.type]);

    const getTerms = useCallback(() => {
        if (!facets) return;

        return Object.fromEntries(
            Object.entries(facets)
                .filter(
                    ([key, value]) =>
                        key.endsWith('terms') && value.buckets.length > 0
                )
                .map(([key, value]) => {
                    let options = value.buckets.map((item, index) => ({
                        id: index,
                        value: item.val
                    }));

                    return [
                        key,
                        {
                            label: termLabels[key],
                            selected:
                                key in filters.terms
                                    ? options.filter(option =>
                                          filters.terms[key].includes(
                                              option.value
                                          )
                                      )
                                    : [],
                            options: options
                        }
                    ];
                })
        );
    }, [facets, filters.terms]);

    const getRanges = useCallback(() => {
        if (!facets) return;

        let relevantFacets = Object.entries(facets)
            .filter(
                ([key, value]) =>
                    key.endsWith('range') && value.buckets.length > 1
            )
            .map(([key, _]) => key);

        return Object.fromEntries(
            Object.entries(dateRanges)
                .filter(([_, value]) =>
                    value.attributes.reduce(
                        (accumulator, currentValue) =>
                            accumulator &&
                            relevantFacets.includes(currentValue),
                        true
                    )
                )
                .map(([key, value]) => {
                    return [
                        key,
                        {
                            label: value.label,
                            selected:
                                key in filters.ranges
                                    ? filters.ranges[key]
                                    : { from: null, to: null },
                            minimum: Math.min(
                                ...value.attributes.map(item =>
                                    new Date(
                                        facets[item].buckets[0].val
                                    ).getFullYear()
                                )
                            ),
                            maximum: Math.min(
                                ...value.attributes.map(item =>
                                    new Date(
                                        facets[item].buckets.at(-1).val
                                    ).getFullYear()
                                )
                            )
                        }
                    ];
                })
        );
    }, [facets, filters.ranges]);

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
        getResources,
        getTypes,
        getTerms,
        getRanges,
        getCountries,
        getRegions
    };
};

export default useGetData;
