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
export default function bind(target, ...matchers) {
    if (!matchers.length) {
        matchers = [/^handle/];
    } else {
        // flatten arrays
        matchers = [].concat(...matchers);
    }
    Object.getOwnPropertyNames(target.constructor.prototype).forEach(property => {
        const isMatch = matcher => {
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
