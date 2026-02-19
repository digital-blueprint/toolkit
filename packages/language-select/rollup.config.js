import {globSync} from 'node:fs';
import serve from 'rollup-plugin-serve';
import process from 'node:process';
import {createRequire} from 'node:module';
import {assetPlugin} from '@dbp-toolkit/dev-utils';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';
console.log('build: ' + build);

export default {
    input:
        build != 'test'
            ? ['src/dbp-language-select.js', 'src/dbp-language-select-demo.js']
            : globSync('test/**/*.js'),
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
            copyTargets: [{src: 'assets/index.html', dest: 'dist'}],
        }),
        process.env.ROLLUP_WATCH === 'true'
            ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
            : false,
    ],
};
