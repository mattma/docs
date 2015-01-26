# KOA

[Intro](#intro)
[Koa vs Express](#koavsexpress)
[API](#api)
[KOA wiki](https://github.com/koajs/koa/wiki) includes list of resources.

> Koa aims to be smaller, more expressive, and more robust foundation for web applications and APIs. Through leveraging generators Koa allows you to ditch callbacks and greatly increase error-handling. Koa does not bundle any middleware within core, and provides an elegant suite of methods that make writing servers fast and enjoyable.

## Intro

Koa is a minimalist node.js web framework, uses ES6 generators for better Async(/Await<=future) control flow (by using `co`) and robust error handling (with `try/catch` support). It is extremely modular, meaning every module does one thing well and nothing more. It simplied nodejs async programming, building apps is much more semantic, is a truly expressive framework, which allow you to write your app without relying on the features of framework. No depending on "an API for that".

Before learning koa, you need to know Promises, Generators, Modular, HTTP. Some great use cases: APIs (JSON 1st citizen), promise-based model (MVC), complex and/or unconventional sites.

#### Koa(co) control flow

Koa removes need for callbacks but still have uses non-blocking code. How is that possible?

when the code encounters a `yield` statement, it suspends execution indefinitely, and doesn't start again until you tell it to.

A function becomes a generator function when you have at least one `yield` in it. And you need to add the asterisk, create a instance of the generator function, then get the next element in the sequence by calling `next()`.

At its simplest form, a generator represents a sequence of values - essentially it is an iterator. In fact, the interface of a generator object is a just an iterator for which you'd keep calling `next()` on it until it runs out of values. It's like iterating through the return values of the function.

#### Async, control flow, data structure

Generator allow you to dynamically alter the content of the array based on stuff being passed in or to return lazy (read: infinite) sequences. But they aren't async and they don't manage control flow.

Then why would you call generators "control flow management" because you can pass one into `co`. `co(doStuff());`

If you want to do something async, you need category 1 (an abstraction of async behavior). To make it nicer, category 2 (control flow management) can be helpful. And more often than not category 2 will require you to use known data structures from category 3.

- Models/Abstractions for async behavior: thunks+callbacks, promises
- Control flow management: co, async, spawn/ES7 async functions, Promise.all
- Data structures: arrays, generators, objects/maps

`yield` provides a hint where asynchronicity can occur. This is flow control. Also, the `try..catch` is flow control. `yield` and `try..catch` allow the generator to be async-capable. generator separate the flow control logic (which is expressed in a nice, natural, synchronous way) from the implementation details of how the generator is run to completion (which can either be synchronous or asynchronous). Generators let you think about each of those two pieces independently.

That "magical" combination where promises improve the flow-control expressivity of generators... is, I think, why we already see the ES7 async / await on such a solid track even before ES6 is fully ratified. We've already realized that both promises and generators offer parts of the "solution to JS async coding", and putting them together is our best path forward.

Generators are routines ("semicoroutines" to be precise) and they don't have underlying data. They just provide the strategy to iterate over the quantity of any nature.


## Key concepts

#### Middleware: cascading middlewares

A single function can encapsulate the entire intent of the middleware. The middleware function yields "downstream" to whatever is passed in as `next` and when that function (and any functions it yields to) has finished, then control flows back "upstream".

The order of middleware is very important, It is like building a christmas tree with decorations from bottom, then up. **Build from the bottom(add more business logic) and up**

```js
    app.use(require('koa-compress')());     // <= 4th, final gzip
    app.use(require('koa-static')());           // <= 3rd, serve all static files

    app.user(myCustomBusinessLogic2);  // <= 2nd, add more business logic
    app.user(myCustomBusinessLogic1);  // <= 1st, Always start with business logic
```

#### Sane error handling

Error handling is done using `try/catch` (except with event emitters) instead of node's callback error handling style `if (err) callback(err)`.

Error handlers are simply decorators that you add to the top of your middleware stack. Each Koa app is an EventEmitter instance. All errors uncaught by any middleware are sent to `app.on('error', function (err, context) {})`. This is useful for logging. However, if you create your own error handler (i.e. catching it), you will have to manually emit these events yourself.

No need to worry about error handling. Koa handle errors automatically when you every time do `this.response.body`. No need to use domains(deprecated) like Hapi.js.

```js
function errorHandler() {
  return function* (next) {
    // try catch all downstream errors here
    try {
      yield next; //pass on the execution to downstream middlewares
    } catch (err) { //executed only when an error occurs & no other middleware responds to the request
      // set respose status
      this.status = err.status || 500;
      this.type = 'json'; //optional here
      // set response body. since it is an object, will set type automatically
      this.body = { 'error' : 'The application just went bonkers, hopefully NSA has all the logs ;) '};
      console.error(err.stack);
      //delegate the error back to application
      this.app.emit('error', err, this);
    }
  };
}
// Usage
app.use(errorHandler());
```

Use `try/catch`. All errors will be caught, unless you throw errors on different ticks like so:

```js
app.use(function* () {
  setImmediate(function () {
    throw new Error('this will not be caught by koa and will crash your process')
  })
})
```

Don't do that! Write your code in generators, promises, or unnested callbacks and you'll be fine.

Koa catches blatant errors and properly return a `500` status error to the client. App doesn’t crash. It doesn’t need a module like `forever` to restart it.

You can slo call `this.throw` with any message and status code, and Koa will pass it along to the client.

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

- Eror handling with a real world exmaple

Error handling is nicely baked into Koa. Everything is logged to standard output (`stderr`) excet`NODE_ENV` is "test". But you can easily create a global error hook to do your own error handling. Just do `app.on('err', function(err){})`;

Another thing that happens automatically is that a HTTP status `500` is returned to the client. Look at example below

```js
var app = module.exports = require('koa')();
// middleware order is very important here
// error propagation!
app.use(function *(next){  // <= 1st, set up a `try..catch` around all the middlewares and requests.
  try {      // <= 2nd, Request comes in and is handled by "try" and "catch all routes"
    yield next;
  } catch (err) {  // <= 5th, handle the error manually
    this.status = err.status || 500;
    this.type = 'html';
    this.body = '<p>Something <em>exploded</em>, please contact admin.</p>';
    // since we handled this manually we'll want to delegate to the regular app
    // level error handling as well so that centralized still functions correctly.
    this.app.emit('error', err, this);  // <= 6th, emits an error event, which triggers the `app.on('error')` subscription
  }
});

// response on every single route (all calls in this application)
app.use(function *(){  // <= 3rd, This function throws an error
  throw new Error('boom boom');  // <= 4th, That is caught by the `try..catch` function (upstream)
});

// global error handler
app.on('error', function(err){  // <= 7th, logs the error.
  if (process.env.NODE_ENV != 'test') {
    console.log('sent error %s to the cloud', err.message);
  }
});

if (!module.parent) app.listen(3000);
```

Write a test for above error handling

```js
//  get a reference to the application. by just require the application
var app = require('./app');
//  sets up a supertest request object by creating a supertest agent and listening to the application.
var request = require('supertest').agent(app.listen());

describe('Errors', function () {
  it('should catch the error', function(done){
    request
      .get('/')
      .expect(500)
      .expect('Content-Type', /text\/html/, done);
  });

  // the code we're testing both returned a nicely formatted error but also emitted an error event
  it('should emit the error on app', function(done){
    // now setup an subscription for the "error" event. But it should happens only once.
    app.once('error', function (err, ctx) {
        // Once it happens we check the .message of the passed in err-parameter.
      err.message.should.equal('boom boom');
      // We also get the context (ctx) passed in and can check the status of that.
      ctx.should.be.ok;
      done();
    });

    request
      .get('/')
      .end(function(){});
  })
})
```

####  [Superior stream handling](http://www.jongleberry.com/koa.html)

Koa has better stream handling via [destroy](https://github.com/stream-utils/destroy) and [on-finished](http://github.com/jshttp/on-finished). Both koa and express use the same modules.

```js
app.use(require('koa-compress')())
app.use(function* () {
  this.type = 'text/plain'
  this.body = fs.createReadStream('filename.txt')
})
```

Since you simply pass the stream to Koa instead of directly piping, Koa is able to handle all these cases for you. You won't need to use `domains` as `no uncaught exceptions` will ever be thrown. Don't worry about any leaks as Koa handles that for you as well. You may treat streams essentially the same as strings and buffers, which is one of the main philosophies behind Koa's abstractions. In other words, Koa tries to fix all of node's broken stuffs. Don't ever use `.pipe()` unless you know what you're doing. It's broken. Let Koa handle streams for you.


####  Superior, callback-less/generator-based control flow

Koa uses generator engine `co`, can write asynchronous code in "synchronous" style, there's no more callback hell. Write your libraries using generators, promises, or return thunks. `co`'s control flow handling isn't about eliminating callbacks. You can also execute multiple asynchronous tasks in parallel and in series without calling a function.

```js
// executed three asynchronous functions in parallel.
// No need for addtional library like `async`
app.use(function* () {
  yield [fn1, fn2, fn3]
})
```

####  Lazy evaluation - yield

Lazy evaluation is already possible with JavaScript using closure tricks and the like, but its greatly simplified now with `yield`. By suspending execution and resuming at will, we are able to pull values only when we need to.

`yield` is a keyword specific to generators and allows users to **arbitrarily suspend** functions at any `yield` point. `yield` is not a magical async function - `co` does all that magic behind the scenes.

You can think of co's use of generators like this with node callbacks:

```js
function* () {
  var val = yield /* breakpoint */ function (next) {
    // #pause at the break point

    // execute an asynchronous function
    setTimeout(function () {
      next(null, 1); // return the value node.js callback-style
    }, 100);
  }

  assert(val === 1);
}
```

#### Content negotiation

An important part of `HTTP` servers is content negotiation. Perhaps the most important is `Accept-Encoding` and `Content-Encoding`, which negotiates whether to compress content. This is the only `Accept` header supported by most CDNs.

In Koa, `this.request.acceptsEncodings()` does all the content negotiation for you. Remember, if you compress your body, you should set the `Content-Encoding` header.

You **do not** want to do anything like `if (~this.request.headers['accept-encoding'].indexOf('json'))`. These headers are very complex, and this type of logic is not specification-compliant. Use the `this.request.accepts()`-type methods.

```js
/**
 * This is a promisified version of zlib's gzip function,
 * allowing you to simply `yield` it without "thunkifying" it.
 */
var gzip = require('mz/zlib').gzip;
// send `hello world` gzipped or not gzipped (identity) based on server accepts
app.use(function* () {
  if(this.request.acceptsEncodings('gzip')) {
    this.response.set('Content-Encoding', 'gzip');
    this.body = yield gzip('hello world');
  } else {
    this.body = 'hello world';
  }
})
```


#### Content Header

Both a request and a response could have various content headers. Some of these are: `Content-Type`, `Content-Length`, `Content-Encoding`, etc. Koa has getters/setters for `type` and `length` like those: `this.request.type`, `this.request.length`, `this.response.type`, `this.response.length`

Inferring `this.request.type` is a little difficult. For example, how do you know if the request is text? You don't want to use a regular expression or try all the possible mime types. Thus, Koa has `this.request.is()` for you:

```js
this.request.is('image/*') // => image/png
this.request.is('text') // => text or false
```


## Koa vs Express

Philosophically, Koa aims to "fix and replace node", whereas Express aims to "augments node".

Koa uses `co` to get rid apps of callback hell and simplify error handling. It exposes its own `this.request` and `this.response` objects instead of node's `req` and `res` objects.

Express augments node's `req` and `res` objects with additional properties and methods and includes many other "framework" features, such as routing and templating, which Koa does not.

Koa can be viewed as an abstraction of node.js's http modules.
Express is an application framework for node.js.

Koa shares many middlewares along with Express. Koa won't replace Connect, it is just a different take on similar functionality.

unlike Express and node.js, Koa uses getters and setters instead of methods.
Unlike Express where you use node.js' `req` and `res` object, Koa exposes its own very similar `this.request` and `this.response` objects

- Error handling

Koa:        You handle it however and whenever you'd like

Express:  catch any error and try to do something about it


- Middleware

Koa:        warp all subsequent middleware. They yields "downstream", then control flows back "upstream".

Express:  pass control flow to the next middleware. pass control through series of functions until one returns.

In Express, the middleware stack was linear and you were in charge of explicitly calling the next middleware until the stack was empty and hopefully a response had been written to the response stream. Express middleware cannot change the response. ex: you cannot minify HTML responses, You cannot cache and re-serve responses, cannot execute async functions after a response is set.

In Koa, you yield control of the flow to the next middleware and wait until the flow returns to you. This effectively creates first an upward flow and consecutively a downward flow of control; it is ideally where the content of the response is determined at the peak. This behavior is useful, because now middleware can serve an extended purpose, both before the peak and after the peak.


- Node's Request and response

Koa: abstracts node's request and response objects so no monkey patching is required (provide proper stream handling), and uses generators for better async control flow. Generators allow us to write code with less callbacks.

Express:  uses node's original req and res objects. Properties have to be overwritten for middleware to work properly. For example, if you look at the compression middleware, you'll see that res.write() and res.end() are being overwritten. In fact, a lot of middleware are written like this. And it's ugly. Thanks to Koa's abstraction of node's req and res objects, this is not a problem.

**Koa Request Response Pattern**

The key to making solid Node web applications is to realise and exploit the fact Node speaks HTTP. Those `req` and `res` objects are there for a reason: Express and similar frameworks are built on Node’s `http` core module, and the http module’s API is based around these request and response objects. in terms of HTTP requests and responses is HTTP "functions" that take input and transform somehow.

A Koa Context encapsulates node’s request and response objects into a single object which provides many helpful methods for writing web applications and APIs.

While it’s true that Express decorates the request and response objects, Koa goes further by abstracting them. You can still get at the request and response, and there’s also a Koa request and response as well.

Notice that `this` is significant, Koa execute middleware from within a "context", because it makes sense semantically. The current context has aliases to commonly accessed request and response properties, so the average Koa middleware has less indirection and looks lean and clean.

Koa uses its own custom objects: `this`, `this.request`, and `this.response`. These objects abstract node's `req` and `res` objects with convenience methods and getters/setters. Generally, properties added to these objects must obey the following rules:

    * They must be either very commonly used and/or must do something useful
    * If a property exists as a setter, then it will also exist as a getter, but not vice versa

Many of `this.request` and `this.response`'s properties are delegated to `this`. If it's a getter/setter, then both the getter and the setter will strictly correspond to either `this.request` or `this.response`.

`Context` object holds all useful information. This makes for very succinct and terse code, since almost everything you need comes from the `context` and can be found on the `this` object.

    - `ctx.app` is the application instance for your application.
    - `ctx.request` is the Koa Request object. Note `ctx.req` is the Node request object.
    - `ctx.response` is the Koa Response object. Note`ctx.res` is the Node response object.


- Architecture

Koa: barebones and modular. It does not include any middleware, no bundled routing, no any convenience utility.

express: rich. express(connect) include several middlewares like routing solution, many convenience utilities (ex: send files).


- Koa relies less on middleware

For example, instead of a "body parsing" middleware, you would instead use a body parsing function.

Unlike Express and many other frameworks, Koa does not include a router. Without a router, routing in Koa can be done by using this.request.path and yield next. To check if the request matches a specific path:

```js
app.use(function* (next) {
  if (this.request.path === '/') {

  }
})

// To skip this middleware:
app.use(function* (next) {
  if (conditionTrue) return yield next;
})

// Combining this together, you can route paths like this:
app.use(function* (next) {
  // skip the rest of the code if the route does not match
  // `return` here is super important, it won't execute the code below
  if (this.request.path !== '/') return yield next;

  this.response.body = 'we are at home!';
})
```

By `return`ing early, we don't need to bother having any nested `if` and `else` statements. Note that we're checking whether the path **does not match**, then early returning.


## Source Code

- Application.js. understanding the meat of koa

When a request comes in, **Function F** (callback return function) is invoked and it takes node signature callback `return function(req, res){}`.
 **Function W** (co wrapped single middleware) is evaluated at the last line: `fn.call(ctx).catch(ctx.onerror)`.
 **Function W** will return a promise that is returned by `co` and its argument `fn.apply(this, arguments)` is actually `Iterator C` as we invoke fn (`Generator C`). This is exactly what `koa-compose` does, which Koa internally uses to create and dispatch the middleware stack.

```js
// `app.callback` will return an Function for `http.createServer`
// http.createServer(this.callback()).listen(...)

//Return a request handler callback for node's native http server.
app.callback = function(){
  // adds internal respond generator to `this.middleware`. Now mw is [respond, MW1, MW2, ...].
  var mw = [respond].concat(this.middleware);
  // [`compose`](https://github.com/koajs/compose) which Compose the given middleware array and return only One middleware.
  // API Syntax: `compose([a, b, c, ...])`
  // returns a **Generator C**, generator funtion, comprised of all those 4 above
  // **Function W**   co.wrap = function (fn) {  return function () { return co.call(this, fn.apply(this, arguments)); };   }
  var gen = compose(mw);
  // `co` warps **Generator C** into **Function W** that returns a promise.
  // This is a separate function so that every co() call doesn't create a new,unnecessary closure.
  var fn = co.wrap(gen);
  var self = this;

  if (!this.listeners('error').length) this.on('error', this.onerror);

  //will return **Function F**
  return function(req, res){
    res.statusCode = 404;
    // create context, context will contain an object with lots of useful properties
    // ex: `app, req, res, ctx, response, request, originalUrl, cookies, accept, state`
    var ctx = self.createContext(req, res);
    // avoid any possible fd leak
    // "finished" module execute a callback when a request closes, finishes, or errors to a `onFinished` function
    // ensure we close everything off in a nice, non-leaking fashion. Without callbacks of course
    onFinished(res, ctx.onerror);

    //  `co.wrap(all)(read('./ma.js'))` equal to  `co(all(read('./ma.js')))`
    //  here is to invoke fn.call(ctx) which is  co.wrap(gen).call(ctx)  equal to  co.wrap(gen)() and set context to ctx.
    //  `co` will return an Promise object, so it could reject with an error
    fn.call(ctx).catch(ctx.onerror);
  }
};
```

`http.createServer(this.callback()).listen(...)` is fired when server is initialized but the node callback **Function F** is not fired. `this.callback()` is invoked, then `fn` is a series of middlewares (generators) which is ready to transform the `req` and `res`.


- [co](https://github.com/tj/co) module

In `onFulfilled`, we call `Iterator C`'s `next` function. There is only one yield in `Generator C` and it delegates Generator `prev`.

After the loop, `prev` is `Iterator respond` and `Generator respond`'s argument `next` is `Iterator MW1`. The same thing, `Generator MW1`'s argument next is `Iterator MW2`, `Generator MW2`'s argument next is `Iterator MW3`, `Generator MW3`' doesn't have any arguments.

The difference between `Generator respond` and other generators is that it delegates `Generator MW1`, which means `yield *next` will run `Generator MW1` and go back to `onFulfilled` function after `yield next`.

As `yield next` in `Generator MW1`, it returns `Iterator MW2` as ret's value so after ret is passed to `co`'s next function, `ret.done` is `false` and in `toPromise` function,  ret's value `Iterator MW2` is passed to `co` function again like 1st time.

Iterator MW2's `next()` returns `Iterator MW3` when see yield in `Generator MW2`. `ret.done` is still false so `Iterator S3` is passed to `co` function, this time `ret.done` is true as no `yield` in `Generator MW3`.

Finally we can resolve this Promise. Back to the last level, it calls value.then(onFulfilled, onRejected) which Iterator `MW2's next()`, `ret.done` is true as well because only one `yield` in `Generator MW`2. And then back to `Iterator MW1` and Iterator respond.


- [koa-compose]((https://github.com/koajs/compose)) module

```js
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

## API

`koa`, the module itself, lightweight, it's just 4 files, averaging around 300 lines. Koa follows the tradition that every program you write must do one thing and one thing well. So you'll see, every good koa module (and every node module should be) is short, does one thing and builds on top of other modules heavily. You should keep this in mind and hack according to this. It will benefit everybody, you and others reading your code. You add the required features in the shape of small modules from npm to your app, and it does exactly what you need and in a way you need it.

`var koa = require('koa'); var app = koa();` creating a Koa app, this provides you an object, which can contain an array of generators (middlewares), executed in stack-like manner upon a new request.

Middleware in Koa are functions that handle requests. A server created with Koa can have a stack of middleware associated with it.

Cascading in Koa means, that the control flows through a series of middlewares. It yields downstream, then the control flows back upstream. To add a generator to a flow, call the `use` function with a generator.

When a new request comes in, it starts to flow through the middlewares, in the order you wrote them. When a middleware hits a yield next, it will go to the next middleware and continue that where it was left off. When there is no more middleware, we downstreamed, now we're starting to step back to the previous one (just like a stack). Then the first one ends, and we are streamed upwards successfully!

1. Application

A Koa application is an object containing an array of middleware generator functions which are composed and executed in a stack-like manner upon request. It includes methods for common tasks like content-negotiation, cache freshness, proxy support, and redirection among others. It has no middleware are bundled.

Application constructor is also Inherited from `Emitter.prototype`. `Application.prototype.__proto__ = Emitter.prototype;`. It could emit events.

##### Cascading

Koa middleware cascade: However with generators we can achieve "true" middleware. Contrasting Connect's implementation which simply passes control through series of functions until one returns, Koa yields "downstream", then control flows back "upstream".


Application Settings, which defined in `Application`'s constructor.

- app.name

optionally give your application a name

- app.env

defaulting to the `NODE_ENV` or "development"

- app.proxy

when true proxy header fields will be trusted

- app.subdomainOffset

offset of .subdomains to ignore, default to `2`

- app.listen(...)

A Koa application is not a 1-to-1 representation of a HTTP server. One or more Koa applications may be mounted together to form larger applications with a single HTTP server.

`app.listen(3000)` is a simple sugar for `http.createServer(app.callback()).listen(3000);`

This means you can spin up the same application as both HTTP and HTTPS or on multiple addresses:

```js
var http = require('http');
var koa = require('koa');
var app = koa();
http.createServer(app.callback()).listen(3000);
http.createServer(app.callback()).listen(3001);
```

- app.use(function)

Add the given middleware function to this application. Expect a generator function, then return Application itself.

- app.callback()

Return a request handler callback function suitable for the node's native http server,`http.createServer()` method to handle a request. You may also use this callback function to mount your koa app in a Connect/Express app.

- app.keys=

Set signed cookie keys. These are passed to [KeyGrip](https://github.com/jed/keygrip), however you may also pass your own `KeyGrip` instance. For example the following are acceptable:

```js
app.keys = ['im a newer secret', 'i like turtle'];
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');
```

These keys may be rotated and are used when signing cookies with the `{ signed: true }` option:

```js
this.cookies.set('name', 'tobi', { signed: true });
```

- app.inspect()

Return JSON representation. We only bother showing settings. `subdomainOffset` and `env`

#### Error Handling

By default outputs all errors to stderr unless **NODE_ENV** is "test". To perform custom error-handling logic such as centralized logging you can add an "error" event listener:

```js
app.on('error', function(err){
  log.error('server error', err);
});
```

If an error in the req/res cycle and it is _not_ possible to respond to the client, the `Context` instance is also passed:

```js
app.on('error', function(err, ctx){
  log.error('server error', err, ctx);
});
```

When an error occurs _and_ it is still possible to respond to the client, aka no data has been written to the socket, Koa will respond appropriately with a 500 "Internal Server Error". In either case an app-level "error" is emitted for logging purposes.




2. Context

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

Content negotiation simply means that you can have one route that answers for request for several content types. If you ask for HTML you'll get HTML back and JSON when you ask for JSON etc.

  Koa's `request` object includes helpful content negotiation utilities powered by [accepts](http://github.com/expressjs/accepts) and [negotiator](https://github.com/federomero/negotiator). These utilities are:

- `request.accepts(types)`
- `request.acceptsEncodings(types)`
- `request.acceptsCharsets(charsets)`
- `request.acceptsLanguages(langs)`

If no types are supplied, __all__ acceptable types are returned.

If multiple types are supplied, the best match will be returned. If no matches are found, a `false` is returned, and you should send a `406 "Not Acceptable"` response to the client.

In the case of missing accept headers where any type is acceptable, the first type will be returned. Thus, the order of types you supply is important.

```js

var koa = require('koa');
var app = module.exports = koa();

var tobi = {
  _id: '123',
  name: 'tobi',
  species: 'ferret'
};

var loki = {
  _id: '321',
  name: 'loki',
  species: 'ferret'
};

var users = {
  tobi: tobi,
  loki: loki
};

// content negotiation middleware.
// note that you should always check for
// presence of a body, and sometimes you
// may want to check the type, as it may
// be a stream, buffer, string, etc.

app.use(function *(next){
  yield next;

  // no body? nothing to format, early return
  if (!this.body) return;

  // Check which type is best match by giving
  // a list of acceptable types to `req.accepts()`.
  var type = this.accepts('json', 'html', 'xml', 'text');

  // not acceptable
  if (type === false) this.throw(406);

  // accepts json, koa handles this for us,
  // so just return
  if (type === 'json') return;

  // accepts xml
  if (type === 'xml') {
    this.type = 'xml';
    this.body = '<name>' + this.body.name + '</name>';
    return;
  }

  // accepts html
  if (type === 'html') {
    this.type = 'html';
    this.body = '<h1>' + this.body.name + '</h1>';
    return;
  }

  // default to text
  this.type = 'text';
  this.body = this.body.name;
});

// filter responses, in this case remove ._id
// since it's private

app.use(function *(next){
  yield next;

  if (!this.body) return;

  delete this.body._id;
});

// try $ GET /tobi
// try $ GET /loki

app.use(function *(){
  var name = this.path.slice(1);
  var user = users[name];
  this.body = user;
});

if (!module.parent) app.listen(3000);
```

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

Koa supports the following types of bodies:

* Strings
* Buffers
* Streams (node piped) (Koa automatically add error handlers)
* Object (json-stringified)
* null (no content response)

If response.status has not been set, Koa will automatically set the status to 200 or 204.

```js
// no content
if (null == val) {
  if (!statuses.empty[this.status]) this.status = 204;
  ...
}

if (!this._explicitStatus) this.status = 200;
```

When setting a stream as a body, Koa will automatically add any error handlers so you don't have to worry about error handling.

```js
app.use(function* (next) {
  this.response.type = 'application/javascript';
  this.body = fs.createReadStream('some_file.txt'); // koa will automatically handle errors and leaks
});

app.use(function* (next) {
  this.body = { foo: 'bar' }; // koa will automatically setup Content-type as application/json
})
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


## Middleware

A middleware is a pluggable function that adds or removes a particular piece of functionality by doing some work in the request/response objects in Node.js.

A Koa middleware is essentially a generator function that returns one generator function and accepts another. context of `this` of the middleware wrap all subsequent middleware, `yield next` actually calll its subsequent middleware. Also, a middleware must yield to the next 'downstream' middleware if it is run by an 'upstream middleware'. Usually, an application has a series of middleware that are run for each request.

A Koa middleware is also asynchronous decorator functions that decorate all subsequent middleware. How the decorators are implemented and dispatched is an implementation detail.

In Koa, all middleware are essentially decorators for all following middleware

```js
  // think of `next` as a subapp consisting of all downstream middleware that you'd like to decorate
  app.use(function* decorator(subapp) {
    // do stuff before the subapp execute <= flow downstream
    yield* subapp
    // do stuff after subapp execute  <= flow upstream
  });
```

A middleware function that can do things when the request is being made, and when the response is returned. **Sequence of adding middlewares are very important.**

- How middleware response

Middleware that decide to respond to a request and wish to bypass downstream middleware may simply omit `yield next`. Typically this will be in routing middleware, but this can be performed by any.

For example the following will respond with "two" if remove `yield next` inside generator "two" function, however all three are executed, giving the downstream "three" middleware a chance to manipulate the response.

```js
app.use(function *one(next){ // <= this function still have a chance to transform `this.body`
  console.log('>> one');
  yield next;
  console.log('<< one');
});

app.use(function *two(next){
  console.log('>> two');
  this.body = 'two';
  yield next;   // <= If this line is missing, the 3rd/other downstream middleware will be ignored
  console.log('<< two');
});

app.use(function *three(next){
  console.log('>> three');
  yield next;
  console.log('<< three');
});
```

If `yield next` is missing in 2nd middleware, When the furthest downstream middleware executes `yield next`; it's really yielding to a noop function, allowing the middleware to compose correctly anywhere in the stack.


#### Write Koa middleware

Koa middleware are simple functions which return a `GeneratorFunction`, and accept another. **When the middleware is run by an "upstream" middleware, it must manually yield to the "downstream" middleware.** To add a middleware to your Koa application, we use the koa.use() method and supply the middleware function as the argument.

1. Create a regular function that can take some setup options as parameter, which allowing users to extend functionality. ex: `function logger(format) {}`.

2. that function return a generator function which receive an `next` parameter. And always name your middlware, very useful for debugging purposes to assign a name. Ex: `return function *logger(next){  yield next; }`

3. All non-return middleware must yield the control flow to downstream middleware by calling `yield next;`

```js
// Koa middleware syntax
var mySession = module.exports = function(options) {
  return function *session(next) {
    // function details... possible use options object
    yield next;
  }
}
```

Example 1: write an request `header` time and a simple logger

```js
var requestTime = function(headerName) {
  return function *requestTime(next) {
    var start = new Date();
    // pause the current middleware execution
    // yield control to the down stream middleware
    yield next;
    // when downstream middleware all finish,
    // yield flow back to this middleware (resume and execute)
    var end = new Date();
    var ms = end - start;
    this.set(headerName, ms + 'ms');
  }
};

// Usage: for this particular one, need to add before route middleware to get data
app.use(requestTime('Response-time'));
```

Example 2

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

app.use(logger());  // default
app.use(logger(':method :url'));  // customized
```

#### Koa uses `koa-compose` module to wrap all subsequent middleware

`koa-compose` compose the given middlewares (an series of middlewares) and return ONLY one middleware which wrap all subsequent middleware. "Compose" multiple middleware into a single middleware for easy re-use or exporting.

```js
// in koa-compose. partial code
function compose(middleware){
  return function *(next){
    var i = middleware.length;
    // start from last index to first index(0), Koa control flow: downstream => upstream
    // `this` is the context is being passed when invoked. koa abstract version of req, res, ctx, response, request, etc.
    while (i--)  next = middleware[i].call(this, next);
    // `next` is ONLY one middleware which wrap all subsequent middleware.
    // `yield *next`. delegate to this middlware
    yield *next;
  }
}
```

`koa-compose` simply chain them together with `.call(this, next)`s, then return another function that yields the chain.

```js
function *random(next) {
  ('/random' == this.path) ? this.body = Math.floor(Math.random()*10) : yield next;
};
function *backwards(next) {
  ('/backwards' == this.path) ? this.body = 'sdrawkcab' : yield next;
}
function *pi(next) {
  ('/pi' == this.path) ? this.body = String(Math.PI) : yield next;
}
function *all(next) {
  yield random.call(this, backwards.call(this, pi.call(this, next)));
}

app.use(all);
```

#### What is a decorator

A decorator wraps a function's input and/or output.

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

var add10 = function(num) { return num + 10 }
decorate(2)(add10)(2)  // 15
```


## Generator

Generators are first class co-routines in JavaScript which, simply put, introduces a pause and play interface in the language. Before generators, the whole script used to usually execute in a top to bottom order, without an easy way to stop code execution and resuming with the same stack later.

A Generator is a better way to build Iterators - it's a special type of function that works as a factory for iterators. A function becomes a generator if it contains a `yield` expression. When a generator function is called the body of the function does not execute straight away; instead, it returns a generator-iterator object. Each call to the generator-iterator's `next()` method will execute the body of the function up to the next `yield` expression and return its result.

To use a generator, execute the generator function - which in turn returns an iterator object (instantiate a generator object). Iterator objects contain a `next` method, which essentially executes the generator function until it reaches a `yield` call. At this point, it returns the yielded value - which can be assigned to a variable for instance. Code continues to run from where the `next` method was originally called. Successive calls to the `next` method will allow execution in the generator to resume where it paused previously - the most recent `yield` call. Generator function state is maintained, so variable values persist across `next` calls.

`yield ;` is not allowed, the `yield` keyword requires a value, `yield null;` would work in this case.

Generator iterators can be automatically used with `for-of` loops and comprehensions.

`function* () {}` or `.map(function* () {})` is a regular function. The only difference is return object. Invoking `function* () {}` would return a generator.  That means you can pass `function* () {}` basically anywhere a regular function can go, but just make sure you realize that a generator is returend.

```js
function* two(){
  yield 1;
  yield 2;
}

var seq = two();

// "value": return value of the generator
// "done": generator run is completed or not
// "yield"  can pause the generator
seq.next();   // { value: 1, done: false }
seq.next()    // { value: 2, done: false }
seq.next()    // { value: undefined, done: true }

seq.next()    // Got an exception: "Error: Generator has already finished"
```

A generator that generates a list of fibonacci numbers

```js
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

Generator does not control by itself, must control by other module. So use well-structure generator Control Flow library to call `next` method automatically for you. Ex: `co`


#### Generator vs Generator function

- Generators

Essentially iterator functions that allow their execution to be paused and resumed through the use of `yield`. `yield` keyword essentially says return this value for this iteration and I'll pick up where I left off when you call `next()` on me again.

Generators are lightweight co-routines for JavaScript. They allow a function to be suspended and resumed via the `yield` keyword.
Their ability to be paused and resumed is what makes them so powerful at managing flow control.

- Generator functions

Special functions in that they don't execute the first time they're call but instead return an iterator object with a few methods on it and the ability to be used in `for-of` loops and array comprehensions.

Generator functions have a special syntax: `function* ()`. With this superpower, we can also suspend and resume asynchronous operations using constructs such as promises or “thunks” leading to “synchronous-looking” asynchronous code.

Any generator or generator function you can pass into `co` can be `yielded` as well. This should generally be avoided as we should be moving towards spec-compliant Promises instead.


#### Generator methods

generator objects only as a producer of a sequence of values, where information only goes one way - from the generator to you. It turns out that you can also send values to it by giving next() a parameter.

- next()

This continues the next iteration of the generator. Resume the execution along with passing an argument. If nothing is passed, then undefined gets passed as the first argument.
If this is not a generator object, Throw Error Call `this.[[Send]]` with single argument undefined Return the result

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

var c = consumer()
c.next(1)   // { value: null, done: false } This returns the expected object, but it also didn't console.log() anything,
c.next(2)   // { value: null, done: false } // Log:  Got value 2
```

Generator can send and receive values from a generator. `yield` statement can return a value


- throw()

This throws an exception INTO the generator causing the generator to throw the exception as though it came from the last `yield`statement.

`throw()` an error onto a generator object, the error actually propagates back up into the code of the generator, meaning you can actually use `try/catch` statements to catch it. If this is not a generator object, Throw Error Call `this.[[Throw]]` with the first argument Return the result. So, if we add try/catches to the last example:

```js
var c = consumer()
// we'll call next() first, because there's no way the generator can catch a error that's thrown at it before it even starts executing.
c.next()   // this is required to start the execution
// manually throw an error, it will catch the error and handle it gracefully
c.throw(new Error('blarg!'))  // You threw an error but I caught it. // Error: blarg!
```

throw an error or exception at any step. It makes error handling much easier. Throwing an error can result in stopping execution of the file, if it is not handled somewhere. The simplest way to handle an error is to use a try and catch statement. This method takes a single argument which can be anything.


- send()

This sends a value into the generator treating it as the last value of `yield` and continues the next iteration
If this is not a generator object, Throw Error Call `this.[[Send]]` with the first argument Return the result

- close

This forces the generator to return execution and calls any finally code of the generator which allows final error handling to be triggered if needed.
If this is not a generator object, Throw Error Call this.[[Close]] with no arguments Return the result

- iterate

Every generator is an iterator object, and it has an `iterate` method whose behavior is: Return this


#### Generator Benefits

write the equivalent code in a straight-line fashion, less code and asthetics

Line independence: the code for one operation is no longer tied to the ones that come after it. If you want to reorder of operations, simply switching the lines. If you want to remove an operation, simply deleting the line.

Simpler and DRY error handling: where as the callback-based style required error handling to be done for each individual async operation, with the generator-based style you can put one try/catch block around all the operations to handle errors uniformly - generators gives us back the power of try/catch exception handling.


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

#### `yield next` vs. `yield* next`

- [`yield* next`](http://wiki.ecmascript.org/doku.php?id=harmony:generators#delegating_yield)

As said, you can yield pretty much anything, even a generator, but then you have to use yield *. This is called delegation. You're delegating to another generator, so you can iterate through multiple nested generators, with one iterator object.

Generator delegation is used to yield a generator from within an existing generator and can be used to compose generators or even iterate over a generator. (The `yield*` operator delegates to another generator. ) This provides a convenient mechanism for composing generators. ` yield* <<expr>>`; Koa uses it internally for "free" performance.

On delegating to another generator, the current generator stops producing a value itself and starts yielding values of the delegated generator until it is exhausted. Upon exhaustion of the delegated generator, the generator resumes returning its own value.  This essentially gives control over to the other generator function until it has exhausted all of its yields and then it returns control to the originating generator. It should not be thought of as a way to do recursion with generators as I learned.

It is very much like using a `for-in` loop over a generator, but the exceptions of the delegated generator are propagated and thrown via the outer generator's throw method and should be handled likewise.

```js
var consoleLogThunk = function(msg) {
    return function() {
        console.log(msg);
    }
}

var generator = function*() {
    yield consoleLogThunk("Yo");
    yield consoleLogThunk("Dawg");
    yield consoleLogThunk("!!!");
}

var delegator_function = function* () {
    yield consoleLogThunk("I yielded before delegated yield");
    yield* generator();
    yield consoleLogThunk("I yielded after delegated yield");
}

var k = delegator_function();

k.next().value();  // I yielded before delegated yield
k.next().value();  // Yo
k.next().value();  // Dawg
k.next().value();  // !!!
k.next().value();  // I yielded after delegated yield
// k.next().value();  // TypeError: undefined is not a function

var non_delegator_function = function* () {
    yield consoleLogThunk("I yielded before delegated yield");
    yield generator();  // <= without the `*`
    yield consoleLogThunk("I yielded after delegated yield");
}
var e = non_delegator_function();
e.next().value();  // I yielded before delegated yield
e.next().value();  // k.next().value();  TypeError: object is not a function
```

Here delegator_function is a generator function and k stores the generator/iterator object , so when it is called first using `k.next()`, `consoleLogThunk` function is called with msg "I yielded before delegated yield" . When called again, the iterator delegated the flow to the generator function and it yields output, upon which `delegator_function` resumes and yields `consoleLogThunk` function with msg "I yielded after delegated yield" .

`yield* next`, Koa is currently faster than Express. Because Koa doesn't use a dispatcher, unlike Express who uses multiple (one from connect, one for the router).


#### Control flow implementation

The first thing to realize is that the async operations need to take place outside of the generator function. This means that some sort of "controller" will need to handle the execution of the generator, fulfill async requests, and return the results back. So we'll need to pass the generator to this controller, for which we'll just make a run() function:

```js
run(function*(){
  try{
    var tpContent = yield readFile('blog_post_template.html');
    var mdContent = yield readFile('my_blog_post.md');
    res.end(template(tpContent, markdown(String(mdContent))));
  }catch(e){
    resp.end(e.message);
  }
});
```

`run()` has the responsibility of calling the generator object repeatedly via next(), and fulfill a request each time a value is yielded. It will assume that the requests it receives are functions that take a single callback parameter which takes an `err`, and another value argument - conforming to the Node style callback convention. When `err` is present, it will call `throw()` on the generator object to propagate it back into the generator's code path. The code for `run()` looks like:

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
    } else {
      // if good value, send it
      res = gen.next(answer);
    }
    if (!res.done){
      // if done is false, need to fulfill an async request by calling `value` as a function
      // and passing it a callback that receives `err`, answer via `next()` function
      res.value(next);
    }
  }
  // Kick off the async loop
  next();
}
```

#### Generator error handling

If you find something wrong in the iterator object's value, you can use its `throw()` method and catch the error in the generator. This makes a really nice error handling in a generator.

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

## Thunk

A "thunk" is a function that take a single parameter callback then returns another callback that they are wrapping as opposed to invoke it. The callback has the same signature as your typical node callback function (i.e. error is the first argument). A “thunk” is basically a partially evaluated function with just the callback argument left over to be filled in.

This creates a closure that allows the calling code to instantiate the function passing in its callback so that it can be told when the method is complete.

Using Thunk write code in synchronous fashion that runs asynchronously

Primarily used to assist a call to another function. You can sort of associate it with *lazy evaluation*. What's important for us though that they can be used to move node's callbacks from the argument list, outside in a function call.

[thunkify](https://github.com/tj/node-thunkify) by TJ which transforms a regular node function to a thunk, and it turns out it can be pretty good to ditch callbacks in generators.

```js
// wrap node.js’ fs.readFile method to have a thunk API
// `read` takes the file path as parameter and needs to return a function
var read = function (filePath) {
  return function (cb) {
    require('fs').readFile(filePath, cb);
  }
}

// readFile('package.json', function(err, result) { ... });   // <= old style
read('package.json')(function (err, result) { });   // <= new style
```

However, `co` makes a world of difference, `yield` a thunk function that it can execute asynchronously, and once it receives its result, it can call `.next(result)` to resume execution, or `.throw(err)` if an error occurred (resulting in an exception being thrown inside of the generator that you can catch with try-catch). Ex: inside `co`, `var contents = yield read(path);`

Here is an example of thunk. First we have to transform the node function we want to use in a generator to a thunk. Then use this thunk in our generator as if it returned the value, that otherwise we would access in the callback. When calling the starting `next()`, its value will be a function, whose parameter is the callback of the thunkified function. In the callback we can check for errors (and throw if needed), or call next() with the received data.

```js
var thunkify = require('thunkify');
var fs = require('fs');
// 1st, create our thunkified functions (transform Node function to a thunk), that can be used in a generator.
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
// invoke `next()`, its value will be a function, whose parameter is the callback of the thunkified function.
gen.next().value(function (err, data) {
  // In the callback we can check for errors (and throw if needed), or call next() with the received data.
  if (err) gen.throw(err);
  gen.next(data.toString());
})
```

In Node land, everything is set up to work with callbacks. It is our lowest-level asynchronous abstraction. However, callbacks don’t work well with generators but `yield` will.

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
// [2] using the same fs.readFile API without passing the callback argument. No asynchronous operation is performed yet.
var readAsyncJs = readFile('./async.js')
readAsyncJs(function (er, buf) { ... }) // [3] Perform the asynchronous operation and callback.
```

Then, we could use in `co` control flow library and do something like this

```js
co(function* () {
  try {
    console.log("Starting")
    var file = yield readFile("./async.js") // [1] Wait for the result of async.js to come back before continuing.
    console.log(file.toString())
  } catch (er) {
    console.error(er)
  }
})
```


## Co

Co is a generator based flow-control module for node. Koa is built on `co`, which handles the delegation to generators and gives Koa its nice syntax.

Co (and Koa) have a really simple way to handle this; just `yield` an array or object, where each element of the array or property of the object is either a generator or a Promise. When Co encounters this, it triggers all the promises/generators at the same time, waits for the results to return, and keeps things in their correct order.

Co handles all of the generator calling code for you. Simply put a`yield` before anything that evaluates to something.

Calling `co()` does not execute the code inside of it, `co` return a function that you need to call to start the generator.

Why coroutines rocks? coroutines run each “light-weight thread” with its own stack. The implementations of these threads varies but typically they have a relatively small initial stack size (~4kb), growing when required.

Why is this so great? Error handling! Since we pass the generator to the `co()` function, and all yields delegate to the caller, extremely robust error handling can be delegated to Co.

Co can "throw" exceptions back to their origin as shown below, meaning you can use `try/catch` as the language intended, or leave them out and utilize the final Co callback to handle the error.

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

[Co wiki](https://github.com/tj/co/wiki) list of all co-ready modules.

#### understanding co

Koa uses co control flow engine. Internally wrapping generator `yield` expression inside `co` function.

```js
// have the following generators:
function* outer() {
  this.body = yield inner  // Not using "delegate yield"
}

function* inner() {
  yield setImmediate
  return 1
}
```

What is essentially happening here is:  There's an extra `co` call here. Each `co` call creates a few closures, so there's going to be a tiny bit of overhead.

```js
function* outer() {
  this.body = yield co(function *inner() {
    yield setImmediate
    return 1
  })
}
```

if we use delegation `yield*`, we can avoid this overhead and use native language features by skipping the extra co call.

```js
function* outer() {
  this.body = yield* inner()
}
```

`outer()` essentially becomes to

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

essentially becomes to:  The only overhead is the initiation of a single `co` instance and our own Context constructor that wraps node's `req` and `res objects for convenience.

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

Warning: If you yield* something that isn't a generator, you'll get an error like the following:
`TypeError: Object function noop(done) { done(); } has no method 'next'`

## Context is important

`co` calls all continuables or yieldables with the same context. This particulary becomes annoying when you `yield` a function that needs a different context. For example, constructors!

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

What you'll find is that `this.body` is `undefined`! This is because `co` is essentially doing this:

```js
app.use(function* () {
  var thing = new Thing()
  this.body = yield function (done) {
    // this refers to the Koa context, not thing.
    thing.print.call(this, done)
  }
})
```

This is where delegate `yield*` comes in! When context is important, you should be doing one of two things:
By using this strategy, you'll avoid 99% of generator-based context issues. So avoid doing `yield context.method`!

```js
yield* context.generatorFunction()
yield context.function.bind(context)
```

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

#### Yieldable

Co works with both promises and thunks and they are used for yield statement so that co knows when to continue execution of the generator instead of you manually having to call `next()`. Co also supports the use of generators, generator functions, objects and arrays for further flow control support.

By yielding an array or an object you can have co perform parallel operations on all of the yielded items.

By yielding to a generator or generator function co will delegate further calls to the new generator until it is completed and then resume calling next on the current generator, allowing you to effectively create very interesting flow control mechanisms with minimal boilerplate code.

Nested yieldables are supported, meaning you can nest promises within objects within arrays, and so on!

Co cannot yeild any API which only setup for callbacks.

`co` yieldable objects currently supported are:

- promises

promises is that they are an object returned by a function that maintains the state of the function and a list of callbacks to call when the a specific state of the object is or has been entered into.

- thunks (functions)

Thunks are asynchronous functions that only have a single argument, a callback. Thunk support only remains for backwards compatibility and may be removed in future versions of co.


- array (parallel execution)

when `yield` an array or an object, it will evaluate its content parallelly. yielding an array will resolve all the yieldables in parallel.

```js
var read = thunkify(fs.readFile);
co(function *() {
  // 3 concurrent reads in Array form
  var a = [read('input.txt'), read('input.txt')];
  var b = [read('input.txt'), read('input.txt')];
  // 4 concurrent reads
  // formats: [yield a, yield b] or yield [a, b], both fine
  var files = yield [a, b];
  console.log(files);

  // 2 concurrent reads in Object form
  reads = yield { a: read('input.txt'), b: read('input.txt') };
  console.log(reads);
})();
```

The members of your collection are thunks, generators. You can nest, it will traverse the array or object to run all of your functions parallelly. Note: the yielded result will not be flattened, it will retain the same structure.

`yield` could handle array of async operation. Generator's `throw` method would handle any error happened in Async. We could add our custom `try/catch` error block, koa also added `app.onerror`, `404` or `500` default etc. But recommend to handle the error yourself.

```js
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
  var arr = yield ['1.txt', '2.txt', '3.txt'].map(function(filePath) {
    return thunkifiedRead(filePath)
  })
  this.body = arr.join(',')
})
```

- objects (parallel execution)

Just like arrays, objects resolve all yieldables in parallel.

- generators (delegation)

Notice you don't need to use `yield *` to yield generators

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

- generator functions (delegation)

```js
  co(function* (){
      // possible  try{} catch(e){}
  })();
```

#### Generators vs Coroutines

Generators are sometimes referred to as “semicoroutines”, a more limited form of coroutine that may only yield to its caller. This makes the use of generators more explicit than coroutines, as only yielded values may suspend the “thread”.

Coroutines are more flexible in this respect, and looks like regular blocking code as no yield is required:

```js
var str = read('Readme.md')
str = str.replace('Something', 'Else')
write('Readme.md', str)
console.log('all done!')
```


## Decorator Pattern

A structural design pattern that promotes code reuse and is a flexible alternative to subclassing. This pattern is also useful for modifying existing systems where you may wish to add additional features to an existing object dynamically without the need to change the underlying code that uses them. The idea is that the decoration itself isn't essential to the base functionality of an object otherwise it would be baked into the 'superclass' object itself.

Also known as a wrapper, is a mechanism by which to extend the run-time behavior of an object, a process known as decorating. The decorator pattern is used to enhance the behavior of an existing object, not change it.

#### Extend OOP design

In traditional OOP, a `class B` is able to extend another `class A`. `A` is a superclass and `B` is a subclass of `A`. All instances of `B` inherit the methods from`A`. `B` could define its own methods, including those that override methods originally defined by `A`.

- method chaining

`B` invoke a method in `A` that has been overridden

- constructor chaining

`B` need to invoke the constructor `A()` (the superclass)

Decorators are used when it's necessary to delegate responsibilities to an object where it doesn't make sense to subclass it. A common reason for this is that the number of features required demand for a very large quantity of subclasses.

The decorator pattern isn't heavily tied to how objects are created but instead focuses on the problem of extending their functionality. Rather than just using inheritance, where we're used to extending objects linearly, we work with a single base object and progressively add decorator objects which provide the additional capabilities. The idea is that rather than subclassing, we add (decorate) properties or methods to a base object so its a little more streamlined.


#### Wrapper

Criticism: 1. decorator must be maintained to adhere to its interface. 2. decorators must implement all operations defined by a contract to enforce a consistent API. While this can be tedious at times, there are libraries and methodologies that can be used with JavaScript’s dynamic nature to expedite coding. Reflection-like invocation can be used to allay concerns when dealing with a changing API.

```js
// Invoke the target method and rely on its pre- and post-conditions.
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

Think about `co` control flow library

```js
// Class is `co` itself, context is `this` which is caller from `co.wrap`
// it follows the decorator's dynamic invocation
co.wrap = function (fn) {
  return function () {
    return co.call(this, fn.apply(this, arguments));
  };
};
```

#### Examples

Example 1: Basic decoration of existing object constructors with new functionality

```js
function vehicle( vehicleType ){
  // properties and defaults
  this.vehicleType = vehicleType || 'car',
  this.model = 'default',
  this.license = '00000-000'
}

var testInstance = new vehicle('car');
console.log(testInstance);  // vehicle: car, model:default, license: 00000-000

// Lets create a new instance of vehicle, to be decorated*/
var truck = new vehicle('truck');
// New functionality we're decorating vehicle with
truck.setModel = function( modelName ){
  this.model = modelName;
}

truck.setColor = function( color ){
  this.color = color;
}

truck.setModel('CAT');
truck.setColor('blue');
console.log(truck); // vehicle:truck, model:CAT, color: blue

// Demonstrate 'vehicle' is still unaltered
var secondInstance = new vehicle('car');
console.log(secondInstance); // vehicle: car, model:default, license: 00000-000
```

Example 2: Simply decorate objects with multiple decorators

Here, the decorators are overriding the superclass .cost() method to return the current price of the Macbook plus with the cost of the upgrade being specified. It's considered a decoration as the original Macbook object's constructor methods which are not overridden
(e.g. screenSize()) as well as any other properties which we may define as a part of the Macbook remain unchanged and intact.

```js
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
