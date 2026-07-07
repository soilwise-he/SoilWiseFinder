import { useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import OptionSuggestions from 'components/UIElements/OptionSuggestions';
import DraggablePanel from 'components/UIContainers/DraggablePanel';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledButton = styled(Button)`
    padding: calc(var(--mui-spacing-0) + 1.8px) var(--mui-spacing-1);
`;

const TitleBar = styled.p`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--mui-spacing-0);
    align-content: center;
    margin: 0px;
    border: 1px solid #fff;
    border-radius: var(--mui-shape-borderRadius-0);

    &.selected {
        border: 1px solid var(--mui-palette-primary-main);
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: calc(var(--mui-spacing-0) * ${props => props.level});
`;

const TermContainer = styled(FormControlLabel)`
    margin-left: 0px;

    .MuiCheckbox-root {
        padding: 2px;
        margin-right: var(--mui-spacing-0);
    }

    .MuiFormControlLabel-label {
        font-size: 14px;
        font-weight: 500;
    }
`;

const Panel = ({ title, level, startOpen = false, children }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(startOpen);
    }, [startOpen]);

    return (
        <MainContainer>
            <TitleBar
                onClick={() => setOpen(previous => !previous)}
                className={startOpen ? 'selected' : ''}
            >
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                {title}
            </TitleBar>
            {open && (
                <ContentContainer level={level}>{children}</ContentContainer>
            )}
        </MainContainer>
    );
};

const NestedSelectList = ({
    label,
    values,
    options,
    optionsHierarchy,
    onChange,
    helperText
}) => {
    const [open, setOpen] = useState(false);
    const [nestedOptions, setNestedOptions] = useState(null);

    const handleChange = event => {
        onChange([
            ...values,
            ...options.filter(option => option.value === event.target.name)
        ]);
    };

    const handleSelect = newValue => {
        onChange([
            ...values,
            ...options.filter(option => option.value === newValue)
        ]);
    };

    const hasSiblings = option => {
        return Object.keys(option).length > 0;
    };

    const translateOptions = useCallback(
        (items, level, selectedCategories) => {
            return Object.entries(items).map(([key, value]) => {
                if (hasSiblings(value)) {
                    return (
                        <Panel
                            key={key}
                            title={key}
                            level={level}
                            startOpen={selectedCategories.has(key)}
                        >
                            {translateOptions(
                                value,
                                level + 1,
                                selectedCategories
                            )}
                        </Panel>
                    );
                } else {
                    return (
                        <TermContainer
                            key={key}
                            label={key}
                            control={
                                <Checkbox
                                    name={key}
                                    checked={
                                        values.filter(
                                            option => option.value === key
                                        ).length > 0
                                    }
                                    onChange={handleChange}
                                    size="small"
                                />
                            }
                        />
                    );
                }
            });
        },
        [values]
    );

    useEffect(() => {
        if (!optionsHierarchy) return;

        setNestedOptions(
            translateOptions(
                optionsHierarchy.nested,
                1,
                new Set(
                    values
                        .map(item => optionsHierarchy.flattened[item.value])
                        .flat()
                )
            )
        );
    }, [optionsHierarchy, values, translateOptions]);

    return (
        <MainContainer>
            <StyledButton
                variant="outlined"
                onClick={() => setOpen(previous => !previous)}
            >
                {label} {values.length > 0 ? `(${values.length} selected)` : ''}
            </StyledButton>
            {open && (
                <DraggablePanel
                    title={label}
                    defaultPosition={{ top: 200, right: 5 }}
                    handleClose={() => setOpen(false)}
                >
                    <OptionSuggestions
                        label={'keyword'}
                        options={Object.keys(optionsHierarchy.flattened)}
                        onSelect={handleSelect}
                        onClear={() => onChange([])}
                    />
                    {nestedOptions}
                </DraggablePanel>
            )}
        </MainContainer>
    );
};

export default NestedSelectList;
