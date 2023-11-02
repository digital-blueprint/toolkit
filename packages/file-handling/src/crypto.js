import {CompactEncrypt, compactDecrypt, importJWK, base64url} from 'jose';

/**
 * This encrypts the payload using the token,
 * using A256GCM and PBES2-HS256+A128KW.
 *
 * @param {string} token
 * @param {string} payload
 * @returns {string}
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
 * @returns {string}
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
/*
/**
 * This parses a given json webtoken to its different parts
 *
 * @param {string} token
 * @returns {string}
 */
export function parseJwt(token) {
    if (!token) return null;
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
}
