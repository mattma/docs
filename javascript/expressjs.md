## installation

```bash
# install in each project basis as dependency ONLY
npm install express --save

# a CLI tool for scaffolding
npm install -g express-generator
```

## Definition

Using Request Handlers

A typical Express.js request handler is similar to the one we pass as a callback to the native/core Node.js http.createServer() method. For. A request handler is a function that will be executed every time the server receives a particular request, usually defined by an HTTP method (e.g., GET) and the URL path (i.e., the URL without the protocol, host, and port). The Express.js request handler needs at least two parameters—req, res. They utilize readable and writable streams interfaces. ex: req.pipe(), res.on('data', function(chunk) {...}).

## Configuration

- app.set(name, value)

define a value. it sets the value for the name.  Ex: `app.set('port', process.env.PORT || 3000);`
exposes variables to templates application-wide; Can be used in all Jade templates, etc

- app.get(name)

retrieve the value based on the key/name of the setting. Name could be Express.js setting or an arbitrary string. Ex: `app.get('port')`

- app.enable(name) and app.disable(name) // Equal: app.set(name, true)

#### Setting (2 types)

1. Express.js system settings: These settings are used by the framework to determine certain configurations. Most of them have default values, so the bare-bones app that omits configuring these settings will work just fine.

• env

store the current environment mode for this particular Node.js process. Auto set by Express.js from `process.env.NODE_ENV`. Default: "development". Other common: "test", "stage", "preview", "production", "qa"

Caller `NODE_ENV=development node app.js` to start your app with env

• view cache

if set to false, allows for painless development because templates are read each time the server requests them.
if set to true, it facilitates template compilation caching, which is a desired behavior in production.
If the env setting is production, then view cache is enabled by default. Otherwise it is set to false.

• view engine

holds the template file extension (e.g., 'ext' or 'jade') to utilize if the file extension is not passed to the res.render() function inside of the request handler.

• views

an absolute path (starts with /) to a directory with templates. defaults to the absolute path of the views folder

• trust proxy

Disabled by default. If true if app is working behind reverse proxy such as Varnish or Nginx. This will permit trusting in the X-Forwarded-* headers, such as X-Forwarded-Proto (req.protocol) or X-Forwarder-For (req.ips). Ex: `app.enable('trust proxy');`

• jsonp callback name

If you’re building an application (a REST API server) that serves requests coming from front-end clients hosted on
different domains, you might encounter cross-domain limitations when making XHR/AJAX calls. In other words,
browser requests are limited to the same domain (and port). The workaround is to use cross-origin resource sharing
[CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) headers on the server.

The default callback name `callback`, which is a prefix for our JSONP response, Ex: `?callback=updateView`.
To use something different, just set the setting jsonp callback name to that value; Ex: `?cb=updateView`, we can use this setting: `app.set('jsonp callback name', 'cb');`

In most cases, we don’t want to alter this value because the default callback value is somewhat standardized by
jQuery $.ajax JSONP functions.

• json replacer and json spaces

When use `res.json()`, we can apply special parameters: replacer and spaces. These parameters are passed to all `JSON.stringify()`functions in the scope of the application. JSON.stringify() is a widely used function for transforming native JavaScript/Node.js objects into strings.

`replacer` parameter acts like a filter. It’s a function that takes two arguments: key and value. If undefined is returned, then the value is omitted. For the key-value pair to make it to the final string, we need to return the value. Express.js uses null as the default value for json replacer. I often use JSON.stringify(obj, null, 2) when I need to print pretty JSON.

`spaces` parameter is in essence an indentation size. Its value defaults to 2 in development and to 0 in production. In most cases, we leave these settings alone.

```js
  app.set('json replacer', function(key, value){
    if (key === 'discount')
      return undefined;
    else
      return value;
  });
  app.set('json spaces', 4);
```
• case sensitive routing

If false (default), disregard the case of the URL paths
if true, if we have `app.enable('case sensitive routing');`, then `/users` and `/Users` won’t be the same. It’s best to have this option disabled for the sake of avoiding confusion.

• strict routing

