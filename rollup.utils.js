import path from 'path';
import url from 'url';
import fs from 'fs';
import child_process from 'child_process';
import selfsigned from 'selfsigned';
import findCacheDir from 'find-cache-dir';

/**
 * Returns true if git is installed and we are inside a git working tree
 *
 * @returns {boolean} if git can be used
 */
function canUseGit() {
    try {
        // This fails if there is no git installed, or if we aren't inside a git checkout
        child_process.execSync('git rev-parse --is-inside-work-tree', {stderr : 'pipe', stdio : 'pipe'});
    } catch (error) {
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
        let newPath = parsed.path.slice(0, parsed.path.lastIndexOf('.') > -1 ? parsed.path.lastIndexOf('.') : undefined);
        commitUrl = parsed.protocol + '//' + parsed.host + newPath + '/commit/' + commitHash;
    } else {
        commitHash = '';
        commitUrl = '';
    }

    return {
        info: commitHash,
        url: commitUrl,
        time: new Date().toISOString(),
        env: build
    };
}

export async function getDistPath(packageName, assetPath) {
    if (assetPath === undefined)
        assetPath = '';
    // make sure the package exists to avoid typos
    await getPackagePath(packageName, '');
    return path.join('local', packageName, assetPath);
}

export async function getPackagePath(packageName, assetPath) {
    let packageRoot;
    let current = require.resolve('./package.json');
    if (require(current).name === packageName) {
        // current package
        packageRoot = path.dirname(current);
    } else {
        // Other packages from nodes_modules etc.
        packageRoot = path.dirname(require.resolve(packageName + '/package.json'));
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
        const pems = selfsigned.generate(attrs, {algorithm: 'sha256', days: 9999, keySize: 2048});
        await fs.promises.writeFile(keyPath, pems.private);
        await fs.promises.writeFile(certPath, pems.cert);
    }

    return {
        key: await fs.promises.readFile(keyPath),
        cert: await fs.promises.readFile(certPath)
    }
}