import * as commonUtils from './utils';
import {
    Button,
    Icon,
    InlineNotification,
    LoadingButton,
    MiniSpinner,
    Spinner,
    Translated,
} from './index';

commonUtils.defineCustomElement('dbp-mini-spinner', MiniSpinner);
commonUtils.defineCustomElement('dbp-spinner', Spinner);
commonUtils.defineCustomElement('dbp-icon', Icon);
commonUtils.defineCustomElement('dbp-button', Button);
commonUtils.defineCustomElement('dbp-loading-button', LoadingButton);
commonUtils.defineCustomElement('dbp-inline-notification', InlineNotification);
commonUtils.defineCustomElement('dbp-translated', Translated);
