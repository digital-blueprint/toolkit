import {AppShell as AppShellNew} from './app-shell.js';
import {AppShell as AppShellLegacy} from './app-shell-legacy.js';
import {getFeatureFlag, registerFeatureFlag} from '@dbp-toolkit/common';

registerFeatureFlag('app-shell-old');
const AppShell = !getFeatureFlag('app-shell-old') ? AppShellNew : AppShellLegacy;

export {AppShell};
