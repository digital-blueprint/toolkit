import process from 'node:process';
import path from 'node:path';
import crypto from 'node:crypto';
import {globSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {defaultReporter} from '@web/test-runner';
import {playwrightLauncher} from '@web/test-runner-playwright';

import {registry} from 'playwright-core/lib/coreBundle';

async function setup() {
    const browsersToInstall = [];
    if (!process.env.FIREFOX_BIN) {
        browsersToInstall.push('firefox');
    }
    if (!process.env.CHROMIUM_BIN) {
        browsersToInstall.push('chromium');
    }
    if (browsersToInstall.length > 0) {
        await registry.installBrowsersForNpmInstall(browsersToInstall);
    }
    if (!process.env.FIREFOX_BIN) {
        process.env.FIREFOX_BIN = registry.registry.findExecutable('firefox').executablePath();
    }
    if (!process.env.CHROMIUM_BIN) {
        process.env.CHROMIUM_BIN = registry.registry.findExecutable('chromium').executablePath();
    }
}

function getPortFromDirectory() {
    // Workaround for https://github.com/modernweb-dev/web/issues/1951
    const relativePath = path.relative(path.dirname(fileURLToPath(import.meta.url)), process.cwd());
    return (
        20000 +
        (parseInt(crypto.createHash('sha256').update(relativePath).digest('hex'), 16) % 10000)
    );
}

await setup();

export function createWebTestRunnerConfig(includeDirs = ['src']) {
    const sourceDirs = includeDirs.map((dir) => path.resolve(process.cwd(), dir) + path.sep);

    return {
        files: 'test/runner.js',
        port: getPortFromDirectory(),
        plugins: [
            {
                name: 'bundled-test-entries',
                serve(context) {
                    if (context.path !== '/test/runner.js') return;
                    const entries = globSync('dist/*.js').sort();
                    if (entries.length === 0)
                        throw new Error('Build the tests before running them.');
                    return entries
                        .map((file) => `import ${JSON.stringify(`../${file}`)};`)
                        .join('\n');
                },
            },
        ],
        reporters: [
            {
                onTestRunFinished({testCoverage}) {
                    if (!testCoverage) return;
                    // Filter after source-map remapping to exclude dependencies and test code.
                    testCoverage.coverageMap.filter(
                        (file) =>
                            file.endsWith('.js') && sourceDirs.some((dir) => file.startsWith(dir)),
                    );
                    testCoverage.summary = testCoverage.coverageMap.getCoverageSummary().data;
                },
            },
            defaultReporter(),
        ],
        testFramework: {
            config: {
                ui: 'tdd',
                timeout: 2000 * (process.env.CI === undefined ? 1 : 10),
            },
        },
        browsers: [
            playwrightLauncher({
                product: 'firefox',
                launchOptions: {
                    executablePath: process.env.FIREFOX_BIN,
                    headless: true,
                },
            }),
            playwrightLauncher({
                product: 'chromium',
                launchOptions: {
                    executablePath: process.env.CHROMIUM_BIN,
                    headless: true,
                },
            }),
        ],
    };
}

export default createWebTestRunnerConfig();
