import { Close, Compare } from '@mui/icons-material';
import StatusIndicator from 'components/UIElements/StatusIndicator';

import ToolTip from 'components/UIElements/ToolTip';
import { fieldDefinitions } from 'src/services/settings';
import { getDate } from 'src/services/util';

const Augmentations = ({ augments }) => {
    let modal = (
        <div
            id="augmentations-modal"
            key="augmentations-modal"
        >
            <a
                className="modal_close"
                href="#"
            >
                <Close />
            </a>
            <h2>Comparison between augmented and original metadata</h2>
            <table>
                <thead>
                    <tr>
                        <th>Metadata property</th>
                        <th>Augmented value</th>
                        <th>Original value</th>
                        <th>Augmentation process</th>
                        <th>Processed on</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(augments).map(
                        ([property, augmentation]) => {
                            return (
                                <tr key={property}>
                                    <td>{fieldDefinitions[property]?.label}</td>
                                    <td className="value">
                                        {augmentation.target}
                                    </td>
                                    <td className="value">
                                        {augmentation.original}
                                    </td>
                                    <td>
                                        {augmentation.process.replaceAll(
                                            '-',
                                            ' '
                                        )}
                                    </td>
                                    <td>{getDate(augmentation.date)}</td>
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="augmentations">
            <ToolTip
                title="Compare augmented data with original data"
                key="augmentations-toggle"
            >
                <a
                    href="#augmentations-modal"
                    id="augmentations-toggle"
                >
                    <Compare />
                </a>
            </ToolTip>
            {modal}
            {'completeness' in augments && (
                <StatusIndicator
                    percentage={parseFloat(
                        augments.completeness.target
                    ).toFixed(0)}
                    helperText={
                        <div>
                            <p>
                                {`The metadata of this record is
                                ${parseFloat(
                                    augments.completeness.target
                                ).toFixed(0)}
                                % complete.`}
                            </p>
                            <p>{fieldDefinitions.completeness.description}</p>
                        </div>
                    }
                />
            )}
        </div>
    );
};

export default Augmentations;
