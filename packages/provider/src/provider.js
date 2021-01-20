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

        console.log('Provider constructor()');
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
        console.log('Provider(' + this.id + ') connectedCallback()');

        const that = this;

        this.addEventListener('subscribe', this.subscribing.bind(this), false);
        this.addEventListener('unsubscribe', this.unsubscribing.bind(this), false);
        this.addEventListener('set-property', this.settingProperty.bind(this), false);
        this.addEventListener('ping', function (e) {
            e.stopPropagation();
            e.detail.callback();
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
                        console.log('Provider (' + that.id + ') observed attribute "' + name + '" changed');
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
                console.log('Provider (' + that.id + ') found attribute "' + attrs[i].name + '" = "' + attrs[i].value + '"');
            }
        }
    }

    get id() {
        return this.getAttribute('id');
    }

    set id(id) {
        this.setAttribute('id', id);
    }

    subscribing (e) {
        const name = e.detail.name;
        if (this.hasProperty(name) || this.root) {
            console.log('Provider(' + this.id + ') eventListener("subscribe",..) name "' + name + '" found.');
            this.callbackStore.push({name: name, callback: e.detail.callback, sender: e.detail.sender});

            e.detail.callback(this.getProperty(name));
            e.stopPropagation();
        }
    }

    unsubscribing (e) {
        const name = e.detail.name;
        const sender = e.detail.sender;
        if (this.hasProperty(name) || this.root) {
            console.log('Provider(' + this.id + ') eventListener("unsubscribe",..) name "' + name + '" found.');
            this.callbackStore.forEach(item => {
                if (item.sender === sender && item.name === name) {
                    const index = this.callbackStore.indexOf(item);
                    this.callbackStore.splice(index, 1);
                    console.log('Provider(' + this.id + ') eventListener for name "' + name + '" removed.');
                }
            });

            e.stopPropagation();
        }
    }

    settingProperty (e) {
        const name = e.detail.name;
        const value = e.detail.value;

        if (this.hasProperty(name) || this.root) {
            console.log('Provider(' + this.id + ') eventListener("set-property",..) name "' + name + '" found.');
            this.setProperty(name, value);

            this.callbackStore.forEach(item => {
                if (item.name === name) {
                    item.callback(value);
                }
            });

            e.stopPropagation();
        }
    }
}
