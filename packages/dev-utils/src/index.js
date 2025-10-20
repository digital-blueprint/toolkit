import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';
import process from 'node:process';
import {createRequire} from 'node:module';
import child_process from 'node:child_process';
import selfsigned from 'selfsigned';
import findCacheDir from 'find-cache-directory';
import copyPlugin from 'rollup-plugin-copy';
import urlPlugin from '@rollup/plugin-url';

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

function getPackageJsonPath(packageName, parentPath) {
    const require = createRequire(import.meta.url);
    let current = require.resolve(path.join(process.cwd(), './package.json'));
    if (require(current).name === packageName) {
        // current package
        return current;
    } else {
        // Other packages from nodes_modules etc.
        try {
            // For packages that export a package.json
            // (also non-js like @dbp-toolkit/font-source-sans-pro)
            return require.resolve(packageName + '/package.json', {paths: [parentPath]});
        } catch {
            // If there is no package.json export we try the default export
            // and search for a package.json in the parent directories.
            // That's the case with tabulator-tables for example
            try {
                return path.join(
                    findPackageJsonDir(require.resolve(packageName, {paths: [parentPath]})),
                    'package.json',
                );
            } catch {
                throw new Error(`Cannot find package.json for package "${packageName}"`);
            }
        }
    }
}

export async function getPackagePath(packageName, assetPath) {
    // this does not support nested packages
    let packageRoot = path.dirname(getPackageJsonPath(packageName, process.cwd()));
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

/**
 * Given a root package name, recursively collects all dbp metadata from the
 * package and its (runtime) dependencies.
 */
async function collectDbpMetadata(packageName, _visited = new Set(), _path = null) {
    const packageJsonPath = getPackageJsonPath(packageName, _path || process.cwd());

    if (!fs.existsSync(packageJsonPath)) {
        return {};
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const actualPackageName = packageJson.name;

    if (_visited.has(actualPackageName)) {
        return {};
    }
    _visited.add(actualPackageName);

    let allMeta = {};

    if (packageJson.dbp) {
        allMeta[actualPackageName] = packageJson.dbp;
    }

    for (const depName of Object.keys(packageJson.dependencies || {})) {
        const depMeta = await collectDbpMetadata(depName, _visited, path.dirname(packageJsonPath));
        Object.assign(allMeta, depMeta);
    }

    return allMeta;
}

/**
 * Given a result from collectDbpMetadata(), returns an array of copy targets
 * suitable for use with rollup-plugin-copy.
 */
async function getCopyTargetsForDbpMetadata(metadata, bundleDest = 'dist') {
    const allTargets = [];

    for (const [packageName, packageMeta] of Object.entries(metadata)) {
        const assets = packageMeta.assets || [];

        const targets = await Promise.all(
            assets.map(async (asset) => {
                const {src, dest, srcPackage} = asset;

                // Handle src as array or string
                const srcArray = Array.isArray(src) ? src : [src];
                const resolvedSrcArray = await Promise.all(
                    srcArray.map((s) => getPackagePath(srcPackage, s)),
                );

                // Handle dest as array or string
                const destArray = Array.isArray(dest) ? dest : [dest];
                const resolvedDestArray = destArray.map((d) =>
                    path.join(bundleDest, 'local', packageName, d),
                );

                return {
                    src: Array.isArray(src) ? resolvedSrcArray : resolvedSrcArray[0],
                    dest: Array.isArray(dest) ? resolvedDestArray : resolvedDestArray[0],
                };
            }),
        );

        allTargets.push(...targets);
    }

    return allTargets;
}

/**
 * Given a package name, returns an array of copy targets,
 * suitable for use with rollup-plugin-copy.
 *
 * Add this to package.json to define assets that should be copied during build:
 *
 * "dbp": {
 *   "assets": [
 *     {
 *       "srcPackage": "@dbp-toolkit/common",
 *       "src": "assets/icons/*.svg",
 *       "dest": "icons"
 *     }
 *   ]
 * }
 *
 * - srcPackage: npm package name where files are located
 * - src: source path within srcPackage (string, array, or glob pattern)
 * - dest: destination directory (string or array)
 */
export async function getCopyTargets(packageName, bundleDest) {
    const metadata = await collectDbpMetadata(packageName);
    return getCopyTargetsForDbpMetadata(metadata, bundleDest);
}

/**
 * Given a package name, returns URL options for use with rollup-plugin-url.
 *
 * Add this to package.json to define files that should be copied during build,
 * and provided as URLs when imported:
 *
 * "dbp": {
 *   "urls": [
 *     {
 *       "srcPackage": "select2",
 *       "src": "**\/*.css"
 *     }
 *   ]
 * }
 *
 * - srcPackage: npm package name where files are located
 * - src: source path within srcPackage (string, array, or glob pattern)
 *
 * All the matching files will be copied and renamed when imported, and the
 * import will return a relative path to the copied file.
 * Use getAbsoluteURL() to get an absolute URL to the file at runtime.
 */
export async function getUrlOptions(packageName, bundleDest) {
    const metadata = await collectDbpMetadata(packageName);

    let allIncludes = [];
    for (const packageMeta of Object.values(metadata)) {
        const urls = packageMeta.urls || [];
        for (const url of urls) {
            const {src, srcPackage} = url;
            const srcArray = Array.isArray(src) ? src : [src];
            for (const srcEntry of srcArray) {
                allIncludes.push(await getPackagePath(srcPackage, srcEntry));
            }
        }
    }
    allIncludes = Array.from(new Set(allIncludes));

    return {
        limit: 0,
        include: allIncludes,
        exclude: allIncludes.length > 0 ? [] : ['**'],
        emitFiles: true,
        fileName: bundleDest + '/[name].[hash][extname]',
    };
}

/**
 * A hack to monkey patch \@rollup/plugin-url to set includes as filter
 * hooks for better performance with rolldown.
 */
function urlPluginHack(options = {}) {
    // Logic taken from @rollup/pluginutils (spdx:MIT) so we match the patterns
    // of createFilter() exactly (otherwise relative paths are broken)
    const normalizePath = function normalizePath(filename) {
        const normalizePathRegExp = new RegExp(`\\${path.win32.sep}`, 'g');
        return filename.replace(normalizePathRegExp, path.posix.sep);
    };

    function getMatcherString(id) {
        if (path.isAbsolute(id) || id.startsWith('**')) {
            return normalizePath(id);
        }
        const basePath = normalizePath(path.resolve('')).replace(/[-^$*+?.()|[\]{}]/g, '\\$&');
        return path.posix.join(basePath, normalizePath(id));
    }

    let plugin = urlPlugin(options);
    plugin.load = {
        filter: {
            id: {
                include: (options.include ?? []).map((id) => getMatcherString(id)),
                exclude: (options.exclude ?? []).map((id) => getMatcherString(id)),
            },
        },
        handler: plugin.load,
    };

    return plugin;
}

/**
 * Returns a Rollup plugin which handles asset copying and URL imports.
 *
 * @returns {Promise<Array>} Array of Rollup plugins
 */
export async function assetPlugin(packageName, bundleDest = 'dist') {
    return [
        copyPlugin({
            copySync: true,
            targets: await getCopyTargets(packageName, bundleDest),
        }),
        urlPluginHack(await getUrlOptions(packageName, 'shared')),
    ];
}
