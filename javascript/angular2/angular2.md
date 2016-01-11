# Angular2

The fundamental building blocks of an Angular app are directives. Directives with a view are called components, and these account for the majority of Directives in most apps. Angular components are largely interchangeable with Web Components, so they work well with other frameworks.

Angular components also have input and output properties to allow interaction with other components. For example, a component could set up its view based on the configuration it receives from its parent component, and then be notified to change its appearance by an event it receives from a child or sibling component.

Angular is built with significant support for dependency injection (so a component may receive the necessary singleton services) and routing.

the new component router in Angular 2 is that each route maps to a component.

Dependency injection within Angular 2 happens at the constructor and so we are going to add one to our class and inject the StateService. Components also have lifecycle hooks that we can use to sequence units of work. ex: `ngOnInit` hook.

- Angular includes

* Expressions: Evaluate for sth true or false, computed value
* data binding
* Template: Reusable UI, declarative markup compose UI and applies behaviors
* Components: reusable components and services
* Tools: cross-browser
* Typescript: from decorations (metadata or annotations), declarations for existing libraries including JS based.

```js
interface IStyle {
  style: string;
}

function alertStyle<T extends IStyle>(item: T): void {
  window.alert(item.style);
}

interface IColor extends Istyle {
  red: number;
  green: number;
  blue: number;
}

function asHex(num: number) {
  let result: string = num.toString(16);
  return result.length < 2 ? `0${result}` : result;
}

class Color implements IColor {
  public style: string;
  public constructor (public red: number, public green: number, public blue: number) {
    this.style = `#${asHex(red)}${asHex(green)}${asHex(blue)}`
  }
}

const color = new Color(255, 127, 63);
alertStyle(color);
```

## Dependency

1. [ES6 Shim](https://github.com/paulmillr/es6-shim)

ES6 provides shims so that legacy JavaScript engines behave as closely as possible to ECMAScript 6.

This shim isn’t strictly needed for newer versions of Safari, Chrome, etc. but it is required for older versions of IE.

2. Angular 2 Polyfills

It provides some foundational standardization across browsers. Specifically angular2-polyfills contains code for dealing with zones, promises, and reflection.

3. [RxJS](https://github.com/ReactiveX/RxJS)

RxJS gives us tools for working with Observables, which emit streams of data. Angular uses Observables in many places when dealing with asynchronous code (e.g. HTTP requests).

## Components

Components are the new version of directives. A basic Component has two parts:
1. A Component annotation  2. A Component definition class

Think of annotations as metadata added to your code. When we use @Component on the `HelloWorld` class, we are “decorating” the `HelloWorld` as a Component.

## Common

1. NgFor

Use `NgFor` directive on this attribute. `*ngFor` is a for loop; the idea is that we’re creating a new DOM element for every item in a collection.

`#name of names` names is our array of names as specified on the `HelloWorld`
object. `#name` is called a reference. When we say "#name of names" we’re saying loop over each element in names and assign each one to a variable called `name`

## http

The http service in Angular2 is using Observables, which is different from the promise based approach in Angular 1.x.

```js
// note: need to update this formating
import {Component, View} from 'angular2/core';
import {Http, Response} from 'angular2/http'
@Component({
    selector: 'http'
})
@View({
    templateUrl: './components/http/http.html'
})
export class HttpSample {
  result: Object;
  constructor(http: Http) {
    // The friends array on the returned object is then bound to the view.
    this.result = {friends:[]};
    http.get('./friends.json')
      .map((res: Response) => res.json()).subscribe(
        res => this.result = res,
        error => this.error = error
      );
  }
}
```

Dependent calls

ex: make an initial call to load a customer. The returned customer object contains a contract url that I will be using to load a contract for that particular customer.

```js
this.http.get('./customer.json').map((res: Response) => {
     this.customer = res.json();
     return this.customer;
  })
  .flatMap((customer) => this.http.get(customer.contractUrl)).map((res: Response) => res.json())
  .subscribe(res => this.contract = res);
```

Parallel requests

list out the parallel calls and get the result back in an array. Below is an example of how to request a list of friends and a customer in parallel.

```js
import {Observable} from 'rxjs/Observable';
Observable.forkJoin(
  this.http.get('./friends.json').map((res: Response) => res.json()),
  this.http.get('./customer.json').map((res: Response) => res.json())
).subscribe(res => this.combined = {friends:res[0].friends, customer:res[1]});
```

Cancel Observables

Observables offer built in support for canceling subscriptions. Cancellation can be beneficial if you inadvertently made an http request and want to cancel the processing of the response.

```js
getCapitol(country){
    if(this.pendingRequest){
      // calling unsubscribe() on an active Observable effectively cancels the processing of the http response.
        this.pendingRequest.unsubscribe();
    }
    this.pendingRequest = this.http.get('./country-info/' + country)
                          .map((res: Response) => res.json())
                          .subscribe(res => this.capitol = res.capitol);
}
```

Simple Post Call

the syntax seems a bit more verbose than it needs to be. It also feels a bit unnecessary to do a manual JSON.stringify of the post payload.

```js
var headers = new Headers();
headers.append('Content-Type', 'application/json');
this.http.post('http://www.syntaxsuccess.com/poc-post/',
                       JSON.stringify({firstName:'Joe',lastName:'Smith'}),
                       {headers:headers})
    .map((res: Response) => res.json())
    .subscribe((res:Person) => this.postResponse = res);
```

Promises

Angular 2.0 has moved in the direction of Observables but it's still possible to work with promises if that is your preference.

```js
this.http.get('./friends.json').toPromise()
.then((res: Response) => {
    this.friendsAsPromise.friends = res.json().friends;
});
```


## Change Detection

