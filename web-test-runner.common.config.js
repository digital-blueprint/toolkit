import process from 'node:process';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { playwrightLauncher } from '@web/test-runner-playwright';

import { installBrowsersForNpmInstall, registry } from 'playwright-core/lib/server';

async function setup() {
    const browsersToInstall = [];
    if (!process.env.FIREFOX_BIN) {
        browsersToInstall.push('firefox');
    }
    if (!process.env.CHROMIUM_BIN) {
        browsersToInstall.push('chromium');
    }
    if (browsersToInstall.length > 0) {
        await installBrowsersForNpmInstall(browsersToInstall);
    }
    if (!process.env.FIREFOX_BIN) {
        process.env.FIREFOX_BIN = registry.findExecutable('firefox').executablePath();
    }
    if (!process.env.CHROMIUM_BIN) {
        process.env.CHROMIUM_BIN = registry.findExecutable('chromium').executablePath();
    }
}

function getPortFromDirectory() {
    // Workaround for https://github.com/modernweb-dev/web/issues/1951
    const relativePath = path.relative(path.dirname(fileURLToPath(import.meta.url)), process.cwd());
    return 20000 + (parseInt(crypto.createHash('sha256').update(relativePath).digest('hex'), 16) % 10000);
}

await setup();

export default {
    files: 'dist/*.js',
    port: getPortFromDirectory(),
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
