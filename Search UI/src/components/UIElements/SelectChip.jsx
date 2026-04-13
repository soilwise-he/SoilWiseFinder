import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
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

const SelectChip = ({
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

    const handleDelete = optionToDelete => {
        onChange(values.filter(value => value !== optionToDelete));
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
                filterSelectedOptions
                renderValue={(value, getItemProps) =>
                    value.length > 0
                        ? value.map((option, index) => {
                              const { key, ...itemProps } = getItemProps({
                                  index
                              });

                              return (
                                  <Chip
                                      variant="outlined"
                                      label={option.value}
                                      key={key + '-' + option.value}
                                      {...itemProps}
                                      onDelete={() => handleDelete(option)}
                                  />
                              );
                          })
                        : null
                }
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

SelectChip.propTypes = {
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

export default SelectChip;
