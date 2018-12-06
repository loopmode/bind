# @loopmode/bind

A simple scope binding mechanism for javascript classes.

-   Takes a class instance and a "matcher" to bind class methods with matching names to the instance.
-   A matcher can be a string or a regular expression. Or a regular expression in a string - anything supported by `String.prototype.match`
-   You can pass any number of matchers, either as an array or as direct arguments to the `bind` function.

## Default matcher

Out of the box, the function will bind all methods that have a name starting with `handle`.

You are encouraged to use a naming convention like that (e.g. `handleClick`), because then you don't need to pass any arguments but the class instance itself:

```javascript
import bind from '@loopmode/bind';

export class Demo {
    constructor() {
        bind(this);
        window.addEventListener('click', this.handleClick);
    }
    handleClick(event) {
        console.log('handleClick', this, event);
    }
}
```

## Custom matchers

You can also pass additional arguments to specify custom matchers:

```javascript
import bind from '@loopmode/bind';

export class Demo {
    constructor() {
        bind(this, /^handle/, 'init');
    }
    init() {
        window.addEventListener('click', this.handleClick);
        window.addEventListener('change', this.handleChange);
    }
    destroy() {
        window.removeEventListener('click', this.handleClick);
        window.removeEventListener('change', this.handleChange);
    }
    handleClick(event) {
        console.log('handleClick', this, event);
    }
    handleChange(event) {
        console.log('handleChange', this, event);
    }
}

const demo - new Demo();
document.addEventListener('DOMContentLoaded', demo.init)
```

Some more examples:

```javascript
bind(this, /^on/); // match `onClick`, `onChange` etc, using RegExp object

bind(this, '^on'); // same as before, but with string regex

bind(this, 'on'); // string matcher, will match both `onClick` and e.g. `createBaboon`

bind(this, 'on$'); // Will match `createBaboon` but not `onClick`

bind(this, /^handle/, /^on/); // Will match all methods starting with `handle` or `on`, multiple arguments

bind(this, [/^handle/, /^on/]); // Same as before, but with a single array as argument

bind(this, [/^handle/, 'renderConfirmDialog']); // Typical real-world-case, match handlers but also some specific render method that gets injected into a child
```

## Custom wrapper

In case you do have a naming convention, but it's not `handle*`, you should create your own module with a wrapper function that provides the appropriate matcher, and use that - without passing extra arguments.<br/>
For example, if you typically use `onEvent` rather than `handleEvent`, your own `bind` module might export this wrapper function:

```javascript
import bind from '@loopmode/bind';
export default instance => bind(instance, /^on/);
```

## React components

You will not run into troubles with e.g. React components - lifecycle methods are not bound unless you defined an explicit matcher for that (e.g. `render` or `/^componentDid/` etc).

```javascript
import React from 'react';
import bind from '@loopmode/bind';

export class bind extends React.Component {
    state = {
        clickCount: 0
    };
    constructor(props) {
        super(props);
        bind(this);
    }
    render() {
        return <button onClick={this.handleClick}>click me</button>;
    }
    handleClick(event) {
        this.setState({ clickCount: this.state.clickCount + 1 });
    }
}
```
