import { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import * as ol from 'ol';
import { defaults as defaultInteractions } from 'ol/interaction/defaults.js';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom.js';
import { shiftKeyOnly } from 'ol/events/condition.js';

import { mapParameters } from 'src/services/settings';
import MapContext from '../../context/MapContext';

const InfoBox = styled.div`
    position: absolute;
    display: inline-block;
    height: auto;
    width: auto;
    max-width: 200px;
    z-index: 50;
    background-color: #fff;
    color: #000;
    text-align: center;
    border-radius: 4px;
    border: 1px solid var(--mui-palette-primary-main);
    padding: 5px;
    pointer-events: none;
    visibility: hidden;
`;

const MapWrapper = ({ children, zoom, center }) => {
    const mapReference = useRef();
    const infoReference = useRef();
    const map = useMemo(
        () =>
            new ol.Map({
                view: new ol.View(mapParameters),
                layers: [],
                controls: [],
                overlays: [],
                interactions: defaultInteractions({
                    mouseWheelZoom: false
                }).extend([
                    new MouseWheelZoom({
                        condition: shiftKeyOnly
                    })
                ])
            }),
        []
    );
    const [interaction, setInteraction] = useState(null);
    let currentFeature = null;

    const displayFeatureInfo = function (pixel, target) {
        const feature = target.closest('.ol-control')
            ? undefined
            : map.forEachFeatureAtPixel(pixel, feature => feature);
        const mapPosition = mapReference.current.getBoundingClientRect();
        const infoPosition = infoReference.current.getBoundingClientRect();

        if (feature?.get('label')) {
            if (pixel[0] > mapPosition.width - infoPosition.width) {
                infoReference.current.style.left = null;
                infoReference.current.style.right =
                    mapPosition.right - pixel[0] + 'px';
            } else {
                infoReference.current.style.right = null;
                infoReference.current.style.left =
                    mapPosition.left + pixel[0] + 'px';
            }

            if (pixel[1] > mapPosition.height - infoPosition.height) {
                infoReference.current.style.top =
                    window.scrollY +
                    mapPosition.top +
                    pixel[1] -
                    infoPosition.height +
                    'px';
            } else {
                infoReference.current.style.bottom = null;
                infoReference.current.style.top =
                    mapPosition.top + window.scrollY + pixel[1] + 'px';
            }

            if (feature !== currentFeature) {
                infoReference.current.style.visibility = 'visible';
                infoReference.current.innerText = feature.get('label');
            }
        } else {
            infoReference.current.style.visibility = 'hidden';
        }

        currentFeature = feature;
    };

    useEffect(() => {
        map.setTarget(mapReference.current);

        return () => map?.setTarget(undefined);
    }, [map]);

    const getClickableParent = () => {
        let clickableParent = map.getTargetElement().parentElement;

        while (clickableParent && clickableParent.nodeName !== 'A')
            clickableParent = clickableParent.parentElement;

        return clickableParent;
    };

    useEffect(() => {
        if (!map) return;

        let isDragging = false;
        let clickableParent = getClickableParent();

        map.on('pointermove', function (event) {
            if (event.dragging) {
                if (clickableParent) {
                    clickableParent.style.pointerEvents = 'none';
                    isDragging = true;
                }

                infoReference.current.style.visibility = 'hidden';
                currentFeature = undefined;
                return;
            }

            displayFeatureInfo(event.pixel, event.originalEvent.target);
        });

        map.getTargetElement().addEventListener('pointerleave', function () {
            currentFeature = undefined;
            infoReference.current.style.visibility = 'hidden';
        });

        map.on('singleclick', event => {
            map.forEachFeatureAtPixel(event.pixel, feature => {
                const onClick = feature.get('onClick');

                if (typeof onClick === 'function') onClick();
            });
        });

        const endDrag = () => {
            if (isDragging) {
                isDragging = false;

                if (clickableParent)
                    clickableParent.style.pointerEvents = 'auto';
            }
        };

        map.on('pointerup', endDrag);
        document.addEventListener('pointerup', endDrag);

        return () => {
            document.removeEventListener('pointerup', endDrag);
        };
    }, [map]);

    useEffect(() => {
        if (!map) return;

        map.getView().setZoom(zoom);
    }, [zoom, map]);

    useEffect(() => {
        if (!map) return;

        map.getView().setCenter(center);
    }, [center, map]);

    const zoomToExtent = useCallback(
        targetExtent => {
            if (!map) return;

            const view = map.getView();

            if (targetExtent) {
                view.fit(targetExtent, {
                    minResolution: 1,
                    padding: mapParameters.padding
                });

                if (view.getZoom() > mapParameters.minimumZoom)
                    view.setZoom(mapParameters.minimumZoom);
            } else {
                view.fit(mapParameters.europeExtent, {
                    minResolution: 1
                });
            }
        },
        [map]
    );

    const getExtent = useCallback(() => {
        if (!map) return;

        let extent = null;

        for (const layer of map.getLayers()) {
            let properties = layer.getProperties();

            if (properties.id === 'data') {
                extent = properties.source.extent;
            }
        }

        return extent;
    }, [map]);

    return (
        <MapContext.Provider
            value={useMemo(
                () => ({
                    map,
                    zoomToExtent,
                    getExtent,
                    interaction,
                    setInteraction
                }),
                [map, zoomToExtent, getExtent, interaction, setInteraction]
            )}
        >
            <div
                ref={mapReference}
                className="ol-map"
            >
                {children}
            </div>
            <InfoBox ref={infoReference}></InfoBox>
        </MapContext.Provider>
    );
};

MapWrapper.propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    zoom: PropTypes.number,
    center: PropTypes.array
};

export default MapWrapper;
