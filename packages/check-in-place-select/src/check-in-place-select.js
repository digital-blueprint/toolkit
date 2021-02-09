import {findObjectInApiResults} from './utils.js';
import select2LangDe from './i18n/de/select2';
import select2LangEn from './i18n/en/select2';
import JSONLD from '@dbp-toolkit/common/jsonld';
import {css, html} from 'lit-element';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {i18n} from './i18n.js';
import {Icon} from '@dbp-toolkit/common';
import * as commonUtils from '@dbp-toolkit/common/utils';
import * as commonStyles from '@dbp-toolkit/common/styles';
import select2CSSPath from 'select2/dist/css/select2.min.css';
import * as errorUtils from "@dbp-toolkit/common/error";
import {AdapterLitElement} from "@dbp-toolkit/provider/src/adapter-lit-element";


const checkInPlaceContext = {
    "@id": "@id",
    "name": "http://schema.org/name",
    "maximumPhysicalAttendeeCapacity": "http://schema.org/maximumPhysicalAttendeeCapacity"
};


export class CheckInPlaceSelect extends ScopedElementsMixin(AdapterLitElement) {

    constructor() {
        super();
        this.lang = 'de';
        this.entryPointUrl = '';
        this.jsonld = null;
        this.$select = null;
        this.active = false;
        // For some reason using the same ID on the whole page twice breaks select2 (regardless if they are in different custom elements)
        this.selectId = 'check-in-place-select-' + commonUtils.makeId(24);
        this.value = '';
        this.object = null;
        this.ignoreValueUpdate = false;
        this.isSearching = false;
        this.lastResult = {};
        this.showReloadButton = false;
        this.reloadButtonTitle = '';
        this.showCapacity = false;
        this.auth = {};

        this._onDocumentClicked = this._onDocumentClicked.bind(this);
    }

    static get scopedElements() {
        return {
          'dbp-icon': Icon,
        };
    }

    $(selector) {
        if (typeof selector === "string")
            return this._jquery(this.shadowRoot.querySelector(selector));
        else
            return this._jquery(selector);
    }

    static get properties() {
        return {
            ...super.properties,
            lang: { type: String },
            active: { type: Boolean, attribute: false },
            entryPointUrl: { type: String, attribute: 'entry-point-url' },
            value: { type: String },
            object: { type: Object, attribute: false },
            showReloadButton: { type: Boolean, attribute: 'show-reload-button' },
            reloadButtonTitle: { type: String, attribute: 'reload-button-title' },
            showCapacity: { type: Boolean, attribute: 'show-capacity' },
            auth: { type: Object },
        };
    }

    clear() {
        this.object = null;
        this.$(this).attr("data-object", "");
        this.$(this).attr("value", "");
        this.$(this).data("object", null);
        this.$select.val(null).trigger('change').trigger('select2:unselect');
    }

