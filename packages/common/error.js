import {send as notify} from './notification';
import {createInstance} from "./i18n";

/**
 * Escapes html
 *
 * @param string
 * @returns {string}
 */
export const escapeHTML = (string) => {
    const pre = document.createElement('pre');
    const text = document.createTextNode(string);
    pre.appendChild(text);

    return pre.innerHTML;
};

/**
 * Strips html
 *
 * @param string
 * @returns {string}
 */
export const stripHTML = (string) => {
    var div = document.createElement("div");
    div.innerHTML = string;

    return div.textContent || div.innerText || "";
};

/**
 * We need this mixin so we can use this.sendSetPropertyEvent to post analytics events
 */
export const errorMixin = {
    /**
     * Error handling for XHR errors
     *
     * @param jqXHR
     * @param textStatus
     * @param errorThrown
     * @param icon
     * @param lang
     */
    handleXhrError(jqXHR, textStatus, errorThrown, icon = "sad", lang = "de") {
        // return if user aborted the request
        if (textStatus === "abort") {
            return;
        }

        let body;
        const i18n = createInstance();
        i18n.changeLanguage(lang);

        if (jqXHR.responseJSON !== undefined && jqXHR.responseJSON["hydra:description"] !== undefined) {
            // response is a JSON-LD
            body = jqXHR.responseJSON["hydra:description"];
        } else if (jqXHR.responseJSON !== undefined && jqXHR.responseJSON['detail'] !== undefined) {
            // response is a plain JSON
            body = jqXHR.responseJSON['detail'];
        } else {
            // no description available
            body = textStatus;

            if (errorThrown) {
                body += ' - ' + errorThrown;
            }
        }

        // if the server is not reachable at all
        if (jqXHR.status === 0) {
            body = i18n.t('error.connection-to-server-refused');
        }

        notify({
            "summary": i18n.t('error.summary'),
            "body": escapeHTML(stripHTML(body)),
            "icon": icon,
            "type": "danger",
        });

        if (this.sendSetPropertyEvent !== undefined) {
            this.sendSetPropertyEvent('analytics-event', {'category': 'XhrError', 'action': body});
        }
    },

    /**
     * Error handling for fetch errors
     *
     * @param error
     * @param summary
     * @param icon
     * @param lang
     */
    handleFetchError: async function (error, summary = "", icon = "sad", lang = "de") {
        // return if user aborted the request
        if (error.name === "AbortError") {
            return;
        }

        let body;
        const i18n = createInstance();
        i18n.changeLanguage(lang);

        try {
            await error.json().then((json) => {
                if (json["hydra:description"] !== undefined) {
                    // response is a JSON-LD and possibly also contains HTML!
                    body = json["hydra:description"];
                } else if (json['detail'] !== undefined) {
                    // response is a plain JSON
                    body = json['detail'];
                } else {
                    // no description available
                    body = error.statusText;
                }
            }).catch(() => {
                body = error.statusText !== undefined ? error.statusText : error;
            });
        } catch (e) {
            // a TypeError means the connection to the server was refused most of the times
            if (error.name === "TypeError") {
                body = error.message !== "" ? error.message : i18n.t('error.connection-to-server-refused');
            }
        }

        notify({
            "summary": summary === "" ? i18n.t('error.summary') : summary,
            "body": escapeHTML(stripHTML(body)),
            "icon": icon,
            "type": "danger",
        });

        if (this.sendSetPropertyEvent !== undefined) {
            this.sendSetPropertyEvent('analytics-event', {
                'category': 'FetchError',
                'action': summary === "" ? body : summary + ": " + body
            });
        }
    }
};

/**
 * Returns the stack trace as array
 *
 * @returns {string[]}
 */
export const getStackTrace = () => {
    let stack = new Error().stack || '';
    stack = stack.split('\n').map(function (line) { return line.trim(); });
    return stack.splice(stack[0] === 'Error' ? 2 : 1);
};
