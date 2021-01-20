import {i18n} from './i18n.js';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {Provider} from '@dbp-toolkit/provider';
import {LanguageSelect} from '@dbp-toolkit/language-select';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";
import {DemoConsumer} from './consumer-demo'

class ProviderDemo extends ScopedElementsMixin(DBPLitElement) {

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
            'dbp-consumer': DemoConsumer,
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
                    <h1 class="title">${i18n.t('demo.provider')}-Demo 1</h1>
                </div>
                <div class="container">
                    <dbp-auth-keycloak lang="${this.lang}" url="https://auth-dev.tugraz.at/auth" realm="tugraz" client-id="auth-dev-mw-frontend-local" load-person try-login></dbp-auth-keycloak>
                    <dbp-login-button lang="${this.lang}" show-image></dbp-login-button>
                    <dbp-language-select></dbp-language-select>
                </div>
                <dbp-provider id="demo"
                              bc="blue">
                    <dbp-provider id="foo-bar"
                                  foo="9"
                                  bar="20">
                        <div class="container">
                            <h2>${i18n.t('demo.provider')}</h2>
                            <p>${i18n.t('demo.provider_description', {id: "demo", description: "has only \"border-color\" to offer"})}</p>                            <pre>&lt;dbp-provider  id="demo"  bc="blue" &gt;&lt;/dbp-provider&gt;</pre>
                            <p>${i18n.t('demo.provider_description', {id: "foo-bar", description: "has some values in its store"})}</p>
                            <pre>&lt;dbp-provider  id="foo-bar"  foo="9" bar="20" &gt;&lt;/dbp-provider&gt;</pre>

                            <h2>${i18n.t('demo.consumer')}</h2>
                            <p>${i18n.t('demo.consumer_description', {id: "c1", subscriptions: "border-color"})}</p>
                            <pre>&lt;dbp-consumer  id="c1"  subscribe="border-color:bc" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c1" subscribe="border-color:bc,lang:lang"></dbp-consumer>
                            <p>${i18n.t('demo.consumer_description', {id: "c2", subscriptions: "foo"})}</p>
                            <pre>&lt;dbp-consumer  id="c2"  subscribe="foo:foo" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c2" subscribe="foo:foo,lang:lang"></dbp-consumer>
                            <p>${i18n.t('demo.consumer_description', {id: "c3", subscriptions: "availability:status"})}</p>
                            <p>Local <em>status</em> is provided as <em>availability</em></p>
                            <pre>&lt;dbp-consumer  id="c3"  subscribe="status:availability"  border-color="orange" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c3" subscribe="status:availability,lang:lang" border-color="orange"></dbp-consumer>
                            <p>${i18n.t('demo.consumer_description', {id: "c4", subscriptions: "unknown-name:status"})}</p>
                            <p>Remote <em>unknown-name</em> does not exist, the default value is overwritten by <em>undefined</em></i></p>
                            <pre>&lt;dbp-consumer  id="c4"  subscribe="status:unknown-name"  border-color="darkgray" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c4" subscribe="status:unknown-name" border-color="darkgray"></dbp-consumer>
                        </div>
                    </dbp-provider>
                </dbp-provider>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-provider-demo', ProviderDemo);
