import {assert} from 'chai';
import {encrypt, decrypt, parseJwt} from '../src/crypto';

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
    test('parseJwt', async () => {
        let parsed = parseJwt(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        );
        assert.equal(parsed.sub, '1234567890');
        assert.equal(parsed.name, 'John Doe');
        assert.equal(parsed.iat, 1516239022);
    });
});
