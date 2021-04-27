/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ../node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// CONCATENATED MODULE: ./tools/helpers.ts
var _log = console.log.bind(null, '[Recorder]:');
var _error = console.error.bind(null, '[Recorder]:');
var _warn = console.warn.bind(null, '[Recorder]:');
function _now() {
    if (!window.performance)
        return Date.now();
    // if user change local time, performance.now() would work accurate still
    return Math.floor(performance.now());
}
function _throttle(func, wait) {
    if (wait === void 0) { wait = 100; }
    var previous = _now();
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = _now();
        var restTime = now - previous;
        if (restTime >= wait) {
            previous = now;
            return func.apply(this, args);
        }
    };
}
// weak uuid
function _newuuid() {
    return Math.random()
        .toString(16)
        .split('.')[1];
}
/**
 * Wrap and replace a given method with a high-order function
 *
 * @param source The object that contains a method to be wrapped.
 * @param name The name of method to be wrapped
 * @param replacement The function that should be used to wrap the given method
 */
function _replace(source, name, replacement) {
    var original = source[name];
    function doReplace() {
        var wrapped = replacement(original);
        wrapped.__recorder__ = true;
        wrapped.__recorder_original__ = original;
        source[name] = wrapped;
    }
    if (original) {
        // if original func existed
        if (!(name in source) || original.__recorder__)
            return;
        doReplace();
        return;
    }
    else if (original === null || original === undefined) {
        // such as window.onerror whose initial value would be null
        // so just do the replacement
        doReplace();
        return;
    }
}
/**
 * Reverse to original function
 * @param source The object that contains a method been wrapped.
 * @param name The name of method been wrapped.
 */
function _recover(source, name) {
    if (!(name in source) || !source[name].__recorder__)
        return;
    var __recorder_original__ = source[name].__recorder_original__;
    source[name] = __recorder_original__;
}
function _parseURL(href) {
    if (href === void 0) { href = location.href; }
    var match = href.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!match)
        return {};
    var query = match[6] || '';
    var fragment = match[8] || '';
    return {
        protocol: match[2],
        host: match[4],
        path: match[5],
        query: query,
        fragment: fragment,
        relative: match[5] + query + fragment
    };
}
function _seralize(obj) {
    return Object.keys(obj)
        .map(function (k) { return k + "=" + obj[k]; })
        .join('&');
}

// CONCATENATED MODULE: ./constants.ts
var RECORDER_ID = 'recorder-id';
var RECORDER_PRESET = {
    mutation: true,
    history: true,
    error: {
        jserror: true,
        unhandledrejection: true
    },
    console: {
        info: true,
        error: true,
        log: false,
        warn: true,
        debug: false
    },
    event: {
        scroll: true,
        resize: true,
        form: true
    },
    http: {
        xhr: true,
        fetch: true,
        beacon: true
    },
    mouse: {
        click: true,
        mousemove: false
    },
    maxTimeSpan: 120000 // max time span of trail
};

// CONCATENATED MODULE: ./tools/is.ts
function isFunction(sth) {
    return typeof sth === 'function';
}
function isErrorEvent(sth) {
    return Object.prototype.toString.call(sth) === '[object ErrorEvent]';
}
function isError(sth) {
    switch (Object.prototype.toString.call(sth)) {
        case '[object Error]':
            return true;
        case '[object Exception]':
            return true;
        case '[object DOMException]':
            return true;
        default:
            return sth instanceof Error;
    }
}

// CONCATENATED MODULE: ./tools/pub-sub.ts


var pub_sub_EventDrivenable = /** @class */ (function () {
    function EventDrivenable() {
        var _this = this;
        this.queues = new Map();
        this.$on = function (hook, action) {
            var queues = _this.queues;
            var existingTasks = queues.get(hook) || [];
            queues.set(hook, __spread(existingTasks, [action]));
        };
        this.$off = function (hook, thisAction) {
            var Q = _this.queues.get(hook) || [];
            if (!Q.length) {
                return;
            }
            var index = Q.indexOf(thisAction);
            if (index !== -1) {
                Q.splice(index, 1);
                _this.queues.set(hook, Q);
            }
        };
        this.$emit = function (hook) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var Q = _this.queues.get(hook) || [];
            if (!Q.length) {
                return;
            }
            try {
                Q.forEach(function (action) {
                    if (isFunction(action)) {
                        action.apply(void 0, __spread(args));
                    }
                });
            }
            catch (error) {
                console.error(error);
            }
        };
    }
    return EventDrivenable;
}());
/* harmony default export */ var pub_sub = (pub_sub_EventDrivenable);

// CONCATENATED MODULE: ./observers/console.ts




var console_ConsoleObserver = /** @class */ (function (_super) {
    __extends(ConsoleObserver, _super);
    function ConsoleObserver(options) {
        var _this = _super.call(this) || this;
        _this.consoleLevels = Object.keys(RECORDER_PRESET.console);
        _this.options = RECORDER_PRESET.console;
        if (typeof options === 'boolean' && options === false) {
            return _this;
        }
        if (typeof options === 'object') {
            _this.options = __assign(__assign({}, _this.options), options);
        }
        return _this;
    }
    ConsoleObserver.prototype.install = function () {
        var _this = this;
        var $emit = this.$emit;
        this.consoleLevels.forEach(function (level) {
            if (!_this.options[level])
                return;
            function consoleReplacement(originalConsoleFunc) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (!args.length)
                        return;
                    var record = {
                        type: 'console',
                        level: level,
                        input: args
                    };
                    $emit('observed', record);
                    if (originalConsoleFunc) {
                        originalConsoleFunc.call.apply(originalConsoleFunc, __spread([console], args));
                    }
                };
            }
            _replace(console, level, consoleReplacement);
        });
        _log('console observer ready!');
    };
    ConsoleObserver.prototype.uninstall = function () {
        var _this = this;
        this.consoleLevels.forEach(function (level) {
            if (!_this.options[level])
                return;
            _recover(console, level);
        });
    };
    return ConsoleObserver;
}(pub_sub));
/* harmony default export */ var observers_console = (console_ConsoleObserver);

