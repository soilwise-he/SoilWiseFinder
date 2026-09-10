'use client';

import { getDate, isDate } from 'src/services/util';
import ToolTip from 'components/UIElements/ToolTip';
import { fieldDefinitions } from 'src/services/settings';
import Augmentations from '../Elements/Augmentations';

const MainProperties = ({ document }) => {
    return (
        <div
            id="main-properties"
            className="block-container"
        >
            <div>
                {[
                    'type',
                    'date',
                    'language',
                    'spatial_description',
                    'license',
                    'source',
                    'soilmission',
                    'european_funded'
                ].map(field => {
                    let value = null;

                    if (document[field]) {
                        value = (
                            <span
                                className={
                                    field in document.augments
                                        ? 'augmented'
                                        : ''
                                }
                            >
                                {isDate(document[field])
                                    ? getDate(document[field])
                                    : document[field]}
                            </span>
                        );

                        if (field in document.augments) {
                            if (document.augments[field].original) {
                                value = (
                                    <ToolTip
                                        title={`This metadata value is augmented. The original value is '${document.augments[field].original}'.`}
                                        className="tag"
                                    >
                                        {value}
                                    </ToolTip>
                                );
                            }
                        }
                    } else if (document.augments[field]) {
                        value = (
                            <ToolTip
                                title={`This metadata value is augmented.`}
                            >
                                <span className={'augmented'}>
                                    {document.augments[field].target}
                                </span>
                            </ToolTip>
                        );
                    }

                    return (
                        value && (
                            <p
                                key={field}
                                className="main-property"
                            >
                                <b>
                                    <ToolTip
                                        title={
                                            fieldDefinitions[field].description
                                        }
                                        key={field}
                                    >
                                        {fieldDefinitions[field].label +
                                            (typeof document[field] ===
                                            'boolean'
                                                ? ''
                                                : ': ')}
                                    </ToolTip>
                                </b>
                                {value}
                            </p>
                        )
                    );
                })}
            </div>
            {document.augments && (
                <Augmentations augments={document.augments} />
            )}
        </div>
    );
};

export default MainProperties;
