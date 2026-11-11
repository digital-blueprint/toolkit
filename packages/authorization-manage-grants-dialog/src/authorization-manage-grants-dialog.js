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
    GRANT_HOLDER_ICONS,
    GRANT_HOLDER_TYPE_ORDER,
    SUBJECT_TYPE_DYNAMIC_USER_GROUP,
    SUBJECT_TYPE_PERSON,
    SUBJECT_TYPE_USER_GROUP,
    deriveGrantHolderIdentity,
    getGrantHolderDisplayName,
    getGrantHolderFields,
    getIriIdentifier,
    toCompactSubject,
} from './grant-holder.js';
import {
    compareIdentifiers,
    createCollator,
    deleteFromMap,
    getRoleName,
    getRoleNameByIri,
    isGrantChangeable,
    updateInMap,
    getFormName,
} from './utils.js';

/**
 * @typedef {import('./types.js').RoleGrant} RoleGrant
 * @typedef {import('./types.js').GrantHolderSubject} GrantHolderSubject
 * @typedef {import('./types.js').GrantHolder} GrantHolder
 * @typedef {import('./types.js').RoleGrantSelection} RoleGrantSelection
 * @typedef {import('./types.js').DraftRoleGrant} DraftRoleGrant
 * @typedef {import('./types.js').PendingGrantChange} PendingGrantChange
 * @typedef {import('./types.js').DraftGrantHolder} DraftGrantHolder
 * @typedef {import('./types.js').RoleDefinition} RoleDefinition
 * @typedef {import('./types.js').GrantHolderFields} GrantHolderFields
 * @typedef {import('./types.js').GrantHolderIdentity} GrantHolderIdentity
 * @typedef {import('./types.js').ResourceActionGrant} ResourceActionGrant
 * @typedef {import('./types.js').FormalizeForm} FormalizeForm
 * @typedef {import('./types.js').FormalizeFormSubmission} FormalizeFormSubmission
 */

/** Authorization resource type of a single item. */
export const RESOURCE_TYPE_ITEM = 0;
/** Authorization resource type of a group of items. */
export const RESOURCE_TYPE_GROUP = 1;

const RESOURCE_CLASS_FORM = 'DbpRelayFormalizeForm';
const RESOURCE_CLASS_SUBMISSION = 'DbpRelayFormalizeSubmission';

// The kinds of formalize resource the dialog can name in its subtitle. They combine the
// resource class with the resource type, since submissions are managed one by one as well as
// all at once.
const RESOURCE_KIND_FORM = 'form';
const RESOURCE_KIND_SUBMISSION = 'submission';
const RESOURCE_KIND_SUBMISSIONS = 'submissions';

