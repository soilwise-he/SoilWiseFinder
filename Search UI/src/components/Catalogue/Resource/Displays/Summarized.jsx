import Keywords from '../Blocks/Keywords';
import MainProperties from '../Blocks/MainProperties';
import Summary from '../Blocks/Summary';

const SummarizedDisplay = ({ document }) => {
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
        </div>
    );
};

export default SummarizedDisplay;
