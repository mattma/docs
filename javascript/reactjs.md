# React

A UI library with the creation of interactive, stateful and reusable UI components.

#### Benefits

* one-way data flow
* easy component lifecycle methods
* declarative components
* Isomorphic Javascript: Run one codebase on client and server (This is the concept behind frameworks like Rendr, Meteor & Derby.)
* Virtual DOM: top-down rendering. selectively renders subtrees of nodes based upon state changes. It does the least amount of DOM manipulation possible in order to keep your components up to date.

#### Single responsibility principle

Single responsibility principle states that every class should have responsibility over a single part of the functionality provided by the software, and that responsibility should be entirely encapsulated by the class. All its services should be narrowly aligned with that responsibility.

In a React application, you should break down your site, page or feature into smaller pieces of components, using component-driven development. The goal is to have everything in one place, single responsibility. It makes a component extremely flexible and reusable.

#### React way

1. Component

View-part of the MVC. The primary building block. Component attaches event handlers and binds the data contained in `props` and `state`. If a component need to change:

* if it is the component's parent, parent could change its props, and render its child.
* if it is the component's self, independently of its parent (due to other events), it has to use `state`.
* Avoid using `state` inside component

2. props & state: both are perperties

For data that’s relevant only to the view and nothing else, use `state`.
For any data that’s pertinent to the class but not the view itself, use `props`.
Data will flow in one direction. React transform the model into UI and handle the event.

props \
           => re-render => DOM (model+component, trigger "events" back to `state`)
state  /

* props (cannot change/immutable)

Component maintains an immutable property and supplied as attributes.
Props is designed to pass in from parent component to the child componment as a static/immutable value or a method.
Props cannot be changed, has to push to state and change state.

Any changes to a prop variable will trigger an automatic re-render of the appropriate portion of the view (both parent and child). Those changes can come from within the view itself, or from the parent view, or any child views that our view has. It allows us to pass around some data between various views and have it all stay in sync.

* state (can change/mutable)

Represents the user-driven state of the UI. State is maintained/updated by the component.
State contains the internal data store (object) of a component (internal changes to the view), should be kept to a minimum, managed by a common ancestor.

Just like props, any changes to state will trigger a re-render of the appropriate elements in the view, with one condition: you have to call the `setState` method. Always use `setState` Without it, your changes won’t be reflected on your view.

`getInitialState` function is required when using internal state to indicates to the view what the initial state should be. Make sure to include this function even if your state is empty to begin with; an empty state is still a state.

## JSX

