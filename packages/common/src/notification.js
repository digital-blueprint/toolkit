/**
 * Sends a notification to the user.
 *
 * example options:
 *
 * {
 *   "summary": "Item deleted",
 *   "body": "Item foo was deleted!",
 *   "type": "info",
 *   "icon": "remove-file",
 *   "timeout": 5,
 * }
 *
 * @param {object} options - Notification options
 * @param {string} [options.summary] - The notification title/summary
 * @param {string} [options.body] - The main notification message
 * @param {('info'|'success'|'warning'|'danger')} [options.type] - The notification type
 * @param {string} [options.icon] - Icon name to display with the notification (if the handler supports it)
 * @param {number} [options.timeout] - Duration in seconds before auto-dismissing the notification (if the handler supports it)
 * @param {string} [options.targetNotificationId] - ID of specific notification component to target (if the handler supports it)
 * @param {string} [options.replaceId] - Unique identifier to replace existing notifications with the same replaceId (if the handler supports it)
 */
function sendNotification(options) {
    const event = new CustomEvent('dbp-notification-send', {
        bubbles: true,
        cancelable: true,
        detail: options,
    });

    const result = window.dispatchEvent(event);

    // true means the event was not handled
    if (result) {
        alert([options.summary, options.body].filter(Boolean).join(':\n\n'));
        console.log('Use the web component dbp-notification to show fancy notifications.');
    }
}

export {sendNotification};

// @deprecated use sendNotification
export {sendNotification as send};
