import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Slider from '@mui/material/Slider';
import { Input, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';

const FilterOptions = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--mui-spacing-0);
    justify-content: space-between;
    border: 1px solid var(--mui-palette-grey-300);
    border-radius: var(--mui-shape-borderRadius-0);
`;
const StyledLegend = styled.legend`
    font-size: 1rem !important;
    font-weight: 400;
    text-align: center;
    margin-top: var(--mui-spacing-0);
`;
const StyledSlider = styled.div`
    display: flex;
    gap: var(--mui-spacing-1);
    padding: var(--mui-spacing-0);

    .MuiInput-root {
        border: 1px solid var(--mui-palette-grey-300);
        border-radius: var(--mui-shape-borderRadius-0);
        padding: 3px;
        max-height: 33px;
        align-items: center;

        input {
            width: 44px;
            text-align: center;
        }

        &::before,
        &::after {
            display: none;
        }
    }

    .MuiSlider-root {
        flex: 1 1 250px;
    }

    .MuiSlider-thumb {
        background-color: #fff;
        border: 2px solid currentColor;
    }
`;

const RangeSlider = ({
    label,
    minimum,
    maximum,
    value,
    onChange,
    helperText,
    ...props
}) => {
    const [localValue, setLocalValue] = useState([0, 0]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (_, newValue) => {
        onChange(newValue);
    };

    const checkValue = uncheckedValue => {
        let checkedValue = uncheckedValue;

        if (checkedValue[0] < minimum) {
            checkedValue[0] = minimum;
        }

        if (checkedValue[1] > maximum) {
            checkedValue[1] = maximum;
        }

        if (checkedValue[0] > checkedValue[1]) {
            checkedValue[0] = checkedValue[1];
        }

        return checkedValue;
    };

    const handleInputChange = index => event => {
        let newValue = [value[0], value[1]];

        if (index == 0) {
            newValue[0] =
                event.target.value == ''
                    ? ''
                    : Number.parseInt(event.target.value);
        } else {
            newValue[1] =
                event.target.value == ''
                    ? ''
                    : Number.parseInt(event.target.value);
        }

        if (event.target.value.length === 4) {
            onChange(checkValue(newValue));
        } else {
            setLocalValue(newValue);
        }
    };

    const handleBlur = event => {
        if (event.target.value.length !== 4) {
            setLocalValue(value);
        } else if (value[0] !== localValue[0] || value[1] !== localValue[1]) {
            onChange(checkValue(localValue));
        }
    };

    return (
        <FilterOptions>
            <Tooltip title={helperText}>
                <StyledLegend>{label}</StyledLegend>
            </Tooltip>
            <StyledSlider>
                <Input
                    value={localValue[0]}
                    onChange={handleInputChange(0)}
                    onBlur={handleBlur}
                    inputProps={{
                        step: 1,
                        min: minimum,
                        max: value[1]
                    }}
                    disabled={props.disabled}
                />
                <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="off"
                    min={minimum}
                    max={maximum}
                    step={1}
                    marks={[
                        { value: minimum, label: minimum },
                        { value: maximum, label: maximum }
                    ]}
                    disableSwap
                    color="secondary"
                    {...props}
                />
                <Input
                    value={localValue[1]}
                    onChange={handleInputChange(1)}
                    onBlur={handleBlur}
                    inputProps={{
                        step: 1,
                        min: value[0],
                        max: maximum
                    }}
                    disabled={props.disabled}
                />
            </StyledSlider>
        </FilterOptions>
    );
};

RangeSlider.propTypes = {
    label: PropTypes.string,
    minimum: PropTypes.number,
    maximum: PropTypes.number,
    defaultValue: PropTypes.array,
    onChange: PropTypes.func,
    helperText: PropTypes.string
};

export default RangeSlider;
