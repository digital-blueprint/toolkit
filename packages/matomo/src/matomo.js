import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {LoginStatus} from "@dbp-toolkit/auth/src/util";

function pushEvent(event) {
    window._paq = window._paq || [];
    window._paq.push(event);
}

export class MatomoElement extends DBPLitElement {

    constructor() {
        super();
        this.endpoint = '';
        this.siteId = -1;
        this.isRunning = false;
        this.lastEvent = [];
        this.gitInfo = '';
        this.auth = {};
        this.analyticsEvent = {};
        this.loginStatus = '';
    }


    static get properties() {
        return {
            ...super.properties,
            endpoint: { type: String },
            siteId: { type: Number, attribute: 'site-id' },
            gitInfo: { type: Number, attribute: 'git-info' },
            auth: { type: Object },
            analyticsEvent: { type: Object, attribute: 'analytics-event' },
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'auth':
                {
                    const loginStatus = this.auth['login-status'];

                    if (this.loginStatus !== loginStatus) {
                        this.setupMatomo(loginStatus === LoginStatus.LOGGED_IN);
                        this.loginStatus = loginStatus;
                    }
                }
                break;
                case 'analyticsEvent':
                {
                    console.log('MatomoElement(' + this.isRunning + ') analyticsEvent: ' +
                        this.analyticsEvent.action + ', ' + this.analyticsEvent.message);
                    const event = ['trackEvent', this.analyticsEvent.category, this.analyticsEvent.action,
                        this.analyticsEvent.name, this.analyticsEvent.value];

                    if (this.isRunning) {
                        pushEvent(event);
                    } else {
                        this.lastEvent = event;
                    }
                }
                break;
            }
        });

        super.update(changedProperties);
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

            pushEvent(['setCustomVariable', 1, "GitCommit", this.gitInfo, "visit"]);
            pushEvent(['enableHeartBeatTimer']);
            pushEvent(['disableCookies']);
            pushEvent(['trackPageView']);
            pushEvent(['enableLinkTracking']);

            (function (endpoint, siteId) {
                pushEvent(['setTrackerUrl', endpoint+'matomo.php']);
                pushEvent(['setSiteId', siteId]);

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
                pushEvent(['setReferrerUrl', e.detail.referrerUrl]);
                pushEvent(['setCustomUrl', location.href]);
                // pushEvent(['setDocumentTitle', '']);
                pushEvent(['trackPageView']);

                // make Matomo aware of newly added content
                var content = document.getElementById('content');
                pushEvent(['MediaAnalytics::scanForMedia', content]);
                pushEvent(['FormAnalytics::scanForForms', content]);
                pushEvent(['trackContentImpressionsWithinNode', content]);
            });

            // track errors
            window.addEventListener('error', function(e) {
                pushEvent(['trackEvent', 'Error', e.error.message + '\n' + e.error.stack]);
            });

            window.addEventListener('unhandledrejection', function(e) {
                pushEvent(['trackEvent', 'UnhandledRejection', e.reason]);
            });

            this.isRunning = true;
            if (this.lastEvent.length > 0) {
                console.log('MatomoElement* (' + this.isRunning + '): ' + this.lastEvent[1] + ', ' + this.lastEvent[2]);
                pushEvent(this.lastEvent);
                this.lastEvent = [];
            }
            return;
        }
        if (! loggedIn && this.isRunning) {
            // TODO: remove those event listeners
            console.log('remove matomo...');
            this.isRunning = false;
        }
    }
}
