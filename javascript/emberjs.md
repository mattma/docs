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
