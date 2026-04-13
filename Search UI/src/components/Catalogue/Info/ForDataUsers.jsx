'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { Container } from '@mui/material';

import SearchBar from 'components/Catalogue/Search/SearchBar';
import SoilCompanion from 'components/Catalogue/Info/SoilCompanion';
import { paths } from 'src/services/settings';
import { store } from 'src/context/store';

const Module = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: var(--mui-spacing-1);
    margin-bottom: var(--mui-spacing-1);
    align-items: center;

    p {
        flex-basis: 60%;
    }

    div {
        margin-top: auto;
        margin-bottom: auto;
    }
`;

const ForDataUsers = () => {
    let router = useRouter();
    const { setQuery } = store();

    const handleSubmit = searchText => {
        setQuery(searchText);
        router.push(paths.catalogueSearch);
    };

    return (
        <Container>
            <Container variant="box">
                <h2>FOR DATA & KNOWLEDGE USERS</h2>
                <h1>SoilWise Catalogue</h1>
                <Module>
                    <p>
                        Are you looking for a specific resource? Or do you want
                        to explore what is in the SoilWise Catalogue?
                    </p>
                    <SearchBar handleSubmit={handleSubmit} />
                </Module>
                <Module>
                    <p>
                        Do you have a question related to soil, agriculture, or
                        soil health? For example, 'How do cover crops improve
                        soil structure?'
                    </p>
                    <SoilCompanion />
                </Module>
            </Container>
        </Container>
    );
};

export default ForDataUsers;
