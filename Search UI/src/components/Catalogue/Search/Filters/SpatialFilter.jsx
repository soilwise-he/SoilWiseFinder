'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import MapWrapper from 'components/Map/MapWrapper';
import useGetData from 'src/services/getData';
import SelectChip from 'components/UIElements/SelectChip';
import RadioControl from 'components/UIElements/RadioControl';
import { store } from 'src/context/store';
import { getExtent } from 'src/services/util';
import { typeOfSpatialFilters } from 'src/services/settings';
import SearchMapContent from 'src/components/Map/MapContent/SearchMapContent';
import { IsWithinIcon, OverlapsIcon } from 'assets/icons';

const SpatialContainer = styled.div`
    display: flex;
    gap: 20px;

    width: 100%;
    height: 500px;
`;

const FilterOptions = styled.div`
    display: flex;
    gap: 20px 40px;
    justify-content: flex-start;
    flex-direction: column;
`;

const SelectLists = styled.div`
    display: flex;
    gap: 20px;
    flex-direction: column;
    flex: 1 1 100%;
`;

const RadioLabel = styled.div`
    display: flex;
    justify-content: space-between;
    gap: var(--mui-spacing-0);
    align-items: center;
`;

const SpatialFilter = () => {
    const { setSpatialFilter, area } = store();
    const [countries, setCountries] = useState(null);
    const [regions, setRegions] = useState(null);
    const [selected, setSelected] = useState({
        country: [],
        region: [],
        feature: null,
        typeOfFilter: typeOfSpatialFilters.overlap
    });
    const { getCountries, getRegions } = useGetData();

    useEffect(() => {
        getCountries().then(data => setCountries(data));
    }, []);

    useEffect(() => {
        if (selected.country.length === 0) {
            setRegions(null);
        } else {
            getRegions(selected.country[0].id).then(data => setRegions(data));
        }
    }, [selected.country]);

    useEffect(() => {
        if (selected.feature?.geoJsonFeature) {
            setSpatialFilter(
                getExtent(selected.feature.geoJsonFeature.geometry.coordinates),
                selected.typeOfFilter
            );
        } else if (selected.feature?.olFeature) {
            setSpatialFilter(
                selected.feature.olFeature.getGeometry(),
                selected.typeOfFilter
            );
        }
    }, [selected.feature, selected.typeOfFilter]);

    useEffect(() => {
        let feature = null;

        if (area.locations) {
            feature = { locationFeatures: area.locations };
        } else if (area.polygon) {
            feature = { olFeature: area.polygon };
        } else if (area.boundingBox) {
            feature = { olFeature: area.boundingBox };
        }

        setSelected(previous => ({
            ...previous,
            country: [],
            region: [],
            feature: feature
        }));
    }, [area]);

    const getChangeHandler = key => value => {
        if (key === 'country') {
            setSelected(previous => ({
                ...previous,
                country: value,
                region: value.length === 0 ? null : previous.region,
                feature: {
                    geoJsonFeature:
                        value.length === 0
                            ? null
                            : {
                                  type: 'Feature',
                                  properties: { label: value[0].value },
                                  geometry: value[0].geometry
                              }
                }
            }));
        } else if (key === 'region') {
            setSelected(previous => ({
                ...previous,
                country: previous.country,
                region: value,
                feature: {
                    geoJsonFeature: {
                        type: 'Feature',
                        properties: {
                            label:
                                value.length === 0
                                    ? previous.country[0].value
                                    : value[0]?.value
                        },
                        geometry:
                            value.length === 0
                                ? previous.country[0].geometry
                                : value[0]?.geometry
                    }
                }
            }));
        } else if (key === 'typeOfFilter') {
            setSelected(previous => ({
                ...previous,
                typeOfFilter: value
            }));
        }
    };

    return (
        countries && (
            <SpatialContainer>
                <FilterOptions>
                    <RadioControl
                        labels={[
                            <RadioLabel>
                                <div>{typeOfSpatialFilters.overlap}</div>
                                <OverlapsIcon />
                            </RadioLabel>,
                            <RadioLabel>
                                <div>{typeOfSpatialFilters.within}</div>
                                <IsWithinIcon />
                            </RadioLabel>
                        ]}
                        options={[
                            typeOfSpatialFilters.overlap,
                            typeOfSpatialFilters.within
                        ]}
                        value={selected.typeOfFilter}
                        handleChange={getChangeHandler('typeOfFilter')}
                    />
                    <SelectLists>
                        <SelectChip
                            key={'countries'}
                            label="Select country"
                            options={countries || []}
                            multiple={false}
                            values={selected.country}
                            onChange={getChangeHandler('country')}
                            fontSize="18px"
                            fullWidth
                        />
                        <SelectChip
                            key={'regions'}
                            label="Select region"
                            options={regions || []}
                            multiple={false}
                            values={selected.region}
                            onChange={getChangeHandler('region')}
                            fontSize="18px"
                            disabled={!regions?.length}
                            fullWidth
                        />
                    </SelectLists>
                </FilterOptions>

                <MapWrapper>
                    <SearchMapContent data={selected.feature} />
                </MapWrapper>
            </SpatialContainer>
        )
    );
};

export default SpatialFilter;