JSX is not a template language. It is an alternate JavaScript syntax and a XML-like syntax extension to ECMAScript. Each element is transformed into a javascript function call. For [details](http://snip.ly/7DTB#https://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components).

It allows us to write HTML like syntax which gets transformed to lightweight JavaScript objects. Because JSX is not supported in browsers by default we have to compile it to JS. Here is an [Online JSX compiler](https://facebook.github.io/react/jsx-compiler.html)

```js
// case 1:
// ComponentName(ex: "Hello") become javascript function call with the same name.
// the content of the component become the 2nd argument of function
var jsx = <Hello> content </Hello>;
// convert to valid javascript code
var jsx = Hello(null, "content");

// case 2:
// if Component contain attributes. Jsx converts it into javascript object. become the first argument of the functon call.
var jsx = <Component att1="a" att2="b"> content </Component>;
// convert to valid javascript code
var jsx = Component({att1: "a", att2: "b"}, "content");

// case 3:
// if Component contain nested element. Nested element recursively compile into javascript functions
// become the additonal argument to the parent functon.
var jsx = <Component att1="a" att2="b"> <Inner /> </Component>;
// convert to valid javascript code
var jsx = Component({att1: "a", att2: "b"}, Inner(null) );
```

```js
// The braces let us use plain JavaScript
var Name = React.createClass({
  render: function () {
    return (
      <ul>{ this.props.names.map(function(name){
          return <li key={name.id}><p>Hello {name.first}</p></li>
        }) }</ul>
    );
  }
});
var names = [{id: 1, first: 'matt'}, {id: 2, first: 'kelly'}];
React.render(<Name names={names} />, document.body);
```

- `React.DOM`

It gives you a bunch of factories for HTML elements. `React.createFactory` is just a helper that binds your component class to `React.createElement` so you can make your own factories. Unfortunately, you'll then have to juggle two things as sometimes you need the class vs. the factory.

```js
// if HTML5 elements
<div id="greeting-container" className="container">
  <Greeting name="World"/>
</div>

React.createElement(
  "div",
  {id: "greeting-container", className: "container"},
  React.createElement(Greeting, {name: "World"})
)
```

```js
var Greeting = React.createFactory(GreetingClass);
React.render(
  React.DOM.div(
    {id: "greeting-container", className: "container"},
    Greeting({name: "World"})
  ),
  document.body
);
```

## [Virtual Dom Terminology](https://gist.github.com/sebmarkbage/fcb1b6ab493b0c77d589#file-react-terminology-md)

A JavaScript representation of the actual DOM and rebuild full HTML5 element implementation of the DOM in lightweight javascript object. Instead of constructing a physical DOM directly from a template file/script/function, the Component generates an intermediate DOM that is a stand-in for the real HTML DOM. An additional step is then taken to translate this intermediate DOM into the real HTML DOM. It is independent of browser, Whenever the state is changed, React create a Virtual DOM tree, it diff the current state of Virtual DOM(computed after some data changes) and previous state(computed befores some data changes),  then compare changes and only applies the difference. It uses components over templates.

#### [React's diff algorithm](http://calendar.perfplanet.com/2013/diff/)

Tree representation of the DOM and re-calculates all subtrees when its’ parent got modified (marked as dirty), you should be aware of your model changes, because the whole subtree will be re-rendered then. React's rendered HTML markup contains data-reactid attributes, which helps React tracking DOM nodes.

- React observer model

React uses an observer model instead of dirty checking (continuous model checking for changes). so it doesn't have to calculate what is changed, it knows immediately, then React builds the tree representation of the DOM in the memory and calculates which DOM element should change. React tries to keep as much DOM elements untouched as possible.

(1) signal to notify our app some data has changed via `setState())`.
(2) causing re-render virtual DOM.
(3) React runs a "diffing" algorithm on previous virtual DOM with new virtual DOM. (identifies what has changed)
(4) put the minimal set of DOM mutations in a queue
(5) Batch exectutes all updates at once. Only update real DOM with necessary changes via reconciliation (updates the DOM with the results of diff)

The result of render is not an actual DOM node, is a lightweight JavaScript objects, called Virtual DOM. React use it to find the minimum number of steps to go from the previous render to the next.

Finding the minimal number of modifications between two arbitrary trees is a `O(n^3)` problem. But React uses `O(n)`. React only tries to reconcile trees level by level. This drastically reduces the complexity and isn’t a big loss as it is very rare in web applications to have a component being moved to a different level in the tree.

1. component

A React app is usually composed of many user defined components that eventually turns into a tree composed mainly of divs. This additional information is being taken into account by the diff algorithm as React will match only components with the same class.

Ex: if a `<Header />` is replaced by an `<ExampleBlock />`, React will remove the header and create an example block. We don’t need to spend precious time trying to match two components that are unlikely to have any resemblance.

2. Rendering

Component has required pure `render` function(f), take data(d) and produce Virtual DOM(v).

```js
f(d) //=> v   // same data in, always same view out
f(d) //=> v+  // different data in (represented by `+`), get different view out

diff(v, v+) // => changes // compare previous virtual DOM, and compute mininal different change
diff(v+, v) // => undo // go back in time, get "undo" for free
```

- Batching

When `setState` is called on a component, React will mark it as dirty. At the end of the event loop, React looks at all the dirty components and re-renders them. This batching means that during an event loop, there is exactly one time when the DOM is being updated.

- Sub-tree Rendering

When `setState` is called, the component rebuilds the Virtual DOM for its children. If you call `setState` on the root element, then the entire React app is re-rendered. All the components, even if they didn’t change, will have their `render` method called. This may sound scary and inefficient but in practice, this works fine because we’re not touching the actual DOM.

You usually don’t call `setState` on the root node every time something changes. You call it on the component that received the change event or couple of components above. You very rarely go all the way to the top. This means that changes are localized to where the user interacts.

- Selective Sub-tree Rendering

prevent some sub-trees to re-render. If you implement the following method on a component: `boolean shouldComponentUpdate(object nextProps, object nextState)`, based on the previous and next props/state of the component, you can tell React that this component did not change and it is not necessary to re-render it. When properly implemented, this can give you huge performance improvements. But keep in mind this function is going to be called all the time, so make sure that it takes less time to compute than heuristic than the time it would have taken to render the component, even if re-rendering was not strictly needed.

#### React's terminology, there are five core types that are important to distinguish

1. ReactElement

The primary type in React is the `ReactElement`. A ReactElement is a light, stateless, immutable, virtual representation of a DOM Element. It is a virtual DOM.
It has four properties: `type`, `props`, `key` and `ref`. It has no methods and nothing on the prototype.

```js
// create one of these object thouth `React.createElement`
var root = React.createElement('div');
```

To render a new tree into the DOM, pass `ReactElements` (here: root) to `React.render` along with a regular DOM `Element` (`HTMLElement` or `SVGElement`).

```js
React.render(root, document.body);
```

To add properties/attribuets to a DOM element, pass a properties object as the 2nd argument and children to the 3rd argument.

```js
var child = React.createElement('li', null, 'Text Content');
var root = React.createElement('ul', { className: 'my-list' }, child);
React.render(root, document.body);
```

If you use React JSX, then these `ReactElements` are created for you. So this is equivalent:

```js
var root = <ul className="my-list"> <li>Text Content</li> </ul>;
React.render(root, document.body);
```

2. ReactElement Factory

A ReactElement-factory is simply a function that generates a `ReactElement` with a particular `type` property. React has a built-in helper for you to create factories. It's effectively just from original React source code:

```js
// create a convenient short-hand instead of typing out `React.createElement('div')` all the time.
function createFactory(type){
  return React.createElement.bind(null, type);
}

// usage:
var div = React.createFactory('div');
var root = div({ className: 'my-div' });
React.render(root, document.body);
```

React already have built-in factories for common HTML tags:

```js
var root = React.DOM.ul(
    { className: 'my-list' },
    React.DOM.li(null, 'Text Content')
);
```

If you are using JSX you have no need for factories. JSX already provides a convenient short-hand for creating ReactElements.

3. React Nodes

A ReactNode can be either: `ReactElement`, `string (aka ReactText)`, `number (aka ReactText)`, `Array of ReactNodes (aka ReactFragment)`

These are used as properties of other `ReactElements` to represent children. Effectively they create a tree of `ReactElements`.

4. React Components
5. React Component Class

use `ReactComponents` to create encapsulations with embedded state. A `ReactComponent` Class is simply just a JavaScript class (or "constructor function"). When this constructor is invoked it is expected to return an object(aka ReactComponent) with at least a `render` method on it.

```js
// MyComponent  is the ReactComponent
var MyComponent = React.createClass({
  render: function() { }
});
```

Other than for testing, you would normally never call this constructor yourself. React calls it for you. Instead, you pass the `ReactComponent` Class to `createElement` you get a `ReactElement`.

```js
// Javscript way
var element = React.createElement(MyComponent);
// JSX way
var element = <MyComponent />;
```

When this is passed to `React.render`, React will call the constructor for you and create a `ReactComponent`, which returned.

```js
var component = React.render(element, document.body);
```

If you keep calling `React.render` with the same type of `ReactElement` and the same container DOM Element it always returns the same instance. This instance is stateful.

```js
var componentA = React.render(<MyComponent />, document.body);
var componentB = React.render(<MyComponent />, document.body);
componentA === componentB; // true
```

This is why you shouldn't construct your own instance. Instead, `ReactElement` is a virtual `ReactComponent` before it gets constructed. An old and new `ReactElement` can be compared to see if a new `ReactComponent` instance is created or if the existing one is reused.

The `render` method of a `ReactComponent` is expected to return another `ReactElement`. This allows these components to be composed. Ultimately the render resolves into `ReactElement` with a string tag which instantiates a DOM Element instance and inserts it into the document.

- Formal Type Definitions

```js
// Entry Point
React.render(ReactElement, HTMLElement | SVGElement)  // => ReactComponent;
```

```js
// Nodes and Elements
ReactNode = ReactElement | ReactFragment | ReactText;

ReactElement = ReactComponentElement | ReactDOMElement;

ReactDOMElement = {
  type : string,
  props : {
    children : ReactNodeList,
    className : string,
    etc.
  },
  key : string | boolean | number | null,
  ref : string | null
};

ReactComponentElement<TProps> = {
  type : ReactClass<TProps>,
  props : TProps,
  key : string | boolean | number | null,
  ref : string | null
};

ReactFragment = Array<ReactNode | ReactEmpty>;

ReactNodeList = ReactNode | ReactEmpty;

ReactText = string | number;

ReactEmpty = null | undefined | boolean;
```

```js
// Classes and Components
ReactClass<TProps> = (TProps) => ReactComponent<TProps>;

ReactComponent<TProps> = {
  props : TProps,
  render : () => ReactElement
};
```

#### Events

React has a built in cross browser events system. The events are attached as properties of components and can trigger methods.
ex:  `onClick`, `onSubmit`, `onChange`

- `onChange`

It is a React thing and it will call whatever method you specify every time the value in the input box changes.

Ex: User type into the input box → callback is invoked → the state of our component is set to a new value → React re-renders the virtual DOM → React Diffs the change → Real DOM is updated

- Event Delegation

A single event listener is attached to the root of the document. When an event is fired, the browser gives us the target DOM node. In order to propagate the event through the DOM hierarchy, React doesn’t iterate on the virtual DOM hierarchy. every React component has a unique id that encodes the hierarchy. We can use simple string manipulation to get the id of all the parents. By storing the event listeners in a hash map, we found that it performed better than attaching them to the virtual DOM. Here is an example of what happens when an event is dispatched through the virtual DOM.

```js
// dispatchEvent('click', 'a.b.c', event)
clickCaptureListeners['a'](event);
clickCaptureListeners['a.b'](event);
clickCaptureListeners['a.b.c'](event);
clickBubbleListeners['a.b.c'](event);
clickBubbleListeners['a.b'](event);
clickBubbleListeners['a'](event);
```

The browser creates a new event object for each event and each listener. This has the nice property that you can keep a reference of the event object or even modify it. However, this means doing a high number of memory allocations. React at startup allocates a pool of those objects. Whenever an event object is needed, it is reused from that pool. This dramatically reduces garbage collection.

## Components

Component is self contain units of functionality. It publishs a simple interface, define its input as property, output as a callback. It can be freely nested inside each other. Responsible to render contents of the component and handle any events which called in it.

Components composes the UI of your application by assembling a tree of Components. Every component is required to have a `render` method because render is essentially the template for our component. Rendering a component means linking it to a DOM element and populating that DOM element. Each Component (correspond each element in the DOM) provides an implementation via `render()` method, where it creates the intermediate-DOM. Calling `React.render()` on the root Component results in recursively going down the Component-tree and building up the intermediate-DOM. The intermediate-DOM is then converted into the real HTML DOM.

Every component has a `state` object and a `props` object. To set an initial state before any interaction occurs, use the `getInitialState` method. Calling `setState` set the new state and triggers UI updates.

If you have a multi component hierarchy, a common parent component should manage its own state and pass it down to its children components via "props".

Three ways to render a component on the page, via JSX or Javascript

```js
// Rendering on the page and JSX only allow one element. Native JSX
var App = React.createClass({
  render: function () {
    return <h1>Hello world</h1>
  }
});
React.render(<App />, document.body);

// Rendering on the page. Native Javascript
var App = React.createClass({
  render: function () {
    return React.createElement("h1", null, "yo");
  }
});
React.render(React.createElement(App), document.body);

// or ...

var App = React.createClass({
  render: function () {
    return React.DOM.h1(null, "hi there");
  }
});
React.render(App(), document.body);
```

#### Transient state

Component manage its own state rather than maintaining it externally. To make it stateful, we need to use two things. 1. `getInitialState()` provide an initial state for the component, and 2.`setState()` change the state of the component. Any time we call `setState()`, (it's asynchronous method) a re-render will automatically occur when React decides it's ready. In modern browsers, this will generally happen no less than 1/60 of a second later. (Modern browsers render 60 times per second, and React hooks into this via `requestAnimationFrame`)

- Receiving State from Parent Component (props, propTypes, getDefaultProps)

`props` is the data which is passed to the child component from the parent component. This allows for React architecture to stay pretty straight forward. Handle state in the highest parent component which needs to use the specific data, and if you have a child component that also needs that data, pass that data down as props.

Note: the code that gets returned from `render()` is a representation of what the real DOM should look like.

**It’s important to understand that wherever the data lives, is the exact place you want to manipulate that data. This keeps it simple to reason about your data. All getter/setter method for a certain piece of data will always be in the same component where that data was defined. If you needed to manipulate some piece of data outside where the data lives, you’d pass the getter/setter method into that component as props.**

- State and Props methods: Specs. Predefined View Functions

1. getInitialState()

Allow a component to populate its initial state. should return an object. Return value is the initial value for state.

2. getDefaultProps()

Sets fallback props values if props aren’t supplied. allow you to specify a default (or a backup) value for certain props just in case those props are never passed into the component, always return an Object. Each key would be the property name.

specifies property values to use if they are not explicitly supplied, if defined, would override the existing and also establish some validation rules on these props using `propTypes`. works like `getInitialState()`

If a component depends on some specific property, there are two ways which could be set. 1) by JSX attribute, or an object returned by `getDefaultProps` method.

3. setState()

update/alert the state of a component, **merges** the new state with the old state (marked dirty). allow modify the state.

As a rule of thumb, to update state, always use `setState`, ex: `this.setState({ foo: “bar” })`

4. forceUpdate()

force your component to re-render, never need to use it. This is a convenience method to force a rerender of the view. It’s useful for instances where you’re updating some variables inside your view that aren’t part of props or state.

5. propTypes: {}

allow you to control the presence, or types of certain props passed to the child component. With `propTypes` you can specify that certain props are required or that certain props be a specific type.

6. mixins: []

An array of objects, used to extend the current component’s functionality. React uses Mixin to extract reusable pieces of behavior that can be injected into disparate Components.

7. render()

What we would like our HTML Template to look like.

8. renderToString()

Isomorphic applications.

9. ref

When you create the intermediate-DOM in `render()`, you can also assign a `ref` attribute to a child component or `React.DOM` component. You can access the element from the parent using the `refs` property via `this.refs.<elementName>`. So It provide a way to reference owned components.

```js
componentDidMount: function () {
    // update the input element value to "set by ref"
    this.refs.inp.getDOMNode().value = "set by ref";
},
render: function() {
    // can dynamically set the value of this input element
    return <input type="text" ref="inp" />
}
```

10. getDOMNode()

get the underlying DOM node from a React component instance.

11. propTypes

assign property type, defined if it is required or not

```js
propTypes: {
  txt: React.PropTypes.string,
  cat: React.PropTypes.number.isRequired
}
```

#### [Component Life Cycle](http://facebook.github.io/react/docs/component-specs.html)

- Mounted - Update - Unmounted states

Each component have its own lifecycle events. For example, make an ajax request on the initial render and fetch some data, or run some logic whenever our props changed.

The Component comes to life after being `Mounted`. Mounting results in going through a render-pass that generates the component-tree (intermediate-DOM). This tree is converted and placed into a container-node of the real DOM.

Once mounted, the component stays in the `Update` state. A component gets updated when you change state using `setState()` or change props using `setProps()`. This in turn results in calling `render()`, which brings DOM in sync with the data (props + state). Between subsequent updates, React will calculate the delta between the previous component-tree and the newly generated tree.

The final state is `Unmounted`. This happens when you explicitly call `React.unmountAndReleaseReactRootNode()` or automatically if a component was a child that was no longer generated in a `render()` call.

This pattern is useful for listening to events. (it's how Flux works) Just listen to the event when the component is mounted. Set the state when the event happens, and the component gets re-rendered. Clean up before the component is unmounted.

```js
// Component Life Cycle
var FriendsContainer = React.createClass({
  getInitialState: function(){
    return { name: 'Tyler McGinnis' }
  },
  // Invoked once before first render
  componentWillMount: function(){
      // Calling setState here does not cause a re-render
  },
  // Invoked once after the first render
  componentDidMount: function(){
      // You now have access to this.getDOMNode()
  },
  // Invoked whenever there is a prop change Called BEFORE render
  componentWillReceiveProps: function(nextProps){
      // Not called for the initial render
      // Previous props can be accessed by this.props
      // Calling setState here does not trigger an additional re-render
  },
  // Called IMMEDIATELY before a component is unmounted
  componentWillUnmount: function(){},
  // render method only allow to have a single node.
  render: function(){
    return<div> Hello, {this.state.name} </div>;
  }
});
React.render(<FriendsContainer />, document.body);
```

`componentWill*` methods are called before the state change
`componentDid*` methods are called after.

1. componentWillMount

Invoked once on both client and server before the initial render. If call `setState` here, no re-render would be invoked. For example: set up your reference to a database since it’s only invoked once on the initial render.

It is called when the view is added to the parent view. It’s fired every time this happens, so it’s a good candidate for doing some initial setup of your view, or for hooking up event handlers and such.

2. componentDidMount

Invoked once only on the client after the initial render occurs or when a component is mounted on the client. Because the component has already been invoked when this method is invoked, you have access to the virtual DOM via `this.getDOMNode()`. For example, make AJAX requests in `componentWillMount`, but facebook recommend do in `componentDidMount`. So this is the lifecycle event where you’ll be making your AJAX requests to fetch some data.

3. componentWillReceiveProps( nextProps )   // @param object

It is not called on the initial render, is called whenever there is a change to `props`. Use it to react to a prop change before `render()` is called by updating the state with `setState()`.

4. componentWillUnmount

It is invoked immediately before a component is unmounted from DOM. This is where do necessary clean up. For example, clean up database reference.

It is opposite of componentWillMount. Fired when the view is no longer rendered in a parent. Useful for unhooking event handlers.

5. shouldComponentUpdate(nextProps, nextState):  // @param object, object.

useful if you want to control when a render should be skipped. Return value determines whether component should update. Used it to squeeze out some performance.

6. componentWillUpdate(nextProps, nextState):  // @param object, object

7. componentDidUpdate(nextProps, nextState):  // @param object, object








React is a library for creating UI and renders your UI and responds to events, V in MVC. React component is a highly cohesive building block for UIs losely coupled with other components. To use components to separate your concerns, with the full power of javascript, not a crippled templating language. Components are reusable, composable. Only put display logic in your components.

Design decision: Re-render the whole app on every update. The main problem in software business: data changing over time is the root of all evil.

React components are basically just idempotent functions. They describe your UI at any point in time, just like a server-rendered app. Re-rendering on every change, so every place data is displayed is guaranteed to be up-to-date, no data-binding, no model dirty checking, no more explicit DOM operations - everything is declarative.

Building component, not template.


#### Flux application architecture

- Flux architecture graph

A single direction data flow.

Dispatcher is the traffic controller of the app which ensure until store layer is completely done, then view or anything else can put into the system, Store is the data layer basically updates when it get a new action, view re-render when store says that something has changed. View can send another action back to the system. Avoid cascading effect in the system by preventing nested updates. When a new action is going into the store, they have to wait for the previous one to be finished to take the effect.

```bash
Action => Dispatcher => Store => View
                    ^                                  |
                    |----- action  ------<|
```

```bash
                                                     Actions   =>   Dispatcher   =>       Callbacks
                                                        ^                                                      |
                                                        |                                                       |
Web API <=> Web API Utils <=> Action Createors                                Store
                                                        ^                                                       |
                                                        |                                                        |
                                                   User interactions  <= React Views <= Change Events + Store Queries
```


It is not a framework or a library. It is simply a new kind of architecture that complements React. Flux focuses on unidirectional data flow or everything happens in one direction. Data flows in as a result of actions. Actions trigger stores (data models) to be updated, which then triggers change events to fire, causing React views to update if needed. The cycle repeats itself as data changes throughout the app. Flux keys: 1) data flow from parent to child via props.  2) pass callbacks for interactions that modify parent state  3) synthetic event system

