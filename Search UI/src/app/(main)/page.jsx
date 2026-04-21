'use client';

import styled from '@emotion/styled';

import Introduction from 'components/Catalogue/Introduction';
import ForDataProviders from 'components/Catalogue/ForDataProviders';
import ForDataUsers from 'components/Catalogue/ForDataUsers';
import Statistics from 'components/Catalogue/Statistics';
import RecentEntries from 'components/Catalogue/RecentEntries';
import News from 'components/Catalogue/News';
import Contact from 'components/Catalogue/Contact';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
`;

export default function Home() {
    return (
        <MainContainer>
            <Introduction />
            <ForDataUsers />
            <Statistics />
            <ForDataProviders />
            <RecentEntries />
            <News />
            <Contact />
        </MainContainer>
    );
}
