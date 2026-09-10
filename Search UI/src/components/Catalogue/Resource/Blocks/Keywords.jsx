import KeywordTag from '../Elements/KeywordTag';
import ToggleButton from '../Elements/ToggleButton';

const Keywords = ({ originalKeywords, matchedKeywords }) => {
    if (!originalKeywords) return;

    let uniqueKeywords = originalKeywords.reduce(
        (uniqueKeywords, currentKeyword) => {
            uniqueKeywords[currentKeyword] = 'original';

            return uniqueKeywords;
        },
        {}
    );

    if (matchedKeywords) {
        uniqueKeywords = Object.keys(matchedKeywords).reduce(
            (uniqueKeywords, currentKeyword) => {
                if (currentKeyword in uniqueKeywords) {
                    uniqueKeywords[currentKeyword] = 'original_and_matched';
                } else {
                    uniqueKeywords[currentKeyword] = 'matched';
                }

                return uniqueKeywords;
            },
            uniqueKeywords
        );
    }

    let keywords = Object.entries(uniqueKeywords).sort((a, b) => {
        if (a[1] === 'matched' && b[1] !== 'matched') {
            return -1;
        } else if (a[1] !== 'matched' && b[1] === 'matched') {
            return 1;
        } else if (a[1] === 'original_and_matched' && b[1] === 'original') {
            return -1;
        } else if (a[1] === 'original' && b[1] === 'original_and_matched') {
            return 1;
        } else {
            return b[0] > a[0];
        }
    });

    return (
        <div
            key="keyword-list"
            id="keyword-list"
        >
            {keywords.map(([keyword, type], index) => (
                <KeywordTag
                    key={keyword + '_' + type}
                    keyword={keyword}
                    type={type}
                    matchedKeywords={matchedKeywords}
                    index={index}
                />
            ))}
            {<ToggleButton className="collapsible-keyword" />}
        </div>
    );
};

export default Keywords;
