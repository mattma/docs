# [Broccoli](https://github.com/broccolijs/broccoli)

Broccoli defines a single plugin API: a tree. A tree object represents a tree (directory hierarchy) of files that will be regenerated on each build.

**By convention, plugins will export a function that takes one or more input trees, and returns an output tree object.**

A tree object must supply two methods that will be called by Broccoli:

1. tree.read(readTree)  //produce its output directory

It must return a path or a promise for a path, containing the tree contents.

It receives a `readTree` function argument from Broccoli. If `.read` needs to read other trees, it must not call `otherTree.read` directly. Instead, it must call `readTree(otherTree)`, which returns a promise for the path containing `otherTree`'s contents. It must not call `readTree` again until the promise has resolved; that is, it cannot call `readTree` on multiple trees in parallel.

Broccoli will call the `.read()` repeatedly to rebuild the tree, but at most once per rebuild; that is, if a tree is used multiple times in a build definition, Broccoli will reuse the path returned instead of calling `.read` again.

The `.read` method is responsible for creating a new temporary directory to store the tree contents in. Subsequent invocations of `.read` should remove temporary directories created in previous invocations.

2. tree.cleanup()  // the previous output directory can be cleaned up

For every tree whose `.read` method was called one or more times, `.cleanup()` will be called exactly once. No further `.read` calls will follow `.cleanup`. The `.cleanup` method should remove all temporary directories created by `.read`.

Note:

1. Do not run `broccoli serve` on a production server. Use `broccoli build` to precompile your assets, and serve the static files from a web server.

2. Errors

When it is known which file caused a given error, plugin authors can make errors easier to track down by setting the `.file`property on the generated error. This `.file` property is used by both the console logging, and the server middleware to display more helpful error messages.

