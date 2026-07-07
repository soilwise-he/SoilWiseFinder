import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button, IconButton, Popper, TextField } from '@mui/material';
import { Clear } from '@mui/icons-material';

const MainContainer = styled.div``;

const TextContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .MuiFormControl-root {
        min-width: 90%;
    }
`;

const FilterOptions = styled(Popper)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: white;
    z-index: 100;

    .MuiButton-root {
        text-transform: none;
        font-weight: normal;
        color: var(--mui-palette-text-primary);
        justify-content: flex-start;
    }
`;

const OptionLabel = styled.span`
    height: fit-content;
    background-color: white;

    p {
        margin: 0px;

        &:last-of-type {
            font-style: italic;
            font-weight: normal;
            font-size: 0.8rem;
        }
    }
`;

const OptionSuggestions = ({ label, options, onSelect, onClear }) => {
    const [text, setText] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [anchorElement, setAnchorElement] = useState(null);

    const handleChange = async event => {
        let values = event.target.value.split(' ');

        if (values.length === 0) {
            setFilteredSuggestions([]);
        } else {
            setFilteredSuggestions(
                options
                    .filter(option =>
                        values.every(value => option.indexOf(value) >= 0)
                    )
                    .sort((a, b) => {
                        if (a.startsWith(values[0].toLowerCase())) {
                            if (b.startsWith(values[0].toLowerCase())) {
                                return a > b ? 1 : -1;
                            } else {
                                return -1;
                            }
                        } else if (b.startsWith(values[0].toLowerCase())) {
                            return 1;
                        } else {
                            return a > b ? 1 : -1;
                        }
                    })
                    .slice(0, 10)
            );
        }

        setText(event.target.value);
    };

    const handleKeyDown = event => {
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            let focusElement = event.target;

            if (event.target.tagName === 'INPUT') {
                focusElement =
                    document.getElementsByClassName('filter-option')[0];
            } else {
                focusElement = focusElement.nextSibling;
            }

            focusElement?.focus();
        } else if (event.code === 'ArrowUp') {
            event.preventDefault();
            let focusElement = event.target.previousSibling;

            if (!focusElement) {
                focusElement = document.getElementById(`${label}-suggestion`);
            }

            focusElement?.focus();
        } else if (event.code === 'Enter') {
            if (event.target.tagName !== 'INPUT') {
                setFilteredSuggestions([]);
                event.target.click();
            }
        }
    };

    const handleSelect = option => () => {
        onSelect(option);
        setText('');
        setFilteredSuggestions([]);
    };

    const handleClear = () => {
        setText('');
        setFilteredSuggestions([]);
        onClear();
    };

    useEffect(() => {
        let focusElement = document.getElementById(`${label}-suggestion`);
        setAnchorElement(focusElement);
        focusElement?.focus();
    }, []);

    return (
        <MainContainer>
            <TextContainer>
                <TextField
                    id={`${label}-suggestion`}
                    variant="standard"
                    placeholder={`Search for ${label}`}
                    fullWidth
                    slotProps={{
                        input: {
                            disableUnderline: true,
                            style: { fontSize: '1rem' }
                        }
                    }}
                    onClick={event => setAnchorElement(event.currentTarget)}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    value={text}
                />
                <IconButton onClick={handleClear}>
                    <Clear />
                </IconButton>
            </TextContainer>
            <FilterOptions
                open={filteredSuggestions.length > 0}
                anchorEl={anchorElement}
                placement="bottom-start"
            >
                {filteredSuggestions.map(option => (
                    <Button
                        key={option}
                        id={option}
                        onClick={handleSelect(option)}
                        className="filter-option"
                        onKeyDown={handleKeyDown}
                        disableRipple
                    >
                        <OptionLabel>
                            <p>{option}</p>
                        </OptionLabel>
                    </Button>
                ))}
            </FilterOptions>
        </MainContainer>
    );
};

export default OptionSuggestions;
