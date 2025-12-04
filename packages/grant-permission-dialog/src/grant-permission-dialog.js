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
import {PersonSelect} from '@dbp-toolkit/person-select';
import {classMap} from 'lit/directives/class-map.js';

export class GrantPermissionDialog extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance,
) {
    constructor() {
        super();
        this.auth = {};
        this.entryPointUrl = '';
        this.modalTitle = '';
        this.availableActions = [];
        this.userList = new Map();
        this.permissionRows = [];
        this.usersToAdd = new Map();
        this.resourceIdentifier = '';
        this.resourceClassIdentifier = '';
        /** @type {import('lit/directives/ref.js').Ref<Button>} */
        this.addPersonButtonRef = createRef();
        /** @type {import('lit/directives/ref.js').Ref<Button>} */
        this.savePermissionButtonRef = createRef();
        /** @type {import('lit/directives/ref.js').Ref<Modal>} */
        this.permissionModalRef = createRef();
        this.lastManageCheckbox = null;
        this.lastSavedManagerId = null;
        this.buttonState = new Map();
    }

    static get properties() {
        return {
            ...super.properties,
            auth: {type: Object},
            availableActions: {type: Array},
            userList: {type: Map},
            usersToAdd: {type: Map},
            hasUsersToAdd: {type: Boolean},
            permissionRows: {type: Array},
            resourceIdentifier: {type: String, attribute: 'resource-identifier'},
            resourceClassIdentifier: {type: String, attribute: 'resource-class-identifier'},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            buttonState: {type: Object, attribute: false},
            lastManageCheckbox: {type: Object, attribute: false},
            lastSavedManagerId: {type: String, attribute: false},
        };
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-button': Button,
            'dbp-icon-button': IconButton,
            'dbp-person-select': PersonSelect,
            'dbp-modal': Modal,
            'dbp-notification': Notification,
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('dbp-modal-closed', this.modalClosedHandler.bind(this));
    }

    modalClosedHandler() {
        this.closeModal();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this.removeEventListener('dbp-modal-closed', this.modalClosedHandler);
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'userList': {
                    this.checkSavedManagerCount();
                    // this.disableLastManageCheckbox();
                    break;
                }
            }
        });
    }

    checkSavedManagerCount() {
        let singleManagerId = null;
        let multipleManagers = false;

        for (const [userId, user] of this.userList) {
            const hasManageGrant = user?.permissions?.get('manage')?.identifier;
            if (!hasManageGrant) continue;

            if (singleManagerId === null) {
                singleManagerId = userId;
            } else {
                multipleManagers = true;
                break;
            }
        }

        this.lastSavedManagerId = multipleManagers ? null : singleManagerId;
    }

    disableLastManageCheckbox() {
        const manageCheckboxes = this._a('.permission-checkbox[name="manage"]');
        const checkedManageCheckboxes = [...manageCheckboxes].filter((checkbox) => {
            return checkbox.checked === true;
        });

        if (checkedManageCheckboxes.length === 1) {
            this.lastManageCheckbox = checkedManageCheckboxes[0];
            this.lastManageCheckbox.disabled = true;
        } else if (
            this.lastManageCheckbox &&
            this.lastManageCheckbox.classList.contains('edit-mode')
        ) {
            // Enable checkboxes in edit-mode if there are multiple checked manage checkboxes
            this.lastManageCheckbox.disabled = false;
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
     * Send a fetch to given url with given options
     * @param url
     * @param options
     * @returns {Promise<object>} response (error or result)
     */
    async httpGetAsync(url, options) {
        let response = await fetch(url, options)
            .then((result) => {
                if (!result.ok) throw result;
                return result;
            })
            .catch((error) => {
                return error;
            });

        return response;
    }

    /**
     * Gets the actions for our resource class
     * @returns {Promise<object>} response
     */
    async apiGetAvailableActions() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        };
        return await this.httpGetAsync(
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
            let responseBody = null;
            const response = await this.apiGetAvailableActions();
            if (response.status !== 200 || (responseBody = await response.json()) === undefined) {
                showErrorNotification = true;
            } else {
                this.availableActions = Object.keys(responseBody.itemActions).map((actionKey) => {
                    return {
                        [actionKey]: {
                            [this.lang]:
                                responseBody.itemActions[actionKey][this.lang] ?? actionKey,
                        },
                    };
                });
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
     * @returns {Promise<object>} response
     */
    async apiGetResourceActionGrants() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        };
        return await this.httpGetAsync(
            this.entryPointUrl +
                `/authorization/resource-action-grants?resourceClass=${this.resourceClassIdentifier}&resourceIdentifier=${this.resourceIdentifier}&page=1&perPage=9999`,
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
        return await this.httpGetAsync(
            this.entryPointUrl + `/base/people/${userIdentifier}`,
            options,
        );
    }

    async apiGetFormDetails() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        };
        return await this.httpGetAsync(
            this.entryPointUrl + `/formalize/forms/${this.resourceIdentifier}`,
            options,
        );
    }

    async setModalTitle() {
        const i18n = this._i18n;
        if (this.resourceClassIdentifier === 'DbpRelayFormalizeForm') {
            try {
                let response = await this.apiGetFormDetails();
                let responseBody = await response.json();
                if (responseBody !== undefined && responseBody['name']) {
                    this.modalTitle = responseBody['name'];
                }
            } catch (e) {
                console.log('setModalTitle error', e);
                sendNotification({
                    summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                    body: i18n.t('grant-permission-dialog.notifications.set-form-name-error-text'),
                    type: 'danger',
                    targetNotificationId: 'permission-modal-notification',
                    timeout: 5,
                });
            }
        } else {
            this.modalTitle = i18n.t('grant-permission-dialog.modal-title');
        }
    }

    /**
     * Delete user's Resource Action Grant
     * @param {string} grantIdentifier - Authorization Resource Action Grant identifier
     * @returns {Promise<object>} response
     */
    async apiDeleteResourceActionGrant(grantIdentifier) {
        if (!grantIdentifier) {
            return false;
        }
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
        };
        return await this.httpGetAsync(
            this.entryPointUrl + `/authorization/resource-action-grants/${grantIdentifier}`,
            options,
        );
    }

    /**
     * Save user's Resource Action Grant
     * @param {string} action
     * @param {string} userIdentifier
     * @returns {Promise<object>} response
     */
    async apiPostResourceActionGrant(action, userIdentifier) {
        /* {
            "resourceIdentifier": "184c7f86-73b4-4ee7-9f93-09af7d7ff4fd",
            "resourceClass": "DbpRelayFormalizeForm",
            "action": "manage",
            "userIdentifier": "811EC3ACC0ADCA70"
        } */
        const body = {
            resourceIdentifier: this.resourceIdentifier,
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
        return await this.httpGetAsync(
            this.entryPointUrl + `/authorization/resource-action-grants`,
            options,
        );
    }

    async deleteUsersAllGrants(userId) {
        const i18n = this._i18n;

        const userToDelete = this.userList.get(userId);
        const grantsToDelete = [];

        // Collect grants to delete
        userToDelete.permissions.forEach((grant) => {
            if (grant.identifier) {
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
        }
    }

    async deleteUser(userId) {
        // const i18n = this._i18n;
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

            const deleted = this.userList.delete(userId);
            if (deleted) {
                rowToAnimate.classList.remove('delete-animation');
                // this.setDeleteAllButtonVisibility();
                this.requestUpdate();
            }
        } catch (e) {
            console.log('delete user error', e);
            //@TODO add notification
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

    async handleUserEditButton(userId) {
        this.setButtonState(userId, 'save');

        const userToAdd = this.userList.get(userId);
        this.usersToAdd.set(userId, userToAdd);

        // Check last manager count to prevent unchecking manage checkbox on editing
        this.checkSavedManagerCount();
        this.enableUsersAllCheckboxes(userId);

        this.savePermissionButtonRef.value.removeAttribute('disabled');
    }

    async handleUserSaveButton(userId) {
        try {
            await this.saveUserPermissions(userId);
        } catch (error) {
            console.log(error);
        } finally {
            this.setButtonState(userId, 'edit');

            // Remove edit styles & disable checkboxes
            this._a(`[data-user-id="${userId}"]`).forEach((checkbox) => {
                const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
                checkboxElem.classList.remove('changed');
                checkboxElem.removeAttribute('data-changed');
            });
            this.disableUsersAllCheckboxes(userId);

            if (this.usersToAdd.size === 0) {
                this.savePermissionButtonRef.value.disabled = true;
            }
        }
    }

    async handleUserDeleteButton(userId) {
        const i18n = this._i18n;
        const deleteButton = this._(`#user-delete-button-${userId}`);
        const buttonAction = deleteButton.getAttribute('data-action');

        // Change button to disabled red, wait 3 second and enable deleting
        if (buttonAction === 'prepare-delete') {
            let countdown = 3;
            deleteButton.setAttribute('type', 'is-danger');
            deleteButton.setAttribute('disabled', 'disabled');
            deleteButton.innerText = i18n.t('grant-permission-dialog.buttons.delete-warning-text', {
                counter: countdown,
            });
            let countdownInterval = setInterval(() => {
                countdown--;
                deleteButton.innerText = i18n.t(
                    'grant-permission-dialog.buttons.delete-warning-text',
                    {counter: countdown},
                );
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    deleteButton.removeAttribute('disabled');
                    deleteButton.setAttribute('data-action', 'delete');
                    deleteButton.innerHTML = `<dbp-icon name="trash"></dbp-icon> ${i18n.t('grant-permission-dialog.buttons.delete-now-text')}`;
                }
            }, 1000);
        } else if (buttonAction === 'delete') {
            const userFullName = this.lookupUserFullName(userId);
            await this.deleteUser(userId);
            deleteButton.removeAttribute('disabled');
            deleteButton.setAttribute('type', 'is-secondary');
            deleteButton.setAttribute('data-action', 'prepare-delete');
            deleteButton.innerHTML = '<dbp-icon name="trash"></dbp-icon> Delete';
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
    }

    /**
     * Get a list of users and granted permissions
     * @returns {Promise<void>}
     */
    async setListOfUsersAndPermissions() {
        const i18n = this._i18n;

        try {
            let response = await this.apiGetResourceActionGrants();
            let responseBody = await response.json();
            if (
                responseBody !== undefined &&
                response.status !== 403 &&
                responseBody['hydra:member'].length > 0
            ) {
                // Loop trough all grants
                const newUserList = new Map(this.userList);
                for (const grant of responseBody['hydra:member']) {
                    if (grant.userIdentifier) {
                        const userId = grant.userIdentifier;

                        if (!newUserList.has(userId)) {
                            const userFullName = await this.getUserFullName(userId);
                            // Create user object
                            const user = {
                                userIdentifier: userId,
                                userFullName: userFullName,
                                permissions: this.createEmptyUserPermission(),
                            };
                            // Set current grant
                            user.permissions.set(grant.action, {
                                action: grant.action,
                                identifier: grant.identifier,
                                authorizationResource: grant.authorizationResource,
                            });
                            // Add to user list
                            newUserList.set(userId, user);
                        } else {
                            // We already have this user in userList
                            let user = newUserList.get(userId);
                            // Set current grant
                            user.permissions.set(grant.action, {
                                action: grant.action,
                                identifier: grant.identifier,
                                authorizationResource: grant.authorizationResource,
                            });
                            // Add to user list
                            newUserList.set(userId, user);
                        }
                    }
                }
                this.userList = newUserList;
                this.setAllButtonState('edit');
            } else {
                if (responseBody.status === 500) {
                    sendNotification({
                        summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                        body: i18n.t(
                            'grant-permission-dialog.notifications.could-not-fetch-resource-class-actions',
                        ),
                        type: 'danger',
                        targetNotificationId: 'permission-modal-notification',
                        timeout: 0,
                    });
                } else if (response.status === 403) {
                    sendNotification({
                        summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                        body: i18n.t('grant-permission-dialog.notifications.error-not-authorized'),
                        targetNotificationId: 'permission-modal-notification',
                        type: 'danger',
                        timeout: 0,
                    });
                }
            }
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

    renderUserPermissionRow() {
        if (!this.userList) {
            return;
        }
        const i18n = this._i18n;

        return html`
            ${Array.from(this.userList).map(([userId, user]) => {
                return html`
                    <div
                        class="user-row ${classMap({'edit-mode': this.usersToAdd.has(userId)})}"
                        data-user-id="${userId}">
                        <div class="person-select-container">
                            ${user.userFullName
                                ? html`
                                      <span class="user-name">${user.userFullName}</span>
                                  `
                                : html`
                                      <dbp-person-select
                                          id="permission-person-select"
                                          subscribe="auth"
                                          lang="${this.lang}"
                                          @change="${(event) => {
                                              this.handlePersonSelected(event);
                                          }}"
                                          entry-point-url="${this
                                              .entryPointUrl}"></dbp-person-select>
                                  `}
                        </div>
                        ${user.userFullName ? this.renderPermissionCheckboxes(user) : ''}
                        ${user.userFullName
                            ? html`
                                  <div class="action-buttons">
                                      ${this.buttonState.get(userId).state === 'edit'
                                          ? html`
                                                <dbp-button
                                                    type="is-secondary"
                                                    id="user-edit-button-${userId}"
                                                    no-spinner-on-click
                                                    @click="${() => {
                                                        this.handleUserEditButton(userId);
                                                    }}">
                                                    <dbp-icon name="pencil"></dbp-icon>
                                                    ${i18n.t(
                                                        'grant-permission-dialog.buttons.edit-text',
                                                    )}
                                                </dbp-button>
                                            `
                                          : ''}
                                      ${this.buttonState.get(userId).state === 'save'
                                          ? html`
                                                <dbp-button
                                                    type="is-primary"
                                                    id="user-save-button-${userId}"
                                                    no-spinner-on-click
                                                    @click="${() => {
                                                        this.handleUserSaveButton(userId);
                                                    }}">
                                                    <dbp-icon name="save"></dbp-icon>
                                                    ${i18n.t(
                                                        'grant-permission-dialog.buttons.save-text',
                                                    )}
                                                </dbp-button>
                                            `
                                          : ''}
                                      <dbp-button
                                          type="is-secondary"
                                          data-action="prepare-delete"
                                          id="user-delete-button-${userId}"
                                          no-spinner-on-click
                                          ?disabled=${this.lastSavedManagerId === userId}
                                          @click="${() => {
                                              this.handleUserDeleteButton(userId);
                                          }}">
                                          <dbp-icon name="trash"></dbp-icon>
                                          ${i18n.t('grant-permission-dialog.buttons.delete-text')}
                                      </dbp-button>
                                  </div>
                              `
                            : ''}
                    </div>
                `;
            })}
        `;
    }

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

                    if (user.permissions) {
                        const userPermission = user.permissions.get(actionValue);
                        // The permission exists if it has an identifier
                        if (userPermission?.identifier) {
                            hasThisPermission = true;
                        }

                        // Allow editing of newly added permissions
                        if (userPermission?.editable) {
                            editable = true;
                        }
                    }

                    return html`
                        <div class="checkbox-container">
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
                                })}"
                                data-user-id="${user.userIdentifier}"
                                type="checkbox"
                                @input="${this.handleCheckbox}"
                                ?disabled="${!editable}"
                                ?checked="${hasThisPermission}" />
                        </div>
                    `;
                })}
            </div>
        `;
    }

    createEmptyUserPermission(editable = false) {
        if (!Array.isArray(this.availableActions) || this.availableActions.length < 1) {
            return;
        }

        const userPermissions = new Map();
        this.availableActions.forEach((action) => {
            const actionValue = Object.keys(action)[0];
            const emptyPermission = {
                action: actionValue,
                authorizationResource: null,
                identifier: null,
                editable: editable,
            };
            userPermissions.set(actionValue, emptyPermission);
        });
        return userPermissions;
    }

    async handlePersonSelected(event) {
        const i18n = this._i18n;

        try {
            const newUser = JSON.parse(event.target.dataset.object);

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
            let userToAdd = {};
            userToAdd.userIdentifier = newUser['identifier'];
            userToAdd.userFullName = `${newUser['givenName']} ${newUser['familyName']}`;
            userToAdd.permissions = this.createEmptyUserPermission(true);

            this.usersToAdd.set(userToAdd.userIdentifier, userToAdd);

            // Remove person select
            this.userList.delete('emptyPerson');
            // Update person in this.userList
            this.userList.set(userToAdd.userIdentifier, userToAdd);
            this.setButtonState(userToAdd.userIdentifier, 'edit');
            this.requestUpdate();

            // Toggle edit button to save button
            await this.updateComplete;
            this.handleUserEditButton(userToAdd.userIdentifier);
            this.addPersonButtonRef.value.stop();
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
        checkbox.classList.toggle('changed');

        if (!checkbox.getAttribute('data-changed')) {
            checkbox.setAttribute('data-changed', true);
        } else {
            checkbox.removeAttribute('data-changed');
        }

        // Prevent unchecking last manager
        this.disableLastManageCheckbox();

        const userIdentifier = checkbox.getAttribute('data-user-id');
        const permissionName = checkbox.getAttribute('name');

        // Get users to add
        const userToAdd = this.usersToAdd.get(userIdentifier);
        // Get clicked permission
        const permission = userToAdd.permissions.get(permissionName);
        // Set permission to be saved
        permission.toSave = checkbox.getAttribute('data-changed') ? true : false;
    }

    enableUsersAllCheckboxes(userId) {
        this._a(`.permission-checkbox[data-user-id="${userId}"]`).forEach((checkbox) => {
            const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
            // Don't enable the last-manage-checkbox when editing a user
            if (checkboxElem.id !== `manage-${this.lastSavedManagerId}`) {
                checkboxElem.disabled = false;
            }
        });
    }

    disableUsersAllCheckboxes(userId) {
        this._a(`.permission-checkbox[data-user-id="${userId}"]`).forEach((checkbox) => {
            const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
            checkboxElem.disabled = true;
        });
    }

    disableAllCheckboxes() {
        this._a('.permission-checkbox').forEach((checkbox) => {
            const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
            checkboxElem.disabled = true;
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
            await this.setModalTitle();
            await this.setAvailableActions();
            await this.setListOfUsersAndPermissions();
            this.permissionModalRef.value.open();

            const modalContent = this._('.content-inner');

            const resizeObserver = new ResizeObserver((entries) => {
                const personSelect = this._('.person-select-container');
                const permissionItems = /** @type {HTMLElement[]} */ (
                    Array.from(
                        this._a('.user-row:first-child .permission-group .checkbox-container'),
                    )
                );
                const actionButtons = this._('.action-buttons');

                const userRow = this._('.user-row:first-child');
                if (!userRow) return;

                const userRowStyle = window.getComputedStyle(userRow);
                const userRowPadding =
                    parseInt(userRowStyle.paddingLeft) + parseInt(userRowStyle.paddingRight);

                const permissionGroup = this._('.user-row:first-child .permission-group');
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

    closeModal() {
        /* Reset state */

        // Remove person select
        this.userList = new Map();

        // Reset add person button state
        this.addPersonButtonRef.value.stop();
        this.permissionModalRef.value.close();
    }

    handleAddNewPerson() {
        this.addPersonButtonRef.value.start();
        this.userList.set('emptyPerson', {});
        this.requestUpdate();
    }

    setButtonState(userId, state) {
        const updated = new Map(this.buttonState);

        if (state === 'edit') {
            updated.set(userId, {
                state: 'edit',
            });
        } else if (state === 'save') {
            updated.set(userId, {
                state: 'save',
            });
        }
        this.buttonState = updated;
    }

    setAllButtonState(state) {
        Array.from(this.userList).forEach(async ([userId, user]) => {
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
            let usersToProcess;
            let errorCount = 0;
            let successCount = 0;

            if (userId) {
                // Process only the specified user
                usersToProcess = new Map([[userId, this.usersToAdd.get(userId)]]);
            } else {
                // Process all users in the queue
                usersToProcess = this.usersToAdd;
            }

            // Process user(s)
            for (const userIdentifier of usersToProcess.keys()) {
                const userToAdd = usersToProcess.get(userIdentifier);
                if (!userToAdd) continue;

                const grantsToPost = [];
                const grantsToDelete = [];

                // Collect grants to create and delete
                userToAdd.permissions.forEach((permission) => {
                    if (!permission.toSave) return;

                    if (permission.identifier) {
                        grantsToDelete.push({
                            action: permission.action,
                            identifier: permission.identifier,
                        });
                        permission.identifier = null;
                    } else {
                        grantsToPost.push({
                            action: permission.action,
                            userIdentifier: userToAdd.userIdentifier,
                        });
                    }
                    permission.toSave = false;
                });

                if (grantsToPost.length === 0 && grantsToDelete.length === 0) {
                    sendNotification({
                        summary: i18n.t('grant-permission-dialog.notifications.info-title'),
                        body: i18n.t(
                            'grant-permission-dialog.notifications.there-is-nothing-to-save',
                            {userFullName: userToAdd.userFullName},
                        ),
                        type: 'info',
                        targetNotificationId: 'permission-modal-notification',
                        timeout: 5,
                    });
                    // Remove user form queue
                    this.usersToAdd.delete(userIdentifier);
                    continue;
                }

                // Add grants
                if (grantsToPost.length > 0) {
                    for (const grant of grantsToPost) {
                        const postResponse = await this.apiPostResourceActionGrant(
                            grant.action,
                            grant.userIdentifier,
                        );
                        if (postResponse.status !== 201) {
                            errorCount++;
                            continue;
                        } else {
                            successCount++;

                            const responseBody = await postResponse.json();
                            // Set identifier in user permissions
                            userToAdd.permissions.set(grant.action, {
                                action: grant.action,
                                identifier: responseBody.identifier,
                                authorizationResource: responseBody.authorizationResource,
                            });
                        }
                    }
                }

                // Delete grants
                if (grantsToDelete.length > 0) {
                    for (const grant of grantsToDelete) {
                        // Don't delete last manage grant
                        if (grant.action === 'manage' && this.lastSavedManagerId) {
                            sendNotification({
                                summary: 'Warning',
                                body: i18n.t(
                                    'grant-permission-dialog.notifications.cant-remove-last-manager-warning',
                                ),
                                type: 'warning',
                                targetNotificationId: 'permission-modal-notification',
                                timeout: 5,
                            });
                            continue;
                        }
                        const deleteResponse = await this.apiDeleteResourceActionGrant(
                            grant.identifier,
                        );
                        if (deleteResponse.status !== 204) {
                            errorCount++;
                            continue;
                        } else {
                            successCount++;
                            // Remove identifier from user permissions
                            userToAdd.permissions.delete(grant.action);
                        }
                    }
                }

                // Remove edit styles & disable checkboxes
                this._a(`[data-user-id="${userToAdd.userIdentifier}"]`).forEach((checkbox) => {
                    const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
                    checkboxElem.classList.remove('changed');
                    checkboxElem.removeAttribute('data-changed');
                });
                this.disableUsersAllCheckboxes(userToAdd.userIdentifier);

                // Update permissions in userList
                this.userList.set(userToAdd.userIdentifier, {
                    userIdentifier: userToAdd.userIdentifier,
                    userFullName: userToAdd.userFullName,
                    permissions: userToAdd.permissions,
                });

                // Remove processed user from usersToAdd list
                this.usersToAdd.delete(userToAdd.userIdentifier);
            }

            this.requestUpdate('userList');

            // Stop the save button spinner and show success message
            this.savePermissionButtonRef.value.stop();

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
                <div slot="header" class="header">
                    <div class="modal-notification">
                        <dbp-notification
                            id="permission-modal-notification"
                            inline
                            lang="${this.lang}"></dbp-notification>
                    </div>
                    <h3>${this.modalTitle}</h3>
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
                            this.closeModal();
                        }}">
                        ${i18n.t('grant-permission-dialog.buttons.cancel-text')}
                    </dbp-button>
                    <dbp-button
                        no-spinner-on-click
                        ${ref(this.savePermissionButtonRef)}
                        id="permission-save-button"
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

                            this.savePermissionButtonRef.value.setAttribute('disabled', 'disabled');
                        }}"
                        type="is-primary">
                        ${i18n.t('grant-permission-dialog.buttons.save-all-text')}
                    </dbp-button>
                </menu>
            </dbp-modal>
        `;
    }
}
