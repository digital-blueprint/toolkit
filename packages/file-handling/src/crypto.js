import {CompactEncrypt, compactDecrypt, importJWK, base64url} from 'jose';

/**
 * This encrypts the payload using the token,
 * using A256GCM and PBES2-HS256+A128KW.
 *
 * @param {string} token
 * @param {string} payload
 * @returns {Promise<string>}
 */
export async function encrypt(token, payload) {
    const encoder = new TextEncoder();
    const key = await importJWK({kty: 'oct', k: base64url.encode(token)}, 'PBES2-HS256+A128KW');
    const jwe = await new CompactEncrypt(encoder.encode(payload))
        .setProtectedHeader({alg: 'PBES2-HS256+A128KW', enc: 'A256GCM'})
        .encrypt(key);
    return jwe;
}

/**
 * This creates a key from the given token and
 * decrypts the payload using the token,
 * using A256GCM and PBES2-HS256+A128KW.
 *
 * @param {string} token
 * @param {string} payload
 * @returns {Promise<string>}
 */
export async function decrypt(token, payload) {
    const key = await importJWK({kty: 'oct', k: base64url.encode(token)}, 'PBES2-HS256+A128KW');
    const decryption = await compactDecrypt(payload, key, {
        keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
        contentEncryptionAlgorithms: ['A256GCM'],
    });
    const secret = new TextDecoder().decode(decryption.plaintext);

    return secret;
}

/**
 * This parses a given json webtoken and returns the payload.
 * Note that there is no signature verification.
 *
 * @param {string} token
 * @returns {object}
 */
export function parseJwt(token) {
    let parts =  token.split('.');
    if (parts.length < 2) {
        throw new Error('invalid JWT');
    }
    let payload = parts[1];
    const bytes = Uint8Array.from(atob(payload), (m) => m.codePointAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
}
