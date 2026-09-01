import {css, html} from 'lit';
import {createInstance} from './i18n.js';
import {ref, createRef} from 'lit/directives/ref.js';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {getGrantPermissionDialogCSS} from './styles.js';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {
    ScopedElementsMixin,
    Modal,
    Button,
    Icon,
    IconButton,
    LangMixin,
    sendNotification,
} from '@dbp-toolkit/common';
import {Notification} from '@dbp-toolkit/notification';
import {ResourceSelect} from '@dbp-toolkit/resource-select';
import {getDeletionConfirmation, handleDeletionConfirm, handleDeletionCancel} from './utils.js';
import {classMap} from 'lit/directives/class-map.js';
import {repeat} from 'lit/directives/repeat.js';

/**
 * @typedef {{
 *   action: string,
 *   identifier: string|null,
 *   editable?: boolean,
 *   inherited?: boolean,
 *   toSave?: boolean,
 *   desiredGranted?: boolean|null,
 *   mixed?: boolean,
 *   grantsByResource?: Map<string, {identifier: string, inherited: boolean}>
 * }} UserPermission
 * @typedef {{
 *   userIdentifier: string,
 *   userFullName: string|undefined,
 *   permissions: Map<string, UserPermission>,
 *   buttonState?: string
 * }} UserEntry
 * @typedef {Record<string, Record<string, string>>} AvailableAction
 */

