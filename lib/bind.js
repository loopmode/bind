"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bind;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

/**
 * Binds object functions that match given conditions.
 *
 * Requires the component instance to be passed as first argument.
 * Any additional arguments are optional and specify "matchers" for method/function names.
 * A matcher can be either a string, regular expression, or function.
 *
 * @param {Object} target - the target object
 * @param {...(String|RegExp|Function)} [matchers = /^handle/] - Any number of matchers against which to check
 */
function bind(target) {
  for (var _len = arguments.length, matchers = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    matchers[_key - 1] = arguments[_key];
  }

  if (!matchers.length) {
    matchers = [/^handle/];
  } else {
    var _ref;

    // flatten arrays
    matchers = (_ref = []).concat.apply(_ref, (0, _toConsumableArray2.default)(matchers));
  }

  Object.getOwnPropertyNames(target.constructor.prototype.__proto__).forEach(function (property) {
    var isMatch = function isMatch(matcher) {
      if (matcher === '*') {
        return true;
      }

      if (typeof matcher === 'function') {
        return matcher(property);
      }

      if (property.match(matcher)) {
        return true;
      }
    };

    if (matchers.some(isMatch)) {
      target[property] = target[property].bind(target);
    }
  });
}