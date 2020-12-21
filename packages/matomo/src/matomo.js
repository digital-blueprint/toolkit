import {i18n} from './i18n.js';
import {LitElement} from "lit-element";
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {EventBus} from '@dbp-toolkit/common';
import buildInfo from 'consts:buildinfo';


export class MatomoElement extends DBPLitElement {

    constructor() {
        super();
        this.endpoint = '';
        this.siteId = -1;
        this.isRunning = false;
        this.lastEvent = [];
    }


    static get properties() {
        return {
            endpoint: { type: String },
            siteId: { type: Number, attribute: 'site-id' },
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this._bus = new EventBus();
        this._bus.subscribe('auth-update', (data) => {
            this.setupMatomo(data.status === 'logged-in');
        });
    }

    disconnectedCallback() {
        this._bus.close();
        super.disconnectedCallback();
    }

    render() {
        return ``;
    }

    setupMatomo(loggedIn) {
        if (loggedIn && ! this.isRunning) {
            if (this.siteId === -1) {
                console.log('site id missing, skipping matomo...');
                return;
            }
            if (this.endpoint === '') {
                console.log('endpoint missing, skipping matomo...');
                return;
            }
            console.log('add matomo...');

            window._paq = window._paq || [];
            _paq.push(['setCustomVariable', 1, "GitCommit", buildInfo.info, "visit"]);
            _paq.push(['enableHeartBeatTimer']);
            _paq.push(['disableCookies']);
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);

            (function (endpoint, siteId) {
                _paq.push(['setTrackerUrl', endpoint+'matomo.php']);
                _paq.push(['setSiteId', siteId]);

                var g = document.createElement('script');
                var s = document.getElementsByTagName('script')[0];
                g.type = 'text/javascript';
                g.async = true;
                g.defer = true;
                g.src = endpoint + 'matomo.js';
                s.parentNode.insertBefore(g, s);
            })(this.endpoint, this.siteId);

            // track changed locations
            window.addEventListener('locationchanged', function(e) {
                _paq.push(['setReferrerUrl', e.detail.referrerUrl]);
                _paq.push(['setCustomUrl', location.href]);
                // _paq.push(['setDocumentTitle', '']);
                _paq.push(['trackPageView']);

                // make Matomo aware of newly added content
                var content = document.getElementById('content');
                _paq.push(['MediaAnalytics::scanForMedia', content]);
                _paq.push(['FormAnalytics::scanForForms', content]);
                _paq.push(['trackContentImpressionsWithinNode', content]);
            });

            // track errors
            window.addEventListener('error', function(e) {
                _paq.push(['trackEvent', 'Error', e.error.message + '\n' + e.error.stack]);
            });

            window.addEventListener('unhandledrejection', function(e) {
                _paq.push(['trackEvent', 'UnhandledRejection', e.reason]);
            });

            this.isRunning = true;
            if (this.lastEvent.length > 0) {
                console.log('MatomoElement* (' + this.isRunning + '): ' + this.lastEvent[1] + ', ' + this.lastEvent[2]);
                _paq.push(this.lastEvent);
                this.lastEvent = [];
            }
            return;
        }
        if (! loggedIn && this.isRunning) {
            // TODO: reomve those event listeners
            console.log('remove matomo...');
            this.isRunning = false;
        }
    }

    track (action, message) {
        console.log('MatomoElement  (' + this.isRunning + '): ' + action + ', ' + message);
        const event = ['trackEvent', action, message];
        if (this.isRunning) {
            _paq.push(event);
        } else {
            this.lastEvent = event;
        }
    }
}
