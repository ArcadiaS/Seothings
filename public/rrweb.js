(function () {
    'use strict';

    (function() {
        const env = {"process.env":"{\"APP_URL\":\"http://seothings.test\",\"WS_HOST\":\"seothings.test\",\"WS_PORT\":\"6001\",\"PUSHER_APP_KEY\":\"1234567\"}"};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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

    var Viewport = (function () {
        function Viewport() {
            if (typeof window !== "undefined" &&
                window.sessionStorage.getItem("page_id") !== null) {
                this.id = window.sessionStorage.getItem("page_id");
            }
            var id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
                return (c ^
                    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
            });
            window.sessionStorage.setItem("page_id", id);
            this.id = id;
        }
        Viewport.prototype.getId = function () {
            return this.id;
        };
        return Viewport;
    }());

    function Page() {
        var id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
            return (c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
        });
        return id;
    }

    var NodeType;
    (function (NodeType) {
        NodeType[NodeType["Document"] = 0] = "Document";
        NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
        NodeType[NodeType["Element"] = 2] = "Element";
        NodeType[NodeType["Text"] = 3] = "Text";
        NodeType[NodeType["CDATA"] = 4] = "CDATA";
        NodeType[NodeType["Comment"] = 5] = "Comment";
    })(NodeType || (NodeType = {}));

    var _id = 1;
    var tagNameRegex = RegExp('[^a-z1-6-_]');
    var IGNORED_NODE = -2;
    function genId() {
        return _id++;
    }
    function getValidTagName(element) {
        if (element instanceof HTMLFormElement) {
            return 'form';
        }
        var processedTagName = element.tagName.toLowerCase().trim();
        if (tagNameRegex.test(processedTagName)) {
            return 'div';
        }
        return processedTagName;
    }
    function getCssRulesString(s) {
        try {
            var rules = s.rules || s.cssRules;
            return rules ? Array.from(rules).map(getCssRuleString).join('') : null;
        }
        catch (error) {
            return null;
        }
    }
    function getCssRuleString(rule) {
        return isCSSImportRule(rule)
            ? getCssRulesString(rule.styleSheet) || ''
            : rule.cssText;
    }
    function isCSSImportRule(rule) {
        return 'styleSheet' in rule;
    }
    function extractOrigin(url) {
        var origin;
        if (url.indexOf('//') > -1) {
            origin = url.split('/').slice(0, 3).join('/');
        }
        else {
            origin = url.split('/')[0];
        }
        origin = origin.split('?')[0];
        return origin;
    }
    var URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")([^"]*)"|([^)]*))\)/gm;
    var RELATIVE_PATH = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/).*/;
    var DATA_URI = /^(data:)([^,]*),(.*)/i;
    function absoluteToStylesheet(cssText, href) {
        return (cssText || '').replace(URL_IN_CSS_REF, function (origin, quote1, path1, quote2, path2, path3) {
            var e_1, _a;
            var filePath = path1 || path2 || path3;
            var maybeQuote = quote1 || quote2 || '';
            if (!filePath) {
                return origin;
            }
            if (!RELATIVE_PATH.test(filePath)) {
                return "url(" + maybeQuote + filePath + maybeQuote + ")";
            }
            if (DATA_URI.test(filePath)) {
                return "url(" + maybeQuote + filePath + maybeQuote + ")";
            }
            if (filePath[0] === '/') {
                return "url(" + maybeQuote + (extractOrigin(href) + filePath) + maybeQuote + ")";
            }
            var stack = href.split('/');
            var parts = filePath.split('/');
            stack.pop();
            try {
                for (var parts_1 = __values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
                    var part = parts_1_1.value;
                    if (part === '.') {
                        continue;
                    }
                    else if (part === '..') {
                        stack.pop();
                    }
                    else {
                        stack.push(part);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (parts_1_1 && !parts_1_1.done && (_a = parts_1.return)) _a.call(parts_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return "url(" + maybeQuote + stack.join('/') + maybeQuote + ")";
        });
    }
    function getAbsoluteSrcsetString(doc, attributeValue) {
        if (attributeValue.trim() === '') {
            return attributeValue;
        }
        var srcsetValues = attributeValue.split(',');
        var resultingSrcsetString = srcsetValues
            .map(function (srcItem) {
            var trimmedSrcItem = srcItem.trimLeft().trimRight();
            var urlAndSize = trimmedSrcItem.split(' ');
            if (urlAndSize.length === 2) {
                var absUrl = absoluteToDoc(doc, urlAndSize[0]);
                return absUrl + " " + urlAndSize[1];
            }
            else if (urlAndSize.length === 1) {
                var absUrl = absoluteToDoc(doc, urlAndSize[0]);
                return "" + absUrl;
            }
            return '';
        })
            .join(', ');
        return resultingSrcsetString;
    }
    function absoluteToDoc(doc, attributeValue) {
        if (!attributeValue || attributeValue.trim() === '') {
            return attributeValue;
        }
        var a = doc.createElement('a');
        a.href = attributeValue;
        return a.href;
    }
    function isSVGElement(el) {
        return el.tagName === 'svg' || el instanceof SVGElement;
    }
    function transformAttribute(doc, name, value) {
        if (name === 'src' || (name === 'href' && value)) {
            return absoluteToDoc(doc, value);
        }
        else if (name === 'srcset' && value) {
            return getAbsoluteSrcsetString(doc, value);
        }
        else if (name === 'style' && value) {
            return absoluteToStylesheet(value, location.href);
        }
        else {
            return value;
        }
    }
    function _isBlockedElement(element, blockClass, blockSelector) {
        if (typeof blockClass === 'string') {
            if (element.classList.contains(blockClass)) {
                return true;
            }
        }
        else {
            element.classList.forEach(function (className) {
                if (blockClass.test(className)) {
                    return true;
                }
            });
        }
        if (blockSelector) {
            return element.matches(blockSelector);
        }
        return false;
    }
    function serializeNode(n, options) {
        var e_2, _a;
        var doc = options.doc, blockClass = options.blockClass, blockSelector = options.blockSelector, inlineStylesheet = options.inlineStylesheet, _b = options.maskInputOptions, maskInputOptions = _b === void 0 ? {} : _b, recordCanvas = options.recordCanvas;
        switch (n.nodeType) {
            case n.DOCUMENT_NODE:
                return {
                    type: NodeType.Document,
                    childNodes: [],
                };
            case n.DOCUMENT_TYPE_NODE:
                return {
                    type: NodeType.DocumentType,
                    name: n.name,
                    publicId: n.publicId,
                    systemId: n.systemId,
                };
            case n.ELEMENT_NODE:
                var needBlock = _isBlockedElement(n, blockClass, blockSelector);
                var tagName = getValidTagName(n);
                var attributes = {};
                try {
                    for (var _c = __values(Array.from(n.attributes)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var _e = _d.value, name_1 = _e.name, value = _e.value;
                        attributes[name_1] = transformAttribute(doc, name_1, value);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (tagName === 'link' && inlineStylesheet) {
                    var stylesheet = Array.from(doc.styleSheets).find(function (s) {
                        return s.href === n.href;
                    });
                    var cssText = getCssRulesString(stylesheet);
                    if (cssText) {
                        delete attributes.rel;
                        delete attributes.href;
                        attributes._cssText = absoluteToStylesheet(cssText, stylesheet.href);
                    }
                }
                if (tagName === 'style' &&
                    n.sheet &&
                    !(n.innerText ||
                        n.textContent ||
                        '').trim().length) {
                    var cssText = getCssRulesString(n.sheet);
                    if (cssText) {
                        attributes._cssText = absoluteToStylesheet(cssText, location.href);
                    }
                }
                if (tagName === 'input' ||
                    tagName === 'textarea' ||
                    tagName === 'select') {
                    var value = n.value;
                    if (attributes.type !== 'radio' &&
                        attributes.type !== 'checkbox' &&
                        attributes.type !== 'submit' &&
                        attributes.type !== 'button' &&
                        value) {
                        attributes.value =
                            maskInputOptions[attributes.type] ||
                                maskInputOptions[tagName]
                                ? '*'.repeat(value.length)
                                : value;
                    }
                    else if (n.checked) {
                        attributes.checked = n.checked;
                    }
                }
                if (tagName === 'option') {
                    var selectValue = n.parentElement;
                    if (attributes.value === selectValue.value) {
                        attributes.selected = n.selected;
                    }
                }
                if (tagName === 'canvas' && recordCanvas) {
                    attributes.rr_dataURL = n.toDataURL();
                }
                if (tagName === 'audio' || tagName === 'video') {
                    attributes.rr_mediaState = n.paused
                        ? 'paused'
                        : 'played';
                }
                if (n.scrollLeft) {
                    attributes.rr_scrollLeft = n.scrollLeft;
                }
                if (n.scrollTop) {
                    attributes.rr_scrollTop = n.scrollTop;
                }
                if (needBlock) {
                    var _f = n.getBoundingClientRect(), width = _f.width, height = _f.height;
                    attributes = {
                        class: attributes.class,
                        rr_width: width + "px",
                        rr_height: height + "px",
                    };
                }
                return {
                    type: NodeType.Element,
                    tagName: tagName,
                    attributes: attributes,
                    childNodes: [],
                    isSVG: isSVGElement(n) || undefined,
                    needBlock: needBlock,
                };
            case n.TEXT_NODE:
                var parentTagName = n.parentNode && n.parentNode.tagName;
                var textContent = n.textContent;
                var isStyle = parentTagName === 'STYLE' ? true : undefined;
                if (isStyle && textContent) {
                    textContent = absoluteToStylesheet(textContent, location.href);
                }
                if (parentTagName === 'SCRIPT') {
                    textContent = 'SCRIPT_PLACEHOLDER';
                }
                return {
                    type: NodeType.Text,
                    textContent: textContent || '',
                    isStyle: isStyle,
                };
            case n.CDATA_SECTION_NODE:
                return {
                    type: NodeType.CDATA,
                    textContent: '',
                };
            case n.COMMENT_NODE:
                return {
                    type: NodeType.Comment,
                    textContent: n.textContent || '',
                };
            default:
                return false;
        }
    }
    function lowerIfExists(maybeAttr) {
        if (maybeAttr === undefined) {
            return '';
        }
        else {
            return maybeAttr.toLowerCase();
        }
    }
    function slimDOMExcluded(sn, slimDOMOptions) {
        if (slimDOMOptions.comment && sn.type === NodeType.Comment) {
            return true;
        }
        else if (sn.type === NodeType.Element) {
            if (slimDOMOptions.script &&
                (sn.tagName === 'script' ||
                    (sn.tagName === 'link' &&
                        sn.attributes.rel === 'preload' &&
                        sn.attributes.as === 'script'))) {
                return true;
            }
            else if (slimDOMOptions.headFavicon &&
                ((sn.tagName === 'link' && sn.attributes.rel === 'shortcut icon') ||
                    (sn.tagName === 'meta' &&
                        (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) ||
                            lowerIfExists(sn.attributes.name) === 'application-name' ||
                            lowerIfExists(sn.attributes.rel) === 'icon' ||
                            lowerIfExists(sn.attributes.rel) === 'apple-touch-icon' ||
                            lowerIfExists(sn.attributes.rel) === 'shortcut icon')))) {
                return true;
            }
            else if (sn.tagName === 'meta') {
                if (slimDOMOptions.headMetaDescKeywords &&
                    lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) {
                    return true;
                }
                else if (slimDOMOptions.headMetaSocial &&
                    (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) ||
                        lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) ||
                        lowerIfExists(sn.attributes.name) === 'pinterest')) {
                    return true;
                }
                else if (slimDOMOptions.headMetaRobots &&
                    (lowerIfExists(sn.attributes.name) === 'robots' ||
                        lowerIfExists(sn.attributes.name) === 'googlebot' ||
                        lowerIfExists(sn.attributes.name) === 'bingbot')) {
                    return true;
                }
                else if (slimDOMOptions.headMetaHttpEquiv &&
                    sn.attributes['http-equiv'] !== undefined) {
                    return true;
                }
                else if (slimDOMOptions.headMetaAuthorship &&
                    (lowerIfExists(sn.attributes.name) === 'author' ||
                        lowerIfExists(sn.attributes.name) === 'generator' ||
                        lowerIfExists(sn.attributes.name) === 'framework' ||
                        lowerIfExists(sn.attributes.name) === 'publisher' ||
                        lowerIfExists(sn.attributes.name) === 'progid' ||
                        lowerIfExists(sn.attributes.property).match(/^article:/) ||
                        lowerIfExists(sn.attributes.property).match(/^product:/))) {
                    return true;
                }
                else if (slimDOMOptions.headMetaVerification &&
                    (lowerIfExists(sn.attributes.name) === 'google-site-verification' ||
                        lowerIfExists(sn.attributes.name) === 'yandex-verification' ||
                        lowerIfExists(sn.attributes.name) === 'csrf-token' ||
                        lowerIfExists(sn.attributes.name) === 'p:domain_verify' ||
                        lowerIfExists(sn.attributes.name) === 'verify-v1' ||
                        lowerIfExists(sn.attributes.name) === 'verification' ||
                        lowerIfExists(sn.attributes.name) === 'shopify-checkout-api-token')) {
                    return true;
                }
            }
        }
        return false;
    }
    function serializeNodeWithId(n, options) {
        var e_3, _a;
        var doc = options.doc, map = options.map, blockClass = options.blockClass, blockSelector = options.blockSelector, _b = options.skipChild, skipChild = _b === void 0 ? false : _b, _c = options.inlineStylesheet, inlineStylesheet = _c === void 0 ? true : _c, _d = options.maskInputOptions, maskInputOptions = _d === void 0 ? {} : _d, slimDOMOptions = options.slimDOMOptions, _e = options.recordCanvas, recordCanvas = _e === void 0 ? false : _e;
        var _f = options.preserveWhiteSpace, preserveWhiteSpace = _f === void 0 ? true : _f;
        var _serializedNode = serializeNode(n, {
            doc: doc,
            blockClass: blockClass,
            blockSelector: blockSelector,
            inlineStylesheet: inlineStylesheet,
            maskInputOptions: maskInputOptions,
            recordCanvas: recordCanvas,
        });
        if (!_serializedNode) {
            console.warn(n, 'not serialized');
            return null;
        }
        var id;
        if ('__sn' in n) {
            id = n.__sn.id;
        }
        else if (slimDOMExcluded(_serializedNode, slimDOMOptions) ||
            (!preserveWhiteSpace &&
                _serializedNode.type === NodeType.Text &&
                !_serializedNode.isStyle &&
                !_serializedNode.textContent.replace(/^\s+|\s+$/gm, '').length)) {
            id = IGNORED_NODE;
        }
        else {
            id = genId();
        }
        var serializedNode = Object.assign(_serializedNode, { id: id });
        n.__sn = serializedNode;
        if (id === IGNORED_NODE) {
            return null;
        }
        map[id] = n;
        var recordChild = !skipChild;
        if (serializedNode.type === NodeType.Element) {
            recordChild = recordChild && !serializedNode.needBlock;
            delete serializedNode.needBlock;
        }
        if ((serializedNode.type === NodeType.Document ||
            serializedNode.type === NodeType.Element) &&
            recordChild) {
            if (slimDOMOptions.headWhitespace &&
                _serializedNode.type === NodeType.Element &&
                _serializedNode.tagName === 'head') {
                preserveWhiteSpace = false;
            }
            try {
                for (var _g = __values(Array.from(n.childNodes)), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var childN = _h.value;
                    var serializedChildNode = serializeNodeWithId(childN, {
                        doc: doc,
                        map: map,
                        blockClass: blockClass,
                        blockSelector: blockSelector,
                        skipChild: skipChild,
                        inlineStylesheet: inlineStylesheet,
                        maskInputOptions: maskInputOptions,
                        slimDOMOptions: slimDOMOptions,
                        recordCanvas: recordCanvas,
                        preserveWhiteSpace: preserveWhiteSpace,
                    });
                    if (serializedChildNode) {
                        serializedNode.childNodes.push(serializedChildNode);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_a = _g.return)) _a.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return serializedNode;
    }
    function snapshot(n, options) {
        var _a = options || {}, _b = _a.blockClass, blockClass = _b === void 0 ? 'rr-block' : _b, _c = _a.inlineStylesheet, inlineStylesheet = _c === void 0 ? true : _c, _d = _a.recordCanvas, recordCanvas = _d === void 0 ? false : _d, _e = _a.blockSelector, blockSelector = _e === void 0 ? null : _e, _f = _a.maskAllInputs, maskAllInputs = _f === void 0 ? false : _f, _g = _a.slimDOM, slimDOM = _g === void 0 ? false : _g;
        var idNodeMap = {};
        var maskInputOptions = maskAllInputs === true
            ? {
                color: true,
                date: true,
                'datetime-local': true,
                email: true,
                month: true,
                number: true,
                range: true,
                search: true,
                tel: true,
                text: true,
                time: true,
                url: true,
                week: true,
                textarea: true,
                select: true,
            }
            : maskAllInputs === false
                ? {}
                : maskAllInputs;
        var slimDOMOptions = slimDOM === true || slimDOM === 'all'
            ?
                {
                    script: true,
                    comment: true,
                    headFavicon: true,
                    headWhitespace: true,
                    headMetaDescKeywords: slimDOM === 'all',
                    headMetaSocial: true,
                    headMetaRobots: true,
                    headMetaHttpEquiv: true,
                    headMetaAuthorship: true,
                    headMetaVerification: true,
                }
            : slimDOM === false
                ? {}
                : slimDOM;
        return [
            serializeNodeWithId(n, {
                doc: n,
                map: idNodeMap,
                blockClass: blockClass,
                blockSelector: blockSelector,
                skipChild: false,
                inlineStylesheet: inlineStylesheet,
                maskInputOptions: maskInputOptions,
                slimDOMOptions: slimDOMOptions,
                recordCanvas: recordCanvas,
            }),
            idNodeMap,
        ];
    }

    var EventType;
    (function (EventType) {
        EventType[EventType["DomContentLoaded"] = 0] = "DomContentLoaded";
        EventType[EventType["Load"] = 1] = "Load";
        EventType[EventType["FullSnapshot"] = 2] = "FullSnapshot";
        EventType[EventType["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
        EventType[EventType["Meta"] = 4] = "Meta";
        EventType[EventType["Custom"] = 5] = "Custom";
    })(EventType || (EventType = {}));
    var IncrementalSource;
    (function (IncrementalSource) {
        IncrementalSource[IncrementalSource["Mutation"] = 0] = "Mutation";
        IncrementalSource[IncrementalSource["MouseMove"] = 1] = "MouseMove";
        IncrementalSource[IncrementalSource["MouseInteraction"] = 2] = "MouseInteraction";
        IncrementalSource[IncrementalSource["Scroll"] = 3] = "Scroll";
        IncrementalSource[IncrementalSource["ViewportResize"] = 4] = "ViewportResize";
        IncrementalSource[IncrementalSource["Input"] = 5] = "Input";
        IncrementalSource[IncrementalSource["TouchMove"] = 6] = "TouchMove";
        IncrementalSource[IncrementalSource["MediaInteraction"] = 7] = "MediaInteraction";
        IncrementalSource[IncrementalSource["StyleSheetRule"] = 8] = "StyleSheetRule";
        IncrementalSource[IncrementalSource["CanvasMutation"] = 9] = "CanvasMutation";
        IncrementalSource[IncrementalSource["Font"] = 10] = "Font";
        IncrementalSource[IncrementalSource["Log"] = 11] = "Log";
    })(IncrementalSource || (IncrementalSource = {}));
    var MouseInteractions;
    (function (MouseInteractions) {
        MouseInteractions[MouseInteractions["MouseUp"] = 0] = "MouseUp";
        MouseInteractions[MouseInteractions["MouseDown"] = 1] = "MouseDown";
        MouseInteractions[MouseInteractions["Click"] = 2] = "Click";
        MouseInteractions[MouseInteractions["ContextMenu"] = 3] = "ContextMenu";
        MouseInteractions[MouseInteractions["DblClick"] = 4] = "DblClick";
        MouseInteractions[MouseInteractions["Focus"] = 5] = "Focus";
        MouseInteractions[MouseInteractions["Blur"] = 6] = "Blur";
        MouseInteractions[MouseInteractions["TouchStart"] = 7] = "TouchStart";
        MouseInteractions[MouseInteractions["TouchMove_Departed"] = 8] = "TouchMove_Departed";
        MouseInteractions[MouseInteractions["TouchEnd"] = 9] = "TouchEnd";
    })(MouseInteractions || (MouseInteractions = {}));
    var MediaInteractions;
    (function (MediaInteractions) {
        MediaInteractions[MediaInteractions["Play"] = 0] = "Play";
        MediaInteractions[MediaInteractions["Pause"] = 1] = "Pause";
    })(MediaInteractions || (MediaInteractions = {}));
    var ReplayerEvents;
    (function (ReplayerEvents) {
        ReplayerEvents["Start"] = "start";
        ReplayerEvents["Pause"] = "pause";
        ReplayerEvents["Resume"] = "resume";
        ReplayerEvents["Resize"] = "resize";
        ReplayerEvents["Finish"] = "finish";
        ReplayerEvents["FullsnapshotRebuilded"] = "fullsnapshot-rebuilded";
        ReplayerEvents["LoadStylesheetStart"] = "load-stylesheet-start";
        ReplayerEvents["LoadStylesheetEnd"] = "load-stylesheet-end";
        ReplayerEvents["SkipStart"] = "skip-start";
        ReplayerEvents["SkipEnd"] = "skip-end";
        ReplayerEvents["MouseInteraction"] = "mouse-interaction";
        ReplayerEvents["EventCast"] = "event-cast";
        ReplayerEvents["CustomEvent"] = "custom-event";
        ReplayerEvents["Flush"] = "flush";
        ReplayerEvents["StateChange"] = "state-change";
    })(ReplayerEvents || (ReplayerEvents = {}));

    function on(type, fn, target) {
        if (target === void 0) { target = document; }
        var options = { capture: true, passive: true };
        target.addEventListener(type, fn, options);
        return function () { return target.removeEventListener(type, fn, options); };
    }
    var mirror = {
        map: {},
        getId: function (n) {
            if (!n.__sn) {
                return -1;
            }
            return n.__sn.id;
        },
        getNode: function (id) {
            return mirror.map[id] || null;
        },
        removeNodeFromMap: function (n) {
            var id = n.__sn && n.__sn.id;
            delete mirror.map[id];
            if (n.childNodes) {
                n.childNodes.forEach(function (child) {
                    return mirror.removeNodeFromMap(child);
                });
            }
        },
        has: function (id) {
            return mirror.map.hasOwnProperty(id);
        },
    };
    function throttle(func, wait, options) {
        if (options === void 0) { options = {}; }
        var timeout = null;
        var previous = 0;
        return function (arg) {
            var now = Date.now();
            if (!previous && options.leading === false) {
                previous = now;
            }
            var remaining = wait - (now - previous);
            var context = this;
            var args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    window.clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                func.apply(context, args);
            }
            else if (!timeout && options.trailing !== false) {
                timeout = window.setTimeout(function () {
                    previous = options.leading === false ? 0 : Date.now();
                    timeout = null;
                    func.apply(context, args);
                }, remaining);
            }
        };
    }
    function hookSetter(target, key, d, isRevoked, win) {
        if (win === void 0) { win = window; }
        var original = win.Object.getOwnPropertyDescriptor(target, key);
        win.Object.defineProperty(target, key, isRevoked
            ? d
            : {
                set: function (value) {
                    var _this = this;
                    setTimeout(function () {
                        d.set.call(_this, value);
                    }, 0);
                    if (original && original.set) {
                        original.set.call(this, value);
                    }
                },
            });
        return function () { return hookSetter(target, key, original || {}, true); };
    }
    function patch(source, name, replacement) {
        try {
            if (!(name in source)) {
                return function () { };
            }
            var original_1 = source[name];
            var wrapped = replacement(original_1);
            if (typeof wrapped === 'function') {
                wrapped.prototype = wrapped.prototype || {};
                Object.defineProperties(wrapped, {
                    __rrweb_original__: {
                        enumerable: false,
                        value: original_1,
                    },
                });
            }
            source[name] = wrapped;
            return function () {
                source[name] = original_1;
            };
        }
        catch (_a) {
            return function () { };
        }
    }
    function getWindowHeight() {
        return (window.innerHeight ||
            (document.documentElement && document.documentElement.clientHeight) ||
            (document.body && document.body.clientHeight));
    }
    function getWindowWidth() {
        return (window.innerWidth ||
            (document.documentElement && document.documentElement.clientWidth) ||
            (document.body && document.body.clientWidth));
    }
    function isBlocked(node, blockClass) {
        if (!node) {
            return false;
        }
        if (node.nodeType === node.ELEMENT_NODE) {
            var needBlock_1 = false;
            if (typeof blockClass === 'string') {
                needBlock_1 = node.classList.contains(blockClass);
            }
            else {
                node.classList.forEach(function (className) {
                    if (blockClass.test(className)) {
                        needBlock_1 = true;
                    }
                });
            }
            return needBlock_1 || isBlocked(node.parentNode, blockClass);
        }
        if (node.nodeType === node.TEXT_NODE) {
            return isBlocked(node.parentNode, blockClass);
        }
        return isBlocked(node.parentNode, blockClass);
    }
    function isIgnored(n) {
        if ('__sn' in n) {
            return n.__sn.id === IGNORED_NODE;
        }
        return false;
    }
    function isAncestorRemoved(target) {
        var id = mirror.getId(target);
        if (!mirror.has(id)) {
            return true;
        }
        if (target.parentNode &&
            target.parentNode.nodeType === target.DOCUMENT_NODE) {
            return false;
        }
        if (!target.parentNode) {
            return true;
        }
        return isAncestorRemoved(target.parentNode);
    }
    function isTouchEvent(event) {
        return Boolean(event.changedTouches);
    }
    function polyfill(win) {
        if (win === void 0) { win = window; }
        if ('NodeList' in win && !win.NodeList.prototype.forEach) {
            win.NodeList.prototype.forEach = Array.prototype
                .forEach;
        }
        if ('DOMTokenList' in win && !win.DOMTokenList.prototype.forEach) {
            win.DOMTokenList.prototype.forEach = Array.prototype
                .forEach;
        }
    }

    function isNodeInLinkedList(n) {
        return '__ln' in n;
    }
    var DoubleLinkedList = (function () {
        function DoubleLinkedList() {
            this.length = 0;
            this.head = null;
        }
        DoubleLinkedList.prototype.get = function (position) {
            if (position >= this.length) {
                throw new Error('Position outside of list range');
            }
            var current = this.head;
            for (var index = 0; index < position; index++) {
                current = (current === null || current === void 0 ? void 0 : current.next) || null;
            }
            return current;
        };
        DoubleLinkedList.prototype.addNode = function (n) {
            var node = {
                value: n,
                previous: null,
                next: null,
            };
            n.__ln = node;
            if (n.previousSibling && isNodeInLinkedList(n.previousSibling)) {
                var current = n.previousSibling.__ln.next;
                node.next = current;
                node.previous = n.previousSibling.__ln;
                n.previousSibling.__ln.next = node;
                if (current) {
                    current.previous = node;
                }
            }
            else if (n.nextSibling && isNodeInLinkedList(n.nextSibling)) {
                var current = n.nextSibling.__ln.previous;
                node.previous = current;
                node.next = n.nextSibling.__ln;
                n.nextSibling.__ln.previous = node;
                if (current) {
                    current.next = node;
                }
            }
            else {
                if (this.head) {
                    this.head.previous = node;
                }
                node.next = this.head;
                this.head = node;
            }
            this.length++;
        };
        DoubleLinkedList.prototype.removeNode = function (n) {
            var current = n.__ln;
            if (!this.head) {
                return;
            }
            if (!current.previous) {
                this.head = current.next;
                if (this.head) {
                    this.head.previous = null;
                }
            }
            else {
                current.previous.next = current.next;
                if (current.next) {
                    current.next.previous = current.previous;
                }
            }
            if (n.__ln) {
                delete n.__ln;
            }
            this.length--;
        };
        return DoubleLinkedList;
    }());
    var moveKey = function (id, parentId) { return id + "@" + parentId; };
    function isINode(n) {
        return '__sn' in n;
    }
    var MutationBuffer = (function () {
        function MutationBuffer() {
            var _this = this;
            this.frozen = false;
            this.texts = [];
            this.attributes = [];
            this.removes = [];
            this.mapRemoves = [];
            this.movedMap = {};
            this.addedSet = new Set();
            this.movedSet = new Set();
            this.droppedSet = new Set();
            this.processMutations = function (mutations) {
                mutations.forEach(_this.processMutation);
                if (!_this.frozen) {
                    _this.emit();
                }
            };
            this.emit = function () {
                var e_1, _a, e_2, _b;
                var adds = [];
                var addList = new DoubleLinkedList();
                var getNextId = function (n) {
                    var ns = n;
                    var nextId = IGNORED_NODE;
                    while (nextId === IGNORED_NODE) {
                        ns = ns && ns.nextSibling;
                        nextId = ns && mirror.getId(ns);
                    }
                    if (nextId === -1 && isBlocked(n.nextSibling, _this.blockClass)) {
                        nextId = null;
                    }
                    return nextId;
                };
                var pushAdd = function (n) {
                    if (!n.parentNode) {
                        return;
                    }
                    var parentId = mirror.getId(n.parentNode);
                    var nextId = getNextId(n);
                    if (parentId === -1 || nextId === -1) {
                        return addList.addNode(n);
                    }
                    var sn = serializeNodeWithId(n, {
                        doc: document,
                        map: mirror.map,
                        blockClass: _this.blockClass,
                        blockSelector: _this.blockSelector,
                        skipChild: true,
                        inlineStylesheet: _this.inlineStylesheet,
                        maskInputOptions: _this.maskInputOptions,
                        slimDOMOptions: _this.slimDOMOptions,
                        recordCanvas: _this.recordCanvas,
                    });
                    if (sn) {
                        adds.push({
                            parentId: parentId,
                            nextId: nextId,
                            node: sn,
                        });
                    }
                };
                while (_this.mapRemoves.length) {
                    mirror.removeNodeFromMap(_this.mapRemoves.shift());
                }
                try {
                    for (var _c = __values(_this.movedSet), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var n = _d.value;
                        if (isParentRemoved(_this.removes, n) &&
                            !_this.movedSet.has(n.parentNode)) {
                            continue;
                        }
                        pushAdd(n);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                try {
                    for (var _e = __values(_this.addedSet), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var n = _f.value;
                        if (!isAncestorInSet(_this.droppedSet, n) &&
                            !isParentRemoved(_this.removes, n)) {
                            pushAdd(n);
                        }
                        else if (isAncestorInSet(_this.movedSet, n)) {
                            pushAdd(n);
                        }
                        else {
                            _this.droppedSet.add(n);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                var candidate = null;
                while (addList.length) {
                    var node = null;
                    if (candidate) {
                        var parentId = mirror.getId(candidate.value.parentNode);
                        var nextId = getNextId(candidate.value);
                        if (parentId !== -1 && nextId !== -1) {
                            node = candidate;
                        }
                    }
                    if (!node) {
                        for (var index = addList.length - 1; index >= 0; index--) {
                            var _node = addList.get(index);
                            var parentId = mirror.getId(_node.value.parentNode);
                            var nextId = getNextId(_node.value);
                            if (parentId !== -1 && nextId !== -1) {
                                node = _node;
                                break;
                            }
                        }
                    }
                    if (!node) {
                        break;
                    }
                    candidate = node.previous;
                    addList.removeNode(node.value);
                    pushAdd(node.value);
                }
                var payload = {
                    texts: _this.texts
                        .map(function (text) { return ({
                        id: mirror.getId(text.node),
                        value: text.value,
                    }); })
                        .filter(function (text) { return mirror.has(text.id); }),
                    attributes: _this.attributes
                        .map(function (attribute) { return ({
                        id: mirror.getId(attribute.node),
                        attributes: attribute.attributes,
                    }); })
                        .filter(function (attribute) { return mirror.has(attribute.id); }),
                    removes: _this.removes,
                    adds: adds,
                };
                if (!payload.texts.length &&
                    !payload.attributes.length &&
                    !payload.removes.length &&
                    !payload.adds.length) {
                    return;
                }
                _this.texts = [];
                _this.attributes = [];
                _this.removes = [];
                _this.addedSet = new Set();
                _this.movedSet = new Set();
                _this.droppedSet = new Set();
                _this.movedMap = {};
                _this.emissionCallback(payload);
            };
            this.processMutation = function (m) {
                if (isIgnored(m.target)) {
                    return;
                }
                switch (m.type) {
                    case 'characterData': {
                        var value = m.target.textContent;
                        if (!isBlocked(m.target, _this.blockClass) && value !== m.oldValue) {
                            _this.texts.push({
                                value: value,
                                node: m.target,
                            });
                        }
                        break;
                    }
                    case 'attributes': {
                        var value = m.target.getAttribute(m.attributeName);
                        if (isBlocked(m.target, _this.blockClass) || value === m.oldValue) {
                            return;
                        }
                        var item = _this.attributes.find(function (a) { return a.node === m.target; });
                        if (!item) {
                            item = {
                                node: m.target,
                                attributes: {},
                            };
                            _this.attributes.push(item);
                        }
                        item.attributes[m.attributeName] = transformAttribute(document, m.attributeName, value);
                        break;
                    }
                    case 'childList': {
                        m.addedNodes.forEach(function (n) { return _this.genAdds(n, m.target); });
                        m.removedNodes.forEach(function (n) {
                            var nodeId = mirror.getId(n);
                            var parentId = mirror.getId(m.target);
                            if (isBlocked(n, _this.blockClass) ||
                                isBlocked(m.target, _this.blockClass) ||
                                isIgnored(n)) {
                                return;
                            }
                            if (_this.addedSet.has(n)) {
                                deepDelete(_this.addedSet, n);
                                _this.droppedSet.add(n);
                            }
                            else if (_this.addedSet.has(m.target) && nodeId === -1) ;
                            else if (isAncestorRemoved(m.target)) ;
                            else if (_this.movedSet.has(n) &&
                                _this.movedMap[moveKey(nodeId, parentId)]) {
                                deepDelete(_this.movedSet, n);
                            }
                            else {
                                _this.removes.push({
                                    parentId: parentId,
                                    id: nodeId,
                                });
                            }
                            _this.mapRemoves.push(n);
                        });
                        break;
                    }
                }
            };
            this.genAdds = function (n, target) {
                if (isBlocked(n, _this.blockClass)) {
                    return;
                }
                if (isINode(n)) {
                    if (isIgnored(n)) {
                        return;
                    }
                    _this.movedSet.add(n);
                    var targetId = null;
                    if (target && isINode(target)) {
                        targetId = target.__sn.id;
                    }
                    if (targetId) {
                        _this.movedMap[moveKey(n.__sn.id, targetId)] = true;
                    }
                }
                else {
                    _this.addedSet.add(n);
                    _this.droppedSet.delete(n);
                }
                n.childNodes.forEach(function (childN) { return _this.genAdds(childN); });
            };
        }
        MutationBuffer.prototype.init = function (cb, blockClass, blockSelector, inlineStylesheet, maskInputOptions, recordCanvas, slimDOMOptions) {
            this.blockClass = blockClass;
            this.blockSelector = blockSelector;
            this.inlineStylesheet = inlineStylesheet;
            this.maskInputOptions = maskInputOptions;
            this.recordCanvas = recordCanvas;
            this.slimDOMOptions = slimDOMOptions;
            this.emissionCallback = cb;
        };
        MutationBuffer.prototype.freeze = function () {
            this.frozen = true;
        };
        MutationBuffer.prototype.unfreeze = function () {
            this.frozen = false;
        };
        MutationBuffer.prototype.isFrozen = function () {
            return this.frozen;
        };
        return MutationBuffer;
    }());
    function deepDelete(addsSet, n) {
        addsSet.delete(n);
        n.childNodes.forEach(function (childN) { return deepDelete(addsSet, childN); });
    }
    function isParentRemoved(removes, n) {
        var parentNode = n.parentNode;
        if (!parentNode) {
            return false;
        }
        var parentId = mirror.getId(parentNode);
        if (removes.some(function (r) { return r.id === parentId; })) {
            return true;
        }
        return isParentRemoved(removes, parentNode);
    }
    function isAncestorInSet(set, n) {
        var parentNode = n.parentNode;
        if (!parentNode) {
            return false;
        }
        if (set.has(parentNode)) {
            return true;
        }
        return isAncestorInSet(set, parentNode);
    }

    function pathToSelector(node) {
        if (!node || !node.outerHTML) {
            return '';
        }
        var path = '';
        while (node.parentElement) {
            var name = node.localName;
            if (!name)
                break;
            name = name.toLowerCase();
            var parent = node.parentElement;
            var domSiblings = [];
            if (parent.children && parent.children.length > 0) {
                for (var i = 0; i < parent.children.length; i++) {
                    var sibling = parent.children[i];
                    if (sibling.localName && sibling.localName.toLowerCase) {
                        if (sibling.localName.toLowerCase() === name) {
                            domSiblings.push(sibling);
                        }
                    }
                }
            }
            if (domSiblings.length > 1) {
                name += ':eq(' + domSiblings.indexOf(node) + ')';
            }
            path = name + (path ? '>' + path : '');
            node = parent;
        }
        return path;
    }
    function stringify(obj, stringifyOptions) {
        var options = {
            numOfKeysLimit: 50,
        };
        Object.assign(options, stringifyOptions);
        var stack = [], keys = [];
        return JSON.stringify(obj, function (key, value) {
            if (stack.length > 0) {
                var thisPos = stack.indexOf(this);
                ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
                ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
                if (~stack.indexOf(value)) {
                    if (stack[0] === value)
                        value = '[Circular ~]';
                    else
                        value =
                            '[Circular ~.' +
                                keys.slice(0, stack.indexOf(value)).join('.') +
                                ']';
                }
            }
            else
                stack.push(value);
            if (value === null || value === undefined)
                return value;
            if (shouldToString(value)) {
                return toString(value);
            }
            if (value instanceof Event) {
                var eventResult = {};
                for (var key_1 in value) {
                    var eventValue = value[key_1];
                    if (Array.isArray(eventValue))
                        eventResult[key_1] = pathToSelector(eventValue.length ? eventValue[0] : null);
                    else
                        eventResult[key_1] = eventValue;
                }
                return eventResult;
            }
            else if (value instanceof Node) {
                if (value instanceof HTMLElement)
                    return value ? value.outerHTML : '';
                return value.nodeName;
            }
            return value;
        });
        function shouldToString(obj) {
            if (typeof obj === 'object' &&
                Object.keys(obj).length > options.numOfKeysLimit)
                return true;
            if (typeof obj === 'function')
                return true;
            return false;
        }
        function toString(obj) {
            var str = obj.toString();
            if (options.stringLengthLimit && str.length > options.stringLengthLimit) {
                str = str.slice(0, options.stringLengthLimit) + "...";
            }
            return str;
        }
    }

    var mutationBuffer = new MutationBuffer();
    function initMutationObserver(cb, blockClass, blockSelector, inlineStylesheet, maskInputOptions, recordCanvas, slimDOMOptions) {
        mutationBuffer.init(cb, blockClass, blockSelector, inlineStylesheet, maskInputOptions, recordCanvas, slimDOMOptions);
        var observer = new MutationObserver(mutationBuffer.processMutations.bind(mutationBuffer));
        observer.observe(document, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true,
        });
        return observer;
    }
    function initMoveObserver(cb, sampling) {
        if (sampling.mousemove === false) {
            return function () { };
        }
        var threshold = typeof sampling.mousemove === 'number' ? sampling.mousemove : 50;
        var positions = [];
        var timeBaseline;
        var wrappedCb = throttle(function (isTouch) {
            var totalOffset = Date.now() - timeBaseline;
            cb(positions.map(function (p) {
                p.timeOffset -= totalOffset;
                return p;
            }), isTouch ? IncrementalSource.TouchMove : IncrementalSource.MouseMove);
            positions = [];
            timeBaseline = null;
        }, 500);
        var updatePosition = throttle(function (evt) {
            var target = evt.target;
            var _a = isTouchEvent(evt)
                ? evt.changedTouches[0]
                : evt, clientX = _a.clientX, clientY = _a.clientY;
            if (!timeBaseline) {
                timeBaseline = Date.now();
            }
            positions.push({
                x: clientX,
                y: clientY,
                id: mirror.getId(target),
                timeOffset: Date.now() - timeBaseline,
            });
            wrappedCb(isTouchEvent(evt));
        }, threshold, {
            trailing: false,
        });
        var handlers = [
            on('mousemove', updatePosition),
            on('touchmove', updatePosition),
        ];
        return function () {
            handlers.forEach(function (h) { return h(); });
        };
    }
    function initMouseInteractionObserver(cb, blockClass, sampling) {
        if (sampling.mouseInteraction === false) {
            return function () { };
        }
        var disableMap = sampling.mouseInteraction === true ||
            sampling.mouseInteraction === undefined
            ? {}
            : sampling.mouseInteraction;
        var handlers = [];
        var getHandler = function (eventKey) {
            return function (event) {
                if (isBlocked(event.target, blockClass)) {
                    return;
                }
                var id = mirror.getId(event.target);
                var _a = isTouchEvent(event)
                    ? event.changedTouches[0]
                    : event, clientX = _a.clientX, clientY = _a.clientY;
                cb({
                    type: MouseInteractions[eventKey],
                    id: id,
                    x: clientX,
                    y: clientY,
                });
            };
        };
        Object.keys(MouseInteractions)
            .filter(function (key) {
            return Number.isNaN(Number(key)) &&
                !key.endsWith('_Departed') &&
                disableMap[key] !== false;
        })
            .forEach(function (eventKey) {
            var eventName = eventKey.toLowerCase();
            var handler = getHandler(eventKey);
            handlers.push(on(eventName, handler));
        });
        return function () {
            handlers.forEach(function (h) { return h(); });
        };
    }
    function initScrollObserver(cb, blockClass, sampling) {
        var updatePosition = throttle(function (evt) {
            if (!evt.target || isBlocked(evt.target, blockClass)) {
                return;
            }
            var id = mirror.getId(evt.target);
            if (evt.target === document) {
                var scrollEl = (document.scrollingElement || document.documentElement);
                cb({
                    id: id,
                    x: scrollEl.scrollLeft,
                    y: scrollEl.scrollTop,
                });
            }
            else {
                cb({
                    id: id,
                    x: evt.target.scrollLeft,
                    y: evt.target.scrollTop,
                });
            }
        }, sampling.scroll || 100);
        return on('scroll', updatePosition);
    }
    function initViewportResizeObserver(cb) {
        var last_h = -1;
        var last_w = -1;
        var updateDimension = throttle(function () {
            var height = getWindowHeight();
            var width = getWindowWidth();
            if (last_h !== height || last_w != width) {
                cb({
                    width: Number(width),
                    height: Number(height),
                });
                last_h = height;
                last_w = width;
            }
        }, 200);
        return on('resize', updateDimension, window);
    }
    var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];
    var lastInputValueMap = new WeakMap();
    function initInputObserver(cb, blockClass, ignoreClass, maskInputOptions, maskInputFn, sampling) {
        function eventHandler(event) {
            var target = event.target;
            if (!target ||
                !target.tagName ||
                INPUT_TAGS.indexOf(target.tagName) < 0 ||
                isBlocked(target, blockClass)) {
                return;
            }
            var type = target.type;
            if (type === 'password' ||
                target.classList.contains(ignoreClass)) {
                return;
            }
            var text = target.value;
            var isChecked = false;
            if (type === 'radio' || type === 'checkbox') {
                isChecked = target.checked;
            }
            else if (maskInputOptions[target.tagName.toLowerCase()] ||
                maskInputOptions[type]) {
                if (maskInputFn) {
                    text = maskInputFn(text);
                }
                else {
                    text = '*'.repeat(text.length);
                }
            }
            cbWithDedup(target, { text: text, isChecked: isChecked });
            var name = target.name;
            if (type === 'radio' && name && isChecked) {
                document
                    .querySelectorAll("input[type=\"radio\"][name=\"" + name + "\"]")
                    .forEach(function (el) {
                    if (el !== target) {
                        cbWithDedup(el, {
                            text: el.value,
                            isChecked: !isChecked,
                        });
                    }
                });
            }
        }
        function cbWithDedup(target, v) {
            var lastInputValue = lastInputValueMap.get(target);
            if (!lastInputValue ||
                lastInputValue.text !== v.text ||
                lastInputValue.isChecked !== v.isChecked) {
                lastInputValueMap.set(target, v);
                var id = mirror.getId(target);
                cb(__assign(__assign({}, v), { id: id }));
            }
        }
        var events = sampling.input === 'last' ? ['change'] : ['input', 'change'];
        var handlers = events.map(function (eventName) { return on(eventName, eventHandler); });
        var propertyDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        var hookProperties = [
            [HTMLInputElement.prototype, 'value'],
            [HTMLInputElement.prototype, 'checked'],
            [HTMLSelectElement.prototype, 'value'],
            [HTMLTextAreaElement.prototype, 'value'],
            [HTMLSelectElement.prototype, 'selectedIndex'],
        ];
        if (propertyDescriptor && propertyDescriptor.set) {
            handlers.push.apply(handlers, __spread(hookProperties.map(function (p) {
                return hookSetter(p[0], p[1], {
                    set: function () {
                        eventHandler({ target: this });
                    },
                });
            })));
        }
        return function () {
            handlers.forEach(function (h) { return h(); });
        };
    }
    function initStyleSheetObserver(cb) {
        var insertRule = CSSStyleSheet.prototype.insertRule;
        CSSStyleSheet.prototype.insertRule = function (rule, index) {
            var id = mirror.getId(this.ownerNode);
            if (id !== -1) {
                cb({
                    id: id,
                    adds: [{ rule: rule, index: index }],
                });
            }
            return insertRule.apply(this, arguments);
        };
        var deleteRule = CSSStyleSheet.prototype.deleteRule;
        CSSStyleSheet.prototype.deleteRule = function (index) {
            var id = mirror.getId(this.ownerNode);
            if (id !== -1) {
                cb({
                    id: id,
                    removes: [{ index: index }],
                });
            }
            return deleteRule.apply(this, arguments);
        };
        return function () {
            CSSStyleSheet.prototype.insertRule = insertRule;
            CSSStyleSheet.prototype.deleteRule = deleteRule;
        };
    }
    function initMediaInteractionObserver(mediaInteractionCb, blockClass) {
        var handler = function (type) { return function (event) {
            var target = event.target;
            if (!target || isBlocked(target, blockClass)) {
                return;
            }
            mediaInteractionCb({
                type: type === 'play' ? 0 : 1,
                id: mirror.getId(target),
            });
        }; };
        var handlers = [on('play', handler('play')), on('pause', handler('pause'))];
        return function () {
            handlers.forEach(function (h) { return h(); });
        };
    }
    function initCanvasMutationObserver(cb, blockClass) {
        var e_1, _a;
        var props = Object.getOwnPropertyNames(CanvasRenderingContext2D.prototype);
        var handlers = [];
        var _loop_1 = function (prop) {
            try {
                if (typeof CanvasRenderingContext2D.prototype[prop] !== 'function') {
                    return "continue";
                }
                var restoreHandler = patch(CanvasRenderingContext2D.prototype, prop, function (original) {
                    return function () {
                        var _this = this;
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        if (!isBlocked(this.canvas, blockClass)) {
                            setTimeout(function () {
                                var recordArgs = __spread(args);
                                if (prop === 'drawImage') {
                                    if (recordArgs[0] &&
                                        recordArgs[0] instanceof HTMLCanvasElement) {
                                        recordArgs[0] = recordArgs[0].toDataURL();
                                    }
                                }
                                cb({
                                    id: mirror.getId(_this.canvas),
                                    property: prop,
                                    args: recordArgs,
                                });
                            }, 0);
                        }
                        return original.apply(this, args);
                    };
                });
                handlers.push(restoreHandler);
            }
            catch (_a) {
                var hookHandler = hookSetter(CanvasRenderingContext2D.prototype, prop, {
                    set: function (v) {
                        cb({
                            id: mirror.getId(this.canvas),
                            property: prop,
                            args: [v],
                            setter: true,
                        });
                    },
                });
                handlers.push(hookHandler);
            }
        };
        try {
            for (var props_1 = __values(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
                var prop = props_1_1.value;
                _loop_1(prop);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return function () {
            handlers.forEach(function (h) { return h(); });
        };
    }
    function initFontObserver(cb) {
        var handlers = [];
        var fontMap = new WeakMap();
        var originalFontFace = FontFace;
        window.FontFace = function FontFace(family, source, descriptors) {
            var fontFace = new originalFontFace(family, source, descriptors);
            fontMap.set(fontFace, {
                family: family,
                buffer: typeof source !== 'string',
                descriptors: descriptors,
                fontSource: typeof source === 'string'
                    ? source
                    :
                        JSON.stringify(Array.from(new Uint8Array(source))),
            });
            return fontFace;
        };
        var restoreHandler = patch(document.fonts, 'add', function (original) {
            return function (fontFace) {
                setTimeout(function () {
                    var p = fontMap.get(fontFace);
                    if (p) {
                        cb(p);
                        fontMap.delete(fontFace);
                    }
                }, 0);
                return original.apply(this, [fontFace]);
            };
        });
        handlers.push(function () {
            window.FonFace = originalFontFace;
        });
        handlers.push(restoreHandler);
        return function () {
            handlers.forEach(function (h) { return h(); });
        };
    }
    function initLogObserver(cb, logOptions) {
        var e_2, _a;
        var _this = this;
        var logger = logOptions.logger;
        if (!logger)
            return function () { };
        var logCount = 0;
        var cancelHandlers = [];
        if (logOptions.level.includes('error')) {
            if (window) {
                var originalOnError_1 = window.onerror;
                window.onerror = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    originalOnError_1 && originalOnError_1.apply(_this, args);
                    var stack = [];
                    if (args[args.length - 1] instanceof Error)
                        stack = parseStack(args[args.length - 1].stack, 0);
                    var payload = [stringify(args[0], logOptions.stringifyOptions)];
                    cb({
                        level: 'error',
                        trace: stack,
                        payload: payload,
                    });
                };
                cancelHandlers.push(function () {
                    window.onerror = originalOnError_1;
                });
            }
        }
        try {
            for (var _b = __values(logOptions.level), _c = _b.next(); !_c.done; _c = _b.next()) {
                var levelType = _c.value;
                cancelHandlers.push(replace(logger, levelType));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return function () {
            cancelHandlers.forEach(function (h) { return h(); });
        };
        function replace(logger, level) {
            var _this = this;
            if (!logger[level])
                return function () { };
            return patch(logger, level, function (original) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    original.apply(_this, args);
                    try {
                        var stack = parseStack(new Error().stack);
                        var payload = args.map(function (s) {
                            return stringify(s, logOptions.stringifyOptions);
                        });
                        logCount++;
                        if (logCount < logOptions.lengthThreshold)
                            cb({
                                level: level,
                                trace: stack,
                                payload: payload,
                            });
                        else if (logCount === logOptions.lengthThreshold)
                            cb({
                                level: 'warn',
                                trace: [],
                                payload: [
                                    stringify('The number of log records reached the threshold.'),
                                ],
                            });
                    }
                    catch (error) {
                        original.apply(void 0, __spread(['rrweb logger error:', error], args));
                    }
                };
            });
        }
        function parseStack(stack, omitDepth) {
            if (omitDepth === void 0) { omitDepth = 1; }
            var stacks = [];
            if (stack) {
                stacks = stack
                    .split('at')
                    .splice(1 + omitDepth)
                    .map(function (s) { return s.trim(); });
            }
            return stacks;
        }
    }
    function mergeHooks(o, hooks) {
        var mutationCb = o.mutationCb, mousemoveCb = o.mousemoveCb, mouseInteractionCb = o.mouseInteractionCb, scrollCb = o.scrollCb, viewportResizeCb = o.viewportResizeCb, inputCb = o.inputCb, mediaInteractionCb = o.mediaInteractionCb, styleSheetRuleCb = o.styleSheetRuleCb, canvasMutationCb = o.canvasMutationCb, fontCb = o.fontCb, logCb = o.logCb;
        o.mutationCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.mutation) {
                hooks.mutation.apply(hooks, __spread(p));
            }
            mutationCb.apply(void 0, __spread(p));
        };
        o.mousemoveCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.mousemove) {
                hooks.mousemove.apply(hooks, __spread(p));
            }
            mousemoveCb.apply(void 0, __spread(p));
        };
        o.mouseInteractionCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.mouseInteraction) {
                hooks.mouseInteraction.apply(hooks, __spread(p));
            }
            mouseInteractionCb.apply(void 0, __spread(p));
        };
        o.scrollCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.scroll) {
                hooks.scroll.apply(hooks, __spread(p));
            }
            scrollCb.apply(void 0, __spread(p));
        };
        o.viewportResizeCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.viewportResize) {
                hooks.viewportResize.apply(hooks, __spread(p));
            }
            viewportResizeCb.apply(void 0, __spread(p));
        };
        o.inputCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.input) {
                hooks.input.apply(hooks, __spread(p));
            }
            inputCb.apply(void 0, __spread(p));
        };
        o.mediaInteractionCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.mediaInteaction) {
                hooks.mediaInteaction.apply(hooks, __spread(p));
            }
            mediaInteractionCb.apply(void 0, __spread(p));
        };
        o.styleSheetRuleCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.styleSheetRule) {
                hooks.styleSheetRule.apply(hooks, __spread(p));
            }
            styleSheetRuleCb.apply(void 0, __spread(p));
        };
        o.canvasMutationCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.canvasMutation) {
                hooks.canvasMutation.apply(hooks, __spread(p));
            }
            canvasMutationCb.apply(void 0, __spread(p));
        };
        o.fontCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.font) {
                hooks.font.apply(hooks, __spread(p));
            }
            fontCb.apply(void 0, __spread(p));
        };
        o.logCb = function () {
            var p = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                p[_i] = arguments[_i];
            }
            if (hooks.log) {
                hooks.log.apply(hooks, __spread(p));
            }
            logCb.apply(void 0, __spread(p));
        };
    }
    function initObservers(o, hooks) {
        if (hooks === void 0) { hooks = {}; }
        mergeHooks(o, hooks);
        var mutationObserver = initMutationObserver(o.mutationCb, o.blockClass, o.blockSelector, o.inlineStylesheet, o.maskInputOptions, o.recordCanvas, o.slimDOMOptions);
        var mousemoveHandler = initMoveObserver(o.mousemoveCb, o.sampling);
        var mouseInteractionHandler = initMouseInteractionObserver(o.mouseInteractionCb, o.blockClass, o.sampling);
        var scrollHandler = initScrollObserver(o.scrollCb, o.blockClass, o.sampling);
        var viewportResizeHandler = initViewportResizeObserver(o.viewportResizeCb);
        var inputHandler = initInputObserver(o.inputCb, o.blockClass, o.ignoreClass, o.maskInputOptions, o.maskInputFn, o.sampling);
        var mediaInteractionHandler = initMediaInteractionObserver(o.mediaInteractionCb, o.blockClass);
        var styleSheetObserver = initStyleSheetObserver(o.styleSheetRuleCb);
        var canvasMutationObserver = o.recordCanvas
            ? initCanvasMutationObserver(o.canvasMutationCb, o.blockClass)
            : function () { };
        var fontObserver = o.collectFonts ? initFontObserver(o.fontCb) : function () { };
        var logObserver = o.logOptions
            ? initLogObserver(o.logCb, o.logOptions)
            : function () { };
        return function () {
            mutationObserver.disconnect();
            mousemoveHandler();
            mouseInteractionHandler();
            scrollHandler();
            viewportResizeHandler();
            inputHandler();
            mediaInteractionHandler();
            styleSheetObserver();
            canvasMutationObserver();
            fontObserver();
            logObserver();
        };
    }

    function wrapEvent(e) {
        return __assign(__assign({}, e), { timestamp: Date.now() });
    }
    var wrappedEmit;
    function record(options) {
        if (options === void 0) { options = {}; }
        var emit = options.emit, checkoutEveryNms = options.checkoutEveryNms, checkoutEveryNth = options.checkoutEveryNth, _a = options.blockClass, blockClass = _a === void 0 ? 'rr-block' : _a, _b = options.blockSelector, blockSelector = _b === void 0 ? null : _b, _c = options.ignoreClass, ignoreClass = _c === void 0 ? 'rr-ignore' : _c, _d = options.inlineStylesheet, inlineStylesheet = _d === void 0 ? true : _d, maskAllInputs = options.maskAllInputs, _maskInputOptions = options.maskInputOptions, _slimDOMOptions = options.slimDOMOptions, maskInputFn = options.maskInputFn, hooks = options.hooks, packFn = options.packFn, _e = options.sampling, sampling = _e === void 0 ? {} : _e, mousemoveWait = options.mousemoveWait, _f = options.recordCanvas, recordCanvas = _f === void 0 ? false : _f, _g = options.collectFonts, collectFonts = _g === void 0 ? false : _g, _h = options.recordLog, recordLog = _h === void 0 ? false : _h;
        if (!emit) {
            throw new Error('emit function is required');
        }
        if (mousemoveWait !== undefined && sampling.mousemove === undefined) {
            sampling.mousemove = mousemoveWait;
        }
        var maskInputOptions = maskAllInputs === true
            ? {
                color: true,
                date: true,
                'datetime-local': true,
                email: true,
                month: true,
                number: true,
                range: true,
                search: true,
                tel: true,
                text: true,
                time: true,
                url: true,
                week: true,
                textarea: true,
                select: true,
            }
            : _maskInputOptions !== undefined
                ? _maskInputOptions
                : {};
        var slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === 'all'
            ? {
                script: true,
                comment: true,
                headFavicon: true,
                headWhitespace: true,
                headMetaSocial: true,
                headMetaRobots: true,
                headMetaHttpEquiv: true,
                headMetaVerification: true,
                headMetaAuthorship: _slimDOMOptions === 'all',
                headMetaDescKeywords: _slimDOMOptions === 'all',
            }
            : _slimDOMOptions
                ? _slimDOMOptions
                : {};
        var defaultLogOptions = {
            level: [
                'assert',
                'clear',
                'count',
                'countReset',
                'debug',
                'dir',
                'dirxml',
                'error',
                'group',
                'groupCollapsed',
                'groupEnd',
                'info',
                'log',
                'table',
                'time',
                'timeEnd',
                'timeLog',
                'trace',
                'warn',
            ],
            lengthThreshold: 1000,
            logger: console,
        };
        var logOptions = recordLog
            ? recordLog === true
                ? defaultLogOptions
                : Object.assign({}, defaultLogOptions, recordLog)
            : {};
        polyfill();
        var lastFullSnapshotEvent;
        var incrementalSnapshotCount = 0;
        wrappedEmit = function (e, isCheckout) {
            if (mutationBuffer.isFrozen() &&
                e.type !== EventType.FullSnapshot &&
                !(e.type === EventType.IncrementalSnapshot &&
                    e.data.source === IncrementalSource.Mutation)) {
                mutationBuffer.emit();
                mutationBuffer.unfreeze();
            }
            emit((packFn ? packFn(e) : e), isCheckout);
            if (e.type === EventType.FullSnapshot) {
                lastFullSnapshotEvent = e;
                incrementalSnapshotCount = 0;
            }
            else if (e.type === EventType.IncrementalSnapshot) {
                incrementalSnapshotCount++;
                var exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
                var exceedTime = checkoutEveryNms &&
                    e.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
                if (exceedCount || exceedTime) {
                    takeFullSnapshot(true);
                }
            }
        };
        function takeFullSnapshot(isCheckout) {
            var _a, _b, _c, _d;
            if (isCheckout === void 0) { isCheckout = false; }
            wrappedEmit(wrapEvent({
                type: EventType.Meta,
                data: {
                    href: window.location.href,
                    width: getWindowWidth(),
                    height: getWindowHeight(),
                },
            }), isCheckout);
            var wasFrozen = mutationBuffer.isFrozen();
            mutationBuffer.freeze();
            var _e = __read(snapshot(document, {
                blockClass: blockClass,
                blockSelector: blockSelector,
                inlineStylesheet: inlineStylesheet,
                maskAllInputs: maskInputOptions,
                slimDOM: slimDOMOptions,
                recordCanvas: recordCanvas,
            }), 2), node = _e[0], idNodeMap = _e[1];
            if (!node) {
                return console.warn('Failed to snapshot the document');
            }
            mirror.map = idNodeMap;
            wrappedEmit(wrapEvent({
                type: EventType.FullSnapshot,
                data: {
                    node: node,
                    initialOffset: {
                        left: window.pageXOffset !== undefined
                            ? window.pageXOffset
                            : (document === null || document === void 0 ? void 0 : document.documentElement.scrollLeft) || ((_b = (_a = document === null || document === void 0 ? void 0 : document.body) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.scrollLeft) || (document === null || document === void 0 ? void 0 : document.body.scrollLeft) ||
                                0,
                        top: window.pageYOffset !== undefined
                            ? window.pageYOffset
                            : (document === null || document === void 0 ? void 0 : document.documentElement.scrollTop) || ((_d = (_c = document === null || document === void 0 ? void 0 : document.body) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.scrollTop) || (document === null || document === void 0 ? void 0 : document.body.scrollTop) ||
                                0,
                    },
                },
            }));
            if (!wasFrozen) {
                mutationBuffer.emit();
                mutationBuffer.unfreeze();
            }
        }
        try {
            var handlers_1 = [];
            handlers_1.push(on('DOMContentLoaded', function () {
                wrappedEmit(wrapEvent({
                    type: EventType.DomContentLoaded,
                    data: {},
                }));
            }));
            var init_1 = function () {
                takeFullSnapshot();
                handlers_1.push(initObservers({
                    mutationCb: function (m) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.Mutation }, m),
                        }));
                    },
                    mousemoveCb: function (positions, source) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: {
                                source: source,
                                positions: positions,
                            },
                        }));
                    },
                    mouseInteractionCb: function (d) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.MouseInteraction }, d),
                        }));
                    },
                    scrollCb: function (p) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.Scroll }, p),
                        }));
                    },
                    viewportResizeCb: function (d) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.ViewportResize }, d),
                        }));
                    },
                    inputCb: function (v) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.Input }, v),
                        }));
                    },
                    mediaInteractionCb: function (p) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.MediaInteraction }, p),
                        }));
                    },
                    styleSheetRuleCb: function (r) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.StyleSheetRule }, r),
                        }));
                    },
                    canvasMutationCb: function (p) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.CanvasMutation }, p),
                        }));
                    },
                    fontCb: function (p) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.Font }, p),
                        }));
                    },
                    logCb: function (p) {
                        return wrappedEmit(wrapEvent({
                            type: EventType.IncrementalSnapshot,
                            data: __assign({ source: IncrementalSource.Log }, p),
                        }));
                    },
                    blockClass: blockClass,
                    blockSelector: blockSelector,
                    ignoreClass: ignoreClass,
                    maskInputOptions: maskInputOptions,
                    maskInputFn: maskInputFn,
                    inlineStylesheet: inlineStylesheet,
                    sampling: sampling,
                    recordCanvas: recordCanvas,
                    collectFonts: collectFonts,
                    slimDOMOptions: slimDOMOptions,
                    logOptions: logOptions,
                }, hooks));
            };
            if (document.readyState === 'interactive' ||
                document.readyState === 'complete') {
                init_1();
            }
            else {
                handlers_1.push(on('load', function () {
                    wrappedEmit(wrapEvent({
                        type: EventType.Load,
                        data: {},
                    }));
                    init_1();
                }, window));
            }
            return function () {
                handlers_1.forEach(function (h) { return h(); });
            };
        }
        catch (error) {
            console.warn(error);
        }
    }
    record.addCustomEvent = function (tag, payload) {
        if (!wrappedEmit) {
            throw new Error('please add custom event after start recording');
        }
        wrappedEmit(wrapEvent({
            type: EventType.Custom,
            data: {
                tag: tag,
                payload: payload,
            },
        }));
    };
    record.freezePage = function () {
        mutationBuffer.freeze();
    };

    var RecordService = (function () {
        function RecordService(webSocketService) {
            this.webSocketService = webSocketService;
            this.viewport = new Viewport();
            this.recorder = record;
        }
        RecordService.prototype.connect = function () {
            var _this = this;
            this.baseHref = window.location.origin;
            this.pageId = Page();
            this.webSocketService.connect(function (channel) {
                _this.channel = channel
                    .join("stream." + _this.webSocketService.getSession())
                    .here(function () {
                    console.log(_this.recorder);
                });
            });
        };
        RecordService.prototype.teardown = function () {
        };
        RecordService.prototype.whisperChanges = function (data) {
            this.channel.whisper("changes", data);
        };
        return RecordService;
    }());

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends.apply(this, arguments);
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    function _possibleConstructorReturn(self, call) {
      if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
      }

      return _assertThisInitialized(self);
    }

    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();

      return function () {
        var Super = _getPrototypeOf(Derived),
            result;

        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;

          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }

        return _possibleConstructorReturn(this, result);
      };
    }

    var Connector = /*#__PURE__*/function () {
      /**
       * Create a new class instance.
       */
      function Connector(options) {
        _classCallCheck(this, Connector);

        /**
         * Default connector options.
         */
        this._defaultOptions = {
          auth: {
            headers: {}
          },
          authEndpoint: '/broadcasting/auth',
          broadcaster: 'pusher',
          csrfToken: null,
          host: null,
          key: null,
          namespace: 'App.Events'
        };
        this.setOptions(options);
        this.connect();
      }
      /**
       * Merge the custom options with the defaults.
       */


      _createClass(Connector, [{
        key: "setOptions",
        value: function setOptions(options) {
          this.options = _extends(this._defaultOptions, options);

          if (this.csrfToken()) {
            this.options.auth.headers['X-CSRF-TOKEN'] = this.csrfToken();
          }

          return options;
        }
        /**
         * Extract the CSRF token from the page.
         */

      }, {
        key: "csrfToken",
        value: function csrfToken() {
          var selector;

          if (typeof window !== 'undefined' && window['Laravel'] && window['Laravel'].csrfToken) {
            return window['Laravel'].csrfToken;
          } else if (this.options.csrfToken) {
            return this.options.csrfToken;
          } else if (typeof document !== 'undefined' && typeof document.querySelector === 'function' && (selector = document.querySelector('meta[name="csrf-token"]'))) {
            return selector.getAttribute('content');
          }

          return null;
        }
      }]);

      return Connector;
    }();

    /**
     * This class represents a basic channel.
     */
    var Channel = /*#__PURE__*/function () {
      function Channel() {
        _classCallCheck(this, Channel);
      }

      _createClass(Channel, [{
        key: "listenForWhisper",

        /**
         * Listen for a whisper event on the channel instance.
         */
        value: function listenForWhisper(event, callback) {
          return this.listen('.client-' + event, callback);
        }
        /**
         * Listen for an event on the channel instance.
         */

      }, {
        key: "notification",
        value: function notification(callback) {
          return this.listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', callback);
        }
        /**
         * Stop listening for a whisper event on the channel instance.
         */

      }, {
        key: "stopListeningForWhisper",
        value: function stopListeningForWhisper(event, callback) {
          return this.stopListening('.client-' + event, callback);
        }
      }]);

      return Channel;
    }();

    /**
     * Event name formatter
     */
    var EventFormatter = /*#__PURE__*/function () {
      /**
       * Create a new class instance.
       */
      function EventFormatter(namespace) {
        _classCallCheck(this, EventFormatter);

        this.setNamespace(namespace);
      }
      /**
       * Format the given event name.
       */


      _createClass(EventFormatter, [{
        key: "format",
        value: function format(event) {
          if (event.charAt(0) === '.' || event.charAt(0) === '\\') {
            return event.substr(1);
          } else if (this.namespace) {
            event = this.namespace + '.' + event;
          }

          return event.replace(/\./g, '\\');
        }
        /**
         * Set the event namespace.
         */

      }, {
        key: "setNamespace",
        value: function setNamespace(value) {
          this.namespace = value;
        }
      }]);

      return EventFormatter;
    }();

    /**
     * This class represents a Pusher channel.
     */

    var PusherChannel = /*#__PURE__*/function (_Channel) {
      _inherits(PusherChannel, _Channel);

      var _super = _createSuper(PusherChannel);

      /**
       * Create a new class instance.
       */
      function PusherChannel(pusher, name, options) {
        var _this;

        _classCallCheck(this, PusherChannel);

        _this = _super.call(this);
        _this.name = name;
        _this.pusher = pusher;
        _this.options = options;
        _this.eventFormatter = new EventFormatter(_this.options.namespace);

        _this.subscribe();

        return _this;
      }
      /**
       * Subscribe to a Pusher channel.
       */


      _createClass(PusherChannel, [{
        key: "subscribe",
        value: function subscribe() {
          this.subscription = this.pusher.subscribe(this.name);
        }
        /**
         * Unsubscribe from a Pusher channel.
         */

      }, {
        key: "unsubscribe",
        value: function unsubscribe() {
          this.pusher.unsubscribe(this.name);
        }
        /**
         * Listen for an event on the channel instance.
         */

      }, {
        key: "listen",
        value: function listen(event, callback) {
          this.on(this.eventFormatter.format(event), callback);
          return this;
        }
        /**
         * Stop listening for an event on the channel instance.
         */

      }, {
        key: "stopListening",
        value: function stopListening(event, callback) {
          if (callback) {
            this.subscription.unbind(this.eventFormatter.format(event), callback);
          } else {
            this.subscription.unbind(this.eventFormatter.format(event));
          }

          return this;
        }
        /**
         * Register a callback to be called anytime a subscription succeeds.
         */

      }, {
        key: "subscribed",
        value: function subscribed(callback) {
          this.on('pusher:subscription_succeeded', function () {
            callback();
          });
          return this;
        }
        /**
         * Register a callback to be called anytime a subscription error occurs.
         */

      }, {
        key: "error",
        value: function error(callback) {
          this.on('pusher:subscription_error', function (status) {
            callback(status);
          });
          return this;
        }
        /**
         * Bind a channel to an event.
         */

      }, {
        key: "on",
        value: function on(event, callback) {
          this.subscription.bind(event, callback);
          return this;
        }
      }]);

      return PusherChannel;
    }(Channel);

    /**
     * This class represents a Pusher private channel.
     */

    var PusherPrivateChannel = /*#__PURE__*/function (_PusherChannel) {
      _inherits(PusherPrivateChannel, _PusherChannel);

      var _super = _createSuper(PusherPrivateChannel);

      function PusherPrivateChannel() {
        _classCallCheck(this, PusherPrivateChannel);

        return _super.apply(this, arguments);
      }

      _createClass(PusherPrivateChannel, [{
        key: "whisper",

        /**
         * Trigger client event on the channel.
         */
        value: function whisper(eventName, data) {
          this.pusher.channels.channels[this.name].trigger("client-".concat(eventName), data);
          return this;
        }
      }]);

      return PusherPrivateChannel;
    }(PusherChannel);

    /**
     * This class represents a Pusher private channel.
     */

    var PusherEncryptedPrivateChannel = /*#__PURE__*/function (_PusherChannel) {
      _inherits(PusherEncryptedPrivateChannel, _PusherChannel);

      var _super = _createSuper(PusherEncryptedPrivateChannel);

      function PusherEncryptedPrivateChannel() {
        _classCallCheck(this, PusherEncryptedPrivateChannel);

        return _super.apply(this, arguments);
      }

      _createClass(PusherEncryptedPrivateChannel, [{
        key: "whisper",

        /**
         * Trigger client event on the channel.
         */
        value: function whisper(eventName, data) {
          this.pusher.channels.channels[this.name].trigger("client-".concat(eventName), data);
          return this;
        }
      }]);

      return PusherEncryptedPrivateChannel;
    }(PusherChannel);

    /**
     * This class represents a Pusher presence channel.
     */

    var PusherPresenceChannel = /*#__PURE__*/function (_PusherChannel) {
      _inherits(PusherPresenceChannel, _PusherChannel);

      var _super = _createSuper(PusherPresenceChannel);

      function PusherPresenceChannel() {
        _classCallCheck(this, PusherPresenceChannel);

        return _super.apply(this, arguments);
      }

      _createClass(PusherPresenceChannel, [{
        key: "here",

        /**
         * Register a callback to be called anytime the member list changes.
         */
        value: function here(callback) {
          this.on('pusher:subscription_succeeded', function (data) {
            callback(Object.keys(data.members).map(function (k) {
              return data.members[k];
            }));
          });
          return this;
        }
        /**
         * Listen for someone joining the channel.
         */

      }, {
        key: "joining",
        value: function joining(callback) {
          this.on('pusher:member_added', function (member) {
            callback(member.info);
          });
          return this;
        }
        /**
         * Listen for someone leaving the channel.
         */

      }, {
        key: "leaving",
        value: function leaving(callback) {
          this.on('pusher:member_removed', function (member) {
            callback(member.info);
          });
          return this;
        }
        /**
         * Trigger client event on the channel.
         */

      }, {
        key: "whisper",
        value: function whisper(eventName, data) {
          this.pusher.channels.channels[this.name].trigger("client-".concat(eventName), data);
          return this;
        }
      }]);

      return PusherPresenceChannel;
    }(PusherChannel);

    /**
     * This class represents a Socket.io channel.
     */

    var SocketIoChannel = /*#__PURE__*/function (_Channel) {
      _inherits(SocketIoChannel, _Channel);

      var _super = _createSuper(SocketIoChannel);

      /**
       * Create a new class instance.
       */
      function SocketIoChannel(socket, name, options) {
        var _this;

        _classCallCheck(this, SocketIoChannel);

        _this = _super.call(this);
        /**
         * The event callbacks applied to the socket.
         */

        _this.events = {};
        /**
         * User supplied callbacks for events on this channel.
         */

        _this.listeners = {};
        _this.name = name;
        _this.socket = socket;
        _this.options = options;
        _this.eventFormatter = new EventFormatter(_this.options.namespace);

        _this.subscribe();

        return _this;
      }
      /**
       * Subscribe to a Socket.io channel.
       */


      _createClass(SocketIoChannel, [{
        key: "subscribe",
        value: function subscribe() {
          this.socket.emit('subscribe', {
            channel: this.name,
            auth: this.options.auth || {}
          });
        }
        /**
         * Unsubscribe from channel and ubind event callbacks.
         */

      }, {
        key: "unsubscribe",
        value: function unsubscribe() {
          this.unbind();
          this.socket.emit('unsubscribe', {
            channel: this.name,
            auth: this.options.auth || {}
          });
        }
        /**
         * Listen for an event on the channel instance.
         */

      }, {
        key: "listen",
        value: function listen(event, callback) {
          this.on(this.eventFormatter.format(event), callback);
          return this;
        }
        /**
         * Stop listening for an event on the channel instance.
         */

      }, {
        key: "stopListening",
        value: function stopListening(event, callback) {
          this.unbindEvent(this.eventFormatter.format(event), callback);
          return this;
        }
        /**
         * Register a callback to be called anytime a subscription succeeds.
         */

      }, {
        key: "subscribed",
        value: function subscribed(callback) {
          this.on('connect', function (socket) {
            callback(socket);
          });
          return this;
        }
        /**
         * Register a callback to be called anytime an error occurs.
         */

      }, {
        key: "error",
        value: function error(callback) {
          return this;
        }
        /**
         * Bind the channel's socket to an event and store the callback.
         */

      }, {
        key: "on",
        value: function on(event, callback) {
          var _this2 = this;

          this.listeners[event] = this.listeners[event] || [];

          if (!this.events[event]) {
            this.events[event] = function (channel, data) {
              if (_this2.name === channel && _this2.listeners[event]) {
                _this2.listeners[event].forEach(function (cb) {
                  return cb(data);
                });
              }
            };

            this.socket.on(event, this.events[event]);
          }

          this.listeners[event].push(callback);
          return this;
        }
        /**
         * Unbind the channel's socket from all stored event callbacks.
         */

      }, {
        key: "unbind",
        value: function unbind() {
          var _this3 = this;

          Object.keys(this.events).forEach(function (event) {
            _this3.unbindEvent(event);
          });
        }
        /**
         * Unbind the listeners for the given event.
         */

      }, {
        key: "unbindEvent",
        value: function unbindEvent(event, callback) {
          this.listeners[event] = this.listeners[event] || [];

          if (callback) {
            this.listeners[event] = this.listeners[event].filter(function (cb) {
              return cb !== callback;
            });
          }

          if (!callback || this.listeners[event].length === 0) {
            if (this.events[event]) {
              this.socket.removeListener(event, this.events[event]);
              delete this.events[event];
            }

            delete this.listeners[event];
          }
        }
      }]);

      return SocketIoChannel;
    }(Channel);

    /**
     * This class represents a Socket.io private channel.
     */

    var SocketIoPrivateChannel = /*#__PURE__*/function (_SocketIoChannel) {
      _inherits(SocketIoPrivateChannel, _SocketIoChannel);

      var _super = _createSuper(SocketIoPrivateChannel);

      function SocketIoPrivateChannel() {
        _classCallCheck(this, SocketIoPrivateChannel);

        return _super.apply(this, arguments);
      }

      _createClass(SocketIoPrivateChannel, [{
        key: "whisper",

        /**
         * Trigger client event on the channel.
         */
        value: function whisper(eventName, data) {
          this.socket.emit('client event', {
            channel: this.name,
            event: "client-".concat(eventName),
            data: data
          });
          return this;
        }
      }]);

      return SocketIoPrivateChannel;
    }(SocketIoChannel);

    /**
     * This class represents a Socket.io presence channel.
     */

    var SocketIoPresenceChannel = /*#__PURE__*/function (_SocketIoPrivateChann) {
      _inherits(SocketIoPresenceChannel, _SocketIoPrivateChann);

      var _super = _createSuper(SocketIoPresenceChannel);

      function SocketIoPresenceChannel() {
        _classCallCheck(this, SocketIoPresenceChannel);

        return _super.apply(this, arguments);
      }

      _createClass(SocketIoPresenceChannel, [{
        key: "here",

        /**
         * Register a callback to be called anytime the member list changes.
         */
        value: function here(callback) {
          this.on('presence:subscribed', function (members) {
            callback(members.map(function (m) {
              return m.user_info;
            }));
          });
          return this;
        }
        /**
         * Listen for someone joining the channel.
         */

      }, {
        key: "joining",
        value: function joining(callback) {
          this.on('presence:joining', function (member) {
            return callback(member.user_info);
          });
          return this;
        }
        /**
         * Listen for someone leaving the channel.
         */

      }, {
        key: "leaving",
        value: function leaving(callback) {
          this.on('presence:leaving', function (member) {
            return callback(member.user_info);
          });
          return this;
        }
      }]);

      return SocketIoPresenceChannel;
    }(SocketIoPrivateChannel);

    /**
     * This class represents a null channel.
     */

    var NullChannel = /*#__PURE__*/function (_Channel) {
      _inherits(NullChannel, _Channel);

      var _super = _createSuper(NullChannel);

      function NullChannel() {
        _classCallCheck(this, NullChannel);

        return _super.apply(this, arguments);
      }

      _createClass(NullChannel, [{
        key: "subscribe",

        /**
         * Subscribe to a channel.
         */
        value: function subscribe() {} //

        /**
         * Unsubscribe from a channel.
         */

      }, {
        key: "unsubscribe",
        value: function unsubscribe() {} //

        /**
         * Listen for an event on the channel instance.
         */

      }, {
        key: "listen",
        value: function listen(event, callback) {
          return this;
        }
        /**
         * Stop listening for an event on the channel instance.
         */

      }, {
        key: "stopListening",
        value: function stopListening(event, callback) {
          return this;
        }
        /**
         * Register a callback to be called anytime a subscription succeeds.
         */

      }, {
        key: "subscribed",
        value: function subscribed(callback) {
          return this;
        }
        /**
         * Register a callback to be called anytime an error occurs.
         */

      }, {
        key: "error",
        value: function error(callback) {
          return this;
        }
        /**
         * Bind a channel to an event.
         */

      }, {
        key: "on",
        value: function on(event, callback) {
          return this;
        }
      }]);

      return NullChannel;
    }(Channel);

    /**
     * This class represents a null private channel.
     */

    var NullPrivateChannel = /*#__PURE__*/function (_NullChannel) {
      _inherits(NullPrivateChannel, _NullChannel);

      var _super = _createSuper(NullPrivateChannel);

      function NullPrivateChannel() {
        _classCallCheck(this, NullPrivateChannel);

        return _super.apply(this, arguments);
      }

      _createClass(NullPrivateChannel, [{
        key: "whisper",

        /**
         * Trigger client event on the channel.
         */
        value: function whisper(eventName, data) {
          return this;
        }
      }]);

      return NullPrivateChannel;
    }(NullChannel);

    /**
     * This class represents a null presence channel.
     */

    var NullPresenceChannel = /*#__PURE__*/function (_NullChannel) {
      _inherits(NullPresenceChannel, _NullChannel);

      var _super = _createSuper(NullPresenceChannel);

      function NullPresenceChannel() {
        _classCallCheck(this, NullPresenceChannel);

        return _super.apply(this, arguments);
      }

      _createClass(NullPresenceChannel, [{
        key: "here",

        /**
         * Register a callback to be called anytime the member list changes.
         */
        value: function here(callback) {
          return this;
        }
        /**
         * Listen for someone joining the channel.
         */

      }, {
        key: "joining",
        value: function joining(callback) {
          return this;
        }
        /**
         * Listen for someone leaving the channel.
         */

      }, {
        key: "leaving",
        value: function leaving(callback) {
          return this;
        }
        /**
         * Trigger client event on the channel.
         */

      }, {
        key: "whisper",
        value: function whisper(eventName, data) {
          return this;
        }
      }]);

      return NullPresenceChannel;
    }(NullChannel);

    /**
     * This class creates a connector to Pusher.
     */

    var PusherConnector = /*#__PURE__*/function (_Connector) {
      _inherits(PusherConnector, _Connector);

      var _super = _createSuper(PusherConnector);

      function PusherConnector() {
        var _this;

        _classCallCheck(this, PusherConnector);

        _this = _super.apply(this, arguments);
        /**
         * All of the subscribed channel names.
         */

        _this.channels = {};
        return _this;
      }
      /**
       * Create a fresh Pusher connection.
       */


      _createClass(PusherConnector, [{
        key: "connect",
        value: function connect() {
          if (typeof this.options.client !== 'undefined') {
            this.pusher = this.options.client;
          } else {
            this.pusher = new Pusher(this.options.key, this.options);
          }
        }
        /**
         * Listen for an event on a channel instance.
         */

      }, {
        key: "listen",
        value: function listen(name, event, callback) {
          return this.channel(name).listen(event, callback);
        }
        /**
         * Get a channel instance by name.
         */

      }, {
        key: "channel",
        value: function channel(name) {
          if (!this.channels[name]) {
            this.channels[name] = new PusherChannel(this.pusher, name, this.options);
          }

          return this.channels[name];
        }
        /**
         * Get a private channel instance by name.
         */

      }, {
        key: "privateChannel",
        value: function privateChannel(name) {
          if (!this.channels['private-' + name]) {
            this.channels['private-' + name] = new PusherPrivateChannel(this.pusher, 'private-' + name, this.options);
          }

          return this.channels['private-' + name];
        }
        /**
         * Get a private encrypted channel instance by name.
         */

      }, {
        key: "encryptedPrivateChannel",
        value: function encryptedPrivateChannel(name) {
          if (!this.channels['private-encrypted-' + name]) {
            this.channels['private-encrypted-' + name] = new PusherEncryptedPrivateChannel(this.pusher, 'private-encrypted-' + name, this.options);
          }

          return this.channels['private-encrypted-' + name];
        }
        /**
         * Get a presence channel instance by name.
         */

      }, {
        key: "presenceChannel",
        value: function presenceChannel(name) {
          if (!this.channels['presence-' + name]) {
            this.channels['presence-' + name] = new PusherPresenceChannel(this.pusher, 'presence-' + name, this.options);
          }

          return this.channels['presence-' + name];
        }
        /**
         * Leave the given channel, as well as its private and presence variants.
         */

      }, {
        key: "leave",
        value: function leave(name) {
          var _this2 = this;

          var channels = [name, 'private-' + name, 'presence-' + name];
          channels.forEach(function (name, index) {
            _this2.leaveChannel(name);
          });
        }
        /**
         * Leave the given channel.
         */

      }, {
        key: "leaveChannel",
        value: function leaveChannel(name) {
          if (this.channels[name]) {
            this.channels[name].unsubscribe();
            delete this.channels[name];
          }
        }
        /**
         * Get the socket ID for the connection.
         */

      }, {
        key: "socketId",
        value: function socketId() {
          return this.pusher.connection.socket_id;
        }
        /**
         * Disconnect Pusher connection.
         */

      }, {
        key: "disconnect",
        value: function disconnect() {
          this.pusher.disconnect();
        }
      }]);

      return PusherConnector;
    }(Connector);

    /**
     * This class creates a connnector to a Socket.io server.
     */

    var SocketIoConnector = /*#__PURE__*/function (_Connector) {
      _inherits(SocketIoConnector, _Connector);

      var _super = _createSuper(SocketIoConnector);

      function SocketIoConnector() {
        var _this;

        _classCallCheck(this, SocketIoConnector);

        _this = _super.apply(this, arguments);
        /**
         * All of the subscribed channel names.
         */

        _this.channels = {};
        return _this;
      }
      /**
       * Create a fresh Socket.io connection.
       */


      _createClass(SocketIoConnector, [{
        key: "connect",
        value: function connect() {
          var _this2 = this;

          var io = this.getSocketIO();
          this.socket = io(this.options.host, this.options);
          this.socket.on('reconnect', function () {
            Object.values(_this2.channels).forEach(function (channel) {
              channel.subscribe();
            });
          });
          return this.socket;
        }
        /**
         * Get socket.io module from global scope or options.
         */

      }, {
        key: "getSocketIO",
        value: function getSocketIO() {
          if (typeof this.options.client !== 'undefined') {
            return this.options.client;
          }

          if (typeof io !== 'undefined') {
            return io;
          }

          throw new Error('Socket.io client not found. Should be globally available or passed via options.client');
        }
        /**
         * Listen for an event on a channel instance.
         */

      }, {
        key: "listen",
        value: function listen(name, event, callback) {
          return this.channel(name).listen(event, callback);
        }
        /**
         * Get a channel instance by name.
         */

      }, {
        key: "channel",
        value: function channel(name) {
          if (!this.channels[name]) {
            this.channels[name] = new SocketIoChannel(this.socket, name, this.options);
          }

          return this.channels[name];
        }
        /**
         * Get a private channel instance by name.
         */

      }, {
        key: "privateChannel",
        value: function privateChannel(name) {
          if (!this.channels['private-' + name]) {
            this.channels['private-' + name] = new SocketIoPrivateChannel(this.socket, 'private-' + name, this.options);
          }

          return this.channels['private-' + name];
        }
        /**
         * Get a presence channel instance by name.
         */

      }, {
        key: "presenceChannel",
        value: function presenceChannel(name) {
          if (!this.channels['presence-' + name]) {
            this.channels['presence-' + name] = new SocketIoPresenceChannel(this.socket, 'presence-' + name, this.options);
          }

          return this.channels['presence-' + name];
        }
        /**
         * Leave the given channel, as well as its private and presence variants.
         */

      }, {
        key: "leave",
        value: function leave(name) {
          var _this3 = this;

          var channels = [name, 'private-' + name, 'presence-' + name];
          channels.forEach(function (name) {
            _this3.leaveChannel(name);
          });
        }
        /**
         * Leave the given channel.
         */

      }, {
        key: "leaveChannel",
        value: function leaveChannel(name) {
          if (this.channels[name]) {
            this.channels[name].unsubscribe();
            delete this.channels[name];
          }
        }
        /**
         * Get the socket ID for the connection.
         */

      }, {
        key: "socketId",
        value: function socketId() {
          return this.socket.id;
        }
        /**
         * Disconnect Socketio connection.
         */

      }, {
        key: "disconnect",
        value: function disconnect() {
          this.socket.disconnect();
        }
      }]);

      return SocketIoConnector;
    }(Connector);

    /**
     * This class creates a null connector.
     */

    var NullConnector = /*#__PURE__*/function (_Connector) {
      _inherits(NullConnector, _Connector);

      var _super = _createSuper(NullConnector);

      function NullConnector() {
        var _this;

        _classCallCheck(this, NullConnector);

        _this = _super.apply(this, arguments);
        /**
         * All of the subscribed channel names.
         */

        _this.channels = {};
        return _this;
      }
      /**
       * Create a fresh connection.
       */


      _createClass(NullConnector, [{
        key: "connect",
        value: function connect() {} //

        /**
         * Listen for an event on a channel instance.
         */

      }, {
        key: "listen",
        value: function listen(name, event, callback) {
          return new NullChannel();
        }
        /**
         * Get a channel instance by name.
         */

      }, {
        key: "channel",
        value: function channel(name) {
          return new NullChannel();
        }
        /**
         * Get a private channel instance by name.
         */

      }, {
        key: "privateChannel",
        value: function privateChannel(name) {
          return new NullPrivateChannel();
        }
        /**
         * Get a presence channel instance by name.
         */

      }, {
        key: "presenceChannel",
        value: function presenceChannel(name) {
          return new NullPresenceChannel();
        }
        /**
         * Leave the given channel, as well as its private and presence variants.
         */

      }, {
        key: "leave",
        value: function leave(name) {} //

        /**
         * Leave the given channel.
         */

      }, {
        key: "leaveChannel",
        value: function leaveChannel(name) {} //

        /**
         * Get the socket ID for the connection.
         */

      }, {
        key: "socketId",
        value: function socketId() {
          return 'fake-socket-id';
        }
        /**
         * Disconnect the connection.
         */

      }, {
        key: "disconnect",
        value: function disconnect() {//
        }
      }]);

      return NullConnector;
    }(Connector);

    /**
     * This class is the primary API for interacting with broadcasting.
     */

    var Echo = /*#__PURE__*/function () {
      /**
       * Create a new class instance.
       */
      function Echo(options) {
        _classCallCheck(this, Echo);

        this.options = options;
        this.connect();

        if (!this.options.withoutInterceptors) {
          this.registerInterceptors();
        }
      }
      /**
       * Get a channel instance by name.
       */


      _createClass(Echo, [{
        key: "channel",
        value: function channel(_channel) {
          return this.connector.channel(_channel);
        }
        /**
         * Create a new connection.
         */

      }, {
        key: "connect",
        value: function connect() {
          if (this.options.broadcaster == 'pusher') {
            this.connector = new PusherConnector(this.options);
          } else if (this.options.broadcaster == 'socket.io') {
            this.connector = new SocketIoConnector(this.options);
          } else if (this.options.broadcaster == 'null') {
            this.connector = new NullConnector(this.options);
          } else if (typeof this.options.broadcaster == 'function') {
            this.connector = new this.options.broadcaster(this.options);
          }
        }
        /**
         * Disconnect from the Echo server.
         */

      }, {
        key: "disconnect",
        value: function disconnect() {
          this.connector.disconnect();
        }
        /**
         * Get a presence channel instance by name.
         */

      }, {
        key: "join",
        value: function join(channel) {
          return this.connector.presenceChannel(channel);
        }
        /**
         * Leave the given channel, as well as its private and presence variants.
         */

      }, {
        key: "leave",
        value: function leave(channel) {
          this.connector.leave(channel);
        }
        /**
         * Leave the given channel.
         */

      }, {
        key: "leaveChannel",
        value: function leaveChannel(channel) {
          this.connector.leaveChannel(channel);
        }
        /**
         * Listen for an event on a channel instance.
         */

      }, {
        key: "listen",
        value: function listen(channel, event, callback) {
          return this.connector.listen(channel, event, callback);
        }
        /**
         * Get a private channel instance by name.
         */

      }, {
        key: "private",
        value: function _private(channel) {
          return this.connector.privateChannel(channel);
        }
        /**
         * Get a private encrypted channel instance by name.
         */

      }, {
        key: "encryptedPrivate",
        value: function encryptedPrivate(channel) {
          return this.connector.encryptedPrivateChannel(channel);
        }
        /**
         * Get the Socket ID for the connection.
         */

      }, {
        key: "socketId",
        value: function socketId() {
          return this.connector.socketId();
        }
        /**
         * Register 3rd party request interceptiors. These are used to automatically
         * send a connections socket id to a Laravel app with a X-Socket-Id header.
         */

      }, {
        key: "registerInterceptors",
        value: function registerInterceptors() {
          if (typeof Vue === 'function' && Vue.http) {
            this.registerVueRequestInterceptor();
          }

          if (typeof axios === 'function') {
            this.registerAxiosRequestInterceptor();
          }

          if (typeof jQuery === 'function') {
            this.registerjQueryAjaxSetup();
          }
        }
        /**
         * Register a Vue HTTP interceptor to add the X-Socket-ID header.
         */

      }, {
        key: "registerVueRequestInterceptor",
        value: function registerVueRequestInterceptor() {
          var _this = this;

          Vue.http.interceptors.push(function (request, next) {
            if (_this.socketId()) {
              request.headers.set('X-Socket-ID', _this.socketId());
            }

            next();
          });
        }
        /**
         * Register an Axios HTTP interceptor to add the X-Socket-ID header.
         */

      }, {
        key: "registerAxiosRequestInterceptor",
        value: function registerAxiosRequestInterceptor() {
          var _this2 = this;

          axios.interceptors.request.use(function (config) {
            if (_this2.socketId()) {
              config.headers['X-Socket-Id'] = _this2.socketId();
            }

            return config;
          });
        }
        /**
         * Register jQuery AjaxPrefilter to add the X-Socket-ID header.
         */

      }, {
        key: "registerjQueryAjaxSetup",
        value: function registerjQueryAjaxSetup() {
          var _this3 = this;

          if (typeof jQuery.ajax != 'undefined') {
            jQuery.ajaxPrefilter(function (options, originalOptions, xhr) {
              if (_this3.socketId()) {
                xhr.setRequestHeader('X-Socket-Id', _this3.socketId());
              }
            });
          }
        }
      }]);

      return Echo;
    }();

    var CookieService = (function () {
        function CookieService() {
        }
        CookieService.setCookie = function (key, cvalue, extime) {
            if (extime === void 0) { extime = 1; }
            var d = new Date();
            d.setTime(d.getTime() + (extime * 1 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = key + "=" + cvalue + ";" + expires + ";path=/";
        };
        CookieService.getCookie = function (key) {
            var name = key + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(";");
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === " ") {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        };
        CookieService.checkCookie = function (key) {
            if (this.getCookie(key) !== "")
                return true;
            return false;
        };
        return CookieService;
    }());

    var WebSocketService = (function () {
        function WebSocketService() {
            this.queuedConnections = [];
        }
        WebSocketService.prototype.auth = function (data) {
            this.siteId = data;
        };
        WebSocketService.prototype.getSession = function () {
            return this.session;
        };
        WebSocketService.prototype.getGuest = function () {
            return this.guest;
        };
        WebSocketService.prototype.connect = function (callback) {
            if (!this.connection) {
                this.createConnection();
            }
            if (this.isAuthenticated()) {
                return callback(this.connection);
            }
            this.queuedConnections.push(callback);
        };
        WebSocketService.prototype.disconnect = function () {
            this.connection.disconnect();
            this.queuedConnections = [];
            this.connection = null;
        };
        WebSocketService.prototype.isAuthenticated = function () {
            return this.getSession();
        };
        WebSocketService.prototype.createConnection = function () {
            var _this = this;
            this.connection = new Echo({
                broadcaster: "pusher",
                enabledTransports: ["ws", "wss"],
                useTLS: false,
                encrypted: false,
                forceTLS: false,
                wsHost: process.env.WS_HOST,
                wsPort: process.env.WS_PORT,
                key: process.env.PUSHER_APP_KEY + "/" + this.siteId,
                authEndpoint: process.env.APP_URL + "/api/broadcasting/auth",
                disableStats: true,
                auth: {
                    headers: {
                        Authorization: "Bearer " + this.siteId
                    },
                },
            });
            this.connection.connector.pusher.bind("auth", function (_a) {
                var guest = _a.guest, session = _a.session;
                _this.guest = guest;
                _this.session = session;
                CookieService.setCookie("sid", session, 360);
                CookieService.setCookie("gid", guest.id, 360);
                CookieService.setCookie("site_id", guest.website_id, 360);
                window.localStorage.setItem("sid", session);
                window.localStorage.setItem("gid", guest.id);
                window.localStorage.setItem("site_id", guest.website_id);
                _this.queuedConnections.forEach(function (callback) {
                    callback(_this.connection);
                });
            });
        };
        return WebSocketService;
    }());

    window.Pusher = require('pusher-js');
    var Client = (function () {
        function Client() {
            var _this = this;
            this.websocketService = new WebSocketService();
            this.recordService = new RecordService(this.websocketService);
            this.runQueued().then(function () {
                _this.setupQueue();
            });
        }
        Client.prototype.runQueued = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _i, queue, args;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!Array.isArray(window.seopieQueue)) return [3, 4];
                            _a = [];
                            for (_b in window.seopieQueue)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3, 4];
                            queue = _a[_i];
                            args = void 0;
                            args = window.seopieQueue[queue];
                            if (!this[args[0]]) {
                                throw Error(args[0] + " is an invalid command.");
                            }
                            return [4, this[args[0]](args[1])];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3, 1];
                        case 4: return [2];
                    }
                });
            });
        };
        Client.prototype.setupQueue = function () {
            var _this = this;
            delete window.seopieQueue;
            window.seoptie = function (fn, data) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this[fn]) {
                                throw Error(fn + " is an invalid command.");
                            }
                            return [4, this[fn](data)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); };
        };
        Client.prototype.auth = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.websocketService.auth(data.site_id);
                    this.record();
                    return [2];
                });
            });
        };
        Client.prototype.record = function () {
            console.log("record a geldi");
            this.recordService.connect();
        };
        return Client;
    }());
    new Client();

}());
