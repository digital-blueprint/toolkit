import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import urlPlugin from "@rollup/plugin-url";
import consts from 'rollup-plugin-consts';
import del from 'rollup-plugin-delete';

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: (build != 'test') ? ['src/dbp-data-table-view.js', 'src/dbp-data-table-view-demo.js'] : glob.sync('test/**/*.js'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].[format].js',
        format: 'esm',
        sourcemap: true
    },
    onwarn: function (warning, warn) {
        // ignore "suggestions" warning re "use strict"
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
        }
        // ignore chai warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
            return;
        }
        // keycloak bundled code uses eval
        if (warning.code === 'EVAL') {
            return;
        }
        warn(warning);
    },
    watch: {
        chokidar: true,
    },
    plugins: [
        del({
            targets: 'dist/*'
        }),
        consts({
            environment: build,
        }),
        resolve(),
        commonjs(),
        json(),
        urlPlugin({
            limit: 0,
            emitFiles: true,
            fileName: 'shared/[name].[hash][extname]'
          }),
        (build !== 'local' && build !== 'test') ? terser() : false,
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist'}, //rename: pkg.name + '.html'},
                {src: 'assets/*.css', dest: 'dist/local/' + pkg.name},
                {src: 'assets/*.ico', dest: 'dist/local/' + pkg.name},
                {src: 'node_modules/dbp-common/dbp-spinner.js', dest: 'dist/local/' + pkg.name, rename: 'spinner.js'},
                {src: 'node_modules/dbp-common/assets/icons/*.svg', dest: 'dist/local/dbp-common/icons'},
                {src: 'assets/nomodule.js', dest: 'dist/local/' + pkg.name},

                {src: '../../node_modules/datatables.net-dt/css', dest: 'dist/local/dbp-data-table-view'},
                {src: '../../node_modules/datatables.net-dt/images', dest: 'dist/local/dbp-data-table-view'},
                {src: '../../node_modules/datatables.net-responsive-dt/css', dest: 'dist/local/dbp-data-table-view'},
                {src: '../../node_modules/datatables.net-buttons-dt/css', dest: 'dist/local/dbp-data-table-view'},
            ],
        }),

        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8003}) : false
    ]
};
