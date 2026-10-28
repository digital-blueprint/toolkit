/**
 * A grant of /authorization/resource-action-grants addresses its holder with exactly one of
 * three fields, one per subject type. Everything that has to recognize a holder - the grants
 * loaded from the API as well as a subject picked in the subject select - derives its type,
 * identifier and key from those fields here, so both sides cannot drift apart.
 */

export const SUBJECT_TYPE_PERSON = 'person';
export const SUBJECT_TYPE_USER_GROUP = 'user-group';
export const SUBJECT_TYPE_DYNAMIC_USER_GROUP = 'dynamic-user-group';

/**
 * @typedef {{
 *     userIdentifier?: string,
 *     userGroup?: string,
 *     dynamicUserGroupIdentifier?: string
 * }} GrantHolderFields
 */

/**
 * @typedef {{
 *     type: string,
 *     identifier: string,
 *     iri: string|null,
 *     key: string
 * }} GrantHolderParts
 */

/**
 * Takes the identifier out of an IRI, so a holder key stays short and independent of where
 * the API is mounted. Works for relative and absolute IRIs alike.
 *
 * @param {string} iri - IRI of an API item.
 * @returns {string} The last path segment, or an empty string when there is none.
 */
function getIriIdentifier(iri) {
    return iri.split(/[?#]/)[0].split('/').filter(Boolean).pop() ?? '';
}

/**
 * Identifies the holder of a grant by the fields addressing it.
 *
 * People and dynamic user groups are identified by their identifier, user groups by the
 * identifier of their IRI. The IRI itself is kept for the requests that need it, since it is
 * the only address of the user group item endpoint.
 *
 * @param {GrantHolderFields|null} [grantHolder] - Grant holder fields of a grant, or of a
 *     subject as returned by AuthorizationSubjectSelect.getGrantHolder().
 * @returns {GrantHolderParts|null} Type, identifier, IRI and the key grouping the grants of a
 *     holder, or null when no holder field is set.
 */
export function getGrantHolderParts(grantHolder) {
    let type;
    let identifier;
    /** @type {string|null} */
    let iri = null;

    if (grantHolder?.userIdentifier) {
        type = SUBJECT_TYPE_PERSON;
        identifier = grantHolder.userIdentifier;
    } else if (grantHolder?.userGroup) {
        type = SUBJECT_TYPE_USER_GROUP;
        identifier = getIriIdentifier(grantHolder.userGroup);
        iri = grantHolder.userGroup;
    } else if (grantHolder?.dynamicUserGroupIdentifier) {
        type = SUBJECT_TYPE_DYNAMIC_USER_GROUP;
        identifier = grantHolder.dynamicUserGroupIdentifier;
    } else {
        return null;
    }

    return identifier ? {type, identifier, iri, key: `${type}:${identifier}`} : null;
}
