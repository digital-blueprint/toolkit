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
            stopScan: { type: Boolean, attribute: 'stop-scan' }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        this.updateComplete.then(()=>{
            let devices_map = new Map();

            const that = this;

            navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    devices.forEach(function(device) {
                        console.log(device.kind + ": " + device.label +
                            " id = " + device.deviceId);
                        if(device.kind === 'videoinput') {
                            // TODO Übersetzen
                            let id = device.deviceId;
                            if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                               devices_map.set('user', i18n.t('front-camera'));
                               devices_map.set('environment', 'back-camera');
                            } else {
                                devices_map.set(id ? id : true, device.label || i18n.t('camera') + (devices_map.size + 1));
                            }
                        }
                    });
                    if (devices_map.size < 1) {
                        that.notSupported = true;
                    }
                    for (let [id, label] of devices_map)
                    {
                        let opt = document.createElement("option");
                        opt.value= id;
                        opt.text = label;
                        that._('#videoSource').appendChild(opt);
                    }
                    console.log(devices_map);
                })
                .catch(function(err) {
                    console.log(err.name + ": " + err.message);
                    that.notSupported = true;
                });




        });
    }

    getLoadingMsg(string) {
        let loadingMsg = html `<dbp-mini-spinner class="spinner"></dbp-mini-spinner> ${i18n.t(string)}`;
        return loadingMsg;
    }

    qrCodeScannerInit() {
        this.askPermission = true;

        let video = document.createElement("video");
        let canvasElement = this._("#canvas");
        let canvas = canvasElement.getContext("2d");
        let loadingMessage = this._("#loadingMessage");
        let loadingMessageInner = this._(".loadingMsg");
        let outputContainer = this._("#output");
        let outputMessage = this._("#outputMessage");
        let outputData = this._("#outputData");

        //TODO
        let color = this.scanIsOk ? getComputedStyle(document.documentElement)
                .getPropertyValue('--dbp-success-bg-color') : getComputedStyle(document.documentElement)
            .getPropertyValue('--dbp-danger-bg-color');


        function drawLine(begin, end, color) {
            canvas.beginPath();
            canvas.moveTo(begin.x, begin.y);
            canvas.lineTo(end.x, end.y);
            canvas.lineWidth = 4;
            canvas.strokeStyle = color;
            canvas.stroke();
        }

        const that = this;
        let constraint = null;
        if ( this._('#videoSource').val === 'user' ) {
            constraint = {facingMode:  {exact: ("user")}};
        }
        else if ( this._('#videoSource').val === 'environment' ) {
            constraint = {facingMode:  {exact: ("environment")}};
        }
        navigator.mediaDevices.getUserMedia({ video:  { deviceId: this._('#videoSource').val, constraint}}).then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            that.videoRunning = true;
            requestAnimationFrame(tick);
        }).catch((e) => { console.log(e); that.askPermission = true;});

        function tick() {
            if (that.videoRunning === false) {
                video.srcObject.getTracks().forEach(function(track) {
                    track.stop();
                    console.log("stop early");
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
                var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                var code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });
                if (code) {
                    drawLine(code.location.topLeftCorner, code.location.topRightCorner, that.scanIsOk ? 'green' : 'red');
                    drawLine(code.location.topRightCorner, code.location.bottomRightCorner, that.scanIsOk ? 'green' : 'red');
                    drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, that.scanIsOk ? 'green' : 'red');
                    drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, that.scanIsOk ? 'green' : 'red');
                    outputMessage.hidden = true;
                    outputData.parentElement.hidden = false;
                    outputData.innerText = code.data;
                    that.sendUrl(code.data);
                } else {
                    outputMessage.hidden = false;
                    outputData.parentElement.hidden = true;
                }
            }
            requestAnimationFrame(tick);
        }
    }

    stopScanning() {
        this.askPermission = false;
        this.videoRunning = false;
    }
    
    sendUrl(url) {
        const event = new CustomEvent("dbp-qr-code-scanner-url",
            {  bubbles: true, composed: true , detail: url});
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
            select:not(.select)#videoSource{
                background-size: 15%;
            }
            
            .border{
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid black;
            }
        `;
    }

    //doku
    //demo

    render() {
        return html`
            <div class="columns">
                <div class="column" id="qr">
                    
                    <div class="${classMap({hidden: this.notSupported})}">
                    
                        <div class="button-wrapper">
                            <button class="start button is-primary ${classMap({hidden: this.videoRunning})}" @click="${() => this.qrCodeScannerInit()}">start scanning</button>
                            <button class="stop button is-primary ${classMap({hidden: !this.videoRunning})}" @click="${() => this.stopScanning()}">stop scanning</button>
                            
                            <select id="videoSource"></select>

                        </div>
                       
                        <div id="loadingMessage" class="border ${classMap({hidden: !this.askPermission})}">
                            <div class="wrapper-msg">
                                <dbp-mini-spinner class="spinner ${classMap({hidden: !this.loading})}"></dbp-mini-spinner>
                                <div class="loadingMsg">${i18n.t('no-camera-access')}</div>
                            </div>
                       </div>
                       <canvas id="canvas" hidden class="border"></canvas>
                        
                       
                        <div id="output" hidden class="border ${classMap({hidden: !this.showOutput})}">
                           <div id="outputMessage">${i18n.t('no-qr-detectede')}</div>
                           <div hidden><b>${i18n.t('data')}:</b> <span id="outputData"></span></div>
                        </div>
                    </div>
                    <div class="border ${classMap({hidden: !this.notSupported})}">
                        ${i18n.t('no-support')}
                    </div>
                </div>
            </div>
        `;
    }
}