export class AuthorizationManageGrantsDialog extends AuthMixin(
    LangMixin(ScopedElementsMixin(DBPLitElement), createInstance),
) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.modalTitle = this._i18n.t('auth-manage-dialog.modal-title');
        this.modalSubTitle = '';
        /** @type {import('lit/directives/ref.js').Ref<Modal>} */
        this.modalRef = createRef();
        /** @type {import('lit/directives/ref.js').Ref<AuthorizationSubjectSelect>} */
        this.subjectSelectorRef = createRef();
        /** @type {import('./authorization-subject-select.js').SubjectResource|null} */
        this.selectedSubject = null;
        this.resourceClassIdentifier = '';
        this.resourceIdentifier = '';
        this.resourceType = RESOURCE_TYPE_ITEM;
        /** @type {string|null} The compound resource identifier the loaded data belongs to. */
        this._loadedResourceKey = null;
        /** @type {FormalizeForm|null} Form the current resource belongs to. */
        this._resourceForm = null;
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
        /** @type {Intl.Collator|null} */
        this._cachedCollator = null;
        /** @type {string|null} Language the cached collator was created for. */
        this._cachedCollatorLang = null;
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            modalTitle: {type: String, attribute: 'modal-title'},
            modalSubTitle: {state: true},
            selectedSubject: {state: true},
            resourceClassIdentifier: {type: String, attribute: 'resource-class-identifier'},
            resourceIdentifier: {type: String, attribute: 'resource-identifier'},
            resourceType: {type: Number, attribute: 'resource-type'},
            _resourceForm: {state: true},
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

        const resourceChanged =
            changedProperties.has('resourceClassIdentifier') ||
            changedProperties.has('resourceIdentifier') ||
            changedProperties.has('resourceType');
        // open() loads the resource itself, so a change applied in the same update is already covered.
        if (
            resourceChanged &&
            this.modalRef.value?.isOpen() &&
            this._getResourceKey() !== this._loadedResourceKey
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
        this.modalSubTitle = '';
        this._resourceForm = null;
        this.grantHoldersLoading = false;
        this.draftGrantHolders = new Map();
        this.draftRoleGrants = new Map();
        this.pendingGrantChanges = new Map();
        this._savingHolderKeys = new Set();
        this._nextDraftRoleIdentifier = 0;
        this.showRolesPanel = false;
        this.selectedSubject = null;
        void this.subjectSelectorRef.value?.reset();
        this._loadedResourceKey = null;
    }

    /**
     * The collator of the current language. Sorting happens on every render, so it is kept
     * until the language changes instead of being rebuilt for every list.
     * @returns {Intl.Collator} Collator comparing names of the current language.
     */
    get _collator() {
        if (this._cachedCollator === null || this._cachedCollatorLang !== this.lang) {
            this._cachedCollator = createCollator(this.lang);
            this._cachedCollatorLang = this.lang;
        }
        return this._cachedCollator;
    }

    /**
     * Returns the access token of the current user.
     * @returns {string} Access token, or an empty string while logged out.
     */
    _getAuthToken() {
        return this.auth?.token ?? '';
    }

    /**
     * Builds the headers shared by all API requests.
     * @param {Record<string, string>} [additionalHeaders] - Headers to add or override.
     * @returns {Record<string, string>} Request headers.
     */
    _getApiHeaders(additionalHeaders = {}) {
        return {
            'Accept-Language': this.lang,
            Authorization: 'Bearer ' + this._getAuthToken(),
            ...additionalHeaders,
        };
    }

    /**
     * Fetches an API collection in the current language.
     * @param {string} url - Absolute collection URL.
     * @param {AbortSignal} [signal] - Request cancellation signal.
     * @returns {Promise<object[]>} Members of the collection.
     */
    async _getCollection(url, signal) {
        return await hydra.getCollection(url, this.lang, () => this._getAuthToken(), {signal});
    }

    /**
     * Builds the collection URL of a compound authorization resource identifier.
     *
     * @param {string} path - API collection path.
     * @returns {string} Absolute collection URL.
     */
    _getResourceCollectionUrl(path) {
        const url = new URL(path, this.entryPointUrl);
        url.searchParams.set('resourceClass', this.resourceClassIdentifier);
        url.searchParams.set('resourceIdentifier', this.resourceIdentifier);
        url.searchParams.set('resourceType', String(this.resourceType));
        return url.href;
    }

    /**
     * Fetches an API item, preserving its translations.
     * @param {string} path - API item IRI.
     * @param {AbortSignal} [signal] - Request cancellation signal.
     * @returns {Promise<object>} API resource.
     */
    async _apiGetItem(path, signal) {
        const response = await fetch(new URL(path, this.entryPointUrl), {
            signal,
            headers: this._getApiHeaders({Accept: 'application/ld+json'}),
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    }

    /**
     * Fetches a person by identifier.
     * @param {string} identifier - Person identifier.
     * @param {AbortSignal} [signal] - Request cancellation signal.
     * @returns {Promise<object>} API resource.
     */
    async _apiGetPerson(identifier, signal) {
        return await this._apiGetItem(
            `/base/people/${encodeURIComponent(identifier)}?includeLocal=email`,
            signal,
        );
    }

    /**
     * Fetches a user group by IRI.
     * @param {string} iri - User group IRI.
     * @param {AbortSignal} [signal] - Request cancellation signal.
     * @returns {Promise<object>} API resource.
     */
    async _apiGetUserGroup(iri, signal) {
        return await this._apiGetItem(iri, signal);
    }

    /**
     * Fetches role definitions for the current resource.
     * @param {AbortSignal} [signal] - Request cancellation signal.
     * @returns {Promise<RoleDefinition[]>} Role definitions.
     */
    async _apiGetRoles(signal) {
        const roles = await this._getCollection(
            this._getResourceCollectionUrl('/authorization/roles'),
            signal,
        );
        return /** @type {RoleDefinition[]} */ (roles);
    }

    /**
     * Fetches resource action grants for the current resource.
     * @param {AbortSignal} [signal] - Request cancellation signal.
     * @returns {Promise<ResourceActionGrant[]>} Raw resource action grants.
     */
    async _apiGetResourceActionGrants(signal) {
        const grants = await this._getCollection(
            this._getResourceCollectionUrl('/authorization/resource-action-grants'),
            signal,
        );
        return /** @type {ResourceActionGrant[]} */ (grants);
    }

    /**
     * Fetches dynamic user groups.
     * @param {AbortSignal} [signal] - Request cancellation signal.
     * @returns {Promise<GrantHolderSubject[]>} Dynamic user groups.
     */
    async _apiGetDynamicUserGroups(signal) {
        const groups = await this._getCollection(
            new URL('/authorization/dynamic-user-groups', this.entryPointUrl).href,
            signal,
        );
        return /** @type {GrantHolderSubject[]} */ (groups);
    }

    /**
     * Save subject roles to the API.
     * @param {RoleGrantSelection} grantSelection
     * @param {GrantHolderFields} holderFields
     * @returns {Promise<Response>} response
     */
    async _apiPostResourceActionGrant(grantSelection, holderFields) {
        const roleIdentifier = grantSelection.roleIdentifier;
        const shareable = grantSelection.shareable ?? false;

        const payload = {
            resourceClass: this.resourceClassIdentifier,
            resourceIdentifier: this.resourceIdentifier,
            resourceType: this.resourceType,
            role: roleIdentifier,
            shareable: shareable,
            ...holderFields,
        };

        const apiUrl = new URL('/authorization/resource-action-grants', this.entryPointUrl);
        const options = {
            method: 'POST',
            headers: this._getApiHeaders({'Content-Type': 'application/ld+json'}),
            body: JSON.stringify(payload),
        };
        return await fetch(apiUrl, options);
    }

    /**
     * Deletes a resource action grant.
     * @param {string} grantIdentifier
     * @returns {Promise<Response>}
     */
    async _apiDeleteResourceActionGrant(grantIdentifier) {
        const apiUrl = new URL(
            `/authorization/resource-action-grants/${grantIdentifier}`,
            this.entryPointUrl,
        );
        const options = {
            method: 'DELETE',
            headers: this._getApiHeaders({'Content-Type': 'application/ld+json'}),
        };
        return await fetch(apiUrl, options);
    }

    /**
     * The kind of formalize resource the dialog manages. Both the form lookup and the
     * subtitle depend on the combination of resource class and resource type.
     * @returns {string|null} One of the RESOURCE_KIND_* values, or null for another resource.
     */
    _getResourceKind() {
        if (this.resourceClassIdentifier === RESOURCE_CLASS_FORM) {
            return RESOURCE_KIND_FORM;
        }
        if (this.resourceClassIdentifier === RESOURCE_CLASS_SUBMISSION) {
            return this.resourceType === RESOURCE_TYPE_ITEM
                ? RESOURCE_KIND_SUBMISSION
                : RESOURCE_KIND_SUBMISSIONS;
        }
        return null;
    }

    /**
     * Loads the form the current resource belongs to, so the dialog can name it.
     * A submission only references its form, so it takes a second request.
     * @param {AbortSignal} [signal] - Request cancellation signal.
     * @returns {Promise<FormalizeForm|null>} The form, or null when there is none to show.
     */
    async _apiGetResourceForm(signal) {
        const identifier = encodeURIComponent(this.resourceIdentifier);
        switch (this._getResourceKind()) {
            // A form and all submissions of a form are both addressed by the form identifier.
            case RESOURCE_KIND_FORM:
            case RESOURCE_KIND_SUBMISSIONS:
                return /** @type {FormalizeForm} */ (
                    await this._apiGetItem(`/formalize/forms/${identifier}`, signal)
                );
            case RESOURCE_KIND_SUBMISSION: {
                // A single submission only carries the IRI of the form it belongs to.
                const submission = /** @type {FormalizeFormSubmission} */ (
                    await this._apiGetItem(`/formalize/submissions/${identifier}`, signal)
                );
                return submission.form
                    ? /** @type {FormalizeForm} */ (await this._apiGetItem(submission.form, signal))
                    : null;
            }
            default:
                return null;
        }
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
            const roles = await this._apiGetRoles(signal);
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
        this._loadedResourceKey = this._getResourceKey();

        this.grantHolders = new Map();
        this.draftGrantHolders = new Map();
        this.draftRoleGrants = new Map();
        this.pendingGrantChanges = new Map();
        this._nextDraftRoleIdentifier = 0;

        if (!this.resourceClassIdentifier || !this.resourceIdentifier || !this.isLoggedIn()) {
            this.grantHoldersLoading = false;
            return;
        }
        // The resource type goes straight into the request URL and the grant payload, so a wrong
        // value only shows up as a server-side error.
        if (![RESOURCE_TYPE_ITEM, RESOURCE_TYPE_GROUP].includes(this.resourceType)) {
            console.warn(
                `Unsupported resource type "${this.resourceType}", expected ` +
                    `${RESOURCE_TYPE_ITEM} (item) or ${RESOURCE_TYPE_GROUP} (group)`,
            );
        }

        void this._loadResourceForm(controller.signal);
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
     * Loads the form the current resource belongs to and shows its name in the dialog header.
     * The name is decorative, so a form that cannot be loaded only clears the subtitle.
     * @param {AbortSignal} [signal] - Cancels the request when the resource changes.
     * @returns {Promise<void>}
     */
    async _loadResourceForm(signal) {
        this._resourceForm = null;
        try {
            const form = await this._apiGetResourceForm(signal);
            if (!signal?.aborted) {
                this._resourceForm = form;
            }
        } catch (error) {
            if (!signal?.aborted) {
                console.warn('Could not load the form of the resource', error);
            }
        }
    }

    /**
     * Identifies the resource the dialog currently shows, so the same one is not loaded twice.
     * @returns {string} Compound authorization resource identifier.
     */
    _getResourceKey() {
        return `${this.resourceClassIdentifier}:${this.resourceIdentifier}:${this.resourceType}`;
    }

    /**
     * Reloads the grant holders after a change, so the list shows what the API stores.
     * The reload belongs to the current resource, so closing the dialog or switching the
     * resource discards a response that is still on its way.
     * @returns {Promise<void>}
     */
    async _reloadGrantHolders() {
        const signal = this._resourceDataController?.signal;
        if (signal?.aborted) {
            return;
        }
        await this._loadRoleGrantHolders(signal);
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
            const grants = await this._apiGetResourceActionGrants(signal);
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
                /** @type {GrantHolderIdentity|null} */
                const holderIdentity = deriveGrantHolderIdentity(grant);
                if (holderIdentity === null) {
                    continue;
                }
                // Add new holders
                if (!holders.has(holderIdentity.key)) {
                    holders.set(holderIdentity.key, {
                        ...holderIdentity,
                        subject: null,
                        grants: [],
                    });
                }
                // Add the grant to the holder's list of grants
                holders.get(holderIdentity.key).grants.push(grant);
            }

            // Dynamic groups have no item endpoint, so fetch their collection only once.
            const dynamicGroups = [...holders.values()].some(
                (holder) => holder.type === SUBJECT_TYPE_DYNAMIC_USER_GROUP,
            )
                ? await this._apiGetDynamicUserGroups(signal)
                : [];

            const holderList = [...holders.values()];
            // Fill holders with their subject data and compact grants.
            const subjectResults = await Promise.allSettled(
                holderList.map(async (holder) => {
                    return holder.type === SUBJECT_TYPE_DYNAMIC_USER_GROUP
                        ? dynamicGroups.find((group) => group['identifier'] === holder.identifier)
                        : holder.type === SUBJECT_TYPE_PERSON
                          ? this._apiGetPerson(holder.identifier, signal)
                          : this._apiGetUserGroup(holder.iri, signal);
                }),
            );
            if (!signal?.aborted) {
                const resolvedHolders = holderList.map((holder, index) => {
                    const result = subjectResults[index];
                    // A missing or inaccessible subject must not hide the other grant holders.
                    const subject = result.status === 'fulfilled' ? result.value : undefined;
                    return {
                        key: holder.key,
                        type: holder.type,
                        subject: subject
                            ? toCompactSubject(subject, holder.type)
                            : {identifier: holder.identifier},
                        grants: holder.grants.map((grant) => ({
                            identifier: grant.identifier,
                            shareable: grant.shareable,
                            grantedActions: grant.grantedActions ?? [],
                            roleDefinition: roleDefinitions.get(grant['role']) ?? {
                                '@id': grant['role'],
                                identifier: getIriIdentifier(grant['role']),
                                roleNames: [],
                            },
                        })),
                    };
                });
                this.grantHolders = this._sortGrantHolders(
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
            // A holder key contains a colon, which has to be escaped in the selector only
            const existingHolderElement = this._(
                `#grant-holder-${CSS.escape(selectedHolderIdentity.key)}`,
            );
            if (existingHolderElement) {
                void this._scrollToAndHighlightExistingHolder(existingHolderElement);
            }
        } else {
            // Add the new subject to the draft grant holders list.
            let subject = toCompactSubject(selectedSubject, selectedHolderIdentity.type);

            // Get the email address of the person
            if (selectedHolderIdentity.type === SUBJECT_TYPE_PERSON) {
                try {
                    const person = /** @type {GrantHolderSubject} */ (
                        await this._apiGetPerson(subject.identifier)
                    );
                    subject = {...subject, localData: {email: person.localData?.email ?? null}};
                } catch (error) {
                    console.warn('Could not fetch person data', error);
                }
            }

            const draftHolder = {
                key: selectedHolderIdentity.key,
                type: selectedHolderIdentity.type,
                subject,
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
     * Adds an empty draft role row to a grant holder.
     * @param {string} holderKey - Key of an existing or draft grant holder.
     * @returns {void}
     */
    handleAddRoleButtonClick(holderKey) {
        const holderDraftRoles = this.draftRoleGrants.get(holderKey) ?? [];
        const hasIncompleteDraft = this._hasIncompleteDraftRole(holderKey);

        if (hasIncompleteDraft || !this._getAvailableRolesForHolder(holderKey).length) {
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
     * Save all pending changes and draft roles of a specific holder.
     * Refreshes the grant holders after saving, so the UI reflects the changes.
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
            await this._reloadGrantHolders();
        } finally {
            const savingHolderKeys = new Set(this._savingHolderKeys);
            savingHolderKeys.delete(holderKey);
            this._savingHolderKeys = savingHolderKeys;
        }
    }

    /**
     * Delete user role grant and reload the grant holders to update the UI accordingly.
     * @param {string} grantIdentifier
     * @param {string} roleName
     * @param {string} holderName
     * @returns {Promise<void>}
     */
    async handleDeleteRoleButtonClick(grantIdentifier, roleName, holderName) {
        if (!grantIdentifier) {
            console.warn('No role identifier found for grant', grantIdentifier);
            return;
        }

        if (!(await this._deleteRoleGrant(grantIdentifier))) {
            this._notifyError('auth-manage-dialog.notifications.could-not-delete-role', {
                roleName: roleName,
                holderName: holderName,
            });
            return;
        }

        await this._reloadGrantHolders();

        this._notifySuccess('auth-manage-dialog.notifications.role-deleted-successfully', {
            roleName: roleName,
            holderName: holderName,
        });
    }

    /**
     * Handles the change event of the role selector of a saved grant.
     * @param {Event} event - The change event.
     * @param {string} holderKey - Key of the holder the grant belongs to.
     * @param {RoleGrant} grant - Saved grant whose role selector changed.
     * @returns {void}
     */
    handleRoleSelectChange(event, holderKey, grant) {
        const roleIdentifier = /** @type {HTMLSelectElement} */ (event.target).value;
        this._updatePendingGrantChange(holderKey, grant, {roleIdentifier: roleIdentifier});
    }

    /**
     * Handles the change event of the shareable checkbox of a saved grant.
     * @param {Event} event - The change event.
     * @param {string} holderKey - Key of the holder the grant belongs to.
     * @param {RoleGrant} grant - Saved grant whose shareable state changed.
     * @returns {void}
     */
    handleGrantShareableChange(event, holderKey, grant) {
        const shareable = /** @type {HTMLInputElement} */ (event.target).checked;
        this._updatePendingGrantChange(holderKey, grant, {shareable: shareable});
    }

    /**
     * Toggles the visibility of the roles panel.
     * @returns {void}
     */
    handleShowRolesButtonClick() {
        this.showRolesPanel = !this.showRolesPanel;
    }

    /**
     * Store the selected subject.
     * @param {CustomEvent<{object: import('./authorization-subject-select.js').SubjectResource|null}>} event - The ResourceSelect change event.
     * @returns {void}
     */
    handleSubjectSelectChange(event) {
        this.selectedSubject = event.detail.object;
    }

    /**
     * Handles the change event of the role selector for a draft role.
     * @param {Event} event - The change event.
     * @param {DraftRoleGrant} grant - The draft grant.
     * @param {string} holderKey - Key of the grant's holder.
     * @returns {void}
     */
    handleDraftRoleSelectChange(event, grant, holderKey) {
        const roleIdentifier = /** @type {HTMLSelectElement} */ (event.target).value;
        this._updateDraftRole(holderKey, grant.clientIdentifier, {
            roleIdentifier: roleIdentifier || null,
        });
    }

    /**
     * Handles the change event of the shareable checkbox for a draft role.
     * @param {Event} event - The change event.
     * @param {DraftRoleGrant} grant - The draft grant.
     * @param {string} holderKey - Key of the grant's holder.
     * @returns {void}
     */
    handleDraftShareableChange(event, grant, holderKey) {
        this._updateDraftRole(holderKey, grant.clientIdentifier, {
            shareable: /** @type {HTMLInputElement} */ (event.target).checked,
        });
    }

    /**
     * Save all pending roles and draft-roles for all holders.
     * @returns {void}
     */
    handleSaveAllRolesButtonClick() {
        // @TODO: Implement if needed.
    }

    /**
     * Returns the roles that can still be assigned to a holder, excluding roles already
     * assigned and roles selected by other draft rows of the same holder.
     * @param {string} holderKey - Key of an existing or draft grant holder.
     * @param {string|null} [currentDraftIdentifier] - Client identifier of the draft row being
     *     rendered, so its own selection is not filtered out.
     * @param {string|null} [currentGrantIdentifier] - Identifier of the grant being rendered, so its own selection is not filtered out.
     * @returns {RoleDefinition[]} Available role definitions.
     */
    _getAvailableRolesForHolder(
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
                        this._getPendingGrantChange(holderKey, grant.identifier)?.roleIdentifier ??
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
    _getPendingGrantChange(holderKey, grantIdentifier) {
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
    _updateDraftRole(holderKey, clientIdentifier, changes) {
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
     * Records an unsaved change of a saved grant and assigns a new map so Lit rerenders it.
     * The change is dropped again as soon as it matches the saved grant, so reverting a
     * selection also disables the save button again.
     * @param {string} holderKey - Key of the holder the grant belongs to.
     * @param {RoleGrant} grant - Saved grant that was changed.
     * @param {{roleIdentifier?: string, shareable?: boolean}} changes - Changed values.
     * @returns {void}
     */
    _updatePendingGrantChange(holderKey, grant, changes) {
        const currentChange = this._getPendingGrantChange(holderKey, grant.identifier);
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
     * Scrolls to an existing grant holder and highlights it after scrolling finishes.
     * @param {HTMLElement} holderElement - Existing grant holder section.
     * @returns {Promise<void>}
     */
    async _scrollToAndHighlightExistingHolder(holderElement) {
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
     * Sorts grant holders by type—people, user groups, then dynamic groups—and by display name
     * within each type.
     * @param {Map<string, GrantHolder>} grantHolders - Grant holders keyed by their holder key.
     * @returns {Map<string, GrantHolder>} A new map in display order.
     */
    _sortGrantHolders(grantHolders) {
        const sortedEntries = [...grantHolders.entries()].sort(([, left], [, right]) => {
            const typeDifference =
                GRANT_HOLDER_TYPE_ORDER.indexOf(left.type) -
                GRANT_HOLDER_TYPE_ORDER.indexOf(right.type);
            return (
                typeDifference ||
                this._collator.compare(
                    getGrantHolderDisplayName(left.subject),
                    getGrantHolderDisplayName(right.subject),
                ) ||
                compareIdentifiers(left.key, right.key)
            );
        });
        return new Map(sortedEntries);
    }

    /**
     * Determines if the save button for a specific holder should be disabled.
     * @param {string} holderKey - The key of the holder.
     * @returns {boolean} Returns true if the save button for the holder should be disabled, false otherwise.
     */
    _isSaveDisabled(holderKey) {
        // Disable the save button if the holder is currently being saved
        if (this._savingHolderKeys.has(holderKey)) return true;

        const draftGrants = this.draftRoleGrants.get(holderKey) ?? [];
        const pendingChanges = this.pendingGrantChanges.get(holderKey) ?? [];
        // An incomplete draft row always blocks saving.
        if (this._hasIncompleteDraftRole(holderKey)) return true;

        // Enable if no pending changes and no draft grants exist for the holder.
        return draftGrants.length === 0 && pendingChanges.length === 0;
    }

    _isAddRoleDisabled(holderKey) {
        return (
            this._hasIncompleteDraftRole(holderKey) ||
            !this._getAvailableRolesForHolder(holderKey).length
        );
    }

    /**
     * Whether a holder has a draft role row with no role selected yet. Such a row blocks adding
     * another row and blocks saving the holder.
     * @param {string} holderKey - Key of an existing or draft grant holder.
     * @returns {boolean} Whether a draft row is still incomplete.
     */
    _hasIncompleteDraftRole(holderKey) {
        return (this.draftRoleGrants.get(holderKey) ?? []).some((draft) => !draft.roleIdentifier);
    }

    /**
     * Creates the grants of the unsaved role rows of a holder.
     * @param {GrantHolder|DraftGrantHolder} holder - Holder the roles belong to.
     * @param {DraftRoleGrant[]} draftRoles - Unsaved role rows to create.
     * @returns {Promise<DraftRoleGrant[]>} The rows that could not be created.
     */
    async _createDraftRoleGrants(holder, draftRoles) {
        const holderFields = getGrantHolderFields(holder);
        const holderName = getGrantHolderDisplayName(holder.subject);
        /** @type {DraftRoleGrant[]} */
        const failedDrafts = [];

        for (const draftRole of draftRoles) {
            if (!draftRole.roleIdentifier) {
                console.warn('Draft role has no roleIdentifier', draftRole);
                continue;
            }
            const roleName = getRoleNameByIri(this.roles, draftRole.roleIdentifier, this.lang);

            if (await this._createRoleGrant(draftRole, holderFields)) {
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
        const holderFields = getGrantHolderFields(holder);
        const holderName = getGrantHolderDisplayName(holder.subject);
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
            const oldRoleName = getRoleName(replacedGrant.roleDefinition, this.lang);
            const roleName = getRoleNameByIri(this.roles, pendingChange.roleIdentifier, this.lang);
            // Only the shareable state changed, so the role is updated instead of replaced.
            const keepsRole = pendingChange.roleIdentifier === replacedGrant.roleDefinition['@id'];
            const messageValues = {
                oldRoleName: oldRoleName,
                roleName: roleName,
                holderName: holderName,
            };

            if (!(await this._createRoleGrant(pendingChange, holderFields))) {
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
     * @param {GrantHolderFields} holderFields - Fields
     *     addressing the holder of the grant.
     * @returns {Promise<boolean>} Whether the grant was created.
     */
    async _createRoleGrant(grantSelection, holderFields) {
        try {
            const response = await this._apiPostResourceActionGrant(grantSelection, holderFields);
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
            const response = await this._apiDeleteResourceActionGrant(grantIdentifier);
            return response.ok;
        } catch (error) {
            console.error('Could not delete role grant', grantIdentifier, error);
            return false;
        }
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

    /**
     * Gets the title for the "Add Role" button based on the holder's state.
     * @param {string} holderKey - Key of the holder.
     * @returns {string} The title for the "Add Role" button.
     */
    _getAddRoleButtonTitle(holderKey) {
        if (this._hasIncompleteDraftRole(holderKey)) {
            return this._i18n.t('auth-manage-dialog.buttons.add-role-select-role-title');
        }
        if (!this._getAvailableRolesForHolder(holderKey).length) {
            return this._i18n.t('auth-manage-dialog.buttons.add-role-no-more-roles-title');
        }
        return '';
    }

    /**
     * Gets the title for the "Save Holder Roles" button based on the holder's state.
     * @param {string} holderKey - Key of the holder.
     * @returns {string} The title for the "Save Holder Roles" button.
     */
    _getSaveHolderRolesButtonTitle(holderKey) {
        if (this._hasIncompleteDraftRole(holderKey)) {
            return this._i18n.t(
                'auth-manage-dialog.buttons.save-holder-roles-button-select-role-title',
            );
        }
        if (this._isSaveDisabled(holderKey)) {
            return this._i18n.t(
                'auth-manage-dialog.buttons.save-holder-roles-button-disabled-title',
            );
        }
        return '';
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
        const holderName = getGrantHolderDisplayName(holder.subject);
        // A role assigned to another row of the same holder cannot be selected again.
        const roles = this._getAvailableRolesForHolder(holder.key, null, grant.identifier);
        // Keep the currently assigned role visible even if it is no longer available.
        if (!roles.some((role) => role['@id'] === currentRole['@id'])) {
            roles.push(currentRole);
        }
        roles.sort((left, right) =>
            this._collator.compare(getRoleName(left, this.lang), getRoleName(right, this.lang)),
        );
        // Changing the role deletes the grant and creates a new one, so it needs the same
        // permission as deleting it.
        const isChangeable = isGrantChangeable(grant);
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
                @change="${(event) => this.handleRoleSelectChange(event, holder.key, grant)}"
                aria-label="${this._i18n.t('auth-manage-dialog.role-select-label', {holder: holderName})}">
                ${repeat(
                    roles,
                    (role) => role['@id'],
                    (role) => html`
                        <option
                            value="${role['@id']}"
                            ?selected="${role['@id'] === selectedRoleIdentifier}">
                            ${getRoleName(role, this.lang)}
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
        const roleName = getRoleName(grant['roleDefinition'], this.lang);
        const holderName = getGrantHolderDisplayName(holder.subject);
        const deleteLabel = this._i18n.t('auth-manage-dialog.buttons.delete-role', {
            role: roleName,
            holder: holderName,
        });
        const pendingChange = this._getPendingGrantChange(holder.key, grant.identifier);
        // Changing the shareable state replaces the grant, so it needs the delete permission.
        const isChangeable = isGrantChangeable(grant);
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
                        @change="${(event) => this.handleGrantShareableChange(event, holder.key, grant)}" />
                </label>
                <dbp-icon-button
                    icon-name="trash"
                    class="delete-role-button"
                    ?disabled="${!isChangeable}"
                    @click="${() => this.handleDeleteRoleButtonClick(grant.identifier, roleName, holderName)}"
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
        const availableRoles = this._getAvailableRolesForHolder(holderKey, grant.clientIdentifier);
        availableRoles.sort((left, right) =>
            this._collator.compare(getRoleName(left, this.lang), getRoleName(right, this.lang)),
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
                    @change="${(event) => this.handleDraftRoleSelectChange(event, grant, holderKey)}">
                    <option value="">
                        ${this._i18n.t('auth-manage-dialog.role-select-placeholder')}
                    </option>
                    ${repeat(
                        availableRoles,
                        (role) => role['@id'],
                        (role) => html`
                            <option value="${role['@id']}">${getRoleName(role, this.lang)}</option>
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
                        @change="${(event) => this.handleDraftShareableChange(event, grant, holderKey)}" />
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
     * Renders the assigned role holders, loading indicator or empty state.
     * @returns {import('lit').TemplateResult} Holder list content or spinner or placeholder.
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

    renderGrantHolderHeading(holder) {
        const name = getGrantHolderDisplayName(holder['subject']);
        const email = holder['key'].startsWith(`${SUBJECT_TYPE_PERSON}:`)
            ? holder['subject'].localData?.email
            : null;
        return html`
            <div class="grant-holder-heading">
                <div class="grant-holder">
                    <div>
                        <dbp-icon
                            name="${GRANT_HOLDER_ICONS[holder.type]}"
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
        `;
    }

    renderGrantHolderRoleList(holder) {
        const grants = [...holder['grants']].sort((left, right) => {
            return (
                this._collator.compare(
                    getRoleName(left.roleDefinition, this.lang),
                    getRoleName(right.roleDefinition, this.lang),
                ) || compareIdentifiers(left.identifier, right.identifier)
            );
        });
        const draftGrants = this.draftRoleGrants.get(holder.key) ?? [];
        const name = getGrantHolderDisplayName(holder['subject']);

        return html`
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
        `;
    }

    /**
     * Renders the actions for a grant holder.
     * @param {GrantHolder|DraftGrantHolder} holder - The grant holder.
     * @returns {import('lit').TemplateResult} The actions for the grant holder.
     */
    renderGrantHolderActions(holder) {
        return html`
            <div class="add-role-button-container">
                <dbp-button
                    type="is-secondary"
                    class="add-role-button"
                    no-spinner-on-click
                    ?disabled="${this._isAddRoleDisabled(holder.key)}"
                    title="${this._getAddRoleButtonTitle(holder.key)}"
                    @click="${() => this.handleAddRoleButtonClick(holder.key)}">
                    <dbp-icon name="plus" aria-hidden="true"></dbp-icon>
                    ${this._i18n.t('auth-manage-dialog.buttons.add-role')}
                </dbp-button>
                <dbp-button
                    type="is-primary"
                    class="save-holder-roles-button"
                    no-spinner-on-click
                    ?disabled="${this._isSaveDisabled(holder.key)}"
                    title="${this._getSaveHolderRolesButtonTitle(holder.key)}"
                    @click="${() => this.handleSaveHolderRolesButtonClick(holder.key)}">
                    <dbp-icon name="save" aria-hidden="true"></dbp-icon>
                    ${this._i18n.t('auth-manage-dialog.buttons.save-holder-roles-button-label')}
                </dbp-button>
            </div>
        `;
    }

    /**
     * Renders a holder's name, (person email), assigned and unsaved roles and the action buttons.
     * @param {GrantHolder|DraftGrantHolder} holder - Holder with its compact subject and role grants.
     * @returns {import('lit').TemplateResult} Holder section.
     */
    renderGrantHolderSection(holder) {
        const name = getGrantHolderDisplayName(holder['subject']);

        return html`
            <section
                id="grant-holder-${holder.key}"
                class="grant-holder-section"
                aria-label="${this._i18n.t('auth-manage-dialog.grant-holder-aria-label', {name: name})}">
                ${this.renderGrantHolderHeading(holder)} ${this.renderGrantHolderRoleList(holder)}
                ${this.renderGrantHolderActions(holder)}
            </section>
        `;
    }

    /**
     * Renders the name of the form the managed resource belongs to. Every resource kind gets
     * its own message, so each translation can word and order it on its own.
     * @returns {import('lit').TemplateResult|string} Subtitle, or an empty string as long as
     *     there is no form to name.
     */
    renderModalSubtitle() {
        if (!this._resourceForm) {
            return '';
        }

        const formName = getFormName(this._resourceForm, this.lang);
        let subtitle;
        switch (this._getResourceKind()) {
            case RESOURCE_KIND_SUBMISSION:
                subtitle = this._i18n.t('auth-manage-dialog.modal-subtitle-submission', {
                    formName: formName,
                });
                break;
            case RESOURCE_KIND_SUBMISSIONS:
                subtitle = this._i18n.t('auth-manage-dialog.modal-subtitle-submissions', {
                    formName: formName,
                });
                break;
            default:
                subtitle = this._i18n.t('auth-manage-dialog.modal-subtitle-form', {
                    formName: formName,
                });
        }

        return html`
            <p class="modal-subtitle">${subtitle}</p>
        `;
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
                                          <h4 class="roles-name">
                                              ${getRoleName(role, this.lang)}
                                          </h4>
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
                <div slot="title">
                    <h2 class="modal-title" id="modal-title">${this.modalTitle}</h2>
                    ${this.renderModalSubtitle()}
                </div>
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
                                @change="${this.handleSubjectSelectChange}"></dbp-authorization-subject-select>
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
                                    @click="${this.handleShowRolesButtonClick}">
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
                        @click="${this.handleSaveAllRolesButtonClick}">
                        <dbp-icon name="save" aria-hidden="true"></dbp-icon>
                        ${i18n.t('auth-manage-dialog.buttons.save-roles-button-label')}
                    </dbp-button>
                </div>
            </dbp-modal>
        `;
    }
}
