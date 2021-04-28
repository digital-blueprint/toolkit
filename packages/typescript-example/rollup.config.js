import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';

const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: (build != 'test') ? ['src/dbp-typescript-example.ts', 'src/dbp-typescript-example-demo.ts'] : glob.sync('test/**/*.ts'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].[format].js',
        format: 'esm',
        sourcemap: true
    },
    plugins: [
        del({
            targets: 'dist/*'
        }),
        resolve(),
        commonjs(),
        json(),
        typescript(),
        (build !== 'local' && build !== 'test') ? terser() : terser(),
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist'},
            ],
        }),
        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
    ]
};
