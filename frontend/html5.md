## Future

Those ideas are coming from [addy osmani](https://medium.com/@addyosmani/javascript-application-architecture-on-the-road-to-2015-d8125811101b)

On an architectural level, the way we craft large-scale applications in JavaScript:

- unidirectional data-binding
- immutable data-structures
- virtual-DOM

#### Composition

Composition is incredibly powerful, allowing us to stitch together reusable pieces of functionality to “compose” a larger application. Composition ushers in a mindset of things being good when they’re modular, smaller and easier to test. Easier to reason with. Easier to distribute. Heck, just look at how well that works for Node.

Composition is one of the reasons we regularly talk about React “Components”, “Ember.Component”s, Angular directives, Polymer elements and of course, straight-up Web Components.

Shadow DOM could help with composition. It’s best to think about the feature as giving us true functional boundaries between widgets we’ve composed using regular old HTML. This lets us understand where one widget tree ends and another widget’s tree begins, giving us a chance to stop shit from a single widget leaking all over the page. It also allows us to scope down what CSS selectors can match such that deep widget structures can hide elements from expensive styling rules.

Shadow DOM allows a browser to include a subtree of DOM elements (e.g those representing a component) into the rendering of a document, but not into the main document DOM tree of the page. This creates a composition boundary between one component and the next allowing you to reason about components as small, independent chunks without having to rely on iframes. Browsers with Shadow DOM support can move across this boundary at ease, but inside that subtree of DOM elements you can compose a component using the same div, input and select tags you use today. This also protects the rest of the page from component implementation details hidden away inside the Shadow DOM.

Components using Shadow DOM for their composition boundaries are (or should be) as straight-forward to consume and modify as native HTML elements.


#### Functional Reactive Programming

In Functional Reactive Programming, signals represent values that change over time. Signals have a push-based interface, which is why it’s reactive. FRP provides a purely functional interface so you don’t emit events, but you do have control flow structures allowing you to define transformations over base signals. Signals in FRP can be implemented using CSP channels.


#### immutable data structure and presistent data structure

An immutable data structure is one that can’t be modified after it has been created, meaning the way to efficiently modify it would be making a mutable copy. A persistent data structure is one which preserves the previous versions of itself when changed. Data structures like this are immutable (their state cannot be modified once created). Mutations don’t update the in-place structure, but rather generate a new updated structure. Anything pointing to the original structure has a guarantee it won’t ever change.

The real benefit behind persistent data structures is referential equality so it’s clear by comparing the address in memory, you have not only the same object but also the same data.

Imagine in our app we have a normal JS array for our Todo items. There’s a reference to this array in memory and it has a specific value. A user then adds a new Todo item, changing the array. The array has now been mutated. In JavaScript, the in-memory reference to this array doesn’t change, but the value of what it is pointing to has.

For us to know if the value of our array has changed, we need to perform a comparison on each element in the array — an expensive operation. Let’s imagine that instead of a vanilla array, we have an immutable one. This could be created with [immutable-js](https://github.com/facebook/immutable-js) from Facebook or [Mori](http://swannodette.github.io/mori/). Modifying an item in the array, we get back a new array and a new array reference in memory.

If we were to go back and check the reference to our array in memory is the same, it’s guaranteed not to have changed. The value will be the same. This enables all kinds of things, like fast and efficient equality checking. As you’re only checking the reference rather than every value in the Todos array the operation is cheaper.

As mentioned, immutability should allow us to guarantee a data structure hasn’t been tampered.

```js
var todos = ['Item 1', 'Item 2', 'Item 3'];
updateTodos(todos, newItem);
destructiveOpOnTodos(todos);
console.assert(todos.length === 3);
```

At the point we hit the assertion, it's guaranteed that none of the ops since array creation have mutated it. This probably isn’t a huge deal if you’re strict about changing data structures, but this updates the guarantee from a “maybe” to a “definitely”.

Immutability comes with a number of benefits, including:

- Typically destructive updates like adding, appending or removing on objects belonging to others can be performed without unwanted side-effects.

- You can treat updates like expressions as each change generates a value.

- You get the ability to pass objects as arguments to functions and not worry about those functions mutating the object.
These benefits can be helpful for writing web apps, but it’s also possible to live without them as well and many have.

How does immutability relate to things like React? Well, let’s talk about application state. If state is represented by a data structure that is immutable, it is possible to check for reference equality right when making a call on re-rendering the app (or individual components). If the in-memory reference is equal, you’re pretty much guaranteed data behind the app or component hasn’t been changed. This allows you to bail and tell React that it doesn’t need to re-render.

Immutable data structures (for some use-cases) make it easier to avoid thinking about the side-effects of your code. Perhaps the main downside to immutability are the memory performance drawbacks, but again, this really depends on whether the objects you’re working with contain lots of data or not.


## Shadow DOM

Problem: There is a fundamental problem that makes widgets built out of HTML and JavaScript hard to use: The DOM tree inside a widget isn’t encapsulated from the rest of the page. This lack of encapsulation means your document stylesheet might accidentally apply to parts inside the widget; your JavaScript might accidentally modify parts inside the widget; your IDs might overlap with IDs inside the widget; and so on.

Web Components is comprised of four parts: Templates, Shadow DOM, Custom Elements, Packaging

Shadow DOM addresses the DOM tree encapsulation problem. The four parts of Web Components are designed to work together, but you can also pick and choose which parts of Web Components to use.

- Core concept

With Shadow DOM, elements can get a new kind of node associated with them. This new kind of node is called a shadow root. An element that has a shadow root associated with it is called a shadow host. The content of a shadow host isn’t rendered; the content of the shadow root is rendered instead.

```html
<button>Hello, world!</button>
<script>
    var host = document.querySelector('button');
    var root = host.createShadowRoot();
    root.textContent = 'こんにちは、影の世界!';
</script>

<!-- HTML output
because the DOM subtree under the shadow root is encapsulated. -->
<button>こんにちは、影の世界!</button>
```


