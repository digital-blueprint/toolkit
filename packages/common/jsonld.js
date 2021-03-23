import {send as notify} from './notification';
import * as utils from "./utils";
import {i18n} from "./i18n";

export default class JSONLD {
    constructor(baseApiUrl, entities) {
        this.entities = entities;
        this.baseApiUrl = baseApiUrl;

        let idToEntityNameMatchList = {};
        for (const entityName in entities) {
            const id = entities[entityName]["@id"];
            idToEntityNameMatchList[id] = entityName;
        }

        this.idToEntityNameMatchList = idToEntityNameMatchList;
    }

    static async getInstance(apiUrl, lang = 'de') {
        let promise = JSONLD.promises[apiUrl];
        if (promise === undefined) {
            JSONLD.doInitializationOnce(apiUrl);
            promise = new Promise((resolve, reject) => {
                JSONLD.initialize(
                    apiUrl,
                    (instance) => resolve(instance),
                    (error) => reject(error),
                    lang
                );
            });
            JSONLD.promises[apiUrl] = promise;
        }
        return promise;
    }

    static initialize(apiUrl, successFnc, failureFnc, lang = 'de') {
        if (lang !== 'de') {
            i18n.changeLanguage(lang);
        }

        // if init api call was already successfully finished execute the success function
        if (JSONLD.instances[apiUrl] !== undefined) {
            if (typeof successFnc == 'function') successFnc(JSONLD.instances[apiUrl]);

            return;
        }

        // init the arrays
        if (JSONLD.successFunctions[apiUrl] === undefined) JSONLD.successFunctions[apiUrl] = [];
        if (JSONLD.failureFunctions[apiUrl] === undefined) JSONLD.failureFunctions[apiUrl] = [];

        // add success and failure functions
        if (typeof successFnc == 'function') JSONLD.successFunctions[apiUrl].push(successFnc);
        if (typeof failureFnc == 'function') JSONLD.failureFunctions[apiUrl].push(failureFnc);
    }

    /**
     * This should be run as soon as possible (can be run multiple times)
     *
     * @param apiUrl
     */
    static doInitializationOnce(apiUrl) {
        // console.log("doInitializationOnce", apiUrl);

        // check if api call was already started
        if (!apiUrl || JSONLD.initStarted[apiUrl] !== undefined) {
            return;
        }

        JSONLD.initStarted[apiUrl] = true;
        JSONLD._doInitialization(apiUrl);
        // console.log("doInitializationOnce Done", apiUrl);
    }

