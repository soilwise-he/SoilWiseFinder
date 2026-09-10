import { useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    RadioButtonChecked,
    RadioButtonUnchecked
} from '@mui/icons-material';

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
    gap: calc(0.5 * var(--mui-spacing-0));
    align-items: center;
    margin: 0px;
    border: 1px solid transparent;
    border-radius: var(--mui-shape-borderRadius-0);

    &.selected {
        border: 1px solid var(--mui-palette-primary-main);
    }

    > p {
        margin: calc(0.5 * var(--mui-spacing-0));
        margin-right: 0px;
        font-style: italic;
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: calc(0.5 * var(--mui-spacing-0) * ${props => props.level});
`;

const TermContainer = styled(FormControlLabel)`
    margin-left: 2px;
    margin-top: 2px;
    margin-bottom: 2px;
    margin-right: 0px;

    .MuiCheckbox-root {
        padding: 2px;
        margin-right: calc(0.5 * var(--mui-spacing-0));

        svg {
            width: 18px;
            height: 18px;
        }
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
            <TitleBar className={startOpen ? 'selected' : ''}>
                {title}
                {open ? (
                    <KeyboardArrowUp
                        onClick={event => {
                            event.stopPropagation();
                            setOpen(previous => !previous);
                        }}
                    />
                ) : (
                    <KeyboardArrowDown
                        onClick={event => {
                            event.stopPropagation();
                            setOpen(previous => !previous);
                        }}
                    />
                )}
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
        let value = options.filter(
            option => option.value === event.target.name
        )[0];

        onChange(
            values.includes(value)
                ? values.filter(item => item !== value)
                : [...values, value]
        );
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
                            title={
                                options.filter(item => item.value === key)
                                    .length === 0 ? (
                                    <p>{key}</p>
                                ) : (
                                    <TermContainer
                                        key={key}
                                        label={key}
                                        control={
                                            <Checkbox
                                                name={key}
                                                checked={
                                                    values.filter(
                                                        option =>
                                                            option.value === key
                                                    ).length > 0
                                                }
                                                onChange={handleChange}
                                                icon={<RadioButtonUnchecked />}
                                                checkedIcon={
                                                    <RadioButtonChecked />
                                                }
                                                size="small"
                                            />
                                        }
                                    />
                                )
                            }
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
                                    icon={<RadioButtonUnchecked />}
                                    checkedIcon={<RadioButtonChecked />}
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
                    info={helperText}
                    defaultPosition={{
                        top: 280,
                        left: Math.max(window.innerWidth - 560, 50),
                        offsetX: 0,
                        offsetY: 0
                    }}
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
