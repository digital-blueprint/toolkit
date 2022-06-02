import path from 'path';
import url from 'url';
import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import urlPlugin from '@rollup/plugin-url';
import license from 'rollup-plugin-license';
import del from 'rollup-plugin-delete';
import md from 'rollup-plugin-md';
import emitEJS from 'rollup-plugin-emit-ejs';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';
import appConfig from './app.config.js';
import {generateTLSConfig, getBuildInfo, getPackagePath, getDistPath} from '../rollup.utils.js';
import replace from 'rollup-plugin-replace';

const pkg = require('./package.json');
const appEnv = typeof process.env.APP_ENV !== 'undefined' ? process.env.APP_ENV : 'local';
const watch = process.env.ROLLUP_WATCH === 'true';
const buildFull = (!watch && appEnv !== 'test') || process.env.FORCE_FULL !== undefined;
let useTerser = buildFull;
let useBabel = buildFull;
let checkLicenses = buildFull;
let treeshake = buildFull;
let useHTTPS = true;

console.log('APP_ENV: ' + appEnv);

let config;
if (appEnv in appConfig) {
    config = appConfig[appEnv];
} else if (appEnv === 'test') {
    config = {
        basePath: '/',
        entryPointURL: 'https://test',
        keyCloakBaseURL: 'https://test',
        keyCloakRealm: '',
        keyCloakClientId: '',
        matomoUrl: '',
        matomoSiteId: -1,
        nextcloudBaseURL: 'https://test',
        nextcloudName: '',
    };
} else {
    console.error(`Unknown build environment: '${appEnv}', use one of '${Object.keys(appConfig)}'`);
    process.exit(1);
}

if (config.nextcloudBaseURL) {
    config.nextcloudFileURL = config.nextcloudBaseURL + '/index.php/apps/files/?dir=';
    config.nextcloudWebAppPasswordURL = config.nextcloudBaseURL + '/index.php/apps/webapppassword';
    config.nextcloudWebDavURL = config.nextcloudBaseURL + '/remote.php/dav/files';
} else {
    config.nextcloudFileURL = '';
    config.nextcloudWebAppPasswordURL = '';
    config.nextcloudWebDavURL = '';
}

function getOrigin(url) {
    if (url) return new URL(url).origin;
    return '';
}

config.CSP = `default-src 'self' 'unsafe-eval' 'unsafe-inline' \
${getOrigin(config.matomoUrl)} ${getOrigin(config.keyCloakBaseURL)} ${getOrigin(
    config.entryPointURL
)} \
httpbin.org ${getOrigin(config.nextcloudBaseURL)}; \
img-src * blob: data:`;

