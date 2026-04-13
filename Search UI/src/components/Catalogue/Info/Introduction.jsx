import styled from '@emotion/styled';
import { Container } from '@mui/material';

const MainContainer = styled(Container)`
    position: relative;
    display: flex;
    align-items: center;
`;
const StyledContainer = styled(Container)`
    margin-top: 0px;
    background-color: white;
    border: 2px solid var(--mui-palette-secondary-main);
    border-radius: var(--mui-shape-borderRadius-1);

    h1 {
        margin-top: 0px;
        color: var(--mui-palette-primary-main);
    }

    p {
        text-align: center;
        margin: 5px 25px;
    }
`;

const StyledImage = styled('img')`
    height: 350px;
    margin-left: -100px;
    margin-top: 30px;
    margin-bottom: -80px;
    z-index: 2;
`;

const Introduction = () => {
    return (
        <MainContainer>
            <StyledContainer variant="column">
                <h1>Welcome to the Soilwise Catalogue</h1>
                <p>
                    You have arrived at a prototype of the Soilwise Catalogue to
                    safeguard soils. Together, we're fostering soil wisdom,
                    advancing agriculture, and building a legacy of greener,
                    healthier soils.
                </p>
                <p>
                    Read more about the project behind this prototype at our
                    website at{' '}
                    <a href="https://soilwise-he.eu/">Soilwise-HE.eu</a>.
                </p>
            </StyledContainer>
            <StyledImage src="/images/soilwise-welcome-visual.png" />
        </MainContainer>
    );
};

export default Introduction;
