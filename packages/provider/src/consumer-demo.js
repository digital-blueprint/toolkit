import DBPLitElement from "@dbp-toolkit/common/dbp-lit-element";
import {i18n} from "./i18n";
import {html} from "lit-element";


export class DemoConsumer extends DBPLitElement {
    constructor() {
        super();

        this.lang = 'de';
        // default values
        this.foo = 100;
        this.bar = 900;
        this.borderColor = 'green';

        this.status = 'local';

        console.log('DemoConsumer constructor()');
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        console.log('DemoConsumer(' + this.id + ') connectedCallback()');
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

        console.log('DemoConsumer(' + this.id + ') attributeChangesCallback( ' + name + ', ' + oldValue + ', ' + newValue + ')');
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
        console.log('DemoConsumer(' + this.id + ') render()');

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
