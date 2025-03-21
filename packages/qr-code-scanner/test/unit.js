import {assert} from 'chai';

import '../src/dbp-qr-code-scanner';
import {QrCodeScannerEngine} from '../src';

suite('dbp-qr-code-scanner basics', () => {
    let node;

    setup(async () => {
        node = document.createElement('dbp-qr-code-scanner');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    teardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert.isNotNull(node.shadowRoot);
    });
});

suite('scan image', () => {
    test('should detect', async () => {
        let engine = new QrCodeScannerEngine();
        let image = new Image();
        image.setAttribute(
            'src',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmAQMAAACS83vtAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bi1IqDu0gopChdbIgKuKoVShChVArtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APE0clJ0UVK/F9SaBHjwXE/3t173L0D/M0qU82ecUDVLCOTSgq5/KrQ+4ogIghhBHGJmfqcKKbhOb7u4ePrXYJneZ/7c/QrBZMBPoF4lumGRbxBPL1p6Zz3iaOsLCnE58RjBl2Q+JHrsstvnEsO+3lm1Mhm5omjxEKpi+UuZmVDJZ4ijimqRvn+nMsK5y3OarXO2vfkLwwXtJVlrtMcRgqLWIIIATLqqKAKCwlaNVJMZGg/6eEfcvwiuWRyVcDIsYAaVEiOH/wPfndrFicn3KRwEgi+2PZHHOjdBVoN2/4+tu3WCRB4Bq60jr/WBGY+SW90tNgRMLANXFx3NHkPuNwBBp90yZAcKUDTXywC72f0TXkgcguE1tze2vs4fQCy1FX6Bjg4BEZLlL3u8e6+7t7+PdPu7wdo/XKjkhoyogAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+YFEwogFupCMRsAAAAGUExURQAAAP///6XZn90AAAABYktHRAH/Ai3eAAAAuUlEQVQI12P4DwR/GDDJD1KfFWwYvt/ctn4Pw5fYnRpAMrz1BZCM6wKS3y97vN/D8EHUa4ENw//PrPZ/GH7e7FwKJA19l9ow/Lv4extQzdPvjEBzBH+31jB80jyVu4fh//09JjDyn1Ef5x+Gz7caltswfM2xOruH4Y8Qd8Ueho8rnHhrGP6yWjPWAE0+uNOG4YMM+wqgaTe3WtYwfInoZQaS0b1BQDKcZRLQhZf99gJtkSieuIcBh18ArRODGZrlUXYAAAAASUVORK5CYII=',
        );
        let res;

        res = await engine.scanImage(image);
        assert.strictEqual(res.data, 'http://en.m.wikipedia.org');

        // the second time the same
        res = await engine.scanImage(image);
        assert.strictEqual(res.data, 'http://en.m.wikipedia.org');

        // if we don't scan the whole thing then it fails
        res = await engine.scanImage(image, {x: 0, y: 0, width: 5, height: 5});
        assert.isNull(res);

        // if we pass the right size, then everything is OK again
        res = await engine.scanImage(image, {x: 0, y: 0, width: image.width, height: image.height});
        assert.strictEqual(res.data, 'http://en.m.wikipedia.org');
    });
});
