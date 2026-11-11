/**
 * The shapes the grant management dialog works with, grouped as roles, grants, grant holders
 * and the unsaved state the user builds up before saving.
 */

// Roles

/**
 * @typedef {{
 *     '@id': string,
 *     identifier: string,
 *     roleNames?: Array<{languageTag: string, name: string}>
 * }} RoleDefinition
 */

// Grants

/**
 * A grant of a role, reduced to the fields the dialog displays.
 * @typedef {{
 *     identifier: string,
 *     shareable: boolean,
 *     grantedActions: string[],
 *     roleDefinition: RoleDefinition
 * }} RoleGrant
 */

/**
 * The role and shareable state a grant is created from.
 * @typedef {{
 *     roleIdentifier: string|null,
 *     shareable: boolean
 * }} RoleGrantSelection
 */

/**
 * A resource action grant as returned by the authorization API.
 * @typedef {Required<GrantHolderFields> & {
 *     '@id': string,
 *     '@type': string,
 *     identifier: string,
 *     role: string|null,
 *     shareable: boolean,
 *     shareOf: string|null,
 *     creatorId: string|null,
 *     dateCreated: string|null,
 *     resourceClass: string,
 *     resourceIdentifier: string,
 *     resourceType: number,
 *     action: string,
 *     grantedActions: string[]
 * }} ResourceActionGrant
 */

// Grant holders

/**
 * One of the SUBJECT_TYPE_* values of grant-holder.js.
 * @typedef {'person'|'user-group'|'dynamic-user-group'} GrantHolderType
 */

/**
 * The fields a grant addresses its holder with. Exactly one of them is set.
 * @typedef {{
 *     userIdentifier?: string|null,
 *     userGroup?: string|null,
 *     dynamicUserGroupIdentifier?: string|null
 * }} GrantHolderFields
 */

/**
 * @typedef {{
 *     type: GrantHolderType,
 *     identifier: string,
 *     iri: string|null,
 *     key: string
 * }} GrantHolderIdentity
 */

/**
 * The person, user group or dynamic user group a grant belongs to, reduced to the fields
 * needed to display and identify it.
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
 *     type: GrantHolderType,
 *     subject: GrantHolderSubject,
 *     grants: RoleGrant[]
 * }} GrantHolder
 */

// Unsaved state

/**
 * An unsaved role row of a grant holder. The role stays null until one is selected.
 * @typedef {RoleGrantSelection & {
 *     clientIdentifier: string
 * }} DraftRoleGrant
 */

/**
 * A grant holder that has no saved grants yet, so its holder fields are kept to create them.
 * @typedef {GrantHolder & {
 *     holderFields: GrantHolderFields
 * }} DraftGrantHolder
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

// API resources

/**
 * A form resource, reduced to the fields the dialog names it by.
 * @typedef {{
 *     '@id'?: string,
 *     identifier?: string,
 *     name: string,
 *     localizedNames?: Array<{languageTag: string, name: string}>
 * }} FormalizeForm
 */

/**
 * A form submission resource. Its "form" field is the IRI of the form it belongs to.
 * @typedef {{
 *     '@id': string,
 *     identifier: string,
 *     form: string
 * }} FormalizeFormSubmission
 */

export {};
