import * as commonUtils from './common-utils.js';
import {
    Button,
    Icon,
    InlineNotification,
    LoadingButton,
    IconButton,
    MiniSpinner,
    Spinner,
    Translated,
    Translation,
    DBPSelect,
    Provider,
    ProviderAdapter,
} from './index.js';

commonUtils.defineCustomElement('dbp-mini-spinner', MiniSpinner);
commonUtils.defineCustomElement('dbp-spinner', Spinner);
commonUtils.defineCustomElement('dbp-icon', Icon);
commonUtils.defineCustomElement('dbp-button', Button);
commonUtils.defineCustomElement('dbp-loading-button', LoadingButton);
commonUtils.defineCustomElement('dbp-icon-button', IconButton);
commonUtils.defineCustomElement('dbp-inline-notification', InlineNotification);
commonUtils.defineCustomElement('dbp-translated', Translated);
commonUtils.defineCustomElement('dbp-translation', Translation);
commonUtils.defineCustomElement('dbp-select', DBPSelect);
commonUtils.defineCustomElement('dbp-provider', Provider);
commonUtils.defineCustomElement('dbp-provider-adapter', ProviderAdapter);
