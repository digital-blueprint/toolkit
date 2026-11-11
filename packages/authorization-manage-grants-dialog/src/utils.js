/**
 * Returns a new Map with the given key set to the given value.
 * @template K
 * @template V
 * @param {Map<K, V>} map - Source map to copy.
 * @param {K} key - Key to set.
 * @param {V} value - Value to associate with the key.
 * @returns {Map<K, V>} New map with the entry set.
 */
export function updateInMap(map, key, value) {
    const next = new Map(map);
    next.set(key, value);
    return next;
}

/**
 * Returns a new Map with the given key removed.
 * @template K
 * @template V
 * @param {Map<K, V>} map - Source map to copy.
 * @param {K} key - Key to remove.
 * @returns {Map<K, V>} New map without the entry.
 */
export function deleteFromMap(map, key) {
    const next = new Map(map);
    next.delete(key);
    return next;
}

/**
 * Creates the collator used to order names and roles the way the current language expects.
 * @param {string} lang - Language tag of the current language.
 * @returns {Intl.Collator} Case-insensitive, number-aware collator.
 */
export function createCollator(lang) {
    return new Intl.Collator(lang, {sensitivity: 'base', numeric: true});
}

/**
 * Compares two identifiers, so entries with an equal name keep a stable order.
 * @param {string} left - First identifier.
 * @param {string} right - Second identifier.
 * @returns {number} Negative, zero or positive, as expected by Array.sort().
 */
export function compareIdentifiers(left, right) {
    return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Returns the name a role has in the given language.
 * @param {{identifier: string, roleNames?: Array<{languageTag: string, name: string}>}} role -
 *     Role definition with its localized names.
 * @param {string} lang - Language tag of the current language.
 * @returns {string} Name of the role, or its identifier when it has no name in that language.
 */
export function getRoleName(role, lang) {
    return role.roleNames?.find((name) => name.languageTag === lang)?.name ?? role.identifier;
}

/**
 * Returns the name of a role addressed by its IRI.
 * @param {Map<string, {identifier: string, roleNames?: Array<{languageTag: string, name: string}>}>} roles -
 *     Known role definitions keyed by their IRI.
 * @param {string} roleIri - IRI of the role.
 * @param {string} lang - Language tag of the current language.
 * @returns {string} Name of the role, or the IRI when the role is unknown.
 */
export function getRoleNameByIri(roles, roleIri, lang) {
    const role = roles.get(roleIri);
    return role ? getRoleName(role, lang) : roleIri;
}

/**
 * Whether a grant may be changed. Changing the role or the shareable state of a grant replaces
 * it with a new one, so it needs the same permission as deleting it.
 * @param {{grantedActions?: string[]}} grant - Grant to check.
 * @returns {boolean} Whether the user may change the grant.
 */
export function isGrantChangeable(grant) {
    return (grant.grantedActions ?? []).includes('delete');
}
