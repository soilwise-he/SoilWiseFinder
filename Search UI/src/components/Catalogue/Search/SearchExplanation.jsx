import { useState } from 'react';
import { InfoOutline } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import styled from '@emotion/styled';
import Image from 'next/image';

import Modal from 'components/UIContainers/Modal';
import SearchBarPNG from 'assets/info/searchbar.png';
import SortAndDownloadPNG from 'assets/info/sortanddownload.png';
import ResourcePNG from 'assets/info/resource.png';
import ThematicFiltersPNG from 'assets/info/thematicfilters.png';
import TemporalFiltersPNG from 'assets/info/temporalfilters.png';
import SpatialFiltersPNG from 'assets/info/spatialfilters.png';
import SelectedFiltersPNG from 'assets/info/selectedfilters.png';

const StyledButton = styled(IconButton)`
    font-size: 2.4rem;
`;

const ModalContainer = styled.div`
    p {
        margin: calc(0.5 * var(--mui-spacing-0)) 0px;
    }
`;

const StyledImage = styled(Image)`
    max-width: ${props => props.width || '300px'};
    max-height: ${props => props.height || 'fit-content'};
    object-fit: ${props => (props.height ? 'cover' : 'contain')};
    object-position: left top;
`;

const Box = styled.div`
    display: flex;
    flex-direction: row;
    gap: var(--mui-spacing-1);

    div p {
        margin-top: 0px;
    }
`;

