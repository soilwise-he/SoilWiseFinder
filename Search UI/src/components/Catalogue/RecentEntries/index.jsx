'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Container } from '@mui/material';

import useGetData from 'src/services/getData';
import RecentEntry from './RecentEntry';

const MainContainer = styled(Container)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 30px;
`;

const RecentEntries = () => {
    const { getRecentEntries } = useGetData();
    const [recentEntries, setRecentEntries] = useState([]);

    useEffect(() => {
        getRecentEntries().then(data => {
            setRecentEntries(data);
        });
    }, []);

    return (
        <MainContainer>
            {recentEntries.map(item => (
                <RecentEntry
                    item={item}
                    key={item.identifier}
                />
            ))}
        </MainContainer>
    );
};

export default RecentEntries;
