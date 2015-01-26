## Node

1. Node's core stream is not good.

The "readable-stream" package available in npm is a mirror of the Streams2 and Streams3 implementations in Node-core. You can guarantee a stable streams base, regardless of what version of Node you are using, if you only use "readable-stream".

Implementing a stream now looks something like this:

```js
//This works because there is no Readable object on the core 'stream' package in 0.8 and prior, so if you are running on an older version of Node it skips straight to the "readable-stream" package to get the required implementation.
var Readable = require('stream').Readable || require('readable-stream').Readable;
// `Stream` is still provided for backward-compatibility
// Use `Writable`, `Duplex` and `Transform` where required
var util = require('util')

function MyStream () {
  Readable.call(this, { /* options, maybe `objectMode:true` */ })
}

util.inherits(MyStream, Readable)

// stream logic, implemented mainly by providing concrete method implementations:
MyStream.prototype._read = function (size) {
  // ...
}
```

State-management is handled by the base-object and you interact with internal methods, such as `this.push(chunk)` in the case of a Readable stream.

Streams2 streams won't work like classic EventEmitter objects when you pipe them together, as old-style streams do. But when you pipe a Streams2 stream and an old-style EventEmitter-based stream together, Streams2 will fall-back to "compatibility-mode" and operate in a backward-compatible way.

The [readable-stream](https://github.com/iojs/readable-stream) package is essentially a mirror of the streams implementation of Node-core but is available in npm.

through2 gives you a DuplexStream as a base to implement any kind of stream you like, be it as purely readable, purely writable or a fully duplex stream. In fact, you can even use through2 to implement a PassThrough stream by not providing an implementation!

```js
var through2 = require('through2')

fs.createReadStream('ex.txt')
  .pipe(through2(function (chunk, enc, callback) {

    for (var i = 0; i < chunk.length; i++)
      if (chunk[i] == 97)
        chunk[i] = 122 // swap 'a' for 'z'

    this.push(chunk)

    callback()

   }))
  .pipe(fs.createWriteStream('out.txt'))
```

Or an object stream:

```js
fs.createReadStream('data.csv')
  .pipe(csv2())
  .pipe(through2.obj(function (chunk, enc, callback) {

    var data = {
        name    : chunk[0]
      , address : chunk[3]
      , phone   : chunk[10]
    }

    this.push(data)

    callback()

  }))
  .on('data', function (data) {
    all.push(data)
  })
  .on('end', function () {
    doSomethingSpecial(all)
  })
```

## io.js

- ES6 features

The following list of features are available without using any flags:

Block scoping (let, const)
Collections (Map, WeakMap, Set, WeakSet)
Generators
Binary and Octal literals
Promises
New String methods
Symbols
Template strings

- New modules

io.js ships with new core modules as well, that can be used without installing from NPM.

* smalloc: a new core module for doing (external) raw memory allocation/deallocation/copying in JavaScript
* v8: core module for interfacing directly with the V8 engine

[io.js API](https://iojs.org/api/)


## NPM

- `npm run`

run any command in the package.json "scripts" field.

`npm test` and `npm start` are just shortcuts for `npm run test` and `npm run start` and you can use **npm** run to run whichever entries in the scripts field you want! **npm** will automatically set up `$PATH` to look in `node_modules/.bin`, so you can just run commands supplied by dependencies and devDependencies directly without doing a global install.

```js
// package.json
{
    "scripts": {
      "build-js": "browserify browser/main.js | uglifyjs -mc > static/bundle.js",
      "build-css": "cat static/pages/*.css tabs/*/*.css",
      "build": "npm run build-js && npm run build-css",
      "watch-js": "watchify browser/main.js -o static/bundle.js -dv",
      "watch-css": "catw static/pages/*.css tabs/*/*.css -o static/bundle.css -v",
      "watch": "npm run watch-js & npm run watch-css",
      "start": "node server.js",
      "test": "tap test/*.js",
      "build-js": "bin/build.sh"
    }
}
```

## Best Practice

1. SSL termination should be done by Nginx. Heavy encryption is not for node, Do not bind directly to port 80/443
