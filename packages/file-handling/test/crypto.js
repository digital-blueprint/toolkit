import {assert} from '@esm-bundle/chai';
import {encrypt, decrypt} from '../src/crypto';

suite('encyptAndDecrypt', () => {
    test('encrypt', async () => {
        let res = await encrypt('token', 'my-payload');
        assert.isString(res);
    });
    test('encryptAndDecrypt', async () => {
        let payload = 'my-payload';
        let secret = await encrypt('token', payload);
        let plain = await decrypt('token', secret);
        assert.equal(payload, plain);
    });
});
