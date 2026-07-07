'use client';

import styled from '@emotion/styled';

import Introduction from 'components/Catalogue/Info/Introduction';
import ForDataProviders from 'components/Catalogue/Info/ForDataProviders';
import ForDataUsers from 'components/Catalogue/Info/ForDataUsers';
import Statistics from 'components/Catalogue/Info/Statistics';
import RecentEntries from 'components/Catalogue/Info/RecentEntries';
import News from 'components/Catalogue/Info/News';
import Contact from 'components/Catalogue/Info/Contact';

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
