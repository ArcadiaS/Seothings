var rrweb = (function (exports) {
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

  const commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
  function parse(css, options = {}) {
      let lineno = 1;
      let column = 1;
      function updatePosition(str) {
          const lines = str.match(/\n/g);
          if (lines) {
              lineno += lines.length;
          }
          let i = str.lastIndexOf('\n');
          column = i === -1 ? column + str.length : str.length - i;
      }
      function position() {
          const start = { line: lineno, column };
          return (node) => {
              node.position = new Position(start);
              whitespace();
              return node;
          };
      }
      class Position {
          constructor(start) {
              this.start = start;
              this.end = { line: lineno, column };
              this.source = options.source;
          }
      }
      Position.prototype.content = css;
      const errorsList = [];
      function error(msg) {
          const err = new Error(options.source + ':' + lineno + ':' + column + ': ' + msg);
          err.reason = msg;
          err.filename = options.source;
          err.line = lineno;
          err.column = column;
          err.source = css;
          if (options.silent) {
              errorsList.push(err);
          }
          else {
              throw err;
          }
      }
      function stylesheet() {
          const rulesList = rules();
          return {
              type: 'stylesheet',
              stylesheet: {
                  source: options.source,
                  rules: rulesList,
                  parsingErrors: errorsList,
              },
          };
      }
      function open() {
          return match(/^{\s*/);
      }
      function close() {
          return match(/^}/);
      }
      function rules() {
          let node;
          const rules = [];
          whitespace();
          comments(rules);
          while (css.length && css.charAt(0) !== '}' && (node = atrule() || rule())) {
              if (node !== false) {
                  rules.push(node);
                  comments(rules);
              }
          }
          return rules;
      }
      function match(re) {
          const m = re.exec(css);
          if (!m) {
              return;
          }
          const str = m[0];
          updatePosition(str);
          css = css.slice(str.length);
          return m;
      }
      function whitespace() {
          match(/^\s*/);
      }
      function comments(rules = []) {
          let c;
          while ((c = comment())) {
              if (c !== false) {
                  rules.push(c);
              }
              c = comment();
          }
          return rules;
      }
      function comment() {
          const pos = position();
          if ('/' !== css.charAt(0) || '*' !== css.charAt(1)) {
              return;
          }
          let i = 2;
          while ('' !== css.charAt(i) &&
              ('*' !== css.charAt(i) || '/' !== css.charAt(i + 1))) {
              ++i;
          }
          i += 2;
          if ('' === css.charAt(i - 1)) {
              return error('End of comment missing');
          }
          const str = css.slice(2, i - 2);
          column += 2;
          updatePosition(str);
          css = css.slice(i);
          column += 2;
          return pos({
              type: 'comment',
              comment: str,
          });
      }
      function selector() {
          const m = match(/^([^{]+)/);
          if (!m) {
              return;
          }
          return trim(m[0])
              .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
              .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, (m) => {
              return m.replace(/,/g, '\u200C');
          })
              .split(/\s*(?![^(]*\)),\s*/)
              .map((s) => {
              return s.replace(/\u200C/g, ',');
          });
      }
      function declaration() {
          const pos = position();
          let propMatch = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
          if (!propMatch) {
              return;
          }
          const prop = trim(propMatch[0]);
          if (!match(/^:\s*/)) {
              return error(`property missing ':'`);
          }
          const val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
          const ret = pos({
              type: 'declaration',
              property: prop.replace(commentre, ''),
              value: val ? trim(val[0]).replace(commentre, '') : '',
          });
          match(/^[;\s]*/);
          return ret;
      }
      function declarations() {
          const decls = [];
          if (!open()) {
              return error(`missing '{'`);
          }
          comments(decls);
          let decl;
          while ((decl = declaration())) {
              if (decl !== false) {
                  decls.push(decl);
                  comments(decls);
              }
              decl = declaration();
          }
          if (!close()) {
              return error(`missing '}'`);
          }
          return decls;
      }
      function keyframe() {
          let m;
          const vals = [];
          const pos = position();
          while ((m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/))) {
              vals.push(m[1]);
              match(/^,\s*/);
          }
          if (!vals.length) {
              return;
          }
          return pos({
              type: 'keyframe',
              values: vals,
              declarations: declarations(),
          });
      }
      function atkeyframes() {
          const pos = position();
          let m = match(/^@([-\w]+)?keyframes\s*/);
          if (!m) {
              return;
          }
          const vendor = m[1];
          m = match(/^([-\w]+)\s*/);
          if (!m) {
              return error('@keyframes missing name');
          }
          const name = m[1];
          if (!open()) {
              return error(`@keyframes missing '{'`);
          }
          let frame;
          let frames = comments();
          while ((frame = keyframe())) {
              frames.push(frame);
              frames = frames.concat(comments());
          }
          if (!close()) {
              return error(`@keyframes missing '}'`);
          }
          return pos({
              type: 'keyframes',
              name,
              vendor,
              keyframes: frames,
          });
      }
      function atsupports() {
          const pos = position();
          const m = match(/^@supports *([^{]+)/);
          if (!m) {
              return;
          }
          const supports = trim(m[1]);
          if (!open()) {
              return error(`@supports missing '{'`);
          }
          const style = comments().concat(rules());
          if (!close()) {
              return error(`@supports missing '}'`);
          }
          return pos({
              type: 'supports',
              supports,
              rules: style,
          });
      }
      function athost() {
          const pos = position();
          const m = match(/^@host\s*/);
          if (!m) {
              return;
          }
          if (!open()) {
              return error(`@host missing '{'`);
          }
          const style = comments().concat(rules());
          if (!close()) {
              return error(`@host missing '}'`);
          }
          return pos({
              type: 'host',
              rules: style,
          });
      }
      function atmedia() {
          const pos = position();
          const m = match(/^@media *([^{]+)/);
          if (!m) {
              return;
          }
          const media = trim(m[1]);
          if (!open()) {
              return error(`@media missing '{'`);
          }
          const style = comments().concat(rules());
          if (!close()) {
              return error(`@media missing '}'`);
          }
          return pos({
              type: 'media',
              media,
              rules: style,
          });
      }
      function atcustommedia() {
          const pos = position();
          const m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
          if (!m) {
              return;
          }
          return pos({
              type: 'custom-media',
              name: trim(m[1]),
              media: trim(m[2]),
          });
      }
      function atpage() {
          const pos = position();
          const m = match(/^@page */);
          if (!m) {
              return;
          }
          const sel = selector() || [];
          if (!open()) {
              return error(`@page missing '{'`);
          }
          let decls = comments();
          let decl;
          while ((decl = declaration())) {
              decls.push(decl);
              decls = decls.concat(comments());
          }
          if (!close()) {
              return error(`@page missing '}'`);
          }
          return pos({
              type: 'page',
              selectors: sel,
              declarations: decls,
          });
      }
      function atdocument() {
          const pos = position();
          const m = match(/^@([-\w]+)?document *([^{]+)/);
          if (!m) {
              return;
          }
          const vendor = trim(m[1]);
          const doc = trim(m[2]);
          if (!open()) {
              return error(`@document missing '{'`);
          }
          const style = comments().concat(rules());
          if (!close()) {
              return error(`@document missing '}'`);
          }
          return pos({
              type: 'document',
              document: doc,
              vendor,
              rules: style,
          });
      }
      function atfontface() {
          const pos = position();
          const m = match(/^@font-face\s*/);
          if (!m) {
              return;
          }
          if (!open()) {
              return error(`@font-face missing '{'`);
          }
          let decls = comments();
          let decl;
          while ((decl = declaration())) {
              decls.push(decl);
              decls = decls.concat(comments());
          }
          if (!close()) {
              return error(`@font-face missing '}'`);
          }
          return pos({
              type: 'font-face',
              declarations: decls,
          });
      }
      const atimport = _compileAtrule('import');
      const atcharset = _compileAtrule('charset');
      const atnamespace = _compileAtrule('namespace');
      function _compileAtrule(name) {
          const re = new RegExp('^@' + name + '\\s*([^;]+);');
          return () => {
              const pos = position();
              const m = match(re);
              if (!m) {
                  return;
              }
              const ret = { type: name };
              ret[name] = m[1].trim();
              return pos(ret);
          };
      }
      function atrule() {
          if (css[0] !== '@') {
              return;
          }
          return (atkeyframes() ||
              atmedia() ||
              atcustommedia() ||
              atsupports() ||
              atimport() ||
              atcharset() ||
              atnamespace() ||
              atdocument() ||
              atpage() ||
              athost() ||
              atfontface());
      }
      function rule() {
          const pos = position();
          const sel = selector();
          if (!sel) {
              return error('selector missing');
          }
          comments();
          return pos({
              type: 'rule',
              selectors: sel,
              declarations: declarations(),
          });
      }
      return addParent(stylesheet());
  }
  function trim(str) {
      return str ? str.replace(/^\s+|\s+$/g, '') : '';
  }
  function addParent(obj, parent) {
      const isNode = obj && typeof obj.type === 'string';
      const childParent = isNode ? obj : parent;
      for (const k of Object.keys(obj)) {
          const value = obj[k];
          if (Array.isArray(value)) {
              value.forEach((v) => {
                  addParent(v, childParent);
              });
          }
          else if (value && typeof value === 'object') {
              addParent(value, childParent);
          }
      }
      if (isNode) {
          Object.defineProperty(obj, 'parent', {
              configurable: true,
              writable: true,
              enumerable: false,
              value: parent || null,
          });
      }
      return obj;
  }

  const tagMap = {
      script: 'noscript',
      altglyph: 'altGlyph',
      altglyphdef: 'altGlyphDef',
      altglyphitem: 'altGlyphItem',
      animatecolor: 'animateColor',
      animatemotion: 'animateMotion',
      animatetransform: 'animateTransform',
      clippath: 'clipPath',
      feblend: 'feBlend',
      fecolormatrix: 'feColorMatrix',
      fecomponenttransfer: 'feComponentTransfer',
      fecomposite: 'feComposite',
      feconvolvematrix: 'feConvolveMatrix',
      fediffuselighting: 'feDiffuseLighting',
      fedisplacementmap: 'feDisplacementMap',
      fedistantlight: 'feDistantLight',
      fedropshadow: 'feDropShadow',
      feflood: 'feFlood',
      fefunca: 'feFuncA',
      fefuncb: 'feFuncB',
      fefuncg: 'feFuncG',
      fefuncr: 'feFuncR',
      fegaussianblur: 'feGaussianBlur',
      feimage: 'feImage',
      femerge: 'feMerge',
      femergenode: 'feMergeNode',
      femorphology: 'feMorphology',
      feoffset: 'feOffset',
      fepointlight: 'fePointLight',
      fespecularlighting: 'feSpecularLighting',
      fespotlight: 'feSpotLight',
      fetile: 'feTile',
      feturbulence: 'feTurbulence',
      foreignobject: 'foreignObject',
      glyphref: 'glyphRef',
      lineargradient: 'linearGradient',
      radialgradient: 'radialGradient',
  };
  function getTagName(n) {
      let tagName = tagMap[n.tagName] ? tagMap[n.tagName] : n.tagName;
      if (tagName === 'link' && n.attributes._cssText) {
          tagName = 'style';
      }
      return tagName;
  }
  const HOVER_SELECTOR = /([^\\]):hover/g;
  function addHoverClass(cssText) {
      const ast = parse(cssText, { silent: true });
      if (!ast.stylesheet) {
          return cssText;
      }
      ast.stylesheet.rules.forEach((rule) => {
          if ('selectors' in rule) {
              (rule.selectors || []).forEach((selector) => {
                  if (HOVER_SELECTOR.test(selector)) {
                      const newSelector = selector.replace(HOVER_SELECTOR, '$1.\\:hover');
                      cssText = cssText.replace(selector, `${selector}, ${newSelector}`);
                  }
              });
          }
      });
      return cssText;
  }
  function buildNode(n, options) {
      const { doc, hackCss } = options;
      switch (n.type) {
          case NodeType.Document:
              return doc.implementation.createDocument(null, '', null);
          case NodeType.DocumentType:
              return doc.implementation.createDocumentType(n.name || 'html', n.publicId, n.systemId);
          case NodeType.Element:
              const tagName = getTagName(n);
              let node;
              if (n.isSVG) {
                  node = doc.createElementNS('http://www.w3.org/2000/svg', tagName);
              }
              else {
                  node = doc.createElement(tagName);
              }
              for (const name in n.attributes) {
                  if (!n.attributes.hasOwnProperty(name)) {
                      continue;
                  }
                  let value = n.attributes[name];
                  value =
                      typeof value === 'boolean' || typeof value === 'number' ? '' : value;
                  if (!name.startsWith('rr_')) {
                      const isTextarea = tagName === 'textarea' && name === 'value';
                      const isRemoteOrDynamicCss = tagName === 'style' && name === '_cssText';
                      if (isRemoteOrDynamicCss && hackCss) {
                          value = addHoverClass(value);
                      }
                      if (isTextarea || isRemoteOrDynamicCss) {
                          const child = doc.createTextNode(value);
                          for (const c of Array.from(node.childNodes)) {
                              if (c.nodeType === node.TEXT_NODE) {
                                  node.removeChild(c);
                              }
                          }
                          node.appendChild(child);
                          continue;
                      }
                      if (tagName === 'iframe' && name === 'src') {
                          continue;
                      }
                      try {
                          if (n.isSVG && name === 'xlink:href') {
                              node.setAttributeNS('http://www.w3.org/1999/xlink', name, value);
                          }
                          else if (name === 'onload' ||
                              name === 'onclick' ||
                              name.substring(0, 7) === 'onmouse') {
                              node.setAttribute('_' + name, value);
                          }
                          else {
                              node.setAttribute(name, value);
                          }
                      }
                      catch (error) {
                      }
                  }
                  else {
                      if (tagName === 'canvas' && name === 'rr_dataURL') {
                          const image = document.createElement('img');
                          image.src = value;
                          image.onload = () => {
                              const ctx = node.getContext('2d');
                              if (ctx) {
                                  ctx.drawImage(image, 0, 0, image.width, image.height);
                              }
                          };
                      }
                      if (name === 'rr_width') {
                          node.style.width = value;
                      }
                      if (name === 'rr_height') {
                          node.style.height = value;
                      }
                      if (name === 'rr_mediaState') {
                          switch (value) {
                              case 'played':
                                  node.play();
                              case 'paused':
                                  node.pause();
                                  break;
                          }
                      }
                  }
              }
              return node;
          case NodeType.Text:
              return doc.createTextNode(n.isStyle && hackCss ? addHoverClass(n.textContent) : n.textContent);
          case NodeType.CDATA:
              return doc.createCDATASection(n.textContent);
          case NodeType.Comment:
              return doc.createComment(n.textContent);
          default:
              return null;
      }
  }
  function buildNodeWithSN(n, options) {
      const { doc, map, skipChild = false, hackCss = true } = options;
      let node = buildNode(n, { doc, hackCss });
      if (!node) {
          return null;
      }
      if (n.type === NodeType.Document) {
          doc.close();
          doc.open();
          node = doc;
      }
      node.__sn = n;
      map[n.id] = node;
      if ((n.type === NodeType.Document || n.type === NodeType.Element) &&
          !skipChild) {
          for (const childN of n.childNodes) {
              const childNode = buildNodeWithSN(childN, {
                  doc,
                  map,
                  skipChild: false,
                  hackCss,
              });
              if (!childNode) {
                  console.warn('Failed to rebuild', childN);
              }
              else {
                  node.appendChild(childNode);
              }
          }
      }
      return node;
  }
  function visit(idNodeMap, onVisit) {
      function walk(node) {
          onVisit(node);
      }
      for (const key in idNodeMap) {
          if (idNodeMap[key]) {
              walk(idNodeMap[key]);
          }
      }
  }
  function handleScroll(node) {
      const n = node.__sn;
      if (n.type !== NodeType.Element) {
          return;
      }
      const el = node;
      for (const name in n.attributes) {
          if (!(n.attributes.hasOwnProperty(name) && name.startsWith('rr_'))) {
              continue;
          }
          const value = n.attributes[name];
          if (name === 'rr_scrollLeft') {
              el.scrollLeft = value;
          }
          if (name === 'rr_scrollTop') {
              el.scrollTop = value;
          }
      }
  }
  function rebuild(n, options) {
      const { doc, onVisit, hackCss = true } = options;
      const idNodeMap = {};
      const node = buildNodeWithSN(n, {
          doc,
          map: idNodeMap,
          skipChild: false,
          hackCss,
      });
      visit(idNodeMap, (visitedNode) => {
          if (onVisit) {
              onVisit(visitedNode);
          }
          handleScroll(visitedNode);
      });
      return [node, idNodeMap];
  }

  (function (EventType) {
      EventType[EventType["DomContentLoaded"] = 0] = "DomContentLoaded";
      EventType[EventType["Load"] = 1] = "Load";
      EventType[EventType["FullSnapshot"] = 2] = "FullSnapshot";
      EventType[EventType["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
      EventType[EventType["Meta"] = 4] = "Meta";
      EventType[EventType["Custom"] = 5] = "Custom";
  })(exports.EventType || (exports.EventType = {}));
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
  })(exports.IncrementalSource || (exports.IncrementalSource = {}));
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
  })(exports.MouseInteractions || (exports.MouseInteractions = {}));
  var MediaInteractions;
  (function (MediaInteractions) {
      MediaInteractions[MediaInteractions["Play"] = 0] = "Play";
      MediaInteractions[MediaInteractions["Pause"] = 1] = "Pause";
  })(MediaInteractions || (MediaInteractions = {}));
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
  })(exports.ReplayerEvents || (exports.ReplayerEvents = {}));

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
  function needCastInSyncMode(event) {
      switch (event.type) {
          case exports.EventType.DomContentLoaded:
          case exports.EventType.Load:
          case exports.EventType.Custom:
              return false;
          case exports.EventType.FullSnapshot:
          case exports.EventType.Meta:
              return true;
      }
      switch (event.data.source) {
          case exports.IncrementalSource.MouseMove:
          case exports.IncrementalSource.MouseInteraction:
          case exports.IncrementalSource.TouchMove:
          case exports.IncrementalSource.MediaInteraction:
              return false;
          case exports.IncrementalSource.ViewportResize:
          case exports.IncrementalSource.StyleSheetRule:
          case exports.IncrementalSource.Scroll:
          case exports.IncrementalSource.Input:
              return true;
      }
      return true;
  }
  class TreeIndex {
      constructor() {
          this.reset();
      }
      add(mutation) {
          const parentTreeNode = this.indexes.get(mutation.parentId);
          const treeNode = {
              id: mutation.node.id,
              mutation,
              children: [],
              texts: [],
              attributes: [],
          };
          if (!parentTreeNode) {
              this.tree[treeNode.id] = treeNode;
          }
          else {
              treeNode.parent = parentTreeNode;
              parentTreeNode.children[treeNode.id] = treeNode;
          }
          this.indexes.set(treeNode.id, treeNode);
      }
      remove(mutation) {
          const parentTreeNode = this.indexes.get(mutation.parentId);
          const treeNode = this.indexes.get(mutation.id);
          const deepRemoveFromMirror = (id) => {
              this.removeIdSet.add(id);
              const node = mirror.getNode(id);
              node === null || node === void 0 ? void 0 : node.childNodes.forEach((childNode) => {
                  if ('__sn' in childNode) {
                      deepRemoveFromMirror(childNode.__sn.id);
                  }
              });
          };
          const deepRemoveFromTreeIndex = (node) => {
              this.removeIdSet.add(node.id);
              Object.values(node.children).forEach((n) => deepRemoveFromTreeIndex(n));
              const _treeNode = this.indexes.get(node.id);
              if (_treeNode) {
                  const _parentTreeNode = _treeNode.parent;
                  if (_parentTreeNode) {
                      delete _treeNode.parent;
                      delete _parentTreeNode.children[_treeNode.id];
                      this.indexes.delete(mutation.id);
                  }
              }
          };
          if (!treeNode) {
              this.removeNodeMutations.push(mutation);
              deepRemoveFromMirror(mutation.id);
          }
          else if (!parentTreeNode) {
              delete this.tree[treeNode.id];
              this.indexes.delete(treeNode.id);
              deepRemoveFromTreeIndex(treeNode);
          }
          else {
              delete treeNode.parent;
              delete parentTreeNode.children[treeNode.id];
              this.indexes.delete(mutation.id);
              deepRemoveFromTreeIndex(treeNode);
          }
      }
      text(mutation) {
          const treeNode = this.indexes.get(mutation.id);
          if (treeNode) {
              treeNode.texts.push(mutation);
          }
          else {
              this.textMutations.push(mutation);
          }
      }
      attribute(mutation) {
          const treeNode = this.indexes.get(mutation.id);
          if (treeNode) {
              treeNode.attributes.push(mutation);
          }
          else {
              this.attributeMutations.push(mutation);
          }
      }
      scroll(d) {
          this.scrollMap.set(d.id, d);
      }
      input(d) {
          this.inputMap.set(d.id, d);
      }
      flush() {
          const { tree, removeNodeMutations, textMutations, attributeMutations, } = this;
          const batchMutationData = {
              source: exports.IncrementalSource.Mutation,
              removes: removeNodeMutations,
              texts: textMutations,
              attributes: attributeMutations,
              adds: [],
          };
          const walk = (treeNode, removed) => {
              if (removed) {
                  this.removeIdSet.add(treeNode.id);
              }
              batchMutationData.texts = batchMutationData.texts
                  .concat(removed ? [] : treeNode.texts)
                  .filter((m) => !this.removeIdSet.has(m.id));
              batchMutationData.attributes = batchMutationData.attributes
                  .concat(removed ? [] : treeNode.attributes)
                  .filter((m) => !this.removeIdSet.has(m.id));
              if (!this.removeIdSet.has(treeNode.id) &&
                  !this.removeIdSet.has(treeNode.mutation.parentId) &&
                  !removed) {
                  batchMutationData.adds.push(treeNode.mutation);
                  if (treeNode.children) {
                      Object.values(treeNode.children).forEach((n) => walk(n, false));
                  }
              }
              else {
                  Object.values(treeNode.children).forEach((n) => walk(n, true));
              }
          };
          Object.values(tree).forEach((n) => walk(n, false));
          for (const id of this.scrollMap.keys()) {
              if (this.removeIdSet.has(id)) {
                  this.scrollMap.delete(id);
              }
          }
          for (const id of this.inputMap.keys()) {
              if (this.removeIdSet.has(id)) {
                  this.inputMap.delete(id);
              }
          }
          const scrollMap = new Map(this.scrollMap);
          const inputMap = new Map(this.inputMap);
          this.reset();
          return {
              mutationData: batchMutationData,
              scrollMap,
              inputMap,
          };
      }
      reset() {
          this.tree = [];
          this.indexes = new Map();
          this.removeNodeMutations = [];
          this.textMutations = [];
          this.attributeMutations = [];
          this.removeIdSet = new Set();
          this.scrollMap = new Map();
          this.inputMap = new Map();
      }
  }
  function queueToResolveTrees(queue) {
      const queueNodeMap = {};
      const putIntoMap = (m, parent) => {
          const nodeInTree = {
              value: m,
              parent,
              children: [],
          };
          queueNodeMap[m.node.id] = nodeInTree;
          return nodeInTree;
      };
      const queueNodeTrees = [];
      for (const mutation of queue) {
          const { nextId, parentId } = mutation;
          if (nextId && nextId in queueNodeMap) {
              const nextInTree = queueNodeMap[nextId];
              if (nextInTree.parent) {
                  const idx = nextInTree.parent.children.indexOf(nextInTree);
                  nextInTree.parent.children.splice(idx, 0, putIntoMap(mutation, nextInTree.parent));
              }
              else {
                  const idx = queueNodeTrees.indexOf(nextInTree);
                  queueNodeTrees.splice(idx, 0, putIntoMap(mutation, null));
              }
              continue;
          }
          if (parentId in queueNodeMap) {
              const parentInTree = queueNodeMap[parentId];
              parentInTree.children.push(putIntoMap(mutation, parentInTree));
              continue;
          }
          queueNodeTrees.push(putIntoMap(mutation, null));
      }
      return queueNodeTrees;
  }
  function iterateResolveTree(tree, cb) {
      cb(tree.value);
      for (let i = tree.children.length - 1; i >= 0; i--) {
          iterateResolveTree(tree.children[i], cb);
      }
  }

  var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    on: on,
    mirror: mirror,
    throttle: throttle,
    hookSetter: hookSetter,
    patch: patch,
    getWindowHeight: getWindowHeight,
    getWindowWidth: getWindowWidth,
    isBlocked: isBlocked,
    isIgnored: isIgnored,
    isAncestorRemoved: isAncestorRemoved,
    isTouchEvent: isTouchEvent,
    polyfill: polyfill,
    needCastInSyncMode: needCastInSyncMode,
    TreeIndex: TreeIndex,
    queueToResolveTrees: queueToResolveTrees,
    iterateResolveTree: iterateResolveTree
  });

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
          }), isTouch ? exports.IncrementalSource.TouchMove : exports.IncrementalSource.MouseMove);
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
                  type: exports.MouseInteractions[eventKey],
                  id,
                  x: clientX,
                  y: clientY,
              });
          };
      };
      Object.keys(exports.MouseInteractions)
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
              e.type !== exports.EventType.FullSnapshot &&
              !(e.type === exports.EventType.IncrementalSnapshot &&
                  e.data.source === exports.IncrementalSource.Mutation)) {
              mutationBuffer.emit();
              mutationBuffer.unfreeze();
          }
          emit((packFn ? packFn(e) : e), isCheckout);
          if (e.type === exports.EventType.FullSnapshot) {
              lastFullSnapshotEvent = e;
              incrementalSnapshotCount = 0;
          }
          else if (e.type === exports.EventType.IncrementalSnapshot) {
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
              type: exports.EventType.Meta,
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
              type: exports.EventType.FullSnapshot,
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
                  type: exports.EventType.DomContentLoaded,
                  data: {},
              }));
          }));
          const init = () => {
              takeFullSnapshot();
              handlers.push(initObservers({
                  mutationCb: (m) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.Mutation }, m),
                  })),
                  mousemoveCb: (positions, source) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: {
                          source,
                          positions,
                      },
                  })),
                  mouseInteractionCb: (d) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.MouseInteraction }, d),
                  })),
                  scrollCb: (p) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.Scroll }, p),
                  })),
                  viewportResizeCb: (d) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.ViewportResize }, d),
                  })),
                  inputCb: (v) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.Input }, v),
                  })),
                  mediaInteractionCb: (p) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.MediaInteraction }, p),
                  })),
                  styleSheetRuleCb: (r) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.StyleSheetRule }, r),
                  })),
                  canvasMutationCb: (p) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.CanvasMutation }, p),
                  })),
                  fontCb: (p) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.Font }, p),
                  })),
                  logCb: (p) => wrappedEmit(wrapEvent({
                      type: exports.EventType.IncrementalSnapshot,
                      data: Object.assign({ source: exports.IncrementalSource.Log }, p),
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
                      type: exports.EventType.Load,
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
          type: exports.EventType.Custom,
          data: {
              tag,
              payload,
          },
      }));
  };
  record.freezePage = () => {
      mutationBuffer.freeze();
  };

  //      
  // An event handler can take an optional event argument
  // and should not return a value
                                            
                                                                 

  // An array of all currently registered event handlers for a type
                                              
                                                              
  // A map of event types and their corresponding event handlers.
                          
                                   
                                     
    

  /** Mitt: Tiny (~200b) functional event emitter / pubsub.
   *  @name mitt
   *  @returns {Mitt}
   */
  function mitt(all                 ) {
  	all = all || Object.create(null);

  	return {
  		/**
  		 * Register an event handler for the given type.
  		 *
  		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
  		 * @param  {Function} handler Function to call in response to given event
  		 * @memberOf mitt
  		 */
  		on: function on(type        , handler              ) {
  			(all[type] || (all[type] = [])).push(handler);
  		},

  		/**
  		 * Remove an event handler for the given type.
  		 *
  		 * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
  		 * @param  {Function} handler Handler function to remove
  		 * @memberOf mitt
  		 */
  		off: function off(type        , handler              ) {
  			if (all[type]) {
  				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
  			}
  		},

  		/**
  		 * Invoke all handlers for the given type.
  		 * If present, `"*"` handlers are invoked after type-matched handlers.
  		 *
  		 * @param {String} type  The event type to invoke
  		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
  		 * @memberOf mitt
  		 */
  		emit: function emit(type        , evt     ) {
  			(all[type] || []).slice().map(function (handler) { handler(evt); });
  			(all['*'] || []).slice().map(function (handler) { handler(type, evt); });
  		}
  	};
  }

  var mittProxy = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': mitt
  });

  function polyfill$1(w = window, d = document) {
      if ('scrollBehavior' in d.documentElement.style &&
          w.__forceSmoothScrollPolyfill__ !== true) {
          return;
      }
      var Element = w.HTMLElement || w.Element;
      var SCROLL_TIME = 468;
      var original = {
          scroll: w.scroll || w.scrollTo,
          scrollBy: w.scrollBy,
          elementScroll: Element.prototype.scroll || scrollElement,
          scrollIntoView: Element.prototype.scrollIntoView,
      };
      var now = w.performance && w.performance.now
          ? w.performance.now.bind(w.performance)
          : Date.now;
      function isMicrosoftBrowser(userAgent) {
          var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];
          return new RegExp(userAgentPatterns.join('|')).test(userAgent);
      }
      var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;
      function scrollElement(x, y) {
          this.scrollLeft = x;
          this.scrollTop = y;
      }
      function ease(k) {
          return 0.5 * (1 - Math.cos(Math.PI * k));
      }
      function shouldBailOut(firstArg) {
          if (firstArg === null ||
              typeof firstArg !== 'object' ||
              firstArg.behavior === undefined ||
              firstArg.behavior === 'auto' ||
              firstArg.behavior === 'instant') {
              return true;
          }
          if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
              return false;
          }
          throw new TypeError('behavior member of ScrollOptions ' +
              firstArg.behavior +
              ' is not a valid value for enumeration ScrollBehavior.');
      }
      function hasScrollableSpace(el, axis) {
          if (axis === 'Y') {
              return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
          }
          if (axis === 'X') {
              return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
          }
      }
      function canOverflow(el, axis) {
          var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];
          return overflowValue === 'auto' || overflowValue === 'scroll';
      }
      function isScrollable(el) {
          var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
          var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');
          return isScrollableY || isScrollableX;
      }
      function findScrollableParent(el) {
          while (el !== d.body && isScrollable(el) === false) {
              el = el.parentNode || el.host;
          }
          return el;
      }
      function step(context) {
          var time = now();
          var value;
          var currentX;
          var currentY;
          var elapsed = (time - context.startTime) / SCROLL_TIME;
          elapsed = elapsed > 1 ? 1 : elapsed;
          value = ease(elapsed);
          currentX = context.startX + (context.x - context.startX) * value;
          currentY = context.startY + (context.y - context.startY) * value;
          context.method.call(context.scrollable, currentX, currentY);
          if (currentX !== context.x || currentY !== context.y) {
              w.requestAnimationFrame(step.bind(w, context));
          }
      }
      function smoothScroll(el, x, y) {
          var scrollable;
          var startX;
          var startY;
          var method;
          var startTime = now();
          if (el === d.body) {
              scrollable = w;
              startX = w.scrollX || w.pageXOffset;
              startY = w.scrollY || w.pageYOffset;
              method = original.scroll;
          }
          else {
              scrollable = el;
              startX = el.scrollLeft;
              startY = el.scrollTop;
              method = scrollElement;
          }
          step({
              scrollable: scrollable,
              method: method,
              startTime: startTime,
              startX: startX,
              startY: startY,
              x: x,
              y: y,
          });
      }
      w.scroll = w.scrollTo = function () {
          if (arguments[0] === undefined) {
              return;
          }
          if (shouldBailOut(arguments[0]) === true) {
              original.scroll.call(w, arguments[0].left !== undefined
                  ? arguments[0].left
                  : typeof arguments[0] !== 'object'
                      ? arguments[0]
                      : w.scrollX || w.pageXOffset, arguments[0].top !== undefined
                  ? arguments[0].top
                  : arguments[1] !== undefined
                      ? arguments[1]
                      : w.scrollY || w.pageYOffset);
              return;
          }
          smoothScroll.call(w, d.body, arguments[0].left !== undefined
              ? ~~arguments[0].left
              : w.scrollX || w.pageXOffset, arguments[0].top !== undefined
              ? ~~arguments[0].top
              : w.scrollY || w.pageYOffset);
      };
      w.scrollBy = function () {
          if (arguments[0] === undefined) {
              return;
          }
          if (shouldBailOut(arguments[0])) {
              original.scrollBy.call(w, arguments[0].left !== undefined
                  ? arguments[0].left
                  : typeof arguments[0] !== 'object'
                      ? arguments[0]
                      : 0, arguments[0].top !== undefined
                  ? arguments[0].top
                  : arguments[1] !== undefined
                      ? arguments[1]
                      : 0);
              return;
          }
          smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
      };
      Element.prototype.scroll = Element.prototype.scrollTo = function () {
          if (arguments[0] === undefined) {
              return;
          }
          if (shouldBailOut(arguments[0]) === true) {
              if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
                  throw new SyntaxError('Value could not be converted');
              }
              original.elementScroll.call(this, arguments[0].left !== undefined
                  ? ~~arguments[0].left
                  : typeof arguments[0] !== 'object'
                      ? ~~arguments[0]
                      : this.scrollLeft, arguments[0].top !== undefined
                  ? ~~arguments[0].top
                  : arguments[1] !== undefined
                      ? ~~arguments[1]
                      : this.scrollTop);
              return;
          }
          var left = arguments[0].left;
          var top = arguments[0].top;
          smoothScroll.call(this, this, typeof left === 'undefined' ? this.scrollLeft : ~~left, typeof top === 'undefined' ? this.scrollTop : ~~top);
      };
      Element.prototype.scrollBy = function () {
          if (arguments[0] === undefined) {
              return;
          }
          if (shouldBailOut(arguments[0]) === true) {
              original.elementScroll.call(this, arguments[0].left !== undefined
                  ? ~~arguments[0].left + this.scrollLeft
                  : ~~arguments[0] + this.scrollLeft, arguments[0].top !== undefined
                  ? ~~arguments[0].top + this.scrollTop
                  : ~~arguments[1] + this.scrollTop);
              return;
          }
          this.scroll({
              left: ~~arguments[0].left + this.scrollLeft,
              top: ~~arguments[0].top + this.scrollTop,
              behavior: arguments[0].behavior,
          });
      };
      Element.prototype.scrollIntoView = function () {
          if (shouldBailOut(arguments[0]) === true) {
              original.scrollIntoView.call(this, arguments[0] === undefined ? true : arguments[0]);
              return;
          }
          var scrollableParent = findScrollableParent(this);
          var parentRects = scrollableParent.getBoundingClientRect();
          var clientRects = this.getBoundingClientRect();
          if (scrollableParent !== d.body) {
              smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top);
              if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
                  w.scrollBy({
                      left: parentRects.left,
                      top: parentRects.top,
                      behavior: 'smooth',
                  });
              }
          }
          else {
              w.scrollBy({
                  left: clientRects.left,
                  top: clientRects.top,
                  behavior: 'smooth',
              });
          }
      };
  }

  class Timer {
      constructor(actions = [], speed) {
          this.timeOffset = 0;
          this.raf = null;
          this.actions = actions;
          this.speed = speed;
      }
      addAction(action) {
          const index = this.findActionIndex(action);
          this.actions.splice(index, 0, action);
      }
      addActions(actions) {
          this.actions.push(...actions);
      }
      start() {
          this.actions.sort((a1, a2) => a1.delay - a2.delay);
          this.timeOffset = 0;
          let lastTimestamp = performance.now();
          const { actions } = this;
          const self = this;
          function check() {
              const time = performance.now();
              self.timeOffset += (time - lastTimestamp) * self.speed;
              lastTimestamp = time;
              while (actions.length) {
                  const action = actions[0];
                  if (self.timeOffset >= action.delay) {
                      actions.shift();
                      action.doAction();
                  }
                  else {
                      break;
                  }
              }
              if (actions.length > 0 || self.liveMode) {
                  self.raf = requestAnimationFrame(check);
              }
          }
          this.raf = requestAnimationFrame(check);
      }
      clear() {
          if (this.raf) {
              cancelAnimationFrame(this.raf);
              this.raf = null;
          }
          this.actions.length = 0;
      }
      setSpeed(speed) {
          this.speed = speed;
      }
      toggleLiveMode(mode) {
          this.liveMode = mode;
      }
      isActive() {
          return this.raf !== null;
      }
      findActionIndex(action) {
          let start = 0;
          let end = this.actions.length - 1;
          while (start <= end) {
              let mid = Math.floor((start + end) / 2);
              if (this.actions[mid].delay < action.delay) {
                  start = mid + 1;
              }
              else if (this.actions[mid].delay > action.delay) {
                  end = mid - 1;
              }
              else {
                  return mid;
              }
          }
          return start;
      }
  }
  function addDelay(event, baselineTime) {
      if (event.type === exports.EventType.IncrementalSnapshot &&
          event.data.source === exports.IncrementalSource.MouseMove) {
          const firstOffset = event.data.positions[0].timeOffset;
          const firstTimestamp = event.timestamp + firstOffset;
          event.delay = firstTimestamp - baselineTime;
          return firstTimestamp - baselineTime;
      }
      event.delay = event.timestamp - baselineTime;
      return event.delay;
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  function t(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value);}catch(t){o={error:t};}finally{try{r&&!r.done&&(e=i.return)&&e.call(i);}finally{if(o)throw o.error}}return a}var n;!function(t){t[t.NotStarted=0]="NotStarted",t[t.Running=1]="Running",t[t.Stopped=2]="Stopped";}(n||(n={}));var e={type:"xstate.init"};function r(t){return void 0===t?[]:[].concat(t)}function o(t){return {type:"xstate.assign",assignment:t}}function i(t,n){return "string"==typeof(t="string"==typeof t&&n&&n[t]?n[t]:t)?{type:t}:"function"==typeof t?{type:t.name,exec:t}:t}function a(t){return function(n){return t===n}}function u(t){return "string"==typeof t?{type:t}:t}function c(t,n){return {value:t,context:n,actions:[],changed:!1,matches:a(t)}}function f(t,n,e){var r=n,o=!1;return [t.filter((function(t){if("xstate.assign"===t.type){o=!0;var n=Object.assign({},r);return "function"==typeof t.assignment?n=t.assignment(r,e):Object.keys(t.assignment).forEach((function(o){n[o]="function"==typeof t.assignment[o]?t.assignment[o](r,e):t.assignment[o];})),r=n,!1}return !0})),r,o]}function s(n,o){void 0===o&&(o={});var s=t(f(r(n.states[n.initial].entry).map((function(t){return i(t,o.actions)})),n.context,e),2),l=s[0],v=s[1],y={config:n,_options:o,initialState:{value:n.initial,actions:l,context:v,matches:a(n.initial)},transition:function(e,o){var s,l,v="string"==typeof e?{value:e,context:n.context}:e,p=v.value,g=v.context,d=u(o),x=n.states[p];if(x.on){var m=r(x.on[d.type]);try{for(var h=function(t){var n="function"==typeof Symbol&&t[Symbol.iterator],e=0;return n?n.call(t):{next:function(){return t&&e>=t.length&&(t=void 0),{value:t&&t[e++],done:!t}}}}(m),S=h.next();!S.done;S=h.next()){var b=S.value;if(void 0===b)return c(p,g);var R="string"==typeof b?{target:b}:b,j=R.target,w=void 0===j?p:j,E=R.actions,N=void 0===E?[]:E,_=R.cond;if((void 0===_?function(){return !0}:_)(g,d)){var O=n.states[w],k=t(f([].concat(x.exit,N,O.entry).filter((function(t){return t})).map((function(t){return i(t,y._options.actions)})),g,d),3),q=k[0],z=k[1],A=k[2];return {value:w,context:z,actions:q,changed:w!==p||q.length>0||A,matches:a(w)}}}}catch(t){s={error:t};}finally{try{S&&!S.done&&(l=h.return)&&l.call(h);}finally{if(s)throw s.error}}}return c(p,g)}};return y}var l=function(t,n){return t.actions.forEach((function(e){var r=e.exec;return r&&r(t.context,n)}))};function v(t){var r=t.initialState,o=n.NotStarted,i=new Set,c={_machine:t,send:function(e){o===n.Running&&(r=t.transition(r,e),l(r,u(e)),i.forEach((function(t){return t(r)})));},subscribe:function(t){return i.add(t),t(r),{unsubscribe:function(){return i.delete(t)}}},start:function(i){if(i){var u="object"==typeof i?i:{context:t.config.context,value:i};r={value:u.value,actions:[],context:u.context,matches:a(u.value)};}return o=n.Running,l(r,e),c},stop:function(){return o=n.Stopped,i.clear(),c},get state(){return r},get status(){return o}};return c}

  function discardPriorSnapshots(events, baselineTime) {
      for (let idx = events.length - 1; idx >= 0; idx--) {
          const event = events[idx];
          if (event.type === exports.EventType.Meta) {
              if (event.timestamp <= baselineTime) {
                  return events.slice(idx);
              }
          }
      }
      return events;
  }
  function createPlayerService(context, { getCastFn, emitter }) {
      const playerMachine = s({
          id: 'player',
          context,
          initial: 'paused',
          states: {
              playing: {
                  on: {
                      PAUSE: {
                          target: 'paused',
                          actions: ['pause'],
                      },
                      CAST_EVENT: {
                          target: 'playing',
                          actions: 'castEvent',
                      },
                      END: {
                          target: 'paused',
                          actions: ['resetLastPlayedEvent', 'pause'],
                      },
                      ADD_EVENT: {
                          target: 'playing',
                          actions: ['addEvent'],
                      },
                  },
              },
              paused: {
                  on: {
                      PLAY: {
                          target: 'playing',
                          actions: ['recordTimeOffset', 'play'],
                      },
                      CAST_EVENT: {
                          target: 'paused',
                          actions: 'castEvent',
                      },
                      TO_LIVE: {
                          target: 'live',
                          actions: ['startLive'],
                      },
                      ADD_EVENT: {
                          target: 'paused',
                          actions: ['addEvent'],
                      },
                  },
              },
              live: {
                  on: {
                      ADD_EVENT: {
                          target: 'live',
                          actions: ['addEvent'],
                      },
                      CAST_EVENT: {
                          target: 'live',
                          actions: ['castEvent'],
                      },
                  },
              },
          },
      }, {
          actions: {
              castEvent: o({
                  lastPlayedEvent: (ctx, event) => {
                      if (event.type === 'CAST_EVENT') {
                          return event.payload.event;
                      }
                      return ctx.lastPlayedEvent;
                  },
              }),
              recordTimeOffset: o((ctx, event) => {
                  let timeOffset = ctx.timeOffset;
                  if ('payload' in event && 'timeOffset' in event.payload) {
                      timeOffset = event.payload.timeOffset;
                  }
                  return Object.assign(Object.assign({}, ctx), { timeOffset, baselineTime: ctx.events[0].timestamp + timeOffset });
              }),
              play(ctx) {
                  var _a;
                  console.warn('play');
                  const { timer, events, baselineTime, lastPlayedEvent } = ctx;
                  timer.clear();
                  for (const event of events) {
                      addDelay(event, baselineTime);
                  }
                  const neededEvents = discardPriorSnapshots(events, baselineTime);
                  const actions = new Array();
                  for (const event of neededEvents) {
                      let lastPlayedTimestamp = lastPlayedEvent === null || lastPlayedEvent === void 0 ? void 0 : lastPlayedEvent.timestamp;
                      if ((lastPlayedEvent === null || lastPlayedEvent === void 0 ? void 0 : lastPlayedEvent.type) === exports.EventType.IncrementalSnapshot &&
                          lastPlayedEvent.data.source === exports.IncrementalSource.MouseMove) {
                          lastPlayedTimestamp =
                              lastPlayedEvent.timestamp + ((_a = lastPlayedEvent.data.positions[0]) === null || _a === void 0 ? void 0 : _a.timeOffset);
                      }
                      if (lastPlayedTimestamp &&
                          lastPlayedTimestamp < baselineTime &&
                          (event.timestamp <= lastPlayedTimestamp ||
                              event === lastPlayedEvent)) {
                          continue;
                      }
                      const isSync = event.timestamp < baselineTime;
                      if (isSync && !needCastInSyncMode(event)) {
                          continue;
                      }
                      const castFn = getCastFn(event, isSync);
                      if (isSync) {
                          castFn();
                      }
                      else {
                          actions.push({
                              doAction: () => {
                                  castFn();
                                  emitter.emit(exports.ReplayerEvents.EventCast, event);
                              },
                              delay: event.delay,
                          });
                      }
                  }
                  emitter.emit(exports.ReplayerEvents.Flush);
                  timer.addActions(actions);
                  timer.start();
              },
              pause(ctx) {
                  ctx.timer.clear();
              },
              resetLastPlayedEvent: o((ctx) => {
                  return Object.assign(Object.assign({}, ctx), { lastPlayedEvent: null });
              }),
              startLive: o({
                  baselineTime: (ctx, event) => {
                      ctx.timer.toggleLiveMode(true);
                      ctx.timer.start();
                      if (event.type === 'TO_LIVE' && event.payload.baselineTime) {
                          return event.payload.baselineTime;
                      }
                      return Date.now();
                  },
              }),
              addEvent: o((ctx, machineEvent) => {
                  const { baselineTime, timer, events } = ctx;
                  if (machineEvent.type === 'ADD_EVENT') {
                      const { event } = machineEvent.payload;
                      addDelay(event, baselineTime);
                      events.push(event);
                      const isSync = event.timestamp < baselineTime;
                      const castFn = getCastFn(event, isSync);
                      if (isSync) {
                          castFn();
                      }
                      else {
                          timer.addAction({
                              doAction: () => {
                                  castFn();
                                  emitter.emit(exports.ReplayerEvents.EventCast, event);
                              },
                              delay: event.delay,
                          });
                          if (!timer.isActive()) {
                              timer.start();
                          }
                      }
                  }
                  return Object.assign(Object.assign({}, ctx), { events });
              }),
          },
      });
      return v(playerMachine);
  }
  function createSpeedService(context) {
      const speedMachine = s({
          id: 'speed',
          context,
          initial: 'normal',
          states: {
              normal: {
                  on: {
                      FAST_FORWARD: {
                          target: 'skipping',
                          actions: ['recordSpeed', 'setSpeed'],
                      },
                      SET_SPEED: {
                          target: 'normal',
                          actions: ['setSpeed'],
                      },
                  },
              },
              skipping: {
                  on: {
                      BACK_TO_NORMAL: {
                          target: 'normal',
                          actions: ['restoreSpeed'],
                      },
                      SET_SPEED: {
                          target: 'normal',
                          actions: ['setSpeed'],
                      },
                  },
              },
          },
      }, {
          actions: {
              setSpeed: (ctx, event) => {
                  if ('payload' in event) {
                      ctx.timer.setSpeed(event.payload.speed);
                  }
              },
              recordSpeed: o({
                  normalSpeed: (ctx) => ctx.timer.speed,
              }),
              restoreSpeed: (ctx) => {
                  ctx.timer.setSpeed(ctx.normalSpeed);
              },
          },
      });
      return v(speedMachine);
  }

  const rules = (blockClass) => [
      `iframe, .${blockClass} { background: #ccc }`,
      'noscript { display: none !important; }',
  ];

  const SKIP_TIME_THRESHOLD = 10 * 1000;
  const SKIP_TIME_INTERVAL = 5 * 1000;
  const mitt$1 = mitt || mittProxy;
  const REPLAY_CONSOLE_PREFIX = '[replayer]';
  const defaultMouseTailConfig = {
      duration: 500,
      lineCap: 'round',
      lineWidth: 3,
      strokeStyle: 'red',
  };
  const defaultLogConfig = {
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
      replayLogger: undefined,
  };
  class Replayer {
      constructor(events, config) {
          this.mouseTail = null;
          this.tailPositions = [];
          this.emitter = mitt$1();
          this.legacy_missingNodeRetryMap = {};
          this.imageMap = new Map();
          if (!(config === null || config === void 0 ? void 0 : config.liveMode) && events.length < 2) {
              throw new Error('Replayer need at least 2 events.');
          }
          const defaultConfig = {
              speed: 1,
              root: document.body,
              loadTimeout: 0,
              skipInactive: false,
              showWarning: true,
              showDebug: false,
              blockClass: 'rr-block',
              liveMode: false,
              insertStyleRules: [],
              triggerFocus: true,
              UNSAFE_replayCanvas: false,
              pauseAnimation: true,
              mouseTail: defaultMouseTailConfig,
              logConfig: defaultLogConfig,
          };
          this.config = Object.assign({}, defaultConfig, config);
          if (!this.config.logConfig.replayLogger)
              this.config.logConfig.replayLogger = this.getConsoleLogger();
          this.handleResize = this.handleResize.bind(this);
          this.getCastFn = this.getCastFn.bind(this);
          this.emitter.on(exports.ReplayerEvents.Resize, this.handleResize);
          this.setupDom();
          this.treeIndex = new TreeIndex();
          this.fragmentParentMap = new Map();
          this.elementStateMap = new Map();
          this.emitter.on(exports.ReplayerEvents.Flush, () => {
              const { scrollMap, inputMap } = this.treeIndex.flush();
              for (const [frag, parent] of this.fragmentParentMap.entries()) {
                  mirror.map[parent.__sn.id] = parent;
                  if (parent.__sn.type === NodeType.Element &&
                      parent.__sn.tagName === 'textarea' &&
                      frag.textContent) {
                      parent.value = frag.textContent;
                  }
                  parent.appendChild(frag);
                  this.restoreState(parent);
              }
              this.fragmentParentMap.clear();
              this.elementStateMap.clear();
              for (const d of scrollMap.values()) {
                  this.applyScroll(d);
              }
              for (const d of inputMap.values()) {
                  this.applyInput(d);
              }
          });
          const timer = new Timer([], (config === null || config === void 0 ? void 0 : config.speed) || defaultConfig.speed);
          this.service = createPlayerService({
              events: events.map((e) => {
                  if (config && config.unpackFn) {
                      return config.unpackFn(e);
                  }
                  return e;
              }),
              timer,
              timeOffset: 0,
              baselineTime: 0,
              lastPlayedEvent: null,
          }, {
              getCastFn: this.getCastFn,
              emitter: this.emitter,
          });
          this.service.start();
          this.service.subscribe((state) => {
              this.emitter.emit(exports.ReplayerEvents.StateChange, {
                  player: state,
              });
          });
          this.speedService = createSpeedService({
              normalSpeed: -1,
              timer,
          });
          this.speedService.start();
          this.speedService.subscribe((state) => {
              this.emitter.emit(exports.ReplayerEvents.StateChange, {
                  speed: state,
              });
          });
          const firstMeta = this.service.state.context.events.find((e) => e.type === exports.EventType.Meta);
          const firstFullsnapshot = this.service.state.context.events.find((e) => e.type === exports.EventType.FullSnapshot);
          if (firstMeta) {
              const { width, height } = firstMeta.data;
              setTimeout(() => {
                  this.emitter.emit(exports.ReplayerEvents.Resize, {
                      width,
                      height,
                  });
              }, 0);
          }
          if (firstFullsnapshot) {
              setTimeout(() => {
                  this.rebuildFullSnapshot(firstFullsnapshot);
                  this.iframe.contentWindow.scrollTo(firstFullsnapshot.data.initialOffset);
              }, 1);
          }
      }
      get timer() {
          return this.service.state.context.timer;
      }
      on(event, handler) {
          this.emitter.on(event, handler);
          return this;
      }
      setConfig(config) {
          Object.keys(config).forEach((key) => {
              this.config[key] = config[key];
          });
          if (!this.config.skipInactive) {
              this.backToNormal();
          }
          if (typeof config.speed !== 'undefined') {
              this.speedService.send({
                  type: 'SET_SPEED',
                  payload: {
                      speed: config.speed,
                  },
              });
          }
          if (typeof config.mouseTail !== 'undefined') {
              if (config.mouseTail === false) {
                  if (this.mouseTail) {
                      this.mouseTail.style.display = 'none';
                  }
              }
              else {
                  if (!this.mouseTail) {
                      this.mouseTail = document.createElement('canvas');
                      this.mouseTail.width = Number.parseFloat(this.iframe.width);
                      this.mouseTail.height = Number.parseFloat(this.iframe.height);
                      this.mouseTail.classList.add('replayer-mouse-tail');
                      this.wrapper.insertBefore(this.mouseTail, this.iframe);
                  }
                  this.mouseTail.style.display = 'inherit';
              }
          }
      }
      getMetaData() {
          const firstEvent = this.service.state.context.events[0];
          const lastEvent = this.service.state.context.events[this.service.state.context.events.length - 1];
          return {
              startTime: firstEvent.timestamp,
              endTime: lastEvent.timestamp,
              totalTime: lastEvent.timestamp - firstEvent.timestamp,
          };
      }
      getCurrentTime() {
          return this.timer.timeOffset + this.getTimeOffset();
      }
      getTimeOffset() {
          const { baselineTime, events } = this.service.state.context;
          return baselineTime - events[0].timestamp;
      }
      play(timeOffset = 0) {
          var _a;
          if (this.service.state.matches('paused')) {
              this.service.send({ type: 'PLAY', payload: { timeOffset } });
          }
          else {
              this.service.send({ type: 'PAUSE' });
              this.service.send({ type: 'PLAY', payload: { timeOffset } });
          }
          (_a = this.iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('html')[0].classList.remove('rrweb-paused');
          this.emitter.emit(exports.ReplayerEvents.Start);
      }
      pause(timeOffset) {
          var _a;
          if (timeOffset === undefined && this.service.state.matches('playing')) {
              this.service.send({ type: 'PAUSE' });
          }
          if (typeof timeOffset === 'number') {
              this.play(timeOffset);
              this.service.send({ type: 'PAUSE' });
          }
          (_a = this.iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('html')[0].classList.add('rrweb-paused');
          this.emitter.emit(exports.ReplayerEvents.Pause);
      }
      resume(timeOffset = 0) {
          console.warn(`The 'resume' will be departed in 1.0. Please use 'play' method which has the same interface.`);
          this.play(timeOffset);
          this.emitter.emit(exports.ReplayerEvents.Resume);
      }
      startLive(baselineTime) {
          this.service.send({ type: 'TO_LIVE', payload: { baselineTime } });
      }
      addEvent(rawEvent) {
          const event = this.config.unpackFn
              ? this.config.unpackFn(rawEvent)
              : rawEvent;
          Promise.resolve().then(() => this.service.send({ type: 'ADD_EVENT', payload: { event } }));
      }
      enableInteract() {
          this.iframe.setAttribute('scrolling', 'auto');
          this.iframe.style.pointerEvents = 'auto';
      }
      disableInteract() {
          this.iframe.setAttribute('scrolling', 'no');
          this.iframe.style.pointerEvents = 'none';
      }
      setupDom() {
          this.wrapper = document.createElement('div');
          this.wrapper.classList.add('replayer-wrapper');
          this.config.root.appendChild(this.wrapper);
          this.mouse = document.createElement('div');
          this.mouse.classList.add('replayer-mouse');
          this.wrapper.appendChild(this.mouse);
          if (this.config.mouseTail !== false) {
              this.mouseTail = document.createElement('canvas');
              this.mouseTail.classList.add('replayer-mouse-tail');
              this.mouseTail.style.display = 'inherit';
              this.wrapper.appendChild(this.mouseTail);
          }
          this.iframe = document.createElement('iframe');
          const attributes = ['allow-same-origin'];
          if (this.config.UNSAFE_replayCanvas) {
              attributes.push('allow-scripts');
          }
          this.iframe.style.display = 'none';
          this.iframe.setAttribute('sandbox', attributes.join(' '));
          this.disableInteract();
          this.wrapper.appendChild(this.iframe);
          if (this.iframe.contentWindow && this.iframe.contentDocument) {
              polyfill$1(this.iframe.contentWindow, this.iframe.contentDocument);
              polyfill(this.iframe.contentWindow);
          }
      }
      handleResize(dimension) {
          this.iframe.style.display = 'inherit';
          for (const el of [this.mouseTail, this.iframe]) {
              if (!el) {
                  continue;
              }
              el.setAttribute('width', String(dimension.width));
              el.setAttribute('height', String(dimension.height));
          }
      }
      getCastFn(event, isSync = false) {
          let castFn;
          switch (event.type) {
              case exports.EventType.DomContentLoaded:
              case exports.EventType.Load:
                  break;
              case exports.EventType.Custom:
                  castFn = () => {
                      this.emitter.emit(exports.ReplayerEvents.CustomEvent, event);
                  };
                  break;
              case exports.EventType.Meta:
                  castFn = () => this.emitter.emit(exports.ReplayerEvents.Resize, {
                      width: event.data.width,
                      height: event.data.height,
                  });
                  break;
              case exports.EventType.FullSnapshot:
                  castFn = () => {
                      this.rebuildFullSnapshot(event, isSync);
                      this.iframe.contentWindow.scrollTo(event.data.initialOffset);
                  };
                  break;
              case exports.EventType.IncrementalSnapshot:
                  castFn = () => {
                      this.applyIncremental(event, isSync);
                      if (isSync) {
                          return;
                      }
                      if (event === this.nextUserInteractionEvent) {
                          this.nextUserInteractionEvent = null;
                          this.backToNormal();
                      }
                      if (this.config.skipInactive && !this.nextUserInteractionEvent) {
                          for (const _event of this.service.state.context.events) {
                              if (_event.timestamp <= event.timestamp) {
                                  continue;
                              }
                              if (this.isUserInteraction(_event)) {
                                  if (_event.delay - event.delay >
                                      SKIP_TIME_THRESHOLD *
                                          this.speedService.state.context.timer.speed) {
                                      this.nextUserInteractionEvent = _event;
                                  }
                                  break;
                              }
                          }
                          if (this.nextUserInteractionEvent) {
                              const skipTime = this.nextUserInteractionEvent.delay - event.delay;
                              const payload = {
                                  speed: Math.min(Math.round(skipTime / SKIP_TIME_INTERVAL), 360),
                              };
                              this.speedService.send({ type: 'FAST_FORWARD', payload });
                              this.emitter.emit(exports.ReplayerEvents.SkipStart, payload);
                          }
                      }
                  };
                  break;
          }
          const wrappedCastFn = () => {
              if (castFn) {
                  castFn();
              }
              this.service.send({ type: 'CAST_EVENT', payload: { event } });
              if (event ===
                  this.service.state.context.events[this.service.state.context.events.length - 1]) {
                  const finish = () => {
                      this.backToNormal();
                      this.service.send('END');
                      this.emitter.emit(exports.ReplayerEvents.Finish);
                  };
                  if (event.type === exports.EventType.IncrementalSnapshot &&
                      event.data.source === exports.IncrementalSource.MouseMove &&
                      event.data.positions.length) {
                      setTimeout(() => {
                          finish();
                      }, Math.max(0, -event.data.positions[0].timeOffset + 50));
                  }
                  else {
                      finish();
                  }
              }
          };
          return wrappedCastFn;
      }
      rebuildFullSnapshot(event, isSync = false) {
          if (!this.iframe.contentDocument) {
              return console.warn('Looks like your replayer has been destroyed.');
          }
          if (Object.keys(this.legacy_missingNodeRetryMap).length) {
              console.warn('Found unresolved missing node map', this.legacy_missingNodeRetryMap);
          }
          this.legacy_missingNodeRetryMap = {};
          mirror.map = rebuild(event.data.node, {
              doc: this.iframe.contentDocument,
          })[1];
          const styleEl = document.createElement('style');
          const { documentElement, head } = this.iframe.contentDocument;
          documentElement.insertBefore(styleEl, head);
          const injectStylesRules = rules(this.config.blockClass).concat(this.config.insertStyleRules);
          if (this.config.pauseAnimation) {
              injectStylesRules.push('html.rrweb-paused * { animation-play-state: paused !important; }');
          }
          if (!this.service.state.matches('playing')) {
              this.iframe.contentDocument
                  .getElementsByTagName('html')[0]
                  .classList.add('rrweb-paused');
          }
          for (let idx = 0; idx < injectStylesRules.length; idx++) {
              styleEl.sheet.insertRule(injectStylesRules[idx], idx);
          }
          this.emitter.emit(exports.ReplayerEvents.FullsnapshotRebuilded, event);
          if (!isSync) {
              this.waitForStylesheetLoad();
          }
          if (this.config.UNSAFE_replayCanvas) {
              this.preloadAllImages();
          }
      }
      waitForStylesheetLoad() {
          var _a;
          const head = (_a = this.iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.head;
          if (head) {
              const unloadSheets = new Set();
              let timer;
              let beforeLoadState = this.service.state;
              const stateHandler = () => {
                  beforeLoadState = this.service.state;
              };
              this.emitter.on(exports.ReplayerEvents.Start, stateHandler);
              this.emitter.on(exports.ReplayerEvents.Pause, stateHandler);
              const unsubscribe = () => {
                  this.emitter.off(exports.ReplayerEvents.Start, stateHandler);
                  this.emitter.off(exports.ReplayerEvents.Pause, stateHandler);
              };
              head
                  .querySelectorAll('link[rel="stylesheet"]')
                  .forEach((css) => {
                  if (!css.sheet) {
                      unloadSheets.add(css);
                      css.addEventListener('load', () => {
                          unloadSheets.delete(css);
                          if (unloadSheets.size === 0 && timer !== -1) {
                              if (beforeLoadState.matches('playing')) {
                                  this.play(this.getCurrentTime());
                              }
                              this.emitter.emit(exports.ReplayerEvents.LoadStylesheetEnd);
                              if (timer) {
                                  window.clearTimeout(timer);
                              }
                              unsubscribe();
                          }
                      });
                  }
              });
              if (unloadSheets.size > 0) {
                  this.service.send({ type: 'PAUSE' });
                  this.emitter.emit(exports.ReplayerEvents.LoadStylesheetStart);
                  timer = window.setTimeout(() => {
                      if (beforeLoadState.matches('playing')) {
                          this.play(this.getCurrentTime());
                      }
                      timer = -1;
                      unsubscribe();
                  }, this.config.loadTimeout);
              }
          }
      }
      preloadAllImages() {
          let beforeLoadState = this.service.state;
          const stateHandler = () => {
              beforeLoadState = this.service.state;
          };
          this.emitter.on(exports.ReplayerEvents.Start, stateHandler);
          this.emitter.on(exports.ReplayerEvents.Pause, stateHandler);
          const unsubscribe = () => {
              this.emitter.off(exports.ReplayerEvents.Start, stateHandler);
              this.emitter.off(exports.ReplayerEvents.Pause, stateHandler);
          };
          let count = 0;
          let resolved = 0;
          for (const event of this.service.state.context.events) {
              if (event.type === exports.EventType.IncrementalSnapshot &&
                  event.data.source === exports.IncrementalSource.CanvasMutation &&
                  event.data.property === 'drawImage' &&
                  typeof event.data.args[0] === 'string' &&
                  !this.imageMap.has(event)) {
                  count++;
                  const image = document.createElement('img');
                  image.src = event.data.args[0];
                  this.imageMap.set(event, image);
                  image.onload = () => {
                      resolved++;
                      if (resolved === count) {
                          if (beforeLoadState.matches('playing')) {
                              this.play(this.getCurrentTime());
                          }
                          unsubscribe();
                      }
                  };
              }
          }
          if (count !== resolved) {
              this.service.send({ type: 'PAUSE' });
          }
      }
      applyIncremental(e, isSync) {
          var _a, _b;
          const { data: d } = e;
          switch (d.source) {
              case exports.IncrementalSource.Mutation: {
                  if (isSync) {
                      d.adds.forEach((m) => this.treeIndex.add(m));
                      d.texts.forEach((m) => this.treeIndex.text(m));
                      d.attributes.forEach((m) => this.treeIndex.attribute(m));
                      d.removes.forEach((m) => this.treeIndex.remove(m));
                  }
                  this.applyMutation(d, isSync);
                  break;
              }
              case exports.IncrementalSource.MouseMove:
                  if (isSync) {
                      const lastPosition = d.positions[d.positions.length - 1];
                      this.moveAndHover(d, lastPosition.x, lastPosition.y, lastPosition.id);
                  }
                  else {
                      d.positions.forEach((p) => {
                          const action = {
                              doAction: () => {
                                  this.moveAndHover(d, p.x, p.y, p.id);
                              },
                              delay: p.timeOffset +
                                  e.timestamp -
                                  this.service.state.context.baselineTime,
                          };
                          this.timer.addAction(action);
                      });
                      this.timer.addAction({
                          doAction() { },
                          delay: e.delay - ((_a = d.positions[0]) === null || _a === void 0 ? void 0 : _a.timeOffset),
                      });
                  }
                  break;
              case exports.IncrementalSource.MouseInteraction: {
                  if (d.id === -1) {
                      break;
                  }
                  const event = new Event(exports.MouseInteractions[d.type].toLowerCase());
                  const target = mirror.getNode(d.id);
                  if (!target) {
                      return this.debugNodeNotFound(d, d.id);
                  }
                  this.emitter.emit(exports.ReplayerEvents.MouseInteraction, {
                      type: d.type,
                      target,
                  });
                  const { triggerFocus } = this.config;
                  switch (d.type) {
                      case exports.MouseInteractions.Blur:
                          if ('blur' in target) {
                              target.blur();
                          }
                          break;
                      case exports.MouseInteractions.Focus:
                          if (triggerFocus && target.focus) {
                              target.focus({
                                  preventScroll: true,
                              });
                          }
                          break;
                      case exports.MouseInteractions.Click:
                      case exports.MouseInteractions.TouchStart:
                      case exports.MouseInteractions.TouchEnd:
                          if (!isSync) {
                              this.moveAndHover(d, d.x, d.y, d.id);
                              this.mouse.classList.remove('active');
                              void this.mouse.offsetWidth;
                              this.mouse.classList.add('active');
                          }
                          break;
                      default:
                          target.dispatchEvent(event);
                  }
                  break;
              }
              case exports.IncrementalSource.Scroll: {
                  if (d.id === -1) {
                      break;
                  }
                  if (isSync) {
                      this.treeIndex.scroll(d);
                      break;
                  }
                  this.applyScroll(d);
                  break;
              }
              case exports.IncrementalSource.ViewportResize:
                  this.emitter.emit(exports.ReplayerEvents.Resize, {
                      width: d.width,
                      height: d.height,
                  });
                  break;
              case exports.IncrementalSource.Input: {
                  if (d.id === -1) {
                      break;
                  }
                  if (isSync) {
                      this.treeIndex.input(d);
                      break;
                  }
                  this.applyInput(d);
                  break;
              }
              case exports.IncrementalSource.MediaInteraction: {
                  const target = mirror.getNode(d.id);
                  if (!target) {
                      return this.debugNodeNotFound(d, d.id);
                  }
                  const mediaEl = target;
                  try {
                      if (d.type === 1) {
                          mediaEl.pause();
                      }
                      if (d.type === 0) {
                          if (mediaEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
                              mediaEl.play();
                          }
                          else {
                              mediaEl.addEventListener('canplay', () => {
                                  mediaEl.play();
                              });
                          }
                      }
                  }
                  catch (error) {
                      if (this.config.showWarning) {
                          console.warn(`Failed to replay media interactions: ${error.message || error}`);
                      }
                  }
                  break;
              }
              case exports.IncrementalSource.StyleSheetRule: {
                  const target = mirror.getNode(d.id);
                  if (!target) {
                      return this.debugNodeNotFound(d, d.id);
                  }
                  const styleEl = target;
                  const parent = target.parentNode;
                  const usingVirtualParent = this.fragmentParentMap.has(parent);
                  let placeholderNode;
                  if (usingVirtualParent) {
                      const domParent = this.fragmentParentMap.get(target.parentNode);
                      placeholderNode = document.createTextNode('');
                      parent.replaceChild(placeholderNode, target);
                      domParent.appendChild(target);
                  }
                  const styleSheet = styleEl.sheet;
                  if (d.adds) {
                      d.adds.forEach(({ rule, index }) => {
                          try {
                              const _index = index === undefined
                                  ? undefined
                                  : Math.min(index, styleSheet.rules.length);
                              try {
                                  styleSheet.insertRule(rule, _index);
                              }
                              catch (e) {
                              }
                          }
                          catch (e) {
                          }
                      });
                  }
                  if (d.removes) {
                      d.removes.forEach(({ index }) => {
                          try {
                              styleSheet.deleteRule(index);
                          }
                          catch (e) {
                          }
                      });
                  }
                  if (usingVirtualParent && placeholderNode) {
                      parent.replaceChild(target, placeholderNode);
                  }
                  break;
              }
              case exports.IncrementalSource.CanvasMutation: {
                  if (!this.config.UNSAFE_replayCanvas) {
                      return;
                  }
                  const target = mirror.getNode(d.id);
                  if (!target) {
                      return this.debugNodeNotFound(d, d.id);
                  }
                  try {
                      const ctx = target.getContext('2d');
                      if (d.setter) {
                          ctx[d.property] = d.args[0];
                          return;
                      }
                      const original = ctx[d.property];
                      if (d.property === 'drawImage' && typeof d.args[0] === 'string') {
                          const image = this.imageMap.get(e);
                          d.args[0] = image;
                          original.apply(ctx, d.args);
                      }
                      else {
                          original.apply(ctx, d.args);
                      }
                  }
                  catch (error) {
                      this.warnCanvasMutationFailed(d, d.id, error);
                  }
                  break;
              }
              case exports.IncrementalSource.Font: {
                  try {
                      const fontFace = new FontFace(d.family, d.buffer ? new Uint8Array(JSON.parse(d.fontSource)) : d.fontSource, d.descriptors);
                      (_b = this.iframe.contentDocument) === null || _b === void 0 ? void 0 : _b.fonts.add(fontFace);
                  }
                  catch (error) {
                      if (this.config.showWarning) {
                          console.warn(error);
                      }
                  }
                  break;
              }
              case exports.IncrementalSource.Log: {
                  try {
                      const logData = e.data;
                      const replayLogger = this.config.logConfig.replayLogger;
                      if (typeof replayLogger[logData.level] === 'function')
                          replayLogger[logData.level](logData);
                  }
                  catch (error) {
                      if (this.config.showWarning) {
                          console.warn(error);
                      }
                  }
              }
          }
      }
      applyMutation(d, useVirtualParent) {
          d.removes.forEach((mutation) => {
              const target = mirror.getNode(mutation.id);
              if (!target) {
                  return this.warnNodeNotFound(d, mutation.id);
              }
              const parent = mirror.getNode(mutation.parentId);
              if (!parent) {
                  return this.warnNodeNotFound(d, mutation.parentId);
              }
              mirror.removeNodeFromMap(target);
              if (parent) {
                  const realParent = this.fragmentParentMap.get(parent);
                  if (realParent && realParent.contains(target)) {
                      realParent.removeChild(target);
                  }
                  else if (this.fragmentParentMap.has(target)) {
                      const realTarget = this.fragmentParentMap.get(target);
                      parent.removeChild(realTarget);
                      this.fragmentParentMap.delete(target);
                  }
                  else {
                      parent.removeChild(target);
                  }
              }
          });
          const legacy_missingNodeMap = Object.assign({}, this.legacy_missingNodeRetryMap);
          const queue = [];
          function nextNotInDOM(mutation) {
              let next = null;
              if (mutation.nextId) {
                  next = mirror.getNode(mutation.nextId);
              }
              if (mutation.nextId !== null &&
                  mutation.nextId !== undefined &&
                  mutation.nextId !== -1 &&
                  !next) {
                  return true;
              }
              return false;
          }
          const appendNode = (mutation) => {
              if (!this.iframe.contentDocument) {
                  return console.warn('Looks like your replayer has been destroyed.');
              }
              let parent = mirror.getNode(mutation.parentId);
              if (!parent) {
                  return queue.push(mutation);
              }
              let parentInDocument = null;
              if (this.iframe.contentDocument.contains) {
                  parentInDocument = this.iframe.contentDocument.contains(parent);
              }
              else if (this.iframe.contentDocument.body.contains) {
                  parentInDocument = this.iframe.contentDocument.body.contains(parent);
              }
              if (useVirtualParent && parentInDocument) {
                  const virtualParent = document.createDocumentFragment();
                  mirror.map[mutation.parentId] = virtualParent;
                  this.fragmentParentMap.set(virtualParent, parent);
                  this.storeState(parent);
                  while (parent.firstChild) {
                      virtualParent.appendChild(parent.firstChild);
                  }
                  parent = virtualParent;
              }
              let previous = null;
              let next = null;
              if (mutation.previousId) {
                  previous = mirror.getNode(mutation.previousId);
              }
              if (mutation.nextId) {
                  next = mirror.getNode(mutation.nextId);
              }
              if (nextNotInDOM(mutation)) {
                  return queue.push(mutation);
              }
              const target = buildNodeWithSN(mutation.node, {
                  doc: this.iframe.contentDocument,
                  map: mirror.map,
                  skipChild: true,
                  hackCss: true,
              });
              if (mutation.previousId === -1 || mutation.nextId === -1) {
                  legacy_missingNodeMap[mutation.node.id] = {
                      node: target,
                      mutation,
                  };
                  return;
              }
              if (previous && previous.nextSibling && previous.nextSibling.parentNode) {
                  parent.insertBefore(target, previous.nextSibling);
              }
              else if (next && next.parentNode) {
                  parent.contains(next)
                      ? parent.insertBefore(target, next)
                      : parent.insertBefore(target, null);
              }
              else {
                  parent.appendChild(target);
              }
              if (mutation.previousId || mutation.nextId) {
                  this.legacy_resolveMissingNode(legacy_missingNodeMap, parent, target, mutation);
              }
          };
          d.adds.forEach((mutation) => {
              appendNode(mutation);
          });
          let startTime = Date.now();
          while (queue.length) {
              const resolveTrees = queueToResolveTrees(queue);
              queue.length = 0;
              if (Date.now() - startTime > 500) {
                  this.warn('Timeout in the loop, please check the resolve tree data:', resolveTrees);
                  break;
              }
              for (const tree of resolveTrees) {
                  let parent = mirror.getNode(tree.value.parentId);
                  if (!parent) {
                      this.debug('Drop resolve tree since there is no parent for the root node.', tree);
                  }
                  else {
                      iterateResolveTree(tree, (mutation) => {
                          appendNode(mutation);
                      });
                  }
              }
          }
          if (Object.keys(legacy_missingNodeMap).length) {
              Object.assign(this.legacy_missingNodeRetryMap, legacy_missingNodeMap);
          }
          d.texts.forEach((mutation) => {
              let target = mirror.getNode(mutation.id);
              if (!target) {
                  return this.warnNodeNotFound(d, mutation.id);
              }
              if (this.fragmentParentMap.has(target)) {
                  target = this.fragmentParentMap.get(target);
              }
              target.textContent = mutation.value;
          });
          d.attributes.forEach((mutation) => {
              let target = mirror.getNode(mutation.id);
              if (!target) {
                  return this.warnNodeNotFound(d, mutation.id);
              }
              if (this.fragmentParentMap.has(target)) {
                  target = this.fragmentParentMap.get(target);
              }
              for (const attributeName in mutation.attributes) {
                  if (typeof attributeName === 'string') {
                      const value = mutation.attributes[attributeName];
                      try {
                          if (value !== null) {
                              target.setAttribute(attributeName, value);
                          }
                          else {
                              target.removeAttribute(attributeName);
                          }
                      }
                      catch (error) {
                          if (this.config.showWarning) {
                              console.warn('An error occurred may due to the checkout feature.', error);
                          }
                      }
                  }
              }
          });
      }
      applyScroll(d) {
          const target = mirror.getNode(d.id);
          if (!target) {
              return this.debugNodeNotFound(d, d.id);
          }
          if (target === this.iframe.contentDocument) {
              this.iframe.contentWindow.scrollTo({
                  top: d.y,
                  left: d.x,
                  behavior: 'smooth',
              });
          }
          else {
              try {
                  target.scrollTop = d.y;
                  target.scrollLeft = d.x;
              }
              catch (error) {
              }
          }
      }
      applyInput(d) {
          const target = mirror.getNode(d.id);
          if (!target) {
              return this.debugNodeNotFound(d, d.id);
          }
          try {
              target.checked = d.isChecked;
              target.value = d.text;
          }
          catch (error) {
          }
      }
      formatMessage(data) {
          if (data.trace.length === 0)
              return '';
          const stackPrefix = '\n\tat ';
          let result = stackPrefix;
          result += data.trace.join(stackPrefix);
          return result;
      }
      getConsoleLogger() {
          const rrwebOriginal = '__rrweb_original__';
          const replayLogger = {};
          for (const level of this.config.logConfig.level)
              if (level === 'trace')
                  replayLogger[level] = (data) => {
                      const logger = console.log[rrwebOriginal]
                          ? console.log[rrwebOriginal]
                          : console.log;
                      logger(...data.payload.map((s) => JSON.parse(s)), this.formatMessage(data));
                  };
              else
                  replayLogger[level] = (data) => {
                      const logger = console[level][rrwebOriginal]
                          ? console[level][rrwebOriginal]
                          : console[level];
                      logger(...data.payload.map((s) => JSON.parse(s)), this.formatMessage(data));
                  };
          return replayLogger;
      }
      legacy_resolveMissingNode(map, parent, target, targetMutation) {
          const { previousId, nextId } = targetMutation;
          const previousInMap = previousId && map[previousId];
          const nextInMap = nextId && map[nextId];
          if (previousInMap) {
              const { node, mutation } = previousInMap;
              parent.insertBefore(node, target);
              delete map[mutation.node.id];
              delete this.legacy_missingNodeRetryMap[mutation.node.id];
              if (mutation.previousId || mutation.nextId) {
                  this.legacy_resolveMissingNode(map, parent, node, mutation);
              }
          }
          if (nextInMap) {
              const { node, mutation } = nextInMap;
              parent.insertBefore(node, target.nextSibling);
              delete map[mutation.node.id];
              delete this.legacy_missingNodeRetryMap[mutation.node.id];
              if (mutation.previousId || mutation.nextId) {
                  this.legacy_resolveMissingNode(map, parent, node, mutation);
              }
          }
      }
      moveAndHover(d, x, y, id) {
          this.mouse.style.left = `${x}px`;
          this.mouse.style.top = `${y}px`;
          this.drawMouseTail({ x, y });
          const target = mirror.getNode(id);
          if (!target) {
              return this.debugNodeNotFound(d, id);
          }
          this.hoverElements(target);
      }
      drawMouseTail(position) {
          if (!this.mouseTail) {
              return;
          }
          const { lineCap, lineWidth, strokeStyle, duration } = this.config.mouseTail === true
              ? defaultMouseTailConfig
              : Object.assign({}, defaultMouseTailConfig, this.config.mouseTail);
          const draw = () => {
              if (!this.mouseTail) {
                  return;
              }
              const ctx = this.mouseTail.getContext('2d');
              if (!ctx || !this.tailPositions.length) {
                  return;
              }
              ctx.clearRect(0, 0, this.mouseTail.width, this.mouseTail.height);
              ctx.beginPath();
              ctx.lineWidth = lineWidth;
              ctx.lineCap = lineCap;
              ctx.strokeStyle = strokeStyle;
              ctx.moveTo(this.tailPositions[0].x, this.tailPositions[0].y);
              this.tailPositions.forEach((p) => ctx.lineTo(p.x, p.y));
              ctx.stroke();
          };
          this.tailPositions.push(position);
          draw();
          setTimeout(() => {
              this.tailPositions = this.tailPositions.filter((p) => p !== position);
              draw();
          }, duration);
      }
      hoverElements(el) {
          var _a;
          (_a = this.iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.\\:hover').forEach((hoveredEl) => {
              hoveredEl.classList.remove(':hover');
          });
          let currentEl = el;
          while (currentEl) {
              if (currentEl.classList) {
                  currentEl.classList.add(':hover');
              }
              currentEl = currentEl.parentElement;
          }
      }
      isUserInteraction(event) {
          if (event.type !== exports.EventType.IncrementalSnapshot) {
              return false;
          }
          return (event.data.source > exports.IncrementalSource.Mutation &&
              event.data.source <= exports.IncrementalSource.Input);
      }
      backToNormal() {
          this.nextUserInteractionEvent = null;
          if (this.speedService.state.matches('normal')) {
              return;
          }
          this.speedService.send({ type: 'BACK_TO_NORMAL' });
          this.emitter.emit(exports.ReplayerEvents.SkipEnd, {
              speed: this.speedService.state.context.normalSpeed,
          });
      }
      storeState(parent) {
          if (parent) {
              if (parent.nodeType === parent.ELEMENT_NODE) {
                  const parentElement = parent;
                  if (parentElement.scrollLeft || parentElement.scrollTop) {
                      this.elementStateMap.set(parent, {
                          scroll: [parentElement.scrollLeft, parentElement.scrollTop],
                      });
                  }
                  const children = parentElement.children;
                  for (const child of Array.from(children)) {
                      this.storeState(child);
                  }
              }
          }
      }
      restoreState(parent) {
          if (parent.nodeType === parent.ELEMENT_NODE) {
              const parentElement = parent;
              if (this.elementStateMap.has(parent)) {
                  const storedState = this.elementStateMap.get(parent);
                  if (storedState.scroll) {
                      parentElement.scrollLeft = storedState.scroll[0];
                      parentElement.scrollTop = storedState.scroll[1];
                  }
                  this.elementStateMap.delete(parent);
              }
              const children = parentElement.children;
              for (const child of Array.from(children)) {
                  this.restoreState(child);
              }
          }
      }
      warnNodeNotFound(d, id) {
          this.warn(`Node with id '${id}' not found in`, d);
      }
      warnCanvasMutationFailed(d, id, error) {
          this.warn(`Has error on update canvas '${id}'`, d, error);
      }
      debugNodeNotFound(d, id) {
          this.debug(REPLAY_CONSOLE_PREFIX, `Node with id '${id}' not found in`, d);
      }
      warn(...args) {
          if (!this.config.showWarning) {
              return;
          }
          console.warn(REPLAY_CONSOLE_PREFIX, ...args);
      }
      debug(...args) {
          if (!this.config.showDebug) {
              return;
          }
          console.log(REPLAY_CONSOLE_PREFIX, ...args);
      }
  }

  const { addCustomEvent } = record;
  const { freezePage } = record;

  // DEFLATE is a complex format; to read this code, you should probably check the RFC first:

  // aliases for shorter compressed code (most minifers don't do this)
  var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
  // fixed length extra bits
  var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
  // fixed distance extra bits
  // see fleb note
  var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
  // code length index map
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  // get base, reverse index map from extra bits
  var freb = function (eb, start) {
      var b = new u16(31);
      for (var i = 0; i < 31; ++i) {
          b[i] = start += 1 << eb[i - 1];
      }
      // numbers here are at max 18 bits
      var r = new u32(b[30]);
      for (var i = 1; i < 30; ++i) {
          for (var j = b[i]; j < b[i + 1]; ++j) {
              r[j] = ((j - b[i]) << 5) | i;
          }
      }
      return [b, r];
  };
  var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
  // we can ignore the fact that the other numbers are wrong; they never happen anyway
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0), fd = _b[0], revfd = _b[1];
  // map of value to reverse (assuming 16 bits)
  var rev = new u16(32768);
  for (var i$1 = 0; i$1 < 32768; ++i$1) {
      // reverse table algorithm from SO
      var x = ((i$1 & 0xAAAA) >>> 1) | ((i$1 & 0x5555) << 1);
      x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
      x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
      rev[i$1] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
  }
  // create huffman tree from u8 "map": index -> code length for code index
  // mb (max bits) must be at most 15
  // TODO: optimize/split up?
  var hMap = (function (cd, mb, r) {
      var s = cd.length;
      // index
      var i = 0;
      // u16 "map": index -> # of codes with bit length = index
      var l = new u16(mb);
      // length of cd must be 288 (total # of codes)
      for (; i < s; ++i)
          ++l[cd[i] - 1];
      // u16 "map": index -> minimum code for bit length = index
      var le = new u16(mb);
      for (i = 0; i < mb; ++i) {
          le[i] = (le[i - 1] + l[i - 1]) << 1;
      }
      var co;
      if (r) {
          // u16 "map": index -> number of actual bits, symbol for code
          co = new u16(1 << mb);
          // bits to remove for reverser
          var rvb = 15 - mb;
          for (i = 0; i < s; ++i) {
              // ignore 0 lengths
              if (cd[i]) {
                  // num encoding both symbol and bits read
                  var sv = (i << 4) | cd[i];
                  // free bits
                  var r_1 = mb - cd[i];
                  // start value
                  var v = le[cd[i] - 1]++ << r_1;
                  // m is end value
                  for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                      // every 16 bit value starting with the code yields the same result
                      co[rev[v] >>> rvb] = sv;
                  }
              }
          }
      }
      else {
          co = new u16(s);
          for (i = 0; i < s; ++i)
              co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
      }
      return co;
  });
  // fixed length tree
  var flt = new u8(288);
  for (var i$1 = 0; i$1 < 144; ++i$1)
      flt[i$1] = 8;
  for (var i$1 = 144; i$1 < 256; ++i$1)
      flt[i$1] = 9;
  for (var i$1 = 256; i$1 < 280; ++i$1)
      flt[i$1] = 7;
  for (var i$1 = 280; i$1 < 288; ++i$1)
      flt[i$1] = 8;
  // fixed distance tree
  var fdt = new u8(32);
  for (var i$1 = 0; i$1 < 32; ++i$1)
      fdt[i$1] = 5;
  // fixed length map
  var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
  // fixed distance map
  var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
  // find max of array
  var max = function (a) {
      var m = a[0];
      for (var i = 1; i < a.length; ++i) {
          if (a[i] > m)
              m = a[i];
      }
      return m;
  };
  // read d, starting at bit p and mask with m
  var bits = function (d, p, m) {
      var o = (p / 8) >> 0;
      return ((d[o] | (d[o + 1] << 8)) >>> (p & 7)) & m;
  };
  // read d, starting at bit p continuing for at least 16 bits
  var bits16 = function (d, p) {
      var o = (p / 8) >> 0;
      return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >>> (p & 7));
  };
  // get end of byte
  var shft = function (p) { return ((p / 8) >> 0) + (p & 7 && 1); };
  // typed array slice - allows garbage collector to free original reference,
  // while being more compatible than .slice
  var slc = function (v, s, e) {
      if (s == null || s < 0)
          s = 0;
      if (e == null || e > v.length)
          e = v.length;
      // can't use .constructor in case user-supplied
      var n = new (v instanceof u16 ? u16 : v instanceof u32 ? u32 : u8)(e - s);
      n.set(v.subarray(s, e));
      return n;
  };
  // expands raw DEFLATE data
  var inflt = function (dat, buf, st) {
      // source length
      var sl = dat.length;
      // have to estimate size
      var noBuf = !buf || st;
      // no state
      var noSt = !st || st.i;
      if (!st)
          st = {};
      // Assumes roughly 33% compression ratio average
      if (!buf)
          buf = new u8(sl * 3);
      // ensure buffer can fit at least l elements
      var cbuf = function (l) {
          var bl = buf.length;
          // need to increase size to fit
          if (l > bl) {
              // Double or set to necessary, whichever is greater
              var nbuf = new u8(Math.max(bl * 2, l));
              nbuf.set(buf);
              buf = nbuf;
          }
      };
      //  last chunk         bitpos           bytes
      var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
      // total bits
      var tbts = sl * 8;
      do {
          if (!lm) {
              // BFINAL - this is only 1 when last chunk is next
              st.f = final = bits(dat, pos, 1);
              // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
              var type = bits(dat, pos + 1, 3);
              pos += 3;
              if (!type) {
                  // go to end of byte boundary
                  var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                  if (t > sl) {
                      if (noSt)
                          throw 'unexpected EOF';
                      break;
                  }
                  // ensure size
                  if (noBuf)
                      cbuf(bt + l);
                  // Copy over uncompressed data
                  buf.set(dat.subarray(s, t), bt);
                  // Get new bitpos, update byte count
                  st.b = bt += l, st.p = pos = t * 8;
                  continue;
              }
              else if (type == 1)
                  lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
              else if (type == 2) {
                  //  literal                            lengths
                  var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                  var tl = hLit + bits(dat, pos + 5, 31) + 1;
                  pos += 14;
                  // length+distance tree
                  var ldt = new u8(tl);
                  // code length tree
                  var clt = new u8(19);
                  for (var i = 0; i < hcLen; ++i) {
                      // use index map to get real code
                      clt[clim[i]] = bits(dat, pos + i * 3, 7);
                  }
                  pos += hcLen * 3;
                  // code lengths bits
                  var clb = max(clt), clbmsk = (1 << clb) - 1;
                  if (!noSt && pos + tl * (clb + 7) > tbts)
                      break;
                  // code lengths map
                  var clm = hMap(clt, clb, 1);
                  for (var i = 0; i < tl;) {
                      var r = clm[bits(dat, pos, clbmsk)];
                      // bits read
                      pos += r & 15;
                      // symbol
                      var s = r >>> 4;
                      // code length to copy
                      if (s < 16) {
                          ldt[i++] = s;
                      }
                      else {
                          //  copy   count
                          var c = 0, n = 0;
                          if (s == 16)
                              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                          else if (s == 17)
                              n = 3 + bits(dat, pos, 7), pos += 3;
                          else if (s == 18)
                              n = 11 + bits(dat, pos, 127), pos += 7;
                          while (n--)
                              ldt[i++] = c;
                      }
                  }
                  //    length tree                 distance tree
                  var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                  // max length bits
                  lbt = max(lt);
                  // max dist bits
                  dbt = max(dt);
                  lm = hMap(lt, lbt, 1);
                  dm = hMap(dt, dbt, 1);
              }
              else
                  throw 'invalid block type';
              if (pos > tbts)
                  throw 'unexpected EOF';
          }
          // Make sure the buffer can hold this + the largest possible addition
          // Maximum chunk size (practically, theoretically infinite) is 2^17;
          if (noBuf)
              cbuf(bt + 131072);
          var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
          var mxa = lbt + dbt + 18;
          while (noSt || pos + mxa < tbts) {
              // bits read, code
              var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
              pos += c & 15;
              if (pos > tbts)
                  throw 'unexpected EOF';
              if (!c)
                  throw 'invalid length/literal';
              if (sym < 256)
                  buf[bt++] = sym;
              else if (sym == 256) {
                  lm = null;
                  break;
              }
              else {
                  var add = sym - 254;
                  // no extra bits needed if less
                  if (sym > 264) {
                      // index
                      var i = sym - 257, b = fleb[i];
                      add = bits(dat, pos, (1 << b) - 1) + fl[i];
                      pos += b;
                  }
                  // dist
                  var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
                  if (!d)
                      throw 'invalid distance';
                  pos += d & 15;
                  var dt = fd[dsym];
                  if (dsym > 3) {
                      var b = fdeb[dsym];
                      dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
                  }
                  if (pos > tbts)
                      throw 'unexpected EOF';
                  if (noBuf)
                      cbuf(bt + 131072);
                  var end = bt + add;
                  for (; bt < end; bt += 4) {
                      buf[bt] = buf[bt - dt];
                      buf[bt + 1] = buf[bt + 1 - dt];
                      buf[bt + 2] = buf[bt + 2 - dt];
                      buf[bt + 3] = buf[bt + 3 - dt];
                  }
                  bt = end;
              }
          }
          st.l = lm, st.p = pos, st.b = bt;
          if (lm)
              final = 1, st.m = lbt, st.d = dm, st.n = dbt;
      } while (!final);
      return bt == buf.length ? buf : slc(buf, 0, bt);
  };
  // starting at p, write the minimum number of bits that can hold v to d
  var wbits = function (d, p, v) {
      v <<= p & 7;
      var o = (p / 8) >> 0;
      d[o] |= v;
      d[o + 1] |= v >>> 8;
  };
  // starting at p, write the minimum number of bits (>8) that can hold v to d
  var wbits16 = function (d, p, v) {
      v <<= p & 7;
      var o = (p / 8) >> 0;
      d[o] |= v;
      d[o + 1] |= v >>> 8;
      d[o + 2] |= v >>> 16;
  };
  // creates code lengths from a frequency table
  var hTree = function (d, mb) {
      // Need extra info to make a tree
      var t = [];
      for (var i = 0; i < d.length; ++i) {
          if (d[i])
              t.push({ s: i, f: d[i] });
      }
      var s = t.length;
      var t2 = t.slice();
      if (!s)
          return [new u8(0), 0];
      if (s == 1) {
          var v = new u8(t[0].s + 1);
          v[t[0].s] = 1;
          return [v, 1];
      }
      t.sort(function (a, b) { return a.f - b.f; });
      // after i2 reaches last ind, will be stopped
      // freq must be greater than largest possible number of symbols
      t.push({ s: -1, f: 25001 });
      var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
      t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
      // efficient algorithm from UZIP.js
      // i0 is lookbehind, i2 is lookahead - after processing two low-freq
      // symbols that combined have high freq, will start processing i2 (high-freq,
      // non-composite) symbols instead
      // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
      while (i1 != s - 1) {
          l = t[t[i0].f < t[i2].f ? i0++ : i2++];
          r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
          t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
      }
      var maxSym = t2[0].s;
      for (var i = 1; i < s; ++i) {
          if (t2[i].s > maxSym)
              maxSym = t2[i].s;
      }
      // code lengths
      var tr = new u16(maxSym + 1);
      // max bits in tree
      var mbt = ln(t[i1 - 1], tr, 0);
      if (mbt > mb) {
          // more algorithms from UZIP.js
          // TODO: find out how this code works (debt)
          //  ind    debt
          var i = 0, dt = 0;
          //    left            cost
          var lft = mbt - mb, cst = 1 << lft;
          t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
          for (; i < s; ++i) {
              var i2_1 = t2[i].s;
              if (tr[i2_1] > mb) {
                  dt += cst - (1 << (mbt - tr[i2_1]));
                  tr[i2_1] = mb;
              }
              else
                  break;
          }
          dt >>>= lft;
          while (dt > 0) {
              var i2_2 = t2[i].s;
              if (tr[i2_2] < mb)
                  dt -= 1 << (mb - tr[i2_2]++ - 1);
              else
                  ++i;
          }
          for (; i >= 0 && dt; --i) {
              var i2_3 = t2[i].s;
              if (tr[i2_3] == mb) {
                  --tr[i2_3];
                  ++dt;
              }
          }
          mbt = mb;
      }
      return [new u8(tr), mbt];
  };
  // get the max length and assign length codes
  var ln = function (n, l, d) {
      return n.s == -1
          ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
          : (l[n.s] = d);
  };
  // length codes generation
  var lc = function (c) {
      var s = c.length;
      // Note that the semicolon was intentional
      while (s && !c[--s])
          ;
      var cl = new u16(++s);
      //  ind      num         streak
      var cli = 0, cln = c[0], cls = 1;
      var w = function (v) { cl[cli++] = v; };
      for (var i = 1; i <= s; ++i) {
          if (c[i] == cln && i != s)
              ++cls;
          else {
              if (!cln && cls > 2) {
                  for (; cls > 138; cls -= 138)
                      w(32754);
                  if (cls > 2) {
                      w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                      cls = 0;
                  }
              }
              else if (cls > 3) {
                  w(cln), --cls;
                  for (; cls > 6; cls -= 6)
                      w(8304);
                  if (cls > 2)
                      w(((cls - 3) << 5) | 8208), cls = 0;
              }
              while (cls--)
                  w(cln);
              cls = 1;
              cln = c[i];
          }
      }
      return [cl.subarray(0, cli), s];
  };
  // calculate the length of output from tree, code lengths
  var clen = function (cf, cl) {
      var l = 0;
      for (var i = 0; i < cl.length; ++i)
          l += cf[i] * cl[i];
      return l;
  };
  // writes a fixed block
  // returns the new bit pos
  var wfblk = function (out, pos, dat) {
      // no need to write 00 as type: TypedArray defaults to 0
      var s = dat.length;
      var o = shft(pos + 2);
      out[o] = s & 255;
      out[o + 1] = s >>> 8;
      out[o + 2] = out[o] ^ 255;
      out[o + 3] = out[o + 1] ^ 255;
      for (var i = 0; i < s; ++i)
          out[o + i + 4] = dat[i];
      return (o + 4 + s) * 8;
  };
  // writes a block
  var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
      wbits(out, p++, final);
      ++lf[256];
      var _a = hTree(lf, 15), dlt = _a[0], mlb = _a[1];
      var _b = hTree(df, 15), ddt = _b[0], mdb = _b[1];
      var _c = lc(dlt), lclt = _c[0], nlc = _c[1];
      var _d = lc(ddt), lcdt = _d[0], ndc = _d[1];
      var lcfreq = new u16(19);
      for (var i = 0; i < lclt.length; ++i)
          lcfreq[lclt[i] & 31]++;
      for (var i = 0; i < lcdt.length; ++i)
          lcfreq[lcdt[i] & 31]++;
      var _e = hTree(lcfreq, 7), lct = _e[0], mlcb = _e[1];
      var nlcc = 19;
      for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
          ;
      var flen = (bl + 5) << 3;
      var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
      var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
      if (flen <= ftlen && flen <= dtlen)
          return wfblk(out, p, dat.subarray(bs, bs + bl));
      var lm, ll, dm, dl;
      wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
      if (dtlen < ftlen) {
          lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
          var llm = hMap(lct, mlcb, 0);
          wbits(out, p, nlc - 257);
          wbits(out, p + 5, ndc - 1);
          wbits(out, p + 10, nlcc - 4);
          p += 14;
          for (var i = 0; i < nlcc; ++i)
              wbits(out, p + 3 * i, lct[clim[i]]);
          p += 3 * nlcc;
          var lcts = [lclt, lcdt];
          for (var it = 0; it < 2; ++it) {
              var clct = lcts[it];
              for (var i = 0; i < clct.length; ++i) {
                  var len = clct[i] & 31;
                  wbits(out, p, llm[len]), p += lct[len];
                  if (len > 15)
                      wbits(out, p, (clct[i] >>> 5) & 127), p += clct[i] >>> 12;
              }
          }
      }
      else {
          lm = flm, ll = flt, dm = fdm, dl = fdt;
      }
      for (var i = 0; i < li; ++i) {
          if (syms[i] > 255) {
              var len = (syms[i] >>> 18) & 31;
              wbits16(out, p, lm[len + 257]), p += ll[len + 257];
              if (len > 7)
                  wbits(out, p, (syms[i] >>> 23) & 31), p += fleb[len];
              var dst = syms[i] & 31;
              wbits16(out, p, dm[dst]), p += dl[dst];
              if (dst > 3)
                  wbits16(out, p, (syms[i] >>> 5) & 8191), p += fdeb[dst];
          }
          else {
              wbits16(out, p, lm[syms[i]]), p += ll[syms[i]];
          }
      }
      wbits16(out, p, lm[256]);
      return p + ll[256];
  };
  // deflate options (nice << 13) | chain
  var deo = /*#__PURE__*/ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
  // empty
  var et = /*#__PURE__*/ new u8(0);
  // compresses data into a raw DEFLATE buffer
  var dflt = function (dat, lvl, plvl, pre, post, lst) {
      var s = dat.length;
      var o = new u8(pre + s + 5 * (1 + Math.floor(s / 7000)) + post);
      // writing to this writes to the output buffer
      var w = o.subarray(pre, o.length - post);
      var pos = 0;
      if (!lvl || s < 8) {
          for (var i = 0; i <= s; i += 65535) {
              // end
              var e = i + 65535;
              if (e < s) {
                  // write full block
                  pos = wfblk(w, pos, dat.subarray(i, e));
              }
              else {
                  // write final block
                  w[i] = lst;
                  pos = wfblk(w, pos, dat.subarray(i, s));
              }
          }
      }
      else {
          var opt = deo[lvl - 1];
          var n = opt >>> 13, c = opt & 8191;
          var msk_1 = (1 << plvl) - 1;
          //    prev 2-byte val map    curr 2-byte val map
          var prev = new u16(32768), head = new u16(msk_1 + 1);
          var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
          var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
          // 24576 is an arbitrary number of maximum symbols per block
          // 424 buffer for last block
          var syms = new u32(25000);
          // length/literal freq   distance freq
          var lf = new u16(288), df = new u16(32);
          //  l/lcnt  exbits  index  l/lind  waitdx  bitpos
          var lc_1 = 0, eb = 0, i = 0, li = 0, wi = 0, bs = 0;
          for (; i < s; ++i) {
              // hash value
              var hv = hsh(i);
              // index mod 32768
              var imod = i & 32767;
              // previous index with this value
              var pimod = head[hv];
              prev[imod] = pimod;
              head[hv] = imod;
              // We always should modify head and prev, but only add symbols if
              // this data is not yet processed ("wait" for wait index)
              if (wi <= i) {
                  // bytes remaining
                  var rem = s - i;
                  if ((lc_1 > 7000 || li > 24576) && rem > 423) {
                      pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                      li = lc_1 = eb = 0, bs = i;
                      for (var j = 0; j < 286; ++j)
                          lf[j] = 0;
                      for (var j = 0; j < 30; ++j)
                          df[j] = 0;
                  }
                  //  len    dist   chain
                  var l = 2, d = 0, ch_1 = c, dif = (imod - pimod) & 32767;
                  if (rem > 2 && hv == hsh(i - dif)) {
                      var maxn = Math.min(n, rem) - 1;
                      var maxd = Math.min(32767, i);
                      // max possible length
                      // not capped at dif because decompressors implement "rolling" index population
                      var ml = Math.min(258, rem);
                      while (dif <= maxd && --ch_1 && imod != pimod) {
                          if (dat[i + l] == dat[i + l - dif]) {
                              var nl = 0;
                              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                  ;
                              if (nl > l) {
                                  l = nl, d = dif;
                                  // break out early when we reach "nice" (we are satisfied enough)
                                  if (nl > maxn)
                                      break;
                                  // now, find the rarest 2-byte sequence within this
                                  // length of literals and search for that instead.
                                  // Much faster than just using the start
                                  var mmd = Math.min(dif, nl - 2);
                                  var md = 0;
                                  for (var j = 0; j < mmd; ++j) {
                                      var ti = (i - dif + j + 32768) & 32767;
                                      var pti = prev[ti];
                                      var cd = (ti - pti + 32768) & 32767;
                                      if (cd > md)
                                          md = cd, pimod = ti;
                                  }
                              }
                          }
                          // check the previous match
                          imod = pimod, pimod = prev[imod];
                          dif += (imod - pimod + 32768) & 32767;
                      }
                  }
                  // d will be nonzero only when a match was found
                  if (d) {
                      // store both dist and len data in one Uint32
                      // Make sure this is recognized as a len/dist with 28th bit (2^28)
                      syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                      var lin = revfl[l] & 31, din = revfd[d] & 31;
                      eb += fleb[lin] + fdeb[din];
                      ++lf[257 + lin];
                      ++df[din];
                      wi = i + l;
                      ++lc_1;
                  }
                  else {
                      syms[li++] = dat[i];
                      ++lf[dat[i]];
                  }
              }
          }
          pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
          // this is the easiest way to avoid needing to maintain state
          if (!lst)
              pos = wfblk(w, pos, et);
      }
      return slc(o, 0, pre + shft(pos) + post);
  };
  // Alder32
  var adler = function () {
      var a = 1, b = 0;
      return {
          p: function (d) {
              // closures have awful performance
              var n = a, m = b;
              var l = d.length;
              for (var i = 0; i != l;) {
                  var e = Math.min(i + 5552, l);
                  for (; i < e; ++i)
                      n += d[i], m += n;
                  n %= 65521, m %= 65521;
              }
              a = n, b = m;
          },
          d: function () { return ((a >>> 8) << 16 | (b & 255) << 8 | (b >>> 8)) + ((a & 255) << 23) * 2; }
      };
  };
  // deflate with opts
  var dopt = function (dat, opt, pre, post, st) {
      return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : (12 + opt.mem), pre, post, !st);
  };
  // write bytes
  var wbytes = function (d, b, v) {
      for (; v; ++b)
          d[b] = v, v >>>= 8;
  };
  // zlib header
  var zlh = function (c, o) {
      var lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
      c[0] = 120, c[1] = (fl << 6) | (fl ? (32 - 2 * fl) : 1);
  };
  // zlib valid
  var zlv = function (d) {
      if ((d[0] & 15) != 8 || (d[0] >>> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
          throw 'invalid zlib data';
      if (d[1] & 32)
          throw 'invalid zlib data: preset dictionaries not supported';
  };
  /**
   * Compress data with Zlib
   * @param data The data to compress
   * @param opts The compression options
   * @returns The zlib-compressed version of the data
   */
  function zlibSync(data, opts) {
      if (opts === void 0) { opts = {}; }
      var a = adler();
      a.p(data);
      var d = dopt(data, opts, 2, 4);
      return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
  }
  /**
   * Expands Zlib data
   * @param data The data to decompress
   * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
   * @returns The decompressed version of the data
   */
  function unzlibSync(data, out) {
      return inflt((zlv(data), data.subarray(2, -4)), out);
  }
  /**
   * Converts a string into a Uint8Array for use with compression/decompression methods
   * @param str The string to encode
   * @param latin1 Whether or not to interpret the data as Latin-1. This should
   *               not need to be true unless decoding a binary string.
   * @returns The string encoded in UTF-8/Latin-1 binary
   */
  function strToU8(str, latin1) {
      var l = str.length;
      if (!latin1 && typeof TextEncoder != 'undefined')
          return new TextEncoder().encode(str);
      var ar = new u8(str.length + (str.length >>> 1));
      var ai = 0;
      var w = function (v) { ar[ai++] = v; };
      for (var i = 0; i < l; ++i) {
          if (ai + 5 > ar.length) {
              var n = new u8(ai + 8 + ((l - i) << 1));
              n.set(ar);
              ar = n;
          }
          var c = str.charCodeAt(i);
          if (c < 128 || latin1)
              w(c);
          else if (c < 2048)
              w(192 | (c >>> 6)), w(128 | (c & 63));
          else if (c > 55295 && c < 57344)
              c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                  w(240 | (c >>> 18)), w(128 | ((c >>> 12) & 63)), w(128 | ((c >>> 6) & 63)), w(128 | (c & 63));
          else
              w(224 | (c >>> 12)), w(128 | ((c >>> 6) & 63)), w(128 | (c & 63));
      }
      return slc(ar, 0, ai);
  }
  /**
   * Converts a Uint8Array to a string
   * @param dat The data to decode to string
   * @param latin1 Whether or not to interpret the data as Latin-1. This should
   *               not need to be true unless encoding to binary string.
   * @returns The original UTF-8/Latin-1 string
   */
  function strFromU8(dat, latin1) {
      var r = '';
      if (!latin1 && typeof TextDecoder != 'undefined')
          return new TextDecoder().decode(dat);
      for (var i = 0; i < dat.length;) {
          var c = dat[i++];
          if (c < 128 || latin1)
              r += String.fromCharCode(c);
          else if (c < 224)
              r += String.fromCharCode((c & 31) << 6 | (dat[i++] & 63));
          else if (c < 240)
              r += String.fromCharCode((c & 15) << 12 | (dat[i++] & 63) << 6 | (dat[i++] & 63));
          else
              c = ((c & 15) << 18 | (dat[i++] & 63) << 12 | (dat[i++] & 63) << 6 | (dat[i++] & 63)) - 65536,
                  r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
      }
      return r;
  }

  const MARK = 'v1';

  const pack = (event) => {
      const _e = Object.assign(Object.assign({}, event), { v: MARK });
      return strFromU8(zlibSync(strToU8(JSON.stringify(_e))), true);
  };

  const unpack = (raw) => {
      if (typeof raw !== 'string') {
          return raw;
      }
      try {
          const e = JSON.parse(raw);
          if (e.timestamp) {
              return e;
          }
      }
      catch (error) {
      }
      try {
          const e = JSON.parse(strFromU8(unzlibSync(strToU8(raw, true))));
          if (e.v === MARK) {
              return e;
          }
          throw new Error(`These events were packed with packer ${e.v} which is incompatible with current packer ${MARK}.`);
      }
      catch (error) {
          console.error(error);
          throw new Error('Unknown data format.');
      }
  };

  exports.Replayer = Replayer;
  exports.addCustomEvent = addCustomEvent;
  exports.freezePage = freezePage;
  exports.mirror = mirror;
  exports.pack = pack;
  exports.record = record;
  exports.unpack = unpack;
  exports.utils = utils;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
