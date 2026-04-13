'use client';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import styled from '@emotion/styled';
import {
    Button,
    IconButton,
    Popper,
    TextField,
    useMediaQuery
} from '@mui/material';
import { default as MagnifierIcon } from '@mui/icons-material/Search';
import { Clear } from '@mui/icons-material';

import { store } from 'src/context/store';
import useGetData from 'src/services/getData';
import muiTheme from 'src/style/theme';

const SearchText = styled.div`
    width: calc(100% - 2px);
    border-radius: 100px;
    border: 1px solid var(--mui-palette-secondary-main);
    background-color: white;
    height: 54px;
    display: flex;
    align-items: stretch;

    & .MuiInputBase-formControl {
        margin: auto;
    }

    .MuiInput-input {
        font-size: 1.1rem !important;
    }

    ${muiTheme.breakpoints.down('sm')} {
        height: 45px;
    }
`;
const SearchIcon = styled(MagnifierIcon)`
    margin: auto 10px auto 22px;
    color: var(--mui-palette-text-disabled);

    ${muiTheme.breakpoints.down('sm')} {
        display: none;

        + div {
            margin-left: 20px;
        }
    }
`;
const FilterOptions = styled(Popper)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: white;
    z-index: 10;

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
const SearchButton = styled(Button)`
    ${muiTheme.breakpoints.down('sm')} {
        padding: 10px;
        min-width: fit-content !important;
    }
`;

const SearchBar = ({ handleSubmit }) => {
    const [searchText, setSearchText] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [anchorElement, setAnchorElement] = useState(null);
    const previousAnchorElementPosition = useRef(null);
    const { query, setQuery } = store();
    const { getSuggestions } = useGetData();

    useEffect(() => {
        setSearchText(query || '');
    }, [query]);

    useEffect(() => {
        if (anchorElement) {
            if (typeof anchorElement === 'object') {
                previousAnchorElementPosition.current =
                    anchorElement.getBoundingClientRect();
            } else {
                previousAnchorElementPosition.current =
                    anchorElement().getBoundingClientRect();
            }
        }
    }, [anchorElement]);

    const handleChange = async event => {
        let value = event.target.value;

        if (value === '' || value.slice(-1) === ' ') {
            setFilteredSuggestions([]);
        } else {
            let words = value.split(' ');
            let currentWord = words[words.length - 1];

            let suggestions = await getSuggestions(currentWord);

            setFilteredSuggestions(
                suggestions
                    .sort((a, b) => {
                        if (a.value.startsWith(currentWord.toLowerCase())) {
                            if (b.value.startsWith(currentWord.toLowerCase())) {
                                return a.value > b.value ? 1 : -1;
                            } else {
                                return -1;
                            }
                        } else if (
                            b.value.startsWith(currentWord.toLowerCase())
                        ) {
                            return 1;
                        } else {
                            return a.value > b.value ? 1 : -1;
                        }
                    })
                    .slice(0, 10)
            );
        }

        const getBoundingClientRect = () => {
            let rectangle = event.target.getBoundingClientRect();

            return {
                x: rectangle.x,
                y: rectangle.y,
                width: rectangle.width,
                height: rectangle.height,
                top: rectangle.top,
                left: rectangle.left + value.length * 7,
                right: rectangle.right,
                bottom: rectangle.bottom,
                toJSON: () => {}
            };
        };

        setAnchorElement({
            getBoundingClientRect
        });

        setSearchText(value);
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
                focusElement = document.getElementById('search-text');
            }

            focusElement?.focus();
        } else if (event.code === 'Enter') {
            setFilteredSuggestions([]);

            if (event.target.tagName === 'INPUT') {
                handleSubmit(searchText);
            } else {
                event.target.click();
            }
        }
    };

    const handleSelect = option => _ => {
        let words = searchText.split(' ');
        setSearchText(words.slice(0, -1).join(' ').concat(option.value));
        document.getElementById('search-text').focus();
    };

    return (
        <SearchText>
            <SearchIcon />
            <TextField
                variant="standard"
                placeholder="Search SoilWise Catalogue"
                fullWidth
                slotProps={{
                    input: {
                        disableUnderline: true,
                        style: { fontSize: '18px' }
                    }
                }}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={searchText}
                id="search-text"
            />
            <FilterOptions
                open={filteredSuggestions.length > 0}
                anchorEl={anchorElement}
                placement="bottom-start"
            >
                {filteredSuggestions.map(option => (
                    <Button
                        key={option.id}
                        onClick={handleSelect(option)}
                        id={option.id}
                        className="filter-option"
                        onKeyDown={handleKeyDown}
                        disableRipple
                    >
                        <OptionLabel>
                            <p>{option.value}</p>
                        </OptionLabel>
                    </Button>
                ))}
            </FilterOptions>
            {searchText && searchText !== '' && (
                <IconButton
                    color="secondary"
                    onClick={() => {
                        setSearchText('');
                        setQuery('');
                    }}
                >
                    <Clear />
                </IconButton>
            )}
            <SearchButton
                color="primary"
                variant="contained"
                onClick={() => handleSubmit(searchText)}
            >
                {useMediaQuery(() => muiTheme.breakpoints.down('sm')) ? (
                    <MagnifierIcon />
                ) : (
                    'search'
                )}
            </SearchButton>
        </SearchText>
    );
};

export default SearchBar;
