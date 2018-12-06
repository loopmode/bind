/**
 * Binds component instance methods.
 *
 * Requires the component instance to be passed as first argument. Any additional arguments are optional and specify "matchers" for method/function names.<br/>
 *
 * - Any function on the instance with has a name that matches one of the arguments will be bound to the instance.
 * - The arguments may be either strings or regular expressions.
 * - The arguments will be flattened, so you can either pass them individually, or as one or more arrays.
 * - When called with just the instance as a single argument, the default matcher `/^handle/` will be used.
 *
 * @param {Object} component - the component instance
 * @param {...String|...RegExp} [matchKeys = [/^handle/]] - strings or regular expressions matching method names to bind
 */
export default function bind(component, ...matchKeys) {
    if (!matchKeys.length) {
        matchKeys = [/^handle/];
    }
    Object.getOwnPropertyNames(component.constructor.prototype).forEach(property => {
        if (matchKeys.some(matcher => property.match(matcher))) {
            component[property] = component[property].bind(component);
        }
    });
}
