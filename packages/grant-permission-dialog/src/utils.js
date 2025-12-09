/**
 * Send a fetch to given url with given options
 * @param url
 * @param options
 * @returns {Promise<object>} response (error or result)
 */
export const httpGetAsync = async (url, options) => {
    let response = await fetch(url, options)
        .then((result) => {
            if (!result.ok) throw result;
            return result;
        })
        .catch((error) => {
            return error;
        });

    return response;
};

/**
 * Shows a confirmation dialog for deletion and waits for user response
 * @returns {Promise<boolean>} true if user confirms, false if user cancels
 */
export async function getDeletionConfirmation(host) {
    return new Promise((resolve) => {
        // Store the resolve function so we can call it from the modal buttons
        host._deletionConfirmationResolve = resolve;

        // Show the confirmation modal
        const modal = host._('#deletion-confirmation-modal');
        if (modal) {
            modal.open();
        }
    });
}

/**
 * Handles the confirmation button click
 */
export function handleDeletionConfirm(host) {
    const modal = host._('#deletion-confirmation-modal');
    if (modal) {
        modal.close();
    }
    if (host._deletionConfirmationResolve) {
        host._deletionConfirmationResolve(true);
        host._deletionConfirmationResolve = null;
    }
}

/**
 * Handles the cancel button click
 */
export function handleDeletionCancel(host) {
    const modal = host._('#deletion-confirmation-modal');
    if (modal) {
        modal.close();
    }
    if (host._deletionConfirmationResolve) {
        host._deletionConfirmationResolve(false);
        host._deletionConfirmationResolve = null;
    }
}
