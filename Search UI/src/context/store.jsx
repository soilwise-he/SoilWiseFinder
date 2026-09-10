'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import proj4 from 'proj4';

import {
    dynamicFilterKeys,
    filterDefinitions,
    mapParameters,
    resourceTypeFilterKey,
    solrFacets,
    sortOptions,
    termHierarchies
} from 'src/services/settings';
import { getEnvironment } from 'src/app/config';

let StoreContext = createContext();

export function StoreProvider({ children }) {
    const [environment, setEnvironment] = useState(null);
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

    const getFacetHierarchies = () => {
        setFacetHierarchies(termHierarchies);
    };

    useEffect(() => {
        getEnvironment().then(data => {
            setEnvironment(data);

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            fetch(data.NEXT_PUBLIC_BASE_URL + '/solr/search', {
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
        });
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

        if (geometry === null || typeof geometry === 'undefined') {
            removeFilter('spatial');
        } else if (typeof geometry === 'string') {
            setFilters(previous => ({
                ...previous,
                spatial: {
                    area: geometry,
                    typeOfFilter
                }
            }));
        } else {
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
        }
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
                [key]:
                    key === 'spatial'
                        ? null
                        : key === 'choices'
                          ? []
                          : key === 'terms'
                            ? previous[key] &&
                              previous[key][resourceTypeFilterKey]
                                ? {
                                      [resourceTypeFilterKey]:
                                          previous[key][resourceTypeFilterKey]
                                  }
                                : {}
                            : {}
            };
        });
    };

    const reset = () => {
        setFilters({
            terms: {},
            choices: [],
            ranges: {},
            spatial: null
        });
        setQuery('');
        setSelectedIndex(null);
    };

    const value = useMemo(() => {
        return {
            environment,
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
    }, [
        environment,
        selectedIndex,
        facets,
        pagination,
        query,
        filters,
        sort,
        area
    ]);

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
