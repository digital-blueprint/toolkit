import {globSync} from 'node:fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import {getPackagePath, getDistPath, assetPlugin} from '@dbp-toolkit/dev-utils';
import {createRequire} from 'node:module';
import process from 'node:process';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';
let isRolldown = process.argv.some((arg) => arg.includes('rolldown'));

export default {
    input:
        build !== 'test'
            ? ['src/dbp-grant-permission-dialog.js', 'src/demo.js']
            : globSync('test/**/*.js'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].js',
        format: 'esm',
        sourcemap: true,
        ...(isRolldown ? {minify: buildFull, cleanDir: true} : {}),
    },
    moduleTypes: {
        '.css': 'js', // work around rolldown handling the CSS import before the URL plugin cab
    },
    plugins: [
        !isRolldown &&
            del({
                targets: 'dist/*',
            }),
        !isRolldown &&
            resolve({
                browser: true,
                preferBuiltins: true,
            }),
        !isRolldown && commonjs(),
        await assetPlugin(pkg.name, 'dist', {
            copyTargets: [
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
