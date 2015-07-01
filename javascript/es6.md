Note from [Understanding ES6](https://leanpub.com/understandinges6/read/#leanpub-auto-objects), currently read through `Object`, check back until author completes the object section.

# ES6

ECMAScript Language Specfication, Edition 6

Javascript Engines: new versions = forced upgrades, Must run all existing code. ES6 only adds features.

## Resources:

1. [ES6 Compatibility table](http://kangax.github.io/compat-table/es6/)
2. [ES6 Learning](https://github.com/ericdouglas/ES6-Learning)
3. [ES6 Fiddle](http://www.es6fiddle.com/) based on traceur

## [High Level](http://espadrine.github.io/New-In-A-Spec/es6/)

* let, const (define block-local vars, deprecate var in the future), function in block scope

* destructuring: let {x, y} = pt; let [s, v, o] = triple(); (assuming let pt = {x:2, y:-5}, for instance).

* parameter default values: function f(x, y=1, z=0) {⋯}

* rest: function g(i, j, ...r) { return r.slice(i, j); } (instead of using `arguments`).

* spread: let a = [0,1,2,3], o = new Something(...a);. Also works in array literals: [1, ...array, 4]. Split array in index

* Shorthand object literals: let one = 1; { one, func_one() {return 1;}, ['key ' + one]: 1 }. [@TODO]

* fat arrow: (a) => a * a is the same as (function(a) { return a * a; }).bind(this)

* map, set: let m = new Map(); m.set(key, value); m.has(key); m.get(key). Also has .clear(), .delete(), .forEach(), .keys().

* weak map: let map = new WeakMap(). Use it if you have circular references in it. You also have new WeakSet().

* promise: new Promise((resolve, reject) => {…}).

resolve(valueOrPromise) returns the promised value (or a new promise, to chain them) in promise.then(value => {…}).
reject(new Error(…)) breaks the promise in promise.then(…).then(…).catch(error => {…}).
Quick promise creation: Promise.resolve(value), Promise.reject(error).
Iterables: Promise.all(listOfPromises).then(listOfValues => …), Promise.race(listOfPromises).then(valueThatResolvedFirst => …)

* proxies: let obj = new Proxy(proto, handler). Long story short: ~ operator overloading with object-like elements. (Can also catch all property accesses on an object.)

* generators: function* gen() { yield 1; yield 2; } Actually, gen() returns ~ an object with a next() function property. It is iterables.

* iterators: for (var [key, val] of items(x)) { alert(key + ',' + val); }. Iterators can be generators or proxies.

* class syntax, with extends, super, and static:

```js
    class Point extends Base {
      constructor(x,y) {
        super();
        this[px] = x;
        this[py] = y;
        this.r = function() { return Math.sqrt(x*x + y*y); }
      }
      get x() { return this[px]; }
      get y() { return this[py]; }
      proto_r() { return Math.sqrt(this[px] * this[px] + this[py] * this[py]); }
      equals(p) { return this[px] === p[px] && this[py] === p[py]; }
    }
```

* Symbols generate unique inaccessible keys, useful in maps and classes (private members).

```js
    let a = Map();
    {
      let k = Symbol();
      a.set(k, 'value');
      // Here, we can get and reset 'value' as a.get(k).
    }
    // Here, a.get(k) is invalid, a.size is 1, but the key cannot be seen.
```

- [6to5](https://6to5.github.io/differences.html) Language Support

Array comprehension, Arrow function, Async function, Class, Computed property names, Constants, Default parameters, Destructuring, For-of, Generators, Generator comprehension, Let scoping, Modules, Property method assignment, Property name shorthand, Rest parameters, Spread, Template literals, Unicode regex.

* modules:

```js
    module math {
      export function sum(x, y) {
        return x + y;
      }
      export var pi = 3.141593;
    }


    import {sum, pi} from math;
    alert(sum(pi,pi));
```

* template strings: multiline, substitution-ready strings with extensibility. `You are ${age} years old.`.

// The following regexp spans multiple lines.
re`line1: (words )*
line2: \w+`


// It desugars to:
re({raw:'line1: (words )*\nline2: \w+', cooked:'line1: (words )*\nline2: \w+'})

* Typed Array

## ECMAScript 6 Features

1. String

- normalize()

ES6 supports the four Unicode normalization forms through a new method on strings. This method optionally accepts a single parameter, one of "NFC" (default), "NFD", "NFKC", or "NFKD".

```js
    // strings in a values array are converted into a normalized form so that the array can be sorted appropriately.
    //  the most important thing to remember is that both values must be normalized in the same way.
    values.sort(function(first, second) {
        var firstNormalized = first.normalize(),
            secondNormalized = second.normalize();

        if (firstNormalized < secondNormalized) {
            return -1;
        } else if (firstNormalized === secondNormalized) {
            return 0;
        } else {
            return 1;
        }
    });
```

- Unicode - RegExp `u` flag, `y` flag

Non-breaking additions to support full Unicode, including new unicode literal form in strings and new RegExp `u` mode to handle code points, as well as new APIs to process strings at the 21bit code points level.

u for “Unicode”, it allows RegExp to correctly match the string by characters. Unfortunately, ES6 does not have a way of determining how many code points are present in a string.

```js
    var text = "𠮷";

    console.log(text.length);           // 2
    console.log(/^.$/.test(text));      // false
    console.log(/^.$/u.test(text));     // true
    "𠮷".match(/./u)[0].length == 2;  // new RegExp behaviour, opt-in ‘u’
    "𠮷".codePointAt(0) == 0x20BB7;  // new String ops

    // for-of iterates code points
    for(var c of "𠮷") {
      console.log(c);
    }
```

y (sticky) flag indicates that the next match should be made starting with the value of lastIndex on the regular expression. sticky regular expressions have an implied ^ at the beginning, indicating that the pattern should match from the beginning of the input.

```js
    var pattern = /hello\d\s?/y,
        text = "hello1 hello2 hello3",
        result = pattern.exec(text);

    console.log(result[0]);             // "hello1 "
    console.log(pattern.lastIndex);     // 7

    result = pattern.exec(text);

    console.log(result[0]);             // "hello2 "
    console.log(pattern.lastIndex);     // 14
```

- contains(), startsWith(), endsWith()

purpose is to identify strings inside of other strings. Each of these methods accepts two arguments: the text to search for and an optional location from which to start the search. When the second argument is omitted, contains() and startsWith() start search from the beginning of the string while endsWith() starts from the end. In effect, the second argument results in less of the string being searched.

contains() - returns true if the given text is found anywhere within the string or false if not.
startsWith() - returns true if the given text is found at the beginning of the string or false if not.
endsWith() - returns true if the given text is found at the end of the string or false if not.

```js
    var msg = "Hello world!";

    console.log(msg.startsWith("Hello"));       // true
    console.log(msg.endsWith("!"));             // true
    console.log(msg.contains("o"));             // true
```

indexOf() as a way to identify strings inside of other strings since JavaScript was first introduced. These three methods make it much easier to identify substrings without needing to worry about identifying their exact position.

- repeat()

This method accepts a single argument, which is the number of times to repeat the string, and returns a new string that has the original string repeated the specified number of times.

```js
    console.log("hello".repeat(2));     // "hellohello"
```

2. Number

JavaScript numbers can be particularly complex due to the dual usage of a single type for both integers and floats.

- Octal and Binary Literals

Both of these notations take a hint for the hexadecimal literal notation of prepending 0x or 0X to a value.
octal literal format begins with 0o or 0O
binary literal format begins with 0b or 0B.
Each literal type must be followed by one or more digits, 0-7 for octal, 0-1 for binary.

```js
    // ECMAScript 6
    var value1 = 0o71;      // 57 in decimal
    var value2 = 0b101;     // 5 in decimal

    console.log(parseInt("0o71"));      // 0
    console.log(parseInt("0b101"));     // 0
    console.log(Number("0o71"));      // 57
    console.log(Number("0b101"));     // 5
```

- Number.isFinite() and Number.isNaN().

isFinite() determines if a value represents a finite number (not Infinity or -Infinity)
isNaN() determines if a value is NaN (since NaN is the only value that is not equal to itself)

These methods always return false when passed a non-number value (eliminating certain types of errors) and return the same values as their global counterparts when passed a number value

```js
    console.log(isFinite(25));              // true
    console.log(isFinite("25"));            // true
    console.log(Number.isFinite(25));       // true
    console.log(Number.isFinite("25"));     // false

    console.log(isNaN(NaN));                // true
    console.log(isNaN("NaN"));              // true
    console.log(Number.isNaN(NaN));         // true
    console.log(Number.isNaN("NaN"));       // false
```

- Number.parseInt() and Number.parseFloat()

These functions behave exactly the same as the global functions parseInt() and parseFloat().

- Number.isInteger()

determine if a value represents an integer. Since integers and floats are stored differently, the JavaScript engine looks at the underlying representation of the value to make this determination. That means numbers that look like floats might actually be stored as integers and therefore return true from Number.isInteger().

```js
    console.log(Number.isInteger(25));      // true
    console.log(Number.isInteger(25.0));    // true
    console.log(Number.isInteger(25.1));    // false
```

- Number.isSafeInteger()

ensures that a value is an integer and falls within the safe range of integer values. Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER that represent the upper and lower bounds of the same range, respectively.

JavaScript can only accurately represent integers between -2 power 53 and 2 power 53, and outside of this “safe” range, binary representations end up reused for multiple numeric values

```js
    console.log(Math.pow(2, 53));         // 9007199254740992
    console.log(Math.pow(2, 53) + 1);  // 9007199254740992
```

```js
    var inside = Number.MAX_SAFE_INTEGER,
        outside = inside + 1;

    console.log(Number.isInteger(inside));          // true
    console.log(Number.isSafeInteger(inside));      // true

    console.log(Number.isInteger(outside));         // true
    console.log(Number.isSafeInteger(outside));     // false
```

- Number.isNaN()

In ES5, `isNaN('NaN')` would be true, but in ES6, `isNaN('NaN')` would be false, because it is not a Number, it is a String.

- Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER

deal with `Math.pow(2, 53)` is the max value of the Integer what JS is able to store. Now it is a Const.

- New Math Methods

The aforementioned new emphasis on gaming and graphics in JavaScript led to the realization that many mathematical calculations could be done more efficiently by a JavaScript engine than with pure JavaScript code. Optimization strategies like asm.js, which works on a subset of JavaScript to improve performance, need more information to perform calculations in the fastest way possible.

New Method  Description
Math.acosh(x)   Returns the inverse hyperbolic cosine of x.
Math.asinh(x)   Returns the inverse hyperbolic sine of x.
Math.atanh(x)   Returns the inverse hyperbolic tangent of x
Math.cbrt(x)    Returns the cubed root of x.
Math.clz32(x)   Returns the number of leading zero bits in the 32-bit integer representation of x.
Math.cosh(x)    Returns the hyperbolic cosine of x.
Math.expm1(x)   Returns the result of subtracting 1 from the exponential function of x
Math.fround(x)  Returns the nearest single-precision float of x.
Math.hypot(...values)   Returns the square root of the sum of the squares of each argument.
Math.imul(x, y) Returns the result of performing true 32-bit multiplication of the two arguments.
Math.log1p(x)   Returns the natural logarithm of 1 + x.
Math.log10(x)   Returns the base 10 logarithm of x.
Math.log2(x)    Returns the base 2 logarithm of x.
Math.sign(x)    Returns -1 if the x is negative 0 if x is +0 or -0, or 1 if x is positive.
Math.sinh(x)    Returns the hyperbolic sine of x.
Math.tanh(x)    Returns the hyperbolic tangent of x.
Math.trunc(x)   Removes fraction digits from a float and returns an integer.

3. Object

- Object.is(value1, value2)

This method accepts two arguments and returns true if the values are equivalent. Two values are considered equivalent when they are of the same type and have the same value. In many cases, Object.is() works the same as ===. The only differences are that +0 and -0 are considered not equivalent and NaN is considered equivalent to NaN.

```js
    console.log(+0 === -0);             // true
    console.log(Object.is(+0, -0));     // false

    console.log(NaN === NaN);           // false
    console.log(Object.is(NaN, NaN));   // true

    console.log(5 == "5");              // true
    console.log(5 === "5");             // false
    console.log(Object.is(5, 5));       // true
    console.log(Object.is(5, "5"));     // false
```

- Object.assign(obj, mixin)

Merge one object into another one. similar to `_.extend()` from Underscore.js. ex: `Object.assign(this, {x, y})`

- Object.getPrototypeOf(obj)  // Function.prototype

returns the prototype (i.e. the value of the internal [[Prototype]] property) of the specified object.

- Object.setPrototypeOf(Obj, proto)

```js
  var proto = {};
  var obj= Object.create(proto);
  Object.getPrototypeOf(obj) === proto; // true
```

- shorthand syntax

```js
  var object = {
    method() {
      return "a";
    }
  };
  object.method(); // "a"
```

- Destructuring Assignment

pulling data out of objects and arrays. destructuring assignment, which systematically goes through an object or array and stores specified pieces of data into local variables. Destructuring is fail-soft, similar to standard object lookup foo["bar"], producing undefined values when not found.

If the right side value of a destructuring assignment evaluates to null or undefined, an error is thrown.
If the property with the given name doesn’t exist on the object, then the local variable gets a value of undefined.

```js
  var [ start, end ] = ["earth", "moon"] // initialize
  console.log(start + " calling " + end); // earth calling moon

  [start, end] = [end, start] // variable swapping
  console.log(start + " calling " + end); // moon calling earth

  // skip certain variables, just leave the array element empty
  function equinox() {
    return [20, "March", 2013, 11, 02];
  }
  var [date, month, , ,] = equinox();
  console.log("This year's equinox was on " + date + month); // This year's equinox was on 20March
```

```js
// list matching
var [a, , b] = [1,2,3];

// object matching
var { op: a, lhs: { op: b }, rhs: c } = getASTNode()

// object matching shorthand
// binds `op`, `lhs` and `rhs` in scope
var {op, lhs, rhs} = getASTNode()

// Can be used in parameter position
function g({name: x}) {
  console.log(x);
}
g({name: 5})

// Fail-soft destructuring
var [a] = [];
a === undefined;

// Fail-soft destructuring with defaults
var [a = 1] = [];
a === 1;
```

Property value shorthand:  `{x, y}` is the same as `{x: x, y: y}`
An object returned as multiple return values, the destructuring order is not matter. because matched by key.

```js
    var options = {
        repeat: true,
        save: false,
        rules: {
            custom: 10
        }
    };
    // options.repeat is stored in a variable called localRepeat
    // object literal syntax where key is the property to find on options and value is the variable in which to store the property value.
    var { repeat: localRepeat, save: localSave } = options;

    console.log(localRepeat);       // true
    console.log(localSave);         // false

    // form 2: use the property name as the local variable name by omitting the colon and the identifier
    //  two local variables called repeat and save are created.
    //  {custom} The extra set of curly braces allows you to descend into a nested an object and pull out its properties.
    var { repeat, save, rules: { custom } } = options;

    console.log(repeat);        // true
    console.log(save);           // false
    console.log(custom);      // 10
```

SYNTAX GOTCHA

If you try use destructuring assignment without a var, let, or const, this causes a syntax error because the opening curly brace is normally the beginning of a block and blocks can’t be part of assignment expressions.

```js
    // syntax error
    { repeat, save, rules: { custom }} = options;

    // no syntax error, The solution is to wrap the left side literal in parentheses
    ({ repeat, save, rules: { custom }}) = options;
```

```js
var colors = [ "red", [ "green", "lightgreen" ], "blue" ];
var [ firstColor, [secondColor] ] = colors;

console.log(firstColor);        // "red"
console.log(secondColor);   // "green"
```

- Object Literal

Object literals are extended to support setting the prototype at construction, shorthand for `foo: foo` assignments, defining methods and making super calls. Together, these also bring object literals and class declarations closer together, and let object-based design benefit from some of the same conveniences.

```js
// ES5
var obj = Object.create(someObject);
obj.myMethod = function(arg1, arg2) {
  // ...
};

// ES6
let obj = {
  __proto__ : someObject, //special property
  myMethod(arg1, arg2) {  // method definition
    // ...
  }
}
```

```js
var obj = {
    // __proto__, support comes from the JavaScript engine running your program. Although most support the now standard property
    __proto__: theProtoObj,
    // Shorthand for ‘handler: handler’
    handler,
    // Methods
    toString() {
     // Super calls
     return "d " + super.toString();
    },
    // Computed (dynamic) property names
    [ "prop_" + (() => 42)() ]: 42
};
```

4. Variable

The let and const block bindings introduce lexical scoping to JavaScript. These declarations are not hoisted and only exist within the block in which they are declared. That means behavior that is more like other languages and less likely to cause unintentional errors, as variables can now be declared exactly where they are needed.

It’s expected that the majority of JavaScript code going forward will use let and const exclusively, effectively making var a deprecated part of the language.

Block-scoped binding constructs. let is the new var. const is single-assignment. Static restrictions prevent use before assignment.

```js
function f() {
  {
    let x;
    {
      // okay, block scoped name
      const x = "sneaky";
      // error, const
      x = "foo";
    }
    // error, already declared in block
    let x = "inner";
  }
}
```

- let && Block bindings

variables are created at the spot where the declaration occurs. In JavaScript, however, this is not the case.
In ES6, Each Block has got its lexical environment.
Variables declared using var are hoisted to the top of the function (or global scope) regardless of where the actual declaration occurs.
let/const bind variables to the lexical environment, NOT hoisted.

```js
  // variable is hoisted to the top, varialbe inside the funcion create a scope, override the global
  // Within its current scope, regardless of where a variable is declared, it will be, behind the scenes, hoisted to the top
  var hello;  // the declaration
  var myvar = 'my value';  // the initialization
  (function() {
    alert(myvar); // undefined
    var myvar = 'local value';
  })();
```

```js
    function getValue(condition) {
        if (condition) {
            var value = "blue";
            return value;
        } else {
            // value exists here with a value of undefined
            return null;
        }
        // value exists here with a value of undefined
    }
```

you might expect that the variable value is only defined if condition evaluates to true. In fact, the variable value is declared regardless. The JavaScript engine changes the function to look like this:

```js
    function getValue(condition) {
        var value;
        if (condition) {
            value = "blue";
            return value;
        } else {
            return null;
        }
    }
```

The declaration of value is moved to the top (hoisted) while the initialization remains in the same spot. That means the variable value is actually still accessible from within the else clause, it just has a value of undefined because it hasn’t been initialized. For this reason, ECMAScript 6 introduces block level scoping options to make the control of variable lifecycle a little more powerful.

`Let` declarations

`let` it is block scoped instead of function scoped.

The let declaration syntax is the same as for var. You can basically replace var with let to declare a variable but keep its scope to the current code block. The declaration is not hoisted to the top, and the variable value is destroyed once execution has flowed out of the if block. If condition evaluates to false, then value is never declared or initialized.

Perhaps one of the areas where developers most want block level scoping of variables is with for loops.

```js
    for (var i=0; i < items.length; i++) {
        process(items[i]);
    }
    // i is still accessible here and is equal to items.length, because the var declaration was hoisted.
```

```js
    // variable i only exists within for loop. Once the loop is complete, variable is destroyed and is no longer accessible elsewhere.
    for (let i=0; i < items.length; i++) {
        process(items[i]);
    }
    // i is not accessible here
```

```js
    // variable i is shared across each iteration of the loop, meaning the closures created inside the loop all hold a reference to the same variable. The variable i has a value of 10 once the loop completes, and so that’s the value each function outputs.
    var funcs = [];

    for (var i=0; i < 10; i++) {
        funcs.push(function() { console.log(i); });
    }

    funcs.forEach(function(func) {
        func();     // outputs 10 ten times
    });

    // To fix this problem, developers use immediately-invoked function expressions (IIFEs) inside of loops to force a new copy of the variable to be created. The i variable is passed to the IIFE, which creates it’s own copy and stores it as value.
    for (var i=0; i < 10; i++) {}
         funcs.push((function(value) {
            return function() { console.log(value); }
         })(i));
     }

     // A let declaration does this for you without the IIFE. Each iteration through the loop results in a new variable being created and initialized to the value of the variable with the same name from the previous iteration.
     for (let i=0; i < 10; i++) {}
         funcs.push(function() { console.log(i); }); // funcs contains an array of 0, then 1, then 2, up to 9
     }
```

Unlike var, let has no hoisting characteristics. A variable declared with let cannot be accessed until after the let statement.

```js
    if (condition) {
        console.log(value);     // ReferenceError!
        let value = "blue";      // Never executed because prev line throws an error
    }
```

let will not redefine an identifier that already exists in the same scope, the declaration throws an error.

```js
    var count = 30;
    // Syntax error
    let count = 40;
```

No error is thrown if a let declaration creates a new variable in a scope with the same name as a variable in the containing scope. Here, the let declaration will not throw an error because it is creating a new variable called count within the if statement. This new variable shadows the global count, preventing access to it from within the if block.

```js
    var count = 30;
    // Does not throw an error
    if (condition) {
        let count = 40;
    }
```

Since let declarations are not hoisted to the top of the enclosing block, you may want to always place let declarations first in the block so that they are available to the entire block.

- const

Variables declared using const are considered to be constants, so the value cannot be changed once set. For this reason, every const variable must be initialized. `let` and `const` behave similarly in the sense that both are block scoped, but with const, the values are read-only and cannot be re-declared later on. `const` variable cannot re-assign, re-initialize, re-declare.

```js
    // Valid constant
    const MAX_ITEMS = 30;

    // Syntax error: missing initialization
    const NAME;

    var message = "Hello!";
    // cause an error given the previous declarations
    const message = "Goodbye!";
```

Constants are also block-level declarations, similar to let. That means constants are destroyed once execution flows out of the block in which they were declared and declarations are hoisted to the top of the block.

```js
    if (condition) {
        const MAX_ITEMS = 5;
    }
    // MAX_ITEMS isn't accessible here
```

5. Function

- Default Parameters

Any parameters with a default value are considered to be optional parameters while those without default value are considered to be required parameters. default parameter arguments is that the default value need not be a primitive value. It only show the default value when passing an `undefined`, but no `null`. `null` consider explicitly enter a `null` value. But no `""`, empty string consider as a valid value so that no default value used.

```js
    // simple
    function makeRequest(url, timeout = 2000, callback = function() {}) {
    }

    // complex
    //possible to specify default values for any arguments, including those that appear before arguments without default values.
    function makeRequest(url, timeout = 2000, callback) {  }  // valid
    //  the default value for timeout will only be used if there is no second argument passed in or if the second argument is explicitly passed in as undefined.

    // uses default timeout
    makeRequest("/foo", undefined, function(body) {
        doSomething(body);
    });

    // uses default timeout
    makeRequest("/foo");

    // doesn't use default timeout
    // value of null is considered to be valid and the default value will not be used.
    makeRequest("/foo", null, function(body) {
        doSomething(body);
    });
```

Here, if the last argument isn’t provided, the function getCallback() is called to retrieve the correct default value. This opens up a lot of interesting possibilities to dynamically inject information into functions. Bypass default value need not be a primitive value rule.

```js
    function getCallback() {
        return function() {
            // some code
        };
    }

    function makeRequest(url, timeout = 2000, callback = getCallback()) {
    }
```

- Rest Parameter

Rest parameters are indicated by three dots (...) preceding a named parameter. That named parameter then becomes an Array containing the rest of the parameters (which is why these are called “rest” parameters). It is the syntax level with three dots ... to denote a variable number of arguments. No need for `arguments` anymore.

The only restriction on rest parameters is that no other named arguments can follow in the function declaration.

`arguments` is not a true array, have some array behaviors. Rest parameter is always the last parameter inside the function, have `...` prefix. When individual parameters invoked by function call, they will packed up into a true array argument and have all array methods available like `forEach`, `map`. If no parameters invoked by function call, rest parameter would be an empty array, so it won't throw an error in this case.

```js
    // numbers is a rest parameter that contains all parameters after the first one
    // (unlike arguments, which contains all parameters including the first one
    function sum(first, ...numbers) {
        let result = first,
            i = 0,
            len = numbers.length;

        while (i < len) {
            result += numbers[i];
            i++;
        }

        return result;
    }

    // Syntax error: Can't have a named parameter after rest parameters
    function sum(first, ...numbers, last) {
```

- Spread Operator

It is closely related to rest parameters. It is the opposite of rest parameters. When calling a function, we can pass in the fixed argument that is needed along with an array of a variable size with the familiar three dot syntax, to indicate the variable number of arguments.

Turn an array into function/method arguments. The inverse of a rest parameter, Mostly replace `Function.prototype.apply()`, Also works in Constructors.

Rest parameters specify multiple independent arguments should be combined into an array.
Spread operator specify an array that should be split and have its items passed in as separate arguments to a function.

```js
    // es5 old way
    var  values = [25, 50, 75, 100]
    // Math.max() method doesn’t allow you to pass in an array. stuck with `apply`
    console.log(Math.max.apply(Math, values));  // 100

    // es6 new way
    // JavaScript engine then splits up the array into individual arguments and passes them in
    let values = [25, 50, 75, 100]
    // equivalent to console.log(Math.max(25, 50, 75, 100));
    console.log(Math.max(...values));           // 100
    // mix and match the spread operator with other arguments
    console.log(Math.max(...values, 200));   // 200

    // Another example, embed inside an array
    var a = [3, 4];
    var b = [1, 2, ...a, 5, 6 ];  // b is [1, 2, 3, 4, 5, 6]
```

- Destructured Parameters

It’s recommended to always provide the default value for destructured parameters to avoid all errors that are unique to their usage.

```js
    // es5, old way
    function setCookie(name, value, options) {
        options = options || {};
        var secure = options.secure,
            path = options.path,
            domain = options.domain,
            expires = options.expires;
        // ...
    }

    // es6, new way
    function setCookie(name, value, { secure, path, domain, expires }) {
        // ...
    }

    // usage and behavior are identical.
    // the biggest difference is the third argument uses destructuring to pull out the necessary data.
    // destructured parameters also act like regular parameters in that they are set to undefined if they are not passed.
    setCookie("type", "js", {
        secure: true,
        expires: 60000
    });

    // One quirk of this pattern is that the destructured parameters don’t exist when the argument isn’t provided. If setCookie() is called with just two arguments, any attempt to access secure, path, domain, or expires will throw an error.
    // destructuring assignment throws an error when the right side expression evaluates to null or undefined, the same is true with the third argument isn’t passed.
    function setCookie(name, value, { secure, path, domain, expires }) {
        if (typeof secure !== "undefined") {
            // use it
        }
        // ...
    }

    // without `typeof` check, attempting to access secure, path, domain, or expires inside of the function will result in an error.
    // work same like below.
    function setCookie(name, value, options) {
        var { secure, path, domain, expires } = options;
        // ...
    }

    // Final work around this behavior by providing a default value for the destructured parameter:
    // This example now works exactly the same as the first example es5 old way
    function setCookie(name, value, { secure, path, domain, expires } = {}) {
        // ...
    }
```

- Template Literals

Invocation:  ` templateHandler `hello ${first} ${last}`
Syntax sugar for:  `templateHandler(['hello ', ' ', '!'], first, last)`  // "hello" is static, `first` is dynamic

template literals will always return String. Open a lot of possiblities: Query languages, Text localization, Templating, etc.

```js
  let url = `http://apiserver/${category}/${id}`
```

Multiple lines with no excaping.

```js
  var str = `this is
    a text with multiple lines`;
```

```js
  // localization and formatting
  I10n`Hello ${name}, you are visitor No. ${visitor}:n! You have ${money}:c in your account!`
  // I10n is the name mapping to the template function
  // write a L10n function that:
  // if it sees nothing after the var, it does nothing
  // if it sees :n, it uses localized number formatter
  // if it sees :c, it uses localized currency formatter
```

```js
  jsx`<a href="${url}">${text}</a>`
  // wite a smart jsx function that transform this into
  React.DOM.a({ href: url }, text);  // No compile to JS language required.
```

```js
  // dynamic regular expression
  new RegExp('\\d+' + separator + '\\d+');
  // Instead, write a `re` function to make this work
  re`\d+${separator}\d+`
```

It could associate a tag with Template Literal, and it could be a function to execute at the run time.

```js
  let upper = function(strings) {
    let result = "";
    for( var i=0; i < strings.length; i++) {
      result += strings[i];
    }
    return result.toUpperCase();
  };
  let x =1;
  let y = 3;
  let result = upper `${x} + ${y} is ${x+y}`;
  // result would be  "1 + 3 IS 4"
```

- Name Property

All functions in an ECMAScript 6 program will have an appropriate value for their name property while all others will have an empty string.

```js
    function doSomething() {
        // ...
    }
    console.log(doSomething.name);          // "doSomething"
    var doAnotherThing = function() {
        // ...
    };
    console.log(doAnotherThing.name);       // "doAnotherThing"

    // function expression itself has a name and that name takes priority over the variable to which the function was assigned.
    var doSomething = function doSomethingElse() {
        // ...
    };

    var person = {
        // person.firstName is actually a getter function, so its name is "get firstName" to indicate this difference (setter functions are prefixed with "set" as well).
        get firstName() {
            return "Nicholas"
        },
        // The name property of person.sayName() is "sayName", as the value was interpreted from the object literal
        sayName: function() {
            console.log(this.name);
        }
    }

    console.log(doSomething.name);      // "doSomethingElse"
    console.log(person.sayName.name);   // "sayName"
    console.log(person.firstName.name); // "get firstName"
```

A couple of special cases, Functions created using bind() will have their name prefixed with "bound" and functions created using the Function constructor have a name of "anonymous".

```js
    var doSomething = function() {
        // ...
    };
    console.log(doSomething.bind().name);   // "bound doSomething"

    console.log((new Function()).name);     // "anonymous"
```

- Block-Level Functions

Block level functions are hoisted to the top of the block in which they are defined, so typeof doSomething returns "function" even though it appears before the function declaration in the code. Once the if block is finished executing, doSomething() no longer exists.

Block level functions are a similar to let function expressions in that the function definition is removed once execution flows out of the block in which it’s defined. The key difference is that block level functions are hoisted to the top of the containing block while let function expressions are not hoisted.

ECMAScript 6 also allows block-level functions in nonstrict mode, but the behavior is slightly different. Instead of hoisting these declarations to the top of the block, they are hoisted all the way to the containing function or global environment so that it still exists outside of the if block.

```js
    // example 1, in the strict mode
    "use strict";

    if (true) {
        console.log(typeof doSomething);        // "function"
        function doSomething() {
            // ...
        }
        doSomething();
    }
    console.log(typeof doSomething);            // "undefined"

    // example 2, not hoisted the variable
    if (true) {
        console.log(typeof doSomething);        // throws error. code stop executing
        let doSomething = function () {
            // ...
        }
        doSomething();
    }

    // example 3, es6 not in strict mode
    if (true) {
        console.log(typeof doSomething);        // "function"
        function doSomething() {
            // ...
        }
        doSomething();
    }
    console.log(typeof doSomething);            // "function"
```

- Arrow Function ( => syntax )

arrow functions are designed to be used in places where anonymous functions have traditionally been used. They are not really designed to be kept around for long periods of time, hence the inability to use arrow functions as constructors. Arrow functions are best used for callbacks that are passed into other functions. Unlike functions, arrows share the same lexical this as their surrounding code.

Both typeof and instanceof behave the same with arrow functions as they do with other functions. Also like other functions, you can still use call(), apply(), and bind(), although the this-binding of the function will not be affected.

functions defined with a new syntax that uses an “arrow” (=>). However, arrow functions behave differently than traditional JavaScript functions in a number of important ways:

* Lexical this binding - The value of this inside of the function is determined by where the arrow function is defined not where it is used. No more `self = this`
* Not newable - Arrow functions cannot be used a constructors and will throw an error when used with new.
*  Can’t change this - The value of this inside of the function can’t be changed, it remains the same value throughout the entire lifecycle of the function.
* No arguments object - You can’t access arguments through the arguments object, you must use named arguments or other ES6 features such as rest arguments.
* Arrow functions also have a name property that follows the same rule as other functions.

All variations Syntax begin with function arguments, followed by the arrow, followed by the body of the function. Both the arguments and the body can take different forms depending on usage.

When 1 argument for an arrow function, that one argument can be used directly without any further syntax. The arrow comes next and the expression to the right of the arrow is evaluated and returned. Even though there is no explicit return statement, this arrow function will return the first argument that is passed in.

Note:

Single argument for Arrow function, no () needed
Two or more arguments, need ()
Single line of function body, no {} needed, auto return one line statement
Multiple lines of function body, need {}, need explicity return statement to return anything

```js
    // arrow function takes a single argument and simply returns it
    var reflect = value => value;

    // effectively equivalent to:
    var reflect = function(value) {
        return value;
    };
```

If you are passing in more than one argument, then you must include parentheses around those arguments. Here, simply adds two arguments together and returns the result. The only difference is that the arguments are enclosed in parentheses with a comma separating them

```js
    var sum = (num1, num2) => num1 + num2;

    // effectively equivalent to:
    var sum = function(num1, num2) {
        return num1 + num2;
    };
```

If there are no arguments to the function, then you must include an empty set of parentheses:

```js
    var getName = () => "Nicholas";

    // effectively equivalent to:
    var getName = function() {
        return "Nicholas";
    };
```

When you want to provide a more traditional function body, perhaps consisting of more than one expression, then you need to wrap the function body in braces and explicitly define a return value. Inside curly braces code work like as the same as in a traditional function with the exception that arguments is not available.

```js
    var sum = (num1, num2) => num1 + num2;
    // effectively equivalent to:
    var sum = function(num1, num2) {
        return num1 + num2;
    };
```

If you want to create a function that does nothing, then you need to include curly braces:

```js
    var doNothing = () => {};
    // effectively equivalent to:
    var doNothing = function() {};
```

Because curly braces are used to denote the function’s body, an arrow function that wants to return an object literal outside of a function body must wrap the literal in parentheses. Wrapping the object literal in parentheses signals that the braces are an object literal instead of the function body.

```js
    var getTempItem = id => ({ id: id, name: "Temp" });

    // effectively equivalent to:
    var getTempItem = function(id) {
        return {
            id: id,
            name: "Temp"
        };
    };
```

```js
  // or using `var self = that;` call `that.doSomething` inside the callback
  document.addEventListener("click", (function(event) {
     this.doSomething(event.type);     // no error
   }).bind(this), false);

   // effectively equivalent to:
   // the value of this inside of an arrow function is always the same as the value of this in the scope in which the arrow function was defined.
   document.addEventListener("click", event => this.doSomething(event.type), false);

   var result = values.sort(function(a, b) {
       return a - b;
   });

   // effectively equivalent to:
    var result = values.sort((a, b) => a - b);
```

```js
    var MyType = () => {},
        object = new MyType();  // error - you can't use arrow functions with 'new'

    // Also, since the this value is statically bound to the arrow function
    // you cannot change the value of this using call(), apply(), or bind().
```

```js
// Expression bodies
var odds = evens.map(v => v + 1);
var nums = evens.map((v, i) => v + i);

// Statement bodies
nums.forEach(v => {
  if (v % 5 === 0)
    fives.push(v);
});

// Lexical this
var bob = {
  _name: "Bob",
  _friends: [],
  printFriends() {
    this._friends.forEach(f =>
      console.log(this._name + " knows " + f));
  }
}
```

11. Module

Features:

* support late bound cycles between modules for both the default export and named exports. It just works.
* separate the names that exist on the default export (and their prototype chains) and other named exports, avoiding collisions.
* make it easy to determine exactly what you are importing by just looking at the syntax. That improves error messages, but also makes it easier to build tools like browserify and JSHint that work reliably without caveats.
* rename imports
* module IDs are configurable ( default: paths relative to importing file )
* Programmatic (ex: conditional) loading of modules via an API.

Can’t put import (or export) statements anywhere except top level code. It is static analysis.
Mutable Binding: The ability to import a name, from a module, and have it look like a global variable while at the same time changing like an object.

```js
// syntax
module "widget" { }
module "widget/button" { }

import "lib/ad" as c;
import { meth as method } from "a";

export default class {}
import ad from "ad"
```

```js
if (foo) {
  // Not allow
  import {_bar, _baz} from 'bat';
}

// So this is NOT allow neither
// this exports your module as an AMD one if that exists, a Common JS one if that exists and otherwise assumes you are in a regular browser and attaches it to the window. Creating things like this is impossible in ES6 modules.
var myThing = something;
if (typeof define === 'function' && define.amd) {
    define(function () {
        return myThing;
    });
} else if (typeof exports === 'object') {
    module.exports = myThing;
} else {
    window.myThing = myThing;
}
```

Using ES6 import/export is not a perfect with some problems: default key emergence problem in ES5 CJS runtimes

```js
// Demo: demos the behavior of default key
// Node style module writ in ES6 syntax:
exports default foo = () => console.log(‘hi’)

// Unfortunately “literally” transpiles to this:
exports.default = function foo() {
  return console.log(‘hi’)
}

// Which means this will fail:
var foo = require(‘./foo’)
foo() // object is not a function!

// But this will work:
var foo = require(‘./foo’).default
foo() // outputs 'hi'

// There is a fix!
//
// If we compile with 6to5 we get what we expect!
module.exports = function foo() {
  return console.log(‘hi’)
}

// call as usual
var foo = require(‘./foo’)
foo() // outputs 'hi'!
```

Here are some solutions for this problem

Ignore ES modules until they land in all runtimes and continue to write ES5 CJS module.exports and require syntax (boo! hiss! boring!)

Wholesale import * as foo from ‘foo’ and hope the foo package doesn’t change its exports (works, and is probably safe, but feels yolo)

Pretend that appending .default is harmless aesthetics … ಠ_ಠ

Brutally clobber the problem by appending module.exports = module.default at the end of each module in your ES5 publishing build pipeline (thunderbolt viking style! also yolo)

Use the 6to5 compiler with the —modules commonInterop flag which does the expected thing: compile out a single function export to module.exports when there are no other named exports.

Note: You publish to npm as ES5 source so everyone can benefit from your hard work, recommend publishing to npm as ES5 for maximal reuse

- export

Export a default value from a module by using `export default`.  ex: `export default asap`

Named Exports. Modules need multiple exports, which their consumers can refer to individually by name.
ex: `export var later = laterMethod`

Shorter named exports: make any declaration in js (like var, function, class, let) a named export by prefixing it with export. These names are also available in the module’s local scope, so you can use them in other functions. See below:

```js
    // exports this function as "requestAnimationFrame"
    export function requestAnimationFrame() {
      // cross-browser requestAnimationFrame
    }

    // exports document.location as "location"
    export var location = document.location;

    // exports this class as "File"
    export class File() { /* implementation */ }

    // exports "0.6.3" as "VERSION"
    export let VERSION = "0.6.3";
```

Grouping named exports: export any number of local variables together. You can put the grouped export declaration anywhere in the file, so you can define your imports and exports next to each other at the top of your modules if you wish.

```js
    export { getJSON, postJSON };

    function getJSON() {
      // implementation
    }

    function postJSON() {
      // implementation
    }
```

- import

Import a module by `import x from "x"`, take the default function exported from x and store it in the variable `x`, which used to call.

Named Imports. Import named export in module.  ex: `import { later } from "asap"`

import both the default export and a number of named exports in the same import. ex: `import asap, { later } from "asap";`

Renaming named imports by giving its own local name. ex: `import { unlink as rm } from "fs";`  // rm is the local var to use

Import all of a module’s named exports into a single local namespace.  ex: `import * as fs from "fs";`  // fs.unlink(filename, fn)

- Compare between CommonJS and ES6

Just as in CommonJS modules, you can decide whether to import the entire module into a single variable, or import individual names into local variables.

```js

// CommonJS                                 // ES6
//
// Module dependencies
var bytes = require('bytes');             import bytes from "bytes";
var read = require('./read');             import read from "./read";
var path = require('path');                import { resolve, dirname } from "path";
var fs = require('fs');                        import * as fs from "fs";

// Module exports
module.exports = request;              export default request;  // function request() {}
module.exports = mkdirP.mkdirp    export { mkdirP as mkdirp, mkdirP };
  = mkdirP.mkdirP = mkdirP;

request.Request = Request;             export { Request };
request.initParams = initParams      export var initParams = initParams
request.defaults = function () { }      export function defaults () { }

var util = require('util')                    import { _extend } from "util";
function initParams() {                     function initParams() {
  util._extend({}, options);                   opts = _extend({}, options);
}                                                      }

```

`Module syntax` The way we write modules in our code with the new `import`, `export` and `module` keywords.
The `module loader` The module loading pipeline instructing the JavaScript engine how to handle loading modules. It comprehensively specifies the entire loading algorithm through a module loader class.

```js
// app/module.js
export var test = 'es6';
export class MyClass {
  constructor() {
    console.log('ES6 Class!');
  }
}

// app/app.js
import {test, MyCLass} from './module';
console.log(test);
new MyClass();
```

12. Class

It is a representation of an object. It forms the blueprint, while an object is an instance of a class. Behind the scene, JS create a constructor function, and manipulate prototype properties on them, like what we did in ES5, no change. Classes support prototype-based inheritance, super calls, instance and static methods and constructors.

```js
  class Language {
    // constructor function is automatically invoked
    constructor(name, founder, year) {
      this.name = name;
      this.founder = founder;
      this._year = year;
    }
    // no colon or function keyword needed, no comma, semicolon is optional
    summary() {
      return this.name + " was created by " + this.founder + " in " + this._year;
    }
    /*
      // equal to what is above
      Language.prototype = {
        summary:  function() {
          return ...
        }
      }
     */

    // Getter and Setter:  Good for encapsulate a state of an Object
    // bind a property of an object to a function
    // Like Ember computed property:  function(){}.property()
    //
    // In this case, year is a property of the  Language class
    // getter name must not the same as any constructor property, otherwise, it will always call itself.
    // error out with Max call stack execeeded.
    get year() {
      return 10 + this._year;
    }
    // if setter is omit, year property is simply read-only property
    set year(newValue) {
      this._year = year;
    }
  }
```

We can extend the class to implement a sub-class MetaLanguage that will inherit all the properties from the parent class Language. Inside the constructor function, we will require the function super that will call the constructor of the parent class so that it is able to inherit all of its properties. Lastly, we can also add on extra properties.

`super` keyword could use inside constructor, method.

```js
  // inheritance
  class MetaLanguage extends Language {
    // if we have a function  constructor, it will override the super class
    // without `super` class, it won't call super class constructor at all.
    constructor(x, y, z, version) {                      constructor(version, name, founder, year) {
      super(x, y, z);                                              super(name, founder, year);
      this.version = version;                                 this.version = version;
    }                                                                }
    summary() {
      return this.version + " : " + super()
    }
  }

  class SkinnedMesh extends THREE.Mesh {
    constructor(geometry, materials) {
      super(geometry, materials);

      this.idMatrix = SkinnedMesh.defaultMatrix();
      this.bones = [];
      this.boneMatrices = [];
      //...
    }
    update(camera) {
      //...
      super.update();
    }
    static defaultMatrix() {
      return new THREE.Matrix4();
    }
  }
```

13. Collections(Data structure): Set, Map, WeakMap, WeakSet

- Set:   simple data structures that are similar to arrays, but each value is unique. No duplicates.
Can use object as key but array will object into string as key. Primitive value or object could be the key of the Set.

add(key) / has(key) / delete(key)  / set.size / set.clear() // remove all items inside the current set

```js
  var engines = new Set(); // create new Set
  engines.size;   // 0        // like array.length
  engines.add("Gecko"); // add to Set
  engines.add("Hippo");
  engines.add("Hippo"); // note that Hippo is added twice. Only one added to the set.
  engines.values().next().value; // Gecko
  engines.values().next().value; // Hippo
  engines.has("Hippo");  // true
  engines.delete("Hippo"); // delete item

  var set = new Set();
  var key = {};
  set.add(key);
  set.has(key); // true

  // Array passed in will be spread out into each key inside the set
  var set1 = new Set([1,2,3]);
  set.has(1);  // true.
```

Iterate the set using `forEach` and other methods. Set is not an order list, it will be called on each item on insertation order, if need an object structure, you need to use Array or more complex data structure.

```js
    let iterationCount = 0;
    set.forEach( item => iterationCount++ );

    // more readable
    for(let item of set) {
        iterationCount++
    }
```

3 functions to expose the set as an iterator.
* `set.entries() -> iterator`, should return an iterator of array when entries is called. Use `next().value` to invoke. it has two values [keyValue,keyValue], both values would be the key value of the set, they are identical to each other.
* `set.values() -> iterator`, should return an iterator of values when values is called. `next().value`
* be able to constructed with an iterator. see example below

```js
    var set = new Set(1,2,3);
    var set2 = new Set( set.values() );  // pass back as an iterator   or  var set2 = new Set(set); // duplicate the set via for-of internally
    set2.size;  // 3,  it will duplicate the set to the set2, but they are different set.
```

- Map: like Set, but hold key-value pair. Key must be a unique, we can retrieve the value. Use primitive value or object or anything to be the key.
In ES6, the key can be any JavaScript data type like Object and not just strings. Data structure map from arbitrary values to arbitrary values. ( Objects: keys must be string ). Can iterate over keys, values, entries and more.

get(key) / has(key) / set(key, value) / delete(key) / map.size / map.clear()

```js
  var es6 = new Map(); // create new Map
  es6.set("edition", 6);        // key is string
  es6.set(262, "standard");     // key is number
  es6.set(undefined, "nah");    // key is undefined

  for( let w of es6.values() ) {
    console.log(w);
  }

  var hello = function() {console.log("hello");};
  es6.set(hello, "Hello ES6!"); // key is function

  es6.has(undefined); // true
  es6.delete(undefined); // delete map

  // example give an array in the constructor
  var map = new Map( ['name', 'matt'], ['age', 15], ['weight', 155]);

  // constructed with an iterator
  var map2 = new Map( map.entries() );  // map2.size === 3
```

Iterate the map. ex: `map.forEach( (value, key) => value )` or `for-of`.
Iterator like set,  `entries() -> iterator`, `values() -> iterator`, `keys () -> iterator`

- WeakMap

Avoid memory leaks
reference to the key obj held weakkly
key must be an object
No iterators methods

ex: item1 is associated with Div1, item2 is associated with Div2. When Div2 is being deleted from body, Set->item2 still has a pointer to the value of Div2, so that Div2 cannot be gabage collected, still in memory.

Set        Body
Item1    Div1
Item2    Div2

So WeakMap, WeakSet, setup a weak pointer, so that its associated value could be gabage collected.

- Because GC could happen any given time, so WeakSet, WeakMap values could be deleted at any time.
They do not have methods below

weakset.size,  weakset.entries,  weakset.values, weakset.forEach,    // undefined
weakmap.size,  weakmap.entries,  weakmap.values, weakmap.keys(), weakmap.forEach,    // undefined

Other than those methods, everything else look just like Set and Map. Can be iterated with `for-of`


14. Iterators

ES6 standardize iterables and iterators. Iterable (ex: Array) can be iterated by or retrived by Iterator. Iterator allow to walk through the collection one item at the time, iterator has a `next` method on the object, can get its value from `next` method.

Iterator does not have length property. It is lazy, run must faster.

```js
  // iterator at the very low level. has to keep calling `next` to get its value
  // somehow have a loop at the end, call `.next` to get its next value. No length property.
  let numbers = [1,2,3,4];
  let sum = 0;
  let iterator = numbers.values();  // .values would return an iterator, which allow to walk through the value

  // form 1
  let next = iterator.next();
  while( !next.done ) {
    sum += next.value;
    next = iterator.next();
  }

  // form 2
  for ( let n of [1,2,3,4] ) {
    sum += n;
  }
```

`for-in` loop to work with object, object key as parameter; work with array, array index as parameter.
`for-of` loop through the value, not key nor index, can get its value out of collection. work with any object that iterable. Behind the scene, `for-of` could check the iterator to see `done` value is true or not, keep calling `next` method automatically on `[Symbol.iterator]().next()` on the object itself. since all iterable object have to implement it.

The only way to get to that Symbol value, Way 1,  use the Symbol assigned variable.  Way 2,  `Symbol.iterator`, it is a const, js runtime set its value, to get to any object that is iterable.

```js
  let x = [1,2,3];
  x[Symbol.iterator]   // would get back a function
  x[Symbol.iterator]()  // get back the iterator what i need
  // so that `for-of` would retrieve that property,
  x[Symbol.iterator]().next()  // Object { value: 1, done: false }  // you could iterate through it
```

Hard way, implement `[Symbol.iterator]` manually to see what is behind the scene.

```js
  class Company {
    constructor() {
      this.employees = [];
    }
    addEmployees(...names) {
      this.employees = this.employees.concat(names);
    }

    // Way 1: hard way, manually write out the Symbol.iterator
    // we have to manually add the code to make it iterable
    [Symbol.iterator]() {
      // this.employees  is the array need to be iterated
      // keep calling `ArrayIterator.next` until it reaches `done: true`
      return new ArrayIterator( this.employees );
    }

    // Way 2, simple way with Generator function. see Generators for details
    // Generator inside class is always started with `*`
    // we have to manually add the code to make it iterable
    *[Symbol.iterator]() {
      for( let e of this.employees) {
        yield e;
      }
    }

  }

  let count = 0;
  let company = new Company();
  company.addEmployees("matt", "aaron", "sam", "mom");

  // by default, `company` instance object is not iterable, has to
  // implement `[Symbol.iterator]` manually to make it iterable
  for (let employee of company ) {
    count += 1;
  }

  class ArrayIterator {
    constructor(array) {
      this.array = array;
      this.index = 0;
    }
    next() {
      var result = { value: undefined, done: true };
      // the logic here is customizable, could be sorted, reversed, or anything
      // No client code change, we could modified the internal of the iterator
      // as long as `next` return an Object with **value** and **done** property
      // Benefit, the array itself is protected, no one could change its values, pop/push, etc.
      if ( this.index < this.array.length ) {
        result.value = this.array[ this.index ];
        result.done = false;
        this.index += 1;
      }
      return result;
    }
  }

  // additional, to filter employee with a simple generator
  let filter = function* (items, prediate) {
    for(let item of items ) {
      if(prediate(item)) { yield item; }
    }
  }
  for (let employee of filter(company, e => e[0] == "m") ) {
    count += 1;
  }

  // additional on top of the previous with Generator + return statement
  let take = function*(items, number) {
    let count = 0;
    if(number < 1) return;
    for(let item of items ) {
      yield item;
      count += 1;
      // when reach the desired number, auto return, no more yield value look up
      if ( count >= number) { return; }
    }
  }
  for (let employee of take( filter(company, e => e[0] == "m"), 1 ) ) {
    count += 1;
  }
```

Easier way, using `Generators`. See Generators section for details.

Iteration protocol:
  **Iterable**: a data structure whose elements can be traversed. ex: Array, Set, all array-link DOM objects
    syntax: `{ iterator: function() -> iterator }`
  **Iterator**: the pointer used for traversal
    syntax: `{ next: function() -> any }`

JavaScript offers for-in for iteration, but it has some limitations. For example, in an array iteration, the results with a for-in loop will give us the indexes and not the values.

ES6 `for-of` with an array, a set and a map. It is a better loop. Replace `for-in`, `Array.prototype.forEach()`. Works for: iterables, convert array-like objects via `Array.from()`. Array.from like Array.map, always return an Array

```js
  var planets = ["Mercury", "Venus", "Earth", "Mars"];
  for (let [ind, elem] of planets) {
    console.log(ind, elem); // 0 Mercury     1 Venus     2 Earth      3 Mars
  }

  var engines = Set(["Gecko", "Trident", "Webkit", "Webkit"]);
  for (var e of engines) {
      console.log(e); // Set only has unique values, hence Webkit shows only once
  }

  var es6 = new Map();
  es6.set("edition", 6);
  es6.set("committee", "TC39");
  es6.set("standard", "ECMA-262");
  for (var [name, value] of es6) {
    console.log(name + ": " + value);
  }
```

15. Genarators

It is a factory function for the iterators. `function*` for generator function and `yield` keyword inside the function body. Instead of using `return` to return a value, use `yield` to return a multiple value. Generator inside Class is always started with `*`

`yield` will produce a value everytime. When the execution reach to a yield, it will return value back to the caller. Caller could do whatever they need to that value. Then, caller askes iterator for the next value, the execution returns to the generator function and pick up where it left off. Continue to no `yield` object left, iterator will return an Done flag to true. Generator function could suspend the execution, pausing, resume in the later time when caller ask for the next value.

Generator function body can have a `return` statement, the iterator of this generator created will automatically set { done: true }. Combine with return statement, it makes lazy evaluation.
Generator function won't execute, until call iterator.next(), hit yield, pause the execution.

```js
  let numbers = function* (start, end) {
    for(let i = start; i <= end; i++) {
      console.log(i);
      yield i;
    }
  };
  let sum = 0;
  let iterator = numbers(1,4);
  console.log("next");
  let next = iterator.next();
  while(!next.done) {
    sum += next.value;
    console.log("next");
    next = iterator.next();
  }
  // result of the `sum`  would be 10
```

Demistified the code above to see the magic

```js
  // shorthand.
  // `for-of` is to generate the code to work with iterator
  // calling `next`, check its done flag. look at the hard way
  let sum = 0;
  for (let n of number(1, 4) ) {
    sum += n;
  }

  // hard way
  let sum = 0;
  let iterator = numbers(1,4);
  let next = iterator.next();
  while(!next.done) {
    sum += next.value;
    next = iterator.next();
  }
```

```js
  // short hand: Generator is a high level syntax for the hard way.
  // Generator function create an iterator Object in the hard way
  // Iterator has to have a `next` method, keep track the state of iteration with the index property
  let numbers = function* (start, end) {
    for(let i = start; i <= end; i++) {
      console.log(i);
      yield i;
    }
  };

  // Hard way
  class RangeIterator() {
    constructor(start, end) {
      this.current = start;
      this.end = end;
    }
    next() {
      let result = { value: undefined, done: true };
      if ( this.current <= this.end ) {
        result.value = this.current;
        result.done = false;
        this.current += 1;
      }
      return result;
    }
  }
```

In addition, `next` function could take parameter as well, it will change the state of the iteration. Normally, do not pass in parameter as the first call of `next`, since it will change to the state of the iterator. If you need to do that, update the caller invoke function.

```js
  let numbers = function* (start, end) {
    let current = start;
    while( current <= end) {
      // if caller called next, and pass me sth. that would be resulted of the yield statement.
      // in this case, delta would be value of 2.  from the caller.
      let delta = yield current;
      current += dalta || 1;
    }
  };
  let result = [];
  let iterator = numbers(1, 10);
  let next = iterator.next();
  while(!next.done) {
    result.push(next.value);
    next = iterator.next(2);
  }
  // result value would be [1,3,5,7,9]
```

15. Array

See those in action inside `es6-features.js` under Array section

`Array.map()`, `Array.filter()` support natively.

- Array.of()

Create a new Array with 1 arg when given 1 argument when of is called.

```js
    var arr = new Array(3);  // create an array with 3 elements.  [undefined, undefined, undefined]
    var arr = new Array(1,2,3);  // create  [1,2,3]
    var ofArr = Array.of(3);  // create [3].   length is 1.
```

- Array.from()

Create a new Array from an array-like object when from is called.

```js
    var arrLike = document.querySelectorAll('div');
    // typeof  arrLike.forEach   should be undefined
    // make a true array out of it
    Array.from( arrLike );
```

- Array.entries()

return entries from the entires function

```js
    var arr = ["matt", "sam", "aaron"];
    var entries = arr.entries();
    entries.next().value;   // [0, "matt"]  // return [index, value]
```

- Array.keys()

key iterator, when calling `arr.keys()`, it would only return an index.

- Array.values()

value iterator, when calling `arr.values()`, it would only return the value.

- Array.find()

Return a first element inside the callback is truty.

```js
    [1,5, 10].find( (x) => x > 8 )  // 10
```

- Array.findIndex()

Like `Array.find()` but return the finding index of first matching truty element inside the callback

```js
    [1,5, 10].findIndex( (x) => x > 3 )  // 1
```

- Array.fill(value, startIndex*, endIndex*)

Fill all or portion of an array

```js
    var arr = [1,2,3,4,5];
    arr.fill('a');   // arr become to   ['a', 'a', 'a', 'a', 'a']  because every index value would be 'a'
    arr.fill('a', 2, 3);  // arr become to [1,2,'a',4,5]
```

- Array.copyWithin(targetIndex, copyFromIndex, endIndex*)

Copy a portion of an existing array on top of itself in the different location. Think of two pointer, first pointer is the target where you copy the new element to, second pointer will be where it copys from

```js
    var arr = [1,2,3,4];
    arr.copyWithin(2, 0);  // [1,2,1,2]
    arr.copyWithin(2, 0, 1);  // [1,2,1,4]
    arr.copyWithin(0, -2);  // [3,4,3,4]
```

16. Javascript GotYou

- Binding. In JavaScript numbers and strings are references to specific values and are passed around by reference. Object, Array, Function do not work that way.

```js
  //
  var a = 3;  // a is 3
  var b = a;  // b is 3
  a++; // a is 4, b is 3. because a and b were both just references to the number 3

  var a = {num:3}
  var b = a;
  a.num++; // both a.num, b.num equal to 4.
```

So ES6, If you import into multiple files, functions, they are just references to the same object. modules export are bindings. so if one file changes(increment) its value, another file will update the value as well.

- Circular dependencies

2 modules require each other, think of them as being like regular JavaScript variables where the variable to be used is initialized at the top of the scope, but doesn’t have a value until later on. The point here is that obj is bound by the time b executes, but the assignment has not been made as we still have to execute sources in some underlying order.

In Node.js, it works. Because use Node.js exports to create an empty object for the module that is available immediately for reference by other modules.

17. Symbol

Imspired by Lisp, etc. A new kind of primitive value. Each symbol is unique.
Symbol is a function object. Every Symbol will have some random value associated with it so that you could use Symbol as a property name in the object, it won't conflict with any other name in the object.

```js
  let sym = Symbol();
  console.log( typeof sym )  // 'symbol'
```

Enum-style values

```js
  // ES5. This is the old way to implement
  var red = "red";
  var green = "green";
  var blue = "blue";

  // ES6. Using symbol to instead of defining `var red = "red"`
  const red = Symbol();
  const green = Symbol();
  const blue = Symbol();

  function handleColor(color) {
    switch(color) {
      case red:
        ...
      case green:
        ...
      case blue:
        ...
    }
  }
```

Property keys. Advantage: No name clashes.  Configure objects for ECMAScript and frameworks: introduce publicly known symbols. Ex: property key `Symbol.iterator` makes an object iterable.

```js
  let specialMethod = Symbol();
  let obj = {
    // computed property key
    [specialMethod]: function(arg) {

    }
  };
  obj[specialMethod](123);

  // or short hand method definition syntax
  let obj = {
    [specialMethod](arg) {
      // ...
    }
  }
```

18. Proxies

```js
  var obj = { num: 1 };
  obj = Proxy( obj, {
    set: function ( target, property, value ) {
      target[property] = value + 1;
    }
  });
  obj.num = 2;  // [[Set]]
  console.log( obj.num );  // 3
```

19. Comprehensions

It is a Ter syntax to build array and generator. `for-of` would be a good candidate to build comprehension.

Array comprehensions, it creates a list based on an original list with some operation. Like Array.map().
Syntax:  `[ for ( i of arr ) i ]`  // [1,2,3]  just like the original list.  use `if` to filter the array.
It is greddy, it is immediately build up the result of the array. used `[]` around the block. It will loop through the entire array items.

```js
    // [] indicate this is an array comprehension
    // for-of inside [], n represent each item of collection
    // No `let` keyword for n, let is explicitly applied. n scoped inside the function
    var numbers = [ for (n of [1,2,3]) if(n>1) n * n ];
    // numbers would be   [1,4,9]

    // shorthand for this below
    let numbers = [];
    for(let n of [1,2,3]) {
        if( n > 1 ) numbers.push(n * n);
    }
```

Multiple `for` clause inside one array comprehension

```js
    var arr = [ for(first of ["matt", "aaron", "sam"]) for(middle of ["sam", "hero", "beauty"]) if(first !== middle) ( first+' '+middle+' ma') ];
    // arr would be an array with all possible combination of firstName middleName lastName
```

Generator comprehension is lazy, it waits for the `next` method. used `()` around the block. It would be lazy, scan one item at the time.

```js
    // this is not building an array, it will return as a generator, could use `next()` method
    // to get the each value back. Get each value lazily.
    var numbers = (for ( n of [1,2,3]) n*n);
    // numbers would be   [1,4,9]
```

Real word example. When `yield` with an array comprehension, it will return an Array representation of the value.
When use `yield*` will return each item in String representation of the value, not an array.

```js
    // items = ["matt", "aaron", "sam"]
    let filter = function*(items, predicate) {
        // yield [for (item of items) if(predicate(item)) item ];  // yield ["matt"] without `yield*`

        // yield "matt" for example here. It is an Greddy operation, will loop the whole array with each items
        // yield* [for (item of items) if(predicate(item)) item ];

        // Best way to do it here, use Generator comprehension, lazy iterate the collections, once it finds the item, it will stop the scanning, break out of the loop
        yield* (for (item of items) if(predicate(item)) item);
    }
```

## Async & Await

async and await: With async functions, you can await on a promise. This halts the function in a non-blocking way, waits for the promise to resolve & returns the value. If the promise rejects, it throws with the rejection value, so you can deal with it using catch.

Note: `await` within an arrow function is not allowed

```js
async function loadStory() {
  try {
    let story = await getJSON('story.json');
    addHtmlToPage(story.heading);
    for (let chapter of story.chapterURLs.map(getJSON)) {
      addHtmlToPage((await chapter).html);
    }
    addTextToPage("All done");
  } catch (err) {
    addTextToPage("Argh, broken: " + err.message);
  }
}
```
