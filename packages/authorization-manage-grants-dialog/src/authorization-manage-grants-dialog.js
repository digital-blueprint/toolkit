import {html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';
import {classMap} from 'lit/directives/class-map.js';
import {
    AuthMixin,
    Button,
    Icon,
    LangMixin,
    Modal,
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
    getGrantHolderParts,
} from './grant-holder.js';

const RESOURCE_TYPE_ITEM = 0;

export class AuthorizationManageGrantsDialog extends AuthMixin(
    LangMixin(ScopedElementsMixin(DBPLitElement), createInstance),
) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.modalTitle = '';
        /** @type {import('lit/directives/ref.js').Ref<Modal>} */
        this.modalRef = createRef();
        this.selectedSubject = null;
        this.resourceClassIdentifier = '';
        this.resourceIdentifier = '';
        this.resourceType = RESOURCE_TYPE_ITEM;
        this.roles = new Map();
        this.grantHolders = [];
        this.grantHoldersLoading = false;
        /** @type {AbortController|null} */
        this._resourceDataController = null;
        this.showRoles = false;
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
            showRoles: {type: Boolean, state: true},
        };
    }

    static get scopedElements() {
        return {
            'dbp-button': Button,
            'dbp-modal': Modal,
            'dbp-icon': Icon,
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
        this.close();
        this._resourceDataController = null;
        this.roles = new Map();
        this.grantHolders = [];
        this.grantHoldersLoading = false;
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
        this._resourceDataController?.abort();
        this.grantHoldersLoading = false;
        this.modalRef.value?.close();
        // The dialog starts over the next time it gets opened
        this.showRoles = false;
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
            sendNotification({
                summary: this._i18n.t('auth-manage-dialog.notifications.error-title'),
                body: this._i18n.t('auth-manage-dialog.notifications.could-not-get-roles'),
                type: 'danger',
                targetNotificationId: 'manage-grants-dialog-notification',
                timeout: 0,
            });
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

        this.grantHolders = [];

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
                const parts = getGrantHolderParts(grant);
                if (parts === null) {
                    continue;
                }
                if (!holders.has(parts.key)) {
                    holders.set(parts.key, {...parts, subject: null, grants: []});
                }
                holders.get(parts.key).grants.push(grant);
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
                                identifier: grant['role'].split('/').pop(),
                                roleNames: [],
                            },
                        })),
                    };
                });
                // Sort holders by type—people, user groups, then dynamic groups—and by display name within each type.
                const typeOrder = [
                    SUBJECT_TYPE_PERSON,
                    SUBJECT_TYPE_USER_GROUP,
                    SUBJECT_TYPE_DYNAMIC_USER_GROUP,
                ];
                const collator = new Intl.Collator(this.lang, {sensitivity: 'base', numeric: true});
                this.grantHolders = resolvedHolders.sort((left, right) => {
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
            }
        } catch (error) {
            if (!signal?.aborted) {
                console.error('Could not load role grant holders', error);
                sendNotification({
                    summary: this._i18n.t('auth-manage-dialog.notifications.error-title'),
                    body: this._i18n.t(
                        'auth-manage-dialog.notifications.could-not-get-role-grants',
                    ),
                    type: 'danger',
                    targetNotificationId: 'manage-grants-dialog-notification',
                    timeout: 0,
                });
            }
        } finally {
            if (!signal?.aborted) {
                this.grantHoldersLoading = false;
            }
            console.log('this.grantHolders', this.grantHolders);
        }
    }

    /**
     * Returns the holder's display name, falling back to its identifier.
     * @param {object} subject - Compact person or group subject.
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
     * Keeps only the subject fields needed to display and identify a grant holder.
     * @param {object} subject - Person or group API resource.
     * @param {string} type - Grant holder type.
     * @returns {object} Compact subject with optional person email.
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

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            getAuthorizationManageGrantsDialogCSS(),
        ];
    }

    render() {
        const i18n = this._i18n;

        return html`
            <dbp-modal
                ${ref(this.modalRef)}
                sticky-footer
                full-height-line
                class="modal--manage-grants ${classMap({'show-roles': this.showRoles})}"
                title="${this.modalTitle}">
                <div slot="header">
                    <dbp-notification
                        id="manage-grants-dialog-notification"
                        inline
                        lang="${this.lang}"></dbp-notification>
                </div>
                <div slot="content">
                    <div class="main-content">
                        <div class="add-resource-container">
                            <dbp-authorization-subject-select
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
                                    @click="${() => {
                                        console.log('Selected subject:', this.selectedSubject);
                                    }}">
                                    <dbp-icon name="plus"></dbp-icon>
                                    ${i18n.t('auth-manage-dialog.buttons.add-subject-button-label')}
                                </dbp-button>
                                <dbp-button
                                    id="show-roles-button"
                                    class="show-roles-button"
                                    no-spinner-on-click
                                    @click="${() => {
                                        this.showRoles = !this.showRoles;
                                    }}">
                                    ${
                                        this.showRoles
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
                        <div class="grants-list-container">
                            ${
                                this.grantHoldersLoading
                                    ? html`
                                          <dbp-spinner></dbp-spinner>
                                      `
                                    : this.grantHolders.length > 0
                                      ? html`
                                            <div class="grants-list"></div>
                                        `
                                      : html`
                                            <p class="grants-list-placeholder">
                                                ${i18n.t('auth-manage-dialog.grants-list-placeholder')}
                                            </p>
                                        `
                            }
                        </div>
                    </div>
                    ${this.showRoles ? this.renderRolesSidePanel() : ''}
                </div>
                <div slot="footer" class="footer-menu">
                    <dbp-button type="is-secondary" no-spinner-on-click @click="${this.close}">
                        ${i18n.t('auth-manage-dialog.buttons.close-button-label')}
                    </dbp-button>
                </div>
            </dbp-modal>
        `;
    }
}
