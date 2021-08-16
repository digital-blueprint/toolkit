import {createInstance} from './i18n.js';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {Provider} from '@dbp-toolkit/provider';
import {Adapter} from '@dbp-toolkit/provider';
import {LanguageSelect} from '@dbp-toolkit/language-select';
import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";


class ProviderDemo extends ScopedElementsMixin(DBPLitElement) {

    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
    }

    static get scopedElements() {
        return {
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-login-button': LoginButton,
            'dbp-language-select': LanguageSelect,
            'dbp-provider': Provider,
            'dbp-provider-adapter': Adapter,
            'dbp-consumer': DemoConsumer,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.debug('ProviderDemo (' + this.id + ') attributeChangesCallback( ' + name + ', ' + oldValue + ', ' + newValue + ')');
        switch(name) {
            case 'lang':
                this.lang = newValue;
                this._i18n.changeLanguage(this.lang);
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
        const i18n = this._i18n;
        return html`
            <section class="section">
                <p>${i18n.t('demo.provider_description', {id: "root", description: "is the top most in hierarchy"})}</p>
                <pre>&lt;dbp-provider  id="root"  root="1" availability="global" >&lt;/dbp-provider&gt;</pre>
                <div class="container">
                    <h1 class="title">${i18n.t('demo.provider')}-Demo</h1>
                </div>
                <div class="container">
                    <dbp-auth-keycloak subscribe="requested-login-status" lang="${this.lang}" entry-point-url="${this.entryPointUrl}" url="https://auth-dev.tugraz.at/auth" realm="tugraz-vpu" client-id="auth-dev-mw-frontend-local" load-person try-login></dbp-auth-keycloak>
                    <dbp-login-button subscribe="auth" lang="${this.lang}" show-image></dbp-login-button>
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
                            <dbp-consumer id="c1" subscribe="border-color:bc,lang"></dbp-consumer>
                            <p>${i18n.t('demo.consumer_description', {id: "c2", subscriptions: "foo"})}</p>
                            <pre>&lt;dbp-consumer  id="c2"  subscribe="foo:foo" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c2" subscribe="foo:foo,lang"></dbp-consumer>
                            <p>${i18n.t('demo.consumer_description', {id: "c3", subscriptions: "availability:status"})}</p>
                            <p>Local <em>status</em> is provided as <em>availability</em></p>
                            <pre>&lt;dbp-consumer  id="c3"  subscribe="status:availability"  border-color="orange" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c3" subscribe="status:availability,lang" border-color="orange"></dbp-consumer>
                            <p>${i18n.t('demo.consumer_description', {id: "c4", subscriptions: "unknown-name:status"})}</p>
                            <p>Remote <em>unknown-name</em> does not exist, the default value is overwritten by <em>undefined</em></i></p>
                            <pre>&lt;dbp-consumer  id="c4"  subscribe="status:unknown-name"  border-color="darkgray" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c4" subscribe="status:unknown-name" border-color="darkgray"></dbp-consumer>
                        </div>
                    </dbp-provider>
                </dbp-provider>
                
                <h2> DBP Provider Adapter</h2>
                <p> The dbp-provider is for third party webcomponents, which we want to configure with a provider.</p>
                <pre>&lt;dbp-provider  id="demoadapter"  dbp-style-red="color:red;" dbp-style-green="color:green;" >&lt;/dbp-provider&gt;</pre>
                <dbp-provider id="demoadapter"
                              dbp-style-red="color:red;" dbp-style-green="color:green;">
                    <pre>&lt;dbp-provider-adapter  id="a1"  subscribe="style:dbp-style-red" >&lt;/dbp-provider-adapter&gt;</pre>
                    <dbp-provider-adapter id="a1" subscribe="style:dbp-style-red">
                        <p> I'm a normal p tag without attributes and without style. </p>
                        <p>  I'm a normal p tag without attributes and without style. </p>
                        <p>  I'm a normal p tag without attributes and without style. </p>
                    </dbp-provider-adapter>
                    <pre>&lt;dbp-provider-adapter  id="a2"  subscribe="style:dbp-style-green" >&lt;/dbp-provider-adapter&gt;</pre>
                    <dbp-provider-adapter id="a2" subscribe="style:dbp-style-green">
                        <p style="background-color:green;"> I'm a normal p tag without attributes and without style. <span style="color:blue;"> I'm blue dabedidabedei...</span> </p>
                    </dbp-provider-adapter>
                </dbp-provider>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-provider-demo', ProviderDemo);

// =======================================================

class DemoConsumer extends DBPLitElement {
    constructor() {
        super();

        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.entryPointUrl = '';
        // default values
        this.foo = 100;
        this.bar = 900;
        this.ping = 0;
        this.borderColor = 'green';

        this.status = 'local';

        console.debug('DemoConsumer constructor()');
    }

    connectedCallback() {
        super.connectedCallback();
        console.debug('DemoConsumer(' + this.id + ') connectedCallback()');
        this.render();
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            foo: { type: String },
            bar: { type: String },
            gong: { type: String },
            borderColor: { type: String, attribute: 'border-color' },
            ping: { type: String }
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        console.debug('DemoConsumer(' + this.id + ') attributeChangesCallback( ' + name + ', ' + oldValue + ', ' + newValue + ')');
        switch(name) {
            case 'lang':
                this.lang = newValue;
                this._i18n.changeLanguage(this.lang);
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
        const i18n = this._i18n;
        if (! this.connected) {
            return `not connected!`;
        }
        console.debug('DemoConsumer(' + this.id + ') render()');

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

customElements.define('dbp-consumer', DemoConsumer);
