'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import NumberOfResources from 'components/Catalogue/Statistics/NumberOfResources';
import useGetData from 'src/services/getData';
import ResourceTypes from 'components/Catalogue/Statistics/ResourceTypes';
import Decades from 'components/Catalogue/Statistics/Decades';
import Projects from 'components/Catalogue/Statistics/Projects';

const TileContainer = styled.div`
    max-width: 250px;

    > div {
        min-height: 225px;
    }
`;

export default function Statistics({ params }) {
    const { getStatistics, getLatestInsert } = useGetData();
    const [statistics, setStatistics] = useState();
    const [tile, setTile] = useState(null);

    useEffect(() => {
        setStatistics(getStatistics());
    }, [getStatistics]);

    useEffect(() => {
        if (!statistics) return;

        params.then(items => {
            if (items.tile === 'numberofresources') {
                getLatestInsert().then(data => {
                    setTile(
                        <NumberOfResources
                            data={{
                                numberOfResources: statistics.numberOfResources,
                                latestInsertDate: data.date
                            }}
                        />
                    );
                });
            } else if (items.tile === 'resourcetypes') {
                setTile(<ResourceTypes data={statistics.typeDistribution} />);
            } else if (items.tile === 'decades') {
                setTile(<Decades data={statistics.temporalDistribution} />);
            } else if (items.tile === 'projects') {
                setTile(<Projects data={statistics.projects} />);
            }
        });
    }, [statistics]);

    return <TileContainer>{tile}</TileContainer>;
}
