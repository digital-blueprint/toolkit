import {css, html} from 'lit';
import {ScopedElementsMixin, Icon, IconButton, Modal} from '@dbp-toolkit/common';
import * as commonStyles from '@dbp-toolkit/common/styles';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {createInstance} from './i18n.js';

export class ColumnConfigurationModal extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.columns = [];
        this.defaultColumns = [];
        this.workingColumns = [];
    }

    static get scopedElements() {
        return {
            ...super.scopedElements,
            'dbp-icon': Icon,
            'dbp-icon-button': IconButton,
            'dbp-modal': Modal,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            columns: {type: Array, attribute: false},
            defaultColumns: {type: Array, attribute: false},
            workingColumns: {type: Array, attribute: false},
        };
    }

    get #modal() {
        const modal = this.renderRoot.querySelector('dbp-modal');
        if (!(modal instanceof Modal)) {
            throw new Error('Column configuration modal is unavailable');
        }
        return modal;
    }

    update(changedProperties) {
        if (changedProperties.has('lang')) {
            void this._i18n.changeLanguage(this.lang);
        }
        super.update(changedProperties);
    }

    async open() {
        this.workingColumns = this.columns.map((column) => ({...column}));
        await this.updateComplete;
        this.#modal.open();
    }

    close() {
        this.#modal.close();
    }

    toggleColumn(field) {
        this.workingColumns = this.workingColumns.map((column) =>
            column.field === field ? {...column, visible: !column.visible} : column,
        );
    }

    toggleAll(visible) {
        this.workingColumns = this.workingColumns.map((column) => ({...column, visible}));
    }

    reset() {
        this.workingColumns = this.defaultColumns.map((column) => ({...column}));
    }

    moveColumn(index, direction) {
        const column = this.workingColumns[index];
        if (!column) return;

        const siblingIndexes = this.workingColumns
            .map((candidate, candidateIndex) =>
                candidate.parentPath === column.parentPath ? candidateIndex : -1,
            )
            .filter((candidateIndex) => candidateIndex !== -1);
        const siblingIndex = siblingIndexes.indexOf(index);
        const targetIndex = siblingIndexes[siblingIndex + direction];
        if (targetIndex === undefined) return;

        const columns = [...this.workingColumns];
        [columns[index], columns[targetIndex]] = [columns[targetIndex], columns[index]];
        this.workingColumns = columns;
    }

    save() {
        this.dispatchEvent(
            new CustomEvent('column-configuration-save', {
                detail: {
                    columns: this.workingColumns.map((column) => ({...column})),
                },
                bubbles: true,
                composed: true,
            }),
        );
        this.close();
    }

    canMove(index, direction) {
        const column = this.workingColumns[index];
        if (!column) return false;

        const siblingIndexes = this.workingColumns
            .map((candidate, candidateIndex) =>
                candidate.parentPath === column.parentPath ? candidateIndex : -1,
            )
            .filter((candidateIndex) => candidateIndex !== -1);
        return siblingIndexes[siblingIndexes.indexOf(index) + direction] !== undefined;
    }

    getColumnLabel(column) {
        return column.parentTitle ? `${column.parentTitle}: ${column.title}` : column.title;
    }

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            commonStyles.getButtonCSS(),
            css`
                dbp-modal {
                    --dbp-modal-width: 70%;
                    --dbp-modal-max-width: 700px;
                    --dbp-modal-min-width: 300px;
                    --dbp-modal-min-height: auto;
                }

                .columns {
                    box-sizing: border-box;
                    display: grid;
                    list-style: none;
                    margin: 0;
                    max-width: 100%;
                    min-width: 0;
                    padding: 0;
                    width: 100%;
                }

                .column {
                    align-items: center;
                    border: 1px solid var(--dbp-muted);
                    box-sizing: border-box;
                    color: var(--dbp-content);
                    display: flex;
                    height: 50px;
                    margin-bottom: 5px;
                    max-width: 100%;
                    min-width: 0;
                }

                .position {
                    align-items: center;
                    align-self: stretch;
                    background-color: var(--dbp-muted-surface);
                    color: var(--dbp-on-muted-surface);
                    display: flex;
                    flex: 0 0 50px;
                    font-weight: bold;
                    justify-content: center;
                }

                .title {
                    flex: 1 1 auto;
                    font-weight: 400;
                    min-width: 0;
                    overflow: hidden;
                    padding-left: 5px;
                    text-align: left;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .group-title {
                    display: block;
                    font-size: 0.75rem;
                    opacity: 0.75;
                }

                .move-buttons {
                    align-items: center;
                    display: flex;
                    flex: 0 0 auto;
                    height: 100%;
                    padding-right: 2px;
                }

                dbp-icon-button {
                    font-size: 1.25rem;
                }

                .column > dbp-icon-button {
                    flex: 0 0 40px;
                }

                .footer {
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 100%;
                    min-width: 0;
                    width: 100%;
                }

                .footer-group {
                    gap: 10px;
                    min-width: 0;
                }

                .footer-group:first-child {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    padding-top: 10px;
                }

                .footer-group:last-child {
                    display: flex;
                    justify-content: space-between;
                }

                .footer button {
                    align-items: center;
                    box-sizing: border-box;
                    display: inline-flex;
                    max-width: 100%;
                    min-width: 0;
                }

                button dbp-icon {
                    position: static;
                    top: 0;
                    margin-right: 0.25rem;
                }

                @media only screen and (max-width: 768px) {
                    dbp-modal {
                        /* Account for the modal's 40px horizontal padding. */
                        --dbp-modal-width: calc(100vw - 80px);
                        --dbp-modal-max-width: calc(100vw - 80px);
                        --dbp-modal-min-width: 0;
                    }

                    .footer-group:first-child {
                        grid-template-columns: 1fr;
                    }

                    .footer-group:last-child {
                        align-items: stretch;
                        flex-direction: column;
                    }

                    .footer button {
                        width: 100%;
                    }
                }

                @media only screen and (max-width: 490px) {
                    dbp-modal {
                        --dbp-modal-width: calc(100vw - 60px);
                        --dbp-modal-max-width: calc(100vw - 60px);
                    }

                    .position {
                        flex-basis: 40px;
                    }

                    .column > dbp-icon-button {
                        flex-basis: 36px;
                    }

                    .move-buttons {
                        padding-right: 0;
                    }
                }
            `,
        ];
    }

    render() {
        const i18n = this._i18n;
        return html`
            <dbp-modal
                modal-id="tabulator-column-configuration"
                title=${i18n.t('tabulator-table.column-configuration.title')}
                sticky-footer
                subscribe="lang">
                <ul slot="content" class="columns">
                    ${this.workingColumns.map(
                        (column, index) => html`
                            <li class="column">
                                <span class="position">${index + 1}</span>
                                <span class="title" title=${this.getColumnLabel(column)}>
                                    ${
                                        column.parentTitle
                                            ? html`
                                                  <span class="group-title">
                                                      ${column.parentTitle}
                                                  </span>
                                              `
                                            : ''
                                    }
                                    ${column.title}
                                </span>
                                <dbp-icon-button
                                    no-spinner-on-click
                                    icon-name=${
                                        column.visible
                                            ? 'source_icons_eye-empty'
                                            : 'source_icons_eye-off'
                                    }
                                    title=${i18n.t(
                                        column.visible
                                            ? 'tabulator-table.column-configuration.hide-column'
                                            : 'tabulator-table.column-configuration.show-column',
                                        {column: this.getColumnLabel(column)},
                                    )}
                                    aria-label=${i18n.t(
                                        column.visible
                                            ? 'tabulator-table.column-configuration.hide-column'
                                            : 'tabulator-table.column-configuration.show-column',
                                        {column: this.getColumnLabel(column)},
                                    )}
                                    @click=${() => this.toggleColumn(column.field)}></dbp-icon-button>
                                <span class="move-buttons">
                                    <dbp-icon-button
                                        no-spinner-on-click
                                        icon-name="arrow-up"
                                        ?disabled=${!this.canMove(index, -1)}
                                        title=${i18n.t(
                                            'tabulator-table.column-configuration.move-up',
                                            {column: this.getColumnLabel(column)},
                                        )}
                                        aria-label=${i18n.t(
                                            'tabulator-table.column-configuration.move-up',
                                            {column: this.getColumnLabel(column)},
                                        )}
                                        @click=${() => this.moveColumn(index, -1)}></dbp-icon-button>
                                    <dbp-icon-button
                                        no-spinner-on-click
                                        icon-name="arrow-down"
                                        ?disabled=${!this.canMove(index, 1)}
                                        title=${i18n.t(
                                            'tabulator-table.column-configuration.move-down',
                                            {column: this.getColumnLabel(column)},
                                        )}
                                        aria-label=${i18n.t(
                                            'tabulator-table.column-configuration.move-down',
                                            {column: this.getColumnLabel(column)},
                                        )}
                                        @click=${() => this.moveColumn(index, 1)}></dbp-icon-button>
                                </span>
                            </li>
                        `,
                    )}
                </ul>
                <div slot="footer" class="footer">
                    <div class="footer-group">
                        <button class="button is-secondary" @click=${() => this.reset()}>
                            <dbp-icon name="spinner-arrow-mirrored" aria-hidden="true"></dbp-icon>
                            ${i18n.t('tabulator-table.column-configuration.reset')}
                        </button>
                        <button class="button is-secondary" @click=${() => this.toggleAll(false)}>
                            <dbp-icon name="source_icons_eye-off" aria-hidden="true"></dbp-icon>
                            ${i18n.t('tabulator-table.column-configuration.hide-all')}
                        </button>
                        <button class="button is-secondary" @click=${() => this.toggleAll(true)}>
                            <dbp-icon name="source_icons_eye-empty" aria-hidden="true"></dbp-icon>
                            ${i18n.t('tabulator-table.column-configuration.show-all')}
                        </button>
                    </div>
                    <div class="footer-group">
                        <button class="button is-secondary" @click=${() => this.close()}>
                            <dbp-icon name="close" aria-hidden="true"></dbp-icon>
                            ${i18n.t('tabulator-table.column-configuration.cancel')}
                        </button>
                        <button class="button is-primary" @click=${() => this.save()}>
                            <dbp-icon name="save" aria-hidden="true"></dbp-icon>
                            ${i18n.t('tabulator-table.column-configuration.save')}
                        </button>
                    </div>
                </div>
            </dbp-modal>
        `;
    }
}
