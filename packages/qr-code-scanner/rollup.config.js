import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import url from "@rollup/plugin-url";
import consts from 'rollup-plugin-consts';
import del from 'rollup-plugin-delete';
import fs from "fs";
import selfsigned from "selfsigned";
import {getPackagePath} from "../../rollup.utils";

const build = (typeof process.env.BUILD !== 'undefined') ? process.env.BUILD : 'local';
console.log("build: " + build);

const USE_HTTPS = true;

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


export default (async () => {
    return {
        input: (build != 'test') ? ['src/dbp-qr-code-scanner.js', 'src/dbp-qr-code-scanner-demo.js'] : glob.sync('test/**/*.js'),
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
            json(),
            url({
                limit: 0,
                emitFiles: true,
                fileName: 'shared/[name].[hash][extname]'
            }),
            (build !== 'local' && build !== 'test') ? terser() : false,
            copy({
                targets: [
                    {src: 'assets/index.html', dest: 'dist'},
                    {src: 'assets/favicon.ico', dest: 'dist'},
                    {src: await getPackagePath('dbp-common', 'assets/icons/*.svg'), dest: 'dist/local/dbp-common/icons'},
                ]
            }),
            (process.env.ROLLUP_WATCH === 'true') ? serve({
                contentBase: 'dist',
                host: '127.0.0.1',
                port: 8002,
                https: USE_HTTPS ? generateTLSConfig() : false
            }) : false
        ]
    }
});
