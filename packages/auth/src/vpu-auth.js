import {defineCustomElement} from 'vpu-common/utils';
import {Auth} from './auth.js';
import {AuthButton} from './auth-button.js';

defineCustomElement('vpu-auth', Auth);
defineCustomElement('vpu-auth-button', AuthButton);
