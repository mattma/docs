https://github.com/eoinkelly/ember-runloop-handbook
https://gist.github.com/kristianmandrup/ae3174217f68a6a51ed5
https://gist.github.com/rwjblue/8816372
http://www.programwitherik.com/top-5-best-resources-for-ember-js/

## Source Code

- packages/container

1. main.js

enable/disable model factory injections (disabled by default).
If enabled, models should not be accessed globally (only through `container.lookupFactory('model:modelName'))`);

```js
Ember.MODEL_FACTORY_INJECTIONS = false;
```

## Testing

The Ember-testing DSL currently consists of the following functions:

* visit(url)

point app to the specified url

* click(selector, context)

click the element described by the jQuery selector. A context for the jQuery selector can also optionally be supplied

* fillIn(selector, context, text)

update the value of the element described by the jQuery selector with the supplied text. A context for the selector can be optionally supplied.

* find(selector, context)

retrieve the element identifie by the jQuery selector. A context for the selector can be optionally supplied.


Block Parameters (Just function takes parameters)

```hbs
{{#each list as |item|}}
    {{item.name}}
{{/each}}

{{#with long.title as |t|}}
    {{t.name}}
{{/with}}

{{#calendar-month as |day|}}
    <p>{{day.name}}</p>
    <p>{{day.number}}</p>
{{/calendar-month}}
```

Any component could yield anything. just say Yield here to there, it becomes block parameter of other components.

```js
{{!-- calendar-month.hbs --}}

{{#each days as |day|}}
    {{yield day}}
{{/each}}
```


Ember talks

HTMLBars, Ember Inspector (screen shots), Ember CLI, emberaddons.com,
Query Params, Testing story, Ember Data (relationship syncing, build with async loading in mind), adapter ecosystem,
ES2015/16 early adopter,

Future:
Engines (ways for a big organization to work together, each team will work on one piece)
List VIew
<angle-bracket> Components ex: <calendar-month>
Liquid Fire (@ef4) Animation library. ready to be compitible with animation
Async $ Routable components.  more conventional, more predicatable
Json:API (jsonapi.org) a standard for building APIs in JSON. out of the box. or write adaptor to convert to JSON API.
Ember-data: support Pagination & filtering 1st class citizen
Ember FastBoot: Build server render app.

Ember 2.0.   The plan is the feature. (Jun 12, 2015)
Ember Inspector : 1.0 stable  (Jun 12, 2015)
Ember CLI : 1.0 stable  (Jun 12, 2015)
Ember Data : 1.0 stable  (Jun 12, 2015)
Liquid Fire : 1.0 stable  (Jun 12, 2015)
List VIew : 1.0 stable  (Jun 12, 2015)

