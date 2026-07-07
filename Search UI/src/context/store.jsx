'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import proj4 from 'proj4';

import {
    dynamicFilterKeys,
    filterDefinitions,
    getBaseUrlApi,
    mapParameters,
    nestedTerms,
    solrFacets,
    sortOptions,
    termHierarchies
} from 'src/services/settings';
import { fetchExternalData } from 'src/services/getData';

let StoreContext = createContext();

export function StoreProvider({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [facets, setFacets] = useState(null);
    const [facetHierarchies, setFacetHierarchies] = useState(null);
    const [pagination, setPagination] = useState({
        numberOfItems: 0,
        numberOfItemsPerPage: 10,
        pageIndex: 0
    });
    const [query, setQuery] = useState();
    const [filters, setFilters] = useState({
        terms: {},
        choices: [],
        ranges: {},
        spatial: null
    });
    const [sort, setSort] = useState(sortOptions[0].value);
    const [area, setArea] = useState({
        locations: null,
        polygon: null,
        boundingBox: null
    });

    const getValuesFromBuckets = (key, buckets) => {
        if (solrFacets[key]?.attribute) {
            return Object.fromEntries(
                buckets.map(item => [
                    JSON.parse(item.val)[solrFacets[key].attribute],
                    item.count
                ])
            );
        } else if (solrFacets[key]?.subtype === 'list') {
            return buckets.reduce((dictionary, currentItem) => {
                if (currentItem.val in dictionary) {
                    dictionary[currentItem.val] += currentItem.count;
                } else {
                    dictionary[currentItem.val] = currentItem.count;
                }

                return dictionary;
            }, {});
        } else if (key.includes('terms')) {
            return Object.fromEntries(
                buckets.map(item => [item.val, item.count])
            );
        } else if (key.includes('range')) {
            let years = buckets
                .filter(item => item.count > 0)
                .map(item => item.val.substring(0, 4))
                .sort();
            return [years[0], years.at(-1), buckets];
        }
    };

    const updateFacets = data => {
        setFacets(previous => {
            if (previous === null) {
                return Object.entries(data).reduce((result, [key, value]) => {
                    if (key in filterDefinitions) {
                        result.push([
                            key,
                            getValuesFromBuckets(key, value.buckets)
                        ]);
                    }

                    return result;
                }, []);
            } else if (data.count === 0) {
                return previous;
            } else {
                return Object.entries(data).reduce((result, [key, value]) => {
                    if (
                        dynamicFilterKeys.includes(key) &&
                        (!(key in filters.terms) ||
                            filters.terms[key].length !== value.buckets?.length)
                    ) {
                        result.push([
                            key,
                            getValuesFromBuckets(key, value.buckets)
                        ]);
                    } else {
                        let previousFacet = previous.filter(
                            item => item[0] === key
                        );

                        if (previousFacet.length === 1) {
                            result.push(previousFacet[0]);
                        } else {
                            result.push([
                                key,
                                getValuesFromBuckets(key, value.buckets)
                            ]);
                        }
                    }

                    return result;
                }, []);
            }
        });
    };

    const getBroaderKeywords = async (narrowerKeyword, keywordHierarchy) => {
        keywordHierarchy = [narrowerKeyword, ...keywordHierarchy];

        let response = await fetchExternalData(
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
        if (termHierarchies) {
            setFacetHierarchies(termHierarchies);
        } else {
            Promise.all(
                nestedTerms.map(async key => {
                    let values = data[key].buckets.map(item => item.val);
                    let optionsHierarchy = await getKeywordHierarchy(values);
                    let flattenedHierarchy = {};

                    flattenHierarchy(optionsHierarchy, [], flattenedHierarchy);

                    return [
                        key,
                        {
                            nested: optionsHierarchy,
                            flattened: flattenHierarchy
                        }
                    ];
                })
            ).then(hierarchies => {
                setFacetHierarchies(Object.fromEntries(hierarchies));
            });
        }
    };

    useEffect(() => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        fetch(`${getBaseUrlApi()}/solr/search`, {
            method: 'POST',
            headers,
            credentials: 'omit',
            redirect: 'follow',
            body: JSON.stringify({ query: '*:*', facet: solrFacets })
        })
            .then(response => response.json())
            .then(response => {
                if (response?.error) {
                    console.error(response.error);
                } else {
                    updateFacets(response.facets);
                    getFacetHierarchies(response.facets);
                    setPagination(previous => ({
                        ...previous,
                        numberOfItems: response.facets.count
                    }));
                }
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        setPagination(previous => ({ ...previous, pageIndex: 0 }));
    }, [query, filters, sort]);

    const updateChoiceFilter = (choiceKey, choiceValue) => {
        setFilters(previous => ({
            ...previous,
            choices: choiceValue
                ? [...previous.choices, choiceKey]
                : previous.choices.filter(item => item !== choiceKey)
        }));
    };

    const updateTermFilter = (termKey, termFilter) => {
        setFilters(previous => {
            if (termFilter.length === 0) {
                return {
                    ...previous,
                    terms: Object.fromEntries(
                        Object.entries(previous.terms).filter(
                            ([key, _]) => key !== termKey
                        )
                    )
                };
            } else {
                return {
                    ...previous,
                    terms: {
                        ...previous.terms,
                        [termKey]: termFilter
                    }
                };
            }
        });
    };

    const removeTermFromFilter = (termKey, termValue) => {
        setFilters(previous => {
            let newFilter = previous.terms[termKey].filter(
                item => item != termValue
            );

            if (newFilter.length === 0) {
                return {
                    ...previous,
                    terms: Object.fromEntries(
                        Object.entries(previous.terms).filter(
                            ([key, _]) => key !== termKey
                        )
                    )
                };
            } else {
                return {
                    ...previous,
                    terms: {
                        ...previous.terms,
                        [termKey]: newFilter
                    }
                };
            }
        });
    };

    const updateRangeFilter = (rangeKey, rangeFilter) => {
        setFilters(previous => {
            if (rangeFilter.length === 0) {
                return {
                    ...previous,
                    ranges: Object.fromEntries(
                        Object.entries(previous.ranges).filter(
                            ([key, _]) => key !== rangeKey
                        )
                    )
                };
            } else {
                return {
                    ...previous,
                    ranges: {
                        ...previous.ranges,
                        [rangeKey]: rangeFilter
                    }
                };
            }
        });
    };

    const removeRangeFilter = rangeKey => {
        setFilters(previous => {
            return {
                ...previous,
                ranges: Object.fromEntries(
                    Object.entries(previous.ranges).filter(
                        ([key, _]) => key !== rangeKey
                    )
                )
            };
        });
    };

    const setSpatialFilter = (geometry, typeOfFilter) => {
        let transformedCoordinates = [];

        if (Array.isArray(geometry)) {
            let transformedGeometry = [
                ...proj4(
                    mapParameters.defaultProjection,
                    mapParameters.dataProjection,
                    [geometry[0], geometry[1]]
                ),
                ...proj4(
                    mapParameters.defaultProjection,
                    mapParameters.dataProjection,
                    [geometry[2], geometry[3]]
                )
            ];
            transformedCoordinates = [
                `${transformedGeometry[0]} ${transformedGeometry[1]}`,
                `${transformedGeometry[2]} ${transformedGeometry[1]}`,
                `${transformedGeometry[2]} ${transformedGeometry[3]}`,
                `${transformedGeometry[0]} ${transformedGeometry[3]}`,
                `${transformedGeometry[0]} ${transformedGeometry[1]}`
            ];
        } else {
            transformedCoordinates = geometry
                .getCoordinates()[0]
                .map(coordinates =>
                    proj4(
                        mapParameters.defaultProjection,
                        mapParameters.dataProjection,
                        coordinates
                    ).join(' ')
                );
        }

        setFilters(previous => ({
            ...previous,
            spatial: {
                area: `POLYGON((${transformedCoordinates.join(',')}))`,
                typeOfFilter
            }
        }));
    };

    const setLocations = geometries => {
        setArea({
            locations: geometries,
            polygon: null,
            boundingBox: null
        });
    };

    const setPolygon = geometry => {
        setArea({
            locations: null,
            polygon: geometry,
            boundingBox: null
        });
    };

    const setBoundingBox = geometry => {
        setArea({
            locations: null,
            polygon: null,
            boundingBox: geometry
        });
    };

    const resetArea = () => {
        setArea({
            locations: null,
            polygon: null,
            boundingBox: null
        });
    };

    const removeFilter = key => {
        setFilters(previous => {
            if (key === 'spatial')
                setArea({
                    locations: null,
                    polygon: null,
                    boundingBox: null
                });

            return {
                ...previous,
                [key]: key === 'spatial' ? null : key === 'choices' ? [] : {}
            };
        });
    };

    const reset = () => {
        removeFilter('keys');
        removeFilter('choices');
        removeFilter('terms');
        removeFilter('ranges');
        removeFilter('spatial');
        setQuery('');
        setSelectedIndex(null);
    };

    const value = useMemo(() => {
        return {
            selectedIndex,
            setSelectedIndex,
            facets,
            setFacets,
            updateFacets,
            facetHierarchies,
            pagination,
            setPagination,
            query,
            setQuery,
            sort,
            setSort,
            filters,
            updateChoiceFilter,
            updateTermFilter,
            removeTermFromFilter,
            updateRangeFilter,
            removeRangeFilter,
            setSpatialFilter,
            area,
            setLocations,
            setPolygon,
            setBoundingBox,
            resetArea,
            removeFilter,
            reset
        };
    }, [selectedIndex, facets, pagination, query, filters, sort, area]);

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
}

StoreProvider.propTypes = {
    children: PropTypes.object
};

export function store() {
    return useContext(StoreContext);
}
