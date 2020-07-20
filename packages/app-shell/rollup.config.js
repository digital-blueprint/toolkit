import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import consts from 'rollup-plugin-consts';
import del from 'rollup-plugin-delete';
import json from '@rollup/plugin-json';
import {getBuildInfo, getPackagePath} from '../../rollup.utils.js';

const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default (async () => {
    return {
        input: (build !='test') ? ['src/dbp-app-shell.js', 'src/dbp-activity-example.js'] : glob.sync('test/**/*.js'),
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
                buildinfo: getBuildInfo(build),
            }),
            resolve(),
            commonjs(),
            json(),
            copy({
                targets: [
                    {src: 'assets/silent-check-sso.html', dest:'dist'},
                    {src: 'assets/index.html', dest: 'dist'},
                    {src: 'assets/*.json', dest: 'dist'},
                    {src: await getPackagePath('dbp-common', 'assets/icons/*.svg'), dest: 'dist/local/dbp-common/icons'},
                ],
            }),
            (process.env.ROLLUP_WATCH === 'true') ? serve({
                contentBase: 'dist',
                historyApiFallback: '/index.html',
                host: '127.0.0.1', port: 8002}) : false
        ]
    }
})();