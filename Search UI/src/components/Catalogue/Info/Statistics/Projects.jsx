import { Tooltip } from '@mui/material';

import { TextContainer } from '.';

const Projects = ({ data }) => {
    return (
        <TextContainer>
            <h2>
                Projects with
                <br />
                most resources
            </h2>
            {data.map(item => (
                <span key={item[0]}>
                    <Tooltip title={`${item[1]} resources`}>
                        <p>{item[0]}</p>
                    </Tooltip>
                </span>
            ))}
        </TextContainer>
    );
};

export default Projects;
