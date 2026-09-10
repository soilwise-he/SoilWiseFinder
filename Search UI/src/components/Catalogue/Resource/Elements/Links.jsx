import ToolTip from 'components/UIElements/ToolTip';

const Links = ({ data }) => {
    const getStatus = item => {
        let linkStatus = null;

        if (item.status_code >= 200 && item.status_code < 300) {
            linkStatus = 'ok';
        } else if (item.status_code >= 300 && item.status_code < 400) {
            linkStatus = 'redirected';
        } else if (item.status_code === 403) {
            linkStatus = 'unauthorized';
        } else if (item.status_code === 404) {
            linkStatus = 'not found';
        } else if (item.status_code > 400) {
            linkStatus = 'error';
        } else if (item.error) {
            linkStatus = 'cannot connect';
        }

        return linkStatus;
    };

    return (
        <div id="links">
            {data.map((item, index) => {
                let linkStatus = getStatus(item);

                return (
                    <ToolTip
                        key={'link-' + index}
                        title={
                            linkStatus && linkStatus !== 'cannot connect'
                                ? `The link is checked and returned status '${linkStatus}'.`
                                : `The link could not be checked because of '${linkStatus}'.`
                        }
                    >
                        <a
                            href={decodeURIComponent(item.url)}
                            className={`link ${linkStatus?.replaceAll(' ', '_')}`}
                            target="_blank"
                        >
                            {linkStatus
                                ? item.name || decodeURIComponent(item.url)
                                : 'checking url'}
                        </a>
                    </ToolTip>
                );
            })}
        </div>
    );
};

export default Links;
