import {Logger} from "@dbp-toolkit/common";

export class Provider extends HTMLElement {
    constructor() {
        super();
        this.callbackStore = [];
        this.root = false;

        // Previously we used direct properties like this["lang"] (instead of this.properties["lang"]) for storing the
        // properties, but the "lang" property seems to be updated before the event from the MutationObserver, so we
        // cannot observe a value change directly (as workaround we use another property (e.g. "langValue") instead of "lang")
        this.properties = {};

        // We need to store our own "last values" because we cannot be sure what the MutationObserver detects
        this.lastProperties = {};

        Logger.debug('Provider constructor()');
    }

    getProperty(name) {
        return this.properties[name];
    }

    setProperty(name, value) {
        this.lastProperties[name] = value;
        this.properties[name] = value;
    }

    hasPropertyChanged(name, value) {
        return this.lastProperties[name] !== value;
    }

    hasProperty(name) {
        return Object.hasOwnProperty.call(this.properties, name);
    }

    connectedCallback() {
        Logger.debug('Provider(' + this.id + ') connectedCallback()');

        const that = this;

        this.addEventListener('dbp-subscribe', function (e) {
            const name = e.detail.name;
            if (that.hasProperty(name) || that.root) {
                Logger.debug('Provider(' + that.id + ') eventListener("dbp-subscribe",..) name "' + name + '" found.');
                that.callbackStore.push({name: name, callback: e.detail.callback, sender: e.detail.sender});

                e.detail.callback(that.getProperty(name));
                e.stopPropagation();
            }
        }, false);

        this.addEventListener('dbp-unsubscribe', function (e) {
            const name = e.detail.name;
            const sender = e.detail.sender;
            if (that.hasProperty(name) || that.root) {
                Logger.debug('Provider(' + that.id + ') eventListener("dbp-unsubscribe",..) name "' + name + '" found.');
                that.callbackStore.forEach(item => {
                    if (item.sender === sender && item.name === name) {
                        const index = that.callbackStore.indexOf(item);
                        that.callbackStore.splice(index, 1);
                        Logger.debug('Provider(' + that.id + ') eventListener for name "' + name + '" removed.');
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
                Logger.debug('Provider(' + that.id + ') eventListener("dbp-set-property",..) name "' + name + '" found.');
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
                        Logger.debug('Provider (' + that.id + ') observed attribute "' + name + '" changed');
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
                Logger.debug('Provider (' + that.id + ') found attribute "' + attrs[i].name + '" = "' + attrs[i].value + '"');
            }
        }
    }

    get id() {
        return this.getAttribute('id');
    }
}
