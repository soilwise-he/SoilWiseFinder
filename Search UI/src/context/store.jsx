'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import proj4 from 'proj4';

import {
    getBaseUrlApi,
    mapParameters,
    sortOptions
} from 'src/services/settings';

let StoreContext = createContext();

export function StoreProvider({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [facets, setFacets] = useState(null);
    const [pagination, setPagination] = useState({
        numberOfItems: 0,
        numberOfItemsPerPage: 10,
        pageIndex: 0
    });
    const [query, setQuery] = useState();
    const [filters, setFilters] = useState({
        type: [],
        terms: {},
        ranges: {},
        spatial: null
    });
    const [sort, setSort] = useState(sortOptions[0].value);
    const [area, setArea] = useState({
        locations: null,
        polygon: null,
        boundingBox: null
    });

    useEffect(() => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        fetch(`${getBaseUrlApi()}/solr/searchapi`, {
            method: 'POST',
            headers,
            credentials: 'omit',
            redirect: 'follow',
            body: JSON.stringify({ limit: 1 })
        })
            .then(response => response.json())
            .then(response => {
                if (response?.error) {
                    console.error(response.error);
                } else {
                    setFacets(response.facets);
                }
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        setPagination(previous => ({ ...previous, pageIndex: 0 }));
    }, [query, filters, sort]);

    const updateTypeFilter = typeFilter => {
        setFilters(previous => ({ ...previous, type: typeFilter }));
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

    const setSpatialFilter = (boundingExtent, typeOfArea) => {
        let area = boundingExtent;

        if (area) {
            let transformedArea = [
                ...proj4(mapParameters.projection, 'EPSG:4326', [
                    area[0],
                    area[1]
                ]),
                ...proj4(mapParameters.projection, 'EPSG:4326', [
                    area[2],
                    area[3]
                ])
            ];
            area = [
                transformedArea[0],
                transformedArea[2],
                transformedArea[3],
                transformedArea[1]
            ];
        }

        setFilters(previous => ({
            ...previous,
            spatial: {
                area,
                typeOfArea
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
                [key]: key === 'spatial' ? null : {}
            };
        });
    };

    const reset = () => {
        updateTypeFilter([]);
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
            pagination,
            setPagination,
            query,
            setQuery,
            sort,
            setSort,
            filters,
            updateTypeFilter,
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
