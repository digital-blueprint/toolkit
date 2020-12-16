import path from 'path';
import fs from 'fs';
import url from 'url';
import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import replace from "@rollup/plugin-replace";
import serve from 'rollup-plugin-serve';
import urlPlugin from "@rollup/plugin-url";
import consts from 'rollup-plugin-consts';
import license from 'rollup-plugin-license';
import del from 'rollup-plugin-delete';
import md from 'rollup-plugin-md';
import emitEJS from 'rollup-plugin-emit-ejs'
import babel from '@rollup/plugin-babel'
import selfsigned from 'selfsigned';

// -------------------------------

// Some new web APIs are only available when HTTPS is active.
// Note that this only works with a Non-HTTPS API endpoint with Chrome,
// Firefox will emit CORS errors, see https://bugzilla.mozilla.org/show_bug.cgi?id=1488740
const USE_HTTPS = true;

// -------------------------------

const pkg = require('./package.json');
const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
const watch = process.env.ROLLUP_WATCH === 'true';
const buildFull = (!watch && build !== 'test') || (process.env.FORCE_FULL !== undefined);

console.log("build: " + build);
let basePath = '';
let entryPointURL = '';
let nextcloudBaseURL = 'https://cloud.tugraz.at';
let nextcloudWebAppPasswordURL = nextcloudBaseURL + '/apps/webapppassword';
let nextcloudWebDavURL = nextcloudBaseURL + '/remote.php/dav/files';
let nextcloudName = 'TU Graz cloud';
let keyCloakServer = '';
let keyCloakBaseURL = '';
let keyCloakClientId = '';
let pdfAsQualifiedlySigningServer = '';
const matomoUrl = "https://analytics.tugraz.at/";
const matomoSiteId = 131;
let useTerser = buildFull;
let useBabel = buildFull;
let checkLicenses = buildFull;

switch (build) {
  case 'local':
    basePath = '/dist/';
    entryPointURL = 'http://127.0.0.1:8000';
    nextcloudBaseURL = 'http://localhost:8081';
    nextcloudWebAppPasswordURL = nextcloudBaseURL + '/index.php/apps/webapppassword';
    nextcloudWebDavURL = nextcloudBaseURL + '/remote.php/dav/files';
    keyCloakServer = 'auth-dev.tugraz.at';
    keyCloakBaseURL = 'https://' + keyCloakServer + '/auth';
    keyCloakClientId = 'auth-dev-mw-frontend-local';
    pdfAsQualifiedlySigningServer = 'sig-dev.tugraz.at';
    break;
  case 'development':
    basePath = '/apps/toolkit-showcase/';
    entryPointURL = 'https://mw-dev.tugraz.at';
    // "/pers" can't go here because it's not allowed in the "Content-Security-Policy"
    nextcloudBaseURL = 'https://nc-dev.tugraz.at';
    // "/index.php" is needed to don't get a "This origin is not allowed!" because the "target-origin" get parameter can't be read
    nextcloudWebAppPasswordURL = nextcloudBaseURL + '/pers/index.php/apps/webapppassword';
    nextcloudWebDavURL = nextcloudBaseURL + '/pers/remote.php/dav/files';
    keyCloakServer = 'auth-dev.tugraz.at';
    keyCloakBaseURL = 'https://' + keyCloakServer + '/auth';
    keyCloakClientId = 'auth-dev-mw-frontend';
    pdfAsQualifiedlySigningServer = 'sig-dev.tugraz.at';
    break;
  default:
    console.error('Unknown build environment: ' + build);
    process.exit(1);
}

let nextcloudFileURL = nextcloudBaseURL + '/apps/files/?dir=';

/**
 * Creates a server certificate and caches it in the .cert directory
 */
function generateTLSConfig() {
  fs.mkdirSync('.cert', {recursive: true});

  if (!fs.existsSync('.cert/server.key') || !fs.existsSync('.cert/server.cert')) {
    const attrs = [{name: 'commonName', value: 'dbp-dev.localhost'}];
    const pems = selfsigned.generate(attrs, {algorithm: 'sha256', days: 9999});
    fs.writeFileSync('.cert/server.key', pems.private);
    fs.writeFileSync('.cert/server.cert', pems.cert);
  }

  return {
    key: fs.readFileSync('.cert/server.key'),
    cert: fs.readFileSync('.cert/server.cert')
  }
}

function getBuildInfo() {
    const child_process = require('child_process');
    const url = require('url');

    let remote = child_process.execSync('git config --get remote.origin.url').toString().trim();
    let commit = child_process.execSync('git rev-parse --short HEAD').toString().trim();

    let parsed = url.parse(remote);
    // convert git urls
    if (parsed.protocol === null) {
        parsed = url.parse('git://' + remote.replace(":", "/"));
        parsed.protocol = 'https:';
    }
    let newPath = parsed.path.slice(0, parsed.path.lastIndexOf('.'));
    let newUrl = parsed.protocol + '//' + parsed.host + newPath + '/commit/' + commit;

    return {
        info: commit,
        url: newUrl,
        time: new Date().toISOString(),
        env: build
    }
}

