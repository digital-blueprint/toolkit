import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import {LoginStatus} from "@dbp-toolkit/auth/src/util";

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
                    // ignore analyticsEvent without data
                    if (this.analyticsEvent.category === undefined && this.analyticsEvent.message === undefined) {
                        break;
                    }
                    console.log('MatomoElement(' + this.isRunning + ') analyticsEvent: ' +
                        this.analyticsEvent.action + ', ' + this.analyticsEvent.message);
                    const event = ['trackEvent', this.analyticsEvent.category, this.analyticsEvent.action,
                        this.analyticsEvent.name, this.analyticsEvent.value];

                    if (this.isRunning) {
                        this.pushEvent(event);
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

            this.pushEvent(['setCustomVariable', 1, "GitCommit", this.gitInfo, "visit"]);
            this.pushEvent(['enableHeartBeatTimer']);
            this.pushEvent(['disableCookies']);
            this.pushEvent(['trackPageView']);
            this.pushEvent(['enableLinkTracking']);

            const that = this;

            (function (endpoint, siteId) {
                that.pushEvent(['setTrackerUrl', endpoint+'matomo.php']);
                that.pushEvent(['setSiteId', siteId]);

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
                that.pushEvent(['setReferrerUrl', e.detail.referrerUrl]);
                that.pushEvent(['setCustomUrl', location.href]);
                // that.pushEvent(['setDocumentTitle', '']);
                that.pushEvent(['trackPageView']);

                // make Matomo aware of newly added content
                const content = document.getElementById('content');
                that.pushEvent(['MediaAnalytics::scanForMedia', content]);
                that.pushEvent(['FormAnalytics::scanForForms', content]);
                that.pushEvent(['trackContentImpressionsWithinNode', content]);
            });

            // track errors
            window.addEventListener('error', function(e) {
                that.pushEvent(['trackEvent', 'Error', e.error ?
                    e.error.message + '\n' + e.error.stack : e.message]);
            });

            window.addEventListener('unhandledrejection', function(e) {
                let name = e.reason;

                // TypeError objects have no toJSON() method, so we can't serialize them by themselves
                if (e.reason instanceof TypeError) {
                    const error = e.reason;
                    name = {
                        'message': error.message,
                        'name': error.name,
                        'fileName': error.fileName,
                        'lineNumber': error.lineNumber,
                        'columnNumber': error.columnNumber,
                        'stack': error.stack,
                    };
                }

                that.pushEvent(['trackEvent', 'UnhandledRejection', name]);
            });

            this.isRunning = true;
            if (this.lastEvent.length > 0) {
                console.log('MatomoElement* (' + this.isRunning + '): ' + this.lastEvent[1] + ', ' + this.lastEvent[2]);
                that.pushEvent(this.lastEvent);
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

    /**
     * Pushes an event array to Matomo
     * See: https://matomo.org/docs/event-tracking/
     *
     * event[0]: Event Category
     * event[1]: Event Action
     * event[2]: Event Name
     * event[3]: Event Value
     *
     * @param event
     */
    pushEvent(event) {
        window._paq = window._paq || [];

        // add some special checks for "trackEvent"
        if (event[0] === 'trackEvent') {
            // make sure the event action is a non-empty string
            // prevents: "Error while logging event: Parameters `category` and `action` must not be empty or filled with whitespaces"
            if (event[1] === null || event[1] === '' || event[1] === undefined) {
                event[1] = 'empty';
            }

            // make sure the event name is a non-empty string
            if (event[2] === null || event[2] === '' || event[2] === undefined) {
                event[2] = 'empty';
            } else if (typeof event[2] === 'object') {
                event[2] = JSON.stringify(event[2]);
            }
        }

        window._paq.push(event);
    }
}
