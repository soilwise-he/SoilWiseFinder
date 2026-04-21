import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, TextField } from '@mui/material';

const StyledMuiAutocomplete = styled(Autocomplete)`
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
        <FormControl
            variant="outlined"
            {...props}
        >
            <StyledMuiAutocomplete
                multiple={multiple}
                value={values}
                options={options}
                getOptionLabel={option => option.value || ''}
                freeSolo
                renderValue={value => <div>{value.length + ' selected'}</div>}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={label}
                        helperText={helperText}
                    />
                )}
                onChange={handleChange}
                {...props}
            />
        </FormControl>
    );
};

const valueType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
]);

SelectList.propTypes = {
    label: PropTypes.node,
    values: PropTypes.arrayOf(valueType),
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: valueType.isRequired,
            disabled: PropTypes.bool
        })
    ),
    multiple: PropTypes.bool,
    helperText: PropTypes.string
};

export default SelectList;
