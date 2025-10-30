import {AppShell as AppShellNew} from './app-shell.js';
import {AppShell as AppShellLegacy} from './app-shell-legacy.js';
import {getFeatureFlag, registerFeatureFlag} from '@dbp-toolkit/common';

registerFeatureFlag('app-shell-ng');
const AppShell = getFeatureFlag('app-shell-ng') ? AppShellNew : AppShellLegacy;

export {AppShell};
