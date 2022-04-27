/**
 * @param {string} url
 * @param {string} token
 * @returns {Array}
 */
export async function getCollection(url, token) {
    let response = await fetch(url, {
        headers: {
            'Content-Type': 'application/ld+json',
            Authorization: 'Bearer ' + token,
        },
    });

    if (!response.ok) {
        console.log("url", url);
        throw new Error(response.statusText);
    }

    let data = await response.json();

    return data['hydra:member'];
}
