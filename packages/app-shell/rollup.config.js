import {globSync} from 'glob';
import url from 'node:url';
import process from 'node:process';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import json from '@rollup/plugin-json';
import emitEJS from 'rollup-plugin-emit-ejs';
import {getDistPath, getCopyTargets} from '@dbp-toolkit/dev-utils';
import config from '../../demo.common.config.js';
import {createRequire} from 'node:module';

const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const basePath = '/dist/';
const appName = 'dbp-app-shell';

export default (async () => {
    let privatePath = await getDistPath(pkg.name);
    return {
        input:
            build != 'test'
                ? ['src/' + appName + '.js', 'src/dbp-activity-example.js']
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
                        return url.resolve(`${basePath}${privatePath}/`, p);
                    },
                    name: appName,
                    entryPointURL: config.entryPointURL,
                    keyCloakBaseURL: config.keyCloakBaseURL,
                    keyCloakRealm: config.keyCloakRealm,
                    keyCloakClientId: config.keyCloakClientId,
                },
            }),
            resolve({browser: true}),
            commonjs(),
            json(),
            copy({
                targets: [
                    {src: 'assets/silent-check-sso.html', dest: 'dist'},
                    {src: 'assets/*.json', dest: 'dist'},
                    ...(await getCopyTargets(pkg.name, 'dist')),
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
})();
