const STATE_KEY = 'dbpScrollPosition';
const POSITION_TOLERANCE = 8;
// How long the page size has to stay unchanged before we consider the layout settled.
const SETTLE_TIMEOUT_MS = 250;
// Hard upper bound on how long we keep correcting the scroll position. Needs to be
// generous because activity content is loaded via dynamic imports that can render
// well after the initial paint.
const GIVE_UP_TIMEOUT_MS = 5000;

/**
 * Persists and restores the window scroll position for each browser history entry.
 *
 * Restoration does not trust a single saved coordinate. Instead it keeps re-applying
 * the target position on every animation frame, tracking a page that is still growing
 * as dynamically imported content renders. It stops once the target has been reached
 * on a scrollable page whose size has stopped changing, or once a hard timeout is hit.
 * A manual scroll by the user cancels an active restore.
 */
export class ScrollRestoration {
    /**
     * @param {Window} browserWindow The window whose scroll position should be managed
     */
    constructor(browserWindow = window) {
        this._browserWindow = browserWindow;
        this._started = false;
        // Set to true to enable verbose logging.
        this._debug = false;
        this._animationFrame = undefined;
        // The position we last set programmatically, used to tell our own scroll events
        // apart from the user taking over.
        this._commandedPosition = undefined;
        this._originalScrollRestoration = /** @type {'auto' | 'manual'} */ (
            browserWindow.history.scrollRestoration
        );

        this._savePosition = this._savePosition.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
        this._handleLocationChanged = this._handleLocationChanged.bind(this);
    }

    /**
     * Start persisting and restoring scroll positions.
     *
     * @param {boolean} restoreImmediately Whether to restore the initial position immediately
     */
    start(restoreImmediately = true) {
        if (this._started) return;

        this._started = true;
        if ('scrollRestoration' in this._browserWindow.history) {
            this._browserWindow.history.scrollRestoration = 'manual';
        }

        this._browserWindow.addEventListener('scroll', this._handleScroll, {passive: true});
        this._browserWindow.addEventListener('pagehide', this._savePosition);
        this._browserWindow.addEventListener('locationchanged', this._handleLocationChanged);
        this._log('start', {
            restoreImmediately,
            savedState: this._browserWindow.history.state?.[STATE_KEY],
        });
        if (restoreImmediately) this.restore();
    }

    /** Stop managing scroll positions and remove all event listeners. */
    stop() {
        if (!this._started) return;

        this._cancelRestore();
        this._savePosition();
        this._browserWindow.removeEventListener('scroll', this._handleScroll);
        this._browserWindow.removeEventListener('pagehide', this._savePosition);
        this._browserWindow.removeEventListener('locationchanged', this._handleLocationChanged);
        if ('scrollRestoration' in this._browserWindow.history) {
            this._browserWindow.history.scrollRestoration = this._originalScrollRestoration;
        }
        this._started = false;
        this._log('stop');
    }

    _log(...args) {
        if (this._debug) {
            console.debug('[ScrollRestoration]', ...args);
        }
    }

    _now() {
        return this._browserWindow.performance.now();
    }

    /** @returns {{maximumX: number, maximumY: number}} The maximum reachable scroll offsets */
    _getScrollMetrics() {
        const document = this._browserWindow.document;
        const element = document.scrollingElement ?? document.documentElement;
        return {
            maximumX: Math.max(0, element.scrollWidth - element.clientWidth),
            maximumY: Math.max(0, element.scrollHeight - element.clientHeight),
        };
    }

    /** Scroll the window and remember where the browser actually landed (it may clamp). */
    _scrollTo(x, y) {
        this._browserWindow.scrollTo(x, y);
        this._commandedPosition = {
            x: this._browserWindow.scrollX,
            y: this._browserWindow.scrollY,
        };
    }

    _handleScroll() {
        // A scroll that landed where we last told it to is our own and must not be
        // treated as the user taking over. Browsers dispatch scroll events
        // asynchronously, so such an event can arrive after the last restore frame has
        // already cleared _animationFrame; we therefore check this whenever we still
        // have a commanded position, not only while a frame is scheduled. Otherwise a
        // trailing self-inflicted scroll would overwrite the saved target with the last
        // (possibly clamped) position we commanded.
        const commanded = this._commandedPosition;
        const isOurs =
            commanded !== undefined &&
            Math.abs(this._browserWindow.scrollX - commanded.x) <= POSITION_TOLERANCE &&
            Math.abs(this._browserWindow.scrollY - commanded.y) <= POSITION_TOLERANCE;
        if (isOurs) return;

        if (this._animationFrame !== undefined) {
            // The scroll did not match what we commanded, so the user is taking over.
            // Stop restoring and never fight them for control.
            this._log('user scroll -> cancel restore');
            this._cancelRestore();
        }

        this._savePosition();
    }

