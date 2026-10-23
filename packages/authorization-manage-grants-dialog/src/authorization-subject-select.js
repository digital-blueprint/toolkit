import {LangMixin} from '@dbp-toolkit/common';
import {ResourceSelect, hydra} from '@dbp-toolkit/resource-select';
import {createInstance} from './i18n.js';

const DYNAMIC_USER_GROUP_PATH = '/authorization/dynamic-user-groups';
const RESOURCE_PATHS = ['/base/people', '/authorization/user-groups', DYNAMIC_USER_GROUP_PATH];
// One page holds more than the dropdown can show: the API filters people and user groups
// server-side, and there is only a handful of dynamic user groups. getCollection() warns if
// a collection ever grows beyond that.
const MAX_PAGES = 1;

const SUBJECT_TYPE_PERSON = 'person';
const SUBJECT_TYPE_USER_GROUP = 'user-group';
const SUBJECT_TYPE_DYNAMIC_USER_GROUP = 'dynamic-user-group';

// Dynamic user groups have no item endpoint, so the API cannot give them a real IRI and mints
// a new blank node ID on every request. This prefix marks the stable replacement we build from
// their identifier. People and user groups use their path-shaped IRI, so it cannot collide.
const DYNAMIC_USER_GROUP_VALUE_PREFIX = 'dynamic-user-group:';

/**
 * @typedef {{
 *     '@id'?: string,
 *     '@type'?: string|string[],
 *     identifier?: string,
 *     name?: string,
 *     givenName?: string,
 *     familyName?: string
 * }} SubjectResource
 */

