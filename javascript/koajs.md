# KOA

It is a minimalist node.js web framework, uses ES6 generators for better async control flow (use `co`) and robust error handling (with try/catch support), Async/Await-style control flow. It Simplied Nodejs async programming. Building apps is much more semantic. It is like building a christmas tree with decorations from bottom, then up. It is a truly expressive framework, which allow you to write your app without relying on the features of framework.  No depending on "an API for that". It is extremely modular, meaning every module does one thing well and nothing more.

there are two other key features; cascading middleware (Think about it like this: a single function can encapsulate the entire intent of the middleware.) and sane error handling. “yields ‘downstream’, then control flows back ‘upstream’.  the function then yields ‘downstream’ to whatever is passed in as next and when that function (and any functions it yields to) has finished, control is returned back to this function to calculate and log elapsed time.

Koa catches our blatant error and properly returns a 500 status error to the client. Our app doesn’t crash. It doesn’t need a module like forever to restart it. You don’t need to wrap things in a domain. Of course if your app is in the real world, you’ll want to be more specific, like:

```js
app.use(function *() {
  this.body = "...header stuff";
  try {
    yield saveResults();
  } catch (err) {
    this.throw(400, 'Results were too awesome')
  }
  //could do some other yield here
  this.body += "...footer stuff"
});
```

Yes, that’s a bona fide try/catch block. You can call this.throw with any message and status code, and Koa will pass it along to the client.

Lazy evaluation is already possible with JavaScript using closure tricks and the like, but its greatly simplified now with yield. By suspending execution and resuming at will, we are able to pull values only when we need to.


It fixed express.js by abstraction and generators. Koa abstracts node's request and response objects so no monkey patching is required. Koa uses generators for better async control flow. Koa has better stream handling via [destroy](https://github.com/stream-utils/destroy) and [on-finished](http://github.com/jshttp/on-finished). Both koa and express use the same modules.

- Koa is barebones

Unlike both Connect and Express, Koa does not include any middleware.
Unlike Express, routing is not provided.
Unlike Express, many convenience utilities are not provided. For example, sending files.
But Koa is more modular.

- Koa relies less on middleware

For example, instead of a "body parsing" middleware, you would instead use a body parsing function.

- Koa abstracts node's request/response

Less hackery. Better user experience. Proper stream handling.

Main reasons:

1. Superior, callback-less control flow (Generated-based control flow)

Koa's underlying generator engine co, there's no more callback hell. Of course, this is assuming you write your libraries using generators, promises, or return thunks. `co`'s control flow handling isn't about eliminating callbacks. You can also execute multiple asynchronous tasks in parallel and in series without calling a function.

```js
// executed three asynchronous functions in parallel. No need for addtional library like `async`
app.use(function* () {
  yield [fn1, fn2, fn3]
})
```

With generators, you can write asynchronous code in “synchronous” style - forgoing the need to deal with callback hell!

2. Superior middleware error handling (Better error handling through try/catch.)

use `try/catch` instead of node's `if (err) callback(err)` type error handling.

Error handlers are just decorators. Koa handle errors automatically when you every time do `this.response.body`.
No need to worry about error handling. No need to use domains.

Express Error handling:  let's catch any error and try to do something about it
Koa Error handling:  You handle it however and whenever you'd like
No need for domains like Hapi.js. Domain is going to be deprecated in newer node

```js
    app.use(function* (next) {
        try {
            yield* next
        } catch (err) {
            this.status = err.status || 500;
            this.body = "oh no! something went wrong!";
            console.error(err.stack);
        }
    });
```

use try/catch. All errors will be caught, unless you throw errors on different ticks like so:
Don't do that! Write your code in generators, promises, or unnested callbacks and you'll be fine.

```js
app.use(function* () {
  setImmediate(function () {
    throw new Error('this will not be caught by koa and will crash your process')
  })
})
```

