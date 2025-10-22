import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import {assetPlugin} from '@dbp-toolkit/dev-utils';
import process from 'node:process';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);
let isRolldown = process.argv.some((arg) => arg.includes('rolldown'));
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';

export default (async () => {
    return {
        input:
            build != 'test'
                ? ['src/dbp-resource-select.js', 'src/dbp-resource-select-demo.js']
                : globSync('test/**/*.js'),
        output: {
            dir: 'dist',
            entryFileNames: '[name].js',
            chunkFileNames: 'shared/[name].[hash].js',
            format: 'esm',
            sourcemap: true,
            ...(isRolldown ? {minify: buildFull} : {}),
        },
        moduleTypes: {
            '.css': 'js', // work around rolldown handling the CSS import before the URL plugin cab
        },
        external: build == 'test' ? ['vitest'] : [],
        plugins: [
            del({
                targets: 'dist/*',
            }),
            !isRolldown && resolve({browser: true}),
            !isRolldown && commonjs(),
            await assetPlugin(pkg.name, 'dist'),
            !isRolldown && json(),
            buildFull && !isRolldown ? terser() : false,
            copy({
                copySync: true,
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},
                    {src: 'assets/silent-check-sso.html', dest: 'dist'},
                ],
            }),
            process.env.ROLLUP_WATCH === 'true'
                ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
                : false,
        ],
    };
})();
