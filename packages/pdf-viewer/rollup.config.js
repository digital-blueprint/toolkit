import {globSync} from 'node:fs';
import serve from 'rollup-plugin-serve';
import {getPackagePath, getDistPath, assetPlugin} from '@dbp-toolkit/dev-utils';
import {createRequire} from 'node:module';
import process from 'node:process';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);
let isRolldown = process.argv.some((arg) => arg.includes('rolldown'));
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';

export default {
    input:
        build != 'test'
            ? ['src/dbp-pdf-viewer.js', 'src/dbp-pdf-viewer-demo.js']
            : globSync('test/**/*.js'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].js',
        format: 'esm',
        sourcemap: true,
        ...(isRolldown ? {minify: buildFull, cleanDir: true} : {}),
    },
    plugins: [
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
