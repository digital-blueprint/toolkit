import {css} from 'lit';

/**
 * Styles that let tippy position the tooltip correctly when the component is slotted into other
 * components (e.g. a dbp-modal), see getTippyPositioningProps().
 */
export function getTooltipPositioningCSS() {
    // language=css
    return css`
        /* The tooltip is appended to the shadow root of this component. Its offset parent has to be
           visible from there, otherwise Popper calculates the position relative to the wrong element
           (e.g. a positioned scroll container in the shadow DOM of a modal) */
        :host {
            position: relative;
            display: inline-block;
        }

        /* Without this the tooltip would shrink to the width of the small host element */
        [data-tippy-root] {
            width: max-content;
            max-width: min(350px, calc(100vw - 16px));
        }
    `;
}

/**
 * Returns the parent in the flat tree, so slotted elements continue at their slot
 * and shadow roots at their host.
 * @param {Node} node
 * @returns {Node|null}
 */
function getFlatTreeParent(node) {
    if (node instanceof Element && node.assignedSlot) {
        return node.assignedSlot;
    }
    if (node.parentNode) {
        return node.parentNode;
    }
    return node instanceof ShadowRoot ? node.host : null;
}

/**
 * Finds the nearest ancestor that clips its content, also across shadow DOM boundaries.
 * @param {Element} element
 * @returns {Element|null}
 */
export function findClippingContainer(element) {
    for (let node = getFlatTreeParent(element); node; node = getFlatTreeParent(node)) {
        if (node instanceof Element && node !== document.documentElement) {
            const {overflowX, overflowY} = getComputedStyle(node);
            if (/auto|scroll|hidden|clip/.test(`${overflowX} ${overflowY}`)) {
                return node;
            }
        }
    }

    return null;
}

/**
 * Tippy props that keep the tooltip inside the visible area of its clipping container.
 * Popper can't detect clipping containers of slotted elements in other shadow roots by itself,
 * so the container is looked up when the tooltip is shown and passed explicitly.
 * @param {Element} host The tooltip component
 */
export function getTippyPositioningProps(host) {
    return {
        onShow(instance) {
            const boundary = findClippingContainer(host) ?? 'clippingParents';
            instance.setProps({
                popperOptions: {
                    modifiers: [
                        {name: 'preventOverflow', options: {boundary, padding: 8}},
                        {name: 'flip', options: {boundary, padding: 8}},
                    ],
                },
            });
        },
    };
}
