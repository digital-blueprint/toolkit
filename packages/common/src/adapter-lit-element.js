import {LitElement} from "lit-element";
import {Logger} from "./logger";

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

        Logger.debug('AdapterLitElement(' + this.tagName + ') constructor()');
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
            // Logger.debug("value is object", value);
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

        this.addEventListener('dbp-subscribe', function (e) {
            const name = e.detail.name;
            if (that.hasProperty(name) || that.root) {
                Logger.debug('AdapterLitElementProvider(' + that.tagName + ') eventListener("dbp-subscribe",..) name "' + name + '" found.');
                that.callbackStore.push({name: name, callback: e.detail.callback, sender: e.detail.sender});

                e.detail.callback(that.getProperty(name));
                e.stopPropagation();
            }
        }, false);

        this.addEventListener('dbp-unsubscribe', function (e) {
            const name = e.detail.name;
            const sender = e.detail.sender;
            if (that.hasProperty(name) || that.root) {
                Logger.debug('AdapterLitElementProvider(' + that.tagName + ') eventListener("dbp-unsubscribe",..) name "' + name + '" found.');
                that.callbackStore.forEach(item => {
                    if (item.sender === sender && item.name === name) {
                        const index = that.callbackStore.indexOf(item);
                        that.callbackStore.splice(index, 1);
                        Logger.debug('AdapterLitElementProvider(' + that.tagName + ') eventListener for name "' + name + '" removed.');
                    }
                });

                e.stopPropagation();
            }
        }, false);

        // listen to property changes
        this.addEventListener('dbp-set-property', function (e) {
            const name = e.detail.name;
            const value = e.detail.value;

            if (that.hasProperty(name) || that.root) {
                Logger.debug('AdapterLitElementProvider(' + that.tagName + ') eventListener("dbp-set-property",..) name "' + name + '" found.');
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
                        Logger.debug('AdapterLitElementProvider (' + that.tagName + ') observed attribute "' + name + '" changed');
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
                Logger.debug('AdapterLitElementProvider (' + that.tagName + ') found attribute "' + attrs[i].name + '" = "' + attrs[i].value + '"');
            }
        }
    }

    disconnectedCallback() {
        const attrs = this.subscribe.split(',');
        attrs.forEach(element => this.unSubscribeProviderFor(element));

        super.disconnectedCallback();
    }

    subscribeProviderFor(element) {
        Logger.debug('AdapterLitElement(' + this.tagName + ') subscribeProviderFor( ' + element + ' )');
        const pair = element.trim().split(':');
        const local = pair[0];
        const global = pair[1] || local;
        const that = this;
        const event = new CustomEvent('dbp-subscribe',
            {
                bubbles: true,
                composed: true,
                detail: {
                    name: global,
                    callback: (value) => {
                        Logger.debug('AdapterLitElement(' + that.tagName + ') sub/Callback ' + global + ' -> ' + local + ' = ' + value);

                        // If value is an object set it directly as property
                        if (typeof value === 'object' && value !== null) {
                            // Logger.debug("value is object", value);
                            that.setPropertyByAttributeName(local, value);
                        } else {
                            // Logger.debug("local, that.getPropertyByAttributeName(local), value", local, that.getPropertyByAttributeName(local), value);
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
        Logger.debug('AdapterLitElement(' + this.tagName + ') unSubscribeProviderFor( ' + element + ' )');
        const pair = element.trim().split(':');
        const global = pair[1] || pair[0];
        const event = new CustomEvent('dbp-unsubscribe',
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
        // Logger.debug("properties", properties);

        for (const propertyName in properties) {
            // Logger.debug("findPropertyName", `${propertyName}: ${properties[propertyName]}`);
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
                Logger.debug('AdapterLitElement() attributeChangesCallback( ' + name + ', ' + oldValue + ', ' + newValue + ')');

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
                // The function should not be called if oldValue is an object, oldValue and newValue are empty
                // or if newValue is empty but name and oldValue are set
                // This should prevent 'Uncaught SyntaxError: JSON.parse unexpected end of data at line 1 column 1 of the JSON data'
                if ((typeof oldValue === 'object' && !oldValue && !newValue) || (!newValue && oldValue && name)) {
                    // Logger.debug("attributeChangedCallback ignored", name, oldValue, newValue);
                    break;
                }
                super.attributeChangedCallback(name, oldValue, newValue);
        }

        // Logger.debug("this.lang", this.tagName, name, this.lang);
        // Logger.debug("this.entryPointUrl", this.tagName, name, this.entryPointUrl);
        // console.trace();
    }

    /**
     * Send a dbp-set-property event to the provider components
     *
     * @param name
     * @param value
     * @param sendToSelf Set this to "true" if the event should  be sent to oneself instead of the parent (e.g. in the app shell if there isn't a provider around it)
     * @returns {boolean}
     */
    sendSetPropertyEvent(name, value, sendToSelf = false) {
        // Logger.debug("dbp-set-property", name, value);

        const event = new CustomEvent('dbp-set-property', {
            bubbles: true,
            composed: true,
            detail: {'name': name, 'value': value}
        });

        // dispatch the dbp-set-property event to the parent (if there is any) so that the current element
        // doesn't terminate the event if it has the attribute set itself
        const element = this.parentElement && !sendToSelf ? this.parentElement : this;

        return element.dispatchEvent(event);
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