    async connectedCallback() {
        this._jquery = (await import('jquery')).default;
        let select2 = (await import('select2')).default;
        select2(window, this._jquery);

        await super.connectedCallback();
        await this.updateComplete;
        const that = this;

        this.$select = this.$('#' + that.selectId);

        // Close the popup when clicking outside of select2
        document.addEventListener('click', this._onDocumentClicked);

        // try an init when user-interface is loaded
        this.initJSONLD();
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._onDocumentClicked);
        super.disconnectedCallback();
    }

    _onDocumentClicked(event) {
        if (event.composedPath().includes(this))
            return;
        const $select = this.$('#' + this.selectId);
        console.assert($select.length, "select2 missing");
        if (this.select2IsInitialized($select)) {
            $select.select2('close');
        }
    }

    initJSONLD(ignorePreset = false) {
        const that = this;

        JSONLD.initialize(this.entryPointUrl, function (jsonld) {
            that.jsonld = jsonld;
            that.active = true;

            // we need to poll because maybe the user interface isn't loaded yet
            // Note: we need to call initSelect2() in a different function so we can access "this" inside initSelect2()
            commonUtils.pollFunc(() => { return that.initSelect2(ignorePreset); }, 10000, 100);
        }, {}, this.lang);
    }

    /**
     * Initializes the Select2 selector
     *
     * @param ignorePreset
     */
    initSelect2(ignorePreset = false) {
        const that = this;
        const $this = this.$(this);

        if (this.jsonld === null) {
            return false;
        }

        // find the correct api url for a checkInPlace
        const apiUrl = this.jsonld.getApiUrlForIdentifier("http://schema.org/Place");
        // const apiUrl = this.jsonld.getApiUrlForEntityName("CheckInPlace");

        if (this.$select === null) {
            return false;
        }

        // we need to destroy Select2 and remove the event listeners before we can initialize it again
        if (this.$select && this.$select.hasClass('select2-hidden-accessible')) {
            this.$select.select2('destroy');
            this.$select.off('select2:select');
            this.$select.off('select2:closing');
        }

        this.$select.select2({
            width: '100%',
            language: this.lang === "de" ? select2LangDe() : select2LangEn(),
            minimumInputLength: 2,
            placeholder: i18n.t('check-in-place-select.placeholder'),
            dropdownParent: this.$('#check-in-place-select-dropdown'),
            ajax: {
                delay: 500,
                url: apiUrl,
                contentType: "application/ld+json",
                beforeSend: function (jqXHR) {
                    jqXHR.setRequestHeader('Authorization', 'Bearer ' + that.auth.token);
                    that.isSearching = true;
                },
                data: function (params) {
                    return {
                        search: params.term.trim(),
                    };
                },
                processResults: function (data) {
                    that.$('#check-in-place-select-dropdown').addClass('select2-bug');

                    that.lastResult = data;
                    let transformed = that.jsonld.transformMembers(data, checkInPlaceContext);
                    const results = [];
                    transformed.forEach((place) => {
                        results.push({id: place["@id"], maximumPhysicalAttendeeCapacity: place["maximumPhysicalAttendeeCapacity"], text: that.generateOptionText(place)});
                    });

                    return {
                        results: results
                    };
                },
                error: errorUtils.handleXhrError,
                complete: (jqXHR, textStatus) => {
                    that.isSearching = false;
                }
            }
        }).on("select2:select", function (e) {
            that.$('#check-in-place-select-dropdown').removeClass('select2-bug');

            // set custom element attributes
            const identifier = e.params.data.id;
            const maxCapacity = e.params.data.maximumPhysicalAttendeeCapacity;
            that.object = findObjectInApiResults(identifier, that.lastResult);

            const room = that.object.identifier;

            $this.attr("data-object", JSON.stringify(that.object));
            $this.data("object", that.object);

            if ($this.attr("value") !== identifier) {
                that.ignoreValueUpdate = true;
                $this.attr("value", identifier);

                // fire a change event
                that.dispatchEvent(new CustomEvent('change', {
                    detail: {
                        value: identifier,
                        capacity: maxCapacity,
                        room: room,
                    },
                    bubbles: true
                }));
            }
        }).on("select2:closing", (e) => {
            if (that.isSearching) {
                e.preventDefault();
            }
        });

        // TODO: doesn't work here
        // this.$('.select2-selection__arrow').click(() => {
        //     console.log("click");
        // });

        // preset a place
        if (!ignorePreset && this.value !== '') {
            const apiUrl = this.entryPointUrl + this.value;

            fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Authorization': 'Bearer ' + this.auth.token,
                },
            })
            .then(result => {
                if (!result.ok) throw result;
                return result.json();
            })
            .then((place) => {
                that.object = place;
                const transformed = that.jsonld.compactMember(that.jsonld.expandMember(place), checkInPlaceContext);
                const identifier = transformed["@id"];
                const maxCapacity = transformed["maximumPhysicalAttendeeCapacity"];
                const room = place.identifier;

                const option = new Option(that.generateOptionText(transformed), identifier, true, true);
                $this.attr("data-object", JSON.stringify(place));
                $this.data("object", place);
                that.$select.append(option).trigger('change');

                // fire a change event
                that.dispatchEvent(new CustomEvent('change', {
                    detail: {
                        value: identifier,
                        capacity: maxCapacity,
                        room: room,
                    },
                    bubbles: true
                }));
            }).catch((e) => {
                console.log(e);
                that.clear();
            });
        }

        return true;
    }

    generateOptionText(place) {
        let text = place["name"];

        // add maximum capacity to checkInPlace if present
        if (this.showCapacity && (place["maximumPhysicalAttendeeCapacity"] !== undefined) && (place["maximumPhysicalAttendeeCapacity"] !== null)) {
            let capacity = place["maximumPhysicalAttendeeCapacity"];
            text += ` (${capacity})`;
        }

        return text;
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);

                    if (this.select2IsInitialized()) {
                        // no other way to set an other language at runtime did work
                        this.initSelect2(true);
                    }
                    break;
                case "value":
                    if (!this.ignoreValueUpdate && this.select2IsInitialized()) {
                        this.initSelect2();
                    }

                    this.ignoreValueUpdate = false;
                    break;
                case "entryPointUrl":
                    // we don't need to preset the selector if the entry point url changes
                    this.initJSONLD(true);
                    break;
                case "auth":
                    JSONLD.doInitializationOnce(this.entryPointUrl, this.auth.token);
                    break;
            }
        });

        super.update(changedProperties);
    }

    select2IsInitialized() {
        return this.$select !== null && this.$select.hasClass("select2-hidden-accessible");
    }

    reloadClick() {
        if (this.object === null) {
            return;
        }

        // fire a change event
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this.value,
            },
            bubbles: true
        }));
    }

    static get styles() {
        return [
            commonStyles.getThemeCSS(),
            commonStyles.getGeneralCSS(),
            commonStyles.getButtonCSS(),
            commonStyles.getFormAddonsCSS(),
            commonStyles.getSelect2CSS(),
            css`
            .select2-control.control {
                width: 100%;
            }

            .field .button.control {
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #aaa;
                -moz-border-radius-topright: var(--dbp-border-radius);
                -moz-border-radius-bottomright: var(--dbp-border-radius);
                line-height: 100%;
            }

            .field .button.control dbp-icon {
                top: 0;
            }

            input {
                border-radius: 0;
            }
              
            input[type="search"] {
                -webkit-appearance: none;
            }

            /* https://github.com/select2/select2/issues/5457 */
            .select2-bug .loading-results {
                display: none !important;
            }
            `
        ];
    }

    render() {
        const select2CSS = commonUtils.getAssetURL(select2CSSPath);
        return html`
            <link rel="stylesheet" href="${select2CSS}">
            <style>
                #${this.selectId} {
                    width: 100%;
                }
            </style>

            <div class="select">
                <div class="field has-addons">
                    <div class="select2-control control">
                        <!-- https://select2.org-->
                        <select id="${this.selectId}" name="check-in-place" class="select" ?disabled=${!this.active}>${!this.active ? html`<option value="" disabled selected>${ i18n.t('check-in-place-select.login-required')}</option>` : ''}</select>
                    </div>
                    <a class="control button"
                       id="reload-button"
                       ?disabled=${this.object === null}
                       @click="${this.reloadClick}"
                       style="display: ${this.showReloadButton ? "flex" : "none"}"
                       title="${this.reloadButtonTitle}">
                        <dbp-icon name="reload"></dbp-icon>
                    </a>
                </div>
                <div id="check-in-place-select-dropdown"></div>
            </div>
        `;
    }
}