3. [Superior stream handling](http://www.jongleberry.com/koa.html)

```js
app.use(require('koa-compress')())
app.use(function* () {
  this.type = 'text/plain'
  this.body = fs.createReadStream('filename.txt')
})
```

Since you simply pass the stream to Koa instead of directly piping, Koa is able to handle all these cases for you. You won't need to use domains as no uncaught exceptions will ever be thrown. Don't worry about any leaks as Koa handles that for you as well. You may treat streams essentially the same as strings and buffers, which is one of the main philosophies behind Koa's abstractions. In other words, Koa tries to fix all of node's broken shit. Don't ever use .pipe() unless you know what you're doing. It's broken. Let Koa handle streams for you.


Learning Koa: Promises, Generators, Modular, HTTP.
Great Use cases: APIs (JSON 1st citizen), Promise-based model (MVC), Complex and/or unconventional sites

A KOA middleware is geneartor functions and just asynchronous decorators.
Middleware are decorator functions that decorate all subsequent middleware.
How the decorators are implemented and dispatched is an implementation detail.

Express Middleware:   pass control flow to the next middleware
Koa Middlware:           warp all subsequent middleware

Express uses node's original req and res objects. Properties have to be overwritten for middleware to work properly. For example, if you look at the compression middleware, you'll see that res.write() and res.end() are being overwritten. In fact, a lot of middleware are written like this. And it's ugly. Thanks to Koa's abstraction of node's req and res objects, this is not a problem.

With generators we can achieve “true” middleware. Contrasting Connect’s implementation which simply passes control through series of functions until one returns, Koa yields “downstream”, then control flows back “upstream”.

Each middleware is a generator function, context of `this` of the middleware wrap all subsequent middleware, `yield next` actually calll its subsequent middleware.

```js
    // think of `next` as a subapp consisting of all downstream middleware
    // that you'd like to decorate
    app.use(function* (subapp) {
        // do stuff before the subapp execute <= we call this - downstream middleware
        yield* subapp
        // do stuff after subapp execute  <= we call this - upstream middleware
    });
```

**Build from the bottom up**, from bottom, add more business logic, to the top

```js
    app.use(require('koa-compress')());     // <= last, final gzip
    app.use(require('koa-static')());           // <= 3rd, serve all static files

    app.user(myCustomBusinessLogic2);  // <= 2nd, add more business logic
    app.user(myCustomBusinessLogic1);  // <= 1st, Always start with business logic
```

A decorator wraps a function's input and/or output. Middleware are functions.

```js
    // pass in options to the decorator
    function decorate(multiplier) {
        // pass in a function to be decorated
        return function passIn(fn) {
            // return a `decorated` function
            return function decoratedFn(number) {
                // do stuff to `number`
                number++;
                // execute the original function
                var output = fn(number);
                // do stuff to `output`
                output = multiplier + output;
                // return the decorated value
                return output;
            }
        }
    }
```

example: compressing a buffer in KOA

```js
    // promisified version of `zlib`
    var compress = require('mz/zlib').gzip;
    app.user(function* compress(next){
        // execute all your business logic first
        yield* next;

        if(this.request.accepts('gzip')) {
            // we can use async functions here, errors are handled
            this.body = yield compress(this.body);
            this.response.set('Content-Encoding', 'gzip');
            this.response.remove('Content-Length');
        }
    });
```


The Request Response Pattern

The key to making solid Node web applications is to realise and exploit the fact Node speaks HTTP. Those req and res objects are there for a reason: Express and similar frameworks are built on Node’s http core module, and the http module’s API is based around these request and response objects. in terms of HTTP requests and responses is HTTP “functions” that take input and transform somehow.

A Koa Context encapsulates node’s request and response objects into a single object which provides many helpful methods for writing web applications and APIs.

While it’s true that Express decorates the request and response objects, Koa goes further by abstracting them. You can still get at the request and response, and there’s also a Koa request and response as well

Notice that `this` is significant, Koa execute middleware from within a “context”, because it makes sense semantically. The current context has aliases to commonly accessed request and response properties, so the average Koa middleware has less indirection and looks lean and clean.


how are generators going to help us with async code, considering that they have to be synchronous?

Generators yield values synchronously and They cannot yield values asynchronously.
the sequence of values returned was in fact a sequence of promises, or other objects that describe asynchronous tasks. the code consuming the sequence could choose to wait for each one to complete before calling .next to get the next one. And that’s how Koa works – your application code is the generator, it emits a series promises. and Koa waits for each one to complete before resuming your code (passing back to you the result of the previous task).

And how does Koa pass back results into your generator? That’s another feature of ES6 generators. If you pass a value to next, e.g., generator.next(123), then that value is given to the generator code as the value of the currently-blocked yield expression. Hence code like var nextData = yield something; (it emits something, then some time later receives nextData).

If the async task reports an error (for example, promises have ‘failure’ callbacks), then Koa uses the generator’s throw feature to dispatch an exception to whatever yielded that task. You can therefore catch exceptions just like in synchronous code, or let them cause the request to fail (instead of being silently ignored, as async exceptions often are by mistake).



Koa Js removes need for callbacks but still have uses non-blocking code. How is that possible?

when the code encounters a yield statement, it suspends execution indefinitely, and doesn't start again until you tell it to.

A function becomes a generator function when you have at least one yield in it. And you need to add the asterisk. "Well, that pretty and everything, but how do we use that function then?" you ask.
We have to create a instance of the generator function and then get the next element in the sequence by calling ... next().

At its simplest form, a generator represents a sequence of values - essentially it is an iterator. In fact, the interface of a generator object is a just an iterator for which you'd keep calling next() on it until it runs out of values.
You can use the generator by creating a generator object and call next() to get the next value.  It's like iterating through the return values of the function.


## concept

In Express, the middleware stack was linear and you were in charge of explicitly calling the next middleware until the stack was empty and hopefully a response had been written to the response stream. Express middleware cannot change the response. ex: you cannot minify HTML responses, You cannot cache and re-serve responses, cannot execute async functions after a response is set.

In Koa, you yield control of the flow to the next middleware and wait until the flow returns to you.

This effectively creates first an upward flow and consecutively a downward flow of control; it is ideally where the content of the response is determined at the peak. This behavior is useful, because now middleware can serve an extended purpose, both before the peak and after the peak.

- Koa vs Express

Philosophically, Koa aims to "fix and replace node", whereas Express "augments node". Koa uses `co` to rid apps of callback hell and simplify error handling. It exposes its own `this.request` and `this.response` objects instead of node's `req` and `res` objects.

Express, on the other hand, augments node's `req` and `res` objects with additional properties and methods and includes many other "framework" features, such as routing and templating, which Koa does not.

Thus, Koa can be viewed as an abstraction of node.js's http modules, where as Express is an application framework for node.js.


Koa shares many middlewares along with Express. Koa won't replace Connect, it is just a different take on similar functionality now that generators allow us to write code with less callbacks.

What custom properties do the Koa objects have?

Koa uses its own custom objects: `this`, `this.request`, and `this.response`. These objects abstract node's `req` and `res` objects with convenience methods and getters/setters. Generally, properties added to these objects must obey the following rules:

* They must be either very commonly used and/or must do something useful
* If a property exists as a setter, then it will also exist as a getter, but not vice versa

Many of `this.request` and `this.response`'s properties are delegated to `this`. If it's a getter/setter, then both the getter and the setter will strictly correspond to either `this.request` or `this.response`.

#### generator

the one thing that makes generators significant is this: it is now possible to suspend code execution. Once you instantiate a generator object, you have a handle on a function whose execution can start and stop, moreover, whenever it stops, you have control over when it restarts.

```js
// Note
//
// yield null; // the yield keyword requires a value, so I put null. Cannot just have `yield ;`
function* two(){
  yield 1;
  yield 2;
}

> var seq = two()
> seq.next()
{ value: 1, done: false }
> seq.next()
{ value: 2, done: false }
> seq.next()
{ value: undefined, done: true }

> seq.next()  // If we call it a fourth time, we get an exception:
Error: Generator has already finished
```


###### Generator Send

Up until now we've looked at a generator objects only as a producer of a sequence of values, where information only goes one way - from the generator to you. It turns out that you can also send values to it by giving next() a parameter, in which case the yield statement actually returns a value!

```js
function* consumer(){
  while (true){
    var val = yield null;
    console.log('Got value', val);
  }
}

> var c = consumer()
> c.next(1)   // { value: null, done: false } This returns the expected object, but it also didn't console.log() anything,
> c.next(2)   // Got value 2    { value: null, done: false }
```

###### Generator throw

So we can both send and receive values from a generator, but guess what? You can also throw!

When you throw() an error onto a generator object, the error actually propagates back up into the code of the generator, meaning you can actually use the try and catch statements to catch it. So, if we add try/catches to the last example:

```js
> c.throw(new Error('blarg!'))    // Error: blarg!
```

```js
function* consumer(){
  while (true){
    try{
      var val = yield null;
      console.log('Got value', val);
    }catch(e){
      console.log('You threw an error but I caught it ;P')
    }
  }
}

> var c = consumer()
// we'll call next() first, because there's no way the generator can catch a error that's thrown at it before it even starts executing.
> c.next()   // this is required to start the execution

// manually throw an error, it will catch the error and handle it gracefully
> c.throw(new Error('blarg!'))  // You threw an error but I caught it ;P
```

Generator Benefits

- write the equivalent code in a straight-line fashion,  less code and asthetics
- Line independence: the code for one operation is no longer tied to the ones that come after it. If you want to reorder of operations, simply switching the lines. If you want to remove an operation, simply deleting the line.
- Simpler and DRY error handling: where as the callback-based style required error handling to be done for each individual async operation, with the generator-based style you can put one try/catch block around all the operations to handle errors uniformly - generators gives us back the power of try/catch exception handling.


Make it happen

The first thing to realize is that the async operations need to take place outside of the generator function. This means that some sort of "controller" will need to handle the execution of the generator, fulfill async requests, and return the results back. So we'll need to pass the generator to this controller, for which we'll just make a run() function:

```js
run(function*(){
  try{
    var tpContent = yield readFile('blog_post_template.html');
    var mdContent = yield readFile('my_blog_post.md');
    resp.end(template(tpContent, markdown(String(mdContent))));
  }catch(e){
    resp.end(e.message);
  }
});
```

run() has the responsibility of calling the generator object repeatedly via next(), and fulfill a request each time a value is yielded. It will assume that the requests it receives are functions that take a single callback parameter which takes an err, and another value argument - conforming to the Node style callback convention. When err is present, it will call throw() on the generator object to propagate it back into the generator's code path. The code for run() looks like:


```js
function run(genfun){
  // instantiate the generator object
  var gen = genfun();
  // This is the async loop pattern
  function next(err, answer){
    var res;
    if (err){
      // if err, throw it into the wormhole
      return gen.throw(err);
    }else{
      // if good value, send it
      res = gen.next(answer);
    }
    if (!res.done){
      // if we are not at the end
      // we have an async request to
      // fulfill, we do this by calling
      // `value` as a function
      // and passing it a callback
      // that receives err, answer
      // for which we'll just use `next()`
      res.value(next);
    }
  }
  // Kick off the async loop
  next();
}
```

Now given that, readFile takes the file path as parameter and needs to return a function

```js
function readFile(filepath){
  return function(callback){
    fs.readFile(filepath, callback);
  }
}
```





It is a different type of function which could be start, pause, resume.
States: "newborn", "executing", "suspended", "closed"

when invoke a generator function, returns an iterator object, So unlike regular function calls, the code in generator function block doesn't start running, iterate through it manually or by calling `next()`, When next() is called the function starts or continues to run from where it is left off and runs until it hits a pause/pause it at any point via `yield`, But besides continuing, it also returns an object, which gives information about the state of the generator.  A property is the value property, which is the current iteration value, where we paused the generator. The other is a boolean done, which indicates when the generator finished running. If there is no `yield` pausing statement, it immediately returns an object where `done` is true. If you specify a return value in the generator, it will be returned in the last iterator object (when done is true). Here is the syntax for pausing `yield [[expression]];`

Calling next() starts the generator and it runs until it hits a yield. Then it returns the object with value and done, where value has the expression value. This expression can be anything. When we call next() again, the yielded value will be returned in the generator and it continues. It's also possible to receive a value from the iterator object in a generator (next(val)), then this will be returned in the generator when it continues. calculate something else, do other things, then return to it, even with some value and then continue.

Generators are function executions that can be suspended and resumed at a later point; a lightweight coroutine. This behavior happens using special generator functions (noted by function* syntax) and a couple of new keywords (yield and yield*) which are only used in the context of a generator.

- A generator starts in a suspended state. No console output.
- By invoking next() on the generator, it will execute up until it hits the next yield keyword or returns. Now we have console output.
- Generators also have a built-in communication channel with yield:

  - The yield keyword must always yield some value (even if its null). When execution resumes, it can optionally receive a value with the use of gen.next(value).
  - The object returned from `gen.next()` includes a `value` and a `done` property. The value property is the currently yielded (or returned) value from the generator. The done property is a Boolean indicating whether or not the generator has run to completion.
  - We can send a value into the generator using gen.next(value). The value is then assigned to name, in this example, as the generator resumes.

- In addition to communicating values, you can also throw exceptions into generators with gen.throw(new Error(‘oh no’))
- Generators may be used for iteration via the shiny new for of loop:

What is yield* all about? The yield* keyword enables a generator function to yield to another generator function. This essentially gives control over to the other generator function until it has exhausted all of its yields and then it returns control to the originating generator. It should not be thought of as a way to do recursion with generators as I learned.


A Generator is a better way to build Iterators - it's a special type of function that works as a factory for iterators. A function becomes a generator if it contains a yield expression. When a generator function is called the body of the function does not execute straight away; instead, it returns a generator-iterator object. Each call to the generator-iterator's next() method will execute the body of the function up to the next yield expression and return its result.

Error handling

If you find something wrong in the iterator object's value, you can use its throw() method and catch the error in the generator. This makes a really nice error handling in a generator.

```js
function *foo () {
  try {
    x = yield 'asd B';   // Error will be thrown
  } catch (err) {
    throw err;
  }
}

var bar =  foo();
if (bar.next().value == 'B') {
  bar.throw(new Error("it's B!"));
}
```

- for...of

There is a loop type in ES6, that can be used for iterating on a generator, the `for...of` loop. The iteration will continue until done is false. Keep in mind, that if you use this loop, you cannot pass a value in a next() call and the loop will throw away the returned value.

```js
function *foo () {
  yield 1;
  yield 2;
  yield 3;
}

for (v of foo()) {
  console.log(v);
}
```

- yield *

As said, you can yield pretty much anything, even a generator, but then you have to use yield *. This is called delegation. You're delegating to another generator, so you can iterate through multiple nested generators, with one iterator object.

```js
function *bar () {
  yield 'b';
}

function *foo () {
  yield 'a';
  yield *bar();
  yield 'c';
}

for (v of foo()) {
  console.log(v);
}
```

- Thunks

Primarily they are used to assist a call to another function. You can sort of associate it with *lazy evaluation*. What's important for us though that they can be used to move node's callbacks from the argument list, outside in a function call. There is a module called [thunkify](https://github.com/tj/node-thunkify) by TJ which transforms a regular node function to a thunk, and it turns out it can be pretty good to ditch callbacks in generators.

A “thunk” is a function that returns a callback as opposed to calling it. The callback has the same signature as your typical nodeback function (i.e. error is the first argument).

```js
var read = function (file) {
  return function (cb) {
    require('fs').readFile(file, cb);
  }
}

read('package.json')(function (err, str) { })
```

Here is an example of thunk. First we have to transform the node function we want to use in a generator to a thunk. Then use this thunk in our generator as if it returned the value, that otherwise we would access in the callback. When calling the starting next(), its value will be a function, whose parameter is the callback of the thunkified function. In the callback we can check for errors (and throw if needed), or call next() with the received data.

```js
var thunkify = require('thunkify');
var fs = require('fs');
// 1st, create our thunkified functions, that can be used in a generator.
// transform Node function to a thunk to be able to use in a generator
var read = thunkify(fs.readFile);

// write our generator functions using the thunkified functions.
function *bar () {
  try {
    // use the thunk inside generator as if it returned the value. that otherwise we would access in the callback.
    var x = yield read('input.txt');
  } catch (err) {
    throw err;
  }
  console.log(x);
}
var gen = bar();

// call and iterate through the generators, handling errors and such.
// invoke next(), its value will be a function, whose parameter is the callback of the thunkified function.
gen.next().value(function (err, data) {
  // In the callback we can check for errors (and throw if needed), or call next() with the received data.
  if (err) gen.throw(err);
  gen.next(data.toString());
})
```

it's really important for Koa to get this. It has the simplicity of synchronous code, with good error handling, but still, it happens asynchronously. write code in synchronous fashion that runs asynchronously. Now, `co` is moving towards to the Promise land and dropping thunk.





To use a generator, execute the generator function - which in turn returns an iterator object. Iterator objects contain a next method, which essentially executes the generator function until it reaches a yield call. At this point, it returns the yielded value - which can be assigned to a variable for instance. Code continues to run from where the next method was originally called. Successive calls to the next method will allow execution in the generator to resume where it paused previously - the most recent yield call. Generator function state is maintained, so variable values persist across next calls.

Generator does not control by itself, must control by other module. So use well-structure generator Control Flow library to call `next` method automatically for you. Ex: `co`

```js
// we created a geneartor object/function.
// cannot be called directly. ex: example(). won't work.
// has to be initialized and start with `next` method
function *hello(name) {
    yield 'Your name is ' + name;
    return 'hello ' + name;
}
var gen = hello('matt');
//  without yield return: {value: 'hello matt', done: true}
//  with yield return: {value: 'Your name is matt', done: false}
gen.next();
// calling `next` method to restart the generator
gen.next();  // {value: 'hello matt', done: true}
```

"value" is return value of the generator
"done" is generator run is completed or not
`yield` can pause the generator

`function* () {}` or `.map(function* () {})` is a regular function. The only difference is return object. Invoking `function* () {}` would return a generator.  That means you can pass `function* () {}` basically anywhere a regular function can go, but just make sure you realize that a generator is returend.

Ex: execute in parallel

```js
co(function* () {
  var values = []; // some values
  yield values.map(function (x) {
    return somethingAsync(x)
  })
})()

function* somethingAsync(x) {
  // do something async
  return y
}
```

Ex: Return promises.

```js
co(function* () {
  var values = []
  var mappedValues = yield values.map(toPromise)
})()

function toPromise(x) {
  return new Promise(function (resolve, reject) {
    resolve(x)
  })
}
```

a generator that generates a list of fibonacci numbers

```js
'use strict';

function *fibonacci() {
    var prev = 0, curr = 1, tmp;

    for ( ;; ) {
        tmp  = prev;
        prev = curr;
        curr = tmp + curr;

        yield curr;
    }
}

var seq = fibonacci();

console.log(seq.next()); // returns 1
console.log(seq.next()); // returns 2

// do something else
console.log(seq.next()); // returns 3
```

##### Wrapping Generators  `yield* `

Wrapping generator functions and regular function could both be `yield`. via `yield* regularFunction()`.
And in both cases, you'll be able to do` yield* wrappedFn()`.

```js
// case 1, an generator function of `wrappedFn`
function* wrappedFn(x) {
  return yield* somethingAsync(x)
}

// case 2, an regular function
function wrappedFn(x) {
  return somethingAsync(x)
}

// can both be yielded. `yield* wrappedFn()`
```

##### `yield next` vs. `yield* next`

- [` yield* next`](http://wiki.ecmascript.org/doku.php?id=harmony:generators#delegating_yield)

"delegating yields" as generators. The yield* operator delegates to another generator. This provides a convenient mechanism for composing generators. ` yield* <<expr>>`; Koa uses it internally for "free" performance, we don't advocate it to avoid confusion. Essentially, delegated generators replace the yield*!

`yield* next`, Koa is currently faster than Express. Because Koa doesn't use a dispatcher, unlike Express who uses multiple (one from connect, one for the router).

What does delegating yield do?

```js
// Suppose you have two generators:
function* outer() {
  yield 'open'
  yield inner()
  yield 'close'
}

function* inner() {
  yield 'hello!'
}
```

If you iterate through outer(), what values will that yield?

```js
var gen = outer()
gen.next() // -> 'open'
gen.next() // -> a generator
gen.next() // -> 'close'
```

But what if you `yield* inner()`?

```js
var gen = outer()
gen.next() // -> 'open'
gen.next() // -> 'hello!'
gen.next() // -> 'close'
```

In fact, the following two functions are essentially equivalent:

```js
function* outer() {
  yield 'open'
  yield* inner()
  yield 'close'
}

function* outer() {
  yield 'open'
  yield 'hello!'
  yield 'close'
}
```

- What does this have to do with `co` and `koa`? in `co` control flow

```js
// have the following generators:
function* outer() {
  this.body = yield inner
}

function* inner() {
  yield setImmediate
  return 1
}
```

What is essentially happening here is:  There's an extra co call here.
Each co call creates a few closures, so there's going to be a tiny bit of overhead.
but with one *, you can avoid this overhead and use native language features instead of this third party library called co.

```js
function* outer() {
  this.body = yield co(function inner() {
    yield setImmediate
    return 1
  })
}
```

But if we use delegation, we can skip the extra co call:

```js
function* outer() {
  this.body = yield* inner()
}
```

essentially becomes

```js
function* outer() {
  yield setImmediate
  this.body = 1
}
```

- With delegating yield, Koa essentially "unwraps" this:

```js
app.use(function* responseTime(next) {
  var start = Date.getTime()
  yield* next
  this.set('X-Response-Time', Date.getTime() - start)
})

app.use(function* poweredBy(next) {
  this.set('X-Powered-By', 'koa')
  yield* next
})

app.use(function* pageNotFound(next) {
  yield* next
  if (!this.status) {
    this.status = 404
    this.body = 'Page Not Found'
  }
})

app.use(function* (next) {
  if (this.path === '/204')
    this.status = 204
})
```

Into this:
The only overhead is the initiation of a single co instance and our own Context constructor that wraps node's req and res objects for convenience.

```js
co(function* () {
  var start = Date.getTime()
  this.set('X-Powered-By', 'koa')
  if (this.path === '/204')
    this.status = 204
  if (!this.status) {
    this.status = 404
    this.body = 'Page Not Found'
  }
  this.set('X-Response-Time', Date.getTime() - start)
}).call(new Context(req, res))
```

If you yield* something that isn't a generator, you'll get an error like the following:

```js
TypeError: Object function noop(done) {
  done();
} has no method 'next'
```

##### Promise

Can convert anything into a promise. A promise is just any object with .then().

For example, suppose you have an object stream, and you want .then() to exhaust the stream and return all the objects of the stream.

```js
// convert stream into an Promise object by adding `then` method manually
var toArray = require('stream-to-array')
// Now you can simply do stream.then()
stream.then = function (resolve, reject) {
  // Keep in mind that you need to pass resolve and reject to the real .then() method, which you're just proxying to.
  return toArray(this).then(resolve, reject)
}
// even `yield stream`
co(function* () {
  var docs = yield stream
})()
```

Even better, you can create an iterator out of this! just tack on a .then() method to any object you'd like, and you've created a 'yieldable'!

```js
function Iterator() {
  this.i = 0
}

Iterator.prototype.then = function (resolve, reject) {
  return Promise.resolve(this.i++).then(resolve, reject)
}

co(function* () {
  var iterator = new Iterator()
  var i
  while (100 > i = yield iterator) {
    // do something
  }
})()
```

#### middleware

A function that can do things when the request is being made, and when the response is returned.
Sequence of adding middlewares are super important.

Syntax: Create a regular function that can take some setup options as parameter, that function return a generator function which receive an `next` parameter.

All non-return middleware must yield the control flow to downstream middleware by calling `yield next;`

```
    module.exports = function(options) {
        return function *session(next) {

        }
    }
```

```js
    var requestTime = function(headerName) {
        return function *(next) {
            var start = new Date();
            // pause the current middleware execution
            // yield control to the down stream middleware
            // when downstream middleware all finish,
            // the current middleware will resume and execute
            yield next;
            var end = new Date();
            var ms = end -start;
            this.set(headerName, ms + 'ms');
        }
    };

    // usage
    // For this particular one, need to add before route middleware to get data
    app.use(requestTime('Response-time'));
```

#### Writing Koa Middleware

Koa middleware are simple functions which return a `GeneratorFunction`, and accept another. When the middleware is run by an "upstream" middleware, it must manually yield to the "downstream" middleware.

- Best Practices

* always wrap the middleware in a function that accepts options, which allowing users to extend functionality. Ex: `function logger(format) {`

* always name your middlware, very useful for debugging purposes to assign a name. Ex: `return function *logger(next){`

```js
function logger(format) {
  format = format || ':method ":url"';

  return function *logger(next){
    var str = format
      .replace(':method', this.method)
      .replace(':url', this.url);

    console.log(str);
    yield next;
  }
}

app.use(logger());
app.use(logger(':method :url'));
```

- `koa-compose`

Compose the given middleware (multiple middleware) and return middleware.

Sometimes you want to "compose" multiple middleware into a single middleware for easy re-use or exporting. To do so, you may chain them together with .call(this, next)s, then return another function that yields the chain.

```js
function *random(next) {
  if ('/random' == this.path) {
    this.body = Math.floor(Math.random()*10);
  } else {
    yield next;
  }
};

function *backwards(next) {
  if ('/backwards' == this.path) {
    this.body = 'sdrawkcab';
  } else {
    yield next;
  }
}

function *pi(next) {
  if ('/pi' == this.path) {
    this.body = String(Math.PI);
  } else {
    yield next;
  }
}

function *all(next) {
  yield random.call(this, backwards.call(this, pi.call(this, next)));
}

app.use(all);

// in koa-compose. partial code
function compose(middleware){
  return function *(next){
    while (middleware.length--)  next = middleware[i].call(this, next);
    yield *next;
  }
}
```

Here is my break down the simpler version of `koa-compose` in regular function

```js
function compose(arr) {
  return function( fn ) {
    var i = arr.length;
    while( i-- ) {
      console.log("i: ", i);   // last index => 0,  In Koa, downstream => upstream
      console.log('this', this);  // in Koa, this is the context, which would be the `app`
      fn = arr[i].call(this, fn);
      console.log("fn: ", fn);  // in Koa, fn is the middleware function itself, has been decorated
    }
    return fn;
  }
}

var a = function() { return "I am a"; };
var b = function() { return "I am b"; };
var c = function() { return "I am c"; };

compose([a, b, c]);   // would return ust the function itself
compose([a, b, c])(); // would invoke function a, b, c in reserve order  "I am c", "I am b", "I am a"
```

- Response Middleware

Middleware that decide to respond to a request and wish to bypass downstream middleware may simply omit `yield next`. Typically this will be in routing middleware, but this can be performed by any.

For example the following will respond with "two", however all three are executed, giving the downstream "three" middleware a chance to manipulate the response.

```js
app.use(function *(next){
  console.log('>> one');
  yield next;
  console.log('<< one');
});

app.use(function *(next){
  console.log('>> two');
  this.body = 'two';
  yield next;   // <= If this line is missing, the 3rd/other downstream middleware will be ignored
  console.log('<< two');
});

app.use(function *(next){
  console.log('>> three');
  yield next;
  console.log('<< three');
});
```

If `yield next` is missing from 2nd middleware, When the furthest downstream middleware executes `yield next`; it's really yielding to a noop function, allowing the middleware to compose correctly anywhere in the stack.

- Async operations

`co` uses generator delegation, allowing you to write non-blocking sequential code.

For example this middleware reads the filenames from ./docs, and then reads the contents of each markdown file in parallel before assigning the body to the joint result.

```js
var fs = require('co-fs');

app.use(function *(){
  var paths = yield fs.readdir('docs');

  var files = yield paths.map(function(path){
    return fs.readFile('docs/' + path, 'utf8');
  });

  this.type = 'markdown';
  this.body = files.join('');
});
```

- Debugging Koa

built with support the DEBUG environment variable from [`debug`](https://github.com/visionmedia/debug) which provides simple conditional logging. For example to see all koa-specific debugging information just pass `DEBUG=koa*` and upon boot you'll see the list of middleware used, among other things.

```bash
DEBUG=koa* node --harmony examples/simple

# output
  koa:application use responseTime +0ms
  koa:application use logger +4ms
  koa:application use contentLength +0ms
  koa:application use notfound +0ms
  koa:application use response +0ms
  koa:application listen +0ms
```

Since JavaScript does not allow defining function names at runtime, you can also set a middleware's name as `._name`. This useful when you don't have control of a middleware's name. For example:

```js
var path = require('path');
var static = require('koa-static');

var publicFiles = static(path.join(__dirname, 'public'));
publicFiles._name = 'static /public';

app.use(publicFiles);
```

Now, instead of just seeing "static" when debugging, you will see:

```bash
# console output
koa:application use static /public +0ms
```


#### Source Code

When a request coming in Function F (callback return) is invoked and Function W is evaluated at the last line: `fn.call(ctx).catch(ctx.onerror)`. Fucntion W will return a promise that is returned by co and its argument `fn.apply(this, arguments)` is actually `Iterator C` as we invoke fn (`Generator C`). This is exactly what `koa-compose` does, which Koa internally uses to create and dispatch the middleware stack.

```js
// `app.callback` will return an Function for `http.createServer`
// http.createServer(this.callback()).listen(...)

//Return a request handler callback for node's native http server.
app.callback = function(){
  // it adds respond (another generator) to this.middleware. Now mw is [respond, MW1, MW2, ...].
  var mw = [respond].concat(this.middleware);
  // [`compose`](https://github.com/koajs/compose) which Compose the given middleware and return middleware.
  // API Syntax: `compose([a, b, c, ...])`
  // returns a **Generator C** comprised of all those 4 above. [see source code below]
  var gen = compose(mw);
  // co warps **Generator C** into **Function W** that returns a promise.
  // This is a separate function so that every co() call doesn't create a new,unnecessary closure.   [see source code below]
  var fn = co.wrap(gen);
  var self = this;

  if (!this.listeners('error').length) this.on('error', this.onerror);

  //will return **Function F**
  return function(req, res){
    res.statusCode = 404;
    var ctx = self.createContext(req, res);
    onFinished(res, ctx.onerror);
    fn.call(ctx).catch(ctx.onerror);
  }
};
```

```js
// [koa-compose]((https://github.com/koajs/compose)) package
// Compose `middleware` returning a fully valid middleware comprised of all those which are passed.
function compose(middleware){  // <= middleware is Array
  // **Generator C**
  return function *(next){
    if (!next) next = noop();
    var i = middleware.length;
    while (i--) {
      next = middleware[i].call(this, next);
    }
    yield *next;
  }
}

function *noop(){}
```

```js
//co package
co.wrap = function (fn) {
  // **Function W**
  return function () {
    return co.call(this, fn.apply(this, arguments));
  };
};
```

Here is my break down the simpler version of `co-wrap`, how to use it
In `co`, `co.wrap` wrap the given generator `fn` into a function that returns a promise.

```js
var wrap = function (fn) {
  return function () {
    return wrap.call(this, fn.apply(this, arguments));
  };
};
var a = function(name) { return 'my name is ' + name; };
var b = wrap(a);
// a.call(this, a.apply(this, ['matt']))
b('matt');
```

In `onFulfilled`, we call `Iterator C`'s `next` function. There is only one yield in `Generator C` and it delegates Generator `prev`.

After the loop, `prev` is `Iterator respond` and `Generator respond`'s argument `next` is `Iterator MW1`. The same thing, `Generator MW1`'s argument next is `Iterator MW2`, `Generator MW2`'s argument next is `Iterator MW3`, `Generator MW3`' doesn't have any arguments.

The difference between `Generator respond` and other generators is that it delegates `Generator MW1`, which means `yield *next` will run `Generator MW1` and go back to `onFulfilled` function after `yield next`.

As yield next in Generator MW1, it returns Iterator MW2 as ret's value so after ret is passed to co's next function, ret.done is false and in toPromise function,  ret's value Iterator MW2 is passed to co function again like 1st time.

Iterator MW2's next() returns Iterator MW3 when see yield in Generator MW2. ret.done is still false so Iterator S3 is passed to co function, this time ret.done is true as no  yield in Generator MW3.

Finally we can resolve this Promise. Back to the last level, it calls value.then(onFulfilled, onRejected) which Iterator MW2's next(), ret.done is true as well because only one yield in Generator MW2. And then back to Iterator MW1 and Iterator respond.

```js
function co(gen) {
  var ctx = this;
  if (typeof gen === 'function') gen = gen.call(this);
  // we wrap everything in a promise to avoid promise chaining, which leads to memory leak errors.
  return new Promise(function(resolve, reject) {
    onFulfilled();

    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}
```

## Advanced Koa

1. `yield` could handle array of async operation.

```js
var readFile = function(dir) {
  return function(fn) {
    fs.readFile(dir, fn)
  }
};

app.use(function* () {
  var arr = yield ['1.txt', '2.txt', '3.txt'].map(function(path) {
    return readFile(path)
  })
  this.body = arr.join(',')
})
```

What is any error happened in Async? Learn generator's `throw` method.

The `throw` function’s behavior is: If this is not a generator object, Throw Error Call `this.[[Throw]]` with the first argument Return the result

We could add our custom `try/catch` error block, koa also added `app.onerror`, `404` or `500` default etc. But recommend to handle the error yourself.

```js
// follow the previous code block
// handle error in one place, all `yield` error would be caught
// mix with `this.throw` and `new Error()` to organize errors
app.use(function* (next) {
  try {
    yield next
  } catch(e) {
    // handleErrors(e);  // complex logic to handle errors
    return this.body = e.message || "I'm dead"
  }
});
app.use(function* () {
  var arr = yield ['4.txt', '2.txt', '3.txt'].map(function(path) {
    // 4.txt is not existed
    return readFile(path)
  })
  this.body = arr.join(',')
})
```

2. Asynchronous control flow

In Node land, everything is set up to work with callbacks. It is our lowest-level asynchronous abstraction. However, callbacks don’t work well with generators but yield will. If we invert how we have been using generators and use the built-in communications channel, we can write synchronous looking asynchronous code!

First, we need to convert asynchronous Node-style callback functions into thunks, a subroutine value we can reference until its ready to be executed:

```js
function thunkify (nodefn) { // [1] Take an existing Node callback style function as input.
  return function () { // [2] Return a function that converts Node-style into a thunk-style.
    var args = Array.prototype.slice.call(arguments)
    // [3] Enable the asynchronous function to be execute independently from its initial setup by delaying the execution until its returned function is called.
    return function (cb) {
      args.push(cb)
      nodefn.apply(this, args)
    }
  }
}
```

To explain the function above, this is how it works

```js
var fs = require('fs')
var readFile = thunkify(fs.readFile) // [1] Turn fs.readFile into a thunk-style function.
// [2] Setup readFile to read async.js using the same fs.readFile API without passing the callback argument. No asynchronous operation is performed yet.
var readAsyncJs = readFile('./async.js')
readAsyncJs(function (er, buf) { ... }) // [3] Perform the asynchronous operation and callback.
```

Then, we could use and do something like this

```js
run(function* () {
  console.log("Starting")
  var file = yield readFile("./async.js") // [1] Wait for the result of async.js to come back before continuing.
  console.log(file.toString())
})
```

finally, let’s write a run function, which takes a generator function and handles any yielded thunks:

```js
function run (genFn) {
  var gen = genFn() // [1] Immediately invoke the generator function. This returns a generator in a suspended state.
  next() // [2] invoke the next function. We call it right away to tell the generator to resume execution (since next triggers gen.next()).

  // [3] Notice how next looks just like the Node callback signature (er, value). Every time a thunk completes its asynchronous operation we will call this function.
  function next (er, value) {
    if (er) return gen.throw(er)
    var continuable = gen.next(value)

    if (continuable.done) return // [4]  If there was an error from the asynchronous operation, throw the error back into the generator to be handled there.
    var cbFn = continuable.value // [5] If successful, send the value back to the generator. This value gets returned from the yield call.
    // [6] If we have no more left to do in our generator, then stop by returning early.
    // [7] If we have more to do, take the value of the next yield and execute it using our next as the callback.
    cbFn(next)
  }
}
```

Usage for the above implementation.

```js
var fs = require('fs')
var readFile = thunkify(fs.readFile)

run(function* () {
  try {
    var file = yield readFile('./async.js')
    console.log(file)
  }
  catch (er) {
    console.error(er)
  }
})
```

3. a simple implementation of a flow control library built on top of this facility

```js
var fs = require(‘fs’);
function thread(fn) {
  var gen = fn();
  function next(err, res) {
    var ret = gen.next(res);
    if (ret.done) return;
    ret.value(next);
  }

  next();
}
thread(function *(){
  var a = yield read(‘Readme.md’);
  var b = yield read(‘package.json’);
  console.log(a);
  console.log(b);
});
function read(path) {
  return function(done){
    fs.readFile(path, 'utf8', done);
  }
}
```

#### co libraray

Co is a generator based flow-control module for node. Koa is built on co, which handles the delegation to generators and gives Koa its nice syntax.

Co (and Koa) have a really simple way to handle this; just yield an array or object, where each element of the array or property of the object is either a generator or a Promise. When Co encounters this, it triggers all the promises/generators at the same time, waits for the results to return, and keeps things in their correct order.

Co handles all of the generator calling code for you. Simply put a`yield` before anything that evaluates to something.

Why coroutines rocks? coroutines run each “light-weight thread” with its own stack. The implementations of these threads varies but typically they have a relatively small initial stack size (~4kb), growing when required. Why is this so great? Error handling! Since we pass the generator to the `co()` function, and all yields delegate to the caller, extremely robust error handling can be delegated to Co.

```js
co(function *(){
  var str = yield read('Readme.md')
  str = str.replace('Something', 'Else')
  yield write('Readme.md', str)
})
```

Libraries like Co can “throw” exceptions back to their origin as shown below, meaning you can use try/catch as the language intended, or leave them out and utilize the final Co callback to handle the error.

```js
co(function *(){
  try {
    var str = yield read(‘Readme.md’)
  } catch (err) {
    // whatever
  }
  str = str.replace(‘Something’, ‘Else’)
  yield write(‘Readme.md’, str)
})
```

Generators vs coroutines

Generators are sometimes referred to as “semicoroutines”, a more limited form of coroutine that may only yield to its caller. This makes the use of generators more explicit than coroutines, as only yielded values may suspend the “thread”.

Coroutines are more flexible in this respect, and looks just like regular blocking code as no yield is required:

```js
var str = read('Readme.md')
str = str.replace('Something', 'Else')
write('Readme.md', str)
console.log('all done!')
```


Co works with both promises and thunks and they are used for yield statement so that co knows when to continue execution of the generator instead of you manually having to call next(). Co also supports the use of generators, generator functions, objects and arrays for further flow control support.

By yielding an array or an object you can have co perform parallel operations on all of the yielded items. By yielding to a generator or generator function co will delegate further calls to the new generator until it is completed and then resume calling next on the current generator, allowing you to effectively create very interesting flow control mechanisms with minimal boilerplate code.

```js
var read = thunkify(fs.readFile);

co(function *bar () {
  try {
    var x = yield read('input.txt');
  } catch (err) {
    console.log(err);
  }
  console.log(x);
})();
```

calling `co()` does not execute the code inside of it, `co` return a function that you need to call to start the generator.

`co` can yield object, array or more. It will run any yieldable elements within the object, array in parellel. cannot yeild any API which only setup for callbacks. Nested yieldables are supported, meaning you can nest promises within objects within arrays, and so on!

`co` yieldable objects currently supported are:

* promises

promises is that they are an object returned by a function that maintains the state of the function and a list of callbacks to call when the a specific state of the object is or has been entered into.

* thunks (functions)
* array (parallel execution)

when `yield` an array or an object, it will evaluate its content parallelly.

```js
var read = thunkify(fs.readFile);

co(function *() {
  // 3 concurrent reads
  var reads = yield [read('input.txt'), read('input.txt'), read('input.txt')];
  console.log(reads);

  // 2 concurrent reads
  reads = yield { a: read('input.txt'), b: read('input.txt') };
  console.log(reads);
})();
```

Of course this makes sense when the members of your collection are thunks, generators. You can nest, it will traverse the array or object to run all of your functions parallelly. Important: the yielded result will not be flattened, it will retain the same structure.

```js
var read = thunkify(fs.readFile);

co(function *() {
  var a = [read('input.txt'), read('input.txt')];
  var b = [read('input.txt'), read('input.txt')];

  // 4 concurrent reads
  var files = yield [a, b];

  console.log(files);
})();
```

You can also achieve parallelism by yielding after the call of a thunk.

```js
var read = thunkify(fs.readFile);

co(function *() {
  var a = read('input.txt');
  var b = read('input.txt');

  // 2 concurrent reads
  console.log([yield a, yield b]);

  // or
  //
  // 2 concurrent reads
  console.log(yield [a, b]);
})();
```

* objects (parallel execution)

* generators (delegation)

You can also yield generators as well of course. Notice you don't need to use `yield *`.

```js
var stat = thunkify(fs.stat);

function *size (file) {
  var s = yield stat(file);
  return s.size;
}

co(function *() {
  var f = yield size('input.txt');
  console.log(f);
})();
```

* generator functions (delegation)

```js
    co(function* (){
        // possible  try{} catch{}
    })();
```

`co()` invoked, then called with a callback and optional arguments. and return a promise object.

```js
    function onerror(err) {
      // log any uncaught errors
      // co will not throw any errors you do not handle!!!
      // HANDLE ALL YOUR ERRORS!!!
      console.error(err.stack);
    }

    co(function* () {
      // yield any promise
      var result = yield Promise.resolve(true);
      return result;
    })
        .then(function (value) {
          console.log(value);
        })
        .catch(onerror);
```

- Thunks

Thunks are just functions that take a single parameter callback and return another function that they are wrapping.

This creates a closure that allows the calling code to instantiate the function passing in its callback so that it can be told when the method is complete.

Thunks are functions that only have a single argument, a callback. Thunk support only remains for backwards compatibility and may be removed in future versions of co.

- Arrays

yielding an array will resolve all the yieldables in parallel.

```js
    co(function *(){
      // resolve multiple promises in parallel
      var a = Promise.resolve(1);
      var b = Promise.resolve(2);
      var c = Promise.resolve(3);
      var res = yield [a, b, c];
      console.log(res);   // => [1, 2, 3]
    }).catch(onerror);
```

```js
    // errors can be try/catched
    co(function *(){
      try {
        yield Promise.reject(new Error('boom'));
      } catch (err) {
        console.error(err.message); // "boom"
     }
    }).catch(onerror);
```

- Objects

Just like arrays, objects resolve all yieldables in parallel.

```js
    co(function* () {
      var res = yield {
        1: Promise.resolve(1),
        2: Promise.resolve(2),
      };
      console.log(res); // => { 1: 1, 2: 2 }
    }).catch(onerror);
```

- Generators and Generator Functions

Generators are essentially iterator functions that allow their execution to be paused and resumed through the use of yield.

The yield keyword essentially says return this value for this iteration and I'll pick up where I left off when you call next() on me again.

Generator functions are special functions in that they don't execute the first time they're call but instead return an iterator object with a few methods on it and the ability to be used in for-of loops and array comprehensions.

send(),: This sends a value into the generator treating it as the last value of yield and continues the next iteration

next(),: This continues the next iteration of the generator

throw(): This throws an exception INTO the generator causing the generator to throw the exception as though it came from the last yield statement.

close(): This forces the generator to return execution and calls any finally code of the generator which allows final error handling to be triggered if needed.

Their ability to be paused and resumed is what makes them so powerful at managing flow control.

Generators are lightweight co-routines for JavaScript. They allow a function to be suspended and resumed via the yield keyword. Generator functions have a special syntax: function* (). With this superpower, we can also suspend and resume asynchronous operations using constructs such as promises or “thunks” leading to “synchronous-looking” asynchronous code.

Any generator or generator function you can pass into co can be yielded as well. This should generally be avoided as we should be moving towards spec-compliant Promises instead.

- Contexts

co calls all continuables or yieldables with the same context. This particulary becomes annoying when you `yield` a function that needs a different context. For example, constructors!

```js
function Thing() {
  this.name = 'thing'
}

Thing.prototype.print = function (done) {
  var self = this
  setImmediate(function () {
    console.log(self.name)
  })
}

// in koa
app.use(function* () {
  var thing = new Thing()
  this.body = yield thing.print
})
```

What you'll find is that this.body is undefined! This is because co is essentially doing this:

```js
app.use(function* () {
  var thing = new Thing()
  this.body = yield function (done) {
    // this refers to the Koa context, not thing.
    thing.print.call(this, done)
  }
})
```

This is where yield* comes in! When context is important, you should be doing one of two things:
By using this strategy, you'll avoid 99% of generator-based context issues. So avoid doing `yield context.method`!

```js
yield* context.generatorFunction()
yield context.function.bind(context)
```

- Generator methods

1. .next   fn, If this is not a generator object, Throw Error Call this.[[Send]] with single argument undefined Return the result

2. .send   fn, If this is not a generator object, Throw Error Call this.[[Send]] with the first argument Return the result

3. .throw  fn, If this is not a generator object, Throw Error Call this.[[Throw]] with the first argument Return the result

4. .close   fn, If this is not a generator object, Throw Error Call this.[[Close]] with no arguments Return the result

5. .iterate fn, Every generator is an iterator object, and it has an iterate method whose behavior is: Return this

In other words, generator iterators can be automatically used with for-of loops and comprehensions.

#### Co API

1. `co(fn*).then( val => )`

Returns a promise that resolves a generator, generator function, or any function that returns a generator.

Note: Any library that returns promises work well with `co`. Ex: [mz](https://github.com/normalize/mz) - wrap all of node's code libraries as promises.

2. `var fn = co.wrap(fn*)`

Convert a generator into a regular function that returns a Promise.
If you want to convert a co-generator-function into a regular function that returns a promise, you now use `co.wrap(fn*)`
This is a separate function so that every `co()` call doesn't create a new, unnecessary closure.

```js
    var fn = co.wrap(function* (val) {
      return yield Promise.resolve(val);
    });

    fn(true).then(function (val) {

    });
```

## Decorator Pattern

decorator - a structural design pattern that promotes code reuse and is a flexible alternative to subclassing. This pattern is also useful for modifying existing systems where you may wish to add additional features to objects without the need to change the underlying code that uses them.

Traditionally, the decorator is defined as a design pattern that allows behavior to be added to an existing object dynamically. The idea is that the decoration itself isn't essential to the base functionality of an object otherwise it would be baked into the 'superclass' object itself.

The decorator pattern, also known as a wrapper, is a mechanism by which to extend the run-time behavior of an object, a process known as decorating. The decorator pattern is used to enhance the behavior of an existing object, not change it (like this example does).


In traditional OOP, a class B is able to extend another class A. Here we consider A a
superclass and B a subclass of A. As such, all instances of B inherit the methods from
A. B is however still able to define its own methods, including those that override
methods originally defined by A.

Should B need to invoke a method in A that has been overridden, we refer to this as
method chaining. Should B need to invoke the constructor A() (the superclass), we call
this constructor chaining.

Decorators are used when it's necessary to delegate responsibilities to an object where
it doesn't make sense to subclass it. A common reason for this is that the number of
features required demand for a very large quantity of subclasses.

The decorator pattern isn't heavily tied to how objects are created but instead focuses
on the problem of extending their functionality. Rather than just using inheritance,
where we're used to extending objects linearly, we work with a single base object and
progressively add decorator objects which provide the additional capabilities. The idea
is that rather than subclassing, we add (decorate) properties or methods to a base object
so its a little more streamlined.

Example 1: Basic decoration of existing object constructors with new
functionality

```js
function vehicle( vehicleType ){
// properties and defaults
this.vehicleType = vehicleType || 'car',
this.model = 'default',
this.license = '00000-000'
}
// Test instance for a basic vehicle
var testInstance = new vehicle('car');
console.log(testInstance);
// vehicle: car, model:default, license: 00000-000
// Lets create a new instance of vehicle, to be decorated*/
var truck = new vehicle('truck');
// New functionality we're decorating vehicle with
truck.setModel = function( modelName ){
  this.model = modelName;
}
truck.setColor = function( color ){
this.color = color;
}
// Test the value setters and value assignment works correctly
truck.setModel('CAT');
truck.setColor('blue');
console.log(truck);
// vehicle:truck, model:CAT, color: blue
// Demonstrate 'vehicle' is still unaltered
var secondInstance = new vehicle('car');
console.log(secondInstance);
// as before, vehicle: car, model:default, license: 00000-000
```

Example 2: Simply decorate objects with multiple decorators

Here, the decorators are overriding the superclass .cost() method to return the current
price of the Macbook plus with the cost of the upgrade being specified. It's considered a
decoration as the original Macbook object's constructor methods which are not overridden
(e.g. screenSize()) as well as any other properties which we may define as a part
of the Macbook remain unchanged and intact.

```js
// What we're going to decorate
function MacBook() {
this.cost = function () { return 997; };
this.screenSize = function () { return 13.3; };
}
// Decorator 1
function Memory( macbook ) {
var v = macbook.cost();
macbook.cost = function() {
return v + 75;
}
}
// Decorator 2
function Engraving( macbook ){
var v = macbook.cost();
macbook.cost = function(){
return v + 200;
};
}
// Decorator 3
function Insurance( macbook ){
var v = macbook.cost();
macbook.cost = function(){
  return v + 250;
};
}
var mb = new MacBook();
Memory(mb);
Engraving(mb);
Insurance(mb);
console.log(mb.cost()); //1522
console.log(mb.screenSize()); //13.3
```

Example 3

The class MedicalPublication and Publication implicitly implement PublicationIF. In this case MedicalPublication acts as the decorator to list the first and last authors as contributors while unchanging other behavior.

Note that MedicalPublication references PublicationIF, and not Publication. By referencing the interface instead of a specific implementation we can arbitrarily nest decorators within one another! (In the coffee shop problem we can create decorators such as WithCream, WithoutCream, and ExtraSugar–these can be nested to handle any complex order.)

The MedicalPublication class delegates for all standard operations and overrides contributingAuthors() to provide the “decorated” behavior.

```js
/**
 * MedicalPublication constructor.
 *
 * @param PublicationIF The publication to decorate.
 */
var MedicalPublication = function(publication) {
  this._publication = publication;
};

MedicalPublication.prototype = {

  /**
   * @return String The publication title.
   */
  getTitle:  function() {
    return this._publication.getTitle();
  },

  /**
   * @return Author[] All authors.
   */
  getAuthors: function() {
    return this._publication.getAuthors();
  },

  /**
   * @return int The publication type.
   */
  getType: function() {
    return this._publication.getType();
  },

  /**
   * Returns the first and last authors if multiple authors exists.
   * Otherwise, the first author is returned. This is a convention in the
   * medical publication domain.
   *
   * @return Author[] The significant contributors.
   */
  contributingAuthors: function() {

    var authors = this.getAuthors();

    if (authors.length > 1) {
      // fetch the first and last contributors
      return authors.slice(0, 1).concat(authors.slice(-1));
    } else {
      // zero or one contributors
      return authors.slice(0, 1);
    }
  },

  /**
   * @return String the representation of the Publication.
   */
  toString: function() {
    return 'Decorated - ['+this.getType()+'] "'+this.getTitle()+'" by '+this.contributingAuthors().join(', ');
  }
};

/**
 * Factory method to instantiate the appropriate PublicationIF implementation.
 *
 * @param String The discriminating type on which to select an implementation.
 * @param String The publication title.
 * @param Author[] The publication's authors.
 * @return PublicationIF The created object.
 */
var publicationFactory = function(title, authors, type) {

  if (type === 'medical') {
    return new MedicalPublication(new Publication(title, authors, type));
  } else {
    return new Publication(type, title, authors);
  }
};
```

Once the application is modified to expect PublicationIF objects we can accommodate further requirements to handle what constitutes a contributing author by adding new decorators. Also, the design is now open for any PublicationIF implementations beyond decorators to fulfill other requirements, which greatly increases the flexibility of the code.

```js
// usage
var title = 'Pancreatic Extracts as a Treatment for Diabetes';
var authors = [new Author('Adam', 'Thompson'),
  new Author('Robert', 'Grace'),
  new Author('Sarah', 'Townsend')];
var type = 'medical';

var pub = publicationFactory(title, authors, type);

// prints: Decorated - [medical] 'Pancreatic Extracts as a Treatment of Diabetes' by Adam Thompson, Sarah Townsend
alert(pub);
```

One criticism is that the decorator must be maintained to adhere to its interface.
Another criticism is that decorators must implement all operations defined by a contract to enforce a consistent API. While this can be tedious at times, there are libraries and methodologies that can be used with JavaScript’s dynamic nature to expedite coding. Reflection-like invocation can be used to allay concerns when dealing with a changing API.

```js
/**
 * Invoke the target method and rely on its pre- and post-conditions.
 */
Decorator.prototype.someOperation = function() {
  return this._decorated.someOperation.apply(this._decorated, arguments);
};

// ... or a helper library can automatically wrap the function

/**
 * Dynamic invocation.
 *
 * @param Class The class defining the function.
 * @param String The func to execute.
 * @param Object The *this* execution context.
 */
function wrapper(klass, func, context) {
  return function() {
    return klass.prototype[func].apply(context, arguments);
  };
};
```

## Koa API

`koa`, the module itself, lightweight, it's just 4 files, averaging around 300 lines. Koa follows the tradition that every program you write must do one thing and one thing well. So you'll see, every good koa module (and every node module should be) is short, does one thing and builds on top of other modules heavily. You should keep this in mind and hack according to this. It will benefit everybody, you and others reading your code. You add the required features in the shape of small modules from npm to your app, and it does exactly what you need and in a way you need it.

`var koa = require('koa'); var app = koa();` creating a Koa app, this provides you an object, which can contain an array of generators (middlewares), executed in stack-like manner upon a new request.

Middleware in Koa are functions that handle requests. A server created with Koa can have a stack of middleware associated with it.

Cascading in Koa means, that the control flows through a series of middlewares. It yields downstream, then the control flows back upstream. To add a generator to a flow, call the `use` function with a generator.

When a new request comes in, it starts to flow through the middlewares, in the order you wrote them. When a middleware hits a yield next, it will go to the next middleware and continue that where it was left off. When there is no more middleware, we downstreamed, now we're starting to step back to the previous one (just like a stack). Then the first one ends, and we are streamed upwards successfully!

1. Context

A Koa Context encapsulates node's `request` and `response` objects into a single object which provides many helpful methods for writing web applications and APIs. A `Context` is created per request, and is referenced in middleware as the receiver, or the `this` identifier, as shown in the following snippet:

```js
app.use(function *(){
  this; // is the Context
  this.request; // is a koa Request
  this.response; // is a koa Response
});
```

Many of the `context`'s accessors and methods simply delegate to their `ctx.request` or `ctx.response` equivalents for convenience, and are otherwise identical.

- ctx.inspect

calling internal context function `ctx.toJSON`. util.inspect() implementation, which just returns the JSON output (return Object) property list below:

```js
request: this.request.toJSON(),
response: this.response.toJSON(),
app: this.app.toJSON(),
originalUrl: this.originalUrl,
req: '<original node req>',
res: '<original node res>',
socket: '<original node socket>'
```

- ctx.assert(value, [msg], [status], [properties])

Helper method to throw an error similar to `.throw()` when `!value`. Similar to node's `assert()` method.
based on middleware [http-assert](https://github.com/jshttp/http-assert)
both `assert` and `throw` use the same middleware [http-errors](https://github.com/jshttp/http-errors)

```js
ctx.assert(value, status, msg, opts)  // value is existed. is ok.

ctx.assert.equal(a, b, status, msg, opts)  // a == b

ctx.assert.notEqual(a, b, status, msg, opts)  // a != b

ctx.assert.strictEqual(a, b, status, msg, opts)  // a === b

ctx.assert.notStrictEqual(a, b, status, msg, opts) // a !== b

ctx.assert.deepEqual(a, b, status, msg, opts)  // deepEqual(a, b).  like _.deepEqual

ctx.assert.notDeepEqual(a, b, status, msg, opts)  // !deepEqual(a, b)

// example
assert(username == 'mat', 401, 'authentication failed');
// used in Koa
this.assert(this.user, 401, 'Please login!');
```

- ctx.throw([msg], [status], [properties])

Based on the middleware [http-errors](https://github.com/jshttp/http-errors)
Throw an error with `msg` and optional `status` property, defaulting to `500` that will allow Koa to respond appropriately.

Note that these are user-level errors and are flagged with err.expose meaning the messages are appropriate for client responses, which is typically not the case for error messages since you do not want to leak failure details.

You may optionally pass a properties object which is merged into the error as-is, useful for decorating machine-friendly errors which are reported to the requester upstream.  Ex: `this.throw(401, 'access_denied', { user: user });`

The following combinations are allowed:

```js
this.throw(403)
this.throw('name required', 400)
this.throw(400, 'name required')
this.throw('something exploded')
this.throw(new Error('invalid'), 400);
this.throw(400, new Error('invalid'));

this.throw('name required', 400)  // equivalent to below

var err = new Error('name required');
err.status = 400;
throw err;
```

- ctx.req

Node's `request` object

- ctx.res

Node's `response` object
Bypassing Koa's response handling is not supported.
Avoid using the following node properties: `res.statusCode`, `res.writeHead()`, `res.write()`, `res.end()`

- ctx.request

A koa `Request` object. through `Request aliases` defined below

- ctx.response

A koa Response object. through `Response aliases` defined below

- ctx.state

The recommended namespace for passing information through middleware and to your frontend views.
This is defined in the koa `application.js#createContext`. By default, it is an empty object

```js
this.state.user = yield User.find(id);
```
- ctx.app

Application instance reference.

- ctx.respond

To bypass Koa's built-in response handling, you may explicitly set `this.respond = false;`. Use this if you want to write to the raw `res` object instead of letting Koa handle the response for you.

Note that using this is not supported by Koa. This may break intended functionality of Koa middleware and Koa itself. Using this property is considered a hack and is only a convenience to those wishing to use traditional `fn(req, res)` functions and middleware within Koa.

- ctx.cookies.get(name, [options])

Get cookie `name` with `options`: `signed` the cookie requested should be signed
koa uses the [cookies](https://github.com/pillarjs/cookies) module where options are simply passed.

- ctx.cookies.set(name, value, [options])

Set cookie `name` to `value` with `options`:

  - `signed` sign the cookie value
  - `expires` a `Date` for cookie expiration
  - `path` cookie path, `/'` by default
  - `domain` cookie domain
  - `secure` secure cookie
  - `httpOnly` server-accessible cookie, __true__ by default

koa uses the [cookies](https://github.com/jed/cookies) module where options are simply passed.


- Request aliases

The following accessors and alias `Request` equivalents:

Method delegation

  - `ctx.acceptsLanguages()`
  - `ctx.acceptsEncodings()`
  - `ctx.acceptsCharsets()`
  - `ctx.accepts()`
  - `ctx.get()`
  - `ctx.is()`

Accessor - Getter/Setter

  - `ctx.querystring`
  - `ctx.idempotent`
  - `ctx.socket`
  - `ctx.search`
  - `ctx.method`
  - `ctx.query`
  - `ctx.path`
  - `ctx.url`

Getter

  - `ctx.href`
  - `ctx.subdomains`
  - `ctx.protocol`
  - `ctx.host`
  - `ctx.hostname`
  - `ctx.header`
  - `ctx.headers`
  - `ctx.secure`
  - `ctx.stale`
  - `ctx.fresh`
  - `ctx.ips`
  - `ctx.ip`
  - `ctx.originalUrl`

- Response aliases

The following accessors and alias `Response` equivalents:

Method delegation

  - `ctx.attachment()`
  - `ctx.redirect()`
  - `ctx.remove()`
  - `ctx.set()`

Accessor - Getter/Setter

  - `ctx.status`
  - `ctx.message`
  - `ctx.body`
  - `ctx.length`
  - `ctx.type`
  - `ctx.lastModified`
  - `ctx.etag`

Getter

  - `ctx.headerSent`
  - `ctx.writable`

#### [delegates](https://github.com/tj/node-delegates)

Both Request aliases and Response aliases use Nodejs method and accessor delegation utility - `delegates`

```js
// usage example
delegate(proto, 'request')
  .method('accepts')
  .access('body')
  .getter('header')
```

API include

* Delegate(proto, prop)

Creates a delegator instance used to configure using the prop on the given proto object. (which is usually a prototype)

* Delegate.method(name)

Allows the given method name to be accessed on the host.

* Delegate.access(name)

Creates an "accessor" (ie: both getter and setter) for the property with the given name on the delegated object.

* Delegate.getter(name)

Creates a "getter" for the property with the given name on the delegated object.

* Delegate.setter(name)

Creates a "setter" for the property with the given name on the delegated object.

* Delegate.fluent(name)

A unique type of "accessor" that works for a "fluent" API. When called as a getter, the method returns the expected value. However, if the method is called with a value, it will return itself so it can be chained.

```js
// usage with `fluent`
delegate(proto, 'request')
  .fluent('query');

// getter
var q = request.query();

// setter (chainable)
request
  .query({ a: 1 })
  .query({ b: 2 });
```

3. Request

A Koa Request object is an abstraction on top of node's vanilla request object, providing additional functionality that is useful for every day HTTP server development.

- request.header   (Getter)

Request header object. return Object. (`this.req.headers`)

- request.headers    (Getter)

Request header object. Alias as request.header. return Object. (`this.req.headers`)

- request.url=   (Getter & Setter)

Get/Set request URL. Set is useful for url rewrites. (`this.req.url [= val]`)

- request.href  (Getter)

Get full request URL, include `protocol`, `host` and `url`. (`this.protocol + '://' + this.host + this.originalUrl`)

```js
this.request.href   // => http://example.com/foo/bar?q=1
```

- request.method=   (Getter & Setter)

Get/Set request method. Set is useful for implementing middleware such as `methodOverride()`.
return String. (`this.req.method [= val]`)

- request.path=   (Getter & Setter)

Get/Set request pathname. Set is useful for retaining query-string when present.

```js
// Getter source code and return String
get path() {  return parse(this.req).pathname; }

// Setter source code
set path(path) {
  // from [parseurl](https://github.com/pillarjs/parseurl) module
  // Parse the URL of the given request object (looks at the req.url property) and return the result.
  var url = parse(this.req);
  // modify the `pathname` property of parsed `url`. No monkey patching needed
  url.pathname = path;
  // Set request pathname and retain query-string when present.
  this.url = stringify(url);
},
```

- request.query=   (Getter & Setter)

Get parsed query-string, returning an empty object when no query-string is present. Note that this getter does not support nested parsing.  Ex: "color=blue&size=small"  => `{ color: 'blue', size: 'small' }`
Set query-string to the given object. Note that this setter does not support nested objects.  Ex: `this.query = { next: '/login' };`

```js
// Setter source code
set query(obj) {
  // querystring.stringify(obj, [sep], [eq]). `qs` is native `node` package. Serialize an object to a query string.
  // ex: querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })   // 'foo=bar&baz=qux&baz=quux&corge='
  this.querystring = qs.stringify(obj);
}
```

- request.querystring=   (Getter & Setter)

Get raw query string void of `?`. Set raw query string.

```js
// Getter source code and return String
get querystring() {  return parse(this.req).query || ''; }

// Setter source code
set querystring(str) {
  // See `set path(path)` source code comment
  var url = parse(this.req);
  // modify the `search` property of parsed `url`. No monkey patching needed
  url.search = str;
  this.url = stringify(url);
}
```

- request.search=   (Getter & Setter)

Get raw query string with the `?`. Same as `request.querystring` except it includes the leading `?`.
Set raw query string or search string. Same as `response.querystring=` but included for ubiquity.

- request.host   (Getter)

Parse/Get the "Host" header field `host` (hostname:port) when present. Supports `X-Forwarded-Host` when `app.proxy` is true/enabled, otherwise Host is used. return {String} hostname:port

- request.hostname   (Getter)

Parse/Get the "Host" header field hostname when present. Supports `X-Forwarded-Host` when `app.proxy` is true/enabled, otherwise Host is used. @return {String} hostname. `[this|request].host.split(':')[0];`

- request.fresh   (Getter)

Check if a request cache is "fresh", aka the contents have not changed or Last-Modified and/or the ETag still match. return {Boolean}
This method is for cache negotiation between `If-None-Match` / `ETag`, and `If-Modified-Since` and `Last-Modified`. It should be referenced after setting one or more of these response headers.

```js
this.set('ETag', '123');

// cache is ok
if (this.fresh) {
  this.status = 304;
  return;
}

// cache is stale
// fetch new data
this.body = yield db.find('something');
```

- request.stale   (Getter)

Inverse of `request.fresh`. Check if the request is stale, aka "Last-Modified" and / or the "ETag" for the resource has changed.
return {Boolean}   `return !this.fresh;`

- request.idempotent   (Getter)

Check if the request is idempotent. return {Boolean}

```js
// Getter source code
get idempotent() {
  var methods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
  // `~` applied in front of Array.  It is a bitwise `NOT` operator in Javascript itself
  // `~$.inArray("foo", bar)`  is short for  `$.inArray("foo", bar) !== -1`
  // since `~` operator will return `0` for false, `-1` for true, need to convert to Boolean by `!!`
  return !!~methods.indexOf(this.method);
}
```

- request.socket   (Getter)

Return the request socket. return {Connection}  `this.req.socket`

- request.charset   (Getter)

Get request charset when present, or `undefined`

```js
// usage
this.request.charset   // => "utf-8"

// Getter source code
get charset() {
  var type = this.get('Content-Type');
  if (!type) return;
  // [typer](https://github.com/jshttp/media-typer)
  // typer.parse(string). Parse a media type string. This will return an object with the following properties: type, subtype, suffix, parameters
  return typer.parse(type).parameters.charset;
}
```

- request.length   (Getter)

Return request `Content-Length` as a number when present, or `undefined`.  return {Number}

```js
// Getter source code
get length() {
  var len = this.get('Content-Length');
  if (null == len) return;
  // `~~` is a double NOT bitwise operator.
  // It is used as a faster substitute for `Math.floor()`.
  // it differs from .floor() in that it actually just removes anything to the right of the decimal.
  //  This makes a difference when used against a negative number.
  //  it will always return a number, and will never give you `NaN`. If it can't be converted to a number, you'll get 0.
  return ~~len;
},
```

- request.protocol   (Getter)

Return request protocol string, either "https" or "http" when requested with TLS. return String.
When `app.proxy` is true/enabled, the "X-Forwarded-Proto" header field will be trusted.
If you're running behind a reverse proxy that supplies https for you this may be enabled.

- request.secure   (Getter)

Shorthand for `this.protocol == "https"` to check if a request was issued via TLS.

- request.ip   (Getter)

Request remote address. Supports `X-Forwarded-For`, return the upstream address when `app.proxy` is true/enabled.
return String.  (`return this.ips[0] || this.socket.remoteAddress;`)

- request.ips   (Getter)

When X-Forwarded-For is present and app.proxy is enabled an array of these ips is returned, ordered from upstream -> downstream. When disabled an empty array is returned.

When `app.proxy` is `true`/`enabled`, parse the "X-Forwarded-For" ip address list. For example if the value were "client, proxy1, proxy2", you would receive the array `["client", "proxy1", "proxy2"]` where "proxy2" is the furthest down-stream. return {Array}

- request.subdomains   (Getter)

Return `subdomains` as an array.

Subdomains are the dot-separated parts of the host before the main domain of the app. By default, the domain of the app is assumed to be the last two parts of the host. This can be changed by setting `this.app.subdomainOffset`.

For example, if the domain is "tobi.ferrets.example.com"
If `app.subdomainOffset` is not set, this.subdomains is ["ferrets", "tobi"].
If `app.subdomainOffset` is 3, this.subdomains is ["tobi"].

#### Content Negotiation

  Koa's `request` object includes helpful content negotiation utilities powered by [accepts](http://github.com/expressjs/accepts) and [negotiator](https://github.com/federomero/negotiator). These utilities are:

- `request.accepts(types)`
- `request.acceptsEncodings(types)`
- `request.acceptsCharsets(charsets)`
- `request.acceptsLanguages(langs)`

If no types are supplied, __all__ acceptable types are returned.

If multiple types are supplied, the best match will be returned. If no matches are found, a `false` is returned, and you should send a `406 "Not Acceptable"` response to the client.

In the case of missing accept headers where any type is acceptable, the first type will be returned. Thus, the order of types you supply is important.

- request.accepts(types)   (Method)

Check if the given `type(s)` is acceptable, returning the best match when true, otherwise `undefined`, in which case you should respond with 406 "Not Acceptable". return {String|Array|Boolean} (`this.accept.types.apply(this.accept, arguments)`)

The `type` value may be a single mime type string such as "application/json", the extension name such as "json" or an array `["json", "html", "text/plain"]`. When a list or array is given the _best_ match, if any is returned.

```js
// some examples
this.accepts('html');  // => "html"   // Accept: text/html

// Accept: text/*, application/json
this.accepts('html');   // => "html"
this.accepts('text/html');  // => "text/html"
this.accepts('json', 'text');  // => "json"
this.accepts('application/json');   // => "application/json"

// Accept: text/*, application/json
this.accepts('image/png');
this.accepts('png');  // => undefined

// Accept: text/*;q=.5, application/json
this.accepts(['html', 'json']);
this.accepts('html', 'json');  // => "json"

// No Accept header
this.accepts('html', 'json');   // => "html"
this.accepts('json', 'html');   // => "json"
```

You may call this.accepts() as many times as you like, or use a switch:

```js
switch (this.accepts('json', 'html', 'text')) {
  case 'json': break;
  case 'html': break;
  case 'text': break;
  default: this.throw(406, 'json, html, or text only');
}
```

- request.acceptsEncodings(encodings)  (Method)

Check if `encodings` are acceptable, returning the best match when true, otherwise `false`. Note that you should include `identity` as one of the encodings! return {String|Array}  (`this.accept.encodings.apply(this.accept, arguments)`)

```js
// Accept-Encoding: gzip
this.acceptsEncodings('gzip', 'deflate', 'identity');   // => "gzip"

this.acceptsEncodings(['gzip', 'deflate', 'identity']);  // => "gzip"
```

When no arguments are given all accepted encodings are returned as an array:

```js
// Given `Accept-Encoding: gzip, deflate`  an array sorted by quality is returned:
this.acceptsEncodings();   // => ["gzip", "deflate", "identity"]
```

Note that the `identity` encoding (which means no encoding) could be unacceptable if the client explicitly sends `identity;q=0`. Although this is an edge case, you should still handle the case where this method returns `false`.

- request.acceptsCharsets(charsets)  (Method)

Check if `charsets` are acceptable, returning the best match when `true`, otherwise `false`.
return {String|Array}  (`this.accept.charsets.apply(this.accept, arguments)`)

```js
// Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
this.acceptsCharsets('utf-8', 'utf-7');   // => "utf-8"

this.acceptsCharsets(['utf-7', 'utf-8']);  // => "utf-8"
```

When no arguments are given all accepted charsets are returned as an array:

```js
// Given Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5, an array sorted by quality is returned:
this.acceptsCharsets();   // => ["utf-8", "utf-7", "iso-8859-1"]
```

- request.acceptsLanguages(langs)  (Method)

Check if `langs` are acceptable, returning the best match when true, otherwise false.
return {Array|String}  (`this.accept.languages.apply(this.accept, arguments)`)

```js
// Accept-Language: en;q=0.8, es, pt
this.acceptsLanguages('es', 'en');  // => "es"

this.acceptsLanguages(['en', 'es']);  // => "es"
```

When no arguments are given all accepted languages are returned as an array:

```js
// Given `Accept-Language: en;q=0.8, es, pt` an array sorted by quality is returned:
this.acceptsLanguages();  // => ["es", "pt", "en"]
```

- request.is(types...)  (Method)

Check if the incoming request contains the "Content-Type" header field, and it contains any of the give mime `type`s.
Checked by [type-is](https://github.com/jshttp/type-is/blob/master/index.js)
If there is no request body, `undefined` is returned.
If there is no content type, or the match fails `false` is returned.
Otherwise, it returns the matching content-type.

```js
// With Content-Type: text/html; charset=utf-8
this.is('html'); // => 'html'
this.is('text/html'); // => 'text/html'
this.is('text/*', 'text/html'); // => 'text/html'

// When Content-Type is application/json
this.is('json', 'urlencoded'); // => 'json'
this.is('application/json'); // => 'application/json'
this.is('html', 'application/*'); // => 'application/json'

this.is('html'); // => false
```

For example if you want to ensure that only images are sent to a given route:

```js
if (this.is('image/*')) {
  // process
} else {
  this.throw(415, 'images only!');
}
```

- request.type  (Getter)

Get request "Content-Type", return the request mime type void of parameters such as "charset".
return {String}   (`this.get('Content-Type').split(';')[0]`)

```js
// example
var ct = this.request.type;     // => "image/png"
```

- request.get(field)  (Method)

Return request header. Note: The `Referrer` header field is special-cased, both `Referrer` and `Referer` are interchangeable.
Return {String}  (`req.headers[field]`)

```js
// Example
this.get('Content-Type');    // => "text/plain"
this.get('content-type');     // => "text/plain"
this.get('Something');         // => undefined
```

- request.inspect()   (Method)

Return JSON representation of `this.method`, `this.url`, `this.header`

```js
method: this.method,
url: this.url,
header: this.header
```

4. Response

A Koa Response object is an abstraction on top of node's vanilla response object, providing additional functionality that is useful for every day HTTP server development.

- response.socket   (Getter)

return Request socket.   return {Connection}  (`this.ctx.req.socket`)

- response.header    (Getter)

return Response header object.  return {Object}  (`this.res._headers || {}`)

- response.status=     (Getter & Setter)

Get response status. By default, `response.status` is not set unlike node's `res.statusCode` which defaults to `200`.  Return Number, (`this.res.statusCode`)

Set response status via numeric code, code value below:

  - 100 "continue"
  - 101 "switching protocols"
  - 102 "processing"
  - 200 "ok"
  - 201 "created"
  - 202 "accepted"
  - 203 "non-authoritative information"
  - 204 "no content"
  - 205 "reset content"
  - 206 "partial content"
  - 207 "multi-status"
  - 300 "multiple choices"
  - 301 "moved permanently"
  - 302 "moved temporarily"
  - 303 "see other"
  - 304 "not modified"
  - 305 "use proxy"
  - 307 "temporary redirect"
  - 400 "bad request"
  - 401 "unauthorized"
  - 402 "payment required"
  - 403 "forbidden"
  - 404 "not found"
  - 405 "method not allowed"
  - 406 "not acceptable"
  - 407 "proxy authentication required"
  - 408 "request time-out"
  - 409 "conflict"
  - 410 "gone"
  - 411 "length required"
  - 412 "precondition failed"
  - 413 "request entity too large"
  - 414 "request-uri too large"
  - 415 "unsupported media type"
  - 416 "requested range not satisfiable"
  - 417 "expectation failed"
  - 418 "i'm a teapot"
  - 422 "unprocessable entity"
  - 423 "locked"
  - 424 "failed dependency"
  - 425 "unordered collection"
  - 426 "upgrade required"
  - 428 "precondition required"
  - 429 "too many requests"
  - 431 "request header fields too large"
  - 500 "internal server error"
  - 501 "not implemented"
  - 502 "bad gateway"
  - 503 "service unavailable"
  - 504 "gateway time-out"
  - 505 "http version not supported"
  - 506 "variant also negotiates"
  - 507 "insufficient storage"
  - 509 "bandwidth limit exceeded"
  - 510 "not extended"
  - 511 "network authentication required"

```js
// Setter source code
set status(code) {
  assert('number' == typeof code, 'status code must be a number');
  assert(statuses[code], 'invalid status code: ' + code);
  this._explicitStatus = true;
  this.res.statusCode = code;
  this.res.statusMessage = statuses[code];
  if (this.body && statuses.empty[code]) this.body = null;
}
```

- response.message=     (Getter & Setter)

Get response status message. By default, `response.message` is associated with `response.status`.
return {String}  (`this.res.statusMessage || statuses[this.status]`)

Set response status message to the given value.  (`this.res.statusMessage = msg;`)

- response.body=     (Getter & Setter)

Get response body.  return {Mixed}  (`this._body`)

Set response body to one of the following:  `string` written, `Buffer` written, `Stream` piped, `Object` json-stringified,
`null` no content response

If response.status has not been set, Koa will automatically set the status to 200 or 204.

```js
  // no content
  if (null == val) {
    if (!statuses.empty[this.status]) this.status = 204;
    ...
  }

  if (!this._explicitStatus) this.status = 200;
```

- response.length=     (Getter & Setter)

Return response "Content-Length" as a number when present, or deduce from `this.body` when possible, or undefined.

Set response Content-Length to the given value.  return Number  (`this.set('Content-Length', n);`)

- response.headerSent    (Getter)

Check if a response header has already been sent or Check if a header has been written to the socket.. Useful for seeing if the client may be notified on error.  return {Boolean}  (`this.res.headersSent`)

- response.vary(field)   (Method)

Vary on `field`. based on module [vary](https://github.com/jshttp/vary) which Manipulate the HTTP Vary header.
`vary(res, field)` Adds the given header field to the `Vary` response header of res. This can be a string of a single field, a string of a valid Vary header, or an array of multiple fields.

- response.redirect(url, [alt])    (Method)

Perform a [302] redirect to `url`. The string "back" is special-cased to provide Referrer support, when Referrer is not present `alt` or "/" is used.

```js
this.redirect('back');
this.redirect('back', '/index.html');
this.redirect('/login');
this.redirect('http://google.com');
```

To alter the default status of `302`, simply assign the status before or after this call. To alter the body, assign it after this call:

```js
this.status = 301;
this.redirect('/cart');
// this.status = 301;   // <= or after the redirect call
this.body = 'Redirecting to shopping cart';   // optionally alter the body
```

- response.attachment([filename])    (Method)

Set "Content-Disposition" to "attachment" to signal the client to prompt for download. Optionally specify the filename of the download.

- response.type=  (Getter & Setter)

Get response "Content-Type" void of parameters such as "charset".  ex: `"image/png"`  (`this.get('Content-Type').split(';')[0]`)

Set Content-Type response header with `type` through `mime.lookup()` when it does not contain a charset. Set response Content-Type via mime string or file extension.

```js
this.type = 'text/plain; charset=utf-8';
this.type = 'image/png';
this.type = '.png';
this.type = 'png';
```

Note: when appropriate a charset is selected for you, for example `response.type = 'html'` will default to "utf-8", however when explicitly defined in full as response.type = 'text/html' no charset is assigned.

- response.lastModified=  (Getter & Setter)

Return the `Last-Modified` header as a Date, if it exists.  return {Date}  (`new Date( this.get('last-modified') )`)

Set the Last-Modified header as an appropriate UTC string. You can either set it as a Date or date string.

```js
this.response.lastModified = new Date();
this.response.lastModified = '2013-09-13';
```

- response.etag=  (Getter & Setter)

Get the ETag of a response.  return {String}  (`this.get('ETag')`)

Set the ETag of a response including the wrapped `"`s. This will normalize the quotes if necessary.

```js
this.response.etag = 'md5hashsum';
this.response.etag = '"md5hashsum"';
this.response.etag = 'W/"123456789"';
this.response.etag = crypto.createHash('md5').update(this.body).digest('hex');
```

- response.is(types...)    (Method)

Check whether the response is one of the listed types. Very similar to `this.request.is()`. Check whether the response type is one of the supplied types. This is particularly useful for creating middleware that manipulate responses.  return {String|false}.   Based on [type-is](https://github.com/jshttp/type-is) module

For example, this is a middleware that minifies all HTML responses except for streams.

```js
var minify = require('html-minifier');

app.use(function *minifyHTML(next){
  yield next;

  if (!this.response.is('html')) return;

  var body = this.body;
  if (!body || body.pipe) return;

  if (Buffer.isBuffer(body)) body = body.toString();
  this.body = minify(body);
});
```

- response.get(field)    (Method)

Get a response header field value with case-insensitive field. Mainly for Return response header.  (`this.header[field.toLowerCase()]`)

```js
this.get('Content-Type');  // => "text/plain"
this.get('content-type');   // => "text/plain"
var etag = this.get('ETag');
```

- response.set(field, value) | response.set(fields)   (Method)

Set header `field` to `val`, or set several response header fields with an object.

```js
this.set('Foo', ['bar', 'baz'])
this.set('Accept', 'application/json')
// or pass an Object
this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
```

- response.remove(field)    (Method)

Remove header `field`.  (`this.res.removeHeader(field);`) // `removeHeader` coming from `node` response object

- response.writable   (Getter)

Checks if the request is writable. Tests for the existence of the socket as node sometimes does not set it.  return {Boolean}   Private getter.   (`this.res.socket.writable;`)

- response.inspect

Inspect implementation. calling `response.toJSON` Return JSON representation. Have three properties below

```js
status: this.status,
message: this.message,
header: this.header
```




### Example

1. Co-mock work with MongoDB

store the data from a post into a Mongo-database using Monk via the coroutine library Co-Monk (which is the simplest way to access MongoDb with generators right now):

```js
// Create the application
var koa = require('koa');
var route = require('koa-route');
var parse = require('co-body');
var app = module.exports = koa();

// Get monk up an running
// set up Monk, and use it with "mongodb generator goodness for co" via co-monk.
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/koausers');
var users = wrap(db.get('users'));

// Set up some routes
app.use(route.post('/user', create));
app.use(route.get('/user', list));

// And here is the handling code
function *create() {
    // Parse the user from the posted data
    // using the co-body package
    // if that should take time, so we yield the response. Koa can let other execute in the meantime. Just like for a callback. But without the callback.
    var user = yield parse(this);
    user.created_on = new Date;

    // Store it in database
    try
    {
        //  store the object in mongo. And better yield there too since that might take time, or at least is IO.
        this.body = yield users.insert(user);
        this.status = 201;
    }
    catch(e)
    {
        this.body = "An error occured: " + e;
        this.status = 401;
    }
};

function *list() {
  //yield the result from our, very simple, Mongo query.
  var res = yield users.find({});
  this.body = res;
};

// fire it up
app.listen(3000);
console.log("Post to http://localhost:3000/user to store new stuff");
console.log("Get from http://localhost:3000/user to see your users");

```

Here is how to add the user

```bash
curl -X POST -H "Content-Type: application/json" -d '{"username":"marcusoft.net@gmail.com","password":"xyz"}' http://localhost:3000/user -v
curl -X POST -H "Content-Type: application/json" -d '{"username":"hugo@gmail.com","password":"xyz^2"}' http://localhost:3000/user -v
curl -X POST -H "Content-Type: application/json" -d '{"username":"abbe@gmail.com","password":"zyx"}' http://localhost:3000/user -v

# see the results
curl http://localhost:3000/user -v
```
