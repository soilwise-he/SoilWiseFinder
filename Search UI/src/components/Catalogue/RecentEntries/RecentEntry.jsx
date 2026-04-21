'use client';

import styled from '@emotion/styled';

import { getDate } from 'src/services/util';
import { paths } from '../../../services/settings';

const ItemContainer = styled.a`
    flex: 1 1 30%;
    color: white;
    background-color: var(--mui-palette-secondary-main);
    border-radius: var(--mui-shape-borderRadius-1);
    border: 2px solid var(--mui-palette-secondary-main);
    padding: 10px 30px;

    h1 {
        color: white;
        font-size: 1.3rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        margin-top: 30px;
    }

    h2 {
        color: white;
        font-size: 1rem;
    }

    p {
        color: white;
        width: 100%;
        text-align: center;
        background-color: var(--mui-palette-primary-main);
        border: 1px solid var(--mui-palette-primary-main);
        border-radius: var(--mui-shape-borderRadius-1);
        padding: 5px;
    }

    &:hover {
        background-color: var(--mui-palette-primary-main);
        color: white;

        p {
            background-color: var(--mui-palette-secondary-main);
        }
    }
`;

const RecentEntry = ({ item }) => {
    return (
        <ItemContainer
            key={item.identifier}
            href={`${paths.catalogueResource}/${item.identifier}`}
            target="_blank"
        >
            <h2>RECENT ENTRY</h2>
            <i>{getDate(item.date)}</i>
            <h1>{item.title}</h1>
            {item.type && <p>{item.type}</p>}
        </ItemContainer>
    );
};

export default RecentEntry;
