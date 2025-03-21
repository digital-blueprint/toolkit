/**
 * Send a fetch to given url with given options
 * @param url
 * @param options
 * @returns {Promise<object>} response (error or result)
 */
export const httpGetAsync = async (url, options) => {
    let response = await fetch(url, options)
        .then((result) => {
            if (!result.ok) throw result;
            return result;
        })
        .catch((error) => {
            return error;
        });

    return response;
};
