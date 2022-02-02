export class Adapter extends HTMLElement {
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

        console.debug('Adapter constructor()');
    }

    getPropertyByAttributeName(name) {
        return this[this.findPropertyName(name)];
    }

    setPropertyByAttributeName(name, value) {
        this[this.findPropertyName(name)] = value;
    }

    connectedCallback() {
        this.connected = true;

        const that = this;

        // get all *not observed* attributes
        if (this.hasAttributes()) {
            const attrs = this.attributes;
            for (let i = attrs.length - 1; i >= 0; i--) {
                if (['id', 'class', 'style', 'data-tag-name'].includes(attrs[i].name)) {
                    continue;
                }
                this.setPropertiesToChildNodes();

                this.attributeChangedCallback(
                    attrs[i].name,
                    this.getPropertyByAttributeName(attrs[i].name),
                    attrs[i].value
                );

                console.debug(
                    'AdapterProvider (' +
                        that.tagName +
                        ') found attribute "' +
                        attrs[i].name +
                        '" = "' +
                        attrs[i].value +
                        '"'
                );
            }
        }
    }

    disconnectedCallback() {
        const attrs = this.subscribe.split(',');
        attrs.forEach((element) => this.unSubscribeProviderFor(element));
    }

    subscribeProviderFor(element) {
        console.debug(
            'AdapterProvider(' + this.tagName + ') subscribeProviderFor( ' + element + ' )'
        );
        const pair = element.trim().split(':');
        const local = pair[0];
        const global = pair[1] || local;
        const that = this;
        const event = new CustomEvent('dbp-subscribe', {
            bubbles: true,
            composed: true,
            detail: {
                name: global,
                callback: (value) => {
                    console.debug(
                        'AdapterProvider(' +
                            that.tagName +
                            ') sub/Callback ' +
                            global +
                            ' -> ' +
                            local +
                            ' = ' +
                            value
                    );
                    that.setPropertiesToChildNodes(local, value);

                    // If value is an object set it directly as property
                    if (typeof value === 'object' && value !== null) {
                        // console.debug("value is object", value);
                        that.setPropertyByAttributeName(local, value);
                    } else {
                        // console.debug("local, that.getPropertyByAttributeName(local), value", local, that.getPropertyByAttributeName(local), value);
                        that.attributeChangedCallback(
                            local,
                            that.getPropertyByAttributeName(local),
                            value
                        );

                        // check if an attribute also exists in the tag
                        if (that.getAttribute(local) !== null) {
                            // we don't support attributes and provider values at the same time
                            console.warn(
                                'Provider callback: "' +
                                    local +
                                    '" is also an attribute in tag "' +
                                    that.tagName +
                                    '", this is not supported!'
                            );

                            // update attribute if reflectAttribute is enabled
                            if (that.reflectAttribute) {
                                that.setAttribute(local, value);
                            }
                        }
                    }
                },
                sender: this,
            },
        });
        this.dispatchEvent(event);
    }

    unSubscribeProviderFor(element) {
        console.debug(
            'AdapterProvider(' + this.tagName + ') unSubscribeProviderFor( ' + element + ' )'
        );
        const pair = element.trim().split(':');
        const global = pair[1] || pair[0];
        const event = new CustomEvent('dbp-unsubscribe', {
            bubbles: true,
            composed: true,
            detail: {
                name: global,
                sender: this,
            },
        });
        this.dispatchEvent(event);
    }

    static get properties() {
        return {
            subscribe: {type: String},
            unsubscribe: {type: String},
        };
    }

    findPropertyName(attributeName) {
        let resultName = attributeName;
        const properties = this.constructor.properties;
        // console.debug("properties", properties);

        for (const propertyName in properties) {
            // console.debug("findPropertyName", `${propertyName}: ${properties[propertyName]}`);
            const attribute = properties[propertyName].attribute;
            if (attribute === attributeName) {
                resultName = propertyName;
                break;
            }
        }

        return resultName;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'subscribe':
                console.debug(
                    'AdapterProvider() attributeChangesCallback( ' +
                        name +
                        ', ' +
                        oldValue +
                        ', ' +
                        newValue +
                        ')'
                );

                if (this.subscribe && this.subscribe.length > 0) {
                    if (this.connected) {
                        const attrs = this.subscribe.split(',');
                        attrs.forEach((element) => this.unSubscribeProviderFor(element));
                    } else {
                        this.deferUnSubscribe = this.subscribe.length > 0;
                        this.unsubscribe = this.subscribe;
                    }
                }

                if (newValue !== null) {
                    this.subscribe = newValue;
                    if (this.connected) {
                        const attrs = newValue.split(',');
                        attrs.forEach((element) => this.subscribeProviderFor(element));
                    } else {
                        this.deferSubscribe = newValue && newValue.length > 0;
                    }
                }
                break;
            default:
                break;
        }
    }

    /**
     * Send a set-property event to the provider components
     *
     * @param name
     * @param value
     * @returns {boolean}
     */
    sendSetPropertyEvent(name, value) {
        const event = new CustomEvent('set-property', {
            bubbles: true,
            composed: true,
            detail: {name: name, value: value},
        });

        return this.dispatchEvent(event);
    }

    setPropertiesToChildNodes(local, value) {
        let children = this.children;
        Array.from(children).forEach((child) => child.setAttribute(local, value));
    }
}
