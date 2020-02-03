# 2.0.0

- Enumerate `target.constructor.prototype` properties instead of `target.constructor.prototype.__proto__` again
- If target is plain object, enumerate its own properties instead of prototype
- Drop babel, use typescript

# 1.0.2

- Support class inheritance by enumerating `target.constructor.prototype.__proto__` instead of `target.constructor.prototype` properties

# 1.0.1

- Support `*` matcher for binding all methods
- Support function matchers
