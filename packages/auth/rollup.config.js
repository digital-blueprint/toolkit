import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from 'rollup-plugin-json';
import replace from "rollup-plugin-replace";

const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: 'index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'esm'
    },
    plugins: [
        resolve(),
        commonjs(),
        json(),
        replace({
            "process.env.BUILD": '"' + build + '"',
        }),
        postcss({
            inject: false,
            minimize: false,
            plugins: []
        }),
        terser(),
        copy({
            targets: [
                'index.html',
                'favicon.ico',
                'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
                'node_modules/@webcomponents/webcomponentsjs/bundles',
            ],
            outputFolder: 'dist'
        })
    ]
};
