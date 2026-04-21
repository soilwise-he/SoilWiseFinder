import { Container } from '@mui/material';
import styled from '@emotion/styled';

const Content = styled.div`
    display: flex;
    gap: var(--mui-spacing-2);
`;

const Contact = () => {
    return (
        <Container>
            <Container variant="box">
                <h2>CONTACT</h2>
                <h1>How to interact with SoilWise</h1>
                <h2>For developers</h2>
                <Content>
                    <div>
                        <p>
                            The{' '}
                            <a
                                href="https://cordis.europa.eu/project/id/101112838"
                                target="_blank"
                            >
                                Soilwise project
                            </a>{' '}
                            aims to adopt latest standardised API's for ease of
                            interaction. Following API's are available to
                            interact with the hub.
                        </p>
                        <ul>
                            <li>
                                <a
                                    href="https://soilwise-he.containers.wur.nl/cat/csw"
                                    target="_blank"
                                >
                                    OGC-CSW
                                </a>{' '}
                                /{' '}
                                <a
                                    href="https://soilwise-he.containers.wur.nl/cat/openapi"
                                    target="_blank"
                                >
                                    OGCAPI - Records
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://soilwise-he.containers.wur.nl/cat/stac"
                                    target="_blank"
                                >
                                    STAC
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://repository.soilwise-he.eu/sparql/"
                                    target="_blank"
                                >
                                    Sparql
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://soilwise-he.containers.wur.nl/cat/oaipmh"
                                    target="_blank"
                                >
                                    Oai-pmh
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <p>
                            Technical documentation can be found on our{' '}
                            <a
                                href="https://soilwise-he.github.io/SoilWise-documentation/"
                                target="_blank"
                            >
                                Github repository
                            </a>
                        </p>
                        <p>
                            The{' '}
                            <a
                                href="https://cordis.europa.eu/project/id/101112838"
                                target="_blank"
                            >
                                Soilwise project
                            </a>{' '}
                            operates agile in 3 iterations. The work is
                            co-funded by the EU Horizon Europe program. Follow
                            our{' '}
                            <a href="https://www.linkedin.com/company/soilwise-project-eu">
                                social media
                            </a>{' '}
                            accounts to get latest updates or visit the{' '}
                            <a
                                href="https://soilwise-he.github.io/SoilWise-documentation/"
                                target="_blank"
                            >
                                Github repository
                            </a>
                            .
                        </p>
                    </div>
                </Content>
                <h2>For users and providers</h2>

                <Content>
                    <p>
                        Contact us via{' '}
                        <a href="mailto:soilwise@biosense.rs">email</a> for any
                        questions.
                    </p>
                </Content>
            </Container>
        </Container>
    );
};

export default Contact;
