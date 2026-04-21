'use client';

import styled from '@emotion/styled';

import Resources from 'components/Catalogue/Search/Resources';
import SearchBar from 'components/Catalogue/Search/SearchBar';
import Filters from 'components/Catalogue/Search/Filters';
import StartNew from 'components/Catalogue/Search/StartNew';
import { store } from 'src/context/store';

const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
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
            </SearchContainer>
            <Filters />
            <Resources />
        </>
    );
}
