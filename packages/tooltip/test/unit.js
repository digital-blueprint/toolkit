import {assert} from 'chai';
import '../src/dbp-tooltip';
import '../src/dbp-button-tooltip';
import '../src/dbp-info-tooltip';

suite('dbp-tooltip', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-tooltip');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});

/**
 * Mimics a dbp-modal: the tooltip is slotted into a transformed dialog with a positioned
 * scroll container inside the shadow DOM of another component.
 */
class TooltipTestModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'}).innerHTML = `
            <style>
                dialog { width: 400px; padding: 20px; overflow: hidden; transform: translateY(0); }
                .content { position: relative; overflow-y: auto; max-height: 300px; }
            </style>
            <dialog><div class="content"><slot></slot></div></dialog>`;
    }

    get content() {
        return this.shadowRoot.querySelector('.content');
    }
}
customElements.define('dbp-tooltip-test-modal', TooltipTestModal);

const waitForPositioning = () => new Promise((resolve) => setTimeout(resolve, 100));

for (const [tagName, referenceId] of [
    ['dbp-button-tooltip', 'info-tooltip-button'],
    ['dbp-info-tooltip', 'info-tooltip-icon'],
    ['dbp-tooltip', 'tooltip-icon'],
]) {
    suite(`${tagName} inside a modal`, () => {
        let modal;

        setup(async () => {
            modal = document.createElement('dbp-tooltip-test-modal');
            modal.innerHTML = `
                <div style="padding-top: 150px; text-align: right">
                    <${tagName} type="button" button-text=" " icon-name="information"
                        text-content="${'A long tooltip text that needs more space than is left next to the icon. '.repeat(2)}"></${tagName}>
                </div>`;
            document.body.appendChild(modal);
            modal.shadowRoot.querySelector('dialog').showModal();
            await modal.querySelector(tagName).updateComplete;
        });

        teardown(() => {
            modal.remove();
        });

        test('should show the tooltip above the icon and inside the scroll container', async () => {
            const reference = modal.querySelector(tagName).shadowRoot.getElementById(referenceId);
            reference._tippy.show();
            await waitForPositioning();

            const box = reference._tippy.popper.querySelector('.tippy-box').getBoundingClientRect();
            const referenceRect = reference.getBoundingClientRect();
            const contentRect = modal.content.getBoundingClientRect();

            assert.isAtLeast(box.left, contentRect.left - 1, 'cut off on the left');
            assert.isAtMost(box.right, contentRect.right + 1, 'cut off on the right');
            assert.isAtMost(box.bottom, referenceRect.top + 1, 'not above the icon');
            assert.isAtLeast(box.bottom, referenceRect.top - 20, 'too far away from the icon');
            assert.isAbove(box.right, referenceRect.left, 'not next to the icon');
        });
    });
}

suite('dbp-button-tooltip outside of a modal', () => {
    let container;

    setup(async () => {
        container = document.createElement('div');
        container.style.paddingTop = '150px';
        container.innerHTML = `<dbp-button-tooltip type="button" button-text=" " text-content="Short text"></dbp-button-tooltip>`;
        document.body.appendChild(container);
        await container.querySelector('dbp-button-tooltip').updateComplete;
    });

    teardown(() => {
        container.remove();
    });

    test('should show the tooltip above the icon inside the viewport', async () => {
        const reference = container
            .querySelector('dbp-button-tooltip')
            .shadowRoot.getElementById('info-tooltip-button');
        reference._tippy.show();
        await waitForPositioning();

        const box = reference._tippy.popper.querySelector('.tippy-box').getBoundingClientRect();
        const referenceRect = reference.getBoundingClientRect();

        assert.isAtLeast(box.left, 0, 'cut off on the left');
        assert.isAtMost(box.bottom, referenceRect.top + 1, 'not above the icon');
        assert.isAtLeast(box.bottom, referenceRect.top - 20, 'too far away from the icon');
    });
});
