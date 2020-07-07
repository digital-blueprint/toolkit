import path from 'path';
import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import consts from 'rollup-plugin-consts';
import del from 'rollup-plugin-delete';
import json from '@rollup/plugin-json';

const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

function getBuildInfo() {
    const child_process = require('child_process');
    const url = require('url');

    let remote = child_process.execSync('git config --get remote.origin.url').toString().trim();
    let commit = child_process.execSync('git rev-parse --short HEAD').toString().trim();

    let parsed = url.parse(remote);
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
    input: (build !='test') ? ['src/vpu-app-shell.js', 'src/vpu-activity-example.js'] : glob.sync('test/**/*.js'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].[format].js',
        format: 'esm',
        sourcemap: true
      },
    onwarn: function (warning, warn) {
        // ignore chai warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        // keycloak bundled code uses eval
        if (warning.code === 'EVAL') {
            return;
        }
        warn(warning);
    },
    plugins: [
        del({
            targets: 'dist/*'
          }),
        consts({
            environment: build,
            buildinfo: getBuildInfo(),
        }),
        resolve({
          customResolveOptions: {
            // ignore node_modules from vendored packages
            moduleDirectory: path.join(process.cwd(), 'node_modules')
          }
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        json(),
        copy({
            targets: [
                {src: 'assets/silent-check-sso.html', dest:'dist'},
                {src: 'assets/index.html', dest: 'dist'},
                {src: 'assets/*.json', dest: 'dist'},
                {src: 'node_modules/vpu-common/assets/icons/*.svg', dest: 'dist/local/vpu-common/icons'},
            ],
        }),
        (process.env.ROLLUP_WATCH === 'true') ? serve({
            contentBase: 'dist',
            historyApiFallback: '/index.html',
            host: '127.0.0.1', port: 8002}) : false
    ]
};
