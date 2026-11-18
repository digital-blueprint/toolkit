/**
 * The rules the grant management dialog applies to its unsaved state. The functions read and
 * return plain values, so they can be used and tested without a component instance.
 */

import {deleteFromMap, updateInMap} from './utils.js';

/**
 * @typedef {import('./types.js').RoleDefinition} RoleDefinition
 * @typedef {import('./types.js').GrantHolder} GrantHolder
 * @typedef {import('./types.js').RoleGrant} RoleGrant
 * @typedef {import('./types.js').DraftRoleGrant} DraftRoleGrant
 * @typedef {import('./types.js').DraftGrantHolder} DraftGrantHolder
 * @typedef {import('./types.js').PendingGrantChange} PendingGrantChange
 */

/**
 * Returns the entries a holder has in one of the unsaved state maps. Holders without entries
 * are not kept in those maps, so a missing entry is the same as an empty list.
 * @template T
 * @param {Map<string, T[]>} map - Map keyed by holder key.
 * @param {string} holderKey - Key of an existing or draft grant holder.
 * @returns {T[]} Entries of the holder.
 */
function holderEntries(map, holderKey) {
    return map.get(holderKey) ?? [];
}

/**
 * Returns the unsaved change of a saved grant, if there is one.
 * @param {Map<string, PendingGrantChange[]>} pendingGrantChanges - Unsaved changes keyed by holder key.
 * @param {string} holderKey - Key of the grant's holder.
 * @param {string} grantIdentifier - Identifier of the saved grant.
 * @returns {PendingGrantChange|null} The pending change, or null when the grant is unchanged.
 */
export function getPendingGrantChange(pendingGrantChanges, holderKey, grantIdentifier) {
    return (
        holderEntries(pendingGrantChanges, holderKey).find(
            (change) => change.grantIdentifier === grantIdentifier,
        ) ?? null
    );
}

/**
 * Whether another draft role row can be added to a holder. The holder needs a role that is
 * still free, and the row it already has must have a role selected.
 * @param {object} options - Current grant state of the holder.
 * @param {Map<string, RoleDefinition>} options.roles - Known role definitions keyed by their IRI.
 * @param {Map<string, GrantHolder>} options.grantHolders - Saved grant holders keyed by holder key.
 * @param {Map<string, DraftRoleGrant[]>} options.draftRoleGrants - Unsaved role rows keyed by holder key.
 * @param {Map<string, PendingGrantChange[]>} options.pendingGrantChanges - Unsaved changes keyed by holder key.
 * @param {string} options.holderKey - Key of an existing or draft grant holder.
 * @returns {boolean} Whether a draft role row can be added.
 */
export function canAddDraftRole({
    roles,
    grantHolders,
    draftRoleGrants,
    pendingGrantChanges,
    holderKey,
}) {
    if (hasIncompleteDraftRole(draftRoleGrants, holderKey)) {
        return false;
    }
    return (
        getAvailableRoles({
            roles: roles,
            grantHolders: grantHolders,
            draftRoleGrants: draftRoleGrants,
            pendingGrantChanges: pendingGrantChanges,
            holderKey: holderKey,
        }).length > 0
    );
}

/**
 * Whether a holder has unsaved state that can be saved. A holder needs at least one draft
 * role row or one unsaved change, and no draft row may be left without a role.
 * @param {Map<string, DraftRoleGrant[]>} draftRoleGrants - Unsaved role rows keyed by holder key.
 * @param {Map<string, PendingGrantChange[]>} pendingGrantChanges - Unsaved changes keyed by holder key.
 * @param {string} holderKey - Key of an existing or draft grant holder.
 * @returns {boolean} Whether the holder can be saved.
 */
export function isHolderSaveable(draftRoleGrants, pendingGrantChanges, holderKey) {
    // An incomplete draft row always blocks saving.
    if (hasIncompleteDraftRole(draftRoleGrants, holderKey)) {
        return false;
    }
    return (
        holderEntries(draftRoleGrants, holderKey).length > 0 ||
        holderEntries(pendingGrantChanges, holderKey).length > 0
    );
}