// CONCATENATED MODULE: ./tools/SonyA7R3.ts

/**
 * SonyA7R3 is a camera with abilities list below:
 * @feature take snapshot for page
 * @feature buffer every node in document up in Map<node, id> format
 * @feature mark / unmark node with unique ID
 */
var SonyA7R3_SonyA7R3Camera = /** @class */ (function () {
    function SonyA7R3Camera() {
        var _this = this;
        this.map = new Map();
        this.inited = false;
        this.id = 0; // self-increase id
        this.buffer = function (ele) {
            var recorderId = _this.map.get(ele) || _this.newId();
            _this.map.set(ele, recorderId);
            _this.mark(ele, recorderId);
            return recorderId;
        };
        // if document have new node, use this method because that node may have childElement
        this.bufferNewElement = function (ele) {
            _this.buffer(ele);
            if (ele.childElementCount) {
                // element.children retun childElements without textNodes
                Array.prototype.slice.call(ele.children).forEach(function (chEle) { return _this.bufferNewElement(chEle); });
            }
        };
        // get recorderId from map by element
        this.getRecordIdByElement = function (ele) {
            return _this.map.get(ele);
        };
    }
    SonyA7R3Camera.prototype.takeSnapshotForPage = function () {
        var _this = this;
        console.time('[Snapshot for page]');
        // Buffer every element into the Map
        // Note that textNodes wouldn't been included !!
        Array.prototype.slice.call(document.querySelectorAll('*')).forEach(this.buffer);
        this.latestSnapshot = document.documentElement.outerHTML;
        // remove recorder-id from node
        Array.prototype.slice.call(document.querySelectorAll('*')).forEach(function (node) {
            _this.unmark(node);
        });
        console.timeEnd('[Snapshot for page]');
        return this.latestSnapshot;
    };
    SonyA7R3Camera.prototype.newId = function () {
        this.id += 1;
        return this.id;
    };
    // mark recorderId on non-textnode
    SonyA7R3Camera.prototype.mark = function (ele, id) {
        ele.setAttribute(RECORDER_ID, id);
    };
    // remove recorderId on non-textnode
    SonyA7R3Camera.prototype.unmark = function (ele, isDeep) {
        var _this = this;
        if (isDeep === void 0) { isDeep = false; }
        var removeAttribute = ele.removeAttribute;
        removeAttribute && ele.removeAttribute(RECORDER_ID);
        if (isDeep && ele.childElementCount) {
            Array.prototype.slice.call(ele.children).forEach(function (chEle) { return _this.unmark(chEle); });
        }
    };
    return SonyA7R3Camera;
}());
var SonyA7R3 = new SonyA7R3_SonyA7R3Camera();
/* harmony default export */ var tools_SonyA7R3 = (SonyA7R3);

// CONCATENATED MODULE: ./models/observers.ts
var ConsoleLevels;
(function (ConsoleLevels) {
    ConsoleLevels["info"] = "info";
    ConsoleLevels["error"] = "error";
    ConsoleLevels["log"] = "log";
    ConsoleLevels["warn"] = "warn";
    ConsoleLevels["debug"] = "debug";
})(ConsoleLevels || (ConsoleLevels = {}));
var ConsoleTypes;
(function (ConsoleTypes) {
    ConsoleTypes["console"] = "console";
})(ConsoleTypes || (ConsoleTypes = {}));
var EventTypes;
(function (EventTypes) {
    EventTypes["scroll"] = "scroll";
    EventTypes["resize"] = "resize";
    EventTypes["form"] = "form";
})(EventTypes || (EventTypes = {}));
var MouseTypes;
(function (MouseTypes) {
    MouseTypes["click"] = "click";
    MouseTypes["move"] = "move";
})(MouseTypes || (MouseTypes = {}));
var HistoryTypes;
(function (HistoryTypes) {
    HistoryTypes["history"] = "history";
})(HistoryTypes || (HistoryTypes = {}));
var HttpRockets;
(function (HttpRockets) {
    HttpRockets["beacon"] = "beacon";
    HttpRockets["fetch"] = "fetch";
    HttpRockets["xhr"] = "xhr";
})(HttpRockets || (HttpRockets = {}));
var HttpEndTypes;
(function (HttpEndTypes) {
    HttpEndTypes["fetcherror"] = "fetcherror";
    HttpEndTypes["xhrerror"] = "xhrerror";
    HttpEndTypes["xhrabort"] = "xhrabort";
    HttpEndTypes["xhrtimeout"] = "xhrtimeout";
})(HttpEndTypes || (HttpEndTypes = {}));
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes["jserr"] = "jserr";
    ErrorTypes["unhandledrejection"] = "unhandledrejection";
})(ErrorTypes || (ErrorTypes = {}));
var DOMMutationTypes;
(function (DOMMutationTypes) {
    DOMMutationTypes["attr"] = "attr";
    DOMMutationTypes["node"] = "node";
    DOMMutationTypes["text"] = "text"; // text change
})(DOMMutationTypes || (DOMMutationTypes = {}));

