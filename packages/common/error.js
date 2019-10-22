import {send as notify} from './notification';
import {i18n} from "./i18n";

/**
 * Error handling for XHR errors
 *
 * @param jqXHR
 * @param textStatus
 * @param errorThrown
 */
export const handleXhrError = (jqXHR, textStatus, errorThrown) => {
    if (textStatus !== "abort") {
        // try to show hydra error text
        let body = jqXHR.responseJSON !== undefined && jqXHR.responseJSON["hydra:description"] !== undefined ?
            jqXHR.responseJSON["hydra:description"] : textStatus;

        // if the server is not reachable at all
        if (jqXHR.status === 0) {
            body = i18n.t('error.connection-to-server-refused');
        }

        notify({
            "summary": i18n.t('error.summary'),
            "body": body,
            "type": "danger",
        });
    }
};

/**
 * Error handling for fetch errors
 *
 * @param error
 * @param summary
 */
export const handleFetchError = async (error, summary = "") => {
    let body;

    try {
        await error.json().then((json) => {
            body = json["hydra:description"] !== undefined ? json["hydra:description"] : error.statusText;
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
        "body": body,
        "type": "danger",
    });
};
