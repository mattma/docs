## Angular2 immutability

if you use immutable data, you have to let your angular Angular component know about it, so it knows how to optimize the rendering process.

#### ChangeDetectionStrategy

If you have a component that only expects immutable data to be passed in via a property, you can further optimize rendering speed by adding changeDetection: `ChangeDetectionStrategy.OnPush` to the component.

Modeling application state using immutable objects solves these problems (1. tracking changes hard, both for the developer and the framework. 2.  force Angular to be conservative by default, which negatively affects performance). The component can change if and only if any of its inputs changes. And we can communicate it to Angular by setting the change detection strategy to `OnPush`.

`ChangeDetectionStrategy.OnPush` tells Angular that it should not re-render the component unless the input property has changed. This allows Angular to optimize the rendering process for the component. Use carefully, it may break your app. ex: `@Input() game: any;` has input coming in from parent component.

```js
@Component({
  selector: 'person',
  template: `{{person.name}} lives at {{address.street}}, {{address.city}} (zipCode)`,
  changeDetection: ChangeDetectionStrategy.OnPush // ⇐===
})
class DisplayPerson {
  @Input() person: {name:string};
  @Input() address: {city:string, street:string};
  zipCode: string;

  constructor(private zipCodes:ZipCodes) {}

  onChanges(inputChanges) {
    if (inputChanges.address) { // this means that the address was replaced
      this.zipCode = this.zipCodes(this.address);
    }
  }
}
```

Using this change-detection strategy restricts when Angular has to check for updates from “any time something might change” to “only when this component’s inputs have changed”. As a result, the framework can be a lot more efficient about detecting changes in DisplayPerson. If no inputs change, no need to check the component’s template. Perfect! Immutable objects are awesome!

#### What is mutable, Immutable

Primitives types like `string` and `number` are immutable. You can freeze JavaScript objects and array to make them immutable, but a better option would be to use libraries like `Immutable.js` or `Mori`. They provide efficient implementation of immutable collections and records and are easy to use.

Mutable data may change. Immutable data cannot be changed once created, leading to much simpler application development, no defensive copying, and enabling advanced memoization and change detection techniques with simple logic. Persistent data presents a mutative API which does not update the data in-place, but instead always yields new updated data.

**Mutable data contains (State + Time), Immutable data always have the same thing via Structual Sharing**

```js
// mutable array
var arr = []
var v2 = arr.push(2)
v2 // <= 1 the length of the arr
arr // [2] has been modified, lost the original array

// immutable array
// have both version available, we decide when to discard old values
var arr = new ImmutableArray([1,2,3,4])
var v2 = arr.push(5)
v2.toArray()  // [1,2,3,4,5]
arr.toArray()  // [1,2,3,4]
```

```js
// immutable object
var person = new ImmutableMap({
  name: 'Chris', age: 32
})
var older = person.set('age', 33)
person.toObject() // {name: 'Chris', age: 32}
older.toObject() // {name: 'Chris', age: 33}
```

#### IMMUTABILITY VS ENCAPSULATION

Modeling application state using exclusively immutable objects requires pushing the state management out of the component tree. Since address is immutable, we cannot update its street property in place. Instead, we have to create a new address object. Say this address is stored in some PersonRecord object. Since that object is immutable too, we will have to create a new PersonRecord object. Therefore, the whole application state will have to be updated if we change the street property of the address.

Move all local mutable state from our components to parent component, pass in as Input. Completely disallowing local mutable state will mean that all values will have to be stored in the application state object. We need to pass it in and out.

In summary, removing mutable state simplifies tracking changes in the application and makes the application more performant. But at the same time it breaks the encapsulation of components, and their implementation details start to leak out.

**Best practices**

Application state that is passed around is modeled using immutable objects.

Components can have local state that can only be updated when their inputs change or an event is emitted in their templates. Since inputs are immutable, an input has to be replaced to affect a component. Nothing outside the component can change them in any way.

we allow mutable state, but in a very scoped form

## Smart and dumb components

**Smart component** does the heavy lifting (Fetching data, etc.) It contains little layout information and relies instead on dumb components.

**Dumb components** receives its data from the smart component and displays it with little to no added logic. It makes them reusable and easier to test.

## Modify Ajax search params and Build a search service with debounce

```js
import {URLSearchParams, Jsonp} from 'angular2/http';
@Injectable()
export class WikipediaService {
  constructor(private jsonp: Jsonp) {}

  search (term: string) {
    var search = new URLSearchParams()
    search.set('action', 'opensearch');
    search.set('search', term);
    search.set('format', 'json');
    // Now that our WikipediaSerice returns an Observable instead of a Promise we simply need to replace then with subscribe in our App component.
    return this.jsonp
        .get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', { search }).map((response) => response.json()[1]);
  }
}
```

Behind the scenes term automatically exposes an Observable<string> as property valueChanges that we can subscribe to. Now that we have an Observable<string>, taming the user input is as easy as calling debounceTime(400) on our Observable. This will return a new Observable<string> that will only emit a new value when there haven’t been coming new values for 400ms.

