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
function send(options) {
    const event = new CustomEvent("vpu-notification-send", {
        bubbles: true,
        cancelable: true,
        detail: options,
    });

    window.dispatchEvent(event);
}

export { send };