export default {
    input: (build != 'test') ? glob.sync('src/*.js') : glob.sync('test/**/*.js'),
    output: {
      dir: 'dist',
      entryFileNames: '[name].js',
      chunkFileNames: 'shared/[name].[hash].[format].js',
      format: 'esm',
      sourcemap: true
    },
    preserveEntrySignatures: false,
    // external: ['zlib', 'http', 'fs', 'https', 'url'],
    onwarn: function (warning, warn) {
        // ignore "suggestions" warning re "use strict"
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
        }
        // ignore chai warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        warn(warning);
    },
    watch: {
      chokidar: {
        usePolling: true
      }
    },
    plugins: [
        del({
          targets: 'dist/*'
        }),
        consts({
          environment: build,
          buildinfo: getBuildInfo(),
          nextcloudWebAppPasswordURL: nextcloudWebAppPasswordURL,
          nextcloudWebDavURL: nextcloudWebDavURL,
          nextcloudBaseURL: nextcloudBaseURL,
          nextcloudFileURL: nextcloudFileURL,
          nextcloudName: nextcloudName,
        }),
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
            entryPointURL: entryPointURL,
            nextcloudBaseURL: nextcloudBaseURL,
            keyCloakServer: keyCloakServer,
            keyCloakBaseURL: keyCloakBaseURL,
            keyCloakClientId: keyCloakClientId,
            pdfAsQualifiedlySigningServer: pdfAsQualifiedlySigningServer,
            environment: build,
            matomoUrl: matomoUrl,
            matomoSiteId: matomoSiteId,
            buildInfo: getBuildInfo()
          }
        }),
        resolve({
          customResolveOptions: {
            // ignore node_modules from vendored packages
            moduleDirectory: path.join(process.cwd(), 'node_modules')
          },
          browser: true,
          preferBuiltins: true
        }),
        checkLicenses && license({
            banner: {
                commentStyle: 'ignored',
                content: `
License: <%= pkg.license %>
Dependencies:
<% _.forEach(dependencies, function (dependency) { if (dependency.name) { %>
<%= dependency.name %>: <%= dependency.license %><% }}) %>
`},
          thirdParty: {
            allow: {
              test: '(MIT OR BSD-3-Clause OR Apache-2.0 OR LGPL-2.1-or-later)',
              failOnUnlicensed: true,
              failOnViolation: true,
            },
          },
        }),
        commonjs({
            include: 'node_modules/**',
        }),
        json(),
        md({
            include: ["../../**/*.md"],
            marked: {
                highlight: function(code) {
                    return require('highlight.js').highlightAuto(code).value;
                }
            }
        }),
        urlPlugin({
          limit: 0,
          include: [
            "node_modules/suggestions/**/*.css",
            "node_modules/select2/**/*.css",
            "node_modules/highlight.js/**/*.css",
          ],
          emitFiles: true,
          fileName: 'shared/[name].[hash][extname]'
        }),
        replace({
            "process.env.BUILD": '"' + build + '"',
        }),
        useTerser ? terser() : false,
        copy({
            targets: [
                {src: 'assets/silent-check-sso.html', dest:'dist'},
                {src: 'assets/htaccess-shared', dest: 'dist/shared/', rename: '.htaccess'},
                {src: 'assets/*.css', dest: 'dist/local/' + pkg.name},
                {src: 'assets/*.ico', dest: 'dist/local/' + pkg.name},
                {src: 'assets/*.svg', dest: 'dist/local/' + pkg.name},
                {
                    src: 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
                    dest: 'dist/local/' + pkg.name + '/pdfjs',
                    // enable signatures in pdf preview
                    transform: (contents) => contents.toString().replace('if("Sig"===a.fieldType){a.fieldValue=null;this.setFlags(r.AnnotationFlag.HIDDEN)}', '')
                },
                {src: 'node_modules/pdfjs-dist/cmaps/*', dest: 'dist/local/' + pkg.name + '/pdfjs'}, // do we want all map files?
                {src: 'node_modules/source-sans-pro/WOFF2/OTF/*', dest: 'dist/local/' + pkg.name + '/fonts'},
                {src: 'node_modules/@dbp-toolkit/common/src/spinner.js', dest: 'dist/local/' + pkg.name, rename: 'spinner.js'},
                {src: 'node_modules/@dbp-toolkit/common/misc/browser-check.js', dest: 'dist/local/' + pkg.name, rename: 'browser-check.js'},
                {src: 'assets/icon-*.png', dest: 'dist/local/' + pkg.name},
                {src: 'assets/*-placeholder.png', dest: 'dist/local/' + pkg.name},
                {src: 'assets/manifest.json', dest: 'dist', rename: pkg.name + '.manifest.json'},
                {src: 'assets/*.metadata.json', dest: 'dist'},
                {src: 'node_modules/@dbp-toolkit/common/assets/icons/*.svg', dest: 'dist/local/@dbp-toolkit/common/icons'},
                {src: 'node_modules/tabulator-tables/dist/css', dest: 'dist/local/@dbp-toolkit/file-handling/tabulator-tables'},
                {src: 'node_modules/qr-scanner/qr-scanner-worker.*', dest: 'dist/local/qr-code-scanner'},
            ],
        }),
        useBabel && babel({
          include: [
              'src/**',
              'node_modules/pdfjs-dist/**', // uses Promise.allSettled
          ],
          babelHelpers: 'runtime',
          babelrc: false,
          presets: [[
            '@babel/preset-env', {
              loose: true,
              bugfixes: true,
              targets: {
                esmodules: true
              }
            }
          ]],
          plugins: [[
            '@babel/plugin-transform-runtime', {
              corejs: 3,
              useESModules: true
            }
          ],
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-syntax-import-meta']
        }),
        watch ? serve({
          contentBase: '.',
          host: '127.0.0.1',
          port: 8001,
          historyApiFallback: basePath + pkg.name + '.html',
          https: USE_HTTPS ? generateTLSConfig() : false,
          headers: {
              'Content-Security-Policy': `default-src 'self' 'unsafe-eval' 'unsafe-inline' analytics.tugraz.at ${keyCloakServer} ${entryPointURL} httpbin.org ${nextcloudBaseURL} www.handy-signatur.at ${pdfAsQualifiedlySigningServer} ; img-src * blob: data:`
          },
        }) : false
    ]
};