Flux is a method of retrieving data from your server API while maintaining a strict decoupling of components on your client side. It utilizes a one-way communication protocol so as to maintain a separation of concerns. Flux eliminate Controller to pass functionality to the view (its children). It pass our application state from the root component to the child components down, through the whole application, always just the necessary part of the data.

In React, application data flows unidirectionally via the state and props objects, in a multi component heirachy, a common parent component should manage the state and pass it down the chain via props. Your state should be updated using the `setState` method to ensure that a UI refresh will occur, if necessary. The resulting values should be passed down to child components using attributes that are accessible in said children via `this.props`.

```js
// simple dirty example on how flux works
var Count = React.createClass({
    getInitialState: function() {
        return {
            items: []
        };
    },

    componentWillMount: function() {
        emitter.on("store-changed", function(items) {
            this.setState({ items: items });
        }.bind(this));
    },

    componentDidMount: function() {
        dispatcher.dispatch({ type: "get-all-items" });
    },

    render: function() {
        var items = this.state.items;
        return <div>{items.length}</div>;
    }
});

var Store = function() {
    dispatcher.register(function(payload) {
        switch (payload.type) {
            case: "get-all-items":
                this._all();
                break;
        }
    }.bind(this));

    this._all = function() {
        $.get("/some/url", function(items) {
            this._notify(items);
        }.bind(this));
    }

    this._notify = function(items) {
        emitter.emit("store-changed", items);
    });
};

var ItemStore = new Store();
```

