import { getDetailsPageUrl } from 'src/services/settings';
import { getDate } from 'src/services/util';

const SimilarResource = ({ document }) => {
    const subtitle = () => {
        let result = [];
        let data = document.view_authors || document.view_contacts;

        if (data) {
            let names = data.reduce((result, currentItem) => {
                currentItem = JSON.parse(currentItem);

                if (
                    currentItem.person &&
                    !result.includes(currentItem.person)
                ) {
                    result.push(currentItem.person);
                } else if (
                    currentItem.organization &&
                    !result.includes(currentItem.organization)
                ) {
                    result.push(currentItem.organization);
                }

                return result;
            }, []);

            result.push(
                names.length > 3 ? names[0] + ' et al.' : names.join(' &bull; ')
            );
        }

        if (document.type) result.push(document.type);

        if (document.date) result.push(getDate(document.date));

        return result.join(' - ');
    };

    return (
        <a
            className="similar-resource"
            key={document.identifier}
            href={getDetailsPageUrl(document.identifier, true)}
            target="_blank"
        >
            <h3
                className="title"
                dangerouslySetInnerHTML={{
                    __html: document.title
                }}
            />
            <p className="subtitle">{subtitle()}</p>
            <p
                className="abstract"
                dangerouslySetInnerHTML={{
                    __html: document.abstract
                }}
            />
        </a>
    );
};

export default SimilarResource;
