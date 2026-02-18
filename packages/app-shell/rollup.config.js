import {globSync} from 'node:fs';
import url from 'node:url';
import process from 'node:process';
import serve from 'rollup-plugin-serve';
import emitEJS from 'rollup-plugin-emit-ejs';
import {getDistPath, assetPlugin} from '@dbp-toolkit/dev-utils';
import config from '../../demo.common.config.js';
import {createRequire} from 'node:module';

const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const basePath = '/dist/';
const appName = 'dbp-app-shell';
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';
let privatePath = await getDistPath(pkg.name);

export default {
    input:
        build != 'test'
            ? ['src/' + appName + '.js', 'src/dbp-activity-example.js']
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
    experimental: {
        // https://github.com/rolldown/rolldown/issues/8361
        chunkOptimization: false,
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
                    return url.resolve(`${basePath}${privatePath}/`, p);
                },
                name: appName,
                entryPointURL: config.entryPointURL,
                keyCloakBaseURL: config.keyCloakBaseURL,
                keyCloakRealm: config.keyCloakRealm,
                keyCloakClientId: config.keyCloakClientId,
            },
        }),
        await assetPlugin(pkg.name, 'dist', {
            copyTargets: [
                {src: 'assets/silent-check-sso.html', dest: 'dist'},
                {src: 'assets/*.json', dest: 'dist'},
            ],
        }),
        process.env.ROLLUP_WATCH === 'true'
            ? serve({
                  contentBase: '.',
                  historyApiFallback: basePath + 'index.html',
                  host: '127.0.0.1',
                  port: 8002,
              })
            : false,
    ],
};
