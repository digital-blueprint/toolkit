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

            /* Constrained wrapper wide enough for the label to fit on one line */
            .narrow {
                width: 50%;
                border: 1px dashed var(--dbp-muted);
                padding: 10px;
            }

            /* Very narrow wrapper that forces the label to wrap */
            .very-narrow {
                width: 280px;
                border: 1px dashed var(--dbp-muted);
                padding: 10px;
            }
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

        const longOptions = [
            {name: 'short', label: 'Short'},
            {name: 'long', label: 'A very long selectable option label that needs wrapping'},
        ];

        this._('#wrap-demo').setOptions(longOptions);
        this._('#no-wrap-demo').setOptions(longOptions);
        this._('#container-demo').setOptions(longOptions);
    }

    render() {
        // Long label used to demonstrate wrapping behavior
        const longLabel = 'A very long label that does not fit on a single line';

        return html`
            <div class="content">
                <h2>Select component</h2>

                <div class="control">
                    <h3>Basic Select</h3>
                    <dbp-select
                        id="action-dropdown-demo-1"
                        align="left"
                        label="Actions"></dbp-select>
                </div>

                <div class="control">
                    <h3>Select with icons</h3>
                    <dbp-select
                        id="action-dropdown-demo-2"
                        label="Actions"
                        align="left"
                        button-type="is-primary"></dbp-select>
                </div>

                <div class="control">
                    <h3>Wrapping label (default)</h3>
                    <p>The trigger label wraps automatically when space is insufficient.</p>
                    <div class="narrow">
                        <dbp-select id="wrap-demo" align="left" label="${longLabel}"></dbp-select>
                    </div>
                </div>

                <div class="control">
                    <h3>No-wrap label (opt-out)</h3>
                    <p>
                        The
                        <code>no-wrap</code>
                        attribute keeps the label on a single line.
                    </p>
                    <div class="narrow">
                        <dbp-select
                            id="no-wrap-demo"
                            align="left"
                            label="${longLabel}"
                            no-wrap></dbp-select>
                    </div>
                </div>

                <div class="control">
                    <h3>Narrow container</h3>
                    <p>
                        The select shrinks to its trigger but never wider than its parent, so in a
                        narrow container the label wraps and the chevron stays at the trailing edge.
                    </p>
                    <div class="very-narrow">
                        <dbp-select
                            id="container-demo"
                            align="left"
                            label="${longLabel}"></dbp-select>
                    </div>
                </div>
            </div>
        `;
    }
}
