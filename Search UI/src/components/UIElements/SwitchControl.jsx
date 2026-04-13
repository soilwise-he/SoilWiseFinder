import PropTypes from 'prop-types';
import { FormControlLabel, Switch } from '@mui/material';
import ToolTip from './ToolTip';

const SwitchControl = ({ label, value, handleChange, helperText }) => {
    return (
        <ToolTip title={helperText}>
            <FormControlLabel
                label={label}
                control={
                    <Switch
                        checked={value}
                        onChange={handleChange}
                    />
                }
            />
        </ToolTip>
    );
};

SwitchControl.propTypes = {
    label: PropTypes.array,
    value: PropTypes.string,
    handleChange: PropTypes.func,
    helperText: PropTypes.string
};

export default SwitchControl;
