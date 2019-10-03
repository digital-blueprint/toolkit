import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from 'rollup-plugin-json';
import serve from 'rollup-plugin-serve';
import multiEntry from 'rollup-plugin-multi-entry';
import url from "rollup-plugin-url";
import consts from 'rollup-plugin-consts';
import del from 'rollup-plugin-delete';

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
        del({
            targets: 'dist/*'
        }),
        multiEntry(),
        consts({
            environment: build,
        }),
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
        url({
            limit: 0,
            include: [
                "node_modules/bulma/**/*.css",
                "node_modules/bulma/**/*.sass",
            ],
            emitFiles: true,
            fileName: 'shared/[name].[hash][extname]'
        }),
        (build !== 'local' && build !== 'test') ? terser() : false,
        copy({
            targets: [
                {src: 'assets/index.html', dest:'dist'},
                {src: 'assets/favicon.ico', dest:'dist'},
                {src: 'assets/icon_key_hover_tugprod.png', dest:'dist/local/vpu-auth'},
                {src: 'assets/icon_key_normal_tugprod.png', dest:'dist/local/vpu-auth'},
                {src: 'node_modules/vpu-common/assets/icons/*.svg', dest: 'dist/local/vpu-common/icons'},
            ]
        }),
        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
    ]
};
