import {defineCustomElement} from 'dbp-common/utils';
import {AuthKeycloak} from './auth-keycloak.js';
import {LoginButton} from './login-button.js';

defineCustomElement('dbp-auth-keycloak', AuthKeycloak);
defineCustomElement('dbp-login-button', LoginButton);