export class GrantPermissionDialog extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.auth = {};
        this.entryPointUrl = '';
        this.modalTitle = '';
        /** @type {AvailableAction[]} */
        this.availableActions = [];
        /** @type {Map<string, UserEntry>} */
        this.userList = new Map();
        this.permissionRows = [];
        /** @type {Map<string, UserEntry>} */
        this.usersToAdd = new Map();
        this.resourceIdentifier = '';
        this.resourceIdentifiers = [];
        this.resourceClassIdentifier = '';
        /** @type {import('lit/directives/ref.js').Ref<Button>} */
        this.addPersonButtonRef = createRef();
        /** @type {import('lit/directives/ref.js').Ref<Button>} */
        this.savePermissionButtonRef = createRef();
        /** @type {import('lit/directives/ref.js').Ref<Modal>} */
        this.permissionModalRef = createRef();
        this.lastManageCheckbox = null;
        /** @type {string|null} */
        this.lastSavedManagerId = null;
        this.protectedManagerIds = new Set();
    }

    get #addPersonButton() {
        const button = this.addPersonButtonRef.value;
        if (!button) {
            throw new Error('Add person button is unavailable');
        }
        return button;
    }

    get #savePermissionButton() {
        const button = this.savePermissionButtonRef.value;
        if (!button) {
            throw new Error('Save permission button is unavailable');
        }
        return button;
    }

    get #permissionModal() {
        const modal = this.permissionModalRef.value;
        if (!modal) {
            throw new Error('Permission modal is unavailable');
        }
        return modal;
    }

    /**
     * @param {string} userId
     * @returns {UserEntry}
     */
    #getUser(userId) {
        const user = this.userList.get(userId);
        if (!user) {
            throw new Error(`Unknown user "${userId}"`);
        }
        return user;
    }

    /**
     * @param {string} userId
     * @returns {UserEntry}
     */
    #getQueuedUser(userId) {
        const user = this.usersToAdd.get(userId);
        if (!user) {
            throw new Error(`User "${userId}" is not queued for editing`);
        }
        return user;
    }

    static get properties() {
        return {
            ...super.properties,
            auth: {type: Object},
            modalTitle: {type: String, attribute: 'modal-title'},
            availableActions: {type: Array},
            userList: {type: Map},
            usersToAdd: {type: Map},
            hasUsersToAdd: {type: Boolean},
            permissionRows: {type: Array},
            resourceIdentifier: {type: String, attribute: 'resource-identifier'},
            resourceIdentifiers: {type: Array, attribute: false},
            resourceClassIdentifier: {type: String, attribute: 'resource-class-identifier'},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            savePermissionButtonIsDisabled: {type: Boolean, attribute: false},
            lastManageCheckbox: {type: Object, attribute: false},
            lastSavedManagerId: {type: String, attribute: false},
        };
    }

    getResourceIdentifiers() {
        const identifiers =
            Array.isArray(this.resourceIdentifiers) && this.resourceIdentifiers.length > 0
                ? this.resourceIdentifiers
                : [this.resourceIdentifier];
        return [...new Set(identifiers.map((identifier) => identifier?.trim()).filter(Boolean))];
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-button': Button,
            'dbp-icon-button': IconButton,
            'dbp-resource-select': ResourceSelect,
            'dbp-modal': Modal,
            'dbp-notification': Notification,
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('dbp-modal-closed', this.modalClosedHandler.bind(this));
    }

    modalClosedHandler(event) {
        this.closeModal(event);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this.removeEventListener('dbp-modal-closed', this.modalClosedHandler);
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang': {
                    // Set default title if none provided via attribute
                    if (!this.modalTitle || !this.hasAttribute('modal-title')) {
                        this.modalTitle = this._i18n.t('grant-permission-dialog.modal-title');
                    }
                    break;
                }

                case 'userList': {
                    console.log(`this.userList`, this.userList);
                    this.checkSavedManagerCount();
                    break;
                }
                case 'usersToAdd': {
                    console.log(`this.usersToAdd`, this.usersToAdd);
                    break;
                }
            }
        });
    }

    /**
     * Set lastSavedManagerId to prevent deleting the last manager
     */
    checkSavedManagerCount() {
        const protectedManagerIds = new Set();
        for (const resourceIdentifier of this.getResourceIdentifiers()) {
            const managerIds = [];
            for (const [userId, user] of this.userList) {
                const permission = user?.permissions?.get('manage');
                if (
                    permission?.grantsByResource?.has(resourceIdentifier) ||
                    (this.getResourceIdentifiers().length === 1 && permission?.identifier)
                ) {
                    managerIds.push(userId);
                }
            }
            if (managerIds.length === 1) {
                protectedManagerIds.add(managerIds[0]);
            }
        }
        this.protectedManagerIds = protectedManagerIds;
        this.lastSavedManagerId =
            protectedManagerIds.size === 1 ? [...protectedManagerIds][0] : null;
    }

    /**
     * Disable the last checked "manage" checkbox to prevent unchecking it
     */
    disableLastManageCheckbox() {
        const manageCheckboxes = this._a('.permission-checkbox[name="manage"]');
        const checkedManageCheckboxes = [...manageCheckboxes].filter((checkbox) => {
            return checkbox.checked === true;
        });

        if (checkedManageCheckboxes.length === 1) {
            this.lastManageCheckbox = checkedManageCheckboxes[0];
            this.lastManageCheckbox.disabled = true;
        } else {
            // Enable the previously disabled checkbox if it exists and is in edit-mode
            if (
                this.lastManageCheckbox &&
                this.lastManageCheckbox instanceof HTMLInputElement &&
                this.lastManageCheckbox.classList.contains('edit-mode')
            ) {
                this.lastManageCheckbox.disabled = false;
            }
            // Always clear the reference when there are multiple (or zero) checked
            this.lastManageCheckbox = null;
        }
    }

    /**
     * Returns if a person is set in or not
     * @returns {boolean} true or false
     */
    isLoggedIn() {
        return this.auth && this.auth.token;
    }

    /**
     * Gets the actions for our resource class
     * @returns {Promise<Response>} response
     */
    async apiGetAvailableActions() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        };
        return await fetch(
            this.entryPointUrl +
                `/authorization/available-resource-class-actions/${this.resourceClassIdentifier}?perPage=9999`,
            options,
        );
    }

    async setAvailableActions() {
        this.availableActions = [];
        let showErrorNotification = false;
        const i18n = this._i18n;
        try {
            const response = await this.apiGetAvailableActions();
            if (response.status !== 200) {
                showErrorNotification = true;
            } else {
                const responseBody = await response.json();
                if (responseBody === undefined || responseBody === null) {
                    showErrorNotification = true;
                } else {
                    this.availableActions = Object.keys(responseBody.itemActions).map(
                        (actionKey) => {
                            return {
                                [actionKey]: {
                                    [this.lang]:
                                        responseBody.itemActions[actionKey][this.lang] ?? actionKey,
                                },
                            };
                        },
                    );
                }
            }
        } catch {
            showErrorNotification = true;
        }

        if (showErrorNotification) {
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t(
                    'grant-permission-dialog.notifications.set-available-actions-error-text',
                ),
                type: 'danger',
                targetNotificationId: 'permission-modal-notification',
                timeout: 5,
            });
        }
    }

    /**
     * Gets the list of Resource Action Grants
     * @returns {Promise<Response>} response
     */
    async apiGetResourceActionGrants(resourceIdentifier = this.resourceIdentifier) {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        };
        return await fetch(
            this.entryPointUrl +
                `/authorization/resource-action-grants?resourceClass=${encodeURIComponent(
                    this.resourceClassIdentifier,
                )}&resourceIdentifier=${encodeURIComponent(resourceIdentifier)}&page=1&perPage=9999`,
            options,
        );
    }

    async apiGetUserDetails(userIdentifier) {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        };
        return await fetch(this.entryPointUrl + `/base/people/${userIdentifier}`, options);
    }

    /**
     * Delete user's Resource Action Grant
     * @param {string} grantIdentifier - Authorization Resource Action Grant identifier
     * @returns {Promise<Response>} response
     */
    async apiDeleteResourceActionGrant(grantIdentifier) {
        if (!grantIdentifier) {
            throw new Error('Grant identifier is required');
        }
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        };
        return await fetch(
            this.entryPointUrl + `/authorization/resource-action-grants/${grantIdentifier}`,
            options,
        );
    }

    /**
     * Save user's Resource Action Grant
     * @param {string} action
     * @param {string} userIdentifier
     * @returns {Promise<Response>} response
     */
    async apiPostResourceActionGrant(
        action,
        userIdentifier,
        resourceIdentifier = this.resourceIdentifier,
    ) {
        /* {
            "resourceIdentifier": "184c7f86-73b4-4ee7-9f93-09af7d7ff4fd",
            "resourceClass": "DbpRelayFormalizeForm",
            "action": "manage",
            "userIdentifier": "811EC3ACC0ADCA70"
        } */
        const body = {
            resourceIdentifier,
            resourceClass: this.resourceClassIdentifier,
            action: action,
            userIdentifier: userIdentifier,
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
            body: JSON.stringify(body),
        };
        return await fetch(this.entryPointUrl + `/authorization/resource-action-grants`, options);
    }

    async deleteUsersAllGrants(userId) {
        const i18n = this._i18n;

        if (this.protectedManagerIds.has(userId)) {
            throw new Error('Cannot delete the last manager');
        }

        const userToDelete = this.#getUser(userId);
        const grantsToDelete = [];

        // Collect grants to delete
        userToDelete.permissions.forEach((grant) => {
            if (grant.grantsByResource instanceof Map) {
                grant.grantsByResource.forEach((resourceGrant) => {
                    if (!resourceGrant.inherited) {
                        grantsToDelete.push(resourceGrant);
                    }
                });
            } else if (grant.identifier && !grant.inherited) {
                grantsToDelete.push(grant);
            }
        });

        try {
            for (const grant of grantsToDelete) {
                const deleteResponse = await this.apiDeleteResourceActionGrant(grant.identifier);
                if (deleteResponse.status !== 204) {
                    throw new Error('Failed to delete grant');
                }
            }
            // @TODO handle multiple errors
        } catch (e) {
            console.log('Error deleting grant', e);
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                // Add username and grant name here
                body: i18n.t('grant-permission-dialog.notifications.could-not-delete-grant'),
                type: 'danger',
                targetNotificationId: 'permission-modal-notification',
                timeout: 0,
            });
            throw e;
        }
    }

    async deleteUser(userId) {
        const i18n = this._i18n;
        try {
            await this.deleteUsersAllGrants(userId);

            // Set delete row animation
            const rowToAnimate = this._(`.user-row[data-user-id="${userId}"]`);
            rowToAnimate.classList.add('delete-animation');
            // Wait for the animation to complete
            // Create a promise that resolves when the animation ends
            const animationComplete = new Promise((resolve) => {
                rowToAnimate.addEventListener('transitionend', resolve, {once: true});
            });
            // Wait for animation to complete before updating the Map
            await animationComplete;

            this.removeUserFromQueue(userId);
            const deleted = this.removeUserFromList(userId);

            if (deleted) {
                rowToAnimate.classList.remove('delete-animation');
                this.requestUpdate();
            }
        } catch (e) {
            console.log('delete user error', e);
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.notifications.could-not-delete-user'),
                type: 'danger',
                targetNotificationId: 'permission-modal-notification',
                timeout: 0,
            });
        }
    }

    async getUserFullName(userIdentifier) {
        const i18n = this._i18n;
        try {
            const response = await this.apiGetUserDetails(userIdentifier);
            let userDetailsResponse = await response.json();
            if (userDetailsResponse !== undefined && userDetailsResponse.status !== 403) {
                return `${userDetailsResponse['givenName']} ${userDetailsResponse['familyName']}`;
            } else {
                if (userDetailsResponse.status === 500) {
                    sendNotification({
                        summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                        body: i18n.t(
                            'grant-permission-dialog.notifications.could-not-fetch-user-details',
                        ),
                        type: 'danger',
                        targetNotificationId: 'permission-modal-notification',
                        timeout: 0,
                    });
                } else if (userDetailsResponse.status === 403) {
                    sendNotification({
                        summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                        body: i18n.t('grant-permission-dialog.notifications.error-not-authorized'),
                        targetNotificationId: 'permission-modal-notification',
                        type: 'danger',
                        timeout: 0,
                    });
                }
            }
        } catch (error) {
            console.log('getUserFullName failed', error);
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.notifications.failed-get-user-details'),
                type: 'danger',
                targetNotificationId: 'permission-modal-notification',
                timeout: 0,
            });
        }
    }

    /**
     * Retrieves the full name of a user by their user ID
     * @param {string} userId - The unique identifier of the user
     * @returns {string|undefined} The user's full name or undefined if not found
     */
    lookupUserFullName(userId) {
        if (!userId) return undefined;
        return this.userList.get(userId)?.userFullName;
    }

    _handleUserEditButton(userId) {
        this.setButtonState(userId, 'save');

        this.addUserToQueue(userId);

        this.enableUsersAllCheckboxes(userId);
    }

    async handleUserSaveButton(userId) {
        try {
            await this.saveUserPermissions(userId);
        } catch (error) {
            console.log(error);
        } finally {
            if (this.userList.has(userId)) {
                this.setButtonState(userId, 'edit');
                this.checkSavedManagerCount();

                // Remove edit styles & disable checkboxes
                this._a(`[data-user-id="${userId}"]`).forEach((checkbox) => {
                    const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
                    checkboxElem.classList.remove('changed');
                    checkboxElem.removeAttribute('data-changed');
                });
                this.disableUsersAllCheckboxes(userId);
            }
        }
    }

    async handleUserDeleteButton(userId) {
        const i18n = this._i18n;
        const userFullName = this.lookupUserFullName(userId);
        await this.deleteUser(userId);

        sendNotification({
            summary: i18n.t('grant-permission-dialog.notifications.success-title'),
            body: i18n.t('grant-permission-dialog.notifications.user-successfully-deleted', {
                userFullName: userFullName,
            }),
            type: 'info',
            targetNotificationId: 'permission-modal-notification',
            timeout: 5,
        });
    }

    /**
     * Get a list of users and granted permissions
     * @returns {Promise<void>}
     */
    async setListOfUsersAndPermissions() {
        const i18n = this._i18n;

        try {
            const resourceIdentifiers = this.getResourceIdentifiers();
            if (resourceIdentifiers.length === 0) {
                throw new Error('No resource identifier was provided');
            }

            this.userList = new Map();
            const newUserList = new Map();
            for (const resourceIdentifier of resourceIdentifiers) {
                const response = await this.apiGetResourceActionGrants(resourceIdentifier);
                if (response.status === 403) {
                    sendNotification({
                        summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                        body: i18n.t('grant-permission-dialog.notifications.error-not-authorized'),
                        targetNotificationId: 'permission-modal-notification',
                        type: 'danger',
                        timeout: 0,
                    });
                    return;
                }
                if (!response.ok) {
                    throw new Error(`Failed to load grants for resource ${resourceIdentifier}`);
                }

                const responseBody = await response.json();
                for (const grant of responseBody?.['hydra:member'] ?? []) {
                    if (grant.userIdentifier) {
                        // Don't add inherited item-actions that are not available actions
                        // We can't set such permissions
                        const isAnAvailableAction = this.availableActions.find((action) => {
                            return Object.keys(action)[0] === grant.action;
                        });
                        if (!isAnAvailableAction) {
                            continue;
                        }

                        const userId = grant.userIdentifier;
                        const isInherited = grant.grantedActions?.length === 0;

                        let existingUser = newUserList.get(userId);
                        if (!existingUser) {
                            const userFullName = await this.getUserFullName(userId);
                            existingUser = {
                                userIdentifier: userId,
                                userFullName: userFullName,
                                permissions: this.createEmptyUserPermission(),
                            };
                            newUserList.set(userId, existingUser);
                        }

                        const permission = existingUser.permissions.get(grant.action);
                        permission.grantsByResource.set(resourceIdentifier, {
                            identifier: grant.identifier,
                            inherited: isInherited,
                        });
                    }
                }
            }

            for (const user of newUserList.values()) {
                for (const permission of user.permissions.values()) {
                    const grants = [...permission.grantsByResource.values()];
                    permission.identifier =
                        grants.length === resourceIdentifiers.length ? grants[0]?.identifier : null;
                    permission.inherited =
                        grants.length === resourceIdentifiers.length &&
                        grants.every((grant) => grant.inherited);
                    permission.mixed =
                        grants.length > 0 && grants.length < resourceIdentifiers.length;
                }
            }
            this.userList = newUserList;
            this.setAllButtonState('edit');
            this.checkSavedManagerCount();
        } catch (e) {
            console.log('setListOfUsersAndPermissions', e);
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.notifications.unknown-error'),
                targetNotificationId: 'permission-modal-notification',
                type: 'danger',
                timeout: 0,
            });
        }
    }

    getPersonSearchQueryParameters(select, searchTerm) {
        return {
            search: searchTerm.trim(),
            sort: 'familyName',
        };
    }

    formatPerson(select, person) {
        let text = person['givenName'] ?? '';
        if (person['familyName']) {
            text += ` ${person['familyName']}`;
        }

        return text;
    }

    renderUserPermissionRow() {
        if (!this.userList) {
            return;
        }
        const i18n = this._i18n;

        return html`
            ${repeat(
                Array.from(this.userList),
                ([userId]) => userId, // Key function - uses userId as unique identifier
                ([userId, user]) => html`
                    <div
                        class="user-row ${classMap({'edit-mode': this.usersToAdd.has(userId)})}"
                        data-user-id="${userId}">
                        <div class="person-select-container">
                            ${
                                user.userFullName
                                    ? html`
                                          <span class="user-name">${user.userFullName}</span>
                                      `
                                    : html`
                                          <dbp-resource-select
                                              id="permission-person-select"
                                              subscribe="auth"
                                              lang="${this.lang}"
                                              resource-path="/base/people"
                                              fetch-mode="search"
                                              .getSearchQueryParameters="${
                                                  this.getPersonSearchQueryParameters
                                              }"
                                              .formatResource="${this.formatPerson}"
                                              @change="${(event) => {
                                                  void this.handlePersonSelected(event);
                                              }}"
                                              entry-point-url="${
                                                  this.entryPointUrl
                                              }"></dbp-resource-select>
                                      `
                            }
                        </div>
                        ${user.userFullName ? this.renderPermissionCheckboxes(user) : ''}
                        ${
                            user.userFullName
                                ? html`
                                      <div class="action-buttons">
                                          ${
                                              user.buttonState === 'edit'
                                                  ? html`
                                                        <dbp-button
                                                            type="is-secondary"
                                                            id="user-edit-button-${userId}"
                                                            no-spinner-on-click
                                                            @click="${() => {
                                                                this._handleUserEditButton(userId);
                                                            }}">
                                                            <dbp-icon name="pencil"></dbp-icon>
                                                            ${i18n.t(
                                                                'grant-permission-dialog.buttons.edit-text',
                                                            )}
                                                        </dbp-button>
                                                    `
                                                  : ''
                                          }
                                          ${
                                              user.buttonState === 'save'
                                                  ? html`
                                                        <dbp-button
                                                            type="is-primary"
                                                            id="user-save-button-${userId}"
                                                            no-spinner-on-click
                                                            @click="${() => {
                                                                void this.handleUserSaveButton(
                                                                    userId,
                                                                );
                                                            }}">
                                                            <dbp-icon name="save"></dbp-icon>
                                                            ${i18n.t(
                                                                'grant-permission-dialog.buttons.save-text',
                                                            )}
                                                        </dbp-button>
                                                    `
                                                  : ''
                                          }
                                          <dbp-button
                                              type="is-secondary"
                                              id="user-delete-button-${userId}"
                                              no-spinner-on-click
                                              ?disabled=${this.protectedManagerIds.has(userId)}
                                              @click="${async () => {
                                                  const confirmed =
                                                      await getDeletionConfirmation(this);
                                                  if (!confirmed) return;

                                                  const userFullName =
                                                      this.lookupUserFullName(userId);
                                                  await this.deleteUser(userId);

                                                  sendNotification({
                                                      summary: i18n.t(
                                                          'grant-permission-dialog.notifications.success-title',
                                                      ),
                                                      body: i18n.t(
                                                          'grant-permission-dialog.notifications.user-successfully-deleted',
                                                          {
                                                              userFullName: userFullName,
                                                          },
                                                      ),
                                                      type: 'info',
                                                      targetNotificationId:
                                                          'permission-modal-notification',
                                                      timeout: 5,
                                                  });
                                              }}">
                                              <dbp-icon name="trash"></dbp-icon>
                                              ${i18n.t('grant-permission-dialog.buttons.delete-text')}
                                          </dbp-button>
                                      </div>
                                  `
                                : ''
                        }
                    </div>
                `,
            )}
        `;
    }

    /**
     * @param {UserEntry} user
     */
    renderPermissionCheckboxes(user) {
        const i18n = this._i18n;
        if (!this.availableActions) {
            return;
        }
        return html`
            <div class="permission-group" role="group" aria-labelledby="permissions-group-label">
                <h3 id="permissions-group-label" class="visually-hidden">
                    ${i18n.t('grant-permission-dialog.available-permissions')}
                </h3>

                ${this.availableActions.map((action) => {
                    const actionValue = Object.keys(action)[0];
                    const actionName = action[actionValue][this.lang];

                    let hasThisPermission = false;
                    let editable = false;
                    let checkboxTitle = `${actionName}`;
                    const userPermission = user.permissions.get(actionValue);
                    // The permission exists if it has an identifier
                    hasThisPermission =
                        userPermission?.desiredGranted ?? Boolean(userPermission?.identifier);

                    // Allow editing of newly added permissions
                    if (userPermission?.editable) {
                        editable = true;
                    }

                    if (userPermission?.inherited) {
                        editable = false;
                        checkboxTitle = i18n.t(
                            'grant-permission-dialog.permissions.inherited-permission-title',
                        );
                    }

                    return html`
                        <div
                            class="checkbox-container ${classMap({
                                'inherited-mode': Boolean(userPermission?.inherited),
                            })}">
                            <label
                                for="${actionValue}-${user.userIdentifier}"
                                class="visually-hidden">
                                ${actionName}
                            </label>
                            <input
                                id="${actionValue}-${user.userIdentifier}"
                                name="${actionValue}"
                                class="permission-checkbox ${classMap({
                                    'edit-mode': this.usersToAdd.has(user.userIdentifier),
                                    'inherited-mode': Boolean(userPermission?.inherited),
                                })}"
                                title="${checkboxTitle}"
                                data-user-id="${user.userIdentifier}"
                                type="checkbox"
                                @input="${this.handleCheckbox}"
                                ?disabled="${!editable}"
                                .indeterminate="${
                                    Boolean(userPermission?.mixed) &&
                                    userPermission?.desiredGranted === null
                                }"
                                ?checked="${hasThisPermission}" />
                        </div>
                    `;
                })}
            </div>
        `;
    }

    createEmptyUserPermission(editable = false) {
        /** @type {Map<string, UserPermission>} */
        const userPermissions = new Map();
        if (!Array.isArray(this.availableActions) || this.availableActions.length < 1) {
            return userPermissions;
        }

        this.availableActions.forEach((action) => {
            const actionValue = Object.keys(action)[0];
            const emptyPermission = {
                action: actionValue,
                identifier: null,
                editable: editable,
                desiredGranted: null,
                grantsByResource: new Map(),
            };
            userPermissions.set(actionValue, emptyPermission);
        });
        return userPermissions;
    }

    async handlePersonSelected(event) {
        const i18n = this._i18n;

        try {
            if (!event.detail?.value) {
                return;
            }

            const newUser = event.detail.object;

            if (!newUser) {
                throw new Error('No user object returned');
            }

            // Check if user is already in the list
            if (newUser && this.userList.has(newUser.identifier)) {
                sendNotification({
                    summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                    body: i18n.t('grant-permission-dialog.notifications.user-already-added'),
                    targetNotificationId: 'permission-modal-notification',
                    type: 'danger',
                    timeout: 0,
                });
                return;
            }

            // Set new user data
            const userToAdd = {
                userIdentifier: newUser['identifier'],
                userFullName: `${newUser['givenName']} ${newUser['familyName']}`,
                permissions: this.createEmptyUserPermission(true),
            };

            this.addUserToQueue(userToAdd.userIdentifier, userToAdd);

            // Remove person select
            this.userList.delete('emptyPerson');
            // Update person in this.userList
            this.addUserToList(userToAdd.userIdentifier, userToAdd);
            // Toggle edit button to save button
            this.setButtonState(userToAdd.userIdentifier, 'edit');

            await this.updateComplete;
            this._handleUserEditButton(userToAdd.userIdentifier);
            this.#addPersonButton.stop();
        } catch (error) {
            console.log('Failed to get user object', error);
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.notifications.failed-to-get-user-details'),
                targetNotificationId: 'permission-modal-notification',
                type: 'danger',
                timeout: 0,
            });
        }
    }

    handleCheckbox(event) {
        const checkbox = event.target;
        checkbox.classList.add('changed');
        checkbox.setAttribute('data-changed', true);

        // Prevent unchecking last manager
        this.disableLastManageCheckbox();
        this.checkSavedManagerCount();

        const userIdentifier = checkbox.getAttribute('data-user-id');
        const permissionName = checkbox.getAttribute('name');

        // Get users to add
        const userToAdd = this.#getQueuedUser(userIdentifier);
        // Get clicked permission
        const permission = userToAdd.permissions.get(permissionName);
        if (!permission) {
            throw new Error(
                `Permission "${permissionName}" does not exist for user "${userIdentifier}"`,
            );
        }
        // Set permission to be saved
        permission.desiredGranted = checkbox.checked;
        permission.toSave = true;
    }

    enableUsersAllCheckboxes(userId) {
        const user = this.#getUser(userId);
        user.permissions.forEach((permission) => {
            if (
                (permission.action === 'manage' &&
                    permission.identifier &&
                    this.protectedManagerIds.has(userId)) ||
                permission.inherited
            ) {
                permission.editable = false;
            } else {
                permission.editable = true;
            }
        });
    }

    disableUsersAllCheckboxes(userId) {
        const user = this.#getUser(userId);
        user.permissions.forEach((permission) => {
            permission.editable = false;
        });
    }

    disableAllCheckboxes() {
        this.userList.forEach((user) => {
            user.permissions.forEach((permission) => {
                permission.editable = false;
            });
        });
    }

    renderPermissionLabels() {
        if (!this.availableActions || this.userList.size < 1) {
            return;
        }

        return html`
            ${this.availableActions.map((action) => {
                const actionValue = Object.keys(action)[0];
                const actionName = action[actionValue][this.lang] ?? actionValue;

                return html`
                    <div class="checkbox-label-container">
                        <span>${actionName}</span>
                    </div>
                `;
            })}
        `;
    }

    async open() {
        const i18n = this._i18n;

        if (!this.isLoggedIn()) {
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.need-login-warning-text'),
                type: 'danger',
                timeout: 0,
            });
        } else {
            await this.setAvailableActions();
            await this.setListOfUsersAndPermissions();
            await this.updateComplete;
            this.#permissionModal.open();

            const modalContent = this._('.content-inner');
            if (!modalContent) return;

            const resizeObserver = new ResizeObserver((entries) => {
                const personSelect = this._('.person-select-container');
                const permissionItems = /** @type {HTMLElement[]} */ (
                    Array.from(
                        this._a('.user-row:first-child .permission-group .checkbox-container'),
                    )
                );
                const actionButtons = this._('.action-buttons');

                const userRow = this._('.user-row:first-child');
                const permissionGroup = this._('.user-row:first-child .permission-group');
                if (
                    !userRow ||
                    !permissionGroup ||
                    !personSelect ||
                    !actionButtons ||
                    permissionItems.length === 0
                ) {
                    return;
                }

                const userRowStyle = window.getComputedStyle(userRow);
                const userRowPadding =
                    parseInt(userRowStyle.paddingLeft) + parseInt(userRowStyle.paddingRight);

                const permissionGroupStyle = window.getComputedStyle(permissionGroup);
                const permissionGroupGap = parseInt(permissionGroupStyle.gap);

                const modalWidth = modalContent.clientWidth;
                const permissionCount = permissionItems.length;
                const permissionWidth =
                    permissionItems[0].clientWidth * permissionCount +
                    permissionGroupGap * permissionCount -
                    1;
                const rowWidth =
                    personSelect.clientWidth +
                    (permissionItems[0].clientWidth * permissionCount +
                        permissionGroupGap * permissionCount -
                        1) +
                    actionButtons.clientWidth;

                if (modalWidth < permissionWidth + userRowPadding) {
                    modalContent.classList.add('mobile');
                } else {
                    modalContent.classList.remove('mobile');
                }

                if (modalWidth < rowWidth + userRowPadding) {
                    modalContent.classList.add('collapsed');
                } else {
                    modalContent.classList.remove('collapsed');
                }
            });

            resizeObserver.observe(modalContent);
        }
    }

    closeModal(event) {
        /* Reset state */
        if (event && event.detail && event.detail.id === 'grant-permission-modal') {
            // Remove person select
            this.userList = new Map();

            // Reset add person button state
            this.#addPersonButton.stop();
            this.#permissionModal.close();
        }
    }

    handleAddNewPerson() {
        this.#addPersonButton.start();
        this.addUserToList('emptyPerson', {
            userIdentifier: 'emptyPerson',
            userFullName: undefined,
            permissions: new Map(),
        });
    }

    /**
     * Add user to the usersToAdd queue
     * Triggers a re-render
     * @param {string} userId
     * @param {UserEntry|null} [userToAdd]
     */
    addUserToQueue(userId, userToAdd = null) {
        const _userToAdd = userToAdd === null ? this.#getUser(userId) : userToAdd;
        this.usersToAdd = new Map(this.usersToAdd).set(userId, _userToAdd);
    }

    /**
     * Remove user from the usersToAdd queue
     * Triggers a re-render
     * @param {string} userId
     */
    removeUserFromQueue(userId) {
        const newUsersToAdd = new Map(this.usersToAdd);
        newUsersToAdd.delete(userId);
        this.usersToAdd = newUsersToAdd;
    }

    /**
     * Add user to the userList
     * Triggers a re-render
     * @param {string} userId
     * @param {UserEntry} userToAdd
     */
    addUserToList(userId, userToAdd) {
        this.userList = new Map(this.userList).set(userId, userToAdd);
    }

    /**
     * Remove user from the userList
     * Triggers a re-render
     * @param {string} userId
     */
    removeUserFromList(userId) {
        const newUserList = new Map(this.userList);
        const deleted = newUserList.delete(userId);
        if (deleted) {
            this.userList = newUserList;
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     * @param {string} userId - The user ID
     * @param {string} state  - edit | save | prepare-delete | delete
     */
    setButtonState(userId, state) {
        const user = this.#getUser(userId);
        this.userList.set(userId, {
            ...user,
            buttonState: state,
        });
        this.requestUpdate('userList');
    }

    setAllButtonState(state) {
        Array.from(this.userList).forEach(([userId, user]) => {
            this.setButtonState(userId, state);
        });
    }

    /**
     * Saves user permissions for either a single user or all users in usersToAdd
     * @param {string} [userId] - Optional user ID. If not provided, saves all pending users
     * @returns {Promise<void>}
     */
    async saveUserPermissions(userId) {
        const i18n = this._i18n;

        // If no users to save, show message and return
        if (this.usersToAdd.size === 0) {
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.info-title'),
                body: i18n.t('grant-permission-dialog.notifications.there-is-no-user-to-save'),
                type: 'info',
                targetNotificationId: 'permission-modal-notification',
                timeout: 5,
            });
            return;
        }

        try {
            let errorCount = 0;
            let successCount = 0;
            const usersToProcess = userId
                ? new Map([[userId, this.#getQueuedUser(userId)]])
                : this.usersToAdd;
            const resourceIdentifiers = this.getResourceIdentifiers();
            const grantsToPost = [];
            const grantsToDelete = [];
            let managerRemovalBlocked = false;

            for (const [userIdentifier, userToAdd] of usersToProcess) {
                userToAdd.permissions.forEach((permission) => {
                    if (!permission.toSave) return;

                    if (permission.desiredGranted) {
                        for (const resourceIdentifier of resourceIdentifiers) {
                            if (!permission.grantsByResource?.has(resourceIdentifier)) {
                                grantsToPost.push({
                                    action: permission.action,
                                    userIdentifier,
                                    resourceIdentifier,
                                });
                            }
                        }
                    } else if (
                        permission.action === 'manage' &&
                        this.protectedManagerIds.has(userIdentifier)
                    ) {
                        managerRemovalBlocked = true;
                    } else if (permission.grantsByResource instanceof Map) {
                        permission.grantsByResource.forEach((grant) => {
                            if (!grant.inherited) {
                                grantsToDelete.push({identifier: grant.identifier});
                            }
                        });
                    } else if (permission.identifier && !permission.inherited) {
                        grantsToDelete.push({identifier: permission.identifier});
                    }
                });
            }

            if (managerRemovalBlocked) {
                sendNotification({
                    summary: 'Warning',
                    body: i18n.t(
                        'grant-permission-dialog.notifications.cant-remove-last-manager-warning',
                    ),
                    type: 'warning',
                    targetNotificationId: 'permission-modal-notification',
                    timeout: 5,
                });
            }

            // Create replacement grants before deleting existing grants.
            for (const grant of grantsToPost) {
                const response = await this.apiPostResourceActionGrant(
                    grant.action,
                    grant.userIdentifier,
                    grant.resourceIdentifier,
                );
                if (response.status === 201) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            for (const grant of grantsToDelete) {
                const response = await this.apiDeleteResourceActionGrant(grant.identifier);
                if (response.status === 204) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            if (grantsToPost.length === 0 && grantsToDelete.length === 0) {
                sendNotification({
                    summary: i18n.t('grant-permission-dialog.notifications.info-title'),
                    body: i18n.t('grant-permission-dialog.notifications.there-is-nothing-to-save', {
                        userFullName: userId ? this.#getQueuedUser(userId).userFullName : '',
                    }),
                    type: 'info',
                    targetNotificationId: 'permission-modal-notification',
                    timeout: 5,
                });
            }

            this.usersToAdd = new Map();
            await this.setListOfUsersAndPermissions();

            // Stop the save button spinner and show success message
            this.#savePermissionButton.stop();

            if (successCount > 0) {
                sendNotification({
                    summary: i18n.t('grant-permission-dialog.notifications.success-title'),
                    body: i18n.t(
                        'grant-permission-dialog.notifications.permissions-saved-successfully',
                        {n: successCount},
                    ),
                    type: 'success',
                    targetNotificationId: 'permission-modal-notification',
                    timeout: 5,
                });
            }
            if (errorCount > 0) {
                sendNotification({
                    summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                    body: i18n.t('grant-permission-dialog.notifications.save-permissions-error', {
                        n: errorCount,
                    }),
                    type: 'danger',
                    targetNotificationId: 'permission-modal-notification',
                    timeout: 0,
                });
            }
        } catch (e) {
            console.log('Save user permissions error:', e);
            sendNotification({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t(
                    'grant-permission-dialog.notifications.save-permissions-unexpected-error',
                ),
                type: 'danger',
                targetNotificationId: 'permission-modal-notification',
                timeout: 0,
            });
            return;
        }
    }

    static get styles() {
        return [
            commonStyles.getGeneralCSS(),
            commonStyles.getButtonCSS(),
            commonStyles.getModalDialogCSS(),

            getGrantPermissionDialogCSS(),
            // language=css
            css``,
        ];
    }

    render() {
        const i18n = this._i18n;

        console.log('*** MAIN RENDER ***');

        return html`
            <dbp-modal
                id="permission-modal"
                sticky-footer
                ${ref(this.permissionModalRef)}
                class="modal modal--permissions"
                modal-id="grant-permission-modal"
                subscribe="lang">
                <div slot="title">
                    <h2 class="modal-title">${this.modalTitle}</h2>
                </div>
                <div slot="header" class="header">
                    <div class="modal-notification">
                        <dbp-notification
                            id="permission-modal-notification"
                            inline
                            lang="${this.lang}"></dbp-notification>
                    </div>
                </div>
                <div slot="content">
                    <div class="content-container">
                        <div class="content-inner">
                            <div
                                class="header-row ${classMap({
                                    hidden: this.userList.size < 1,
                                })}">
                                <div class="person-select-header"></div>
                                <div class="permissions-header">
                                    ${this.renderPermissionLabels()}
                                </div>
                            </div>
                            <!-- END .header-row -->

                            <div class="body-container">
                                <div class="button-container">
                                    <dbp-button
                                        type="is-secondary"
                                        ${ref(this.addPersonButtonRef)}
                                        id="add-new-person-button"
                                        @click="${() => {
                                            this.handleAddNewPerson();
                                        }}">
                                        <dbp-icon name="plus"></dbp-icon>
                                        <span>
                                            ${i18n.t(
                                                'grant-permission-dialog.buttons.add-person-text',
                                            )}
                                        </span>
                                    </dbp-button>
                                </div>
                                <div class="user-row-container">
                                    ${this.renderUserPermissionRow()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <menu slot="footer" class="footer-menu">
                    <dbp-button
                        no-spinner-on-click
                        type="is-secondary"
                        @click="${() => {
                            const customEvent = new CustomEvent('dbp-modal-closed', {
                                detail: {id: 'grant-permission-modal'},
                                bubbles: true,
                                composed: true,
                            });
                            this.dispatchEvent(customEvent);
                        }}">
                        ${i18n.t('grant-permission-dialog.buttons.cancel-text')}
                    </dbp-button>
                    <dbp-button
                        no-spinner-on-click
                        ${ref(this.savePermissionButtonRef)}
                        id="permission-save-button"
                        ?disabled="${this.usersToAdd.size === 0}"
                        @click="${async () => {
                            try {
                                await this.saveUserPermissions();
                            } catch (error) {
                                console.error('Error saving user permissions:', error);
                            }

                            // Revert buttons to edit button
                            this.setAllButtonState('edit');
                            // Remove edit styles & disable checkboxes
                            this._a(`input[type="checkbox"][data-user-id]`).forEach((checkbox) => {
                                const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
                                checkboxElem.classList.remove('changed');
                                checkboxElem.removeAttribute('data-changed');
                            });
                            this.disableAllCheckboxes();
                        }}"
                        type="is-primary">
                        ${i18n.t('grant-permission-dialog.buttons.save-all-text')}
                    </dbp-button>
                </menu>
            </dbp-modal>

            <!-- Deletion Confirmation Modal -->
            <dbp-modal
                id="deletion-confirmation-modal--grant-permission"
                class="modal modal--confirmation"
                modal-id="deletion-confirmation-modal"
                title="${i18n.t('grant-permission-dialog.delete-confirmation.title')}"
                subscribe="lang">
                <div slot="content">
                    <p>${i18n.t('grant-permission-dialog.delete-confirmation.message')}</p>
                </div>
                <menu slot="footer" class="footer-menu">
                    <dbp-button
                        type="is-secondary"
                        no-spinner-on-click
                        @click="${() => handleDeletionCancel(this)}">
                        ${i18n.t('grant-permission-dialog.delete-confirmation.button-abort-text')}
                    </dbp-button>
                    <dbp-button
                        type="is-danger"
                        no-spinner-on-click
                        @click="${() => handleDeletionConfirm(this)}">
                        ${i18n.t('grant-permission-dialog.delete-confirmation.button-delete-text')}
                    </dbp-button>
                </menu>
            </dbp-modal>
        `;
    }
}