/**
 * Whether a holder has a draft role row with no role selected yet. Such a row blocks adding
 * another row and blocks saving the holder.
 * @param {Map<string, DraftRoleGrant[]>} draftRoleGrants - Unsaved role rows keyed by holder key.
 * @param {string} holderKey - Key of an existing or draft grant holder.
 * @returns {boolean} Whether a draft row is still incomplete.
 */
export function hasIncompleteDraftRole(draftRoleGrants, holderKey) {
    return holderEntries(draftRoleGrants, holderKey).some((draft) => !draft.roleIdentifier);
}

/**
 * Records an unsaved change of a saved grant. The change is dropped again as soon as it
 * matches the saved grant, so reverting a selection also makes the holder unsaveable again.
 * @param {Map<string, PendingGrantChange[]>} pendingGrantChanges - Unsaved changes keyed by holder key.
 * @param {string} holderKey - Key of the holder the grant belongs to.
 * @param {RoleGrant} grant - Saved grant that was changed.
 * @param {{roleIdentifier?: string, shareable?: boolean}} changes - Changed values.
 * @returns {Map<string, PendingGrantChange[]>} New map holding the recorded change.
 */
export function setPendingGrantChange(pendingGrantChanges, holderKey, grant, changes) {
    const currentChange = getPendingGrantChange(pendingGrantChanges, holderKey, grant.identifier);
    const nextChange = {
        grantIdentifier: grant.identifier,
        roleIdentifier: currentChange?.roleIdentifier ?? grant.roleDefinition['@id'],
        shareable: currentChange?.shareable ?? Boolean(grant.shareable),
        ...changes,
    };
    const otherChanges = holderEntries(pendingGrantChanges, holderKey).filter(
        (change) => change.grantIdentifier !== grant.identifier,
    );
    const isUnchanged =
        nextChange.roleIdentifier === grant.roleDefinition['@id'] &&
        nextChange.shareable === Boolean(grant.shareable);
    const holderChanges = isUnchanged ? otherChanges : [...otherChanges, nextChange];

    return holderChanges.length
        ? updateInMap(pendingGrantChanges, holderKey, holderChanges)
        : deleteFromMap(pendingGrantChanges, holderKey);
}

/**
 * Adds an empty draft role row to a holder. The row keeps its client identifier until it is
 * saved, so the rendered rows stay stable while the user fills them in.
 * @param {Map<string, DraftRoleGrant[]>} draftRoleGrants - Unsaved role rows keyed by holder key.
 * @param {string} holderKey - Key of an existing or draft grant holder.
 * @param {string} clientIdentifier - Client-side identifier of the new draft role.
 * @returns {Map<string, DraftRoleGrant[]>} New map holding the added draft role.
 */
export function addDraftRoleGrant(draftRoleGrants, holderKey, clientIdentifier) {
    return updateInMap(draftRoleGrants, holderKey, [
        ...holderEntries(draftRoleGrants, holderKey),
        {clientIdentifier: clientIdentifier, roleIdentifier: null, shareable: false},
    ]);
}

/**
 * Removes one unsaved role row, and the draft holder it leaves without any role. A draft
 * holder has no saved grants, so it has nothing left to show once its last row is gone.
 * @param {Map<string, DraftRoleGrant[]>} draftRoleGrants - Unsaved role rows keyed by holder key.
 * @param {Map<string, DraftGrantHolder>} draftGrantHolders - Unsaved grant holders keyed by holder key.
 * @param {string} holderKey - Key of the draft role's holder.
 * @param {string} clientIdentifier - Client-side draft role identifier.
 * @returns {{draftRoleGrants: Map<string, DraftRoleGrant[]>, draftGrantHolders: Map<string, DraftGrantHolder>}}
 *     New maps, each unchanged when the removal did not affect it.
 */
