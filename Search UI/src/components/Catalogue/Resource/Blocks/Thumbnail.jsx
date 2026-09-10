import HTMLMap from 'src/components/Map/HTMLMap';
import ToolTip from 'components/UIElements/ToolTip';
import { mapParameters } from 'src/services/settings';

const Thumbnail = ({ document }) => {
    let thumbnails = [];

    if (document.thumbnail) {
        thumbnails.push(
            <img
                key="thumbnail-image"
                src={document.thumbnail}
                alt="thumbnail"
            />
        );
    }

    if (document.spatial) {
        let map = (
            <HTMLMap
                data={{
                    wktFeature: document.spatial,
                    crs: mapParameters.dataProjection
                }}
                key="map"
            />
        );

        if ('spatial' in document.augments) {
            map = (
                <ToolTip
                    title={`This metadata value is augmented. The original bounding box is ${document.augments.spatial.original}.`}
                >
                    <div className={'augmented'}>{map}</div>
                </ToolTip>
            );
        }

        thumbnails.push(map);
    }

    return (
        thumbnails.length > 0 && (
            <div
                id="thumbnail"
                className="block-container"
            >
                {thumbnails.map((thumbnail, index) => (
                    <div
                        key={'thumbnail-' + index}
                        className="thumbnail"
                    >
                        {thumbnail}
                    </div>
                ))}
            </div>
        )
    );
};

export default Thumbnail;