    static _doInitialization(apiUrl) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status === 200) {
                const json = JSON.parse(xhr.responseText);

                let entryPoints = {};
                for (let property in json) {
                    // for some reason the properties start with a lower case character
                    if (!property.startsWith("@")) entryPoints[property.toLowerCase()] = json[property];
                }

                // read the link header of the api response
                //                const utils = require("./utils");
                const links = utils.parseLinkHeader(this.getResponseHeader("link"));

                // get the hydra apiDocumentation url
                const apiDocUrl = links["http://www.w3.org/ns/hydra/core#apiDocumentation"];

                if (apiDocUrl !== undefined) {
                    // load the hydra apiDocumentation
                    const docXhr = new XMLHttpRequest();
                    docXhr.open("GET", apiDocUrl, true);
                    docXhr.setRequestHeader("Content-Type", "application/json");
                    docXhr.onreadystatechange = function () {
                        if (docXhr.readyState !== 4) {
                            return;
                        }

                        if (docXhr.status === 200) {
                            JSONLD.gatherEntities(docXhr, apiUrl, entryPoints);
                        } else {
                            JSONLD.executeFailureFunctions(apiUrl, i18n.t('jsonld.api-documentation-server', {apiUrl: apiDocUrl}));
                        }
                    };

                    docXhr.send();
                } else {
                    JSONLD.executeFailureFunctions(apiUrl, i18n.t('jsonld.error-hydra-documentation-url-not-set', {apiUrl: apiUrl}));
                }
            } else {
                JSONLD.executeFailureFunctions(apiUrl, i18n.t('jsonld.error-api-server', {apiUrl: apiUrl}));
            }
        };

        xhr.send();
    }

    /**
     * Gather the entities
     *
     * @param docXhr
     * @param apiUrl
     * @param entryPoints
     */
    static gatherEntities(docXhr, apiUrl, entryPoints) {
        const json = JSON.parse(docXhr.responseText);
        const supportedClasses = json["hydra:supportedClass"];

        let entities = {};
        const baseUrl = utils.parseBaseUrl(apiUrl);

        // gather the entities
        supportedClasses.forEach(function (classData) {
            // add entry point url
            const entityName = classData["hydra:title"];
            let entryPoint = entryPoints[entityName.toLowerCase()];
            if (entryPoint !== undefined && !entryPoint.startsWith("http")) entryPoint = baseUrl + entryPoint;
            classData["@entryPoint"] = entryPoint;

            entities[entityName] = classData;
        });

        const instance = new JSONLD(baseUrl, entities);
        JSONLD.instances[apiUrl] = instance;

        // return the initialized JSONLD object
        if (JSONLD.successFunctions[apiUrl] !== undefined) {
            for (const fnc of JSONLD.successFunctions[apiUrl]) {
                if (typeof fnc == 'function') {
                    fnc(instance);
                }
            }
        }
        JSONLD.successFunctions[apiUrl] = [];
    }

    /**
     * Execute failure functions and send general notification
     *
     * @param apiUrl
     * @param message
     */
    static executeFailureFunctions(apiUrl, message = "") {
        if (JSONLD.failureFunctions[apiUrl] !== undefined) {
            for (const fnc of JSONLD.failureFunctions[apiUrl]) {
                if (typeof fnc == 'function') {
                    fnc(new Error(message));
                }
            }
        }
        JSONLD.failureFunctions[apiUrl] = [];

        if (message !== "") {
            notify({
                "summary": i18n.t('error.summary'),
                "body": message,
                "type": "danger",
            });
        }
    }

    getEntityForIdentifier(identifier) {
        let entityName = this.getEntityNameForIdentifier(identifier);
        return this.getEntityForEntityName(entityName);
    }

    getEntityForEntityName(entityName) {
        return this.entities[entityName];
    }

    getApiUrlForIdentifier(identifier) {
        const entity = this.getEntityForIdentifier(identifier);

        if (entity === undefined || entity["@entryPoint"] === undefined) {
            throw new Error(`Entity with identifier "${identifier}" not found!`);
        }

        return entity["@entryPoint"];
    }

    getApiUrlForEntityName(entityName) {
        const entity = this.getEntityForEntityName(entityName);

        if (entity === undefined || entity["@entryPoint"] === undefined) {
            throw new Error(`Entity "${entityName}" not found!`);
        }

        return entity["@entryPoint"];
    }

    getEntityNameForIdentifier(identifier) {
        return this.idToEntityNameMatchList[identifier];
    }

    getApiIdentifierList() {
        let keys = [];
        for (const property in this.idToEntityNameMatchList) {
            keys.push(property);
        }

        return keys;
    }

    /**
     * Expands a member of a list to a object with schema.org properties
     *
     * @param member
     * @param [context]
     */
    expandMember(member, context) {
        if (context === undefined) {
            context = member["@context"];
        }

        let result = {"@id": member["@id"]};
        for (const key of Object.keys(context)) {
            const value = context[key];
            if (member[key] !== undefined)
                result[value] = member[key];
        }

        return result;
    }

    /**
     * Compacts an expanded member of a list to a object with local properties
     *
     * @param member
     * @param localContext
     */
    compactMember(member, localContext) {
        let result = {};

        for (const property in localContext) {
            const value = member[localContext[property]];

            if (value !== undefined) {
                result[property] = value;
            }
        }

        return result;
    }

    /**
     * Transforms hydra members to a local context
     *
     * @param data
     * @param localContext
     * @returns {Array} An array of transformed objects
     */
    transformMembers(data, localContext) {
        const members = data['hydra:member'];

        if (members === undefined || members.length === 0) {
            return [];
        }

        const otherContext = data['@context'];
        let results = [];
        let that = this;

        members.forEach(function (member) {
            results.push(that.compactMember(that.expandMember(member, otherContext), localContext));
        });

        return results;
    }
}

JSONLD.instances = {};
JSONLD.successFunctions = {};
JSONLD.failureFunctions = {};
JSONLD.initStarted = {};
JSONLD.promises = {};