export function removeDraftRoleGrant(
    draftRoleGrants,
    draftGrantHolders,
    holderKey,
    clientIdentifier,
) {
    const remainingRoles = holderEntries(draftRoleGrants, holderKey).filter(
        (grant) => grant.clientIdentifier !== clientIdentifier,
    );
    const removesHolder = !remainingRoles.length && draftGrantHolders.has(holderKey);

    return {
        draftRoleGrants: remainingRoles.length
            ? updateInMap(draftRoleGrants, holderKey, remainingRoles)
            : deleteFromMap(draftRoleGrants, holderKey),
        draftGrantHolders: removesHolder
            ? deleteFromMap(draftGrantHolders, holderKey)
            : draftGrantHolders,
    };
}

/**
 * Updates one draft role of a holder.
 * @param {Map<string, DraftRoleGrant[]>} draftRoleGrants - Unsaved role rows keyed by holder key.
 * @param {string} holderKey - Key of the draft role's holder.
 * @param {string} clientIdentifier - Client-side draft role identifier.
 * @param {Partial<DraftRoleGrant>} changes - Draft role properties to update.
 * @returns {Map<string, DraftRoleGrant[]>} New map holding the updated draft role.
 */
export function updateDraftRoleGrant(draftRoleGrants, holderKey, clientIdentifier, changes) {
    return updateInMap(
        draftRoleGrants,
        holderKey,
        holderEntries(draftRoleGrants, holderKey).map((grant) =>
            grant.clientIdentifier === clientIdentifier ? {...grant, ...changes} : grant,
        ),
    );
}

/**
 * Removes the unsaved changes that no longer belong to a saved grant, so a reload cannot
 * leave changes behind that can never be applied.
 * @param {Map<string, PendingGrantChange[]>} pendingGrantChanges - Unsaved changes keyed by holder key.
 * @param {Map<string, GrantHolder>} grantHolders - Saved grant holders keyed by holder key.
 * @returns {Map<string, PendingGrantChange[]>} New map holding the changes that still apply.
 */
export function prunePendingGrantChanges(pendingGrantChanges, grantHolders) {
    /** @type {Map<string, PendingGrantChange[]>} */
    const prunedChanges = new Map();
    for (const [holderKey, changes] of pendingGrantChanges) {
        const grants = grantHolders.get(holderKey)?.grants ?? [];
        const remainingChanges = changes.filter((change) =>
            grants.some((grant) => grant.identifier === change.grantIdentifier),
        );
        if (remainingChanges.length) {
            prunedChanges.set(holderKey, remainingChanges);
        }
    }
    return prunedChanges;
}

/**
 * Removes a deleted grant from the holder it belonged to. A holder exists through its grants
 * only, so it is removed together with its last one - unless it still holds unsaved role
 * rows, which would have nothing left to be rendered in.
 * @param {Map<string, GrantHolder>} grantHolders - Saved grant holders keyed by holder key.
 * @param {string} grantIdentifier - Identifier of the deleted grant.
 * @param {Map<string, DraftRoleGrant[]>} draftRoleGrants - Unsaved role rows keyed by holder key.
 * @returns {Map<string, GrantHolder>} New map without the grant, or the given one when the
 *     grant was not part of it.
 */
export function removeGrantFromHolders(grantHolders, grantIdentifier, draftRoleGrants) {
    const holderEntry = [...grantHolders].find(([, holder]) =>
        holder.grants.some((grant) => grant.identifier === grantIdentifier),
    );
    // The grant is already missing from the list, so there is nothing left to remove.
    if (!holderEntry) {
        return grantHolders;
    }

    const [holderKey, holder] = holderEntry;
    const remainingGrants = holder.grants.filter((grant) => grant.identifier !== grantIdentifier);
    // Keeping the holder keeps its place in the list, so unsaved rows stay where they are.
    if (remainingGrants.length || holderEntries(draftRoleGrants, holderKey).length) {
        return updateInMap(grantHolders, holderKey, {...holder, grants: remainingGrants});
    }
    return deleteFromMap(grantHolders, holderKey);
}