// CONCATENATED MODULE: ./observers/event.ts






var getRecordIdByElement = tools_SonyA7R3.getRecordIdByElement;
/**
 * Observe scroll, window resize, form field value change(input/textarea/radio etc.)
 * and produce an Record
 */
var event_EventObserver = /** @class */ (function (_super) {
    __extends(EventObserver, _super);
    function EventObserver(options) {
        var _this = _super.call(this) || this;
        _this.listeners = [];
        _this.options = RECORDER_PRESET.event;
        /**
         * @param option useCapture or AddEventListenerOptions
         */
        _this.addListener = function (_a, cb) {
            var target = _a.target, event = _a.event, callback = _a.callback, options = _a.options;
            target.addEventListener(event, callback, options);
            _this.listeners.push({
                target: target,
                event: event,
                callback: callback
            });
            try {
                cb && cb();
            }
            catch (err) {
                _warn(err);
            }
        };
        // Provide that document's direction is `rtl`(default)
        _this.getScrollPosition = function () {
            // Quirks mode on the contrary
            var isStandardsMode = document.compatMode === 'CSS1Compat';
            var x = isStandardsMode ? document.documentElement.scrollLeft : document.body.scrollLeft;
            var y = isStandardsMode ? document.documentElement.scrollTop : document.body.scrollTop;
            return { x: x, y: y };
        };
        _this.getScrollRecord = function (evt) {
            var target = (evt || { target: document }).target;
            var $emit = _this.$emit;
            var record = { type: EventTypes.scroll };
            // 1. target is docuemnt
            // 2. No event invoking
            if (target === document || !target) {
                var _a = _this.getScrollPosition(), x_1 = _a.x, y_1 = _a.y;
                record = __assign(__assign({}, record), { x: x_1, y: y_1 });
                $emit('observed', record);
                return;
            }
            var targetX = target;
            var x = targetX.scrollLeft, y = targetX.scrollTop;
            var recorderId = getRecordIdByElement(targetX);
            record = __assign(__assign({}, record), { x: x, y: y, target: recorderId });
            $emit('observed', record);
        };
        _this.getResizeRecord = function () {
            var _a = document.documentElement, w = _a.clientWidth, h = _a.clientHeight;
            var record = { type: EventTypes.resize, w: w, h: h };
            var $emit = _this.$emit;
            $emit('observed', record);
        };
        _this.getFormChangeRecord = function (evt) {
            var target = evt.target;
            if (target.contentEditable === 'true') {
                return;
            }
            var recorderId = getRecordIdByElement(target);
            var k;
            var v;
            if (!recorderId)
                return;
            var itemsWhichKeyIsChecked = ['radio', 'checked'];
            var targetX = target;
            var formType = targetX.type;
            if (itemsWhichKeyIsChecked.includes(formType)) {
                k = 'checked';
                v = targetX.checked;
            }
            else {
                k = 'value';
                v = targetX.value;
            }
            var record = {
                type: EventTypes.form,
                target: recorderId,
                k: k,
                v: v
            };
            var $emit = _this.$emit;
            $emit('observed', record);
        };
        if (typeof options === 'boolean' && options === false) {
            return _this;
        }
        if (typeof options === 'object') {
            _this.options = __assign(__assign({}, _this.options), options);
        }
        return _this;
    }
    EventObserver.prototype.install = function () {
        var addListener = this.addListener;
        var _a = this.options, scroll = _a.scroll, resize = _a.resize, form = _a.form;
        if (scroll) {
            addListener({
                target: document,
                event: 'scroll',
                callback: this.getScrollRecord,
                options: true
            });
        }
        if (resize) {
            addListener({
                target: window,
                event: 'resize',
                callback: _throttle(this.getResizeRecord)
            });
        }
        if (form) {
            addListener({
                target: document,
                event: 'change',
                callback: this.getFormChangeRecord,
                options: true
            });
            // input event fires when value of <input> <select> <textarea> element has been altered.
            addListener({
                target: document,
                event: 'input',
                callback: _throttle(this.getFormChangeRecord, 300),
                options: true
            });
        }
        _log('events observer ready!');
    };
    EventObserver.prototype.uninstall = function () {
        this.listeners.forEach(function (_a) {
            var target = _a.target, event = _a.event, callback = _a.callback;
            target.removeEventListener(event, callback);
        });
    };
    return EventObserver;
}(pub_sub));
/* harmony default export */ var observers_event = (event_EventObserver);

// CONCATENATED MODULE: ./observers/http.ts






