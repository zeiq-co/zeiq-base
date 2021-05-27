(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('graphql')) :
  typeof define === 'function' && define.amd ? define(['graphql'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.zeiqCore = factory(global.graphql));
}(this, (function (graphql) { 'use strict';

  var makeId = (length) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  var absoluteUrl = (req, setLocalhost) => {
    let protocol = 'https:';
    let host = req
      ? req.headers['x-forwarded-host'] || req.headers.host
      : window.location.host;
    if (host.indexOf('localhost') > -1) {
      if (setLocalhost) host = setLocalhost;
      protocol = 'http:';
    }
    return {
      protocol,
      host,
      origin: `${protocol}//${host}`,
      url: req,
    };
  };

  var helpers = { makeId, absoluteUrl };

  var libs = {};

  /*
   * @params {request} extracted from request response
   * @return {object} object of parse jwt cookie decode object
   */
  var getAppCookies = (req) => {
    const parsedItems = {};
    if (req.headers.cookie) {
      const cookiesItems = req.headers.cookie.split('; ');
      cookiesItems.forEach((cookies) => {
        const parsedItem = cookies.split('=');
        parsedItems[parsedItem[0]] = decodeURI(parsedItem[1]);
      });
    }
    return parsedItems;
  };

  var auth = { getAppCookies };

  var global$1 = (typeof global !== "undefined" ? global :
              typeof self !== "undefined" ? self :
              typeof window !== "undefined" ? window : {});

  // shim for using process in browser
  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  var cachedSetTimeout = defaultSetTimout;
  var cachedClearTimeout = defaultClearTimeout;
  if (typeof global$1.setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
  }
  if (typeof global$1.clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
  }

  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }


  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }



  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;

  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }

  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  function nextTick(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  }
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  var title = 'browser';
  var platform = 'browser';
  var browser = true;
  var env = {};
  var argv = [];
  var version = ''; // empty string to avoid regexp issues
  var versions = {};
  var release = {};
  var config = {};

  function noop() {}

  var on = noop;
  var addListener = noop;
  var once = noop;
  var off = noop;
  var removeListener = noop;
  var removeAllListeners = noop;
  var emit = noop;

  function binding(name) {
      throw new Error('process.binding is not supported');
  }

  function cwd () { return '/' }
  function chdir (dir) {
      throw new Error('process.chdir is not supported');
  }function umask() { return 0; }

  // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
  var performance = global$1.performance || {};
  var performanceNow =
    performance.now        ||
    performance.mozNow     ||
    performance.msNow      ||
    performance.oNow       ||
    performance.webkitNow  ||
    function(){ return (new Date()).getTime() };

  // generate timestamp or delta
  // see http://nodejs.org/api/process.html#process_process_hrtime
  function hrtime(previousTimestamp){
    var clocktime = performanceNow.call(performance)*1e-3;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor((clocktime%1)*1e9);
    if (previousTimestamp) {
      seconds = seconds - previousTimestamp[0];
      nanoseconds = nanoseconds - previousTimestamp[1];
      if (nanoseconds<0) {
        seconds--;
        nanoseconds += 1e9;
      }
    }
    return [seconds,nanoseconds]
  }

  var startTime = new Date();
  function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
  }

  var process = {
    nextTick: nextTick,
    title: title,
    browser: browser,
    env: env,
    argv: argv,
    version: version,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty$4 = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty$4.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  var react_production_min = createCommonjsModule(function (module, exports) {
  var n=60103,p=60106;exports.Fragment=60107;exports.StrictMode=60108;exports.Profiler=60114;var q=60109,r=60110,t=60112;exports.Suspense=60113;var u=60115,v=60116;
  if("function"===typeof Symbol&&Symbol.for){var w=Symbol.for;n=w("react.element");p=w("react.portal");exports.Fragment=w("react.fragment");exports.StrictMode=w("react.strict_mode");exports.Profiler=w("react.profiler");q=w("react.provider");r=w("react.context");t=w("react.forward_ref");exports.Suspense=w("react.suspense");u=w("react.memo");v=w("react.lazy");}var x="function"===typeof Symbol&&Symbol.iterator;
  function y(a){if(null===a||"object"!==typeof a)return null;a=x&&a[x]||a["@@iterator"];return "function"===typeof a?a:null}function z(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
  var A={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B={};function C(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A;}C.prototype.isReactComponent={};C.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error(z(85));this.updater.enqueueSetState(this,a,b,"setState");};C.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};
  function D(){}D.prototype=C.prototype;function E(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A;}var F=E.prototype=new D;F.constructor=E;objectAssign(F,C.prototype);F.isPureReactComponent=!0;var G={current:null},H=Object.prototype.hasOwnProperty,I={key:!0,ref:!0,__self:!0,__source:!0};
  function J(a,b,c){var e,d={},k=null,h=null;if(null!=b)for(e in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)H.call(b,e)&&!I.hasOwnProperty(e)&&(d[e]=b[e]);var g=arguments.length-2;if(1===g)d.children=c;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];d.children=f;}if(a&&a.defaultProps)for(e in g=a.defaultProps,g)void 0===d[e]&&(d[e]=g[e]);return {$$typeof:n,type:a,key:k,ref:h,props:d,_owner:G.current}}
  function K(a,b){return {$$typeof:n,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function L(a){return "object"===typeof a&&null!==a&&a.$$typeof===n}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var M=/\/+/g;function N(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
  function O(a,b,c,e,d){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case n:case p:h=!0;}}if(h)return h=a,d=d(h),a=""===e?"."+N(h,0):e,Array.isArray(d)?(c="",null!=a&&(c=a.replace(M,"$&/")+"/"),O(d,b,c,"",function(a){return a})):null!=d&&(L(d)&&(d=K(d,c+(!d.key||h&&h.key===d.key?"":(""+d.key).replace(M,"$&/")+"/")+a)),b.push(d)),1;h=0;e=""===e?".":e+":";if(Array.isArray(a))for(var g=
  0;g<a.length;g++){k=a[g];var f=e+N(k,g);h+=O(k,b,c,f,d);}else if(f=y(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=e+N(k,g++),h+=O(k,b,c,f,d);else if("object"===k)throw b=""+a,Error(z(31,"[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b));return h}function P(a,b,c){if(null==a)return a;var e=[],d=0;O(a,e,"","",function(a){return b.call(c,a,d++)});return e}
  function Q(a){if(-1===a._status){var b=a._result;b=b();a._status=0;a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b);},function(b){0===a._status&&(a._status=2,a._result=b);});}if(1===a._status)return a._result;throw a._result;}var R={current:null};function S(){var a=R.current;if(null===a)throw Error(z(321));return a}var T={ReactCurrentDispatcher:R,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:G,IsSomeRendererActing:{current:!1},assign:objectAssign};
  exports.Children={map:P,forEach:function(a,b,c){P(a,function(){b.apply(this,arguments);},c);},count:function(a){var b=0;P(a,function(){b++;});return b},toArray:function(a){return P(a,function(a){return a})||[]},only:function(a){if(!L(a))throw Error(z(143));return a}};exports.Component=C;exports.PureComponent=E;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=T;
  exports.cloneElement=function(a,b,c){if(null===a||void 0===a)throw Error(z(267,a));var e=objectAssign({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=G.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)H.call(b,f)&&!I.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){g=Array(f);for(var m=0;m<f;m++)g[m]=arguments[m+2];e.children=g;}return {$$typeof:n,type:a.type,
  key:d,ref:k,props:e,_owner:h}};exports.createContext=function(a,b){void 0===b&&(b=null);a={$$typeof:r,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:q,_context:a};return a.Consumer=a};exports.createElement=J;exports.createFactory=function(a){var b=J.bind(null,a);b.type=a;return b};exports.createRef=function(){return {current:null}};exports.forwardRef=function(a){return {$$typeof:t,render:a}};exports.isValidElement=L;
  exports.lazy=function(a){return {$$typeof:v,_payload:{_status:-1,_result:a},_init:Q}};exports.memo=function(a,b){return {$$typeof:u,type:a,compare:void 0===b?null:b}};exports.useCallback=function(a,b){return S().useCallback(a,b)};exports.useContext=function(a,b){return S().useContext(a,b)};exports.useDebugValue=function(){};exports.useEffect=function(a,b){return S().useEffect(a,b)};exports.useImperativeHandle=function(a,b,c){return S().useImperativeHandle(a,b,c)};
  exports.useLayoutEffect=function(a,b){return S().useLayoutEffect(a,b)};exports.useMemo=function(a,b){return S().useMemo(a,b)};exports.useReducer=function(a,b,c){return S().useReducer(a,b,c)};exports.useRef=function(a){return S().useRef(a)};exports.useState=function(a){return S().useState(a)};exports.version="17.0.2";
  });
  react_production_min.Fragment;
  react_production_min.StrictMode;
  react_production_min.Profiler;
  react_production_min.Suspense;
  react_production_min.Children;
  react_production_min.Component;
  react_production_min.PureComponent;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  react_production_min.cloneElement;
  react_production_min.createContext;
  react_production_min.createElement;
  react_production_min.createFactory;
  react_production_min.createRef;
  react_production_min.forwardRef;
  react_production_min.isValidElement;
  react_production_min.lazy;
  react_production_min.memo;
  react_production_min.useCallback;
  react_production_min.useContext;
  react_production_min.useDebugValue;
  react_production_min.useEffect;
  react_production_min.useImperativeHandle;
  react_production_min.useLayoutEffect;
  react_production_min.useMemo;
  react_production_min.useReducer;
  react_production_min.useRef;
  react_production_min.useState;
  react_production_min.version;

  var react_development = createCommonjsModule(function (module, exports) {

  {
    (function() {

  var _assign = objectAssign;

  // TODO: this is special because it gets imported during build.
  var ReactVersion = '17.0.2';

  // ATTENTION
  // When adding new symbols to this file,
  // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var REACT_ELEMENT_TYPE = 0xeac7;
  var REACT_PORTAL_TYPE = 0xeaca;
  exports.Fragment = 0xeacb;
  exports.StrictMode = 0xeacc;
  exports.Profiler = 0xead2;
  var REACT_PROVIDER_TYPE = 0xeacd;
  var REACT_CONTEXT_TYPE = 0xeace;
  var REACT_FORWARD_REF_TYPE = 0xead0;
  exports.Suspense = 0xead1;
  var REACT_SUSPENSE_LIST_TYPE = 0xead8;
  var REACT_MEMO_TYPE = 0xead3;
  var REACT_LAZY_TYPE = 0xead4;
  var REACT_BLOCK_TYPE = 0xead9;
  var REACT_SERVER_BLOCK_TYPE = 0xeada;
  var REACT_FUNDAMENTAL_TYPE = 0xead5;
  var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
  var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

  if (typeof Symbol === 'function' && Symbol.for) {
    var symbolFor = Symbol.for;
    REACT_ELEMENT_TYPE = symbolFor('react.element');
    REACT_PORTAL_TYPE = symbolFor('react.portal');
    exports.Fragment = symbolFor('react.fragment');
    exports.StrictMode = symbolFor('react.strict_mode');
    exports.Profiler = symbolFor('react.profiler');
    REACT_PROVIDER_TYPE = symbolFor('react.provider');
    REACT_CONTEXT_TYPE = symbolFor('react.context');
    REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
    exports.Suspense = symbolFor('react.suspense');
    REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
    REACT_MEMO_TYPE = symbolFor('react.memo');
    REACT_LAZY_TYPE = symbolFor('react.lazy');
    REACT_BLOCK_TYPE = symbolFor('react.block');
    REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
    REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
    symbolFor('react.scope');
    symbolFor('react.opaque.id');
    REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
    symbolFor('react.offscreen');
    REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
  }

  var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';
  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }

    var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }

    return null;
  }

  /**
   * Keeps track of the current dispatcher.
   */
  var ReactCurrentDispatcher = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  /**
   * Keeps track of the current batch's configuration such as how long an update
   * should suspend for if it needs to.
   */
  var ReactCurrentBatchConfig = {
    transition: 0
  };

  /**
   * Keeps track of the current owner.
   *
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */
  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  var ReactDebugCurrentFrame = {};
  var currentExtraStackFrame = null;
  function setExtraStackFrame(stack) {
    {
      currentExtraStackFrame = stack;
    }
  }

  {
    ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
      {
        currentExtraStackFrame = stack;
      }
    }; // Stack implementation injected by the current renderer.


    ReactDebugCurrentFrame.getCurrentStack = null;

    ReactDebugCurrentFrame.getStackAddendum = function () {
      var stack = ''; // Add an extra top frame while an element is being validated

      if (currentExtraStackFrame) {
        stack += currentExtraStackFrame;
      } // Delegate to the injected renderer-specific implementation


      var impl = ReactDebugCurrentFrame.getCurrentStack;

      if (impl) {
        stack += impl() || '';
      }

      return stack;
    };
  }

  /**
   * Used by act() to track whether you're inside an act() scope.
   */
  var IsSomeRendererActing = {
    current: false
  };

  var ReactSharedInternals = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentBatchConfig: ReactCurrentBatchConfig,
    ReactCurrentOwner: ReactCurrentOwner,
    IsSomeRendererActing: IsSomeRendererActing,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: _assign
  };

  {
    ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
  }

  // by calls to these methods by a Babel plugin.
  //
  // In PROD (or in packages without access to React internals),
  // they are left as they are instead.

  function warn(format) {
    {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      printWarning('warn', format, args);
    }
  }
  function error(format) {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }

  function printWarning(level, format, args) {
    // When changing this logic, you might want to also
    // update consoleWithStackDev.www.js as well.
    {
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();

      if (stack !== '') {
        format += '%s';
        args = args.concat([stack]);
      }

      var argsWithFormat = args.map(function (item) {
        return '' + item;
      }); // Careful: RN currently depends on this prefix

      argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
      // breaks IE9: https://github.com/facebook/react/issues/13610
      // eslint-disable-next-line react-internal/no-production-logging

      Function.prototype.apply.call(console[level], console, argsWithFormat);
    }
  }

  var didWarnStateUpdateForUnmountedComponent = {};

  function warnNoop(publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
      var warningKey = componentName + "." + callerName;

      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }

      error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }
  /**
   * This is the abstract API for an update queue.
   */


  var ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function (publicInstance) {
      return false;
    },

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} Name of the calling function in the public API.
     * @internal
     */
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };

  var emptyObject = {};

  {
    Object.freeze(emptyObject);
  }
  /**
   * Base class helpers for the updating state of a component.
   */


  function Component(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
    // renderer.

    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};
  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */

  Component.prototype.setState = function (partialState, callback) {
    if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
      {
        throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
      }
    }

    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };
  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */


  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };
  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   */


  {
    var deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };

    var defineDeprecationWarning = function (methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

          return undefined;
        }
      });
    };

    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy() {}

  ComponentDummy.prototype = Component.prototype;
  /**
   * Convenience component with default shallow equality check for sCU.
   */

  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

  _assign(pureComponentPrototype, Component.prototype);

  pureComponentPrototype.isPureReactComponent = true;

  // an immutable object with a single mutable value
  function createRef() {
    var refObject = {
      current: null
    };

    {
      Object.seal(refObject);
    }

    return refObject;
  }

  function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || '';
    return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
  }

  function getContextName(type) {
    return type.displayName || 'Context';
  }

  function getComponentName(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }

    {
      if (typeof type.tag === 'number') {
        error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }

    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }

    if (typeof type === 'string') {
      return type;
    }

    switch (type) {
      case exports.Fragment:
        return 'Fragment';

      case REACT_PORTAL_TYPE:
        return 'Portal';

      case exports.Profiler:
        return 'Profiler';

      case exports.StrictMode:
        return 'StrictMode';

      case exports.Suspense:
        return 'Suspense';

      case REACT_SUSPENSE_LIST_TYPE:
        return 'SuspenseList';
    }

    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          var context = type;
          return getContextName(context) + '.Consumer';

        case REACT_PROVIDER_TYPE:
          var provider = type;
          return getContextName(provider._context) + '.Provider';

        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');

        case REACT_MEMO_TYPE:
          return getComponentName(type.type);

        case REACT_BLOCK_TYPE:
          return getComponentName(type._render);

        case REACT_LAZY_TYPE:
          {
            var lazyComponent = type;
            var payload = lazyComponent._payload;
            var init = lazyComponent._init;

            try {
              return getComponentName(init(payload));
            } catch (x) {
              return null;
            }
          }
      }
    }

    return null;
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };
  var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

  {
    didWarnAboutStringRefs = {};
  }

  function hasValidRef(config) {
    {
      if (hasOwnProperty.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }

    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    {
      if (hasOwnProperty.call(config, 'key')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }

    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
      {
        if (!specialPropKeyWarningShown) {
          specialPropKeyWarningShown = true;

          error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
        }
      }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }

  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
      {
        if (!specialPropRefWarningShown) {
          specialPropRefWarningShown = true;

          error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
        }
      }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }

  function warnIfStringRefCannotBeAutoConverted(config) {
    {
      if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
        var componentName = getComponentName(ReactCurrentOwner.current.type);

        if (!didWarnAboutStringRefs[componentName]) {
          error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);

          didWarnAboutStringRefs[componentName] = true;
        }
      }
    }
  }
  /**
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, instanceof check
   * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
   * if something is a React Element.
   *
   * @param {*} type
   * @param {*} props
   * @param {*} key
   * @param {string|object} ref
   * @param {*} owner
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @internal
   */


  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,
      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,
      // Record the component responsible for creating this element.
      _owner: owner
    };

    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.

      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      }); // self and source are DEV only properties.

      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      }); // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.

      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });

      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element;
  };
  /**
   * Create and return a new ReactElement of the given type.
   * See https://reactjs.org/docs/react-api.html#createelement
   */

  function createElement(type, config, children) {
    var propName; // Reserved names are extracted

    var props = {};
    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;

        {
          warnIfStringRefCannotBeAutoConverted(config);
        }
      }

      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


    var childrenLength = arguments.length - 2;

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }

      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }

      props.children = childArray;
    } // Resolve default props


    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    {
      if (key || ref) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }

        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
    return newElement;
  }
  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://reactjs.org/docs/react-api.html#cloneelement
   */

  function cloneElement(element, config, children) {
    if (!!(element === null || element === undefined)) {
      {
        throw Error( "React.cloneElement(...): The argument must be a React element, but you passed " + element + "." );
      }
    }

    var propName; // Original props are copied

    var props = _assign({}, element.props); // Reserved names are extracted


    var key = element.key;
    var ref = element.ref; // Self is preserved since the owner is preserved.

    var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.

    var source = element._source; // Owner will be preserved, unless ref is overridden

    var owner = element._owner;

    if (config != null) {
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }

      if (hasValidKey(config)) {
        key = '' + config.key;
      } // Remaining properties override existing props


      var defaultProps;

      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }

      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


    var childrenLength = arguments.length - 2;

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }

      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  }
  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */

  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }

  var SEPARATOR = '.';
  var SUBSEPARATOR = ':';
  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */

  function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedString = key.replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });
    return '$' + escapedString;
  }
  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */


  var didWarnAboutMaps = false;
  var userProvidedKeyEscapeRegex = /\/+/g;

  function escapeUserProvidedKey(text) {
    return text.replace(userProvidedKeyEscapeRegex, '$&/');
  }
  /**
   * Generate a key string that identifies a element within a set.
   *
   * @param {*} element A element that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */


  function getElementKey(element, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (typeof element === 'object' && element !== null && element.key != null) {
      // Explicit key
      return escape('' + element.key);
    } // Implicit key determined by the index in the set


    return index.toString(36);
  }

  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // All of the above are perceived as null.
      children = null;
    }

    var invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case 'string':
        case 'number':
          invokeCallback = true;
          break;

        case 'object':
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }

      }
    }

    if (invokeCallback) {
      var _child = children;
      var mappedChild = callback(_child); // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows:

      var childKey = nameSoFar === '' ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;

      if (Array.isArray(mappedChild)) {
        var escapedChildKey = '';

        if (childKey != null) {
          escapedChildKey = escapeUserProvidedKey(childKey) + '/';
        }

        mapIntoArray(mappedChild, array, escapedChildKey, '', function (c) {
          return c;
        });
      } else if (mappedChild != null) {
        if (isValidElement(mappedChild)) {
          mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          escapedPrefix + ( // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
          mappedChild.key && (!_child || _child.key !== mappedChild.key) ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
          escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey);
        }

        array.push(mappedChild);
      }

      return 1;
    }

    var child;
    var nextName;
    var subtreeCount = 0; // Count of children found in the current subtree.

    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getElementKey(child, i);
        subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
      }
    } else {
      var iteratorFn = getIteratorFn(children);

      if (typeof iteratorFn === 'function') {
        var iterableChildren = children;

        {
          // Warn about using Maps as children
          if (iteratorFn === iterableChildren.entries) {
            if (!didWarnAboutMaps) {
              warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
            }

            didWarnAboutMaps = true;
          }
        }

        var iterator = iteratorFn.call(iterableChildren);
        var step;
        var ii = 0;

        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getElementKey(child, ii++);
          subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
        }
      } else if (type === 'object') {
        var childrenString = '' + children;

        {
          {
            throw Error( "Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + "). If you meant to render a collection of children, use an array instead." );
          }
        }
      }
    }

    return subtreeCount;
  }

  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * The provided mapFunction(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }

    var result = [];
    var count = 0;
    mapIntoArray(children, result, '', '', function (child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */


  function countChildren(children) {
    var n = 0;
    mapChildren(children, function () {
      n++; // Don't return anything
    });
    return n;
  }

  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */
  function forEachChildren(children, forEachFunc, forEachContext) {
    mapChildren(children, function () {
      forEachFunc.apply(this, arguments); // Don't return anything.
    }, forEachContext);
  }
  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */


  function toArray(children) {
    return mapChildren(children, function (child) {
      return child;
    }) || [];
  }
  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */


  function onlyChild(children) {
    if (!isValidElement(children)) {
      {
        throw Error( "React.Children.only expected to receive a single React element child." );
      }
    }

    return children;
  }

  function createContext(defaultValue, calculateChangedBits) {
    if (calculateChangedBits === undefined) {
      calculateChangedBits = null;
    } else {
      {
        if (calculateChangedBits !== null && typeof calculateChangedBits !== 'function') {
          error('createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits);
        }
      }
    }

    var context = {
      $$typeof: REACT_CONTEXT_TYPE,
      _calculateChangedBits: calculateChangedBits,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null
    };
    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context
    };
    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;
    var hasWarnedAboutDisplayNameOnConsumer = false;

    {
      // A separate object, but proxies back to the original context object for
      // backwards compatibility. It has a different $$typeof, so we can properly
      // warn for the incorrect usage of Context as a Consumer.
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
        _calculateChangedBits: context._calculateChangedBits
      }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;

              error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
            }

            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          }
        },
        _currentValue: {
          get: function () {
            return context._currentValue;
          },
          set: function (_currentValue) {
            context._currentValue = _currentValue;
          }
        },
        _currentValue2: {
          get: function () {
            return context._currentValue2;
          },
          set: function (_currentValue2) {
            context._currentValue2 = _currentValue2;
          }
        },
        _threadCount: {
          get: function () {
            return context._threadCount;
          },
          set: function (_threadCount) {
            context._threadCount = _threadCount;
          }
        },
        Consumer: {
          get: function () {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;

              error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
            }

            return context.Consumer;
          }
        },
        displayName: {
          get: function () {
            return context.displayName;
          },
          set: function (displayName) {
            if (!hasWarnedAboutDisplayNameOnConsumer) {
              warn('Setting `displayName` on Context.Consumer has no effect. ' + "You should set it directly on the context with Context.displayName = '%s'.", displayName);

              hasWarnedAboutDisplayNameOnConsumer = true;
            }
          }
        }
      }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

      context.Consumer = Consumer;
    }

    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }

    return context;
  }

  var Uninitialized = -1;
  var Pending = 0;
  var Resolved = 1;
  var Rejected = 2;

  function lazyInitializer(payload) {
    if (payload._status === Uninitialized) {
      var ctor = payload._result;
      var thenable = ctor(); // Transition to the next state.

      var pending = payload;
      pending._status = Pending;
      pending._result = thenable;
      thenable.then(function (moduleObject) {
        if (payload._status === Pending) {
          var defaultExport = moduleObject.default;

          {
            if (defaultExport === undefined) {
              error('lazy: Expected the result of a dynamic import() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
              'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
            }
          } // Transition to the next state.


          var resolved = payload;
          resolved._status = Resolved;
          resolved._result = defaultExport;
        }
      }, function (error) {
        if (payload._status === Pending) {
          // Transition to the next state.
          var rejected = payload;
          rejected._status = Rejected;
          rejected._result = error;
        }
      });
    }

    if (payload._status === Resolved) {
      return payload._result;
    } else {
      throw payload._result;
    }
  }

  function lazy(ctor) {
    var payload = {
      // We use these fields to store the result.
      _status: -1,
      _result: ctor
    };
    var lazyType = {
      $$typeof: REACT_LAZY_TYPE,
      _payload: payload,
      _init: lazyInitializer
    };

    {
      // In production, this would just set it on the object.
      var defaultProps;
      var propTypes; // $FlowFixMe

      Object.defineProperties(lazyType, {
        defaultProps: {
          configurable: true,
          get: function () {
            return defaultProps;
          },
          set: function (newDefaultProps) {
            error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

            defaultProps = newDefaultProps; // Match production behavior more closely:
            // $FlowFixMe

            Object.defineProperty(lazyType, 'defaultProps', {
              enumerable: true
            });
          }
        },
        propTypes: {
          configurable: true,
          get: function () {
            return propTypes;
          },
          set: function (newPropTypes) {
            error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

            propTypes = newPropTypes; // Match production behavior more closely:
            // $FlowFixMe

            Object.defineProperty(lazyType, 'propTypes', {
              enumerable: true
            });
          }
        }
      });
    }

    return lazyType;
  }

  function forwardRef(render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
      } else if (typeof render !== 'function') {
        error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        if (render.length !== 0 && render.length !== 2) {
          error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
        }
      }

      if (render != null) {
        if (render.defaultProps != null || render.propTypes != null) {
          error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
        }
      }
    }

    var elementType = {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render: render
    };

    {
      var ownName;
      Object.defineProperty(elementType, 'displayName', {
        enumerable: false,
        configurable: true,
        get: function () {
          return ownName;
        },
        set: function (name) {
          ownName = name;

          if (render.displayName == null) {
            render.displayName = name;
          }
        }
      });
    }

    return elementType;
  }

  // Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

  var enableScopeAPI = false; // Experimental Create Event Handle API.

  function isValidElementType(type) {
    if (typeof type === 'string' || typeof type === 'function') {
      return true;
    } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


    if (type === exports.Fragment || type === exports.Profiler || type === REACT_DEBUG_TRACING_MODE_TYPE || type === exports.StrictMode || type === exports.Suspense || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI ) {
      return true;
    }

    if (typeof type === 'object' && type !== null) {
      if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
        return true;
      }
    }

    return false;
  }

  function memo(type, compare) {
    {
      if (!isValidElementType(type)) {
        error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }

    var elementType = {
      $$typeof: REACT_MEMO_TYPE,
      type: type,
      compare: compare === undefined ? null : compare
    };

    {
      var ownName;
      Object.defineProperty(elementType, 'displayName', {
        enumerable: false,
        configurable: true,
        get: function () {
          return ownName;
        },
        set: function (name) {
          ownName = name;

          if (type.displayName == null) {
            type.displayName = name;
          }
        }
      });
    }

    return elementType;
  }

  function resolveDispatcher() {
    var dispatcher = ReactCurrentDispatcher.current;

    if (!(dispatcher !== null)) {
      {
        throw Error( "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem." );
      }
    }

    return dispatcher;
  }

  function useContext(Context, unstable_observedBits) {
    var dispatcher = resolveDispatcher();

    {
      if (unstable_observedBits !== undefined) {
        error('useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://reactjs.org/link/rules-of-hooks' : '');
      } // TODO: add a more generic warning for invalid values.


      if (Context._context !== undefined) {
        var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
        // and nobody should be using this in existing code.

        if (realContext.Consumer === Context) {
          error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
        } else if (realContext.Provider === Context) {
          error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
        }
      }
    }

    return dispatcher.useContext(Context, unstable_observedBits);
  }
  function useState(initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }
  function useReducer(reducer, initialArg, init) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }
  function useRef(initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }
  function useEffect(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, deps);
  }
  function useLayoutEffect(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, deps);
  }
  function useCallback(callback, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, deps);
  }
  function useMemo(create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, deps);
  }
  function useImperativeHandle(ref, create, deps) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, deps);
  }
  function useDebugValue(value, formatterFn) {
    {
      var dispatcher = resolveDispatcher();
      return dispatcher.useDebugValue(value, formatterFn);
    }
  }

  // Helpers to patch console.logs to avoid logging during side-effect free
  // replaying on render function. This currently only patches the object
  // lazily which won't cover if the log function was extracted eagerly.
  // We could also eagerly patch the method.
  var disabledDepth = 0;
  var prevLog;
  var prevInfo;
  var prevWarn;
  var prevError;
  var prevGroup;
  var prevGroupCollapsed;
  var prevGroupEnd;

  function disabledLog() {}

  disabledLog.__reactDisabledLog = true;
  function disableLogs() {
    {
      if (disabledDepth === 0) {
        /* eslint-disable react-internal/no-production-logging */
        prevLog = console.log;
        prevInfo = console.info;
        prevWarn = console.warn;
        prevError = console.error;
        prevGroup = console.group;
        prevGroupCollapsed = console.groupCollapsed;
        prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

        var props = {
          configurable: true,
          enumerable: true,
          value: disabledLog,
          writable: true
        }; // $FlowFixMe Flow thinks console is immutable.

        Object.defineProperties(console, {
          info: props,
          log: props,
          warn: props,
          error: props,
          group: props,
          groupCollapsed: props,
          groupEnd: props
        });
        /* eslint-enable react-internal/no-production-logging */
      }

      disabledDepth++;
    }
  }
  function reenableLogs() {
    {
      disabledDepth--;

      if (disabledDepth === 0) {
        /* eslint-disable react-internal/no-production-logging */
        var props = {
          configurable: true,
          enumerable: true,
          writable: true
        }; // $FlowFixMe Flow thinks console is immutable.

        Object.defineProperties(console, {
          log: _assign({}, props, {
            value: prevLog
          }),
          info: _assign({}, props, {
            value: prevInfo
          }),
          warn: _assign({}, props, {
            value: prevWarn
          }),
          error: _assign({}, props, {
            value: prevError
          }),
          group: _assign({}, props, {
            value: prevGroup
          }),
          groupCollapsed: _assign({}, props, {
            value: prevGroupCollapsed
          }),
          groupEnd: _assign({}, props, {
            value: prevGroupEnd
          })
        });
        /* eslint-enable react-internal/no-production-logging */
      }

      if (disabledDepth < 0) {
        error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
      }
    }
  }

  var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
  var prefix;
  function describeBuiltInComponentFrame(name, source, ownerFn) {
    {
      if (prefix === undefined) {
        // Extract the VM specific prefix used by each line.
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || '';
        }
      } // We use the prefix to ensure our stacks line up with native stack frames.


      return '\n' + prefix + name;
    }
  }
  var reentry = false;
  var componentFrameCache;

  {
    var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
    componentFrameCache = new PossiblyWeakMap();
  }

  function describeNativeComponentFrame(fn, construct) {
    // If something asked for a stack inside a fake render, it should get ignored.
    if (!fn || reentry) {
      return '';
    }

    {
      var frame = componentFrameCache.get(fn);

      if (frame !== undefined) {
        return frame;
      }
    }

    var control;
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

    Error.prepareStackTrace = undefined;
    var previousDispatcher;

    {
      previousDispatcher = ReactCurrentDispatcher$1.current; // Set the dispatcher in DEV because this might be call in the render function
      // for warnings.

      ReactCurrentDispatcher$1.current = null;
      disableLogs();
    }

    try {
      // This should throw.
      if (construct) {
        // Something should be setting the props in the constructor.
        var Fake = function () {
          throw Error();
        }; // $FlowFixMe


        Object.defineProperty(Fake.prototype, 'props', {
          set: function () {
            // We use a throwing setter instead of frozen or non-writable props
            // because that won't throw in a non-strict mode function.
            throw Error();
          }
        });

        if (typeof Reflect === 'object' && Reflect.construct) {
          // We construct a different control for this case to include any extra
          // frames added by the construct call.
          try {
            Reflect.construct(Fake, []);
          } catch (x) {
            control = x;
          }

          Reflect.construct(fn, [], Fake);
        } else {
          try {
            Fake.call();
          } catch (x) {
            control = x;
          }

          fn.call(Fake.prototype);
        }
      } else {
        try {
          throw Error();
        } catch (x) {
          control = x;
        }

        fn();
      }
    } catch (sample) {
      // This is inlined manually because closure doesn't do it for us.
      if (sample && control && typeof sample.stack === 'string') {
        // This extracts the first frame from the sample that isn't also in the control.
        // Skipping one frame that we assume is the frame that calls the two.
        var sampleLines = sample.stack.split('\n');
        var controlLines = control.stack.split('\n');
        var s = sampleLines.length - 1;
        var c = controlLines.length - 1;

        while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
          // We expect at least one stack frame to be shared.
          // Typically this will be the root most one. However, stack frames may be
          // cut off due to maximum stack limits. In this case, one maybe cut off
          // earlier than the other. We assume that the sample is longer or the same
          // and there for cut off earlier. So we should find the root most frame in
          // the sample somewhere in the control.
          c--;
        }

        for (; s >= 1 && c >= 0; s--, c--) {
          // Next we find the first one that isn't the same which should be the
          // frame that called our sample function and the control.
          if (sampleLines[s] !== controlLines[c]) {
            // In V8, the first line is describing the message but other VMs don't.
            // If we're about to return the first line, and the control is also on the same
            // line, that's a pretty good indicator that our sample threw at same line as
            // the control. I.e. before we entered the sample frame. So we ignore this result.
            // This can happen if you passed a class to function component, or non-function.
            if (s !== 1 || c !== 1) {
              do {
                s--;
                c--; // We may still have similar intermediate frames from the construct call.
                // The next one that isn't the same should be our match though.

                if (c < 0 || sampleLines[s] !== controlLines[c]) {
                  // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                  var _frame = '\n' + sampleLines[s].replace(' at new ', ' at ');

                  {
                    if (typeof fn === 'function') {
                      componentFrameCache.set(fn, _frame);
                    }
                  } // Return the line we found.


                  return _frame;
                }
              } while (s >= 1 && c >= 0);
            }

            break;
          }
        }
      }
    } finally {
      reentry = false;

      {
        ReactCurrentDispatcher$1.current = previousDispatcher;
        reenableLogs();
      }

      Error.prepareStackTrace = previousPrepareStackTrace;
    } // Fallback to just using the name if we couldn't make it throw.


    var name = fn ? fn.displayName || fn.name : '';
    var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

    {
      if (typeof fn === 'function') {
        componentFrameCache.set(fn, syntheticFrame);
      }
    }

    return syntheticFrame;
  }
  function describeFunctionComponentFrame(fn, source, ownerFn) {
    {
      return describeNativeComponentFrame(fn, false);
    }
  }

  function shouldConstruct(Component) {
    var prototype = Component.prototype;
    return !!(prototype && prototype.isReactComponent);
  }

  function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

    if (type == null) {
      return '';
    }

    if (typeof type === 'function') {
      {
        return describeNativeComponentFrame(type, shouldConstruct(type));
      }
    }

    if (typeof type === 'string') {
      return describeBuiltInComponentFrame(type);
    }

    switch (type) {
      case exports.Suspense:
        return describeBuiltInComponentFrame('Suspense');

      case REACT_SUSPENSE_LIST_TYPE:
        return describeBuiltInComponentFrame('SuspenseList');
    }

    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_FORWARD_REF_TYPE:
          return describeFunctionComponentFrame(type.render);

        case REACT_MEMO_TYPE:
          // Memo may contain any component type so we recursively resolve it.
          return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

        case REACT_BLOCK_TYPE:
          return describeFunctionComponentFrame(type._render);

        case REACT_LAZY_TYPE:
          {
            var lazyComponent = type;
            var payload = lazyComponent._payload;
            var init = lazyComponent._init;

            try {
              // Lazy may contain any component type so we recursively resolve it.
              return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
            } catch (x) {}
          }
      }
    }

    return '';
  }

  var loggedTypeFailures = {};
  var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

  function setCurrentlyValidatingElement(element) {
    {
      if (element) {
        var owner = element._owner;
        var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
        ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
      } else {
        ReactDebugCurrentFrame$1.setExtraStackFrame(null);
      }
    }
  }

  function checkPropTypes(typeSpecs, values, location, componentName, element) {
    {
      // $FlowFixMe This is okay but Flow doesn't know it.
      var has = Function.call.bind(Object.prototype.hasOwnProperty);

      for (var typeSpecName in typeSpecs) {
        if (has(typeSpecs, typeSpecName)) {
          var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.

          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
              err.name = 'Invariant Violation';
              throw err;
            }

            error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
          } catch (ex) {
            error$1 = ex;
          }

          if (error$1 && !(error$1 instanceof Error)) {
            setCurrentlyValidatingElement(element);

            error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

            setCurrentlyValidatingElement(null);
          }

          if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error$1.message] = true;
            setCurrentlyValidatingElement(element);

            error('Failed %s type: %s', location, error$1.message);

            setCurrentlyValidatingElement(null);
          }
        }
      }
    }
  }

  function setCurrentlyValidatingElement$1(element) {
    {
      if (element) {
        var owner = element._owner;
        var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
        setExtraStackFrame(stack);
      } else {
        setExtraStackFrame(null);
      }
    }
  }

  var propTypesMisspellWarningShown;

  {
    propTypesMisspellWarningShown = false;
  }

  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = getComponentName(ReactCurrentOwner.current.type);

      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }

    return '';
  }

  function getSourceInfoErrorAddendum(source) {
    if (source !== undefined) {
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }

    return '';
  }

  function getSourceInfoErrorAddendumForProps(elementProps) {
    if (elementProps !== null && elementProps !== undefined) {
      return getSourceInfoErrorAddendum(elementProps.__source);
    }

    return '';
  }
  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */


  var ownerHasKeyUseWarning = {};

  function getCurrentComponentErrorInfo(parentType) {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

      if (parentName) {
        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }

    return info;
  }
  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */


  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }

    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childOwner = '';

    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      // Give the component that originally created this child.
      childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
    }

    {
      setCurrentlyValidatingElement$1(element);

      error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

      setCurrentlyValidatingElement$1(null);
    }
  }
  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */


  function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
      return;
    }

    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];

        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);

      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */


  function validatePropTypes(element) {
    {
      var type = element.type;

      if (type === null || type === undefined || typeof type === 'string') {
        return;
      }

      var propTypes;

      if (typeof type === 'function') {
        propTypes = type.propTypes;
      } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
      // Inner props are checked in the reconciler.
      type.$$typeof === REACT_MEMO_TYPE)) {
        propTypes = type.propTypes;
      } else {
        return;
      }

      if (propTypes) {
        // Intentionally inside to avoid triggering lazy initializers:
        var name = getComponentName(type);
        checkPropTypes(propTypes, element.props, 'prop', name, element);
      } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
        propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

        var _name = getComponentName(type);

        error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
      }

      if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
        error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
      }
    }
  }
  /**
   * Given a fragment, validate that it can only be provided with fragment props
   * @param {ReactElement} fragment
   */


  function validateFragmentProps(fragment) {
    {
      var keys = Object.keys(fragment.props);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (key !== 'children' && key !== 'key') {
          setCurrentlyValidatingElement$1(fragment);

          error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

          setCurrentlyValidatingElement$1(null);
          break;
        }
      }

      if (fragment.ref !== null) {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid attribute `ref` supplied to `React.Fragment`.');

        setCurrentlyValidatingElement$1(null);
      }
    }
  }
  function createElementWithValidation(type, props, children) {
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validType) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendumForProps(props);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = 'null';
      } else if (Array.isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      {
        error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
      }
    }

    var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    if (type === exports.Fragment) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }
  var didWarnAboutDeprecatedCreateFactory = false;
  function createFactoryWithValidation(type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type;

    {
      if (!didWarnAboutDeprecatedCreateFactory) {
        didWarnAboutDeprecatedCreateFactory = true;

        warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
      } // Legacy hook: remove it


      Object.defineProperty(validatedFactory, 'type', {
        enumerable: false,
        get: function () {
          warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

          Object.defineProperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }

    return validatedFactory;
  }
  function cloneElementWithValidation(element, props, children) {
    var newElement = cloneElement.apply(this, arguments);

    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }

    validatePropTypes(newElement);
    return newElement;
  }

  {

    try {
      var frozenObject = Object.freeze({});
      /* eslint-disable no-new */

      new Map([[frozenObject, null]]);
      new Set([frozenObject]);
      /* eslint-enable no-new */
    } catch (e) {
    }
  }

  var createElement$1 =  createElementWithValidation ;
  var cloneElement$1 =  cloneElementWithValidation ;
  var createFactory =  createFactoryWithValidation ;
  var Children = {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  };

  exports.Children = Children;
  exports.Component = Component;
  exports.PureComponent = PureComponent;
  exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
  exports.cloneElement = cloneElement$1;
  exports.createContext = createContext;
  exports.createElement = createElement$1;
  exports.createFactory = createFactory;
  exports.createRef = createRef;
  exports.forwardRef = forwardRef;
  exports.isValidElement = isValidElement;
  exports.lazy = lazy;
  exports.memo = memo;
  exports.useCallback = useCallback;
  exports.useContext = useContext;
  exports.useDebugValue = useDebugValue;
  exports.useEffect = useEffect;
  exports.useImperativeHandle = useImperativeHandle;
  exports.useLayoutEffect = useLayoutEffect;
  exports.useMemo = useMemo;
  exports.useReducer = useReducer;
  exports.useRef = useRef;
  exports.useState = useState;
  exports.version = ReactVersion;
    })();
  }
  });
  react_development.Fragment;
  react_development.StrictMode;
  react_development.Profiler;
  react_development.Suspense;
  react_development.Children;
  react_development.Component;
  react_development.PureComponent;
  react_development.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  react_development.cloneElement;
  react_development.createContext;
  react_development.createElement;
  react_development.createFactory;
  react_development.createRef;
  react_development.forwardRef;
  react_development.isValidElement;
  react_development.lazy;
  react_development.memo;
  react_development.useCallback;
  react_development.useContext;
  react_development.useDebugValue;
  react_development.useEffect;
  react_development.useImperativeHandle;
  react_development.useLayoutEffect;
  react_development.useMemo;
  react_development.useReducer;
  react_development.useRef;
  react_development.useState;
  react_development.version;

  var react = createCommonjsModule(function (module) {

  {
    module.exports = react_development;
  }
  });
  react.Fragment;
  react.StrictMode;
  react.Profiler;
  react.Suspense;
  react.Children;
  react.Component;
  react.PureComponent;
  react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  react.cloneElement;
  react.createContext;
  react.createElement;
  react.createFactory;
  react.createRef;
  react.forwardRef;
  react.isValidElement;
  react.lazy;
  react.memo;
  react.useCallback;
  var react_19 = react.useContext;
  react.useDebugValue;
  var react_21 = react.useEffect;
  react.useImperativeHandle;
  react.useLayoutEffect;
  react.useMemo;
  react.useReducer;
  var react_26 = react.useRef;
  var react_27 = react.useState;
  react.version;

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

  var extendStatics$1 = function(d, b) {
      extendStatics$1 = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics$1(d, b);
  };

  function __extends$1(d, b) {
      extendStatics$1(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign$1 = function() {
      __assign$1 = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign$1.apply(this, arguments);
  };

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

  function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  }

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
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var genericMessage = "Invariant Violation";
  var _a$3 = Object.setPrototypeOf, setPrototypeOf = _a$3 === void 0 ? function (obj, proto) {
      obj.__proto__ = proto;
      return obj;
  } : _a$3;
  var InvariantError = /** @class */ (function (_super) {
      __extends(InvariantError, _super);
      function InvariantError(message) {
          if (message === void 0) { message = genericMessage; }
          var _this = _super.call(this, typeof message === "number"
              ? genericMessage + ": " + message + " (see https://github.com/apollographql/invariant-packages)"
              : message) || this;
          _this.framesToPop = 1;
          _this.name = genericMessage;
          setPrototypeOf(_this, InvariantError.prototype);
          return _this;
      }
      return InvariantError;
  }(Error));
  function invariant(condition, message) {
      if (!condition) {
          throw new InvariantError(message);
      }
  }
  var verbosityLevels = ["log", "warn", "error", "silent"];
  var verbosityLevel = verbosityLevels.indexOf("log");
  function wrapConsoleMethod(method) {
      return function () {
          if (verbosityLevels.indexOf(method) >= verbosityLevel) {
              return console[method].apply(console, arguments);
          }
      };
  }
  (function (invariant) {
      invariant.log = wrapConsoleMethod("log");
      invariant.warn = wrapConsoleMethod("warn");
      invariant.error = wrapConsoleMethod("error");
  })(invariant || (invariant = {}));
  function setVerbosity(level) {
      var old = verbosityLevels[verbosityLevel];
      verbosityLevel = Math.max(0, verbosityLevels.indexOf(level));
      return old;
  }

  function shouldInclude(_a, variables) {
      var directives = _a.directives;
      if (!directives || !directives.length) {
          return true;
      }
      return getInclusionDirectives(directives).every(function (_a) {
          var directive = _a.directive, ifArgument = _a.ifArgument;
          var evaledValue = false;
          if (ifArgument.value.kind === 'Variable') {
              evaledValue = variables && variables[ifArgument.value.name.value];
              invariant(evaledValue !== void 0, "Invalid variable referenced in @" + directive.name.value + " directive.");
          }
          else {
              evaledValue = ifArgument.value.value;
          }
          return directive.name.value === 'skip' ? !evaledValue : evaledValue;
      });
  }
  function getDirectiveNames(root) {
      var names = [];
      graphql.visit(root, {
          Directive: function (node) {
              names.push(node.name.value);
          },
      });
      return names;
  }
  function hasDirectives(names, root) {
      return getDirectiveNames(root).some(function (name) { return names.indexOf(name) > -1; });
  }
  function isInclusionDirective(_a) {
      var value = _a.name.value;
      return value === 'skip' || value === 'include';
  }
  function getInclusionDirectives(directives) {
      var result = [];
      if (directives && directives.length) {
          directives.forEach(function (directive) {
              if (!isInclusionDirective(directive))
                  return;
              var directiveArguments = directive.arguments;
              var directiveName = directive.name.value;
              invariant(directiveArguments && directiveArguments.length === 1, "Incorrect number of arguments for the @" + directiveName + " directive.");
              var ifArgument = directiveArguments[0];
              invariant(ifArgument.name && ifArgument.name.value === 'if', "Invalid argument for the @" + directiveName + " directive.");
              var ifValue = ifArgument.value;
              invariant(ifValue &&
                  (ifValue.kind === 'Variable' || ifValue.kind === 'BooleanValue'), "Argument for the @" + directiveName + " directive must be a variable or a boolean value.");
              result.push({ directive: directive, ifArgument: ifArgument });
          });
      }
      return result;
  }

  function getFragmentQueryDocument(document, fragmentName) {
      var actualFragmentName = fragmentName;
      var fragments = [];
      document.definitions.forEach(function (definition) {
          if (definition.kind === 'OperationDefinition') {
              throw new InvariantError("Found a " + definition.operation + " operation" + (definition.name ? " named '" + definition.name.value + "'" : '') + ". " +
                  'No operations are allowed when using a fragment as a query. Only fragments are allowed.');
          }
          if (definition.kind === 'FragmentDefinition') {
              fragments.push(definition);
          }
      });
      if (typeof actualFragmentName === 'undefined') {
          invariant(fragments.length === 1, "Found " + fragments.length + " fragments. `fragmentName` must be provided when there is not exactly 1 fragment.");
          actualFragmentName = fragments[0].name.value;
      }
      var query = __assign$1(__assign$1({}, document), { definitions: __spreadArrays([
              {
                  kind: 'OperationDefinition',
                  operation: 'query',
                  selectionSet: {
                      kind: 'SelectionSet',
                      selections: [
                          {
                              kind: 'FragmentSpread',
                              name: {
                                  kind: 'Name',
                                  value: actualFragmentName,
                              },
                          },
                      ],
                  },
              }
          ], document.definitions) });
      return query;
  }
  function createFragmentMap(fragments) {
      if (fragments === void 0) { fragments = []; }
      var symTable = {};
      fragments.forEach(function (fragment) {
          symTable[fragment.name.value] = fragment;
      });
      return symTable;
  }
  function getFragmentFromSelection(selection, fragmentMap) {
      switch (selection.kind) {
          case 'InlineFragment':
              return selection;
          case 'FragmentSpread': {
              var fragment = fragmentMap && fragmentMap[selection.name.value];
              invariant(fragment, "No fragment named " + selection.name.value + ".");
              return fragment;
          }
          default:
              return null;
      }
  }

  var fastJsonStableStringify = function (data, opts) {
      if (!opts) opts = {};
      if (typeof opts === 'function') opts = { cmp: opts };
      var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;

      var cmp = opts.cmp && (function (f) {
          return function (node) {
              return function (a, b) {
                  var aobj = { key: a, value: node[a] };
                  var bobj = { key: b, value: node[b] };
                  return f(aobj, bobj);
              };
          };
      })(opts.cmp);

      var seen = [];
      return (function stringify (node) {
          if (node && node.toJSON && typeof node.toJSON === 'function') {
              node = node.toJSON();
          }

          if (node === undefined) return;
          if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
          if (typeof node !== 'object') return JSON.stringify(node);

          var i, out;
          if (Array.isArray(node)) {
              out = '[';
              for (i = 0; i < node.length; i++) {
                  if (i) out += ',';
                  out += stringify(node[i]) || 'null';
              }
              return out + ']';
          }

          if (node === null) return 'null';

          if (seen.indexOf(node) !== -1) {
              if (cycles) return JSON.stringify('__cycle__');
              throw new TypeError('Converting circular structure to JSON');
          }

          var seenIndex = seen.push(node) - 1;
          var keys = Object.keys(node).sort(cmp && cmp(node));
          out = '';
          for (i = 0; i < keys.length; i++) {
              var key = keys[i];
              var value = stringify(node[key]);

              if (!value) continue;
              if (out) out += ',';
              out += JSON.stringify(key) + ':' + value;
          }
          seen.splice(seenIndex, 1);
          return '{' + out + '}';
      })(data);
  };

  function makeReference(id) {
      return { __ref: String(id) };
  }
  function isReference(obj) {
      return Boolean(obj && typeof obj === 'object' && typeof obj.__ref === 'string');
  }
  function isStringValue(value) {
      return value.kind === 'StringValue';
  }
  function isBooleanValue(value) {
      return value.kind === 'BooleanValue';
  }
  function isIntValue(value) {
      return value.kind === 'IntValue';
  }
  function isFloatValue(value) {
      return value.kind === 'FloatValue';
  }
  function isVariable(value) {
      return value.kind === 'Variable';
  }
  function isObjectValue(value) {
      return value.kind === 'ObjectValue';
  }
  function isListValue(value) {
      return value.kind === 'ListValue';
  }
  function isEnumValue(value) {
      return value.kind === 'EnumValue';
  }
  function isNullValue(value) {
      return value.kind === 'NullValue';
  }
  function valueToObjectRepresentation(argObj, name, value, variables) {
      if (isIntValue(value) || isFloatValue(value)) {
          argObj[name.value] = Number(value.value);
      }
      else if (isBooleanValue(value) || isStringValue(value)) {
          argObj[name.value] = value.value;
      }
      else if (isObjectValue(value)) {
          var nestedArgObj_1 = {};
          value.fields.map(function (obj) {
              return valueToObjectRepresentation(nestedArgObj_1, obj.name, obj.value, variables);
          });
          argObj[name.value] = nestedArgObj_1;
      }
      else if (isVariable(value)) {
          var variableValue = (variables || {})[value.name.value];
          argObj[name.value] = variableValue;
      }
      else if (isListValue(value)) {
          argObj[name.value] = value.values.map(function (listValue) {
              var nestedArgArrayObj = {};
              valueToObjectRepresentation(nestedArgArrayObj, name, listValue, variables);
              return nestedArgArrayObj[name.value];
          });
      }
      else if (isEnumValue(value)) {
          argObj[name.value] = value.value;
      }
      else if (isNullValue(value)) {
          argObj[name.value] = null;
      }
      else {
          throw new InvariantError("The inline argument \"" + name.value + "\" of kind \"" + value.kind + "\"" +
              'is not supported. Use variables instead of inline arguments to ' +
              'overcome this limitation.');
      }
  }
  function storeKeyNameFromField(field, variables) {
      var directivesObj = null;
      if (field.directives) {
          directivesObj = {};
          field.directives.forEach(function (directive) {
              directivesObj[directive.name.value] = {};
              if (directive.arguments) {
                  directive.arguments.forEach(function (_a) {
                      var name = _a.name, value = _a.value;
                      return valueToObjectRepresentation(directivesObj[directive.name.value], name, value, variables);
                  });
              }
          });
      }
      var argObj = null;
      if (field.arguments && field.arguments.length) {
          argObj = {};
          field.arguments.forEach(function (_a) {
              var name = _a.name, value = _a.value;
              return valueToObjectRepresentation(argObj, name, value, variables);
          });
      }
      return getStoreKeyName(field.name.value, argObj, directivesObj);
  }
  var KNOWN_DIRECTIVES = [
      'connection',
      'include',
      'skip',
      'client',
      'rest',
      'export',
  ];
  function getStoreKeyName(fieldName, args, directives) {
      if (args &&
          directives &&
          directives['connection'] &&
          directives['connection']['key']) {
          if (directives['connection']['filter'] &&
              directives['connection']['filter'].length > 0) {
              var filterKeys = directives['connection']['filter']
                  ? directives['connection']['filter']
                  : [];
              filterKeys.sort();
              var filteredArgs_1 = {};
              filterKeys.forEach(function (key) {
                  filteredArgs_1[key] = args[key];
              });
              return directives['connection']['key'] + "(" + JSON.stringify(filteredArgs_1) + ")";
          }
          else {
              return directives['connection']['key'];
          }
      }
      var completeFieldName = fieldName;
      if (args) {
          var stringifiedArgs = fastJsonStableStringify(args);
          completeFieldName += "(" + stringifiedArgs + ")";
      }
      if (directives) {
          Object.keys(directives).forEach(function (key) {
              if (KNOWN_DIRECTIVES.indexOf(key) !== -1)
                  return;
              if (directives[key] && Object.keys(directives[key]).length) {
                  completeFieldName += "@" + key + "(" + JSON.stringify(directives[key]) + ")";
              }
              else {
                  completeFieldName += "@" + key;
              }
          });
      }
      return completeFieldName;
  }
  function argumentsObjectFromField(field, variables) {
      if (field.arguments && field.arguments.length) {
          var argObj_1 = {};
          field.arguments.forEach(function (_a) {
              var name = _a.name, value = _a.value;
              return valueToObjectRepresentation(argObj_1, name, value, variables);
          });
          return argObj_1;
      }
      return null;
  }
  function resultKeyNameFromField(field) {
      return field.alias ? field.alias.value : field.name.value;
  }
  function getTypenameFromResult(result, selectionSet, fragmentMap) {
      if (typeof result.__typename === 'string') {
          return result.__typename;
      }
      for (var _i = 0, _a = selectionSet.selections; _i < _a.length; _i++) {
          var selection = _a[_i];
          if (isField(selection)) {
              if (selection.name.value === '__typename') {
                  return result[resultKeyNameFromField(selection)];
              }
          }
          else {
              var typename = getTypenameFromResult(result, getFragmentFromSelection(selection, fragmentMap).selectionSet, fragmentMap);
              if (typeof typename === 'string') {
                  return typename;
              }
          }
      }
  }
  function isField(selection) {
      return selection.kind === 'Field';
  }

  function checkDocument(doc) {
      invariant(doc && doc.kind === 'Document', "Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a \"gql\" tag? http://docs.apollostack.com/apollo-client/core.html#gql");
      var operations = doc.definitions
          .filter(function (d) { return d.kind !== 'FragmentDefinition'; })
          .map(function (definition) {
          if (definition.kind !== 'OperationDefinition') {
              throw new InvariantError("Schema type definitions not allowed in queries. Found: \"" + definition.kind + "\"");
          }
          return definition;
      });
      invariant(operations.length <= 1, "Ambiguous GraphQL document: contains " + operations.length + " operations");
      return doc;
  }
  function getOperationDefinition(doc) {
      checkDocument(doc);
      return doc.definitions.filter(function (definition) { return definition.kind === 'OperationDefinition'; })[0];
  }
  function getOperationName(doc) {
      return (doc.definitions
          .filter(function (definition) {
          return definition.kind === 'OperationDefinition' && definition.name;
      })
          .map(function (x) { return x.name.value; })[0] || null);
  }
  function getFragmentDefinitions(doc) {
      return doc.definitions.filter(function (definition) { return definition.kind === 'FragmentDefinition'; });
  }
  function getQueryDefinition(doc) {
      var queryDef = getOperationDefinition(doc);
      invariant(queryDef && queryDef.operation === 'query', 'Must contain a query definition.');
      return queryDef;
  }
  function getMainDefinition(queryDoc) {
      checkDocument(queryDoc);
      var fragmentDefinition;
      for (var _i = 0, _a = queryDoc.definitions; _i < _a.length; _i++) {
          var definition = _a[_i];
          if (definition.kind === 'OperationDefinition') {
              var operation = definition.operation;
              if (operation === 'query' ||
                  operation === 'mutation' ||
                  operation === 'subscription') {
                  return definition;
              }
          }
          if (definition.kind === 'FragmentDefinition' && !fragmentDefinition) {
              fragmentDefinition = definition;
          }
      }
      if (fragmentDefinition) {
          return fragmentDefinition;
      }
      throw new InvariantError('Expected a parsed GraphQL query with a query, mutation, subscription, or a fragment.');
  }
  function getDefaultValues(definition) {
      var defaultValues = Object.create(null);
      var defs = definition && definition.variableDefinitions;
      if (defs && defs.length) {
          defs.forEach(function (def) {
              if (def.defaultValue) {
                  valueToObjectRepresentation(defaultValues, def.variable.name, def.defaultValue);
              }
          });
      }
      return defaultValues;
  }

  var TYPENAME_FIELD = {
      kind: 'Field',
      name: {
          kind: 'Name',
          value: '__typename',
      },
  };
  function addTypenameToDocument(doc) {
      return graphql.visit(checkDocument(doc), {
          SelectionSet: {
              enter: function (node, _key, parent) {
                  if (parent &&
                      parent.kind === 'OperationDefinition') {
                      return;
                  }
                  var selections = node.selections;
                  if (!selections) {
                      return;
                  }
                  var skip = selections.some(function (selection) {
                      return (isField(selection) &&
                          (selection.name.value === '__typename' ||
                              selection.name.value.lastIndexOf('__', 0) === 0));
                  });
                  if (skip) {
                      return;
                  }
                  var field = parent;
                  if (isField(field) &&
                      field.directives &&
                      field.directives.some(function (d) { return d.name.value === 'export'; })) {
                      return;
                  }
                  return __assign$1(__assign$1({}, node), { selections: __spreadArrays(selections, [TYPENAME_FIELD]) });
              },
          },
      });
  }
  addTypenameToDocument.added = function (field) {
      return field === TYPENAME_FIELD;
  };

  var hasOwnProperty$3 = Object.prototype.hasOwnProperty;
  function mergeDeepArray(sources) {
      var target = sources[0] || {};
      var count = sources.length;
      if (count > 1) {
          var merger = new DeepMerger();
          for (var i = 1; i < count; ++i) {
              target = merger.merge(target, sources[i]);
          }
      }
      return target;
  }
  function isObject$1(obj) {
      return obj !== null && typeof obj === 'object';
  }
  var defaultReconciler = function (target, source, property) {
      return this.merge(target[property], source[property]);
  };
  var DeepMerger = (function () {
      function DeepMerger(reconciler) {
          if (reconciler === void 0) { reconciler = defaultReconciler; }
          this.reconciler = reconciler;
          this.isObject = isObject$1;
          this.pastCopies = new Set();
      }
      DeepMerger.prototype.merge = function (target, source) {
          var _this = this;
          var context = [];
          for (var _i = 2; _i < arguments.length; _i++) {
              context[_i - 2] = arguments[_i];
          }
          if (isObject$1(source) && isObject$1(target)) {
              Object.keys(source).forEach(function (sourceKey) {
                  if (hasOwnProperty$3.call(target, sourceKey)) {
                      var targetValue = target[sourceKey];
                      if (source[sourceKey] !== targetValue) {
                          var result = _this.reconciler.apply(_this, __spreadArrays([target, source, sourceKey], context));
                          if (result !== targetValue) {
                              target = _this.shallowCopyForMerge(target);
                              target[sourceKey] = result;
                          }
                      }
                  }
                  else {
                      target = _this.shallowCopyForMerge(target);
                      target[sourceKey] = source[sourceKey];
                  }
              });
              return target;
          }
          return source;
      };
      DeepMerger.prototype.shallowCopyForMerge = function (value) {
          if (isObject$1(value) && !this.pastCopies.has(value)) {
              if (Array.isArray(value)) {
                  value = value.slice(0);
              }
              else {
                  value = __assign$1({ __proto__: Object.getPrototypeOf(value) }, value);
              }
              this.pastCopies.add(value);
          }
          return value;
      };
      return DeepMerger;
  }());

  var Observable_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Observable = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // === Symbol Support ===
  var hasSymbols = function () {
    return typeof Symbol === 'function';
  };

  var hasSymbol = function (name) {
    return hasSymbols() && Boolean(Symbol[name]);
  };

  var getSymbol = function (name) {
    return hasSymbol(name) ? Symbol[name] : '@@' + name;
  };

  if (hasSymbols() && !hasSymbol('observable')) {
    Symbol.observable = Symbol('observable');
  }

  var SymbolIterator = getSymbol('iterator');
  var SymbolObservable = getSymbol('observable');
  var SymbolSpecies = getSymbol('species'); // === Abstract Operations ===

  function getMethod(obj, key) {
    var value = obj[key];
    if (value == null) return undefined;
    if (typeof value !== 'function') throw new TypeError(value + ' is not a function');
    return value;
  }

  function getSpecies(obj) {
    var ctor = obj.constructor;

    if (ctor !== undefined) {
      ctor = ctor[SymbolSpecies];

      if (ctor === null) {
        ctor = undefined;
      }
    }

    return ctor !== undefined ? ctor : Observable;
  }

  function isObservable(x) {
    return x instanceof Observable; // SPEC: Brand check
  }

  function hostReportError(e) {
    if (hostReportError.log) {
      hostReportError.log(e);
    } else {
      setTimeout(function () {
        throw e;
      });
    }
  }

  function enqueue(fn) {
    Promise.resolve().then(function () {
      try {
        fn();
      } catch (e) {
        hostReportError(e);
      }
    });
  }

  function cleanupSubscription(subscription) {
    var cleanup = subscription._cleanup;
    if (cleanup === undefined) return;
    subscription._cleanup = undefined;

    if (!cleanup) {
      return;
    }

    try {
      if (typeof cleanup === 'function') {
        cleanup();
      } else {
        var unsubscribe = getMethod(cleanup, 'unsubscribe');

        if (unsubscribe) {
          unsubscribe.call(cleanup);
        }
      }
    } catch (e) {
      hostReportError(e);
    }
  }

  function closeSubscription(subscription) {
    subscription._observer = undefined;
    subscription._queue = undefined;
    subscription._state = 'closed';
  }

  function flushSubscription(subscription) {
    var queue = subscription._queue;

    if (!queue) {
      return;
    }

    subscription._queue = undefined;
    subscription._state = 'ready';

    for (var i = 0; i < queue.length; ++i) {
      notifySubscription(subscription, queue[i].type, queue[i].value);
      if (subscription._state === 'closed') break;
    }
  }

  function notifySubscription(subscription, type, value) {
    subscription._state = 'running';
    var observer = subscription._observer;

    try {
      var m = getMethod(observer, type);

      switch (type) {
        case 'next':
          if (m) m.call(observer, value);
          break;

        case 'error':
          closeSubscription(subscription);
          if (m) m.call(observer, value);else throw value;
          break;

        case 'complete':
          closeSubscription(subscription);
          if (m) m.call(observer);
          break;
      }
    } catch (e) {
      hostReportError(e);
    }

    if (subscription._state === 'closed') cleanupSubscription(subscription);else if (subscription._state === 'running') subscription._state = 'ready';
  }

  function onNotify(subscription, type, value) {
    if (subscription._state === 'closed') return;

    if (subscription._state === 'buffering') {
      subscription._queue.push({
        type: type,
        value: value
      });

      return;
    }

    if (subscription._state !== 'ready') {
      subscription._state = 'buffering';
      subscription._queue = [{
        type: type,
        value: value
      }];
      enqueue(function () {
        return flushSubscription(subscription);
      });
      return;
    }

    notifySubscription(subscription, type, value);
  }

  var Subscription =
  /*#__PURE__*/
  function () {
    function Subscription(observer, subscriber) {
      _classCallCheck(this, Subscription);

      // ASSERT: observer is an object
      // ASSERT: subscriber is callable
      this._cleanup = undefined;
      this._observer = observer;
      this._queue = undefined;
      this._state = 'initializing';
      var subscriptionObserver = new SubscriptionObserver(this);

      try {
        this._cleanup = subscriber.call(undefined, subscriptionObserver);
      } catch (e) {
        subscriptionObserver.error(e);
      }

      if (this._state === 'initializing') this._state = 'ready';
    }

    _createClass(Subscription, [{
      key: "unsubscribe",
      value: function unsubscribe() {
        if (this._state !== 'closed') {
          closeSubscription(this);
          cleanupSubscription(this);
        }
      }
    }, {
      key: "closed",
      get: function () {
        return this._state === 'closed';
      }
    }]);

    return Subscription;
  }();

  var SubscriptionObserver =
  /*#__PURE__*/
  function () {
    function SubscriptionObserver(subscription) {
      _classCallCheck(this, SubscriptionObserver);

      this._subscription = subscription;
    }

    _createClass(SubscriptionObserver, [{
      key: "next",
      value: function next(value) {
        onNotify(this._subscription, 'next', value);
      }
    }, {
      key: "error",
      value: function error(value) {
        onNotify(this._subscription, 'error', value);
      }
    }, {
      key: "complete",
      value: function complete() {
        onNotify(this._subscription, 'complete');
      }
    }, {
      key: "closed",
      get: function () {
        return this._subscription._state === 'closed';
      }
    }]);

    return SubscriptionObserver;
  }();

  var Observable =
  /*#__PURE__*/
  function () {
    function Observable(subscriber) {
      _classCallCheck(this, Observable);

      if (!(this instanceof Observable)) throw new TypeError('Observable cannot be called as a function');
      if (typeof subscriber !== 'function') throw new TypeError('Observable initializer must be a function');
      this._subscriber = subscriber;
    }

    _createClass(Observable, [{
      key: "subscribe",
      value: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          observer = {
            next: observer,
            error: arguments[1],
            complete: arguments[2]
          };
        }

        return new Subscription(observer, this._subscriber);
      }
    }, {
      key: "forEach",
      value: function forEach(fn) {
        var _this = this;

        return new Promise(function (resolve, reject) {
          if (typeof fn !== 'function') {
            reject(new TypeError(fn + ' is not a function'));
            return;
          }

          function done() {
            subscription.unsubscribe();
            resolve();
          }

          var subscription = _this.subscribe({
            next: function (value) {
              try {
                fn(value, done);
              } catch (e) {
                reject(e);
                subscription.unsubscribe();
              }
            },
            error: reject,
            complete: resolve
          });
        });
      }
    }, {
      key: "map",
      value: function map(fn) {
        var _this2 = this;

        if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
        var C = getSpecies(this);
        return new C(function (observer) {
          return _this2.subscribe({
            next: function (value) {
              try {
                value = fn(value);
              } catch (e) {
                return observer.error(e);
              }

              observer.next(value);
            },
            error: function (e) {
              observer.error(e);
            },
            complete: function () {
              observer.complete();
            }
          });
        });
      }
    }, {
      key: "filter",
      value: function filter(fn) {
        var _this3 = this;

        if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
        var C = getSpecies(this);
        return new C(function (observer) {
          return _this3.subscribe({
            next: function (value) {
              try {
                if (!fn(value)) return;
              } catch (e) {
                return observer.error(e);
              }

              observer.next(value);
            },
            error: function (e) {
              observer.error(e);
            },
            complete: function () {
              observer.complete();
            }
          });
        });
      }
    }, {
      key: "reduce",
      value: function reduce(fn) {
        var _this4 = this;

        if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
        var C = getSpecies(this);
        var hasSeed = arguments.length > 1;
        var hasValue = false;
        var seed = arguments[1];
        var acc = seed;
        return new C(function (observer) {
          return _this4.subscribe({
            next: function (value) {
              var first = !hasValue;
              hasValue = true;

              if (!first || hasSeed) {
                try {
                  acc = fn(acc, value);
                } catch (e) {
                  return observer.error(e);
                }
              } else {
                acc = value;
              }
            },
            error: function (e) {
              observer.error(e);
            },
            complete: function () {
              if (!hasValue && !hasSeed) return observer.error(new TypeError('Cannot reduce an empty sequence'));
              observer.next(acc);
              observer.complete();
            }
          });
        });
      }
    }, {
      key: "concat",
      value: function concat() {
        var _this5 = this;

        for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
          sources[_key] = arguments[_key];
        }

        var C = getSpecies(this);
        return new C(function (observer) {
          var subscription;
          var index = 0;

          function startNext(next) {
            subscription = next.subscribe({
              next: function (v) {
                observer.next(v);
              },
              error: function (e) {
                observer.error(e);
              },
              complete: function () {
                if (index === sources.length) {
                  subscription = undefined;
                  observer.complete();
                } else {
                  startNext(C.from(sources[index++]));
                }
              }
            });
          }

          startNext(_this5);
          return function () {
            if (subscription) {
              subscription.unsubscribe();
              subscription = undefined;
            }
          };
        });
      }
    }, {
      key: "flatMap",
      value: function flatMap(fn) {
        var _this6 = this;

        if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
        var C = getSpecies(this);
        return new C(function (observer) {
          var subscriptions = [];

          var outer = _this6.subscribe({
            next: function (value) {
              if (fn) {
                try {
                  value = fn(value);
                } catch (e) {
                  return observer.error(e);
                }
              }

              var inner = C.from(value).subscribe({
                next: function (value) {
                  observer.next(value);
                },
                error: function (e) {
                  observer.error(e);
                },
                complete: function () {
                  var i = subscriptions.indexOf(inner);
                  if (i >= 0) subscriptions.splice(i, 1);
                  completeIfDone();
                }
              });
              subscriptions.push(inner);
            },
            error: function (e) {
              observer.error(e);
            },
            complete: function () {
              completeIfDone();
            }
          });

          function completeIfDone() {
            if (outer.closed && subscriptions.length === 0) observer.complete();
          }

          return function () {
            subscriptions.forEach(function (s) {
              return s.unsubscribe();
            });
            outer.unsubscribe();
          };
        });
      }
    }, {
      key: SymbolObservable,
      value: function () {
        return this;
      }
    }], [{
      key: "from",
      value: function from(x) {
        var C = typeof this === 'function' ? this : Observable;
        if (x == null) throw new TypeError(x + ' is not an object');
        var method = getMethod(x, SymbolObservable);

        if (method) {
          var observable = method.call(x);
          if (Object(observable) !== observable) throw new TypeError(observable + ' is not an object');
          if (isObservable(observable) && observable.constructor === C) return observable;
          return new C(function (observer) {
            return observable.subscribe(observer);
          });
        }

        if (hasSymbol('iterator')) {
          method = getMethod(x, SymbolIterator);

          if (method) {
            return new C(function (observer) {
              enqueue(function () {
                if (observer.closed) return;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = method.call(x)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _item = _step.value;
                    observer.next(_item);
                    if (observer.closed) return;
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }

                observer.complete();
              });
            });
          }
        }

        if (Array.isArray(x)) {
          return new C(function (observer) {
            enqueue(function () {
              if (observer.closed) return;

              for (var i = 0; i < x.length; ++i) {
                observer.next(x[i]);
                if (observer.closed) return;
              }

              observer.complete();
            });
          });
        }

        throw new TypeError(x + ' is not observable');
      }
    }, {
      key: "of",
      value: function of() {
        for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          items[_key2] = arguments[_key2];
        }

        var C = typeof this === 'function' ? this : Observable;
        return new C(function (observer) {
          enqueue(function () {
            if (observer.closed) return;

            for (var i = 0; i < items.length; ++i) {
              observer.next(items[i]);
              if (observer.closed) return;
            }

            observer.complete();
          });
        });
      }
    }, {
      key: SymbolSpecies,
      get: function () {
        return this;
      }
    }]);

    return Observable;
  }();

  exports.Observable = Observable;

  if (hasSymbols()) {
    Object.defineProperty(Observable, Symbol('extensions'), {
      value: {
        symbol: SymbolObservable,
        hostReportError: hostReportError
      },
      configurable: true
    });
  }
  });

  unwrapExports(Observable_1);
  Observable_1.Observable;

  var zenObservable = Observable_1.Observable;

  function symbolObservablePonyfill(root) {
  	var result;
  	var Symbol = root.Symbol;

  	if (typeof Symbol === 'function') {
  		if (Symbol.observable) {
  			result = Symbol.observable;
  		} else {

  			// This just needs to be something that won't trample other user's Symbol.for use
  			// It also will guide people to the source of their issues, if this is problematic.
  			// META: It's a resource locator!
  			result = Symbol.for('https://github.com/benlesh/symbol-observable');
  			try {
  				Symbol.observable = result;
  			} catch (err) {
  				// Do nothing. In some environments, users have frozen `Symbol` for security reasons,
  				// if it is frozen assigning to it will throw. In this case, we don't care, because
  				// they will need to use the returned value from the ponyfill.
  			}
  		}
  	} else {
  		result = '@@observable';
  	}

  	return result;
  }

  var root;

  if (typeof self !== 'undefined') {
    root = self;
  } else if (typeof window !== 'undefined') {
    root = window;
  } else if (typeof global$1 !== 'undefined') {
    root = global$1;
  } else if (typeof module !== 'undefined') {
    root = module;
  } else {
    root = Function('return this')();
  }

  symbolObservablePonyfill(root);

  var prototype = zenObservable.prototype;
  var fakeObsSymbol = '@@observable';
  if (!prototype[fakeObsSymbol]) {
      prototype[fakeObsSymbol] = function () { return this; };
  }

  var toString$1 = Object.prototype.toString;
  function cloneDeep(value) {
      return cloneDeepHelper(value);
  }
  function cloneDeepHelper(val, seen) {
      switch (toString$1.call(val)) {
          case "[object Array]": {
              seen = seen || new Map;
              if (seen.has(val))
                  return seen.get(val);
              var copy_1 = val.slice(0);
              seen.set(val, copy_1);
              copy_1.forEach(function (child, i) {
                  copy_1[i] = cloneDeepHelper(child, seen);
              });
              return copy_1;
          }
          case "[object Object]": {
              seen = seen || new Map;
              if (seen.has(val))
                  return seen.get(val);
              var copy_2 = Object.create(Object.getPrototypeOf(val));
              seen.set(val, copy_2);
              Object.keys(val).forEach(function (key) {
                  copy_2[key] = cloneDeepHelper(val[key], seen);
              });
              return copy_2;
          }
          default:
              return val;
      }
  }

  function getEnv() {
      if (typeof process !== 'undefined' && process.env.NODE_ENV) {
          return process.env.NODE_ENV;
      }
      return 'development';
  }
  function isEnv(env) {
      return getEnv() === env;
  }
  function isDevelopment() {
      return isEnv('development') === true;
  }
  function isTest() {
      return isEnv('test') === true;
  }

  function isObject(value) {
      return value !== null && typeof value === "object";
  }
  function deepFreeze(value) {
      var workSet = new Set([value]);
      workSet.forEach(function (obj) {
          if (isObject(obj)) {
              if (!Object.isFrozen(obj))
                  Object.freeze(obj);
              Object.getOwnPropertyNames(obj).forEach(function (name) {
                  if (isObject(obj[name]))
                      workSet.add(obj[name]);
              });
          }
      });
      return value;
  }
  function maybeDeepFreeze(obj) {
      if ((isDevelopment() || isTest())) {
          deepFreeze(obj);
      }
      return obj;
  }

  function iterateObserversSafely(observers, method, argument) {
      var observersWithMethod = [];
      observers.forEach(function (obs) { return obs[method] && observersWithMethod.push(obs); });
      observersWithMethod.forEach(function (obs) { return obs[method](argument); });
  }

  function fixObservableSubclass(subclass) {
      function set(key) {
          Object.defineProperty(subclass, key, { value: zenObservable });
      }
      if (typeof Symbol === "function" && Symbol.species) {
          set(Symbol.species);
      }
      set("@@species");
      return subclass;
  }

  function isPromiseLike(value) {
      return value && typeof value.then === "function";
  }
  var Concast = (function (_super) {
      __extends$1(Concast, _super);
      function Concast(sources) {
          var _this = _super.call(this, function (observer) {
              _this.addObserver(observer);
              return function () { return _this.removeObserver(observer); };
          }) || this;
          _this.observers = new Set();
          _this.addCount = 0;
          _this.promise = new Promise(function (resolve, reject) {
              _this.resolve = resolve;
              _this.reject = reject;
          });
          _this.handlers = {
              next: function (result) {
                  if (_this.sub !== null) {
                      _this.latest = ["next", result];
                      iterateObserversSafely(_this.observers, "next", result);
                  }
              },
              error: function (error) {
                  var sub = _this.sub;
                  if (sub !== null) {
                      if (sub)
                          Promise.resolve().then(function () { return sub.unsubscribe(); });
                      _this.sub = null;
                      _this.latest = ["error", error];
                      _this.reject(error);
                      iterateObserversSafely(_this.observers, "error", error);
                  }
              },
              complete: function () {
                  if (_this.sub !== null) {
                      var value = _this.sources.shift();
                      if (!value) {
                          _this.sub = null;
                          if (_this.latest &&
                              _this.latest[0] === "next") {
                              _this.resolve(_this.latest[1]);
                          }
                          else {
                              _this.resolve();
                          }
                          iterateObserversSafely(_this.observers, "complete");
                      }
                      else if (isPromiseLike(value)) {
                          value.then(function (obs) { return _this.sub = obs.subscribe(_this.handlers); });
                      }
                      else {
                          _this.sub = value.subscribe(_this.handlers);
                      }
                  }
              },
          };
          _this.cancel = function (reason) {
              _this.reject(reason);
              _this.sources = [];
              _this.handlers.complete();
          };
          _this.promise.catch(function (_) { });
          if (typeof sources === "function") {
              sources = [new zenObservable(sources)];
          }
          if (isPromiseLike(sources)) {
              sources.then(function (iterable) { return _this.start(iterable); }, _this.handlers.error);
          }
          else {
              _this.start(sources);
          }
          return _this;
      }
      Concast.prototype.start = function (sources) {
          if (this.sub !== void 0)
              return;
          this.sources = Array.from(sources);
          this.handlers.complete();
      };
      Concast.prototype.deliverLastMessage = function (observer) {
          if (this.latest) {
              var nextOrError = this.latest[0];
              var method = observer[nextOrError];
              if (method) {
                  method.call(observer, this.latest[1]);
              }
              if (this.sub === null &&
                  nextOrError === "next" &&
                  observer.complete) {
                  observer.complete();
              }
          }
      };
      Concast.prototype.addObserver = function (observer) {
          if (!this.observers.has(observer)) {
              this.deliverLastMessage(observer);
              this.observers.add(observer);
              ++this.addCount;
          }
      };
      Concast.prototype.removeObserver = function (observer, quietly) {
          if (this.observers.delete(observer) &&
              --this.addCount < 1 &&
              !quietly) {
              this.handlers.error(new Error("Observable cancelled prematurely"));
          }
      };
      Concast.prototype.cleanup = function (callback) {
          var _this = this;
          var called = false;
          var once = function () {
              if (!called) {
                  called = true;
                  _this.observers.delete(observer);
                  callback();
              }
          };
          var observer = {
              next: once,
              error: once,
              complete: once,
          };
          var count = this.addCount;
          this.addObserver(observer);
          this.addCount = count;
      };
      return Concast;
  }(zenObservable));
  fixObservableSubclass(Concast);

  function isNonEmptyArray(value) {
      return Array.isArray(value) && value.length > 0;
  }

  var canUseWeakMap = typeof WeakMap === 'function' && !(typeof navigator === 'object' &&
      navigator.product === 'ReactNative');

  function compact() {
      var objects = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          objects[_i] = arguments[_i];
      }
      var result = Object.create(null);
      objects.forEach(function (obj) {
          if (!obj)
              return;
          Object.keys(obj).forEach(function (key) {
              var value = obj[key];
              if (value !== void 0) {
                  result[key] = value;
              }
          });
      });
      return result;
  }

  function fromError(errorValue) {
      return new zenObservable(function (observer) {
          observer.error(errorValue);
      });
  }

  var throwServerError = function (response, result, message) {
      var error = new Error(message);
      error.name = 'ServerError';
      error.response = response;
      error.statusCode = response.status;
      error.result = result;
      throw error;
  };

  function validateOperation(operation) {
      var OPERATION_FIELDS = [
          'query',
          'operationName',
          'variables',
          'extensions',
          'context',
      ];
      for (var _i = 0, _a = Object.keys(operation); _i < _a.length; _i++) {
          var key = _a[_i];
          if (OPERATION_FIELDS.indexOf(key) < 0) {
              throw new InvariantError("illegal argument: " + key);
          }
      }
      return operation;
  }

  function createOperation(starting, operation) {
      var context = __assign$1({}, starting);
      var setContext = function (next) {
          if (typeof next === 'function') {
              context = __assign$1(__assign$1({}, context), next(context));
          }
          else {
              context = __assign$1(__assign$1({}, context), next);
          }
      };
      var getContext = function () { return (__assign$1({}, context)); };
      Object.defineProperty(operation, 'setContext', {
          enumerable: false,
          value: setContext,
      });
      Object.defineProperty(operation, 'getContext', {
          enumerable: false,
          value: getContext,
      });
      return operation;
  }

  function transformOperation(operation) {
      var transformedOperation = {
          variables: operation.variables || {},
          extensions: operation.extensions || {},
          operationName: operation.operationName,
          query: operation.query,
      };
      if (!transformedOperation.operationName) {
          transformedOperation.operationName =
              typeof transformedOperation.query !== 'string'
                  ? getOperationName(transformedOperation.query) || undefined
                  : '';
      }
      return transformedOperation;
  }

  function passthrough(op, forward) {
      return (forward ? forward(op) : zenObservable.of());
  }
  function toLink(handler) {
      return typeof handler === 'function' ? new ApolloLink(handler) : handler;
  }
  function isTerminating(link) {
      return link.request.length <= 1;
  }
  var LinkError = (function (_super) {
      __extends$1(LinkError, _super);
      function LinkError(message, link) {
          var _this = _super.call(this, message) || this;
          _this.link = link;
          return _this;
      }
      return LinkError;
  }(Error));
  var ApolloLink = (function () {
      function ApolloLink(request) {
          if (request)
              this.request = request;
      }
      ApolloLink.empty = function () {
          return new ApolloLink(function () { return zenObservable.of(); });
      };
      ApolloLink.from = function (links) {
          if (links.length === 0)
              return ApolloLink.empty();
          return links.map(toLink).reduce(function (x, y) { return x.concat(y); });
      };
      ApolloLink.split = function (test, left, right) {
          var leftLink = toLink(left);
          var rightLink = toLink(right || new ApolloLink(passthrough));
          if (isTerminating(leftLink) && isTerminating(rightLink)) {
              return new ApolloLink(function (operation) {
                  return test(operation)
                      ? leftLink.request(operation) || zenObservable.of()
                      : rightLink.request(operation) || zenObservable.of();
              });
          }
          else {
              return new ApolloLink(function (operation, forward) {
                  return test(operation)
                      ? leftLink.request(operation, forward) || zenObservable.of()
                      : rightLink.request(operation, forward) || zenObservable.of();
              });
          }
      };
      ApolloLink.execute = function (link, operation) {
          return (link.request(createOperation(operation.context, transformOperation(validateOperation(operation)))) || zenObservable.of());
      };
      ApolloLink.concat = function (first, second) {
          var firstLink = toLink(first);
          if (isTerminating(firstLink)) {
              invariant.warn(new LinkError("You are calling concat on a terminating link, which will have no effect", firstLink));
              return firstLink;
          }
          var nextLink = toLink(second);
          if (isTerminating(nextLink)) {
              return new ApolloLink(function (operation) {
                  return firstLink.request(operation, function (op) { return nextLink.request(op) || zenObservable.of(); }) || zenObservable.of();
              });
          }
          else {
              return new ApolloLink(function (operation, forward) {
                  return (firstLink.request(operation, function (op) {
                      return nextLink.request(op, forward) || zenObservable.of();
                  }) || zenObservable.of());
              });
          }
      };
      ApolloLink.prototype.split = function (test, left, right) {
          return this.concat(ApolloLink.split(test, left, right || new ApolloLink(passthrough)));
      };
      ApolloLink.prototype.concat = function (next) {
          return ApolloLink.concat(this, next);
      };
      ApolloLink.prototype.request = function (operation, forward) {
          throw new InvariantError('request is not implemented');
      };
      ApolloLink.prototype.onError = function (error, observer) {
          if (observer && observer.error) {
              observer.error(error);
              return false;
          }
          throw error;
      };
      ApolloLink.prototype.setOnError = function (fn) {
          this.onError = fn;
          return this;
      };
      return ApolloLink;
  }());

  var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  function parseAndCheckHttpResponse(operations) {
      return function (response) { return response
          .text()
          .then(function (bodyText) {
          try {
              return JSON.parse(bodyText);
          }
          catch (err) {
              var parseError = err;
              parseError.name = 'ServerParseError';
              parseError.response = response;
              parseError.statusCode = response.status;
              parseError.bodyText = bodyText;
              throw parseError;
          }
      })
          .then(function (result) {
          if (response.status >= 300) {
              throwServerError(response, result, "Response not successful: Received status code " + response.status);
          }
          if (!Array.isArray(result) &&
              !hasOwnProperty$2.call(result, 'data') &&
              !hasOwnProperty$2.call(result, 'errors')) {
              throwServerError(response, result, "Server response was missing for query '" + (Array.isArray(operations)
                  ? operations.map(function (op) { return op.operationName; })
                  : operations.operationName) + "'.");
          }
          return result;
      }); };
  }

  var serializeFetchParameter = function (p, label) {
      var serialized;
      try {
          serialized = JSON.stringify(p);
      }
      catch (e) {
          var parseError = new InvariantError("Network request failed. " + label + " is not serializable: " + e.message);
          parseError.parseError = e;
          throw parseError;
      }
      return serialized;
  };

  var defaultHttpOptions = {
      includeQuery: true,
      includeExtensions: false,
  };
  var defaultHeaders = {
      accept: '*/*',
      'content-type': 'application/json',
  };
  var defaultOptions = {
      method: 'POST',
  };
  var fallbackHttpConfig = {
      http: defaultHttpOptions,
      headers: defaultHeaders,
      options: defaultOptions,
  };
  var selectHttpOptionsAndBody = function (operation, fallbackConfig) {
      var configs = [];
      for (var _i = 2; _i < arguments.length; _i++) {
          configs[_i - 2] = arguments[_i];
      }
      var options = __assign$1(__assign$1({}, fallbackConfig.options), { headers: fallbackConfig.headers, credentials: fallbackConfig.credentials });
      var http = fallbackConfig.http || {};
      configs.forEach(function (config) {
          options = __assign$1(__assign$1(__assign$1({}, options), config.options), { headers: __assign$1(__assign$1({}, options.headers), config.headers) });
          if (config.credentials)
              options.credentials = config.credentials;
          http = __assign$1(__assign$1({}, http), config.http);
      });
      var operationName = operation.operationName, extensions = operation.extensions, variables = operation.variables, query = operation.query;
      var body = { operationName: operationName, variables: variables };
      if (http.includeExtensions)
          body.extensions = extensions;
      if (http.includeQuery)
          body.query = graphql.print(query);
      return {
          options: options,
          body: body,
      };
  };

  var checkFetcher = function (fetcher) {
      if (!fetcher && typeof fetch === 'undefined') {
          throw new InvariantError("\n\"fetch\" has not been found globally and no fetcher has been configured. To fix this, install a fetch package (like https://www.npmjs.com/package/cross-fetch), instantiate the fetcher, and pass it into your HttpLink constructor. For example:\n\nimport fetch from 'cross-fetch';\nimport { ApolloClient, HttpLink } from '@apollo/client';\nconst client = new ApolloClient({\n  link: new HttpLink({ uri: '/graphql', fetch })\n});\n    ");
      }
  };

  var createSignalIfSupported = function () {
      if (typeof AbortController === 'undefined')
          return { controller: false, signal: false };
      var controller = new AbortController();
      var signal = controller.signal;
      return { controller: controller, signal: signal };
  };

  var selectURI = function (operation, fallbackURI) {
      var context = operation.getContext();
      var contextURI = context.uri;
      if (contextURI) {
          return contextURI;
      }
      else if (typeof fallbackURI === 'function') {
          return fallbackURI(operation);
      }
      else {
          return fallbackURI || '/graphql';
      }
  };

  function rewriteURIForGET(chosenURI, body) {
      var queryParams = [];
      var addQueryParam = function (key, value) {
          queryParams.push(key + "=" + encodeURIComponent(value));
      };
      if ('query' in body) {
          addQueryParam('query', body.query);
      }
      if (body.operationName) {
          addQueryParam('operationName', body.operationName);
      }
      if (body.variables) {
          var serializedVariables = void 0;
          try {
              serializedVariables = serializeFetchParameter(body.variables, 'Variables map');
          }
          catch (parseError) {
              return { parseError: parseError };
          }
          addQueryParam('variables', serializedVariables);
      }
      if (body.extensions) {
          var serializedExtensions = void 0;
          try {
              serializedExtensions = serializeFetchParameter(body.extensions, 'Extensions map');
          }
          catch (parseError) {
              return { parseError: parseError };
          }
          addQueryParam('extensions', serializedExtensions);
      }
      var fragment = '', preFragment = chosenURI;
      var fragmentStart = chosenURI.indexOf('#');
      if (fragmentStart !== -1) {
          fragment = chosenURI.substr(fragmentStart);
          preFragment = chosenURI.substr(0, fragmentStart);
      }
      var queryParamsPrefix = preFragment.indexOf('?') === -1 ? '?' : '&';
      var newURI = preFragment + queryParamsPrefix + queryParams.join('&') + fragment;
      return { newURI: newURI };
  }

  var createHttpLink = function (linkOptions) {
      if (linkOptions === void 0) { linkOptions = {}; }
      var _a = linkOptions.uri, uri = _a === void 0 ? '/graphql' : _a, fetcher = linkOptions.fetch, includeExtensions = linkOptions.includeExtensions, useGETForQueries = linkOptions.useGETForQueries, _b = linkOptions.includeUnusedVariables, includeUnusedVariables = _b === void 0 ? false : _b, requestOptions = __rest(linkOptions, ["uri", "fetch", "includeExtensions", "useGETForQueries", "includeUnusedVariables"]);
      checkFetcher(fetcher);
      if (!fetcher) {
          fetcher = fetch;
      }
      var linkConfig = {
          http: { includeExtensions: includeExtensions },
          options: requestOptions.fetchOptions,
          credentials: requestOptions.credentials,
          headers: requestOptions.headers,
      };
      return new ApolloLink(function (operation) {
          var chosenURI = selectURI(operation, uri);
          var context = operation.getContext();
          var clientAwarenessHeaders = {};
          if (context.clientAwareness) {
              var _a = context.clientAwareness, name_1 = _a.name, version = _a.version;
              if (name_1) {
                  clientAwarenessHeaders['apollographql-client-name'] = name_1;
              }
              if (version) {
                  clientAwarenessHeaders['apollographql-client-version'] = version;
              }
          }
          var contextHeaders = __assign$1(__assign$1({}, clientAwarenessHeaders), context.headers);
          var contextConfig = {
              http: context.http,
              options: context.fetchOptions,
              credentials: context.credentials,
              headers: contextHeaders,
          };
          var _b = selectHttpOptionsAndBody(operation, fallbackHttpConfig, linkConfig, contextConfig), options = _b.options, body = _b.body;
          if (body.variables && !includeUnusedVariables) {
              var unusedNames_1 = new Set(Object.keys(body.variables));
              graphql.visit(operation.query, {
                  Variable: function (node, _key, parent) {
                      if (parent && parent.kind !== 'VariableDefinition') {
                          unusedNames_1.delete(node.name.value);
                      }
                  },
              });
              if (unusedNames_1.size) {
                  body.variables = __assign$1({}, body.variables);
                  unusedNames_1.forEach(function (name) {
                      delete body.variables[name];
                  });
              }
          }
          var controller;
          if (!options.signal) {
              var _c = createSignalIfSupported(), _controller = _c.controller, signal = _c.signal;
              controller = _controller;
              if (controller)
                  options.signal = signal;
          }
          var definitionIsMutation = function (d) {
              return d.kind === 'OperationDefinition' && d.operation === 'mutation';
          };
          if (useGETForQueries &&
              !operation.query.definitions.some(definitionIsMutation)) {
              options.method = 'GET';
          }
          if (options.method === 'GET') {
              var _d = rewriteURIForGET(chosenURI, body), newURI = _d.newURI, parseError = _d.parseError;
              if (parseError) {
                  return fromError(parseError);
              }
              chosenURI = newURI;
          }
          else {
              try {
                  options.body = serializeFetchParameter(body, 'Payload');
              }
              catch (parseError) {
                  return fromError(parseError);
              }
          }
          return new zenObservable(function (observer) {
              fetcher(chosenURI, options)
                  .then(function (response) {
                  operation.setContext({ response: response });
                  return response;
              })
                  .then(parseAndCheckHttpResponse(operation))
                  .then(function (result) {
                  observer.next(result);
                  observer.complete();
                  return result;
              })
                  .catch(function (err) {
                  if (err.name === 'AbortError')
                      return;
                  if (err.result && err.result.errors && err.result.data) {
                      observer.next(err.result);
                  }
                  observer.error(err);
              });
              return function () {
                  if (controller)
                      controller.abort();
              };
          });
      });
  };

  ((function (_super) {
      __extends$1(HttpLink, _super);
      function HttpLink(options) {
          if (options === void 0) { options = {}; }
          var _this = _super.call(this, createHttpLink(options).request) || this;
          _this.options = options;
          return _this;
      }
      return HttpLink;
  })(ApolloLink));

  var _a$2 = Object.prototype, toString = _a$2.toString, hasOwnProperty$1 = _a$2.hasOwnProperty;
  var fnToStr = Function.prototype.toString;
  var previousComparisons = new Map();
  /**
   * Performs a deep equality check on two JavaScript values, tolerating cycles.
   */
  function equal(a, b) {
      try {
          return check(a, b);
      }
      finally {
          previousComparisons.clear();
      }
  }
  function check(a, b) {
      // If the two values are strictly equal, our job is easy.
      if (a === b) {
          return true;
      }
      // Object.prototype.toString returns a representation of the runtime type of
      // the given value that is considerably more precise than typeof.
      var aTag = toString.call(a);
      var bTag = toString.call(b);
      // If the runtime types of a and b are different, they could maybe be equal
      // under some interpretation of equality, but for simplicity and performance
      // we just return false instead.
      if (aTag !== bTag) {
          return false;
      }
      switch (aTag) {
          case '[object Array]':
              // Arrays are a lot like other objects, but we can cheaply compare their
              // lengths as a short-cut before comparing their elements.
              if (a.length !== b.length)
                  return false;
          // Fall through to object case...
          case '[object Object]': {
              if (previouslyCompared(a, b))
                  return true;
              var aKeys = definedKeys(a);
              var bKeys = definedKeys(b);
              // If `a` and `b` have a different number of enumerable keys, they
              // must be different.
              var keyCount = aKeys.length;
              if (keyCount !== bKeys.length)
                  return false;
              // Now make sure they have the same keys.
              for (var k = 0; k < keyCount; ++k) {
                  if (!hasOwnProperty$1.call(b, aKeys[k])) {
                      return false;
                  }
              }
              // Finally, check deep equality of all child properties.
              for (var k = 0; k < keyCount; ++k) {
                  var key = aKeys[k];
                  if (!check(a[key], b[key])) {
                      return false;
                  }
              }
              return true;
          }
          case '[object Error]':
              return a.name === b.name && a.message === b.message;
          case '[object Number]':
              // Handle NaN, which is !== itself.
              if (a !== a)
                  return b !== b;
          // Fall through to shared +a === +b case...
          case '[object Boolean]':
          case '[object Date]':
              return +a === +b;
          case '[object RegExp]':
          case '[object String]':
              return a == "" + b;
          case '[object Map]':
          case '[object Set]': {
              if (a.size !== b.size)
                  return false;
              if (previouslyCompared(a, b))
                  return true;
              var aIterator = a.entries();
              var isMap = aTag === '[object Map]';
              while (true) {
                  var info = aIterator.next();
                  if (info.done)
                      break;
                  // If a instanceof Set, aValue === aKey.
                  var _a = info.value, aKey = _a[0], aValue = _a[1];
                  // So this works the same way for both Set and Map.
                  if (!b.has(aKey)) {
                      return false;
                  }
                  // However, we care about deep equality of values only when dealing
                  // with Map structures.
                  if (isMap && !check(aValue, b.get(aKey))) {
                      return false;
                  }
              }
              return true;
          }
          case '[object AsyncFunction]':
          case '[object GeneratorFunction]':
          case '[object AsyncGeneratorFunction]':
          case '[object Function]': {
              var aCode = fnToStr.call(a);
              if (aCode !== fnToStr.call(b)) {
                  return false;
              }
              // We consider non-native functions equal if they have the same code
              // (native functions require === because their code is censored).
              // Note that this behavior is not entirely sound, since !== function
              // objects with the same code can behave differently depending on
              // their closure scope. However, any function can behave differently
              // depending on the values of its input arguments (including this)
              // and its calling context (including its closure scope), even
              // though the function object is === to itself; and it is entirely
              // possible for functions that are not === to behave exactly the
              // same under all conceivable circumstances. Because none of these
              // factors are statically decidable in JavaScript, JS function
              // equality is not well-defined. This ambiguity allows us to
              // consider the best possible heuristic among various imperfect
              // options, and equating non-native functions that have the same
              // code has enormous practical benefits, such as when comparing
              // functions that are repeatedly passed as fresh function
              // expressions within objects that are otherwise deeply equal. Since
              // any function created from the same syntactic expression (in the
              // same code location) will always stringify to the same code
              // according to fnToStr.call, we can reasonably expect these
              // repeatedly passed function expressions to have the same code, and
              // thus behave "the same" (with all the caveats mentioned above),
              // even though the runtime function objects are !== to one another.
              return !endsWith(aCode, nativeCodeSuffix);
          }
      }
      // Otherwise the values are not equal.
      return false;
  }
  function definedKeys(obj) {
      // Remember that the second argument to Array.prototype.filter will be
      // used as `this` within the callback function.
      return Object.keys(obj).filter(isDefinedKey, obj);
  }
  function isDefinedKey(key) {
      return this[key] !== void 0;
  }
  var nativeCodeSuffix = "{ [native code] }";
  function endsWith(full, suffix) {
      var fromIndex = full.length - suffix.length;
      return fromIndex >= 0 &&
          full.indexOf(suffix, fromIndex) === fromIndex;
  }
  function previouslyCompared(a, b) {
      // Though cyclic references can make an object graph appear infinite from the
      // perspective of a depth-first traversal, the graph still contains a finite
      // number of distinct object references. We use the previousComparisons cache
      // to avoid comparing the same pair of object references more than once, which
      // guarantees termination (even if we end up comparing every object in one
      // graph to every object in the other graph, which is extremely unlikely),
      // while still allowing weird isomorphic structures (like rings with different
      // lengths) a chance to pass the equality test.
      var bSet = previousComparisons.get(a);
      if (bSet) {
          // Return true here because we can be sure false will be returned somewhere
          // else if the objects are not equivalent.
          if (bSet.has(b))
              return true;
      }
      else {
          previousComparisons.set(a, bSet = new Set);
      }
      bSet.add(b);
      return false;
  }

  var generateErrorMessage = function (err) {
      var message = '';
      if (isNonEmptyArray(err.graphQLErrors)) {
          err.graphQLErrors.forEach(function (graphQLError) {
              var errorMessage = graphQLError
                  ? graphQLError.message
                  : 'Error message not found.';
              message += errorMessage + "\n";
          });
      }
      if (err.networkError) {
          message += err.networkError.message + "\n";
      }
      message = message.replace(/\n$/, '');
      return message;
  };
  var ApolloError = (function (_super) {
      __extends$1(ApolloError, _super);
      function ApolloError(_a) {
          var graphQLErrors = _a.graphQLErrors, networkError = _a.networkError, errorMessage = _a.errorMessage, extraInfo = _a.extraInfo;
          var _this = _super.call(this, errorMessage) || this;
          _this.graphQLErrors = graphQLErrors || [];
          _this.networkError = networkError || null;
          _this.message = errorMessage || generateErrorMessage(_this);
          _this.extraInfo = extraInfo;
          _this.__proto__ = ApolloError.prototype;
          return _this;
      }
      return ApolloError;
  }(Error));

  var NetworkStatus;
  (function (NetworkStatus) {
      NetworkStatus[NetworkStatus["loading"] = 1] = "loading";
      NetworkStatus[NetworkStatus["setVariables"] = 2] = "setVariables";
      NetworkStatus[NetworkStatus["fetchMore"] = 3] = "fetchMore";
      NetworkStatus[NetworkStatus["refetch"] = 4] = "refetch";
      NetworkStatus[NetworkStatus["poll"] = 6] = "poll";
      NetworkStatus[NetworkStatus["ready"] = 7] = "ready";
      NetworkStatus[NetworkStatus["error"] = 8] = "error";
  })(NetworkStatus || (NetworkStatus = {}));
  function isNetworkRequestInFlight(networkStatus) {
      return networkStatus ? networkStatus < 7 : false;
  }

  var Reobserver = (function () {
      function Reobserver(observer, options, fetch, shouldFetch) {
          this.observer = observer;
          this.options = options;
          this.fetch = fetch;
          this.shouldFetch = shouldFetch;
      }
      Reobserver.prototype.reobserve = function (newOptions, newNetworkStatus) {
          if (newOptions) {
              this.updateOptions(newOptions);
          }
          else {
              this.updatePolling();
          }
          var concast = this.fetch(this.options, newNetworkStatus);
          if (this.concast) {
              this.concast.removeObserver(this.observer, true);
          }
          concast.addObserver(this.observer);
          return (this.concast = concast).promise;
      };
      Reobserver.prototype.updateOptions = function (newOptions) {
          Object.assign(this.options, compact(newOptions));
          this.updatePolling();
          return this;
      };
      Reobserver.prototype.stop = function () {
          if (this.concast) {
              this.concast.removeObserver(this.observer);
              delete this.concast;
          }
          if (this.pollingInfo) {
              clearTimeout(this.pollingInfo.timeout);
              this.options.pollInterval = 0;
              this.updatePolling();
          }
      };
      Reobserver.prototype.updatePolling = function () {
          var _this = this;
          var _a = this, pollingInfo = _a.pollingInfo, pollInterval = _a.options.pollInterval;
          if (!pollInterval) {
              if (pollingInfo) {
                  clearTimeout(pollingInfo.timeout);
                  delete this.pollingInfo;
              }
              return;
          }
          if (pollingInfo &&
              pollingInfo.interval === pollInterval) {
              return;
          }
          invariant(pollInterval, 'Attempted to start a polling query without a polling interval.');
          if (this.shouldFetch === false) {
              return;
          }
          var info = pollingInfo || (this.pollingInfo = {});
          info.interval = pollInterval;
          var maybeFetch = function () {
              if (_this.pollingInfo) {
                  if (_this.shouldFetch && _this.shouldFetch()) {
                      _this.reobserve({
                          fetchPolicy: "network-only",
                          nextFetchPolicy: _this.options.fetchPolicy || "cache-first",
                      }, NetworkStatus.poll).then(poll, poll);
                  }
                  else {
                      poll();
                  }
              }
          };
          var poll = function () {
              var info = _this.pollingInfo;
              if (info) {
                  clearTimeout(info.timeout);
                  info.timeout = setTimeout(maybeFetch, info.interval);
              }
          };
          poll();
      };
      return Reobserver;
  }());

  var warnedAboutUpdateQuery = false;
  var ObservableQuery = (function (_super) {
      __extends$1(ObservableQuery, _super);
      function ObservableQuery(_a) {
          var queryManager = _a.queryManager, queryInfo = _a.queryInfo, options = _a.options;
          var _this = _super.call(this, function (observer) {
              return _this.onSubscribe(observer);
          }) || this;
          _this.observers = new Set();
          _this.subscriptions = new Set();
          _this.observer = {
              next: function (result) {
                  if (_this.lastError || _this.isDifferentFromLastResult(result)) {
                      _this.updateLastResult(result);
                      iterateObserversSafely(_this.observers, 'next', result);
                  }
              },
              error: function (error) {
                  _this.updateLastResult(__assign$1(__assign$1({}, _this.lastResult), { error: error, errors: error.graphQLErrors, networkStatus: NetworkStatus.error, loading: false }));
                  iterateObserversSafely(_this.observers, 'error', _this.lastError = error);
              },
          };
          _this.isTornDown = false;
          _this.options = options;
          _this.queryId = queryManager.generateQueryId();
          var opDef = getOperationDefinition(options.query);
          _this.queryName = opDef && opDef.name && opDef.name.value;
          _this.queryManager = queryManager;
          _this.queryInfo = queryInfo;
          return _this;
      }
      Object.defineProperty(ObservableQuery.prototype, "variables", {
          get: function () {
              return this.options.variables;
          },
          enumerable: false,
          configurable: true
      });
      ObservableQuery.prototype.result = function () {
          var _this = this;
          return new Promise(function (resolve, reject) {
              var observer = {
                  next: function (result) {
                      resolve(result);
                      _this.observers.delete(observer);
                      if (!_this.observers.size) {
                          _this.queryManager.removeQuery(_this.queryId);
                      }
                      setTimeout(function () {
                          subscription.unsubscribe();
                      }, 0);
                  },
                  error: reject,
              };
              var subscription = _this.subscribe(observer);
          });
      };
      ObservableQuery.prototype.getCurrentResult = function (saveAsLastResult) {
          if (saveAsLastResult === void 0) { saveAsLastResult = true; }
          var lastResult = this.lastResult;
          var networkStatus = this.queryInfo.networkStatus ||
              (lastResult && lastResult.networkStatus) ||
              NetworkStatus.ready;
          var result = __assign$1(__assign$1({}, lastResult), { loading: isNetworkRequestInFlight(networkStatus), networkStatus: networkStatus });
          if (this.isTornDown) {
              return result;
          }
          var _a = this.options.fetchPolicy, fetchPolicy = _a === void 0 ? 'cache-first' : _a;
          if (fetchPolicy === 'no-cache' ||
              fetchPolicy === 'network-only') {
              delete result.partial;
          }
          else if (!result.data ||
              !this.queryManager.transform(this.options.query).hasForcedResolvers) {
              var diff = this.queryInfo.getDiff();
              result.data = (diff.complete ||
                  this.options.returnPartialData) ? diff.result : void 0;
              if (diff.complete) {
                  if (result.networkStatus === NetworkStatus.loading &&
                      (fetchPolicy === 'cache-first' ||
                          fetchPolicy === 'cache-only')) {
                      result.networkStatus = NetworkStatus.ready;
                      result.loading = false;
                  }
                  delete result.partial;
              }
              else {
                  result.partial = true;
              }
          }
          if (saveAsLastResult) {
              this.updateLastResult(result);
          }
          return result;
      };
      ObservableQuery.prototype.isDifferentFromLastResult = function (newResult) {
          return !equal(this.lastResultSnapshot, newResult);
      };
      ObservableQuery.prototype.getLastResult = function () {
          return this.lastResult;
      };
      ObservableQuery.prototype.getLastError = function () {
          return this.lastError;
      };
      ObservableQuery.prototype.resetLastResults = function () {
          delete this.lastResult;
          delete this.lastResultSnapshot;
          delete this.lastError;
          this.isTornDown = false;
      };
      ObservableQuery.prototype.resetQueryStoreErrors = function () {
          this.queryManager.resetErrors(this.queryId);
      };
      ObservableQuery.prototype.refetch = function (variables) {
          var reobserveOptions = {
              pollInterval: 0,
          };
          var fetchPolicy = this.options.fetchPolicy;
          if (fetchPolicy !== 'no-cache' &&
              fetchPolicy !== 'cache-and-network') {
              reobserveOptions.fetchPolicy = 'network-only';
              reobserveOptions.nextFetchPolicy = fetchPolicy || "cache-first";
          }
          if (variables && !equal(this.options.variables, variables)) {
              reobserveOptions.variables = this.options.variables = __assign$1(__assign$1({}, this.options.variables), variables);
          }
          return this.newReobserver(false).reobserve(reobserveOptions, NetworkStatus.refetch);
      };
      ObservableQuery.prototype.fetchMore = function (fetchMoreOptions) {
          var _this = this;
          var combinedOptions = __assign$1(__assign$1({}, (fetchMoreOptions.query ? fetchMoreOptions : __assign$1(__assign$1(__assign$1({}, this.options), fetchMoreOptions), { variables: __assign$1(__assign$1({}, this.options.variables), fetchMoreOptions.variables) }))), { fetchPolicy: "no-cache" });
          var qid = this.queryManager.generateQueryId();
          if (combinedOptions.notifyOnNetworkStatusChange) {
              this.queryInfo.networkStatus = NetworkStatus.fetchMore;
              this.observe();
          }
          return this.queryManager.fetchQuery(qid, combinedOptions, NetworkStatus.fetchMore).then(function (fetchMoreResult) {
              var data = fetchMoreResult.data;
              var updateQuery = fetchMoreOptions.updateQuery;
              if (updateQuery) {
                  if (!warnedAboutUpdateQuery) {
                      invariant.warn("The updateQuery callback for fetchMore is deprecated, and will be removed\nin the next major version of Apollo Client.\n\nPlease convert updateQuery functions to field policies with appropriate\nread and merge functions, or use/adapt a helper function (such as\nconcatPagination, offsetLimitPagination, or relayStylePagination) from\n@apollo/client/utilities.\n\nThe field policy system handles pagination more effectively than a\nhand-written updateQuery function, and you only need to define the policy\nonce, rather than every time you call fetchMore.");
                      warnedAboutUpdateQuery = true;
                  }
                  _this.updateQuery(function (previous) { return updateQuery(previous, {
                      fetchMoreResult: data,
                      variables: combinedOptions.variables,
                  }); });
              }
              else {
                  _this.queryManager.cache.writeQuery({
                      query: combinedOptions.query,
                      variables: combinedOptions.variables,
                      data: data,
                  });
              }
              return fetchMoreResult;
          }).finally(function () {
              _this.queryManager.stopQuery(qid);
              _this.reobserve();
          });
      };
      ObservableQuery.prototype.subscribeToMore = function (options) {
          var _this = this;
          var subscription = this.queryManager
              .startGraphQLSubscription({
              query: options.document,
              variables: options.variables,
              context: options.context,
          })
              .subscribe({
              next: function (subscriptionData) {
                  var updateQuery = options.updateQuery;
                  if (updateQuery) {
                      _this.updateQuery(function (previous, _a) {
                          var variables = _a.variables;
                          return updateQuery(previous, {
                              subscriptionData: subscriptionData,
                              variables: variables,
                          });
                      });
                  }
              },
              error: function (err) {
                  if (options.onError) {
                      options.onError(err);
                      return;
                  }
                  invariant.error('Unhandled GraphQL subscription error', err);
              },
          });
          this.subscriptions.add(subscription);
          return function () {
              if (_this.subscriptions.delete(subscription)) {
                  subscription.unsubscribe();
              }
          };
      };
      ObservableQuery.prototype.setOptions = function (newOptions) {
          return this.reobserve(newOptions);
      };
      ObservableQuery.prototype.setVariables = function (variables) {
          if (equal(this.variables, variables)) {
              return this.observers.size
                  ? this.result()
                  : Promise.resolve();
          }
          this.options.variables = variables;
          if (!this.observers.size) {
              return Promise.resolve();
          }
          var _a = this.options.fetchPolicy, fetchPolicy = _a === void 0 ? 'cache-first' : _a;
          var reobserveOptions = {
              fetchPolicy: fetchPolicy,
              variables: variables,
          };
          if (fetchPolicy !== 'cache-first' &&
              fetchPolicy !== 'no-cache' &&
              fetchPolicy !== 'network-only') {
              reobserveOptions.fetchPolicy = 'cache-and-network';
              reobserveOptions.nextFetchPolicy = fetchPolicy;
          }
          return this.reobserve(reobserveOptions, NetworkStatus.setVariables);
      };
      ObservableQuery.prototype.updateQuery = function (mapFn) {
          var _a;
          var queryManager = this.queryManager;
          var result = queryManager.cache.diff({
              query: this.options.query,
              variables: this.variables,
              previousResult: (_a = this.lastResult) === null || _a === void 0 ? void 0 : _a.data,
              returnPartialData: true,
              optimistic: false,
          }).result;
          var newResult = mapFn(result, {
              variables: this.variables,
          });
          if (newResult) {
              queryManager.cache.writeQuery({
                  query: this.options.query,
                  data: newResult,
                  variables: this.variables,
              });
              queryManager.broadcastQueries();
          }
      };
      ObservableQuery.prototype.startPolling = function (pollInterval) {
          this.getReobserver().updateOptions({ pollInterval: pollInterval });
      };
      ObservableQuery.prototype.stopPolling = function () {
          if (this.reobserver) {
              this.reobserver.updateOptions({ pollInterval: 0 });
          }
      };
      ObservableQuery.prototype.updateLastResult = function (newResult) {
          var previousResult = this.lastResult;
          this.lastResult = newResult;
          this.lastResultSnapshot = this.queryManager.assumeImmutableResults
              ? newResult
              : cloneDeep(newResult);
          if (!isNonEmptyArray(newResult.errors)) {
              delete this.lastError;
          }
          return previousResult;
      };
      ObservableQuery.prototype.onSubscribe = function (observer) {
          var _this = this;
          if (observer === this.observer) {
              return function () { };
          }
          try {
              var subObserver = observer._subscription._observer;
              if (subObserver && !subObserver.error) {
                  subObserver.error = defaultSubscriptionObserverErrorCallback;
              }
          }
          catch (_a) { }
          var first = !this.observers.size;
          this.observers.add(observer);
          if (this.lastError) {
              observer.error && observer.error(this.lastError);
          }
          else if (this.lastResult) {
              observer.next && observer.next(this.lastResult);
          }
          if (first) {
              this.reobserve().catch(function (_) {
              });
          }
          return function () {
              if (_this.observers.delete(observer) && !_this.observers.size) {
                  _this.tearDownQuery();
              }
          };
      };
      ObservableQuery.prototype.getReobserver = function () {
          return this.reobserver || (this.reobserver = this.newReobserver(true));
      };
      ObservableQuery.prototype.newReobserver = function (shareOptions) {
          var _this = this;
          var _a = this, queryManager = _a.queryManager, queryId = _a.queryId;
          queryManager.setObservableQuery(this);
          return new Reobserver(this.observer, shareOptions ? this.options : __assign$1({}, this.options), function (currentOptions, newNetworkStatus) {
              queryManager.setObservableQuery(_this);
              return queryManager.fetchQueryObservable(queryId, currentOptions, newNetworkStatus);
          }, !queryManager.ssrMode && (function () { return !isNetworkRequestInFlight(_this.queryInfo.networkStatus); }));
      };
      ObservableQuery.prototype.reobserve = function (newOptions, newNetworkStatus) {
          this.isTornDown = false;
          return this.getReobserver().reobserve(newOptions, newNetworkStatus);
      };
      ObservableQuery.prototype.observe = function () {
          this.observer.next(this.getCurrentResult(false));
      };
      ObservableQuery.prototype.hasObservers = function () {
          return this.observers.size > 0;
      };
      ObservableQuery.prototype.tearDownQuery = function () {
          if (this.isTornDown)
              return;
          if (this.reobserver) {
              this.reobserver.stop();
              delete this.reobserver;
          }
          this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
          this.subscriptions.clear();
          this.queryManager.stopQuery(this.queryId);
          this.observers.clear();
          this.isTornDown = true;
      };
      return ObservableQuery;
  }(zenObservable));
  fixObservableSubclass(ObservableQuery);
  function defaultSubscriptionObserverErrorCallback(error) {
      invariant.error('Unhandled error', error.message, error.stack);
  }

  // A [trie](https://en.wikipedia.org/wiki/Trie) data structure that holds
  // object keys weakly, yet can also hold non-object keys, unlike the
  // native `WeakMap`.
  // If no makeData function is supplied, the looked-up data will be an empty,
  // null-prototype Object.
  var defaultMakeData = function () { return Object.create(null); };
  // Useful for processing arguments objects as well as arrays.
  var _a$1 = Array.prototype, forEach = _a$1.forEach, slice = _a$1.slice;
  var Trie = /** @class */ (function () {
      function Trie(weakness, makeData) {
          if (weakness === void 0) { weakness = true; }
          if (makeData === void 0) { makeData = defaultMakeData; }
          this.weakness = weakness;
          this.makeData = makeData;
      }
      Trie.prototype.lookup = function () {
          var array = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              array[_i] = arguments[_i];
          }
          return this.lookupArray(array);
      };
      Trie.prototype.lookupArray = function (array) {
          var node = this;
          forEach.call(array, function (key) { return node = node.getChildTrie(key); });
          return node.data || (node.data = this.makeData(slice.call(array)));
      };
      Trie.prototype.getChildTrie = function (key) {
          var map = this.weakness && isObjRef(key)
              ? this.weak || (this.weak = new WeakMap())
              : this.strong || (this.strong = new Map());
          var child = map.get(key);
          if (!child)
              map.set(key, child = new Trie(this.weakness, this.makeData));
          return child;
      };
      return Trie;
  }());
  function isObjRef(value) {
      switch (typeof value) {
          case "object":
              if (value === null)
                  break;
          // Fall through to return true...
          case "function":
              return true;
      }
      return false;
  }

  // This currentContext variable will only be used if the makeSlotClass
  // function is called, which happens only if this is the first copy of the
  // @wry/context package to be imported.
  var currentContext = null;
  // This unique internal object is used to denote the absence of a value
  // for a given Slot, and is never exposed to outside code.
  var MISSING_VALUE = {};
  var idCounter = 1;
  // Although we can't do anything about the cost of duplicated code from
  // accidentally bundling multiple copies of the @wry/context package, we can
  // avoid creating the Slot class more than once using makeSlotClass.
  var makeSlotClass = function () { return /** @class */ (function () {
      function Slot() {
          // If you have a Slot object, you can find out its slot.id, but you cannot
          // guess the slot.id of a Slot you don't have access to, thanks to the
          // randomized suffix.
          this.id = [
              "slot",
              idCounter++,
              Date.now(),
              Math.random().toString(36).slice(2),
          ].join(":");
      }
      Slot.prototype.hasValue = function () {
          for (var context_1 = currentContext; context_1; context_1 = context_1.parent) {
              // We use the Slot object iself as a key to its value, which means the
              // value cannot be obtained without a reference to the Slot object.
              if (this.id in context_1.slots) {
                  var value = context_1.slots[this.id];
                  if (value === MISSING_VALUE)
                      break;
                  if (context_1 !== currentContext) {
                      // Cache the value in currentContext.slots so the next lookup will
                      // be faster. This caching is safe because the tree of contexts and
                      // the values of the slots are logically immutable.
                      currentContext.slots[this.id] = value;
                  }
                  return true;
              }
          }
          if (currentContext) {
              // If a value was not found for this Slot, it's never going to be found
              // no matter how many times we look it up, so we might as well cache
              // the absence of the value, too.
              currentContext.slots[this.id] = MISSING_VALUE;
          }
          return false;
      };
      Slot.prototype.getValue = function () {
          if (this.hasValue()) {
              return currentContext.slots[this.id];
          }
      };
      Slot.prototype.withValue = function (value, callback, 
      // Given the prevalence of arrow functions, specifying arguments is likely
      // to be much more common than specifying `this`, hence this ordering:
      args, thisArg) {
          var _a;
          var slots = (_a = {
                  __proto__: null
              },
              _a[this.id] = value,
              _a);
          var parent = currentContext;
          currentContext = { parent: parent, slots: slots };
          try {
              // Function.prototype.apply allows the arguments array argument to be
              // omitted or undefined, so args! is fine here.
              return callback.apply(thisArg, args);
          }
          finally {
              currentContext = parent;
          }
      };
      // Capture the current context and wrap a callback function so that it
      // reestablishes the captured context when called.
      Slot.bind = function (callback) {
          var context = currentContext;
          return function () {
              var saved = currentContext;
              try {
                  currentContext = context;
                  return callback.apply(this, arguments);
              }
              finally {
                  currentContext = saved;
              }
          };
      };
      // Immediately run a callback function without any captured context.
      Slot.noContext = function (callback, 
      // Given the prevalence of arrow functions, specifying arguments is likely
      // to be much more common than specifying `this`, hence this ordering:
      args, thisArg) {
          if (currentContext) {
              var saved = currentContext;
              try {
                  currentContext = null;
                  // Function.prototype.apply allows the arguments array argument to be
                  // omitted or undefined, so args! is fine here.
                  return callback.apply(thisArg, args);
              }
              finally {
                  currentContext = saved;
              }
          }
          else {
              return callback.apply(thisArg, args);
          }
      };
      return Slot;
  }()); };
  // We store a single global implementation of the Slot class as a permanent
  // non-enumerable symbol property of the Array constructor. This obfuscation
  // does nothing to prevent access to the Slot class, but at least it ensures
  // the implementation (i.e. currentContext) cannot be tampered with, and all
  // copies of the @wry/context package (hopefully just one) will share the
  // same Slot implementation. Since the first copy of the @wry/context package
  // to be imported wins, this technique imposes a very high cost for any
  // future breaking changes to the Slot class.
  var globalKey = "@wry/context:Slot";
  var host = Array;
  var Slot = host[globalKey] || function () {
      var Slot = makeSlotClass();
      try {
          Object.defineProperty(host, globalKey, {
              value: host[globalKey] = Slot,
              enumerable: false,
              writable: false,
              configurable: false,
          });
      }
      finally {
          return Slot;
      }
  }();

  Slot.bind; Slot.noContext;

  function defaultDispose() { }
  var Cache = /** @class */ (function () {
      function Cache(max, dispose) {
          if (max === void 0) { max = Infinity; }
          if (dispose === void 0) { dispose = defaultDispose; }
          this.max = max;
          this.dispose = dispose;
          this.map = new Map();
          this.newest = null;
          this.oldest = null;
      }
      Cache.prototype.has = function (key) {
          return this.map.has(key);
      };
      Cache.prototype.get = function (key) {
          var node = this.getNode(key);
          return node && node.value;
      };
      Cache.prototype.getNode = function (key) {
          var node = this.map.get(key);
          if (node && node !== this.newest) {
              var older = node.older, newer = node.newer;
              if (newer) {
                  newer.older = older;
              }
              if (older) {
                  older.newer = newer;
              }
              node.older = this.newest;
              node.older.newer = node;
              node.newer = null;
              this.newest = node;
              if (node === this.oldest) {
                  this.oldest = newer;
              }
          }
          return node;
      };
      Cache.prototype.set = function (key, value) {
          var node = this.getNode(key);
          if (node) {
              return node.value = value;
          }
          node = {
              key: key,
              value: value,
              newer: null,
              older: this.newest
          };
          if (this.newest) {
              this.newest.newer = node;
          }
          this.newest = node;
          this.oldest = this.oldest || node;
          this.map.set(key, node);
          return node.value;
      };
      Cache.prototype.clean = function () {
          while (this.oldest && this.map.size > this.max) {
              this.delete(this.oldest.key);
          }
      };
      Cache.prototype.delete = function (key) {
          var node = this.map.get(key);
          if (node) {
              if (node === this.newest) {
                  this.newest = node.older;
              }
              if (node === this.oldest) {
                  this.oldest = node.newer;
              }
              if (node.newer) {
                  node.newer.older = node.older;
              }
              if (node.older) {
                  node.older.newer = node.newer;
              }
              this.map.delete(key);
              this.dispose(node.value, key);
              return true;
          }
          return false;
      };
      return Cache;
  }());

  var parentEntrySlot = new Slot();

  var _a;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var 
  // This Array.from polyfill is restricted to working with Set<any> for now,
  // but we can improve the polyfill and add other input types, as needed. Note
  // that this fallback implementation will only be used if the host environment
  // does not support a native Array.from function. In most modern JS runtimes,
  // the toArray function exported here will be === Array.from.
  toArray = (_a = Array.from, _a === void 0 ? function (collection) {
      var array = [];
      collection.forEach(function (item) { return array.push(item); });
      return array;
  } : _a);
  function maybeUnsubscribe(entryOrDep) {
      var unsubscribe = entryOrDep.unsubscribe;
      if (typeof unsubscribe === "function") {
          entryOrDep.unsubscribe = void 0;
          unsubscribe();
      }
  }

  var emptySetPool = [];
  var POOL_TARGET_SIZE = 100;
  // Since this package might be used browsers, we should avoid using the
  // Node built-in assert module.
  function assert(condition, optionalMessage) {
      if (!condition) {
          throw new Error(optionalMessage || "assertion failure");
      }
  }
  function valueIs(a, b) {
      var len = a.length;
      return (
      // Unknown values are not equal to each other.
      len > 0 &&
          // Both values must be ordinary (or both exceptional) to be equal.
          len === b.length &&
          // The underlying value or exception must be the same.
          a[len - 1] === b[len - 1]);
  }
  function valueGet(value) {
      switch (value.length) {
          case 0: throw new Error("unknown value");
          case 1: return value[0];
          case 2: throw value[1];
      }
  }
  function valueCopy(value) {
      return value.slice(0);
  }
  var Entry = /** @class */ (function () {
      function Entry(fn) {
          this.fn = fn;
          this.parents = new Set();
          this.childValues = new Map();
          // When this Entry has children that are dirty, this property becomes
          // a Set containing other Entry objects, borrowed from emptySetPool.
          // When the set becomes empty, it gets recycled back to emptySetPool.
          this.dirtyChildren = null;
          this.dirty = true;
          this.recomputing = false;
          this.value = [];
          this.deps = null;
          ++Entry.count;
      }
      Entry.prototype.peek = function () {
          if (this.value.length === 1 && !mightBeDirty(this)) {
              rememberParent(this);
              return this.value[0];
          }
      };
      // This is the most important method of the Entry API, because it
      // determines whether the cached this.value can be returned immediately,
      // or must be recomputed. The overall performance of the caching system
      // depends on the truth of the following observations: (1) this.dirty is
      // usually false, (2) this.dirtyChildren is usually null/empty, and thus
      // (3) valueGet(this.value) is usually returned without recomputation.
      Entry.prototype.recompute = function (args) {
          assert(!this.recomputing, "already recomputing");
          rememberParent(this);
          return mightBeDirty(this)
              ? reallyRecompute(this, args)
              : valueGet(this.value);
      };
      Entry.prototype.setDirty = function () {
          if (this.dirty)
              return;
          this.dirty = true;
          this.value.length = 0;
          reportDirty(this);
          // We can go ahead and unsubscribe here, since any further dirty
          // notifications we receive will be redundant, and unsubscribing may
          // free up some resources, e.g. file watchers.
          maybeUnsubscribe(this);
      };
      Entry.prototype.dispose = function () {
          var _this = this;
          this.setDirty();
          // Sever any dependency relationships with our own children, so those
          // children don't retain this parent Entry in their child.parents sets,
          // thereby preventing it from being fully garbage collected.
          forgetChildren(this);
          // Because this entry has been kicked out of the cache (in index.js),
          // we've lost the ability to find out if/when this entry becomes dirty,
          // whether that happens through a subscription, because of a direct call
          // to entry.setDirty(), or because one of its children becomes dirty.
          // Because of this loss of future information, we have to assume the
          // worst (that this entry might have become dirty very soon), so we must
          // immediately mark this entry's parents as dirty. Normally we could
          // just call entry.setDirty() rather than calling parent.setDirty() for
          // each parent, but that would leave this entry in parent.childValues
          // and parent.dirtyChildren, which would prevent the child from being
          // truly forgotten.
          eachParent(this, function (parent, child) {
              parent.setDirty();
              forgetChild(parent, _this);
          });
      };
      Entry.prototype.forget = function () {
          // The code that creates Entry objects in index.ts will replace this method
          // with one that actually removes the Entry from the cache, which will also
          // trigger the entry.dispose method.
          this.dispose();
      };
      Entry.prototype.dependOn = function (dep) {
          dep.add(this);
          if (!this.deps) {
              this.deps = emptySetPool.pop() || new Set();
          }
          this.deps.add(dep);
      };
      Entry.prototype.forgetDeps = function () {
          var _this = this;
          if (this.deps) {
              toArray(this.deps).forEach(function (dep) { return dep.delete(_this); });
              this.deps.clear();
              emptySetPool.push(this.deps);
              this.deps = null;
          }
      };
      Entry.count = 0;
      return Entry;
  }());
  function rememberParent(child) {
      var parent = parentEntrySlot.getValue();
      if (parent) {
          child.parents.add(parent);
          if (!parent.childValues.has(child)) {
              parent.childValues.set(child, []);
          }
          if (mightBeDirty(child)) {
              reportDirtyChild(parent, child);
          }
          else {
              reportCleanChild(parent, child);
          }
          return parent;
      }
  }
  function reallyRecompute(entry, args) {
      forgetChildren(entry);
      // Set entry as the parent entry while calling recomputeNewValue(entry).
      parentEntrySlot.withValue(entry, recomputeNewValue, [entry, args]);
      if (maybeSubscribe(entry, args)) {
          // If we successfully recomputed entry.value and did not fail to
          // (re)subscribe, then this Entry is no longer explicitly dirty.
          setClean(entry);
      }
      return valueGet(entry.value);
  }
  function recomputeNewValue(entry, args) {
      entry.recomputing = true;
      // Set entry.value as unknown.
      entry.value.length = 0;
      try {
          // If entry.fn succeeds, entry.value will become a normal Value.
          entry.value[0] = entry.fn.apply(null, args);
      }
      catch (e) {
          // If entry.fn throws, entry.value will become exceptional.
          entry.value[1] = e;
      }
      // Either way, this line is always reached.
      entry.recomputing = false;
  }
  function mightBeDirty(entry) {
      return entry.dirty || !!(entry.dirtyChildren && entry.dirtyChildren.size);
  }
  function setClean(entry) {
      entry.dirty = false;
      if (mightBeDirty(entry)) {
          // This Entry may still have dirty children, in which case we can't
          // let our parents know we're clean just yet.
          return;
      }
      reportClean(entry);
  }
  function reportDirty(child) {
      eachParent(child, reportDirtyChild);
  }
  function reportClean(child) {
      eachParent(child, reportCleanChild);
  }
  function eachParent(child, callback) {
      var parentCount = child.parents.size;
      if (parentCount) {
          var parents = toArray(child.parents);
          for (var i = 0; i < parentCount; ++i) {
              callback(parents[i], child);
          }
      }
  }
  // Let a parent Entry know that one of its children may be dirty.
  function reportDirtyChild(parent, child) {
      // Must have called rememberParent(child) before calling
      // reportDirtyChild(parent, child).
      assert(parent.childValues.has(child));
      assert(mightBeDirty(child));
      var parentWasClean = !mightBeDirty(parent);
      if (!parent.dirtyChildren) {
          parent.dirtyChildren = emptySetPool.pop() || new Set;
      }
      else if (parent.dirtyChildren.has(child)) {
          // If we already know this child is dirty, then we must have already
          // informed our own parents that we are dirty, so we can terminate
          // the recursion early.
          return;
      }
      parent.dirtyChildren.add(child);
      // If parent was clean before, it just became (possibly) dirty (according to
      // mightBeDirty), since we just added child to parent.dirtyChildren.
      if (parentWasClean) {
          reportDirty(parent);
      }
  }
  // Let a parent Entry know that one of its children is no longer dirty.
  function reportCleanChild(parent, child) {
      // Must have called rememberChild(child) before calling
      // reportCleanChild(parent, child).
      assert(parent.childValues.has(child));
      assert(!mightBeDirty(child));
      var childValue = parent.childValues.get(child);
      if (childValue.length === 0) {
          parent.childValues.set(child, valueCopy(child.value));
      }
      else if (!valueIs(childValue, child.value)) {
          parent.setDirty();
      }
      removeDirtyChild(parent, child);
      if (mightBeDirty(parent)) {
          return;
      }
      reportClean(parent);
  }
  function removeDirtyChild(parent, child) {
      var dc = parent.dirtyChildren;
      if (dc) {
          dc.delete(child);
          if (dc.size === 0) {
              if (emptySetPool.length < POOL_TARGET_SIZE) {
                  emptySetPool.push(dc);
              }
              parent.dirtyChildren = null;
          }
      }
  }
  // Removes all children from this entry and returns an array of the
  // removed children.
  function forgetChildren(parent) {
      if (parent.childValues.size > 0) {
          parent.childValues.forEach(function (_value, child) {
              forgetChild(parent, child);
          });
      }
      // Remove this parent Entry from any sets to which it was added by the
      // addToSet method.
      parent.forgetDeps();
      // After we forget all our children, this.dirtyChildren must be empty
      // and therefore must have been reset to null.
      assert(parent.dirtyChildren === null);
  }
  function forgetChild(parent, child) {
      child.parents.delete(parent);
      parent.childValues.delete(child);
      removeDirtyChild(parent, child);
  }
  function maybeSubscribe(entry, args) {
      if (typeof entry.subscribe === "function") {
          try {
              maybeUnsubscribe(entry); // Prevent double subscriptions.
              entry.unsubscribe = entry.subscribe.apply(null, args);
          }
          catch (e) {
              // If this Entry has a subscribe function and it threw an exception
              // (or an unsubscribe function it previously returned now throws),
              // return false to indicate that we were not able to subscribe (or
              // unsubscribe), and this Entry should remain dirty.
              entry.setDirty();
              return false;
          }
      }
      // Returning true indicates either that there was no entry.subscribe
      // function or that it succeeded.
      return true;
  }

  var EntryMethods = {
      setDirty: true,
      dispose: true,
      forget: true,
  };
  function dep(options) {
      var depsByKey = new Map();
      var subscribe = options && options.subscribe;
      function depend(key) {
          var parent = parentEntrySlot.getValue();
          if (parent) {
              var dep_1 = depsByKey.get(key);
              if (!dep_1) {
                  depsByKey.set(key, dep_1 = new Set);
              }
              parent.dependOn(dep_1);
              if (typeof subscribe === "function") {
                  maybeUnsubscribe(dep_1);
                  dep_1.unsubscribe = subscribe(key);
              }
          }
      }
      depend.dirty = function dirty(key, entryMethodName) {
          var dep = depsByKey.get(key);
          if (dep) {
              var m_1 = (entryMethodName &&
                  hasOwnProperty.call(EntryMethods, entryMethodName)) ? entryMethodName : "setDirty";
              // We have to use toArray(dep).forEach instead of dep.forEach, because
              // modifying a Set while iterating over it can cause elements in the Set
              // to be removed from the Set before they've been iterated over.
              toArray(dep).forEach(function (entry) { return entry[m_1](); });
              depsByKey.delete(key);
              maybeUnsubscribe(dep);
          }
      };
      return depend;
  }

  function makeDefaultMakeCacheKeyFunction() {
      var keyTrie = new Trie(typeof WeakMap === "function");
      return function () {
          return keyTrie.lookupArray(arguments);
      };
  }
  // The defaultMakeCacheKey function is remarkably powerful, because it gives
  // a unique object for any shallow-identical list of arguments. If you need
  // to implement a custom makeCacheKey function, you may find it helpful to
  // delegate the final work to defaultMakeCacheKey, which is why we export it
  // here. However, you may want to avoid defaultMakeCacheKey if your runtime
  // does not support WeakMap, or you have the ability to return a string key.
  // In those cases, just write your own custom makeCacheKey functions.
  makeDefaultMakeCacheKeyFunction();
  var caches = new Set();
  function wrap(originalFunction, options) {
      if (options === void 0) { options = Object.create(null); }
      var cache = new Cache(options.max || Math.pow(2, 16), function (entry) { return entry.dispose(); });
      var keyArgs = options.keyArgs;
      var makeCacheKey = options.makeCacheKey ||
          makeDefaultMakeCacheKeyFunction();
      var optimistic = function () {
          var key = makeCacheKey.apply(null, keyArgs ? keyArgs.apply(null, arguments) : arguments);
          if (key === void 0) {
              return originalFunction.apply(null, arguments);
          }
          var entry = cache.get(key);
          if (!entry) {
              cache.set(key, entry = new Entry(originalFunction));
              entry.subscribe = options.subscribe;
              // Give the Entry the ability to trigger cache.delete(key), even though
              // the Entry itself does not know about key or cache.
              entry.forget = function () { return cache.delete(key); };
          }
          var value = entry.recompute(Array.prototype.slice.call(arguments));
          // Move this entry to the front of the least-recently used queue,
          // since we just finished computing its value.
          cache.set(key, entry);
          caches.add(cache);
          // Clean up any excess entries in the cache, but only if there is no
          // active parent entry, meaning we're not in the middle of a larger
          // computation that might be flummoxed by the cleaning.
          if (!parentEntrySlot.hasValue()) {
              caches.forEach(function (cache) { return cache.clean(); });
              caches.clear();
          }
          return value;
      };
      Object.defineProperty(optimistic, "size", {
          get: function () {
              return cache["map"].size;
          },
          configurable: false,
          enumerable: false,
      });
      function dirtyKey(key) {
          var entry = cache.get(key);
          if (entry) {
              entry.setDirty();
          }
      }
      optimistic.dirtyKey = dirtyKey;
      optimistic.dirty = function dirty() {
          dirtyKey(makeCacheKey.apply(null, arguments));
      };
      function peekKey(key) {
          var entry = cache.get(key);
          if (entry) {
              return entry.peek();
          }
      }
      optimistic.peekKey = peekKey;
      optimistic.peek = function peek() {
          return peekKey(makeCacheKey.apply(null, arguments));
      };
      function forgetKey(key) {
          return cache.delete(key);
      }
      optimistic.forgetKey = forgetKey;
      optimistic.forget = function forget() {
          return forgetKey(makeCacheKey.apply(null, arguments));
      };
      optimistic.makeCacheKey = makeCacheKey;
      optimistic.getKey = keyArgs ? function getKey() {
          return makeCacheKey.apply(null, keyArgs.apply(null, arguments));
      } : makeCacheKey;
      return Object.freeze(optimistic);
  }

  var ApolloCache = (function () {
      function ApolloCache() {
          this.getFragmentDoc = wrap(getFragmentQueryDocument);
      }
      ApolloCache.prototype.recordOptimisticTransaction = function (transaction, optimisticId) {
          this.performTransaction(transaction, optimisticId);
      };
      ApolloCache.prototype.transformDocument = function (document) {
          return document;
      };
      ApolloCache.prototype.identify = function (object) {
          return;
      };
      ApolloCache.prototype.gc = function () {
          return [];
      };
      ApolloCache.prototype.modify = function (options) {
          return false;
      };
      ApolloCache.prototype.transformForLink = function (document) {
          return document;
      };
      ApolloCache.prototype.readQuery = function (options, optimistic) {
          if (optimistic === void 0) { optimistic = !!options.optimistic; }
          return this.read({
              rootId: options.id || 'ROOT_QUERY',
              query: options.query,
              variables: options.variables,
              returnPartialData: options.returnPartialData,
              optimistic: optimistic,
          });
      };
      ApolloCache.prototype.readFragment = function (options, optimistic) {
          if (optimistic === void 0) { optimistic = !!options.optimistic; }
          return this.read({
              query: this.getFragmentDoc(options.fragment, options.fragmentName),
              variables: options.variables,
              rootId: options.id,
              returnPartialData: options.returnPartialData,
              optimistic: optimistic,
          });
      };
      ApolloCache.prototype.writeQuery = function (options) {
          return this.write({
              dataId: options.id || 'ROOT_QUERY',
              result: options.data,
              query: options.query,
              variables: options.variables,
              broadcast: options.broadcast,
          });
      };
      ApolloCache.prototype.writeFragment = function (options) {
          return this.write({
              dataId: options.id,
              result: options.data,
              variables: options.variables,
              query: this.getFragmentDoc(options.fragment, options.fragmentName),
              broadcast: options.broadcast,
          });
      };
      return ApolloCache;
  }());

  var MissingFieldError = (function () {
      function MissingFieldError(message, path, query, clientOnly, variables) {
          this.message = message;
          this.path = path;
          this.query = query;
          this.clientOnly = clientOnly;
          this.variables = variables;
      }
      return MissingFieldError;
  }());

  var hasOwn = Object.prototype.hasOwnProperty;
  function getTypenameFromStoreObject(store, objectOrReference) {
      return isReference(objectOrReference)
          ? store.get(objectOrReference.__ref, "__typename")
          : objectOrReference && objectOrReference.__typename;
  }
  var TypeOrFieldNameRegExp = /^[_a-z][_0-9a-z]*/i;
  function fieldNameFromStoreName(storeFieldName) {
      var match = storeFieldName.match(TypeOrFieldNameRegExp);
      return match ? match[0] : storeFieldName;
  }
  function selectionSetMatchesResult(selectionSet, result, variables) {
      if (result && typeof result === "object") {
          return Array.isArray(result)
              ? result.every(function (item) { return selectionSetMatchesResult(selectionSet, item, variables); })
              : selectionSet.selections.every(function (field) {
                  if (isField(field) && shouldInclude(field, variables)) {
                      var key = resultKeyNameFromField(field);
                      return hasOwn.call(result, key) &&
                          (!field.selectionSet ||
                              selectionSetMatchesResult(field.selectionSet, result[key], variables));
                  }
                  return true;
              });
      }
      return false;
  }
  function storeValueIsStoreObject(value) {
      return value !== null &&
          typeof value === "object" &&
          !isReference(value) &&
          !Array.isArray(value);
  }
  function makeProcessedFieldsMerger() {
      return new DeepMerger;
  }

  var DELETE = Object.create(null);
  var delModifier = function () { return DELETE; };
  var INVALIDATE = Object.create(null);
  var EntityStore = (function () {
      function EntityStore(policies, group) {
          var _this = this;
          this.policies = policies;
          this.group = group;
          this.data = Object.create(null);
          this.rootIds = Object.create(null);
          this.refs = Object.create(null);
          this.getFieldValue = function (objectOrReference, storeFieldName) { return maybeDeepFreeze(isReference(objectOrReference)
              ? _this.get(objectOrReference.__ref, storeFieldName)
              : objectOrReference && objectOrReference[storeFieldName]); };
          this.canRead = function (objOrRef) {
              return isReference(objOrRef)
                  ? _this.has(objOrRef.__ref)
                  : typeof objOrRef === "object";
          };
          this.toReference = function (objOrIdOrRef, mergeIntoStore) {
              if (typeof objOrIdOrRef === "string") {
                  return makeReference(objOrIdOrRef);
              }
              if (isReference(objOrIdOrRef)) {
                  return objOrIdOrRef;
              }
              var id = _this.policies.identify(objOrIdOrRef)[0];
              if (id) {
                  var ref = makeReference(id);
                  if (mergeIntoStore) {
                      _this.merge(id, objOrIdOrRef);
                  }
                  return ref;
              }
          };
      }
      EntityStore.prototype.toObject = function () {
          return __assign$1({}, this.data);
      };
      EntityStore.prototype.has = function (dataId) {
          return this.lookup(dataId, true) !== void 0;
      };
      EntityStore.prototype.get = function (dataId, fieldName) {
          this.group.depend(dataId, fieldName);
          if (hasOwn.call(this.data, dataId)) {
              var storeObject = this.data[dataId];
              if (storeObject && hasOwn.call(storeObject, fieldName)) {
                  return storeObject[fieldName];
              }
          }
          if (fieldName === "__typename" &&
              hasOwn.call(this.policies.rootTypenamesById, dataId)) {
              return this.policies.rootTypenamesById[dataId];
          }
          if (this instanceof Layer) {
              return this.parent.get(dataId, fieldName);
          }
      };
      EntityStore.prototype.lookup = function (dataId, dependOnExistence) {
          if (dependOnExistence)
              this.group.depend(dataId, "__exists");
          if (hasOwn.call(this.data, dataId)) {
              return this.data[dataId];
          }
          if (this instanceof Layer) {
              return this.parent.lookup(dataId, dependOnExistence);
          }
          if (this.policies.rootTypenamesById[dataId]) {
              return Object.create(null);
          }
      };
      EntityStore.prototype.merge = function (dataId, incoming) {
          var _this = this;
          var existing = this.lookup(dataId);
          var merged = new DeepMerger(storeObjectReconciler).merge(existing, incoming);
          this.data[dataId] = merged;
          if (merged !== existing) {
              delete this.refs[dataId];
              if (this.group.caching) {
                  var fieldsToDirty_1 = Object.create(null);
                  if (!existing)
                      fieldsToDirty_1.__exists = 1;
                  Object.keys(incoming).forEach(function (storeFieldName) {
                      if (!existing || existing[storeFieldName] !== merged[storeFieldName]) {
                          fieldsToDirty_1[storeFieldName] = 1;
                          var fieldName = fieldNameFromStoreName(storeFieldName);
                          if (fieldName !== storeFieldName &&
                              !_this.policies.hasKeyArgs(merged.__typename, fieldName)) {
                              fieldsToDirty_1[fieldName] = 1;
                          }
                          if (merged[storeFieldName] === void 0 && !(_this instanceof Layer)) {
                              delete merged[storeFieldName];
                          }
                      }
                  });
                  Object.keys(fieldsToDirty_1).forEach(function (fieldName) { return _this.group.dirty(dataId, fieldName); });
              }
          }
      };
      EntityStore.prototype.modify = function (dataId, fields) {
          var _this = this;
          var storeObject = this.lookup(dataId);
          if (storeObject) {
              var changedFields_1 = Object.create(null);
              var needToMerge_1 = false;
              var allDeleted_1 = true;
              var sharedDetails_1 = {
                  DELETE: DELETE,
                  INVALIDATE: INVALIDATE,
                  isReference: isReference,
                  toReference: this.toReference,
                  canRead: this.canRead,
                  readField: function (fieldNameOrOptions, from) { return _this.policies.readField(typeof fieldNameOrOptions === "string" ? {
                      fieldName: fieldNameOrOptions,
                      from: from || makeReference(dataId),
                  } : fieldNameOrOptions, { store: _this }); },
              };
              Object.keys(storeObject).forEach(function (storeFieldName) {
                  var fieldName = fieldNameFromStoreName(storeFieldName);
                  var fieldValue = storeObject[storeFieldName];
                  if (fieldValue === void 0)
                      return;
                  var modify = typeof fields === "function"
                      ? fields
                      : fields[storeFieldName] || fields[fieldName];
                  if (modify) {
                      var newValue = modify === delModifier ? DELETE :
                          modify(maybeDeepFreeze(fieldValue), __assign$1(__assign$1({}, sharedDetails_1), { fieldName: fieldName,
                              storeFieldName: storeFieldName, storage: _this.getStorage(dataId, storeFieldName) }));
                      if (newValue === INVALIDATE) {
                          _this.group.dirty(dataId, storeFieldName);
                      }
                      else {
                          if (newValue === DELETE)
                              newValue = void 0;
                          if (newValue !== fieldValue) {
                              changedFields_1[storeFieldName] = newValue;
                              needToMerge_1 = true;
                              fieldValue = newValue;
                          }
                      }
                  }
                  if (fieldValue !== void 0) {
                      allDeleted_1 = false;
                  }
              });
              if (needToMerge_1) {
                  this.merge(dataId, changedFields_1);
                  if (allDeleted_1) {
                      if (this instanceof Layer) {
                          this.data[dataId] = void 0;
                      }
                      else {
                          delete this.data[dataId];
                      }
                      this.group.dirty(dataId, "__exists");
                  }
                  return true;
              }
          }
          return false;
      };
      EntityStore.prototype.delete = function (dataId, fieldName, args) {
          var _a;
          var storeObject = this.lookup(dataId);
          if (storeObject) {
              var typename = this.getFieldValue(storeObject, "__typename");
              var storeFieldName = fieldName && args
                  ? this.policies.getStoreFieldName({ typename: typename, fieldName: fieldName, args: args })
                  : fieldName;
              return this.modify(dataId, storeFieldName ? (_a = {},
                  _a[storeFieldName] = delModifier,
                  _a) : delModifier);
          }
          return false;
      };
      EntityStore.prototype.evict = function (options) {
          var evicted = false;
          if (options.id) {
              if (hasOwn.call(this.data, options.id)) {
                  evicted = this.delete(options.id, options.fieldName, options.args);
              }
              if (this instanceof Layer) {
                  evicted = this.parent.evict(options) || evicted;
              }
              if (options.fieldName || evicted) {
                  this.group.dirty(options.id, options.fieldName || "__exists");
              }
          }
          return evicted;
      };
      EntityStore.prototype.clear = function () {
          this.replace(null);
      };
      EntityStore.prototype.extract = function () {
          var _this = this;
          var obj = this.toObject();
          var extraRootIds = [];
          this.getRootIdSet().forEach(function (id) {
              if (!hasOwn.call(_this.policies.rootTypenamesById, id)) {
                  extraRootIds.push(id);
              }
          });
          if (extraRootIds.length) {
              obj.__META = { extraRootIds: extraRootIds.sort() };
          }
          return obj;
      };
      EntityStore.prototype.replace = function (newData) {
          var _this = this;
          Object.keys(this.data).forEach(function (dataId) {
              if (!(newData && hasOwn.call(newData, dataId))) {
                  _this.delete(dataId);
              }
          });
          if (newData) {
              var __META = newData.__META, rest_1 = __rest(newData, ["__META"]);
              Object.keys(rest_1).forEach(function (dataId) {
                  _this.merge(dataId, rest_1[dataId]);
              });
              if (__META) {
                  __META.extraRootIds.forEach(this.retain, this);
              }
          }
      };
      EntityStore.prototype.retain = function (rootId) {
          return this.rootIds[rootId] = (this.rootIds[rootId] || 0) + 1;
      };
      EntityStore.prototype.release = function (rootId) {
          if (this.rootIds[rootId] > 0) {
              var count = --this.rootIds[rootId];
              if (!count)
                  delete this.rootIds[rootId];
              return count;
          }
          return 0;
      };
      EntityStore.prototype.getRootIdSet = function (ids) {
          if (ids === void 0) { ids = new Set(); }
          Object.keys(this.rootIds).forEach(ids.add, ids);
          if (this instanceof Layer) {
              this.parent.getRootIdSet(ids);
          }
          else {
              Object.keys(this.policies.rootTypenamesById).forEach(ids.add, ids);
          }
          return ids;
      };
      EntityStore.prototype.gc = function () {
          var _this = this;
          var ids = this.getRootIdSet();
          var snapshot = this.toObject();
          ids.forEach(function (id) {
              if (hasOwn.call(snapshot, id)) {
                  Object.keys(_this.findChildRefIds(id)).forEach(ids.add, ids);
                  delete snapshot[id];
              }
          });
          var idsToRemove = Object.keys(snapshot);
          if (idsToRemove.length) {
              var root_1 = this;
              while (root_1 instanceof Layer)
                  root_1 = root_1.parent;
              idsToRemove.forEach(function (id) { return root_1.delete(id); });
          }
          return idsToRemove;
      };
      EntityStore.prototype.findChildRefIds = function (dataId) {
          if (!hasOwn.call(this.refs, dataId)) {
              var found_1 = this.refs[dataId] = Object.create(null);
              var workSet_1 = new Set([this.data[dataId]]);
              var canTraverse_1 = function (obj) { return obj !== null && typeof obj === 'object'; };
              workSet_1.forEach(function (obj) {
                  if (isReference(obj)) {
                      found_1[obj.__ref] = true;
                  }
                  else if (canTraverse_1(obj)) {
                      Object.values(obj)
                          .filter(canTraverse_1)
                          .forEach(workSet_1.add, workSet_1);
                  }
              });
          }
          return this.refs[dataId];
      };
      EntityStore.prototype.makeCacheKey = function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return this.group.keyMaker.lookupArray(args);
      };
      return EntityStore;
  }());
  var CacheGroup = (function () {
      function CacheGroup(caching) {
          this.caching = caching;
          this.d = null;
          this.keyMaker = new Trie(canUseWeakMap);
          this.d = caching ? dep() : null;
      }
      CacheGroup.prototype.depend = function (dataId, storeFieldName) {
          if (this.d) {
              this.d(makeDepKey(dataId, storeFieldName));
              var fieldName = fieldNameFromStoreName(storeFieldName);
              if (fieldName !== storeFieldName) {
                  this.d(makeDepKey(dataId, fieldName));
              }
          }
      };
      CacheGroup.prototype.dirty = function (dataId, storeFieldName) {
          if (this.d) {
              this.d.dirty(makeDepKey(dataId, storeFieldName));
          }
      };
      return CacheGroup;
  }());
  function makeDepKey(dataId, storeFieldName) {
      return storeFieldName + '#' + dataId;
  }
  (function (EntityStore) {
      var Root = (function (_super) {
          __extends$1(Root, _super);
          function Root(_a) {
              var policies = _a.policies, _b = _a.resultCaching, resultCaching = _b === void 0 ? true : _b, seed = _a.seed;
              var _this = _super.call(this, policies, new CacheGroup(resultCaching)) || this;
              _this.storageTrie = new Trie(canUseWeakMap);
              _this.sharedLayerGroup = new CacheGroup(resultCaching);
              if (seed)
                  _this.replace(seed);
              return _this;
          }
          Root.prototype.addLayer = function (layerId, replay) {
              return new Layer(layerId, this, replay, this.sharedLayerGroup);
          };
          Root.prototype.removeLayer = function () {
              return this;
          };
          Root.prototype.getStorage = function () {
              return this.storageTrie.lookupArray(arguments);
          };
          return Root;
      }(EntityStore));
      EntityStore.Root = Root;
  })(EntityStore || (EntityStore = {}));
  var Layer = (function (_super) {
      __extends$1(Layer, _super);
      function Layer(id, parent, replay, group) {
          var _this = _super.call(this, parent.policies, group) || this;
          _this.id = id;
          _this.parent = parent;
          _this.replay = replay;
          _this.group = group;
          replay(_this);
          return _this;
      }
      Layer.prototype.addLayer = function (layerId, replay) {
          return new Layer(layerId, this, replay, this.group);
      };
      Layer.prototype.removeLayer = function (layerId) {
          var _this = this;
          var parent = this.parent.removeLayer(layerId);
          if (layerId === this.id) {
              if (this.group.caching) {
                  Object.keys(this.data).forEach(function (dataId) {
                      if (_this.data[dataId] !== parent.lookup(dataId)) {
                          _this.delete(dataId);
                      }
                  });
              }
              return parent;
          }
          if (parent === this.parent)
              return this;
          return parent.addLayer(this.id, this.replay);
      };
      Layer.prototype.toObject = function () {
          return __assign$1(__assign$1({}, this.parent.toObject()), this.data);
      };
      Layer.prototype.findChildRefIds = function (dataId) {
          var fromParent = this.parent.findChildRefIds(dataId);
          return hasOwn.call(this.data, dataId) ? __assign$1(__assign$1({}, fromParent), _super.prototype.findChildRefIds.call(this, dataId)) : fromParent;
      };
      Layer.prototype.getStorage = function () {
          var p = this.parent;
          while (p.parent)
              p = p.parent;
          return p.getStorage.apply(p, arguments);
      };
      return Layer;
  }(EntityStore));
  function storeObjectReconciler(existingObject, incomingObject, property) {
      var existingValue = existingObject[property];
      var incomingValue = incomingObject[property];
      return equal(existingValue, incomingValue) ? existingValue : incomingValue;
  }
  function supportsResultCaching(store) {
      return !!(store instanceof EntityStore && store.group.caching);
  }

  function missingFromInvariant(err, context) {
      return new MissingFieldError(err.message, context.path.slice(), context.query, context.clientOnly, context.variables);
  }
  var StoreReader = (function () {
      function StoreReader(config) {
          var _this = this;
          this.config = config;
          this.executeSelectionSet = wrap(function (options) { return _this.execSelectionSetImpl(options); }, {
              keyArgs: function (options) {
                  return [
                      options.selectionSet,
                      options.objectOrReference,
                      options.context,
                  ];
              },
              makeCacheKey: function (selectionSet, parent, context) {
                  if (supportsResultCaching(context.store)) {
                      return context.store.makeCacheKey(selectionSet, isReference(parent) ? parent.__ref : parent, context.varString);
                  }
              }
          });
          this.knownResults = new WeakMap();
          this.executeSubSelectedArray = wrap(function (options) {
              return _this.execSubSelectedArrayImpl(options);
          }, {
              makeCacheKey: function (_a) {
                  var field = _a.field, array = _a.array, context = _a.context;
                  if (supportsResultCaching(context.store)) {
                      return context.store.makeCacheKey(field, array, context.varString);
                  }
              }
          });
          this.config = __assign$1({ addTypename: true }, config);
      }
      StoreReader.prototype.diffQueryAgainstStore = function (_a) {
          var store = _a.store, query = _a.query, _b = _a.rootId, rootId = _b === void 0 ? 'ROOT_QUERY' : _b, variables = _a.variables, _c = _a.returnPartialData, returnPartialData = _c === void 0 ? true : _c;
          var policies = this.config.cache.policies;
          variables = __assign$1(__assign$1({}, getDefaultValues(getQueryDefinition(query))), variables);
          var execResult = this.executeSelectionSet({
              selectionSet: getMainDefinition(query).selectionSet,
              objectOrReference: makeReference(rootId),
              context: {
                  store: store,
                  query: query,
                  policies: policies,
                  variables: variables,
                  varString: JSON.stringify(variables),
                  fragmentMap: createFragmentMap(getFragmentDefinitions(query)),
                  path: [],
                  clientOnly: false,
              },
          });
          var hasMissingFields = execResult.missing && execResult.missing.length > 0;
          if (hasMissingFields && !returnPartialData) {
              throw execResult.missing[0];
          }
          return {
              result: execResult.result,
              missing: execResult.missing,
              complete: !hasMissingFields,
          };
      };
      StoreReader.prototype.isFresh = function (result, parent, selectionSet, context) {
          if (supportsResultCaching(context.store) &&
              this.knownResults.get(result) === selectionSet) {
              var latest = this.executeSelectionSet.peek(selectionSet, parent, context);
              if (latest && result === latest.result) {
                  return true;
              }
          }
          return false;
      };
      StoreReader.prototype.execSelectionSetImpl = function (_a) {
          var _this = this;
          var selectionSet = _a.selectionSet, objectOrReference = _a.objectOrReference, context = _a.context;
          if (isReference(objectOrReference) &&
              !context.policies.rootTypenamesById[objectOrReference.__ref] &&
              !context.store.has(objectOrReference.__ref)) {
              return {
                  result: {},
                  missing: [missingFromInvariant(new InvariantError("Dangling reference to missing " + objectOrReference.__ref + " object"), context)],
              };
          }
          var variables = context.variables, policies = context.policies, store = context.store;
          var objectsToMerge = [];
          var finalResult = { result: null };
          var typename = store.getFieldValue(objectOrReference, "__typename");
          if (this.config.addTypename &&
              typeof typename === "string" &&
              !policies.rootIdsByTypename[typename]) {
              objectsToMerge.push({ __typename: typename });
          }
          function getMissing() {
              return finalResult.missing || (finalResult.missing = []);
          }
          function handleMissing(result) {
              var _a;
              if (result.missing)
                  (_a = getMissing()).push.apply(_a, result.missing);
              return result.result;
          }
          var workSet = new Set(selectionSet.selections);
          workSet.forEach(function (selection) {
              var _a;
              if (!shouldInclude(selection, variables))
                  return;
              if (isField(selection)) {
                  var fieldValue = policies.readField({
                      fieldName: selection.name.value,
                      field: selection,
                      variables: context.variables,
                      from: objectOrReference,
                  }, context);
                  var resultName = resultKeyNameFromField(selection);
                  context.path.push(resultName);
                  var wasClientOnly = context.clientOnly;
                  context.clientOnly = wasClientOnly || !!(selection.directives &&
                      selection.directives.some(function (d) { return d.name.value === "client"; }));
                  if (fieldValue === void 0) {
                      if (!addTypenameToDocument.added(selection)) {
                          getMissing().push(missingFromInvariant(new InvariantError("Can't find field '" + selection.name.value + "' on " + (isReference(objectOrReference)
                              ? objectOrReference.__ref + " object"
                              : "object " + JSON.stringify(objectOrReference, null, 2))), context));
                      }
                  }
                  else if (Array.isArray(fieldValue)) {
                      fieldValue = handleMissing(_this.executeSubSelectedArray({
                          field: selection,
                          array: fieldValue,
                          context: context,
                      }));
                  }
                  else if (!selection.selectionSet) {
                      {
                          assertSelectionSetForIdValue(context.store, selection, fieldValue);
                          maybeDeepFreeze(fieldValue);
                      }
                  }
                  else if (fieldValue != null) {
                      fieldValue = handleMissing(_this.executeSelectionSet({
                          selectionSet: selection.selectionSet,
                          objectOrReference: fieldValue,
                          context: context,
                      }));
                  }
                  if (fieldValue !== void 0) {
                      objectsToMerge.push((_a = {}, _a[resultName] = fieldValue, _a));
                  }
                  context.clientOnly = wasClientOnly;
                  invariant(context.path.pop() === resultName);
              }
              else {
                  var fragment = getFragmentFromSelection(selection, context.fragmentMap);
                  if (fragment && policies.fragmentMatches(fragment, typename)) {
                      fragment.selectionSet.selections.forEach(workSet.add, workSet);
                  }
              }
          });
          finalResult.result = mergeDeepArray(objectsToMerge);
          {
              Object.freeze(finalResult.result);
          }
          this.knownResults.set(finalResult.result, selectionSet);
          return finalResult;
      };
      StoreReader.prototype.execSubSelectedArrayImpl = function (_a) {
          var _this = this;
          var field = _a.field, array = _a.array, context = _a.context;
          var missing;
          function handleMissing(childResult, i) {
              if (childResult.missing) {
                  missing = missing || [];
                  missing.push.apply(missing, childResult.missing);
              }
              invariant(context.path.pop() === i);
              return childResult.result;
          }
          if (field.selectionSet) {
              array = array.filter(context.store.canRead);
          }
          array = array.map(function (item, i) {
              if (item === null) {
                  return null;
              }
              context.path.push(i);
              if (Array.isArray(item)) {
                  return handleMissing(_this.executeSubSelectedArray({
                      field: field,
                      array: item,
                      context: context,
                  }), i);
              }
              if (field.selectionSet) {
                  return handleMissing(_this.executeSelectionSet({
                      selectionSet: field.selectionSet,
                      objectOrReference: item,
                      context: context,
                  }), i);
              }
              {
                  assertSelectionSetForIdValue(context.store, field, item);
              }
              invariant(context.path.pop() === i);
              return item;
          });
          {
              Object.freeze(array);
          }
          return { result: array, missing: missing };
      };
      return StoreReader;
  }());
  function assertSelectionSetForIdValue(store, field, fieldValue) {
      if (!field.selectionSet) {
          var workSet_1 = new Set([fieldValue]);
          workSet_1.forEach(function (value) {
              if (value && typeof value === "object") {
                  invariant(!isReference(value), "Missing selection set for object of type " + getTypenameFromStoreObject(store, value) + " returned for query field " + field.name.value);
                  Object.values(value).forEach(workSet_1.add, workSet_1);
              }
          });
      }
  }

  var StoreWriter = (function () {
      function StoreWriter(cache, reader) {
          this.cache = cache;
          this.reader = reader;
      }
      StoreWriter.prototype.writeToStore = function (_a) {
          var query = _a.query, result = _a.result, dataId = _a.dataId, store = _a.store, variables = _a.variables;
          var operationDefinition = getOperationDefinition(query);
          var merger = makeProcessedFieldsMerger();
          variables = __assign$1(__assign$1({}, getDefaultValues(operationDefinition)), variables);
          var ref = this.processSelectionSet({
              result: result || Object.create(null),
              dataId: dataId,
              selectionSet: operationDefinition.selectionSet,
              mergeTree: { map: new Map },
              context: {
                  store: store,
                  written: Object.create(null),
                  merge: function (existing, incoming) {
                      return merger.merge(existing, incoming);
                  },
                  variables: variables,
                  varString: JSON.stringify(variables),
                  fragmentMap: createFragmentMap(getFragmentDefinitions(query)),
              },
          });
          if (!isReference(ref)) {
              throw new InvariantError("Could not identify object " + JSON.stringify(result));
          }
          store.retain(ref.__ref);
          return ref;
      };
      StoreWriter.prototype.processSelectionSet = function (_a) {
          var _this = this;
          var dataId = _a.dataId, result = _a.result, selectionSet = _a.selectionSet, context = _a.context, mergeTree = _a.mergeTree;
          var policies = this.cache.policies;
          var _b = policies.identify(result, selectionSet, context.fragmentMap), id = _b[0], keyObject = _b[1];
          dataId = dataId || id;
          if ("string" === typeof dataId) {
              var sets = context.written[dataId] || (context.written[dataId] = []);
              var ref = makeReference(dataId);
              if (sets.indexOf(selectionSet) >= 0)
                  return ref;
              sets.push(selectionSet);
              if (this.reader && this.reader.isFresh(result, ref, selectionSet, context)) {
                  return ref;
              }
          }
          var incomingFields = Object.create(null);
          if (keyObject) {
              incomingFields = context.merge(incomingFields, keyObject);
          }
          var typename = (dataId && policies.rootTypenamesById[dataId]) ||
              getTypenameFromResult(result, selectionSet, context.fragmentMap) ||
              (dataId && context.store.get(dataId, "__typename"));
          if ("string" === typeof typename) {
              incomingFields.__typename = typename;
          }
          var workSet = new Set(selectionSet.selections);
          workSet.forEach(function (selection) {
              var _a;
              if (!shouldInclude(selection, context.variables))
                  return;
              if (isField(selection)) {
                  var resultFieldKey = resultKeyNameFromField(selection);
                  var value = result[resultFieldKey];
                  if (typeof value !== 'undefined') {
                      var storeFieldName = policies.getStoreFieldName({
                          typename: typename,
                          fieldName: selection.name.value,
                          field: selection,
                          variables: context.variables,
                      });
                      var childTree = getChildMergeTree(mergeTree, storeFieldName);
                      var incomingValue = _this.processFieldValue(value, selection, context, childTree);
                      var childTypename = selection.selectionSet
                          && context.store.getFieldValue(incomingValue, "__typename")
                          || void 0;
                      var merge = policies.getMergeFunction(typename, selection.name.value, childTypename);
                      if (merge) {
                          childTree.info = {
                              field: selection,
                              typename: typename,
                              merge: merge,
                          };
                      }
                      else {
                          maybeRecycleChildMergeTree(mergeTree, storeFieldName);
                      }
                      incomingFields = context.merge(incomingFields, (_a = {},
                          _a[storeFieldName] = incomingValue,
                          _a));
                  }
                  else if (policies.usingPossibleTypes &&
                      !hasDirectives(["defer", "client"], selection)) {
                      throw new InvariantError("Missing field '" + resultFieldKey + "' in " + JSON.stringify(result, null, 2).substring(0, 100));
                  }
              }
              else {
                  var fragment = getFragmentFromSelection(selection, context.fragmentMap);
                  if (fragment &&
                      policies.fragmentMatches(fragment, typename, result, context.variables)) {
                      fragment.selectionSet.selections.forEach(workSet.add, workSet);
                  }
              }
          });
          if ("string" === typeof dataId) {
              var entityRef_1 = makeReference(dataId);
              if (mergeTree.map.size) {
                  incomingFields = this.applyMerges(mergeTree, entityRef_1, incomingFields, context);
              }
              {
                  var hasSelectionSet_1 = function (storeFieldName) {
                      return fieldsWithSelectionSets_1.has(fieldNameFromStoreName(storeFieldName));
                  };
                  var fieldsWithSelectionSets_1 = new Set();
                  workSet.forEach(function (selection) {
                      if (isField(selection) && selection.selectionSet) {
                          fieldsWithSelectionSets_1.add(selection.name.value);
                      }
                  });
                  var hasMergeFunction_1 = function (storeFieldName) {
                      var childTree = mergeTree.map.get(storeFieldName);
                      return Boolean(childTree && childTree.info && childTree.info.merge);
                  };
                  Object.keys(incomingFields).forEach(function (storeFieldName) {
                      if (hasSelectionSet_1(storeFieldName) &&
                          !hasMergeFunction_1(storeFieldName)) {
                          warnAboutDataLoss(entityRef_1, incomingFields, storeFieldName, context.store);
                      }
                  });
              }
              context.store.merge(dataId, incomingFields);
              return entityRef_1;
          }
          return incomingFields;
      };
      StoreWriter.prototype.processFieldValue = function (value, field, context, mergeTree) {
          var _this = this;
          if (!field.selectionSet || value === null) {
              return cloneDeep(value);
          }
          if (Array.isArray(value)) {
              return value.map(function (item, i) {
                  var value = _this.processFieldValue(item, field, context, getChildMergeTree(mergeTree, i));
                  maybeRecycleChildMergeTree(mergeTree, i);
                  return value;
              });
          }
          return this.processSelectionSet({
              result: value,
              selectionSet: field.selectionSet,
              context: context,
              mergeTree: mergeTree,
          });
      };
      StoreWriter.prototype.applyMerges = function (mergeTree, existing, incoming, context, getStorageArgs) {
          var _a;
          var _this = this;
          if (mergeTree.map.size && !isReference(incoming)) {
              var e_1 = (!Array.isArray(incoming) &&
                  (isReference(existing) || storeValueIsStoreObject(existing))) ? existing : void 0;
              var i_1 = incoming;
              if (e_1 && !getStorageArgs) {
                  getStorageArgs = [isReference(e_1) ? e_1.__ref : e_1];
              }
              var changedFields_1;
              var getValue_1 = function (from, name) {
                  return Array.isArray(from)
                      ? (typeof name === "number" ? from[name] : void 0)
                      : context.store.getFieldValue(from, String(name));
              };
              mergeTree.map.forEach(function (childTree, storeFieldName) {
                  if (getStorageArgs) {
                      getStorageArgs.push(storeFieldName);
                  }
                  var eVal = getValue_1(e_1, storeFieldName);
                  var iVal = getValue_1(i_1, storeFieldName);
                  var aVal = _this.applyMerges(childTree, eVal, iVal, context, getStorageArgs);
                  if (aVal !== iVal) {
                      changedFields_1 = changedFields_1 || new Map;
                      changedFields_1.set(storeFieldName, aVal);
                  }
                  if (getStorageArgs) {
                      invariant(getStorageArgs.pop() === storeFieldName);
                  }
              });
              if (changedFields_1) {
                  incoming = (Array.isArray(i_1) ? i_1.slice(0) : __assign$1({}, i_1));
                  changedFields_1.forEach(function (value, name) {
                      incoming[name] = value;
                  });
              }
          }
          if (mergeTree.info) {
              return this.cache.policies.runMergeFunction(existing, incoming, mergeTree.info, context, getStorageArgs && (_a = context.store).getStorage.apply(_a, getStorageArgs));
          }
          return incoming;
      };
      return StoreWriter;
  }());
  var emptyMergeTreePool = [];
  function getChildMergeTree(_a, name) {
      var map = _a.map;
      if (!map.has(name)) {
          map.set(name, emptyMergeTreePool.pop() || { map: new Map });
      }
      return map.get(name);
  }
  function maybeRecycleChildMergeTree(_a, name) {
      var map = _a.map;
      var childTree = map.get(name);
      if (childTree &&
          !childTree.info &&
          !childTree.map.size) {
          emptyMergeTreePool.push(childTree);
          map.delete(name);
      }
  }
  var warnings = new Set();
  function warnAboutDataLoss(existingRef, incomingObj, storeFieldName, store) {
      var getChild = function (objOrRef) {
          var child = store.getFieldValue(objOrRef, storeFieldName);
          return typeof child === "object" && child;
      };
      var existing = getChild(existingRef);
      if (!existing)
          return;
      var incoming = getChild(incomingObj);
      if (!incoming)
          return;
      if (isReference(existing))
          return;
      if (equal(existing, incoming))
          return;
      if (Object.keys(existing).every(function (key) { return store.getFieldValue(incoming, key) !== void 0; })) {
          return;
      }
      var parentType = store.getFieldValue(existingRef, "__typename") ||
          store.getFieldValue(incomingObj, "__typename");
      var fieldName = fieldNameFromStoreName(storeFieldName);
      var typeDotName = parentType + "." + fieldName;
      if (warnings.has(typeDotName))
          return;
      warnings.add(typeDotName);
      var childTypenames = [];
      if (!Array.isArray(existing) &&
          !Array.isArray(incoming)) {
          [existing, incoming].forEach(function (child) {
              var typename = store.getFieldValue(child, "__typename");
              if (typeof typename === "string" &&
                  !childTypenames.includes(typename)) {
                  childTypenames.push(typename);
              }
          });
      }
      invariant.warn("Cache data may be lost when replacing the " + fieldName + " field of a " + parentType + " object.\n\nTo address this problem (which is not a bug in Apollo Client), " + (childTypenames.length
          ? "either ensure all objects of type " +
              childTypenames.join(" and ") + " have an ID or a custom merge function, or "
          : "") + "define a custom merge function for the " + typeDotName + " field, so InMemoryCache can safely merge these objects:\n\n  existing: " + JSON.stringify(existing).slice(0, 1000) + "\n  incoming: " + JSON.stringify(incoming).slice(0, 1000) + "\n\nFor more information about these options, please refer to the documentation:\n\n  * Ensuring entity objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers\n  * Defining custom merge functions: https://go.apollo.dev/c/merging-non-normalized-objects\n");
  }

  var cacheSlot = new Slot();
  var cacheInfoMap = new WeakMap();
  function getCacheInfo(cache) {
      var info = cacheInfoMap.get(cache);
      if (!info) {
          cacheInfoMap.set(cache, info = {
              vars: new Set,
              dep: dep(),
          });
      }
      return info;
  }
  function forgetCache(cache) {
      getCacheInfo(cache).vars.forEach(function (rv) { return rv.forgetCache(cache); });
  }
  function recallCache(cache) {
      getCacheInfo(cache).vars.forEach(function (rv) { return rv.attachCache(cache); });
  }
  function makeVar(value) {
      var caches = new Set();
      var listeners = new Set();
      var rv = function (newValue) {
          if (arguments.length > 0) {
              if (value !== newValue) {
                  value = newValue;
                  caches.forEach(function (cache) {
                      getCacheInfo(cache).dep.dirty(rv);
                      broadcast(cache);
                  });
                  var oldListeners = Array.from(listeners);
                  listeners.clear();
                  oldListeners.forEach(function (listener) { return listener(value); });
              }
          }
          else {
              var cache = cacheSlot.getValue();
              if (cache) {
                  attach(cache);
                  getCacheInfo(cache).dep(rv);
              }
          }
          return value;
      };
      rv.onNextChange = function (listener) {
          listeners.add(listener);
          return function () {
              listeners.delete(listener);
          };
      };
      var attach = rv.attachCache = function (cache) {
          caches.add(cache);
          getCacheInfo(cache).vars.add(rv);
          return rv;
      };
      rv.forgetCache = function (cache) { return caches.delete(cache); };
      return rv;
  }
  function broadcast(cache) {
      if (cache.broadcastWatches) {
          cache.broadcastWatches();
      }
  }

  function argsFromFieldSpecifier(spec) {
      return spec.args !== void 0 ? spec.args :
          spec.field ? argumentsObjectFromField(spec.field, spec.variables) : null;
  }
  var defaultDataIdFromObject = function (_a, context) {
      var __typename = _a.__typename, id = _a.id, _id = _a._id;
      if (typeof __typename === "string") {
          if (context) {
              context.keyObject =
                  id !== void 0 ? { id: id } :
                      _id !== void 0 ? { _id: _id } :
                          void 0;
          }
          if (id === void 0)
              id = _id;
          if (id !== void 0) {
              return __typename + ":" + ((typeof id === "number" ||
                  typeof id === "string") ? id : JSON.stringify(id));
          }
      }
  };
  var nullKeyFieldsFn = function () { return void 0; };
  var simpleKeyArgsFn = function (_args, context) { return context.fieldName; };
  var mergeTrueFn = function (existing, incoming, _a) {
      var mergeObjects = _a.mergeObjects;
      return mergeObjects(existing, incoming);
  };
  var mergeFalseFn = function (_, incoming) { return incoming; };
  var Policies = (function () {
      function Policies(config) {
          this.config = config;
          this.typePolicies = Object.create(null);
          this.toBeAdded = Object.create(null);
          this.supertypeMap = new Map();
          this.fuzzySubtypes = new Map();
          this.rootIdsByTypename = Object.create(null);
          this.rootTypenamesById = Object.create(null);
          this.usingPossibleTypes = false;
          this.config = __assign$1({ dataIdFromObject: defaultDataIdFromObject }, config);
          this.cache = this.config.cache;
          this.setRootTypename("Query");
          this.setRootTypename("Mutation");
          this.setRootTypename("Subscription");
          if (config.possibleTypes) {
              this.addPossibleTypes(config.possibleTypes);
          }
          if (config.typePolicies) {
              this.addTypePolicies(config.typePolicies);
          }
      }
      Policies.prototype.identify = function (object, selectionSet, fragmentMap) {
          var typename = selectionSet && fragmentMap
              ? getTypenameFromResult(object, selectionSet, fragmentMap)
              : object.__typename;
          if (typename === this.rootTypenamesById.ROOT_QUERY) {
              return ["ROOT_QUERY"];
          }
          var context = {
              typename: typename,
              selectionSet: selectionSet,
              fragmentMap: fragmentMap,
          };
          var id;
          var policy = typename && this.getTypePolicy(typename);
          var keyFn = policy && policy.keyFn || this.config.dataIdFromObject;
          while (keyFn) {
              var specifierOrId = keyFn(object, context);
              if (Array.isArray(specifierOrId)) {
                  keyFn = keyFieldsFnFromSpecifier(specifierOrId);
              }
              else {
                  id = specifierOrId;
                  break;
              }
          }
          id = id ? String(id) : void 0;
          return context.keyObject ? [id, context.keyObject] : [id];
      };
      Policies.prototype.addTypePolicies = function (typePolicies) {
          var _this = this;
          Object.keys(typePolicies).forEach(function (typename) {
              var _a = typePolicies[typename], queryType = _a.queryType, mutationType = _a.mutationType, subscriptionType = _a.subscriptionType, incoming = __rest(_a, ["queryType", "mutationType", "subscriptionType"]);
              if (queryType)
                  _this.setRootTypename("Query", typename);
              if (mutationType)
                  _this.setRootTypename("Mutation", typename);
              if (subscriptionType)
                  _this.setRootTypename("Subscription", typename);
              if (hasOwn.call(_this.toBeAdded, typename)) {
                  _this.toBeAdded[typename].push(incoming);
              }
              else {
                  _this.toBeAdded[typename] = [incoming];
              }
          });
      };
      Policies.prototype.updateTypePolicy = function (typename, incoming) {
          var _this = this;
          var existing = this.getTypePolicy(typename);
          var keyFields = incoming.keyFields, fields = incoming.fields;
          function setMerge(existing, merge) {
              existing.merge =
                  typeof merge === "function" ? merge :
                      merge === true ? mergeTrueFn :
                          merge === false ? mergeFalseFn :
                              existing.merge;
          }
          setMerge(existing, incoming.merge);
          existing.keyFn =
              keyFields === false ? nullKeyFieldsFn :
                  Array.isArray(keyFields) ? keyFieldsFnFromSpecifier(keyFields) :
                      typeof keyFields === "function" ? keyFields :
                          existing.keyFn;
          if (fields) {
              Object.keys(fields).forEach(function (fieldName) {
                  var existing = _this.getFieldPolicy(typename, fieldName, true);
                  var incoming = fields[fieldName];
                  if (typeof incoming === "function") {
                      existing.read = incoming;
                  }
                  else {
                      var keyArgs = incoming.keyArgs, read = incoming.read, merge = incoming.merge;
                      existing.keyFn =
                          keyArgs === false ? simpleKeyArgsFn :
                              Array.isArray(keyArgs) ? keyArgsFnFromSpecifier(keyArgs) :
                                  typeof keyArgs === "function" ? keyArgs :
                                      existing.keyFn;
                      if (typeof read === "function") {
                          existing.read = read;
                      }
                      setMerge(existing, merge);
                  }
                  if (existing.read && existing.merge) {
                      existing.keyFn = existing.keyFn || simpleKeyArgsFn;
                  }
              });
          }
      };
      Policies.prototype.setRootTypename = function (which, typename) {
          if (typename === void 0) { typename = which; }
          var rootId = "ROOT_" + which.toUpperCase();
          var old = this.rootTypenamesById[rootId];
          if (typename !== old) {
              invariant(!old || old === which, "Cannot change root " + which + " __typename more than once");
              if (old)
                  delete this.rootIdsByTypename[old];
              this.rootIdsByTypename[typename] = rootId;
              this.rootTypenamesById[rootId] = typename;
          }
      };
      Policies.prototype.addPossibleTypes = function (possibleTypes) {
          var _this = this;
          this.usingPossibleTypes = true;
          Object.keys(possibleTypes).forEach(function (supertype) {
              _this.getSupertypeSet(supertype, true);
              possibleTypes[supertype].forEach(function (subtype) {
                  _this.getSupertypeSet(subtype, true).add(supertype);
                  var match = subtype.match(TypeOrFieldNameRegExp);
                  if (!match || match[0] !== subtype) {
                      _this.fuzzySubtypes.set(subtype, new RegExp(subtype));
                  }
              });
          });
      };
      Policies.prototype.getTypePolicy = function (typename) {
          var _this = this;
          if (!hasOwn.call(this.typePolicies, typename)) {
              var policy_1 = this.typePolicies[typename] = Object.create(null);
              policy_1.fields = Object.create(null);
              var supertypes = this.supertypeMap.get(typename);
              if (supertypes && supertypes.size) {
                  supertypes.forEach(function (supertype) {
                      var _a = _this.getTypePolicy(supertype), fields = _a.fields, rest = __rest(_a, ["fields"]);
                      Object.assign(policy_1, rest);
                      Object.assign(policy_1.fields, fields);
                  });
              }
          }
          var inbox = this.toBeAdded[typename];
          if (inbox && inbox.length) {
              this.updateTypePolicy(typename, compact.apply(void 0, inbox.splice(0)));
          }
          return this.typePolicies[typename];
      };
      Policies.prototype.getFieldPolicy = function (typename, fieldName, createIfMissing) {
          if (typename) {
              var fieldPolicies = this.getTypePolicy(typename).fields;
              return fieldPolicies[fieldName] || (createIfMissing && (fieldPolicies[fieldName] = Object.create(null)));
          }
      };
      Policies.prototype.getSupertypeSet = function (subtype, createIfMissing) {
          var supertypeSet = this.supertypeMap.get(subtype);
          if (!supertypeSet && createIfMissing) {
              this.supertypeMap.set(subtype, supertypeSet = new Set());
          }
          return supertypeSet;
      };
      Policies.prototype.fragmentMatches = function (fragment, typename, result, variables) {
          var _this = this;
          if (!fragment.typeCondition)
              return true;
          if (!typename)
              return false;
          var supertype = fragment.typeCondition.name.value;
          if (typename === supertype)
              return true;
          if (this.usingPossibleTypes &&
              this.supertypeMap.has(supertype)) {
              var typenameSupertypeSet = this.getSupertypeSet(typename, true);
              var workQueue_1 = [typenameSupertypeSet];
              var maybeEnqueue_1 = function (subtype) {
                  var supertypeSet = _this.getSupertypeSet(subtype, false);
                  if (supertypeSet &&
                      supertypeSet.size &&
                      workQueue_1.indexOf(supertypeSet) < 0) {
                      workQueue_1.push(supertypeSet);
                  }
              };
              var needToCheckFuzzySubtypes = !!(result && this.fuzzySubtypes.size);
              var checkingFuzzySubtypes = false;
              for (var i = 0; i < workQueue_1.length; ++i) {
                  var supertypeSet = workQueue_1[i];
                  if (supertypeSet.has(supertype)) {
                      if (!typenameSupertypeSet.has(supertype)) {
                          if (checkingFuzzySubtypes) {
                              invariant.warn("Inferring subtype " + typename + " of supertype " + supertype);
                          }
                          typenameSupertypeSet.add(supertype);
                      }
                      return true;
                  }
                  supertypeSet.forEach(maybeEnqueue_1);
                  if (needToCheckFuzzySubtypes &&
                      i === workQueue_1.length - 1 &&
                      selectionSetMatchesResult(fragment.selectionSet, result, variables)) {
                      needToCheckFuzzySubtypes = false;
                      checkingFuzzySubtypes = true;
                      this.fuzzySubtypes.forEach(function (regExp, fuzzyString) {
                          var match = typename.match(regExp);
                          if (match && match[0] === typename) {
                              maybeEnqueue_1(fuzzyString);
                          }
                      });
                  }
              }
          }
          return false;
      };
      Policies.prototype.hasKeyArgs = function (typename, fieldName) {
          var policy = this.getFieldPolicy(typename, fieldName, false);
          return !!(policy && policy.keyFn);
      };
      Policies.prototype.getStoreFieldName = function (fieldSpec) {
          var typename = fieldSpec.typename, fieldName = fieldSpec.fieldName;
          var policy = this.getFieldPolicy(typename, fieldName, false);
          var storeFieldName;
          var keyFn = policy && policy.keyFn;
          if (keyFn && typename) {
              var context = {
                  typename: typename,
                  fieldName: fieldName,
                  field: fieldSpec.field || null,
                  variables: fieldSpec.variables,
              };
              var args = argsFromFieldSpecifier(fieldSpec);
              while (keyFn) {
                  var specifierOrString = keyFn(args, context);
                  if (Array.isArray(specifierOrString)) {
                      keyFn = keyArgsFnFromSpecifier(specifierOrString);
                  }
                  else {
                      storeFieldName = specifierOrString || fieldName;
                      break;
                  }
              }
          }
          if (storeFieldName === void 0) {
              storeFieldName = fieldSpec.field
                  ? storeKeyNameFromField(fieldSpec.field, fieldSpec.variables)
                  : getStoreKeyName(fieldName, argsFromFieldSpecifier(fieldSpec));
          }
          if (storeFieldName === false) {
              return fieldName;
          }
          return fieldName === fieldNameFromStoreName(storeFieldName)
              ? storeFieldName
              : fieldName + ":" + storeFieldName;
      };
      Policies.prototype.readField = function (options, context) {
          var objectOrReference = options.from;
          if (!objectOrReference)
              return;
          var nameOrField = options.field || options.fieldName;
          if (!nameOrField)
              return;
          if (options.typename === void 0) {
              var typename = context.store.getFieldValue(objectOrReference, "__typename");
              if (typename)
                  options.typename = typename;
          }
          var storeFieldName = this.getStoreFieldName(options);
          var fieldName = fieldNameFromStoreName(storeFieldName);
          var existing = context.store.getFieldValue(objectOrReference, storeFieldName);
          var policy = this.getFieldPolicy(options.typename, fieldName, false);
          var read = policy && policy.read;
          if (read) {
              var readOptions = makeFieldFunctionOptions(this, objectOrReference, options, context, context.store.getStorage(isReference(objectOrReference)
                  ? objectOrReference.__ref
                  : objectOrReference, storeFieldName));
              return cacheSlot.withValue(this.cache, read, [existing, readOptions]);
          }
          return existing;
      };
      Policies.prototype.getMergeFunction = function (parentTypename, fieldName, childTypename) {
          var policy = this.getFieldPolicy(parentTypename, fieldName, false);
          var merge = policy && policy.merge;
          if (!merge && childTypename) {
              policy = this.getTypePolicy(childTypename);
              merge = policy && policy.merge;
          }
          return merge;
      };
      Policies.prototype.runMergeFunction = function (existing, incoming, _a, context, storage) {
          var field = _a.field, typename = _a.typename, merge = _a.merge;
          if (merge === mergeTrueFn) {
              return makeMergeObjectsFunction(context.store.getFieldValue)(existing, incoming);
          }
          if (merge === mergeFalseFn) {
              return incoming;
          }
          return merge(existing, incoming, makeFieldFunctionOptions(this, void 0, { typename: typename, fieldName: field.name.value, field: field, variables: context.variables }, context, storage || Object.create(null)));
      };
      return Policies;
  }());
  function makeFieldFunctionOptions(policies, objectOrReference, fieldSpec, context, storage) {
      var storeFieldName = policies.getStoreFieldName(fieldSpec);
      var fieldName = fieldNameFromStoreName(storeFieldName);
      var variables = fieldSpec.variables || context.variables;
      var _a = context.store, getFieldValue = _a.getFieldValue, toReference = _a.toReference, canRead = _a.canRead;
      return {
          args: argsFromFieldSpecifier(fieldSpec),
          field: fieldSpec.field || null,
          fieldName: fieldName,
          storeFieldName: storeFieldName,
          variables: variables,
          isReference: isReference,
          toReference: toReference,
          storage: storage,
          cache: policies.cache,
          canRead: canRead,
          readField: function (fieldNameOrOptions, from) {
              var options = typeof fieldNameOrOptions === "string" ? {
                  fieldName: fieldNameOrOptions,
                  from: from,
              } : __assign$1({}, fieldNameOrOptions);
              if (void 0 === options.from) {
                  options.from = objectOrReference;
              }
              if (void 0 === options.variables) {
                  options.variables = variables;
              }
              return policies.readField(options, context);
          },
          mergeObjects: makeMergeObjectsFunction(getFieldValue),
      };
  }
  function makeMergeObjectsFunction(getFieldValue) {
      return function mergeObjects(existing, incoming) {
          if (Array.isArray(existing) || Array.isArray(incoming)) {
              throw new InvariantError("Cannot automatically merge arrays");
          }
          if (existing && typeof existing === "object" &&
              incoming && typeof incoming === "object") {
              var eType = getFieldValue(existing, "__typename");
              var iType = getFieldValue(incoming, "__typename");
              var typesDiffer = eType && iType && eType !== iType;
              if (typesDiffer ||
                  !storeValueIsStoreObject(existing) ||
                  !storeValueIsStoreObject(incoming)) {
                  return incoming;
              }
              return __assign$1(__assign$1({}, existing), incoming);
          }
          return incoming;
      };
  }
  function keyArgsFnFromSpecifier(specifier) {
      return function (args, context) {
          return args ? context.fieldName + ":" + JSON.stringify(computeKeyObject(args, specifier, false)) : context.fieldName;
      };
  }
  function keyFieldsFnFromSpecifier(specifier) {
      var trie = new Trie(canUseWeakMap);
      return function (object, context) {
          var aliasMap;
          if (context.selectionSet && context.fragmentMap) {
              var info = trie.lookupArray([
                  context.selectionSet,
                  context.fragmentMap,
              ]);
              aliasMap = info.aliasMap || (info.aliasMap = makeAliasMap(context.selectionSet, context.fragmentMap));
          }
          var keyObject = context.keyObject =
              computeKeyObject(object, specifier, true, aliasMap);
          return context.typename + ":" + JSON.stringify(keyObject);
      };
  }
  function makeAliasMap(selectionSet, fragmentMap) {
      var map = Object.create(null);
      var workQueue = new Set([selectionSet]);
      workQueue.forEach(function (selectionSet) {
          selectionSet.selections.forEach(function (selection) {
              if (isField(selection)) {
                  if (selection.alias) {
                      var responseKey = selection.alias.value;
                      var storeKey = selection.name.value;
                      if (storeKey !== responseKey) {
                          var aliases = map.aliases || (map.aliases = Object.create(null));
                          aliases[storeKey] = responseKey;
                      }
                  }
                  if (selection.selectionSet) {
                      var subsets = map.subsets || (map.subsets = Object.create(null));
                      subsets[selection.name.value] =
                          makeAliasMap(selection.selectionSet, fragmentMap);
                  }
              }
              else {
                  var fragment = getFragmentFromSelection(selection, fragmentMap);
                  if (fragment) {
                      workQueue.add(fragment.selectionSet);
                  }
              }
          });
      });
      return map;
  }
  function computeKeyObject(response, specifier, strict, aliasMap) {
      var keyObj = Object.create(null);
      var prevKey;
      specifier.forEach(function (s) {
          if (Array.isArray(s)) {
              if (typeof prevKey === "string") {
                  var subsets = aliasMap && aliasMap.subsets;
                  var subset = subsets && subsets[prevKey];
                  keyObj[prevKey] = computeKeyObject(response[prevKey], s, strict, subset);
              }
          }
          else {
              var aliases = aliasMap && aliasMap.aliases;
              var responseName = aliases && aliases[s] || s;
              if (hasOwn.call(response, responseName)) {
                  keyObj[prevKey = s] = response[responseName];
              }
              else {
                  invariant(!strict, "Missing field '" + responseName + "' while computing key fields");
                  prevKey = void 0;
              }
          }
      });
      return keyObj;
  }

  var defaultConfig = {
      dataIdFromObject: defaultDataIdFromObject,
      addTypename: true,
      resultCaching: true,
      typePolicies: {},
  };
  ((function (_super) {
      __extends$1(InMemoryCache, _super);
      function InMemoryCache(config) {
          if (config === void 0) { config = {}; }
          var _this = _super.call(this) || this;
          _this.watches = new Set();
          _this.typenameDocumentCache = new Map();
          _this.makeVar = makeVar;
          _this.txCount = 0;
          _this.maybeBroadcastWatch = wrap(function (c, fromOptimisticTransaction) {
              return _this.broadcastWatch.call(_this, c, !!fromOptimisticTransaction);
          }, {
              makeCacheKey: function (c) {
                  var store = c.optimistic ? _this.optimisticData : _this.data;
                  if (supportsResultCaching(store)) {
                      var optimistic = c.optimistic, rootId = c.rootId, variables = c.variables;
                      return store.makeCacheKey(c.query, c.callback, JSON.stringify({ optimistic: optimistic, rootId: rootId, variables: variables }));
                  }
              }
          });
          _this.watchDep = dep();
          _this.config = __assign$1(__assign$1({}, defaultConfig), config);
          _this.addTypename = !!_this.config.addTypename;
          _this.policies = new Policies({
              cache: _this,
              dataIdFromObject: _this.config.dataIdFromObject,
              possibleTypes: _this.config.possibleTypes,
              typePolicies: _this.config.typePolicies,
          });
          _this.data = new EntityStore.Root({
              policies: _this.policies,
              resultCaching: _this.config.resultCaching,
          });
          _this.optimisticData = _this.data;
          _this.storeWriter = new StoreWriter(_this, _this.storeReader = new StoreReader({
              cache: _this,
              addTypename: _this.addTypename,
          }));
          return _this;
      }
      InMemoryCache.prototype.restore = function (data) {
          if (data)
              this.data.replace(data);
          return this;
      };
      InMemoryCache.prototype.extract = function (optimistic) {
          if (optimistic === void 0) { optimistic = false; }
          return (optimistic ? this.optimisticData : this.data).extract();
      };
      InMemoryCache.prototype.read = function (options) {
          var _a = options.returnPartialData, returnPartialData = _a === void 0 ? false : _a;
          try {
              return this.storeReader.diffQueryAgainstStore({
                  store: options.optimistic ? this.optimisticData : this.data,
                  query: options.query,
                  variables: options.variables,
                  rootId: options.rootId,
                  config: this.config,
                  returnPartialData: returnPartialData,
              }).result || null;
          }
          catch (e) {
              if (e instanceof MissingFieldError) {
                  return null;
              }
              throw e;
          }
      };
      InMemoryCache.prototype.write = function (options) {
          try {
              ++this.txCount;
              return this.storeWriter.writeToStore({
                  store: this.data,
                  query: options.query,
                  result: options.result,
                  dataId: options.dataId,
                  variables: options.variables,
              });
          }
          finally {
              if (!--this.txCount && options.broadcast !== false) {
                  this.broadcastWatches();
              }
          }
      };
      InMemoryCache.prototype.modify = function (options) {
          if (hasOwn.call(options, "id") && !options.id) {
              return false;
          }
          var store = options.optimistic
              ? this.optimisticData
              : this.data;
          try {
              ++this.txCount;
              return store.modify(options.id || "ROOT_QUERY", options.fields);
          }
          finally {
              if (!--this.txCount && options.broadcast !== false) {
                  this.broadcastWatches();
              }
          }
      };
      InMemoryCache.prototype.diff = function (options) {
          return this.storeReader.diffQueryAgainstStore({
              store: options.optimistic ? this.optimisticData : this.data,
              rootId: options.id || "ROOT_QUERY",
              query: options.query,
              variables: options.variables,
              returnPartialData: options.returnPartialData,
              config: this.config,
          });
      };
      InMemoryCache.prototype.watch = function (watch) {
          var _this = this;
          if (!this.watches.size) {
              recallCache(this);
          }
          this.watches.add(watch);
          if (watch.immediate) {
              this.maybeBroadcastWatch(watch);
          }
          return function () {
              if (_this.watches.delete(watch) && !_this.watches.size) {
                  forgetCache(_this);
              }
              _this.watchDep.dirty(watch);
              _this.maybeBroadcastWatch.forget(watch);
          };
      };
      InMemoryCache.prototype.gc = function () {
          return this.optimisticData.gc();
      };
      InMemoryCache.prototype.retain = function (rootId, optimistic) {
          return (optimistic ? this.optimisticData : this.data).retain(rootId);
      };
      InMemoryCache.prototype.release = function (rootId, optimistic) {
          return (optimistic ? this.optimisticData : this.data).release(rootId);
      };
      InMemoryCache.prototype.identify = function (object) {
          return isReference(object) ? object.__ref :
              this.policies.identify(object)[0];
      };
      InMemoryCache.prototype.evict = function (options) {
          if (!options.id) {
              if (hasOwn.call(options, "id")) {
                  return false;
              }
              options = __assign$1(__assign$1({}, options), { id: "ROOT_QUERY" });
          }
          try {
              ++this.txCount;
              return this.optimisticData.evict(options);
          }
          finally {
              if (!--this.txCount && options.broadcast !== false) {
                  this.broadcastWatches();
              }
          }
      };
      InMemoryCache.prototype.reset = function () {
          this.data.clear();
          this.optimisticData = this.data;
          this.broadcastWatches();
          return Promise.resolve();
      };
      InMemoryCache.prototype.removeOptimistic = function (idToRemove) {
          var newOptimisticData = this.optimisticData.removeLayer(idToRemove);
          if (newOptimisticData !== this.optimisticData) {
              this.optimisticData = newOptimisticData;
              this.broadcastWatches();
          }
      };
      InMemoryCache.prototype.performTransaction = function (transaction, optimisticId) {
          var _this = this;
          var perform = function (layer) {
              var _a = _this, data = _a.data, optimisticData = _a.optimisticData;
              ++_this.txCount;
              if (layer) {
                  _this.data = _this.optimisticData = layer;
              }
              try {
                  transaction(_this);
              }
              finally {
                  --_this.txCount;
                  _this.data = data;
                  _this.optimisticData = optimisticData;
              }
          };
          var fromOptimisticTransaction = false;
          if (typeof optimisticId === 'string') {
              this.optimisticData = this.optimisticData.addLayer(optimisticId, perform);
              fromOptimisticTransaction = true;
          }
          else if (optimisticId === null) {
              perform(this.data);
          }
          else {
              perform();
          }
          this.broadcastWatches(fromOptimisticTransaction);
      };
      InMemoryCache.prototype.transformDocument = function (document) {
          if (this.addTypename) {
              var result = this.typenameDocumentCache.get(document);
              if (!result) {
                  result = addTypenameToDocument(document);
                  this.typenameDocumentCache.set(document, result);
                  this.typenameDocumentCache.set(result, result);
              }
              return result;
          }
          return document;
      };
      InMemoryCache.prototype.broadcastWatches = function (fromOptimisticTransaction) {
          var _this = this;
          if (!this.txCount) {
              this.watches.forEach(function (c) { return _this.maybeBroadcastWatch(c, fromOptimisticTransaction); });
          }
      };
      InMemoryCache.prototype.broadcastWatch = function (c, fromOptimisticTransaction) {
          this.watchDep.dirty(c);
          this.watchDep(c);
          var diff = this.diff({
              query: c.query,
              variables: c.variables,
              optimistic: c.optimistic,
          });
          if (c.optimistic && fromOptimisticTransaction) {
              diff.fromOptimisticTransaction = true;
          }
          c.callback(diff);
      };
      return InMemoryCache;
  })(ApolloCache));

  function mergeOptions(defaults, options) {
      return compact(defaults, options, options.variables && {
          variables: __assign$1(__assign$1({}, defaults.variables), options.variables),
      });
  }

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

  var docCache = new Map();
  var fragmentSourceMap = new Map();
  var printFragmentWarnings = true;
  var experimentalFragmentVariables = false;
  function normalize(string) {
      return string.replace(/[\s,]+/g, ' ').trim();
  }
  function cacheKeyFromLoc(loc) {
      return normalize(loc.source.body.substring(loc.start, loc.end));
  }
  function processFragments(ast) {
      var seenKeys = new Set();
      var definitions = [];
      ast.definitions.forEach(function (fragmentDefinition) {
          if (fragmentDefinition.kind === 'FragmentDefinition') {
              var fragmentName = fragmentDefinition.name.value;
              var sourceKey = cacheKeyFromLoc(fragmentDefinition.loc);
              var sourceKeySet = fragmentSourceMap.get(fragmentName);
              if (sourceKeySet && !sourceKeySet.has(sourceKey)) {
                  if (printFragmentWarnings) {
                      console.warn("Warning: fragment with name " + fragmentName + " already exists.\n"
                          + "graphql-tag enforces all fragment names across your application to be unique; read more about\n"
                          + "this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names");
                  }
              }
              else if (!sourceKeySet) {
                  fragmentSourceMap.set(fragmentName, sourceKeySet = new Set);
              }
              sourceKeySet.add(sourceKey);
              if (!seenKeys.has(sourceKey)) {
                  seenKeys.add(sourceKey);
                  definitions.push(fragmentDefinition);
              }
          }
          else {
              definitions.push(fragmentDefinition);
          }
      });
      return __assign(__assign({}, ast), { definitions: definitions });
  }
  function stripLoc(doc) {
      var workSet = new Set(doc.definitions);
      workSet.forEach(function (node) {
          if (node.loc)
              delete node.loc;
          Object.keys(node).forEach(function (key) {
              var value = node[key];
              if (value && typeof value === 'object') {
                  workSet.add(value);
              }
          });
      });
      var loc = doc.loc;
      if (loc) {
          delete loc.startToken;
          delete loc.endToken;
      }
      return doc;
  }
  function parseDocument(source) {
      var cacheKey = normalize(source);
      if (!docCache.has(cacheKey)) {
          var parsed = graphql.parse(source, {
              experimentalFragmentVariables: experimentalFragmentVariables
          });
          if (!parsed || parsed.kind !== 'Document') {
              throw new Error('Not a valid GraphQL document.');
          }
          docCache.set(cacheKey, stripLoc(processFragments(parsed)));
      }
      return docCache.get(cacheKey);
  }
  function gql(literals) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
      }
      if (typeof literals === 'string') {
          literals = [literals];
      }
      var result = literals[0];
      args.forEach(function (arg, i) {
          if (arg && arg.kind === 'Document') {
              result += arg.loc.source.body;
          }
          else {
              result += arg;
          }
          result += literals[i + 1];
      });
      return parseDocument(result);
  }
  function resetCaches() {
      docCache.clear();
      fragmentSourceMap.clear();
  }
  function disableFragmentWarnings() {
      printFragmentWarnings = false;
  }
  function enableExperimentalFragmentVariables() {
      experimentalFragmentVariables = true;
  }
  function disableExperimentalFragmentVariables() {
      experimentalFragmentVariables = false;
  }
  var extras = {
      gql: gql,
      resetCaches: resetCaches,
      disableFragmentWarnings: disableFragmentWarnings,
      enableExperimentalFragmentVariables: enableExperimentalFragmentVariables,
      disableExperimentalFragmentVariables: disableExperimentalFragmentVariables
  };
  (function (gql_1) {
      gql_1.gql = extras.gql, gql_1.resetCaches = extras.resetCaches, gql_1.disableFragmentWarnings = extras.disableFragmentWarnings, gql_1.enableExperimentalFragmentVariables = extras.enableExperimentalFragmentVariables, gql_1.disableExperimentalFragmentVariables = extras.disableExperimentalFragmentVariables;
  })(gql || (gql = {}));
  gql["default"] = gql;
  var gql$1 = gql;

  setVerbosity("log");

  var cache$1 = new (canUseWeakMap ? WeakMap : Map)();
  function getApolloContext() {
      var context = cache$1.get(react.createContext);
      if (!context) {
          context = react.createContext({});
          context.displayName = 'ApolloContext';
          cache$1.set(react.createContext, context);
      }
      return context;
  }

  var DocumentType$1;
  (function (DocumentType) {
      DocumentType[DocumentType["Query"] = 0] = "Query";
      DocumentType[DocumentType["Mutation"] = 1] = "Mutation";
      DocumentType[DocumentType["Subscription"] = 2] = "Subscription";
  })(DocumentType$1 || (DocumentType$1 = {}));
  var cache = new Map();
  function operationName(type) {
      var name;
      switch (type) {
          case DocumentType$1.Query:
              name = 'Query';
              break;
          case DocumentType$1.Mutation:
              name = 'Mutation';
              break;
          case DocumentType$1.Subscription:
              name = 'Subscription';
              break;
      }
      return name;
  }
  function parser(document) {
      var cached = cache.get(document);
      if (cached)
          return cached;
      var variables, type, name;
      invariant(!!document && !!document.kind, "Argument of " + document + " passed to parser was not a valid GraphQL " +
          "DocumentNode. You may need to use 'graphql-tag' or another method " +
          "to convert your operation into a document");
      var fragments = document.definitions.filter(function (x) { return x.kind === 'FragmentDefinition'; });
      var queries = document.definitions.filter(function (x) {
          return x.kind === 'OperationDefinition' && x.operation === 'query';
      });
      var mutations = document.definitions.filter(function (x) {
          return x.kind === 'OperationDefinition' && x.operation === 'mutation';
      });
      var subscriptions = document.definitions.filter(function (x) {
          return x.kind === 'OperationDefinition' && x.operation === 'subscription';
      });
      invariant(!fragments.length ||
          (queries.length || mutations.length || subscriptions.length), "Passing only a fragment to 'graphql' is not yet supported. " +
          "You must include a query, subscription or mutation as well");
      invariant(queries.length + mutations.length + subscriptions.length <= 1, "react-apollo only supports a query, subscription, or a mutation per HOC. " +
          (document + " had " + queries.length + " queries, " + subscriptions.length + " ") +
          ("subscriptions and " + mutations.length + " mutations. ") +
          "You can use 'compose' to join multiple operation types to a component");
      type = queries.length ? DocumentType$1.Query : DocumentType$1.Mutation;
      if (!queries.length && !mutations.length)
          type = DocumentType$1.Subscription;
      var definitions = queries.length
          ? queries
          : mutations.length
              ? mutations
              : subscriptions;
      invariant(definitions.length === 1, "react-apollo only supports one definition per HOC. " + document + " had " +
          (definitions.length + " definitions. ") +
          "You can use 'compose' to join multiple operation types to a component");
      var definition = definitions[0];
      variables = definition.variableDefinitions || [];
      if (definition.name && definition.name.kind === 'Name') {
          name = definition.name.value;
      }
      else {
          name = 'data';
      }
      var payload = { name: name, type: type, variables: variables };
      cache.set(document, payload);
      return payload;
  }

  var OperationData = (function () {
      function OperationData(options, context) {
          this.isMounted = false;
          this.previousOptions = {};
          this.context = {};
          this.options = {};
          this.options = options || {};
          this.context = context || {};
      }
      OperationData.prototype.getOptions = function () {
          return this.options;
      };
      OperationData.prototype.setOptions = function (newOptions, storePrevious) {
          if (storePrevious === void 0) { storePrevious = false; }
          if (storePrevious && !equal(this.options, newOptions)) {
              this.previousOptions = this.options;
          }
          this.options = newOptions;
      };
      OperationData.prototype.unmount = function () {
          this.isMounted = false;
      };
      OperationData.prototype.refreshClient = function () {
          var client = (this.options && this.options.client) ||
              (this.context && this.context.client);
          invariant(!!client, 'Could not find "client" in the context or passed in as an option. ' +
              'Wrap the root component in an <ApolloProvider>, or pass an ' +
              'ApolloClient instance in via options.');
          var isNew = false;
          if (client !== this.client) {
              isNew = true;
              this.client = client;
              this.cleanup();
          }
          return {
              client: this.client,
              isNew: isNew
          };
      };
      OperationData.prototype.verifyDocumentType = function (document, type) {
          var operation = parser(document);
          var requiredOperationName = operationName(type);
          var usedOperationName = operationName(operation.type);
          invariant(operation.type === type, "Running a " + requiredOperationName + " requires a graphql " +
              (requiredOperationName + ", but a " + usedOperationName + " was used instead."));
      };
      return OperationData;
  }());

  ((function (_super) {
      __extends$1(SubscriptionData, _super);
      function SubscriptionData(_a) {
          var options = _a.options, context = _a.context, setResult = _a.setResult;
          var _this = _super.call(this, options, context) || this;
          _this.currentObservable = {};
          _this.setResult = setResult;
          _this.initialize(options);
          return _this;
      }
      SubscriptionData.prototype.execute = function (result) {
          if (this.getOptions().skip === true) {
              this.cleanup();
              return {
                  loading: false,
                  error: undefined,
                  data: undefined,
                  variables: this.getOptions().variables
              };
          }
          var currentResult = result;
          if (this.refreshClient().isNew) {
              currentResult = this.getLoadingResult();
          }
          var shouldResubscribe = this.getOptions().shouldResubscribe;
          if (typeof shouldResubscribe === 'function') {
              shouldResubscribe = !!shouldResubscribe(this.getOptions());
          }
          if (shouldResubscribe !== false &&
              this.previousOptions &&
              Object.keys(this.previousOptions).length > 0 &&
              (this.previousOptions.subscription !== this.getOptions().subscription ||
                  !equal(this.previousOptions.variables, this.getOptions().variables) ||
                  this.previousOptions.skip !== this.getOptions().skip)) {
              this.cleanup();
              currentResult = this.getLoadingResult();
          }
          this.initialize(this.getOptions());
          this.startSubscription();
          this.previousOptions = this.getOptions();
          return __assign$1(__assign$1({}, currentResult), { variables: this.getOptions().variables });
      };
      SubscriptionData.prototype.afterExecute = function () {
          this.isMounted = true;
      };
      SubscriptionData.prototype.cleanup = function () {
          this.endSubscription();
          delete this.currentObservable.query;
      };
      SubscriptionData.prototype.initialize = function (options) {
          if (this.currentObservable.query || this.getOptions().skip === true)
              return;
          this.currentObservable.query = this.refreshClient().client.subscribe({
              query: options.subscription,
              variables: options.variables,
              fetchPolicy: options.fetchPolicy,
              context: options.context,
          });
      };
      SubscriptionData.prototype.startSubscription = function () {
          if (this.currentObservable.subscription)
              return;
          this.currentObservable.subscription = this.currentObservable.query.subscribe({
              next: this.updateCurrentData.bind(this),
              error: this.updateError.bind(this),
              complete: this.completeSubscription.bind(this)
          });
      };
      SubscriptionData.prototype.getLoadingResult = function () {
          return {
              loading: true,
              error: undefined,
              data: undefined
          };
      };
      SubscriptionData.prototype.updateResult = function (result) {
          if (this.isMounted) {
              this.setResult(result);
          }
      };
      SubscriptionData.prototype.updateCurrentData = function (result) {
          var onSubscriptionData = this.getOptions().onSubscriptionData;
          this.updateResult({
              data: result.data,
              loading: false,
              error: undefined
          });
          if (onSubscriptionData) {
              onSubscriptionData({
                  client: this.refreshClient().client,
                  subscriptionData: result
              });
          }
      };
      SubscriptionData.prototype.updateError = function (error) {
          this.updateResult({
              error: error,
              loading: false
          });
      };
      SubscriptionData.prototype.completeSubscription = function () {
          var _this = this;
          Promise.resolve().then(function () {
              var onSubscriptionComplete = _this.getOptions().onSubscriptionComplete;
              if (onSubscriptionComplete)
                  onSubscriptionComplete();
              _this.endSubscription();
          });
      };
      SubscriptionData.prototype.endSubscription = function () {
          if (this.currentObservable.subscription) {
              this.currentObservable.subscription.unsubscribe();
              delete this.currentObservable.subscription;
          }
      };
      return SubscriptionData;
  })(OperationData));

  var MutationData = (function (_super) {
      __extends$1(MutationData, _super);
      function MutationData(_a) {
          var options = _a.options, context = _a.context, result = _a.result, setResult = _a.setResult;
          var _this = _super.call(this, options, context) || this;
          _this.runMutation = function (mutationFunctionOptions) {
              if (mutationFunctionOptions === void 0) { mutationFunctionOptions = {}; }
              _this.onMutationStart();
              var mutationId = _this.generateNewMutationId();
              return _this.mutate(mutationFunctionOptions)
                  .then(function (response) {
                  _this.onMutationCompleted(response, mutationId);
                  return response;
              })
                  .catch(function (error) {
                  var onError = _this.getOptions().onError;
                  _this.onMutationError(error, mutationId);
                  if (onError) {
                      onError(error);
                      return {
                          data: undefined,
                          errors: error,
                      };
                  }
                  else {
                      throw error;
                  }
              });
          };
          _this.verifyDocumentType(options.mutation, DocumentType$1.Mutation);
          _this.result = result;
          _this.setResult = setResult;
          _this.mostRecentMutationId = 0;
          return _this;
      }
      MutationData.prototype.execute = function (result) {
          this.isMounted = true;
          this.verifyDocumentType(this.getOptions().mutation, DocumentType$1.Mutation);
          return [
              this.runMutation,
              __assign$1(__assign$1({}, result), { client: this.refreshClient().client })
          ];
      };
      MutationData.prototype.afterExecute = function () {
          this.isMounted = true;
          return this.unmount.bind(this);
      };
      MutationData.prototype.cleanup = function () {
      };
      MutationData.prototype.mutate = function (options) {
          return this.refreshClient().client.mutate(mergeOptions(this.getOptions(), options));
      };
      MutationData.prototype.onMutationStart = function () {
          if (!this.result.loading && !this.getOptions().ignoreResults) {
              this.updateResult({
                  loading: true,
                  error: undefined,
                  data: undefined,
                  called: true
              });
          }
      };
      MutationData.prototype.onMutationCompleted = function (response, mutationId) {
          var _a = this.getOptions(), onCompleted = _a.onCompleted, ignoreResults = _a.ignoreResults;
          var data = response.data, errors = response.errors;
          var error = errors && errors.length > 0
              ? new ApolloError({ graphQLErrors: errors })
              : undefined;
          var callOncomplete = function () {
              return onCompleted ? onCompleted(data) : null;
          };
          if (this.isMostRecentMutation(mutationId) && !ignoreResults) {
              this.updateResult({
                  called: true,
                  loading: false,
                  data: data,
                  error: error
              });
          }
          callOncomplete();
      };
      MutationData.prototype.onMutationError = function (error, mutationId) {
          if (this.isMostRecentMutation(mutationId)) {
              this.updateResult({
                  loading: false,
                  error: error,
                  data: undefined,
                  called: true
              });
          }
      };
      MutationData.prototype.generateNewMutationId = function () {
          return ++this.mostRecentMutationId;
      };
      MutationData.prototype.isMostRecentMutation = function (mutationId) {
          return this.mostRecentMutationId === mutationId;
      };
      MutationData.prototype.updateResult = function (result) {
          if (this.isMounted &&
              (!this.previousResult || !equal(this.previousResult, result))) {
              this.setResult(result);
              this.previousResult = result;
              return result;
          }
      };
      return MutationData;
  }(OperationData));

  ((function (_super) {
      __extends$1(QueryData, _super);
      function QueryData(_a) {
          var options = _a.options, context = _a.context, onNewData = _a.onNewData;
          var _this = _super.call(this, options, context) || this;
          _this.runLazy = false;
          _this.previous = Object.create(null);
          _this.runLazyQuery = function (options) {
              _this.cleanup();
              _this.runLazy = true;
              _this.lazyOptions = options;
              _this.onNewData();
          };
          _this.getQueryResult = function () {
              var result = _this.observableQueryFields();
              var options = _this.getOptions();
              if (options.skip) {
                  result = __assign$1(__assign$1({}, result), { data: undefined, error: undefined, loading: false, networkStatus: NetworkStatus.ready, called: true });
              }
              else if (_this.currentObservable) {
                  var currentResult = _this.currentObservable.getCurrentResult();
                  var data = currentResult.data, loading = currentResult.loading, partial = currentResult.partial, networkStatus = currentResult.networkStatus, errors = currentResult.errors;
                  var error = currentResult.error;
                  if (errors && errors.length > 0) {
                      error = new ApolloError({ graphQLErrors: errors });
                  }
                  result = __assign$1(__assign$1({}, result), { data: data,
                      loading: loading,
                      networkStatus: networkStatus,
                      error: error, called: true });
                  if (loading) ;
                  else if (error) {
                      Object.assign(result, {
                          data: (_this.currentObservable.getLastResult() || {})
                              .data
                      });
                  }
                  else {
                      var fetchPolicy = _this.currentObservable.options.fetchPolicy;
                      var partialRefetch = options.partialRefetch;
                      if (partialRefetch &&
                          partial &&
                          (!data || Object.keys(data).length === 0) &&
                          fetchPolicy !== 'cache-only') {
                          Object.assign(result, {
                              loading: true,
                              networkStatus: NetworkStatus.loading
                          });
                          result.refetch();
                          return result;
                      }
                  }
              }
              result.client = _this.client;
              _this.setOptions(options, true);
              var previousResult = _this.previous.result;
              _this.previous.loading =
                  previousResult && previousResult.loading || false;
              result.previousData = previousResult &&
                  (previousResult.data || previousResult.previousData);
              _this.previous.result = result;
              _this.currentObservable && _this.currentObservable.resetQueryStoreErrors();
              return result;
          };
          _this.obsRefetch = function (variables) { var _a; return (_a = _this.currentObservable) === null || _a === void 0 ? void 0 : _a.refetch(variables); };
          _this.obsFetchMore = function (fetchMoreOptions) { return _this.currentObservable.fetchMore(fetchMoreOptions); };
          _this.obsUpdateQuery = function (mapFn) { return _this.currentObservable.updateQuery(mapFn); };
          _this.obsStartPolling = function (pollInterval) {
              var _a;
              (_a = _this.currentObservable) === null || _a === void 0 ? void 0 : _a.startPolling(pollInterval);
          };
          _this.obsStopPolling = function () {
              var _a;
              (_a = _this.currentObservable) === null || _a === void 0 ? void 0 : _a.stopPolling();
          };
          _this.obsSubscribeToMore = function (options) { return _this.currentObservable.subscribeToMore(options); };
          _this.onNewData = onNewData;
          return _this;
      }
      QueryData.prototype.execute = function () {
          this.refreshClient();
          var _a = this.getOptions(), skip = _a.skip, query = _a.query;
          if (skip || query !== this.previous.query) {
              this.removeQuerySubscription();
              this.removeObservable(!skip);
              this.previous.query = query;
          }
          this.updateObservableQuery();
          if (this.isMounted)
              this.startQuerySubscription();
          return this.getExecuteSsrResult() || this.getExecuteResult();
      };
      QueryData.prototype.executeLazy = function () {
          return !this.runLazy
              ? [
                  this.runLazyQuery,
                  {
                      loading: false,
                      networkStatus: NetworkStatus.ready,
                      called: false,
                      data: undefined
                  }
              ]
              : [this.runLazyQuery, this.execute()];
      };
      QueryData.prototype.fetchData = function () {
          var _this = this;
          var options = this.getOptions();
          if (options.skip || options.ssr === false)
              return false;
          return new Promise(function (resolve) { return _this.startQuerySubscription(resolve); });
      };
      QueryData.prototype.afterExecute = function (_a) {
          var _b = (_a === void 0 ? {} : _a).lazy, lazy = _b === void 0 ? false : _b;
          this.isMounted = true;
          if (!lazy || this.runLazy) {
              this.handleErrorOrCompleted();
          }
          this.previousOptions = this.getOptions();
          return this.unmount.bind(this);
      };
      QueryData.prototype.cleanup = function () {
          this.removeQuerySubscription();
          this.removeObservable(true);
          delete this.previous.result;
      };
      QueryData.prototype.getOptions = function () {
          var options = _super.prototype.getOptions.call(this);
          if (this.lazyOptions) {
              options.variables = __assign$1(__assign$1({}, options.variables), this.lazyOptions.variables);
              options.context = __assign$1(__assign$1({}, options.context), this.lazyOptions.context);
          }
          if (this.runLazy) {
              delete options.skip;
          }
          return options;
      };
      QueryData.prototype.ssrInitiated = function () {
          return this.context && this.context.renderPromises;
      };
      QueryData.prototype.getExecuteResult = function () {
          var result = this.getQueryResult();
          this.startQuerySubscription();
          return result;
      };
      QueryData.prototype.getExecuteSsrResult = function () {
          var _a = this.getOptions(), ssr = _a.ssr, skip = _a.skip;
          var ssrDisabled = ssr === false;
          var fetchDisabled = this.refreshClient().client.disableNetworkFetches;
          var ssrLoading = __assign$1({ loading: true, networkStatus: NetworkStatus.loading, called: true, data: undefined, stale: false, client: this.client }, this.observableQueryFields());
          if (ssrDisabled && (this.ssrInitiated() || fetchDisabled)) {
              this.previous.result = ssrLoading;
              return ssrLoading;
          }
          if (this.ssrInitiated()) {
              var result = this.getQueryResult() || ssrLoading;
              if (result.loading && !skip) {
                  this.context.renderPromises.addQueryPromise(this, function () { return null; });
              }
              return result;
          }
      };
      QueryData.prototype.prepareObservableQueryOptions = function () {
          var options = this.getOptions();
          this.verifyDocumentType(options.query, DocumentType$1.Query);
          var displayName = options.displayName || 'Query';
          if (this.ssrInitiated() &&
              (options.fetchPolicy === 'network-only' ||
                  options.fetchPolicy === 'cache-and-network')) {
              options.fetchPolicy = 'cache-first';
          }
          return __assign$1(__assign$1({}, options), { displayName: displayName, context: options.context });
      };
      QueryData.prototype.initializeObservableQuery = function () {
          if (this.ssrInitiated()) {
              this.currentObservable = this.context.renderPromises.getSSRObservable(this.getOptions());
          }
          if (!this.currentObservable) {
              var observableQueryOptions = this.prepareObservableQueryOptions();
              this.previous.observableQueryOptions = __assign$1(__assign$1({}, observableQueryOptions), { children: null });
              this.currentObservable = this.refreshClient().client.watchQuery(__assign$1({}, observableQueryOptions));
              if (this.ssrInitiated()) {
                  this.context.renderPromises.registerSSRObservable(this.currentObservable, observableQueryOptions);
              }
          }
      };
      QueryData.prototype.updateObservableQuery = function () {
          if (!this.currentObservable) {
              this.initializeObservableQuery();
              return;
          }
          if (this.getOptions().skip)
              return;
          var newObservableQueryOptions = __assign$1(__assign$1({}, this.prepareObservableQueryOptions()), { children: null });
          if (!equal(newObservableQueryOptions, this.previous.observableQueryOptions)) {
              this.previous.observableQueryOptions = newObservableQueryOptions;
              this.currentObservable
                  .setOptions(newObservableQueryOptions)
                  .catch(function () { });
          }
      };
      QueryData.prototype.startQuerySubscription = function (onNewData) {
          var _this = this;
          if (onNewData === void 0) { onNewData = this.onNewData; }
          if (this.currentSubscription || this.getOptions().skip)
              return;
          this.currentSubscription = this.currentObservable.subscribe({
              next: function (_a) {
                  var loading = _a.loading, networkStatus = _a.networkStatus, data = _a.data;
                  var previousResult = _this.previous.result;
                  if (previousResult &&
                      previousResult.loading === loading &&
                      previousResult.networkStatus === networkStatus &&
                      equal(previousResult.data, data)) {
                      return;
                  }
                  onNewData();
              },
              error: function (error) {
                  _this.resubscribeToQuery();
                  if (!error.hasOwnProperty('graphQLErrors'))
                      throw error;
                  var previousResult = _this.previous.result;
                  if ((previousResult && previousResult.loading) ||
                      !equal(error, _this.previous.error)) {
                      _this.previous.error = error;
                      onNewData();
                  }
              }
          });
      };
      QueryData.prototype.resubscribeToQuery = function () {
          this.removeQuerySubscription();
          var currentObservable = this.currentObservable;
          if (currentObservable) {
              var lastError = currentObservable.getLastError();
              var lastResult = currentObservable.getLastResult();
              currentObservable.resetLastResults();
              this.startQuerySubscription();
              Object.assign(currentObservable, {
                  lastError: lastError,
                  lastResult: lastResult
              });
          }
      };
      QueryData.prototype.handleErrorOrCompleted = function () {
          if (!this.currentObservable || !this.previous.result)
              return;
          var _a = this.previous.result, data = _a.data, loading = _a.loading, error = _a.error;
          if (!loading) {
              var _b = this.getOptions(), query = _b.query, variables = _b.variables, onCompleted = _b.onCompleted, onError = _b.onError, skip = _b.skip;
              if (this.previousOptions &&
                  !this.previous.loading &&
                  equal(this.previousOptions.query, query) &&
                  equal(this.previousOptions.variables, variables)) {
                  return;
              }
              if (onCompleted && !error && !skip) {
                  onCompleted(data);
              }
              else if (onError && error) {
                  onError(error);
              }
          }
      };
      QueryData.prototype.removeQuerySubscription = function () {
          if (this.currentSubscription) {
              this.currentSubscription.unsubscribe();
              delete this.currentSubscription;
          }
      };
      QueryData.prototype.removeObservable = function (andDelete) {
          if (this.currentObservable) {
              this.currentObservable["tearDownQuery"]();
              if (andDelete) {
                  delete this.currentObservable;
              }
          }
      };
      QueryData.prototype.observableQueryFields = function () {
          var _a;
          return {
              variables: (_a = this.currentObservable) === null || _a === void 0 ? void 0 : _a.variables,
              refetch: this.obsRefetch,
              fetchMore: this.obsFetchMore,
              updateQuery: this.obsUpdateQuery,
              startPolling: this.obsStartPolling,
              stopPolling: this.obsStopPolling,
              subscribeToMore: this.obsSubscribeToMore
          };
      };
      return QueryData;
  })(OperationData));

  function useMutation(mutation, options) {
      var context = react_19(getApolloContext());
      var _a = react_27({ called: false, loading: false }), result = _a[0], setResult = _a[1];
      var updatedOptions = options ? __assign$1(__assign$1({}, options), { mutation: mutation }) : { mutation: mutation };
      var mutationDataRef = react_26();
      function getMutationDataRef() {
          if (!mutationDataRef.current) {
              mutationDataRef.current = new MutationData({
                  options: updatedOptions,
                  context: context,
                  result: result,
                  setResult: setResult
              });
          }
          return mutationDataRef.current;
      }
      var mutationData = getMutationDataRef();
      mutationData.setOptions(updatedOptions);
      mutationData.context = context;
      react_21(function () { return mutationData.afterExecute(); });
      return mutationData.execute(result);
  }

  var sweetalert_min = createCommonjsModule(function (module, exports) {
  !function(t,e){module.exports=e();}(commonjsGlobal,function(){return function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o});},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=8)}([function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o="swal-button";e.CLASS_NAMES={MODAL:"swal-modal",OVERLAY:"swal-overlay",SHOW_MODAL:"swal-overlay--show-modal",MODAL_TITLE:"swal-title",MODAL_TEXT:"swal-text",ICON:"swal-icon",ICON_CUSTOM:"swal-icon--custom",CONTENT:"swal-content",FOOTER:"swal-footer",BUTTON_CONTAINER:"swal-button-container",BUTTON:o,CONFIRM_BUTTON:o+"--confirm",CANCEL_BUTTON:o+"--cancel",DANGER_BUTTON:o+"--danger",BUTTON_LOADING:o+"--loading",BUTTON_LOADER:o+"__loader"},e.default=e.CLASS_NAMES;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.getNode=function(t){var e="."+t;return document.querySelector(e)},e.stringToNode=function(t){var e=document.createElement("div");return e.innerHTML=t.trim(),e.firstChild},e.insertAfter=function(t,e){var n=e.nextSibling;e.parentNode.insertBefore(t,n);},e.removeNode=function(t){t.parentElement.removeChild(t);},e.throwErr=function(t){throw t=t.replace(/ +(?= )/g,""),"SweetAlert: "+(t=t.trim())},e.isPlainObject=function(t){if("[object Object]"!==Object.prototype.toString.call(t))return !1;var e=Object.getPrototypeOf(t);return null===e||e===Object.prototype},e.ordinalSuffixOf=function(t){var e=t%10,n=t%100;return 1===e&&11!==n?t+"st":2===e&&12!==n?t+"nd":3===e&&13!==n?t+"rd":t+"th"};},function(t,e,n){function o(t){for(var n in t)e.hasOwnProperty(n)||(e[n]=t[n]);}Object.defineProperty(e,"__esModule",{value:!0}),o(n(25));var r=n(26);e.overlayMarkup=r.default,o(n(27)),o(n(28)),o(n(29));var i=n(0),a=i.default.MODAL_TITLE,s=i.default.MODAL_TEXT,c=i.default.ICON,l=i.default.FOOTER;e.iconMarkup='\n  <div class="'+c+'"></div>',e.titleMarkup='\n  <div class="'+a+'"></div>\n',e.textMarkup='\n  <div class="'+s+'"></div>',e.footerMarkup='\n  <div class="'+l+'"></div>\n';},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1);e.CONFIRM_KEY="confirm",e.CANCEL_KEY="cancel";var r={visible:!0,text:null,value:null,className:"",closeModal:!0},i=Object.assign({},r,{visible:!1,text:"Cancel",value:null}),a=Object.assign({},r,{text:"OK",value:!0});e.defaultButtonList={cancel:i,confirm:a};var s=function(t){switch(t){case e.CONFIRM_KEY:return a;case e.CANCEL_KEY:return i;default:var n=t.charAt(0).toUpperCase()+t.slice(1);return Object.assign({},r,{text:n,value:t})}},c=function(t,e){var n=s(t);return !0===e?Object.assign({},n,{visible:!0}):"string"==typeof e?Object.assign({},n,{visible:!0,text:e}):o.isPlainObject(e)?Object.assign({visible:!0},n,e):Object.assign({},n,{visible:!1})},l=function(t){for(var e={},n=0,o=Object.keys(t);n<o.length;n++){var r=o[n],a=t[r],s=c(r,a);e[r]=s;}return e.cancel||(e.cancel=i),e},u=function(t){var n={};switch(t.length){case 1:n[e.CANCEL_KEY]=Object.assign({},i,{visible:!1});break;case 2:n[e.CANCEL_KEY]=c(e.CANCEL_KEY,t[0]),n[e.CONFIRM_KEY]=c(e.CONFIRM_KEY,t[1]);break;default:o.throwErr("Invalid number of 'buttons' in array ("+t.length+").\n      If you want more than 2 buttons, you need to use an object!");}return n};e.getButtonListOpts=function(t){var n=e.defaultButtonList;return "string"==typeof t?n[e.CONFIRM_KEY]=c(e.CONFIRM_KEY,t):Array.isArray(t)?n=u(t):o.isPlainObject(t)?n=l(t):!0===t?n=u([!0,!0]):!1===t?n=u([!1,!1]):void 0===t&&(n=e.defaultButtonList),n};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(2),i=n(0),a=i.default.MODAL,s=i.default.OVERLAY,c=n(30),l=n(31),u=n(32),f=n(33);e.injectElIntoModal=function(t){var e=o.getNode(a),n=o.stringToNode(t);return e.appendChild(n),n};var d=function(t){t.className=a,t.textContent="";},p=function(t,e){d(t);var n=e.className;n&&t.classList.add(n);};e.initModalContent=function(t){var e=o.getNode(a);p(e,t),c.default(t.icon),l.initTitle(t.title),l.initText(t.text),f.default(t.content),u.default(t.buttons,t.dangerMode);};var m=function(){var t=o.getNode(s),e=o.stringToNode(r.modalMarkup);t.appendChild(e);};e.default=m;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),r={isOpen:!1,promise:null,actions:{},timer:null},i=Object.assign({},r);e.resetState=function(){i=Object.assign({},r);},e.setActionValue=function(t){if("string"==typeof t)return a(o.CONFIRM_KEY,t);for(var e in t)a(e,t[e]);};var a=function(t,e){i.actions[t]||(i.actions[t]={}),Object.assign(i.actions[t],{value:e});};e.setActionOptionsFor=function(t,e){var n=(void 0===e?{}:e).closeModal,o=void 0===n||n;Object.assign(i.actions[t],{closeModal:o});},e.default=i;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(3),i=n(0),a=i.default.OVERLAY,s=i.default.SHOW_MODAL,c=i.default.BUTTON,l=i.default.BUTTON_LOADING,u=n(5);e.openModal=function(){o.getNode(a).classList.add(s),u.default.isOpen=!0;};var f=function(){o.getNode(a).classList.remove(s),u.default.isOpen=!1;};e.onAction=function(t){void 0===t&&(t=r.CANCEL_KEY);var e=u.default.actions[t],n=e.value;if(!1===e.closeModal){var i=c+"--"+t;o.getNode(i).classList.add(l);}else f();u.default.promise.resolve(n);},e.getState=function(){var t=Object.assign({},u.default);return delete t.promise,delete t.timer,t},e.stopLoading=function(){for(var t=document.querySelectorAll("."+c),e=0;e<t.length;e++){t[e].classList.remove(l);}};},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this");}catch(t){"object"==typeof window&&(n=window);}t.exports=n;},function(t,e,n){(function(e){t.exports=e.sweetAlert=n(9);}).call(e,n(7));},function(t,e,n){(function(e){t.exports=e.swal=n(10);}).call(e,n(7));},function(t,e,n){"undefined"!=typeof window&&n(11),n(16);var o=n(23).default;t.exports=o;},function(t,e,n){var o=n(12);"string"==typeof o&&(o=[[t.i,o,""]]);var r={insertAt:"top"};r.transform=void 0;n(14)(o,r);o.locals&&(t.exports=o.locals);},function(t,e,n){e=t.exports=n(13)(void 0),e.push([t.i,'.swal-icon--error{border-color:#f27474;-webkit-animation:animateErrorIcon .5s;animation:animateErrorIcon .5s}.swal-icon--error__x-mark{position:relative;display:block;-webkit-animation:animateXMark .5s;animation:animateXMark .5s}.swal-icon--error__line{position:absolute;height:5px;width:47px;background-color:#f27474;display:block;top:37px;border-radius:2px}.swal-icon--error__line--left{-webkit-transform:rotate(45deg);transform:rotate(45deg);left:17px}.swal-icon--error__line--right{-webkit-transform:rotate(-45deg);transform:rotate(-45deg);right:16px}@-webkit-keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@-webkit-keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}@keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}.swal-icon--warning{border-color:#f8bb86;-webkit-animation:pulseWarning .75s infinite alternate;animation:pulseWarning .75s infinite alternate}.swal-icon--warning__body{width:5px;height:47px;top:10px;border-radius:2px;margin-left:-2px}.swal-icon--warning__body,.swal-icon--warning__dot{position:absolute;left:50%;background-color:#f8bb86}.swal-icon--warning__dot{width:7px;height:7px;border-radius:50%;margin-left:-4px;bottom:-11px}@-webkit-keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}@keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}.swal-icon--success{border-color:#a5dc86}.swal-icon--success:after,.swal-icon--success:before{content:"";border-radius:50%;position:absolute;width:60px;height:120px;background:#fff;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal-icon--success:before{border-radius:120px 0 0 120px;top:-7px;left:-33px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:60px 60px;transform-origin:60px 60px}.swal-icon--success:after{border-radius:0 120px 120px 0;top:-11px;left:30px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 60px;transform-origin:0 60px;-webkit-animation:rotatePlaceholder 4.25s ease-in;animation:rotatePlaceholder 4.25s ease-in}.swal-icon--success__ring{width:80px;height:80px;border:4px solid hsla(98,55%,69%,.2);border-radius:50%;box-sizing:content-box;position:absolute;left:-4px;top:-4px;z-index:2}.swal-icon--success__hide-corners{width:5px;height:90px;background-color:#fff;padding:1px;position:absolute;left:28px;top:8px;z-index:1;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal-icon--success__line{height:5px;background-color:#a5dc86;display:block;border-radius:2px;position:absolute;z-index:2}.swal-icon--success__line--tip{width:25px;left:14px;top:46px;-webkit-transform:rotate(45deg);transform:rotate(45deg);-webkit-animation:animateSuccessTip .75s;animation:animateSuccessTip .75s}.swal-icon--success__line--long{width:47px;right:8px;top:38px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-animation:animateSuccessLong .75s;animation:animateSuccessLong .75s}@-webkit-keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@-webkit-keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@-webkit-keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}@keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}.swal-icon--info{border-color:#c9dae1}.swal-icon--info:before{width:5px;height:29px;bottom:17px;border-radius:2px;margin-left:-2px}.swal-icon--info:after,.swal-icon--info:before{content:"";position:absolute;left:50%;background-color:#c9dae1}.swal-icon--info:after{width:7px;height:7px;border-radius:50%;margin-left:-3px;top:19px}.swal-icon{width:80px;height:80px;border-width:4px;border-style:solid;border-radius:50%;padding:0;position:relative;box-sizing:content-box;margin:20px auto}.swal-icon:first-child{margin-top:32px}.swal-icon--custom{width:auto;height:auto;max-width:100%;border:none;border-radius:0}.swal-icon img{max-width:100%;max-height:100%}.swal-title{color:rgba(0,0,0,.65);font-weight:600;text-transform:none;position:relative;display:block;padding:13px 16px;font-size:27px;line-height:normal;text-align:center;margin-bottom:0}.swal-title:first-child{margin-top:26px}.swal-title:not(:first-child){padding-bottom:0}.swal-title:not(:last-child){margin-bottom:13px}.swal-text{font-size:16px;position:relative;float:none;line-height:normal;vertical-align:top;text-align:left;display:inline-block;margin:0;padding:0 10px;font-weight:400;color:rgba(0,0,0,.64);max-width:calc(100% - 20px);overflow-wrap:break-word;box-sizing:border-box}.swal-text:first-child{margin-top:45px}.swal-text:last-child{margin-bottom:45px}.swal-footer{text-align:right;padding-top:13px;margin-top:13px;padding:13px 16px;border-radius:inherit;border-top-left-radius:0;border-top-right-radius:0}.swal-button-container{margin:5px;display:inline-block;position:relative}.swal-button{background-color:#7cd1f9;color:#fff;border:none;box-shadow:none;border-radius:5px;font-weight:600;font-size:14px;padding:10px 24px;margin:0;cursor:pointer}.swal-button:not([disabled]):hover{background-color:#78cbf2}.swal-button:active{background-color:#70bce0}.swal-button:focus{outline:none;box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(43,114,165,.29)}.swal-button[disabled]{opacity:.5;cursor:default}.swal-button::-moz-focus-inner{border:0}.swal-button--cancel{color:#555;background-color:#efefef}.swal-button--cancel:not([disabled]):hover{background-color:#e8e8e8}.swal-button--cancel:active{background-color:#d7d7d7}.swal-button--cancel:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(116,136,150,.29)}.swal-button--danger{background-color:#e64942}.swal-button--danger:not([disabled]):hover{background-color:#df4740}.swal-button--danger:active{background-color:#cf423b}.swal-button--danger:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(165,43,43,.29)}.swal-content{padding:0 20px;margin-top:20px;font-size:medium}.swal-content:last-child{margin-bottom:20px}.swal-content__input,.swal-content__textarea{-webkit-appearance:none;background-color:#fff;border:none;font-size:14px;display:block;box-sizing:border-box;width:100%;border:1px solid rgba(0,0,0,.14);padding:10px 13px;border-radius:2px;transition:border-color .2s}.swal-content__input:focus,.swal-content__textarea:focus{outline:none;border-color:#6db8ff}.swal-content__textarea{resize:vertical}.swal-button--loading{color:transparent}.swal-button--loading~.swal-button__loader{opacity:1}.swal-button__loader{position:absolute;height:auto;width:43px;z-index:2;left:50%;top:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%);text-align:center;pointer-events:none;opacity:0}.swal-button__loader div{display:inline-block;float:none;vertical-align:baseline;width:9px;height:9px;padding:0;border:none;margin:2px;opacity:.4;border-radius:7px;background-color:hsla(0,0%,100%,.9);transition:background .2s;-webkit-animation:swal-loading-anim 1s infinite;animation:swal-loading-anim 1s infinite}.swal-button__loader div:nth-child(3n+2){-webkit-animation-delay:.15s;animation-delay:.15s}.swal-button__loader div:nth-child(3n+3){-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}@keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}.swal-overlay{position:fixed;top:0;bottom:0;left:0;right:0;text-align:center;font-size:0;overflow-y:auto;background-color:rgba(0,0,0,.4);z-index:10000;pointer-events:none;opacity:0;transition:opacity .3s}.swal-overlay:before{content:" ";display:inline-block;vertical-align:middle;height:100%}.swal-overlay--show-modal{opacity:1;pointer-events:auto}.swal-overlay--show-modal .swal-modal{opacity:1;pointer-events:auto;box-sizing:border-box;-webkit-animation:showSweetAlert .3s;animation:showSweetAlert .3s;will-change:transform}.swal-modal{width:478px;opacity:0;pointer-events:none;background-color:#fff;text-align:center;border-radius:5px;position:static;margin:20px auto;display:inline-block;vertical-align:middle;-webkit-transform:scale(1);transform:scale(1);-webkit-transform-origin:50% 50%;transform-origin:50% 50%;z-index:10001;transition:opacity .2s,-webkit-transform .3s;transition:transform .3s,opacity .2s;transition:transform .3s,opacity .2s,-webkit-transform .3s}@media (max-width:500px){.swal-modal{width:calc(100% - 20px)}}@-webkit-keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}@keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}',""]);},function(t,e){function n(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var i=o(r);return [n].concat(r.sources.map(function(t){return "/*# sourceURL="+r.sourceRoot+t+" */"})).concat([i]).join("\n")}return [n].join("\n")}function o(t){return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t))))+" */"}t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var o=n(e,t);return e[2]?"@media "+e[2]+"{"+o+"}":o}).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},r=0;r<this.length;r++){var i=this[r][0];"number"==typeof i&&(o[i]=!0);}for(r=0;r<t.length;r++){var a=t[r];"number"==typeof a[0]&&o[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a));}},e};},function(t,e,n){function o(t,e){for(var n=0;n<t.length;n++){var o=t[n],r=m[o.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](o.parts[i]);for(;i<o.parts.length;i++)r.parts.push(u(o.parts[i],e));}else {for(var a=[],i=0;i<o.parts.length;i++)a.push(u(o.parts[i],e));m[o.id]={id:o.id,refs:1,parts:a};}}}function r(t,e){for(var n=[],o={},r=0;r<t.length;r++){var i=t[r],a=e.base?i[0]+e.base:i[0],s=i[1],c=i[2],l=i[3],u={css:s,media:c,sourceMap:l};o[a]?o[a].parts.push(u):n.push(o[a]={id:a,parts:[u]});}return n}function i(t,e){var n=v(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=w[w.length-1];if("top"===t.insertAt)o?o.nextSibling?n.insertBefore(e,o.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),w.push(e);else {if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(e);}}function a(t){if(null===t.parentNode)return !1;t.parentNode.removeChild(t);var e=w.indexOf(t);e>=0&&w.splice(e,1);}function s(t){var e=document.createElement("style");return t.attrs.type="text/css",l(e,t.attrs),i(t,e),e}function c(t){var e=document.createElement("link");return t.attrs.type="text/css",t.attrs.rel="stylesheet",l(e,t.attrs),i(t,e),e}function l(t,e){Object.keys(e).forEach(function(n){t.setAttribute(n,e[n]);});}function u(t,e){var n,o,r,i;if(e.transform&&t.css){if(!(i=e.transform(t.css)))return function(){};t.css=i;}if(e.singleton){var l=h++;n=g||(g=s(e)),o=f.bind(null,n,l,!1),r=f.bind(null,n,l,!0);}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(e),o=p.bind(null,n,e),r=function(){a(n),n.href&&URL.revokeObjectURL(n.href);}):(n=s(e),o=d.bind(null,n),r=function(){a(n);});return o(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;o(t=e);}else r();}}function f(t,e,n,o){var r=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=x(e,r);else {var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i);}}function d(t,e){var n=e.css,o=e.media;if(o&&t.setAttribute("media",o),t.styleSheet)t.styleSheet.cssText=n;else {for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n));}}function p(t,e,n){var o=n.css,r=n.sourceMap,i=void 0===e.convertToAbsoluteUrls&&r;(e.convertToAbsoluteUrls||i)&&(o=y(o)),r&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var a=new Blob([o],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s);}var m={},b=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),v=function(t){var e={};return function(n){return void 0===e[n]&&(e[n]=t.call(this,n)),e[n]}}(function(t){return document.querySelector(t)}),g=null,h=0,w=[],y=n(15);t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||(e.singleton=b()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=r(t,e);return o(n,e),function(t){for(var i=[],a=0;a<n.length;a++){var s=n[a],c=m[s.id];c.refs--,i.push(c);}if(t){o(r(t,e),e);}for(var a=0;a<i.length;a++){var c=i[a];if(0===c.refs){for(var l=0;l<c.parts.length;l++)c.parts[l]();delete m[c.id];}}}};var x=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}();},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,o=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var r=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(r))return t;var i;return i=0===r.indexOf("//")?r:0===r.indexOf("/")?n+r:o+r.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})};},function(t,e,n){var o=n(17);"undefined"==typeof window||window.Promise||(window.Promise=o),n(21),String.prototype.includes||(String.prototype.includes=function(t,e){return "number"!=typeof e&&(e=0),!(e+t.length>this.length)&&-1!==this.indexOf(t,e)}),Array.prototype.includes||Object.defineProperty(Array.prototype,"includes",{value:function(t,e){if(null==this)throw new TypeError('"this" is null or not defined');var n=Object(this),o=n.length>>>0;if(0===o)return !1;for(var r=0|e,i=Math.max(r>=0?r:o-Math.abs(r),0);i<o;){if(function(t,e){return t===e||"number"==typeof t&&"number"==typeof e&&isNaN(t)&&isNaN(e)}(n[i],t))return !0;i++;}return !1}}),"undefined"!=typeof window&&function(t){t.forEach(function(t){t.hasOwnProperty("remove")||Object.defineProperty(t,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){this.parentNode.removeChild(this);}});});}([Element.prototype,CharacterData.prototype,DocumentType.prototype]);},function(t,e,n){(function(e){!function(n){function o(){}function r(t,e){return function(){t.apply(e,arguments);}}function i(t){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],f(t,this);}function a(t,e){for(;3===t._state;)t=t._value;if(0===t._state)return void t._deferreds.push(e);t._handled=!0,i._immediateFn(function(){var n=1===t._state?e.onFulfilled:e.onRejected;if(null===n)return void(1===t._state?s:c)(e.promise,t._value);var o;try{o=n(t._value);}catch(t){return void c(e.promise,t)}s(e.promise,o);});}function s(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var n=e.then;if(e instanceof i)return t._state=3,t._value=e,void l(t);if("function"==typeof n)return void f(r(n,e),t)}t._state=1,t._value=e,l(t);}catch(e){c(t,e);}}function c(t,e){t._state=2,t._value=e,l(t);}function l(t){2===t._state&&0===t._deferreds.length&&i._immediateFn(function(){t._handled||i._unhandledRejectionFn(t._value);});for(var e=0,n=t._deferreds.length;e<n;e++)a(t,t._deferreds[e]);t._deferreds=null;}function u(t,e,n){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=n;}function f(t,e){var n=!1;try{t(function(t){n||(n=!0,s(e,t));},function(t){n||(n=!0,c(e,t));});}catch(t){if(n)return;n=!0,c(e,t);}}var d=setTimeout;i.prototype.catch=function(t){return this.then(null,t)},i.prototype.then=function(t,e){var n=new this.constructor(o);return a(this,new u(t,e,n)),n},i.all=function(t){var e=Array.prototype.slice.call(t);return new i(function(t,n){function o(i,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(t){o(i,t);},n)}e[i]=a,0==--r&&t(e);}catch(t){n(t);}}if(0===e.length)return t([]);for(var r=e.length,i=0;i<e.length;i++)o(i,e[i]);})},i.resolve=function(t){return t&&"object"==typeof t&&t.constructor===i?t:new i(function(e){e(t);})},i.reject=function(t){return new i(function(e,n){n(t);})},i.race=function(t){return new i(function(e,n){for(var o=0,r=t.length;o<r;o++)t[o].then(e,n);})},i._immediateFn="function"==typeof e&&function(t){e(t);}||function(t){d(t,0);},i._unhandledRejectionFn=function(t){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t);},i._setImmediateFn=function(t){i._immediateFn=t;},i._setUnhandledRejectionFn=function(t){i._unhandledRejectionFn=t;},void 0!==t&&t.exports?t.exports=i:n.Promise||(n.Promise=i);}(this);}).call(e,n(18).setImmediate);},function(t,e,n){function o(t,e){this._id=t,this._clearFn=e;}var r=Function.prototype.apply;e.setTimeout=function(){return new o(r.call(setTimeout,window,arguments),clearTimeout)},e.setInterval=function(){return new o(r.call(setInterval,window,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close();},o.prototype.unref=o.prototype.ref=function(){},o.prototype.close=function(){this._clearFn.call(window,this._id);},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e;},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1;},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout();},e));},n(19),e.setImmediate=setImmediate,e.clearImmediate=clearImmediate;},function(t,e,n){(function(t,e){!function(t,n){function o(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var o={callback:t,args:e};return l[c]=o,s(c),c++}function r(t){delete l[t];}function i(t){var e=t.callback,o=t.args;switch(o.length){case 0:e();break;case 1:e(o[0]);break;case 2:e(o[0],o[1]);break;case 3:e(o[0],o[1],o[2]);break;default:e.apply(n,o);}}function a(t){if(u)setTimeout(a,0,t);else {var e=l[t];if(e){u=!0;try{i(e);}finally{r(t),u=!1;}}}}if(!t.setImmediate){var s,c=1,l={},u=!1,f=t.document,d=Object.getPrototypeOf&&Object.getPrototypeOf(t);d=d&&d.setTimeout?d:t,"[object process]"==={}.toString.call(t.process)?function(){s=function(t){e.nextTick(function(){a(t);});};}():function(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1;},t.postMessage("","*"),t.onmessage=n,e}}()?function(){var e="setImmediate$"+Math.random()+"$",n=function(n){n.source===t&&"string"==typeof n.data&&0===n.data.indexOf(e)&&a(+n.data.slice(e.length));};t.addEventListener?t.addEventListener("message",n,!1):t.attachEvent("onmessage",n),s=function(n){t.postMessage(e+n,"*");};}():t.MessageChannel?function(){var t=new MessageChannel;t.port1.onmessage=function(t){a(t.data);},s=function(e){t.port2.postMessage(e);};}():f&&"onreadystatechange"in f.createElement("script")?function(){var t=f.documentElement;s=function(e){var n=f.createElement("script");n.onreadystatechange=function(){a(e),n.onreadystatechange=null,t.removeChild(n),n=null;},t.appendChild(n);};}():function(){s=function(t){setTimeout(a,0,t);};}(),d.setImmediate=o,d.clearImmediate=r;}}("undefined"==typeof self?void 0===t?this:t:self);}).call(e,n(7),n(20));},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function r(t){if(u===setTimeout)return setTimeout(t,0);if((u===n||!u)&&setTimeout)return u=setTimeout,setTimeout(t,0);try{return u(t,0)}catch(e){try{return u.call(null,t,0)}catch(e){return u.call(this,t,0)}}}function i(t){if(f===clearTimeout)return clearTimeout(t);if((f===o||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(t);try{return f(t)}catch(e){try{return f.call(null,t)}catch(e){return f.call(this,t)}}}function a(){b&&p&&(b=!1,p.length?m=p.concat(m):v=-1,m.length&&s());}function s(){if(!b){var t=r(a);b=!0;for(var e=m.length;e;){for(p=m,m=[];++v<e;)p&&p[v].run();v=-1,e=m.length;}p=null,b=!1,i(t);}}function c(t,e){this.fun=t,this.array=e;}function l(){}var u,f,d=t.exports={};!function(){try{u="function"==typeof setTimeout?setTimeout:n;}catch(t){u=n;}try{f="function"==typeof clearTimeout?clearTimeout:o;}catch(t){f=o;}}();var p,m=[],b=!1,v=-1;d.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];m.push(new c(t,e)),1!==m.length||b||r(s);},c.prototype.run=function(){this.fun.apply(null,this.array);},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=l,d.addListener=l,d.once=l,d.off=l,d.removeListener=l,d.removeAllListeners=l,d.emit=l,d.prependListener=l,d.prependOnceListener=l,d.listeners=function(t){return []},d.binding=function(t){throw new Error("process.binding is not supported")},d.cwd=function(){return "/"},d.chdir=function(t){throw new Error("process.chdir is not supported")},d.umask=function(){return 0};},function(t,e,n){n(22).polyfill();},function(t,e,n){function o(t,e){if(void 0===t||null===t)throw new TypeError("Cannot convert first argument to object");for(var n=Object(t),o=1;o<arguments.length;o++){var r=arguments[o];if(void 0!==r&&null!==r)for(var i=Object.keys(Object(r)),a=0,s=i.length;a<s;a++){var c=i[a],l=Object.getOwnPropertyDescriptor(r,c);void 0!==l&&l.enumerable&&(n[c]=r[c]);}}return n}function r(){Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:o});}t.exports={assign:o,polyfill:r};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(24),r=n(6),i=n(5),a=n(36),s=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];if("undefined"!=typeof window){var n=a.getOpts.apply(void 0,t);return new Promise(function(t,e){i.default.promise={resolve:t,reject:e},o.default(n),setTimeout(function(){r.openModal();});})}};s.close=r.onAction,s.getState=r.getState,s.setActionValue=i.setActionValue,s.stopLoading=r.stopLoading,s.setDefaults=a.setDefaults,e.default=s;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(0),i=r.default.MODAL,a=n(4),s=n(34),c=n(35),l=n(1);e.init=function(t){o.getNode(i)||(document.body||l.throwErr("You can only use SweetAlert AFTER the DOM has loaded!"),s.default(),a.default()),a.initModalContent(t),c.default(t);},e.default=e.init;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.MODAL;e.modalMarkup='\n  <div class="'+r+'" role="dialog" aria-modal="true"></div>',e.default=e.modalMarkup;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.OVERLAY,i='<div \n    class="'+r+'"\n    tabIndex="-1">\n  </div>';e.default=i;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.ICON;e.errorIconMarkup=function(){var t=r+"--error",e=t+"__line";return '\n    <div class="'+t+'__x-mark">\n      <span class="'+e+" "+e+'--left"></span>\n      <span class="'+e+" "+e+'--right"></span>\n    </div>\n  '},e.warningIconMarkup=function(){var t=r+"--warning";return '\n    <span class="'+t+'__body">\n      <span class="'+t+'__dot"></span>\n    </span>\n  '},e.successIconMarkup=function(){var t=r+"--success";return '\n    <span class="'+t+"__line "+t+'__line--long"></span>\n    <span class="'+t+"__line "+t+'__line--tip"></span>\n\n    <div class="'+t+'__ring"></div>\n    <div class="'+t+'__hide-corners"></div>\n  '};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.CONTENT;e.contentMarkup='\n  <div class="'+r+'">\n\n  </div>\n';},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.BUTTON_CONTAINER,i=o.default.BUTTON,a=o.default.BUTTON_LOADER;e.buttonMarkup='\n  <div class="'+r+'">\n\n    <button\n      class="'+i+'"\n    ></button>\n\n    <div class="'+a+'">\n      <div></div>\n      <div></div>\n      <div></div>\n    </div>\n\n  </div>\n';},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(4),r=n(2),i=n(0),a=i.default.ICON,s=i.default.ICON_CUSTOM,c=["error","warning","success","info"],l={error:r.errorIconMarkup(),warning:r.warningIconMarkup(),success:r.successIconMarkup()},u=function(t,e){var n=a+"--"+t;e.classList.add(n);var o=l[t];o&&(e.innerHTML=o);},f=function(t,e){e.classList.add(s);var n=document.createElement("img");n.src=t,e.appendChild(n);},d=function(t){if(t){var e=o.injectElIntoModal(r.iconMarkup);c.includes(t)?u(t,e):f(t,e);}};e.default=d;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(2),r=n(4),i=function(t){navigator.userAgent.includes("AppleWebKit")&&(t.style.display="none",t.offsetHeight,t.style.display="");};e.initTitle=function(t){if(t){var e=r.injectElIntoModal(o.titleMarkup);e.textContent=t,i(e);}},e.initText=function(t){if(t){var e=document.createDocumentFragment();t.split("\n").forEach(function(t,n,o){e.appendChild(document.createTextNode(t)),n<o.length-1&&e.appendChild(document.createElement("br"));});var n=r.injectElIntoModal(o.textMarkup);n.appendChild(e),i(n);}};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(4),i=n(0),a=i.default.BUTTON,s=i.default.DANGER_BUTTON,c=n(3),l=n(2),u=n(6),f=n(5),d=function(t,e,n){var r=e.text,i=e.value,d=e.className,p=e.closeModal,m=o.stringToNode(l.buttonMarkup),b=m.querySelector("."+a),v=a+"--"+t;if(b.classList.add(v),d){(Array.isArray(d)?d:d.split(" ")).filter(function(t){return t.length>0}).forEach(function(t){b.classList.add(t);});}n&&t===c.CONFIRM_KEY&&b.classList.add(s),b.textContent=r;var g={};return g[t]=i,f.setActionValue(g),f.setActionOptionsFor(t,{closeModal:p}),b.addEventListener("click",function(){return u.onAction(t)}),m},p=function(t,e){var n=r.injectElIntoModal(l.footerMarkup);for(var o in t){var i=t[o],a=d(o,i,e);i.visible&&n.appendChild(a);}0===n.children.length&&n.remove();};e.default=p;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),r=n(4),i=n(2),a=n(5),s=n(6),c=n(0),l=c.default.CONTENT,u=function(t){t.addEventListener("input",function(t){var e=t.target,n=e.value;a.setActionValue(n);}),t.addEventListener("keyup",function(t){if("Enter"===t.key)return s.onAction(o.CONFIRM_KEY)}),setTimeout(function(){t.focus(),a.setActionValue("");},0);},f=function(t,e,n){var o=document.createElement(e),r=l+"__"+e;o.classList.add(r);for(var i in n){var a=n[i];o[i]=a;}"input"===e&&u(o),t.appendChild(o);},d=function(t){if(t){var e=r.injectElIntoModal(i.contentMarkup),n=t.element,o=t.attributes;"string"==typeof n?f(e,n,o):e.appendChild(n);}};e.default=d;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(2),i=function(){var t=o.stringToNode(r.overlayMarkup);document.body.appendChild(t);};e.default=i;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(5),r=n(6),i=n(1),a=n(3),s=n(0),c=s.default.MODAL,l=s.default.BUTTON,u=s.default.OVERLAY,f=function(t){t.preventDefault(),v();},d=function(t){t.preventDefault(),g();},p=function(t){if(o.default.isOpen)switch(t.key){case"Escape":return r.onAction(a.CANCEL_KEY)}},m=function(t){if(o.default.isOpen)switch(t.key){case"Tab":return f(t)}},b=function(t){if(o.default.isOpen)return "Tab"===t.key&&t.shiftKey?d(t):void 0},v=function(){var t=i.getNode(l);t&&(t.tabIndex=0,t.focus());},g=function(){var t=i.getNode(c),e=t.querySelectorAll("."+l),n=e.length-1,o=e[n];o&&o.focus();},h=function(t){t[t.length-1].addEventListener("keydown",m);},w=function(t){t[0].addEventListener("keydown",b);},y=function(){var t=i.getNode(c),e=t.querySelectorAll("."+l);e.length&&(h(e),w(e));},x=function(t){if(i.getNode(u)===t.target)return r.onAction(a.CANCEL_KEY)},_=function(t){var e=i.getNode(u);e.removeEventListener("click",x),t&&e.addEventListener("click",x);},k=function(t){o.default.timer&&clearTimeout(o.default.timer),t&&(o.default.timer=window.setTimeout(function(){return r.onAction(a.CANCEL_KEY)},t));},O=function(t){t.closeOnEsc?document.addEventListener("keyup",p):document.removeEventListener("keyup",p),t.dangerMode?v():g(),y(),_(t.closeOnClickOutside),k(t.timer);};e.default=O;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(3),i=n(37),a=n(38),s={title:null,text:null,icon:null,buttons:r.defaultButtonList,content:null,className:null,closeOnClickOutside:!0,closeOnEsc:!0,dangerMode:!1,timer:null},c=Object.assign({},s);e.setDefaults=function(t){c=Object.assign({},s,t);};var l=function(t){var e=t&&t.button,n=t&&t.buttons;return void 0!==e&&void 0!==n&&o.throwErr("Cannot set both 'button' and 'buttons' options!"),void 0!==e?{confirm:e}:n},u=function(t){return o.ordinalSuffixOf(t+1)},f=function(t,e){o.throwErr(u(e)+" argument ('"+t+"') is invalid");},d=function(t,e){var n=t+1,r=e[n];o.isPlainObject(r)||void 0===r||o.throwErr("Expected "+u(n)+" argument ('"+r+"') to be a plain object");},p=function(t,e){var n=t+1,r=e[n];void 0!==r&&o.throwErr("Unexpected "+u(n)+" argument ("+r+")");},m=function(t,e,n,r){var i=typeof e,a="string"===i,s=e instanceof Element;if(a){if(0===n)return {text:e};if(1===n)return {text:e,title:r[0]};if(2===n)return d(n,r),{icon:e};f(e,n);}else {if(s&&0===n)return d(n,r),{content:e};if(o.isPlainObject(e))return p(n,r),e;f(e,n);}};e.getOpts=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n={};t.forEach(function(e,o){var r=m(0,e,o,t);Object.assign(n,r);});var o=l(n);n.buttons=r.getButtonListOpts(o),delete n.button,n.content=i.getContentOpts(n.content);var u=Object.assign({},s,c,n);return Object.keys(u).forEach(function(t){a.DEPRECATED_OPTS[t]&&a.logDeprecation(t);}),u};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r={element:"input",attributes:{placeholder:""}};e.getContentOpts=function(t){var e={};return o.isPlainObject(t)?Object.assign(e,t):t instanceof Element?{element:t}:"input"===t?r:null};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.logDeprecation=function(t){var n=e.DEPRECATED_OPTS[t],o=n.onlyRename,r=n.replacement,i=n.subOption,a=n.link,s=o?"renamed":"deprecated",c='SweetAlert warning: "'+t+'" option has been '+s+".";if(r){c+=" Please use"+(i?' "'+i+'" in ':" ")+'"'+r+'" instead.';}var l="https://sweetalert.js.org";c+=a?" More details: "+l+a:" More details: "+l+"/guides/#upgrading-from-1x",console.warn(c);},e.DEPRECATED_OPTS={type:{replacement:"icon",link:"/docs/#icon"},imageUrl:{replacement:"icon",link:"/docs/#icon"},customClass:{replacement:"className",onlyRename:!0,link:"/docs/#classname"},imageSize:{},showCancelButton:{replacement:"buttons",link:"/docs/#buttons"},showConfirmButton:{replacement:"button",link:"/docs/#button"},confirmButtonText:{replacement:"button",link:"/docs/#button"},confirmButtonColor:{},cancelButtonText:{replacement:"buttons",link:"/docs/#buttons"},closeOnConfirm:{replacement:"button",subOption:"closeModal",link:"/docs/#button"},closeOnCancel:{replacement:"buttons",subOption:"closeModal",link:"/docs/#buttons"},showLoaderOnConfirm:{replacement:"buttons"},animation:{},inputType:{replacement:"content",link:"/docs/#content"},inputValue:{replacement:"content",link:"/docs/#content"},inputPlaceholder:{replacement:"content",link:"/docs/#content"},html:{replacement:"content",link:"/docs/#content"},allowEscapeKey:{replacement:"closeOnEsc",onlyRename:!0,link:"/docs/#closeonesc"},allowClickOutside:{replacement:"closeOnClickOutside",onlyRename:!0,link:"/docs/#closeonclickoutside"}};}])});
  });

  var swal = unwrapExports(sweetalert_min);
  sweetalert_min.swal;

  const mutation = gql$1`
  mutation contact($input: ContactInput!) {
    contact(input: $input) {
      success
    }
  }
`;

  const useSubmitContact = () => {
    const [execute, { data, error, loading }] = useMutation(mutation);

    react_21(() => {
      if (error) {
        swal(error.message);
      }
      if (data && data.contact) {
        swal('Message sent!');
      }
    }, [error, data]);

    const handleSubmit = async (values) => {
      console.log('useSubmitContact.js');
      await execute({ variables: { input: values } });
    };

    return [handleSubmit, { data, error, loading }];
  };

  var hooks = { useSubmitContact };

  // export const Helpers = helpers;
  // export const Libs = libs;
  // export const Auth = auth;

  var main = { ...helpers, ...libs, ...auth, ...hooks };

  return main;

})));
//# sourceMappingURL=bundle.js.map