At a high level, a user initiates an action, which the view handles by dispatching a request for data to a store. In turn, that store executes the request and when the data is retrieved, emits an event saying so to all that are listening. Those listeners update their views accordingly. Here are the main components:

1. Actions

Action Creators are collections of methods that are called within views (or anywhere else for that matter) to send actions to the Dispatcher. Actions are the actual payloads that are delivered via the dispatcher.

Helper methods that facilitate passing data to the Dispatcher. It is an Event, no functionality behind. Just identify itself, with action metadata.

In flux, action type constants are used to define what action should take place, and are sent along with action data. Inside of registered callbacks, these actions can now be handled according to their action type, and methods can be called with action data as the arguments.

```js
// a constants definition
//
// mirror our keys so that our value matches our key definition
var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
  LOAD_SHOES: null
});
```

While this isn’t explicitly required for our current application, if we wanted to hook into a real API or handle actions from places other than views, it is nice to have this architecture in place if we needed to handle those actions differently than those that originated from views.

```js
// import this actions file into our view or API, and call `ShoeStoreActions.loadShoes(ourData)` to send our payload to the Dispatcher, which will broadcast it. Then the ShoeStore will “hear” that event and call a method thats loads up some shoes!
//
// look at the corresponding Action Creator definition
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ShoeStoreConstants = require('../constants/ShoeStoreConstants');

// `handleAction` method defined on our Dispatcher instance, `handleAction` receive an action from an action creator and then have our Dispatcher dispatch the action with a source property(data we provided) and the action that was supplied as an argument.
module.exports = {
  loadShoes: function(data) {
    AppDispatcher.handleAction({
      actionType: ShoeStoreConstants.LOAD_SHOES,
      data: data
    })
  }
};
```

