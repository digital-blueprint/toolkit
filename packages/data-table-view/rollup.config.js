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
import {getPackagePath, getDistPath} from '../../rollup.utils.js';

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default (async () => {
    return {
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
                    {src: 'assets/index.html', dest: 'dist'},
                    {src: 'assets/*.css', dest: 'dist/' + await getDistPath(pkg.name)},
                    {src: 'assets/*.ico', dest: 'dist/' + await getDistPath(pkg.name)},
                    {src: 'assets/nomodule.js', dest: 'dist/' + await getDistPath(pkg.name)},
                    {src: await getPackagePath('@dbp-toolkit/common', 'assets/icons/*.svg'), dest: 'dist/' + await getDistPath('@dbp-toolkit/common', 'icons')},
                    {src: await getPackagePath('datatables.net-dt', 'css'), dest: 'dist/' + await getDistPath(pkg.name)},
                    {src: await getPackagePath('datatables.net-dt', 'images'), dest: 'dist/' + await getDistPath(pkg.name)},
                    {src: await getPackagePath('datatables.net-responsive-dt', 'css'), dest: 'dist/' + await getDistPath(pkg.name)},
                    {src: await getPackagePath('datatables.net-buttons-dt', 'css'), dest: 'dist/' + await getDistPath(pkg.name)},
                ],
            }),

            (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8003}) : false
        ]
    };
})();