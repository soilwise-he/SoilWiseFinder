import styled from '@emotion/styled';

const ItemContainer = styled.a`
    flex: 1 1 30%;
    color: white;
    background-color: var(--mui-palette-secondary-main);
    border-radius: var(--mui-shape-borderRadius-1);
    border: 2px solid var(--mui-palette-secondary-main);
    padding: 10px 30px;

    h2 {
        color: white;
        font-size: 1rem;
    }

    span {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 4;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        white-space: normal;
        max-height: 90px;
    }

    &:hover {
        background-color: var(--mui-palette-primary-main);
        color: white;
    }
`;

const NewsItem = ({ item }) => {
    return (
        <ItemContainer
            key={item.link}
            href={item.link}
            target="_blank"
        >
            <h2>NEWS</h2>
            <i>{item.source}</i>
            {item.title && <h1>{item.title}</h1>}
            <span dangerouslySetInnerHTML={{ __html: item.summary }} />
            <p>{item.tags}</p>
        </ItemContainer>
    );
};

export default NewsItem;
