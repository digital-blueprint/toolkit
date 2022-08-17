import {createInstance, setOverridesByGlobalCache} from './i18n';
import {css, html, unsafeCSS} from 'lit';
import DBPLitElement from '@dbp-toolkit/common/dbp-lit-element';
import * as commonStyles from '@dbp-toolkit/common/styles';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {Icon, MiniSpinner} from '@dbp-toolkit/common';
import {classMap} from 'lit/directives/class-map.js';
import {Mutex} from 'async-mutex';
import {getIconSVGURL} from '@dbp-toolkit/common';
import {QrCodeScannerEngine, ScanResult} from './engine.js';

/**
 * Returns the ID for the most important device
 *
 * @param {Map} devices
 * @returns {string|null} the ID
 */
function getPrimaryDevice(devices) {
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ) {
        if (devices.has('environment')) return 'environment';
    }
    if (devices.size) {
        return Array.from(devices)[0][0];
    }
    return null;
}

/**
 * Returns a map of device IDs and translated names.
 *
 * Moreimportant devices first.
 *
 * @param i18n
 * @returns {Map<string,string>} the map of devices
 */
async function getVideoDevices(i18n) {
    let devices_map = new Map();
    if (
        navigator.mediaDevices &&
        navigator.mediaDevices.enumerateDevices &&
        navigator.mediaDevices.getUserMedia
    ) {
        let devices;
        try {
            devices = await navigator.mediaDevices.enumerateDevices();
        } catch (err) {
            console.log(err.name + ': ' + err.message);
            return devices_map;
        }

        for (let device of devices) {
            if (device.kind === 'videoinput') {
                let id = device.deviceId;
                if (
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent
                    )
                ) {
                    devices_map.set('environment', i18n.t('back-camera'));
                    devices_map.set('user', i18n.t('front-camera'));
                } else {
                    devices_map.set(
                        id ? id : true,
                        device.label || i18n.t('camera') + (devices_map.size + 1)
                    );
                }
            }
        }
        return devices_map;
    } else {
        return devices_map;
    }
}

/**
 * Checks if user Agent is IOS, but not Safari browser
 *
 * @param {string} devices_map
 * @returns {object|null} a video element or null
 */
function checkIosMobileSupport(devices_map) {
    return /(iPhone|iPad|iPod).*(CriOS|FxiOS|OPT|EdgiOS|YaBrowser|AlohaBrowser)/i.test(
        navigator.userAgent
    );
}

/**
 * @param {string} deviceId
 * @returns {object|null} a video element or null
 */
async function createVideoElement(deviceId) {
    let videoId = deviceId;
    let constraint = {video: {deviceId: videoId}};
    if (videoId === 'environment' || videoId === '') {
        console.log('vid:', videoId);
        constraint = {video: {facingMode: 'environment'}};
    } else if (videoId === 'user') {
        console.log('vid2:', videoId);
        constraint = {video: {facingMode: 'user', mirrored: true}};
    }

    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraint);
    } catch (e) {
        console.log(e);
    }

    if (stream !== null) {
        let video = document.createElement('video');
        video.srcObject = stream;
        return video;
    }

    return null;
}

