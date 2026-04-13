import { IconButton, MenuItem, Select, Tooltip } from '@mui/material';
import { Download } from '@mui/icons-material';
import styled from '@emotion/styled';

import { store } from 'src/context/store';
import {
    getDetailsPageUrl,
    maximumNumberOfResultsToDownload,
    sortDescription,
    sortOptions
} from 'src/services/settings';
import useGetData from 'src/services/getData';
import { downloadFile } from 'src/services/util';

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
    }

    .MuiOutlinedInput-notchedOutline {
        border: none !important;
        padding: 0px !important;
    }
`;
const SortLabel = styled(Tooltip)``;

const ResourceOptions = () => {
    const { query, filters, sort, setSort, pagination } = store();
    const { getResources } = useGetData();

    const getSearchConfiguration = () => {
        let searchConfiguration = [];

        if (query) {
            searchConfiguration.push(
                '"Free text search:","' + query.replaceAll('"', "'") + '"'
            );
        }

        if (filters.choices.length > 0) {
            searchConfiguration.push(
                '"Selected options:","' +
                    filters.choices
                        .map(item => item.replace('_query', ''))
                        .join('; ') +
                    '"'
            );
        }

        if (Object.keys(filters.ranges).length > 0) {
            let rangeFilters = Object.entries(filters.ranges).map(
                ([key, value]) =>
                    key.replace('_range', '') +
                    ': ' +
                    value.from +
                    ' - ' +
                    value.to
            );

            searchConfiguration.push(
                '"Selected temporal filters:","' + rangeFilters.join('; ') + '"'
            );
        }

        if (Object.keys(filters.terms).length > 0) {
            let termFilters = Object.entries(filters.terms).map(
                ([key, value]) =>
                    key.replace('_terms', '') + ': ' + value.join(',')
            );

            searchConfiguration.push(
                '"Selected thematic filters:","' + termFilters.join('; ') + '"'
            );
        }

        if (filters.spatial) {
            searchConfiguration.push(
                '"Selected spatial filter:","',
                filters.spatial
            );
        }

        return searchConfiguration;
    };

    const getField = (item, field) => {
        if (field === 'url') {
            return getDetailsPageUrl(item.identifier);
        } else if (field === 'abstract') {
            return (
                item[field].substring(0, 100).replaceAll('"', "'") +
                (item[field].length > 100 ? '...' : '')
            );
        } else {
            return item[field]?.replaceAll('"', "'");
        }
    };

    const handleDownload = () => {
        getResources(query, filters, sort, true).then(data => {
            const fields = [
                'url',
                'title',
                'abstract',
                'type',
                'date_publication'
            ];
            let rows = data.response.docs.map(item =>
                fields.map(field => '"' + getField(item, field) + '"').join(',')
            );

            downloadFile(
                'search-results.csv',
                [
                    ...getSearchConfiguration(),
                    '',
                    fields.join(','),
                    ...rows
                ].join('\r\n')
            );
        });
    };

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
            <Tooltip title="Download search results as csv">
                <IconButton
                    onClick={handleDownload}
                    disabled={
                        pagination.numberOfItems >
                        maximumNumberOfResultsToDownload
                    }
                >
                    <Download />
                </IconButton>
            </Tooltip>
        </MainContainer>
    );
};

export default ResourceOptions;