```js
export class App {
  items: Array<string>;
  term = new Control();
  constructor(private wikipediaService: WikipediaService) {
    this.term.valueChanges
     .debounceTime(400)
     .distinctUntilChanged()
     // search returns an Observable<Array<string>> we can simply use flatMap to project our Observable<string> into the desired Observable<Array<string>> by composing the Observables.
     .switchMap(term => this.wikipediaService.search(term))
     .subscribe(items => this.items = items);
  }
}
```

Don’t hit api multiple times. All we have to do to achieve the desired behavior is to call the `distinctUntilChanged` operator right after we called `debounceTime(400)`. Again, we will get back an Observable<string> but one that ignores values that are the same as the previous.

`map` operator expects a function that takes a value `T` and returns a value `U`, or from an `Observable<T>` to an `Observable<U>`. However, our search method produces an `Observable<Array>` itself. The `flatMap` operator expects a function that takes a `T` and returns an `Observable<U>`, an `Observable<string>`, then call `flatMap` with a function that takes a string and returns an `Observable<Array<string>>`. `switchMap` operator work the same like `flatMap` but automatically unsubscribes from previous subscriptions as soon as the outer Observable emits new values.


## Multi Providers

DI system has a feature called “Multi Providers” that hook into certain operations and plug in custom functionality we might need in our application use case.

- What is a provider?

A provider is an instruction that describes how an object for a certain token is created.

```js
import {DataService} from './dataService';

@Component(...)
class AppComponent {
  // import the type of the dependency, annotate our dependency argument with it in our component’s constructor
  // Angular knows how to create and inject an object of type DataService, if we configure a provider for it.
  constructor(dataService: DataService) {
    // dataService instanceof DataService === true
  }
}

Setup can happen either in the bootstrapping process of our app, or in the component itself. Now, whenever we ask for a dependency of type DataService, Angular knows how to create an object for it.

```js
// at bootstrap
bootstrap(AppComponent, [
  provide(DataService, {useClass: DataService})
]);

// or in component
@Component({
  ...
  providers: [
    provide(DataService, {useClass: DataService})
    // if the instruction is useClass and the value of it the same as the token, can use ShortHand
    // providers: [DataService]
  ]
})
class AppComponent { }
```

- Multi providers

basically provide multiple dependencies for a single token. A token can be either a string or a type. Using `multi: true` tells Angular that the provider is a multi provider.

```js
const SOME_TOKEN: OpaqueToken = new OpaqueToken('SomeToken');

var injector = Injector.resolveAndCreate([
  provide(SOME_TOKEN, {useValue: 'dependency one', multi: true}),
  provide(SOME_TOKEN, {useValue: 'dependency two', multi: true})
]);

var dependencies = injector.get(SOME_TOKEN);
// dependencies == ['dependency one', 'dependency two']
```

Usually, when we register multiple providers with the same token, the last one wins. Not any more with `multi`. This means, with multi providers we can basically extend the thing that is being injected for a particular token. Angular uses this mechanism to provide pluggable hooks.

All directives provided by the platform (now called `PLATFORM_DIRECTIVES`, is a mutli provider which can add custom user directives) are available in our component’s template right away.

```js
@Directive(...)
class Draggable { }

@Component(...)
class RootCmp { }

// at bootstrap. Draggable directive auto availabe for entire application
bootstrap(RooCmp, [
  provide(PLATFORM_DIRECTIVES, {useValue: Draggable, multi: true})
]);
```

- Other Multi Providers

The Angular platform comes with multi providers that we can extend with our custom code

`PLATFORM_PIPES` - Basically same as `PLATFORM_DIRECTIVES` just for pipes
`NG_VALIDATORS` - Interface that can be implemented by classes that can act as validators
`PLATFORM_INITIALIZER` - Can be used to perform initialization work

## Angular2 best

`Components` - Components are the new building blocks when creating applications. Almost everything is a component, even our application itself.

`Inputs/Outputs` - Components communicate via inputs and outputs, if they run in the Browser, these are element properties and events.

`Content Projection` - Basically the new transclusion, but more aligned with the Web Components standard.

`Dependency Injection` - Instead of having a single injector for our entire application, in Angular 2 each component comes with its own injector.

## Injecting services in services

DI takes advantage of metadata on our code, added through annotations, to get all the information it needs so it can resolve dependencies for us.

TypeScript only generates metadata for a class, method, property or method/constructor parameter when a decorator is actually attached to that particular code. Otherwise, a huge amount of unused metadata code would be generated, which not only affects file size, but it’d also have an impact on our application runtime.

That’s why the metadata is generated for `AppComponent`, but not for `DataService`. Our AppComponent does have decorators, otherwhise it’s not a component.

- Enforcing Metadata Generation

use DI decorators `@Inject` decorator to ask for a dependency of a certain type. Problem solved. In fact, this is exactly what `@Inject` is for when not transpiling with TypeScript, attranspiled code, we see that all the needed metadata is generated.

```js
import {Inject} from 'angular2/core';
import {Http} from 'angular2/http';
class DataService {
  constructor(@Inject(Http) http:Http) { }
}
```

We can basically put any decorator on our code, as long as it’s either attached to the class declaration, or to the constructor parameter. In other words, we could remove `@Inject` again and use something else that we put on the class, because that will cause TypeScript to emit metadata for the constructor parameters too. Angular use `@Injectable` for Dart metadata generation. It doesn’t have any special meaning in TypeScript-land, however, it turns out to be a perfect fit for our use case.

```js
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
class DataService {
  constructor(http:Http) { }
}
```

Again, this will just enforce TypeScript to emit the needed metadata, the decorator itself doesn’t have any special meaning here.

## Classes aren’t hoisted

The JavaScript interpreter doesn’t hoist class declarations because it may lead to unsound behavior when we have a class that uses the `extend` keyword to inherit from something. In particular, when it inherits from an expression which is absolutely valid.

The class must always be declared before it’s usage? we can use the `@Inject` annotation in conjunction with the `forwardRef` function as demonstrated here.

```js
import {Component, Inject, forwardRef} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

