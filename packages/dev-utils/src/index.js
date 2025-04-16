import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';
import process from 'node:process';
import {createRequire} from 'node:module';
import child_process from 'node:child_process';
import selfsigned from 'selfsigned';
import findCacheDir from 'find-cache-directory';

/**
 * Returns true if git is installed and we are inside a git working tree
 *
 * @returns {boolean} if git can be used
 */
function canUseGit() {
    try {
        // This fails if there is no git installed, or if we aren't inside a git checkout
        child_process.execSync('git rev-parse --is-inside-work-tree', {
            stdio: 'pipe',
        });
    } catch {
        return false;
    }
    return true;
}

export function getBuildInfo(build) {
    let commitHash, commitUrl;

    if (canUseGit()) {
        let remote = child_process.execSync('git config --get remote.origin.url').toString().trim();
        commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

        if (remote.indexOf('git@') === 0) {
            remote = remote.replace(':', '/').replace('git@', 'https://');
        }

        let parsed = url.parse(remote);
        let newPath = parsed.path.slice(
            0,
            parsed.path.lastIndexOf('.') > -1 ? parsed.path.lastIndexOf('.') : undefined,
        );
        commitUrl = parsed.protocol + '//' + parsed.host + newPath + '/commit/' + commitHash;
    } else {
        console.warn('No git information available, commit hash and commit url will be missing');
        commitHash = '';
        commitUrl = '';
    }

    return {
        info: commitHash,
        url: commitUrl,
        time: new Date().toISOString(),
        env: build,
    };
}

export async function getDistPath(packageName, assetPath) {
    if (assetPath === undefined) assetPath = '';
    // make sure the package exists to avoid typos
    await getPackagePath(packageName, '');
    return path.join('local', packageName, assetPath);
}

/**
 * Finds the parent directory of the given path that contains a package.json file.
 * This is used to find the root directory of a package.
 *
 * @param {string} startPath
 * @returns {string}
 */
function findPackageJsonDir(startPath) {
    const currentPath = path.resolve(startPath);
    if (fs.existsSync(path.join(currentPath, 'package.json'))) {
        return currentPath;
    }
    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) {
        throw new Error(`No package.json found in the directory tree of ${startPath}`);
    }
    return findPackageJsonDir(parentPath);
}

export async function getPackagePath(packageName, assetPath) {
    let packageRoot;
    const require = createRequire(import.meta.url);
    let current = require.resolve(path.join(process.cwd(), './package.json'));
    if (require(current).name === packageName) {
        // current package
        packageRoot = path.dirname(current);
    } else {
        // Other packages from nodes_modules etc.
        try {
            // For packages that export a package.json
            // (also non-js like @dbp-toolkit/font-source-sans-pro)
            packageRoot = path.dirname(require.resolve(packageName + '/package.json'));
        } catch {
            // If there is no package.json export we try the default export
            // and search for a package.json in the parent directories.
            // That's the case with tabulator-tables for example
            packageRoot = findPackageJsonDir(require.resolve(packageName));
        }
    }
    return path.relative(process.cwd(), path.join(packageRoot, assetPath));
}

/**
 * Creates a dummy dev server certificate, caches it and returns it.
 */
export async function generateTLSConfig() {
    const certDir = findCacheDir({name: 'dbp-dev-server-cert'});
    const keyPath = path.join(certDir, 'server.key');
    const certPath = path.join(certDir, 'server.cert');

    await fs.promises.mkdir(certDir, {recursive: true});

    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        const attrs = [{name: 'commonName', value: 'dbp-dev.localhost'}];
        const pems = selfsigned.generate(attrs, {
            keySize: 2048,
            algorithm: 'sha256',
            days: 9999,
        });
        await fs.promises.writeFile(keyPath, pems.private);
        await fs.promises.writeFile(certPath, pems.cert);
    }

    return {
        key: await fs.promises.readFile(keyPath),
        cert: await fs.promises.readFile(certPath),
    };
}
