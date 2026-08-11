import {assert} from 'chai';

import {Router} from '../src/router.js';
import {ScrollRestoration} from '../src/scroll-restoration.js';

suite('router', () => {
    test('basics', async () => {
        const routes = [
            {
                name: 'foo',
                path: '',
                action: (context) => {
                    return {bar: false};
                },
            },
            {
                name: 'bar',
                path: '/bar',
                action: (context) => {
                    return {bar: true};
                },
            },
        ];

        let myState = {};
        const router = new Router(routes, {
            routeName: 'foo',
            getState: () => {
                return myState;
            },
            setState: (state) => {
                myState = state;
            },
            getDefaultState: () => {
                return {};
            },
        });

        await router.setStateFromCurrentLocation();
        await router.update();
        await router.updateFromUrl('/bar?foo=bar#quux');
        assert.equal(myState.bar, true);
        assert.equal(router.getPathname(), '/');
    });
});

suite('scroll restoration', () => {
    const createWindow = () => {
        const browserWindow = new EventTarget();
        const animationFrames = new Map();
        let nextAnimationFrame = 0;

        browserWindow.scrollX = 0;
        browserWindow.scrollY = 0;
        browserWindow.scrollCalls = [];
        // Fake, manually advanced clock so the time-based settle/give-up logic is
        // deterministic in tests.
        browserWindow.now = 0;
        browserWindow.performance = {
            now: () => browserWindow.now,
        };
        // Clamp scroll offsets to the reachable maximum, like a real browser does.
        // The page is larger than the viewport in both dimensions so horizontal and
        // vertical positions can actually be reached.
        const documentElement = {
            clientWidth: 1024,
            clientHeight: 768,
            scrollWidth: 2048,
            scrollHeight: 2000,
        };
        browserWindow.document = {
            documentElement,
            scrollingElement: documentElement,
        };
        browserWindow.history = {
            state: {},
            scrollRestoration: 'auto',
            replaceState(state) {
                this.state = state;
            },
        };
        browserWindow.requestAnimationFrame = (callback) => {
            const id = ++nextAnimationFrame;
            animationFrames.set(id, callback);
            return id;
        };
        browserWindow.cancelAnimationFrame = (id) => animationFrames.delete(id);
        // Advance the clock a bit per frame by default so time-based logic progresses.
        browserWindow.runAnimationFrames = (elapsedMs = 16) => {
            browserWindow.now += elapsedMs;
            const callbacks = [...animationFrames.values()];
            animationFrames.clear();
            callbacks.forEach((callback) => callback());
        };
        browserWindow.hasPendingAnimationFrame = () => animationFrames.size > 0;
        browserWindow.scrollTo = (x, y) => {
            const element = documentElement;
            const maximumX = Math.max(0, element.scrollWidth - element.clientWidth);
            const maximumY = Math.max(0, element.scrollHeight - element.clientHeight);
            browserWindow.scrollX = Math.min(Math.max(0, x), maximumX);
            browserWindow.scrollY = Math.min(Math.max(0, y), maximumY);
            browserWindow.scrollCalls.push({x: browserWindow.scrollX, y: browserWindow.scrollY});
        };
        return browserWindow;
    };

    // Run frames until the restoration stops scheduling new ones (or a cap is hit),
    // advancing the fake clock each frame.
    const settle = (browserWindow, {elapsedMs = 16, maxFrames = 400} = {}) => {
        for (let i = 0; i < maxFrames; i++) {
            if (!browserWindow.hasPendingAnimationFrame()) break;
            browserWindow.runAnimationFrames(elapsedMs);
        }
    };

    test('stores the current position in the history entry', () => {
        const browserWindow = createWindow();
        browserWindow.history.state = {otherState: true};
        const restoration = new ScrollRestoration(browserWindow);

        restoration.start(false);
        browserWindow.scrollX = 12;
        browserWindow.scrollY = 34;
        browserWindow.dispatchEvent(new Event('scroll'));

        assert.deepEqual(browserWindow.history.state, {
            otherState: true,
            dbpScrollPosition: {x: 12, y: 34},
        });
        assert.equal(browserWindow.history.scrollRestoration, 'manual');

        restoration.stop();
        assert.equal(browserWindow.history.scrollRestoration, 'auto');
    });

    test('restores a saved position after a history change', () => {
        const browserWindow = createWindow();
        const restoration = new ScrollRestoration(browserWindow);
        restoration.start(false);

        browserWindow.history.state = {dbpScrollPosition: {x: 56, y: 78}};
        browserWindow.dispatchEvent(new Event('locationchanged'));
        settle(browserWindow);

        assert.equal(browserWindow.scrollX, 56);
        assert.equal(browserWindow.scrollY, 78);
        restoration.stop();
    });

    test('reaches the saved position once a growing page becomes tall enough', () => {
        const browserWindow = createWindow();
        // Start with a page too short to reach the saved coordinate.
        browserWindow.document.documentElement.scrollHeight = 900;
        browserWindow.history.state = {dbpScrollPosition: {x: 0, y: 1400}};
        const restoration = new ScrollRestoration(browserWindow);

        restoration.start();
        // Skip-first + one correction: clamped to the current (short) bottom.
        browserWindow.runAnimationFrames();
        browserWindow.runAnimationFrames();
        assert.equal(browserWindow.scrollY, 900 - 768);

        // Content finishes loading and the page grows tall enough.
        browserWindow.document.documentElement.scrollHeight = 3000;
        settle(browserWindow);

        // We land exactly on the saved coordinate.
        assert.equal(browserWindow.scrollY, 1400);
        restoration.stop();
    });

    test('gives up on the hard timeout when a scrollable page stays too short', () => {
        const browserWindow = createWindow();
        // Page is scrollable but never tall enough to reach the saved position
        // (max reachable y is 900 - 768 = 132, target is 300). A too-short page is
        // indistinguishable from one whose content has not loaded yet, so we keep
        // re-pinning and only stop once the hard give-up timeout is hit.
        browserWindow.document.documentElement.scrollHeight = 900;
        browserWindow.history.state = {dbpScrollPosition: {x: 0, y: 300}};
        const restoration = new ScrollRestoration(browserWindow);

        restoration.start();
        settle(browserWindow);

        // We stop on the timeout, landing as close as possible (the bottom).
        assert.equal(browserWindow.scrollY, 132);
        // Restoration is no longer active: a later user scroll is saved normally.
        browserWindow.document.documentElement.scrollHeight = 2000;
        browserWindow.scrollY = 111;
        browserWindow.dispatchEvent(new Event('scroll'));
        assert.equal(browserWindow.history.state.dbpScrollPosition.y, 111);
        restoration.stop();
    });

    test('keeps waiting while the page is not scrollable yet (content loading)', () => {
        const browserWindow = createWindow();
        // A page that cannot scroll at all is treated as still-loading, not settled.
        browserWindow.document.documentElement.scrollHeight = 768;
        browserWindow.history.state = {dbpScrollPosition: {x: 0, y: 300}};
        const restoration = new ScrollRestoration(browserWindow);

        restoration.start();
        // Run well past the settle window; because the page is not scrollable we must
        // still be trying rather than having given up.
        for (let i = 0; i < 40; i++) browserWindow.runAnimationFrames();
        assert.isTrue(browserWindow.hasPendingAnimationFrame());

        // Content finally loads and the page becomes tall enough.
        browserWindow.document.documentElement.scrollHeight = 1268;
        settle(browserWindow);
        assert.equal(browserWindow.scrollY, 300);
        restoration.stop();
    });

    test('cancels restoration when the user scrolls manually', () => {
        const browserWindow = createWindow();
        browserWindow.history.state = {dbpScrollPosition: {x: 0, y: 500}};
        const restoration = new ScrollRestoration(browserWindow);

        restoration.start();
        browserWindow.runAnimationFrames();

        // User scrolls somewhere else mid-restore.
        browserWindow.scrollY = 42;
        browserWindow.dispatchEvent(new Event('scroll'));

        const callsAfterUserScroll = browserWindow.scrollCalls.length;
        settle(browserWindow);
        // Restoration stopped driving the position; the user's scroll was persisted.
        assert.equal(browserWindow.scrollCalls.length, callsAfterUserScroll);
        assert.equal(browserWindow.history.state.dbpScrollPosition.y, 42);
        restoration.stop();
    });

    test('seeds the current position into a fresh history entry', () => {
        const browserWindow = createWindow();
        browserWindow.scrollX = 12;
        browserWindow.scrollY = 500;
        const restoration = new ScrollRestoration(browserWindow);
        restoration.start();

        // A fresh entry (e.g. opening/closing a modal) has no saved position.
        browserWindow.history.state = {};
        browserWindow.dispatchEvent(new Event('locationchanged'));

        // The scroll position must not change, but it must be persisted into the new
        // entry so a later reload can restore it.
        assert.deepEqual(browserWindow.scrollCalls, []);
        assert.equal(browserWindow.scrollY, 500);
        assert.deepEqual(browserWindow.history.state.dbpScrollPosition, {x: 12, y: 500});
        restoration.stop();
    });

    test('scrollToTopUnlessRestoring scrolls to the top on demand', () => {
        const browserWindow = createWindow();
        browserWindow.scrollY = 500;
        const restoration = new ScrollRestoration(browserWindow);
        restoration.start();

        restoration.scrollToTopUnlessRestoring();

        assert.deepEqual(browserWindow.scrollCalls, [{x: 0, y: 0}]);
        restoration.stop();
    });

    test('scrollToTopUnlessRestoring is a no-op when a saved position is present', () => {
        const browserWindow = createWindow();
        browserWindow.scrollY = 500;
        const restoration = new ScrollRestoration(browserWindow);
        restoration.start();

        browserWindow.history.state = {dbpScrollPosition: {x: 0, y: 300}};
        restoration.scrollToTopUnlessRestoring();

        assert.deepEqual(browserWindow.scrollCalls, []);
        assert.equal(browserWindow.scrollY, 500);
        restoration.stop();
    });
});