@Component({
  selector: 'my-app',
  template: '<h1>Favourite framework: {{ name }}</h1>'
})
class AppComponent {
  name: String
  constructor(@Inject(forwardRef(() => NameService)) nameService) {
    this.name = nameService.getName();
  }
}

class NameService {
  getName () {
    return "Angular 2";
  }
}
bootstrap(AppComponent, [NameService]);
```

What `forwardRef` does is, it takes a function as a parameter that returns a class. And because this functions isn’t immediately called but instead is called after NameService is declared it is safe to return NameService from it. In other words: At the point where `() => NameService` runs NameService isn’t undefined anymore.

The described scenario isn’t something that one has to deal with too often. This only becomes a problem when we want to have a class injected that we created in the same file. Most of the time we have one class per file and import the classes that we need at the very top of the file so we won’t actually suffer from the fact that classes aren’t hoisted.

## Host and Visiblity


## AsyncPipe

use the `AsyncPipe` in our template and expose the `Observable<Array<string>> `instead of `Array<string>`. ex: `<li *ngFor="#item of items | async"></li>`


## [Zone](https://github.com/angular/zone.js)

Zone are basically an execution context for asynchronous operations, good for error handling and profiling. Zones can perform an operation - such as starting or stopping a timer, or saving a stack trace - each time that code enters or exits a zone. They can override methods within our code, or even associate data with individual zones.

- Creating, forking and extending Zones

Once include **zone.js**, access to the global `zone` object. `zone` comes with a method `run()` that takes a function which should be executed in that zone (run our code in a zone).

```js
function main() {
  foo();
  setTimeout(doSomething, 2000);
  bar();
}

// function is in the zone, Zones can perform an operation each time our code enters or exits a zone.
zone.run(main);

// In order to set up these hooks, we need to fork the current zone. Forking a zone returns a new zone, which basically inherits from the “parent” zone. However, forking a zone also allows us to extend the returning zone’s behaviour.
var myZone = zone.fork();
myZone.run(main);
```

Zone hooks are defined using a **ZoneSpecification** that we can pass to `fork()`. We can take advantage of the following hooks:

`onZoneCreated` - Runs when zone is forked
`beforeTask` - Runs before a function called with `zone.run` is executed
`afterTask` - Runs after a function in the zone runs
`onError` - Runs when a function passed to zone.run will throw

```js
var myZoneSpec = {
  beforeTask: function () {
    console.log('Before task');
  },
  afterTask: function () {
    console.log('After task');
  }
};

var myZone = zone.fork(myZoneSpec);
myZone.run(main);
// Logs:
// Before task
// After task  // it trigger twice of before, after task because, below
// Before task
// Async task
// After task
```

It trigger twice of before, after task **Monkey-patched Hooks**. It monkey-patched methods on the global scope. As soon as we embed zone.js in our site, pretty much all methods that cause asynchronous operations are monkey-patched to run in a new zone.

For example, when we call `setTimeout()` we actually call `Zone.setTimeout()`, which in turn creates a new zone using `zone.fork()` in which the given handler is executed. And that’s why our hooks are executed as well, because the forked zone in which the handler will be executed, simply inherits from the parent zone.

There are some other methods that zone.js overrides by default and provides us as hooks: `Zone.setInterval()`, `Zone.alert()`, `Zone.prompt()`, `Zone.requestAnimationFrame()`, `Zone.addEventListener()`, `Zone.removeEventListener()`

Here is an [example](https://github.com/angular/zone.js/blob/master/example/profiling.html) of profiling zone.

## Observable

The Reactive Extensions (Rx) offer a broad range of operators that let us alter the behavior of Observables and create new Observables with the desired semantics. `Observables = Promises + Events (in a way!)`

Observables work like the clever child of Events and Promises. Promises are first class objects that encapsulate the state of an asynchronous operation. But they are for singular operations only. A request is such an operation. You invoke a method, kicking off some async task and get a first class object that eventually will get you to the result of the operation (ignoring error handling for now).

Events are for async operations that can continue to emit new values for an infinite duration. But Unfortunately they are traditionally not represented in a format that matches the criteria of a first class object. You can’t just pass an event of clicks around that skips every third click for instance.

Well, with Observables you can. You get the power of first class objects but without the limitations of singularity.
