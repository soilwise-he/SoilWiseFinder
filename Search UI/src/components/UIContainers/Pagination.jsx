import { useEffect } from 'react';
import styled from '@emotion/styled';
import { IconButton, MenuItem, Select, useMediaQuery } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { store } from 'src/context/store';
import muiTheme from 'src/style/theme';

const Header = styled.div`
    display: flex;
    gap: 10px;
    justify-content: space-between;
    background-color: color-mix(
        in srgb,
        var(--mui-palette-secondary-main) 20%,
        transparent
    );
    border-radius: var(--mui-shape-borderRadius-0);
    padding: 0px 20px;
`;
const Block = styled.div`
    display: flex;
    gap: 10px;
    justify-content: space-between;

    p,
    div {
        font-size: 1.1rem;
        align-self: center;
    }

    fieldset {
        border: none !important;
    }

    &.left {
        flex-grow: 1;
        justify-content: flex-end;
    }
`;

const Pagination = () => {
    const { pagination, setPagination } = store();
    const count = Math.ceil(
        pagination.numberOfItems / pagination.numberOfItemsPerPage
    );

    const handleNumberChange = event => {
        setPagination(previous => ({
            ...previous,
            numberOfItemsPerPage: event.target.value
        }));
    };

    useEffect(() => {
        setPagination(previous => ({
            ...previous,
            pageIndex: 0
        }));
    }, [setPagination]);

    return (
        <Header>
            <Block>
                <p>
                    {pagination.pageIndex * pagination.numberOfItemsPerPage + 1}
                    -
                    {Math.min(
                        (pagination.pageIndex + 1) *
                            pagination.numberOfItemsPerPage,
                        pagination.numberOfItems
                    )}{' '}
                    of {pagination.numberOfItems} results
                </p>
            </Block>
            {useMediaQuery(() => muiTheme.breakpoints.up('sm')) && (
                <Block className="left">
                    <p>Results per page:</p>
                    <Select
                        value={pagination.numberOfItemsPerPage}
                        onChange={handleNumberChange}
                        size="small"
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </Block>
            )}
            <Block>
                <IconButton
                    disabled={pagination.pageIndex === 0}
                    onClick={() =>
                        setPagination(previous => ({
                            ...previous,
                            pageIndex: previous.pageIndex - 1
                        }))
                    }
                    size="small"
                >
                    <ArrowBackIosIcon fontSize="small" />
                </IconButton>
                <p>
                    {pagination.pageIndex + 1}/{count}
                </p>
                <IconButton
                    disabled={pagination.pageIndex === count - 1}
                    onClick={() =>
                        setPagination(previous => ({
                            ...previous,
                            pageIndex: previous.pageIndex + 1
                        }))
                    }
                    size="small"
                >
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
            </Block>
        </Header>
    );
};

export default Pagination;
