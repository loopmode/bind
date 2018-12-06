"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bind;

/**
 * Binds component instance methods.
 * Requires the component instance to be passed as first argument.
 * Any additional arguments are optional and specify "matchers" for instance method names.
 * Any instance method that has a name matching one of the arguments will be bound to the instance.
 * The arguments may be strings or regular expressions.
 *
 * When only the component instance is passed, all methods that start with `handle` will be bound.
 *
 * @param {Object} component - the component instance
 * @param {...String|RegExp} matchKeys - strings or regular expressions matching method names to bind
 */
function bind(component) {
  for (var _len = arguments.length, matchKeys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    matchKeys[_key - 1] = arguments[_key];
  }

  if (!matchKeys.length) {
    matchKeys = [/^handle/];
  }

  Object.getOwnPropertyNames(component.constructor.prototype).forEach(function (property) {
    if (matchKeys.some(function (matcher) {
      return property.match(matcher);
    })) {
      component[property] = component[property].bind(component);
    }
  });
}