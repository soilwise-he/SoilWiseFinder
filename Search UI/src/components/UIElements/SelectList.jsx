import FormControl from '@mui/material/FormControl';
import { Autocomplete } from '@mui/material';
import styled from '@emotion/styled';

import ToolTip from './ToolTip';
import TextField from './TextField';

const StyledFormControl = styled(FormControl)`
    z-index: 0;
`;

const SelectList = ({
    label,
    values,
    options,
    onChange,
    multiple,
    helperText,
    ...props
}) => {
    const handleChange = (_, newValues) => {
        if (!newValues) {
            newValues = [];
        } else if (!multiple) {
            newValues = [newValues];
        }

        onChange(newValues);
    };

    return (
        <StyledFormControl
            variant="outlined"
            {...props}
        >
            <ToolTip
                title={helperText}
                placement="top"
            >
                <Autocomplete
                    multiple={multiple}
                    value={values}
                    options={options}
                    getOptionLabel={option => option.value || ''}
                    renderValue={value => (
                        <div>{value.length + ' selected'}</div>
                    )}
                    renderInput={params => (
                        <TextField
                            params={params}
                            label={label}
                            helperText={helperText}
                        />
                    )}
                    onChange={handleChange}
                    {...props}
                />
            </ToolTip>
        </StyledFormControl>
    );
};

export default SelectList;
