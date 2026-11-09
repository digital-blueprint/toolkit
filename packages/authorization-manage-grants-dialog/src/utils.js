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
