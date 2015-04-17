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
