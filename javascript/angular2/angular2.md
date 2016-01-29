Components are reusable UI building blocks and link to views

Directives create resuable behaviors that attach to the DOM and do not require associated views

Pipe is a reusable transformation used to format input to output



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

## Router

map a URL to a state of the application. The router in Angular 2 has a simple goal: allowing to have meaningful URLs reflecting the state of our app, and for each URL to know which component should be initialized and inserted in the page.

To use the router. It is an optional module, that is thus not included in the core framework. So we have to add the `ROUTER_PROVIDERS` to our injector, usually via the bootstrap method, We also need to tell the router which component is the main one, by binding `ROUTER_PRIMARY_COMPONENT`.

```js
bootstrap(PonyRacerApp, [
  ROUTER_PROVIDERS,
  provide(ROUTER_PRIMARY_COMPONENT, {useValue: PonyRacerApp})
]);
```

#### RouteConfig

Then we need to define the mapping between URLs and components. We can do this with a decorator named `@RouteConfig` exposed by the router module, usually on top of your other decorators on the main component, we must use a special tag in the template of the primary component: `<router-outlet>` to insert components into the page.

```js
@RouteConfig([
  new Route({path: '/', component: HomeCmp, name: 'Home'}),
  new Route({path: '/races', component: RacesCmp, name: 'Races'}),
])
@Component({
  selector: 'ponyracer-app',
  directives: [ROUTER_DIRECTIVES]
...
// access the hypothetical route parameters later on
myFunction(routeParams: RouteParams) {
  this.artistName = routeParams.get(‘name’);
}
```

`@RouteConfig` decorator takes an array of objects, each one being a Route instance. A route configuration is usually a triplet of properties:
• `path`: what URL will trigger the navigation
• `component`: which component will be initialized and inserted
• `name`: what name we will use to reference this route. The name must be in CamelCase, and will be used to invoke the route.

#### Naviation

`<a [router-link]=”[‘/Artist’, {name: artist.name}]”>See this artist</a>` navigate through our app with the RouterLink directive

In a template, you can add a link with the directive `RouterLink` pointing to the route alias you want to go to. The `RouterLink` directive must receive an array of strings, representing the route alias and its params. ex: `<a href="" [routerLink]="['/Home']">Home</a>`. At runtime, the link `href` will be computed by the router and will point to `/`.

The `RouterLink` directive also offers a few goodies, like the CSS class `router-link-active` which is automatically added if the link points to the current route.

## http

use the classes from the `angular2/http` module. `Http` module allows to mock your backend server and return fake responses. `Http` module heavily uses the reactive programming paradigm using `Observables`, which is different from the promise based approach in Angular 1.x.

#### Setup

`Http` module offers a service called `Http` that you can inject in any constructor. As the service is coming from another module, you have to manually make it available to your component or service. The easiest way is to add the `HTTP_PROVIDERS` in the `bootstrap` method:

```js
bootstrap(PonyRacerApp, [HTTP_PROVIDERS]);
```

To access `Response` from `http` request:
- `response.status` log status code. ex: 200
- `response.headers` log response header info. ex: []
- `response.text()` expect some text
- `response.json()` expect a JSON object, the parsing being done for you

```js
import {Http, Response} from 'angular2/http'
@Component({
  selector: 'some-component'
})
export class HttpSample {
  result: Object;
  constructor(private http: Http) {
    // The friends array on the returned object is then bound to the view.
    this.result = {friends:[]};
    http.get(`${baseUrl}/api/friends.json`)
      .map((res: Response) => {
        console.log(res.status); // logs 200
        console.log(res.headers); // logs []
        res.json().subscribe(
          res => this.result = res,
          error => this.error = error
        }
      );
  }
}
```

By default, the Http service will do AJAX request using `XMLHttpRequest`.

It offers several methods, matching the most common HTTP verbs:
`get post put delete patch head`, All these methods are just syntactic sugar, and they all call the method `request` under the hood, and all these methods return an `Observable` object with benefits like cancel requests, to retry,
to easily compose them, etc…

Post ex: `http.post(`${baseUrl}/api/races`, newRace)`

#### Transforming data

As we are getting an `Observable` object as a response, you can easily transform the data. import the `map` operator for RxJS, angular does not import RxJS library, you have to explicitly import yourself.

```js
import 'rxjs/add/operator/map';
...
http.get(`${baseUrl}/api/races`)
  // extract json body
  .map(res => res.json())
  // transform [races] => [names]
  .map((races: Array<any>) => races.map(race => race.name))
  .subscribe(names => {
  console.log(names);
  // logs the array of the race's names
});
```

This kind of work will usually be done in a dedicated service. I tend to create a service where all the job is done. Then, my component just needs to subscribe to my service method, without knowing what’s going on under the hood.

```js
raceService.list()
  // if the request fails, retry 3 times
  .retry(3)
  // transform [races] => [names]
  .map(races => races.map(race => race.name))
  // logs the array of the race's names
  .subscribe(names =>  console.log(names));
```

#### Advanced options

