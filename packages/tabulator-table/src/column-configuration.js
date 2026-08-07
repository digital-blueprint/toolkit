/**
 * Clone column definitions while retaining callbacks and other non-serializable values.
 *
 * @param {object[]} definitions
 * @returns {object[]}
 */
export function cloneColumnDefinitions(definitions) {
    if (!Array.isArray(definitions)) return [];

    return definitions.map((definition) => {
        const clone = {...definition};
        if (Array.isArray(definition.columns)) {
            clone.columns = cloneColumnDefinitions(definition.columns);
        }
        return clone;
    });
}

/**
 * Create the lightweight model shown in the column configuration dialog.
 *
 * @param {object[]} definitions
 * @param {string[]} excludedFields
 * @param {object} localizedTitles
 * @returns {{field: string, title: string, visible: boolean, parentPath: string, parentTitle: string}[]}
 */
export function createColumnConfiguration(definitions, excludedFields = [], localizedTitles = {}) {
    const fieldCounts = countFields(definitions);
    const excluded = new Set(excludedFields);
    const configuration = [];

    collectConfigurableColumns(
        definitions,
        configuration,
        fieldCounts,
        excluded,
        localizedTitles,
        'root',
        '',
    );

    return configuration;
}

/**
 * Apply visibility and sibling order without replacing complete column definitions.
 * Non-configurable columns and column groups retain their positions.
 *
 * @param {object[]} definitions
 * @param {{field: string, visible: boolean}[]} configuration
 * @param {string[]} excludedFields
 * @returns {object[]}
 */
export function applyColumnConfiguration(definitions, configuration, excludedFields = []) {
    const clonedDefinitions = cloneColumnDefinitions(definitions);
    const fieldCounts = countFields(clonedDefinitions);
    const excluded = new Set(excludedFields);
    const configurationByField = new Map(
        configuration.map((column, index) => [column.field, {...column, index}]),
    );

    return applyToSiblings(clonedDefinitions, fieldCounts, excluded, configurationByField);
}

/**
 * Reconcile stored preferences with current definitions.
 *
 * @param {{field: string, visible: boolean}[]} currentConfiguration
 * @param {{field: string, visible: boolean}[]} storedConfiguration
 * @returns {{field: string, title: string, visible: boolean, parentPath: string, parentTitle: string}[]}
 */
export function reconcileColumnConfiguration(currentConfiguration, storedConfiguration) {
    if (!Array.isArray(storedConfiguration)) return currentConfiguration;

    const currentByField = new Map(currentConfiguration.map((column) => [column.field, column]));
    const restored = [];

    for (const storedColumn of storedConfiguration) {
        const currentColumn = currentByField.get(storedColumn?.field);
        if (!currentColumn) continue;

        restored.push({
            ...currentColumn,
            visible:
                typeof storedColumn.visible === 'boolean'
                    ? storedColumn.visible
                    : currentColumn.visible,
        });
        currentByField.delete(storedColumn.field);
    }

    // New columns remain available with their current default visibility.
    restored.push(...currentConfiguration.filter((column) => currentByField.has(column.field)));
    return restored;
}

function countFields(definitions, counts = new Map()) {
    for (const definition of definitions || []) {
        if (Array.isArray(definition.columns)) {
            countFields(definition.columns, counts);
        } else if (typeof definition.field === 'string' && definition.field !== '') {
            counts.set(definition.field, (counts.get(definition.field) || 0) + 1);
        }
    }
    return counts;
}

function isConfigurable(definition, fieldCounts, excluded) {
    return (
        typeof definition.field === 'string' &&
        definition.field !== '' &&
        fieldCounts.get(definition.field) === 1 &&
        definition.frozen !== true &&
        definition.formatter !== 'responsiveCollapse' &&
        !excluded.has(definition.field)
    );
}

function collectConfigurableColumns(
    definitions,
    configuration,
    fieldCounts,
    excluded,
    localizedTitles,
    parentPath,
    parentTitle,
) {
    definitions.forEach((definition, index) => {
        if (Array.isArray(definition.columns)) {
            collectConfigurableColumns(
                definition.columns,
                configuration,
                fieldCounts,
                excluded,
                localizedTitles,
                `${parentPath}.${index}`,
                typeof definition.title === 'string' ? definition.title : parentTitle,
            );
        } else if (isConfigurable(definition, fieldCounts, excluded)) {
            const localizedTitle = localizedTitles?.[definition.field];
            configuration.push({
                field: definition.field,
                title:
                    typeof localizedTitle === 'string'
                        ? localizedTitle
                        : typeof definition.title === 'string'
                          ? definition.title
                          : definition.field,
                visible: definition.visible !== false,
                parentPath,
                parentTitle,
            });
        }
    });
}

function applyToSiblings(definitions, fieldCounts, excluded, configurationByField) {
    const updated = definitions.map((definition) => {
        if (Array.isArray(definition.columns)) {
            return {
                ...definition,
                columns: applyToSiblings(
                    definition.columns,
                    fieldCounts,
                    excluded,
                    configurationByField,
                ),
            };
        }

        if (!isConfigurable(definition, fieldCounts, excluded)) return definition;

        const configured = configurationByField.get(definition.field);
        return configured ? {...definition, visible: configured.visible} : definition;
    });

    const configurableIndexes = [];
    const configurableDefinitions = [];
    updated.forEach((definition, index) => {
        if (
            !Array.isArray(definition.columns) &&
            isConfigurable(definition, fieldCounts, excluded) &&
            configurationByField.has(definition.field)
        ) {
            configurableIndexes.push(index);
            configurableDefinitions.push(definition);
        }
    });

    configurableDefinitions.sort(
        (first, second) =>
            configurationByField.get(first.field).index -
            configurationByField.get(second.field).index,
    );
    configurableIndexes.forEach((definitionIndex, index) => {
        updated[definitionIndex] = configurableDefinitions[index];
    });

    return updated;
}
