/**
 * @typedef {{
 *     '@id': string,
 *     identifier: string,
 *     roleNames?: Array<{languageTag: string, name: string}>
 * }} RoleDefinition
 */

/**
 * @typedef {{
 *     identifier: string,
 *     shareable: boolean,
 *     grantedActions: string[],
 *     roleDefinition: RoleDefinition
 * }} RoleGrant
 */

/**
 * @typedef {{
 *     identifier: string,
 *     '@id'?: string,
 *     '@type'?: string,
 *     givenName?: string,
 *     familyName?: string,
 *     name?: string,
 *     localData?: {email?: string|null}
 * }} GrantHolderSubject
 */

/**
 * @typedef {{
 *     key: string,
 *     subject: GrantHolderSubject,
 *     grants: RoleGrant[]
 * }} GrantHolder
 */

/**
 * The role and shareable state a grant is created from.
 * @typedef {{
 *     roleIdentifier: string|null,
 *     shareable: boolean
 * }} RoleGrantSelection
 */

/**
 * An unsaved role row of a grant holder. The role stays null until one is selected.
 * @typedef {RoleGrantSelection & {
 *     clientIdentifier: string
 * }} DraftRoleGrant
 */

/**
 * An unsaved change to a saved grant. It is applied by creating a grant with the new values
 * and deleting the grant it replaces.
 * @typedef {{
 *     grantIdentifier: string,
 *     roleIdentifier: string,
 *     shareable: boolean
 * }} PendingGrantChange
 */

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
 * }} GrantHolderIdentity
 */

/**
 * @typedef {GrantHolder & {
 *     holderFields: GrantHolderFields
 * }} DraftGrantHolder
 */

export {};
