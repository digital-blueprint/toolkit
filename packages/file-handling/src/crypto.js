import { CompactEncrypt } from 'jose/jwe/compact/encrypt';
import { compactDecrypt } from 'jose/jwe/compact/decrypt';
import { parseJwk } from 'jose/jwk/parse';
import {encode} from 'jose/util/base64url';

/**
 * This "encrypts" the additional information string using the current oauth2
 * token, using A256GCM and PBES2-HS256+A128KW.
 *
 * Since we can't do any server side validation the user needs to confirm in the
 * UI that he/she won't abuse the system.
 *
 * By using the token we make replaying an older requests harder and by using
 * JOSE which needs crypto APIs, abusing the system can't reasonably be done by
 * accident but only deliberately.
 *
 * This doesn't make things more secure, it just makes the intent of the user
 * more clear in case the API isn't used through our UI flow.
 *
 * @param {string} token
 * @param {string} payload
 * @returns {string}
 */
export async function encrypt(token, payload) {
    const encoder = new TextEncoder();
    const key = await parseJwk({kty: 'oct', k: encode(token)}, 'PBES2-HS256+A128KW');
    const jwe = await new CompactEncrypt(encoder.encode(payload))
        .setProtectedHeader({alg: 'PBES2-HS256+A128KW', enc: 'A256GCM'})
        .encrypt(key);
    return jwe;
}


/**
 * This "encrypts" the additional information string using the current oauth2
 * token, using A256GCM and PBES2-HS256+A128KW.
 *
 * Since we can't do any server side validation the user needs to confirm in the
 * UI that he/she won't abuse the system.
 *
 * By using the token we make replaying an older requests harder and by using
 * JOSE which needs crypto APIs, abusing the system can't reasonably be done by
 * accident but only deliberately.
 *
 * This doesn't make things more secure, it just makes the intent of the user
 * more clear in case the API isn't used through our UI flow.
 *
 * @param {string} token
 * @param {string} payload
 * @returns {string}
 */
export async function decrypt(token, payload) {
    const key = await parseJwk({kty: 'oct', k: encode(token)}, 'PBES2-HS256+A128KW');
    const decryption = await compactDecrypt(payload, key, {alg: 'PBES2-HS256+A128KW', enc: 'A256GCM'});
    const secret = new TextDecoder().decode(decryption.plaintext);

    return secret;
}

export function parseJwt (token) {
    if (!token)
        return null;
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