export class QrCodeScanner extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this._i18n = createInstance();
        this.lang = this._i18n.language;
        this.langDir = '';

        this._askPermission = false;
        this._loading = false;

        this.showOutput = false;
        this.stopScan = false;

        this._activeCamera = '';

        this._devices = new Map();
        this._requestID = null;
        this._loadingMessage = '';

        this.matchRegex = '.*';
        this._videoElement = null;
        this._outputData = null;
        this._videoRunning = false;
        this._lock = new Mutex();
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    static get properties() {
        return {
            lang: {type: String},
            langDir: {type: String, attribute: 'lang-dir'},
            showOutput: {type: Boolean, attribute: 'show-output'},
            stopScan: {type: Boolean, attribute: 'stop-scan'},
            matchRegex: {type: String, attribute: 'match-regex'},
            _activeCamera: {type: String, attribute: false},
            _loading: {type: Boolean, attribute: false},
            _devices: {type: Map, attribute: false},
            _loadingMessage: {type: String, attribute: false},
            _outputData: {type: String, attribute: false},
            _askPermission: {type: Boolean, attribute: false},
            _videoRunning: {type: Boolean, attribute: false},
        };
    }

    async connectedCallback() {
        super.connectedCallback();

        let devices = await getVideoDevices(this._i18n);
        this._activeCamera = getPrimaryDevice(devices) || '';
        this._devices = devices;

        if (!this.stopScan) {
            await this.startScanning();
        }

        if (this.langDir != '') {
          setOverridesByGlobalCache(this._i18n, this);
        }
    }

    async disconnectedCallback() {
        await this.stopScanning();
        super.disconnectedCallback();
    }

    updated(changedProperties) {
        if (changedProperties.get('stopScan') && !this.stopScan) {
            this.startScanning();
        } else if (!changedProperties.get('stopScan') && this.stopScan) {
            this.stopScanning();
        }
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    this._i18n.changeLanguage(this.lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    /**
     * Init and start the video and QR code scan
     */
    async startScanning() {
        await this.stopScanning();

        const release = await this._lock.acquire();
        try {
            await this._startScanning();
        } finally {
            release();
        }
    }

    async _startScanning() {
        const i18n = this._i18n;
        console.assert(this._lock.isLocked());
        await this.updateComplete;

        let targetCanvas = this._('#canvas');
        let targetvideo = this._('#video');
        let canvasElement = document.createElement('canvas');
        let firstDrawDone = false;

        this._askPermission = true;
        this._loadingMessage = html`
            ${i18n.t('no-camera-access')}
            <br />
            ${i18n.t('check-access')}
        `;
        let video = await createVideoElement(this._activeCamera);
        if (video !== null) {
            targetvideo.appendChild(video);
        }
        this._askPermission = false;

        /** @type {?ScanResult} */
        let lastCode = null;
        let lastSentData = null;

        let detector = new QrCodeScannerEngine();
        let detectorRunning = false;

        const tick = () => {
            this._requestID = null;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                this._loading = false;
                // draw into a temporary canvas first
                canvasElement.height = video.videoHeight;
                canvasElement.width = video.videoWidth;
                let canvas = canvasElement.getContext('2d');
                canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

                let maskWidth = canvasElement.width;
                let maskHeight = canvasElement.height;
                let maskStartX = 0;
                let maskStartY = 0;

                let maxSize =
                    canvasElement.width > canvasElement.height
                        ? (canvasElement.height / 4) * 3
                        : (canvasElement.width / 4) * 3;
                console.assert(maxSize <= canvasElement.width && maxSize <= canvasElement.height);
                maskWidth = maxSize;
                maskHeight = maxSize;
                maskStartX = canvasElement.width / 2 - maskWidth / 2;
                maskStartY = canvasElement.height / 2 - maskHeight / 2;

                let lastVideo = video;
                if (!detectorRunning) {
                    detectorRunning = true;
                    detector
                        .scanImage(canvasElement, {
                            x: maskStartX,
                            y: maskStartY,
                            width: maskWidth,
                            height: maskHeight,
                        })
                        .then((code) => {
                            detectorRunning = false;
                            // if we got restarted then the video element is new, so stop then.
                            if (lastVideo !== this._videoElement) return;
                            lastCode = code;

                            if (code) {
                                let currentData = code.data;
                                if (lastSentData !== currentData) {
                                    this._outputData = currentData;
                                    this.dispatchEvent(
                                        new CustomEvent('code-detected', {
                                            bubbles: true,
                                            composed: true,
                                            detail: {code: currentData},
                                        })
                                    );
                                }
                                lastSentData = currentData;
                            } else {
                                this._outputData = null;
                                lastSentData = null;
                            }
                        });
                }

                let matched = lastCode ? lastCode.data.match(this.matchRegex) !== null : false;

                //draw mask
                canvas.beginPath();
                canvas.fillStyle = '#0000006e';
                canvas.moveTo(0, 0);
                canvas.lineTo(0, canvasElement.height);
                canvas.lineTo(canvasElement.width, canvasElement.height);
                canvas.lineTo(canvasElement.width, 0);
                canvas.rect(maskStartX, maskStartY, maskWidth, maskHeight);
                canvas.fill();

                canvas.beginPath();
                if (lastCode) {
                    let okColor = getComputedStyle(this).getPropertyValue('--dbp-success');
                    let notOkColor = getComputedStyle(this).getPropertyValue('--dbp-danger');
                    canvas.fillStyle = matched ? okColor : notOkColor;
                } else {
                    canvas.fillStyle = 'white';
                }

                let borderWidth = Math.max(maskWidth, maskHeight) / 50;
                canvas.moveTo(maskStartX, maskStartY);
                canvas.rect(maskStartX, maskStartY, maskWidth / 3, borderWidth);
                canvas.rect(maskStartX, maskStartY, borderWidth, maskHeight / 3);
                canvas.rect(
                    maskStartX + (maskWidth / 3) * 2,
                    maskStartY,
                    maskWidth / 3,
                    borderWidth
                );
                canvas.rect(
                    maskStartX + maskWidth - borderWidth,
                    maskStartY,
                    borderWidth,
                    maskHeight / 3
                );
                canvas.rect(
                    maskStartX,
                    maskStartY + maskHeight - borderWidth,
                    maskWidth / 3,
                    borderWidth
                );
                canvas.rect(
                    maskStartX,
                    maskStartY + (maskHeight / 3) * 2,
                    borderWidth,
                    maskHeight / 3
                );
                canvas.rect(
                    maskStartX + (maskWidth / 3) * 2,
                    maskStartY + maskHeight - borderWidth,
                    maskWidth / 3,
                    borderWidth
                );
                canvas.rect(
                    maskStartX + maskWidth - borderWidth,
                    maskStartY + (maskHeight / 3) * 2,
                    borderWidth,
                    maskHeight / 3
                );
                canvas.fill();

                targetCanvas.height = canvasElement.height;
                targetCanvas.width = canvasElement.width;
                targetCanvas.getContext('2d').drawImage(canvasElement, 0, 0);

                if (!firstDrawDone) {
                    this.dispatchEvent(
                        new CustomEvent('scan-started', {bubbles: true, composed: true})
                    );
                    firstDrawDone = true;
                }
            }
            console.assert(this._requestID === null);
            this._requestID = requestAnimationFrame(tick);
        };

        if (video !== null) {
            video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
            video.play();
            this._videoRunning = true;

            console.assert(this._requestID === null);
            this._videoElement = video;
            this._loading = true;
            this._loadingMessage = i18n.t('loading-video');
            this._requestID = requestAnimationFrame(tick);
        }
    }

    /**
     * Update if video source is changed
     *
     * @param e
     */
    async _onUpdateSource(e) {
        this._activeCamera = e.srcElement.value;
        await this.stopScanning();
        await this.startScanning();
        console.log('Changed Media');
    }

    /**
     * Stops the active video and scan process
     *
     */
    async stopScanning() {
        const release = await this._lock.acquire();
        try {
            if (this._videoElement !== null) {
                let video = this._videoElement;
                video.srcObject.getTracks().forEach(function (track) {
                    track.stop();
                });
                this._videoElement = null;
            }

            if (this._requestID !== null) {
                cancelAnimationFrame(this._requestID);
                this._requestID = null;
            }

            this._askPermission = false;
            this._videoRunning = false;
            this._loading = false;

            this._loadingMessage = '';
        } finally {
            release();
        }
    }

    static get styles() {
        // language=css
        return css`
            ${commonStyles.getThemeCSS()}
            ${commonStyles.getGeneralCSS()}
            ${commonStyles.getSelect2CSS()}
            ${commonStyles.getButtonCSS()}

            #loadingMessage {
                text-align: center;
                padding: 40px;
            }

            .wrapper-msg {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: baseline;
            }

            #canvas {
                margin-top: 2rem;
                max-height: calc(100vh - 100px);
                max-width: 100%;
            }

            .output {
                margin-top: 20px;
                background: var(--dbp-muted-surface);
                color: var(--dbp-on-muted-surface);
                border: var(--dbp-border);
                border-color: var(--dbp-muted-surface-border-color);
                padding: 10px;
                padding-bottom: 0;
            }

            .output div {
                padding-bottom: 10px;
                word-wrap: break-word;
            }

            .spinner {
                margin-right: 10px;
                font-size: 0.7em;
            }

            #videoSource {
                padding-bottom: calc(0.375em - 2px);
                padding-left: 0.75em;
                padding-right: 1.75em;
                padding-top: calc(0.375em - 2px);
                background-position-x: calc(100% - 0.4rem);
                font-size: inherit;
            }

            #videoSource:hover {
                background: calc(100% - 0.2rem) center no-repeat
                    url('${unsafeCSS(getIconSVGURL('chevron-down'))}');
                color: var(--dbp-content);
                background-position-x: calc(100% - 0.4rem);
                background-size: auto 45%;
            }

            select:not(.select)#videoSource {
                background-size: auto 45%;
            }

            .border {
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: var(--dbp-border);
            }

            #video video,
            #video {
                height: 0px;
                width: 0px;
                opacity: 0;
            }

            @media only screen and (orientation: portrait) and (max-width: 768px) {
                .button-wrapper {
                    display: flex;
                    justify-content: space-between;
                }
            }
        `;
    }

    render() {
        const i18n = this._i18n;
        let hasDevices = this._devices.size > 0;
        let showCanvas = this._videoRunning && !this._askPermission && !this._loading;
        let noSupportString = checkIosMobileSupport(this._devices)
            ? i18n.t('no-ios-support')
            : i18n.t('no-support');

        return html`
            <div class="columns">
                <div class="column">
                    <div class="${classMap({hidden: !hasDevices})}">
                        <div class="button-wrapper">
                            <button
                                class="start button is-primary ${classMap({
                                    hidden: this._videoRunning,
                                })}"
                                @click="${() => this.startScanning()}"
                                title="${i18n.t('start-scan')}">
                                ${i18n.t('start-scan')}
                            </button>
                            <button
                                class="stop button is-primary ${classMap({
                                    hidden: !this._videoRunning,
                                })}"
                                @click="${() => this.stopScanning()}"
                                title="${i18n.t('stop-scan')}">
                                ${i18n.t('stop-scan')}
                            </button>

                            <select id="videoSource" class="button" @change=${this._onUpdateSource}>
                                ${Array.from(this._devices).map(
                                    (item) =>
                                        html`
                                            <option value="${item[0]}">${item[1]}</option>
                                        `
                                )}
                            </select>
                        </div>

                        <div id="loadingMessage" class="${classMap({hidden: showCanvas})}">
                            <div class="wrapper-msg">
                                <dbp-mini-spinner
                                    class="spinner ${classMap({
                                        hidden: !this._loading,
                                    })}"></dbp-mini-spinner>
                                <div class="loadingMsg">${this._loadingMessage}</div>
                            </div>
                        </div>
                        <canvas id="canvas" class="${classMap({hidden: !showCanvas})}"></canvas>
                        <div id="video"></div>
                        <div class="output ${classMap({hidden: !(this.showOutput && showCanvas)})}">
                            ${this._outputData !== null
                                ? html`
                                      <div>
                                          <b>${i18n.t('data')}:</b>
                                          <span>${this._outputData}</span>
                                      </div>
                                  `
                                : html`
                                      <div>${i18n.t('no-qr-detected')}</div>
                                  `}
                        </div>
                    </div>
                    <div class="${classMap({hidden: hasDevices})}">${noSupportString}</div>
                </div>
            </div>
        `;
    }
}
