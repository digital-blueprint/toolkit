import process from 'node:process';
import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import url from '@rollup/plugin-url';
import del from 'rollup-plugin-delete';
import {createRequire} from 'node:module';
import {getCopyTargets, getUrlOptions} from '@dbp-toolkit/dev-utils';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);

export default (async () => {
    return {
        input:
            build != 'test'
                ? ['src/dbp-person-select.js', 'src/dbp-person-select-demo.js']
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
            url(await getUrlOptions(pkg.name, 'shared')),
            json(),
            build !== 'local' && build !== 'test' ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/silent-check-sso.html', dest: 'dist'},
                    {src: 'assets/index.html', dest: 'dist'},
                    ...(await getCopyTargets(pkg.name, 'dist')),
                ],
            }),
            process.env.ROLLUP_WATCH === 'true'
                ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
                : false,
        ],
    };
})();