Angular 2 opens this channel by providing a change detection system that understands the type of object being used, it follow a tree structure to detect changes. This makes the system predictable and it reduces the time taken to detect changes.

If plain JavaScript objects are used to bind data on the views, Angular has to go through each node and check for changes on the nodes, on each browser event. Though it sounds similar to the technique in Angular 1, the checks happen very fast as the system has to parse a tree in a known order.

If we use Observables or, Immutable objects instead of the plain mutable objects, the framework understands them and provides better change detection. Let’s delve further into the details:

· Immutable Objects: As the name itself says, an immutable object cannot be modified as it is created. A change made in the object re-creates the object itself. The re-creation kicks in an event to notify user about the change. So the bindings under the subtree using immutable objects, are not parsed until such an event occurs. When the event is raised, the subtree is checked and the changes are applied on it. The checks will not happen on browser events following this check, unless the event is raised again.

· Observable Objects: The observable objects implement a reactive mechanism of notifying the changes. They emit events when the object changes. Subscribers to these events get notified whenever the object changes and they can use the new value to update UI or, perform the next action upon receiving the notification.

Angular 2 understands observable objects. When an object sends a change notification, the framework checks for changes in the subtree under the node containing the component depending on the changed object. This subtree won’t be checked for any changes until another change event on the same object is raised.

We need to tell the framework that the component uses one of these objects. It can be done using a property in the component annotation.

```js
@Component({
  selector:'my-component',
  changeDetection: ON_PUSH
})
```

`@Input` (`import {Input} from 'angular2/core';`) declares a data-bound property so that it is automatically updated during change detection.

## Dependency injection

Angular2 provides a simple and powerful DI container. It has a single API for injecting dependencies and it also provides ways to control lifecycle of dependencies and specify the type of dependency to be injected when a type is requested. The DI works in the same hierarchy in which the components are built. Dependencies have to be declared along with annotations of the components. A dependency declared on a component can be used either by the same component or by any of the children of the component. Children components can override the way a dependency is declared in the parent as well.


## Zones

After the application starts, we need a process to keep running behind the scenes that kicks in the process of change detection so that the model and the UI are always in sync. Angular 2 includes a library called Zone.js, which helps us in keeping things always in sync. A zone is an execution context that persists across async tasks. All operations performed in Angular 2 are carried under this context. We don’t need to invoke them or attach operations to them. Zones know what kind of operations to be handled in the context.


## Directives

Angular 2 are used to extend HTML, similar to the way DOM appears and they provide ways to get into life cycle events to take better control over the way a directive works. Architecture of the directives in Angular 2 embraces bindings a lot and hence reduces the need of direct DOM manipulation. Also, we don’t need to deal with different restrict types as well as with the camel case notation while naming directives; both of these properties are handled by a single selector property.

There are three different types of directives in Angular 2:

- Component Directives

Everything in an Angular 2 application is a component, looks like a tree of components. The application starts by bootstrapping a component and other components are rendered as children of this component. The components are used to define a new HTML element.

the component is a class decorated with the annotations Component. An object of this class is the view model for the component. Any public property defined in this class can be used to bind data in the component’s template.

- Decorator Directives

A decorator is the simplest kind of directive. It is used to extend behavior of an HTML element or an existing component. This directive doesn’t make a lot of impact on the view, but helps in achieving certain small yet important functionalities on the page. A decorator directive is a class with the Directive applied on it.

- Directives with ViewContainer

The directives that use a `ViewContainerRef` object can take control over the content of the element on which they are applied. These directives can be used when template of the view has to be shown/hidden based on a condition, to iterate over or, to tweak the content based on a scenario. The directives like `ng-for` and `ng-if` fall into this category.


## Services

Angular 2 doesn’t have the concept of services. Anything other than directives are simple classes. Good thing is, we can apply dependency injection on these classes and these classes can be injected into any directives. We can consider any plain simple class as a service.


## Notes

how routes are added to our view with `router-outlet` and the syntax for navigating to a route using `routerLink`

To make a service injectable, we annotate our class with `@Injectable`.

To make a component, we annotate our class with `@Component`.

To make a property bindable, we annotate our property with `@Input`.

Use the `private` modifier in TypeScript to restrict access to class members.

We can use TypeScript interfaces to define the shape of an object and provide richer typing.

We must add our subcomponents to the directives array in our `@component` annotation. ex: `directives: [SubComponent]`

The asterisk (*) is a shorthand method to work with directives that modify the DOM by inserting templates.

The pound sign (#) is used to denote a local template variable.

Double brackets ([]) binds an element property to an expression.

At the risk of an oversimplification, `ngFor` is the new `ngRepeat`.

```js
{{myVar}} //One-way binding
ngModel="myVar" //Two-way binding
```

binding to DOM properties with [prop]=”val” and propagating events up from components with (event)=”someFunc()”. you can always use the alternative syntax instead (i.e. bind-prop=”val” and on-event=”someFunc()”).

onClick=”someFunc()” is the pure JS way of doing it, i.e. onBlah translates to (blah)

```js
<ul>
  // Declaring a “master template” via a proceeding asterisk
  // # sign in front of hero declares a local template variable, can also use `var`
  // ngFor adds looping semantics to HTML via an Angular-specific attribute.
  <li *ngFor="#hero of heroes">
    {{hero.name}}
  </li>
</ul>
```

And since React includes a synthetic event system (as does Angular 2), you don’t have to worry about the performance implications of declaring event handlers inline like this.

```js
// click binding
(click)=”onSelect(hero)"
```

Built tool for react

budō https://github.com/mattdesl/budo
nwb  https://github.com/insin/nwb
prot  https://github.com/mattdesl/prot
rackt-cli  https://github.com/mzabriskie/rackt-cli
rwb   https://github.com/petehunt/rwb
