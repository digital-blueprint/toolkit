import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import url from '@rollup/plugin-url';
import del from 'rollup-plugin-delete';
import {getPackagePath, getDistPath, getUrlOptions} from '@dbp-toolkit/dev-utils';
import {createRequire} from 'node:module';
import process from 'node:process';

let isRolldown = process.argv.some((arg) => arg.includes('rolldown'));
const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);

export default (async () => {
    return {
        input:
            build !== 'test'
                ? [
                      'src/build/boolean.js',
                      'src/build/date.js',
                      'src/build/datetime.js',
                      'src/build/enum.js',
                      'src/build/string.js',
                      'src/build/time.js',
                      'src/demo.js',
                  ]
                : globSync('test/**/*.js'),
        output: {
            dir: 'dist',
            entryFileNames: '[name].js',
            chunkFileNames: 'shared/[name].[hash].js',
            format: 'esm',
            sourcemap: true,
        },
        moduleTypes: {
            '.css': 'js', // work around rolldown handling the CSS import before the URL plugin cab
        },
        plugins: [
            del({
                targets: 'dist/*',
            }),
            !isRolldown &&
                resolve({
                    browser: true,
                    preferBuiltins: true,
                }),
            !isRolldown && commonjs(),
            !isRolldown && json(),
            url(await getUrlOptions(pkg.name, 'shared')),
            build !== 'local' && build !== 'test' ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},
                    {src: 'assets/favicon.ico', dest: 'dist'},
                    {
                        src: await getPackagePath('@dbp-toolkit/common', 'src/spinner.js'),
                        dest: 'dist/' + (await getDistPath(pkg.name)),
                    },
                    {
                        src: await getPackagePath('@dbp-toolkit/common', 'misc/browser-check.js'),
                        dest: 'dist/' + (await getDistPath(pkg.name)),
                    },
                ],
            }),
            process.env.ROLLUP_WATCH === 'true'
                ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
                : false,
        ],
    };
})();
