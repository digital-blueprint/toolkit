
import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import url from "@rollup/plugin-url"
import del from 'rollup-plugin-delete';
import {getPackagePath, getDistPath} from '../../rollup.utils.js';

const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

export default (async () => {
    return {
        input: (build != 'test') ? ['src/dbp-person-profile.js', 'src/dbp-person-profile-demo.js'] : glob.sync('test/**/*.js'),
        output: {
            dir: 'dist',
            entryFileNames: '[name].js',
            chunkFileNames: 'shared/[name].[hash].[format].js',
            format: 'esm',
            sourcemap: true
        },
        plugins: [
            del({
                targets: 'dist/*'
            }),
            resolve(),
            commonjs(),
            url({
                limit: 0,
                include: [
                    await getPackagePath('select2', '**/*.css'),
                ],
                emitFiles: true,
                fileName: 'shared/[name].[hash][extname]'
            }),
            json(),
            (build !== 'local' && build !== 'test') ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},
                    {src: await getPackagePath('@dbp-toolkit/common', 'assets/icons/*.svg'), dest: 'dist/' + await getDistPath('@dbp-toolkit/common', 'icons')},
                ],
            }),
            (process.env.ROLLUP_WATCH === 'true') ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002}) : false
        ]
    };
})();