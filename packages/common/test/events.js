import {assert} from 'chai';
import {EventEmitter, EventSubscriber} from '../events.js';


const assertThrowsAsync = async (fn, ...args) => {
    let error;
    try {
        await fn();
    } catch (e) {
        error = e;
    }

    return assert.throws(() => {
        if (error !== undefined)
            throw error;
    }, ...args);
};


suite('events', () => {
    test('emitter basics', () => {
        const ev = new EventEmitter("foo", "foo-req");
        assert.throws(ev.emit);

        const cb = () => { return 42; };
        ev.registerCallback(cb);
        ev.emit();
        ev.unregisterCallback(cb);
        assert.throws(() => {ev.unregisterCallback(cb);});
        assert.throws(ev.emit);
    });

    test('sub basics', async () => {
        const sub = new EventSubscriber("foo", "foo-req");
        await assertThrowsAsync(async () => { await sub.requestData();}, /not there/);

        const buffer = [];
        const handler = (data) => {
            buffer.push(data);
        };
        sub.subscribe(handler);
        sub.subscribe(handler);
        sub.requestUpdate();
        sub.unsubscribe(handler);
        sub.unsubscribe(handler);
        assert.throws(() => {sub.unsubscribe(handler);});
        assert.deepEqual(buffer, []);
    });

    test('both basics', async () => {
        const sub = new EventSubscriber("foo", "foo-req");
        const ev = new EventEmitter("foo", "foo-req");
        let i = 0;
        const cb = () => { return i++; };
        ev.registerCallback(cb);

        const buffer = [];
        const handler = (data) => {
            buffer.push(data);
        };

        sub.subscribe(handler);
        assert.deepEqual(buffer, [1]);
        sub.requestUpdate();
        assert.deepEqual(buffer, [1, 2]);
        sub.requestUpdate();
        assert.deepEqual(buffer, [1, 2, 3]);
        ev.emit();
        assert.deepEqual(buffer, [1, 2, 3, 4]);

        sub.unsubscribe(handler);
        sub.requestUpdate();
        assert.deepEqual(buffer, [1, 2, 3, 4]);
        ev.unregisterCallback(cb);
    });
});
