(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zeiqCore = {}));
}(this, (function (exports) { 'use strict';

  // import utils from './utils/index';
  const cl = (text) => {
    console.log(text);
  };

  const Helpers = { cl };

  exports.Helpers = Helpers;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
