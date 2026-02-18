import {globSync} from 'node:fs';
import serve from 'rollup-plugin-serve';
import process from 'node:process';
import {createRequire} from 'node:module';
import {generateTLSConfig, assetPlugin} from '@dbp-toolkit/dev-utils';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';

const USE_HTTPS = true;

export default {
    input:
        build != 'test'
            ? ['src/dbp-qr-code-scanner.js', 'src/dbp-qr-code-scanner-demo.js']
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
    moduleTypes: {
        '.css': 'js', // work around rolldown handling the CSS import before the URL plugin cab
    },
    experimental: {
        // https://github.com/rolldown/rolldown/issues/8361
        chunkOptimization: false,
    },
    plugins: [
        await assetPlugin(pkg.name, 'dist', {
            copyTargets: [
                {src: 'assets/index.html', dest: 'dist'},
                {src: 'assets/favicon.ico', dest: 'dist'},
            ],
        }),
        process.env.ROLLUP_WATCH === 'true'
            ? serve({
                  contentBase: 'dist',
                  host: '127.0.0.1',
                  port: 8002,
                  https: USE_HTTPS ? await generateTLSConfig() : false,
              })
            : false,
    ],
};
