import '@webcomponents/scoped-custom-element-registry';
import {AppShell} from '@dbp-toolkit/app-shell';
import {Translation} from '@dbp-toolkit/common/src/translation';
import * as commonUtils from '@dbp-toolkit/common/utils';

commonUtils.defineCustomElement('dbp-toolkit-showcase', AppShell);
commonUtils.defineCustomElement('dbp-translation', Translation);