Tune your requests more finely. Every method takes a `RequestOptions` object as an optional parameter, where you can configure your request. A few options are really useful and you can override everything in the request. Some of these options have the exact same values as the ones offered by the [Fetch](https://github.com/github/fetch) API. The url option is pretty obvious and will override the URL of the request. The method option is the HTTP verb to use, like `RequestMethod.Get`. If you want to build a request manually,
you can write:

```js
let options = new RequestOptions({method: RequestMethod.Get});
http.request(`${baseUrl}/api/races/3`, options)
  .subscribe(response => {
  // will get the race with id 3
  });
```

`search` represents the URL params to add to the URL. You specify them using the `URLSearchParams` class, and the complete URL will be constructed for you.

```js
let searchParams = new URLSearchParams();
searchParams.set('sort', 'ascending');
let options = new RequestOptions({search: searchParams});
http.get(`${baseUrl}/api/races`, options)
  .subscribe(response => {
    // will return the races sorted
    races = response.json();
  });
```

`headers` option is often useful to add a few custom headers to your request. It happens to be necessary for some authentication techniques like JSON Web Token for example:

```js
let headers = new Headers();
headers.append('Authorization', `Bearer ${token}`);
http.get(`${baseUrl}/api/races`, new RequestOptions({headers}))
  .subscribe(response => {
    // will return the races visible for the authenticated user
    races = response.json();
  });
```

#### Jsonp

To let you access their API without being blocked by the Same Origin Policy enforced by web browsers, some web services don’t use CORS, but use JSONP (JSON with Padding).

The server will not return the JSON data directly, but wrap them in the function passed as a callback. The response comes back as a script, and scripts are not subject to the Same Origin Policy. Once loaded, you can access the JSON value contained in the response.

In addition to the `Http` service, the Http module also provides a `Jsonp`service that makes it easy to interact with such APIs, and does all the dirty job for us. All you have to do is specify the URL of the service you want to call, and add `JSONP_CALLBACK` as the callback parameter value.

```js
// fetching all the public repos from our Github organization using JSONP
jsonp.get('https://api.github.com/orgs/Ninja-Squad/repos?callback=JSONP_CALLBACK')
  // extract json
  .map(res => res.json())
  // extract data
  .map(res => res.data)
  .subscribe(response => {
    // will return the public repos of Ninja-Squad
    repos = response;
  });
```

#### Tests

"fake" the HTTP call to return fake data. To do this, we can replace the dependency to the `Http` service with a fake implementation using a class provided by the framework called `MockBackend`:

```js
@Injectable()
export class RaceService {
  constructor(private http: Http) { }
  list() {
    return this.http.get('/api/races').map(res => res.json());
  }
}

// To Test code above
import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {Http, BaseRequestOptions, Response, ResponseOptions} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';
import {provide} from 'angular2/core';
import 'rxjs/add/operator/map';

describe('RaceService', () => {
  beforeEachProviders(() => [
    MockBackend,
    BaseRequestOptions,
    provide(Http, {
      useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
      deps: [MockBackend, BaseRequestOptions]
    }),
    RaceService
  ]);

  it('should return an Observable of 2 races',
    inject([RaceService, MockBackend], (service, mockBackend) => {
      // fake response
      let hardcodedRaces = [new Race('London'), new Race('Lyon')];
      let response = new Response(new ResponseOptions({body: hardcodedRaces}));
      // return the response if we have a connection to the MockBackend
      mockBackend.connections.subscribe(connection => connection.mockRespond(response));

      service.list().subscribe(races => {
        expect(races.length).toBe(2);
      });
    })
  );
});
```

#### Dependent calls

ex: make an initial call to load a customer. The returned customer object contains a contract url that I will be using to load a contract for that particular customer.

```js
this.http.get('./customer.json').map((res: Response) => {
     this.customer = res.json();
     return this.customer;
  })
  .flatMap((customer) => this.http.get(customer.contractUrl)).map((res: Response) => res.json())
  .subscribe(res => this.contract = res);
```

#### Parallel requests

list out the parallel calls and get the result back in an array. Below is an example of how to request a list of friends and a customer in parallel.

```js
import {Observable} from 'rxjs/Observable';
Observable.forkJoin(
  this.http.get('./friends.json').map((res: Response) => res.json()),
  this.http.get('./customer.json').map((res: Response) => res.json())
).subscribe(res => this.combined = {friends:res[0].friends, customer:res[1]});
```

#### Cancel Observables

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

#### Simple Post Call

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

#### Promises

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

When we declare a dependency in a component, it will look into the registry if it can find it, will get the instance of the dependency or create one, and actually inject it in our component. A dependency can be a service provided by Angular, or a service we have written ourselves.

Angular2 provides a simple and powerful DI container. It has a single API for injecting dependencies and it also provides ways to control lifecycle of dependencies and specify the type of dependency to be injected when a type is requested. The DI works in the same hierarchy in which the components are built. Dependencies have to be declared along with annotations of the components. A dependency declared on a component can be used either by the same component or by any of the children of the component. Children components can override the way a dependency is declared in the parent as well.

```js
// Class is in control (tightly coupled)
class Foo {
  private bar: Bar;
  constructor() {
    this.bar = new Bar();
  }
}

// inversion of control - now the class is no longer in control (Loosely coupled). Inject into constructor (DI), means DI is injected for you.
class Foo {
  private bar: Bar;
  constructor(bar: Bar) {
    this.bar = bar;
  }
}
```

Angular2 DI is Just in time, Based on principle of "providers" (`Values`, `Factories`, `Classes`, `Tokens`), Asynchronous module definition, Annotation (`Injector`, `Pipes`, `Directives`)

Two steps process to create a DI services, 1. define the Injectable service  2. register service to make it available for injection. For 2nd step, we could do it via 2nd parameter of `bootstrap` or via `providers` in `@Component`

```js
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

// To inform Angular 2 that this service has some dependencies itself, we need to add a class decorator
@Injectable()
export class RaceService {
  // _http field referencing the Http service.
  constructor(private _http: Http) {}
  list() {
    return this._http.get('http://localhost:9000/races').map(res => res.json());
  }
}
```

#### Configure

```js
// PonyRacerApp depends on RaceService, RaceService depends on Http
bootstrap(PonyRacerApp, [HTTP_PROVIDERS, RaceService]);
```

In the longer form of the code above,

```js
import {provide} from 'angular2/core';
// ...
bootstrap(PonyRacerApp, [
  HTTP_PROVIDERS,
  provide(RaceService, {useClass: RaceService})
]);
```

We are telling the `Injector` that we want to create a link between a token (the type `RaceService`) and the class `RaceService`, using the `provide` method. The Injector is a service which keeps track of the injectable components by maintaining a registry and actually injects them when needed.

The registry is a map that associates keys, called tokens, with classes. The tokens are not, like in many dependency injection frameworks, necessarily Strings. They can be anything, like Type references.

Since, in our example, the token and the class to inject are the same, you can write the same thing in the shorter form: `bootstrap(PonyRacerApp, [HTTP_PROVIDERS, RaceService]);`

Ex: we can ask the injector for a dependency with the get method and a token. As I have declared the `RaceService` twice, with two different tokens, we have two providers. The injector will create an instance of `RaceService` the first time it is asked to for a specific token, and then returns the same instance for this token every time. It will do the same for each provider, so here we will actually have two instances of `RaceService` in our app, one for each token.

However, you will not use the token very often, or even at all. In TypeScript, you rely on the types to get the job done, so the token is a Type reference, usually bound to the corresponding class. If you want to use another token, you have to use the decorator `@Inject()`

```js
import {provide} from 'angular2/core';
// ...
bootstrap(PonyRacerApp, [
  HTTP_PROVIDERS,
  provide(RaceService, {useClass: RaceService}),
  // add another provider to the same class with another token
  provide('RaceServiceToken', {useClass: RaceService})
]).then(
  // and play with the returned injector
  appRef => {
    console.log(appRef.injector.get(RaceService));
    // logs "RaceService {_http: Http}"
    console.log(appRef.injector.get('RaceServiceToken'));
    // logs "RaceService {_http: Http}" again
    console.log(appRef.injector.get(RaceService) === appRef.injector.get(RaceService));
    // logs "true", as the same instance is returned every time for a token
    console.log(appRef.injector.get(RaceService) === appRef.injector.get('RaceServiceToken'));
    // logs "false", as the providers are different so there are two distinct instances
  }
);
```

This whole example was just to point out a few things:
• a provider links a token to a service.
• the injector returns the same instance every time it is asked the same token. (singleton, share information between components using a service, and you will be sure they share the same service instance.)
• we can have a token name different than the class name

Benefit in unit testing, It’s just to return the same result type as the Http service. We can use the provider declaration to replace `RaceService` with our `FakeRaceService`

```js
import {provide} from 'angular2/core';
// ...
bootstrap(PonyRacerApp, [
  HTTP_PROVIDERS,
  // we provide a fake service
  provide(RaceService, {useClass: FakeRaceService})
])
```

Service is a concept to share data between components.


#### Other types of providers

**useFactory**

we might want to use `FakeRaceService` when we are developing our app, and use the real `RaceService` when we are in production. You can change it manually of course, but you can also use another type of provider: `useFactory`.

We are using `useFactory` instead of `useClass`. A factory is a function with one job, creating an instance.

if we switch back to the real service, as we are using `new` to create the `RaceService`, it will not have its `Http` dependency instantiated! Good news: `useFactory` can be used with another property named `deps`, where you can specify an array of dependencies. Be careful, the order of the parameters should be the same as the order in the array if you have several dependencies!

```js
import {provide} from 'angular2/core';
// ...
const IS_PROD = false;
bootstrap(PonyRacerApp, [
  HTTP_PROVIDERS,
  // we provide a factory
  provide(RaceService, {
    // the http instance will be injected in the factory
    // so we can pass the http instance to RaceService
    useFactory: http => IS_PROD ? new RaceService(http) : new FakeRaceService(),
    // array with the dependencies needed
    deps: [Http]
  })
])
```

Of course, this example is just to demonstrate the use of `useFactory` and its dependencies. You could, and should, write:

```js
bootstrap(PonyRacerApp, [
  HTTP_PROVIDERS,
  provide(RaceService, {useClass: IS_PROD ? RaceService : FakeRaceService})
])
```

**useValue**

But how can we declare two different tokens referencing the same instance? That’s where `useExisting` comes into play.

```js
import {provide} from 'angular2/core';
// ...
bootstrap(PonyRacerApp, [
  HTTP_PROVIDERS,
  provide('RaceServiceToken', {useClass: RaceService}),
  // let's add another token this time using `useExisting`
  provide(RaceService, {useExisting: 'RaceServiceToken'})
])

// the other three results are the same (see above), the last one is different
console.log(appRef.injector.get(RaceService) === appRef.injector.get('RaceServiceToken'));
// logs "true", as the second provider is for an existing token,
// so there is just one instance where it was "false" when using `useClass`
```

#### Hierarchical injectors

there are several injectors in your app. In fact, there is one injector per component, and this injector inherits from the injector of its parent.

Root component inject Dependency into child component, child component inject Dependency into grand child component. In aonther word, When we bootstrap the app, we create the root injector. Then, every component will create its own
injector, inheriting its parent one.

It means that when we are declaring a dependency in a component, Angular 2 will begin its search in the current injector. If it finds the dependency, perfect, it returns it. If not, it will do the same in the parent injector, and again, until it finds the dependency. It it doesn’t, it will throw an exception.

**One facts** the dependencies declared in the root injector are available for every component in the app. ex: `HTTP_PROVIDERS` can be used everywhere.

**provider**

The `@Component` decorator can take another configuration option, called `providers`. This providers attribute can take an array with a list of dependencies, as we did for the bootstrap method.

ex: `providers: [provide(RaceService, {useClass: FakeRaceService})],`

As a **rule of thumb**, if only one component needs to have access to a service, it’s a good idea to only provide this service in the component’s injector, using the providers attribute. If the dependency can be used by the whole app, declare it in the bootstrap method.

#### Binding multiple values

As you saw, you can have only one value per token: if you define another one, it will replace the first binding. But, sometimes, you want to declare a collection of values and be able to add an element to the collection.

To do this, we have a useful option called `multi`. By default, this option is `false`; but if a binding is declared using `multi: true`, then it’s possible to add other values to this binding later.

```js
// declare a token 'greetings' bound to the value 'hello'. Later we can add another value to the 'greetings' collection:
bootstrap(PonyRacerApp, [
  provide('greetings', {useValue: 'hello', multi: true}),
  // let's add another value to the collection
  provide('greetings', {useValue: 'hi', multi: true})
])

// the injector returns the collection of values:
console.log(appRef.injector.get('greetings')); // logs "['hello', 'hi']"
```

#### DI without types

If you want to use a token and not rely on TypeScript types, you will have to add a decorator for each dependency you want to inject. The decorator is `@Inject()`` and receives the token of the dependency you want to inject.

```js
import { Injectable, Inject } from 'angular2/core';
import { Http } from 'angular2/http';

@Injectable()
export class RaceService {
  constructor(@Inject(Http) http) {
    this._http = http;
  }
}
```

## Zones

Angular 2 uses a new concept called `zones`. These zones are execution contexts, and, to simplify, they keep track of all the stuff going on within them (timeouts, event listeners, callbacks…). They also provide hooks that can be called when we enter or leave the zone. An Angular 2 application runs in a
zone, and that’s how the framework knows it has to refresh the DOM when an async action is done.

It does the heavy lifting of running our code in isolated zones for detecting the changes.

After the application starts, we need a process to keep running behind the scenes that kicks in the process of change detection so that the model and the UI are always in sync. Angular 2 includes a library called Zone.js, which helps us in keeping things always in sync. A zone is an execution context that persists across async tasks. All operations performed in Angular 2 are carried under this context. We don’t need to invoke them or attach operations to them. Zones know what kind of operations to be handled in the context.

## Template

• `{{}}` for interpolation
• `[]` for property binding
• `()` for event binding
• `#` for variable declaration
• `*` for structural directives

One important fact to remember, though: if we try to display a variable that does not exist, then, instead of displaying `undefined`, Angular is going to display an empty string. The same will happen for a `null` variable.

If my user object is in fact fetched from the server, and thus initialized to `undefined` before being valued with the result of the server call? To avoid the errors when the template is compiled, instead of writing `{{user.name}}`, you write `{{user?.name}}`. The `?.` is sometimes called the "Safe Navigation Operator".

Every DOM property can be written to via special attributes on HTML elements
surrounded with square brackets `[]`. It is valid HTML. An HTML attribute can start with pretty much anything you want except a few characters like
quotes, apostrophes, slashes, equals, spaces…

```html
<p>{{user.name}}</p>

<!-- is just sugar syntax for the following: -->
<p [textContent]="user.name"></p>
```

- properties

Angular 2 is using properties. Which values can we pass? We already saw the interpolation `property="{{expression}}"`. ex: `<pony-cmp name="{{pony.name}}"></pony-cmp>`

- Easily handle keyboard events

Every time you will press the `space` key, the `onSpacePress()` method will be called. And you can do crazy combo, like `(keydown.alt.space)`, etc…

```html
<textarea (keydown.space)="onSpacePress()">Press space!</textarea>
```

- Overview

property binding, the `doSomething()` value is called an expression, and will be evaluated at each change detection cycle to see if the property needs to be updated.

An expression will be executed many times, as part of the change detection. It should thus be as fast as possible.

Note: 1. you are using `user.name` as an expression, `user` should be defined, otherwise Angular will throw an error.  2. An expression must be single: you can’t chain several ones separated with a semi-colon.  3. An expression should not have any side effect. That means it can’t be an assignment,

```html
<component [property]="doSomething()"></component>
```

event binding, the doSomething() value is called a statement, and will
be evaluated only when the event is triggered.

A statement is triggered on the matching event. If you try to use a statement like `race.show()` where race is `undefined`, you will have an error. You can chain several statements, separated with a semi-colon. A statement can, and generally should, have side effects. That’s the point of reacting to an event: to make something happen. A statement can be a variable assignment, and can
contain keywords.

```html
<component (event)="doSomething()"></component>
```

- Local Variable (#localVal: HTMLInputElement)

Using the `#` syntax, we are creating a local variable name referencing the DOM object `HTMLInputElement`. This local variable can be used anywhere in the template. As it has a value property, we can display this property in an interpolated expression.

```html
<!-- give the focus on an element when you click on a button. -->
<input type="text" #name>
<button (click)="name.focus()">Focus the input</button>
```

**Note**

When using local template variables you can not use camel case names, e.g. `#myVar`. This would result in a variable named `myvar`. This is because the browser forces all attribute names in an element to lowercase. If you want your local templates variables to be more readable it is recommended to separate single words in the variable name by including dashes, e.g. `#my-var`. This would result in a variable named `my-var`.

- structural directive (Built-in Angular 2 Components)

Angular 2 comes bundled with a set of built-in components. ex: `NgIf` and `NgFor`.

The syntax uses `*` to show it is a structural directive. The `ngIf` will now display or not the div whenever the value of races is changing.

**NgIf**

`NgIf` is used to hide or display an element based on the evaluation of an expression. If the result of the expression returns false, the element will be removed from the resulting DOM. ex: `<div *ng-if="var1 == 'A'">var1 is A</div>`

**NgFor**

Use `NgFor` directive on this attribute. `*ngFor` is a for loop; the idea is that we’re creating a new DOM element for every item in a collection.

`#name of names` names is our array of names as specified on the `HelloWorld`
object. `#name` is called a reference. When we say "#name of names" we’re saying loop over each element in names and assign each one to a variable called `name`

```html
<!-- It is possible to declare another local variable bound to the index of the current element: -->
<li *ngFor="#race of races; #i=index">{{i}} - {{race.name}}</li>
```

The local variable `i` will receive the index of the current element, starting at zero. `index` is an exported variable. Some directives export variables that you can then affect to a local variable to be able to use them in your template.

There are also other exported variables that can be useful:

• even, a boolean that is true if the element has an even index
• odd, a boolean that is true if the element has an odd index
• last, a boolean that is true if the element is the last of the collection

```html
<li *ngFor="#pony of ponies; #isEven=even"
  [style.color]="isEven ? 'green' : 'black'">
  {{pony.name}}
</li>
```

**NgSwitch**

The NgSwitch consists of three directives: `NgSwitch`, `NgSwitchWhen`, `NgSwitchDefault`

```html
<div [ngSwitch]="messageCount">
  <p *ngSwitchWhen="0">You have no message</p>
  <p *ngSwitchWhen="1">You have a message</p>
  <p *ngSwitchDefault>You have some messages</p>
</div>
```

**NgStyle**

act on the style of an element. ex: `<div [ngStyle]="{fontWeight: fontWeight, color: color}">I've got style</div>`

Another way to apply dynamic styling is to use the following syntax: `<div [style.background-color]="blue">Blue background</div>`

**NgClass**

allows to add or remove classes dynamically on an element. ex: `<div [ngClass]="{'awesome-div': isAnAwesomeDiv(), 'mystyle:': isActive}">I've got style</div>`. The component class (constructor) consists of the property `isActive` of type Boolean. use `.mystyle` css class to style element.

**NgNonBindable**

The `ngNonBindable` directive tells Angular not to compile or bind the contents of the current DOM element. This is useful if the element contains what appears to be Angular directives and bindings but which should be ignored by Angular. This could be the case if you have a site that displays snippets of code. ex: `<div ng-non-bindable>Ignored: {{1 + 2}}</div>` The result is that the {{1 + 2}} is not processed by Angular and the output text is Ignored: {{1 + 2}}.

## Directives

In Angular 2 there are 3 types of directives: `Components` (These are directives with templates.), `structural directive` (There are directives the modify the DOM, ex: NgIf, NgFor), `Attribute directive` (These change behaviors of an element or of the other directives. ex: `<left-nav off-click></left-nav>`)

- [Attribute directive example](https://angular.io/docs/ts/latest/guide/attribute-directives.html) and [Directive API](https://angular.io/docs/ts/latest/api/core/Directive-decorator.html)

```js
// off-click.directives.ts
import {Directive, Host, Dependency, Input} from 'angular2/core';
@Directive({
  selector: '[offClick]',
  inputs: ['offClick'],
  // STOP THE PROPAGATION OF ANY CLICKS ON THE ELEMENT
  // use `host` property in the directive decorator to call the click handler which is declared in directive class.
  host: {
    '(click)': 'onClick($event)',
  }
})
export default class OffClickDirective {
  @Input('offClick') offClickHandler; // RECEIVE HANDLER AS ATTRIBUTE VALUE

  constructor() {
  }

  ngOnInit() {
    // The attachment of handler to document is done inside a timeout so as to ensure it executes only after the element is visible. Timeout 0 pushes it to end of the Javascript execution queue
    setTimeout(() => {
      // ATTACH THE HANDLER TO DOCUMENT CLICK ONCE VIEW IS LOADED
      document.addEventListener('click', this.offClickHandler);
    }, 0);
  }

  ngOnDestroy() {
    // remove this event listener in OnDestroy:
    document.removeEventListener('click', this.offClickHandler);
  }

  onClick($event) {
    $event.stopPropagation();
  }
}

// Usage in the parent component
import {Component} from 'angular2/core';
import OffClickDirective from "./off-click.directive";

@Component({
  selector: 'app',
  directives: [OffClickDirective],
  template: `<div class="wrapper">
    <button (click)="toggleDiv($event)">Toggle div</button>
    <div *ngIf = "showDiv" [offClick]="clickedOutside">
      Click outside me to hide me
    </div>
  </div>`
})
export class AppComponent {
  showDiv:boolean = false;
  constructor(){
    this.clickedOutside = this.clickedOutside.bind(this);
  }

  toggleDiv($event){
    $event.stopPropagation();
    this.showDiv = !this.showDiv;
  }

  clickedOutside(){
    this.showDiv = false;
  }
}
```

A directive is very much like a component, except it does not have a template. In fact, the Component class inherits from the Directive class in the framework. As for a component, your directive will be annotated with a decorator, but instead of `@Component`, it will be `@Directive`.

Angular 2 are used to extend HTML, similar to the way DOM appears and they provide ways to get into life cycle events to take better control over the way a directive works. Architecture of the directives in Angular 2 embraces bindings a lot and hence reduces the need of direct DOM manipulation. Also, we don’t need to deal with different restrict types as well as with the camel case notation while naming directives; both of these properties are handled by a single selector property.

if you add a component in your template, you must also add it in the `directives` attributes of your `@Component` decorator.

There are three different types of directives in Angular 2:

- Component Directives

Everything in an Angular 2 application is a component, looks like a tree of components. The application starts by bootstrapping a component and other components are rendered as children of this component. The components are used to define a new HTML element.

the component is a class decorated with the annotations Component. An object of this class is the view model for the component. Any public property defined in this class can be used to bind data in the component’s template.

- Decorator Directives

A decorator is the simplest kind of directive. It is used to extend behavior of an HTML element or an existing component. This directive doesn’t make a lot of impact on the view, but helps in achieving certain small yet important functionalities on the page. A decorator directive is a class with the Directive applied on it.

- Directives with ViewContainer

The directives that use a `ViewContainerRef` object can take control over the content of the element on which they are applied. These directives can be used when template of the view has to be shown/hidden based on a condition, to iterate over or, to tweak the content based on a scenario. The directives like `ng-for` and `ng-if` fall into this category.

#### Inputs

Inputs are great to pass data from a top element to a bottom element.

When a top component to pass data to one of its children, you will use a property binding, using the `inputs` attribute of the `@Directive` decorator. This attribute accepts an array of strings, each one of the form `property: binding`.

`property` represents the directive instance property.
`binding` is the DOM property that will contain the expression.

```js
@Directive({
  selector: '[loggable]',
  inputs: ['text: logText']
  // if the property and the binding have the same name:
  // inputs: ['text']
})
export class SimpleTextDirective {
}

// output: <div loggable logText="Some text">Hello</div>
```

If you want to bind a DOM property to an attribute of your directive that has the same name, you can simply write `property` instead of `property: binding`.

There is another way to declare an input in your directive: with the `@Input`decorator.

```js
@Directive({
  selector: '[loggable]'
})
export class InputDecoratorDirective {
  @Input('logText') text: string;
  // if the property and the binding have the same name:
  // @Input() logText: string;
}
```

#### Outputs

In Angular 2, data flows into a component via properties, and flows out of a
component via events.

Custom events are emitted using an `EventEmitter`, and must be declared in the decorator, using the `outputs` attribute. Like the `inputs` attribute, it accepts an array with the list of events you want your directive/component to emit.

Let’s say we want to emit an event called ponySelected. We have three things to do:
• declare the output in the decorator
• create an EventEmitter
• emit an event when the pony is selected

```js
@Component({
  selector: 'pony-cmp',
  inputs: ['pony'],
  // we declare the custom event as an output
  outputs: ['ponySelected'],
  // the method `selectPony()` will be called on click
  template: `<div (click)="selectPony()">{{pony.name}}</div>`
})
export class SelectablePonyCmp {
  pony: Pony;
  // the EventEmitter is used to emit the event
  ponySelected: EventEmitter<Pony> = new EventEmitter<Pony>();
  // Selects a pony when the component is clicked. Emits a custom event.
  selectPony() {
    this.ponySelected.emit(this.pony);
  }
}

// usage in the parent component
// <pony-cmp [pony]="pony" (ponySelected)="betOnPony($event)"></pony-cmp>
```

If you wish, you can specify an event name different than the event emitter name, with the syntax `emitter: event`

```js
@Component({
  selector: 'pony-cmp',
  inputs: ['pony'],
  // the emitter is called `emitter // and the event `ponySelected`
  outputs: ['emitter: ponySelected'],
  template: `<div (click)="selectPony()">{{pony.name}}</div>`
})
export class OtherSelectablePonyCmp {
  pony: Pony;
  emitter: EventEmitter<Pony> = new EventEmitter<Pony>();
  selectPony() {
    this.emitter.emit(this.pony);
  }
}
```

#### LifeCycle hooks

A lifecycle hook is just an event that Angular fires off after some event occurs. We can "hook" on to these events with specifically named methods that work as event listeners. Each one of the Lifecycle hooks has an interface class you can implement with that hook. This will give you complier warnings and errors if you've forgotten to implement the hook, might give you auto-complete hints.

- Typical call order

Component Initialization:

`onChanges -> onInit -> afterContentInit -> afterContentChecked -> afterViewInit -> afterViewChecked`

Component input binding variable changed:

`afterContentChecked -> afterViewChecked -> onChanges -> afterContentChecked -> afterViewChecked`

(this may change based on how you're changing the variables and how you handle the hooks)

Component is being destroyed:

`afterContentChecked -> afterViewChecked -> onDestroy`

In all cases, change out `DoCheck` for `onChanges` if you're using `DoCheck`.



You may want your directive to react on a specific moment of its life.

One thing is really important to understand though, and you’ll save quite some time if you do: the inputs of a component are not evaluated yet in its constructor.

- Several phases are available, and have their own specificity:

**ngOnChanges** Interface Class: OnChanges

Immediately on creation, then whenever an input or output binding value has changed. A note to remember, this won't fire when the input value is changed internally by the component, only when it is changed by the parent.

will be the first to be called when the value of a bound property changes. It will receive a `changes` map, containing the current and previous values of the binding, wrapped in a `SimpleChange`. It will not be called if there is no change.

```js
@Directive({
  selector: '[changeDirective]'
})
export class OnChangesDirective implements OnChanges {
  @Input() pony: string;
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    console.log(`changed from ${changes.pony.previousValue} to ${changes.pony
  .currentValue}`);
  }
}
```

**ngOnInit** Interface Class: `OnInit`

Called on initialization. This only gets called **once** during the life of the component. Typically the second hook to be called (after the first `onChanges`), (whereas `ngOnChanges` is called on every changes.

**ngOnDestroy** InterfaceClass: OnDestroy

called **Once** Immediately before the component is destroyed

- Other phases are available, but are for more advanced use cases:

**ngDoCheck** Interface Class: DoCheck

This is called INSTEAD of ngOnChanges if you're using DoCheck. ngDoCheck is called whenever an input or output binding variable is set. You use DoCheck when you know better than Angular's default algorithm when something has changed. Perhaps this is because you can do it more efficiently, or maybe it's because you want to track changes differently than Angular does by default. This could warrant its down blog post on how to use it if people are interested.

If present it will be called at each change detection cycle, overriding the default change detection algorithm, which looks for difference between every bound property value. That means that if at least one input has changed, by default the component is considered changed by the framework, and its children will be checked and rendered. But you can override it if you know that some inputs have no effect even if they have changed. That can be useful if you want to accelerate the change detection by just checking the bare minimum and not using the default algorithm, but usually you will not use this.

**ngAfterContentInit** Interface Class: AfterContentInit

is called when all the bindings of the component have been checked for the first time.

Called **Once** after the content of the component has been initialized. This is not the view itself, but the contents of the component on the logic side.

**ngAfterContentChecked** Interface Class: AfterContentChecked

is called when all the bindings of the component have been checked, even if they haven’t changed.

Called every time the content of the component has been checked. This could be when the input bindings, child components, or child directives are changed, added, or removed.

**ngAfterViewInit** Interface Class: AfterViewInit

is called when all the bindings of the children directives have been checked for the first time.

Called **Once**, After the content is checked the first time, once the component view has been initialized. Use this when you need to do something to the view right away, but only once. This is similar to afterContentInit, but has the view available.

**ngAfterViewChecked** Interface Class: AfterViewChecked

is called when all the bindings of the children directives have been checked,
even if they haven’t changed. It can be useful if your component is waiting for something coming from its child components. Like `ngAfterViewInit`, it only makes sense if we are in a component (a directive has no view).

After anything changes the view. Typically this is caused by something like a data-bound variable changing, but that's not the only possibility. Use this when you need to do something whenever the view is changed. Maybe you need to validate something, or maybe you need to inject something based on a variable. The sky's the limit. Just make sure you don't get yourself into an infinite loop.

## Components

A component is not really different from a directive: it just has two more optional attributes and must have an associated view.

#### View providers

`viewProviders` is slightly similar but the providers will only be available for the current component, not for its children.

#### Template / Template URL

The main feature of a @Component is to have a template, whereas a directive does not have one. You can use an absolute path for your URL, a relative one or even a complete HTTP URL.

#### Styles / Styles URL

specify the styles of your component via `styles` or `styleUrls`.

#### Making a component available everywhere

Add our custom directives and components in this collection (`PLATFORM_DIRECTIVES`), and remove the burden of having to manually include them later in each component using them.

```js
bootstrap([
  provide(PLATFORM_DIRECTIVES, {useValue: PonyCmp, multi: true})
]);
```

## Pipes

Used to transform raw data, filter data, limit their number.

To use a pipe, you have to add a pipe `|` character after your data, and then the name of the pipe you want to use. It can be chained several pipes, one after another.

To pass an argument to a pipe, you have to add a colon `:`, then the first argument, then possibly, another colon and the second argument etc…

Syntax: `expression | [pipe][:pipe_parameter]`
Multiple pipes: `expression | [pipe_1][:pipe_parameter] | [pipe_2][:pipe_parameter] | … | [pipe_-n][:pipe_parameter]`

**json**

handy when you are debugging your app is `JsonPipe`. Basically, this pipe applies `JSON.stringify()` to your data. ex: `<p>{{ arrayData | json }}</p>`. output `<p>[ { "name": "Rainbow Dash" }, { "name": "Pinkie Pie" } ]</p>`

**slice**

It works like the slice method in JavaScript, and takes two arguments: a start index and, optionally, an end index. slice works with arrays and strings, so you can also truncate a string. ex: `<p>{{ strData | slice:0:2 | json }}</p>`
ex: `<div *ngFor="#pony of ponies | slice:0:2">{{pony.name}}</div>` created only two div here.

**uppercase** and **lowercase**

ex: `<p>{{ 'Ninja Squad' | uppercase }}</p>`

**number**

This pipe allows to format a number. It takes one parameter, a string, formatted as `{integerDigits}.{minFractionDigits}-{maxFractionDigits}`, but every part is optional. Each part indicates: `expression | number[:digitInfo]`

• how many numbers you want in the integer part
• how many numbers you want at least in the decimal part
• how many numbers you want at most in the decimal part

```html
<p>{{ 12345 }}</p> <!-- will display '12345', no pipe -->

