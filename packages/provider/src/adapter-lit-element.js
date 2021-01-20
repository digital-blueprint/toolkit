import {LitElement} from "lit-element";
import {Provider} from '@dbp-toolkit/provider';

export class AdapterLitElement extends LitElement {
    static inititialized=false;
    static pingEventListener = false;

    ping() {
        if (AdapterLitElement.inititialized) {
            return;
        }
        console.log('ping');
        AdapterLitElement.pingEventListener = window.addEventListener('ping', e => AdapterLitElement.addRootProvider(e), false);
        const event = new CustomEvent('ping',
            {
                bubbles: true,
                composed: true,
                detail: {
                    callback: () => {
                        console.log('ping by some Provider cancelled.');
                        window.removeEventListener('ping', AdapterLitElement.pingEventListener, false);
                    }
                }
            });
        this.dispatchEvent(event);

        AdapterLitElement.inititialized = true;
    }

    static addRootProvider(/*e*/) {
        console.log('pong');
        //console.dir(e);
        window.removeEventListener('ping', this.pingEventListener, false);
        this.pingEventListener = false;

        window.dbpProvider = new Provider();
        window.dbpProvider.root = true;
        window.dbpProvider.id = 'magic-root-provider';
        window.addEventListener('subscribe', window.dbpProvider.subscribing.bind(window.dbpProvider), false);
        window.addEventListener('unsubscribe', window.dbpProvider.unsubscribing.bind(window.dbpProvider), false);
        window.addEventListener('set-property', window.dbpProvider.settingProperty.bind(window.dbpProvider), false);

    }

    constructor() {
        super();
        this.ping();
        this.connected = false;
        this.deferSubscribe = false;
        this.deferUnSubscribe = false;
        // attributes (if they exist) will be updated if a property is changed by "subscribe"
        this.reflectAttribute = true;

        // default values
        this.subscribe = '';
        this.unsubscribe = '';

        console.log('AdapterLitElement(' + this.tagName + ') constructor()');
    }

    connectedCallback() {
        super.connectedCallback();

        if (this.deferUnSubscribe) {
            const attrs = this.unsubscribe.split(',');
            attrs.forEach(element => this.unSubscribeProviderFor(element));
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

    subscribeProviderFor(element) {
        console.log('AdapterLitElement(' + this.tagName + ') subscribeProviderFor( ' + element + ' )');
        const pair = element.trim().split(':');
        const local = pair[0];
        const global = pair[1];
        const that = this;
        const event = new CustomEvent('subscribe',
            {
                bubbles: true,
                composed: true,
                detail: {
                    name: global,
                    callback: (value) => {
                        console.log('AdapterLitElement(' + that.tagName + ') sub/Callback ' + global + ' -> ' + local + ' = ' + value);
                        that.attributeChangedCallback(local, that[local], value);

                        // check if an attribute also exists in the tag
                        if (that.getAttribute(local) !== null) {
                            // we don't support attributes and provider values at the same time
                            console.warn('Provider callback: "' + local + '" is also an attribute in tag "' + that.tagName + '", this is not supported!');

                            // update attribute if reflectAttribute is enabled
                            if (that.reflectAttribute) {
                                that.setAttribute(local, value);
                            }
                        }
                    },
                    sender: this,
                }
            });
        this.dispatchEvent(event);
    }

    unSubscribeProviderFor(element) {
        console.log('AdapterLitElement(' + this.tagName + ') unSubscribeProviderFor( ' + element + ' )');
        const pair = element.trim().split(':');
        const global = pair[1];
        const event = new CustomEvent('unsubscribe',
            {
                bubbles: true,
                composed: true,
                detail: {
                    name: global,
                    sender: this,
                }
            });
        this.dispatchEvent(event);
    }

    static get properties() {
        return {
            subscribe: { type: String },
            unsubscribe: { type: String },
        };
    }

    static getProperties(properties = {}) {
        return Object.assign(properties, super.properties);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'subscribe':
                console.log('AdapterLitElement() attributeChangesCallback( ' + name + ', ' + oldValue + ', ' + newValue + ')');

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
                super.attributeChangedCallback(name, oldValue, newValue);
        }

        // console.log("this.lang", this.tagName, name, this.lang);
        // console.log("this.entryPointUrl", this.tagName, name, this.entryPointUrl);
        // console.trace();
    }

    /**
     * Send a set-property event to the provider components
     *
     * @param name
     * @param value
     * @returns {boolean}
     */
    sendSetPropertyEvent(name, value) {
        const event = new CustomEvent("set-property", {
            bubbles: true,
            composed: true,
            detail: {'name': name, 'value': value}
        });

        return this.dispatchEvent(event);
    }

    // update(changedProperties) {
    //     changedProperties.forEach((oldValue, propName) => {
    //         switch(propName) {
    //             case 'subscribe':
    //                 if (this.subscribe && this.subscribe.length > 0) {
    //                     if (this.connected) {
    //                         const attrs = this.subscribe.split(',');
    //                         attrs.forEach(element => this.unSubscribeProviderFor(element));
    //                     } else {
    //                         this.deferUnSubscribe = this.subscribe.length > 0;
    //                         this.unsubscribe = this.subscribe;
    //                     }
    //                 }
    //                 if (this.subscribe !== null) {
    //                     if (this.connected) {
    //                         const attrs = this.subscribe.split(',');
    //                         attrs.forEach(element => this.subscribeProviderFor(element));
    //                     } else {
    //                         this.deferSubscribe = this.subscribe && this.subscribe.length > 0;
    //                     }
    //                 }
    //                 break;
    //         }
    //     });
    //
    //     super.update(changedProperties);
    // }
}
