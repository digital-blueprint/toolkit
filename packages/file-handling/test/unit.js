import {assert} from 'chai';

import '../src/dbp-file-source';
import '../src/demo';

suite('dbp-file-source basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-file-source');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('should send unsupported file type errors to the configured notification', () => {
        let notification;
        const handleNotification = (event) => {
            event.preventDefault();
            notification = event.detail;
        };
        window.addEventListener('dbp-notification-send', handleNotification, {once: true});

        node.allowedMimeTypes = 'application/pdf';
        node.notificationTargetId = 'dialog-notification';

        assert.isFalse(node.checkFileType(new File(['content'], 'attachment.txt')));
        assert.equal(notification.targetNotificationId, 'dialog-notification');
    });
});

suite('dbp-file-source demo', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-file-source-demo');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('should propagate language changes to file handling components', async () => {
        node.lang = 'en';
        await node.updateComplete;

        const components = node.shadowRoot.querySelectorAll('dbp-file-source, dbp-file-sink');
        assert.lengthOf(components, 6);
        components.forEach((component) => assert.equal(component.lang, 'en'));

        node.lang = 'de';
        await node.updateComplete;

        components.forEach((component) => assert.equal(component.lang, 'de'));
    });
});
