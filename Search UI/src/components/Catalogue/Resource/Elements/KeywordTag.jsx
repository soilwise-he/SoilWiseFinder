'use client';

import { useEffect, useState } from 'react';

import ToolTip from 'components/UIElements/ToolTip';

const KeywordTag = ({ keyword, type, matchedKeywords, index }) => {
    const [isJavascriptEnabled, setIsJavascriptEnabled] = useState(false);

    useEffect(() => {
        setIsJavascriptEnabled(true);
    }, []);

    return isJavascriptEnabled ? (
        <ToolTip
            title={
                matchedKeywords && keyword in matchedKeywords ? (
                    <div>
                        <p>
                            This keyword is from the metadata and matched with
                            the Soil Vocabulary.
                        </p>
                        <p>{matchedKeywords[keyword]}</p>
                    </div>
                ) : (
                    'This keyword is from the metadata as is.'
                )
            }
        >
            <div
                className={`${index >= 3 ? 'collapsed collapsible-keyword' : ''} keyword ${type}`}
            >
                {keyword}
            </div>
        </ToolTip>
    ) : (
        <div
            className={`keyword ${type}`}
            title={
                matchedKeywords && keyword in matchedKeywords
                    ? `This keyword is from the metadata and matched with the Soil Vocabulary: ${matchedKeywords[keyword]}`
                    : 'This keyword is from the metadata as is.'
            }
        >
            {keyword}
        </div>
    );
};

export default KeywordTag;
