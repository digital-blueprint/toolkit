import {i18n} from './i18n.js';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {Provider} from '@dbp-toolkit/provider';
import {LanguageSelect} from '@dbp-toolkit/language-select';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";


class ProviderDemo2 extends ScopedElementsMixin(DBPLitElement) {

    constructor() {
        super();
        this.lang = 'de';
    }

    static get scopedElements() {
        return {
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-login-button': LoginButton,
            'dbp-language-select': LanguageSelect,
            'dbp-provider': Provider,
            'dbp-consumer2': DemoConsumer2,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('ProviderDemo (' + this.id + ') attributeChangesCallback( ' + name + ', ' + oldValue + ', ' + newValue + ')');
        switch(name) {
            case 'lang':
                this.lang = newValue;
                i18n.changeLanguage(this.lang);
                break;
            default:
                super.attributeChangedCallback(name, oldValue, newValue);
        }
        this.render();
    }

    static get styles() {
        // language=css
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            css`
            h1.title {margin-bottom: 1em;}
            div.container {margin-bottom: 1.5em; padding-left:20px;}
            `
        ];
    }

    get id() {
        return this.getAttribute('id');
    }

    render() {
        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">${i18n.t('demo.provider')}-Demo 2</h1>
                </div>
                <div class="container">
                    <dbp-auth-keycloak lang="${this.lang}" url="https://auth-dev.tugraz.at/auth" realm="tugraz" client-id="auth-dev-mw-frontend-local" load-person try-login></dbp-auth-keycloak>
                    <dbp-login-button lang="${this.lang}" show-image></dbp-login-button>
                    <dbp-language-select></dbp-language-select>
                </div>
                <div class="container">
                    <h2>${i18n.t('demo.consumer')}</h2>
                    <p>${i18n.t('demo.consumer_description', {id: "c1", subscriptions: "border-color, lang"})}</p>
                    <pre>&lt;dbp-consumer2  id="c1"  subscribe="border-color:bc,lang:lang" &gt;&lt;/dbp-consumer&gt;</pre>
                    <dbp-consumer2 id="c1" subscribe="border-color:bc,lang:lang"></dbp-consumer2>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-provider-demo2', ProviderDemo2);

// =======================================================

class DemoConsumer2 extends DBPLitElement {
    constructor() {
        super();

        this.lang = 'de';
        // default values
        this.foo = 100;
        this.bar = 900;
        this.borderColor = 'green';

        this.status = 'local';

        console.log('DemoConsumer2 constructor()');
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        console.log('DemoConsumer2(' + this.id + ') connectedCallback()');
        this.render();
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
            foo: { type: String },
            bar: { type: String },
            gong: { type: String },
            borderColor: { type: String, attribute: 'border-color' },
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        console.log('DemoConsumer2(' + this.id + ') attributeChangesCallback( ' + name + ', ' + oldValue + ', ' + newValue + ')');
        switch(name) {
            case 'lang':
                this.lang = newValue;
                i18n.changeLanguage(this.lang);
                break;
            case 'foo':
                this.foo = parseInt(newValue);
                break;
            case 'bar':
                this.bar = parseInt(newValue);
                break;
            case 'status':
                this.status = newValue;
                break;
            case 'border-color':
                this['border-color'] = newValue;
                break;
            default:
                super.attributeChangedCallback(name, oldValue, newValue);
        }
        this.render();
    }

    get id() {
        return this.getAttribute('id');
    }

    render() {
        if (! this.connected) {
            return `not connected!`;
        }
        console.log('DemoConsumer2(' + this.id + ') render()');

        const sum = this.foo + this.bar;
        return html`
        <div style="border: ${this['border-color']} dotted; padding: 10px;">
            <table style="width:200px;">
                <tr style="background-color: #aaa;">
                    <th style="text-align: left;">${i18n.t('consumer.item')}</th>
                    <th style="text-align: right;">${i18n.t('consumer.price')}</th>
                </tr>
                <tr><td>foo</td><td style="text-align: right;">${this.foo}</td></tr>
                <tr><td>bar</td><td style="text-align: right;">${this.bar}</td></tr>
                <tr><td>${i18n.t('consumer.sum')}</td><td style="text-align: right;">${sum}</td></tr>
            </table>
            <p>Status: <b>${this.status}</b></p>
        </div>
        `;
    }

}

customElements.define('dbp-consumer2', DemoConsumer2);
