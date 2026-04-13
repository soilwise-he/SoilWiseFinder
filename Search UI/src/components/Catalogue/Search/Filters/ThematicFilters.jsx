'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import SelectList from 'components/UIElements/SelectList';
import { store } from 'src/context/store';
import useGetData from 'src/services/getData';
import { nestedTerms, thematicFilterKeys } from '../../../../services/settings';
import SwitchControl from 'components/UIElements/SwitchControl';
import NestedSelectList from 'components/UIElements/NestedSelectList';

const FilterOptions = styled.div`
    display: flex;
    gap: var(--mui-spacing-1);
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    padding: var(--mui-spacing-0);
    border: 1px solid var(--mui-palette-grey-200);
`;
const OptionsContainer = styled.div`
    display: flex;
    gap: var(--mui-spacing-0);
    justify-content: flex-start;
    flex-wrap: wrap;

    .MuiFormControl-root {
        flex: 0 1 calc(20% - var(--mui-spacing-0));
    }
`;
const ChoicesContainer = styled(OptionsContainer)`
    flex-direction: column;
    flex: 0 1 calc(15% - var(--mui-spacing-0));
    margin-top: auto;
    margin-bottom: auto;
`;
const TermsContainer = styled(OptionsContainer)`
    flex-direction: row;
    flex: 0 1 calc(85% - var(--mui-spacing-0));
`;
const NestedTermsContainer = styled(OptionsContainer)`
    flex: 0 1 100%;
`;

const ThematicFilters = () => {
    const { updateChoiceFilter, updateTermFilter } = store();
    const [choices, setChoices] = useState([]);
    const [terms, setTerms] = useState([]);
    const { getTerms, getChoices } = useGetData();

    const getChoiceChangeHandler = key => event => {
        updateChoiceFilter(key, event.target.checked);
    };

    const getTermChangeHandler = key => values => {
        updateTermFilter(
            key,
            values.map(option => option.value)
        );
    };

    useEffect(() => {
        setChoices(getChoices());
        getTerms().then(async items => {
            let processedItems = [];

            for (let item of items) {
                let processedItem = await item;
                processedItems.push(processedItem);
            }

            setTerms(processedItems);
        });
    }, [getChoices, getTerms]);

    return (
        <FilterOptions>
            {terms.length === 1 && choices.length === 0 ? (
                <p>There are no thematic filters left to filter on</p>
            ) : (
                [
                    <ChoicesContainer key="choices">
                        {choices
                            .filter(item =>
                                thematicFilterKeys.includes(item.key)
                            )
                            .map(item => (
                                <SwitchControl
                                    key={'search-' + item.key}
                                    label={item.label}
                                    value={item.selected}
                                    handleChange={getChoiceChangeHandler(
                                        item.key
                                    )}
                                    helperText={item.description}
                                />
                            ))}
                    </ChoicesContainer>,
                    <TermsContainer key="terms">
                        {terms
                            .filter(
                                item =>
                                    thematicFilterKeys.includes(item.key) &&
                                    !nestedTerms.includes(item.key)
                            )
                            .map(item => (
                                <SelectList
                                    key={'search-' + item.key}
                                    label={item.label}
                                    options={item.options}
                                    multiple={true}
                                    values={item.selected}
                                    onChange={getTermChangeHandler(item.key)}
                                    fullWidth
                                    helperText={item.description}
                                />
                            ))}
                    </TermsContainer>,
                    <NestedTermsContainer key="nested_terms">
                        {terms
                            .filter(
                                item =>
                                    thematicFilterKeys.includes(item.key) &&
                                    nestedTerms.includes(item.key)
                            )
                            .map(item => (
                                <NestedSelectList
                                    key={'search-' + item.key}
                                    label={item.label}
                                    options={item.options}
                                    multiple={true}
                                    values={item.selected}
                                    onChange={getTermChangeHandler(item.key)}
                                    fullWidth
                                    helperText={item.description}
                                />
                            ))}
                    </NestedTermsContainer>
                ]
            )}
        </FilterOptions>
    );
};

export default ThematicFilters;
