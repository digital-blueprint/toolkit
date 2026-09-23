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

    test('persists pagination size under an application-specific key', () => {
        node.identifier = 'people-table';
        node.paginationSizeStorageKey = 'people-table-user-1';
        node.storePaginationSize(20);

        assert.equal(
            node.getPaginationSizeStorageKey(),
            'tabulator-people-table-user-1-pagination-size',
        );
        assert.equal(node.loadPaginationSize(), 20);

        localStorage.removeItem(node.getPaginationSizeStorageKey());
    });

    test('can disable pagination size persistence', () => {
        node.identifier = 'people-table';
        node.paginationSizeStorageKey = '';

        assert.isNull(node.getPaginationSizeStorageKey());
        assert.isNull(node.loadPaginationSize());
    });

    test('marks the column and direction used for sorting', async () => {
        const tableBuilt = new Promise((resolve) =>
            node.addEventListener('dbp-tabulator-table-built', resolve, {once: true}),
        );
        node.options = {
            columns: [
                {title: 'Name', field: 'name'},
                {title: 'Email', field: 'email'},
            ],
            data: [
                {name: 'Ada', email: 'ada@example.com'},
                {name: 'Grace', email: 'grace@example.com'},
            ],
        };
        await node.updateComplete;
        await tableBuilt;

        node.tabulatorTable.setSort('name', 'asc');

        const nameHeader = node.tabulatorTable.getColumn('name').getElement();
        const emailHeader = node.tabulatorTable.getColumn('email').getElement();
        const sortArrow = nameHeader.querySelector('.tabulator-arrow');
        const accentColorProbe = document.createElement('span');
        accentColorProbe.style.color = 'var(--dbp-accent)';
        node.shadowRoot.append(accentColorProbe);
        const accentColor = getComputedStyle(accentColorProbe).color;
        assert.equal(nameHeader.getAttribute('aria-sort'), 'ascending');
        assert.equal(emailHeader.getAttribute('aria-sort'), 'none');
        assert.equal(getComputedStyle(sortArrow).borderBottomColor, accentColor);

        node.tabulatorTable.setSort('name', 'desc');
        assert.equal(nameHeader.getAttribute('aria-sort'), 'descending');
        assert.equal(getComputedStyle(sortArrow).borderTopColor, accentColor);
    });

    test('renders sortable column titles as keyboard operable buttons', async () => {
        const tableBuilt = new Promise((resolve) =>
            node.addEventListener('dbp-tabulator-table-built', resolve, {once: true}),
        );
        node.options = {
            columns: [
                {
                    title: 'Contact',
                    columns: [
                        {title: 'Name', field: 'name'},
                        {title: 'Email', field: 'email'},
                    ],
                },
                {title: 'Actions', field: 'actions', headerSort: false},
            ],
            data: [{name: 'Ada', email: 'ada@example.com', actions: ''}],
        };
        await node.updateComplete;
        await tableBuilt;

        const titleButton = (field) =>
            node.tabulatorTable
                .getColumn(field)
                .getElement()
                .querySelector('.tabulator-col-title > .tabulator-col-title-button');

        const nameButton = titleButton('name');
        assert.isNotNull(nameButton);
        assert.equal(nameButton.type, 'button');
        assert.include(nameButton.textContent, 'Name');

        // Columns with sorting disabled must not pretend to be actionable.
        assert.isNull(titleButton('actions'));

        // Column groups are rendered through the same code path but are never sortable.
        const groupHeader = node.tabulatorTable.getColumn('name').getElement()
            .parentElement.parentElement;
        assert.isNull(groupHeader.querySelector(':scope > .tabulator-col-content button'));

        // The sort arrow lives outside the title element and must survive the formatter.
        assert.isNotNull(
            node.tabulatorTable.getColumn('name').getElement().querySelector('.tabulator-arrow'),
        );

        // The button takes over the vertical padding of the title, so the focus indicator
        // covers the full height of the header cell instead of just the line of text.
        const nameTitle = node.tabulatorTable
            .getColumn('name')
            .getElement()
            .querySelector('.tabulator-col-title');
        assert.equal(getComputedStyle(nameTitle).paddingTop, '0px');
        assert.equal(getComputedStyle(nameTitle).overflow, 'visible');
        assert.equal(
            nameButton.getBoundingClientRect().height,
            nameTitle.getBoundingClientRect().height,
        );
    });

    test('does not duplicate header buttons on language change', async () => {
        const tableBuilt = new Promise((resolve) =>
            node.addEventListener('dbp-tabulator-table-built', resolve, {once: true}),
        );
        node.options = {
            langs: {en: {}, de: {}},
            columns: [{title: 'Name', field: 'name'}],
            data: [{name: 'Ada'}],
        };
        await node.updateComplete;
        await tableBuilt;

        node.lang = 'de';
        await node.updateComplete;
        node.lang = 'en';
        await node.updateComplete;

        const buttons = node.tabulatorTable
            .getColumn('name')
            .getElement()
            .querySelectorAll('.tabulator-col-title-button');
        assert.equal(buttons.length, 1);
    });

    test('announces a sort change in the live region', async () => {
        const tableBuilt = new Promise((resolve) =>
            node.addEventListener('dbp-tabulator-table-built', resolve, {once: true}),
        );
        node.options = {
            columns: [{title: 'Name', field: 'name'}],
            data: [{name: 'Ada'}, {name: 'Grace'}],
        };
        await node.updateComplete;
        await tableBuilt;

        const liveRegion = node.shadowRoot.querySelector('[role="status"]');
        assert.isNotNull(liveRegion);
        assert.equal(liveRegion.getAttribute('aria-live'), 'polite');

        node.tabulatorTable.setSort('name', 'desc');
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await node.updateComplete;

        assert.equal(liveRegion.textContent.trim(), 'Sorted by Name descending');
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
