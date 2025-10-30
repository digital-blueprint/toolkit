import {createInstance} from '../i18n.js';
import {css, html} from 'lit';
import DBPLitElement from '../dbp-lit-element.js';
import {ScopedElementsMixin} from '../scoped/ScopedElementsMixin.js';
import * as commonStyles from '../styles.js';
import {Icon, Button, LangMixin, DBPSelect} from '../index.js';

export class DbpSelectDemo extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance) {
    constructor() {
        super();
    }

    static get scopedElements() {
        let elements = {
            'dbp-icon': Icon,
            'dbp-button': Button,
            'dbp-select': DBPSelect,
        };

        return elements;
    }

    static get properties() {
        return {
            ...super.properties,
        };
    }

    static get styles() {
        return css`
            ${commonStyles.getThemeCSS()}
        `;
    }

    firstUpdated() {
        super.firstUpdated();

        this._('#action-dropdown-demo-1').setOptions([
            {name: 'edit', label: 'Edit'},
            {name: 'delete', label: 'Delete'},
            {name: 'share', label: 'Share'},
        ]);

        this._('#action-dropdown-demo-2').setOptions([
            {name: 'save', label: 'Save', iconName: 'save'},
            {name: 'delete', label: 'Delete', iconName: 'trash'},
            {name: 'upload', label: 'Upload', iconName: 'upload'},
            {name: 'disabled', label: 'Disabled', iconName: 'pencil', disabled: true},
        ]);
    }

    render() {
        return html`
            <div class="content">
                <h2>Select component</h2>

                <div class="control">
                    <h3>Basic Select</h3>
                    <dbp-select id="action-dropdown-demo-1" label="Actions"></dbp-select>
                </div>

                <div class="control">
                    <h3>Select with icons</h3>
                    <dbp-select
                        id="action-dropdown-demo-2"
                        label="Actions"
                        button-type="is-primary"></dbp-select>
                </div>
            </div>
        `;
    }
}
