import {importPdfJs} from '@dbp-toolkit/pdf-viewer';
import * as commonUtils from '@dbp-toolkit/common/utils';
//import keys from "../dist/shared/index.es.DXc8AeoU.es.js";

/**
 * @typedef {{code: string, name: string}} Country
 * @typedef {Record<string, string>} CountryMapping
 */

export const getPDFFileBase64Content = (file) => {
    return file.contentUrl.replace(/data:\s*application\/pdf;\s*base64,/, '');
};

/**
 * Returns the content of the file
 * @param {File} file The file to read
 * @returns {Promise<string>} The content
 */
export const readBinaryFileContent = async (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new TypeError('Failed to read file as a binary string'));
            }
        };
        reader.onerror = () => {
            const error = /** @type {DOMException} */ (reader.error);
            reject(error);
        };
        reader.readAsBinaryString(file);
    });
};

export const getReferenceNumberFromPDF = async (file) => {
    const data = await readBinaryFileContent(file);

    // Load PDF
    let pdfjs = await importPdfJs();
    const pdf = await pdfjs.getDocument({data: data}).promise;
    let referenceNumber = null;

    // Get first page of the PDF
    await pdf.getPage(1).then(async (page) => {
        // Get the annotations for the page
        await page.getAnnotations().then(async (annotations) => {
            // Loop through the annotations
            await commonUtils.asyncArrayForEach(annotations, (annotation) => {
                // Check if the annotation is a business number, and we haven't found one yet
                if (
                    referenceNumber === null &&
                    annotation.contentsObj.str.startsWith('dbp_annotation_bbe3a371=')
                ) {
                    let contents = annotation.contentsObj.str;
                    referenceNumber = contents.substring(contents.indexOf('=') + 1);
                }
            });
        });
    });

    return referenceNumber;
};

export const convertDataURIToBinary = (dataURI) => {
    const BASE64_MARKER = ';base64,';
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    let array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    return array;
};

export const getDataURIContentType = (dataURI) => {
    const BASE64_MARKER = ';base64,';
    const base64Index = dataURI.indexOf(BASE64_MARKER);

    return dataURI.substring(5, base64Index);
};

/** @returns {Country[]} */
export function getGermanCountryList() {
    return Object.entries(getGermanCountryMapping())
        .sort(([, a], [, b]) => a.localeCompare(b, 'de'))
        .map(([code, name]) => ({code, name}));
}

/** @returns {Country[]} */
export function getEnglishCountryList() {
    return Object.entries(getEnglishCountryMapping())
        .sort(([, a], [, b]) => a.localeCompare(b, 'en'))
        .map(([code, name]) => ({code, name}));
}

/** @returns {CountryMapping} */
export function getGermanCountryMapping() {
    let allCountries = new Intl.DisplayNames(['de-AT'], {type: 'region'});
    const countryCodes = [
        'AF',
        'EG',
        'AL',
        'DZ',
        'AD',
        'AO',
        'AG',
        'GQ',
        'AR',
        'AM',
        'AZ',
        'ET',
        'AU',
        'BS',
        'BH',
        'BD',
        'BB',
        'BY',
        'BE',
        'BZ',
        'BJ',
        'BT',
        'BO',
        'BA',
        'BW',
        'BR',
        'BN',
        'BG',
        'BF',
        'BI',
        'CL',
        'CN',
        'CR',
        'CI',
        'DK',
        'DE',
        'DM',
        'DO',
        'DJ',
        'EC',
        'SV',
        'ER',
        'EE',
        'FJ',
        'FI',
        'FR',
        'GA',
        'GM',
        'GE',
        'GH',
        'GD',
        'GR',
        'GT',
        'GN',
        'GW',
        'GY',
        'HT',
        'HN',
        'IN',
        'ID',
        'IQ',
        'IR',
        'IE',
        'IS',
        'IL',
        'IT',
        'JM',
        'JP',
        'YE',
        'JO',
        'KH',
        'CM',
        'CA',
        'CV',
        'KZ',
        'QA',
        'KE',
        'KG',
        'KI',
        'CO',
        'KM',
        'CG',
        'CD',
        'KP',
        'KR',
        'XK',
        'HR',
        'CU',
        'KW',
        'LA',
        'LS',
        'LV',
        'LB',
        'LR',
        'LY',
        'LI',
        'LT',
        'LU',
        'MG',
        'MW',
        'MY',
        'MV',
        'ML',
        'MT',
        'MA',
        'MH',
        'MR',
        'MU',
        'MK',
        'MX',
        'FM',
        'MD',
        'MC',
        'MN',
        'ME',
        'MZ',
        'MM',
        'NA',
        'NR',
        'NP',
        'NZ',
        'NI',
        'NL',
        'NE',
        'NG',
        'NO',
        'OM',
        'AT',
        'PK',
        'PW',
        'PA',
        'PG',
        'PY',
        'PE',
        'PH',
        'PL',
        'PT',
        'RW',
        'RO',
        'RU',
        'SB',
        'ZM',
        'WS',
        'SM',
        'ST',
        'SA',
        'SE',
        'CH',
        'SN',
        'RS',
        'SC',
        'SL',
        'ZW',
        'SG',
        'SK',
        'SI',
        'SO',
        'ES',
        'LK',
        'KN',
        'LC',
        'VC',
        'ZA',
        'SR',
        'SZ',
        'SY',
        'TJ',
        'TZ',
        'TH',
        'TL',
        'TG',
        'TO',
        'TT',
        'TD',
        'CZ',
        'TN',
        'TR',
        'TM',
        'TV',
        'UG',
        'UA',
        'HU',
        'UY',
        'UZ',
        'VU',
        'VA',
        'VE',
        'AE',
        'US',
        'GB',
        'VN',
        'CF',
        'CY',
        'SS',
        'SD',
    ];
    const countryNames = Object.fromEntries(
        countryCodes.map((code) => [code, allCountries.of(code) ?? code]),
    );

    return countryNames;
}

