import PropTypes from 'prop-types';
import { FormControlLabel, RadioGroup, Radio } from '@mui/material';

const RadioControl = ({ labels, options, value, handleChange }) => {
    return (
        <RadioGroup
            value={value}
            onChange={event => handleChange(event.target.value)}
        >
            {labels.map((label, index) => (
                <FormControlLabel
                    key={'radio-' + index}
                    value={options[index] || label}
                    control={<Radio />}
                    label={label}
                />
            ))}
        </RadioGroup>
    );
};

RadioControl.propTypes = {
    labels: PropTypes.array,
    value: PropTypes.string,
    handleChange: PropTypes.func
};

export default RadioControl;
