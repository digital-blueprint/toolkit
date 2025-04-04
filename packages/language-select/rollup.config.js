import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import process from 'node:process';

const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);

export default {
    input:
        build != 'test'
            ? ['src/dbp-language-select.js', 'src/dbp-language-select-demo.js']
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
            targets: [{src: 'assets/index.html', dest: 'dist'}],
        }),
        process.env.ROLLUP_WATCH === 'true'
            ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
            : false,
    ],
};
