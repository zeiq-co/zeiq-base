(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.zeiqCore = factory());
}(this, (function () { 'use strict';

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

  const useSubmitContact = () => {
    console.log('useSubmitContact.js');
    return [];
  };

  var hooks = { useSubmitContact };

  // export const Helpers = helpers;
  // export const Libs = libs;
  // export const Auth = auth;

  var main = { ...helpers, ...libs, ...auth, ...hooks };

  return main;

})));
//# sourceMappingURL=bundle.js.map
