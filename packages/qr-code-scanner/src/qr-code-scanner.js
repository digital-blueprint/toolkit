import {i18n} from './i18n';
import {css, html, LitElement} from 'lit-element';
import DBPLitElement from 'dbp-common/dbp-lit-element';
import * as commonStyles from 'dbp-common/styles';
import {ScopedElementsMixin} from '@open-wc/scoped-elements';
import * as commonUtils from 'dbp-common/utils';
import {Button, Icon, MiniSpinner} from 'dbp-common';
import {classMap} from 'lit-html/directives/class-map.js';
import jsQR from "jsqr";


/**
 * Notification web component
 */
export class QrCodeScanner extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';

        this.askPermission = false;
        this.videoRunning = false;
        this.notSupported = false;
        this.front = false;
        this.loading = false;

        this.scanIsOk = false;
        this.showOutput = false;
        this.stopScan = false;

        this.activeCamera = '';
        this.sourceChanged = false;

        this.clipMask = false;
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
            notSupported: { type: Boolean, attribute: false },
            front: { type: Boolean, attribute: false },
            loading: { type: Boolean, attribute: false },
            scanIsOk: { type: Boolean, attribute: 'scan-is-ok' },
            showOutput: { type: Boolean, attribute: 'show-output' },
            stopScan: { type: Boolean, attribute: 'stop-scan' },
            activeCamera: { type: String, attribute: false },
            sourceChanged: { type: Boolean, attribute: false },
            clipMask: { type: Boolean, attribute: 'clip-mask' }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        this.updateComplete.then(()=>{
            this.checkSupport();
            if (!this.stopScan) {
                this.qrCodeScannerInit();
            }
        });
    }

    disconnectedCallback() {
        this.stopScanning();
        super.disconnectedCallback();
    }

    updated(changedProperties) {
        if (changedProperties.get('stopScan') && !this.stopScan) {
            this.qrCodeScannerInit();
        }
    };

    /**
     * Ckecks if browser support video recording
     * Gets video devices of device
     *
     */
    checkSupport() {
        const that = this;
        let devices_map = new Map();
        if (navigator.mediaDevices
            && navigator.mediaDevices.enumerateDevices
            && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                    devices.forEach(function (device) {
                        if (device.kind === 'videoinput') {
                            let id = device.deviceId;
                            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                devices_map.set('environment', i18n.t('back-camera'));
                                devices_map.set('user', i18n.t('front-camera'));
                            } else {
                                devices_map.set(id ? id : true, device.label || i18n.t('camera') + (devices_map.size + 1));
                            }
                        }
                    });
                    if (devices_map.size < 1) {
                        that.notSupported = true;
                    }
                    for (let [id, label] of devices_map) {
                        let opt = document.createElement("option");
                        opt.value = id;
                        opt.text = label;
                        that._('#videoSource').appendChild(opt);
                    }
                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        that.activeCamera = 'environment';
                    } else {
                        that.activeCamera = devices_map.size ? Array.from(devices_map)[0][0] : '';
                    }
                })
                .catch(function (err) {
                    console.log(err.name + ": " + err.message);
                    that.notSupported = true;
                });
        } else if (MediaStreamTrack && MediaStreamTrack.getSources) {
            this._log("MediaStreamTrack.getSources used");
            const callback = sourceInfos => {
                const results = [];
                for (let i = 0; i !== sourceInfos.length; ++i) {
                    const sourceInfo = sourceInfos[i];
                    if (sourceInfo.kind === 'video') {
                        devices_map.set(sourceInfo.id ? sourceInfo.id : true, sourceInfo.label || i18n.t('camera') + (devices_map.size + 1))
                        results.push({
                            id: sourceInfo.id,
                            label: sourceInfo.label
                        });
                    }
                }
                this._log(`${results.length} results found`);

                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    that.activeCamera = 'environment';
                } else {
                    that.activeCamera = devices_map.size ? Array.from(devices_map)[0][0] : '';
                }
                resolve(results);
            }
            MediaStreamTrack.getSources(callback);
        }
        else {
            that.notSupported = true;
        }

    }

    /**
     * Get a loading message
     *
     * @param string
     */
    getLoadingMsg(string) {
        let loadingMsg = html `<dbp-mini-spinner class="spinner"></dbp-mini-spinner> ${i18n.t(string)}`;
        return loadingMsg;
    }

    /**
     * Init and start the video and QR code scan
     *
     */
    qrCodeScannerInit() {

        this.stopScan = false;
        this.askPermission = true;

        let video = document.createElement("video");
        let canvasElement = this._("#canvas");
        let canvas = canvasElement.getContext("2d");
        let loadingMessage = this._("#loadingMessage");
        let loadingMessageInner = this._(".loadingMsg");
        let outputContainer = this._("#output");
        let outputMessage = this._("#outputMessage");
        let outputData = this._("#outputData");
        let qrContainer = this._("#qr");

        let color = this.scanIsOk ? getComputedStyle(this)
                .getPropertyValue('--dbp-success-bg-color') : getComputedStyle(this)
            .getPropertyValue('--dbp-danger-bg-color');

        function drawLine(begin, end, color) {
            canvas.beginPath();
            canvas.moveTo(begin.x, begin.y);
            canvas.lineTo(end.x, end.y);
            canvas.lineWidth = 4;
            canvas.strokeStyle = color;
            canvas.stroke();
        }

        let videoId = this.activeCamera;
        let constraint = { video:  { deviceId: videoId } };
        if ( (videoId === 'environment' || videoId === '') ) {
            console.log("vid:", videoId);
            constraint =  { video: { facingMode: "environment" } };
        } else if ( videoId === 'user' ) {
            console.log("vid2:", videoId);
            constraint =  { video: { facingMode: "user" } };
        }

        const that = this;

        navigator.mediaDevices.getUserMedia(constraint).then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            that.videoRunning = true;
            qrContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            requestAnimationFrame(tick);
        }).catch((e) => { console.log(e); that.askPermission = true;});

        let lastVideoTime = -1;
        let lastCode = null;

        function tick() {
           if (that.sourceChanged) {
                video.srcObject.getTracks().forEach(function(track) {
                    track.stop();
                    console.log("Changed Media");
                });
                that.sourceChanged = false;
                that.qrCodeScannerInit();
                return;
            }
            if (that.videoRunning === false) {
                video.srcObject.getTracks().forEach(function(track) {
                    track.stop();
                    loadingMessage.hidden = false;
                    canvasElement.hidden = true;
                    outputContainer.hidden = true;
                });
                loadingMessageInner.innerText = i18n.t('no-camera-access');
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
                loadingMessageInner.innerText = i18n.t('finished-scan');
                return;
            }
            that.loading = true;
            loadingMessageInner.innerText = i18n.t('loading-video');
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                loadingMessage.hidden = true;
                that.loading = false;
                canvasElement.hidden = false;
                outputContainer.hidden = false;

                canvasElement.height = video.videoHeight;
                canvasElement.width = video.videoWidth;
                canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);


                let maskWidth = 0;
                let maskHeight = 0;
                let maskStartX = canvasElement.width;
                let maskStartY = canvasElement.height;

                let imageData = canvas.getImageData(0 , 0, canvasElement.width, canvasElement.height)
                
                if (that.clipMask) {
                    //draw mask
                    let clip = canvasElement.width > canvasElement.height ? canvasElement.height/4 * 3 : canvasElement.width/4 * 3;
                    maskWidth = clip < 250 ? 250 : clip;
                    maskHeight = clip < 250 ? 250 : clip;
                    clip = clip < 250 ? 250 : clip;
                    maskStartX = canvasElement.width/2 - maskWidth/2;
                    maskStartY = canvasElement.height/2 - maskHeight/2;

                    canvas.beginPath();
                    canvas.fillStyle = "#0000006e";
                    canvas.moveTo(0,0);
                    canvas.lineTo(0, canvasElement.width);
                    canvas.lineTo( canvasElement.width, canvasElement.height);
                    canvas.lineTo( canvasElement.width,0);
                    canvas.rect(maskStartX, maskStartY, maskWidth, maskHeight);
                    canvas.fill();

                    canvas.beginPath();
                    canvas.fillStyle = "white";
                    canvas.moveTo(maskStartX,maskStartY);
                    canvas.rect(maskStartX, maskStartY, clip/3, 10);
                    canvas.rect(maskStartX, maskStartY, 10, clip/3);

                    canvas.rect(maskStartX + clip/3*2, maskStartY, clip/3, 10);
                    canvas.rect(maskStartX + clip - 10, maskStartY, 10, clip/3);

                    canvas.rect(maskStartX, maskStartY + clip -10, clip/3, 10);
                    canvas.rect(maskStartX, maskStartY + clip/3*2, 10, clip/3);

                    canvas.rect(maskStartX + clip/3*2, maskStartY + clip -10, clip/3, 10);
                    canvas.rect(maskStartX + clip - 10, maskStartY + clip/3*2, 10, clip/3);

                    canvas.fill();

                    imageData = canvas.getImageData(maskStartX , maskStartY, maskWidth, maskHeight);
                }

                let code = null;
                // We only check for QR codes 5 times a second to improve performance
                let shouldAnalyze = Math.abs(lastVideoTime - video.currentTime) >= 1/5;
                if (shouldAnalyze) {
                    lastVideoTime = video.currentTime;
                    code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });
                    lastCode = code;
                } else {
                    code = lastCode;
                }

                if (code) {
                    let topLeftCorner = code.location.topLeftCorner;
                    let topRightCorner = code.location.topRightCorner;
                    let bottomRightCorner = code.location.bottomRightCorner;
                    let bottomLeftCorner = code.location.bottomLeftCorner;

                    if (that.clipMask) {
                        topLeftCorner.x += maskStartX;
                        topLeftCorner.y += maskStartY;
                        topRightCorner.x += maskStartX;
                        topRightCorner.y += maskStartY;
                        bottomRightCorner.x += maskStartX;
                        bottomRightCorner.y += maskStartY;
                        bottomLeftCorner.x += maskStartX;
                        bottomLeftCorner.y += maskStartY;
                    }

                    drawLine(topLeftCorner, topRightCorner, color);
                    drawLine(topRightCorner, bottomRightCorner, color);
                    drawLine(bottomRightCorner, bottomLeftCorner, color);
                    drawLine(bottomLeftCorner, topLeftCorner, color);

                    outputMessage.hidden = true;
                    outputData.parentElement.hidden = false;
                    outputData.innerText = code.data;
                    that.sendUrl(code.data);
                } else {
                    outputMessage.hidden = false;
                    outputData.parentElement.hidden = true;
                }
            }
            qrContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            requestAnimationFrame(tick);
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
       const event = new CustomEvent("dbp-qr-code-scanner-data",
            {  bubbles: true, composed: true , detail: data});
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
        return html`
            <div class="columns">
                <div class="column" id="qr">
                    
                    <div class="${classMap({hidden: this.notSupported})}">
                    
                        
                        <div class="button-wrapper">
                            <button class="start button is-primary ${classMap({hidden: this.videoRunning})}" @click="${() => this.qrCodeScannerInit(this)}" title="${i18n.t('start-scan')}">${i18n.t('start-scan')}</button>
                            <button class="stop button is-primary ${classMap({hidden: !this.videoRunning})}" @click="${() => this.stopScanning()}" title="${i18n.t('stop-scan')}">${i18n.t('stop-scan')}</button>
                            
                            <select id="videoSource" class="button" @change=${this.updateSource}></select>

                        </div>
                       
                        <div id="loadingMessage" class=" ${classMap({hidden: !this.askPermission})}">
                            <div class="wrapper-msg">
                                <dbp-mini-spinner class="spinner ${classMap({hidden: !this.loading})}"></dbp-mini-spinner>
                                <div class="loadingMsg">${i18n.t('no-camera-access')}</div>
                            </div>
                       </div>
                       <canvas id="canvas" hidden class=""></canvas>
                        <pre id="error"></pre>
                       
                        <div id="output" hidden class=" ${classMap({hidden: !this.showOutput})}">
                           <div id="outputMessage">${i18n.t('no-qr-detected')}</div>
                           <div hidden><b>${i18n.t('data')}:</b> <span id="outputData"></span></div>
                        </div>
                    </div>
                    <div class="${classMap({hidden: !this.notSupported})}">
                        ${i18n.t('no-support')}
                    </div>
                </div>
            </div>
        `;
    }
}