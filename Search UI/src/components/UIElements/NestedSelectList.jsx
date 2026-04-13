import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, TextField } from '@mui/material';

import ToolTip from './ToolTip';
import useGetData from 'src/services/getData';

const StyledMuiAutocomplete = styled(Autocomplete)`
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

const NestedSelectList = ({
    label,
    values,
    options,
    onChange,
    multiple,
    helperText,
    ...props
}) => {
    const [nestedOptions, setNestedOptions] = useState(null);

    const hasSiblings = option => {
        return Object.keys(option).length > 0;
    };

    const translateOptions = items => {
        console.log(Object.keys(items));
        return Object.entries(items).map(([key, value]) => {
            if (hasSiblings(value)) {
                return (
                    <div style={{ border: '1px solid grey' }}>
                        <p>{key}</p>
                        <div style={{ display: 'flex' }}>
                            {translateOptions(value)}
                        </div>
                    </div>
                );
            } else {
                return <h2>{key}</h2>;
            }
        });
    };

    useEffect(() => {
        if (!options) return;

        setNestedOptions(translateOptions(options));
    }, [options]);

    return nestedOptions;
};

export default NestedSelectList;
