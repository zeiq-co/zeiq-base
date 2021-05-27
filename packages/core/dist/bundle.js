(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zeiqBase = {}));
}(this, (function (exports) { 'use strict';

  const cl = (text) => {
    console.log(text);
  };

  var helpers = { cl };

  var index = { helpers };

  exports.utils = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
