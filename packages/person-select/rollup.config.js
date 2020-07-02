import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import url from "@rollup/plugin-url"
import consts from 'rollup-plugin-consts';
import del from 'rollup-plugin-delete';

const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default {
    input: (build != 'test') ? ['src/vpu-person-select.js', 'src/vpu-person-select-demo.js'] : glob.sync('test/**/*.js'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].[format].js',
        format: 'esm',
        sourcemap: true
    },
    onwarn: function (warning, warn) {
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
        }),
        resolve(),
        commonjs(),
        url({
            limit: 0,
            include: [
                "node_modules/select2/**/*.css",
            ],
            emitFiles: true,
            fileName: 'shared/[name].[hash][extname]'
        }),
        json(),
        (build !== 'local' && build !== 'test') ? terser() : false,
        copy({
            targets: [
                {src: 'assets/index.html', dest: 'dist'},
                {src: 'node_modules/vpu-common/assets/icons/*.svg', dest: 'dist/local/vpu-common/icons'},
            ],
        }),
        (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
    ]
};
