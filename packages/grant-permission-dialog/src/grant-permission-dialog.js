import {css, html} from 'lit';
import {createInstance} from './i18n.js';
import {ref, createRef} from 'lit/directives/ref.js';
// import {getFieldsetCSS} from './utils.js';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {getGrantPermissionDialogCSS} from './styles.js';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {ScopedElementsMixin, Modal, Button, Icon, IconButton} from '@dbp-toolkit/common';
import {send} from '@dbp-toolkit/common/notification';
import {PersonSelect} from '@dbp-toolkit/person-select';
import { classMap } from 'lit/directives/class-map.js';

export class GrantPermissionDialog extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.auth = {};
        this.entryPointUrl = '';
        this.formName = '';
        this.availableActions = [];
        this.userList = new Map();
        // this.userNames = new Map();
        this.permissionRows = [];
        this.usersToAdd = new Map();
        this.hasUsersToAdd = false;
        this.showDeleteAllButton = false;
        this.resourceIdentifier = '';
        this.resourceClassIdentifier = '';
        /** @type {import('lit/directives/ref.js').Ref<Button>} */
        this.addPersonButtonRef = createRef();
        /** @type {import('lit/directives/ref.js').Ref<Button>} */
        this.savePermissionButtonRef = createRef();
        /** @type {import('lit/directives/ref.js').Ref<Modal>} */
        this.permissionModalRef = createRef();
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            auth: {type: Object},
            availableActions: {type: Array},
            userList: {type: Map},
            usersToAdd: {type: Map},
            hasUsersToAdd: {type: Boolean},
            showDeleteAllButton: {type: Boolean},
            permissionRows: { type: Array },
            resourceIdentifier: {type: String, attribute: 'resource-identifier'},
            resourceClassIdentifier: {type: String, attribute: 'resource-class-identifier'},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
        };
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-button': Button,
            'dbp-icon-button': IconButton,
            'dbp-person-select': PersonSelect,
            'dbp-modal': Modal,
            // 'dbp-notification': Notification,
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('dbp-modal-closed', () => {
            this.closeModal();
        });
    }

    firstUpdated() {
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            // console.log(`**** ${propName} changed`);

            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(this.lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    /**
     * Returns if a person is set in or not
     * @returns {boolean} true or false
     */
    isLoggedIn() {
        return (this.auth.person !== undefined && this.auth.person !== null);
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
            this.entryPointUrl + `/authorization/available-resource-class-actions/${this.resourceClassIdentifier}?perPage=9999`,
            options,
        );
    }

    async setAvailableActions() {
        try {
            let response = await this.apiGetAvailableActions();
            let responseBody = await response.json();
            if (responseBody !== undefined && responseBody.status !== 403 && responseBody['itemActions'].length > 0) {
                this.availableActions = responseBody['itemActions'];
            }
        } catch (e) {
            console.log('setAvailableActions error', e);
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
            this.entryPointUrl + `/authorization/resource-action-grants?resourceClass=${this.resourceClassIdentifier}&resourceIdentifier=${this.resourceIdentifier}&page=1&perPage=9999`,
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

    async setFormName() {
        try {
            let response = await this.apiGetFormDetails();
            let responseBody = await response.json();
            if (responseBody !== undefined && responseBody['name']) {
                this.formName = responseBody['name'];
            }
        } catch (e) {
            console.log('setFormName error', e);
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
            userIdentifier: userIdentifier
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
        userToDelete.permissions.forEach(grant => {
            if (grant.identifier) {
                grantsToDelete.push(grant);
            }
        });

        try {
            for (const grant of grantsToDelete) {
                await this.apiDeleteResourceActionGrant(grant.identifier);
                console.log(`grant ${grant.action} deleted`, grant);
            }
            // @TODO handle multiple errors
        } catch(e) {
            console.log('Error deleting grant', e);
            send({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                // Add username and grantname here
                body: i18n.t('grant-permission-dialog.could-not-delete-grant'),
                type: 'danger',
                targetNotificationId: 'permission-modal-notification',
                timeout: 10,
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
            const animationComplete = new Promise(resolve => {
                rowToAnimate.addEventListener('transitionend', resolve, { once: true });
            });
            // Wait for animation to complete before updating the Map
            await animationComplete;

            const deleted = this.userList.delete(userId);
            if (deleted) {
                rowToAnimate.classList.remove('delete-animation');
                this.setDeleteAllButtonVisibility();
                this.requestUpdate();
            }
        } catch (e){
            console.log('delete user error', e);
        }
    }

    async getUserFullName(userIdentifier) {
        const i18n = this._i18n;
        try {
            const response = await this.apiGetUserDetails(userIdentifier);
            let userDetailsResponse = await response.json();
            if (userDetailsResponse !== undefined && userDetailsResponse.status !== 403 ) {
                return `${userDetailsResponse['givenName']} ${userDetailsResponse['familyName']}`;
            } else {
                if (userDetailsResponse.status === 500) {
                    send({
                        summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                        body: i18n.t('grant-permission-dialog.could-not-fetch-user-details'),
                        type: 'danger',
                        targetNotificationId: 'permission-modal-notification',
                        timeout: 10,
                    });
                } else if (userDetailsResponse.status === 403) {
                    send({
                        summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                        body: i18n.t('grant-permission-dialog.notifications.error-not-authorized'),
                        targetNotificationId: 'permission-modal-notification',
                        type: 'danger',
                        timeout: 5,
                    });
                }
            }
        } catch (error) {
            console.log('getUserFullName failed', error);
            send({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.notifications.failed-get-user-details'),
                type: 'error',
                targetNotificationId: 'permission-modal-notification',
                timeout: 10,
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
        const editButton = this._(`#user-edit-button-${userId}`);
        const buttonType = editButton.getAttribute('type');
        if (buttonType === 'is-secondary') {
            // Change to "Save" button
            editButton.setAttribute('type', 'is-primary');
            editButton.innerHTML = '<dbp-icon name="save"></dbp-icon> Save';

            const userToAdd = this.userList.get(userId);
            // @TODO add a function addUserToAddQueue
            this.usersToAdd.set(userId, userToAdd);
            this.enableUsersAllCheckboxes(userId);
            this.hasUsersToAdd = this.usersToAdd.size > 0;
            this.requestUpdate();
        } else if (buttonType === 'is-primary') {

            // try {
            //     await this.saveUserPermissions(userId);
            //     // Revert button to edit button
            //     editButton.setAttribute('type', 'is-secondary');
            //     editButton.innerHTML = '<dbp-icon name="pencil"></dbp-icon> Edit';
            //     //
            //     // this.hasUsersToAdd = this.usersToAdd.size > 0;
            //     // this.requestUpdate();
            // } catch (error) {
            //     console.log(error);
            // }

            try {
                await this.saveUserPermissions(userId);
            } catch (error) {
                console.log(error);
            } finally {
                // @TODO: make this a function? And call it for save all button to

                // Revert button to edit button
                editButton.setAttribute('type', 'is-secondary');
                editButton.innerHTML = '<dbp-icon name="pencil"></dbp-icon> Edit';

                // Remove edit styles & disable checkboxes
                this._a(`[data-user-id="${userId}"]`).forEach(checkbox => {
                    const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
                    checkboxElem.classList.remove('changed');
                    checkboxElem.removeAttribute('data-changed');
                });
                this.disableUsersAllCheckboxes(userId);

                this.hasUsersToAdd = this.usersToAdd.size > 0;
                this.requestUpdate();
            }
        }
    }

    async handleAllUserDeleteButton() {
        const i18n = this._i18n;
        const deleteButton = this._(`#user-delete-button-all`);
        const buttonAction = deleteButton.getAttribute('data-action');

        // Change button to disabled red, wait 3 second and enable deleting
        if (buttonAction === 'prepare-delete') {
            deleteButton.setAttribute('type', 'is-danger');
            // deleteButton.setAttribute('data-action', 'delete');
            deleteButton.setAttribute('disabled', 'disabled');
            deleteButton.innerText = 'Are you sure? (3s)';
            let countdown = 3;
            let countdownInterval = setInterval(() => {
                countdown--;
                deleteButton.innerHTML = 'Are you sure? (' + countdown + 's)';
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    deleteButton.removeAttribute('disabled');
                    deleteButton.setAttribute('data-action', 'delete');
                    deleteButton.innerHTML = '<dbp-icon name="trash"></dbp-icon> Delete now';
                }
            }, 1000);
        } else if (buttonAction === 'delete') {
            try {
                for (const [userId, user] of this.userList) {
                    console.log('user to delete', userId, user);
                    await this.deleteUser(userId);
                }
                send({
                    summary: i18n.t('grant-permission-dialog.notifications.success-title'),
                    // Add username and grantname here
                    body: i18n.t('grant-permission-dialog.notifications.all-users-deleted'),
                    type: 'info',
                    targetNotificationId: 'permission-modal-notification',
                    timeout: 5,
                });
            } catch (e) {
                console.log('Delete all failed', e);
            }

        }
    }

    async handleUserDeleteButton(userId) {
        const i18n = this._i18n;
        const deleteButton = this._(`#user-delete-button-${userId}`);
        const buttonAction = deleteButton.getAttribute('data-action');

        // Change button to disabled red, wait 3 second and enable deleting
        if (buttonAction === 'prepare-delete') {
            deleteButton.setAttribute('type', 'is-danger');
            deleteButton.setAttribute('disabled', 'disabled');
            deleteButton.innerText = 'Are you sure? (3s)';
            let countdown = 3;
            let countdownInterval = setInterval(() => {
                countdown--;

                deleteButton.innerHTML = 'Are you sure? (' + countdown + 's)';
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    deleteButton.removeAttribute('disabled');
                    deleteButton.setAttribute('data-action', 'delete');
                    deleteButton.innerHTML = '<dbp-icon name="trash"></dbp-icon> Delete now';
                }
            }, 1000);
        } else if (buttonAction === 'delete') {
            const userFullName = this.lookupUserFullName(userId);
            await this.deleteUser(userId);
            deleteButton.removeAttribute('disabled');
            deleteButton.setAttribute('type', 'is-secondary');
            deleteButton.setAttribute('data-action', 'prepare-delete');
            deleteButton.innerHTML = '<dbp-icon name="trash"></dbp-icon> Delete';
            send({
                summary: i18n.t('grant-permission-dialog.notifications.success-title'),
                body: i18n.t('grant-permission-dialog.notifications.user-successfully-deleted', { userFullName: userFullName}),
                type: 'info',
                targetNotificationId: 'permission-modal-notification',
                timeout: 5,
            });
        }
    }

    /**
     * Get a list of users and grantad permissions
     * @returns {Promise<void>}
     */
    async setListOfUsersAndPermissions() {
        const i18n = this._i18n;

        try {
            let response = await this.apiGetResourceActionGrants();
            let responseBody = await response.json();
            if (responseBody !== undefined && responseBody.status !== 403 && responseBody['hydra:member'].length > 0) {
                // Loop trough all grants
                for (const grant of responseBody['hydra:member']) {

                    if (grant.userIdentifier) {
                        const userId = grant.userIdentifier;

                        if (!this.userList.has(userId)) {
                            const userFullName = await this.getUserFullName(userId);
                            // Create user object
                            const user = {
                                userIdentifier: userId,
                                userFullName: userFullName,
                                permissions: this.createEmptyUserPermission()
                            };
                            // Set current grant
                            user.permissions.set(grant.action, {
                                action: grant.action,
                                identifier: grant.identifier,
                                authorizationResource: grant.authorizationResource,
                            });
                            // Add to user list
                            this.userList.set(userId, user);
                        } else {
                            // We already have this user in userList
                            let user = this.userList.get(userId);
                            // Set current grant
                            user.permissions.set(grant.action, {
                                action: grant.action,
                                identifier: grant.identifier,
                                authorizationResource: grant.authorizationResource,
                            });
                            // Add to user list
                            this.userList.set(userId, user);
                        }
                    }
                    // Update Delete all Button visibility
                    this.setDeleteAllButtonVisibility();
                    this.requestUpdate();
                };
                console.log('userList', this.userList);

            } else {
                if (responseBody.status === 500) {
                    send({
                        summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                        body: i18n.t('grant-permission-dialog.notifications.could-not-fetch-resource-class-actions'),
                        type: 'danger',
                        targetNotificationId: 'permission-modal-notification',
                        timeout: 10,
                    });
                } else if (response.status === 403) {
                    send({
                        summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                        body: i18n.t('grant-permission-dialog.notifications.error-not-authorized'),
                        targetNotificationId: 'permission-modal-notification',
                        type: 'danger',
                        timeout: 5,
                    });
                }
            }
        } catch (e) {
            console.log('setListOfUsersAndPermissions', e);
            send({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.unknown-error'),
                targetNotificationId: 'permission-modal-notification',
                type: 'danger',
                timeout: 5,
            });
        }
    }

    renderUserPermissionRow() {
        if (!this.userList) {
            return;
        }
        // const i18n = this._i18n;

        return html`
            ${Array.from(this.userList).map(([userId, user]) => html`

                <div class="user-row" data-user-id="${userId}">
                    <div class="person-select-container">
                    ${ user.userFullName
                        ? html`<span class="user-name">${user.userFullName}</span>`
                        : html`
                            <dbp-person-select
                                id="permission-person-select"
                                subscribe="auth"
                                lang="${this.lang}"
                                @change="${(event) => {
                                    this.handlePersonSelected(event);
                                }}"
                                entry-point-url="${this.entryPointUrl}">
                            </dbp-person-select>`
                    }
                    </div>
                    ${ user.userFullName
                        ? this.renderPermissionCheckboxes(user)
                        : ''
                    }
                    ${ user.userFullName
                        ? html`<div class="action-buttons">
                                <dbp-button type="is-secondary"
                                    data-action="edit"
                                    id="user-edit-button-${userId}"
                                    no-spinner-on-click
                                    @click="${() => {
                                        this.handleUserEditButton(userId);
                                    }}">
                                    <dbp-icon name="pencil"></dbp-icon>
                                    Edit
                                </dbp-button>
                                <dbp-button type="is-secondary"
                                    data-action="prepare-delete"
                                    id="user-delete-button-${userId}"
                                    no-spinner-on-click
                                    @click="${() => {
                                        this.handleUserDeleteButton(userId);
                                    }}">
                                    <dbp-icon name="trash"></dbp-icon>
                                    Delete
                                </dbp-button>
                            </div>`
                        : ''
                    }
                </div>`
            )}
        `;
    }

    renderPermissionCheckboxes(user) {
        const i18n = this._i18n;
        if (!this.availableActions) {
            return;
        }

        return html`
            <div class="permission-group" role="group" aria-labelledby="permissions-group-label">
                <h3 id="permissions-group-label" class="visually-hidden">${i18n.t('grant-permission-dialog.available-permissions')}</h3>
                ${this.availableActions.map((action) => {
                    const permissionName = action.replace('_', ' ');

                    let hasThisPermission = false;
                    // let existingPermission = true;
                    let editable = false;

                    if (user.permissions) {
                        const userPermission  = user.permissions.get(action);
                        if(userPermission.identifier) {
                            hasThisPermission = true;
                        }

                        // Allow editing of newly added permissions
                        if (userPermission.editable) {
                            editable = true;
                        }
                    }

                    return html`
                        <div class="checkbox-container">
                            <label for="${action}-${user.userIdentifier}" class="visually-hidden">${permissionName}</label>
                            <input id="${action}-${user.userIdentifier}"
                                name="${action}"
                                data-user-id="${user.userIdentifier}"
                                type="checkbox"
                                @input="${this.handleCheckbox}"
                                ?disabled="${!editable}"
                                ?checked="${hasThisPermission}">
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
        this.availableActions.forEach(action => {
            const emptyPermission = {
                action: action,
                authorizationResource: null,
                identifier: null,
                isNew: true,
                // isNotSaved: true,
                editable: editable
            };
            userPermissions.set(action, emptyPermission);
        });
        return userPermissions;
    }

    async handlePersonSelected(event) {
        const i18n = this._i18n;

        try {
            const newUser = JSON.parse(event.target.dataset.object);

            // Check if user is already in the list
            if (newUser && this.userList.has(newUser.identifier)) {
                send({
                    summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                    body: i18n.t('grant-permission-dialog.user-already-added'),
                    targetNotificationId: 'permission-modal-notification',
                    type: 'danger',
                    timeout: 10,
                });
                return;
            }

            // Set new user datas
            let userToAdd = {};
            userToAdd.userIdentifier = newUser['identifier'];
            userToAdd.userFullName = `${newUser['givenName']} ${newUser['familyName']}`;
            userToAdd.permissions = this.createEmptyUserPermission(true);

            console.count('user added to usersToAdd[]');

            this.usersToAdd.set(userToAdd.userIdentifier, userToAdd);
            console.log('usersToAdd[]', this.usersToAdd);

            // Remove person select
            this.userList.delete('emptyPerson');
            // Update person in this.userList
            this.userList.set(userToAdd.userIdentifier, userToAdd);
            this.requestUpdate();
            // Toggle edit button to save button
            await this.updateComplete;
            this.handleUserEditButton(userToAdd.userIdentifier);
            this.addPersonButtonRef.value.stop();
            // addPersonButton.stop();
        } catch (error) {
            console.log('Failed to get user object', error);
            send({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.failed-to-get-user-details'),
                targetNotificationId: 'permission-modal-notification',
                type: 'danger',
                timeout: 10,
            });
        }
    }

    handleCheckbox(event) {
        const checkbox = event.target;
        checkbox.classList.toggle('changed');
        // Should I toggle this?
        if (!checkbox.getAttribute('data-changed')) {
            checkbox.setAttribute('data-changed', true);
        } else {
            checkbox.removeAttribute('data-changed');
        }

        const userIdentifier = checkbox.getAttribute('data-user-id');
        const permissionName = checkbox.getAttribute('name');

        // Get users to add
        const userToAdd = this.usersToAdd.get(userIdentifier);
        // Get clicked permission
        const permission = userToAdd.permissions.get(permissionName);

        // Set permission to be saved
        // permission.toSave = checkbox.getAttribute('data-changed');
        console.log('getAttirbute value', checkbox.getAttribute('data-changed'));
        permission.toSave = checkbox.getAttribute('data-changed') ? true : false;
        console.log('permission.toSave', permission.toSave);
        console.log('checked permission', permission);
    }

    /**
     * Disables a specific checkbox for a given user and action
     *
     * @param {string} userId - The unique identifier of the user
     * @param {string} actionName - The name of the action/permission
     * @throws {Error} If no matching checkbox is found
     */
    disableCheckboxes(userId, actionName) {
        const checkbox = /** @type {HTMLInputElement} */ (this._(`input[name="${actionName}"][data-user-id="${userId}"]`));
        checkbox.disabled = true;
    }

    enableUsersAllCheckboxes(userId) {
        this._a(`input[data-user-id="${userId}"]`).forEach(checkbox => {
            const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
            checkboxElem.disabled = false;
        });
    }

    disableUsersAllCheckboxes(userId) {
        this._a(`input[data-user-id="${userId}"]`).forEach(checkbox => {
            const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
            checkboxElem.disabled = true;
        });
    }

    renderPermissionLabels() {
        if (!this.availableActions) {
            return;
        }

        return html`
            <div class="permission-group">
                ${this.availableActions.map((permission) => {
                    const permissionName = permission.replace('_', ' ');
                    return html`
                        <div class="checkbox-label-container">
                            <label for="${permission}">${permissionName}</label>
                        </div>
                    `;
                })}
            </div>
        `;
    }

    setDeleteAllButtonVisibility() {
        this.showDeleteAllButton = false;
        for (const [userId, user] of this.userList) {
            if (userId === 'emptyPerson') {
                continue;
            }
            user.permissions.forEach((permission) => {
                if (permission.identifier) {
                    this.showDeleteAllButton = true;
                    return;
                }
            });
        }
    }


    async open() {
        const i18n = this._i18n;

        if (!this.isLoggedIn()) {
            send({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.need-login'),
                type: 'danger',
                timeout: 10,
            });
        } else {
            await this.setFormName();
            await this.setAvailableActions();
            await this.setListOfUsersAndPermissions();
            this.permissionModalRef.value.open();
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


    /**
     * Saves user permissions for either a single user or all users in usersToAdd
     * @param {string} [userId] - Optional user ID. If not provided, saves all pending users
     * @returns {Promise<void>}
     */
    async saveUserPermissions(userId) {
        const i18n = this._i18n;

        // If no users to save, show message and return
        if (this.usersToAdd.size < 1) {
            send({
                summary: i18n.t('grant-permission-dialog.info-title'),
                body: i18n.t('grant-permission-dialog.there-is-nothing-to-save'),
                type: 'info',
                targetNotificationId: 'permission-modal-notification',
                timeout: 5,
            });
            return Promise.reject();
        }

        try {
            console.log('BEFORE REMOVING USER', this.usersToAdd);
            // Process each user
            for (const userIdentifier of this.usersToAdd.keys()) {
                const userToAdd = this.usersToAdd.get(userIdentifier);
                if (!userToAdd) continue;

                const grantsToPost = [];
                const grantsToDelete = [];

                // Collect grants to create and delete
                userToAdd.permissions.forEach((permission) => {
                    if (!permission.toSave) return;

                    if (permission.identifier) {
                        grantsToDelete.push({
                            identifier: permission.identifier,
                        });
                    } else {
                        grantsToPost.push({
                            action: permission.action,
                            userIdentifier: userToAdd.userIdentifier
                        });
                    }
                });

                if (grantsToPost.length === 0 && grantsToDelete.length === 0) {
                    send({
                        summary: i18n.t('grant-permission-dialog.info-title'),
                        body: i18n.t('grant-permission-dialog.there-is-nothing-to-save'),
                        type: 'info',
                        targetNotificationId: 'permission-modal-notification',
                        timeout: 5,
                    });
                    // Remove user form queue
                    this.usersToAdd.delete(userId);
                    return Promise.reject();
                }

                // Add grants
                if (grantsToPost.length > 0 ) {
                    for (const grant of grantsToPost) {
                        await this.apiPostResourceActionGrant(
                            grant.action,
                            grant.userIdentifier
                        );
                    }
                }

                // Delete grants
                if (grantsToPost.length > 0 ) {
                    for (const grant of grantsToDelete) {
                        await this.apiDeleteResourceActionGrant(grant.identifier);
                    }
                }

                // Remove edit styles & disable checkboxes
                this._a(`[data-user-id="${userToAdd.userIdentifier}"]`).forEach(checkbox => {
                    const checkboxElem = /** @type {HTMLInputElement} */ (checkbox);
                    checkboxElem.classList.remove('changed');
                    checkboxElem.removeAttribute('data-changed');
                });
                this.disableUsersAllCheckboxes(userToAdd.userIdentifier);

                // Update permissions in userList
                this.userList.set(userToAdd.userIdentifier, {
                    userIdentifier: userToAdd.userIdentifier,
                    userFullName: userToAdd.userFullName,
                    permissions: this.createEmptyUserPermission()
                });

                // Remove processed user from usersToAdd list
                this.usersToAdd.delete(userToAdd.userIdentifier);
                console.log('AFTER REMOVING USER', this.usersToAdd);
            }

            // Refresh rendered permissions
            await this.setListOfUsersAndPermissions();
            // Update Delete all Button visibilit
            this.setDeleteAllButtonVisibility();
            // set Save all button visibility
            this.hasUsersToAdd = this.usersToAdd.size > 0;
            this.requestUpdate();

            // Stop the save button spinner and show success message
            this.savePermissionButtonRef.value.stop();
            send({
                summary: i18n.t('grant-permission-dialog.notifications.success-title'),
                body: i18n.t('grant-permission-dialog.notifications.permissions-saved-successfully'),
                type: 'success',
                targetNotificationId: 'permission-modal-notification',
                timeout: 5,
            });
            return Promise.resolve();
        } catch(e) {
            console.log('Save user permissions error:', e);
            send({
                summary: i18n.t('grant-permission-dialog.notifications.error-title'),
                body: i18n.t('grant-permission-dialog.save-permissions-error'),
                type: 'danger',
                targetNotificationId: 'permission-modal-notification',
                timeout: 5,
            });
            return Promise.reject();
        }
    }

    static get styles() {
        return [
            commonStyles.getGeneralCSS(),
            commonStyles.getButtonCSS(),
            commonStyles.getModalDialogCSS(),

            getGrantPermissionDialogCSS(),
            // language=css
            css`

            `,
        ];
    }

    render() {
        const i18n = this._i18n;
        console.log('*** MAIN RENDER ***');
        // console.log('this.usersToAdd', this.usersToAdd);
        // console.log('this.hasUsersToAdd', this.hasUsersToAdd);
        // console.log('this.userList', this.userList);
        // console.log('this.showDeleteAllButton', this.showDeleteAllButton);

        // this.thereIsPersonToDelete();

        return html`
            <dbp-modal id="permission-modal" sticky-footer
                ${ref(this.permissionModalRef)}
                class="modal modal--permissions"
                modal-id="grant-permission-modal"
                title="${i18n.t('grant-permission-dialog.modal-title')}"
                subscribe="lang">
                <div slot="header" class="header">
                    <div class="modal-notification">
                        <dbp-notification id="permission-modal-notification" inline lang="${this.lang}"></dbp-notification>
                    </div>
                    <h3>${this.formName}</h3>
                </div>
                <div slot="content">
                    <div class="content-inner">

                        <div class="header-row">
                            <div class="person-select-header"></div>
                            <div class="permissions-header">
                                ${this.renderPermissionLabels()}
                            </div>
                            <div class="buttons-header">
                                <dbp-button type="is-danger"
                                    class="${classMap({'hidden': !this.showDeleteAllButton})}"
                                    data-action="prepare-delete"
                                    id="user-delete-button-all"
                                    no-spinner-on-click
                                    @click="${() => {
                                        this.handleAllUserDeleteButton();
                                    }}">
                                    <dbp-icon name="trash"></dbp-icon>
                                    ${i18n.t('grant-permission-dialog.buttons.delete-all-text')}
                                </dbp-button>
                            </div>
                        </div><!-- END .header-row -->

                        <div class="body-container">
                            <div class="button-container">
                                <dbp-button
                                    type="is-primary"
                                    ${ref(this.addPersonButtonRef)}
                                    id="add-new-person-button"
                                    @click="${() => { this.handleAddNewPerson(); }}">
                                    <dbp-icon name="plus"></dbp-icon>
                                    <span>${i18n.t('grant-permission-dialog.buttons.add-person-text')}</span>
                                </dbp-button>
                            </div>
                            <div class="user-row-container">
                                ${this.renderUserPermissionRow()}
                            </div>
                        </div>
                    </div>
                </div>

                <menu slot="footer" class="footer-menu">
                    <dbp-button
                        no-spinner-on-click
                        type="is-secondary"
                        @click="${() => { this.closeModal(); }}">${i18n.t('grant-permission-dialog.buttons.cancel-text')}</dbp-button>
                    <dbp-button
                        ${ref(this.savePermissionButtonRef)}
                        id="permission-save-button"
                        ?disabled="${!this.hasUsersToAdd}"
                        @click="${async () => {
                            await this.saveUserPermissions();

                            // Revert buttons to edit button
                            this._a(`[id*="user-edit-button"][type="is-primary"]`).forEach(editButton => {
                                const editButtonElement = /** @type {Button}*/ (editButton);
                                editButtonElement.setAttribute('type', 'is-secondary');
                                editButtonElement.innerHTML = '<dbp-icon name="pencil"></dbp-icon> Edit';
                            });
                        }}"
                        type="is-primary">${i18n.t('grant-permission-dialog.buttons.save-all-text')}</dbp-button>
                </menu>
            </dbp-modal>
        `;
    }
}
