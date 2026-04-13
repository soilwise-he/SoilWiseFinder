import { useEffect, useRef, useState } from 'react';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import styled from '@emotion/styled';
import { Button, IconButton, Popper, TextField } from '@mui/material';
import { ArrowBack, TravelExplore } from '@mui/icons-material';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Point, Polygon } from 'ol/geom';

import { ButtonMapControl } from './ButtonMapControl';
import { useOSMLocation } from 'src/services/useOSMLocation';
import { store } from 'src/context/store';
import { interactionTypes } from 'src/services/settings';
import { useMap } from 'src/context/MapContext';
import { useGeoLocation } from 'src/services/useGeoLocation';

export const CurrentLocationControl = () => {
    const { positionEnabled, zoomToLocation } = useGeoLocation();

    return (
        <ButtonMapControl
            onClick={positionEnabled ? zoomToLocation : null}
            Icon={MyLocationIcon}
            info={
                positionEnabled
                    ? 'Zoom to current location'
                    : `Your location is not discoverable. This can be due to the location service not getting your position at the moment. 
                    Or you need to allow this site to access your location in your browser settings.`
            }
            disabled={!positionEnabled}
        />
    );
};

const SearchControl = styled.div`
    display: flex;
    align-items: center;

    .MuiInputBase-formControl {
        height: 28px;
        background-color: #fff;
    }
`;
const InputControl = styled.div`
    background-color: #fff;
    border-radius: var(--mui-shape-borderRadius-0);
    border: solid 1px var(--mui-palette-grey-500);

    button {
        padding: 4px;
    }
`;
const LocationOptions = styled(Popper)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: white;
    z-index: 200;

    .MuiButton-root {
        text-transform: none;
        font-weight: normal;
        color: var(--mui-palette-text-primary);
        justify-content: flex-start;
    }
`;
const OptionLabel = styled.span`
    height: fit-content;
    background-color: white;

    p {
        margin: 0px;
    }
`;

export const SearchLocationControl = () => {
    const { interaction, setInteraction } = useMap();
    const [showInput, setShowInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const anchorElement = useRef(null);
    const [locationOptions, setLocationOptions] = useState([]);
    const { getSuggestions, getLocationList, getFeature } = useOSMLocation();
    const { setLocations, setPolygon } = store();

    useEffect(() => {
        setShowInput(interaction === interactionTypes.search);
    }, [interaction]);

    const handleClick = () => {
        if (interaction === interactionTypes.search && !showInput) {
            setShowInput(true);
        } else {
            setInteraction(previous => {
                if (previous === interactionTypes.search) {
                    return null;
                } else {
                    return interactionTypes.search;
                }
            });
        }
    };

    const handleInputChange = async event => {
        let value = event.target.value.trim();

        if (value.length < 3) {
            setLocationOptions([]);
        } else {
            const data = await getSuggestions(value);

            setLocationOptions(
                data.features.map(item => ({
                    id: item.properties.osm_id,
                    value: [item.properties.name, item.properties.type]
                }))
            );
        }

        setSearchQuery(value);
    };

    const handleKeyDown = event => {
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            let focusElement = event.target;

            if (event.target.tagName === 'INPUT') {
                focusElement =
                    document.getElementsByClassName('filter-option')[0];
            } else {
                focusElement = focusElement.nextSibling;
            }

            focusElement?.focus();
        } else if (event.code === 'ArrowUp') {
            event.preventDefault();
            let focusElement = event.target.previousSibling;

            if (!focusElement) {
                focusElement = document.getElementById('search-text');
            }

            focusElement?.focus();
        } else if (event.code === 'Enter') {
            setLocationOptions([]);

            if (event.target.tagName === 'INPUT') {
                handleSubmit();
            } else {
                event.target.click();
            }
        }
    };

    const handleSelect = option => _ => {
        setSearchQuery(option.value[0]);
        setLocationOptions([]);
    };

    const getLocationFeature = item => {
        let feature = new Feature({
            geometry: new Point(fromLonLat([item.lon, item.lat])),
            type: 'orientation',
            label: item.display_name
        });
        feature.set('onClick', () => {
            try {
                getFeature(item.osm_type, item.osm_id).then(result => {
                    let coordinates = result.map(node => fromLonLat(node));
                    let polygon = new Feature({
                        geometry: new Polygon([coordinates]),
                        label: item.display_name
                    });

                    setPolygon(polygon);
                });
            } catch (error) {
                console.error(error);
            }

            setShowInput(false);
        });

        return feature;
    };

    const handleSubmit = event => {
        if (event?.key === 'Enter' || event?.type === 'click') {
            event.preventDefault();

            getLocationList(searchQuery).then(data => {
                setLocations(data.map(item => getLocationFeature(item)));
            });
        }
    };

    return (
        <SearchControl>
            {showInput && (
                <InputControl>
                    <IconButton onClick={handleSubmit}>
                        <ArrowBack fontSize="small" />
                    </IconButton>
                    <TextField
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyUpCapture={handleSubmit}
                        onKeyDown={handleKeyDown}
                        inputRef={input => input && input.focus()}
                        ref={anchorElement}
                    />
                    <LocationOptions
                        open={locationOptions.length > 0}
                        anchorEl={anchorElement.current}
                        placement="bottom-start"
                    >
                        {locationOptions.map(option => (
                            <Button
                                key={option.id}
                                onClick={handleSelect(option)}
                                id={option.id}
                                className="filter-option"
                                onKeyDown={handleKeyDown}
                                disableRipple
                            >
                                <OptionLabel>
                                    {option.value[0] +
                                        ' (' +
                                        option.value[1] +
                                        ')'}
                                </OptionLabel>
                            </Button>
                        ))}
                    </LocationOptions>
                </InputControl>
            )}
            <ButtonMapControl
                onClick={handleClick}
                Icon={TravelExplore}
                info={interactionTypes.search}
                active={interaction === interactionTypes.search}
            />
        </SearchControl>
    );
};
