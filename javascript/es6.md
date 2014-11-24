Note from [Understanding ES6](https://leanpub.com/understandinges6/read/#leanpub-auto-objects), currently read through `Object`, check back until author completes the object section.

# ES6

ECMAScript Language Specfication, Edition 6

## Resources:

1. [ES6 Compatibility table](http://kangax.github.io/compat-table/es6/)
2. [ES6 Learning](https://github.com/ericdouglas/ES6-Learning)

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

* generators: function* gen() { yield 1; yield 2; } Actually, gen() returns ~ an object with a next() function property.

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

## Details

1. String

- normalize()

DS6 supports the four Unicode normalization forms through a new method on strings. This method optionally accepts a single parameter, one of "NFC" (default), "NFD", "NFKC", or "NFKD".

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

- RegExp `u` flag, `y` flag

u for “Unicode”, it allows RegExp to correctly match the string by characters. Unfortunately, ES6 does not have a way of determining how many code points are present in a string.

```js
    var text = "𠮷";

    console.log(text.length);           // 2
    console.log(/^.$/.test(text));      // false
    console.log(/^.$/u.test(text));     // true
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

- Object.is()

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

- Destructuring Assignment

pulling data out of objects and arrays. destructuring assignment, which systematically goes through an object or array and stores specified pieces of data into local variables.

If the right side value of a destructuring assignment evaluates to null or undefined, an error is thrown.
If the property with the given name doesn’t exist on the object, then the local variable gets a value of undefined.

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


4. Variable

The let and const block bindings introduce lexical scoping to JavaScript. These declarations are not hoisted and only exist within the block in which they are declared. That means behavior that is more like other languages and less likely to cause unintentional errors, as variables can now be declared exactly where they are needed.

It’s expected that the majority of JavaScript code going forward will use let and const exclusively, effectively making var a deprecated part of the language.

- let && Block bindings

variables are created at the spot where the declaration occurs. In JavaScript, however, this is not the case. Variables declared using var are hoisted to the top of the function (or global scope) regardless of where the actual declaration occurs.

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

Variables declared using const are considered to be constants, so the value cannot be changed once set. For this reason, every const variable must be initialized.

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

Any parameters with a default value are considered to be optional parameters while those without default value are considered to be required parameters. default parameter arguments is that the default value need not be a primitive value.

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

Rest parameters are indicated by three dots (...) preceding a named parameter. That named parameter then becomes an Array containing the rest of the parameters (which is why these are called “rest” parameters).

The only restriction on rest parameters is that no other named arguments can follow in the function declaration.

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

It is closely related to rest parameters.
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

- Arrow Function

arrow functions are designed to be used in places where anonymous functions have traditionally been used. They are not really designed to be kept around for long periods of time, hence the inability to use arrow functions as constructors. Arrow functions are best used for callbacks that are passed into other functions.

Both typeof and instanceof behave the same with arrow functions as they do with other functions. Also like other functions, you can still use call(), apply(), and bind(), although the this-binding of the function will not be affected.

functions defined with a new syntax that uses an “arrow” (=>). However, arrow functions behave differently than traditional JavaScript functions in a number of important ways:

* Lexical this binding - The value of this inside of the function is determined by where the arrow function is defined not where it is used.
* Not newable - Arrow functions cannot be used a constructors and will throw an error when used with new.
*  Can’t change this - The value of this inside of the function can’t be changed, it remains the same value throughout the entire lifecycle of the function.
* No arguments object - You can’t access arguments through the arguments object, you must use named arguments or other ES6 features such as rest arguments.
* Arrow functions also have a name property that follows the same rule as other functions.

All variations Syntax begin with function arguments, followed by the arrow, followed by the body of the function. Both the arguments and the body can take different forms depending on usage.

When 1 argument for an arrow function, that one argument can be used directly without any further syntax. The arrow comes next and the expression to the right of the arrow is evaluated and returned. Even though there is no explicit return statement, this arrow function will return the first argument that is passed in.

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
    var sum = (num1, num2) => {
        return num1 + num2;
    };

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

11. Module

Features:

* support late bound cycles between modules for both the default export and named exports. It just works.
* separate the names that exist on the default export (and their prototype chains) and other named exports, avoiding collisions.
* make it easy to determine exactly what you are importing by just looking at the syntax. That improves error messages, but also makes it easier to build tools like browserify and JSHint that work reliably without caveats.

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