export default (async () => {
    let privatePath = await getDistPath(pkg.name);
    return {
        input: appEnv != 'test' ? glob.sync('src/dbp-*.js') : glob.sync('test/**/*.js'),
        output: {
            dir: 'dist',
            entryFileNames: '[name].js',
            chunkFileNames: 'shared/[name].[hash].[format].js',
            format: 'esm',
            sourcemap: true,
        },
        treeshake: treeshake,
        preserveEntrySignatures: false,
        plugins: [
            del({
                targets: 'dist/*',
            }),
            emitEJS({
                src: 'assets',
                include: ['**/*.ejs', '**/.*.ejs'],
                data: {
                    getUrl: (p) => {
                        return url.resolve(config.basePath, p);
                    },
                    getPrivateUrl: (p) => {
                        return url.resolve(`${config.basePath}${privatePath}/`, p);
                    },
                    name: pkg.name,
                    entryPointURL: config.entryPointURL,
                    nextcloudBaseURL: config.nextcloudBaseURL,
                    nextcloudWebAppPasswordURL: config.nextcloudWebAppPasswordURL,
                    nextcloudWebDavURL: config.nextcloudWebDavURL,
                    nextcloudFileURL: config.nextcloudFileURL,
                    nextcloudName: config.nextcloudName,
                    keyCloakBaseURL: config.keyCloakBaseURL,
                    keyCloakRealm: config.keyCloakRealm,
                    keyCloakClientId: config.keyCloakClientId,
                    CSP: config.CSP,
                    matomoUrl: config.matomoUrl,
                    matomoSiteId: config.matomoSiteId,
                    buildInfo: getBuildInfo(appEnv),
                },
            }),
            resolve({
                browser: true,
                preferBuiltins: true,
            }),
            checkLicenses &&
                license({
                    banner: {
                        commentStyle: 'ignored',
                        content: `
License: <%= pkg.license %>
Dependencies:
<% _.forEach(dependencies, function (dependency) { if (dependency.name) { %>
<%= dependency.name %>: <%= dependency.license %><% }}) %>
`,
                    },
                    thirdParty: {
                        allow: {
                            test: '(MIT OR BSD-3-Clause OR Apache-2.0 OR LGPL-2.1-or-later OR 0BSD)',
                            failOnUnlicensed: true,
                            failOnViolation: true,
                        },
                    },
                }),
            commonjs(),
            json(),
            md({
                include: ['../../**/*.md'],
                marked: {
                    highlight: function (code) {
                        return require('highlight.js').highlightAuto(code).value;
                    },
                },
            }),
            urlPlugin({
                limit: 0,
                include: [
                    await getPackagePath('select2', '**/*.css'),
                    await getPackagePath('highlight.js', '**/*.css'),
                    await getPackagePath('tippy.js', '**/*.css'),
                ],
                emitFiles: true,
                fileName: 'shared/[name].[hash][extname]',
            }),
            useTerser ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/*.css', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/*.ico', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/*.metadata.json', dest: 'dist'},
                    {src: 'assets/*.svg', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/htaccess-shared', dest: 'dist/shared/', rename: '.htaccess'},
                    {src: 'assets/icon-*.png', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/apple-*.png', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/safari-*.svg', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/translation-overrides', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {
                        src: 'assets/manifest.json',
                        dest: 'dist',
                        rename: pkg.name + '.manifest.json',
                    },
                    {src: 'assets/silent-check-sso.html', dest: 'dist'},
                    {
                        src: await getPackagePath('@dbp-toolkit/font-source-sans-pro', 'files/*'),
                        dest: 'dist/' + (await getDistPath(pkg.name, 'fonts/source-sans-pro')),
                    },
                    {
                        src: await getPackagePath('@dbp-toolkit/common', 'src/spinner.js'),
                        dest: 'dist/' + (await getDistPath(pkg.name)),
                    },
                    {
                        src: await getPackagePath('@dbp-toolkit/common', 'misc/browser-check.js'),
                        dest: 'dist/' + (await getDistPath(pkg.name)),
                    },
                    {
                        src: await getPackagePath('@dbp-toolkit/common', 'assets/icons/*.svg'),
                        dest: 'dist/' + (await getDistPath('@dbp-toolkit/common', 'icons')),
                    },
                    {
                        src: await getPackagePath('tabulator-tables', 'dist/css'),
                        dest:
                            'dist/' +
                            (await getDistPath('@dbp-toolkit/file-handling', 'tabulator-tables')),
                    },
                    {
                        src: await getPackagePath('qr-scanner', 'qr-scanner-worker.*'),
                        dest: 'dist/' + (await getDistPath('@dbp-toolkit/qr-code-scanner')),
                    },
                    {
                        src: await getPackagePath('datatables.net-dt', 'css'),
                        dest: 'dist/' + (await getDistPath('@dbp-toolkit/data-table-view')),
                    },
                    {
                        src: await getPackagePath('datatables.net-dt', 'images'),
                        dest: 'dist/' + (await getDistPath('@dbp-toolkit/data-table-view')),
                    },
                    {
                        src: await getPackagePath('datatables.net-responsive-dt', 'css'),
                        dest: 'dist/' + (await getDistPath('@dbp-toolkit/data-table-view')),
                    },
                    {
                        src: await getPackagePath('datatables.net-buttons-dt', 'css'),
                        dest: 'dist/' + (await getDistPath('@dbp-toolkit/data-table-view')),
                    },
                ],
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            useBabel &&
                getBabelOutputPlugin({
                    compact: false,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                loose: true,
                                shippedProposals: true,
                                bugfixes: true,
                                modules: false,
                                targets: {
                                    esmodules: true,
                                },
                            },
                        ],
                    ],
                }),
            watch
                ? serve({
                      contentBase: '.',
                      host: '127.0.0.1',
                      port: 8001,
                      historyApiFallback: config.basePath + pkg.name + '.html',
                      https: useHTTPS ? await generateTLSConfig() : false,
                      headers: {
                          'Content-Security-Policy': config.CSP,
                      },
                  })
                : false,
        ],
    };
})();
