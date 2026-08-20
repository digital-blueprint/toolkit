/**
 * Returns the content of the file
 *
 * @param {File} file The file to read
 * @returns {string} The content
 */
export const readBinaryFileContent = async (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            const error = /** @type {DOMException} */ (reader.error);
            reject(error);
        };
        reader.readAsBinaryString(file);
    });
};
