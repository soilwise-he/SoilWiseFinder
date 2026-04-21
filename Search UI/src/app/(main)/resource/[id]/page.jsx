import { headers } from 'next/headers';

import { Resource as ResourceComponent } from 'components/Catalogue/Resource';
import { getBaseUrlApi } from 'src/services/settings';

export default async function Resource({ params }) {
    let requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');

    const { headers: headersList } = await headers();
    let { id } = await params;
    let document = await fetch(
        `${getBaseUrlApi(headersList.host)}/solr/search`,
        {
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
        }
    )
        .then(response => {
            return response.json();
        })
        .then(response => {
            return response.response.docs[0];
        });

    return ResourceComponent(document);
}
