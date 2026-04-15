//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === 'object') || typeof from === 'function') {
        for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
            key = keys[i];
            if (!__hasOwnProp.call(to, key) && key !== except) {
                __defProp$1(to, key, {
                    get: ((k) => from[k]).bind(null, key),
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
                });
            }
        }
    }
    return to;
};
var __toESM = (mod, isNodeMode, target) => (
    (target = mod != null ? __create(__getProtoOf(mod)) : {}),
    __copyProps(
        isNodeMode || !mod || !mod.__esModule
            ? __defProp$1(target, 'default', {
                  value: mod,
                  enumerable: true,
              })
            : target,
        mod,
    )
);

//#endregion
//#region ../../node_modules/chai/index.js
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) =>
    key in obj
        ? __defProp(obj, key, {
              enumerable: true,
              configurable: true,
              writable: true,
              value,
          })
        : (obj[key] = value);
var __name = (target, value) =>
    __defProp(target, 'name', {
        value,
        configurable: true,
    });
var __export = (target, all) => {
    for (var name in all)
        __defProp(target, name, {
            get: all[name],
            enumerable: true,
        });
};
var __publicField = (obj, key, value) =>
    __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);
var utils_exports = {};
__export(utils_exports, {
    addChainableMethod: () => addChainableMethod,
    addLengthGuard: () => addLengthGuard,
    addMethod: () => addMethod,
    addProperty: () => addProperty,
    checkError: () => check_error_exports,
    compareByInspect: () => compareByInspect,
    eql: () => deep_eql_default,
    events: () => events,
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
    if (isErrorInstance(errorLike))
        return (
            thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor
        );
    else if (
        (typeof errorLike === 'object' || typeof errorLike === 'function') &&
        errorLike.prototype
    )
        return thrown.constructor === errorLike || thrown instanceof errorLike;
    return false;
}
__name(compatibleConstructor, 'compatibleConstructor');
function compatibleMessage(thrown, errMatcher) {
    const comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
    if (isRegExp(errMatcher)) return errMatcher.test(comparisonString);
    else if (typeof errMatcher === 'string') return comparisonString.indexOf(errMatcher) !== -1;
    return false;
}
__name(compatibleMessage, 'compatibleMessage');
function getConstructorName(errorLike) {
    let constructorName = errorLike;
    if (isErrorInstance(errorLike)) constructorName = errorLike.constructor.name;
    else if (typeof errorLike === 'function') {
        constructorName = errorLike.name;
        if (constructorName === '') constructorName = new errorLike().name || constructorName;
    }
    return constructorName;
}
__name(getConstructorName, 'getConstructorName');
function getMessage(errorLike) {
    let msg = '';
    if (errorLike && errorLike.message) msg = errorLike.message;
    else if (typeof errorLike === 'string') msg = errorLike;
    return msg;
}
__name(getMessage, 'getMessage');
function flag(obj, key, value) {
    let flags = obj.__flags || (obj.__flags = /* @__PURE__ */ Object.create(null));
    if (arguments.length === 3) flags[key] = value;
    else return flags[key];
}
__name(flag, 'flag');
function test$1(obj, args) {
    let negate = flag(obj, 'negate'),
        expr = args[0];
    return negate ? !expr : expr;
}
__name(test$1, 'test');
function type(obj) {
    if (typeof obj === 'undefined') return 'undefined';
    if (obj === null) return 'null';
    const stringTag = obj[Symbol.toStringTag];
    if (typeof stringTag === 'string') return stringTag;
    return Object.prototype.toString.call(obj).slice(8, -1);
}
__name(type, 'type');
var canElideFrames = 'captureStackTrace' in Error;
var _AssertionError = class _AssertionError extends Error {
    constructor(message = 'Unspecified AssertionError', props, ssf) {
        super(message);
        __publicField(this, 'message');
        this.message = message;
        if (canElideFrames) Error.captureStackTrace(this, ssf || _AssertionError);
        for (const key in props) if (!(key in this)) this[key] = props[key];
    }
    get name() {
        return 'AssertionError';
    }
    get ok() {
        return false;
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
__name(_AssertionError, 'AssertionError');
var AssertionError = _AssertionError;
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
            return (types.length > 1 && index === types.length - 1 ? 'or ' : '') + art + ' ' + t;
        })
        .join(', ');
    let objType = type(obj).toLowerCase();
    if (
        !types.some(function (expected) {
            return objType === expected;
        })
    )
        throw new AssertionError(
            flagMsg + 'object tested must be ' + str + ', but ' + objType + ' given',
            void 0,
            ssfi,
        );
}
__name(expectTypes, 'expectTypes');
function getActual(obj, args) {
    return args.length > 4 ? args[4] : obj._obj;
}
__name(getActual, 'getActual');
var ansiColors = {
    bold: ['1', '22'],
    dim: ['2', '22'],
    italic: ['3', '23'],
    underline: ['4', '24'],
    inverse: ['7', '27'],
    hidden: ['8', '28'],
    strike: ['9', '29'],
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
var truncator = '…';
function colorise(value, styleType) {
    const color = ansiColors[styles[styleType]] || ansiColors[styleType] || '';
    if (!color) return String(value);
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
    if (options.colors) options.stylize = colorise;
    return options;
}
__name(normaliseOptions, 'normaliseOptions');
function isHighSurrogate(char) {
    return char >= '\ud800' && char <= '\udbff';
}
__name(isHighSurrogate, 'isHighSurrogate');
function truncate(string, length, tail = truncator) {
    string = String(string);
    const tailLength = tail.length;
    const stringLength = string.length;
    if (tailLength > length && stringLength > tailLength) return tail;
    if (stringLength > length && stringLength > tailLength) {
        let end = length - tailLength;
        if (end > 0 && isHighSurrogate(string[end - 1])) end = end - 1;
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
        )
            break;
        if (!last && !secondToLast && truncatedLength > originalLength) break;
        peek = last ? '' : inspectItem(list[i + 1], options) + (secondToLast ? '' : separator);
        if (
            !last &&
            secondToLast &&
            truncatedLength > originalLength &&
            nextLength + peek.length > originalLength
        )
            break;
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
    if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) return key;
    return JSON.stringify(key)
        .replace(/'/g, "\\'")
        .replace(/\\"/g, '"')
        .replace(/(^"|"$)/g, "'");
}
__name(quoteComplexKey, 'quoteComplexKey');
function inspectProperty([key, value], options) {
    options.truncate -= 2;
    if (typeof key === 'string') key = quoteComplexKey(key);
    else if (typeof key !== 'number') key = `[${options.inspect(key, options)}]`;
    options.truncate -= key.length;
    value = options.inspect(value, options);
    return `${key}: ${value}`;
}
__name(inspectProperty, 'inspectProperty');
function inspectArray(array, options) {
    const nonIndexProperties = Object.keys(array).slice(array.length);
    if (!array.length && !nonIndexProperties.length) return '[]';
    options.truncate -= 4;
    const listContents = inspectList(array, options);
    options.truncate -= listContents.length;
    let propertyContents = '';
    if (nonIndexProperties.length)
        propertyContents = inspectList(
            nonIndexProperties.map((key) => [key, array[key]]),
            options,
            inspectProperty,
        );
    return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ''} ]`;
}
__name(inspectArray, 'inspectArray');
var getArrayName = /* @__PURE__ */ __name((array) => {
    if (typeof Buffer === 'function' && array instanceof Buffer) return 'Buffer';
    if (array[Symbol.toStringTag]) return array[Symbol.toStringTag];
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
    if (nonIndexProperties.length)
        propertyContents = inspectList(
            nonIndexProperties.map((key) => [key, array[key]]),
            options,
            inspectProperty,
        );
    return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ''} ]`;
}
__name(inspectTypedArray, 'inspectTypedArray');
function inspectDate(dateObject, options) {
    const stringRepresentation = dateObject.toJSON();
    if (stringRepresentation === null) return 'Invalid Date';
    const split = stringRepresentation.split('T');
    const date = split[0];
    return options.stylize(
        `${date}T${truncate(split[1], options.truncate - date.length - 1)}`,
        'date',
    );
}
__name(inspectDate, 'inspectDate');
function inspectFunction(func, options) {
    const functionType = func[Symbol.toStringTag] || 'Function';
    const name = func.name;
    if (!name) return options.stylize(`[${functionType}]`, 'special');
    return options.stylize(`[${functionType} ${truncate(name, options.truncate - 11)}]`, 'special');
}
__name(inspectFunction, 'inspectFunction');
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
    if (map.size === 0) return 'Map{}';
    options.truncate -= 7;
    return `Map{ ${inspectList(mapToEntries(map), options, inspectMapEntry)} }`;
}
__name(inspectMap, 'inspectMap');
var isNaN$1 = Number.isNaN || ((i) => i !== i);
function inspectNumber(number, options) {
    if (isNaN$1(number)) return options.stylize('NaN', 'number');
    if (number === Infinity) return options.stylize('Infinity', 'number');
    if (number === -Infinity) return options.stylize('-Infinity', 'number');
    if (number === 0) return options.stylize(1 / number === Infinity ? '+0' : '-0', 'number');
    return options.stylize(truncate(String(number), options.truncate), 'number');
}
__name(inspectNumber, 'inspectNumber');
function inspectBigInt(number, options) {
    let nums = truncate(number.toString(), options.truncate - 1);
    if (nums !== truncator) nums += 'n';
    return options.stylize(nums, 'bigint');
}
__name(inspectBigInt, 'inspectBigInt');
function inspectRegExp(value, options) {
    const flags = value.toString().split('/')[2];
    const sourceLength = options.truncate - (2 + flags.length);
    const source = value.source;
    return options.stylize(`/${truncate(source, sourceLength)}/${flags}`, 'regexp');
}
__name(inspectRegExp, 'inspectRegExp');
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
var stringEscapeChars = /* @__PURE__ */ new RegExp(
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
var unicodeLength = 4;
function escape$1(char) {
    return (
        escapeCharacters[char] ||
        `\\u${`0000${char.charCodeAt(0).toString(hex)}`.slice(-unicodeLength)}`
    );
}
__name(escape$1, 'escape');
function inspectString(string, options) {
    if (stringEscapeChars.test(string)) string = string.replace(stringEscapeChars, escape$1);
    return options.stylize(`'${truncate(string, options.truncate - 2)}'`, 'string');
}
__name(inspectString, 'inspectString');
function inspectSymbol(value) {
    if ('description' in Symbol.prototype)
        return value.description ? `Symbol(${value.description})` : 'Symbol()';
    return value.toString();
}
__name(inspectSymbol, 'inspectSymbol');
var promise_default = /* @__PURE__ */ __name(() => 'Promise{…}', 'getPromiseValue');
function inspectObject(object, options) {
    const properties = Object.getOwnPropertyNames(object);
    const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
    if (properties.length === 0 && symbols.length === 0) return '{}';
    options.truncate -= 4;
    options.seen = options.seen || [];
    if (options.seen.includes(object)) return '[Circular]';
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
    if (propertyContents && symbolContents) sep = ', ';
    return `{ ${propertyContents}${sep}${symbolContents} }`;
}
__name(inspectObject, 'inspectObject');
var toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag ? Symbol.toStringTag : false;
function inspectClass(value, options) {
    let name = '';
    if (toStringTag && toStringTag in value) name = value[toStringTag];
    name = name || value.constructor.name;
    if (!name || name === '_class') name = '<Anonymous Class>';
    options.truncate -= name.length;
    return `${name}${inspectObject(value, options)}`;
}
__name(inspectClass, 'inspectClass');
function inspectArguments(args, options) {
    if (args.length === 0) return 'Arguments[]';
    options.truncate -= 13;
    return `Arguments[ ${inspectList(args, options)} ]`;
}
__name(inspectArguments, 'inspectArguments');
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
    if (typeof error.message === 'string') message = truncate(error.message, options.truncate);
    else properties.unshift('message');
    message = message ? `: ${message}` : '';
    options.truncate -= message.length + 5;
    options.seen = options.seen || [];
    if (options.seen.includes(error)) return '[Circular]';
    options.seen.push(error);
    const propertyContents = inspectList(
        properties.map((key) => [key, error[key]]),
        options,
        inspectProperty,
    );
    return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ''}`;
}
__name(inspectObject2, 'inspectObject');
function inspectAttribute([key, value], options) {
    options.truncate -= 3;
    if (!value) return `${options.stylize(String(key), 'yellow')}`;
    return `${options.stylize(String(key), 'yellow')}=${options.stylize(`"${value}"`, 'string')}`;
}
__name(inspectAttribute, 'inspectAttribute');
function inspectNodeCollection(collection, options) {
    return inspectList(collection, options, inspectNode, '\n');
}
__name(inspectNodeCollection, 'inspectNodeCollection');
function inspectNode(node, options) {
    switch (node.nodeType) {
        case 1:
            return inspectHTML(node, options);
        case 3:
            return options.inspect(node.data, options);
        default:
            return options.inspect(node, options);
    }
}
__name(inspectNode, 'inspectNode');
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
    let children = inspectNodeCollection(element.children, options);
    if (children && children.length > truncate2)
        children = `${truncator}(${element.children.length})`;
    return `${head}${propertyContents}${headClose}${children}${tail}`;
}
__name(inspectHTML, 'inspectHTML');
var chaiInspect =
    typeof Symbol === 'function' && typeof Symbol.for === 'function'
        ? /* @__PURE__ */ Symbol.for('chai/inspect')
        : '@@chai/inspect';
var nodeInspect = /* @__PURE__ */ Symbol.for('nodejs.util.inspect.custom');
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
    Symbol: inspectSymbol,
    Array: inspectArray,
    Date: inspectDate,
    Map: inspectMap,
    Set: inspectSet,
    RegExp: inspectRegExp,
    Promise: promise_default,
    WeakSet: /* @__PURE__ */ __name(
        (value, options) => options.stylize('WeakSet{…}', 'special'),
        'WeakSet',
    ),
    WeakMap: /* @__PURE__ */ __name(
        (value, options) => options.stylize('WeakMap{…}', 'special'),
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
    HTMLCollection: inspectNodeCollection,
    NodeList: inspectNodeCollection,
};
var inspectCustom = /* @__PURE__ */ __name((value, options, type3, inspectFn) => {
    if (chaiInspect in value && typeof value[chaiInspect] === 'function')
        return value[chaiInspect](options);
    if (nodeInspect in value && typeof value[nodeInspect] === 'function')
        return value[nodeInspect](options.depth, options, inspectFn);
    if ('inspect' in value && typeof value.inspect === 'function')
        return value.inspect(options.depth, options);
    if ('constructor' in value && constructorMap.has(value.constructor))
        return constructorMap.get(value.constructor)(value, options);
    if (stringTagMap[type3]) return stringTagMap[type3](value, options);
    return '';
}, 'inspectCustom');
var toString = Object.prototype.toString;
function inspect(value, opts = {}) {
    const options = normaliseOptions(opts, inspect);
    const {customInspect} = options;
    let type3 = value === null ? 'null' : typeof value;
    if (type3 === 'object') type3 = toString.call(value).slice(8, -1);
    if (type3 in baseTypesMap) return baseTypesMap[type3](value, options);
    if (customInspect && value) {
        const output = inspectCustom(value, options, type3, inspect);
        if (output) {
            if (typeof output === 'string') return output;
            return inspect(output, options);
        }
    }
    const proto = value ? Object.getPrototypeOf(value) : false;
    if (proto === Object.prototype || proto === null) return inspectObject(value, options);
    if (value && typeof HTMLElement === 'function' && value instanceof HTMLElement)
        return inspectHTML(value, options);
    if ('constructor' in value) {
        if (value.constructor !== Object) return inspectClass(value, options);
        return inspectObject(value, options);
    }
    if (value === Object(value)) return inspectObject(value, options);
    return options.stylize(String(value), type3);
}
__name(inspect, 'inspect');
var config = {
    includeStack: false,
    showDiff: true,
    truncateThreshold: 40,
    useProxy: true,
    proxyExcludedKeys: ['then', 'catch', 'inspect', 'toJSON'],
    deepEqual: null,
};
function inspect2(obj, showHidden, depth, colors) {
    return inspect(obj, {
        colors,
        depth: typeof depth === 'undefined' ? 2 : depth,
        showHidden,
        truncate: config.truncateThreshold ? config.truncateThreshold : Infinity,
    });
}
__name(inspect2, 'inspect');
function objDisplay(obj) {
    let str = inspect2(obj),
        type3 = Object.prototype.toString.call(obj);
    if (config.truncateThreshold && str.length >= config.truncateThreshold)
        if (type3 === '[object Function]')
            return !obj.name || obj.name === '' ? '[Function]' : '[Function: ' + obj.name + ']';
        else if (type3 === '[object Array]') return '[ Array(' + obj.length + ') ]';
        else if (type3 === '[object Object]') {
            let keys = Object.keys(obj);
            return (
                '{ Object (' +
                (keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...' : keys.join(', ')) +
                ') }'
            );
        } else return str;
    else return str;
}
__name(objDisplay, 'objDisplay');
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
function transferFlags(assertion, object, includeAll) {
    let flags = assertion.__flags || (assertion.__flags = /* @__PURE__ */ Object.create(null));
    if (!object.__flags) object.__flags = /* @__PURE__ */ Object.create(null);
    includeAll = arguments.length === 3 ? includeAll : true;
    for (let flag3 in flags)
        if (
            includeAll ||
            (flag3 !== 'object' && flag3 !== 'ssfi' && flag3 !== 'lockSsfi' && flag3 != 'message')
        )
            object.__flags[flag3] = flags[flag3];
}
__name(transferFlags, 'transferFlags');
function type2(obj) {
    if (typeof obj === 'undefined') return 'undefined';
    if (obj === null) return 'null';
    const stringTag = obj[Symbol.toStringTag];
    if (typeof stringTag === 'string') return stringTag;
    return Object.prototype.toString.call(obj).slice(8, -1);
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
        if (Object.isExtensible(key))
            Object.defineProperty(key, this._key, {
                value,
                configurable: true,
            });
    }, 'set'),
};
var MemoizeMap = typeof WeakMap === 'function' ? WeakMap : FakeMap;
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
    if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) return null;
    var leftHandMap = memoizeMap.get(leftHandOperand);
    if (leftHandMap) {
        var result = leftHandMap.get(rightHandOperand);
        if (typeof result === 'boolean') return result;
    }
    return null;
}
__name(memoizeCompare, 'memoizeCompare');
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
    if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) return;
    var leftHandMap = memoizeMap.get(leftHandOperand);
    if (leftHandMap) leftHandMap.set(rightHandOperand, result);
    else {
        leftHandMap = new MemoizeMap();
        leftHandMap.set(rightHandOperand, result);
        memoizeMap.set(leftHandOperand, leftHandMap);
    }
}
__name(memoizeSet, 'memoizeSet');
var deep_eql_default = deepEqual;
function deepEqual(leftHandOperand, rightHandOperand, options) {
    if (options && options.comparator)
        return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
    if (simpleResult !== null) return simpleResult;
    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
__name(deepEqual, 'deepEqual');
function simpleEqual(leftHandOperand, rightHandOperand) {
    if (leftHandOperand === rightHandOperand)
        return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
    if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) return true;
    if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) return false;
    return null;
}
__name(simpleEqual, 'simpleEqual');
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
    options = options || {};
    options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
    var comparator = options && options.comparator;
    var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
    if (memoizeResultLeft !== null) return memoizeResultLeft;
    var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
    if (memoizeResultRight !== null) return memoizeResultRight;
    if (comparator) {
        var comparatorResult = comparator(leftHandOperand, rightHandOperand);
        if (comparatorResult === false || comparatorResult === true) {
            memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
            return comparatorResult;
        }
        var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
        if (simpleResult !== null) return simpleResult;
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
        if (leftHandOperand.size !== rightHandOperand.size) return false;
        if (leftHandOperand.size === 0) return true;
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
    if (length !== rightHandOperand.length) return false;
    if (length === 0) return true;
    var index = -1;
    while (++index < length)
        if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false)
            return false;
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
    if (hasIteratorFunction(target))
        try {
            return getGeneratorEntries(target[Symbol.iterator]());
        } catch (iteratorError) {
            return [];
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
    for (var key in target) keys.push(key);
    return keys;
}
__name(getEnumerableKeys, 'getEnumerableKeys');
function getEnumerableSymbols(target) {
    var keys = [];
    var allKeys = Object.getOwnPropertySymbols(target);
    for (var i = 0; i < allKeys.length; i += 1) {
        var key = allKeys[i];
        if (Object.getOwnPropertyDescriptor(target, key).enumerable) keys.push(key);
    }
    return keys;
}
__name(getEnumerableSymbols, 'getEnumerableSymbols');
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
    var length = keys.length;
    if (length === 0) return true;
    for (var i = 0; i < length; i += 1)
        if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false)
            return false;
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
        )
            return false;
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
    )
        return true;
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
            if (typeof entry === 'symbol') return entry.toString();
            return entry;
        }, 'mapSymbol'),
    );
}
__name(mapSymbols, 'mapSymbols');
function hasProperty(obj, name) {
    if (typeof obj === 'undefined' || obj === null) return false;
    return name in Object(obj);
}
__name(hasProperty, 'hasProperty');
function parsePath(path) {
    return path
        .replace(/([^\\])\[/g, '$1.[')
        .match(/(\\\.|[^.]+?)+/g)
        .map((value) => {
            if (value === 'constructor' || value === '__proto__' || value === 'prototype')
                return {};
            const mArr = /^\[(\d+)\]$/.exec(value);
            let parsed = null;
            if (mArr) parsed = {i: parseFloat(mArr[1])};
            else parsed = {p: value.replace(/\\([.[\]])/g, '$1')};
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
            if (typeof part.p === 'undefined') temporaryValue = temporaryValue[part.i];
            else temporaryValue = temporaryValue[part.p];
            if (i === pathDepth - 1) res = temporaryValue;
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
var _Assertion = class _Assertion {
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
        /** @type {{}} */
        __publicField(this, '__flags', {});
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
            const assertionErrorObjectProperties = {
                actual: getActual(this, arguments),
                expected,
                showDiff,
            };
            const operator = getOperator(this, arguments);
            if (operator) assertionErrorObjectProperties.operator = operator;
            throw new AssertionError(
                msg,
                assertionErrorObjectProperties,
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
__name(_Assertion, 'Assertion');
var Assertion = _Assertion;
var events = new EventTarget();
var _PluginEvent = class _PluginEvent extends Event {
    constructor(type3, name, fn) {
        super(type3);
        this.name = String(name);
        this.fn = fn;
    }
};
__name(_PluginEvent, 'PluginEvent');
var PluginEvent = _PluginEvent;
function isProxyEnabled() {
    return config.useProxy && typeof Proxy !== 'undefined' && typeof Reflect !== 'undefined';
}
__name(isProxyEnabled, 'isProxyEnabled');
function addProperty(ctx, name, getter) {
    getter = getter === void 0 ? function () {} : getter;
    Object.defineProperty(ctx, name, {
        get: /* @__PURE__ */ __name(function propertyGetter() {
            if (!isProxyEnabled() && !flag(this, 'lockSsfi')) flag(this, 'ssfi', propertyGetter);
            let result = getter.call(this);
            if (result !== void 0) return result;
            let newAssertion = new Assertion();
            transferFlags(this, newAssertion);
            return newAssertion;
        }, 'propertyGetter'),
        configurable: true,
    });
    events.dispatchEvent(new PluginEvent('addProperty', name, getter));
}
__name(addProperty, 'addProperty');
var fnLengthDesc = Object.getOwnPropertyDescriptor(function () {}, 'length');
function addLengthGuard(fn, assertionName, isChainable) {
    if (!fnLengthDesc.configurable) return fn;
    Object.defineProperty(fn, 'length', {
        get: /* @__PURE__ */ __name(function () {
            if (isChainable)
                throw Error(
                    'Invalid Chai property: ' +
                        assertionName +
                        '.length. Due to a compatibility issue, "length" cannot directly follow "' +
                        assertionName +
                        '". Use "' +
                        assertionName +
                        '.lengthOf" instead.',
                );
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
function getProperties(object) {
    let result = Object.getOwnPropertyNames(object);
    function addProperty2(property) {
        if (result.indexOf(property) === -1) result.push(property);
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
                if (nonChainableMethodName)
                    throw Error(
                        'Invalid Chai property: ' +
                            nonChainableMethodName +
                            '.' +
                            property +
                            '. See docs for proper usage of "' +
                            nonChainableMethodName +
                            '".',
                    );
                let suggestion = null;
                let suggestionDistance = 4;
                getProperties(target).forEach(function (prop) {
                    if (!Object.prototype.hasOwnProperty(prop) && builtins.indexOf(prop) === -1) {
                        let dist = stringDistanceCapped(property, prop, suggestionDistance);
                        if (dist < suggestionDistance) {
                            suggestion = prop;
                            suggestionDistance = dist;
                        }
                    }
                });
                if (suggestion !== null)
                    throw Error(
                        'Invalid Chai property: ' +
                            property +
                            '. Did you mean "' +
                            suggestion +
                            '"?',
                    );
                else throw Error('Invalid Chai property: ' + property);
            }
            if (builtins.indexOf(property) === -1 && !flag(target, 'lockSsfi'))
                flag(target, 'ssfi', proxyGetter);
            return Reflect.get(target, property);
        }, 'proxyGetter'),
    });
}
__name(proxify, 'proxify');
function stringDistanceCapped(strA, strB, cap) {
    if (Math.abs(strA.length - strB.length) >= cap) return cap;
    let memo = [];
    for (let i = 0; i <= strA.length; i++) {
        memo[i] = Array(strB.length + 1).fill(0);
        memo[i][0] = i;
    }
    for (let j = 0; j < strB.length; j++) memo[0][j] = j;
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
function addMethod(ctx, name, method) {
    let methodWrapper = /* @__PURE__ */ __name(function () {
        if (!flag(this, 'lockSsfi')) flag(this, 'ssfi', methodWrapper);
        let result = method.apply(this, arguments);
        if (result !== void 0) return result;
        let newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
    }, 'methodWrapper');
    addLengthGuard(methodWrapper, name, false);
    ctx[name] = proxify(methodWrapper, name);
    events.dispatchEvent(new PluginEvent('addMethod', name, method));
}
__name(addMethod, 'addMethod');
function overwriteProperty(ctx, name, getter) {
    let _get = Object.getOwnPropertyDescriptor(ctx, name),
        _super = /* @__PURE__ */ __name(function () {}, '_super');
    if (_get && 'function' === typeof _get.get) _super = _get.get;
    Object.defineProperty(ctx, name, {
        get: /* @__PURE__ */ __name(function overwritingPropertyGetter() {
            if (!isProxyEnabled() && !flag(this, 'lockSsfi'))
                flag(this, 'ssfi', overwritingPropertyGetter);
            let origLockSsfi = flag(this, 'lockSsfi');
            flag(this, 'lockSsfi', true);
            let result = getter(_super).call(this);
            flag(this, 'lockSsfi', origLockSsfi);
            if (result !== void 0) return result;
            let newAssertion = new Assertion();
            transferFlags(this, newAssertion);
            return newAssertion;
        }, 'overwritingPropertyGetter'),
        configurable: true,
    });
}
__name(overwriteProperty, 'overwriteProperty');
function overwriteMethod(ctx, name, method) {
    let _method = ctx[name],
        _super = /* @__PURE__ */ __name(function () {
            throw new Error(name + ' is not a function');
        }, '_super');
    if (_method && 'function' === typeof _method) _super = _method;
    let overwritingMethodWrapper = /* @__PURE__ */ __name(function () {
        if (!flag(this, 'lockSsfi')) flag(this, 'ssfi', overwritingMethodWrapper);
        let origLockSsfi = flag(this, 'lockSsfi');
        flag(this, 'lockSsfi', true);
        let result = method(_super).apply(this, arguments);
        flag(this, 'lockSsfi', origLockSsfi);
        if (result !== void 0) return result;
        let newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
    }, 'overwritingMethodWrapper');
    addLengthGuard(overwritingMethodWrapper, name, false);
    ctx[name] = proxify(overwritingMethodWrapper, name);
}
__name(overwriteMethod, 'overwriteMethod');
var canSetPrototype = typeof Object.setPrototypeOf === 'function';
var testFn = /* @__PURE__ */ __name(function () {}, 'testFn');
var excludeNames = Object.getOwnPropertyNames(testFn).filter(function (name) {
    let propDesc = Object.getOwnPropertyDescriptor(testFn, name);
    if (typeof propDesc !== 'object') return true;
    return !propDesc.configurable;
});
var call = Function.prototype.call;
var apply = Function.prototype.apply;
var _PluginAddChainableMethodEvent = class _PluginAddChainableMethodEvent extends PluginEvent {
    constructor(type3, name, fn, chainingBehavior) {
        super(type3, name, fn);
        this.chainingBehavior = chainingBehavior;
    }
};
__name(_PluginAddChainableMethodEvent, 'PluginAddChainableMethodEvent');
var PluginAddChainableMethodEvent = _PluginAddChainableMethodEvent;
function addChainableMethod(ctx, name, method, chainingBehavior) {
    if (typeof chainingBehavior !== 'function')
        chainingBehavior = /* @__PURE__ */ __name(function () {}, 'chainingBehavior');
    let chainableBehavior = {
        method,
        chainingBehavior,
    };
    if (!ctx.__methods) ctx.__methods = {};
    ctx.__methods[name] = chainableBehavior;
    Object.defineProperty(ctx, name, {
        get: /* @__PURE__ */ __name(function chainableMethodGetter() {
            chainableBehavior.chainingBehavior.call(this);
            let chainableMethodWrapper = /* @__PURE__ */ __name(function () {
                if (!flag(this, 'lockSsfi')) flag(this, 'ssfi', chainableMethodWrapper);
                let result = chainableBehavior.method.apply(this, arguments);
                if (result !== void 0) return result;
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
            } else
                Object.getOwnPropertyNames(ctx).forEach(function (asserterName) {
                    if (excludeNames.indexOf(asserterName) !== -1) return;
                    let pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
                    Object.defineProperty(chainableMethodWrapper, asserterName, pd);
                });
            transferFlags(this, chainableMethodWrapper);
            return proxify(chainableMethodWrapper);
        }, 'chainableMethodGetter'),
        configurable: true,
    });
    events.dispatchEvent(
        new PluginAddChainableMethodEvent('addChainableMethod', name, method, chainingBehavior),
    );
}
__name(addChainableMethod, 'addChainableMethod');
function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
    let chainableBehavior = ctx.__methods[name];
    let _chainingBehavior = chainableBehavior.chainingBehavior;
    chainableBehavior.chainingBehavior = /* @__PURE__ */ __name(
        function overwritingChainableMethodGetter() {
            let result = chainingBehavior(_chainingBehavior).call(this);
            if (result !== void 0) return result;
            let newAssertion = new Assertion();
            transferFlags(this, newAssertion);
            return newAssertion;
        },
        'overwritingChainableMethodGetter',
    );
    let _method = chainableBehavior.method;
    chainableBehavior.method = /* @__PURE__ */ __name(function overwritingChainableMethodWrapper() {
        let result = method(_method).apply(this, arguments);
        if (result !== void 0) return result;
        let newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
    }, 'overwritingChainableMethodWrapper');
}
__name(overwriteChainableMethod, 'overwriteChainableMethod');
function compareByInspect(a, b) {
    return inspect2(a) < inspect2(b) ? -1 : 1;
}
__name(compareByInspect, 'compareByInspect');
function getOwnEnumerablePropertySymbols(obj) {
    if (typeof Object.getOwnPropertySymbols !== 'function') return [];
    return Object.getOwnPropertySymbols(obj).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
    });
}
__name(getOwnEnumerablePropertySymbols, 'getOwnEnumerablePropertySymbols');
function getOwnEnumerableProperties(obj) {
    return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
}
__name(getOwnEnumerableProperties, 'getOwnEnumerableProperties');
var isNaN2 = Number.isNaN;
function isObjectType(obj) {
    let objectType = type(obj);
    return ['Array', 'Object', 'Function'].indexOf(objectType) !== -1;
}
__name(isObjectType, 'isObjectType');
function getOperator(obj, args) {
    let operator = flag(obj, 'operator');
    let negate = flag(obj, 'negate');
    let expected = args[3];
    let msg = negate ? args[2] : args[1];
    if (operator) return operator;
    if (typeof msg === 'function') msg = msg();
    msg = msg || '';
    if (!msg) return;
    if (/\shave\s/.test(msg)) return;
    let isObject = isObjectType(expected);
    if (/\snot\s/.test(msg)) return isObject ? 'notDeepStrictEqual' : 'notStrictEqual';
    return isObject ? 'deepStrictEqual' : 'strictEqual';
}
__name(getOperator, 'getOperator');
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
    if (functionTypes['function'].includes(type3))
        this.assert(
            functionTypes[type3].includes(detectedType),
            'expected #{this} to be ' + article + type3,
            'expected #{this} not to be ' + article + type3,
        );
    else
        this.assert(
            type3 === detectedType,
            'expected #{this} to be ' + article + type3,
            'expected #{this} not to be ' + article + type3,
        );
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
            if (isDeep)
                throw new AssertionError(
                    flagMsg + 'unable to use .deep.include with WeakSet',
                    void 0,
                    ssfi,
                );
            included = obj.has(val);
            break;
        case 'map':
            obj.forEach(function (item) {
                included = included || isEql(item, val);
            });
            break;
        case 'set':
            if (isDeep)
                obj.forEach(function (item) {
                    included = included || isEql(item, val);
                });
            else included = obj.has(val);
            break;
        case 'array':
            if (isDeep)
                included = obj.some(function (item) {
                    return isEql(item, val);
                });
            else included = obj.indexOf(val) !== -1;
            break;
        default: {
            if (val !== Object(val))
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
                    if (!check_error_exports.compatibleConstructor(err, AssertionError)) throw err;
                    if (firstErr === null) firstErr = err;
                    numErrs++;
                }
            }, this);
            if (negate && props.length > 1 && numErrs === props.length) throw firstErr;
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
    if ((isCallable && negate) || (!isCallable && !negate))
        throw new AssertionError(assertionMessage, void 0, ssfi);
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
        case 'function':
            throw new AssertionError(
                (flagMsg + '.empty was passed a function ' + getName(val)).trim(),
                void 0,
                ssfi,
            );
        default:
            if (val !== Object(val))
                throw new AssertionError(
                    flagMsg + '.empty was passed non-string primitive ' + inspect2(val),
                    void 0,
                    ssfi,
                );
            itemsCount = Object.keys(val).length;
    }
    this.assert(
        0 === itemsCount,
        'expected #{this} to be empty',
        'expected #{this} not to be empty',
    );
});
function checkArguments() {
    let type3 = type(flag2(this, 'object'));
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
    } else
        this.assert(
            val === obj,
            'expected #{this} to equal #{exp}',
            'expected #{this} to not equal #{exp}',
            val,
            this._obj,
            true,
        );
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
    if (doLength && objType !== 'map' && objType !== 'set')
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    if (!doLength && objType === 'date' && nType !== 'date')
        throw new AssertionError(msgPrefix + 'the argument to above must be a date', void 0, ssfi);
    else if (!isNumeric(n) && (doLength || isNumeric(obj)))
        throw new AssertionError(
            msgPrefix + 'the argument to above must be a number',
            void 0,
            ssfi,
        );
    else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
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
        } else itemsCount = obj.length;
        this.assert(
            itemsCount > n,
            'expected #{this} to have a ' + descriptor + ' above #{exp} but got #{act}',
            'expected #{this} to not have a ' + descriptor + ' above #{exp}',
            n,
            itemsCount,
        );
    } else
        this.assert(
            obj > n,
            'expected #{this} to be above #{exp}',
            'expected #{this} to be at most #{exp}',
            n,
        );
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
    if (doLength && objType !== 'map' && objType !== 'set')
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    if (!doLength && objType === 'date' && nType !== 'date')
        errorMessage = msgPrefix + 'the argument to least must be a date';
    else if (!isNumeric(n) && (doLength || isNumeric(obj)))
        errorMessage = msgPrefix + 'the argument to least must be a number';
    else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
        let printObj = objType === 'string' ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else shouldThrow = false;
    if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
    if (doLength) {
        let descriptor = 'length',
            itemsCount;
        if (objType === 'map' || objType === 'set') {
            descriptor = 'size';
            itemsCount = obj.size;
        } else itemsCount = obj.length;
        this.assert(
            itemsCount >= n,
            'expected #{this} to have a ' + descriptor + ' at least #{exp} but got #{act}',
            'expected #{this} to have a ' + descriptor + ' below #{exp}',
            n,
            itemsCount,
        );
    } else
        this.assert(
            obj >= n,
            'expected #{this} to be at least #{exp}',
            'expected #{this} to be below #{exp}',
            n,
        );
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
    if (doLength && objType !== 'map' && objType !== 'set')
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    if (!doLength && objType === 'date' && nType !== 'date')
        errorMessage = msgPrefix + 'the argument to below must be a date';
    else if (!isNumeric(n) && (doLength || isNumeric(obj)))
        errorMessage = msgPrefix + 'the argument to below must be a number';
    else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
        let printObj = objType === 'string' ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else shouldThrow = false;
    if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
    if (doLength) {
        let descriptor = 'length',
            itemsCount;
        if (objType === 'map' || objType === 'set') {
            descriptor = 'size';
            itemsCount = obj.size;
        } else itemsCount = obj.length;
        this.assert(
            itemsCount < n,
            'expected #{this} to have a ' + descriptor + ' below #{exp} but got #{act}',
            'expected #{this} to not have a ' + descriptor + ' below #{exp}',
            n,
            itemsCount,
        );
    } else
        this.assert(
            obj < n,
            'expected #{this} to be below #{exp}',
            'expected #{this} to be at least #{exp}',
            n,
        );
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
    if (doLength && objType !== 'map' && objType !== 'set')
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    if (!doLength && objType === 'date' && nType !== 'date')
        errorMessage = msgPrefix + 'the argument to most must be a date';
    else if (!isNumeric(n) && (doLength || isNumeric(obj)))
        errorMessage = msgPrefix + 'the argument to most must be a number';
    else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
        let printObj = objType === 'string' ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else shouldThrow = false;
    if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
    if (doLength) {
        let descriptor = 'length',
            itemsCount;
        if (objType === 'map' || objType === 'set') {
            descriptor = 'size';
            itemsCount = obj.size;
        } else itemsCount = obj.length;
        this.assert(
            itemsCount <= n,
            'expected #{this} to have a ' + descriptor + ' at most #{exp} but got #{act}',
            'expected #{this} to have a ' + descriptor + ' above #{exp}',
            n,
            itemsCount,
        );
    } else
        this.assert(
            obj <= n,
            'expected #{this} to be at most #{exp}',
            'expected #{this} to be above #{exp}',
            n,
        );
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
    if (doLength && objType !== 'map' && objType !== 'set')
        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
    if (!doLength && objType === 'date' && (startType !== 'date' || finishType !== 'date'))
        errorMessage = msgPrefix + 'the arguments to within must be dates';
    else if ((!isNumeric(start) || !isNumeric(finish)) && (doLength || isNumeric(obj)))
        errorMessage = msgPrefix + 'the arguments to within must be numbers';
    else if (!doLength && objType !== 'date' && !isNumeric(obj)) {
        let printObj = objType === 'string' ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
    } else shouldThrow = false;
    if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
    if (doLength) {
        let descriptor = 'length',
            itemsCount;
        if (objType === 'map' || objType === 'set') {
            descriptor = 'size';
            itemsCount = obj.size;
        } else itemsCount = obj.length;
        this.assert(
            itemsCount >= start && itemsCount <= finish,
            'expected #{this} to have a ' + descriptor + ' within ' + range,
            'expected #{this} to not have a ' + descriptor + ' within ' + range,
        );
    } else
        this.assert(
            obj >= start && obj <= finish,
            'expected #{this} to be within ' + range,
            'expected #{this} to not be within ' + range,
        );
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
    if (name == null) name = 'an unnamed constructor';
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
        if (nameType !== 'string')
            throw new AssertionError(
                flagMsg + 'the argument to property must be a string when using nested syntax',
                void 0,
                ssfi,
            );
    } else if (nameType !== 'string' && nameType !== 'number' && nameType !== 'symbol')
        throw new AssertionError(
            flagMsg + 'the argument to property must be a string, number, or symbol',
            void 0,
            ssfi,
        );
    if (isNested && isOwn)
        throw new AssertionError(
            flagMsg + 'The "nested" and "own" flags cannot be combined.',
            void 0,
            ssfi,
        );
    if (obj === null || obj === void 0)
        throw new AssertionError(flagMsg + 'Target cannot be null or undefined.', void 0, ssfi);
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
    if (!negate || arguments.length === 1)
        this.assert(
            hasProperty2,
            'expected #{this} to have ' + descriptor + inspect2(name),
            'expected #{this} to not have ' + descriptor + inspect2(name),
        );
    if (arguments.length > 1)
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
    if (actualDescriptor && descriptor)
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
    else
        this.assert(
            actualDescriptor,
            'expected #{this} to have an own property descriptor for ' + inspect2(name),
            'expected #{this} to not have an own property descriptor for ' + inspect2(name),
        );
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
    let obj = flag2(this, 'object');
    new Assertion(obj, flag2(this, 'message'), flag2(this, 'ssfi'), true).is.a('string');
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
        if (keysType !== 'Array') keys = Array.prototype.slice.call(arguments);
    } else {
        actual = getOwnEnumerableProperties(obj);
        switch (keysType) {
            case 'Array':
                if (arguments.length > 1) throw new AssertionError(mixedArgsMsg, void 0, ssfi);
                break;
            case 'Object':
                if (arguments.length > 1) throw new AssertionError(mixedArgsMsg, void 0, ssfi);
                keys = Object.keys(keys);
                break;
            default:
                keys = Array.prototype.slice.call(arguments);
        }
        keys = keys.map(function (val) {
            return typeof val === 'symbol' ? val : String(val);
        });
    }
    if (!keys.length) throw new AssertionError(flagMsg + 'keys required', void 0, ssfi);
    let len = keys.length,
        any = flag2(this, 'any'),
        all = flag2(this, 'all'),
        expected = keys,
        isEql = isDeep ? flag2(this, 'eql') : (val1, val2) => val1 === val2;
    if (!any && !all) all = true;
    if (any)
        ok = expected.some(function (expectedKey) {
            return actual.some(function (actualKey) {
                return isEql(expectedKey, actualKey);
            });
        });
    if (all) {
        ok = expected.every(function (expectedKey) {
            return actual.some(function (actualKey) {
                return isEql(expectedKey, actualKey);
            });
        });
        if (!flag2(this, 'contains')) ok = ok && keys.length == actual.length;
    }
    if (len > 1) {
        keys = keys.map(function (key) {
            return inspect2(key);
        });
        let last = keys.pop();
        if (all) str = keys.join(', ') + ', and ' + last;
        if (any) str = keys.join(', ') + ', or ' + last;
    } else str = inspect2(keys[0]);
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
        if (errorLike instanceof Error) errorLikeString = '#{exp}';
        else if (errorLike) errorLikeString = check_error_exports.getConstructorName(errorLike);
        let actual = caughtErr;
        if (caughtErr instanceof Error) actual = caughtErr.toString();
        else if (typeof caughtErr === 'string') actual = caughtErr;
        else if (caughtErr && (typeof caughtErr === 'object' || typeof caughtErr === 'function'))
            try {
                actual = check_error_exports.getConstructorName(caughtErr);
            } catch (_err) {}
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
            if (check_error_exports.compatibleInstance(caughtErr, errorLike) === negate)
                if (everyArgIsDefined && negate) errorLikeFail = true;
                else
                    this.assert(
                        negate,
                        'expected #{this} to throw #{exp} but #{act} was thrown',
                        'expected #{this} to not throw #{exp}' +
                            (caughtErr && !negate ? ' but #{act} was thrown' : ''),
                        errorLike.toString(),
                        caughtErr.toString(),
                    );
        }
        if (check_error_exports.compatibleConstructor(caughtErr, errorLike) === negate)
            if (everyArgIsDefined && negate) errorLikeFail = true;
            else
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
    if (caughtErr && errMsgMatcher !== void 0 && errMsgMatcher !== null) {
        let placeholder = 'including';
        if (isRegExp2(errMsgMatcher)) placeholder = 'matching';
        if (check_error_exports.compatibleMessage(caughtErr, errMsgMatcher) === negate)
            if (everyArgIsDefined && negate) errMsgMatcherFail = true;
            else
                this.assert(
                    negate,
                    'expected #{this} to throw error ' + placeholder + ' #{exp} but got #{act}',
                    'expected #{this} to throw error not ' + placeholder + ' #{exp}',
                    errMsgMatcher,
                    check_error_exports.getMessage(caughtErr),
                );
    }
    if (errorLikeFail && errMsgMatcherFail)
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
    let result = matcher(flag2(this, 'object'));
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
    if (delta == void 0)
        throw new AssertionError(flagMsg ? `${flagMsg}: ${message}` : message, void 0, ssfi);
    new Assertion(delta, flagMsg, ssfi, true).is.numeric;
    message = 'A `expected` value is required for `closeTo`';
    if (expected == void 0)
        throw new AssertionError(flagMsg ? `${flagMsg}: ${message}` : message, void 0, ssfi);
    new Assertion(expected, flagMsg, ssfi, true).is.numeric;
    const abs = /* @__PURE__ */ __name((x) => (x < 0 ? -x : x), 'abs');
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
    if (contains)
        this.assert(
            list.some(function (possibility) {
                return expected.indexOf(possibility) > -1;
            }),
            'expected #{this} to contain one of #{exp}',
            'expected #{this} to not contain one of #{exp}',
            list,
            expected,
        );
    else if (isDeep)
        this.assert(
            list.some(function (possibility) {
                return eql(expected, possibility);
            }),
            'expected #{this} to deeply equal one of #{exp}',
            'expected #{this} to deeply equal one of #{exp}',
            list,
            expected,
        );
    else
        this.assert(
            list.indexOf(expected) > -1,
            'expected #{this} to be one of #{exp}',
            'expected #{this} to not be one of #{exp}',
            list,
            expected,
        );
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
    if (behavior === 'change') expression = Math.abs(final - initial) === Math.abs(delta);
    else expression = realDelta === Math.abs(delta);
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
    if (expected === actual) return true;
    if (typeof actual !== typeof expected) return false;
    if (typeof expected !== 'object' || expected === null) return expected === actual;
    if (!actual) return false;
    if (Array.isArray(expected)) {
        if (!Array.isArray(actual)) return false;
        return expected.every(function (exp) {
            return actual.some(function (act) {
                return compareSubset(exp, act);
            });
        });
    }
    if (expected instanceof Date)
        if (actual instanceof Date) return expected.getTime() === actual.getTime();
        else return false;
    return Object.keys(expected).every(function (key) {
        let expectedValue = expected[key];
        let actualValue = actual[key];
        if (typeof expectedValue === 'object' && expectedValue !== null && actualValue !== null)
            return compareSubset(expectedValue, actualValue);
        if (typeof expectedValue === 'function') return expectedValue(actualValue);
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
        )
            return new Assertion(this.valueOf(), null, shouldGetter);
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
function assert(express, errmsg) {
    new Assertion(null, null, assert, true).assert(
        express,
        errmsg,
        '[ negation message unavailable ]',
    );
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
    return flag(
        new Assertion(fn, msg, assert.throws, true).to.throw(errorLike, errMsgMatcher),
        'object',
    );
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
    if (val) throw val;
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
for (const [name, as] of [
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
])
    assert[as] = assert[name];
var used = [];
function use$1(fn) {
    const exports = {
        use: use$1,
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
__name(use$1, 'use');

//#endregion
//#region ../common/src/common-utils.js
/**
 * Like customElements.define() but tries to display an error in case the browser doesn't
 * support everything we need.
 *
 * Returns false in case define failed, true otherwise.
 *
 * @returns {boolean}
 */
/**
 * Same as customElements.define() but less strict.
 *
 * In case the same component (with the exact same implementation) is already
 * defined then this will do nothing instead of erroring out.
 *
 * @param {string} name
 * @param {Function} constructor
 * @param {object} options
 */
const defineCustomElement = (name, constructor, options) => {
    if (customElements.get(name) === constructor) return true;
    customElements.define(name, constructor, options);
    return true;
};
/**
 * Creates a random id
 *
 * taken from: https://stackoverflow.com/a/1349426/1581487
 *
 * @param length
 * @returns {string}
 */
const makeId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = 62;
    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
};
/**
 * Get an absolute URL for shared assets (hashed assets).
 *
 * @param {string} path The relative path to the shared asset
 * @param {object} [options] Optional parameters
 * @param {string} [options.metaUrl] Custom meta URL for testing
 * @returns {string} The absolute URL to the shared asset
 */
const getAbsoluteURL = (path, options = {}) => {
    const baseUrl = getBaseURL(options);
    return new URL(path, baseUrl).href;
};
/**
 * Get an absolute URL for local assets (namespaced by package).
 *
 * @param {string} pkgName The package which provides the asset
 * @param {string} path The relative path within the package
 * @param {object} [options] Optional parameters
 * @param {string} [options.metaUrl] Custom meta URL for testing
 * @returns {string} The absolute URL to the local asset
 */
const getAssetURL = (pkgName, path, options = {}) => {
    if (path === void 0) {
        console.warn('getAssetURL called without package name, use getAbsoluteURL instead');
        return getAbsoluteURL(pkgName, options);
    }
    const fullPath = 'local/' + pkgName + '/' + path;
    const baseUrl = getBaseURL(options);
    return new URL(fullPath, baseUrl).href;
};
/**
 * Get the base URL for asset resolution.
 *
 * @param {object} [options] Optional parameters
 * @param {string} [options.metaUrl] Custom meta URL for testing
 * @returns {URL} The base URL for asset resolution
 */
const getBaseURL = (options = {}) => {
    let baseUrl = new URL(options.metaUrl !== void 0 ? options.metaUrl : import.meta.url);
    if (baseUrl.pathname.split('/').slice(-2)[0] === 'shared') baseUrl = new URL('..', baseUrl);
    return baseUrl;
};

//#endregion
//#region ../../node_modules/jquery/dist/jquery.js
var require_jquery = /* @__PURE__ */ __commonJSMin((exports, module) => {
    /*!
     * jQuery JavaScript Library v3.7.1
     * https://jquery.com/
     *
     * Copyright OpenJS Foundation and other contributors
     * Released under the MIT license
     * https://jquery.org/license
     *
     * Date: 2023-08-28T13:37Z
     */
    (function (global, factory) {
        'use strict';
        if (typeof module === 'object' && typeof module.exports === 'object')
            module.exports = global.document
                ? factory(global, true)
                : function (w) {
                      if (!w.document) throw new Error('jQuery requires a window with a document');
                      return factory(w);
                  };
        else factory(global);
    })(typeof window !== 'undefined' ? window : exports, function (window, noGlobal) {
        'use strict';
        var arr = [];
        var getProto = Object.getPrototypeOf;
        var slice = arr.slice;
        var flat = arr.flat
            ? function (array) {
                  return arr.flat.call(array);
              }
            : function (array) {
                  return arr.concat.apply([], array);
              };
        var push = arr.push;
        var indexOf = arr.indexOf;
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var fnToString = hasOwn.toString;
        var ObjectFunctionString = fnToString.call(Object);
        var support = {};
        var isFunction = function isFunction(obj) {
            return (
                typeof obj === 'function' &&
                typeof obj.nodeType !== 'number' &&
                typeof obj.item !== 'function'
            );
        };
        var isWindow = function isWindow(obj) {
            return obj != null && obj === obj.window;
        };
        var document = window.document;
        var preservedScriptAttributes = {
            type: true,
            src: true,
            nonce: true,
            noModule: true,
        };
        function DOMEval(code, node, doc) {
            doc = doc || document;
            var i,
                val,
                script = doc.createElement('script');
            script.text = code;
            if (node)
                for (i in preservedScriptAttributes) {
                    val = node[i] || (node.getAttribute && node.getAttribute(i));
                    if (val) script.setAttribute(i, val);
                }
            doc.head.appendChild(script).parentNode.removeChild(script);
        }
        function toType(obj) {
            if (obj == null) return obj + '';
            return typeof obj === 'object' || typeof obj === 'function'
                ? class2type[toString.call(obj)] || 'object'
                : typeof obj;
        }
        var version = '3.7.1',
            rhtmlSuffix = /HTML$/i,
            jQuery = function (selector, context) {
                return new jQuery.fn.init(selector, context);
            };
        jQuery.fn = jQuery.prototype = {
            jquery: version,
            constructor: jQuery,
            length: 0,
            toArray: function () {
                return slice.call(this);
            },
            get: function (num) {
                if (num == null) return slice.call(this);
                return num < 0 ? this[num + this.length] : this[num];
            },
            pushStack: function (elems) {
                var ret = jQuery.merge(this.constructor(), elems);
                ret.prevObject = this;
                return ret;
            },
            each: function (callback) {
                return jQuery.each(this, callback);
            },
            map: function (callback) {
                return this.pushStack(
                    jQuery.map(this, function (elem, i) {
                        return callback.call(elem, i, elem);
                    }),
                );
            },
            slice: function () {
                return this.pushStack(slice.apply(this, arguments));
            },
            first: function () {
                return this.eq(0);
            },
            last: function () {
                return this.eq(-1);
            },
            even: function () {
                return this.pushStack(
                    jQuery.grep(this, function (_elem, i) {
                        return (i + 1) % 2;
                    }),
                );
            },
            odd: function () {
                return this.pushStack(
                    jQuery.grep(this, function (_elem, i) {
                        return i % 2;
                    }),
                );
            },
            eq: function (i) {
                var len = this.length,
                    j = +i + (i < 0 ? len : 0);
                return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
            },
            end: function () {
                return this.prevObject || this.constructor();
            },
            push,
            sort: arr.sort,
            splice: arr.splice,
        };
        jQuery.extend = jQuery.fn.extend = function () {
            var options,
                name,
                src,
                copy,
                copyIsArray,
                clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;
            if (typeof target === 'boolean') {
                deep = target;
                target = arguments[i] || {};
                i++;
            }
            if (typeof target !== 'object' && !isFunction(target)) target = {};
            if (i === length) {
                target = this;
                i--;
            }
            for (; i < length; i++)
                if ((options = arguments[i]) != null)
                    for (name in options) {
                        copy = options[name];
                        if (name === '__proto__' || target === copy) continue;
                        if (
                            deep &&
                            copy &&
                            (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
                        ) {
                            src = target[name];
                            if (copyIsArray && !Array.isArray(src)) clone = [];
                            else if (!copyIsArray && !jQuery.isPlainObject(src)) clone = {};
                            else clone = src;
                            copyIsArray = false;
                            target[name] = jQuery.extend(deep, clone, copy);
                        } else if (copy !== void 0) target[name] = copy;
                    }
            return target;
        };
        jQuery.extend({
            expando: 'jQuery' + (version + Math.random()).replace(/\D/g, ''),
            isReady: true,
            error: function (msg) {
                throw new Error(msg);
            },
            noop: function () {},
            isPlainObject: function (obj) {
                var proto, Ctor;
                if (!obj || toString.call(obj) !== '[object Object]') return false;
                proto = getProto(obj);
                if (!proto) return true;
                Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
                return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString;
            },
            isEmptyObject: function (obj) {
                var name;
                for (name in obj) return false;
                return true;
            },
            globalEval: function (code, options, doc) {
                DOMEval(code, {nonce: options && options.nonce}, doc);
            },
            each: function (obj, callback) {
                var length,
                    i = 0;
                if (isArrayLike(obj)) {
                    length = obj.length;
                    for (; i < length; i++) if (callback.call(obj[i], i, obj[i]) === false) break;
                } else for (i in obj) if (callback.call(obj[i], i, obj[i]) === false) break;
                return obj;
            },
            text: function (elem) {
                var node,
                    ret = '',
                    i = 0,
                    nodeType = elem.nodeType;
                if (!nodeType) while ((node = elem[i++])) ret += jQuery.text(node);
                if (nodeType === 1 || nodeType === 11) return elem.textContent;
                if (nodeType === 9) return elem.documentElement.textContent;
                if (nodeType === 3 || nodeType === 4) return elem.nodeValue;
                return ret;
            },
            makeArray: function (arr, results) {
                var ret = results || [];
                if (arr != null)
                    if (isArrayLike(Object(arr)))
                        jQuery.merge(ret, typeof arr === 'string' ? [arr] : arr);
                    else push.call(ret, arr);
                return ret;
            },
            inArray: function (elem, arr, i) {
                return arr == null ? -1 : indexOf.call(arr, elem, i);
            },
            isXMLDoc: function (elem) {
                var namespace = elem && elem.namespaceURI,
                    docElem = elem && (elem.ownerDocument || elem).documentElement;
                return !rhtmlSuffix.test(namespace || (docElem && docElem.nodeName) || 'HTML');
            },
            merge: function (first, second) {
                var len = +second.length,
                    j = 0,
                    i = first.length;
                for (; j < len; j++) first[i++] = second[j];
                first.length = i;
                return first;
            },
            grep: function (elems, callback, invert) {
                var callbackInverse,
                    matches = [],
                    i = 0,
                    length = elems.length,
                    callbackExpect = !invert;
                for (; i < length; i++) {
                    callbackInverse = !callback(elems[i], i);
                    if (callbackInverse !== callbackExpect) matches.push(elems[i]);
                }
                return matches;
            },
            map: function (elems, callback, arg) {
                var length,
                    value,
                    i = 0,
                    ret = [];
                if (isArrayLike(elems)) {
                    length = elems.length;
                    for (; i < length; i++) {
                        value = callback(elems[i], i, arg);
                        if (value != null) ret.push(value);
                    }
                } else
                    for (i in elems) {
                        value = callback(elems[i], i, arg);
                        if (value != null) ret.push(value);
                    }
                return flat(ret);
            },
            guid: 1,
            support,
        });
        if (typeof Symbol === 'function') jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
        jQuery.each(
            'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '),
            function (_i, name) {
                class2type['[object ' + name + ']'] = name.toLowerCase();
            },
        );
        function isArrayLike(obj) {
            var length = !!obj && 'length' in obj && obj.length,
                type = toType(obj);
            if (isFunction(obj) || isWindow(obj)) return false;
            return (
                type === 'array' ||
                length === 0 ||
                (typeof length === 'number' && length > 0 && length - 1 in obj)
            );
        }
        function nodeName(elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        }
        var pop = arr.pop;
        var sort = arr.sort;
        var splice = arr.splice;
        var whitespace = '[\\x20\\t\\r\\n\\f]';
        var rtrimCSS = new RegExp(
            '^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$',
            'g',
        );
        jQuery.contains = function (a, b) {
            var bup = b && b.parentNode;
            return (
                a === bup ||
                !!(
                    bup &&
                    bup.nodeType === 1 &&
                    (a.contains
                        ? a.contains(bup)
                        : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16)
                )
            );
        };
        var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
        function fcssescape(ch, asCodePoint) {
            if (asCodePoint) {
                if (ch === '\0') return '�';
                return ch.slice(0, -1) + '\\' + ch.charCodeAt(ch.length - 1).toString(16) + ' ';
            }
            return '\\' + ch;
        }
        jQuery.escapeSelector = function (sel) {
            return (sel + '').replace(rcssescape, fcssescape);
        };
        var preferredDoc = document,
            pushNative = push;
        (function () {
            var i,
                Expr,
                outermostContext,
                sortInput,
                hasDuplicate,
                push = pushNative,
                document,
                documentElement,
                documentIsHTML,
                rbuggyQSA,
                matches,
                expando = jQuery.expando,
                dirruns = 0,
                done = 0,
                classCache = createCache(),
                tokenCache = createCache(),
                compilerCache = createCache(),
                nonnativeSelectorCache = createCache(),
                sortOrder = function (a, b) {
                    if (a === b) hasDuplicate = true;
                    return 0;
                },
                booleans =
                    'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',
                identifier =
                    '(?:\\\\[\\da-fA-F]{1,6}' +
                    whitespace +
                    '?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+',
                attributes =
                    '\\[' +
                    whitespace +
                    '*(' +
                    identifier +
                    ')(?:' +
                    whitespace +
                    '*([*^$|!~]?=)' +
                    whitespace +
                    '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' +
                    identifier +
                    '))|)' +
                    whitespace +
                    '*\\]',
                pseudos =
                    ':(' +
                    identifier +
                    ')(?:\\(((\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|' +
                    attributes +
                    ')*)|.*)\\)|)',
                rwhitespace = new RegExp(whitespace + '+', 'g'),
                rcomma = new RegExp('^' + whitespace + '*,' + whitespace + '*'),
                rleadingCombinator = new RegExp(
                    '^' + whitespace + '*([>+~]|' + whitespace + ')' + whitespace + '*',
                ),
                rdescend = new RegExp(whitespace + '|>'),
                rpseudo = new RegExp(pseudos),
                ridentifier = new RegExp('^' + identifier + '$'),
                matchExpr = {
                    ID: new RegExp('^#(' + identifier + ')'),
                    CLASS: new RegExp('^\\.(' + identifier + ')'),
                    TAG: new RegExp('^(' + identifier + '|[*])'),
                    ATTR: new RegExp('^' + attributes),
                    PSEUDO: new RegExp('^' + pseudos),
                    CHILD: new RegExp(
                        '^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' +
                            whitespace +
                            '*(even|odd|(([+-]|)(\\d*)n|)' +
                            whitespace +
                            '*(?:([+-]|)' +
                            whitespace +
                            '*(\\d+)|))' +
                            whitespace +
                            '*\\)|)',
                        'i',
                    ),
                    bool: new RegExp('^(?:' + booleans + ')$', 'i'),
                    needsContext: new RegExp(
                        '^' +
                            whitespace +
                            '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' +
                            whitespace +
                            '*((?:-\\d)?\\d*)' +
                            whitespace +
                            '*\\)|)(?=[^-]|$)',
                        'i',
                    ),
                },
                rinputs = /^(?:input|select|textarea|button)$/i,
                rheader = /^h\d$/i,
                rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                rsibling = /[+~]/,
                runescape = new RegExp(
                    '\\\\[\\da-fA-F]{1,6}' + whitespace + '?|\\\\([^\\r\\n\\f])',
                    'g',
                ),
                funescape = function (escape, nonHex) {
                    var high = '0x' + escape.slice(1) - 65536;
                    if (nonHex) return nonHex;
                    return high < 0
                        ? String.fromCharCode(high + 65536)
                        : String.fromCharCode((high >> 10) | 55296, (high & 1023) | 56320);
                },
                unloadHandler = function () {
                    setDocument();
                },
                inDisabledFieldset = addCombinator(
                    function (elem) {
                        return elem.disabled === true && nodeName(elem, 'fieldset');
                    },
                    {
                        dir: 'parentNode',
                        next: 'legend',
                    },
                );
            function safeActiveElement() {
                try {
                    return document.activeElement;
                } catch (err) {}
            }
            try {
                push.apply((arr = slice.call(preferredDoc.childNodes)), preferredDoc.childNodes);
                arr[preferredDoc.childNodes.length].nodeType;
            } catch (e) {
                push = {
                    apply: function (target, els) {
                        pushNative.apply(target, slice.call(els));
                    },
                    call: function (target) {
                        pushNative.apply(target, slice.call(arguments, 1));
                    },
                };
            }
            function find(selector, context, results, seed) {
                var m,
                    i,
                    elem,
                    nid,
                    match,
                    groups,
                    newSelector,
                    newContext = context && context.ownerDocument,
                    nodeType = context ? context.nodeType : 9;
                results = results || [];
                if (
                    typeof selector !== 'string' ||
                    !selector ||
                    (nodeType !== 1 && nodeType !== 9 && nodeType !== 11)
                )
                    return results;
                if (!seed) {
                    setDocument(context);
                    context = context || document;
                    if (documentIsHTML) {
                        if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
                            if ((m = match[1])) {
                                if (nodeType === 9)
                                    if ((elem = context.getElementById(m))) {
                                        if (elem.id === m) {
                                            push.call(results, elem);
                                            return results;
                                        }
                                    } else return results;
                                else if (
                                    newContext &&
                                    (elem = newContext.getElementById(m)) &&
                                    find.contains(context, elem) &&
                                    elem.id === m
                                ) {
                                    push.call(results, elem);
                                    return results;
                                }
                            } else if (match[2]) {
                                push.apply(results, context.getElementsByTagName(selector));
                                return results;
                            } else if ((m = match[3]) && context.getElementsByClassName) {
                                push.apply(results, context.getElementsByClassName(m));
                                return results;
                            }
                        }
                        if (
                            !nonnativeSelectorCache[selector + ' '] &&
                            (!rbuggyQSA || !rbuggyQSA.test(selector))
                        ) {
                            newSelector = selector;
                            newContext = context;
                            if (
                                nodeType === 1 &&
                                (rdescend.test(selector) || rleadingCombinator.test(selector))
                            ) {
                                newContext =
                                    (rsibling.test(selector) && testContext(context.parentNode)) ||
                                    context;
                                if (newContext != context || !support.scope)
                                    if ((nid = context.getAttribute('id')))
                                        nid = jQuery.escapeSelector(nid);
                                    else context.setAttribute('id', (nid = expando));
                                groups = tokenize(selector);
                                i = groups.length;
                                while (i--)
                                    groups[i] =
                                        (nid ? '#' + nid : ':scope') + ' ' + toSelector(groups[i]);
                                newSelector = groups.join(',');
                            }
                            try {
                                push.apply(results, newContext.querySelectorAll(newSelector));
                                return results;
                            } catch (qsaError) {
                                nonnativeSelectorCache(selector, true);
                            } finally {
                                if (nid === expando) context.removeAttribute('id');
                            }
                        }
                    }
                }
                return select(selector.replace(rtrimCSS, '$1'), context, results, seed);
            }
            /**
             * Create key-value caches of limited size
             * @returns {function(string, object)} Returns the Object data after storing it on itself with
             *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
             *	deleting the oldest entry
             */
            function createCache() {
                var keys = [];
                function cache(key, value) {
                    if (keys.push(key + ' ') > Expr.cacheLength) delete cache[keys.shift()];
                    return (cache[key + ' '] = value);
                }
                return cache;
            }
            /**
             * Mark a function for special use by jQuery selector module
             * @param {Function} fn The function to mark
             */
            function markFunction(fn) {
                fn[expando] = true;
                return fn;
            }
            /**
             * Support testing using an element
             * @param {Function} fn Passed the created element and returns a boolean result
             */
            function assert(fn) {
                var el = document.createElement('fieldset');
                try {
                    return !!fn(el);
                } catch (e) {
                    return false;
                } finally {
                    if (el.parentNode) el.parentNode.removeChild(el);
                    el = null;
                }
            }
            /**
             * Returns a function to use in pseudos for input types
             * @param {String} type
             */
            function createInputPseudo(type) {
                return function (elem) {
                    return nodeName(elem, 'input') && elem.type === type;
                };
            }
            /**
             * Returns a function to use in pseudos for buttons
             * @param {String} type
             */
            function createButtonPseudo(type) {
                return function (elem) {
                    return (
                        (nodeName(elem, 'input') || nodeName(elem, 'button')) && elem.type === type
                    );
                };
            }
            /**
             * Returns a function to use in pseudos for :enabled/:disabled
             * @param {Boolean} disabled true for :disabled; false for :enabled
             */
            function createDisabledPseudo(disabled) {
                return function (elem) {
                    if ('form' in elem) {
                        if (elem.parentNode && elem.disabled === false) {
                            if ('label' in elem)
                                if ('label' in elem.parentNode)
                                    return elem.parentNode.disabled === disabled;
                                else return elem.disabled === disabled;
                            return (
                                elem.isDisabled === disabled ||
                                (elem.isDisabled !== !disabled &&
                                    inDisabledFieldset(elem) === disabled)
                            );
                        }
                        return elem.disabled === disabled;
                    } else if ('label' in elem) return elem.disabled === disabled;
                    return false;
                };
            }
            /**
             * Returns a function to use in pseudos for positionals
             * @param {Function} fn
             */
            function createPositionalPseudo(fn) {
                return markFunction(function (argument) {
                    argument = +argument;
                    return markFunction(function (seed, matches) {
                        var j,
                            matchIndexes = fn([], seed.length, argument),
                            i = matchIndexes.length;
                        while (i--)
                            if (seed[(j = matchIndexes[i])]) seed[j] = !(matches[j] = seed[j]);
                    });
                });
            }
            /**
             * Checks a node for validity as a jQuery selector context
             * @param {Element|Object=} context
             * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
             */
            function testContext(context) {
                return context && typeof context.getElementsByTagName !== 'undefined' && context;
            }
            /**
             * Sets document-related variables once based on the current document
             * @param {Element|Object} [node] An element or document object to use to set the document
             * @returns {Object} Returns the current document
             */
            function setDocument(node) {
                var subWindow,
                    doc = node ? node.ownerDocument || node : preferredDoc;
                if (doc == document || doc.nodeType !== 9 || !doc.documentElement) return document;
                document = doc;
                documentElement = document.documentElement;
                documentIsHTML = !jQuery.isXMLDoc(document);
                matches =
                    documentElement.matches ||
                    documentElement.webkitMatchesSelector ||
                    documentElement.msMatchesSelector;
                if (
                    documentElement.msMatchesSelector &&
                    preferredDoc != document &&
                    (subWindow = document.defaultView) &&
                    subWindow.top !== subWindow
                )
                    subWindow.addEventListener('unload', unloadHandler);
                support.getById = assert(function (el) {
                    documentElement.appendChild(el).id = jQuery.expando;
                    return (
                        !document.getElementsByName ||
                        !document.getElementsByName(jQuery.expando).length
                    );
                });
                support.disconnectedMatch = assert(function (el) {
                    return matches.call(el, '*');
                });
                support.scope = assert(function () {
                    return document.querySelectorAll(':scope');
                });
                support.cssHas = assert(function () {
                    try {
                        document.querySelector(':has(*,:jqfake)');
                        return false;
                    } catch (e) {
                        return true;
                    }
                });
                if (support.getById) {
                    Expr.filter.ID = function (id) {
                        var attrId = id.replace(runescape, funescape);
                        return function (elem) {
                            return elem.getAttribute('id') === attrId;
                        };
                    };
                    Expr.find.ID = function (id, context) {
                        if (typeof context.getElementById !== 'undefined' && documentIsHTML) {
                            var elem = context.getElementById(id);
                            return elem ? [elem] : [];
                        }
                    };
                } else {
                    Expr.filter.ID = function (id) {
                        var attrId = id.replace(runescape, funescape);
                        return function (elem) {
                            var node =
                                typeof elem.getAttributeNode !== 'undefined' &&
                                elem.getAttributeNode('id');
                            return node && node.value === attrId;
                        };
                    };
                    Expr.find.ID = function (id, context) {
                        if (typeof context.getElementById !== 'undefined' && documentIsHTML) {
                            var node,
                                i,
                                elems,
                                elem = context.getElementById(id);
                            if (elem) {
                                node = elem.getAttributeNode('id');
                                if (node && node.value === id) return [elem];
                                elems = context.getElementsByName(id);
                                i = 0;
                                while ((elem = elems[i++])) {
                                    node = elem.getAttributeNode('id');
                                    if (node && node.value === id) return [elem];
                                }
                            }
                            return [];
                        }
                    };
                }
                Expr.find.TAG = function (tag, context) {
                    if (typeof context.getElementsByTagName !== 'undefined')
                        return context.getElementsByTagName(tag);
                    else return context.querySelectorAll(tag);
                };
                Expr.find.CLASS = function (className, context) {
                    if (typeof context.getElementsByClassName !== 'undefined' && documentIsHTML)
                        return context.getElementsByClassName(className);
                };
                rbuggyQSA = [];
                assert(function (el) {
                    var input;
                    documentElement.appendChild(el).innerHTML =
                        "<a id='" +
                        expando +
                        "' href='' disabled='disabled'></a><select id='" +
                        expando +
                        "-\r\\' disabled='disabled'><option selected=''></option></select>";
                    if (!el.querySelectorAll('[selected]').length)
                        rbuggyQSA.push('\\[' + whitespace + '*(?:value|' + booleans + ')');
                    if (!el.querySelectorAll('[id~=' + expando + '-]').length) rbuggyQSA.push('~=');
                    if (!el.querySelectorAll('a#' + expando + '+*').length)
                        rbuggyQSA.push('.#.+[+~]');
                    if (!el.querySelectorAll(':checked').length) rbuggyQSA.push(':checked');
                    input = document.createElement('input');
                    input.setAttribute('type', 'hidden');
                    el.appendChild(input).setAttribute('name', 'D');
                    documentElement.appendChild(el).disabled = true;
                    if (el.querySelectorAll(':disabled').length !== 2)
                        rbuggyQSA.push(':enabled', ':disabled');
                    input = document.createElement('input');
                    input.setAttribute('name', '');
                    el.appendChild(input);
                    if (!el.querySelectorAll("[name='']").length)
                        rbuggyQSA.push(
                            '\\[' +
                                whitespace +
                                '*name' +
                                whitespace +
                                '*=' +
                                whitespace +
                                '*(?:\'\'|"")',
                        );
                });
                if (!support.cssHas) rbuggyQSA.push(':has');
                rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join('|'));
                sortOrder = function (a, b) {
                    if (a === b) {
                        hasDuplicate = true;
                        return 0;
                    }
                    var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                    if (compare) return compare;
                    compare =
                        (a.ownerDocument || a) == (b.ownerDocument || b)
                            ? a.compareDocumentPosition(b)
                            : 1;
                    if (
                        compare & 1 ||
                        (!support.sortDetached && b.compareDocumentPosition(a) === compare)
                    ) {
                        if (
                            a === document ||
                            (a.ownerDocument == preferredDoc && find.contains(preferredDoc, a))
                        )
                            return -1;
                        if (
                            b === document ||
                            (b.ownerDocument == preferredDoc && find.contains(preferredDoc, b))
                        )
                            return 1;
                        return sortInput
                            ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b)
                            : 0;
                    }
                    return compare & 4 ? -1 : 1;
                };
                return document;
            }
            find.matches = function (expr, elements) {
                return find(expr, null, null, elements);
            };
            find.matchesSelector = function (elem, expr) {
                setDocument(elem);
                if (
                    documentIsHTML &&
                    !nonnativeSelectorCache[expr + ' '] &&
                    (!rbuggyQSA || !rbuggyQSA.test(expr))
                )
                    try {
                        var ret = matches.call(elem, expr);
                        if (
                            ret ||
                            support.disconnectedMatch ||
                            (elem.document && elem.document.nodeType !== 11)
                        )
                            return ret;
                    } catch (e) {
                        nonnativeSelectorCache(expr, true);
                    }
                return find(expr, document, null, [elem]).length > 0;
            };
            find.contains = function (context, elem) {
                if ((context.ownerDocument || context) != document) setDocument(context);
                return jQuery.contains(context, elem);
            };
            find.attr = function (elem, name) {
                if ((elem.ownerDocument || elem) != document) setDocument(elem);
                var fn = Expr.attrHandle[name.toLowerCase()],
                    val =
                        fn && hasOwn.call(Expr.attrHandle, name.toLowerCase())
                            ? fn(elem, name, !documentIsHTML)
                            : void 0;
                if (val !== void 0) return val;
                return elem.getAttribute(name);
            };
            find.error = function (msg) {
                throw new Error('Syntax error, unrecognized expression: ' + msg);
            };
            /**
             * Document sorting and removing duplicates
             * @param {ArrayLike} results
             */
            jQuery.uniqueSort = function (results) {
                var elem,
                    duplicates = [],
                    j = 0,
                    i = 0;
                hasDuplicate = !support.sortStable;
                sortInput = !support.sortStable && slice.call(results, 0);
                sort.call(results, sortOrder);
                if (hasDuplicate) {
                    while ((elem = results[i++])) if (elem === results[i]) j = duplicates.push(i);
                    while (j--) splice.call(results, duplicates[j], 1);
                }
                sortInput = null;
                return results;
            };
            jQuery.fn.uniqueSort = function () {
                return this.pushStack(jQuery.uniqueSort(slice.apply(this)));
            };
            Expr = jQuery.expr = {
                cacheLength: 50,
                createPseudo: markFunction,
                match: matchExpr,
                attrHandle: {},
                find: {},
                relative: {
                    '>': {
                        dir: 'parentNode',
                        first: true,
                    },
                    ' ': {dir: 'parentNode'},
                    '+': {
                        dir: 'previousSibling',
                        first: true,
                    },
                    '~': {dir: 'previousSibling'},
                },
                preFilter: {
                    ATTR: function (match) {
                        match[1] = match[1].replace(runescape, funescape);
                        match[3] = (match[3] || match[4] || match[5] || '').replace(
                            runescape,
                            funescape,
                        );
                        if (match[2] === '~=') match[3] = ' ' + match[3] + ' ';
                        return match.slice(0, 4);
                    },
                    CHILD: function (match) {
                        match[1] = match[1].toLowerCase();
                        if (match[1].slice(0, 3) === 'nth') {
                            if (!match[3]) find.error(match[0]);
                            match[4] = +(match[4]
                                ? match[5] + (match[6] || 1)
                                : 2 * (match[3] === 'even' || match[3] === 'odd'));
                            match[5] = +(match[7] + match[8] || match[3] === 'odd');
                        } else if (match[3]) find.error(match[0]);
                        return match;
                    },
                    PSEUDO: function (match) {
                        var excess,
                            unquoted = !match[6] && match[2];
                        if (matchExpr.CHILD.test(match[0])) return null;
                        if (match[3]) match[2] = match[4] || match[5] || '';
                        else if (
                            unquoted &&
                            rpseudo.test(unquoted) &&
                            (excess = tokenize(unquoted, true)) &&
                            (excess =
                                unquoted.indexOf(')', unquoted.length - excess) - unquoted.length)
                        ) {
                            match[0] = match[0].slice(0, excess);
                            match[2] = unquoted.slice(0, excess);
                        }
                        return match.slice(0, 3);
                    },
                },
                filter: {
                    TAG: function (nodeNameSelector) {
                        var expectedNodeName = nodeNameSelector
                            .replace(runescape, funescape)
                            .toLowerCase();
                        return nodeNameSelector === '*'
                            ? function () {
                                  return true;
                              }
                            : function (elem) {
                                  return nodeName(elem, expectedNodeName);
                              };
                    },
                    CLASS: function (className) {
                        var pattern = classCache[className + ' '];
                        return (
                            pattern ||
                            ((pattern = new RegExp(
                                '(^|' + whitespace + ')' + className + '(' + whitespace + '|$)',
                            )) &&
                                classCache(className, function (elem) {
                                    return pattern.test(
                                        (typeof elem.className === 'string' && elem.className) ||
                                            (typeof elem.getAttribute !== 'undefined' &&
                                                elem.getAttribute('class')) ||
                                            '',
                                    );
                                }))
                        );
                    },
                    ATTR: function (name, operator, check) {
                        return function (elem) {
                            var result = find.attr(elem, name);
                            if (result == null) return operator === '!=';
                            if (!operator) return true;
                            result += '';
                            if (operator === '=') return result === check;
                            if (operator === '!=') return result !== check;
                            if (operator === '^=') return check && result.indexOf(check) === 0;
                            if (operator === '*=') return check && result.indexOf(check) > -1;
                            if (operator === '$=')
                                return check && result.slice(-check.length) === check;
                            if (operator === '~=')
                                return (
                                    (' ' + result.replace(rwhitespace, ' ') + ' ').indexOf(check) >
                                    -1
                                );
                            if (operator === '|=')
                                return (
                                    result === check ||
                                    result.slice(0, check.length + 1) === check + '-'
                                );
                            return false;
                        };
                    },
                    CHILD: function (type, what, _argument, first, last) {
                        var simple = type.slice(0, 3) !== 'nth',
                            forward = type.slice(-4) !== 'last',
                            ofType = what === 'of-type';
                        return first === 1 && last === 0
                            ? function (elem) {
                                  return !!elem.parentNode;
                              }
                            : function (elem, _context, xml) {
                                  var cache,
                                      outerCache,
                                      node,
                                      nodeIndex,
                                      start,
                                      dir = simple !== forward ? 'nextSibling' : 'previousSibling',
                                      parent = elem.parentNode,
                                      name = ofType && elem.nodeName.toLowerCase(),
                                      useCache = !xml && !ofType,
                                      diff = false;
                                  if (parent) {
                                      if (simple) {
                                          while (dir) {
                                              node = elem;
                                              while ((node = node[dir]))
                                                  if (
                                                      ofType
                                                          ? nodeName(node, name)
                                                          : node.nodeType === 1
                                                  )
                                                      return false;
                                              start = dir =
                                                  type === 'only' && !start && 'nextSibling';
                                          }
                                          return true;
                                      }
                                      start = [forward ? parent.firstChild : parent.lastChild];
                                      if (forward && useCache) {
                                          outerCache = parent[expando] || (parent[expando] = {});
                                          cache = outerCache[type] || [];
                                          nodeIndex = cache[0] === dirruns && cache[1];
                                          diff = nodeIndex && cache[2];
                                          node = nodeIndex && parent.childNodes[nodeIndex];
                                          while (
                                              (node =
                                                  (++nodeIndex && node && node[dir]) ||
                                                  (diff = nodeIndex = 0) ||
                                                  start.pop())
                                          )
                                              if (node.nodeType === 1 && ++diff && node === elem) {
                                                  outerCache[type] = [dirruns, nodeIndex, diff];
                                                  break;
                                              }
                                      } else {
                                          if (useCache) {
                                              outerCache = elem[expando] || (elem[expando] = {});
                                              cache = outerCache[type] || [];
                                              nodeIndex = cache[0] === dirruns && cache[1];
                                              diff = nodeIndex;
                                          }
                                          if (diff === false) {
                                              while (
                                                  (node =
                                                      (++nodeIndex && node && node[dir]) ||
                                                      (diff = nodeIndex = 0) ||
                                                      start.pop())
                                              )
                                                  if (
                                                      (ofType
                                                          ? nodeName(node, name)
                                                          : node.nodeType === 1) &&
                                                      ++diff
                                                  ) {
                                                      if (useCache) {
                                                          outerCache =
                                                              node[expando] || (node[expando] = {});
                                                          outerCache[type] = [dirruns, diff];
                                                      }
                                                      if (node === elem) break;
                                                  }
                                          }
                                      }
                                      diff -= last;
                                      return (
                                          diff === first ||
                                          (diff % first === 0 && diff / first >= 0)
                                      );
                                  }
                              };
                    },
                    PSEUDO: function (pseudo, argument) {
                        var args,
                            fn =
                                Expr.pseudos[pseudo] ||
                                Expr.setFilters[pseudo.toLowerCase()] ||
                                find.error('unsupported pseudo: ' + pseudo);
                        if (fn[expando]) return fn(argument);
                        if (fn.length > 1) {
                            args = [pseudo, pseudo, '', argument];
                            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())
                                ? markFunction(function (seed, matches) {
                                      var idx,
                                          matched = fn(seed, argument),
                                          i = matched.length;
                                      while (i--) {
                                          idx = indexOf.call(seed, matched[i]);
                                          seed[idx] = !(matches[idx] = matched[i]);
                                      }
                                  })
                                : function (elem) {
                                      return fn(elem, 0, args);
                                  };
                        }
                        return fn;
                    },
                },
                pseudos: {
                    not: markFunction(function (selector) {
                        var input = [],
                            results = [],
                            matcher = compile(selector.replace(rtrimCSS, '$1'));
                        return matcher[expando]
                            ? markFunction(function (seed, matches, _context, xml) {
                                  var elem,
                                      unmatched = matcher(seed, null, xml, []),
                                      i = seed.length;
                                  while (i--)
                                      if ((elem = unmatched[i])) seed[i] = !(matches[i] = elem);
                              })
                            : function (elem, _context, xml) {
                                  input[0] = elem;
                                  matcher(input, null, xml, results);
                                  input[0] = null;
                                  return !results.pop();
                              };
                    }),
                    has: markFunction(function (selector) {
                        return function (elem) {
                            return find(selector, elem).length > 0;
                        };
                    }),
                    contains: markFunction(function (text) {
                        text = text.replace(runescape, funescape);
                        return function (elem) {
                            return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
                        };
                    }),
                    lang: markFunction(function (lang) {
                        if (!ridentifier.test(lang || '')) find.error('unsupported lang: ' + lang);
                        lang = lang.replace(runescape, funescape).toLowerCase();
                        return function (elem) {
                            var elemLang;
                            do
                                if (
                                    (elemLang = documentIsHTML
                                        ? elem.lang
                                        : elem.getAttribute('xml:lang') ||
                                          elem.getAttribute('lang'))
                                ) {
                                    elemLang = elemLang.toLowerCase();
                                    return elemLang === lang || elemLang.indexOf(lang + '-') === 0;
                                }
                            while ((elem = elem.parentNode) && elem.nodeType === 1);
                            return false;
                        };
                    }),
                    target: function (elem) {
                        var hash = window.location && window.location.hash;
                        return hash && hash.slice(1) === elem.id;
                    },
                    root: function (elem) {
                        return elem === documentElement;
                    },
                    focus: function (elem) {
                        return (
                            elem === safeActiveElement() &&
                            document.hasFocus() &&
                            !!(elem.type || elem.href || ~elem.tabIndex)
                        );
                    },
                    enabled: createDisabledPseudo(false),
                    disabled: createDisabledPseudo(true),
                    checked: function (elem) {
                        return (
                            (nodeName(elem, 'input') && !!elem.checked) ||
                            (nodeName(elem, 'option') && !!elem.selected)
                        );
                    },
                    selected: function (elem) {
                        if (elem.parentNode) elem.parentNode.selectedIndex;
                        return elem.selected === true;
                    },
                    empty: function (elem) {
                        for (elem = elem.firstChild; elem; elem = elem.nextSibling)
                            if (elem.nodeType < 6) return false;
                        return true;
                    },
                    parent: function (elem) {
                        return !Expr.pseudos.empty(elem);
                    },
                    header: function (elem) {
                        return rheader.test(elem.nodeName);
                    },
                    input: function (elem) {
                        return rinputs.test(elem.nodeName);
                    },
                    button: function (elem) {
                        return (
                            (nodeName(elem, 'input') && elem.type === 'button') ||
                            nodeName(elem, 'button')
                        );
                    },
                    text: function (elem) {
                        var attr;
                        return (
                            nodeName(elem, 'input') &&
                            elem.type === 'text' &&
                            ((attr = elem.getAttribute('type')) == null ||
                                attr.toLowerCase() === 'text')
                        );
                    },
                    first: createPositionalPseudo(function () {
                        return [0];
                    }),
                    last: createPositionalPseudo(function (_matchIndexes, length) {
                        return [length - 1];
                    }),
                    eq: createPositionalPseudo(function (_matchIndexes, length, argument) {
                        return [argument < 0 ? argument + length : argument];
                    }),
                    even: createPositionalPseudo(function (matchIndexes, length) {
                        var i = 0;
                        for (; i < length; i += 2) matchIndexes.push(i);
                        return matchIndexes;
                    }),
                    odd: createPositionalPseudo(function (matchIndexes, length) {
                        var i = 1;
                        for (; i < length; i += 2) matchIndexes.push(i);
                        return matchIndexes;
                    }),
                    lt: createPositionalPseudo(function (matchIndexes, length, argument) {
                        var i;
                        if (argument < 0) i = argument + length;
                        else if (argument > length) i = length;
                        else i = argument;
                        for (; --i >= 0; ) matchIndexes.push(i);
                        return matchIndexes;
                    }),
                    gt: createPositionalPseudo(function (matchIndexes, length, argument) {
                        var i = argument < 0 ? argument + length : argument;
                        for (; ++i < length; ) matchIndexes.push(i);
                        return matchIndexes;
                    }),
                },
            };
            Expr.pseudos.nth = Expr.pseudos.eq;
            for (i in {
                radio: true,
                checkbox: true,
                file: true,
                password: true,
                image: true,
            })
                Expr.pseudos[i] = createInputPseudo(i);
            for (i in {
                submit: true,
                reset: true,
            })
                Expr.pseudos[i] = createButtonPseudo(i);
            function setFilters() {}
            setFilters.prototype = Expr.filters = Expr.pseudos;
            Expr.setFilters = new setFilters();
            function tokenize(selector, parseOnly) {
                var matched,
                    match,
                    tokens,
                    type,
                    soFar,
                    groups,
                    preFilters,
                    cached = tokenCache[selector + ' '];
                if (cached) return parseOnly ? 0 : cached.slice(0);
                soFar = selector;
                groups = [];
                preFilters = Expr.preFilter;
                while (soFar) {
                    if (!matched || (match = rcomma.exec(soFar))) {
                        if (match) soFar = soFar.slice(match[0].length) || soFar;
                        groups.push((tokens = []));
                    }
                    matched = false;
                    if ((match = rleadingCombinator.exec(soFar))) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            type: match[0].replace(rtrimCSS, ' '),
                        });
                        soFar = soFar.slice(matched.length);
                    }
                    for (type in Expr.filter)
                        if (
                            (match = matchExpr[type].exec(soFar)) &&
                            (!preFilters[type] || (match = preFilters[type](match)))
                        ) {
                            matched = match.shift();
                            tokens.push({
                                value: matched,
                                type,
                                matches: match,
                            });
                            soFar = soFar.slice(matched.length);
                        }
                    if (!matched) break;
                }
                if (parseOnly) return soFar.length;
                return soFar ? find.error(selector) : tokenCache(selector, groups).slice(0);
            }
            function toSelector(tokens) {
                var i = 0,
                    len = tokens.length,
                    selector = '';
                for (; i < len; i++) selector += tokens[i].value;
                return selector;
            }
            function addCombinator(matcher, combinator, base) {
                var dir = combinator.dir,
                    skip = combinator.next,
                    key = skip || dir,
                    checkNonElements = base && key === 'parentNode',
                    doneName = done++;
                return combinator.first
                    ? function (elem, context, xml) {
                          while ((elem = elem[dir]))
                              if (elem.nodeType === 1 || checkNonElements)
                                  return matcher(elem, context, xml);
                          return false;
                      }
                    : function (elem, context, xml) {
                          var oldCache,
                              outerCache,
                              newCache = [dirruns, doneName];
                          if (xml) {
                              while ((elem = elem[dir]))
                                  if (elem.nodeType === 1 || checkNonElements) {
                                      if (matcher(elem, context, xml)) return true;
                                  }
                          } else
                              while ((elem = elem[dir]))
                                  if (elem.nodeType === 1 || checkNonElements) {
                                      outerCache = elem[expando] || (elem[expando] = {});
                                      if (skip && nodeName(elem, skip)) elem = elem[dir] || elem;
                                      else if (
                                          (oldCache = outerCache[key]) &&
                                          oldCache[0] === dirruns &&
                                          oldCache[1] === doneName
                                      )
                                          return (newCache[2] = oldCache[2]);
                                      else {
                                          outerCache[key] = newCache;
                                          if ((newCache[2] = matcher(elem, context, xml)))
                                              return true;
                                      }
                                  }
                          return false;
                      };
            }
            function elementMatcher(matchers) {
                return matchers.length > 1
                    ? function (elem, context, xml) {
                          var i = matchers.length;
                          while (i--) if (!matchers[i](elem, context, xml)) return false;
                          return true;
                      }
                    : matchers[0];
            }
            function multipleContexts(selector, contexts, results) {
                var i = 0,
                    len = contexts.length;
                for (; i < len; i++) find(selector, contexts[i], results);
                return results;
            }
            function condense(unmatched, map, filter, context, xml) {
                var elem,
                    newUnmatched = [],
                    i = 0,
                    len = unmatched.length,
                    mapped = map != null;
                for (; i < len; i++)
                    if ((elem = unmatched[i])) {
                        if (!filter || filter(elem, context, xml)) {
                            newUnmatched.push(elem);
                            if (mapped) map.push(i);
                        }
                    }
                return newUnmatched;
            }
            function setMatcher(
                preFilter,
                selector,
                matcher,
                postFilter,
                postFinder,
                postSelector,
            ) {
                if (postFilter && !postFilter[expando]) postFilter = setMatcher(postFilter);
                if (postFinder && !postFinder[expando])
                    postFinder = setMatcher(postFinder, postSelector);
                return markFunction(function (seed, results, context, xml) {
                    var temp,
                        i,
                        elem,
                        matcherOut,
                        preMap = [],
                        postMap = [],
                        preexisting = results.length,
                        elems =
                            seed ||
                            multipleContexts(
                                selector || '*',
                                context.nodeType ? [context] : context,
                                [],
                            ),
                        matcherIn =
                            preFilter && (seed || !selector)
                                ? condense(elems, preMap, preFilter, context, xml)
                                : elems;
                    if (matcher) {
                        matcherOut =
                            postFinder || (seed ? preFilter : preexisting || postFilter)
                                ? []
                                : results;
                        matcher(matcherIn, matcherOut, context, xml);
                    } else matcherOut = matcherIn;
                    if (postFilter) {
                        temp = condense(matcherOut, postMap);
                        postFilter(temp, [], context, xml);
                        i = temp.length;
                        while (i--)
                            if ((elem = temp[i]))
                                matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                    }
                    if (seed) {
                        if (postFinder || preFilter) {
                            if (postFinder) {
                                temp = [];
                                i = matcherOut.length;
                                while (i--)
                                    if ((elem = matcherOut[i])) temp.push((matcherIn[i] = elem));
                                postFinder(null, (matcherOut = []), temp, xml);
                            }
                            i = matcherOut.length;
                            while (i--)
                                if (
                                    (elem = matcherOut[i]) &&
                                    (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1
                                )
                                    seed[temp] = !(results[temp] = elem);
                        }
                    } else {
                        matcherOut = condense(
                            matcherOut === results
                                ? matcherOut.splice(preexisting, matcherOut.length)
                                : matcherOut,
                        );
                        if (postFinder) postFinder(null, results, matcherOut, xml);
                        else push.apply(results, matcherOut);
                    }
                });
            }
            function matcherFromTokens(tokens) {
                var checkContext,
                    matcher,
                    j,
                    len = tokens.length,
                    leadingRelative = Expr.relative[tokens[0].type],
                    implicitRelative = leadingRelative || Expr.relative[' '],
                    i = leadingRelative ? 1 : 0,
                    matchContext = addCombinator(
                        function (elem) {
                            return elem === checkContext;
                        },
                        implicitRelative,
                        true,
                    ),
                    matchAnyContext = addCombinator(
                        function (elem) {
                            return indexOf.call(checkContext, elem) > -1;
                        },
                        implicitRelative,
                        true,
                    ),
                    matchers = [
                        function (elem, context, xml) {
                            var ret =
                                (!leadingRelative && (xml || context != outermostContext)) ||
                                ((checkContext = context).nodeType
                                    ? matchContext(elem, context, xml)
                                    : matchAnyContext(elem, context, xml));
                            checkContext = null;
                            return ret;
                        },
                    ];
                for (; i < len; i++)
                    if ((matcher = Expr.relative[tokens[i].type]))
                        matchers = [addCombinator(elementMatcher(matchers), matcher)];
                    else {
                        matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
                        if (matcher[expando]) {
                            j = ++i;
                            for (; j < len; j++) if (Expr.relative[tokens[j].type]) break;
                            return setMatcher(
                                i > 1 && elementMatcher(matchers),
                                i > 1 &&
                                    toSelector(
                                        tokens
                                            .slice(0, i - 1)
                                            .concat({value: tokens[i - 2].type === ' ' ? '*' : ''}),
                                    ).replace(rtrimCSS, '$1'),
                                matcher,
                                i < j && matcherFromTokens(tokens.slice(i, j)),
                                j < len && matcherFromTokens((tokens = tokens.slice(j))),
                                j < len && toSelector(tokens),
                            );
                        }
                        matchers.push(matcher);
                    }
                return elementMatcher(matchers);
            }
            function matcherFromGroupMatchers(elementMatchers, setMatchers) {
                var bySet = setMatchers.length > 0,
                    byElement = elementMatchers.length > 0,
                    superMatcher = function (seed, context, xml, results, outermost) {
                        var elem,
                            j,
                            matcher,
                            matchedCount = 0,
                            i = '0',
                            unmatched = seed && [],
                            setMatched = [],
                            contextBackup = outermostContext,
                            elems = seed || (byElement && Expr.find.TAG('*', outermost)),
                            dirrunsUnique = (dirruns +=
                                contextBackup == null ? 1 : Math.random() || 0.1),
                            len = elems.length;
                        if (outermost)
                            outermostContext = context == document || context || outermost;
                        for (; i !== len && (elem = elems[i]) != null; i++) {
                            if (byElement && elem) {
                                j = 0;
                                if (!context && elem.ownerDocument != document) {
                                    setDocument(elem);
                                    xml = !documentIsHTML;
                                }
                                while ((matcher = elementMatchers[j++]))
                                    if (matcher(elem, context || document, xml)) {
                                        push.call(results, elem);
                                        break;
                                    }
                                if (outermost) dirruns = dirrunsUnique;
                            }
                            if (bySet) {
                                if ((elem = !matcher && elem)) matchedCount--;
                                if (seed) unmatched.push(elem);
                            }
                        }
                        matchedCount += i;
                        if (bySet && i !== matchedCount) {
                            j = 0;
                            while ((matcher = setMatchers[j++]))
                                matcher(unmatched, setMatched, context, xml);
                            if (seed) {
                                if (matchedCount > 0) {
                                    while (i--)
                                        if (!(unmatched[i] || setMatched[i]))
                                            setMatched[i] = pop.call(results);
                                }
                                setMatched = condense(setMatched);
                            }
                            push.apply(results, setMatched);
                            if (
                                outermost &&
                                !seed &&
                                setMatched.length > 0 &&
                                matchedCount + setMatchers.length > 1
                            )
                                jQuery.uniqueSort(results);
                        }
                        if (outermost) {
                            dirruns = dirrunsUnique;
                            outermostContext = contextBackup;
                        }
                        return unmatched;
                    };
                return bySet ? markFunction(superMatcher) : superMatcher;
            }
            function compile(selector, match) {
                var i,
                    setMatchers = [],
                    elementMatchers = [],
                    cached = compilerCache[selector + ' '];
                if (!cached) {
                    if (!match) match = tokenize(selector);
                    i = match.length;
                    while (i--) {
                        cached = matcherFromTokens(match[i]);
                        if (cached[expando]) setMatchers.push(cached);
                        else elementMatchers.push(cached);
                    }
                    cached = compilerCache(
                        selector,
                        matcherFromGroupMatchers(elementMatchers, setMatchers),
                    );
                    cached.selector = selector;
                }
                return cached;
            }
            /**
             * A low-level selection function that works with jQuery's compiled
             *  selector functions
             * @param {String|Function} selector A selector or a pre-compiled
             *  selector function built with jQuery selector compile
             * @param {Element} context
             * @param {Array} [results]
             * @param {Array} [seed] A set of elements to match against
             */
            function select(selector, context, results, seed) {
                var i,
                    tokens,
                    token,
                    type,
                    find,
                    compiled = typeof selector === 'function' && selector,
                    match = !seed && tokenize((selector = compiled.selector || selector));
                results = results || [];
                if (match.length === 1) {
                    tokens = match[0] = match[0].slice(0);
                    if (
                        tokens.length > 2 &&
                        (token = tokens[0]).type === 'ID' &&
                        context.nodeType === 9 &&
                        documentIsHTML &&
                        Expr.relative[tokens[1].type]
                    ) {
                        context = (Expr.find.ID(
                            token.matches[0].replace(runescape, funescape),
                            context,
                        ) || [])[0];
                        if (!context) return results;
                        else if (compiled) context = context.parentNode;
                        selector = selector.slice(tokens.shift().value.length);
                    }
                    i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
                    while (i--) {
                        token = tokens[i];
                        if (Expr.relative[(type = token.type)]) break;
                        if ((find = Expr.find[type])) {
                            if (
                                (seed = find(
                                    token.matches[0].replace(runescape, funescape),
                                    (rsibling.test(tokens[0].type) &&
                                        testContext(context.parentNode)) ||
                                        context,
                                ))
                            ) {
                                tokens.splice(i, 1);
                                selector = seed.length && toSelector(tokens);
                                if (!selector) {
                                    push.apply(results, seed);
                                    return results;
                                }
                                break;
                            }
                        }
                    }
                }
                (compiled || compile(selector, match))(
                    seed,
                    context,
                    !documentIsHTML,
                    results,
                    !context ||
                        (rsibling.test(selector) && testContext(context.parentNode)) ||
                        context,
                );
                return results;
            }
            support.sortStable = expando.split('').sort(sortOrder).join('') === expando;
            setDocument();
            support.sortDetached = assert(function (el) {
                return el.compareDocumentPosition(document.createElement('fieldset')) & 1;
            });
            jQuery.find = find;
            jQuery.expr[':'] = jQuery.expr.pseudos;
            jQuery.unique = jQuery.uniqueSort;
            find.compile = compile;
            find.select = select;
            find.setDocument = setDocument;
            find.tokenize = tokenize;
            find.escape = jQuery.escapeSelector;
            find.getText = jQuery.text;
            find.isXML = jQuery.isXMLDoc;
            find.selectors = jQuery.expr;
            find.support = jQuery.support;
            find.uniqueSort = jQuery.uniqueSort;
        })();
        var dir = function (elem, dir, until) {
            var matched = [],
                truncate = until !== void 0;
            while ((elem = elem[dir]) && elem.nodeType !== 9)
                if (elem.nodeType === 1) {
                    if (truncate && jQuery(elem).is(until)) break;
                    matched.push(elem);
                }
            return matched;
        };
        var siblings = function (n, elem) {
            var matched = [];
            for (; n; n = n.nextSibling) if (n.nodeType === 1 && n !== elem) matched.push(n);
            return matched;
        };
        var rneedsContext = jQuery.expr.match.needsContext;
        var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        function winnow(elements, qualifier, not) {
            if (isFunction(qualifier))
                return jQuery.grep(elements, function (elem, i) {
                    return !!qualifier.call(elem, i, elem) !== not;
                });
            if (qualifier.nodeType)
                return jQuery.grep(elements, function (elem) {
                    return (elem === qualifier) !== not;
                });
            if (typeof qualifier !== 'string')
                return jQuery.grep(elements, function (elem) {
                    return indexOf.call(qualifier, elem) > -1 !== not;
                });
            return jQuery.filter(qualifier, elements, not);
        }
        jQuery.filter = function (expr, elems, not) {
            var elem = elems[0];
            if (not) expr = ':not(' + expr + ')';
            if (elems.length === 1 && elem.nodeType === 1)
                return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
            return jQuery.find.matches(
                expr,
                jQuery.grep(elems, function (elem) {
                    return elem.nodeType === 1;
                }),
            );
        };
        jQuery.fn.extend({
            find: function (selector) {
                var i,
                    ret,
                    len = this.length,
                    self = this;
                if (typeof selector !== 'string')
                    return this.pushStack(
                        jQuery(selector).filter(function () {
                            for (i = 0; i < len; i++)
                                if (jQuery.contains(self[i], this)) return true;
                        }),
                    );
                ret = this.pushStack([]);
                for (i = 0; i < len; i++) jQuery.find(selector, self[i], ret);
                return len > 1 ? jQuery.uniqueSort(ret) : ret;
            },
            filter: function (selector) {
                return this.pushStack(winnow(this, selector || [], false));
            },
            not: function (selector) {
                return this.pushStack(winnow(this, selector || [], true));
            },
            is: function (selector) {
                return !!winnow(
                    this,
                    typeof selector === 'string' && rneedsContext.test(selector)
                        ? jQuery(selector)
                        : selector || [],
                    false,
                ).length;
            },
        });
        var rootjQuery,
            rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
            init = (jQuery.fn.init = function (selector, context, root) {
                var match, elem;
                if (!selector) return this;
                root = root || rootjQuery;
                if (typeof selector === 'string') {
                    if (
                        selector[0] === '<' &&
                        selector[selector.length - 1] === '>' &&
                        selector.length >= 3
                    )
                        match = [null, selector, null];
                    else match = rquickExpr.exec(selector);
                    if (match && (match[1] || !context))
                        if (match[1]) {
                            context = context instanceof jQuery ? context[0] : context;
                            jQuery.merge(
                                this,
                                jQuery.parseHTML(
                                    match[1],
                                    context && context.nodeType
                                        ? context.ownerDocument || context
                                        : document,
                                    true,
                                ),
                            );
                            if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context))
                                for (match in context)
                                    if (isFunction(this[match])) this[match](context[match]);
                                    else this.attr(match, context[match]);
                            return this;
                        } else {
                            elem = document.getElementById(match[2]);
                            if (elem) {
                                this[0] = elem;
                                this.length = 1;
                            }
                            return this;
                        }
                    else if (!context || context.jquery) return (context || root).find(selector);
                    else return this.constructor(context).find(selector);
                } else if (selector.nodeType) {
                    this[0] = selector;
                    this.length = 1;
                    return this;
                } else if (isFunction(selector))
                    return root.ready !== void 0 ? root.ready(selector) : selector(jQuery);
                return jQuery.makeArray(selector, this);
            });
        init.prototype = jQuery.fn;
        rootjQuery = jQuery(document);
        var rparentsprev = /^(?:parents|prev(?:Until|All))/,
            guaranteedUnique = {
                children: true,
                contents: true,
                next: true,
                prev: true,
            };
        jQuery.fn.extend({
            has: function (target) {
                var targets = jQuery(target, this),
                    l = targets.length;
                return this.filter(function () {
                    var i = 0;
                    for (; i < l; i++) if (jQuery.contains(this, targets[i])) return true;
                });
            },
            closest: function (selectors, context) {
                var cur,
                    i = 0,
                    l = this.length,
                    matched = [],
                    targets = typeof selectors !== 'string' && jQuery(selectors);
                if (!rneedsContext.test(selectors)) {
                    for (; i < l; i++)
                        for (cur = this[i]; cur && cur !== context; cur = cur.parentNode)
                            if (
                                cur.nodeType < 11 &&
                                (targets
                                    ? targets.index(cur) > -1
                                    : cur.nodeType === 1 &&
                                      jQuery.find.matchesSelector(cur, selectors))
                            ) {
                                matched.push(cur);
                                break;
                            }
                }
                return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
            },
            index: function (elem) {
                if (!elem)
                    return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
                if (typeof elem === 'string') return indexOf.call(jQuery(elem), this[0]);
                return indexOf.call(this, elem.jquery ? elem[0] : elem);
            },
            add: function (selector, context) {
                return this.pushStack(
                    jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))),
                );
            },
            addBack: function (selector) {
                return this.add(
                    selector == null ? this.prevObject : this.prevObject.filter(selector),
                );
            },
        });
        function sibling(cur, dir) {
            while ((cur = cur[dir]) && cur.nodeType !== 1);
            return cur;
        }
        jQuery.each(
            {
                parent: function (elem) {
                    var parent = elem.parentNode;
                    return parent && parent.nodeType !== 11 ? parent : null;
                },
                parents: function (elem) {
                    return dir(elem, 'parentNode');
                },
                parentsUntil: function (elem, _i, until) {
                    return dir(elem, 'parentNode', until);
                },
                next: function (elem) {
                    return sibling(elem, 'nextSibling');
                },
                prev: function (elem) {
                    return sibling(elem, 'previousSibling');
                },
                nextAll: function (elem) {
                    return dir(elem, 'nextSibling');
                },
                prevAll: function (elem) {
                    return dir(elem, 'previousSibling');
                },
                nextUntil: function (elem, _i, until) {
                    return dir(elem, 'nextSibling', until);
                },
                prevUntil: function (elem, _i, until) {
                    return dir(elem, 'previousSibling', until);
                },
                siblings: function (elem) {
                    return siblings((elem.parentNode || {}).firstChild, elem);
                },
                children: function (elem) {
                    return siblings(elem.firstChild);
                },
                contents: function (elem) {
                    if (elem.contentDocument != null && getProto(elem.contentDocument))
                        return elem.contentDocument;
                    if (nodeName(elem, 'template')) elem = elem.content || elem;
                    return jQuery.merge([], elem.childNodes);
                },
            },
            function (name, fn) {
                jQuery.fn[name] = function (until, selector) {
                    var matched = jQuery.map(this, fn, until);
                    if (name.slice(-5) !== 'Until') selector = until;
                    if (selector && typeof selector === 'string')
                        matched = jQuery.filter(selector, matched);
                    if (this.length > 1) {
                        if (!guaranteedUnique[name]) jQuery.uniqueSort(matched);
                        if (rparentsprev.test(name)) matched.reverse();
                    }
                    return this.pushStack(matched);
                };
            },
        );
        var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
        function createOptions(options) {
            var object = {};
            jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
                object[flag] = true;
            });
            return object;
        }
        jQuery.Callbacks = function (options) {
            options =
                typeof options === 'string' ? createOptions(options) : jQuery.extend({}, options);
            var firing,
                memory,
                fired,
                locked,
                list = [],
                queue = [],
                firingIndex = -1,
                fire = function () {
                    locked = locked || options.once;
                    fired = firing = true;
                    for (; queue.length; firingIndex = -1) {
                        memory = queue.shift();
                        while (++firingIndex < list.length)
                            if (
                                list[firingIndex].apply(memory[0], memory[1]) === false &&
                                options.stopOnFalse
                            ) {
                                firingIndex = list.length;
                                memory = false;
                            }
                    }
                    if (!options.memory) memory = false;
                    firing = false;
                    if (locked)
                        if (memory) list = [];
                        else list = '';
                },
                self = {
                    add: function () {
                        if (list) {
                            if (memory && !firing) {
                                firingIndex = list.length - 1;
                                queue.push(memory);
                            }
                            (function add(args) {
                                jQuery.each(args, function (_, arg) {
                                    if (isFunction(arg)) {
                                        if (!options.unique || !self.has(arg)) list.push(arg);
                                    } else if (arg && arg.length && toType(arg) !== 'string')
                                        add(arg);
                                });
                            })(arguments);
                            if (memory && !firing) fire();
                        }
                        return this;
                    },
                    remove: function () {
                        jQuery.each(arguments, function (_, arg) {
                            var index;
                            while ((index = jQuery.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1);
                                if (index <= firingIndex) firingIndex--;
                            }
                        });
                        return this;
                    },
                    has: function (fn) {
                        return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
                    },
                    empty: function () {
                        if (list) list = [];
                        return this;
                    },
                    disable: function () {
                        locked = queue = [];
                        list = memory = '';
                        return this;
                    },
                    disabled: function () {
                        return !list;
                    },
                    lock: function () {
                        locked = queue = [];
                        if (!memory && !firing) list = memory = '';
                        return this;
                    },
                    locked: function () {
                        return !!locked;
                    },
                    fireWith: function (context, args) {
                        if (!locked) {
                            args = args || [];
                            args = [context, args.slice ? args.slice() : args];
                            queue.push(args);
                            if (!firing) fire();
                        }
                        return this;
                    },
                    fire: function () {
                        self.fireWith(this, arguments);
                        return this;
                    },
                    fired: function () {
                        return !!fired;
                    },
                };
            return self;
        };
        function Identity(v) {
            return v;
        }
        function Thrower(ex) {
            throw ex;
        }
        function adoptValue(value, resolve, reject, noValue) {
            var method;
            try {
                if (value && isFunction((method = value.promise)))
                    method.call(value).done(resolve).fail(reject);
                else if (value && isFunction((method = value.then)))
                    method.call(value, resolve, reject);
                else resolve.apply(void 0, [value].slice(noValue));
            } catch (value) {
                reject.apply(void 0, [value]);
            }
        }
        jQuery.extend({
            Deferred: function (func) {
                var tuples = [
                        [
                            'notify',
                            'progress',
                            jQuery.Callbacks('memory'),
                            jQuery.Callbacks('memory'),
                            2,
                        ],
                        [
                            'resolve',
                            'done',
                            jQuery.Callbacks('once memory'),
                            jQuery.Callbacks('once memory'),
                            0,
                            'resolved',
                        ],
                        [
                            'reject',
                            'fail',
                            jQuery.Callbacks('once memory'),
                            jQuery.Callbacks('once memory'),
                            1,
                            'rejected',
                        ],
                    ],
                    state = 'pending',
                    promise = {
                        state: function () {
                            return state;
                        },
                        always: function () {
                            deferred.done(arguments).fail(arguments);
                            return this;
                        },
                        catch: function (fn) {
                            return promise.then(null, fn);
                        },
                        pipe: function () {
                            var fns = arguments;
                            return jQuery
                                .Deferred(function (newDefer) {
                                    jQuery.each(tuples, function (_i, tuple) {
                                        var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                                        deferred[tuple[1]](function () {
                                            var returned = fn && fn.apply(this, arguments);
                                            if (returned && isFunction(returned.promise))
                                                returned
                                                    .promise()
                                                    .progress(newDefer.notify)
                                                    .done(newDefer.resolve)
                                                    .fail(newDefer.reject);
                                            else
                                                newDefer[tuple[0] + 'With'](
                                                    this,
                                                    fn ? [returned] : arguments,
                                                );
                                        });
                                    });
                                    fns = null;
                                })
                                .promise();
                        },
                        then: function (onFulfilled, onRejected, onProgress) {
                            var maxDepth = 0;
                            function resolve(depth, deferred, handler, special) {
                                return function () {
                                    var that = this,
                                        args = arguments,
                                        mightThrow = function () {
                                            var returned, then;
                                            if (depth < maxDepth) return;
                                            returned = handler.apply(that, args);
                                            if (returned === deferred.promise())
                                                throw new TypeError('Thenable self-resolution');
                                            then =
                                                returned &&
                                                (typeof returned === 'object' ||
                                                    typeof returned === 'function') &&
                                                returned.then;
                                            if (isFunction(then))
                                                if (special)
                                                    then.call(
                                                        returned,
                                                        resolve(
                                                            maxDepth,
                                                            deferred,
                                                            Identity,
                                                            special,
                                                        ),
                                                        resolve(
                                                            maxDepth,
                                                            deferred,
                                                            Thrower,
                                                            special,
                                                        ),
                                                    );
                                                else {
                                                    maxDepth++;
                                                    then.call(
                                                        returned,
                                                        resolve(
                                                            maxDepth,
                                                            deferred,
                                                            Identity,
                                                            special,
                                                        ),
                                                        resolve(
                                                            maxDepth,
                                                            deferred,
                                                            Thrower,
                                                            special,
                                                        ),
                                                        resolve(
                                                            maxDepth,
                                                            deferred,
                                                            Identity,
                                                            deferred.notifyWith,
                                                        ),
                                                    );
                                                }
                                            else {
                                                if (handler !== Identity) {
                                                    that = void 0;
                                                    args = [returned];
                                                }
                                                (special || deferred.resolveWith)(that, args);
                                            }
                                        },
                                        process = special
                                            ? mightThrow
                                            : function () {
                                                  try {
                                                      mightThrow();
                                                  } catch (e) {
                                                      if (jQuery.Deferred.exceptionHook)
                                                          jQuery.Deferred.exceptionHook(
                                                              e,
                                                              process.error,
                                                          );
                                                      if (depth + 1 >= maxDepth) {
                                                          if (handler !== Thrower) {
                                                              that = void 0;
                                                              args = [e];
                                                          }
                                                          deferred.rejectWith(that, args);
                                                      }
                                                  }
                                              };
                                    if (depth) process();
                                    else {
                                        if (jQuery.Deferred.getErrorHook)
                                            process.error = jQuery.Deferred.getErrorHook();
                                        else if (jQuery.Deferred.getStackHook)
                                            process.error = jQuery.Deferred.getStackHook();
                                        window.setTimeout(process);
                                    }
                                };
                            }
                            return jQuery
                                .Deferred(function (newDefer) {
                                    tuples[0][3].add(
                                        resolve(
                                            0,
                                            newDefer,
                                            isFunction(onProgress) ? onProgress : Identity,
                                            newDefer.notifyWith,
                                        ),
                                    );
                                    tuples[1][3].add(
                                        resolve(
                                            0,
                                            newDefer,
                                            isFunction(onFulfilled) ? onFulfilled : Identity,
                                        ),
                                    );
                                    tuples[2][3].add(
                                        resolve(
                                            0,
                                            newDefer,
                                            isFunction(onRejected) ? onRejected : Thrower,
                                        ),
                                    );
                                })
                                .promise();
                        },
                        promise: function (obj) {
                            return obj != null ? jQuery.extend(obj, promise) : promise;
                        },
                    },
                    deferred = {};
                jQuery.each(tuples, function (i, tuple) {
                    var list = tuple[2],
                        stateString = tuple[5];
                    promise[tuple[1]] = list.add;
                    if (stateString)
                        list.add(
                            function () {
                                state = stateString;
                            },
                            tuples[3 - i][2].disable,
                            tuples[3 - i][3].disable,
                            tuples[0][2].lock,
                            tuples[0][3].lock,
                        );
                    list.add(tuple[3].fire);
                    deferred[tuple[0]] = function () {
                        deferred[tuple[0] + 'With'](this === deferred ? void 0 : this, arguments);
                        return this;
                    };
                    deferred[tuple[0] + 'With'] = list.fireWith;
                });
                promise.promise(deferred);
                if (func) func.call(deferred, deferred);
                return deferred;
            },
            when: function (singleValue) {
                var remaining = arguments.length,
                    i = remaining,
                    resolveContexts = Array(i),
                    resolveValues = slice.call(arguments),
                    primary = jQuery.Deferred(),
                    updateFunc = function (i) {
                        return function (value) {
                            resolveContexts[i] = this;
                            resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value;
                            if (!--remaining) primary.resolveWith(resolveContexts, resolveValues);
                        };
                    };
                if (remaining <= 1) {
                    adoptValue(
                        singleValue,
                        primary.done(updateFunc(i)).resolve,
                        primary.reject,
                        !remaining,
                    );
                    if (
                        primary.state() === 'pending' ||
                        isFunction(resolveValues[i] && resolveValues[i].then)
                    )
                        return primary.then();
                }
                while (i--) adoptValue(resolveValues[i], updateFunc(i), primary.reject);
                return primary.promise();
            },
        });
        var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        jQuery.Deferred.exceptionHook = function (error, asyncError) {
            if (window.console && window.console.warn && error && rerrorNames.test(error.name))
                window.console.warn(
                    'jQuery.Deferred exception: ' + error.message,
                    error.stack,
                    asyncError,
                );
        };
        jQuery.readyException = function (error) {
            window.setTimeout(function () {
                throw error;
            });
        };
        var readyList = jQuery.Deferred();
        jQuery.fn.ready = function (fn) {
            readyList.then(fn).catch(function (error) {
                jQuery.readyException(error);
            });
            return this;
        };
        jQuery.extend({
            isReady: false,
            readyWait: 1,
            ready: function (wait) {
                if (wait === true ? --jQuery.readyWait : jQuery.isReady) return;
                jQuery.isReady = true;
                if (wait !== true && --jQuery.readyWait > 0) return;
                readyList.resolveWith(document, [jQuery]);
            },
        });
        jQuery.ready.then = readyList.then;
        function completed() {
            document.removeEventListener('DOMContentLoaded', completed);
            window.removeEventListener('load', completed);
            jQuery.ready();
        }
        if (
            document.readyState === 'complete' ||
            (document.readyState !== 'loading' && !document.documentElement.doScroll)
        )
            window.setTimeout(jQuery.ready);
        else {
            document.addEventListener('DOMContentLoaded', completed);
            window.addEventListener('load', completed);
        }
        var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
            var i = 0,
                len = elems.length,
                bulk = key == null;
            if (toType(key) === 'object') {
                chainable = true;
                for (i in key) access(elems, fn, i, key[i], true, emptyGet, raw);
            } else if (value !== void 0) {
                chainable = true;
                if (!isFunction(value)) raw = true;
                if (bulk)
                    if (raw) {
                        fn.call(elems, value);
                        fn = null;
                    } else {
                        bulk = fn;
                        fn = function (elem, _key, value) {
                            return bulk.call(jQuery(elem), value);
                        };
                    }
                if (fn)
                    for (; i < len; i++)
                        fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
            }
            if (chainable) return elems;
            if (bulk) return fn.call(elems);
            return len ? fn(elems[0], key) : emptyGet;
        };
        var rmsPrefix = /^-ms-/,
            rdashAlpha = /-([a-z])/g;
        function fcamelCase(_all, letter) {
            return letter.toUpperCase();
        }
        function camelCase(string) {
            return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
        }
        var acceptData = function (owner) {
            return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
        };
        function Data() {
            this.expando = jQuery.expando + Data.uid++;
        }
        Data.uid = 1;
        Data.prototype = {
            cache: function (owner) {
                var value = owner[this.expando];
                if (!value) {
                    value = {};
                    if (acceptData(owner))
                        if (owner.nodeType) owner[this.expando] = value;
                        else
                            Object.defineProperty(owner, this.expando, {
                                value,
                                configurable: true,
                            });
                }
                return value;
            },
            set: function (owner, data, value) {
                var prop,
                    cache = this.cache(owner);
                if (typeof data === 'string') cache[camelCase(data)] = value;
                else for (prop in data) cache[camelCase(prop)] = data[prop];
                return cache;
            },
            get: function (owner, key) {
                return key === void 0
                    ? this.cache(owner)
                    : owner[this.expando] && owner[this.expando][camelCase(key)];
            },
            access: function (owner, key, value) {
                if (key === void 0 || (key && typeof key === 'string' && value === void 0))
                    return this.get(owner, key);
                this.set(owner, key, value);
                return value !== void 0 ? value : key;
            },
            remove: function (owner, key) {
                var i,
                    cache = owner[this.expando];
                if (cache === void 0) return;
                if (key !== void 0) {
                    if (Array.isArray(key)) key = key.map(camelCase);
                    else {
                        key = camelCase(key);
                        key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
                    }
                    i = key.length;
                    while (i--) delete cache[key[i]];
                }
                if (key === void 0 || jQuery.isEmptyObject(cache))
                    if (owner.nodeType) owner[this.expando] = void 0;
                    else delete owner[this.expando];
            },
            hasData: function (owner) {
                var cache = owner[this.expando];
                return cache !== void 0 && !jQuery.isEmptyObject(cache);
            },
        };
        var dataPriv = new Data();
        var dataUser = new Data();
        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            rmultiDash = /[A-Z]/g;
        function getData(data) {
            if (data === 'true') return true;
            if (data === 'false') return false;
            if (data === 'null') return null;
            if (data === +data + '') return +data;
            if (rbrace.test(data)) return JSON.parse(data);
            return data;
        }
        function dataAttr(elem, key, data) {
            var name;
            if (data === void 0 && elem.nodeType === 1) {
                name = 'data-' + key.replace(rmultiDash, '-$&').toLowerCase();
                data = elem.getAttribute(name);
                if (typeof data === 'string') {
                    try {
                        data = getData(data);
                    } catch (e) {}
                    dataUser.set(elem, key, data);
                } else data = void 0;
            }
            return data;
        }
        jQuery.extend({
            hasData: function (elem) {
                return dataUser.hasData(elem) || dataPriv.hasData(elem);
            },
            data: function (elem, name, data) {
                return dataUser.access(elem, name, data);
            },
            removeData: function (elem, name) {
                dataUser.remove(elem, name);
            },
            _data: function (elem, name, data) {
                return dataPriv.access(elem, name, data);
            },
            _removeData: function (elem, name) {
                dataPriv.remove(elem, name);
            },
        });
        jQuery.fn.extend({
            data: function (key, value) {
                var i,
                    name,
                    data,
                    elem = this[0],
                    attrs = elem && elem.attributes;
                if (key === void 0) {
                    if (this.length) {
                        data = dataUser.get(elem);
                        if (elem.nodeType === 1 && !dataPriv.get(elem, 'hasDataAttrs')) {
                            i = attrs.length;
                            while (i--)
                                if (attrs[i]) {
                                    name = attrs[i].name;
                                    if (name.indexOf('data-') === 0) {
                                        name = camelCase(name.slice(5));
                                        dataAttr(elem, name, data[name]);
                                    }
                                }
                            dataPriv.set(elem, 'hasDataAttrs', true);
                        }
                    }
                    return data;
                }
                if (typeof key === 'object')
                    return this.each(function () {
                        dataUser.set(this, key);
                    });
                return access(
                    this,
                    function (value) {
                        var data;
                        if (elem && value === void 0) {
                            data = dataUser.get(elem, key);
                            if (data !== void 0) return data;
                            data = dataAttr(elem, key);
                            if (data !== void 0) return data;
                            return;
                        }
                        this.each(function () {
                            dataUser.set(this, key, value);
                        });
                    },
                    null,
                    value,
                    arguments.length > 1,
                    null,
                    true,
                );
            },
            removeData: function (key) {
                return this.each(function () {
                    dataUser.remove(this, key);
                });
            },
        });
        jQuery.extend({
            queue: function (elem, type, data) {
                var queue;
                if (elem) {
                    type = (type || 'fx') + 'queue';
                    queue = dataPriv.get(elem, type);
                    if (data)
                        if (!queue || Array.isArray(data))
                            queue = dataPriv.access(elem, type, jQuery.makeArray(data));
                        else queue.push(data);
                    return queue || [];
                }
            },
            dequeue: function (elem, type) {
                type = type || 'fx';
                var queue = jQuery.queue(elem, type),
                    startLength = queue.length,
                    fn = queue.shift(),
                    hooks = jQuery._queueHooks(elem, type),
                    next = function () {
                        jQuery.dequeue(elem, type);
                    };
                if (fn === 'inprogress') {
                    fn = queue.shift();
                    startLength--;
                }
                if (fn) {
                    if (type === 'fx') queue.unshift('inprogress');
                    delete hooks.stop;
                    fn.call(elem, next, hooks);
                }
                if (!startLength && hooks) hooks.empty.fire();
            },
            _queueHooks: function (elem, type) {
                var key = type + 'queueHooks';
                return (
                    dataPriv.get(elem, key) ||
                    dataPriv.access(elem, key, {
                        empty: jQuery.Callbacks('once memory').add(function () {
                            dataPriv.remove(elem, [type + 'queue', key]);
                        }),
                    })
                );
            },
        });
        jQuery.fn.extend({
            queue: function (type, data) {
                var setter = 2;
                if (typeof type !== 'string') {
                    data = type;
                    type = 'fx';
                    setter--;
                }
                if (arguments.length < setter) return jQuery.queue(this[0], type);
                return data === void 0
                    ? this
                    : this.each(function () {
                          var queue = jQuery.queue(this, type, data);
                          jQuery._queueHooks(this, type);
                          if (type === 'fx' && queue[0] !== 'inprogress')
                              jQuery.dequeue(this, type);
                      });
            },
            dequeue: function (type) {
                return this.each(function () {
                    jQuery.dequeue(this, type);
                });
            },
            clearQueue: function (type) {
                return this.queue(type || 'fx', []);
            },
            promise: function (type, obj) {
                var tmp,
                    count = 1,
                    defer = jQuery.Deferred(),
                    elements = this,
                    i = this.length,
                    resolve = function () {
                        if (!--count) defer.resolveWith(elements, [elements]);
                    };
                if (typeof type !== 'string') {
                    obj = type;
                    type = void 0;
                }
                type = type || 'fx';
                while (i--) {
                    tmp = dataPriv.get(elements[i], type + 'queueHooks');
                    if (tmp && tmp.empty) {
                        count++;
                        tmp.empty.add(resolve);
                    }
                }
                resolve();
                return defer.promise(obj);
            },
        });
        var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
        var rcssNum = new RegExp('^(?:([+-])=|)(' + pnum + ')([a-z%]*)$', 'i');
        var cssExpand = ['Top', 'Right', 'Bottom', 'Left'];
        var documentElement = document.documentElement;
        var isAttached = function (elem) {
                return jQuery.contains(elem.ownerDocument, elem);
            },
            composed = {composed: true};
        if (documentElement.getRootNode)
            isAttached = function (elem) {
                return (
                    jQuery.contains(elem.ownerDocument, elem) ||
                    elem.getRootNode(composed) === elem.ownerDocument
                );
            };
        var isHiddenWithinTree = function (elem, el) {
            elem = el || elem;
            return (
                elem.style.display === 'none' ||
                (elem.style.display === '' &&
                    isAttached(elem) &&
                    jQuery.css(elem, 'display') === 'none')
            );
        };
        function adjustCSS(elem, prop, valueParts, tween) {
            var adjusted,
                scale,
                maxIterations = 20,
                currentValue = tween
                    ? function () {
                          return tween.cur();
                      }
                    : function () {
                          return jQuery.css(elem, prop, '');
                      },
                initial = currentValue(),
                unit = (valueParts && valueParts[3]) || (jQuery.cssNumber[prop] ? '' : 'px'),
                initialInUnit =
                    elem.nodeType &&
                    (jQuery.cssNumber[prop] || (unit !== 'px' && +initial)) &&
                    rcssNum.exec(jQuery.css(elem, prop));
            if (initialInUnit && initialInUnit[3] !== unit) {
                initial = initial / 2;
                unit = unit || initialInUnit[3];
                initialInUnit = +initial || 1;
                while (maxIterations--) {
                    jQuery.style(elem, prop, initialInUnit + unit);
                    if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0)
                        maxIterations = 0;
                    initialInUnit = initialInUnit / scale;
                }
                initialInUnit = initialInUnit * 2;
                jQuery.style(elem, prop, initialInUnit + unit);
                valueParts = valueParts || [];
            }
            if (valueParts) {
                initialInUnit = +initialInUnit || +initial || 0;
                adjusted = valueParts[1]
                    ? initialInUnit + (valueParts[1] + 1) * valueParts[2]
                    : +valueParts[2];
                if (tween) {
                    tween.unit = unit;
                    tween.start = initialInUnit;
                    tween.end = adjusted;
                }
            }
            return adjusted;
        }
        var defaultDisplayMap = {};
        function getDefaultDisplay(elem) {
            var temp,
                doc = elem.ownerDocument,
                nodeName = elem.nodeName,
                display = defaultDisplayMap[nodeName];
            if (display) return display;
            temp = doc.body.appendChild(doc.createElement(nodeName));
            display = jQuery.css(temp, 'display');
            temp.parentNode.removeChild(temp);
            if (display === 'none') display = 'block';
            defaultDisplayMap[nodeName] = display;
            return display;
        }
        function showHide(elements, show) {
            var display,
                elem,
                values = [],
                index = 0,
                length = elements.length;
            for (; index < length; index++) {
                elem = elements[index];
                if (!elem.style) continue;
                display = elem.style.display;
                if (show) {
                    if (display === 'none') {
                        values[index] = dataPriv.get(elem, 'display') || null;
                        if (!values[index]) elem.style.display = '';
                    }
                    if (elem.style.display === '' && isHiddenWithinTree(elem))
                        values[index] = getDefaultDisplay(elem);
                } else if (display !== 'none') {
                    values[index] = 'none';
                    dataPriv.set(elem, 'display', display);
                }
            }
            for (index = 0; index < length; index++)
                if (values[index] != null) elements[index].style.display = values[index];
            return elements;
        }
        jQuery.fn.extend({
            show: function () {
                return showHide(this, true);
            },
            hide: function () {
                return showHide(this);
            },
            toggle: function (state) {
                if (typeof state === 'boolean') return state ? this.show() : this.hide();
                return this.each(function () {
                    if (isHiddenWithinTree(this)) jQuery(this).show();
                    else jQuery(this).hide();
                });
            },
        });
        var rcheckableType = /^(?:checkbox|radio)$/i;
        var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
        var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
        (function () {
            var div = document.createDocumentFragment().appendChild(document.createElement('div')),
                input = document.createElement('input');
            input.setAttribute('type', 'radio');
            input.setAttribute('checked', 'checked');
            input.setAttribute('name', 't');
            div.appendChild(input);
            support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
            div.innerHTML = '<textarea>x</textarea>';
            support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
            div.innerHTML = '<option></option>';
            support.option = !!div.lastChild;
        })();
        var wrapMap = {
            thead: [1, '<table>', '</table>'],
            col: [2, '<table><colgroup>', '</colgroup></table>'],
            tr: [2, '<table><tbody>', '</tbody></table>'],
            td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            _default: [0, '', ''],
        };
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;
        if (!support.option)
            wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", '</select>'];
        function getAll(context, tag) {
            var ret;
            if (typeof context.getElementsByTagName !== 'undefined')
                ret = context.getElementsByTagName(tag || '*');
            else if (typeof context.querySelectorAll !== 'undefined')
                ret = context.querySelectorAll(tag || '*');
            else ret = [];
            if (tag === void 0 || (tag && nodeName(context, tag)))
                return jQuery.merge([context], ret);
            return ret;
        }
        function setGlobalEval(elems, refElements) {
            var i = 0,
                l = elems.length;
            for (; i < l; i++)
                dataPriv.set(
                    elems[i],
                    'globalEval',
                    !refElements || dataPriv.get(refElements[i], 'globalEval'),
                );
        }
        var rhtml = /<|&#?\w+;/;
        function buildFragment(elems, context, scripts, selection, ignored) {
            var elem,
                tmp,
                tag,
                wrap,
                attached,
                j,
                fragment = context.createDocumentFragment(),
                nodes = [],
                i = 0,
                l = elems.length;
            for (; i < l; i++) {
                elem = elems[i];
                if (elem || elem === 0)
                    if (toType(elem) === 'object')
                        jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
                    else if (!rhtml.test(elem)) nodes.push(context.createTextNode(elem));
                    else {
                        tmp = tmp || fragment.appendChild(context.createElement('div'));
                        tag = (rtagName.exec(elem) || ['', ''])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;
                        tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
                        j = wrap[0];
                        while (j--) tmp = tmp.lastChild;
                        jQuery.merge(nodes, tmp.childNodes);
                        tmp = fragment.firstChild;
                        tmp.textContent = '';
                    }
            }
            fragment.textContent = '';
            i = 0;
            while ((elem = nodes[i++])) {
                if (selection && jQuery.inArray(elem, selection) > -1) {
                    if (ignored) ignored.push(elem);
                    continue;
                }
                attached = isAttached(elem);
                tmp = getAll(fragment.appendChild(elem), 'script');
                if (attached) setGlobalEval(tmp);
                if (scripts) {
                    j = 0;
                    while ((elem = tmp[j++]))
                        if (rscriptType.test(elem.type || '')) scripts.push(elem);
                }
            }
            return fragment;
        }
        var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
        function returnTrue() {
            return true;
        }
        function returnFalse() {
            return false;
        }
        function on(elem, types, selector, data, fn, one) {
            var origFn, type;
            if (typeof types === 'object') {
                if (typeof selector !== 'string') {
                    data = data || selector;
                    selector = void 0;
                }
                for (type in types) on(elem, type, selector, data, types[type], one);
                return elem;
            }
            if (data == null && fn == null) {
                fn = selector;
                data = selector = void 0;
            } else if (fn == null)
                if (typeof selector === 'string') {
                    fn = data;
                    data = void 0;
                } else {
                    fn = data;
                    data = selector;
                    selector = void 0;
                }
            if (fn === false) fn = returnFalse;
            else if (!fn) return elem;
            if (one === 1) {
                origFn = fn;
                fn = function (event) {
                    jQuery().off(event);
                    return origFn.apply(this, arguments);
                };
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }
            return elem.each(function () {
                jQuery.event.add(this, types, fn, data, selector);
            });
        }
        jQuery.event = {
            global: {},
            add: function (elem, types, handler, data, selector) {
                var handleObjIn,
                    eventHandle,
                    tmp,
                    events,
                    t,
                    handleObj,
                    special,
                    handlers,
                    type,
                    namespaces,
                    origType,
                    elemData = dataPriv.get(elem);
                if (!acceptData(elem)) return;
                if (handler.handler) {
                    handleObjIn = handler;
                    handler = handleObjIn.handler;
                    selector = handleObjIn.selector;
                }
                if (selector) jQuery.find.matchesSelector(documentElement, selector);
                if (!handler.guid) handler.guid = jQuery.guid++;
                if (!(events = elemData.events)) events = elemData.events = Object.create(null);
                if (!(eventHandle = elemData.handle))
                    eventHandle = elemData.handle = function (e) {
                        return typeof jQuery !== 'undefined' && jQuery.event.triggered !== e.type
                            ? jQuery.event.dispatch.apply(elem, arguments)
                            : void 0;
                    };
                types = (types || '').match(rnothtmlwhite) || [''];
                t = types.length;
                while (t--) {
                    tmp = rtypenamespace.exec(types[t]) || [];
                    type = origType = tmp[1];
                    namespaces = (tmp[2] || '').split('.').sort();
                    if (!type) continue;
                    special = jQuery.event.special[type] || {};
                    type = (selector ? special.delegateType : special.bindType) || type;
                    special = jQuery.event.special[type] || {};
                    handleObj = jQuery.extend(
                        {
                            type,
                            origType,
                            data,
                            handler,
                            guid: handler.guid,
                            selector,
                            needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                            namespace: namespaces.join('.'),
                        },
                        handleObjIn,
                    );
                    if (!(handlers = events[type])) {
                        handlers = events[type] = [];
                        handlers.delegateCount = 0;
                        if (
                            !special.setup ||
                            special.setup.call(elem, data, namespaces, eventHandle) === false
                        ) {
                            if (elem.addEventListener) elem.addEventListener(type, eventHandle);
                        }
                    }
                    if (special.add) {
                        special.add.call(elem, handleObj);
                        if (!handleObj.handler.guid) handleObj.handler.guid = handler.guid;
                    }
                    if (selector) handlers.splice(handlers.delegateCount++, 0, handleObj);
                    else handlers.push(handleObj);
                    jQuery.event.global[type] = true;
                }
            },
            remove: function (elem, types, handler, selector, mappedTypes) {
                var j,
                    origCount,
                    tmp,
                    events,
                    t,
                    handleObj,
                    special,
                    handlers,
                    type,
                    namespaces,
                    origType,
                    elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
                if (!elemData || !(events = elemData.events)) return;
                types = (types || '').match(rnothtmlwhite) || [''];
                t = types.length;
                while (t--) {
                    tmp = rtypenamespace.exec(types[t]) || [];
                    type = origType = tmp[1];
                    namespaces = (tmp[2] || '').split('.').sort();
                    if (!type) {
                        for (type in events)
                            jQuery.event.remove(elem, type + types[t], handler, selector, true);
                        continue;
                    }
                    special = jQuery.event.special[type] || {};
                    type = (selector ? special.delegateType : special.bindType) || type;
                    handlers = events[type] || [];
                    tmp =
                        tmp[2] &&
                        new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)');
                    origCount = j = handlers.length;
                    while (j--) {
                        handleObj = handlers[j];
                        if (
                            (mappedTypes || origType === handleObj.origType) &&
                            (!handler || handler.guid === handleObj.guid) &&
                            (!tmp || tmp.test(handleObj.namespace)) &&
                            (!selector ||
                                selector === handleObj.selector ||
                                (selector === '**' && handleObj.selector))
                        ) {
                            handlers.splice(j, 1);
                            if (handleObj.selector) handlers.delegateCount--;
                            if (special.remove) special.remove.call(elem, handleObj);
                        }
                    }
                    if (origCount && !handlers.length) {
                        if (
                            !special.teardown ||
                            special.teardown.call(elem, namespaces, elemData.handle) === false
                        )
                            jQuery.removeEvent(elem, type, elemData.handle);
                        delete events[type];
                    }
                }
                if (jQuery.isEmptyObject(events)) dataPriv.remove(elem, 'handle events');
            },
            dispatch: function (nativeEvent) {
                var i,
                    j,
                    ret,
                    matched,
                    handleObj,
                    handlerQueue,
                    args = new Array(arguments.length),
                    event = jQuery.event.fix(nativeEvent),
                    handlers =
                        (dataPriv.get(this, 'events') || Object.create(null))[event.type] || [],
                    special = jQuery.event.special[event.type] || {};
                args[0] = event;
                for (i = 1; i < arguments.length; i++) args[i] = arguments[i];
                event.delegateTarget = this;
                if (special.preDispatch && special.preDispatch.call(this, event) === false) return;
                handlerQueue = jQuery.event.handlers.call(this, event, handlers);
                i = 0;
                while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                    event.currentTarget = matched.elem;
                    j = 0;
                    while (
                        (handleObj = matched.handlers[j++]) &&
                        !event.isImmediatePropagationStopped()
                    )
                        if (
                            !event.rnamespace ||
                            handleObj.namespace === false ||
                            event.rnamespace.test(handleObj.namespace)
                        ) {
                            event.handleObj = handleObj;
                            event.data = handleObj.data;
                            ret = (
                                (jQuery.event.special[handleObj.origType] || {}).handle ||
                                handleObj.handler
                            ).apply(matched.elem, args);
                            if (ret !== void 0) {
                                if ((event.result = ret) === false) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                            }
                        }
                }
                if (special.postDispatch) special.postDispatch.call(this, event);
                return event.result;
            },
            handlers: function (event, handlers) {
                var i,
                    handleObj,
                    sel,
                    matchedHandlers,
                    matchedSelectors,
                    handlerQueue = [],
                    delegateCount = handlers.delegateCount,
                    cur = event.target;
                if (
                    delegateCount &&
                    cur.nodeType &&
                    !(event.type === 'click' && event.button >= 1)
                ) {
                    for (; cur !== this; cur = cur.parentNode || this)
                        if (
                            cur.nodeType === 1 &&
                            !(event.type === 'click' && cur.disabled === true)
                        ) {
                            matchedHandlers = [];
                            matchedSelectors = {};
                            for (i = 0; i < delegateCount; i++) {
                                handleObj = handlers[i];
                                sel = handleObj.selector + ' ';
                                if (matchedSelectors[sel] === void 0)
                                    matchedSelectors[sel] = handleObj.needsContext
                                        ? jQuery(sel, this).index(cur) > -1
                                        : jQuery.find(sel, this, null, [cur]).length;
                                if (matchedSelectors[sel]) matchedHandlers.push(handleObj);
                            }
                            if (matchedHandlers.length)
                                handlerQueue.push({
                                    elem: cur,
                                    handlers: matchedHandlers,
                                });
                        }
                }
                cur = this;
                if (delegateCount < handlers.length)
                    handlerQueue.push({
                        elem: cur,
                        handlers: handlers.slice(delegateCount),
                    });
                return handlerQueue;
            },
            addProp: function (name, hook) {
                Object.defineProperty(jQuery.Event.prototype, name, {
                    enumerable: true,
                    configurable: true,
                    get: isFunction(hook)
                        ? function () {
                              if (this.originalEvent) return hook(this.originalEvent);
                          }
                        : function () {
                              if (this.originalEvent) return this.originalEvent[name];
                          },
                    set: function (value) {
                        Object.defineProperty(this, name, {
                            enumerable: true,
                            configurable: true,
                            writable: true,
                            value,
                        });
                    },
                });
            },
            fix: function (originalEvent) {
                return originalEvent[jQuery.expando]
                    ? originalEvent
                    : new jQuery.Event(originalEvent);
            },
            special: {
                load: {noBubble: true},
                click: {
                    setup: function (data) {
                        var el = this || data;
                        if (rcheckableType.test(el.type) && el.click && nodeName(el, 'input'))
                            leverageNative(el, 'click', true);
                        return false;
                    },
                    trigger: function (data) {
                        var el = this || data;
                        if (rcheckableType.test(el.type) && el.click && nodeName(el, 'input'))
                            leverageNative(el, 'click');
                        return true;
                    },
                    _default: function (event) {
                        var target = event.target;
                        return (
                            (rcheckableType.test(target.type) &&
                                target.click &&
                                nodeName(target, 'input') &&
                                dataPriv.get(target, 'click')) ||
                            nodeName(target, 'a')
                        );
                    },
                },
                beforeunload: {
                    postDispatch: function (event) {
                        if (event.result !== void 0 && event.originalEvent)
                            event.originalEvent.returnValue = event.result;
                    },
                },
            },
        };
        function leverageNative(el, type, isSetup) {
            if (!isSetup) {
                if (dataPriv.get(el, type) === void 0) jQuery.event.add(el, type, returnTrue);
                return;
            }
            dataPriv.set(el, type, false);
            jQuery.event.add(el, type, {
                namespace: false,
                handler: function (event) {
                    var result,
                        saved = dataPriv.get(this, type);
                    if (event.isTrigger & 1 && this[type]) {
                        if (!saved) {
                            saved = slice.call(arguments);
                            dataPriv.set(this, type, saved);
                            this[type]();
                            result = dataPriv.get(this, type);
                            dataPriv.set(this, type, false);
                            if (saved !== result) {
                                event.stopImmediatePropagation();
                                event.preventDefault();
                                return result;
                            }
                        } else if ((jQuery.event.special[type] || {}).delegateType)
                            event.stopPropagation();
                    } else if (saved) {
                        dataPriv.set(
                            this,
                            type,
                            jQuery.event.trigger(saved[0], saved.slice(1), this),
                        );
                        event.stopPropagation();
                        event.isImmediatePropagationStopped = returnTrue;
                    }
                },
            });
        }
        jQuery.removeEvent = function (elem, type, handle) {
            if (elem.removeEventListener) elem.removeEventListener(type, handle);
        };
        jQuery.Event = function (src, props) {
            if (!(this instanceof jQuery.Event)) return new jQuery.Event(src, props);
            if (src && src.type) {
                this.originalEvent = src;
                this.type = src.type;
                this.isDefaultPrevented =
                    src.defaultPrevented ||
                    (src.defaultPrevented === void 0 && src.returnValue === false)
                        ? returnTrue
                        : returnFalse;
                this.target =
                    src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
                this.currentTarget = src.currentTarget;
                this.relatedTarget = src.relatedTarget;
            } else this.type = src;
            if (props) jQuery.extend(this, props);
            this.timeStamp = (src && src.timeStamp) || Date.now();
            this[jQuery.expando] = true;
        };
        jQuery.Event.prototype = {
            constructor: jQuery.Event,
            isDefaultPrevented: returnFalse,
            isPropagationStopped: returnFalse,
            isImmediatePropagationStopped: returnFalse,
            isSimulated: false,
            preventDefault: function () {
                var e = this.originalEvent;
                this.isDefaultPrevented = returnTrue;
                if (e && !this.isSimulated) e.preventDefault();
            },
            stopPropagation: function () {
                var e = this.originalEvent;
                this.isPropagationStopped = returnTrue;
                if (e && !this.isSimulated) e.stopPropagation();
            },
            stopImmediatePropagation: function () {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = returnTrue;
                if (e && !this.isSimulated) e.stopImmediatePropagation();
                this.stopPropagation();
            },
        };
        jQuery.each(
            {
                altKey: true,
                bubbles: true,
                cancelable: true,
                changedTouches: true,
                ctrlKey: true,
                detail: true,
                eventPhase: true,
                metaKey: true,
                pageX: true,
                pageY: true,
                shiftKey: true,
                view: true,
                char: true,
                code: true,
                charCode: true,
                key: true,
                keyCode: true,
                button: true,
                buttons: true,
                clientX: true,
                clientY: true,
                offsetX: true,
                offsetY: true,
                pointerId: true,
                pointerType: true,
                screenX: true,
                screenY: true,
                targetTouches: true,
                toElement: true,
                touches: true,
                which: true,
            },
            jQuery.event.addProp,
        );
        jQuery.each(
            {
                focus: 'focusin',
                blur: 'focusout',
            },
            function (type, delegateType) {
                function focusMappedHandler(nativeEvent) {
                    if (document.documentMode) {
                        var handle = dataPriv.get(this, 'handle'),
                            event = jQuery.event.fix(nativeEvent);
                        event.type = nativeEvent.type === 'focusin' ? 'focus' : 'blur';
                        event.isSimulated = true;
                        handle(nativeEvent);
                        if (event.target === event.currentTarget) handle(event);
                    } else
                        jQuery.event.simulate(
                            delegateType,
                            nativeEvent.target,
                            jQuery.event.fix(nativeEvent),
                        );
                }
                jQuery.event.special[type] = {
                    setup: function () {
                        var attaches;
                        leverageNative(this, type, true);
                        if (document.documentMode) {
                            attaches = dataPriv.get(this, delegateType);
                            if (!attaches) this.addEventListener(delegateType, focusMappedHandler);
                            dataPriv.set(this, delegateType, (attaches || 0) + 1);
                        } else return false;
                    },
                    trigger: function () {
                        leverageNative(this, type);
                        return true;
                    },
                    teardown: function () {
                        var attaches;
                        if (document.documentMode) {
                            attaches = dataPriv.get(this, delegateType) - 1;
                            if (!attaches) {
                                this.removeEventListener(delegateType, focusMappedHandler);
                                dataPriv.remove(this, delegateType);
                            } else dataPriv.set(this, delegateType, attaches);
                        } else return false;
                    },
                    _default: function (event) {
                        return dataPriv.get(event.target, type);
                    },
                    delegateType,
                };
                jQuery.event.special[delegateType] = {
                    setup: function () {
                        var doc = this.ownerDocument || this.document || this,
                            dataHolder = document.documentMode ? this : doc,
                            attaches = dataPriv.get(dataHolder, delegateType);
                        if (!attaches)
                            if (document.documentMode)
                                this.addEventListener(delegateType, focusMappedHandler);
                            else doc.addEventListener(type, focusMappedHandler, true);
                        dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
                    },
                    teardown: function () {
                        var doc = this.ownerDocument || this.document || this,
                            dataHolder = document.documentMode ? this : doc,
                            attaches = dataPriv.get(dataHolder, delegateType) - 1;
                        if (!attaches) {
                            if (document.documentMode)
                                this.removeEventListener(delegateType, focusMappedHandler);
                            else doc.removeEventListener(type, focusMappedHandler, true);
                            dataPriv.remove(dataHolder, delegateType);
                        } else dataPriv.set(dataHolder, delegateType, attaches);
                    },
                };
            },
        );
        jQuery.each(
            {
                mouseenter: 'mouseover',
                mouseleave: 'mouseout',
                pointerenter: 'pointerover',
                pointerleave: 'pointerout',
            },
            function (orig, fix) {
                jQuery.event.special[orig] = {
                    delegateType: fix,
                    bindType: fix,
                    handle: function (event) {
                        var ret,
                            target = this,
                            related = event.relatedTarget,
                            handleObj = event.handleObj;
                        if (!related || (related !== target && !jQuery.contains(target, related))) {
                            event.type = handleObj.origType;
                            ret = handleObj.handler.apply(this, arguments);
                            event.type = fix;
                        }
                        return ret;
                    },
                };
            },
        );
        jQuery.fn.extend({
            on: function (types, selector, data, fn) {
                return on(this, types, selector, data, fn);
            },
            one: function (types, selector, data, fn) {
                return on(this, types, selector, data, fn, 1);
            },
            off: function (types, selector, fn) {
                var handleObj, type;
                if (types && types.preventDefault && types.handleObj) {
                    handleObj = types.handleObj;
                    jQuery(types.delegateTarget).off(
                        handleObj.namespace
                            ? handleObj.origType + '.' + handleObj.namespace
                            : handleObj.origType,
                        handleObj.selector,
                        handleObj.handler,
                    );
                    return this;
                }
                if (typeof types === 'object') {
                    for (type in types) this.off(type, selector, types[type]);
                    return this;
                }
                if (selector === false || typeof selector === 'function') {
                    fn = selector;
                    selector = void 0;
                }
                if (fn === false) fn = returnFalse;
                return this.each(function () {
                    jQuery.event.remove(this, types, fn, selector);
                });
            },
        });
        var rnoInnerhtml = /<script|<style|<link/i,
            rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
            rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
        function manipulationTarget(elem, content) {
            if (
                nodeName(elem, 'table') &&
                nodeName(content.nodeType !== 11 ? content : content.firstChild, 'tr')
            )
                return jQuery(elem).children('tbody')[0] || elem;
            return elem;
        }
        function disableScript(elem) {
            elem.type = (elem.getAttribute('type') !== null) + '/' + elem.type;
            return elem;
        }
        function restoreScript(elem) {
            if ((elem.type || '').slice(0, 5) === 'true/') elem.type = elem.type.slice(5);
            else elem.removeAttribute('type');
            return elem;
        }
        function cloneCopyEvent(src, dest) {
            var i, l, type, pdataOld, udataOld, udataCur, events;
            if (dest.nodeType !== 1) return;
            if (dataPriv.hasData(src)) {
                pdataOld = dataPriv.get(src);
                events = pdataOld.events;
                if (events) {
                    dataPriv.remove(dest, 'handle events');
                    for (type in events)
                        for (i = 0, l = events[type].length; i < l; i++)
                            jQuery.event.add(dest, type, events[type][i]);
                }
            }
            if (dataUser.hasData(src)) {
                udataOld = dataUser.access(src);
                udataCur = jQuery.extend({}, udataOld);
                dataUser.set(dest, udataCur);
            }
        }
        function fixInput(src, dest) {
            var nodeName = dest.nodeName.toLowerCase();
            if (nodeName === 'input' && rcheckableType.test(src.type)) dest.checked = src.checked;
            else if (nodeName === 'input' || nodeName === 'textarea')
                dest.defaultValue = src.defaultValue;
        }
        function domManip(collection, args, callback, ignored) {
            args = flat(args);
            var fragment,
                first,
                scripts,
                hasScripts,
                node,
                doc,
                i = 0,
                l = collection.length,
                iNoClone = l - 1,
                value = args[0],
                valueIsFunction = isFunction(value);
            if (
                valueIsFunction ||
                (l > 1 && typeof value === 'string' && !support.checkClone && rchecked.test(value))
            )
                return collection.each(function (index) {
                    var self = collection.eq(index);
                    if (valueIsFunction) args[0] = value.call(this, index, self.html());
                    domManip(self, args, callback, ignored);
                });
            if (l) {
                fragment = buildFragment(
                    args,
                    collection[0].ownerDocument,
                    false,
                    collection,
                    ignored,
                );
                first = fragment.firstChild;
                if (fragment.childNodes.length === 1) fragment = first;
                if (first || ignored) {
                    scripts = jQuery.map(getAll(fragment, 'script'), disableScript);
                    hasScripts = scripts.length;
                    for (; i < l; i++) {
                        node = fragment;
                        if (i !== iNoClone) {
                            node = jQuery.clone(node, true, true);
                            if (hasScripts) jQuery.merge(scripts, getAll(node, 'script'));
                        }
                        callback.call(collection[i], node, i);
                    }
                    if (hasScripts) {
                        doc = scripts[scripts.length - 1].ownerDocument;
                        jQuery.map(scripts, restoreScript);
                        for (i = 0; i < hasScripts; i++) {
                            node = scripts[i];
                            if (
                                rscriptType.test(node.type || '') &&
                                !dataPriv.access(node, 'globalEval') &&
                                jQuery.contains(doc, node)
                            )
                                if (node.src && (node.type || '').toLowerCase() !== 'module') {
                                    if (jQuery._evalUrl && !node.noModule)
                                        jQuery._evalUrl(
                                            node.src,
                                            {nonce: node.nonce || node.getAttribute('nonce')},
                                            doc,
                                        );
                                } else
                                    DOMEval(node.textContent.replace(rcleanScript, ''), node, doc);
                        }
                    }
                }
            }
            return collection;
        }
        function remove(elem, selector, keepData) {
            var node,
                nodes = selector ? jQuery.filter(selector, elem) : elem,
                i = 0;
            for (; (node = nodes[i]) != null; i++) {
                if (!keepData && node.nodeType === 1) jQuery.cleanData(getAll(node));
                if (node.parentNode) {
                    if (keepData && isAttached(node)) setGlobalEval(getAll(node, 'script'));
                    node.parentNode.removeChild(node);
                }
            }
            return elem;
        }
        jQuery.extend({
            htmlPrefilter: function (html) {
                return html;
            },
            clone: function (elem, dataAndEvents, deepDataAndEvents) {
                var i,
                    l,
                    srcElements,
                    destElements,
                    clone = elem.cloneNode(true),
                    inPage = isAttached(elem);
                if (
                    !support.noCloneChecked &&
                    (elem.nodeType === 1 || elem.nodeType === 11) &&
                    !jQuery.isXMLDoc(elem)
                ) {
                    destElements = getAll(clone);
                    srcElements = getAll(elem);
                    for (i = 0, l = srcElements.length; i < l; i++)
                        fixInput(srcElements[i], destElements[i]);
                }
                if (dataAndEvents)
                    if (deepDataAndEvents) {
                        srcElements = srcElements || getAll(elem);
                        destElements = destElements || getAll(clone);
                        for (i = 0, l = srcElements.length; i < l; i++)
                            cloneCopyEvent(srcElements[i], destElements[i]);
                    } else cloneCopyEvent(elem, clone);
                destElements = getAll(clone, 'script');
                if (destElements.length > 0)
                    setGlobalEval(destElements, !inPage && getAll(elem, 'script'));
                return clone;
            },
            cleanData: function (elems) {
                var data,
                    elem,
                    type,
                    special = jQuery.event.special,
                    i = 0;
                for (; (elem = elems[i]) !== void 0; i++)
                    if (acceptData(elem)) {
                        if ((data = elem[dataPriv.expando])) {
                            if (data.events)
                                for (type in data.events)
                                    if (special[type]) jQuery.event.remove(elem, type);
                                    else jQuery.removeEvent(elem, type, data.handle);
                            elem[dataPriv.expando] = void 0;
                        }
                        if (elem[dataUser.expando]) elem[dataUser.expando] = void 0;
                    }
            },
        });
        jQuery.fn.extend({
            detach: function (selector) {
                return remove(this, selector, true);
            },
            remove: function (selector) {
                return remove(this, selector);
            },
            text: function (value) {
                return access(
                    this,
                    function (value) {
                        return value === void 0
                            ? jQuery.text(this)
                            : this.empty().each(function () {
                                  if (
                                      this.nodeType === 1 ||
                                      this.nodeType === 11 ||
                                      this.nodeType === 9
                                  )
                                      this.textContent = value;
                              });
                    },
                    null,
                    value,
                    arguments.length,
                );
            },
            append: function () {
                return domManip(this, arguments, function (elem) {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9)
                        manipulationTarget(this, elem).appendChild(elem);
                });
            },
            prepend: function () {
                return domManip(this, arguments, function (elem) {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                        var target = manipulationTarget(this, elem);
                        target.insertBefore(elem, target.firstChild);
                    }
                });
            },
            before: function () {
                return domManip(this, arguments, function (elem) {
                    if (this.parentNode) this.parentNode.insertBefore(elem, this);
                });
            },
            after: function () {
                return domManip(this, arguments, function (elem) {
                    if (this.parentNode) this.parentNode.insertBefore(elem, this.nextSibling);
                });
            },
            empty: function () {
                var elem,
                    i = 0;
                for (; (elem = this[i]) != null; i++)
                    if (elem.nodeType === 1) {
                        jQuery.cleanData(getAll(elem, false));
                        elem.textContent = '';
                    }
                return this;
            },
            clone: function (dataAndEvents, deepDataAndEvents) {
                dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
                deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
                return this.map(function () {
                    return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
                });
            },
            html: function (value) {
                return access(
                    this,
                    function (value) {
                        var elem = this[0] || {},
                            i = 0,
                            l = this.length;
                        if (value === void 0 && elem.nodeType === 1) return elem.innerHTML;
                        if (
                            typeof value === 'string' &&
                            !rnoInnerhtml.test(value) &&
                            !wrapMap[(rtagName.exec(value) || ['', ''])[1].toLowerCase()]
                        ) {
                            value = jQuery.htmlPrefilter(value);
                            try {
                                for (; i < l; i++) {
                                    elem = this[i] || {};
                                    if (elem.nodeType === 1) {
                                        jQuery.cleanData(getAll(elem, false));
                                        elem.innerHTML = value;
                                    }
                                }
                                elem = 0;
                            } catch (e) {}
                        }
                        if (elem) this.empty().append(value);
                    },
                    null,
                    value,
                    arguments.length,
                );
            },
            replaceWith: function () {
                var ignored = [];
                return domManip(
                    this,
                    arguments,
                    function (elem) {
                        var parent = this.parentNode;
                        if (jQuery.inArray(this, ignored) < 0) {
                            jQuery.cleanData(getAll(this));
                            if (parent) parent.replaceChild(elem, this);
                        }
                    },
                    ignored,
                );
            },
        });
        jQuery.each(
            {
                appendTo: 'append',
                prependTo: 'prepend',
                insertBefore: 'before',
                insertAfter: 'after',
                replaceAll: 'replaceWith',
            },
            function (name, original) {
                jQuery.fn[name] = function (selector) {
                    var elems,
                        ret = [],
                        insert = jQuery(selector),
                        last = insert.length - 1,
                        i = 0;
                    for (; i <= last; i++) {
                        elems = i === last ? this : this.clone(true);
                        jQuery(insert[i])[original](elems);
                        push.apply(ret, elems.get());
                    }
                    return this.pushStack(ret);
                };
            },
        );
        var rnumnonpx = new RegExp('^(' + pnum + ')(?!px)[a-z%]+$', 'i');
        var rcustomProp = /^--/;
        var getStyles = function (elem) {
            var view = elem.ownerDocument.defaultView;
            if (!view || !view.opener) view = window;
            return view.getComputedStyle(elem);
        };
        var swap = function (elem, options, callback) {
            var ret,
                name,
                old = {};
            for (name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }
            ret = callback.call(elem);
            for (name in options) elem.style[name] = old[name];
            return ret;
        };
        var rboxStyle = new RegExp(cssExpand.join('|'), 'i');
        (function () {
            function computeStyleTests() {
                if (!div) return;
                container.style.cssText =
                    'position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0';
                div.style.cssText =
                    'position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%';
                documentElement.appendChild(container).appendChild(div);
                var divStyle = window.getComputedStyle(div);
                pixelPositionVal = divStyle.top !== '1%';
                reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
                div.style.right = '60%';
                pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
                boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
                div.style.position = 'absolute';
                scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
                documentElement.removeChild(container);
                div = null;
            }
            function roundPixelMeasures(measure) {
                return Math.round(parseFloat(measure));
            }
            var pixelPositionVal,
                boxSizingReliableVal,
                scrollboxSizeVal,
                pixelBoxStylesVal,
                reliableTrDimensionsVal,
                reliableMarginLeftVal,
                container = document.createElement('div'),
                div = document.createElement('div');
            if (!div.style) return;
            div.style.backgroundClip = 'content-box';
            div.cloneNode(true).style.backgroundClip = '';
            support.clearCloneStyle = div.style.backgroundClip === 'content-box';
            jQuery.extend(support, {
                boxSizingReliable: function () {
                    computeStyleTests();
                    return boxSizingReliableVal;
                },
                pixelBoxStyles: function () {
                    computeStyleTests();
                    return pixelBoxStylesVal;
                },
                pixelPosition: function () {
                    computeStyleTests();
                    return pixelPositionVal;
                },
                reliableMarginLeft: function () {
                    computeStyleTests();
                    return reliableMarginLeftVal;
                },
                scrollboxSize: function () {
                    computeStyleTests();
                    return scrollboxSizeVal;
                },
                reliableTrDimensions: function () {
                    var table, tr, trChild, trStyle;
                    if (reliableTrDimensionsVal == null) {
                        table = document.createElement('table');
                        tr = document.createElement('tr');
                        trChild = document.createElement('div');
                        table.style.cssText =
                            'position:absolute;left:-11111px;border-collapse:separate';
                        tr.style.cssText = 'box-sizing:content-box;border:1px solid';
                        tr.style.height = '1px';
                        trChild.style.height = '9px';
                        trChild.style.display = 'block';
                        documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
                        trStyle = window.getComputedStyle(tr);
                        reliableTrDimensionsVal =
                            parseInt(trStyle.height, 10) +
                                parseInt(trStyle.borderTopWidth, 10) +
                                parseInt(trStyle.borderBottomWidth, 10) ===
                            tr.offsetHeight;
                        documentElement.removeChild(table);
                    }
                    return reliableTrDimensionsVal;
                },
            });
        })();
        function curCSS(elem, name, computed) {
            var width,
                minWidth,
                maxWidth,
                ret,
                isCustomProp = rcustomProp.test(name),
                style = elem.style;
            computed = computed || getStyles(elem);
            if (computed) {
                ret = computed.getPropertyValue(name) || computed[name];
                if (isCustomProp && ret) ret = ret.replace(rtrimCSS, '$1') || void 0;
                if (ret === '' && !isAttached(elem)) ret = jQuery.style(elem, name);
                if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;
                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;
                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }
            return ret !== void 0 ? ret + '' : ret;
        }
        function addGetHookIf(conditionFn, hookFn) {
            return {
                get: function () {
                    if (conditionFn()) {
                        delete this.get;
                        return;
                    }
                    return (this.get = hookFn).apply(this, arguments);
                },
            };
        }
        var cssPrefixes = ['Webkit', 'Moz', 'ms'],
            emptyStyle = document.createElement('div').style,
            vendorProps = {};
        function vendorPropName(name) {
            var capName = name[0].toUpperCase() + name.slice(1),
                i = cssPrefixes.length;
            while (i--) {
                name = cssPrefixes[i] + capName;
                if (name in emptyStyle) return name;
            }
        }
        function finalPropName(name) {
            var final = jQuery.cssProps[name] || vendorProps[name];
            if (final) return final;
            if (name in emptyStyle) return name;
            return (vendorProps[name] = vendorPropName(name) || name);
        }
        var rdisplayswap = /^(none|table(?!-c[ea]).+)/,
            cssShow = {
                position: 'absolute',
                visibility: 'hidden',
                display: 'block',
            },
            cssNormalTransform = {
                letterSpacing: '0',
                fontWeight: '400',
            };
        function setPositiveNumber(_elem, value, subtract) {
            var matches = rcssNum.exec(value);
            return matches
                ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || 'px')
                : value;
        }
        function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
            var i = dimension === 'width' ? 1 : 0,
                extra = 0,
                delta = 0,
                marginDelta = 0;
            if (box === (isBorderBox ? 'border' : 'content')) return 0;
            for (; i < 4; i += 2) {
                if (box === 'margin')
                    marginDelta += jQuery.css(elem, box + cssExpand[i], true, styles);
                if (!isBorderBox) {
                    delta += jQuery.css(elem, 'padding' + cssExpand[i], true, styles);
                    if (box !== 'padding')
                        delta += jQuery.css(elem, 'border' + cssExpand[i] + 'Width', true, styles);
                    else extra += jQuery.css(elem, 'border' + cssExpand[i] + 'Width', true, styles);
                } else {
                    if (box === 'content')
                        delta -= jQuery.css(elem, 'padding' + cssExpand[i], true, styles);
                    if (box !== 'margin')
                        delta -= jQuery.css(elem, 'border' + cssExpand[i] + 'Width', true, styles);
                }
            }
            if (!isBorderBox && computedVal >= 0)
                delta +=
                    Math.max(
                        0,
                        Math.ceil(
                            elem['offset' + dimension[0].toUpperCase() + dimension.slice(1)] -
                                computedVal -
                                delta -
                                extra -
                                0.5,
                        ),
                    ) || 0;
            return delta + marginDelta;
        }
        function getWidthOrHeight(elem, dimension, extra) {
            var styles = getStyles(elem),
                isBorderBox =
                    (!support.boxSizingReliable() || extra) &&
                    jQuery.css(elem, 'boxSizing', false, styles) === 'border-box',
                valueIsBorderBox = isBorderBox,
                val = curCSS(elem, dimension, styles),
                offsetProp = 'offset' + dimension[0].toUpperCase() + dimension.slice(1);
            if (rnumnonpx.test(val)) {
                if (!extra) return val;
                val = 'auto';
            }
            if (
                ((!support.boxSizingReliable() && isBorderBox) ||
                    (!support.reliableTrDimensions() && nodeName(elem, 'tr')) ||
                    val === 'auto' ||
                    (!parseFloat(val) &&
                        jQuery.css(elem, 'display', false, styles) === 'inline')) &&
                elem.getClientRects().length
            ) {
                isBorderBox = jQuery.css(elem, 'boxSizing', false, styles) === 'border-box';
                valueIsBorderBox = offsetProp in elem;
                if (valueIsBorderBox) val = elem[offsetProp];
            }
            val = parseFloat(val) || 0;
            return (
                val +
                boxModelAdjustment(
                    elem,
                    dimension,
                    extra || (isBorderBox ? 'border' : 'content'),
                    valueIsBorderBox,
                    styles,
                    val,
                ) +
                'px'
            );
        }
        jQuery.extend({
            cssHooks: {
                opacity: {
                    get: function (elem, computed) {
                        if (computed) {
                            var ret = curCSS(elem, 'opacity');
                            return ret === '' ? '1' : ret;
                        }
                    },
                },
            },
            cssNumber: {
                animationIterationCount: true,
                aspectRatio: true,
                borderImageSlice: true,
                columnCount: true,
                flexGrow: true,
                flexShrink: true,
                fontWeight: true,
                gridArea: true,
                gridColumn: true,
                gridColumnEnd: true,
                gridColumnStart: true,
                gridRow: true,
                gridRowEnd: true,
                gridRowStart: true,
                lineHeight: true,
                opacity: true,
                order: true,
                orphans: true,
                scale: true,
                widows: true,
                zIndex: true,
                zoom: true,
                fillOpacity: true,
                floodOpacity: true,
                stopOpacity: true,
                strokeMiterlimit: true,
                strokeOpacity: true,
            },
            cssProps: {},
            style: function (elem, name, value, extra) {
                if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) return;
                var ret,
                    type,
                    hooks,
                    origName = camelCase(name),
                    isCustomProp = rcustomProp.test(name),
                    style = elem.style;
                if (!isCustomProp) name = finalPropName(origName);
                hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
                if (value !== void 0) {
                    type = typeof value;
                    if (type === 'string' && (ret = rcssNum.exec(value)) && ret[1]) {
                        value = adjustCSS(elem, name, ret);
                        type = 'number';
                    }
                    if (value == null || value !== value) return;
                    if (type === 'number' && !isCustomProp)
                        value += (ret && ret[3]) || (jQuery.cssNumber[origName] ? '' : 'px');
                    if (
                        !support.clearCloneStyle &&
                        value === '' &&
                        name.indexOf('background') === 0
                    )
                        style[name] = 'inherit';
                    if (
                        !hooks ||
                        !('set' in hooks) ||
                        (value = hooks.set(elem, value, extra)) !== void 0
                    )
                        if (isCustomProp) style.setProperty(name, value);
                        else style[name] = value;
                } else {
                    if (hooks && 'get' in hooks && (ret = hooks.get(elem, false, extra)) !== void 0)
                        return ret;
                    return style[name];
                }
            },
            css: function (elem, name, extra, styles) {
                var val,
                    num,
                    hooks,
                    origName = camelCase(name);
                if (!rcustomProp.test(name)) name = finalPropName(origName);
                hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
                if (hooks && 'get' in hooks) val = hooks.get(elem, true, extra);
                if (val === void 0) val = curCSS(elem, name, styles);
                if (val === 'normal' && name in cssNormalTransform) val = cssNormalTransform[name];
                if (extra === '' || extra) {
                    num = parseFloat(val);
                    return extra === true || isFinite(num) ? num || 0 : val;
                }
                return val;
            },
        });
        jQuery.each(['height', 'width'], function (_i, dimension) {
            jQuery.cssHooks[dimension] = {
                get: function (elem, computed, extra) {
                    if (computed)
                        return rdisplayswap.test(jQuery.css(elem, 'display')) &&
                            (!elem.getClientRects().length || !elem.getBoundingClientRect().width)
                            ? swap(elem, cssShow, function () {
                                  return getWidthOrHeight(elem, dimension, extra);
                              })
                            : getWidthOrHeight(elem, dimension, extra);
                },
                set: function (elem, value, extra) {
                    var matches,
                        styles = getStyles(elem),
                        scrollboxSizeBuggy =
                            !support.scrollboxSize() && styles.position === 'absolute',
                        isBorderBox =
                            (scrollboxSizeBuggy || extra) &&
                            jQuery.css(elem, 'boxSizing', false, styles) === 'border-box',
                        subtract = extra
                            ? boxModelAdjustment(elem, dimension, extra, isBorderBox, styles)
                            : 0;
                    if (isBorderBox && scrollboxSizeBuggy)
                        subtract -= Math.ceil(
                            elem['offset' + dimension[0].toUpperCase() + dimension.slice(1)] -
                                parseFloat(styles[dimension]) -
                                boxModelAdjustment(elem, dimension, 'border', false, styles) -
                                0.5,
                        );
                    if (
                        subtract &&
                        (matches = rcssNum.exec(value)) &&
                        (matches[3] || 'px') !== 'px'
                    ) {
                        elem.style[dimension] = value;
                        value = jQuery.css(elem, dimension);
                    }
                    return setPositiveNumber(elem, value, subtract);
                },
            };
        });
        jQuery.cssHooks.marginLeft = addGetHookIf(
            support.reliableMarginLeft,
            function (elem, computed) {
                if (computed)
                    return (
                        (parseFloat(curCSS(elem, 'marginLeft')) ||
                            elem.getBoundingClientRect().left -
                                swap(elem, {marginLeft: 0}, function () {
                                    return elem.getBoundingClientRect().left;
                                })) + 'px'
                    );
            },
        );
        jQuery.each(
            {
                margin: '',
                padding: '',
                border: 'Width',
            },
            function (prefix, suffix) {
                jQuery.cssHooks[prefix + suffix] = {
                    expand: function (value) {
                        var i = 0,
                            expanded = {},
                            parts = typeof value === 'string' ? value.split(' ') : [value];
                        for (; i < 4; i++)
                            expanded[prefix + cssExpand[i] + suffix] =
                                parts[i] || parts[i - 2] || parts[0];
                        return expanded;
                    },
                };
                if (prefix !== 'margin') jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
            },
        );
        jQuery.fn.extend({
            css: function (name, value) {
                return access(
                    this,
                    function (elem, name, value) {
                        var styles,
                            len,
                            map = {},
                            i = 0;
                        if (Array.isArray(name)) {
                            styles = getStyles(elem);
                            len = name.length;
                            for (; i < len; i++)
                                map[name[i]] = jQuery.css(elem, name[i], false, styles);
                            return map;
                        }
                        return value !== void 0
                            ? jQuery.style(elem, name, value)
                            : jQuery.css(elem, name);
                    },
                    name,
                    value,
                    arguments.length > 1,
                );
            },
        });
        function Tween(elem, options, prop, end, easing) {
            return new Tween.prototype.init(elem, options, prop, end, easing);
        }
        jQuery.Tween = Tween;
        Tween.prototype = {
            constructor: Tween,
            init: function (elem, options, prop, end, easing, unit) {
                this.elem = elem;
                this.prop = prop;
                this.easing = easing || jQuery.easing._default;
                this.options = options;
                this.start = this.now = this.cur();
                this.end = end;
                this.unit = unit || (jQuery.cssNumber[prop] ? '' : 'px');
            },
            cur: function () {
                var hooks = Tween.propHooks[this.prop];
                return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
            },
            run: function (percent) {
                var eased,
                    hooks = Tween.propHooks[this.prop];
                if (this.options.duration)
                    this.pos = eased = jQuery.easing[this.easing](
                        percent,
                        this.options.duration * percent,
                        0,
                        1,
                        this.options.duration,
                    );
                else this.pos = eased = percent;
                this.now = (this.end - this.start) * eased + this.start;
                if (this.options.step) this.options.step.call(this.elem, this.now, this);
                if (hooks && hooks.set) hooks.set(this);
                else Tween.propHooks._default.set(this);
                return this;
            },
        };
        Tween.prototype.init.prototype = Tween.prototype;
        Tween.propHooks = {
            _default: {
                get: function (tween) {
                    var result;
                    if (
                        tween.elem.nodeType !== 1 ||
                        (tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null)
                    )
                        return tween.elem[tween.prop];
                    result = jQuery.css(tween.elem, tween.prop, '');
                    return !result || result === 'auto' ? 0 : result;
                },
                set: function (tween) {
                    if (jQuery.fx.step[tween.prop]) jQuery.fx.step[tween.prop](tween);
                    else if (
                        tween.elem.nodeType === 1 &&
                        (jQuery.cssHooks[tween.prop] ||
                            tween.elem.style[finalPropName(tween.prop)] != null)
                    )
                        jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                    else tween.elem[tween.prop] = tween.now;
                },
            },
        };
        Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
            set: function (tween) {
                if (tween.elem.nodeType && tween.elem.parentNode)
                    tween.elem[tween.prop] = tween.now;
            },
        };
        jQuery.easing = {
            linear: function (p) {
                return p;
            },
            swing: function (p) {
                return 0.5 - Math.cos(p * Math.PI) / 2;
            },
            _default: 'swing',
        };
        jQuery.fx = Tween.prototype.init;
        jQuery.fx.step = {};
        var fxNow,
            inProgress,
            rfxtypes = /^(?:toggle|show|hide)$/,
            rrun = /queueHooks$/;
        function schedule() {
            if (inProgress) {
                if (document.hidden === false && window.requestAnimationFrame)
                    window.requestAnimationFrame(schedule);
                else window.setTimeout(schedule, jQuery.fx.interval);
                jQuery.fx.tick();
            }
        }
        function createFxNow() {
            window.setTimeout(function () {
                fxNow = void 0;
            });
            return (fxNow = Date.now());
        }
        function genFx(type, includeWidth) {
            var which,
                i = 0,
                attrs = {height: type};
            includeWidth = includeWidth ? 1 : 0;
            for (; i < 4; i += 2 - includeWidth) {
                which = cssExpand[i];
                attrs['margin' + which] = attrs['padding' + which] = type;
            }
            if (includeWidth) attrs.opacity = attrs.width = type;
            return attrs;
        }
        function createTween(value, prop, animation) {
            var tween,
                collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners['*']),
                index = 0,
                length = collection.length;
            for (; index < length; index++)
                if ((tween = collection[index].call(animation, prop, value))) return tween;
        }
        function defaultPrefilter(elem, props, opts) {
            var prop,
                value,
                toggle,
                hooks,
                oldfire,
                propTween,
                restoreDisplay,
                display,
                isBox = 'width' in props || 'height' in props,
                anim = this,
                orig = {},
                style = elem.style,
                hidden = elem.nodeType && isHiddenWithinTree(elem),
                dataShow = dataPriv.get(elem, 'fxshow');
            if (!opts.queue) {
                hooks = jQuery._queueHooks(elem, 'fx');
                if (hooks.unqueued == null) {
                    hooks.unqueued = 0;
                    oldfire = hooks.empty.fire;
                    hooks.empty.fire = function () {
                        if (!hooks.unqueued) oldfire();
                    };
                }
                hooks.unqueued++;
                anim.always(function () {
                    anim.always(function () {
                        hooks.unqueued--;
                        if (!jQuery.queue(elem, 'fx').length) hooks.empty.fire();
                    });
                });
            }
            for (prop in props) {
                value = props[prop];
                if (rfxtypes.test(value)) {
                    delete props[prop];
                    toggle = toggle || value === 'toggle';
                    if (value === (hidden ? 'hide' : 'show'))
                        if (value === 'show' && dataShow && dataShow[prop] !== void 0)
                            hidden = true;
                        else continue;
                    orig[prop] = (dataShow && dataShow[prop]) || jQuery.style(elem, prop);
                }
            }
            propTween = !jQuery.isEmptyObject(props);
            if (!propTween && jQuery.isEmptyObject(orig)) return;
            if (isBox && elem.nodeType === 1) {
                opts.overflow = [style.overflow, style.overflowX, style.overflowY];
                restoreDisplay = dataShow && dataShow.display;
                if (restoreDisplay == null) restoreDisplay = dataPriv.get(elem, 'display');
                display = jQuery.css(elem, 'display');
                if (display === 'none')
                    if (restoreDisplay) display = restoreDisplay;
                    else {
                        showHide([elem], true);
                        restoreDisplay = elem.style.display || restoreDisplay;
                        display = jQuery.css(elem, 'display');
                        showHide([elem]);
                    }
                if (
                    display === 'inline' ||
                    (display === 'inline-block' && restoreDisplay != null)
                ) {
                    if (jQuery.css(elem, 'float') === 'none') {
                        if (!propTween) {
                            anim.done(function () {
                                style.display = restoreDisplay;
                            });
                            if (restoreDisplay == null) {
                                display = style.display;
                                restoreDisplay = display === 'none' ? '' : display;
                            }
                        }
                        style.display = 'inline-block';
                    }
                }
            }
            if (opts.overflow) {
                style.overflow = 'hidden';
                anim.always(function () {
                    style.overflow = opts.overflow[0];
                    style.overflowX = opts.overflow[1];
                    style.overflowY = opts.overflow[2];
                });
            }
            propTween = false;
            for (prop in orig) {
                if (!propTween) {
                    if (dataShow) {
                        if ('hidden' in dataShow) hidden = dataShow.hidden;
                    } else dataShow = dataPriv.access(elem, 'fxshow', {display: restoreDisplay});
                    if (toggle) dataShow.hidden = !hidden;
                    if (hidden) showHide([elem], true);
                    anim.done(function () {
                        if (!hidden) showHide([elem]);
                        dataPriv.remove(elem, 'fxshow');
                        for (prop in orig) jQuery.style(elem, prop, orig[prop]);
                    });
                }
                propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
                if (!(prop in dataShow)) {
                    dataShow[prop] = propTween.start;
                    if (hidden) {
                        propTween.end = propTween.start;
                        propTween.start = 0;
                    }
                }
            }
        }
        function propFilter(props, specialEasing) {
            var index, name, easing, value, hooks;
            for (index in props) {
                name = camelCase(index);
                easing = specialEasing[name];
                value = props[index];
                if (Array.isArray(value)) {
                    easing = value[1];
                    value = props[index] = value[0];
                }
                if (index !== name) {
                    props[name] = value;
                    delete props[index];
                }
                hooks = jQuery.cssHooks[name];
                if (hooks && 'expand' in hooks) {
                    value = hooks.expand(value);
                    delete props[name];
                    for (index in value)
                        if (!(index in props)) {
                            props[index] = value[index];
                            specialEasing[index] = easing;
                        }
                } else specialEasing[name] = easing;
            }
        }
        function Animation(elem, properties, options) {
            var result,
                stopped,
                index = 0,
                length = Animation.prefilters.length,
                deferred = jQuery.Deferred().always(function () {
                    delete tick.elem;
                }),
                tick = function () {
                    if (stopped) return false;
                    var currentTime = fxNow || createFxNow(),
                        remaining = Math.max(
                            0,
                            animation.startTime + animation.duration - currentTime,
                        ),
                        percent = 1 - (remaining / animation.duration || 0),
                        index = 0,
                        length = animation.tweens.length;
                    for (; index < length; index++) animation.tweens[index].run(percent);
                    deferred.notifyWith(elem, [animation, percent, remaining]);
                    if (percent < 1 && length) return remaining;
                    if (!length) deferred.notifyWith(elem, [animation, 1, 0]);
                    deferred.resolveWith(elem, [animation]);
                    return false;
                },
                animation = deferred.promise({
                    elem,
                    props: jQuery.extend({}, properties),
                    opts: jQuery.extend(
                        true,
                        {
                            specialEasing: {},
                            easing: jQuery.easing._default,
                        },
                        options,
                    ),
                    originalProperties: properties,
                    originalOptions: options,
                    startTime: fxNow || createFxNow(),
                    duration: options.duration,
                    tweens: [],
                    createTween: function (prop, end) {
                        var tween = jQuery.Tween(
                            elem,
                            animation.opts,
                            prop,
                            end,
                            animation.opts.specialEasing[prop] || animation.opts.easing,
                        );
                        animation.tweens.push(tween);
                        return tween;
                    },
                    stop: function (gotoEnd) {
                        var index = 0,
                            length = gotoEnd ? animation.tweens.length : 0;
                        if (stopped) return this;
                        stopped = true;
                        for (; index < length; index++) animation.tweens[index].run(1);
                        if (gotoEnd) {
                            deferred.notifyWith(elem, [animation, 1, 0]);
                            deferred.resolveWith(elem, [animation, gotoEnd]);
                        } else deferred.rejectWith(elem, [animation, gotoEnd]);
                        return this;
                    },
                }),
                props = animation.props;
            propFilter(props, animation.opts.specialEasing);
            for (; index < length; index++) {
                result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
                if (result) {
                    if (isFunction(result.stop))
                        jQuery._queueHooks(animation.elem, animation.opts.queue).stop =
                            result.stop.bind(result);
                    return result;
                }
            }
            jQuery.map(props, createTween, animation);
            if (isFunction(animation.opts.start)) animation.opts.start.call(elem, animation);
            animation
                .progress(animation.opts.progress)
                .done(animation.opts.done, animation.opts.complete)
                .fail(animation.opts.fail)
                .always(animation.opts.always);
            jQuery.fx.timer(
                jQuery.extend(tick, {
                    elem,
                    anim: animation,
                    queue: animation.opts.queue,
                }),
            );
            return animation;
        }
        jQuery.Animation = jQuery.extend(Animation, {
            tweeners: {
                '*': [
                    function (prop, value) {
                        var tween = this.createTween(prop, value);
                        adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
                        return tween;
                    },
                ],
            },
            tweener: function (props, callback) {
                if (isFunction(props)) {
                    callback = props;
                    props = ['*'];
                } else props = props.match(rnothtmlwhite);
                var prop,
                    index = 0,
                    length = props.length;
                for (; index < length; index++) {
                    prop = props[index];
                    Animation.tweeners[prop] = Animation.tweeners[prop] || [];
                    Animation.tweeners[prop].unshift(callback);
                }
            },
            prefilters: [defaultPrefilter],
            prefilter: function (callback, prepend) {
                if (prepend) Animation.prefilters.unshift(callback);
                else Animation.prefilters.push(callback);
            },
        });
        jQuery.speed = function (speed, easing, fn) {
            var opt =
                speed && typeof speed === 'object'
                    ? jQuery.extend({}, speed)
                    : {
                          complete: fn || (!fn && easing) || (isFunction(speed) && speed),
                          duration: speed,
                          easing: (fn && easing) || (easing && !isFunction(easing) && easing),
                      };
            if (jQuery.fx.off) opt.duration = 0;
            else if (typeof opt.duration !== 'number')
                if (opt.duration in jQuery.fx.speeds) opt.duration = jQuery.fx.speeds[opt.duration];
                else opt.duration = jQuery.fx.speeds._default;
            if (opt.queue == null || opt.queue === true) opt.queue = 'fx';
            opt.old = opt.complete;
            opt.complete = function () {
                if (isFunction(opt.old)) opt.old.call(this);
                if (opt.queue) jQuery.dequeue(this, opt.queue);
            };
            return opt;
        };
        jQuery.fn.extend({
            fadeTo: function (speed, to, easing, callback) {
                return this.filter(isHiddenWithinTree)
                    .css('opacity', 0)
                    .show()
                    .end()
                    .animate({opacity: to}, speed, easing, callback);
            },
            animate: function (prop, speed, easing, callback) {
                var empty = jQuery.isEmptyObject(prop),
                    optall = jQuery.speed(speed, easing, callback),
                    doAnimation = function () {
                        var anim = Animation(this, jQuery.extend({}, prop), optall);
                        if (empty || dataPriv.get(this, 'finish')) anim.stop(true);
                    };
                doAnimation.finish = doAnimation;
                return empty || optall.queue === false
                    ? this.each(doAnimation)
                    : this.queue(optall.queue, doAnimation);
            },
            stop: function (type, clearQueue, gotoEnd) {
                var stopQueue = function (hooks) {
                    var stop = hooks.stop;
                    delete hooks.stop;
                    stop(gotoEnd);
                };
                if (typeof type !== 'string') {
                    gotoEnd = clearQueue;
                    clearQueue = type;
                    type = void 0;
                }
                if (clearQueue) this.queue(type || 'fx', []);
                return this.each(function () {
                    var dequeue = true,
                        index = type != null && type + 'queueHooks',
                        timers = jQuery.timers,
                        data = dataPriv.get(this);
                    if (index) {
                        if (data[index] && data[index].stop) stopQueue(data[index]);
                    } else
                        for (index in data)
                            if (data[index] && data[index].stop && rrun.test(index))
                                stopQueue(data[index]);
                    for (index = timers.length; index--; )
                        if (
                            timers[index].elem === this &&
                            (type == null || timers[index].queue === type)
                        ) {
                            timers[index].anim.stop(gotoEnd);
                            dequeue = false;
                            timers.splice(index, 1);
                        }
                    if (dequeue || !gotoEnd) jQuery.dequeue(this, type);
                });
            },
            finish: function (type) {
                if (type !== false) type = type || 'fx';
                return this.each(function () {
                    var index,
                        data = dataPriv.get(this),
                        queue = data[type + 'queue'],
                        hooks = data[type + 'queueHooks'],
                        timers = jQuery.timers,
                        length = queue ? queue.length : 0;
                    data.finish = true;
                    jQuery.queue(this, type, []);
                    if (hooks && hooks.stop) hooks.stop.call(this, true);
                    for (index = timers.length; index--; )
                        if (timers[index].elem === this && timers[index].queue === type) {
                            timers[index].anim.stop(true);
                            timers.splice(index, 1);
                        }
                    for (index = 0; index < length; index++)
                        if (queue[index] && queue[index].finish) queue[index].finish.call(this);
                    delete data.finish;
                });
            },
        });
        jQuery.each(['toggle', 'show', 'hide'], function (_i, name) {
            var cssFn = jQuery.fn[name];
            jQuery.fn[name] = function (speed, easing, callback) {
                return speed == null || typeof speed === 'boolean'
                    ? cssFn.apply(this, arguments)
                    : this.animate(genFx(name, true), speed, easing, callback);
            };
        });
        jQuery.each(
            {
                slideDown: genFx('show'),
                slideUp: genFx('hide'),
                slideToggle: genFx('toggle'),
                fadeIn: {opacity: 'show'},
                fadeOut: {opacity: 'hide'},
                fadeToggle: {opacity: 'toggle'},
            },
            function (name, props) {
                jQuery.fn[name] = function (speed, easing, callback) {
                    return this.animate(props, speed, easing, callback);
                };
            },
        );
        jQuery.timers = [];
        jQuery.fx.tick = function () {
            var timer,
                i = 0,
                timers = jQuery.timers;
            fxNow = Date.now();
            for (; i < timers.length; i++) {
                timer = timers[i];
                if (!timer() && timers[i] === timer) timers.splice(i--, 1);
            }
            if (!timers.length) jQuery.fx.stop();
            fxNow = void 0;
        };
        jQuery.fx.timer = function (timer) {
            jQuery.timers.push(timer);
            jQuery.fx.start();
        };
        jQuery.fx.interval = 13;
        jQuery.fx.start = function () {
            if (inProgress) return;
            inProgress = true;
            schedule();
        };
        jQuery.fx.stop = function () {
            inProgress = null;
        };
        jQuery.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400,
        };
        jQuery.fn.delay = function (time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || 'fx';
            return this.queue(type, function (next, hooks) {
                var timeout = window.setTimeout(next, time);
                hooks.stop = function () {
                    window.clearTimeout(timeout);
                };
            });
        };
        (function () {
            var input = document.createElement('input'),
                opt = document
                    .createElement('select')
                    .appendChild(document.createElement('option'));
            input.type = 'checkbox';
            support.checkOn = input.value !== '';
            support.optSelected = opt.selected;
            input = document.createElement('input');
            input.value = 't';
            input.type = 'radio';
            support.radioValue = input.value === 't';
        })();
        var boolHook,
            attrHandle = jQuery.expr.attrHandle;
        jQuery.fn.extend({
            attr: function (name, value) {
                return access(this, jQuery.attr, name, value, arguments.length > 1);
            },
            removeAttr: function (name) {
                return this.each(function () {
                    jQuery.removeAttr(this, name);
                });
            },
        });
        jQuery.extend({
            attr: function (elem, name, value) {
                var ret,
                    hooks,
                    nType = elem.nodeType;
                if (nType === 3 || nType === 8 || nType === 2) return;
                if (typeof elem.getAttribute === 'undefined') return jQuery.prop(elem, name, value);
                if (nType !== 1 || !jQuery.isXMLDoc(elem))
                    hooks =
                        jQuery.attrHooks[name.toLowerCase()] ||
                        (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
                if (value !== void 0) {
                    if (value === null) {
                        jQuery.removeAttr(elem, name);
                        return;
                    }
                    if (hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== void 0)
                        return ret;
                    elem.setAttribute(name, value + '');
                    return value;
                }
                if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) return ret;
                ret = jQuery.find.attr(elem, name);
                return ret == null ? void 0 : ret;
            },
            attrHooks: {
                type: {
                    set: function (elem, value) {
                        if (!support.radioValue && value === 'radio' && nodeName(elem, 'input')) {
                            var val = elem.value;
                            elem.setAttribute('type', value);
                            if (val) elem.value = val;
                            return value;
                        }
                    },
                },
            },
            removeAttr: function (elem, value) {
                var name,
                    i = 0,
                    attrNames = value && value.match(rnothtmlwhite);
                if (attrNames && elem.nodeType === 1)
                    while ((name = attrNames[i++])) elem.removeAttribute(name);
            },
        });
        boolHook = {
            set: function (elem, value, name) {
                if (value === false) jQuery.removeAttr(elem, name);
                else elem.setAttribute(name, name);
                return name;
            },
        };
        jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (_i, name) {
            var getter = attrHandle[name] || jQuery.find.attr;
            attrHandle[name] = function (elem, name, isXML) {
                var ret,
                    handle,
                    lowercaseName = name.toLowerCase();
                if (!isXML) {
                    handle = attrHandle[lowercaseName];
                    attrHandle[lowercaseName] = ret;
                    ret = getter(elem, name, isXML) != null ? lowercaseName : null;
                    attrHandle[lowercaseName] = handle;
                }
                return ret;
            };
        });
        var rfocusable = /^(?:input|select|textarea|button)$/i,
            rclickable = /^(?:a|area)$/i;
        jQuery.fn.extend({
            prop: function (name, value) {
                return access(this, jQuery.prop, name, value, arguments.length > 1);
            },
            removeProp: function (name) {
                return this.each(function () {
                    delete this[jQuery.propFix[name] || name];
                });
            },
        });
        jQuery.extend({
            prop: function (elem, name, value) {
                var ret,
                    hooks,
                    nType = elem.nodeType;
                if (nType === 3 || nType === 8 || nType === 2) return;
                if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
                    name = jQuery.propFix[name] || name;
                    hooks = jQuery.propHooks[name];
                }
                if (value !== void 0) {
                    if (hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== void 0)
                        return ret;
                    return (elem[name] = value);
                }
                if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) return ret;
                return elem[name];
            },
            propHooks: {
                tabIndex: {
                    get: function (elem) {
                        var tabindex = jQuery.find.attr(elem, 'tabindex');
                        if (tabindex) return parseInt(tabindex, 10);
                        if (
                            rfocusable.test(elem.nodeName) ||
                            (rclickable.test(elem.nodeName) && elem.href)
                        )
                            return 0;
                        return -1;
                    },
                },
            },
            propFix: {
                for: 'htmlFor',
                class: 'className',
            },
        });
        if (!support.optSelected)
            jQuery.propHooks.selected = {
                get: function (elem) {
                    var parent = elem.parentNode;
                    if (parent && parent.parentNode) parent.parentNode.selectedIndex;
                    return null;
                },
                set: function (elem) {
                    var parent = elem.parentNode;
                    if (parent) {
                        parent.selectedIndex;
                        if (parent.parentNode) parent.parentNode.selectedIndex;
                    }
                },
            };
        jQuery.each(
            [
                'tabIndex',
                'readOnly',
                'maxLength',
                'cellSpacing',
                'cellPadding',
                'rowSpan',
                'colSpan',
                'useMap',
                'frameBorder',
                'contentEditable',
            ],
            function () {
                jQuery.propFix[this.toLowerCase()] = this;
            },
        );
        function stripAndCollapse(value) {
            return (value.match(rnothtmlwhite) || []).join(' ');
        }
        function getClass(elem) {
            return (elem.getAttribute && elem.getAttribute('class')) || '';
        }
        function classesToArray(value) {
            if (Array.isArray(value)) return value;
            if (typeof value === 'string') return value.match(rnothtmlwhite) || [];
            return [];
        }
        jQuery.fn.extend({
            addClass: function (value) {
                var classNames, cur, curValue, className, i, finalValue;
                if (isFunction(value))
                    return this.each(function (j) {
                        jQuery(this).addClass(value.call(this, j, getClass(this)));
                    });
                classNames = classesToArray(value);
                if (classNames.length)
                    return this.each(function () {
                        curValue = getClass(this);
                        cur = this.nodeType === 1 && ' ' + stripAndCollapse(curValue) + ' ';
                        if (cur) {
                            for (i = 0; i < classNames.length; i++) {
                                className = classNames[i];
                                if (cur.indexOf(' ' + className + ' ') < 0) cur += className + ' ';
                            }
                            finalValue = stripAndCollapse(cur);
                            if (curValue !== finalValue) this.setAttribute('class', finalValue);
                        }
                    });
                return this;
            },
            removeClass: function (value) {
                var classNames, cur, curValue, className, i, finalValue;
                if (isFunction(value))
                    return this.each(function (j) {
                        jQuery(this).removeClass(value.call(this, j, getClass(this)));
                    });
                if (!arguments.length) return this.attr('class', '');
                classNames = classesToArray(value);
                if (classNames.length)
                    return this.each(function () {
                        curValue = getClass(this);
                        cur = this.nodeType === 1 && ' ' + stripAndCollapse(curValue) + ' ';
                        if (cur) {
                            for (i = 0; i < classNames.length; i++) {
                                className = classNames[i];
                                while (cur.indexOf(' ' + className + ' ') > -1)
                                    cur = cur.replace(' ' + className + ' ', ' ');
                            }
                            finalValue = stripAndCollapse(cur);
                            if (curValue !== finalValue) this.setAttribute('class', finalValue);
                        }
                    });
                return this;
            },
            toggleClass: function (value, stateVal) {
                var classNames,
                    className,
                    i,
                    self,
                    type = typeof value,
                    isValidValue = type === 'string' || Array.isArray(value);
                if (isFunction(value))
                    return this.each(function (i) {
                        jQuery(this).toggleClass(
                            value.call(this, i, getClass(this), stateVal),
                            stateVal,
                        );
                    });
                if (typeof stateVal === 'boolean' && isValidValue)
                    return stateVal ? this.addClass(value) : this.removeClass(value);
                classNames = classesToArray(value);
                return this.each(function () {
                    if (isValidValue) {
                        self = jQuery(this);
                        for (i = 0; i < classNames.length; i++) {
                            className = classNames[i];
                            if (self.hasClass(className)) self.removeClass(className);
                            else self.addClass(className);
                        }
                    } else if (value === void 0 || type === 'boolean') {
                        className = getClass(this);
                        if (className) dataPriv.set(this, '__className__', className);
                        if (this.setAttribute)
                            this.setAttribute(
                                'class',
                                className || value === false
                                    ? ''
                                    : dataPriv.get(this, '__className__') || '',
                            );
                    }
                });
            },
            hasClass: function (selector) {
                var className,
                    elem,
                    i = 0;
                className = ' ' + selector + ' ';
                while ((elem = this[i++]))
                    if (
                        elem.nodeType === 1 &&
                        (' ' + stripAndCollapse(getClass(elem)) + ' ').indexOf(className) > -1
                    )
                        return true;
                return false;
            },
        });
        var rreturn = /\r/g;
        jQuery.fn.extend({
            val: function (value) {
                var hooks,
                    ret,
                    valueIsFunction,
                    elem = this[0];
                if (!arguments.length) {
                    if (elem) {
                        hooks =
                            jQuery.valHooks[elem.type] ||
                            jQuery.valHooks[elem.nodeName.toLowerCase()];
                        if (hooks && 'get' in hooks && (ret = hooks.get(elem, 'value')) !== void 0)
                            return ret;
                        ret = elem.value;
                        if (typeof ret === 'string') return ret.replace(rreturn, '');
                        return ret == null ? '' : ret;
                    }
                    return;
                }
                valueIsFunction = isFunction(value);
                return this.each(function (i) {
                    var val;
                    if (this.nodeType !== 1) return;
                    if (valueIsFunction) val = value.call(this, i, jQuery(this).val());
                    else val = value;
                    if (val == null) val = '';
                    else if (typeof val === 'number') val += '';
                    else if (Array.isArray(val))
                        val = jQuery.map(val, function (value) {
                            return value == null ? '' : value + '';
                        });
                    hooks =
                        jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
                    if (!hooks || !('set' in hooks) || hooks.set(this, val, 'value') === void 0)
                        this.value = val;
                });
            },
        });
        jQuery.extend({
            valHooks: {
                option: {
                    get: function (elem) {
                        var val = jQuery.find.attr(elem, 'value');
                        return val != null ? val : stripAndCollapse(jQuery.text(elem));
                    },
                },
                select: {
                    get: function (elem) {
                        var value,
                            option,
                            i,
                            options = elem.options,
                            index = elem.selectedIndex,
                            one = elem.type === 'select-one',
                            values = one ? null : [],
                            max = one ? index + 1 : options.length;
                        if (index < 0) i = max;
                        else i = one ? index : 0;
                        for (; i < max; i++) {
                            option = options[i];
                            if (
                                (option.selected || i === index) &&
                                !option.disabled &&
                                (!option.parentNode.disabled ||
                                    !nodeName(option.parentNode, 'optgroup'))
                            ) {
                                value = jQuery(option).val();
                                if (one) return value;
                                values.push(value);
                            }
                        }
                        return values;
                    },
                    set: function (elem, value) {
                        var optionSet,
                            option,
                            options = elem.options,
                            values = jQuery.makeArray(value),
                            i = options.length;
                        while (i--) {
                            option = options[i];
                            if (
                                (option.selected =
                                    jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1)
                            )
                                optionSet = true;
                        }
                        if (!optionSet) elem.selectedIndex = -1;
                        return values;
                    },
                },
            },
        });
        jQuery.each(['radio', 'checkbox'], function () {
            jQuery.valHooks[this] = {
                set: function (elem, value) {
                    if (Array.isArray(value))
                        return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1);
                },
            };
            if (!support.checkOn)
                jQuery.valHooks[this].get = function (elem) {
                    return elem.getAttribute('value') === null ? 'on' : elem.value;
                };
        });
        var location = window.location;
        var nonce = {guid: Date.now()};
        var rquery = /\?/;
        jQuery.parseXML = function (data) {
            var xml, parserErrorElem;
            if (!data || typeof data !== 'string') return null;
            try {
                xml = new window.DOMParser().parseFromString(data, 'text/xml');
            } catch (e) {}
            parserErrorElem = xml && xml.getElementsByTagName('parsererror')[0];
            if (!xml || parserErrorElem)
                jQuery.error(
                    'Invalid XML: ' +
                        (parserErrorElem
                            ? jQuery
                                  .map(parserErrorElem.childNodes, function (el) {
                                      return el.textContent;
                                  })
                                  .join('\n')
                            : data),
                );
            return xml;
        };
        var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
            stopPropagationCallback = function (e) {
                e.stopPropagation();
            };
        jQuery.extend(jQuery.event, {
            trigger: function (event, data, elem, onlyHandlers) {
                var i,
                    cur,
                    tmp,
                    bubbleType,
                    ontype,
                    handle,
                    special,
                    lastElement,
                    eventPath = [elem || document],
                    type = hasOwn.call(event, 'type') ? event.type : event,
                    namespaces = hasOwn.call(event, 'namespace') ? event.namespace.split('.') : [];
                cur = lastElement = tmp = elem = elem || document;
                if (elem.nodeType === 3 || elem.nodeType === 8) return;
                if (rfocusMorph.test(type + jQuery.event.triggered)) return;
                if (type.indexOf('.') > -1) {
                    namespaces = type.split('.');
                    type = namespaces.shift();
                    namespaces.sort();
                }
                ontype = type.indexOf(':') < 0 && 'on' + type;
                event = event[jQuery.expando]
                    ? event
                    : new jQuery.Event(type, typeof event === 'object' && event);
                event.isTrigger = onlyHandlers ? 2 : 3;
                event.namespace = namespaces.join('.');
                event.rnamespace = event.namespace
                    ? new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)')
                    : null;
                event.result = void 0;
                if (!event.target) event.target = elem;
                data = data == null ? [event] : jQuery.makeArray(data, [event]);
                special = jQuery.event.special[type] || {};
                if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false)
                    return;
                if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
                    bubbleType = special.delegateType || type;
                    if (!rfocusMorph.test(bubbleType + type)) cur = cur.parentNode;
                    for (; cur; cur = cur.parentNode) {
                        eventPath.push(cur);
                        tmp = cur;
                    }
                    if (tmp === (elem.ownerDocument || document))
                        eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
                i = 0;
                while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
                    lastElement = cur;
                    event.type = i > 1 ? bubbleType : special.bindType || type;
                    handle =
                        (dataPriv.get(cur, 'events') || Object.create(null))[event.type] &&
                        dataPriv.get(cur, 'handle');
                    if (handle) handle.apply(cur, data);
                    handle = ontype && cur[ontype];
                    if (handle && handle.apply && acceptData(cur)) {
                        event.result = handle.apply(cur, data);
                        if (event.result === false) event.preventDefault();
                    }
                }
                event.type = type;
                if (!onlyHandlers && !event.isDefaultPrevented()) {
                    if (
                        (!special._default ||
                            special._default.apply(eventPath.pop(), data) === false) &&
                        acceptData(elem)
                    ) {
                        if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                            tmp = elem[ontype];
                            if (tmp) elem[ontype] = null;
                            jQuery.event.triggered = type;
                            if (event.isPropagationStopped())
                                lastElement.addEventListener(type, stopPropagationCallback);
                            elem[type]();
                            if (event.isPropagationStopped())
                                lastElement.removeEventListener(type, stopPropagationCallback);
                            jQuery.event.triggered = void 0;
                            if (tmp) elem[ontype] = tmp;
                        }
                    }
                }
                return event.result;
            },
            simulate: function (type, elem, event) {
                var e = jQuery.extend(new jQuery.Event(), event, {
                    type,
                    isSimulated: true,
                });
                jQuery.event.trigger(e, null, elem);
            },
        });
        jQuery.fn.extend({
            trigger: function (type, data) {
                return this.each(function () {
                    jQuery.event.trigger(type, data, this);
                });
            },
            triggerHandler: function (type, data) {
                var elem = this[0];
                if (elem) return jQuery.event.trigger(type, data, elem, true);
            },
        });
        var rbracket = /\[\]$/,
            rCRLF = /\r?\n/g,
            rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
            rsubmittable = /^(?:input|select|textarea|keygen)/i;
        function buildParams(prefix, obj, traditional, add) {
            var name;
            if (Array.isArray(obj))
                jQuery.each(obj, function (i, v) {
                    if (traditional || rbracket.test(prefix)) add(prefix, v);
                    else
                        buildParams(
                            prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']',
                            v,
                            traditional,
                            add,
                        );
                });
            else if (!traditional && toType(obj) === 'object')
                for (name in obj)
                    buildParams(prefix + '[' + name + ']', obj[name], traditional, add);
            else add(prefix, obj);
        }
        jQuery.param = function (a, traditional) {
            var prefix,
                s = [],
                add = function (key, valueOrFunction) {
                    var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
                    s[s.length] =
                        encodeURIComponent(key) +
                        '=' +
                        encodeURIComponent(value == null ? '' : value);
                };
            if (a == null) return '';
            if (Array.isArray(a) || (a.jquery && !jQuery.isPlainObject(a)))
                jQuery.each(a, function () {
                    add(this.name, this.value);
                });
            else for (prefix in a) buildParams(prefix, a[prefix], traditional, add);
            return s.join('&');
        };
        jQuery.fn.extend({
            serialize: function () {
                return jQuery.param(this.serializeArray());
            },
            serializeArray: function () {
                return this.map(function () {
                    var elements = jQuery.prop(this, 'elements');
                    return elements ? jQuery.makeArray(elements) : this;
                })
                    .filter(function () {
                        var type = this.type;
                        return (
                            this.name &&
                            !jQuery(this).is(':disabled') &&
                            rsubmittable.test(this.nodeName) &&
                            !rsubmitterTypes.test(type) &&
                            (this.checked || !rcheckableType.test(type))
                        );
                    })
                    .map(function (_i, elem) {
                        var val = jQuery(this).val();
                        if (val == null) return null;
                        if (Array.isArray(val))
                            return jQuery.map(val, function (val) {
                                return {
                                    name: elem.name,
                                    value: val.replace(rCRLF, '\r\n'),
                                };
                            });
                        return {
                            name: elem.name,
                            value: val.replace(rCRLF, '\r\n'),
                        };
                    })
                    .get();
            },
        });
        var r20 = /%20/g,
            rhash = /#.*$/,
            rantiCache = /([?&])_=[^&]*/,
            rheaders = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            rnoContent = /^(?:GET|HEAD)$/,
            rprotocol = /^\/\//,
            prefilters = {},
            transports = {},
            allTypes = '*/'.concat('*'),
            originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        function addToPrefiltersOrTransports(structure) {
            return function (dataTypeExpression, func) {
                if (typeof dataTypeExpression !== 'string') {
                    func = dataTypeExpression;
                    dataTypeExpression = '*';
                }
                var dataType,
                    i = 0,
                    dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
                if (isFunction(func))
                    while ((dataType = dataTypes[i++]))
                        if (dataType[0] === '+') {
                            dataType = dataType.slice(1) || '*';
                            (structure[dataType] = structure[dataType] || []).unshift(func);
                        } else (structure[dataType] = structure[dataType] || []).push(func);
            };
        }
        function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
            var inspected = {},
                seekingTransport = structure === transports;
            function inspect(dataType) {
                var selected;
                inspected[dataType] = true;
                jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
                    var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                    if (
                        typeof dataTypeOrTransport === 'string' &&
                        !seekingTransport &&
                        !inspected[dataTypeOrTransport]
                    ) {
                        options.dataTypes.unshift(dataTypeOrTransport);
                        inspect(dataTypeOrTransport);
                        return false;
                    } else if (seekingTransport) return !(selected = dataTypeOrTransport);
                });
                return selected;
            }
            return inspect(options.dataTypes[0]) || (!inspected['*'] && inspect('*'));
        }
        function ajaxExtend(target, src) {
            var key,
                deep,
                flatOptions = jQuery.ajaxSettings.flatOptions || {};
            for (key in src)
                if (src[key] !== void 0)
                    (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            if (deep) jQuery.extend(true, target, deep);
            return target;
        }
        function ajaxHandleResponses(s, jqXHR, responses) {
            var ct,
                type,
                finalDataType,
                firstDataType,
                contents = s.contents,
                dataTypes = s.dataTypes;
            while (dataTypes[0] === '*') {
                dataTypes.shift();
                if (ct === void 0) ct = s.mimeType || jqXHR.getResponseHeader('Content-Type');
            }
            if (ct) {
                for (type in contents)
                    if (contents[type] && contents[type].test(ct)) {
                        dataTypes.unshift(type);
                        break;
                    }
            }
            if (dataTypes[0] in responses) finalDataType = dataTypes[0];
            else {
                for (type in responses) {
                    if (!dataTypes[0] || s.converters[type + ' ' + dataTypes[0]]) {
                        finalDataType = type;
                        break;
                    }
                    if (!firstDataType) firstDataType = type;
                }
                finalDataType = finalDataType || firstDataType;
            }
            if (finalDataType) {
                if (finalDataType !== dataTypes[0]) dataTypes.unshift(finalDataType);
                return responses[finalDataType];
            }
        }
        function ajaxConvert(s, response, jqXHR, isSuccess) {
            var conv2,
                current,
                conv,
                tmp,
                prev,
                converters = {},
                dataTypes = s.dataTypes.slice();
            if (dataTypes[1])
                for (conv in s.converters) converters[conv.toLowerCase()] = s.converters[conv];
            current = dataTypes.shift();
            while (current) {
                if (s.responseFields[current]) jqXHR[s.responseFields[current]] = response;
                if (!prev && isSuccess && s.dataFilter)
                    response = s.dataFilter(response, s.dataType);
                prev = current;
                current = dataTypes.shift();
                if (current) {
                    if (current === '*') current = prev;
                    else if (prev !== '*' && prev !== current) {
                        conv = converters[prev + ' ' + current] || converters['* ' + current];
                        if (!conv)
                            for (conv2 in converters) {
                                tmp = conv2.split(' ');
                                if (tmp[1] === current) {
                                    conv =
                                        converters[prev + ' ' + tmp[0]] ||
                                        converters['* ' + tmp[0]];
                                    if (conv) {
                                        if (conv === true) conv = converters[conv2];
                                        else if (converters[conv2] !== true) {
                                            current = tmp[0];
                                            dataTypes.unshift(tmp[1]);
                                        }
                                        break;
                                    }
                                }
                            }
                        if (conv !== true)
                            if (conv && s.throws) response = conv(response);
                            else
                                try {
                                    response = conv(response);
                                } catch (e) {
                                    return {
                                        state: 'parsererror',
                                        error: conv
                                            ? e
                                            : 'No conversion from ' + prev + ' to ' + current,
                                    };
                                }
                    }
                }
            }
            return {
                state: 'success',
                data: response,
            };
        }
        jQuery.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: location.href,
                type: 'GET',
                isLocal: rlocalProtocol.test(location.protocol),
                global: true,
                processData: true,
                async: true,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                accepts: {
                    '*': allTypes,
                    text: 'text/plain',
                    html: 'text/html',
                    xml: 'application/xml, text/xml',
                    json: 'application/json, text/javascript',
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/,
                },
                responseFields: {
                    xml: 'responseXML',
                    text: 'responseText',
                    json: 'responseJSON',
                },
                converters: {
                    '* text': String,
                    'text html': true,
                    'text json': JSON.parse,
                    'text xml': jQuery.parseXML,
                },
                flatOptions: {
                    url: true,
                    context: true,
                },
            },
            ajaxSetup: function (target, settings) {
                return settings
                    ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
                    : ajaxExtend(jQuery.ajaxSettings, target);
            },
            ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
            ajaxTransport: addToPrefiltersOrTransports(transports),
            ajax: function (url, options) {
                if (typeof url === 'object') {
                    options = url;
                    url = void 0;
                }
                options = options || {};
                var transport,
                    cacheURL,
                    responseHeadersString,
                    responseHeaders,
                    timeoutTimer,
                    urlAnchor,
                    completed,
                    fireGlobals,
                    i,
                    uncached,
                    s = jQuery.ajaxSetup({}, options),
                    callbackContext = s.context || s,
                    globalEventContext =
                        s.context && (callbackContext.nodeType || callbackContext.jquery)
                            ? jQuery(callbackContext)
                            : jQuery.event,
                    deferred = jQuery.Deferred(),
                    completeDeferred = jQuery.Callbacks('once memory'),
                    statusCode = s.statusCode || {},
                    requestHeaders = {},
                    requestHeadersNames = {},
                    strAbort = 'canceled',
                    jqXHR = {
                        readyState: 0,
                        getResponseHeader: function (key) {
                            var match;
                            if (completed) {
                                if (!responseHeaders) {
                                    responseHeaders = {};
                                    while ((match = rheaders.exec(responseHeadersString)))
                                        responseHeaders[match[1].toLowerCase() + ' '] = (
                                            responseHeaders[match[1].toLowerCase() + ' '] || []
                                        ).concat(match[2]);
                                }
                                match = responseHeaders[key.toLowerCase() + ' '];
                            }
                            return match == null ? null : match.join(', ');
                        },
                        getAllResponseHeaders: function () {
                            return completed ? responseHeadersString : null;
                        },
                        setRequestHeader: function (name, value) {
                            if (completed == null) {
                                name = requestHeadersNames[name.toLowerCase()] =
                                    requestHeadersNames[name.toLowerCase()] || name;
                                requestHeaders[name] = value;
                            }
                            return this;
                        },
                        overrideMimeType: function (type) {
                            if (completed == null) s.mimeType = type;
                            return this;
                        },
                        statusCode: function (map) {
                            var code;
                            if (map)
                                if (completed) jqXHR.always(map[jqXHR.status]);
                                else
                                    for (code in map)
                                        statusCode[code] = [statusCode[code], map[code]];
                            return this;
                        },
                        abort: function (statusText) {
                            var finalText = statusText || strAbort;
                            if (transport) transport.abort(finalText);
                            done(0, finalText);
                            return this;
                        },
                    };
                deferred.promise(jqXHR);
                s.url = ((url || s.url || location.href) + '').replace(
                    rprotocol,
                    location.protocol + '//',
                );
                s.type = options.method || options.type || s.method || s.type;
                s.dataTypes = (s.dataType || '*').toLowerCase().match(rnothtmlwhite) || [''];
                if (s.crossDomain == null) {
                    urlAnchor = document.createElement('a');
                    try {
                        urlAnchor.href = s.url;
                        urlAnchor.href = urlAnchor.href;
                        s.crossDomain =
                            originAnchor.protocol + '//' + originAnchor.host !==
                            urlAnchor.protocol + '//' + urlAnchor.host;
                    } catch (e) {
                        s.crossDomain = true;
                    }
                }
                if (s.data && s.processData && typeof s.data !== 'string')
                    s.data = jQuery.param(s.data, s.traditional);
                inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
                if (completed) return jqXHR;
                fireGlobals = jQuery.event && s.global;
                if (fireGlobals && jQuery.active++ === 0) jQuery.event.trigger('ajaxStart');
                s.type = s.type.toUpperCase();
                s.hasContent = !rnoContent.test(s.type);
                cacheURL = s.url.replace(rhash, '');
                if (!s.hasContent) {
                    uncached = s.url.slice(cacheURL.length);
                    if (s.data && (s.processData || typeof s.data === 'string')) {
                        cacheURL += (rquery.test(cacheURL) ? '&' : '?') + s.data;
                        delete s.data;
                    }
                    if (s.cache === false) {
                        cacheURL = cacheURL.replace(rantiCache, '$1');
                        uncached =
                            (rquery.test(cacheURL) ? '&' : '?') + '_=' + nonce.guid++ + uncached;
                    }
                    s.url = cacheURL + uncached;
                } else if (
                    s.data &&
                    s.processData &&
                    (s.contentType || '').indexOf('application/x-www-form-urlencoded') === 0
                )
                    s.data = s.data.replace(r20, '+');
                if (s.ifModified) {
                    if (jQuery.lastModified[cacheURL])
                        jqXHR.setRequestHeader('If-Modified-Since', jQuery.lastModified[cacheURL]);
                    if (jQuery.etag[cacheURL])
                        jqXHR.setRequestHeader('If-None-Match', jQuery.etag[cacheURL]);
                }
                if ((s.data && s.hasContent && s.contentType !== false) || options.contentType)
                    jqXHR.setRequestHeader('Content-Type', s.contentType);
                jqXHR.setRequestHeader(
                    'Accept',
                    s.dataTypes[0] && s.accepts[s.dataTypes[0]]
                        ? s.accepts[s.dataTypes[0]] +
                              (s.dataTypes[0] !== '*' ? ', ' + allTypes + '; q=0.01' : '')
                        : s.accepts['*'],
                );
                for (i in s.headers) jqXHR.setRequestHeader(i, s.headers[i]);
                if (
                    s.beforeSend &&
                    (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)
                )
                    return jqXHR.abort();
                strAbort = 'abort';
                completeDeferred.add(s.complete);
                jqXHR.done(s.success);
                jqXHR.fail(s.error);
                transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
                if (!transport) done(-1, 'No Transport');
                else {
                    jqXHR.readyState = 1;
                    if (fireGlobals) globalEventContext.trigger('ajaxSend', [jqXHR, s]);
                    if (completed) return jqXHR;
                    if (s.async && s.timeout > 0)
                        timeoutTimer = window.setTimeout(function () {
                            jqXHR.abort('timeout');
                        }, s.timeout);
                    try {
                        completed = false;
                        transport.send(requestHeaders, done);
                    } catch (e) {
                        if (completed) throw e;
                        done(-1, e);
                    }
                }
                function done(status, nativeStatusText, responses, headers) {
                    var isSuccess,
                        success,
                        error,
                        response,
                        modified,
                        statusText = nativeStatusText;
                    if (completed) return;
                    completed = true;
                    if (timeoutTimer) window.clearTimeout(timeoutTimer);
                    transport = void 0;
                    responseHeadersString = headers || '';
                    jqXHR.readyState = status > 0 ? 4 : 0;
                    isSuccess = (status >= 200 && status < 300) || status === 304;
                    if (responses) response = ajaxHandleResponses(s, jqXHR, responses);
                    if (
                        !isSuccess &&
                        jQuery.inArray('script', s.dataTypes) > -1 &&
                        jQuery.inArray('json', s.dataTypes) < 0
                    )
                        s.converters['text script'] = function () {};
                    response = ajaxConvert(s, response, jqXHR, isSuccess);
                    if (isSuccess) {
                        if (s.ifModified) {
                            modified = jqXHR.getResponseHeader('Last-Modified');
                            if (modified) jQuery.lastModified[cacheURL] = modified;
                            modified = jqXHR.getResponseHeader('etag');
                            if (modified) jQuery.etag[cacheURL] = modified;
                        }
                        if (status === 204 || s.type === 'HEAD') statusText = 'nocontent';
                        else if (status === 304) statusText = 'notmodified';
                        else {
                            statusText = response.state;
                            success = response.data;
                            error = response.error;
                            isSuccess = !error;
                        }
                    } else {
                        error = statusText;
                        if (status || !statusText) {
                            statusText = 'error';
                            if (status < 0) status = 0;
                        }
                    }
                    jqXHR.status = status;
                    jqXHR.statusText = (nativeStatusText || statusText) + '';
                    if (isSuccess)
                        deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                    else deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                    jqXHR.statusCode(statusCode);
                    statusCode = void 0;
                    if (fireGlobals)
                        globalEventContext.trigger(isSuccess ? 'ajaxSuccess' : 'ajaxError', [
                            jqXHR,
                            s,
                            isSuccess ? success : error,
                        ]);
                    completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
                    if (fireGlobals) {
                        globalEventContext.trigger('ajaxComplete', [jqXHR, s]);
                        if (!--jQuery.active) jQuery.event.trigger('ajaxStop');
                    }
                }
                return jqXHR;
            },
            getJSON: function (url, data, callback) {
                return jQuery.get(url, data, callback, 'json');
            },
            getScript: function (url, callback) {
                return jQuery.get(url, void 0, callback, 'script');
            },
        });
        jQuery.each(['get', 'post'], function (_i, method) {
            jQuery[method] = function (url, data, callback, type) {
                if (isFunction(data)) {
                    type = type || callback;
                    callback = data;
                    data = void 0;
                }
                return jQuery.ajax(
                    jQuery.extend(
                        {
                            url,
                            type: method,
                            dataType: type,
                            data,
                            success: callback,
                        },
                        jQuery.isPlainObject(url) && url,
                    ),
                );
            };
        });
        jQuery.ajaxPrefilter(function (s) {
            var i;
            for (i in s.headers)
                if (i.toLowerCase() === 'content-type') s.contentType = s.headers[i] || '';
        });
        jQuery._evalUrl = function (url, options, doc) {
            return jQuery.ajax({
                url,
                type: 'GET',
                dataType: 'script',
                cache: true,
                async: false,
                global: false,
                converters: {'text script': function () {}},
                dataFilter: function (response) {
                    jQuery.globalEval(response, options, doc);
                },
            });
        };
        jQuery.fn.extend({
            wrapAll: function (html) {
                var wrap;
                if (this[0]) {
                    if (isFunction(html)) html = html.call(this[0]);
                    wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
                    if (this[0].parentNode) wrap.insertBefore(this[0]);
                    wrap.map(function () {
                        var elem = this;
                        while (elem.firstElementChild) elem = elem.firstElementChild;
                        return elem;
                    }).append(this);
                }
                return this;
            },
            wrapInner: function (html) {
                if (isFunction(html))
                    return this.each(function (i) {
                        jQuery(this).wrapInner(html.call(this, i));
                    });
                return this.each(function () {
                    var self = jQuery(this),
                        contents = self.contents();
                    if (contents.length) contents.wrapAll(html);
                    else self.append(html);
                });
            },
            wrap: function (html) {
                var htmlIsFunction = isFunction(html);
                return this.each(function (i) {
                    jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
                });
            },
            unwrap: function (selector) {
                this.parent(selector)
                    .not('body')
                    .each(function () {
                        jQuery(this).replaceWith(this.childNodes);
                    });
                return this;
            },
        });
        jQuery.expr.pseudos.hidden = function (elem) {
            return !jQuery.expr.pseudos.visible(elem);
        };
        jQuery.expr.pseudos.visible = function (elem) {
            return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
        };
        jQuery.ajaxSettings.xhr = function () {
            try {
                return new window.XMLHttpRequest();
            } catch (e) {}
        };
        var xhrSuccessStatus = {
                0: 200,
                1223: 204,
            },
            xhrSupported = jQuery.ajaxSettings.xhr();
        support.cors = !!xhrSupported && 'withCredentials' in xhrSupported;
        support.ajax = xhrSupported = !!xhrSupported;
        jQuery.ajaxTransport(function (options) {
            var callback, errorCallback;
            if (support.cors || (xhrSupported && !options.crossDomain))
                return {
                    send: function (headers, complete) {
                        var i,
                            xhr = options.xhr();
                        xhr.open(
                            options.type,
                            options.url,
                            options.async,
                            options.username,
                            options.password,
                        );
                        if (options.xhrFields)
                            for (i in options.xhrFields) xhr[i] = options.xhrFields[i];
                        if (options.mimeType && xhr.overrideMimeType)
                            xhr.overrideMimeType(options.mimeType);
                        if (!options.crossDomain && !headers['X-Requested-With'])
                            headers['X-Requested-With'] = 'XMLHttpRequest';
                        for (i in headers) xhr.setRequestHeader(i, headers[i]);
                        callback = function (type) {
                            return function () {
                                if (callback) {
                                    callback =
                                        errorCallback =
                                        xhr.onload =
                                        xhr.onerror =
                                        xhr.onabort =
                                        xhr.ontimeout =
                                        xhr.onreadystatechange =
                                            null;
                                    if (type === 'abort') xhr.abort();
                                    else if (type === 'error')
                                        if (typeof xhr.status !== 'number') complete(0, 'error');
                                        else complete(xhr.status, xhr.statusText);
                                    else
                                        complete(
                                            xhrSuccessStatus[xhr.status] || xhr.status,
                                            xhr.statusText,
                                            (xhr.responseType || 'text') !== 'text' ||
                                                typeof xhr.responseText !== 'string'
                                                ? {binary: xhr.response}
                                                : {text: xhr.responseText},
                                            xhr.getAllResponseHeaders(),
                                        );
                                }
                            };
                        };
                        xhr.onload = callback();
                        errorCallback = xhr.onerror = xhr.ontimeout = callback('error');
                        if (xhr.onabort !== void 0) xhr.onabort = errorCallback;
                        else
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4)
                                    window.setTimeout(function () {
                                        if (callback) errorCallback();
                                    });
                            };
                        callback = callback('abort');
                        try {
                            xhr.send((options.hasContent && options.data) || null);
                        } catch (e) {
                            if (callback) throw e;
                        }
                    },
                    abort: function () {
                        if (callback) callback();
                    },
                };
        });
        jQuery.ajaxPrefilter(function (s) {
            if (s.crossDomain) s.contents.script = false;
        });
        jQuery.ajaxSetup({
            accepts: {
                script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
            },
            contents: {script: /\b(?:java|ecma)script\b/},
            converters: {
                'text script': function (text) {
                    jQuery.globalEval(text);
                    return text;
                },
            },
        });
        jQuery.ajaxPrefilter('script', function (s) {
            if (s.cache === void 0) s.cache = false;
            if (s.crossDomain) s.type = 'GET';
        });
        jQuery.ajaxTransport('script', function (s) {
            if (s.crossDomain || s.scriptAttrs) {
                var script, callback;
                return {
                    send: function (_, complete) {
                        script = jQuery('<script>')
                            .attr(s.scriptAttrs || {})
                            .prop({
                                charset: s.scriptCharset,
                                src: s.url,
                            })
                            .on(
                                'load error',
                                (callback = function (evt) {
                                    script.remove();
                                    callback = null;
                                    if (evt) complete(evt.type === 'error' ? 404 : 200, evt.type);
                                }),
                            );
                        document.head.appendChild(script[0]);
                    },
                    abort: function () {
                        if (callback) callback();
                    },
                };
            }
        });
        var oldCallbacks = [],
            rjsonp = /(=)\?(?=&|$)|\?\?/;
        jQuery.ajaxSetup({
            jsonp: 'callback',
            jsonpCallback: function () {
                var callback = oldCallbacks.pop() || jQuery.expando + '_' + nonce.guid++;
                this[callback] = true;
                return callback;
            },
        });
        jQuery.ajaxPrefilter('json jsonp', function (s, originalSettings, jqXHR) {
            var callbackName,
                overwritten,
                responseContainer,
                jsonProp =
                    s.jsonp !== false &&
                    (rjsonp.test(s.url)
                        ? 'url'
                        : typeof s.data === 'string' &&
                          (s.contentType || '').indexOf('application/x-www-form-urlencoded') ===
                              0 &&
                          rjsonp.test(s.data) &&
                          'data');
            if (jsonProp || s.dataTypes[0] === 'jsonp') {
                callbackName = s.jsonpCallback = isFunction(s.jsonpCallback)
                    ? s.jsonpCallback()
                    : s.jsonpCallback;
                if (jsonProp) s[jsonProp] = s[jsonProp].replace(rjsonp, '$1' + callbackName);
                else if (s.jsonp !== false)
                    s.url += (rquery.test(s.url) ? '&' : '?') + s.jsonp + '=' + callbackName;
                s.converters['script json'] = function () {
                    if (!responseContainer) jQuery.error(callbackName + ' was not called');
                    return responseContainer[0];
                };
                s.dataTypes[0] = 'json';
                overwritten = window[callbackName];
                window[callbackName] = function () {
                    responseContainer = arguments;
                };
                jqXHR.always(function () {
                    if (overwritten === void 0) jQuery(window).removeProp(callbackName);
                    else window[callbackName] = overwritten;
                    if (s[callbackName]) {
                        s.jsonpCallback = originalSettings.jsonpCallback;
                        oldCallbacks.push(callbackName);
                    }
                    if (responseContainer && isFunction(overwritten))
                        overwritten(responseContainer[0]);
                    responseContainer = overwritten = void 0;
                });
                return 'script';
            }
        });
        support.createHTMLDocument = (function () {
            var body = document.implementation.createHTMLDocument('').body;
            body.innerHTML = '<form></form><form></form>';
            return body.childNodes.length === 2;
        })();
        jQuery.parseHTML = function (data, context, keepScripts) {
            if (typeof data !== 'string') return [];
            if (typeof context === 'boolean') {
                keepScripts = context;
                context = false;
            }
            var base, parsed, scripts;
            if (!context)
                if (support.createHTMLDocument) {
                    context = document.implementation.createHTMLDocument('');
                    base = context.createElement('base');
                    base.href = document.location.href;
                    context.head.appendChild(base);
                } else context = document;
            parsed = rsingleTag.exec(data);
            scripts = !keepScripts && [];
            if (parsed) return [context.createElement(parsed[1])];
            parsed = buildFragment([data], context, scripts);
            if (scripts && scripts.length) jQuery(scripts).remove();
            return jQuery.merge([], parsed.childNodes);
        };
        /**
         * Load a url into a page
         */
        jQuery.fn.load = function (url, params, callback) {
            var selector,
                type,
                response,
                self = this,
                off = url.indexOf(' ');
            if (off > -1) {
                selector = stripAndCollapse(url.slice(off));
                url = url.slice(0, off);
            }
            if (isFunction(params)) {
                callback = params;
                params = void 0;
            } else if (params && typeof params === 'object') type = 'POST';
            if (self.length > 0)
                jQuery
                    .ajax({
                        url,
                        type: type || 'GET',
                        dataType: 'html',
                        data: params,
                    })
                    .done(function (responseText) {
                        response = arguments;
                        self.html(
                            selector
                                ? jQuery('<div>')
                                      .append(jQuery.parseHTML(responseText))
                                      .find(selector)
                                : responseText,
                        );
                    })
                    .always(
                        callback &&
                            function (jqXHR, status) {
                                self.each(function () {
                                    callback.apply(
                                        this,
                                        response || [jqXHR.responseText, status, jqXHR],
                                    );
                                });
                            },
                    );
            return this;
        };
        jQuery.expr.pseudos.animated = function (elem) {
            return jQuery.grep(jQuery.timers, function (fn) {
                return elem === fn.elem;
            }).length;
        };
        jQuery.offset = {
            setOffset: function (elem, options, i) {
                var curPosition,
                    curLeft,
                    curCSSTop,
                    curTop,
                    curOffset,
                    curCSSLeft,
                    calculatePosition,
                    position = jQuery.css(elem, 'position'),
                    curElem = jQuery(elem),
                    props = {};
                if (position === 'static') elem.style.position = 'relative';
                curOffset = curElem.offset();
                curCSSTop = jQuery.css(elem, 'top');
                curCSSLeft = jQuery.css(elem, 'left');
                calculatePosition =
                    (position === 'absolute' || position === 'fixed') &&
                    (curCSSTop + curCSSLeft).indexOf('auto') > -1;
                if (calculatePosition) {
                    curPosition = curElem.position();
                    curTop = curPosition.top;
                    curLeft = curPosition.left;
                } else {
                    curTop = parseFloat(curCSSTop) || 0;
                    curLeft = parseFloat(curCSSLeft) || 0;
                }
                if (isFunction(options))
                    options = options.call(elem, i, jQuery.extend({}, curOffset));
                if (options.top != null) props.top = options.top - curOffset.top + curTop;
                if (options.left != null) props.left = options.left - curOffset.left + curLeft;
                if ('using' in options) options.using.call(elem, props);
                else curElem.css(props);
            },
        };
        jQuery.fn.extend({
            offset: function (options) {
                if (arguments.length)
                    return options === void 0
                        ? this
                        : this.each(function (i) {
                              jQuery.offset.setOffset(this, options, i);
                          });
                var rect,
                    win,
                    elem = this[0];
                if (!elem) return;
                if (!elem.getClientRects().length)
                    return {
                        top: 0,
                        left: 0,
                    };
                rect = elem.getBoundingClientRect();
                win = elem.ownerDocument.defaultView;
                return {
                    top: rect.top + win.pageYOffset,
                    left: rect.left + win.pageXOffset,
                };
            },
            position: function () {
                if (!this[0]) return;
                var offsetParent,
                    offset,
                    doc,
                    elem = this[0],
                    parentOffset = {
                        top: 0,
                        left: 0,
                    };
                if (jQuery.css(elem, 'position') === 'fixed') offset = elem.getBoundingClientRect();
                else {
                    offset = this.offset();
                    doc = elem.ownerDocument;
                    offsetParent = elem.offsetParent || doc.documentElement;
                    while (
                        offsetParent &&
                        (offsetParent === doc.body || offsetParent === doc.documentElement) &&
                        jQuery.css(offsetParent, 'position') === 'static'
                    )
                        offsetParent = offsetParent.parentNode;
                    if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
                        parentOffset = jQuery(offsetParent).offset();
                        parentOffset.top += jQuery.css(offsetParent, 'borderTopWidth', true);
                        parentOffset.left += jQuery.css(offsetParent, 'borderLeftWidth', true);
                    }
                }
                return {
                    top: offset.top - parentOffset.top - jQuery.css(elem, 'marginTop', true),
                    left: offset.left - parentOffset.left - jQuery.css(elem, 'marginLeft', true),
                };
            },
            offsetParent: function () {
                return this.map(function () {
                    var offsetParent = this.offsetParent;
                    while (offsetParent && jQuery.css(offsetParent, 'position') === 'static')
                        offsetParent = offsetParent.offsetParent;
                    return offsetParent || documentElement;
                });
            },
        });
        jQuery.each(
            {
                scrollLeft: 'pageXOffset',
                scrollTop: 'pageYOffset',
            },
            function (method, prop) {
                var top = 'pageYOffset' === prop;
                jQuery.fn[method] = function (val) {
                    return access(
                        this,
                        function (elem, method, val) {
                            var win;
                            if (isWindow(elem)) win = elem;
                            else if (elem.nodeType === 9) win = elem.defaultView;
                            if (val === void 0) return win ? win[prop] : elem[method];
                            if (win)
                                win.scrollTo(
                                    !top ? val : win.pageXOffset,
                                    top ? val : win.pageYOffset,
                                );
                            else elem[method] = val;
                        },
                        method,
                        val,
                        arguments.length,
                    );
                };
            },
        );
        jQuery.each(['top', 'left'], function (_i, prop) {
            jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
                if (computed) {
                    computed = curCSS(elem, prop);
                    return rnumnonpx.test(computed)
                        ? jQuery(elem).position()[prop] + 'px'
                        : computed;
                }
            });
        });
        jQuery.each(
            {
                Height: 'height',
                Width: 'width',
            },
            function (name, type) {
                jQuery.each(
                    {
                        padding: 'inner' + name,
                        content: type,
                        '': 'outer' + name,
                    },
                    function (defaultExtra, funcName) {
                        jQuery.fn[funcName] = function (margin, value) {
                            var chainable =
                                    arguments.length &&
                                    (defaultExtra || typeof margin !== 'boolean'),
                                extra =
                                    defaultExtra ||
                                    (margin === true || value === true ? 'margin' : 'border');
                            return access(
                                this,
                                function (elem, type, value) {
                                    var doc;
                                    if (isWindow(elem))
                                        return funcName.indexOf('outer') === 0
                                            ? elem['inner' + name]
                                            : elem.document.documentElement['client' + name];
                                    if (elem.nodeType === 9) {
                                        doc = elem.documentElement;
                                        return Math.max(
                                            elem.body['scroll' + name],
                                            doc['scroll' + name],
                                            elem.body['offset' + name],
                                            doc['offset' + name],
                                            doc['client' + name],
                                        );
                                    }
                                    return value === void 0
                                        ? jQuery.css(elem, type, extra)
                                        : jQuery.style(elem, type, value, extra);
                                },
                                type,
                                chainable ? margin : void 0,
                                chainable,
                            );
                        };
                    },
                );
            },
        );
        jQuery.each(
            ['ajaxStart', 'ajaxStop', 'ajaxComplete', 'ajaxError', 'ajaxSuccess', 'ajaxSend'],
            function (_i, type) {
                jQuery.fn[type] = function (fn) {
                    return this.on(type, fn);
                };
            },
        );
        jQuery.fn.extend({
            bind: function (types, data, fn) {
                return this.on(types, null, data, fn);
            },
            unbind: function (types, fn) {
                return this.off(types, null, fn);
            },
            delegate: function (selector, types, data, fn) {
                return this.on(types, selector, data, fn);
            },
            undelegate: function (selector, types, fn) {
                return arguments.length === 1
                    ? this.off(selector, '**')
                    : this.off(types, selector || '**', fn);
            },
            hover: function (fnOver, fnOut) {
                return this.on('mouseenter', fnOver).on('mouseleave', fnOut || fnOver);
            },
        });
        jQuery.each(
            'blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu'.split(
                ' ',
            ),
            function (_i, name) {
                jQuery.fn[name] = function (data, fn) {
                    return arguments.length > 0
                        ? this.on(name, null, data, fn)
                        : this.trigger(name);
                };
            },
        );
        var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
        jQuery.proxy = function (fn, context) {
            var tmp, args, proxy;
            if (typeof context === 'string') {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }
            if (!isFunction(fn)) return;
            args = slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context || this, args.concat(slice.call(arguments)));
            };
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
            return proxy;
        };
        jQuery.holdReady = function (hold) {
            if (hold) jQuery.readyWait++;
            else jQuery.ready(true);
        };
        jQuery.isArray = Array.isArray;
        jQuery.parseJSON = JSON.parse;
        jQuery.nodeName = nodeName;
        jQuery.isFunction = isFunction;
        jQuery.isWindow = isWindow;
        jQuery.camelCase = camelCase;
        jQuery.type = toType;
        jQuery.now = Date.now;
        jQuery.isNumeric = function (obj) {
            var type = jQuery.type(obj);
            return (type === 'number' || type === 'string') && !isNaN(obj - parseFloat(obj));
        };
        jQuery.trim = function (text) {
            return text == null ? '' : (text + '').replace(rtrim, '$1');
        };
        if (typeof define === 'function' && define.amd)
            define('jquery', [], function () {
                return jQuery;
            });
        var _jQuery = window.jQuery,
            _$ = window.$;
        jQuery.noConflict = function (deep) {
            if (window.$ === jQuery) window.$ = _$;
            if (deep && window.jQuery === jQuery) window.jQuery = _jQuery;
            return jQuery;
        };
        if (typeof noGlobal === 'undefined') window.jQuery = window.$ = jQuery;
        return jQuery;
    });
});

//#endregion
//#region ../../node_modules/select2/dist/js/select2.js
var require_select2 = /* @__PURE__ */ __commonJSMin((exports, module) => {
    (function (factory) {
        if (typeof define === 'function' && define.amd) define(['jquery'], factory);
        else if (typeof module === 'object' && module.exports)
            module.exports = function (root, jQuery) {
                if (jQuery === void 0)
                    if (typeof window !== 'undefined') jQuery = require_jquery();
                    else jQuery = require_jquery()(root);
                factory(jQuery);
                return jQuery;
            };
        else factory(jQuery);
    })(function (jQuery) {
        var S2 = (function () {
            if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
                var S2 = jQuery.fn.select2.amd;
            var S2;
            (function () {
                if (!S2 || !S2.requirejs) {
                    if (!S2) S2 = {};
                    else require = S2;
                    /**
                     * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
                     * Released under MIT license, http://github.com/requirejs/almond/LICENSE
                     */
                    var requirejs, require, define;
                    (function (undef) {
                        var main,
                            req,
                            makeMap,
                            handlers,
                            defined = {},
                            waiting = {},
                            config = {},
                            defining = {},
                            hasOwn = Object.prototype.hasOwnProperty,
                            aps = [].slice,
                            jsSuffixRegExp = /\.js$/;
                        function hasProp(obj, prop) {
                            return hasOwn.call(obj, prop);
                        }
                        /**
                         * Given a relative module name, like ./something, normalize it to
                         * a real name that can be mapped to a path.
                         * @param {String} name the relative name
                         * @param {String} baseName a real name that the name arg is relative
                         * to.
                         * @returns {String} normalized name
                         */
                        function normalize(name, baseName) {
                            var nameParts,
                                nameSegment,
                                mapValue,
                                foundMap,
                                lastIndex,
                                foundI,
                                foundStarMap,
                                starI,
                                i,
                                j,
                                part,
                                normalizedBaseParts,
                                baseParts = baseName && baseName.split('/'),
                                map = config.map,
                                starMap = (map && map['*']) || {};
                            if (name) {
                                name = name.split('/');
                                lastIndex = name.length - 1;
                                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex]))
                                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                                if (name[0].charAt(0) === '.' && baseParts) {
                                    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                                    name = normalizedBaseParts.concat(name);
                                }
                                for (i = 0; i < name.length; i++) {
                                    part = name[i];
                                    if (part === '.') {
                                        name.splice(i, 1);
                                        i -= 1;
                                    } else if (part === '..') {
                                        if (
                                            i === 0 ||
                                            (i === 1 && name[2] === '..') ||
                                            name[i - 1] === '..'
                                        )
                                            continue;
                                        else if (i > 0) {
                                            name.splice(i - 1, 2);
                                            i -= 2;
                                        }
                                    }
                                }
                                name = name.join('/');
                            }
                            if ((baseParts || starMap) && map) {
                                nameParts = name.split('/');
                                for (i = nameParts.length; i > 0; i -= 1) {
                                    nameSegment = nameParts.slice(0, i).join('/');
                                    if (baseParts)
                                        for (j = baseParts.length; j > 0; j -= 1) {
                                            mapValue = map[baseParts.slice(0, j).join('/')];
                                            if (mapValue) {
                                                mapValue = mapValue[nameSegment];
                                                if (mapValue) {
                                                    foundMap = mapValue;
                                                    foundI = i;
                                                    break;
                                                }
                                            }
                                        }
                                    if (foundMap) break;
                                    if (!foundStarMap && starMap && starMap[nameSegment]) {
                                        foundStarMap = starMap[nameSegment];
                                        starI = i;
                                    }
                                }
                                if (!foundMap && foundStarMap) {
                                    foundMap = foundStarMap;
                                    foundI = starI;
                                }
                                if (foundMap) {
                                    nameParts.splice(0, foundI, foundMap);
                                    name = nameParts.join('/');
                                }
                            }
                            return name;
                        }
                        function makeRequire(relName, forceSync) {
                            return function () {
                                var args = aps.call(arguments, 0);
                                if (typeof args[0] !== 'string' && args.length === 1)
                                    args.push(null);
                                return req.apply(undef, args.concat([relName, forceSync]));
                            };
                        }
                        function makeNormalize(relName) {
                            return function (name) {
                                return normalize(name, relName);
                            };
                        }
                        function makeLoad(depName) {
                            return function (value) {
                                defined[depName] = value;
                            };
                        }
                        function callDep(name) {
                            if (hasProp(waiting, name)) {
                                var args = waiting[name];
                                delete waiting[name];
                                defining[name] = true;
                                main.apply(undef, args);
                            }
                            if (!hasProp(defined, name) && !hasProp(defining, name))
                                throw new Error('No ' + name);
                            return defined[name];
                        }
                        function splitPrefix(name) {
                            var prefix,
                                index = name ? name.indexOf('!') : -1;
                            if (index > -1) {
                                prefix = name.substring(0, index);
                                name = name.substring(index + 1, name.length);
                            }
                            return [prefix, name];
                        }
                        function makeRelParts(relName) {
                            return relName ? splitPrefix(relName) : [];
                        }
                        /**
                         * Makes a name map, normalizing the name, and using a plugin
                         * for normalization if necessary. Grabs a ref to plugin
                         * too, as an optimization.
                         */
                        makeMap = function (name, relParts) {
                            var plugin,
                                parts = splitPrefix(name),
                                prefix = parts[0],
                                relResourceName = relParts[1];
                            name = parts[1];
                            if (prefix) {
                                prefix = normalize(prefix, relResourceName);
                                plugin = callDep(prefix);
                            }
                            if (prefix)
                                if (plugin && plugin.normalize)
                                    name = plugin.normalize(name, makeNormalize(relResourceName));
                                else name = normalize(name, relResourceName);
                            else {
                                name = normalize(name, relResourceName);
                                parts = splitPrefix(name);
                                prefix = parts[0];
                                name = parts[1];
                                if (prefix) plugin = callDep(prefix);
                            }
                            return {
                                f: prefix ? prefix + '!' + name : name,
                                n: name,
                                pr: prefix,
                                p: plugin,
                            };
                        };
                        function makeConfig(name) {
                            return function () {
                                return (config && config.config && config.config[name]) || {};
                            };
                        }
                        handlers = {
                            require: function (name) {
                                return makeRequire(name);
                            },
                            exports: function (name) {
                                var e = defined[name];
                                if (typeof e !== 'undefined') return e;
                                else return (defined[name] = {});
                            },
                            module: function (name) {
                                return {
                                    id: name,
                                    uri: '',
                                    exports: defined[name],
                                    config: makeConfig(name),
                                };
                            },
                        };
                        main = function (name, deps, callback, relName) {
                            var cjsModule,
                                depName,
                                ret,
                                map,
                                i,
                                relParts,
                                args = [],
                                callbackType = typeof callback,
                                usingExports;
                            relName = relName || name;
                            relParts = makeRelParts(relName);
                            if (callbackType === 'undefined' || callbackType === 'function') {
                                deps =
                                    !deps.length && callback.length
                                        ? ['require', 'exports', 'module']
                                        : deps;
                                for (i = 0; i < deps.length; i += 1) {
                                    map = makeMap(deps[i], relParts);
                                    depName = map.f;
                                    if (depName === 'require') args[i] = handlers.require(name);
                                    else if (depName === 'exports') {
                                        args[i] = handlers.exports(name);
                                        usingExports = true;
                                    } else if (depName === 'module')
                                        cjsModule = args[i] = handlers.module(name);
                                    else if (
                                        hasProp(defined, depName) ||
                                        hasProp(waiting, depName) ||
                                        hasProp(defining, depName)
                                    )
                                        args[i] = callDep(depName);
                                    else if (map.p) {
                                        map.p.load(
                                            map.n,
                                            makeRequire(relName, true),
                                            makeLoad(depName),
                                            {},
                                        );
                                        args[i] = defined[depName];
                                    } else throw new Error(name + ' missing ' + depName);
                                }
                                ret = callback ? callback.apply(defined[name], args) : void 0;
                                if (name) {
                                    if (
                                        cjsModule &&
                                        cjsModule.exports !== undef &&
                                        cjsModule.exports !== defined[name]
                                    )
                                        defined[name] = cjsModule.exports;
                                    else if (ret !== undef || !usingExports) defined[name] = ret;
                                }
                            } else if (name) defined[name] = callback;
                        };
                        requirejs =
                            require =
                            req =
                                function (deps, callback, relName, forceSync, alt) {
                                    if (typeof deps === 'string') {
                                        if (handlers[deps]) return handlers[deps](callback);
                                        return callDep(makeMap(deps, makeRelParts(callback)).f);
                                    } else if (!deps.splice) {
                                        config = deps;
                                        if (config.deps) req(config.deps, config.callback);
                                        if (!callback) return;
                                        if (callback.splice) {
                                            deps = callback;
                                            callback = relName;
                                            relName = null;
                                        } else deps = undef;
                                    }
                                    callback = callback || function () {};
                                    if (typeof relName === 'function') {
                                        relName = forceSync;
                                        forceSync = alt;
                                    }
                                    if (forceSync) main(undef, deps, callback, relName);
                                    else
                                        setTimeout(function () {
                                            main(undef, deps, callback, relName);
                                        }, 4);
                                    return req;
                                };
                        /**
                         * Just drops the config on the floor, but returns req in case
                         * the config return value is used.
                         */
                        req.config = function (cfg) {
                            return req(cfg);
                        };
                        /**
                         * Expose module registry for debugging and tooling
                         */
                        requirejs._defined = defined;
                        define = function (name, deps, callback) {
                            if (typeof name !== 'string')
                                throw new Error(
                                    'See almond README: incorrect module build, no module name',
                                );
                            if (!deps.splice) {
                                callback = deps;
                                deps = [];
                            }
                            if (!hasProp(defined, name) && !hasProp(waiting, name))
                                waiting[name] = [name, deps, callback];
                        };
                        define.amd = {jQuery: true};
                    })();
                    S2.requirejs = requirejs;
                    S2.require = require;
                    S2.define = define;
                }
            })();
            S2.define('almond', function () {});
            S2.define('jquery', [], function () {
                var _$ = jQuery || $;
                if (_$ == null && console && console.error)
                    console.error(
                        'Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page.',
                    );
                return _$;
            });
            S2.define('select2/utils', ['jquery'], function ($) {
                var Utils = {};
                Utils.Extend = function (ChildClass, SuperClass) {
                    var __hasProp = {}.hasOwnProperty;
                    function BaseConstructor() {
                        this.constructor = ChildClass;
                    }
                    for (var key in SuperClass)
                        if (__hasProp.call(SuperClass, key)) ChildClass[key] = SuperClass[key];
                    BaseConstructor.prototype = SuperClass.prototype;
                    ChildClass.prototype = new BaseConstructor();
                    ChildClass.__super__ = SuperClass.prototype;
                    return ChildClass;
                };
                function getMethods(theClass) {
                    var proto = theClass.prototype;
                    var methods = [];
                    for (var methodName in proto) {
                        if (typeof proto[methodName] !== 'function') continue;
                        if (methodName === 'constructor') continue;
                        methods.push(methodName);
                    }
                    return methods;
                }
                Utils.Decorate = function (SuperClass, DecoratorClass) {
                    var decoratedMethods = getMethods(DecoratorClass);
                    var superMethods = getMethods(SuperClass);
                    function DecoratedClass() {
                        var unshift = Array.prototype.unshift;
                        var argCount = DecoratorClass.prototype.constructor.length;
                        var calledConstructor = SuperClass.prototype.constructor;
                        if (argCount > 0) {
                            unshift.call(arguments, SuperClass.prototype.constructor);
                            calledConstructor = DecoratorClass.prototype.constructor;
                        }
                        calledConstructor.apply(this, arguments);
                    }
                    DecoratorClass.displayName = SuperClass.displayName;
                    function ctr() {
                        this.constructor = DecoratedClass;
                    }
                    DecoratedClass.prototype = new ctr();
                    for (var m = 0; m < superMethods.length; m++) {
                        var superMethod = superMethods[m];
                        DecoratedClass.prototype[superMethod] = SuperClass.prototype[superMethod];
                    }
                    var calledMethod = function (methodName) {
                        var originalMethod = function () {};
                        if (methodName in DecoratedClass.prototype)
                            originalMethod = DecoratedClass.prototype[methodName];
                        var decoratedMethod = DecoratorClass.prototype[methodName];
                        return function () {
                            Array.prototype.unshift.call(arguments, originalMethod);
                            return decoratedMethod.apply(this, arguments);
                        };
                    };
                    for (var d = 0; d < decoratedMethods.length; d++) {
                        var decoratedMethod = decoratedMethods[d];
                        DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
                    }
                    return DecoratedClass;
                };
                var Observable = function () {
                    this.listeners = {};
                };
                Observable.prototype.on = function (event, callback) {
                    this.listeners = this.listeners || {};
                    if (event in this.listeners) this.listeners[event].push(callback);
                    else this.listeners[event] = [callback];
                };
                Observable.prototype.trigger = function (event) {
                    var slice = Array.prototype.slice;
                    var params = slice.call(arguments, 1);
                    this.listeners = this.listeners || {};
                    if (params == null) params = [];
                    if (params.length === 0) params.push({});
                    params[0]._type = event;
                    if (event in this.listeners)
                        this.invoke(this.listeners[event], slice.call(arguments, 1));
                    if ('*' in this.listeners) this.invoke(this.listeners['*'], arguments);
                };
                Observable.prototype.invoke = function (listeners, params) {
                    for (var i = 0, len = listeners.length; i < len; i++)
                        listeners[i].apply(this, params);
                };
                Utils.Observable = Observable;
                Utils.generateChars = function (length) {
                    var chars = '';
                    for (var i = 0; i < length; i++) {
                        var randomChar = Math.floor(Math.random() * 36);
                        chars += randomChar.toString(36);
                    }
                    return chars;
                };
                Utils.bind = function (func, context) {
                    return function () {
                        func.apply(context, arguments);
                    };
                };
                Utils._convertData = function (data) {
                    for (var originalKey in data) {
                        var keys = originalKey.split('-');
                        var dataLevel = data;
                        if (keys.length === 1) continue;
                        for (var k = 0; k < keys.length; k++) {
                            var key = keys[k];
                            key = key.substring(0, 1).toLowerCase() + key.substring(1);
                            if (!(key in dataLevel)) dataLevel[key] = {};
                            if (k == keys.length - 1) dataLevel[key] = data[originalKey];
                            dataLevel = dataLevel[key];
                        }
                        delete data[originalKey];
                    }
                    return data;
                };
                Utils.hasScroll = function (index, el) {
                    var $el = $(el);
                    var overflowX = el.style.overflowX;
                    var overflowY = el.style.overflowY;
                    if (
                        overflowX === overflowY &&
                        (overflowY === 'hidden' || overflowY === 'visible')
                    )
                        return false;
                    if (overflowX === 'scroll' || overflowY === 'scroll') return true;
                    return $el.innerHeight() < el.scrollHeight || $el.innerWidth() < el.scrollWidth;
                };
                Utils.escapeMarkup = function (markup) {
                    var replaceMap = {
                        '\\': '&#92;',
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#39;',
                        '/': '&#47;',
                    };
                    if (typeof markup !== 'string') return markup;
                    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
                        return replaceMap[match];
                    });
                };
                Utils.appendMany = function ($element, $nodes) {
                    if ($.fn.jquery.substr(0, 3) === '1.7') {
                        var $jqNodes = $();
                        $.map($nodes, function (node) {
                            $jqNodes = $jqNodes.add(node);
                        });
                        $nodes = $jqNodes;
                    }
                    $element.append($nodes);
                };
                Utils.__cache = {};
                var id = 0;
                Utils.GetUniqueElementId = function (element) {
                    var select2Id = element.getAttribute('data-select2-id');
                    if (select2Id == null)
                        if (element.id) {
                            select2Id = element.id;
                            element.setAttribute('data-select2-id', select2Id);
                        } else {
                            element.setAttribute('data-select2-id', ++id);
                            select2Id = id.toString();
                        }
                    return select2Id;
                };
                Utils.StoreData = function (element, name, value) {
                    var id = Utils.GetUniqueElementId(element);
                    if (!Utils.__cache[id]) Utils.__cache[id] = {};
                    Utils.__cache[id][name] = value;
                };
                Utils.GetData = function (element, name) {
                    var id = Utils.GetUniqueElementId(element);
                    if (name) {
                        if (Utils.__cache[id]) {
                            if (Utils.__cache[id][name] != null) return Utils.__cache[id][name];
                            return $(element).data(name);
                        }
                        return $(element).data(name);
                    } else return Utils.__cache[id];
                };
                Utils.RemoveData = function (element) {
                    var id = Utils.GetUniqueElementId(element);
                    if (Utils.__cache[id] != null) delete Utils.__cache[id];
                    element.removeAttribute('data-select2-id');
                };
                return Utils;
            });
            S2.define('select2/results', ['jquery', './utils'], function ($, Utils) {
                function Results($element, options, dataAdapter) {
                    this.$element = $element;
                    this.data = dataAdapter;
                    this.options = options;
                    Results.__super__.constructor.call(this);
                }
                Utils.Extend(Results, Utils.Observable);
                Results.prototype.render = function () {
                    var $results = $('<ul class="select2-results__options" role="listbox"></ul>');
                    if (this.options.get('multiple')) $results.attr('aria-multiselectable', 'true');
                    this.$results = $results;
                    return $results;
                };
                Results.prototype.clear = function () {
                    this.$results.empty();
                };
                Results.prototype.displayMessage = function (params) {
                    var escapeMarkup = this.options.get('escapeMarkup');
                    this.clear();
                    this.hideLoading();
                    var $message = $(
                        '<li role="alert" aria-live="assertive" class="select2-results__option"></li>',
                    );
                    var message = this.options.get('translations').get(params.message);
                    $message.append(escapeMarkup(message(params.args)));
                    $message[0].className += ' select2-results__message';
                    this.$results.append($message);
                };
                Results.prototype.hideMessages = function () {
                    this.$results.find('.select2-results__message').remove();
                };
                Results.prototype.append = function (data) {
                    this.hideLoading();
                    var $options = [];
                    if (data.results == null || data.results.length === 0) {
                        if (this.$results.children().length === 0)
                            this.trigger('results:message', {message: 'noResults'});
                        return;
                    }
                    data.results = this.sort(data.results);
                    for (var d = 0; d < data.results.length; d++) {
                        var item = data.results[d];
                        var $option = this.option(item);
                        $options.push($option);
                    }
                    this.$results.append($options);
                };
                Results.prototype.position = function ($results, $dropdown) {
                    $dropdown.find('.select2-results').append($results);
                };
                Results.prototype.sort = function (data) {
                    return this.options.get('sorter')(data);
                };
                Results.prototype.highlightFirstItem = function () {
                    var $options = this.$results.find('.select2-results__option[aria-selected]');
                    var $selected = $options.filter('[aria-selected=true]');
                    if ($selected.length > 0) $selected.first().trigger('mouseenter');
                    else $options.first().trigger('mouseenter');
                    this.ensureHighlightVisible();
                };
                Results.prototype.setClasses = function () {
                    var self = this;
                    this.data.current(function (selected) {
                        var selectedIds = $.map(selected, function (s) {
                            return s.id.toString();
                        });
                        self.$results
                            .find('.select2-results__option[aria-selected]')
                            .each(function () {
                                var $option = $(this);
                                var item = Utils.GetData(this, 'data');
                                var id = '' + item.id;
                                if (
                                    (item.element != null && item.element.selected) ||
                                    (item.element == null && $.inArray(id, selectedIds) > -1)
                                )
                                    $option.attr('aria-selected', 'true');
                                else $option.attr('aria-selected', 'false');
                            });
                    });
                };
                Results.prototype.showLoading = function (params) {
                    this.hideLoading();
                    var loading = {
                        disabled: true,
                        loading: true,
                        text: this.options.get('translations').get('searching')(params),
                    };
                    var $loading = this.option(loading);
                    $loading.className += ' loading-results';
                    this.$results.prepend($loading);
                };
                Results.prototype.hideLoading = function () {
                    this.$results.find('.loading-results').remove();
                };
                Results.prototype.option = function (data) {
                    var option = document.createElement('li');
                    option.className = 'select2-results__option';
                    var attrs = {
                        role: 'option',
                        'aria-selected': 'false',
                    };
                    var matches =
                        window.Element.prototype.matches ||
                        window.Element.prototype.msMatchesSelector ||
                        window.Element.prototype.webkitMatchesSelector;
                    if (
                        (data.element != null && matches.call(data.element, ':disabled')) ||
                        (data.element == null && data.disabled)
                    ) {
                        delete attrs['aria-selected'];
                        attrs['aria-disabled'] = 'true';
                    }
                    if (data.id == null) delete attrs['aria-selected'];
                    if (data._resultId != null) option.id = data._resultId;
                    if (data.title) option.title = data.title;
                    if (data.children) {
                        attrs.role = 'group';
                        attrs['aria-label'] = data.text;
                        delete attrs['aria-selected'];
                    }
                    for (var attr in attrs) {
                        var val = attrs[attr];
                        option.setAttribute(attr, val);
                    }
                    if (data.children) {
                        var $option = $(option);
                        var label = document.createElement('strong');
                        label.className = 'select2-results__group';
                        $(label);
                        this.template(data, label);
                        var $children = [];
                        for (var c = 0; c < data.children.length; c++) {
                            var child = data.children[c];
                            var $child = this.option(child);
                            $children.push($child);
                        }
                        var $childrenContainer = $('<ul></ul>', {
                            class: 'select2-results__options select2-results__options--nested',
                        });
                        $childrenContainer.append($children);
                        $option.append(label);
                        $option.append($childrenContainer);
                    } else this.template(data, option);
                    Utils.StoreData(option, 'data', data);
                    return option;
                };
                Results.prototype.bind = function (container, $container) {
                    var self = this;
                    var id = container.id + '-results';
                    this.$results.attr('id', id);
                    container.on('results:all', function (params) {
                        self.clear();
                        self.append(params.data);
                        if (container.isOpen()) {
                            self.setClasses();
                            self.highlightFirstItem();
                        }
                    });
                    container.on('results:append', function (params) {
                        self.append(params.data);
                        if (container.isOpen()) self.setClasses();
                    });
                    container.on('query', function (params) {
                        self.hideMessages();
                        self.showLoading(params);
                    });
                    container.on('select', function () {
                        if (!container.isOpen()) return;
                        self.setClasses();
                        if (self.options.get('scrollAfterSelect')) self.highlightFirstItem();
                    });
                    container.on('unselect', function () {
                        if (!container.isOpen()) return;
                        self.setClasses();
                        if (self.options.get('scrollAfterSelect')) self.highlightFirstItem();
                    });
                    container.on('open', function () {
                        self.$results.attr('aria-expanded', 'true');
                        self.$results.attr('aria-hidden', 'false');
                        self.setClasses();
                        self.ensureHighlightVisible();
                    });
                    container.on('close', function () {
                        self.$results.attr('aria-expanded', 'false');
                        self.$results.attr('aria-hidden', 'true');
                        self.$results.removeAttr('aria-activedescendant');
                    });
                    container.on('results:toggle', function () {
                        var $highlighted = self.getHighlightedResults();
                        if ($highlighted.length === 0) return;
                        $highlighted.trigger('mouseup');
                    });
                    container.on('results:select', function () {
                        var $highlighted = self.getHighlightedResults();
                        if ($highlighted.length === 0) return;
                        var data = Utils.GetData($highlighted[0], 'data');
                        if ($highlighted.attr('aria-selected') == 'true') self.trigger('close', {});
                        else self.trigger('select', {data});
                    });
                    container.on('results:previous', function () {
                        var $highlighted = self.getHighlightedResults();
                        var $options = self.$results.find('[aria-selected]');
                        var currentIndex = $options.index($highlighted);
                        if (currentIndex <= 0) return;
                        var nextIndex = currentIndex - 1;
                        if ($highlighted.length === 0) nextIndex = 0;
                        var $next = $options.eq(nextIndex);
                        $next.trigger('mouseenter');
                        var currentOffset = self.$results.offset().top;
                        var nextTop = $next.offset().top;
                        var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);
                        if (nextIndex === 0) self.$results.scrollTop(0);
                        else if (nextTop - currentOffset < 0) self.$results.scrollTop(nextOffset);
                    });
                    container.on('results:next', function () {
                        var $highlighted = self.getHighlightedResults();
                        var $options = self.$results.find('[aria-selected]');
                        var nextIndex = $options.index($highlighted) + 1;
                        if (nextIndex >= $options.length) return;
                        var $next = $options.eq(nextIndex);
                        $next.trigger('mouseenter');
                        var currentOffset =
                            self.$results.offset().top + self.$results.outerHeight(false);
                        var nextBottom = $next.offset().top + $next.outerHeight(false);
                        var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;
                        if (nextIndex === 0) self.$results.scrollTop(0);
                        else if (nextBottom > currentOffset) self.$results.scrollTop(nextOffset);
                    });
                    container.on('results:focus', function (params) {
                        params.element.addClass('select2-results__option--highlighted');
                    });
                    container.on('results:message', function (params) {
                        self.displayMessage(params);
                    });
                    if ($.fn.mousewheel)
                        this.$results.on('mousewheel', function (e) {
                            var top = self.$results.scrollTop();
                            var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;
                            var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
                            var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();
                            if (isAtTop) {
                                self.$results.scrollTop(0);
                                e.preventDefault();
                                e.stopPropagation();
                            } else if (isAtBottom) {
                                self.$results.scrollTop(
                                    self.$results.get(0).scrollHeight - self.$results.height(),
                                );
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        });
                    this.$results.on(
                        'mouseup',
                        '.select2-results__option[aria-selected]',
                        function (evt) {
                            var $this = $(this);
                            var data = Utils.GetData(this, 'data');
                            if ($this.attr('aria-selected') === 'true') {
                                if (self.options.get('multiple'))
                                    self.trigger('unselect', {
                                        originalEvent: evt,
                                        data,
                                    });
                                else self.trigger('close', {});
                                return;
                            }
                            self.trigger('select', {
                                originalEvent: evt,
                                data,
                            });
                        },
                    );
                    this.$results.on(
                        'mouseenter',
                        '.select2-results__option[aria-selected]',
                        function (evt) {
                            var data = Utils.GetData(this, 'data');
                            self.getHighlightedResults().removeClass(
                                'select2-results__option--highlighted',
                            );
                            self.trigger('results:focus', {
                                data,
                                element: $(this),
                            });
                        },
                    );
                };
                Results.prototype.getHighlightedResults = function () {
                    return this.$results.find('.select2-results__option--highlighted');
                };
                Results.prototype.destroy = function () {
                    this.$results.remove();
                };
                Results.prototype.ensureHighlightVisible = function () {
                    var $highlighted = this.getHighlightedResults();
                    if ($highlighted.length === 0) return;
                    var currentIndex = this.$results.find('[aria-selected]').index($highlighted);
                    var currentOffset = this.$results.offset().top;
                    var nextTop = $highlighted.offset().top;
                    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);
                    var offsetDelta = nextTop - currentOffset;
                    nextOffset -= $highlighted.outerHeight(false) * 2;
                    if (currentIndex <= 2) this.$results.scrollTop(0);
                    else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0)
                        this.$results.scrollTop(nextOffset);
                };
                Results.prototype.template = function (result, container) {
                    var template = this.options.get('templateResult');
                    var escapeMarkup = this.options.get('escapeMarkup');
                    var content = template(result, container);
                    if (content == null) container.style.display = 'none';
                    else if (typeof content === 'string')
                        container.innerHTML = escapeMarkup(content);
                    else $(container).append(content);
                };
                return Results;
            });
            S2.define('select2/keys', [], function () {
                return {
                    BACKSPACE: 8,
                    TAB: 9,
                    ENTER: 13,
                    SHIFT: 16,
                    CTRL: 17,
                    ALT: 18,
                    ESC: 27,
                    SPACE: 32,
                    PAGE_UP: 33,
                    PAGE_DOWN: 34,
                    END: 35,
                    HOME: 36,
                    LEFT: 37,
                    UP: 38,
                    RIGHT: 39,
                    DOWN: 40,
                    DELETE: 46,
                };
            });
            S2.define(
                'select2/selection/base',
                ['jquery', '../utils', '../keys'],
                function ($, Utils, KEYS) {
                    function BaseSelection($element, options) {
                        this.$element = $element;
                        this.options = options;
                        BaseSelection.__super__.constructor.call(this);
                    }
                    Utils.Extend(BaseSelection, Utils.Observable);
                    BaseSelection.prototype.render = function () {
                        var $selection = $(
                            '<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>',
                        );
                        this._tabindex = 0;
                        if (Utils.GetData(this.$element[0], 'old-tabindex') != null)
                            this._tabindex = Utils.GetData(this.$element[0], 'old-tabindex');
                        else if (this.$element.attr('tabindex') != null)
                            this._tabindex = this.$element.attr('tabindex');
                        $selection.attr('title', this.$element.attr('title'));
                        $selection.attr('tabindex', this._tabindex);
                        $selection.attr('aria-disabled', 'false');
                        this.$selection = $selection;
                        return $selection;
                    };
                    BaseSelection.prototype.bind = function (container, $container) {
                        var self = this;
                        var resultsId = container.id + '-results';
                        this.container = container;
                        this.$selection.on('focus', function (evt) {
                            self.trigger('focus', evt);
                        });
                        this.$selection.on('blur', function (evt) {
                            self._handleBlur(evt);
                        });
                        this.$selection.on('keydown', function (evt) {
                            self.trigger('keypress', evt);
                            if (evt.which === KEYS.SPACE) evt.preventDefault();
                        });
                        container.on('results:focus', function (params) {
                            self.$selection.attr('aria-activedescendant', params.data._resultId);
                        });
                        container.on('selection:update', function (params) {
                            self.update(params.data);
                        });
                        container.on('open', function () {
                            self.$selection.attr('aria-expanded', 'true');
                            self.$selection.attr('aria-owns', resultsId);
                            self._attachCloseHandler(container);
                        });
                        container.on('close', function () {
                            self.$selection.attr('aria-expanded', 'false');
                            self.$selection.removeAttr('aria-activedescendant');
                            self.$selection.removeAttr('aria-owns');
                            self.$selection.trigger('focus');
                            self._detachCloseHandler(container);
                        });
                        container.on('enable', function () {
                            self.$selection.attr('tabindex', self._tabindex);
                            self.$selection.attr('aria-disabled', 'false');
                        });
                        container.on('disable', function () {
                            self.$selection.attr('tabindex', '-1');
                            self.$selection.attr('aria-disabled', 'true');
                        });
                    };
                    BaseSelection.prototype._handleBlur = function (evt) {
                        var self = this;
                        window.setTimeout(function () {
                            if (
                                document.activeElement == self.$selection[0] ||
                                $.contains(self.$selection[0], document.activeElement)
                            )
                                return;
                            self.trigger('blur', evt);
                        }, 1);
                    };
                    BaseSelection.prototype._attachCloseHandler = function (container) {
                        $(document.body).on('mousedown.select2.' + container.id, function (e) {
                            var $select = $(e.target).closest('.select2');
                            $('.select2.select2-container--open').each(function () {
                                if (this == $select[0]) return;
                                Utils.GetData(this, 'element').select2('close');
                            });
                        });
                    };
                    BaseSelection.prototype._detachCloseHandler = function (container) {
                        $(document.body).off('mousedown.select2.' + container.id);
                    };
                    BaseSelection.prototype.position = function ($selection, $container) {
                        $container.find('.selection').append($selection);
                    };
                    BaseSelection.prototype.destroy = function () {
                        this._detachCloseHandler(this.container);
                    };
                    BaseSelection.prototype.update = function (data) {
                        throw new Error('The `update` method must be defined in child classes.');
                    };
                    /**
                     * Helper method to abstract the "enabled" (not "disabled") state of this
                     * object.
                     *
                     * @return {true} if the instance is not disabled.
                     * @return {false} if the instance is disabled.
                     */
                    BaseSelection.prototype.isEnabled = function () {
                        return !this.isDisabled();
                    };
                    /**
                     * Helper method to abstract the "disabled" state of this object.
                     *
                     * @return {true} if the disabled option is true.
                     * @return {false} if the disabled option is false.
                     */
                    BaseSelection.prototype.isDisabled = function () {
                        return this.options.get('disabled');
                    };
                    return BaseSelection;
                },
            );
            S2.define(
                'select2/selection/single',
                ['jquery', './base', '../utils', '../keys'],
                function ($, BaseSelection, Utils, KEYS) {
                    function SingleSelection() {
                        SingleSelection.__super__.constructor.apply(this, arguments);
                    }
                    Utils.Extend(SingleSelection, BaseSelection);
                    SingleSelection.prototype.render = function () {
                        var $selection = SingleSelection.__super__.render.call(this);
                        $selection.addClass('select2-selection--single');
                        $selection.html(
                            '<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>',
                        );
                        return $selection;
                    };
                    SingleSelection.prototype.bind = function (container, $container) {
                        var self = this;
                        SingleSelection.__super__.bind.apply(this, arguments);
                        var id = container.id + '-container';
                        this.$selection
                            .find('.select2-selection__rendered')
                            .attr('id', id)
                            .attr('role', 'textbox')
                            .attr('aria-readonly', 'true');
                        this.$selection.attr('aria-labelledby', id);
                        this.$selection.on('mousedown', function (evt) {
                            if (evt.which !== 1) return;
                            self.trigger('toggle', {originalEvent: evt});
                        });
                        this.$selection.on('focus', function (evt) {});
                        this.$selection.on('blur', function (evt) {});
                        container.on('focus', function (evt) {
                            if (!container.isOpen()) self.$selection.trigger('focus');
                        });
                    };
                    SingleSelection.prototype.clear = function () {
                        var $rendered = this.$selection.find('.select2-selection__rendered');
                        $rendered.empty();
                        $rendered.removeAttr('title');
                    };
                    SingleSelection.prototype.display = function (data, container) {
                        var template = this.options.get('templateSelection');
                        return this.options.get('escapeMarkup')(template(data, container));
                    };
                    SingleSelection.prototype.selectionContainer = function () {
                        return $('<span></span>');
                    };
                    SingleSelection.prototype.update = function (data) {
                        if (data.length === 0) {
                            this.clear();
                            return;
                        }
                        var selection = data[0];
                        var $rendered = this.$selection.find('.select2-selection__rendered');
                        var formatted = this.display(selection, $rendered);
                        $rendered.empty().append(formatted);
                        var title = selection.title || selection.text;
                        if (title) $rendered.attr('title', title);
                        else $rendered.removeAttr('title');
                    };
                    return SingleSelection;
                },
            );
            S2.define(
                'select2/selection/multiple',
                ['jquery', './base', '../utils'],
                function ($, BaseSelection, Utils) {
                    function MultipleSelection($element, options) {
                        MultipleSelection.__super__.constructor.apply(this, arguments);
                    }
                    Utils.Extend(MultipleSelection, BaseSelection);
                    MultipleSelection.prototype.render = function () {
                        var $selection = MultipleSelection.__super__.render.call(this);
                        $selection.addClass('select2-selection--multiple');
                        $selection.html('<ul class="select2-selection__rendered"></ul>');
                        return $selection;
                    };
                    MultipleSelection.prototype.bind = function (container, $container) {
                        var self = this;
                        MultipleSelection.__super__.bind.apply(this, arguments);
                        this.$selection.on('click', function (evt) {
                            self.trigger('toggle', {originalEvent: evt});
                        });
                        this.$selection.on(
                            'click',
                            '.select2-selection__choice__remove',
                            function (evt) {
                                if (self.isDisabled()) return;
                                var $selection = $(this).parent();
                                var data = Utils.GetData($selection[0], 'data');
                                self.trigger('unselect', {
                                    originalEvent: evt,
                                    data,
                                });
                            },
                        );
                    };
                    MultipleSelection.prototype.clear = function () {
                        var $rendered = this.$selection.find('.select2-selection__rendered');
                        $rendered.empty();
                        $rendered.removeAttr('title');
                    };
                    MultipleSelection.prototype.display = function (data, container) {
                        var template = this.options.get('templateSelection');
                        return this.options.get('escapeMarkup')(template(data, container));
                    };
                    MultipleSelection.prototype.selectionContainer = function () {
                        return $(
                            '<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>',
                        );
                    };
                    MultipleSelection.prototype.update = function (data) {
                        this.clear();
                        if (data.length === 0) return;
                        var $selections = [];
                        for (var d = 0; d < data.length; d++) {
                            var selection = data[d];
                            var $selection = this.selectionContainer();
                            var formatted = this.display(selection, $selection);
                            $selection.append(formatted);
                            var title = selection.title || selection.text;
                            if (title) $selection.attr('title', title);
                            Utils.StoreData($selection[0], 'data', selection);
                            $selections.push($selection);
                        }
                        var $rendered = this.$selection.find('.select2-selection__rendered');
                        Utils.appendMany($rendered, $selections);
                    };
                    return MultipleSelection;
                },
            );
            S2.define('select2/selection/placeholder', ['../utils'], function (Utils) {
                function Placeholder(decorated, $element, options) {
                    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));
                    decorated.call(this, $element, options);
                }
                Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
                    if (typeof placeholder === 'string')
                        placeholder = {
                            id: '',
                            text: placeholder,
                        };
                    return placeholder;
                };
                Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
                    var $placeholder = this.selectionContainer();
                    $placeholder.html(this.display(placeholder));
                    $placeholder
                        .addClass('select2-selection__placeholder')
                        .removeClass('select2-selection__choice');
                    return $placeholder;
                };
                Placeholder.prototype.update = function (decorated, data) {
                    var singlePlaceholder = data.length == 1 && data[0].id != this.placeholder.id;
                    if (data.length > 1 || singlePlaceholder) return decorated.call(this, data);
                    this.clear();
                    var $placeholder = this.createPlaceholder(this.placeholder);
                    this.$selection.find('.select2-selection__rendered').append($placeholder);
                };
                return Placeholder;
            });
            S2.define(
                'select2/selection/allowClear',
                ['jquery', '../keys', '../utils'],
                function ($, KEYS, Utils) {
                    function AllowClear() {}
                    AllowClear.prototype.bind = function (decorated, container, $container) {
                        var self = this;
                        decorated.call(this, container, $container);
                        if (this.placeholder == null) {
                            if (this.options.get('debug') && window.console && console.error)
                                console.error(
                                    'Select2: The `allowClear` option should be used in combination with the `placeholder` option.',
                                );
                        }
                        this.$selection.on(
                            'mousedown',
                            '.select2-selection__clear',
                            function (evt) {
                                self._handleClear(evt);
                            },
                        );
                        container.on('keypress', function (evt) {
                            self._handleKeyboardClear(evt, container);
                        });
                    };
                    AllowClear.prototype._handleClear = function (_, evt) {
                        if (this.isDisabled()) return;
                        var $clear = this.$selection.find('.select2-selection__clear');
                        if ($clear.length === 0) return;
                        evt.stopPropagation();
                        var data = Utils.GetData($clear[0], 'data');
                        var previousVal = this.$element.val();
                        this.$element.val(this.placeholder.id);
                        var unselectData = {data};
                        this.trigger('clear', unselectData);
                        if (unselectData.prevented) {
                            this.$element.val(previousVal);
                            return;
                        }
                        for (var d = 0; d < data.length; d++) {
                            unselectData = {data: data[d]};
                            this.trigger('unselect', unselectData);
                            if (unselectData.prevented) {
                                this.$element.val(previousVal);
                                return;
                            }
                        }
                        this.$element.trigger('input').trigger('change');
                        this.trigger('toggle', {});
                    };
                    AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
                        if (container.isOpen()) return;
                        if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE)
                            this._handleClear(evt);
                    };
                    AllowClear.prototype.update = function (decorated, data) {
                        decorated.call(this, data);
                        if (
                            this.$selection.find('.select2-selection__placeholder').length > 0 ||
                            data.length === 0
                        )
                            return;
                        var $remove = $(
                            '<span class="select2-selection__clear" title="' +
                                this.options.get('translations').get('removeAllItems')() +
                                '">&times;</span>',
                        );
                        Utils.StoreData($remove[0], 'data', data);
                        this.$selection.find('.select2-selection__rendered').prepend($remove);
                    };
                    return AllowClear;
                },
            );
            S2.define(
                'select2/selection/search',
                ['jquery', '../utils', '../keys'],
                function ($, Utils, KEYS) {
                    function Search(decorated, $element, options) {
                        decorated.call(this, $element, options);
                    }
                    Search.prototype.render = function (decorated) {
                        var $search = $(
                            '<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></li>',
                        );
                        this.$searchContainer = $search;
                        this.$search = $search.find('input');
                        var $rendered = decorated.call(this);
                        this._transferTabIndex();
                        return $rendered;
                    };
                    Search.prototype.bind = function (decorated, container, $container) {
                        var self = this;
                        var resultsId = container.id + '-results';
                        decorated.call(this, container, $container);
                        container.on('open', function () {
                            self.$search.attr('aria-controls', resultsId);
                            self.$search.trigger('focus');
                        });
                        container.on('close', function () {
                            self.$search.val('');
                            self.$search.removeAttr('aria-controls');
                            self.$search.removeAttr('aria-activedescendant');
                            self.$search.trigger('focus');
                        });
                        container.on('enable', function () {
                            self.$search.prop('disabled', false);
                            self._transferTabIndex();
                        });
                        container.on('disable', function () {
                            self.$search.prop('disabled', true);
                        });
                        container.on('focus', function (evt) {
                            self.$search.trigger('focus');
                        });
                        container.on('results:focus', function (params) {
                            if (params.data._resultId)
                                self.$search.attr('aria-activedescendant', params.data._resultId);
                            else self.$search.removeAttr('aria-activedescendant');
                        });
                        this.$selection.on('focusin', '.select2-search--inline', function (evt) {
                            self.trigger('focus', evt);
                        });
                        this.$selection.on('focusout', '.select2-search--inline', function (evt) {
                            self._handleBlur(evt);
                        });
                        this.$selection.on('keydown', '.select2-search--inline', function (evt) {
                            evt.stopPropagation();
                            self.trigger('keypress', evt);
                            self._keyUpPrevented = evt.isDefaultPrevented();
                            if (evt.which === KEYS.BACKSPACE && self.$search.val() === '') {
                                var $previousChoice = self.$searchContainer.prev(
                                    '.select2-selection__choice',
                                );
                                if ($previousChoice.length > 0) {
                                    var item = Utils.GetData($previousChoice[0], 'data');
                                    self.searchRemoveChoice(item);
                                    evt.preventDefault();
                                }
                            }
                        });
                        this.$selection.on('click', '.select2-search--inline', function (evt) {
                            if (self.$search.val()) evt.stopPropagation();
                        });
                        var msie = document.documentMode;
                        var disableInputEvents = msie && msie <= 11;
                        this.$selection.on(
                            'input.searchcheck',
                            '.select2-search--inline',
                            function (evt) {
                                if (disableInputEvents) {
                                    self.$selection.off('input.search input.searchcheck');
                                    return;
                                }
                                self.$selection.off('keyup.search');
                            },
                        );
                        this.$selection.on(
                            'keyup.search input.search',
                            '.select2-search--inline',
                            function (evt) {
                                if (disableInputEvents && evt.type === 'input') {
                                    self.$selection.off('input.search input.searchcheck');
                                    return;
                                }
                                var key = evt.which;
                                if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT)
                                    return;
                                if (key == KEYS.TAB) return;
                                self.handleSearch(evt);
                            },
                        );
                    };
                    /**
                     * This method will transfer the tabindex attribute from the rendered
                     * selection to the search box. This allows for the search box to be used as
                     * the primary focus instead of the selection container.
                     *
                     * @private
                     */
                    Search.prototype._transferTabIndex = function (decorated) {
                        this.$search.attr('tabindex', this.$selection.attr('tabindex'));
                        this.$selection.attr('tabindex', '-1');
                    };
                    Search.prototype.createPlaceholder = function (decorated, placeholder) {
                        this.$search.attr('placeholder', placeholder.text);
                    };
                    Search.prototype.update = function (decorated, data) {
                        var searchHadFocus = this.$search[0] == document.activeElement;
                        this.$search.attr('placeholder', '');
                        decorated.call(this, data);
                        this.$selection
                            .find('.select2-selection__rendered')
                            .append(this.$searchContainer);
                        this.resizeSearch();
                        if (searchHadFocus) this.$search.trigger('focus');
                    };
                    Search.prototype.handleSearch = function () {
                        this.resizeSearch();
                        if (!this._keyUpPrevented) {
                            var input = this.$search.val();
                            this.trigger('query', {term: input});
                        }
                        this._keyUpPrevented = false;
                    };
                    Search.prototype.searchRemoveChoice = function (decorated, item) {
                        this.trigger('unselect', {data: item});
                        this.$search.val(item.text);
                        this.handleSearch();
                    };
                    Search.prototype.resizeSearch = function () {
                        this.$search.css('width', '25px');
                        var width = '';
                        if (this.$search.attr('placeholder') !== '')
                            width = this.$selection.find('.select2-selection__rendered').width();
                        else width = (this.$search.val().length + 1) * 0.75 + 'em';
                        this.$search.css('width', width);
                    };
                    return Search;
                },
            );
            S2.define('select2/selection/eventRelay', ['jquery'], function ($) {
                function EventRelay() {}
                EventRelay.prototype.bind = function (decorated, container, $container) {
                    var self = this;
                    var relayEvents = [
                        'open',
                        'opening',
                        'close',
                        'closing',
                        'select',
                        'selecting',
                        'unselect',
                        'unselecting',
                        'clear',
                        'clearing',
                    ];
                    var preventableEvents = [
                        'opening',
                        'closing',
                        'selecting',
                        'unselecting',
                        'clearing',
                    ];
                    decorated.call(this, container, $container);
                    container.on('*', function (name, params) {
                        if ($.inArray(name, relayEvents) === -1) return;
                        params = params || {};
                        var evt = $.Event('select2:' + name, {params});
                        self.$element.trigger(evt);
                        if ($.inArray(name, preventableEvents) === -1) return;
                        params.prevented = evt.isDefaultPrevented();
                    });
                };
                return EventRelay;
            });
            S2.define('select2/translation', ['jquery', 'require'], function ($, require) {
                function Translation(dict) {
                    this.dict = dict || {};
                }
                Translation.prototype.all = function () {
                    return this.dict;
                };
                Translation.prototype.get = function (key) {
                    return this.dict[key];
                };
                Translation.prototype.extend = function (translation) {
                    this.dict = $.extend({}, translation.all(), this.dict);
                };
                Translation._cache = {};
                Translation.loadPath = function (path) {
                    if (!(path in Translation._cache)) {
                        var translations = require(path);
                        Translation._cache[path] = translations;
                    }
                    return new Translation(Translation._cache[path]);
                };
                return Translation;
            });
            S2.define('select2/diacritics', [], function () {
                return {
                    'Ⓐ': 'A',
                    Ａ: 'A',
                    À: 'A',
                    Á: 'A',
                    Â: 'A',
                    Ầ: 'A',
                    Ấ: 'A',
                    Ẫ: 'A',
                    Ẩ: 'A',
                    Ã: 'A',
                    Ā: 'A',
                    Ă: 'A',
                    Ằ: 'A',
                    Ắ: 'A',
                    Ẵ: 'A',
                    Ẳ: 'A',
                    Ȧ: 'A',
                    Ǡ: 'A',
                    Ä: 'A',
                    Ǟ: 'A',
                    Ả: 'A',
                    Å: 'A',
                    Ǻ: 'A',
                    Ǎ: 'A',
                    Ȁ: 'A',
                    Ȃ: 'A',
                    Ạ: 'A',
                    Ậ: 'A',
                    Ặ: 'A',
                    Ḁ: 'A',
                    Ą: 'A',
                    Ⱥ: 'A',
                    Ɐ: 'A',
                    Ꜳ: 'AA',
                    Æ: 'AE',
                    Ǽ: 'AE',
                    Ǣ: 'AE',
                    Ꜵ: 'AO',
                    Ꜷ: 'AU',
                    Ꜹ: 'AV',
                    Ꜻ: 'AV',
                    Ꜽ: 'AY',
                    'Ⓑ': 'B',
                    Ｂ: 'B',
                    Ḃ: 'B',
                    Ḅ: 'B',
                    Ḇ: 'B',
                    Ƀ: 'B',
                    Ƃ: 'B',
                    Ɓ: 'B',
                    'Ⓒ': 'C',
                    Ｃ: 'C',
                    Ć: 'C',
                    Ĉ: 'C',
                    Ċ: 'C',
                    Č: 'C',
                    Ç: 'C',
                    Ḉ: 'C',
                    Ƈ: 'C',
                    Ȼ: 'C',
                    Ꜿ: 'C',
                    'Ⓓ': 'D',
                    Ｄ: 'D',
                    Ḋ: 'D',
                    Ď: 'D',
                    Ḍ: 'D',
                    Ḑ: 'D',
                    Ḓ: 'D',
                    Ḏ: 'D',
                    Đ: 'D',
                    Ƌ: 'D',
                    Ɗ: 'D',
                    Ɖ: 'D',
                    Ꝺ: 'D',
                    Ǳ: 'DZ',
                    Ǆ: 'DZ',
                    ǲ: 'Dz',
                    ǅ: 'Dz',
                    'Ⓔ': 'E',
                    Ｅ: 'E',
                    È: 'E',
                    É: 'E',
                    Ê: 'E',
                    Ề: 'E',
                    Ế: 'E',
                    Ễ: 'E',
                    Ể: 'E',
                    Ẽ: 'E',
                    Ē: 'E',
                    Ḕ: 'E',
                    Ḗ: 'E',
                    Ĕ: 'E',
                    Ė: 'E',
                    Ë: 'E',
                    Ẻ: 'E',
                    Ě: 'E',
                    Ȅ: 'E',
                    Ȇ: 'E',
                    Ẹ: 'E',
                    Ệ: 'E',
                    Ȩ: 'E',
                    Ḝ: 'E',
                    Ę: 'E',
                    Ḙ: 'E',
                    Ḛ: 'E',
                    Ɛ: 'E',
                    Ǝ: 'E',
                    'Ⓕ': 'F',
                    Ｆ: 'F',
                    Ḟ: 'F',
                    Ƒ: 'F',
                    Ꝼ: 'F',
                    'Ⓖ': 'G',
                    Ｇ: 'G',
                    Ǵ: 'G',
                    Ĝ: 'G',
                    Ḡ: 'G',
                    Ğ: 'G',
                    Ġ: 'G',
                    Ǧ: 'G',
                    Ģ: 'G',
                    Ǥ: 'G',
                    Ɠ: 'G',
                    Ꞡ: 'G',
                    Ᵹ: 'G',
                    Ꝿ: 'G',
                    'Ⓗ': 'H',
                    Ｈ: 'H',
                    Ĥ: 'H',
                    Ḣ: 'H',
                    Ḧ: 'H',
                    Ȟ: 'H',
                    Ḥ: 'H',
                    Ḩ: 'H',
                    Ḫ: 'H',
                    Ħ: 'H',
                    Ⱨ: 'H',
                    Ⱶ: 'H',
                    Ɥ: 'H',
                    'Ⓘ': 'I',
                    Ｉ: 'I',
                    Ì: 'I',
                    Í: 'I',
                    Î: 'I',
                    Ĩ: 'I',
                    Ī: 'I',
                    Ĭ: 'I',
                    İ: 'I',
                    Ï: 'I',
                    Ḯ: 'I',
                    Ỉ: 'I',
                    Ǐ: 'I',
                    Ȉ: 'I',
                    Ȋ: 'I',
                    Ị: 'I',
                    Į: 'I',
                    Ḭ: 'I',
                    Ɨ: 'I',
                    'Ⓙ': 'J',
                    Ｊ: 'J',
                    Ĵ: 'J',
                    Ɉ: 'J',
                    'Ⓚ': 'K',
                    Ｋ: 'K',
                    Ḱ: 'K',
                    Ǩ: 'K',
                    Ḳ: 'K',
                    Ķ: 'K',
                    Ḵ: 'K',
                    Ƙ: 'K',
                    Ⱪ: 'K',
                    Ꝁ: 'K',
                    Ꝃ: 'K',
                    Ꝅ: 'K',
                    Ꞣ: 'K',
                    'Ⓛ': 'L',
                    Ｌ: 'L',
                    Ŀ: 'L',
                    Ĺ: 'L',
                    Ľ: 'L',
                    Ḷ: 'L',
                    Ḹ: 'L',
                    Ļ: 'L',
                    Ḽ: 'L',
                    Ḻ: 'L',
                    Ł: 'L',
                    Ƚ: 'L',
                    Ɫ: 'L',
                    Ⱡ: 'L',
                    Ꝉ: 'L',
                    Ꝇ: 'L',
                    Ꞁ: 'L',
                    Ǉ: 'LJ',
                    ǈ: 'Lj',
                    'Ⓜ': 'M',
                    Ｍ: 'M',
                    Ḿ: 'M',
                    Ṁ: 'M',
                    Ṃ: 'M',
                    Ɱ: 'M',
                    Ɯ: 'M',
                    'Ⓝ': 'N',
                    Ｎ: 'N',
                    Ǹ: 'N',
                    Ń: 'N',
                    Ñ: 'N',
                    Ṅ: 'N',
                    Ň: 'N',
                    Ṇ: 'N',
                    Ņ: 'N',
                    Ṋ: 'N',
                    Ṉ: 'N',
                    Ƞ: 'N',
                    Ɲ: 'N',
                    Ꞑ: 'N',
                    Ꞥ: 'N',
                    Ǌ: 'NJ',
                    ǋ: 'Nj',
                    'Ⓞ': 'O',
                    Ｏ: 'O',
                    Ò: 'O',
                    Ó: 'O',
                    Ô: 'O',
                    Ồ: 'O',
                    Ố: 'O',
                    Ỗ: 'O',
                    Ổ: 'O',
                    Õ: 'O',
                    Ṍ: 'O',
                    Ȭ: 'O',
                    Ṏ: 'O',
                    Ō: 'O',
                    Ṑ: 'O',
                    Ṓ: 'O',
                    Ŏ: 'O',
                    Ȯ: 'O',
                    Ȱ: 'O',
                    Ö: 'O',
                    Ȫ: 'O',
                    Ỏ: 'O',
                    Ő: 'O',
                    Ǒ: 'O',
                    Ȍ: 'O',
                    Ȏ: 'O',
                    Ơ: 'O',
                    Ờ: 'O',
                    Ớ: 'O',
                    Ỡ: 'O',
                    Ở: 'O',
                    Ợ: 'O',
                    Ọ: 'O',
                    Ộ: 'O',
                    Ǫ: 'O',
                    Ǭ: 'O',
                    Ø: 'O',
                    Ǿ: 'O',
                    Ɔ: 'O',
                    Ɵ: 'O',
                    Ꝋ: 'O',
                    Ꝍ: 'O',
                    Œ: 'OE',
                    Ƣ: 'OI',
                    Ꝏ: 'OO',
                    Ȣ: 'OU',
                    'Ⓟ': 'P',
                    Ｐ: 'P',
                    Ṕ: 'P',
                    Ṗ: 'P',
                    Ƥ: 'P',
                    Ᵽ: 'P',
                    Ꝑ: 'P',
                    Ꝓ: 'P',
                    Ꝕ: 'P',
                    'Ⓠ': 'Q',
                    Ｑ: 'Q',
                    Ꝗ: 'Q',
                    Ꝙ: 'Q',
                    Ɋ: 'Q',
                    'Ⓡ': 'R',
                    Ｒ: 'R',
                    Ŕ: 'R',
                    Ṙ: 'R',
                    Ř: 'R',
                    Ȑ: 'R',
                    Ȓ: 'R',
                    Ṛ: 'R',
                    Ṝ: 'R',
                    Ŗ: 'R',
                    Ṟ: 'R',
                    Ɍ: 'R',
                    Ɽ: 'R',
                    Ꝛ: 'R',
                    Ꞧ: 'R',
                    Ꞃ: 'R',
                    'Ⓢ': 'S',
                    Ｓ: 'S',
                    ẞ: 'S',
                    Ś: 'S',
                    Ṥ: 'S',
                    Ŝ: 'S',
                    Ṡ: 'S',
                    Š: 'S',
                    Ṧ: 'S',
                    Ṣ: 'S',
                    Ṩ: 'S',
                    Ș: 'S',
                    Ş: 'S',
                    Ȿ: 'S',
                    Ꞩ: 'S',
                    Ꞅ: 'S',
                    'Ⓣ': 'T',
                    Ｔ: 'T',
                    Ṫ: 'T',
                    Ť: 'T',
                    Ṭ: 'T',
                    Ț: 'T',
                    Ţ: 'T',
                    Ṱ: 'T',
                    Ṯ: 'T',
                    Ŧ: 'T',
                    Ƭ: 'T',
                    Ʈ: 'T',
                    Ⱦ: 'T',
                    Ꞇ: 'T',
                    Ꜩ: 'TZ',
                    'Ⓤ': 'U',
                    Ｕ: 'U',
                    Ù: 'U',
                    Ú: 'U',
                    Û: 'U',
                    Ũ: 'U',
                    Ṹ: 'U',
                    Ū: 'U',
                    Ṻ: 'U',
                    Ŭ: 'U',
                    Ü: 'U',
                    Ǜ: 'U',
                    Ǘ: 'U',
                    Ǖ: 'U',
                    Ǚ: 'U',
                    Ủ: 'U',
                    Ů: 'U',
                    Ű: 'U',
                    Ǔ: 'U',
                    Ȕ: 'U',
                    Ȗ: 'U',
                    Ư: 'U',
                    Ừ: 'U',
                    Ứ: 'U',
                    Ữ: 'U',
                    Ử: 'U',
                    Ự: 'U',
                    Ụ: 'U',
                    Ṳ: 'U',
                    Ų: 'U',
                    Ṷ: 'U',
                    Ṵ: 'U',
                    Ʉ: 'U',
                    'Ⓥ': 'V',
                    Ｖ: 'V',
                    Ṽ: 'V',
                    Ṿ: 'V',
                    Ʋ: 'V',
                    Ꝟ: 'V',
                    Ʌ: 'V',
                    Ꝡ: 'VY',
                    'Ⓦ': 'W',
                    Ｗ: 'W',
                    Ẁ: 'W',
                    Ẃ: 'W',
                    Ŵ: 'W',
                    Ẇ: 'W',
                    Ẅ: 'W',
                    Ẉ: 'W',
                    Ⱳ: 'W',
                    'Ⓧ': 'X',
                    Ｘ: 'X',
                    Ẋ: 'X',
                    Ẍ: 'X',
                    'Ⓨ': 'Y',
                    Ｙ: 'Y',
                    Ỳ: 'Y',
                    Ý: 'Y',
                    Ŷ: 'Y',
                    Ỹ: 'Y',
                    Ȳ: 'Y',
                    Ẏ: 'Y',
                    Ÿ: 'Y',
                    Ỷ: 'Y',
                    Ỵ: 'Y',
                    Ƴ: 'Y',
                    Ɏ: 'Y',
                    Ỿ: 'Y',
                    'Ⓩ': 'Z',
                    Ｚ: 'Z',
                    Ź: 'Z',
                    Ẑ: 'Z',
                    Ż: 'Z',
                    Ž: 'Z',
                    Ẓ: 'Z',
                    Ẕ: 'Z',
                    Ƶ: 'Z',
                    Ȥ: 'Z',
                    Ɀ: 'Z',
                    Ⱬ: 'Z',
                    Ꝣ: 'Z',
                    'ⓐ': 'a',
                    ａ: 'a',
                    ẚ: 'a',
                    à: 'a',
                    á: 'a',
                    â: 'a',
                    ầ: 'a',
                    ấ: 'a',
                    ẫ: 'a',
                    ẩ: 'a',
                    ã: 'a',
                    ā: 'a',
                    ă: 'a',
                    ằ: 'a',
                    ắ: 'a',
                    ẵ: 'a',
                    ẳ: 'a',
                    ȧ: 'a',
                    ǡ: 'a',
                    ä: 'a',
                    ǟ: 'a',
                    ả: 'a',
                    å: 'a',
                    ǻ: 'a',
                    ǎ: 'a',
                    ȁ: 'a',
                    ȃ: 'a',
                    ạ: 'a',
                    ậ: 'a',
                    ặ: 'a',
                    ḁ: 'a',
                    ą: 'a',
                    ⱥ: 'a',
                    ɐ: 'a',
                    ꜳ: 'aa',
                    æ: 'ae',
                    ǽ: 'ae',
                    ǣ: 'ae',
                    ꜵ: 'ao',
                    ꜷ: 'au',
                    ꜹ: 'av',
                    ꜻ: 'av',
                    ꜽ: 'ay',
                    'ⓑ': 'b',
                    ｂ: 'b',
                    ḃ: 'b',
                    ḅ: 'b',
                    ḇ: 'b',
                    ƀ: 'b',
                    ƃ: 'b',
                    ɓ: 'b',
                    'ⓒ': 'c',
                    ｃ: 'c',
                    ć: 'c',
                    ĉ: 'c',
                    ċ: 'c',
                    č: 'c',
                    ç: 'c',
                    ḉ: 'c',
                    ƈ: 'c',
                    ȼ: 'c',
                    ꜿ: 'c',
                    ↄ: 'c',
                    'ⓓ': 'd',
                    ｄ: 'd',
                    ḋ: 'd',
                    ď: 'd',
                    ḍ: 'd',
                    ḑ: 'd',
                    ḓ: 'd',
                    ḏ: 'd',
                    đ: 'd',
                    ƌ: 'd',
                    ɖ: 'd',
                    ɗ: 'd',
                    ꝺ: 'd',
                    ǳ: 'dz',
                    ǆ: 'dz',
                    'ⓔ': 'e',
                    ｅ: 'e',
                    è: 'e',
                    é: 'e',
                    ê: 'e',
                    ề: 'e',
                    ế: 'e',
                    ễ: 'e',
                    ể: 'e',
                    ẽ: 'e',
                    ē: 'e',
                    ḕ: 'e',
                    ḗ: 'e',
                    ĕ: 'e',
                    ė: 'e',
                    ë: 'e',
                    ẻ: 'e',
                    ě: 'e',
                    ȅ: 'e',
                    ȇ: 'e',
                    ẹ: 'e',
                    ệ: 'e',
                    ȩ: 'e',
                    ḝ: 'e',
                    ę: 'e',
                    ḙ: 'e',
                    ḛ: 'e',
                    ɇ: 'e',
                    ɛ: 'e',
                    ǝ: 'e',
                    'ⓕ': 'f',
                    ｆ: 'f',
                    ḟ: 'f',
                    ƒ: 'f',
                    ꝼ: 'f',
                    'ⓖ': 'g',
                    ｇ: 'g',
                    ǵ: 'g',
                    ĝ: 'g',
                    ḡ: 'g',
                    ğ: 'g',
                    ġ: 'g',
                    ǧ: 'g',
                    ģ: 'g',
                    ǥ: 'g',
                    ɠ: 'g',
                    ꞡ: 'g',
                    ᵹ: 'g',
                    ꝿ: 'g',
                    'ⓗ': 'h',
                    ｈ: 'h',
                    ĥ: 'h',
                    ḣ: 'h',
                    ḧ: 'h',
                    ȟ: 'h',
                    ḥ: 'h',
                    ḩ: 'h',
                    ḫ: 'h',
                    ẖ: 'h',
                    ħ: 'h',
                    ⱨ: 'h',
                    ⱶ: 'h',
                    ɥ: 'h',
                    ƕ: 'hv',
                    'ⓘ': 'i',
                    ｉ: 'i',
                    ì: 'i',
                    í: 'i',
                    î: 'i',
                    ĩ: 'i',
                    ī: 'i',
                    ĭ: 'i',
                    ï: 'i',
                    ḯ: 'i',
                    ỉ: 'i',
                    ǐ: 'i',
                    ȉ: 'i',
                    ȋ: 'i',
                    ị: 'i',
                    į: 'i',
                    ḭ: 'i',
                    ɨ: 'i',
                    ı: 'i',
                    'ⓙ': 'j',
                    ｊ: 'j',
                    ĵ: 'j',
                    ǰ: 'j',
                    ɉ: 'j',
                    'ⓚ': 'k',
                    ｋ: 'k',
                    ḱ: 'k',
                    ǩ: 'k',
                    ḳ: 'k',
                    ķ: 'k',
                    ḵ: 'k',
                    ƙ: 'k',
                    ⱪ: 'k',
                    ꝁ: 'k',
                    ꝃ: 'k',
                    ꝅ: 'k',
                    ꞣ: 'k',
                    'ⓛ': 'l',
                    ｌ: 'l',
                    ŀ: 'l',
                    ĺ: 'l',
                    ľ: 'l',
                    ḷ: 'l',
                    ḹ: 'l',
                    ļ: 'l',
                    ḽ: 'l',
                    ḻ: 'l',
                    ſ: 'l',
                    ł: 'l',
                    ƚ: 'l',
                    ɫ: 'l',
                    ⱡ: 'l',
                    ꝉ: 'l',
                    ꞁ: 'l',
                    ꝇ: 'l',
                    ǉ: 'lj',
                    'ⓜ': 'm',
                    ｍ: 'm',
                    ḿ: 'm',
                    ṁ: 'm',
                    ṃ: 'm',
                    ɱ: 'm',
                    ɯ: 'm',
                    'ⓝ': 'n',
                    ｎ: 'n',
                    ǹ: 'n',
                    ń: 'n',
                    ñ: 'n',
                    ṅ: 'n',
                    ň: 'n',
                    ṇ: 'n',
                    ņ: 'n',
                    ṋ: 'n',
                    ṉ: 'n',
                    ƞ: 'n',
                    ɲ: 'n',
                    ŉ: 'n',
                    ꞑ: 'n',
                    ꞥ: 'n',
                    ǌ: 'nj',
                    'ⓞ': 'o',
                    ｏ: 'o',
                    ò: 'o',
                    ó: 'o',
                    ô: 'o',
                    ồ: 'o',
                    ố: 'o',
                    ỗ: 'o',
                    ổ: 'o',
                    õ: 'o',
                    ṍ: 'o',
                    ȭ: 'o',
                    ṏ: 'o',
                    ō: 'o',
                    ṑ: 'o',
                    ṓ: 'o',
                    ŏ: 'o',
                    ȯ: 'o',
                    ȱ: 'o',
                    ö: 'o',
                    ȫ: 'o',
                    ỏ: 'o',
                    ő: 'o',
                    ǒ: 'o',
                    ȍ: 'o',
                    ȏ: 'o',
                    ơ: 'o',
                    ờ: 'o',
                    ớ: 'o',
                    ỡ: 'o',
                    ở: 'o',
                    ợ: 'o',
                    ọ: 'o',
                    ộ: 'o',
                    ǫ: 'o',
                    ǭ: 'o',
                    ø: 'o',
                    ǿ: 'o',
                    ɔ: 'o',
                    ꝋ: 'o',
                    ꝍ: 'o',
                    ɵ: 'o',
                    œ: 'oe',
                    ƣ: 'oi',
                    ȣ: 'ou',
                    ꝏ: 'oo',
                    'ⓟ': 'p',
                    ｐ: 'p',
                    ṕ: 'p',
                    ṗ: 'p',
                    ƥ: 'p',
                    ᵽ: 'p',
                    ꝑ: 'p',
                    ꝓ: 'p',
                    ꝕ: 'p',
                    'ⓠ': 'q',
                    ｑ: 'q',
                    ɋ: 'q',
                    ꝗ: 'q',
                    ꝙ: 'q',
                    'ⓡ': 'r',
                    ｒ: 'r',
                    ŕ: 'r',
                    ṙ: 'r',
                    ř: 'r',
                    ȑ: 'r',
                    ȓ: 'r',
                    ṛ: 'r',
                    ṝ: 'r',
                    ŗ: 'r',
                    ṟ: 'r',
                    ɍ: 'r',
                    ɽ: 'r',
                    ꝛ: 'r',
                    ꞧ: 'r',
                    ꞃ: 'r',
                    'ⓢ': 's',
                    ｓ: 's',
                    ß: 's',
                    ś: 's',
                    ṥ: 's',
                    ŝ: 's',
                    ṡ: 's',
                    š: 's',
                    ṧ: 's',
                    ṣ: 's',
                    ṩ: 's',
                    ș: 's',
                    ş: 's',
                    ȿ: 's',
                    ꞩ: 's',
                    ꞅ: 's',
                    ẛ: 's',
                    'ⓣ': 't',
                    ｔ: 't',
                    ṫ: 't',
                    ẗ: 't',
                    ť: 't',
                    ṭ: 't',
                    ț: 't',
                    ţ: 't',
                    ṱ: 't',
                    ṯ: 't',
                    ŧ: 't',
                    ƭ: 't',
                    ʈ: 't',
                    ⱦ: 't',
                    ꞇ: 't',
                    ꜩ: 'tz',
                    'ⓤ': 'u',
                    ｕ: 'u',
                    ù: 'u',
                    ú: 'u',
                    û: 'u',
                    ũ: 'u',
                    ṹ: 'u',
                    ū: 'u',
                    ṻ: 'u',
                    ŭ: 'u',
                    ü: 'u',
                    ǜ: 'u',
                    ǘ: 'u',
                    ǖ: 'u',
                    ǚ: 'u',
                    ủ: 'u',
                    ů: 'u',
                    ű: 'u',
                    ǔ: 'u',
                    ȕ: 'u',
                    ȗ: 'u',
                    ư: 'u',
                    ừ: 'u',
                    ứ: 'u',
                    ữ: 'u',
                    ử: 'u',
                    ự: 'u',
                    ụ: 'u',
                    ṳ: 'u',
                    ų: 'u',
                    ṷ: 'u',
                    ṵ: 'u',
                    ʉ: 'u',
                    'ⓥ': 'v',
                    ｖ: 'v',
                    ṽ: 'v',
                    ṿ: 'v',
                    ʋ: 'v',
                    ꝟ: 'v',
                    ʌ: 'v',
                    ꝡ: 'vy',
                    'ⓦ': 'w',
                    ｗ: 'w',
                    ẁ: 'w',
                    ẃ: 'w',
                    ŵ: 'w',
                    ẇ: 'w',
                    ẅ: 'w',
                    ẘ: 'w',
                    ẉ: 'w',
                    ⱳ: 'w',
                    'ⓧ': 'x',
                    ｘ: 'x',
                    ẋ: 'x',
                    ẍ: 'x',
                    'ⓨ': 'y',
                    ｙ: 'y',
                    ỳ: 'y',
                    ý: 'y',
                    ŷ: 'y',
                    ỹ: 'y',
                    ȳ: 'y',
                    ẏ: 'y',
                    ÿ: 'y',
                    ỷ: 'y',
                    ẙ: 'y',
                    ỵ: 'y',
                    ƴ: 'y',
                    ɏ: 'y',
                    ỿ: 'y',
                    'ⓩ': 'z',
                    ｚ: 'z',
                    ź: 'z',
                    ẑ: 'z',
                    ż: 'z',
                    ž: 'z',
                    ẓ: 'z',
                    ẕ: 'z',
                    ƶ: 'z',
                    ȥ: 'z',
                    ɀ: 'z',
                    ⱬ: 'z',
                    ꝣ: 'z',
                    Ά: 'Α',
                    Έ: 'Ε',
                    Ή: 'Η',
                    Ί: 'Ι',
                    Ϊ: 'Ι',
                    Ό: 'Ο',
                    Ύ: 'Υ',
                    Ϋ: 'Υ',
                    Ώ: 'Ω',
                    ά: 'α',
                    έ: 'ε',
                    ή: 'η',
                    ί: 'ι',
                    ϊ: 'ι',
                    ΐ: 'ι',
                    ό: 'ο',
                    ύ: 'υ',
                    ϋ: 'υ',
                    ΰ: 'υ',
                    ώ: 'ω',
                    ς: 'σ',
                    '’': "'",
                };
            });
            S2.define('select2/data/base', ['../utils'], function (Utils) {
                function BaseAdapter($element, options) {
                    BaseAdapter.__super__.constructor.call(this);
                }
                Utils.Extend(BaseAdapter, Utils.Observable);
                BaseAdapter.prototype.current = function (callback) {
                    throw new Error('The `current` method must be defined in child classes.');
                };
                BaseAdapter.prototype.query = function (params, callback) {
                    throw new Error('The `query` method must be defined in child classes.');
                };
                BaseAdapter.prototype.bind = function (container, $container) {};
                BaseAdapter.prototype.destroy = function () {};
                BaseAdapter.prototype.generateResultId = function (container, data) {
                    var id = container.id + '-result-';
                    id += Utils.generateChars(4);
                    if (data.id != null) id += '-' + data.id.toString();
                    else id += '-' + Utils.generateChars(4);
                    return id;
                };
                return BaseAdapter;
            });
            S2.define(
                'select2/data/select',
                ['./base', '../utils', 'jquery'],
                function (BaseAdapter, Utils, $) {
                    function SelectAdapter($element, options) {
                        this.$element = $element;
                        this.options = options;
                        SelectAdapter.__super__.constructor.call(this);
                    }
                    Utils.Extend(SelectAdapter, BaseAdapter);
                    SelectAdapter.prototype.current = function (callback) {
                        var data = [];
                        var self = this;
                        this.$element.find(':selected').each(function () {
                            var $option = $(this);
                            var option = self.item($option);
                            data.push(option);
                        });
                        callback(data);
                    };
                    SelectAdapter.prototype.select = function (data) {
                        var self = this;
                        data.selected = true;
                        if ($(data.element).is('option')) {
                            data.element.selected = true;
                            this.$element.trigger('input').trigger('change');
                            return;
                        }
                        if (this.$element.prop('multiple'))
                            this.current(function (currentData) {
                                var val = [];
                                data = [data];
                                data.push.apply(data, currentData);
                                for (var d = 0; d < data.length; d++) {
                                    var id = data[d].id;
                                    if ($.inArray(id, val) === -1) val.push(id);
                                }
                                self.$element.val(val);
                                self.$element.trigger('input').trigger('change');
                            });
                        else {
                            var val = data.id;
                            this.$element.val(val);
                            this.$element.trigger('input').trigger('change');
                        }
                    };
                    SelectAdapter.prototype.unselect = function (data) {
                        var self = this;
                        if (!this.$element.prop('multiple')) return;
                        data.selected = false;
                        if ($(data.element).is('option')) {
                            data.element.selected = false;
                            this.$element.trigger('input').trigger('change');
                            return;
                        }
                        this.current(function (currentData) {
                            var val = [];
                            for (var d = 0; d < currentData.length; d++) {
                                var id = currentData[d].id;
                                if (id !== data.id && $.inArray(id, val) === -1) val.push(id);
                            }
                            self.$element.val(val);
                            self.$element.trigger('input').trigger('change');
                        });
                    };
                    SelectAdapter.prototype.bind = function (container, $container) {
                        var self = this;
                        this.container = container;
                        container.on('select', function (params) {
                            self.select(params.data);
                        });
                        container.on('unselect', function (params) {
                            self.unselect(params.data);
                        });
                    };
                    SelectAdapter.prototype.destroy = function () {
                        this.$element.find('*').each(function () {
                            Utils.RemoveData(this);
                        });
                    };
                    SelectAdapter.prototype.query = function (params, callback) {
                        var data = [];
                        var self = this;
                        this.$element.children().each(function () {
                            var $option = $(this);
                            if (!$option.is('option') && !$option.is('optgroup')) return;
                            var option = self.item($option);
                            var matches = self.matches(params, option);
                            if (matches !== null) data.push(matches);
                        });
                        callback({results: data});
                    };
                    SelectAdapter.prototype.addOptions = function ($options) {
                        Utils.appendMany(this.$element, $options);
                    };
                    SelectAdapter.prototype.option = function (data) {
                        var option;
                        if (data.children) {
                            option = document.createElement('optgroup');
                            option.label = data.text;
                        } else {
                            option = document.createElement('option');
                            if (option.textContent !== void 0) option.textContent = data.text;
                            else option.innerText = data.text;
                        }
                        if (data.id !== void 0) option.value = data.id;
                        if (data.disabled) option.disabled = true;
                        if (data.selected) option.selected = true;
                        if (data.title) option.title = data.title;
                        var $option = $(option);
                        var normalizedData = this._normalizeItem(data);
                        normalizedData.element = option;
                        Utils.StoreData(option, 'data', normalizedData);
                        return $option;
                    };
                    SelectAdapter.prototype.item = function ($option) {
                        var data = {};
                        data = Utils.GetData($option[0], 'data');
                        if (data != null) return data;
                        if ($option.is('option'))
                            data = {
                                id: $option.val(),
                                text: $option.text(),
                                disabled: $option.prop('disabled'),
                                selected: $option.prop('selected'),
                                title: $option.prop('title'),
                            };
                        else if ($option.is('optgroup')) {
                            data = {
                                text: $option.prop('label'),
                                children: [],
                                title: $option.prop('title'),
                            };
                            var $children = $option.children('option');
                            var children = [];
                            for (var c = 0; c < $children.length; c++) {
                                var $child = $($children[c]);
                                var child = this.item($child);
                                children.push(child);
                            }
                            data.children = children;
                        }
                        data = this._normalizeItem(data);
                        data.element = $option[0];
                        Utils.StoreData($option[0], 'data', data);
                        return data;
                    };
                    SelectAdapter.prototype._normalizeItem = function (item) {
                        if (item !== Object(item))
                            item = {
                                id: item,
                                text: item,
                            };
                        item = $.extend({}, {text: ''}, item);
                        var defaults = {
                            selected: false,
                            disabled: false,
                        };
                        if (item.id != null) item.id = item.id.toString();
                        if (item.text != null) item.text = item.text.toString();
                        if (item._resultId == null && item.id && this.container != null)
                            item._resultId = this.generateResultId(this.container, item);
                        return $.extend({}, defaults, item);
                    };
                    SelectAdapter.prototype.matches = function (params, data) {
                        return this.options.get('matcher')(params, data);
                    };
                    return SelectAdapter;
                },
            );
            S2.define(
                'select2/data/array',
                ['./select', '../utils', 'jquery'],
                function (SelectAdapter, Utils, $) {
                    function ArrayAdapter($element, options) {
                        this._dataToConvert = options.get('data') || [];
                        ArrayAdapter.__super__.constructor.call(this, $element, options);
                    }
                    Utils.Extend(ArrayAdapter, SelectAdapter);
                    ArrayAdapter.prototype.bind = function (container, $container) {
                        ArrayAdapter.__super__.bind.call(this, container, $container);
                        this.addOptions(this.convertToOptions(this._dataToConvert));
                    };
                    ArrayAdapter.prototype.select = function (data) {
                        var $option = this.$element.find('option').filter(function (i, elm) {
                            return elm.value == data.id.toString();
                        });
                        if ($option.length === 0) {
                            $option = this.option(data);
                            this.addOptions($option);
                        }
                        ArrayAdapter.__super__.select.call(this, data);
                    };
                    ArrayAdapter.prototype.convertToOptions = function (data) {
                        var self = this;
                        var $existing = this.$element.find('option');
                        var existingIds = $existing
                            .map(function () {
                                return self.item($(this)).id;
                            })
                            .get();
                        var $options = [];
                        function onlyItem(item) {
                            return function () {
                                return $(this).val() == item.id;
                            };
                        }
                        for (var d = 0; d < data.length; d++) {
                            var item = this._normalizeItem(data[d]);
                            if ($.inArray(item.id, existingIds) >= 0) {
                                var $existingOption = $existing.filter(onlyItem(item));
                                var existingData = this.item($existingOption);
                                var newData = $.extend(true, {}, item, existingData);
                                var $newOption = this.option(newData);
                                $existingOption.replaceWith($newOption);
                                continue;
                            }
                            var $option = this.option(item);
                            if (item.children) {
                                var $children = this.convertToOptions(item.children);
                                Utils.appendMany($option, $children);
                            }
                            $options.push($option);
                        }
                        return $options;
                    };
                    return ArrayAdapter;
                },
            );
            S2.define(
                'select2/data/ajax',
                ['./array', '../utils', 'jquery'],
                function (ArrayAdapter, Utils, $) {
                    function AjaxAdapter($element, options) {
                        this.ajaxOptions = this._applyDefaults(options.get('ajax'));
                        if (this.ajaxOptions.processResults != null)
                            this.processResults = this.ajaxOptions.processResults;
                        AjaxAdapter.__super__.constructor.call(this, $element, options);
                    }
                    Utils.Extend(AjaxAdapter, ArrayAdapter);
                    AjaxAdapter.prototype._applyDefaults = function (options) {
                        return $.extend(
                            {},
                            {
                                data: function (params) {
                                    return $.extend({}, params, {q: params.term});
                                },
                                transport: function (params, success, failure) {
                                    var $request = $.ajax(params);
                                    $request.then(success);
                                    $request.fail(failure);
                                    return $request;
                                },
                            },
                            options,
                            true,
                        );
                    };
                    AjaxAdapter.prototype.processResults = function (results) {
                        return results;
                    };
                    AjaxAdapter.prototype.query = function (params, callback) {
                        var self = this;
                        if (this._request != null) {
                            if ($.isFunction(this._request.abort)) this._request.abort();
                            this._request = null;
                        }
                        var options = $.extend({type: 'GET'}, this.ajaxOptions);
                        if (typeof options.url === 'function')
                            options.url = options.url.call(this.$element, params);
                        if (typeof options.data === 'function')
                            options.data = options.data.call(this.$element, params);
                        function request() {
                            var $request = options.transport(
                                options,
                                function (data) {
                                    var results = self.processResults(data, params);
                                    if (
                                        self.options.get('debug') &&
                                        window.console &&
                                        console.error
                                    ) {
                                        if (
                                            !results ||
                                            !results.results ||
                                            !$.isArray(results.results)
                                        )
                                            console.error(
                                                'Select2: The AJAX results did not return an array in the `results` key of the response.',
                                            );
                                    }
                                    callback(results);
                                },
                                function () {
                                    if (
                                        'status' in $request &&
                                        ($request.status === 0 || $request.status === '0')
                                    )
                                        return;
                                    self.trigger('results:message', {message: 'errorLoading'});
                                },
                            );
                            self._request = $request;
                        }
                        if (this.ajaxOptions.delay && params.term != null) {
                            if (this._queryTimeout) window.clearTimeout(this._queryTimeout);
                            this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
                        } else request();
                    };
                    return AjaxAdapter;
                },
            );
            S2.define('select2/data/tags', ['jquery'], function ($) {
                function Tags(decorated, $element, options) {
                    var tags = options.get('tags');
                    var createTag = options.get('createTag');
                    if (createTag !== void 0) this.createTag = createTag;
                    var insertTag = options.get('insertTag');
                    if (insertTag !== void 0) this.insertTag = insertTag;
                    decorated.call(this, $element, options);
                    if ($.isArray(tags))
                        for (var t = 0; t < tags.length; t++) {
                            var tag = tags[t];
                            var item = this._normalizeItem(tag);
                            var $option = this.option(item);
                            this.$element.append($option);
                        }
                }
                Tags.prototype.query = function (decorated, params, callback) {
                    var self = this;
                    this._removeOldTags();
                    if (params.term == null || params.page != null) {
                        decorated.call(this, params, callback);
                        return;
                    }
                    function wrapper(obj, child) {
                        var data = obj.results;
                        for (var i = 0; i < data.length; i++) {
                            var option = data[i];
                            var checkChildren =
                                option.children != null &&
                                !wrapper({results: option.children}, true);
                            if (
                                (option.text || '').toUpperCase() ===
                                    (params.term || '').toUpperCase() ||
                                checkChildren
                            ) {
                                if (child) return false;
                                obj.data = data;
                                callback(obj);
                                return;
                            }
                        }
                        if (child) return true;
                        var tag = self.createTag(params);
                        if (tag != null) {
                            var $option = self.option(tag);
                            $option.attr('data-select2-tag', true);
                            self.addOptions([$option]);
                            self.insertTag(data, tag);
                        }
                        obj.results = data;
                        callback(obj);
                    }
                    decorated.call(this, params, wrapper);
                };
                Tags.prototype.createTag = function (decorated, params) {
                    var term = $.trim(params.term);
                    if (term === '') return null;
                    return {
                        id: term,
                        text: term,
                    };
                };
                Tags.prototype.insertTag = function (_, data, tag) {
                    data.unshift(tag);
                };
                Tags.prototype._removeOldTags = function (_) {
                    this.$element.find('option[data-select2-tag]').each(function () {
                        if (this.selected) return;
                        $(this).remove();
                    });
                };
                return Tags;
            });
            S2.define('select2/data/tokenizer', ['jquery'], function ($) {
                function Tokenizer(decorated, $element, options) {
                    var tokenizer = options.get('tokenizer');
                    if (tokenizer !== void 0) this.tokenizer = tokenizer;
                    decorated.call(this, $element, options);
                }
                Tokenizer.prototype.bind = function (decorated, container, $container) {
                    decorated.call(this, container, $container);
                    this.$search =
                        container.dropdown.$search ||
                        container.selection.$search ||
                        $container.find('.select2-search__field');
                };
                Tokenizer.prototype.query = function (decorated, params, callback) {
                    var self = this;
                    function createAndSelect(data) {
                        var item = self._normalizeItem(data);
                        if (
                            !self.$element.find('option').filter(function () {
                                return $(this).val() === item.id;
                            }).length
                        ) {
                            var $option = self.option(item);
                            $option.attr('data-select2-tag', true);
                            self._removeOldTags();
                            self.addOptions([$option]);
                        }
                        select(item);
                    }
                    function select(data) {
                        self.trigger('select', {data});
                    }
                    params.term = params.term || '';
                    var tokenData = this.tokenizer(params, this.options, createAndSelect);
                    if (tokenData.term !== params.term) {
                        if (this.$search.length) {
                            this.$search.val(tokenData.term);
                            this.$search.trigger('focus');
                        }
                        params.term = tokenData.term;
                    }
                    decorated.call(this, params, callback);
                };
                Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
                    var separators = options.get('tokenSeparators') || [];
                    var term = params.term;
                    var i = 0;
                    var createTag =
                        this.createTag ||
                        function (params) {
                            return {
                                id: params.term,
                                text: params.term,
                            };
                        };
                    while (i < term.length) {
                        var termChar = term[i];
                        if ($.inArray(termChar, separators) === -1) {
                            i++;
                            continue;
                        }
                        var part = term.substr(0, i);
                        var data = createTag($.extend({}, params, {term: part}));
                        if (data == null) {
                            i++;
                            continue;
                        }
                        callback(data);
                        term = term.substr(i + 1) || '';
                        i = 0;
                    }
                    return {term};
                };
                return Tokenizer;
            });
            S2.define('select2/data/minimumInputLength', [], function () {
                function MinimumInputLength(decorated, $e, options) {
                    this.minimumInputLength = options.get('minimumInputLength');
                    decorated.call(this, $e, options);
                }
                MinimumInputLength.prototype.query = function (decorated, params, callback) {
                    params.term = params.term || '';
                    if (params.term.length < this.minimumInputLength) {
                        this.trigger('results:message', {
                            message: 'inputTooShort',
                            args: {
                                minimum: this.minimumInputLength,
                                input: params.term,
                                params,
                            },
                        });
                        return;
                    }
                    decorated.call(this, params, callback);
                };
                return MinimumInputLength;
            });
            S2.define('select2/data/maximumInputLength', [], function () {
                function MaximumInputLength(decorated, $e, options) {
                    this.maximumInputLength = options.get('maximumInputLength');
                    decorated.call(this, $e, options);
                }
                MaximumInputLength.prototype.query = function (decorated, params, callback) {
                    params.term = params.term || '';
                    if (
                        this.maximumInputLength > 0 &&
                        params.term.length > this.maximumInputLength
                    ) {
                        this.trigger('results:message', {
                            message: 'inputTooLong',
                            args: {
                                maximum: this.maximumInputLength,
                                input: params.term,
                                params,
                            },
                        });
                        return;
                    }
                    decorated.call(this, params, callback);
                };
                return MaximumInputLength;
            });
            S2.define('select2/data/maximumSelectionLength', [], function () {
                function MaximumSelectionLength(decorated, $e, options) {
                    this.maximumSelectionLength = options.get('maximumSelectionLength');
                    decorated.call(this, $e, options);
                }
                MaximumSelectionLength.prototype.bind = function (
                    decorated,
                    container,
                    $container,
                ) {
                    var self = this;
                    decorated.call(this, container, $container);
                    container.on('select', function () {
                        self._checkIfMaximumSelected();
                    });
                };
                MaximumSelectionLength.prototype.query = function (decorated, params, callback) {
                    var self = this;
                    this._checkIfMaximumSelected(function () {
                        decorated.call(self, params, callback);
                    });
                };
                MaximumSelectionLength.prototype._checkIfMaximumSelected = function (
                    _,
                    successCallback,
                ) {
                    var self = this;
                    this.current(function (currentData) {
                        var count = currentData != null ? currentData.length : 0;
                        if (
                            self.maximumSelectionLength > 0 &&
                            count >= self.maximumSelectionLength
                        ) {
                            self.trigger('results:message', {
                                message: 'maximumSelected',
                                args: {maximum: self.maximumSelectionLength},
                            });
                            return;
                        }
                        if (successCallback) successCallback();
                    });
                };
                return MaximumSelectionLength;
            });
            S2.define('select2/dropdown', ['jquery', './utils'], function ($, Utils) {
                function Dropdown($element, options) {
                    this.$element = $element;
                    this.options = options;
                    Dropdown.__super__.constructor.call(this);
                }
                Utils.Extend(Dropdown, Utils.Observable);
                Dropdown.prototype.render = function () {
                    var $dropdown = $(
                        '<span class="select2-dropdown"><span class="select2-results"></span></span>',
                    );
                    $dropdown.attr('dir', this.options.get('dir'));
                    this.$dropdown = $dropdown;
                    return $dropdown;
                };
                Dropdown.prototype.bind = function () {};
                Dropdown.prototype.position = function ($dropdown, $container) {};
                Dropdown.prototype.destroy = function () {
                    this.$dropdown.remove();
                };
                return Dropdown;
            });
            S2.define('select2/dropdown/search', ['jquery', '../utils'], function ($, Utils) {
                function Search() {}
                Search.prototype.render = function (decorated) {
                    var $rendered = decorated.call(this);
                    var $search = $(
                        '<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>',
                    );
                    this.$searchContainer = $search;
                    this.$search = $search.find('input');
                    $rendered.prepend($search);
                    return $rendered;
                };
                Search.prototype.bind = function (decorated, container, $container) {
                    var self = this;
                    var resultsId = container.id + '-results';
                    decorated.call(this, container, $container);
                    this.$search.on('keydown', function (evt) {
                        self.trigger('keypress', evt);
                        self._keyUpPrevented = evt.isDefaultPrevented();
                    });
                    this.$search.on('input', function (evt) {
                        $(this).off('keyup');
                    });
                    this.$search.on('keyup input', function (evt) {
                        self.handleSearch(evt);
                    });
                    container.on('open', function () {
                        self.$search.attr('tabindex', 0);
                        self.$search.attr('aria-controls', resultsId);
                        self.$search.trigger('focus');
                        window.setTimeout(function () {
                            self.$search.trigger('focus');
                        }, 0);
                    });
                    container.on('close', function () {
                        self.$search.attr('tabindex', -1);
                        self.$search.removeAttr('aria-controls');
                        self.$search.removeAttr('aria-activedescendant');
                        self.$search.val('');
                        self.$search.trigger('blur');
                    });
                    container.on('focus', function () {
                        if (!container.isOpen()) self.$search.trigger('focus');
                    });
                    container.on('results:all', function (params) {
                        if (params.query.term == null || params.query.term === '')
                            if (self.showSearch(params))
                                self.$searchContainer.removeClass('select2-search--hide');
                            else self.$searchContainer.addClass('select2-search--hide');
                    });
                    container.on('results:focus', function (params) {
                        if (params.data._resultId)
                            self.$search.attr('aria-activedescendant', params.data._resultId);
                        else self.$search.removeAttr('aria-activedescendant');
                    });
                };
                Search.prototype.handleSearch = function (evt) {
                    if (!this._keyUpPrevented) {
                        var input = this.$search.val();
                        this.trigger('query', {term: input});
                    }
                    this._keyUpPrevented = false;
                };
                Search.prototype.showSearch = function (_, params) {
                    return true;
                };
                return Search;
            });
            S2.define('select2/dropdown/hidePlaceholder', [], function () {
                function HidePlaceholder(decorated, $element, options, dataAdapter) {
                    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));
                    decorated.call(this, $element, options, dataAdapter);
                }
                HidePlaceholder.prototype.append = function (decorated, data) {
                    data.results = this.removePlaceholder(data.results);
                    decorated.call(this, data);
                };
                HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
                    if (typeof placeholder === 'string')
                        placeholder = {
                            id: '',
                            text: placeholder,
                        };
                    return placeholder;
                };
                HidePlaceholder.prototype.removePlaceholder = function (_, data) {
                    var modifiedData = data.slice(0);
                    for (var d = data.length - 1; d >= 0; d--) {
                        var item = data[d];
                        if (this.placeholder.id === item.id) modifiedData.splice(d, 1);
                    }
                    return modifiedData;
                };
                return HidePlaceholder;
            });
            S2.define('select2/dropdown/infiniteScroll', ['jquery'], function ($) {
                function InfiniteScroll(decorated, $element, options, dataAdapter) {
                    this.lastParams = {};
                    decorated.call(this, $element, options, dataAdapter);
                    this.$loadingMore = this.createLoadingMore();
                    this.loading = false;
                }
                InfiniteScroll.prototype.append = function (decorated, data) {
                    this.$loadingMore.remove();
                    this.loading = false;
                    decorated.call(this, data);
                    if (this.showLoadingMore(data)) {
                        this.$results.append(this.$loadingMore);
                        this.loadMoreIfNeeded();
                    }
                };
                InfiniteScroll.prototype.bind = function (decorated, container, $container) {
                    var self = this;
                    decorated.call(this, container, $container);
                    container.on('query', function (params) {
                        self.lastParams = params;
                        self.loading = true;
                    });
                    container.on('query:append', function (params) {
                        self.lastParams = params;
                        self.loading = true;
                    });
                    this.$results.on('scroll', this.loadMoreIfNeeded.bind(this));
                };
                InfiniteScroll.prototype.loadMoreIfNeeded = function () {
                    var isLoadMoreVisible = $.contains(
                        document.documentElement,
                        this.$loadingMore[0],
                    );
                    if (this.loading || !isLoadMoreVisible) return;
                    var currentOffset =
                        this.$results.offset().top + this.$results.outerHeight(false);
                    var loadingMoreOffset =
                        this.$loadingMore.offset().top + this.$loadingMore.outerHeight(false);
                    if (currentOffset + 50 >= loadingMoreOffset) this.loadMore();
                };
                InfiniteScroll.prototype.loadMore = function () {
                    this.loading = true;
                    var params = $.extend({}, {page: 1}, this.lastParams);
                    params.page++;
                    this.trigger('query:append', params);
                };
                InfiniteScroll.prototype.showLoadingMore = function (_, data) {
                    return data.pagination && data.pagination.more;
                };
                InfiniteScroll.prototype.createLoadingMore = function () {
                    var $option = $(
                        '<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>',
                    );
                    var message = this.options.get('translations').get('loadingMore');
                    $option.html(message(this.lastParams));
                    return $option;
                };
                return InfiniteScroll;
            });
            S2.define('select2/dropdown/attachBody', ['jquery', '../utils'], function ($, Utils) {
                function AttachBody(decorated, $element, options) {
                    this.$dropdownParent = $(options.get('dropdownParent') || document.body);
                    decorated.call(this, $element, options);
                }
                AttachBody.prototype.bind = function (decorated, container, $container) {
                    var self = this;
                    decorated.call(this, container, $container);
                    container.on('open', function () {
                        self._showDropdown();
                        self._attachPositioningHandler(container);
                        self._bindContainerResultHandlers(container);
                    });
                    container.on('close', function () {
                        self._hideDropdown();
                        self._detachPositioningHandler(container);
                    });
                    this.$dropdownContainer.on('mousedown', function (evt) {
                        evt.stopPropagation();
                    });
                };
                AttachBody.prototype.destroy = function (decorated) {
                    decorated.call(this);
                    this.$dropdownContainer.remove();
                };
                AttachBody.prototype.position = function (decorated, $dropdown, $container) {
                    $dropdown.attr('class', $container.attr('class'));
                    $dropdown.removeClass('select2');
                    $dropdown.addClass('select2-container--open');
                    $dropdown.css({
                        position: 'absolute',
                        top: -999999,
                    });
                    this.$container = $container;
                };
                AttachBody.prototype.render = function (decorated) {
                    var $container = $('<span></span>');
                    var $dropdown = decorated.call(this);
                    $container.append($dropdown);
                    this.$dropdownContainer = $container;
                    return $container;
                };
                AttachBody.prototype._hideDropdown = function (decorated) {
                    this.$dropdownContainer.detach();
                };
                AttachBody.prototype._bindContainerResultHandlers = function (
                    decorated,
                    container,
                ) {
                    if (this._containerResultsHandlersBound) return;
                    var self = this;
                    container.on('results:all', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });
                    container.on('results:append', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });
                    container.on('results:message', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });
                    container.on('select', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });
                    container.on('unselect', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });
                    this._containerResultsHandlersBound = true;
                };
                AttachBody.prototype._attachPositioningHandler = function (decorated, container) {
                    var self = this;
                    var scrollEvent = 'scroll.select2.' + container.id;
                    var resizeEvent = 'resize.select2.' + container.id;
                    var orientationEvent = 'orientationchange.select2.' + container.id;
                    var $watchers = this.$container.parents().filter(Utils.hasScroll);
                    $watchers.each(function () {
                        Utils.StoreData(this, 'select2-scroll-position', {
                            x: $(this).scrollLeft(),
                            y: $(this).scrollTop(),
                        });
                    });
                    $watchers.on(scrollEvent, function (ev) {
                        var position = Utils.GetData(this, 'select2-scroll-position');
                        $(this).scrollTop(position.y);
                    });
                    $(window).on(
                        scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
                        function (e) {
                            self._positionDropdown();
                            self._resizeDropdown();
                        },
                    );
                };
                AttachBody.prototype._detachPositioningHandler = function (decorated, container) {
                    var scrollEvent = 'scroll.select2.' + container.id;
                    var resizeEvent = 'resize.select2.' + container.id;
                    var orientationEvent = 'orientationchange.select2.' + container.id;
                    this.$container.parents().filter(Utils.hasScroll).off(scrollEvent);
                    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
                };
                AttachBody.prototype._positionDropdown = function () {
                    var $window = $(window);
                    var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
                    var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');
                    var newDirection = null;
                    var offset = this.$container.offset();
                    offset.bottom = offset.top + this.$container.outerHeight(false);
                    var container = {height: this.$container.outerHeight(false)};
                    container.top = offset.top;
                    container.bottom = offset.top + container.height;
                    var dropdown = {height: this.$dropdown.outerHeight(false)};
                    var viewport = {
                        top: $window.scrollTop(),
                        bottom: $window.scrollTop() + $window.height(),
                    };
                    var enoughRoomAbove = viewport.top < offset.top - dropdown.height;
                    var enoughRoomBelow = viewport.bottom > offset.bottom + dropdown.height;
                    var css = {
                        left: offset.left,
                        top: container.bottom,
                    };
                    var $offsetParent = this.$dropdownParent;
                    if ($offsetParent.css('position') === 'static')
                        $offsetParent = $offsetParent.offsetParent();
                    var parentOffset = {
                        top: 0,
                        left: 0,
                    };
                    if ($.contains(document.body, $offsetParent[0]) || $offsetParent[0].isConnected)
                        parentOffset = $offsetParent.offset();
                    css.top -= parentOffset.top;
                    css.left -= parentOffset.left;
                    if (!isCurrentlyAbove && !isCurrentlyBelow) newDirection = 'below';
                    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove)
                        newDirection = 'above';
                    else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove)
                        newDirection = 'below';
                    if (newDirection == 'above' || (isCurrentlyAbove && newDirection !== 'below'))
                        css.top = container.top - parentOffset.top - dropdown.height;
                    if (newDirection != null) {
                        this.$dropdown
                            .removeClass('select2-dropdown--below select2-dropdown--above')
                            .addClass('select2-dropdown--' + newDirection);
                        this.$container
                            .removeClass('select2-container--below select2-container--above')
                            .addClass('select2-container--' + newDirection);
                    }
                    this.$dropdownContainer.css(css);
                };
                AttachBody.prototype._resizeDropdown = function () {
                    var css = {width: this.$container.outerWidth(false) + 'px'};
                    if (this.options.get('dropdownAutoWidth')) {
                        css.minWidth = css.width;
                        css.position = 'relative';
                        css.width = 'auto';
                    }
                    this.$dropdown.css(css);
                };
                AttachBody.prototype._showDropdown = function (decorated) {
                    this.$dropdownContainer.appendTo(this.$dropdownParent);
                    this._positionDropdown();
                    this._resizeDropdown();
                };
                return AttachBody;
            });
            S2.define('select2/dropdown/minimumResultsForSearch', [], function () {
                function countResults(data) {
                    var count = 0;
                    for (var d = 0; d < data.length; d++) {
                        var item = data[d];
                        if (item.children) count += countResults(item.children);
                        else count++;
                    }
                    return count;
                }
                function MinimumResultsForSearch(decorated, $element, options, dataAdapter) {
                    this.minimumResultsForSearch = options.get('minimumResultsForSearch');
                    if (this.minimumResultsForSearch < 0) this.minimumResultsForSearch = Infinity;
                    decorated.call(this, $element, options, dataAdapter);
                }
                MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
                    if (countResults(params.data.results) < this.minimumResultsForSearch)
                        return false;
                    return decorated.call(this, params);
                };
                return MinimumResultsForSearch;
            });
            S2.define('select2/dropdown/selectOnClose', ['../utils'], function (Utils) {
                function SelectOnClose() {}
                SelectOnClose.prototype.bind = function (decorated, container, $container) {
                    var self = this;
                    decorated.call(this, container, $container);
                    container.on('close', function (params) {
                        self._handleSelectOnClose(params);
                    });
                };
                SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
                    if (params && params.originalSelect2Event != null) {
                        var event = params.originalSelect2Event;
                        if (event._type === 'select' || event._type === 'unselect') return;
                    }
                    var $highlightedResults = this.getHighlightedResults();
                    if ($highlightedResults.length < 1) return;
                    var data = Utils.GetData($highlightedResults[0], 'data');
                    if (
                        (data.element != null && data.element.selected) ||
                        (data.element == null && data.selected)
                    )
                        return;
                    this.trigger('select', {data});
                };
                return SelectOnClose;
            });
            S2.define('select2/dropdown/closeOnSelect', [], function () {
                function CloseOnSelect() {}
                CloseOnSelect.prototype.bind = function (decorated, container, $container) {
                    var self = this;
                    decorated.call(this, container, $container);
                    container.on('select', function (evt) {
                        self._selectTriggered(evt);
                    });
                    container.on('unselect', function (evt) {
                        self._selectTriggered(evt);
                    });
                };
                CloseOnSelect.prototype._selectTriggered = function (_, evt) {
                    var originalEvent = evt.originalEvent;
                    if (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey)) return;
                    this.trigger('close', {
                        originalEvent,
                        originalSelect2Event: evt,
                    });
                };
                return CloseOnSelect;
            });
            S2.define('select2/i18n/en', [], function () {
                return {
                    errorLoading: function () {
                        return 'The results could not be loaded.';
                    },
                    inputTooLong: function (args) {
                        var overChars = args.input.length - args.maximum;
                        var message = 'Please delete ' + overChars + ' character';
                        if (overChars != 1) message += 's';
                        return message;
                    },
                    inputTooShort: function (args) {
                        return (
                            'Please enter ' +
                            (args.minimum - args.input.length) +
                            ' or more characters'
                        );
                    },
                    loadingMore: function () {
                        return 'Loading more results…';
                    },
                    maximumSelected: function (args) {
                        var message = 'You can only select ' + args.maximum + ' item';
                        if (args.maximum != 1) message += 's';
                        return message;
                    },
                    noResults: function () {
                        return 'No results found';
                    },
                    searching: function () {
                        return 'Searching…';
                    },
                    removeAllItems: function () {
                        return 'Remove all items';
                    },
                };
            });
            S2.define(
                'select2/defaults',
                [
                    'jquery',
                    'require',
                    './results',
                    './selection/single',
                    './selection/multiple',
                    './selection/placeholder',
                    './selection/allowClear',
                    './selection/search',
                    './selection/eventRelay',
                    './utils',
                    './translation',
                    './diacritics',
                    './data/select',
                    './data/array',
                    './data/ajax',
                    './data/tags',
                    './data/tokenizer',
                    './data/minimumInputLength',
                    './data/maximumInputLength',
                    './data/maximumSelectionLength',
                    './dropdown',
                    './dropdown/search',
                    './dropdown/hidePlaceholder',
                    './dropdown/infiniteScroll',
                    './dropdown/attachBody',
                    './dropdown/minimumResultsForSearch',
                    './dropdown/selectOnClose',
                    './dropdown/closeOnSelect',
                    './i18n/en',
                ],
                function (
                    $,
                    require,
                    ResultsList,
                    SingleSelection,
                    MultipleSelection,
                    Placeholder,
                    AllowClear,
                    SelectionSearch,
                    EventRelay,
                    Utils,
                    Translation,
                    DIACRITICS,
                    SelectData,
                    ArrayData,
                    AjaxData,
                    Tags,
                    Tokenizer,
                    MinimumInputLength,
                    MaximumInputLength,
                    MaximumSelectionLength,
                    Dropdown,
                    DropdownSearch,
                    HidePlaceholder,
                    InfiniteScroll,
                    AttachBody,
                    MinimumResultsForSearch,
                    SelectOnClose,
                    CloseOnSelect,
                    EnglishTranslation,
                ) {
                    function Defaults() {
                        this.reset();
                    }
                    Defaults.prototype.apply = function (options) {
                        options = $.extend(true, {}, this.defaults, options);
                        if (options.dataAdapter == null) {
                            if (options.ajax != null) options.dataAdapter = AjaxData;
                            else if (options.data != null) options.dataAdapter = ArrayData;
                            else options.dataAdapter = SelectData;
                            if (options.minimumInputLength > 0)
                                options.dataAdapter = Utils.Decorate(
                                    options.dataAdapter,
                                    MinimumInputLength,
                                );
                            if (options.maximumInputLength > 0)
                                options.dataAdapter = Utils.Decorate(
                                    options.dataAdapter,
                                    MaximumInputLength,
                                );
                            if (options.maximumSelectionLength > 0)
                                options.dataAdapter = Utils.Decorate(
                                    options.dataAdapter,
                                    MaximumSelectionLength,
                                );
                            if (options.tags)
                                options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
                            if (options.tokenSeparators != null || options.tokenizer != null)
                                options.dataAdapter = Utils.Decorate(
                                    options.dataAdapter,
                                    Tokenizer,
                                );
                            if (options.query != null) {
                                var Query = require(options.amdBase + 'compat/query');
                                options.dataAdapter = Utils.Decorate(options.dataAdapter, Query);
                            }
                            if (options.initSelection != null) {
                                var InitSelection = require(
                                    options.amdBase + 'compat/initSelection',
                                );
                                options.dataAdapter = Utils.Decorate(
                                    options.dataAdapter,
                                    InitSelection,
                                );
                            }
                        }
                        if (options.resultsAdapter == null) {
                            options.resultsAdapter = ResultsList;
                            if (options.ajax != null)
                                options.resultsAdapter = Utils.Decorate(
                                    options.resultsAdapter,
                                    InfiniteScroll,
                                );
                            if (options.placeholder != null)
                                options.resultsAdapter = Utils.Decorate(
                                    options.resultsAdapter,
                                    HidePlaceholder,
                                );
                            if (options.selectOnClose)
                                options.resultsAdapter = Utils.Decorate(
                                    options.resultsAdapter,
                                    SelectOnClose,
                                );
                        }
                        if (options.dropdownAdapter == null) {
                            if (options.multiple) options.dropdownAdapter = Dropdown;
                            else {
                                var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);
                                options.dropdownAdapter = SearchableDropdown;
                            }
                            if (options.minimumResultsForSearch !== 0)
                                options.dropdownAdapter = Utils.Decorate(
                                    options.dropdownAdapter,
                                    MinimumResultsForSearch,
                                );
                            if (options.closeOnSelect)
                                options.dropdownAdapter = Utils.Decorate(
                                    options.dropdownAdapter,
                                    CloseOnSelect,
                                );
                            if (
                                options.dropdownCssClass != null ||
                                options.dropdownCss != null ||
                                options.adaptDropdownCssClass != null
                            ) {
                                var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');
                                options.dropdownAdapter = Utils.Decorate(
                                    options.dropdownAdapter,
                                    DropdownCSS,
                                );
                            }
                            options.dropdownAdapter = Utils.Decorate(
                                options.dropdownAdapter,
                                AttachBody,
                            );
                        }
                        if (options.selectionAdapter == null) {
                            if (options.multiple) options.selectionAdapter = MultipleSelection;
                            else options.selectionAdapter = SingleSelection;
                            if (options.placeholder != null)
                                options.selectionAdapter = Utils.Decorate(
                                    options.selectionAdapter,
                                    Placeholder,
                                );
                            if (options.allowClear)
                                options.selectionAdapter = Utils.Decorate(
                                    options.selectionAdapter,
                                    AllowClear,
                                );
                            if (options.multiple)
                                options.selectionAdapter = Utils.Decorate(
                                    options.selectionAdapter,
                                    SelectionSearch,
                                );
                            if (
                                options.containerCssClass != null ||
                                options.containerCss != null ||
                                options.adaptContainerCssClass != null
                            ) {
                                var ContainerCSS = require(options.amdBase + 'compat/containerCss');
                                options.selectionAdapter = Utils.Decorate(
                                    options.selectionAdapter,
                                    ContainerCSS,
                                );
                            }
                            options.selectionAdapter = Utils.Decorate(
                                options.selectionAdapter,
                                EventRelay,
                            );
                        }
                        options.language = this._resolveLanguage(options.language);
                        options.language.push('en');
                        var uniqueLanguages = [];
                        for (var l = 0; l < options.language.length; l++) {
                            var language = options.language[l];
                            if (uniqueLanguages.indexOf(language) === -1)
                                uniqueLanguages.push(language);
                        }
                        options.language = uniqueLanguages;
                        options.translations = this._processTranslations(
                            options.language,
                            options.debug,
                        );
                        return options;
                    };
                    Defaults.prototype.reset = function () {
                        function stripDiacritics(text) {
                            function match(a) {
                                return DIACRITICS[a] || a;
                            }
                            return text.replace(/[^\u0000-\u007E]/g, match);
                        }
                        function matcher(params, data) {
                            if ($.trim(params.term) === '') return data;
                            if (data.children && data.children.length > 0) {
                                var match = $.extend(true, {}, data);
                                for (var c = data.children.length - 1; c >= 0; c--) {
                                    var child = data.children[c];
                                    if (matcher(params, child) == null) match.children.splice(c, 1);
                                }
                                if (match.children.length > 0) return match;
                                return matcher(params, match);
                            }
                            var original = stripDiacritics(data.text).toUpperCase();
                            var term = stripDiacritics(params.term).toUpperCase();
                            if (original.indexOf(term) > -1) return data;
                            return null;
                        }
                        this.defaults = {
                            amdBase: './',
                            amdLanguageBase: './i18n/',
                            closeOnSelect: true,
                            debug: false,
                            dropdownAutoWidth: false,
                            escapeMarkup: Utils.escapeMarkup,
                            language: {},
                            matcher,
                            minimumInputLength: 0,
                            maximumInputLength: 0,
                            maximumSelectionLength: 0,
                            minimumResultsForSearch: 0,
                            selectOnClose: false,
                            scrollAfterSelect: false,
                            sorter: function (data) {
                                return data;
                            },
                            templateResult: function (result) {
                                return result.text;
                            },
                            templateSelection: function (selection) {
                                return selection.text;
                            },
                            theme: 'default',
                            width: 'resolve',
                        };
                    };
                    Defaults.prototype.applyFromElement = function (options, $element) {
                        var optionLanguage = options.language;
                        var defaultLanguage = this.defaults.language;
                        var elementLanguage = $element.prop('lang');
                        var parentLanguage = $element.closest('[lang]').prop('lang');
                        options.language = Array.prototype.concat.call(
                            this._resolveLanguage(elementLanguage),
                            this._resolveLanguage(optionLanguage),
                            this._resolveLanguage(defaultLanguage),
                            this._resolveLanguage(parentLanguage),
                        );
                        return options;
                    };
                    Defaults.prototype._resolveLanguage = function (language) {
                        if (!language) return [];
                        if ($.isEmptyObject(language)) return [];
                        if ($.isPlainObject(language)) return [language];
                        var languages;
                        if (!$.isArray(language)) languages = [language];
                        else languages = language;
                        var resolvedLanguages = [];
                        for (var l = 0; l < languages.length; l++) {
                            resolvedLanguages.push(languages[l]);
                            if (typeof languages[l] === 'string' && languages[l].indexOf('-') > 0) {
                                var baseLanguage = languages[l].split('-')[0];
                                resolvedLanguages.push(baseLanguage);
                            }
                        }
                        return resolvedLanguages;
                    };
                    Defaults.prototype._processTranslations = function (languages, debug) {
                        var translations = new Translation();
                        for (var l = 0; l < languages.length; l++) {
                            var languageData = new Translation();
                            var language = languages[l];
                            if (typeof language === 'string')
                                try {
                                    languageData = Translation.loadPath(language);
                                } catch (e) {
                                    try {
                                        language = this.defaults.amdLanguageBase + language;
                                        languageData = Translation.loadPath(language);
                                    } catch (ex) {
                                        if (debug && window.console && console.warn)
                                            console.warn(
                                                'Select2: The language file for "' +
                                                    language +
                                                    '" could not be automatically loaded. A fallback will be used instead.',
                                            );
                                    }
                                }
                            else if ($.isPlainObject(language))
                                languageData = new Translation(language);
                            else languageData = language;
                            translations.extend(languageData);
                        }
                        return translations;
                    };
                    Defaults.prototype.set = function (key, value) {
                        var camelKey = $.camelCase(key);
                        var data = {};
                        data[camelKey] = value;
                        var convertedData = Utils._convertData(data);
                        $.extend(true, this.defaults, convertedData);
                    };
                    return new Defaults();
                },
            );
            S2.define(
                'select2/options',
                ['require', 'jquery', './defaults', './utils'],
                function (require, $, Defaults, Utils) {
                    function Options(options, $element) {
                        this.options = options;
                        if ($element != null) this.fromElement($element);
                        if ($element != null)
                            this.options = Defaults.applyFromElement(this.options, $element);
                        this.options = Defaults.apply(this.options);
                        if ($element && $element.is('input')) {
                            var InputCompat = require(this.get('amdBase') + 'compat/inputData');
                            this.options.dataAdapter = Utils.Decorate(
                                this.options.dataAdapter,
                                InputCompat,
                            );
                        }
                    }
                    Options.prototype.fromElement = function ($e) {
                        var excludedData = ['select2'];
                        if (this.options.multiple == null)
                            this.options.multiple = $e.prop('multiple');
                        if (this.options.disabled == null)
                            this.options.disabled = $e.prop('disabled');
                        if (this.options.dir == null)
                            if ($e.prop('dir')) this.options.dir = $e.prop('dir');
                            else if ($e.closest('[dir]').prop('dir'))
                                this.options.dir = $e.closest('[dir]').prop('dir');
                            else this.options.dir = 'ltr';
                        $e.prop('disabled', this.options.disabled);
                        $e.prop('multiple', this.options.multiple);
                        if (Utils.GetData($e[0], 'select2Tags')) {
                            if (this.options.debug && window.console && console.warn)
                                console.warn(
                                    'Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.',
                                );
                            Utils.StoreData($e[0], 'data', Utils.GetData($e[0], 'select2Tags'));
                            Utils.StoreData($e[0], 'tags', true);
                        }
                        if (Utils.GetData($e[0], 'ajaxUrl')) {
                            if (this.options.debug && window.console && console.warn)
                                console.warn(
                                    'Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2.',
                                );
                            $e.attr('ajax--url', Utils.GetData($e[0], 'ajaxUrl'));
                            Utils.StoreData($e[0], 'ajax-Url', Utils.GetData($e[0], 'ajaxUrl'));
                        }
                        var dataset = {};
                        function upperCaseLetter(_, letter) {
                            return letter.toUpperCase();
                        }
                        for (var attr = 0; attr < $e[0].attributes.length; attr++) {
                            var attributeName = $e[0].attributes[attr].name;
                            var prefix = 'data-';
                            if (attributeName.substr(0, prefix.length) == prefix) {
                                var dataName = attributeName.substring(prefix.length);
                                var dataValue = Utils.GetData($e[0], dataName);
                                var camelDataName = dataName.replace(/-([a-z])/g, upperCaseLetter);
                                dataset[camelDataName] = dataValue;
                            }
                        }
                        if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset)
                            dataset = $.extend(true, {}, $e[0].dataset, dataset);
                        var data = $.extend(true, {}, Utils.GetData($e[0]), dataset);
                        data = Utils._convertData(data);
                        for (var key in data) {
                            if ($.inArray(key, excludedData) > -1) continue;
                            if ($.isPlainObject(this.options[key]))
                                $.extend(this.options[key], data[key]);
                            else this.options[key] = data[key];
                        }
                        return this;
                    };
                    Options.prototype.get = function (key) {
                        return this.options[key];
                    };
                    Options.prototype.set = function (key, val) {
                        this.options[key] = val;
                    };
                    return Options;
                },
            );
            S2.define(
                'select2/core',
                ['jquery', './options', './utils', './keys'],
                function ($, Options, Utils, KEYS) {
                    var Select2 = function ($element, options) {
                        if (Utils.GetData($element[0], 'select2') != null)
                            Utils.GetData($element[0], 'select2').destroy();
                        this.$element = $element;
                        this.id = this._generateId($element);
                        options = options || {};
                        this.options = new Options(options, $element);
                        Select2.__super__.constructor.call(this);
                        var tabindex = $element.attr('tabindex') || 0;
                        Utils.StoreData($element[0], 'old-tabindex', tabindex);
                        $element.attr('tabindex', '-1');
                        this.dataAdapter = new (this.options.get('dataAdapter'))(
                            $element,
                            this.options,
                        );
                        var $container = this.render();
                        this._placeContainer($container);
                        this.selection = new (this.options.get('selectionAdapter'))(
                            $element,
                            this.options,
                        );
                        this.$selection = this.selection.render();
                        this.selection.position(this.$selection, $container);
                        this.dropdown = new (this.options.get('dropdownAdapter'))(
                            $element,
                            this.options,
                        );
                        this.$dropdown = this.dropdown.render();
                        this.dropdown.position(this.$dropdown, $container);
                        this.results = new (this.options.get('resultsAdapter'))(
                            $element,
                            this.options,
                            this.dataAdapter,
                        );
                        this.$results = this.results.render();
                        this.results.position(this.$results, this.$dropdown);
                        var self = this;
                        this._bindAdapters();
                        this._registerDomEvents();
                        this._registerDataEvents();
                        this._registerSelectionEvents();
                        this._registerDropdownEvents();
                        this._registerResultsEvents();
                        this._registerEvents();
                        this.dataAdapter.current(function (initialData) {
                            self.trigger('selection:update', {data: initialData});
                        });
                        $element.addClass('select2-hidden-accessible');
                        $element.attr('aria-hidden', 'true');
                        this._syncAttributes();
                        Utils.StoreData($element[0], 'select2', this);
                        $element.data('select2', this);
                    };
                    Utils.Extend(Select2, Utils.Observable);
                    Select2.prototype._generateId = function ($element) {
                        var id = '';
                        if ($element.attr('id') != null) id = $element.attr('id');
                        else if ($element.attr('name') != null)
                            id = $element.attr('name') + '-' + Utils.generateChars(2);
                        else id = Utils.generateChars(4);
                        id = id.replace(/(:|\.|\[|\]|,)/g, '');
                        id = 'select2-' + id;
                        return id;
                    };
                    Select2.prototype._placeContainer = function ($container) {
                        $container.insertAfter(this.$element);
                        var width = this._resolveWidth(this.$element, this.options.get('width'));
                        if (width != null) $container.css('width', width);
                    };
                    Select2.prototype._resolveWidth = function ($element, method) {
                        var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
                        if (method == 'resolve') {
                            var styleWidth = this._resolveWidth($element, 'style');
                            if (styleWidth != null) return styleWidth;
                            return this._resolveWidth($element, 'element');
                        }
                        if (method == 'element') {
                            var elementWidth = $element.outerWidth(false);
                            if (elementWidth <= 0) return 'auto';
                            return elementWidth + 'px';
                        }
                        if (method == 'style') {
                            var style = $element.attr('style');
                            if (typeof style !== 'string') return null;
                            var attrs = style.split(';');
                            for (var i = 0, l = attrs.length; i < l; i = i + 1) {
                                var matches = attrs[i].replace(/\s/g, '').match(WIDTH);
                                if (matches !== null && matches.length >= 1) return matches[1];
                            }
                            return null;
                        }
                        if (method == 'computedstyle')
                            return window.getComputedStyle($element[0]).width;
                        return method;
                    };
                    Select2.prototype._bindAdapters = function () {
                        this.dataAdapter.bind(this, this.$container);
                        this.selection.bind(this, this.$container);
                        this.dropdown.bind(this, this.$container);
                        this.results.bind(this, this.$container);
                    };
                    Select2.prototype._registerDomEvents = function () {
                        var self = this;
                        this.$element.on('change.select2', function () {
                            self.dataAdapter.current(function (data) {
                                self.trigger('selection:update', {data});
                            });
                        });
                        this.$element.on('focus.select2', function (evt) {
                            self.trigger('focus', evt);
                        });
                        this._syncA = Utils.bind(this._syncAttributes, this);
                        this._syncS = Utils.bind(this._syncSubtree, this);
                        if (this.$element[0].attachEvent)
                            this.$element[0].attachEvent('onpropertychange', this._syncA);
                        var observer =
                            window.MutationObserver ||
                            window.WebKitMutationObserver ||
                            window.MozMutationObserver;
                        if (observer != null) {
                            this._observer = new observer(function (mutations) {
                                self._syncA();
                                self._syncS(null, mutations);
                            });
                            this._observer.observe(this.$element[0], {
                                attributes: true,
                                childList: true,
                                subtree: false,
                            });
                        } else if (this.$element[0].addEventListener) {
                            this.$element[0].addEventListener(
                                'DOMAttrModified',
                                self._syncA,
                                false,
                            );
                            this.$element[0].addEventListener(
                                'DOMNodeInserted',
                                self._syncS,
                                false,
                            );
                            this.$element[0].addEventListener('DOMNodeRemoved', self._syncS, false);
                        }
                    };
                    Select2.prototype._registerDataEvents = function () {
                        var self = this;
                        this.dataAdapter.on('*', function (name, params) {
                            self.trigger(name, params);
                        });
                    };
                    Select2.prototype._registerSelectionEvents = function () {
                        var self = this;
                        var nonRelayEvents = ['toggle', 'focus'];
                        this.selection.on('toggle', function () {
                            self.toggleDropdown();
                        });
                        this.selection.on('focus', function (params) {
                            self.focus(params);
                        });
                        this.selection.on('*', function (name, params) {
                            if ($.inArray(name, nonRelayEvents) !== -1) return;
                            self.trigger(name, params);
                        });
                    };
                    Select2.prototype._registerDropdownEvents = function () {
                        var self = this;
                        this.dropdown.on('*', function (name, params) {
                            self.trigger(name, params);
                        });
                    };
                    Select2.prototype._registerResultsEvents = function () {
                        var self = this;
                        this.results.on('*', function (name, params) {
                            self.trigger(name, params);
                        });
                    };
                    Select2.prototype._registerEvents = function () {
                        var self = this;
                        this.on('open', function () {
                            self.$container.addClass('select2-container--open');
                        });
                        this.on('close', function () {
                            self.$container.removeClass('select2-container--open');
                        });
                        this.on('enable', function () {
                            self.$container.removeClass('select2-container--disabled');
                        });
                        this.on('disable', function () {
                            self.$container.addClass('select2-container--disabled');
                        });
                        this.on('blur', function () {
                            self.$container.removeClass('select2-container--focus');
                        });
                        this.on('query', function (params) {
                            if (!self.isOpen()) self.trigger('open', {});
                            this.dataAdapter.query(params, function (data) {
                                self.trigger('results:all', {
                                    data,
                                    query: params,
                                });
                            });
                        });
                        this.on('query:append', function (params) {
                            this.dataAdapter.query(params, function (data) {
                                self.trigger('results:append', {
                                    data,
                                    query: params,
                                });
                            });
                        });
                        this.on('keypress', function (evt) {
                            var key = evt.which;
                            if (self.isOpen()) {
                                if (
                                    key === KEYS.ESC ||
                                    key === KEYS.TAB ||
                                    (key === KEYS.UP && evt.altKey)
                                ) {
                                    self.close(evt);
                                    evt.preventDefault();
                                } else if (key === KEYS.ENTER) {
                                    self.trigger('results:select', {});
                                    evt.preventDefault();
                                } else if (key === KEYS.SPACE && evt.ctrlKey) {
                                    self.trigger('results:toggle', {});
                                    evt.preventDefault();
                                } else if (key === KEYS.UP) {
                                    self.trigger('results:previous', {});
                                    evt.preventDefault();
                                } else if (key === KEYS.DOWN) {
                                    self.trigger('results:next', {});
                                    evt.preventDefault();
                                }
                            } else if (
                                key === KEYS.ENTER ||
                                key === KEYS.SPACE ||
                                (key === KEYS.DOWN && evt.altKey)
                            ) {
                                self.open();
                                evt.preventDefault();
                            }
                        });
                    };
                    Select2.prototype._syncAttributes = function () {
                        this.options.set('disabled', this.$element.prop('disabled'));
                        if (this.isDisabled()) {
                            if (this.isOpen()) this.close();
                            this.trigger('disable', {});
                        } else this.trigger('enable', {});
                    };
                    Select2.prototype._isChangeMutation = function (evt, mutations) {
                        var changed = false;
                        var self = this;
                        if (
                            evt &&
                            evt.target &&
                            evt.target.nodeName !== 'OPTION' &&
                            evt.target.nodeName !== 'OPTGROUP'
                        )
                            return;
                        if (!mutations) changed = true;
                        else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
                            for (var n = 0; n < mutations.addedNodes.length; n++)
                                if (mutations.addedNodes[n].selected) changed = true;
                        } else if (mutations.removedNodes && mutations.removedNodes.length > 0)
                            changed = true;
                        else if ($.isArray(mutations))
                            $.each(mutations, function (evt, mutation) {
                                if (self._isChangeMutation(evt, mutation)) {
                                    changed = true;
                                    return false;
                                }
                            });
                        return changed;
                    };
                    Select2.prototype._syncSubtree = function (evt, mutations) {
                        var changed = this._isChangeMutation(evt, mutations);
                        var self = this;
                        if (changed)
                            this.dataAdapter.current(function (currentData) {
                                self.trigger('selection:update', {data: currentData});
                            });
                    };
                    /**
                     * Override the trigger method to automatically trigger pre-events when
                     * there are events that can be prevented.
                     */
                    Select2.prototype.trigger = function (name, args) {
                        var actualTrigger = Select2.__super__.trigger;
                        var preTriggerMap = {
                            open: 'opening',
                            close: 'closing',
                            select: 'selecting',
                            unselect: 'unselecting',
                            clear: 'clearing',
                        };
                        if (args === void 0) args = {};
                        if (name in preTriggerMap) {
                            var preTriggerName = preTriggerMap[name];
                            var preTriggerArgs = {
                                prevented: false,
                                name,
                                args,
                            };
                            actualTrigger.call(this, preTriggerName, preTriggerArgs);
                            if (preTriggerArgs.prevented) {
                                args.prevented = true;
                                return;
                            }
                        }
                        actualTrigger.call(this, name, args);
                    };
                    Select2.prototype.toggleDropdown = function () {
                        if (this.isDisabled()) return;
                        if (this.isOpen()) this.close();
                        else this.open();
                    };
                    Select2.prototype.open = function () {
                        if (this.isOpen()) return;
                        if (this.isDisabled()) return;
                        this.trigger('query', {});
                    };
                    Select2.prototype.close = function (evt) {
                        if (!this.isOpen()) return;
                        this.trigger('close', {originalEvent: evt});
                    };
                    /**
                     * Helper method to abstract the "enabled" (not "disabled") state of this
                     * object.
                     *
                     * @return {true} if the instance is not disabled.
                     * @return {false} if the instance is disabled.
                     */
                    Select2.prototype.isEnabled = function () {
                        return !this.isDisabled();
                    };
                    /**
                     * Helper method to abstract the "disabled" state of this object.
                     *
                     * @return {true} if the disabled option is true.
                     * @return {false} if the disabled option is false.
                     */
                    Select2.prototype.isDisabled = function () {
                        return this.options.get('disabled');
                    };
                    Select2.prototype.isOpen = function () {
                        return this.$container.hasClass('select2-container--open');
                    };
                    Select2.prototype.hasFocus = function () {
                        return this.$container.hasClass('select2-container--focus');
                    };
                    Select2.prototype.focus = function (data) {
                        if (this.hasFocus()) return;
                        this.$container.addClass('select2-container--focus');
                        this.trigger('focus', {});
                    };
                    Select2.prototype.enable = function (args) {
                        if (this.options.get('debug') && window.console && console.warn)
                            console.warn(
                                'Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.',
                            );
                        if (args == null || args.length === 0) args = [true];
                        var disabled = !args[0];
                        this.$element.prop('disabled', disabled);
                    };
                    Select2.prototype.data = function () {
                        if (
                            this.options.get('debug') &&
                            arguments.length > 0 &&
                            window.console &&
                            console.warn
                        )
                            console.warn(
                                'Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.',
                            );
                        var data = [];
                        this.dataAdapter.current(function (currentData) {
                            data = currentData;
                        });
                        return data;
                    };
                    Select2.prototype.val = function (args) {
                        if (this.options.get('debug') && window.console && console.warn)
                            console.warn(
                                'Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.',
                            );
                        if (args == null || args.length === 0) return this.$element.val();
                        var newVal = args[0];
                        if ($.isArray(newVal))
                            newVal = $.map(newVal, function (obj) {
                                return obj.toString();
                            });
                        this.$element.val(newVal).trigger('input').trigger('change');
                    };
                    Select2.prototype.destroy = function () {
                        this.$container.remove();
                        if (this.$element[0].detachEvent)
                            this.$element[0].detachEvent('onpropertychange', this._syncA);
                        if (this._observer != null) {
                            this._observer.disconnect();
                            this._observer = null;
                        } else if (this.$element[0].removeEventListener) {
                            this.$element[0].removeEventListener(
                                'DOMAttrModified',
                                this._syncA,
                                false,
                            );
                            this.$element[0].removeEventListener(
                                'DOMNodeInserted',
                                this._syncS,
                                false,
                            );
                            this.$element[0].removeEventListener(
                                'DOMNodeRemoved',
                                this._syncS,
                                false,
                            );
                        }
                        this._syncA = null;
                        this._syncS = null;
                        this.$element.off('.select2');
                        this.$element.attr(
                            'tabindex',
                            Utils.GetData(this.$element[0], 'old-tabindex'),
                        );
                        this.$element.removeClass('select2-hidden-accessible');
                        this.$element.attr('aria-hidden', 'false');
                        Utils.RemoveData(this.$element[0]);
                        this.$element.removeData('select2');
                        this.dataAdapter.destroy();
                        this.selection.destroy();
                        this.dropdown.destroy();
                        this.results.destroy();
                        this.dataAdapter = null;
                        this.selection = null;
                        this.dropdown = null;
                        this.results = null;
                    };
                    Select2.prototype.render = function () {
                        var $container = $(
                            '<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>',
                        );
                        $container.attr('dir', this.options.get('dir'));
                        this.$container = $container;
                        this.$container.addClass('select2-container--' + this.options.get('theme'));
                        Utils.StoreData($container[0], 'element', this.$element);
                        return $container;
                    };
                    return Select2;
                },
            );
            S2.define('jquery-mousewheel', ['jquery'], function ($) {
                return $;
            });
            S2.define(
                'jquery.select2',
                [
                    'jquery',
                    'jquery-mousewheel',
                    './select2/core',
                    './select2/defaults',
                    './select2/utils',
                ],
                function ($, _, Select2, Defaults, Utils) {
                    if ($.fn.select2 == null) {
                        var thisMethods = ['open', 'close', 'destroy'];
                        $.fn.select2 = function (options) {
                            options = options || {};
                            if (typeof options === 'object') {
                                this.each(function () {
                                    var instanceOptions = $.extend(true, {}, options);
                                    new Select2($(this), instanceOptions);
                                });
                                return this;
                            } else if (typeof options === 'string') {
                                var ret;
                                var args = Array.prototype.slice.call(arguments, 1);
                                this.each(function () {
                                    var instance = Utils.GetData(this, 'select2');
                                    if (instance == null && window.console && console.error)
                                        console.error(
                                            "The select2('" +
                                                options +
                                                "') method was called on an element that is not using Select2.",
                                        );
                                    ret = instance[options].apply(instance, args);
                                });
                                if ($.inArray(options, thisMethods) > -1) return this;
                                return ret;
                            } else throw new Error('Invalid arguments for Select2: ' + options);
                        };
                    }
                    if ($.fn.select2.defaults == null) $.fn.select2.defaults = Defaults;
                    return Select2;
                },
            );
            return {
                define: S2.define,
                require: S2.require,
            };
        })();
        var select2 = S2.require('jquery.select2');
        jQuery.fn.select2.amd = S2;
        return select2;
    });
});

//#endregion
//#region src/i18n/de/select2.js
var import_select2 = /* @__PURE__ */ __toESM(require_select2(), 1);
var import_jquery = /* @__PURE__ */ __toESM(require_jquery(), 1);
/**
 * Content from https://github.com/select2/select2/blob/master/src/js/select2/i18n/de.js
 */
function select2_default$1() {
    return {
        errorLoading: function () {
            return 'Die Ergebnisse konnten nicht geladen werden.';
        },
        inputTooLong: function (args) {
            return 'Bitte ' + (args.input.length - args.maximum) + ' Zeichen weniger eingeben';
        },
        inputTooShort: function (args) {
            return (
                'Bitte ' +
                (args.minimum - args.input.length) +
                ' Zeichen mehr eingeben, es kann nach mehreren Teilen von Namen gesucht werden'
            );
        },
        loadingMore: function () {
            return 'Lade mehr Ergebnisse…';
        },
        maximumSelected: function (args) {
            var message = 'Sie können nur ' + args.maximum + ' Eintr';
            if (args.maximum === 1) message += 'ag';
            else message += 'äge';
            message += ' auswählen';
            return message;
        },
        noResults: function () {
            return 'Keine Übereinstimmungen gefunden';
        },
        searching: function () {
            return 'Suche…';
        },
        removeAllItems: function () {
            return 'Entferne alle Gegenstände';
        },
    };
}

//#endregion
//#region src/i18n/en/select2.js
/**
 * Content from https://github.com/select2/select2/blob/master/src/js/select2/i18n/en.js
 */
function select2_default() {
    return {
        errorLoading: function () {
            return 'The results could not be loaded.';
        },
        inputTooLong: function (args) {
            var overChars = args.input.length - args.maximum;
            var message = 'Please delete ' + overChars + ' character';
            if (overChars != 1) message += 's';
            return message;
        },
        inputTooShort: function (args) {
            return (
                'Please enter ' +
                (args.minimum - args.input.length) +
                ' or more characters, you can also search for multiple parts of names'
            );
        },
        loadingMore: function () {
            return 'Loading more results…';
        },
        maximumSelected: function (args) {
            var message = 'You can only select ' + args.maximum + ' item';
            if (args.maximum != 1) message += 's';
            return message;
        },
        noResults: function () {
            return 'No results found';
        },
        searching: function () {
            return 'Searching…';
        },
        removeAllItems: function () {
            return 'Remove all items';
        },
    };
}

//#endregion
//#region ../../node_modules/@lit/reactive-element/css-tag.js
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$4 = globalThis,
    e$6 =
        t$4.ShadowRoot &&
        (void 0 === t$4.ShadyCSS || t$4.ShadyCSS.nativeShadow) &&
        'adoptedStyleSheets' in Document.prototype &&
        'replace' in CSSStyleSheet.prototype,
    s$4 = Symbol(),
    o$7 = /* @__PURE__ */ new WeakMap();
var n$5 = class {
    constructor(t, e, o) {
        if (((this._$cssResult$ = !0), o !== s$4))
            throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        ((this.cssText = t), (this.t = e));
    }
    get styleSheet() {
        let t = this.o;
        const s = this.t;
        if (e$6 && void 0 === t) {
            const e = void 0 !== s && 1 === s.length;
            (e && (t = o$7.get(s)),
                void 0 === t &&
                    ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText),
                    e && o$7.set(s, t)));
        }
        return t;
    }
    toString() {
        return this.cssText;
    }
};
const r$4 = (t) => new n$5('string' == typeof t ? t : t + '', void 0, s$4),
    i$5 = (t, ...e) => {
        return new n$5(
            1 === t.length
                ? t[0]
                : e.reduce(
                      (e, s, o) =>
                          e +
                          ((t) => {
                              if (!0 === t._$cssResult$) return t.cssText;
                              if ('number' == typeof t) return t;
                              throw Error(
                                  "Value passed to 'css' function must be a 'css' function result: " +
                                      t +
                                      ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.",
                              );
                          })(s) +
                          t[o + 1],
                      t[0],
                  ),
            t,
            s$4,
        );
    },
    S$1 = (s, o) => {
        if (e$6)
            s.adoptedStyleSheets = o.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
        else
            for (const e of o) {
                const o = document.createElement('style'),
                    n = t$4.litNonce;
                (void 0 !== n && o.setAttribute('nonce', n),
                    (o.textContent = e.cssText),
                    s.appendChild(o));
            }
    },
    c$4 = e$6
        ? (t) => t
        : (t) =>
              t instanceof CSSStyleSheet
                  ? ((t) => {
                        let e = '';
                        for (const s of t.cssRules) e += s.cssText;
                        return r$4(e);
                    })(t)
                  : t;

//#endregion
//#region ../../node_modules/@lit/reactive-element/reactive-element.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const {
        is: i$4,
        defineProperty: e$5,
        getOwnPropertyDescriptor: h$3,
        getOwnPropertyNames: r$3,
        getOwnPropertySymbols: o$6,
        getPrototypeOf: n$4,
    } = Object,
    a$1 = globalThis,
    c$3 = a$1.trustedTypes,
    l$3 = c$3 ? c$3.emptyScript : '',
    p$2 = a$1.reactiveElementPolyfillSupport,
    d$2 = (t, s) => t,
    u$2 = {
        toAttribute(t, s) {
            switch (s) {
                case Boolean:
                    t = t ? l$3 : null;
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
    f$3 = (t, s) => !i$4(t, s),
    b$1 = {
        attribute: !0,
        type: String,
        converter: u$2,
        reflect: !1,
        useDefault: !1,
        hasChanged: f$3,
    };
((Symbol.metadata ??= Symbol('metadata')),
    (a$1.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap()));
var y$1 = class extends HTMLElement {
    static addInitializer(t) {
        (this._$Ei(), (this.l ??= []).push(t));
    }
    static get observedAttributes() {
        return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
    }
    static createProperty(t, s = b$1) {
        if (
            (s.state && (s.attribute = !1),
            this._$Ei(),
            this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0),
            this.elementProperties.set(t, s),
            !s.noAccessor)
        ) {
            const i = Symbol(),
                h = this.getPropertyDescriptor(t, i, s);
            void 0 !== h && e$5(this.prototype, t, h);
        }
    }
    static getPropertyDescriptor(t, s, i) {
        const {get: e, set: r} = h$3(this.prototype, t) ?? {
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
            configurable: !0,
            enumerable: !0,
        };
    }
    static getPropertyOptions(t) {
        return this.elementProperties.get(t) ?? b$1;
    }
    static _$Ei() {
        if (this.hasOwnProperty(d$2('elementProperties'))) return;
        const t = n$4(this);
        (t.finalize(),
            void 0 !== t.l && (this.l = [...t.l]),
            (this.elementProperties = new Map(t.elementProperties)));
    }
    static finalize() {
        if (this.hasOwnProperty(d$2('finalized'))) return;
        if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(d$2('properties')))) {
            const t = this.properties,
                s = [...r$3(t), ...o$6(t)];
            for (const i of s) this.createProperty(i, t[i]);
        }
        const t = this[Symbol.metadata];
        if (null !== t) {
            const s = litPropertyMetadata.get(t);
            if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
        }
        this._$Eh = /* @__PURE__ */ new Map();
        for (const [t, s] of this.elementProperties) {
            const i = this._$Eu(t, s);
            void 0 !== i && this._$Eh.set(i, t);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s) {
        const i = [];
        if (Array.isArray(s)) {
            const e = new Set(s.flat(Infinity).reverse());
            for (const s of e) i.unshift(c$4(s));
        } else void 0 !== s && i.push(c$4(s));
        return i;
    }
    static _$Eu(t, s) {
        const i = s.attribute;
        return !1 === i
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
            (this.isUpdatePending = !1),
            (this.hasUpdated = !1),
            (this._$Em = null),
            this._$Ev());
    }
    _$Ev() {
        ((this._$ES = new Promise((t) => (this.enableUpdating = t))),
            (this._$AL = /* @__PURE__ */ new Map()),
            this._$E_(),
            this.requestUpdate(),
            this.constructor.l?.forEach((t) => t(this)));
    }
    addController(t) {
        ((this._$EO ??= /* @__PURE__ */ new Set()).add(t),
            void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.());
    }
    removeController(t) {
        this._$EO?.delete(t);
    }
    _$E_() {
        const t = /* @__PURE__ */ new Map(),
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
            this.enableUpdating(!0),
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
        if (void 0 !== e && !0 === i.reflect) {
            const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$2).toAttribute(
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
                          : u$2;
            this._$Em = e;
            const r = h.fromAttribute(s, t.type);
            ((this[e] = r ?? this._$Ej?.get(e) ?? r), (this._$Em = null));
        }
    }
    requestUpdate(t, s, i, e = !1, h) {
        if (void 0 !== t) {
            const r = this.constructor;
            if (
                (!1 === e && (h = this[t]),
                (i ??= r.getPropertyOptions(t)),
                !(
                    (i.hasChanged ?? f$3)(h, s) ||
                    (i.useDefault &&
                        i.reflect &&
                        h === this._$Ej?.get(t) &&
                        !this.hasAttribute(r._$Eu(t, i)))
                ))
            )
                return;
            this.C(t, s, i);
        }
        !1 === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t, s, {useDefault: i, reflect: e, wrapped: h}, r) {
        (i &&
            !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) &&
            (this._$Ej.set(t, r ?? s ?? this[t]), !0 !== h || void 0 !== r)) ||
            (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)),
            !0 === e && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
    }
    async _$EP() {
        this.isUpdatePending = !0;
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
                    !0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
                }
        }
        let t = !1;
        const s = this._$AL;
        try {
            ((t = this.shouldUpdate(s)),
                t
                    ? (this.willUpdate(s),
                      this._$EO?.forEach((t) => t.hostUpdate?.()),
                      this.update(s))
                    : this._$EM());
        } catch (s) {
            throw ((t = !1), this._$EM(), s);
        }
        t && this._$AE(s);
    }
    willUpdate(t) {}
    _$AE(t) {
        (this._$EO?.forEach((t) => t.hostUpdated?.()),
            this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
            this.updated(t));
    }
    _$EM() {
        ((this._$AL = /* @__PURE__ */ new Map()), (this.isUpdatePending = !1));
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this._$ES;
    }
    shouldUpdate(t) {
        return !0;
    }
    update(t) {
        ((this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM());
    }
    updated(t) {}
    firstUpdated(t) {}
};
((y$1.elementStyles = []),
    (y$1.shadowRootOptions = {mode: 'open'}),
    (y$1[d$2('elementProperties')] = /* @__PURE__ */ new Map()),
    (y$1[d$2('finalized')] = /* @__PURE__ */ new Map()),
    p$2?.({ReactiveElement: y$1}),
    (a$1.reactiveElementVersions ??= []).push('2.1.2'));

//#endregion
//#region ../../node_modules/lit-html/lit-html.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3 = globalThis,
    i$3 = (t) => t,
    s$3 = t$3.trustedTypes,
    e$4 = s$3 ? s$3.createPolicy('lit-html', {createHTML: (t) => t}) : void 0,
    h$2 = '$lit$',
    o$5 = `lit$${Math.random().toFixed(9).slice(2)}$`,
    n$3 = '?' + o$5,
    r$2 = `<${n$3}>`,
    l$2 = document,
    c$2 = () => l$2.createComment(''),
    a = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
    u$1 = Array.isArray,
    d$1 = (t) => u$1(t) || 'function' == typeof t?.[Symbol.iterator],
    f$2 = '[ 	\n\f\r]',
    v$1 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    _ = /-->/g,
    m$1 = />/g,
    p$1 = RegExp(
        `>|${f$2}(?:([^\\s"'>=/]+)(${f$2}*=${f$2}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,
        'g',
    ),
    g = /'/g,
    $$2 = /"/g,
    y = /^(?:script|style|textarea|title)$/i,
    x =
        (t) =>
        (i, ...s) => ({
            _$litType$: t,
            strings: i,
            values: s,
        }),
    b = x(1),
    w = x(2),
    T = x(3),
    E = Symbol.for('lit-noChange'),
    A = Symbol.for('lit-nothing'),
    C = /* @__PURE__ */ new WeakMap(),
    P = l$2.createTreeWalker(l$2, 129);
function V(t, i) {
    if (!u$1(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
    return void 0 !== e$4 ? e$4.createHTML(i) : i;
}
const N = (t, i) => {
    const s = t.length - 1,
        e = [];
    let n,
        l = 2 === i ? '<svg>' : 3 === i ? '<math>' : '',
        c = v$1;
    for (let i = 0; i < s; i++) {
        const s = t[i];
        let a,
            u,
            d = -1,
            f = 0;
        for (; f < s.length && ((c.lastIndex = f), (u = c.exec(s)), null !== u); )
            ((f = c.lastIndex),
                c === v$1
                    ? '!--' === u[1]
                        ? (c = _)
                        : void 0 !== u[1]
                          ? (c = m$1)
                          : void 0 !== u[2]
                            ? (y.test(u[2]) && (n = RegExp('</' + u[2], 'g')), (c = p$1))
                            : void 0 !== u[3] && (c = p$1)
                    : c === p$1
                      ? '>' === u[0]
                          ? ((c = n ?? v$1), (d = -1))
                          : void 0 === u[1]
                            ? (d = -2)
                            : ((d = c.lastIndex - u[2].length),
                              (a = u[1]),
                              (c = void 0 === u[3] ? p$1 : '"' === u[3] ? $$2 : g))
                      : c === $$2 || c === g
                        ? (c = p$1)
                        : c === _ || c === m$1
                          ? (c = v$1)
                          : ((c = p$1), (n = void 0)));
        const x = c === p$1 && t[i + 1].startsWith('/>') ? ' ' : '';
        l +=
            c === v$1
                ? s + r$2
                : d >= 0
                  ? (e.push(a), s.slice(0, d) + h$2 + s.slice(d) + o$5 + x)
                  : s + o$5 + (-2 === d ? i : x);
    }
    return [V(t, l + (t[s] || '<?>') + (2 === i ? '</svg>' : 3 === i ? '</math>' : '')), e];
};
var S = class S {
    constructor({strings: t, _$litType$: i}, e) {
        let r;
        this.parts = [];
        let l = 0,
            a = 0;
        const u = t.length - 1,
            d = this.parts,
            [f, v] = N(t, i);
        if (
            ((this.el = S.createElement(f, e)),
            (P.currentNode = this.el.content),
            2 === i || 3 === i)
        ) {
            const t = this.el.content.firstChild;
            t.replaceWith(...t.childNodes);
        }
        for (; null !== (r = P.nextNode()) && d.length < u; ) {
            if (1 === r.nodeType) {
                if (r.hasAttributes())
                    for (const t of r.getAttributeNames())
                        if (t.endsWith(h$2)) {
                            const i = v[a++],
                                s = r.getAttribute(t).split(o$5),
                                e = /([.?@])?(.*)/.exec(i);
                            (d.push({
                                type: 1,
                                index: l,
                                name: e[2],
                                strings: s,
                                ctor: '.' === e[1] ? I : '?' === e[1] ? L : '@' === e[1] ? z : H,
                            }),
                                r.removeAttribute(t));
                        } else
                            t.startsWith(o$5) &&
                                (d.push({
                                    type: 6,
                                    index: l,
                                }),
                                r.removeAttribute(t));
                if (y.test(r.tagName)) {
                    const t = r.textContent.split(o$5),
                        i = t.length - 1;
                    if (i > 0) {
                        r.textContent = s$3 ? s$3.emptyScript : '';
                        for (let s = 0; s < i; s++)
                            (r.append(t[s], c$2()),
                                P.nextNode(),
                                d.push({
                                    type: 2,
                                    index: ++l,
                                }));
                        r.append(t[i], c$2());
                    }
                }
            } else if (8 === r.nodeType)
                if (r.data === n$3)
                    d.push({
                        type: 2,
                        index: l,
                    });
                else {
                    let t = -1;
                    for (; -1 !== (t = r.data.indexOf(o$5, t + 1)); )
                        (d.push({
                            type: 7,
                            index: l,
                        }),
                            (t += o$5.length - 1));
                }
            l++;
        }
    }
    static createElement(t, i) {
        const s = l$2.createElement('template');
        return ((s.innerHTML = t), s);
    }
};
function M$1(t, i, s = t, e) {
    if (i === E) return i;
    let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
    const o = a(i) ? void 0 : i._$litDirective$;
    return (
        h?.constructor !== o &&
            (h?._$AO?.(!1),
            void 0 === o ? (h = void 0) : ((h = new o(t)), h._$AT(t, s, e)),
            void 0 !== e ? ((s._$Co ??= [])[e] = h) : (s._$Cl = h)),
        void 0 !== h && (i = M$1(t, h._$AS(t, i.values), h, e)),
        i
    );
}
var R = class {
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
            e = (t?.creationScope ?? l$2).importNode(i, !0);
        P.currentNode = e;
        let h = P.nextNode(),
            o = 0,
            n = 0,
            r = s[0];
        for (; void 0 !== r; ) {
            if (o === r.index) {
                let i;
                (2 === r.type
                    ? (i = new k(h, h.nextSibling, this, t))
                    : 1 === r.type
                      ? (i = new r.ctor(h, r.name, r.strings, this, t))
                      : 6 === r.type && (i = new Z(h, this, t)),
                    this._$AV.push(i),
                    (r = s[++n]));
            }
            o !== r?.index && ((h = P.nextNode()), o++);
        }
        return ((P.currentNode = l$2), e);
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
};
var k = class k {
    get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, i, s, e) {
        ((this.type = 2),
            (this._$AH = A),
            (this._$AN = void 0),
            (this._$AA = t),
            (this._$AB = i),
            (this._$AM = s),
            (this.options = e),
            (this._$Cv = e?.isConnected ?? !0));
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
        ((t = M$1(this, t, i)),
            a(t)
                ? t === A || null == t || '' === t
                    ? (this._$AH !== A && this._$AR(), (this._$AH = A))
                    : t !== this._$AH && t !== E && this._(t)
                : void 0 !== t._$litType$
                  ? this.$(t)
                  : void 0 !== t.nodeType
                    ? this.T(t)
                    : d$1(t)
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
        (this._$AH !== A && a(this._$AH)
            ? (this._$AA.nextSibling.data = t)
            : this.T(l$2.createTextNode(t)),
            (this._$AH = t));
    }
    $(t) {
        const {values: i, _$litType$: s} = t,
            e =
                'number' == typeof s
                    ? this._$AC(t)
                    : (void 0 === s.el && (s.el = S.createElement(V(s.h, s.h[0]), this.options)),
                      s);
        if (this._$AH?._$AD === e) this._$AH.p(i);
        else {
            const t = new R(e, this),
                s = t.u(this.options);
            (t.p(i), this.T(s), (this._$AH = t));
        }
    }
    _$AC(t) {
        let i = C.get(t.strings);
        return (void 0 === i && C.set(t.strings, (i = new S(t))), i);
    }
    k(t) {
        u$1(this._$AH) || ((this._$AH = []), this._$AR());
        const i = this._$AH;
        let s,
            e = 0;
        for (const h of t)
            (e === i.length
                ? i.push((s = new k(this.O(c$2()), this.O(c$2()), this, this.options)))
                : (s = i[e]),
                s._$AI(h),
                e++);
        e < i.length && (this._$AR(s && s._$AB.nextSibling, e), (i.length = e));
    }
    _$AR(t = this._$AA.nextSibling, s) {
        for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
            const s = i$3(t).nextSibling;
            (i$3(t).remove(), (t = s));
        }
    }
    setConnected(t) {
        void 0 === this._$AM && ((this._$Cv = t), this._$AP?.(t));
    }
};
var H = class {
    get tagName() {
        return this.element.tagName;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    constructor(t, i, s, e, h) {
        ((this.type = 1),
            (this._$AH = A),
            (this._$AN = void 0),
            (this.element = t),
            (this.name = i),
            (this._$AM = e),
            (this.options = h),
            s.length > 2 || '' !== s[0] || '' !== s[1]
                ? ((this._$AH = Array(s.length - 1).fill(/* @__PURE__ */ new String())),
                  (this.strings = s))
                : (this._$AH = A));
    }
    _$AI(t, i = this, s, e) {
        const h = this.strings;
        let o = !1;
        if (void 0 === h)
            ((t = M$1(this, t, i, 0)),
                (o = !a(t) || (t !== this._$AH && t !== E)),
                o && (this._$AH = t));
        else {
            const e = t;
            let n, r;
            for (t = h[0], n = 0; n < h.length - 1; n++)
                ((r = M$1(this, e[s + n], i, n)),
                    r === E && (r = this._$AH[n]),
                    (o ||= !a(r) || r !== this._$AH[n]),
                    r === A ? (t = A) : t !== A && (t += (r ?? '') + h[n + 1]),
                    (this._$AH[n] = r));
        }
        o && !e && this.j(t);
    }
    j(t) {
        t === A
            ? this.element.removeAttribute(this.name)
            : this.element.setAttribute(this.name, t ?? '');
    }
};
var I = class extends H {
    constructor() {
        (super(...arguments), (this.type = 3));
    }
    j(t) {
        this.element[this.name] = t === A ? void 0 : t;
    }
};
var L = class extends H {
    constructor() {
        (super(...arguments), (this.type = 4));
    }
    j(t) {
        this.element.toggleAttribute(this.name, !!t && t !== A);
    }
};
var z = class extends H {
    constructor(t, i, s, e, h) {
        (super(t, i, s, e, h), (this.type = 5));
    }
    _$AI(t, i = this) {
        if ((t = M$1(this, t, i, 0) ?? A) === E) return;
        const s = this._$AH,
            e =
                (t === A && s !== A) ||
                t.capture !== s.capture ||
                t.once !== s.once ||
                t.passive !== s.passive,
            h = t !== A && (s === A || e);
        (e && this.element.removeEventListener(this.name, this, s),
            h && this.element.addEventListener(this.name, this, t),
            (this._$AH = t));
    }
    handleEvent(t) {
        'function' == typeof this._$AH
            ? this._$AH.call(this.options?.host ?? this.element, t)
            : this._$AH.handleEvent(t);
    }
};
var Z = class {
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
        M$1(this, t);
    }
};
const j$1 = {
        M: h$2,
        P: o$5,
        A: n$3,
        C: 1,
        L: N,
        R,
        D: d$1,
        V: M$1,
        I: k,
        H,
        N: L,
        U: z,
        B: I,
        F: Z,
    },
    B = t$3.litHtmlPolyfillSupport;
(B?.(S, k), (t$3.litHtmlVersions ??= []).push('3.3.2'));
const D = (t, i, s) => {
    const e = s?.renderBefore ?? i;
    let h = e._$litPart$;
    if (void 0 === h) {
        const t = s?.renderBefore ?? null;
        e._$litPart$ = h = new k(i.insertBefore(c$2(), t), t, void 0, s ?? {});
    }
    return (h._$AI(t), h);
};

//#endregion
//#region ../../node_modules/lit-element/lit-element.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const s$2 = globalThis;
var i$2 = class extends y$1 {
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
            (this._$Do = D(r, this.renderRoot, this.renderOptions)));
    }
    connectedCallback() {
        (super.connectedCallback(), this._$Do?.setConnected(!0));
    }
    disconnectedCallback() {
        (super.disconnectedCallback(), this._$Do?.setConnected(!1));
    }
    render() {
        return E;
    }
};
((i$2._$litElement$ = !0),
    (i$2['finalized'] = !0),
    s$2.litElementHydrateSupport?.({LitElement: i$2}));
const o$4 = s$2.litElementPolyfillSupport;
o$4?.({LitElement: i$2});
(s$2.litElementVersions ??= []).push('4.2.2');

//#endregion
//#region ../../node_modules/lit-html/directives/if-defined.js
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const o$3 = (o) => o ?? A;

//#endregion
//#region ../common/package.json
var name = '@dbp-toolkit/common';

//#endregion
//#region ../common/src/icon.js
function getIconSVGURL(name$1) {
    return getAssetURL(name, 'icons/' + encodeURI(name$1) + '.svg');
}
/**
 * For icon names see https://lineicons.com
 */
var Icon = class extends i$2 {
    constructor() {
        super();
        this.name = 'bolt';
        this.ariaLabel = void 0;
    }
    static get properties() {
        return {
            name: {type: String},
            ariaLabel: {
                type: String,
                attribute: 'aria-label',
                reflect: true,
            },
        };
    }
    static get styles() {
        return i$5`
            :host {
                display: inline-block;
                height: 1em;
                width: 1em;
                min-width: 1em;
                min-height: 1em;
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
        return b`
            <style>
                #svg {
                    -webkit-mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
                    mask-image: var(--dbp-override-icon-${iconPart}, url(${iconURL}));
                }
            </style>
            <div
                id="svg"
                aria-label="${o$3(this.ariaLabel ? this.ariaLabel : void 0)}"></div>
        `;
    }
};

//#endregion
//#region ../common/src/mini-spinner.js
var MiniSpinner = class extends i$2 {
    constructor() {
        super();
        this.text = '';
    }
    static get properties() {
        return {text: {type: String}};
    }
    static get styles() {
        return i$5`
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
        return b`
            <div class="outer">
                <div class="inner">
                    <div class="ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    ${
                        this.text !== ''
                            ? b`
                      <div class="text">${this.text}</div>
                  `
                            : b``
                    }
                </div>
            </div>
        `;
    }
};

//#endregion
//#region ../../node_modules/@open-wc/dedupe-mixin/src/dedupeMixin.js
const appliedClassMixins = /* @__PURE__ */ new WeakMap();
/** Vefify if the Mixin was previously applyed
 * @private
 * @param {function} mixin      Mixin being applyed
 * @param {object} superClass   Class receiving the new mixin
 * @returns {boolean}
 */
function wasMixinPreviouslyApplied(mixin, superClass) {
    let klass = superClass;
    while (klass) {
        if (appliedClassMixins.get(klass) === mixin) return true;
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
        if (wasMixinPreviouslyApplied(mixin, superClass)) return superClass;
        const mixedClass = mixin(superClass);
        appliedClassMixins.set(mixedClass, mixin);
        return mixedClass;
    };
}

//#endregion
//#region ../../node_modules/@open-wc/scoped-elements/html-element.js
/**
 * @typedef {import('./types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsMap} ScopedElementsMap
 */
const version = '3.0.0';
const versions = window.scopedElementsVersions || (window.scopedElementsVersions = []);
if (!versions.includes(version)) versions.push(version);
/**
 * @template {import('./types.js').Constructor<HTMLElement>} T
 * @param {T} superclass
 * @return {T & import('./types.js').Constructor<ScopedElementsHost>}
 */
const ScopedElementsMixinImplementation$2 = (superclass) =>
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
            return this.constructor.__registry;
        }
        /**
         * Set the CustomElementRegistry associated to the ShadowRoot
         *
         * @param {CustomElementRegistry} registry
         */
        set registry(registry) {
            /** @type {typeof ScopedElementsHost} */ this.constructor.__registry = registry;
        }
        /**
         * @param {ShadowRootInit} options
         * @returns {ShadowRoot}
         */
        attachShadow(options) {
            const {scopedElements} = this.constructor;
            /**
             * Create a new registry if:
             * - the registry is not defined
             * - this class doesn't have its own registry *AND* has no shared registry
             * This is important specifically for superclasses/inheritance
             */
            if (
                !this.registry ||
                (this.registry === this.constructor.__registry &&
                    !Object.prototype.hasOwnProperty.call(this.constructor, '__registry'))
            ) {
                this.registry = new CustomElementRegistry();
                for (const [tagName, klass] of Object.entries(scopedElements ?? {}))
                    this.registry.define(tagName, klass);
            }
            return super.attachShadow({
                ...options,
                customElements: this.registry,
                registry: this.registry,
            });
        }
    };
const ScopedElementsMixin$2 = dedupeMixin(ScopedElementsMixinImplementation$2);

//#endregion
//#region ../../node_modules/@open-wc/scoped-elements/lit-element.js
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
    class ScopedElementsHost extends ScopedElementsMixin$2(superclass) {
        createRenderRoot() {
            const {shadowRootOptions, elementStyles} = this.constructor;
            const shadowRoot = this.attachShadow(shadowRootOptions);
            this.renderOptions.creationScope = shadowRoot;
            S$1(shadowRoot, elementStyles);
            this.renderOptions.renderBefore ??= shadowRoot.firstChild;
            return shadowRoot;
        }
    };
const ScopedElementsMixin$1 = dedupeMixin(ScopedElementsMixinImplementation$1);

//#endregion
//#region ../common/src/scoped/ScopedElementsMixin.js
/**
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
    class ScopedElementsHost extends ScopedElementsMixin$1(superclass) {
        constructor() {
            super();
            if (false) {
                this.registry = customElements;
                for (const [name, klass] of Object.entries(this.constructor.scopedElements || {}))
                    this.defineScopedElement(name, klass);
            }
        }
        createScopedElement(tagName) {
            return (supportsScopedRegistry() ? this.shadowRoot : document).createElement(tagName);
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
            if (!supportsScopedRegistry() && isNewClassWithSameName)
                console.error(
                    [
                        `You are trying to re-register the "${tagName}" custom element with a different class via ScopedElementsMixin.`,
                        'This is only possible with a CustomElementRegistry.',
                        'Your browser does not support this feature so you will need to load a polyfill for it.',
                        'Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.',
                        'e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"><\/script>" as your first script tag.',
                        'For more details you can visit https://open-wc.org/docs/development/scoped-elements/',
                    ].join('\n'),
                );
            if (!registeredClass) return this.registry.define(tagName, classToBeRegistered);
            return this.registry.get(tagName);
        }
        /**
         * @param {ShadowRootInit} options
         * @returns {ShadowRoot}
         */
        attachShadow(options) {
            const {scopedElements} = this.constructor;
            /**
             * Create a new registry if:
             * - the registry is not defined
             * - this class doesn't have its own registry *AND* has no shared registry
             * This is important specifically for superclasses/inheritance
             */
            if (
                !this.registry ||
                (this.registry === this.constructor.__registry &&
                    !Object.prototype.hasOwnProperty.call(this.constructor, '__registry'))
            ) {
                this.registry = supportsScopedRegistry()
                    ? new CustomElementRegistry()
                    : customElements;
                for (const [tagName, klass] of Object.entries(scopedElements ?? {}))
                    this.defineScopedElement(tagName, klass);
            }
            return Element.prototype.attachShadow.call(this, {
                ...options,
                customElements: this.registry,
                registry: this.registry,
            });
        }
        createRenderRoot() {
            const {shadowRootOptions, elementStyles} = this.constructor;
            const createdRoot = this.attachShadow(shadowRootOptions);
            if (supportsScopedRegistry()) this.renderOptions.creationScope = createdRoot;
            if (createdRoot instanceof ShadowRoot) {
                S$1(createdRoot, elementStyles);
                this.renderOptions.renderBefore =
                    this.renderOptions.renderBefore || createdRoot.firstChild;
            }
            return createdRoot;
        }
    };
const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);

//#endregion
//#region ../common/src/styles.js
/**
 * We want to have "neutral" colors here
 *
 * @returns {CSSResult}
 */
function getThemeCSS() {
    return i$5`
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
    return i$5`
        h2 {
            font-weight: 300;
            /*text-align: center;*/
        }

        h3 {
            font-weight: 300;
            margin-top: 0px;
            margin-bottom: 0.75rem;
        }

        p {
            font-size: 1em;
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
        button,
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
            word-wrap: break-word;
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

        #headline h1 {
            font-size: 2em;
            font-weight: normal;
        }

        ${
            doMarginPaddingReset
                ? i$5`
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
              /*here played around*/
              /*h1 {
                  font-weight: 300;
                  margin-bottom: 20px;
                  text-align: center;
              }*/
          `
                : i$5``
        }.int-link-internal

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
                url('${r$4(getIconSVGURL('chevron-down'))}');
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
function getFormAddonsCSS() {
    return i$5`
        .buttons.has-addons .button:not(:first-child) {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        .buttons.has-addons .button:not(:last-child) {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
            margin-right: -1px;
        }

        .buttons.has-addons .button:last-child {
            margin-right: 0;
        }

        .buttons.has-addons .button:hover,
        .buttons.has-addons .button.is-hovered {
            z-index: 2;
        }

        .buttons.has-addons .button:focus,
        .buttons.has-addons .button.is-focused,
        .buttons.has-addons .button:active,
        .buttons.has-addons .button.is-active,
        .buttons.has-addons .button.is-selected {
            z-index: 3;
        }

        .buttons.has-addons .button:focus:hover,
        .buttons.has-addons .button.is-focused:hover,
        .buttons.has-addons .button:active:hover,
        .buttons.has-addons .button.is-active:hover,
        .buttons.has-addons .button.is-selected:hover {
            z-index: 4;
        }

        .buttons.has-addons .button.is-expanded {
            flex-grow: 1;
            flex-shrink: 1;
        }

        .buttons.is-centered {
            justify-content: center;
        }

        .buttons.is-centered:not(.has-addons) .button:not(.is-fullwidth) {
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }

        .buttons.is-right {
            justify-content: flex-end;
        }

        .buttons.is-right:not(.has-addons) .button:not(.is-fullwidth) {
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }

        .tags.has-addons .tag {
            margin-right: 0;
        }

        .tags.has-addons .tag:not(:first-child) {
            margin-left: 0;
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        .tags.has-addons .tag:not(:last-child) {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }

        .field.has-addons {
            display: flex;
            justify-content: flex-start;
        }

        .field.has-addons .control:not(:last-child) {
            margin-right: -1px;
        }

        .field.has-addons .control:not(:first-child):not(:last-child) .button,
        .field.has-addons .control:not(:first-child):not(:last-child) .input,
        .field.has-addons .control:not(:first-child):not(:last-child) .select select {
            border-radius: 0;
        }

        .field.has-addons .control:first-child:not(:only-child) .button,
        .field.has-addons .control:first-child:not(:only-child) .input,
        .field.has-addons .control:first-child:not(:only-child) .select select {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }

        .field.has-addons .control:last-child:not(:only-child) .button,
        .field.has-addons .control:last-child:not(:only-child) .input,
        .field.has-addons .control:last-child:not(:only-child) .select select {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        .field.has-addons .control .button:not([disabled]):hover,
        .field.has-addons .control .button:not([disabled]).is-hovered,
        .field.has-addons .control .input:not([disabled]):hover,
        .field.has-addons .control .input:not([disabled]).is-hovered,
        .field.has-addons .control .select select:not([disabled]):hover,
        .field.has-addons .control .select select:not([disabled]).is-hovered {
            z-index: 2;
        }

        .field.has-addons .control .button:not([disabled]):focus,
        .field.has-addons .control .button:not([disabled]).is-focused,
        .field.has-addons .control .button:not([disabled]):active,
        .field.has-addons .control .button:not([disabled]).is-active,
        .field.has-addons .control .input:not([disabled]):focus,
        .field.has-addons .control .input:not([disabled]).is-focused,
        .field.has-addons .control .input:not([disabled]):active,
        .field.has-addons .control .input:not([disabled]).is-active,
        .field.has-addons .control .select select:not([disabled]):focus,
        .field.has-addons .control .select select:not([disabled]).is-focused,
        .field.has-addons .control .select select:not([disabled]):active,
        .field.has-addons .control .select select:not([disabled]).is-active {
            z-index: 3;
        }

        .field.has-addons .control .button:not([disabled]):focus:hover,
        .field.has-addons .control .button:not([disabled]).is-focused:hover,
        .field.has-addons .control .button:not([disabled]):active:hover,
        .field.has-addons .control .button:not([disabled]).is-active:hover,
        .field.has-addons .control .input:not([disabled]):focus:hover,
        .field.has-addons .control .input:not([disabled]).is-focused:hover,
        .field.has-addons .control .input:not([disabled]):active:hover,
        .field.has-addons .control .input:not([disabled]).is-active:hover,
        .field.has-addons .control .select select:not([disabled]):focus:hover,
        .field.has-addons .control .select select:not([disabled]).is-focused:hover,
        .field.has-addons .control .select select:not([disabled]):active:hover,
        .field.has-addons .control .select select:not([disabled]).is-active:hover {
            z-index: 4;
        }

        .field.has-addons .control.is-expanded {
            flex-grow: 1;
            flex-shrink: 1;
        }

        .field.has-addons.has-addons-centered {
            justify-content: center;
        }

        .field.has-addons.has-addons-right {
            justify-content: flex-end;
        }

        .field.has-addons.has-addons-fullwidth .control {
            flex-grow: 1;
            flex-shrink: 0;
        }
    `;
}
function getButtonCSS() {
    return i$5`
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
        .button.is-icon dbp-icon {
            top: 0px;
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
function getSelect2CSS() {
    return i$5`
        .select2-dropdown {
            border-radius: var(--dbp-border-radius);
        }

        .select2-container--default .select2-selection--single {
            border-radius: var(--dbp-border-radius);
        }

        .select2-container--default .select2-selection--single .select2-selection__rendered {
            color: inherit;
        }

        .select2-container--default .select2-selection--single .select2-selection__clear {
            font-size: 1.5em;
            font-weight: 300;
        }

        .select2-container--default .select2-selection--single .select2-selection__placeholder {
            color: var(--dbp-muted);
        }

        .select2-container--default .select2-selection--multiple .select2-selection__rendered {
            background-color: var(--dbp-background);
        }

        .select2-container--default .select2-selection--multiple {
            background-color: var(--dbp-background);
        }
        .select2-container--default .select2-selection--multiple .select2-selection__choice {
            background-color: var(--dbp-background);
        }

        .select2-container--default .select2-results__option[aria-selected='true'] {
            background-color: var(--dbp-muted);
        }

        /* Work around single selections not wrapping and breaking responsivness */
        .select2-container--default .select2-selection--single {
            height: 100% !important;
        }
        .select2-container--default .select2-selection__rendered {
            word-wrap: break-word !important;
            text-overflow: inherit !important;
            white-space: normal !important;
        }

        .select2-dropdown {
            background-color: var(--dbp-background);
        }

        .select2-container--default .select2-selection--single,
        .select2-dropdown,
        .select2-container--default .select2-search--dropdown .select2-search__field {
            background: var(--dbp-background);
            color: var(--dbp-content);
            border: var(--dbp-border);
            border-color: var(--dbp-muted);
        }
    `;
}

//#endregion
//#region ../common/src/logger.js
var LoggerType = class {
    get debug() {
        if (window.location.hash.includes('debug')) return console.debug;
        else return () => {};
    }
};
const Logger$1 = new LoggerType();

//#endregion
//#region ../common/src/provider/adapter-lit-element.js
var AdapterLitElement = class extends i$2 {
    constructor() {
        super();
        this._connected = false;
        this._deferSubscribe = false;
        this._deferUnSubscribe = false;
        this.reflectAttribute = true;
        this.subscribe = '';
        this.unsubscribe = '';
        this._callbackStore = [];
        this._propertyStore = {};
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
        if (typeof value === 'object' && value !== null)
            this.setPropertyByAttributeName(name, value);
        else this.attributeChangedCallback(name, this.getPropertyByAttributeName(name), value);
        this._lastProperties[name] = value;
        this._propertyStore[name] = value;
    }
    hasPropertyChanged(name, value) {
        return this._lastProperties[name] !== value;
    }
    hasProperty(name) {
        return Object.hasOwnProperty.call(this._propertyStore, name);
    }
    connectedCallback() {
        super.connectedCallback();
        if (this._deferUnSubscribe) {
            this.unsubscribe.split(',').forEach((element) => this.unSubscribeProviderFor(element));
            this._deferSubscribe = false;
            this.unsubscribe = '';
        }
        if (this._deferSubscribe) {
            this.subscribe.split(',').forEach((element) => this.subscribeProviderFor(element));
            this._deferSubscribe = false;
        }
        this._connected = true;
        const that = this;
        this.addEventListener(
            'dbp-subscribe',
            /**
             * @param {CustomEvent} e
             */
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
                        name,
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
            /**
             * @param {CustomEvent} e
             */
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
                        if (item.name === name) item.callback(value);
                    });
                    e.stopPropagation();
                }
            },
            false,
        );
        const config = {
            attributes: true,
            childList: false,
            subtree: false,
        };
        const callback = function (mutationsList, observer) {
            for (const mutation of mutationsList)
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
                            if (item.name === name) item.callback(value);
                        });
                    }
                }
        };
        new MutationObserver(callback).observe(this, config);
        if (this.hasAttributes()) {
            const attrs = this.attributes;
            for (let i = attrs.length - 1; i >= 0; i--) {
                if (['id', 'class', 'style', 'data-tag-name'].includes(attrs[i].name)) continue;
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
        this.subscribe.split(',').forEach((element) => this.unSubscribeProviderFor(element));
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
                    if (value === void 0) return;
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
                    if (typeof value === 'object' && value !== null)
                        that.setPropertyByAttributeName(local, value);
                    else {
                        that.attributeChangedCallback(
                            local,
                            that.getPropertyByAttributeName(local),
                            value,
                        );
                        if (that.getAttribute(local) !== null) {
                            console.warn(
                                'Provider callback: "' +
                                    local +
                                    '" is also an attribute in tag "' +
                                    that.tagName +
                                    '", this is not supported!',
                            );
                            if (that.reflectAttribute) that.setAttribute(local, value);
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
            providerRoot: {
                type: Boolean,
                attribute: 'provider-root',
            },
        };
    }
    findPropertyName(attributeName) {
        let resultName = attributeName;
        const properties = this.constructor.properties;
        for (const propertyName in properties)
            if (properties[propertyName].attribute === attributeName) {
                resultName = propertyName;
                break;
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
                if (this.subscribe && this.subscribe.length > 0)
                    if (this._connected)
                        this.subscribe
                            .split(',')
                            .forEach((element) => this.unSubscribeProviderFor(element));
                    else {
                        this._deferUnSubscribe = this.subscribe.length > 0;
                        this.unsubscribe = this.subscribe;
                    }
                if (newValue !== null) {
                    this.subscribe = newValue;
                    if (this._connected)
                        newValue
                            .split(',')
                            .forEach((element) => this.subscribeProviderFor(element));
                    else this._deferSubscribe = newValue && newValue.length > 0;
                }
                break;
            default:
                if (
                    (typeof oldValue === 'object' && !oldValue && !newValue) ||
                    (!newValue && oldValue && name)
                )
                    break;
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
            detail: {
                name,
                value,
            },
        });
        return (this.parentElement && !sendToSelf ? this.parentElement : this).dispatchEvent(event);
    }
};

//#endregion
//#region ../common/src/internal.js
function _parseUrlComponents(url) {
    const parsedUrl = new URL(url, 'https://example.com');
    return {
        pathname: parsedUrl.pathname,
        pathSegments: parsedUrl.pathname
            .split('/')
            .filter((segment) => segment !== '')
            .map((segment) => decodeURIComponent(segment)),
        queryParams: parsedUrl.searchParams,
        queryString: parsedUrl.search,
        hash: parsedUrl.hash,
        fragment: parsedUrl.hash.replace(/^#/, ''),
    };
}

//#endregion
//#region ../common/src/dbp-lit-element.js
var DBPLitElement = class extends AdapterLitElement {
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
            htmlOverrides: {
                type: String,
                attribute: 'html-overrides',
            },
            routingUrl: {
                type: String,
                attribute: 'routing-url',
            },
        };
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._globalSlotsContainer !== null) this._globalSlotsContainer.remove();
    }
    _(selector) {
        return this.renderRoot.querySelector(selector);
    }
    _a(selector) {
        return this.renderRoot.querySelectorAll(selector);
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
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
        if (!this._renderDone) return;
        this._importLocalTemplateSlots();
        this._importGlobalTemplateSlots();
    }
    _importLocalTemplateSlots() {
        if (this._localTemplateSlotsImported) return;
        let lightTemplateSlots = this.querySelectorAll(':scope > template[slot]:not([slot=""]');
        for (let templateElem of lightTemplateSlots) {
            const divElem = document.createElement('div');
            divElem.slot = templateElem.getAttribute('slot');
            divElem.appendChild(templateElem.content.cloneNode(true));
            templateElem.remove();
            this.appendChild(divElem);
        }
        this._localTemplateSlotsImported = true;
    }
    _importGlobalTemplateSlots() {
        if (this.htmlOverrides === '' || this._globalTemplateSlotsImported) return;
        /**
         * @type {HTMLTemplateElement | null}
         */
        let globalOverrideTemplateElem = document.querySelector('template#' + this.htmlOverrides);
        if (globalOverrideTemplateElem !== null) {
            const templateOverrideElem = globalOverrideTemplateElem.content
                .cloneNode(true)
                .querySelector('template#' + this.tagName.toLowerCase());
            if (templateOverrideElem !== null) {
                const templateOverrideElemClone = templateOverrideElem.content.cloneNode(true);
                let globalTemplateSlots = [];
                for (let e of templateOverrideElemClone.querySelectorAll('[slot]:not([slot=""]'))
                    if (e.parentNode === templateOverrideElemClone) globalTemplateSlots.push(e);
                for (let slotElem of globalTemplateSlots)
                    for (let elm of this.querySelectorAll('[slot="' + slotElem.slot + '"]'))
                        elm.remove();
                let container = document.createElement('div');
                globalOverrideTemplateElem.append(container);
                this._globalSlotsContainer = container;
                for (let slotElem of globalTemplateSlots) container.appendChild(slotElem);
                while (container.childNodes.length)
                    this.appendChild(container.removeChild(container.childNodes[0]));
            }
        }
        this._globalTemplateSlotsImported = true;
    }
    getRoutingData() {
        return _parseUrlComponents(this.routingUrl);
    }
};

//#endregion
//#region ../../node_modules/lit-html/directive.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2 = {
        ATTRIBUTE: 1,
        CHILD: 2,
        PROPERTY: 3,
        BOOLEAN_ATTRIBUTE: 4,
        EVENT: 5,
        ELEMENT: 6,
    },
    e$3 =
        (t) =>
        (...e) => ({
            _$litDirective$: t,
            values: e,
        });
var i$1 = class {
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
};

//#endregion
//#region ../../node_modules/lit-html/directives/class-map.js
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const e$2 = e$3(
    class extends i$1 {
        constructor(t) {
            if ((super(t), t.type !== t$2.ATTRIBUTE || 'class' !== t.name || t.strings?.length > 2))
                throw Error(
                    '`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.',
                );
        }
        render(t) {
            return (
                ' ' +
                Object.keys(t)
                    .filter((s) => t[s])
                    .join(' ') +
                ' '
            );
        }
        update(s, [i]) {
            if (void 0 === this.st) {
                ((this.st = /* @__PURE__ */ new Set()),
                    void 0 !== s.strings &&
                        (this.nt = new Set(
                            s.strings
                                .join(' ')
                                .split(/\s/)
                                .filter((t) => '' !== t),
                        )));
                for (const t in i) i[t] && !this.nt?.has(t) && this.st.add(t);
                return this.render(i);
            }
            const r = s.element.classList;
            for (const t of this.st) t in i || (r.remove(t), this.st.delete(t));
            for (const t in i) {
                const s = !!i[t];
                s === this.st.has(t) ||
                    this.nt?.has(t) ||
                    (s ? (r.add(t), this.st.add(t)) : (r.remove(t), this.st.delete(t)));
            }
            return E;
        }
    },
);

//#endregion
//#region ../../node_modules/lit-html/directives/unsafe-html.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var e$1 = class extends i$1 {
    constructor(i) {
        if ((super(i), (this.it = A), i.type !== t$2.CHILD))
            throw Error(this.constructor.directiveName + '() can only be used in child bindings');
    }
    render(r) {
        if (r === A || null == r) return ((this._t = void 0), (this.it = r));
        if (r === E) return r;
        if ('string' != typeof r)
            throw Error(this.constructor.directiveName + '() called with a non-string value');
        if (r === this.it) return this._t;
        this.it = r;
        const s = [r];
        return (
            (s.raw = s),
            (this._t = {
                _$litType$: this.constructor.resultType,
                strings: s,
                values: [],
            })
        );
    }
};
((e$1.directiveName = 'unsafeHTML'), (e$1.resultType = 1));
const o$2 = e$3(e$1);

//#endregion
//#region ../../node_modules/i18next/dist/esm/i18next.js
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
        if (Object.prototype.hasOwnProperty.call(object, key)) object = object[key];
        else object = {};
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
    if (obj !== void 0 || path.length === 1) {
        obj[k] = newValue;
        return;
    }
    let e = path[path.length - 1];
    let p = path.slice(0, path.length - 1);
    let last = getLastOfPath(object, p, Object);
    while (last.obj === void 0 && p.length) {
        e = `${p[p.length - 1]}.${e}`;
        p = p.slice(0, p.length - 1);
        last = getLastOfPath(object, p, Object);
        if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== 'undefined') last.obj = void 0;
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
    if (!obj) return void 0;
    if (!Object.prototype.hasOwnProperty.call(obj, k)) return void 0;
    return obj[k];
};
const getPathWithDefaults = (data, defaultData, key) => {
    const value = getPath(data, key);
    if (value !== void 0) return value;
    return getPath(defaultData, key);
};
const deepExtend = (target, source, overwrite) => {
    for (const prop in source)
        if (prop !== '__proto__' && prop !== 'constructor')
            if (prop in target)
                if (
                    isString(target[prop]) ||
                    target[prop] instanceof String ||
                    isString(source[prop]) ||
                    source[prop] instanceof String
                ) {
                    if (overwrite) target[prop] = source[prop];
                } else deepExtend(target[prop], source[prop], overwrite);
            else target[prop] = source[prop];
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
    if (isString(data)) return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
    return data;
};
var RegExpCache = class {
    constructor(capacity) {
        this.capacity = capacity;
        this.regExpMap = /* @__PURE__ */ new Map();
        this.regExpQueue = [];
    }
    getRegExp(pattern) {
        const regExpFromCache = this.regExpMap.get(pattern);
        if (regExpFromCache !== void 0) return regExpFromCache;
        const regExpNew = new RegExp(pattern);
        if (this.regExpQueue.length === this.capacity)
            this.regExpMap.delete(this.regExpQueue.shift());
        this.regExpMap.set(pattern, regExpNew);
        this.regExpQueue.push(pattern);
        return regExpNew;
    }
};
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
        if (ki > 0 && !r.test(key.substring(0, ki))) matched = true;
    }
    return matched;
};
const deepFind = (obj, path, keySeparator = '.') => {
    if (!obj) return void 0;
    if (obj[path]) {
        if (!Object.prototype.hasOwnProperty.call(obj, path)) return void 0;
        return obj[path];
    }
    const tokens = path.split(keySeparator);
    let current = obj;
    for (let i = 0; i < tokens.length; ) {
        if (!current || typeof current !== 'object') return;
        let next;
        let nextPath = '';
        for (let j = i; j < tokens.length; ++j) {
            if (j !== i) nextPath += keySeparator;
            nextPath += tokens[j];
            next = current[nextPath];
            if (next !== void 0) {
                if (
                    ['string', 'number', 'boolean'].indexOf(typeof next) > -1 &&
                    j < tokens.length - 1
                )
                    continue;
                i += j - i + 1;
                break;
            }
        }
        current = next;
    }
    return current;
};
const getCleanedCode = (code) => code?.replace(/_/g, '-');
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
var Logger = class Logger {
    constructor(concreteLogger, options = {}) {
        this.init(concreteLogger, options);
    }
    init(concreteLogger, options = {}) {
        this.prefix = options.prefix || 'i18next:';
        this.logger = concreteLogger || consoleLogger;
        this.options = options;
        this.debug = options.debug;
    }
    log(...args) {
        return this.forward(args, 'log', '', true);
    }
    warn(...args) {
        return this.forward(args, 'warn', '', true);
    }
    error(...args) {
        return this.forward(args, 'error', '');
    }
    deprecate(...args) {
        return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
    }
    forward(args, lvl, prefix, debugOnly) {
        if (debugOnly && !this.debug) return null;
        if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
        return this.logger[lvl](args);
    }
    create(moduleName) {
        return new Logger(this.logger, {
            prefix: `${this.prefix}:${moduleName}:`,
            ...this.options,
        });
    }
    clone(options) {
        options = options || this.options;
        options.prefix = options.prefix || this.prefix;
        return new Logger(this.logger, options);
    }
};
var baseLogger = new Logger();
var EventEmitter = class {
    constructor() {
        this.observers = {};
    }
    on(events, listener) {
        events.split(' ').forEach((event) => {
            if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
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
    emit(event, ...args) {
        if (this.observers[event])
            Array.from(this.observers[event].entries()).forEach(([observer, numTimesAdded]) => {
                for (let i = 0; i < numTimesAdded; i++) observer(...args);
            });
        if (this.observers['*'])
            Array.from(this.observers['*'].entries()).forEach(([observer, numTimesAdded]) => {
                for (let i = 0; i < numTimesAdded; i++) observer.apply(observer, [event, ...args]);
            });
    }
};
var ResourceStore = class extends EventEmitter {
    constructor(
        data,
        options = {
            ns: ['translation'],
            defaultNS: 'translation',
        },
    ) {
        super();
        this.data = data || {};
        this.options = options;
        if (this.options.keySeparator === void 0) this.options.keySeparator = '.';
        if (this.options.ignoreJSONStructure === void 0) this.options.ignoreJSONStructure = true;
    }
    addNamespaces(ns) {
        if (this.options.ns.indexOf(ns) < 0) this.options.ns.push(ns);
    }
    removeNamespaces(ns) {
        const index = this.options.ns.indexOf(ns);
        if (index > -1) this.options.ns.splice(index, 1);
    }
    getResource(lng, ns, key, options = {}) {
        const keySeparator =
            options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
        const ignoreJSONStructure =
            options.ignoreJSONStructure !== void 0
                ? options.ignoreJSONStructure
                : this.options.ignoreJSONStructure;
        let path;
        if (lng.indexOf('.') > -1) path = lng.split('.');
        else {
            path = [lng, ns];
            if (key)
                if (Array.isArray(key)) path.push(...key);
                else if (isString(key) && keySeparator) path.push(...key.split(keySeparator));
                else path.push(key);
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
    addResource(lng, ns, key, value, options = {silent: false}) {
        const keySeparator =
            options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
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
    addResources(lng, ns, resources, options = {silent: false}) {
        for (const m in resources)
            if (isString(resources[m]) || Array.isArray(resources[m]))
                this.addResource(lng, ns, m, resources[m], {silent: true});
        if (!options.silent) this.emit('added', lng, ns, resources);
    }
    addResourceBundle(
        lng,
        ns,
        resources,
        deep,
        overwrite,
        options = {
            silent: false,
            skipCopy: false,
        },
    ) {
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
        if (deep) deepExtend(pack, resources, overwrite);
        else
            pack = {
                ...pack,
                ...resources,
            };
        setPath(this.data, path, pack);
        if (!options.silent) this.emit('added', lng, ns, resources);
    }
    removeResourceBundle(lng, ns) {
        if (this.hasResourceBundle(lng, ns)) delete this.data[lng][ns];
        this.removeNamespaces(ns);
        this.emit('removed', lng, ns);
    }
    hasResourceBundle(lng, ns) {
        return this.getResource(lng, ns) !== void 0;
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
        return !!((data && Object.keys(data)) || []).find(
            (v) => data[v] && Object.keys(data[v]).length > 0,
        );
    }
    toJSON() {
        return this.data;
    }
};
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
const PATH_KEY = Symbol('i18next/PATH_KEY');
function createProxy() {
    const state = [];
    const handler = Object.create(null);
    let proxy;
    handler.get = (target, key) => {
        proxy?.revoke?.();
        if (key === PATH_KEY) return state;
        state.push(key);
        proxy = Proxy.revocable(target, handler);
        return proxy.proxy;
    };
    return Proxy.revocable(Object.create(null), handler).proxy;
}
function keysFromSelector(selector, opts) {
    const {[PATH_KEY]: path} = selector(createProxy());
    const keySeparator = opts?.keySeparator ?? '.';
    const nsSeparator = opts?.nsSeparator ?? ':';
    if (path.length > 1 && nsSeparator) {
        const ns = opts?.ns;
        if ((ns ? (Array.isArray(ns) ? ns : [ns]) : []).includes(path[0]))
            return `${path[0]}${nsSeparator}${path.slice(1).join(keySeparator)}`;
    }
    return path.join(keySeparator);
}
const checkedLoadedFor = {};
const shouldHandleAsObject = (res) =>
    !isString(res) && typeof res !== 'boolean' && typeof res !== 'number';
var Translator = class Translator extends EventEmitter {
    constructor(services, options = {}) {
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
        if (this.options.keySeparator === void 0) this.options.keySeparator = '.';
        this.logger = baseLogger.create('translator');
    }
    changeLanguage(lng) {
        if (lng) this.language = lng;
    }
    exists(key, o = {interpolation: {}}) {
        const opt = {...o};
        if (key == null) return false;
        const resolved = this.resolve(key, opt);
        if (resolved?.res === void 0) return false;
        const isObject = shouldHandleAsObject(resolved.res);
        if (opt.returnObjects === false && isObject) return false;
        return true;
    }
    extractFromKey(key, opt) {
        let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
        if (nsSeparator === void 0) nsSeparator = ':';
        const keySeparator =
            opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
        let namespaces = opt.ns || this.options.defaultNS || [];
        const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
        const seemsNaturalLanguage =
            !this.options.userDefinedKeySeparator &&
            !opt.keySeparator &&
            !this.options.userDefinedNsSeparator &&
            !opt.nsSeparator &&
            !looksLikeObjectPath(key, nsSeparator, keySeparator);
        if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
            const m = key.match(this.interpolator.nestingRegexp);
            if (m && m.length > 0)
                return {
                    key,
                    namespaces: isString(namespaces) ? [namespaces] : namespaces,
                };
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
    translate(keys, o, lastKey) {
        let opt = typeof o === 'object' ? {...o} : o;
        if (typeof opt !== 'object' && this.options.overloadTranslationOptionHandler)
            opt = this.options.overloadTranslationOptionHandler(arguments);
        if (typeof opt === 'object') opt = {...opt};
        if (!opt) opt = {};
        if (keys == null) return '';
        if (typeof keys === 'function')
            keys = keysFromSelector(keys, {
                ...this.options,
                ...opt,
            });
        if (!Array.isArray(keys)) keys = [String(keys)];
        keys = keys.map((k) =>
            typeof k === 'function'
                ? keysFromSelector(k, {
                      ...this.options,
                      ...opt,
                  })
                : String(k),
        );
        const returnDetails =
            opt.returnDetails !== void 0 ? opt.returnDetails : this.options.returnDetails;
        const keySeparator =
            opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
        const {key, namespaces} = this.extractFromKey(keys[keys.length - 1], opt);
        const namespace = namespaces[namespaces.length - 1];
        let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
        if (nsSeparator === void 0) nsSeparator = ':';
        const lng = opt.lng || this.language;
        const appendNamespaceToCIMode =
            opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
        if (lng?.toLowerCase() === 'cimode') {
            if (appendNamespaceToCIMode) {
                if (returnDetails)
                    return {
                        res: `${namespace}${nsSeparator}${key}`,
                        usedKey: key,
                        exactUsedKey: key,
                        usedLng: lng,
                        usedNS: namespace,
                        usedParams: this.getUsedParamsDetails(opt),
                    };
                return `${namespace}${nsSeparator}${key}`;
            }
            if (returnDetails)
                return {
                    res: key,
                    usedKey: key,
                    exactUsedKey: key,
                    usedLng: lng,
                    usedNS: namespace,
                    usedParams: this.getUsedParamsDetails(opt),
                };
            return key;
        }
        const resolved = this.resolve(keys, opt);
        let res = resolved?.res;
        const resUsedKey = resolved?.usedKey || key;
        const resExactUsedKey = resolved?.exactUsedKey || key;
        const noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
        const joinArrays = opt.joinArrays !== void 0 ? opt.joinArrays : this.options.joinArrays;
        const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
        const needsPluralHandling = opt.count !== void 0 && !isString(opt.count);
        const hasDefaultValue = Translator.hasDefaultValue(opt);
        const defaultValueSuffix = needsPluralHandling
            ? this.pluralResolver.getSuffix(lng, opt.count, opt)
            : '';
        const defaultValueSuffixOrdinalFallback =
            opt.ordinal && needsPluralHandling
                ? this.pluralResolver.getSuffix(lng, opt.count, {ordinal: false})
                : '';
        const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
        const defaultValue =
            (needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`]) ||
            opt[`defaultValue${defaultValueSuffix}`] ||
            opt[`defaultValue${defaultValueSuffixOrdinalFallback}`] ||
            opt.defaultValue;
        let resForObjHndl = res;
        if (handleAsObjectInI18nFormat && !res && hasDefaultValue) resForObjHndl = defaultValue;
        const handleAsObject = shouldHandleAsObject(resForObjHndl);
        const resType = Object.prototype.toString.apply(resForObjHndl);
        if (
            handleAsObjectInI18nFormat &&
            resForObjHndl &&
            handleAsObject &&
            noObject.indexOf(resType) < 0 &&
            !(isString(joinArrays) && Array.isArray(resForObjHndl))
        ) {
            if (!opt.returnObjects && !this.options.returnObjects) {
                if (!this.options.returnedObjectHandler)
                    this.logger.warn(
                        'accessing an object - but returnObjects options is not enabled!',
                    );
                const r = this.options.returnedObjectHandler
                    ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
                          ...opt,
                          ns: namespaces,
                      })
                    : `key '${key} (${this.language})' returned an object instead of string.`;
                if (returnDetails) {
                    resolved.res = r;
                    resolved.usedParams = this.getUsedParamsDetails(opt);
                    return resolved;
                }
                return r;
            }
            if (keySeparator) {
                const resTypeIsArray = Array.isArray(resForObjHndl);
                const copy = resTypeIsArray ? [] : {};
                const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
                for (const m in resForObjHndl)
                    if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
                        const deepKey = `${newKeyToUse}${keySeparator}${m}`;
                        if (hasDefaultValue && !res)
                            copy[m] = this.translate(deepKey, {
                                ...opt,
                                defaultValue: shouldHandleAsObject(defaultValue)
                                    ? defaultValue[m]
                                    : void 0,
                                joinArrays: false,
                                ns: namespaces,
                            });
                        else
                            copy[m] = this.translate(deepKey, {
                                ...opt,
                                joinArrays: false,
                                ns: namespaces,
                            });
                        if (copy[m] === deepKey) copy[m] = resForObjHndl[m];
                    }
                res = copy;
            }
        } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
            res = res.join(joinArrays);
            if (res) res = this.extendTranslation(res, keys, opt, lastKey);
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
            const resForMissing =
                (opt.missingKeyNoValueFallbackToKey ||
                    this.options.missingKeyNoValueFallbackToKey) &&
                usedKey
                    ? void 0
                    : res;
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
                        ...opt,
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
                    opt.lng || this.language,
                );
                if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0])
                    for (let i = 0; i < fallbackLngs.length; i++) lngs.push(fallbackLngs[i]);
                else if (this.options.saveMissingTo === 'all')
                    lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
                else lngs.push(opt.lng || this.language);
                const send = (l, k, specificDefaultValue) => {
                    const defaultForMissing =
                        hasDefaultValue && specificDefaultValue !== res
                            ? specificDefaultValue
                            : resForMissing;
                    if (this.options.missingKeyHandler)
                        this.options.missingKeyHandler(
                            l,
                            namespace,
                            k,
                            defaultForMissing,
                            updateMissing,
                            opt,
                        );
                    else if (this.backendConnector?.saveMissing)
                        this.backendConnector.saveMissing(
                            l,
                            namespace,
                            k,
                            defaultForMissing,
                            updateMissing,
                            opt,
                        );
                    this.emit('missingKey', l, namespace, k, res);
                };
                if (this.options.saveMissing)
                    if (this.options.saveMissingPlurals && needsPluralHandling)
                        lngs.forEach((language) => {
                            const suffixes = this.pluralResolver.getSuffixes(language, opt);
                            if (
                                needsZeroSuffixLookup &&
                                opt[`defaultValue${this.options.pluralSeparator}zero`] &&
                                suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0
                            )
                                suffixes.push(`${this.options.pluralSeparator}zero`);
                            suffixes.forEach((suffix) => {
                                send(
                                    [language],
                                    key + suffix,
                                    opt[`defaultValue${suffix}`] || defaultValue,
                                );
                            });
                        });
                    else send(lngs, key, defaultValue);
            }
            res = this.extendTranslation(res, keys, opt, resolved, lastKey);
            if (usedKey && res === key && this.options.appendNamespaceToMissingKey)
                res = `${namespace}${nsSeparator}${key}`;
            if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler)
                res = this.options.parseMissingKeyHandler(
                    this.options.appendNamespaceToMissingKey
                        ? `${namespace}${nsSeparator}${key}`
                        : key,
                    usedDefault ? res : void 0,
                    opt,
                );
        }
        if (returnDetails) {
            resolved.res = res;
            resolved.usedParams = this.getUsedParamsDetails(opt);
            return resolved;
        }
        return res;
    }
    extendTranslation(res, key, opt, resolved, lastKey) {
        if (this.i18nFormat?.parse)
            res = this.i18nFormat.parse(
                res,
                {
                    ...this.options.interpolation.defaultVariables,
                    ...opt,
                },
                opt.lng || this.language || resolved.usedLng,
                resolved.usedNS,
                resolved.usedKey,
                {resolved},
            );
        else if (!opt.skipInterpolation) {
            if (opt.interpolation)
                this.interpolator.init({
                    ...opt,
                    interpolation: {
                        ...this.options.interpolation,
                        ...opt.interpolation,
                    },
                });
            const skipOnVariables =
                isString(res) &&
                (opt?.interpolation?.skipOnVariables !== void 0
                    ? opt.interpolation.skipOnVariables
                    : this.options.interpolation.skipOnVariables);
            let nestBef;
            if (skipOnVariables) {
                const nb = res.match(this.interpolator.nestingRegexp);
                nestBef = nb && nb.length;
            }
            let data = opt.replace && !isString(opt.replace) ? opt.replace : opt;
            if (this.options.interpolation.defaultVariables)
                data = {
                    ...this.options.interpolation.defaultVariables,
                    ...data,
                };
            res = this.interpolator.interpolate(
                res,
                data,
                opt.lng || this.language || resolved.usedLng,
                opt,
            );
            if (skipOnVariables) {
                const na = res.match(this.interpolator.nestingRegexp);
                const nestAft = na && na.length;
                if (nestBef < nestAft) opt.nest = false;
            }
            if (!opt.lng && resolved && resolved.res) opt.lng = this.language || resolved.usedLng;
            if (opt.nest !== false)
                res = this.interpolator.nest(
                    res,
                    (...args) => {
                        if (lastKey?.[0] === args[0] && !opt.context) {
                            this.logger.warn(
                                `It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`,
                            );
                            return null;
                        }
                        return this.translate(...args, key);
                    },
                    opt,
                );
            if (opt.interpolation) this.interpolator.reset();
        }
        const postProcess = opt.postProcess || this.options.postProcess;
        const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
        if (res != null && postProcessorNames?.length && opt.applyPostProcessor !== false)
            res = postProcessor.handle(
                postProcessorNames,
                res,
                key,
                this.options && this.options.postProcessPassResolved
                    ? {
                          i18nResolved: {
                              ...resolved,
                              usedParams: this.getUsedParamsDetails(opt),
                          },
                          ...opt,
                      }
                    : opt,
                this,
            );
        return res;
    }
    resolve(keys, opt = {}) {
        let found;
        let usedKey;
        let exactUsedKey;
        let usedLng;
        let usedNS;
        if (isString(keys)) keys = [keys];
        if (Array.isArray(keys))
            keys = keys.map((k) =>
                typeof k === 'function'
                    ? keysFromSelector(k, {
                          ...this.options,
                          ...opt,
                      })
                    : k,
            );
        keys.forEach((k) => {
            if (this.isValidLookup(found)) return;
            const extracted = this.extractFromKey(k, opt);
            const key = extracted.key;
            usedKey = key;
            let namespaces = extracted.namespaces;
            if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
            const needsPluralHandling = opt.count !== void 0 && !isString(opt.count);
            const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
            const needsContextHandling =
                opt.context !== void 0 &&
                (isString(opt.context) || typeof opt.context === 'number') &&
                opt.context !== '';
            const codes = opt.lngs
                ? opt.lngs
                : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);
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
                    if (this.i18nFormat?.addLookupKeys)
                        this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
                    else {
                        let pluralSuffix;
                        if (needsPluralHandling)
                            pluralSuffix = this.pluralResolver.getSuffix(code, opt.count, opt);
                        const zeroSuffix = `${this.options.pluralSeparator}zero`;
                        const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
                        if (needsPluralHandling) {
                            if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0)
                                finalKeys.push(
                                    key +
                                        pluralSuffix.replace(
                                            ordinalPrefix,
                                            this.options.pluralSeparator,
                                        ),
                                );
                            finalKeys.push(key + pluralSuffix);
                            if (needsZeroSuffixLookup) finalKeys.push(key + zeroSuffix);
                        }
                        if (needsContextHandling) {
                            const contextKey = `${key}${this.options.contextSeparator || '_'}${opt.context}`;
                            finalKeys.push(contextKey);
                            if (needsPluralHandling) {
                                if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0)
                                    finalKeys.push(
                                        contextKey +
                                            pluralSuffix.replace(
                                                ordinalPrefix,
                                                this.options.pluralSeparator,
                                            ),
                                    );
                                finalKeys.push(contextKey + pluralSuffix);
                                if (needsZeroSuffixLookup) finalKeys.push(contextKey + zeroSuffix);
                            }
                        }
                    }
                    let possibleKey;
                    while ((possibleKey = finalKeys.pop()))
                        if (!this.isValidLookup(found)) {
                            exactUsedKey = possibleKey;
                            found = this.getResource(code, ns, possibleKey, opt);
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
            res !== void 0 &&
            !(!this.options.returnNull && res === null) &&
            !(!this.options.returnEmptyString && res === '')
        );
    }
    getResource(code, ns, key, options = {}) {
        if (this.i18nFormat?.getResource)
            return this.i18nFormat.getResource(code, ns, key, options);
        return this.resourceStore.getResource(code, ns, key, options);
    }
    getUsedParamsDetails(options = {}) {
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
        if (useOptionsReplaceForData && typeof options.count !== 'undefined')
            data.count = options.count;
        if (this.options.interpolation.defaultVariables)
            data = {
                ...this.options.interpolation.defaultVariables,
                ...data,
            };
        if (!useOptionsReplaceForData) {
            data = {...data};
            for (const key of optionsKeys) delete data[key];
        }
        return data;
    }
    static hasDefaultValue(options) {
        const prefix = 'defaultValue';
        for (const option in options)
            if (
                Object.prototype.hasOwnProperty.call(options, option) &&
                prefix === option.substring(0, 12) &&
                void 0 !== options[option]
            )
                return true;
        return false;
    }
};
var LanguageUtil = class {
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
            if (formattedCode && this.options.lowerCaseLng)
                formattedCode = formattedCode.toLowerCase();
            if (formattedCode) return formattedCode;
            if (this.options.lowerCaseLng) return code.toLowerCase();
            return code;
        }
        return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
    }
    isSupportedCode(code) {
        if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs)
            code = this.getLanguagePartFromCode(code);
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
        if (!found && this.options.supportedLngs)
            codes.forEach((code) => {
                if (found) return;
                const lngScOnly = this.getScriptPartFromCode(code);
                if (this.isSupportedCode(lngScOnly)) return (found = lngScOnly);
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
            (fallbackCode === false ? [] : fallbackCode) || this.options.fallbackLng || [],
            code,
        );
        const codes = [];
        const addCode = (c) => {
            if (!c) return;
            if (this.isSupportedCode(c)) codes.push(c);
            else this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
        };
        if (isString(code) && (code.indexOf('-') > -1 || code.indexOf('_') > -1)) {
            if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
            if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly')
                addCode(this.getScriptPartFromCode(code));
            if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
        } else if (isString(code)) addCode(this.formatLanguageCode(code));
        fallbackCodes.forEach((fc) => {
            if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
        });
        return codes;
    }
};
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
    resolvedOptions: () => ({pluralCategories: ['one', 'other']}),
};
var PluralResolver = class {
    constructor(languageUtils, options = {}) {
        this.languageUtils = languageUtils;
        this.options = options;
        this.logger = baseLogger.create('pluralResolver');
        this.pluralRulesCache = {};
    }
    clearCache() {
        this.pluralRulesCache = {};
    }
    getRule(code, options = {}) {
        const cleanedCode = getCleanedCode(code === 'dev' ? 'en' : code);
        const type = options.ordinal ? 'ordinal' : 'cardinal';
        const cacheKey = JSON.stringify({
            cleanedCode,
            type,
        });
        if (cacheKey in this.pluralRulesCache) return this.pluralRulesCache[cacheKey];
        let rule;
        try {
            rule = new Intl.PluralRules(cleanedCode, {type});
        } catch (err) {
            if (typeof Intl === 'undefined') {
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
    needsPlural(code, options = {}) {
        let rule = this.getRule(code, options);
        if (!rule) rule = this.getRule('dev', options);
        return rule?.resolvedOptions().pluralCategories.length > 1;
    }
    getPluralFormsOfKey(code, key, options = {}) {
        return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
    }
    getSuffixes(code, options = {}) {
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
    getSuffix(code, count, options = {}) {
        const rule = this.getRule(code, options);
        if (rule)
            return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ''}${rule.select(count)}`;
        this.logger.warn(`no plural rule found for: ${code}`);
        return this.getSuffix('dev', count, options);
    }
};
const deepFindWithDefaults = (
    data,
    defaultData,
    key,
    keySeparator = '.',
    ignoreJSONStructure = true,
) => {
    let path = getPathWithDefaults(data, defaultData, key);
    if (!path && ignoreJSONStructure && isString(key)) {
        path = deepFind(data, key, keySeparator);
        if (path === void 0) path = deepFind(defaultData, key, keySeparator);
    }
    return path;
};
const regexSafe = (val) => val.replace(/\$/g, '$$$$');
var Interpolator = class {
    constructor(options = {}) {
        this.logger = baseLogger.create('interpolator');
        this.options = options;
        this.format = options?.interpolation?.format || ((value) => value);
        this.init(options);
    }
    init(options = {}) {
        if (!options.interpolation) options.interpolation = {escapeValue: true};
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
        this.escape = escape$1 !== void 0 ? escape$1 : escape;
        this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
        this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
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
        this.maxReplaces = maxReplaces || 1e3;
        this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
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
            `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`,
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
                    ? this.format(path, void 0, lng, {
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
            options?.interpolation?.skipOnVariables !== void 0
                ? options.interpolation.skipOnVariables
                : this.options.interpolation.skipOnVariables;
        [
            {
                regex: this.regexpUnescape,
                safeValue: (val) => regexSafe(val),
            },
            {
                regex: this.regexp,
                safeValue: (val) =>
                    this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val),
            },
        ].forEach((todo) => {
            replaces = 0;
            while ((match = todo.regex.exec(str))) {
                const matchedVar = match[1].trim();
                value = handleFormat(matchedVar);
                if (value === void 0)
                    if (typeof missingInterpolationHandler === 'function') {
                        const temp = missingInterpolationHandler(str, match, options);
                        value = isString(temp) ? temp : '';
                    } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar))
                        value = '';
                    else if (skipOnVariables) {
                        value = match[0];
                        continue;
                    } else {
                        this.logger.warn(
                            `missed to pass in variable ${matchedVar} for interpolating ${str}`,
                        );
                        value = '';
                    }
                else if (!isString(value) && !this.useRawValueToEscape) value = makeString(value);
                const safeValue = todo.safeValue(value);
                str = str.replace(match[0], safeValue);
                if (skipOnVariables) {
                    todo.regex.lastIndex += value.length;
                    todo.regex.lastIndex -= match[0].length;
                } else todo.regex.lastIndex = 0;
                replaces++;
                if (replaces >= this.maxReplaces) break;
            }
        });
        return str;
    }
    nest(str, fc, options = {}) {
        let match;
        let value;
        let clonedOptions;
        const handleHasOptions = (key, inheritedOptions) => {
            const sep = this.nestingOptionsSeparator;
            if (key.indexOf(sep) < 0) return key;
            const c = key.split(new RegExp(`${regexEscape(sep)}[ ]*{`));
            let optionsString = `{${c[1]}`;
            key = c[0];
            optionsString = this.interpolate(optionsString, clonedOptions);
            const matchedSingleQuotes = optionsString.match(/'/g);
            const matchedDoubleQuotes = optionsString.match(/"/g);
            if (
                ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes) ||
                (matchedDoubleQuotes?.length ?? 0) % 2 !== 0
            )
                optionsString = optionsString.replace(/'/g, '"');
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
            clonedOptions = {...options};
            clonedOptions =
                clonedOptions.replace && !isString(clonedOptions.replace)
                    ? clonedOptions.replace
                    : clonedOptions;
            clonedOptions.applyPostProcessor = false;
            delete clonedOptions.defaultValue;
            const keyEndIndex = /{.*}/.test(match[1])
                ? match[1].lastIndexOf('}') + 1
                : match[1].indexOf(this.formatSeparator);
            if (keyEndIndex !== -1) {
                formatters = match[1]
                    .slice(keyEndIndex)
                    .split(this.formatSeparator)
                    .map((elem) => elem.trim())
                    .filter(Boolean);
                match[1] = match[1].slice(0, keyEndIndex);
            }
            value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
            if (value && match[0] === str && !isString(value)) return value;
            if (!isString(value)) value = makeString(value);
            if (!value) {
                this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
                value = '';
            }
            if (formatters.length)
                value = formatters.reduce(
                    (v, f) =>
                        this.format(v, f, options.lng, {
                            ...options,
                            interpolationkey: match[1].trim(),
                        }),
                    value.trim(),
                );
            str = str.replace(match[0], value);
            this.regexp.lastIndex = 0;
        }
        return str;
    }
};
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
        } else
            optStr.split(';').forEach((opt) => {
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
    return {
        formatName,
        formatOptions,
    };
};
const createCachedFormatter = (fn) => {
    const cache = {};
    return (v, l, o) => {
        let optForCache = o;
        if (
            o &&
            o.interpolationkey &&
            o.formatParams &&
            o.formatParams[o.interpolationkey] &&
            o[o.interpolationkey]
        )
            optForCache = {
                ...optForCache,
                [o.interpolationkey]: void 0,
            };
        const key = l + JSON.stringify(optForCache);
        let frm = cache[key];
        if (!frm) {
            frm = fn(getCleanedCode(l), o);
            cache[key] = frm;
        }
        return frm(v);
    };
};
const createNonCachedFormatter = (fn) => (v, l, o) => fn(getCleanedCode(l), o)(v);
var Formatter = class {
    constructor(options = {}) {
        this.logger = baseLogger.create('formatter');
        this.options = options;
        this.init(options);
    }
    init(services, options = {interpolation: {}}) {
        this.formatSeparator = options.interpolation.formatSeparator || ',';
        const cf = options.cacheInBuiltFormats ? createCachedFormatter : createNonCachedFormatter;
        this.formats = {
            number: cf((lng, opt) => {
                const formatter = new Intl.NumberFormat(lng, {...opt});
                return (val) => formatter.format(val);
            }),
            currency: cf((lng, opt) => {
                const formatter = new Intl.NumberFormat(lng, {
                    ...opt,
                    style: 'currency',
                });
                return (val) => formatter.format(val);
            }),
            datetime: cf((lng, opt) => {
                const formatter = new Intl.DateTimeFormat(lng, {...opt});
                return (val) => formatter.format(val);
            }),
            relativetime: cf((lng, opt) => {
                const formatter = new Intl.RelativeTimeFormat(lng, {...opt});
                return (val) => formatter.format(val, opt.range || 'day');
            }),
            list: cf((lng, opt) => {
                const formatter = new Intl.ListFormat(lng, {...opt});
                return (val) => formatter.format(val);
            }),
        };
    }
    add(name, fc) {
        this.formats[name.toLowerCase().trim()] = fc;
    }
    addCached(name, fc) {
        this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
    }
    format(value, format, lng, options = {}) {
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
        return formats.reduce((mem, f) => {
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
            } else this.logger.warn(`there was no format function for ${formatName}`);
            return mem;
        }, value);
    }
};
const removePending = (q, name) => {
    if (q.pending[name] !== void 0) {
        delete q.pending[name];
        q.pendingCount--;
    }
};
var Connector = class extends EventEmitter {
    constructor(backend, store, services, options = {}) {
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
                if (!options.reload && this.store.hasResourceBundle(lng, ns)) this.state[name] = 2;
                else if (this.state[name] < 0);
                else if (this.state[name] === 1) {
                    if (pending[name] === void 0) pending[name] = true;
                } else {
                    this.state[name] = 1;
                    hasAllNamespaces = false;
                    if (pending[name] === void 0) pending[name] = true;
                    if (toLoad[name] === void 0) toLoad[name] = true;
                    if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
                }
            });
            if (!hasAllNamespaces) toLoadLanguages[lng] = true;
        });
        if (Object.keys(toLoad).length || Object.keys(pending).length)
            this.queue.push({
                pending,
                pendingCount: Object.keys(pending).length,
                loaded: {},
                errors: [],
                callback,
            });
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
        if (!err && data)
            this.store.addResourceBundle(lng, ns, data, void 0, void 0, {skipCopy: true});
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
                    if (loadedKeys.length)
                        loadedKeys.forEach((n) => {
                            if (loaded[l][n] === void 0) loaded[l][n] = true;
                        });
                });
                q.done = true;
                if (q.errors.length) q.callback(q.errors);
                else q.callback();
            }
        });
        this.emit('loaded', loaded);
        this.queue = this.queue.filter((q) => !q.done);
    }
    read(lng, ns, fcName, tried = 0, wait = this.retryTimeout, callback) {
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
                if (r && typeof r.then === 'function')
                    r.then((data) => resolver(null, data)).catch(resolver);
                else resolver(null, r);
            } catch (err) {
                resolver(err);
            }
            return;
        }
        return fc(lng, ns, resolver);
    }
    prepareLoading(languages, namespaces, options = {}, callback) {
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
        this.prepareLoading(languages, namespaces, {reload: true}, callback);
    }
    loadOne(name, prefix = '') {
        const s = name.split('|');
        const lng = s[0];
        const ns = s[1];
        this.read(lng, ns, 'read', void 0, void 0, (err, data) => {
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
    saveMissing(languages, namespace, key, fallbackValue, isUpdate, options = {}, clb = () => {}) {
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
        if (key === void 0 || key === null || key === '') return;
        if (this.backend?.create) {
            const opts = {
                ...options,
                isUpdate,
            };
            const fc = this.backend.create.bind(this.backend);
            if (fc.length < 6)
                try {
                    let r;
                    if (fc.length === 5) r = fc(languages, namespace, key, fallbackValue, opts);
                    else r = fc(languages, namespace, key, fallbackValue);
                    if (r && typeof r.then === 'function')
                        r.then((data) => clb(null, data)).catch(clb);
                    else clb(null, r);
                } catch (err) {
                    clb(err);
                }
            else fc(languages, namespace, key, fallbackValue, clb, opts);
        }
        if (!languages || !languages[0]) return;
        this.store.addResource(languages[0], namespace, key, fallbackValue);
    }
};
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
        maxReplaces: 1e3,
        skipOnVariables: true,
    },
    cacheInBuiltFormats: true,
});
const transformOptions = (options) => {
    if (isString(options.ns)) options.ns = [options.ns];
    if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
    if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
    if (options.supportedLngs?.indexOf?.('cimode') < 0)
        options.supportedLngs = options.supportedLngs.concat(['cimode']);
    if (typeof options.initImmediate === 'boolean') options.initAsync = options.initImmediate;
    return options;
};
const noop = () => {};
const bindMemberFunctions = (inst) => {
    Object.getOwnPropertyNames(Object.getPrototypeOf(inst)).forEach((mem) => {
        if (typeof inst[mem] === 'function') inst[mem] = inst[mem].bind(inst);
    });
};
const SUPPORT_NOTICE_KEY = '__i18next_supportNoticeShown';
const getSupportNoticeShown = () =>
    typeof globalThis !== 'undefined' && !!globalThis[SUPPORT_NOTICE_KEY];
const setSupportNoticeShown = () => {
    if (typeof globalThis !== 'undefined') globalThis[SUPPORT_NOTICE_KEY] = true;
};
const usesLocize = (inst) => {
    if (inst?.modules?.backend?.name?.indexOf('Locize') > 0) return true;
    if (inst?.modules?.backend?.constructor?.name?.indexOf('Locize') > 0) return true;
    if (inst?.options?.backend?.backends) {
        if (
            inst.options.backend.backends.some(
                (b) =>
                    b?.name?.indexOf('Locize') > 0 || b?.constructor?.name?.indexOf('Locize') > 0,
            )
        )
            return true;
    }
    if (inst?.options?.backend?.projectId) return true;
    if (inst?.options?.backend?.backendOptions) {
        if (inst.options.backend.backendOptions.some((b) => b?.projectId)) return true;
    }
    return false;
};
var I18n = class I18n extends EventEmitter {
    constructor(options = {}, callback) {
        super();
        this.options = transformOptions(options);
        this.services = {};
        this.logger = baseLogger;
        this.modules = {external: []};
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
    init(options = {}, callback) {
        this.isInitializing = true;
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        if (options.defaultNS == null && options.ns) {
            if (isString(options.ns)) options.defaultNS = options.ns;
            else if (options.ns.indexOf('translation') < 0) options.defaultNS = options.ns[0];
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
        if (options.keySeparator !== void 0)
            this.options.userDefinedKeySeparator = options.keySeparator;
        if (options.nsSeparator !== void 0)
            this.options.userDefinedNsSeparator = options.nsSeparator;
        if (typeof this.options.overloadTranslationOptionHandler !== 'function')
            this.options.overloadTranslationOptionHandler =
                defOpts.overloadTranslationOptionHandler;
        if (
            this.options.showSupportNotice !== false &&
            !usesLocize(this) &&
            !getSupportNoticeShown()
        ) {
            if (typeof console !== 'undefined' && typeof console.info !== 'undefined')
                console.info(
                    '🌐 i18next is made possible by our own product, Locize — consider powering your project with managed localization (AI, CDN, integrations): https://locize.com 💙',
                );
            setSupportNoticeShown();
        }
        const createClassOnDemand = (ClassOrObject) => {
            if (!ClassOrObject) return null;
            if (typeof ClassOrObject === 'function') return new ClassOrObject();
            return ClassOrObject;
        };
        if (!this.options.isClone) {
            if (this.modules.logger)
                baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
            else baseLogger.init(null, this.options);
            let formatter;
            if (this.modules.formatter) formatter = this.modules.formatter;
            else formatter = Formatter;
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
                this.options.interpolation.format &&
                this.options.interpolation.format !== defOpts.interpolation.format
            )
                this.logger.deprecate(
                    `init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting`,
                );
            if (
                formatter &&
                (!this.options.interpolation.format ||
                    this.options.interpolation.format === defOpts.interpolation.format)
            ) {
                s.formatter = createClassOnDemand(formatter);
                if (s.formatter.init) s.formatter.init(s, this.options);
                this.options.interpolation.format = s.formatter.format.bind(s.formatter);
            }
            s.interpolator = new Interpolator(this.options);
            s.utils = {hasLoadedNamespace: this.hasLoadedNamespace.bind(this)};
            s.backendConnector = new Connector(
                createClassOnDemand(this.modules.backend),
                s.resourceStore,
                s,
                this.options,
            );
            s.backendConnector.on('*', (event, ...args) => {
                this.emit(event, ...args);
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
            this.translator.on('*', (event, ...args) => {
                this.emit(event, ...args);
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
        if (!this.services.languageDetector && !this.options.lng)
            this.logger.warn('init: no languageDetector is used and no lng is defined');
        ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'].forEach(
            (fcName) => {
                this[fcName] = (...args) => this.store[fcName](...args);
            },
        );
        ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'].forEach(
            (fcName) => {
                this[fcName] = (...args) => {
                    this.store[fcName](...args);
                    return this;
                };
            },
        );
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
        if (this.options.resources || !this.options.initAsync) load();
        else setTimeout(load, 0);
        return deferred;
    }
    loadResources(language, callback = noop) {
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
                this.services.languageUtils.toResolveHierarchy(lng).forEach((l) => {
                    if (l === 'cimode') return;
                    if (toLoad.indexOf(l) < 0) toLoad.push(l);
                });
            };
            if (!usedLng)
                this.services.languageUtils
                    .getFallbackCodes(this.options.fallbackLng)
                    .forEach((l) => append(l));
            else append(usedLng);
            this.options.preload?.forEach?.((l) => append(l));
            this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
                if (!e && !this.resolvedLanguage && this.language)
                    this.setResolvedLanguage(this.language);
                usedCallback(e);
            });
        } else usedCallback(null);
    }
    reloadResources(lngs, ns, callback) {
        const deferred = defer();
        if (typeof lngs === 'function') {
            callback = lngs;
            lngs = void 0;
        }
        if (typeof ns === 'function') {
            callback = ns;
            ns = void 0;
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
        if (module.type === 'backend') this.modules.backend = module;
        if (module.type === 'logger' || (module.log && module.warn && module.error))
            this.modules.logger = module;
        if (module.type === 'languageDetector') this.modules.languageDetector = module;
        if (module.type === 'i18nFormat') this.modules.i18nFormat = module;
        if (module.type === 'postProcessor') postProcessor.addPostProcessor(module);
        if (module.type === 'formatter') this.modules.formatter = module;
        if (module.type === '3rdParty') this.modules.external.push(module);
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
        if (
            !this.resolvedLanguage &&
            this.languages.indexOf(l) < 0 &&
            this.store.hasLanguageSomeTranslations(l)
        ) {
            this.resolvedLanguage = l;
            this.languages.unshift(l);
        }
    }
    changeLanguage(lng, callback) {
        this.isLanguageChangingTo = lng;
        const deferred = defer();
        this.emit('languageChanging', lng);
        const setLngProps = (l) => {
            this.language = l;
            this.languages = this.services.languageUtils.toResolveHierarchy(l);
            this.resolvedLanguage = void 0;
            this.setResolvedLanguage(l);
        };
        const done = (err, l) => {
            if (l) {
                if (this.isLanguageChangingTo === lng) {
                    setLngProps(l);
                    this.translator.changeLanguage(l);
                    this.isLanguageChangingTo = void 0;
                    this.emit('languageChanged', l);
                    this.logger.log('languageChanged', l);
                }
            } else this.isLanguageChangingTo = void 0;
            deferred.resolve((...args) => this.t(...args));
            if (callback) callback(err, (...args) => this.t(...args));
        };
        const setLng = (lngs) => {
            if (!lng && !lngs && this.services.languageDetector) lngs = [];
            const fl = isString(lngs) ? lngs : lngs && lngs[0];
            const l = this.store.hasLanguageSomeTranslations(fl)
                ? fl
                : this.services.languageUtils.getBestMatchFromCodes(isString(lngs) ? [lngs] : lngs);
            if (l) {
                if (!this.language) setLngProps(l);
                if (!this.translator.language) this.translator.changeLanguage(l);
                this.services.languageDetector?.cacheUserLanguage?.(l);
            }
            this.loadResources(l, (err) => {
                done(err, l);
            });
        };
        if (!lng && this.services.languageDetector && !this.services.languageDetector.async)
            setLng(this.services.languageDetector.detect());
        else if (!lng && this.services.languageDetector && this.services.languageDetector.async)
            if (this.services.languageDetector.detect.length === 0)
                this.services.languageDetector.detect().then(setLng);
            else this.services.languageDetector.detect(setLng);
        else setLng(lng);
        return deferred;
    }
    getFixedT(lng, ns, keyPrefix) {
        const fixedT = (key, opts, ...rest) => {
            let o;
            if (typeof opts !== 'object')
                o = this.options.overloadTranslationOptionHandler([key, opts].concat(rest));
            else o = {...opts};
            o.lng = o.lng || fixedT.lng;
            o.lngs = o.lngs || fixedT.lngs;
            o.ns = o.ns || fixedT.ns;
            if (o.keyPrefix !== '') o.keyPrefix = o.keyPrefix || keyPrefix || fixedT.keyPrefix;
            const keySeparator = this.options.keySeparator || '.';
            let resultKey;
            if (o.keyPrefix && Array.isArray(key))
                resultKey = key.map((k) => {
                    if (typeof k === 'function')
                        k = keysFromSelector(k, {
                            ...this.options,
                            ...opts,
                        });
                    return `${o.keyPrefix}${keySeparator}${k}`;
                });
            else {
                if (typeof key === 'function')
                    key = keysFromSelector(key, {
                        ...this.options,
                        ...opts,
                    });
                resultKey = o.keyPrefix ? `${o.keyPrefix}${keySeparator}${key}` : key;
            }
            return this.t(resultKey, o);
        };
        if (isString(lng)) fixedT.lng = lng;
        else fixedT.lngs = lng;
        fixedT.ns = ns;
        fixedT.keyPrefix = keyPrefix;
        return fixedT;
    }
    t(...args) {
        return this.translator?.translate(...args);
    }
    exists(...args) {
        return this.translator?.exists(...args);
    }
    setDefaultNamespace(ns) {
        this.options.defaultNS = ns;
    }
    hasLoadedNamespace(ns, options = {}) {
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
            if (preResult !== void 0) return preResult;
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
        try {
            const l = new Intl.Locale(lng);
            if (l && l.getTextInfo) {
                const ti = l.getTextInfo();
                if (ti && ti.direction) return ti.direction;
            }
        } catch (e) {}
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
        if (lng.toLowerCase().indexOf('-latn') > 1) return 'ltr';
        return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 ||
            lng.toLowerCase().indexOf('-arab') > 1
            ? 'rtl'
            : 'ltr';
    }
    static createInstance(options = {}, callback) {
        const instance = new I18n(options, callback);
        instance.createInstance = I18n.createInstance;
        return instance;
    }
    cloneInstance(options = {}, callback = noop) {
        const forkResourceStore = options.forkResourceStore;
        if (forkResourceStore) delete options.forkResourceStore;
        const mergedOptions = {
            ...this.options,
            ...options,
            isClone: true,
        };
        const clone = new I18n(mergedOptions);
        if (options.debug !== void 0 || options.prefix !== void 0)
            clone.logger = clone.logger.clone(options);
        ['store', 'services', 'language'].forEach((m) => {
            clone[m] = this[m];
        });
        clone.services = {...this.services};
        clone.services.utils = {hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)};
        if (forkResourceStore) {
            clone.store = new ResourceStore(
                Object.keys(this.store.data).reduce((prev, l) => {
                    prev[l] = {...this.store.data[l]};
                    prev[l] = Object.keys(prev[l]).reduce((acc, n) => {
                        acc[n] = {...prev[l][n]};
                        return acc;
                    }, prev[l]);
                    return prev;
                }, {}),
                mergedOptions,
            );
            clone.services.resourceStore = clone.store;
        }
        if (options.interpolation) {
            const mergedInterpolation = {
                ...get().interpolation,
                ...this.options.interpolation,
                ...options.interpolation,
            };
            const mergedForInterpolator = {
                ...mergedOptions,
                interpolation: mergedInterpolation,
            };
            clone.services.interpolator = new Interpolator(mergedForInterpolator);
        }
        clone.translator = new Translator(clone.services, mergedOptions);
        clone.translator.on('*', (event, ...args) => {
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
};
const instance = I18n.createInstance();
const createInstance$4 = instance.createInstance;
const dir = instance.dir;
const init = instance.init;
const loadResources = instance.loadResources;
const reloadResources = instance.reloadResources;
const use = instance.use;
const changeLanguage = instance.changeLanguage;
const getFixedT = instance.getFixedT;
const t$1 = instance.t;
const exists = instance.exists;
const setDefaultNamespace = instance.setDefaultNamespace;
const hasLoadedNamespace = instance.hasLoadedNamespace;
const loadNamespaces = instance.loadNamespaces;
const loadLanguages = instance.loadLanguages;

//#endregion
//#region ../common/src/i18next.js
/**
 * @param {string} namespace The namespace to override
 * @returns {string} The new namespace name
 */
function getOverrideNamespace(namespace) {
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
    if (namespace === void 0) namespace = 'translation';
    let overrideNamespace = getOverrideNamespace(namespace);
    var options = {
        lng,
        fallbackLng: [fallback, lng, ...Object.keys(languages)],
        debug: false,
        ns: [overrideNamespace, namespace],
        defaultNS: namespace,
        fallbackNS: namespace,
        initImmediate: false,
        initAsync: false,
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

//#endregion
//#region ../common/src/i18n/de/translation.json
var translation_default$5 = {
    consumer: {
        item: 'Bezeichnung',
        price: 'Preis',
        sum: 'Summe',
    },
    'dbp-modal': {close: 'Schließen'},
    demo: {
        consumer: 'Verbraucher',
        consumer_description: 'Verbraucher "{{id}}" abonniert nur {{subscriptions}}',
        provider: 'Anbieter',
        provider_description: 'Anbieter "{{id}}" {{description}}',
    },
    error: {
        'connection-to-server-refused': 'Verbindung zum Server verweigert!',
        summary: 'Ein Fehler ist aufgetreten',
    },
};

//#endregion
//#region ../common/src/i18n/en/translation.json
var translation_default$4 = {
    consumer: {
        item: 'Description',
        price: 'Price',
        sum: 'sum',
    },
    'dbp-modal': {close: 'Close'},
    demo: {
        consumer: 'Consumer',
        consumer_description: 'Consumer "{{id}}" will only subscribe to {{subscriptions}}',
        provider: 'Provider',
        provider_description: 'Provider "{{id}}" {{description}}',
    },
    error: {
        'connection-to-server-refused': 'Connection to server refused!',
        summary: 'An error occurred',
    },
};

//#endregion
//#region ../common/src/i18n.js
function createInstance$2() {
    return createInstance$3(
        {
            en: translation_default$4,
            de: translation_default$5,
        },
        'de',
        'en',
    );
}

//#endregion
//#region ../../node_modules/dialog-polyfill/dist/dialog-polyfill.esm.js
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
    if (typeof target[check] === 'function') target[check](event);
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
            return !(s[k] === void 0 || s[k] === ok);
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
        )
            return true;
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
        if (el.localName === 'dialog') return el;
        if (el.parentElement) el = el.parentElement;
        else if (el.parentNode) el = el.parentNode.host;
        else el = null;
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
    while (el && el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;
    if (el && el.blur && el !== document.body) el.blur();
}
/**
 * @param {!NodeList} nodeList to search
 * @param {Node} node to find
 * @return {boolean} whether node is inside nodeList
 */
function inNodeList(nodeList, node) {
    for (var i = 0; i < nodeList.length; ++i) if (nodeList[i] === node) return true;
    return false;
}
/**
 * @param {HTMLFormElement} el to check
 * @return {boolean} whether this form has method="dialog"
 */
function isFormMethodDialog(el) {
    if (!el || !el.hasAttribute('method')) return false;
    return el.getAttribute('method').toLowerCase() === 'dialog';
}
/**
 * @param {!DocumentFragment|!Element} hostElement
 * @return {?Element}
 */
function findFocusableElementWithin(hostElement) {
    var query = ['button', 'input', 'keygen', 'select', 'textarea'].map(function (el) {
        return el + ':not([disabled])';
    });
    query.push('[tabindex]:not([disabled]):not([tabindex=""])');
    var target = hostElement.querySelector(query.join(', '));
    if (!target && 'attachShadow' in Element.prototype) {
        var elems = hostElement.querySelectorAll('*');
        for (var i = 0; i < elems.length; i++)
            if (elems[i].tagName && elems[i].shadowRoot) {
                target = findFocusableElementWithin(elems[i].shadowRoot);
                if (target) break;
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
    if (event.submitter) return event.submitter;
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return null;
    var submitter = dialogPolyfill.formSubmitter;
    if (!submitter) {
        var target = event.target;
        submitter = (('getRootNode' in target && target.getRootNode()) || document).activeElement;
    }
    if (!submitter || submitter.form !== form) return null;
    return submitter;
}
/**
 * @param {!Event} event
 */
function maybeHandleSubmit(event) {
    if (event.defaultPrevented) return;
    var form = event.target;
    var value = dialogPolyfill.imagemapUseValue;
    var submitter = findFormSubmitter(event);
    if (value === null && submitter) value = submitter.value;
    var dialog = findNearestDialog(form);
    if (!dialog) return;
    if (
        ((submitter && submitter.getAttribute('formmethod')) || form.getAttribute('method')) !==
        'dialog'
    )
        return;
    event.preventDefault();
    if (value != null) dialog.close(value);
    else dialog.close();
}
/**
 * @param {!HTMLDialogElement} dialog to upgrade
 * @constructor
 */
function dialogPolyfillInfo(dialog) {
    this.dialog_ = dialog;
    this.replacedStyleTop_ = false;
    this.openAsModal_ = false;
    if (!dialog.hasAttribute('role')) dialog.setAttribute('role', 'dialog');
    dialog.show = this.show.bind(this);
    dialog.showModal = this.showModal.bind(this);
    dialog.close = this.close.bind(this);
    dialog.addEventListener('submit', maybeHandleSubmit, false);
    if (!('returnValue' in dialog)) dialog.returnValue = '';
    if ('MutationObserver' in window)
        new MutationObserver(this.maybeHideModal.bind(this)).observe(dialog, {
            attributes: true,
            attributeFilter: ['open'],
        });
    else {
        var removed = false;
        var cb = function () {
            removed ? this.downgradeModal() : this.maybeHideModal();
            removed = false;
        }.bind(this);
        var timeout;
        var delayModel = function (ev) {
            if (ev.target !== dialog) return;
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
dialogPolyfillInfo.prototype = {
    get dialog() {
        return this.dialog_;
    },
    maybeHideModal: function () {
        if (this.dialog_.hasAttribute('open') && isConnected(this.dialog_)) return;
        this.downgradeModal();
    },
    downgradeModal: function () {
        if (!this.openAsModal_) return;
        this.openAsModal_ = false;
        this.dialog_.style.zIndex = '';
        if (this.replacedStyleTop_) {
            this.dialog_.style.top = '';
            this.replacedStyleTop_ = false;
        }
        this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_);
        dialogPolyfill.dm.removeDialog(this);
    },
    setOpen: function (value) {
        if (value) this.dialog_.hasAttribute('open') || this.dialog_.setAttribute('open', '');
        else {
            this.dialog_.removeAttribute('open');
            this.maybeHideModal();
        }
    },
    backdropMouseEvent_: function (e) {
        if (!this.dialog_.hasAttribute('tabindex')) {
            var fake = document.createElement('div');
            this.dialog_.insertBefore(fake, this.dialog_.firstChild);
            fake.tabIndex = -1;
            fake.focus();
            this.dialog_.removeChild(fake);
        } else this.dialog_.focus();
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
    focus_: function () {
        var target = this.dialog_.querySelector('[autofocus]:not([disabled])');
        if (!target && this.dialog_.tabIndex >= 0) target = this.dialog_;
        if (!target) target = findFocusableElementWithin(this.dialog_);
        safeBlur(document.activeElement);
        target && target.focus();
    },
    updateZIndex: function (dialogZ, backdropZ) {
        if (dialogZ < backdropZ) throw new Error('dialogZ should never be < backdropZ');
        this.dialog_.style.zIndex = dialogZ;
        this.backdrop_.style.zIndex = backdropZ;
    },
    show: function () {
        if (!this.dialog_.open) {
            this.setOpen(true);
            this.focus_();
        }
    },
    showModal: function () {
        if (this.dialog_.hasAttribute('open'))
            throw new Error(
                "Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally.",
            );
        if (!isConnected(this.dialog_))
            throw new Error(
                "Failed to execute 'showModal' on dialog: The element is not in a Document.",
            );
        if (!dialogPolyfill.dm.pushDialog(this))
            throw new Error(
                "Failed to execute 'showModal' on dialog: There are too many open modal dialogs.",
            );
        if (createsStackingContext(this.dialog_.parentElement))
            console.warn(
                'A dialog is being shown inside a stacking context. This may cause it to be unusable. For more information, see this link: https://github.com/GoogleChrome/dialog-polyfill/#stacking-context',
            );
        this.setOpen(true);
        this.openAsModal_ = true;
        if (dialogPolyfill.needsCentering(this.dialog_)) {
            dialogPolyfill.reposition(this.dialog_);
            this.replacedStyleTop_ = true;
        } else this.replacedStyleTop_ = false;
        this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling);
        this.focus_();
    },
    close: function (opt_returnValue) {
        if (!this.dialog_.hasAttribute('open'))
            throw new Error(
                "Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed.",
            );
        this.setOpen(false);
        if (opt_returnValue !== void 0) this.dialog_.returnValue = opt_returnValue;
        var closeEvent = new supportCustomEvent('close', {
            bubbles: false,
            cancelable: false,
        });
        safeDispatchEvent(this.dialog_, closeEvent);
    },
};
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
        try {
            cssRules = styleSheet.cssRules;
        } catch (e) {}
        if (!cssRules) continue;
        for (var j = 0; j < cssRules.length; ++j) {
            var rule = cssRules[j];
            var selectedNodes = null;
            try {
                selectedNodes = document.querySelectorAll(rule.selectorText);
            } catch (e) {}
            if (!selectedNodes || !inNodeList(selectedNodes, element)) continue;
            var cssTop = rule.style.getPropertyValue('top');
            var cssBottom = rule.style.getPropertyValue('bottom');
            if ((cssTop && cssTop !== 'auto') || (cssBottom && cssBottom !== 'auto')) return true;
        }
    }
    return false;
};
dialogPolyfill.needsCentering = function (dialog) {
    if (window.getComputedStyle(dialog).position !== 'absolute') return false;
    if (
        (dialog.style.top !== 'auto' && dialog.style.top !== '') ||
        (dialog.style.bottom !== 'auto' && dialog.style.bottom !== '')
    )
        return false;
    return !dialogPolyfill.isInlinePositionSetByStylesheet(dialog);
};
/**
 * @param {!Element} element to force upgrade
 */
dialogPolyfill.forceRegisterDialog = function (element) {
    if (window.HTMLDialogElement || element.showModal)
        console.warn(
            'This browser already supports <dialog>, the polyfill may not work correctly',
            element,
        );
    if (element.localName !== 'dialog')
        throw new Error('Failed to register dialog: The element is not a dialog.');
    new dialogPolyfillInfo(element);
};
/**
 * @param {!Element} element to upgrade, if necessary
 */
dialogPolyfill.registerDialog = function (element) {
    if (!element.showModal) dialogPolyfill.forceRegisterDialog(element);
};
/**
 * @constructor
 */
dialogPolyfill.DialogManager = function () {
    /** @type {!Array<!dialogPolyfillInfo>} */
    this.pendingDialogStack = [];
    var checkDOM = this.checkDOM_.bind(this);
    this.overlay = document.createElement('div');
    this.overlay.className = '_dialog_overlay';
    this.overlay.addEventListener(
        'click',
        function (e) {
            this.forwardTab_ = void 0;
            e.stopPropagation();
            checkDOM([]);
        }.bind(this),
    );
    this.handleKey_ = this.handleKey_.bind(this);
    this.handleFocus_ = this.handleFocus_.bind(this);
    this.zIndexLow_ = 1e5;
    this.zIndexHigh_ = 100150;
    this.forwardTab_ = void 0;
    if ('MutationObserver' in window)
        this.mo_ = new MutationObserver(function (records) {
            var removed = [];
            records.forEach(function (rec) {
                for (var i = 0, c; (c = rec.removedNodes[i]); ++i) {
                    if (!(c instanceof Element)) continue;
                    else if (c.localName === 'dialog') removed.push(c);
                    removed = removed.concat(c.querySelectorAll('dialog'));
                }
            });
            removed.length && checkDOM(removed);
        });
};
/**
 * Called on the first modal dialog being shown. Adds the overlay and related
 * handlers.
 */
dialogPolyfill.DialogManager.prototype.blockDocument = function () {
    document.documentElement.addEventListener('focus', this.handleFocus_, true);
    document.addEventListener('keydown', this.handleKey_);
    this.mo_ &&
        this.mo_.observe(document, {
            childList: true,
            subtree: true,
        });
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
        if (i === 0) this.overlay.style.zIndex = --zIndex;
    }
    var last = this.pendingDialogStack[0];
    if (last) (last.dialog.parentNode || document.body).appendChild(this.overlay);
    else if (this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
};
/**
 * @param {Element} candidate to check if contained or is the top-most modal dialog
 * @return {boolean} whether candidate is contained in top dialog
 */
dialogPolyfill.DialogManager.prototype.containedByTopDialog_ = function (candidate) {
    while ((candidate = findNearestDialog(candidate))) {
        for (var i = 0, dpi; (dpi = this.pendingDialogStack[i]); ++i)
            if (dpi.dialog === candidate) return i === 0;
        candidate = candidate.parentElement;
    }
    return false;
};
dialogPolyfill.DialogManager.prototype.handleFocus_ = function (event) {
    var target = event.composedPath ? event.composedPath()[0] : event.target;
    if (this.containedByTopDialog_(target)) return;
    if (document.activeElement === document.documentElement) return;
    event.preventDefault();
    event.stopPropagation();
    safeBlur(target);
    if (this.forwardTab_ === void 0) return;
    var dpi = this.pendingDialogStack[0];
    if (dpi.dialog.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_PRECEDING) {
        if (this.forwardTab_) dpi.focus_();
        else if (target !== document.documentElement) document.documentElement.focus();
    }
    return false;
};
dialogPolyfill.DialogManager.prototype.handleKey_ = function (event) {
    this.forwardTab_ = void 0;
    if (event.keyCode === 27) {
        event.preventDefault();
        event.stopPropagation();
        var cancelEvent = new supportCustomEvent('cancel', {
            bubbles: false,
            cancelable: true,
        });
        var dpi = this.pendingDialogStack[0];
        if (dpi && safeDispatchEvent(dpi.dialog, cancelEvent)) dpi.dialog.close();
    } else if (event.keyCode === 9) this.forwardTab_ = !event.shiftKey;
};
/**
 * Finds and downgrades any known modal dialogs that are no longer displayed. Dialogs that are
 * removed and immediately readded don't stay modal, they become normal.
 *
 * @param {!Array<!HTMLDialogElement>} removed that have definitely been removed
 */
dialogPolyfill.DialogManager.prototype.checkDOM_ = function (removed) {
    this.pendingDialogStack.slice().forEach(function (dpi) {
        if (removed.indexOf(dpi.dialog) !== -1) dpi.downgradeModal();
        else dpi.maybeHideModal();
    });
};
/**
 * @param {!dialogPolyfillInfo} dpi
 * @return {boolean} whether the dialog was allowed
 */
dialogPolyfill.DialogManager.prototype.pushDialog = function (dpi) {
    var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;
    if (this.pendingDialogStack.length >= allowed) return false;
    if (this.pendingDialogStack.unshift(dpi) === 1) this.blockDocument();
    this.updateStacking();
    return true;
};
/**
 * @param {!dialogPolyfillInfo} dpi
 */
dialogPolyfill.DialogManager.prototype.removeDialog = function (dpi) {
    var index = this.pendingDialogStack.indexOf(dpi);
    if (index === -1) return;
    this.pendingDialogStack.splice(index, 1);
    if (this.pendingDialogStack.length === 0) this.unblockDocument();
    this.updateStacking();
};
dialogPolyfill.dm = new dialogPolyfill.DialogManager();
dialogPolyfill.formSubmitter = null;
dialogPolyfill.imagemapUseValue = null;
/**
 * Installs global handlers, such as click listers and native method overrides. These are needed
 * even if a no dialog is registered, as they deal with <form method="dialog">.
 */
if (window.HTMLDialogElement === void 0) {
    /**
     * If HTMLFormElement translates method="DIALOG" into 'get', then replace the descriptor with
     * one that returns the correct value.
     */
    var testForm = document.createElement('form');
    testForm.setAttribute('method', 'dialog');
    if (testForm.method !== 'dialog') {
        var methodDescriptor = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, 'method');
        if (methodDescriptor) {
            var realGet = methodDescriptor.get;
            methodDescriptor.get = function () {
                if (isFormMethodDialog(this)) return 'dialog';
                return realGet.call(this);
            };
            var realSet = methodDescriptor.set;
            /** @this {HTMLElement} */
            methodDescriptor.set = function (v) {
                if (typeof v === 'string' && v.toLowerCase() === 'dialog')
                    return this.setAttribute('method', v);
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
            if (ev.defaultPrevented) return;
            var target = ev.target;
            if ('composedPath' in ev) target = ev.composedPath().shift() || target;
            if (!target || !isFormMethodDialog(target.form)) return;
            if (!(target.type === 'submit' && ['button', 'input'].indexOf(target.localName) > -1)) {
                if (!(target.localName === 'input' && target.type === 'image')) return;
                dialogPolyfill.imagemapUseValue = ev.offsetX + ',' + ev.offsetY;
            }
            if (!findNearestDialog(target)) return;
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
        if (findNearestDialog(form)) return;
        var submitter = findFormSubmitter(ev);
        if (
            ((submitter && submitter.getAttribute('formmethod')) || form.getAttribute('method')) ===
            'dialog'
        )
            ev.preventDefault();
    });
    /**
     * Replace the native HTMLFormElement.submit() method, as it won't fire the
     * submit event and give us a chance to respond.
     */
    var nativeFormSubmit = HTMLFormElement.prototype.submit;
    var replacementFormSubmit = function () {
        if (!isFormMethodDialog(this)) return nativeFormSubmit.call(this);
        var dialog = findNearestDialog(this);
        dialog && dialog.close();
    };
    HTMLFormElement.prototype.submit = replacementFormSubmit;
}

//#endregion
//#region ../common/src/lang-mixin.js
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
                if (propName === 'lang') this[propertyName].changeLanguage(this.lang);
            });
            super.update(changedProperties);
        }
    };

//#endregion
//#region ../common/src/utils.js
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
    if (!baseURL.endsWith('/')) baseURL += '/';
    return new URL(addedURL.replace(/^\/+/, ''), baseURL).href;
};

//#endregion
//#region ../common/src/auth-mixin.js
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
                    if (!wasLoggedOut && isLoggedOut)
                        if (this._authPending) this._authPending = false;
                        else this.logoutCallback();
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

//#endregion
//#region ../common/src/notification.js
/**
 * Sends a notification to the user.
 *
 * example options:
 *
 * {
 *   "summary": "Item deleted",
 *   "body": "Item foo was deleted!",
 *   "type": "info",
 *   "icon": "remove-file",
 *   "timeout": 5,
 * }
 *
 * @param {object} options - Notification options
 * @param {string} [options.summary] - The notification title/summary
 * @param {string} [options.body] - The main notification message
 * @param {('info'|'success'|'warning'|'danger')} [options.type] - The notification type
 * @param {string} [options.icon] - Icon name to display with the notification (if the handler supports it)
 * @param {number} [options.timeout] - Duration in seconds before auto-dismissing the notification (if the handler supports it)
 * @param {string} [options.targetNotificationId] - ID of specific notification component to target (if the handler supports it)
 * @param {string} [options.replaceId] - Unique identifier to replace existing notifications with the same replaceId (if the handler supports it)
 */
function sendNotification(options) {
    const event = new CustomEvent('dbp-notification-send', {
        bubbles: true,
        cancelable: true,
        detail: options,
    });
    if (window.dispatchEvent(event)) {
        alert([options.summary, options.body].filter(Boolean).join(':\n\n'));
        console.log('Use the web component dbp-notification to show fancy notifications.');
    }
}

//#endregion
//#region src/i18n/de/translation.json
var translation_default$3 = {
    'country-select': {
        'login-required': 'Anmeldung erforderlich',
        placeholder: 'Bitte wählen Sie eine Person aus',
    },
};

//#endregion
//#region src/i18n/en/translation.json
var translation_default$2 = {
    'country-select': {
        'login-required': 'Login required',
        placeholder: 'Please select a person',
    },
};

//#endregion
//#region src/i18n.js
function createInstance$1() {
    return createInstance$3(
        {
            en: translation_default$2,
            de: translation_default$3,
        },
        'de',
        'en',
    );
}

//#endregion
//#region ../../node_modules/select2/dist/css/select2.min.css
var select2_min_default = 'shared/select2.min.ae5735562faabd1a.css';

//#endregion
//#region ../common/src/error.js
/**
 * We need this mixin so we can use this.sendSetPropertyEvent to post analytics events
 */
const errorMixin = {
    handleXhrError(jqXHR, textStatus, errorThrown, icon = 'sad', lang = 'de') {
        if (textStatus === 'abort') return;
        let body;
        const i18n = createInstance$2();
        i18n.changeLanguage(lang);
        if (jqXHR.responseJSON !== void 0 && jqXHR.responseJSON['hydra:description'] !== void 0)
            body = jqXHR.responseJSON['hydra:description'];
        else if (jqXHR.responseJSON !== void 0 && jqXHR.responseJSON['detail'] !== void 0)
            body = jqXHR.responseJSON['detail'];
        else {
            body = textStatus;
            if (errorThrown) body += ' - ' + errorThrown;
        }
        if (jqXHR.status === 0) body = i18n.t('error.connection-to-server-refused');
        sendNotification({
            summary: i18n.t('error.summary'),
            body,
            icon,
            type: 'danger',
        });
        if (this.sendSetPropertyEvent !== void 0)
            this.sendSetPropertyEvent('analytics-event', {
                category: 'XhrError',
                action: body,
            });
    },
    handleFetchError: async function (error, summary = '', icon = 'sad', lang = 'de') {
        if (error.name === 'AbortError') return;
        let body;
        const i18n = createInstance$2();
        i18n.changeLanguage(lang);
        try {
            await error
                .json()
                .then((json) => {
                    if (json['hydra:description'] !== void 0) body = json['hydra:description'];
                    else if (json['detail'] !== void 0) body = json['detail'];
                    else body = error.statusText;
                })
                .catch(() => {
                    body = error.statusText !== void 0 ? error.statusText : error;
                });
        } catch {
            if (error.name === 'TypeError')
                body =
                    error.message !== ''
                        ? error.message
                        : i18n.t('error.connection-to-server-refused');
        }
        sendNotification({
            summary: summary === '' ? i18n.t('error.summary') : summary,
            body,
            icon,
            type: 'danger',
        });
        if (this.sendSetPropertyEvent !== void 0)
            this.sendSetPropertyEvent('analytics-event', {
                category: 'FetchError',
                action: summary === '' ? body : summary + ': ' + body,
            });
    },
};

//#endregion
//#region ../../node_modules/lit-html/directive-helpers.js
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const {I: t} = j$1,
    i = (o) => o,
    n$2 = (o) => null === o || ('object' != typeof o && 'function' != typeof o),
    e = {
        HTML: 1,
        SVG: 2,
        MATHML: 3,
    },
    l$1 = (o, t) => (void 0 === t ? void 0 !== o?._$litType$ : o?._$litType$ === t),
    d = (o) => null != o?._$litType$?.h,
    c$1 = (o) => void 0 !== o?._$litDirective$,
    f$1 = (o) => o?._$litDirective$,
    r$1 = (o) => void 0 === o.strings,
    s$1 = () => document.createComment(''),
    v = (o, n, e) => {
        const l = o._$AA.parentNode,
            d = void 0 === n ? o._$AB : n._$AA;
        if (void 0 === e)
            e = new t(l.insertBefore(s$1(), d), l.insertBefore(s$1(), d), o, o.options);
        else {
            const t = e._$AB.nextSibling,
                n = e._$AM,
                c = n !== o;
            if (c) {
                let t;
                (e._$AQ?.(o),
                    (e._$AM = o),
                    void 0 !== e._$AP && (t = o._$AU) !== n._$AU && e._$AP(t));
            }
            if (t !== d || c) {
                let o = e._$AA;
                for (; o !== t; ) {
                    const t = i(o).nextSibling;
                    (i(l).insertBefore(o, d), (o = t));
                }
            }
        }
        return e;
    },
    u = (o, t, i = o) => (o._$AI(t, i), o),
    m = {},
    p = (o, t = m) => (o._$AH = t),
    M = (o) => o._$AH,
    h$1 = (o) => {
        (o._$AR(), o._$AA.remove());
    },
    j = (o) => {
        o._$AR();
    };

//#endregion
//#region ../../node_modules/lit-html/directives/live.js
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const l = e$3(
    class extends i$1 {
        constructor(r) {
            if (
                (super(r),
                r.type !== t$2.PROPERTY &&
                    r.type !== t$2.ATTRIBUTE &&
                    r.type !== t$2.BOOLEAN_ATTRIBUTE)
            )
                throw Error('The `live` directive is not allowed on child or event bindings');
            if (!r$1(r)) throw Error('`live` bindings can only contain a single expression');
        }
        render(r) {
            return r;
        }
        update(i, [t]) {
            if (t === E || t === A) return t;
            const o = i.element,
                l = i.name;
            if (i.type === t$2.PROPERTY) {
                if (t === o[l]) return E;
            } else if (i.type === t$2.BOOLEAN_ATTRIBUTE) {
                if (!!t === o.hasAttribute(l)) return E;
            } else if (i.type === t$2.ATTRIBUTE && o.getAttribute(l) === t + '') return E;
            return (p(i), t);
        }
    },
);

//#endregion
//#region ../../node_modules/lit-html/async-directive.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const s = (i, t) => {
        const e = i._$AN;
        if (void 0 === e) return !1;
        for (const i of e) (i._$AO?.(t, !1), s(i, t));
        return !0;
    },
    o$1 = (i) => {
        let t, e;
        do {
            if (void 0 === (t = i._$AM)) break;
            ((e = t._$AN), e.delete(i), (i = t));
        } while (0 === e?.size);
    },
    r = (i) => {
        for (let t; (t = i._$AM); i = t) {
            let e = t._$AN;
            if (void 0 === e) t._$AN = e = /* @__PURE__ */ new Set();
            else if (e.has(i)) break;
            (e.add(i), c(t));
        }
    };
function h(i) {
    void 0 !== this._$AN ? (o$1(this), (this._$AM = i), r(this)) : (this._$AM = i);
}
function n$1(i, t = !1, e = 0) {
    const r = this._$AH,
        h = this._$AN;
    if (void 0 !== h && 0 !== h.size)
        if (t)
            if (Array.isArray(r)) for (let i = e; i < r.length; i++) (s(r[i], !1), o$1(r[i]));
            else null != r && (s(r, !1), o$1(r));
        else s(this, i);
}
const c = (i) => {
    i.type == t$2.CHILD && ((i._$AP ??= n$1), (i._$AQ ??= h));
};
var f = class extends i$1 {
    constructor() {
        (super(...arguments), (this._$AN = void 0));
    }
    _$AT(i, t, e) {
        (super._$AT(i, t, e), r(this), (this.isConnected = i._$AU));
    }
    _$AO(i, t = !0) {
        (i !== this.isConnected &&
            ((this.isConnected = i), i ? this.reconnected?.() : this.disconnected?.()),
            t && (s(this, i), o$1(this)));
    }
    setValue(t) {
        if (r$1(this._$Ct)) this._$Ct._$AI(t, this);
        else {
            const i = [...this._$Ct._$AH];
            ((i[this._$Ci] = t), this._$Ct._$AI(i, this, 0));
        }
    }
    disconnected() {}
    reconnected() {}
};

//#endregion
//#region ../../node_modules/lit-html/directives/ref.js
const o = /* @__PURE__ */ new WeakMap(),
    n = e$3(
        class extends f {
            render(i) {
                return A;
            }
            update(i, [s]) {
                const e = s !== this.G;
                return (
                    e && void 0 !== this.G && this.rt(void 0),
                    (e || this.lt !== this.ct) &&
                        ((this.G = s), (this.ht = i.options?.host), this.rt((this.ct = i.element))),
                    A
                );
            }
            rt(t) {
                if ((this.isConnected || (t = void 0), 'function' == typeof this.G)) {
                    const i = this.ht ?? globalThis;
                    let s = o.get(i);
                    (void 0 === s && ((s = /* @__PURE__ */ new WeakMap()), o.set(i, s)),
                        void 0 !== s.get(this.G) && this.G.call(this.ht, void 0),
                        s.set(this.G, t),
                        void 0 !== t && this.G.call(this.ht, t));
                } else this.G.value = t;
            }
            get lt() {
                return 'function' == typeof this.G
                    ? o.get(this.ht ?? globalThis)?.get(this.G)
                    : this.G?.value;
            }
            disconnected() {
                this.lt === this.ct && this.rt(void 0);
            }
            reconnected() {
                this.rt(this.ct);
            }
        },
    );

//#endregion
//#region src/utils.js
function getGermanCountryList() {
    const selectedCountries = getGermanCountryMapping();
    return Object.fromEntries(
        Object.entries(selectedCountries).sort(([, a], [, b]) => a.localeCompare(b, 'de')),
    );
}
function getEnglishCountryList() {
    const selectedCountries = getEnglishCountryMapping();
    return Object.fromEntries(
        Object.entries(selectedCountries).sort(([, a], [, b]) => a.localeCompare(b, 'en')),
    );
}
function getGermanCountryMapping() {
    let allCountries = new Intl.DisplayNames(['de-AT'], {type: 'region'});
    return Object.fromEntries(
        [
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
        ].map((code) => [code, allCountries.of(code)]),
    );
}
function getEnglishCountryMapping() {
    let allCountries = new Intl.DisplayNames(['en-AT'], {type: 'region'});
    return Object.fromEntries(
        [
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
        ].map((code) => [code, allCountries.of(code)]),
    );
}

//#endregion
//#region src/country-select.js
var CountrySelect = class CountrySelect extends LangMixin(
    ScopedElementsMixin(AdapterLitElement),
    createInstance$1,
) {
    constructor() {
        super();
        Object.assign(CountrySelect.prototype, errorMixin);
        this.auth = {};
        this.entryPointUrl = null;
        this.$select = null;
        this.active = false;
        this.data = [];
        this.selectId = 'country-select-' + makeId(24);
        this.value = '';
        this.object = null;
        this.ignoreValueUpdate = false;
        this.isSearching = false;
        this.lastResult = {};
        this.showReloadButton = false;
        this.reloadButtonTitle = '';
        this.disabled = false;
        this.localDataAttributes = [];
        this._onDocumentClicked = this._onDocumentClicked.bind(this);
        (0, import_select2.default)(window, import_jquery.default);
    }
    static get scopedElements() {
        return {'dbp-icon': Icon};
    }
    $(selector) {
        return (0, import_jquery.default)(this.shadowRoot.querySelector(selector));
    }
    static get properties() {
        return {
            ...super.properties,
            active: {
                type: Boolean,
                attribute: false,
            },
            data: {
                type: Array,
                attribute: 'data',
            },
            entryPointUrl: {
                type: String,
                attribute: 'entry-point-url',
            },
            value: {type: String},
            object: {
                type: Object,
                attribute: false,
            },
            localDataAttributes: {type: Array},
            showReloadButton: {
                type: Boolean,
                attribute: 'show-reload-button',
            },
            reloadButtonTitle: {
                type: String,
                attribute: 'reload-button-title',
            },
            auth: {type: Object},
            disabled: {
                type: Boolean,
                reflect: true,
            },
        };
    }
    clear() {
        this.object = null;
        (0, import_jquery.default)(this).attr('data-object', '');
        (0, import_jquery.default)(this).data('object', null);
        this.value = '';
        (0, import_jquery.default)(this).attr('value', '');
        this.$select.val(null).trigger('change').trigger('select2:unselect');
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {value: ''},
                bubbles: true,
            }),
        );
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._onDocumentClicked);
        this.updateComplete.then(() => {
            this.$select = this.$('#' + this.selectId);
            if (!this.select2IsInitialized())
                this.initSelect2(
                    this.lang === 'en' ? getEnglishCountryList() : getGermanCountryList(),
                );
        });
        const localDataAttributes = this.getAttribute('local-data-attributes');
        if (localDataAttributes)
            try {
                this.localDataAttributes = JSON.parse(localDataAttributes);
            } catch (error) {
                console.error(
                    'local-data-attributes attribute must be a JSON array of strings',
                    error.message,
                );
            }
    }
    disconnectedCallback() {
        document.removeEventListener('click', this._onDocumentClicked);
        super.disconnectedCallback();
    }
    _onDocumentClicked(ev) {
        if (!ev.composedPath().includes(this)) {
            const $select = this.$('#' + this.selectId);
            if ($select.length && this.select2IsInitialized()) $select.select2('close');
        }
    }
    /**
     * Initializes the Select2 selector
     *
     * @param countries
     * @param default_code
     * @param ignorePreset
     */
    initSelect2(countries = [], default_code = 'AT', ignorePreset = false) {
        const i18n = this._i18n;
        const that = this;
        const $this = (0, import_jquery.default)(this);
        const normalizedCountries = Array.isArray(countries)
            ? countries
            : Object.entries(countries).map(([code, name]) => ({
                  code,
                  name,
              }));
        const selectedCode = this.value || default_code;
        if (!this.$select) return false;
        if (this.$select.hasClass('select2-hidden-accessible')) {
            this.$select.select2('destroy');
            this.$select.off('select2:select select2:clear select2:closing');
        }
        this.$select
            .select2({
                width: '100%',
                language: this.lang === 'de' ? select2_default$1() : select2_default(),
                minimumInputLength: 2,
                allowClear: true,
                placeholder: this.authenticated()
                    ? i18n.t('country-select.placeholder')
                    : i18n.t('country-select.login-required'),
                dropdownParent: this.$('#country-select-dropdown'),
                data: normalizedCountries.map((country) => ({
                    id: country.code,
                    text: country.name,
                    selected: country.code === selectedCode,
                })),
            })
            .on('select2:clear', function () {
                that.clear();
            })
            .on('select2:select', function (e) {
                const selectedData = e.params.data;
                $this.attr('data-object', JSON.stringify(selectedData));
                $this.data('object', selectedData);
                if ($this.attr('value') !== selectedData.id) {
                    that.ignoreValueUpdate = true;
                    $this.attr('value', selectedData.id);
                    that.dispatchEvent(
                        new CustomEvent('change', {
                            detail: {value: selectedData.id},
                            bubbles: true,
                        }),
                    );
                }
            });
        if (!ignorePreset && selectedCode) {
            const preset = normalizedCountries.find((c) => c.code === selectedCode);
            if (preset) {
                const option = new Option(preset.name, preset.code, true, true);
                $this.append(option).trigger('change');
                $this.attr('data-object', JSON.stringify(preset));
                $this.data('object', preset);
            }
        }
        return true;
    }
    /**
     * Returns a key-value mapping of query parameters to use for the country get item request.
     * Gets called if a country is pre-set.
     *
     * @param {object} select
     * @returns {object} The query parameters.
     */
    getItemQueryParameters(select) {
        let queryParameters = {};
        this.addIncludeLocalQueryParameter(select, queryParameters);
        return queryParameters;
    }
    /**
     * Gets passed the search term and returns a key-value mapping of query parameters to use for the
     * country get collection request.
     *
     * @param {object} select
     * @param {string} searchTerm
     * @returns {object} The query parameters.
     */
    getCollectionQueryParameters(select, searchTerm) {
        let queryParameters = this.getFilterQueryParameters(select, searchTerm);
        this.addIncludeLocalQueryParameter(select, queryParameters);
        return queryParameters;
    }
    /**
     * Gets passed the search term and returns a key-value mapping of filter parameters (e.g., search, filter, sort)
     * to use for the country get collection request. Feel free to override.
     *
     * @param {object} select
     * @param {string} searchTerm
     * @returns {object} The query parameters.
     */
    getFilterQueryParameters(select, searchTerm) {
        return CountrySelect.getFilterQueryParametersDefault(select, searchTerm);
    }
    /**
     * Gets passed the search term and returns the default key-value mapping of filter parameters
     * (e.g., search, filter, sort) to use for the country get collection request.
     *
     * @param {object} select
     * @param {string} searchTerm
     * @returns {object} The query parameters.
     */
    static getFilterQueryParametersDefault(select, searchTerm) {
        return {
            search: searchTerm.trim(),
            sort: 'familyName',
        };
    }
    addIncludeLocalQueryParameter(select, queryParameters) {
        if (this.localDataAttributes.length > 0)
            queryParameters['includeLocal'] = this.localDataAttributes.join(',');
    }
    /**
     * Gets passed a country object and should return a string representation that will
     * be shown to the user. Feel free to override.
     *
     * @param {object} select
     * @param country
     * @returns {string}
     */
    formatPerson(select, country) {
        return country['name'] ?? '';
    }
    /**
     * Gets passed a country object and returns the default string representation of the selected country.
     * Feel free to override.
     *
     * @param {object} select
     * @param {object} country
     * @returns {string}
     */
    static formatPersonDefault(select, country) {
        let text = country['givenName'] ?? '';
        if (country['familyName']) text += ` ${country['familyName']}`;
        const localDataText = CountrySelect.formatLocalDataDefault(select, country);
        if (localDataText) text += ` ${localDataText}`;
        return text;
    }
    /**
     * Should return a string representation of the selected country's local data attributes.
     * Feel free to override.
     *
     * @param {object} select
     * @param {object} country
     * @returns {string}
     */
    formatLocalData(select, country) {
        return CountrySelect.formatLocalDataDefault(select, country);
    }
    /**
     * Returns the default string representation of the selected country's local data attributes.
     */
    static formatLocalDataDefault(select, country) {
        const attributes = country.localData ?? {};
        if (Object.values(attributes).length === 0) return '';
        return `(${Object.values(attributes).join(', ')})`;
    }
    update(changedProperties) {
        super.update(changedProperties);
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'lang':
                    if (this.select2IsInitialized())
                        this.initSelect2(
                            this.lang === 'en' ? getEnglishCountryList() : getGermanCountryList(),
                            true,
                        );
                    break;
                case 'value':
                    if (!this.ignoreValueUpdate && this.select2IsInitialized())
                        this.initSelect2(
                            this.lang === 'en' ? getEnglishCountryList() : getGermanCountryList(),
                        );
                    this.ignoreValueUpdate = false;
                    break;
                case 'entryPointUrl':
                    this.initSelect2(
                        this.lang === 'en' ? getEnglishCountryList() : getGermanCountryList(),
                        true,
                    );
                    break;
                case 'auth':
                    this.active = this.authenticated();
                    if (this.active && (!oldValue || !oldValue.token))
                        this.initSelect2(
                            this.lang === 'en' ? getEnglishCountryList() : getGermanCountryList(),
                        );
                    break;
            }
        });
    }
    select2IsInitialized() {
        return this.$select !== null && this.$select.hasClass('select2-hidden-accessible');
    }
    reloadClick() {
        if (this.object === null) return;
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {value: this.value},
                bubbles: true,
            }),
        );
    }
    authenticated() {
        return (this.auth.token || '') !== '';
    }
    static get styles() {
        return [
            getThemeCSS(),
            getGeneralCSS(),
            getButtonCSS(),
            getFormAddonsCSS(),
            getSelect2CSS(),
            i$5`
                #country-select-dropdown {
                    position: relative;
                }

                .select2-control.control {
                    width: 100%;
                }

                .field .button.control {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: var(--dbp-border);
                    border-color: var(--dbp-muted);
                    -moz-border-radius-topright: var(--dbp-border-radius);
                    -moz-border-radius-bottomright: var(--dbp-border-radius);
                    line-height: 100%;
                }

                .field .button.control dbp-icon {
                    top: 0;
                }

                /* https://github.com/select2/select2/issues/5457 */
                .select2-bug .loading-results {
                    display: none !important;
                }

                .select2-results__option.loading-results,
                {
                    background-image: url("data:image/gif;base64,R0lGODlhTABKAMIFAAAAADU3NF1fXIuNirq8uf///////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6NFAmrvXgNAbr/IBhQWWkSQ6iGgTCQJkNwa/daRB0KcFwSAd1HEBF6Rr6kI2UkLoLGnjI5gOp4MmMnMJjGmFopo6oViXGzMsipJKvfRqTXS0BtAvhgS8C/zf8RbkIBgIVgcGZKNB5dJ1ZajYUFgnFiOVpykhePNZmXUZoxZTKcK5GhFYc6YqpCp5KtOq84iLVvXKhptpBnqA8SdyqZvnNAcITEbbtbdAJcvRjGywB5VCvDGKVCLpKL29CxNbOwatgK3lfJDug1Pdoq0L7Srguf9OoVowrznfHE/NdIhFuDDwI7FWzOlfEnyV66JWr8yHunYpwGOAmbwbHo/gDgLRc36ojcMI1hR0rTdj0L5SxlRJOF6hz8KLHgDzvO8GS0OaUOHh3IeCZBQXEHTKEoagUVegHlGyw9OfoYWM4LDVxenCpVFuLovpmYXIj06tED1AxlgZ7VCAoDWFNeUxUFIbXAXLq5tJqq8JagOqp4O5bBis/hqgh3bSBNvBawWaaT7g7rywxyAcoAEpap+w9Tvc2WFeibkDhuIUwkUIfWO4QEZs6+HGceM3oxJFJaduLDDAAiL568x/Fe2rmMbtKDjwOSvaWXLkw1i7Fm4S/xh5U9eR9hmLSW2GgzrIvwkfYWtZ8uYT+Y7rKcegvs28sK9Vx+pb/ibbUwnV17Ee736qDAQX7fhaZEHfvwZ0ICACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/o0UIiu8OOcBuv9gKHqSZmLBqHoCdb6wQqTrV8Z4Xgh1N+jAAqcnYNBqv2CO0AMUGcwmIKnMRHuB22NwlDq1JgrP2wlQcUOyeiU4V1+UwUAQoAfu9PbA9a4SuGshT30ogVJZhA9XUi2JfYdgjlZzXQBalSKIklaYIZoTnSFum1BNZg+hmaNVaU2rEDOGsj2RSn+pswBmtaQRf2Neda+9CwR0uR8BxA6xyCLDjq2BKXfVR5+9gGSnyzHSNcrdOt8j2OIXFGDkIucMcz1Uxk28xIsqms017VC4ZTfrIAa169dB4A4p0BLZU2FQATB49Gw9RIJhIrhGEgl+SFj+TGM5PelCcvEoAiMaZ8i49bmFEsuefZRIejK374IcLnao1TGzJ2LNCZRkhfspQxsyn6SMomzYDeAsmsQstuS40ikyppsWbhPQImQ6SkjfSCUSdp9MXVR/jh2BlaiDtZ7KErW60e0LuHXtLpCDJwKjn3HuZNJyDJzaJoPk0fqptFxHLHIJ5bvHwFTklRqL4dV1+c1kFQw2T2Fsyp2UzkEUU6xsuZ1oAA4aOxb3epVHqIk8mnRHsq0S2eXoaV3x0jPdZD4/kw3ybtuL44P5oAu6xreisyBoVNOVErUQ7C2zp8WgPLwr7xBeh8f9prn5ZCrFARda3O4vaqacyEHfzoIE9F4JAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6NECWhvThLwLv/YChywZSdBRGMLBAI5kUMwgrEaGa3HJ7/wAaPFCwaF6qh78hEJZXN02AUCAyWj8Fu6IIFCQKux3okiM9ccvQ709aqcIF8kMKugU80S26PhvWAHF53eUODd2tmQwGIjQyKPHSOkylcfZSXGVNiko2bXJ2aW4GkIqGJWqUsVpmUC1qjPC9Xrpqqlph/t4uUn6pwLiynibGRTK1fxSKMtU26LbTNzrjSUaDVUZAtyNgYviOH3UVg1NVPsz/fwtxFz9sX6i3hRuRnwxD1gLNXEhUDNMoMsXsUb5eeaHdqGJSF0FwqUisE3BP3YEYVFxfhvJBYzYGiN3eBOHqUEPCWmmYPF4qY1wikyg8T15R8edKRy5djBubQpo9VvzoAt7BcczOSTjANERWkEtNjg6UhBDjdKabEVBQpoV3NkUanU6gevDqdSUIsxULgtlKFovYEzxFmz15re6Koh6Z0Xy2KS5EsAKniaiTVwAVwNZAvWuVrYbXW4mVDFfjt4gpsTgtoVxnOlpVxpseyOo6zG5Wb5ZWRkRSgERLPZMbATJrtjLMqXwW0azNtBFr35cqkd9Wslhvi4JGwXs+63W2Cc+YZEgAAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jRRCK7w4ZwG6/2AojqIgaVhArkAgDCckEVwooBnBgjHu/5caawAsGh+qHfHIPBKSu1tzChTuPC4KkEYFDqDXsGjZpVIGA4FAFWi71Jby9CsOw+WMZ32/C/SKA3t+eF06VwGEiXo7iY0TYX+OZYFiMJKEdHyaAJGXCwSZmyuDnhcUa3wvWqUOVqJ9nVOLr6ImVK60fGRNlHu7gBykZnXCrD9go8ZMvUPKTJDOTrghxdE/0zbWR9gg1doozCxS3z7hUbHkEbSqFmdpYN6NobnNxqD09dag3GEuv+kT0Lgh0cYSQAZpcvlDJ4kGPhEB/ilC9nCELTyzKoaRaKYko8ZzZfh9DMGxiCFRbyqcUYOKxDgq5jaabNmCYRVBNlGAKmmE4qic30R+iHdQwckoRVPITCrDJzWmQQ4BBeiUB9QLYa42haXVgUeIUwEKBcCTaUxqYdNVHdrVwdmnbRmM7VC26FoQL7t+JVg33dF+q67u7fNC5zsAeSfSa9OiqkFJbz8mlncX30VPDkcOTTtn7iaiDRM+zAJwX+WhquJ+MqqFc5EEACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/o3IIomyMOv9yABgKI5kaZYCxkFEcL5AkHKE4J6BujYCLOq7oBDiAwmGyKSjVQQqn8LBzeeEWjnSokhWvXojxdx3TC6bF0ytOte19tTwuHiY1s690vaOoD2ex3xFA39lH02EZoZag4hkgXF6jUkeAVMAfpKNlHEglYyZDDWco2xldaOoIwGfSYqpryF3SKd9UANvnZE0ljAzoEO4MAO6vw+8J8TFS4vKk1rJzQ2uJ5jRQsEv0NYK0y/D20HdvdrNoqTgG+LU6NfHIazsdBI25PEbNe6xMsP1f5uwRvpZUQcwhC9CBAuW+OYon0IYq7zQeijHDcVUsmYB5FKNgYIAG3YELsCm5uCOLCQytuIET4mhiFcSkjAp8QtKHwHsQbgpTGcHh1tEgpL5zicEkiVUGp2IwmiHZ06XHYoaCminllGRzqQqzWoMob+8xuDKgOc6sgq0pgSbSSwIrEbdxqjm1NwauPFAckrB1pRcETTtmYXYF6FbvD7tmqCL1mPSwtFuIm4cirLlBQkAACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/o0UQsmQMOutBfhgKI5kWQ7cFpjsF6DYQw0tIKRQHcZ472eeGupHLDpWQqNSSUC2XssokRYS8KTYrHbL7Xo1VJ3Ydc02x+j05/YLiwNlJY3NdLICX+25lucSxHF9S24lVoKHiImKixAUdmgCQ4wEQWpqdHqWmiySRZWboCEXRoRimEQCj51FpXeBjA+PJniwPq0kq7UcgLo+e669Pp8mp8Ebwyavxg23uMspt1DPP5QvytPY2drbzxapNQGG2AOymuKL5KFPh3/qaHB+5e5iuUW/85vXx/ihxb7q4S7MIBdAHgl/tsxNkYdQmBp9HH6NimKwBERfWZDNulhYq52Oht0qiuLGIB04kgw0joCHUoHIDxyDvQTQcsG9EixbUgIXs5dKEfW2NQuRs+VMkONM1ZzwU8Q5kjt5Lr0JdGkDWdKsMnMxUauMnl7Dih1LtqzZs88SAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6LyEmKhDjrTAL4YCiOZFkOm+aZLBBcGDEILShUKUPXH57/wMyuhQoaj45Vy4dsOp/QqHRKrVqv2GxsyOu6ilUC10smB8CpjpnpFH/Ozu6ArT2qW6+6lKLv+/+AgYKDD25lIAE3dHV3h4cCVo2OkyM3TQOUmSaWQQSOeXYCSiFonWMsnGFQmDyQhDmsNYuvhacjoLQpoyW4uRpjAYkDcxa+xsfIycrLzM3Oz30ywbu3AsTHsZpfs1me2iy9V7bfJnBUkuRkqU3o6YelQePua3bawhcyotQt60Dy/Nxq7bPh5F8JV212wQMigx6VAebaeAmXzBuPhcga8ghoOqzdLYzJDH5A+GygCJAZTSLi2FHlG5a+PI6A6etfsH7NPAmbQxOaz59AgwodSrSo0aNIkypdyrTpsgQAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jBRCxLgS6s23AGAojmRpmkPWQd/pAkHKVe8pqFpQg/fq/8AG5SL4xILIpHLJbDqf0Kh0Sq1ar9iCQLfrhgbWlndMBoF/BG43IBWLLMD0TpCt2+/4vH7P7/ubNGUgAT17goeFUXKHjCR0SwONki4BODNqXmxKgS83lhqLc1UEAzpHSZGifx0EO5WrsLGys7S1tre4ubq7vL11pG4nhGexpJMhr3qpxyanV8vMO59OmNFeiUuh1oKPSsHbh8Ro32VFKURbkpo+2tfTHtWU4h3QXe9x8SIyQPUvyVGl3tzbENDVFVL/kLQ7MTAWORLOcLXaMU8isAAYHfnaQByBwsaPIEOKHEmypMmTKFOqXMmypcuXMGPKXJUAACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/otIOUiVhcDNOxRAKI5kaZ6n4HUg6gLBkG1W8LrqyhCCTea64K71kwmPyKRyyWw6n9CodEqtWq9Y1m1rAk6J3LB4ZNQRfNyA5nkWq7PwuHxOr9vv+Ly+PR4J1nVofWMBVYKDiD9MA4eJjiVvZo03f0p8boA0PTcVVWAoAV5CNQBlWS1/mXqrrK2ur7CxsrO0tba3uLlHPAGTJL2Vrp+PonGbjy+mVQPIfcpOl819wU3D0tOqo77XhM8r22GhFwPHjtQejIPnHjyDMSvMY95H8WLzEWLrTe1h9xG8KIpJqWciRrYVpET4g5IuRCgMUCwcrCJRl8WLGDNq3MgVsaPHjyBDihxJsqTJkyhTqlzJskACACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/o2QQQcpF+rN9QBgKI5kaZpD1w3B6QZX9kyt6wpqru+OYIc4nnAI+QACSAFFopARn9CodEqtWq/YrHaLNf6+okAq6wWbzyKBk0jwkYJTQg0c4GLdNph9z+/7/4CBgoMdNGhpa314h2h6V3OMkSSOQwSSl19jQm2QJmpsnV9wTyxHmlZtZnWEO4sup6wdoSWwsba3uLm6u7y9vr/AwcJ7EgKzkxa5cpgiyX+lzK92ltFntVKu1apUZdqMlELd3pKjOamXAQJKFgPGx6qJHBLvtPEa543XKtAm9jvUZ8r9MxYi3Z2AUdp80kJvhD5d/F74yxXxhMBe4voNy1YiMJ2zYBMsTBxGsqTJkyhTqlzJsqXLlzBjypxJs6bNm1oSAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6LFCKplTDrnQX4YCiOZFkGGKdOgxkGaPpQgWsHa67vkx0KvKDQ0fIBh8gdwQfAJZ/QqHRKrVqvWOWgxuyCjtWld0z+yqDbj+A8LHpRWarH54xDCVwX3J4lDAZsfIKDhIWGHAMCeWVrh3NlZXtTj5CVI5JDBJSWnCIDUW4vjUF4kIFCp0+bLqOHOosun646pT6pszOwJJi4GrV6t70MFH+KumDCycrLzM3Oz9DRfYkwNwGAyn66lsiCmp0+sli/4F3dT9/llbykoerrwRvp753nPKt0AtjEiuDxiHpaqZhHxh6PNCDYHdymJwoebFLIGZE2gSEJcdHcufjXPUtiCYHQENrAGA3fCIPNxNygqMDjJZYVmcB0KaKOtFIWm8BsYIEaF5I7gwodSrSo0aNIkypdyrSp06dREgAAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jEgyZCEw670H+GAojmRZClz6COYXoFhGBW0dqHiuX7W4/0CHp4cKGnXDmiB2bEIGtB6A6axqkiCqdcvter2EqHT8GXwVLLJ6DQhoqyxzlcCWn7fi2vtulLr5TXRSe4AqMz12hYqLjE4UaWwBiYyQbGs3XViWmyOEP5WcoSCTR6AApDmmg407YWqerBpkRbE5miaotRqCPbo5rjawvgyqI7TDMmPHyA7FJLnMDQTO0NG7NEvW2tvc3dN5JS8V1tOiIJKx4OadfMDrY8I/t+9jf4H0oval+KGYTfMmXiyZMECAOjbxVABEh2TTMiNJ9AXhRcafIy7u/HSLcFnwxEYGAJ99XBBShMSNzkIwHFmgo4iH3jSyVDBm5gWX5xIOy3hCp6+SIGBu41miWrSUIWYiHTWSqMeRUKRkm+k0p80F5UZYvEpSjFCuF6aCHUu2rNmzaNMmAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6MFEJVhTjrTAL4YCiOZEkKW/p0JhAIkkYIbR2oeK5PdYjuwGCE1gPEhEgcoQhIOmXMwPGJnDFDgQF1S7Rpt+Dwk+K5Xr9iS9nMZv7EHbSTdYWl7+va9D5m7vlCSz1SgEIDZnKFHF1mf4o4hyJZjxAUAnlXL46KA5htUZtIkZ+kJIRUdKWqIYlJqQACrUqMV6GUKZ4tt1WjNW+7O68mv8A5vS22xRDHJsnKDrQlxM8cbtQbBMwmstcT2i3cxd9Fdt0N4yXh5hO5H5rrKjMv6sUUA5ft7uXwVqvu9Gn6+SsxCVC2fANHANzRKeGnU06iOTQDsQrCib5QXfQRjmuCvUv+nMXLlUXkgmykpgUqsy9QmwEmU8QciQheho0gFnZDJ2LmM2EmbFYrorMbzhtCIUgk4VOZoB5JK/mJ6uCpHqrnyDUFBpREUWpLR2zdFVbE13o4YY191LBIRZsoM63lc48NUnj30opQSa3roLl3eI4oGNXvYJhYLfRombjA0reN1YAoGZnDhcq7EgAAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jMhJSoU460wC+GAojmRJCtemOsRABqjEDa5pA0G67vxK3CJdb0hk1G6CorI48NwCy6jqCBRKlQQBcBQYXDHUrRjn/fIkNIEgwG7DaBar+dwci3NzTMfO30LzEWZ7dnKAV4NPhoaIJniKX2ElXY9LdWJJiox9W2WPmpsgXYWUC1lOdm+jlANaoHYoiq2usziqTKe0oJ2CrbBKsoSkUp82tsIrY7vHRcQjystDP0C+0EV+xtUPWZzZQ5ElmN0q25fiGuRjf48ubwMUaKy4fOGewLkiosfS96HPwmuuPAjwZy6OGjaN1Mgo2KCFPVDUoLWQx++Do3oUK54A1KhMY6MvF9B5vINtR8eRL+ZMfKLGXYUWTTIG4yUiRg9L8/JkiXiLjzqGGWRKArrhZE2iG76VIIh0gVIuTTU8LFES6NQR9KKyuKYVgtFaXbUJDRFW2xaeZZ+G+FlWwVgQTJt+BdvWwlu4dd3eyat2RNVsfZ11lXC1mLCFHES++lvkoZt7FyntQzlJH0qLcXUWnhX52OZNAxlfCXzHHdCJCO+Ezqvg5ctjCQAAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jRAlJbw4azqA/2AojiQ4bKjWeYFgYdIQlDQQTGmub3IN7sCgQ+Cz4YTIFKEY2BFkp6RqVjw+esVP65XCZj9W3epL9gWiUudgIBDMAvBWu5JOP+Hl2rmeIxDzgB8CfIQPfmQuhYoLBFQ+i4tLVZB8knpohn6OIwNhUmNFmBmNgaWXil6mJImUMAUyf4idrReHqkWstJa3WYO0sSNUwLe+lJ45bmVNtGnDNaLMQZs0xdFCu9TWSaA02kikesfeG86c4uO1vUqNm9CV3DTujNM1uUjlNOcR+L2ddDEy6H2xlwMeL0D61Ag8GOJMQkJP+GVpIQ8do4htqGyi+MnQW0ReBKM9YRisoxRwJEnc0LUwpaA64iS6tNEq1UwR1Qqh1CJgTYEKnQKqqiiFSMhRNpkQtcggaT2mKGypg4qiJU6qKJxywroBWz6uGmS+BJthItkMYj2YpOqVxFKyWdZC1Qpi2VkIBq/ehZDlLde0K4HIvddXxx0Wgw1bBZETBr7GdfKWRLrYht+odEUExpC27mVDbJSZ7NywZ1dNgCDDqMzkDetwQSTffHby9c09lUgz3IzKtqnE14Qe3IL1jm+Oew1RsAA8RwIAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jRQiK7w4a0wC+GAojmQ4bGi6UFkllDAYSGptc7EYRO8X/ILBgHUrNga5j4BW6OWYRtvAk9sxOskPNIpBZgGnC+ErWm5bBCcZcE5h1/BYIMy1EQZBQUD/2++FRHWCC2pxIXttgypehl8CipAPaXB0kZYFVFVMb3KJlwxZVgpjWZWfDIUwphOMWYGCd5lJjyhTjbdVq3W2uCU/uqcOsbKzQZ7BEJO9I7TIycsxzc6EMj59AMSGwNMasXHH3BrZMeDhHOMk2+YbX3Sc5OsToUzoh+WW775MrTBL644N6tnjxg/GDAcF+wVLpfBCwmj3NDCMoe7KxFACjFWgcPvnhUCIRXhBu3UQkp6RSfaY6/hRzo9X8YR15NOnT8YhMGM2OInLmM4rLdfM+fmwV8l1RZf5qxNRGUodK4P2DDfmD8cJrIRILRFxXT6AP1ts9RG220USosqK2SpNLYSkIrr+JDXLrQa4PirhAWRB7VkQlQQCkTvo64i0LY9STUzDsA7CsP5iaxwUMtNQKySDiadZGl5sXttZzLJ0mlRTdHO0PaUZwOomX9JecprkQmswlu+u2UY7FySRKcH1nlVRLJzSGT6TMNOiAJ6xIF6fg3YNOtrcwJ9q40JBe5w5uSXdRqk4UgfrcIaGm4Le1xC1z6UCeW83GdYJOS0lAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6PyEKgvTjrGID/YCgCQrVBwziYp0UMQjfOn4ARAh2WbU/pIkcOCBj4jg0ZkaXUsZBHAhEQaBCatMATihlgZ9rLdboz9nDfJdRLbrcDZm50AIt1AgGBXr+S+31SbXp/KFtnQ240cRpjQHmGfiluiwuNQDyEGWkjT2SZLZZZLIFqnzdkkJJkNqZsZJQuiImzb5BcL3i0jnCmhKoiHQJ9vb2hgrDEPZuJyCeucLYZXrnLq9EOxiB5xdUz1zhkvMS/pQ3kNJjJCtlgVlNV6hGrDN1U18nnMwye8RZT6bLQ9XsQcAarBfXsDVTg6tKDfAbvQQGH6gJERRIzsNPR/gxbQUHCJlCQQCeGLhIZPZ5cCWyYL5aJ0g3EtRJPyIVr7uDJEzIlTmnvoP080rCNy6GndD1CKiahDnFMhcD00FEDm6oZPp7EGkEWVEAjX9hR2qIoiKN+0Mw6aJGIzJdu4Fm4KIJtJlL/XAjy6cNkXmwJw/SjGwKW1hCCBxL+kPjHFK6fDhdmsJgK08D0HjOtnJgf0o0h9k2JCpoxkyl8M71jIfkD5FZ/GSZMLae06yT/aENp/cGB2YgLeVNVmbuf07frhHtA/qdy71iTdEdw7qFx10TWe/x2dMJvzBX3xOqyq9FpOPOikCifqlnOdvbvXm+wDX9yMrX1gYmcOQ2+EdCoDKCRCxHBoAXgCRLsl0wCACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/jDKSSkRIOsNQm0EJwrEF2FiygXkdwVqnA1ldMlba+7KjWcCB+w34Bkfgx8g2BviiseoIqmsNZUBqLQycD4lBC82YHW9lJwyr4tut7NbKYEwGAgC+A5eIKhr44AFdE5MR0NZaoFTYjhkJihtfxaMMXCKBXdviQpohZcSkDIeC2E/jp8fWFZURKgTbK0OrEqSgbONnq+UbrymtYB8vZ2/rhBzW5vFDqUpyROhGn3FsLEuuyu5PMy8oxS3bc7L0KbHUWHXKafG6BuWrtSNm98q2crjKpLzIurKIPcif9h1INZPkMBuIWgVhKBPhBWBHcK52iaqAUR+BeFVStT+EKDELR05ECwQcsRHC/9ijGTgQxgLEnNi0rEDkd5JJMJW5BT5ic7OXogWsjyTE0afm0KTLqSDAamsoEpJacT44RbUfkRT1JtAkYOOTxpVOMVUJZBPTSYSolnJVRjbK27cpU354yRdGV+91dTAYqygTHHflmyX1xzgta/cvNWmOMJgIH5dPAbwq2uMyIyx1LqrAfORtWUsN4sqCE2ZwVsLcl5CarVnOarginptDiIp06Rly7itMPfjGqL35SarhMFqALQz//CkFkdh1YiNd1J6vF715GBqbm1ZDdXkbg+4dwc0OSKFvUAWMzzO9+RZbleNkWTPc0dwbnrQq6BaVf8tz/FHhPUfN+pVkNWAnWC3Dnr+waQUUwhmgAcNw7E0Hx5iULIHhRXaJ4hMQiUAACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/jDKSSkJIOvNcyCVQ2gCGEJDp3aBMJhnca2qQAk0Z8e8jOckBzDYKzJSw50MM4QZi0hgoDEbApzPSVSKbQyYVk+pR/iFPYNn9cyWprNGAmEwEAgC+Hygnu7C1V85Sn+EW20ZbydmKokhYEN7fkVzj1wPhjSDhBJzYQwjVo2bFpUqUwuBTaMVmKaiCq00r3+pVqcVoIe6YXurMl+luxyRvjFzdxuzxWprQGNxy7VtkhLSAC1ZzbvKD2WQ1CLBNHhyauLj4No53HDW6A+LgsvwYaLxNODL9Qu5QOzz/TKZCIhv3gRbMO7VMBhBYYdG3qzkGxWrgyZYZ14YdLj+MEJFU8+ycVxxEUJEXS3oyFkpp865JBNRCJvJKKailzSHaWT4yR0bPC54kjkWUighSsH+GbXgc9hSI8h4PUlR9Ki6b2QWfdjUNBSPqwCUVstZMgJBnWRw5khZLsTHDbdYqR1WNcZIFkrltKlbJOq+sRmLveXAbTCReXeTXZp7RejZFV14iT06V5PhsE9lhHGSOENmBZ2VgNXxWTNW06pKq92KGojNVaM38Js7GbbakKFLG47bVQPrpbE1iJobl2dwD1h6H+bJ+NVJSwaPI4fAuFc0NuAYZyg76bLwG20+vBbRmYNNv2da8P1UoM4u7ia1r82T89r4I/Lrj6vtMb8nft/8WVDefwCsd9SAu+ARIBx3+Lfffb60ZMc1vNgBYWkyZKghQwkAADs=")
                    background-repeat: no-repeat;
                    padding-left: 35px;
                    background-position: 10px 50%;
                }
            `,
        ];
    }
    render() {
        const i18n = this._i18n;
        return b`
            <link rel="stylesheet" href="${getAbsoluteURL(select2_min_default)}" />
            <div class="select">
                <div class="field has-addons">
                    <div class="select2-control control">
                        <!-- https://select2.org-->
                        <select
                            id="${this.selectId}"
                            name="country"
                            class="select"
                            ?disabled=${!this.active || this.disabled}>
                            ${
                                !this.authenticated()
                                    ? b`
                                      <option value="" disabled selected>
                                          ${i18n.t('country-select.login-required')}
                                      </option>
                                  `
                                    : ''
                            }
                        </select>
                    </div>
                    <a
                        class="control button"
                        id="reload-button"
                        ?disabled=${this.object === null}
                        @click="${this.reloadClick}"
                        style="display: ${this.showReloadButton ? 'flex' : 'none'}"
                        title="${this.reloadButtonTitle}">
                        <dbp-icon name="reload"></dbp-icon>
                    </a>
                </div>
                <div id="country-select-dropdown"></div>
            </div>
        `;
    }
};

//#endregion
//#region src/dbp-country-select.js
defineCustomElement('dbp-country-select', CountrySelect);

//#endregion
//#region ../auth/src/i18n/de/translation.json
var translation_default$1 = {
    'logging-in': 'Anmeldung läuft',
    login: 'Anmelden',
    'login-failed': 'Kommunikation mit dem Anmeldeserver fehlgeschlagen',
    logout: 'Abmelden',
};

//#endregion
//#region ../auth/src/i18n/en/translation.json
var translation_default = {
    'logging-in': 'Logging in',
    login: 'Login',
    'login-failed': 'Communication with the login server failed',
    logout: 'Logout',
};

//#endregion
//#region ../auth/src/i18n.js
function createInstance() {
    return createInstance$3(
        {
            en: translation_default,
            de: translation_default$1,
        },
        'de',
        'en',
    );
}

//#endregion
//#region ../auth/src/keycloak.js
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
var KeycloakWrapper = class extends EventTarget {
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
        this.MIN_VALIDITY = 20;
        this.CHECK_INTERVAL = 10;
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
        if (document.visibilityState === 'visible') this._checkTokeHasExpired();
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
        if (authenticated) this._onChanged();
    }
    async _onTokenExpired() {
        console.log('Token has expired');
        let refreshed;
        try {
            refreshed = await this._keycloak.updateToken(-1);
        } catch (error) {
            console.log('Failed to refresh the token', error);
            return;
        }
        console.assert(refreshed, 'token should have been refreshed');
    }
    async _checkTokeHasExpired() {
        let refreshed;
        if (this._keycloak === null || !this._keycloak.authenticated) return;
        let minValidity = this.MIN_VALIDITY + this.CHECK_INTERVAL;
        if (this.DEBUG) console.log(`Updating token if not valid for at least ${minValidity}s`);
        try {
            refreshed = await this._keycloak.updateToken(minValidity);
        } catch (error) {
            console.log('Failed to refresh the token', error);
        }
        if (this.DEBUG && refreshed) console.log('token has been refreshed');
    }
    async _onAuthSuccess() {
        if (this._checkId !== null) {
            clearInterval(this._checkId);
            this._checkId = null;
        }
        this._checkId = setInterval(
            this._checkTokeHasExpired.bind(this),
            this.CHECK_INTERVAL * 1e3,
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
        const Keycloak = (await import('./shared/keycloak.D4BYgFqv.js')).default;
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
        options['pkceMethod'] = 'S256';
        if (this.DEBUG) options['enableLogging'] = true;
        options['checkLoginIframe'] = this._checkLoginIframe;
        if (this._silentCheckSsoUri) {
            options['onLoad'] = 'check-sso';
            options['silentCheckSsoRedirectUri'] = ensureURL(this._silentCheckSsoUri);
            await promiseTimeout(5e3, this._keycloak.init(options)).catch(() => {
                console.log('Login timed out');
                this._onChanged();
            });
        } else await this._keycloak.init(options);
    }
    async _ensureInit() {
        if (this._initPromise === null) this._initPromise = this._init();
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
        if (!this._keycloak.authenticated)
            await this._keycloak.login({
                locale: language,
                scope,
                idpHint: this._idpHint,
            });
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
};

//#endregion
//#region ../auth/src/util.js
const LoginStatus = Object.freeze({
    UNKNOWN: 'unknown',
    LOGGING_IN: 'logging-in',
    LOGGED_IN: 'logged-in',
    LOGGING_OUT: 'logging-out',
    LOGGED_OUT: 'logged-out',
});

//#endregion
//#region ../auth/src/auth-keycloak.js
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
var AuthKeycloak = class extends LangMixin(AdapterLitElement, createInstance) {
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
        this.keycloakUrl = null;
        this.realm = null;
        this.clientId = null;
        this.silentCheckSsoRedirectUri = null;
        this.noCheckLoginIframe = false;
        this.scope = null;
        this.idpHint = '';
        this._onKCChanged = this._onKCChanged.bind(this);
        if (window.playwright) this.setAttribute('data-testid', 'dbp-auth-keycloak');
    }
    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case 'requestedLoginStatus': {
                    console.log('requested-login-status changed', this.requestedLoginStatus);
                    let newStatus = this.requestedLoginStatus;
                    this.requestedLoginStatus = LoginStatus.UNKNOWN;
                    switch (newStatus) {
                        case LoginStatus.LOGGED_IN:
                            this._kcwrapper.login({
                                lang: this.lang,
                                scope: this.scope || '',
                            });
                            break;
                        case LoginStatus.LOGGED_OUT:
                            if (this._loginStatus === LoginStatus.LOGGED_IN)
                                this._setLoginStatus(LoginStatus.LOGGING_OUT);
                            this._kcwrapper.logout();
                            if (this._loginStatus === LoginStatus.LOGGING_OUT)
                                this._setLoginStatus(LoginStatus.LOGGED_IN);
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
        let response = await fetch(apiUrl, {headers: {Authorization: 'Bearer ' + token}});
        if (!response.ok) throw response;
        return {roles: (await response.json())['roles'] ?? []};
    }
    async _onKCChanged(event) {
        const kc = event.detail;
        this._authenticated = kc.authenticated;
        if (kc.authenticated) {
            if (kc.subject !== this.subject) {
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
                    console.error(error);
                    user = {roles: []};
                }
                if (userId === this._userId) this._user = user;
            }
            let tokenChanged = this.token !== kc.token;
            this.token = kc.token;
            this.name = kc.idTokenParsed.name;
            this.subject = kc.subject;
            if (this._user !== null) this._setLoginStatus(LoginStatus.LOGGED_IN, tokenChanged);
        } else {
            if (this._loginStatus === LoginStatus.LOGGED_IN)
                this._setLoginStatus(LoginStatus.LOGGING_OUT);
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
            forceLogin: {
                type: Boolean,
                attribute: 'force-login',
            },
            tryLogin: {
                type: Boolean,
                attribute: 'try-login',
            },
            entryPointUrl: {
                type: String,
                attribute: 'entry-point-url',
            },
            name: {
                type: String,
                attribute: false,
            },
            token: {
                type: String,
                attribute: false,
            },
            subject: {
                type: String,
                attribute: false,
            },
            _userId: {
                type: String,
                attribute: false,
            },
            _user: {
                type: Object,
                attribute: false,
            },
            _loginStatus: {
                type: String,
                attribute: false,
            },
            keycloakUrl: {
                type: String,
                attribute: 'url',
            },
            realm: {type: String},
            clientId: {
                type: String,
                attribute: 'client-id',
            },
            silentCheckSsoRedirectUri: {
                type: String,
                attribute: 'silent-check-sso-redirect-uri',
            },
            scope: {type: String},
            idpHint: {
                type: String,
                attribute: 'idp-hint',
            },
            requestedLoginStatus: {
                type: String,
                attribute: 'requested-login-status',
            },
            noCheckLoginIframe: {
                type: Boolean,
                attribute: 'no-check-login-iframe',
            },
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
                    await this._kcwrapper.login({
                        lang: this.lang,
                        scope: this.scope || '',
                    });
                } else if (this.tryLogin) {
                    this._setLoginStatus(LoginStatus.LOGGING_IN);
                    await this._kcwrapper.tryLogin();
                    if (!this._authenticated) this._setLoginStatus(LoginStatus.LOGGED_OUT);
                } else this._setLoginStatus(LoginStatus.LOGGED_OUT);
            } catch (error) {
                this._setLoginStatus(LoginStatus.LOGGED_OUT);
                sendNotification({
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
};

//#endregion
//#region ../auth/src/login-button.js
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
var LoginButton = class extends AuthMixin(
    LangMixin(ScopedElementsMixin(AdapterLitElement), createInstance),
) {
    static get scopedElements() {
        return {'dbp-mini-spinner': MiniSpinner};
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
        return [
            getThemeCSS(),
            i$5`
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
        if (this.isAuthPending())
            return b`
                <a href="#">
                    <div class="login-box login-button" aria-busy="true">
                        <div class="icon" aria-hidden="false" aria-label="${i18n.t('logging-in')}">
                            <dbp-mini-spinner class="spinner"></dbp-mini-spinner>
                        </div>
                        <div class="label" aria-hidden="true">&#8203;</div>
                    </div>
                </a>
            `;
        else if (this.isLoggedIn())
            return b`
                <a href="#" @click="${this._onLogoutClicked}">
                    <div class="login-box login-button">
                        <div class="icon" aria-hidden="true">${o$2(logoutSVG)}</div>
                        <div class="label">${i18n.t('logout')}</div>
                    </div>
                </a>
            `;
        else
            return b`
                <a href="#" @click="${this._onLoginClicked}">
                    <div class="login-box login-button">
                        <div class="icon" aria-hidden="true">${o$2(loginSVG)}</div>
                        <div class="label">${i18n.t('login')}</div>
                    </div>
                </a>
            `;
    }
};

//#endregion
//#region src/dbp-country-select-demo.js
var CountrySelectDemo = class extends LangMixin(
    ScopedElementsMixin(DBPLitElement),
    createInstance$1,
) {
    constructor() {
        super();
        this.entryPointUrl = '';
        this.noAuth = false;
    }
    static get scopedElements() {
        return {
            'dbp-auth-keycloak': AuthKeycloak,
            'dbp-login-button': LoginButton,
            'dbp-country-select': CountrySelect,
        };
    }
    static get properties() {
        return {
            ...super.properties,
            entryPointUrl: {
                type: String,
                attribute: 'entry-point-url',
            },
            noAuth: {
                type: Boolean,
                attribute: 'no-auth',
            },
        };
    }
    static get styles() {
        return [
            getThemeCSS(),
            getGeneralCSS(),
            i$5`
                h1.title {
                    margin-bottom: 1em;
                }
                div.container {
                    margin-bottom: 1.5em;
                }
            `,
        ];
    }
    getAuthComponentHtml() {
        return this.noAuth
            ? b`
                  <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
              `
            : b`
                  <div class="container">
                      <dbp-auth-keycloak
                          subscribe="requested-login-status"
                          lang="${this.lang}"
                          entry-point-url="${this.entryPointUrl}"
                          silent-check-sso-redirect-uri="/silent-check-sso.html"
                          url="https://auth-dev.tugraz.at/auth"
                          realm="tugraz-vpu"
                          client-id="auth-dev-mw-frontend-local"
                          try-login></dbp-auth-keycloak>
                      <dbp-login-button subscribe="auth" lang="${this.lang}"></dbp-login-button>
                  </div>
              `;
    }
    render() {
        return b`
            <section class="section">
                <div class="container">
                    <h1 class="title">Country-Select-Demo</h1>
                </div>
                ${this.getAuthComponentHtml()}
                <div class="container">
                    <form>
                        <div class="field">
                            <label class="label">Country 1</label>
                            <div class="control">
                                <dbp-country-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"></dbp-country-select>
                            </div>
                        </div>
                        <!-- <div class="field">
                            <label class="label">Country 2</label>
                            <div class="control">
                                <dbp-country-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    show-reload-button
                                    reload-button-title="Click me"></dbp-country-select>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Country 3 unsubscribed</label>
                            <div class="control">
                                <dbp-country-select
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    show-reload-button
                                    reload-button-title="Click me"></dbp-country-select>
                            </div>
                            <p>
                                This component doesn't get any notification about user's login and
                                will not become active.
                            </p>
                        </div>
                        <div class="field">
                            <label class="label">Country 4 disabled</label>
                            <div class="control">
                                <dbp-country-select
                                    subscribe="auth"
                                    lang="${this.lang}"
                                    entry-point-url="${this.entryPointUrl}"
                                    disabled
                                    show-reload-button
                                    reload-button-title="Click me"></dbp-country-select>
                            </div>
                            <p>This component is disabled.</p>
                        </div>-->
                    </form>
                </div>
            </section>
        `;
    }
};
defineCustomElement('dbp-country-select-demo', CountrySelectDemo);

//#endregion
//#region test/unit.js
suite('dbp-country-select basics', () => {
    let node;
    setup(async () => {
        node = document.createElement('dbp-country-select');
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
suite('dbp-country-select-demo basics', () => {
    let node;
    setup(async () => {
        node = document.createElement('dbp-country-select-demo');
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

//#endregion
//# sourceMappingURL=unit.js.map
