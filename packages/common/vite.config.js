import { defineConfig } from 'vite';
import { globSync } from 'glob';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { createHtmlPlugin } from 'vite-plugin-html';
import { getDistPath } from '@dbp-toolkit/dev-utils';
import { createRequire } from 'node:module';
import process from 'node:process';
import { resolve } from 'path';
import sirv from 'sirv';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const build = process.env.BUILD ?? 'local';
console.log('build: ' + build);

export default defineConfig(async () => {
    const isTest = build === 'test';

  // Define your static copy targets once
  const staticTargets = [
    {
      src: 'assets/icons/*.svg',
      dest: await getDistPath(pkg.name, 'icons')
    },
    // Add other targets as needed
  ];

    // Get entry points
    const input = isTest
        ? Object.fromEntries(
            globSync('test/**/*.js').map(file => [
                file.replace(/^test\//, '').replace(/\.js$/, ''),
                resolve(file)
            ])
        )
        : {
            demo: resolve('src/demo/demo.js'),
            components: resolve('src/components.js'),
        };

    return {
        root: '.',
        base: './',

        build: {
            outDir: 'dist',
            emptyOutDir: true,
            sourcemap: true,
            lib: {
                entry: input,
                formats: ['es'],
                fileName: (format, entryName) => `${entryName}.js`
            },
            rollupOptions: {
                output: {
                    chunkFileNames: 'shared/[name].[hash].js',
                }
            }
        },
        plugins: [
            createHtmlPlugin({
                template: 'assets/index.ejs',
                filename: 'index.html',
                inject: {
                    data: {
                        // Add any other data you want to use in your template
                    }
                }
            }),
            // Copy static assets
            viteStaticCopy({
                targets: [
                    {
                        src: 'assets/icons/*.svg',
                        dest: await getDistPath(pkg.name, 'icons')
                    },
                ]
            }),
      // Auto-create dev server routes from staticTargets
        {
            name: 'serve-static-copy-targets',
            configureServer(server) {
            staticTargets.forEach(target => {
                // Extract source directory (remove glob patterns)
                const srcDir = target.src.replace('/*.svg', '').replace('/*', '');
                const virtualPath = `/src/${target.dest}`;
                
                console.log(`Mounting ${srcDir} -> ${virtualPath}`);
                server.middlewares.use(virtualPath, sirv(srcDir, {
                dev: true,
                single: false
                }));
            });
            }
        }
        ],
        server: {
            host: '127.0.0.1',
            port: 8002,
            open: false
        }
    };
});
