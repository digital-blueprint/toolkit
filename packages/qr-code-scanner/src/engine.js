export class ScanResult {
    constructor() {
        this.data = null;
        this.cornerPoints = null;
    }
}

export class QrCodeScannerEngine {
    constructor() {
        this._engine = null;
        this._canvas = document.createElement('canvas');
        this._scanner = null;
    }

    /**
     * Scan am image like thing for a QR code. Returns null if none is found.
     * The region to scan in can be restricted via "options".
     *
     * @param {*} image
     * @param {?object} options
     * @param {number} options.x
     * @param {number} options.y
     * @param {number} options.width
     * @param {number} options.height
     * @returns {?ScanResult}
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
        } catch (e) {
            return null;
        }
    }
}
