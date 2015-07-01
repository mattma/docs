# [React CheatSheet](http://ricostacruz.com/cheatsheets/react.html)

[React Fiddle](http://jsfiddle.net/reactjs/69z2wepo/)

1. ReactComponent

```js
var Component = React.createClass({
  render: function () {
    return <div>Hello {this.props.name}</div>;
  }
});
React.render(<Component name="John" />, document.body);
```

```js
var Component = React.createClass({
  // a components expected usage
  propTypes: {},
  // external behaviours the component is using/dependent on
  mixins : [],

  getInitialState: function() {},
  getDefaultProps: function() {},

  // life-cycle methods, occur before an instance of the component is created (e.g. getInitialState, getDefaultProps)
  // occur during the mounting/updating/mounted cycle (e.g. componentWillMount, shouldComponentUpdate)
  componentWillMount : function() {},
  componentWillReceiveProps: function() {},
  componentWillUnmount : function() {},

  // custom methods and be prefixed with an underscore
  // ex: utility (parsers, event handlers, etc)
  _parseData : function() {},
  _onSelect : function() {},

  // a mandatory lifecycle method
  render : function() {}
})
```

2. [Nest components to separate concerns](http://facebook.github.io/react/docs/multiple-components.html)

```js
var Info = React.createClass({
  render: function() {
    return (
      <div>
        <UserAvatar  username={this.props.username} />
        <UserProfile username={this.props.username} />
      </div>);
  }
});
```

3. States & Properties

* Use props (this.props) to access parameters passed from the parent
* Use states (this.state) to manage dynamic data.

```js
<MyComponent fullscreen={true} />

// props
this.props.fullscreen //=> true

// state
this.setState({ username: 'matt' });
this.replaceState({ ... });
this.state.username //=> 'matt'

render: function () {
  return (
    <div class={this.props.fullscreen ? 'full' : ''}>
        Welcome, {this.state.username}
    </div>);
}

//Setting defaults: Pre-populates this.state.comments and this.props.name.
React.createClass({
  getInitialState: function () {
    return { comments: [] };
  },

  getDefaultProps: function () {
    return { name: "Hello" };
  }
);
```

4. [Component API](http://facebook.github.io/react/docs/component-api.html): These are methods available for Component instances

```js
React.findDOMNode(c);  // 0.13+
c.getDOMNode();           // 0.12 below

c.forceUpdate()
c.isMounted()

c.state
c.props

c.setState({ ... })
c.replaceState({ ... })

c.setProps({ ... })       // for deprecation
c.replaceProps({ ... })   // for deprecation

c.refs
```

[Component specs](http://facebook.github.io/react/docs/component-specs.html): Methods and properties you can override.

```js
render()
getInitialState()
getDefaultProps()
mixins: [ /*...*/ ] // Mixins. http://ricostacruz.com/cheatsheets/react.html#mixins
propTypes: { /*...*/ }  // Validation. http://ricostacruz.com/cheatsheets/react.html#property-validation
statics: { /*...*/ }   // Static methods
displayName: "..."     // Automatically filled by JSX
```

5. Lifecycle

- [Mounting](http://facebook.github.io/react/docs/component-specs.html#mounting-componentwillmount): Before initial rendering occurs. Add your DOM stuff on `didMount` (events, timers, etc).

```js
componentWillMount()   // Before rendering (no DOM yet)
componentDidMount()   // After rendering
```

- [Updating](http://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops): Called when parents change properties and `.setState()`. These are not called for initial renders.

```js
componentWillReceiveProps(newProps={})    // Use setState() here
shouldComponentUpdate(newProps={}, newState={})   // Skips render() if returns false
componentWillUpdate(newProps={}, newState={})   // Can’t use setState() here
componentDidUpdate(prevProps={}, prevState={})   // Operate on the DOM here
```

- [Unmounting](http://facebook.github.io/react/docs/component-specs.html#unmounting-componentwillunmount): Clear your DOM stuff here (probably done on didMount).

```js
componentWillUnmount()   // Invoked before DOM removal
```

Example: loading data. Initial data: http://facebook.github.io/react/tips/initial-ajax.html

```js
React.createClass({
  componentWillMount: function () {
    $.get(this.props.url, function (data) {
      this.setState(data);
    }.bind(this));
  },

  render: function () {
    return <CommentList data={this.state.data} />
  }
});
```

6. DOM nodes

- [References](http://facebook.github.io/react/docs/more-about-refs.html): Allows access to DOM nodes.

```js
<input ref="myInput">

this.refs.myInput
React.findDOMNode(this.refs.myInput).focus()
React.findDOMNode(this.refs.myInput).value
```

- [DOM Events](https://facebook.github.io/react/docs/events.html): Add attributes like `onChange`.

```js
<input type="text"
    value={this.state.value}
    onChange={this.handleChange} />

handleChange: function(event) {
  this.setState({ value: event.target.value });
}
```

- [Two-way binding via `LinkedStateMixin`](http://facebook.github.io/react/docs/two-way-binding-helpers.html)

```js
Email: <input type="text" valueLink={this.linkState('email')} />

React.createClass({
  mixins: [React.addons.LinkedStateMixin]
});

this.state.email
```

7. [Property validation](http://facebook.github.io/react/docs/reusable-components.html#prop-validation)

- Primitive types: `.string`, `.number`, `.func`, and `.bool`

```js
React.createClass({
  propTypes: {
    email:      React.PropTypes.string,
    seats:      React.PropTypes.number,
    callback:   React.PropTypes.func,
    isClosed:   React.PropTypes.bool,
    any:        React.PropTYpes.any,
  }
});
```

- Required types: Add `.isRequired`

```js
propTypes: {
  requiredFunc:  React.PropTypes.func.isRequired,
  requiredAny:   React.PropTypes.any.isRequired
}
```

- React elements:  Use `.element`, `.node`

```js
propTypes: {
  element:  React.PropTypes.element,  // react element
  node: React.PropTypes.node   // num, string, element
  // ...or array of those
}
```

- Enumerables:  Use `.oneOf`, `.oneOfType`

```js
propTypes: {
  enum: React.PropTypes.oneOf(['M','F']),  // enum
  union:  // any
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
}
```

- Arrays and objects: Use `.array[Of]`, `.object[Of]`, `.instanceOf`, `.shape`

```js
propTypes: {
  array:    React.PropTypes.array,
  arrayOf:  React.PropTypes.arrayOf(React.PropTypes.number),

  object:   React.PropTypes.object,
  objectOf: React.PropTypes.objectOf(React.PropTypes.number),

  message:  React.PropTypes.instanceOf(Message),

  object2:  React.PropTypes.shape({
    color:  React.PropTypes.string,
    size:   React.PropTypes.number
  })
}
```

- Custom validation:  Supply your own function.

```js
propTypes: {
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error('Validation failed!');
    }
  }
}
```

8. Other features

- Class set: Manipulate DOM classes with [classnames](https://www.npmjs.com/package/classnames), previously known as [React.addons.classSet](http://facebook.github.io/react/docs/class-name-manipulation.html)

```js
var cx = require('classnames');

render: function() {
  var classes = cx({
    'message': true,
    'message-important': this.props.isImportant,
    'message-read': this.props.isRead
  });

  return <div className={classes}>Great Scott!</div>;
}
```

- [Propagating properties](http://facebook.github.io/react/docs/transferring-props.html)

```js
<VideoPlayer src="video.mp4" />

var VideoPlayer = React.createClass({
  render: function() {
    /* propagates src="..." down to this sub component */
    return <VideoEmbed {...this.props} controls='false' />;
  }
});
```

- [mixins: addons for built-in mixins](https://facebook.github.io/react/docs/addons.html)

```js
var SetIntervalMixin = {
  componentWillMount: function() { .. }
}

var TickTock = React.createClass({
  mixins: [SetIntervalMixin]
}
```

9. [Top level API](https://facebook.github.io/react/docs/top-level-api.html)

```js
React.findDOMNode(c) // 0.13+
React.createClass({ ... })

React.render(<Component />, domnode, [callback])
React.unmountComponentAtNode(domnode)

React.renderToString(<Component />)
React.renderToStaticMarkup(<Component />)

React.isValidElement(c)
```

10. JSX patterns

- [Style shorthand](https://facebook.github.io/react/tips/inline-styles.html)

```js
var style = { backgroundImage: 'url(x.jpg)', height: 10 };
return <div style={style}></div>;
```
- [InnerHTML](https://facebook.github.io/react/tips/dangerously-set-inner-html.html)

```js
function markdownify() { return "<p>...</p>"; }
<div dangerouslySetInnerHTML={{__html: markdownify()}} />
```

- Lists

```js
var TodoList = React.createClass({
  render: function() {
    function item(itemText) {
      return <li>{itemText}</li>;
    };
    return <ul>{this.props.items.map(item)}</ul>;
  }
});
```

- [Animation](http://facebook.github.io/react/docs/animation.html)