    _savePosition() {
        const history = this._browserWindow.history;
        const state = history.state && typeof history.state === 'object' ? history.state : {};
        const saved = {
            x: this._browserWindow.scrollX,
            y: this._browserWindow.scrollY,
        };
        history.replaceState({...state, [STATE_KEY]: saved}, '');
        this._log('save', saved);
    }

    _handleLocationChanged() {
        if (this._browserWindow.history.state?.[STATE_KEY] !== undefined) {
            this._log('locationchanged -> restore');
            this.restore();
        } else {
            this._log('locationchanged -> no saved position, leaving scroll as is');
        }
    }

    /**
     * Scroll to the top of the page unless a saved position is about to be restored.
     *
     * This is a no-op if the current history entry has a saved scroll position, since
     * that position is (or is about to be) restored and must not be clobbered. This
     * matters on history navigation where the order of scrollToTopUnlessRestoring() and
     * restore() is not guaranteed.
     */
    scrollToTopUnlessRestoring() {
        if (this._browserWindow.history.state?.[STATE_KEY] !== undefined) {
            this._log('scrollToTopUnlessRestoring -> skipped, saved position present');
            return;
        }
        this._cancelRestore();
        this._scrollTo(0, 0);
    }

    _cancelRestore() {
        if (this._animationFrame !== undefined) {
            this._browserWindow.cancelAnimationFrame(this._animationFrame);
            this._animationFrame = undefined;
        }
        this._commandedPosition = undefined;
    }

    /**
     * Restore the position saved in the current history entry.
     *
     * Keeps correcting the scroll position across animation frames until the target is
     * reached and the layout has settled, or until a timeout is reached.
     */
    restore() {
        if (!this._started) return;

        const position = this._browserWindow.history.state?.[STATE_KEY];
        if (position === undefined) {
            this._cancelRestore();
            return;
        }

        // Cancel any in-flight restore and clear the previous commanded position so a
        // trailing scroll event from it cannot be mistaken for this new restore's own.
        this._cancelRestore();
        this._log('restore: start', {target: position});

        const startTime = this._now();
        let lastSize = -1;
        let sizeStableSince = startTime;
        // Skip the first frame so the layout on the next frame is more representative.
        let firstFrame = true;

        const step = () => {
            this._animationFrame = undefined;

            if (firstFrame) {
                firstFrame = false;
                this._scheduleStep(step);
                return;
            }

            const now = this._now();
            const {maximumX, maximumY} = this._getScrollMetrics();

            // The position we actually apply, clamped to what the page can reach right now.
            const targetX = Math.min(position.x, maximumX);
            const targetY = Math.min(position.y, maximumY);

            // Re-apply every frame so we track a growing page and correct clamping.
            this._scrollTo(targetX, targetY);

            // Track whether the page size is still changing.
            const currentSize = maximumX + maximumY;
            if (currentSize !== lastSize) {
                lastSize = currentSize;
                sizeStableSince = now;
            }

            // A page that cannot be scrolled at all is almost always one whose content
            // (loaded via dynamic import) has not rendered yet, so we do not trust it.
            const pageIsScrollable = maximumY > 0;

            // Whether we reached the desired (unclamped) position.
            const atGoal =
                pageIsScrollable &&
                Math.abs(this._browserWindow.scrollX - position.x) <= POSITION_TOLERANCE &&
                Math.abs(this._browserWindow.scrollY - position.y) <= POSITION_TOLERANCE;
            const sizeSettled = pageIsScrollable && now - sizeStableSince >= SETTLE_TIMEOUT_MS;
            const timedOut = now - startTime >= GIVE_UP_TIMEOUT_MS;

            this._log('restore: frame', {
                elapsed: Math.round(now - startTime),
                target: {x: targetX, y: targetY},
                actual: {x: this._browserWindow.scrollX, y: this._browserWindow.scrollY},
                maximumY,
                atGoal,
                sizeSettled,
            });

            // Stop once we have actually reached the goal and the layout has been
            // stable for a while, or once we run out of time. We intentionally keep
            // retrying while the goal is not yet reachable: a page that is still too
            // short is indistinguishable from one whose content has not loaded yet
            // (dynamic imports), so we keep re-pinning until the hard timeout.
            if ((atGoal && sizeSettled) || timedOut) {
                this._animationFrame = undefined;
                this._log('restore: done', {
                    reason: timedOut ? 'timeout' : 'reached',
                    elapsed: Math.round(now - startTime),
                    actual: {x: this._browserWindow.scrollX, y: this._browserWindow.scrollY},
                });
                return;
            }

            this._scheduleStep(step);
        };

        this._scheduleStep(step);
    }

    _scheduleStep(step) {
        this._animationFrame = this._browserWindow.requestAnimationFrame(step);
    }
}
