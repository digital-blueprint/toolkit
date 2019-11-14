export class EventSubscriber {

    /**
     * @param {string} eventName The event name used for broadcasting the event
     * @param {string} requestName The event name used for requesting the event
     */
    constructor(eventName, requestName) {
        this._eventName = eventName;
        this._requestName = requestName;
        this._callbacks = [];
        this._eventHandler = this._eventHandler.bind(this);
    }

    /**
     * Register a callback for the event
     *
     * @param {Function} callback 
     */
    subscribe(callback) {
        const first = (this._callbacks.length === 0);
        this._callbacks.push(callback);
        if (first) {
            window.addEventListener(this._eventName, this._eventHandler);
        }
        this._requestUpdate(callback);
    }

    /**
     * Unregister a callback registered through subscribe()
     * 
     * @param {Function} callback 
     */
    unsubscribe(callback) {
        const index = this._callbacks.indexOf(callback);
        if (index == -1)
            throw new Error("not subscribed");
        this._callbacks.splice(index, 1);
        const last = (this._callbacks.length === 0);
        if (last) {
            window.removeEventListener(this._eventName, this._eventHandler);
        }
    }

    /**
     * Request an event, might not do anything if there is no emitter.
     */
    requestUpdate() {
        this._requestUpdate((data) => {
            for (const cb of this._callbacks) {
                cb(data);
            }
        });
    }

    /**
     * Returns the event data or throws an error if there is no emitter
     */
    async requestData() {
        return new Promise((resolve, reject) => {
            const event = new CustomEvent(this._requestName, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {'callback': resolve}
            });
            if (window.dispatchEvent(event)) {
                reject(new Error("other side not there"));
            }
        });
    }

    _requestUpdate(callback) {
        const event = new CustomEvent(this._requestName, {
            bubbles: true,
            composed: true,
            detail: {callback: callback}
        });
        window.dispatchEvent(event);
    }

    _eventHandler(event) {
        const data = event.detail.data;
        for (const cb of this._callbacks) {
            cb(data);
        }
    }
}

export class EventEmitter {

    /**
     * @param {string} eventName The event name used for broadcasting the event
     * @param {string} requestName The event name used for requesting the event
     */
    constructor(eventName, requestName) {
        this._eventName = eventName;
        this._requestName = requestName;
    }

    /**
     * Register a callback that will be called when a new event is generated.
     * The callback needs to return an object that is send with the event.
     * 
     * @param {Function} callback 
     */
    registerCallback(callback) {
        if (this._getData !== undefined)
            throw new Error("already registered");
        this._getData = callback;
        this._onRequest = (event) => {
            const callback = event.detail.callback;
            if (callback === undefined) {
                return;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            callback(this._getData());
        };
        window.addEventListener(this._requestName, this._onRequest);
        this.emit();
    }

    /**
     * Unregister a callback that was passed to registerCallback()
     *
     * @param {Function} callback 
     */
    unregisterCallback(callback) {
        if (this._getData !== callback)
            throw new Error("not registered");
        window.removeEventListener(this._requestName, this._onRequest);
        delete this._getData;
        delete this._onRequest;
    }

    /**
     * Force emit an event (when something has changed and new data needs to be send out)
     */
    emit() {
        if (this._getData === undefined)
            throw new Error("no callback registered");
        const event = new CustomEvent(this._eventName, {
            bubbles: true,
            composed: true,
            detail: { data: this._getData() }
        });
        window.dispatchEvent(event);
    }
}