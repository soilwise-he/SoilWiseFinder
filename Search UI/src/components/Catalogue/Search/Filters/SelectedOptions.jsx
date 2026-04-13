import styled from '@emotion/styled';
import { Chip } from '@mui/material';

import { store } from 'src/context/store';
import { filterDefinitions } from 'src/services/settings';

const OptionsContainer = styled.div`
    display: flex;
    align-items: stretch;
    gap: var(--mui-spacing-0);
    flex-wrap: wrap;
`;
const StyledChip = styled(Chip)`
    height: fit-content !important;
    min-height: var(--mui-spacing-2);
    background-color: white !important;

    p {
        margin: 0px;
        white-space: normal;

        &.value {
            margin-top: 0.2rem;
        }

        &.category {
            font-style: italic;
            font-weight: normal;
            font-size: 0.8rem;
            margin-bottom: 0.2rem;
        }
    }
`;

const SelectedOptions = () => {
    const {
        filters,
        updateChoiceFilter,
        removeTermFromFilter,
        removeRangeFilter
    } = store();

    return (
        <OptionsContainer>
            {filters.choices.map(key => (
                <StyledChip
                    variant="outlined"
                    label={
                        <p
                            key="key"
                            className="value"
                        >
                            {filterDefinitions[key].label}
                        </p>
                    }
                    key={key}
                    onDelete={() => updateChoiceFilter(key, false)}
                />
            ))}
            {Object.entries(filters.terms).map(([key, item]) =>
                item.map(value => (
                    <StyledChip
                        variant="outlined"
                        label={[
                            <p
                                key="term"
                                className="value"
                            >
                                {value}
                            </p>,
                            <p
                                key="key"
                                className="category"
                            >
                                {filterDefinitions[key].label}
                            </p>
                        ]}
                        key={key + '-' + value}
                        onDelete={() => removeTermFromFilter(key, value)}
                    />
                ))
            )}
            {Object.entries(filters.ranges).map(([key, range]) => (
                <StyledChip
                    variant="outlined"
                    label={[
                        <p
                            key="range"
                            className="value"
                        >
                            {range.from} - {range.to}
                        </p>,
                        <p
                            key="key"
                            className="category"
                        >
                            {filterDefinitions[key].label}
                        </p>
                    ]}
                    key={'range-' + key}
                    onDelete={() => removeRangeFilter(key)}
                />
            ))}
        </OptionsContainer>
    );
};

export default SelectedOptions;
