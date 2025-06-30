importScripts('client-zip/worker.js', 'dl-stream/worker.js');

async function* nameFile(responses, names) {
    for await (const response of responses) {
        yield {input: response, name: names.next().value};
    }
}

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    // This will intercept all request with a URL starting in /downloadZip/
    // eslint-disable-next-line no-sparse-arrays
    const [, name] = url.pathname.match(/\/downloadZip\/(.+)/i) || [,];
    if (url.origin === self.origin && name && name !== 'keep-alive') {
        event.respondWith(
            event.request.formData().then(async (data) => {
                let sumContentLengths = 0;

                // if sum of content-lengths is given, trust it
                // else we try to sum up the content-lengths ourselves at the cost of additional runtime
                if (data.has('sumContentLengths')) {
                    sumContentLengths = parseInt(data.get('sumContentLengths'));
                    data.delete('sumContentLengths');
                } else {
                    for (const item of data.values()) {
                        await fetch(item, {method: 'HEAD'}).then(
                            (r) => (sumContentLengths += parseInt(r.headers.get('Content-Length'))),
                        );
                    }
                }

                // ignore undef errors, as the global definitions are not tracked by default
                // works as expected: https://github.com/eslint/eslint/issues/16904
                // eslint-disable-next-line no-undef
                return downloadZip(
                    // eslint-disable-next-line no-undef
                    nameFile(new DownloadStream(data.values(), {highWaterMark: 1}), data.keys()),
                    {length: sumContentLengths},
                );
            }),
        );
    }
});