var http_HttpObserver = /** @class */ (function (_super) {
    __extends(HttpObserver, _super);
    function HttpObserver(options) {
        var _this = _super.call(this) || this;
        _this.options = RECORDER_PRESET.http;
        _this.xhrRecordMap = new Map();
        if (typeof options === 'boolean' && options === false) {
            return _this;
        }
        if (typeof options === 'object') {
            _this.options = __assign(__assign({}, _this.options), options);
        }
        return _this;
    }
    HttpObserver.prototype.isSupportBeacon = function () {
        return !!navigator.sendBeacon;
    };
    HttpObserver.prototype.hijackBeacon = function () {
        if (!this.isSupportBeacon())
            return;
        var $emit = this.$emit;
        function beaconReplacement(originalBeacon) {
            return function (url, data) {
                // Copy from sentry javascript
                // If the browser successfully queues the request for delivery, the method returns "true" and returns "false" otherwise.
                // more: https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API/Using_the_Beacon_API
                var result = originalBeacon.call(this, url, data);
                var record = {
                    type: HttpRockets.beacon,
                    url: url
                };
                $emit('observed', record);
                return result;
            };
        }
        _replace(window.navigator, 'sendBeacon', beaconReplacement);
    };
    HttpObserver.prototype.isSupportFetch = function () {
        return window.fetch && window.fetch.toString().includes('native');
    };
    HttpObserver.prototype.hijackFetch = function () {
        if (!this.isSupportFetch())
            return;
        var $emit = this.$emit;
        function fetchReplacement(originalFetch) {
            return function (input, config) {
                var _method = 'GET';
                var _url;
                if (typeof input === 'string') {
                    _url = input;
                }
                else if (input instanceof Request) {
                    var method = input.method, url = input.url;
                    _url = url;
                    if (method)
                        _method = method;
                }
                else {
                    _url = String(input);
                }
                if (config && config.method) {
                    _method = config.method;
                }
                var record = {
                    type: HttpRockets.fetch,
                    method: _method,
                    url: _url,
                    input: __spread(arguments)
                };
                return (originalFetch
                    .call.apply(originalFetch, __spread([window], arguments)).then(function (response) {
                    try {
                        record.status = response.status;
                        record.response = response.clone().json();
                        $emit('observed', record);
                    }
                    catch (err) {
                        _warn(err);
                    }
                    return response;
                })
                    .catch(function (error) {
                    var message = error.message;
                    record.errmsg = message;
                    $emit('observed', record);
                    throw error;
                }));
            };
        }
        _replace(window, 'fetch', fetchReplacement);
    };
    HttpObserver.prototype.hijackXHR = function () {
        var $emit = this.$emit;
        var self = this;
        function XHROpenReplacement(originalOpen) {
            return function (method, url) {
                var requestId = _newuuid();
                var args = __spread(arguments);
                var record = {
                    type: HttpRockets.xhr,
                    url: url,
                    method: method,
                    headers: {}
                };
                this.__id__ = requestId;
                self.xhrRecordMap.set(requestId, record);
                return originalOpen.apply(this, args);
            };
        }
        function XHRSetRequestHeaderReplacement(originalSetter) {
            return function (key, value) {
                var requestId = this.__id__;
                var record = self.xhrRecordMap.get(requestId);
                if (record) {
                    record.headers[key] = value;
                }
                originalSetter.call(this, key, value);
            };
        }
        function XHRSendReplacement(originalSend) {
            return function (body) {
                var thisXHR = this;
                var requestId = thisXHR.__id__, __skip_record__ = thisXHR.__skip_record__;
                var thisRecord = self.xhrRecordMap.get(requestId);
                // skip recorder's own request
                if (thisRecord && !__skip_record__) {
                    thisRecord.payload = body;
                }
                function onreadystatechangeHandler() {
                    if (this.readyState === 4) {
                        if (this.__skip_record__)
                            return;
                        var record = self.xhrRecordMap.get(requestId);
                        if (record) {
                            record.status = thisXHR.status;
                            // if the responseType is neither 'text' nor ''
                            // read responseText would produce an error
                            if (thisXHR.responseType === '' || thisXHR.responseType === 'text') {
                                record.response = thisXHR.responseText || thisXHR.response;
                            }
                            else {
                                record.response = thisXHR.responseType;
                            }
                            // xhr send successfully
                            $emit('observed', record);
                        }
                    }
                }
                // TODO: hijack xhr.onerror, xhr.onabort, xhr.ontimeout
                if ('onreadystatechange' in thisXHR && isFunction(thisXHR.onreadystatechange)) {
                    // if already had a hook
                    _replace(thisXHR, 'onreadystatechange', function (originalStateChangeHook) {
                        return function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            try {
                                onreadystatechangeHandler.call(thisXHR);
                            }
                            catch (err) {
                                _warn(err);
                            }
                            originalStateChangeHook.call.apply(originalStateChangeHook, __spread([thisXHR], args));
                        };
                    });
                }
                else {
                    thisXHR.onreadystatechange = onreadystatechangeHandler;
                }
                try {
                    return originalSend.call(this, body);
                }
                catch (exception) {
                    // if an exception occured after send, count in thisXHR
                    var message = exception.message;
                    var record = self.xhrRecordMap.get(requestId);
                    if (record) {
                        record.errmsg = message;
                        // xhr send error
                        $emit('observed', record);
                    }
                }
            };
        }
        var XHRProto = XMLHttpRequest.prototype;
        _replace(XHRProto, 'setRequestHeader', XHRSetRequestHeaderReplacement);
        _replace(XHRProto, 'open', XHROpenReplacement);
        _replace(XHRProto, 'send', XHRSendReplacement);
    };
    HttpObserver.prototype.install = function () {
        var _a = this.options, beacon = _a.beacon, fetch = _a.fetch, xhr = _a.xhr;
        if (beacon) {
            this.hijackBeacon();
        }
        if (fetch) {
            this.hijackFetch();
        }
        if (xhr) {
            this.hijackXHR();
        }
        _log('http observer ready!');
    };
    HttpObserver.prototype.uninstall = function () {
        var _a = this.options, beacon = _a.beacon, fetch = _a.fetch, xhr = _a.xhr;
        if (beacon) {
            _recover(window.navigator, 'sendBeacon');
        }
        if (fetch) {
            _recover(window, 'fetch');
        }
        if (xhr) {
            this.hijackBeacon();
        }
    };
    return HttpObserver;
}(pub_sub));
/* harmony default export */ var observers_http = (http_HttpObserver);

