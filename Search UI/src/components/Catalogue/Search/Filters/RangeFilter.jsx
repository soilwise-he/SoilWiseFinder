'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { store } from 'src/context/store';
import useGetData from 'src/services/getData';
import RangeSlider from 'components/UIElements/RangeSlider';
import { dateRanges, defaultRange } from 'src/services/settings';

const FilterOptions = styled.div`
    display: flex;
    gap: var(--mui-spacing-0);
    flex-wrap: wrap;
    justify-content: space-between;

    > div {
        flex: 1 1 calc(33.33% - var(--mui-spacing-0));
        min-width: 300px;
    }
`;

const RangeFilter = () => {
    const { updateRangeFilter } = store();
    const [ranges, setRanges] = useState({});
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
            {Object.keys(ranges).length === 0 ? (
                <p>There are no dates left to filter on</p>
            ) : (
                Object.entries(dateRanges).map(([key, value]) =>
                    key in ranges ? (
                        <RangeSlider
                            key={'search-' + key}
                            label={value.label}
                            minimum={defaultRange.minimum}
                            maximum={defaultRange.maximum}
                            value={[
                                ranges[key].selected.from ||
                                    ranges[key].minimum,
                                ranges[key].selected.to || ranges[key].maximum
                            ]}
                            onChange={getChangeHandler(key)}
                            fontSize="18px"
                            helperText={value.description}
                        />
                    ) : null
                )
            )}
        </FilterOptions>
    );
};

export default RangeFilter;
