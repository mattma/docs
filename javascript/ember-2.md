## Ember Data

**We use the name of our model in singular form. This is important. We always reference the models in their singular form.** Ex: "$E.store.findAll('friend')"

When returning a list, `Ember-Data` expects the root name of the JSON payload to match the name of the model but pluralized (ex: friends) and followed by an array of objects. This payload will help us to populate Ember-Data store.

```bash
curl http://api.ember-cli-101.com/api/friends
```
```json
{
    "friends": [
        { /*...*/ }, { /*...*/ }, { /*...*/ }
    ]
}
```

By default, `Ember-Data` uses the `DS.RESTAdapter`, which expects everything to be in camelCase(default Ember-
Data adapter expects) following JavaScript’s coding conventions, so we can extend the DS.RESTAdapter to write our own adapter, matching our backend’s payload.

- Check order

* First, override with `buildURL` to use nested URLs in the backend
* Second, if no adapter is specified for the model, then the Resolver checks if we specified an Application adapter
* Third, if no model or application adapter is found, then Ember-Data falls back to the default adapter - the RESTAdapter

Ex: look up for the friend and application adapter in order. "borrowers/friend/adapter", "borrowers/adapters/friend", "borrowers/application/adapter" and "borrowers/adapters/application"

## Ember Inspector

Grab almost any instance of a Route, Controller, View or Model with the emberinspector and then reference it in the console with the `$E` variable. This variable is reset every time the browser gets refreshed.

ex: open Ember inspector, then click "routes", then "applications", "> $E". That will assign the application route instance to the variable `$E` in the console.

## Ember CLI

ember-cli allows us to group things that are logically related under a single directory. This structure is known as PODS.

In ember-cli, they should start with a dash followed by the partial name (-form.hbs). This is different from what Ember’s website suggests, which is using an underscore.

## Ember

- Route

Route is responsible for everything related to setting up the application state.

```js
// load a record by a given id. ex: /api/friends/1
this.store.find(‘friend’, 1)

// appending query parameters to the request URL. ex: /api/friends?active=true
this.store.findQuery(‘friend’, {active: true})
```

- Store

Store is an Ember-Data class in charge of managing everything related to our model’s data. It knows about all the records we
currently have loaded in our application and it has some functions that will help us to find, create, update, and delete records. During the whole application life cycle there is a unique instance of the Store, and it is injected as a property into every Route, Controller, Serializer, and Adapter under the key store.

- Model

model hook `store.createRecord` creates a new record in our application store, but it doesn’t save it to the backend.

- Template

Template: The partial method is part of the Ember.Handlebars.helpers⁴¹ class. It is used to render other templates in the context of the current template.

{{outlet}} is very similar to the word `yield` in templates. Basically it allows us to put content into it.

{{action}} helper allows us to bind an action in the template to an action in the template’s Controller or Route. By default it is bound to the click action, but it can be bound to other actions.

Ember expects us to define our action handlers inside the property actions in the Controller or Route. When the action is called, Ember first looks for a definition in the Controller. If there is none, it goes to the Route and keeps bubbling until Application Route.

If any of the actions returns false or no return statement, then it stops bubbling. If return true, it will keep bubbling up.

If having trouble understanding how routes actions bubbles, Ember inspector click "Routes", then select "Current Route only", to see the bubble order defined.