2. Dispatcher

Receives actions and broadcasts payloads to registered callbacks. It is the traffic cop. Event driven app, to prevent race condition. Will cue all events to promises. Execute those events in the order receives.

The Dispatcher is basically the manager of this entire process. It is the central hub for your application. The dispatcher receives actions and dispatches the actions and data to registered callbacks.

The dispatcher is responsible for taking requests for action from the view and passing it on to the pertinent store (or stores). Each store will register with the dispatcher to receive updates when an action is dispatched. The constructor for a store registers a callback with the dispatcher. This means that whenever an action is dispatched, this callback gets executed, but only the actions that are pertinent to this dispatcher ever get executed. The dispatcher is the first step in the data access process on the client side.

The dispatcher has two main responsibilities:

* Registering callbacks after a dispatch. A store will register a callback with the dispatcher so that whenever an action is dispatched, the store is notified and can check to see if it needs to perform any action. For example, a TodoStore class registers with the dispatcher so that whenever an action to retrieve all todos is sent, it knows to start the process of getting the data.

* Dispatching actions to be fulfilled. A view sends an action to retrieve data via the dispatch method on the dispatcher. Any callbacks registered using the same key get notified on a dispatch. The dispatch method typically contains any payload information required, too, like an ID when retrieving a specific piece of data, for example.

The dispatcher broadcasts the payload to ALL of its registered callbacks, and includes functionality that allows you to invoke the callbacks in a specific order, even waiting for updates before proceeding. There is only ever one dispatcher, and it acts as the central hub within your application.

`Dispatcher => payload => multiple stores`

This is different from generic pub-sub systems in two ways:

* Callbacks are not subscribed to particular events. Every payload is dispatched to every registered callback.

