import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from 'rollup-plugin-json';
import replace from "rollup-plugin-replace";
import serve from 'rollup-plugin-serve';
import multiEntry from 'rollup-plugin-multi-entry';
import url from "rollup-plugin-url";

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

let manualChunks = Object.keys(pkg.dependencies).reduce(function (acc, item) { acc[item] = [item]; return acc;}, {});
manualChunks = Object.keys(pkg.devDependencies).reduce(function (acc, item) { if (item.startsWith('vpu-')) acc[item] = [item]; return acc;}, manualChunks);

export default {
    input: (build !== 'test') ? 'src/demo.js' : 'test/**/*.js',
    output: {
        dir: 'dist',
        entryFileNames: pkg.name + '.js',
        chunkFileNames: 'shared/[name].[hash].[format].js',
        format: 'esm'
    },
    manualChunks: manualChunks,
    onwarn: function (warning, warn) {
        // ignore "suggestions" warning re "use strict"
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
        }
        throw new Error(warning);
    },
    watch: {
        chokidar: true,
    },
    plugins: [
        (build == 'test') ? multiEntry() : false,
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
        replace({
            "process.env.BUILD": '"' + build + '"',
        }),
        (build !== 'local' && build !== 'test') ? terser() : false,
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist', rename: pkg.name + '.html'},
                {src: 'assets/*.css', dest: 'dist/local/' + pkg.name},
                {src: 'assets/*.ico', dest: 'dist/local/' + pkg.name},
                {src: 'node_modules/vpu-common/vpu-spinner.js', dest: 'dist/local/' + pkg.name, rename: 'spinner.js'},
                {src: 'node_modules/material-design-icons-svg/paths/*.json', dest: 'dist/local/vpu-common/icons'},

                {src: 'node_modules/datatables.net-dt/css', dest: 'dist/local/vpu-data-table-view'},
                {src: 'node_modules/datatables.net-dt/images', dest: 'dist/local/vpu-data-table-view'},
                {src: 'node_modules/datatables.net-responsive-dt/css', dest: 'dist/local/vpu-data-table-view'},
                {src: 'assets/datatables/i18n', dest: 'dist/local/vpu-data-tables-view'}
            ],
        }),

        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8003}) : false
    ]
};
