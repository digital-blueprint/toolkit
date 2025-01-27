import {assert} from 'chai';

import {Router} from '../src/router.js';

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
