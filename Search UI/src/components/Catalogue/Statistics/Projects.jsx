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
                <span key={item.val}>
                    <Tooltip title={`${item.count} resources`}>
                        <p>{item.val}</p>
                    </Tooltip>
                </span>
            ))}
        </TextContainer>
    );
};

export default Projects;
