'use client';

import styled from '@emotion/styled';
import Delete from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

import { store } from 'src/context/store';
import useGetData from 'src/services/getData';
import Tabs from 'components/UIContainers/Tabs';
import ThematicFilters from 'components/Catalogue/Search/Filters/ThematicFilters';
import TemporalFilters from 'components/Catalogue/Search/Filters/TemporalFilters';
import SpatialFilter from 'components/Catalogue/Search/Filters/SpatialFilter';
import { nestedTerms, thematicFilterKeys } from 'src/services/settings';
import { useEffect, useState } from 'react';
import SelectedOptions from './SelectedOptions';
import SelectList from 'components/UIElements/SelectList';

const MainContainer = styled.div`
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: var(--mui-spacing-1);

    > div {
        width: 100%;
    }
`;
const ClearButton = styled(IconButton)`
    padding-top: 0px;
    padding-bottom: 0px;
    padding-right: 0px;
`;

const Filters = () => {
    const { environment, filters, updateTermFilter, removeFilter } = store();
    const { getResourceTypes } = useGetData();
    const [resourceTypes, setResourceTypes] = useState(null);

    const getClearButton = key => {
        return (
            <ClearButton
                key={key}
                onClick={event => {
                    event.stopPropagation();
                    removeFilter(key);
                }}
                color="secondary"
                component="span"
            >
                <Delete
                    fontSize="small"
                    color="primary"
                />
            </ClearButton>
        );
    };

    useEffect(() => {
        getResourceTypes().then(data => {
            setResourceTypes(data);
        });
    }, [getResourceTypes]);

    const handleTypeChange = values => {
        updateTermFilter(
            resourceTypes.key,
            values.map(option => option.value)
        );
    };

    const getThematicFiltersTitle = () => {
        let title = ['Thematic filters'];
        let values = Object.entries(filters.terms)
            .filter(
                ([key, _]) =>
                    thematicFilterKeys.includes(key) ||
                    nestedTerms.includes(key)
            )
            .map(([_, value]) => value);

        if (values.length > 0) {
            title.push(
                ...[
                    ' (' +
                        values.reduce(
                            (cumulativeValue, currentValue) =>
                                cumulativeValue + currentValue.length,
                            0
                        ) +
                        ')',
                    getClearButton('terms')
                ]
            );
        }

        return title;
    };

    const getTemporalFiltersTitle = () => {
        let title = ['Temporal filters'];
        let entries = Object.entries(filters.ranges).filter(
            ([_, value]) => value.from || value.to
        );

        if (entries.length > 0) {
            title.push(
                ...[' (' + entries.length + ')', getClearButton('ranges')]
            );
        }

        return title;
    };

    const getSpatialFiltersTitle = () => {
        let title = ['Spatial filters'];

        if (filters.spatial?.area) {
            title.push(
                ...[
                    ': ' + filters.spatial.typeOfFilter,
                    getClearButton('spatial')
                ]
            );
        }

        return title;
    };

    return (
        <MainContainer>
            <SelectedOptions />
            <Tabs
                emptyTabs={[
                    resourceTypes && (
                        <SelectList
                            label={resourceTypes.label}
                            options={resourceTypes.options}
                            multiple={true}
                            values={resourceTypes.selected}
                            onChange={handleTypeChange}
                            fullWidth
                            helperText={resourceTypes.description}
                        />
                    )
                ]}
                titles={[
                    getThematicFiltersTitle(),
                    getTemporalFiltersTitle(),
                    getSpatialFiltersTitle()
                ]}
                content={[
                    <ThematicFilters />,
                    <TemporalFilters />,
                    <SpatialFilter />
                ]}
            />
        </MainContainer>
    );
};

export default Filters;
