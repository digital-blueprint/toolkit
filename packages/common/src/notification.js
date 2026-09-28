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
 * @param {('primary'|'info'|'success'|'warning'|'danger')} [options.type] - The notification type
 * @param {string} [options.icon] - Icon name to display with the notification (if the handler supports it)
 * @param {number} [options.timeout] - Duration in seconds before auto-dismissing the notification (if the handler supports it)
 * @param {string} [options.targetNotificationId] - ID of specific notification component to target (if the handler supports it)
 * @param {string} [options.replaceId] - Unique identifier to replace existing notifications with the same replaceId (if the handler supports it)
 */
/** @type {HTMLDivElement | null} */
let notificationLiveRegion = null;
/** @type {ReturnType<typeof setTimeout> | null} */
let notificationAnnouncementTimer = null;

function getNotificationLiveRegion() {
    if (notificationLiveRegion || typeof document === 'undefined' || !document.body) {
        return notificationLiveRegion;
    }

    notificationLiveRegion = document.createElement('div');
    notificationLiveRegion.id = 'dbp-notification-live-region';
    notificationLiveRegion.setAttribute('aria-atomic', 'true');
    notificationLiveRegion.style.position = 'absolute';
    notificationLiveRegion.style.width = '1px';
    notificationLiveRegion.style.height = '1px';
    notificationLiveRegion.style.padding = '0';
    notificationLiveRegion.style.margin = '-1px';
    notificationLiveRegion.style.overflow = 'hidden';
    notificationLiveRegion.style.clip = 'rect(0, 0, 0, 0)';
    notificationLiveRegion.style.whiteSpace = 'nowrap';
    notificationLiveRegion.style.border = '0';
    document.body.appendChild(notificationLiveRegion);

    return notificationLiveRegion;
}

function announceNotification(options) {
    const liveRegion = getNotificationLiveRegion();
    if (!liveRegion) {
        return;
    }

    const isAlert = options.type === 'warning' || options.type === 'danger';
    liveRegion.setAttribute('role', isAlert ? 'alert' : 'status');
    liveRegion.setAttribute('aria-live', isAlert ? 'assertive' : 'polite');
    liveRegion.textContent = '';
    if (notificationAnnouncementTimer) {
        clearTimeout(notificationAnnouncementTimer);
    }
    notificationAnnouncementTimer = setTimeout(() => {
        liveRegion.textContent = [options.summary, options.body].filter(Boolean).join(': ');
        notificationAnnouncementTimer = null;
    }, 100);
}

function sendNotification(options) {
    announceNotification(options);

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

if (typeof document !== 'undefined' && document.body) {
    getNotificationLiveRegion();
}

export {sendNotification};

// @deprecated use sendNotification
export {sendNotification as send};
