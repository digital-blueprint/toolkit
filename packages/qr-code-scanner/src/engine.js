export class ScanResult {
    constructor() {
        /** @type {string|null} */
        this.data = null;
        /** @type {Array<{x: number, y: number}>|null} */
        this.cornerPoints = null;
    }
}

/**
 * @typedef {object} ScanRegion
 * @property {number} x Horizontal offset.
 * @property {number} y Vertical offset.
 * @property {number} width Region width.
 * @property {number} height Region height.
 */

export class QrCodeScannerEngine {
    constructor() {
        this._engine = null;
        this._canvas = document.createElement('canvas');
        this._scanner = null;
    }

    /**
     * Scan an image-like object for a QR code. Returns null if none is found.
     * The region to scan in can be restricted via "options".
     *
     * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement|ImageBitmap|OffscreenCanvas|string} image
     * @param {ScanRegion|null} options
     * @returns {Promise<ScanResult|null>}
     */
    async scanImage(image, options = null) {
        if (this._scanner === null) {
            this._scanner = (await import('qr-scanner')).default;
        }
        if (this._engine === null) {
            this._engine = await this._scanner.createQrEngine();
        }
        try {
            let tmp = await this._scanner.scanImage(image, {
                scanRegion: options ?? null,
                qrEngine: this._engine,
                canvas: this._canvas,
            });
            let res = new ScanResult();
            res.data = tmp.data;
            res.cornerPoints = tmp.cornerPoints;
            return res;
        } catch {
            return null;
        }
    }
}
