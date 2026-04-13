'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import useGetData from 'src/services/getData';
import NewsItem from 'components/Catalogue/Info/News/NewsItem';

const MainContainer = styled.div`
    max-width: 330px;

    > a {
        display: block;
        height: 100%;
    }
`;

export default function News({ params }) {
    const { getNews } = useGetData();
    const [news, setNews] = useState([]);

    useEffect(() => {
        params.then(items => {
            getNews().then(data => {
                let item = data[parseInt(items.number) - 1];
                item = {
                    ...item,
                    summary:
                        item.summary.substring(0, 1) != '<'
                            ? '<p>' + item.summary + '</p>'
                            : item.summary,
                    tags: item.tags
                        .split(';')
                        .map(tag => '#' + tag.replace(/\s/g, ''))
                        .join(' '),
                    source: item.link.substring(
                        item.link.indexOf('//') + 2,
                        item.link.indexOf('/', item.link.indexOf('//') + 2)
                    )
                };

                setNews(<NewsItem item={item} />);
            });
        });
    }, []);

    return <MainContainer>{news}</MainContainer>;
}
