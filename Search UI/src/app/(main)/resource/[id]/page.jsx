import { Resource as ResourceComponent } from 'components/Catalogue/Resource';
import { fetchExternalData } from 'src/services/getData';
import { getBaseUrlApi } from 'src/services/settings';

export default async function Resource({ params }) {
    let requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    let { id } = await params;
    let document = await fetch(`${getBaseUrlApi()}/solr/search`, {
        method: 'POST',
        headers: requestHeaders,
        credentials: 'omit',
        redirect: 'follow',
        body: JSON.stringify({
            query: `identifier:${decodeURIComponent(id)}`,
            params: {
                mm: '2<75%',
                qf: `identifier`,
                defType: 'edismax'
            }
        })
    })
        .then(response => {
            return response.json();
        })
        .then(response => {
            return response.response.docs[0];
        })
        .catch(error => {
            console.log(error);
        });

    await fetch(`${getBaseUrlApi()}/solr/search`, {
        method: 'POST',
        headers: requestHeaders,
        credentials: 'omit',
        redirect: 'follow',
        body: JSON.stringify({
            query: `{!mlt fl=title,type,language,license,projects,sources,temporal_range,spatial mintf=1 maxdfpct=50}${decodeURIComponent(id)}`,
            params: {
                rows: 3,
                spellcheck: false
            }
        })
    })
        .then(response => {
            return response.json();
        })
        .then(response => {
            document.similarResources = response.response.docs;
        })
        .catch(error => {
            console.log(error);
        });

    await fetchExternalData(`util/augments/${document.identifier}`).then(
        response => {
            document.augments = Object.fromEntries(
                response.map(item => [item.property, item])
            );
        }
    );

    if (document.links) {
        document.links = await Promise.all(
            document.links.map(async item => {
                let link = JSON.parse(item);
                const data = await fetchExternalData('linky/check-url', {
                    url: decodeURIComponent(link.url),
                    check_ogc_capabilities: false
                });

                return {
                    ...data,
                    name: link.name
                };
            })
        );
    }

    if (document.matched_subjects) {
        let descriptions = await Promise.all(
            document.matched_subjects.map(keyword =>
                fetchExternalData(
                    `vocab/api/v1/concepts/${keyword.replaceAll(' ', '')}`
                )
            )
        );

        document.matched_subjects = Object.fromEntries(
            document.matched_subjects.map((keyword, index) => [
                keyword,
                descriptions[index].definitions?.[0]?.text
            ])
        );
    }

    return ResourceComponent({ document });
}
