import {globSync} from 'node:fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import process from 'node:process';
import {createRequire} from 'node:module';
import {assetPlugin} from '@dbp-toolkit/dev-utils';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
let isRolldown = process.argv.some((arg) => arg.includes('rolldown'));
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';
console.log('build: ' + build);

export default {
    input:
        build != 'test'
            ? ['src/dbp-language-select.js', 'src/dbp-language-select-demo.js']
            : globSync('test/**/*.js'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].js',
        format: 'esm',
        sourcemap: true,
        ...(isRolldown ? {minify: buildFull, cleanDir: true} : {}),
    },
    plugins: [
        !isRolldown &&
            del({
                targets: 'dist/*',
            }),
        !isRolldown && resolve({browser: true}),
        !isRolldown && commonjs(),
        !isRolldown && json(),
        await assetPlugin(pkg.name, 'dist', {
            copyTargets: [{src: 'assets/index.html', dest: 'dist'}],
        }),
        process.env.ROLLUP_WATCH === 'true'
            ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
            : false,
    ],
};
