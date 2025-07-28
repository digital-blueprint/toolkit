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
                let requests;
                let auth = null;
                let sumContentLengths = -1;

                // check meta information given to the sw, and set it if necessary
                if (data.has('authorization')) {
                    auth = data.get('authorization');
                    data.delete('authorization');
                }
                if (data.has('sumContentLengths')) {
                    sumContentLengths = parseInt(data.get('sumContentLengths'));
                    data.delete('sumContentLengths');
                }

                // only send Authorization headers if necessary
                if (auth != null) {
                    requests = Array.from(
                        data.values(),
                        (data) => new Request(data, {headers: {Authorization: auth}}),
                    );
                } else {
                    requests = Array.from(data.values(), (data) => new Request(data));
                }

                // if sum of content-lengths is given, trust it
                // else we try to sum up the content-lengths ourselves at the cost of additional runtime
                if (sumContentLengths == -1) {
                    for (const item of data.values()) {
                        let init = {method: 'HEAD'};
                        if (auth != null) {
                            init['headers'] = {Authorization: auth};
                        }
                        await fetch(item, init).then(
                            (r) => (sumContentLengths += parseInt(r.headers.get('Content-Length'))),
                        );
                    }
                }

                // ignore undef errors, as the global definitions are not tracked by default
                // works as expected: https://github.com/eslint/eslint/issues/16904
                // eslint-disable-next-line no-undef
                return downloadZip(
                    // eslint-disable-next-line no-undef
                    nameFile(new DownloadStream(requests, {highWaterMark: 1}), data.keys()),
                    {length: sumContentLengths},
                );
            }),
        );
    }
});

// for some reason, in Firefox (tested on version 140.0.2) the fetch event listener is not enough
// to keep the sw alive, even when periodically fetching something.
// thus, we register a "message" event listener and periodically send messages
self.addEventListener('message', (event) => {});
