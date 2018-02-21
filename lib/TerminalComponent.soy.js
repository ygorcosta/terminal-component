/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';

var templates;
goog.loadModule(function (exports) {
  var soy = goog.require('soy');
  var soydata = goog.require('soydata');
  // This file was automatically generated from TerminalComponent.soy.
  // Please don't edit this file by hand.

  /**
   * @fileoverview Templates in namespace TerminalComponent.
   * @public
   */

  goog.module('TerminalComponent.incrementaldom');

  var incrementalDom = goog.require('incrementaldom');
  var soyIdom = goog.require('soy.idom');

  /**
   * @param {Object<string, *>=} opt_data
   * @param {Object<string, *>=} opt_ijData
   * @param {Object<string, *>=} opt_ijData_deprecated
   * @return {void}
   * @suppress {checkTypes}
   */
  function $render(opt_data, opt_ijData, opt_ijData_deprecated) {
    opt_ijData = opt_ijData_deprecated || opt_ijData;
    incrementalDom.elementOpenStart('div');
    incrementalDom.attr('class', 'start-demo-console');
    incrementalDom.elementOpenEnd();
    incrementalDom.elementOpenStart('div');
    incrementalDom.attr('class', 'start-demo-banner');
    incrementalDom.elementOpenEnd();
    incrementalDom.elementOpenStart('div');
    incrementalDom.attr('class', 'start-demo-controls');
    incrementalDom.elementOpenEnd();
    incrementalDom.elementClose('div');
    incrementalDom.elementClose('div');
    incrementalDom.elementOpenStart('div');
    incrementalDom.attr('class', 'start-demo-content');
    incrementalDom.elementOpenEnd();
    incrementalDom.elementOpen('pre');
    incrementalDom.elementClose('pre');
    incrementalDom.elementClose('div');
    incrementalDom.elementClose('div');
  }
  exports.render = $render;
  if (goog.DEBUG) {
    $render.soyTemplateName = 'TerminalComponent.render';
  }

  exports.render.params = [];
  exports.render.types = {};
  templates = exports;
  return exports;
});

class TerminalComponent extends Component {}
Soy.register(TerminalComponent, templates);
export { TerminalComponent, templates };
export default templates;
/* jshint ignore:end */