/* eslint-disable */

/*
This file is self contained and does various runtime checks to detect if teh current browser
is supported. In case it isn't it will replace the whole(!) page with an error message.

Example usage:
    <script src="browser-check.js" defer></script>
    <noscript>Diese Applikation benötigt Javascript / This application requires Javascript</noscript>
*/

(function () {
    // Eval can be disabled through https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
    // Make sure to only call once, to only error once
    let evalSupported = null;
    function supportsEval() {
        if (evalSupported === null) {
            try {
                eval('');
                evalSupported = true;
            } catch (e) {
                evalSupported = false;
            }
        }
        return evalSupported;
    }

    // https://caniuse.com/#feat=es6
    function supportsES6() {
        if (typeof Symbol == 'undefined') return false;

        if (!supportsEval()) {
            // Can't check, assume it works
            return true;
        }

        try {
            eval('class Foo {}');
            eval('var bar = (x) => x+1');
        } catch (e) {
            console.log(e);
            return false;
        }

        return true;
    }

    // https://caniuse.com/#feat=es6-module-dynamic-import
    function supportsDynamicImport() {
        if (!supportsEval()) {
            // Can't check, assume it works
            return true;
        }

        try {
            new Function('import("")');
            return true;
        } catch (err) {
            return false;
        }
    }

    // https://caniuse.com/#feat=shadowdomv1
    function supportsShadowDOM() {
        return (
            typeof Element != 'undefined' &&
            'attachShadow' in Element.prototype &&
            'getRootNode' in Element.prototype
        );
    }

    // https://caniuse.com/#feat=custom-elementsv1
    function supportsCustomElements() {
        return !!window.customElements;
    }

    // https://caniuse.com/#feat=async-functions
    function supportsAsyncAwait() {
        if (!supportsEval()) {
            // Can't check, assume it works
            return true;
        }

        try {
            eval('async () => {}');
        } catch (e) {
            return false;
        }
        return true;
    }

    // https://caniuse.com/#feat=mdn-javascript_statements_import_meta
    function supportsImportMeta() {
        // TODO: sadly no idea how to test this..
        return true;
    }

    // https://caniuse.com/abortcontroller
    function supportsAbortController() {
        // AbortController in older Safari is broken, so check for the signal property
        // as well.
        return !!window.AbortController && Request.prototype.hasOwnProperty('signal');
    }

    // check for safari 13.1+ and safari on iOS 13.4+
    // https://caniuse.com/resizeobserver
    function supportsResizeObserver() {
        return !!window.ResizeObserver;
    }

    // check for globalThis support, required by lit
    // https://caniuse.com/mdn-javascript_builtins_globalthis
    function supportsGlobalThis() {
        return globalThis !== undefined;
    }

    // check for ::part selector support
    // https://caniuse.com/mdn-css_selectors_part
    function supportsCSSpart() {
        try {
            let x = document.createElement('div');

            if (x.part == undefined) {
                x.remove();
                return false;
            }

            x.remove();
        } catch(e) {
            return false;
        }

        return true;
    }

    // Required for newer i18next
    // https://caniuse.com/intl-pluralrules
    function supportsIntlPluralRules() {
        if(typeof Intl === 'undefined' || !Intl.PluralRules){
            return false;
        }

        return true;
    }

    // check for EventTarget() constructor
    // https://caniuse.com/mdn-api_eventtarget_eventtarget
    function supportsEventTargetConstructor() {
        try {
            new EventTarget();
        } catch(e) {
            return false;
        }

        return true;
    }

    function isBrowserSupported() {
        if (!supportsES6()) {
            console.log('ES6 not supported');
            return false;
        }

        if (!supportsDynamicImport()) {
            console.log('Dynamic imports not supported');
            return false;
        }

        if (!supportsShadowDOM()) {
            console.log('Shadow DOM not supported');
            return false;
        }

        if (!supportsCustomElements()) {
            console.log('Custom Elements not supported');
            return false;
        }

        if (!supportsAsyncAwait()) {
            console.log('Async Await not supported');
            return false;
        }

        if (!supportsImportMeta()) {
            console.log('import.meta not supported');
            return false;
        }

        if (!supportsAbortController()) {
            console.log('AbortController not supported');
            return false;
        }

        if (!supportsResizeObserver()) {
            console.log('ResizeObserver not supported');
            return false;
        }

        if (!supportsGlobalThis()) {
            console.log('globalThis not supported');
            return false;
        }

        if (!supportsCSSpart()) {
            console.log('CSS ::part not supported');
            return false;
        }

        if(!supportsIntlPluralRules()){
            console.log('Intl.PluralRules not supported')
            return false;
        }

        if (!supportsEventTargetConstructor()) {
            console.log('EventTarget() constructor not supported');
            return false;
        }

        return true;
    }

    var MultiString = function (f) {
        return f.toString().split('\n').slice(1, -1).join('\n');
    };

    var ms = MultiString(function () {
        /**
<style>
    #unsupported .overlay {
        font-family: sans-serif;
        font-size: 0.9em;
        line-height: 1.5em;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fafafa;
        color: #333;
        z-index: 1001;
    }
    #unsupported .content{
        position: absolute;
        top: 50%;
        left: 0;
        text-align: center;
        width: 80%;
        left: 10%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
    }
    #unsupported .separator {
        letter-spacing: 0.3em;
        margin: 2em 0;
    }
</style>
<div id="unsupported">
    <div class="overlay">
        <div class="content">
            <h2>Ihr Browser wird leider nicht mehr unterstützt</h2>
            <p>
                Diese Applikation benötigt Funktionen, die von Ihrem aktuellen Browser noch nicht bereitgestellt werden.
                Bitte probieren Sie es mit einem anderen Browser oder aktualisieren Sie Ihren aktuellen.
            </p>
            <h3 class="separator">🙁🙁🙁🙁🙁🙁🙁🙁🙁🙁🙁🙁</h3>
            <h2>Your browser is sadly no longer supported</h2>
            <p>
                This application requires features that are not yet provided by your current browser.
                Please try to use a different browser or update your current one.
            </p>
        </div>
    </div> 
</div>
**/
    });

    function main() {
        if (!isBrowserSupported()) {
            document.body.innerHTML = ms;
        }
    }

    main();
})();
