import { TextContainer } from '.';

const NumberOfResources = ({ data }) => {
    return (
        <TextContainer>
            <h2>There are</h2>
            <h1>{data.numberOfResources}</h1>
            <h2>resources in the SoilWise Catalogue</h2>
            <i>last insert: {data.latestInsertDate}</i>
        </TextContainer>
    );
};

export default NumberOfResources;
