import { IconButton, Tooltip } from '@mui/material';
import { Clear } from '@mui/icons-material';

import { store } from 'src/context/store';

const StartNew = () => {
    const { reset } = store();

    return (
        <Tooltip title="Clear search text and filters">
            <IconButton
                color="secondary"
                onClick={reset}
            >
                <Clear />
            </IconButton>
        </Tooltip>
    );
};

export default StartNew;
