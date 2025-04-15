import {css} from 'lit';

export const sanitizeForHtmlId = (str) => {
    return str
        .replace(/[^a-z0-9]/gi, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
        .replace(/^[0-9]/, 'id-$&') // Prepend 'id-' if the string starts with a number
        .toLowerCase(); // Convert to lowercase
};

export const getFieldsetCSS = () => {
    // language=css
    return css`
        fieldset {
            border: none;
            margin: 15px 0;
            padding: 0;
        }

        fieldset label {
            font-weight: bold;
            display: block;
            margin-bottom: 0.5em;
        }

        fieldset input:not([type="radio"]):not([type="checkbox"]),
        fieldset select,
        fieldset textarea {
            width: calc(100% - 12px);
            padding: 2px 5px;
            border: var(--dbp-border);
        }
    `;
};

export const validateRequiredFields = async (formElement) => {
    const elementWebComponents = getElementWebComponents(formElement);
    const data = gatherFormDataFromElement(formElement);

    const evaluationPromises = elementWebComponents.map((element) => {
        return new Promise((resolve) => {
            const event = new CustomEvent('evaluate', {
                detail: {
                    data: data,
                    respond: resolve, // Pass a callback for the component to use
                },
            });
            element.dispatchEvent(event);
        });
    });

    const responses = await Promise.all(evaluationPromises);
    return !responses.includes(false); // Return true if no component returned false
};

export const getElementWebComponents = (formElement) => {
    return Array.from(formElement.getElementsByTagName('*')).filter((el) =>
        el.tagName.toLowerCase().match(/^dbp-.*-element$/),
    );
};

/**
 * Converts an object to a string that can be used as a data-value attribute to support non-primitive values
 * @param myObject
 * @returns {string}
 */
export const stringifyForDataValue = (myObject) => {
    return JSON.stringify(myObject).replace(/"/g, '&quot;');
};

export const gatherFormDataFromElement = (formElement) => {
    let customElementValues = {};

    // Gather data from "dbp-.*-element" web components
    const elementWebComponents = getElementWebComponents(formElement);
    console.log('gatherFormDataFromElement elementWebComponents', elementWebComponents);
    elementWebComponents.forEach((element) => {
        const name = element.getAttribute('name') || element.id;
        customElementValues[name] = element.value;
    });

    // Check if any elements have a "data-value" attribute, because we want to use that value instead of the form value
    // Objects, that were stringify-ed by stringifyForDataValue are also supported
    const elementsWithDataValue = formElement.querySelectorAll('[data-value]');
    let dataValues = {};
    elementsWithDataValue.forEach((element) => {
        const name = element.getAttribute('name') || element.id;
        const rawValue = element.getAttribute('data-value');
        // Reverse encoding before parsing
        const decodedValue = rawValue.replace(/&quot;/g, '"');

        try {
            dataValues[name] = JSON.parse(decodedValue);
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            dataValues[name] = rawValue; // If JSON parsing fails, return the raw string
        }
    });

    console.log('gatherFormDataFromElement dataValues', dataValues);
    const data = {};

    // 1. First, add all custom element values as the base
    for (let [key, value] of Object.entries(customElementValues)) {
        setNestedValue(data, key, value);
    }

    // 2. Then process form data, which can override custom element values
    const formData = new FormData(formElement);
    for (let [key, value] of formData.entries()) {
        setNestedValue(data, key, value);
    }

    // 3. Finally, apply dataValues which have the highest priority
    for (let [key, value] of Object.entries(dataValues)) {
        setNestedValue(data, key, value);
    }

    console.log('gatherFormDataFromElement data', data);

    return data;
};

export const setNestedValue = (obj, path, value) => {
    const keys = path.replace(/\]/g, '').split('[');
    let current = obj;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) {
            // Last key, set the value
            current[key] = value;
        } else {
            // Not the last key, create nested object if it doesn't exist
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
    }
};
