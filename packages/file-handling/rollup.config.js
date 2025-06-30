import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import {getPackagePath, getDistPath} from '@dbp-toolkit/dev-utils';
import process from 'node:process';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);

export default (async () => {
    return {
        input:
            build !== 'test'
                ? [
                      'src/demo.js',
                      'src/stream-sw.js',
                      'src/dbp-file-source.js',
                      'src/dbp-file-sink.js',
                      'src/dbp-clipboard.js',
                      'src/dbp-nextcloud-file-picker.js',
                  ]
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
            resolve({browser: true}),
            commonjs(),
            json(),
            build !== 'local' && build !== 'test' ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},
                    {src: 'assets/favicon.ico', dest: 'dist'},
                    {
                        src: await getPackagePath('@dbp-toolkit/common', 'assets/icons/*.svg'),
                        dest: 'dist/' + (await getDistPath('@dbp-toolkit/common', 'icons')),
                    },
                    {
                        src: await getPackagePath('tabulator-tables', 'dist/css'),
                        dest: 'dist/' + (await getDistPath(pkg.name, 'tabulator-tables')),
                    },
                    {
                        src: await getPackagePath('client-zip', 'worker.js'),
                        dest: 'dist/' + (await getDistPath(pkg.name, 'client-zip')),
                    },
                    {
                        src: await getPackagePath('dl-stream', 'worker.js'),
                        dest: 'dist/' + (await getDistPath(pkg.name, 'dl-stream')),
                    },
                ],
            }),
            process.env.ROLLUP_WATCH === 'true'
                ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
                : false,
        ],
    };
})();