// The base class already uses "_i18n" for the translations of the resource select itself,
// so the subject translations get their own instance.
export class AuthorizationSubjectSelect extends LangMixin(
    ResourceSelect,
    createInstance,
    '_subjectI18n',
) {
    constructor() {
        super();
        this.fetchMode = 'search';
        this._subjectSearchRequest = null;
    }

    disconnectedCallback() {
        this._subjectSearchRequest?.controller.abort();
        this._subjectSearchRequest = null;
        this._isSearching = false;
        super.disconnectedCallback();
    }

    /**
     * Builds the server-side search parameters for searchable subject collections.
     *
     * @param {ResourceSelect} select - Resource select requesting the parameters.
     * @param {string} searchTerm - Current user-entered search term.
     * @returns {{search: string}} Search query parameters.
     */
    getSearchQueryParameters(select, searchTerm) {
        return {
            search: searchTerm.trim(),
        };
    }

    /**
     * Checks whether a JSON-LD resource declares the expected type.
     *
     * @param {SubjectResource} resource - JSON-LD resource to inspect.
     * @param {string} expectedType - JSON-LD type to find.
     * @returns {boolean} Whether the resource declares the type.
     */
    _hasResourceType(resource, expectedType) {
        const types = Array.isArray(resource['@type']) ? resource['@type'] : [resource['@type']];
        return types.includes(expectedType);
    }

    /**
     * Determines which kind of subject a resource is.
     *
     * @param {SubjectResource} resource - Subject resource to inspect.
     * @returns {string|null} One of the SUBJECT_TYPE_* values, or null when unsupported.
     */
    _getSubjectType(resource) {
        const id = resource['@id'] ?? '';

        if (this._hasResourceType(resource, 'AuthorizationDynamicUserGroup')) {
            return SUBJECT_TYPE_DYNAMIC_USER_GROUP;
        }
        if (
            this._hasResourceType(resource, 'AuthorizationUserGroup') ||
            id.startsWith('/authorization/user-groups/')
        ) {
            return SUBJECT_TYPE_USER_GROUP;
        }
        if (
            this._hasResourceType(resource, 'https://schema.org/Person') ||
            id.startsWith('/base/people/')
        ) {
            return SUBJECT_TYPE_PERSON;
        }

        return null;
    }

    /**
     * Formats a supported subject with its translated subject type.
     *
     * @param {ResourceSelect} select - Resource select displaying the subject.
     * @param {SubjectResource} resource - Subject resource to format.
     * @returns {string} Human-readable subject label, or an empty string when unusable.
     */
    formatResource(select, resource) {
        const i18n = this._subjectI18n;
        let text;
        let type;

        switch (this._getSubjectType(resource)) {
            case SUBJECT_TYPE_DYNAMIC_USER_GROUP:
                text = resource.identifier ?? '';
                type = i18n.t('auth-manage-dialog.subject-types.dynamic-user-group');
                break;
            case SUBJECT_TYPE_USER_GROUP:
                text = resource.name ?? '';
                type = i18n.t('auth-manage-dialog.subject-types.user-group');
                break;
            case SUBJECT_TYPE_PERSON:
                text = [resource.givenName, resource.familyName].filter(Boolean).join(' ');
                type = i18n.t('auth-manage-dialog.subject-types.person');
                break;
            default:
                return '';
        }

        return text ? `${text} [${type}]` : '';
    }

    /**
     * The grant holder fields of a subject, to be posted to
     * /authorization/resource-action-grants. Exactly one of them identifies the holder.
     *
     * @param {SubjectResource} resource - Subject resource to grant something to.
     * @returns {object|null} Grant holder fields, or null for an unsupported subject.
     */
    getGrantHolder(resource) {
        switch (this._getSubjectType(resource)) {
            case SUBJECT_TYPE_PERSON:
                return {userIdentifier: resource.identifier};
            case SUBJECT_TYPE_USER_GROUP:
                // The only subject the API addresses by IRI instead of by identifier
                return {userGroup: resource['@id']};
            case SUBJECT_TYPE_DYNAMIC_USER_GROUP:
                return {dynamicUserGroupIdentifier: resource.identifier};
            default:
                return null;
        }
    }

    /**
     * Builds a collection URL and omits unsupported search parameters for dynamic groups.
     *
     * @param {string} resourcePath - API collection path.
     * @param {string} searchTerm - Current user-entered search term.
     * @returns {string} Absolute collection URL.
     */
    _getSubjectCollectionUrl(resourcePath, searchTerm) {
        let url = new URL(resourcePath, this.entryPointUrl).href;
        url = this.buildUrl(this, url);

        const parsedUrl = new URL(url);
        this._setQueryParameters(parsedUrl, this.getCollectionQueryParameters(this));
        if (resourcePath !== DYNAMIC_USER_GROUP_PATH) {
            this._setQueryParameters(parsedUrl, this.getSearchQueryParameters(this, searchTerm));
        }
        if (!parsedUrl.searchParams.has('perPage')) {
            parsedUrl.searchParams.set('perPage', String(this.perPage));
        }

        return parsedUrl.href;
    }

    /**
     * Fetches one page of a collection, filters dynamic groups locally and gives them a
     * stable ID.
     *
     * @param {string} resourcePath - API collection path.
     * @param {string} searchTerm - Current user-entered search term.
     * @param {AbortSignal} [signal] - Signal used to cancel the request.
     * @returns {Promise<SubjectResource[]>} Matching resources from the collection.
     */
    async _fetchSubjectCollection(resourcePath, searchTerm, signal) {
        const hasServerSideSearch = resourcePath !== DYNAMIC_USER_GROUP_PATH;
        const resources = /** @type {SubjectResource[]} */ (
            await hydra.getCollection(
                this._getSubjectCollectionUrl(resourcePath, searchTerm),
                this.lang,
                () => this.auth.token,
                {signal, maxPages: MAX_PAGES},
            )
        );

        if (hasServerSideSearch) {
            return resources;
        }

        // Filter dynamic groups locally because their API does not support server-side search.
        const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase(this.lang);
        return (
            resources
                .filter((resource) =>
                    String(resource.identifier ?? '')
                        .toLocaleLowerCase(this.lang)
                        .includes(normalizedSearchTerm),
                )
                // Replace the blank node ID right where the resources enter the component, so
                // everything working with IDs keeps the selection stable across requests.
                .map((resource) => ({
                    ...resource,
                    '@id': DYNAMIC_USER_GROUP_VALUE_PREFIX + resource.identifier,
                }))
        );
    }

    /**
     * Resolves a selected value back to its resource, for example to restore a selection
     * that was set from the outside. Dynamic user groups can only be fetched as a
     * collection, the other subjects have an item endpoint.
     *
     * @param {string} value - Selected resource ID.
     * @returns {Promise<SubjectResource>} The resource belonging to the value.
     */
    async _fetchResource(value) {
        if (!value.startsWith(DYNAMIC_USER_GROUP_VALUE_PREFIX)) {
            return super._fetchResource(value);
        }

        const groups = await this._fetchSubjectCollection(DYNAMIC_USER_GROUP_PATH, '');
        const group = groups.find((resource) => resource['@id'] === value);
        if (group === undefined) {
            throw new Error(`Unknown dynamic user group "${value}"`);
        }

        return group;
    }

    /**
     * Fetches, merges, deduplicates, and sorts all supported subject collections.
     *
     * @param {string} searchTerm - Current user-entered search term.
     * @param {AbortSignal} [signal] - Signal used to cancel all collection requests.
     * @returns {Promise<SubjectResource[]>} Merged and sorted subject resources.
     */
    async _fetchSubjectResources(searchTerm, signal) {
        const results = await Promise.allSettled(
            RESOURCE_PATHS.map((resourcePath) =>
                this._fetchSubjectCollection(resourcePath, searchTerm, signal),
            ),
        );

        // Keep the results of the other collections if one of them fails, for example when
        // the user is not allowed to list dynamic user groups. There is nothing the user
        // could do about it, so only tell the developers.
        const collections = results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            }
            if (result.reason?.name !== 'AbortError') {
                console.error(`Searching "${RESOURCE_PATHS[index]}" failed`, result.reason);
            }

            return [];
        });

        // The API paths form distinct collections, but deduplicate by ID defensively.
        const resourcesById = new Map();
        for (const resource of collections.flat()) {
            if (resource['@id'] && this.formatResource(this, resource)) {
                resourcesById.set(resource['@id'], resource);
            }
        }

        return [...resourcesById.values()].sort((first, second) =>
            this.formatResource(this, first).localeCompare(
                this.formatResource(this, second),
                this.lang,
            ),
        );
    }

    /**
     * Connects the asynchronous subject search to Select2 with cancellation support.
     *
     * @param {{data?: {searchTerm?: string}}} parameters - Select2 transport parameters.
     * @param {(resources: SubjectResource[]) => void} success - Successful search callback.
     * @param {() => void} failure - Failed search callback.
     * @returns {{abort: () => void}} Abortable Select2 transport handle.
     */
    _transportSubjectSearch(parameters, success, failure) {
        const controller = new AbortController();
        const request = {controller};
        this._subjectSearchRequest = request;
        this._isSearching = true;

        void this._fetchSubjectResources(parameters.data?.searchTerm ?? '', controller.signal)
            .then((resources) => {
                // A cancelled search has no results worth showing, the next one is on its way
                if (!controller.signal.aborted) {
                    success(resources);
                }
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error(error);
                    failure();
                }
            })
            .finally(() => {
                if (this._subjectSearchRequest === request) {
                    this._subjectSearchRequest = null;
                    this._isSearching = false;
                }
            });

        return {
            abort: () => controller.abort(),
        };
    }

    /**
     * Searches all supported subject collections instead of the single collection of the
     * base class, so Select2 needs a custom transport instead of a request URL.
     *
     * @returns {object} The select2 ajax options
     */
    _getSearchAjaxOptions() {
        return {
            data: (parameters) => ({searchTerm: parameters.term ?? ''}),
            transport: (parameters, success, failure) =>
                this._transportSubjectSearch(parameters, success, failure),
            processResults: (resources) => {
                this._resources = resources;

                return {
                    results: resources.map((resource) => ({
                        id: resource['@id'],
                        _resultId: `result-${resource['@id']}`,
                        text: this._getText(resource),
                        resource,
                    })),
                };
            },
        };
    }
}
