import { MenuItem, Select, Tooltip } from '@mui/material';
import styled from '@emotion/styled';

import { store } from '../../../context/store';
import { sortDescription, sortOptions } from '../../../services/settings';

const MainContainer = styled.div`
    font-size: 1rem;
    display: flex;
    justify-content: flex-end;
    margin: 12px 0px;
`;

const SortContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: var(--mui-shape-borderRadius-0);

    label {
        padding-left: 6px;
        color: var(--mui-palette-text-primary);
    }

    .MuiSelect-root {
        max-height: 30px;
        width: 225px;
    }

    .MuiOutlinedInput-notchedOutline {
        border: none !important;
        padding: 0px !important;
    }
`;
const SortLabel = styled(Tooltip)``;

const ResourceOptions = () => {
    const { sort, setSort } = store();

    const handleChange = event => {
        setSort(event.target.value);
    };

    return (
        <MainContainer>
            <SortContainer>
                <SortLabel title={sortDescription}>Sort:</SortLabel>
                <Select
                    value={sort}
                    onChange={handleChange}
                >
                    {sortOptions.map((item, index) => (
                        <MenuItem
                            key={'sort-' + index}
                            value={item.value}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </SortContainer>
        </MainContainer>
    );
};

export default ResourceOptions;
