import styled from '@emotion/styled';
import { TextField as MUITextField } from '@mui/material';

import ToolTip from './ToolTip';

const StyledTextField = styled(MUITextField)`
    .MuiInputBase-root {
        padding-left: var(--mui-spacing-0);
        font-size: 0.9rem;
    }

    .MuiFormControl-root {
        border-radius: 100px;
    }

    .MuiChip-root {
        left: 0.5em;
    }

    svg {
        right: 0.5em;
    }
`;

const TextField = ({ params, label, helperText }) => {
    let textfield = (
        <StyledTextField
            {...params}
            label={label}
        />
    );

    if (helperText) {
        return (
            <ToolTip
                title={helperText}
                placement="top"
            >
                {textfield}
            </ToolTip>
        );
    } else {
        return textfield;
    }
};

export default TextField;