<p>{{ 12345 | number }}</p> <!-- will display '12,345', Using the number pipe will group the integer part, even with no digits required -->

<p>{{ 12345 | number:'6.' }}</p> <!-- will display '012,345', `integerDigits` parameter will left-pad the integer part with zeros if needed: -->

<p>{{ 12345 | number:'.2' }}</p> <!-- will display '12,345.00' `minFractionDigits` is the minimum size of the decimal part, so it will pad zeros on the right until reached -->

<!-- The maxFractionDigits is the maximum size of the decimal part. You have to specify a `minFractionDigits`, even at 0, if you want to use it. If the number has more decimals than that, then it is rounded: -->
<p>{{ 12345.13 | number:'.1-1' }}</p> <!-- will display '12,345.1' -->

<p>{{ 12345.16 | number:'.1-1' }}</p> <!-- will display '12,345.2' -->
```

**NOTE: The pipe (percent, currency and date) relies on the Internationalization API of the browser, and this API is not available in every browser right now. This is a known problem**

**percent**

Based on the same principle as `number` with the same rule of parameters, `percent` allows to display a percentage! `expression | percent[:digitInfo]`

```html
<p>{{ 0.8 | percent }}</p> <!-- will display '80%' -->
<p>{{ 0.8 | percent:'.3' }}</p> <!-- will display '80.000%' -->
<p>{{ 0.8 | percent:'3.1-1' }}</p>
```

**currency**

format an amount of money in the currency, require at least one parameter. By using the CurrencyPipe you can format a number into a local currency string. `expression | currency[:currencyCode[:symbolDisplay[:digitInfo]]]`

• the ISO string representing the currency ('EUR', 'USD'…)
• optional, a boolean flag to say if you want to use the symbol ('€', '$') or the ISO string. By default, the flag is false, and the symbol will not be used.
• optional, a string to format the amount, using the same syntax as number.

```html
<p>{{ 10.6 | currency:'EUR' }}</p> <!-- will display 'EUR10.6' -->
<p>{{ 10.6 | currency:'USD':true }}</p> <!-- will display '$10.6' -->
<p>{{ 10.6 | currency:'USD':true:'.2' }}</p> <!-- will display '$10.60' -->
```

**date**

It formats a date value to a string of the desired format. The date can be a `Date` object or a number of milliseconds. The format specified can be either a pattern like 'ddMMyyyy', 'MMyy' or one of the predefined symbolic names available like 'short', 'longDate', etc…:

```html
<p>{{ birthday | date:'ddMMyyyy' }}</p> <!-- will display '07/16/1986' -->
<p>{{ birthday | date:'longDate' }}</p> <!-- will display 'July 16, 1986' -->
<p>{{ birthday | date:'HHmmss' }}</p> <!-- will display '15:30:00' -->
<p>{{ birthday | date:'shortTime' }}</p> <!-- will display '3:30 PM' -->