* Callbacks can be deferred in whole or part until other callbacks have been executed.

```js
var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();

AppDispatcher.handleViewAction = function(action) {
  // Our method calls the dispatch method, which will broadcast the action payload to all of its registered callbacks.
  // This action can then be acted upon within Stores, and will result in a state update.
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
}
module.exports = AppDispatcher;
```

Dispatcher `waitFor` method is the ability to define dependencies and marshall the callbacks on our Stores. So if one part of your application is dependent upon another part being updated first, in order to render properly. In order to utilize this feature, we need to store the return value of the Dispatcher’s registration method on our Store as `dispatcherIndex`, as shown below:

```js
// in dispatcher file
ShoeStore.dispatcherIndex = AppDispatcher.register(function(payload) { });

// Then in our Store, when handling a dispatched action, we can use the Dispatcher’s waitFor method to ensure our ShoeStore has been updated:
case 'BUY_SHOES':
  AppDispatcher.waitFor([ShoeStore.dispatcherIndex], function() {
    CheckoutStore.purchaseShoes(ShoeStore.getSelectedShoes());
  });
  break;
```

3. Store

Containers for application state & logic that have callbacks registered to the dispatcher. It is like an angular service, like controller where most of logic is written. It can have multiple store and multiple view. Store react to events (actions), events are registered on Dispatcher. Store is listening on Event Dispatcher and execute it when event occurs.

In Flux, Stores manage application state for a particular domain within your application. From a high level, this basically means that per app section, stores manage the data, data retrieval methods and dispatcher callbacks.

```bash
       |----------- >        Store
       |                      |                     ^
Dispatcher    Change Event      State Request
      |                       v                      |
 Action                    | ---- View ->|
```

The store is used to actually retrieve, update or create the data once an action has come through that indicates as such. The constructor for the store will hookup a callback function via the dispatcher’s register method, which provides the one-way entry point into the store. The store then checks to see what type of action has been dispatched and, if it applies to this store, executes the appropriate method.

the store registers a callback function with the dispatcher to keep track of any dispatched actions. Once an action comes in, we do a switch on the payload’s type to determine which method to execute, then execute the method. Once the all, update or create method has completed, the notify method is called, which just emits a change event to anyone listening with the list of items.

The store has two responsibilities:

* Waking up on a relevant dispatch to retrieve the requested data. This is accomplished via registering with the dispatcher usually when constructed.

* Notifying listeners of a change in the store’s data after a retrieval, update or create operation. This is done via the event emitter.

Event Emitter is responsible for notifying subscribers after a store has completed any data action. Conversely, it also needs to be able to register observers for specific events. We’re going to be using Node’s event emitter in the todo application.

```js
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ShoeConstants = require('../constants/ShoeConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// Internal object of shoes
var _shoes = {};

// Method to load shoes from action data
function loadShoes(data) {
  _shoes = data.shoes;
}

// Merge our store with Node's Event Emitter. allows our stores to listen/broadcast events
var ShoeStore = assign(EventEmitter.prototype, {
  // Returns all shoes
  getShoes: function() {
    return _shoes;
  },

  emitChange: function() {
    this.emit('change');
  },

  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }
});

// registered a callback with our `AppDispatcher` using its register method
// our Store is now listening to AppDispatcher broadcasts
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;
  // Define what to do for certain actions
  //  switch statement determines whether, for a given broadcast, if there are any relevant actions to take
  switch(action.actionType) {
    case ShoeConstants.LOAD_SHOES:
      // Call internal method based upon dispatched action
      loadShoes(action.data);
      break;

    default:
      return true;
  }
  // If action was acted upon, emit change event
  ShoeStore.emitChange();
  return true;
});
module.exports = ShoeStore;
```

4. View

React Components that grab the state from Stores and pass it down via props to child components. View is your components. It does not know anything about action. It trigger the action by action name without any logic, When action is called, is being sent to the Dispatcher, which cue up in line. When Dispatcher is being executed, the Store is listening to Dispatcher event, will execute the action and do whatever it need to perform, and update the view.

views are really just React components that listen to change events and retrieve Application state from Stores. They then pass that data down to their child components via props.

handling an action by a user, like retrieving a list of items. It does this by sending a request for data via the dispatcher.

`Store => State => View => Props => multiple views`

```js
var React = require('react');
var ShoesStore = require('../stores/ShoeStore');

// Method to retrieve application state data from store
// use the public methods on the Stores to retrieve that data and then set our application state.
function getAppState() {
  return {
    shoes: ShoeStore.getShoes()
  };
}

// Create our component class
var ShoeStoreApp = React.createClass({
  // Use getAppState method to set initial state
  getInitialState: function() {
    return getAppState();
  },

  // Listen for changes
  componentDidMount: function() {
    // listen for change events using addChangeListener, and update our application state when the event is received.
    ShoeStore.addChangeListener(this._onChange);
  },

  // Unbind change listener
  componentWillUnmount: function() {
    ShoesStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <ShoeStore shoes={this.state.shoes} />
    );
  },

  // Update view state when change event is received
  _onChange: function() {
    this.setState(getAppState());
  }
});
module.exports = ShoeStoreApp;
```



#### Owner Ownee relationship

when one component render out another component. Within a component-tree, data should always flow down. A parent-component should set the `props` of a child-component to pass any data from the parent to the child. This is termed as the `Owner-Owned` pair. On the other hand user-events (mouse, keyboard, touches) will always bubble up from the child all the way to the root component, unless handled in between.

#### isomorphic application with React

React is also smart enough to recognize that the markup is already there (from the server) and will add only the event handlers on the client side. T

#### Jest

