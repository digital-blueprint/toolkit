import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import {getPackagePath, getDistPath} from '../../rollup.utils.js';
import path from "path";

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

let nextcloudBaseURL = 'https://cloud.tugraz.at';
let nextcloudFileURL = nextcloudBaseURL + '/apps/files/?dir=';

export default (async () => {
    return {
        input: (build !== 'test') ? ['src/demo.js', 'src/dbp-file-source.js', 'src/dbp-file-sink.js', 'src/dbp-clipboard.js', 'src/dbp-nextcloud-file-picker.js'] : glob.sync('test/**/*.js'),
        output: {
            dir: 'dist',
            entryFileNames: '[name].js',
            chunkFileNames: 'shared/[name].[hash].[format].js',
            format: 'esm',
            sourcemap: true
        },
        plugins: [
            del({
                targets: 'dist/*'
            }),
            resolve({browser: true}),
            commonjs(),
            json(),
            (build !== 'local' && build !== 'test') ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},
                    {src: 'assets/favicon.ico', dest: 'dist'},
                    {src: await getPackagePath('@dbp-toolkit/common', 'assets/icons/*.svg'), dest: 'dist/' + await getDistPath('@dbp-toolkit/common', 'icons')},
                    {src: await getPackagePath('tabulator-tables', 'dist/css'), dest: 'dist/' + await getDistPath(pkg.name, 'tabulator-tables')},
                ],
            }),
            (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
        ]
    };
})();