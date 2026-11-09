import {css, html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';
import {classMap} from 'lit/directives/class-map.js';
import {repeat} from 'lit/directives/repeat.js';
import {
    AuthMixin,
    Button,
    Icon,
    IconButton,
    LangMixin,
    Modal,
    MiniSpinner,
    ScopedElementsMixin,
    sendNotification,
} from '@dbp-toolkit/common';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {hydra} from '@dbp-toolkit/resource-select';
import {createInstance} from './i18n.js';
import {getAuthorizationManageGrantsDialogCSS} from './styles.js';
import {Notification} from '@dbp-toolkit/notification';
import {AuthorizationSubjectSelect} from './authorization-subject-select.js';
import {
    SUBJECT_TYPE_DYNAMIC_USER_GROUP,
    SUBJECT_TYPE_PERSON,
    SUBJECT_TYPE_USER_GROUP,
    deriveGrantHolderIdentity,
    getGrantHolderFields,
} from './grant-holder.js';
import {updateInMap, deleteFromMap} from './utils.js';

const RESOURCE_TYPE_ITEM = 0;

/**
 * @typedef {{
 *     identifier: string,
 *     shareable: boolean,
 *     grantedActions: string[],
 *     roleDefinition: {
 *         '@id': string,
 *         identifier: string,
 *         roleNames?: Array<{languageTag: string, name: string}>
 *     }
 * }} RoleGrant
 */

/**
 * @typedef {{
 *     identifier: string,
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
 * @typedef {GrantHolder & {
 *     holderFields: import('./grant-holder.js').GrantHolderFields
 * }} DraftGrantHolder
 */

export class AuthorizationManageGrantsDialog extends AuthMixin(
    LangMixin(ScopedElementsMixin(DBPLitElement), createInstance),
) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.modalTitle = '';
        /** @type {import('lit/directives/ref.js').Ref<Modal>} */
        this.modalRef = createRef();
        /** @type {import('lit/directives/ref.js').Ref<AuthorizationSubjectSelect>} */
        this.subjectSelectorRef = createRef();
        this.selectedSubject = null;
        this.resourceClassIdentifier = '';
        this.resourceIdentifier = '';
        this.resourceType = RESOURCE_TYPE_ITEM;
        this.roles = new Map();
        /** @type {Map<string, GrantHolder>} */
        this.grantHolders = new Map();
        this.grantHoldersLoading = false;
        /** @type {Map<string, DraftGrantHolder>} */
        this.draftGrantHolders = new Map();
        /** @type {Map<string, DraftRoleGrant[]>} */
        this.draftRoleGrants = new Map();
        this._nextDraftRoleIdentifier = 0;
        /** @type {Map<string, PendingGrantChange[]>} */
        this.pendingGrantChanges = new Map();
        /** @type {AbortController|null} */
        this._resourceDataController = null;
        this.showRolesPanel = false;
        /** @type {Set<string>} */
        this._savingHolderKeys = new Set();
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            modalTitle: {type: String, attribute: 'modal-title'},
            selectedSubject: {state: true},
            resourceClassIdentifier: {type: String, attribute: 'resource-class-identifier'},
            resourceIdentifier: {type: String, attribute: 'resource-identifier'},
            resourceType: {type: Number, attribute: 'resource-type'},
            roles: {state: true},
            grantHolders: {state: true},
            grantHoldersLoading: {state: true},
            draftGrantHolders: {state: true},
            draftRoleGrants: {state: true},
            pendingGrantChanges: {state: true},
            showRolesPanel: {type: Boolean, state: true},
            _savingHolderKeys: {state: true},
        };
    }

    static get scopedElements() {
        return {
            'dbp-button': Button,
            'dbp-modal': Modal,
            'dbp-icon': Icon,
            'dbp-icon-button': IconButton,
            'dbp-mini-spinner': MiniSpinner,
            'dbp-authorization-subject-select': AuthorizationSubjectSelect,
            'dbp-notification': Notification,
        };
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        if (changedProperties.has('lang') && !this.hasAttribute('modal-title')) {
            this.modalTitle = this._i18n.t('auth-manage-dialog.modal-title');
        }

        if (
            (changedProperties.has('resourceClassIdentifier') ||
                changedProperties.has('resourceIdentifier') ||
                changedProperties.has('resourceType')) &&
            this.modalRef.value?.isOpen()
        ) {
            void this._loadResourceData();
        }
    }

    loginCallback() {
        if (this.modalRef.value?.isOpen()) {
            void this._loadResourceData();
        }
    }

    logoutCallback() {
        this._resetDialogState();
        this.close();
        this._resourceDataController = null;
        this.roles = new Map();
        this.grantHolders = new Map();
        this.pendingGrantChanges = new Map();
    }

    /**
     * Opens the grant management dialog.
     *
     * @returns {void}
     */
    open() {
        this.modalRef.value?.open();
        void this._loadResourceData();
    }

    /**
     * Closes the grant management dialog.
     *
     * @returns {void}
     */
    close() {
        const modal = this.modalRef.value;

        if (modal?.isOpen()) {
            modal.close();
        } else {
            this._resetDialogState();
        }
    }

    _handleModalClosed() {
        this._resetDialogState();
    }

    _resetDialogState() {
        this._resourceDataController?.abort();
        this._resourceDataController = null;
        this.grantHoldersLoading = false;
        this.draftGrantHolders = new Map();
        this.draftRoleGrants = new Map();
        this.pendingGrantChanges = new Map();
        this._nextDraftRoleIdentifier = 0;
        this.showRolesPanel = false;
        this.selectedSubject = null;
        void this._('#resource-select')?.reset();
    }

    /**
     * Loads the roles for the current resource.
     *
     * @param {AbortSignal} [signal] - Cancels requests when the resource changes.
     * @returns {Promise<boolean>} Whether the role definitions were loaded successfully.
     */
    async _loadRoles(signal) {
        if (!this.resourceClassIdentifier || !this.resourceIdentifier) {
            return false;
        }

        try {
            this.roles = new Map();
            // The roles keep all their translations, so a language change only needs a
            // re-render instead of a new request
            const roles = await hydra.getCollection(
                this._getRolesUrl(
                    this.resourceClassIdentifier,
                    this.resourceIdentifier,
                    this.resourceType,
                ),
                this.lang,
                () => this.auth?.token ?? '',
                {signal},
            );
            if (!signal?.aborted) {
                this.roles = new Map(roles.map((role) => [role['@id'], role]));
                return true;
            }
        } catch (error) {
            if (signal?.aborted) {
                return false;
            }
            console.error('Could not load roles', error);
            this._notifyError('auth-manage-dialog.notifications.could-not-get-roles');
        }
        return false;
    }

    /**
     * Loads role definitions and assigned role grants for the current resource.
     * @returns {Promise<void>}
     */
    async _loadResourceData() {
        this._resourceDataController?.abort();
        const controller = new AbortController();
        this._resourceDataController = controller;

        this.grantHolders = new Map();
        this.draftGrantHolders = new Map();
        this.draftRoleGrants = new Map();
        this.pendingGrantChanges = new Map();
        this._nextDraftRoleIdentifier = 0;

        if (!this.resourceClassIdentifier || !this.resourceIdentifier || !this.isLoggedIn()) {
            this.grantHoldersLoading = false;
            return;
        }
        this.grantHoldersLoading = true;

        const rolesLoaded = await this._loadRoles(controller.signal);
        if (controller.signal.aborted) {
            return;
        }
        if (!rolesLoaded) {
            this.grantHoldersLoading = false;
            return;
        }
        await this._loadRoleGrantHolders(controller.signal);
    }

    /**
     * Fetches an API item, preserving its translations.
     * @param {string} path - API item IRI.
     * @param {AbortSignal} [signal] - Request cancellation signal.
     * @returns {Promise<object>} API resource.
     */
    async _fetchGrantResource(path, signal) {
        const response = await fetch(new URL(path, this.entryPointUrl), {
            signal,
            headers: {
                Accept: 'application/ld+json',
                'Accept-Language': this.lang,
                Authorization: 'Bearer ' + (this.auth?.token ?? ''),
            },
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    }

    /**
     * Save subject roles to the API.
     * @param {{resourceClassIdentifier: string, resourceIdentifier: string, resourceType: number}} resource
     * @param {RoleGrantSelection} grantSelection
     * @param {import('./grant-holder.js').GrantHolderFields} grantHolderIdentifier
     * @returns {Promise<Response>} response
     */
    async _apiPostRoles(resource, grantSelection, grantHolderIdentifier) {
        const {resourceClassIdentifier, resourceIdentifier, resourceType} = resource;
        const roleIdentifier = grantSelection.roleIdentifier;
        const shareable = grantSelection.shareable ?? false;

        const payload = {
            resourceClass: resourceClassIdentifier,
            resourceIdentifier: resourceIdentifier,
            resourceType: resourceType,
            role: roleIdentifier,
            shareable: shareable,
            ...grantHolderIdentifier,
        };

        const apiUrl = new URL('/authorization/resource-action-grants', this.entryPointUrl);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept-Language': this.lang,
                Authorization: 'Bearer ' + (this.auth?.token ?? ''),
            },
            body: JSON.stringify(payload),
        };
        return await fetch(apiUrl, options);
    }

    async _apiDeleteGrant(roleIdentifier) {
        const apiUrl = new URL(
            `/authorization/resource-action-grants/${roleIdentifier}`,
            this.entryPointUrl,
        );
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept-Language': this.lang,
                Authorization: 'Bearer ' + (this.auth?.token ?? ''),
            },
        };
        return await fetch(apiUrl, options);
    }

    /**
     * Loads assigned roles grouped by person, user group or dynamic user group.
     * Direct action grants are excluded; individual grant IDs are preserved.
     * @param {AbortSignal} [signal] - Cancels requests when the resource changes.
     * @returns {Promise<void>}
     */
    async _loadRoleGrantHolders(signal) {
        if (!this.resourceClassIdentifier || !this.resourceIdentifier || !this.isLoggedIn()) {
            return;
        }

        try {
            const url = new URL('/authorization/resource-action-grants', this.entryPointUrl);
            url.searchParams.set('resourceClass', this.resourceClassIdentifier);
            url.searchParams.set('resourceIdentifier', this.resourceIdentifier);
            url.searchParams.set('resourceType', String(this.resourceType));
            const grants = await hydra.getCollection(
                url.href,
                this.lang,
                () => this.auth?.token ?? '',
                {signal},
            );
            const roleDefinitions = new Map(
                [...this.roles].map(([iri, role]) => [
                    iri,
                    {
                        '@id': role['@id'],
                        identifier: role.identifier,
                        roleNames: (role.roleNames ?? []).map(({languageTag, name}) => ({
                            languageTag,
                            name,
                        })),
                    },
                ]),
            );
            const holders = new Map();
            for (const grant of grants) {
                if (!grant['role']) {
                    continue;
                }
                const holderIdentity = deriveGrantHolderIdentity(grant);
                if (holderIdentity === null) {
                    continue;
                }
                if (!holders.has(holderIdentity.key)) {
                    holders.set(holderIdentity.key, {
                        ...holderIdentity,
                        subject: null,
                        grants: [],
                    });
                }
                holders.get(holderIdentity.key).grants.push(grant);
            }
            // Dynamic groups have no item endpoint, so fetch their collection only once.
            const dynamicGroups = [...holders.values()].some(
                (holder) => holder.type === SUBJECT_TYPE_DYNAMIC_USER_GROUP,
            )
                ? await hydra.getCollection(
                      new URL('/authorization/dynamic-user-groups', this.entryPointUrl).href,
                      this.lang,
                      () => this.auth?.token ?? '',
                      {signal},
                  )
                : [];
            const holderList = [...holders.values()];
            const subjectResults = await Promise.allSettled(
                holderList.map(async (holder) => {
                    return holder.type === SUBJECT_TYPE_DYNAMIC_USER_GROUP
                        ? dynamicGroups.find((group) => group['identifier'] === holder.identifier)
                        : await this._fetchGrantResource(
                              holder.type === SUBJECT_TYPE_PERSON
                                  ? `/base/people/${encodeURIComponent(holder.identifier)}?includeLocal=email`
                                  : holder.iri,
                              signal,
                          );
                }),
            );
            if (!signal?.aborted) {
                const resolvedHolders = holderList.map((holder, index) => {
                    const result = subjectResults[index];
                    // A missing or inaccessible subject must not hide the other grant holders.
                    const subject = result.status === 'fulfilled' ? result.value : undefined;
                    return {
                        key: holder.key,
                        subject: subject
                            ? this._getCompactGrantSubject(subject, holder.type)
                            : {identifier: holder.identifier},
                        grants: holder.grants.map((grant) => ({
                            identifier: grant.identifier,
                            shareable: grant.shareable,
                            grantedActions: grant.grantedActions ?? [],
                            roleDefinition: roleDefinitions.get(grant['role']) ?? {
                                '@id': grant['role'],
                                identifier: grant['role'].split('/').pop(),
                                roleNames: [],
                            },
                        })),
                    };
                });
                this.grantHolders = this.sortGrantHolders(
                    new Map(resolvedHolders.map((holder) => [holder.key, holder])),
                );
                this._prunePendingGrantChanges();
            }
        } catch (error) {
            if (!signal?.aborted) {
                console.error('Could not load role grant holders', error);
                this._notifyError('auth-manage-dialog.notifications.could-not-get-role-grants');
            }
        } finally {
            if (!signal?.aborted) {
                this.grantHoldersLoading = false;
            }
        }
    }

    /**
     * Returns the holder's display name, falling back to its identifier.
     * @param {GrantHolderSubject} subject - Compact person or group subject.
     * @returns {string} Display name used for ordering holders.
     */
    _getGrantHolderDisplayName(subject) {
        return (
            [subject['givenName'], subject['familyName']].filter(Boolean).join(' ').trim() ||
            subject['name'] ||
            subject['identifier']
        );
    }

    /**
     * Sorts grant holders by type—people, user groups, then dynamic groups—and by display name
     * within each type.
     * @param {Map<string, GrantHolder>} grantHolders - Grant holders keyed by their holder key.
     * @returns {Map<string, GrantHolder>} A new map in display order.
     */
    sortGrantHolders(grantHolders) {
        const typeOrder = [
            SUBJECT_TYPE_PERSON,
            SUBJECT_TYPE_USER_GROUP,
            SUBJECT_TYPE_DYNAMIC_USER_GROUP,
        ];
        const collator = new Intl.Collator(this.lang, {sensitivity: 'base', numeric: true});
        const sortedEntries = [...grantHolders.entries()].sort(([, left], [, right]) => {
            const typeDifference =
                typeOrder.indexOf(left.key.split(':')[0]) -
                typeOrder.indexOf(right.key.split(':')[0]);
            return (
                typeDifference ||
                collator.compare(
                    this._getGrantHolderDisplayName(left.subject),
                    this._getGrantHolderDisplayName(right.subject),
                ) ||
                (left.key < right.key ? -1 : left.key > right.key ? 1 : 0)
            );
        });
        return new Map(sortedEntries);
    }

    /**
     * Keeps only the subject fields needed to display and identify a grant holder.
     * @param {object} subject - Person or group API resource.
     * @param {string} type - Grant holder type.
     * @returns {GrantHolderSubject} Compact subject with optional person email.
     */
    _getCompactGrantSubject(subject, type) {
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

    /**
     * Builds the collection URL of the roles of a compound authorization resource identifier.
     *
     * @param {string} resourceClassIdentifier - Authorization resource class.
     * @param {string} resourceIdentifier - Identifier of the authorization resource.
     * @param {number} resourceType - Resource type: 0 for an item or 1 for a group.
     * @returns {string} Absolute collection URL.
     */
    _getRolesUrl(resourceClassIdentifier, resourceIdentifier, resourceType) {
        const url = new URL('/authorization/roles', this.entryPointUrl);
        url.searchParams.set('resourceClass', resourceClassIdentifier);
        url.searchParams.set('resourceIdentifier', resourceIdentifier);
        url.searchParams.set('resourceType', String(resourceType));
        return url.href;
    }

    /**
     * Returns the name a role has in the current language.
     *
     * @param {{identifier: string, roleNames?: Array<{languageTag: string, name: string}>}} role - Role definition with its localized names.
     * @returns {string} Name of the role in the current language.
     */
    _getRoleName(role) {
        return (
            role.roleNames?.find((name) => name.languageTag === this.lang)?.name ?? role.identifier
        );
    }

    /**
     * Renders the side panel that displays the roles for the current resource.
     * @returns {import('lit').TemplateResult}
     */
    renderRolesSidePanel() {
        const i18n = this._i18n;
        return html`
            <div class="roles-container">
                <h3 class="roles-panel-title">${i18n.t('auth-manage-dialog.roles-panel.title')}</h3>
                ${
                    this.roles.size
                        ? html`
                              <div class="role-list">
                                  ${[...this.roles.values()].map((role) => {
                                      return html`
                                          <h4 class="roles-name">${this._getRoleName(role)}</h4>
                                      `;
                                  })}
                              </div>
                          `
                        : html`
                              <p class="roles-empty-state">
                                  ${i18n.t('auth-manage-dialog.roles-panel.empty-state-label')}
                              </p>
                          `
                }
            </div>
        `;
    }

    /**
     * Renders the assigned role holders, loading indicator or empty state.
     * @returns {import('lit').TemplateResult} Holder list content.
     */
    renderGrantHolders() {
        if (this.grantHoldersLoading) {
            return html`
                <dbp-mini-spinner></dbp-mini-spinner>
            `;
        }
        if (!this.grantHolders.size && !this.draftGrantHolders.size) {
            return html`
                <div class="grants-list-placeholder">
                    <dbp-icon name="information-circle" aria-hidden="true"></dbp-icon>
                    <p>${this._i18n.t('auth-manage-dialog.grants-list-placeholder')}</p>
                </div>
            `;
        }
        return html`
            <div class="grant-holders-list">
                ${repeat(
                    this.draftGrantHolders.values(),
                    (holder) => holder.key,
                    (holder) => this.renderGrantHolderSection(holder),
                )}
                ${repeat(
                    this.grantHolders.values(),
                    (holder) => holder.key,
                    (holder) => this.renderGrantHolderSection(holder),
                )}
            </div>
        `;
    }

    /**
     * Renders a holder's name, person email and assigned role rows.
     * @param {GrantHolder} holder - Holder with its compact subject and role grants.
     * @returns {import('lit').TemplateResult} Holder section.
     */
    renderGrantHolderSection(holder) {
        const name = this._getGrantHolderDisplayName(holder['subject']);
        const draftGrants = this.draftRoleGrants.get(holder.key) ?? [];
        const collator = new Intl.Collator(this.lang, {sensitivity: 'base', numeric: true});
        const grants = [...holder['grants']].sort((left, right) => {
            return (
                collator.compare(
                    this._getRoleName(left.roleDefinition),
                    this._getRoleName(right.roleDefinition),
                ) ||
                (left.identifier < right.identifier
                    ? -1
                    : left.identifier > right.identifier
                      ? 1
                      : 0)
            );
        });
        const email = holder['key'].startsWith(`${SUBJECT_TYPE_PERSON}:`)
            ? holder['subject'].localData?.email
            : null;
        const holderIconName = holder['key'].startsWith(`${SUBJECT_TYPE_PERSON}:`)
            ? 'user'
            : 'users';
        return html`
            <section
                id="${holder.key}"
                class="grant-holder-section"
                aria-label="${this._i18n.t('auth-manage-dialog.grant-holder-aria-label', {name: name})}">
                <div class="grant-holder-heading">
                    <div class="grant-holder">
                        <div>
                            <dbp-icon
                                name="${holderIconName}"
                                class="holder-type-icon"
                                aria-hidden="true"></dbp-icon>
                            <h3 class="grant-holder-name">${name}:</h3>
                        </div>
                        ${
                            email
                                ? html`
                                      <span class="grant-holder-email">${email}</span>
                                  `
                                : ''
                        }
                    </div>
                    <div class="grant-shareable-column-label">
                        ${this._i18n.t('auth-manage-dialog.shareable-column-label')}
                    </div>
                </div>
                <ul class="grant-holder-roles">
                    ${repeat(
                        grants,
                        (grant) => grant.identifier,
                        (grant) => this.renderRoleRow(grant, holder),
                    )}
                    ${repeat(
                        draftGrants,
                        (grant) => grant.clientIdentifier,
                        (grant) => this.renderDraftRoleRow(grant, holder.key, name),
                    )}
                </ul>
                <div class="add-role-button-container">
                    <dbp-button
                        type="is-secondary"
                        class="add-role-button"
                        no-spinner-on-click
                        ?disabled="${draftGrants.some((draft) => !draft.roleIdentifier) || !this.getAvailableRolesForHolder(holder.key).length}"
                        title="${
                            draftGrants.some((draft) => !draft.roleIdentifier)
                                ? this._i18n.t(
                                      'auth-manage-dialog.buttons.add-role-select-role-title',
                                  )
                                : !this.getAvailableRolesForHolder(holder.key).length
                                  ? this._i18n.t(
                                        'auth-manage-dialog.buttons.add-role-no-more-roles-title',
                                    )
                                  : ''
                        }"
                        @click="${() => this.handleAddRoleButtonClick(holder.key)}">
                        <dbp-icon name="plus" aria-hidden="true"></dbp-icon>
                        ${this._i18n.t('auth-manage-dialog.buttons.add-role')}
                    </dbp-button>
                    <dbp-button
                        type="is-primary"
                        class="save-holder-roles-button"
                        no-spinner-on-click
                        ?disabled="${this.isSaveDisabled(holder.key)}"
                        title="${
                            draftGrants.some((draft) => !draft.roleIdentifier)
                                ? this._i18n.t(
                                      'auth-manage-dialog.buttons.save-holder-roles-button-select-role-title',
                                  )
                                : this.isSaveDisabled(holder.key)
                                  ? this._i18n.t(
                                        'auth-manage-dialog.buttons.save-holder-roles-button-disabled-title',
                                    )
                                  : ''
                        }"
                        @click="${async () => await this.handleSaveHolderRolesButtonClick(holder.key)}">
                        <dbp-icon name="save" aria-hidden="true"></dbp-icon>
                        ${this._i18n.t('auth-manage-dialog.buttons.save-holder-roles-button-label')}
                    </dbp-button>
                </div>
            </section>
        `;
    }

    /**
     * Adds an empty draft role row to a grant holder.
     * @param {string} holderKey - Key of an existing or draft grant holder.
     * @returns {void}
     */
    handleAddRoleButtonClick(holderKey) {
        const holderDraftRoles = this.draftRoleGrants.get(holderKey) ?? [];
        const hasIncompleteDraft = holderDraftRoles.some((draft) => !draft.roleIdentifier);

        if (hasIncompleteDraft || !this.getAvailableRolesForHolder(holderKey).length) {
            return;
        }

        this._nextDraftRoleIdentifier += 1;
        const draftRole = {
            clientIdentifier: `draft-role-${this._nextDraftRoleIdentifier}`,
            roleIdentifier: null,
            shareable: false,
        };
        this.draftRoleGrants = updateInMap(this.draftRoleGrants, holderKey, [
            ...holderDraftRoles,
            draftRole,
        ]);
    }

    /**
     * Returns the roles that can still be assigned to a holder, excluding roles already
     * assigned and roles selected by other draft rows of the same holder.
     * @param {string} holderKey - Key of an existing or draft grant holder.
     * @param {string|null} [currentDraftIdentifier] - Client identifier of the draft row being
     *     rendered, so its own selection is not filtered out.
     * @param {string|null} [currentGrantIdentifier] - Identifier of the grant being rendered, so its own selection is not filtered out.
     * @returns {Array<{identifier: string, roleNames?: Array<{languageTag: string, name: string}>}>} Available role definitions.
     */
    getAvailableRolesForHolder(
        holderKey,
        currentDraftIdentifier = null,
        currentGrantIdentifier = null,
    ) {
        const assignedRoleIds = new Set(
            (this.grantHolders.get(holderKey)?.grants ?? [])
                .filter((grant) => grant.identifier !== currentGrantIdentifier)
                // An unsaved change frees the assigned role and takes the selected one instead.
                .map(
                    (grant) =>
                        this.getPendingGrantChange(holderKey, grant.identifier)?.roleIdentifier ??
                        grant.roleDefinition['@id'],
                ),
        );
        const selectedDraftRoleIds = new Set(
            (this.draftRoleGrants.get(holderKey) ?? [])
                .filter(
                    (draft) =>
                        draft.clientIdentifier !== currentDraftIdentifier && draft.roleIdentifier,
                )
                .map((draft) => draft.roleIdentifier),
        );
        return [...this.roles.values()].filter(
            (role) => !assignedRoleIds.has(role['@id']) && !selectedDraftRoleIds.has(role['@id']),
        );
    }

    /**
     * Returns the unsaved change of a saved grant, if there is one.
     * @param {string} holderKey - Key of the grant's holder.
     * @param {string} grantIdentifier - Identifier of the saved grant.
     * @returns {PendingGrantChange|null} The pending change, or null when the grant is unchanged.
     */
    getPendingGrantChange(holderKey, grantIdentifier) {
        return (
            (this.pendingGrantChanges.get(holderKey) ?? []).find(
                (change) => change.grantIdentifier === grantIdentifier,
            ) ?? null
        );
    }

    /**
     * Removes the unsaved changes that no longer belong to a saved grant, so a reload cannot
     * leave changes behind that can never be applied.
     * @returns {void}
     */
    _prunePendingGrantChanges() {
        /** @type {Map<string, PendingGrantChange[]>} */
        const prunedChanges = new Map();
        for (const [holderKey, changes] of this.pendingGrantChanges) {
            const grants = this.grantHolders.get(holderKey)?.grants ?? [];
            const remainingChanges = changes.filter((change) =>
                grants.some((grant) => grant.identifier === change.grantIdentifier),
            );
            if (remainingChanges.length) {
                prunedChanges.set(holderKey, remainingChanges);
            }
        }
        this.pendingGrantChanges = prunedChanges;
    }

    /**
     * Updates one draft role and assigns a new map so Lit rerenders it.
     * @param {string} holderKey - Key of the draft role's holder.
     * @param {string} clientIdentifier - Client-side draft role identifier.
     * @param {Partial<DraftRoleGrant>} changes - Draft role properties to update.
     * @returns {void}
     */
    updateDraftRole(holderKey, clientIdentifier, changes) {
        const holderDraftRoles = this.draftRoleGrants.get(holderKey) ?? [];
        this.draftRoleGrants = updateInMap(
            this.draftRoleGrants,
            holderKey,
            holderDraftRoles.map((grant) =>
                grant.clientIdentifier === clientIdentifier ? {...grant, ...changes} : grant,
            ),
        );
    }

    /**
     * Removes one unsaved role row.
     * @param {string} holderKey - Key of the draft role's holder.
     * @param {string} clientIdentifier - Client-side draft role identifier.
     * @returns {void}
     */
    handleDeleteDraftRoleButtonClick(holderKey, clientIdentifier) {
        const remainingRoles = (this.draftRoleGrants.get(holderKey) ?? []).filter(
            (grant) => grant.clientIdentifier !== clientIdentifier,
        );
        this.draftRoleGrants = remainingRoles.length
            ? updateInMap(this.draftRoleGrants, holderKey, remainingRoles)
            : deleteFromMap(this.draftRoleGrants, holderKey);

        // If no more roles remain on a draft holder, remove the draft holder as well.
        if (!remainingRoles.length && this.draftGrantHolders.has(holderKey)) {
            this.draftGrantHolders = deleteFromMap(this.draftGrantHolders, holderKey);
        }
    }

    /**
     * Renders the roles a saved grant can be changed to, with its current role selected.
     * @param {RoleGrant} grant - Compact role grant.
     * @param {GrantHolder} holder - Holder of the grant.
     * @param {PendingGrantChange|null} pendingChange - Unsaved change of the grant, if any.
     * @returns {import('lit').TemplateResult} Role selector.
     */
    renderRoleSelect(grant, holder, pendingChange) {
        const currentRole = grant['roleDefinition'];
        const holderName = this._getGrantHolderDisplayName(holder.subject);
        // A role assigned to another row of the same holder cannot be selected again.
        const roles = this.getAvailableRolesForHolder(holder.key, null, grant.identifier);
        // Keep the currently assigned role visible even if it is no longer available.
        if (!roles.some((role) => role['@id'] === currentRole['@id'])) {
            roles.push(currentRole);
        }
        const collator = new Intl.Collator(this.lang, {sensitivity: 'base', numeric: true});
        roles.sort((left, right) =>
            collator.compare(this._getRoleName(left), this._getRoleName(right)),
        );
        // Changing the role deletes the grant and creates a new one, so it needs the same
        // permission as deleting it.
        const isChangeable = (grant['grantedActions'] ?? []).includes('delete');
        const selectedRoleIdentifier = pendingChange?.roleIdentifier ?? currentRole['@id'];
        return html`
            <select
                class="role-grant-name-selector"
                id="${grant.identifier}-role-select"
                ?disabled="${!isChangeable}"
                title="${
                    !isChangeable
                        ? this._i18n.t('auth-manage-dialog.role-select-disabled-title')
                        : pendingChange
                          ? this._i18n.t('auth-manage-dialog.role-change-pending-title')
                          : ''
                }"
                @change="${(event) => {
                    this.handleRoleSelectChange(
                        holder.key,
                        grant,
                        /** @type {HTMLSelectElement} */ (event.target).value,
                    );
                }}"
                aria-label="${this._i18n.t('auth-manage-dialog.role-select-label', {holder: holderName})}">
                ${repeat(
                    roles,
                    (role) => role['@id'],
                    (role) => html`
                        <option
                            value="${role['@id']}"
                            ?selected="${role['@id'] === selectedRoleIdentifier}">
                            ${this._getRoleName(role)}
                        </option>
                    `,
                )}
            </select>
        `;
    }

    /**
     * Renders one assigned role with its shareable state and deletion control.
     * @param {RoleGrant} grant - Compact role grant.
     * @param {GrantHolder} holder - The holder of the role.
     * @returns {import('lit').TemplateResult} Assigned role row.
     */
    renderRoleRow(grant, holder) {
        const roleName = this._getRoleName(grant['roleDefinition']);
        const holderName = this._getGrantHolderDisplayName(holder.subject);
        const deleteLabel = this._i18n.t('auth-manage-dialog.buttons.delete-role', {
            role: roleName,
            holder: holderName,
        });
        const pendingChange = this.getPendingGrantChange(holder.key, grant.identifier);
        // Changing the shareable state replaces the grant, so it needs the delete permission.
        const isChangeable = (grant['grantedActions'] ?? []).includes('delete');
        return html`
            <li class="role-grant-row ${classMap({'unsaved-role-row': pendingChange !== null})}">
                ${this.renderRoleSelect(grant, holder, pendingChange)}
                <label class="role-grant-shareable">
                    <input
                        type="checkbox"
                        ?disabled="${!isChangeable}"
                        .checked="${pendingChange?.shareable ?? Boolean(grant['shareable'])}"
                        aria-label="${this._i18n.t('auth-manage-dialog.shareable-role-label', {
                            role: roleName,
                            holder: holderName,
                        })}"
                        @change="${(event) => {
                            this.handleGrantShareableChange(
                                holder.key,
                                grant,
                                /** @type {HTMLInputElement} */ (event.target).checked,
                            );
                        }}" />
                </label>
                <dbp-icon-button
                    icon-name="trash"
                    class="delete-role-button"
                    ?disabled="${!isChangeable}"
                    @click="${async () => await this.handleDeleteRoleButtonClick(grant.identifier, roleName, holderName)}"
                    aria-label="${deleteLabel}"
                    title="${deleteLabel}"></dbp-icon-button>
            </li>
        `;
    }

    /**
     * Renders an unsaved role row with no role selected initially.
     * @param {DraftRoleGrant} grant - Draft role state.
     * @param {string} holderKey - Key of the role's holder.
     * @param {string} holderName - Holder label for accessible control names.
     * @returns {import('lit').TemplateResult} Draft role row.
     */
    renderDraftRoleRow(grant, holderKey, holderName) {
        const availableRoles = this.getAvailableRolesForHolder(holderKey, grant.clientIdentifier);
        const collator = new Intl.Collator(this.lang, {sensitivity: 'base', numeric: true});
        availableRoles.sort((left, right) =>
            collator.compare(this._getRoleName(left), this._getRoleName(right)),
        );
        const deleteLabel = this._i18n.t('auth-manage-dialog.buttons.delete-draft-role', {
            holder: holderName,
        });
        return html`
            <li class="role-grant-row draft-role-grant-row unsaved-role-row">
                <select
                    class="role-grant-name-selector"
                    id="${grant.clientIdentifier}-role-select"
                    aria-label="${this._i18n.t('auth-manage-dialog.role-select-label', {
                        holder: holderName,
                    })}"
                    .value="${grant.roleIdentifier ?? ''}"
                    @change="${(event) => {
                        const roleIdentifier = /** @type {HTMLSelectElement} */ (event.target)
                            .value;
                        this.updateDraftRole(holderKey, grant.clientIdentifier, {
                            roleIdentifier: roleIdentifier || null,
                        });
                    }}">
                    <option value="">
                        ${this._i18n.t('auth-manage-dialog.role-select-placeholder')}
                    </option>
                    ${repeat(
                        availableRoles,
                        (role) => role['@id'],
                        (role) => html`
                            <option value="${role['@id']}">${this._getRoleName(role)}</option>
                        `,
                    )}
                </select>
                <label class="role-grant-shareable">
                    <input
                        type="checkbox"
                        .checked="${grant.shareable}"
                        aria-label="${this._i18n.t(
                            'auth-manage-dialog.draft-shareable-role-label',
                            {holder: holderName},
                        )}"
                        @change="${(event) => {
                            this.updateDraftRole(holderKey, grant.clientIdentifier, {
                                shareable: /** @type {HTMLInputElement} */ (event.target).checked,
                            });
                        }}" />
                </label>
                <dbp-icon-button
                    icon-name="trash"
                    aria-label="${deleteLabel}"
                    title="${deleteLabel}"
                    @click="${() =>
                        this.handleDeleteDraftRoleButtonClick(
                            holderKey,
                            grant.clientIdentifier,
                        )}"></dbp-icon-button>
            </li>
        `;
    }

    /**
     * Adds the selected subject as a new grant holder.
     * @returns {Promise<void>}
     */
    async handleAddPersonButtonClick() {
        const subjectSelector = this.subjectSelectorRef.value;
        const selectedSubject = this.selectedSubject;

        if (!subjectSelector || !selectedSubject) {
            console.warn('No subject selector or selected subject available.');
            return;
        }

        const holderFields = subjectSelector.getGrantHolder(selectedSubject);
        const selectedHolderIdentity = deriveGrantHolderIdentity(holderFields);
        if (
            !holderFields ||
            !selectedHolderIdentity ||
            ![
                SUBJECT_TYPE_DYNAMIC_USER_GROUP,
                SUBJECT_TYPE_PERSON,
                SUBJECT_TYPE_USER_GROUP,
            ].includes(selectedHolderIdentity.type)
        ) {
            this._notifyError('auth-manage-dialog.notifications.unsupported-subject-type');
            return;
        }

        // Subject already exists in the grant holders list.
        if (
            this.grantHolders.has(selectedHolderIdentity.key) ||
            this.draftGrantHolders.has(selectedHolderIdentity.key)
        ) {
            // Scroll to the existing holder and highlight it.
            console.log(selectedHolderIdentity.key, 'already exists in grantHolders');
            const existingHolderElement = this._(`#${CSS.escape(selectedHolderIdentity.key)}`);
            if (existingHolderElement) {
                void this.scrollToAndHighlightExistingHolder(existingHolderElement);
            }
        } else {
            // Add the new subject to the draft grant holders list.

            // Get the email address of the person
            if (selectedHolderIdentity.type === SUBJECT_TYPE_PERSON) {
                try {
                    const personData = /** @type {{localData?: {email?: string}}} */ (
                        await this._fetchGrantResource(
                            `/base/people/${selectedSubject.identifier}?includeLocal=email`,
                        )
                    );
                    selectedSubject.localData = {email: personData.localData?.email ?? null};
                } catch (error) {
                    console.warn('Could not fetch person data', error);
                }
            }

            const draftHolder = {
                key: selectedHolderIdentity.key,
                subject: this._getCompactGrantSubject(selectedSubject, selectedHolderIdentity.type),
                holderFields,
                grants: [],
            };
            this.draftGrantHolders = updateInMap(
                this.draftGrantHolders,
                selectedHolderIdentity.key,
                draftHolder,
            );
            this.handleAddRoleButtonClick(selectedHolderIdentity.key);
        }

        // Reset the resource selector after adding a subject.
        void subjectSelector.reset();
    }

    /**
     * Scrolls to an existing grant holder and highlights it after scrolling finishes.
     * @param {HTMLElement} holderElement - Existing grant holder section.
     * @returns {Promise<void>}
     */
    async scrollToAndHighlightExistingHolder(holderElement) {
        const scrollContainer = this._('.grants-list-container');
        if (!scrollContainer) {
            return;
        }

        const containerRect = scrollContainer.getBoundingClientRect();
        const holderRect = holderElement.getBoundingClientRect();
        const centerOffset =
            holderRect.top + holderRect.height / 2 - (containerRect.top + containerRect.height / 2);
        const maximumScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const targetScrollTop = Math.max(
            0,
            Math.min(scrollContainer.scrollTop + centerOffset, maximumScrollTop),
        );
        const needsScrolling = Math.abs(targetScrollTop - scrollContainer.scrollTop) > 1;

        if (needsScrolling) {
            let resolveScrollEnd = () => {};
            const scrollEnd = new Promise((resolve) => {
                resolveScrollEnd = () => resolve(undefined);
            });
            const handleScrollEnd = () => resolveScrollEnd();
            scrollContainer.addEventListener('scrollend', handleScrollEnd, {once: true});

            const scrollResult = /** @type {Promise<{interrupted: boolean}>|undefined} */ (
                /** @type {unknown} */ (
                    holderElement.scrollIntoView({behavior: 'smooth', block: 'start'})
                )
            );

            // Firefox does not support the scrollIntoView promise yet, so use scrollend there.
            if (scrollResult instanceof Promise) {
                scrollContainer.removeEventListener('scrollend', handleScrollEnd);
                const {interrupted} = await scrollResult;
                if (interrupted) {
                    return;
                }
            } else {
                await scrollEnd;
            }
        }

        if (!holderElement.isConnected) {
            return;
        }

        holderElement.classList.remove('highlighted');
        requestAnimationFrame(() => {
            if (!holderElement.isConnected) {
                return;
            }
            holderElement.addEventListener(
                'animationend',
                () => holderElement.classList.remove('highlighted'),
                {once: true},
            );
            holderElement.classList.add('highlighted');
        });
    }

    /**
     * Saves the all pending roles and draft roles for all holders.
     * @returns {void}
     */
    saveAllRoles() {
        // @TODO: Implement if needed.
    }

    /**
     * Determines if the save button for a specific holder should be disabled.
     * @param {string} holderKey - The key of the holder.
     * @returns {boolean} Returns true if the save button for the holder should be disabled, false otherwise.
     */
    isSaveDisabled(holderKey) {
        // Disable the save button if the holder is currently being saved
        if (this._savingHolderKeys.has(holderKey)) return true;

        const draftGrants = this.draftRoleGrants.get(holderKey) ?? [];
        const pendingChanges = this.pendingGrantChanges.get(holderKey) ?? [];
        // An incomplete draft row always blocks saving.
        if (draftGrants.some((draft) => !draft.roleIdentifier)) return true;

        // Enable if no pending changes and no draft grants exist for the holder.
        return draftGrants.length === 0 && pendingChanges.length === 0;
    }

    /**
     * Handles the change event of the role selector of a saved grant.
     * @param {string} holderKey - Key of the holder the grant belongs to.
     * @param {RoleGrant} grant - Saved grant whose role selector changed.
     * @param {string} roleIdentifier - IRI of the newly selected role.
     * @returns {void}
     */
    handleRoleSelectChange(holderKey, grant, roleIdentifier) {
        this.updatePendingGrantChange(holderKey, grant, {roleIdentifier: roleIdentifier});
    }

    /**
     * Handles the change event of the shareable checkbox of a saved grant.
     * @param {string} holderKey - Key of the holder the grant belongs to.
     * @param {RoleGrant} grant - Saved grant whose shareable state changed.
     * @param {boolean} shareable - Whether the role should be reshareable.
     * @returns {void}
     */
    handleGrantShareableChange(holderKey, grant, shareable) {
        this.updatePendingGrantChange(holderKey, grant, {shareable: shareable});
    }

    /**
     * Records an unsaved change of a saved grant and assigns a new map so Lit rerenders it.
     * The change is dropped again as soon as it matches the saved grant, so reverting a
     * selection also disables the save button again.
     * @param {string} holderKey - Key of the holder the grant belongs to.
     * @param {RoleGrant} grant - Saved grant that was changed.
     * @param {{roleIdentifier?: string, shareable?: boolean}} changes - Changed values.
     * @returns {void}
     */
    updatePendingGrantChange(holderKey, grant, changes) {
        const currentChange = this.getPendingGrantChange(holderKey, grant.identifier);
        const nextChange = {
            grantIdentifier: grant.identifier,
            roleIdentifier: currentChange?.roleIdentifier ?? grant.roleDefinition['@id'],
            shareable: currentChange?.shareable ?? Boolean(grant.shareable),
            ...changes,
        };
        const otherChanges = (this.pendingGrantChanges.get(holderKey) ?? []).filter(
            (change) => change.grantIdentifier !== grant.identifier,
        );
        const isUnchanged =
            nextChange.roleIdentifier === grant.roleDefinition['@id'] &&
            nextChange.shareable === Boolean(grant.shareable);
        const holderChanges = isUnchanged ? otherChanges : [...otherChanges, nextChange];

        this.pendingGrantChanges = holderChanges.length
            ? updateInMap(this.pendingGrantChanges, holderKey, holderChanges)
            : deleteFromMap(this.pendingGrantChanges, holderKey);
    }

    /**
     * Handles the click event for the save button for a specific holder's roles.
     * @param {string} holderKey - The key of the holder.
     * @returns {Promise<void>}
     */
    async handleSaveHolderRolesButtonClick(holderKey) {
        const draftRoles = this.draftRoleGrants.get(holderKey) ?? [];
        const pendingChanges = this.pendingGrantChanges.get(holderKey) ?? [];
        // Nothing to save, or a previous click of the same button is still running.
        if (
            (draftRoles.length === 0 && pendingChanges.length === 0) ||
            this._savingHolderKeys.has(holderKey)
        ) {
            return;
        }

        /** @type {GrantHolder|DraftGrantHolder|undefined} */
        const holder = this.grantHolders.get(holderKey) ?? this.draftGrantHolders.get(holderKey);
        if (!holder) {
            console.warn('No holder found for key', holderKey);
            return;
        }

        // Marks the holder as saving, so the save button is disabled until the requests finished.
        this._savingHolderKeys = new Set(this._savingHolderKeys).add(holderKey);

        try {
            const failedChanges = await this._applyPendingGrantChanges(holder, pendingChanges);
            const failedDrafts = await this._createDraftRoleGrants(holder, draftRoles);

            // Rows that could not be saved stay in the list, so the user can retry them.
            this.pendingGrantChanges = failedChanges.length
                ? updateInMap(this.pendingGrantChanges, holderKey, failedChanges)
                : deleteFromMap(this.pendingGrantChanges, holderKey);
            this.draftRoleGrants = failedDrafts.length
                ? updateInMap(this.draftRoleGrants, holderKey, failedDrafts)
                : deleteFromMap(this.draftRoleGrants, holderKey);
            if (!failedDrafts.length) {
                this.draftGrantHolders = deleteFromMap(this.draftGrantHolders, holderKey);
            }

            // Reload the grant holders to reflect the changes in the UI.
            await this._loadRoleGrantHolders();
        } finally {
            const savingHolderKeys = new Set(this._savingHolderKeys);
            savingHolderKeys.delete(holderKey);
            this._savingHolderKeys = savingHolderKeys;
        }
    }

    async handleDeleteRoleButtonClick(roleIdentifier, roleName, holderName) {
        if (!roleIdentifier) {
            console.warn('No role identifier found for grant', roleIdentifier);
            return;
        }

        if (!(await this._deleteRoleGrant(roleIdentifier))) {
            this._notifyError('auth-manage-dialog.notifications.could-not-delete-role', {
                roleName: roleName,
                holderName: holderName,
            });
            return;
        }

        // Remove the deleted role from the grant holders map to render the list without the
        // deleted role. The reload also removes holders that have no grants left.
        // Draft states on other subjects are not affected.
        this.grantHolders = new Map(
            [...this.grantHolders.entries()].map(([key, holder]) => {
                const updatedGrants = holder.grants.filter(
                    (grant) => grant.identifier !== roleIdentifier,
                );
                return [key, {...holder, grants: updatedGrants}];
            }),
        );
        await this._loadRoleGrantHolders();

        this._notifySuccess('auth-manage-dialog.notifications.role-deleted-successfully', {
            roleName: roleName,
            holderName: holderName,
        });
    }

    /**
     * Creates the grants of the unsaved role rows of a holder.
     * @param {GrantHolder|DraftGrantHolder} holder - Holder the roles belong to.
     * @param {DraftRoleGrant[]} draftRoles - Unsaved role rows to create.
     * @returns {Promise<DraftRoleGrant[]>} The rows that could not be created.
     */
    async _createDraftRoleGrants(holder, draftRoles) {
        const grantHolderIdentifier = getGrantHolderFields(holder);
        const holderName = this._getGrantHolderDisplayName(holder.subject);
        /** @type {DraftRoleGrant[]} */
        const failedDrafts = [];

        for (const draftRole of draftRoles) {
            if (!draftRole.roleIdentifier) {
                console.warn('Draft role has no roleIdentifier', draftRole);
                continue;
            }
            const roleName = this._getRoleNameByIri(draftRole.roleIdentifier);

            if (await this._createRoleGrant(draftRole, grantHolderIdentifier)) {
                this._notifySuccess('auth-manage-dialog.notifications.role-saved-successfully', {
                    roleName: roleName,
                    holderName: holderName,
                });
            } else {
                failedDrafts.push(draftRole);
                this._notifyError('auth-manage-dialog.notifications.could-not-save-role', {
                    roleName: roleName,
                    holderName: holderName,
                });
            }
        }

        return failedDrafts;
    }

    /**
     * Applies the unsaved changes of a holder's saved grants. A grant cannot be modified, so
     * the new grant is created first and the grant it replaces is deleted afterwards.
     * @param {GrantHolder|DraftGrantHolder} holder - Holder the grants belong to.
     * @param {PendingGrantChange[]} pendingChanges - Unsaved changes to apply.
     * @returns {Promise<PendingGrantChange[]>} The changes that could not be applied.
     */
    async _applyPendingGrantChanges(holder, pendingChanges) {
        const grantHolderIdentifier = getGrantHolderFields(holder);
        const holderName = this._getGrantHolderDisplayName(holder.subject);
        /** @type {PendingGrantChange[]} */
        const failedChanges = [];

        for (const pendingChange of pendingChanges) {
            const replacedGrant = holder.grants.find(
                (grant) => grant.identifier === pendingChange.grantIdentifier,
            );
            // The grant disappeared since the last reload, so there is nothing left to change.
            if (!replacedGrant) {
                console.warn('No grant found for pending change', pendingChange);
                continue;
            }
            const oldRoleName = this._getRoleName(replacedGrant.roleDefinition);
            const roleName = this._getRoleNameByIri(pendingChange.roleIdentifier);
            // Only the shareable state changed, so the role is updated instead of replaced.
            const keepsRole = pendingChange.roleIdentifier === replacedGrant.roleDefinition['@id'];
            const messageValues = {
                oldRoleName: oldRoleName,
                roleName: roleName,
                holderName: holderName,
            };

            if (!(await this._createRoleGrant(pendingChange, grantHolderIdentifier))) {
                failedChanges.push(pendingChange);
                if (keepsRole) {
                    this._notifyError(
                        'auth-manage-dialog.notifications.could-not-update-role',
                        messageValues,
                    );
                } else {
                    this._notifyError(
                        'auth-manage-dialog.notifications.could-not-change-role',
                        messageValues,
                    );
                }
                continue;
            }

            if (await this._deleteRoleGrant(replacedGrant.identifier)) {
                if (keepsRole) {
                    this._notifySuccess(
                        'auth-manage-dialog.notifications.role-updated-successfully',
                        messageValues,
                    );
                } else {
                    this._notifySuccess(
                        'auth-manage-dialog.notifications.role-changed-successfully',
                        messageValues,
                    );
                }
            } else {
                // The new grant exists, so retrying the change would create it a second time.
                // The old role stays assigned until the user deletes it.
                this._notifyError(
                    'auth-manage-dialog.notifications.could-not-delete-replaced-role',
                    {oldRoleName: oldRoleName, holderName: holderName},
                );
            }
        }

        return failedChanges;
    }

    /**
     * Creates one grant for a holder.
     * @param {RoleGrantSelection} grantSelection - Role and shareable state to create.
     * @param {import('./grant-holder.js').GrantHolderFields} grantHolderIdentifier - Fields
     *     addressing the holder of the grant.
     * @returns {Promise<boolean>} Whether the grant was created.
     */
    async _createRoleGrant(grantSelection, grantHolderIdentifier) {
        try {
            const response = await this._apiPostRoles(
                {
                    resourceClassIdentifier: this.resourceClassIdentifier,
                    resourceIdentifier: this.resourceIdentifier,
                    resourceType: this.resourceType,
                },
                grantSelection,
                grantHolderIdentifier,
            );
            return response.ok;
        } catch (error) {
            console.error('Could not create role grant', grantSelection, error);
            return false;
        }
    }

    /**
     * Deletes one grant.
     * @param {string} grantIdentifier - Identifier of the grant to delete.
     * @returns {Promise<boolean>} Whether the grant was deleted.
     */
    async _deleteRoleGrant(grantIdentifier) {
        try {
            const response = await this._apiDeleteGrant(grantIdentifier);
            return response.ok;
        } catch (error) {
            console.error('Could not delete role grant', grantIdentifier, error);
            return false;
        }
    }

    /**
     * Returns the name a role has in the current language.
     * @param {string} roleIri - IRI of the role.
     * @returns {string} Name of the role, or its identifier when the role is unknown.
     */
    _getRoleNameByIri(roleIri) {
        return this._getRoleName(this.roles.get(roleIri) ?? {identifier: roleIri});
    }

    /**
     * Shows a success notification in the dialog.
     * @param {string} bodyKey - Translation key of the message.
     * @param {Record<string, string>} [values] - Interpolation values of the message.
     * @returns {void}
     */
    _notifySuccess(bodyKey, values = {}) {
        sendNotification({
            summary: this._i18n.t('auth-manage-dialog.notifications.success-title'),
            body: this._i18n.t(bodyKey, values),
            type: 'success',
            targetNotificationId: 'auth-manage-dialog-notification',
            timeout: 5,
        });
    }

    /**
     * Shows an error notification in the dialog. Error notifications stay until the user
     * closes them.
     * @param {string} bodyKey - Translation key of the message.
     * @param {Record<string, string>} [values] - Interpolation values of the message.
     * @returns {void}
     */
    _notifyError(bodyKey, values = {}) {
        sendNotification({
            summary: this._i18n.t('auth-manage-dialog.notifications.error-title'),
            body: this._i18n.t(bodyKey, values),
            type: 'danger',
            targetNotificationId: 'auth-manage-dialog-notification',
            timeout: 0,
        });
    }

    static get styles() {
        return css`
            @layer theme, components;

            @layer theme {
                ${commonStyles.getThemeCSS()}
                ${commonStyles.getGeneralCSS()}
            }

            @layer components {
                ${getAuthorizationManageGrantsDialogCSS()}
            }
        `;
    }

    render() {
        const i18n = this._i18n;

        return html`
            <dbp-modal
                ${ref(this.modalRef)}
                sticky-footer
                full-height-line
                @dbp-modal-closed="${this._handleModalClosed}"
                class="modal--manage-grants ${classMap({'show-roles': this.showRolesPanel})}"
                title="${this.modalTitle}">
                <div slot="header">
                    <dbp-notification
                        id="auth-manage-dialog-notification"
                        inline
                        lang="${this.lang}"></dbp-notification>
                </div>
                <div slot="content">
                    <div class="main-content">
                        <div class="add-resource-container">
                            <dbp-authorization-subject-select
                                ${ref(this.subjectSelectorRef)}
                                id="resource-select"
                                class="resource-select-component"
                                lang="${this.lang}"
                                subscribe="auth"
                                placeholder="${i18n.t('auth-manage-dialog.subject-select-placeholder')}"
                                entry-point-url="${this.entryPointUrl}"
                                @change="${(event) => {
                                    this.selectedSubject = event.detail.object;
                                }}"></dbp-authorization-subject-select>
                            <div class="add-person-button-container">
                                <dbp-button
                                    type="is-secondary"
                                    id="add-person-button"
                                    no-spinner-on-click
                                    ?disabled="${this.selectedSubject === null}"
                                    @click="${this.handleAddPersonButtonClick}">
                                    <dbp-icon name="plus"></dbp-icon>
                                    ${i18n.t('auth-manage-dialog.buttons.add-subject-button-label')}
                                </dbp-button>
                                <dbp-button
                                    id="show-roles-button"
                                    class="show-roles-button"
                                    no-spinner-on-click
                                    @click="${() => {
                                        this.showRolesPanel = !this.showRolesPanel;
                                    }}">
                                    ${
                                        this.showRolesPanel
                                            ? i18n.t(
                                                  'auth-manage-dialog.buttons.hide-roles-button-label',
                                              )
                                            : i18n.t(
                                                  'auth-manage-dialog.buttons.show-roles-button-label',
                                              )
                                    }
                                    <dbp-icon name="chevron-right"></dbp-icon>
                                </dbp-button>
                            </div>
                        </div>
                        <div class="grants-list-container">${this.renderGrantHolders()}</div>
                    </div>
                    ${this.showRolesPanel ? this.renderRolesSidePanel() : ''}
                </div>
                <div slot="footer" class="footer-menu">
                    <dbp-button
                        type="is-secondary"
                        class="close-dialog-footer-button"
                        no-spinner-on-click
                        @click="${this.close}">
                        <dbp-icon name="close" aria-hidden="true"></dbp-icon>
                        ${i18n.t('auth-manage-dialog.buttons.close-button-label')}
                    </dbp-button>
                    <dbp-button
                        type="is-primary"
                        class="save-all-roles-button"
                        no-spinner-on-click
                        @click="${this.saveAllRoles}">
                        <dbp-icon name="save" aria-hidden="true"></dbp-icon>
                        ${i18n.t('auth-manage-dialog.buttons.save-roles-button-label')}
                    </dbp-button>
                </div>
            </dbp-modal>
        `;
    }
}
