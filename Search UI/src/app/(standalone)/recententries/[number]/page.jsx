'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import useGetData from 'src/services/getData';
import RecentEntry from 'components/Catalogue/Info/RecentEntries/RecentEntry';

const MainContainer = styled.div`
    max-width: 330px;
    height: 305px;

    > a {
        display: block;
        height: 100%;
    }
`;

export default function RecentEntries({ params }) {
    const { getRecentEntries } = useGetData();
    const [recentEntry, setRecentEntry] = useState(null);

    useEffect(() => {
        params.then(items => {
            getRecentEntries().then(data => {
                setRecentEntry(
                    <RecentEntry item={data[parseInt(items.number) - 1]} />
                );
            });
        });
    }, []);

    return <MainContainer>{recentEntry}</MainContainer>;
}