/** @returns {CountryMapping} */
export function getEnglishCountryMapping() {
    let allCountries = new Intl.DisplayNames(['en-AT'], {type: 'region'});
    const countryCodes = [
        'AF',
        'EG',
        'AL',
        'DZ',
        'AD',
        'AO',
        'AG',
        'GQ',
        'AR',
        'AM',
        'AZ',
        'ET',
        'AU',
        'BS',
        'BH',
        'BD',
        'BB',
        'BY',
        'BE',
        'BZ',
        'BJ',
        'BT',
        'BO',
        'BA',
        'BW',
        'BR',
        'BN',
        'BG',
        'BF',
        'BI',
        'CL',
        'CN',
        'CR',
        'CI',
        'DK',
        'DE',
        'DM',
        'DO',
        'DJ',
        'EC',
        'SV',
        'ER',
        'EE',
        'FJ',
        'FI',
        'FR',
        'GA',
        'GM',
        'GE',
        'GH',
        'GD',
        'GR',
        'GT',
        'GN',
        'GW',
        'GY',
        'HT',
        'HN',
        'IN',
        'ID',
        'IQ',
        'IR',
        'IE',
        'IS',
        'IL',
        'IT',
        'JM',
        'JP',
        'YE',
        'JO',
        'KH',
        'CM',
        'CA',
        'CV',
        'KZ',
        'QA',
        'KE',
        'KG',
        'KI',
        'CO',
        'KM',
        'CG',
        'CD',
        'KP',
        'KR',
        'XK',
        'HR',
        'CU',
        'KW',
        'LA',
        'LS',
        'LV',
        'LB',
        'LR',
        'LY',
        'LI',
        'LT',
        'LU',
        'MG',
        'MW',
        'MY',
        'MV',
        'ML',
        'MT',
        'MA',
        'MH',
        'MR',
        'MU',
        'MK',
        'MX',
        'FM',
        'MD',
        'MC',
        'MN',
        'ME',
        'MZ',
        'MM',
        'NA',
        'NR',
        'NP',
        'NZ',
        'NI',
        'NL',
        'NE',
        'NG',
        'NO',
        'OM',
        'AT',
        'PK',
        'PW',
        'PA',
        'PG',
        'PY',
        'PE',
        'PH',
        'PL',
        'PT',
        'RW',
        'RO',
        'RU',
        'SB',
        'ZM',
        'WS',
        'SM',
        'ST',
        'SA',
        'SE',
        'CH',
        'SN',
        'RS',
        'SC',
        'SL',
        'ZW',
        'SG',
        'SK',
        'SI',
        'SO',
        'ES',
        'LK',
        'KN',
        'LC',
        'VC',
        'ZA',
        'SR',
        'SZ',
        'SY',
        'TJ',
        'TZ',
        'TH',
        'TL',
        'TG',
        'TO',
        'TT',
        'TD',
        'CZ',
        'TN',
        'TR',
        'TM',
        'TV',
        'UG',
        'UA',
        'HU',
        'UY',
        'UZ',
        'VU',
        'VA',
        'VE',
        'AE',
        'US',
        'GB',
        'VN',
        'CF',
        'CY',
        'SS',
        'SD',
    ];
    const countryNames = Object.fromEntries(
        countryCodes.map((code) => [code, allCountries.of(code) ?? code]),
    );
    return countryNames;
}
