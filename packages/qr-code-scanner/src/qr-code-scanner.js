import {i18n} from './i18n';
import {css, html} from 'lit-element';
import DBPLitElement from 'dbp-common/dbp-lit-element';
import * as commonStyles from 'dbp-common/styles';
import {Icon, MiniSpinner} from 'dbp-common';
import {classMap} from 'lit-html/directives/class-map.js';
import * as commonUtils from "dbp-common/utils";
import jsQR from "jsqr";


/**
 * Notification web component
 */
export class QrCodeScanner extends DBPLitElement {
    constructor() {
        super();
        this.lang = 'de';

        this.askPermission = false;
        this.videoRunning = false;
        this.notSupported = false;

        this.scanIsOk = true;

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
            scanIsOk: { type: Boolean, attribute: true }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        i18n.changeLanguage(this.lang);
        const that = this;

        this.updateComplete.then(()=>{

            // Check for support & cams
           if (!!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
               navigator.mozGetUserMedia || navigator.msGetUserMedia) && !(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)) {
               console.log("Everything works");
               this.notSupported = false;
           } else {
               this.notSupported = true;
               console.log("not supportet");
           }

           let devices_map = new Map();

           const that = this;

            navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    devices.forEach(function(device) {
                        console.log(device.kind + ": " + device.label +
                            " id = " + device.deviceId);
                        if(device.kind === 'videoinput') {
                            // TODO Übersetzen
                            devices_map.set(device.deviceId, device.label || 'camera ' + (devices_map.size + 1));
                        }
                    });
                    if(devices_map.size < 1) {
                        that.notSupported = true;
                    }
                    for (let [id, label] of devices_map)
                    {
                        let opt = document.createElement("option");
                        opt.value= id;
                        opt.text = label;
                        that._('#videoSource').appendChild(opt);
                    }
                })
                .catch(function(err) {
                    console.log(err.name + ": " + err.message);
                    that.notSupported = true;
                });




        });
    }

    qrCodeScannerInit() {
        this.askPermission = true;

        let video = document.createElement("video");
        let canvasElement = this._("#canvas");
        let canvas = canvasElement.getContext("2d");
        let loadingMessage = this._("#loadingMessage");
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
        // Use facingMode: environment to attemt to get the front camera on phones
        navigator.mediaDevices.getUserMedia({ video: { deviceId: this._('#videoSource').val } }).then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            that.videoRunning = true;
            requestAnimationFrame(tick);

            const track = stream.getVideoTracks()[0];
            track.applyConstraints(constraints)
                .then(() => {
                    advanced : [{ zoom: 3 }]
                    // Do something with the track such as using the Image Capture API.
                })

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
                loadingMessage.innerText = "🎥 Unable to access video stream (please make sure you have a webcam enabled)";
                return;
            }

            loadingMessage.innerText = "⌛ Loading video..."
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                loadingMessage.hidden = true;
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
            
             body {
              font-family: 'Ropa Sans', sans-serif;
              color: #333;
              max-width: 640px;
              margin: 0 auto;
              position: relative;
            }

            #loadingMessage {
              text-align: center;
              padding: 40px;
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
            
            .border{
                border-bottom: 1px solid black;            
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
                    
                        <div class="button-wrapper border">
                            <span class="select">
                                <select id="videoSource"></select>
                            </span>
                            <button class="start button is-primary ${classMap({hidden: this.videoRunning})}" @click="${() => this.qrCodeScannerInit()}">start scanning</button>
                            <button class="stop button is-primary ${classMap({hidden: !this.videoRunning})}" @click="${() => this.stopScanning()}">stop scanning</button>
                        </div>
                        <div id="loadingMessage" class="${classMap({hidden: !this.askPermission})}">🎥 Unable to access video stream (please make sure you have a webcam enabled)</div>
                        <canvas id="canvas" hidden></canvas>
                        
                       
                          <div id="output" hidden>
                            <div id="outputMessage">No QR code detected.</div>
                            <div hidden><b>Data:</b> <span id="outputData"></span></div>
                        </div>
                    </div>
                    <div class="${classMap({hidden: !this.notSupported})}">
                        Ihr device unterstützt keine video aufnahmen
                    </div>
                </div>
            </div>
        `;
    }
}