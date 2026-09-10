'use client';

import { useMediaQuery } from '@mui/material';
import Keywords from '../Blocks/Keywords';
import MainProperties from '../Blocks/MainProperties';
import Properties from '../Blocks/Properties';
import SimilarResources from '../Blocks/SimilarResources';
import Summary from '../Blocks/Summary';
import Thumbnail from '../Blocks/Thumbnail';
import muiTheme from 'src/style/theme';
import ColumnDisplay from './Column';

const FullDisplay = ({ document }) => {
    if (useMediaQuery(muiTheme.breakpoints.down('md')))
        return <ColumnDisplay document={document} />;

    return (
        <div
            id="main-container"
            className="horizontal"
        >
            <div id="left-side-container">
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
                {document.similarResources?.length > 0 && (
                    <SimilarResources document={document} />
                )}
            </div>
            <div id="right-side-container">
                <MainProperties document={document} />
                <Thumbnail document={document} />
                <Properties document={document} />
            </div>
        </div>
    );
};

export default FullDisplay;
