export class Provider extends HTMLElement {
    constructor() {
        super();
        this.callbackStore = [];
        this.root = false;

        console.log('Provider constructor()');
    }

    connectedCallback() {
        console.log('Provider(' + this.id + ') connectedCallback()');

        const that = this;

        this.addEventListener('subscribe', function (e) {
            const name = e.detail.name;
            if (that.hasOwnProperty(name) || that.root) {
                console.log('Provider(' + that.id + ') eventListener("subscribe",..) name "' + name + '" found.');
                that.callbackStore.push({name: name, callback: e.detail.callback, sender: e.detail.sender});

                e.detail.callback(that[name]);
                e.stopPropagation();
            }
        }, false);

        this.addEventListener('unsubscribe', function (e) {
            const name = e.detail.name;
            const sender = e.detail.sender;
            if (that.hasOwnProperty(name) || that.root) {
                console.log('Provider(' + that.id + ') eventListener("unsubscribe",..) name "' + name + '" found.');
                that.callbackStore.forEach(item => {
                    if (item.sender === sender && item.name === name) {
                        const index = that.callbackStore.indexOf(item);
                        that.callbackStore.splice(index, 1);
                        console.log('Provider(' + that.id + ') eventListener for name "' + name + '" removed.');
                    }
                });

                e.stopPropagation();
            }
        }, false);

        // listen to property changes
        this.addEventListener('set-property', function (e) {
            const name = e.detail.name;
            const value = e.detail.value;

            if (that.hasOwnProperty(name) || that.root) {
                console.log('Provider(' + that.id + ') eventListener("set-property",..) name "' + name + '" found.');
                that[name] = value;

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
                    if (that[name] !== value) {
                        console.log('Provider (' + that.id + ') observed attribute "' + name + '" changed');
                        that[name] = value;
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

                this[attrs[i].name] = attrs[i].value;
                console.log('Provider (' + that.id + ') found attribute "' + attrs[i].name + '" = "' + attrs[i].value + '"');
            }
        }
    }

    get id() {
        return this.getAttribute('id');
    }
}