const SearchExplanation = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <StyledButton
                color="secondary"
                onClick={() => setOpen(true)}
            >
                <InfoOutline fontSize="inherit" />
            </StyledButton>
            <Modal
                title="How to find resources metadata"
                open={open}
                setOpen={setOpen}
            >
                <ModalContainer>
                    <p>
                        The main component to find the metadata that you are
                        looking for is the free text search on the top of the
                        search page.
                    </p>
                    <StyledImage
                        src={SearchBarPNG}
                        alt="searchbar"
                    />
                    <p>
                        You can search for text in the titles, abstracts,
                        authors and keywords of the resources for which there
                        are is metadata available in the SoilWise catalogue. If
                        you start typing you will get suggestions for what to
                        search on.
                    </p>
                    <p>
                        You can search in the same way as you would in e.g.
                        google. This means that you can use double quotes for
                        precise matching of sentences, you can use AND if you
                        want to be specific about which terms should be present
                        together, and you can use OR if you want to indicate
                        terms of which at least one should be present.
                    </p>
                    <h2>Search result</h2>
                    <p>
                        When you click search or press Enter you will get the
                        list of resources that comply with your search query. It
                        shows a summary of the metadata for each resource.
                    </p>
                    <Box>
                        <div>
                            <p>
                                The results are by default sorted on relevance.
                                This means that the better a resource matches
                                your search query the higher it will be in the
                                list. You can also sort the results on date,
                                either in the order from newest to oldest or
                                from oldest to newest. You can select these
                                options in the dropdown list at the top right.
                            </p>
                            <p>
                                Next to the sort options you can click on the
                                download button to get the list of summaries in
                                a csv file. The csv file will also include
                                information on what you searched on.
                            </p>
                        </div>
                        <StyledImage
                            src={SortAndDownloadPNG}
                            alt="sortanddownload"
                        />
                    </Box>
                    <Box>
                        <StyledImage
                            src={ResourcePNG}
                            alt="resource"
                            width="350px"
                            height="150px"
                        />
                        <div>
                            <p>
                                When you click on a resource a panel will open
                                to the right (or bottom if you are on a mobile
                                device) that shows all the metadata that is in
                                the SoilWise catalogue for that resource.
                            </p>
                            <p>
                                You can close the panel again by clicking on the
                                left arrow at the top of the panel. You can open
                                the resource page in a new tab by clicking on
                                the right arrow at the top of the panel. You can
                                also copy the url of the resource page by
                                clicking on the share icon in the middle.
                            </p>
                        </div>
                    </Box>
                    <h2>Filtering the results</h2>
                    <p>
                        You can further drill down on the results by using
                        different types of filters. You can e.g. filter out the
                        resources that are of type 'Dataset' by using the
                        dropdown list on the top left.
                    </p>
                    <p>
                        When you click in the box the list of options will show
                        in alphabetical order. You can type in the box to search
                        through the options. And when you select an option it
                        will show on the top of the filter panel and the results
                        will be filtered directly. This way you can always see
                        what filters you have selected and which resources
                        comply to that.
                    </p>
                    <h3>Thematic filters</h3>
                    <p>
                        You can find more filters like the resource type filter
                        when you click on 'Thematic filters'. You will see an
                        on-off button to find the resources that are part of a
                        Mission Soil project. And you will see dropdown lists
                        for licenses, languages, projects, sources and keywords.
                    </p>
                    <StyledImage
                        src={ThematicFiltersPNG}
                        alt="resource"
                        width="100%"
                    />
                    <h3>Temporal filters</h3>
                    <p>
                        If you want to filter out resources in a certain time
                        period you can click on 'Temporal filters'. You will see
                        two sliders:
                        <ul>
                            <li>
                                In the slider 'Available since' you can move the
                                slider ends to set a year range that filters out
                                the resources that have a date that is within
                                that range.
                            </li>
                            <li>
                                In the slider 'Temporal coverage within' you can
                                move the slider ends to set a year range that
                                filters out the resources that have a temporal
                                coverage that is within that range.
                            </li>
                        </ul>
                        You can also set the start or end year of a range by
                        typing in the corresponding textboxes.
                    </p>
                    <StyledImage
                        src={TemporalFiltersPNG}
                        alt="resource"
                        width="100%"
                    />
                    <h3>Spatial filters</h3>
                    <p>
                        If you want to filter out resources that are focused on
                        a certain region or country you can click on 'Spatial
                        filters'.
                    </p>
                    <StyledImage
                        src={SpatialFiltersPNG}
                        alt="resource"
                        width="100%"
                    />
                    <p>
                        You can select a country from the dropdown list on the
                        left, which will draw a bounding box in the map. By
                        default this will then filter out the resources that
                        have a spatial coverage that overlaps with that bounding
                        box. If you select 'Resource area is within the selected
                        area' on the left this will filter out the resources
                        that have a spatial coverage that falls within the
                        bounding box.
                    </p>
                    <p>
                        Once you have selected a country you can zoom in further
                        by selecting a region within that country. This will
                        adjust the bounding box in the map to that region.
                    </p>
                    <p>
                        Next to selecting countries or regions you can also
                        search for a location in the map. When you click on the
                        globe icon on the right a textbox will appear and you
                        can start searching. Then you click on the arrow and it
                        will show a mark in the map. By double-clicking on the
                        mark you will filter the resources on the selected
                        location.
                    </p>
                    <p>
                        You can also draw a rectangle or free-form in the map to
                        define the area to filter the resources on.
                        <ul>
                            <li>
                                When you click on the square icon on the right
                                you can draw a square in the map by clicking and
                                dragging.
                            </li>
                            <li>
                                When you click on the icon at the bottom right
                                you can draw a free-form in the map. Each click
                                creates a line and when you double-click the
                                drawn form is closed and the area is defined.
                            </li>
                        </ul>
                    </p>
                    <h3>Selected filters</h3>
                    <p>
                        For all filters that you have selected it holds that
                        options within the same filter are treated as 'OR' and
                        options from different filters are treated as 'AND'. For
                        example, below you will filter resources that are of
                        type 'Dataset', <b>AND</b> have 'aluminium' <b>OR</b>{' '}
                        'base saturation' in their keywords, <b>AND</b> have a
                        date between 2004 and 2020.
                    </p>
                    <StyledImage
                        src={SelectedFiltersPNG}
                        alt="resource"
                        width="100%"
                    />
                </ModalContainer>
            </Modal>
        </>
    );
};

export default SearchExplanation;
