import {assert} from 'chai';

import '../src/dbp-tabulator-table';
import '../src/demo';
import {
    applyColumnConfiguration,
    cloneColumnDefinitions,
    createColumnConfiguration,
    reconcileColumnConfiguration,
} from '../src/column-configuration.js';

suite('dbp-tabulator-table basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-tabulator-table');
        node.setAttribute('lang', 'en');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });

    test('optionally places column configuration in the rightmost header', async () => {
        const tableBuilt = new Promise((resolve) =>
            node.addEventListener('dbp-tabulator-table-built', resolve, {once: true}),
        );
        node.options = {
            layout: 'fitColumns',
            columns: [
                {title: 'First', field: 'first'},
                {title: 'Last', field: 'last'},
            ],
        };
        node.columnConfigurationEnabled = true;
        await node.updateComplete;
        await tableBuilt;
        await node.updateComplete;

        assert.isNotNull(node.shadowRoot.querySelector('.column-configuration-toolbar dbp-button'));

        node.columnConfigurationInHeader = true;
        await node.updateComplete;
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const definitions = node.getColumnDefinitions();
        const lastHeader = node.tabulatorTable.getColumn('last').getElement();
        assert.deepEqual(
            definitions.map((definition) => definition.field),
            ['first', 'last'],
        );
        assert.isTrue(lastHeader.classList.contains('column-configuration-header'));
        const configurationButton = lastHeader.querySelector('[icon-name="cog"]');
        assert.equal(
            configurationButton.getAttribute('aria-label'),
            'Configure which columns to display',
        );
        assert.equal(configurationButton.getAttribute('title'), 'Table configuration');
        assert.isNull(node.shadowRoot.querySelector('.column-configuration-toolbar'));
    });
});

suite('column configuration', () => {
    test('creates configuration only for safe columns', () => {
        const definitions = [
            {field: 'index', title: 'Index', frozen: true},
            {field: 'name', title: 'Name'},
            {field: 'email', title: 'Email', visible: false},
            {field: 'actions', title: 'Actions'},
            {title: 'No field'},
            {field: 'duplicate', title: 'First duplicate'},
            {field: 'duplicate', title: 'Second duplicate'},
        ];

        assert.deepEqual(createColumnConfiguration(definitions, ['actions']), [
            {field: 'name', title: 'Name', visible: true, parentPath: 'root', parentTitle: ''},
            {
                field: 'email',
                title: 'Email',
                visible: false,
                parentPath: 'root',
                parentTitle: '',
            },
        ]);
    });

    test('preserves complete definitions when applying visibility and order', () => {
        const formatter = () => 'formatted';
        const definitions = [
            {field: 'index', frozen: true},
            {field: 'name', formatter},
            {field: 'email', sorter: 'string'},
            {field: 'actions', frozen: true},
        ];

        const result = applyColumnConfiguration(definitions, [
            {field: 'email', visible: false},
            {field: 'name', visible: true},
        ]);

        assert.deepEqual(
            result.map((definition) => definition.field),
            ['index', 'email', 'name', 'actions'],
        );
        assert.isFalse(result[1].visible);
        assert.strictEqual(result[2].formatter, formatter);
        assert.notStrictEqual(result, definitions);
    });

    test('reorders grouped columns only among siblings', () => {
        const definitions = [
            {
                title: 'Contact',
                columns: [{field: 'name'}, {field: 'email'}],
            },
            {field: 'status'},
        ];

        const result = applyColumnConfiguration(definitions, [
            {field: 'status', visible: true},
            {field: 'email', visible: true},
            {field: 'name', visible: true},
        ]);

        assert.deepEqual(
            result[0].columns.map((definition) => definition.field),
            ['email', 'name'],
        );
        assert.equal(result[1].field, 'status');
    });

    test('reconciles persisted settings with added and removed columns', () => {
        const current = createColumnConfiguration([
            {field: 'name', title: 'Current name'},
            {field: 'newField', title: 'New field', visible: false},
        ]);
        const restored = reconcileColumnConfiguration(current, [
            {field: 'removedField', visible: true},
            {field: 'name', visible: false},
        ]);

        assert.deepEqual(restored, [
            {
                field: 'name',
                title: 'Current name',
                visible: false,
                parentPath: 'root',
                parentTitle: '',
            },
            {
                field: 'newField',
                title: 'New field',
                visible: false,
                parentPath: 'root',
                parentTitle: '',
            },
        ]);
    });

    test('clones nested definitions without losing callbacks', () => {
        const formatter = () => 'formatted';
        const definitions = [{title: 'Group', columns: [{field: 'name', formatter}]}];
        const clone = cloneColumnDefinitions(definitions);

        assert.notStrictEqual(clone, definitions);
        assert.notStrictEqual(clone[0].columns, definitions[0].columns);
        assert.strictEqual(clone[0].columns[0].formatter, formatter);
    });
});

suite('dbp-tabulator-table demo', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-tabulator-table-demo');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});