cases of trailing slashes in URLs. If enabled, `app.set('strict routing', true');`, the paths will be treated differently; for example, `/users` and `/users/` will be completely separate routes.
Default to false, which means that the trailing slash is ignored and those routes with a trailing slash will be treated the same as their counterparts without a trailing slash.

• x-powered-by

Default to enabled. sets the HTTP response header `X-Powered-By: Express` to the Express value in Header field.

If you want to disable x-powered-by (remove it from the response)—which is recommended for security reasons, because it’s harder to find vulnerabilities if your platform is unknown—then apply `app.set('x-powered-by', false)` or `app.disable('x-powered-by')`

• etag

ETag3 (or entity tag) is a caching tool. The way it works is akin to the unique identifier for the content on a given URL. In other words, if content doesn’t change on a specific URL, the ETag will remain the same and the browser will use the cache.

default to true (recommended). `app.disable('etag');` which will eliminate the ETag HTTP response header.
By default, Express.js uses “weak” ETag. Other possible values are false (no ETag), true (weak ETag), and strong (strong ETag). The last option (for advanced developers) that Express.js provides is using your own ETag algorithm.

an identical strong ETag guarantees the response is byte-for-byte the same
an identical weak ETag indicates that the response is semantically the same

• query parser

A query string is data sent in the URL after the question mark (Ex: `?name=value&name2=value2`). This format needs to be parsed into JavaScript/Node.js object format before we can use it. Express.js automatically includes this query parsing for our convenience. It does so by enabling the `query parser` setting.

Default to "extended", which use `qs` module's functionality. Other values: "false"(disable parsing), "true"(Uses `qs`), "simple"(use the core `querystring` module's functionality ), or pass your own function. `app.set('query parser', customQueryParsingFunction);`

• subdomain offset

controls the value returned by the req.subdomains property. Useful when the app is deployed on multiple subdomains. Ex: "http://ncbi.nlm.nih.gov.".  By default, the last two “subdomains” (the two extreme right parts) in the hostname/URL are dropped and the rest are returned in reverse order in the req.subdomains; so for our example of "http://ncbi.nlm.nih.gov", the resulting req.subdomains is ['nlm', 'ncbi'].

However, if the app has subdomain offset set to 3 by `app.set('subdomain offset', 3);`, the result of `req.subdomains` will be just ['ncbi'], because Express.js will drop the three (3) parts starting from the right (nlm, nih, and gov).

2. Custom settings: You can store any arbitrary name as a setting for reference later. These settings are custom to your application, and you first need to define them to use.

## Tools

Watch file changes

• forever: For use on the production server (https://npmjs.org/package/forever)

• node-dev: Description (https://npmjs.org/package/node-dev; GitHub:
https://github.com/fgnass/node-dev)

• nodemon: Supports CoffeeScript (https://npmjs.org/package/nodemon; GitHub:
https://github.com/remy/nodemon)

• supervisor: Written by the one of the creators of NPM https://npmjs.org/package/
supervisor; GitHub: https://github.com/isaacs/node-supervisor)

• up: Written by the team that wrote Express.js (https://npmjs.org/package/up; GitHub:
https://github.com/LearnBoost/up)

## Tips

- Useful when doing in testing.

true, this file was not included by any other file, called it directly
false, required by other file, can export var, function, etc

```js
  if (require.main === module) {
    boot();
  } else {
    console.info('Running app as a module');
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
  }
```


## Code snippet

1. default express generator give us this

a 404 (Not Found) middleware, and two 500 (Internal Server Error) error handlers, one for development (more verbose) and one for
production:

```js
app.use(function(req, res, next) {
var err = new Error('Not Found');
err.status = 404;
next(err);
});
if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {
res.status(err.status || 500);
res.render('error', {
message: err.message,
error: err
});
});
}
app.use(function(err, req, res, next) {
res.status(err.status || 500);
res.render('error', {
message: err.message,
error: {}
});
});
```

2. use `debug` module

```js
// app.js
module.exports = app;

// In /bin/www, the server is imported from the app.js file:

#!/usr/bin/env node
var debug = require('debug')('cli-app');
var app = require('../app');
```
