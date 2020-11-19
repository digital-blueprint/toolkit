import {i18n} from './i18n.js';
import {css, html, LitElement} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {AuthKeycloak, LoginButton} from '@dbp-toolkit/auth';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {Provider} from '@dbp-toolkit/provider';


class ProviderDemo extends ScopedElementsMixin(LitElement) {

    constructor() {
        super();
        this.lang = 'de';
    }

    static get scopedElements() {
        return {
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-login-button': LoginButton,
            'dbp-provider': Provider,
            'dbp-consumer': DemoConsumer,
        };
    }

    static get properties() {
        return {
            lang: { type: String },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
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

    render() {
        return html`
            <section class="section">
                <p>Provider <em>"root"</em> is the top most in hirachy:</p>
                <dbp-provider id="root"
                              init="availability=global"
                ></dbp-provider>
<pre>
&lt;dbp-provider  id="root"  init="availability=global" &gt;&lt;/dbp-provider&gt;
</pre>
                <div class="container">
                    <h1 class="title">Provider-Demo</h1>
                </div>
                <div class="container">
                    <dbp-auth-keycloak lang="${this.lang}" url="https://auth-dev.tugraz.at/auth" realm="tugraz" client-id="auth-dev-mw-frontend-local" load-person try-login></dbp-auth-keycloak>
                    <dbp-login-button lang="${this.lang}" show-image></dbp-login-button>
                </div>
                <div class="container">
                    <h2>Provider</h2>
                    <p>Provider <em>"demo"</em> has only <em>border-color</em> to offer:</p>
                    <dbp-provider id="demo"
                                  init="bc=blue"
                    ></dbp-provider>
<pre>
&lt;dbp-provider  id="demo"  init="bc=blue" &gt;&lt;/dbp-provider&gt;
</pre>
                    <p>Provider <em>"foo-bar"</em> has some values in its store:</p>
                    <dbp-provider id="foo-bar"
                                  init="foo=9,bar=20"
                    ></dbp-provider>
<pre>
&lt;dbp-provider  id="foo-bar"  init="foo=9,bar=20" &gt;&lt;/dbp-provider&gt;
</pre>
                    <h2>Consumer</h2>
                    <p>Consumer <em>"c1"</em> will only subscribe to <em>border-color</em></p>
<pre>
&lt;dbp-consumer  id="c1"  subscribe="bc:border-color" &gt;&lt;/dbp-consumer&gt;
</pre>
                    <dbp-consumer id="c1"
                                  subscribe="bc:border-color"
                    ></dbp-consumer>
                    <p>Consumer <em>"c2"</em> subscribes to <em>foo</em></p>
<pre>
&lt;dbp-consumer  id="c2"  subscribe="foo:foo" &gt;&lt;/dbp-consumer&gt;
</pre>
                    <dbp-consumer id="c2"
                                  subscribe="foo:foo"
                    ></dbp-consumer>
                    <p>Consumer <em>"c3"</em> subscribes for <em>status</em> wich is provided as <em>availability</em></p>
<pre>
&lt;dbp-consumer  id="c3"  subscribe="availability:status"  border-color="orange" &gt;&lt;/dbp-consumer&gt;
</pre>
                    <dbp-consumer id="c3"
                                  subscribe="availability:status"
                                  border-color="orange"
                    ></dbp-consumer>
                    <p>Consumer <em>"c4"</em> subscribes for <em>status</em> wich is provided as <em>unknown-name</em> which does not exist...</p>
<pre>
&lt;dbp-consumer  id="c4"  subscribe="unknown-name:status"  border-color="darkgray" &gt;&lt;/dbp-consumer&gt;
</pre>
                    <dbp-consumer id="c4"
                                  subscribe="unknown-name:status"
                                  border-color="darkgray"
                    ></dbp-consumer>
                </div>
            </section>
        `;
    }
}

commonUtils.defineCustomElement('dbp-provider-demo', ProviderDemo);

// =======================================================

class Consumer extends HTMLElement {
    constructor() {
        super();
        this.connected = false;
        this.deferInherited = false;
        this.deferSubscribe = false;
        this.deferUnSubscribe = false;

        // default values
        this.inherit = '';
        this.subscribe = '';
        this.unsubscribe = '';

        this.attachShadow({mode: 'open'});
        console.log('Consumer constructor()');
    }

    connectedCallback() {
        console.log('Consumer(' + this.id() + ') connectedCallback()');

        if (this.deferInherited) {
            const attrs = this.inherit.split(',');
            attrs.forEach(element => this.askProviderFor(element));
            this.deferInherited = false;
        }
        if (this.deferUnSubscribe) {
            const attrs = this.unsubscribe.split(',');
            attrs.forEach(element => this.subscribeProviderFor(element));
            this.deferSubscribe = false;
            this.unsubscribe = '';
        }
        if (this.deferSubscribe) {
            const attrs = this.subscribe.split(',');
            attrs.forEach(element => this.subscribeProviderFor(element));
            this.deferSubscribe = false;
        }
        this.connected = true;
    }

    static get observedAttributes() {
        return ['inherit', 'subscribe'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Consumer(' + this.id() + ') attributeChangesCallback( ' + name + ', ' + oldValue + ', ' + newValue + ')');
        switch(name) {
            case 'inherit':
                this.inherit = newValue;
                if (this.connected && typeof newValue === 'string') {
                    const attrs = newValue.split(',');
                    attrs.forEach(element => this.askProviderFor(element));
                } else {
                    this.deferInherited = newValue.length > 0;
                }
                break;
            case 'subscribe':
                if (this.subscribe && this.subscribe.length > 0) {
                    if (this.connected) {
                        const attrs = this.subscribe.split(',');
                        attrs.forEach(element => this.unSubscribeProviderFor(element));
                    } else {
                        this.deferUnSubscribe = this.subscribe.length > 0;
                        this.unsubscribe = this.subscribe;
                    }
                }
                if (newValue !== null) {
                    this.subscribe = newValue;
                    if (this.connected) {
                        const attrs = newValue.split(',');
                        attrs.forEach(element => this.subscribeProviderFor(element));
                    } else {
                        this.deferSubscribe = newValue && newValue.length > 0;
                    }
                }
                break;
            default:
                console.log('unknown attribute "' + name + '".');
        }
    }

    id() {
        return this.getAttribute('id');
    }

    render() {}

    askProviderFor(element) {
        console.log('Consumer(' + this.id() + ') askProviderFor( ' + element + ' )');
        const pair = element.trim().split(':');
        const global = pair[0];
        const local = pair[1];
        const that = this;
        const event = new CustomEvent('inherit',
            {
                bubbles: true,
                detail: {
                    name: global,
                    callback: (value) => {
                        console.log('Consumer(' + that.id() + ') ask/Callback ' + global + ' -> ' + local + ' = ' + value);
                        this.attributeChangedCallback(local, that[local], value);
                    }
                }
            });
        this.parentElement.dispatchEvent(event);
        //console.dir(event);
    }

    subscribeProviderFor(element) {
        console.log('Consumer(' + this.id() + ') subscribeProviderFor( ' + element + ' )');
        const pair = element.trim().split(':');
        const global = pair[0];
        const local = pair[1];
        const that = this;
        const event = new CustomEvent('subscribe',
            {
                bubbles: true,
                detail: {
                    name: global,
                    callback: (value) => {
                        console.log('Consumer(' + that.id() + ') sub/Callback ' + global + ' -> ' + local + ' = ' + value);
                        this.attributeChangedCallback(local, that[local], value);
                    },
                    sender: this,
                }
            });
        this.parentElement.dispatchEvent(event);
    }

    unSubscribeProviderFor(element) {
        console.log('Consumer(' + this.id() + ') unSubscribeProviderFor( ' + element + ' )');
        const pair = element.trim().split(':');
        const global = pair[0];
        const event = new CustomEvent('unsubscribe',
            {
                bubbles: true,
                detail: {
                    name: global,
                    sender: this,
                }
            });
        this.parentElement.dispatchEvent(event);
    }
}

class DemoConsumer extends Consumer
{
    constructor() {
        super();

        // default values
        this.foo = 100;
        this.bar = 900;
        this.ping = 0;
        this['border-color'] = 'green';

        this.status = 'local';

        console.log('DemoConsumer constructor()');
    }

    connectedCallback() {
        super.connectedCallback();
        console.log('DemoConsumer(' + this.id() + ') connectedCallback()');
        this.render();
    }

    static get observedAttributes() {
        return [ ...Consumer.observedAttributes, 'foo', 'bar', 'gong', 'border-color', 'ping'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('DemoConsumer(' + this.id() + ') attributeChangesCallback( ' + name + ', ' + oldValue + ', ' + newValue + ')');
        switch(name) {
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

    render() {
        if (! this.connected) {
            return;
        }
        console.log('DemoConsumer(' + this.id() + ') render()');

        const sum = this.foo + this.bar;
        this.shadowRoot.innerHTML = `
        <div style="border: ${this['border-color']} dotted; padding: 10px;">
            <table style="width:200px;">
                <tr style="background-color: #aaa;">
                    <th style="text-align: left;">Item</th>
                    <th style="text-align: right;">Price</th>
                </tr>
                <tr><td>foo</td><td style="text-align: right;">${this.foo}</td></tr>
                <tr><td>bar</td><td style="text-align: right;">${this.bar}</td></tr>
                <tr><td>sum</td><td style="text-align: right;">${sum}</td></tr>
            </table>
            <p>Status: <b>${this.status}</b></p>
        </div>
        `;
    }
}

customElements.define('dbp-consumer', DemoConsumer);
