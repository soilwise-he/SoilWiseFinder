'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Circle, Info } from '@mui/icons-material';
import { Button, Container, IconButton, TextField } from '@mui/material';

import useGetData from '../../services/getData';
import Modal from '../Surfaces/Modal';

const Content = styled.div`
    display: flex;
    flex-direction: row;
    gap: var(--mui-spacing-4);
`;
const ContentColumn = styled.div`
    flex: 1 1 45%;
`;
const HarvestProcess = styled.div`
    display: flex;

    p {
        margin-bottom: 0px;
    }
`;
const StyledImage = styled.img`
    max-height: 130px;
    margin: var(--mui-spacing-1) auto;
`;
const Validator = styled.div`
    width: calc(100% - 2px);
    height: 40px;
    border-radius: 100px;
    border: 1px solid var(--mui-palette-secondary-main);
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    margin-bottom: 23px;

    .MuiInputBase-root {
        width: 100%;
        height: 100%;
    }

    .MuiOutlinedInput-notchedOutline {
        border: none;
    }
`;
const Preparation = styled.div`
    margin-top: var(--mui-spacing-1);
    margin-bottom: var(--mui-spacing-0);

    & button {
        display: flex;
        flex-direction: column;
        margin-left: var(--mui-spacing-1);

        i {
            font-size: 0.7rem;
        }
    }
`;
const Dot = styled(Circle)`
    font-size: 10px;
    margin-right: 4px;
    vertical-align: middle;
`;
const Repositories = styled(Container)`
    flex-wrap: wrap;
    gap: var(--mui-spacing-1);
    justify-content: flex-start;
    padding: var(--mui-spacing-0);

    a {
        display: flex;
        flex-direction: column;
        text-align: center;
        flex: 1 1 10%;

        img {
            max-height: 40px;
            width: 100%;
            object-fit: contain;
        }
    }
`;

const BackgroundInformation = ({ open, setOpen }) => {
    return (
        <Modal
            open={open}
            setOpen={setOpen}
            title="How Soilwise identifies relevant creative works in the HE research domain"
        >
            <p>
                <i>Date: 2025-09-04</i>
                <br />
                <i>Authors: Paul van Genuchten</i>
            </p>
            <p>
                To identify relevant articles and datasets in the HE research
                domain, Soilwise applies a number of selection and filter
                mechanisms. This document describes and visualises some of these
                mechanisms. The document focusses on the HE research domain
                only, for other domains (INSPIRE, Earth observation, …) other
                mechanisms are available. For the research domain, 2 main
                mechanisms can be identified:
            </p>
            <ul>
                <li>Creative works of soil related Horizon Europe projects</li>
                <li>
                    Works identified as relevant to our domain by eligible
                    sources
                </li>
            </ul>
            <h2>Creative works from Horizon Europe projects</h2>
            <p>
                The first selection mechanism is based on a list of relevant
                Horizon Europe research projects, extracted from the EU-funded
                page in the ESDAC website and the funded projects page of Soil
                Mission platform. The identifiers of these projects (the HE
                grant number) are used to select creative works of these
                projects from OpenAire.
            </p>
            <p>
                Included in this mechanism is also a query to Cordis, to
                retrieve the relevant publications of selected projects. Direct
                uploads are not considered, only publications which are
                referenced by DOI. Based on the identifier, the relevant
                metadata is extracted from OpenAire, and added to the index*.
            </p>
            <h2>Other relevant works</h2>
            <p>
                The second mechanism is based on harvesting various knowledge
                hubs in the domain, such as EJP Soil, Prepsoil, Impact4soil and
                ESDAC. Content is extracted by DOI. Based on the DOI, the
                relevant metadata is extracted from OpenAire, and added to the
                index*.
            </p>
            <p>
                A foreseen extension to this mechanism is based on crossref.
                Crossref is a public initiative to derive for each publication,
                which citations it contains and by which the publication itself
                is cited. The algorithm will identify publications which are
                often cited by other articles and include those in the index.
            </p>
            <p>
                * OpenAire only includes Open Access works, if a resource is
                identified which is not available in OpenAire, then the DOI
                registry is queried for a minimal set of metadate properties.
                Not all creative works use DOI as identifier system, some are
                based on ePic or Handle.net. At the moment Soilwise only
                supports this workaround for DOI's.
            </p>
            <h2>Checklist, why is my work not included?</h2>
            <p>
                There can be various reasons why a resource is not yet included.
                This list helps to identify potential challenges. Also consider
                that it may take some time (days) before a new resource is
                processed through the various systems.
            </p>
            <p>
                For works produced in the scope of selected Horizon Europe
                projects:
            </p>
            <ul>
                <li>
                    Has the work been created in the scope of a Horizon Europe
                    project, which is listed on either the EU-funded page in the
                    ESDAC website or the funded projects page of Soil Mission
                    platform?
                </li>
                <li>
                    Has the work been deposited in a repository which is
                    harvested by OpenAire. Locate your work in OpenAire Explore.
                    Some works are not ingested by OpenAire, if they don't
                    comply with the OpenAire content policy.
                </li>
                <li>
                    As part of the deposit, did you reference the relevant
                    project funding (grant number) and did your repository
                    provide this information to OpenAire according to the
                    OpenAire guidelines.
                </li>
            </ul>
            For other relevant works:
            <ul>
                <li>
                    Has the work been deposited in a repository which is
                    harvested by OpenAire. Locate your work in OpenAire Explore.
                    Some works are not ingested by OpenAire, if they don't
                    comply with the OpenAire content policy.
                </li>
                <li>
                    Is your work referenced from any of the knowledge hubs
                    ingested into SoilWise Catalogue? For the current list,
                    visit the SoilWise Catalogue homepage.
                </li>
            </ul>
            <p>
                Please contact the repository administrators if the above
                checklist did not provide evidence on why a resource is not
                included.
            </p>
            <p>
                Notice that for each record a mention is made in the repository
                through which channel(s) the record has been included.
            </p>
        </Modal>
    );
};