dd-MM-yyyy, ddMMyyyy, MM-dd-yyyy  should all work.
```

**async**

The async pipe allows data obtained asynchronously to be displayed. Under the hood, it uses `PromisePipe` or `ObservablePipe` depending if your async data comes from a Promise or an Observable.

The async pipe returns an empty string until the data is finally available (i.e. until the promise is resolved, in case of a promise). Once resolved, the resolved value is returned. More importantly, it triggers a change detection check once the data is available.

```js
import {Component} from 'angular2/core';
@Component({
  selector: 'greeting-cmp',
  template: `<div>{{ asyncGreeting | async}}</div>`
})
export class GreetingCmp {
  asyncGreeting: Promise<string> = new Promise(resolve => {
    // after 1 second, the promise will resolve
    window.setTimeout(() => resolve('hello'), 1000);
  });
}
```

Even more interesting, if the source is an Observable, then the pipe will do the unsubscribe part itself, when the component is destroyed (for example when the user navigates to another component).

**Create your own pipes**

It should implement the `PipeTransform` interface, which forces us to
have a `transform()` method, the one doing the heavy lifting.

```js
import {PipeTransform, Pipe} from 'angular2/core';
@Pipe({name: 'PipeNameHere'})
export class FromNowPipe implements PipeTransform {
  transform(value, args:string[]): any {
    // do something here
  }
}
```

Bonus, make your `pipe` available everywhere and remove the burden of having to declare it in the pipes attribute of the `@Component` decorator. Just add your custom pipes to the default collection of pipes which is loaded for us at
startup and makes these pipes available in our templates without having to declare them.

This collection is called `PLATFORM_PIPES` and it contains all the pipes we saw. To add our custom pipe we use dependency injection, as usual, with a provider to add a new value to the existing collection. And, maybe you’ve guessed, we have to use the `multi` option:

```js
// after define here, no need to declare any `pipes` attribute
bootstrap([
  provide(PLATFORM_PIPES, {useValue: FromNowPipe, multi: true})
])
```

## Services

classes you can inject in an other.

Angular 2 doesn’t have the concept of services. Anything other than directives are simple classes. Good thing is, we can apply dependency injection on these classes and these classes can be injected into any directives. We can consider any plain simple class as a service, classes you can inject in an other.

#### Core Services: just one now

- Title service

change the title of my page. There is a `Title` service you can inject and it offers a getter and a setter method. The service will automatically create the title element in the head if needed and correctly set the value for you!

```js
import {Component} from 'angular2/core';
import {Title} from 'angular2/platform/browser';
@Component({
  selector: 'ponyracer-app',
  viewProviders: [Title],
  template: `<h1>PonyRacer</h1>`
})
export class PonyRacerApp {
  constructor(title: Title) {
    title.setTitle('PonyRacer - Bet on ponies');
  }
}
```

#### Making your own service

Just build a class, and you’re done!

A service is a singleton, an unique instance of the class will be injected everywhere. It thus makes a service a great candidate to share state between several unrelated components!

**Note**: If your service has some dependencies itself, then you need to add the `@Injectable()`` decorator on it. Without this decorator, the framework won’t do the dependency injection.

```js
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
export class RacesServiceWithHttp {
  constructor(private _http: Http) { }
  list() {
    return this._http.get('/api/races');
  }
}
```

## Reactive Programming (RxJS)

It is a way to build an app using events and reacting to them (hence the name). The events can be composed, filtered, grouped, etc… using functions like `map`, `filter`, etc.

That’s why you sometimes find the terms "functional reactive programming". But, to be accurate, reactive programming is not really functional programming, as it does not necessarily include the concepts of immutability, the lack of side-effects etc… Reacting on events is something you may have
done: 1. in the browser, when setting listeners to user events  2. on the backend side, reacting to events coming from a message bus.

In reactive programming, all data coming in will be in a stream. These streams can be listened to, modified (filtered, merged…), and can even become a new stream that can be listened to.

This technique allows for fairly decoupled programs: you don’t have to worry much about the consequences of your method call, you just raise an event, and every part of your app interested in this business will react accordingly. And maybe one of these parts will raise an event also, etc.

Angular 2 is built using reactive programming. Like reacting on a HTTP request, spawning a custom event for our component, dealing with value changes in our forms.

#### General principles

everything is a stream. A stream is an ordered sequence of events. These
events represent values, errors or completion events. All these are pushed from the data producer to the consumer.

As a developer, your job will be to subscribe to these streams, i.e. defining a listener capable of handling the three possibilities. Such a listener is called an observer, and the stream, an observable. An observer is not a one-time thing like a promise: it will continue to listen until it receives a 'completion' event.

Observables are very close to arrays. An array is a collection of values, like an observable. An observable only adds the concept of values over time: in an array, you have all the values at once, while the values will come over time in an observable, maybe every few minutes.

#### [RxJS](https://github.com/xgrommx/rx-book/)

