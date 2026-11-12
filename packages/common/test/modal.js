import {assert} from 'chai';
import {defineCustomElement} from '../src/common-utils.js';
import {Modal} from '../src/modal.js';

defineCustomElement('test-layout-modal', Modal);

suite('modal layout', () => {
    for (const fullHeightLine of [false, true]) {
        test(`height controls work with full-height-line=${fullHeightLine}`, async () => {
            const modal = document.createElement('test-layout-modal');
            modal.fullHeightLine = fullHeightLine;
            modal.stickyFooter = true;
            modal.title = 'Modal layout test';
            modal.style.cssText = `
                --dbp-modal-min-height: 0;
                --dbp-modal-container-height: 300px;
                --dbp-modal-content-min-height: 0;
                --dbp-modal-content-slot-height: 100%;
                --dbp-modal-content-slot-min-height: 10px;
                --dbp-modal-slotted-content-height: 100%;
                --dbp-modal-slotted-content-min-height: 10px;
            `;
            const content = document.createElement('div');
            content.slot = 'content';
            content.textContent = 'Content';
            modal.appendChild(content);
            document.body.appendChild(modal);
            try {
                await modal.updateComplete;
                modal.open();
                const container = modal.shadowRoot.querySelector('.modal-container');
                const main = modal.shadowRoot.querySelector('.modal-content');
                const slot = modal.shadowRoot.querySelector('slot[name="content"]');
                assert.closeTo(container.getBoundingClientRect().height, 300, 1);
                assert.equal(getComputedStyle(main).minHeight, '0px');
                assert.equal(getComputedStyle(slot).minHeight, '10px');
                assert.equal(getComputedStyle(content).minHeight, '10px');
                assert.closeTo(
                    content.getBoundingClientRect().height,
                    main.getBoundingClientRect().height,
                    1,
                );
                assert.equal(getComputedStyle(modal.modalDialog).display, 'grid');
            } finally {
                modal.close();
                modal.remove();
            }
        });
    }

    test('toggling the line does not change the dialog height', async () => {
        const modal = document.createElement('test-layout-modal');
        modal.title = 'Decorative line test';
        const content = document.createElement('div');
        content.slot = 'content';
        content.textContent = 'Content';
        modal.appendChild(content);
        document.body.appendChild(modal);
        try {
            await modal.updateComplete;
            modal.open();
            const height = modal.modalDialog.getBoundingClientRect().height;
            modal.fullHeightLine = true;
            await modal.updateComplete;
            assert.closeTo(modal.modalDialog.getBoundingClientRect().height, height, 1);
            const container = modal.shadowRoot.querySelector('.modal-container');
            assert.notEqual(getComputedStyle(container, '::before').content, 'none');
            modal.fullHeightLine = false;
            await modal.updateComplete;
            assert.equal(getComputedStyle(container, '::before').content, 'none');
        } finally {
            modal.close();
            modal.remove();
        }
    });
});
