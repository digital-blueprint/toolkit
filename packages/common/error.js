import {send as notify} from './notification';
import {i18n} from "./i18n";

export const xhrError = (jqXHR, textStatus, errorThrown) => {
    if (textStatus !== "abort") {
        let body = jqXHR.responseJSON !== undefined && jqXHR.responseJSON["hydra:description"] !== undefined ?
            jqXHR.responseJSON["hydra:description"] : textStatus;

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
