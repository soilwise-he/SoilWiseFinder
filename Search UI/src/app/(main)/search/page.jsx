'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';

import Resources from 'components/Catalogue/Search/Results/Resources';
import SearchBar from 'components/Catalogue/Search/SearchBar';
import Filters from 'components/Catalogue/Search/Filters';
import StartNew from 'components/Catalogue/Search/StartNew';
import { store } from 'src/context/store';
import SearchExplanation from 'components/Catalogue/Search/SearchExplanation';
import SearchSettings from 'components/Catalogue/Search/SearchSettings';

const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: var(--mui-spacing-0);

    .MuiIconButton-root {
        height: 100%;
        margin: auto;
    }
`;

function ParameterizedSearchBar() {
    const searchParams = useSearchParams();
    const { setQuery } = store();

    const handleSubmit = searchText => {
        setQuery(searchText);
    };

    useEffect(() => {
        const searchText = searchParams.get('text');

        if (searchText) setQuery(searchText);
    }, []);

    return <SearchBar handleSubmit={handleSubmit} />;
}

export default function Search() {
    const { environment } = store();

    if (!environment) return;

    return (
        <Suspense>
            <SearchContainer>
                <ParameterizedSearchBar />
                <StartNew />
                <SearchSettings />
                <SearchExplanation />
            </SearchContainer>
            <Filters />
            <Resources />
        </Suspense>
    );
}
