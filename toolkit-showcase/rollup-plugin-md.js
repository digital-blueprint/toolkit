// SPDX-Identifier: ISC
// Fork of abandoned https://github.com/xiaofuzi/rollup-plugin-md to support newer rollup

import {Marked} from 'marked';
import {markedHighlight} from 'marked-highlight';
import hljs from 'highlight.js';

const ext = /\.md$/;

export default function md(options = {}) {
    const marked = new Marked(
        markedHighlight({
            emptyLangClass: 'hljs',
            langPrefix: 'hljs language-',
            highlight(code, lang, info) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, {language}).value;
            },
        }),
    );

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

                const data = marked.parse(md);
                return {
                    code: `export default ${JSON.stringify(data.toString())};`,
                    map: {mappings: ''},
                };
            },
        },
    };
}
