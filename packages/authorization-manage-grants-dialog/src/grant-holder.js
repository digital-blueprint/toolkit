/**
 * A grant of /authorization/resource-action-grants addresses its holder with exactly one of
 * three fields, one per subject type. Everything that has to recognize a holder - the grants
 * loaded from the API as well as a subject picked in the subject select - derives its type,
 * identifier and key from those fields here, so both sides cannot drift apart.
 */

/**
 * @typedef {import('./types.js').GrantHolderFields} GrantHolderFields
 * @typedef {import('./types.js').GrantHolderIdentity} GrantHolderIdentity
 * @typedef {import('./types.js').GrantHolderSubject} GrantHolderSubject
 * @typedef {import('./types.js').GrantHolderType} GrantHolderType
 */

export const SUBJECT_TYPE_PERSON = 'person';
export const SUBJECT_TYPE_USER_GROUP = 'user-group';
export const SUBJECT_TYPE_DYNAMIC_USER_GROUP = 'dynamic-user-group';

/**
 * The dbp-icon shown for each grant holder type, see renderGrantHolderHeading().
 * Dynamic user groups share the user group icon until they get one of their own.
 */
export const GRANT_HOLDER_ICONS = {
    [SUBJECT_TYPE_PERSON]: 'user',
    [SUBJECT_TYPE_USER_GROUP]: 'users',
    [SUBJECT_TYPE_DYNAMIC_USER_GROUP]: 'users',
};

/** The order the grant holder types are displayed in. */
export const GRANT_HOLDER_TYPE_ORDER = [
    SUBJECT_TYPE_PERSON,
    SUBJECT_TYPE_USER_GROUP,
    SUBJECT_TYPE_DYNAMIC_USER_GROUP,
];

/**
 * Takes the identifier out of an IRI, so a holder key stays short and independent of where
 * the API is mounted. Works for relative and absolute IRIs alike.
 *
 * @param {string} iri - IRI of an API item.
 * @returns {string} The last path segment, or an empty string when there is none.
 */
export function getIriIdentifier(iri) {
    return iri.split(/[?#]/)[0].split('/').filter(Boolean).pop() ?? '';
}

/**
 * Identifies the holder of a grant by the fields addressing it.
 *
 * People and dynamic user groups are identified by their identifier, user groups by the
 * identifier of their IRI. The IRI itself is kept for the requests that need it, since it is
 * the only address of the user group item endpoint.
 *
 * @param {GrantHolderFields|null} [holderFields] - Grant holder fields of a grant, or of a
 *     subject as returned by AuthorizationSubjectSelect.getGrantHolder().
 * @returns {GrantHolderIdentity|null} Type, identifier, IRI and the key grouping the grants of a
 *     holder, or null when no holder field is set.
 */
export function deriveGrantHolderIdentity(holderFields) {
    /** @type {GrantHolderType} */
    let type;
    /** @type {string} */
    let identifier;
    /** @type {string|null} */
    let iri = null;

    if (holderFields?.userIdentifier) {
        type = SUBJECT_TYPE_PERSON;
        identifier = holderFields.userIdentifier;
    } else if (holderFields?.userGroup) {
        type = SUBJECT_TYPE_USER_GROUP;
        identifier = getIriIdentifier(holderFields.userGroup);
        iri = holderFields.userGroup;
    } else if (holderFields?.dynamicUserGroupIdentifier) {
        type = SUBJECT_TYPE_DYNAMIC_USER_GROUP;
        identifier = holderFields.dynamicUserGroupIdentifier;
    } else {
        return null;
    }

    return identifier ? {type, identifier, iri, key: `${type}:${identifier}`} : null;
}

/**
 * Returns the fields that address a grant holder in the API.
 * @param {{type: GrantHolderType, subject: GrantHolderSubject}} holder
 * @returns {GrantHolderFields}
 */
export function getGrantHolderFields(holder) {
    const {type, subject} = holder;
    switch (type) {
        case SUBJECT_TYPE_PERSON:
            return {userIdentifier: subject.identifier};
        case SUBJECT_TYPE_USER_GROUP:
            // The only subject the API addresses by IRI instead of by identifier
            return {userGroup: subject['@id']};
        case SUBJECT_TYPE_DYNAMIC_USER_GROUP:
            return {dynamicUserGroupIdentifier: subject.identifier};
        default:
            return {};
    }
}

/**
 * Returns the holder's display name, falling back to its identifier.
 *
 * @param {GrantHolderSubject} subject - Compact person or group subject.
 * @returns {string} Display name used for ordering and labelling holders.
 */
export function getGrantHolderDisplayName(subject) {
    return (
        [subject['givenName'], subject['familyName']].filter(Boolean).join(' ').trim() ||
        subject['name'] ||
        subject['identifier']
    );
}

/**
 * Keeps only the subject fields needed to display and identify a grant holder.
 *
 * @param {object} subject - Person or group API resource.
 * @param {string} type - Grant holder type.
 * @returns {GrantHolderSubject} Compact subject with optional person email.
 */
export function toCompactSubject(subject, type) {
    const identity = {
        '@id': subject['@id'],
        '@type': subject['@type'],
        identifier: subject['identifier'],
    };
    if (type === SUBJECT_TYPE_PERSON) {
        return {
            ...identity,
            givenName: subject['givenName'],
            familyName: subject['familyName'],
            localData: {email: subject['localData']?.email ?? null},
        };
    }
    if (type === SUBJECT_TYPE_USER_GROUP) {
        return {...identity, name: subject['name']};
    }
    return identity;
}
