export const useOSMLocation = () => {
    const getSuggestions = async searchQuery => {
        let data = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=5&bbox=-25.0,34.0,40.0,72.0`
        ).then(response => response.json());

        return data;
    };

    const getLocationList = async searchQuery => {
        let locationList = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=5`
        ).then(response => {
            return response.json();
        });

        return locationList;
    };

    const orderWays = ways => {
        const orderedWays = [...ways];
        const result = orderedWays
            .shift()
            .geometry.map(item => [item.lon, item.lat]);

        while (orderedWays.length > 0) {
            const lastCoordinates = result[result.length - 1];
            let found = false;

            for (let i = 0; i < orderedWays.length; i++) {
                const wayCoordinates = orderedWays[i].geometry.map(item => [
                    item.lon,
                    item.lat
                ]);
                const first = wayCoordinates[0];
                const last = wayCoordinates[wayCoordinates.length - 1];

                if (
                    first[0] === lastCoordinates[0] &&
                    first[1] === lastCoordinates[1]
                ) {
                    result.push(...wayCoordinates.slice(1));
                    orderedWays.splice(i, 1);
                    found = true;
                    break;
                } else if (
                    last[0] === lastCoordinates[0] &&
                    last[1] === lastCoordinates[1]
                ) {
                    result.push(...wayCoordinates.slice(0, -1).reverse());
                    orderedWays.splice(i, 1);
                    found = true;
                    break;
                }
            }

            if (!found) break;
        }

        return result;
    };

    const getFeature = async (osmType, osmID) => {
        const typeMap = { node: 'node', way: 'way', relation: 'relation' };
        const query = `[out:json];${typeMap[osmType]}(${osmID});(._;>;);out body geom;`;

        let feature = await fetch(
            'https://overpass-api.de/api/interpreter?data=' +
                encodeURIComponent(query)
        )
            .then(response => response.json())
            .then(data => {
                let ways = data.elements.filter(
                    item => item.type === typeMap.way
                );

                if (ways.length === 0) {
                    let nodes = data.elements.filter(
                        item => item.type === typeMap.node
                    );
                    return [[nodes[0].lon, nodes[0].lat]];
                }

                return orderWays(ways);
            });

        return feature;
    };

    return {
        getSuggestions,
        getLocationList,
        getFeature
    };
};
