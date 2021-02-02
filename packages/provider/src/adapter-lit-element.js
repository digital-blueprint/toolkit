import {LitElement} from "lit-element";

export class AdapterLitElement extends LitElement {
    constructor() {
        super();
        this.connected = false;
        this.deferSubscribe = false;
        this.deferUnSubscribe = false;
        // attributes (if they exist) will be updated if a property is changed by "subscribe"
        this.reflectAttribute = true;

        // default values
        this.subscribe = '';
        this.unsubscribe = '';

        this.callbackStore = [];

        // Previously we used direct properties like this["lang"] (instead of this.propertyStore["lang"]) for storing the
        // properties, but the "lang" property seems to be updated before the event from the MutationObserver, so we
        // cannot observe a value change directly (as workaround we use another property (e.g. "langValue") instead of "lang")
        this.propertyStore = {};

        // We need to store our own "last values" because we cannot be sure what the MutationObserver detects
        this.lastProperties = {};

        console.log('AdapterLitElement(' + this.tagName + ') constructor()');
    }

    getProperty(name) {
        return this.propertyStore[name];
    }

    getPropertyByAttributeName(name) {
        return this[this.findPropertyName(name)];
    }

    setPropertyByAttributeName(name, value) {
        this[this.findPropertyName(name)] = value;
    }

    setProperty(name, value) {
        // TODO: check if lit attribute really present?
        if (typeof value === 'object' && value !== null) {
            // console.log("value is object", value);
            this.setPropertyByAttributeName(name, value);
        } else {
            this.attributeChangedCallback(name, this.getPropertyByAttributeName(name), value);
        }

        this.lastProperties[name] = value;
        this.propertyStore[name] = value;
    }

    hasPropertyChanged(name, value) {
        return this.lastProperties[name] !== value;
    }

    hasProperty(name) {
        // return this.hasAttribute("name")
        return Object.hasOwnProperty.call(this.propertyStore, name);
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

        const that = this;

        this.addEventListener('subscribe', function (e) {
            const name = e.detail.name;
            if (that.hasProperty(name) || that.root) {
                console.log('AdapterLitElementProvider(' + that.tagName + ') eventListener("subscribe",..) name "' + name + '" found.');
                that.callbackStore.push({name: name, callback: e.detail.callback, sender: e.detail.sender});

                e.detail.callback(that.getProperty(name));
                e.stopPropagation();
            }
        }, false);

        this.addEventListener('unsubscribe', function (e) {
            const name = e.detail.name;
            const sender = e.detail.sender;
            if (that.hasProperty(name) || that.root) {
                console.log('AdapterLitElementProvider(' + that.tagName + ') eventListener("unsubscribe",..) name "' + name + '" found.');
                that.callbackStore.forEach(item => {
                    if (item.sender === sender && item.name === name) {
                        const index = that.callbackStore.indexOf(item);
                        that.callbackStore.splice(index, 1);
                        console.log('AdapterLitElementProvider(' + that.tagName + ') eventListener for name "' + name + '" removed.');
                    }
                });

                e.stopPropagation();
            }
        }, false);

        // listen to property changes
        this.addEventListener('set-property', function (e) {
            const name = e.detail.name;
            const value = e.detail.value;

            if (that.hasProperty(name) || that.root) {
                console.log('AdapterLitElementProvider(' + that.tagName + ') eventListener("set-property",..) name "' + name + '" found.');
                that.setProperty(name, value);

                that.callbackStore.forEach(item => {
                    if (item.name === name) {
                        item.callback(value);
                    }
                });

                e.stopPropagation();
            }
        }, false);

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: false, subtree: false };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    const name = mutation.attributeName;
                    const value = that.getAttribute(name);

                    if (that.hasPropertyChanged(name, value)) {
                        console.log('AdapterLitElementProvider (' + that.tagName + ') observed attribute "' + name + '" changed');
                        that.setProperty(name, value);

                        that.callbackStore.forEach(item => {
                            if (item.name === name) {
                                item.callback(value);
                            }
                        });
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(this, config);

        // get all *not observed* attributes
        if (this.hasAttributes()) {
            const attrs = this.attributes;
            for(let i = attrs.length - 1; i >= 0; i--) {
                if (['id', 'class', 'style', 'data-tag-name'].includes(attrs[i].name)) {
                    continue;
                }

                this.setProperty(attrs[i].name, attrs[i].value);
                console.log('AdapterLitElementProvider (' + that.tagName + ') found attribute "' + attrs[i].name + '" = "' + attrs[i].value + '"');
            }
        }
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

                        // If value is an object set it directly as property
                        if (typeof value === 'object' && value !== null) {
                            // console.log("value is object", value);
                            that.setPropertyByAttributeName(local, value);
                        } else {
                            // console.log("local, that.getPropertyByAttributeName(local), value", local, that.getPropertyByAttributeName(local), value);
                            that.attributeChangedCallback(local, that.getPropertyByAttributeName(local), value);

                            // check if an attribute also exists in the tag
                            if (that.getAttribute(local) !== null) {
                                // we don't support attributes and provider values at the same time
                                console.warn('Provider callback: "' + local + '" is also an attribute in tag "' + that.tagName + '", this is not supported!');

                                // update attribute if reflectAttribute is enabled
                                if (that.reflectAttribute) {
                                    that.setAttribute(local, value);
                                }
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

    findPropertyName(attributeName) {
        let resultName = attributeName;
        const properties = this.constructor.properties;
        // console.log("properties", properties);

        for (const propertyName in properties) {
            // console.log("findPropertyName", `${propertyName}: ${properties[propertyName]}`);
            const attribute = properties[propertyName].attribute;
            if (attribute === attributeName) {
                resultName = propertyName;
                break;
            }
        }

        return resultName;
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