Glimmer: new rendering engine, build on HTMLBars, (https://dbmonster.firebaseapp.com/)
Handlebars is string intripulation and HTMLBars is a DOM things.
https://is-ember-fast-yet.firebaseapp.com/   Glimmer is going to land in 1.13

FastBoot:
Browser  => GET /posts   FastBoot (instead running in browser, run in server)  =>  JSON Data  API server
FastBoot => JS App  => First Page (after user sees that, JS catch up and client side js takes over)

EcoSystem to build a great production application.

Performance Issues: React VS Ember.
Doing a few things in DOM as possibly can. Touch DOM is slow, Virtual DOM is fast
Just refresh it. Virtual DOM is not a DOM, create very fast, diff the changes and update the view

Your antidote to Hype Fatigue.   from openning talk EmberConf 2015


Stef  Ember performance.

Better performance:  different ways to manipulate arrays
http://mrale.ph/
https://github.com/petkaantonov/bluebird/wiki/Optimization-killers

Bluebird do less work, Allocate less (GC burns CPU), Align with the underlying primitives.
GC, allocation cost lots of time. Ex: Clousures, Objects, Non-optimized code, compiled code
Work with runtime JS primitive, do not fight what is good in the runtime. Runtime can predict the code stable, it can be faster.

Actions up, Bindings Down, explicit data-flow. No two ways binding.
explicit life-cycle,

_super: overwriting a framework method before touching `this`

```js
export default Ember.Object.extend({
    init(args) {
        args.firstName = args.firstName || 'matt';
        args.lastName = args.lastName || 'ma';

        this._super(args);
    }
})
```

`Meta` is the "heart" the powers ember. Every class has a meta, every instance has a meta.
`Meta` is "live" inheriting.
Kill `Object.reopen` after instantiation.
No one inherits from meta of an instance. optimize "instance" meta's for instantiation. optimize "instance" listeners for subscription.


Talk 3 Ember Deployment

Server sends JS to the Browser, where the app is run, and interacts with an API on the server

App versioning, release process need to drop the session.
The big workflow difference between Ember apps and native mobile apps is in how they get updated and luanched.

HTML is how we bootstrap an Ember app, let us control which version of the app to launch

Solution: HTML page should be managed and deployed as part of staitic asset deployment process. HTML page should be served by the API server, but updates should not require re-deploying th server app or restarting server processes.


## Service

additional functionality to ember app instead of putting inside controller. Service make conventional and declarative imperatively via initializers and injections. Service simply extends the `Ember.Object` base class.

Services are automatically detected and registered by placing them in the "services" directory. To implement a service,`export default Ember.Service.extend();`

To help nudge users in the right direction, services should be opt-in rather than opt-out.

Services are singletons, and the singleton is injected into every instantiated object that matches the service's availableIn criteria. The name of the service is used to determine which property to set on the new instance.

Ember 1.x has exposed two APIs for managing dependency injection. The first is the application initializer API, using register and inject methods on an application instance. The second allows configuration of an injection on controllers via `needs`. The new injected properties offer a more declarative API for dependency injection.

Use Ember.inject.service() to inject a service with the same name as the property it is injected as. Ex: the storage service is injected onto the storage property:

```js
// Look for service in // app/services/storage.js
export default Ember.Component.extend({
  // Using Ember.inject.service() we can tell Ember that we need our storage service in this Component. Ember will then go off and lazy load our service at runtime. Name something different by defining the name of the function in 1st arg, So now, This component will have a property via `this.get('storage')` to access "storage" service methods and properties. The injected service property is lazy-loaded so you must use `this.get` to force the instantiation/lookup of it.
  storage: Ember.inject.service()
  // optional: Passing a name to the service() method allows a different service to be injected. // app/services/local-storage.js
  // storage: Ember.inject.service('local-storage')
});
```

in a larger applications where we have to request the service in each controller and route. Use DI with initialzers.

```js
// app/initializers/store.js
export default function initialize (container, app) {
    app.inject('route', 'store', 'service:store');  //  inject things into certain areas of it
    app.inject('controller', 'store', 'service:store');
    app.inject('route:routeName', 'myService', 'service:myService');  // pick and choose specific routes or controllers
}
export default {
    name: 'store',
    initialize: initialize
}

// Now if I wanted to access methods on this store I can do it like so:
// app/routes/index.js
import Ember from 'ember'
export default Ember.Route.extend({
    model: function () {
        return this.store.fetchPerson();
    }
});
```

## dependency injection (DI)

It refers to a dependent object being injected onto another object during instantiation. Sometimes an Ember.js library will use dependency injection to expose its API to developers. An example of this is Ember-Data, which injects its store into all routes and controllers.

service lookup, describes when a dependency is created or fetched on demand. Service lookup is the simpler pattern, DI and SL share the same goals: Isolate responsibilities in an application, Avoid the use of global variables and instances (important for testing), Allow a single object instance to represent state, but share that state with other objects.

## {{component}} helper

It could render components dynamically by name.

## Component

- Communication Between Components

A child component can communicate with a parent in a number of ways, common way: `sendAction`.

```js
// a parent component can tell a child component what its primary action is or give a named action to its children
{{#each people as |person|}}
  {{x-person person=person action="receiveFromChild" notifyer=this}}
{{/each}}

// And the child component can then call this action:
App.XPersonComponent = Ember.Component.extend({
  actions: {
    callParent: function(person) {
      this.sendAction("action", person);
    }
  },
```

Parent Component calling Children. use the `actions up and data down` paradigm where you push data changes down to the child components.

Here, demo calling children without data change.

The first way I solved this was to use Ember.Evented.

```js
// Parent component: A component can mix in the Ember.Evented mixin:
App.XPeopleComponent = Ember.Component.extend(Ember.Evented, {
  actions: {
    callChildren: function() {
      this.trigger('parentCall');  //  to broadcast an event to any listening children.
    },
    receiveFromChild: function(person) {
      alert("received " + person.get('name'));
    }

// Child component: can subscribe to these events
App.XPersonComponent = Ember.Component.extend({
  _setup: Ember.on('didInsertElement', function(){
    // subscribes to the event and supplies a handler which will be called when the parent triggers the event.
    // 'notifyer' comes from attributes defined in template, see templates above
    this.get('notifyer').on('parentCall', this, 'onParentCall');
  }),
  onParentCall: function() {
    alert('parent called with ' + this.get('person.name'));
  }
});
```

Second way, child component to register itself with the parent:

```js
App.XPersonComponent = Ember.Component.extend({
  _setup: Ember.on('didInsertElement', function(){
     var parent = this.nearestOfType(App.XPeopleComponent);  // The child component finds the parent
     parent.registerChild(this);
  }),
  parentCalling: function() {
    alert('parent called with ' + this.get('person.name'));
  }
});

// Below is the registerChild method that is used to register the child component:
App.XPeopleComponent = Ember.Component.extend( {
  children: Ember.A(),
  registerChild: function(child) {
    this.children.pushObject(child);
  }
});
```