[tutorial](https://facebook.github.io/jest/docs/tutorial-react.html#content)

#### Best Practices

- Don't mutate anything in your render method

render method represents the view at a particular moment in time. For React to do its job properly, you need to hand it some data and let it render the whole thing before changing anything. Since you'll be re-rendering every time there's a change, you can't go changing something while you're rendering.

- Don't expect children to always be an array

React will send you a single element for `this.props.children`. So you'll get an error because that element won't have a map method. If you always want to treat it like an array, you'll have to coerce it to an array first. A bit of a pain, but it saves React from unnecessarily creating array garbage in the passthrough case.

```js
render: function () {
  return (
    <span style={{opacity: this.state.opacity}}>
      <ul>
      {
        this.props.children.map(function (child) {
          return <li>{child}</li>;
        });
      }
      </ul>
    </span>
  );
}

// output wanted
<Pulse>
  <div>Joe</div>
</Pulse>
// output actual
<Pulse></Pulse>
```

- Know the difference between controlled and uncontrolled components.

For editable form elements (like <input> and <textarea> and <select>), you can pass the value two different ways.

If you pass in a value prop, then that form element will have that value no matter what the user enters. In that case, it's a "controlled" component, meaning that you are controlling the value. So if you pass in the value of "jo" and that user adds an "e" to make that "joe", you have to subsequently set the value to "joe". Otherwise, the value will remain as "jo". This is generally a good thing, because it means that you'll visually see that your application state is holding the same value as the DOM elements.

If you pass in a defaultValue prop, the form element will initially show that value, but after that, no matter what value you pass in, the value displayed will be whatever the user last typed in.

In general, you probably want to stick with controlled components. But if you are creating an old school form where the user is just going to submit it, then uncontrolled components are fine. Also if you may have some invalid transient states, you may want to use an uncontrolled components. Personally, in that case, I prefer to use transient state to hold the value and still use controlled components.

- Mind your async

`componentDidMount` method works like `setTimeout`. When your async function returns, just do a `setState` to cause a re-render. This means that you'll need some intelligent "zero state" view (spinner) for before you have any data.

When the user subsequently does some action, then you'll just intercept the event and do some async work. However, be very careful that you don't end up with inconsistent results. For example, if you fire an async request every time a key is pressed, some of those requests could return out of order and leave you with inconsistent results. React may happily roll something back to an old value if you tell it to do that with a setState.

In larger apps, I recommend getting async work out of your components and pushing it into a dark corner. The more your components behave synchronously, the easier it will be to reason about their correctness and debug them. Doing async work is probably making them do work that is unrelated to their purpose as views.

If you do use React for async work, it's at least a good idea to push that work to top-level components so that your child components can be easily reusable.

- Some HTML attributes are different in JSX

When you use <div>, <span>, and other HTML elements, you can mostly treat them like their HTML equivalents. But some attributes are different. Some notable differences:

Everything is camel-cased.
Well, except data attributes.
class is className
style is a JSON object
The value and defaultValue attributes mentioned above.

- Keys are defined in parent components, not in child components

parent components has to specify the keys of each of its children. The child component doesn't need to worry about keys at all, because it's only rendering a single element. and Keys have to be at the top of the child

- JSX attributes are not JSON

```js
// common mistake
render: function () {
  return <div style={fontWeight: 'bold'}></div>
}

// correct
// one set of braces to get back to JavaScript and then another to make your object.
render: function () {
  return <div style={{fontWeight: 'bold'}}></div>
}
```

- Always set propTypes for validation and self-documentation

I always use propTypes to provide validation for each prop the component will receive. Furthermore, this also provides a self-documenting reference for how the component should be used, and what props it needs to be passed.

```js
propTypes: {
    arrayProp: React.PropTypes.array,
    boolProp: React.PropTypes.bool,
    funcProp: React.PropTypes.func,
    numProp: React.PropTypes.number,
    objProp: React.PropTypes.object,
    stringProp: React.PropTypes.string,
}
```

- Conditional JSX

When I have conditional elements that needs to be returned depending on state, props, or another condition, I declare an empty variable at the top of the render function and only populate it with JSX if the condition is met. When the variable is returned in the render method return statement, it’ll either render the conditional elements, or nothing at all.

```js
var optionalElement;

    if (this.props.condition) {
        optionalElement = (<div> … </div>);
    }

    return (
        <div>
            …
            {optionalElement}
            …
        </div>
    );
```

Video info

[help.sky.com](help.sky.com) use React.

Components are composable and the building blocks of React applications.

Component map to equivalent DOM nodes.

createClass defines a component. Requirement: `render()` method and return a single React component.

render  renders a component and all its children definition into the DOM
Props provides the immutable data for a component. The data does not change, it is perfer way to get data into the component.
State provides the mutable data for a componet.

- getDefaultProps:   specifies property values to use if they are not explictly supplied.

- propTypes:  validate properties. Supports validation of existence, data type or a custom condition.

array, string, number,

```js
var Hello = React.createClass({
    propTypes: {
        now: React.PropTypes.string, // now property is string
        now1: React.PropTypes.string.isRequired, // now1 property is string and required
        now2: React.PropTypes.oneOf(['red', 'green', 'blue']), // now2  property must be one of supplied array values
        count: function (props, propName, componentName) { // custom property validator
            if (props[propName] < 5) {
                throw new Error(propName + " must be 5 or greater");
            }
        }
    }
})
```

- mixins

Mixins allow common code to be merged into many components. Mixins component is an Array. Mixins allow reuse between components.

```js
// define the mixin object
var Highlight = {
    componentDidUpdate: function () {
        var node = $(this.getDOMNode());
        node.slideDown();
    }
};
// used in React component
var Count = React.createClass({
    mixins: [Highlight]
})
```

# JSX

JSX atrribute expressions

JSX attributes => react component props

```js
<Hello now="2013/06/07" />  // string literal
<Hello now={new Date().toString()} />  // dynamic expression. within {}, can be any validate javascript code
```

- this.props.children

allow to render any number of children inside the parent component. A JSX component may have more than one child expression or element.

A component accesses its child elements via a special property `this.props.children`

```js
var First = React.createClass({
  render: function () {
    return <p>First</p>
  }
});

var Second = React.createClass({
  render: function () {
    return <p>Second</p>
  }
});

var Parent = React.createClass({
  render: function () {
    return (
      <div>{this.props.children}</div>
    )
  }
});

React.render(
  <Parent>
    <First />
    <Second />
  </Parent>, document.body);
```

- White

whitespace between {} expressions is not preserved.

```js
{"Bob"} {"Alice"}             // BobAlice
{"Bob"} {" " + "Alice"}     // Bob Alice
{"Bob" + " "+ "Alice"}    // Bob Alice
{"Bob"} {" "} {"Alice"}      // Bob Alice
```

- HTML Attributes

Attributes set on JSX DOM elements are only passed through to the rendered html if they are valid according to the HTML specs.
Custom attributes are supported via `data-`

```js
<div myCustomAttribute="foo" />   // won't work
<div data-myAttribute="foo" />   // works
```

Attributes cannot use Javascript reserved words, because JSX will be compiled to Javascript property.

`<label htmlFor="name" className="big">`

- HTML Attributes - style

Style is a special react attribute that expects a Javascript object with camelCase properties.

```js
var Appender = React.createClass({
    render: function() {
        return <div style= {{ // first curly for javascript expression, second curly for javascript object literal
            border: '1px solid #999',
            backgroundColor: 'red'
        }}> {this.props.children} </div>
    }
});
```

- Unescaping content

React escapes everything by default.

dangerouslySetInnerHTML  to unescape content.

To bypass using `dangerouslySetInnerHTML`, it expects an object with an `__html` property

`<div dangerouslySetInnerHTML={{__html="<p>foo</p>"}} />`
`<div dangerouslySetInnerHTML={{__html: this.props.danger} />`

```js
// Escaped content means a string representation of HTML that is not interpreted as HTML
var Danger = React.createClass({
  render: function () {
    return <p>{this.props.danger}</p>
  }
});
React.render(<Danger danger="<strong>HELLO</strong>" />, document.body);
// output: <strong>HELLO</strong>


var Danger = React.createClass({
  render: function () {
    return <p dangerouslySetInnerHTML={{__html: this.props.danger}}></p>
  }
});
React.render(<Danger danger="<strong>HELLO</strong>" />, document.body);
// output: HELLO   // in bold
```



#### React introduction view

1. build components, not template
Coupling is the degree to which each program module relies on each of the other modules.
Cohesion is the degree to which elements of a module belong together.


2. Events - The React way

React has its own event abstraction: 1) Normalizes event behavior across browsers  2) uniform event system for DOM events and component events.  And then normalize the react events in "SyntheticEvents", works the same like native browsers events. Original event object is available via the "nativeEvent" property.

