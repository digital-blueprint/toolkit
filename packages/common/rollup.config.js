import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import consts from 'rollup-plugin-consts';
import url from "rollup-plugin-url";
import json from 'rollup-plugin-json';

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: (build !='test') ? 'vpu-common-demo.js' : 'test/**/*.js',
    output: {
        file: 'dist/bundle.js',
        format: 'esm'
    },
    plugins: [
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
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist'},
                {src: 'node_modules/material-design-icons-svg/paths/*.json', dest: 'dist/local/' + pkg.name + '/icons'},
            ],
        }),
        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
    ]
};
