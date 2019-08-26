import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import consts from 'rollup-plugin-consts';

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: (build !='test') ? 'demo.js' : 'test/**/*.js',
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
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist'},
                {src: 'node_modules/material-design-icons-svg/paths/*.json', dest: 'dist/local/' + pkg.name + '/icons'},
            ],
        }),
        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
    ]
};
