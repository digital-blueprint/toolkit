// SPDX-Identifier: ISC
// Fork of abandoned https://github.com/xiaofuzi/rollup-plugin-md to support newer rollup

import fs from 'node:fs';
import path from 'node:path';
import {Marked} from 'marked';
import {markedHighlight} from 'marked-highlight';
import hljs from 'highlight.js';

const ext = /\.md$/;

// Maximum amount of linked documents that get pulled in, just to be safe
const MAX_DOCUMENTS = 50;

/**
 * The document that is currently being parsed. Needed because the marked renderer
 * has no other way of knowing which file a link originates from. Parsing is
 * synchronous, so a module global is fine here.
 *
 * @type {{dir: string, register: function(string): string, registerImage: function(string): (string|null)}|null}
 */
let parseContext = null;

function escapeAttribute(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Checks if a markdown link points to another markdown file next to the current one.
 *
 * @param {string} href The link target
 * @returns {boolean} true if it is a relative link to a markdown file
 */
function isRelativeMarkdownLink(href) {
    if (!href) return false;
    // Skip absolute URLs, protocol relative URLs, root relative URLs and pure anchors
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return false;
    if (href.startsWith('//') || href.startsWith('/') || href.startsWith('#')) return false;
    return /\.md$/i.test(href.split('#')[0].split('?')[0]);
}

/**
 * Checks if a markdown image points to a relative file next to the current document.
 *
 * @param {string} href The image source
 * @returns {boolean} true if it is a relative image reference
 */
function isRelativeImage(href) {
    if (!href) return false;
    // Skip absolute URLs, protocol relative URLs, root relative URLs and data URLs
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return false;
    if (href.startsWith('//') || href.startsWith('/') || href.startsWith('#')) return false;
    return true;
}

/**
 * Builds a stable and attribute/URL safe ID for a linked document.
 *
 * @param {string} relativePath The document path relative to the main document
 * @returns {string} The ID
 */
function createDocumentId(relativePath) {
    return relativePath
        .replace(/\\/g, '/')
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

function createMarked() {
    return new Marked(
        markedHighlight({
            emptyLangClass: 'hljs',
            langPrefix: 'hljs language-',
            highlight(code, lang, info) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, {language}).value;
            },
        }),
        {
            renderer: {
                image(token) {
                    const text = escapeAttribute(token.text ?? '');
                    const title = token.title ? ` title="${escapeAttribute(token.title)}"` : '';

                    if (parseContext !== null && isRelativeImage(token.href)) {
                        const placeholder = parseContext.registerImage(token.href);
                        if (placeholder !== null) {
                            // The placeholder is replaced with the emitted asset URL later.
                            return `<img src="${placeholder}" alt="${text}"${title}>`;
                        }
                    }

                    return `<img src="${escapeAttribute(token.href)}" alt="${text}"${title}>`;
                },
                link(token) {
                    const text = this.parser.parseInline(token.tokens);
                    const title = token.title ? ` title="${escapeAttribute(token.title)}"` : '';

                    if (parseContext !== null && isRelativeMarkdownLink(token.href)) {
                        const relative = token.href.split('#')[0].split('?')[0];
                        const target = path.resolve(parseContext.dir, relative);
                        if (fs.existsSync(target)) {
                            const documentId = parseContext.register(target);
                            // The document is embedded in the same page, the ID is
                            // resolved by the markdown web component.
                            return (
                                `<a href="#${escapeAttribute(documentId)}"` +
                                ` data-markdown-link="${escapeAttribute(documentId)}"${title}>` +
                                `${text}</a>`
                            );
                        }
                    }

                    return `<a href="${escapeAttribute(token.href)}"${title}>${text}</a>`;
                },
            },
        },
    );
}

/**
 * Wraps the rendered HTML of one document so the web component can show/hide it.
 *
 * @param {string} documentId The document ID, empty for the main document
 * @param {string} name The human readable document name
 * @param {string} content The rendered HTML
 * @returns {string} The wrapped HTML
 */
function wrapDocument(documentId, name, content) {
    const hidden = documentId === '' ? '' : ' hidden';
    return (
        `<div class="markdown-document" data-markdown-document="${escapeAttribute(documentId)}"` +
        ` data-markdown-name="${escapeAttribute(name)}"${hidden}>\n${content}\n</div>\n`
    );
}

export default function md(options = {}) {
    const marked = createMarked();

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

                const mainPath = path.resolve(id);
                const mainDir = path.dirname(mainPath);

                // Maps absolute file paths to document IDs, the main document has an empty ID
                const documentIds = new Map([[mainPath, '']]);
                const queue = [];

                const register = (absolutePath) => {
                    if (documentIds.has(absolutePath)) {
                        return documentIds.get(absolutePath);
                    }
                    const relative = path.relative(mainDir, absolutePath);
                    const documentId = createDocumentId(relative);
                    documentIds.set(absolutePath, documentId);
                    queue.push({absolutePath, documentId, name: relative});
                    return documentId;
                };

                // Maps absolute image paths to the emitted asset reference id, so the same
                // image is only emitted once. The placeholders are replaced with the final
                // asset URLs after parsing has finished.
                const imageReferences = new Map();
                const emitFile = this.emitFile.bind(this);
                const addWatchFile = this.addWatchFile.bind(this);

                const registerImage = (href) => {
                    const cleaned = href.split('#')[0].split('?')[0];
                    const absolutePath = path.resolve(parseContext.dir, cleaned);
                    if (!fs.existsSync(absolutePath)) {
                        return null;
                    }
                    if (!imageReferences.has(absolutePath)) {
                        addWatchFile(absolutePath);
                        const referenceId = emitFile({
                            type: 'asset',
                            name: path.basename(absolutePath),
                            source: fs.readFileSync(absolutePath),
                        });
                        imageReferences.set(absolutePath, referenceId);
                    }
                    return `\0md-image:${imageReferences.get(absolutePath)}\0`;
                };

                let output;
                try {
                    parseContext = {dir: mainDir, register, registerImage};
                    output = wrapDocument('', path.basename(mainPath), marked.parse(md).toString());

                    // Linked documents may link to further documents, so keep going
                    let count = 0;
                    while (queue.length > 0 && count < MAX_DOCUMENTS) {
                        const doc = queue.shift();
                        count++;
                        this.addWatchFile(doc.absolutePath);
                        const content = fs.readFileSync(doc.absolutePath, 'utf8');
                        parseContext = {
                            dir: path.dirname(doc.absolutePath),
                            register,
                            registerImage,
                        };
                        output += wrapDocument(
                            doc.documentId,
                            doc.name,
                            marked.parse(content).toString(),
                        );
                    }
                } finally {
                    parseContext = null;
                }

                // Build the module code. If images were emitted, splice their final URLs
                // (resolved by the bundler via import.meta.ROLLUP_FILE_URL_*) into the string.
                const placeholder = /\0md-image:([\w$]+)\0/g;
                let code;
                if (imageReferences.size === 0) {
                    code = `export default ${JSON.stringify(output)};`;
                } else {
                    let expression = '';
                    let lastIndex = 0;
                    let match;
                    while ((match = placeholder.exec(output)) !== null) {
                        const literal = output.slice(lastIndex, match.index);
                        expression += `${JSON.stringify(literal)} + import.meta.ROLLUP_FILE_URL_${match[1]} + `;
                        lastIndex = placeholder.lastIndex;
                    }
                    expression += JSON.stringify(output.slice(lastIndex));
                    code = `export default ${expression};`;
                }

                return {
                    code,
                    map: {mappings: ''},
                };
            },
        },
    };
}
