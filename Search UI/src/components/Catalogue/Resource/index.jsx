import FullDisplay from './Displays/Full';
import ColumnDisplay from './Displays/Column';
import SummarizedDisplay from './Displays/Summarized';

export const displayTypes = {
    column: 'Show all document elements in one column.',
    full: 'Optimal arrangement of elements to see everything in one screen.',
    summarized:
        'Same as column but where the similar resources and thumbnails are hidden'
};

export function Resource({ document, displayType }) {
    if (!document) return <div>No resource with this identifier</div>;

    if (!document.identifier) return <div>Resource has no identifier</div>;

    switch (displayType) {
        case displayTypes.full:
            return <FullDisplay document={document} />;
        case displayTypes.column:
            return <ColumnDisplay document={document} />;
        case displayTypes.summarized:
            return <SummarizedDisplay document={document} />;
        default:
            return null;
    }
}