- DOM events: Browser events, receive a "SyntheticEvent" object.

ex: input tag is a react DOM element, has a "onChange" attribute, fire function callback every time when the input value has changed.

Note: all react form DOM element supports "onChange" attribute

```js
var Echo = React.createClass({
    handleChange: function(e) {
        console.log(e.target.value);
    },
    render: function () {
        return <input type="text" onChange={this.handleChange} />
    }
})
```

- Component Events

Domain specific events, add a higher abstraction to the browser event. ex: like addTask, taskComplete, etc. It express the concept from your application over the raw browser events.

```js
var Timer = React.createClass({
    propTypes: {
        onInterval: React.PropTypes.func.isRequired,
        interval: React.PropsTypes.number.isRequired
    },
    componentDidMount: function () {
        setInterval(this.props.onInterval, this.props.interval);
    },
    render: function () {
        return <div style={{display: 'none'}} />
    }
});
function thingToDo () { console.log('tick') }
React.render(<Timer onInterval={thingToDo} interval={1000} />, document.body );
```

- Touch Events

Support for touch devices by calling

`React.initializeTouchEvents(true)`

Will add `onTouchStart`, `onTouchEnd`, `onTouchMove`, `onTouchCancel` attributes


3. Forms

- 1. Controlled components

Form component rendered with its value or checked attribute provided as a prop.
Props are immutable, if you provide the value, values is fixed and cannot be changed.
React will gurentee the render version is always consistent with its props and states
Since there is "value" attribute, it makes it an "Controlled components". So user cannot edit the input text box.

Controller component preserve React's rendering semantics. rendered output will always match the component's props and states.

- Changing controlled components

**Change via state**. use `onChange` attribute, then populate the updated value from the ownering input text box state.

```js
getInitialState: function () {
    return {init: 'init'}
},
handleChange: function (e) {
    this.setState({init: e.target.value}):
},
render: function () {
    return <input type="text" value={this.state.init} onChange={this.handleChange} />
}
```

- 2. Uncontrolled components

Form components render without a value or checked prop
Since there is no "value" attribute, it makes it an "Uncontrolled components". So user can edit the input text box.

```js
render: function () {
    // remove the value from input element
    return <input type="text" onChange={this.handleChange} />
}
```

It could cause the rendered DOM to diverge from React's model of the DOM. Or Uncontrolled components has a hidden state that React does not know about, outside of React control.

- Uncontrolled component defaults

Set an initial value with the `defaultValue` attribute. Give the init rendered view a default value.

```js
render: function () {
    return <input type="text" defaultValue="init" />
}
```


React.createClass – The way in which you create a new component.
React.render – Renders a React component to a DOM node.

#### Useful links

[Flux react builder tutorial](https://scotch.io/tutorials/creating-a-simple-shopping-cart-with-react-js-and-flux#getting-started)
[reapp](http://reapp.io/) An easier, faster way to build apps with React and JavaScript.
[egghead](https://egghead.io/lessons/jsx-deep-dive) Good Tutorials
[Tyler Mcginnis's react tutorials](http://tylermcginnis.com/tag/reactjs/)
[Best tutorial collection](http://spyrestudios.com/the-only-react-js-tutorials-and-resources-youll-need/)

[React.js Newsletter](http://reactjsnewsletter.com/)
[React.js Docs](http://facebook.github.io/react/docs/)
[Flux](http://facebook.github.io/flux/docs/)
