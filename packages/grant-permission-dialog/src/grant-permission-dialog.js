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

/** @type {HolderType} */
export const HOLDER_TYPE_USER = 'user';
/** @type {HolderType} */
export const HOLDER_TYPE_GROUP = 'group';
/** @type {HolderType} */
export const HOLDER_TYPE_DYNAMIC_GROUP = 'dynamic-group';

/** @type {HolderType[]} */
const HOLDER_TYPES = [HOLDER_TYPE_USER, HOLDER_TYPE_GROUP, HOLDER_TYPE_DYNAMIC_GROUP];
const MANAGE_ACTION = 'manage';
const GROUP_PATH = '/authorization/groups/';
// Dynamic groups with this prefix are created by the API for resource collection policies
const SYSTEM_DYNAMIC_GROUP_PREFIX = '@';
const INHERITED_GRANT_SUFFIX = '_inherited';

const HOLDER_ICONS = {
    [HOLDER_TYPE_USER]: 'user',
    [HOLDER_TYPE_GROUP]: 'users',
    [HOLDER_TYPE_DYNAMIC_GROUP]: 'network',
};

/**
 * @typedef {'user'|'group'|'dynamic-group'} HolderType
 * @typedef {{identifier: string, locked: boolean, inherited: boolean}} ResourceGrant
 * @typedef {{
 *   action: string,
 *   identifier: string|null,
 *   locked?: boolean,
 *   inherited?: boolean,
 *   toSave?: boolean,
 *   desiredGranted?: boolean|null,
 *   mixed?: boolean,
 *   grantsByResource: Map<string, ResourceGrant>
 * }} HolderPermission
 * @typedef {{
 *   key: string,
 *   holderType: HolderType,
 *   holderIdentifier: string,
 *   displayName: string|undefined,
 *   isSystem?: boolean,
 *   permissions: Map<string, HolderPermission>
 * }} HolderEntry
 * @typedef {Record<string, Record<string, string>>} AvailableAction
 */

/**
 * Builds the unique key of a grant holder
 * @param {HolderType} holderType
 * @param {string} holderIdentifier
 * @returns {string}
 */
export function getHolderKey(holderType, holderIdentifier) {
    return `${holderType}:${holderIdentifier}`;
}

/**
 * Normalizes the group of a grant to its IRI, the API may return an IRI or an embedded object
 * @param {string|{'@id'?: string, identifier?: string}|null|undefined} group
 * @returns {string|null}
 */
export function getGroupIri(group) {
    if (!group) {
        return null;
    }
    if (typeof group === 'string') {
        return group.startsWith('/') ? group : `${GROUP_PATH}${group}`;
    }
    if (group['@id']) {
        return group['@id'];
    }
    return group.identifier ? `${GROUP_PATH}${group.identifier}` : null;
}

/**
 * Turns an identifier like "registrars_office_staff" or "summerCourseCreators" into readable text
 * @param {string} identifier
 * @returns {string}
 */
