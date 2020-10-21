import {i18n} from './i18n';
import {css, html} from 'lit-element';
import DBPLitElement from 'dbp-common/dbp-lit-element';
import * as commonStyles from 'dbp-common/styles';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import {Icon, MiniSpinner} from 'dbp-common';
import {classMap} from 'lit-html/directives/class-map.js';
import jsQR from "jsqr";


/**
 * Returns the ID for the most important device
 *
 * @param {Map} devices
 * @returns {string|null} the ID
 */
function getPrimaryDevice(devices) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (devices.has('environment'))
            return 'environment';
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
 * @returns {Map<string,string>} the map of devices
 */
async function getVideoDevices() {
    let devices_map = new Map();
    if (navigator.mediaDevices
        && navigator.mediaDevices.enumerateDevices
        && navigator.mediaDevices.getUserMedia) {

        let devices;
        try {
            devices = await navigator.mediaDevices.enumerateDevices();
        } catch (err) {
            console.log(err.name + ": " + err.message);
            return devices_map;
        }

        for (let device of devices) {
            if (device.kind === 'videoinput') {
                let id = device.deviceId;
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    devices_map.set('environment', i18n.t('back-camera'));
                    devices_map.set('user', i18n.t('front-camera'));
                } else {
                    devices_map.set(id ? id : true, device.label || i18n.t('camera') + (devices_map.size + 1));
                }
            }
        }
        return devices_map;
    } else {
        return devices_map;
    }
}


/**
 * Notification web component
 */
