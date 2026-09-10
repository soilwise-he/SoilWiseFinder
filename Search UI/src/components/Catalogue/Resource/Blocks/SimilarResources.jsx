'use client';

import SimilarResource from '../Elements/SimilarResource';

const SimilarResources = ({ document }) => {
    if (!document.similarResources) return;

    return (
        <div id="similar-resources-container">
            <div className="similar-resources-title">Similar resources</div>
            {document.similarResources.map((item, index) => (
                <SimilarResource
                    key={'similar-resource-' + index}
                    document={item}
                />
            ))}
        </div>
    );
};

export default SimilarResources;
