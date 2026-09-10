import Keywords from '../Blocks/Keywords';
import MainProperties from '../Blocks/MainProperties';
import Properties from '../Blocks/Properties';
import SimilarResources from '../Blocks/SimilarResources';
import Summary from '../Blocks/Summary';
import Thumbnail from '../Blocks/Thumbnail';

const ColumnDisplay = ({ document }) => {
    return (
        <div
            id="main-container"
            className="vertical"
        >
            <div className="block-container">
                <Summary
                    title={document.title}
                    abstract={document.abstract}
                />
                <Keywords
                    originalKeywords={document.subjects}
                    matchedKeywords={document.matched_subjects}
                />
            </div>
            <MainProperties document={document} />
            <Thumbnail document={document} />
            <Properties document={document} />
            {document.similarResources?.length > 0 && (
                <SimilarResources document={document} />
            )}
        </div>
    );
};

export default ColumnDisplay;
