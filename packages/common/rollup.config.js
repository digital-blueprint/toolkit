import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from "rollup-plugin-replace";
import multiEntry from 'rollup-plugin-multi-entry';

const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: 'test/**/*.js',
    output: {
        file: 'dist/bundle.js',
        format: 'esm'
    },
    plugins: [
        multiEntry(),
        resolve(),
        commonjs(),
        replace({
            "process.env.BUILD": '"' + build + '"',
        })
    ]
};
