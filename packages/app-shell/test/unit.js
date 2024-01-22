import {assert} from 'chai';

import {Router} from '../src/router.js';

suite('router', () => {
    test('basics', () => {
        const routes = [
            {
                name: 'foo',
                path: '',
                action: (context) => {
                    return {};
                },
            },
        ];

        const router = new Router(routes, {
            routeName: 'foo',
            getState: () => {
                return {};
            },
            setState: (state) => {},
            getDefaultState: () => {
                return {};
            },
        });

        router.setStateFromCurrentLocation();
        router.update();
        router.updateFromPathname('/');
        assert.equal(router.getPathname(), '/');
    });
});
