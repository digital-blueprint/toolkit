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

suite('modal info panel scrolling', () => {
    let modal;
    let wrapper;
    let panel;
    let scrollCalls;

    setup(async () => {
        modal = document.createElement('test-layout-modal');
        modal.setAttribute('info-panel', '');
        modal.title = 'Panel scrolling test';
        const content = document.createElement('div');
        content.slot = 'content';
        content.style.height = '600px';
        content.textContent = 'Main content';
        const info = document.createElement('div');
        info.slot = 'info-panel';
        info.style.height = '400px';
        info.textContent = 'Panel content';
        modal.append(content, info);
        document.body.appendChild(modal);
        await modal.updateComplete;

        // Override layout independently of viewport size to exercise CSS-based detection.
        const style = document.createElement('style');
        style.textContent = `
            dialog { max-height: 300px !important; overflow-y: auto !important; transition: none !important; animation: none !important; }
            .dialog-wrapper { flex-direction: column !important; }
            .modal-container { min-height: 0 !important; max-height: none !important; flex: 0 0 auto !important; width: 100% !important; }
            .info-panel { flex: 0 0 auto !important; width: 100% !important; max-height: 0 !important; transition: none !important; }
            .info-panel--expanded { max-height: 1000px !important; }
        `;
        modal.shadowRoot.appendChild(style);
        wrapper = modal.shadowRoot.querySelector('.dialog-wrapper');
        panel = modal.shadowRoot.querySelector('#info-panel');
        modal.open();
        scrollCalls = [];
        const scrollTo = modal.modalDialog.scrollTo.bind(modal.modalDialog);
        modal.modalDialog.scrollTo = (options) => {
            scrollCalls.push(options);
            // Finish scrolling immediately so assertions do not depend on smooth-scroll timing.
            scrollTo({...options, behavior: 'instant'});
        };
    });

    teardown(() => {
        modal.close();
        modal.remove();
    });

    async function expandPanel() {
        const scrollInfoPanelIntoView = modal._scrollInfoPanelIntoView.bind(modal);
        let scrollTask;
        // Capture completion in the test instead of keeping test-only state in the component.
        modal._scrollInfoPanelIntoView = () => {
            scrollTask = scrollInfoPanelIntoView();
            return scrollTask;
        };
        modal.toggleInfoPanel();
        await modal.updateComplete;
        await scrollTask;
    }

    test('reveals the stacked panel without scrolling the page or changing focus', async () => {
        const closeButton = modal.shadowRoot.querySelector('.modal-close');
        closeButton.focus();
        const pagePosition = {x: window.scrollX, y: window.scrollY};
        await expandPanel();

        assert.lengthOf(scrollCalls, 1);
        assert.isAbove(scrollCalls[0].top, 0);
        assert.isAbove(modal.modalDialog.scrollTop, 0);
        const panelBounds = panel.getBoundingClientRect();
        const dialogBounds = modal.modalDialog.getBoundingClientRect();
        assert.isAtLeast(panelBounds.top, dialogBounds.top - 1);
        assert.isBelow(panelBounds.top, dialogBounds.bottom);
        assert.equal(window.scrollX, pagePosition.x);
        assert.equal(window.scrollY, pagePosition.y);
        assert.strictEqual(modal.shadowRoot.activeElement, closeButton);
    });

    test('does not scroll a horizontal panel', async () => {
        wrapper.style.setProperty('flex-direction', 'row', 'important');
        await expandPanel();
        assert.equal(getComputedStyle(wrapper).flexDirection, 'row');
        assert.isEmpty(scrollCalls);
    });

    test('does not scroll when the expanded modal fits in the viewport', async () => {
        modal.querySelector('[slot="content"]').style.height = '50px';
        modal.querySelector('[slot="info-panel"]').style.height = '50px';
        await expandPanel();

        const dialog = modal.modalDialog;
        assert.isBelow(dialog.getBoundingClientRect().height, window.innerHeight);
        assert.isAtMost(dialog.scrollHeight, dialog.clientHeight);
        assert.isEmpty(scrollCalls);
    });
});
