'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import SearchBar from 'components/Catalogue/Search/SearchBar';
import SoilCompanion from 'components/Catalogue/Info/SoilCompanion';
import { store } from 'src/context/store';
import { paths } from 'src/services/settings';

export default function Catalogue({ params, searchParams }) {
    let router = useRouter();
    const { setQuery } = store();
    const [component, setComponent] = useState(null);

    const handleSubmit = searchText => {
        router.push('/catalogue/search?text=' + searchText);
    };

    useEffect(() => {
        params.then(items => {
            if (items.component === 'searchbar') {
                setComponent(<SearchBar handleSubmit={handleSubmit} />);
            } else if (items.component === 'search') {
                searchParams.then(parameters => {
                    setQuery(parameters.text || '');
                    router.push(paths.catalogueSearch);
                });
            } else if (items.component === 'chat') {
                setComponent(<SoilCompanion />);
            }
        });
    }, [searchParams]);

    return component;
}
