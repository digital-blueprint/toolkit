import './vpu-mini-spinner.js';
import './vpu-spinner.js';
import './vpu-icon.js';
import './vpu-button.js';
import {init, captureMessage, captureException} from './errorreport';

// error reporting
init({debug: false, release: 'vpu-common@0.1'});
captureMessage("test error message");
captureException(new Error('another error'));
setTimeout(() => {
    throw new Error("an error");
});
