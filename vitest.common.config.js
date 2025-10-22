import {defineConfig} from 'vitest/config';
import {installBrowsersForNpmInstall, registry} from 'playwright-core/lib/server';

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

await setup();

export default defineConfig({
    test: {
        include: ['dist/*.js'],
        exclude: [],
        globals: true,
        browser: {
            provider: 'playwright',
            enabled: true,
            headless: true,
            instances: [
                {
                    browser: 'chromium',
                    launch: {
                        executablePath: process.env.CHROMIUM_BIN,
                    },
                },
                {
                    browser: 'firefox',
                    launch: {
                        executablePath: process.env.FIREFOX_BIN,
                    },
                },
            ],
            screenshotFailures: false,
        },
    },
});