import styled from '@emotion/styled';
import { Delete as MUIDelete } from '@mui/icons-material';

const StyledDelete = styled(MUIDelete)`
    color: ${props => props.color || 'var(--mui-palette-grey-500)'};
    width: calc(${props => props.size || 1} * 1em);
`;

export const Delete = props => {
    return <StyledDelete {...props} />;
};