Must check each method in visual view [RxMarble](http://rxmarbles.com/)

Every observable, just like every array, can be transformed using functions you may have already encountered. But an observable is more than a collection. It is an asynchronous collection, where the events arrive over time.

You can build observables from AJAX requests, browser events, Web sockets responses, a promise, a function, whatever you can think of.

• `take(n)` will pick the n first events.
• `map(fn)` will apply fn to each event and return the result.
• `filter(predicate)` will only let through the events that fulfill the predicate.
• `reduce(fn)` will apply fn to every event to reduce the stream to a single value.
• `merge(s1, s2)` will merge the streams.
• `subscribe(fn)` will apply fn to each event it receives.
• and much more…

```js
Observable.fromArray([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .filter(x => x > 5)
  .subscribe(x => console.log(x)); // 6, 8, 10
```

```js
// `Observable.create` takes a function that will emit events on the observer given as parameter. Here it simply emits one event for the demonstration.
let observable$ /*indicate this is an observable*/ = Observable.create((observer) => observer.next('hello'));
observable.subscribe((value) => console.log(value), error => console.log(error)), () => console.log('done')); // logs "hello". success, error, complete stage
```

#### Angular2 with Reactive programming

The framework provides an adapter around the `Observable` object: `EventEmitter`. The `EventEmitter` has a method `subscribe()`` to react to events and this
method can receive three parameters (a method to react on): events, errors, completion.

The `EventEmitter` can emit an event by calling the `emit()` method.

```js
let emitter = new EventEmitter();
let subscription = emitter.subscribe(
  value => console.log(value),
  error => console.log(error),
  () => console.log('done')
);
emitter.emit('hello');
emitter.emit('there');
emitter.complete();
// logs "hello", then "there", then "done"

emitter.next('hello');
subscription.unsubscribe(); // unsubscribe
emitter.next('there');
// logs "hello" only
```

## Tests

#### Unit Test

Assert a small unit of code (a component, a service, a pipe…) works correctly
in isolation, i.e. without considering its dependencies. Writing such a unit test requires to execute each of the `component/service/pipe` methods, and check that the outputs are what we expected regarding the inputs we fed it. We can also check that the dependencies used by this unit are correctly called, for example we can check that a service will do the correct HTTP request.

One of the core concept of unit test is the isolation concept: we don’t want our test to be biased by its dependencies. So we usually use "mock" objects as dependencies. These are fake objects that we create just for testing purpose.

- **Jasmine** (currently only supported)

The `expect()` call can be chained with a lot of methods like `toBe()`, `toBeLessThan()`, `toBeUndefined()`, etc… Every method can be negated with the `not` attribute of the object returned by `expect()`.

```js
class Pony {
  constructor(public name: string, public speed: number) { }
  isFasterThan(speed) {
    return this.speed > speed;
  }
}

describe('My first test suite', () => {
  let pony: Pony;
  beforeEach(() => {
    pony = new Pony('Rainbow Dash', 10);
  });
  it('should construct a Pony', () => {
    expect(pony.name).toBe('Rainbow Dash');
    expect(pony.speed).not.toBe(1);
    expect(pony.isFasterThan(8)).toBe(true);
  });
});
```

**Note**

One cool trick is that if you use `fdescribe()` instead of `describe()` then only this test suite will run (`f` stands for focus). Same thing if you want to run only one test: use `fit()` instead of `it()`. If you want to exclude a test, use `xit()`, or `xdescribe()` for a suite.

One last trick: Jasmine lets us create fake objects (mocks or spies, as you want), or even spy on a method of a real object. We can then do some assertions on these methods, like with `toHaveBeenCalled()` that checks if the method has been called, or with `toHaveBeenCalledWith()` that checks the exact parameters of the call to the spied method. You can also check how many times the method has been called, or check if it has ever been called, etc…

```js
describe('My first test suite with spyOn', () => {
  let pony: Pony;
  beforeEach(() => {
    pony = new Pony('Rainbow Dash', 10);
    // define a spied method
    spyOn(pony, 'isFasterThan').and.returnValue(true);
  });
  it('should test if the Pony is fast', () => {
    let runPonyRun = pony.isFasterThan(60);
    expect(runPonyRun).toBe(true); // as the spied method always returns
    expect(pony.isFasterThan).toHaveBeenCalled();
    expect(pony.isFasterThan).toHaveBeenCalledWith(60);
  });
});
```

- Using dependency injection

To use the dependency injection system in our test, the framework has a utility method called `inject`. This method can be used to wrap your test function (the second parameter of our `it` function), and inject specific dependencies inside this function.

`inject` takes two parameters:
• an array containing the classes we want to inject as dependencies
• a test function, whose parameters match the dependencies we declared

we also need to tell the test what is available for injection, as we do in the bootstrap method when we start the app.

The `beforeEachProviders` function allows to declare what can be injected in the test. Try to inject only what’s necessary in your test, to make them as loosely coupled to the rest of the app as possible. The method takes a function as its unique parameter, and this function should return an array of
dependencies that will become available to injection.

```js
export class RaceService {
  list() {
    let race1 = new Race('London');
    let race2 = new Race('Lyon');
    return [race1, race2];
  }
}

// here is the test in a separated file
import {describe, it, expect, inject, beforeEachProviders} from 'angular2/testing';
describe('RaceService', () => {
  beforeEachProviders(() => [RaceService]);
  it('should return races when list() is called',
    inject([RaceService], (raceService) => {
      expect(raceService.list().length).toBe(2);
    })
  );
});
```

To clean up our previous example, we can maybe move the `RaceService`initialization in a `beforeEach` method. We can also use `inject` in a `beforeEach`

```js
import {describe, it, expect, inject, beforeEachProviders, beforeEach} from
'angular2/testing';
describe('RaceService', () => {
  let service: RaceService;
  beforeEachProviders(() => [RaceService]);

  beforeEach(inject([RaceService], (raceService) => {
    service = raceService;
  }));
  it('should return races when list() is called', () => {
    expect(service.list().length).toBe(2);
  });
});
```

- Async test

`injectAsync()`` instead of the `inject()` method. And this method is really smart: it keeps track of the asynchronous calls made in the test and waits for them to resolve.

`injectAsync()` each test runs in a zone, so the framework knows when all the asynchronous actions are done, and won’t complete until then.

```js
import {describe, it, expect, injectAsync, beforeEachProviders} from 'angular2/testing';
describe('RaceService', () => {
  beforeEachProviders(() => [RaceService]);
  it('should return a promise of 2 races',
    injectAsync([RaceService], service => {
      return service.list().then(races => {
        expect(races.length).toBe(2);
      });
    })
  );
});
```

- Fake dependencies

`beforeEachProviders()` method has another usage can also declare a fake service as a dependency instead of a real one.

```js
@Injectable()
export class RaceService {
  constructor(private localStorage: LocalStorageService) { }
  list() {
    return this.localStorage.get('races');
  }
}

// Now, we don’t really want to test the LocalStorageService service, we just want to test our RaceService. Using dependency injection system to give a fake LocalStorageService
class FakeLocalStorage {
  get(key) {
    return [new Race('Lyon'), new Race('London')];
  }
}

// Unit Test
import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {provide} from 'angular2/core';
describe('RaceService', () => {
  beforeEachProviders(() => [
    provide(LocalStorageService, {useClass: FakeLocalStorage}),
    RaceService
  ]);
  it('should return 2 races from localStorage',
    inject([RaceService], service => {
      let races = service.list();
      expect(races.length).toBe(2);
    })
  );
});

// 2nd test case
// Jasmine can help us spy on the service and replace its implementation by a fake one. It also allows to verify that the get() method has been called with the proper key 'races'.
describe('RaceService', () => {
  beforeEachProviders(() => [LocalStorageService, RaceService]);
  it('should return 2 races from localStorage',
    inject([RaceService, LocalStorageService], (service, localStorage) => {
      spyOn(localStorage, 'get').and.returnValue([new Race('Lyon'), new Race('London')]);
      let races = service.list();
      expect(races.length).toBe(2);
      expect(localStorage.get).toHaveBeenCalledWith('races');
    });
  );
});
```

- Testing components

A component test is slightly different because we have to create the component. We can’t rely on the dependency injection system to give us
an instance of the component to test (you may have noticed by now that components are not injectable in other components).

To test such a component, you first need to create an instance. To do this, the framework gives us `TestComponentBuilder`. This class comes with a utility method, named `createAsync`, to create a component. The method returns a promise of a `ComponentFixture`, a representation of our component. We can then chain the creation method with our test.

```js
@Component({
  selector: 'pony-cmp',
  template: `<img [src]="'/images/pony-' + pony.color.toLowerCase() + '.png'" (click)="clickOnPony()">`
})
export class PonyCmp {
  @Input() pony: Pony;
  @Output() ponyClicked: EventEmitter<void> = new EventEmitter<void>();
  clickOnPony() {
    this.ponyClicked.emit();
  }
}

// Test start here
import {describe, it, expect, inject, injectAsync, beforeEach, TestComponentBuilder} from 'angular2/testing';
import {PonyCmp} from './pony_cmp';

describe('PonyCmp', () => {
  let tcb: TestComponentBuilder;
  beforeEach(inject([TestComponentBuilder], tcBuilder => {
    tcb = tcBuilder;
  }));

  it('should have an image', injectAsync([], () => {
    return tcb.createAsync(PonyCmp)
      .then(fixture => {
        // given a component instance with a pony input initialized
        let ponyCmp = fixture.componentInstance;
        ponyCmp.pony = {name: 'Rainbow Dash', color: 'BLUE'};
        // when we trigger the change detection
        fixture.detectChanges();
        // then we should have an image with the correct source attribute
        // depending of the pony color
        let element = fixture.nativeElement;
        expect(element.querySelector('img').getAttribute('src'))
          .toBe('/images/ponyblue.png');
      });
    })
  );
});
```

follow the "Given/When/Then" pattern to write the unit test.
• a "Given" phase, where we setup the test context. We get the component instance created and add a pony. It emulates an input that would come from a parent component in the real app.
• a "When" phase, where we manually trigger the change detection, using the detectChanges() method. In a test, the change detection is our responsibility: it’s not automatic as it is in an app.
• a "Then" phase, containing the expectations.

- [Additional matcher added by framework](https://angular.io/docs/ts/latest/api/testing/NgMatchers-interface.html)

**toHaveText()** allows to check that a DOM element contains a given text. For example, you could check that the `div` text contains the pony name.

**toHaveCssClass()** allows to check that a DOM element has a given CSS class.

**toBeInstanceOf()**
**toThrowErrorWith(message)**

```js
@Component({
  selector: 'race-cmp',
  template: `<div>
    <h1>{{race.name}}</h1>
    <pony-cmp *ngFor="#pony of race.ponies" [pony]="pony"></pony-cmp>
    </div>`,
  directives: [PonyCmp]
})
export class RaceCmp {
  @Input() race: any;
}

// Unit Test case
describe('RaceCmp', () => {
  let fixture: ComponentFixture;
  beforeEach(injectAsync([TestComponentBuilder], tcb =>
    tcb.createAsync(RaceCmp).then(f => fixture = f)
  ));

  it('should have a name and a list of ponies', () => {
    // given a component instance with a race input initialized
    let raceCmp = fixture.componentInstance;
    raceCmp.race = {name: 'London', ponies: [{name: 'Rainbow Dash', color: 'BLUE'}]};
    // when we trigger the change detection
    fixture.detectChanges();
    // then we should have a name with the race name
    let element = fixture.nativeElement;
    expect(element.querySelector('h1')).toHaveText('London');
    // and a list of ponies
    // Here we query all the directives of type PonyCmp and test if the first pony is correctly initialized.
    let ponies = fixture.debugElement.queryAll(By.directive(PonyCmp));
    expect(ponies.length).toBe(1);
    // we can check if the pony is correctly initialized
    let rainbowDash = ponies[0].componentInstance.pony;
    expect(rainbowDash.name).toBe('Rainbow Dash');
  });
})
```

You can get the components inside your component with `componentViewChildren` or query them with `query()` and `queryAll()`. These methods take a predicate as argument that can be either `By.css` or `By.directive`. That’s what we do to get the ponies displayed, as they are instances of `PonyCmp`. Keep in
mind that this is different from a DOM query using `querySelector()`: it will only find the elements handled by Angular, and will return a `ComponentFixture`, not a DOM element (so you’ll have access to the componentInstance of the result, for example).

- Another example on Testing components

```js
import {Component, Inject, OnInit, OnDestroy} from "angular2/core";
import {CounterActions} from "./counter-actions";
import {CounterStore} from "./counter-store";

@Component({
  selector: "counter",
  providers: [CounterActions, CounterStore],
  templateUrl: "./src/counter/counter.html"
})
export class CounterPageComponent implements OnInit, OnDestroy {
  counter:number = 0;

  private counterActions;
  private counterStore;

  constructor(@Inject(CounterActions)counterActions:CounterActions,
              @Inject(CounterStore)counterStore:CounterStore) {
    this.counterActions = counterActions;
    this.counterStore = counterStore;
  }

  ngOnInit() {
    this.counter = this.counterStore.getCounter();
    this.counterStore.subscribe(() => this.counter = this.counterStore.getCounter());
  }

  ngOnDestroy() {
    this.counterStore.unsubscribe();
  }

  increment() {
    this.counterActions.increment();
  }

  decrement() {
    this.counterActions.decrement();
  }

  reset() {
    this.counterActions.reset();
  }
}

// Testing without angular2 injector involved
import {BrowserDomAdapter} from "angular2/src/platform/browser/browser_adapter";
BrowserDomAdapter.makeCurrent();

import {
  beforeEach,
  it,
  fdescribe,
  expect,
} from "angular2/testing";
import {CounterPageComponent} from "../../src/counter/counter-page-component";
import {CounterStore} from "../../src/counter/counter-store";
import {CounterActions} from "../../src/counter/counter-actions";

fdescribe("CounterPageComponent", () => {
  let component:any;
  let actions:any;
  let store:any;

  beforeEach(() => {
    store = new CounterStore(); //or entirely overwritten stub if necessary
    actions = new CounterActions(); //same here

    spyOn(store, "subscribe");
    spyOn(store, "getCounter").and.returnValue(33);
    spyOn(actions, "increment");
    spyOn(actions, "decrement");
    spyOn(actions, "reset");

    component = new CounterPageComponent(actions, store);
  });

  describe("ngOnInit()", () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it("should call getCounter() to get initial value", ()  => {
      expect(store.getCounter.calls.count()).toEqual(1);
    });

    it("should subscribe to the counterStore", ()  => {
      let subscribeCallback = store.subscribe.calls.argsFor(0)[0];
      subscribeCallback();

      expect(store.getCounter.calls.count()).toEqual(2);
      expect(component.counter).toEqual(33);
    });
  });

  describe("increment()", () => {
    it("should proxy to counterActions.increment()", () => {
      component.increment();
      expect(actions.increment.calls.count()).toEqual(1);
    });
  });

  describe("decrement()", () => {
    it("should proxy to counterActions.decrement()", () => {
      component.decrement();
      expect(actions.decrement.calls.count()).toEqual(1);
    });
  });

  describe("reset()", () => {
    it("should proxy to counterActions.reset()", () => {
      component.reset();
      expect(actions.reset.calls.count()).toEqual(1);
    });
  });
});
```

Testing with the injector but without involving the template

```js
import {BrowserDomAdapter} from "angular2/src/platform/browser/browser_adapter";
BrowserDomAdapter.makeCurrent();

import {
  beforeEachProviders,
  beforeEach,
  inject,
  it,
  describe,
  expect,
  TestComponentBuilder
} from "angular2/testing";
import {provide} from "angular2/core";
import {CounterPageComponent} from "../../src/counter/counter-page-component";
import {CounterStore} from "../../src/counter/counter-store";
import {CounterActions} from "../../src/counter/counter-actions";

describe("CounterPageComponent", () => {
  let component:any;
  let actions:any;
  let store:any;

  beforeEachProviders(() => [CounterActions, CounterStore]);

  beforeEach(inject([TestComponentBuilder], tcb => {
    store = new CounterStore();
    actions = new CounterActions();

    spyOn(store, "subscribe");
    spyOn(store, "getCounter").and.returnValue(33);
    spyOn(actions, "increment");
    spyOn(actions, "decrement");
    spyOn(actions, "reset");

    tcb.overrideTemplate(CounterPageComponent, "<sec></sec>")
      .overrideProviders(CounterPageComponent, [
        provide(CounterActions, {useValue: actions}),
        provide(CounterStore, {useValue: store}) // or useFactory: () => {let counterStore = new CounterStore() //spy and return counterStore}
      ])
      .createAsync(CounterPageComponent)
      .then(f => component = f.componentInstance);
  }));

  describe("ngOnInit()", () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it("should call getCounter() to get initial value", ()  => {
      expect(store.getCounter.calls.count()).toEqual(1);
    });

    it("should subscribe to the counterStore", ()  => {
      let subscribeCallback = store.subscribe.calls.argsFor(0)[0];
      subscribeCallback();

      expect(store.getCounter.calls.count()).toEqual(2);
      expect(component.counter).toEqual(33);
    });
  });

  describe("increment()", () => {
    it("should proxy to counterActions.increment()", () => {
      component.increment();
      expect(actions.increment.calls.count()).toEqual(1);
    });
  });

  describe("decrement()", () => {
    it("should proxy to counterActions.decrement()", () => {
      component.decrement();
      expect(actions.decrement.calls.count()).toEqual(1);
    });
  });

  describe("reset()", () => {
    it("should proxy to counterActions.reset()", () => {
      component.reset();
      expect(actions.reset.calls.count()).toEqual(1);
    });
  });
});
```

Testing with compiling the template

```js
import {BrowserDomAdapter} from "angular2/src/platform/browser/browser_adapter";
BrowserDomAdapter.makeCurrent();

import {
  beforeEachProviders,
  beforeEach,
  injectAsync,
  it,
  fdescribe,
  TestComponentBuilder
} from "angular2/testing";
import {CounterPageComponent} from "../../src/counter/counter-page-component";
import {CounterStore} from "../../src/counter/counter-store";
import {CounterActions} from "../../src/counter/counter-actions";
import {provide} from "angular2/core";
import {EventEmitter} from "angular2/core";

fdescribe("CounterPageComponent", () => {
  let component:any;
  let actions:any;
  let store:any;
  let eventEmitter = new EventEmitter();

  beforeEachProviders(() => [CounterActions, CounterStore]);

  beforeEach(injectAsync([TestComponentBuilder], tcb => {
    store = new CounterStore();
    actions = new CounterActions();
    let getCounterValue = 33;

    spyOn(store, "subscribe").and.callFake(callback => {
      eventEmitter.subscribe(() => callback());
    });
    spyOn(store, "getCounter").and.returnValue(getCounterValue++);
    spyOn(actions, "increment");
    spyOn(actions, "decrement");
    spyOn(actions, "reset");

    //or simply leave the template to get loaded, but having it here will save us an http call
    return tcb.overrideTemplate(
      CounterPageComponent,
      `<p>Counter Value: {{counter}}<button (click)="increment()">+</button>
        <button (click)="decrement()">-</button>
        <button (click)="reset()">Reset</button>
      </p>`
      )
      .overrideProviders(CounterPageComponent, [
        provide(CounterActions, {useValue: actions}),
        provide(CounterStore, {useValue: store}) // or useFactory: () => {let counterStore = new CounterStore() //spy and return counterStore}
      ])
      .createAsync(CounterPageComponent)
      .then(f => {
        f.detectChanges();
        component = f.debugElement.nativeElement;
      });
    }));

    describe("component initialized", () => {
      it("should have the initial value displayed", ()  => {
        expect(component.innerText).toContain("Counter Value: " + 33);
      });
    });
  // etc with the remaining tests
});
```

- Testing with fake templates, directives…

When using less complex template for the test, `TestComponentBuilder` gives an `overrideTemplate()` method, to call before the `createAsync()` one.

`overrideTemplate` take 2 args: 1. the component you want to override  2. the template

```js
describe('RaceCmp', () => {
  let fixture: ComponentFixture;
  beforeEach(injectAsync([TestComponentBuilder], tcb => {
    // let's replace the template of the race by simpler one
    return tcb.overrideTemplate(RaceCmp, '<h2>{{race.name}}</h2>')
      .createAsync(RaceCmp)
      .then(f => fixture = f);
  }));

  it('should have a name', () => {
    // given a component instance with a race input initialized
    let raceCmp = fixture.componentInstance;
    raceCmp.race = {name: 'London'};
    // when we trigger the change detection
    fixture.detectChanges();
    // then we should have a name
    let element = fixture.nativeElement;
    expect(element.querySelector('h2')).toHaveText('London');
  });
});
```

`overrideTemplate()` is not the only method available, you can also use:
• `overrideProviders()` and `overrideViewProviders()` to replace the dependencies of a component
• `overrideDirective()` to replace a directive used in the template of a component
• `overrideView()` where you can specify another pipe, style, etc…

- Testing Pipes

The test here can be simply done without involving the angular injector - which makes the code framework agnostic.

```js
import {Pipe} from "angular2/core";
@Pipe({ name: "upperCase" })
export class UpperCasePipe {
  transform(value: string) {
    return value.toUpperCase();
  }
}

// Test here
import {
  it,
  describe,
  expect
} from "angular2/testing";
import {UpperCasePipe} from "../../src/home/upper-case-pipe";

describe("UpperCasePipe", () => {
  it("should convert the string passed to it to uppercase", () => {
    let upperCasePipe = new UpperCasePipe();
    expect(upperCasePipe.transform("angular2 ")).toEqual("ANGULAR2 ");
  });
});
```

or alternatively (not my preferred approach) the pipe can be tested within the context of a template - e.g. testing it's selector

```js
import {BrowserDomAdapter} from "angular2/src/platform/browser/browser_adapter";
import {Component} from "angular2/core";
BrowserDomAdapter.makeCurrent();
import {
  it,
  injectAsync,
  fdescribe,
  expect,
  TestComponentBuilder
} from "angular2/testing";
import {UpperCasePipe} from "../../src/home/upper-case-pipe";

@Component({
  selector: "home",
  pipes: <any>[UpperCasePipe],
  template: "<h3>{{message|upperCase}}</h3>"
})
class TestComponent {
  message = "Hello";
}
fdescribe("UpperCasePipe - test the injector selector", () => {
  it("should wrap content", injectAsync([TestComponentBuilder], tcb => {
    return tcb.createAsync(TestComponent).then(fixture => {
      fixture.detectChanges();
      let compiled = fixture.debugElement.nativeElement;
      expect(compiled.innerText).toContain("HELLO");
    });
  }));
});
```

- Testing Services

```js
import dispatcher from "../dispatcher";
import {Http} from "angular2/http";
import {Inject} from "angular2/core";

export const FETCHED_DATA = "FETCHED_DATA";

export class HomePageActions {
  http: Http;
  constructor(@Inject(Http) http: Http) {
    this.http = http;
  }

  initializeData() {
    this.http.get("api-mock/colors.json").subscribe(data => {
      dispatcher.dispatch({
        type: FETCHED_DATA, data: data.json()
      });

      setTimeout(() => {
          dispatcher.dispatch({
            type: FETCHED_DATA, data: data.json()
          });
        }, 3000
      );
    });
  }
}

// the simplest test with stubbing Http with another class to match the same name and methods used in the class under test
import {BrowserDomAdapter} from "angular2/src/platform/browser/browser_adapter";
BrowserDomAdapter.makeCurrent();

import {
  beforeEach,
  it,
  fdescribe,
  expect
} from "angular2/testing";
import dispatcher from "./../../src/dispatcher";
import {HomePageActions} from "../../src/home/home-page-actions";

import {Observable} from "rxjs/Rx";
import {ResponseOptions} from "angular2/src/http/base_response_options";
import {Response} from "angular2/src/http/static_response";
class Http {
  get() {
    return Observable.from([
      new Response(new ResponseOptions({body: {colors: "red"}}))
    ]);
  }
}

let actions: HomePageActions;
let http: Http = new Http();

fdescribe("HomePageActions", () => {
  beforeEach(() => {
    spyOn(dispatcher, "dispatch");
    actions = new HomePageActions(http);
  });

  describe("initializeDatar()", () => {
    it("should call dispatcher.dispatch()", () => {
      actions.initializeData();
      expect((<any>dispatcher.dispatch).calls.argsFor(0)).toEqual([
        Object({
          type: "FETCHED_DATA", data: Object({colors: "red"})
        })
      ]);
    });
  });
});
```

An alternative way of doing it - by using the angular2 injector instead and spy on the methods used within the class under test.

```js
import {BrowserDomAdapter} from "angular2/src/platform/browser/browser_adapter";
BrowserDomAdapter.makeCurrent();

import {
  beforeEachProviders,
  beforeEach,
  inject,
  it,
  describe,
  expect
} from "angular2/testing";

import dispatcher from "./../../src/dispatcher";
import {HomePageActions} from "../../src/home/home-page-actions";
import {Http, HTTP_PROVIDERS, Response, ResponseOptions} from "angular2/http";

import {Observable} from "rxjs/Rx";

let actions:HomePageActions;
let http:Http;

describe("HomePageActions", () => {
  beforeEachProviders(() => [Http, HTTP_PROVIDERS]);

  beforeEach(inject([Http], _ => {
    http = _;
    spyOn(dispatcher, "dispatch");

    spyOn(http, "get").and.returnValue(Observable.from([
      new Response(new ResponseOptions({body: {colors: "red"}}))
    ]));
    actions = new HomePageActions(http);
  }));

  describe("initializeData()", () => {
    it("should call dispatcher.dispatch()", () => {
      actions.initializeData();

      expect((<any>dispatcher.dispatch).calls.argsFor(0)).toEqual([
        Object({
          type: "FETCHED_DATA", data: Object({colors: "red"})
        })
      ]);
    });
  });
});
```

#### end-to-end tests (e2e)

An end-to-end test consists in really launching your app in a browser and emulating a user interacting with it (clicking on buttons, filling forms, etc…). They have the advantage of really testing the application in a whole.

Their purpose is to emulate a real user interacting with your app, by starting a real instance and then driving the browser to enter values in inputs, click on buttons, etc… We’ll then check that the rendered page is in the state we expect, that the URL is correct.

Use tool [protractor](https://angular.github.io/protractor/#/). You will write your test suite using Jasmine like in the unit tests, but you will use the `Protractor` API to interact with your app.

```js
describe('Home', () => {
  it('should display title, tagline and logo', () => {
    browser.get('/');
    expect(element.all(by.css('img')).count()).toEqual(1);
    expect($('h1').getText()).toContain('PonyRacer');
    expect($('small').getText()).toBe('Always a pleasure to bet on ponies');
  });
});
```

Protractor gives us a browser object, with a few utility methods like `get()`to go to a page. Then you have `element.all()` to select all the elements matching a predicate. This predicate often relies on `by` and its various methods (`by.css()` to do a CSS query, `by.id()` to retrieve an element by id, etc…). `element.all()` will return a promise, with a special method `count()`used in the test above.

`$('h1')` is a shortcut, equivalent of writing `element(by.css('h1'))`. It will fetch the first element matching the CSS query. You can use several methods on the promise returned by `$()`, like `getText()` and `getAttribute()` to retrieve information, or methods like `click()` and `sendKeys()` to act on this element.

## Forms

Angular 2 offers two ways to build a form:

1. one by setting up everything in the template. But, it is quickly verbose when we have several fields, forces us to have custom directives for the validation and is harder to test. This way of doing things is useful for very simple forms, with just one field for example.

2. one by setting up almost everything in the component. This way allows an easier setup for validation and testing, with several levels of groups if you need them. It is your weapon of choice for building complex forms. You can even react on changes on a group, or on a field.

3. `ngModel` gives you two-way data-binding if you need it. You can use it with both the template-driven forms and the model-driven ones.

4. `ng-no-form` attribute can have a form NOT transformed into its superpowered Angular 2 version.

`NgForm` directive that transforms the form element into its powerful Angular 2 version. These directives are included in the `PLATFORM_DIRECTIVES`.

`ngSubmit` is emitted by the form directive when submit is triggered. ex: `<form (ngSubmit)="register()"`

`NgControl` and `NgForm` directives. The `NgControl` directive can only be applied to input controls within a <form>. In order to ensure that for all input controls corresponding Control objects are created and assigned to the form we attach the `NgControl` directive to every input element.

#### Control

To build a form in our component code, we need some abstractions. A form field, like an input or a select, is represented by a `Control` in Angular 2. It is the smallest part of a form, and it encapsulates the state of the field and its value.

A Control has several attributes:

• `valid`: if the field is valid, regarding the requirements and validations applied on it.
• `errors`: an object containing the field errors
• `dirty`: false until the user has modified its value.
• `pristine`: the opposite of dirty.
• `touched`: false until the user has entered it.
• `untouched`: the opposite of touched.
• `value`: the value of the field.
• `status`: either VALID or INVALID
• `valueChanges`: an Observable emitting every time there is a change on the field
• `hasError()` method to check if the control has a specific error.

```js
let password = new Control();
console.log(password.dirty); // false until the user enters a value
console.log(password.value); // null until the user enters a value
console.log(password.hasError('required')); // false

// Note that you can pass an argument to the constructor, and that this argument will be the value.
let password = new Control('Cédric');
console.log(password.value); // logs "Cédric"
```

#### ControlGroup

These controls (describe above) can be grouped in a `ControlGroup` to represent a part of the form and have dedicated validation rules. The form itself is a group.

Two main components: **Controls** and **Control Groups**. Controls have values and validation state, which is determined by an optional validation function.

**A Control**

It can be bound to an input element, and takes 3 arguments (all optional); a default value, a validator and a asynchronous validator.

ex: `this.username = new Control('Default value', Validators.required, UsernameValidator.checkIfAvailable);`

Which can be used in your HTML using the “ngControl” directive: `<input required type=”text” ngControl=”username” />`

**A ControlGroup**

Defines a part of a form, of fixed length, that can contain other controls. Multiple Controls can be used to create a Control Group. We use Angular’s “FormBuilder” Class to combine multiple Controls.

The ControlGroup can be used in your HTML, bound to your form, using the ngFormModel directive. `<form [ngFormModel]=”form”>`

A ControlGroup has the same properties than a Control, with a few differences:

• `valid`: if all fields are valid, then the group is valid.
• `errors`: an object containing the group errors or `null` if the group is valid. Each error is a key, whose value is an array containing every control affected by this error.
• `dirty`: false until one control gets dirty too.
• `pristine`: the opposite of dirty.
• `touched`: false until one control gets touched too.
• `untouched`: the opposite of touched.
• `value`: the value of the group. To be more accurate, it’s an object with key/values representing the controls and their values.
• `status`: either VALID or INVALID
• `valueChanges`: an Observable emitting every time there is a change on the group
• `hasError()` method like `Control` method
• `find()` retrieve a control in a group

```js
let form = new ControlGroup({
  username: new Control('Cédric'),
  password: new Control()
});
console.log(form.dirty); // logs false until the user enters a value
console.log(form.value); // logs Object {username: "Cédric", password: null}
console.log(form.find('username')); // logs the Control
```

#### FormBuilder

With these basic elements we can build a form in our component. But instead of doing `new Control()` or `new ControlGroup()`, we will use a helper class, `FormBuilder`. The `FormBuilder` has a handful of methods to create controls and control groups.

```js
import {FormBuilder, ControlGroup}} from 'angular2/common';
@Component({
  ...
  viewProviders: [FormBuilder],
})
export class RegisterFormCmp {
  userForm: ControlGroup;

  constructor(private fb: FormBuilder) {
    // created a form with two controls
    // each control is created using the helper method `control()`
    // same effect as calling the `new Control('')` constructor
    // string represents the initial value you want to display in form.
    this.userForm = fb.group({
      username: fb.control('', Validators.required),
      password: fb.control('')
    });
  }
  register() {
    // we will have to handle the submission
    console.log(this.userForm.value);
  }
}
```

The form needs to be bound to `userForm` object via `ngFormModel` directive. Each input field is bound to a control via `ngControl` directive. Each input receives the `ngControl` directive with a string literal representing the control it is bound to. If you specify a name that does not exist, you will have an error.

**Note** If you have a single control in your form, and not a control group, you can use `ngFormControl` on your field instead of using `ngControl` and wrapping it in a `ngFormModel`.

```html
<form (ngSubmit)="register()" [ngFormModel]="userForm">
  <label>Username</label><input ngControl="username">
  <label>Password</label><input type="password" ngControl="password">
  <button type="submit">Register</button>
</form>
```

```js
import {Component} from 'angular2/core';
import {FormBuilder, ControlGroup, Control} from 'angular2/common';
@Component({
  selector: 'register-form-cmp',
  viewProviders: [FormBuilder],
  templateUrl: './register_form_cmp.html'
})
export class RegisterFormCmp {
  username: Control;
  password: Control;
  userForm: ControlGroup;

  constructor(fb: FormBuilder) {
    this.username = fb.control('', Validators.required)
    this.password = fb.control('', Validators.required)
    this.userForm = fb.group({
      username: this.username,
      password: this.password
    });
  }
  reset() {
    this.username.updateValue('');
    this.password.updateValue('');
  }
  register() {
    console.log(this.userForm.value);
  }
}
```

**Template drive form** define a local variable, `userForm`, referencing the form. We can do this because the form directive exports an object representing the form, with the same methods as the `ControlGroup`.

```html
<form (ngSubmit)="register(userForm.value)" #userForm="ngForm">
  <label>Username</label><input ngControl="username">
  <label>Password</label><input type="password" ngControl="password">
  <button type="submit">Register</button>
</form>
```

#### Two way data binding

`ngModel` directive is what you know as 'two-way data-binding'. The `NgModel`directive updates the related model `user.username` every time there is a change in the input, hence the `[ngModel]="user.username"` part. And it fires an event called `ngModel` every time the model is updated, where the event is the new value, hence the `(ngModel)="user.username = $event"` part.

```html
<input [(ngModel)]="user.username">
<!-- Equal to -->
<input [ngModel]="user.username" (ngModelChange)="user.username = $event">
```

#### Form validation

`Validator` returns a map of `errors` or `null` if it detects no error.

A few validators are provided by the framework:
• `Validators.required` to ensure that a control is not empty
• `Validators.minLength(n)` to ensure that the value entered has at least n characters
• `Validators.maxLength(n)` to ensure that the value entered has at most n characters

Validators are composable, using `Validators.compose()`, and can be applied on a `Control` or on a `ControlGroup`.

```js
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
@Component({
  viewProviders: [FormBuilder],
})
export class RegisterFormCmp {
  userForm: ControlGroup;
  constructor(fb: FormBuilder) {
    this.userForm = fb.group({
      username: fb.control('', Validators.compose([Validators.required, Validators.minLength(3)])),
      password: fb.control('', Validators.required)
    });
  }
}
```

```html
this.name = new Control('', Validators.minLength(4));

<input required type=”text” ngControl=”name” />
<div *ngIf=”name.dirty && !name.valid”>
   <p *ngIf=”name.errors.minlength”>
      Your name needs to be at least 4 characters.
   </p>
</div>
```

**Template driven form** add `required` attribute to the inputs. `required` is a provided directive, and will automatically add the validator to this field. Same thing with `minlength` and `maxlength`.

```html
<form (ngSubmit)="register(userForm.value)" #userForm="ngForm">
  <label>Username</label><input ngControl="username" required minlength="3">
  <label>Password</label><input type="password" ngControl="password" required>
  <button type="submit">Register</button>
</form>
```

#### Creating a custom validator

create a method that takes a `Control`, tests its `value` and returns an object with the `errors` or `null`, if the validation passes.

To use a validator in a model-driven form, We need to add a new control in our form with this validator, using the `FormBuilder`:  ex: `isOldEnough`

```js
import {Component} from 'angular2/core';
import {FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
@Component({
  selector: 'register-form-cmp',
  viewProviders: [FormBuilder],
  templateUrl: './register_form_cmp.html'
})
export class RegisterFormCmp {
  username: Control;
  password: Control;
  birthdate: Control;
  userForm: ControlGroup;
  constructor(fb: FormBuilder) {
    this.username = fb.control('', Validators.required);
    this.password = fb.control('', Validators.required);
    this.birthdate = fb.control('', Validators.compose([Validators.required, this.isOldEnough]));
    this.userForm = fb.group({
      username: this.username,
      password: this.password,
      birthdate: this.birthdate
    });
  }
  register() {
    console.log(this.userForm.value);
  }
  // this method could be in another class if you wanted (required is a static method for example). Used in `Validators.compose([Validators.required, this.isOldEnough]))`
  isOldEnough(control: Control) {
    // if there is no value
    if (!control.value) {
      return null;
    }
    let birthDatePlus18 = new Date(control.value);
    birthDatePlus18.setFullYear(birthDatePlus18.getFullYear() + 18);
    return birthDatePlus18 < new Date() ? null : {tooYoung: true};
  }
}

// To use it, add a field and display an error
<label>Birth date</label><input type="date" ngControl="birthdate">
<div *ngIf="birthdate.dirty">
<div *ngIf="birthdate.hasError('required')">Birth date is required</div>
<div *ngIf="birthdate.hasError('tooYoung')">way too young to be betting on pony races</div>
```

**Note** returning null actually means the validation is valid.

```js
interface ValidationResult {
 [key:string]:boolean;
}
class UsernameValidator {
 static startsWithNumber(control: Control): ValidationResult {
   if ( control.value !=”” && !isNaN(control.value.charAt(0)) ){
     return { “startsWithNumber”: true };
   }
   return null;
 }
}
```

Now we can use this Validator in our Control

`this.name = new Control('', UsernameValidator.startsWithNumber);`

```html
<input required type=”text” ngControl=”name” />
<div *ngIf=”name.dirty && !name.valid”>
   <p *ngIf=”name.errors.startsWithNumber”>
      Your name can't start with a number
   </p>
</div>
```

- Using a validator in a template-driven form.

To do this, we are going to build a directive that we will apply on the input. Create this new directive. We start by creating a class, with the `@Directive` decorator, and a selector on an attribute that we will name `is-old-enough`. The class has a method `validate`.

Use DI to tell the input that this directive is a validator. When it is instantiated, a form control directive is looking for all the directives of type `NG_VALIDATORS`. So we need to bind our directive as a `NG_VALIDATORS`, using the `multi` option. This option is the only way to bind several values to the same token.

```js
import {Directive, provide} from 'angular2/core';
import {Control, NG_VALIDATORS, Validator} from 'angular2/common';
@Directive({
  selector: '[isOldEnough]',
  bindings: [provide(NG_VALIDATORS, {useExisting: IsOldEnoughValidator, multi: true})]
})
export class IsOldEnoughValidator implements Validator {
  validate(control: Control): any {
    let birthDatePlus18 = new Date(control.value);
    birthDatePlus18.setFullYear(birthDatePlus18.getFullYear() + 18);
    return birthDatePlus18 < new Date() ? null : {tooYoung: true};
  }
}

// Now if we add the directive on the input the validation will be executed:
<label>Birth date</label><input type="date" ngControl="birthdate" required
isOldEnough #birthdate="ngForm">
<div *ngIf="birthdate.control?.dirty">
<div *ngIf="birthdate.control?.hasError('required')">Birth date is required</div>
<div *ngIf="birthdate.control?.hasError('tooYoung')">Way too young to be
betting on pony races</div>
```

- Asynchronous form validation

If we want to check something using a Promise (such as fetching data from the server) we can use an asynchronous validator. It works quite similar to the default Validator, only this time we want to return a promise.

```js
class UsernameValidator {
 static usernameTaken(control: Control): Promise<ValidationResult> {
   let q = new Promise((resolve, reject) => {
     setTimeout(() => {
       if (control.value === ‘David’) {
         resolve({“usernameTaken”: true});
       } else {
         resolve(null);
       }
     }, 1000)
   });

   return q;
 }
}
```

This time we want to use the third parameter of the Control to apply the validator.

`this.name = new Control('', UsernameValidator.startsWithNumber, UsernameValidator.usernameTaken);`

In our HTML we wan’t to show 2 different states, when the Promise is pending and the validation message if needed.

```html
<input required type=”text” ngControl=”name” />
<p *ngIf=”name.pending”>
   Fetching data from the server...
</p>
<div *ngIf=”name.dirty && !name.valid && !name.pending”>
   <p *ngIf=”name.errors.startsWithNumber”>
      Your name can't start with a number
   </p>
   <p *ngIf=”name.errors.usernameTaken”>
      This username is already taken
   </p>
</div>
```

- Combining multiple validators

Angular 2 provides two methods to combine Validators. `Validators.compose` and `Validators.composeAsync`. Both take an Array of validators.

#### Errors and submission

use the `ControlGroup` variable: `userForm`. This variable gives us a complete view of the form and field states and errors. link `disabled` to the `valid` property of `userForm`. Now we can only submit when all controls are valid.

```html
<form (ngSubmit)="register()" [ngFormModel]="userForm">
  <label>Username</label><input ngControl="username">
  <!-- The errors are now displayed if the fields are empty, use `.dirty` for initial empty value state -->
  <!-- `username.dirty && username.hasError('required')` when `this.username` is defined on the `constructor`.  ex: `this.username = fb.control('', Validators.required);` see full example above-->
  <div *ngIf="userForm.find('username').dirty && userForm.find('username').hasError('required')">
    Username is required
  </div>
  <label>Password</label><input type="password" ngControl="password">
  <div *ngIf="userForm.find('password').dirty && userForm.find('password').hasError('required')">
    Password is required
  </div>
  <!-- disable a button using the `disabled` property -->
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

**Template driven form**

```html
<form (ngSubmit)="register(userForm.value)" #userForm="ngForm">
<label>Username</label><input ngControl="username" required #username="ngForm">
<div *ngIf="username.control?.dirty && username.control?.hasError('required')"
>Username is required</div>
<label>Password</label><input type="password" ngControl="password" required #
password="ngForm">
<div *ngIf="password.control?.dirty && password.control?.hasError('required')"
>Password is required</div>
<button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

- Create a Display Error component

```js
@Component({
  selector: 'display-error',
  template: `<div *ngIf="isDisplayed()"><ng-content></ng-content></div>`
})
export class DisplayErrorCmp implements OnInit {
  @Input('control') controlName: string;
  @Input() error: string;
  control: AbstractControl;
  // we inject the form model look into the host element to find the NgFormModel directive and inject it
  constructor(@Host() private formModel: NgFormModel) {
  }
  // we then find the control
  ngOnInit() {
    this.control = this.formModel.form.find(this.controlName);
  }
  // the div in the template will only be added if
  // the control is dirty and has the specified error
  isDisplayed() {
    return this.control.dirty && this.control.hasError(this.error);
  }
}

// usage
<label>Username</label><input ngControl="username">
<display-error control="username" error="required">
 Username is required
</display-error>
```

#### Form Styles

Angular2 auto add and remove CSS classes on each field on the form.

A field will have the class `ng-invalid` if one of its validators fails
`ng-valid` if all the validators succeed.
`ng-invalid`: Control’s value is not valid
`ng-dirty` present if the user has changed the value.
`ng-pristine` present if the user never changed the value
`ng-touched` present if the user enters and leaves the field at least once (even if she/he did not changed the value).
`ng-untouched` is opposite to `ng-touched`

`ng-pristine nguntouched ng-invalid` When you display a form for the first time
`ng-pristine ngtouched ng-invalid` when enters and leaves the field
`ng-dirty ngtouched ng-invalid` when changes the value still invalid
`ng-dirty ng-touched ng-valid` when the value is valid


#### Grouping fields

We can declare groups inside a group. That’s very useful if you want to validate a group of fields together like an address, or, like in our example, if you want to check if the password and its confirmation match.

```js
import {Component} from 'angular2/core';
import {FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
@Component({
  selector: 'register-form-cmp',
  viewProviders: [FormBuilder],
  templateUrl: './register_form_cmp.html'
})
export class RegisterFormCmp {
  passwordForm: ControlGroup;
  userForm: ControlGroup;
  username: Control;
  password: Control;
  confirm: Control;

  constructor(fb: FormBuilder) {
    this.username = fb.control('', Validators.required);
    this.password = fb.control('', Validators.required);
    this.confirm = fb.control('', Validators.required);
    // create a new group, passwordForm with the two fields and add it in the group userForm
    // added a validator on the group, passwordMatch, that will be called every time one of the fields changes
    this.passwordForm = fb.group({password: this.password, confirm: this.confirm}, {validator: this.passwordMatch});
    this.userForm = fb.group({username: this.username, passwordForm: this.passwordForm});
  }

  register() {
    console.log(this.userForm.value);
  }
  passwordMatch(control: {controls: {password: Control, confirm: Control}}) {
    let password = control.controls.password.value;
    let confirm = control.controls.confirm.value;
    return password !== confirm ? {matchingError: true} : null;
  }
}

// update the template to reflect the new form, using the `ngControlGroup` directive
<form (ngSubmit)="register()" [ngFormModel]="userForm">
  <div>
    <label>Username</label><input ngControl="username">
    <div *ngIf="username.dirty && username.hasError('required')">Username is
    required</div>
  </div>
  <div ngControlGroup="passwordForm" #passwordForm="ngForm">
    <div>
      <label>Password</label>
      <input type="password" ngControl="password">
      <div *ngIf="password.dirty && password.hasError('required')">
        Password is required
      </div>
    </div>
    <div>
      <label>Confirm password</label>
      <input type="password" ngControl="confirm">
      <div *ngIf="confirm.dirty && confirm.hasError('required')">
        Confirm your password
      </div>
    </div>
    <div *ngIf="passwordForm.dirty && passwordForm.control.hasError('matchingError')">
      Your password does not match
    </div>
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

#### Reacting on changes

using the observable `valueChanges`. ex: password field to display a strength indicator, compute the strength at every change of the password value:

```js
import {FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
@Component({
bindings: [FormBuilder],
})
export class RegisterFormCmp {
  userForm: ControlGroup;
  username: Control;
  password: Control;
  passwordStrength: number = 0;

  constructor(fb: FormBuilder) {
    this.username = fb.control('', Validators.required);
    this.password = fb.control('', Validators.required);
    this.userForm = fb.group({
      username: this.username,
      password: this.password
    });
    // we subscribe to every password change
    this.password.valueChanges.subscribe((change) => {
      this.passwordStrength = change.length;
    });
  }
}

// Now we have a passwordStrength field in our component instance, that we can display to our user:
<form (ngSubmit)="register()" [ngFormModel]="userForm">
  <label>Password</label><input type="password" ngControl="password">
  <div>Strength: {{passwordStrength}}</div>
  <div *ngIf="password.dirty && password.hasError('required')">Password is
   required</div>
</form>
```

## Events

It contains "User input events" and "Lifecycle events".

#### User input events

They are closely related to [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events) which are raised by user actions like clicks on buttons or typing on keyboard. By using event binding you can directly listen to DOM events in your Angular 2 application.

Syntax: `(Name_of_DOM_event)="[Template expression]"`

- `$event` Object (event: Event)

Use `$event` object to retrieve additional event information. `KeyboardEvent` may provide more info like

```html
<tr *ng-for="#keyUpEvent of keyUpEvents, #i=index">
  <td>{{i+1}}</td>
  <td>{{keyUpEvent.type}}</td>
  <td>{{keyUpEvent.timeStamp}}</td>
  <td>{{keyUpEvent.target}}</td>
  <td>{{keyUpEvent.code}}</td>
  <td>{{keyUpEvent.key}}</td>
  <td>{{keyUpEvent.shiftKey}}</td>
  <td>{{keyUpEvent.ctrlKey}}</td>
  <td>{{keyUpEvent.altKey}}</td>
</tr>
```

- Event filtering

`<input #a (keyup.enter)="onKey(a.value)">` filter keyboard event and only listen to a certain key. here is "enter"

#### LifeCycle Events

- Constructor

The constructor of the component class is called before any other component lifecycle hook. If your component is based on any dependencies the constructor is the right place to inject those dependencies.

- ngOnInit

It is called right after the constructor and before the `ngOnChange` is triggered for the first time. It can be used to initialize input properties and perform other initialization tasks.

- ngOnChanges

It is executed every time the value of an input property changes. The
method takes one parameter which is an object describing the changes in detail. `{"value1":{"previousValue":"","currentValue":"Test"}}`
In this case one change to the input property value1 is reported. The value of this property has been changed from an empty string to the string “Test”.

- ngDoCheck

It is triggered every time the input properties of a component or a directive are checked. You can use this lifecycle hook to extend the check with your own custom check logic.

- ngAfterContentInit

It is called after `ngOnInit` when the component’s or directive’s
content has been initialized.

- ngAfterContentChecked

Called after every check of the component’s or directive’s content.

- ngAfterViewInit

Called after `ngAfterContentInit` when the component’s view has been initialized. Applies to components only.

- ngAfterViewChecked

Called after every check of the component’s view. Applies to components only.

- ngOnDestroy

called in a component’s lifecycle, just before the instance of the component
is finally destroyed.

## Typescript

#### [Compiler Options](https://github.com/Microsoft/TypeScript/wiki/Compiler-Options)

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
(click)="onSelect(hero)"
```

#### Event Key filtering

`onEvent` method will only be triggered with "enter" key pressed. so that we could filter the keyup event only on "enter" key pressed

```html
<input #entered (keyup.enter)="onEvent(entered.value)" />
```

#### Class associated

```html
<input [ngClass]="myVariable + ' staticClassName'"
```


Built tool for react

budō https://github.com/mattdesl/budo
nwb  https://github.com/insin/nwb
prot  https://github.com/mattdesl/prot
rackt-cli  https://github.com/mzabriskie/rackt-cli
rwb   https://github.com/petehunt/rwb
