'use client';

import styled from '@emotion/styled';

import Resources from 'components/Catalogue/Search/Results/Resources';
import SearchBar from 'components/Catalogue/Search/SearchBar';
import Filters from 'components/Catalogue/Search/Filters';
import StartNew from 'components/Catalogue/Search/StartNew';
import { store } from 'src/context/store';
import SearchExplanation from 'components/Catalogue/Search/SearchExplanation';

const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: var(--mui-spacing-0);

    .MuiIconButton-root {
        height: 100%;
        margin: auto;
    }
`;

export default function Search() {
    const { setQuery } = store();

    const handleSubmit = searchText => {
        setQuery(searchText);
    };

    return (
        <>
            <SearchContainer>
                <SearchBar handleSubmit={handleSubmit} />
                <StartNew />
                <SearchExplanation />
            </SearchContainer>
            <Filters />
            <Resources />
        </>
    );
}
