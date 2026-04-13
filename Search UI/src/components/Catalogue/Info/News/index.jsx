'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Container } from '@mui/material';

import useGetData from 'src/services/getData';
import NewsItem from './NewsItem';

const MainContainer = styled(Container)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 30px;
`;

const News = () => {
    const { getNews } = useGetData();
    const [news, setNews] = useState([]);

    useEffect(() => {
        getNews().then(data => {
            setNews(
                data.map(item => ({
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
                }))
            );
        });
    }, []);

    return (
        <MainContainer>
            {news.map((item, index) => (
                <NewsItem
                    item={item}
                    key={'news-' + index}
                />
            ))}
        </MainContainer>
    );
};

export default News;
