import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from 'rollup-plugin-json';
import replace from "rollup-plugin-replace";
import serve from 'rollup-plugin-serve';
import multiEntry from 'rollup-plugin-multi-entry';

const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: (build != 'test') ? 'src/demo.js' : 'test/**/*.js',
    output: {
        file: 'dist/bundle.js',
        format: 'esm'
    },
    plugins: [
        multiEntry(),
        resolve(),
        commonjs({
            include: 'node_modules/**'
        }),
        json(),
        replace({
            "process.env.BUILD": '"' + build + '"',
        }),
        postcss({
            inject: false,
            minimize: false,
            plugins: []
        }),
        (build !== 'local' && build !== 'test') ? terser() : false,
        copy({
            targets: [
                'assets/index.html',
                'assets/favicon.ico'
            ],
            outputFolder: 'dist'
        }),
        copy({
            targets: [
                'node_modules/datatables.net-dt/css',
                'node_modules/datatables.net-dt/images'
            ],
            outputFolder: 'dist/datatables'
        }),
        copy({
            targets: [
                'assets/datatables/i18n'
            ],
            outputFolder: 'dist/datatables/'
        }),

        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8003}) : false
    ]
};
