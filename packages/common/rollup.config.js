import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import consts from 'rollup-plugin-consts';
import del from 'rollup-plugin-delete';
import json from 'rollup-plugin-json';
import chai from 'chai';

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: (build !='test') ? 'demo.js' : 'test/**/*.js',
    output: {
        file: 'dist/bundle.js',
        format: 'esm'
    },
    onwarn: function (warning, warn) {
        // ignore chai warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        warn(warning);
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
            include: 'node_modules/**',
            namedExports: {
                'chai': Object.keys(chai),
            }
        }),
        json(),
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist'},
                {src: 'assets/icons/*.svg', dest: 'dist/local/' + pkg.name + '/icons'},
            ],
        }),
        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
    ]
};