BackgroundInformation.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func
};

const ForDataProviders = () => {
    const { getValidation } = useGetData();
    const [showInfo, setShowInfo] = useState(false);
    const [validation, setValidation] = useState({
        value: '',
        result: null,
        show: false
    });

    const handleChange = event => {
        setValidation(previous => ({ ...previous, value: event.target.value }));
    };

    const handleKeyDown = event => {
        if (event.code === 'Enter') validate();
    };

    const validate = async () => {
        let result = await getValidation(validation.value);
        let items = Array.from(new Set(result));

        setValidation(previous => ({
            ...previous,
            result: (
                <>
                    {' '}
                    <h2>{`Validated '${items[0].replace('Test item ', '')}'`}</h2>
                    <ul>
                        {items.slice(1).map((item, index) => (
                            <li
                                key={'validation-' + index}
                                dangerouslySetInnerHTML={{ __html: item }}
                            />
                        ))}
                    </ul>
                </>
            ),
            show: true
        }));
    };

    return (
        <Container>
            <Container variant="box">
                <h2>FOR DATA & KNOWLEDGE PROVIDERS</h2>
                <h1>How to populate the SoilWise Catalogue</h1>
                <Content>
                    <ContentColumn>
                        <HarvestProcess>
                            <p>
                                SoilWise harvests metadata from different
                                repositories to store in the SoilWise Catalogue.
                            </p>
                            <IconButton
                                onClick={() =>
                                    setShowInfo(previous => !previous)
                                }
                            >
                                <Info />
                            </IconButton>
                        </HarvestProcess>
                        <StyledImage
                            alt="harvest process"
                            src="/images/HarvestProcessSimplified.png"
                        />
                    </ContentColumn>
                    <ContentColumn>
                        <div>
                            <p>
                                Check if your resource is already in the
                                SoilWise Catalogue. Or find out why it is not
                                there with our validator.
                            </p>
                            <Validator>
                                <TextField
                                    value={validation.value}
                                    placeholder="identifier, handle or DOI"
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                />
                                <Button
                                    onClick={validate}
                                    color="primary"
                                    variant="contained"
                                >
                                    validate
                                </Button>
                            </Validator>
                        </div>
                    </ContentColumn>
                </Content>
                <Content>
                    <ContentColumn>
                        <h2>
                            Make your data & knowledge discoverable for the
                            SoilWise Catalogue
                        </h2>
                        <Preparation>
                            <p>
                                <Dot /> Prepare your resource
                            </p>
                            <Button
                                variant="outlined"
                                disabled={true}
                            >
                                FAIR strategy guidances <i>availabe soon</i>
                            </Button>
                        </Preparation>
                        <p>
                            <Dot /> Choose a harvested repository to publish
                            your resource
                        </p>
                        <Repositories variant="row">
                            <a
                                key="esdac"
                                href={null}
                                target="_blank"
                            >
                                <img
                                    alt="esdac"
                                    src="/images/EURepository.png"
                                />
                                ESDAC
                            </a>
                            <a
                                key="inspire"
                                href={null}
                                target="_blank"
                            >
                                <img
                                    alt="inspire"
                                    src="/images/EURepository.png"
                                />
                                INSPIRE
                            </a>
                            <a
                                key="cordis"
                                href={null}
                                target="_blank"
                            >
                                <img
                                    alt="cordis"
                                    src="/images/EURepository.png"
                                />
                                CORDIS
                            </a>
                            <a
                                key="bonares"
                                href="https://tools.bonares.de/submission/"
                                target="_blank"
                            >
                                <img
                                    alt="bonares"
                                    src="/images/Bonares.png"
                                />
                            </a>
                            <a
                                key="zenodo"
                                href="https://help.zenodo.org/docs/deposit/"
                                target="_blank"
                            >
                                <img
                                    alt="zenodo"
                                    src="/images/Zenodo.png"
                                />
                            </a>
                            <a
                                key="openaire"
                                href="https://explore.openaire.eu/participate/deposit/learn-how"
                                target="_blank"
                            >
                                <img
                                    alt="openaire"
                                    src="/images/OpenAIRE.png"
                                />
                                Find other repositories
                            </a>
                        </Repositories>
                    </ContentColumn>
                </Content>
            </Container>
            <BackgroundInformation
                open={showInfo}
                setOpen={setShowInfo}
            />
            <Modal
                open={validation.show}
                setOpen={value => {
                    setValidation(previous => ({
                        ...previous,
                        show: value
                    }));
                }}
                title="Resource validation"
            >
                {validation.result}
            </Modal>
        </Container>
    );
};

export default ForDataProviders;
