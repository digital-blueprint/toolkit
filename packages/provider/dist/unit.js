var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, 'name', {value, configurable: true});
var __commonJS = (cb, mod) =>
    function __require() {
        return (
            mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {exports: {}}).exports, mod),
            mod.exports
        );
    };
var __export = (target, all) => {
    for (var name in all) __defProp(target, name, {get: all[name], enumerable: true});
};

// (disabled):util
var require_util = __commonJS({
    '(disabled):util'() {},
});

// lib/chai/utils/index.js
var utils_exports = {};
__export(utils_exports, {
    addChainableMethod: () => addChainableMethod,
    addLengthGuard: () => addLengthGuard,
    addMethod: () => addMethod,
    addProperty: () => addProperty,
    checkError: () => check_error_exports,
    compareByInspect: () => compareByInspect,
    eql: () => deep_eql_default,
    expectTypes: () => expectTypes,
    flag: () => flag,
    getActual: () => getActual,
    getMessage: () => getMessage2,
    getName: () => getName,
    getOperator: () => getOperator,
    getOwnEnumerableProperties: () => getOwnEnumerableProperties,
    getOwnEnumerablePropertySymbols: () => getOwnEnumerablePropertySymbols,
    getPathInfo: () => getPathInfo,
    hasProperty: () => hasProperty,
    inspect: () => inspect2,
    isNaN: () => isNaN2,
    isNumeric: () => isNumeric,
    isProxyEnabled: () => isProxyEnabled,
    isRegExp: () => isRegExp2,
    objDisplay: () => objDisplay,
    overwriteChainableMethod: () => overwriteChainableMethod,
    overwriteMethod: () => overwriteMethod,
    overwriteProperty: () => overwriteProperty,
    proxify: () => proxify,
    test: () => test$1,
    transferFlags: () => transferFlags,
    type: () => type,
});

// node_modules/check-error/index.js
var check_error_exports = {};
__export(check_error_exports, {
    compatibleConstructor: () => compatibleConstructor,
    compatibleInstance: () => compatibleInstance,
    compatibleMessage: () => compatibleMessage,
    getConstructorName: () => getConstructorName,
    getMessage: () => getMessage,
});
function isErrorInstance(obj) {
    return obj instanceof Error || Object.prototype.toString.call(obj) === '[object Error]';
}
__name(isErrorInstance, 'isErrorInstance');
function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
}
__name(isRegExp, 'isRegExp');
function compatibleInstance(thrown, errorLike) {
    return isErrorInstance(errorLike) && thrown === errorLike;
}
__name(compatibleInstance, 'compatibleInstance');
function compatibleConstructor(thrown, errorLike) {
    if (isErrorInstance(errorLike)) {
        return (
            thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor
        );
    } else if (
        (typeof errorLike === 'object' || typeof errorLike === 'function') &&
        errorLike.prototype
    ) {
        return thrown.constructor === errorLike || thrown instanceof errorLike;
    }
    return false;
}
__name(compatibleConstructor, 'compatibleConstructor');
function compatibleMessage(thrown, errMatcher) {
    const comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
    if (isRegExp(errMatcher)) {
        return errMatcher.test(comparisonString);
    } else if (typeof errMatcher === 'string') {
        return comparisonString.indexOf(errMatcher) !== -1;
    }
    return false;
}
__name(compatibleMessage, 'compatibleMessage');
function getConstructorName(errorLike) {
    let constructorName = errorLike;
    if (isErrorInstance(errorLike)) {
        constructorName = errorLike.constructor.name;
    } else if (typeof errorLike === 'function') {
        constructorName = errorLike.name;
        if (constructorName === '') {
            const newConstructorName = new errorLike().name;
            constructorName = newConstructorName || constructorName;
        }
    }
    return constructorName;
}
__name(getConstructorName, 'getConstructorName');
function getMessage(errorLike) {
    let msg = '';
    if (errorLike && errorLike.message) {
        msg = errorLike.message;
    } else if (typeof errorLike === 'string') {
        msg = errorLike;
    }
    return msg;
}
__name(getMessage, 'getMessage');

// lib/chai/utils/flag.js
function flag(obj, key, value) {
    let flags = obj.__flags || (obj.__flags = /* @__PURE__ */ Object.create(null));
    if (arguments.length === 3) {
        flags[key] = value;
    } else {
        return flags[key];
    }
}
__name(flag, 'flag');

// lib/chai/utils/test.js
function test$1(obj, args) {
    let negate = flag(obj, 'negate'),
        expr = args[0];
    return negate ? !expr : expr;
}
__name(test$1, 'test');

// lib/chai/utils/type-detect.js
function type(obj) {
    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    const stringTag = obj[Symbol.toStringTag];
    if (typeof stringTag === 'string') {
        return stringTag;
    }
    const type3 = Object.prototype.toString.call(obj).slice(8, -1);
    return type3;
}
__name(type, 'type');

// node_modules/assertion-error/index.js
var canElideFrames = 'captureStackTrace' in Error;
var AssertionError = class _AssertionError extends Error {
    static {
        __name(this, 'AssertionError');
    }
    message;
    get name() {
        return 'AssertionError';
    }
    get ok() {
        return false;
    }
    constructor(message = 'Unspecified AssertionError', props, ssf) {
        super(message);
        this.message = message;
        if (canElideFrames) {
            Error.captureStackTrace(this, ssf || _AssertionError);
        }
        for (const key in props) {
            if (!(key in this)) {
                this[key] = props[key];
            }
        }
    }
    toJSON(stack) {
        return {
            ...this,
            name: this.name,
            message: this.message,
            ok: false,
            stack: stack !== false ? this.stack : void 0,
        };
    }
};

// lib/chai/utils/expectTypes.js
function expectTypes(obj, types) {
    let flagMsg = flag(obj, 'message');
    let ssfi = flag(obj, 'ssfi');
    flagMsg = flagMsg ? flagMsg + ': ' : '';
    obj = flag(obj, 'object');
    types = types.map(function (t) {
        return t.toLowerCase();
    });
    types.sort();
    let str = types
        .map(function (t, index) {
            let art = ~['a', 'e', 'i', 'o', 'u'].indexOf(t.charAt(0)) ? 'an' : 'a';
            let or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
            return or + art + ' ' + t;
        })
        .join(', ');
    let objType = type(obj).toLowerCase();
    if (
        !types.some(function (expected) {
            return objType === expected;
        })
    ) {
        throw new AssertionError(
            flagMsg + 'object tested must be ' + str + ', but ' + objType + ' given',
            void 0,
            ssfi,
        );
    }
}
__name(expectTypes, 'expectTypes');

// lib/chai/utils/getActual.js
function getActual(obj, args) {
    return args.length > 4 ? args[4] : obj._obj;
}
__name(getActual, 'getActual');

// node_modules/loupe/lib/helpers.js
var ansiColors = {
    bold: ['1', '22'],
    dim: ['2', '22'],
    italic: ['3', '23'],
    underline: ['4', '24'],
    // 5 & 6 are blinking
    inverse: ['7', '27'],
    hidden: ['8', '28'],
    strike: ['9', '29'],
    // 10-20 are fonts
    // 21-29 are resets for 1-9
    black: ['30', '39'],
    red: ['31', '39'],
    green: ['32', '39'],
    yellow: ['33', '39'],
    blue: ['34', '39'],
    magenta: ['35', '39'],
    cyan: ['36', '39'],
    white: ['37', '39'],
    brightblack: ['30;1', '39'],
    brightred: ['31;1', '39'],
    brightgreen: ['32;1', '39'],
    brightyellow: ['33;1', '39'],
    brightblue: ['34;1', '39'],
    brightmagenta: ['35;1', '39'],
    brightcyan: ['36;1', '39'],
    brightwhite: ['37;1', '39'],
    grey: ['90', '39'],
};
var styles = {
    special: 'cyan',
    number: 'yellow',
    bigint: 'yellow',
    boolean: 'yellow',
    undefined: 'grey',
    null: 'bold',
    string: 'green',
    symbol: 'green',
    date: 'magenta',
    regexp: 'red',
};
var truncator = '\u2026';
function colorise(value, styleType) {
    const color = ansiColors[styles[styleType]] || ansiColors[styleType] || '';
    if (!color) {
        return String(value);
    }
    return `\x1B[${color[0]}m${String(value)}\x1B[${color[1]}m`;
}
__name(colorise, 'colorise');
function normaliseOptions(
    {
        showHidden = false,
        depth = 2,
        colors = false,
        customInspect = true,
        showProxy = false,
        maxArrayLength = Infinity,
        breakLength = Infinity,
        seen = [],
        // eslint-disable-next-line no-shadow
        truncate: truncate2 = Infinity,
        stylize = String,
    } = {},
    inspect3,
) {
    const options = {
        showHidden: Boolean(showHidden),
        depth: Number(depth),
        colors: Boolean(colors),
        customInspect: Boolean(customInspect),
        showProxy: Boolean(showProxy),
        maxArrayLength: Number(maxArrayLength),
        breakLength: Number(breakLength),
        truncate: Number(truncate2),
        seen,
        inspect: inspect3,
        stylize,
    };
    if (options.colors) {
        options.stylize = colorise;
    }
    return options;
}
__name(normaliseOptions, 'normaliseOptions');
function isHighSurrogate(char) {
    return char >= '\uD800' && char <= '\uDBFF';
}
__name(isHighSurrogate, 'isHighSurrogate');
function truncate(string, length, tail = truncator) {
    string = String(string);
    const tailLength = tail.length;
    const stringLength = string.length;
    if (tailLength > length && stringLength > tailLength) {
        return tail;
    }
    if (stringLength > length && stringLength > tailLength) {
        let end = length - tailLength;
        if (end > 0 && isHighSurrogate(string[end - 1])) {
            end = end - 1;
        }
        return `${string.slice(0, end)}${tail}`;
    }
    return string;
}
__name(truncate, 'truncate');
function inspectList(list, options, inspectItem, separator = ', ') {
    inspectItem = inspectItem || options.inspect;
    const size = list.length;
    if (size === 0) return '';
    const originalLength = options.truncate;
    let output = '';
    let peek = '';
    let truncated = '';
    for (let i = 0; i < size; i += 1) {
        const last = i + 1 === list.length;
        const secondToLast = i + 2 === list.length;
        truncated = `${truncator}(${list.length - i})`;
        const value = list[i];
        options.truncate = originalLength - output.length - (last ? 0 : separator.length);
        const string = peek || inspectItem(value, options) + (last ? '' : separator);
        const nextLength = output.length + string.length;
        const truncatedLength = nextLength + truncated.length;
        if (
            last &&
            nextLength > originalLength &&
            output.length + truncated.length <= originalLength
        ) {
            break;
        }
        if (!last && !secondToLast && truncatedLength > originalLength) {
            break;
        }
        peek = last ? '' : inspectItem(list[i + 1], options) + (secondToLast ? '' : separator);
        if (
            !last &&
            secondToLast &&
            truncatedLength > originalLength &&
            nextLength + peek.length > originalLength
        ) {
            break;
        }
        output += string;
        if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
            truncated = `${truncator}(${list.length - i - 1})`;
            break;
        }
        truncated = '';
    }
    return `${output}${truncated}`;
}
__name(inspectList, 'inspectList');
function quoteComplexKey(key) {
    if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
        return key;
    }
    return JSON.stringify(key)
        .replace(/'/g, "\\'")
        .replace(/\\"/g, '"')
        .replace(/(^"|"$)/g, "'");
}
__name(quoteComplexKey, 'quoteComplexKey');
function inspectProperty([key, value], options) {
    options.truncate -= 2;
    if (typeof key === 'string') {
        key = quoteComplexKey(key);
    } else if (typeof key !== 'number') {
        key = `[${options.inspect(key, options)}]`;
    }
    options.truncate -= key.length;
    value = options.inspect(value, options);
    return `${key}: ${value}`;
}
__name(inspectProperty, 'inspectProperty');

// node_modules/loupe/lib/array.js
function inspectArray(array, options) {
    const nonIndexProperties = Object.keys(array).slice(array.length);
    if (!array.length && !nonIndexProperties.length) return '[]';
    options.truncate -= 4;
    const listContents = inspectList(array, options);
    options.truncate -= listContents.length;
    let propertyContents = '';
    if (nonIndexProperties.length) {
        propertyContents = inspectList(
            nonIndexProperties.map((key) => [key, array[key]]),
            options,
            inspectProperty,
        );
    }
    return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ''} ]`;
}
__name(inspectArray, 'inspectArray');

// node_modules/loupe/lib/typedarray.js
var getArrayName = /* @__PURE__ */ __name((array) => {
    if (typeof Buffer === 'function' && array instanceof Buffer) {
        return 'Buffer';
    }
    if (array[Symbol.toStringTag]) {
        return array[Symbol.toStringTag];
    }
    return array.constructor.name;
}, 'getArrayName');
function inspectTypedArray(array, options) {
    const name = getArrayName(array);
    options.truncate -= name.length + 4;
    const nonIndexProperties = Object.keys(array).slice(array.length);
    if (!array.length && !nonIndexProperties.length) return `${name}[]`;
    let output = '';
    for (let i = 0; i < array.length; i++) {
        const string = `${options.stylize(truncate(array[i], options.truncate), 'number')}${i === array.length - 1 ? '' : ', '}`;
        options.truncate -= string.length;
        if (array[i] !== array.length && options.truncate <= 3) {
            output += `${truncator}(${array.length - array[i] + 1})`;
            break;
        }
        output += string;
    }
    let propertyContents = '';
    if (nonIndexProperties.length) {
        propertyContents = inspectList(
            nonIndexProperties.map((key) => [key, array[key]]),
            options,
            inspectProperty,
        );
    }
    return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ''} ]`;
}
__name(inspectTypedArray, 'inspectTypedArray');

// node_modules/loupe/lib/date.js
function inspectDate(dateObject, options) {
    const stringRepresentation = dateObject.toJSON();
    if (stringRepresentation === null) {
        return 'Invalid Date';
    }
    const split = stringRepresentation.split('T');
    const date = split[0];
    return options.stylize(
        `${date}T${truncate(split[1], options.truncate - date.length - 1)}`,
        'date',
    );
}
__name(inspectDate, 'inspectDate');

// node_modules/loupe/lib/function.js
function inspectFunction(func, options) {
    const functionType = func[Symbol.toStringTag] || 'Function';
    const name = func.name;
    if (!name) {
        return options.stylize(`[${functionType}]`, 'special');
    }
    return options.stylize(`[${functionType} ${truncate(name, options.truncate - 11)}]`, 'special');
}
__name(inspectFunction, 'inspectFunction');

// node_modules/loupe/lib/map.js
function inspectMapEntry([key, value], options) {
    options.truncate -= 4;
    key = options.inspect(key, options);
    options.truncate -= key.length;
    value = options.inspect(value, options);
    return `${key} => ${value}`;
}
__name(inspectMapEntry, 'inspectMapEntry');
function mapToEntries(map) {
    const entries = [];
    map.forEach((value, key) => {
        entries.push([key, value]);
    });
    return entries;
}
__name(mapToEntries, 'mapToEntries');
function inspectMap(map, options) {
    const size = map.size - 1;
    if (size <= 0) {
        return 'Map{}';
    }
    options.truncate -= 7;
    return `Map{ ${inspectList(mapToEntries(map), options, inspectMapEntry)} }`;
}
__name(inspectMap, 'inspectMap');

// node_modules/loupe/lib/number.js
var isNaN$1 = Number.isNaN || ((i) => i !== i);
function inspectNumber(number, options) {
    if (isNaN$1(number)) {
        return options.stylize('NaN', 'number');
    }
    if (number === Infinity) {
        return options.stylize('Infinity', 'number');
    }
    if (number === -Infinity) {
        return options.stylize('-Infinity', 'number');
    }
    if (number === 0) {
        return options.stylize(1 / number === Infinity ? '+0' : '-0', 'number');
    }
    return options.stylize(truncate(String(number), options.truncate), 'number');
}
__name(inspectNumber, 'inspectNumber');

// node_modules/loupe/lib/bigint.js
function inspectBigInt(number, options) {
    let nums = truncate(number.toString(), options.truncate - 1);
    if (nums !== truncator) nums += 'n';
    return options.stylize(nums, 'bigint');
}
__name(inspectBigInt, 'inspectBigInt');

// node_modules/loupe/lib/regexp.js
function inspectRegExp(value, options) {
    const flags = value.toString().split('/')[2];
    const sourceLength = options.truncate - (2 + flags.length);
    const source = value.source;
    return options.stylize(`/${truncate(source, sourceLength)}/${flags}`, 'regexp');
}
__name(inspectRegExp, 'inspectRegExp');

// node_modules/loupe/lib/set.js
function arrayFromSet(set2) {
    const values = [];
    set2.forEach((value) => {
        values.push(value);
    });
    return values;
}
__name(arrayFromSet, 'arrayFromSet');
function inspectSet(set2, options) {
    if (set2.size === 0) return 'Set{}';
    options.truncate -= 7;
    return `Set{ ${inspectList(arrayFromSet(set2), options)} }`;
}
__name(inspectSet, 'inspectSet');

// node_modules/loupe/lib/string.js
var stringEscapeChars = new RegExp(
    "['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]",
    'g',
);
var escapeCharacters = {
    '\b': '\\b',
    '	': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    "'": "\\'",
    '\\': '\\\\',
};
var hex = 16;
function escape$1(char) {
    return escapeCharacters[char] || `\\u${`0000${char.charCodeAt(0).toString(hex)}`.slice(-4)}`;
}
__name(escape$1, 'escape');
function inspectString(string, options) {
    if (stringEscapeChars.test(string)) {
        string = string.replace(stringEscapeChars, escape$1);
    }
    return options.stylize(`'${truncate(string, options.truncate - 2)}'`, 'string');
}
__name(inspectString, 'inspectString');

// node_modules/loupe/lib/symbol.js
function inspectSymbol(value) {
    if ('description' in Symbol.prototype) {
        return value.description ? `Symbol(${value.description})` : 'Symbol()';
    }
    return value.toString();
}
__name(inspectSymbol, 'inspectSymbol');

// node_modules/loupe/lib/promise.js
var getPromiseValue = /* @__PURE__ */ __name(() => 'Promise{\u2026}', 'getPromiseValue');
try {
    const {getPromiseDetails, kPending, kRejected} = process.binding('util');
    if (Array.isArray(getPromiseDetails(Promise.resolve()))) {
        getPromiseValue = /* @__PURE__ */ __name((value, options) => {
            const [state, innerValue] = getPromiseDetails(value);
            if (state === kPending) {
                return 'Promise{<pending>}';
            }
            return `Promise${state === kRejected ? '!' : ''}{${options.inspect(innerValue, options)}}`;
        }, 'getPromiseValue');
    }
} catch (notNode) {}
var promise_default = getPromiseValue;

// node_modules/loupe/lib/object.js
function inspectObject(object, options) {
    const properties = Object.getOwnPropertyNames(object);
    const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
    if (properties.length === 0 && symbols.length === 0) {
        return '{}';
    }
    options.truncate -= 4;
    options.seen = options.seen || [];
    if (options.seen.includes(object)) {
        return '[Circular]';
    }
    options.seen.push(object);
    const propertyContents = inspectList(
        properties.map((key) => [key, object[key]]),
        options,
        inspectProperty,
    );
    const symbolContents = inspectList(
        symbols.map((key) => [key, object[key]]),
        options,
        inspectProperty,
    );
    options.seen.pop();
    let sep = '';
    if (propertyContents && symbolContents) {
        sep = ', ';
    }
    return `{ ${propertyContents}${sep}${symbolContents} }`;
}
__name(inspectObject, 'inspectObject');

// node_modules/loupe/lib/class.js
var toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag ? Symbol.toStringTag : false;
function inspectClass(value, options) {
    let name = '';
    if (toStringTag && toStringTag in value) {
        name = value[toStringTag];
    }
    name = name || value.constructor.name;
    if (!name || name === '_class') {
        name = '<Anonymous Class>';
    }
    options.truncate -= name.length;
    return `${name}${inspectObject(value, options)}`;
}
__name(inspectClass, 'inspectClass');

// node_modules/loupe/lib/arguments.js
function inspectArguments(args, options) {
    if (args.length === 0) return 'Arguments[]';
    options.truncate -= 13;
    return `Arguments[ ${inspectList(args, options)} ]`;
}
__name(inspectArguments, 'inspectArguments');

// node_modules/loupe/lib/error.js
var errorKeys = [
    'stack',
    'line',
    'column',
    'name',
    'message',
    'fileName',
    'lineNumber',
    'columnNumber',
    'number',
    'description',
    'cause',
];
function inspectObject2(error, options) {
    const properties = Object.getOwnPropertyNames(error).filter(
        (key) => errorKeys.indexOf(key) === -1,
    );
    const name = error.name;
    options.truncate -= name.length;
    let message = '';
    if (typeof error.message === 'string') {
        message = truncate(error.message, options.truncate);
    } else {
        properties.unshift('message');
    }
    message = message ? `: ${message}` : '';
    options.truncate -= message.length + 5;
    options.seen = options.seen || [];
    if (options.seen.includes(error)) {
        return '[Circular]';
    }
    options.seen.push(error);
    const propertyContents = inspectList(
        properties.map((key) => [key, error[key]]),
        options,
        inspectProperty,
    );
    return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ''}`;
}
__name(inspectObject2, 'inspectObject');

// node_modules/loupe/lib/html.js
function inspectAttribute([key, value], options) {
    options.truncate -= 3;
    if (!value) {
        return `${options.stylize(String(key), 'yellow')}`;
    }
    return `${options.stylize(String(key), 'yellow')}=${options.stylize(`"${value}"`, 'string')}`;
}
__name(inspectAttribute, 'inspectAttribute');
function inspectHTMLCollection(collection, options) {
    return inspectList(collection, options, inspectHTML, '\n');
}
__name(inspectHTMLCollection, 'inspectHTMLCollection');
function inspectHTML(element, options) {
    const properties = element.getAttributeNames();
    const name = element.tagName.toLowerCase();
    const head = options.stylize(`<${name}`, 'special');
    const headClose = options.stylize(`>`, 'special');
    const tail = options.stylize(`</${name}>`, 'special');
    options.truncate -= name.length * 2 + 5;
    let propertyContents = '';
    if (properties.length > 0) {
        propertyContents += ' ';
        propertyContents += inspectList(
            properties.map((key) => [key, element.getAttribute(key)]),
            options,
            inspectAttribute,
            ' ',
        );
    }
    options.truncate -= propertyContents.length;
    const truncate2 = options.truncate;
    let children = inspectHTMLCollection(element.children, options);
    if (children && children.length > truncate2) {
        children = `${truncator}(${element.children.length})`;
    }
    return `${head}${propertyContents}${headClose}${children}${tail}`;
}
__name(inspectHTML, 'inspectHTML');

// node_modules/loupe/lib/index.js
var symbolsSupported = typeof Symbol === 'function' && typeof Symbol.for === 'function';
var chaiInspect = symbolsSupported ? Symbol.for('chai/inspect') : '@@chai/inspect';
var nodeInspect = false;
try {
    const nodeUtil = require_util();
    nodeInspect = nodeUtil.inspect ? nodeUtil.inspect.custom : false;
} catch (noNodeInspect) {
    nodeInspect = false;
}
var constructorMap = /* @__PURE__ */ new WeakMap();
var stringTagMap = {};
var baseTypesMap = {
    undefined: /* @__PURE__ */ __name(
        (value, options) => options.stylize('undefined', 'undefined'),
        'undefined',
    ),
    null: /* @__PURE__ */ __name((value, options) => options.stylize('null', 'null'), 'null'),
    boolean: /* @__PURE__ */ __name(
        (value, options) => options.stylize(String(value), 'boolean'),
        'boolean',
    ),
    Boolean: /* @__PURE__ */ __name(
        (value, options) => options.stylize(String(value), 'boolean'),
        'Boolean',
    ),
    number: inspectNumber,
    Number: inspectNumber,
    bigint: inspectBigInt,
    BigInt: inspectBigInt,
    string: inspectString,
    String: inspectString,
    function: inspectFunction,
    Function: inspectFunction,
    symbol: inspectSymbol,
    // A Symbol polyfill will return `Symbol` not `symbol` from typedetect
    Symbol: inspectSymbol,
    Array: inspectArray,
    Date: inspectDate,
    Map: inspectMap,
    Set: inspectSet,
    RegExp: inspectRegExp,
    Promise: promise_default,
    // WeakSet, WeakMap are totally opaque to us
    WeakSet: /* @__PURE__ */ __name(
        (value, options) => options.stylize('WeakSet{\u2026}', 'special'),
        'WeakSet',
    ),
    WeakMap: /* @__PURE__ */ __name(
        (value, options) => options.stylize('WeakMap{\u2026}', 'special'),
        'WeakMap',
    ),
    Arguments: inspectArguments,
    Int8Array: inspectTypedArray,
    Uint8Array: inspectTypedArray,
    Uint8ClampedArray: inspectTypedArray,
    Int16Array: inspectTypedArray,
    Uint16Array: inspectTypedArray,
    Int32Array: inspectTypedArray,
    Uint32Array: inspectTypedArray,
    Float32Array: inspectTypedArray,
    Float64Array: inspectTypedArray,
    Generator: /* @__PURE__ */ __name(() => '', 'Generator'),
    DataView: /* @__PURE__ */ __name(() => '', 'DataView'),
    ArrayBuffer: /* @__PURE__ */ __name(() => '', 'ArrayBuffer'),
    Error: inspectObject2,
    HTMLCollection: inspectHTMLCollection,
    NodeList: inspectHTMLCollection,
};
var inspectCustom = /* @__PURE__ */ __name((value, options, type3) => {
    if (chaiInspect in value && typeof value[chaiInspect] === 'function') {
        return value[chaiInspect](options);
    }
    if (nodeInspect && nodeInspect in value && typeof value[nodeInspect] === 'function') {
        return value[nodeInspect](options.depth, options);
    }
    if ('inspect' in value && typeof value.inspect === 'function') {
        return value.inspect(options.depth, options);
    }
    if ('constructor' in value && constructorMap.has(value.constructor)) {
        return constructorMap.get(value.constructor)(value, options);
    }
    if (stringTagMap[type3]) {
        return stringTagMap[type3](value, options);
    }
    return '';
}, 'inspectCustom');
var toString = Object.prototype.toString;
function inspect(value, opts = {}) {
    const options = normaliseOptions(opts, inspect);
    const {customInspect} = options;
    let type3 = value === null ? 'null' : typeof value;
    if (type3 === 'object') {
        type3 = toString.call(value).slice(8, -1);
    }
    if (type3 in baseTypesMap) {
        return baseTypesMap[type3](value, options);
    }
    if (customInspect && value) {
        const output = inspectCustom(value, options, type3);
        if (output) {
            if (typeof output === 'string') return output;
            return inspect(output, options);
        }
    }
    const proto = value ? Object.getPrototypeOf(value) : false;
    if (proto === Object.prototype || proto === null) {
        return inspectObject(value, options);
    }
    if (value && typeof HTMLElement === 'function' && value instanceof HTMLElement) {
        return inspectHTML(value, options);
    }
    if ('constructor' in value) {
        if (value.constructor !== Object) {
            return inspectClass(value, options);
        }
        return inspectObject(value, options);
    }
    if (value === Object(value)) {
        return inspectObject(value, options);
    }
    return options.stylize(String(value), type3);
}
__name(inspect, 'inspect');

// lib/chai/config.js
var config = {
    /**
     * ### config.includeStack
     *
     * User configurable property, influences whether stack trace
     * is included in Assertion error message. Default of false
     * suppresses stack trace in the error message.
     *
     *     chai.config.includeStack = true;  // enable stack on error
     *
     * @param {boolean}
     * @public
     */
    includeStack: false,
    /**
     * ### config.showDiff
     *
     * User configurable property, influences whether or not
     * the `showDiff` flag should be included in the thrown
     * AssertionErrors. `false` will always be `false`; `true`
     * will be true when the assertion has requested a diff
     * be shown.
     *
     * @param {boolean}
     * @public
     */
    showDiff: true,
    /**
     * ### config.truncateThreshold
     *
     * User configurable property, sets length threshold for actual and
     * expected values in assertion errors. If this threshold is exceeded, for
     * example for large data structures, the value is replaced with something
     * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
     *
     * Set it to zero if you want to disable truncating altogether.
     *
     * This is especially userful when doing assertions on arrays: having this
     * set to a reasonable large value makes the failure messages readily
     * inspectable.
     *
     *     chai.config.truncateThreshold = 0;  // disable truncating
     *
     * @param {number}
     * @public
     */
    truncateThreshold: 40,
    /**
     * ### config.useProxy
     *
     * User configurable property, defines if chai will use a Proxy to throw
     * an error when a non-existent property is read, which protects users
     * from typos when using property-based assertions.
     *
     * Set it to false if you want to disable this feature.
     *
     *     chai.config.useProxy = false;  // disable use of Proxy
     *
     * This feature is automatically disabled regardless of this config value
     * in environments that don't support proxies.
     *
     * @param {boolean}
     * @public
     */
    useProxy: true,
    /**
     * ### config.proxyExcludedKeys
     *
     * User configurable property, defines which properties should be ignored
     * instead of throwing an error if they do not exist on the assertion.
     * This is only applied if the environment Chai is running in supports proxies and
     * if the `useProxy` configuration setting is enabled.
     * By default, `then` and `inspect` will not throw an error if they do not exist on the
     * assertion object because the `.inspect` property is read by `util.inspect` (for example, when
     * using `console.log` on the assertion object) and `.then` is necessary for promise type-checking.
     *
     *     // By default these keys will not throw an error if they do not exist on the assertion object
     *     chai.config.proxyExcludedKeys = ['then', 'inspect'];
     *
     * @param {Array}
     * @public
     */
    proxyExcludedKeys: ['then', 'catch', 'inspect', 'toJSON'],
    /**
     * ### config.deepEqual
     *
     * User configurable property, defines which a custom function to use for deepEqual
     * comparisons.
     * By default, the function used is the one from the `deep-eql` package without custom comparator.
     *
     *     // use a custom comparator
     *     chai.config.deepEqual = (expected, actual) => {
     *         return chai.util.eql(expected, actual, {
     *             comparator: (expected, actual) => {
     *                 // for non number comparison, use the default behavior
     *                 if(typeof expected !== 'number') return null;
     *                 // allow a difference of 10 between compared numbers
     *                 return typeof actual === 'number' && Math.abs(actual - expected) < 10
     *             }
     *         })
     *     };
     *
     * @param {Function}
     * @public
     */
    deepEqual: null,
};

// lib/chai/utils/inspect.js
function inspect2(obj, showHidden, depth, colors) {
    let options = {
        colors,
        depth: typeof depth === 'undefined' ? 2 : depth,
        showHidden,
        truncate: config.truncateThreshold ? config.truncateThreshold : Infinity,
    };
    return inspect(obj, options);
}
__name(inspect2, 'inspect');

// lib/chai/utils/objDisplay.js
function objDisplay(obj) {
    let str = inspect2(obj),
        type3 = Object.prototype.toString.call(obj);
    if (config.truncateThreshold && str.length >= config.truncateThreshold) {
        if (type3 === '[object Function]') {
            return !obj.name || obj.name === '' ? '[Function]' : '[Function: ' + obj.name + ']';
        } else if (type3 === '[object Array]') {
            return '[ Array(' + obj.length + ') ]';
        } else if (type3 === '[object Object]') {
            let keys = Object.keys(obj),
                kstr = keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...' : keys.join(', ');
            return '{ Object (' + kstr + ') }';
        } else {
            return str;
        }
    } else {
        return str;
    }
}
__name(objDisplay, 'objDisplay');

// lib/chai/utils/getMessage.js
function getMessage2(obj, args) {
    let negate = flag(obj, 'negate');
    let val = flag(obj, 'object');
    let expected = args[3];
    let actual = getActual(obj, args);
    let msg = negate ? args[2] : args[1];
    let flagMsg = flag(obj, 'message');
    if (typeof msg === 'function') msg = msg();
    msg = msg || '';
    msg = msg
        .replace(/#\{this\}/g, function () {
            return objDisplay(val);
        })
        .replace(/#\{act\}/g, function () {
            return objDisplay(actual);
        })
        .replace(/#\{exp\}/g, function () {
            return objDisplay(expected);
        });
    return flagMsg ? flagMsg + ': ' + msg : msg;
}
__name(getMessage2, 'getMessage');

// lib/chai/utils/transferFlags.js
function transferFlags(assertion, object, includeAll) {
    let flags = assertion.__flags || (assertion.__flags = /* @__PURE__ */ Object.create(null));
    if (!object.__flags) {
        object.__flags = /* @__PURE__ */ Object.create(null);
    }
    includeAll = arguments.length === 3 ? includeAll : true;
    for (let flag3 in flags) {
        if (
            includeAll ||
            (flag3 !== 'object' && flag3 !== 'ssfi' && flag3 !== 'lockSsfi' && flag3 != 'message')
        ) {
            object.__flags[flag3] = flags[flag3];
        }
    }
}
__name(transferFlags, 'transferFlags');

// node_modules/deep-eql/index.js
function type2(obj) {
    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    const stringTag = obj[Symbol.toStringTag];
    if (typeof stringTag === 'string') {
        return stringTag;
    }
    const sliceStart = 8;
    const sliceEnd = -1;
    return Object.prototype.toString.call(obj).slice(sliceStart, sliceEnd);
}
__name(type2, 'type');
function FakeMap() {
    this._key = 'chai/deep-eql__' + Math.random() + Date.now();
}
__name(FakeMap, 'FakeMap');
FakeMap.prototype = {
    get: /* @__PURE__ */ __name(function get(key) {
        return key[this._key];
    }, 'get'),
    set: /* @__PURE__ */ __name(function set(key, value) {
        if (Object.isExtensible(key)) {
            Object.defineProperty(key, this._key, {
                value,
                configurable: true,
            });
        }
    }, 'set'),
};
var MemoizeMap = typeof WeakMap === 'function' ? WeakMap : FakeMap;
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
    if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
        return null;
    }
    var leftHandMap = memoizeMap.get(leftHandOperand);
    if (leftHandMap) {
        var result = leftHandMap.get(rightHandOperand);
        if (typeof result === 'boolean') {
            return result;
        }
    }
    return null;
}
__name(memoizeCompare, 'memoizeCompare');
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
    if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
        return;
    }
    var leftHandMap = memoizeMap.get(leftHandOperand);
    if (leftHandMap) {
        leftHandMap.set(rightHandOperand, result);
    } else {
        leftHandMap = new MemoizeMap();
        leftHandMap.set(rightHandOperand, result);
        memoizeMap.set(leftHandOperand, leftHandMap);
    }
}
__name(memoizeSet, 'memoizeSet');
var deep_eql_default = deepEqual;
function deepEqual(leftHandOperand, rightHandOperand, options) {
    if (options && options.comparator) {
        return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
    }
    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
    if (simpleResult !== null) {
        return simpleResult;
    }
    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
__name(deepEqual, 'deepEqual');
function simpleEqual(leftHandOperand, rightHandOperand) {
    if (leftHandOperand === rightHandOperand) {
        return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
    }
    if (
        leftHandOperand !== leftHandOperand && // eslint-disable-line no-self-compare
        rightHandOperand !== rightHandOperand
    ) {
        return true;
    }
    if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
        return false;
    }
    return null;
}
__name(simpleEqual, 'simpleEqual');
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
    options = options || {};
    options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
    var comparator = options && options.comparator;
    var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
    if (memoizeResultLeft !== null) {
        return memoizeResultLeft;
    }
    var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
    if (memoizeResultRight !== null) {
        return memoizeResultRight;
    }
    if (comparator) {
        var comparatorResult = comparator(leftHandOperand, rightHandOperand);
        if (comparatorResult === false || comparatorResult === true) {
            memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
            return comparatorResult;
        }
        var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
        if (simpleResult !== null) {
            return simpleResult;
        }
    }
    var leftHandType = type2(leftHandOperand);
    if (leftHandType !== type2(rightHandOperand)) {
        memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
        return false;
    }
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
    var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
    return result;
}
__name(extensiveDeepEqual, 'extensiveDeepEqual');
function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
    switch (leftHandType) {
        case 'String':
        case 'Number':
        case 'Boolean':
        case 'Date':
            return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
        case 'Promise':
        case 'Symbol':
        case 'function':
        case 'WeakMap':
        case 'WeakSet':
            return leftHandOperand === rightHandOperand;
        case 'Error':
            return keysEqual(
                leftHandOperand,
                rightHandOperand,
                ['name', 'message', 'code'],
                options,
            );
        case 'Arguments':
        case 'Int8Array':
        case 'Uint8Array':
        case 'Uint8ClampedArray':
        case 'Int16Array':
        case 'Uint16Array':
        case 'Int32Array':
        case 'Uint32Array':
        case 'Float32Array':
        case 'Float64Array':
        case 'Array':
            return iterableEqual(leftHandOperand, rightHandOperand, options);
        case 'RegExp':
            return regexpEqual(leftHandOperand, rightHandOperand);
        case 'Generator':
            return generatorEqual(leftHandOperand, rightHandOperand, options);
        case 'DataView':
            return iterableEqual(
                new Uint8Array(leftHandOperand.buffer),
                new Uint8Array(rightHandOperand.buffer),
                options,
            );
        case 'ArrayBuffer':
            return iterableEqual(
                new Uint8Array(leftHandOperand),
                new Uint8Array(rightHandOperand),
                options,
            );
        case 'Set':
            return entriesEqual(leftHandOperand, rightHandOperand, options);
        case 'Map':
            return entriesEqual(leftHandOperand, rightHandOperand, options);
        case 'Temporal.PlainDate':
        case 'Temporal.PlainTime':
        case 'Temporal.PlainDateTime':
        case 'Temporal.Instant':
        case 'Temporal.ZonedDateTime':
        case 'Temporal.PlainYearMonth':
        case 'Temporal.PlainMonthDay':
            return leftHandOperand.equals(rightHandOperand);
        case 'Temporal.Duration':
            return leftHandOperand.total('nanoseconds') === rightHandOperand.total('nanoseconds');
        case 'Temporal.TimeZone':
        case 'Temporal.Calendar':
            return leftHandOperand.toString() === rightHandOperand.toString();
        default:
            return objectEqual(leftHandOperand, rightHandOperand, options);
    }
}
__name(extensiveDeepEqualByType, 'extensiveDeepEqualByType');
function regexpEqual(leftHandOperand, rightHandOperand) {
    return leftHandOperand.toString() === rightHandOperand.toString();
}
__name(regexpEqual, 'regexpEqual');
function entriesEqual(leftHandOperand, rightHandOperand, options) {
    try {
        if (leftHandOperand.size !== rightHandOperand.size) {
            return false;
        }
        if (leftHandOperand.size === 0) {
            return true;
        }
    } catch (sizeError) {
        return false;
    }
    var leftHandItems = [];
    var rightHandItems = [];
    leftHandOperand.forEach(
        /* @__PURE__ */ __name(function gatherEntries(key, value) {
            leftHandItems.push([key, value]);
        }, 'gatherEntries'),
    );
    rightHandOperand.forEach(
        /* @__PURE__ */ __name(function gatherEntries(key, value) {
            rightHandItems.push([key, value]);
        }, 'gatherEntries'),
    );
    return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
}
__name(entriesEqual, 'entriesEqual');
function iterableEqual(leftHandOperand, rightHandOperand, options) {
    var length = leftHandOperand.length;
    if (length !== rightHandOperand.length) {
        return false;
    }
    if (length === 0) {
        return true;
    }
    var index = -1;
    while (++index < length) {
        if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
            return false;
        }
    }
    return true;
}
__name(iterableEqual, 'iterableEqual');
function generatorEqual(leftHandOperand, rightHandOperand, options) {
    return iterableEqual(
        getGeneratorEntries(leftHandOperand),
        getGeneratorEntries(rightHandOperand),
        options,
    );
}
__name(generatorEqual, 'generatorEqual');
function hasIteratorFunction(target) {
    return (
        typeof Symbol !== 'undefined' &&
        typeof target === 'object' &&
        typeof Symbol.iterator !== 'undefined' &&
        typeof target[Symbol.iterator] === 'function'
    );
}
__name(hasIteratorFunction, 'hasIteratorFunction');
function getIteratorEntries(target) {
    if (hasIteratorFunction(target)) {
        try {
            return getGeneratorEntries(target[Symbol.iterator]());
        } catch (iteratorError) {
            return [];
        }
    }
    return [];
}
__name(getIteratorEntries, 'getIteratorEntries');
function getGeneratorEntries(generator) {
    var generatorResult = generator.next();
    var accumulator = [generatorResult.value];
    while (generatorResult.done === false) {
        generatorResult = generator.next();
        accumulator.push(generatorResult.value);
    }
    return accumulator;
}
__name(getGeneratorEntries, 'getGeneratorEntries');
function getEnumerableKeys(target) {
    var keys = [];
    for (var key in target) {
        keys.push(key);
    }
    return keys;
}
__name(getEnumerableKeys, 'getEnumerableKeys');
function getEnumerableSymbols(target) {
    var keys = [];
    var allKeys = Object.getOwnPropertySymbols(target);
    for (var i = 0; i < allKeys.length; i += 1) {
        var key = allKeys[i];
        if (Object.getOwnPropertyDescriptor(target, key).enumerable) {
            keys.push(key);
        }
    }
    return keys;
}
__name(getEnumerableSymbols, 'getEnumerableSymbols');
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
    var length = keys.length;
    if (length === 0) {
        return true;
    }
    for (var i = 0; i < length; i += 1) {
        if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
            return false;
        }
    }
    return true;
}
__name(keysEqual, 'keysEqual');
function objectEqual(leftHandOperand, rightHandOperand, options) {
    var leftHandKeys = getEnumerableKeys(leftHandOperand);
    var rightHandKeys = getEnumerableKeys(rightHandOperand);
    var leftHandSymbols = getEnumerableSymbols(leftHandOperand);
    var rightHandSymbols = getEnumerableSymbols(rightHandOperand);
    leftHandKeys = leftHandKeys.concat(leftHandSymbols);
    rightHandKeys = rightHandKeys.concat(rightHandSymbols);
    if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
        if (
            iterableEqual(mapSymbols(leftHandKeys).sort(), mapSymbols(rightHandKeys).sort()) ===
            false
        ) {
            return false;
        }
        return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
    }
    var leftHandEntries = getIteratorEntries(leftHandOperand);
    var rightHandEntries = getIteratorEntries(rightHandOperand);
    if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
        leftHandEntries.sort();
        rightHandEntries.sort();
        return iterableEqual(leftHandEntries, rightHandEntries, options);
    }
    if (
        leftHandKeys.length === 0 &&
        leftHandEntries.length === 0 &&
        rightHandKeys.length === 0 &&
        rightHandEntries.length === 0
    ) {
        return true;
    }
    return false;
}
__name(objectEqual, 'objectEqual');
function isPrimitive(value) {
    return value === null || typeof value !== 'object';
}
__name(isPrimitive, 'isPrimitive');
function mapSymbols(arr) {
    return arr.map(
        /* @__PURE__ */ __name(function mapSymbol(entry) {
            if (typeof entry === 'symbol') {
                return entry.toString();
            }
            return entry;
        }, 'mapSymbol'),
    );
}
__name(mapSymbols, 'mapSymbols');

// node_modules/pathval/index.js
function hasProperty(obj, name) {
    if (typeof obj === 'undefined' || obj === null) {
        return false;
    }
    return name in Object(obj);
}
__name(hasProperty, 'hasProperty');
function parsePath(path) {
    const str = path.replace(/([^\\])\[/g, '$1.[');
    const parts = str.match(/(\\\.|[^.]+?)+/g);
    return parts.map((value) => {
        if (value === 'constructor' || value === '__proto__' || value === 'prototype') {
            return {};
        }
        const regexp = /^\[(\d+)\]$/;
        const mArr = regexp.exec(value);
        let parsed = null;
        if (mArr) {
            parsed = {i: parseFloat(mArr[1])};
        } else {
            parsed = {p: value.replace(/\\([.[\]])/g, '$1')};
        }
        return parsed;
    });
}
__name(parsePath, 'parsePath');
function internalGetPathValue(obj, parsed, pathDepth) {
    let temporaryValue = obj;
    let res = null;
    pathDepth = typeof pathDepth === 'undefined' ? parsed.length : pathDepth;
    for (let i = 0; i < pathDepth; i++) {
        const part = parsed[i];
        if (temporaryValue) {
            if (typeof part.p === 'undefined') {
                temporaryValue = temporaryValue[part.i];
            } else {
                temporaryValue = temporaryValue[part.p];
            }
            if (i === pathDepth - 1) {
                res = temporaryValue;
            }
        }
    }
    return res;
}
__name(internalGetPathValue, 'internalGetPathValue');
function getPathInfo(obj, path) {
    const parsed = parsePath(path);
    const last = parsed[parsed.length - 1];
    const info = {
        parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
        name: last.p || last.i,
        value: internalGetPathValue(obj, parsed),
    };
    info.exists = hasProperty(info.parent, info.name);
    return info;
}
__name(getPathInfo, 'getPathInfo');

// lib/chai/assertion.js
var Assertion = class _Assertion {
    static {
        __name(this, 'Assertion');
    }
    /** @type {{}} */
    __flags = {};
    /**
     * Creates object for chaining.
     * `Assertion` objects contain metadata in the form of flags. Three flags can
     * be assigned during instantiation by passing arguments to this constructor:
     *
     * - `object`: This flag contains the target of the assertion. For example, in
     * the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
     * contain `numKittens` so that the `equal` assertion can reference it when
     * needed.
     *
     * - `message`: This flag contains an optional custom error message to be
     * prepended to the error message that's generated by the assertion when it
     * fails.
     *
     * - `ssfi`: This flag stands for "start stack function indicator". It
     * contains a function reference that serves as the starting point for
     * removing frames from the stack trace of the error that's created by the
     * assertion when it fails. The goal is to provide a cleaner stack trace to
     * end users by removing Chai's internal functions. Note that it only works
     * in environments that support `Error.captureStackTrace`, and only when
     * `Chai.config.includeStack` hasn't been set to `false`.
     *
     * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
     * should retain its current value, even as assertions are chained off of
     * this object. This is usually set to `true` when creating a new assertion
     * from within another assertion. It's also temporarily set to `true` before
     * an overwritten assertion gets called by the overwriting assertion.
     *
     * - `eql`: This flag contains the deepEqual function to be used by the assertion.
     *
     * @param {unknown} obj target of the assertion
     * @param {string} [msg] (optional) custom error message
     * @param {Function} [ssfi] (optional) starting point for removing stack frames
     * @param {boolean} [lockSsfi] (optional) whether or not the ssfi flag is locked
     */
    constructor(obj, msg, ssfi, lockSsfi) {
        flag(this, 'ssfi', ssfi || _Assertion);
        flag(this, 'lockSsfi', lockSsfi);
        flag(this, 'object', obj);
        flag(this, 'message', msg);
        flag(this, 'eql', config.deepEqual || deep_eql_default);
        return proxify(this);
    }
    /** @returns {boolean} */
    static get includeStack() {
        console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
        return config.includeStack;
    }
    /** @param {boolean} value */
    static set includeStack(value) {
        console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
        config.includeStack = value;
    }
    /** @returns {boolean} */
    static get showDiff() {
        console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
        return config.showDiff;
    }
    /** @param {boolean} value */
    static set showDiff(value) {
        console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
        config.showDiff = value;
    }
    /**
     * @param {string} name
     * @param {Function} fn
     */
    static addProperty(name, fn) {
        addProperty(this.prototype, name, fn);
    }
    /**
     * @param {string} name
     * @param {Function} fn
     */
    static addMethod(name, fn) {
        addMethod(this.prototype, name, fn);
    }
    /**
     * @param {string} name
     * @param {Function} fn
     * @param {Function} chainingBehavior
     */
    static addChainableMethod(name, fn, chainingBehavior) {
        addChainableMethod(this.prototype, name, fn, chainingBehavior);
    }
    /**
     * @param {string} name
     * @param {Function} fn
     */
    static overwriteProperty(name, fn) {
        overwriteProperty(this.prototype, name, fn);
    }
    /**
     * @param {string} name
     * @param {Function} fn
     */
    static overwriteMethod(name, fn) {
        overwriteMethod(this.prototype, name, fn);
    }
    /**
     * @param {string} name
     * @param {Function} fn
     * @param {Function} chainingBehavior
     */
    static overwriteChainableMethod(name, fn, chainingBehavior) {
        overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
    }
    /**
     * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
     *
     * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
     *
     * @name assert
     * @param {unknown} _expr to be tested
     * @param {string | Function} msg or function that returns message to display if expression fails
     * @param {string | Function} _negateMsg or function that returns negatedMessage to display if negated expression fails
     * @param {unknown} expected value (remember to check for negation)
     * @param {unknown} _actual (optional) will default to `this.obj`
     * @param {boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
     * @returns {void}
     */
    assert(_expr, msg, _negateMsg, expected, _actual, showDiff) {
        const ok = test$1(this, arguments);
        if (false !== showDiff) showDiff = true;
        if (void 0 === expected && void 0 === _actual) showDiff = false;
        if (true !== config.showDiff) showDiff = false;
        if (!ok) {
            msg = getMessage2(this, arguments);
            const actual = getActual(this, arguments);
            const assertionErrorObjectProperties = {
                actual,
                expected,
                showDiff,
            };
            const operator = getOperator(this, arguments);
            if (operator) {
                assertionErrorObjectProperties.operator = operator;
            }
            throw new AssertionError(
                msg,
                assertionErrorObjectProperties,
                // @ts-expect-error Not sure what to do about these types yet
                config.includeStack ? this.assert : flag(this, 'ssfi'),
            );
        }
    }
    /**
     * Quick reference to stored `actual` value for plugin developers.
     *
     * @returns {unknown}
     */
    get _obj() {
        return flag(this, 'object');
    }
    /**
     * Quick reference to stored `actual` value for plugin developers.
     *
     * @param {unknown} val
     */
    set _obj(val) {
        flag(this, 'object', val);
    }
};

// lib/chai/utils/isProxyEnabled.js
function isProxyEnabled() {
    return config.useProxy && typeof Proxy !== 'undefined' && typeof Reflect !== 'undefined';
}
__name(isProxyEnabled, 'isProxyEnabled');

// lib/chai/utils/addProperty.js
function addProperty(ctx, name, getter) {
    getter = getter === void 0 ? function () {} : getter;
    Object.defineProperty(ctx, name, {
        get: /* @__PURE__ */ __name(function propertyGetter() {
            if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
                flag(this, 'ssfi', propertyGetter);
            }
            let result = getter.call(this);
            if (result !== void 0) return result;
            let newAssertion = new Assertion();
            transferFlags(this, newAssertion);
            return newAssertion;
        }, 'propertyGetter'),
        configurable: true,
    });
}
__name(addProperty, 'addProperty');

// lib/chai/utils/addLengthGuard.js
var fnLengthDesc = Object.getOwnPropertyDescriptor(function () {}, 'length');
function addLengthGuard(fn, assertionName, isChainable) {
    if (!fnLengthDesc.configurable) return fn;
    Object.defineProperty(fn, 'length', {
        get: /* @__PURE__ */ __name(function () {
            if (isChainable) {
                throw Error(
                    'Invalid Chai property: ' +
                        assertionName +
                        '.length. Due to a compatibility issue, "length" cannot directly follow "' +
                        assertionName +
                        '". Use "' +
                        assertionName +
                        '.lengthOf" instead.',
                );
            }
            throw Error(
                'Invalid Chai property: ' +
                    assertionName +
                    '.length. See docs for proper usage of "' +
                    assertionName +
                    '".',
            );
        }, 'get'),
    });
    return fn;
}
__name(addLengthGuard, 'addLengthGuard');

// lib/chai/utils/getProperties.js
function getProperties(object) {
    let result = Object.getOwnPropertyNames(object);
    function addProperty2(property) {
        if (result.indexOf(property) === -1) {
            result.push(property);
        }
    }
    __name(addProperty2, 'addProperty');
    let proto = Object.getPrototypeOf(object);
    while (proto !== null) {
        Object.getOwnPropertyNames(proto).forEach(addProperty2);
        proto = Object.getPrototypeOf(proto);
    }
    return result;
}
__name(getProperties, 'getProperties');

// lib/chai/utils/proxify.js
var builtins = ['__flags', '__methods', '_obj', 'assert'];
function proxify(obj, nonChainableMethodName) {
    if (!isProxyEnabled()) return obj;
    return new Proxy(obj, {
        get: /* @__PURE__ */ __name(function proxyGetter(target, property) {
            if (
                typeof property === 'string' &&
                config.proxyExcludedKeys.indexOf(property) === -1 &&
                !Reflect.has(target, property)
            ) {
                if (nonChainableMethodName) {
                    throw Error(
                        'Invalid Chai property: ' +
                            nonChainableMethodName +
                            '.' +
                            property +
                            '. See docs for proper usage of "' +
                            nonChainableMethodName +
                            '".',
                    );
                }
                let suggestion = null;
                let suggestionDistance = 4;
                getProperties(target).forEach(function (prop) {
                    if (
                        // we actually mean to check `Object.prototype` here
                        // eslint-disable-next-line no-prototype-builtins
                        !Object.prototype.hasOwnProperty(prop) &&
                        builtins.indexOf(prop) === -1
                    ) {
                        let dist = stringDistanceCapped(property, prop, suggestionDistance);
                        if (dist < suggestionDistance) {
                            suggestion = prop;
                            suggestionDistance = dist;
                        }
                    }
                });
                if (suggestion !== null) {
                    throw Error(
                        'Invalid Chai property: ' +
                            property +
                            '. Did you mean "' +
                            suggestion +
                            '"?',
                    );
                } else {
                    throw Error('Invalid Chai property: ' + property);
                }
            }
            if (builtins.indexOf(property) === -1 && !flag(target, 'lockSsfi')) {
                flag(target, 'ssfi', proxyGetter);
            }
            return Reflect.get(target, property);
        }, 'proxyGetter'),
    });
}
__name(proxify, 'proxify');
function stringDistanceCapped(strA, strB, cap) {
    if (Math.abs(strA.length - strB.length) >= cap) {
        return cap;
    }
    let memo = [];
    for (let i = 0; i <= strA.length; i++) {
        memo[i] = Array(strB.length + 1).fill(0);
        memo[i][0] = i;
    }
    for (let j = 0; j < strB.length; j++) {
        memo[0][j] = j;
    }
    for (let i = 1; i <= strA.length; i++) {
        let ch = strA.charCodeAt(i - 1);
        for (let j = 1; j <= strB.length; j++) {
            if (Math.abs(i - j) >= cap) {
                memo[i][j] = cap;
                continue;
            }
            memo[i][j] = Math.min(
                memo[i - 1][j] + 1,
                memo[i][j - 1] + 1,
                memo[i - 1][j - 1] + (ch === strB.charCodeAt(j - 1) ? 0 : 1),
            );
        }
    }
    return memo[strA.length][strB.length];
}
__name(stringDistanceCapped, 'stringDistanceCapped');

// lib/chai/utils/addMethod.js
function addMethod(ctx, name, method) {
    let methodWrapper = /* @__PURE__ */ __name(function () {
        if (!flag(this, 'lockSsfi')) {
            flag(this, 'ssfi', methodWrapper);
        }
        let result = method.apply(this, arguments);
        if (result !== void 0) return result;
        let newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
    }, 'methodWrapper');
    addLengthGuard(methodWrapper, name, false);
    ctx[name] = proxify(methodWrapper, name);
}
__name(addMethod, 'addMethod');

// lib/chai/utils/overwriteProperty.js
function overwriteProperty(ctx, name, getter) {
    let _get = Object.getOwnPropertyDescriptor(ctx, name),
        _super = /* @__PURE__ */ __name(function () {}, '_super');
    if (_get && 'function' === typeof _get.get) _super = _get.get;
    Object.defineProperty(ctx, name, {
        get: /* @__PURE__ */ __name(function overwritingPropertyGetter() {
            if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
                flag(this, 'ssfi', overwritingPropertyGetter);
            }
            let origLockSsfi = flag(this, 'lockSsfi');
            flag(this, 'lockSsfi', true);
            let result = getter(_super).call(this);
            flag(this, 'lockSsfi', origLockSsfi);
            if (result !== void 0) {
                return result;
            }
            let newAssertion = new Assertion();
            transferFlags(this, newAssertion);
            return newAssertion;
        }, 'overwritingPropertyGetter'),
        configurable: true,
    });
}
__name(overwriteProperty, 'overwriteProperty');

// lib/chai/utils/overwriteMethod.js
function overwriteMethod(ctx, name, method) {
    let _method = ctx[name],
        _super = /* @__PURE__ */ __name(function () {
            throw new Error(name + ' is not a function');
        }, '_super');
    if (_method && 'function' === typeof _method) _super = _method;
    let overwritingMethodWrapper = /* @__PURE__ */ __name(function () {
        if (!flag(this, 'lockSsfi')) {
            flag(this, 'ssfi', overwritingMethodWrapper);
        }
        let origLockSsfi = flag(this, 'lockSsfi');
        flag(this, 'lockSsfi', true);
        let result = method(_super).apply(this, arguments);
        flag(this, 'lockSsfi', origLockSsfi);
        if (result !== void 0) {
            return result;
        }
        let newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
    }, 'overwritingMethodWrapper');
    addLengthGuard(overwritingMethodWrapper, name, false);
    ctx[name] = proxify(overwritingMethodWrapper, name);
}
__name(overwriteMethod, 'overwriteMethod');

// lib/chai/utils/addChainableMethod.js
var canSetPrototype = typeof Object.setPrototypeOf === 'function';
var testFn = /* @__PURE__ */ __name(function () {}, 'testFn');
var excludeNames = Object.getOwnPropertyNames(testFn).filter(function (name) {
    let propDesc = Object.getOwnPropertyDescriptor(testFn, name);
    if (typeof propDesc !== 'object') return true;
    return !propDesc.configurable;
});
var call = Function.prototype.call;
var apply = Function.prototype.apply;
function addChainableMethod(ctx, name, method, chainingBehavior) {
    if (typeof chainingBehavior !== 'function') {
        chainingBehavior = /* @__PURE__ */ __name(function () {}, 'chainingBehavior');
    }
    let chainableBehavior = {
        method,
        chainingBehavior,
    };
    if (!ctx.__methods) {
        ctx.__methods = {};
    }
    ctx.__methods[name] = chainableBehavior;
    Object.defineProperty(ctx, name, {
        get: /* @__PURE__ */ __name(function chainableMethodGetter() {
            chainableBehavior.chainingBehavior.call(this);
            let chainableMethodWrapper = /* @__PURE__ */ __name(function () {
                if (!flag(this, 'lockSsfi')) {
                    flag(this, 'ssfi', chainableMethodWrapper);
                }
                let result = chainableBehavior.method.apply(this, arguments);
                if (result !== void 0) {
                    return result;
                }
                let newAssertion = new Assertion();
                transferFlags(this, newAssertion);
                return newAssertion;
            }, 'chainableMethodWrapper');
            addLengthGuard(chainableMethodWrapper, name, true);
            if (canSetPrototype) {
                let prototype = Object.create(this);
                prototype.call = call;
                prototype.apply = apply;
                Object.setPrototypeOf(chainableMethodWrapper, prototype);
            } else {
                let asserterNames = Object.getOwnPropertyNames(ctx);
                asserterNames.forEach(function (asserterName) {
                    if (excludeNames.indexOf(asserterName) !== -1) {
                        return;
                    }
                    let pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
                    Object.defineProperty(chainableMethodWrapper, asserterName, pd);
                });
            }
            transferFlags(this, chainableMethodWrapper);
            return proxify(chainableMethodWrapper);
        }, 'chainableMethodGetter'),
        configurable: true,
    });
}
__name(addChainableMethod, 'addChainableMethod');

// lib/chai/utils/overwriteChainableMethod.js
function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
    let chainableBehavior = ctx.__methods[name];
    let _chainingBehavior = chainableBehavior.chainingBehavior;
    chainableBehavior.chainingBehavior = /* @__PURE__ */ __name(
        function overwritingChainableMethodGetter() {
            let result = chainingBehavior(_chainingBehavior).call(this);
            if (result !== void 0) {
                return result;
            }
            let newAssertion = new Assertion();
            transferFlags(this, newAssertion);
            return newAssertion;
        },
        'overwritingChainableMethodGetter',
    );
    let _method = chainableBehavior.method;
    chainableBehavior.method = /* @__PURE__ */ __name(function overwritingChainableMethodWrapper() {
        let result = method(_method).apply(this, arguments);
        if (result !== void 0) {
            return result;
        }
        let newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
    }, 'overwritingChainableMethodWrapper');
}
__name(overwriteChainableMethod, 'overwriteChainableMethod');

// lib/chai/utils/compareByInspect.js
function compareByInspect(a, b) {
    return inspect2(a) < inspect2(b) ? -1 : 1;
}
__name(compareByInspect, 'compareByInspect');

// lib/chai/utils/getOwnEnumerablePropertySymbols.js
function getOwnEnumerablePropertySymbols(obj) {
    if (typeof Object.getOwnPropertySymbols !== 'function') return [];
    return Object.getOwnPropertySymbols(obj).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
    });
}
__name(getOwnEnumerablePropertySymbols, 'getOwnEnumerablePropertySymbols');

// lib/chai/utils/getOwnEnumerableProperties.js
function getOwnEnumerableProperties(obj) {
    return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
}
__name(getOwnEnumerableProperties, 'getOwnEnumerableProperties');

// lib/chai/utils/isNaN.js
var isNaN2 = Number.isNaN;

// lib/chai/utils/getOperator.js
function isObjectType(obj) {
    let objectType = type(obj);
    let objectTypes = ['Array', 'Object', 'Function'];
    return objectTypes.indexOf(objectType) !== -1;
}
__name(isObjectType, 'isObjectType');
function getOperator(obj, args) {
    let operator = flag(obj, 'operator');
    let negate = flag(obj, 'negate');
    let expected = args[3];
    let msg = negate ? args[2] : args[1];
    if (operator) {
        return operator;
    }
    if (typeof msg === 'function') msg = msg();
    msg = msg || '';
    if (!msg) {
        return void 0;
    }
    if (/\shave\s/.test(msg)) {
        return void 0;
    }
    let isObject = isObjectType(expected);
    if (/\snot\s/.test(msg)) {
        return isObject ? 'notDeepStrictEqual' : 'notStrictEqual';
    }
    return isObject ? 'deepStrictEqual' : 'strictEqual';
}
__name(getOperator, 'getOperator');

// lib/chai/utils/index.js
function getName(fn) {
    return fn.name;
}
__name(getName, 'getName');
function isRegExp2(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
}
__name(isRegExp2, 'isRegExp');
function isNumeric(obj) {
    return ['Number', 'BigInt'].includes(type(obj));
}
__name(isNumeric, 'isNumeric');

// lib/chai/core/assertions.js
var {flag: flag2} = utils_exports;
[
    'to',
    'be',
    'been',
    'is',
    'and',
    'has',
    'have',
    'with',
    'that',
    'which',
    'at',
    'of',
    'same',
    'but',
    'does',
    'still',
    'also',
].forEach(function (chain) {
    Assertion.addProperty(chain);
});
Assertion.addProperty('not', function () {
    flag2(this, 'negate', true);
});
Assertion.addProperty('deep', function () {
    flag2(this, 'deep', true);
});
Assertion.addProperty('nested', function () {
    flag2(this, 'nested', true);
});
Assertion.addProperty('own', function () {
    flag2(this, 'own', true);
});
Assertion.addProperty('ordered', function () {
    flag2(this, 'ordered', true);
});
Assertion.addProperty('any', function () {
    flag2(this, 'any', true);
    flag2(this, 'all', false);
});
Assertion.addProperty('all', function () {
    flag2(this, 'all', true);
    flag2(this, 'any', false);
});
var functionTypes = {
    function: ['function', 'asyncfunction', 'generatorfunction', 'asyncgeneratorfunction'],
    asyncfunction: ['asyncfunction', 'asyncgeneratorfunction'],
    generatorfunction: ['generatorfunction', 'asyncgeneratorfunction'],
    asyncgeneratorfunction: ['asyncgeneratorfunction'],
};
function an(type3, msg) {
    if (msg) flag2(this, 'message', msg);
    type3 = type3.toLowerCase();
    let obj = flag2(this, 'object'),
        article = ~['a', 'e', 'i', 'o', 'u'].indexOf(type3.charAt(0)) ? 'an ' : 'a ';
    const detectedType = type(obj).toLowerCase();
    if (functionTypes['function'].includes(type3)) {
        this.assert(
            functionTypes[type3].includes(detectedType),
            'expected #{this} to be ' + article + type3,
            'expected #{this} not to be ' + article + type3,
        );
    } else {
        this.assert(
            type3 === detectedType,
            'expected #{this} to be ' + article + type3,
            'expected #{this} not to be ' + article + type3,
        );
    }
}
__name(an, 'an');
Assertion.addChainableMethod('an', an);
Assertion.addChainableMethod('a', an);
function SameValueZero(a, b) {
    return (isNaN2(a) && isNaN2(b)) || a === b;
}
__name(SameValueZero, 'SameValueZero');
function includeChainingBehavior() {
    flag2(this, 'contains', true);
}
__name(includeChainingBehavior, 'includeChainingBehavior');
function include(val, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        objType = type(obj).toLowerCase(),
        flagMsg = flag2(this, 'message'),
        negate = flag2(this, 'negate'),
        ssfi = flag2(this, 'ssfi'),
        isDeep = flag2(this, 'deep'),
        descriptor = isDeep ? 'deep ' : '',
        isEql = isDeep ? flag2(this, 'eql') : SameValueZero;
    flagMsg = flagMsg ? flagMsg + ': ' : '';
    let included = false;
    switch (objType) {
        case 'string':
            included = obj.indexOf(val) !== -1;
            break;
        case 'weakset':
            if (isDeep) {
                throw new AssertionError(
                    flagMsg + 'unable to use .deep.include with WeakSet',
                    void 0,
                    ssfi,
                );
            }
            included = obj.has(val);
            break;
        case 'map':
            obj.forEach(function (item) {
                included = included || isEql(item, val);
            });
            break;
        case 'set':
            if (isDeep) {
                obj.forEach(function (item) {
                    included = included || isEql(item, val);
                });
            } else {
                included = obj.has(val);
            }
            break;
        case 'array':
            if (isDeep) {
                included = obj.some(function (item) {
                    return isEql(item, val);
                });
            } else {
                included = obj.indexOf(val) !== -1;
            }
            break;
        default: {
            if (val !== Object(val)) {
                throw new AssertionError(
                    flagMsg +
                        'the given combination of arguments (' +
                        objType +
                        ' and ' +
                        type(val).toLowerCase() +
                        ') is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a ' +
                        type(val).toLowerCase(),
                    void 0,
                    ssfi,
                );
            }
            let props = Object.keys(val);
            let firstErr = null;
            let numErrs = 0;
            props.forEach(function (prop) {
                let propAssertion = new Assertion(obj);
                transferFlags(this, propAssertion, true);
                flag2(propAssertion, 'lockSsfi', true);
                if (!negate || props.length === 1) {
                    propAssertion.property(prop, val[prop]);
                    return;
                }
                try {
                    propAssertion.property(prop, val[prop]);
                } catch (err) {
                    if (!check_error_exports.compatibleConstructor(err, AssertionError)) {
                        throw err;
                    }
                    if (firstErr === null) firstErr = err;
                    numErrs++;
                }
            }, this);
            if (negate && props.length > 1 && numErrs === props.length) {
                throw firstErr;
            }
            return;
        }
    }
    this.assert(
        included,
        'expected #{this} to ' + descriptor + 'include ' + inspect2(val),
        'expected #{this} to not ' + descriptor + 'include ' + inspect2(val),
    );
}
__name(include, 'include');
Assertion.addChainableMethod('include', include, includeChainingBehavior);
Assertion.addChainableMethod('contain', include, includeChainingBehavior);
Assertion.addChainableMethod('contains', include, includeChainingBehavior);
Assertion.addChainableMethod('includes', include, includeChainingBehavior);
Assertion.addProperty('ok', function () {
    this.assert(
        flag2(this, 'object'),
        'expected #{this} to be truthy',
        'expected #{this} to be falsy',
    );
});
Assertion.addProperty('true', function () {
    this.assert(
        true === flag2(this, 'object'),
        'expected #{this} to be true',
        'expected #{this} to be false',
        flag2(this, 'negate') ? false : true,
    );
});
Assertion.addProperty('numeric', function () {
    const object = flag2(this, 'object');
    this.assert(
        ['Number', 'BigInt'].includes(type(object)),
        'expected #{this} to be numeric',
        'expected #{this} to not be numeric',
        flag2(this, 'negate') ? false : true,
    );
});
Assertion.addProperty('callable', function () {
    const val = flag2(this, 'object');
    const ssfi = flag2(this, 'ssfi');
    const message = flag2(this, 'message');
    const msg = message ? `${message}: ` : '';
    const negate = flag2(this, 'negate');
    const assertionMessage = negate
        ? `${msg}expected ${inspect2(val)} not to be a callable function`
        : `${msg}expected ${inspect2(val)} to be a callable function`;
    const isCallable = [
        'Function',
        'AsyncFunction',
        'GeneratorFunction',
        'AsyncGeneratorFunction',
    ].includes(type(val));
    if ((isCallable && negate) || (!isCallable && !negate)) {
        throw new AssertionError(assertionMessage, void 0, ssfi);
    }
});
Assertion.addProperty('false', function () {
    this.assert(
        false === flag2(this, 'object'),
        'expected #{this} to be false',
        'expected #{this} to be true',
        flag2(this, 'negate') ? true : false,
    );
});
Assertion.addProperty('null', function () {
    this.assert(
        null === flag2(this, 'object'),
        'expected #{this} to be null',
        'expected #{this} not to be null',
    );
});
Assertion.addProperty('undefined', function () {
    this.assert(
        void 0 === flag2(this, 'object'),
        'expected #{this} to be undefined',
        'expected #{this} not to be undefined',
    );
});
Assertion.addProperty('NaN', function () {
    this.assert(
        isNaN2(flag2(this, 'object')),
        'expected #{this} to be NaN',
        'expected #{this} not to be NaN',
    );
});
function assertExist() {
    let val = flag2(this, 'object');
    this.assert(
        val !== null && val !== void 0,
        'expected #{this} to exist',
        'expected #{this} to not exist',
    );
}
__name(assertExist, 'assertExist');
Assertion.addProperty('exist', assertExist);
Assertion.addProperty('exists', assertExist);
Assertion.addProperty('empty', function () {
    let val = flag2(this, 'object'),
        ssfi = flag2(this, 'ssfi'),
        flagMsg = flag2(this, 'message'),
        itemsCount;
    flagMsg = flagMsg ? flagMsg + ': ' : '';
    switch (type(val).toLowerCase()) {
        case 'array':
        case 'string':
            itemsCount = val.length;
            break;
        case 'map':
        case 'set':
            itemsCount = val.size;
            break;
        case 'weakmap':
        case 'weakset':
            throw new AssertionError(flagMsg + '.empty was passed a weak collection', void 0, ssfi);
        case 'function': {
            const msg = flagMsg + '.empty was passed a function ' + getName(val);
            throw new AssertionError(msg.trim(), void 0, ssfi);
        }
        default:
            if (val !== Object(val)) {
                throw new AssertionError(
                    flagMsg + '.empty was passed non-string primitive ' + inspect2(val),
                    void 0,
                    ssfi,
                );
            }
            itemsCount = Object.keys(val).length;
    }
    this.assert(
        0 === itemsCount,
        'expected #{this} to be empty',
        'expected #{this} not to be empty',
    );
});
function checkArguments() {
    let obj = flag2(this, 'object'),
        type3 = type(obj);
    this.assert(
        'Arguments' === type3,
        'expected #{this} to be arguments but got ' + type3,
        'expected #{this} to not be arguments',
    );
}
__name(checkArguments, 'checkArguments');
Assertion.addProperty('arguments', checkArguments);
Assertion.addProperty('Arguments', checkArguments);
function assertEqual(val, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object');
    if (flag2(this, 'deep')) {
        let prevLockSsfi = flag2(this, 'lockSsfi');
        flag2(this, 'lockSsfi', true);
        this.eql(val);
        flag2(this, 'lockSsfi', prevLockSsfi);
    } else {
        this.assert(
            val === obj,
            'expected #{this} to equal #{exp}',
            'expected #{this} to not equal #{exp}',
            val,
            this._obj,
            true,
        );
    }
}
__name(assertEqual, 'assertEqual');
Assertion.addMethod('equal', assertEqual);
Assertion.addMethod('equals', assertEqual);
Assertion.addMethod('eq', assertEqual);
function assertEql(obj, msg) {
    if (msg) flag2(this, 'message', msg);
    let eql = flag2(this, 'eql');
    this.assert(
        eql(obj, flag2(this, 'object')),
        'expected #{this} to deeply equal #{exp}',
        'expected #{this} to not deeply equal #{exp}',
        obj,
        this._obj,
        true,
    );
}
__name(assertEql, 'assertEql');
Assertion.addMethod('eql', assertEql);
Assertion.addMethod('eqls', assertEql);
function assertAbove(n, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        doLength = flag2(this, 'doLength'),
        flagMsg = flag2(this, 'message'),
        msgPrefix = flagMsg ? flagMsg + ': ' : '',
        ssfi = flag2(this, 'ssfi'),
        objType = type(obj).toLowerCase(),
        nType = type(n).toLowerCase();
    if (doLength && objType !== 'map' && objType !== 'set') {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }
    if (!doLength && objType === 'date' && nType !== 'date') {
        throw new AssertionError(msgPrefix + 'the argument to above must be a date', void 0, ssfi);
    } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
        throw new AssertionError(
            msgPrefix + 'the argument to above must be a number',
            void 0,
            ssfi,
        );
    } else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
        let printObj = objType === 'string' ? "'" + obj + "'" : obj;
        throw new AssertionError(
            msgPrefix + 'expected ' + printObj + ' to be a number or a date',
            void 0,
            ssfi,
        );
    }
    if (doLength) {
        let descriptor = 'length',
            itemsCount;
        if (objType === 'map' || objType === 'set') {
            descriptor = 'size';
            itemsCount = obj.size;
        } else {
            itemsCount = obj.length;
        }
        this.assert(
            itemsCount > n,
            'expected #{this} to have a ' + descriptor + ' above #{exp} but got #{act}',
            'expected #{this} to not have a ' + descriptor + ' above #{exp}',
            n,
            itemsCount,
        );
    } else {
        this.assert(
            obj > n,
            'expected #{this} to be above #{exp}',
            'expected #{this} to be at most #{exp}',
            n,
        );
    }
}
__name(assertAbove, 'assertAbove');
Assertion.addMethod('above', assertAbove);
Assertion.addMethod('gt', assertAbove);
Assertion.addMethod('greaterThan', assertAbove);
function assertLeast(n, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        doLength = flag2(this, 'doLength'),
        flagMsg = flag2(this, 'message'),
        msgPrefix = flagMsg ? flagMsg + ': ' : '',
        ssfi = flag2(this, 'ssfi'),
        objType = type(obj).toLowerCase(),
        nType = type(n).toLowerCase(),
        errorMessage,
        shouldThrow = true;
    if (doLength && objType !== 'map' && objType !== 'set') {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }
    if (!doLength && objType === 'date' && nType !== 'date') {
        errorMessage = msgPrefix + 'the argument to least must be a date';
    } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
        errorMessage = msgPrefix + 'the argument to least must be a number';
    } else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
        let printObj = objType === 'string' ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else {
        shouldThrow = false;
    }
    if (shouldThrow) {
        throw new AssertionError(errorMessage, void 0, ssfi);
    }
    if (doLength) {
        let descriptor = 'length',
            itemsCount;
        if (objType === 'map' || objType === 'set') {
            descriptor = 'size';
            itemsCount = obj.size;
        } else {
            itemsCount = obj.length;
        }
        this.assert(
            itemsCount >= n,
            'expected #{this} to have a ' + descriptor + ' at least #{exp} but got #{act}',
            'expected #{this} to have a ' + descriptor + ' below #{exp}',
            n,
            itemsCount,
        );
    } else {
        this.assert(
            obj >= n,
            'expected #{this} to be at least #{exp}',
            'expected #{this} to be below #{exp}',
            n,
        );
    }
}
__name(assertLeast, 'assertLeast');
Assertion.addMethod('least', assertLeast);
Assertion.addMethod('gte', assertLeast);
Assertion.addMethod('greaterThanOrEqual', assertLeast);
function assertBelow(n, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        doLength = flag2(this, 'doLength'),
        flagMsg = flag2(this, 'message'),
        msgPrefix = flagMsg ? flagMsg + ': ' : '',
        ssfi = flag2(this, 'ssfi'),
        objType = type(obj).toLowerCase(),
        nType = type(n).toLowerCase(),
        errorMessage,
        shouldThrow = true;
    if (doLength && objType !== 'map' && objType !== 'set') {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }
    if (!doLength && objType === 'date' && nType !== 'date') {
        errorMessage = msgPrefix + 'the argument to below must be a date';
    } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
        errorMessage = msgPrefix + 'the argument to below must be a number';
    } else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
        let printObj = objType === 'string' ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else {
        shouldThrow = false;
    }
    if (shouldThrow) {
        throw new AssertionError(errorMessage, void 0, ssfi);
    }
    if (doLength) {
        let descriptor = 'length',
            itemsCount;
        if (objType === 'map' || objType === 'set') {
            descriptor = 'size';
            itemsCount = obj.size;
        } else {
            itemsCount = obj.length;
        }
        this.assert(
            itemsCount < n,
            'expected #{this} to have a ' + descriptor + ' below #{exp} but got #{act}',
            'expected #{this} to not have a ' + descriptor + ' below #{exp}',
            n,
            itemsCount,
        );
    } else {
        this.assert(
            obj < n,
            'expected #{this} to be below #{exp}',
            'expected #{this} to be at least #{exp}',
            n,
        );
    }
}
__name(assertBelow, 'assertBelow');
Assertion.addMethod('below', assertBelow);
Assertion.addMethod('lt', assertBelow);
Assertion.addMethod('lessThan', assertBelow);
function assertMost(n, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        doLength = flag2(this, 'doLength'),
        flagMsg = flag2(this, 'message'),
        msgPrefix = flagMsg ? flagMsg + ': ' : '',
        ssfi = flag2(this, 'ssfi'),
        objType = type(obj).toLowerCase(),
        nType = type(n).toLowerCase(),
        errorMessage,
        shouldThrow = true;
    if (doLength && objType !== 'map' && objType !== 'set') {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }
    if (!doLength && objType === 'date' && nType !== 'date') {
        errorMessage = msgPrefix + 'the argument to most must be a date';
    } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
        errorMessage = msgPrefix + 'the argument to most must be a number';
    } else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
        let printObj = objType === 'string' ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else {
        shouldThrow = false;
    }
    if (shouldThrow) {
        throw new AssertionError(errorMessage, void 0, ssfi);
    }
    if (doLength) {
        let descriptor = 'length',
            itemsCount;
        if (objType === 'map' || objType === 'set') {
            descriptor = 'size';
            itemsCount = obj.size;
        } else {
            itemsCount = obj.length;
        }
        this.assert(
            itemsCount <= n,
            'expected #{this} to have a ' + descriptor + ' at most #{exp} but got #{act}',
            'expected #{this} to have a ' + descriptor + ' above #{exp}',
            n,
            itemsCount,
        );
    } else {
        this.assert(
            obj <= n,
            'expected #{this} to be at most #{exp}',
            'expected #{this} to be above #{exp}',
            n,
        );
    }
}
__name(assertMost, 'assertMost');
Assertion.addMethod('most', assertMost);
Assertion.addMethod('lte', assertMost);
Assertion.addMethod('lessThanOrEqual', assertMost);
Assertion.addMethod('within', function (start, finish, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        doLength = flag2(this, 'doLength'),
        flagMsg = flag2(this, 'message'),
        msgPrefix = flagMsg ? flagMsg + ': ' : '',
        ssfi = flag2(this, 'ssfi'),
        objType = type(obj).toLowerCase(),
        startType = type(start).toLowerCase(),
        finishType = type(finish).toLowerCase(),
        errorMessage,
        shouldThrow = true,
        range =
            startType === 'date' && finishType === 'date'
                ? start.toISOString() + '..' + finish.toISOString()
                : start + '..' + finish;
    if (doLength && objType !== 'map' && objType !== 'set') {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    }
    if (!doLength && objType === 'date' && (startType !== 'date' || finishType !== 'date')) {
        errorMessage = msgPrefix + 'the arguments to within must be dates';
    } else if ((!isNumeric(start) || !isNumeric(finish)) && (doLength || isNumeric(obj))) {
        errorMessage = msgPrefix + 'the arguments to within must be numbers';
    } else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
        let printObj = objType === 'string' ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else {
        shouldThrow = false;
    }
    if (shouldThrow) {
        throw new AssertionError(errorMessage, void 0, ssfi);
    }
    if (doLength) {
        let descriptor = 'length',
            itemsCount;
        if (objType === 'map' || objType === 'set') {
            descriptor = 'size';
            itemsCount = obj.size;
        } else {
            itemsCount = obj.length;
        }
        this.assert(
            itemsCount >= start && itemsCount <= finish,
            'expected #{this} to have a ' + descriptor + ' within ' + range,
            'expected #{this} to not have a ' + descriptor + ' within ' + range,
        );
    } else {
        this.assert(
            obj >= start && obj <= finish,
            'expected #{this} to be within ' + range,
            'expected #{this} to not be within ' + range,
        );
    }
});
function assertInstanceOf(constructor, msg) {
    if (msg) flag2(this, 'message', msg);
    let target = flag2(this, 'object');
    let ssfi = flag2(this, 'ssfi');
    let flagMsg = flag2(this, 'message');
    let isInstanceOf;
    try {
        isInstanceOf = target instanceof constructor;
    } catch (err) {
        if (err instanceof TypeError) {
            flagMsg = flagMsg ? flagMsg + ': ' : '';
            throw new AssertionError(
                flagMsg +
                    'The instanceof assertion needs a constructor but ' +
                    type(constructor) +
                    ' was given.',
                void 0,
                ssfi,
            );
        }
        throw err;
    }
    let name = getName(constructor);
    if (name == null) {
        name = 'an unnamed constructor';
    }
    this.assert(
        isInstanceOf,
        'expected #{this} to be an instance of ' + name,
        'expected #{this} to not be an instance of ' + name,
    );
}
__name(assertInstanceOf, 'assertInstanceOf');
Assertion.addMethod('instanceof', assertInstanceOf);
Assertion.addMethod('instanceOf', assertInstanceOf);
function assertProperty(name, val, msg) {
    if (msg) flag2(this, 'message', msg);
    let isNested = flag2(this, 'nested'),
        isOwn = flag2(this, 'own'),
        flagMsg = flag2(this, 'message'),
        obj = flag2(this, 'object'),
        ssfi = flag2(this, 'ssfi'),
        nameType = typeof name;
    flagMsg = flagMsg ? flagMsg + ': ' : '';
    if (isNested) {
        if (nameType !== 'string') {
            throw new AssertionError(
                flagMsg + 'the argument to property must be a string when using nested syntax',
                void 0,
                ssfi,
            );
        }
    } else {
        if (nameType !== 'string' && nameType !== 'number' && nameType !== 'symbol') {
            throw new AssertionError(
                flagMsg + 'the argument to property must be a string, number, or symbol',
                void 0,
                ssfi,
            );
        }
    }
    if (isNested && isOwn) {
        throw new AssertionError(
            flagMsg + 'The "nested" and "own" flags cannot be combined.',
            void 0,
            ssfi,
        );
    }
    if (obj === null || obj === void 0) {
        throw new AssertionError(flagMsg + 'Target cannot be null or undefined.', void 0, ssfi);
    }
    let isDeep = flag2(this, 'deep'),
        negate = flag2(this, 'negate'),
        pathInfo = isNested ? getPathInfo(obj, name) : null,
        value = isNested ? pathInfo.value : obj[name],
        isEql = isDeep ? flag2(this, 'eql') : (val1, val2) => val1 === val2;
    let descriptor = '';
    if (isDeep) descriptor += 'deep ';
    if (isOwn) descriptor += 'own ';
    if (isNested) descriptor += 'nested ';
    descriptor += 'property ';
    let hasProperty2;
    if (isOwn) hasProperty2 = Object.prototype.hasOwnProperty.call(obj, name);
    else if (isNested) hasProperty2 = pathInfo.exists;
    else hasProperty2 = hasProperty(obj, name);
    if (!negate || arguments.length === 1) {
        this.assert(
            hasProperty2,
            'expected #{this} to have ' + descriptor + inspect2(name),
            'expected #{this} to not have ' + descriptor + inspect2(name),
        );
    }
    if (arguments.length > 1) {
        this.assert(
            hasProperty2 && isEql(val, value),
            'expected #{this} to have ' +
                descriptor +
                inspect2(name) +
                ' of #{exp}, but got #{act}',
            'expected #{this} to not have ' + descriptor + inspect2(name) + ' of #{act}',
            val,
            value,
        );
    }
    flag2(this, 'object', value);
}
__name(assertProperty, 'assertProperty');
Assertion.addMethod('property', assertProperty);
function assertOwnProperty(_name, _value, _msg) {
    flag2(this, 'own', true);
    assertProperty.apply(this, arguments);
}
__name(assertOwnProperty, 'assertOwnProperty');
Assertion.addMethod('ownProperty', assertOwnProperty);
Assertion.addMethod('haveOwnProperty', assertOwnProperty);
function assertOwnPropertyDescriptor(name, descriptor, msg) {
    if (typeof descriptor === 'string') {
        msg = descriptor;
        descriptor = null;
    }
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object');
    let actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
    let eql = flag2(this, 'eql');
    if (actualDescriptor && descriptor) {
        this.assert(
            eql(descriptor, actualDescriptor),
            'expected the own property descriptor for ' +
                inspect2(name) +
                ' on #{this} to match ' +
                inspect2(descriptor) +
                ', got ' +
                inspect2(actualDescriptor),
            'expected the own property descriptor for ' +
                inspect2(name) +
                ' on #{this} to not match ' +
                inspect2(descriptor),
            descriptor,
            actualDescriptor,
            true,
        );
    } else {
        this.assert(
            actualDescriptor,
            'expected #{this} to have an own property descriptor for ' + inspect2(name),
            'expected #{this} to not have an own property descriptor for ' + inspect2(name),
        );
    }
    flag2(this, 'object', actualDescriptor);
}
__name(assertOwnPropertyDescriptor, 'assertOwnPropertyDescriptor');
Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);
function assertLengthChain() {
    flag2(this, 'doLength', true);
}
__name(assertLengthChain, 'assertLengthChain');
function assertLength(n, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        objType = type(obj).toLowerCase(),
        flagMsg = flag2(this, 'message'),
        ssfi = flag2(this, 'ssfi'),
        descriptor = 'length',
        itemsCount;
    switch (objType) {
        case 'map':
        case 'set':
            descriptor = 'size';
            itemsCount = obj.size;
            break;
        default:
            new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
            itemsCount = obj.length;
    }
    this.assert(
        itemsCount == n,
        'expected #{this} to have a ' + descriptor + ' of #{exp} but got #{act}',
        'expected #{this} to not have a ' + descriptor + ' of #{act}',
        n,
        itemsCount,
    );
}
__name(assertLength, 'assertLength');
Assertion.addChainableMethod('length', assertLength, assertLengthChain);
Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);
function assertMatch(re, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object');
    this.assert(
        re.exec(obj),
        'expected #{this} to match ' + re,
        'expected #{this} not to match ' + re,
    );
}
__name(assertMatch, 'assertMatch');
Assertion.addMethod('match', assertMatch);
Assertion.addMethod('matches', assertMatch);
Assertion.addMethod('string', function (str, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        flagMsg = flag2(this, 'message'),
        ssfi = flag2(this, 'ssfi');
    new Assertion(obj, flagMsg, ssfi, true).is.a('string');
    this.assert(
        ~obj.indexOf(str),
        'expected #{this} to contain ' + inspect2(str),
        'expected #{this} to not contain ' + inspect2(str),
    );
});
function assertKeys(keys) {
    let obj = flag2(this, 'object'),
        objType = type(obj),
        keysType = type(keys),
        ssfi = flag2(this, 'ssfi'),
        isDeep = flag2(this, 'deep'),
        str,
        deepStr = '',
        actual,
        ok = true,
        flagMsg = flag2(this, 'message');
    flagMsg = flagMsg ? flagMsg + ': ' : '';
    let mixedArgsMsg =
        flagMsg +
        'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';
    if (objType === 'Map' || objType === 'Set') {
        deepStr = isDeep ? 'deeply ' : '';
        actual = [];
        obj.forEach(function (val, key) {
            actual.push(key);
        });
        if (keysType !== 'Array') {
            keys = Array.prototype.slice.call(arguments);
        }
    } else {
        actual = getOwnEnumerableProperties(obj);
        switch (keysType) {
            case 'Array':
                if (arguments.length > 1) {
                    throw new AssertionError(mixedArgsMsg, void 0, ssfi);
                }
                break;
            case 'Object':
                if (arguments.length > 1) {
                    throw new AssertionError(mixedArgsMsg, void 0, ssfi);
                }
                keys = Object.keys(keys);
                break;
            default:
                keys = Array.prototype.slice.call(arguments);
        }
        keys = keys.map(function (val) {
            return typeof val === 'symbol' ? val : String(val);
        });
    }
    if (!keys.length) {
        throw new AssertionError(flagMsg + 'keys required', void 0, ssfi);
    }
    let len = keys.length,
        any = flag2(this, 'any'),
        all = flag2(this, 'all'),
        expected = keys,
        isEql = isDeep ? flag2(this, 'eql') : (val1, val2) => val1 === val2;
    if (!any && !all) {
        all = true;
    }
    if (any) {
        ok = expected.some(function (expectedKey) {
            return actual.some(function (actualKey) {
                return isEql(expectedKey, actualKey);
            });
        });
    }
    if (all) {
        ok = expected.every(function (expectedKey) {
            return actual.some(function (actualKey) {
                return isEql(expectedKey, actualKey);
            });
        });
        if (!flag2(this, 'contains')) {
            ok = ok && keys.length == actual.length;
        }
    }
    if (len > 1) {
        keys = keys.map(function (key) {
            return inspect2(key);
        });
        let last = keys.pop();
        if (all) {
            str = keys.join(', ') + ', and ' + last;
        }
        if (any) {
            str = keys.join(', ') + ', or ' + last;
        }
    } else {
        str = inspect2(keys[0]);
    }
    str = (len > 1 ? 'keys ' : 'key ') + str;
    str = (flag2(this, 'contains') ? 'contain ' : 'have ') + str;
    this.assert(
        ok,
        'expected #{this} to ' + deepStr + str,
        'expected #{this} to not ' + deepStr + str,
        expected.slice(0).sort(compareByInspect),
        actual.sort(compareByInspect),
        true,
    );
}
__name(assertKeys, 'assertKeys');
Assertion.addMethod('keys', assertKeys);
Assertion.addMethod('key', assertKeys);
function assertThrows(errorLike, errMsgMatcher, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        ssfi = flag2(this, 'ssfi'),
        flagMsg = flag2(this, 'message'),
        negate = flag2(this, 'negate') || false;
    new Assertion(obj, flagMsg, ssfi, true).is.a('function');
    if (isRegExp2(errorLike) || typeof errorLike === 'string') {
        errMsgMatcher = errorLike;
        errorLike = null;
    }
    let caughtErr;
    let errorWasThrown = false;
    try {
        obj();
    } catch (err) {
        errorWasThrown = true;
        caughtErr = err;
    }
    let everyArgIsUndefined = errorLike === void 0 && errMsgMatcher === void 0;
    let everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
    let errorLikeFail = false;
    let errMsgMatcherFail = false;
    if (everyArgIsUndefined || (!everyArgIsUndefined && !negate)) {
        let errorLikeString = 'an error';
        if (errorLike instanceof Error) {
            errorLikeString = '#{exp}';
        } else if (errorLike) {
            errorLikeString = check_error_exports.getConstructorName(errorLike);
        }
        let actual = caughtErr;
        if (caughtErr instanceof Error) {
            actual = caughtErr.toString();
        } else if (typeof caughtErr === 'string') {
            actual = caughtErr;
        } else if (
            caughtErr &&
            (typeof caughtErr === 'object' || typeof caughtErr === 'function')
        ) {
            try {
                actual = check_error_exports.getConstructorName(caughtErr);
            } catch (_err) {}
        }
        this.assert(
            errorWasThrown,
            'expected #{this} to throw ' + errorLikeString,
            'expected #{this} to not throw an error but #{act} was thrown',
            errorLike && errorLike.toString(),
            actual,
        );
    }
    if (errorLike && caughtErr) {
        if (errorLike instanceof Error) {
            let isCompatibleInstance = check_error_exports.compatibleInstance(caughtErr, errorLike);
            if (isCompatibleInstance === negate) {
                if (everyArgIsDefined && negate) {
                    errorLikeFail = true;
                } else {
                    this.assert(
                        negate,
                        'expected #{this} to throw #{exp} but #{act} was thrown',
                        'expected #{this} to not throw #{exp}' +
                            (caughtErr && !negate ? ' but #{act} was thrown' : ''),
                        errorLike.toString(),
                        caughtErr.toString(),
                    );
                }
            }
        }
        let isCompatibleConstructor = check_error_exports.compatibleConstructor(
            caughtErr,
            errorLike,
        );
        if (isCompatibleConstructor === negate) {
            if (everyArgIsDefined && negate) {
                errorLikeFail = true;
            } else {
                this.assert(
                    negate,
                    'expected #{this} to throw #{exp} but #{act} was thrown',
                    'expected #{this} to not throw #{exp}' +
                        (caughtErr ? ' but #{act} was thrown' : ''),
                    errorLike instanceof Error
                        ? errorLike.toString()
                        : errorLike && check_error_exports.getConstructorName(errorLike),
                    caughtErr instanceof Error
                        ? caughtErr.toString()
                        : caughtErr && check_error_exports.getConstructorName(caughtErr),
                );
            }
        }
    }
    if (caughtErr && errMsgMatcher !== void 0 && errMsgMatcher !== null) {
        let placeholder = 'including';
        if (isRegExp2(errMsgMatcher)) {
            placeholder = 'matching';
        }
        let isCompatibleMessage = check_error_exports.compatibleMessage(caughtErr, errMsgMatcher);
        if (isCompatibleMessage === negate) {
            if (everyArgIsDefined && negate) {
                errMsgMatcherFail = true;
            } else {
                this.assert(
                    negate,
                    'expected #{this} to throw error ' + placeholder + ' #{exp} but got #{act}',
                    'expected #{this} to throw error not ' + placeholder + ' #{exp}',
                    errMsgMatcher,
                    check_error_exports.getMessage(caughtErr),
                );
            }
        }
    }
    if (errorLikeFail && errMsgMatcherFail) {
        this.assert(
            negate,
            'expected #{this} to throw #{exp} but #{act} was thrown',
            'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : ''),
            errorLike instanceof Error
                ? errorLike.toString()
                : errorLike && check_error_exports.getConstructorName(errorLike),
            caughtErr instanceof Error
                ? caughtErr.toString()
                : caughtErr && check_error_exports.getConstructorName(caughtErr),
        );
    }
    flag2(this, 'object', caughtErr);
}
__name(assertThrows, 'assertThrows');
Assertion.addMethod('throw', assertThrows);
Assertion.addMethod('throws', assertThrows);
Assertion.addMethod('Throw', assertThrows);
function respondTo(method, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        itself = flag2(this, 'itself'),
        context = 'function' === typeof obj && !itself ? obj.prototype[method] : obj[method];
    this.assert(
        'function' === typeof context,
        'expected #{this} to respond to ' + inspect2(method),
        'expected #{this} to not respond to ' + inspect2(method),
    );
}
__name(respondTo, 'respondTo');
Assertion.addMethod('respondTo', respondTo);
Assertion.addMethod('respondsTo', respondTo);
Assertion.addProperty('itself', function () {
    flag2(this, 'itself', true);
});
function satisfy(matcher, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object');
    let result = matcher(obj);
    this.assert(
        result,
        'expected #{this} to satisfy ' + objDisplay(matcher),
        'expected #{this} to not satisfy' + objDisplay(matcher),
        flag2(this, 'negate') ? false : true,
        result,
    );
}
__name(satisfy, 'satisfy');
Assertion.addMethod('satisfy', satisfy);
Assertion.addMethod('satisfies', satisfy);
function closeTo(expected, delta, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        flagMsg = flag2(this, 'message'),
        ssfi = flag2(this, 'ssfi');
    new Assertion(obj, flagMsg, ssfi, true).is.numeric;
    let message = 'A `delta` value is required for `closeTo`';
    if (delta == void 0) {
        throw new AssertionError(flagMsg ? `${flagMsg}: ${message}` : message, void 0, ssfi);
    }
    new Assertion(delta, flagMsg, ssfi, true).is.numeric;
    message = 'A `expected` value is required for `closeTo`';
    if (expected == void 0) {
        throw new AssertionError(flagMsg ? `${flagMsg}: ${message}` : message, void 0, ssfi);
    }
    new Assertion(expected, flagMsg, ssfi, true).is.numeric;
    const abs = /* @__PURE__ */ __name((x) => (x < 0n ? -x : x), 'abs');
    const strip = /* @__PURE__ */ __name(
        (number) => parseFloat(parseFloat(number).toPrecision(12)),
        'strip',
    );
    this.assert(
        strip(abs(obj - expected)) <= delta,
        'expected #{this} to be close to ' + expected + ' +/- ' + delta,
        'expected #{this} not to be close to ' + expected + ' +/- ' + delta,
    );
}
__name(closeTo, 'closeTo');
Assertion.addMethod('closeTo', closeTo);
Assertion.addMethod('approximately', closeTo);
function isSubsetOf(_subset, _superset, cmp, contains, ordered) {
    let superset = Array.from(_superset);
    let subset = Array.from(_subset);
    if (!contains) {
        if (subset.length !== superset.length) return false;
        superset = superset.slice();
    }
    return subset.every(function (elem, idx) {
        if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
        if (!cmp) {
            let matchIdx = superset.indexOf(elem);
            if (matchIdx === -1) return false;
            if (!contains) superset.splice(matchIdx, 1);
            return true;
        }
        return superset.some(function (elem2, matchIdx) {
            if (!cmp(elem, elem2)) return false;
            if (!contains) superset.splice(matchIdx, 1);
            return true;
        });
    });
}
__name(isSubsetOf, 'isSubsetOf');
Assertion.addMethod('members', function (subset, msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object'),
        flagMsg = flag2(this, 'message'),
        ssfi = flag2(this, 'ssfi');
    new Assertion(obj, flagMsg, ssfi, true).to.be.iterable;
    new Assertion(subset, flagMsg, ssfi, true).to.be.iterable;
    let contains = flag2(this, 'contains');
    let ordered = flag2(this, 'ordered');
    let subject, failMsg, failNegateMsg;
    if (contains) {
        subject = ordered ? 'an ordered superset' : 'a superset';
        failMsg = 'expected #{this} to be ' + subject + ' of #{exp}';
        failNegateMsg = 'expected #{this} to not be ' + subject + ' of #{exp}';
    } else {
        subject = ordered ? 'ordered members' : 'members';
        failMsg = 'expected #{this} to have the same ' + subject + ' as #{exp}';
        failNegateMsg = 'expected #{this} to not have the same ' + subject + ' as #{exp}';
    }
    let cmp = flag2(this, 'deep') ? flag2(this, 'eql') : void 0;
    this.assert(
        isSubsetOf(subset, obj, cmp, contains, ordered),
        failMsg,
        failNegateMsg,
        subset,
        obj,
        true,
    );
});
Assertion.addProperty('iterable', function (msg) {
    if (msg) flag2(this, 'message', msg);
    let obj = flag2(this, 'object');
    this.assert(
        obj != void 0 && obj[Symbol.iterator],
        'expected #{this} to be an iterable',
        'expected #{this} to not be an iterable',
        obj,
    );
});
function oneOf(list, msg) {
    if (msg) flag2(this, 'message', msg);
    let expected = flag2(this, 'object'),
        flagMsg = flag2(this, 'message'),
        ssfi = flag2(this, 'ssfi'),
        contains = flag2(this, 'contains'),
        isDeep = flag2(this, 'deep'),
        eql = flag2(this, 'eql');
    new Assertion(list, flagMsg, ssfi, true).to.be.an('array');
    if (contains) {
        this.assert(
            list.some(function (possibility) {
                return expected.indexOf(possibility) > -1;
            }),
            'expected #{this} to contain one of #{exp}',
            'expected #{this} to not contain one of #{exp}',
            list,
            expected,
        );
    } else {
        if (isDeep) {
            this.assert(
                list.some(function (possibility) {
                    return eql(expected, possibility);
                }),
                'expected #{this} to deeply equal one of #{exp}',
                'expected #{this} to deeply equal one of #{exp}',
                list,
                expected,
            );
        } else {
            this.assert(
                list.indexOf(expected) > -1,
                'expected #{this} to be one of #{exp}',
                'expected #{this} to not be one of #{exp}',
                list,
                expected,
            );
        }
    }
}
__name(oneOf, 'oneOf');
Assertion.addMethod('oneOf', oneOf);
function assertChanges(subject, prop, msg) {
    if (msg) flag2(this, 'message', msg);
    let fn = flag2(this, 'object'),
        flagMsg = flag2(this, 'message'),
        ssfi = flag2(this, 'ssfi');
    new Assertion(fn, flagMsg, ssfi, true).is.a('function');
    let initial;
    if (!prop) {
        new Assertion(subject, flagMsg, ssfi, true).is.a('function');
        initial = subject();
    } else {
        new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
        initial = subject[prop];
    }
    fn();
    let final = prop === void 0 || prop === null ? subject() : subject[prop];
    let msgObj = prop === void 0 || prop === null ? initial : '.' + prop;
    flag2(this, 'deltaMsgObj', msgObj);
    flag2(this, 'initialDeltaValue', initial);
    flag2(this, 'finalDeltaValue', final);
    flag2(this, 'deltaBehavior', 'change');
    flag2(this, 'realDelta', final !== initial);
    this.assert(
        initial !== final,
        'expected ' + msgObj + ' to change',
        'expected ' + msgObj + ' to not change',
    );
}
__name(assertChanges, 'assertChanges');
Assertion.addMethod('change', assertChanges);
Assertion.addMethod('changes', assertChanges);
function assertIncreases(subject, prop, msg) {
    if (msg) flag2(this, 'message', msg);
    let fn = flag2(this, 'object'),
        flagMsg = flag2(this, 'message'),
        ssfi = flag2(this, 'ssfi');
    new Assertion(fn, flagMsg, ssfi, true).is.a('function');
    let initial;
    if (!prop) {
        new Assertion(subject, flagMsg, ssfi, true).is.a('function');
        initial = subject();
    } else {
        new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
        initial = subject[prop];
    }
    new Assertion(initial, flagMsg, ssfi, true).is.a('number');
    fn();
    let final = prop === void 0 || prop === null ? subject() : subject[prop];
    let msgObj = prop === void 0 || prop === null ? initial : '.' + prop;
    flag2(this, 'deltaMsgObj', msgObj);
    flag2(this, 'initialDeltaValue', initial);
    flag2(this, 'finalDeltaValue', final);
    flag2(this, 'deltaBehavior', 'increase');
    flag2(this, 'realDelta', final - initial);
    this.assert(
        final - initial > 0,
        'expected ' + msgObj + ' to increase',
        'expected ' + msgObj + ' to not increase',
    );
}
__name(assertIncreases, 'assertIncreases');
Assertion.addMethod('increase', assertIncreases);
Assertion.addMethod('increases', assertIncreases);
function assertDecreases(subject, prop, msg) {
    if (msg) flag2(this, 'message', msg);
    let fn = flag2(this, 'object'),
        flagMsg = flag2(this, 'message'),
        ssfi = flag2(this, 'ssfi');
    new Assertion(fn, flagMsg, ssfi, true).is.a('function');
    let initial;
    if (!prop) {
        new Assertion(subject, flagMsg, ssfi, true).is.a('function');
        initial = subject();
    } else {
        new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
        initial = subject[prop];
    }
    new Assertion(initial, flagMsg, ssfi, true).is.a('number');
    fn();
    let final = prop === void 0 || prop === null ? subject() : subject[prop];
    let msgObj = prop === void 0 || prop === null ? initial : '.' + prop;
    flag2(this, 'deltaMsgObj', msgObj);
    flag2(this, 'initialDeltaValue', initial);
    flag2(this, 'finalDeltaValue', final);
    flag2(this, 'deltaBehavior', 'decrease');
    flag2(this, 'realDelta', initial - final);
    this.assert(
        final - initial < 0,
        'expected ' + msgObj + ' to decrease',
        'expected ' + msgObj + ' to not decrease',
    );
}
__name(assertDecreases, 'assertDecreases');
Assertion.addMethod('decrease', assertDecreases);
Assertion.addMethod('decreases', assertDecreases);
function assertDelta(delta, msg) {
    if (msg) flag2(this, 'message', msg);
    let msgObj = flag2(this, 'deltaMsgObj');
    let initial = flag2(this, 'initialDeltaValue');
    let final = flag2(this, 'finalDeltaValue');
    let behavior = flag2(this, 'deltaBehavior');
    let realDelta = flag2(this, 'realDelta');
    let expression;
    if (behavior === 'change') {
        expression = Math.abs(final - initial) === Math.abs(delta);
    } else {
        expression = realDelta === Math.abs(delta);
    }
    this.assert(
        expression,
        'expected ' + msgObj + ' to ' + behavior + ' by ' + delta,
        'expected ' + msgObj + ' to not ' + behavior + ' by ' + delta,
    );
}
__name(assertDelta, 'assertDelta');
Assertion.addMethod('by', assertDelta);
Assertion.addProperty('extensible', function () {
    let obj = flag2(this, 'object');
    let isExtensible = obj === Object(obj) && Object.isExtensible(obj);
    this.assert(
        isExtensible,
        'expected #{this} to be extensible',
        'expected #{this} to not be extensible',
    );
});
Assertion.addProperty('sealed', function () {
    let obj = flag2(this, 'object');
    let isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
    this.assert(isSealed, 'expected #{this} to be sealed', 'expected #{this} to not be sealed');
});
Assertion.addProperty('frozen', function () {
    let obj = flag2(this, 'object');
    let isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
    this.assert(isFrozen, 'expected #{this} to be frozen', 'expected #{this} to not be frozen');
});
Assertion.addProperty('finite', function (_msg) {
    let obj = flag2(this, 'object');
    this.assert(
        typeof obj === 'number' && isFinite(obj),
        'expected #{this} to be a finite number',
        'expected #{this} to not be a finite number',
    );
});
function compareSubset(expected, actual) {
    if (expected === actual) {
        return true;
    }
    if (typeof actual !== typeof expected) {
        return false;
    }
    if (typeof expected !== 'object' || expected === null) {
        return expected === actual;
    }
    if (!actual) {
        return false;
    }
    if (Array.isArray(expected)) {
        if (!Array.isArray(actual)) {
            return false;
        }
        return expected.every(function (exp) {
            return actual.some(function (act) {
                return compareSubset(exp, act);
            });
        });
    }
    if (expected instanceof Date) {
        if (actual instanceof Date) {
            return expected.getTime() === actual.getTime();
        } else {
            return false;
        }
    }
    return Object.keys(expected).every(function (key) {
        let expectedValue = expected[key];
        let actualValue = actual[key];
        if (typeof expectedValue === 'object' && expectedValue !== null && actualValue !== null) {
            return compareSubset(expectedValue, actualValue);
        }
        if (typeof expectedValue === 'function') {
            return expectedValue(actualValue);
        }
        return actualValue === expectedValue;
    });
}
__name(compareSubset, 'compareSubset');
Assertion.addMethod('containSubset', function (expected) {
    const actual = flag(this, 'object');
    const showDiff = config.showDiff;
    this.assert(
        compareSubset(expected, actual),
        'expected #{act} to contain subset #{exp}',
        'expected #{act} to not contain subset #{exp}',
        expected,
        actual,
        showDiff,
    );
});

// lib/chai/interface/expect.js
function expect(val, message) {
    return new Assertion(val, message);
}
__name(expect, 'expect');
expect.fail = function (actual, expected, message, operator) {
    if (arguments.length < 2) {
        message = actual;
        actual = void 0;
    }
    message = message || 'expect.fail()';
    throw new AssertionError(
        message,
        {
            actual,
            expected,
            operator,
        },
        expect.fail,
    );
};

// lib/chai/interface/should.js
var should_exports = {};
__export(should_exports, {
    Should: () => Should,
    should: () => should,
});
function loadShould() {
    function shouldGetter() {
        if (
            this instanceof String ||
            this instanceof Number ||
            this instanceof Boolean ||
            (typeof Symbol === 'function' && this instanceof Symbol) ||
            (typeof BigInt === 'function' && this instanceof BigInt)
        ) {
            return new Assertion(this.valueOf(), null, shouldGetter);
        }
        return new Assertion(this, null, shouldGetter);
    }
    __name(shouldGetter, 'shouldGetter');
    function shouldSetter(value) {
        Object.defineProperty(this, 'should', {
            value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    }
    __name(shouldSetter, 'shouldSetter');
    Object.defineProperty(Object.prototype, 'should', {
        set: shouldSetter,
        get: shouldGetter,
        configurable: true,
    });
    let should2 = {};
    should2.fail = function (actual, expected, message, operator) {
        if (arguments.length < 2) {
            message = actual;
            actual = void 0;
        }
        message = message || 'should.fail()';
        throw new AssertionError(
            message,
            {
                actual,
                expected,
                operator,
            },
            should2.fail,
        );
    };
    should2.equal = function (actual, expected, message) {
        new Assertion(actual, message).to.equal(expected);
    };
    should2.Throw = function (fn, errt, errs, msg) {
        new Assertion(fn, msg).to.Throw(errt, errs);
    };
    should2.exist = function (val, msg) {
        new Assertion(val, msg).to.exist;
    };
    should2.not = {};
    should2.not.equal = function (actual, expected, msg) {
        new Assertion(actual, msg).to.not.equal(expected);
    };
    should2.not.Throw = function (fn, errt, errs, msg) {
        new Assertion(fn, msg).to.not.Throw(errt, errs);
    };
    should2.not.exist = function (val, msg) {
        new Assertion(val, msg).to.not.exist;
    };
    should2['throw'] = should2['Throw'];
    should2.not['throw'] = should2.not['Throw'];
    return should2;
}
__name(loadShould, 'loadShould');
var should = loadShould;
var Should = loadShould;

// lib/chai/interface/assert.js
function assert(express, errmsg) {
    let test2 = new Assertion(null, null, assert, true);
    test2.assert(express, errmsg, '[ negation message unavailable ]');
}
__name(assert, 'assert');
assert.fail = function (actual, expected, message, operator) {
    if (arguments.length < 2) {
        message = actual;
        actual = void 0;
    }
    message = message || 'assert.fail()';
    throw new AssertionError(
        message,
        {
            actual,
            expected,
            operator,
        },
        assert.fail,
    );
};
assert.isOk = function (val, msg) {
    new Assertion(val, msg, assert.isOk, true).is.ok;
};
assert.isNotOk = function (val, msg) {
    new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
};
assert.equal = function (act, exp, msg) {
    let test2 = new Assertion(act, msg, assert.equal, true);
    test2.assert(
        exp == flag(test2, 'object'),
        'expected #{this} to equal #{exp}',
        'expected #{this} to not equal #{act}',
        exp,
        act,
        true,
    );
};
assert.notEqual = function (act, exp, msg) {
    let test2 = new Assertion(act, msg, assert.notEqual, true);
    test2.assert(
        exp != flag(test2, 'object'),
        'expected #{this} to not equal #{exp}',
        'expected #{this} to equal #{act}',
        exp,
        act,
        true,
    );
};
assert.strictEqual = function (act, exp, msg) {
    new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
};
assert.notStrictEqual = function (act, exp, msg) {
    new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
};
assert.deepEqual = assert.deepStrictEqual = function (act, exp, msg) {
    new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
};
assert.notDeepEqual = function (act, exp, msg) {
    new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
};
assert.isAbove = function (val, abv, msg) {
    new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
};
assert.isAtLeast = function (val, atlst, msg) {
    new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
};
assert.isBelow = function (val, blw, msg) {
    new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
};
assert.isAtMost = function (val, atmst, msg) {
    new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
};
assert.isTrue = function (val, msg) {
    new Assertion(val, msg, assert.isTrue, true).is['true'];
};
assert.isNotTrue = function (val, msg) {
    new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
};
assert.isFalse = function (val, msg) {
    new Assertion(val, msg, assert.isFalse, true).is['false'];
};
assert.isNotFalse = function (val, msg) {
    new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
};
assert.isNull = function (val, msg) {
    new Assertion(val, msg, assert.isNull, true).to.equal(null);
};
assert.isNotNull = function (val, msg) {
    new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
};
assert.isNaN = function (val, msg) {
    new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
};
assert.isNotNaN = function (value, message) {
    new Assertion(value, message, assert.isNotNaN, true).not.to.be.NaN;
};
assert.exists = function (val, msg) {
    new Assertion(val, msg, assert.exists, true).to.exist;
};
assert.notExists = function (val, msg) {
    new Assertion(val, msg, assert.notExists, true).to.not.exist;
};
assert.isUndefined = function (val, msg) {
    new Assertion(val, msg, assert.isUndefined, true).to.equal(void 0);
};
assert.isDefined = function (val, msg) {
    new Assertion(val, msg, assert.isDefined, true).to.not.equal(void 0);
};
assert.isCallable = function (value, message) {
    new Assertion(value, message, assert.isCallable, true).is.callable;
};
assert.isNotCallable = function (value, message) {
    new Assertion(value, message, assert.isNotCallable, true).is.not.callable;
};
assert.isObject = function (val, msg) {
    new Assertion(val, msg, assert.isObject, true).to.be.a('object');
};
assert.isNotObject = function (val, msg) {
    new Assertion(val, msg, assert.isNotObject, true).to.not.be.a('object');
};
assert.isArray = function (val, msg) {
    new Assertion(val, msg, assert.isArray, true).to.be.an('array');
};
assert.isNotArray = function (val, msg) {
    new Assertion(val, msg, assert.isNotArray, true).to.not.be.an('array');
};
assert.isString = function (val, msg) {
    new Assertion(val, msg, assert.isString, true).to.be.a('string');
};
assert.isNotString = function (val, msg) {
    new Assertion(val, msg, assert.isNotString, true).to.not.be.a('string');
};
assert.isNumber = function (val, msg) {
    new Assertion(val, msg, assert.isNumber, true).to.be.a('number');
};
assert.isNotNumber = function (val, msg) {
    new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a('number');
};
assert.isNumeric = function (val, msg) {
    new Assertion(val, msg, assert.isNumeric, true).is.numeric;
};
assert.isNotNumeric = function (val, msg) {
    new Assertion(val, msg, assert.isNotNumeric, true).is.not.numeric;
};
assert.isFinite = function (val, msg) {
    new Assertion(val, msg, assert.isFinite, true).to.be.finite;
};
assert.isBoolean = function (val, msg) {
    new Assertion(val, msg, assert.isBoolean, true).to.be.a('boolean');
};
assert.isNotBoolean = function (val, msg) {
    new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a('boolean');
};
assert.typeOf = function (val, type3, msg) {
    new Assertion(val, msg, assert.typeOf, true).to.be.a(type3);
};
assert.notTypeOf = function (value, type3, message) {
    new Assertion(value, message, assert.notTypeOf, true).to.not.be.a(type3);
};
assert.instanceOf = function (val, type3, msg) {
    new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type3);
};
assert.notInstanceOf = function (val, type3, msg) {
    new Assertion(val, msg, assert.notInstanceOf, true).to.not.be.instanceOf(type3);
};
assert.include = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.include, true).include(inc);
};
assert.notInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
};
assert.deepInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
};
assert.notDeepInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
};
assert.nestedInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
};
assert.notNestedInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notNestedInclude, true).not.nested.include(inc);
};
assert.deepNestedInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.deepNestedInclude, true).deep.nested.include(inc);
};
assert.notDeepNestedInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notDeepNestedInclude, true).not.deep.nested.include(inc);
};
assert.ownInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
};
assert.notOwnInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
};
assert.deepOwnInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.deepOwnInclude, true).deep.own.include(inc);
};
assert.notDeepOwnInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notDeepOwnInclude, true).not.deep.own.include(inc);
};
assert.match = function (exp, re, msg) {
    new Assertion(exp, msg, assert.match, true).to.match(re);
};
assert.notMatch = function (exp, re, msg) {
    new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
};
assert.property = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.property, true).to.have.property(prop);
};
assert.notProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.notProperty, true).to.not.have.property(prop);
};
assert.propertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.propertyVal, true).to.have.property(prop, val);
};
assert.notPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.notPropertyVal, true).to.not.have.property(prop, val);
};
assert.deepPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.deepPropertyVal, true).to.have.deep.property(prop, val);
};
assert.notDeepPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.notDeepPropertyVal, true).to.not.have.deep.property(prop, val);
};
assert.ownProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.ownProperty, true).to.have.own.property(prop);
};
assert.notOwnProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.notOwnProperty, true).to.not.have.own.property(prop);
};
assert.ownPropertyVal = function (obj, prop, value, msg) {
    new Assertion(obj, msg, assert.ownPropertyVal, true).to.have.own.property(prop, value);
};
assert.notOwnPropertyVal = function (obj, prop, value, msg) {
    new Assertion(obj, msg, assert.notOwnPropertyVal, true).to.not.have.own.property(prop, value);
};
assert.deepOwnPropertyVal = function (obj, prop, value, msg) {
    new Assertion(obj, msg, assert.deepOwnPropertyVal, true).to.have.deep.own.property(prop, value);
};
assert.notDeepOwnPropertyVal = function (obj, prop, value, msg) {
    new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true).to.not.have.deep.own.property(
        prop,
        value,
    );
};
assert.nestedProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.nestedProperty, true).to.have.nested.property(prop);
};
assert.notNestedProperty = function (obj, prop, msg) {
    new Assertion(obj, msg, assert.notNestedProperty, true).to.not.have.nested.property(prop);
};
assert.nestedPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.nestedPropertyVal, true).to.have.nested.property(prop, val);
};
assert.notNestedPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.notNestedPropertyVal, true).to.not.have.nested.property(
        prop,
        val,
    );
};
assert.deepNestedPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.deepNestedPropertyVal, true).to.have.deep.nested.property(
        prop,
        val,
    );
};
assert.notDeepNestedPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true).to.not.have.deep.nested.property(
        prop,
        val,
    );
};
assert.lengthOf = function (exp, len, msg) {
    new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
};
assert.hasAnyKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
};
assert.hasAllKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
};
assert.containsAllKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.containsAllKeys, true).to.contain.all.keys(keys);
};
assert.doesNotHaveAnyKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true).to.not.have.any.keys(keys);
};
assert.doesNotHaveAllKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.doesNotHaveAllKeys, true).to.not.have.all.keys(keys);
};
assert.hasAnyDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.hasAnyDeepKeys, true).to.have.any.deep.keys(keys);
};
assert.hasAllDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.hasAllDeepKeys, true).to.have.all.deep.keys(keys);
};
assert.containsAllDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.containsAllDeepKeys, true).to.contain.all.deep.keys(keys);
};
assert.doesNotHaveAnyDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true).to.not.have.any.deep.keys(keys);
};
assert.doesNotHaveAllDeepKeys = function (obj, keys, msg) {
    new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true).to.not.have.all.deep.keys(keys);
};
assert.throws = function (fn, errorLike, errMsgMatcher, msg) {
    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
        errMsgMatcher = errorLike;
        errorLike = null;
    }
    let assertErr = new Assertion(fn, msg, assert.throws, true).to.throw(errorLike, errMsgMatcher);
    return flag(assertErr, 'object');
};
assert.doesNotThrow = function (fn, errorLike, errMsgMatcher, message) {
    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
        errMsgMatcher = errorLike;
        errorLike = null;
    }
    new Assertion(fn, message, assert.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
};
assert.operator = function (val, operator, val2, msg) {
    let ok;
    switch (operator) {
        case '==':
            ok = val == val2;
            break;
        case '===':
            ok = val === val2;
            break;
        case '>':
            ok = val > val2;
            break;
        case '>=':
            ok = val >= val2;
            break;
        case '<':
            ok = val < val2;
            break;
        case '<=':
            ok = val <= val2;
            break;
        case '!=':
            ok = val != val2;
            break;
        case '!==':
            ok = val !== val2;
            break;
        default:
            msg = msg ? msg + ': ' : msg;
            throw new AssertionError(
                msg + 'Invalid operator "' + operator + '"',
                void 0,
                assert.operator,
            );
    }
    let test2 = new Assertion(ok, msg, assert.operator, true);
    test2.assert(
        true === flag(test2, 'object'),
        'expected ' + inspect2(val) + ' to be ' + operator + ' ' + inspect2(val2),
        'expected ' + inspect2(val) + ' to not be ' + operator + ' ' + inspect2(val2),
    );
};
assert.closeTo = function (act, exp, delta, msg) {
    new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
};
assert.approximately = function (act, exp, delta, msg) {
    new Assertion(act, msg, assert.approximately, true).to.be.approximately(exp, delta);
};
assert.sameMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.sameMembers, true).to.have.same.members(set2);
};
assert.notSameMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.notSameMembers, true).to.not.have.same.members(set2);
};
assert.sameDeepMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.sameDeepMembers, true).to.have.same.deep.members(set2);
};
assert.notSameDeepMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.notSameDeepMembers, true).to.not.have.same.deep.members(set2);
};
assert.sameOrderedMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.sameOrderedMembers, true).to.have.same.ordered.members(set2);
};
assert.notSameOrderedMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.notSameOrderedMembers, true).to.not.have.same.ordered.members(
        set2,
    );
};
assert.sameDeepOrderedMembers = function (set1, set2, msg) {
    new Assertion(set1, msg, assert.sameDeepOrderedMembers, true).to.have.same.deep.ordered.members(
        set2,
    );
};
assert.notSameDeepOrderedMembers = function (set1, set2, msg) {
    new Assertion(
        set1,
        msg,
        assert.notSameDeepOrderedMembers,
        true,
    ).to.not.have.same.deep.ordered.members(set2);
};
assert.includeMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.includeMembers, true).to.include.members(subset);
};
assert.notIncludeMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.notIncludeMembers, true).to.not.include.members(subset);
};
assert.includeDeepMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.includeDeepMembers, true).to.include.deep.members(subset);
};
assert.notIncludeDeepMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.notIncludeDeepMembers, true).to.not.include.deep.members(
        subset,
    );
};
assert.includeOrderedMembers = function (superset, subset, msg) {
    new Assertion(superset, msg, assert.includeOrderedMembers, true).to.include.ordered.members(
        subset,
    );
};
assert.notIncludeOrderedMembers = function (superset, subset, msg) {
    new Assertion(
        superset,
        msg,
        assert.notIncludeOrderedMembers,
        true,
    ).to.not.include.ordered.members(subset);
};
assert.includeDeepOrderedMembers = function (superset, subset, msg) {
    new Assertion(
        superset,
        msg,
        assert.includeDeepOrderedMembers,
        true,
    ).to.include.deep.ordered.members(subset);
};
assert.notIncludeDeepOrderedMembers = function (superset, subset, msg) {
    new Assertion(
        superset,
        msg,
        assert.notIncludeDeepOrderedMembers,
        true,
    ).to.not.include.deep.ordered.members(subset);
};
assert.oneOf = function (inList, list, msg) {
    new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
};
assert.isIterable = function (obj, msg) {
    if (obj == void 0 || !obj[Symbol.iterator]) {
        msg = msg
            ? `${msg} expected ${inspect2(obj)} to be an iterable`
            : `expected ${inspect2(obj)} to be an iterable`;
        throw new AssertionError(msg, void 0, assert.isIterable);
    }
};
assert.changes = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
        msg = prop;
        prop = null;
    }
    new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
};
assert.changesBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
        let tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
    } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
    }
    new Assertion(fn, msg, assert.changesBy, true).to.change(obj, prop).by(delta);
};
assert.doesNotChange = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
        msg = prop;
        prop = null;
    }
    return new Assertion(fn, msg, assert.doesNotChange, true).to.not.change(obj, prop);
};
assert.changesButNotBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
        let tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
    } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
    }
    new Assertion(fn, msg, assert.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
};
assert.increases = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
        msg = prop;
        prop = null;
    }
    return new Assertion(fn, msg, assert.increases, true).to.increase(obj, prop);
};
assert.increasesBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
        let tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
    } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
    }
    new Assertion(fn, msg, assert.increasesBy, true).to.increase(obj, prop).by(delta);
};
assert.doesNotIncrease = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
        msg = prop;
        prop = null;
    }
    return new Assertion(fn, msg, assert.doesNotIncrease, true).to.not.increase(obj, prop);
};
assert.increasesButNotBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
        let tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
    } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
    }
    new Assertion(fn, msg, assert.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
};
assert.decreases = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
        msg = prop;
        prop = null;
    }
    return new Assertion(fn, msg, assert.decreases, true).to.decrease(obj, prop);
};
assert.decreasesBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
        let tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
    } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
    }
    new Assertion(fn, msg, assert.decreasesBy, true).to.decrease(obj, prop).by(delta);
};
assert.doesNotDecrease = function (fn, obj, prop, msg) {
    if (arguments.length === 3 && typeof obj === 'function') {
        msg = prop;
        prop = null;
    }
    return new Assertion(fn, msg, assert.doesNotDecrease, true).to.not.decrease(obj, prop);
};
assert.doesNotDecreaseBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
        let tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
    } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
    }
    return new Assertion(fn, msg, assert.doesNotDecreaseBy, true).to.not
        .decrease(obj, prop)
        .by(delta);
};
assert.decreasesButNotBy = function (fn, obj, prop, delta, msg) {
    if (arguments.length === 4 && typeof obj === 'function') {
        let tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
    } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
    }
    new Assertion(fn, msg, assert.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
};
assert.ifError = function (val) {
    if (val) {
        throw val;
    }
};
assert.isExtensible = function (obj, msg) {
    new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
};
assert.isNotExtensible = function (obj, msg) {
    new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
};
assert.isSealed = function (obj, msg) {
    new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
};
assert.isNotSealed = function (obj, msg) {
    new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
};
assert.isFrozen = function (obj, msg) {
    new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
};
assert.isNotFrozen = function (obj, msg) {
    new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
};
assert.isEmpty = function (val, msg) {
    new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
};
assert.isNotEmpty = function (val, msg) {
    new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
};
assert.containsSubset = function (val, exp, msg) {
    new Assertion(val, msg).to.containSubset(exp);
};
assert.doesNotContainSubset = function (val, exp, msg) {
    new Assertion(val, msg).to.not.containSubset(exp);
};
var aliases = [
    ['isOk', 'ok'],
    ['isNotOk', 'notOk'],
    ['throws', 'throw'],
    ['throws', 'Throw'],
    ['isExtensible', 'extensible'],
    ['isNotExtensible', 'notExtensible'],
    ['isSealed', 'sealed'],
    ['isNotSealed', 'notSealed'],
    ['isFrozen', 'frozen'],
    ['isNotFrozen', 'notFrozen'],
    ['isEmpty', 'empty'],
    ['isNotEmpty', 'notEmpty'],
    ['isCallable', 'isFunction'],
    ['isNotCallable', 'isNotFunction'],
    ['containsSubset', 'containSubset'],
];
for (const [name, as] of aliases) {
    assert[as] = assert[name];
}

// lib/chai.js
var used = [];
function use(fn) {
    const exports = {
        use,
        AssertionError,
        util: utils_exports,
        config,
        expect,
        assert,
        Assertion,
        ...should_exports,
    };
    if (!~used.indexOf(fn)) {
        fn(exports, utils_exports);
        used.push(fn);
    }
    return exports;
}
__name(use, 'use');
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - test utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - expectTypes utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - getActual utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - message composition utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - transferFlags utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - isProxyEnabled helper
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - addLengthGuard utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - getProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - proxify utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - overwriteProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - overwriteMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - addChainingMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - overwriteChainableMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - compareByInspect utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - getOwnEnumerablePropertySymbols utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - getOwnEnumerableProperties utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Chai - isNaN utility
 * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
 * MIT Licensed
 */
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*! Bundled license information:

deep-eql/index.js:
  (*!
   * deep-eql
   * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Check to see if the MemoizeMap has recorded a result of the two operands
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {MemoizeMap} memoizeMap
   * @returns {Boolean|null} result
  *)
  (*!
   * Set the result of the equality into the MemoizeMap
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {MemoizeMap} memoizeMap
   * @param {Boolean} result
  *)
  (*!
   * Primary Export
   *)
  (*!
   * The main logic of the `deepEqual` function.
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {Object} [options] (optional) Additional options
   * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
   * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
      complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
      references to blow the stack.
   * @return {Boolean} equal match
  *)
  (*!
   * Compare two Regular Expressions for equality.
   *
   * @param {RegExp} leftHandOperand
   * @param {RegExp} rightHandOperand
   * @return {Boolean} result
   *)
  (*!
   * Compare two Sets/Maps for equality. Faster than other equality functions.
   *
   * @param {Set} leftHandOperand
   * @param {Set} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
   *
   * @param {Iterable} leftHandOperand
   * @param {Iterable} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Simple equality for generator objects such as those returned by generator functions.
   *
   * @param {Iterable} leftHandOperand
   * @param {Iterable} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Determine if the given object has an @@iterator function.
   *
   * @param {Object} target
   * @return {Boolean} `true` if the object has an @@iterator function.
   *)
  (*!
   * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
   * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
   *
   * @param {Object} target
   * @returns {Array} an array of entries from the @@iterator function
   *)
  (*!
   * Gets all entries from a Generator. This will consume the generator - which could have side effects.
   *
   * @param {Generator} target
   * @returns {Array} an array of entries from the Generator.
   *)
  (*!
   * Gets all own and inherited enumerable keys from a target.
   *
   * @param {Object} target
   * @returns {Array} an array of own and inherited enumerable keys from the target.
   *)
  (*!
   * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
   * each key. If any value of the given key is not equal, the function will return false (early).
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
   * for each enumerable key in the object.
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Returns true if the argument is a primitive.
   *
   * This intentionally returns true for all objects that can be compared by reference,
   * including functions and symbols.
   *
   * @param {Mixed} value
   * @return {Boolean} result
   *)
*/

/**
 * Parses the base url from an url
 *
 * @param url
 * @returns {string}
 */

/**
 * Like customElements.define() but tries to display an error in case the browser doesn't
 * support everything we need.
 *
 * Returns false in case define failed, true otherwise.
 *
 * @returns {boolean}
 */

/**
 * Same as customElements.define() but with some additional error handling.
 *
 * In case the same component (with the exact same implementation) is already
 * defined then this will do nothing instead of erroring out.
 *
 * In case the browser doesn't support custom elements it will fill all those
 * custom tags with an error message so the user gets some feedback instead of
 * just an empty page.
 *
 * @param {string} name
 * @param {Function} constructor
 * @param {object} options
 */
const defineCustomElement = (name, constructor, options) => {
    // In case the constructor is already defined just do nothing
    if (customElements.get(name) === constructor) {
        return true;
    }
    // Checks taken from https://github.com/webcomponents/webcomponentsjs/blob/master/webcomponents-loader.js
    if (
        !(
            'attachShadow' in Element.prototype &&
            'getRootNode' in Element.prototype &&
            window.customElements
        )
    ) {
        var elements = document.getElementsByTagName(name);
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML =
                "<span style='border: 1px solid red; font-size: 0.8em; " +
                "opacity: 0.5; padding: 0.2em;'>☹ Your browser is not supported ☹</span>";
        }
        return false;
    }
    customElements.define(name, constructor, options);
    return true;
};

/**
 * Get an absolute path for assets given a relative path to the js bundle.
 *
 * @param {string} pkg The package which provides the asset
 * @param {string} path The relative path based on the js bundle path
 * @param {object} [options] Optional parameters
 * @param {string} [options.metaUrl] Custom meta URL for testing
 * @returns {string} The absolute URL to the asset
 */
const getAssetURL = (pkg, path, options = {}) => {
    let fullPath = '';
    if (path === undefined) {
        // backwards compat: in case only one parameter is passed
        // assume it is a full path
        fullPath = pkg;
    } else {
        fullPath = 'local/' + pkg + '/' + path;
    }

    let baseUrl = new URL(options.metaUrl !== undefined ? options.metaUrl : import.meta.url);
    // XXX: In case we are under "/shared/" assume we are called from a chunk
    // and need to go up one level. This assumes that all chunks are stored in
    // "/shared/" by the bundler.
    if (baseUrl.pathname.split('/').slice(-2)[0] === 'shared') {
        baseUrl = new URL('..', baseUrl);
    }
    return new URL(fullPath, baseUrl).href;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2 = globalThis,
    e$4 =
        t$2.ShadowRoot &&
        (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) &&
        'adoptedStyleSheets' in Document.prototype &&
        'replace' in CSSStyleSheet.prototype,
    s$2 = Symbol(),
    o$5 = new WeakMap();
let n$2 = class n {
    constructor(t, e, o) {
        if (((this._$cssResult$ = true), o !== s$2))
            throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        ((this.cssText = t), (this.t = e));
    }
    get styleSheet() {
        let t = this.o;
        const s = this.t;
        if (e$4 && void 0 === t) {
            const e = void 0 !== s && 1 === s.length;
            (e && (t = o$5.get(s)),
                void 0 === t &&
                    ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText),
                    e && o$5.set(s, t)));
        }
        return t;
    }
    toString() {
        return this.cssText;
    }
};
const r$2 = (t) => new n$2('string' == typeof t ? t : t + '', void 0, s$2),
    i$4 = (t, ...e) => {
        const o =
            1 === t.length
                ? t[0]
                : e.reduce(
                      (e, s, o) =>
                          e +
                          ((t) => {
                              if (true === t._$cssResult$) return t.cssText;
                              if ('number' == typeof t) return t;
                              throw Error(
                                  "Value passed to 'css' function must be a 'css' function result: " +
                                      t +
                                      ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.",
                              );
                          })(s) +
                          t[o + 1],
                      t[0],
                  );
        return new n$2(o, t, s$2);
    },
    S$1 = (s, o) => {
        if (e$4)
            s.adoptedStyleSheets = o.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
        else
            for (const e of o) {
                const o = document.createElement('style'),
                    n = t$2.litNonce;
                (void 0 !== n && o.setAttribute('nonce', n),
                    (o.textContent = e.cssText),
                    s.appendChild(o));
            }
    },
    c$2 = e$4
        ? (t) => t
        : (t) =>
              t instanceof CSSStyleSheet
                  ? ((t) => {
                        let e = '';
                        for (const s of t.cssRules) e += s.cssText;
                        return r$2(e);
                    })(t)
                  : t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const {
        is: i$3,
        defineProperty: e$3,
        getOwnPropertyDescriptor: h$1,
        getOwnPropertyNames: r$1,
        getOwnPropertySymbols: o$4,
        getPrototypeOf: n$1,
    } = Object,
    a$1 = globalThis,
    c$1 = a$1.trustedTypes,
    l$1 = c$1 ? c$1.emptyScript : '',
    p$1 = a$1.reactiveElementPolyfillSupport,
    d$1 = (t, s) => t,
    u$1 = {
        toAttribute(t, s) {
            switch (s) {
                case Boolean:
                    t = t ? l$1 : null;
                    break;
                case Object:
                case Array:
                    t = null == t ? t : JSON.stringify(t);
            }
            return t;
        },
        fromAttribute(t, s) {
            let i = t;
            switch (s) {
                case Boolean:
                    i = null !== t;
                    break;
                case Number:
                    i = null === t ? null : Number(t);
                    break;
                case Object:
                case Array:
                    try {
                        i = JSON.parse(t);
                    } catch (t) {
                        i = null;
                    }
            }
            return i;
        },
    },
    f$1 = (t, s) => !i$3(t, s),
    b = {
        attribute: true,
        type: String,
        converter: u$1,
        reflect: false,
        useDefault: false,
        hasChanged: f$1,
    };
((Symbol.metadata ??= Symbol('metadata')), (a$1.litPropertyMetadata ??= new WeakMap()));
let y$1 = class y extends HTMLElement {
    static addInitializer(t) {
        (this._$Ei(), (this.l ??= []).push(t));
    }
    static get observedAttributes() {
        return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
    }
    static createProperty(t, s = b) {
        if (
            (s.state && (s.attribute = false),
            this._$Ei(),
            this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = true),
            this.elementProperties.set(t, s),
            !s.noAccessor)
        ) {
            const i = Symbol(),
                h = this.getPropertyDescriptor(t, i, s);
            void 0 !== h && e$3(this.prototype, t, h);
        }
    }
    static getPropertyDescriptor(t, s, i) {
        const {get: e, set: r} = h$1(this.prototype, t) ?? {
            get() {
                return this[s];
            },
            set(t) {
                this[s] = t;
            },
        };
        return {
            get: e,
            set(s) {
                const h = e?.call(this);
                (r?.call(this, s), this.requestUpdate(t, h, i));
            },
            configurable: true,
            enumerable: true,
        };
    }
    static getPropertyOptions(t) {
        return this.elementProperties.get(t) ?? b;
    }
    static _$Ei() {
        if (this.hasOwnProperty(d$1('elementProperties'))) return;
        const t = n$1(this);
        (t.finalize(),
            void 0 !== t.l && (this.l = [...t.l]),
            (this.elementProperties = new Map(t.elementProperties)));
    }
    static finalize() {
        if (this.hasOwnProperty(d$1('finalized'))) return;
        if (((this.finalized = true), this._$Ei(), this.hasOwnProperty(d$1('properties')))) {
            const t = this.properties,
                s = [...r$1(t), ...o$4(t)];
            for (const i of s) this.createProperty(i, t[i]);
        }
        const t = this[Symbol.metadata];
        if (null !== t) {
            const s = litPropertyMetadata.get(t);
            if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
        }
        this._$Eh = new Map();
        for (const [t, s] of this.elementProperties) {
            const i = this._$Eu(t, s);
            void 0 !== i && this._$Eh.set(i, t);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s) {
        const i = [];
        if (Array.isArray(s)) {
            const e = new Set(s.flat(1 / 0).reverse());
            for (const s of e) i.unshift(c$2(s));
        } else void 0 !== s && i.push(c$2(s));
        return i;
    }
    static _$Eu(t, s) {
        const i = s.attribute;
        return false === i
            ? void 0
            : 'string' == typeof i
              ? i
              : 'string' == typeof t
                ? t.toLowerCase()
                : void 0;
    }
    constructor() {
        (super(),
            (this._$Ep = void 0),
            (this.isUpdatePending = false),
            (this.hasUpdated = false),
            (this._$Em = null),
            this._$Ev());
    }
    _$Ev() {
        ((this._$ES = new Promise((t) => (this.enableUpdating = t))),
            (this._$AL = new Map()),
            this._$E_(),
            this.requestUpdate(),
            this.constructor.l?.forEach((t) => t(this)));
    }
    addController(t) {
        ((this._$EO ??= new Set()).add(t),
            void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.());
    }
    removeController(t) {
        this._$EO?.delete(t);
    }
    _$E_() {
        const t = new Map(),
            s = this.constructor.elementProperties;
        for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
        t.size > 0 && (this._$Ep = t);
    }
    createRenderRoot() {
        const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return (S$1(t, this.constructor.elementStyles), t);
    }
    connectedCallback() {
        ((this.renderRoot ??= this.createRenderRoot()),
            this.enableUpdating(true),
            this._$EO?.forEach((t) => t.hostConnected?.()));
    }
    enableUpdating(t) {}
    disconnectedCallback() {
        this._$EO?.forEach((t) => t.hostDisconnected?.());
    }
    attributeChangedCallback(t, s, i) {
        this._$AK(t, i);
    }
    _$ET(t, s) {
        const i = this.constructor.elementProperties.get(t),
            e = this.constructor._$Eu(t, i);
        if (void 0 !== e && true === i.reflect) {
            const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$1).toAttribute(
                s,
                i.type,
            );
            ((this._$Em = t),
                null == h ? this.removeAttribute(e) : this.setAttribute(e, h),
                (this._$Em = null));
        }
    }
    _$AK(t, s) {
        const i = this.constructor,
            e = i._$Eh.get(t);
        if (void 0 !== e && this._$Em !== e) {
            const t = i.getPropertyOptions(e),
                h =
                    'function' == typeof t.converter
                        ? {fromAttribute: t.converter}
                        : void 0 !== t.converter?.fromAttribute
                          ? t.converter
                          : u$1;
            ((this._$Em = e),
                (this[e] = h.fromAttribute(s, t.type) ?? this._$Ej?.get(e) ?? null),
                (this._$Em = null));
        }
    }
    requestUpdate(t, s, i) {
        if (void 0 !== t) {
            const e = this.constructor,
                h = this[t];
            if (
                ((i ??= e.getPropertyOptions(t)),
                !(
                    (i.hasChanged ?? f$1)(h, s) ||
                    (i.useDefault &&
                        i.reflect &&
                        h === this._$Ej?.get(t) &&
                        !this.hasAttribute(e._$Eu(t, i)))
                ))
            )
                return;
            this.C(t, s, i);
        }
        false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t, s, {useDefault: i, reflect: e, wrapped: h}, r) {
        (i &&
            !(this._$Ej ??= new Map()).has(t) &&
            (this._$Ej.set(t, r ?? s ?? this[t]), true !== h || void 0 !== r)) ||
            (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)),
            true === e && this._$Em !== t && (this._$Eq ??= new Set()).add(t));
    }
    async _$EP() {
        this.isUpdatePending = true;
        try {
            await this._$ES;
        } catch (t) {
            Promise.reject(t);
        }
        const t = this.scheduleUpdate();
        return (null != t && (await t), !this.isUpdatePending);
    }
    scheduleUpdate() {
        return this.performUpdate();
    }
    performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
            if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
                for (const [t, s] of this._$Ep) this[t] = s;
                this._$Ep = void 0;
            }
            const t = this.constructor.elementProperties;
            if (t.size > 0)
                for (const [s, i] of t) {
                    const {wrapped: t} = i,
                        e = this[s];
                    true !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
                }
        }
        let t = false;
        const s = this._$AL;
        try {
            ((t = this.shouldUpdate(s)),
                t
                    ? (this.willUpdate(s),
                      this._$EO?.forEach((t) => t.hostUpdate?.()),
                      this.update(s))
                    : this._$EM());
        } catch (s) {
            throw ((t = false), this._$EM(), s);
        }
        t && this._$AE(s);
    }
    willUpdate(t) {}
    _$AE(t) {
        (this._$EO?.forEach((t) => t.hostUpdated?.()),
            this.hasUpdated || ((this.hasUpdated = true), this.firstUpdated(t)),
            this.updated(t));
    }
    _$EM() {
        ((this._$AL = new Map()), (this.isUpdatePending = false));
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this._$ES;
    }
    shouldUpdate(t) {
        return true;
    }
    update(t) {
        ((this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM());
    }
    updated(t) {}
    firstUpdated(t) {}
};
((y$1.elementStyles = []),
    (y$1.shadowRootOptions = {mode: 'open'}),
    (y$1[d$1('elementProperties')] = new Map()),
    (y$1[d$1('finalized')] = new Map()),
    p$1?.({ReactiveElement: y$1}),
    (a$1.reactiveElementVersions ??= []).push('2.1.0'));

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis,
    i$2 = t$1.trustedTypes,
    s$1 = i$2 ? i$2.createPolicy('lit-html', {createHTML: (t) => t}) : void 0,
    e$2 = '$lit$',
    h = `lit$${Math.random().toFixed(9).slice(2)}$`,
    o$3 = '?' + h,
    n = `<${o$3}>`,
    r = document,
    l = () => r.createComment(''),
    c = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
    a = Array.isArray,
    u = (t) => a(t) || 'function' == typeof t?.[Symbol.iterator],
    d = '[ \t\n\f\r]',
    f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    v = /-->/g,
    _ = />/g,
    m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
    p = /'/g,
    g = /"/g,
    $ = /^(?:script|style|textarea|title)$/i,
    y =
        (t) =>
        (i, ...s) => ({_$litType$: t, strings: i, values: s}),
    x = y(1),
    T = Symbol.for('lit-noChange'),
    E = Symbol.for('lit-nothing'),
    A = new WeakMap(),
    C = r.createTreeWalker(r, 129);
function P(t, i) {
    if (!a(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
    return void 0 !== s$1 ? s$1.createHTML(i) : i;
}
const V = (t, i) => {
    const s = t.length - 1,
        o = [];
    let r,
        l = 2 === i ? '<svg>' : 3 === i ? '<math>' : '',
        c = f;
    for (let i = 0; i < s; i++) {
        const s = t[i];
        let a,
            u,
            d = -1,
            y = 0;
        for (; y < s.length && ((c.lastIndex = y), (u = c.exec(s)), null !== u); )
            ((y = c.lastIndex),
                c === f
                    ? '!--' === u[1]
                        ? (c = v)
                        : void 0 !== u[1]
                          ? (c = _)
                          : void 0 !== u[2]
                            ? ($.test(u[2]) && (r = RegExp('</' + u[2], 'g')), (c = m))
                            : void 0 !== u[3] && (c = m)
                    : c === m
                      ? '>' === u[0]
                          ? ((c = r ?? f), (d = -1))
                          : void 0 === u[1]
                            ? (d = -2)
                            : ((d = c.lastIndex - u[2].length),
                              (a = u[1]),
                              (c = void 0 === u[3] ? m : '"' === u[3] ? g : p))
                      : c === g || c === p
                        ? (c = m)
                        : c === v || c === _
                          ? (c = f)
                          : ((c = m), (r = void 0)));
        const x = c === m && t[i + 1].startsWith('/>') ? ' ' : '';
        l +=
            c === f
                ? s + n
                : d >= 0
                  ? (o.push(a), s.slice(0, d) + e$2 + s.slice(d) + h + x)
                  : s + h + (-2 === d ? i : x);
    }
    return [P(t, l + (t[s] || '<?>') + (2 === i ? '</svg>' : 3 === i ? '</math>' : '')), o];
};
class N {
    constructor({strings: t, _$litType$: s}, n) {
        let r;
        this.parts = [];
        let c = 0,
            a = 0;
        const u = t.length - 1,
            d = this.parts,
            [f, v] = V(t, s);
        if (
            ((this.el = N.createElement(f, n)),
            (C.currentNode = this.el.content),
            2 === s || 3 === s)
        ) {
            const t = this.el.content.firstChild;
            t.replaceWith(...t.childNodes);
        }
        for (; null !== (r = C.nextNode()) && d.length < u; ) {
            if (1 === r.nodeType) {
                if (r.hasAttributes())
                    for (const t of r.getAttributeNames())
                        if (t.endsWith(e$2)) {
                            const i = v[a++],
                                s = r.getAttribute(t).split(h),
                                e = /([.?@])?(.*)/.exec(i);
                            (d.push({
                                type: 1,
                                index: c,
                                name: e[2],
                                strings: s,
                                ctor: '.' === e[1] ? H : '?' === e[1] ? I : '@' === e[1] ? L : k,
                            }),
                                r.removeAttribute(t));
                        } else
                            t.startsWith(h) && (d.push({type: 6, index: c}), r.removeAttribute(t));
                if ($.test(r.tagName)) {
                    const t = r.textContent.split(h),
                        s = t.length - 1;
                    if (s > 0) {
                        r.textContent = i$2 ? i$2.emptyScript : '';
                        for (let i = 0; i < s; i++)
                            (r.append(t[i], l()), C.nextNode(), d.push({type: 2, index: ++c}));
                        r.append(t[s], l());
                    }
                }
            } else if (8 === r.nodeType)
                if (r.data === o$3) d.push({type: 2, index: c});
                else {
                    let t = -1;
                    for (; -1 !== (t = r.data.indexOf(h, t + 1)); )
                        (d.push({type: 7, index: c}), (t += h.length - 1));
                }
            c++;
        }
    }
    static createElement(t, i) {
        const s = r.createElement('template');
        return ((s.innerHTML = t), s);
    }
}
function S(t, i, s = t, e) {
    if (i === T) return i;
    let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
    const o = c(i) ? void 0 : i._$litDirective$;
    return (
        h?.constructor !== o &&
            (h?._$AO?.(false),
            void 0 === o ? (h = void 0) : ((h = new o(t)), h._$AT(t, s, e)),
            void 0 !== e ? ((s._$Co ??= [])[e] = h) : (s._$Cl = h)),
        void 0 !== h && (i = S(t, h._$AS(t, i.values), h, e)),
        i
    );
}
class M {
    constructor(t, i) {
        ((this._$AV = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = i));
    }
    get parentNode() {
        return this._$AM.parentNode;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    u(t) {
        const {
                el: {content: i},
                parts: s,
            } = this._$AD,
            e = (t?.creationScope ?? r).importNode(i, true);
        C.currentNode = e;
        let h = C.nextNode(),
            o = 0,
            n = 0,
            l = s[0];
        for (; void 0 !== l; ) {
            if (o === l.index) {
                let i;
                (2 === l.type
                    ? (i = new R(h, h.nextSibling, this, t))
                    : 1 === l.type
                      ? (i = new l.ctor(h, l.name, l.strings, this, t))
                      : 6 === l.type && (i = new z(h, this, t)),
                    this._$AV.push(i),
                    (l = s[++n]));
            }
            o !== l?.index && ((h = C.nextNode()), o++);
        }
        return ((C.currentNode = r), e);
    }
    p(t) {
        let i = 0;
        for (const s of this._$AV)
            (void 0 !== s &&
                (void 0 !== s.strings
                    ? (s._$AI(t, s, i), (i += s.strings.length - 2))
                    : s._$AI(t[i])),
                i++);
    }
}
class R {
    get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, i, s, e) {
        ((this.type = 2),
            (this._$AH = E),
            (this._$AN = void 0),
            (this._$AA = t),
            (this._$AB = i),
            (this._$AM = s),
            (this.options = e),
            (this._$Cv = e?.isConnected ?? true));
    }
    get parentNode() {
        let t = this._$AA.parentNode;
        const i = this._$AM;
        return (void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t);
    }
    get startNode() {
        return this._$AA;
    }
    get endNode() {
        return this._$AB;
    }
    _$AI(t, i = this) {
        ((t = S(this, t, i)),
            c(t)
                ? t === E || null == t || '' === t
                    ? (this._$AH !== E && this._$AR(), (this._$AH = E))
                    : t !== this._$AH && t !== T && this._(t)
                : void 0 !== t._$litType$
                  ? this.$(t)
                  : void 0 !== t.nodeType
                    ? this.T(t)
                    : u(t)
                      ? this.k(t)
                      : this._(t));
    }
    O(t) {
        return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
        this._$AH !== t && (this._$AR(), (this._$AH = this.O(t)));
    }
    _(t) {
        (this._$AH !== E && c(this._$AH)
            ? (this._$AA.nextSibling.data = t)
            : this.T(r.createTextNode(t)),
            (this._$AH = t));
    }
    $(t) {
        const {values: i, _$litType$: s} = t,
            e =
                'number' == typeof s
                    ? this._$AC(t)
                    : (void 0 === s.el && (s.el = N.createElement(P(s.h, s.h[0]), this.options)),
                      s);
        if (this._$AH?._$AD === e) this._$AH.p(i);
        else {
            const t = new M(e, this),
                s = t.u(this.options);
            (t.p(i), this.T(s), (this._$AH = t));
        }
    }
    _$AC(t) {
        let i = A.get(t.strings);
        return (void 0 === i && A.set(t.strings, (i = new N(t))), i);
    }
    k(t) {
        a(this._$AH) || ((this._$AH = []), this._$AR());
        const i = this._$AH;
        let s,
            e = 0;
        for (const h of t)
            (e === i.length
                ? i.push((s = new R(this.O(l()), this.O(l()), this, this.options)))
                : (s = i[e]),
                s._$AI(h),
                e++);
        e < i.length && (this._$AR(s && s._$AB.nextSibling, e), (i.length = e));
    }
    _$AR(t = this._$AA.nextSibling, i) {
        for (this._$AP?.(false, true, i); t && t !== this._$AB; ) {
            const i = t.nextSibling;
            (t.remove(), (t = i));
        }
    }
    setConnected(t) {
        void 0 === this._$AM && ((this._$Cv = t), this._$AP?.(t));
    }
}
class k {
    get tagName() {
        return this.element.tagName;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    constructor(t, i, s, e, h) {
        ((this.type = 1),
            (this._$AH = E),
            (this._$AN = void 0),
            (this.element = t),
            (this.name = i),
            (this._$AM = e),
            (this.options = h),
            s.length > 2 || '' !== s[0] || '' !== s[1]
                ? ((this._$AH = Array(s.length - 1).fill(new String())), (this.strings = s))
                : (this._$AH = E));
    }
    _$AI(t, i = this, s, e) {
        const h = this.strings;
        let o = false;
        if (void 0 === h)
            ((t = S(this, t, i, 0)),
                (o = !c(t) || (t !== this._$AH && t !== T)),
                o && (this._$AH = t));
        else {
            const e = t;
            let n, r;
            for (t = h[0], n = 0; n < h.length - 1; n++)
                ((r = S(this, e[s + n], i, n)),
                    r === T && (r = this._$AH[n]),
                    (o ||= !c(r) || r !== this._$AH[n]),
                    r === E ? (t = E) : t !== E && (t += (r ?? '') + h[n + 1]),
                    (this._$AH[n] = r));
        }
        o && !e && this.j(t);
    }
    j(t) {
        t === E
            ? this.element.removeAttribute(this.name)
            : this.element.setAttribute(this.name, t ?? '');
    }
}
class H extends k {
    constructor() {
        (super(...arguments), (this.type = 3));
    }
    j(t) {
        this.element[this.name] = t === E ? void 0 : t;
    }
}
class I extends k {
    constructor() {
        (super(...arguments), (this.type = 4));
    }
    j(t) {
        this.element.toggleAttribute(this.name, !!t && t !== E);
    }
}
class L extends k {
    constructor(t, i, s, e, h) {
        (super(t, i, s, e, h), (this.type = 5));
    }
    _$AI(t, i = this) {
        if ((t = S(this, t, i, 0) ?? E) === T) return;
        const s = this._$AH,
            e =
                (t === E && s !== E) ||
                t.capture !== s.capture ||
                t.once !== s.once ||
                t.passive !== s.passive,
            h = t !== E && (s === E || e);
        (e && this.element.removeEventListener(this.name, this, s),
            h && this.element.addEventListener(this.name, this, t),
            (this._$AH = t));
    }
    handleEvent(t) {
        'function' == typeof this._$AH
            ? this._$AH.call(this.options?.host ?? this.element, t)
            : this._$AH.handleEvent(t);
    }
}
class z {
    constructor(t, i, s) {
        ((this.element = t),
            (this.type = 6),
            (this._$AN = void 0),
            (this._$AM = i),
            (this.options = s));
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t) {
        S(this, t);
    }
}
const j = t$1.litHtmlPolyfillSupport;
(j?.(N, R), (t$1.litHtmlVersions ??= []).push('3.3.0'));
const B = (t, i, s) => {
    const e = s?.renderBefore ?? i;
    let h = e._$litPart$;
    if (void 0 === h) {
        const t = s?.renderBefore ?? null;
        e._$litPart$ = h = new R(i.insertBefore(l(), t), t, void 0, s ?? {});
    }
    return (h._$AI(t), h);
};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const s = globalThis;
let i$1 = class i extends y$1 {
    constructor() {
        (super(...arguments), (this.renderOptions = {host: this}), (this._$Do = void 0));
    }
    createRenderRoot() {
        const t = super.createRenderRoot();
        return ((this.renderOptions.renderBefore ??= t.firstChild), t);
    }
    update(t) {
        const r = this.render();
        (this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
            super.update(t),
            (this._$Do = B(r, this.renderRoot, this.renderOptions)));
    }
    connectedCallback() {
        (super.connectedCallback(), this._$Do?.setConnected(true));
    }
    disconnectedCallback() {
        (super.disconnectedCallback(), this._$Do?.setConnected(false));
    }
    render() {
        return T;
    }
};
((i$1._$litElement$ = true),
    (i$1['finalized'] = true),
    s.litElementHydrateSupport?.({LitElement: i$1}));
const o$2 = s.litElementPolyfillSupport;
o$2?.({LitElement: i$1});
(s.litElementVersions ??= []).push('4.2.0');

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const o$1 = (o) => o ?? E;

var name = '@dbp-toolkit/common';

function getIconSVGURL(name$1) {
    return getAssetURL(name, 'icons/' + encodeURI(name$1) + '.svg');
}

/**
 * For icon names see https://lineicons.com
 */
class Icon extends i$1 {
    constructor() {
        super();
        this.name = 'bolt';
        this.ariaLabel = undefined;
    }

    static get properties() {
        return {
            name: {type: String},
            ariaLabel: {type: String, attribute: 'aria-label', reflect: true},
        };
    }

    static get styles() {
        // language=css
        return i$4`
            :host {
                display: inline-block;
                height: 1em;
                width: 1em;
                top: 0.125em;
                position: relative;
            }

            #svg {
                height: 100%;
                width: 100%;
                background-repeat: no-repeat;
                background-position: center;
                background-color: currentColor;
                mask-repeat: no-repeat;
                mask-position: center;
                mask-size: 100% 100%;
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-position: center;
                -webkit-mask-size: 100% 100%;
            }
        `;
    }

    render() {
        const iconURL = getIconSVGURL(this.name);
        const iconPart = this.name.trim().split(' ').join('');

        return x`
            <style>
                #svg {
                    -webkit-mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
                    mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
                }
            </style>
            <div
                id="svg"
                aria-label="${o$1(this.ariaLabel ? this.ariaLabel : undefined)}"></div>
        `;
    }
}

class MiniSpinner extends i$1 {
    constructor() {
        super();
        this.text = '';
    }

    static get properties() {
        return {
            text: {type: String},
        };
    }

    static get styles() {
        // language=css
        return i$4`
            .outer {
                display: inline-block;
                vertical-align: sub;
            }
            .inner {
                display: flex;
            }
            .ring {
                display: inline-block;
                position: relative;
                width: 1em;
                height: 1em;
            }
            .ring div {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 100%;
                height: 100%;
                border: 0.2em solid currentColor;
                border-radius: 50%;
                animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: currentColor transparent transparent transparent;
            }
            .ring div:nth-child(1) {
                animation-delay: -0.45s;
            }
            .ring div:nth-child(2) {
                animation-delay: -0.3s;
            }
            .ring div:nth-child(3) {
                animation-delay: -0.15s;
            }
            @keyframes ring {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            .text {
                display: inline-block;
                margin-left: 0.5em;
                font-size: 0.7em;
            }
        `;
    }

    render() {
        const textHtml =
            this.text !== ''
                ? x`
                      <div class="text">${this.text}</div>
                  `
                : x``;

        return x`
            <div class="outer">
                <div class="inner">
                    <div class="ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    ${textHtml}
                </div>
            </div>
        `;
    }
}

const appliedClassMixins = new WeakMap();

/** Vefify if the Mixin was previously applyed
 * @private
 * @param {function} mixin      Mixin being applyed
 * @param {object} superClass   Class receiving the new mixin
 * @returns {boolean}
 */
function wasMixinPreviouslyApplied(mixin, superClass) {
    let klass = superClass;
    while (klass) {
        if (appliedClassMixins.get(klass) === mixin) {
            return true;
        }
        klass = Object.getPrototypeOf(klass);
    }
    return false;
}

/** Apply each mixin in the chain to make sure they are not applied more than once to the final class.
 * @export
 * @param {function} mixin      Mixin to be applyed
 * @returns {object}            Mixed class with mixin applied
 */
function dedupeMixin(mixin) {
    return (superClass) => {
        if (wasMixinPreviouslyApplied(mixin, superClass)) {
            return superClass;
        }
        const mixedClass = mixin(superClass);
        appliedClassMixins.set(mixedClass, mixin);
        return mixedClass;
    };
}

/**
 * @typedef {import('./types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsMap} ScopedElementsMap
 */

const version = '3.0.0';
const versions = window.scopedElementsVersions || (window.scopedElementsVersions = []);
if (!versions.includes(version)) {
    versions.push(version);
}

/**
 * @template {import('./types.js').Constructor<HTMLElement>} T
 * @param {T} superclass
 * @return {T & import('./types.js').Constructor<ScopedElementsHost>}
 */
const ScopedElementsMixinImplementation$2 = (superclass) =>
    /** @type {ScopedElementsHost} */
    class ScopedElementsHost extends superclass {
        /**
         * Obtains the scoped elements definitions map if specified.
         *
         * @type {ScopedElementsMap=}
         */
        static scopedElements;

        static get scopedElementsVersion() {
            return version;
        }

        /** @type {CustomElementRegistry=} */
        static __registry;

        /**
         * Obtains the CustomElementRegistry associated to the ShadowRoot.
         *
         * @returns {CustomElementRegistry=}
         */
        get registry() {
            return /** @type {typeof ScopedElementsHost} */ (this.constructor).__registry;
        }

        /**
         * Set the CustomElementRegistry associated to the ShadowRoot
         *
         * @param {CustomElementRegistry} registry
         */
        set registry(registry) {
            /** @type {typeof ScopedElementsHost} */ (this.constructor).__registry = registry;
        }

        /**
         * @param {ShadowRootInit} options
         * @returns {ShadowRoot}
         */
        attachShadow(options) {
            const {scopedElements} = /** @type {typeof ScopedElementsHost} */ (this.constructor);

            const shouldCreateRegistry =
                !this.registry ||
                // @ts-ignore
                (this.registry === this.constructor.__registry &&
                    !Object.prototype.hasOwnProperty.call(this.constructor, '__registry'));

            /**
             * Create a new registry if:
             * - the registry is not defined
             * - this class doesn't have its own registry *AND* has no shared registry
             * This is important specifically for superclasses/inheritance
             */
            if (shouldCreateRegistry) {
                this.registry = new CustomElementRegistry();
                for (const [tagName, klass] of Object.entries(scopedElements ?? {})) {
                    this.registry.define(tagName, klass);
                }
            }

            return super.attachShadow({
                ...options,
                // The polyfill currently expects the registry to be passed as `customElements`
                customElements: this.registry,
                // But the proposal has moved forward, and renamed it to `registry`
                // For backwards compatibility, we pass it as both
                registry: this.registry,
            });
        }
    };

const ScopedElementsMixin$2 = dedupeMixin(ScopedElementsMixinImplementation$2);

/**
 * @typedef {import('./types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {typeof import('lit').LitElement} TypeofLitElement
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<LitElement>} LitElementConstructor
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<ScopedElementsHost>} ScopedElementsHostConstructor
 */

/**
 * @template {LitElementConstructor} T
 * @param {T} superclass
 * @return {T & ScopedElementsHostConstructor}
 */
const ScopedElementsMixinImplementation$1 = (superclass) =>
    /** @type {ScopedElementsHost} */
    class ScopedElementsHost extends ScopedElementsMixin$2(superclass) {
        createRenderRoot() {
            const {shadowRootOptions, elementStyles} = /** @type {TypeofLitElement} */ (
                this.constructor
            );

            const shadowRoot = this.attachShadow(shadowRootOptions);
            // @ts-ignore
            this.renderOptions.creationScope = shadowRoot;

            S$1(shadowRoot, elementStyles);

            this.renderOptions.renderBefore ??= shadowRoot.firstChild;

            return shadowRoot;
        }
    };

const ScopedElementsMixin$1 = dedupeMixin(ScopedElementsMixinImplementation$1);

/**
 * @typedef {import('../../form-core/types/validate/ValidateMixinTypes.js').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<ScopedElementsHost>} ScopedElementsHostConstructor
 * @typedef {import('@open-wc/scoped-elements/lit-element.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsHostV2Constructor} ScopedElementsHostV2Constructor
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<LitElement>} LitElementConstructor
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 * @typedef {typeof import('lit').LitElement} TypeofLitElement
 * @typedef {import('lit').LitElement} LitElement
 */

function supportsScopedRegistry() {
    return Boolean(
        // @ts-expect-error
        globalThis.ShadowRoot?.prototype.createElement &&
            globalThis.ShadowRoot?.prototype.importNode,
    );
}

/**
 * This file is a combination of '@open-wc/scoped-elements@v3/lit-element.js' and '@open-wc/scoped-elements@v3/html-element.js'.
 * To make the polyfill an opt-in, some code from '@open-wc/scoped-elements@v2' is added as well.
 * This can be a great help for ssr scenarios, allowing elements to be consumed without needing knowledge about internal
 * consumption.
 * (N.B. at this point in time, this is limited to the scenario where there's one version of lion on the page).
 *
 * ## Considerations
 * In its current state, the [scoped-custom-element-registry](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry) draft spec has uncertainties:
 * - the spec is not yet final; it's not clear how long it will be dependent on a polyfill
 * - the polyfill conflicts with new browser functionality (form-associated custom elements in Safari, ShadowRoot.createElement in Chrome Canary, etc.).
 * - the spsc is not compatible with SSR and it remains unclear if it will be in the future
 *
 * Also see: https://github.com/webcomponents/polyfills/issues?q=scoped-custom-element-registry
 *
 * In previous considerations (last year), we betted on the spec to evolve quickly and the polyfill to be stable.
 * Till this day, little progress has been made. In the meantime. @lit-labs/ssr (incompatible with the spec) is released as well.
 *
 * This file aims to achieve two things:
 * = being up to date with the latest version of @open-wc/scoped-elements (v3)
 * - make the impact of this change for lion as minimal as possible
 *
 * In order to achieve the latter, we keep the ability to opt out of the polyfill.
 * This can be beneficial for performance, bundle size, ease of use and SSR capabilities.
 *
 * We will keep a close eye on developments in spec and polyfill, and will re-evaluate the scoped-elements approach when the time is right.
 *
 * @template {LitElementConstructor} T
 * @param {T} superclass
 * @return {T & ScopedElementsHostConstructor & ScopedElementsHostV2Constructor}
 */
const ScopedElementsMixinImplementation = (superclass) =>
    /** @type {ScopedElementsHost} */
    class ScopedElementsHost extends ScopedElementsMixin$1(superclass) {
        constructor() {
            super();
        }

        createScopedElement(/** @type {string} */ tagName) {
            const root = supportsScopedRegistry() ? this.shadowRoot : document;
            // @ts-expect-error polyfill to support createElement on shadowRoot is loaded
            return root.createElement(tagName);
        }

        /**
         * Defines a scoped element.
         *
         * @param {string} tagName
         * @param {typeof HTMLElement} classToBeRegistered
         */
        defineScopedElement(tagName, classToBeRegistered) {
            const registeredClass = this.registry.get(tagName);
            const isNewClassWithSameName =
                registeredClass && registeredClass !== classToBeRegistered;
            if (!supportsScopedRegistry() && isNewClassWithSameName) {
                // eslint-disable-next-line no-console
                console.error(
                    [
                        `You are trying to re-register the "${tagName}" custom element with a different class via ScopedElementsMixin.`,
                        'This is only possible with a CustomElementRegistry.',
                        'Your browser does not support this feature so you will need to load a polyfill for it.',
                        'Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.',
                        'e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>" as your first script tag.',
                        'For more details you can visit https://open-wc.org/docs/development/scoped-elements/',
                    ].join('\n'),
                );
            }
            if (!registeredClass) {
                return this.registry.define(tagName, classToBeRegistered);
            }
            return this.registry.get(tagName);
        }

        /**
         * @param {ShadowRootInit} options
         * @returns {ShadowRoot}
         */
        attachShadow(options) {
            // @ts-expect-error
            const {scopedElements} = /** @type {typeof ScopedElementsHost} */ (this.constructor);

            const shouldCreateRegistry =
                !this.registry ||
                // @ts-expect-error
                (this.registry === this.constructor.__registry &&
                    !Object.prototype.hasOwnProperty.call(this.constructor, '__registry'));

            /**
             * Create a new registry if:
             * - the registry is not defined
             * - this class doesn't have its own registry *AND* has no shared registry
             * This is important specifically for superclasses/inheritance
             */
            if (shouldCreateRegistry) {
                this.registry = supportsScopedRegistry()
                    ? new CustomElementRegistry()
                    : customElements;
                for (const [tagName, klass] of Object.entries(scopedElements ?? {})) {
                    this.defineScopedElement(tagName, klass);
                }
            }

            return Element.prototype.attachShadow.call(this, {
                ...options,
                // The polyfill currently expects the registry to be passed as `customElements`
                customElements: this.registry,
                // But the proposal has moved forward, and renamed it to `registry`
                // For backwards compatibility, we pass it as both
                registry: this.registry,
            });
        }

        createRenderRoot() {
            const {shadowRootOptions, elementStyles} = /** @type {TypeofLitElement} */ (
                this.constructor
            );

            const createdRoot = this.attachShadow(shadowRootOptions);
            if (supportsScopedRegistry()) {
                // @ts-expect-error
                this.renderOptions.creationScope = createdRoot;
            }

            if (createdRoot instanceof ShadowRoot) {
                S$1(createdRoot, elementStyles);
                this.renderOptions.renderBefore =
                    this.renderOptions.renderBefore || createdRoot.firstChild;
            }

            return createdRoot;
        }
    };

const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);

/**
 * We want to have "neutral" colors here
 *
 * @returns {CSSResult}
 */
function getThemeCSS() {
    // language=css
    return i$4`
        :host {
            /* new new variables */
            --dbp-background: var(--dbp-override-background, #ffffff);
            --dbp-content: var(--dbp-override-content, #222120);
            --dbp-content-surface: var(--dbp-override-content-surface, var(--dbp-content));
            --dbp-on-content-surface: var(--dbp-override-on-content-surface, var(--dbp-background));
            --dbp-border: var(--dbp-override-border, 1px solid #222120);
            --dbp-border-radius: var(--dbp-override-border-radius, 0px);
            --dbp-primary: var(--dbp-override-primary, #3775c1);
            --dbp-primary-surface: var(--dbp-override-primary-surface, var(--dbp-primary));
            --dbp-on-primary-surface: var(
                --dbp-override-on-primary-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-primary-surface-border-color: var(
                --dbp-override-primary-surface-border-color,
                var(--dbp-primary)
            );
            --dbp-secondary: var(--dbp-override-secondary, #222120);
            --dbp-secondary-surface: var(--dbp-override-secondary-surface, var(--dbp-secondary));
            --dbp-on-secondary-surface: var(
                --dbp-override-on-secondary-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-secondary-surface-border-color: var(
                --dbp-override-secondary-surface-border-color,
                var(--dbp-secondary)
            );
            --dbp-muted: var(--dbp-override-muted, #767676);
            --dbp-muted-surface: var(--dbp-override-muted-surface, var(--dbp-muted));
            --dbp-on-muted-surface: var(
                --dbp-override-on-muted-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-muted-surface-border-color: var(
                --dbp-override-muted-surface-border-color,
                var(--dbp-muted)
            );
            --dbp-accent: var(--dbp-override-accent, #9e1e4d);
            --dbp-accent-surface: var(--dbp-override-accent-surface, var(--dbp-accent));
            --dbp-on-accent-surface: var(
                --dbp-override-on-accent-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-accent-surface-border-color: var(
                --dbp-override-accent-surface-border-color,
                var(--dbp-accent)
            );
            --dbp-info: var(--dbp-override-info, #38808a);
            --dbp-info-surface: var(--dbp-override-info-surface, var(--dbp-info));
            --dbp-on-info-surface: var(
                --dbp-override-on-info-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-info-surface-border-color: var(
                --dbp-override-info-surface-border-color,
                var(--dbp-info)
            );
            --dbp-success: var(--dbp-override-success, #338555);
            --dbp-success-surface: var(--dbp-override-success-surface, var(--dbp-success));
            --dbp-on-success-surface: var(
                --dbp-override-on-success-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-success-surface-border-color: var(
                --dbp-override-success-surface-border-color,
                var(--dbp-success)
            );
            --dbp-warning: var(--dbp-override-warning, #bf8808);
            --dbp-warning-surface: var(--dbp-override-warning-surface, var(--dbp-warning));
            --dbp-on-warning-surface: var(
                --dbp-override-on-warning-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-warning-surface-border-color: var(
                --dbp-override-warning-surface-border-color,
                var(--dbp-warning)
            );
            --dbp-danger: var(--dbp-override-danger, #cc3232);
            --dbp-danger-surface: var(--dbp-override-danger-surface, var(--dbp-danger));
            --dbp-on-danger-surface: var(
                --dbp-override-on-danger-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-danger-surface-border-color: var(
                --dbp-override-danger-surface-border-color,
                var(--dbp-danger)
            );
            --dbp-hover-background-color: var(--dbp-override-hover-background-color);
            --dbp-hover-color: var(--dbp-override-hover-color);
        }

        #root {
            background-color: var(--dbp-background);
            color: var(--dbp-content);
        }

        ::-moz-selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }

        ::selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }
    `;
}

function getGeneralCSS(doMarginPaddingReset = true) {
    // language=css
    const marginPaddingResetCss = doMarginPaddingReset
        ? i$4`
              blockquote,
              body,
              dd,
              dl,
              dt,
              fieldset,
              figure,
              h1,
              h2,
              h3,
              h4,
              h5,
              h6,
              hr,
              html,
              iframe,
              legend,
              li,
              ol,
              p,
              pre,
              textarea,
              ul {
                  margin: 0;
                  padding: 0;
              }
          `
        : i$4``;

    // language=css
    return i$4`
        h2 {
            font-weight: 300;
        }

        h3 {
            font-weight: 300;
            margin-top: 0px;
            margin-bottom: 0.75rem;
        }

        .field:not(:last-child) {
            margin-bottom: 0.75rem;
        }

        .field.has-addons {
            display: flex;
            justify-content: flex-start;
        }

        .input,
        .textarea,
        .select select {
            border: solid 1px var(--dbp-muted);
            border-radius: var(--dbp-border-radius);
            padding-bottom: calc(0.375em - 1px);
            padding-left: calc(0.625em - 1px);
            padding-right: calc(0.625em - 1px);
            padding-top: calc(0.375em - 1px);
        }

        .input::placeholder,
        .textarea::placeholder,
        .select select::placeholder {
            color: var(--dbp-muted);
        }

        input,
        ::placeholder,
        textarea,
        select,
        .select select {
            font-size: inherit;
            font-family: inherit;
        }

        input::-moz-focus-inner {
            border: 0;
        }

        :focus-visible {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 3px 1px var(--dbp-primary);
        }

        .control {
            box-sizing: border-box;
            clear: both;
            font-size: 1rem;
            position: relative;
            text-align: left;
        }

        .label {
            margin-bottom: 0.5em;
            display: block;
            font-weight: 600;
        }

        .hidden {
            display: none;
        }

        a {
            color: var(--dbp-content);
            cursor: pointer;
            text-decoration: none;
        }

        a.is-download {
            border-bottom: var(--dbp-border);
            transition:
                background-color 0.15s,
                color 0.15s;
        }

        a.is-download:hover {
            color: var(--dbp-hover-color, var(--dbp-content));
            background-color: var(--dbp-hover-background-color);
        }

        .title {
            color: var(--dbp-content);
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.125;
        }

        ${marginPaddingResetCss}.int-link-internal

        .button[disabled], .file-cta[disabled], .file-name[disabled], .input[disabled], .pagination-ellipsis[disabled],
        .pagination-link[disabled], .pagination-next[disabled], .pagination-previous[disabled], .select fieldset[disabled] select,
        .select select[disabled], .textarea[disabled], fieldset[disabled] .button, fieldset[disabled] .file-cta,
        fieldset[disabled] .file-name, fieldset[disabled] .input, fieldset[disabled] .pagination-ellipsis,
        fieldset[disabled] .pagination-link, fieldset[disabled] .pagination-next, fieldset[disabled] .pagination-previous,
        fieldset[disabled] .select select, fieldset[disabled] .textarea {
            cursor: not-allowed;
        }

        .input,
        .select select,
        .textarea {
            background-color: var(--dbp-background);
            border-color: var(--dbp-muted);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-content);
        }

        .input[disabled] {
            color: var(--dbp-muted);
        }

        *,
        ::after,
        ::before {
            box-sizing: inherit;
        }

        select:not(.select),
        .dropdown-menu {
            -moz-appearance: none;
            -webkit-appearance: none;
            background-color: var(--dbp-background);
            background: calc(100% - 0.4rem) center no-repeat
                url('${r$2(getIconSVGURL('chevron-down'))}');
            background-size: 25%;
            border: var(--dbp-border);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-content);
            padding: 0.14rem 1rem 0.14rem 0.14rem;
        }

        ::-moz-selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }

        ::selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }
    `;
}

function getButtonCSS() {
    // language=css
    return i$4`
        button.button,
        .button,
        button.dt-button {
            border: var(--dbp-border);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-content);
            cursor: pointer;
            justify-content: center;
            padding-bottom: calc(0.375em - 1px);
            padding-left: 0.75em;
            padding-right: 0.75em;
            padding-top: calc(0.375em - 1px);
            text-align: center;
            white-space: nowrap;
            font-size: inherit;
            font-weight: bolder;
            font-family: inherit;
            transition:
                all 0.15s ease 0s,
                color 0.15s ease 0s;
            background: var(--dbp-secondary-surface);
            color: var(--dbp-on-secondary-surface);
            border-color: var(--dbp-secondary-surface-border-color);
        }

        button.button:hover:enabled,
        .button:hover:enabled,
        button.dt-button:hover:enabled,
        button.dt-button:hover:not(.disabled) {
            color: var(--dbp-hover-color, var(--dbp-on-secondary-surface));
            background-color: var(--dbp-hover-background-color, var(--dbp-secondary-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-secondary-surface-border-color)
            );
        }

        button.button.is-small,
        .button.is-small {
            border-radius: calc(var(--dbp-border-radius) / 2);
            font-size: 0.75rem;
        }

        button.button.is-icon,
        .button.is-icon {
            border: none;
            background: none;
            padding: 0px;
            width: var(--dbp-button-size, 40px);
            height: var(--dbp-button-size, 40px);
            display: flex;
            justify-content: center;
            align-items: center;
            color: currentColor;
        }

        button.button.is-icon dbp-icon,
        .button.is-icon dbp-icon,
        dbp-button-icon {
            top: 0px;
            font-size: 1.2em;
        }

        button.button.is-icon:hover:enabled,
        .button.is-icon:hover:enabled {
            background-color: var(--dbp-hover-background-color, unset);
            color: var(--dbp-hover-color, currentColor);
            border: 0 none;
        }

        button.button.is-primary,
        .button.is-primary {
            background-color: var(--dbp-primary-surface);
            border-color: var(--dbp-primary-surface-border-color);
            color: var(--dbp-on-primary-surface);
        }

        button.button.is-primary:hover:enabled,
        .button.is-primary:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-primary-surface));
            color: var(--dbp-hover-color, var(--dbp-on-primary-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-primary-surface-border-color)
            );
        }

        button.button.is-secondary,
        .button.is-secondary {
            background-color: var(--dbp-secondary-surface);
            color: var(--dbp-on-secondary-surface);
            border-color: var(--dbp-secondary-surface-border-color);
        }

        button.button.is-secondary:hover:enabled,
        .button.is-secondary:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-secondary-surface));
            color: var(--dbp-hover-color, var(--dbp-on-secondary-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-secondary-surface-border-color)
            );
        }

        button.button.is-info,
        .button.is-info {
            background-color: var(--dbp-info-surface);
            color: var(--dbp-on-info-surface);
            border-color: var(--dbp-info-surface-border-color);
        }

        button.button.is-info:hover:enabled,
        .button.is-info:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-info-surface));
            color: var(--dbp-hover-color, var(--dbp-on-info-surface));
            border-color: var(--dbp-hover-background-color, var(--dbp-info-surface-border-color));
        }

        button.button.is-success,
        .button.is-success {
            background-color: var(--dbp-success-surface);
            border-color: var(--dbp-success-surface-border-color);
            color: var(--dbp-on-success-surface);
        }

        button.button.is-success:hover:enabled,
        .button.is-success:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-success-surface));
            color: var(--dbp-hover-color, var(--dbp-on-success-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-success-surface-border-color)
            );
        }

        button.button.is-warning,
        .button.is-warning {
            background-color: var(--dbp-warning-surface);
            border-color: var(--dbp-warning-surface-border-color);
            color: var(--dbp-on-warning-surface);
        }

        button.button.is-warning:hover:enabled,
        .button.is-warning:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-warning-surface));
            color: var(--dbp-hover-color, var(--dbp-on-warning-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-warning-surface-border-color)
            );
        }

        .button.button.is-danger,
        .button.is-danger {
            background-color: var(--dbp-danger-surface);
            border-color: var(--dbp-danger-surface-border-color);
            color: var(--dbp-on-danger-surface);
        }

        .button.button.is-danger:hover:enabled,
        .button.is-danger:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-danger-surface));
            color: var(--dbp-hover-color, var(--dbp-on-danger-surface));
            border-color: var(--dbp-hover-background-color, var(--dbp-danger-surface-border-color));
        }

        button.button[disabled],
        .button[disabled],
        fieldset[disabled] .button {
            opacity: 0.4;
            cursor: not-allowed;
        }

        button:focus-visible {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 3px 1px var(--dbp-primary);
        }
    `;
}

function getNativeModalDialogPrintCSS() {
    // language=css
    return i$4`
        @media print {
            dialog[open] {
                display: block !important;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                max-width: 100%;
                max-height: inherit;
                height: auto;
                box-shadow: none;
                border: none;
                background: white;
                filter: none;
            }

            .modal-container {
                max-height: inherit;
            }

            .modal-content {
                overflow-y: visible;
            }
        }
    `;
}

function getNativeModalDialogCSS() {
    // language=css
    return i$4`
        :host {
            font-size: var(--dbp-modal--font-size, 1rem);
            --dbp-modal-animation: mmFadeIn;
            --dbp-modal-title-font-size: 1rem;
            --dbp-modal-title-font-weight: 300;
            --dbp-modal-content-overflow-y: auto;
        }

        dialog:not([open]) {
            pointer-events: none;
            opacity: 0;
        }

        dialog[open] {
            animation-name: var(--dbp-modal-animation);
            animation-duration: 0.5s;
            animation-fill-mode: forwards;
        }

        dialog {
            min-width: var(--dbp-modal-min-width, 320px);
            max-width: var(--dbp-modal-max-width, 75vw);
            min-height: var(--dbp-modal-min-height, 200px);
            max-height: var(--dbp-modal-max-height, 90vh);
            width: var(--dbp-modal-width);

            overflow: hidden;
            padding: var(--dbp-modal-padding-top, 15px) 20px 20px;
            border: 0 none;
            color: var(--dbp-content);
            background-color: var(--dbp-background);
            filter: drop-shadow(rgba(0, 0, 0, 0.3) 2px 4px 8px)
                drop-shadow(rgba(0, 0, 0, 0.2) 4px 8px 16px)
                drop-shadow(rgba(0, 0, 0, 0.1) 8px 16px 32px);

            transition: height 5s ease-in-out;
            transform: translateY(var(--dbp-modal-translate-y, 0));
        }

        .modal-container {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
            align-items: start;
            min-height: var(--dbp-modal-min-height);
            max-height: var(--dbp-modal-max-height, 90vh);
        }

        .modal-header {
            height: var(--dbp-modal-header-height);
        }

        .modal-content {
            position: relative;
            overflow-y: var(--dbp-modal-content-overflow-y);
            max-height: 100%;
            min-height: 100%;
            height: 100%;
        }

        .modal-footer {
            height: var(--dbp-modal-footer-height);
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
            margin-bottom: 1em;
        }

        .modal-close {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            color: var(--dbp-accent);
            cursor: pointer;
            padding: 0px;
        }

        .modal-close .close-icon svg,
        .modal-close .close-icon {
            pointer-events: none;
        }

        button.modal-close:focus {
            filter: drop-shadow(rgba(255, 255, 255, 0.5), 1px 2px 4px);
        }

        .modal-title {
            margin: 0;
            padding: var(--dbp-modal-title-padding, 0.25em 0 0 0);
            font-weight: var(--dbp-modal-title-font-weight, 300);
            font-size: var(--dbp-modal-title-font-size, 1rem);
            background: var(--dbp-modal-title-background);
        }

        ::slotted([slot='header']) {
        }

        ::slotted([slot='footer']) {
        }

        ::backdrop {
            backdrop-filter: blur(5px);
            transition: backdrop-filter 0.5s ease;
            background: color-mix(in srgb, var(--dbp-background-color) 60%, transparent);
        }

        dialog + .backdrop {
            /* polyfill */
            backdrop-filter: blur(5px);
            transition: backdrop-filter 0.5s ease;
            background: color-mix(in srgb, var(--dbp-background-color) 60%, transparent);
        }

        @media only screen and (max-width: 490px) {
            dialog {
                max-width: none;
            }
        }

        /**************************\\
          Modal Animation Style
        \\**************************/
        @keyframes mmFadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes mmFadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }

        @keyframes mmSlideIn {
            from {
                transform: translateY(15%);
            }
            to {
                transform: translateY(0);
            }
        }

        @keyframes mmSlideOut {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(-10%);
            }
        }
    `;
}

class DbpButton extends ScopedElementsMixin(i$1) {
    constructor() {
        super();
        this.value = '';
        this.type = '';
        this.loading = false;
        this.disabled = false;

        // https://bugs.chromium.org/p/chromium/issues/detail?id=1061240#c12
        this.addEventListener('click', (e) => {
            if (this.disabled) {
                e.stopImmediatePropagation();
            }
        });
    }

    static get scopedElements() {
        return {
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    static get properties() {
        return {
            // value is deprecated, use the main slot instead
            value: {type: String},
            type: {type: String},
            loading: {type: Boolean},
            disabled: {type: Boolean, reflect: true},
        };
    }

    start() {
        this.loading = true;
        this.disabled = true;
    }

    stop() {
        this.loading = false;
        this.disabled = false;
    }

    isDisabled() {
        return this.disabled;
    }
}

class IconButton extends ScopedElementsMixin(i$1) {
    constructor() {
        super();
        this.iconName = '';
        this.disabled = false;
        this.loading = false;
        this.ariaLabel = undefined;
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    static get properties() {
        return {
            ...super.properties,
            iconName: {type: String, attribute: 'icon-name'},
            ariaLabel: {type: String, attribute: 'aria-label', reflect: true},
            disabled: {type: Boolean, reflect: true},
            loading: {type: Boolean},
        };
    }

    start() {
        this.loading = true;
        this.disabled = true;
    }

    stop() {
        this.loading = false;
        this.disabled = false;
    }

    static get styles() {
        // language=css
        return i$4`
            ${getThemeCSS()}
            ${getButtonCSS()}

            :host {
                display: inline-block;
                font-size: 1.2rem;
            }

            .spinner {
                padding-left: 0.5em;
                min-width: 16px;
            }

            .loading-container {
                display: flex;
                align-items: baseline;
            }

            .label {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .button {
                width: 100%;
            }

            ::slotted(dbp-icon) {
                transition: transform 0.25s ease-in-out;
            }

            button:hover ::slotted(dbp-icon) {
                transform: var(--icon-transform);
            }

            @media only screen and (orientation: portrait) and (max-width: 768px) {
                .button {
                    min-height: 36px;
                }

                .label {
                    margin: auto;
                }
            }
        `;
    }

    render() {
        return x`
            <button
                class="button is-icon loading-container ${!this.loading ? 'is-not-loading' : ''}"
                ?disabled="${this.disabled}"
                aria-label="${o$1(this.ariaLabel ? this.ariaLabel : undefined)}">
                <slot>
                    <dbp-icon
                        class="dbp-button-icon"
                        name="${this.iconName}"
                        aria-hidden="true"
                        style="display: ${this.loading ? 'none' : 'inline'}"></dbp-icon>
                </slot>
                <dbp-mini-spinner
                    class="spinner"
                    aria-hidden="true"
                    style="display: ${this.loading ? 'inline' : 'none'}"></dbp-mini-spinner>
            </button>
        `;
    }
}

class LoggerType {
    get debug() {
        if (window.location.hash.includes('debug')) {
            return console.debug;
        } else {
            return () => {};
        }
    }
}

const Logger$1 = new LoggerType();

class AdapterLitElement extends i$1 {
    constructor() {
        super();
        this._connected = false;
        this._deferSubscribe = false;
        this._deferUnSubscribe = false;
        // attributes (if they exist) will be updated if a property is changed by "subscribe"
        this.reflectAttribute = true;

        // default values
        this.subscribe = '';
        this.unsubscribe = '';

        this._callbackStore = [];

        // Previously we used direct properties like this["lang"] (instead of this._propertyStore["lang"]) for storing the
        // properties, but the "lang" property seems to be updated before the event from the MutationObserver, so we
        // cannot observe a value change directly (as workaround we use another property (e.g. "langValue") instead of "lang")
        this._propertyStore = {};

        // We need to store our own "last values" because we cannot be sure what the MutationObserver detects
        this._lastProperties = {};

        Logger$1.debug('AdapterLitElement(' + this.tagName + ') constructor()');
    }

    getProperty(name) {
        return this._propertyStore[name];
    }

    getPropertyByAttributeName(name) {
        return this[this.findPropertyName(name)];
    }

    setPropertyByAttributeName(name, value) {
        this[this.findPropertyName(name)] = value;
    }

    setProperty(name, value) {
        // TODO: check if lit attribute really present?
        if (typeof value === 'object' && value !== null) {
            this.setPropertyByAttributeName(name, value);
        } else {
            this.attributeChangedCallback(name, this.getPropertyByAttributeName(name), value);
        }

        this._lastProperties[name] = value;
        this._propertyStore[name] = value;
    }

    hasPropertyChanged(name, value) {
        return this._lastProperties[name] !== value;
    }

    hasProperty(name) {
        // return this.hasAttribute("name")
        return Object.hasOwnProperty.call(this._propertyStore, name);
    }

    connectedCallback() {
        super.connectedCallback();

        if (this._deferUnSubscribe) {
            const attrs = this.unsubscribe.split(',');
            attrs.forEach((element) => this.unSubscribeProviderFor(element));
            this._deferSubscribe = false;
            this.unsubscribe = '';
        }

        if (this._deferSubscribe) {
            const attrs = this.subscribe.split(',');
            attrs.forEach((element) => this.subscribeProviderFor(element));
            this._deferSubscribe = false;
        }

        this._connected = true;

        const that = this;

        this.addEventListener(
            'dbp-subscribe',
            function (e) {
                const name = e.detail.name;
                if (that.hasProperty(name) || that.providerRoot) {
                    Logger$1.debug(
                        'AdapterLitElementProvider(' +
                            that.tagName +
                            ') eventListener("dbp-subscribe",..) name "' +
                            name +
                            '" found.',
                    );
                    that._callbackStore.push({
                        name: name,
                        callback: e.detail.callback,
                        sender: e.detail.sender,
                    });

                    e.detail.callback(that.getProperty(name));
                    e.stopPropagation();
                }
            },
            false,
        );

        this.addEventListener(
            'dbp-unsubscribe',
            function (e) {
                const name = e.detail.name;
                const sender = e.detail.sender;
                if (that.hasProperty(name) || that.providerRoot) {
                    Logger$1.debug(
                        'AdapterLitElementProvider(' +
                            that.tagName +
                            ') eventListener("dbp-unsubscribe",..) name "' +
                            name +
                            '" found.',
                    );
                    that._callbackStore.forEach((item) => {
                        if (item.sender === sender && item.name === name) {
                            const index = that._callbackStore.indexOf(item);
                            that._callbackStore.splice(index, 1);
                            Logger$1.debug(
                                'AdapterLitElementProvider(' +
                                    that.tagName +
                                    ') eventListener for name "' +
                                    name +
                                    '" removed.',
                            );
                        }
                    });

                    e.stopPropagation();
                }
            },
            false,
        );

        // listen to property changes
        this.addEventListener(
            'dbp-set-property',
            function (e) {
                const name = e.detail.name;
                const value = e.detail.value;

                if (that.hasProperty(name) || that.providerRoot) {
                    Logger$1.debug(
                        'AdapterLitElementProvider(' +
                            that.tagName +
                            ') eventListener("dbp-set-property",..) name "' +
                            name +
                            '" found.',
                    );
                    that.setProperty(name, value);

                    that._callbackStore.forEach((item) => {
                        if (item.name === name) {
                            item.callback(value);
                        }
                    });

                    e.stopPropagation();
                }
            },
            false,
        );

        // Options for the observer (which mutations to observe)
        const config = {attributes: true, childList: false, subtree: false};

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    const name = mutation.attributeName;
                    const value = that.getAttribute(name);

                    if (that.hasPropertyChanged(name, value)) {
                        Logger$1.debug(
                            'AdapterLitElementProvider (' +
                                that.tagName +
                                ') observed attribute "' +
                                name +
                                '" changed',
                        );
                        that.setProperty(name, value);

                        that._callbackStore.forEach((item) => {
                            if (item.name === name) {
                                item.callback(value);
                            }
                        });
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(this, config);

        // get all *not observed* attributes
        if (this.hasAttributes()) {
            const attrs = this.attributes;
            for (let i = attrs.length - 1; i >= 0; i--) {
                if (['id', 'class', 'style', 'data-tag-name'].includes(attrs[i].name)) {
                    continue;
                }

                this.setProperty(attrs[i].name, attrs[i].value);
                Logger$1.debug(
                    'AdapterLitElementProvider (' +
                        that.tagName +
                        ') found attribute "' +
                        attrs[i].name +
                        '" = "' +
                        attrs[i].value +
                        '"',
                );
            }
        }
    }

    disconnectedCallback() {
        const attrs = this.subscribe.split(',');
        attrs.forEach((element) => this.unSubscribeProviderFor(element));

        super.disconnectedCallback();
    }

    subscribeProviderFor(element) {
        Logger$1.debug(
            'AdapterLitElement(' + this.tagName + ') subscribeProviderFor( ' + element + ' )',
        );
        const pair = element.trim().split(':');
        const local = pair[0];
        const global = pair[1] || local;
        const that = this;
        const event = new CustomEvent('dbp-subscribe', {
            bubbles: true,
            composed: true,
            detail: {
                name: global,
                callback: (value) => {
                    // Don't send back "undefined" if the attribute wasn't found (for example if the providerRoot
                    // is used and the attribute was subscribed but not set anywhere), because that will be
                    // interpreted as "true" for Boolean lit-element attributes!
                    if (value === undefined) {
                        return;
                    }

                    Logger$1.debug(
                        'AdapterLitElement(' +
                            that.tagName +
                            ') sub/Callback ' +
                            global +
                            ' -> ' +
                            local +
                            ' = ' +
                            value,
                    );

                    // If value is an object set it directly as property
                    if (typeof value === 'object' && value !== null) {
                        that.setPropertyByAttributeName(local, value);
                    } else {
                        that.attributeChangedCallback(
                            local,
                            that.getPropertyByAttributeName(local),
                            value,
                        );

                        // check if an attribute also exists in the tag
                        if (that.getAttribute(local) !== null) {
                            // we don't support attributes and provider values at the same time
                            console.warn(
                                'Provider callback: "' +
                                    local +
                                    '" is also an attribute in tag "' +
                                    that.tagName +
                                    '", this is not supported!',
                            );

                            // update attribute if reflectAttribute is enabled
                            if (that.reflectAttribute) {
                                that.setAttribute(local, value);
                            }
                        }
                    }
                },
                sender: this,
            },
        });
        this.dispatchEvent(event);
    }

    unSubscribeProviderFor(element) {
        Logger$1.debug(
            'AdapterLitElement(' + this.tagName + ') unSubscribeProviderFor( ' + element + ' )',
        );
        const pair = element.trim().split(':');
        const global = pair[1] || pair[0];
        const event = new CustomEvent('dbp-unsubscribe', {
            bubbles: true,
            composed: true,
            detail: {
                name: global,
                sender: this,
            },
        });
        this.dispatchEvent(event);
    }

    static get properties() {
        return {
            ...super.properties,
            subscribe: {type: String},
            unsubscribe: {type: String},
            providerRoot: {type: Boolean, attribute: 'provider-root'},
        };
    }

    findPropertyName(attributeName) {
        let resultName = attributeName;
        const properties = this.constructor.properties;

        for (const propertyName in properties) {
            const attribute = properties[propertyName].attribute;
            if (attribute === attributeName) {
                resultName = propertyName;
                break;
            }
        }

        return resultName;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'subscribe':
                Logger$1.debug(
                    'AdapterLitElement() attributeChangesCallback( ' +
                        name +
                        ', ' +
                        oldValue +
                        ', ' +
                        newValue +
                        ')',
                );

                if (this.subscribe && this.subscribe.length > 0) {
                    if (this._connected) {
                        const attrs = this.subscribe.split(',');
                        attrs.forEach((element) => this.unSubscribeProviderFor(element));
                    } else {
                        this._deferUnSubscribe = this.subscribe.length > 0;
                        this.unsubscribe = this.subscribe;
                    }
                }

                if (newValue !== null) {
                    this.subscribe = newValue;
                    if (this._connected) {
                        const attrs = newValue.split(',');
                        attrs.forEach((element) => this.subscribeProviderFor(element));
                    } else {
                        this._deferSubscribe = newValue && newValue.length > 0;
                    }
                }
                break;
            default:
                // The function should not be called if oldValue is an object, oldValue and newValue are empty
                // or if newValue is empty but name and oldValue are set
                // This should prevent 'Uncaught SyntaxError: JSON.parse unexpected end of data at line 1 column 1 of the JSON data'
                if (
                    (typeof oldValue === 'object' && !oldValue && !newValue) ||
                    (!newValue && oldValue && name)
                ) {
                    break;
                }
                super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    /**
     * Send a dbp-set-property event to the provider components
     *
     * @param name
     * @param value
     * @param sendToSelf Set this to "true" if the event should  be sent to oneself instead of the parent (e.g. in the app shell if there isn't a provider around it)
     * @returns {boolean}
     */
    sendSetPropertyEvent(name, value, sendToSelf = false) {
        const event = new CustomEvent('dbp-set-property', {
            bubbles: true,
            composed: true,
            detail: {name: name, value: value},
        });

        // dispatch the dbp-set-property event to the parent (if there is any) so that the current element
        // doesn't terminate the event if it has the attribute set itself
        const element = this.parentElement && !sendToSelf ? this.parentElement : this;

        return element.dispatchEvent(event);
    }
}

function _parseUrlComponents(url) {
    // Create a URL object to leverage built-in parsing
    const parsedUrl = new URL(url, 'https://example.com');

    return {
        // Pathname (everything before query and hash)
        pathname: parsedUrl.pathname,

        // Path segments (split pathname into individual segments)
        pathSegments: parsedUrl.pathname
            .split('/')
            .filter((segment) => segment !== '')
            .map((segment) => decodeURIComponent(segment)),

        // Query parameters as an object
        queryParams: parsedUrl.searchParams,

        // Raw query string (including the '?')
        queryString: parsedUrl.search,

        // Hash/fragment (including the '#')
        hash: parsedUrl.hash,

        // Hash/fragment without the '#' symbol
        fragment: parsedUrl.hash.replace(/^#/, ''),
    };
}

class DBPLitElement extends AdapterLitElement {
    constructor() {
        super();
        this.htmlOverrides = '';
        this._localTemplateSlotsImported = false;
        this._globalSlotsContainer = null;
        this._globalTemplateSlotsImported = false;
        this._renderDone = false;
        this.routingUrl = '';
    }

    static get properties() {
        return {
            ...super.properties,
            htmlOverrides: {type: String, attribute: 'html-overrides'},
            routingUrl: {type: String, attribute: 'routing-url'},
        };
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this._globalSlotsContainer !== null) {
            this._globalSlotsContainer.remove();
        }
    }

    _(selector) {
        return this.shadowRoot === null
            ? this.querySelector(selector)
            : this.shadowRoot.querySelector(selector);
    }

    _a(selector) {
        return this.shadowRoot === null
            ? this.querySelectorAll(selector)
            : this.shadowRoot.querySelectorAll(selector);
    }

    firstUpdated() {
        super.firstUpdated();
        this._renderDone = true;
        this._importTemplateSlots();
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'html-overrides':
                    this._importTemplateSlots();
                    break;
            }
        });

        super.update(changedProperties);
    }

    /**
     * Transforms all global override templates or named template slots in the light DOM to named div slots
     * on the first render.
     *
     * Global overrides will replace all existing slotted elements with the same slot name.
     */
    _importTemplateSlots() {
        if (!this._renderDone) {
            return;
        }
        this._importLocalTemplateSlots();
        this._importGlobalTemplateSlots();
    }

    _importLocalTemplateSlots() {
        if (this._localTemplateSlotsImported) {
            return;
        }

        // Now extract slots from templates contained in the light dom
        let lightTemplateSlots = this.querySelectorAll(':scope > template[slot]:not([slot=""]');
        for (let templateElem of lightTemplateSlots) {
            // create a slot div container to put in the cloned template content
            const divElem = document.createElement('div');
            divElem.slot = templateElem.getAttribute('slot');
            divElem.appendChild(templateElem.content.cloneNode(true));
            // remove the old template
            templateElem.remove();
            // put the slot div container with the cloned template in the light DOM
            this.appendChild(divElem);
        }

        this._localTemplateSlotsImported = true;
    }

    _importGlobalTemplateSlots() {
        if (this.htmlOverrides === '' || this._globalTemplateSlotsImported) {
            return;
        }

        // First add global override templates as light dom slots
        let globalOverrideTemplateElem = document.querySelector('template#' + this.htmlOverrides);
        if (globalOverrideTemplateElem !== null) {
            // we need to clone the element so we can access the content
            const overrideTemplateElemClone = globalOverrideTemplateElem.content.cloneNode(true);
            const templateOverrideElem = overrideTemplateElemClone.querySelector(
                'template#' + this.tagName.toLowerCase(),
            );
            if (templateOverrideElem !== null) {
                const templateOverrideElemClone = templateOverrideElem.content.cloneNode(true);

                // Find all slots which are direct children (somehow :scope doesn't work here so check parentNode)
                let globalTemplateSlots = [];
                for (let e of templateOverrideElemClone.querySelectorAll('[slot]:not([slot=""]')) {
                    if (e.parentNode === templateOverrideElemClone) {
                        globalTemplateSlots.push(e);
                    }
                }

                // Global overrides will replace local ones.
                // Either normal slotted elements or the ones we create from templates.
                for (let slotElem of globalTemplateSlots) {
                    for (let elm of this.querySelectorAll('[slot="' + slotElem.slot + '"]')) {
                        elm.remove();
                    }
                }

                // Create a dummy node and add it to the the same shadow root the templates are from
                // By adding it into the template we have the nice side effect that it is not visible
                let container = document.createElement('div');
                globalOverrideTemplateElem.append(container);
                this._globalSlotsContainer = container;
                for (let slotElem of globalTemplateSlots) {
                    container.appendChild(slotElem);
                }

                // Now move the slots into the light dom of the target.
                // The parent node in the other shadow root has to stay around for this to work
                while (container.childNodes.length) {
                    this.appendChild(container.removeChild(container.childNodes[0]));
                }
            }
        }

        this._globalTemplateSlotsImported = true;
    }

    getRoutingData() {
        return _parseUrlComponents(this.routingUrl);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = {CHILD: 2},
    e$1 =
        (t) =>
        (...e) => ({_$litDirective$: t, values: e});
class i {
    constructor(t) {}
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AT(t, e, i) {
        ((this._$Ct = t), (this._$AM = e), (this._$Ci = i));
    }
    _$AS(t, e) {
        return this.update(t, e);
    }
    update(t, e) {
        return this.render(...e);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class e extends i {
    constructor(i) {
        if ((super(i), (this.it = E), i.type !== t.CHILD))
            throw Error(this.constructor.directiveName + '() can only be used in child bindings');
    }
    render(r) {
        if (r === E || null == r) return ((this._t = void 0), (this.it = r));
        if (r === T) return r;
        if ('string' != typeof r)
            throw Error(this.constructor.directiveName + '() called with a non-string value');
        if (r === this.it) return this._t;
        this.it = r;
        const s = [r];
        return (
            (s.raw = s),
            (this._t = {_$litType$: this.constructor.resultType, strings: s, values: []})
        );
    }
}
((e.directiveName = 'unsafeHTML'), (e.resultType = 1));
const o = e$1(e);

const isString = (obj) => typeof obj === 'string';
const defer = () => {
    let res;
    let rej;
    const promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });
    promise.resolve = res;
    promise.reject = rej;
    return promise;
};
const makeString = (object) => {
    if (object == null) return '';
    return '' + object;
};
const copy = (a, s, t) => {
    a.forEach((m) => {
        if (s[m]) t[m] = s[m];
    });
};
const lastOfPathSeparatorRegExp = /###/g;
const cleanKey = (key) =>
    key && key.indexOf('###') > -1 ? key.replace(lastOfPathSeparatorRegExp, '.') : key;
const canNotTraverseDeeper = (object) => !object || isString(object);
const getLastOfPath = (object, path, Empty) => {
    const stack = !isString(path) ? path : path.split('.');
    let stackIndex = 0;
    while (stackIndex < stack.length - 1) {
        if (canNotTraverseDeeper(object)) return {};
        const key = cleanKey(stack[stackIndex]);
        if (!object[key] && Empty) object[key] = new Empty();
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            object = object[key];
        } else {
            object = {};
        }
        ++stackIndex;
    }
    if (canNotTraverseDeeper(object)) return {};
    return {
        obj: object,
        k: cleanKey(stack[stackIndex]),
    };
};
const setPath = (object, path, newValue) => {
    const {obj, k} = getLastOfPath(object, path, Object);
    if (obj !== undefined || path.length === 1) {
        obj[k] = newValue;
        return;
    }
    let e = path[path.length - 1];
    let p = path.slice(0, path.length - 1);
    let last = getLastOfPath(object, p, Object);
    while (last.obj === undefined && p.length) {
        e = `${p[p.length - 1]}.${e}`;
        p = p.slice(0, p.length - 1);
        last = getLastOfPath(object, p, Object);
        if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== 'undefined') {
            last.obj = undefined;
        }
    }
    last.obj[`${last.k}.${e}`] = newValue;
};
const pushPath = (object, path, newValue, concat) => {
    const {obj, k} = getLastOfPath(object, path, Object);
    obj[k] = obj[k] || [];
    obj[k].push(newValue);
};
const getPath = (object, path) => {
    const {obj, k} = getLastOfPath(object, path);
    if (!obj) return undefined;
    if (!Object.prototype.hasOwnProperty.call(obj, k)) return undefined;
    return obj[k];
};
const getPathWithDefaults = (data, defaultData, key) => {
    const value = getPath(data, key);
    if (value !== undefined) {
        return value;
    }
    return getPath(defaultData, key);
};
const deepExtend = (target, source, overwrite) => {
    for (const prop in source) {
        if (prop !== '__proto__' && prop !== 'constructor') {
            if (prop in target) {
                if (
                    isString(target[prop]) ||
                    target[prop] instanceof String ||
                    isString(source[prop]) ||
                    source[prop] instanceof String
                ) {
                    if (overwrite) target[prop] = source[prop];
                } else {
                    deepExtend(target[prop], source[prop], overwrite);
                }
            } else {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};
const regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
var _entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
};
const escape = (data) => {
    if (isString(data)) {
        return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
    }
    return data;
};
class RegExpCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.regExpMap = new Map();
        this.regExpQueue = [];
    }
    getRegExp(pattern) {
        const regExpFromCache = this.regExpMap.get(pattern);
        if (regExpFromCache !== undefined) {
            return regExpFromCache;
        }
        const regExpNew = new RegExp(pattern);
        if (this.regExpQueue.length === this.capacity) {
            this.regExpMap.delete(this.regExpQueue.shift());
        }
        this.regExpMap.set(pattern, regExpNew);
        this.regExpQueue.push(pattern);
        return regExpNew;
    }
}
const chars = [' ', ',', '?', '!', ';'];
const looksLikeObjectPathRegExpCache = new RegExpCache(20);
const looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
    nsSeparator = nsSeparator || '';
    keySeparator = keySeparator || '';
    const possibleChars = chars.filter(
        (c) => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0,
    );
    if (possibleChars.length === 0) return true;
    const r = looksLikeObjectPathRegExpCache.getRegExp(
        `(${possibleChars.map((c) => (c === '?' ? '\\?' : c)).join('|')})`,
    );
    let matched = !r.test(key);
    if (!matched) {
        const ki = key.indexOf(keySeparator);
        if (ki > 0 && !r.test(key.substring(0, ki))) {
            matched = true;
        }
    }
    return matched;
};
const deepFind = function (obj, path) {
    let keySeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
    if (!obj) return undefined;
    if (obj[path]) {
        if (!Object.prototype.hasOwnProperty.call(obj, path)) return undefined;
        return obj[path];
    }
    const tokens = path.split(keySeparator);
    let current = obj;
    for (let i = 0; i < tokens.length; ) {
        if (!current || typeof current !== 'object') {
            return undefined;
        }
        let next;
        let nextPath = '';
        for (let j = i; j < tokens.length; ++j) {
            if (j !== i) {
                nextPath += keySeparator;
            }
            nextPath += tokens[j];
            next = current[nextPath];
            if (next !== undefined) {
                if (
                    ['string', 'number', 'boolean'].indexOf(typeof next) > -1 &&
                    j < tokens.length - 1
                ) {
                    continue;
                }
                i += j - i + 1;
                break;
            }
        }
        current = next;
    }
    return current;
};
const getCleanedCode = (code) => code?.replace('_', '-');

const consoleLogger = {
    type: 'logger',
    log(args) {
        this.output('log', args);
    },
    warn(args) {
        this.output('warn', args);
    },
    error(args) {
        this.output('error', args);
    },
    output(type, args) {
        console?.[type]?.apply?.(console, args);
    },
};
class Logger {
    constructor(concreteLogger) {
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.init(concreteLogger, options);
    }
    init(concreteLogger) {
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.prefix = options.prefix || 'i18next:';
        this.logger = concreteLogger || consoleLogger;
        this.options = options;
        this.debug = options.debug;
    }
    log() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }
        return this.forward(args, 'log', '', true);
    }
    warn() {
        for (
            var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
            _key2 < _len2;
            _key2++
        ) {
            args[_key2] = arguments[_key2];
        }
        return this.forward(args, 'warn', '', true);
    }
    error() {
        for (
            var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;
            _key3 < _len3;
            _key3++
        ) {
            args[_key3] = arguments[_key3];
        }
        return this.forward(args, 'error', '');
    }
    deprecate() {
        for (
            var _len4 = arguments.length, args = new Array(_len4), _key4 = 0;
            _key4 < _len4;
            _key4++
        ) {
            args[_key4] = arguments[_key4];
        }
        return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
    }
    forward(args, lvl, prefix, debugOnly) {
        if (debugOnly && !this.debug) return null;
        if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
        return this.logger[lvl](args);
    }
    create(moduleName) {
        return new Logger(this.logger, {
            ...{
                prefix: `${this.prefix}:${moduleName}:`,
            },
            ...this.options,
        });
    }
    clone(options) {
        options = options || this.options;
        options.prefix = options.prefix || this.prefix;
        return new Logger(this.logger, options);
    }
}
var baseLogger = new Logger();

class EventEmitter {
    constructor() {
        this.observers = {};
    }
    on(events, listener) {
        events.split(' ').forEach((event) => {
            if (!this.observers[event]) this.observers[event] = new Map();
            const numListeners = this.observers[event].get(listener) || 0;
            this.observers[event].set(listener, numListeners + 1);
        });
        return this;
    }
    off(event, listener) {
        if (!this.observers[event]) return;
        if (!listener) {
            delete this.observers[event];
            return;
        }
        this.observers[event].delete(listener);
    }
    emit(event) {
        for (
            var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
            _key < _len;
            _key++
        ) {
            args[_key - 1] = arguments[_key];
        }
        if (this.observers[event]) {
            const cloned = Array.from(this.observers[event].entries());
            cloned.forEach((_ref) => {
                let [observer, numTimesAdded] = _ref;
                for (let i = 0; i < numTimesAdded; i++) {
                    observer(...args);
                }
            });
        }
        if (this.observers['*']) {
            const cloned = Array.from(this.observers['*'].entries());
            cloned.forEach((_ref2) => {
                let [observer, numTimesAdded] = _ref2;
                for (let i = 0; i < numTimesAdded; i++) {
                    observer.apply(observer, [event, ...args]);
                }
            });
        }
    }
}

class ResourceStore extends EventEmitter {
    constructor(data) {
        let options =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {
                      ns: ['translation'],
                      defaultNS: 'translation',
                  };
        super();
        this.data = data || {};
        this.options = options;
        if (this.options.keySeparator === undefined) {
            this.options.keySeparator = '.';
        }
        if (this.options.ignoreJSONStructure === undefined) {
            this.options.ignoreJSONStructure = true;
        }
    }
    addNamespaces(ns) {
        if (this.options.ns.indexOf(ns) < 0) {
            this.options.ns.push(ns);
        }
    }
    removeNamespaces(ns) {
        const index = this.options.ns.indexOf(ns);
        if (index > -1) {
            this.options.ns.splice(index, 1);
        }
    }
    getResource(lng, ns, key) {
        let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        const keySeparator =
            options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
        const ignoreJSONStructure =
            options.ignoreJSONStructure !== undefined
                ? options.ignoreJSONStructure
                : this.options.ignoreJSONStructure;
        let path;
        if (lng.indexOf('.') > -1) {
            path = lng.split('.');
        } else {
            path = [lng, ns];
            if (key) {
                if (Array.isArray(key)) {
                    path.push(...key);
                } else if (isString(key) && keySeparator) {
                    path.push(...key.split(keySeparator));
                } else {
                    path.push(key);
                }
            }
        }
        const result = getPath(this.data, path);
        if (!result && !ns && !key && lng.indexOf('.') > -1) {
            lng = path[0];
            ns = path[1];
            key = path.slice(2).join('.');
        }
        if (result || !ignoreJSONStructure || !isString(key)) return result;
        return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
    }
    addResource(lng, ns, key, value) {
        let options =
            arguments.length > 4 && arguments[4] !== undefined
                ? arguments[4]
                : {
                      silent: false,
                  };
        const keySeparator =
            options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
        let path = [lng, ns];
        if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
        if (lng.indexOf('.') > -1) {
            path = lng.split('.');
            value = ns;
            ns = path[1];
        }
        this.addNamespaces(ns);
        setPath(this.data, path, value);
        if (!options.silent) this.emit('added', lng, ns, key, value);
    }
    addResources(lng, ns, resources) {
        let options =
            arguments.length > 3 && arguments[3] !== undefined
                ? arguments[3]
                : {
                      silent: false,
                  };
        for (const m in resources) {
            if (isString(resources[m]) || Array.isArray(resources[m]))
                this.addResource(lng, ns, m, resources[m], {
                    silent: true,
                });
        }
        if (!options.silent) this.emit('added', lng, ns, resources);
    }
    addResourceBundle(lng, ns, resources, deep, overwrite) {
        let options =
            arguments.length > 5 && arguments[5] !== undefined
                ? arguments[5]
                : {
                      silent: false,
                      skipCopy: false,
                  };
        let path = [lng, ns];
        if (lng.indexOf('.') > -1) {
            path = lng.split('.');
            deep = resources;
            resources = ns;
            ns = path[1];
        }
        this.addNamespaces(ns);
        let pack = getPath(this.data, path) || {};
        if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
        if (deep) {
            deepExtend(pack, resources, overwrite);
        } else {
            pack = {
                ...pack,
                ...resources,
            };
        }
        setPath(this.data, path, pack);
        if (!options.silent) this.emit('added', lng, ns, resources);
    }
    removeResourceBundle(lng, ns) {
        if (this.hasResourceBundle(lng, ns)) {
            delete this.data[lng][ns];
        }
        this.removeNamespaces(ns);
        this.emit('removed', lng, ns);
    }
    hasResourceBundle(lng, ns) {
        return this.getResource(lng, ns) !== undefined;
    }
    getResourceBundle(lng, ns) {
        if (!ns) ns = this.options.defaultNS;
        return this.getResource(lng, ns);
    }
    getDataByLanguage(lng) {
        return this.data[lng];
    }
    hasLanguageSomeTranslations(lng) {
        const data = this.getDataByLanguage(lng);
        const n = (data && Object.keys(data)) || [];
        return !!n.find((v) => data[v] && Object.keys(data[v]).length > 0);
    }
    toJSON() {
        return this.data;
    }
}

var postProcessor = {
    processors: {},
    addPostProcessor(module) {
        this.processors[module.name] = module;
    },
    handle(processors, value, key, options, translator) {
        processors.forEach((processor) => {
            value = this.processors[processor]?.process(value, key, options, translator) ?? value;
        });
        return value;
    },
};

const checkedLoadedFor = {};
const shouldHandleAsObject = (res) =>
    !isString(res) && typeof res !== 'boolean' && typeof res !== 'number';
class Translator extends EventEmitter {
    constructor(services) {
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        super();
        copy(
            [
                'resourceStore',
                'languageUtils',
                'pluralResolver',
                'interpolator',
                'backendConnector',
                'i18nFormat',
                'utils',
            ],
            services,
            this,
        );
        this.options = options;
        if (this.options.keySeparator === undefined) {
            this.options.keySeparator = '.';
        }
        this.logger = baseLogger.create('translator');
    }
    changeLanguage(lng) {
        if (lng) this.language = lng;
    }
    exists(key) {
        let options =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {
                      interpolation: {},
                  };
        if (key == null) {
            return false;
        }
        const resolved = this.resolve(key, options);
        return resolved?.res !== undefined;
    }
    extractFromKey(key, options) {
        let nsSeparator =
            options.nsSeparator !== undefined ? options.nsSeparator : this.options.nsSeparator;
        if (nsSeparator === undefined) nsSeparator = ':';
        const keySeparator =
            options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
        let namespaces = options.ns || this.options.defaultNS || [];
        const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
        const seemsNaturalLanguage =
            !this.options.userDefinedKeySeparator &&
            !options.keySeparator &&
            !this.options.userDefinedNsSeparator &&
            !options.nsSeparator &&
            !looksLikeObjectPath(key, nsSeparator, keySeparator);
        if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
            const m = key.match(this.interpolator.nestingRegexp);
            if (m && m.length > 0) {
                return {
                    key,
                    namespaces: isString(namespaces) ? [namespaces] : namespaces,
                };
            }
            const parts = key.split(nsSeparator);
            if (
                nsSeparator !== keySeparator ||
                (nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1)
            )
                namespaces = parts.shift();
            key = parts.join(keySeparator);
        }
        return {
            key,
            namespaces: isString(namespaces) ? [namespaces] : namespaces,
        };
    }
    translate(keys, options, lastKey) {
        if (typeof options !== 'object' && this.options.overloadTranslationOptionHandler) {
            options = this.options.overloadTranslationOptionHandler(arguments);
        }
        if (typeof options === 'object')
            options = {
                ...options,
            };
        if (!options) options = {};
        if (keys == null) return '';
        if (!Array.isArray(keys)) keys = [String(keys)];
        const returnDetails =
            options.returnDetails !== undefined
                ? options.returnDetails
                : this.options.returnDetails;
        const keySeparator =
            options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
        const {key, namespaces} = this.extractFromKey(keys[keys.length - 1], options);
        const namespace = namespaces[namespaces.length - 1];
        const lng = options.lng || this.language;
        const appendNamespaceToCIMode =
            options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
        if (lng?.toLowerCase() === 'cimode') {
            if (appendNamespaceToCIMode) {
                const nsSeparator = options.nsSeparator || this.options.nsSeparator;
                if (returnDetails) {
                    return {
                        res: `${namespace}${nsSeparator}${key}`,
                        usedKey: key,
                        exactUsedKey: key,
                        usedLng: lng,
                        usedNS: namespace,
                        usedParams: this.getUsedParamsDetails(options),
                    };
                }
                return `${namespace}${nsSeparator}${key}`;
            }
            if (returnDetails) {
                return {
                    res: key,
                    usedKey: key,
                    exactUsedKey: key,
                    usedLng: lng,
                    usedNS: namespace,
                    usedParams: this.getUsedParamsDetails(options),
                };
            }
            return key;
        }
        const resolved = this.resolve(keys, options);
        let res = resolved?.res;
        const resUsedKey = resolved?.usedKey || key;
        const resExactUsedKey = resolved?.exactUsedKey || key;
        const noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
        const joinArrays =
            options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;
        const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
        const needsPluralHandling = options.count !== undefined && !isString(options.count);
        const hasDefaultValue = Translator.hasDefaultValue(options);
        const defaultValueSuffix = needsPluralHandling
            ? this.pluralResolver.getSuffix(lng, options.count, options)
            : '';
        const defaultValueSuffixOrdinalFallback =
            options.ordinal && needsPluralHandling
                ? this.pluralResolver.getSuffix(lng, options.count, {
                      ordinal: false,
                  })
                : '';
        const needsZeroSuffixLookup =
            needsPluralHandling && !options.ordinal && options.count === 0;
        const defaultValue =
            (needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`]) ||
            options[`defaultValue${defaultValueSuffix}`] ||
            options[`defaultValue${defaultValueSuffixOrdinalFallback}`] ||
            options.defaultValue;
        let resForObjHndl = res;
        if (handleAsObjectInI18nFormat && !res && hasDefaultValue) {
            resForObjHndl = defaultValue;
        }
        const handleAsObject = shouldHandleAsObject(resForObjHndl);
        const resType = Object.prototype.toString.apply(resForObjHndl);
        if (
            handleAsObjectInI18nFormat &&
            resForObjHndl &&
            handleAsObject &&
            noObject.indexOf(resType) < 0 &&
            !(isString(joinArrays) && Array.isArray(resForObjHndl))
        ) {
            if (!options.returnObjects && !this.options.returnObjects) {
                if (!this.options.returnedObjectHandler) {
                    this.logger.warn(
                        'accessing an object - but returnObjects options is not enabled!',
                    );
                }
                const r = this.options.returnedObjectHandler
                    ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
                          ...options,
                          ns: namespaces,
                      })
                    : `key '${key} (${this.language})' returned an object instead of string.`;
                if (returnDetails) {
                    resolved.res = r;
                    resolved.usedParams = this.getUsedParamsDetails(options);
                    return resolved;
                }
                return r;
            }
            if (keySeparator) {
                const resTypeIsArray = Array.isArray(resForObjHndl);
                const copy = resTypeIsArray ? [] : {};
                const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
                for (const m in resForObjHndl) {
                    if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
                        const deepKey = `${newKeyToUse}${keySeparator}${m}`;
                        if (hasDefaultValue && !res) {
                            copy[m] = this.translate(deepKey, {
                                ...options,
                                defaultValue: shouldHandleAsObject(defaultValue)
                                    ? defaultValue[m]
                                    : undefined,
                                ...{
                                    joinArrays: false,
                                    ns: namespaces,
                                },
                            });
                        } else {
                            copy[m] = this.translate(deepKey, {
                                ...options,
                                ...{
                                    joinArrays: false,
                                    ns: namespaces,
                                },
                            });
                        }
                        if (copy[m] === deepKey) copy[m] = resForObjHndl[m];
                    }
                }
                res = copy;
            }
        } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
            res = res.join(joinArrays);
            if (res) res = this.extendTranslation(res, keys, options, lastKey);
        } else {
            let usedDefault = false;
            let usedKey = false;
            if (!this.isValidLookup(res) && hasDefaultValue) {
                usedDefault = true;
                res = defaultValue;
            }
            if (!this.isValidLookup(res)) {
                usedKey = true;
                res = key;
            }
            const missingKeyNoValueFallbackToKey =
                options.missingKeyNoValueFallbackToKey ||
                this.options.missingKeyNoValueFallbackToKey;
            const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? undefined : res;
            const updateMissing =
                hasDefaultValue && defaultValue !== res && this.options.updateMissing;
            if (usedKey || usedDefault || updateMissing) {
                this.logger.log(
                    updateMissing ? 'updateKey' : 'missingKey',
                    lng,
                    namespace,
                    key,
                    updateMissing ? defaultValue : res,
                );
                if (keySeparator) {
                    const fk = this.resolve(key, {
                        ...options,
                        keySeparator: false,
                    });
                    if (fk && fk.res)
                        this.logger.warn(
                            'Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.',
                        );
                }
                let lngs = [];
                const fallbackLngs = this.languageUtils.getFallbackCodes(
                    this.options.fallbackLng,
                    options.lng || this.language,
                );
                if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
                    for (let i = 0; i < fallbackLngs.length; i++) {
                        lngs.push(fallbackLngs[i]);
                    }
                } else if (this.options.saveMissingTo === 'all') {
                    lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
                } else {
                    lngs.push(options.lng || this.language);
                }
                const send = (l, k, specificDefaultValue) => {
                    const defaultForMissing =
                        hasDefaultValue && specificDefaultValue !== res
                            ? specificDefaultValue
                            : resForMissing;
                    if (this.options.missingKeyHandler) {
                        this.options.missingKeyHandler(
                            l,
                            namespace,
                            k,
                            defaultForMissing,
                            updateMissing,
                            options,
                        );
                    } else if (this.backendConnector?.saveMissing) {
                        this.backendConnector.saveMissing(
                            l,
                            namespace,
                            k,
                            defaultForMissing,
                            updateMissing,
                            options,
                        );
                    }
                    this.emit('missingKey', l, namespace, k, res);
                };
                if (this.options.saveMissing) {
                    if (this.options.saveMissingPlurals && needsPluralHandling) {
                        lngs.forEach((language) => {
                            const suffixes = this.pluralResolver.getSuffixes(language, options);
                            if (
                                needsZeroSuffixLookup &&
                                options[`defaultValue${this.options.pluralSeparator}zero`] &&
                                suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0
                            ) {
                                suffixes.push(`${this.options.pluralSeparator}zero`);
                            }
                            suffixes.forEach((suffix) => {
                                send(
                                    [language],
                                    key + suffix,
                                    options[`defaultValue${suffix}`] || defaultValue,
                                );
                            });
                        });
                    } else {
                        send(lngs, key, defaultValue);
                    }
                }
            }
            res = this.extendTranslation(res, keys, options, resolved, lastKey);
            if (usedKey && res === key && this.options.appendNamespaceToMissingKey)
                res = `${namespace}:${key}`;
            if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
                res = this.options.parseMissingKeyHandler(
                    this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key,
                    usedDefault ? res : undefined,
                );
            }
        }
        if (returnDetails) {
            resolved.res = res;
            resolved.usedParams = this.getUsedParamsDetails(options);
            return resolved;
        }
        return res;
    }
    extendTranslation(res, key, options, resolved, lastKey) {
        var _this = this;
        if (this.i18nFormat?.parse) {
            res = this.i18nFormat.parse(
                res,
                {
                    ...this.options.interpolation.defaultVariables,
                    ...options,
                },
                options.lng || this.language || resolved.usedLng,
                resolved.usedNS,
                resolved.usedKey,
                {
                    resolved,
                },
            );
        } else if (!options.skipInterpolation) {
            if (options.interpolation)
                this.interpolator.init({
                    ...options,
                    ...{
                        interpolation: {
                            ...this.options.interpolation,
                            ...options.interpolation,
                        },
                    },
                });
            const skipOnVariables =
                isString(res) &&
                (options?.interpolation?.skipOnVariables !== undefined
                    ? options.interpolation.skipOnVariables
                    : this.options.interpolation.skipOnVariables);
            let nestBef;
            if (skipOnVariables) {
                const nb = res.match(this.interpolator.nestingRegexp);
                nestBef = nb && nb.length;
            }
            let data = options.replace && !isString(options.replace) ? options.replace : options;
            if (this.options.interpolation.defaultVariables)
                data = {
                    ...this.options.interpolation.defaultVariables,
                    ...data,
                };
            res = this.interpolator.interpolate(
                res,
                data,
                options.lng || this.language || resolved.usedLng,
                options,
            );
            if (skipOnVariables) {
                const na = res.match(this.interpolator.nestingRegexp);
                const nestAft = na && na.length;
                if (nestBef < nestAft) options.nest = false;
            }
            if (!options.lng && resolved && resolved.res)
                options.lng = this.language || resolved.usedLng;
            if (options.nest !== false)
                res = this.interpolator.nest(
                    res,
                    function () {
                        for (
                            var _len = arguments.length, args = new Array(_len), _key = 0;
                            _key < _len;
                            _key++
                        ) {
                            args[_key] = arguments[_key];
                        }
                        if (lastKey?.[0] === args[0] && !options.context) {
                            _this.logger.warn(
                                `It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`,
                            );
                            return null;
                        }
                        return _this.translate(...args, key);
                    },
                    options,
                );
            if (options.interpolation) this.interpolator.reset();
        }
        const postProcess = options.postProcess || this.options.postProcess;
        const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
        if (res != null && postProcessorNames?.length && options.applyPostProcessor !== false) {
            res = postProcessor.handle(
                postProcessorNames,
                res,
                key,
                this.options && this.options.postProcessPassResolved
                    ? {
                          i18nResolved: {
                              ...resolved,
                              usedParams: this.getUsedParamsDetails(options),
                          },
                          ...options,
                      }
                    : options,
                this,
            );
        }
        return res;
    }
    resolve(keys) {
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        let found;
        let usedKey;
        let exactUsedKey;
        let usedLng;
        let usedNS;
        if (isString(keys)) keys = [keys];
        keys.forEach((k) => {
            if (this.isValidLookup(found)) return;
            const extracted = this.extractFromKey(k, options);
            const key = extracted.key;
            usedKey = key;
            let namespaces = extracted.namespaces;
            if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
            const needsPluralHandling = options.count !== undefined && !isString(options.count);
            const needsZeroSuffixLookup =
                needsPluralHandling && !options.ordinal && options.count === 0;
            const needsContextHandling =
                options.context !== undefined &&
                (isString(options.context) || typeof options.context === 'number') &&
                options.context !== '';
            const codes = options.lngs
                ? options.lngs
                : this.languageUtils.toResolveHierarchy(
                      options.lng || this.language,
                      options.fallbackLng,
                  );
            namespaces.forEach((ns) => {
                if (this.isValidLookup(found)) return;
                usedNS = ns;
                if (
                    !checkedLoadedFor[`${codes[0]}-${ns}`] &&
                    this.utils?.hasLoadedNamespace &&
                    !this.utils?.hasLoadedNamespace(usedNS)
                ) {
                    checkedLoadedFor[`${codes[0]}-${ns}`] = true;
                    this.logger.warn(
                        `key "${usedKey}" for languages "${codes.join(', ')}" won't get resolved as namespace "${usedNS}" was not yet loaded`,
                        'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!',
                    );
                }
                codes.forEach((code) => {
                    if (this.isValidLookup(found)) return;
                    usedLng = code;
                    const finalKeys = [key];
                    if (this.i18nFormat?.addLookupKeys) {
                        this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
                    } else {
                        let pluralSuffix;
                        if (needsPluralHandling)
                            pluralSuffix = this.pluralResolver.getSuffix(
                                code,
                                options.count,
                                options,
                            );
                        const zeroSuffix = `${this.options.pluralSeparator}zero`;
                        const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
                        if (needsPluralHandling) {
                            finalKeys.push(key + pluralSuffix);
                            if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                                finalKeys.push(
                                    key +
                                        pluralSuffix.replace(
                                            ordinalPrefix,
                                            this.options.pluralSeparator,
                                        ),
                                );
                            }
                            if (needsZeroSuffixLookup) {
                                finalKeys.push(key + zeroSuffix);
                            }
                        }
                        if (needsContextHandling) {
                            const contextKey = `${key}${this.options.contextSeparator}${options.context}`;
                            finalKeys.push(contextKey);
                            if (needsPluralHandling) {
                                finalKeys.push(contextKey + pluralSuffix);
                                if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                                    finalKeys.push(
                                        contextKey +
                                            pluralSuffix.replace(
                                                ordinalPrefix,
                                                this.options.pluralSeparator,
                                            ),
                                    );
                                }
                                if (needsZeroSuffixLookup) {
                                    finalKeys.push(contextKey + zeroSuffix);
                                }
                            }
                        }
                    }
                    let possibleKey;
                    while ((possibleKey = finalKeys.pop())) {
                        if (!this.isValidLookup(found)) {
                            exactUsedKey = possibleKey;
                            found = this.getResource(code, ns, possibleKey, options);
                        }
                    }
                });
            });
        });
        return {
            res: found,
            usedKey,
            exactUsedKey,
            usedLng,
            usedNS,
        };
    }
    isValidLookup(res) {
        return (
            res !== undefined &&
            !(!this.options.returnNull && res === null) &&
            !(!this.options.returnEmptyString && res === '')
        );
    }
    getResource(code, ns, key) {
        let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        if (this.i18nFormat?.getResource)
            return this.i18nFormat.getResource(code, ns, key, options);
        return this.resourceStore.getResource(code, ns, key, options);
    }
    getUsedParamsDetails() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const optionsKeys = [
            'defaultValue',
            'ordinal',
            'context',
            'replace',
            'lng',
            'lngs',
            'fallbackLng',
            'ns',
            'keySeparator',
            'nsSeparator',
            'returnObjects',
            'returnDetails',
            'joinArrays',
            'postProcess',
            'interpolation',
        ];
        const useOptionsReplaceForData = options.replace && !isString(options.replace);
        let data = useOptionsReplaceForData ? options.replace : options;
        if (useOptionsReplaceForData && typeof options.count !== 'undefined') {
            data.count = options.count;
        }
        if (this.options.interpolation.defaultVariables) {
            data = {
                ...this.options.interpolation.defaultVariables,
                ...data,
            };
        }
        if (!useOptionsReplaceForData) {
            data = {
                ...data,
            };
            for (const key of optionsKeys) {
                delete data[key];
            }
        }
        return data;
    }
    static hasDefaultValue(options) {
        const prefix = 'defaultValue';
        for (const option in options) {
            if (
                Object.prototype.hasOwnProperty.call(options, option) &&
                prefix === option.substring(0, prefix.length) &&
                undefined !== options[option]
            ) {
                return true;
            }
        }
        return false;
    }
}

class LanguageUtil {
    constructor(options) {
        this.options = options;
        this.supportedLngs = this.options.supportedLngs || false;
        this.logger = baseLogger.create('languageUtils');
    }
    getScriptPartFromCode(code) {
        code = getCleanedCode(code);
        if (!code || code.indexOf('-') < 0) return null;
        const p = code.split('-');
        if (p.length === 2) return null;
        p.pop();
        if (p[p.length - 1].toLowerCase() === 'x') return null;
        return this.formatLanguageCode(p.join('-'));
    }
    getLanguagePartFromCode(code) {
        code = getCleanedCode(code);
        if (!code || code.indexOf('-') < 0) return code;
        const p = code.split('-');
        return this.formatLanguageCode(p[0]);
    }
    formatLanguageCode(code) {
        if (isString(code) && code.indexOf('-') > -1) {
            let formattedCode;
            try {
                formattedCode = Intl.getCanonicalLocales(code)[0];
            } catch (e) {}
            if (formattedCode && this.options.lowerCaseLng) {
                formattedCode = formattedCode.toLowerCase();
            }
            if (formattedCode) return formattedCode;
            if (this.options.lowerCaseLng) {
                return code.toLowerCase();
            }
            return code;
        }
        return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
    }
    isSupportedCode(code) {
        if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
            code = this.getLanguagePartFromCode(code);
        }
        return (
            !this.supportedLngs ||
            !this.supportedLngs.length ||
            this.supportedLngs.indexOf(code) > -1
        );
    }
    getBestMatchFromCodes(codes) {
        if (!codes) return null;
        let found;
        codes.forEach((code) => {
            if (found) return;
            const cleanedLng = this.formatLanguageCode(code);
            if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
        });
        if (!found && this.options.supportedLngs) {
            codes.forEach((code) => {
                if (found) return;
                const lngOnly = this.getLanguagePartFromCode(code);
                if (this.isSupportedCode(lngOnly)) return (found = lngOnly);
                found = this.options.supportedLngs.find((supportedLng) => {
                    if (supportedLng === lngOnly) return supportedLng;
                    if (supportedLng.indexOf('-') < 0 && lngOnly.indexOf('-') < 0) return;
                    if (
                        supportedLng.indexOf('-') > 0 &&
                        lngOnly.indexOf('-') < 0 &&
                        supportedLng.substring(0, supportedLng.indexOf('-')) === lngOnly
                    )
                        return supportedLng;
                    if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1)
                        return supportedLng;
                });
            });
        }
        if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
        return found;
    }
    getFallbackCodes(fallbacks, code) {
        if (!fallbacks) return [];
        if (typeof fallbacks === 'function') fallbacks = fallbacks(code);
        if (isString(fallbacks)) fallbacks = [fallbacks];
        if (Array.isArray(fallbacks)) return fallbacks;
        if (!code) return fallbacks.default || [];
        let found = fallbacks[code];
        if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
        if (!found) found = fallbacks[this.formatLanguageCode(code)];
        if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
        if (!found) found = fallbacks.default;
        return found || [];
    }
    toResolveHierarchy(code, fallbackCode) {
        const fallbackCodes = this.getFallbackCodes(
            fallbackCode || this.options.fallbackLng || [],
            code,
        );
        const codes = [];
        const addCode = (c) => {
            if (!c) return;
            if (this.isSupportedCode(c)) {
                codes.push(c);
            } else {
                this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
            }
        };
        if (isString(code) && (code.indexOf('-') > -1 || code.indexOf('_') > -1)) {
            if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
            if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly')
                addCode(this.getScriptPartFromCode(code));
            if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
        } else if (isString(code)) {
            addCode(this.formatLanguageCode(code));
        }
        fallbackCodes.forEach((fc) => {
            if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
        });
        return codes;
    }
}

const suffixesOrder = {
    zero: 0,
    one: 1,
    two: 2,
    few: 3,
    many: 4,
    other: 5,
};
const dummyRule = {
    select: (count) => (count === 1 ? 'one' : 'other'),
    resolvedOptions: () => ({
        pluralCategories: ['one', 'other'],
    }),
};
class PluralResolver {
    constructor(languageUtils) {
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.languageUtils = languageUtils;
        this.options = options;
        this.logger = baseLogger.create('pluralResolver');
        this.pluralRulesCache = {};
    }
    addRule(lng, obj) {
        this.rules[lng] = obj;
    }
    clearCache() {
        this.pluralRulesCache = {};
    }
    getRule(code) {
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        const cleanedCode = getCleanedCode(code === 'dev' ? 'en' : code);
        const type = options.ordinal ? 'ordinal' : 'cardinal';
        const cacheKey = JSON.stringify({
            cleanedCode,
            type,
        });
        if (cacheKey in this.pluralRulesCache) {
            return this.pluralRulesCache[cacheKey];
        }
        let rule;
        try {
            rule = new Intl.PluralRules(cleanedCode, {
                type,
            });
        } catch (err) {
            if (!Intl) {
                this.logger.error('No Intl support, please use an Intl polyfill!');
                return dummyRule;
            }
            if (!code.match(/-|_/)) return dummyRule;
            const lngPart = this.languageUtils.getLanguagePartFromCode(code);
            rule = this.getRule(lngPart, options);
        }
        this.pluralRulesCache[cacheKey] = rule;
        return rule;
    }
    needsPlural(code) {
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        let rule = this.getRule(code, options);
        if (!rule) rule = this.getRule('dev', options);
        return rule?.resolvedOptions().pluralCategories.length > 1;
    }
    getPluralFormsOfKey(code, key) {
        let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
    }
    getSuffixes(code) {
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        let rule = this.getRule(code, options);
        if (!rule) rule = this.getRule('dev', options);
        if (!rule) return [];
        return rule
            .resolvedOptions()
            .pluralCategories.sort(
                (pluralCategory1, pluralCategory2) =>
                    suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2],
            )
            .map(
                (pluralCategory) =>
                    `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ''}${pluralCategory}`,
            );
    }
    getSuffix(code, count) {
        let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        const rule = this.getRule(code, options);
        if (rule) {
            return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ''}${rule.select(count)}`;
        }
        this.logger.warn(`no plural rule found for: ${code}`);
        return this.getSuffix('dev', count, options);
    }
}

const deepFindWithDefaults = function (data, defaultData, key) {
    let keySeparator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';
    let ignoreJSONStructure =
        arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    let path = getPathWithDefaults(data, defaultData, key);
    if (!path && ignoreJSONStructure && isString(key)) {
        path = deepFind(data, key, keySeparator);
        if (path === undefined) path = deepFind(defaultData, key, keySeparator);
    }
    return path;
};
const regexSafe = (val) => val.replace(/\$/g, '$$$$');
class Interpolator {
    constructor() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        this.logger = baseLogger.create('interpolator');
        this.options = options;
        this.format = options?.interpolation?.format || ((value) => value);
        this.init(options);
    }
    init() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (!options.interpolation)
            options.interpolation = {
                escapeValue: true,
            };
        const {
            escape: escape$1,
            escapeValue,
            useRawValueToEscape,
            prefix,
            prefixEscaped,
            suffix,
            suffixEscaped,
            formatSeparator,
            unescapeSuffix,
            unescapePrefix,
            nestingPrefix,
            nestingPrefixEscaped,
            nestingSuffix,
            nestingSuffixEscaped,
            nestingOptionsSeparator,
            maxReplaces,
            alwaysFormat,
        } = options.interpolation;
        this.escape = escape$1 !== undefined ? escape$1 : escape;
        this.escapeValue = escapeValue !== undefined ? escapeValue : true;
        this.useRawValueToEscape = useRawValueToEscape !== undefined ? useRawValueToEscape : false;
        this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || '{{';
        this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || '}}';
        this.formatSeparator = formatSeparator || ',';
        this.unescapePrefix = unescapeSuffix ? '' : unescapePrefix || '-';
        this.unescapeSuffix = this.unescapePrefix ? '' : unescapeSuffix || '';
        this.nestingPrefix = nestingPrefix
            ? regexEscape(nestingPrefix)
            : nestingPrefixEscaped || regexEscape('$t(');
        this.nestingSuffix = nestingSuffix
            ? regexEscape(nestingSuffix)
            : nestingSuffixEscaped || regexEscape(')');
        this.nestingOptionsSeparator = nestingOptionsSeparator || ',';
        this.maxReplaces = maxReplaces || 1000;
        this.alwaysFormat = alwaysFormat !== undefined ? alwaysFormat : false;
        this.resetRegExp();
    }
    reset() {
        if (this.options) this.init(this.options);
    }
    resetRegExp() {
        const getOrResetRegExp = (existingRegExp, pattern) => {
            if (existingRegExp?.source === pattern) {
                existingRegExp.lastIndex = 0;
                return existingRegExp;
            }
            return new RegExp(pattern, 'g');
        };
        this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
        this.regexpUnescape = getOrResetRegExp(
            this.regexpUnescape,
            `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`,
        );
        this.nestingRegexp = getOrResetRegExp(
            this.nestingRegexp,
            `${this.nestingPrefix}(.+?)${this.nestingSuffix}`,
        );
    }
    interpolate(str, data, lng, options) {
        let match;
        let value;
        let replaces;
        const defaultData =
            (this.options &&
                this.options.interpolation &&
                this.options.interpolation.defaultVariables) ||
            {};
        const handleFormat = (key) => {
            if (key.indexOf(this.formatSeparator) < 0) {
                const path = deepFindWithDefaults(
                    data,
                    defaultData,
                    key,
                    this.options.keySeparator,
                    this.options.ignoreJSONStructure,
                );
                return this.alwaysFormat
                    ? this.format(path, undefined, lng, {
                          ...options,
                          ...data,
                          interpolationkey: key,
                      })
                    : path;
            }
            const p = key.split(this.formatSeparator);
            const k = p.shift().trim();
            const f = p.join(this.formatSeparator).trim();
            return this.format(
                deepFindWithDefaults(
                    data,
                    defaultData,
                    k,
                    this.options.keySeparator,
                    this.options.ignoreJSONStructure,
                ),
                f,
                lng,
                {
                    ...options,
                    ...data,
                    interpolationkey: k,
                },
            );
        };
        this.resetRegExp();
        const missingInterpolationHandler =
            options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
        const skipOnVariables =
            options?.interpolation?.skipOnVariables !== undefined
                ? options.interpolation.skipOnVariables
                : this.options.interpolation.skipOnVariables;
        const todos = [
            {
                regex: this.regexpUnescape,
                safeValue: (val) => regexSafe(val),
            },
            {
                regex: this.regexp,
                safeValue: (val) =>
                    this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val),
            },
        ];
        todos.forEach((todo) => {
            replaces = 0;
            while ((match = todo.regex.exec(str))) {
                const matchedVar = match[1].trim();
                value = handleFormat(matchedVar);
                if (value === undefined) {
                    if (typeof missingInterpolationHandler === 'function') {
                        const temp = missingInterpolationHandler(str, match, options);
                        value = isString(temp) ? temp : '';
                    } else if (
                        options &&
                        Object.prototype.hasOwnProperty.call(options, matchedVar)
                    ) {
                        value = '';
                    } else if (skipOnVariables) {
                        value = match[0];
                        continue;
                    } else {
                        this.logger.warn(
                            `missed to pass in variable ${matchedVar} for interpolating ${str}`,
                        );
                        value = '';
                    }
                } else if (!isString(value) && !this.useRawValueToEscape) {
                    value = makeString(value);
                }
                const safeValue = todo.safeValue(value);
                str = str.replace(match[0], safeValue);
                if (skipOnVariables) {
                    todo.regex.lastIndex += value.length;
                    todo.regex.lastIndex -= match[0].length;
                } else {
                    todo.regex.lastIndex = 0;
                }
                replaces++;
                if (replaces >= this.maxReplaces) {
                    break;
                }
            }
        });
        return str;
    }
    nest(str, fc) {
        let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        let match;
        let value;
        let clonedOptions;
        const handleHasOptions = (key, inheritedOptions) => {
            const sep = this.nestingOptionsSeparator;
            if (key.indexOf(sep) < 0) return key;
            const c = key.split(new RegExp(`${sep}[ ]*{`));
            let optionsString = `{${c[1]}`;
            key = c[0];
            optionsString = this.interpolate(optionsString, clonedOptions);
            const matchedSingleQuotes = optionsString.match(/'/g);
            const matchedDoubleQuotes = optionsString.match(/"/g);
            if (
                ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes) ||
                matchedDoubleQuotes.length % 2 !== 0
            ) {
                optionsString = optionsString.replace(/'/g, '"');
            }
            try {
                clonedOptions = JSON.parse(optionsString);
                if (inheritedOptions)
                    clonedOptions = {
                        ...inheritedOptions,
                        ...clonedOptions,
                    };
            } catch (e) {
                this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
                return `${key}${sep}${optionsString}`;
            }
            if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1)
                delete clonedOptions.defaultValue;
            return key;
        };
        while ((match = this.nestingRegexp.exec(str))) {
            let formatters = [];
            clonedOptions = {
                ...options,
            };
            clonedOptions =
                clonedOptions.replace && !isString(clonedOptions.replace)
                    ? clonedOptions.replace
                    : clonedOptions;
            clonedOptions.applyPostProcessor = false;
            delete clonedOptions.defaultValue;
            let doReduce = false;
            if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
                const r = match[1].split(this.formatSeparator).map((elem) => elem.trim());
                match[1] = r.shift();
                formatters = r;
                doReduce = true;
            }
            value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
            if (value && match[0] === str && !isString(value)) return value;
            if (!isString(value)) value = makeString(value);
            if (!value) {
                this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
                value = '';
            }
            if (doReduce) {
                value = formatters.reduce(
                    (v, f) =>
                        this.format(v, f, options.lng, {
                            ...options,
                            interpolationkey: match[1].trim(),
                        }),
                    value.trim(),
                );
            }
            str = str.replace(match[0], value);
            this.regexp.lastIndex = 0;
        }
        return str;
    }
}

const parseFormatStr = (formatStr) => {
    let formatName = formatStr.toLowerCase().trim();
    const formatOptions = {};
    if (formatStr.indexOf('(') > -1) {
        const p = formatStr.split('(');
        formatName = p[0].toLowerCase().trim();
        const optStr = p[1].substring(0, p[1].length - 1);
        if (formatName === 'currency' && optStr.indexOf(':') < 0) {
            if (!formatOptions.currency) formatOptions.currency = optStr.trim();
        } else if (formatName === 'relativetime' && optStr.indexOf(':') < 0) {
            if (!formatOptions.range) formatOptions.range = optStr.trim();
        } else {
            const opts = optStr.split(';');
            opts.forEach((opt) => {
                if (opt) {
                    const [key, ...rest] = opt.split(':');
                    const val = rest
                        .join(':')
                        .trim()
                        .replace(/^'+|'+$/g, '');
                    const trimmedKey = key.trim();
                    if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
                    if (val === 'false') formatOptions[trimmedKey] = false;
                    if (val === 'true') formatOptions[trimmedKey] = true;
                    if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
                }
            });
        }
    }
    return {
        formatName,
        formatOptions,
    };
};
const createCachedFormatter = (fn) => {
    const cache = {};
    return (val, lng, options) => {
        let optForCache = options;
        if (
            options &&
            options.interpolationkey &&
            options.formatParams &&
            options.formatParams[options.interpolationkey] &&
            options[options.interpolationkey]
        ) {
            optForCache = {
                ...optForCache,
                [options.interpolationkey]: undefined,
            };
        }
        const key = lng + JSON.stringify(optForCache);
        let formatter = cache[key];
        if (!formatter) {
            formatter = fn(getCleanedCode(lng), options);
            cache[key] = formatter;
        }
        return formatter(val);
    };
};
class Formatter {
    constructor() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        this.logger = baseLogger.create('formatter');
        this.options = options;
        this.formats = {
            number: createCachedFormatter((lng, opt) => {
                const formatter = new Intl.NumberFormat(lng, {
                    ...opt,
                });
                return (val) => formatter.format(val);
            }),
            currency: createCachedFormatter((lng, opt) => {
                const formatter = new Intl.NumberFormat(lng, {
                    ...opt,
                    style: 'currency',
                });
                return (val) => formatter.format(val);
            }),
            datetime: createCachedFormatter((lng, opt) => {
                const formatter = new Intl.DateTimeFormat(lng, {
                    ...opt,
                });
                return (val) => formatter.format(val);
            }),
            relativetime: createCachedFormatter((lng, opt) => {
                const formatter = new Intl.RelativeTimeFormat(lng, {
                    ...opt,
                });
                return (val) => formatter.format(val, opt.range || 'day');
            }),
            list: createCachedFormatter((lng, opt) => {
                const formatter = new Intl.ListFormat(lng, {
                    ...opt,
                });
                return (val) => formatter.format(val);
            }),
        };
        this.init(options);
    }
    init(services) {
        let options =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {
                      interpolation: {},
                  };
        this.formatSeparator = options.interpolation.formatSeparator || ',';
    }
    add(name, fc) {
        this.formats[name.toLowerCase().trim()] = fc;
    }
    addCached(name, fc) {
        this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
    }
    format(value, format, lng) {
        let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        const formats = format.split(this.formatSeparator);
        if (
            formats.length > 1 &&
            formats[0].indexOf('(') > 1 &&
            formats[0].indexOf(')') < 0 &&
            formats.find((f) => f.indexOf(')') > -1)
        ) {
            const lastIndex = formats.findIndex((f) => f.indexOf(')') > -1);
            formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
        }
        const result = formats.reduce((mem, f) => {
            const {formatName, formatOptions} = parseFormatStr(f);
            if (this.formats[formatName]) {
                let formatted = mem;
                try {
                    const valOptions = options?.formatParams?.[options.interpolationkey] || {};
                    const l =
                        valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
                    formatted = this.formats[formatName](mem, l, {
                        ...formatOptions,
                        ...options,
                        ...valOptions,
                    });
                } catch (error) {
                    this.logger.warn(error);
                }
                return formatted;
            } else {
                this.logger.warn(`there was no format function for ${formatName}`);
            }
            return mem;
        }, value);
        return result;
    }
}

const removePending = (q, name) => {
    if (q.pending[name] !== undefined) {
        delete q.pending[name];
        q.pendingCount--;
    }
};
class Connector extends EventEmitter {
    constructor(backend, store, services) {
        let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        super();
        this.backend = backend;
        this.store = store;
        this.services = services;
        this.languageUtils = services.languageUtils;
        this.options = options;
        this.logger = baseLogger.create('backendConnector');
        this.waitingReads = [];
        this.maxParallelReads = options.maxParallelReads || 10;
        this.readingCalls = 0;
        this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
        this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
        this.state = {};
        this.queue = [];
        this.backend?.init?.(services, options.backend, options);
    }
    queueLoad(languages, namespaces, options, callback) {
        const toLoad = {};
        const pending = {};
        const toLoadLanguages = {};
        const toLoadNamespaces = {};
        languages.forEach((lng) => {
            let hasAllNamespaces = true;
            namespaces.forEach((ns) => {
                const name = `${lng}|${ns}`;
                if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
                    this.state[name] = 2;
                } else if (this.state[name] < 0);
                else if (this.state[name] === 1) {
                    if (pending[name] === undefined) pending[name] = true;
                } else {
                    this.state[name] = 1;
                    hasAllNamespaces = false;
                    if (pending[name] === undefined) pending[name] = true;
                    if (toLoad[name] === undefined) toLoad[name] = true;
                    if (toLoadNamespaces[ns] === undefined) toLoadNamespaces[ns] = true;
                }
            });
            if (!hasAllNamespaces) toLoadLanguages[lng] = true;
        });
        if (Object.keys(toLoad).length || Object.keys(pending).length) {
            this.queue.push({
                pending,
                pendingCount: Object.keys(pending).length,
                loaded: {},
                errors: [],
                callback,
            });
        }
        return {
            toLoad: Object.keys(toLoad),
            pending: Object.keys(pending),
            toLoadLanguages: Object.keys(toLoadLanguages),
            toLoadNamespaces: Object.keys(toLoadNamespaces),
        };
    }
    loaded(name, err, data) {
        const s = name.split('|');
        const lng = s[0];
        const ns = s[1];
        if (err) this.emit('failedLoading', lng, ns, err);
        if (!err && data) {
            this.store.addResourceBundle(lng, ns, data, undefined, undefined, {
                skipCopy: true,
            });
        }
        this.state[name] = err ? -1 : 2;
        if (err && data) this.state[name] = 0;
        const loaded = {};
        this.queue.forEach((q) => {
            pushPath(q.loaded, [lng], ns);
            removePending(q, name);
            if (err) q.errors.push(err);
            if (q.pendingCount === 0 && !q.done) {
                Object.keys(q.loaded).forEach((l) => {
                    if (!loaded[l]) loaded[l] = {};
                    const loadedKeys = q.loaded[l];
                    if (loadedKeys.length) {
                        loadedKeys.forEach((n) => {
                            if (loaded[l][n] === undefined) loaded[l][n] = true;
                        });
                    }
                });
                q.done = true;
                if (q.errors.length) {
                    q.callback(q.errors);
                } else {
                    q.callback();
                }
            }
        });
        this.emit('loaded', loaded);
        this.queue = this.queue.filter((q) => !q.done);
    }
    read(lng, ns, fcName) {
        let tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        let wait =
            arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.retryTimeout;
        let callback = arguments.length > 5 ? arguments[5] : undefined;
        if (!lng.length) return callback(null, {});
        if (this.readingCalls >= this.maxParallelReads) {
            this.waitingReads.push({
                lng,
                ns,
                fcName,
                tried,
                wait,
                callback,
            });
            return;
        }
        this.readingCalls++;
        const resolver = (err, data) => {
            this.readingCalls--;
            if (this.waitingReads.length > 0) {
                const next = this.waitingReads.shift();
                this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
            }
            if (err && data && tried < this.maxRetries) {
                setTimeout(() => {
                    this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
                }, wait);
                return;
            }
            callback(err, data);
        };
        const fc = this.backend[fcName].bind(this.backend);
        if (fc.length === 2) {
            try {
                const r = fc(lng, ns);
                if (r && typeof r.then === 'function') {
                    r.then((data) => resolver(null, data)).catch(resolver);
                } else {
                    resolver(null, r);
                }
            } catch (err) {
                resolver(err);
            }
            return;
        }
        return fc(lng, ns, resolver);
    }
    prepareLoading(languages, namespaces) {
        let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        let callback = arguments.length > 3 ? arguments[3] : undefined;
        if (!this.backend) {
            this.logger.warn('No backend was added via i18next.use. Will not load resources.');
            return callback && callback();
        }
        if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
        if (isString(namespaces)) namespaces = [namespaces];
        const toLoad = this.queueLoad(languages, namespaces, options, callback);
        if (!toLoad.toLoad.length) {
            if (!toLoad.pending.length) callback();
            return null;
        }
        toLoad.toLoad.forEach((name) => {
            this.loadOne(name);
        });
    }
    load(languages, namespaces, callback) {
        this.prepareLoading(languages, namespaces, {}, callback);
    }
    reload(languages, namespaces, callback) {
        this.prepareLoading(
            languages,
            namespaces,
            {
                reload: true,
            },
            callback,
        );
    }
    loadOne(name) {
        let prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        const s = name.split('|');
        const lng = s[0];
        const ns = s[1];
        this.read(lng, ns, 'read', undefined, undefined, (err, data) => {
            if (err)
                this.logger.warn(
                    `${prefix}loading namespace ${ns} for language ${lng} failed`,
                    err,
                );
            if (!err && data)
                this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
            this.loaded(name, err, data);
        });
    }
    saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
        let options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
        let clb = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : () => {};
        if (
            this.services?.utils?.hasLoadedNamespace &&
            !this.services?.utils?.hasLoadedNamespace(namespace)
        ) {
            this.logger.warn(
                `did not save key "${key}" as the namespace "${namespace}" was not yet loaded`,
                'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!',
            );
            return;
        }
        if (key === undefined || key === null || key === '') return;
        if (this.backend?.create) {
            const opts = {
                ...options,
                isUpdate,
            };
            const fc = this.backend.create.bind(this.backend);
            if (fc.length < 6) {
                try {
                    let r;
                    if (fc.length === 5) {
                        r = fc(languages, namespace, key, fallbackValue, opts);
                    } else {
                        r = fc(languages, namespace, key, fallbackValue);
                    }
                    if (r && typeof r.then === 'function') {
                        r.then((data) => clb(null, data)).catch(clb);
                    } else {
                        clb(null, r);
                    }
                } catch (err) {
                    clb(err);
                }
            } else {
                fc(languages, namespace, key, fallbackValue, clb, opts);
            }
        }
        if (!languages || !languages[0]) return;
        this.store.addResource(languages[0], namespace, key, fallbackValue);
    }
}

const get = () => ({
    debug: false,
    initAsync: true,
    ns: ['translation'],
    defaultNS: ['translation'],
    fallbackLng: ['dev'],
    fallbackNS: false,
    supportedLngs: false,
    nonExplicitSupportedLngs: false,
    load: 'all',
    preload: false,
    simplifyPluralSuffix: true,
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
    partialBundledLanguages: false,
    saveMissing: false,
    updateMissing: false,
    saveMissingTo: 'fallback',
    saveMissingPlurals: true,
    missingKeyHandler: false,
    missingInterpolationHandler: false,
    postProcess: false,
    postProcessPassResolved: false,
    returnNull: false,
    returnEmptyString: true,
    returnObjects: false,
    joinArrays: false,
    returnedObjectHandler: false,
    parseMissingKeyHandler: false,
    appendNamespaceToMissingKey: false,
    appendNamespaceToCIMode: false,
    overloadTranslationOptionHandler: (args) => {
        let ret = {};
        if (typeof args[1] === 'object') ret = args[1];
        if (isString(args[1])) ret.defaultValue = args[1];
        if (isString(args[2])) ret.tDescription = args[2];
        if (typeof args[2] === 'object' || typeof args[3] === 'object') {
            const options = args[3] || args[2];
            Object.keys(options).forEach((key) => {
                ret[key] = options[key];
            });
        }
        return ret;
    },
    interpolation: {
        escapeValue: true,
        format: (value) => value,
        prefix: '{{',
        suffix: '}}',
        formatSeparator: ',',
        unescapePrefix: '-',
        nestingPrefix: '$t(',
        nestingSuffix: ')',
        nestingOptionsSeparator: ',',
        maxReplaces: 1000,
        skipOnVariables: true,
    },
});
const transformOptions = (options) => {
    if (isString(options.ns)) options.ns = [options.ns];
    if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
    if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
    if (options.supportedLngs?.indexOf?.('cimode') < 0) {
        options.supportedLngs = options.supportedLngs.concat(['cimode']);
    }
    if (typeof options.initImmediate === 'boolean') options.initAsync = options.initImmediate;
    return options;
};

const noop = () => {};
const bindMemberFunctions = (inst) => {
    const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
    mems.forEach((mem) => {
        if (typeof inst[mem] === 'function') {
            inst[mem] = inst[mem].bind(inst);
        }
    });
};
class I18n extends EventEmitter {
    constructor() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        let callback = arguments.length > 1 ? arguments[1] : undefined;
        super();
        this.options = transformOptions(options);
        this.services = {};
        this.logger = baseLogger;
        this.modules = {
            external: [],
        };
        bindMemberFunctions(this);
        if (callback && !this.isInitialized && !options.isClone) {
            if (!this.options.initAsync) {
                this.init(options, callback);
                return this;
            }
            setTimeout(() => {
                this.init(options, callback);
            }, 0);
        }
    }
    init() {
        var _this = this;
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        let callback = arguments.length > 1 ? arguments[1] : undefined;
        this.isInitializing = true;
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        if (options.defaultNS == null && options.ns) {
            if (isString(options.ns)) {
                options.defaultNS = options.ns;
            } else if (options.ns.indexOf('translation') < 0) {
                options.defaultNS = options.ns[0];
            }
        }
        const defOpts = get();
        this.options = {
            ...defOpts,
            ...this.options,
            ...transformOptions(options),
        };
        this.options.interpolation = {
            ...defOpts.interpolation,
            ...this.options.interpolation,
        };
        if (options.keySeparator !== undefined) {
            this.options.userDefinedKeySeparator = options.keySeparator;
        }
        if (options.nsSeparator !== undefined) {
            this.options.userDefinedNsSeparator = options.nsSeparator;
        }
        const createClassOnDemand = (ClassOrObject) => {
            if (!ClassOrObject) return null;
            if (typeof ClassOrObject === 'function') return new ClassOrObject();
            return ClassOrObject;
        };
        if (!this.options.isClone) {
            if (this.modules.logger) {
                baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
            } else {
                baseLogger.init(null, this.options);
            }
            let formatter;
            if (this.modules.formatter) {
                formatter = this.modules.formatter;
            } else {
                formatter = Formatter;
            }
            const lu = new LanguageUtil(this.options);
            this.store = new ResourceStore(this.options.resources, this.options);
            const s = this.services;
            s.logger = baseLogger;
            s.resourceStore = this.store;
            s.languageUtils = lu;
            s.pluralResolver = new PluralResolver(lu, {
                prepend: this.options.pluralSeparator,
                simplifyPluralSuffix: this.options.simplifyPluralSuffix,
            });
            if (
                formatter &&
                (!this.options.interpolation.format ||
                    this.options.interpolation.format === defOpts.interpolation.format)
            ) {
                s.formatter = createClassOnDemand(formatter);
                s.formatter.init(s, this.options);
                this.options.interpolation.format = s.formatter.format.bind(s.formatter);
            }
            s.interpolator = new Interpolator(this.options);
            s.utils = {
                hasLoadedNamespace: this.hasLoadedNamespace.bind(this),
            };
            s.backendConnector = new Connector(
                createClassOnDemand(this.modules.backend),
                s.resourceStore,
                s,
                this.options,
            );
            s.backendConnector.on('*', function (event) {
                for (
                    var _len = arguments.length,
                        args = new Array(_len > 1 ? _len - 1 : 0),
                        _key = 1;
                    _key < _len;
                    _key++
                ) {
                    args[_key - 1] = arguments[_key];
                }
                _this.emit(event, ...args);
            });
            if (this.modules.languageDetector) {
                s.languageDetector = createClassOnDemand(this.modules.languageDetector);
                if (s.languageDetector.init)
                    s.languageDetector.init(s, this.options.detection, this.options);
            }
            if (this.modules.i18nFormat) {
                s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
                if (s.i18nFormat.init) s.i18nFormat.init(this);
            }
            this.translator = new Translator(this.services, this.options);
            this.translator.on('*', function (event) {
                for (
                    var _len2 = arguments.length,
                        args = new Array(_len2 > 1 ? _len2 - 1 : 0),
                        _key2 = 1;
                    _key2 < _len2;
                    _key2++
                ) {
                    args[_key2 - 1] = arguments[_key2];
                }
                _this.emit(event, ...args);
            });
            this.modules.external.forEach((m) => {
                if (m.init) m.init(this);
            });
        }
        this.format = this.options.interpolation.format;
        if (!callback) callback = noop;
        if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
            const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
            if (codes.length > 0 && codes[0] !== 'dev') this.options.lng = codes[0];
        }
        if (!this.services.languageDetector && !this.options.lng) {
            this.logger.warn('init: no languageDetector is used and no lng is defined');
        }
        const storeApi = [
            'getResource',
            'hasResourceBundle',
            'getResourceBundle',
            'getDataByLanguage',
        ];
        storeApi.forEach((fcName) => {
            this[fcName] = function () {
                return _this.store[fcName](...arguments);
            };
        });
        const storeApiChained = [
            'addResource',
            'addResources',
            'addResourceBundle',
            'removeResourceBundle',
        ];
        storeApiChained.forEach((fcName) => {
            this[fcName] = function () {
                _this.store[fcName](...arguments);
                return _this;
            };
        });
        const deferred = defer();
        const load = () => {
            const finish = (err, t) => {
                this.isInitializing = false;
                if (this.isInitialized && !this.initializedStoreOnce)
                    this.logger.warn(
                        'init: i18next is already initialized. You should call init just once!',
                    );
                this.isInitialized = true;
                if (!this.options.isClone) this.logger.log('initialized', this.options);
                this.emit('initialized', this.options);
                deferred.resolve(t);
                callback(err, t);
            };
            if (this.languages && !this.isInitialized) return finish(null, this.t.bind(this));
            this.changeLanguage(this.options.lng, finish);
        };
        if (this.options.resources || !this.options.initAsync) {
            load();
        } else {
            setTimeout(load, 0);
        }
        return deferred;
    }
    loadResources(language) {
        let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
        let usedCallback = callback;
        const usedLng = isString(language) ? language : this.language;
        if (typeof language === 'function') usedCallback = language;
        if (!this.options.resources || this.options.partialBundledLanguages) {
            if (
                usedLng?.toLowerCase() === 'cimode' &&
                (!this.options.preload || this.options.preload.length === 0)
            )
                return usedCallback();
            const toLoad = [];
            const append = (lng) => {
                if (!lng) return;
                if (lng === 'cimode') return;
                const lngs = this.services.languageUtils.toResolveHierarchy(lng);
                lngs.forEach((l) => {
                    if (l === 'cimode') return;
                    if (toLoad.indexOf(l) < 0) toLoad.push(l);
                });
            };
            if (!usedLng) {
                const fallbacks = this.services.languageUtils.getFallbackCodes(
                    this.options.fallbackLng,
                );
                fallbacks.forEach((l) => append(l));
            } else {
                append(usedLng);
            }
            this.options.preload?.forEach?.((l) => append(l));
            this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
                if (!e && !this.resolvedLanguage && this.language)
                    this.setResolvedLanguage(this.language);
                usedCallback(e);
            });
        } else {
            usedCallback(null);
        }
    }
    reloadResources(lngs, ns, callback) {
        const deferred = defer();
        if (typeof lngs === 'function') {
            callback = lngs;
            lngs = undefined;
        }
        if (typeof ns === 'function') {
            callback = ns;
            ns = undefined;
        }
        if (!lngs) lngs = this.languages;
        if (!ns) ns = this.options.ns;
        if (!callback) callback = noop;
        this.services.backendConnector.reload(lngs, ns, (err) => {
            deferred.resolve();
            callback(err);
        });
        return deferred;
    }
    use(module) {
        if (!module)
            throw new Error(
                'You are passing an undefined module! Please check the object you are passing to i18next.use()',
            );
        if (!module.type)
            throw new Error(
                'You are passing a wrong module! Please check the object you are passing to i18next.use()',
            );
        if (module.type === 'backend') {
            this.modules.backend = module;
        }
        if (module.type === 'logger' || (module.log && module.warn && module.error)) {
            this.modules.logger = module;
        }
        if (module.type === 'languageDetector') {
            this.modules.languageDetector = module;
        }
        if (module.type === 'i18nFormat') {
            this.modules.i18nFormat = module;
        }
        if (module.type === 'postProcessor') {
            postProcessor.addPostProcessor(module);
        }
        if (module.type === 'formatter') {
            this.modules.formatter = module;
        }
        if (module.type === '3rdParty') {
            this.modules.external.push(module);
        }
        return this;
    }
    setResolvedLanguage(l) {
        if (!l || !this.languages) return;
        if (['cimode', 'dev'].indexOf(l) > -1) return;
        for (let li = 0; li < this.languages.length; li++) {
            const lngInLngs = this.languages[li];
            if (['cimode', 'dev'].indexOf(lngInLngs) > -1) continue;
            if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
                this.resolvedLanguage = lngInLngs;
                break;
            }
        }
    }
    changeLanguage(lng, callback) {
        var _this2 = this;
        this.isLanguageChangingTo = lng;
        const deferred = defer();
        this.emit('languageChanging', lng);
        const setLngProps = (l) => {
            this.language = l;
            this.languages = this.services.languageUtils.toResolveHierarchy(l);
            this.resolvedLanguage = undefined;
            this.setResolvedLanguage(l);
        };
        const done = (err, l) => {
            if (l) {
                setLngProps(l);
                this.translator.changeLanguage(l);
                this.isLanguageChangingTo = undefined;
                this.emit('languageChanged', l);
                this.logger.log('languageChanged', l);
            } else {
                this.isLanguageChangingTo = undefined;
            }
            deferred.resolve(function () {
                return _this2.t(...arguments);
            });
            if (callback)
                callback(err, function () {
                    return _this2.t(...arguments);
                });
        };
        const setLng = (lngs) => {
            if (!lng && !lngs && this.services.languageDetector) lngs = [];
            const l = isString(lngs)
                ? lngs
                : this.services.languageUtils.getBestMatchFromCodes(lngs);
            if (l) {
                if (!this.language) {
                    setLngProps(l);
                }
                if (!this.translator.language) this.translator.changeLanguage(l);
                this.services.languageDetector?.cacheUserLanguage?.(l);
            }
            this.loadResources(l, (err) => {
                done(err, l);
            });
        };
        if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
            setLng(this.services.languageDetector.detect());
        } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
            if (this.services.languageDetector.detect.length === 0) {
                this.services.languageDetector.detect().then(setLng);
            } else {
                this.services.languageDetector.detect(setLng);
            }
        } else {
            setLng(lng);
        }
        return deferred;
    }
    getFixedT(lng, ns, keyPrefix) {
        var _this3 = this;
        const fixedT = function (key, opts) {
            let options;
            if (typeof opts !== 'object') {
                for (
                    var _len3 = arguments.length,
                        rest = new Array(_len3 > 2 ? _len3 - 2 : 0),
                        _key3 = 2;
                    _key3 < _len3;
                    _key3++
                ) {
                    rest[_key3 - 2] = arguments[_key3];
                }
                options = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
            } else {
                options = {
                    ...opts,
                };
            }
            options.lng = options.lng || fixedT.lng;
            options.lngs = options.lngs || fixedT.lngs;
            options.ns = options.ns || fixedT.ns;
            if (options.keyPrefix !== '')
                options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
            const keySeparator = _this3.options.keySeparator || '.';
            let resultKey;
            if (options.keyPrefix && Array.isArray(key)) {
                resultKey = key.map((k) => `${options.keyPrefix}${keySeparator}${k}`);
            } else {
                resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key}` : key;
            }
            return _this3.t(resultKey, options);
        };
        if (isString(lng)) {
            fixedT.lng = lng;
        } else {
            fixedT.lngs = lng;
        }
        fixedT.ns = ns;
        fixedT.keyPrefix = keyPrefix;
        return fixedT;
    }
    t() {
        for (
            var _len4 = arguments.length, args = new Array(_len4), _key4 = 0;
            _key4 < _len4;
            _key4++
        ) {
            args[_key4] = arguments[_key4];
        }
        return this.translator?.translate(...args);
    }
    exists() {
        for (
            var _len5 = arguments.length, args = new Array(_len5), _key5 = 0;
            _key5 < _len5;
            _key5++
        ) {
            args[_key5] = arguments[_key5];
        }
        return this.translator?.exists(...args);
    }
    setDefaultNamespace(ns) {
        this.options.defaultNS = ns;
    }
    hasLoadedNamespace(ns) {
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (!this.isInitialized) {
            this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
            return false;
        }
        if (!this.languages || !this.languages.length) {
            this.logger.warn(
                'hasLoadedNamespace: i18n.languages were undefined or empty',
                this.languages,
            );
            return false;
        }
        const lng = options.lng || this.resolvedLanguage || this.languages[0];
        const fallbackLng = this.options ? this.options.fallbackLng : false;
        const lastLng = this.languages[this.languages.length - 1];
        if (lng.toLowerCase() === 'cimode') return true;
        const loadNotPending = (l, n) => {
            const loadState = this.services.backendConnector.state[`${l}|${n}`];
            return loadState === -1 || loadState === 0 || loadState === 2;
        };
        if (options.precheck) {
            const preResult = options.precheck(this, loadNotPending);
            if (preResult !== undefined) return preResult;
        }
        if (this.hasResourceBundle(lng, ns)) return true;
        if (
            !this.services.backendConnector.backend ||
            (this.options.resources && !this.options.partialBundledLanguages)
        )
            return true;
        if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
        return false;
    }
    loadNamespaces(ns, callback) {
        const deferred = defer();
        if (!this.options.ns) {
            if (callback) callback();
            return Promise.resolve();
        }
        if (isString(ns)) ns = [ns];
        ns.forEach((n) => {
            if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
        });
        this.loadResources((err) => {
            deferred.resolve();
            if (callback) callback(err);
        });
        return deferred;
    }
    loadLanguages(lngs, callback) {
        const deferred = defer();
        if (isString(lngs)) lngs = [lngs];
        const preloaded = this.options.preload || [];
        const newLngs = lngs.filter(
            (lng) => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng),
        );
        if (!newLngs.length) {
            if (callback) callback();
            return Promise.resolve();
        }
        this.options.preload = preloaded.concat(newLngs);
        this.loadResources((err) => {
            deferred.resolve();
            if (callback) callback(err);
        });
        return deferred;
    }
    dir(lng) {
        if (!lng)
            lng =
                this.resolvedLanguage ||
                (this.languages?.length > 0 ? this.languages[0] : this.language);
        if (!lng) return 'rtl';
        const rtlLngs = [
            'ar',
            'shu',
            'sqr',
            'ssh',
            'xaa',
            'yhd',
            'yud',
            'aao',
            'abh',
            'abv',
            'acm',
            'acq',
            'acw',
            'acx',
            'acy',
            'adf',
            'ads',
            'aeb',
            'aec',
            'afb',
            'ajp',
            'apc',
            'apd',
            'arb',
            'arq',
            'ars',
            'ary',
            'arz',
            'auz',
            'avl',
            'ayh',
            'ayl',
            'ayn',
            'ayp',
            'bbz',
            'pga',
            'he',
            'iw',
            'ps',
            'pbt',
            'pbu',
            'pst',
            'prp',
            'prd',
            'ug',
            'ur',
            'ydd',
            'yds',
            'yih',
            'ji',
            'yi',
            'hbo',
            'men',
            'xmn',
            'fa',
            'jpr',
            'peo',
            'pes',
            'prs',
            'dv',
            'sam',
            'ckb',
        ];
        const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
        return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 ||
            lng.toLowerCase().indexOf('-arab') > 1
            ? 'rtl'
            : 'ltr';
    }
    static createInstance() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        let callback = arguments.length > 1 ? arguments[1] : undefined;
        return new I18n(options, callback);
    }
    cloneInstance() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
        const forkResourceStore = options.forkResourceStore;
        if (forkResourceStore) delete options.forkResourceStore;
        const mergedOptions = {
            ...this.options,
            ...options,
            ...{
                isClone: true,
            },
        };
        const clone = new I18n(mergedOptions);
        if (options.debug !== undefined || options.prefix !== undefined) {
            clone.logger = clone.logger.clone(options);
        }
        const membersToCopy = ['store', 'services', 'language'];
        membersToCopy.forEach((m) => {
            clone[m] = this[m];
        });
        clone.services = {
            ...this.services,
        };
        clone.services.utils = {
            hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone),
        };
        if (forkResourceStore) {
            const clonedData = Object.keys(this.store.data).reduce((prev, l) => {
                prev[l] = {
                    ...this.store.data[l],
                };
                return Object.keys(prev[l]).reduce((acc, n) => {
                    acc[n] = {
                        ...prev[l][n],
                    };
                    return acc;
                }, {});
            }, {});
            clone.store = new ResourceStore(clonedData, mergedOptions);
            clone.services.resourceStore = clone.store;
        }
        clone.translator = new Translator(clone.services, mergedOptions);
        clone.translator.on('*', function (event) {
            for (
                var _len6 = arguments.length,
                    args = new Array(_len6 > 1 ? _len6 - 1 : 0),
                    _key6 = 1;
                _key6 < _len6;
                _key6++
            ) {
                args[_key6 - 1] = arguments[_key6];
            }
            clone.emit(event, ...args);
        });
        clone.init(mergedOptions, callback);
        clone.translator.options = mergedOptions;
        clone.translator.backendConnector.services.utils = {
            hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone),
        };
        return clone;
    }
    toJSON() {
        return {
            options: this.options,
            store: this.store,
            language: this.language,
            languages: this.languages,
            resolvedLanguage: this.resolvedLanguage,
        };
    }
}
const instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;

instance.createInstance;
instance.dir;
instance.init;
instance.loadResources;
instance.reloadResources;
instance.use;
instance.changeLanguage;
instance.getFixedT;
instance.t;
instance.exists;
instance.setDefaultNamespace;
instance.hasLoadedNamespace;
instance.loadNamespaces;
instance.loadLanguages;

/**
 * @param {string} namespace The namespace to override
 * @returns {string} The new namespace name
 */
function getOverrideNamespace(namespace) {
    // This just needs to be different to the namespace, make it special
    // so it's clear what it is used for in case it ends up in some error
    // message or something
    return '--' + namespace + '-override';
}

/**
 * Creates a new i18next instance that is fully initialized.
 *
 * Call changeLanguage() on the returned object to change the language.
 *
 * @param {object} languages - Mapping from languages to translation objects
 * @param {string} lng - The default language
 * @param {string} fallback - The fallback language to use for unknown languages or untranslated keys
 * @param {string} [namespace] - The i18next namespace to load, defaults to 'translation'
 * @returns {import("i18next").i18n} A new independent i18next instance
 */
function createInstance$3(languages, lng, fallback, namespace) {
    if (namespace === undefined) {
        namespace = 'translation';
    }
    let overrideNamespace = getOverrideNamespace(namespace);

    var fallbackLng = [fallback, lng, ...Object.keys(languages)];

    var options = {
        lng: lng,
        fallbackLng: fallbackLng,
        debug: false,
        ns: [overrideNamespace, namespace],
        defaultNS: namespace,
        fallbackNS: namespace,
        initImmediate: false, // Don't init async (deprecated since v24)
        initAsync: false, // Don't init async
        resources: {},
    };

    Object.keys(languages).forEach(function (key) {
        options['resources'][key] = {[namespace]: languages[key]};
    });

    var i18n = instance.createInstance();
    i18n.init(options);
    console.assert(i18n.isInitialized);

    return i18n;
}

var error$1 = {
    'connection-to-server-refused': 'Verbindungs zum Server verweigert!',
    summary: 'Ein Fehler ist aufgetreten',
};
var de$2 = {
    'dbp-modal': {
        close: 'Schließen',
    },
    error: error$1,
};

var error = {
    'connection-to-server-refused': 'Connection to server refused!',
    summary: 'An error occurred',
};
var en$2 = {
    'dbp-modal': {
        close: 'Close',
    },
    error: error,
};

function createInstance$2() {
    return createInstance$3({en: en$2, de: de$2}, 'de', 'en');
}

// nb. This is for IE10 and lower _only_.
var supportCustomEvent = window.CustomEvent;
if (!supportCustomEvent || typeof supportCustomEvent === 'object') {
    supportCustomEvent = function CustomEvent(event, x) {
        x = x || {};
        var ev = document.createEvent('CustomEvent');
        ev.initCustomEvent(event, !!x.bubbles, !!x.cancelable, x.detail || null);
        return ev;
    };
    supportCustomEvent.prototype = window.Event.prototype;
}

/**
 * Dispatches the passed event to both an "on<type>" handler as well as via the
 * normal dispatch operation. Does not bubble.
 *
 * @param {!EventTarget} target
 * @param {!Event} event
 * @return {boolean}
 */
function safeDispatchEvent(target, event) {
    var check = 'on' + event.type.toLowerCase();
    if (typeof target[check] === 'function') {
        target[check](event);
    }
    return target.dispatchEvent(event);
}

/**
 * @param {Element} el to check for stacking context
 * @return {boolean} whether this el or its parents creates a stacking context
 */
function createsStackingContext(el) {
    while (el && el !== document.body) {
        var s = window.getComputedStyle(el);
        var invalid = function (k, ok) {
            return !(s[k] === undefined || s[k] === ok);
        };

        if (
            s.opacity < 1 ||
            invalid('zIndex', 'auto') ||
            invalid('transform', 'none') ||
            invalid('mixBlendMode', 'normal') ||
            invalid('filter', 'none') ||
            invalid('perspective', 'none') ||
            s['isolation'] === 'isolate' ||
            s.position === 'fixed' ||
            s.webkitOverflowScrolling === 'touch'
        ) {
            return true;
        }
        el = el.parentElement;
    }
    return false;
}

/**
 * Finds the nearest <dialog> from the passed element.
 *
 * @param {Element} el to search from
 * @return {HTMLDialogElement} dialog found
 */
function findNearestDialog(el) {
    while (el) {
        if (el.localName === 'dialog') {
            return /** @type {HTMLDialogElement} */ (el);
        }
        if (el.parentElement) {
            el = el.parentElement;
        } else if (el.parentNode) {
            el = el.parentNode.host;
        } else {
            el = null;
        }
    }
    return null;
}

/**
 * Blur the specified element, as long as it's not the HTML body element.
 * This works around an IE9/10 bug - blurring the body causes Windows to
 * blur the whole application.
 *
 * @param {Element} el to blur
 */
function safeBlur(el) {
    // Find the actual focused element when the active element is inside a shadow root
    while (el && el.shadowRoot && el.shadowRoot.activeElement) {
        el = el.shadowRoot.activeElement;
    }

    if (el && el.blur && el !== document.body) {
        el.blur();
    }
}

/**
 * @param {!NodeList} nodeList to search
 * @param {Node} node to find
 * @return {boolean} whether node is inside nodeList
 */
function inNodeList(nodeList, node) {
    for (var i = 0; i < nodeList.length; ++i) {
        if (nodeList[i] === node) {
            return true;
        }
    }
    return false;
}

/**
 * @param {HTMLFormElement} el to check
 * @return {boolean} whether this form has method="dialog"
 */
function isFormMethodDialog(el) {
    if (!el || !el.hasAttribute('method')) {
        return false;
    }
    return el.getAttribute('method').toLowerCase() === 'dialog';
}

/**
 * @param {!DocumentFragment|!Element} hostElement
 * @return {?Element}
 */
function findFocusableElementWithin(hostElement) {
    // Note that this is 'any focusable area'. This list is probably not exhaustive, but the
    // alternative involves stepping through and trying to focus everything.
    var opts = ['button', 'input', 'keygen', 'select', 'textarea'];
    var query = opts.map(function (el) {
        return el + ':not([disabled])';
    });
    // TODO(samthor): tabindex values that are not numeric are not focusable.
    query.push('[tabindex]:not([disabled]):not([tabindex=""])'); // tabindex != "", not disabled
    var target = hostElement.querySelector(query.join(', '));

    if (!target && 'attachShadow' in Element.prototype) {
        // If we haven't found a focusable target, see if the host element contains an element
        // which has a shadowRoot.
        // Recursively search for the first focusable item in shadow roots.
        var elems = hostElement.querySelectorAll('*');
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].tagName && elems[i].shadowRoot) {
                target = findFocusableElementWithin(elems[i].shadowRoot);
                if (target) {
                    break;
                }
            }
        }
    }
    return target;
}

/**
 * Determines if an element is attached to the DOM.
 * @param {Element} element to check
 * @return {boolean} whether the element is in DOM
 */
function isConnected(element) {
    return element.isConnected || document.body.contains(element);
}

/**
 * @param {!Event} event
 * @return {?Element}
 */
function findFormSubmitter(event) {
    if (event.submitter) {
        return event.submitter;
    }

    var form = event.target;
    if (!(form instanceof HTMLFormElement)) {
        return null;
    }

    var submitter = dialogPolyfill.formSubmitter;
    if (!submitter) {
        var target = event.target;
        var root = ('getRootNode' in target && target.getRootNode()) || document;
        submitter = root.activeElement;
    }

    if (!submitter || submitter.form !== form) {
        return null;
    }
    return submitter;
}

/**
 * @param {!Event} event
 */
function maybeHandleSubmit(event) {
    if (event.defaultPrevented) {
        return;
    }
    var form = /** @type {!HTMLFormElement} */ (event.target);

    // We'd have a value if we clicked on an imagemap.
    var value = dialogPolyfill.imagemapUseValue;
    var submitter = findFormSubmitter(event);
    if (value === null && submitter) {
        value = submitter.value;
    }

    // There should always be a dialog as this handler is added specifically on them, but check just
    // in case.
    var dialog = findNearestDialog(form);
    if (!dialog) {
        return;
    }

    // Prefer formmethod on the button.
    var formmethod =
        (submitter && submitter.getAttribute('formmethod')) || form.getAttribute('method');
    if (formmethod !== 'dialog') {
        return;
    }
    event.preventDefault();

    if (value != null) {
        // nb. we explicitly check against null/undefined
        dialog.close(value);
    } else {
        dialog.close();
    }
}

/**
 * @param {!HTMLDialogElement} dialog to upgrade
 * @constructor
 */
function dialogPolyfillInfo(dialog) {
    this.dialog_ = dialog;
    this.replacedStyleTop_ = false;
    this.openAsModal_ = false;

    // Set a11y role. Browsers that support dialog implicitly know this already.
    if (!dialog.hasAttribute('role')) {
        dialog.setAttribute('role', 'dialog');
    }

    dialog.show = this.show.bind(this);
    dialog.showModal = this.showModal.bind(this);
    dialog.close = this.close.bind(this);

    dialog.addEventListener('submit', maybeHandleSubmit, false);

    if (!('returnValue' in dialog)) {
        dialog.returnValue = '';
    }

    if ('MutationObserver' in window) {
        var mo = new MutationObserver(this.maybeHideModal.bind(this));
        mo.observe(dialog, {attributes: true, attributeFilter: ['open']});
    } else {
        // IE10 and below support. Note that DOMNodeRemoved etc fire _before_ removal. They also
        // seem to fire even if the element was removed as part of a parent removal. Use the removed
        // events to force downgrade (useful if removed/immediately added).
        var removed = false;
        var cb = function () {
            removed ? this.downgradeModal() : this.maybeHideModal();
            removed = false;
        }.bind(this);
        var timeout;
        var delayModel = function (ev) {
            if (ev.target !== dialog) {
                return;
            } // not for a child element
            var cand = 'DOMNodeRemoved';
            removed |= ev.type.substr(0, cand.length) === cand;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(cb, 0);
        };
        ['DOMAttrModified', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument'].forEach(
            function (name) {
                dialog.addEventListener(name, delayModel);
            },
        );
    }
    // Note that the DOM is observed inside DialogManager while any dialog
    // is being displayed as a modal, to catch modal removal from the DOM.

    Object.defineProperty(dialog, 'open', {
        set: this.setOpen.bind(this),
        get: dialog.hasAttribute.bind(dialog, 'open'),
    });

    this.backdrop_ = document.createElement('div');
    this.backdrop_.className = 'backdrop';
    this.backdrop_.addEventListener('mouseup', this.backdropMouseEvent_.bind(this));
    this.backdrop_.addEventListener('mousedown', this.backdropMouseEvent_.bind(this));
    this.backdrop_.addEventListener('click', this.backdropMouseEvent_.bind(this));
}

dialogPolyfillInfo.prototype = /** @type {HTMLDialogElement.prototype} */ ({
    get dialog() {
        return this.dialog_;
    },

    /**
     * Maybe remove this dialog from the modal top layer. This is called when
     * a modal dialog may no longer be tenable, e.g., when the dialog is no
     * longer open or is no longer part of the DOM.
     */
    maybeHideModal: function () {
        if (this.dialog_.hasAttribute('open') && isConnected(this.dialog_)) {
            return;
        }
        this.downgradeModal();
    },

    /**
     * Remove this dialog from the modal top layer, leaving it as a non-modal.
     */
    downgradeModal: function () {
        if (!this.openAsModal_) {
            return;
        }
        this.openAsModal_ = false;
        this.dialog_.style.zIndex = '';

        // This won't match the native <dialog> exactly because if the user set top on a centered
        // polyfill dialog, that top gets thrown away when the dialog is closed. Not sure it's
        // possible to polyfill this perfectly.
        if (this.replacedStyleTop_) {
            this.dialog_.style.top = '';
            this.replacedStyleTop_ = false;
        }

        // Clear the backdrop and remove from the manager.
        this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_);
        dialogPolyfill.dm.removeDialog(this);
    },

    /**
     * @param {boolean} value whether to open or close this dialog
     */
    setOpen: function (value) {
        if (value) {
            this.dialog_.hasAttribute('open') || this.dialog_.setAttribute('open', '');
        } else {
            this.dialog_.removeAttribute('open');
            this.maybeHideModal(); // nb. redundant with MutationObserver
        }
    },

    /**
     * Handles mouse events ('mouseup', 'mousedown', 'click') on the fake .backdrop element, redirecting them as if
     * they were on the dialog itself.
     *
     * @param {!Event} e to redirect
     */
    backdropMouseEvent_: function (e) {
        if (!this.dialog_.hasAttribute('tabindex')) {
            // Clicking on the backdrop should move the implicit cursor, even if dialog cannot be
            // focused. Create a fake thing to focus on. If the backdrop was _before_ the dialog, this
            // would not be needed - clicks would move the implicit cursor there.
            var fake = document.createElement('div');
            this.dialog_.insertBefore(fake, this.dialog_.firstChild);
            fake.tabIndex = -1;
            fake.focus();
            this.dialog_.removeChild(fake);
        } else {
            this.dialog_.focus();
        }

        var redirectedEvent = document.createEvent('MouseEvents');
        redirectedEvent.initMouseEvent(
            e.type,
            e.bubbles,
            e.cancelable,
            window,
            e.detail,
            e.screenX,
            e.screenY,
            e.clientX,
            e.clientY,
            e.ctrlKey,
            e.altKey,
            e.shiftKey,
            e.metaKey,
            e.button,
            e.relatedTarget,
        );
        this.dialog_.dispatchEvent(redirectedEvent);
        e.stopPropagation();
    },

    /**
     * Focuses on the first focusable element within the dialog. This will always blur the current
     * focus, even if nothing within the dialog is found.
     */
    focus_: function () {
        // Find element with `autofocus` attribute, or fall back to the first form/tabindex control.
        var target = this.dialog_.querySelector('[autofocus]:not([disabled])');
        if (!target && this.dialog_.tabIndex >= 0) {
            target = this.dialog_;
        }
        if (!target) {
            target = findFocusableElementWithin(this.dialog_);
        }
        safeBlur(document.activeElement);
        target && target.focus();
    },

    /**
     * Sets the zIndex for the backdrop and dialog.
     *
     * @param {number} dialogZ
     * @param {number} backdropZ
     */
    updateZIndex: function (dialogZ, backdropZ) {
        if (dialogZ < backdropZ) {
            throw new Error('dialogZ should never be < backdropZ');
        }
        this.dialog_.style.zIndex = dialogZ;
        this.backdrop_.style.zIndex = backdropZ;
    },

    /**
     * Shows the dialog. If the dialog is already open, this does nothing.
     */
    show: function () {
        if (!this.dialog_.open) {
            this.setOpen(true);
            this.focus_();
        }
    },

    /**
     * Show this dialog modally.
     */
    showModal: function () {
        if (this.dialog_.hasAttribute('open')) {
            throw new Error(
                "Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally.",
            );
        }
        if (!isConnected(this.dialog_)) {
            throw new Error(
                "Failed to execute 'showModal' on dialog: The element is not in a Document.",
            );
        }
        if (!dialogPolyfill.dm.pushDialog(this)) {
            throw new Error(
                "Failed to execute 'showModal' on dialog: There are too many open modal dialogs.",
            );
        }

        if (createsStackingContext(this.dialog_.parentElement)) {
            console.warn(
                'A dialog is being shown inside a stacking context. ' +
                    'This may cause it to be unusable. For more information, see this link: ' +
                    'https://github.com/GoogleChrome/dialog-polyfill/#stacking-context',
            );
        }

        this.setOpen(true);
        this.openAsModal_ = true;

        // Optionally center vertically, relative to the current viewport.
        if (dialogPolyfill.needsCentering(this.dialog_)) {
            dialogPolyfill.reposition(this.dialog_);
            this.replacedStyleTop_ = true;
        } else {
            this.replacedStyleTop_ = false;
        }

        // Insert backdrop.
        this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling);

        // Focus on whatever inside the dialog.
        this.focus_();
    },

    /**
     * Closes this HTMLDialogElement. This is optional vs clearing the open
     * attribute, however this fires a 'close' event.
     *
     * @param {string=} opt_returnValue to use as the returnValue
     */
    close: function (opt_returnValue) {
        if (!this.dialog_.hasAttribute('open')) {
            throw new Error(
                "Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed.",
            );
        }
        this.setOpen(false);

        // Leave returnValue untouched in case it was set directly on the element
        if (opt_returnValue !== undefined) {
            this.dialog_.returnValue = opt_returnValue;
        }

        // Triggering "close" event for any attached listeners on the <dialog>.
        var closeEvent = new supportCustomEvent('close', {
            bubbles: false,
            cancelable: false,
        });
        safeDispatchEvent(this.dialog_, closeEvent);
    },
});

var dialogPolyfill = {};

dialogPolyfill.reposition = function (element) {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var topValue = scrollTop + (window.innerHeight - element.offsetHeight) / 2;
    element.style.top = Math.max(scrollTop, topValue) + 'px';
};

dialogPolyfill.isInlinePositionSetByStylesheet = function (element) {
    for (var i = 0; i < document.styleSheets.length; ++i) {
        var styleSheet = document.styleSheets[i];
        var cssRules = null;
        // Some browsers throw on cssRules.
        try {
            cssRules = styleSheet.cssRules;
        } catch (e) {}
        if (!cssRules) {
            continue;
        }
        for (var j = 0; j < cssRules.length; ++j) {
            var rule = cssRules[j];
            var selectedNodes = null;
            // Ignore errors on invalid selector texts.
            try {
                selectedNodes = document.querySelectorAll(rule.selectorText);
            } catch (e) {}
            if (!selectedNodes || !inNodeList(selectedNodes, element)) {
                continue;
            }
            var cssTop = rule.style.getPropertyValue('top');
            var cssBottom = rule.style.getPropertyValue('bottom');
            if ((cssTop && cssTop !== 'auto') || (cssBottom && cssBottom !== 'auto')) {
                return true;
            }
        }
    }
    return false;
};

dialogPolyfill.needsCentering = function (dialog) {
    var computedStyle = window.getComputedStyle(dialog);
    if (computedStyle.position !== 'absolute') {
        return false;
    }

    // We must determine whether the top/bottom specified value is non-auto.  In
    // WebKit/Blink, checking computedStyle.top == 'auto' is sufficient, but
    // Firefox returns the used value. So we do this crazy thing instead: check
    // the inline style and then go through CSS rules.
    if (
        (dialog.style.top !== 'auto' && dialog.style.top !== '') ||
        (dialog.style.bottom !== 'auto' && dialog.style.bottom !== '')
    ) {
        return false;
    }
    return !dialogPolyfill.isInlinePositionSetByStylesheet(dialog);
};

/**
 * @param {!Element} element to force upgrade
 */
dialogPolyfill.forceRegisterDialog = function (element) {
    if (window.HTMLDialogElement || element.showModal) {
        console.warn(
            'This browser already supports <dialog>, the polyfill ' + 'may not work correctly',
            element,
        );
    }
    if (element.localName !== 'dialog') {
        throw new Error('Failed to register dialog: The element is not a dialog.');
    }
    new dialogPolyfillInfo(/** @type {!HTMLDialogElement} */ (element));
};

/**
 * @param {!Element} element to upgrade, if necessary
 */
dialogPolyfill.registerDialog = function (element) {
    if (!element.showModal) {
        dialogPolyfill.forceRegisterDialog(element);
    }
};

/**
 * @constructor
 */
dialogPolyfill.DialogManager = function () {
    /** @type {!Array<!dialogPolyfillInfo>} */
    this.pendingDialogStack = [];

    var checkDOM = this.checkDOM_.bind(this);

    // The overlay is used to simulate how a modal dialog blocks the document.
    // The blocking dialog is positioned on top of the overlay, and the rest of
    // the dialogs on the pending dialog stack are positioned below it. In the
    // actual implementation, the modal dialog stacking is controlled by the
    // top layer, where z-index has no effect.
    this.overlay = document.createElement('div');
    this.overlay.className = '_dialog_overlay';
    this.overlay.addEventListener(
        'click',
        function (e) {
            this.forwardTab_ = undefined;
            e.stopPropagation();
            checkDOM([]); // sanity-check DOM
        }.bind(this),
    );

    this.handleKey_ = this.handleKey_.bind(this);
    this.handleFocus_ = this.handleFocus_.bind(this);

    this.zIndexLow_ = 100000;
    this.zIndexHigh_ = 100000 + 150;

    this.forwardTab_ = undefined;

    if ('MutationObserver' in window) {
        this.mo_ = new MutationObserver(function (records) {
            var removed = [];
            records.forEach(function (rec) {
                for (var i = 0, c; (c = rec.removedNodes[i]); ++i) {
                    if (!(c instanceof Element)) {
                        continue;
                    } else if (c.localName === 'dialog') {
                        removed.push(c);
                    }
                    removed = removed.concat(c.querySelectorAll('dialog'));
                }
            });
            removed.length && checkDOM(removed);
        });
    }
};

/**
 * Called on the first modal dialog being shown. Adds the overlay and related
 * handlers.
 */
dialogPolyfill.DialogManager.prototype.blockDocument = function () {
    document.documentElement.addEventListener('focus', this.handleFocus_, true);
    document.addEventListener('keydown', this.handleKey_);
    this.mo_ && this.mo_.observe(document, {childList: true, subtree: true});
};

/**
 * Called on the first modal dialog being removed, i.e., when no more modal
 * dialogs are visible.
 */
dialogPolyfill.DialogManager.prototype.unblockDocument = function () {
    document.documentElement.removeEventListener('focus', this.handleFocus_, true);
    document.removeEventListener('keydown', this.handleKey_);
    this.mo_ && this.mo_.disconnect();
};

/**
 * Updates the stacking of all known dialogs.
 */
dialogPolyfill.DialogManager.prototype.updateStacking = function () {
    var zIndex = this.zIndexHigh_;

    for (var i = 0, dpi; (dpi = this.pendingDialogStack[i]); ++i) {
        dpi.updateZIndex(--zIndex, --zIndex);
        if (i === 0) {
            this.overlay.style.zIndex = --zIndex;
        }
    }

    // Make the overlay a sibling of the dialog itself.
    var last = this.pendingDialogStack[0];
    if (last) {
        var p = last.dialog.parentNode || document.body;
        p.appendChild(this.overlay);
    } else if (this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
    }
};

/**
 * @param {Element} candidate to check if contained or is the top-most modal dialog
 * @return {boolean} whether candidate is contained in top dialog
 */
dialogPolyfill.DialogManager.prototype.containedByTopDialog_ = function (candidate) {
    while ((candidate = findNearestDialog(candidate))) {
        for (var i = 0, dpi; (dpi = this.pendingDialogStack[i]); ++i) {
            if (dpi.dialog === candidate) {
                return i === 0; // only valid if top-most
            }
        }
        candidate = candidate.parentElement;
    }
    return false;
};

dialogPolyfill.DialogManager.prototype.handleFocus_ = function (event) {
    var target = event.composedPath ? event.composedPath()[0] : event.target;

    if (this.containedByTopDialog_(target)) {
        return;
    }

    if (document.activeElement === document.documentElement) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    safeBlur(/** @type {Element} */ (target));

    if (this.forwardTab_ === undefined) {
        return;
    } // move focus only from a tab key

    var dpi = this.pendingDialogStack[0];
    var dialog = dpi.dialog;
    var position = dialog.compareDocumentPosition(target);
    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        if (this.forwardTab_) {
            // forward
            dpi.focus_();
        } else if (target !== document.documentElement) {
            // backwards if we're not already focused on <html>
            document.documentElement.focus();
        }
    }

    return false;
};

dialogPolyfill.DialogManager.prototype.handleKey_ = function (event) {
    this.forwardTab_ = undefined;
    if (event.keyCode === 27) {
        event.preventDefault();
        event.stopPropagation();
        var cancelEvent = new supportCustomEvent('cancel', {
            bubbles: false,
            cancelable: true,
        });
        var dpi = this.pendingDialogStack[0];
        if (dpi && safeDispatchEvent(dpi.dialog, cancelEvent)) {
            dpi.dialog.close();
        }
    } else if (event.keyCode === 9) {
        this.forwardTab_ = !event.shiftKey;
    }
};

/**
 * Finds and downgrades any known modal dialogs that are no longer displayed. Dialogs that are
 * removed and immediately readded don't stay modal, they become normal.
 *
 * @param {!Array<!HTMLDialogElement>} removed that have definitely been removed
 */
dialogPolyfill.DialogManager.prototype.checkDOM_ = function (removed) {
    // This operates on a clone because it may cause it to change. Each change also calls
    // updateStacking, which only actually needs to happen once. But who removes many modal dialogs
    // at a time?!
    var clone = this.pendingDialogStack.slice();
    clone.forEach(function (dpi) {
        if (removed.indexOf(dpi.dialog) !== -1) {
            dpi.downgradeModal();
        } else {
            dpi.maybeHideModal();
        }
    });
};

/**
 * @param {!dialogPolyfillInfo} dpi
 * @return {boolean} whether the dialog was allowed
 */
dialogPolyfill.DialogManager.prototype.pushDialog = function (dpi) {
    var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;
    if (this.pendingDialogStack.length >= allowed) {
        return false;
    }
    if (this.pendingDialogStack.unshift(dpi) === 1) {
        this.blockDocument();
    }
    this.updateStacking();
    return true;
};

/**
 * @param {!dialogPolyfillInfo} dpi
 */
dialogPolyfill.DialogManager.prototype.removeDialog = function (dpi) {
    var index = this.pendingDialogStack.indexOf(dpi);
    if (index === -1) {
        return;
    }

    this.pendingDialogStack.splice(index, 1);
    if (this.pendingDialogStack.length === 0) {
        this.unblockDocument();
    }
    this.updateStacking();
};

dialogPolyfill.dm = new dialogPolyfill.DialogManager();
dialogPolyfill.formSubmitter = null;
dialogPolyfill.imagemapUseValue = null;

/**
 * Installs global handlers, such as click listers and native method overrides. These are needed
 * even if a no dialog is registered, as they deal with <form method="dialog">.
 */
if (window.HTMLDialogElement === undefined) {
    /**
     * If HTMLFormElement translates method="DIALOG" into 'get', then replace the descriptor with
     * one that returns the correct value.
     */
    var testForm = document.createElement('form');
    testForm.setAttribute('method', 'dialog');
    if (testForm.method !== 'dialog') {
        var methodDescriptor = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, 'method');
        if (methodDescriptor) {
            // nb. Some older iOS and older PhantomJS fail to return the descriptor. Don't do anything
            // and don't bother to update the element.
            var realGet = methodDescriptor.get;
            methodDescriptor.get = function () {
                if (isFormMethodDialog(this)) {
                    return 'dialog';
                }
                return realGet.call(this);
            };
            var realSet = methodDescriptor.set;
            /** @this {HTMLElement} */
            methodDescriptor.set = function (v) {
                if (typeof v === 'string' && v.toLowerCase() === 'dialog') {
                    return this.setAttribute('method', v);
                }
                return realSet.call(this, v);
            };
            Object.defineProperty(HTMLFormElement.prototype, 'method', methodDescriptor);
        }
    }

    /**
     * Global 'click' handler, to capture the <input type="submit"> or <button> element which has
     * submitted a <form method="dialog">. Needed as Safari and others don't report this inside
     * document.activeElement.
     */
    document.addEventListener(
        'click',
        function (ev) {
            dialogPolyfill.formSubmitter = null;
            dialogPolyfill.imagemapUseValue = null;
            if (ev.defaultPrevented) {
                return;
            } // e.g. a submit which prevents default submission

            var target = /** @type {Element} */ (ev.target);
            if ('composedPath' in ev) {
                var path = ev.composedPath();
                target = path.shift() || target;
            }
            if (!target || !isFormMethodDialog(target.form)) {
                return;
            }

            var valid =
                target.type === 'submit' && ['button', 'input'].indexOf(target.localName) > -1;
            if (!valid) {
                if (!(target.localName === 'input' && target.type === 'image')) {
                    return;
                }
                // this is a <input type="image">, which can submit forms
                dialogPolyfill.imagemapUseValue = ev.offsetX + ',' + ev.offsetY;
            }

            var dialog = findNearestDialog(target);
            if (!dialog) {
                return;
            }

            dialogPolyfill.formSubmitter = target;
        },
        false,
    );

    /**
     * Global 'submit' handler. This handles submits of `method="dialog"` which are invalid, i.e.,
     * outside a dialog. They get prevented.
     */
    document.addEventListener('submit', function (ev) {
        var form = ev.target;
        var dialog = findNearestDialog(form);
        if (dialog) {
            return; // ignore, handle there
        }

        var submitter = findFormSubmitter(ev);
        var formmethod =
            (submitter && submitter.getAttribute('formmethod')) || form.getAttribute('method');
        if (formmethod === 'dialog') {
            ev.preventDefault();
        }
    });

    /**
     * Replace the native HTMLFormElement.submit() method, as it won't fire the
     * submit event and give us a chance to respond.
     */
    var nativeFormSubmit = HTMLFormElement.prototype.submit;
    var replacementFormSubmit = function () {
        if (!isFormMethodDialog(this)) {
            return nativeFormSubmit.call(this);
        }
        var dialog = findNearestDialog(this);
        dialog && dialog.close();
    };
    HTMLFormElement.prototype.submit = replacementFormSubmit;
}

/**
 * A mixin that adds internationalization (i18next) support to a base class.
 */
const LangMixin = (superClass, i18nFactory, propertyName = '_i18n') =>
    class extends superClass {
        constructor() {
            super();
            this[propertyName] = i18nFactory();
            this.lang = this[propertyName].language;
        }

        static get properties() {
            return {
                ...super.properties,
                lang: {type: String},
            };
        }

        update(changedProperties) {
            changedProperties.forEach((oldValue, propName) => {
                if (propName === 'lang') {
                    this[propertyName].changeLanguage(this.lang);
                }
            });

            super.update(changedProperties);
        }
    };

class Modal extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance$2) {
    constructor() {
        super();
        /** @type {HTMLDialogElement} */
        this.modalDialog = null;
        /** @type {string} */
        this.modalId = 'dbp-modal-id';
        /** @type {string} */
        this.title = '';
        /** @type {boolean} */
        this.stickyFooter = false;
        /** @type {number} */
        this.modalPaddingTopDefault;
    }

    static get properties() {
        return {
            modalId: {type: String, attribute: 'modal-id'},
            title: {type: String},
            stickyFooter: {type: Boolean, attribute: 'sticky-footer'},
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
    }

    firstUpdated() {
        this.modalDialog = /** @type {HTMLDialogElement} */ (this._('#' + this.modalId));
        dialogPolyfill.registerDialog(this.modalDialog);

        // Save default value of padding top changed when adding/removing notifications
        this.modalPaddingTopDefault = parseInt(
            window.getComputedStyle(this.modalDialog).paddingTop,
        );

        this.modalDialog.addEventListener('close', (event) => {
            // Re allow scrolling the page when dialog is closed
            const htmlElement = this.modalDialog.ownerDocument.documentElement;
            htmlElement.style.removeProperty('overflow');

            const customEvent = new CustomEvent('dbp-modal-closed', {
                detail: {id: this.modalId},
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(customEvent);
        });

        window.addEventListener('dbp-notification-send', (e) => {
            const notificationEvent = /** @type {CustomEvent} */ (e);
            const notificationId = notificationEvent.detail.targetNotificationId;
            this.updateModalNotificationPadding(notificationId);
        });

        this.addEventListener('dbp-notification-close', (e) => {
            e.stopPropagation();
            const notificationEvent = /** @type {CustomEvent} */ (e);
            const notificationId = notificationEvent.detail.targetNotificationId;
            this.updateModalNotificationPadding(notificationId);
        });
    }

    updateModalNotificationPadding(notificationId) {
        const notificationSlot = this.querySelector('[slot="header"]');
        if (!notificationSlot) {
            return;
        }

        const notificationComponent = notificationSlot.querySelector('#' + notificationId);
        if (!notificationComponent || !notificationComponent.shadowRoot) {
            return;
        }

        /** @type {HTMLElement} */
        const notificationContainer =
            notificationComponent.shadowRoot.querySelector('#notification-container');
        // Get height of notification and add as padding top to the top of the modal
        if (notificationContainer) {
            const modalPosition = this.modalDialog.getBoundingClientRect();
            const modalPaddingTopCurrent = parseInt(
                window.getComputedStyle(this.modalDialog).getPropertyValue('padding-top'),
            );
            const modalPaddingTopDefault = this.modalPaddingTopDefault;
            const notificationContainerHeight =
                notificationContainer.offsetHeight + modalPaddingTopDefault;

            // Until there is more than 1 notification place over the modal add padding top and translate the modal up
            // If the padding top is greater than the notification container height, reduce the padding top and translate the modal up
            if (modalPosition.top > 150 || modalPaddingTopCurrent > notificationContainerHeight) {
                this.modalDialog.style.setProperty(
                    '--dbp-modal-padding-top',
                    notificationContainerHeight + 'px',
                );
                this.modalDialog.style.setProperty(
                    '--dbp-modal-translate-y',
                    notificationContainerHeight / -2 + 'px',
                );
            }
        }
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
        };
    }

    isOpen() {
        return this.modalDialog.open;
    }

    open() {
        // Don't open the dialog if it is already open
        if (this.modalDialog.open) {
            return;
        }

        // Prevent scrolling the page when dialog is open
        const htmlElement = this.modalDialog.ownerDocument.documentElement;
        htmlElement.style.overflow = 'hidden';

        this.modalDialog.showModal();
    }

    close() {
        this.modalDialog.close();
        // Remove all notifications if modal is closed
        const notificationSlot = this.querySelector('[slot="header"]');
        if (notificationSlot) {
            const notificationComponent = notificationSlot.querySelector('dbp-notification');
            if (notificationComponent && notificationComponent.shadowRoot) {
                notificationComponent.removeAllNotifications();
            }
        }
        // Reset modal padding and translation
        this.modalDialog.style.setProperty(
            '--dbp-modal-padding-top',
            this.modalPaddingTopDefault + 'px',
        );
        this.modalDialog.style.removeProperty('--dbp-modal-translate-y');
    }

    static get styles() {
        // language=css
        return i$4`
            ${getNativeModalDialogCSS()}
            ${getNativeModalDialogPrintCSS()}
        `;
    }

    render() {
        const i18n = this._i18n;

        return x`
            <dialog
                class="modal"
                id="${this.modalId}"
                autofocus
                role="alertdialog"
                aria-describedby="modal-content"
                aria-labelledby="modal-title">
                <div class="modal-container">
                    <header class="modal-header">
                        <div class="header-top">
                            <slot name="title">
                                <h3 class="modal-title" id="modal-title">${this.title}</h3>
                            </slot>
                            <button
                                title="${i18n.t('dbp-modal.close')}"
                                class="modal-close"
                                aria-label="${i18n.t('dbp-modal.close')}"
                                @click="${() => {
                                    this.close();
                                }}">
                                <dbp-icon
                                    title="${i18n.t('dbp-modal.close')}"
                                    name="close"
                                    class="close-icon"></dbp-icon>
                            </button>
                        </div>
                        <div class="header-bottom">
                            <slot name="header"></slot>
                        </div>
                    </header>
                    <main class="modal-content" id="modal-content">
                        <slot name="content"></slot>
                        ${
                            !this.stickyFooter
                                ? x`
                                  <footer class="modal-footer modal-footer--sticky">
                                      <slot name="footer"></slot>
                                  </footer>
                              `
                                : ''
                        }
                    </main>
                    ${
                        this.stickyFooter
                            ? x`
                              <footer class="modal-footer">
                                  <slot name="footer"></slot>
                              </footer>
                          `
                            : ''
                    }
                </div>
            </dialog>
        `;
    }
}

/**
 * Appends the second relative or absolute URL by treating
 * the base URL as the root path. Unlike normal URL join which
 * treats the host as root path.
 *
 * http://example.com/foo + bar -> http://example.com/foo/bar
 * http://example.com/foo/ + /bar -> http://example.com/foo/bar
 *
 * @param {string} baseURL The bas URL
 * @param {string} addedURL The URL to append ot the baseURL
 */
const combineURLs = (baseURL, addedURL) => {
    if (!baseURL.endsWith('/')) {
        baseURL += '/';
    }
    return new URL(addedURL.replace(/^\/+/, ''), baseURL).href;
};

const AuthMixin = dedupeMixin(
    (superClass) =>
        class extends superClass {
            static properties = {
                auth: {type: Object},
                ...superClass.properties,
            };

            constructor() {
                super();
                this.auth = null;
                this._previousAuthState = null;
                this._authPending = true;
            }

            update(changedProps) {
                if (changedProps.has('auth')) {
                    const prevAuth = this._previousAuthState || {};
                    const currentAuth = this.auth || {};

                    const wasLoggedIn = prevAuth['login-status'] === 'logged-in';
                    const wasLoggedOut = prevAuth['login-status'] === 'logged-out';
                    const isLoggedIn = currentAuth['login-status'] === 'logged-in';
                    const isLoggedOut = currentAuth['login-status'] === 'logged-out';

                    if (!wasLoggedIn && isLoggedIn) {
                        this._authPending = false;
                        this.loginCallback(currentAuth);
                    }
                    if (!wasLoggedOut && isLoggedOut) {
                        if (this._authPending) {
                            this._authPending = false;
                        } else {
                            this.logoutCallback();
                        }
                    }
                    this._previousAuthState = {...currentAuth};
                }
                super.update(changedProps);
            }

            /**
             * @returns {boolean} - True if the auth state is not settled yet.
             */
            isAuthPending() {
                return this._authPending;
            }

            /**
             * @returns {boolean} - True if the user is logged in, false otherwise.
             */
            isLoggedIn() {
                return this.auth && this.auth['login-status'] === 'logged-in';
            }

            /**
             * Called when user logs in, or on load when the user is logged in.
             * @param {object} auth - The auth state with login information, same as this.auth
             */
            loginCallback(auth) {}

            /**
             * Called when user logs out or was logged out. Only gets called if loginCallback()
             * was called before.
             */
            logoutCallback() {}
        },
);

class Provider extends HTMLElement {
    constructor() {
        super();
        this.callbackStore = [];
        this.root = false;

        // Previously we used direct properties like this["lang"] (instead of this.properties["lang"]) for storing the
        // properties, but the "lang" property seems to be updated before the event from the MutationObserver, so we
        // cannot observe a value change directly (as workaround we use another property (e.g. "langValue") instead of "lang")
        this.properties = {};

        // We need to store our own "last values" because we cannot be sure what the MutationObserver detects
        this.lastProperties = {};

        Logger$1.debug('Provider constructor()');
    }

    getProperty(name) {
        return this.properties[name];
    }

    setProperty(name, value) {
        this.lastProperties[name] = value;
        this.properties[name] = value;
    }

    hasPropertyChanged(name, value) {
        return this.lastProperties[name] !== value;
    }

    hasProperty(name) {
        return Object.hasOwnProperty.call(this.properties, name);
    }

    connectedCallback() {
        Logger$1.debug('Provider(' + this.id + ') connectedCallback()');

        const that = this;

        this.addEventListener(
            'dbp-subscribe',
            function (e) {
                const name = e.detail.name;
                if (that.hasProperty(name) || that.root) {
                    Logger$1.debug(
                        'Provider(' +
                            that.id +
                            ') eventListener("dbp-subscribe",..) name "' +
                            name +
                            '" found.',
                    );
                    that.callbackStore.push({
                        name: name,
                        callback: e.detail.callback,
                        sender: e.detail.sender,
                    });

                    e.detail.callback(that.getProperty(name));
                    e.stopPropagation();
                }
            },
            false,
        );

        this.addEventListener(
            'dbp-unsubscribe',
            function (e) {
                const name = e.detail.name;
                const sender = e.detail.sender;
                if (that.hasProperty(name) || that.root) {
                    Logger$1.debug(
                        'Provider(' +
                            that.id +
                            ') eventListener("dbp-unsubscribe",..) name "' +
                            name +
                            '" found.',
                    );
                    that.callbackStore.forEach((item) => {
                        if (item.sender === sender && item.name === name) {
                            const index = that.callbackStore.indexOf(item);
                            that.callbackStore.splice(index, 1);
                            Logger$1.debug(
                                'Provider(' +
                                    that.id +
                                    ') eventListener for name "' +
                                    name +
                                    '" removed.',
                            );
                        }
                    });

                    e.stopPropagation();
                }
            },
            false,
        );

        // listen to property changes
        this.addEventListener(
            'dbp-set-property',
            function (e) {
                const name = e.detail.name;
                const value = e.detail.value;

                if (that.hasProperty(name) || that.root) {
                    Logger$1.debug(
                        'Provider(' +
                            that.id +
                            ') eventListener("dbp-set-property",..) name "' +
                            name +
                            '" found.',
                    );
                    that.setProperty(name, value);

                    that.callbackStore.forEach((item) => {
                        if (item.name === name) {
                            item.callback(value);
                        }
                    });

                    e.stopPropagation();
                }
            },
            false,
        );

        // Options for the observer (which mutations to observe)
        const config = {attributes: true, childList: false, subtree: false};

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    const name = mutation.attributeName;
                    const value = that.getAttribute(name);

                    if (that.hasPropertyChanged(name, value)) {
                        Logger$1.debug(
                            'Provider (' + that.id + ') observed attribute "' + name + '" changed',
                        );
                        that.setProperty(name, value);

                        that.callbackStore.forEach((item) => {
                            if (item.name === name) {
                                item.callback(value);
                            }
                        });
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(this, config);

        // get all *not observed* attributes
        if (this.hasAttributes()) {
            const attrs = this.attributes;
            for (let i = attrs.length - 1; i >= 0; i--) {
                if (['id', 'class', 'style', 'data-tag-name'].includes(attrs[i].name)) {
                    continue;
                }

                this.setProperty(attrs[i].name, attrs[i].value);
                Logger$1.debug(
                    'Provider (' +
                        that.id +
                        ') found attribute "' +
                        attrs[i].name +
                        '" = "' +
                        attrs[i].value +
                        '"',
                );
            }
        }
    }

    get id() {
        return this.getAttribute('id');
    }
}

defineCustomElement('dbp-provider', Provider);

var consumer$1 = {
    item: 'Bezeichnung',
    price: 'Preis',
    sum: 'Summe',
};
var demo$1 = {
    consumer: 'Verbraucher',
    consumer_description: 'Verbraucher "{{id}}" abonniert nur {{subscriptions}}',
    provider: 'Anbieter',
    provider_description: 'Anbieter "{{id}}" {{description}}',
};
var de$1 = {
    consumer: consumer$1,
    demo: demo$1,
};

var consumer = {
    item: 'Description',
    price: 'Price',
    sum: 'sum',
};
var demo = {
    consumer: 'Consumer',
    consumer_description: 'Consumer "{{id}}" will only subscribe to {{subscriptions}}',
    provider: 'Provider',
    provider_description: 'Provider "{{id}}" {{description}}',
};
var en$1 = {
    consumer: consumer,
    demo: demo,
};

function createInstance$1() {
    return createInstance$3({en: en$1, de: de$1}, 'de', 'en');
}

var login$1 = 'Anmelden';
var logout$1 = 'Abmelden';
var de = {
    'logging-in': 'Anmeldung läuft',
    login: login$1,
    'login-failed': 'Kommunikation mit dem Anmeldeserver fehlgeschlagen',
    logout: logout$1,
};

var login = 'Login';
var logout = 'Logout';
var en = {
    'logging-in': 'Logging in',
    login: login,
    'login-failed': 'Communication with the login server failed',
    logout: logout,
};

function createInstance() {
    return createInstance$3({en: en, de: de}, 'de', 'en');
}

/**
 * @typedef {import('keycloak-js')} Keycloak
 */

const promiseTimeout = function (ms, promise) {
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms.');
        }, ms);
    });

    return Promise.race([promise, timeout]);
};

/**
 * Returns a URL for a relative path or URL
 *
 * @param {string} urlOrPath
 */
const ensureURL = function (urlOrPath) {
    try {
        return new URL(urlOrPath).href;
    } catch {
        return new URL(urlOrPath, window.location.href).href;
    }
};

/**
 * Wraps the keycloak API to support async/await, adds auto token refreshing and consolidates all
 * events into one native "changed" event
 *
 * The "changed" event has the real keycloak instance as "detail"
 */
class KeycloakWrapper extends EventTarget {
    /**
     * @param {string} baseURL
     * @param {string} realm
     * @param {string} clientId
     * @param {string} silentCheckSsoUri
     * @param {boolean} checkLoginIframe
     * @param {string} idpHint
     */
    constructor(baseURL, realm, clientId, silentCheckSsoUri, checkLoginIframe, idpHint) {
        super();

        this._baseURL = baseURL;
        this._realm = realm;
        this._clientId = clientId;
        this._keycloak = null;
        this._initPromise = null;
        this._silentCheckSsoUri = silentCheckSsoUri;
        this._checkLoginIframe = checkLoginIframe;
        this._idpHint = idpHint;
        this._checkId = null;

        /* Minimum validity of the token in seconds */
        this.MIN_VALIDITY = 20;

        /* Interval at which the token validity is checked, in seconds */
        this.CHECK_INTERVAL = 10;

        /* Enables extra debug logging */
        this.DEBUG = false;

        this._onVisibilityChanged = this._onVisibilityChanged.bind(this);
        document.addEventListener('visibilitychange', this._onVisibilityChanged);
    }

    /**
     * This needs to be called or the instance will leak;
     */
    close() {
        document.removeEventListener('visibilitychange', this._onVisibilityChanged);
    }

    _onVisibilityChanged() {
        let isVisible = document.visibilityState === 'visible';
        if (isVisible) {
            this._checkTokeHasExpired();
        }
    }

    _onChanged() {
        const event = new CustomEvent('changed', {
            detail: this._keycloak,
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    _onReady(authenticated) {
        // Avoid emitting changed when nothing has changed on init()
        if (authenticated) this._onChanged();
    }

    async _onTokenExpired() {
        console.log('Token has expired');
        let refreshed = false;

        try {
            // -1 means force a refresh
            refreshed = await this._keycloak.updateToken(-1);
        } catch (error) {
            console.log('Failed to refresh the token', error);
            return;
        }

        console.assert(refreshed, 'token should have been refreshed');
    }

    async _checkTokeHasExpired() {
        let refreshed;

        if (this._keycloak === null || !this._keycloak.authenticated) {
            return;
        }

        let minValidity = this.MIN_VALIDITY + this.CHECK_INTERVAL;
        if (this.DEBUG) {
            console.log(`Updating token if not valid for at least ${minValidity}s`);
        }
        try {
            refreshed = await this._keycloak.updateToken(minValidity);
        } catch (error) {
            console.log('Failed to refresh the token', error);
        }

        if (this.DEBUG && refreshed) console.log('token has been refreshed');
    }

    async _onAuthSuccess() {
        // We check every once in a while if the token is still valid and
        // and refresh it if needed.
        if (this._checkId !== null) {
            clearInterval(this._checkId);
            this._checkId = null;
        }
        this._checkId = setInterval(
            this._checkTokeHasExpired.bind(this),
            this.CHECK_INTERVAL * 1000,
        );

        this._onChanged();
    }

    async _onAuthLogout() {
        if (this._checkId !== null) {
            clearInterval(this._checkId);
            this._checkId = null;
        }

        this._onChanged();
    }

    async _init() {
        const Keycloak = (await import('./shared/keycloak.BSiy8LsL.es.js')).default;

        this._keycloak = new Keycloak({
            url: this._baseURL,
            realm: this._realm,
            clientId: this._clientId,
        });

        this._keycloak.onTokenExpired = this._onTokenExpired.bind(this);
        this._keycloak.onAuthRefreshSuccess = this._onChanged.bind(this);
        this._keycloak.onAuthRefreshError = this._onChanged.bind(this);
        this._keycloak.onAuthLogout = this._onAuthLogout.bind(this);
        this._keycloak.onAuthSuccess = this._onAuthSuccess.bind(this);
        this._keycloak.onAuthError = this._onChanged.bind(this);
        this._keycloak.onReady = this._onReady.bind(this);

        const options = {};
        options['pkceMethod'] = /** @type {Keycloak.KeycloakPkceMethod} */ ('S256');

        if (this.DEBUG) {
            options['enableLogging'] = true;
        }

        options['checkLoginIframe'] = this._checkLoginIframe;

        if (this._silentCheckSsoUri) {
            options['onLoad'] = /** @type {Keycloak.KeycloakOnLoad} */ ('check-sso');
            options['silentCheckSsoRedirectUri'] = ensureURL(this._silentCheckSsoUri);

            // When silent-sso-check is active but the iframe doesn't load/work we will
            // never return here, so add a timeout and emit a signal so the app can continue
            await promiseTimeout(5000, this._keycloak.init(options)).catch(() => {
                console.log('Login timed out');
                this._onChanged();
            });
        } else {
            await this._keycloak.init(options);
        }
    }

    async _ensureInit() {
        if (this._initPromise === null) {
            this._initPromise = this._init();
        }
        return this._initPromise;
    }

    /**
     * If this returns true you need to call login() at one point to finish the login process.
     */
    isLoggingIn() {
        const href = window.location.href;
        return href.search('[&#]state=') >= 0 && href.search('[&#]session_state=') >= 0;
    }

    /**
     * Logs the user in. Might lead to a site refresh or the user needing to authenticate.
     *
     * @param {object} options
     * @param {string} [options.lang] - The locale to use on the keycloak login page
     */
    async login(options) {
        await this._ensureInit();

        options = options || {};
        const language = options['lang'] || 'en';
        const scope = options['scope'] || '';

        if (!this._keycloak.authenticated) {
            await this._keycloak.login({
                locale: language,
                scope: scope,
                idpHint: this._idpHint,
            });
        }
    }

    /**
     * Logs the user in if it is possible without leaving the page or the user needing to authenticate again.
     */
    async tryLogin() {
        await this._ensureInit();
    }

    /**
     * Logs the user out locally, but not with keycloak. Login will instantly log the user back in without
     * requiring a re-auth.
     */
    async localLogout() {
        this._keycloak.clearToken();
    }

    /**
     * Log the user out from keycloak.
     */
    async logout() {
        await this._ensureInit();
        this._keycloak.logout();
    }
}

const LoginStatus = Object.freeze({
    UNKNOWN: 'unknown',
    LOGGING_IN: 'logging-in',
    LOGGED_IN: 'logged-in',
    LOGGING_OUT: 'logging-out',
    LOGGED_OUT: 'logged-out',
});

/**
 * Sends a notification via the event
 *
 * Type can be info/success/warning/danger
 *
 * example options:
 *
 * {
 *   "summary": "Item deleted",
 *   "body": "Item foo was deleted!",
 *   "type": "info",
 *   "icon": "download",
 *   "timeout": 5,
 * }
 *
 * @param options
 */
function send(options) {
    const event = new CustomEvent('dbp-notification-send', {
        bubbles: true,
        cancelable: true,
        detail: options,
    });

    const result = window.dispatchEvent(event);

    // true means the event was not handled
    if (result) {
        alert(
            (options.summary !== undefined && options.summary !== ''
                ? options.summary + ': '
                : '') + options.body,
        );
        console.log('Use the web component dbp-notification to show fancy notifications.');
    }
}

/**
 * Keycloak auth web component
 * https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
 *
 * Emits a dbp-set-property event for the attribute "auth":
 *   auth.subject: Keycloak username
 *   auth.login-status: Login status (see object LoginStatus)
 *   auth.token: Keycloak token to send with your requests
 *   auth.user-full-name: Full name of the user
 *   auth.user-id: Identifier of the user
 */
class AuthKeycloak extends LangMixin(AdapterLitElement, createInstance) {
    constructor() {
        super();
        this.forceLogin = false;
        this.token = '';
        this.subject = '';
        this.name = '';
        this.tryLogin = false;
        this.entryPointUrl = '';
        this._user = null;
        this._userId = '';
        this._authenticated = false;
        this._loginStatus = LoginStatus.UNKNOWN;
        this.requestedLoginStatus = LoginStatus.UNKNOWN;

        // Keycloak config
        this.keycloakUrl = null;
        this.realm = null;
        this.clientId = null;
        this.silentCheckSsoRedirectUri = null;
        this.noCheckLoginIframe = false;
        this.scope = null;
        this.idpHint = '';

        this._onKCChanged = this._onKCChanged.bind(this);

        // inject a data-testid attribute for Playwright
        if (window.playwright) {
            this.setAttribute('data-testid', 'dbp-auth-keycloak');
        }
    }

    update(changedProperties) {
        // console.log("changedProperties", changedProperties);
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'requestedLoginStatus': {
                    console.log('requested-login-status changed', this.requestedLoginStatus);
                    let newStatus = this.requestedLoginStatus;
                    // reset so the next change will be detected if below fails or gets cancelled
                    this.requestedLoginStatus = LoginStatus.UNKNOWN;
                    switch (newStatus) {
                        case LoginStatus.LOGGED_IN:
                            this._kcwrapper.login({lang: this.lang, scope: this.scope || ''});
                            break;
                        case LoginStatus.LOGGED_OUT:
                            // Keycloak will redirect right away without emitting events, so we have
                            // to do this manually here
                            if (this._loginStatus === LoginStatus.LOGGED_IN) {
                                this._setLoginStatus(LoginStatus.LOGGING_OUT);
                            }
                            this._kcwrapper.logout();
                            // In case logout was aborted, for example with beforeunload,
                            // revert back to being logged in
                            if (this._loginStatus === LoginStatus.LOGGING_OUT) {
                                this._setLoginStatus(LoginStatus.LOGGED_IN);
                            }
                            break;
                    }
                    break;
                }
            }
        });

        super.update(changedProperties);
    }

    async _fetchUser(userId, token) {
        const apiUrl = combineURLs(
            this.entryPointUrl,
            `/frontend/users/${encodeURIComponent(userId)}`,
        );

        let response = await fetch(apiUrl, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        if (!response.ok) {
            throw response;
        }
        let user = await response.json();
        let dummyUser = {
            roles: user['roles'] ?? [],
        };
        return dummyUser;
    }

    async _onKCChanged(event) {
        const kc = event.detail;

        this._authenticated = kc.authenticated;
        if (kc.authenticated) {
            let userChanged = kc.subject !== this.subject;
            if (userChanged) {
                if (this._loginStatus === LoginStatus.LOGGED_IN) {
                    this._setLoginStatus(LoginStatus.LOGGING_OUT);
                    this._setLoggedOut();
                }

                const userId = kc.idTokenParsed.preferred_username;
                this._userId = userId;
                let user;
                try {
                    user = await this._fetchUser(userId, kc.token);
                } catch (error) {
                    // In case fetching the user failed then likely the API backend
                    // is not set up or broken. Return a user without any roles so we
                    // can show something at least.
                    console.error(error);
                    user = {roles: []};
                }
                if (userId === this._userId) {
                    this._user = user;
                }
            }
            let tokenChanged = this.token !== kc.token;
            this.token = kc.token;
            this.name = kc.idTokenParsed.name;
            this.subject = kc.subject;
            if (this._user !== null) {
                this._setLoginStatus(LoginStatus.LOGGED_IN, tokenChanged);
            }
        } else {
            if (this._loginStatus === LoginStatus.LOGGED_IN) {
                this._setLoginStatus(LoginStatus.LOGGING_OUT);
            }
            this._setLoggedOut();
        }
    }

    _setLoggedOut() {
        this.name = '';
        this.token = '';
        this.subject = '';
        this._userId = '';
        this._user = null;
        this._setLoginStatus(LoginStatus.LOGGED_OUT);
    }

    sendSetPropertyEvents() {
        const auth = {
            'login-status': this._loginStatus,
            subject: this.subject,
            token: this.token,
            'user-full-name': this.name,
            'user-id': this._userId,
            // Deprecated
            'person-id': this._userId,
            person: this._user,
            _roles: this._user ? this._user.roles : [],
        };
        this.sendSetPropertyEvent('auth', auth);
    }

    _setLoginStatus(status, force) {
        if (this._loginStatus === status && !force) return;

        this._loginStatus = status;
        this.sendSetPropertyEvents();
    }

    static get properties() {
        return {
            ...super.properties,
            lang: {type: String},
            forceLogin: {type: Boolean, attribute: 'force-login'},
            tryLogin: {type: Boolean, attribute: 'try-login'},
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            name: {type: String, attribute: false},
            token: {type: String, attribute: false},
            subject: {type: String, attribute: false},
            _userId: {type: String, attribute: false},
            _user: {type: Object, attribute: false},
            _loginStatus: {type: String, attribute: false},
            keycloakUrl: {type: String, attribute: 'url'},
            realm: {type: String},
            clientId: {type: String, attribute: 'client-id'},
            silentCheckSsoRedirectUri: {type: String, attribute: 'silent-check-sso-redirect-uri'},
            scope: {type: String},
            idpHint: {type: String, attribute: 'idp-hint'},
            requestedLoginStatus: {type: String, attribute: 'requested-login-status'},
            noCheckLoginIframe: {type: Boolean, attribute: 'no-check-login-iframe'},
        };
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this.keycloakUrl) throw Error('url not set');
        if (!this.realm) throw Error('realm not set');
        if (!this.clientId) throw Error('client-id not set');
        this._kcwrapper = new KeycloakWrapper(
            this.keycloakUrl,
            this.realm,
            this.clientId,
            this.silentCheckSsoRedirectUri,
            !this.noCheckLoginIframe,
            this.idpHint,
        );
        this._kcwrapper.addEventListener('changed', this._onKCChanged);

        const handleLogin = async () => {
            try {
                if (this.forceLogin || this._kcwrapper.isLoggingIn()) {
                    this._setLoginStatus(LoginStatus.LOGGING_IN);
                    await this._kcwrapper.login({lang: this.lang, scope: this.scope || ''});
                } else if (this.tryLogin) {
                    this._setLoginStatus(LoginStatus.LOGGING_IN);
                    await this._kcwrapper.tryLogin();
                    if (!this._authenticated) {
                        this._setLoginStatus(LoginStatus.LOGGED_OUT);
                    }
                } else {
                    this._setLoginStatus(LoginStatus.LOGGED_OUT);
                }
            } catch (error) {
                // In case the keycloak server is offline for example
                this._setLoginStatus(LoginStatus.LOGGED_OUT);
                send({
                    summary: this._i18n.t('login-failed'),
                    type: 'danger',
                    timeout: 5,
                });
                throw error;
            }
        };

        handleLogin();
    }

    disconnectedCallback() {
        this._kcwrapper.close();
        this._kcwrapper.removeEventListener('changed', this._onKCChanged);

        super.disconnectedCallback();
    }
}

let logoutSVG = `
<svg
   viewBox="0 0 100 100"
   y="0px"
   x="0px"
   id="icon"
   role="img"
   version="1.1">
<g
   id="g6">
  <path
     d="m 20.749313,38.894934 -5.885859,6.967885 h 43.408213 c 1.839331,0 3.433418,1.741972 3.433418,4.064599 0,2.322628 -1.471465,4.064599 -3.433418,4.064599 H 14.863454 l 5.885859,6.967883 c 1.348843,1.596808 1.348843,4.064599 0,5.661406 -1.348843,1.596808 -3.433418,1.596808 -4.782261,0 L 1.9881356,49.927418 15.967052,33.378693 c 1.348843,-1.596806 3.433418,-1.596806 4.782261,0 1.348843,1.596807 1.348843,4.064599 0,5.516241 z"
     id="path2"
     style="stroke-width:1.33417916"
     inkscape:connector-curvature="0" />
  <path
     style="stroke-width:0.67017764"
     d="M 61.663665,16.308792 C 48.158763,16.560171 35.913199,25.828579 30.896087,38.197464 34.816744,37.806184 40.033349,39.91491 41.470306,35.017776 50.594944,21.215302 72.517616,20.362655 82.800384,33.07637 93.497261,44.618596 90.228387,65.093356 76.499603,72.791214 64.104901,80.786232 45.895432,75.593227 39.470306,62.310745 35.613955,62.60637 27.974792,60.593775 32.925384,66.267776 41.232037,82.878292 64.023613,89.46919 79.876556,79.765823 96.140149,70.989504 102.10102,48.145494 91.970306,32.629104 85.705979,22.257901 73.793809,15.772382 61.663665,16.308792 Z"
     id="path4"
     inkscape:connector-curvature="0" />
</g>
</svg>
`;

let loginSVG = `
<svg
   viewBox="0 0 100 100"
   y="0px"
   x="0px"
   id="icon"
   role="img"
   version="1.1">
<g
   id="g6">
    <path
   style="stroke-width:1.33417916"
   id="path2"
   d="m 42.943908,38.894934 5.885859,6.967885 H 5.4215537 c -1.8393311,0 -3.4334181,1.741972 -3.4334181,4.064599 0,2.322628 1.4714649,4.064599 3.4334181,4.064599 H 48.829767 L 42.943908,60.9599 c -1.348843,1.596808 -1.348843,4.064599 0,5.661406 1.348843,1.596808 3.433418,1.596808 4.782261,0 L 61.705085,49.927418 47.726169,33.378693 c -1.348843,-1.596806 -3.433418,-1.596806 -4.782261,0 -1.348843,1.596807 -1.348843,4.064599 0,5.516241 z" />
    <path
   id="path4"
   d="m 50,2.3007812 c -18.777325,0 -35.049449,10.9124408 -42.8261719,26.7246098 H 13.390625 C 20.672112,16.348362 34.336876,7.8007812 50,7.8007812 73.3,7.8007812 92.300781,26.7 92.300781,50 92.300781,73.3 73.3,92.300781 50,92.300781 c -15.673389,0 -29.345175,-8.60579 -36.623047,-21.326172 H 7.1640625 C 14.942553,86.8272 31.242598,97.800781 50.099609,97.800781 76.399609,97.800781 97.900391,76.4 97.900391,50 97.800391,23.7 76.3,2.3007812 50,2.3007812 Z" />
</g>
</svg>
`;

class LoginButton extends AuthMixin(
    LangMixin(ScopedElementsMixin(AdapterLitElement), createInstance),
) {
    static get scopedElements() {
        return {
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    _onLoginClicked(e) {
        this.sendSetPropertyEvent('requested-login-status', LoginStatus.LOGGED_IN);
        e.preventDefault();
    }

    _onLogoutClicked(e) {
        this.sendSetPropertyEvent('requested-login-status', LoginStatus.LOGGED_OUT);
        e.preventDefault();
    }

    static get styles() {
        // language=css
        return [
            getThemeCSS(),
            i$4`
                :host {
                    display: inline-block;
                }

                a {
                    color: var(--dbp-content);
                    fill: var(--dbp-content);
                    cursor: pointer;
                    text-decoration: none;
                }

                .login-box {
                    display: flex;
                    align-items: center;
                    padding: 0.3em 0.4em;
                    transition:
                        background-color 0.15s,
                        color 0.15s;
                }

                .login-box svg,
                .icon {
                    width: 1.1em;
                    height: 1.1em;
                }

                .login-box svg,
                .spinner {
                    display: flex;
                }

                .login-box:hover svg path {
                    fill: var(--dbp-hover-color);
                }

                .login-box:hover {
                    color: var(--dbp-hover-color, var(--dbp-content));
                    background-color: var(--dbp-hover-background-color);
                    cursor: pointer;
                    transition: none;
                }

                .login-box .label {
                    padding-left: 0.2em;
                }
            `,
        ];
    }

    render() {
        let i18n = this._i18n;
        if (this.isAuthPending()) {
            // try to keep the layout the same to avoid layout shifts
            return x`
                <a href="#">
                    <div class="login-box login-button" aria-busy="true">
                        <div class="icon" aria-hidden="false" aria-label="${i18n.t('logging-in')}">
                            <dbp-mini-spinner class="spinner"></dbp-mini-spinner>
                        </div>
                        <div class="label" aria-hidden="true">&#8203;</div>
                    </div>
                </a>
            `;
        } else if (this.isLoggedIn()) {
            return x`
                <a href="#" @click="${this._onLogoutClicked}">
                    <div class="login-box login-button">
                        <div class="icon" aria-hidden="true">${o(logoutSVG)}</div>
                        <div class="label">${i18n.t('logout')}</div>
                    </div>
                </a>
            `;
        } else {
            return x`
                <a href="#" @click="${this._onLoginClicked}">
                    <div class="login-box login-button">
                        <div class="icon" aria-hidden="true">${o(loginSVG)}</div>
                        <div class="label">${i18n.t('login')}</div>
                    </div>
                </a>
            `;
        }
    }
}

class Adapter extends HTMLElement {
    constructor() {
        super();
        this.connected = false;
        this.deferSubscribe = false;
        this.deferUnSubscribe = false;
        // attributes (if they exist) will be updated if a property is changed by "subscribe"
        this.reflectAttribute = true;

        // default values
        this.subscribe = '';
        this.unsubscribe = '';

        console.debug('Adapter constructor()');
    }

    getPropertyByAttributeName(name) {
        return this[this.findPropertyName(name)];
    }

    setPropertyByAttributeName(name, value) {
        this[this.findPropertyName(name)] = value;
    }

    connectedCallback() {
        this.connected = true;

        const that = this;

        // get all *not observed* attributes
        if (this.hasAttributes()) {
            const attrs = this.attributes;
            for (let i = attrs.length - 1; i >= 0; i--) {
                if (['id', 'class', 'style', 'data-tag-name'].includes(attrs[i].name)) {
                    continue;
                }
                this.setPropertiesToChildNodes();

                this.attributeChangedCallback(
                    attrs[i].name,
                    this.getPropertyByAttributeName(attrs[i].name),
                    attrs[i].value,
                );

                console.debug(
                    'AdapterProvider (' +
                        that.tagName +
                        ') found attribute "' +
                        attrs[i].name +
                        '" = "' +
                        attrs[i].value +
                        '"',
                );
            }
        }
    }

    disconnectedCallback() {
        const attrs = this.subscribe.split(',');
        attrs.forEach((element) => this.unSubscribeProviderFor(element));
    }

    subscribeProviderFor(element) {
        console.debug(
            'AdapterProvider(' + this.tagName + ') subscribeProviderFor( ' + element + ' )',
        );
        const pair = element.trim().split(':');
        const local = pair[0];
        const global = pair[1] || local;
        const that = this;
        const event = new CustomEvent('dbp-subscribe', {
            bubbles: true,
            composed: true,
            detail: {
                name: global,
                callback: (value) => {
                    console.debug(
                        'AdapterProvider(' +
                            that.tagName +
                            ') sub/Callback ' +
                            global +
                            ' -> ' +
                            local +
                            ' = ' +
                            value,
                    );
                    that.setPropertiesToChildNodes(local, value);

                    // If value is an object set it directly as property
                    if (typeof value === 'object' && value !== null) {
                        // console.debug("value is object", value);
                        that.setPropertyByAttributeName(local, value);
                    } else {
                        // console.debug("local, that.getPropertyByAttributeName(local), value", local, that.getPropertyByAttributeName(local), value);
                        that.attributeChangedCallback(
                            local,
                            that.getPropertyByAttributeName(local),
                            value,
                        );

                        // check if an attribute also exists in the tag
                        if (that.getAttribute(local) !== null) {
                            // we don't support attributes and provider values at the same time
                            console.warn(
                                'Provider callback: "' +
                                    local +
                                    '" is also an attribute in tag "' +
                                    that.tagName +
                                    '", this is not supported!',
                            );

                            // update attribute if reflectAttribute is enabled
                            if (that.reflectAttribute) {
                                that.setAttribute(local, value);
                            }
                        }
                    }
                },
                sender: this,
            },
        });
        this.dispatchEvent(event);
    }

    unSubscribeProviderFor(element) {
        console.debug(
            'AdapterProvider(' + this.tagName + ') unSubscribeProviderFor( ' + element + ' )',
        );
        const pair = element.trim().split(':');
        const global = pair[1] || pair[0];
        const event = new CustomEvent('dbp-unsubscribe', {
            bubbles: true,
            composed: true,
            detail: {
                name: global,
                sender: this,
            },
        });
        this.dispatchEvent(event);
    }

    static get properties() {
        return {
            subscribe: {type: String},
            unsubscribe: {type: String},
        };
    }

    findPropertyName(attributeName) {
        let resultName = attributeName;
        const properties = this.constructor.properties;
        // console.debug("properties", properties);

        for (const propertyName in properties) {
            // console.debug("findPropertyName", `${propertyName}: ${properties[propertyName]}`);
            const attribute = properties[propertyName].attribute;
            if (attribute === attributeName) {
                resultName = propertyName;
                break;
            }
        }

        return resultName;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'subscribe':
                console.debug(
                    'AdapterProvider() attributeChangesCallback( ' +
                        name +
                        ', ' +
                        oldValue +
                        ', ' +
                        newValue +
                        ')',
                );

                if (this.subscribe && this.subscribe.length > 0) {
                    if (this.connected) {
                        const attrs = this.subscribe.split(',');
                        attrs.forEach((element) => this.unSubscribeProviderFor(element));
                    } else {
                        this.deferUnSubscribe = this.subscribe.length > 0;
                        this.unsubscribe = this.subscribe;
                    }
                }

                if (newValue !== null) {
                    this.subscribe = newValue;
                    if (this.connected) {
                        const attrs = newValue.split(',');
                        attrs.forEach((element) => this.subscribeProviderFor(element));
                    } else {
                        this.deferSubscribe = newValue && newValue.length > 0;
                    }
                }
                break;
        }
    }

    /**
     * Send a set-property event to the provider components
     *
     * @param name
     * @param value
     * @returns {boolean}
     */
    sendSetPropertyEvent(name, value) {
        const event = new CustomEvent('set-property', {
            bubbles: true,
            composed: true,
            detail: {name: name, value: value},
        });

        return this.dispatchEvent(event);
    }

    setPropertiesToChildNodes(local, value) {
        let children = this.children;
        Array.from(children).forEach((child) => child.setAttribute(local, value));
    }
}

class DemoConsumer extends LangMixin(DBPLitElement, createInstance$1) {
    constructor() {
        super();
        this.entryPointUrl = '';
        // default values
        this.foo = 100;
        this.bar = 900;
        this.ping = 0;
        this.borderColor = 'green';

        this.status = 'local';

        console.debug('DemoConsumer constructor()');
    }

    connectedCallback() {
        super.connectedCallback();
        console.debug('DemoConsumer(' + this.id + ') connectedCallback()');
        this.render();
    }

    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {type: String, attribute: 'entry-point-url'},
            foo: {type: String},
            bar: {type: String},
            gong: {type: String},
            borderColor: {type: String, attribute: 'border-color'},
            ping: {type: String},
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        console.debug(
            'DemoConsumer(' +
                this.id +
                ') attributeChangesCallback( ' +
                name +
                ', ' +
                oldValue +
                ', ' +
                newValue +
                ')',
        );
        switch (name) {
            case 'lang':
                this.lang = newValue;
                break;
            case 'foo':
                this.foo = parseInt(newValue);
                break;
            case 'bar':
                this.bar = parseInt(newValue);
                break;
            case 'status':
                this.status = newValue;
                break;
            case 'border-color':
                this['border-color'] = newValue;
                break;
            default:
                super.attributeChangedCallback(name, oldValue, newValue);
        }
        this.render();
    }

    get id() {
        return this.getAttribute('id');
    }

    render() {
        const i18n = this._i18n;
        if (!this.connected) {
            return `not connected!`;
        }
        console.debug('DemoConsumer(' + this.id + ') render()');

        const sum = this.foo + this.bar;
        return x`
            <div style="border: ${this['border-color']} dotted; padding: 10px;">
                <table style="width:200px;">
                    <tr style="background-color: #aaa;">
                        <th style="text-align: left;">${i18n.t('consumer.item')}</th>
                        <th style="text-align: right;">${i18n.t('consumer.price')}</th>
                    </tr>
                    <tr>
                        <td>foo</td>
                        <td style="text-align: right;">${this.foo}</td>
                    </tr>
                    <tr>
                        <td>bar</td>
                        <td style="text-align: right;">${this.bar}</td>
                    </tr>
                    <tr>
                        <td>${i18n.t('consumer.sum')}</td>
                        <td style="text-align: right;">${sum}</td>
                    </tr>
                </table>
                <p>
                    Status:
                    <b>${this.status}</b>
                </p>
            </div>
        `;
    }
}

customElements.define('dbp-consumer', DemoConsumer);

class ProviderDemo extends LangMixin(ScopedElementsMixin(DBPLitElement), createInstance$1) {
    static get scopedElements() {
        return {
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-login-button': LoginButton,
            'dbp-provider': Provider,
            'dbp-provider-adapter': Adapter,
            'dbp-consumer': DemoConsumer,
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.debug(
            'ProviderDemo (' +
                this.id +
                ') attributeChangesCallback( ' +
                name +
                ', ' +
                oldValue +
                ', ' +
                newValue +
                ')',
        );
        switch (name) {
            case 'lang':
                this.lang = newValue;
                break;
            default:
                super.attributeChangedCallback(name, oldValue, newValue);
        }
        this.render();
    }

    static get styles() {
        // language=css
        return [
            getThemeCSS(),
            getGeneralCSS(),
            i$4`
                h1.title {
                    margin-bottom: 1em;
                }
                div.container {
                    margin-bottom: 1.5em;
                    padding-left: 20px;
                }
            `,
        ];
    }

    get id() {
        return this.getAttribute('id');
    }

    render() {
        const i18n = this._i18n;
        return x`
            <section class="section">
                <p>${i18n.t('demo.provider_description', {
                    id: 'root',
                    description: 'is the top most in hierarchy',
                })}</p>
                <pre>&lt;dbp-provider  id="root"  root="1" availability="global" >&lt;/dbp-provider&gt;</pre>
                <div class="container">
                    <h1 class="title">${i18n.t('demo.provider')}-Demo</h1>
                </div>
                <div class="container">
                    <dbp-auth-keycloak subscribe="requested-login-status" lang="${
                        this.lang
                    }" entry-point-url="${
                        this.entryPointUrl
                    }" url="https://auth-dev.tugraz.at/auth" realm="tugraz-vpu" client-id="auth-dev-mw-frontend-local" try-login></dbp-auth-keycloak>
                    <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
                </div>
                <dbp-provider id="demo"
                              bc="blue">
                    <dbp-provider id="foo-bar"
                                  foo="9"
                                  bar="20">
                        <div class="container">
                            <h2>${i18n.t('demo.provider')}</h2>
                            <p>${i18n.t('demo.provider_description', {
                                id: 'demo',
                                description: 'has only "border-color" to offer',
                            })}</p>                            <pre>&lt;dbp-provider  id="demo"  bc="blue" &gt;&lt;/dbp-provider&gt;</pre>
                            <p>${i18n.t('demo.provider_description', {
                                id: 'foo-bar',
                                description: 'has some values in its store',
                            })}</p>
                            <pre>&lt;dbp-provider  id="foo-bar"  foo="9" bar="20" &gt;&lt;/dbp-provider&gt;</pre>

                            <h2>${i18n.t('demo.consumer')}</h2>
                            <p>${i18n.t('demo.consumer_description', {
                                id: 'c1',
                                subscriptions: 'border-color',
                            })}</p>
                            <pre>&lt;dbp-consumer  id="c1"  subscribe="border-color:bc" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c1" subscribe="border-color:bc,lang"></dbp-consumer>
                            <p>${i18n.t('demo.consumer_description', {
                                id: 'c2',
                                subscriptions: 'foo',
                            })}</p>
                            <pre>&lt;dbp-consumer  id="c2"  subscribe="foo:foo" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c2" subscribe="foo:foo,lang"></dbp-consumer>
                            <p>${i18n.t('demo.consumer_description', {
                                id: 'c3',
                                subscriptions: 'availability:status',
                            })}</p>
                            <p>Local <em>status</em> is provided as <em>availability</em></p>
                            <pre>&lt;dbp-consumer  id="c3"  subscribe="status:availability"  border-color="orange" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c3" subscribe="status:availability,lang" border-color="orange"></dbp-consumer>
                            <p>${i18n.t('demo.consumer_description', {
                                id: 'c4',
                                subscriptions: 'unknown-name:status',
                            })}</p>
                            <p>Remote <em>unknown-name</em> does not exist, the default value is overwritten by <em>undefined</em></i></p>
                            <pre>&lt;dbp-consumer  id="c4"  subscribe="status:unknown-name"  border-color="darkgray" &gt;&lt;/dbp-consumer&gt;</pre>
                            <dbp-consumer id="c4" subscribe="status:unknown-name" border-color="darkgray"></dbp-consumer>
                        </div>
                    </dbp-provider>
                </dbp-provider>
                
                <h2> DBP Provider Adapter</h2>
                <p> The dbp-provider is for third party webcomponents, which we want to configure with a provider.</p>
                <pre>&lt;dbp-provider  id="demoadapter"  dbp-style-red="color:red;" dbp-style-green="color:green;" >&lt;/dbp-provider&gt;</pre>
                <dbp-provider id="demoadapter"
                              dbp-style-red="color:red;" dbp-style-green="color:green;">
                    <pre>&lt;dbp-provider-adapter  id="a1"  subscribe="style:dbp-style-red" >&lt;/dbp-provider-adapter&gt;</pre>
                    <dbp-provider-adapter id="a1" subscribe="style:dbp-style-red">
                        <p> I'm a normal p tag without attributes and without style. </p>
                        <p>  I'm a normal p tag without attributes and without style. </p>
                        <p>  I'm a normal p tag without attributes and without style. </p>
                    </dbp-provider-adapter>
                    <pre>&lt;dbp-provider-adapter  id="a2"  subscribe="style:dbp-style-green" >&lt;/dbp-provider-adapter&gt;</pre>
                    <dbp-provider-adapter id="a2" subscribe="style:dbp-style-green">
                        <p style="background-color:green;"> I'm a normal p tag without attributes and without style. <span style="color:blue;"> I'm blue dabedidabedei...</span> </p>
                    </dbp-provider-adapter>
                </dbp-provider>
            </section>
        `;
    }
}

defineCustomElement('dbp-provider-demo', ProviderDemo);

suite('dbp-provider basics', () => {
    let node;

    suiteSetup(async () => {
        node = document.createElement('dbp-provider');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    suiteTeardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert(node.shadowRoot !== undefined);
    });
});

suite('dbp-provider-demo basics', () => {
    let node;

    suiteSetup(async () => {
        node = document.createElement('dbp-provider-demo');
        document.body.appendChild(node);
        await node.updateComplete;
    });

    suiteTeardown(() => {
        node.remove();
    });

    test('should render', () => {
        assert(node.shadowRoot !== undefined);
    });
});
//# sourceMappingURL=unit.js.map
