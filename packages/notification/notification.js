
module.exports = {
    /**
     * Sends a notification via the event
     *
     * example options:
     *
     * {
     *   "summary": "Item deleted",
     *    "body": "Item foo was deleted!",
     *    "type": "info",
     *    "timeout": 5,
     * }
     *
     * @param options
     */
    send: (options) => {
        const event = new CustomEvent("vpu-notification-send", {
            bubbles: true,
            cancelable: true,
            detail: options,
        });

        document.dispatchEvent(event);
    },
};
