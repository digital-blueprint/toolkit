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
import consts from 'rollup-plugin-consts';
import del from 'rollup-plugin-delete'


const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

let manualChunks = Object.keys(pkg.dependencies).reduce(function (acc, item) { acc[item] = [item]; return acc;}, {});
manualChunks = Object.keys(pkg.devDependencies).reduce(function (acc, item) { if (item.startsWith('vpu-')) acc[item] = [item]; return acc;}, manualChunks);

function getBuildInfo() {
    const child_process = require('child_process');
    const url = require('url');

    let remote = child_process.execSync('git config --get remote.origin.url').toString().trim();
    let commit = child_process.execSync('git rev-parse --short HEAD').toString().trim();

    let parsed = url.parse(remote);
    let newPath = parsed.path.slice(0, parsed.path.lastIndexOf('.'))
    let newUrl = parsed.protocol + '//' + parsed.host + newPath + '/commit/' + commit;

    return {
        info: commit,
        url: newUrl,
        env: build
    }
}

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
        del({
            targets: 'dist/*'
        }),
        (build == 'test') ? multiEntry() : false,
        consts({
            environment: build,
            buildinfo: getBuildInfo(),
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
        replace({
            "process.env.BUILD": '"' + build + '"',
        }),
        (build !== 'local' && build !== 'test') ? terser() : false,
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist'}, //rename: pkg.name + '.html'},
                {src: 'assets/*.css', dest: 'dist/local/' + pkg.name},
                {src: 'assets/*.ico', dest: 'dist/local/' + pkg.name},
                {src: 'node_modules/vpu-common/vpu-spinner.js', dest: 'dist/local/' + pkg.name, rename: 'spinner.js'},
                {src: 'node_modules/vpu-common/assets/icons/*.svg', dest: 'dist/local/vpu-common/icons'},
                {src: 'assets/nomodule.js', dest: 'dist/local/' + pkg.name},

                {src: 'node_modules/datatables.net-dt/css', dest: 'dist/local/vpu-data-table-view'},
                {src: 'node_modules/datatables.net-dt/images', dest: 'dist/local/vpu-data-table-view'},
                {src: 'node_modules/datatables.net-responsive-dt/css', dest: 'dist/local/vpu-data-table-view'},
            ],
        }),

        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8003}) : false
    ]
};
