'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import SelectList from 'components/UIElements/SelectList';
import { store } from 'src/context/store';
import useGetData from 'src/services/getData';
import { termLabels } from '../../../../services/settings';

const FilterOptions = styled.div`
    display: flex;
    gap: var(--mui-spacing-0);
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;

    .MuiFormControl-root {
        flex: 0 1 calc(25% - var(--mui-spacing-0));
    }
`;

const TermFilter = () => {
    const { updateTermFilter } = store();
    const [terms, setTerms] = useState({});
    const { getTerms } = useGetData();

    const getChangeHandler = key => values => {
        updateTermFilter(
            key,
            values.map(option => option.value)
        );
    };

    useEffect(() => {
        setTerms(getTerms());
    }, [getTerms]);

    return (
        <FilterOptions>
            {Object.keys(terms).length === 1 ? (
                <p>There are no terms left to filter on</p>
            ) : (
                Object.keys(termLabels).map(key =>
                    terms[key]?.label ? (
                        <SelectList
                            key={'search-' + key}
                            label={terms[key].label}
                            options={terms[key].options}
                            multiple={true}
                            values={terms[key].selected}
                            onChange={getChangeHandler(key)}
                            fontSize="18px"
                            fullWidth
                        />
                    ) : (
                        ''
                    )
                )
            )}
        </FilterOptions>
    );
};

export default TermFilter;
