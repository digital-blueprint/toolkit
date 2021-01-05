import {LitElement} from "lit-element";

export class AdapterLitElement extends LitElement {
    constructor() {
        super();
        this.connected = false;
        this.deferSubscribe = false;
        this.deferUnSubscribe = false;

        // default values
        this.subscribe = '';
        this.unsubscribe = '';

        console.log('AdapterLitElement constructor()');
    }

    connectedCallback() {
        super.connectedCallback();

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

    subscribeProviderFor(element) {
        console.log('AdapterLitElement subscribeProviderFor( ' + element + ' )');
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
                        console.log('AdapterLitElement(' + that.id() + ') sub/Callback ' + global + ' -> ' + local + ' = ' + value);
                        this.attributeChangedCallback(local, that[local], value);
                    },
                    sender: this,
                }
            });
        this.parentElement.dispatchEvent(event);
    }

    unSubscribeProviderFor(element) {
        console.log('AdapterLitElement unSubscribeProviderFor( ' + element + ' )');
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

    static get properties() {
        return {
            subscribe: { type: String },
            unsubscribe: { type: String },
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch(propName) {
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
                    if (this.subscribe !== null) {
                        if (this.connected) {
                            const attrs = this.subscribe.split(',');
                            attrs.forEach(element => this.subscribeProviderFor(element));
                        } else {
                            this.deferSubscribe = this.subscribe && this.subscribe.length > 0;
                        }
                    }
                    break;
            }
        });

        super.update(changedProperties);
    }
}