export function humanizeIdentifier(identifier) {
    const words = String(identifier ?? '')
        .replace(/^@+/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_\-.]+/g, ' ')
        .trim()
        .toLowerCase();
    return words.charAt(0).toUpperCase() + words.slice(1);
}

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
        /** @type {Map<string, HolderEntry>} */
        this.holderList = new Map();
        /** @type {Map<string, HolderEntry>} */
        this.holdersInEdit = new Map();
        /** @type {HolderType|null} */
        this.pendingHolderType = null;
        this.resourceIdentifier = '';
        this.resourceIdentifiers = [];
        this.resourceClassIdentifier = '';
        /** @type {Record<string, string|Record<string, string>>} */
        this.dynamicGroupLabels = {};
        this.isLoading = false;
        this.isStacked = false;
        this.protectedHolderKeys = new Set();
        this.deletionCandidateName = '';
        /** @type {Map<string, string>} */
        this.displayNameCache = new Map();
        /** @type {import('lit/directives/ref.js').Ref<Modal>} */
        this.permissionModalRef = createRef();
        /** @type {ResizeObserver|null} */
        this.resizeObserver = null;
        this.boundModalClosedHandler = this.modalClosedHandler.bind(this);
    }

    static get properties() {
        return {
            ...super.properties,
            auth: {type: Object},
            modalTitle: {type: String, attribute: 'modal-title'},
            availableActions: {type: Array, attribute: false},
            holderList: {type: Object, attribute: false},
            holdersInEdit: {type: Object, attribute: false},
            pendingHolderType: {type: String, attribute: false},
            resourceIdentifier: {type: String, attribute: 'resource-identifier'},
            resourceIdentifiers: {type: Array, attribute: false},
            resourceClassIdentifier: {type: String, attribute: 'resource-class-identifier'},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            dynamicGroupLabels: {type: Object, attribute: false},
            isLoading: {type: Boolean, attribute: false},
            isStacked: {type: Boolean, attribute: false},
            protectedHolderKeys: {type: Object, attribute: false},
            deletionCandidateName: {type: String, attribute: false},
        };
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
        this.addEventListener('dbp-modal-closed', this.boundModalClosedHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('dbp-modal-closed', this.boundModalClosedHandler);
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
    }

    modalClosedHandler(event) {
        this.closeModal(event);
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        // Set default title if none provided via attribute
        if (
            changedProperties.has('lang') &&
            (!this.modalTitle || !this.hasAttribute('modal-title'))
        ) {
            this.modalTitle = this._i18n.t('grant-permission-dialog.modal-title');
        }

        if (changedProperties.has('holderList')) {
            this.updateProtectedHolders();
        }
    }

    get #permissionModal() {
        const modal = this.permissionModalRef.value;
        if (!modal) {
            throw new Error('Permission modal is unavailable');
        }
        return modal;
    }

    /**
     * @param {string} key
     * @returns {HolderEntry}
     */
    #getHolder(key) {
        const holder = this.holderList.get(key);
        if (!holder) {
            throw new Error(`Unknown permission holder "${key}"`);
        }
        return holder;
    }

    getResourceIdentifiers() {
        const identifiers =
            Array.isArray(this.resourceIdentifiers) && this.resourceIdentifiers.length > 0
                ? this.resourceIdentifiers
                : [this.resourceIdentifier];
        return [...new Set(identifiers.map((identifier) => identifier?.trim()).filter(Boolean))];
    }

    /**
     * Returns if a person is set in or not
     * @returns {boolean} true or false
     */
    isLoggedIn() {
        return Boolean(this.auth && this.auth.token);
    }

    /**
     * @param {string} [method]
     * @param {object} [body]
     * @returns {RequestInit}
     */
    getRequestOptions(method = 'GET', body) {
        return {
            method,
            headers: {
                'Content-Type': 'application/ld+json',
                Authorization: 'Bearer ' + this.auth.token,
            },
            ...(body === undefined ? {} : {body: JSON.stringify(body)}),
        };
    }

    notify(type, summary, body, timeout = type === 'danger' ? 0 : 5) {
        sendNotification({
            summary,
            body,
            type,
            targetNotificationId: 'permission-modal-notification',
            timeout,
        });
    }

    /**
     * Gets the actions for our resource class
     * @returns {Promise<Response>} response
     */
    async apiGetAvailableActions() {
        return await fetch(
            this.entryPointUrl +
                `/authorization/available-resource-class-actions/${this.resourceClassIdentifier}?perPage=9999`,
            this.getRequestOptions(),
        );
    }

    async setAvailableActions() {
        this.availableActions = [];
        try {
            const response = await this.apiGetAvailableActions();
            const responseBody = response.status === 200 ? await response.json() : null;
            if (!responseBody?.itemActions) {
                throw new Error('No item actions available');
            }
            this.availableActions = Object.keys(responseBody.itemActions).map((actionKey) => ({
                [actionKey]: {
                    [this.lang]: responseBody.itemActions[actionKey][this.lang] ?? actionKey,
                },
            }));
        } catch (error) {
            console.error('setAvailableActions', error);
            this.notify(
                'danger',
                this._i18n.t('grant-permission-dialog.notifications.error-title'),
                this._i18n.t(
                    'grant-permission-dialog.notifications.set-available-actions-error-text',
                ),
            );
        }
    }

    /**
     * Gets the list of Resource Action Grants
     * @returns {Promise<Response>} response
     */
    async apiGetResourceActionGrants(resourceIdentifier = this.resourceIdentifier) {
        return await fetch(
            this.entryPointUrl +
                `/authorization/resource-action-grants?resourceClass=${encodeURIComponent(
                    this.resourceClassIdentifier,
                )}&resourceIdentifier=${encodeURIComponent(resourceIdentifier)}&page=1&perPage=9999`,
            this.getRequestOptions(),
        );
    }

    async apiGetUserDetails(userIdentifier) {
        return await fetch(
            this.entryPointUrl + `/base/people/${encodeURIComponent(userIdentifier)}`,
            this.getRequestOptions(),
        );
    }

    async apiGetGroupDetails(groupIri) {
        return await fetch(this.entryPointUrl + groupIri, this.getRequestOptions());
    }

    /**
     * Delete a Resource Action Grant
     * @param {string} grantIdentifier - Authorization Resource Action Grant identifier
     * @returns {Promise<Response>} response
     */
    async apiDeleteResourceActionGrant(grantIdentifier) {
        if (!grantIdentifier) {
            throw new Error('Grant identifier is required');
        }
        return await fetch(
            this.entryPointUrl +
                `/authorization/resource-action-grants/${encodeURIComponent(grantIdentifier)}`,
            this.getRequestOptions('DELETE'),
        );
    }

    /**
     * Builds the grant holder part of a Resource Action Grant request body
     * @param {{holderType: HolderType, holderIdentifier: string}} holder
     * @returns {Record<string, string>}
     */
    getHolderPayload(holder) {
        switch (holder.holderType) {
            case HOLDER_TYPE_GROUP:
                return {group: getGroupIri(holder.holderIdentifier) ?? holder.holderIdentifier};
            case HOLDER_TYPE_DYNAMIC_GROUP:
                return {dynamicGroupIdentifier: holder.holderIdentifier};
            default:
                return {userIdentifier: holder.holderIdentifier};
        }
    }

    /**
     * Save a Resource Action Grant for a person, group or dynamic group
     * @param {string} action
     * @param {{holderType: HolderType, holderIdentifier: string}} holder
     * @param {string} resourceIdentifier
     * @returns {Promise<Response>} response
     */
    async apiPostResourceActionGrant(action, holder, resourceIdentifier = this.resourceIdentifier) {
        return await fetch(
            this.entryPointUrl + `/authorization/resource-action-grants`,
            this.getRequestOptions('POST', {
                resourceIdentifier,
                resourceClass: this.resourceClassIdentifier,
                action,
                ...this.getHolderPayload(holder),
            }),
        );
    }

    /**
     * Extracts the grant holder from a Resource Action Grant
     * @param {any} grant
     * @returns {{holderType: HolderType, holderIdentifier: string, displayName?: string}|null}
     */
    getHolderFromGrant(grant) {
        if (grant.userIdentifier) {
            return {holderType: HOLDER_TYPE_USER, holderIdentifier: grant.userIdentifier};
        }
        const groupIri = getGroupIri(grant.group);
        if (groupIri) {
            return {
                holderType: HOLDER_TYPE_GROUP,
                holderIdentifier: groupIri,
                displayName: typeof grant.group === 'object' ? grant.group.name : undefined,
            };
        }
        if (grant.dynamicGroupIdentifier) {
            return {
                holderType: HOLDER_TYPE_DYNAMIC_GROUP,
                holderIdentifier: grant.dynamicGroupIdentifier,
            };
        }
        return null;
    }

    isSystemDynamicGroup(identifier) {
        return String(identifier).startsWith(SYSTEM_DYNAMIC_GROUP_PREFIX);
    }

    getDynamicGroupName(identifier) {
        const label = this.dynamicGroupLabels?.[identifier];
        if (typeof label === 'string') {
            return label;
        }
        if (label && typeof label === 'object') {
            return label[this.lang] ?? Object.values(label)[0] ?? humanizeIdentifier(identifier);
        }
        if (this.isSystemDynamicGroup(identifier)) {
            return this._i18n.t('grant-permission-dialog.holder.system-rule');
        }
        return humanizeIdentifier(identifier);
    }

    async getUserFullName(userIdentifier) {
        try {
            const response = await this.apiGetUserDetails(userIdentifier);
            if (response.ok) {
                const person = await response.json();
                return [person.givenName, person.familyName].filter(Boolean).join(' ');
            }
        } catch (error) {
            console.error('getUserFullName failed', error);
        }
        return undefined;
    }

    async getGroupName(groupIri) {
        try {
            const response = await this.apiGetGroupDetails(groupIri);
            if (response.ok) {
                const group = await response.json();
                return group.name;
            }
        } catch (error) {
            console.error('getGroupName failed', error);
        }
        return undefined;
    }

    /**
     * Resolves a human readable name for a grant holder, falls back to a generic label
     * @param {HolderEntry} holder
     * @returns {Promise<string>}
     */
    async resolveDisplayName(holder) {
        const i18n = this._i18n;
        if (holder.holderType === HOLDER_TYPE_DYNAMIC_GROUP) {
            return this.getDynamicGroupName(holder.holderIdentifier);
        }

        const cachedName = this.displayNameCache.get(holder.key);
        if (cachedName) {
            return cachedName;
        }

        const name =
            holder.holderType === HOLDER_TYPE_GROUP
                ? await this.getGroupName(holder.holderIdentifier)
                : await this.getUserFullName(holder.holderIdentifier);
        if (name) {
            this.displayNameCache.set(holder.key, name);
            return name;
        }

        return holder.holderType === HOLDER_TYPE_GROUP
            ? i18n.t('grant-permission-dialog.holder.unknown-group')
            : i18n.t('grant-permission-dialog.holder.unknown-person');
    }

    createEmptyPermissions() {
        /** @type {Map<string, HolderPermission>} */
        const permissions = new Map();
        if (!Array.isArray(this.availableActions)) {
            return permissions;
        }

        this.availableActions.forEach((action) => {
            const actionValue = Object.keys(action)[0];
            permissions.set(actionValue, {
                action: actionValue,
                identifier: null,
                locked: false,
                inherited: false,
                mixed: false,
                toSave: false,
                desiredGranted: null,
                grantsByResource: new Map(),
            });
        });
        return permissions;
    }

    /**
     * @param {HolderType} holderType
     * @param {string} holderIdentifier
     * @param {string} [displayName]
     * @returns {HolderEntry}
     */
    createHolder(holderType, holderIdentifier, displayName) {
        return {
            key: getHolderKey(holderType, holderIdentifier),
            holderType,
            holderIdentifier,
            displayName,
            isSystem:
                holderType === HOLDER_TYPE_DYNAMIC_GROUP &&
                this.isSystemDynamicGroup(holderIdentifier),
            permissions: this.createEmptyPermissions(),
        };
    }

    /**
     * Loads all grants of the selected resources and groups them by grant holder
     * @returns {Promise<void>}
     */
    async setListOfHoldersAndPermissions() {
        try {
            const resourceIdentifiers = this.getResourceIdentifiers();
            if (resourceIdentifiers.length === 0) {
                throw new Error('No resource identifier was provided');
            }

            const availableActionKeys = new Set(
                (this.availableActions ?? []).map((action) => Object.keys(action)[0]),
            );
            /** @type {Map<string, HolderEntry>} */
            const newHolderList = new Map();

            for (const resourceIdentifier of resourceIdentifiers) {
                const response = await this.apiGetResourceActionGrants(resourceIdentifier);
                if (response.status === 403) {
                    this.notify(
                        'danger',
                        this._i18n.t('grant-permission-dialog.notifications.error-title'),
                        this._i18n.t('grant-permission-dialog.notifications.error-not-authorized'),
                    );
                    return;
                }
                if (!response.ok) {
                    throw new Error(`Failed to load grants for resource ${resourceIdentifier}`);
                }

                const responseBody = await response.json();
                for (const grant of responseBody?.['hydra:member'] ?? []) {
                    // Grants for actions that aren't available can't be edited in the dialog
                    if (!availableActionKeys.has(grant.action)) {
                        continue;
                    }

                    const grantHolder = this.getHolderFromGrant(grant);
                    if (!grantHolder) {
                        continue;
                    }

                    const key = getHolderKey(grantHolder.holderType, grantHolder.holderIdentifier);
                    let holder = newHolderList.get(key);
                    if (!holder) {
                        holder = this.createHolder(
                            grantHolder.holderType,
                            grantHolder.holderIdentifier,
                            grantHolder.displayName,
                        );
                        newHolderList.set(key, holder);
                    }

                    const inherited = String(grant.identifier).endsWith(INHERITED_GRANT_SUFFIX);
                    const deletable = (grant.grantedActions ?? []).includes('delete');
                    holder.permissions.get(grant.action)?.grantsByResource.set(resourceIdentifier, {
                        identifier: grant.identifier,
                        inherited,
                        locked: inherited || !deletable || Boolean(holder.isSystem),
                    });
                }
            }

            for (const holder of newHolderList.values()) {
                for (const permission of holder.permissions.values()) {
                    const grants = [...permission.grantsByResource.values()];
                    const grantedOnAll = grants.length === resourceIdentifiers.length;
                    permission.identifier = grantedOnAll ? grants[0]?.identifier : null;
                    permission.locked = grantedOnAll && grants.every((grant) => grant.locked);
                    permission.inherited = grantedOnAll && grants.every((grant) => grant.inherited);
                    permission.mixed = grants.length > 0 && !grantedOnAll;
                }
            }

            await Promise.all(
                [...newHolderList.values()].map(async (holder) => {
                    if (!holder.displayName) {
                        holder.displayName = await this.resolveDisplayName(holder);
                    } else {
                        this.displayNameCache.set(holder.key, holder.displayName);
                    }
                }),
            );

            this.holderList = newHolderList;
        } catch (error) {
            console.error('setListOfHoldersAndPermissions', error);
            this.notify(
                'danger',
                this._i18n.t('grant-permission-dialog.notifications.error-title'),
                this._i18n.t('grant-permission-dialog.notifications.unknown-error'),
            );
        }
    }

    /**
     * Checks if a holder is granted an action on a resource, optionally including unsaved changes
     * @param {HolderEntry} holder
     * @param {string} action
     * @param {string} resourceIdentifier
     * @param {boolean} usePendingState
     * @returns {boolean}
     */
    isGrantedOnResource(holder, action, resourceIdentifier, usePendingState = false) {
        const permission = holder.permissions.get(action);
        if (!permission) {
            return false;
        }
        if (usePendingState && permission.toSave && permission.desiredGranted !== null) {
            // Locked grants can't be removed, so they stay in place
            const grant = permission.grantsByResource.get(resourceIdentifier);
            return permission.desiredGranted || Boolean(grant?.locked);
        }
        return permission.grantsByResource.has(resourceIdentifier);
    }

    /**
     * Checks if removing the manage permission of the given holders would leave a resource
     * without a manager. As long as a resource is managed by a person, at least one person
     * has to keep the manage permission, because groups can be empty.
     * @param {Set<string>} removedKeys - Holders that lose their manage permission
     * @param {Set<string>} pendingKeys - Holders whose unsaved changes are about to be saved
     * @returns {boolean}
     */
    wouldRemoveLastManager(removedKeys, pendingKeys = new Set()) {
        for (const resourceIdentifier of this.getResourceIdentifiers()) {
            const managersBefore = [];
            const managersAfter = [];
            for (const [key, holder] of this.holderList) {
                if (this.isGrantedOnResource(holder, MANAGE_ACTION, resourceIdentifier)) {
                    managersBefore.push(holder);
                }
                const grant = holder.permissions
                    .get(MANAGE_ACTION)
                    ?.grantsByResource.get(resourceIdentifier);
                const isRemoved = removedKeys.has(key) && !grant?.locked;
                if (
                    !isRemoved &&
                    this.isGrantedOnResource(
                        holder,
                        MANAGE_ACTION,
                        resourceIdentifier,
                        pendingKeys.has(key),
                    )
                ) {
                    managersAfter.push(holder);
                }
            }

            const isPerson = (holder) => holder.holderType === HOLDER_TYPE_USER;
            if (managersBefore.length > 0 && managersAfter.length === 0) {
                return true;
            }
            if (managersBefore.some(isPerson) && !managersAfter.some(isPerson)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Protects holders whose removal would leave a resource without a manager
     */
    updateProtectedHolders() {
        const protectedHolderKeys = new Set();
        for (const [key, holder] of this.holderList) {
            const managePermission = holder.permissions.get(MANAGE_ACTION);
            if (
                managePermission &&
                managePermission.grantsByResource.size > 0 &&
                this.wouldRemoveLastManager(new Set([key]))
            ) {
                protectedHolderKeys.add(key);
            }
        }
        this.protectedHolderKeys = protectedHolderKeys;
    }

    isHolderNew(holder) {
        return [...holder.permissions.values()].every(
            (permission) => permission.grantsByResource.size === 0,
        );
    }

    startEdit(key) {
        this.holdersInEdit = new Map(this.holdersInEdit).set(key, this.#getHolder(key));
    }

    cancelEdit(key) {
        const holder = this.holderList.get(key);
        const newHoldersInEdit = new Map(this.holdersInEdit);
        newHoldersInEdit.delete(key);
        this.holdersInEdit = newHoldersInEdit;

        if (!holder) {
            return;
        }
        if (this.isHolderNew(holder)) {
            this.removeHolderFromList(key);
            return;
        }
        holder.permissions.forEach((permission) => {
            permission.toSave = false;
            permission.desiredGranted = null;
        });
        this.requestUpdate('holderList');
    }

    removeHolderFromList(key) {
        const newHolderList = new Map(this.holderList);
        const deleted = newHolderList.delete(key);
        if (deleted) {
            this.holderList = newHolderList;
        }
        return deleted;
    }

    handleCheckbox(event, holder, action) {
        const checkbox = /** @type {HTMLInputElement} */ (event.target);
        const permission = holder.permissions.get(action);
        if (!permission) {
            throw new Error(`Permission "${action}" does not exist for holder "${holder.key}"`);
        }
        permission.desiredGranted = checkbox.checked;
        permission.toSave = true;
        this.requestUpdate('holderList');
    }

    /**
     * Opens the selection for a new person, group or dynamic group
     * @param {HolderType} holderType
     */
    async handleAddHolder(holderType) {
        this.pendingHolderType = holderType;
        await this.updateComplete;
    }

    cancelAddHolder() {
        this.pendingHolderType = null;
    }

    /**
     * Builds a holder from the object returned by the resource select
     * @param {HolderType} holderType
     * @param {any} resource
     * @returns {HolderEntry}
     */
    createHolderFromResource(holderType, resource) {
        switch (holderType) {
            case HOLDER_TYPE_GROUP:
                return this.createHolder(
                    HOLDER_TYPE_GROUP,
                    getGroupIri(resource) ?? resource['@id'],
                    resource.name ?? this._i18n.t('grant-permission-dialog.holder.unknown-group'),
                );
            case HOLDER_TYPE_DYNAMIC_GROUP:
                return this.createHolder(
                    HOLDER_TYPE_DYNAMIC_GROUP,
                    resource.identifier,
                    this.getDynamicGroupName(resource.identifier),
                );
            default:
                return this.createHolder(
                    HOLDER_TYPE_USER,
                    resource.identifier,
                    [resource.givenName, resource.familyName].filter(Boolean).join(' '),
                );
        }
    }

    async handleHolderSelected(event, holderType) {
        try {
            const resource = event.detail?.object;
            if (!event.detail?.value || !resource) {
                return;
            }

            const newHolder = this.createHolderFromResource(holderType, resource);
            if (this.holderList.has(newHolder.key)) {
                this.notify(
                    'warning',
                    this._i18n.t('grant-permission-dialog.notifications.warning-title'),
                    this._i18n.t('grant-permission-dialog.notifications.holder-already-added', {
                        name: newHolder.displayName,
                    }),
                );
                return;
            }

            this.displayNameCache.set(newHolder.key, newHolder.displayName ?? '');
            this.holderList = new Map(this.holderList).set(newHolder.key, newHolder);
            this.holdersInEdit = new Map(this.holdersInEdit).set(newHolder.key, newHolder);
            this.pendingHolderType = null;

            await this.updateComplete;
            this._(`.holder-row[data-holder-key="${CSS.escape(newHolder.key)}"] input`)?.focus();
        } catch (error) {
            console.error('Failed to add permission holder', error);
            this.notify(
                'danger',
                this._i18n.t('grant-permission-dialog.notifications.error-title'),
                this._i18n.t('grant-permission-dialog.notifications.failed-to-add-holder'),
            );
        }
    }

    async deleteHolder(key) {
        const holder = this.#getHolder(key);
        if (this.wouldRemoveLastManager(new Set([key]))) {
            this.notify(
                'warning',
                this._i18n.t('grant-permission-dialog.notifications.warning-title'),
                this._i18n.t(
                    'grant-permission-dialog.notifications.cant-remove-last-manager-warning',
                ),
            );
            return;
        }

        const grantsToDelete = [];
        holder.permissions.forEach((permission) => {
            permission.grantsByResource.forEach((grant) => {
                if (!grant.locked) {
                    grantsToDelete.push(grant);
                }
            });
        });

        try {
            for (const grant of grantsToDelete) {
                const response = await this.apiDeleteResourceActionGrant(grant.identifier);
                if (response.status !== 204) {
                    throw new Error('Failed to delete grant');
                }
            }
        } catch (error) {
            console.error('Error deleting grants', error);
            this.notify(
                'danger',
                this._i18n.t('grant-permission-dialog.notifications.error-title'),
                this._i18n.t('grant-permission-dialog.notifications.could-not-delete-holder', {
                    name: holder.displayName,
                }),
            );
            await this.setListOfHoldersAndPermissions();
            return;
        }

        const row = this._(`.holder-row[data-holder-key="${CSS.escape(key)}"]`);
        if (row) {
            row.classList.add('delete-animation');
            await Promise.race([
                new Promise((resolve) =>
                    row.addEventListener('transitionend', resolve, {once: true}),
                ),
                new Promise((resolve) => setTimeout(resolve, 400)),
            ]);
        }

        const newHoldersInEdit = new Map(this.holdersInEdit);
        newHoldersInEdit.delete(key);
        this.holdersInEdit = newHoldersInEdit;

        // Holders that only have locked grants stay visible
        if (grantsToDelete.length > 0) {
            await this.setListOfHoldersAndPermissions();
        } else {
            this.removeHolderFromList(key);
        }

        this.notify(
            'success',
            this._i18n.t('grant-permission-dialog.notifications.success-title'),
            this._i18n.t('grant-permission-dialog.notifications.holder-successfully-deleted', {
                name: holder.displayName,
            }),
        );
    }

    async handleDeleteButton(key) {
        const holder = this.#getHolder(key);
        if (this.isHolderNew(holder)) {
            this.cancelEdit(key);
            return;
        }

        this.deletionCandidateName = holder.displayName ?? '';
        const confirmed = await getDeletionConfirmation(this);
        if (confirmed) {
            await this.deleteHolder(key);
        }
    }

    /**
     * Saves the permissions of a single holder or of all holders in edit mode
     * @param {string} [key] - Optional holder key. If not provided, saves all pending holders
     * @returns {Promise<void>}
     */
    async saveHolderPermissions(key) {
        if (this.holdersInEdit.size === 0) {
            this.notify(
                'info',
                this._i18n.t('grant-permission-dialog.notifications.info-title'),
                this._i18n.t('grant-permission-dialog.notifications.there-is-nothing-to-save'),
            );
            return;
        }

        try {
            const holdersToProcess = key
                ? new Map([[key, this.holdersInEdit.get(key) ?? this.#getHolder(key)]])
                : new Map(this.holdersInEdit);
            const resourceIdentifiers = this.getResourceIdentifiers();
            const grantsToPost = [];
            const grantsToDelete = [];

            // Don't allow the pending changes to remove the last manager
            const manageRemovalKeys = new Set();
            for (const [holderKey, holder] of holdersToProcess) {
                const managePermission = holder.permissions.get(MANAGE_ACTION);
                if (managePermission?.toSave && managePermission.desiredGranted === false) {
                    manageRemovalKeys.add(holderKey);
                }
            }
            const manageRemovalBlocked =
                manageRemovalKeys.size > 0 &&
                this.wouldRemoveLastManager(manageRemovalKeys, new Set(holdersToProcess.keys()));

            for (const holder of holdersToProcess.values()) {
                holder.permissions.forEach((permission) => {
                    if (!permission.toSave || permission.desiredGranted === null) {
                        return;
                    }

                    if (permission.desiredGranted) {
                        for (const resourceIdentifier of resourceIdentifiers) {
                            if (!permission.grantsByResource.has(resourceIdentifier)) {
                                grantsToPost.push({
                                    action: permission.action,
                                    holder,
                                    resourceIdentifier,
                                });
                            }
                        }
                    } else if (!(permission.action === MANAGE_ACTION && manageRemovalBlocked)) {
                        permission.grantsByResource.forEach((grant) => {
                            if (!grant.locked) {
                                grantsToDelete.push(grant.identifier);
                            }
                        });
                    }
                });
            }

            if (manageRemovalBlocked) {
                this.notify(
                    'warning',
                    this._i18n.t('grant-permission-dialog.notifications.warning-title'),
                    this._i18n.t(
                        'grant-permission-dialog.notifications.cant-remove-last-manager-warning',
                    ),
                );
            }

            if (grantsToPost.length === 0 && grantsToDelete.length === 0) {
                if (!manageRemovalBlocked) {
                    this.notify(
                        'info',
                        this._i18n.t('grant-permission-dialog.notifications.info-title'),
                        this._i18n.t(
                            'grant-permission-dialog.notifications.there-is-nothing-to-save',
                        ),
                    );
                }
                if (key && this.isHolderNew(this.#getHolder(key))) {
                    return;
                }
            }

            let successCount = 0;
            let errorCount = 0;

            // Create new grants before deleting existing ones, so no access is lost in between
            for (const grant of grantsToPost) {
                const response = await this.apiPostResourceActionGrant(
                    grant.action,
                    grant.holder,
                    grant.resourceIdentifier,
                );
                if (response.status === 201) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            for (const grantIdentifier of grantsToDelete) {
                const response = await this.apiDeleteResourceActionGrant(grantIdentifier);
                if (response.status === 204) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            // Keep unsaved changes of the other holders when reloading the list
            const remainingEdits = new Map(this.holdersInEdit);
            holdersToProcess.forEach((_holder, holderKey) => remainingEdits.delete(holderKey));
            this.holdersInEdit = new Map();
            await this.setListOfHoldersAndPermissions();
            this.restorePendingEdits(remainingEdits);

            if (successCount > 0) {
                this.notify(
                    'success',
                    this._i18n.t('grant-permission-dialog.notifications.success-title'),
                    this._i18n.t(
                        'grant-permission-dialog.notifications.permissions-saved-successfully',
                        {count: successCount},
                    ),
                );
            }
            if (errorCount > 0) {
                this.notify(
                    'danger',
                    this._i18n.t('grant-permission-dialog.notifications.error-title'),
                    this._i18n.t('grant-permission-dialog.notifications.save-permissions-error', {
                        count: errorCount,
                    }),
                );
            }
        } catch (error) {
            console.error('Save permissions error:', error);
            this.notify(
                'danger',
                this._i18n.t('grant-permission-dialog.notifications.error-title'),
                this._i18n.t(
                    'grant-permission-dialog.notifications.save-permissions-unexpected-error',
                ),
            );
        }
    }

    /**
     * Re-applies unsaved checkbox changes after the holder list was reloaded
     * @param {Map<string, HolderEntry>} pendingEdits
     */
    restorePendingEdits(pendingEdits) {
        if (pendingEdits.size === 0) {
            return;
        }

        const newHolderList = new Map(this.holderList);
        const newHoldersInEdit = new Map();
        pendingEdits.forEach((oldHolder, key) => {
            const holder = newHolderList.get(key) ?? oldHolder;
            oldHolder.permissions.forEach((oldPermission, action) => {
                const permission = holder.permissions.get(action);
                if (permission && oldPermission.toSave) {
                    permission.toSave = true;
                    permission.desiredGranted = oldPermission.desiredGranted;
                }
            });
            newHolderList.set(key, holder);
            newHoldersInEdit.set(key, holder);
        });
        this.holderList = newHolderList;
        this.holdersInEdit = newHoldersInEdit;
    }

    async open() {
        if (!this.isLoggedIn()) {
            sendNotification({
                summary: this._i18n.t('grant-permission-dialog.notifications.error-title'),
                body: this._i18n.t('grant-permission-dialog.need-login-warning-text'),
                type: 'danger',
                timeout: 0,
            });
            return;
        }

        this.holderList = new Map();
        this.holdersInEdit = new Map();
        this.pendingHolderType = null;
        this.isLoading = true;
        await this.updateComplete;
        this.#permissionModal.open();
        this.observeLayout();

        try {
            await this.setAvailableActions();
            await this.setListOfHoldersAndPermissions();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Switches to a stacked row layout if the permission columns don't fit into the modal
     */
    observeLayout() {
        const content = this._('.content-inner');
        if (!content || this.resizeObserver) {
            return;
        }

        this.resizeObserver = new ResizeObserver(() => {
            const actionCount = Math.max(this.availableActions?.length ?? 0, 1);
            const requiredWidth = 240 + actionCount * 88 + 230 + 32;
            const isStacked = content.clientWidth < requiredWidth;
            if (isStacked !== this.isStacked) {
                this.isStacked = isStacked;
            }
        });
        this.resizeObserver.observe(content);
    }

    closeModal(event) {
        if (event?.detail?.id === 'grant-permission-modal') {
            this.holderList = new Map();
            this.holdersInEdit = new Map();
            this.pendingHolderType = null;
            this.#permissionModal.close();
        }
    }

    getActionName(action) {
        const actionValue = Object.keys(action)[0];
        return (
            action[actionValue][this.lang] ?? Object.values(action[actionValue])[0] ?? actionValue
        );
    }

    getSortedHolders(holderType) {
        return [...this.holderList.values()]
            .filter((holder) => holder.holderType === holderType)
            .sort((a, b) => {
                if (a.isSystem !== b.isSystem) {
                    return a.isSystem ? 1 : -1;
                }
                return (a.displayName ?? '').localeCompare(b.displayName ?? '', this.lang);
            });
    }

    getPersonSearchQueryParameters(select, searchTerm) {
        return {
            search: searchTerm.trim(),
            sort: 'familyName',
        };
    }

    getGroupSearchQueryParameters(select, searchTerm) {
        return {
            search: searchTerm.trim(),
        };
    }

    formatPerson(select, person) {
        return [person.givenName, person.familyName].filter(Boolean).join(' ');
    }

    formatGroup(select, group) {
        return group.name ?? group.identifier;
    }

    /**
     * Returns the translated texts for a holder type
     * @param {HolderType} holderType
     * @returns {{type: string, section: string, addButton: string, addTitle: string, addDescription: string}}
     */
    getHolderTypeTexts(holderType) {
        const i18n = this._i18n;
        switch (holderType) {
            case HOLDER_TYPE_GROUP:
                return {
                    type: i18n.t('grant-permission-dialog.holder.type-group'),
                    section: i18n.t('grant-permission-dialog.sections.group'),
                    addButton: i18n.t('grant-permission-dialog.buttons.add-group'),
                    addTitle: i18n.t('grant-permission-dialog.add.group-title'),
                    addDescription: i18n.t('grant-permission-dialog.add.group-description'),
                };
            case HOLDER_TYPE_DYNAMIC_GROUP:
                return {
                    type: i18n.t('grant-permission-dialog.holder.type-dynamic-group'),
                    section: i18n.t('grant-permission-dialog.sections.dynamic-group'),
                    addButton: i18n.t('grant-permission-dialog.buttons.add-dynamic-group'),
                    addTitle: i18n.t('grant-permission-dialog.add.dynamic-group-title'),
                    addDescription: i18n.t('grant-permission-dialog.add.dynamic-group-description'),
                };
            default:
                return {
                    type: i18n.t('grant-permission-dialog.holder.type-user'),
                    section: i18n.t('grant-permission-dialog.sections.user'),
                    addButton: i18n.t('grant-permission-dialog.buttons.add-user'),
                    addTitle: i18n.t('grant-permission-dialog.add.user-title'),
                    addDescription: i18n.t('grant-permission-dialog.add.user-description'),
                };
        }
    }

    renderHolderAvatar(holder) {
        return html`
            <span class="holder-avatar holder-avatar--${holder.holderType}" aria-hidden="true">
                <dbp-icon name="${HOLDER_ICONS[holder.holderType]}"></dbp-icon>
            </span>
        `;
    }

    renderHolderInfo(holder) {
        const i18n = this._i18n;
        const isNew = this.isHolderNew(holder);

        let description = this.getHolderTypeTexts(holder.holderType).type;
        if (holder.isSystem) {
            description = i18n.t('grant-permission-dialog.holder.system-rule-description');
        }

        return html`
            <div class="holder-info">
                ${this.renderHolderAvatar(holder)}
                <div class="holder-text">
                    <span class="holder-name" title="${holder.displayName ?? ''}">
                        ${holder.displayName}
                    </span>
                    <span class="holder-meta">
                        ${description}
                        ${
                            isNew
                                ? html`
                                      <span class="badge badge--new">
                                          ${i18n.t('grant-permission-dialog.holder.new-badge')}
                                      </span>
                                  `
                                : ''
                        }
                    </span>
                </div>
            </div>
        `;
    }

    renderPermissionCheckboxes(holder) {
        const i18n = this._i18n;
        if (!Array.isArray(this.availableActions)) {
            return '';
        }

        const isEditing = this.holdersInEdit.has(holder.key);
        const isProtected = this.protectedHolderKeys.has(holder.key);

        return html`
            <div
                class="permission-group"
                role="group"
                aria-label="${i18n.t('grant-permission-dialog.permissions-for', {
                    name: holder.displayName,
                })}">
                ${this.availableActions.map((action) => {
                    const actionValue = Object.keys(action)[0];
                    const actionName = this.getActionName(action);
                    const permission = holder.permissions.get(actionValue);
                    const isGranted = Boolean(permission?.identifier);
                    const isChecked = permission?.desiredGranted ?? isGranted;
                    const isChanged =
                        Boolean(permission?.toSave) &&
                        permission?.desiredGranted !== null &&
                        (permission.desiredGranted !== isGranted || permission.mixed);
                    const isLastManager = actionValue === MANAGE_ACTION && isProtected && isGranted;
                    const isDisabled =
                        !isEditing || !permission || permission.locked || isLastManager;
                    const inputId = `permission-${actionValue}-${holder.key}`.replace(
                        /[^a-zA-Z0-9_-]/g,
                        '-',
                    );

                    let title = actionName;
                    if (permission?.locked) {
                        title = permission.inherited
                            ? i18n.t(
                                  'grant-permission-dialog.permissions.inherited-permission-title',
                              )
                            : i18n.t('grant-permission-dialog.permissions.locked-permission-title');
                    } else if (isLastManager && isEditing) {
                        title = i18n.t('grant-permission-dialog.permissions.last-manager-title');
                    } else if (permission?.mixed && permission.desiredGranted === null) {
                        title = i18n.t(
                            'grant-permission-dialog.permissions.mixed-permission-title',
                        );
                    }

                    const lockIcon = permission?.locked
                        ? html`
                              <dbp-icon class="lock-icon" name="lock" aria-hidden="true"></dbp-icon>
                          `
                        : '';

                    // Show a compact state indicator instead of disabled checkboxes outside edit mode
                    if (!isEditing) {
                        const isMixed = !isGranted && Boolean(permission?.mixed);
                        let stateText = i18n.t(
                            'grant-permission-dialog.permissions.state-not-granted',
                        );
                        if (isGranted) {
                            stateText = i18n.t('grant-permission-dialog.permissions.state-granted');
                        } else if (isMixed) {
                            stateText = i18n.t('grant-permission-dialog.permissions.state-mixed');
                        }

                        return html`
                            <div
                                class="checkbox-container ${classMap({
                                    'is-locked': Boolean(permission?.locked),
                                    'is-granted': isGranted,
                                    'is-mixed': isMixed,
                                })}">
                                <span
                                    class="permission-state"
                                    role="img"
                                    aria-label="${actionName}: ${stateText}"
                                    title="${permission?.locked ? title : `${actionName}: ${stateText}`}">
                                    ${
                                        isGranted
                                            ? html`
                                                  <dbp-icon name="checkmark"></dbp-icon>
                                              `
                                            : ''
                                    }
                                </span>
                                <span class="checkbox-label" aria-hidden="true">${actionName}</span>
                                ${lockIcon}
                            </div>
                        `;
                    }

                    return html`
                        <div
                            class="checkbox-container ${classMap({
                                'is-locked': Boolean(permission?.locked),
                                'is-changed': isChanged,
                            })}">
                            <label for="${inputId}" class="checkbox-label">${actionName}</label>
                            <input
                                id="${inputId}"
                                name="${actionValue}"
                                class="permission-checkbox"
                                title="${title}"
                                type="checkbox"
                                @change="${(event) =>
                                    this.handleCheckbox(event, holder, actionValue)}"
                                ?disabled="${isDisabled}"
                                .indeterminate="${
                                    Boolean(permission?.mixed) &&
                                    (permission?.desiredGranted ?? null) === null
                                }"
                                .checked="${isChecked}" />
                            ${lockIcon}
                        </div>
                    `;
                })}
            </div>
        `;
    }

    renderHolderActions(holder) {
        const i18n = this._i18n;
        const isEditing = this.holdersInEdit.has(holder.key);
        const isProtected = this.protectedHolderKeys.has(holder.key);
        const hasRemovableGrants = [...holder.permissions.values()].some((permission) =>
            [...permission.grantsByResource.values()].some((grant) => !grant.locked),
        );
        const isNew = this.isHolderNew(holder);

        if (holder.isSystem || (!hasRemovableGrants && !isNew)) {
            return html`
                <div class="action-buttons">
                    <span class="read-only-hint">
                        <dbp-icon name="lock" aria-hidden="true"></dbp-icon>
                        ${i18n.t('grant-permission-dialog.holder.read-only')}
                    </span>
                </div>
            `;
        }

        return html`
            <div class="action-buttons">
                ${
                    isEditing
                        ? html`
                              <dbp-button
                                  type="is-primary"
                                  no-spinner-on-click
                                  @click="${() => this.saveHolderPermissions(holder.key)}">
                                  <dbp-icon name="save" aria-hidden="true"></dbp-icon>
                                  ${i18n.t('grant-permission-dialog.buttons.save-text')}
                              </dbp-button>
                              <dbp-icon-button
                                  icon-name="close"
                                  class="row-icon-button"
                                  aria-label="${i18n.t(
                                      'grant-permission-dialog.buttons.cancel-edit-text',
                                      {name: holder.displayName},
                                  )}"
                                  title="${i18n.t(
                                      'grant-permission-dialog.buttons.cancel-edit-text',
                                      {name: holder.displayName},
                                  )}"
                                  @click="${() => this.cancelEdit(holder.key)}"></dbp-icon-button>
                          `
                        : html`
                              <dbp-icon-button
                                  icon-name="pencil"
                                  class="row-icon-button"
                                  aria-label="${i18n.t(
                                      'grant-permission-dialog.buttons.edit-text',
                                      {
                                          name: holder.displayName,
                                      },
                                  )}"
                                  title="${i18n.t('grant-permission-dialog.buttons.edit-text', {
                                      name: holder.displayName,
                                  })}"
                                  @click="${() => this.startEdit(holder.key)}"></dbp-icon-button>
                          `
                }
                ${
                    isNew
                        ? ''
                        : html`
                              <dbp-icon-button
                                  icon-name="trash"
                                  class="row-icon-button row-icon-button--danger"
                                  aria-label="${i18n.t(
                                      'grant-permission-dialog.buttons.delete-text',
                                      {name: holder.displayName},
                                  )}"
                                  title="${
                                      isProtected
                                          ? i18n.t(
                                                'grant-permission-dialog.permissions.last-manager-title',
                                            )
                                          : i18n.t('grant-permission-dialog.buttons.delete-text', {
                                                name: holder.displayName,
                                            })
                                  }"
                                  ?disabled="${isProtected}"
                                  @click="${() =>
                                      this.handleDeleteButton(holder.key)}"></dbp-icon-button>
                          `
                }
            </div>
        `;
    }

    renderHolderRow(holder) {
        const isEditing = this.holdersInEdit.has(holder.key);
        return html`
            <div
                class="holder-row ${classMap({
                    'edit-mode': isEditing,
                    'is-system': Boolean(holder.isSystem),
                })}"
                data-holder-key="${holder.key}">
                ${this.renderHolderInfo(holder)} ${this.renderPermissionCheckboxes(holder)}
                ${this.renderHolderActions(holder)}
            </div>
        `;
    }

    renderHolderSections() {
        return HOLDER_TYPES.map((holderType) => {
            const holders = this.getSortedHolders(holderType);
            if (holders.length === 0) {
                return '';
            }
            const headingId = `holder-section-${holderType}`;

            return html`
                <section class="holder-section" aria-labelledby="${headingId}">
                    <h3 id="${headingId}" class="holder-section-title">
                        ${this.getHolderTypeTexts(holderType).section}
                        <span class="holder-section-count">${holders.length}</span>
                    </h3>
                    <div class="holder-rows">
                        ${repeat(
                            holders,
                            (holder) => holder.key,
                            (holder) => this.renderHolderRow(holder),
                        )}
                    </div>
                </section>
            `;
        });
    }

    renderPendingHolder() {
        if (!this.pendingHolderType) {
            return '';
        }

        const i18n = this._i18n;
        const holderType = this.pendingHolderType;
        const texts = this.getHolderTypeTexts(holderType);

        let select;
        switch (holderType) {
            case HOLDER_TYPE_GROUP:
                select = html`
                    <dbp-resource-select
                        subscribe="auth"
                        lang="${this.lang}"
                        resource-path="/authorization/groups"
                        fetch-mode="search"
                        placeholder="${i18n.t('grant-permission-dialog.add.group-placeholder')}"
                        .getSearchQueryParameters="${this.getGroupSearchQueryParameters}"
                        .formatResource="${this.formatGroup}"
                        @change="${(event) => this.handleHolderSelected(event, holderType)}"
                        entry-point-url="${this.entryPointUrl}"></dbp-resource-select>
                `;
                break;
            case HOLDER_TYPE_DYNAMIC_GROUP:
                select = html`
                    <dbp-resource-select
                        subscribe="auth"
                        lang="${this.lang}"
                        resource-path="/authorization/dynamic-groups"
                        no-default
                        placeholder="${i18n.t(
                            'grant-permission-dialog.add.dynamic-group-placeholder',
                        )}"
                        .formatResource="${(select, group) =>
                            this.getDynamicGroupName(group.identifier)}"
                        @change="${(event) => this.handleHolderSelected(event, holderType)}"
                        entry-point-url="${this.entryPointUrl}"></dbp-resource-select>
                `;
                break;
            default:
                select = html`
                    <dbp-resource-select
                        subscribe="auth"
                        lang="${this.lang}"
                        resource-path="/base/people"
                        fetch-mode="search"
                        placeholder="${i18n.t('grant-permission-dialog.add.user-placeholder')}"
                        .getSearchQueryParameters="${this.getPersonSearchQueryParameters}"
                        .formatResource="${this.formatPerson}"
                        @change="${(event) => this.handleHolderSelected(event, holderType)}"
                        entry-point-url="${this.entryPointUrl}"></dbp-resource-select>
                `;
        }

        return html`
            <div class="pending-holder pending-holder--${holderType}">
                <span class="holder-avatar holder-avatar--${holderType}" aria-hidden="true">
                    <dbp-icon name="${HOLDER_ICONS[holderType]}"></dbp-icon>
                </span>
                <div class="pending-holder-body">
                    <span class="pending-holder-title">${texts.addTitle}</span>
                    <p class="pending-holder-description">${texts.addDescription}</p>
                    <div class="pending-holder-select">${select}</div>
                </div>
                <dbp-icon-button
                    icon-name="close"
                    class="row-icon-button"
                    aria-label="${i18n.t('grant-permission-dialog.buttons.cancel-add-text')}"
                    title="${i18n.t('grant-permission-dialog.buttons.cancel-add-text')}"
                    @click="${() => this.cancelAddHolder()}"></dbp-icon-button>
            </div>
        `;
    }

    renderAddToolbar() {
        const i18n = this._i18n;

        return html`
            <div
                class="add-toolbar"
                role="group"
                aria-label="${i18n.t('grant-permission-dialog.add.toolbar-label')}">
                <span class="add-toolbar-label" aria-hidden="true">
                    ${i18n.t('grant-permission-dialog.add.toolbar-label')}
                </span>
                <div class="add-toolbar-buttons">
                    ${HOLDER_TYPES.map(
                        (holderType) => html`
                            <button
                                type="button"
                                class="add-holder-button ${classMap({
                                    'is-active': this.pendingHolderType === holderType,
                                })}"
                                aria-pressed="${this.pendingHolderType === holderType}"
                                ?disabled="${this.isLoading}"
                                @click="${() => this.handleAddHolder(holderType)}">
                                <dbp-icon
                                    name="${HOLDER_ICONS[holderType]}"
                                    aria-hidden="true"></dbp-icon>
                                <span>${this.getHolderTypeTexts(holderType).addButton}</span>
                            </button>
                        `,
                    )}
                </div>
            </div>
        `;
    }

    renderHeaderRow() {
        const i18n = this._i18n;
        if (this.holderList.size === 0 || !Array.isArray(this.availableActions)) {
            return '';
        }

        return html`
            <div class="header-row" aria-hidden="true">
                <div class="holder-header">${i18n.t('grant-permission-dialog.holder-column')}</div>
                <div class="permissions-header">
                    ${this.availableActions.map(
                        (action) => html`
                            <div class="permission-label">${this.getActionName(action)}</div>
                        `,
                    )}
                </div>
                <div></div>
            </div>
        `;
    }

    renderBody() {
        const i18n = this._i18n;

        if (this.isLoading) {
            return html`
                <div class="state-message" role="status">
                    <dbp-icon name="hourglass" aria-hidden="true"></dbp-icon>
                    <span>${i18n.t('grant-permission-dialog.loading')}</span>
                </div>
            `;
        }

        if (this.holderList.size === 0) {
            return html`
                <div class="state-message">
                    <dbp-icon name="key" aria-hidden="true"></dbp-icon>
                    <span>${i18n.t('grant-permission-dialog.empty-state')}</span>
                </div>
            `;
        }

        return html`
            ${this.renderHeaderRow()}
            <div class="holder-sections">${this.renderHolderSections()}</div>
        `;
    }

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
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
        const resourceCount = this.getResourceIdentifiers().length;
        const pendingChangeCount = this.holdersInEdit.size;

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
                    <div
                        class="content-inner ${classMap({stacked: this.isStacked})}"
                        style="--dbp-action-count: ${this.availableActions?.length ?? 0}">
                        <div class="intro">
                            <p class="intro-text">
                                ${i18n.t('grant-permission-dialog.intro', {count: resourceCount})}
                            </p>
                        </div>
                        ${this.renderAddToolbar()} ${this.renderPendingHolder()}
                        ${this.renderBody()}
                    </div>
                </div>

                <menu slot="footer" class="footer-menu">
                    <span class="footer-status" aria-live="polite">
                        ${
                            pendingChangeCount > 0
                                ? i18n.t('grant-permission-dialog.pending-changes', {
                                      count: pendingChangeCount,
                                  })
                                : ''
                        }
                    </span>
                    <dbp-button
                        no-spinner-on-click
                        type="is-secondary"
                        @click="${() => {
                            this.dispatchEvent(
                                new CustomEvent('dbp-modal-closed', {
                                    detail: {id: 'grant-permission-modal'},
                                    bubbles: true,
                                    composed: true,
                                }),
                            );
                        }}">
                        ${i18n.t('grant-permission-dialog.buttons.cancel-text')}
                    </dbp-button>
                    <dbp-button
                        no-spinner-on-click
                        id="permission-save-button"
                        ?disabled="${pendingChangeCount === 0}"
                        @click="${() => this.saveHolderPermissions()}"
                        type="is-primary">
                        ${i18n.t('grant-permission-dialog.buttons.save-all-text')}
                    </dbp-button>
                </menu>
            </dbp-modal>

            <dbp-modal
                id="deletion-confirmation-modal--grant-permission"
                class="modal modal--confirmation"
                modal-id="deletion-confirmation-modal"
                title="${i18n.t('grant-permission-dialog.delete-confirmation.title')}"
                subscribe="lang">
                <div slot="content">
                    <p>
                        ${i18n.t('grant-permission-dialog.delete-confirmation.message', {
                            name: this.deletionCandidateName,
                        })}
                    </p>
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
