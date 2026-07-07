import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import { Autocomplete } from '@mui/material';

import TextField from './TextField';

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
            <Autocomplete
                multiple={multiple}
                value={values}
                options={options}
                getOptionLabel={option => option.value || ''}
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
                        params={params}
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

export default SelectChip;