3. [Descriptive Naming](https://github.com/rwjblue/broccoli-slow-trees/)

To prints a log of any trees (slowest trees), broccoli first check `.description` property on the plugin instance then fall back to using the plugin constructor's name.

## Concept

1. Trees (Not Files)

Broccoli’s unit of abstraction to describe sources and build products is a directory with files and subdirectories. It’s `tree-goes-in-tree-goes-out`. Instead of passing around File System Directories (Grunt) or Memory Streams (Gulp), it passes around Trees. Its unit of work (input and output) is a tree. This makes n:1 compilers like Sass a breeze to deal with (tree pun).

Each tree in the build consumes one or more trees as input and produces a single (directory) tree as output, and this process may alter its input in some way as part of the process.

The simplest way to specify a tree is to simply pass a string path - this will create a tree containing the contents of that path (all paths are relative to the package.json) that watches and rebuilds on changes.

`n:1` compilers like Sass are no problem, while `1:1` compilers like CoffeeScript are an easily expressible sub-case. In fact, we have a `Filter` base class for such 1:1 compilers to make them very easy to implement.

2. Chainable Plugins

Plugins take 0, 1, or n input trees, just return new trees. Since all plugins return a tree, they can be easily chained.

We let plugins handle their input trees, we don’t need to know about compilers as first-class objects in Broccoli land anymore. Plugins simply export functions that take zero or more input trees (and perhaps some options), and return an object representing a new tree.

```js
    var tree = broccoli.makeTree('build'); // => a tree
    tree = filterCoffeeScript(tree);  // => a tree
    tree = compileSass(tree, {
      loadPaths: [moreTrees, ...]
    }); // => a tree
    return tree;
```

3. The File System Is The API

Broccoli uses the actual file system via Node’s `fs` module to write files on the fly, it manages temporary directories behind the scenes, and clean them up. Contrast to Gulp, which abstract the file system away into an in-memory API, representing trees as collections of streams, with streams, plugins now have to worry about race conditions and deadlocks.

4. Caching (incremental builds, Not Partial Rebuilding)

Broccoli’s approach is much simpler: Ask each plugin to cache its build output as appropriate. When we rebuild, start with a blank slate, and re-run the entire build process. Plugins will be able to provide most of their output from their caches, which takes near-zero time. In short, Broccoli does a fresh rebuild every time and the plugins return the majority of the build from their caches.

Broccoli has no caching primitives in core.

5. No Parallelism

parallelism makes it possible to have race conditions in plugins, which you might not notice until deploy time. Avoiding parallel execution eliminates this entire class of bugs.

## Installation

```bash
    npm install --save-dev broccoli
    npm install --global broccoli-cli

    # install any broccoli plugins you intend to use in your build file
    npm install --save-dev broccoli-static-compiler
    npm install --save-dev broccoli-concat
```

## Broccoli Plugins

Plugins can chain their output to one another, and the built-in watch only rebuilds what has changed rather than the whole lot.

Wrapping compilers is easy, but the hard and important part is getting caching and performance right.

#### API change description

tree.inputTrees (set by constructor)
tree.inputTree (set by constructor; alternative for single input tree)

tree.inputPaths (set by Broccoli; static across builds)

tree.inputPath (set by Broccoli; alternative; static across builds)
tree.outputPath (set by Broccoli; static across builds)
tree.cachePath (set by Broccoli; static across builds)

tree.rebuild() (returns promise for null)

tree.cleanup() (returns promise for null; rarely needed)

Broccoli clears outputPath. It's OK for plugins to rmdir outputPath on rebuild and symlink it to somewhere else. It's OK for plugins to rimraf cachePath and re-mkdir it.

```js
// Use Symlinks instead of HardLinks
// Transparently follow symlinks (new behavior):
var stats = fs.statSync(somePath);
if (stats.isFile()) {
  // Could be file, or symlink pointing to file.
  ...
} else if (stats.isDirectory()) {
  // Could be directory, or symlink pointing to directory.
  ...
} else {
  throw new Error('Unexpected file type'); // socket, device, or similar
}
```

## Broccoli core devDependencies

1. [copy-dereference](https://github.com/broccolijs/node-copy-dereference)

```js
var copyDereferenceSync = require('copy-dereference').sync;
copyDereferenceSync('src_dir/some_file.txt', 'dest_dir/some_file.txt');
copyDereferenceSync('src_dir/some_dir', 'dest_dir/some_dir');
```

Copy the file or directory at srcPath to destPath.

If srcPath is a symlink, or if there is a symlink somewhere underneath the directory at srcPath, it will be dereferenced, that is, it will be replaced with the thing it points to.

File & directory last-modified times as well as file modes (permissions & executable bit) will be preserved.

2. [quick-temp](https://github.com/joliss/node-quick-temp)

Create and remove temporary directories. Smart about naming, and placing them in `./tmp` if possible. To make a temporary and assign its path to this.tmpDestDir, call either one of these:

```js
quickTemp.makeOrRemake(this, 'tmpDestDir');
// or
quickTemp.makeOrReuse(this, 'tmpDestDir');

// Removing a temporary directory, also assign `this.tmpDestDir = null`
//  If this.tmpDestDir is already null or undefined, it will be a no-op.
quickTemp.remove(this, 'tmpDestDir');
```

If this.tmpDestDir already contains a path, makeOrRemake will remove it first and then create a new directory, whereas makeOrReuse will be a no-op. Both functions also return the path of the temporary directory.

3. [promise-map-series](https://github.com/joliss/promise-map-series)

Call an iterator function for each element of an array in series, ensuring that no iterator is called before the promise returned by the previous iterator is fulfilled, in effect preventing parallel execution. Like async.mapSeries, but for promises.

```js
var mapSeries = require('promise-map-series')
mapSeries(array, iterator[, thisArg]).then(function (newArray) {
  ...
})
```

#### Extending an Existing BroccoliJs Plugin

BroccoliJs has several plugins, that are designed to be extended.

1. [broccoli-writer](https://github.com/broccolijs/broccoli-writer)
2. [broccoli-filter](https://github.com/broccolijs/broccoli-filter) a helper base class for Broccoli plugins that map input files into output files one-to-one.
3. [broccoli-caching-writer](https://github.com/ember-cli/broccoli-caching-writer)

#### Broccoli Plugins Boilerplate

Note: All BroccoliJs plugins are NodeJs modules that should be installed inside a project `npm install --save-dev broccoli-my-plugin`

```js
var brocWriter = require('broccoli-writer');

// All BroccoliJs plugins must accept an input tree as its first argument. the rest params are optional
var BroccoliMyPlugin = function BroccoliMyPlugin(inputTree, options) {
    if (!(this instanceof BroccoliMyPlugin)) {
      return new BroccoliMyPlugin();
    }
    this.inputTree = inputTree;
    // specify default options, or other instance variables
    this.options = options || {};
};

// extended the function exported by broccoli-writer using prototypical inheritance
BroccoliMyPlugin.prototype = Object.create(brocWriter.prototype);
BroccoliMyPlugin.prototype.constructor = BroccoliMyPlugin;
BroccoliMyPlugin.prototype.description = 'my-plugin';

// main functionality
// Since this plugins extends the broccoli-writer plugin, we do this by specifying a writefunction
BroccoliMyPlugin.prototype.write = function(readTree, destDir) {
  var self = this;
  // `readTree` callback returns a promise, then do it synchronously
  return readTree(this.inputTree).then(function (srcDir) {
    /* use srcDir and information from self.options to figure out which files to read from */
    /* use destDir and information from self.options to figure outwhich files to write to */
    /* synchronously read input files, do some processing, and write output files */
  });
};

modules.exports = BroccoliMyPlugin;
```

```js
var Filter = require('broccoli-filter');
...
TraceurFilter.prototype = Object.create(Filter.prototype);
...

TraceurFilter.prototype.extensions = ['es6'];
TraceurFilter.prototype.targetExtension = 'js';

TraceurFilter.prototype.processString = function (str, relativePath) {
    try {
        return traceur.compile(str, this.options, relativePath);
    } catch (errs) {
        throw errs.join('\n');
    }
};

```

In async way, since we return a promise, BroccoliJs knows to wait until it is either resolved or rejected. We can refactor this to chain the promises instead of nesting them,

```js
var rsvp= require('rsvp');

// replace the above `BroccoliMyPlugin.prototype.write` readTree callback to make it async
return readTree(this.inTree).then(function (srcDir) {
  /* use srcDir and information from self.options to figure out which files to read from */
  /* use destDir and information from self.options to figure outwhich files to write to */
  var promise = new rsvp.Promise(function(resolvePromise, rejectPromise) {
    /* asynchronously read input files, do some processing, and write output files,
       for example, here we have `someAsyncFunc` that does this` */
    someAsyncFunc(function(err, asyncData) {
      if (err) { rejectPromise(err); }
      else { resolvePromise(asyncData); }
    });
  });
  return promise;
});
```

#### Base extended plugins

1. [broccoli-filter](https://github.com/broccolijs/broccoli-filter)

Helper base class for Broccoli plugins that map input files into output files one-to-one.

```js
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var Promise = require('rsvp').Promise
var quickTemp = require('quick-temp')
var helpers = require('broccoli-kitchen-sink-helpers')
var walkSync = require('walk-sync')
var mapSeries = require('promise-map-series')

module.exports = Filter
function Filter (inputTree, options) {
  if (!inputTree) {
    throw new Error('broccoli-filter must be passed an inputTree, instead it received `undefined`');
  }
  this.inputTree = inputTree
  options = options || {}
  if (options.extensions != null) this.extensions = options.extensions
  if (options.targetExtension != null) this.targetExtension = options.targetExtension
  if (options.inputEncoding !== undefined) this.inputEncoding = options.inputEncoding
  if (options.outputEncoding !== undefined) this.outputEncoding = options.outputEncoding
}

Filter.prototype.rebuild = function () {
  var self = this
  var paths = walkSync(this.inputPath)
    return mapSeries(paths, function (relativePath) {
      if (relativePath.slice(-1) === '/') {
        mkdirp.sync(self.outputPath + '/' + relativePath)
      } else {
        if (self.canProcessFile(relativePath)) {
          return self.processAndCacheFile(self.inputPath, self.outputPath, relativePath)
        } else {
          helpers.copyPreserveSync(
            self.inputPath + '/' + relativePath, self.outputPath + '/' + relativePath)
        }
      }
    })
}

// Compatibility with Broccoli < 0.14
// See https://github.com/broccolijs/broccoli/blob/master/docs/new-rebuild-api.md
Filter.prototype.read = function (readTree) {
  var self = this

  quickTemp.makeOrRemake(this, 'outputPath')
  quickTemp.makeOrReuse(this, 'cachePath')
  this.needsCleanup = true

  return readTree(this.inputTree)
    .then(function (inputPath) {
      self.inputPath = inputPath
      return self.rebuild()
    })
    .then(function () {
      return self.outputPath
    })
}

Filter.prototype.cleanup = function () {
  if (this.needsCleanup) {
    quickTemp.remove(this, 'outputPath')
    quickTemp.remove(this, 'cachePath')
  }
}

Filter.prototype.canProcessFile = function (relativePath) {
  return this.getDestFilePath(relativePath) != null
}

Filter.prototype.getDestFilePath = function (relativePath) {
  for (var i = 0; i < this.extensions.length; i++) {
    var ext = this.extensions[i]
    if (relativePath.slice(-ext.length - 1) === '.' + ext) {
      if (this.targetExtension != null) {
        relativePath = relativePath.slice(0, -ext.length) + this.targetExtension
      }
      return relativePath
    }
  }
  return null
}

// To do: Get rid of the srcDir/destDir args because we now have inputPath/outputPath
// https://github.com/search?q=processAndCacheFile&type=Code&utf8=%E2%9C%93

Filter.prototype.processAndCacheFile = function (srcDir, destDir, relativePath) {
  var self = this

  this._cache = this._cache || {}
  this._cacheIndex = this._cacheIndex || 0
  var cacheEntry = this._cache[relativePath]
  if (cacheEntry != null && cacheEntry.hash === hash(cacheEntry.inputFiles)) {
    copyFromCache(cacheEntry)
  } else {
    return Promise.resolve()
      .then(function () {
        return self.processFile(srcDir, destDir, relativePath)
      })
      .catch(function (err) {
        // Augment for helpful error reporting
        err.broccoliInfo = err.broccoliInfo || {}
        err.broccoliInfo.file = path.join(srcDir, relativePath)
        // Compatibility
        if (err.line != null) err.broccoliInfo.firstLine = err.line
        if (err.column != null) err.broccoliInfo.firstColumn = err.column
        throw err
      })
      .then(function (cacheInfo) {
        copyToCache(cacheInfo)
      })
  }

  function hash (filePaths) {
    return filePaths.map(function (filePath) {
      return helpers.hashTree(srcDir + '/' + filePath)
    }).join(',')
  }

  function copyFromCache (cacheEntry) {
    for (var i = 0; i < cacheEntry.outputFiles.length; i++) {
      var dest = destDir + '/' + cacheEntry.outputFiles[i]
      mkdirp.sync(path.dirname(dest))
      // We may be able to link as an optimization here, because we control
      // the cache directory; we need to be 100% sure though that we don't try
      // to hardlink symlinks, as that can lead to directory hardlinks on OS X
      helpers.copyPreserveSync(
        self.cachePath + '/' + cacheEntry.cacheFiles[i], dest)
    }
  }

  function copyToCache (cacheInfo) {
    var cacheEntry = {
      inputFiles: (cacheInfo || {}).inputFiles || [relativePath],
      outputFiles: (cacheInfo || {}).outputFiles || [self.getDestFilePath(relativePath)],
      cacheFiles: []
    }
    for (var i = 0; i < cacheEntry.outputFiles.length; i++) {
      var cacheFile = (self._cacheIndex++) + ''
      cacheEntry.cacheFiles.push(cacheFile)
      helpers.copyPreserveSync(
        destDir + '/' + cacheEntry.outputFiles[i],
        self.cachePath + '/' + cacheFile)
    }
    cacheEntry.hash = hash(cacheEntry.inputFiles)
    self._cache[relativePath] = cacheEntry
  }
}

Filter.prototype.processFile = function (srcDir, destDir, relativePath) {
  var self = this
  var inputEncoding = (this.inputEncoding === undefined) ? 'utf8' : this.inputEncoding
  var outputEncoding = (this.outputEncoding === undefined) ? 'utf8' : this.outputEncoding
  var string = fs.readFileSync(srcDir + '/' + relativePath, { encoding: inputEncoding })
  return Promise.resolve(self.processString(string, relativePath))
    .then(function (outputString) {
      var outputPath = self.getDestFilePath(relativePath)
      fs.writeFileSync(destDir + '/' + outputPath, outputString, { encoding: outputEncoding })
    })
}
```