// CONCATENATED MODULE: ./observers/mutation.ts






var mutation_getRecordIdByElement = tools_SonyA7R3.getRecordIdByElement;
/**
 * Observe DOM change such as DOM-add/remove text-change attribute-change
 * and generate an Record
 */
var mutation_DOMMutationObserver = /** @class */ (function (_super) {
    __extends(DOMMutationObserver, _super);
    function DOMMutationObserver(options) {
        var _this = _super.call(this) || this;
        if (options === false)
            return _this;
        return _this;
    }
    DOMMutationObserver.prototype.process = function (mutationRecord) {
        try {
            var target = mutationRecord.target, attributeName = mutationRecord.attributeName;
            // ignore script tag's mutation
            if (target && target.tagName === 'SCRIPT')
                return;
            switch (mutationRecord.type) {
                case 'attributes': {
                    // ignore recorderId mutate
                    if (attributeName === RECORDER_ID)
                        return;
                    return this.getAttrReocrd(mutationRecord);
                }
                case 'characterData': {
                    return this.getTextRecord(mutationRecord);
                }
                case 'childList': {
                    return this.getNodesRecord(mutationRecord);
                }
                default: {
                    return;
                }
            }
        }
        catch (error) {
            _warn(error);
        }
    };
    // when node's attribute change
    DOMMutationObserver.prototype.getAttrReocrd = function (_a) {
        var attributeName = _a.attributeName, target = _a.target;
        var record = { attr: {} };
        record.target = mutation_getRecordIdByElement(target);
        if (record.target === undefined)
            return;
        record.type = DOMMutationTypes.attr;
        record.attr.k = attributeName;
        record.attr.v = target.getAttribute(attributeName);
        return record;
    };
    // when textNode's innerText change
    DOMMutationObserver.prototype.getTextRecord = function (_a) {
        var target = _a.target;
        var record = {};
        record.type = DOMMutationTypes.text;
        record.target = mutation_getRecordIdByElement(target);
        /**
         * 比如文本修改是在一个 contenteditable 的 `元素A` 内发生，
         * 并且 `元素A` 内有 textNode 和 element 同时存在，
         * 当只修改某个 textNode 时，MutationObserver 给的 target 会指向这个 textNode，
         * 所以 record.target 在上面代码中 getRecordIdByElement 时会取到 undefined (因为 document bufferer 字典内只缓存 element)，
         * 这时我们将 record.target 指向 `元素A` ，
         * record.html 取 `元素A` 的 innerHTML。
         * --------------------------------------------------------------------------------------------------
         * When the mutation happen with contenteditable `elementA` which contains textNodes and element inside,
         * NOTE that MutationObserver will point the `target` to the textNode we modified,
         * therefore, we should get undefined of `getRecordIdByElement(target)` (since document bufferer didn't buffer textNode).
         * So we manually set record.target = `elementA`,
         * and record.html = elementA.innerHTML at the same time
         */
        if (!record.target) {
            var parentEle = mutation_getRecordIdByElement(target.parentElement);
            /**
             * 如果这时候取不到 parentEle 或者 target.parentElement 为 null，则视该条记录作废
             * 这种情况会在删除整个 textNode 时发生，可以忽略，
             * 因为这个动作会额外的生成一个类型为 childList 的 MutationRecord
             * 交给 this.getNodesRecord 处理就好
             * ----------------------------------------------------------------
             * if (parentEle === null), means the textNode has been removed,
             * this mutation would produce a MutationRecord with type === 'childList',
             * just leave it to this.getNodesRecord to handle :)
             */
            if (!parentEle) {
                return;
            }
            record.target = parentEle;
            record.html = target.parentElement.innerHTML;
        }
        else {
            // use textContent instend of innerText(non-standard),
            // see also https://stackoverflow.com/questions/35213147/difference-between-textcontent-vs-innertext
            record.text = target.textContent;
        }
        return record;
    };
    /**
     * @Either:
     * if node been added or removed,
     * @Or:
     * if a contenteditable textNode's text been all removed, type should be `childList`(remove #text),
     * later if you type/add some text in this empty textNode, the first mutation's type would be `childList`(add #text), fellows by `characterData`s
     */
    DOMMutationObserver.prototype.getNodesRecord = function (_a) {
        var _this = this;
        var target = _a.target, addedNodes = _a.addedNodes, removedNodes = _a.removedNodes, previousSibling = _a.previousSibling, nextSibling = _a.nextSibling;
        var record = { add: [], remove: [] };
        record.target = mutation_getRecordIdByElement(target);
        if (previousSibling) {
            record.prev = mutation_getRecordIdByElement(previousSibling);
        }
        if (nextSibling) {
            record.next = mutation_getRecordIdByElement(nextSibling);
        }
        /** ------------------------------ Add or Remove nodes --------------------------------- */
        var isAdd = addedNodes.length;
        var isRemove = removedNodes.length;
        if (!isAdd && !isRemove)
            return;
        // add and remove node could happen in the same record
        record.type = DOMMutationTypes.node;
        // Add element or textNode
        this.nodesFilter(addedNodes).forEach(function (node) {
            var nodeData = {};
            switch (node.nodeName) {
                case '#text': {
                    nodeData.type = 'text';
                    // add textNode
                    // nodeValue: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
                    nodeData.html = node.nodeValue;
                    if (target.childNodes.length) {
                        nodeData.index = _this.getNodeIndex(node.parentElement, node);
                    }
                    break;
                }
                default: {
                    nodeData.type = 'ele';
                    var parentElement = node.parentElement, nodeValue = node.nodeValue;
                    if (!parentElement) {
                        // in case the node was the <html> element
                        nodeData.html = nodeValue || node.outerHTML;
                        break;
                    }
                    nodeData.index = _this.getNodeIndex(parentElement, node);
                    tools_SonyA7R3.bufferNewElement(node);
                    nodeData.html = node.outerHTML;
                    tools_SonyA7R3.unmark(node, true);
                }
            }
            if (nodeData.html === null)
                return;
            record.add.push(nodeData);
        });
        // Remove element or textNode
        this.nodesFilter(removedNodes).forEach(function (node) {
            var nodeData = {};
            switch (node.nodeName) {
                case '#text': {
                    nodeData.type = 'text';
                    var parentElement = node.parentElement;
                    // 当删除一个 textNode 或 所有文本内容时
                    // when delete the whole textNode
                    if (parentElement) {
                        nodeData.html = node.textContent;
                        nodeData.index = Array.prototype.slice.call(parentElement.childNodes).indexOf(node);
                    }
                    else {
                        // 在没有 parentElement 的情况下我们无法获取到这个 textNode 节点的 index
                        // 这时我们只能记录下它的 textContent 然后通过前后元素来辅助定位，这个步骤在播放器里进行
                        // on this occasion, we have no parentElement help us find
                        // the index of node which was been removed,
                        // we could only record the textContent and use previousSibling and nextSibling
                        // for locating this node's index!   eg.[...prev, ->node<-, next...]
                        nodeData.textContent = node.textContent;
                    }
                    break;
                }
                default: {
                    nodeData.type = 'ele';
                    nodeData.target = mutation_getRecordIdByElement(node);
                    if (nodeData.target === undefined)
                        return;
                }
            }
            record.remove.push(nodeData);
        });
        // filter record which's addNodes and removeNode only contain SCRIPT or COMMENT
        if (!record.remove.length && !record.add.length)
            return;
        if (record.target === undefined)
            return;
        if (!record.remove.length) {
            delete record.remove;
        }
        if (!record.add.length) {
            delete record.add;
        }
        return record;
    };
    // filter out comment and script
    DOMMutationObserver.prototype.nodesFilter = function (nodeList) {
        return Array.prototype.slice.call(nodeList).filter(function (node) {
            var _a = node, nodeName = _a.nodeName, tagName = _a.tagName;
            return nodeName !== '#comment' && tagName !== 'SCRIPT';
        });
    };
    // get index of the node, attention that .childNodes return textNodes also
    DOMMutationObserver.prototype.getNodeIndex = function (parentElement, node) {
        return Array.prototype.slice.call(parentElement.childNodes).indexOf(node);
    };
    DOMMutationObserver.prototype.install = function () {
        var _this = this;
        var mutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        this.observer = new mutationObserver(function (records) {
            var e_1, _a;
            var $emit = _this.$emit;
            try {
                for (var records_1 = __values(records), records_1_1 = records_1.next(); !records_1_1.done; records_1_1 = records_1.next()) {
                    var record = records_1_1.value;
                    var DOMMutationRecord = _this.process(record);
                    if (DOMMutationRecord) {
                        $emit('observed', DOMMutationRecord);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (records_1_1 && !records_1_1.done && (_a = records_1.return)) _a.call(records_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
        this.observer.observe(document.documentElement, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });
        _log('mutation observer ready!');
    };
    DOMMutationObserver.prototype.uninstall = function () {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    };
    return DOMMutationObserver;
}(pub_sub));
/* harmony default export */ var observers_mutation = (mutation_DOMMutationObserver);

// CONCATENATED MODULE: ./observers/error.ts





var error_ErrorObserver = /** @class */ (function (_super) {
    __extends(ErrorObserver, _super);
    function ErrorObserver(options) {
        var _this = _super.call(this) || this;
        _this.options = RECORDER_PRESET.error;
        _this.getGlobalerrorReocrd = function (errevt) {
            var msg = errevt.message, lineno = errevt.lineno, colno = errevt.colno, err = errevt.error, url = errevt.filename;
            var record = {
                type: ErrorTypes.jserr,
                url: url,
                line: lineno + ":" + colno,
                msg: msg,
                err: err,
                stack: err.stack
            };
            var $emit = _this.$emit;
            $emit('observed', record, errevt);
        };
        _this.getUnhandlerejectionRecord = function (errevt) {
            var reason = errevt.reason || '';
            var record = {
                type: ErrorTypes.unhandledrejection,
                msg: reason,
                stack: reason.stack
            };
            var $emit = _this.$emit;
            $emit('observed', record, errevt);
        };
        if (typeof options === 'boolean' && options === false) {
            return _this;
        }
        if (typeof options === 'object') {
            _this.options = __assign(__assign({}, _this.options), options);
        }
        return _this;
    }
    // TODO: generate stack of an error which is acceptable for sentry
    ErrorObserver.prototype.getStackTeace = function () {
        /* TODO */
    };
    ErrorObserver.prototype.installGlobalerrorHandler = function () {
        var getGlobalerrorReocrd = this.getGlobalerrorReocrd;
        _replace(window, 'onerror', function (oldOnerrorHandler) {
            var recorderOnerrorHandler = function (message, filename, lineno, colno, error) {
                /**
                 * "For historical reasons, different arguments are passed to window.onerror and element.onerror handlers"
                 *  more: - https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror
                 *       - https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#Syntax
                 */
                if (error && error instanceof ErrorEvent) {
                    getGlobalerrorReocrd(error);
                }
                else if (message instanceof ErrorEvent) {
                    getGlobalerrorReocrd(message);
                }
                else {
                    getGlobalerrorReocrd({
                        message: message,
                        filename: filename,
                        lineno: lineno,
                        colno: colno,
                        error: error
                    });
                }
                if (oldOnerrorHandler) {
                    // TODO: find approximate "this" scope for oldOnerrorHandler - not window
                    oldOnerrorHandler.apply(window, arguments);
                }
            };
            return recorderOnerrorHandler;
        });
    };
    ErrorObserver.prototype.installUnhanldledrejectionHandler = function () {
        var getUnhandlerejectionRecord = this.getUnhandlerejectionRecord;
        _replace(window, 'onunhandledrejection', function (originalUnhanldledrejectionHandler) {
            // more: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
            return function (errevt) {
                getUnhandlerejectionRecord(errevt);
                if (originalUnhanldledrejectionHandler) {
                    originalUnhanldledrejectionHandler.call(this, errevt);
                }
            };
        });
    };
    ErrorObserver.prototype.install = function () {
        var _a = this.options, jserror = _a.jserror, unhandledrejection = _a.unhandledrejection;
        if (jserror) {
            this.installGlobalerrorHandler();
            // TODO: protect recorder's onerror hook by defineProperty
            Object.defineProperty(window, 'onerror', {
                set: function (newHook) {
                    if (!newHook.__recorder__) {
                        _log('recorder error handler died!');
                    }
                }
            });
        }
        if (unhandledrejection) {
            this.installUnhanldledrejectionHandler();
        }
        _log('error observer ready!');
    };
    ErrorObserver.prototype.uninstall = function () {
        var _a = this.options, jserror = _a.jserror, unhandledrejection = _a.unhandledrejection;
        if (jserror) {
            _recover(window, 'onerror');
        }
        if (unhandledrejection) {
            _recover(window, 'onunhandledrejection');
        }
    };
    return ErrorObserver;
}(pub_sub));
/* harmony default export */ var observers_error = (error_ErrorObserver);

// CONCATENATED MODULE: ./observers/history.ts




var history_HistoryObserver = /** @class */ (function (_super) {
    __extends(HistoryObserver, _super);
    function HistoryObserver(options) {
        var _this = _super.call(this) || this;
        _this.status = false;
        if (options === false)
            return _this;
        return _this;
    }
    HistoryObserver.prototype.getHistoryRecord = function (from, to) {
        var parsedHref = _parseURL(location.href);
        var parsedTo = _parseURL(to);
        var parsedFrom = _parseURL(from);
        // Initial pushState doesn't provide `from` information
        if (!parsedFrom.path) {
            parsedFrom = parsedHref;
        }
        this.lastHref = to;
        var record = {
            type: HistoryTypes.history,
            from: parsedFrom.relative,
            to: parsedTo.relative
        };
        var $emit = this.$emit;
        $emit('observed', record);
    };
    HistoryObserver.prototype.isSupportHistory = function () {
        return 'history' in window && !!window.history.pushState && !!window.history.replaceState;
    };
    HistoryObserver.prototype.install = function () {
        if (!this.isSupportHistory())
            return;
        var getHistoryRecord = this.getHistoryRecord;
        var self = this;
        _replace(window, 'onpopstate', function (originalHandler) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                getHistoryRecord.call(self, self.lastHref, location.href);
                originalHandler && originalHandler.apply(this, args);
            };
        });
        function historyReplacement(originalMethod) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var url = args.length > 2 ? args[2] : undefined;
                if (url)
                    getHistoryRecord.call(self, self.lastHref, String(url));
                return originalMethod.apply(this, args);
            };
        }
        _replace(window.history, 'pushState', historyReplacement);
        _replace(window.history, 'replaceState', historyReplacement);
        _log('history installed');
        this.status = true;
    };
    HistoryObserver.prototype.uninstall = function () {
        _recover(window, 'onpopstate');
        _recover(window.history, 'pushState');
        _recover(window.history, 'replaceState');
        this.status = false;
    };
    return HistoryObserver;
}(pub_sub));
/* harmony default export */ var observers_history = (history_HistoryObserver);

// CONCATENATED MODULE: ./observers/mouse.ts





/**
 * Observe mouse behavior
 * and produce an Record
 */
var mouse_MouseObserver = /** @class */ (function (_super) {
    __extends(MouseObserver, _super);
    function MouseObserver(options) {
        var _this = _super.call(this) || this;
        _this.listeners = [];
        _this.options = RECORDER_PRESET.mouse;
        _this.addListener = function (_a, cb) {
            var target = _a.target, event = _a.event, callback = _a.callback, _b = _a.options, options = _b === void 0 ? false : _b;
            target.addEventListener(event, callback, options);
            _this.listeners.push({
                target: target,
                event: event,
                callback: callback
            });
            try {
                cb && cb();
            }
            catch (err) {
                _warn(err);
            }
        };
        _this.getMouseClickRecord = function (evt) {
            var x = evt.pageX, y = evt.pageY;
            var record = { type: MouseTypes.click, x: x, y: y };
            var $emit = _this.$emit;
            $emit('observed', record);
        };
        _this.getMouseMoveRecord = function (evt) {
            var x = evt.pageX, y = evt.pageY;
            var record = { type: MouseTypes.move, x: x, y: y };
            var $emit = _this.$emit;
            $emit('observed', record);
        };
        if (typeof options === 'boolean' && options === false) {
            return _this;
        }
        if (typeof options === 'object') {
            _this.options = __assign(__assign({}, _this.options), options);
        }
        return _this;
    }
    MouseObserver.prototype.install = function () {
        var addListener = this.addListener;
        var _a = this.options, click = _a.click, mousemove = _a.mousemove;
        if (click) {
            addListener({
                target: document,
                event: 'click',
                callback: this.getMouseClickRecord
            });
        }
        if (mousemove) {
            addListener({
                target: document,
                event: 'mousemove',
                callback: _throttle(this.getMouseMoveRecord, 50)
            });
        }
        _log('mouse observer ready!');
    };
    MouseObserver.prototype.uninstall = function () {
        this.listeners.forEach(function (_a) {
            var target = _a.target, event = _a.event, callback = _a.callback;
            target.removeEventListener(event, callback);
        });
    };
    return MouseObserver;
}(pub_sub));
/* harmony default export */ var observers_mouse = (mouse_MouseObserver);

// CONCATENATED MODULE: ./index.ts











var index_SessionRecorder = /** @class */ (function () {
    function SessionRecorder(options) {
        var _this = this;
        this.observers = {
            mutation: null,
            console: null,
            event: null,
            mouse: null,
            error: null,
            history: null,
            http: null
        };
        this.options = RECORDER_PRESET;
        this.trail = [];
        this.recording = false;
        this.baseTime = 0;
        this.lastSnapshot = {
            time: 0,
            index: 0
        };
        this.observeScroll = function (ele) {
            if (ele) {
                ele.addEventListener('scroll', _throttle(_this.observers.event.getScrollRecord));
            }
            else {
                _warn("Element doesn't existsed!");
            }
        };
        this.pushToTrail = function (record) {
            if (!_this.recording)
                return;
            var thisRecordTime = _now() - _this.baseTime;
            record = __assign({ t: thisRecordTime }, record);
            var _a = _this.lastSnapshot, lastSnapshotTime = _a.time, lastSnapshotIndex = _a.index;
            if (thisRecordTime - lastSnapshotTime >= _this.options.maxTimeSpan / 2) {
                if (lastSnapshotIndex !== 0) {
                    _this.trail = _this.trail.slice(lastSnapshotIndex);
                }
                var snapshotRecord = _this.getSnapshotRecord();
                _this.trail.push(snapshotRecord);
            }
            _this.trail.push(record);
        };
        this.start = function () {
            if (_this.recording) {
                _warn('record already started');
                return;
            }
            _this.recording = true;
            _this.baseTime = _now();
            // note the getSnapshotRecord method depend on baseTime
            _this.trail[0] = _this.getSnapshotRecord();
            Object.keys(_this.observers).forEach(function (observerName) {
                if (_this.options[observerName]) {
                    ;
                    _this.observers[observerName].install();
                }
            });
            window.SessionRecorder = _this;
        };
        this.stop = function () {
            if (!_this.recording) {
                _warn('record not started');
                return;
            }
            _this.recording = false;
            // clear trail
            _this.trail.length = 0;
        };
        this.uninstallObservers = function () {
            // walk and uninstall observers
            Object.keys(_this.observers).forEach(function (observerName) {
                ;
                _this.observers[observerName].uninstall();
            });
        };
        if (options && typeof options === 'object') {
            this.options = __assign(__assign({}, this.options), options);
        }
        var _a = this.options, mutation = _a.mutation, history = _a.history, http = _a.http, event = _a.event, error = _a.error, consoleOptions = _a.console, mouse = _a.mouse;
        this.observers = {
            mutation: new observers_mutation(mutation),
            http: new observers_http(http),
            console: new observers_console(consoleOptions),
            event: new observers_event(event),
            mouse: new observers_mouse(mouse),
            error: new observers_error(error),
            history: new observers_history(history)
        };
        Object.keys(this.observers).forEach(function (observerName) {
            var observer = _this.observers[observerName];
            observer.$on('observed', _this.pushToTrail.bind(_this));
        });
        this.start();
        setTimeout(function () {
            console.log(JSON.stringify(_this.trail));
        }, 5000);
    }
    SessionRecorder.prototype.getSnapshotRecord = function () {
        this.lastSnapshot.time = _now() - (this.baseTime || _now());
        this.lastSnapshot.index = this.trail.length;
        var _a = document.documentElement, w = _a.clientWidth, h = _a.clientHeight;
        var _b = this.observers.event.getScrollPosition(), x = _b.x, y = _b.y;
        return {
            t: this.lastSnapshot.time,
            type: 'snapshot',
            scroll: { x: x, y: y },
            resize: {
                w: w,
                h: h
            },
            snapshot: tools_SonyA7R3.takeSnapshotForPage()
        };
    };
    return SessionRecorder;
}());
/* harmony default export */ var index = __webpack_exports__["default"] = (index_SessionRecorder);
new index_SessionRecorder();


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map