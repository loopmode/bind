"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any  */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default matcher for finding properties that should be bound.
 */
exports.DEFAULT_MATCHER = /(^handle([A-Z]|_).+|^on[A-Z])/;
/**
 * Returns names of the own properties of a given object.
 * Unless the object is a plain javascript object, the properties of its constructor prototype are returned.
 *
 * @param target any object
 */
function getTargetProperties(target) {
    if (target.constructor && target.constructor !== Object) {
        return Object.getOwnPropertyNames(target.constructor.prototype);
    }
    return Object.getOwnPropertyNames(target);
}
/**
 * Normalizes any number of given matchers or matcher arrays.
 * If no matchers are given, the default matchers are returned.
 *
 * @param matchers
 * @return A flattened array of matchers
 */
function normalizeMatchers() {
    var matchers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        matchers[_i] = arguments[_i];
    }
    if (!matchers.length) {
        // nothing provided, use default matcher
        return [exports.DEFAULT_MATCHER];
    }
    else {
        // flatten any provided arrays
        return [].concat.apply([], matchers);
    }
}
/**
 * Checks if a given target property should be bound or not.
 *
 * @param matcher - a matcher pattern or function
 * @param target - the target object
 * @param property - the name of target property
 * @return `true` if the target property is a function and passes the matcher, `false` otherwise
 */
function shouldBind(matcher, target, property) {
    if (!property) {
        return false;
    }
    if (typeof target[property] !== 'function') {
        return false;
    }
    if (matcher === '*') {
        return true;
    }
    if (typeof matcher === 'function') {
        return matcher(property, target);
    }
    return property.match(matcher);
}
/**
 * Binds the scope of an object's functions to that object if the function names match given conditions.
 *
 * - The first argument is required and should be the target object (e.g. a class instance).
 * - Any additional arguments are optional and specify the "matchers" for method/function names.
 *
 * A matcher can be one of these types:
 * - `*` will match all functions
 * - a `string` or `RegExp` matcher will be matched against the name of the function property
 * - a `function` matcher will be invoked with the name of the function property and should return a boolean
 *
 * If you do not pass any matchers, the `DEFAULT_MATCHER` regular expression matcher is used:
 * - either the function name starts with `"on"` and continues with an uppercase letter, e.g. `"onClick"`
 * - or it starts with `"handle"` and continues with an uppercase letter or an underscore, e.g. `"handleClick"`, `"handle_click"`
 *
 * @param {Object} target - the target object
 * @param {...(String|RegExp|Function)} [matchers = /^handle/] - Any number of matchers against which to check
 *
 * @example
 * ```js
 * // default naming and matcher
 * class MyClass {
 *  constructor() {
 *    this.count = 0;
 *    bind(this);
 *    setTimeout(this.handleInterval, 1000);
 *  }
 *  handleInterval() {
 *    this.count += 1;
 *    console.log(this.count);
 *  }
 * }
 * ```
 *
 * @example
 * ```js
 * // custom naming and matcher
 * class MyComponent extends React.Component {
 *  state = { clicked: 0, scrolled: 0 };
 *  componentDidMount() {
 *    bind(this, /Handler$/);
 *    window.addEventListener('click', this.clickHandler);
 *    window.addEventListener('scroll', this.scrollHandler);
 *  }
 *  scrollHandler() {
 *    this.setState({ scrolled: this.state.scrolled + 1 });
 *  }
 *  clickHandler() {
 *    this.setState({ clicked: this.state.clicked + 1 });
 *  }
 *  render() {
 *    return <div>scrolled: {this.state.scrolled}, clicked: {this.state.clicked}</div>
 *  }
 * }
 * ```
 */
function bind(target) {
    var matchers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        matchers[_i - 1] = arguments[_i];
    }
    var normalizedMatchers = normalizeMatchers.apply(void 0, matchers);
    getTargetProperties(target).forEach(function (property) {
        var isMatch = normalizedMatchers.some(function (matcher) {
            return shouldBind(matcher, target, property);
        });
        if (isMatch) {
            target[property] = target[property].bind(target);
        }
    });
}
exports.default = bind;
