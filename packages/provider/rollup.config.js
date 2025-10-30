import {globSync} from 'node:fs';
import serve from 'rollup-plugin-serve';
import emitEJS from 'rollup-plugin-emit-ejs';
import {getBuildInfo, assetPlugin} from '@dbp-toolkit/dev-utils';
import {createRequire} from 'node:module';
import process from 'node:process';
import url from 'node:url';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const basePath = '/dist/';
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);
let isRolldown = process.argv.some((arg) => arg.includes('rolldown'));
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';

export default {
    input:
        build != 'test'
            ? ['src/dbp-provider.js', 'src/dbp-adapter.js', 'src/dbp-provider-demo.js']
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
