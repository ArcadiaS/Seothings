var rrwebRecord = (function () {
  'use strict';

  var NodeType;
  (function (NodeType) {
      NodeType[NodeType["Document"] = 0] = "Document";
      NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
      NodeType[NodeType["Element"] = 2] = "Element";
      NodeType[NodeType["Text"] = 3] = "Text";
      NodeType[NodeType["CDATA"] = 4] = "CDATA";
      NodeType[NodeType["Comment"] = 5] = "Comment";
  })(NodeType || (NodeType = {}));

  let _id = 1;
  const tagNameRegex = RegExp('[^a-z1-6-_]');
  const IGNORED_NODE = -2;
  function genId() {
      return _id++;
  }
  function getValidTagName(element) {
      if (element instanceof HTMLFormElement) {
          return 'form';
      }
      const processedTagName = element.tagName.toLowerCase().trim();
      if (tagNameRegex.test(processedTagName)) {
          return 'div';
      }
      return processedTagName;
  }
  function getCssRulesString(s) {
      try {
          const rules = s.rules || s.cssRules;
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
      let origin;
      if (url.indexOf('//') > -1) {
          origin = url.split('/').slice(0, 3).join('/');
      }
      else {
          origin = url.split('/')[0];
      }
      origin = origin.split('?')[0];
      return origin;
  }
  const URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")([^"]*)"|([^)]*))\)/gm;
  const RELATIVE_PATH = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/).*/;
  const DATA_URI = /^(data:)([^,]*),(.*)/i;
  function absoluteToStylesheet(cssText, href) {
      return (cssText || '').replace(URL_IN_CSS_REF, (origin, quote1, path1, quote2, path2, path3) => {
          const filePath = path1 || path2 || path3;
          const maybeQuote = quote1 || quote2 || '';
          if (!filePath) {
              return origin;
          }
          if (!RELATIVE_PATH.test(filePath)) {
              return `url(${maybeQuote}${filePath}${maybeQuote})`;
          }
          if (DATA_URI.test(filePath)) {
              return `url(${maybeQuote}${filePath}${maybeQuote})`;
          }
          if (filePath[0] === '/') {
              return `url(${maybeQuote}${extractOrigin(href) + filePath}${maybeQuote})`;
          }
          const stack = href.split('/');
          const parts = filePath.split('/');
          stack.pop();
          for (const part of parts) {
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
          return `url(${maybeQuote}${stack.join('/')}${maybeQuote})`;
      });
  }
  function getAbsoluteSrcsetString(doc, attributeValue) {
      if (attributeValue.trim() === '') {
          return attributeValue;
      }
      const srcsetValues = attributeValue.split(',');
      const resultingSrcsetString = srcsetValues
          .map((srcItem) => {
          const trimmedSrcItem = srcItem.trimLeft().trimRight();
          const urlAndSize = trimmedSrcItem.split(' ');
          if (urlAndSize.length === 2) {
              const absUrl = absoluteToDoc(doc, urlAndSize[0]);
              return `${absUrl} ${urlAndSize[1]}`;
          }
          else if (urlAndSize.length === 1) {
              const absUrl = absoluteToDoc(doc, urlAndSize[0]);
              return `${absUrl}`;
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
      const a = doc.createElement('a');
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
          element.classList.forEach((className) => {
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
      const { doc, blockClass, blockSelector, inlineStylesheet, maskInputOptions = {}, recordCanvas, } = options;
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
              const needBlock = _isBlockedElement(n, blockClass, blockSelector);
              const tagName = getValidTagName(n);
              let attributes = {};
              for (const { name, value } of Array.from(n.attributes)) {
                  attributes[name] = transformAttribute(doc, name, value);
              }
              if (tagName === 'link' && inlineStylesheet) {
                  const stylesheet = Array.from(doc.styleSheets).find((s) => {
                      return s.href === n.href;
                  });
                  const cssText = getCssRulesString(stylesheet);
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
                  const cssText = getCssRulesString(n.sheet);
                  if (cssText) {
                      attributes._cssText = absoluteToStylesheet(cssText, location.href);
                  }
              }
              if (tagName === 'input' ||
                  tagName === 'textarea' ||
                  tagName === 'select') {
                  const value = n.value;
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
                  const selectValue = n.parentElement;
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
                  const { width, height } = n.getBoundingClientRect();
                  attributes = {
                      class: attributes.class,
                      rr_width: `${width}px`,
                      rr_height: `${height}px`,
                  };
              }
              return {
                  type: NodeType.Element,
                  tagName,
                  attributes,
                  childNodes: [],
                  isSVG: isSVGElement(n) || undefined,
                  needBlock,
              };
          case n.TEXT_NODE:
              const parentTagName = n.parentNode && n.parentNode.tagName;
              let textContent = n.textContent;
              const isStyle = parentTagName === 'STYLE' ? true : undefined;
              if (isStyle && textContent) {
                  textContent = absoluteToStylesheet(textContent, location.href);
              }
              if (parentTagName === 'SCRIPT') {
                  textContent = 'SCRIPT_PLACEHOLDER';
              }
              return {
                  type: NodeType.Text,
                  textContent: textContent || '',
                  isStyle,
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
      const { doc, map, blockClass, blockSelector, skipChild = false, inlineStylesheet = true, maskInputOptions = {}, slimDOMOptions, recordCanvas = false, } = options;
      let { preserveWhiteSpace = true } = options;
      const _serializedNode = serializeNode(n, {
          doc,
          blockClass,
          blockSelector,
          inlineStylesheet,
          maskInputOptions,
          recordCanvas,
      });
      if (!_serializedNode) {
          console.warn(n, 'not serialized');
          return null;
      }
      let id;
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
      const serializedNode = Object.assign(_serializedNode, { id });
      n.__sn = serializedNode;
      if (id === IGNORED_NODE) {
          return null;
      }
      map[id] = n;
      let recordChild = !skipChild;
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
          for (const childN of Array.from(n.childNodes)) {
              const serializedChildNode = serializeNodeWithId(childN, {
                  doc,
                  map,
                  blockClass,
                  blockSelector,
                  skipChild,
                  inlineStylesheet,
                  maskInputOptions,
                  slimDOMOptions,
                  recordCanvas,
                  preserveWhiteSpace,
              });
              if (serializedChildNode) {
                  serializedNode.childNodes.push(serializedChildNode);
              }
          }
      }
      return serializedNode;
  }
  function snapshot(n, options) {
      const { blockClass = 'rr-block', inlineStylesheet = true, recordCanvas = false, blockSelector = null, maskAllInputs = false, slimDOM = false, } = options || {};
      const idNodeMap = {};
      const maskInputOptions = maskAllInputs === true
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
      const slimDOMOptions = slimDOM === true || slimDOM === 'all'
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
              blockClass,
              blockSelector,
              skipChild: false,
              inlineStylesheet,
              maskInputOptions,
              slimDOMOptions,
              recordCanvas,
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

  function on(type, fn, target = document) {
      const options = { capture: true, passive: true };
      target.addEventListener(type, fn, options);
      return () => target.removeEventListener(type, fn, options);
  }
  const mirror = {
      map: {},
      getId(n) {
          if (!n.__sn) {
              return -1;
          }
          return n.__sn.id;
      },
      getNode(id) {
          return mirror.map[id] || null;
      },
      removeNodeFromMap(n) {
          const id = n.__sn && n.__sn.id;
          delete mirror.map[id];
          if (n.childNodes) {
              n.childNodes.forEach((child) => mirror.removeNodeFromMap(child));
          }
      },
      has(id) {
          return mirror.map.hasOwnProperty(id);
      },
  };
  function throttle(func, wait, options = {}) {
      let timeout = null;
      let previous = 0;
      return function (arg) {
          let now = Date.now();
          if (!previous && options.leading === false) {
              previous = now;
          }
          let remaining = wait - (now - previous);
          let context = this;
          let args = arguments;
          if (remaining <= 0 || remaining > wait) {
              if (timeout) {
                  window.clearTimeout(timeout);
                  timeout = null;
              }
              previous = now;
              func.apply(context, args);
          }
          else if (!timeout && options.trailing !== false) {
              timeout = window.setTimeout(() => {
                  previous = options.leading === false ? 0 : Date.now();
                  timeout = null;
                  func.apply(context, args);
              }, remaining);
          }
      };
  }
  function hookSetter(target, key, d, isRevoked, win = window) {
      const original = win.Object.getOwnPropertyDescriptor(target, key);
      win.Object.defineProperty(target, key, isRevoked
          ? d
          : {
              set(value) {
                  setTimeout(() => {
                      d.set.call(this, value);
                  }, 0);
                  if (original && original.set) {
                      original.set.call(this, value);
                  }
              },
          });
      return () => hookSetter(target, key, original || {}, true);
  }
  function patch(source, name, replacement) {
      try {
          if (!(name in source)) {
              return () => { };
          }
          const original = source[name];
          const wrapped = replacement(original);
          if (typeof wrapped === 'function') {
              wrapped.prototype = wrapped.prototype || {};
              Object.defineProperties(wrapped, {
                  __rrweb_original__: {
                      enumerable: false,
                      value: original,
                  },
              });
          }
          source[name] = wrapped;
          return () => {
              source[name] = original;
          };
      }
      catch (_a) {
          return () => { };
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
          let needBlock = false;
          if (typeof blockClass === 'string') {
              needBlock = node.classList.contains(blockClass);
          }
          else {
              node.classList.forEach((className) => {
                  if (blockClass.test(className)) {
                      needBlock = true;
                  }
              });
          }
          return needBlock || isBlocked(node.parentNode, blockClass);
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
      const id = mirror.getId(target);
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
  function polyfill(win = window) {
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
  class DoubleLinkedList {
      constructor() {
          this.length = 0;
          this.head = null;
      }
      get(position) {
          if (position >= this.length) {
              throw new Error('Position outside of list range');
          }
          let current = this.head;
          for (let index = 0; index < position; index++) {
              current = (current === null || current === void 0 ? void 0 : current.next) || null;
          }
          return current;
      }
      addNode(n) {
          const node = {
              value: n,
              previous: null,
              next: null,
          };
          n.__ln = node;
          if (n.previousSibling && isNodeInLinkedList(n.previousSibling)) {
              const current = n.previousSibling.__ln.next;
              node.next = current;
              node.previous = n.previousSibling.__ln;
              n.previousSibling.__ln.next = node;
              if (current) {
                  current.previous = node;
              }
          }
          else if (n.nextSibling && isNodeInLinkedList(n.nextSibling)) {
              const current = n.nextSibling.__ln.previous;
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
      }
      removeNode(n) {
          const current = n.__ln;
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
      }
  }
  const moveKey = (id, parentId) => `${id}@${parentId}`;
  function isINode(n) {
      return '__sn' in n;
  }
  class MutationBuffer {
      constructor() {
          this.frozen = false;
          this.texts = [];
          this.attributes = [];
          this.removes = [];
          this.mapRemoves = [];
          this.movedMap = {};
          this.addedSet = new Set();
          this.movedSet = new Set();
          this.droppedSet = new Set();
          this.processMutations = (mutations) => {
              mutations.forEach(this.processMutation);
              if (!this.frozen) {
                  this.emit();
              }
          };
          this.emit = () => {
              const adds = [];
              const addList = new DoubleLinkedList();
              const getNextId = (n) => {
                  let ns = n;
                  let nextId = IGNORED_NODE;
                  while (nextId === IGNORED_NODE) {
                      ns = ns && ns.nextSibling;
                      nextId = ns && mirror.getId(ns);
                  }
                  if (nextId === -1 && isBlocked(n.nextSibling, this.blockClass)) {
                      nextId = null;
                  }
                  return nextId;
              };
              const pushAdd = (n) => {
                  if (!n.parentNode) {
                      return;
                  }
                  const parentId = mirror.getId(n.parentNode);
                  const nextId = getNextId(n);
                  if (parentId === -1 || nextId === -1) {
                      return addList.addNode(n);
                  }
                  let sn = serializeNodeWithId(n, {
                      doc: document,
                      map: mirror.map,
                      blockClass: this.blockClass,
                      blockSelector: this.blockSelector,
                      skipChild: true,
                      inlineStylesheet: this.inlineStylesheet,
                      maskInputOptions: this.maskInputOptions,
                      slimDOMOptions: this.slimDOMOptions,
                      recordCanvas: this.recordCanvas,
                  });
                  if (sn) {
                      adds.push({
                          parentId,
                          nextId,
                          node: sn,
                      });
                  }
              };
              while (this.mapRemoves.length) {
                  mirror.removeNodeFromMap(this.mapRemoves.shift());
              }
              for (const n of this.movedSet) {
                  if (isParentRemoved(this.removes, n) &&
                      !this.movedSet.has(n.parentNode)) {
                      continue;
                  }
                  pushAdd(n);
              }
              for (const n of this.addedSet) {
                  if (!isAncestorInSet(this.droppedSet, n) &&
                      !isParentRemoved(this.removes, n)) {
                      pushAdd(n);
                  }
                  else if (isAncestorInSet(this.movedSet, n)) {
                      pushAdd(n);
                  }
                  else {
                      this.droppedSet.add(n);
                  }
              }
              let candidate = null;
              while (addList.length) {
                  let node = null;
                  if (candidate) {
                      const parentId = mirror.getId(candidate.value.parentNode);
                      const nextId = getNextId(candidate.value);
                      if (parentId !== -1 && nextId !== -1) {
                          node = candidate;
                      }
                  }
                  if (!node) {
                      for (let index = addList.length - 1; index >= 0; index--) {
                          const _node = addList.get(index);
                          const parentId = mirror.getId(_node.value.parentNode);
                          const nextId = getNextId(_node.value);
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
              const payload = {
                  texts: this.texts
                      .map((text) => ({
                      id: mirror.getId(text.node),
                      value: text.value,
                  }))
                      .filter((text) => mirror.has(text.id)),
                  attributes: this.attributes
                      .map((attribute) => ({
                      id: mirror.getId(attribute.node),
                      attributes: attribute.attributes,
                  }))
                      .filter((attribute) => mirror.has(attribute.id)),
                  removes: this.removes,
                  adds,
              };
              if (!payload.texts.length &&
                  !payload.attributes.length &&
                  !payload.removes.length &&
                  !payload.adds.length) {
                  return;
              }
              this.texts = [];
              this.attributes = [];
              this.removes = [];
              this.addedSet = new Set();
              this.movedSet = new Set();
              this.droppedSet = new Set();
              this.movedMap = {};
              this.emissionCallback(payload);
          };
          this.processMutation = (m) => {
              if (isIgnored(m.target)) {
                  return;
              }
              switch (m.type) {
                  case 'characterData': {
                      const value = m.target.textContent;
                      if (!isBlocked(m.target, this.blockClass) && value !== m.oldValue) {
                          this.texts.push({
                              value,
                              node: m.target,
                          });
                      }
                      break;
                  }
                  case 'attributes': {
                      const value = m.target.getAttribute(m.attributeName);
                      if (isBlocked(m.target, this.blockClass) || value === m.oldValue) {
                          return;
                      }
                      let item = this.attributes.find((a) => a.node === m.target);
                      if (!item) {
                          item = {
                              node: m.target,
                              attributes: {},
                          };
                          this.attributes.push(item);
                      }
                      item.attributes[m.attributeName] = transformAttribute(document, m.attributeName, value);
                      break;
                  }
                  case 'childList': {
                      m.addedNodes.forEach((n) => this.genAdds(n, m.target));
                      m.removedNodes.forEach((n) => {
                          const nodeId = mirror.getId(n);
                          const parentId = mirror.getId(m.target);
                          if (isBlocked(n, this.blockClass) ||
                              isBlocked(m.target, this.blockClass) ||
                              isIgnored(n)) {
                              return;
                          }
                          if (this.addedSet.has(n)) {
                              deepDelete(this.addedSet, n);
                              this.droppedSet.add(n);
                          }
                          else if (this.addedSet.has(m.target) && nodeId === -1) ;
                          else if (isAncestorRemoved(m.target)) ;
                          else if (this.movedSet.has(n) &&
                              this.movedMap[moveKey(nodeId, parentId)]) {
                              deepDelete(this.movedSet, n);
                          }
                          else {
                              this.removes.push({
                                  parentId,
                                  id: nodeId,
                              });
                          }
                          this.mapRemoves.push(n);
                      });
                      break;
                  }
              }
          };
          this.genAdds = (n, target) => {
              if (isBlocked(n, this.blockClass)) {
                  return;
              }
              if (isINode(n)) {
                  if (isIgnored(n)) {
                      return;
                  }
                  this.movedSet.add(n);
                  let targetId = null;
                  if (target && isINode(target)) {
                      targetId = target.__sn.id;
                  }
                  if (targetId) {
                      this.movedMap[moveKey(n.__sn.id, targetId)] = true;
                  }
              }
              else {
                  this.addedSet.add(n);
                  this.droppedSet.delete(n);
              }
              n.childNodes.forEach((childN) => this.genAdds(childN));
          };
      }
      init(cb, blockClass, blockSelector, inlineStylesheet, maskInputOptions, recordCanvas, slimDOMOptions) {
          this.blockClass = blockClass;
          this.blockSelector = blockSelector;
          this.inlineStylesheet = inlineStylesheet;
          this.maskInputOptions = maskInputOptions;
          this.recordCanvas = recordCanvas;
          this.slimDOMOptions = slimDOMOptions;
          this.emissionCallback = cb;
      }
      freeze() {
          this.frozen = true;
      }
      unfreeze() {
          this.frozen = false;
      }
      isFrozen() {
          return this.frozen;
      }
  }
  function deepDelete(addsSet, n) {
      addsSet.delete(n);
      n.childNodes.forEach((childN) => deepDelete(addsSet, childN));
  }
  function isParentRemoved(removes, n) {
      const { parentNode } = n;
      if (!parentNode) {
          return false;
      }
      const parentId = mirror.getId(parentNode);
      if (removes.some((r) => r.id === parentId)) {
          return true;
      }
      return isParentRemoved(removes, parentNode);
  }
  function isAncestorInSet(set, n) {
      const { parentNode } = n;
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
      const options = {
          numOfKeysLimit: 50,
      };
      Object.assign(options, stringifyOptions);
      let stack = [], keys = [];
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
              const eventResult = {};
              for (const key in value) {
                  const eventValue = value[key];
                  if (Array.isArray(eventValue))
                      eventResult[key] = pathToSelector(eventValue.length ? eventValue[0] : null);
                  else
                      eventResult[key] = eventValue;
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
          let str = obj.toString();
          if (options.stringLengthLimit && str.length > options.stringLengthLimit) {
              str = `${str.slice(0, options.stringLengthLimit)}...`;
          }
          return str;
      }
  }

  const mutationBuffer = new MutationBuffer();
  function initMutationObserver(cb, blockClass, blockSelector, inlineStylesheet, maskInputOptions, recordCanvas, slimDOMOptions) {
      mutationBuffer.init(cb, blockClass, blockSelector, inlineStylesheet, maskInputOptions, recordCanvas, slimDOMOptions);
      const observer = new MutationObserver(mutationBuffer.processMutations.bind(mutationBuffer));
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
          return () => { };
      }
      const threshold = typeof sampling.mousemove === 'number' ? sampling.mousemove : 50;
      let positions = [];
      let timeBaseline;
      const wrappedCb = throttle((isTouch) => {
          const totalOffset = Date.now() - timeBaseline;
          cb(positions.map((p) => {
              p.timeOffset -= totalOffset;
              return p;
          }), isTouch ? IncrementalSource.TouchMove : IncrementalSource.MouseMove);
          positions = [];
          timeBaseline = null;
      }, 500);
      const updatePosition = throttle((evt) => {
          const { target } = evt;
          const { clientX, clientY } = isTouchEvent(evt)
              ? evt.changedTouches[0]
              : evt;
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
      const handlers = [
          on('mousemove', updatePosition),
          on('touchmove', updatePosition),
      ];
      return () => {
          handlers.forEach((h) => h());
      };
  }
  function initMouseInteractionObserver(cb, blockClass, sampling) {
      if (sampling.mouseInteraction === false) {
          return () => { };
      }
      const disableMap = sampling.mouseInteraction === true ||
          sampling.mouseInteraction === undefined
          ? {}
          : sampling.mouseInteraction;
      const handlers = [];
      const getHandler = (eventKey) => {
          return (event) => {
              if (isBlocked(event.target, blockClass)) {
                  return;
              }
              const id = mirror.getId(event.target);
              const { clientX, clientY } = isTouchEvent(event)
                  ? event.changedTouches[0]
                  : event;
              cb({
                  type: MouseInteractions[eventKey],
                  id,
                  x: clientX,
                  y: clientY,
              });
          };
      };
      Object.keys(MouseInteractions)
          .filter((key) => Number.isNaN(Number(key)) &&
          !key.endsWith('_Departed') &&
          disableMap[key] !== false)
          .forEach((eventKey) => {
          const eventName = eventKey.toLowerCase();
          const handler = getHandler(eventKey);
          handlers.push(on(eventName, handler));
      });
      return () => {
          handlers.forEach((h) => h());
      };
  }
  function initScrollObserver(cb, blockClass, sampling) {
      const updatePosition = throttle((evt) => {
          if (!evt.target || isBlocked(evt.target, blockClass)) {
              return;
          }
          const id = mirror.getId(evt.target);
          if (evt.target === document) {
              const scrollEl = (document.scrollingElement || document.documentElement);
              cb({
                  id,
                  x: scrollEl.scrollLeft,
                  y: scrollEl.scrollTop,
              });
          }
          else {
              cb({
                  id,
                  x: evt.target.scrollLeft,
                  y: evt.target.scrollTop,
              });
          }
      }, sampling.scroll || 100);
      return on('scroll', updatePosition);
  }
  function initViewportResizeObserver(cb) {
      let last_h = -1;
      let last_w = -1;
      const updateDimension = throttle(() => {
          const height = getWindowHeight();
          const width = getWindowWidth();
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
  const INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];
  const lastInputValueMap = new WeakMap();
  function initInputObserver(cb, blockClass, ignoreClass, maskInputOptions, maskInputFn, sampling) {
      function eventHandler(event) {
          const { target } = event;
          if (!target ||
              !target.tagName ||
              INPUT_TAGS.indexOf(target.tagName) < 0 ||
              isBlocked(target, blockClass)) {
              return;
          }
          const type = target.type;
          if (type === 'password' ||
              target.classList.contains(ignoreClass)) {
              return;
          }
          let text = target.value;
          let isChecked = false;
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
          cbWithDedup(target, { text, isChecked });
          const name = target.name;
          if (type === 'radio' && name && isChecked) {
              document
                  .querySelectorAll(`input[type="radio"][name="${name}"]`)
                  .forEach((el) => {
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
          const lastInputValue = lastInputValueMap.get(target);
          if (!lastInputValue ||
              lastInputValue.text !== v.text ||
              lastInputValue.isChecked !== v.isChecked) {
              lastInputValueMap.set(target, v);
              const id = mirror.getId(target);
              cb(Object.assign(Object.assign({}, v), { id }));
          }
      }
      const events = sampling.input === 'last' ? ['change'] : ['input', 'change'];
      const handlers = events.map((eventName) => on(eventName, eventHandler));
      const propertyDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      const hookProperties = [
          [HTMLInputElement.prototype, 'value'],
          [HTMLInputElement.prototype, 'checked'],
          [HTMLSelectElement.prototype, 'value'],
          [HTMLTextAreaElement.prototype, 'value'],
          [HTMLSelectElement.prototype, 'selectedIndex'],
      ];
      if (propertyDescriptor && propertyDescriptor.set) {
          handlers.push(...hookProperties.map((p) => hookSetter(p[0], p[1], {
              set() {
                  eventHandler({ target: this });
              },
          })));
      }
      return () => {
          handlers.forEach((h) => h());
      };
  }
  function initStyleSheetObserver(cb) {
      const insertRule = CSSStyleSheet.prototype.insertRule;
      CSSStyleSheet.prototype.insertRule = function (rule, index) {
          const id = mirror.getId(this.ownerNode);
          if (id !== -1) {
              cb({
                  id,
                  adds: [{ rule, index }],
              });
          }
          return insertRule.apply(this, arguments);
      };
      const deleteRule = CSSStyleSheet.prototype.deleteRule;
      CSSStyleSheet.prototype.deleteRule = function (index) {
          const id = mirror.getId(this.ownerNode);
          if (id !== -1) {
              cb({
                  id,
                  removes: [{ index }],
              });
          }
          return deleteRule.apply(this, arguments);
      };
      return () => {
          CSSStyleSheet.prototype.insertRule = insertRule;
          CSSStyleSheet.prototype.deleteRule = deleteRule;
      };
  }
  function initMediaInteractionObserver(mediaInteractionCb, blockClass) {
      const handler = (type) => (event) => {
          const { target } = event;
          if (!target || isBlocked(target, blockClass)) {
              return;
          }
          mediaInteractionCb({
              type: type === 'play' ? 0 : 1,
              id: mirror.getId(target),
          });
      };
      const handlers = [on('play', handler('play')), on('pause', handler('pause'))];
      return () => {
          handlers.forEach((h) => h());
      };
  }
  function initCanvasMutationObserver(cb, blockClass) {
      const props = Object.getOwnPropertyNames(CanvasRenderingContext2D.prototype);
      const handlers = [];
      for (const prop of props) {
          try {
              if (typeof CanvasRenderingContext2D.prototype[prop] !== 'function') {
                  continue;
              }
              const restoreHandler = patch(CanvasRenderingContext2D.prototype, prop, function (original) {
                  return function (...args) {
                      if (!isBlocked(this.canvas, blockClass)) {
                          setTimeout(() => {
                              const recordArgs = [...args];
                              if (prop === 'drawImage') {
                                  if (recordArgs[0] &&
                                      recordArgs[0] instanceof HTMLCanvasElement) {
                                      recordArgs[0] = recordArgs[0].toDataURL();
                                  }
                              }
                              cb({
                                  id: mirror.getId(this.canvas),
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
              const hookHandler = hookSetter(CanvasRenderingContext2D.prototype, prop, {
                  set(v) {
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
      }
      return () => {
          handlers.forEach((h) => h());
      };
  }
  function initFontObserver(cb) {
      const handlers = [];
      const fontMap = new WeakMap();
      const originalFontFace = FontFace;
      window.FontFace = function FontFace(family, source, descriptors) {
          const fontFace = new originalFontFace(family, source, descriptors);
          fontMap.set(fontFace, {
              family,
              buffer: typeof source !== 'string',
              descriptors,
              fontSource: typeof source === 'string'
                  ? source
                  :
                      JSON.stringify(Array.from(new Uint8Array(source))),
          });
          return fontFace;
      };
      const restoreHandler = patch(document.fonts, 'add', function (original) {
          return function (fontFace) {
              setTimeout(() => {
                  const p = fontMap.get(fontFace);
                  if (p) {
                      cb(p);
                      fontMap.delete(fontFace);
                  }
              }, 0);
              return original.apply(this, [fontFace]);
          };
      });
      handlers.push(() => {
          window.FonFace = originalFontFace;
      });
      handlers.push(restoreHandler);
      return () => {
          handlers.forEach((h) => h());
      };
  }
  function initLogObserver(cb, logOptions) {
      const logger = logOptions.logger;
      if (!logger)
          return () => { };
      let logCount = 0;
      const cancelHandlers = [];
      if (logOptions.level.includes('error')) {
          if (window) {
              const originalOnError = window.onerror;
              window.onerror = (...args) => {
                  originalOnError && originalOnError.apply(this, args);
                  let stack = [];
                  if (args[args.length - 1] instanceof Error)
                      stack = parseStack(args[args.length - 1].stack, 0);
                  const payload = [stringify(args[0], logOptions.stringifyOptions)];
                  cb({
                      level: 'error',
                      trace: stack,
                      payload: payload,
                  });
              };
              cancelHandlers.push(() => {
                  window.onerror = originalOnError;
              });
          }
      }
      for (const levelType of logOptions.level)
          cancelHandlers.push(replace(logger, levelType));
      return () => {
          cancelHandlers.forEach((h) => h());
      };
      function replace(logger, level) {
          if (!logger[level])
              return () => { };
          return patch(logger, level, (original) => {
              return (...args) => {
                  original.apply(this, args);
                  try {
                      const stack = parseStack(new Error().stack);
                      const payload = args.map((s) => stringify(s, logOptions.stringifyOptions));
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
                      original('rrweb logger error:', error, ...args);
                  }
              };
          });
      }
      function parseStack(stack, omitDepth = 1) {
          let stacks = [];
          if (stack) {
              stacks = stack
                  .split('at')
                  .splice(1 + omitDepth)
                  .map((s) => s.trim());
          }
          return stacks;
      }
  }
  function mergeHooks(o, hooks) {
      const { mutationCb, mousemoveCb, mouseInteractionCb, scrollCb, viewportResizeCb, inputCb, mediaInteractionCb, styleSheetRuleCb, canvasMutationCb, fontCb, logCb, } = o;
      o.mutationCb = (...p) => {
          if (hooks.mutation) {
              hooks.mutation(...p);
          }
          mutationCb(...p);
      };
      o.mousemoveCb = (...p) => {
          if (hooks.mousemove) {
              hooks.mousemove(...p);
          }
          mousemoveCb(...p);
      };
      o.mouseInteractionCb = (...p) => {
          if (hooks.mouseInteraction) {
              hooks.mouseInteraction(...p);
          }
          mouseInteractionCb(...p);
      };
      o.scrollCb = (...p) => {
          if (hooks.scroll) {
              hooks.scroll(...p);
          }
          scrollCb(...p);
      };
      o.viewportResizeCb = (...p) => {
          if (hooks.viewportResize) {
              hooks.viewportResize(...p);
          }
          viewportResizeCb(...p);
      };
      o.inputCb = (...p) => {
          if (hooks.input) {
              hooks.input(...p);
          }
          inputCb(...p);
      };
      o.mediaInteractionCb = (...p) => {
          if (hooks.mediaInteaction) {
              hooks.mediaInteaction(...p);
          }
          mediaInteractionCb(...p);
      };
      o.styleSheetRuleCb = (...p) => {
          if (hooks.styleSheetRule) {
              hooks.styleSheetRule(...p);
          }
          styleSheetRuleCb(...p);
      };
      o.canvasMutationCb = (...p) => {
          if (hooks.canvasMutation) {
              hooks.canvasMutation(...p);
          }
          canvasMutationCb(...p);
      };
      o.fontCb = (...p) => {
          if (hooks.font) {
              hooks.font(...p);
          }
          fontCb(...p);
      };
      o.logCb = (...p) => {
          if (hooks.log) {
              hooks.log(...p);
          }
          logCb(...p);
      };
  }
  function initObservers(o, hooks = {}) {
      mergeHooks(o, hooks);
      const mutationObserver = initMutationObserver(o.mutationCb, o.blockClass, o.blockSelector, o.inlineStylesheet, o.maskInputOptions, o.recordCanvas, o.slimDOMOptions);
      const mousemoveHandler = initMoveObserver(o.mousemoveCb, o.sampling);
      const mouseInteractionHandler = initMouseInteractionObserver(o.mouseInteractionCb, o.blockClass, o.sampling);
      const scrollHandler = initScrollObserver(o.scrollCb, o.blockClass, o.sampling);
      const viewportResizeHandler = initViewportResizeObserver(o.viewportResizeCb);
      const inputHandler = initInputObserver(o.inputCb, o.blockClass, o.ignoreClass, o.maskInputOptions, o.maskInputFn, o.sampling);
      const mediaInteractionHandler = initMediaInteractionObserver(o.mediaInteractionCb, o.blockClass);
      const styleSheetObserver = initStyleSheetObserver(o.styleSheetRuleCb);
      const canvasMutationObserver = o.recordCanvas
          ? initCanvasMutationObserver(o.canvasMutationCb, o.blockClass)
          : () => { };
      const fontObserver = o.collectFonts ? initFontObserver(o.fontCb) : () => { };
      const logObserver = o.logOptions
          ? initLogObserver(o.logCb, o.logOptions)
          : () => { };
      return () => {
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
      return Object.assign(Object.assign({}, e), { timestamp: Date.now() });
  }
  let wrappedEmit;
  function record(options = {}) {
      const { emit, checkoutEveryNms, checkoutEveryNth, blockClass = 'rr-block', blockSelector = null, ignoreClass = 'rr-ignore', inlineStylesheet = true, maskAllInputs, maskInputOptions: _maskInputOptions, slimDOMOptions: _slimDOMOptions, maskInputFn, hooks, packFn, sampling = {}, mousemoveWait, recordCanvas = false, collectFonts = false, recordLog = false, } = options;
      if (!emit) {
          throw new Error('emit function is required');
      }
      if (mousemoveWait !== undefined && sampling.mousemove === undefined) {
          sampling.mousemove = mousemoveWait;
      }
      const maskInputOptions = maskAllInputs === true
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
      const slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === 'all'
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
      const defaultLogOptions = {
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
      const logOptions = recordLog
          ? recordLog === true
              ? defaultLogOptions
              : Object.assign({}, defaultLogOptions, recordLog)
          : {};
      polyfill();
      let lastFullSnapshotEvent;
      let incrementalSnapshotCount = 0;
      wrappedEmit = (e, isCheckout) => {
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
              const exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
              const exceedTime = checkoutEveryNms &&
                  e.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
              if (exceedCount || exceedTime) {
                  takeFullSnapshot(true);
              }
          }
      };
      function takeFullSnapshot(isCheckout = false) {
          var _a, _b, _c, _d;
          wrappedEmit(wrapEvent({
              type: EventType.Meta,
              data: {
                  href: window.location.href,
                  width: getWindowWidth(),
                  height: getWindowHeight(),
              },
          }), isCheckout);
          let wasFrozen = mutationBuffer.isFrozen();
          mutationBuffer.freeze();
          const [node, idNodeMap] = snapshot(document, {
              blockClass,
              blockSelector,
              inlineStylesheet,
              maskAllInputs: maskInputOptions,
              slimDOM: slimDOMOptions,
              recordCanvas,
          });
          if (!node) {
              return console.warn('Failed to snapshot the document');
          }
          mirror.map = idNodeMap;
          wrappedEmit(wrapEvent({
              type: EventType.FullSnapshot,
              data: {
                  node,
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
          const handlers = [];
          handlers.push(on('DOMContentLoaded', () => {
              wrappedEmit(wrapEvent({
                  type: EventType.DomContentLoaded,
                  data: {},
              }));
          }));
          const init = () => {
              takeFullSnapshot();
              handlers.push(initObservers({
                  mutationCb: (m) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.Mutation }, m),
                  })),
                  mousemoveCb: (positions, source) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: {
                          source,
                          positions,
                      },
                  })),
                  mouseInteractionCb: (d) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.MouseInteraction }, d),
                  })),
                  scrollCb: (p) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.Scroll }, p),
                  })),
                  viewportResizeCb: (d) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.ViewportResize }, d),
                  })),
                  inputCb: (v) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.Input }, v),
                  })),
                  mediaInteractionCb: (p) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.MediaInteraction }, p),
                  })),
                  styleSheetRuleCb: (r) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.StyleSheetRule }, r),
                  })),
                  canvasMutationCb: (p) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.CanvasMutation }, p),
                  })),
                  fontCb: (p) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.Font }, p),
                  })),
                  logCb: (p) => wrappedEmit(wrapEvent({
                      type: EventType.IncrementalSnapshot,
                      data: Object.assign({ source: IncrementalSource.Log }, p),
                  })),
                  blockClass,
                  blockSelector,
                  ignoreClass,
                  maskInputOptions,
                  maskInputFn,
                  inlineStylesheet,
                  sampling,
                  recordCanvas,
                  collectFonts,
                  slimDOMOptions,
                  logOptions,
              }, hooks));
          };
          if (document.readyState === 'interactive' ||
              document.readyState === 'complete') {
              init();
          }
          else {
              handlers.push(on('load', () => {
                  wrappedEmit(wrapEvent({
                      type: EventType.Load,
                      data: {},
                  }));
                  init();
              }, window));
          }
          return () => {
              handlers.forEach((h) => h());
          };
      }
      catch (error) {
          console.warn(error);
      }
  }
  record.addCustomEvent = (tag, payload) => {
      if (!wrappedEmit) {
          throw new Error('please add custom event after start recording');
      }
      wrappedEmit(wrapEvent({
          type: EventType.Custom,
          data: {
              tag,
              payload,
          },
      }));
  };
  record.freezePage = () => {
      mutationBuffer.freeze();
  };

  return record;

}());
