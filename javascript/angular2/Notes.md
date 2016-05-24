- what is a component?

At a high level, a component is a set of functionalities grouped together including a view, styles (if applicable) and a controller class that manages the functionality of the component. In Angular 2 a component is just a special type of directive encapsulating a reusable UI building block (minimally a controller class and a view).

- [view encapsulation](https://angular.io/docs/ts/latest/guide/component-styles.html#!#view-encapsulation)

Angular actually processes component CSS code so that it is scoped to the component template and cannot bleed outside it.


- Animation

There are two main alternatives that browsers give us for doing animations natively. Both of them have their tradeoffs:

With CSS Transitions we can easily declare how style changes in elements are animated over time. But we have very limited programmatic access to this. Everything needs to be predefined in CSS and there's no way to influence a running transition. If you only know the values of your animated properties at runtime, you're out of luck.
With the Web Animations API we get full control over animations, because we trigger them from JavaScript code and can control them after the fact. But in this case we can't do anything with CSS stylesheets. We need to define animation styles in JavaScript, which is rarely where you want to be putting styles.

The Angular 2 animation engine gives us the best of both worlds. It builds on top of the Web Animations API, but integrates tightly with Angular's component stylesheet support so that we can define our animation styles there.


- Change detection strategies

If I've got immutable data structures or Observable inputs, I can use OnPush.

If I know things are never going to change as long as the component exists, I can use CheckOnce. It's kind of like React's shouldComponentUpdate but all nice and declarative.

- Decorators?

Decorators use a leading “@” symbol and used to provide Angular with metadata about a class (and sometimes methods or properties). Decorators always come before the class or property they are decorating

Decorators are a declarative way to add metadata to code. ex: `@Component` is an annotation that tells Angular, that the class, which the annotation is attached to, is a component. Angular expects the metadata on annotations and parameters properties of classes. If Transpiler would not translate them to those particular properties, Angular 2 wouldn’t know from where to get the metadata.

Angular2 framework comes with metadata annotation implementations (aka `ComponentMetadata`), which are then passed to the decorator generator to make decorators. We’re actually importing the metadata rather than the decorator. This is simply just because Transpiler doesn’t understand decorators, but does understand `@Component` annotations.

```js
// @Component is something we need to import from the Angular 2 framework
import { ComponentMetadata as Component } from '@angular/core';


// `ComponentMetadata` is an implementation detail of the Angular framework
export class ComponentMetadata extends DirectiveMetadata {
  constructor() {}
}


// Transpiled down to js
// a class is just a function or an object, and all annotations end up as instance calls on the annotations property of the class or have parameter annotations as well and whose will be assigned to a class’ parameters property.
var Tabs = (function () {
  function Tabs() {}

  Tabs.annotations = [
    new ComponentMetadata({...}),
  ];

  return Tabs;
})

ex: parameter annotations
class MyClass {
  constructor(@Annotation() foo) {}
}
// transpiled =>
// translate to a nested array, is because a parameter can have more than one annotation.
var MyClass = (function () {
  function MyClass() {}
  MyClass.parameters = [[new Annotation()]];
  return MyClass;
})
```

We know that metadata annotations is and what they translate to, Angular 2 make `@Component` available to the framework, annotations are really just metadata added to code. That’s why @Component is a very specific implementation detail of Angular 2. The framework knows what to do with that information.

* decorator code example

A decorator is just a function that gives you access to the `target` that needs to be decorated. Get the idea? Instead of having a transpiler that decides where your annotations go, we are in charge of defining what a specific decoration/annotation does.

This enables us to implement a decorator that adds metadata to our code the same way AtScript annotations do.

```js
// A simple decorator
@decoratorExpression
class MyClass { }

// here is a corresponding decorator implementation for @decoratorExpression
function decoratorExpression(target) {
  // Add a property on target
  target.annotated = true;
}
```


- @Injectable() decorator

Injectable decorator to let Angular know a class should be registered with dependency injection. Without this, the providers property inside component wouldn’t have worked, and dependency injection wouldn’t have created an instance of the service to pass into the controller.

- Component selector

When the Angular compiler comes across HTML that matches one of these selectors, it creates an instance of the component class and renders the contents of the template property.

```js
selector: 'StockSearch' // matches <StockSearch></StockSearch>
selector: '.stockSearch' // matches <div class="stockSearch">
selector: '[stockSearch]' // matches <div stockSearch>
```