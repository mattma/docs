#[JSDoc 3](http://usejsdoc.org/about-getting-started.html)

JSDoc 3 is an API documentation generator for JavaScript. You add documentation comments directly to your source code, right along side the code itself. JSDoc's purpose is to document the API of your JavaScript application or library. It is assumed that you will want to document things like: namespaces, classes, methods, method parameters, etc. The JSDoc Tool will scan your source code, and generate a complete HTML documentation website for you.

1. Generating A Website

By default, [JSDoc](https://github.com/jsdoc3/jsdoc) will use the "default" template to turn the documentation data into HTML.  Run `./jsdoc book.js` to generate documentation from command line. It will create a folder named "out" in the current working directory. Within that you will find the generated HTML pages.

2. Comments

- JSDoc comments should generally be placed immediately before the code being documented.
- It must start with a /** sequence in order to be recognized by the JSDoc parser. Comments beginning with /*, /***, or more than 3 stars will be ignored.

The simplest documentation is just a description.

```js
    /** This is a description of the foo function. */
    function foo() {  }
```

3. Namepath

When referring to a JavaScript variable that is elsewhere in your documentation, you must provide a unique identifier that maps to that variable. A namepath provides a way to do so and disambiguate between instance members, static members and inner variables.

Basic Syntax Examples of Namepaths

```js
    myFunction
    MyConstructor
    MyConstructor#instanceMember
    MyConstructor.staticMember
    MyConstructor~innerMember // note that JSDoc 2 uses a dash
```

```js

    Person#say  // the instance method named "say."
    Person.say  // the static method named "say."
    Person~say  // the inner method named "say."

    /** @constructor */
    Person = function() {
        this.say = function() {
            return "I'm an instance.";
        }
        function say() {
            return "I'm inner.";
        }
    }
    Person.say = function() {
        return "I'm static.";
    }

    var p = new Person();
    p.say();      // I'm an instance.
    Person.say(); // I'm static.
    // there is no way to directly access the inner function from here
```

if a constructor has an instance member that is also a constructor, you can simply chain the namepaths together to form a longer namepath ex: `Person#Idea#consider`. This chaining can be used with any combination of the connecting symbols: # . ~

3. Tag

documentation tags

```js
    /**
     * Represents a book.
     * @constructor
     * @param {string} title - The title of the book.
     * @param {string} author - The author of the book.
     */
    function Book(title, author) {
    }
```

- @abstract (synonyms: @virtual) This member must be implemented (or overridden) by the inheritor.

- @access Specify the access level of this member (private, public, or protected).

- @alias   Treat a member as if it had a different name.

- @augments (synonyms: @extends)  This object adds onto a parent object.

- @author  Identify the author of an item.

- @borrows  This object uses something from another object.

- @callback  Document a callback function.

- @class (synonyms: @constructor)  This function is intended to be called with the "new" keyword.

- @classdesc   Use the following text to describe the entire class.

- @constant (synonyms: @const)   Document an object as a constant.

- @constructs    This function member will be the constructor for the previous class.

- @copyright   Document some copyright information.

- @default (synonyms: @defaultvalue)   Document the default value.

- @deprecated   Document that this is no longer the preferred way.

- @description (synonyms: @desc)   Describe a symbol.

- @enum    Document a collection of related properties.

- @event    Document an event.

- @example    Provide an example of how to use a documented item.

- @exports   Identify the member that is exported by a JavaScript module.

- @external (synonyms: @host)   Document an external class/namespace/module.

- @file (synonyms: @fileoverview, @overview)   Describe a file.

- @fires (synonyms: @emits)   Describe the events this method may fire.

- @function (synonyms: @func, @method)   Describe a function or method.

- @global   Document a global object.

- @ignore  [todo] Remove this from the final output.

- @inner   Document an inner object.

- @instance   Document an instance member.

- @kind   What kind of symbol is this?

- @lends  Document properties on an object literal as if they belonged to a symbol with a given name.

- @license  [todo] Document the software license that applies to this code.

- @link  Inline tag - create a link.

- @member (synonyms: @var)   Document a member.

- @memberof    This symbol belongs to a parent symbol.

- @mixes    This object mixes in all the members from another object.

- @mixin    Document a mixin object.

- @module   Document a JavaScript module.

- @name   Document the name of an object.

- @namespace   Document a namespace object.

- @param (synonyms: @arg, @argument)  Document the parameter to a function.

- @private   This symbol is meant to be private.

- @property (synonyms: @prop)   Document a property of an object.

- @protected   This member is meant to be protected.

- @public   This symbol is meant to be public.

- @readonly   This symbol is meant to be read-only.

- @requires   This file requires a JavaScript module.

- @returns (synonyms: @return)   Document the return value of a function.

- @see  Refer to some other documentation for more information.

- @since   When was this feature added?

- @static   Document a static member.

- @summary   A shorter version of the full description.

- @this  What does the 'this' keyword refer to here?

- @throws (synonyms: @exception)   Describe what errors could be thrown.

- @todo  Document tasks to be completed.

- @tutorial   Insert a link to an included tutorial file.

- @type   Document the type of an object.

- @typedef    Document a custom type.

- @variation   Distinguish different objects with the same name.

- @version   Documents the version number of an item.

