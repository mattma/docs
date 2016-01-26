
## Concepts

#### Component

A custom element of a larger app, especially a single page app. Components are a group of HTML elements.

A component is made up of two parts: View, Logic

The Component is the most fundamental of Angular concepts. A component manages a view - a piece of the web page where we display information to the user and respond to user feedback. Technically, a component is a class that controls a view template.


#### Directive

It allows to attach custom behavior to DOM elements.

An official or authoritative instruction. They received a written directive instructing them to develop new security measures.

a lightweight, template-less component. I needed to attach some behavior to a DOM element, so I used a directive to instruct the element of what to do.

```js
@Directive({
  selector: "[red]" // a css attribute selector
})

class RedDirective {
  constructor(el: ElementRef) {
	el.domElement.style.color = "red";
  }
}
```

```html
<!-- The RedDirective instructs the div to turn red-->
<div red>Hello</div>
```

## What is different between Directive and Components?

Components are Directive with views.

A Component extends from the Directive class. ex: `export class Component extends Directive {}`

#### Annotation

A note of explanation or comment added to a text or diagram. Syntax that provides metadata about a class or function. We provides a Annotation for compiler.

Two type of annotation: Type annotation(TypeScript), Metadata Annotation(Angular, by default)

```js
// Type Annotation
function sayHello(name: string) {
  return "Hello " + name;
}
sayHello(1); //This makes Typescript angry. because of type is string.
```

```js
// Metadata Annotations
@component({
  selector: "cmp"
})
@view({
  template: `<div>Hello</div>`
})
class MyComponent {}

// HTML usage:  <cmp></cmp>
```

#### Modules

Angular is also modular. It is a collection of library modules. Each library is itself a module made up of several, related feature modules. Most application files export one thing such as a component.


#### Component Metadata

A class becomes an Angular component when we give it metadata. Angular needs the metadata to understand how to construct the view and how the component interacts with other parts of the application.

In TypeScript we apply that function to the class as a decorator by prefixing it with the @ symbol and invoking it just above the component class

```js
// @Component tells Angular that this class is an Angular component. The configuration object passed to the @Component method has two fields, a selector and a template.
// The selector specifies a simple CSS selector for a host HTML element named my-app. Angular creates and displays an instance of our AppComponent wherever it encounters a my-app element in the host HTML.
@Component({
  selector: 'my-app',
  template: '<h1>My First Angular 2 App</h1>'
})
```


#### Events and Refs

Give an pound reference to the input field, access its raw DOM by its reference.

Using raw event name (ex: mouseover) wrapped in `()`, or use `on-click=""` syntax to bind the event listener

```html
<input type="text" #myInput>
<button (click)="onClick($event, myInput)">submit</button>
```

#### Using @Inject decorator

Instead of writing type of `todoService: TodoService` on the right side, can inject the type using `@Inject` decorator to pass Type or something else. The reason that you do this, because you do not want to use Typescript or inject anything other than a type like symbol.

```js
import {Inject} from 'angular2/core';

export class Anything {
  constructor(@Inject('whatever') public todoService) {

  }
}
```
