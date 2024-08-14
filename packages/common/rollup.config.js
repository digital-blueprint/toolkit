import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import json from '@rollup/plugin-json';
import {getDistPath} from '@dbp-toolkit/dev-utils';
import { createRequire } from "node:module";
import process from 'node:process';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);

export default (async () => {
    return {
        input: build != 'test' ? ['demo.js', 'components.js'] : globSync('test/**/*.js'),
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
            copy({
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},
                    {
                        src: 'assets/icons/*.svg',
                        dest: 'dist/' + (await getDistPath(pkg.name, 'icons')),
                    },
                ],
            }),
            process.env.ROLLUP_WATCH === 'true'
                ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
                : false,
        ],
    };
})();
