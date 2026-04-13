import { useCallback, useEffect, useMemo, useState } from 'react';
import { Feature, Geolocation } from 'ol';
import { Point } from 'ol/geom';

import { useMap } from 'src/context/MapContext';
import { locationMarkerStyle } from 'src/style/mapStyle';

export const useGeoLocation = () => {
    const { map } = useMap();

    const [locationData, setLocationData] = useState({
        position: {
            enabled: true,
            feature: new Feature(),
            data: null
        }
    });

    const geolocation = useMemo(() => {
        if (!map) return null;

        const location = new Geolocation({
            trackingOptions: {
                enableHighAccuracy: false
            }
        });

        const projection = map.getView().getProjection();
        location.setProjection(projection);

        location.on('error', error => {
            console.error(error);
            setLocationData(previous => ({
                position: { ...previous.position, enabled: false }
            }));
        });

        return location;
    }, [map]);

    useEffect(() => {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
            if (result.state === 'denied') {
                setLocationData(previous => ({
                    ...previous,
                    position: { ...previous.position, enabled: false }
                }));
            }
        });
    }, []);

    const updatePosition = () => {
        const coordinates = geolocation.getPosition();

        if (coordinates) {
            setLocationData(previous => {
                previous.position.feature.setGeometry(new Point(coordinates));

                return {
                    ...previous,
                    position: { ...previous.position, data: coordinates }
                };
            });
        }
    };

    useEffect(() => {
        if (!geolocation) return;

        geolocation.setTracking(locationData.position.enabled);

        if (locationData.position.enabled) {
            updatePosition();
            geolocation.on('change:position', updatePosition);
        }

        return () => {
            if (geolocation && updatePosition) {
                geolocation.setTracking(false);
                geolocation.un('change:position', updatePosition);
            }
        };
    }, [geolocation, locationData.position.enabled]);

    useEffect(() => {
        if (locationData.position.feature)
            locationData.position.feature.setStyle(locationMarkerStyle);
    }, [locationData.position.feature]);

    const zoomToLocation = useCallback(() => {
        if (!geolocation) return;

        const coordinates = geolocation.getPosition();

        setLocationData(previous => {
            previous.position.feature.setGeometry(
                coordinates ? new Point(coordinates) : null
            );

            return {
                ...previous,
                position: { ...previous.position, data: coordinates }
            };
        });

        if (coordinates) {
            const view = map.getView();
            view.setCenter(coordinates);
            view.setZoom(10);
        }
    }, [map, geolocation]);

    const locationFeatures = useMemo(() => {
        const locationFeature = [];

        if (
            locationData.position.enabled &&
            locationData.position.data &&
            locationData.position.feature
        ) {
            locationFeature.push(locationData.position.feature);
        }

        return locationFeature;
    }, [
        locationData.position.enabled,
        locationData.position.data,
        locationData.position.feature
    ]);

    return {
        zoomToLocation,
        locationFeatures,
        positionEnabled:
            locationData.position.enabled && locationData.position.data
    };
};
