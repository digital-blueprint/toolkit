import {defineCustomElement} from 'vpu-common/utils';
import {AuthKeycloak} from './auth-keycloak.js';
import {LoginButton} from './login-button.js';

defineCustomElement('vpu-auth-keycloak', AuthKeycloak);
defineCustomElement('vpu-login-button', LoginButton);
