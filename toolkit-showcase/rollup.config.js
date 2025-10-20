import url from 'node:url';
import process from 'node:process';
import {globSync} from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import urlPlugin from '@rollup/plugin-url';
import license from 'rollup-plugin-license';
import del from 'rollup-plugin-delete';
import md from './rollup-plugin-md.js';
import emitEJS from 'rollup-plugin-emit-ejs';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';
import appConfig from './app.config.js';
import {
    generateTLSConfig,
    getBuildInfo,
    getPackagePath,
    getDistPath,
    getCopyTargets,
    getUrlOptions,
} from '@dbp-toolkit/dev-utils';
import replace from '@rollup/plugin-replace';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const appEnv = typeof process.env.APP_ENV !== 'undefined' ? process.env.APP_ENV : 'local';
const watch = process.env.ROLLUP_WATCH === 'true';
const buildFull = (!watch && appEnv !== 'test') || process.env.FORCE_FULL !== undefined;
let doMinify = buildFull;
let useBabel = buildFull;
let checkLicenses = buildFull;
let treeshake = buildFull;
let useHTTPS = true;
let isRolldown = process.argv.some((arg) => arg.includes('rolldown'));

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

config.CSP = `default-src 'self' 'unsafe-inline' \
${getOrigin(config.matomoUrl)} ${getOrigin(config.keyCloakBaseURL)} ${getOrigin(
    config.entryPointURL,
)} ${getOrigin(config.nextcloudBaseURL)}; \
img-src * blob: data:`;

export default (async () => {
    let privatePath = await getDistPath(pkg.name);
    return {
        input: appEnv != 'test' ? globSync('src/dbp-*.js') : globSync('test/**/*.js'),
        output: {
            dir: 'dist',
            entryFileNames: '[name].js',
            chunkFileNames: 'shared/[name].[hash].js',
            format: 'esm',
            sourcemap: true,
            ...(isRolldown ? {minify: doMinify} : {}),
        },
        moduleTypes: {
            '.css': 'js', // work around rolldown handling the CSS import before the URL plugin cab
        },
        treeshake: treeshake,
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
                    shortName: config.shortName,
                },
            }),
            !isRolldown &&
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
                        allow(dependency) {
                            let licenses = [
                                'LGPL-2.1-or-later',
                                'MIT',
                                'BSD-3-Clause',
                                'Apache-2.0',
                                '0BSD',
                                '(MPL-2.0 OR Apache-2.0)',
                                'MIT OR SEE LICENSE IN FEEL-FREE.md',
                                '(MIT OR GPL-3.0-or-later)',
                                'BSD',
                                '(MIT AND Zlib)',
                            ];
                            if (!licenses.includes(dependency.license)) {
                                throw new Error(
                                    `Unknown license for ${dependency.name}: ${dependency.license}`,
                                );
                            }
                            return true;
                        },
                    },
                }),
            !isRolldown &&
                commonjs({
                    strictRequires: 'auto',
                }),
            !isRolldown && json(),
            md({
                include: ['../../**/*.md'],
                marked: {
                    highlight: function (code) {
                        return require('highlight.js').highlightAuto(code).value;
                    },
                },
            }),
            urlPlugin(await getUrlOptions(pkg.name, 'shared')),
            copy({
                copySync: true,
                targets: [
                    {src: 'assets/*.css', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/*.metadata.json', dest: 'dist'},
                    {src: 'assets/*.svg', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/htaccess-shared', dest: 'dist/shared/', rename: '.htaccess'},
                    {
                        src: 'assets/translation-overrides',
                        dest: 'dist/' + (await getDistPath(pkg.name)),
                    },
                    {src: 'assets/favicons/*.png', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/favicons/*.svg', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {src: 'assets/favicons/*.ico', dest: 'dist/' + (await getDistPath(pkg.name))},
                    {
                        src: 'assets/favicons/site.webmanifest',
                        dest: 'dist',
                        rename: pkg.name + '.webmanifest',
                    },
                    {src: 'assets/silent-check-sso.html', dest: 'dist'},
                    {
                        src: await getPackagePath('@dbp-toolkit/font-source-sans-pro', 'files/*'),
                        dest: 'dist/' + (await getDistPath(pkg.name, 'fonts/source-sans-pro')),
                    },
                    {
                        src: await getPackagePath('@fontsource/nunito-sans', '*'),
                        dest: 'dist/' + (await getDistPath(pkg.name, 'fonts/nunito-sans')),
                    },
                    {
                        src: await getPackagePath('@dbp-toolkit/common', 'src/spinner.js'),
                        dest: 'dist/' + (await getDistPath(pkg.name)),
                    },
                    {
                        src: await getPackagePath('@dbp-toolkit/common', 'misc/browser-check.js'),
                        dest: 'dist/' + (await getDistPath(pkg.name)),
                    },
                    ...(await getCopyTargets(pkg.name, 'dist')),
                ],
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                preventAssignment: true,
            }),
            useBabel &&
                getBabelOutputPlugin({
                    compact: false,
                    targets: {
                        esmodules: true,
                        browsers: 'defaults and not dead, last 5 years',
                    },
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                loose: false,
                                shippedProposals: true,
                                bugfixes: true,
                                modules: false,
                            },
                        ],
                    ],
                }),
            // the terser must be used AFTER babel, otherwise it will cause pdfjs to not show SVGs (or other images?)
            doMinify && !isRolldown ? terser() : false,
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
