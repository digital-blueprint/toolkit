import {ScopedElementsMixin} from '@dbp-toolkit/common';
import DBPLitElement from '../../common/dbp-lit-element';

export default class DbpFileHandlingLitElement extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
    }

    static get properties() {
        return {
            ...super.properties,
        };
    }

    /**
     * Handles the scroll of the current element and displays the right and/or the left paddle
     * to match the scrolling position
     *
     * @param e
     */
    handleScroll(e) {
        if (!this._('.right-paddle') || !this._('.left-paddle')) return;
        let horizontal = e.currentTarget.scrollLeft;
        let scrollWidth = e.currentTarget.scrollWidth - e.currentTarget.clientWidth; //e.currentTarget.scrollLeftMax isn't support except firefox
        if (horizontal > 0) {
            this._('.left-paddle').classList.remove('hidden');
        }
        if (horizontal < scrollWidth) {
            this._('.right-paddle').classList.remove('hidden');
        }

        if (horizontal >= scrollWidth) {
            this._('.right-paddle').classList.add('hidden');
        }

        if (horizontal <= 0) {
            this._('.left-paddle').classList.add('hidden');
        }
    }

    /**
     * Scrolls smooth to the maximum right of an given element
     *
     * @param element
     */
    handleScrollRight(element) {
        const maxwidth = element.scrollWidth - element.clientWidth;
        let container = element;
        let scrollAmount = 0;
        let slideTimer = setInterval(function () {
            container.scrollLeft += 10;
            scrollAmount += 10;
            if (scrollAmount >= maxwidth) {
                window.clearInterval(slideTimer);
            }
        }, 25);
    }

    /**
     * Scrolls smooth to the min left of an given element
     *
     * @param element
     */
    handleScrollLeft(element) {
        const minwidth = 0;
        let container = element;
        let scrollAmount = element.scrollWidth - element.clientWidth;
        let slideTimer = setInterval(function () {
            container.scrollLeft -= 10;
            scrollAmount -= 10;
            if (scrollAmount <= minwidth) {
                window.clearInterval(slideTimer);
            }
        }, 25);
    }
}