/**
 * Removes the unsaved holders a reload has turned into saved ones, so the same holder is not
 * rendered as a draft next to the grants it now has.
 * @param {Map<string, GrantHolder>} grantHolders - Saved grant holders keyed by holder key.
 * @param {Map<string, DraftGrantHolder>} draftGrantHolders - Unsaved grant holders keyed by holder key.
 * @returns {Map<string, DraftGrantHolder>} New map without the saved holders, or the given one
 *     when none of them was saved.
 */
export function promoteSavedDraftHolders(grantHolders, draftGrantHolders) {
    const remainingHolders = new Map(
        [...draftGrantHolders].filter(([holderKey]) => !grantHolders.has(holderKey)),
    );
    // The map is rendered, so it is only replaced when a holder was removed from it.
    return remainingHolders.size === draftGrantHolders.size ? draftGrantHolders : remainingHolders;
}

/**
 * Removes the unsaved role rows of holders that are no longer rendered, since a row without
 * a holder section can neither be seen nor saved. This guards against a holder another session
 * removed, rather than against anything the user did.
 * @param {Map<string, GrantHolder>} grantHolders - Saved grant holders keyed by holder key.
 * @param {Map<string, DraftGrantHolder>} draftGrantHolders - Unsaved grant holders keyed by holder key.
 * @param {Map<string, DraftRoleGrant[]>} draftRoleGrants - Unsaved role rows keyed by holder key.
 * @returns {Map<string, DraftRoleGrant[]>} New map without the unreachable rows, or the given
 *     one when every row still has a holder.
 */
export function dropUnreachableDraftRows(grantHolders, draftGrantHolders, draftRoleGrants) {
    const remainingRows = new Map(
        [...draftRoleGrants].filter(
            ([holderKey]) => grantHolders.has(holderKey) || draftGrantHolders.has(holderKey),
        ),
    );
    // The map is rendered, so it is only replaced when rows were removed from it.
    return remainingRows.size === draftRoleGrants.size ? draftRoleGrants : remainingRows;
}

/**
 * Returns the roles that can still be assigned to a holder, excluding roles already
 * assigned and roles selected by other draft rows of the same holder.
 * @param {object} options - Current grant state and the row the roles are needed for.
 * @param {Map<string, RoleDefinition>} options.roles - Known role definitions keyed by their IRI.
 * @param {Map<string, GrantHolder>} options.grantHolders - Saved grant holders keyed by holder key.
 * @param {Map<string, DraftRoleGrant[]>} options.draftRoleGrants - Unsaved role rows keyed by holder key.
 * @param {Map<string, PendingGrantChange[]>} options.pendingGrantChanges - Unsaved changes keyed by holder key.
 * @param {string} options.holderKey - Key of an existing or draft grant holder.
 * @param {string|null} [options.currentDraftIdentifier] - Client identifier of the draft row being
 *     rendered, so its own selection is not filtered out.
 * @param {string|null} [options.currentGrantIdentifier] - Identifier of the grant being rendered, so its own selection is not filtered out.
 * @returns {RoleDefinition[]} Available role definitions, as a new array the caller may modify.
 */
export function getAvailableRoles({
    roles,
    grantHolders,
    draftRoleGrants,
    pendingGrantChanges,
    holderKey,
    currentDraftIdentifier = null,
    currentGrantIdentifier = null,
}) {
    const assignedRoleIds = new Set(
        (grantHolders.get(holderKey)?.grants ?? [])
            .filter((grant) => grant.identifier !== currentGrantIdentifier)
            // An unsaved change frees the assigned role and takes the selected one instead.
            .map(
                (grant) =>
                    getPendingGrantChange(pendingGrantChanges, holderKey, grant.identifier)
                        ?.roleIdentifier ?? grant.roleDefinition['@id'],
            ),
    );
    const selectedDraftRoleIds = new Set(
        holderEntries(draftRoleGrants, holderKey)
            .filter(
                (draft) =>
                    draft.clientIdentifier !== currentDraftIdentifier && draft.roleIdentifier,
            )
            .map((draft) => draft.roleIdentifier),
    );
    return [...roles.values()].filter(
        (role) => !assignedRoleIds.has(role['@id']) && !selectedDraftRoleIds.has(role['@id']),
    );
}
