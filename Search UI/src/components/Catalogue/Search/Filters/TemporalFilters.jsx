'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { store } from 'src/context/store';
import useGetData from 'src/services/getData';
import RangeSlider from 'components/UIElements/RangeSlider';

const FilterOptions = styled.div`
    display: flex;
    gap: var(--mui-spacing-0);
    flex-wrap: wrap;
    justify-content: space-between;
    padding: var(--mui-spacing-0);
    border: 1px solid var(--mui-palette-grey-200);

    > div {
        flex: 1 1 calc(33.33% - var(--mui-spacing-0));
        min-width: 300px;
    }
`;

const TemporalFilters = () => {
    const { updateRangeFilter } = store();
    const [ranges, setRanges] = useState([]);
    const { getRanges } = useGetData();

    const getChangeHandler = key => values => {
        updateRangeFilter(key, {
            from: values[0],
            to: values[1]
        });
    };

    useEffect(() => {
        setRanges(getRanges());
    }, [getRanges]);

    return (
        <FilterOptions>
            {ranges.length === 0 ? (
                <p>There are no dates left to filter on</p>
            ) : (
                ranges.map(range => {
                    return (
                        <RangeSlider
                            key={'search-' + range.key}
                            label={range.label}
                            minimum={range.minimum}
                            maximum={range.maximum}
                            value={[
                                range.selected.from || range.minimum,
                                range.selected.to || range.maximum
                            ]}
                            onChange={getChangeHandler(range.key)}
                            fontSize="18px"
                            helperText={range.description}
                        />
                    );
                })
            )}
        </FilterOptions>
    );
};

export default TemporalFilters;
