/**
 * Returns the content of the file
 *
 * @param {File} file The file to read
 * @returns {Promise<string>} The content
 */
export const readBinaryFileContent = async (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new TypeError('Failed to read file as a binary string'));
            }
        };
        reader.onerror = () => {
            const error = /** @type {DOMException} */ (reader.error);
            reject(error);
        };
        reader.readAsBinaryString(file);
    });
};
