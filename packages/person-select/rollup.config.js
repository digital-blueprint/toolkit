import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from 'rollup-plugin-json';
import replace from "rollup-plugin-replace";
import serve from 'rollup-plugin-serve';
import multiEntry from 'rollup-plugin-multi-entry';

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: (build != 'test') ? 'src/demo.js' : 'test/**/*.js',
    output: {
        file: 'dist/' + pkg.name + '.js',
        format: 'esm'
    },
    plugins: [
        multiEntry(),
        resolve({
            customResolveOptions: {
                // ignore node_modules from vendored packages
                moduleDirectory: path.join(process.cwd(), 'node_modules')
            }
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        json(),
        replace({
            "process.env.BUILD": '"' + build + '"',
        }),
        (build !== 'local' && build !== 'test') ? terser() : false,
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist'},
                {src: 'assets/favicon.ico', dest: 'dist'},
            ],
        }),
        copy({
            targets: [
                {src: 'node_modules/select2/dist/css', dest: 'dist/select2'},
            ],
        }),
        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
    ]
};
