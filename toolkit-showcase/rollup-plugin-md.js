// SPDX-Identifier: ISC
// Fork of abandoned https://github.com/xiaofuzi/rollup-plugin-md to support newer rollup

import {marked} from 'marked';

const ext = /\.md$/;

export default function md(options = {}) {
    if (options.marked) {
        marked.setOptions(options.marked);
    }
    return {
        name: 'md',

        transform: {
            filter: {
                id: {
                    include: options.include || ['**/*.md'],
                    exclude: options.exclude,
                },
            },
            handler: function (md, id) {
                if (!ext.test(id)) return null;

                const data = options.marked === false ? md : marked(md);
                return {
                    code: `export default ${JSON.stringify(data.toString())};`,
                    map: {mappings: ''},
                };
            },
        },
    };
}
