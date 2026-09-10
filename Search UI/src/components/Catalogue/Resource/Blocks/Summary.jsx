import ToggleButton from '../Elements/ToggleButton';

const Summary = ({ title, abstract }) => {
    return (
        <div id="summary">
            <h1
                key="title"
                dangerouslySetInnerHTML={{ __html: title }}
                id="title"
                className="summary collapsed"
            />
            {abstract && (
                <div>
                    <div
                        key="abstract-text"
                        dangerouslySetInnerHTML={{
                            __html: abstract
                        }}
                        id="abstract"
                        className="summary collapsed"
                    />
                </div>
            )}
            {(title.length > 75 || abstract.length > 250) && (
                <ToggleButton className="summary" />
            )}
        </div>
    );
};

export default Summary;
