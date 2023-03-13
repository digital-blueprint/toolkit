import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import url from '@rollup/plugin-url';
import del from 'rollup-plugin-delete';

const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);

export default {
    input:
        build != 'test'
            ? ['src/dbp-pdf-viewer.js', 'src/dbp-pdf-viewer-demo.js']
            : globSync('test/**/*.js'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].[format].js',
        format: 'esm',
        sourcemap: true,
    },
    plugins: [
        del({
            targets: 'dist/*',
        }),
        resolve(),
        commonjs(),
        json(),
        url({
            limit: 0,
            emitFiles: true,
            fileName: 'shared/[name].[hash][extname]',
        }),
        build !== 'local' && build !== 'test' ? terser() : false,
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist'},
                {src: 'assets/favicon.ico', dest: 'dist'},
                {
                    // src: await getPackagePath('pdfjs-dist', 'build/pdf.worker.js'),
                    src: await getPackagePath('pdfjs-dist', 'legacy/build/pdf.worker.js'),
                    dest: 'dist/' + (await getDistPath(pkg.name, 'pdfjs')),
                },
                // {
                //     src: await getPackagePath('pdfjs-dist', 'cmaps/*'),
                //     dest: 'dist/' + (await getDistPath(pkg.name, 'pdfjs')),
                // }, // do we want all map files?
            ],
        }),
        process.env.ROLLUP_WATCH === 'true'
            ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
            : false,
    ],
};
