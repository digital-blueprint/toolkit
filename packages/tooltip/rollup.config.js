import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import url from "@rollup/plugin-url";
import del from 'rollup-plugin-delete';
import emitEJS from 'rollup-plugin-emit-ejs'
import {getPackagePath, getDistPath} from '../../rollup.utils.js';

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

function getBuildInfo() {
    const child_process = require('child_process');
    const url = require('url');

    let remote = child_process.execSync('git config --get remote.origin.url').toString().trim();
    let commit = child_process.execSync('git rev-parse --short HEAD').toString().trim();

    let parsed = url.parse(remote);
    // convert git urls
    if (parsed.protocol === null) {
        parsed = url.parse('git://' + remote.replace(":", "/"));
        parsed.protocol = 'https:';
    }
    let newPath = parsed.path.slice(0, parsed.path.lastIndexOf('.'));
    let newUrl = parsed.protocol + '//' + parsed.host + newPath + '/commit/' + commit;

    return {
        info: commit,
        url: newUrl,
        time: new Date().toISOString(),
        env: build
    }
}

export default (async () => {
    return {
        input: (build != 'test') ? ['src/dbp-tooltip.js', 'src/dbp-tooltip-demo.js'] : glob.sync('test/**/*.js'),
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
            emitEJS({
                src: 'assets',
                include: ['**/*.ejs', '**/.*.ejs'],
                data: {
                    getUrl: (p) => {
                        return url.resolve(basePath, p);
                    },
                    getPrivateUrl: (p) => {
                        return url.resolve(`${basePath}local/${pkg.name}/`, p);
                    },
                    name: pkg.name,
                    environment: build,
                    buildInfo: getBuildInfo()
                }
            }),
            resolve(),
            commonjs(),
            url({
                limit: 0,
                include: [
                    await getPackagePath('select2', '**/*.css'),
                ],
                emitFiles: true,
                fileName: 'shared/[name].[hash][extname]'
            }),
            json(),
            (build !== 'local' && build !== 'test') ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},
                    {src: await getPackagePath('@dbp-toolkit/common', 'assets/icons/*.svg'), dest: 'dist/' + await getDistPath('@dbp-toolkit/common', 'icons')},
                    {src: 'assets/favicon.ico', dest:'dist'},
                ],
            }),
            (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
        ]
    };
})();
