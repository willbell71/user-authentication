/* setup.js */

const {JSDOM} = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const {window} = jsdom;

/**
 * copyProps.
 * @param {*} src - src.
 * @param {*} target - target.
 */
function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target)
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
global.requestAnimationFrame = function(callback) {};
global.cancelAnimationFrame = function(id) {};
copyProps(window, global);
