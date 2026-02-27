importScripts('client-zip/worker.js', 'dl-stream/worker.js');

async function* nameFile(responses, names) {
    for await (const response of responses) {
        yield {input: response, name: names.next().value};
    }
}

async function* appendFiles(stream, files) {
    for await (const item of stream) {
        yield item;
    }
    for (const file of files) {
        yield file;
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
                let files = [];
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
                    requests = Array.from(data.values(), (data) => {
                        if (data instanceof File) {
                            files.push(data);
                            return undefined;
                        } else return new Request(data, {headers: {Authorization: auth}});
                    }).filter((x) => x !== undefined);
                } else {
                    requests = Array.from(data.values(), (data) => new Request(data));
                }

                // if sum of content-lengths is given, trust it
                // else we try to sum up the content-lengths ourselves at the cost of additional runtime
                if (sumContentLengths === -1) {
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

                // put filenames into array in the correct order, thus we need two loops
                let filenames = [];
                data.forEach((value, key) => {
                    if (!(value instanceof File)) {
                        filenames.push(key);
                    }
                });
                data.forEach((value, key) => {
                    if (value instanceof File) {
                        filenames.push(value.name);
                    }
                });

                // Notify the client that streaming has begun
                // includeUncontrolled is required because the SW may not yet control the page
                const clients = await self.clients.matchAll({
                    type: 'window',
                    includeUncontrolled: true,
                });
                clients.forEach((client) => client.postMessage({type: 'DOWNLOAD_STARTED'}));

                // ignore undef errors, as the global definitions are not tracked by default
                // works as expected: https://github.com/eslint/eslint/issues/16904
                // eslint-disable-next-line no-undef
                return downloadZip(
                    nameFile(
                        // eslint-disable-next-line no-undef
                        appendFiles(new DownloadStream(requests, {highWaterMark: 1}), files),
                        filenames[Symbol.iterator](),
                    ),
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
