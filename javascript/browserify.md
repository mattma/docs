# Browserify

> [browserify-handbook](https://github.com/substack/browserify-handbook)

browserify is a tool for compiling node-flavored commonjs modules for the browser.

## Node Export

You can export any kind of value with module.exports, not just functions.
because `module.exports` is the same as `exports` and is initially set to an empty object. because the `export` value lives on the `module` object, and so assigning a new value for `exports` instead of `module.exports` masks the original reference.

```js
module.exports = 555
module.exports = function() {}

exports.beep = function (n) { return n * 1000 }
// is equal to
module.exports.beep = function (n) { return n * 1000 }
```

Most of the time, you will want to `export` a single function or `constructor` with `module.exports` because it's usually best for a module to do one thing. The `exports` feature was originally the primary way of exporting functionality and `module.exports` was an afterthought, but `module.exports` proved to be much more useful in practice at being more direct, clear, and avoiding duplication.

```js
// how modules work in the background
var module = {
  exports: {}
};

// If you require a module, it's basically wrapped in a function
(function(module, exports) {
  exports = function (n) { return n * 1000 };
}(module, module.exports))

console.log(module.exports); // it's still an empty object :(
```

```js
// In practices
// Case 1: exports
exports.foo = function (n) { return n * 111 }  // foo.js
var foo = require('./foo.js'); // main.js
console.log(foo.foo(5));

// Case 2: module.exports
module.exports = function (n) { return n * 111 }  // foo.js
var foo = require('./foo.js');  // main.js
console.log(foo(5));
```

## how browserify works

In browserify, you do this same thing, but instead of running the file, you generate a stream of concatenated javascript files on stdout that you can write to a file with the `>` operator. ex: `browserify robot.js > bundle.js`

Bonus: if you put your script tag right before the </body>, you can use all of the dom elements on the page without waiting for a dom onready event.

Browserify starts at the entry point files that you give it and searches for any require() calls it finds using static analysis of the source code's abstract syntax tree. For every `require()` call with a string in it, browserify resolves those module strings to file paths and then searches those file paths for require() calls recursively until the entire dependency graph is visited. Each file is concatenated into a single javascript file with a minimal `require()` definition that maps the statically-resolved names to internal IDs. This means that the bundle you generate is completely self-contained and has everything your application needs to work with a pretty negligible overhead.

Browserify is a build step that runs on the server. It generates a single bundle file that has everything in it.
