import process from 'node:process';
import {globSync} from 'node:fs';
import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import {createRequire} from 'node:module';
import {assetPlugin} from '@dbp-toolkit/dev-utils';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const build = typeof process.env.BUILD !== 'undefined' ? process.env.BUILD : 'local';
console.log('build: ' + build);
let isRolldown = process.argv.some((arg) => arg.includes('rolldown'));
const buildFull = process.env.ROLLUP_WATCH !== 'true' && build !== 'test';

export default {
    input:
        build != 'test'
            ? ['src/dbp-person-select.js', 'src/dbp-person-select-demo.js']
            : globSync('test/**/*.js'),
    output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name].[hash].js',
        format: 'esm',
        sourcemap: true,
        ...(isRolldown ? {minify: buildFull, cleanDir: true} : {}),
    },
    moduleTypes: {
        '.css': 'js', // work around rolldown handling the CSS import before the URL plugin cab
    },
    plugins: [
        !isRolldown &&
            del({
                targets: 'dist/*',
            }),
        await assetPlugin(pkg.name, 'dist', {
            copyTargets: [
                {src: 'assets/silent-check-sso.html', dest: 'dist'},
                {src: 'assets/index.html', dest: 'dist'},
            ],
        }),
        process.env.ROLLUP_WATCH === 'true'
            ? serve({contentBase: 'dist', host: '127.0.0.1', port: 8002})
            : false,
    ],
};
