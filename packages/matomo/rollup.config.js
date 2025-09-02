import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import emitEJS from 'rollup-plugin-emit-ejs';
import {getBuildInfo, getCopyTargets} from '@dbp-toolkit/dev-utils';
import {createRequire} from 'node:module';
import process from 'node:process';
import url from 'node:url';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const basePath = '/dist/';
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);
const matomoUrl = 'https://analytics.tugraz.at/';
const matomoSiteId = 131;

export default (async () => {
    return {
        input:
            build != 'test'
                ? ['src/dbp-matomo.js', 'src/dbp-matomo-demo.js']
                : globSync('test/**/*.js'),
        output: {
            dir: 'dist',
            entryFileNames: '[name].js',
            chunkFileNames: 'shared/[name].[hash].[format].js',
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            del({
                targets: 'dist/*',
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
                    matomoUrl: matomoUrl,
                    matomoSiteId: matomoSiteId,
                    buildInfo: getBuildInfo(build),
                },
            }),
            resolve({browser: true}),
            commonjs(),
            json(),
            build !== 'local' && build !== 'test' ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},

                    {src: 'assets/favicon.ico', dest: 'dist'},
                    ...(await getCopyTargets(pkg.name, 'dist')),
                ],
            }),
            process.env.ROLLUP_WATCH === 'true'
                ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
                : false,
        ],
    };
})();
