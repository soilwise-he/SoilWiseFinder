'use client';

import styled from '@emotion/styled';
import { Chip } from '@mui/material';
import Clear from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';

import { store } from 'src/context/store';
import useGetData from 'src/services/getData';
import Tabs from 'components/Surfaces/Tabs';
import TermFilter from 'components/Catalogue/Search/Filters/TermFilter';
import RangeFilter from 'components/Catalogue/Search/Filters/RangeFilter';
import SpatialFilter from 'components/Catalogue/Search/Filters/SpatialFilter';
import { dateRanges, termLabels } from 'src/services/settings';
import { useEffect, useState } from 'react';
import SelectChip from 'components/UIElements/SelectChip';

const MainContainer = styled.div`
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: var(--mui-spacing-1);

    > div {
        width: 100%;
    }
`;
const OptionsContainer = styled.div`
    display: flex;
    align-items: stretch;
    gap: var(--mui-spacing-0);
`;
const StyledChip = styled(Chip)`
    height: fit-content !important;
    background-color: white !important;

    p {
        margin: 0px;

        &:first-of-type {
            margin-top: 0.2rem;
        }

        &:last-of-type {
            font-style: italic;
            font-weight: normal;
            font-size: 0.8rem;
            margin-bottom: 0.2rem;
        }
    }
`;
const ClearButton = styled(IconButton)`
    padding-top: 0px;
    padding-bottom: 0px;
    padding-right: 0px;
`;

const Filters = () => {
    const {
        filters,
        updateTypeFilter,
        removeTermFromFilter,
        removeRangeFilter,
        removeFilter,
        facets
    } = store();
    const { getTypes } = useGetData();
    const [types, setTypes] = useState(null);

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
                <Clear
                    fontSize="small"
                    color="primary"
                />
            </ClearButton>
        );
    };

    useEffect(() => {
        setTypes(getTypes());
    }, [getTypes]);

    const handleTypeChange = values => {
        updateTypeFilter(values.map(option => option.value));
    };

    const getTermsTitle = () => {
        let title = ['Thematic filters'];
        let values = Object.values(filters.terms);

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

    const getDatesTitle = () => {
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

    const getSpatialTitle = () => {
        let title = ['Spatial filters'];

        if (filters.spatial?.area) {
            title.push(
                ...[
                    ': ' + filters.spatial.typeOfArea,
                    getClearButton('spatial')
                ]
            );
        }

        return title;
    };

    return (
        <MainContainer>
            <OptionsContainer>
                {Object.entries(filters.terms).map(([key, terms]) => {
                    return terms.map(item => (
                        <StyledChip
                            variant="outlined"
                            label={[
                                <p key="term">{item}</p>,
                                <p key="key">{termLabels[key]}</p>
                            ]}
                            key={key + '-' + item}
                            onDelete={() => removeTermFromFilter(key, item)}
                        />
                    ));
                })}
                {Object.entries(filters.ranges).map(([key, range]) => {
                    return (
                        <StyledChip
                            variant="outlined"
                            label={[
                                <p key="range">
                                    {range.from} - {range.to}
                                </p>,
                                <p key="key">{dateRanges[key].label}</p>
                            ]}
                            key={'range-' + key}
                            onDelete={() => removeRangeFilter(key)}
                        />
                    );
                })}
            </OptionsContainer>
            <Tabs
                emptyTabs={[
                    types && (
                        <SelectChip
                            label={types.label}
                            options={types.options}
                            multiple={false}
                            values={types.selected}
                            onChange={handleTypeChange}
                            fontSize="18px"
                            fullWidth
                        />
                    )
                ]}
                titles={[getTermsTitle(), getDatesTitle(), getSpatialTitle()]}
                content={[<TermFilter />, <RangeFilter />, <SpatialFilter />]}
            />
        </MainContainer>
    );
};

export default Filters;
