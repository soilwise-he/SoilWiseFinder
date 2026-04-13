'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Container } from '@mui/material';

import useGetData from 'src/services/getData';
import NumberOfResources from './NumberOfResources';
import ResourceTypes from './ResourceTypes';
import Decades from './Decades';
import Projects from './Projects';

const MainContainer = styled(Container)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 30px;
`;
export const ItemContainer = styled.div`
    border-radius: var(--mui-shape-borderRadius-0);
    border: 2px solid var(--mui-palette-secondary-main);
    background-color: white;
    padding: var(--mui-spacing-1) var(--mui-spacing-0);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-basis: 25%;

    h2 {
        text-align: center;
        margin: 0px;
        font-size: 1.1rem;
    }
`;
export const TextContainer = styled(ItemContainer)`
    align-content: center;

    h1,
    h2,
    p,
    i {
        text-align: center;
    }

    h1,
    h2 {
        margin: var(--mui-spacing-0);
    }

    i {
        font-size: 0.8rem;
        display: block;
        margin-top: var(--mui-spacing-1);
    }

    p {
        font-size: 1.3rem;
        font-weight: bold;
        color: var(--mui-palette-primary-main);
        margin: var(--mui-spacing-0) var(--mui-spacing-1);
    }

    span:first-of-type p {
        margin-top: var(--mui-spacing-1);
    }
`;

const Statistics = () => {
    const { getStatistics, getLatestInsert } = useGetData();
    const [statistics, setStatistics] = useState(null);
    const [latestInsert, setLatestInsert] = useState(null);

    useEffect(() => {
        getLatestInsert().then(data => setLatestInsert(data));
    }, []);

    useEffect(() => {
        setStatistics(getStatistics());
    }, [getStatistics]);

    if (!statistics || !latestInsert) return null;

    return (
        <>
            <MainContainer>
                <NumberOfResources
                    data={{
                        numberOfResources: statistics.numberOfResources,
                        latestInsertDate: latestInsert.date
                    }}
                />
                <ResourceTypes data={statistics.typeDistribution} />
                <Decades data={statistics.temporalDistribution} />
                <Projects data={statistics.projects} />
            </MainContainer>
        </>
    );
};

export default Statistics;
