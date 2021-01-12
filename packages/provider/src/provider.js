export class Provider extends HTMLElement {
    constructor() {
        super();
        this.callbackStore = [];

        console.log('Provider constructor()');
    }

    static get observedAttributes() {
        return ['init'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Provider(' + this.id() + ') attribute "' + name + '" changed from "' + oldValue + '" to "' + newValue + '".');
        switch(name) {
            case 'init':
                this.init = newValue;
                if (newValue) {
                    const attrs = newValue.split(',');
                    attrs.forEach(element => {
                        const pair = element.trim().split('=');
                        const name = pair[0].trim();
                        const value = pair[1].trim().replace('"', '').replace("'", '');
                        if (name.length > 0) {
                            this[name] = value;
                            this.callbackStore.forEach(item => {
                                if (item.name === name) {
                                    item.callback(value);
                                }
                            });
                        }
                    });
                }
                break;
            default:
                console.log('unknown attribute "' + name + '".');
        }
    }


    connectedCallback() {
        console.log('Provider(' + this.id() + ') connectedCallback()');

        const that = this;
        this.addEventListener('inherit', function (e) {
            if (that[e.detail.name]) {
                console.log('Provider(' + that.id() + ') eventListener("inherit",..) name "' + e.detail.name + '" found.');
                //console.dir(e.detail);
                e.detail.callback(that[e.detail.name]);
                e.stopPropagation();
            }
        }, false);

        this.addEventListener('subscribe', function (e) {
            const name = e.detail.name;
            if (that[name]) {
                console.log('Provider(' + that.id() + ') eventListener("subscribe",..) name "' + name + '" found.');
                that.callbackStore.push({name: name, callback: e.detail.callback, sender: e.detail.sender});

                e.detail.callback(that[name]);
                e.stopPropagation();
            }
        }, false);

        this.addEventListener('unsubscribe', function (e) {
            const name = e.detail.name;
            const sender = e.detail.sender;
            if (that[name]) {
                console.log('Provider(' + that.id() + ') eventListener("unsubscribe",..) name "' + name + '" found.');
                that.callbackStore.forEach(item => {
                    if (item.sender === sender && item.name === name) {
                        const index = that.callbackStore.indexOf(item);
                        that.callbackStore.splice(index, 1);
                        console.log('Provider(' + that.id() + ') eventListener for name "' + name + '" removed.');
                    }
                });

                e.stopPropagation();
            }
        }, false);

        // listen to property changes
        this.addEventListener('set-property', function (e) {
            const name = e.detail.name;
            const value = e.detail.value;

            if (that[name]) {
                console.log('Provider(' + that.id() + ') eventListener("set-property",..) name "' + name + '" found.');
                that[name] = value;

                that.callbackStore.forEach(item => {
                    if (item.name === name) {
                        item.callback(value);
                    }
                });

                e.stopPropagation();
            }
        }, false);
    }

    id() {
        return this.getAttribute('id');
    }
}
