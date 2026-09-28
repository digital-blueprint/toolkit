import {assert} from 'chai';
import {sendNotification} from '@dbp-toolkit/common';

import '../src/dbp-notification';

suite('dbp-notification basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-notification');
        node.id = 'dbp-notification';
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('should expose a live region for notifications', async () => {
        sendNotification({
            summary: 'Saved',
            body: 'The item was saved.',
            targetNotificationId: 'not-this-notification',
        });
        await new Promise((resolve) => setTimeout(resolve, 110));

        const liveRegion = document.querySelector('#dbp-notification-live-region');

        assert.isNotNull(liveRegion);
        assert.equal(liveRegion.getAttribute('role'), 'status');
        assert.equal(liveRegion.getAttribute('aria-live'), 'polite');
        assert.equal(liveRegion.getAttribute('aria-atomic'), 'true');
        assert.equal(liveRegion.textContent, 'Saved: The item was saved.');
    });

    test('should expose notification content and a translated close label', async () => {
        window.dispatchEvent(
            new CustomEvent('dbp-notification-send', {
                detail: {
                    summary: 'Saved',
                    body: 'The item was saved.',
                },
            }),
        );
        await node.updateComplete;
        await node.shadowRoot.querySelector('dbp-notification-item').updateComplete;

        const item = node.shadowRoot.querySelector('dbp-notification-item');
        const notification = item.shadowRoot.querySelector('.notification');
        const closeButton = item.shadowRoot.querySelector('.delete');

        assert.equal(notification.getAttribute('role'), 'status');
        assert.equal(notification.getAttribute('aria-atomic'), 'true');
        assert.include(notification.textContent, 'Saved');
        assert.include(notification.textContent, 'The item was saved.');
        assert.equal(closeButton.getAttribute('aria-label'), 'Benachrichtigung schließen');
    });

    test('should use alert semantics for danger notifications', async () => {
        window.dispatchEvent(
            new CustomEvent('dbp-notification-send', {
                detail: {type: 'danger', body: 'Something went wrong.'},
            }),
        );
        await node.updateComplete;
        await node.shadowRoot.querySelector('dbp-notification-item').updateComplete;

        const notification = node.shadowRoot
            .querySelector('dbp-notification-item')
            .shadowRoot.querySelector('.notification');

        assert.equal(notification.getAttribute('role'), 'alert');
    });

    test('should use alert semantics for warning notifications', async () => {
        window.dispatchEvent(
            new CustomEvent('dbp-notification-send', {
                detail: {type: 'warning', body: 'Please fill out this field.'},
            }),
        );
        await node.updateComplete;
        await node.shadowRoot.querySelector('dbp-notification-item').updateComplete;

        const notification = node.shadowRoot
            .querySelector('dbp-notification-item')
            .shadowRoot.querySelector('.notification');

        assert.equal(notification.getAttribute('role'), 'alert');
    });

    test('should announce warning notifications assertively', async () => {
        sendNotification({
            summary: 'Required field',
            body: 'Please fill out this field.',
            type: 'warning',
            targetNotificationId: 'not-this-notification',
        });
        await new Promise((resolve) => setTimeout(resolve, 110));

        const liveRegion = document.querySelector('#dbp-notification-live-region');

        assert.equal(liveRegion.getAttribute('role'), 'alert');
        assert.equal(liveRegion.getAttribute('aria-live'), 'assertive');
        assert.equal(liveRegion.textContent, 'Required field: Please fill out this field.');
    });
});
