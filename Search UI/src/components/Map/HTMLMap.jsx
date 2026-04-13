'use client';

import dynamic from 'next/dynamic';

const HTMLMap = ({ data }) => {
    const MapWrapper = dynamic(() => import('src/components/Map/MapWrapper'), {
        ssr: false
    });
    const MapContent = dynamic(
        () => import('src/components/Map/MapContent/SimpleMapContent'),
        {
            ssr: false
        }
    );

    return (
        <MapWrapper>
            <MapContent data={data} />
        </MapWrapper>
    );
};

export default HTMLMap;
