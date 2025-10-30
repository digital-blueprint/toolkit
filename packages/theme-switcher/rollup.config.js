import {globSync} from 'node:fs';
import serve from 'rollup-plugin-serve';
import {assetPlugin} from '@dbp-toolkit/dev-utils';
import process from 'node:process';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';

export default {
    input:
        build !== 'test' ? ['src/demo.js', 'src/dbp-theme-switcher.js'] : globSync('test/**/*.js'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].js',
        format: 'esm',
        sourcemap: true,
        minify: buildFull,
        cleanDir: true,
    },
    plugins: [
        await assetPlugin(pkg.name, 'dist', {
            copyTargets: [
                {src: 'assets/index.html', dest: 'dist'},
                {src: 'assets/favicon.ico', dest: 'dist'},
            ],
        }),
        process.env.ROLLUP_WATCH === 'true'
            ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
            : false,
    ],
};