export class QrCodeScanner extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';

        this.askPermission = false;
        this.videoRunning = false;
        this.front = false;
        this.loading = false;

        this.showOutput = false;
        this.stopScan = false;

        this.activeCamera = '';
        this.sourceChanged = false;

        this._devices = new Map();
        this._requestID = null;
        this._loadingMessage = '';

        this.matchRegex = '.*';
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            askPermission: { type: Boolean, attribute: false },
            videoRunning: { type: Boolean, attribute: false },
            front: { type: Boolean, attribute: false },
            loading: { type: Boolean, attribute: false },
            showOutput: { type: Boolean, attribute: 'show-output' },
            stopScan: { type: Boolean, attribute: 'stop-scan' },
            activeCamera: { type: String, attribute: false },
            sourceChanged: { type: Boolean, attribute: false },
            _devices: { type: Map, attribute: false},
            _loadingMessage: { type: String, attribute: false },
            matchRegex: { type: String, attribute: 'match-regex' },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);

        this.updateComplete.then(async ()=>{
            this._loadingMessage = i18n.t('no-camera-access');
            let devices = await getVideoDevices();
            this.activeCamera = getPrimaryDevice(devices) || '';
            this._devices = devices;

            if (!this.stopScan) {
                this.startScanning();
            }
        });
    }

    disconnectedCallback() {
        this.stopScanning();
        super.disconnectedCallback();
    }

    updated(changedProperties) {
        if (changedProperties.get('stopScan') && !this.stopScan) {
            this.startScanning();
        }
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    /**
     * Init and start the video and QR code scan
     *
     */
    async startScanning() {

        this.stopScan = false;
        this.askPermission = true;

        let video = document.createElement("video");
        let canvasElement = this._("#canvas");
        let canvas = canvasElement.getContext("2d");
        let loadingMessage = this._("#loadingMessage");
        let outputContainer = this._("#output");
        let outputMessage = this._("#outputMessage");
        let outputData = this._("#outputData");
        let qrContainer = this._("#qr");
        let scroll = false;

        let okColor = getComputedStyle(this).getPropertyValue('--dbp-success-bg-color');
        let notOkColor = getComputedStyle(this).getPropertyValue('--dbp-danger-bg-color');

        let videoId = this.activeCamera;
        let constraint = { video:  { deviceId: videoId } };
        if ( (videoId === 'environment' || videoId === '') ) {
            console.log("vid:", videoId);
            constraint =  { video: { facingMode: "environment" } };
        } else if ( videoId === 'user' ) {
            console.log("vid2:", videoId);
            constraint =  { video: { facingMode: "user" } };
        }

        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraint);
        } catch(e) {
            console.log(e);
            this.askPermission = true;
        }

        if (stream !== null) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            this.videoRunning = true;
            qrContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (this._requestID !== null) {
                cancelAnimationFrame(this._requestID);
                this._requestID = null;
            }
            console.assert(this._requestID === null);
            this._requestID = requestAnimationFrame(tick);
        }

        const that = this;
        let lastVideoScanTime = -1;
        let lastCode = null;
        let lastSentData = null;

        function tick() {
           that._requestID = null;

           if (that.sourceChanged) {
                video.srcObject.getTracks().forEach(function(track) {
                    track.stop();
                    console.log("Changed Media");
                });
                that.sourceChanged = false;
                that.startScanning();
                return;
            }
            if (that.videoRunning === false) {
                video.srcObject.getTracks().forEach(function(track) {
                    track.stop();
                    loadingMessage.hidden = false;
                    canvasElement.hidden = true;
                    outputContainer.hidden = true;
                });
                that._loadingMessage = i18n.t('no-camera-access');
                return;
            }
            if (that.stopScan) {
                video.srcObject.getTracks().forEach(function(track) {
                    track.stop();
                    console.log("stop early");
                    loadingMessage.hidden = false;
                    canvasElement.hidden = true;
                    outputContainer.hidden = true;
                });
                that._loadingMessage = i18n.t('finished-scan');
                return;
            }
            that.loading = true;
            that._loadingMessage = i18n.t('loading-video');
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                loadingMessage.hidden = true;
                that.loading = false;
                canvasElement.hidden = false;
                outputContainer.hidden = false;

                canvasElement.height = video.videoHeight;
                canvasElement.width = video.videoWidth;
                canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

                let maskWidth = canvasElement.width;
                let maskHeight = canvasElement.height;
                let maskStartX = 0;
                let maskStartY = 0;

                let maxSize = canvasElement.width > canvasElement.height ? canvasElement.height/4 * 3 : canvasElement.width/4 * 3;
                console.assert(maxSize <= canvasElement.width && maxSize <= canvasElement.height);
                maskWidth = maxSize;
                maskHeight = maxSize;
                maskStartX = canvasElement.width/2 - maskWidth/2;
                maskStartY = canvasElement.height/2 - maskHeight/2;

                let code = null;
                // We only check for QR codes 5 times a second to improve performance
                let shouldAnalyze = Math.abs(lastVideoScanTime - video.currentTime) >= 1/3;
                if (shouldAnalyze) {
                    lastVideoScanTime = video.currentTime;
                    let imageData = canvas.getImageData(maskStartX, maskStartY, maskWidth, maskHeight);
                    code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });
                    lastCode = code;
                } else {
                    code = lastCode;
                }

                let matched = code ? code.data.match(that.matchRegex) !== null : false;

                //draw mask
                canvas.beginPath();
                canvas.fillStyle = "#0000006e";
                canvas.moveTo(0,0);
                canvas.lineTo(0, canvasElement.height);
                canvas.lineTo( canvasElement.width, canvasElement.height);
                canvas.lineTo( canvasElement.width,0);
                canvas.rect(maskStartX, maskStartY, maskWidth, maskHeight);
                canvas.fill();

                canvas.beginPath();
                if (code)
                    canvas.fillStyle = matched ? okColor : notOkColor;
                else
                    canvas.fillStyle = 'white';

                let borderWidth = Math.max(maskWidth, maskHeight) / 50;
                canvas.moveTo(maskStartX,maskStartY);
                canvas.rect(maskStartX, maskStartY, maskWidth/3, borderWidth);
                canvas.rect(maskStartX, maskStartY, borderWidth, maskHeight/3);
                canvas.rect(maskStartX + maskWidth/3*2, maskStartY, maskWidth/3, borderWidth);
                canvas.rect(maskStartX + maskWidth - borderWidth, maskStartY, borderWidth, maskHeight/3);
                canvas.rect(maskStartX, maskStartY + maskHeight - borderWidth, maskWidth/3, borderWidth);
                canvas.rect(maskStartX, maskStartY + maskHeight/3*2, borderWidth, maskHeight/3);
                canvas.rect(maskStartX + maskWidth/3*2, maskStartY + maskHeight - borderWidth, maskWidth/3, borderWidth);
                canvas.rect(maskStartX + maskWidth - borderWidth, maskStartY + maskHeight/3*2, borderWidth, maskHeight/3);
                canvas.fill();

                if (code) {
                    outputMessage.hidden = true;
                    outputData.parentElement.hidden = false;
                    if (lastSentData !== code.data) {
                        that.sendUrl(code.data);
                        outputData.innerText = code.data;
                    }
                    lastSentData = code.data;
                } else {
                    outputMessage.hidden = false;
                    outputData.parentElement.hidden = true;
                    lastSentData = null;
                }
            }
            if (video.readyState === video.HAVE_ENOUGH_DATA && !scroll) {
                qrContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                scroll = true;
            }
            console.assert(that._requestID === null);
            that._requestID = requestAnimationFrame(tick);
        }
    }

    /**
     * Update if video source is changed
     *
     * @param e
     */
    updateSource(e) {
        this.activeCamera = e.srcElement.value;
        this.sourceChanged = true;
    }

    /**
     * Stops the active video and scan process
     *
     */
    stopScanning() {
        this.askPermission = false;
        this.videoRunning = false;
    }

    /**
     * Sends an event with the data which is detected from QR code reader
     *
     * @param data
     */
    sendUrl(data) {
       const event = new CustomEvent("code-detected",
            {  bubbles: true, composed: true , detail: {'code': data}});
        this.dispatchEvent(event);
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
                width: 100%;
                margin-top: 2rem;
                max-height: 100%;
            }
        
            #output {
                  margin-top: 20px;
                  background: #eee;
                  padding: 10px;
                  padding-bottom: 0;
            }
        
            #output div {
                  padding-bottom: 10px;
                  word-wrap: break-word;
            }
        
            #noQRFound {
                text-align: center;
            }
            
            .spinner{
                margin-right: 10px;
                font-size: 0.7em;
            }
            
            #videoSource{
                padding-bottom: calc(0.375em - 2px);
                padding-left: 0.75em;
                padding-right: 1.75em;
                padding-top: calc(0.375em - 2px);
                background-position-x: calc(100% - 0.4rem);
                font-size: inherit;
            }
            
            #videoSource:hover {
                background: calc(100% - 0.2rem) center no-repeat url("https://mw-frontend-dev.tugraz.at/apps/checkin/local/dbp-common/icons/chevron-down.svg");
                color: black;
                background-position-x: calc(100% - 0.4rem);
                background-size: auto 45%;
            }
            
            select:not(.select)#videoSource{
                background-size: auto 45%;
            }
            
            .border{
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid black;
            }
            
            @media only screen
            and (orientation: portrait)
            and (max-device-width: 765px) {   
                .button-wrapper{    
                    display: flex;
                   justify-content: space-between;
                }
            }
        `;
    }

    render() {
        let hasDevices = this._devices.size > 0;

        return html`
            <div class="columns">
                <div class="column" id="qr">
                    
                    <div class="${classMap({hidden: !hasDevices})}">
                    
                        
                        <div class="button-wrapper">
                            <button class="start button is-primary ${classMap({hidden: this.videoRunning})}" @click="${() => this.startScanning()}" title="${i18n.t('start-scan')}">${i18n.t('start-scan')}</button>
                            <button class="stop button is-primary ${classMap({hidden: !this.videoRunning})}" @click="${() => this.stopScanning()}" title="${i18n.t('stop-scan')}">${i18n.t('stop-scan')}</button>
                            
                            <select id="videoSource" class="button" @change=${this.updateSource}>
                                ${Array.from(this._devices).map(item => html`<option value="${item[0]}">${item[1]}</option>`)}
                            </select>

                        </div>
                       
                        <div id="loadingMessage" class=" ${classMap({hidden: !this.askPermission})}">
                            <div class="wrapper-msg">
                                <dbp-mini-spinner class="spinner ${classMap({hidden: !this.loading})}"></dbp-mini-spinner>
                                <div class="loadingMsg">${this._loadingMessage}</div>
                            </div>
                       </div>
                       <canvas id="canvas" hidden class=""></canvas>
                        <pre id="error"></pre>
                       
                        <div id="output" hidden class=" ${classMap({hidden: !this.showOutput})}">
                           <div id="outputMessage">${i18n.t('no-qr-detected')}</div>
                           <div hidden><b>${i18n.t('data')}:</b> <span id="outputData"></span></div>
                        </div>
                    </div>
                    <div class="${classMap({hidden: hasDevices})}">
                        ${i18n.t('no-support')}
                    </div>
                </div>
            </div>
        `;
    }
}