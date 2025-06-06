import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import url from '@rollup/plugin-url';
import del from 'rollup-plugin-delete';
import emitEJS from 'rollup-plugin-emit-ejs';
import {getPackagePath, getDistPath, getBuildInfo} from '@dbp-toolkit/dev-utils';
import replace from '@rollup/plugin-replace';
import {createRequire} from 'node:module';
import process from 'node:process';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const basePath = '/dist/';
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);

export default (async () => {
    return {
        input:
            build != 'test'
                ? ['src/dbp-tooltip.js', 'src/dbp-tooltip-demo.js']
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
                    buildInfo: getBuildInfo(build),
                },
            }),
            resolve({browser: true}),
            commonjs(),
            url({
                limit: 0,
                include: [await getPackagePath('tippy.js', '**/*.css')],
                emitFiles: true,
                fileName: 'shared/[name].[hash][extname]',
            }),
            json(),
            build !== 'local' && build !== 'test' ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},
                    {
                        src: await getPackagePath('@dbp-toolkit/common', 'assets/icons/*.svg'),
                        dest: 'dist/' + (await getDistPath('@dbp-toolkit/common', 'icons')),
                    },
                    {src: 'assets/favicon.ico', dest: 'dist'},
                ],
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                preventAssignment: true,
            }),
            process.env.ROLLUP_WATCH === 'true'
                ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
                : false,
        ],
    };
})();
