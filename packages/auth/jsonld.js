"use strict";

let instances = {};
let successFunctions = {};
let failureFunctions = {};
let initStarted = {};

module.exports = class JSONLD {
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

    static initialize(apiUrl, successFnc, failureFnc) {
        // if init api call was already successfully finished execute the success function
        if (instances[apiUrl] !== undefined) {
            if (typeof successFnc == 'function') successFnc(instances[apiUrl]);

            return;
        }

        // init the arrays
        if (successFunctions[apiUrl] === undefined) successFunctions[apiUrl] = [];
        if (failureFunctions[apiUrl] === undefined) failureFunctions[apiUrl] = [];

        // add success and failure functions
        if (typeof successFnc == 'function') successFunctions[apiUrl].push(successFnc);
        if (typeof failureFnc == 'function') failureFunctions[apiUrl].push(failureFnc);

        // check if api call was already started
        if (initStarted[apiUrl] !== undefined) {
            return;
        }

        initStarted[apiUrl] = true;

        // window.VPUAuthToken will be set by on vpu-auth-init
        document.addEventListener("vpu-auth-init", function(e)
        {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", apiUrl, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + window.VPUAuthToken);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const json = JSON.parse(xhr.responseText);

                    let entryPoints = {};
                    for (let property in json) {
                        // for some reason the properties start with a lower case character
                        if (!property.startsWith("@")) entryPoints[property.toLowerCase()] = json[property];
                    }

                    // read the link header of the api response
                    const utils = require("./utils");
                    const links = utils.parseLinkHeader(this.getResponseHeader("link"));

                    // get the hydra apiDocumentation url
                    const apiDocUrl = links["http://www.w3.org/ns/hydra/core#apiDocumentation"];

                    if (apiDocUrl !== undefined) {
                        // load the hydra apiDocumentation
                        const docXhr = new XMLHttpRequest();
                        docXhr.open("GET", apiDocUrl, true);
                        docXhr.setRequestHeader("Content-Type", "application/json");
                        docXhr.onreadystatechange = function () {
                            if (docXhr.readyState === 4 && docXhr.status === 200) {
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
                                instances[apiUrl] = instance;

                                // return the initialized JSONLD object
                                for (const fnc of successFunctions[apiUrl]) if (typeof fnc == 'function') fnc(instance);
                                successFunctions[apiUrl] = [];
                            } else {
                                for (const fnc of failureFunctions[apiUrl]) if (typeof fnc == 'function') fnc();
                                failureFunctions[apiUrl] = [];
                            }
                        };

                        docXhr.send();
                    } else {
                        for (const fnc of failureFunctions[apiUrl]) if (typeof fnc == 'function') fnc();
                        failureFunctions[apiUrl] = [];
                    }
                } else {
                    for (const fnc of failureFunctions[apiUrl]) if (typeof fnc == 'function') fnc();
                    failureFunctions[apiUrl] = [];
                }
            };

            xhr.send();
        });
    }

    static getInstance(apiUrl) {
        return instances[apiUrl];
    }

    getEntityForIdentifier(identifier) {
        let entityName = this.getEntityNameForIdentifier(identifier);
        return this.getEntityForEntityName(entityName);
    }

    getEntityForEntityName(entityName) {
        return this.entities[entityName];
    }

    getApiUrlForIdentifier(identifier) {
        return this.getEntityForIdentifier(identifier)["@entryPoint"];
    }

    getApiUrlForEntityName(entityName) {
        return this.getEntityForEntityName(entityName)["@entryPoint"];
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
     */
    expandMember(member) {
        const type = member["@type"];

        const entity = this.getEntityForIdentifier(type);
        let result = {"@id": member["@id"]};

        entity["hydra:supportedProperty"].forEach(function (property) {
            const id = property["hydra:property"]["@id"];
            const title = property["hydra:title"];

            result[id] = member[title];
        });

        return result;
    }

    /**
     * Compacts an expanded member of a list to a object with local properties
     *
     * @param member
     * @param localContext
     */
    static compactMember(member, localContext) {
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
     * @returns {Array}
     */
    transformMembers(data, localContext) {
        const members = data['hydra:member'];

        if (members === undefined || members.length === 0) {
            return [];
        }

        let results = [];
        let that = this;

        members.forEach(function (member) {
            results.push(JSONLD.compactMember(that.expandMember(member), localContext));
        });

        return results;
    }
};
