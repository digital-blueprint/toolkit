import * as commonUtils from './utils';
import {
    Button,
    Icon,
    InlineNotification,
    LoadingButton,
    IconButton,
    MiniSpinner,
    Spinner,
    Translated,
    Translation
} from './src/index.js';

commonUtils.defineCustomElement('dbp-mini-spinner', MiniSpinner);
commonUtils.defineCustomElement('dbp-spinner', Spinner);
commonUtils.defineCustomElement('dbp-icon', Icon);
commonUtils.defineCustomElement('dbp-button', Button);
commonUtils.defineCustomElement('dbp-loading-button', LoadingButton);
commonUtils.defineCustomElement('dbp-icon-button', IconButton);
commonUtils.defineCustomElement('dbp-inline-notification', InlineNotification);
commonUtils.defineCustomElement('dbp-translated', Translated);
commonUtils.defineCustomElement('dbp-translation', Translation);
